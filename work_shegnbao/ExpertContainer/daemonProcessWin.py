__author__ = 'golding'

from ExpertContainer.api.ArchiveManager import ArchiveManager
import os
import time
import subprocess
from datetime import  datetime
from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess.RedisManager import RedisManager

def scanForLiveCal(strPyName):
    try:
        bLive = ArchiveManager.getIsLive(strPyName, 60*5)
        if bLive:
            #print('%s心跳包在线'%(strPyName))
            return True

        tNow = datetime.now()
        print('%s--发现%s心跳包失效，重新启动程序'%( tNow.strftime('%Y-%m-%d %H:%M:%S') ,strPyName))
        subprocess.Popen("python C:\\ExpertContainer\\RealCalcQueue.py %s"%(strPyName), creationflags =subprocess.CREATE_NEW_CONSOLE)
        #subprocess.call("python C:\\ExpertContainer\\%s.py"%(strPyName))
    except Exception as e:
        print('error:' + e.__str__())

def scanForLiveDiagnosis(strPyName):
    try:
        bLive = ArchiveManager.getIsLive(strPyName, 60*5)
        if bLive:
            #print('%s心跳包在线'%(strPyName))
            return True

        tNow = datetime.now()
        print('%s--发现%s心跳包失效，重新启动程序'%( tNow.strftime('%Y-%m-%d %H:%M:%S') ,strPyName))
        subprocess.Popen("python C:\\ExpertContainer\\DiagnosisCalcQueue.py %s"%(strPyName), creationflags =subprocess.CREATE_NEW_CONSOLE)
        #subprocess.call("python C:\\ExpertContainer\\%s.py"%(strPyName))
    except Exception as e:
        print('error:' + e.__str__())

def scanForLiveExportData():
    result = False
    try:
        up_time = RedisManager.get_heartbeat_time('heartbeat_export')
        if up_time is None:
            result = False
        else:
            lastLiveTime = datetime.strptime(up_time, '%Y-%m-%d %H:%M:%S')
            tDelta = datetime.now() - lastLiveTime
            if tDelta.total_seconds() > 60:
                result = False
            else:
                result = True
        if not result:
            print('%s:ExportData进程异常退出，重新启动'%(datetime.now().strftime('%Y-%m-%d %H:%M:%S'), ))
            subprocess.Popen("python %s/ExportHistoryDataQueue.py"%(get_current_directory()), creationflags=subprocess.CREATE_NEW_CONSOLE)
    except Exception as e:
        print(e)

if __name__=='__main__':
    while True:
        scanForLiveExportData()
        time.sleep(20)