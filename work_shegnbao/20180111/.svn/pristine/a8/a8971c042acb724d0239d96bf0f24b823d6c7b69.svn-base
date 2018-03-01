from beopWeb.BEOPDataAccess import *
from functools import reduce
g_table_asset_inventory = 'Asset_Inventory'


class Asset:
    def __init__(self):
        pass

    @classmethod
    def putin_inventory(cls, post_data, userId):
        rt = None
        if not post_data.get('time'):
            action_time = datetime.now()
        else:
            action_time = datetime.strptime(post_data.get('time'), Utils.datetime_format_date)
        try:
            userName = BEOPDataAccess.getInstance().getUserNameById(userId)
            post_data.update(
                {'_id': ObjectId(), 'username': userName, 'userId': int(userId), 'type': 1, 'time': action_time})
            parts = post_data.get('parts')
            cnn = MongoConnManager.getConfigConn()
            dbrv = cnn.mdbBb[g_table_asset_inventory].insert(post_data)
            rt = post_data.get('_id').__str__()
            for p in parts:
                pId = p.get('part_id')
                qty = p.get('qty')
                dbrv = cnn.mdbBb[g_table_asset_part].update({'_id':ObjectId(pId)}, {'$inc':{'qty':abs(qty)}})
        except Exception as e:
            print('putin_inventory error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def get_part_info_list(cls, groupId):
        rt = []
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            if ObjectId.is_valid(groupId):
                id_list = []
                cursor = cnn.mdbBb[g_table_iot_thing].find({'arrIdGroup': ObjectId(groupId)})
                for item in cursor:
                    try:
                        id_list.append(item.get('_id'))
                    except Exception as e:
                        print('get_part_info_list dataerror:')
                        print(item)
                if cursor:
                    cursor.close()
                if id_list:
                    cursor = cnn.mdbBb[g_table_asset_part].find({'_id':{'$in':id_list}})
                for i in cursor:
                    try:
                        rt.append({'_id': i.get('_id').__str__(), 'name': i.get('name'), 'model': i.get('model'),
                                   'spec': i.get('spec'), 'brand': i.get('brand'), 'supplier': i.get('supplier'),
                                   'unit': i.get('unit'), 'qty': int(i.get('qty')), 'price': float(i.get('price')),
                                   'alarmValue': int('alarmValue'), 'remark': i.get('remark'),
                                   'attachments': i.get('attachments'), 'executors': i.get('executors'),
                                   'verifiers': i.get('verifiers'), 'watchers': i.get('watchers'),
                                   'createTime': i.get('createTime').strftime('%Y-%m-%d %H:%M:%S'),
                                   'images': i.get('images')})
                    except Exception as e:
                        print('get_part_info_list dataerror:' + e.__str__())
                        print(i)
        except Exception as e:
            print('get_part_info_list error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def putout_inventory(cls, post_data, userId):
        rt = None
        if not post_data.get('time'):
            action_time = datetime.now()
        else:
            action_time = datetime.strptime(post_data.get('time'), Utils.datetime_format_date)
        try:
            userName = BEOPDataAccess.getInstance().getUserNameById(userId)
            post_data.update(
                {'_id': ObjectId(), 'username': userName, 'userId': int(userId), 'type': 2, 'time': action_time})
            parts = post_data.get('parts')
            cnn = MongoConnManager.getConfigConn()
            dbrv = cnn.mdbBb[g_table_asset_inventory].insert(post_data)
            rt = post_data.get('_id').__str__()
            for p in parts:
                pId = p.get('part_id')
                qty = p.get('qty')
                dbrv = cnn.mdbBb[g_table_asset_part].update({'_id':ObjectId(pId)}, {'$inc':{'qty':abs(qty) * -1}})
                dbrv = cnn.mdbBb[g_table_asset_part].find_one({'_id':ObjectId(pId)})
                if int(dbrv.get('qty')) < 0:
                    dbrv = cnn.mdbBb[g_table_asset_part].update({'_id':ObjectId(pId)}, {'$set':{'qty':0}})
        except Exception as e:
            print('putout_inventory error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def get_inventory_list_by_id(cls, part_id, startTime, endTime):
        rt = []
        part_id_list = []
        try:
            query = {'time': {'$gte': startTime, '$lte': endTime}}
            n = 0
            limit = 100
            while n >= 0:
                cur = cls.get_inventory_list(query, limit, limit * n)
                if cur:
                    n = n + 1
                    for c in cur:
                        try:
                            parts = c.get('parts')
                            for part in parts:
                                if part_id == part.get('part_id').__str__():
                                    part_id_list.extend(parts)
                                    rt.append(c)
                        except Exception as e:
                            print('get_inventory_list_by_id dataerror:' + e.__str__())
                            print(c)
                else:
                    n = -1
            name_dict = cls.get_part_name_by_idList([x.get('part_id') for x in part_id_list])
            for item in rt:
                if item.get('time'):
                    action_time = datetime.strptime(item.get('time'), Utils.datetime_format_full)
                    item['time'] = action_time.strftime(Utils.datetime_format_date)
                par = item.get('parts')
                for p in par:
                    p.update({'part_name': name_dict.get(p.get('part_id'))})
        except Exception as e:
            print('get_inventory_list_by_id error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def get_inventory_list(cls, query, limit=100, skip=0):
        rt = []
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb[g_table_asset_inventory].find(query, limit=limit, skip=skip, sort=[('time', -1)])
            for item in cursor:
                try:
                    rt.append(
                        {'_id': item.get('_id').__str__(), 'type': item.get('type'), 'username': item.get('username'),
                         'userId': item.get('userId'),
                         'time': item.get('time').strftime('%Y-%m-%d %H:%M:%S'), 'remark': item.get('remark'),
                         'attachments': item.get('attachments'), 'parts': item.get('parts')})
                except Exception as e:
                    print('get_inventory_list dataerror:' + e.__str__())
                    print(item)
        except Exception as e:
            print('get_inventory_list error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_part_name_by_idList(cls, IdList):
        rt = {}
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb[g_table_iot_thing].find(
                {'_id': {'$in': [ObjectId(i) for i in IdList if ObjectId.is_valid(i)]}})
            for item in cursor:
                rt.update({item.get('_id').__str__(): item.get('name')})
        except Exception as e:
            print('get_part_name_by_idList error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def getSonGroupThings(cls, projId, parent):
        rt = {}
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            #获取各个组对应的ObjectId
            cursor = cnn.mdbBb[g_table_iot_group].find({'projId': int(projId), '_idPrt': {'$ne': None}})
            for item in cursor:
                try:
                    rt.update(
                        {
                            item.get('_id').__str__(): {'name': item.get('name'), 'parent': item.get('_idPrt')}
                        }
                    )
                except Exception as e:
                    print('getSonGroupThings data error:' + e.__str__())
                    print(item)
            return rt
        except Exception as e:
            print('getSonGroupThings error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()


    @classmethod
    def getGroupsThings(cls, projId):
        rt = {}
        thingList = []
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            #获取各个组对应的ObjectId
            cursor = cnn.mdbBb[g_table_iot_group].find({'projId':int(projId)})
            for item in cursor:
                try:
                    rt.update(
                        {
                            item.get('_id').__str__(): {'name': item.get('name'), 'parent': item.get('_idPrt')}
                        }
                    )
                except Exception as e:
                    print('getGroupsThings data error:' + e.__str__())
                    print(item)
            if cursor:
                cursor.close()
            totalList = [ObjectId(key) for key in rt.keys()]
            query = {'arrIdGrp':{'$in': totalList}, 'projId': int(projId)}
            cursor = cnn.mdbBb[g_table_iot_thing].find(query)

            for item in cursor:
                thingList.append(
                    {
                        'ThingName':item.get('name'),
                        'groupId': item.get('arrIdGrp'),
                        '_id': item.get('_id')
                    }
                )
        except Exception as e:
            print('getGroupsThings error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt, thingList

    @classmethod
    def checkThings(cls, rt, thingList):
        rv = {}
        try:
            sonList = {}
            for key, value in rt.items():
                _id = key
                name = value.get('name')
                parent = value.get('parent')
                temp = []
                for thing in thingList:
                    for group in thing.get('groupId'):
                        if group.__str__() == _id:
                            temp.append(thing.get('ThingName'))
                if parent:
                    if rt.get(parent.__str__()):
                        son = sonList.get(rt[parent.__str__()].get('name'), {})
                        son.update({name:temp})
                        sonList.update({rt[parent.__str__()]['name']: son})
                else:
                    rv.update({name:temp})
            for key in sonList.keys():
                if key not in rv:
                    rv.update(sonList)
                else:
                    rv.update({key+'_son': sonList[key]})
        except Exception as e:
            logging.error("checkThings error: %s" % e.__str__())
        data = {}
        for k, v in rv.items():
            cls.getThingNum(v, k, data)
        son = []
        for key in data:
            if key.endswith('_son'):
                data.update({key[:-4]: data[key[:-4]]+data[key]})
                son.append(key)
        for x in son: data.pop(x)
        total = reduce(lambda x, y : x + y, list(data.values()))
        data.update({'total': total})
        return data



    @classmethod
    def getThingNum(cls, data, key, rt):
        num = rt.get(key, 0)
        if isinstance(data, dict):
            for d in data.values():
                num = cls.getThingNum(d, key, rt)
        else:
            num += len(data)
        rt.update({key: num})
        return num

    @classmethod
    def getMainTainNum(cls, data, key, rt):
        num = rt.get(key, 0)
        if isinstance(data, dict):
            for d in data.values():
                num = cls.getMainTainNum(d, key, rt)
        else:
            for m in data:
                if m.get('maintain'):
                    num += len(m.get('maintain'))
        rt.update({key: num})
        return num




    @classmethod
    def checkMainTain(cls, rt, thingList):
        rv = []
        cursor = None
        try:
            things = []
            for thing in thingList:
                things.append(thing.get('_id').__str__())
            query = {'thing_id': {'$in': things}}
            cnn = MongoConnManager.getConfigConn()
            #获取各个组对应的ObjectId
            cursor = cnn.mdbBb[g_table_asset_maintain_records].find(query)
            for item in cursor:
                thing_id = ObjectId(item.get('thing_id')) if isinstance(item.get('thing_id'), str) else item.get('thing_id')
                content = item.get('content', '')
                createTime = item.get('createTime')
                creator = item.get('creator')
                rv.append(
                    dict(
                        thing_id = thing_id,
                        content = content,
                        createTime = createTime,
                        creator = creator
                    )
                )
            result = {}
            for item in rv:
                thing_id = item.get('thing_id')
                content = item.get('content')
                createTime = item.get('createTime')
                creator = item.get('creator')
                for thing in thingList:
                    records = thing.get('maintain', [])
                    if thing.get('_id') == thing_id:
                        records.append({
                                    'content': content,
                                    'createTime': createTime,
                                    'creator': creator

                                })
                        thing.update({'maintain':records})
            sonList = {}
            for key, value in rt.items():
                _id = key
                name = value.get('name')
                parent = value.get('parent')
                temp = []
                for thing in thingList:
                    for group in thing.get('groupId'):
                        if group.__str__() == _id:
                            temp.append(
                                dict(
                                    name = thing.get('ThingName'),
                                    maintain = thing.get('maintain')
                                )
                            )
                if parent:
                    if rt.get(parent.__str__()):
                        son = sonList.get(rt[parent.__str__()].get('name'), {})
                        son.update({name:temp})
                        sonList.update({rt[parent.__str__()]['name']: son})
                else:
                    result.update({name:temp})
            for key in sonList.keys():
                if key not in result:
                    result.update(sonList)
                else:
                    result.update({key+'_son': sonList[key]})
            data = {}
            for k, v in result.items():
                cls.getMainTainNum(v, k, data)
            son = []
            for key in data:
                if key.endswith('_son'):
                    data.update({key[:-4]: data[key[:-4]] + data[key]})
                    son.append(key)
            for x in son: data.pop(x)
            total = reduce(lambda x, y: x + y, list(data.values()))
            data.update({'total': total})
            return data
        except Exception as e:
            print('checkMainTain error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
