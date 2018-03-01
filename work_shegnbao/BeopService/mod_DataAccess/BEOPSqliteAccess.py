__author__ = 'David'

from mainService import app
import sqlite3, logging, os

class BEOPSqliteAccess:

    __instance = None

    def __init__(self):
        pass

    @classmethod
    def getInstance(self):
        if(self.__instance == None):
            self.__instance = BEOPSqliteAccess()
        return self.__instance

    @classmethod
    def get_db(self, dbname):
        db = None
        return db

    def release_db(self, db, cur):
        if cur is not None:
            cur.close()
        if db is not None:
            db.close()

    def getPointListFromS3db(self, s3dbname):
        rt = []
        if s3dbname != None:
            cur = None
            con = None
            try:
                dbfile = os.path.join(app.config.get('S3DB_DIR_CLOUD'),s3dbname)
                dbfileDec = '{}.dec'.format(dbfile)

                if not os.path.exists(dbfileDec):
                    print(dbfileDec + ' file not existing!')
                    return None
                con = sqlite3.connect(dbfileDec)
                con.text_factory = bytes
                cur = con.cursor()
                cur.execute('select name, ch_description from list_point')
                data = cur.fetchall()
                rt = [{'name': x[0].decode('gbk'), 'description': x[1].decode('gbk')} for x in data]
            except Exception as e:
                print('getPointListFromS3db' + e.__str__())
                app.logger.error('getPointListFromS3db' + e)
            finally:
                if cur is not None:
                    cur.close()
                if con is not None:
                    con.close()
        return rt