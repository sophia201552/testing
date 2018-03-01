"""策略组态 数据处理层"""
from datetime import datetime
from mysql.connector.conversion import MySQLConverter
from beopWeb import app
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.MongoConnManager import *
import time

class ThermalComfortService:
    ''' 热舒适 数据处理类 '''

    @classmethod
    def get_thermal_comfort_configInfo(cls, project_id=None):
        ''' 根据项目id，获取对应的 json配置 '''
        cursor = None
        rt = []
        try:
            connMongo = MongoConnManager.getConfigConn()
            if project_id is not None:
                ret = connMongo.mdbBb['ThermalComfort_Config'].find_one({'_id': int(project_id)})
                if ret:
                    rt.append(ret)
            else:
                cursor = connMongo.mdbBb['ThermalComfort_Config'].find(sort=[('_id', pymongo.ASCENDING)])
                for item in cursor:
                    rt.append(item)
        except Exception as e:
            print(e)
        finally:
            if cursor:
                cursor.close()
        return rt
