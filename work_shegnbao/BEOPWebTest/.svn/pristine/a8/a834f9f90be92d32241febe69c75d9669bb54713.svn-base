__author__ = 'win7'
from beopWeb.BEOPMongoDataAccess import g_table_tags
from beopWeb.MongoConnManager import MongoConnManager
from pymongo import ReturnDocument


class Tag:
    name = None
    level = None  # Tag级别
    desc = None

    type = None

    def __init__(self, name=name, level=level):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_tags]
        self.name = name
        self.level = level

    @staticmethod
    def get_tags_map():
        db = MongoConnManager.getConfigConn().mdbBb[g_table_tags]
        return {tag.get('name'): tag for tag in db.find()}

    @staticmethod
    def get_tags_id_map():
        db = MongoConnManager.getConfigConn().mdbBb[g_table_tags]
        return {str(tag.get('_id')): tag for tag in db.find()}

    @staticmethod
    def get_by_name(name):
        if not name:
            return None
        db = MongoConnManager.getConfigConn().mdbBb[g_table_tags]
        return db.find_one({'name': name.strip()})

    def make_tag_mode(self):
        return {'name': self.name.strip(), 'level': self.level, 'desc': self.desc}

    def save(self):
        return self.db.find_one_and_update({'name': self.name.strip()}, {'$set': self.make_tag_mode()}, upsert=True,
                                           return_document=ReturnDocument.AFTER)
