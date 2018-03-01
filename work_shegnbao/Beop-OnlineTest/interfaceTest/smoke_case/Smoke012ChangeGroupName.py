#修改数据组名字
__author__ = 'woody'

import unittest
import string
import random
import pymongo, time, datetime, sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

ServerIp = [app.config['SERVER208']]
d = {'beop.rnbtech.com.hk':'国服','beop6.rnbtech.com.hk':'港服','beopdemo.rnbtech.com.hk':'预发布服务器demo'}
mongoIp = "218.244.141.238"
class Smoke012(unittest.TestCase):
    testCaseID = 'Smoke012'
    ProjectName = '无项目'
    BuzName = 'datasource接口测试'


    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))


    def random_str(self, randomlength=8):
        a = list(string.ascii_letters)
        random.shuffle(a)
        return ''.join(a[:randomlength])



    def Test(self):
        for ip in ServerIp:
            url = 'http://%s/datasource/saveDataSourceGroup' % ip
            data = {'groupId':'55de7d3b323f0d0fdcdf0d4d','name':self.random_str(),'parent':'','userId':404}
            restore = {'groupId':'55de7d3b323f0d0fdcdf0d4d','name':'TestCase-ChangeGroupName','parent':'','userId':404}
            condition = 'successful'
            DataSourceResult = BeopTools.getInstance().postJson(url,data)
            self.assertEqual(DataSourceResult['error'],condition,'%s->数据分析->发送修改数据组名的请求失败!' % d[ip])
            connection=pymongo.MongoClient(mongoIp,27017)
            db = connection.beopdata
            try:
                if db.authenticate('beopweb','RNB.beop-2013'):
                    #rt = db.collection_names()
                    cur = db['DataSourceGroup'].find()
                    groupName = []
                    for item in cur:
                        a = item
                        for i in a.keys():
                            if i == 'groupName':
                                groupName.append(a[i])
            except Exception:
                assert 0,"连接%s mongo数据库失败！" % d[ip]
            self.assertIn(data['name'],groupName,'%s->数据分析->数据源界面->修改数据组Test的名称失败!' % d[ip])
            print('%s->数据分析->数据源界面->修改数据组TestCase-ChangeGroupName的名称为%s成功!' % (d[ip],data['name']))
            restore_data = BeopTools.getInstance().postJson(url,restore)
            cur2 = db['DataSourceGroup'].find()
            groupName2 = []
            for item in cur2:
                b = item
                for i in b.keys():
                    if i == 'groupName':
                        groupName2.append(b[i])

            self.assertIn(restore['name'],groupName2,'%s->数据分析->还原数据组名为TestCase-ChangeGroupName失败!' % d[ip])
            print('%s->数据分析->还原数据组名为TestCase-ChangeGroupName成功!' % d[ip])
            connection.close()



    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke012('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)



