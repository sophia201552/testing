__author__ = 'David'

from ExpertContainer import app
import os, sys, time, logging, mysql.connector,traceback
from ExpertContainer.api.LogOperator import LogOperator

class BEOPMySqlDBContainer:

    _logger = LogOperator()

    def __init__(self):
        pass

    @classmethod
    def get_db(self, dbname):
        db = None
        try:
            pool_size = app.config.get('INIT_CONNECTIONS_POOL')
            if pool_size:
                db = mysql.connector.connect(
                    user=app.config['USERNAME'],
                    password=app.config['PASSWORD'],
                    host=app.config['HOST'],
                    pool_name=app.config['DB_POOL_NAME'],
                    pool_size=app.config['INIT_CONNECTIONS_POOL'],
                    database=app.config['DATABASE'])
            else:
                db = mysql.connector.connect(
                    user=app.config['USERNAME'],
                    password=app.config['PASSWORD'],
                    host=app.config['HOST'],
                    database=app.config['DATABASE'])

        except mysql.connector.Error as e:
            strErr = "get_db error:%s, %s"%(e.__str__(), dbname)
            BEOPMySqlDBContainer._logger.writeLog(strErr, True)
            if db is not None:
                db.close()
            return None

        try:
            setResult = db.set_database(dbname)
            return db
        except mysql.connector.Error as e:
            BEOPMySqlDBContainer._logger.writeLog(e.__str__(), True)
            if db is not None:
                db.set_database(app.config['DATABASE'])
                db.close()
            return None

    def release_db(self, db, cur):
        if cur is not None:
            cur.close()
        if db is not None:
            try:
                db.close()
            except Exception as e:
                strErr = "release_db error:%s"%(e.__str__())
                BEOPMySqlDBContainer._logger.writeLog(strErr, True)

    def op_db_query(self, dbName, strQuery, parameter=(), one=False):
        db = None
        cur = None
        rv = []
        try:
            db = self.get_db(dbName)
            if db is None:
                BEOPMySqlDBContainer._logger.writeLog('beoplog: op_db_query self._db is None: %s, %s'%(dbName, strQuery), True)
                return rv

            cur = db.cursor()
            db.start_transaction()
            if len(parameter) > 0:
                cur.execute(strQuery, parameter)
            else:
                cur.execute(strQuery)
            rv = cur.fetchall()
            db.commit()
        except mysql.connector.Error as e:
            strErr = "op_db_query error:%s, %s"%(e.__str__(), strQuery)
            BEOPMySqlDBContainer._logger.writeLog(strErr, True)
        except Exception as e:
            BEOPMySqlDBContainer._logger.writeLog(e.__str__(), True)
        finally:
            self.release_db(db, cur)
            return (rv[0] if rv else []) if one else rv

    def op_db_query_one(self, dbName, strQuery, parameter=()):
        return self.op_db_query(dbName, strQuery, parameter, True)


    def op_db_update(self, dbName, strQuery, parameter):
        db = None
        cur = None
        rv = False
        try:
            db = self.get_db(dbName)
            if db is None:
                strError = 'error: get db failed :' + dbName
                BEOPMySqlDBContainer._logger.writeLog(strError, True)
            else:
                cur = db.cursor()
                if len(parameter) > 0:
                    cur.execute(strQuery, parameter)
                else:
                    cur.execute(strQuery)
                db.commit()
                rv = True
        except Exception as e:
            logging.error('Failed to update SQL DB! Error: %s, dbName=%s, strQuery=%s, parameter=%s',
                          e.__str__(), dbName, strQuery, parameter, exc_info=True, stack_info=True)
        finally:
            self.release_db(db, cur)
            return rv

    def op_db_cross_cluster_update(self, write_action):
        cluster_name = write_action.get('cluster_name')
        if not cluster_name:
            raise Exception("cluster_name is not provided!")
        db_name = write_action.get('db_name')
        if not db_name:
            raise Exception("db_name is not provided!")

        mysql_global_write_configs = app.config.get('MYSQL_GLOBAL_WRITE')
        if mysql_global_write_configs is None:
            raise Exception("MYSQL_GLOBAL_WRITE configuration is not set!")
        config = mysql_global_write_configs.get(cluster_name)
        if config is None:
            raise Exception("Invalid cluster_name: %s" % cluster_name)

        user = config.get("USERNAME")
        password = config.get("PASSWORD")
        host = config.get("HOST")
        database = config.get("DATABASE")
        connection_info = "user=%s, password=%s, host=%s, database=%s, db_name=%s" % (
            user, password, host, database, db_name)
        try:
            db = mysql.connector.connect(user=user, password=password, host=host, database=database)
        except:
            raise Exception("Cannot get MySQL connection with %s." % connection_info)
        if db is None:
            raise Exception("Cannot get MySQL connection with %s." % connection_info)

        cur = None
        try:
            try:
                db.set_database(db_name)
            except:
                raise Exception("Cannot set database to %s with %s!" % (db_name, connection_info))

            write_type = write_action.get('type', 'normal')
            cur = db.cursor()
            if write_type == 'normal':
                sql = write_action.get('sql')
                parameter = write_action.get('parameter')
                if isinstance(parameter, list) and len(parameter) > 0:
                    cur.execute(sql, parameter)
                else:
                    cur.execute(sql)
            elif write_type == 'multi':
                sql = write_action.get('sql')
                parameter_list = write_action.get('parameter_list')
                for parameter in parameter_list:
                    if len(parameter) > 0:
                        cur.execute(sql, parameter)
                    else:
                        cur.execute(sql)
            elif write_type == 'transaction':
                sql_list = write_action.get('sql_list')
                for sql in sql_list:
                    cur.execute(sql, ())
            elif write_type == 'many':
                sql = write_action.get('sql')
                parameter = write_action.get('parameter')
                if len(parameter) > 0:
                    cur.executemany(sql, parameter)
                else:
                    cur.execute(sql)
            else:
                raise Exception("Unsupported write type: %s" % write_type)
            db.commit()
        finally:
            if cur is not None:
                cur.close()
            db.close()

    def op_db_update_rttable_by_transaction(self, dbName, tableName, pointNameList, pointValueList):
        result = True
        lenName = len(pointNameList)
        lenValue = len(pointValueList)
        if lenName > 0 and lenValue > 0 and lenName == lenValue:
            db = None
            cur = None
            strSQL = ''
            try:
                db = self.get_db(dbName)
                if db is None:
                    strError = 'error: get db failed :' + dbName
                    BEOPMySqlDBContainer._logger.writeLog(strError, True)
                else:
                    cur = db.cursor()
                    db.start_transaction()
                    for index in range(lenName):
                        strSQL = "update %s"%tableName + " set time=now(), pointvalue = '%s' where pointname='%s'" % ( str(pointValueList[index]), pointNameList[index])
                        cur.execute(strSQL, ())
                    db.commit()
            except mysql.connector.Error as e:
                strErr = "op_db_update_rttable_by_transaction error:%s, %s"%(e.__str__(), strSQL)
                BEOPMySqlDBContainer._logger.writeLog(strErr, True)
                result = False
            except Exception as e:
                BEOPMySqlDBContainer._logger.writeLog(e.__str__(), True)
                result = False
            finally:
                self.release_db(db, cur)
                return result
        else:
            result = False
        return result

    def op_db_update_by_transaction(self, dbName, sqlList):
        result = False
        db = None
        cur = None
        strSQL = ''
        try:
            db = self.get_db(dbName)
            if db is None:
                strError = 'error: get db failed :' + dbName
                BEOPMySqlDBContainer._logger.writeLog(strError, True)
            else:
                cur = db.cursor()
                db.start_transaction()
                for strOneSQL in sqlList:
                    strSQL = strOneSQL
                    cur.execute(strSQL, ())
                db.commit()
                result = True
        except Exception as e:
            strErr = "op_db_update_by_transaction error:%s, %s"%(e.__str__(), strSQL)
            BEOPMySqlDBContainer._logger.writeLog(strErr, True)
            BEOPMySqlDBContainer._logger.writeLog(str(sqlList), True)
        finally:
            self.release_db(db, cur)
            return result

    def op_db_update_by_transaction_params(self, dbName, sqlList, paramsList):
        result = False
        db = None
        cur = None
        strSQL = ''
        try:
            db = self.get_db(dbName)
            if db is None:
                strError = 'error: get db failed :' + dbName
                BEOPMySqlDBContainer._logger.writeLog(strError, True)
            else:
                cur = db.cursor()
                db.start_transaction()
                for index, strOneSQL in enumerate(sqlList):
                    strSQL = strOneSQL
                    param = paramsList[index]
                    cur.execute(strSQL, tuple(param))
                db.commit()
                result = True
        except Exception as e:
            strErr = "op_db_update_by_transaction_params error:%s, %s"%(e.__str__(), strSQL)
            BEOPMySqlDBContainer._logger.writeLog(strErr, True)
            BEOPMySqlDBContainer._logger.writeLog(str(sqlList), True)
        finally:
            self.release_db(db, cur)
            return result

    def op_db_update_with_id(self, dbName, tableName, strQuery, parameter):
        #print(dbName + ' :  ' + strQuery)
        #print(parameter)
        db = None
        cur = None
        rv = None
        try:
            db = self.get_db(dbName)
            if db is None:
                strError = 'error: get db failed :' + dbName
                BEOPMySqlDBContainer._logger.writeLog(strError, True)
            else:
                cur = db.cursor()
                db.start_transaction()
                if len(parameter) > 0:
                    cur.execute(strQuery, parameter)
                else:
                    cur.execute(strQuery)
                cur.execute("select distinct last_insert_id() from %s" % (tableName, ))
                rv = cur.fetchall()
                db.commit()
        except mysql.connector.Error as e:
            strErr = "op_db_update_with_id error:%s, %s,%s,%s,%s"%(e.__str__(), dbName, tableName, strQuery, str(parameter))
            BEOPMySqlDBContainer._logger.writeLog(strErr, True)
            return -1
        except Exception as e:
            BEOPMySqlDBContainer._logger.writeLog(e.__str__(), True)
        finally:
            self.release_db(db, cur)
        return rv[0][0] if rv!=None else -1

    def op_db_update_many(self, dbName, strQuery, parameter):
        db = None
        cur = None
        try:
            db = self.get_db(dbName)
            cur = db.cursor()
            db.start_transaction()
            if len(parameter) > 0:
                cur.executemany(strQuery, parameter)
            else:
                cur.execute(strQuery)
            db.commit()
        except mysql.connector.Error as e:
            strErr = "op_db_update_many error:%s, %s,%s,%s"%(e.__str__(), dbName, strQuery,str(parameter))
            BEOPMySqlDBContainer._logger.writeLog(strErr, True)
            return False
        except Exception as e:
            BEOPMySqlDBContainer._logger.writeLog(e.__str__(), True)
            return False
        finally:
            self.release_db(db, cur)
        return True

    def op_db_update_return_id(self, dbName, strQuery, parameter):
        db = None
        cur = None
        rt = {'bSuccess':False, 'id':None}
        try:
            db = self.get_db(dbName)
            if db is None:
                strError = 'error: get db failed :' + dbName
                BEOPMySqlDBContainer._logger.writeLog(strError, True)
            else:
                cur = db.cursor()
                db.start_transaction()
                if len(parameter) > 0:
                    cur.execute(strQuery, parameter)
                else:
                    cur.execute(strQuery)
                id = cur.lastrowid
                db.commit()
                rt.update({'bSuccess':True,'id':id})
        except mysql.connector.Error as e:
            strError = 'mysql error occured when execute: %s.' % strQuery
            BEOPMySqlDBContainer._logger.writeLog(strError + e.__str__(), True)
        except Exception as e:
            BEOPMySqlDBContainer._logger.writeLog(e.__str__(), True)
        finally:
            self.release_db(db, cur)
            return rt

    def op_db_update_by_transaction_return_id(self, dbName, sqlList):
        rt = {'bSuccess':False, 'id':None}
        db = None
        cur = None
        strSQL = ''
        idlist = []
        try:
            db = self.get_db(dbName)
            if db is None:
                strError = 'error: get db failed :' + dbName
                BEOPMySqlDBContainer._logger.writeLog(strError, True)
            else:
                cur = db.cursor()
                for strOneSQL in sqlList:
                    strSQL = strOneSQL
                    cur.execute(strSQL, ())
                    idlist.append(cur.lastrowid)
                db.commit()
                if len(idlist) == len(sqlList):
                    rt.update({'bSuccess':True, 'id':idlist})
        except mysql.connector.Error as e:
            strError = 'mysql error occured when query: %s.' % strSQL
            BEOPMySqlDBContainer._logger.writeLog(strError + e.__str__(), True)
        except Exception as e:
            BEOPMySqlDBContainer._logger.writeLog(e.__str__(), True)
        finally:
            self.release_db(db, cur)
            return rt

    @classmethod
    def createDB(self, dbName):
        conn = mysql.connector.connect(host=app.config['HOST'], port=3306, user=app.config['USERNAME'],
                                       password=app.config['PASSWORD'])
        curs = conn.cursor()
        sql = 'Create Database If Not Exists %s Character Set UTF8' % (dbName,)
        try:
            curs.execute(sql)
        except mysql.connector.Error as e:
            strErr = "createDB error:%s, %s"%(e.__str__(), dbName,)
            BEOPMySqlDBContainer._logger.writeLog(strErr, True)
            return 'failed'
        except Exception as e:
            BEOPMySqlDBContainer._logger.writeLog(e.__str__(), True)
            return 'failed'
        return 'successful'