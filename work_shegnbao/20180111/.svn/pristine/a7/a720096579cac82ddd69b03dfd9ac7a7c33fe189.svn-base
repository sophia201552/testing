import logging

from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.MongoConnManager import MongoConnManager

from .TagDict import TagDict

SORTED = [('name', 1)]

class DiagnosisMapping:

    def __init__(self, projId):
        self.projId = int(projId)
        self.mysqlName = BEOPDataAccess.getInstance().getProjMysqldb(self.projId)
        # {_id: [buildingId, buildingName]}
        self.building = {}
        # {_id: [subbuildingId, subbuildingName, buildingId, buildingName]}
        self.subbuilding = {}

    def get_equipmentIds_from_mysql(self):
        rt = {}
        if self.mysqlName:
            dbAccess = BEOPDataAccess.getInstance()
            strSQL = 'SELECT Id, Name FROM %s_diagnosis_equipments' % self.mysqlName
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            for item in dbrv:
                rt.update({item[1]: int(item[0])})
        return rt

    def del_equipment_zones_table(self):
        rt = False
        if self.mysqlName:
            dbAccess = BEOPDataAccess.getInstance()
            strSQL = 'DELETE FROM %s_diagnosis_equipments' % self.mysqlName
            dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
            strSQL = 'DELETE FROM %s_diagnosis_zones' % self.mysqlName
            dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
            if dbrv:
                rt =True
        return rt

    def insert_equipment_zones(self, equipments):
        rt = False
        dbAccess = BEOPDataAccess.getInstance()
        if self.mysqlName:
            subbuildingIds = []
            for equipment in equipments:
                strSQL = 'INSERT INTO %s_diagnosis_equipments(Id, Name, ZoneId, Project, PageId, SystemId, SubSystemId) '\
                         'VALUES(%d, "%s", %d, %d, 0, 0, 0)' % (self.mysqlName, equipment.get('equipmentId'), equipment.get('equipmentName'),
                                                                equipment.get('subbuildingId'), self.projId)
                dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
                if equipment.get('subbuildingId') not in subbuildingIds:
                    strSQL = 'INSERT INTO %s_diagnosis_zones(Id, SubBuildingId, '\
                            'SubBuildingName, BuildingId, BuildingName, Project, PageId) '\
                            'VALUES (%d, %d, "%s", %d, "%s", %d, %d)' % (self.mysqlName, equipment.get('subbuildingId'),
                                                                         equipment.get('subbuildingId'), equipment.get('subbuildingName'),
                                                                         equipment.get('buildingId'), equipment.get('buildingName'), self.projId,
                                                                         equipment.get('subbuildingId'))
                    dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
                    subbuildingIds.append(equipment.get('subbuildingId'))
            rt = True
        return rt

    def update_tag(self, equipments):
        cnn = MongoConnManager.getConfigConn()
        for equipment in equipments:
            dbrv = cnn.mdbBb['cloudPoint'].update({'_id': equipment.get('_id')},
                                                  {'$set': {'equipmentId': equipment.get('equipmentId')}})

    def get_building_from_tag(self):
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            equipment_tag = TagDict.get_equipment_tag_list()
            cursor = cnn.mdbBb['cloudPoint'].find({'projId': self.projId, 'prt': '', 'type': 'group'}, sort=SORTED)
            n = 100
            for item in cursor:
                tag = item.get('tag')
                if tag:
                    for t in tag:
                        if t in equipment_tag:
                            self.building.update({item.get('_id'): [n, item.get('name')]})
                            n += 1
        except Exception as e:
            print('get_building_from_tag error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()

    def get_subbulding_building_from_tag(self):
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb['cloudPoint'].find({'projId': self.projId,
                                                   'prt': {'$in': list(self.building.keys())},
                                                   'type': 'group'}, sort=SORTED)
            n = 1000
            for item in cursor:
                self.subbuilding.update({item.get('_id'): [n, item.get('name'), 
                                                           self.building.get(item.get('prt'))[0],
                                                           self.building.get(item.get('prt'))[1]]})
                n += 1
        except Exception as e:
            print('get_subbulding_building_from_tag error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
    
    def get_equipment_subbuilding_building_from_tag(self):
        rt = []
        cursor = None
        try:
            e_dict = self.get_equipmentIds_from_mysql()
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb['cloudPoint'].find({'projId': self.projId,
                                                   'prt': {'$in': list(self.subbuilding.keys())},
                                                   'type': 'group'}, sort=SORTED)
            n = 10000
            for item in cursor:
                while n in e_dict.values():
                    n += 1
                subbuilding = self.subbuilding.get(item.get('prt'))
                equipmentName = subbuilding[3] + '_' + subbuilding[1] + '_' + item.get('name')
                if equipmentName in e_dict.keys():
                    equipmentId = e_dict.get(equipmentName)
                else:
                    equipmentId = n
                subbuilding = self.subbuilding.get(item.get('prt'))
                equipment = {'equipmentId': equipmentId, 'equipmentName': equipmentName,
                             'name': item.get('name'), '_id': item.get('_id'),
                             'subbuildingId': subbuilding[0], 'subbuildingName': subbuilding[1],
                             'buildingId': subbuilding[2], 'buildingName': subbuilding[3]}
                rt.append(equipment)
                n += 1
        except Exception as e:
            print('get_equipment_subbuilding_building_from_tag error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_groupson_num(self):
        rt = {}
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb['cloudPoint'].aggregate([{'$match': {'projId': self.projId, 'type': 'group'}},
                                                        {'$group': {'_id': '$prt',
                                                                    'count': {'$sum': 1},
                                                                    'Ids': {'$addToSet': '$_id'}}}])
            for item in cursor:
                rt.update({item.get('_id'): item.get('Ids')})
        except Exception as e:
            print('get_groupson_num error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_things_prt(self):
        rt = {}
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb['cloudPoint'].aggregate([{'$match': {'projId': self.projId, 'type': 'thing'}},
                                                        {'$group': {'_id': '$prt',
                                                                    'count': {'$sum': 1},
                                                                    'Ids': {'$addToSet': '$_id'}}}])
            for item in cursor:
                rt.update({item.get('_id'): item.get('count')})
        except Exception as e:
            print('get_tag_tree error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_things_all(self):
        rt = {}
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb['cloudPoint'].aggregate([{'$match': {'projId': self.projId}},
                                                        {'$group': {'_id': '$prt',
                                                                    'count': {'$sum': 1},
                                                                    'types': {'$push': '$type'},
                                                                    'Ids': {'$addToSet': '$_id'}}}])
            for item in cursor:
                rt.update({item.get('_id'): {'types': item.get('types'), 'Ids':item.get('Ids'), 'count': item.get('count')}})
        except Exception as e:
            print('get_things_all error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt