__author__ = 'yan'

from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPMongoDataAccess import *
from beopWeb.mod_admin.User import User


class Algorithm(object):
    _collection_algorithm_template = MongoConnManager.getConfigConn().mdbBb[g_table_algorithm_template]

    @classmethod
    def AddAlgorithmTemplateFolder(cls, data):
        rt = ''
        try:
            insert = {}
            if data:
                for key in data:
                    value = data.get(key)
                    if '_id' == key:
                        value = ObjectId(value)
                    insert.update({key: value})
                insert.update({'isFolder': True})
                if insert:
                    rt = str(cls._collection_algorithm_template.save(insert))
        except Exception as e:
            strError = 'AddAlgorithmTemplateFolder failed:' + e.__str__()
            print(strError)
            logging.error(strError)
            rt = strError
        return rt

    @classmethod
    def SaveAlgorithmTemplate(cls, data):
        rt = ''
        try:
            insert = {}
            if data:
                for key in data:
                    value = data.get(key)
                    if '_id' == key:
                        value = ObjectId(value)
                    insert.update({key: value})
                insert.update({'isFolder': False})
                if insert:
                    rt = str(cls._collection_algorithm_template.save(insert))
        except Exception as e:
            strError = 'SaveAlgorithmTemplate failed:' + e.__str__()
            print(strError)
            logging.error(strError)
            rt = strError
        return rt

    @classmethod
    def GetAlgorithmTemplateContent(cls, algorithm_id):
        rt = {}
        try:
            rt = cls._collection_algorithm_template.find_one({'_id': ObjectId(algorithm_id)})
            if rt:
                Algorithm.set_creator_name(rt)
                rt.update({'_id': str(rt.get('_id'))})
        except Exception as e:
            strError = 'GetAlgorithmTemplateContent failed:' + e.__str__()
            print(strError)
            logging.error(strError)
            rt = strError
        return rt

    @classmethod
    def set_creator_name(cls, item):
        if not item:
            return
        creator_id = item.get('creator')
        if creator_id:
            creator = User().get_all_user_map().get(creator_id)
            if creator:
                item['creatorName'] = creator.get('userfullname')

    @classmethod
    def LoadTemplateTree(cls, parent_id):
        rt = []
        try:
            cursor = None
            try:
                query = {'parent_id': 'null', 'isFolder': True} if parent_id == 'null' else {'parent_id': parent_id}
                cursor = cls._collection_algorithm_template.find(query)
                for item in cursor:
                    if 'content' in item:
                        item.pop('content')
                    item.update({'_id': str(item.get('_id'))})
                    Algorithm.set_creator_name(item)
                    rt.append(item)
            except Exception as e:
                raise Exception(e.__str__())
            finally:
                if cursor:
                    cursor.close()
        except Exception as e:
            strError = 'LoadTemplateTree failed:' + e.__str__()
            print(strError)
            logging.error(strError)
            rt = strError
        return rt

    @classmethod
    def SearchTemplate(cls, search_text):
        rt = []
        cursor = None
        try:
            regDict = {'$regex': search_text, '$options': '$i'}
            cursor = cls._collection_algorithm_template.find({'$or': [{'note': regDict}, {'name': regDict}]})
            for item in cursor:
                if 'content' in item:
                    item.pop('content')
                item.update({'_id': str(item.get('_id'))})
                Algorithm.set_creator_name(item)
                rt.append(item)
        except Exception as e:
            strError = 'SearchTemplate failed:' + e.__str__()
            print(strError)
            logging.error(strError)
            rt = strError
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def TraceTreeItem(cls, parent_id, arr):
        cursor = None
        try:
            cursor = cls._collection_algorithm_template.find({'parent_id': parent_id})
            for item in cursor:
                Algorithm.set_creator_name(item)
                arr.append(item)
                if item.get('isFolder'):
                    cls.TraceTreeItem(str(item.get('_id')), arr)
        except Exception as e:
            strError = 'TraceTreeItem failed:' + e.__str__()
            print(strError)
            logging.error(strError)
            rt = strError
        finally:
            if cursor:
                cursor.close()

    @classmethod
    def delete_template(cls, template_id):
        if not template_id or not ObjectId.is_valid(template_id):
            return False
        return cls._collection_algorithm_template.remove({'_id': ObjectId(template_id)})