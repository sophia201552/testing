__autor__="kirry"
from interfaceTest.Methods.BeopTools import *
import json
import time
import datetime
import re
from interfaceTest.Methods.Log import *
import unittest
from interfaceTest.Methods.MailTools import MailTools

class Base020(unittest.TestCase):
    space = "&nbsp"
    testCaseID = 'Base020'
    projectName = ""
    buzName = '查看项目DTU是否掉线'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    timeout = 10
    parms = {374:["DTU_Update_M1_Num_hehuangyaoy_svr","time_update_modbus0_hehuangyaoy_svr","time_update_modbus1_hehuangyaoy_svr",
                  "time_update_modbus2_hehuangyaoy_svr","time_update_modbus3_hehuangyaoy_svr","time_update_modbus4_hehuangyaoy_svr",
                  "time_update_modbus5_hehuangyaoy_svr"
                  ],
             293:["DTU_Update_M5_Num_qantas_sv","time_update_bacnet_qantas_svr"],
             396:["DTU_Update_M1_Num_knhb201609_svr","time_update_modbus0_knhb201609_svr","time_update_modbus10_knhb201609_svr",
                  "time_update_modbus11_knhb201609_svr","time_update_modbus12_knhb201609_svr","time_update_modbus13_knhb201609_svr",
                  "time_update_modbus14_knhb201609_svr","time_update_modbus15_knhb201609_svr","time_update_modbus16_knhb201609_svr",
                  "time_update_modbus17_knhb201609_svr","time_update_modbus18_knhb201609_svr","time_update_modbus19_knhb201609_svr",
                  "time_update_modbus1_knhb201609_svr","time_update_modbus20_knhb201609_svr","time_update_modbus21_knhb201609_svr",
                  "time_update_modbus22_knhb201609_svr","time_update_modbus23_knhb201609_svr","time_update_modbus2_knhb201609_svr",
                  "time_update_modbus3_knhb201609_svr","time_update_modbus4_knhb201609_svr","time_update_modbus5_knhb201609_svr",
                  "time_update_modbus6_knhb201609_svr","time_update_modbus7_knhb201609_svr","time_update_modbus8_knhb201609_svr",
                  "time_update_modbus9_knhb201609_svr"
                  ],
             190:["DTU_Update_M5_Num_macaucod123_svr","time_update_bacnet_macaucod123_svr"]
             }
    project = {374:"和黄药业",293:"175livepool",396:"开能环保",190:"新濠天地"}
    def setUp(self):
        self.url = "http://%s/admin/dataPointManager/search/" %app.config['SERVERIP']
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()
    def Test(self):
        for parm in self.parms:
            for point in self.parms[parm]:
                data = {
                    "projectId":parm,"current_page":1,
                    "page_size":"50","text":point,
                    "isAdvance":False,"order":None,
                    "isRemark":False,"flag":None
                    }
                rv = self.getTime(self.url,data,10)
                if rv:
                    rv = rv[0]
                    pointName = rv["pointname"]
                    pointTime = rv["time"]
                    if "DTU" in pointName:
                        pointvalue = int(rv["pointvalue"].split("/")[0])
                        self.checkNum(pointvalue,pointName,parm)
                    else:
                        pointvalue = rv["pointvalue"]
                else:
                    continue
                self.use1 = ((datetime.datetime.now() - self.start).seconds)/60
                now = datetime.datetime.now()
                pointTime=datetime.datetime.strptime(pointTime,'%Y-%m-%d %H:%M')
                if parm in [293]:
                    pointTime = pointTime-datetime.timedelta(hours = 2)
                if now>pointTime:
                    deltime = now - pointTime
                else:
                    deltime = pointTime - now
                if deltime.seconds > 300:
                    self.errors.append("%sDTU点%s掉线时间大于5分钟，请查看！<br/>"%(self.space*10,pointName))
                    continue
                if "DTU" not in pointName:
                    self.checkeny(pointvalue,pointName,parm,now)
            if self.errors:
                self.send_mail(parm,"项目ID为%s，项目名为%s，DTU掉线：<br/>%s"%(parm,self.project[parm],self.space*6)+("<br/>"+self.space*4).join(self.errors))
                self.errors = []


    def getTime(self,url,data,time):
        try:
            rv = BeopTools.postJsonToken(url,data,time)
        except Exception as e:
            print(e.__str__())
            self.a.writeLogError(self.logger,"接口%s请求超过%ss!"%(url,time)+e.__str__())
            assert 0,"接口%s请求超过%ss!"%(url,time)
        rv = rv.get('list',False)
        return rv

    #检查掉线个数
    def checkNum(self,pointvalue,pointname,pointId):
        if pointvalue < 5:
            self.errors.append("%sDTU为%s的点掉线，点的更新个数为%s<br/>"%(self.space*8,pointname,pointvalue))
        else:
            print("项目正常")

    #检查引擎是否掉线
    def checkeny(self,pointvalue,pointname,pointId,comparetime):
        updatetime = datetime.datetime.strptime(pointvalue,"%Y-%m-%d %H:%M:%S")
        if pointId in [293]:
            updatetime = updatetime-datetime.timedelta(hours = 2)
        if updatetime>comparetime:
            if (updatetime - comparetime).seconds > 300:
                self.errors.append("数据掉线更新时间大于5分钟，掉线的点为%s,请查看！"%(pointname))
            else:
                print("项目引擎正常！")

    def send_mail(self,projectId,error):
        a = MailTools()
        if  projectId == 374:
            a.send_mail(["Kirry.gao@rnbtech.com.hk","kingsley.he@rnbtech.com.hk"],"检查项目是否掉线",self.use1,"大家好！<br/>%s项目是否掉线测试情况如下：<br/>%s"%(self.space*2,self.space*6)+error+"<br/>")
        elif projectId == 293:
            a.send_mail(["Kirry.gao@rnbtech.com.hk","kingsley.he@rnbtech.com.hk"],"检查项目是否掉线",self.use1,"大家好！<br/>%s项目是否掉线测试情况如下：<br/>%s"%(self.space*2,self.space*6)+error+"<br/>")
        elif projectId == 396:
           a.send_mail(["Kirry.gao@rnbtech.com.hk","kingsley.he@rnbtech.com.hk"],"检查项目是否掉线",self.use1,"大家好！<br/>%s项目是否掉线测试情况如下：<br/>%s"%(self.space*2,self.space*6)+error+"<br/>")
        else:
            a.send_mail(["Kirry.gao@rnbtech.com.hk","kingsley.he@rnbtech.com.hk"],"检查项目是否掉线",self.use1,"大家好！<br/>%s项目是否掉线测试情况如下：<br/>%s"%(self.space*2,self.space*6)+error+"<br/>")


    def tearDown(self):
        use = str(self.use1) + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == "__main__":
    while 1:
        suit = unittest.TestSuite()
        suit.addTest(Base020("Test"))
        runner = unittest.TextTestRunner()
        runner.run(suit)
        time.sleep(1800)