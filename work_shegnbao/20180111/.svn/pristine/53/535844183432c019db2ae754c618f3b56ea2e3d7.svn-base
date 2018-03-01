__author__ = 'win7'

from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
from beopWeb import app
from beopWeb.BEOPMySqlDBContainer import *
from beopWeb.BEOPMySqlDBReadOnlyContainer import *
from beopWeb.mod_oss.ossapi import *

class Management:
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'management'
    db = BEOPMySqlDBContainer()
    db_read = BEOPMySqlDBReadOnlyContainer()

    def get_management_project_list(self,id_list):
        sql = 'SELECT id,name_cn,name_en, pic,latlng,management FROM project WHERE management in (%s)'%(','.join(map(str,id_list)))
        rv = Management.db_read.op_db_query(Management.db_name, sql, ())
        rt = {}
        keys = ('id','name_cn','name_en', 'pic','latlng','management')
        for item in rv:
            if isinstance(rt.get(item[4]),list):
                rt[item[4]].append({key:value for key, value in zip(keys,item)})
            else:
                rt[item[4]] = [{key:value for key, value in zip(keys,item)}]
        return rt

    @staticmethod
    def get_management_list(user_id,projects):
        '''
        获取所有集团项目列表
        '''
        management_dict = {}
        for item in projects:
            if item.get('management'):
                if item.get('management') in management_dict:
                    management_dict[item.get('management')].append(item)
                else:
                    management_dict[item.get('management')] = [item]
        id_list = [str(key) for key in management_dict]
        if len(id_list) == 0:
            return []
        sql = 'SELECT id, name_cn, name_en, code_name, phone FROM %s WHERE id in (%s)'%(Management.table_name,','.join(id_list))
        rv = Management.db_read.op_db_query(Management.db_name, sql, ())
        item_list = []
        for item in rv:
            item_list.append({
                'id': item[0],
                'name_cn':item[1],
                'name_en':item[2],
                'code_name':item[3],
                'phone':item[4],
                'projectList':management_dict.get(item[0],[])
            })
        #     id_list.append(item[0])
        # if not noProject:
        #     dict_project = Management.get_management_project_list(Management, id_list)
        #     for item in item_list:
        #         item.update({'projectList': dict_project.get(item.get('id'),[])})
        return item_list

    @staticmethod
    def create_management(data):
        '''
        创建新集团项目
        '''
        sql = 'INSERT INTO '+ Management.table_name +' (name_cn, name_en, code_name, phone) VALUES (%s,%s,%s,%s)'
        id = Management.db.op_db_update_with_id(Management.db_name, sql,
        (data.get('name_cn',''),data.get('name_en',''), data.get('code_name',''), data.get('phone',''),))
        return id

    @staticmethod
    def get_management_detail(id):
        '''
        获取集团详情
        '''
        sql = 'SELECT * FROM %s WHERE id = %s'%(Management.table_name,id)
        rv = Management.db_read.op_db_query_one(Management.db_name, sql, ())
        keys = Management.db_read.op_db_query(Management.db_name, 'desc '+ Management.table_name , ())
        keys = [key[0] for key in keys]
        rt = {key:value for key,value in zip(keys,rv)}
        return rt

    @staticmethod
    def get_management_detail_by_param(dict):
        '''
        获取集团详情
        '''
        try :
            filter_param = ''
            arr_param = []
            for key,value in dict.items():
                arr_param.append(' %s = "%s" '%(key,value))
            filter_param = ','.join(arr_param)
            if not filter_param:
                return []
            sql = 'SELECT * FROM %s WHERE %s'%(Management.table_name,filter_param)
            rv = Management.db_read.op_db_query_one(Management.db_name, sql, ())
            keys = Management.db_read.op_db_query(Management.db_name, 'desc '+ Management.table_name , ())
            keys = [key[0] for key in keys]
            rt = {key:value for key,value in zip(keys,rv)}
        except Exception as e:
            print('get management detail error:' + e.__str__())
            return []
        return rt

    @staticmethod
    def update_management(data):
        id = data.get('id',-1)
        if id <= 0:
            return id
        info = ''
        arr_info = []
        for key,value in data.items():
            if key == 'id':
                continue
            arr_info.append('%s = "%s"'%(key,value))
        info = ' , '.join(arr_info)
        if info:
            sql = 'UPDATE '+ Management.table_name +' SET %s WHERE ID = %s'%(info,id)
            status = Management.db.op_db_update(Management.db_name, sql,())
        else:
            status = False
        return status

    @staticmethod
    def bind_management(id, data):
        management_id = id
        if not (management_id > 0):
            raise Exception('no management id get')
        project_list = data
        if not isinstance(project_list,list):
            id_list = [int(project_list)]
        else:
            id_list = project_list
        if len(id_list) <= 0:
            raise Exception('no project id get')
        sql = 'UPDATE project SET management = %s  WHERE ID in (%s)'%(management_id , ','.join(map(str,id_list)))
        status = Management.db.op_db_update(Management.db_name, sql,())
        return status

    @staticmethod
    def unbind_management(data):
        project_list = data
        if not isinstance(project_list,list):
            id_list = [int(project_list)]
        else:
            id_list = project_list
        if len(id_list) <= 0:
            raise Exception('no project id get')
        sql = 'UPDATE project SET management = Null  WHERE ID in (%s)'%(','.join(map(str,id_list)))
        status = Management.db.op_db_update(Management.db_name, sql,())
        return status

    @staticmethod
    def del_management(data):

        management_list = data
        if not isinstance(management_list,list):
            id_list = [int(management_list)]
        else:
            id_list = [int(item) for item in management_list]
        if len(id_list) <= 0:
            raise Exception('no project id get')
        project_list = []
        dict_project = Management.get_management_project_list(Management,id_list)
        for i in id_list:
            project_list.extend([item.get('id') for item in dict_project.get(i,[])])
        if isinstance(project_list,list) and  len( project_list)> 0 :
            Management.unbind_management(project_list)
        sql = 'DELETE FROM ' + Management.table_name + ' WHERE ID in (%s)'%(','.join(map(str,id_list)))
        status = Management.db.op_db_update(Management.db_name, sql,())


        return status