
from beopWeb.MongoConnManager import MongoConnManager
import logging
from bson import ObjectId

class dataTaskDBOperator:

    _collection = MongoConnManager.getConfigConn().mdbBb['DataTaskConfig']

    @classmethod
    def insert(cls, projId, data):
        rt = None
        try:
            data.update({'projId':projId})
            rt = dataTaskDBOperator._collection.insert_one(data)
        except Exception as e:
            logging.error(e)
        return rt.inserted_id

    @classmethod
    def update(cls, query, update):
        rt = False
        try:
            r = dataTaskDBOperator._collection.update_one(query, {'$set':update})
            if r.raw_result.get('updatedExisting'):
                rt = True
        except Exception as e:
            logging.error(e)
        return rt

    @classmethod
    def delete(cls, projId, type, ids):
        rt = False
        try:
            query = {'projId':projId}
            if type is not None:
                query.update({'type':type})
            if ids:
                query.update({'_id':{'$in':[ObjectId(x) for x in ids if ObjectId.is_valid(x)]}})
            r = dataTaskDBOperator._collection.delete_many(query)
            if r.deleted_count > 0:
                rt = True
        except Exception as e:
            logging.error(e)
        return rt

    @classmethod
    def get(cls, projId, type, ids):
        rt = []
        try:
            cursor = None
            query = {'projId':projId}
            if type is not None:
                query.update({'type':type})
            if ids:
                query.update({'_id':{'$in':[ObjectId(x) for x in ids if ObjectId.is_valid(x)]}})
            cursor = dataTaskDBOperator._collection.find(query)
            for item in cursor:
                item.update({'_id':item.get('_id').__str__()})
                rt.append(item)
        except Exception as e:
            logging.error(e)
        finally:
            if cursor:
                cursor.close()
        return rt