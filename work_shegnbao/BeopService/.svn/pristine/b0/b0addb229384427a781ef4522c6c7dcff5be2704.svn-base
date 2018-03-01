__author__ = 'David'
from mainService import app
from math import floor, ceil
import os, sys, time, logging
import mysql.connector, traceback
from datetime import datetime, timedelta

class BEOPMySqlDBReadOnlyContainer:
    def __init__(self):
        pass

    @classmethod
    def get_db(self, dbname):
        db = None
        try:
            pool_size = app.config.get('MYSQL_SERVER_READ_CONNECTIONS_POOL')
            if pool_size:
                db = mysql.connector.connect(
                    user=app.config['MYSQL_SERVER_READ_USERNAME'],
                    password=app.config['MYSQL_SERVER_READ_PASSWORD'],
                    host=app.config['MYSQL_SERVER_READ'],
                    pool_name=app.config['MYSQL_SERVER_READ_POOLNAME'],
                    pool_size=app.config['MYSQL_SERVER_READ_CONNECTIONS_POOL'],
                    database=app.config['DATABASE'])
            else:
                db = mysql.connector.connect(
                    user=app.config['MYSQL_SERVER_READ_USERNAME'],
                    password=app.config['MYSQL_SERVER_READ_PASSWORD'],
                    host=app.config['MYSQL_SERVER_READ'],
                    database=app.config['DATABASE'])

        except mysql.connector.Error as e:
            strErr = "readonly get_db error:%s, %s"%(e.__str__(), dbname)
            print(strErr)
            app.logger.error(strErr)
            return None

        try:
            setResult = db.set_database(dbname)
            return db
        except mysql.connector.Error as e:
            print('readonly get_db error: '+e.__str__())
            app.logger.error('readonly get_db error: '+e.__str__())
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
        db = None
        cur = None
        rv = []
        try:
            db = self.get_db(dbName)
            if db is None:
                app.logger.error('[readonly]beoplog: op_db_query self._db is None: %s, %s', dbName, strQuery)
                return rv

            cur = db.cursor()
            if len(parameter) > 0:
                cur.execute(strQuery, parameter)
            else:
                cur.execute(strQuery)
            rv = cur.fetchall()
            db.commit()
        except mysql.connector.Error as e:
            strErr = "readonly op_db_query error:%s, %s,%s,%s"%(e.__str__(), dbName, strQuery, str(parameter))
            print(strErr)
            app.logger.error(strErr)
        except Exception as e:
            app.logger.error(e)
        finally:
            self.release_db(db, cur)
            return (rv[0] if rv else []) if one else rv

    def op_db_query_one(self, dbName, strQuery, parameter=()):
        return self.op_db_query(dbName, strQuery, parameter, True)
