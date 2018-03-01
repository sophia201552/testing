import pika
from beopWeb.BEOPMongoDataAccess import g_tableModbusOpLogSource
from beopWeb.MongoConnManager import MongoConnManager

class modbusdebug():
    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_tableModbusOpLogSource]

    #插入多条log
    def insertManyLog(self,logdata,dtuId,userName):
        try:
            dtuId  = dtuId if isinstance(dtuId,str) else str(dtuId)
            insertList = []
            if logdata:
                for item in logdata:
                    data = {}
                    data['log '] = item['log']
                    data['time'] = item['time']
                    data['dtuId'] = dtuId
                    data['user'] = userName
                    insertList.append(data)
                self.db.insert_many(insertList)
                return True
        except Exception as e:
            return False

    #插入单条log
    def insertSingleLog(self,logdata,dtuId,userName):
        try:
            dtuId = dtuId if isinstance(dtuId, str) else str(dtuId)
            if logdata:
                logdata['dtuId'] = dtuId
                logdata['user'] = userName
                self.db.insert(logdata)
                return True
        except Exception as e:
            return False

    #删除dtuId的对应的所有log
    def deleteLogByDtuId(self,dtuId):
        dtuId = dtuId if isinstance(dtuId, str) else str(dtuId)
        try:
            query = {'dtuId': dtuId}
            self.db.delete_many(query)
            if self.db.find(query).count() > 0:
                return False
            return True
        except Exception as e:
            return False

    #通过dtuId获取DTULog
    #返回内容：{time :'',log:'','user':'','type':''}
    def getLogByDtuIdAndSearchText(self,dtuId,type,s_time,e_tiam,searchText):
        dtuId = dtuId if isinstance(dtuId,str) else str(dtuId)
        type = type if isinstance(type,str) else str(type)
        rdataList = []
        query = {}
        try:
            query['dtuId'] = dtuId
            query['type'] = type
            if searchText:
                query['log'] = {'$regex':searchText,'$options':'i'} #根据log内容关键字段查询
            if s_time:
                query['time'] = {}
                query['time']['$gte'] = s_time
            if e_tiam:
                if query.get('time'):
                    query['time']['$lte'] = e_tiam
                else:
                    query['time'] = {'$lte':e_tiam}
            rank = [('time', -1)]
            cur = self.db.find(query).sort(rank)
            if cur.count() > 0:
                for item in cur:
                    print('qury_log:',item)
                    rdata = {}
                    rdata['dtuId'] = dtuId
                    rdata['user'] = item.get('user')
                    rdata['time'] = item.get('time')
                    rdata['log'] = item.get('log')
                    rdata['type'] =item.get('type')
                    rdataList.append(rdata)
            return rdataList
        except Exception as e:
            return []

    #获取历史操作的类型与时间
    def getHistoryOperationMessage(self,dtuId):
        dtuId = dtuId if isinstance(dtuId,str) else str(dtuId)
        rdataList = []
        try:
            query = {'dtuId':dtuId}
            rank = [('time',-1)]
            cur = self.db.find(query).sort(rank)
            if cur.count() > 0:
                for item in cur:
                    rdata = {}
                    rdata['time'] = item.get('time')
                    rdata['type'] = item.get('type')
                    rdataList.append(rdata)
            return rdataList
        except Exception as e:
            return []

    #将调试信息插入消息队列。
    def rabbitMqWorkQueueSend(self,sendVal,queueName = None):
        queueName = queueName if queueName else 'ModbusDebugQueue'
        try:
            credentials = pika.PlainCredentials('beopweb', 'RNB.beop-2013')
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host='120.26.63.126', credentials=credentials))
            channel = connection.channel()
            channel.queue_declare(queue=queueName, durable=True)
            channel.basic_publish(exchange='',
                                  routing_key=queueName,
                                  body=str(sendVal),
                                  properties=pika.BasicProperties(
                                      delivery_mode=2,  # make message persistent
                                  ))
            connection.close()
            return True
        except Exception as e:
            return False
        return False

    #获取消息队列的确认消息。

