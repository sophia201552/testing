__author__ = 'David'

from mainService import app
import os, sys, time, logging, mysql.connector,traceback

class BEOPMySqlDBContainer:
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
            print(strErr)
            app.logger.error(strErr)
            if db is not None:
                db.close()
            return None

        try:
            setResult = db.set_database(dbname)
            return db
        except mysql.connector.Error as e:
            app.logger.error(e)
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
                app.logger.error(strErr)

    def op_db_query(self, dbName, strQuery, parameter=(), one=False):
        db = None
        cur = None
        rv = []
        try:
            db = self.get_db(dbName)
            if db is None:
                app.logger.error('beoplog: op_db_query self._db is None: %s, %s', dbName, strQuery)
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
            print(strErr)
            app.logger.error(strErr)
        except Exception as e:
            app.logger.error(e)
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
                print(strError)
                app.logger.error(strError)
            else:
                cur = db.cursor()
                #db.start_transaction()
                if len(parameter) > 0:
                    cur.execute(strQuery, parameter)
                else:
                    cur.execute(strQuery)
                db.commit()
                rv = True
        except mysql.connector.Error as e:
            strError = 'mysql error occured when execute: %s. %s' % (strQuery, str(parameter))
            print(strError + e.__str__())
            app.logger.error(strError + e.__str__())
        except Exception as e:
            app.logger.error(e)
        finally:
            self.release_db(db, cur)
            return rv

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
                    print(strError)
                    app.logger.error(strError)
                else:
                    cur = db.cursor()
                    db.start_transaction()
                    for index in range(lenName):
                        strSQL = "update %s"%tableName + " set time=now(), pointvalue = '%s' where pointname='%s'" % ( str(pointValueList[index]), pointNameList[index])
                        cur.execute(strSQL, ())
                    db.commit()
            except mysql.connector.Error as e:
                strErr = "op_db_update_rttable_by_transaction error:%s, %s"%(e.__str__(), strSQL)
                print(strErr)
                app.logger.error(strErr)
                result = False
            except Exception as e:
                app.logger.error(e)
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
                print(strError)
                app.logger.error(strError)
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
            print(strErr)
            app.logger.error(strErr)
            print(sqlList)
            app.logger.error(sqlList)
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
                print(strError)
                app.logger.error(strError)
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
            print(strErr)
            app.logger.error(strErr)
            print(sqlList)
            app.logger.error(sqlList)
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
                print(strError)
                app.logger.error(strError)
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
            print(strErr)
            app.logger.error(strErr)
            return -1
        except Exception as e:
            app.logger.error(e)
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
            print(strErr)
            app.logger.error(strErr)
            return False
        except Exception as e:
            app.logger.error(e)
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
                print(strError)
                app.logger.error(strError)
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
            print(strError + e.__str__())
            app.logger.error(strError + e.__str__())
        except Exception as e:
            app.logger.error(e)
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
                print(strError)
                app.logger.error(strError)
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
            print(strError + e.__str__())
            app.logger.error(strError + e.__str__())
        except Exception as e:
            app.logger.error(e)
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
            print(strErr)
            app.logger.error(strErr)
            return 'failed'
        except Exception as e:
            app.logger.error(e)
            return 'failed'
        return 'successful'