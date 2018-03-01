"""
Routes and views for the flask application.
"""

from beopWeb import app
from flask import g, json
from math import floor, ceil
import os, sys
import mysql.connector
from math import floor, ceil
from datetime import datetime, timedelta
import time
import logging


class BEOPMySqlDBContainer:
    def __init__(self):
        pass

    @classmethod
    def get_db(self, dbname):
        db = None
        try:
            db = mysql.connector.connect(
                user=app.config['USERNAME'],
                password=app.config['PASSWORD'],
                host=app.config['HOST'],
                pool_name=app.config['DB_POOL_NAME'],
                pool_size=app.config['INIT_CONNECTIONS_POOL'],
                database=app.config['DATABASE'])

        except mysql.connector.Error as e:
            print(e)
            logging.error(e)
            if db is not None:
                db.close()
            return None

        try:
            setResult = db.set_database(dbname)
            return db
        except mysql.connector.Error as e:
            logging.error(e)
            if db is not None:
                db.set_database(app.config['DATABASE'])
                db.close()
            return None

    def release_db(self, db, cur):
        if cur is not None:
            cur.close()
        if db is not None:
            db.close()

    def op_db_query(self, dbName, strQuery, parameter=(), one=False):
        #print(dbName + ' :  ' + strQuery)
        #print(parameter)
        db = None
        cur = None
        rv = []
        try:
            db = self.get_db(dbName)
            if db is None:
                print('beoplog: op_db_query self._db is None: %s, %s', dbName, strQuery)
                logging.error('beoplog: op_db_query self._db is None: %s, %s', dbName, strQuery)
                return rv

            cur = db.cursor()
            if len(parameter) > 0:
                cur.execute(strQuery, parameter)
            else:
                cur.execute(strQuery)
            rv = cur.fetchall()
            db.commit()
        except mysql.connector.Error as e:
            strError = 'mysql error occured when query: %s.' % strQuery
            print(strError)
            logging.error(strError)
            print(e)
            logging.error(e)
        finally:
            self.release_db(db, cur)
            return (rv[0] if rv else []) if one else rv

    def op_db_query_one(self, dbName, strQuery, parameter=()):
        return self.op_db_query(dbName, strQuery, parameter, True)


    def op_db_update(self, dbName, strQuery, parameter):
        #print(dbName + ' :  ' + strQuery)
        #print(parameter)
        db = None
        cur = None
        rv = False
        try:
            db = self.get_db(dbName)
            if db is None:
                strError = 'error: get db failed :' + dbName
                print(strError)
                logging.error(strError)
            else:
                cur = db.cursor()
                if len(parameter) > 0:
                    cur.execute(strQuery, parameter)
                else:
                    cur.execute(strQuery)
                db.commit()
                rv = True
        except mysql.connector.Error as e:
            strError = 'mysql error occured when execute: %s.' % strQuery
            print(strError)
            logging.error(strError)
            print(e)
            logging.error(e)
        finally:
            self.release_db(db, cur)
            return rv

    def op_db_update_rttable_by_transaction(self, dbName, tableName, pointNameList, pointValueList):
        rv = False
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
                    logging.error(strError)
                else:
                    cur = db.cursor()
                    for index in range(lenName):
                        parameters = None
                        if isinstance(pointValueList[index], str) or isinstance(pointValueList[index], float) or isinstance(pointValueList[index], int):
                            parameters = (pointNameList[index],str(pointValueList[index]),str(pointValueList[index]))
                        else:
                            parameters = (pointNameList[index],'0','0')
                        strSQL = "insert into %s"%tableName + "(time,pointname,pointvalue) values(now(),'%s','%s') ON DUPLICATE KEY UPDATE time=now(),pointvalue='%s'" % parameters
                        cur.execute(strSQL, ())
                        db.commit()
                        rv = True
            except mysql.connector.Error as e:
                strError = 'mysql error occured when query: %s.' % strSQL
                print(strError)
                logging.error(strError)
                print(e)
                logging.error(e)
            finally:
                self.release_db(db, cur)
                return rv
        return rv

    def op_db_update_by_transaction(self, dbName, sqlList):
        rv = False
        db = None
        cur = None
        strSQL = ''
        try:
            db = self.get_db(dbName)
            if db is None:
                strError = 'error: get db failed :' + dbName
                print(strError)
                logging.error(strError)
            else:
                cur = db.cursor()
                for strOneSQL in sqlList:
                    strSQL = strOneSQL
                    cur.execute(strSQL, ())
                db.commit()
                rv = True
        except mysql.connector.Error as e:
            strError = 'mysql error occured when query: %s.' % strSQL
            print(strError)
            logging.error(strError)
            print(e)
            logging.error(e)
        finally:
            self.release_db(db, cur)
            return rv

    def op_db_update_with_id(self, dbName, tableName, strQuery, parameter=()):
        # print(dbName + ' :  ' + strQuery)
        # print(parameter)
        db = None
        cur = None
        new_id = -1
        try:
            db = self.get_db(dbName)
            if db is None:
                strError = 'error: get db failed :' + dbName
                print(strError)
                logging.error(strError)
            else:
                cur = db.cursor()
                if len(parameter) > 0:
                    cur.execute(strQuery, parameter)
                else:
                    cur.execute(strQuery)
                new_id = cur.lastrowid
                db.commit()
        except mysql.connector.Error as e:
            strError = 'mysql error occured when execute: %s.' % strQuery
            print(strError)
            logging.error(strError)
            print(e)
            logging.error(e)
        finally:
            self.release_db(db, cur)
            return new_id

    def op_db_update_many(self, dbName, strQuery, parameter):
        db = None
        cur = None
        rv = False
        try:
            db = self.get_db(dbName)
            cur = db.cursor()
            if len(parameter) > 0:
                cur.executemany(strQuery, parameter)
            else:
                cur.execute(strQuery)
            db.commit()
            rv = True
        except mysql.connector.Error as e:
            strError = 'mysql error occured when execute: %s' % strQuery
            print(strError)
            print(parameter)
            logging.error(strError)
            logging.error(parameter)
            print(e)
            logging.error(e)
        finally:
            self.release_db(db, cur)
            return rv

    @classmethod
    def createDB(self, dbName):
        conn = mysql.connector.connect(host=app.config['HOST'], port=3306, user=app.config['USERNAME'],
                                       password=app.config['PASSWORD'])
        curs = conn.cursor()
        sql = 'Create Database If Not Exists %s Character Set UTF8' % (dbName,)
        try:
            curs.execute(sql)
        except mysql.connector.Error as e:
            logging.error(e)
            print(e)
            conn.close()
            return 'failed'
        return 'successful'
