from bson import ObjectId
import logging
import xlrd
import json
import re
from copy import deepcopy
from datetime import datetime, timedelta
import requests
import ast

from beopWeb import app
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.BEOPMongoDataAccess import g_tableDataSource
from beopWeb.mod_tag.Tag import TagThing, TagGroup, ThingsTree, matching, LIMIT, super_str, TagStatistics
from beopWeb.mod_tag.TagDict import TagDictV2
from beopWeb.mod_tag.Constants import RulesType
from beopWeb.mod_tag.ProjectTags import DiagnosisMapping
from beopWeb.mod_tag.pointMatchV2 import CSMatch
from beopWeb.mod_common.Utils import Utils

TABLE_DIAGNOSIS_ENTITY = 'diagnosis_entity'


class DuplicatedId(Exception):
    '''tagTransfer用:_id和prt重复的异常
    重复会导致search_parent函数递归死循环，这里在形成死循环前，做判定然后抛出该异常
    '''
    pass


class MissingParent(Exception):
    '''tagTransfer用:找不到父节点的异常
    由于一些原因父节点被删除，但子节点没有被删除，导致找不到父节点，所以做判定然后抛出该异常
    '''


class pointTag:
    def __init__(self):
        pass

    @classmethod
    def sync_cloud_point_to_thingTree(cls, projId):
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
    def get_cloud_point_from_dataSource(self,
                                        projId,
                                        ObId=None,
                                        limit=500,
                                        skip=0):
        rt = []
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            if ObId:
                if ObjectId.is_valid(ObId):
                    cursor = cnn.mdbBb[g_tableDataSource].find(
                        {
                            '_id': ObjectId(ObId)
                        },
                        projection={
                            '_id': 1,
                            'value': 1,
                            'alias': 1,
                            'params': 1
                        })
                else:
                    raise Exception('Invalid parameter')
            else:
                cursor = cnn.mdbBb[g_tableDataSource].find(
                    {
                        'projId': int(projId),
                        'type': 4,
                        'params.flag': {
                            '$in': [0, 1, 2]
                        },
                        'groupId': {
                            '$in': ["", None]
                        }
                    },
                    projection={'_id': 1,
                                'value': 1,
                                'alias': 1,
                                'params': 1},
                    limit=int(limit),
                    skip=int(skip),
                    sort=[('_id', 1)])
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
                ids_datasource = self.get_cloud_point_from_dataSource(
                    projId, limit=limit, skip=n * limit)
                num = len(ids_datasource)
                cursor = cnn.mdbBb[collection].find(
                    {
                        '_id': {
                            '$in': [d.get('_id') for d in ids_datasource]
                        }
                    },
                    projection={'_id': 1},
                    sort=[('_id', 1)])
                if cursor.count() < num:
                    ids_thingstree = list(cursor)
                    for x in range(num):
                        try:
                            temp = ids_thingstree[x]
                        except Exception as e:
                            ids_excess.append({
                                '_id':
                                ids_datasource[x].get('_id'),
                                'name':
                                ids_datasource[x].get('value'),
                                'prt':
                                '',
                                'type':
                                'thing',
                                'tag': [],
                                'attrP': {},
                                'flag':
                                ids_datasource[x].get('params').get('flag'),
                                'projId':
                                int(projId),
                                'note':
                                ids_datasource[x].get('alias'),
                                'keywords':
                                TagThing.split_point_name(
                                    ids_datasource[x].get('value'))
                            })
                            ids_thingstree.insert(
                                x, {
                                    '_id': ids_datasource[x].get('_id')
                                })
                        if ids_datasource[x].get(
                                '_id') != ids_thingstree[x].get('_id'):
                            ids_excess.append({
                                '_id':
                                ids_datasource[x].get('_id'),
                                'name':
                                ids_datasource[x].get('value'),
                                'prt':
                                '',
                                'type':
                                'thing',
                                'tag': [],
                                'attrP': {},
                                'flag':
                                ids_datasource[x].get('params').get('flag'),
                                'projId':
                                int(projId),
                                'note':
                                ids_datasource[x].get('alias'),
                                'keywords':
                                TagThing.split_point_name(
                                    ids_datasource[x].get('value'))
                            })
                            ids_thingstree.insert(
                                x, {
                                    '_id': ids_datasource[x].get('_id')
                                })
                if num == limit:
                    n = n + 1
                else:
                    n = -1
            if ids_excess:
                cnn.mdbBb[collection].insert_many(ids_excess)
            rt = True
        except Exception as e:
            print('set_cloud_point_to_thingsTree error:' + e.__str__())
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
                ids_thingstree = cls.get_cloud_point_from_thingsTree(
                    projId, limit=limit, skip=n * limit)
                cursor = cnn.mdbBb[g_tableDataSource].find(
                    {
                        '_id': {
                            '$in': [d.get('_id') for d in ids_thingstree]
                        },
                        'projId': int(projId),
                        'type': 4,
                        'params.flag': {
                            '$in': [0, 1, 2]
                        },
                        'groupId': {
                            '$in': ["", None]
                        }
                    },
                    projection={'_id': 1,
                                'value': 1,
                                'alias': 1},
                    sort=[('_id', 1)])
                num = len(ids_thingstree)
                if cursor.count() < num:
                    ids_datasource = list(cursor)
                    for x in range(num):
                        try:
                            temp = ids_datasource[x]
                        except Exception as e:
                            ids_excess.append(ids_thingstree[x].get('_id'))
                            ids_datasource.insert(x, ids_thingstree[x])
                        if ids_thingstree[x].get(
                                '_id') != ids_datasource[x].get('_id'):
                            ids_excess.append(ids_thingstree[x].get('_id'))
                            ids_datasource.insert(x, ids_thingstree[x])
                        elif ids_thingstree[x].get(
                                'name') != ids_datasource[x].get('value'):
                            data_diff.append({
                                '_id':
                                ids_datasource[x].get('_id'),
                                'name':
                                ids_datasource[x].get('value'),
                                'note':
                                ids_datasource[x].get('alias')
                            })
                        elif ids_thingstree[x].get(
                                'note') != ids_datasource[x].get('alias'):
                            data_diff.append({
                                '_id':
                                ids_datasource[x].get('_id'),
                                'name':
                                ids_datasource[x].get('value'),
                                'note':
                                ids_datasource[x].get('alias')
                            })
                if num == limit:
                    n = n + 1
                else:
                    n = -1
            if ids_excess:
                cnn.mdbBb[collection].delete_many({'_id': {'$in': ids_excess}})
            if data_diff:
                for i in data_diff:
                    TagThing(projId).update_things_by_Id(
                        id=i.get('_id'),
                        name=i.get('name'),
                        note=i.get('note'))
            rt = True
        except Exception as e:
            print('contrast_cloud_point_from_thingsTree_dataSource error:' +
                  e.__str__())
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
            cursor = cnn.mdbBb[collection].find(
                {
                    '$or': [{
                        'type': None
                    }, {
                        'type': 'thing'
                    }],
                    'projId': int(projId)
                },
                limit=limit,
                skip=skip,
                projection={'_id': 1,
                            'name': 1,
                            'note': 1},
                sort=[('_id', 1)])
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
            if not keyword:
                continue
            re = '^%s$' % keyword
            orlist.append({'keywords': {'$regex': re, '$options': '$i'}})
        if ObjectId.is_valid(prt):
            query = {'prt': ObjectId(prt)}
        else:
            query = {'prt': ''}
        # if isinstance(keywords, list):
        #     query.update({'keywords': {'$in': keywords}})
        # elif isinstance(keywords, str):
        #     query.update({'keywords': keywords})
        if orlist:
            query['$or'] = orlist

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
        return {
            'ThingsList': rt,
            'count': count,
            'limit': limit,
            'skip': skip if skip >= 0 else None
        }

    @classmethod
    def regenerate_the_keywords(cls, projId):
        pass

    @classmethod
    def match_things_by_groupRule(cls,
                                  projId,
                                  rules,
                                  prt=None,
                                  limit=None,
                                  skip=None):
        things = TagThing(projId)
        re = cls.make_rule_to_query(rules)
        count = 0
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
        return {
            'ThingsList': rt,
            'count': count,
            'limit': limit if skip > 0 else None,
            'skip': skip if skip > 0 else None
        }

    @classmethod
    def not_match_things_by_groupRule(cls,
                                      projId,
                                      rules,
                                      prt=None,
                                      limit=None,
                                      skip=None):
        things = TagThing(projId)
        re = cls.make_rule_to_query(rules)
        count = 0
        import re as regex

        if re:
            query = {'name': {'$not': regex.compile(re)}}
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
        return {
            'ThingsList': rt,
            'count': count,
            'limit': limit if skip > 0 else None,
            'skip': skip if skip > 0 else None
        }

    @classmethod
    def get_not_match_count(cls, projId, rules, prt=None):
        things = TagThing(projId)
        re = cls.make_rule_to_query(rules)
        import re as regex

        if re:
            query = {'name': {'$not': regex.compile(re)}}
        else:
            query = {}
        if ObjectId.is_valid(prt):
            query.update({'prt': ObjectId(prt)})
        else:
            query.update({'prt': ''})
        return things.get_things_count(query)

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
    def create_new_group(cls, projId, prt, folderName, rules, hasSubFolder,
                         subFolderPrefix):
        doc = None
        error = None
        thingsList = []
        if rules:
            tList = cls.match_things_by_groupRule(projId, rules, prt)
            thingsList.extend(tList.get('ThingsList'))
        gId = TagGroup(projId).is_exist(folderName, prt)
        if gId:
            if rules:
                query = {
                    '_id': {
                        '$in': [
                            ObjectId(x.get('_id')) for x in thingsList
                            if ObjectId.is_valid(x.get('_id'))
                        ]
                    }
                }
                TagThing(projId).update_many_things(query, prt=gId)
                error = cls.edit_new_group(
                    projId, gId, rules=rules, subFolderPrefix=subFolderPrefix)
            return error, gId
        doc = {
            '_id': ObjectId(),
            'name': folderName,
            'prt': ObjectId(prt) if ObjectId.is_valid(prt) else '',
            'tag': [],
            'attrP': {},
            'rule': [rules],
            'hasSubFolder': hasSubFolder,
            'subFolderPrefix': [subFolderPrefix] if subFolderPrefix else []
        }
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
                    error = cls.make_subFolder(projId, doc.get('_id'), rules,
                                               subFolderPrefix, thingsList)
        else:
            error = 'Folder:%s insert failed' % folderName
        return error, gId

    @classmethod
    def formart_subFolderPrefix(cls, subFolderPrefix):
        subFolderPrefix_sup = super_str(subFolderPrefix)
        head_index_list = subFolderPrefix_sup.findall('{')
        end_index_list = subFolderPrefix_sup.findall('}')
        subFolderPattern_list = []
        if len(head_index_list) != len(end_index_list) or len(
                head_index_list) == 0:
            error = 'Parameter:subFolderPattern error'
            raise Exception(error)
        else:
            for index in range(len(head_index_list)):
                try:
                    subFolderPattern = int(subFolderPrefix[
                        head_index_list[index] + 1:end_index_list[index]])
                except Exception as e:
                    error = 'Parameter:subFolderPattern error: ' + e.__str__()
                    raise Exception(error)
                subFolderPattern_list.append(subFolderPattern)
                if index == 0:
                    subFolderPrefix_c = subFolderPrefix[:head_index_list[index] + 1] + '0[' + str(
                        index) + ']' + subFolderPrefix[end_index_list[index]]
                else:
                    subFolderPrefix_c += subFolderPrefix[end_index_list[index -
                                                                        1] + 1:
                                                         head_index_list[index]
                                                         + 1] + '0[' + str(
                                                             index
                                                         ) + ']' + subFolderPrefix[end_index_list[index]]
            subFolderPrefix_c += subFolderPrefix[end_index_list[index] + 1:]
            return subFolderPrefix_c, subFolderPattern_list

    @classmethod
    def make_subFolder(cls, projId, groupId, rules, subFolderPrefix,
                       thingsList):
        error = ''
        re = cls.make_rule_to_query(rules)
        subFolderPrefix_format, subFolderPattern_list = cls.formart_subFolderPrefix(
            subFolderPrefix)
        subFolderThings = []
        for thing in thingsList:
            name = thing.get('name')
            subNameList = []
            for subFolderPattern in subFolderPattern_list:
                subname = matching(re, name).match_group(subFolderPattern)
                subNameList.append(subname)
                rules[subFolderPattern - 1] = {
                    'type': RulesType.RULE_FIXED_STRING,
                    'value': subname
                }
            subFolderName = subFolderPrefix_format.format(subNameList)
            if subFolderName not in subFolderThings:
                subFolderThings.append(subFolderName)
                e, g = cls.create_new_group(projId, groupId, subFolderName,
                                            rules, RulesType.RULE_SUBFOLDER_NO,
                                            None)
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
                        tagGroup.update_group({
                            'prt':
                            ObjectId(groupId)
                            if ObjectId.is_valid(groupId) else ''
                        }, {
                            '$set': {
                                'prt':
                                ObjectId(gId) if ObjectId.is_valid(gId) else ''
                            }
                        })
                        tagGroup.del_group(groupId)
                        groupId = gId
            elif key == 'folderName' and value:
                if doc:
                    gId = tagGroup.is_exist(value, doc.get('prt').__str__())
                    if gId and gId != groupId:
                        # 存在重名的目录， 将两目录合并
                        tagGroup.update_group({
                            'prt':
                            ObjectId(groupId)
                            if ObjectId.is_valid(groupId) else ''
                        }, {
                            '$set': {
                                'prt':
                                ObjectId(gId) if ObjectId.is_valid(gId) else ''
                            }
                        })
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
                query.get('$set').update({
                    'hasSubFolder':
                    RulesType.RULE_SUBFOLDER_IS
                })
                query.get('$push').update({'subFolderPrefix': value})
        if tagGroup.edit_group(groupId, query):
            if kwargs.get('rules'):
                rules = kwargs.get('rules')
                thingsList = []
                tList = cls.match_things_by_groupRule(projId, rules, groupId)
                thingsList.extend(tList.get('ThingsList'))
                query = {
                    '_id': {
                        '$in': [
                            ObjectId(x.get('_id')) for x in thingsList
                            if ObjectId.is_valid(x.get('_id'))
                        ]
                    }
                }
                TagThing(projId).update_many_things(query, prt=groupId)
                if kwargs.get('subFolderPrefix'):
                    subFolderPrefix = kwargs.get('subFolderPrefix')
                    error = cls.make_subFolder(projId, groupId, rules,
                                               subFolderPrefix, thingsList)
        else:
            error = 'Folder edit failed'
        return error

    @classmethod
    def create_group_by_keywords(cls, projId, prt, keywords, folderName,
                                 parent):
        gId = None
        thingsList = []
        thingsList.extend(
            cls.get_thingsList_by_keywords(projId, keywords, prt, None,
                                           None).get('ThingsList'))
        if ObjectId.is_valid(parent):
            prt = parent
        doc = {
            '_id': ObjectId(),
            'prt': ObjectId(prt) if ObjectId.is_valid(prt) else '',
            'name': folderName,
            'tag': [],
            'attrP': {},
            'rule': [],
            'hasSubFolder': RulesType.RULE_FIXED_STRING,
            'subFolderPrefix': []
        }
        gId = TagGroup(projId).is_exist(folderName, prt)
        if gId:
            cls.move_things(projId, [x.get('_id') for x in thingsList], gId)
            return gId
        group = TagGroup(projId)
        gId = group.insert_group(doc)
        if isinstance(gId, str):
            Id_List = [
                ObjectId(x.get('_id')) for x in thingsList
                if ObjectId.is_valid(x.get('_id'))
            ]
            TagThing(projId).update_many_things(
                {
                    '_id': {
                        '$in': Id_List
                    }
                }, prt=gId)
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
            rt.append({'_id': '', 'prt': '', 'name': '未分类目录', 'type': 'group'})
            if little_groups:
                while prt not in little_groups.keys():
                    iteration = deepcopy(little_groups)
                    for g in iteration.keys():
                        v = little_groups.get(g)
                        if v.get('prt') in groups_id.keys() or v.get(
                                'prt') == '':
                            if v.get('prt') in little_groups.keys():
                                little_groups.get(
                                    v.get('prt')).get('children').append(v)
                            elif v.get('prt'):
                                little_groups.update({
                                    v.get('prt'):
                                    groups_id.get(v.get('prt'))
                                })
                                little_groups.get(
                                    v.get('prt')).get('children').append(v)
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
    def get_thingsTreeNew(cls, projId, prt, isOnlyGroup, isAll):
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
                        if v.get('prt') in groups_id.keys() or v.get(
                                'prt') == '':
                            if v.get('prt') in little_groups.keys():
                                little_groups.get(
                                    v.get('prt')).get('children').append(v)
                            elif v.get('prt'):
                                little_groups.update({
                                    v.get('prt'):
                                    groups_id.get(v.get('prt'))
                                })
                                little_groups.get(
                                    v.get('prt')).get('children').append(v)
                            elif v.get('prt') == '':
                                little_groups.update({'': {'children': [v]}})
                        del little_groups[g]
                rt.extend(little_groups.get(prt).get('children'))
        else:
            tagThing = TagThing(projId)
            group_count_dic = tagThing.get_point_count()
            while skip >= 1:
                res = tree.get_thingsTreeNew(prt, isOnlyGroup, LIMIT, skip,
                                             tagThing, group_count_dic)
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
                subFolderPattern = subFolderPrefix[
                    subFolderPrefix.find('{') + 1:subFolderPrefix.find('}')]
        try:
            subFolderPattern = int(subFolderPattern)
        except Exception:
            error = 'Parameter:subFolderPattern error'
            raise Exception(error)
        subFolderThings = {}
        for thing in thingsList:
            name = thing.get('name')
            subname = matching(re, name).match_group(subFolderPattern)
            tem = subFolderPrefix[subFolderPrefix.find('{'):
                                  subFolderPrefix.find('}') + 1]
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
    def del_group_new(cls, projId, groupId):
        '''
        david 20170525
        '''
        tagGroup = TagGroup(projId)
        group = tagGroup.get_group(groupId)
        if group:
            group_dict = DiagnosisMapping(projId).get_groupson_num()
            del_group_ids = [ObjectId(groupId)]
            del_group_is_nimei = [ObjectId(groupId)]

            def get_delgroupIds(father):
                x = group_dict.get(ObjectId(father), [])
                return x

            n = 1
            while n:
                xxx = []
                for dg in del_group_is_nimei:
                    res = get_delgroupIds(dg)
                    xxx.extend(res)
                del_group_ids.extend(xxx)
                del_group_is_nimei = xxx
                if not xxx:
                    n = 0
            dbrv = tagGroup.del_groups(del_group_ids, group.get('prt'))
            if dbrv:
                if dbrv.raw_result.get('ok'):
                    return True
                else:
                    raise Exception('Delete group Failed')
            else:
                raise Exception('Delete group Failed')
        else:
            raise Exception('Invalid groupId')

    @classmethod
    def move_things(cls, projId, thingIds, prt):
        tagThing = TagThing(projId)
        query = {
            '_id': {
                '$in': [ObjectId(x) for x in thingIds if ObjectId.is_valid(x)]
            }
        }
        res = tagThing.update_many_things(query, prt=prt)
        if res:
            error = None
        else:
            error = 'Move things failed'
        return error

    @classmethod
    def move_groups(cls, projId, groupIds, groupNames, prt):
        tagGroup = TagGroup(projId)
        mgids = []
        error = None
        for index, groupId in enumerate(groupIds):
            # 查重
            groupName = groupNames[index]
            gId = tagGroup.is_exist(groupName, prt)
            if gId:
                #合并重复文件夹
                query = {'projId': int(projId), 'prt': ObjectId(groupId)}
                update = {'$set': {'prt': ObjectId(gId)}}
                res = tagGroup.update_group(query, update)
                if not res:
                    error = 'Move group failed, groupId : %s' % groupId
                else:
                    tagGroup.del_group(groupId)
            else:
                mgids.append(ObjectId(groupId))
        if mgids:
            query = {'_id': {'$in': mgids}}
            update = {
                '$set': {
                    'prt': ObjectId(prt) if ObjectId.is_valid(prt) else ''
                }
            }
            res = tagGroup.update_group(query, update)
            if not res:
                error = 'Move groups failed'
        return error

    @classmethod
    def get_thingTree_detail(cls, projId, prt, searchText, hasTag, limit, skip,
                             isAll):
        rt = []
        thingTree = ThingsTree(projId)
        if limit is None or skip is None:
            skip = 1
            while skip >= 1:
                res, count = thingTree.get_detail(prt, searchText, hasTag,
                                                  LIMIT, skip, isAll)
                skip += 1
                rt.extend(res)
                if len(res) < LIMIT:
                    skip = -1
        else:
            rt, count = thingTree.get_detail(prt, searchText, hasTag, limit,
                                             skip, isAll)
        return {
            'detailList': rt,
            'count': count,
            'limit': limit if skip >= 1 else None,
            'skip': skip if skip >= 1 else None
        }

    @classmethod
    def get_thingTree_detail_new(cls, projId, prt, searchText, hasTag, limit,
                                 skip, isAll):
        rt = []
        query = {}
        p_list = []
        rtd_map = {}
        if searchText:
            searchText = Utils.handle_search_text(searchText)
            query.update({
                '$or': [{
                    'name': {
                        '$regex': searchText,
                        '$options': '$i'
                    }
                }, {
                    'note': {
                        '$regex': searchText,
                        '$options': '$i'
                    }
                }]
            })
        if hasTag:
            if int(hasTag) == 1:
                # 已标记
                query.update({'tag': {'$ne': []}})
            elif int(hasTag) == 2:
                # 未标记
                query.update({'tag': []})
        prt = prt
        tree_dict = TagThing(projId).get_point_count()
        if isAll:
            query.update({'type': 'thing'})
        else:
            query.update({
                'prt':
                ObjectId(prt) if ObjectId.is_valid(prt) else prt
            })
        SORT = [('type', 1), ('prt', 1), ('name', 1)]
        if limit is None or skip is None:
            limit = 500
            skip = 1
        res = ThingsTree(projId).get_detail_new(
            query, limit=limit, skip=skip, sort=SORT)
        count = res.count()
        for item in res:
            if item.get('type') == 'group' and not isAll:
                rt.append({
                    '_id':
                    item.get('_id').__str__(),
                    'name':
                    item.get('name'),
                    'type':
                    item.get('type'),
                    'tag':
                    item.get('tag'),
                    'prt':
                    item.get('prt').__str__()
                    if isinstance(item.get('prt'), ObjectId) else None,
                    'attrP':
                    item.get('attrP'),
                    'rule':
                    item.get('rule'),
                    'hasSubFolder':
                    item.get('hasSubFolder'),
                    'subFolderPattern':
                    item.get('subFolderPattern'),
                    'subFolderPrefix':
                    item.get('subFolderPrefix'),
                    'count':
                    TagThing.get_point_count_by_groupId(
                        tree_dict,
                        item.get('_id').__str__())
                })
                # 临时代码
                if item.get('prt').__str__() == '':
                    if not isAll:
                        # 未分类目录
                        count -= 1
                        rt.pop()
            if item.get('type') == 'thing':
                rt.append({
                    '_id':
                    item.get('_id').__str__(),
                    'name':
                    item.get('name'),
                    'type':
                    item.get('type'),
                    'tag':
                    item.get('tag'),
                    'attrP':
                    item.get('attrP'),
                    'flag':
                    item.get('flag'),
                    'prt':
                    item.get('prt').__str__()
                    if isinstance(item.get('prt'), ObjectId) else None,
                    'point':
                    item.get('point'),
                    'note':
                    item.get('note')
                })
                p_list.append(item.get('name'))
        rtd_map = TagThing.get_rdt_map(projId, p_list)

        for r in rt:
            r.update({'value': rtd_map.get(r.get('name'))})

        return {
            'detailList': rt,
            'count': count,
            'limit': limit if skip >= 1 else None,
            'skip': skip if skip >= 1 else None
        }

    @classmethod
    def get_count_from_dataSource(cls, projId):
        cnn = MongoConnManager.getConfigConn()
        return cnn.mdbBb[g_tableDataSource].count({
            'projId': int(projId),
            'type': 4,
            'params.flag': {
                '$in': [0, 1, 2]
            },
            'groupId': {
                '$in': ["", None]
            }
        })

    @classmethod
    def get_count_from_cloutPoint(cls, projId):
        group_dict = DiagnosisMapping(projId).get_groupson_num()
        root_group = ''
        valid_group = [root_group]

        def get_group_son(group_dict, prt_list):
            rt = []
            for item in prt_list:
                rt.extend(group_dict.get(item, []))
            return rt

        res = get_group_son(group_dict, [root_group])
        while res:
            valid_group.extend(res)
            res = get_group_son(group_dict, res)
        tagThing = TagThing(projId)
        return tagThing.get_count_by_groupId(valid_group)

    @classmethod
    def judge_tags_from_cloutPoint(cls, projId):
        hasTag = ThingsTree(projId).judge_has_tag()
        if hasTag:
            return 1
        else:
            return 0

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
            elif key == 'hasTag':
                if value is None:
                    pass
                elif int(value) == 1:
                    # Tag 已标记
                    query.update({'tag': {'$ne': []}})
                elif int(value) == 2:
                    # Tag 未标记
                    query.update({'tag': []})
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
        return {
            'list': rt,
            'count': count,
            'limit': limit if skip < 0 else None,
            'skip': skip if skip < 0 else None
        }

    # @classmethod
    # def set_tag(cls, projId, arrTag, inheritable):
    #     thingTree = ThingsTree(projId)
    #     tag_treeId = {}
    #     groupId_tag = {}
    #     for item in arrTag:
    #         tags = item.get('tags')
    #         Id = item.get('Id')
    #         if item.get('type') == 'group' and inheritable:
    #             groupId_tag.update({Id: list(set(tags))})
    #         for tag in tags:
    #             if tag in tag_treeId.keys():
    #                 tag_treeId.get(tag).append(Id)
    #             else:
    #                 tag_treeId.update({tag: [Id]})
    #     for tag in tag_treeId.keys():
    #         Ids = tag_treeId.get(tag)
    #         thingTree.set_tag(Ids, tag)
    #     if groupId_tag:
    #         for groupId in groupId_tag.keys():
    #             if groupId_tag.get(groupId):
    #                 thingTree.set_group_tag(groupId, groupId_tag.get(groupId))
    #     return True

    @classmethod
    def get_common(cls, projId):
        return {
            'personal': ThingsTree(projId).get_personal_tag(),
            'public': ThingsTree(projId).get_public_tag()
        }

    @classmethod
    def del_tag(cls, projId, Ids, tagName, inheritable):
        if inheritable:
            return ThingsTree(projId).del_group_tag(Ids, tagName)
        else:
            return ThingsTree(projId).del_tag(Ids, tagName)

    @classmethod
    def del_tag_v2(cls, projId, ids, tagName, inheritable):
        ids = [ObjectId(a_id) for a_id in ids if ObjectId.is_valid(a_id)]
        ThingsTree(projId).del_tag_v2(projId, ids, tagName, inheritable)
        return

    @classmethod
    def get_ThingsTree_Tag(cls, projId, prt, tags, searchText, limit, skip):
        rt = []
        thingsTree = ThingsTree(projId)
        if limit is None or skip is None:
            skip = 1
            while skip >= 1:
                res, count = thingsTree.get_thingsTree_by_tag(
                    prt, tags, searchText, LIMIT, skip)
                skip += 1
                rt.extend(res)
                if len(res) < LIMIT:
                    skip = -1
        else:
            rt, count = thingsTree.get_thingsTree_by_tag(
                prt, tags, searchText, limit, skip)
        return {
            'detailList': rt,
            'count': count,
            'limit': limit if skip > 0 else None,
            'skip': skip if skip > 0 else None
        }

    @classmethod
    def set_tagAttrP(cls, projId, attrP, Id, inheritable):
        update = {'$set': {}}
        for tagName in attrP.keys():
            update.get('$set').update({
                'attrP.' + str(tagName):
                attrP.get(tagName)
            })
        if inheritable:
            res_1 = False
            groupId_tree = DiagnosisMapping(projId).get_groupson_num()
            groupId_list = [ObjectId(Id)]
            sons_id = groupId_tree.get(ObjectId(Id))
            while sons_id:
                groupId_list.extend(sons_id)
                item_list = []
                for item in sons_id:
                    item_list.extend(groupId_tree.get(item, []))
                    groupId_list.extend(groupId_tree.get(item, []))
                sons_id = item_list
            res_1 = ThingsTree(projId).set_group_attrP(groupId_list, update)
            if res_1:
                return ThingsTree(projId).set_attrP(Id, update)
        else:
            return ThingsTree(projId).set_attrP(Id, update)

    @classmethod
    def format_painter(cls, projId, sample_groupId, target_groupId):
        sample_group, sample_thingsList = ThingsTree(projId).get_tree_branch(
            sample_groupId)
        target_group, target_thingsList = ThingsTree(projId).get_tree_branch(
            target_groupId)
        sample_group_rules = sample_group.get('rule')
        target_group_rules = target_group.get('rule')
        sample_rule, target_rule, group = cls.get_diff_from_two_rules(
            sample_group_rules, target_group_rules)
        if sample_rule and target_rule and group:
            while sample_rule and target_rule and group:
                re = cls.make_rule_to_query(sample_rule)
                ThingsTree(projId).set_group_tag_and_attrP(
                    target_group.get('_id'), sample_group.get('tag'),
                    sample_group.get('attrP'))
                for sample_thing in sample_thingsList:
                    sample_thing_name = sample_thing.get('name')
                    sample_thing_tag = sample_thing.get('tag')
                    sample_thing_attrP = sample_thing.get('attrP')
                    i = matching(re, sample_thing_name).match_span(group + 1)
                    if i:
                        target_thing_name = sample_thing_name[:i[0]] + target_rule[group].get(
                            'value') + sample_thing_name[i[1]:]
                        query = {'name': target_thing_name}
                        if ThingsTree(projId).set_tag_and_attrP(
                                query, sample_thing_tag, sample_thing_attrP):
                            sample_thingsList.remove(sample_thing)
                sample_group_rules.remove(sample_rule)
                target_group_rules.remove(target_rule)
                sample_rule, target_rule, group = cls.get_diff_from_two_rules(
                    sample_group_rules, target_group_rules)
            return True
        else:
            raise Exception(
                'The two brush directory cannot be used format painter')

    @classmethod
    def get_diff_from_two_rules(cls, rules1, rules2):
        rt1 = []
        rt2 = []
        re_index = None
        for rule1 in rules1:
            for rule2 in rules2:
                if len(rule1) == len(rule2):
                    pointnum = 0
                    point = 0
                    for i in range(len(rule1)):
                        if rule1[i] != rule2[i]:
                            pointnum += 1
                            if rule1[i].get('type') == 2 and rule2[i].get(
                                    'type') == 2:
                                point += 1
                                re_index = i
                    if point == 1 and pointnum == 1:
                        rt1 = rule1
                        rt2 = rule2
                        break
            if rt1 and rt2:
                break
        return rt1, rt2, re_index

    @classmethod
    def format_painter_newOne(cls, projId, sample_groupId, target_groupIds):
        sample_group, sample_thingsList = ThingsTree(projId).get_tree_branch(
            sample_groupId)
        for target_groupId in target_groupIds:
            if ObjectId.is_valid(target_groupId):
                ThingsTree(projId).set_group_tag_and_attrP(
                    target_groupId, sample_group.get('tag'),
                    sample_group.get('attrP'))
        re_list = []
        for sample_thing in sample_thingsList:
            sample_thing_name = sample_thing.get('name')
            sample_thing_tag = sample_thing.get('tag')
            sample_thing_attrP = sample_thing.get('attrP')
            re = cls.make_re_by_thingName(sample_thing_name)
            if re not in re_list:
                query = {
                    'name': {
                        '$regex': re
                    },
                    'prt': {
                        '$in': [
                            ObjectId(x) for x in target_groupIds
                            if ObjectId.is_valid(x)
                        ]
                    }
                }
                if ThingsTree(projId).set_tag_and_attrP(
                        query, sample_thing_tag, sample_thing_attrP):
                    re_list.append(re)
        return True

    @classmethod
    def make_re_by_thingName(cls, thingName):
        rt = None
        if isinstance(thingName, str):
            if thingName:
                rt = '^'
                for i in thingName:
                    if i.isdigit():
                        if rt[-1] != '+':
                            rt += '[0-9]+'
                    else:
                        rt += i
                rt += '$'
        return rt

    @classmethod
    def get_proj_state(cls, projId):
        rt = {'tag': False, 'group': False}
        has_tag, has_group = ThingsTree(projId).get_proj_state()
        if has_tag:
            rt.update({'tag': True})
        if has_group:
            rt.update({'group': True})
        return rt

    @classmethod
    def get_offLinePoint_updateTime(cls,
                                    projId,
                                    pointNameList=[],
                                    offLineTime=60 * 2):
        dbAccess = BEOPDataAccess.getInstance()
        mysqlName = dbAccess.getProjMysqldb(projId)
        rt = []
        now_time = datetime.now()
        time_para = now_time - timedelta(seconds=offLineTime)
        if mysqlName:
            if pointNameList:
                para = str(pointNameList).replace('[', '(').replace(']', ')')
                strSQL = 'SELECT time, pointname FROM rtdata_%s '\
                         'WHERE pointname in %s AND time <= "%s" '\
                         'ORDER BY time' % (mysqlName, para, time_para.strftime('%Y-%m-%d %H:%M:%S'))
            else:
                strSQL = 'SELECT time, pointname FROM rtdata_%s '\
                         'WHERE time <= "%s" '\
                         'ORDER BY time' % (mysqlName, time_para.strftime('%Y-%m-%d %H:%M:%S'))
            rt = dbAccess._mysqlDBContainerReadOnly.op_db_query(
                app.config['DATABASE'], strSQL)
        return rt

    @classmethod
    def get_offLinePoint_by_equipment(cls, projId, equipment, equ_tag,
                                      offlineDeadband, filterRatio):
        rt = []
        attrkey_list = ['Equip', 'Floor', 'Zone', 'SubZone', 'EquipNum', 'Net']
        equipment_dict, ids = TagThing(projId).get_point_by_equipment(
            equipment, equ_tag)
        realNames = cls.get_realPoint_name_by_ids(projId, ids)
        offLinePoint = cls.get_offLinePoint_updateTime(projId,
                                                       list(realNames.keys()),
                                                       offlineDeadband * 60)
        offLinePointIds = []
        for item in offLinePoint:
            p_id = realNames.get(item[1])
            if p_id:
                offLinePointIds.append(p_id)
        for key in equipment_dict.keys():
            value = equipment_dict.get(key)
            e_list = key.split('||')
            rt.append({
                'atr': {},
                'totalNum': len(value),
                'offlineNum': 0,
                'detail': []
            })
            for index, k in enumerate(e_list):
                if k != 'None':
                    rt[-1].get('atr').update({attrkey_list[index]: k})
            for e in value:
                if e.get('_id') in offLinePointIds:
                    offlineNum = rt[-1].get('offlineNum')
                    rt[-1].get('detail').append(e.get('name'))
                    rt[-1].update({'offlineNum': offlineNum + 1})
            if rt[-1].get('offlineNum') / rt[-1].get('totalNum') > filterRatio:
                rt[-1].update({'status': 1})
            else:
                rt[-1].update({'status': 0})
        return rt

    @classmethod
    def get_realPoint_name_by_ids(cls, projId, ids):
        cursor = None
        rt = {}
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb[g_tableDataSource].find({
                '_id': {
                    '$in': [ObjectId(x) for x in ids if ObjectId.is_valid(x)]
                }
            })
            for item in cursor:
                if int(item.get('type')) == 4:
                    if item.get('params'):
                        mapping = item.get('params').get('mapping')
                        if mapping:
                            name = mapping.get('point')
                            if name:
                                rt.update({name: item.get('_id').__str__()})
                            else:
                                rt.update({
                                    item.get('value'):
                                    item.get('_id').__str__()
                                })
                        else:
                            rt.update({
                                item.get('value'):
                                item.get('_id').__str__()
                            })
                    else:
                        rt.update({
                            item.get('value'): item.get('_id').__str__()
                        })
                else:
                    rt.update({item.get('value'): item.get('_id').__str__()})
        except Exception as e:
            print('get_realPoint_name_by_ids error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def search_tagAnalysis(cls,
                           projId,
                           tag,
                           searchName,
                           isTree,
                           limit=0,
                           skip=1):
        rt = []
        point_list, group_dict = ThingsTree(projId).search_tag_analysis(
            tag, searchName, isTree, limit, skip)
        if isTree:
            for point in point_list:
                if point.get('prt') in group_dict.keys():
                    group_dict.get(point.get('prt')).get('children').insert(
                        0, point)
                else:
                    rt.insert(0, point)
            p_group_list = []
            for key in group_dict.keys():
                if group_dict.get(key).get('prt') in group_dict.keys():
                    group_dict.get(
                        group_dict.get(key).get('prt')).get('children').insert(
                            0, group_dict.get(key))
                else:
                    p_group_list.append(key)
            for k in p_group_list:
                rt.insert(0, group_dict.get(k))
        else:
            rt.extend(point_list)
        return rt

    @classmethod
    def sync_equipment_for_520(cls, projId):
        if int(projId) >= 510:
            allow, err = cls.is_tagTree_agree_with_diagnosis(projId)
            if allow:
                ProjectTags = DiagnosisMapping(projId)
                ProjectTags.get_building_from_tag()
                if ProjectTags.building:
                    ProjectTags.get_subbulding_building_from_tag()
                    if ProjectTags.subbuilding:
                        equipments = ProjectTags.get_equipment_subbuilding_building_from_tag(
                        )
                        if equipments:
                            ProjectTags.del_equipment_zones_table()
                            ProjectTags.insert_equipment_zones(equipments)
                            ProjectTags.update_tag(equipments)
                    else:
                        raise Exception('The data format error')
                else:
                    raise Exception('The data format error')
            else:
                errorGroups = []
                for e in err:
                    gr = TagGroup(projId).get_group(e)
                    errorGroups.append(gr.get('name'))
                if errorGroups:
                    raise Exception('目录%s下依然存在目录' % str(errorGroups)[1:-1])
        else:
            raise Exception('The project will not be able to use this feature')

    @classmethod
    def is_tagTree_agree_with_diagnosis(cls, projId):
        rt = False
        x = DiagnosisMapping(projId).get_groupson_num()
        #根目录
        rootGroup = x.get('')
        del x['']
        #二级目录
        secGroup = []
        for rG in rootGroup:
            if rG in x.keys():
                secGroup.extend(x.get(rG, []))
                del x[rG]
        if len(x.keys()) == len(rootGroup) + len(secGroup):
            rt = True
        else:
            #三级目录
            thirdGroup = []
            for sG in secGroup:
                if sG in x.keys():
                    thirdGroup.extend(x.get(sG, []))
                    del x[sG]
            if x:
                for g in x.keys():
                    if g not in thirdGroup:
                        rt = True
            else:
                rt = True
        return rt, list(x.keys())

    @classmethod
    def get_pointName_by_specialTag(cls, projId, tagList, atr):
        attrP = {}
        for tag_key in atr:
            if tag_key in tagList:
                attrP_key = 'attrP.' + tag_key + '.'
                attrP_dict = atr.get(tag_key)
                for attrP_name in attrP_dict:
                    attrP_key += attrP_name
                    attrP_value_list = attrP_dict.get(attrP_name)
                    attrP.update({attrP_key: {'$in': attrP_value_list}})
        rt = ThingsTree(projId).get_pointName(tagList, attrP)
        return rt

    @classmethod
    def get_pointAttr_by_pointName(cls, projId, pointList):
        rt = ThingsTree(projId).get_pointTag(pointList)
        return rt

    @classmethod
    def get_tag_by_groups(cls, projId, groupId, isAll):
        return TagGroup(projId).get_tags_by_group(groupId, isAll)

    @classmethod
    def del_tags_by_groups(cls, projId, groupId, tags):
        son = DiagnosisMapping(projId).get_groupson_num()
        if ObjectId.is_valid(groupId):
            groupId = ObjectId(groupId)
        else:
            groupId = ''
        sonIds = [groupId]

        def get_sonIds(groupIds):
            rt = []
            for i in groupIds:
                rt.extend(son.get(i, []))
            return rt

        res = get_sonIds([groupId])
        sonIds.extend(res)
        while res:
            res = get_sonIds(res)
            sonIds.extend(res)

        return TagGroup(projId).del_tags_by_group(sonIds, tags)

    @classmethod
    def test01(cls):
        mysqlName = 'rtdata_beopdata_shhuawei'
        projId = 72
        name_list = []
        strSQL = 'SELECT pointname FROM %s' % mysqlName
        cnn = MongoConnManager.getConfigConn()
        cursor = None
        dbrv = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(app.config['DATABASE'], strSQL)
        for item in dbrv:
            name_list.append(item[0])
        try:
            cursor = cnn.mdbBb[g_tableDataSource].find(
                {
                    'projId': int(projId),
                    'type': 4,
                    'params.flag': 0
                },
                projection={'_id': 1,
                            'value': 1,
                            'params': 1},
                limit=10000,
                skip=10000 * 3,
                sort=[('_id', 1)])
            for item in cursor:
                name = -1
                if item.get('params'):
                    mapping = item.get('params').get('mapping')
                    if mapping:
                        name = mapping.get('point')
                    else:
                        name = item.get('value')
                else:
                    name = item.get('value')
                if name not in name_list:
                    print(name)
        except Exception as e:
            print('test error' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return None

    @classmethod
    def test02(cls, prt=''):
        collection = 'cloudPoint'
        projId = 72
        cnn = MongoConnManager.getConfigConn()
        cursor = None
        if ObjectId.is_valid(prt):
            cursor = cnn.mdbBb[collection].find({
                'projId': int(projId),
                'type': 'group',
                'prt': ObjectId(prt)
            })
        else:
            cursor = cnn.mdbBb[collection].find({
                'projId': int(projId),
                'type': 'group',
                'prt': ''
            })
        prt_list = list(cursor)
        if cursor:
            cursor.close()
        for item in prt_list:
            attrP = item.get('attrP')
            if attrP:
                cursor = cnn.mdbBb[collection].find({'prt': item.get('_id')})
                g_list = list(cursor)
                for g in g_list:
                    name = g.get('name')
                    if '区' in name:
                        attrP.update({'Zone': name[0]})
                    elif '块' in name:
                        attrP.update({'SubZone': name[0]})
                    elif '编号' in name:
                        attrP.update({'EquipNum': name[2:]})
                    dbrv = cnn.mdbBb[collection].update({
                        '_id': g.get('_id')
                    }, {
                        '$set': {
                            'attrP': attrP
                        }
                    })
                    print(attrP)
            cls.test02(item.get('_id'))
        return None

    @classmethod
    def test03(cls):
        collection = 'cloudPoint'
        projId = 72
        equ = 'VAV'
        net_dict = cls.test04()
        cnn = MongoConnManager.getConfigConn()
        cursor = None
        cursor = cnn.mdbBb[collection].find({
            'projId': int(projId),
            'type': 'group',
            'name': {
                '$regex': '^编号'
            }
        })
        prt_list = list(cursor)
        if cursor:
            cursor.close()
        for item in prt_list:
            attrP = item.get('attrP')
            re = '^VAV_%s_%s_%s' % (attrP.get('Zone'),
                                    attrP.get('Floor') + attrP.get('SubZone'),
                                    attrP.get('EquipNum'))
            nn = re[1:]
            net = None
            for key in net_dict.keys():
                value = net_dict.get(key)
                if nn in value:
                    net = key
                    break
            if net:
                attrP.update({'Net': net})
                dbrv = cnn.mdbBb[collection].update(
                    {
                        'type': 'thing',
                        'name': {
                            '$regex': re
                        }
                    }, {'$set': {
                        'prt': item.get('_id'),
                        'attrP': attrP
                    }},
                    multi=True)
        return None

    @classmethod
    def test04(cls):
        file_list = [
            '01linshi.xlsx', '03linshi.xlsx', '04linshi.xlsx', '05linshi.xlsx',
            '06linshi.xlsx', '07linshi.xlsx', '08linshi.xlsx', '09linshi.xlsx',
            '10linshi.xlsx'
        ]
        file_path = 'C:\\Users\\Chen\\Desktop\\20151228\\'
        rt = {}
        for f in file_list:
            filepath = file_path + f
            datafile = xlrd.open_workbook(filepath)
            nsheets = datafile.nsheets
            for sheetIndex in range(nsheets):
                sh = datafile.sheet_by_index(sheetIndex)
                nrows = sh.nrows
                if nrows > 1:
                    row0_data = sh.row_values(0)
                    if 'out' in row0_data:
                        rt.update({f[:2]: []})
                for x in range(1, nrows):
                    row_data = sh.row_values(x)
                    rt.get(f[:2]).append(row_data[1])
        return rt

    @classmethod
    def test05(cls):
        rt = False
        x = DiagnosisMapping(520).get_groupson_num()
        #根目录
        rootGroup = x.get('')
        del x['']
        #二级目录
        secGroup = []
        for rG in rootGroup:
            if rG in x.keys():
                secGroup.extend(x.get(rG, []))
                del x[rG]
        if len(x.keys()) == len(rootGroup) + len(secGroup):
            rt = True
        else:
            #三级目录
            thirdGroup = []
            for sG in secGroup:
                if sG in x.keys():
                    thirdGroup.extend(x.get(sG, []))
                    del x[sG]
            for g in x.keys():
                if g not in thirdGroup:
                    rt = True
        return rt, list(x.keys())

    @classmethod
    def get_invalid_group(cls, projId):
        valid = []
        groupTree = DiagnosisMapping(projId).get_groupson_num()
        father = ''
        valid.append(father)

        def get_sonIds(father, groupTree):
            res = []
            for f in father:
                res.extend(groupTree.get(f, []))
            return res

        res = get_sonIds([father], groupTree)
        valid.extend(res)
        while res:
            res = get_sonIds(res, groupTree)
            valid.extend(res)
        valid = set(valid)
        entire = list()
        for key in groupTree:
            value = groupTree.get(key)
            entire.append(key)
            entire.extend(value)
        invalid = list(set(entire).difference(valid))
        prt_list = cls.get_invalid_thing_prt(projId)
        invalid.extend(list(set(prt_list).difference(valid)))
        return invalid

    @classmethod
    def get_invalid_thing_prt(cls, projId):
        rt = []
        thing_prt = DiagnosisMapping(projId).get_things_prt()
        return list(thing_prt.keys())

    @classmethod
    def del_invalidGroup(cls, projId):
        invalid = cls.get_invalid_group(projId)
        return TagGroup(projId).del_groups(invalid, '')

    @classmethod
    def analysis_keywords(cls, pointName):
        return TagThing.split_point_name(pointName)

    @classmethod
    def format_painter_v2(cls, projId, sample_groupId, target_groupIds):
        rt = False
        # 获取 样本 group
        sample_group = TagGroup(projId).get_group(sample_groupId)
        sample_group_tag_list = sample_group.get('tag')
        # 对目录打Tag  并且继承
        arrTag = [{
            'Id': target_groupId,
            'tags': sample_group_tag_list,
            'type': 'group'
        } for target_groupId in target_groupIds]
        if cls.set_tag(projId, arrTag, True):
            tagThing = TagThing(projId)
            # 获取 样本 thing
            sample_thing_list = tagThing.get_thing_list_sort_by_keywords(
                [sample_groupId])
            if sample_thing_list:
                # 获取 目标 thing
                target_thing_list = tagThing.get_thing_list_sort_by_keywords(
                    target_groupIds)
                if target_thing_list:
                    arrTag = []
                    for sa in sample_thing_list:
                        sample_tags = sa.get('tag')
                        sample_keywords = sa.get('keywords')
                        n = 0
                        for ta in target_thing_list:
                            target_tags = ta.get('tag')
                            target_keywords = ta.get('keywords')
                            ii = ta.get('_id')
                            if cls.contrast_keywords(sample_keywords,
                                                     target_keywords):
                                # 关键字分析 相同 开启 格式刷
                                n += 1
                                add_tag_list = list(
                                    set(sample_tags).difference(
                                        set(target_tags)))
                                if add_tag_list:
                                    arrTag.append({
                                        'Id': ii,
                                        'tags': add_tag_list,
                                        'type': 'thing'
                                    })
                                # # 规定 两个目录下 只能有1个点 相似
                                # if n == len(target_groupIds):
                                #     break
                            elif cls.contrast_keywords_temp(
                                    sa.get('name'), ta.get('name')):
                                add_tag_list = list(
                                    set(sample_tags).difference(
                                        set(target_tags)))
                                if add_tag_list:
                                    arrTag.append({
                                        'Id': ii,
                                        'tags': add_tag_list,
                                        'type': 'thing'
                                    })
                    rt = cls.set_tag(projId, arrTag, False)
                else:
                    raise Exception('Target group error')
            else:
                raise Exception('Sample group error')
        return rt

    @classmethod
    def contrast_keywords(cls, sam_list, tar_list):
        rt = False
        if sam_list == tar_list:
            rt = True
        return rt

    @classmethod
    def contrast_keywords_temp(cls, sam_name, tar_name):
        rt = False
        sam_list = sam_name.split('_')
        tar_list = tar_name.split('_')
        if sam_list[-1] == tar_list[-1]:
            rt = True
        return rt

    @classmethod
    def mapping_point_from_target_list(cls, sample_point, target_list):
        matching_rate = []
        sam_keywords = sample_point
        return None

    @classmethod
    def get_equipment(cls):
        '''获取所有带有设备标签的节点
        '''
        collection = MongoConnManager.getConfigConn().mdbBb['TagDict']
        equipment_list = [
            tag['name'] for tag in collection.find({
                'type': 'Equipment'
            })
        ]

        return equipment_list

    @classmethod
    def import_tag(cls, equipment_list, projId, lang):
        '''通过设备节点导出节点树
        '''
        tag_tree = []
        collection = MongoConnManager.getConfigConn().mdbBb['cloudPoint']

        # 获取projId对应的equipment
        children = list(
            collection.find({
                '$and': [{
                    'type': 'group',
                    'projId': projId
                }, {
                    'tag': {
                        '$in': equipment_list
                    }
                }]
            }))

        # 删除非根节点
        tag_id_list = [child['_id'] for child in children]
        tag_id_list2 = tag_id_list[:]
        children2 = children[:]
        for child in children2:
            if child['prt'] in tag_id_list2:
                for child2 in children2:
                    if child2['_id'] == child['prt']:
                        try:
                            children.remove(child2)
                            tag_id_list.remove(child2['_id'])
                        except ValueError:
                            pass
                        break

        def search_parent(child):
            '''递归搜索父节点
            '''
            nonlocal tag_tree

            if child['_id'] == child.get('prt', None):
                raise DuplicatedId

            if child.get('prt', None):
                parent = collection.find_one({'_id': child['prt']})
                if parent:
                    result = search_parent(parent)
                    # 设置父节点type为0
                    result['type'] = 0
                    if not result['_id'] in tag_id_list:
                        tag_tree.append(result)
                        tag_id_list.append(result['_id'])
                    return child
                else:
                    raise MissingParent
            else:
                return child

        # 设备子节点为type 1
        for child in children:
            child['type'] = 1
            child['className'] = ''

        # 设备子节点classname
        for child in children:
            for tag, attr_dict in child['attrP'].items():
                class_name = attr_dict.get('HealthGroup')
                if class_name:
                    child['className'] = class_name
                    break
            else:
                if lang == 'zh':
                    child['className'] = '其他'
                elif lang == 'en':
                    child['className'] = 'Other'

        tag_tree = []
        tag_tree.extend(children)
        for child in children:
            # 递归遍历，并删除错误根节点
            try:
                tag_id_list.append(child['_id'])
                search_parent(child)
            except DuplicatedId:
                tag_tree.remove(child)
                print('duplicateid from:' + str(child['_id']))
            except MissingParent:
                tag_tree.remove(child)
                print('missingparent from:' + str(child['_id']))

        # 设置location
        for tag in tag_tree:
            if 'Floor' in tag['tag'] and 'floor' in tag['attrP']\
                and 'Zone' in tag['tag'] and 'zone' in tag['attrP']:
                tag['location'] = tag['attrP']['floor']['Number'] + 'F_' + tag['attrP']['zone']['ZoneName']
            elif 'Floor' in tag['tag'] and 'floor' in tag['attrP']:
                tag['location'] = tag['attrP']['floor']['Number'] + 'F'
            elif 'Zone' in tag['tag'] and 'zone' in tag['attrP']:
                tag['location'] = tag['attrP']['zone']['ZoneName']
            else:
                parent_name = None
                for tag2 in tag_tree:
                    if tag2['_id'] == tag['prt']:
                        parent_name = tag2['name']
                        break
                if parent_name:
                    tag['location'] = parent_name
                else:
                    tag['location'] = ''

        def entity_import():
            container = BEOPDataAccess.getInstance()._mysqlDBContainer

            select_query = '''
                SELECT * FROM {0}
                WHERE tagId IS NOT NULL
            '''.format(TABLE_DIAGNOSIS_ENTITY)

            entity_list = container.op_db_query_dict('diagnosis', select_query)
            return entity_list

        def get_last_id():
            container = BEOPDataAccess.getInstance()._mysqlDBContainer

            select_query = '''
                SELECT id
                FROM {0}
                ORDER BY id DESC
                LIMIT 1
            '''.format(TABLE_DIAGNOSIS_ENTITY)
            result = container.op_db_query('diagnosis', select_query)
            if len(result) == 0:
                return 0
            last_id = result[0][0]

            return last_id

        # 设置数字id
        entity_list = entity_import()

        last_id = get_last_id()
        for tag in tag_tree:
            # 匹配mysql的id
            for entity in entity_list:
                if str(tag['_id']) == entity['tagId']:
                    tag['id'] = entity['id']
                    break
            # 新项就加入新id
            else:
                last_id += 1
                tag['id'] = last_id

        # 设置对应父节点id
        for tag in tag_tree:
            if tag['prt']:
                tag['prt'] = next(
                    filter(lambda tree: tree['_id'] == tag['prt'],
                           tag_tree))['id']

        return tag_tree

    @classmethod
    def export_tag(cls, tag_tree, lang='zh'):
        container = BEOPDataAccess.getInstance()._mysqlDBContainer

        insert_query = '''
        INSERT INTO {0}
            (id, tagid, name, parent, type, projectId, className, location, imported)
        VALUES
            (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            tagid = VALUES(tagid),
            name  = VALUES(name),
            parent  = VALUES(parent),
            type  = VALUES(type),
            projectId  = VALUES(projectId),
            className = VALUES(className),
            location = VALUES(location),
            imported  = VALUES(imported);
        '''.format(TABLE_DIAGNOSIS_ENTITY)

        param_list = []
        id_list = []
        try:
            for tag in tag_tree:
                id_list.append(tag['_id'])
                if not tag.get('className', ''):
                    if lang == 'zh':
                        tag['className'] = '系统'
                    elif lang == 'en':
                        tag['className'] = 'System'
                param_list.append((tag['id'], str(tag['_id']), tag['name'], 0
                                   if tag['prt'] == '' else tag['prt'],
                                   tag['type'], tag['projId'],
                                   tag.get('className',
                                           ''), tag['location'], 1))

            container.op_db_update_all('diagnosis', insert_query, param_list)
            logging.info('tag transfer committed')
        except Exception as e:
            logging.error(str(e))

    @classmethod
    def export_tag_mongo(cls, projId, tag_tree):
        collection = MongoConnManager.getConfigConn().mdbBb['cloudPoint']
        for point in collection.find({'projId': projId}):
            for tag in tag_tree:
                if tag['_id'] == point['_id']:
                    collection.update_one(
                        {
                            '_id': tag['_id']
                        }, {
                            '$set': {
                                'entityId': tag['id'],
                                'entityType': tag['type']
                            }
                        },
                        upsert=True)
                    break
            else:
                collection.update_one(
                    {
                        '_id': point['_id']
                    }, {'$set': {
                        'entityId': '',
                        'entityType': ''
                    }},
                    upsert=True)

        logging.info('mongo entity updated')

    @classmethod
    def get_entity_id(cls, objid):
        objid = str(objid)
        container = BEOPDataAccess.getInstance()._mysqlDBContainer

        select_query = '''
            select id from {1} where tagid = "{0}"
        '''.format(objid, TABLE_DIAGNOSIS_ENTITY)
        entity = container.op_db_query_one('diagnosis', select_query)
        if entity:
            entity_id = entity[0]
        else:
            entity_id = ''
        return entity_id

    @classmethod
    def get_entity_name(cls, entity_id):
        container = BEOPDataAccess.getInstance()._mysqlDBContainer

        select_query = '''
            select name from {1} where id = "{0}"
        '''.format(entity_id, TABLE_DIAGNOSIS_ENTITY)
        rs = container.op_db_query_one('diagnosis', select_query)
        name = None
        if rs:
            name = rs[0]
        return name

    @classmethod
    def get_equip(cls, tagIds, projId, default_weight):
        conn = MongoConnManager.getConfigConn()
        cursor = conn.mdbBb['cloudPoint'].find({
            "_id": {
                "$in": tagIds
            }
        }, {
            "_id": 1,
            "tag": 1
        })
        tags = []
        tagId_tags_map = {}
        tagId_weight_map = {}
        equips = []
        for item in cursor:
            tagId_tags_map[item['_id']] = item['tag']
            tags += item['tag']
        tags = list(set(tags))
        cursor_equip = conn.mdbBb['TagDict'].find({
            "name": {
                "$in": tags
            },
            "type": "Equipment"
        }, {
            "name": 1
        })
        for equip in cursor_equip:
            equips.append(equip.get("name"))
        tuple_equip = str(equips).replace('[', '(').replace(']', ')')
        sql = """
            SELECT
                equip_class_name,
                weight
            FROM
                diagnosis_equip_weight
            WHERE
                equip_class_name
            IN
                {0}
            AND
                project_id = %s
        """.format(tuple_equip)
        dbAccess = BEOPDataAccess.getInstance()
        default_equip_weight = dbAccess._mysqlDBContainerReadOnly.op_db_query(
            "diagnosis", sql, (0, ))
        default_equip_weight_map = dict(default_equip_weight)
        proj_equip_weight = dbAccess._mysqlDBContainerReadOnly.op_db_query(
            "diagnosis", sql, (projId, ))
        equip_weight = dict(proj_equip_weight)
        #获取所有的设备权重
        for default_equip, weight in default_equip_weight_map.items():
            if default_equip not in equip_weight:
                equip_weight[default_equip] = weight
        for equip in equips:
            if equip not in equip_weight:
                equip_weight[equip] = default_weight
        #获取tagId对应的权重
        for tagId, tags in tagId_tags_map.items():
            if not tags:
                tagId_weight_map[tagId] = default_weight
            weightList = []
            for tag in tags:
                if tag not in equip_weight:
                    weightList.append(default_weight)
                else:
                    weightList.append(equip_weight[tag])
            tagId_weight_map[tagId] = max(weightList)

        if cursor:
            cursor.close()
        if cursor_equip:
            cursor_equip.close()
        return tagId_weight_map

    @classmethod
    def get_device_energy(cls, projId):
        collection = MongoConnManager.getConfigConn().mdbBb['cloudPoint']

        # 从mysql获取projId对应的项目的所有tagid
        tagid_list = []

        container = BEOPDataAccess.getInstance()._mysqlDBContainer

        find_tagid = '''
            SELECT tagId from {1} where projectId = {0}
        '''.format(projId, TABLE_DIAGNOSIS_ENTITY)
        tuples = container.op_db_query('diagnosis', find_tagid)
        for tup in tuples:
            if tup[0]:
                tagid_list.append(ObjectId(tup[0]))

        # 获取所有项目group
        groups = list(collection.find({'_id': {'$in': tagid_list}}))

        # 遍历所有设备group，获取对应信息导出到 device_list
        device_list = []

        for group in groups:
            entity_id = pointTag.get_entity_id(group['_id'])
            energy_tag = collection.find_one({
                'projId': projId,
                'type': 'thing',
                'prt': group['_id'],
                'tag': {
                    '$eq': 'Consumption',
                    '$ne': 'Compare',
                    '$ne': 'Statistics'
                }
            })
            if energy_tag:
                energy = '@' + str(projId) + '|' + energy_tag['name']
            else:
                # energy = ''
                continue

            power_tag = collection.find_one({
                'projId': projId,
                'type': 'thing',
                'prt': group['_id'],
                'tag': {
                    '$eq': 'Power',
                    '$ne': 'Compare',
                    '$ne': 'Statistics'
                }
            })
            if power_tag:
                power = '@' + str(projId) + '|' + power_tag['name']
            else:
                power = ''

            pha_ua_tag = collection.find_one({
                'projId':
                projId,
                'type':
                'thing',
                'prt':
                group['_id'],
                'attrP.phasevoltage.Category':
                'Ua',
                'tag': {
                    '$eq': 'Phasevoltage',
                    '$eq': 'Power',
                    '$eq': 'Meter',
                    '$ne': 'Compare',
                    '$ne': 'Statistics'
                }
            })
            if pha_ua_tag:
                ua = '@' + str(projId) + '|' + pha_ua_tag['name']
            else:
                ua = ''

            pha_ub_tag = collection.find_one({
                'projId':
                projId,
                'type':
                'thing',
                'prt':
                group['_id'],
                'attrP.phasevoltage.Category':
                'Ub',
                'tag': {
                    '$eq': 'Phasevoltage',
                    '$eq': 'Power',
                    '$eq': 'Meter',
                    '$ne': 'Compare',
                    '$ne': 'Statistics'
                }
            })
            if pha_ub_tag:
                ub = '@' + str(projId) + '|' + pha_ub_tag['name']
            else:
                ub = ''

            pha_uc_tag = collection.find_one({
                'projId':
                projId,
                'type':
                'thing',
                'prt':
                group['_id'],
                'attrP.phasevoltage.Category':
                'Uc',
                'tag': {
                    '$eq': 'Phasevoltage',
                    '$eq': 'Power',
                    '$eq': 'Meter',
                    '$ne': 'Compare',
                    '$ne': 'Statistics'
                }
            })
            if pha_uc_tag:
                uc = '@' + str(projId) + '|' + pha_uc_tag['name']
            else:
                uc = ''

            linevo_uab_tag = collection.find_one({
                'projId':
                projId,
                'type':
                'thing',
                'prt':
                group['_id'],
                'attrP.linevoltage.Category':
                'Uab',
                'tag': {
                    '$eq': 'Linevoltage',
                    '$eq': 'Power',
                    '$eq': 'Meter',
                    '$ne': 'Compare',
                    '$ne': 'Statistics'
                }
            })
            if linevo_uab_tag:
                uab = '@' + str(projId) + '|' + linevo_uab_tag['name']
            else:
                uab = ''

            linevo_ubc_tag = collection.find_one({
                'projId':
                projId,
                'type':
                'thing',
                'prt':
                group['_id'],
                'attrP.linevoltage.Category':
                'Ubc',
                'tag': {
                    '$eq': 'Linevoltage',
                    '$eq': 'Power',
                    '$eq': 'Meter',
                    '$ne': 'Compare',
                    '$ne': 'Statistics'
                }
            })
            if linevo_ubc_tag:
                ubc = '@' + str(projId) + '|' + linevo_ubc_tag['name']
            else:
                ubc = ''

            linevo_uca_tag = collection.find_one({
                'projId':
                projId,
                'type':
                'thing',
                'prt':
                group['_id'],
                'attrP.linevoltage.Category':
                'Uca',
                'tag': {
                    '$eq': 'Linevoltage',
                    '$eq': 'Power',
                    '$eq': 'Meter',
                    '$ne': 'Compare',
                    '$ne': 'Statistics'
                }
            })
            if linevo_uca_tag:
                uca = '@' + str(projId) + '|' + linevo_uca_tag['name']
            else:
                uca = ''

            linecur_ia_tag = collection.find_one({
                'projId':
                projId,
                'type':
                'thing',
                'prt':
                group['_id'],
                'attrP.linecurrent.Category':
                'Ia',
                'tag': {
                    '$eq': 'Linecurrent',
                    '$eq': 'Power',
                    '$eq': 'Meter',
                    '$ne': 'Compare',
                    '$ne': 'Statistics'
                }
            })
            if linecur_ia_tag:
                ia = '@' + str(projId) + '|' + linecur_ia_tag['name']
            else:
                ia = ''

            linecur_ib_tag = collection.find_one({
                'projId':
                projId,
                'type':
                'thing',
                'prt':
                group['_id'],
                'attrP.linecurrent.Category':
                'Ib',
                'tag': {
                    '$eq': 'Linecurrent',
                    '$eq': 'Power',
                    '$eq': 'Meter',
                    '$ne': 'Compare',
                    '$ne': 'Statistics'
                }
            })
            if linecur_ib_tag:
                ib = '@' + str(projId) + '|' + linecur_ib_tag['name']
            else:
                ib = ''

            linecur_ic_tag = collection.find_one({
                'projId':
                projId,
                'type':
                'thing',
                'prt':
                group['_id'],
                'attrP.linecurrent.Category':
                'Ic',
                'tag': {
                    '$eq': 'Linecurrent',
                    '$eq': 'Power',
                    '$eq': 'Meter',
                    '$ne': 'Compare',
                    '$ne': 'Statistics'
                }
            })
            if linecur_ic_tag:
                ic = '@' + str(projId) + '|' + linecur_ic_tag['name']
            else:
                ic = ''

            powerfactor_tag = collection.find_one({
                'projId': projId,
                'type': 'thing',
                'prt': group['_id'],
                'tag': {
                    '$eq': 'Power',
                    '$eq': 'Factor',
                    '$eq': 'Power',
                    '$eq': 'Meter',
                    '$ne': 'Compare',
                    '$ne': 'Statistics'
                }
            })
            if powerfactor_tag:
                powerfactor = '@' + str(projId) + '|' + powerfactor_tag['name']
            else:
                powerfactor = ''

            device_list.append({
                '_id':
                group['_id'],
                'projectId':
                projId,
                'entityId':
                entity_id,
                'energy':
                energy,
                'cost':
                '',
                'power':
                power,
                'detail': [
                    {
                        'name': 'ua',
                        'point': ua
                    },
                    {
                        'name': 'ub',
                        'point': ub
                    },
                    {
                        'name': 'uc',
                        'point': uc
                    },
                    {
                        'name': 'uab',
                        'point': uab
                    },
                    {
                        'name': 'ubc',
                        'point': ubc
                    },
                    {
                        'name': 'uca',
                        'point': uca
                    },
                    {
                        'name': 'ia',
                        'point': ia
                    },
                    {
                        'name': 'ib',
                        'point': ib
                    },
                    {
                        'name': 'ic',
                        'point': ic
                    },
                    {
                        'name': 'powerfactor',
                        'point': powerfactor
                    },
                ]
            })

        return device_list

    @classmethod
    def energy_config(cls, device_list):
        collection = MongoConnManager.getConfigConn().mdbBb[
            'EnergyManagement_Config']

        for device in device_list:
            collection.update_one(
                {
                    '_id': device['_id']
                }, {'$set': device}, upsert=True)

    @classmethod
    def find_entity_children(cls, entity_id):
        container = BEOPDataAccess.getInstance()._mysqlDBContainer

        find_children = '''
            SELECT tagId from {1} where parent={0} and type = 1
        '''.format(entity_id, TABLE_DIAGNOSIS_ENTITY)
        tuples = container.op_db_query('diagnosis', find_children)

        tagid_list = []
        for tup in tuples:
            if tup[0]:
                tagid_list.append(tup[0])
        return tagid_list

    @classmethod
    def get_device_temperature(cls, projId):
        collection = MongoConnManager.getConfigConn().mdbBb['cloudPoint']

        container = BEOPDataAccess.getInstance()._mysqlDBContainer

        entity_list = []
        parent_list = []

        # 找ds点
        dsSet_list = collection.find({
            'projId':
            projId,
            'type':
            'thing',
            '$and': [{
                'tag': {
                    '$all': ['Temperature', 'Floor', 'Indoor', 'Setpoint']
                }
            }, {
                'tag': {
                    '$nin': ['Compare', 'Statistics']
                }
            }]
        })

        child_entity = {}
        for node in collection.find({
                'projId':
                projId,
                'type':
                'thing',
                '$and': [{
                    'tag': {
                        '$all': ['Temperature', 'Floor', 'Indoor']
                    }
                }, {
                    'tag': {
                        '$nin': ['Compare', 'Statistics', 'Setpoint']
                    }
                }]
        }):
            ds = '@' + str(projId) + '|' + node['name']
            name = node['name']
            dsSet = ''

            for dsSet_point in dsSet_list:
                if dsSet_point['prt'] == node['prt']:
                    if dsSet_point:
                        dsSet = '@' + str(projId) + '|' + dsSet_point['name']
                    else:
                        dsSet = ''
                    break

            entity_id = pointTag.get_entity_id(node['prt'])
            if not child_entity.get(entity_id):
                entity = {
                    'id':
                    entity_id,
                    'prefix':
                    pointTag.get_entity_name(entity_id) + '_' + str(entity_id),
                    'arrSensor': []
                }
                child_entity[entity_id] = entity
                parent_above = collection.find_one({'_id': node['prt']})['prt']
                if parent_above:
                    parent_list.append((parent_above, child_entity[entity_id]))
            child_entity[entity_id]['arrSensor'].append({
                'name': name,
                'type': 'T',
                'dsSet': dsSet,
                'ds': ds,
                'upper': 3,
                'lower': -3
            })

        parent_entity = {}
        for parent_id, entity in parent_list:
            if not parent_entity.get(parent_id):
                entity_id = pointTag.get_entity_id(parent_id)
                parent_entity[parent_id] = {
                    'id':
                    entity_id,
                    'prefix':
                    pointTag.get_entity_name(entity_id) + '_' + str(entity_id),
                    'arrSensor': []
                }
            parent_entity[parent_id]['arrSensor'].extend(entity['arrSensor'])
            parent_id_new = collection.find_one({'_id': parent_id})['prt']
            if parent_id_new:
                parent_list.append((parent_id_new, entity))

        for entity in parent_entity.values():
            entity_list.append(entity)

        for entity in child_entity.values():
            entity_list.append(entity)

        project_dict = {'_id': projId, 'entity': entity_list}

        return project_dict

    @classmethod
    def temperature_config(cls, project_dict):
        collection = MongoConnManager.getConfigConn().mdbBb[
            'ThermalComfort_Config']
        collection.update_one(
            {
                '_id': project_dict['_id']
            }, {'$set': project_dict}, upsert=True)

    @classmethod
    def energy_config_get(cls, projId, energyType):
        collection = MongoConnManager.getConfigConn().mdbBb[
            'EnergyManagement_Config']
        query = {'projectId': projId}
        if (energyType and energyType != 0):
            query['energyType'] = energyType
        else:
            query['$or'] = [{
                'energyType': {
                    '$exists': False
                }
            }, {
                'energyType': 0
            }]
        rt = list(collection.find(query))
        return rt

    @classmethod
    def temperature_config_get(cls, projId):
        collection = MongoConnManager.getConfigConn().mdbBb[
            'ThermalComfort_Config']
        rt = list(collection.find({'_id': projId}))
        return rt

    @classmethod
    def auto_tag_v3(cls, group_id):
        tag_collection = MongoConnManager.getConfigConn().mdbBb['TagDict']
        tag_list = [
            tag['name'] for tag in tag_collection.find({}, {
                'name': 1
            })
        ]

        point_collection = MongoConnManager.getConfigConn().mdbBb[
            'cloudPoint_test']
        regex = re.compile(';' + group_id + ';')
        name_list = []
        id_list = []
        for node in point_collection.find({
                'path': regex
        }, {
                '_id': 1,
                'name': 1
        }):
            name_list.append(node['name'])
            id_list.append(node['_id'])

        retain = ''
        spliter = ['_', '-', '--', '++']
        _, _, c_list = CSMatch.MatchStringList(name_list, retain, spliter,
                                               tag_list)

        for a_id, tag_list in zip(id_list, c_list):
            point_collection.update_one({
                '_id': a_id
            }, {
                '$addToSet': {
                    'tag': {
                        '$each': tag_list
                    }
                }
            })

    @classmethod
    def set_tagAttrP_v2(cls, attr_dict, a_id, inheritable):
        '''
        rush 20170823
        设置设备属性
        post_data = {
            "projId": <project id>, # 弃用
            "attrP":{ # 属性字典
                "floor":{
                    "Number":"1"}},
            "Id":"591d362a833c9712a2d9534a", # 节点id
            "inheritable":true # 是否继承
        }
        '''

        collection = MongoConnManager.getConfigConn().mdbBb['cloudPoint_test']
        if inheritable:
            for attr, value in attr_dict.items():
                regex = re.compile(';' + a_id + ';')
                collection.update_many(
                    {
                        'path': regex
                    }, {'$set': {
                        'attrP.' + attr: value
                    }},
                    upsert=True)
        else:
            for attr, value in attr_dict.items():
                collection.update_many(
                    {
                        '_id': a_id
                    }, {'$set': {
                        'attrP.' + attr: value
                    }},
                    upsert=True)

    @classmethod
    def point_auto_match_v2(cls, data):
        tag_collection = MongoConnManager.getConfigConn().mdbBb['TagDict']
        tag_list = [
            tag['name'] for tag in tag_collection.find({}, {
                'name': 1
            })
        ]

        collection = MongoConnManager.getConfigConn().mdbBb['cloudPoint']
        spliter = ['_', '-', '--', '++']
        retain = ''
        name_list = [node['name'] for node in data]
        _, _, c_list = CSMatch.MatchStringList(name_list, retain, spliter,
                                               tag_list)

        for node, tag_list in zip(data, c_list):
            collection.update_one(
                {
                    '_id': ObjectId(node['id'])
                }, {'$set': {
                    'tag': tag_list
                }},
                upsert=True)

    @classmethod
    def get_all_list(cls, projId, prt, limit, skip, searchText):
        tree_dict = DiagnosisMapping(projId).get_groupson_num()
        query = {}
        rt = []

        def get_all_groupId_by_prt(tree_dict, prt):
            rt = [prt]
            res = tree_dict.get(prt, [])
            while res:
                rt.extend(res)
                ress = []
                for r in res:
                    ress.extend(tree_dict.get(r, []))
                res = ress
            return rt

        prt = ObjectId(prt) if prt else ''
        groups_id = get_all_groupId_by_prt(tree_dict, prt)
        query.update({'prt': {'$in': groups_id}})
        if searchText:
            searchText = Utils.handle_search_text(searchText)
            query.update({
                '$or': [{
                    'name': {
                        '$regex': searchText,
                        '$options': '$i'
                    }
                }, {
                    'note': {
                        '$regex': searchText,
                        '$options': '$i'
                    }
                }]
            })
        if limit and skip:
            rt, count = ThingsTree(projId).search(
                query, limit, skip, [('type', 1), ('prt', 1), ('name', 1)])
        else:
            limit = 500
            skip = 1
            while skip >= 1:
                rv, count = ThingsTree(projId).search(
                    query, limit, skip, [('type', 1), ('prt', 1), ('name', 1)])
                rt.extend(rv)
                skip += 1
                if len(rv) < limit:
                    skip = -1
        return {
            'detailList': rt,
            'count': count,
            'limit': limit if skip >= 1 else None,
            'skip': skip if skip >= 1 else None
        }

    @classmethod
    def set_tag(cls, projId, arrTag, inheritable):
        tag_treeId = {}
        groupId_tag = {}
        thingTree = ThingsTree(projId)
        if inheritable:
            tree_dict = DiagnosisMapping(projId).get_groupson_num()

            def get_all_things_and_greoups(tree_dict, groupId):
                rt = []
                res = tree_dict.get(groupId, [])
                while res:
                    ress = []
                    rt.extend(res)
                    for r in res:
                        ress.extend(tree_dict.get(r, []))
                    res = deepcopy(ress)
                return rt

        for item in arrTag:
            tags = item.get('tags')
            Id = item.get('Id')
            if item.get('type') == 'group' and inheritable:
                tag_list_key = tuple(set(tags))
                if tag_list_key in groupId_tag:
                    groupId_tag.get(tag_list_key).append(ObjectId(Id))
                else:
                    groupId_tag.update({tag_list_key: [ObjectId(Id)]})
                son_groups = get_all_things_and_greoups(
                    tree_dict, ObjectId(Id))
                groupId_tag.get(tag_list_key).extend(son_groups)
            for tag in tags:
                if tag in tag_treeId.keys():
                    tag_treeId.get(tag).append(Id)
                else:
                    tag_treeId.update({tag: [Id]})
        for tag in tag_treeId.keys():
            Ids = tag_treeId.get(tag)
            thingTree.set_tag(Ids, tag)
        if groupId_tag:
            for k in groupId_tag:
                thingTree.set_group_tag(groupId_tag.get(k), list(k))
        return True

    @classmethod
    def get_equipment_info_by_projId(cls, projId_list):
        rt = {}
        match = {'projId': {'$in': projId_list}, 'type': 'group'}
        group_tag_cursor = TagStatistics().group_by_tags(match)
        group_prt_cursor = TagStatistics().group_by_prt(match)
        equipment_list = TagDictV2().get_equipment_tag_list()
        equipment_group_dict = {}
        group_prt_dict = {}
        for i in group_prt_cursor:
            group_prt_dict.update({i.get('_id'): i.get('Ids')})
        for kkk in group_tag_cursor:
            if kkk.get('_id') in equipment_list:
                g_list = kkk.get('Ids')
                for g in g_list:
                    if g in group_prt_dict:
                        if kkk.get('_id') in equipment_group_dict:
                            equipment_group_dict.get(kkk.get('_id')).append(g)
                        else:
                            equipment_group_dict.update({kkk.get('_id'): [g]})
        for item in equipment_group_dict:
            rt.update({item: len(equipment_group_dict.get(item))})
        return rt

    @classmethod
    def get_hasTag_num(cls, projId_list):
        query = {'projId': {'$in': projId_list}, 'tag': {'$ne': []}}
        return TagStatistics().get_count(query)

    @classmethod
    def set_tagAttrP_batch(cls, projId, tag, modif, inheritable):
        if tag:
            attrP_key = 'attrP.' + tag.lower()
            query = {'_id': ObjectId(modif.get('Id'))}
            update = {attrP_key: modif.get('attribute', {})}
            return ThingsTree(projId).update_set(query, update)
        else:
            return None

    @classmethod
    def get_details_by_editAttribute(cls,
                                     projId,
                                     prt,
                                     limit,
                                     skip,
                                     tag,
                                     searchText,
                                     is_all=False):
        rt = []
        query = {}
        if not limit or not skip:
            limit = 500
            skip = 1
        prt = ObjectId(prt) if ObjectId.is_valid(prt) else prt
        if is_all:
            query.update({'type': 'thing'})
        else:
            query.update({'prt': prt})
        if searchText:
            searchText = Utils.handle_search_text(searchText)
            query.update({
                '$or': [{
                    'name': {
                        '$regex': searchText,
                        '$options': '$i'
                    }
                }, {
                    'note': {
                        '$regex': searchText,
                        '$options': '$i'
                    }
                }]
            })
        query.update({'tag': tag})
        tag_info = TagDictV2().tag_get(tag)
        # else:
        #     allow_tag_dict = TagDictV2().get_tags_by_attribute()
        #     query.update({'tag': {'$in': list(allow_tag_dict.keys())}})
        res = ThingsTree(projId).get_detail_new(query, limit, skip)
        count = res.count()
        for item in res:
            item_tag = item.get('tag')
            # if not tag:
            #     for i in item_tag:
            #         if i in allow_tag_dict:
            #             res_tag.update({i: allow_tag_dict.get(i)})
            # else:
            rt.append({
                '_id': item.get('_id').__str__(),
                'name': item.get('name'),
                'tag': item_tag,
                'attribute': item.get('attrP').get(tag.lower(), {}),
                'prt': item.get('prt').__str__(),
                'type': item.get('type'),
                'flag': item.get('flag')
            })
        return {'Details': rt, 'Limit': limit, 'Skip': skip, 'count': count}

    @classmethod
    def get_tags_by_editAttribute(cls, projId, prt, is_all=False):
        rt = {}
        allow_tag_dict = TagDictV2().get_tags_by_attribute()
        if is_all:
            query = {'type': 'thing'}
        else:
            query = {'prt': ObjectId(prt) if ObjectId.is_valid(prt) else prt}
        query.update({'tag': {'$exists': True, '$ne': []}})
        tag_search = ThingsTree(projId).get_detail_new2(
            query, {
                'tag': 1,
                '_id': 0
            })
        tag_set = set()
        for tag_item in tag_search:
            for tag in tag_item['tag']:
                if tag in allow_tag_dict:
                    tag_set.add(tag)
        for tag in tag_set:
            rt[tag] = allow_tag_dict.get(tag)
        return rt

    @classmethod
    def set_tag_v2(cls, project_id, tag_array, inheritable):
        return

    @classmethod
    def auto_tag_v4(cls, group_id, project_id):
        tag_collection = MongoConnManager.getConfigConn().mdbBb['TagDict']
        tag_list = [
            tag['name'] for tag in tag_collection.find({}, {
                'name': 1,
                '_id': 0
            })
        ]
        cloud_point = MongoConnManager.getConfigConn().mdbBb['cloudPoint']
        point_rv = list(
            cloud_point.find({
                'prt': Utils.object_id_wrapper(group_id),
                'projId': project_id
            }, {
                'name': 1
            }))
        id_list = [point['_id'] for point in point_rv]
        name_list = [point['name'] for point in point_rv]

        post_data = {
            'taglist': tag_list,
            'pointnamelist': name_list,
        }
        headers = {'content-type': 'application/json'}
        print(post_data)
        r = requests.post(
            app.config.get('ALGOSVC3_ADDRESS') +
            '/core/stringmatch/string_match_service',
            data=json.dumps(post_data),
            headers=headers)
        tag_rv_list = ast.literal_eval(r.text)

        for point_id, tag_rv in zip(id_list, tag_rv_list):
            cloud_point.update_one({
                '_id': point_id
            }, {
                '$addToSet': {
                    'tag': {
                        '$each': tag_rv[1]
                    }
                }
            })

    @classmethod
    def point_auto_group(cls, project_id):
        cloud_point = MongoConnManager.getConfigConn().mdbBb['cloudPoint']
        point_rv = list(
            cloud_point.find({
                'projId': project_id,
                'prt': '',
                'type': 'thing'
            }, {
                'name': 1
            }))
        name_id_list = {point['name']: point['_id'] for point in point_rv}

        headers = {'content-type': 'application/json'}
        data = {'pointnamelist': list(name_id_list.keys())}
        print(data)
        r = requests.post(
            app.config.get('ALGOSVC3_ADDRESS') +
            '/core/stringmatch/equipment_group_service',
            data=json.dumps(data),
            headers=headers)

        point_tree_rv = ast.literal_eval(r.text)
        # print(point_tree_rv)

        def set_point(parent_name, children_list, location):
            rv = cloud_point.find_one(
                {
                    'name': parent_name,
                    'projId': project_id,
                    'prt': Utils.object_id_wrapper(location),
                    'type': 'group'
                }, {
                    '_id': 1
                })
            if rv:
                location = rv['_id']
            else:
                oid = ObjectId()
                cloud_point.insert({
                    'name': parent_name,
                    'type': 'group',
                    'projId': project_id,
                    'tag': [],
                    'note': '',
                    'keywords': [],
                    'prt': Utils.object_id_wrapper(location),
                    'attrP': {},
                    '_id': oid
                })
                print('add directory: ', parent_name)
                location = oid
            point_list = []
            dict_list = []
            for child in children_list:
                if type(child) is str:
                    point_list.append(child)
                else:
                    dict_list.append(child)
            if point_list:
                cloud_point.update_many({'projId': project_id, 'type': 'thing', 'prt': '', 'name': {'$in': point_list}}, {'$set': {'prt': location}})
                print('update point: ', str(point_list))
            if dict_list:
                for d in dict_list:
                    k = list(d.keys())[0]
                    set_point(k, d[k], location)

        for k, v in point_tree_rv.items():
            set_point(k, v, '')