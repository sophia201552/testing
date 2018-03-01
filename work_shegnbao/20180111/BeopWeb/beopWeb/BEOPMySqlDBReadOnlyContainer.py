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
    def get_db(self, db_name):
        db = None
        user = app.config.get("MYSQL_SERVER_READ_USERNAME")
        password = app.config.get("MYSQL_SERVER_READ_PASSWORD")
        host = app.config.get("MYSQL_SERVER_READ")
        pool_name = app.config.get("MYSQL_SERVER_READ_POOLNAME")
        pool_size = app.config.get("MYSQL_SERVER_READ_CONNECTIONS_POOL")
        database = app.config.get("DATABASE")
        connection_info = \
            "user=%s, password=%s, host=%s, pool_name=%s, pool_size=%s, database=%s, db_name=%s" % \
            (user, password, host, pool_name, pool_size, database, db_name)
        try:
            if pool_size:
                db = mysql.connector.connect(
                    user=user, password=password, host=host,
                    pool_name=pool_name, pool_size=pool_size, database=database)
            else:
                db = mysql.connector.connect(user=user, password=password, host=host, database=database)
        except Exception:
            logging.error("Failed to get connection with %s!", connection_info, exc_info=True, stack_info=True)
            if db is not None:
                db.close()
            return None

        try:
            db.set_database(db_name)
            return db
        except Exception:
            logging.error("Failed to set database with %s!", connection_info, exc_info=True, stack_info=True)
            if db is not None:
                db.set_database(app.config['DATABASE'])
                db.close()
            return None

    def release_db(self, db, cur):
        if cur is not None:
            cur.close()
        if db is not None:
            db.close()

    def op_db_query(self, dbName, strQuery, parameter=(), one=False, dictionary=False):
        db = None
        cur = None
        rv = []
        try:
            db = self.get_db(dbName)
            if db is None:
                logging.error('Failed to get connection for: %s, %s', dbName, strQuery, stack_info=True)
                return rv
            cur = db.cursor(dictionary=dictionary)
            if len(parameter) > 0:
                cur.execute(strQuery, parameter)
            else:
                cur.execute(strQuery)
            rv = cur.fetchall()
            db.commit()
        except Exception:
            logging.error('Failed to query %s with %s!', dbName, strQuery, exc_info=True, stack_info=True)
        finally:
            self.release_db(db, cur)
            return (rv[0] if rv else []) if one else rv

    def op_db_query_one(self, dbName, strQuery, parameter=(), dictionary=False):
        return self.op_db_query(dbName, strQuery, parameter, True, dictionary)
