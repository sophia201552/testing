"""
Routes and views for the flask application.
"""

from beopWeb import app
import mysql.connector
import logging
import re
import requests
import json
from threading import Thread
import time
from datetime import datetime as builtin_datetime
from datetime import date as builtin_date


class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, builtin_datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, builtin_date):
            return obj.strftime("%Y-%m-%d")
        else:  
            return json.JSONEncoder.default(self, obj)


class BEOPMySqlDBContainer:
    _is_global_write_pattern = re.compile(r"(insert\s+(ignore\s+)?into|update|replace\s+into|delete\s+from)\s+([^\s]+\.)?`?(?P<table_name>[^\s\(`]+)")
    _beopdoengine_replicating_tables = [
        'locate_map', 'mongo_instance', 'p_role_group', 'p_role_group_user',
        'p_role_permission', 'project', 'project_cluster', 'cluster_config', 'reportemail_project', 'reportemail_user',
        'role', 'role_function', 'role_project', 'token', 'user', 'user_data_manager',
        'user_proj', 'user_role', 'project_properties'
    ]
    _diagnosis_replicating_tables = [
        'diagnosis_entity', 'diagnosis_entity_fault', 'diagnosis_entity_fault_old', 'diagnosis_entity_old',
        'diagnosis_equip_weight',
        'diagnosis_enum', 'diagnosis_fault', 'diagnosis_fault_old', 'diagnosis_fault_old_zh', 'diagnosis_fault_zh',
        'diagnosispush', 'diagnosisruncheck', 'diagnosis_task', 'diagnosis_task_operation', 'unitconversion'
    ]

    def __init__(self):
        pass

    @classmethod
    def get_db(self, db_name):
        db = None
        user = app.config.get("USERNAME")
        password = app.config.get("PASSWORD")
        host = app.config.get("HOST")
        pool_name = app.config.get("DB_POOL_NAME")
        pool_size = app.config.get("INIT_CONNECTIONS_POOL")
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
            if db is None:
                raise Exception("Cannot get connection")
        except Exception:
            logging.error("Failed to get MySQL connection with %s.", connection_info, exc_info=True, stack_info=True)
            if db is not None:
                db.close()
            return None

        try:
            db.set_database(db_name)
        except Exception:
            logging.error("Cannot set database to %s with %s!",
                          db_name, connection_info, exc_info=True, stack_info=True)
            db.set_database(app.config['DATABASE'])
            db.close()
            return None

        return db

    @staticmethod
    def _enqueue_cross_cluster_write_action_thread(write_action):
        interval = 10
        max_retry = 10
        for i in range(0, max_retry):
            try:
                beop_svc_addr = app.config.get('BEOP_SERVICE_ADDRESS')
                headers = {'content-type': 'application/json'}
                request_path = beop_svc_addr + '/mq/mqSendTask'
                request_body = dict(name="MySqlCrossClusterWrite", value=json.dumps(write_action, cls=DateEncoder))
                response = requests.post(url=request_path, headers=headers, data=json.dumps(request_body, cls=DateEncoder))
                if response is None:
                    raise Exception("Got an empty response!")
                response_json = json.loads(response.text)
                response_error = response_json.get('error')
                if response_error != 'ok':
                    raise Exception("Response is with error: %s", response_json.get('error'))
                logging.info("Cross cluster write action %s enqueued!", write_action)
                return
            except Exception:
                logging.error("Failed to enqueue cross cluster write action: %s",
                                 write_action, exc_info=True, stack_info=True)
                if i < max_retry - 1:
                    logging.error("Retry after %s seconds. %s retries left.", interval, max_retry - i - 1)
                time.sleep(10)

    def _enqueue_cross_cluster_write_action(self, write_action):
        try:
            thread = Thread(target=BEOPMySqlDBContainer._enqueue_cross_cluster_write_action_thread, args=(write_action,))
            thread.start()
        except Exception:
            logging.error("Failed to start thread to enqueue cross cluster write action: %s",
                             write_action, exc_info=True, stack_info=True)

    def get_other_global_cluster_names(self):
        mysql_global_write_enabled = app.config.get('MYSQL_GLOBAL_WRITE_ENABLED')
        if not mysql_global_write_enabled:
            return []
        query_result = self.op_db_query('beopdoengine', 'SELECT clusterName FROM cluster_config WHERE enabled = 1')
        cluster_names = [row[0] for row in query_result if row[0] != app.config.get("BEOPCLUSTER")]
        return cluster_names

    def is_global_write(self, db_name, query):
        if not db_name or not query:
            return False
        db_name = db_name.strip().lower()
        if db_name == 'workflow':
            return True
        query = query.strip().lower()

        match = BEOPMySqlDBContainer._is_global_write_pattern.match(query)
        if match is None:
            return False
        table_name = match.group("table_name")
        if db_name == 'beopdoengine':
            if table_name in BEOPMySqlDBContainer._beopdoengine_replicating_tables:
                return True
        elif db_name == 'diagnosis':
            if table_name in BEOPMySqlDBContainer._diagnosis_replicating_tables:
                return True
        return False

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
                logging.error('op_db_query self._db is None: %s, %s!', dbName, strQuery)
                return rv

            cur = db.cursor(dictionary=dictionary)
            if len(parameter) > 0:
                cur.execute(strQuery, parameter)
            else:
                cur.execute(strQuery)
            rv = cur.fetchall()
            db.commit()
        except Exception:
            logging.error('mysql error occured when query: %s.', strQuery, exc_info=True, stack_info=True)
        finally:
            self.release_db(db, cur)
            return (rv[0] if rv else []) if one else rv

    def op_db_query_one(self, dbName, strQuery, parameter=(), dictionary=False):
        return self.op_db_query(dbName, strQuery, parameter, True, dictionary)

    def _exec_db_update(self, db, strQuery, parameters, is_multi_update):
        if db is None:
            return False

        cur = None

        try:
            cur = db.cursor()
            if is_multi_update:
                for param in parameters:
                    if len(param) > 0:
                        cur.execute(strQuery, param)
                    else:
                        cur.execute(strQuery)
            else:
                if len(parameters) > 0:
                    cur.execute(strQuery, parameters)
                else:
                    cur.execute(strQuery)
            db.commit()
            return True
        except Exception:
            logging.error('mysql error occured when execute: %s.', strQuery, exc_info=True, stack_info=True)
            return False
        finally:
            self.release_db(db, cur)

    def op_db_update(self, dbName, strQuery, parameter=()):
        logging.debug("%s:%s:%s", dbName, strQuery, parameter)
        main_db = self.get_db(dbName)
        rv = self._exec_db_update(main_db, strQuery, parameter, False)

        if rv:
            if self.is_global_write(dbName, strQuery):
                logging.debug("In global write list. Executing on other global DBs...")
                other_global_cluster_names = self.get_other_global_cluster_names()
                for cluster_name in other_global_cluster_names:
                    self._enqueue_cross_cluster_write_action({
                        'type': 'normal',
                        'cluster_name': cluster_name,
                        'db_name': dbName,
                        'sql': strQuery,
                        'parameter': parameter
                    })
            else:
                logging.debug("Not in global write list.")
        return rv

    def op_db_update_all(self, dbName, strQuery, param_list=[]):
        logging.debug("%s:%s:%s", dbName, strQuery, param_list)
        main_db = self.get_db(dbName)
        rv = self._exec_db_update(main_db, strQuery, param_list, True)

        if rv:
            if self.is_global_write(dbName, strQuery):
                logging.debug("In global write list. Executing on other global DBs...")
                other_global_cluster_names = self.get_other_global_cluster_names()
                for cluster_name in other_global_cluster_names:
                    self._enqueue_cross_cluster_write_action({
                        'type': 'multi',
                        'cluster_name': cluster_name,
                        'db_name': dbName,
                        'sql': strQuery,
                        'parameter_list': param_list
                    })

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
                    logging.error('error: get db failed :' + dbName)
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
            except Exception:
                logging.error('mysql error occured when execute: %s.', strSQL, exc_info=True, stack_info=True)
            finally:
                self.release_db(db, cur)
                return rv
        return rv

    def op_db_update_by_transaction(self, dbName, sqlList):
        logging.debug("%s:%s", dbName, sqlList)
        main_db = self.get_db(dbName)
        rv = self._op_db_update_by_transaction(main_db, sqlList)

        if rv:
            is_global_write_action = False
            for sql in sqlList:
                if self.is_global_write(dbName, sql):
                    is_global_write_action = True
                    break
            if is_global_write_action:
                logging.debug("In global write list. Executing on other global DBs...")
                other_global_cluster_names = self.get_other_global_cluster_names()
                for cluster_name in other_global_cluster_names:
                    self._enqueue_cross_cluster_write_action({
                        'type': 'transaction',
                        'cluster_name': cluster_name,
                        'db_name': dbName,
                        'sql_list': sqlList
                    })

        return rv

    def _op_db_update_by_transaction(self, db, sqlList):
        if db is None:
            return False

        rv = False
        cur = None
        strSQL = ''
        try:
            cur = db.cursor()
            for strOneSQL in sqlList:
                strSQL = strOneSQL
                cur.execute(strSQL, ())
            db.commit()
            rv = True
        except Exception:
            logging.error('mysql error occured when execute: %s.', strSQL, exc_info=True, stack_info=True)
        finally:
            self.release_db(db, cur)
            return rv

    def op_db_update_with_id(self, dbName, strQuery, parameter=()):
        logging.debug("%s:%s:%s", dbName, strQuery, parameter)
        main_db = self.get_db(dbName)
        rv = self._op_db_update_with_id(main_db, strQuery, parameter)

        if rv:
            if self.is_global_write(dbName, strQuery):
                logging.debug("In global write list. Executing on other global DBs...")
                other_global_cluster_names = self.get_other_global_cluster_names()
                for cluster_name in other_global_cluster_names:
                    self._enqueue_cross_cluster_write_action({
                        'type': 'normal',
                        'cluster_name': cluster_name,
                        'db_name': dbName,
                        'sql': strQuery,
                        'parameter': parameter
                    })

        return rv

    def _op_db_update_with_id(self, db, strQuery, parameter):
        if db is None:
            return False
        cur = None
        new_id = -1
        try:
            cur = db.cursor()
            if len(parameter) > 0:
                cur.execute(strQuery, parameter)
            else:
                cur.execute(strQuery)
            new_id = cur.lastrowid
            db.commit()
        except Exception:
            logging.error('mysql error occured when execute: %s.', strQuery, exc_info=True, stack_info=True)
        finally:
            self.release_db(db, cur)
            return new_id

    def op_db_update_many(self, dbName, strQuery, parameter=()):
        logging.debug("%s:%s:%s", dbName, strQuery, parameter)
        main_db = self.get_db(dbName)
        rv = self._op_db_update_many(main_db, strQuery, parameter)

        if rv:
            if self.is_global_write(dbName, strQuery):
                logging.debug("In global write list. Executing on other global DBs...")
                other_global_cluster_names = self.get_other_global_cluster_names()
                for cluster_name in other_global_cluster_names:
                    self._enqueue_cross_cluster_write_action({
                        'type': 'many',
                        'cluster_name': cluster_name,
                        'db_name': dbName,
                        'sql': strQuery,
                        'parameter': parameter
                    })

        return rv

    def _op_db_update_many(self, db, strQuery, parameter):
        if db is None:
            return False
        cur = None
        rv = False
        try:
            cur = db.cursor()
            if len(parameter) > 0:
                cur.executemany(strQuery, parameter)
            else:
                cur.execute(strQuery)
            db.commit()
            rv = True
        except Exception:
            logging.error('mysql error occured when execute: %s.', strQuery, exc_info=True, stack_info=True)
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
        except Exception:
            logging.error('Failed to create MySQL DB! dbName=%s', dbName, exc_info=True, stack_info=True)
            conn.close()
            return 'failed'
        return 'successful'

    def op_db_query_dict(self, dbName, strQuery, parameter=(), one=False):
        db = None
        cur = None
        rv = []
        try:
            db = self.get_db(dbName)
            if db is None:
                print('beoplog: op_db_query self._db is None: %s, %s', dbName, strQuery)
                logging.error('beoplog: op_db_query self._db is None: %s, %s', dbName, strQuery)
                return rv

            cur = db.cursor(buffered=True, dictionary=True)
            if len(parameter) > 0:
                cur.execute(strQuery, parameter)
            else:
                cur.execute(strQuery)
            rv = cur.fetchall()
            db.commit()
        except Exception:
            logging.error('Failed to query MySQL! db=%s, sql=%s, params=%s, one=%s',
                          dbName, strQuery, parameter, one, exc_info=True, stack_info=True)
        finally:
            self.release_db(db, cur)
            return (rv[0] if rv else []) if one else rv
