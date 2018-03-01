__author__ = 'win7'
from werkzeug.contrib.cache import SimpleCache

from beopWeb.BEOPMongoDataAccess import g_pointSourceType
from beopWeb.MongoConnManager import MongoConnManager


class PointSourceType:
    cache = SimpleCache()

    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_pointSourceType]

    def add(self, source):
        result = self.db.insert_one(source)
        return result.inserted_id

    def update(self, name, model):
        return self.db.update_one({'name': name}, {'$set': model}, upsert=True)

    def is_exist(self, source_name):
        return self.db.count({'name': source_name})

    def get_all(self):
        return self.db.find()

    def get_name_params_map(self):
        result = self.get_all()
        return {item.get('name'): item.get('params') for item in result}

    def delete(self, name):
        return self.db.delete_one({'name': name}, )
