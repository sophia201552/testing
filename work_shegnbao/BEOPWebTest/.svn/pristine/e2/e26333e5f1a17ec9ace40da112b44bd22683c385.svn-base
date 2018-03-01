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


class BEOPMySqlDBReadOnlyContainer:
    def __init__(self):
        pass

    @classmethod
    def get_db(self, dbname):
        db = None
        try:
            db = mysql.connector.connect(
                user=app.config['MYSQL_SERVER_READ_USERNAME'],
                password=app.config['MYSQL_SERVER_READ_PASSWORD'],
                host=app.config['MYSQL_SERVER_READ'],
                pool_name=app.config['MYSQL_SERVER_READ_POOLNAME'],
                pool_size=app.config['MYSQL_SERVER_READ_CONNECTIONS_POOL'],
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
                logging.error('[readonly]beoplog: op_db_query self._db is None: %s, %s', dbName, strQuery)
                return rv

            cur = db.cursor()
            if len(parameter) > 0:
                cur.execute(strQuery, parameter)
            else:
                cur.execute(strQuery)
            rv = cur.fetchall()
            db.commit()
        except mysql.connector.Error as e:
            strError = '[readonly]mysql error occured when query: %s.' % strQuery
            print(strError)
            logging.error(strError)
            print(e)
            logging.error(e)
        finally:
            self.release_db(db, cur)
            return (rv[0] if rv else []) if one else rv

    def op_db_query_one(self, dbName, strQuery, parameter=()):
        return self.op_db_query(dbName, strQuery, parameter, True)
