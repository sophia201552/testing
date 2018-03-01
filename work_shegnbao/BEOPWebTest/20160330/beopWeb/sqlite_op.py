from beopWeb import app
import os
import sqlite3
from shutil import *
from ctypes import *

def connect_decrypt(dbfile):
    #_check_file()
    if create_decrypted_sqlitedb(dbfile) == 0:
        dbfileDec= "{}.dec".format(dbfile)
        return sqlite3.connect(dbfileDec)
    else:
        print('error: dbfile can not be decrypted')
        return None


def decrypt_sqlitedb(dbfile):
    path_dll = os.path.join(app.root_path,'lib/sqlite3.dll')
    sql = CDLL(path_dll)
    pw = 'RNB.beop-2013'
    db = c_void_p(None)
    if sql.sqlite3_open(c_char_p(dbfile.encode()),byref(db)) != 0:
        return 1
    if sql.sqlite3_key(db, c_char_p(pw.encode()), len(pw)) != 0:
        sql.sqlite3_close(db)
        return 2
    if sql.sqlite3_rekey(db, c_char_p(b''), 0) != 0:
        sql.sqlite3_close(db)
        return 3
    return 0


def create_decrypted_sqlitedb(dbfile):
    dbfileDec= "{}.dec".format(dbfile)
    if os.path.isfile(dbfileDec):
        return 0
    copyfile(dbfile,dbfileDec)
    if decrypt_sqlitedb(dbfileDec) == 0:
        return 0
    print('error: failed decrypting sqlite3 db file')
    os.remove(dbfileDec)
    return 1

sqlite3.connectD = connect_decrypt
