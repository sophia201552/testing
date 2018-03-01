from bson import ObjectId
import logging

from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPMongoDataAccess import g_tableDataSource
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_tag.Tag import TagThing, TagGroup
from beopWeb.mod_tag.Constants import KeyWordType


class pointTag:
    def __init__(self):
        pass

    @classmethod
    def sync_cloud_point_to_thingTree(cls, projId, ObId=None):
        rt = False
        try:
            if cls.contrast_cloud_point_from_thingsTree_dataSource(projId):
                if cls.set_cloud_point_to_thingsTree(projId):
                    rt = True
        except Exception as e:
            print('sync_cloud_point_to_thingTree error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def get_cloud_point_from_dataSource(self, projId, ObId=None, limit=500, skip=0):
        rt = []
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            if ObId:
                if ObjectId.is_valid(ObId):
                    cursor = cnn.mdbBb[g_tableDataSource].find({'_id': ObjectId(ObId)},
                                                               projection={'_id': 1, 'value': 1})
                else:
                    raise Exception('Invalid parameter')
            else:
                cursor = cnn.mdbBb[g_tableDataSource].find({'projId': int(projId), 'type': 4},
                                                           projection={'_id': 1, 'value': 1},
                                                           limit=int(limit), skip=int(skip), sort=[('_id', 1)])
            rt = list(cursor)
        except Exception as e:
            print('get_cloud_point_from_dataSource error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def set_cloud_point_to_thingsTree(self, projId):
        rt = False
        collection = 'ThingsTree_' + str(projId)
        cursor = None
        try:
            n = 0
            limit = 500
            cnn = MongoConnManager.getConfigConn()
            ids_excess = []
            while n >= 0:
                ids_datasource = self.get_cloud_point_from_dataSource(projId, limit=limit, skip=n*limit)
                num = len(ids_datasource)
                cursor = cnn.mdbBb[collection].find({'_id': {'$in': [d.get('_id') for d in ids_datasource]}},
                                                    projection={'_id': 1}, sort=[('_id', 1)])
                if cursor.count() < num:
                    ids_thingstree = list(cursor)
                    for x in range(num):
                        try:
                            temp = ids_thingstree[x]
                        except Exception as e:
                            ids_excess.append({'_id': ids_datasource[x].get('_id'), 'name': ids_datasource[x].get('value'),
                                               'Prt': None, 'type': 'thing', 'tag': {}, 'attrP': {},
                                               'keywords': TagThing.split_point_name(ids_datasource[x].get('value'))})
                            ids_thingstree.insert(x, {'_id': ids_datasource[x].get('_id')})
                        if ids_datasource[x].get('_id') != ids_thingstree[x].get('_id'):
                            ids_excess.append({'_id': ids_datasource[x].get('_id'), 'name': ids_datasource[x].get('value'),
                                               'Prt': None, 'type': 'thing', 'tag': {}, 'attrP': {},
                                               'keywords': TagThing.split_point_name(ids_datasource[x].get('value'))})
                            ids_thingstree.insert(x, {'_id': ids_datasource[x].get('_id')})
                if num == limit:
                    n = n + 1
                else:
                    n = -1
            if ids_excess:
                cnn.mdbBb[collection].insert_many(ids_excess)
            rt = True
        except Exception as e:
            print('set_cloud_point_to_thingsTree' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def contrast_cloud_point_from_thingsTree_dataSource(cls, projId):
        rt = False
        collection = 'ThingsTree_' + str(projId)
        cursor = None
        try:
            n = 0
            limit = 500
            cnn = MongoConnManager.getConfigConn()
            ids_excess = []
            data_diff = []
            while n >= 0:
                ids_thingstree = cls.get_cloud_point_from_thingsTree(projId, limit=limit, skip=n * limit)
                cursor = cnn.mdbBb[g_tableDataSource].find({'_id': {'$in': [d.get('_id') for d in ids_thingstree]},
                                                            'projId': int(projId), 'type': 4},
                                                           projection={'_id': 1, 'value': 1}, sort=[('_id', 1)])
                num = len(ids_thingstree)
                if cursor.count() < num:
                    ids_datasource = list(cursor)
                    for x in range(num):
                        try:
                            temp = ids_datasource[x]
                        except Exception as e:
                            ids_excess.append(ids_thingstree[x].get('_id'))
                            ids_datasource.insert(x, ids_thingstree[x])
                        if ids_thingstree[x].get('_id') != ids_datasource[x].get('_id'):
                            ids_excess.append(ids_thingstree[x].get('_id'))
                            ids_datasource.insert(x, ids_thingstree[x])
                        elif ids_thingstree[x].get('name') != ids_datasource[x].get('value'):
                            data_diff.append({'_id': ids_datasource[x].get('_id'), 'name': ids_datasource[x].get('value')})
                if num == limit:
                    n = n + 1
                else:
                    n = -1
            if ids_excess:
                cnn.mdbBb[collection].delete_many({'_id': {'$in': ids_excess}})
            if data_diff:
                for i in data_diff:
                    TagThing(projId).update_things_by_Id(id=i.get('_id'), name=i.get('name'), pointName=None)
            rt = True
        except Exception as e:
            print('contrast_cloud_point_from_thingsTree_dataSource error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_cloud_point_from_thingsTree(cls, projId, limit=500, skip=0):
        rt = []
        collection = 'ThingsTree_' + str(projId)
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb[collection].find({'$or': [{'type': None}, {'type': 'thing'}]}, limit=limit, skip=skip,
                                                projection={'_id': 1, 'name': 1}, sort=[('_id', 1)])
            rt = list(cursor)
        except Exception as e:
            print('get_cloud_point_from_thingsTree error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def set_tag(cls, projId, thingsList, tag, user, lang='zh-CN'):
        rt = False
        collection = 'ThingsTree_' + str(projId)
        try:
            cnn = MongoConnManager.getConfigConn()
            if ObjectId.is_valid(tag):
                tag_info = cls.get_tag_globa_dictionary_by_id(lang, tag)
                if tag_info:
                    dbrv = cnn.mdbBb[collection].update(
                        {'_id': {'$in': [ObjectId(x) for x in thingsList if ObjectId.is_valid(x)]}},
                        {'$set': {'tag': {'id': tag_info.get('_id').__str__(), 'name': tag_info.get('name'),
                                          'icon': tag_info.get('icon')},
                                  'userId': user}})
                else:
                    raise Exception('Set Tag Failed')
            elif isinstance(tag, list) or isinstance(tag, str):
                tag_info = cls.get_tag_globa_dictionary_by_name(lang, tag)
                if tag_info:
                    dbrv = cnn.mdbBb[collection].update(
                        {'_id': {'$in': [ObjectId(x) for x in thingsList if ObjectId.is_valid(x)]}},
                        {'$set': {'tag': {'id': tag_info.get('_id').__str__(), 'name': tag_info.get('name'),
                                          'icon': tag_info.get('icon')},
                                  'userId': user}})
                else:
                    dbrv = cnn.mdbBb[collection].update(
                        {'_id': {'$in': [ObjectId(x) for x in thingsList if ObjectId.is_valid(x)]}},
                        {'$set': {'tag': {'name': tag},
                                  'userId': user}})
            else:
                raise Exception('Invalid parameter')
            if dbrv:
                if dbrv.get('ok'):
                    rt = True
        except Exception as e:
            print('set_tag error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def get_tag_globa_dictionary_by_id(cls, lang, tag_id):
        rt = {}
        try:
            if isinstance(lang, str) and lang in ['zh-CN', 'en-US', 'zh-TW']:
                collection = 'tagGlobalDictionary_' + str(lang)
                cnn = MongoConnManager.getConfigConn()
                if ObjectId.is_valid(tag_id):
                    rt = cnn.mdbBb[collection].find_one({'_id': ObjectId(tag_id)})
                else:
                    raise Exception('Invalid parameter')
        except Exception as e:
            print('get_tag_globa_dictionary_by_id error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def get_tag_globa_dictionary_by_name(cls, lang, tag_name):
        rt = {}
        try:
            if isinstance(lang, str) and lang in ['zh-CN', 'en-US', 'zh-TW']:
                collection = 'tagGlobalDictionary_' + str(lang)
                cnn = MongoConnManager.getConfigConn()
                if isinstance(tag_name, str):
                    tag = tag_name.split(',')
                elif isinstance(tag_name, list):
                    tag = tag_name
                else:
                    raise Exception('Invalid parameter')
                dbrv = cnn.mdbBb[collection].find_one({'name': tag})
                if dbrv:
                    rt = dbrv
        except Exception as e:
            print('get_tag_globa_dictionary_by_name error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def get_tag_globa_dictionary(cls, lang):
        rt = []
        cursor = None
        try:
            if isinstance(lang, str) and lang in ['zh-CN', 'en-US', 'zh-TW']:
                collection = 'tagGlobalDictionary_' + str(lang)
                cnn = MongoConnManager.getConfigConn()
                cursor = cnn.mdbBb[collection].find({})
                for item in cursor:
                    rt.append({'_id': item.get('_id').__str__(), 'icon': item.get('icon'), 'name': item.get('name'),
                               'attrP': item.get('attrP'), 'type': item.get('type')})
            else:
                raise Exception('Invalid parameter')
        except Exception as e:
            print('get_tag_globa_dictionary error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_things_tree(cls, projId, Prt='', only_group=False):
        rt = []
        try:
            if ObjectId.is_valid(Prt):
                query_1 = {'Prt': ObjectId(Prt)}
            else:
                query_1 = {'Prt': Prt}

            if only_group:
                query_1['type'] = 'group'

            n = 0
            limit = 500
            f_layer = []
            while n >= 0:
                res = cls.get_things(projId, query=query_1, limit=limit, skip=limit * n, sort=[('type', 1), ('name', 1)])
                for item in res:
                    try:
                        f_layer.append(ObjectId(item.get('_id')))
                        rt.append({'_id': item.get('_id'), 'name': item.get('name'), 'tag': item.get('tag'),
                                   'Prt': item.get('Prt'), 'path': item.get('path'), 'type': item.get('type'),
                                   'isParent': True if item.get('type') == 'group' else False,
                                   'children': []})
                    except Exception as e:
                        print('get_things_tree dataerror:' + str(item))
                if len(res) == limit:
                    n += 1
                else:
                    n = -1
            if f_layer:
                query_2 = {'Prt': {'$in': [ObjectId(x) for x in f_layer if ObjectId.is_valid(x)]}}
                n = 0
                limit = 1000
                while n >= 0:
                    res = cls.get_things(projId, query=query_2, limit=limit, skip=limit * n)
                    for item in res:
                        x = f_layer.index(ObjectId(item.get('Prt')))
                        item['isParent'] = True if item.get('type') == 'group' else False
                        rt[x].get('children').append(item)
                    if len(res) == limit:
                        n += 1
                    else:
                        n = -1
        except Exception as e:
            print('get_things_tree error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def get_things(self, projId, query={}, limit=500, skip=0, sort=[('name', 1)]):
        rt = []
        collection = 'ThingsTree_' + str(projId)
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb[collection].find(query, limit=limit, skip=skip, sort=sort)
            for item in cursor:
                rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name').__str__(),
                           'tag': item.get('tag'),
                           'Prt': item.get('Prt').__str__(), 'type': item.get('type')})
        except Exception as e:
            print('get_things error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def fuzzy_search(cls, projId, searchName, path, lang='zh-CN'):
        rt = []
        cursor = None
        collection = 'ThingsTree_' + str(projId)
        if isinstance(lang, str) and lang in ['zh-CN', 'en-US', 'zh-TW']:
            collection_tag = 'tagGlobalDictionary_' + str(lang)
        else:
            collection_tag = 'tagGlobalDictionary_zh-CN'
        try:
            search_regex = Utils.handle_search_text(searchName)
            cnn = MongoConnManager.getConfigConn()
            regDict = {'$regex': search_regex}
            cursor = cnn.mdbBb[collection_tag].find({'$or': [{'name': regDict}, {'attrP.name': regDict}]},
                                                    sort=[('name', 1), ('_id', -1)])
            tagIdList = []
            for item in cursor:
                tagIdList.append(item.get('_id'))
            if cursor:
                cursor.close()

            if tagIdList:
                query = {'$or': [{'name': regDict}, {'tagId': {'$in': tagIdList}}]}
            else:
                query = {'name': regDict}

            if path:
                que = cls.match_strpath_listpath_for_search(projId, path)
                if que:
                    query.update(que)
            cursor = cnn.mdbBb[collection].find(query, sort=[('name', 1), ('_id', -1)])
            for i in cursor:
                rt.append({'_id': i.get('_id').__str__(), 'name': i.get('name'), 'tag': i.get('tag'),
                           'Prt': i.get('Prt').__str__(), 'path': cls._switch_path_in_thingsTree(i.get('path')), 'type': i.get('type')})
        except Exception as e:
            print('fuzzy_search error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def point_search(cls, projId, searchName, Prt):
        rt = []
        collection = 'ThingsTree_' + str(projId)
        cursor = None
        try:
            search_regex = Utils.handle_search_text(searchName)
            regDict = {'$regex': search_regex}
            cnn = MongoConnManager.getConfigConn()
            if Prt:
                cursor = cnn.mdbBb[collection].find({'name': regDict, 'Prt': ObjectId(Prt)})
            else:
                cursor = cnn.mdbBb[collection].find({'name': regDict, 'Prt': Prt})
            for item in cursor:
                try:
                    rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'Prt': item.get('Prt').__str__(),
                               'path': cls._switch_path_in_thingsTree(item.get('path')), 'type': item.get('type')})
                except Exception as e:
                    pass
        except Exception as e:
            print('point_search error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def set_thingsTree(cls, projId, data):
        rt = None
        collection = 'ThingsTree_' + str(projId)
        try:
            data.update({'_id': ObjectId(data.get('_id')) if ObjectId.is_valid(data.get('_id')) else ObjectId()})
            if 'Prt' in data.keys():
                data.update({'Prt': ObjectId(data.get('Prt')) if ObjectId.is_valid(data.get('Prt')) else '', })
            cnn = MongoConnManager.getConfigConn()
            if isinstance(data.get('Prt'), ObjectId):
                dbrv = cnn.mdbBb[collection].find_one({'_id': data.get('Prt')})
                if dbrv.get('path'):
                    path = dbrv.get('path').__str__() + '/' + dbrv.get('name').__str__()
                else:
                    path = '/' + dbrv.get('name').__str__()
                data.update({'path': path})
            else:
                data.update({'path': '', 'Prt': ''})
            dbrv = cnn.mdbBb[collection].update({'_id': data.get('_id')}, {'$set': data}, True)
            if dbrv.get('ok'):
                rt = data.get('_id').__str__()
        except Exception as e:
            print('set_thingsTree error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    @classmethod
    def rename_thingsTree(cls, projId, things_id, name_new):
        '''
        David 20160921
        :param projId:
        :param data:
        :return:
        '''
        rt = None
        collection = 'ThingsTree_' + str(projId)
        try:
            cnn = MongoConnManager.getConfigConn()
            if ObjectId.is_valid(things_id):
                dbrv = cnn.mdbBb[collection].find_one({'_id': ObjectId(things_id)})
                if dbrv:
                    name_old = dbrv.get('name')
                    Prt = dbrv.get('Prt')
                    index = len(dbrv.get('path'))
                    que = 'path.' + str(index)
                    if cls.name_disambiguation(projId, name_new, Prt):
                        res = cnn.mdbBb[collection].update({'_id': ObjectId(things_id), 'type': 'group'},
                                                           {'$set': {'name': name_new}})
                        if res:
                            if res.get('ok') and res.get('nModified') == 1:
                                dbres = cnn.mdbBb[collection].update({que: name_old},
                                                                     {'$set': {que: name_new}}, multi=True)
                                if dbres:
                                    if dbres.get('ok'):
                                        rt = name_new
                            else:
                                raise Exception('Unable to rename the object')
                    else:
                        raise Exception('This name already exists')
        except Exception as e:
            print('update_thingsTree error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def create_new_things(cls, projId, data, userId):
        rt = None
        collection = 'ThingsTree_' + str(projId)
        try:
            cnn = MongoConnManager.getConfigConn()
            insert_data = {'_id': ObjectId(), 'userId': int(userId), 'name': data.get('name'),
                           'Prt': ObjectId(data.get('Prt')) if ObjectId.is_valid(data.get('Prt')) else '',
                           'type': data.get('type') if data.get('type') else 'group'}
            if cls.name_disambiguation(projId, insert_data.get('name'), insert_data.get('Prt'), insert_data.get('type')):
                insert_data.update({'path': cls.get_things_path(projId, insert_data.get('Prt'))})
                dbrv = cnn.mdbBb[collection].insert(insert_data)
                rt = insert_data.get('_id').__str__()
            else:
                raise Exception('This name already exists')
        except Exception as e:
            print('create_new_things error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def get_things_path(cls, projId, Prt):
        rt = []
        collection = 'ThingsTree_' + str(projId)
        try:
            cnn = MongoConnManager.getConfigConn()
            dbrv = cnn.mdbBb[collection].find_one({'_id': Prt})
            if dbrv:
                path = dbrv.get('path')
                if path:
                    if isinstance(path, str):
                        rt = path.split('/')
                        if not rt[0]:
                            rt = rt[1:]
                    elif isinstance(path, list):
                        rt = path
                    rt.append(dbrv.get('name'))
                else:
                    rt.append(dbrv.get('name'))
        except Exception as e:
            print('get_things_path error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def move_things(cls, projId, thingsIds, Prt):
        rt = False
        collection = 'ThingsTree_' + str(projId)
        cursor = None
        try:
            if ObjectId.is_valid(Prt):
                path = cls.get_things_path(projId, ObjectId(Prt))
            else:
                path = []
                Prt = ''
            group_list = []
            thing_list = []
            n = 0
            limit = 500
            while n >= 0:
                res = cls.get_things(projId, query={'_id': {'$in': [ObjectId(x) for x in thingsIds if ObjectId.is_valid(x)]}}, limit=limit, skip=limit * n)
                for item in res:
                    try:
                        if item.get('type') == 'group':
                            group_list.append(ObjectId(item.get('_id')))
                        else:
                            thing_list.append(ObjectId(item.get('_id')))
                    except Exception as e:
                        pass
                if len(res) == limit:
                    n += 1
                else:
                    n = -1
            cnn = MongoConnManager.getConfigConn()
            dbrv = cnn.mdbBb[collection].update({'_id': {'$in': thing_list}},
                                                {'$set': {'path': path,
                                                          'Prt': ObjectId(Prt) if ObjectId.is_valid(Prt) else Prt}}, multi=True)
            dbrv = cnn.mdbBb[collection].update({'_id': {'$in': group_list}},
                                                {'$set': {'path': path,
                                                          'Prt': ObjectId(Prt) if ObjectId.is_valid(Prt) else Prt}}, multi=True)
            for group in group_list:
                cursor = cnn.mdbBb[collection].find({'Prt': group})
                things = list(cursor)
                cls.move_things(projId, [x.get('_id') for x in things], group)
            rt = True
        except Exception as e:
            print('move_things error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def del_things(cls, projId, thingsId):
        '''
        :param projId:
        :param thingsId:
        :return:
        '''
        rt = False
        collection = 'ThingsTree_' + str(projId)
        try:
            if ObjectId.is_valid(thingsId):
                cnn = MongoConnManager.getConfigConn()
                dbrv = cnn.mdbBb[collection].find_one_and_delete({'_id': ObjectId(thingsId)})
                if dbrv:
                    path = dbrv.get('path')
                    if isinstance(path, str):
                        path = cls._switch_path_in_thingsTree(path)
                    n = len(path)
                    d_prt = dbrv.get('Prt')
                    d_path = 'path.' + str(n)
                    d_name = dbrv.get('name')
                    d_id = dbrv.get('_id')
                    dbres = cnn.mdbBb[collection].update({d_path: d_name}, {'$unset': {d_path: 1}}, multi=True)
                    dbres = cnn.mdbBb[collection].update({'Prt': d_id}, {'$set': {'Prt': d_prt}}, multi=True)
                    rt = True
        except Exception as e:
            print('del_things error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def del_thingsTree(cls, projId, thingsId):
        '''
        David rewrite 20161019
        Can only delete group and all groups in thins group
        :param projId:
        :param thingsId:
        :return:
        '''
        rt = []
        collection = 'ThingsTree_' + str(projId)
        cursor = None
        try:
            if ObjectId.is_valid(thingsId):
                cnn = MongoConnManager.getConfigConn()
                dbrv = cnn.mdbBb[collection].find_one_and_delete({'_id': ObjectId(thingsId), 'type': 'group'})
                # 如果dbrv为空，说明该thingsId为things，无法删除
                if dbrv:
                    rt.append(dbrv.get('_id').__str__())
                    path = dbrv.get('path', '')
                    name = dbrv.get('name')
                    Prt = dbrv.get('Prt', '')
                    quer = {}
                    if path:
                        for index, pi in enumerate(path):
                            quer.update({'path.' + str(index): pi})
                        quer.update({'path.' + str(len(path)): name})
                    else:
                        quer.update({'path.0': name})
                    cursor = cnn.mdbBb[collection].find(quer)
                    groupId_list = []
                    for item in cursor:
                        if item.get('type') == 'group':
                            groupId_list.append(item.get('_id'))
                    res = cnn.mdbBb[collection].update(quer, {'$set': {'Prt': Prt, 'path': path}}, multi=True)
                    res = cnn.mdbBb[collection].delete_many({'_id': {'$in': groupId_list}})
                    rt.extend([x.__str__() for x in groupId_list])
            else:
                raise Exception('Invalid parameter')
        except Exception as e:
            print('del_thingsTree error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def _switch_path_in_thingsTree(cls, path):
        '''
        David 20160920
        :param path:
        :return: if path=>list return=>str
                 if path=>str return=>list
        '''
        rt = None
        try:
            if isinstance(path, list):
                rt = ''
                for p in path:
                    if p:
                        rt = rt + str(p) + '/'
                if rt:
                    rt = rt[:-1]
            elif isinstance(path, str):
                path = path.split('/')
                if path:
                    if path[0] == '':
                        rt = path[1:]
                    else:
                        rt = path
                else:
                    rt = []
        except Exception as e:
            print('_repair_path_in_thingsTree error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    @classmethod
    def copy_thingsTree(cls, projId, userId, Prt, arrfolder):
        '''
        David 20160922
        :param projId:
        :param userId:
        :param Prt:
        :param arrfolder:
        :return:
        '''
        rt = None
        collection = 'ThingsTree_' + str(projId)
        try:
            if ObjectId.is_valid(Prt):
                path = cls.get_things_path(projId, ObjectId(Prt))
                Prt = ObjectId(Prt)
            else:
                path = []
                Prt = ''
            cnn = MongoConnManager.getConfigConn()
            for folder in arrfolder:
                try:
                    new_objId = ObjectId()
                    folder.update({'path': path, 'Prt': Prt, 'userId': int(userId)})
                    # 这里有bug，如果子节点中存在1000以上的group 就会出现bug 但是我就是不相信会存在这种情况
                    arrf = cls.get_things(projId, {'Prt': ObjectId(folder.get('_id')), 'type': 'group'}, limit=1000)
                    folder.update({'_id': new_objId})
                    dbrv = cnn.mdbBb[collection].insert(folder)
                    if arrf:
                        cls.copy_thingsTree(projId, userId, new_objId, arrf)
                except Exception as e:
                    pass
            rt = True
        except Exception as e:
            print('copy_thingsTree error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def match_strpath_listpath_for_search(cls, projId, path):
        rt = {}
        cursor = None
        collection = 'ThingsTree_' + str(projId)
        try:
            if isinstance(path, str):
                if len(path) > 0:
                    if path[0] == '/':
                        path = path[1:]
                path_list = cls._switch_path_in_thingsTree(path)
                cnn = MongoConnManager.getConfigConn()
                cursor = cnn.mdbBb[collection].find({'path': path_list[-1]})
                for item in cursor:
                    path_find = cls._switch_path_in_thingsTree(item.get('path'))
                    if path_find == path:
                        n = item.get('path').index(path_list[-1])
                        que = 'path.' + str(n)
                        rt.update({que: path_list[-1]})
        except Exception as e:
            print('match_strpath_listpath_for_search error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def name_disambiguation(cls, projId, name, Prt='', type='group'):
        '''
        David 20161024
        :param projId:
        :param name:
        :param Prt: ObjectId or ''
        :return:
        '''
        rt = False
        collection = 'ThingsTree_' + str(projId)
        try:
            cnn = MongoConnManager.getConfigConn()
            dbrv = cnn.mdbBb[collection].find_one({'name': name, 'Prt': Prt, 'type': type})
            if not dbrv:
                rt = True
        except Exception as e:
            print('name_disambiguation error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    @classmethod
    def name_disambiguation_by_thingsId(cls, projId, thingsId, Prt=''):
        '''
        David 20161024
        :param projId:
        :param thingsId:
        :param Prt:
        :param type:
        :return:
        '''
        rt = False
        collection = 'ThingsTree_' + str(projId)
        try:
            cnn = MongoConnManager.getConfigConn()
            dbrv = cnn.mdbBb[collection].find_one({'_id': thingsId})
            if dbrv:
                name = dbrv.get('name')
                if dbrv.get('type'):
                    type = dbrv.get('type')
                else:
                    type = 'thing'
                if ObjectId.is_valid(Prt):
                    rt = cls.name_disambiguation(projId, name, ObjectId(Prt), type)
                else:
                    rt = cls.name_disambiguation(projId, name, '', type)
        except Exception as e:
            print('name_disambiguation error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    @classmethod
    def get_keyword_from_thing_name(cls, projId, prt=None):
        '''
        step1：根据'_'对点名进行分离，分离项符合以下特征加入关键字列表：1.都为大写。2.都小写。
                                                                   3.为单个单词，首字母大写
        step2: 对于不是使用'_'进行分隔的点名，根据字母大小写分离：1.前部字幕都为大写（AHU，CH，VAV）
                                                              2.首字母大写（Ch，Room，Floor）
                                                              3.全部为数字
        '''
        rt = []
        try:
            keyword = []
            tagThing = TagThing(projId)
            things_list = tagThing.get_things_by_prt(prt)
            item_list = map(cls.split_point_name, things_list)
            for item in item_list:
                rt.extend(item)
        except Exception as e:
            print('get_keyword_from_thing_name error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    @classmethod
    def split_point_name(cls, things):
        rt = []
        if isinstance(things, dict):
            thingsName = things.get('name')
            item_list = thingsName.split(' ')
            for item in item_list:
                i_list = item.split('_')
                for i in i_list:
                    if cls.judge_is_keyword(i):
                        rt.append(i)
                    else:
                        rt.extend(cls.split_long_name(i))
        return rt

    @classmethod
    def judge_is_keyword(cls, item):
        rt = False
        if isinstance(item, str):
            if item.isdigit():
                rt = True
            elif item.isalpha() and item.isupper():
                rt = True
            elif item.isalpha() and item.islower():
                rt = True
            elif item.isalpha() and item[0].isupper() and item[1:].islower():
                rt = True
            else:
                rt = False
        return rt

    @classmethod
    def split_long_name(cls, longname):
        rt = []
        if isinstance(longname, str):
            if len(longname) > 2:
                first = longname[0]
                keyword = ''
                if first.isalpha() and first.isupper():
                    keyword = first
                    if longname[1].isupper():
                        keyword += longname[1]
                        for i in range(2, len(longname)):
                            if longname[i].isupper() or longname[i].isdigit():
                                if longname[i].isupper():
                                    if longname[i-1].isdigit():
                                        i -= 1
                                        break
                                keyword += longname[i]
                            else:
                                if longname[i].islower() and longname[i-1].isupper():
                                    keyword = keyword[:-1]
                                    i -= 1
                                break
                    elif longname[1].islower():
                        keyword += longname[1]
                        for i in range(2, len(longname)):
                            if longname[i].islower() or longname[i].isdigit():
                                keyword += longname[i]
                            else:
                                break
                    elif longname[1].isdigit():
                        keyword += longname[1]
                        for i in range(2, len(longname)):
                            if longname[i].isdigit():
                                keyword += longname[i]
                            else:
                                break
                    else:
                        i = 1
                elif first.isdigit():
                    keyword = first
                    for i in range(1, len(longname)):
                        if longname[i].isdigit():
                            keyword += longname[i]
                        else:
                            break
                else:
                    i = 1
                if keyword:
                    rt.append(keyword)
                if i >= 1:
                    x = longname[i:]
                    rt.extend(cls.split_long_name(x))
        return rt

    @classmethod
    def get_keywords(cls, projId, prt=None):
        rt = []
        res = TagThing(projId).get_keywords_by_sorted(prt=prt)
        if res:
            for i in res:
                rt.append({'key': i[0], 'type': KeyWordType.NORMAL, 'count': int(i[1])})
        return rt
