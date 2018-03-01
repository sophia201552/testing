from beopWeb.BEOPDataAccess import *
from beopWeb.mod_workflow.Transaction import Transaction
from beopWeb.mod_workflow.TransactionMember import TransactionMember
from beopWeb.mod_workflow.TransactionGroupUser import TransactionGroupUser
from beopWeb.mod_workflow.TransactionGroup import TransactionGroup
from beopWeb.mod_workflow.TransactionAttachment import TransactionAttachment

g_table_asset_inventory = 'Asset_Inventory'


class Asset:
    def __init__(self):
        pass

    @classmethod
    def putin_inventory(cls, post_data, userId):
        rt = None
        try:
            userName = BEOPDataAccess.getInstance().getUserNameById(userId)
            post_data.update(
                {'_id': ObjectId(), 'username': userName, 'userId': int(userId), 'type': 1, 'time': datetime.now()})
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
        try:
            userName = BEOPDataAccess.getInstance().getUserNameById(userId)
            post_data.update(
                {'_id': ObjectId(), 'username': userName, 'userId': int(userId), 'type': 2, 'time': datetime.now()})
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
                cls.inventory_alarm(pId)
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
    def inventory_alarm(cls, part_id):
        part_detail = MongoConnManager.getConfigConn().get_PartDetail(part_id)
        if not part_detail or part_detail.get('qty') >= part_detail.get('alarmValue'):
            return
        t = Transaction()
        detail = '''
        <table class="table table-bordered" id="wf-part-alarm">
            <caption>以下零配件库存不足，请注意及时补货</caption>
            <thead>
                <tr>
                    <th style="text-align: center;">名称</th>
                    <th style="text-align: center;">型号</th>
                    <th style="text-align: center;">规格</th>
                    <th style="text-align: center;">当前库存</th>
                    <th style="text-align: center;">库存警戒值</th>
                </tr>
            </thead>
            <tbody>
            <tr>
                <th scope="row" style="text-align: center;">{name}</th>
                <td style="text-align: center;">{model}</td>
                <td style="text-align: center;">{spec}</td>
                <td style="text-align: center;">{qty}</td>
                <td style="text-align: center;">{alarmValue}</td>
            </tr>
            </tbody>
        </table>
        '''.format(name=part_detail.get('name'), model=part_detail.get('model'), spec=part_detail.get('spec'),
                   qty=part_detail.get('qty'), alarmValue=part_detail.get('alarmValue'))
        executor_id = part_detail.get('executor', [])[0]
        tg = TransactionGroup()
        groups = tg.get_all_groups_by_user_id(executor_id)
        group_name = '资产管理'
        group_id = None
        for group in groups:
            if group.get('name') == group_name:
                group_id = group.get('id')

        if not group_id:
            group_id = tg.add_group(group_name, executor_id, '资产管理默认工单组', datetime.now())
            tgu = TransactionGroupUser()
            tgu.add_user_to_group(executor_id, group_id, 1)

        trans_id = t.add_trans(dict(title=part_detail.get('name') + '--库存不足', detail=detail, groupid=group_id,
                                    executorID=executor_id,
                                    creatorId=1, createTime=datetime.now(),
                                    dueDate=datetime.now() + timedelta(days=7)))
        if not trans_id:
            return
        t.trans_remind(trans_id)
        tm = TransactionMember()
        for verifier in part_detail.get('verifiers', []):
            tm.add_verifier(trans_id, verifier)
        for watcher in part_detail.get('watchers', []):
            tm.add_watcher(trans_id, watcher)
        ta = TransactionAttachment()
        for attachment in part_detail.get('attachment', []):
            ta.upload_new_file(trans_id, attachment.get('userId'),
                               attachment.get('fileName'), attachment.get('uploadTime'), attachment.get('uid'))




