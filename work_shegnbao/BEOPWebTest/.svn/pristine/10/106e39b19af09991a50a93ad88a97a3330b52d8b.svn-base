__author__ = 'win7'
from beopWeb.BEOPMongoDataAccess import g_pointTable
from beopWeb.MongoConnManager import MongoConnManager
from werkzeug.contrib.cache import SimpleCache
from bson.objectid import ObjectId
import logging


class PointTable:
    cache = SimpleCache()
    db = MongoConnManager.getMongoConnByName().mdbBb[g_pointTable]

    def __init__(self, project_id):
        self.project_id = project_id

    def import_data_to_db(self, data):
        try:
            self.db.delete_many({'projId': self.project_id})
            for item in data:
                self.db.insert_one(item)
            PointTable.cache.set(self.project_id, None)
            return self.get_point_table()
        except:
            logging.error('点表更新错误,项目:' + self.project_id)
            PointTable.cache.set(self.project_id, None)

    def get_point_table(self):
        result = PointTable.cache.get(self.project_id)
        if result:
            return result
        cursor = self.db.find({'projId': self.project_id}, projection={'groupId': False, 'type': False},
                              sort=[('value', 1)])
        result = []
        for item in cursor:
            item['_id'] = str(item.get('_id'))
            result.append(item)
        PointTable.cache.set(self.project_id, result)
        return result

    def is_exists(self, point_value):
        return self.db.find_one({'projId': self.project_id, 'value': point_value})

    def add_point(self, model):
        result = self.db.insert_one(model)
        if result.inserted_id:
            PointTable.cache.clear()
            return result.inserted_id
        else:
            return False

    def delete_points(self, point_list):
        result = self.db.delete_many({'projId': self.project_id, 'value': {'$in': point_list}})
        if result.deleted_count:
            self.cache.clear()
        return result.deleted_count

    def update_many(self, data_list):
        try:
            for item in data_list:
                item['_id'] = ObjectId(item.get('_id'))
                self.db.update_one({'_id': ObjectId(item.get('_id'))}, {'$set': item})
            PointTable.cache.clear()
            return True
        except Exception as e:
            logging.error('point table auto save error' + str(e))
            return False
