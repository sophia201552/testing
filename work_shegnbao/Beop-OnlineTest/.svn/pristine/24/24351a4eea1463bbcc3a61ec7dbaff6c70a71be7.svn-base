__author__ = 'woody'
import unittest

from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import time, sys

url_errorlog = "http://%s/api/errorlog" % app.config['SERVERIP']
url_countoflogg="http://%s/api/errorlog/countoflog" % app.config['SERVERIP']
class Calc021(unittest.TestCase):
    testCaseID = 'Calc021'
    projectName = "无"
    buzName = '检查错误日志里面的内容是否超过了1万条'
    errors = []
    timeout=100
    project = [('上海华为',72),('上实大厦',284),('中文演示06',76),('英文演示06',71),('高露洁',100),('演示09',175),
               ('顺风光电1号',90),('杭州妇产医院',102),('上海华滋奔腾',186),('江阴长电',96),('嘉民',179),('上海印钞厂',194),('上汽工业',19),
               ('某办公楼',364),('新加坡Bugis+',394),('苏州天弘科技有限公司',128),('西克裕灌',281),('香港华润',18),('中区广场',28),
               ('荣信钢铁高压变频',303),('人民广场来福士',393),('liverpool',293),('中电熊猫云平台',373),('华东电网调度中心大楼',15),
               ('企业天地',316),('青山湖',376),('金钟广场',318),('国家会展中心',216),('上实大厦',284),
               ('古北金融国际',7),('成都时代1号',83),('世纪商贸',80),('梅赛德斯奔驰文化中心',120),('天津光合谷',201),('天津团泊农业示范园',200),('天津武清商务区赛达广场',203)]

    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))



    #测试用例主函数, 首先清空errors错误信息数组,然后获取所有计算点表，然后判断其中是否包含None的点值，如有则添加进错误信息，最后抛出异常
    def Test(self):
        self.errors = []
        self.checkErrorLogCount(self.project)
        BeopTools.raiseError(self.errors, self.testCaseID)


    #获取errorlog的值
    def checkErrorLogCount(self, project):
        for p in range(len(project)):
            data = {"projId":project[p][1],"pageSize":200,"pageNum":1,"timeFrom":"2000-08-15 00:00:00","timeTo":time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}
            try:
                rv = BeopTools.postData(self,url=url_errorlog, data=data, t=self.timeout)
            except Exception as e:
                print(e.__str__())
                BeopTools.writeLogError(self.logger, e.__str__())
                assert 0,"错误信息[%s]%s---项目名称: %s 项目id: %s 调用%s接口使用%s参数失败!" % (BeopTools.getTime(), self.testCaseID, project[p][0], project[p][1], url_errorlog,data)

            if(isinstance(rv,dict) and rv['success']==True):
                if(rv['data']['total']!=None and rv['data']['total']>=100000):
                    self.errors.append("错误信息[%s]%s---%s(id: %s) 调用%s接口使用参数%s返回值超过10万条返回值为%s!" % (BeopTools.getTime(), self.testCaseID, project[p][0], project[p][1], url_errorlog,data,rv['data']['total']))
                    try:
                        data={"projId":project[p][1]}
                        rv = BeopTools.postData(self,url=url_countoflogg, data=data, t=self.timeout)
                    except Exception as e:
                        print(e.__str__())
                        BeopTools.writeLogError(self.logger, e.__str__())
                        assert 0,"错误信息[%s]%s---项目名称: %s 项目id: %s 调用%s接口使用%s参数失败!" % (BeopTools.getTime(), self.testCaseID, project[p][0], project[p][1], url_countoflogg,data)
                    if(isinstance(rv,dict) and rv['success']==True and rv['data']!=None):
                        self.errors.append("错误信息分别是%s!" % str(rv['data']))
                    else:
                        self.errors.append("错误信息[%s]%s---%s(id: %s) 调用%s接口使用参数%s返回值data为空返回值为%s!" % (BeopTools.getTime(), self.testCaseID, project[p][0], project[p][1], url_countoflogg,data,str(rv)))
                else:
                    print('id:%s错误日志返回值没有超过10万条'%project[p][1])

            else:
                self.errors.append("错误信息[%s]%s---%s(id: %s) 调用%s接口使用参数%s返回值total为空返回值为%s!" % (BeopTools.getTime(), self.testCaseID, project[p][0], project[p][1], url_errorlog,data,str(rv)))


    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc021('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

