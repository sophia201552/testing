from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPMongoDataAccess import *


class CloudDiagnosis:
    _collection_cloudDiagnosis = MongoConnManager.getConfigConn().mdbBb[g_table_clouddiagnosis]

    @classmethod
    def save_cloudDiagnosis_customDiagnosis_list(cls, diagnosis):
        if not isinstance(diagnosis, list):
            diagnosis = [diagnosis]
        saved = []
        for item in diagnosis:
            saved.append(CloudDiagnosis.save_cloudDiagnosis_customDiagnosis(item))
        return saved

    @classmethod
    def save_cloudDiagnosis_customDiagnosis(cls, data):
        try:
            data.update({'isDelete': bool(0), 'format': data.get('format', 'h1').lower()})
            data_id = data.get('_id')
            data.pop('_id', None)
            moduleName = data.get('moduleName')
            projId = data.get('projId')
            if data_id:
                cls._collection_cloudDiagnosis.update({'_id': ObjectId(data_id)}, {'$set': data})
            else:
                isexit = cls.isexist_cloudDiagnosis(moduleName, projId)
                if isexit:
                    raise Exception(moduleName + ' is existed.')
                else:
                    data_id = cls._collection_cloudDiagnosis.insert(data)
            data['_id'] = data_id
        except Exception as e:
            print('save_cloudDiagnosis_customDiagnosis error:' + e.__str__())
            logging.error('save_cloudDiagnosis_customDiagnosis error:' + e.__str__())
            raise e
        return data

    @classmethod
    def save_cloudDiagnosis_customDiagnosis_many(cls, data):
        try:

            logic_content = data.get('logic')
            projId = data.get('projId')
            if not logic_content:
                raise Exception("param logic is none")

            for x in logic_content.split('def main_')[1:]:
                moduleName = x.split(':')[0].replace('()', '')
                x = x.replace(point_name, 'def main', 1)
                data.update({'isDelete': bool(0), 'format': data.get('format', 'h1').lower(), 'moduleName': module_name,
                             'logic': x})
                isexit = cls.isexist_cloudDiagnosis(moduleName, projId)
            if isexit:
                return False
            else:
                data_id = cls._collection_cloudDiagnosis.insert(data)
            data['_id'] = data_id
        except Exception as e:
            print('save_cloudDiagnosis_customDiagnosis error:' + e.__str__())
            logging.error('save_cloudDiagnosis_customDiagnosis error:' + e.__str__())
            return False
        return data

    @classmethod
    def isexist_cloudDiagnosis(cls, moduleName, projId):
        projId = int(projId)
        isexit = cls._collection_cloudDiagnosis.find_one(
            {'moduleName': moduleName, 'projId': projId, 'isDelete': bool(0)})
        if isexit:
            return True
        return False


    @classmethod
    def copy_cloudDiagnosis_customDiagnosis(cls, diagonsis_idList, parent_id=None):
        try:
            result = cls.find_need_cpoy_customDiagnosis(diagonsis_idList, parent_id)
            if len(result) > 0:
                cls._collection_cloudDiagnosis.insert_many(result)
        except Exception as e:
            print('copy_cloudDiagnosis_customDiagnosis error:' + e.__str__())
            logging.error('copy_cloudDiagnosis_customDiagnosis error:' + e.__str__())
            return False
        return result

    @classmethod
    def find_need_cpoy_customDiagnosis(cls, diagonsis_idList, parent_id=None):
        rt = []
        obid_list = []
        for data_id in diagonsis_idList:
            obid_list.append(ObjectId(data_id))

        result_temp = cls._collection_cloudDiagnosis.find({'_id': {'$in': obid_list}})
        if result_temp:
            for item in result_temp:
                moduleName_temp = item.get('moduleName')
                projId = item.get('projId')
                i = 1
                while True:
                    moduleName = moduleName_temp + '_' + str(i)
                    if not cls.isexist_cloudDiagnosis(moduleName, projId):
                        break
                    i = i + 1

                rt.append({'moduleName': moduleName,
                           'format': item.get('format'), 'isDelete': item.get('isDelete'),
                           'isFolder': item.get('isFolder'), 'Parent': parent_id if parent_id else item.get('Parent'),
                           'isParent': item.get('isParent'),
                           'diagName': item.get('diagName'), 'classifyName': item.get('classifyName'),
                           'equipmentName': item.get('equipmentName'), 'logic': item.get('logic'),
                           'faultDescription': item.get('faultDescription'), 'projId': item.get('projId')})

        return rt


    @classmethod
    def remove_cloudDiagnosis_customDiagnosis(cls, IdList):
        rt = False
        try:
            if isinstance(IdList, str):
                IdList = [IdList]
            if isinstance(IdList, list):
                dbrv = cls._collection_cloudDiagnosis.update(
                    {'_id': {'$in': [ObjectId(x) for x in IdList if ObjectId.is_valid(x)]}},
                    {'$set': {'isDelete': bool(1)}})
                if dbrv.get('ok'):
                    rt = True
        except Exception as e:
            print('remove_cloudDiagnosis_customDiagnosis error:' + e.__str__())
            logging.error('remove_cloudDiagnosis_customDiagnosis error:' + e.__str__())
        return rt

    @classmethod
    def get_cloudDiagnosis_customDiagnosis(cls, filter):
        rt = []
        cursor = None
        try:
            if isinstance(filter, dict):
                for key in filter.keys():
                    value = filter.get(key)
                    if key == '_id':
                        value = ObjectId(value)
                    elif key == 'projId':
                        value = int(value)
                    filter.update({key: value})
                filter.update({'isDelete': bool(0)})
                cursor = cls._collection_cloudDiagnosis.find(filter)
                for item in cursor:
                    rt.append({'_id': item.get('_id').__str__(), 'moduleName': item.get('moduleName'),
                               'format': item.get('format'),
                               'diagName': item.get('diagName'), 'classifyName': item.get('classifyName'),
                               'equipmentName': item.get('equipmentName'), 'logic': item.get('logic'),
                               'faultDescription': item.get('faultDescription'), 'projId': item.get('projId')})
        except Exception as e:
            print('get_cloudDiagnosis_customDiagnosis error:' + e.__str__())
            logging.error('get_cloudDiagnosis_customDiagnosis error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_cloudDiagnosis_customDiagnosis_tree(cls, filter):
        rt = []
        result_temp = {}
        cursor = None
        try:
            if isinstance(filter, dict):
                has_parm_parent = False
                for key in filter.keys():
                    value = filter.get(key)
                    if key == '_id':
                        value = ObjectId(value)
                    elif key == 'projId':
                        value = int(value)
                    elif key == 'Parent':
                        value = str(value)
                        has_parm_parent = True
                    filter.update({key: value})
                filter.update({'isDelete': bool(0)})
                if not has_parm_parent:
                    filter.update({'Parent': {'$in': [None, -1]}})
                # Parent:{'$in':[null,-1]}
                cursor = cls._collection_cloudDiagnosis.find(filter)
                for item in cursor:
                    rt.append({'_id': item.get('_id').__str__(), 'moduleName': item.get('moduleName'),
                               'format': item.get('format'), 'isFolder': item.get('isFolder'),
                               'Parent': item.get('Parent'), 'isParent': item.get('isParent'),
                               'diagName': item.get('diagName'), 'classifyName': item.get('classifyName'),
                               'equipmentName': item.get('equipmentName'), 'logic': item.get('logic'),
                               'faultDescription': item.get('faultDescription'), 'projId': item.get('projId')})
                    # rt=cls.get_customDiagnosis_tree_do(result_temp)
                    # rt=result_temp
        except Exception as e:
            print('get_cloudDiagnosis_customDiagnosis_tree error:' + e.__str__())
            logging.error('get_cloudDiagnosis_customDiagnosis_tree error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt


    @classmethod
    def get_customDiagnosis_tree_do(cls, dict_rt):
        list = []
        try:
            if len(dict_rt) > 0:
                for key in dict_rt:
                    parentid = dict_rt[key].get('Parent')
                    if parentid:
                        temp_dict = dict_rt.get(parentid)
                        if temp_dict:
                            temp_dict.get('children').append(dict_rt[key])
                    else:
                        list.append(dict_rt[key])
        except Exception as e:
            print('get_customDiagnosis_tree_do error:' + e.__str__())
            logging.error('get_customDiagnosis_tree_do error:' + e.__str__())
        return list 
