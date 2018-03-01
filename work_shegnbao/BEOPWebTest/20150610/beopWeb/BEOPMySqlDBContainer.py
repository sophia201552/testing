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
            db.close()
            return None

        try:
            setResult = db.set_database(dbname)
            return db
        except mysql.connector.Error as e:
            logging.error(e)
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
        except mysql.connector.Error as e:
            strError = 'mysql error occured when execute: %s.' % strQuery
            print(strError)
            logging.error(strError)
            print(e)
            logging.error(e)
            return False
        finally:
            self.release_db(db, cur)
        return True

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
                logging.error(strError)
            else:
                cur = db.cursor()
                if len(parameter) > 0:
                    cur.execute(strQuery, parameter)
                else:
                    cur.execute(strQuery)
                cur.execute("select distinct last_insert_id() from %s" % (tableName, ))
                rv = cur.fetchall()
                db.commit()
        except mysql.connector.Error as e:
            strError = 'mysql error occured when execute: %s.' % strQuery
            print(strError)
            logging.error(strError)
            print(e)
            logging.error(e)
            return -1
        finally:
            self.release_db(db, cur)
        return rv[0][0] if rv!=None else -1

    def op_db_update_many(self, dbName, strQuery, parameter):
        db = None
        cur = None
        try:
            db = self.get_db(dbName)
            cur = db.cursor()
            if len(parameter) > 0:
                cur.executemany(strQuery, parameter)
            else:
                cur.execute(strQuery)
            db.commit()
        except mysql.connector.Error as e:
            strError = 'mysql error occured when execute: %s' % strQuery
            print(strError)
            print(parameter)
            logging.error(strError)
            print(e)
            logging.error(e)
            return False
        finally:
            self.release_db(db, cur)
        return True

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