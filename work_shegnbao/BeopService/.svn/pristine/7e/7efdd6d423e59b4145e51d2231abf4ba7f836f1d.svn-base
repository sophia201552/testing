
import logging, requests, json, os

from mod_DataAccess.MongoConnManager import *

Patrol_key_list = ['point','path','executor','mission','missionlog']
Config_key_list = ['CustomNav', 'CustomNavItem', 'SpringLayout']

class BackupsOperation:

    def __int__(self):
        pass

    @classmethod
    def get_patrol_data_by_projId(cls, projId):
        rt = {}.fromkeys(Patrol_key_list, [])
        cursor = None
        try:
            Monegoconn = MongoConnManager.getConfigConn()
            cursor = Monegoconn.mdbBb['Patrol_Exector'].find({'projId':int(projId)})
            for item in cursor:
                try:
                    item.update({'_id':item.get('_id').__str__()})
                    rt.get('executor').append(item)
                except Exception as e:
                    pass
            if cursor:
                cursor.close()
            cursor = Monegoconn.mdbBb['Patrol_Mission'].find({'projId':int(projId)})
            for item in cursor:
                try:
                    item.update({'_id':item.get('_id').__str__(), 'startTime':item.get('startTime').strftime('%Y-%m-%d %H:%M:%S')})
                    rt.get('mission').append(item)
                except Exception as e:
                    pass
            if cursor:
                cursor.close()
            cursor = Monegoconn.mdbBb['Patrol_MissionLog'].find({'projId':int(projId)})
            for item in cursor:
                try:
                    item.update({'_id':item.get('_id').__str__(), 'executorId':item.get('executorId').__str__(),
                                 'pathId':item.get('pathId').__str__(), 'missionId':item.get('missionId').__str__(),
                                 'endTime':item.get('endTime').strftime('%Y-%m-%d %H:%M:%S'),
                                 'startTime':item.get('startTime').strftime('%Y-%m-%d %H:%M:%S')})
                    rt.get('missionlog').append(item)
                except Exception as e:
                    pass
            if cursor:
                cursor.close()
            cursor = Monegoconn.mdbBb['Patrol_Path'].find({'projId':int(projId)})
            for item in cursor:
                try:
                    item.update({'_id':item.get('_id').__str__(), 'updateTime':item.get('updateTime').strftime('%Y-%m-%d %H:%M:%S')})
                    rt.get('path').append(item)
                except Exception as e:
                    pass
            if cursor:
                cursor.close()
            cursor = Monegoconn.mdbBb['Patrol_Point'].find({'projId':int(projId)})
            for item in cursor:
                try:
                    item.update({'_id':item.get('_id').__str__(), 'updateTime':item.get('updateTime').strftime('%Y-%m-%d %H:%M:%S'),
                                 'lastTime':item.get('lastTime').strftime('%Y-%m-%d %H:%M:%S')})
                    rt.get('point').append(item)
                except Exception as e:
                    pass
        except Exception as e:
            print('get_patrol_data_by_projId error:' + e.__str__())
            app.logger.error('get_patrol_data_by_projId error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_config_by_projId(cls, projId):
        rt = {}.fromkeys(Config_key_list, [])
        cursor = None
        try:
            Mongoconn = MongoConnManager.getConfigConn()
            Nav = Mongoconn.mdbBb['CustomNav_copy'].find_one({'projectId':int(projId)})
            if Nav:
                Item_list = []
                Nav_list = Nav.get('list', [])
                Item_list.extend(Nav_list)
                Nav_role_list = Nav.get('roleNav')
                for i in Nav_role_list:
                    Item_list.extend(i.get('nav', []))
                    Item_list.extend(i.get('funcNav', []))
                Nav_nav_list = Nav.get('nav')
                Item_list.extend(Nav_nav_list)
                rt.get('CustomNav').append(Nav)
                cursor = Mongoconn.mdbBb['CustomNavItem_copy'].find({'_id':{'$in':Item_list}})
                item_id_list = []
                for item in cursor:
                    rt.get('CustomNavItem').append(item)
                    item_id_list.append(item.get('_id').__str__())
                if cursor:
                    cursor.close()
                cursor = Mongoconn.mdbBb['SpringLayout'].find({'menuItemId':{'$in':item_id_list}})
                for item in cursor:
                    rt.get('SpringLayout').append(item)
        except Exception as e:
            print('backups_config_by_projId error' + e.__str__())
            app.logger.error('backups_config_by_projId error' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def backup_patrol(cls, projId, dbcontent):
        rt = False
        try:
            if isinstance(dbcontent, dict):
                res = []
                filename = 'C:/Bak/' + str(projId) + '/' + 'Patrol_' + datetime.now().strftime('%Y-%m-%d-%H-%M') + '.json'
                if not os.path.exists('C:/Bak'):
                    os.mkdir('C:/Bak/')
                if not os.path.exists('C:/Bak/' + str(projId)):
                    os.mkdir('C:/Bak/' + str(projId))
                if os.path.exists(filename):
                    os.remove(filename)
                for key in dbcontent.keys():
                    value = dbcontent.get(key)
                    if isinstance(value, list) and key in Patrol_key_list:
                        res.append(cls.backup_document(filename, value, key))
                if len(res) == len(Patrol_key_list):
                    rt = True
                    for r in res:
                        if not r:
                            rt = False
                            break
        except Exception as e:
            print('backup_patroll error:' + e.__str__())
            app.logger.error('backup_patroll error:' + e.__str__())
        return rt

    @classmethod
    def backup_project_config(cls, projId, dbcontent):
        rt = False
        try:
            if isinstance(dbcontent, dict):
                res = []
                filename = 'C:/Bak/' + str(projId) + '/' + 'Config_' + datetime.now().strftime('%Y-%m-%d-%H-%M') + '.json'
                if not os.path.exists('C:/Bak'):
                    os.mkdir('C:/Bak/')
                if not os.path.exists('C:/Bak/' + str(projId)):
                    os.mkdir('C:/Bak/' + str(projId))
                if os.path.exists(filename):
                    os.remove(filename)
                for key in dbcontent.keys():
                    value = dbcontent.get(key)
                    if isinstance(value, list) and key in Config_key_list:
                        res.append(cls.backup_document(filename, value, key))
                if len(res) == len(Config_key_list):
                    rt = True
                    for r in res:
                        if not r:
                            rt = False
                            break
        except Exception as e:
            print('backup_patroll error:' + e.__str__())
            app.logger.error('backup_patroll error:' + e.__str__())
        return rt

    @classmethod
    def backup_document(cls, filename, doc_list, doc_collection=''):
        rt = False
        file = None
        try:
            file = open(filename, 'a', encoding='utf-8')
            for doc in doc_list:
                if isinstance(doc, dict):
                    file.write(str(doc_collection) + '|' + str(doc) + '\n')
        except Exception as e:
            print('backup_patroll_document error:' + e.__str__())
            app.logger.error('backup_patroll_document error:' + e.__str__())
        finally:
            if file:
                file.close()
        return rt

class RecoveryOperation:

    def __init__(self):
        pass

    @classmethod
    def recovery_patrol(cls, projId, date_str):
        rt = False
        file = None
        try:
            filename = 'C:/Bak/' + str(projId) + '/' + 'Patrol_' + str(date_str) + '.json'
            document = {}.fromkeys(Patrol_key_list,[])
            file = open(filename, 'rb')
            for f in file:
                line = f.decode('utf-8')
                line_list = line.split('|', 1)
                if line_list[0] in document.keys():
                    document.get(line_list[0]).append(line_list[1])
        except Exception as e:
            print('recovery_patrol error:' + e.__str__())
            app.logger.error('recovery_patrol error:' + e.__str__())
        finally:
            if file:
                file.close()
        return rt

    @classmethod
    def recovery_config(cls, projId, date_str):
        rt = False
        file = None
        try:
            filename = 'C:/Bak/' + str(projId) + '/' + 'Config_' + str(date_str) + '.json'
            document = {}.fromkeys(Patrol_key_list,[])
            file = open(filename, 'rb')
            for f in file:
                line = f.decode('utf-8')
                line_list = line.split('|', 1)
                if line_list[0] in document.keys():
                    document.get(line_list[0]).append(line_list[1])
        except Exception as e:
            print('recovery_config error:' + e.__str__())
            app.logger.error('recovery_config error:' + e.__str__())
        finally:
            if file:
                file.close()
        return rt

    @classmethod
    def get_date_list_of_backups(cls, projId):
        rt = []
        try:
            filedir = 'C:/Bak/' + str(projId)
            file_list = os.listdir(filedir)
            for f in file_list:
                temp = f.split('_', 1)
                r = temp[1].split('.', 1)
                rt.append(r)
        except Exception as e:
            print('recovery_patrol error:' + e.__str__())
            app.logger.error('recovery_patrol error:' + e.__str__())
        return rt