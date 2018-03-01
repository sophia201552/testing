__author__ = 'win7'
import os
import csv
from beopWeb.MongoConnManager import MongoConnManager



class TagDict:
    @staticmethod
    def get_list():
        storage = []
        with open(os.path.dirname(os.path.realpath(__file__)) + '/basicTag.csv', newline='', encoding='utf8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                storage.append({
                    'name': row[0],
                    'en': row[1],
                    'zh': row[2],
                    'type': row[3] if row[3] else ''
                })
        return storage

    @staticmethod
    def get_dict():
        storage = TagDict.get_list()
        return {item.get('name').upper(): item for item in storage}

    @staticmethod
    def get_equipment_tag_list():
        storage = []
        with open(os.path.dirname(os.path.realpath(__file__)) + '/basicTag.csv', newline='', encoding='utf8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if row[3] == 'Equipment':
                    storage.append(row[0])
        return storage



class TagDictV2:

    def __init__(self):
        self.collection = 'TagDict'
        self.cursor = None
        self.mdbBb = MongoConnManager.getConfigConn().mdbBb[self.collection]

    def __del__(self):
        self.close_cursor()

    def close_cursor(self):
        if self.cursor:
            self.cursor.close()

    def tag_get(self, name=None):
        if name:
            self.cursor = self.mdbBb.find({'name': name})
        else:
            self.cursor = self.mdbBb.find({})
        tag_list = list(self.cursor)
        return tag_list

    def tag_post(self, data):
        if data:
            self.mdbBb.update_one(
            {'name': data.get('name')},
            {'$set': data},
            upsert=True)

    def tag_delete(self, name):
        result = self.mdbBb.delete_one({'name': name})
        if result.deleted_count:
            return True
        else:
            return False
