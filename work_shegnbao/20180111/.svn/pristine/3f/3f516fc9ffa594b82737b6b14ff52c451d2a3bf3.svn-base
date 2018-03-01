import re

import numpy as np
from bson import ObjectId

from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_tag.TagDict import TagDict
from beopWeb.MongoConnManager import MongoConnManager

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

    def del_groups(self, groupIds, fatherId):
        res = self.update_group({'prt': {'$in': groupIds}, 'type': 'thing'}, {'$set': {'prt': fatherId}})
        if res:
            return self.mdbBb.delete_many({'_id': {'$in': groupIds}, 'type': 'group'})
        else:
            raise Exception('Delete group failed!')


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

    def get_tags_by_group(self, groupId, isAll):
        rt = []
        if ObjectId.is_valid(groupId):
            groupId = ObjectId(groupId)
        else:
            groupId = ''
        self.cursor = self.mdbBb.find({'projId': self.projId, 'prt': groupId}, projection={'_id': 1, 'type': 1, 'tag': 1})
        for item in self.cursor:
            if item.get('type') == 'group':
                if isAll:
                    res = self.get_tags_by_group(item.get('_id'), isAll)
                    rt.extend(res)
                else:
                    continue
            rt.extend(item.get('tag'))
        return list(set(rt))

    def del_tags_by_group(self, groupIds, tags):
        rt = False
        dbrv = self.mdbBb.update({'projId': self.projId, 'prt': {'$in': groupIds}}, {'$pull': {'tag': {'$in': tags}}}, multi=True)
        if dbrv:
            if dbrv.get('ok'):
                rt = True
        return rt


