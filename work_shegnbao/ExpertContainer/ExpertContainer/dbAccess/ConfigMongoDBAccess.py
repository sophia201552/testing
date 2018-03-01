# -*- encoding=utf-8 -*-
from uuid import int_
# from pip._vendor.pyparsing import tableName
__author__ = 'yan'

from ExpertContainer.api.LogOperator import LogOperator
import pymongo
from ExpertContainer.api.utils import *
from bson import ObjectId
from datetime import datetime
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.RedisManager import RedisManager
from ExpertContainer.api.DependAnalyst import DependAnalyst
from bson import son
import logging
from threading import Timer
import traceback
from ExpertContainer import app


class ConfigMongoDBAccess:

    _logger = LogOperator()

    def __init__(self, addr, port):
        bOk = False
        try:
            self.hostAddr = addr
            self.hostPort = port
            self.connection = None
            self.db = None
            replica_set = app.config.get('MONGO_CONFIG_REPLICA_SET')
            read_preference = app.config.get('MONGO_CONFIG_READ_PREFERENCE')
            logging.info('Connecting to config DB %s:%s/%s with replicaset=%s and readPreference=%s', addr, port, 'beopdata', replica_set, read_preference)
            if replica_set is None or read_preference is None:
                self.connection = pymongo.MongoClient(
                    host=addr, port=port, socketKeepAlive=True,
                    maxPoolSize=300, waitQueueTimeoutMS=20000)
            else:
                self.connection = pymongo.MongoClient(
                    host=addr, port=port, socketKeepAlive=True, replicaset=replica_set, readPreference=read_preference,
                    maxPoolSize=300, waitQueueTimeoutMS=20000)
            self.db = self.connection.beopdata
            bOk = self.db.authenticate('beopweb', 'RNB.beop-2013')
        except Exception as e:
            strMsg = '%s:' % (get_current_func_name()) + e.__str__()
            ConfigMongoDBAccess._logger.writeLog(strMsg, True)
        if not bOk:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + 'mongodb authenticate failed', True)

    def __del__(self):
        if self.connection:
            self.connection.close()

    def get_cloud_point_info(self, pointId):
        rt = None
        try:
            if ObjectId.is_valid(pointId):
                rt = self.db['DataSourceAdditional'].find_one({'_id':ObjectId(pointId)})
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt
    # added by 'Eric'
    def get_diagnosis_from_projects(self):
        pass


        
    def order_points(self, strObjPointName, content, projId, input_point_list, final_point_list, content_dic):
        try:
            if content:
                point_list = get_point_name_list_from_content(content)
                for name in point_list:
                    name_calc = "calcpoint_" + str(projId) + "_" + name
                    if name_calc in input_point_list:
                        content_dic[name] = self.get_content_by_name_and_projId(name, str(projId))
                        cl = get_point_name_list_from_content(content_dic[name])
                        if name in cl:
                            if app.config['LOGGING_LEVEL'] <= 0:
                                ConfigMongoDBAccess._logger.writeLog(("Error for circular reference:projId=%d,pointName=%s" % (int(projId), name)), True)
                        if strObjPointName is not None and strObjPointName != name:  # 防止循环依赖
                            self.order_points(name, content_dic[name], projId, input_point_list, final_point_list, content_dic)
                            final_point_list.append(name)
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            strE = e.__str__()
            ArchiveManager.add_error_log(projId, datetime.now(), '%s:' % (get_current_func_name()) + e.__str__(), strE[strE.rfind('=') + 1:])

    def get_calc_point_from_projects(self):
        rt = {}
        cursor = None
        try:
            prjList = RedisManager.get_project_list()
            cursor = self.db['DataSourceAdditional'].aggregate\
            (
            [
                {'$match':
                            {'type':4,
                           'params.logic':{'$exists':True},
                           'params.moduleName':{'$exists':True},
                           'params.format':{'$exists':True},
                           'params.isDelete':False,
                           'projId':{'$in':prjList}
                             }
                 },
                {'$project':
                            {'projId':1,
                             'format':'$params.format',
                             'content':'$params.logic',
                             'name':'$params.moduleName'}
                            },
                {'$group':
                            {'_id':'$projId',
                           'info':{'$push':
                                       {'format':"$format",
                                        'content':'$content',
                                        'name':'$name'}
                                   }
                           }
                 }
            ]
            )
            if cursor:
                for item in cursor:
                    id = item.get('_id')
                    info = item.get('info')
                    id_content = rt.get(id)
                    if not id_content:
                        format_content = []
                        id_content = {'m5':format_content}
                        rt.update({id:id_content})
                    # for i in info:
                    #     format = i.get('format')
                    #     content = i.get('content')
                    #     name = i.get('name')
                    #     if format and content and name:
                    #         if name.startswith('calcpoint_'):
                    #             format_content = id_content.get(format)
                    #             if not format_content:
                    #                 format_content = []
                    #                 id_content.update({format:format_content})#定死m5了
                    #             format_content.append({'name':name, 'content':content})
                    for i in info:
                        content = i.get('content')
                        name = i.get('name')
                        format_content.append({'name': name, 'content': content})
                del_key_arr = []
                for k, v in rt.items():
                    if not v:
                        del_key_arr.append(k)
                for key in del_key_arr:
                    rt.pop(key)
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_one_project_calc_point_from_projects(self, project_id):
        rt = {}
        cursor = None
        try:
            prjList = RedisManager.get_project_list()
            if project_id in prjList:
                cursor = self.db['DataSourceAdditional'].aggregate\
                (
                [
                    {'$match':
                                {'type':4,
                               'params.logic':{'$exists':True},
                               'params.moduleName':{'$exists':True},
                               'params.format':{'$exists':True},
                               'params.isDelete':False,
                               'projId':project_id
                                 }
                     },
                    {'$project':
                                {'projId':1,
                                 'format':'$params.format',
                                 'content':'$params.logic',
                                 'name':'$params.moduleName'}
                                },
                    {'$group':
                                {'_id':'$projId',
                               'info':{'$push':
                                           {'format':"$format",
                                            'content':'$content',
                                            'name':'$name'}
                                       }
                               }
                     }
                ]
                )
                if cursor:
                    for item in cursor:
                        id = item.get('_id')
                        info = item.get('info')
                        id_content = rt.get(id)
                        if not id_content:
                            format_content = []
                            id_content = {'m5': format_content}
                            rt.update({id: id_content})
                        # for i in info:
                        #     format = i.get('format')
                        #     content = i.get('content')
                        #     name = i.get('name')
                        #     if format and content and name:
                        #         if name.startswith('calcpoint_'):
                        #             format_content = id_content.get(format)
                        #             if not format_content:
                        #                 format_content = []
                        #                 id_content.update({format:format_content})#定死m5了
                        #             format_content.append({'name':name, 'content':content})
                        for i in info:
                            content = i.get('content')
                            name = i.get('name')
                            format_content.append({'name': name, 'content': content})
                    del_key_arr = []
                    for k, v in rt.items():
                        if not v:
                            del_key_arr.append(k)
                    for key in del_key_arr:
                        rt.pop(key)
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_diagnosis_point_from_projects(self):
        rt = {}
        cursor = None
        try:
            prjList = RedisManager.get_project_list()
            cursor = self.db['cloudDiagnosis'].aggregate\
            (
            [
                {'$match':
                            {
                           'logic':{'$exists':True},
                           'isDelete':False,
                           'projId':{'$in':prjList}
                             }
                 },
                {'$project':
                            {'projId':1,
                             'format':1,
                             'diagName':1,
                             'classifyName':1,
                             'equipmentName':1,
                             'content':'$logic',
                             'isDelete':1,
                             'faultDescription':1,
                             'name':'$moduleName'}
                            },
                {'$group':
                            {'_id':'$projId',
                           'info':{'$push':
                                       {'format':"$format",
                                        'content':'$content',
                                        'name':'$name',
                                        'diagName':'$diagName',
                                        'classifyName':'$classifyName',
                                        'equipmentName':'$equipmentName',
                                        'faultDescription':'$faultDescription'
                                        }
                                   }
                           }
                 }
            ]
            )
            # if cursor:
            #     for item in cursor:
            #         id = item.get('_id')
            #         info = item.get('info')
            #         id_content = rt.get(id)
            #         if not id_content:
            #             id_content = {}
            #             rt.update({id:id_content})
            #         for i in info:
            #             format = i.get('format')
            #             content = i.get('content')
            #             name = i.get('name')
            #             diagName = i.get('diagName')
            #             classifyName = i.get('classifyName')
            #             equipmentName = i.get('equipmentName')
            #             faultDescription = i.get('faultDescription')
            #             format_content = id_content.get(format)
            #             if not format_content:
            #                 format_content = []
            #                 id_content.update({format:format_content})
            #             format_content.append({'name':name, 'content':content, 'diagName':diagName,
            #                 'classifyName':classifyName, 'equipmentName':equipmentName, 'faultDescription':faultDescription})
            if cursor:
                for item in cursor:
                    id = item.get('_id')
                    info = item.get('info')
                    id_content = rt.get(id)
                    if not id_content:
                        format_content = []
                        id_content = {'m5': format_content}
                        rt.update({id: id_content})
                    for i in info:
                        content = i.get('content')
                        name = i.get('name')
                        diagName = i.get('diagName')
                        classifyName = i.get('classifyName')
                        equipmentName = i.get('equipmentName')
                        faultDescription = i.get('faultDescription')
                        format_content.append({'name':name, 'content':content, 'diagName':diagName,
                        'classifyName':classifyName, 'equipmentName':equipmentName, 'faultDescription':faultDescription})
                del_key_arr = []
                for k, v in rt.items():
                    if not v:
                        del_key_arr.append(k)
                for key in del_key_arr:
                    rt.pop(key)
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_diagnosis_point_by_id(self, projId):
        rt = {}
        cursor = None
        projId = int(projId)
        try:
            prjList = RedisManager.get_project_list()
            if projId in prjList:
                cursor = self.db['cloudDiagnosis'].aggregate\
                (
                [
                    {'$match':
                                {
                               'logic':{'$exists':True},
                               'isDelete':False,
                               'projId':projId
                                 }
                     },
                    {'$project':
                                {'projId':1,
                                 'format':1,
                                 'diagName':1,
                                 'classifyName':1,
                                 'equipmentName':1,
                                 'content':'$logic',
                                 'isDelete':1,
                                 'faultDescription':1,
                                 'name':'$moduleName'}
                                },
                    {'$group':
                                {'_id':'$projId',
                               'info':{'$push':
                                           {'format':"$format",
                                            'content':'$content',
                                            'name':'$name',
                                            'diagName':'$diagName',
                                            'classifyName':'$classifyName',
                                            'equipmentName':'$equipmentName',
                                            'faultDescription':'$faultDescription'
                                            }
                                       }
                               }
                     }
                ]
                )
                # if cursor:
                #     for item in cursor:
                #         id = item.get('_id')
                #         info = item.get('info')
                #         id_content = rt.get(id)
                #         if not id_content:
                #             id_content = {}
                #             rt.update({id:id_content})
                #         for i in info:
                #             format = i.get('format')
                #             content = i.get('content')
                #             name = i.get('name')
                #             diagName = i.get('diagName')
                #             classifyName = i.get('classifyName')
                #             equipmentName = i.get('equipmentName')
                #             faultDescription = i.get('faultDescription')
                #             format_content = id_content.get(format)
                #             if not format_content:
                #                 format_content = []
                #                 id_content.update({format:format_content})
                #             format_content.append({'name':name, 'content':content, 'diagName':diagName,
                #                 'classifyName':classifyName, 'equipmentName':equipmentName, 'faultDescription':faultDescription})
                if cursor:
                    for item in cursor:
                        id = item.get('_id')
                        info = item.get('info')
                        id_content = rt.get(id)
                        if not id_content:
                            format_content = []
                            id_content = {'m5': format_content}
                            rt.update({id: id_content})
                        for i in info:
                            content = i.get('content')
                            name = i.get('name')
                            diagName = i.get('diagName')
                            classifyName = i.get('classifyName')
                            equipmentName = i.get('equipmentName')
                            faultDescription = i.get('faultDescription')
                            format_content.append({'name': name, 'content': content, 'diagName': diagName,
                                                   'classifyName': classifyName, 'equipmentName': equipmentName,
                                                   'faultDescription': faultDescription})
                    del_key_arr = []
                    for k, v in rt.items():
                        if not v:
                            del_key_arr.append(k)
                    for key in del_key_arr:
                        rt.pop(key)
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_distinct_projects(self):
        rt_list = []
        try:
            rt = self.db['DataSourceAdditional'].find({'type':4, 'params.logic':{'$exists':True},
                        'params.moduleName':{'$exists':True}, 'params.format':{'$exists':True}}).distinct('projId')
            rt = [int(x) for x in rt] if rt else []
            # merge projId
            ret = self.db['cloudDiagnosis'].find({}).distinct('projId')
            rt.extend([int(x) for x in ret] if ret else [])
            rt = list(set(rt))
            prjList = RedisManager.get_project_list()
            for id in rt:
                if id in prjList:
                    rt_list.append(id)
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt_list

    def get_content_by_name_and_projId(self, point_name, project_id):
        rt = ""
        try:
            ret = self.db['DataSourceAdditional'].find_one(
                {'type': 4, 'value': point_name, 'projId': {'$in': [str(project_id), int(project_id)]},
                 "groupId": {'$in': [None, '']}})
            if ret:
                rt = ret.get('params', {}).get('logic', "")
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt
    
    def get_alias_by_name_and_projId(self, point_name, project_id):
        rt = ""
        try:
            ret = self.db['DataSourceAdditional'].find_one({'type':4, 'value':point_name, 'projId':{'$in':[str(project_id), int(project_id)]}})
            if ret:
                rt = ret.get('alias', {})
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    def get_point_name_list(self, project_id):
        rt = []
        try:
            query_result = self.get_one_project_calc_point_from_projects(project_id)
            if not query_result:
                return []
            for projId in query_result:
                if int(project_id) == int(projId):
                    info = query_result.get(projId)
                    for format in info:
                        rt.extend([x.get('name') for x in info.get(format)])
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    def make_calcpoint_py_file(self, timeformat, projId=0):
        rt = False, ""
        try:
            query_result = {}
            if projId != 0:
                query_result = self.get_one_project_calc_point_from_projects(projId)
            else:
                query_result = self.get_calc_point_from_projects()
            if not query_result:
                return False
            for projId in query_result:
                if isinstance(projId, str):
                    continue
                project_id = int(projId)
                info = query_result.get(projId)
                for format in info:
                    if timeformat == format:
                        rely_dict = {}
                        module_name_list = [x.get('name') for x in info.get(format)]
                        file_name = "calcpoint_" + str(project_id) + ".py"
                        path = get_calcpoint_path(format)
                        full_path = path + "/" + file_name
                        add_head(full_path, project_id)
                        arr = info.get(format, [])
                        for item in arr:
                            content = item.get('content')
                            point_name = item.get('name')
                            if "calcpoint_" in point_name:
                                point_name = point_name.replace("calcpoint_", "")
                            final_point_list = []
                            self.order_points_calc(content, projId, arr, module_name_list, final_point_list)
                            point_name = point_name[point_name.find("_") + 1:]
                            rely_dict[point_name] = final_point_list
                            add_body(full_path, project_id, content, point_name)
                        depAna = DependAnalyst(rely_dict)
                        add_action2(full_path, project_id, depAna.analysis(), rely_dict)
            rt = True
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    def make_diagnosis_py_file(self, timeformat):
        rt = False, ""
        try:
            query_result = self.get_diagnosis_point_from_projects()
            if not query_result:
                return False
            for projId in query_result:
                project_id = int(projId)
                info = query_result.get(projId)
                for format in info:
                    if timeformat == format:
                        rely_dict = {}
                        # module_name_list = [x.get('name') for x in info.get(format)]
                        file_name = "diagnosis_" + str(projId) + ".py"
                        path = get_diagnosis_path(format)
                        full_path = path + "/" + file_name
                        add_head(full_path, project_id)
                        arr = info.get(format, [])
                        for item in arr:
                            content = item.get('content')
                            point_name = item.get('name')
                            final_point_list = []
                            # order_points(content, projId, arr, module_name_list, final_point_list)
                            # point_name = point_name[point_name.find("_")+1:]
                            # if point_name in final_point_list:
                            #    ConfigMongoDBAccess._logger.writeLog('make_calcpoint_py_file failed:'+"circular reference", True)
                            rely_dict[point_name] = final_point_list
                            add_body(full_path, project_id, content, point_name)
                        depAna = DependAnalyst(rely_dict)
                        add_action_diagnosis2(full_path, project_id, depAna.analysis(), rely_dict)
            rt = True
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    def make_onlinetest_py_file(self, content, project_id, point_name):
        rt = False, ""
        try:
            rely_dict = {}
            content_dic = {point_name:content}
            file_name = "calcpoint_" + str(project_id) + "_%s.py" % (point_name)
            path = get_onlinetest_path()
            full_path = path + "/" + file_name
            input_point_list = self.get_point_name_list(project_id)
            final_point_list = []

            self.order_points(point_name, content, project_id, input_point_list, final_point_list, content_dic)
            add_head(full_path, project_id)
            rely_dict[point_name] = final_point_list
            for key in content_dic:
                if key == point_name:
                    code_of_key = content
                else:
                    code_of_key = content_dic.get(key)
                if len(code_of_key) == 0:
                    continue

                add_body_onlinetest(full_path, project_id, code_of_key , key)
            depAna = DependAnalyst(rely_dict)
            add_action_onlinetest2(full_path, project_id, depAna.analysis(), rely_dict, point_name)
            rt = True, ""
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            rt = False, e.__str__()
        return rt

    def make_diagnosistest_py_file(self, moduleName, content, projId):
        rt = False, ""
        try:
            rely_dict = {}
            file_name = "diagnosistest_" + str(projId) + "_%s" % (moduleName,) + ".py"
            path = get_diagnosistest_path()
            full_path = path + "/" + file_name
            add_head(full_path, int(projId))
            point_name = moduleName
            add_body(full_path, projId, content, point_name)
            rely_dict[point_name] = []
            depAna = DependAnalyst(rely_dict)
            add_action_diagnosis2(full_path, projId, depAna.analysis(), rely_dict)
            rt = True, ""
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            rt = False, e.__str__()
        return rt

    def make_repairhistory_py_file(self, dic, project_id, str_obid):
        rt = False, "", ""
        try:
            rely_dict = {}

            if str_obid is None:
                rt = False, "calcObjectId is None, quit calculation", str_obid
                return rt

            file_name = "calcpoint_" + str(project_id) + "_%s.py" % (str_obid)
            path = get_repairhistory_path()
            full_path = path + "/" + file_name
            input_point_list = self.get_point_name_list(project_id)
            add_head_repairhistory(full_path, project_id)
            for name in dic:
                content_dic = {name:dic.get(name)}
                final_point_list = []
                self.order_points(name, dic.get(name), project_id, input_point_list, final_point_list, content_dic)
                rely_dict[name] = final_point_list
                for key in content_dic:
                    add_body(full_path, project_id, content_dic.get(key), key)
            depAna = DependAnalyst(rely_dict)
            add_action_repairhistory_batch(full_path, str_obid, project_id, depAna.analysis(), rely_dict)
            rt = True, "", str_obid
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    def get_content_by_name_list(self, name_list, project_id):
        rt = {}
        cursor = None
        try:
            cursor = self.db['DataSourceAdditional'].find({'type':4, 'value':{'$in':name_list}, 'projId':{'$in':[str(project_id), int(project_id)]}, 'params.logic':{'$exists':True}})
            for item in cursor:
                rt[item.get('value')] = item.get('params').get('logic')
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return rt
    

    def get_page_id_by_name(self, project_id, name):
        rt = []
        cursor = None
        try:
            nav = self.db['CustomNav_copy'].find_one({'projectId': int(project_id) })
            if nav:
                ids = nav.get('list', [])
                query = {'_id': {'$in': ids}}
                if name != '':
                    query['text'] = name
                cursor = self.db['CustomNavItem_copy'].find(query, {'_id': 1})
                for item in cursor:
                    rt.append(str(item.get('_id')))
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return rt[0] if rt else None
    
    def order_points_calc(self, content, projId, db_content, input_point_list, final_point_list, strObjPointName):
        try:
            if content:
                if db_content:
                    point_list = get_point_name_list_from_content(content)
                    for name in point_list:
                        name_calc = "calcpoint_" + str(projId) + "_" + name
                        if name_calc in input_point_list:
                            c = get_content_from_db(name_calc, db_content)
                            cl = get_point_name_list_from_content(c)
                            if name in cl:
                                if app.config['LOGGING_LEVEL'] <= 0:
                                    ConfigMongoDBAccess._logger.writeLog("circular reference:projId=%s,pointName=%s" % (projId, name), True)
                            if strObjPointName is not None and strObjPointName != name_calc:  # 防止循环依赖
                                self.order_points_calc(c, projId, db_content, input_point_list, final_point_list, name_calc)
                                final_point_list.append(name)
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            strE = e.__str__()
            ArchiveManager.add_error_log(projId, datetime.now(), '%s:' % (get_current_func_name()) + e.__str__(), strE[strE.rfind('=') + 1:])

    def order_points_diagnosis(self, content, projId, db_content, input_point_list, final_point_list):
        try:
            if content:
                if db_content:
                    point_list = get_point_name_list_from_content(content)
                    for name in point_list:
                        if name in input_point_list:
                            c = get_content_from_db(name, db_content)
                            cl = get_point_name_list_from_content(c)
                            if name in cl:
                                if app.config['LOGGING_LEVEL'] <= 0:
                                    ConfigMongoDBAccess._logger.writeLog(("Error for circular reference:projId=%d,pointName=%s" % (int(projId), name)), True)
                            self.order_points_diagnosis(c, projId, db_content, input_point_list, final_point_list)
                            final_point_list.append(name)
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            strE = e.__str__()
            ArchiveManager.add_error_log(projId, datetime.now(), '%s:' % (get_current_func_name()) + e.__str__(), strE[strE.rfind('=') + 1:])

    def get_point_list_by_project_id(self, projId):
        rt = []
        try:
            rt = self.db['DataSourceAdditional'].find({'type':4, 'projId':{'$in':[str(projId), int(projId)]}, 'params.logic':{'$exists':True}}).distinct('value')
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    def get_rely_info_by_pointlist(self, projId, pointNameList):
        rvAllDic = {}
        try:
            query_result = self.get_one_project_calc_point_from_projects(projId)
            if query_result:
                for pp in query_result:
                    if isinstance(pp, str):
                        continue
                    if int(pp) != int(projId):
                        continue

                    info = query_result.get(pp)
                    for format in info:
                        if format == 'm5':
                            module_name_list = [x.get('name') for x in info.get(format)]
                            arr = info.get(format, [])
                            allCalculationInfo = {}
                            for item in arr:
                                content = item.get('content')
                                point_name = item.get('name')
                                point_name = point_name[point_name.find('_', len('calcpoint_')) + 1:]
                                allCalculationInfo[point_name] = content

                            dependSitePoints = []
                            dependCalPoints = []
                            if pointNameList is None:
                                pointNameList = allCalculationInfo.keys()

                    for needpt in pointNameList:
                        self.depend_points_calc(allCalculationInfo, projId, needpt, dependSitePoints, dependCalPoints)
                    nopeat_dependSitePoints = list(set(dependSitePoints))
                    nopeat_dependCalPoints = list(set(dependCalPoints))
                    rt = dict(flag0=nopeat_dependSitePoints, flag2=nopeat_dependCalPoints)
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    def get_rely_info(self, projId, name, tempContent=None):
        rt = {}
        try:
            query_result = self.get_one_project_calc_point_from_projects(projId)
            if query_result:
                for projId in query_result:
                    if isinstance(projId, str):
                        continue
                    info = query_result.get(projId)
                    for format in info:
                        if format == 'm5':
                            module_name_list = [x.get('name') for x in info.get(format)]
                            arr = info.get(format, [])
                            allCalculationInfo = {}
                            for item in arr:
                                content = item.get('content')
                                point_name = item.get('name')
                                point_name = point_name[point_name.find('_', len('calcpoint_')) + 1:]
                                allCalculationInfo[point_name] = content

                    if tempContent is not None:  # 可能是测试计算点的代码，所以并不在mongodb里读取
                        allCalculationInfo[name] = tempContent
                    dependSitePoints = []
                    dependCalPoints = []
                    self.depend_points_calc(allCalculationInfo, projId, name, dependSitePoints, dependCalPoints)
                    nopeat_dependSitePoints = list(set(dependSitePoints))
                    nopeat_dependCalPoints = list(set(dependCalPoints))
                    rt = dict(flag0=nopeat_dependSitePoints, flag2=nopeat_dependCalPoints)
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    def make_calcpoint_py_file_for_output(self, timeformat, projId=0):
        rt = False
        try:
            query_result = {}
            if projId != 0:
                query_result = self.get_one_project_calc_point_from_projects(projId)
            else:
                query_result = self.get_calc_point_from_projects()
            if not query_result:
                return False
            for projId in query_result:
                if isinstance(projId, str):
                    continue
                project_id = int(projId)
                info = query_result.get(projId)
                for format in info:
                    if timeformat == format:
                        rely_dict = {}
                        module_name_list = [x.get('name') for x in info.get(format)]
                        file_name = "calcpoint_" + str(project_id) + ".py"
                        path = get_calcpoint_output_path()
                        full_path = path + "/" + file_name
                        add_head(full_path, project_id)
                        arr = info.get(format, [])
                        for item in arr:
                            final_point_list = []
                            content = item.get('content')
                            point_name = item.get('name')
                            self.order_points_calc(content, projId, arr, module_name_list, final_point_list, point_name)
                            if "calcpoint_" in point_name:
                                point_name = point_name.replace("calcpoint_", "")
                            point_name = point_name[point_name.find("_") + 1:]
                            rely_dict[point_name] = final_point_list
                            add_body(full_path, project_id, content, point_name)
                        depAna = DependAnalyst(rely_dict)
                        add_action_output2(full_path, project_id, depAna.analysis(), rely_dict)
                        rt = True
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    def depend_points_calc(self, allCalInfo, projId, pointName, dependSitePointsList, dependCalculationPointsList):

        try:
            content = allCalInfo.get(pointName)
            if content is not None and len(content) > 0:
                point_list = get_point_name_list_from_content(content)
                for name in point_list:
                    if name:
                        if name in allCalInfo.keys():
                            if name not in dependCalculationPointsList:
                                dependCalculationPointsList.append(name)
                                self.depend_points_calc(allCalInfo, projId, name, dependSitePointsList, dependCalculationPointsList)
                        else:
                            dependSitePointsList.append(name)
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            strE = e.__str__()
            ArchiveManager.add_error_log(projId, datetime.now(), '%s:' % (get_current_func_name()) + e.__str__(), strE[strE.rfind('=') + 1:])
        return True

    def get_diagnosis_module_name_list(self, projId):
        rt = []
        try:
            rt = self.db['cloudDiagnosis'].find({'projId': projId}).distinct('moduleName')
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            strE = e.__str__()
            ArchiveManager.add_error_log(projId, datetime.now(), '%s:' % (get_current_func_name()) + e.__str__(), strE[strE.rfind('=') + 1:])
        return rt
    
    def get_diagnosis_module_logic(self, obid):
        rt = ''
        try:
            cursor = self.db['cloudDiagnosis'].find_one({'_id': ObjectId(obid)})
            rt = cursor.get('logic')
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt


    def getCloudPointSiteType(self, projId):
        rt = {}
        try:
            if isinstance(projId, str):
                projId = int(projId)
            query = {'projId': projId, 'type': 4}
            query['params.flag'] = 0
            query_order = [('_id', -1)]
            cursor = self.db['DataSourceAdditional'].find(query, projection={'groupId': False, 'type': False}, sort=query_order)
            result = []
            for item in cursor:
                ptCloudName = item.get('value')
                if ptCloudName is None or len(ptCloudName) == 0:
                    continue
                if item.get('params') is None:
                    continue
                if item.get('params').get('mapping') is None:
                    continue
                siteName = item.get('params').get('mapping').get('point')
                if siteName is None or len(siteName) == 0:
                    continue

                rt[ptCloudName] = siteName
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            strE = e.__str__()
            ArchiveManager.add_error_log(projId, datetime.now(), '%s:' % (get_current_func_name()) + e.__str__(), strE[strE.rfind('=') + 1:])
        return rt

    def get_data_manage_setting(self):
        try:
            rt = []
            cursor = self.db['DataManageSetting'].find()
            for item in cursor:
                rt.append(item)
            return rt
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            return None
    
    def get_alarm_data_config(self, projId):
        try:
            rt_type1 = []
            rt_type2 = []
            query = {'projectId': projId, 'beused':1, 'point':{'$exists':True}}
            cursor = self.db['Alarm_moudle'].find(query)
            for item in cursor:
                item_temp = {}
                if item.get('isSilent'):
                    item_temp.update({'silentTime_s':item.get('silentTime').get('startTime')
                                      ,'silentTime_e':item.get('silentTime').get('endTime')
                                      ,'isSilent':1})
                if item.get('interval'):
                    item_temp.update({'interval':item.get('interval')})
                if item.get('duration'):
                    item_temp.update({'duration':item.get('duration')})
                if item.get('type') == 1:
                    item_temp.update({'point':item.get('point')
                                      , 'value_temp':1
                                      , 'alarm_id':str(item.get('_id'))})
                    rt_type1.append(item_temp)
                if item.get('type') == 2:
                    item_temp.update({'point':item.get('point'), 'alarm_id':str(item.get('_id'))})
                    highhigh = item.get('threshold').get('highhigh')
                    high = item.get('threshold').get('high')
                    low = item.get('threshold').get('low')
                    lowlow = item.get('threshold').get('lowlow')
                    if highhigh is not None:
                        if highhigh.get('type'):
                            item_temp.update({'value_higher':highhigh.get('value')
                                              ,'type_higher':highhigh.get('type')})
                            if highhigh.get('msg'):
                                item_temp.update({'msg_higher':highhigh.get('msg')})
                            if highhigh.get('grade'):
                                item_temp.update({'grade_higher':highhigh.get('grade')})
                            if highhigh.get('advice'):
                                item_temp.update({'advice_higher':highhigh.get('advice')})
                    if high is not None:
                        if high.get('type'):
                            item_temp.update({'value_high':high.get('value')
                                              ,'type_high':high.get('type')})
                            if high.get('msg'):
                                item_temp.update({'msg_high':high.get('msg')})
                            if high.get('grade'):
                                item_temp.update({'grade_high':high.get('grade')})
                            if high.get('advice'):
                                item_temp.update({'advice_high':high.get('advice')})
                    if low is not None:
                        if low.get('type'):
                            item_temp.update({'value_low':low.get('value')
                                              ,'type_low':low.get('type')})
                            if low.get('msg'):
                                item_temp.update({'msg_low':low.get('msg')})
                            if low.get('grade'):
                                item_temp.update({'grade_low':low.get('grade')})
                            if low.get('advice'):
                                item_temp.update({'advice_low':low.get('advice')})
                    if lowlow is not None:
                        if lowlow.get('type'):
                            item_temp.update({'value_lower':lowlow.get('value'),'type_lower':lowlow.get('type')})
                            if lowlow.get('msg'):
                                item_temp.update({'msg_lower':lowlow.get('msg')})
                            if lowlow.get('grade'):
                                item_temp.update({'grade_lower':lowlow.get('grade')})
                            if lowlow.get('advice'):
                                item_temp.update({'advice_lower':lowlow.get('advice')})
                    rt_type2.append(item_temp)
            return rt_type1, rt_type2
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            return None, None
    
    def get_alarm_send_info(self, projId, alarmId_list):
        try:
            rt = {}
            idlist = [ObjectId(item) for item in alarmId_list]
            query = {'_id':{'$in':idlist}, 'projectId':projId, 'beused':1, 'point':{'$exists':True}}
            cursor = self.db['Alarm_moudle'].find(query)
            for item in cursor:
                if item.get('notify'):
                    userIdList_mail = []
                    userIdList_app = []
                    userIdList_sms = []
                    userIdList_web = []
                    userMailName = []
                    for send_entity in item.get('notify'):
                        user_id = send_entity.get('userId')
                        if user_id:
                            if send_entity.get('isEmail'):
                                userIdList_mail.append(user_id)
                                userMailName.append(str(send_entity.get('useremail')))
                            if send_entity.get('isApp'):
                                userIdList_app.append(user_id)
                            if send_entity.get('isSMS'):
                                userIdList_sms.append(user_id)
                            if send_entity.get('isWebSite'):
                                userIdList_web.append(user_id)
                    rt[item.get('point')] = {'mail':userIdList_mail, 'app':userIdList_app
                                           , 'sms':userIdList_sms, 'website':userIdList_web
                                           , 'mailName':userMailName}
            return rt
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            return None
        
    def saveSysMsgSentUserData(self,  projId, uidOrName, nMsgType,  nMsgWayType, strName,dictContent,  actTime ,strLog):
        # nMsgType:
        result = False
        try:
            dbNameMongo = 'msg_sent_user'
            self.db[dbNameMongo].insert({'pid': int(projId), 'user':uidOrName, 'type':nMsgType, 'way': nMsgWayType, 'log':strLog, 'name':strName, 'content':dictContent, 'atime': actTime  })
            self.db[dbNameMongo].create_index([('pid', pymongo.ASCENDING), ('uid', pymongo.ASCENDING)])
            result = True
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('saveHistoryData error:' + e.__str__(), True)
        return result

    def getLastSysMsgSentUserTime(self, projId, uidOrName, nMsgType, nMsgWayType, strName):
        rt = None
        try:
            dbNameMongo = 'msg_sent_user'
            cursor = self.db[dbNameMongo].find({'name':strName, 'type':nMsgType, 'way': nMsgWayType, 'pid': projId, 'user':uidOrName}).sort([('atime', pymongo.DESCENDING)]).limit(1)
            for item in cursor:
                rt = item.get('atime')
                break
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('saveHistoryData error:' + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return rt        


    def findSubString(self, apiPosList, parentString, sonString, pos=0):
        p = parentString.find(sonString, pos)
        if p != -1:
            # 获取api下一个字符
            apiNameNext = parentString[p+len(sonString)]
            # 如果是'_',' '则不替换，如果api结束的话, 标志应该是"'"
            if apiNameNext == '(':
                apiPosList.append(p + 1)
            return self.findSubString(apiPosList, parentString, sonString, p+len(sonString))
        else:
            return apiPosList


    def find_calc_api_and_rename(self, apiName, newName):
        rt = []
        # 最终结果
        lastRt = []
        cursor = None
        try:
            dbNameMongo = 'DataSourceAdditional'
            # 获取所有项目里包含apiName的数据
            cursor = self.db[dbNameMongo].find(
                {'params.logic':{'$regex': apiName}, 'params.isDelete': False}).sort(
                [('projId', pymongo.ASCENDING)])
            for item in cursor:
                _id = item.get('_id')
                params = item.get('params')
                code = params.get('logic')
                value = item.get('value')
                projId = item.get('projId')
                code = code.split('\n')
                newLines, pos = [], []
                apiPos = {}
                count = 0
                for index, line in enumerate(code):
                    tempLine = []
                    # 找到apiName再替换
                    tempLine = self.findSubString(tempLine, line, apiName)
                    if tempLine:
                        apiPos.update({index: tempLine})
                    line = line.replace(apiName, newName)
                    count += len(tempLine)
                    newLines.append(line)
                code = '\n'.join(newLines)
                if count:
                    rt.append(
                            {
                                '_id': _id,
                                'code': code,
                                'count': count,
                                'projId': projId,
                                'apiPos': apiPos,
                                'name': value
                        }
                    )



            # 更新文档
            for x in rt:
                result = self.db[dbNameMongo].update_one({'_id': x.get('_id')}, {'$set': {'params.logic': x.get('code')}})
                status = True if result.raw_result.get('ok') else False
                lastRt.append({
                        '_id': x.get('_id').__str__(),
                        'status': status,
                        'editNum': x.get('count'),
                        'apiPos': x.get('apiPos'),
                        'name': x.get('name'),
                        'projId': x.get('projId')

                    }
                )
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('find_api_in_calc_module error:' + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return lastRt


    def find_api_in_calc_module(self, projectIdList, apiName):
        rt = []
        cursor = None
        try:
            projList = [int(p) for p in projectIdList]
            dbNameMongo = 'DataSourceAdditional'
            cursor = self.db[dbNameMongo].find(
                {'params.logic': {'$regex': apiName}, 'params.isDelete': False, 'projId': {'$in': projList},
                 'params.flag': 2}).sort([('projId', pymongo.ASCENDING)])
            for item in cursor:
                params = item.get('params')
                code = params.get('logic')
                code = code.split('\n')
                codeList = []
                codeLine = []
                for index, line in enumerate(code):
                    if apiName in line:
                        codeList.append(line)
                        codeLine.append(index + 1)
                if codeList:
                    rt.append(dict(
                        projId=item.get('projId'),
                        moduleName=params.get('moduleName'),
                        code=codeList,
                        codeLine=codeLine
                    )
                    )
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('find_api_in_calc_module error:' + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return rt


    def find_api_in_diagnosis_module(self, projectIdList, apiName):
        rt = []
        cursor = None
        try:
            projList = [int(p) for p in projectIdList]
            dbNameMongo = 'cloudDiagnosis'
            cursor = self.db[dbNameMongo].find(
                {'logic': {'$regex': apiName}, 'projId': {'$in': projList}, 'isDelete': False}).sort(
                [('projId', pymongo.ASCENDING)])
            for item in cursor:
                code = item.get('logic')
                code = code.split('\n')
                codeList = []
                codeLine = []
                for index, line in enumerate(code):
                    if apiName in line:
                        codeList.append(line)
                        codeLine.append(index + 1)
                if codeList:
                    rt.append(dict(
                        projId=item.get('projId'),
                        moduleName=item.get('moduleName'),
                        code=codeList,
                        codeLine=codeLine
                    )
                    )
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('find_api_in_diagnosis_module error:' + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_data_task_all(self):
        rt = []
        try:
            cursor = self.db['DataTaskConfig'].find()
            rt = list(cursor)
        except Exception as e:
            ConfigMongoDBAccess._logger.writeLog('get_data_task_all error:' + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return rt

    def generate_calcpoint(self, projId, generate_list):
        rt = False
        """
        generate_list:待生成计算点的信息的列表，每个项的结构如下：
        {'name':string, 'content':string, 'alias': string}
        该函数将列表中的每一项都生成“DataSourceAdditional”表对应的一条记录，如果name字段已经存在了，则跳过。
        projId对应projId， name对应value（alias与value一致），content对应params.logic，其他的字段根据实际情况来赋值
        :param generate_list: 
        :return: 成功返回True，否则False
        """
        try:
            # yan edit
            name_list = [x.get('name') for x in generate_list]
            exist_list = self.db['DataSourceAdditional'].find(
                {'value': {'$in': name_list}, 'projId': projId}).distinct('value')
            insert_list = list(set(name_list) - set(exist_list))
            insert_data = []
            now_time = datetime.now()
            for item in generate_list:
                if item.get('name') in insert_list:
                    insert_data.append(son.SON(data={'_id': ObjectId(),
                                                     'modify_time': now_time.strftime('%Y-%m-%d %H:%M:%S'),
                                                     'groupId': '',
                                                     'params': {
                                                         'logic': item.get('content'),
                                                         'moduleName': 'calcpoint_' + str(projId) + '_' + item.get('name'),
                                                         'flag': 2,
                                                         'isDelete': False,
                                                         'format': 'm5'
                                                     },
                                                     'type': 4,
                                                     'note': '',
                                                     'projId': projId,
                                                     'create_by': 1,
                                                     'alias': item.get('alias'),
                                                     'modify_by': 1,
                                                     'value': item.get('name'),
                                                     'create_time': now_time.strftime('%Y-%m-%d %H:%M:%S')
                                                     }))
            result = self.db['DataSourceAdditional'].insert(insert_data)
            if len(insert_data) == len(result):
                rt = True
        except Exception as e:
            print(e)
        return rt

