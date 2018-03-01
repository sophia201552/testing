__author__ = 'yan'

import logging

class ImportData:

    #insert_data = []
    #insert_point = []
    #insertTimeSpan = []
    #insertDBName = ''

    _importData = {}

    def __init__(self):
        pass

    @classmethod
    def init_import_data(cls, userId):
        rt = {'insert_data':[], 'insert_point':[], 'insertTimeSpan':[], 'insertDBName':''}
        try:
            cls._importData.update({int(userId):rt})
        except Exception as e:
            print('init_import_data error:' + e.__str__())
            logging.error('init_import_data error:' + e.__str__())
        return cls._importData.get(int(userId))

    @classmethod
    def get_import_data(cls, userId):
        userId = int(userId)
        if userId in cls._importData.keys():
            return cls._importData.get(int(userId))
        else:
            cls.init_import_data(userId)
            cls.get_import_data(userId)

    @classmethod
    def del_import_data(cls, userId):
        userId = int(userId)
        if userId in cls._importData.keys():
            del cls._importData[userId]