class TagThing:
    '''
    Thing = {'_id': ObjectId(), 'name': 'CH01', 'type': 'thing',
             'keywords': [], 'prt': ObjectId(),
             'tag': ['tag001', 'tag002'],
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

    def get_things_count(self, query):
        if isinstance(query, dict):
            query.update({'type': self.type, 'projId': self.projId})
            return self.mdbBb.count(query)
        else:
            return 0

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

    def get_point_by_equipment(self, equipment, equ_tag):
        rt = {}
        ids = []
        query = {'projId': self.projId, 'type': self.type, 'tag': {'$in': equ_tag}}
        for e in equipment.keys():
            value = equipment.get(e)
            if value:
                attrp_k = 'attrP.' + e
                query.update({attrp_k: {'$in': value}})
        tag_dict = TagDict.get_dict()
        self.cursor = self.mdbBb.find(query)
        for item in self.cursor:
            tag_list = item.get('tag')
            tag = 'Unknow'
            for t in tag_list:
                if tag_dict.get(t):
                    if tag_dict.get(t).get('type') == 'Equipment':
                        tag = t
            eq = '%s||%s||%s||%s||%s||%s' % (tag,
                                             item.get('attrP').get('Floor') if 'Floor' in equipment.keys() else None,
                                             item.get('attrP').get('Zone') if 'Zone' in equipment.keys() else None,
                                             item.get('attrP').get('SubZone') if 'SubZone' in equipment.keys() else None,
                                             item.get('attrP').get('EquipNum') if 'EquipNum' in equipment.keys() else None,
                                             item.get('attrP').get('Net') if 'Net' in equipment.keys() else None)
            if eq in rt.keys():
                rt.get(eq).append({'_id': item.get('_id').__str__(),
                                   'name': item.get('name')})
            else:
                rt.update({eq: [{'_id': item.get('_id').__str__(),
                                 'name': item.get('name')}]})
            ids.append(item.get('_id').__str__())
        return rt, ids

    def get_thing_list_sort_by_keywords(self, groupIds):
        rt = []
        query = {'projId': self.projId, 'prt': {'$in': [ObjectId(g) for g in groupIds if ObjectId.is_valid(g)]},
                 'type': self.type}
        self.cursor = self.mdbBb.find(query, sort=[('keywords', 1), ('name', 1)])
        for item in self.cursor:
            keyWords = item.get('keywords')
            valid_key_list = []
            for key in keyWords:
                if key.isalpha():
                    valid_key_list.append(key)
            rt.append({'_id': item.get('_id'), 'prt': item.get('prt'), 'name': item.get('name'),
                        'keywords': valid_key_list, 'tag': item.get('tag')})
        return rt

    @classmethod
    def split_point_name(cls, pointName):
        '''
        分析关键字
        '''
        rt = []
        connector_list = [' ', '_', '-']
        if not isinstance(pointName, str):
            pointName = None

        def split_pointName(item_list, connector):
            rt = []
            for item in item_list:
                rt.extend(item.split(connector))
            return rt

        if pointName:
            item_list = [pointName]
            for c in connector_list:
                item_list = split_pointName(item_list, c)
            for item in item_list:
                if cls.judge_is_keyword(item):
                    rt.append(item)
                else:
                    rt.extend(cls.get_keyword_from_itemName(item))
        return list(set(rt))

    @classmethod
    def judge_is_keyword(cls, item):
        rt = False
        if isinstance(item, str):
            if item.isalpha() and item.isupper():
                # 全部为大写字母
                rt = True
            elif item.isalpha() and item.islower():
                # 全部为小写字母
                rt = True
            elif item.isalpha() and item[0].isupper() and item[1:].islower():
                # 首字母大写
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
                        # 全部是大写祖母
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
                        # 首字母大写
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
    def get_keyword_from_itemName(cls, itemName):
        rt = []
        keyword = ''
        first = itemName[0]
        if len(itemName) >= 2:
            if first.isalpha() and first.isupper():
                # 首字母大写
                keyword = first
                if itemName[1].isalpha() and itemName[1].isupper():
                    # 全部是大写祖母
                    for i in range(1, len(itemName)):
                        if itemName[i].isalpha() and itemName[i].isupper():
                            keyword += itemName[i]
                        elif itemName[i].isalpha() and itemName[i].islower():
                            i -= 1
                            keyword = keyword[:-1]
                            break
                        elif itemName[i].isdigit():
                            if keyword[-1] in ['W', 'N', 'E', 'S', 'L']:
                                i -= 1
                                keyword = keyword[:-1]
                        else:
                            break
                elif itemName[1].isalpha() and itemName[1].islower():
                    # 首字母大写
                    for i in range(1, len(itemName)):
                        if itemName[i].isalpha() and itemName[i].islower():
                            keyword += itemName[i]
                        else:
                            break
                elif itemName[1].isdigit():
                    # 大写字母加数字
                    for i in range(1, len(itemName)):
                        if itemName[i].isdigit():
                            keyword += itemName[i]
                        else:
                            break
                else:
                    keyword = ''
                    i = 1
            elif first.isalpha() and first.islower():
                # 首字母小写
                keyword = first
                if itemName[1].isalpha() and itemName[1].islower():
                    # 全部是小写字幕
                    for i in range(1, len(itemName)):
                        if itemName[i].isalpha() and itemName[i].islower():
                            keyword += itemName[i]
                        else:
                            break
                elif itemName[1].isdigit():
                    # 小写字母加数字
                    for i in range(1, len(itemName)):
                        if itemName[i].isdigit():
                            keyword += itemName[i]
                        else:
                            break
                else:
                    keyword = ''
                    i = 1
            elif first.isdigit():
                # 首字母是数字
                if itemName[1].isdigit():
                # 全部是数字
                    for i in range(1, len(itemName)):
                        if itemName[i].isdigit():
                            continue
                        else:
                            break
                else:
                    i = 1
            else:
                i = 1
                itemName = ''
            if keyword:
                rt.append(keyword)
            if i < len(itemName) - 1:
                itemName = itemName[i:]
            else:
                itemName = ''
        else:
            itemName = ''
        if itemName:
            rt.extend(cls.get_keyword_from_itemName(itemName))
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

    @classmethod
    def get_point_count_by_groupId_V2(cls, group_count_dic, groupId):
        group_info = group_count_dic.get(groupId.__str__())
        if group_info:
            # 首先获取点的数量
            rt = group_info.get('pointCount')
            group_info.update({'noGroupPointCount': rt})
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
            group_info = {'noGroupPointCount': 0}
        return rt, group_info.get('noGroupPointCount', 0)

    @classmethod
    def get_rdt_map(cls, projId, thingsNameList):
        rtd_map = {}
        dj = BEOPDataAccess.getInstance().get_realtime_data(projId, thingsNameList)
        for i in dj:
            if isinstance(i, dict):
                pname = i.get('name')
                pvalue = i.get('value')
                if pvalue == 'Null':
                    pvalue = None
                rtd_map.update({pname: pvalue})
        return rtd_map


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
                                      projection={'_id': 1, 'prt': 1, 'name': 1, 'type': 1, 'rule': 1, 'tag': 1, 'attrP': 1, 'equipmentId': 1})
        if self.cursor:
            group_count_dic = TagThing(self.projId).get_point_count()

            # 虚拟未分类目录
            if prt is None and skip == 1:
                rt.append({'_id': '', 'name': '未分类目录', 'prt': '', 'type': 'group', 'pointCount': group_count_dic.get('').get('pointCount')})
            for item in self.cursor:
                if not isOnlyGroup and prt == '':
                    if item.get('type') == 'thing':
                        rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                                   'rule': item.get('rule'),
                                   'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else '',
                                   'tag': item.get('tag'), 'attrP': item.get('attrP')})
                else:
                    rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                               'rule': item.get('rule'),
                               'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else '',
                               'tag': item.get('tag'), 'attrP': item.get('attrP')})
                    if item.get('type') == 'group':
                        cl = TagThing.get_point_count_by_groupId_V2(group_count_dic, item.get('_id').__str__())
                        rt[-1].update({
                            'pointCount': cl[0],
                            'noGroupPointCount': cl[1],
                            'equipmentId': item.get('equipmentId', None)
                        })
        return rt

    def get_thingsTreeNew(self, prt, isOnlyGroup, limit, skip, tagThing, group_count_dic):
        rt = []
        if ObjectId.is_valid(prt):
            query = {'prt': ObjectId(prt), 'projId': self.projId}
        else:
            query = {'prt': '', 'projId': self.projId}
        if isOnlyGroup or not ObjectId.is_valid(prt):
            query.update({'type': 'group'})
        self.cursor = self.mdbBb.find(query, sort=SORT_BY_NAME, limit=limit, skip=(skip - 1) * limit,
                                      projection={'_id': 1, 'prt': 1, 'name': 1, 'type': 1, 'rule': 1, 'tag': 1, 'attrP': 1, 'equipmentId': 1})
        if self.cursor:
            for item in self.cursor:
                rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                           'rule': item.get('rule'),
                           'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else None,
                           'tag': item.get('tag'), 'attrP': item.get('attrP')})
                if item.get('type') == 'group':
                    # cl = self.get_sec_thingsTree(item.get('_id'), isOnlyGroup, group_count_dic)
                    rt[-1].update({
                        'pointCount': tagThing.get_point_count_by_groupId(group_count_dic, item.get('_id').__str__()),
                        'equipmentId': item.get('equipmentId', None)
                    })
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

    def get_detail(self, prt, searchText, hasTag, limit, skip, isAll):
        rt = []
        p_list = []
        rtd_map = {}
        if ObjectId.is_valid(prt):
            query = {'projId': self.projId, 'prt': ObjectId(prt)}
        else:
            query = {'projId': self.projId, 'prt': ''}
        if searchText:
            searchText = Utils.handle_search_text(searchText)
            query.update({'$or': [{'name': {'$regex': searchText, '$options': '$i'}},
                                  {'note': {'$regex': searchText, '$options': '$i'}}]})
        if hasTag:
            if int(hasTag) == 1:
                # 已标记
                query.update({'tag': {'$ne': []}})
            elif int(hasTag) == 2:
                # 未标记
                query.update({'tag': []})
        self.cursor = self.mdbBb.find(query, limit=limit, skip=(skip-1)*limit, sort=SORT_BY_NAME)
        count = self.cursor.count()
        group_count_dic = TagThing(self.projId).get_point_count()
        for item in self.cursor:
            if item.get('type') == 'group':
                rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'),
                           'type': item.get('type'), 'tag': item.get('tag'),
                           'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else None,
                           'attrP': item.get('attrP'), 'rule': item.get('rule'),
                           'hasSubFolder': item.get('hasSubFolder'),
                           'subFolderPattern': item.get('subFolderPattern'),
                           'subFolderPrefix': item.get('subFolderPrefix'),
                           'count':  TagThing.get_point_count_by_groupId(group_count_dic, item.get('_id').__str__())})
                # 临时代码
                if item.get('prt').__str__() == '':
                    if not isAll:
                        # 未分类目录
                        count -= 1
                        rt.pop()
            elif item.get('type') == 'thing':
                rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                           'tag': item.get('tag'), 'attrP': item.get('attrP'),
                           'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else None,
                           'point': item.get('point'), 'note': item.get('note')})
                p_list.append(item.get('name'))
        rtd_map = TagThing.get_rdt_map(self.projId, p_list)
        for r in rt:
            r.update({'value': rtd_map.get(r.get('name'))})
        if rt:
            return rt, count
        else:
            return [], 0

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
            if len(res) < LIMIT:
                skip = -1

        return rt_id, rt_prt

    def search(self, query, limit, skip):
        rt = []
        rtd_map = {}
        p_list = []
        if query:
            query.update({'projId': self.projId})
            self.cursor = self.mdbBb.find(query, limit=limit, skip=limit * (skip-1))
            for item in self.cursor:
                rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                           'tag': item.get('tag'), 'attrP': item.get('attrP'),
                           'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else None,
                           'note': item.get('note')})
                if item.get('type') == 'thing':
                    p_list.append(item.get('name'))
            rtd_map = TagThing.get_rdt_map(self.projId, p_list)
            for r in rt:
                r.update({'value': rtd_map.get(r.get('name'))})
        if rt:
            return rt, self.cursor.count()
        else:
            return [], 0

    def search_tag_analysis(self, tag, searchName, isTree, limit=0, skip=1):
        rt = []
        group_dict = {}
        query = {'projId': self.projId}
        if not isTree:
            query.update({'type': 'thing'})
        if tag and isinstance(tag, list):
            query.update({'$and': []})
            for t in tag:
                query.get('$and').append({'tag': t})
        if searchName:
            if isinstance(searchName, list):
                searchName = ' '.join(searchName)
            query.update({'name': {'$regex': Utils.handle_search_text(searchName)}})

        if limit:
            self.cursor = self.mdbBb.find(query, sort=[('tag', 1)], limit=limit, skip=limit * (skip - 1))
        else:
            self.cursor = self.mdbBb.find(query, sort=[('tag', 1)])
        for item in self.cursor:
            if item.get('type') == 'group':
                group_dict.update({item.get('_id').__str__(): {'_id': item.get('_id').__str__(),
                                                               'name': item.get('name'), 'type': item.get('type'),
                                                               'tag': item.get('tag'), 'attrP': item.get('attrP'),
                                                               'prt': item.get('prt').__str__(),
                                                               'note': item.get('note'), 'children': []}})
            else:
                rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                           'tag': item.get('tag'), 'attrP': item.get('attrP'), 'prt': item.get('prt').__str__(),
                           'note': item.get('note')})
        return rt, group_dict

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
        self.cursor = self.mdbBb.aggregate([{'$match': {'projId': self.projId, 'tag': {'$type': 3}}},
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

    def set_tag_and_attrP(self, query, tag, attrP):
        query.update({'projId': self.projId, 'type': 'thing'})
        dbrv = self.mdbBb.update(query, {'$set': {'tag': tag, 'attrP': attrP}}, multi=True)
        if dbrv:
            if dbrv.get('ok'):
                return True
            else:
                return False
        else:
            return False

    def set_group_tag_and_attrP(self, groupId, tag, attrP):
        dbrv = self.mdbBb.update({'_id': ObjectId(groupId), 'projId': self.projId, 'type': 'group'},
                                 {'$set': {'tag': tag, 'attrP': attrP}})
        if dbrv:
            if dbrv.get('ok'):
                if self.set_tag_and_attrP({'prt': ObjectId(groupId)}, tag, attrP):
                    self.cursor = self.mdbBb.find({'prt': ObjectId(groupId), 'type': 'group'})
                    for item in self.cursor:
                        self.set_group_tag_and_attrP(item.get('_id'), tag, attrP)
                    return True
                else:
                    return False
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
                item_list = list(self.cursor)
                for item in item_list:
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

    def del_group_tag(self, Ids, tag):
        dbrv = self.mdbBb.update({'$or': [{'_id': {'$in': [ObjectId(x) for x in Ids if ObjectId.is_valid(x)]}},
                                          {'prt': {'$in': [ObjectId(x) for x in Ids if ObjectId.is_valid(x)]}}]},
                                 {'$pull': {'tag': tag}, '$unset': {'attrP.' + str(tag): 1}}, multi=True)
        if dbrv:
            if dbrv.get('ok'):
                self.cursor = self.mdbBb.update({'prt': {'$in': [ObjectId(x) for x in Ids if ObjectId.is_valid(x)]},
                                                'type': 'group'})
                item_id_list = [x.get('_id') for x in self.cursor]
                self.del_group_tag(item_id_list, tag)
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

    def set_group_attrP(self, groupId, update):
        dbrv = self.mdbBb.update({'$or': [{'prt': ObjectId(groupId)}, {'_id': ObjectId(groupId)}]},
                                 update, multi=True)
        if dbrv:
            if dbrv.get('ok'):
                self.cursor = self.mdbBb.find({'prt': ObjectId(groupId), 'type': 'group'})
                item_list = list(self.cursor)
                for item in item_list:
                    self.set_group_attrP(item.get('_id'), update)
                return True
            else:
                return False
        else:
            return False

    def get_thingsTree_by_tag(self, prt, tags, searchText, limit, skip):
        rt = []
        or_list = []
        rtd_map = {}
        p_list = []
        for tag in tags:
            or_list.append({'tag': tag})
        if ObjectId.is_valid(prt):
            query = {'projId': self.projId, 'prt': ObjectId(prt), '$or': or_list}
        else:
            query = {'projId': self.projId, 'prt': '', '$or': or_list}
        if searchText:
            searchText = Utils.handle_search_text(searchText)
            query.update({'$or': [{'name': {'$regex': searchText, '$options': '$i'}},
                                  {'note': {'$regex': searchText, '$options': '$i'}}]})
        self.cursor = self.mdbBb.find(query, sort=SORT_BY_NAME, limit=limit, skip=(skip-1)*limit)
        count = self.cursor.count()
        for item in self.cursor:
            rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'type': item.get('type'),
                       'tag': item.get('tag'), 'attrP': item.get('attrP'), 'rules': item.get('rules'),
                       'prt': item.get('prt').__str__() if isinstance(item.get('prt'), ObjectId) else None,
                       'note': item.get('note')})
            if item.get('type') == 'thing':
                p_list.append(item.get('name'))
        rtd_map = TagThing.get_rdt_map(self.projId, p_list)
        for r in rt:
            r.update({'value': rtd_map.get(r.get('name'))})
        if rt:
            return rt, count
        else:
            return [], 0

    def get_tree_branch(self, groupId):
        thingsList = []
        group = self.mdbBb.find_one({'_id': ObjectId(groupId)})
        self.cursor = self.mdbBb.find({'prt': ObjectId(groupId), 'type': 'thing'})
        for item in self.cursor:
            thingsList.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'tag': item.get('tag'),
                               'attrP': item.get('attrP'), 'keywords': item.get('keywords')})
        return group, thingsList

    def get_proj_state(self):
        has_tag = self.mdbBb.find_one({'projId': self.projId}, sort=[('tag', -1)])
        has_group = self.mdbBb.find_one({'projId': self.projId, 'type': 'group'})
        return has_tag, has_group
    
    def get_pointName(self, tagList, atr):
        rt = []
        query = {'projId': self.projId, 'type': 'thing'}
        if tagList:
            query.update({'tag': {'$all': tagList}})
        if atr:
            query.update(atr)
        self.cursor = self.mdbBb.find(query, sort=SORT_BY_NAME)
        for item in self.cursor:
            rt.append({
                item.get('name'):{
                    'tag':item.get('tag'),
                    'atr':item.get('attrP')
                }
            })
        return rt

    def get_pointTag(self, pointList):
        rt = []
        if pointList:
            query = {'projId': self.projId, 'name': {'$in': pointList}, 'type': 'thing'}
        else:
            query = {'projId': self.projId, 'type': 'thing'}
        self.cursor = self.mdbBb.find(query, sort = SORT_BY_NAME)
        for item in self.cursor:
            rt.append({
                item.get('name'):{
                    'tag':item.get('tag'),
                    'atr':item.get('attrP')
                }
            })
        return rt

    def judge_has_tag(self):
        rt = False
        dbrv = self.mdbBb.find_one({'projId': self.projId}, sort=[('tag', -1)])
        if dbrv and dbrv.get("tag"):
            rt = True
        return rt
        
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

    def match_span(self, group):
        res = self.match()
        if res:
            return res.span(group)
        else:
            # print(self.pattern, self.string)
            return None


class super_str(str):
    """
    support for findall()
    """
    def __init__(self, arg):
        super(super_str, self).__init__()
        self.body = arg
 
    def findall(self, arg, start=0):
        body = self.body
        result = []       
        while True:
            pos = body.find(arg, start)
            if pos >= 0:
                result.append(pos)
                start = pos + len(arg)
                continue
            break
        return result
