from bson import ObjectId
from beopWeb.MongoConnManager import MongoConnManager
import numpy as np
import re
# from pymongo import ReturnDocument

LIMIT = 500
SORT_BY_NAME = [('type', 1), ('name', 1)]


class TagGroup:

    def __init__(self, projId):
        '''
        Group = {'_id': ObjectId(), 'name': 'CH', 'type': 'group', 'prt': ObjectId() or None,
                 'tag': [], 'attrP': {}, 'rule': [[], []]}
        '''
        self.collection = 'cloudPoint'
        self.type = 'group'
        self.cursor = None
        self.projId = int(projId)
        self.mdbBb = MongoConnManager.getConfigConn().mdbBb[self.collection]

    def __del__(self):
        self.close_cursor()

    def close_cursor(self):
        if self.cursor:
            self.cursor.close()

    def insert_group(self, doc_list):
        if isinstance(doc_list, list):
            for doc in doc_list:
                doc.update({'type': self.type, 'projId': self.projId})
            res = self.mdbBb.insert_many(doc_list)
            rt = []
            for r in res.inserted_ids:
                rt.append(r.__str__())
            return rt
        elif isinstance(doc_list, dict):
            doc_list.update({'type': self.type, 'projId': self.projId})
            res = self.mdbBb.insert(doc_list, {'_id': doc_list.get('_id')})
            return res.__str__()
        else:
            raise Exception('Create failed')

    def get_groups(self, query, limit, skip):
        rt = []
        if isinstance(query, dict):
            query.update({'type': self.type, 'projId': self.projId})
            self.cursor = self.mdbBb.find(query, limit=limit, skip=(skip-1)*limit, sort=SORT_BY_NAME)
            if self.cursor:
                count = self.cursor.count()
                for item in self.cursor:
                    rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'),
                               'type': item.get('type'), 'tag': item.get('tag'),
                               'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else '',
                               'attrP': item.get('attrP'), 'rule': item.get('rule'),
                               'hasSubFolder': item.get('hasSubFolder'),
                               'subFolderPattern': item.get('subFolderPattern'),
                               'subFolderPrefix': item.get('subFolderPrefix')})
            return rt, count
        else:
            return rt, 0

    def get_group(self, groupId):
        return self.mdbBb.find_one({'_id': ObjectId(groupId), 'projId': self.projId, 'type': self.type})

    def is_exist(self, name, prt):
        if ObjectId.is_valid(prt):
            dbrv = self.mdbBb.find_one({'name': name, 'prt': ObjectId(prt), 'projId': self.projId})
        else:
            dbrv = self.mdbBb.find_one({'name': name, 'prt': '', 'projId': self.projId})
        if dbrv:
            return dbrv.get('_id').__str__()
        else:
            return None

    def del_group(self, groupId):
        if ObjectId.is_valid(groupId):
            dbrv = self.mdbBb.find_one_and_delete({'_id': ObjectId(groupId), 'projId': self.projId,
                                                   'type': self.type})
            if dbrv:
                prt = dbrv.get('prt')
                groupId = dbrv.get('_id')
                gList = []
                self.cursor = self.mdbBb.find({'prt': groupId, 'type': self.type, 'projId': self.projId})
                for item in self.cursor:
                    gList.append(item.get('_id').__str__())
                self.mdbBb.update({'prt': ObjectId(groupId), 'projId': self.projId},
                                  {'$set': {'prt': prt}}, multi=True)
                return gList
            else:
                raise Exception("Things can't be deleted")
        else:
            raise Exception('Parameter:groupId Invalid')

    def edit_group(self, groupId, update):
        if not update:
            return True
        return self.update_group({'_id': ObjectId(groupId), 'projId': self.projId, 'type': self.type}, update)

    def update_group(self, query, update):
        dbrv = self.mdbBb.update(query, update, multi=True)
        if dbrv:
            if dbrv.get('ok'):
                return True
            else:
                return False
        else:
            return False


