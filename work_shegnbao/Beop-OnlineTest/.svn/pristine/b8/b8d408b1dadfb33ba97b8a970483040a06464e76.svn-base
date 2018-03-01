__author__ = 'Woody'
import requests
from interfaceTest.Methods.BeopTools import *
import json
from interfaceTest import app
import time
import datetime
import re
import unittest
import pymysql



num = 0
class Calc027(unittest.TestCase):
    testCaseID = 'Calc027'
    projectName = "hehuangyaoye项目"
    buzName = '原始数据是否发生突变'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    emails = app.config['CALC027_EMAILS']
    projId = 374
    points = ('Accum_zhijianyanfa_ElecUse',
                'Accum_yushi_ElecUse',
                'Accum_yeti_ElecUse',
                'Accum_wushuichuli_ElecUse',
                'Accum_wanji_ElecUse',
                'Accum_tiqu_ElecUse',
                'Accum_shitang_ElecUse',
                'Accum_shengwujianyan_ElecUse',
                'Accum_pianji_ElecUse',
                'Accum_guolu_ElecUse',
                'Accum_donglijixiu_ElecUse',
                'Accum_cangku_ElecUse',
                'Accum_bangonglou_ElecUse',
                'Accum_PWCH_ElecUse',
                'Accum_CHWP160_ElecUse',
                'Accum_CHWP75_ElecUse',
                'Accum_CHWP_ElecUse',
                'Accum_AirPress_ElecUse',
                'Accum_CoolingFan_ElecUse',
                'Accum_guanqu_ElecUse',
                'Accum_jishuzhongxin_ElecUse',
                'Accum_zhijianyafa_er_ElecUse',
                'Accum_changqulvhua_ElecUse',
                'Accum_CHWP160and75_ElecUse',
                'Accum_xiaofangPump_ElecUse',
                'Accum_jixiufuzhu_ElecUse',
                'TotalElecUseD',
                'gas_23_accD',
                'Accum_TotalElecUse',
                'w_total_accD',
                'Total01_ElecUseD',
                'Total02_ElecUseD',
                'Total03_ElecUseD',
                'Total04_ElecUseD',
                'Total01_ElecUseM',
                'Total02_ElecUseW',
                'Total03_ElecUseW',
                'Total04_ElecUseW',
                'Total01_ElecUseM',
                'Total02_ElecUseM',
                'Total03_ElecUseM',
                'Total04_ElecUseM')


    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.offline = 0
        self.checkValue()
        if self.errors:
            BeopTools.writeLogError(self.logger, '\n'.join(self.errors))
            BeopTools.raiseError(self.errors, self.testCaseID)
            #BeopTools.send_email(self.emails, self.testCaseID, self.errors, self.testCaseID)
        else:
            BeopTools.writeLogError(self.logger, '错误个数为0!')
            print('不发邮件')


    def checkValue(self):
        pointType = 0
        for point in self.points:
            rv = self.checkHistoryData(self.projId, self.projectName, point)

    def checkHistoryData(self, projectId, projectName,point):
        global num
        rt = False
        addr = "http://%s/get_history_data_padded_reduce" % app.config['SERVERIP']
        a = BeopTools()
        r = None
        updateTime = None
        timeEnd = self.start.strftime("%Y-%m-%d %H:%M:%S")
        timeStart = self.start - datetime.timedelta(seconds=600)
        timeStart = timeStart.strftime("%Y-%m-%d %H:%M:%S")
        timeEnd=self.getFiveM(timeEnd)
        timeStart=self.getFiveM(timeStart)

        data = {
            "pointList":[point],
            "projectId":374,
            "prop":{},
            "timeEnd":timeEnd,
            "timeFormat":"m5",
            "timeStart":timeStart
        }
        try:
            rt = a.postJsonToken(url=addr, data=data, t=10)
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息%s接口失败,%d秒内没有响应!" % (addr, 10))
        if rt and isinstance(rt, dict):
            value = rt.get('data',False)
            if value:
                value = value.get(point,[])
                if len(value) >= 2:
                    if value[1] and value[0]:
                        if value[1] > value[0]*10.0:
                            self.errors.append("错误信息和黄药业%s点在%s~%s发生点值震幅超过10倍!" % (point, timeStart.strftime("%Y-%m-%d %H:%M:%S"), timeEnd))
                        return True
                    else:
                        self.errors.append("错误信息和黄药业%s点在%s~%s两个时间点返回中有空值"%(point,timeStart.strftime("%Y-%m-%d %H:%M:%S"), timeEnd))
            elif rt.get("error",False):
                if num>3:
                    self.errors.append("错误信息和黄药业%s点返回历史数据为%s！"%(point,rt.get("msg")))
                else:
                    num +=1
                    return self.checkHistoryData( projectId, projectName,point)
            else:
                self.errors.append("错误信息和黄药业%s点在%s~%s没有获取到历史数据!" % (point, timeStart.strftime("%Y-%m-%d %H:%M:%S"), timeEnd))
            num = 0
    def getFiveM(self,now):
        now = now[:-3]
        #获取五分钟时间点
        if 5 < int(now[-1:]) <= 9:
            now = now[:-1] + "5"
        elif 0 < int(now[-1:]) < 5:
            now = now[:-1] + "0"
        else:
            pass
        now = now + ":00"
        return now
    def tearDown(self):
        self.offline = False
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc027('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

