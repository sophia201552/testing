from bson import ObjectId
from beopWeb.MongoConnManager import MongoConnManager
import numpy as np
from pymongo import ReturnDocument

LIMIT = 500
SORT_BY_NAME = [('name', 1)]


class TagGroup:

    def __int__(self, projId, Name=None, groupId=None, Prt=None):
        self.collection = 'ThingsTree_' + str(projId)
        self.type = 'group'
        group = {}
        if groupId:
            group = self._get_group_by_Id(groupId)
        elif Name and Prt:
            group = self._get_groupId(Name, Prt)
        self.groupId = group.get('_id')
        self.name = group.get('name')
        self.prt = group.get('prt')
        self.rule = group.get('rule', [])
        self.tag = group.get('tag', {})

    def _get_groupId_by_name(self, name, Prt):
        cnn = MongoConnManager.getHisConn()
        if ObjectId.is_valid(Prt):
            group = cnn.mdbBb[self.collection].find_one({'name': name, 'prt': ObjectId(Prt),
                                                         'type': self.type})
        else:
            group = cnn.mdbBb[self.collection].find_one({'name': name, 'prt': None,
                                                         'type': self.type})
        if group:
            return group
        else:
            return {'name': name, '_id': ObjectId()}

    def _get_group_by_Id(self, Id):
        cnn = MongoConnManager.getHisConn()
        if ObjectId.is_valid(Id):
            group = cnn.mdbBb[self.collection].find_one({'_id': ObjectId(Id), 'type': self.type})
            if group:
                return group
            else:
                raise Exception('TagDir error:group not exist')
        else:
            raise Exception('TagDir error:Id not ObjectId type')


class TagThing:
    '''
    Thing = {'_id': ObjectId(), 'name': 'CH01', 'type': 'thing',
             'keywords': [], 'prt': ObjectId(),
             'tag': {'tag001': {'id': ObjectId(), 'name': 'tag001'}},
             'attrP': {'tag001': {'power': 'addsa'}}}
    '''
    def __init__(self, projId):
        self.collection = 'ThingsTree_' + str(projId)
        self.mdbBb = MongoConnManager.getConfigConn().mdbBb[self.collection]
        self.cursor = None
        self.type = 'thing'

    def __del__(self):
        self.close_cursor()

    def close_cursor(self):
        if self.cursor:
            self.cursor.close()

    def get_thing_by_Id(self, thingId):
        if ObjectId.is_valid(thingId):
            thing = self.mdbBb.find_one({'_id': ObjectId(thingId), 'type': self.type})
        else:
            thing = {}
        return thing

    def get_things_by_IdList(self, thingsIds):
        rt = []
        if isinstance(thingsIds, list):
            self.cursor = self.mdbBb.find({'_id': {'$in': [ObjectId(i) for i in thingsIds if ObjectId.is_valid(i)]},
                                           'type': self.type}, sort=SORT_BY_NAME)
            rt = list(self.cursor)
        return rt

    def get_things_by_prt(self, prt=None):
        rt = []
        if ObjectId.is_valid(prt):
            self.cursor = self.mdbBb.find({'prt': ObjectId(prt), 'type': self.type}, sort=SORT_BY_NAME)
            rt = list(self.cursor)
        elif prt is None:
            skip = 0
            while skip >= 0:
                self.cursor = self.mdbBb.find({'prt': None, 'type': self.type}, sort=SORT_BY_NAME, limit=LIMIT, skip=skip)
                temp = list(self.cursor)
                rt.extend(temp)
                skip += 1
                if len(temp) < LIMIT:
                    skip = -1
        return rt

    def get_keywords(self, prt=None, limit=LIMIT, skip=0):
        rt = []
        if ObjectId.is_valid(prt):
            self.cursor = self.mdbBb.find({'prt': ObjectId(prt), 'type': self.type}, limit=limit, skip=skip * limit)
        else:
            self.cursor = self.mdbBb.find({'prt': None, 'type': self.type}, limit=limit, skip=skip * limit)
        l = list(self.cursor)
        for item in l:
            rt.extend(item.get('keywords'))
        return rt, len(l)

    def get_keywords_by_sorted(self, prt=None):
        rt = []
        skip = 0
        while skip >= 0:
            dbrv, count = self.get_keywords(prt, skip=skip)
            rt.extend(dbrv)
            skip += 1
            if count < LIMIT:
                skip = -1
        rt = self.calc_num_in_list(rt)
        rt = self.order_dict(rt)
        return rt if len(rt) <= 20 else rt[:20]

    def update_things_by_Id(self, **kwargs):
        query = {}
        for key in kwargs.keys:
            value = kwargs.get(key)
            if key == 'name':
                query.update({'name': value,
                              'keywords': self.split_point_name(value)})
            elif key == 'prt':
                if ObjectId.is_valid(value):
                    query.update({'Prt': ObjectId(value)})
            elif key == 'pointName':
                query.update({'pointName': value})
        if query:
            if ObjectId.is_valid(kwargs.get('id')):
                dbrv = self.mdbBb.update({'_id': ObjectId(kwargs.get('id'))}, {'$set': query})
            if dbrv.get('ok'):
                return True
            else:
                return False

    @classmethod
    def split_point_name(cls, things):
        rt = []
        if isinstance(things, dict):
            thingsName = things.get('name')
        elif isinstance(things, str):
            thingsName = things
        else:
            thingsName = None
        if thingsName:
            item_list = thingsName.split(' ')
            for item in item_list:
                i_list = item.split('_')
                for i in i_list:
                    if cls.judge_is_keyword(i):
                        rt.append(i)
                    else:
                        rt.extend(cls.split_long_name(i))
        return list(set(rt))

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
                            if longname[i].isupper():
                                # if longname[i].isupper():
                                #     if longname[i-1].isdigit():
                                #         i -= 1
                                #         break
                                keyword += longname[i]
                            else:
                                if longname[i].islower() and longname[i-1].isupper():
                                    keyword = keyword[:-1]
                                    i -= 1
                                break
                    elif longname[1].islower():
                        keyword += longname[1]
                        for i in range(2, len(longname)):
                            if longname[i].islower():
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
    def calc_num_in_list(cls, lst):
        return dict(zip(*np.unique(lst, return_counts=True)))

    @classmethod
    def order_dict(cls, dic):
        return sorted(dic.items(), key=lambda item: item[1], reverse=True)
