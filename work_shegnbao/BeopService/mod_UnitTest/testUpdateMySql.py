__author__ = 'rdg'

from mod_DataAccess.BEOPDataAccess import *
from mod_DataAccess.BEOPMySqlDBContainer import *
import time

def testUpdate():
    _msqlCC = BEOPMySqlDBContainer()
    while True:
        sql = "replace into beopdata_yzgaolujie1_diagnosis_zones (Id,Count) values('40','0'),('37','0')"
        sqlList =['UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 40', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 37', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 16', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 13', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 18', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 47', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 71', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 5', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 58', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 39', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 42', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 6', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 56', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 36', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 19', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 26', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 64', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 55', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 24', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 50', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 23', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 33', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 20', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 69', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 73', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 29', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 60', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 43', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 66', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 51', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 1 where Id = 75', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 7', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 1 where Id = 74', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 14', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 49', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 72', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 1', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 12', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 76', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 44', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 54', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 27', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 25', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 61', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 32', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 52', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 22', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 31', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 8', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 3', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 57', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 67', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 70', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 35', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 63', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 46', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 30', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 59', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 34', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 11', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 41', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 53', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 45', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 62', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 21', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 17', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 15', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 38', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 2', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 65', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 4', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 48', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 28', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 68', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 9', 'UPDATE beopdata_yzgaolujie1_diagnosis_zones set Count = 0 where Id = 10']
        #_msqlCC.op_db_update_by_transaction('diagnosis', sqlList)
        _msqlCC.op_db_update('diagnosis', sql, ())
        time.sleep(5)
        print('update transaction once...')


if __name__ == '__main__':
    testUpdate()