class TagThing:
    '''
    Thing = {'_id': ObjectId(), 'name': 'CH01', 'type': 'thing',
             'keywords': [], 'prt': ObjectId(),
             'tag': {'tag001': {'id': '', 'name': 'tag001'}},
             'attrP': {'tag001': {'power': 'addsa'}},
             'point': 'CH01', 'note': ''}
    '''
    def __init__(self, projId):
        self.collection = 'cloudPoint'
        self.cursor = None
        self.type = 'thing'
        self.projId = int(projId)
        self.mdbBb = MongoConnManager.getConfigConn().mdbBb[self.collection]

    def __del__(self):
        self.close_cursor()

    def close_cursor(self):
        if self.cursor:
            self.cursor.close()

    def get_count(self):
        num = self.mdbBb.count({'projId': self.projId, 'type': self.type})
        return num

    def get_things(self, query, skip, limit=LIMIT):
        if isinstance(query, dict):
            query.update({'type': self.type, 'projId': self.projId})
            self.cursor = self.mdbBb.find(query, limit=limit, skip=(skip - 1) * limit, sort=SORT_BY_NAME)
            return self.format_things(list(self.cursor)), self.cursor.count()
        else:
            return [], 0

    def format_things(self, lst):
        rt = []
        for item in lst:
            rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                       'tag': item.get('tag'), 'attrP': item.get('attrP'),
                       'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else None,
                       'point': item.get('point'), 'note': item.get('note')})
        return rt

    def get_keywords(self, prt, limit=None):
        rt = {}
        if ObjectId.is_valid(prt):
            self.cursor = self.mdbBb.aggregate([{'$match': {'projId': self.projId, 'type': self.type, 'prt': ObjectId(prt)}},
                                                {'$unwind': '$keywords'},
                                                {'$group': {'_id': '$keywords', 'count': {'$sum': 1}}}])
        else:
            self.cursor = self.mdbBb.aggregate([{'$match': {'projId': self.projId, 'type': self.type, 'prt': ''}},
                                                {'$unwind': '$keywords'},
                                                {'$group': {'_id': '$keywords', 'count': {'$sum': 1}}}])
        for item in self.cursor:
            rt.update({item.get('_id'): item.get('count')})
        rt = self.remove_duplicate(rt)
        rt = self.order_dict(rt)
        if limit:
            return rt if len(rt) <= int(limit) else rt[:int(limit)]
        else:
            return rt

    def update_many_things(self, query, **kwargs):
        if isinstance(query, dict):
            query.update({'projId': self.projId, 'type': self.type})
            set_dict = {}
            for key in kwargs.keys():
                value = kwargs.get(key)
                if key == 'name':
                    set_dict.update({'name': value,
                                     'keywords': self.split_point_name(value)})
                elif key == 'prt':
                    if ObjectId.is_valid(value):
                        set_dict.update({'prt': ObjectId(value)})
                    else:
                        set_dict.update({'prt': ''})
                elif key == 'pointName':
                    set_dict.update({'pointName': value})
                elif key == 'note':
                    set_dict.update({'note': value})
            if set_dict:
                dbrv = self.mdbBb.update(query, {'$set': set_dict}, multi=True)
                if dbrv.get('ok'):
                    return True
                else:
                    return False
        else:
            raise Exception('Update things failed')

    def update_things_by_Id(self, **kwargs):
        query = {}
        for key in kwargs.keys():
            value = kwargs.get(key)
            if key == 'name':
                query.update({'name': value,
                              'keywords': self.split_point_name(value)})
            elif key == 'prt':
                if ObjectId.is_valid(value):
                    query.update({'prt': ObjectId(value)})
            elif key == 'pointName':
                query.update({'pointName': value})
            elif key == 'note':
                    query.update({'note': value})
        if query:
            if ObjectId.is_valid(kwargs.get('id')):
                dbrv = self.mdbBb.update({'_id': ObjectId(kwargs.get('id'))}, {'$set': query})
            if dbrv.get('ok'):
                return True
            else:
                return False

    def gen_keywords(self):
        pass

    def get_point_count(self):
        rt = {}
        self.cursor = self.mdbBb.aggregate([{'$match': {'projId': self.projId}},
                                            {'$group': {'_id': {'prt': '$prt', 'type': '$type'},
                                                        'count': {'$sum': 1},
                                                        'Ids': {'$addToSet': '$_id'}}}])
        for item in self.cursor:
            prt = item.get('_id').get('prt').__str__()
            if item.get('_id').get('type') == 'thing':
                if prt in rt.keys():
                    rt.get(prt).update({'pointCount': rt.get(prt).get('pointCount') + item.get('count')})
                else:
                    rt.update({prt: {'pointCount': item.get('count'), 'groupCount': 0, 'Ids': []}})
            elif item.get('_id').get('type') == 'group':
                if prt in rt.keys():
                    rt.get(prt).update({'groupCount': rt.get(prt).get('groupCount') + item.get('count')})
                    rt.get(prt).get('Ids').extend(item.get('Ids'))
                else:
                    rt.update({prt: {'pointCount': 0, 'groupCount': item.get('count'),
                                     'Ids': [x.__str__() for x in item.get('Ids')]}})
        return rt

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
            if item.isalpha() and item.isupper():
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

    @classmethod
    def remove_duplicate(cls, dic):
        rt = {}
        for key in dic.keys():
            if key.isupper():
                if key in rt.keys():
                    rt.update({key: rt.get(key) + dic.get(key)})
                else:
                    rt.update({key: dic.get(key)})
            elif key.islower():
                if key.upper() in rt.keys():
                    rt.update({key.upper(): dic.get(key) + rt.get(key.upper())})
                elif key.upper() in dic.keys():
                    rt.update({key.upper(): dic.get(key)})
            elif key.istitle():
                if key.upper() in rt.keys():
                    rt.update({key.upper(): dic.get(key) + rt.get(key.upper())})
                elif key.upper() in dic.keys():
                    rt.update({key.upper(): dic.get(key)})
                else:
                    rt.update({key: dic.get(key) + rt.get(key, 0)})
        return rt

    @classmethod
    def get_point_count_by_groupId(cls, group_count_dic, groupId):
        group_info = group_count_dic.get(groupId.__str__())
        if group_info:
            # 首先获取点的数量
            rt = group_info.get('pointCount')
            # 判断是否存在子目录
            if group_info.get('groupCount') and group_info.get('Ids'):
                # 存在子目录
                Ids = group_info.get('Ids')
                for i in Ids:
                    rt += cls.get_point_count_by_groupId(group_count_dic, i)
                group_info.update({'pointCount': rt, 'groupCount': 0, 'Ids': []})
        else:
            # 说明 该目录下没有任何数据
            rt = 0
        return rt


