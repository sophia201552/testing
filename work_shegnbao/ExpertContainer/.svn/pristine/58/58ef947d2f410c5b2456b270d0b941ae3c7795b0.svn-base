__author__ = 'golding'

from ExpertContainer.api.ArchiveManager import ArchiveManager
import os
import time
import subprocess
from datetime import  datetime
from subprocess import check_output, CalledProcessError
from ExpertContainer.api.LogOperatorListen import LogOperatorListen

logDamon = LogOperatorListen('damon.log')

def scanForLive(strPyName):
    try:
        ret_text_list = os.popen("ps x| grep %s"%(strPyName,)).readlines()

        pid_num = None
        for item in ret_text_list:
            if item.find('python3.4 ')>=0:
                pid_num = int(item[0:5])
                break
        if pid_num is None:
            strLog='%s not found'%(strPyName)
            logDamon.writeLog(strLog, True)
            return False
        if pid_num and isinstance(pid_num, int):
            print('当前%s pid:%d'%(strPyName, pid_num))

        bLive = ArchiveManager.getIsLive(strPyName, 60*5)
        if bLive:
            #print('%s心跳包在线'%(strPyName))
            return True

        tNow = datetime.now()
        strLog = '%s--发现%s心跳包失效，kill程序'%( tNow.strftime('%Y-%m-%d %H:%M:%S') ,strPyName)
        print(strLog)
        logDamon.writeLog(strLog, True)
        os.system("kill -9 %s"%pid_num)

    except Exception as e:
        print('error:' + e.__str__())


def getPIDs(process):
    try:
        pidlist = map(int, check_output(["pidof", process]).split())
    except  CalledProcessError:
        pidlist = []
    print('list of PIDs = ' + ', '.join(str(e) for e in pidlist))

if __name__=='__main__':
    while True:
        scanForLive('RealCalcQueue_1')
        scanForLive('RealCalcQueue_2')
        scanForLive('RealCalcQueue_3')
        scanForLive('RealCalcQueue_4')
        scanForLive('RealCalcQueue_5')

        scanForLive('DiagnosisCalcQueue_1')
        scanForLive('DiagnosisCalcQueue_2')
        scanForLive('DiagnosisCalcQueue_3')
        scanForLive('DiagnosisCalcQueue_4')
        scanForLive('ForceCalcQueue_1')
        time.sleep(60)
