'''
因mongo的日志往往会比较大，所以采用pymongo的command来做分流处理,
使日志每天都更新
'''
from pymongo import MongoClient
from mainService import app
from mod_DataAccess.BEOPMySqlDBReadOnlyContainer import BEOPMySqlDBReadOnlyContainer
import logging


class MongoDBLogSlice(object):
    condition = True
    net = "internal_addr" if condition else "internet_addr"
    dbName = app.config['DATABASE']
    tableName = "mongo_instance"
    clusterName = app.config.get("BEOPCLUSTER")
    dbGetQuery = \
        "select mongo_server_id, {net} from {table} as mi inner join cluster_config as cc on mi.cluster_id = cc.id " \
        "where mi.mongo_server_id <> 3 and cc.clusterName = '{clusterName}'".format(
            table=tableName, net=net, clusterName=clusterName)
    user = "superuser"
    pwd = "RNB.beop-2013"
    special_user = "super"


    def get_mongo_addr(self):
        obj = BEOPMySqlDBReadOnlyContainer()
        return obj.op_db_query(self.dbName, self.dbGetQuery)


    def filter_mongo_list(self):
        rt = self.get_mongo_addr()
        mongo_list = {}
        for item in rt:
            if item[0] == 1:
                mongo_list.update({item[1].split(":")[0] + ":27018": item[0]})
            mongo_list.update({item[1]: item[0]})
        return mongo_list


    def _connect_mongo(self, mongo_list):
        host, port, client = None, None, None
        result = {}
        for addr, _id in mongo_list.items():
            status = False
            try:
                host, port = self.divide_addr(addr)
                client = MongoClient(host=host, port=port)
                db = client.admin
                db.authenticate(self.user if _id not in [5, 6, 7] else self.special_user, self.pwd)
                status = self.slice_log(db)
                result.update({addr: status})
            except Exception as err:
                app.logger.error("connect_mongo error: {} host: {}, port: {}".format(str(err), host, port))
                result.update({addr: status})
            finally:
                if client:
                    client.close()
        return result


    def slice_log(self, db):
        status = db.command({'logRotate': 1})
        return True if status.get("ok") == 1.0 else False


    def divide_addr(self, addr):
        addr_list = addr.split(":")
        return addr_list[0], int(addr_list[1])


    def run(self):
        mongo_list = self.filter_mongo_list()
        return self._connect_mongo(mongo_list)


if __name__ == "__main__":
    a = MongoDBLogSlice()
    rt = a.run()
    print(rt)