class ThingsTree:

    def __init__(self, projId):
        self.collection = 'cloudPoint'
        self.cursor = None
        self.projId = int(projId)
        self.mdbBb = MongoConnManager.getConfigConn().mdbBb[self.collection]

    def __del__(self):
        self.close_cursor()

    def close_cursor(self):
        if self.cursor:
            self.cursor.close()

    def get_thingsTree(self, prt, isOnlyGroup, limit, skip):
        rt = []
        if ObjectId.is_valid(prt):
            query = {'prt': ObjectId(prt), 'projId': self.projId}
        else:
            query = {'prt': '', 'projId': self.projId}
        if isOnlyGroup:
            query.update({'type': 'group'})
        self.cursor = self.mdbBb.find(query, sort=SORT_BY_NAME, limit=limit, skip=(skip - 1) * limit,
                                      projection={'_id': 1, 'prt': 1, 'name': 1, 'type': 1, 'rule': 1})
        if self.cursor:
            group_count_dic = TagThing(self.projId).get_point_count()
            for item in self.cursor:
                rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                           'rule': item.get('rule'),
                           'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else None})
                if item.get('type') == 'group':
                    cl = self.get_sec_thingsTree(item.get('_id'), isOnlyGroup, group_count_dic)
                    rt[-1].update({'children': cl,
                                   'pointCount': TagThing.get_point_count_by_groupId(group_count_dic, item.get('_id').__str__())})
        return rt

    def get_sec_thingsTree(self, prt, isOnlyGroup, group_count_dic):
        cursor = None
        rt = []
        if ObjectId.is_valid(prt):
            query = {'prt': ObjectId(prt), 'projId': self.projId}
        else:
            query = {'prt': '', 'projId': self.projId}
        if isOnlyGroup:
            query.update({'type': 'group'})
        try:
            cursor = self.mdbBb.find(query, sort=SORT_BY_NAME,
                                     projection={'_id': 1, 'prt': 1, 'name': 1, 'type': 1})
            for item in cursor:
                rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                           'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else None,
                           'pointCount': TagThing.get_point_count_by_groupId(group_count_dic, item.get('_id').__str__())})
        except Exception as e:
            pass
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_detail(self, prt, searchText, limit, skip):
        rt = []
        if ObjectId.is_valid(prt):
            query = {'projId': self.projId, 'prt': ObjectId(prt)}
        else:
            query = {'projId': self.projId, 'prt': ''}
        if searchText:
            query.update({'name': {'$regex': searchText, '$options': '$i'}})
        self.cursor = self.mdbBb.find(query, limit=limit, skip=(skip-1)*limit, sort=SORT_BY_NAME)
        count = self.cursor.count()
        for item in self.cursor:
            if item.get('type') == 'group':
                rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'),
                           'type': item.get('type'), 'tag': item.get('tag'),
                           'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else None,
                           'attrP': item.get('attrP'), 'rule': item.get('rule'),
                           'hasSubFolder': item.get('hasSubFolder'),
                           'subFolderPattern': item.get('subFolderPattern'),
                           'subFolderPrefix': item.get('subFolderPrefix')})
                # 临时代码
                if item.get('prt').__str__() == '':
                    count -= 1
                    rt.pop()
            elif item.get('type') == 'thing':
                rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                           'tag': item.get('tag'), 'attrP': item.get('attrP'),
                           'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else None,
                           'point': item.get('point'), 'note': item.get('note')})
        return rt, count

    def get_groups_all(self):
        rt_prt = {}
        rt_id = {}
        tagGroup = TagGroup(self.projId)
        skip = 1

        def format_res(res):
            for item in res:
                rt_id.update({item.get('_id').__str__(): {'name': item.get('name'), '_id': item.get('_id').__str__(),
                                                          'prt': item.get('prt').__str__(), 'type': item.get('type'),
                                                          'children': []}})
                if item.get('prt').__str__() in rt_prt.keys():
                    rt_prt.get(item.get('prt').__str__()).append({'name': item.get('name'), '_id': item.get('_id').__str__(),
                                                                  'prt': item.get('prt').__str__(), 'type': item.get('type'),
                                                                  'children': []})
                else:
                    rt_prt.update({item.get('prt').__str__(): [{'name': item.get('name'), '_id': item.get('_id').__str__(),
                                                                'prt': item.get('prt').__str__(), 'type': item.get('type'),
                                                                'children': []}]})

        while skip >= 1:
            res, count = tagGroup.get_groups({}, LIMIT, skip)
            skip += 1
            format_res(res)
            if len(res) <= LIMIT:
                skip = -1

        return rt_id, rt_prt

    def search(self, query, limit, skip):
        rt = []
        if query:
            query.update({'projId': self.projId})
            self.cursor = self.mdbBb.find(query, limit=limit, skip=limit * (skip-1))
            for item in self.cursor:
                rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                           'tag': item.get('tag'), 'attrP': item.get('attrP'),
                           'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else None,
                           'note': item.get('note')})
        if rt:
            return rt, self.cursor.count()
        else:
            return [], 0

    def get_public_tag(self):
        rt = []
        # http://stackoverflow.com/questions/32512764/mongodb-match-an-array-with-type
        self.cursor = self.mdbBb.aggregate([{'$match': {'tag.0': {'$exists': True}}},
                                            {'$unwind': '$tag'},
                                            {'$group': {'_id': '$tag', 'count': {'$sum': 1}}}])
        for item in self.cursor:
            rt.append({'name': item.get('_id'), 'count': item.get('count')})
        return rt

    def get_personal_tag(self):
        rt = []
        self.cursor = self.mdbBb.aggregate([{'$match': {'projId': self.projId}},
                                            {'$unwind': '$tag'},
                                            {'$group': {'_id': '$tag', 'count': {'$sum': 1}}}])
        for item in self.cursor:
            rt.append({'name': item.get('_id'), 'count': item.get('count')})
        return rt

    def set_tag(self, Ids, tag):
        dbrv = self.mdbBb.update({'_id': {'$in': [ObjectId(x) for x in Ids if ObjectId.is_valid(x)]}},
                                 {'$addToSet': {'tag': tag}}, multi=True)
        if dbrv:
            if dbrv.get('ok'):
                return True
            else:
                return False
        else:
            return False

    def set_group_tag(self, groupId, tag):
        for t in tag:
            dbrv = self.mdbBb.update({'prt': ObjectId(groupId)}, {'$addToSet': {'tag': t}}, multi=True)
        if dbrv:
            if dbrv.get('ok'):
                self.cursor = self.mdbBb.find({'prt': ObjectId(groupId), 'type': 'group'})
                for item in self.cursor:
                    self.set_group_tag(item.get('_id').__str__(), tag)
                return True
            else:
                return False
        else:
            return False

    def del_tag(self, Ids, tag):
        dbrv = self.mdbBb.update({'_id': {'$in': [ObjectId(x) for x in Ids if ObjectId.is_valid(x)]}},
                                 {'$pull': {'tag': tag}, '$unset': {'attrP.' + str(tag): 1}}, multi=True)
        if dbrv:
            if dbrv.get('ok'):
                return True
            else:
                return False
        else:
            return False

    def set_attrP(self, Id, update):
        dbrv = self.mdbBb.update({'_id': ObjectId(Id)}, update)
        if dbrv:
            if dbrv.get('ok'):
                return True
            else:
                return False
        else:
            return False

    def get_thingsTree_by_tag(self, prt, tags, searchText, limit, skip):
        rt = []
        or_list = []
        for tag in tags:
            or_list.append({'tag': tag})
        if ObjectId.is_valid(prt):
            query = {'projId': self.projId, 'prt': ObjectId(prt), '$or': or_list}
        else:
            query = {'projId': self.projId, 'prt': '', '$or': or_list}
        if searchText:
            query.update({'name': {'$regex': searchText, '$options': '$i'}})
        self.cursor = self.mdbBb.find(query, sort=SORT_BY_NAME, limit=limit, skip=(skip-1)*limit)
        count = self.cursor.count()
        for item in self.cursor:
            rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                       'tag': item.get('tag'), 'attrP': item.get('attrP'), 'rules': item.get('rules'),
                       'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else None,
                       'note': item.get('note')})
        if rt:
            return rt, count
        else:
            return [], 0


class matching:

    def __init__(self, pattern, string, flag=0):
        self.flag = re.I if flag else 0
        self.pattern = pattern
        self.string = string

    def match(self):
        return re.match(self.pattern, self.string, self.flag)

    def search(self):
        return re.search(self.pattern, self.string, self.flag)

    def match_group(self, group):
        return self.match().group(group)

    def search_group(self, group):
        return self.search().group(group)

