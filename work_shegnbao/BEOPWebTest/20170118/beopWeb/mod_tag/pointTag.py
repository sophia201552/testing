from bson import ObjectId
import logging
from copy import deepcopy

from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPMongoDataAccess import g_tableDataSource
from beopWeb.mod_tag.Tag import TagThing, TagGroup, ThingsTree, matching, LIMIT
from beopWeb.mod_tag.Constants import KeyWordType, RulesType


class pointTag:
    def __init__(self):
        pass

    @classmethod
    def sync_cloud_point_to_thingTree(cls, projId, ObId=None):
        rt = False
        try:
            if cls.contrast_cloud_point_from_thingsTree_dataSource(projId):
                if cls.set_cloud_point_to_thingsTree(projId):
                    rt = True
        except Exception as e:
            print('sync_cloud_point_to_thingTree error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def get_cloud_point_from_dataSource(self, projId, ObId=None, limit=500, skip=0):
        rt = []
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            if ObId:
                if ObjectId.is_valid(ObId):
                    cursor = cnn.mdbBb[g_tableDataSource].find({'_id': ObjectId(ObId)},
                                                               projection={'_id': 1, 'value': 1, 'alias': 1})
                else:
                    raise Exception('Invalid parameter')
            else:
                cursor = cnn.mdbBb[g_tableDataSource].find({'projId': int(projId), 'type': 4},
                                                           projection={'_id': 1, 'value': 1, 'alias': 1},
                                                           limit=int(limit), skip=int(skip), sort=[('_id', 1)])
            rt = list(cursor)
        except Exception as e:
            print('get_cloud_point_from_dataSource error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def set_cloud_point_to_thingsTree(self, projId):
        rt = False
        # collection = 'ThingsTree_' + str(projId)
        collection = 'cloudPoint'
        cursor = None
        try:
            n = 0
            limit = 500
            cnn = MongoConnManager.getConfigConn()
            ids_excess = []
            while n >= 0:
                ids_datasource = self.get_cloud_point_from_dataSource(projId, limit=limit, skip=n*limit)
                num = len(ids_datasource)
                cursor = cnn.mdbBb[collection].find({'_id': {'$in': [d.get('_id') for d in ids_datasource]}},
                                                    projection={'_id': 1}, sort=[('_id', 1)])
                if cursor.count() < num:
                    ids_thingstree = list(cursor)
                    for x in range(num):
                        try:
                            temp = ids_thingstree[x]
                        except Exception as e:
                            ids_excess.append({'_id': ids_datasource[x].get('_id'), 'name': ids_datasource[x].get('value'),
                                               'prt': '', 'type': 'thing', 'tag': [], 'attrP': {},
                                               'projId': int(projId), 'note': ids_datasource[x].get('alias'),
                                               'keywords': TagThing.split_point_name(ids_datasource[x].get('value'))})
                            ids_thingstree.insert(x, {'_id': ids_datasource[x].get('_id')})
                        if ids_datasource[x].get('_id') != ids_thingstree[x].get('_id'):
                            ids_excess.append({'_id': ids_datasource[x].get('_id'), 'name': ids_datasource[x].get('value'),
                                               'prt': '', 'type': 'thing', 'tag': [], 'attrP': {},
                                               'projId': int(projId), 'note': ids_datasource[x].get('alias'),
                                               'keywords': TagThing.split_point_name(ids_datasource[x].get('value'))})
                            ids_thingstree.insert(x, {'_id': ids_datasource[x].get('_id')})
                if num == limit:
                    n = n + 1
                else:
                    n = -1
            if ids_excess:
                cnn.mdbBb[collection].insert_many(ids_excess)
            rt = True
        except Exception as e:
            print('set_cloud_point_to_thingsTree' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def contrast_cloud_point_from_thingsTree_dataSource(cls, projId):
        rt = False
        # collection = 'ThingsTree_' + str(projId)
        collection = 'cloudPoint'
        cursor = None
        try:
            n = 0
            limit = 500
            cnn = MongoConnManager.getConfigConn()
            ids_excess = []
            data_diff = []
            while n >= 0:
                ids_thingstree = cls.get_cloud_point_from_thingsTree(projId, limit=limit, skip=n * limit)
                cursor = cnn.mdbBb[g_tableDataSource].find({'_id': {'$in': [d.get('_id') for d in ids_thingstree]},
                                                            'projId': int(projId), 'type': 4},
                                                           projection={'_id': 1, 'value': 1, 'alias': 1}, sort=[('_id', 1)])
                num = len(ids_thingstree)
                if cursor.count() < num:
                    ids_datasource = list(cursor)
                    for x in range(num):
                        try:
                            temp = ids_datasource[x]
                        except Exception as e:
                            ids_excess.append(ids_thingstree[x].get('_id'))
                            ids_datasource.insert(x, ids_thingstree[x])
                        if ids_thingstree[x].get('_id') != ids_datasource[x].get('_id'):
                            ids_excess.append(ids_thingstree[x].get('_id'))
                            ids_datasource.insert(x, ids_thingstree[x])
                        elif ids_thingstree[x].get('name') != ids_datasource[x].get('value'):
                            data_diff.append({'_id': ids_datasource[x].get('_id'),
                                              'name': ids_datasource[x].get('value'),
                                              'note': ids_datasource[x].get('alias')})
                        elif ids_thingstree[x].get('note') != ids_datasource[x].get('alias'):
                            data_diff.append({'_id': ids_datasource[x].get('_id'),
                                              'name': ids_datasource[x].get('value'),
                                              'note': ids_datasource[x].get('alias')})
                if num == limit:
                    n = n + 1
                else:
                    n = -1
            if ids_excess:
                cnn.mdbBb[collection].delete_many({'_id': {'$in': ids_excess}})
            if data_diff:
                for i in data_diff:
                    TagThing(projId).update_things_by_Id(id=i.get('_id'), name=i.get('name'), note=i.get('note'))
            rt = True
        except Exception as e:
            print('contrast_cloud_point_from_thingsTree_dataSource error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_cloud_point_from_thingsTree(cls, projId, limit=500, skip=0):
        rt = []
        # collection = 'ThingsTree_' + str(projId)
        collection = 'cloudPoint'
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb[collection].find({'$or': [{'type': None}, {'type': 'thing'}], 'projId': int(projId)},
                                                limit=limit, skip=skip,
                                                projection={'_id': 1, 'name': 1, 'note': 1}, sort=[('_id', 1)])
            rt = list(cursor)
        except Exception as e:
            print('get_cloud_point_from_thingsTree error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_keywords(cls, projId, prt=None, limit=None):
        rt = []
        res = TagThing(projId).get_keywords(prt=prt, limit=limit)
        if res:
            for i in res:
                rt.append({'key': i[0], 'count': int(i[1])})
        return rt

    @classmethod
    def get_thingsList_by_keywords(cls, projId, keywords, prt, limit, skip):
        orlist = []
        for keyword in keywords:
            re = '^%s$' % keyword
            orlist.append({'keywords': {'$regex': re, '$options': '$i'}})
        if ObjectId.is_valid(prt):
            query = {'prt': ObjectId(prt), '$or': orlist}
        else:
            query = {'prt': '', '$or': orlist}
        Things = TagThing(projId)
        if limit is None or skip is None:
            skip = 0
            rt = []
            while skip >= 0:
                res, count = Things.get_things(query, skip + 1, limit=LIMIT)
                rt.extend(res)
                skip += 1
                if len(res) < LIMIT:
                    skip = -1
        else:
            rt, count = Things.get_things(query, skip, limit=limit)
        return {'ThingsList': rt, 'count': count, 'limit': limit, 'skip': skip if skip >= 0 else None}

    @classmethod
    def regenerate_the_keywords(cls, projId):
        pass

    @classmethod
    def match_things_by_groupRule(cls, projId, rules, prt=None, limit=None, skip=None):
        things = TagThing(projId)
        re = cls.make_rule_to_query(rules)
        if re:
            query = {'name': {'$regex': re}}
        else:
            query = {}
        if ObjectId.is_valid(prt):
            query.update({'prt': ObjectId(prt)})
        else:
            query.update({'prt': ''})
        if limit is None or skip is None:
            skip = 1
            rt = []
            while skip >= 1:
                res, count = things.get_things(query, skip, limit=LIMIT)
                rt.extend(res)
                skip += 1
                if len(res) < LIMIT:
                    skip = -1
        else:
            rt, count = things.get_things(query, skip, limit=limit)
        return {'ThingsList': rt, 'count': count, 'limit': limit if skip > 0 else None, 'skip': skip if skip > 0 else None}

    @classmethod
    def make_rule_to_query(cls, rules):
        query = '^'
        for rule in rules:
            rule_type = int(rule.get('type'))
            rule_value = rule.get('value')
            if rule_type == RulesType.RULE_NO_LIMIT:
                query = query + '(.*?)'
            elif rule_type == RulesType.RULE_FIXED_STRING:
                query = query + '(%s)' % rule_value
            elif rule_type == RulesType.RULE_FIXED_NUMBER:
                query = query + '([0-9]{%s})' % (rule_value)
            elif rule_type == RulesType.RULE_VAR_NUMBER:
                query = query + '([0-9]+)'
            else:
                raise Exception('Parameter:type error')
        if query == '^':
            query = None
        else:
            query = query + '$'
        return query

    @classmethod
    def create_new_group(cls, projId, prt, folderName, rules, hasSubFolder, subFolderPrefix):
        doc = None
        error = None
        thingsList = []
        if rules:
            tList = cls.match_things_by_groupRule(projId, rules, prt)
            thingsList.extend(tList.get('ThingsList'))
        gId = TagGroup(projId).is_exist(folderName, prt)
        if gId:
            if rules:
                query = {'_id': {'$in': [ObjectId(x.get('_id')) for x in thingsList if ObjectId.is_valid(x.get('_id'))]}}
                TagThing(projId).update_many_things(query, prt=gId)
                error = cls.edit_new_group(projId, gId, rules=rules, subFolderPrefix=subFolderPrefix)
            return error, gId
        doc = {'_id': ObjectId(), 'name': folderName,
               'prt': ObjectId(prt) if ObjectId.is_valid(prt) else '',
               'tag': [], 'attrP': {}, 'rule': [rules], 'hasSubFolder': hasSubFolder,
               'subFolderPrefix': [subFolderPrefix] if subFolderPrefix else []}
        group = TagGroup(projId)
        gId = group.insert_group(doc)
        if isinstance(gId, str):
            if thingsList:
                id_list = []
                for x in thingsList:
                    if ObjectId.is_valid(x.get('_id')):
                        id_list.append(ObjectId(x.get('_id')))
                query = {'_id': {'$in': id_list}}
                TagThing(projId).update_many_things(query, prt=gId)
                if int(hasSubFolder) == RulesType.RULE_SUBFOLDER_IS:
                    error = cls.make_subFolder(projId, doc.get('_id'), rules, subFolderPrefix, thingsList)
        else:
            error = 'Folder:%s insert failed' % folderName
        return error, gId

    @classmethod
    def make_subFolder(cls, projId, groupId, rules, subFolderPrefix, thingsList):
        error = ''
        re = cls.make_rule_to_query(rules)
        if isinstance(subFolderPrefix, str):
            if '{' in subFolderPrefix and '}' in subFolderPrefix:
                subFolderPattern = subFolderPrefix[subFolderPrefix.find('{') + 1: subFolderPrefix.find('}')]
        try:
            subFolderPattern = int(subFolderPattern)
        except Exception as e:
            error = 'Parameter:subFolderPattern error'
            raise Exception(error)
        subFolderThings = []
        for thing in thingsList:
            name = thing.get('name')
            subname = matching(re, name).match_group(subFolderPattern)
            tem = subFolderPrefix[subFolderPrefix.find('{'): subFolderPrefix.find('}') + 1]
            subFolderName = subFolderPrefix.replace(tem, subname)
            if subFolderName not in subFolderThings:
                subFolderThings.append(subFolderName)
                rules[subFolderPattern-1] = {'type': RulesType.RULE_FIXED_STRING, 'value': subname}
                e, g = cls.create_new_group(projId, groupId, subFolderName, rules,
                                            RulesType.RULE_SUBFOLDER_NO, None)
                if e:
                    if error:
                        error += 'SubFolder:%s create failed. ' % subFolderName
                    else:
                        error = 'SubFolder:%s create failed. ' % subFolderName
        return error

    @classmethod
    def edit_new_group(cls, projId, groupId, **kwargs):
        error = None
        query = {}
        tagGroup = TagGroup(projId)
        doc = tagGroup.get_group(groupId)
        for key in kwargs.keys():
            value = kwargs.get(key)
            if key == 'prt':
                if value is None:
                    continue
                if '$set' not in query.keys():
                    query.update({'$set': {}})
                if ObjectId.is_valid(value):
                    query.get('$set').update({'prt': ObjectId(value)})
                else:
                    query.get('$set').update({'prt': ''})
                if doc:
                    gId = tagGroup.is_exist(doc.get('name'), value)
                    if gId:
                        tagGroup.update_group({'prt': ObjectId(groupId) if ObjectId.is_valid(groupId) else ''},
                                              {'$set': {'prt': ObjectId(gId) if ObjectId.is_valid(gId) else ''}})
                        tagGroup.del_group(groupId)
                        groupId = gId
            elif key == 'folderName' and value:
                if doc:
                    gId = tagGroup.is_exist(value, doc.get('prt').__str__())
                    if gId and gId != groupId:
                        # 存在重名的目录， 将两目录合并
                        tagGroup.update_group({'prt': ObjectId(groupId) if ObjectId.is_valid(groupId) else ''},
                                              {'$set': {'prt': ObjectId(gId) if ObjectId.is_valid(gId) else ''}})
                        tagGroup.del_group(groupId)
                        groupId = gId
                    else:
                        # 不存在重名目录。
                        if '$set' not in query.keys():
                            query.update({'$set': {}})
                        query.get('$set').update({'name': value})
            elif key == 'rules' and value:
                if '$addToSet ' not in query.keys():
                    query.update({'$addToSet': {}})
                query.get('$addToSet').update({'rule': value})
            elif key == 'subFolderPrefix' and value:
                if '$set' not in query.keys():
                    query.update({'$set': {}})
                if '$push' not in query.keys():
                    query.update({'$push': {}})
                query.get('$set').update({'hasSubFolder': RulesType.RULE_SUBFOLDER_IS})
                query.get('$push').update({'subFolderPrefix': value})
        if tagGroup.edit_group(groupId, query):
            if kwargs.get('rules'):
                rules = kwargs.get('rules')
                thingsList = []
                tList = cls.match_things_by_groupRule(projId, rules, groupId)
                thingsList.extend(tList.get('ThingsList'))
                query = {'_id': {'$in': [ObjectId(x.get('_id')) for x in thingsList if ObjectId.is_valid(x.get('_id'))]}}
                TagThing(projId).update_many_things(query, prt=groupId)
                if kwargs.get('subFolderPrefix'):
                    subFolderPrefix = kwargs.get('subFolderPrefix')
                    error = cls.make_subFolder(projId, groupId, rules, subFolderPrefix, thingsList)
        else:
            error = 'Folder edit failed'
        return error

    @classmethod
    def create_group_by_keywords(cls, projId, prt, keywords, folderName):
        gId = None
        thingsList = []
        thingsList.extend(cls.get_thingsList_by_keywords(projId, keywords, prt, None, None).get('ThingsList'))
        doc = {'_id': ObjectId(), 'prt': ObjectId(prt) if ObjectId.is_valid(prt) else '',
               'name': folderName, 'tag': [], 'attrP': {}, 'rule': [],
               'hasSubFolder': RulesType.RULE_FIXED_STRING, 'subFolderPrefix': []}
        gId = TagGroup(projId).is_exist(folderName, prt)
        if gId:
            cls.move_things(projId, [x.get('_id') for x in thingsList], gId)
            return gId
        group = TagGroup(projId)
        gId = group.insert_group(doc)
        if isinstance(gId, str):
            Id_List = [ObjectId(x.get('_id')) for x in thingsList if ObjectId.is_valid(x.get('_id'))]
            TagThing(projId).update_many_things({'_id': {'$in': Id_List}}, prt=gId)
        else:
            error = 'Create folder failed'
            raise Exception(error)
        return gId

    @classmethod
    def get_thingsTree(cls, projId, prt, isOnlyGroup, isAll):
        rt = []
        skip = 1
        tree = ThingsTree(projId)
        if isAll and isOnlyGroup:
            groups_id, groups_prt = tree.get_groups_all()
            little_groups = {}
            for k in groups_id.keys():
                if not groups_prt.get(k):
                    little_groups.update({k: groups_id.get(k)})
            if little_groups:
                while prt not in little_groups.keys():
                    iteration = deepcopy(little_groups)
                    for g in iteration.keys():
                        v = little_groups.get(g)
                        if v.get('prt') in groups_id.keys() or v.get('prt') == '':
                            if v.get('prt') in little_groups.keys():
                                little_groups.get(v.get('prt')).get('children').append(v)
                            elif v.get('prt'):
                                little_groups.update({v.get('prt'): groups_id.get(v.get('prt'))})
                                little_groups.get(v.get('prt')).get('children').append(v)
                            elif v.get('prt') == '':
                                little_groups.update({'': {'children': [v]}})
                        del little_groups[g]
                rt.extend(little_groups.get(prt).get('children'))
        else:
            while skip >= 1:
                res = tree.get_thingsTree(prt, isOnlyGroup, LIMIT, skip)
                rt.extend(res)
                skip += 1
                if len(res) < LIMIT:
                    skip = -1
        return rt

    @classmethod
    def get_subFolder(cls, re, thingsList, subFolderPrefix):
        error = None
        if isinstance(subFolderPrefix, str):
            if '{' in subFolderPrefix and '}' in subFolderPrefix:
                subFolderPattern = subFolderPrefix[subFolderPrefix.find('{') + 1: subFolderPrefix.find('}')]
        try:
            subFolderPattern = int(subFolderPattern)
        except Exception as e:
            error = 'Parameter:subFolderPattern error'
            raise Exception(error)
        subFolderThings = {}
        for thing in thingsList:
            name = thing.get('name')
            subname = matching(re, name).match_group(subFolderPattern)
            tem = subFolderPrefix[subFolderPrefix.find('{'): subFolderPrefix.find('}') + 1]
            subFolderName = subFolderPrefix.replace(tem, subname)
            if subFolderName in subFolderThings.keys():
                subFolderThings.get(subFolderName).append(thing.get('_id'))
            else:
                subFolderThings.update({subFolderName: [thing.get('_id')]})
        else:
            error = 'There is no matching points'
            raise Exception(error)
        return subFolderThings

    @classmethod
    def get_subFolderName(cls, projId, prt, rules, subFolderPrefix):
        thingsList = cls.match_things_by_groupRule(projId, rules, prt)
        thingsList = thingsList.get('ThingsList')
        if thingsList:
            re = cls.make_rule_to_query(rules)
            subThingsList = cls.get_subFolder(re, thingsList, subFolderPrefix)
            return list(subThingsList.keys())
        else:
            return []

    @classmethod
    def del_group(cls, projId, groupId):
        tagGroup = TagGroup(projId)
        gIdList = tagGroup.del_group(groupId)
        if gIdList:
            for gId in gIdList:
                cls.del_group(projId, gId)
        return True

    @classmethod
    def move_things(cls, projId, thingIds, prt):
        tagThing = TagThing(projId)
        query = {'_id': {'$in': [ObjectId(x) for x in thingIds if ObjectId.is_valid(x)]}}
        res = tagThing.update_many_things(query, prt=prt)
        if res:
            error = None
        else:
            error = 'Move things failed'
        return error

    @classmethod
    def get_thingTree_detail(cls, projId, prt, searchText, limit, skip):
        rt = []
        thingTree = ThingsTree(projId)
        if limit is None or skip is None:
            skip = 1
            while skip >= 1:
                res, count = thingTree.get_detail(prt, searchText, LIMIT, skip)
                skip += 1
                rt.extend(res)
                if len(res) < LIMIT:
                    skip = -1
        else:
            rt, count = thingTree.get_detail(prt, searchText, limit, skip)
        return {'detailList': rt, 'count': count,
                'limit': limit if skip >= 1 else None, 'skip': skip if skip >= 1 else None}

    @classmethod
    def get_count_from_dataSource(cls, projId):
        cnn = MongoConnManager.getConfigConn()
        return cnn.mdbBb[g_tableDataSource].count({'projId': int(projId), 'type': 4})

    @classmethod
    def get_count_from_cloutPoint(cls, projId):
        tagThing = TagThing(projId)
        return tagThing.get_count()

    @classmethod
    def search(cls, projId, **kwargs):
        rt = []
        query = {}
        for key in kwargs.keys():
            value = kwargs.get(key)
            if key == 'prt' and value is not None:
                if ObjectId.is_valid(value):
                    query.update({'prt': ObjectId(value)})
                else:
                    query.update({'prt': ''})
            elif key == 'keywords' and value:
                query.update({'keywords': value})
            elif key == 'name' and value:
                query.update({'name': {'$regex': value}})
            elif key == 'tag' and value:
                query.update({'tag': value})
        limit = kwargs.get('limit')
        skip = kwargs.get('skip')
        thingsTree = ThingsTree(projId)
        if limit is None or skip is None:
            skip = 1
            while skip >= 1:
                res, count = thingsTree.search(query, LIMIT, skip)
                rt.extend(res)
                skip += 1
                if len(res) < LIMIT:
                    skip = -1
        else:
            rt, count = thingsTree.search(query, limit, skip)
        return {'list': rt, 'count': count, 'limit': limit if skip < 0 else None,
                'skip': skip if skip < 0 else None}

    @classmethod
    def set_tag(cls, projId, arrTag):
        thingTree = ThingsTree(projId)
        tag_treeId = {}
        groupId_tag = {}
        for item in arrTag:
            tags = item.get('tags')
            Id = item.get('Id')
            if item.get('type') == 'group':
                groupId_tag.update({Id: list(set(tags))})
            for tag in tags:
                if tag in tag_treeId.keys():
                    tag_treeId.get(tag).append(Id)
                else:
                    tag_treeId.update({tag: [Id]})
        for tag in tag_treeId.keys():
            Ids = tag_treeId.get(tag)
            thingTree.set_tag(Ids, tag)
        if groupId_tag:
            for groupId in groupId_tag.keys():
                thingTree.set_group_tag(groupId, groupId_tag.get(groupId))
        return True

    @classmethod
    def get_common(cls, projId):
        return {'personal': ThingsTree(projId).get_personal_tag(),
                'public': ThingsTree(projId).get_public_tag()}

    @classmethod
    def del_tag(cls, projId, Ids, tagName):
        return ThingsTree(projId).del_tag(Ids, tagName)

    @classmethod
    def get_ThingsTree_Tag(cls, projId, prt, tags, searchText, limit, skip):
        rt = []
        thingsTree = ThingsTree(projId)
        if limit is None or skip is None:
            skip = 1
            while skip >= 1:
                res, count = thingsTree.get_thingsTree_by_tag(prt, tags, searchText, LIMIT, skip)
                skip += 1
                rt.extend(res)
                if len(res) < LIMIT:
                    skip = -1
        else:
            rt, count = thingsTree.get_thingsTree_by_tag(prt, tags, searchText, limit, skip)
        return {'detailList': rt, 'count': count, 'limit': limit if skip > 0 else None, 'skip': skip if skip > 0 else None}

    @classmethod
    def set_tagAttrP(cls, projId, attrP, Id):
        update = {'$set': {}}
        for tagName in attrP.keys():
            update.get('$set').update({'attrP.' + str(tagName): attrP.get(tagName)})
        return ThingsTree(projId).set_attrP(Id, update)

    @classmethod
    def format_painter(cls, projId, sample_groupId, target_groupId):
        pass

    @classmethod
    def test(cls):
        ThingsTree(1).get_public_tag()
        return None
