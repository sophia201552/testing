__author__ = 'kirry'
import datetime,time
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import unittest


muitTime = None
class Calc044(unittest.TestCase):
    testCaseID = 'Calc044'
    projectName = ""
    buzName = '检查原始数据的累积量是否在变化'
    now = 'None'
    url = "http://121.41.30.108/get_history_data_padded"
    searchpoint = "http://beop.rnbtech.com.hk/point_tool/getCloudPointTable/"
    projectId = [491,15,120,528,539,540,542]


    def setUp(self):
        self.errors = []
        self.start = datetime.datetime.now()
        self.startime = self.start-datetime.timedelta(minutes = 20)


    def Test(self):
        now = datetime.datetime.now()
        if now.hour in [3,7] and now.minute in [51,52,53,54,55,56,57,58]:
            a = BeopTools()
            alldata = {}
            message = {}
            data = [{"projectId":projectid,"currentPage":1,"pointType":2,"searchText":"Accum","t_time":"","pageSize":1000} for projectid in self.projectId]
            for dt in data:
                pointList = [pl for pl in self.searchPoint(dt) if "D" not in pl and "H" not in pl and "M" not in pl and "W" not in pl]
                alldata[dt.get("projectId")] = pointList
            now = datetime.datetime.now()
            yesterdaytime = now-datetime.timedelta(days = 1)
            post_data = [{
            'projectId': key,
            'timeStart': yesterdaytime.strftime('%Y-%m-%d %H:%M:%S'),
            'timeEnd': now.strftime('%Y-%m-%d %H:%M:%S'),
            'timeFormat': 'm5',
            'pointList': alldata[key]
            } for key in alldata
                         ]
            for data in post_data:
                projectId = data.get("projectId")
                rv = self.postData(data)
                for rs in rv:
                    for r in rs:
                        status = self.manipulationData(rs[r])
                        if not status:
                            print("项目%s中点%s累积量正常！"%(projectId,r))
                        else:
                            self.errors.append("项目%s中的点%s累积量数据:%s"%(projectId,r,status))
                if self.errors:
                    message[projectId] = self.errors
                    self.errors = []
            self.raiseError(message)

    def raiseError(self, message):
        log = []
        if message:
            for mess in message:
                log.append("项目id为%s的计算点如下：\n"%mess+"\n".join(message[mess]))
            assert 0,"错误信息：\n"+"\n".join(log)



    def searchPoint(self,data):
        a = BeopTools()
        try:
            rv = a.postData(self.searchpoint,data,20)
        except Exception as e:
            assert 0,"请求接口%s超时！"%self.url
        return [r.get("value") for r in rv["data"]["pointTable"]]


    def postData(self,data):
        a = BeopTools()
        try:
            rv = a.postData(self.url,data,15)
        except Exception as e:
            assert "请求接口{}超时!".format(self.url)
        return [{r.get("name"):r.get("history",False)} for r in rv]

    def manipulationData(self,data):
        results = {}
        if data:
            for i in range(0,len(data)-1):
                value1 = round(float(data[i+1].get("value")),2)
                value2 = round(float(data[i].get("value")),2)
                if value1 < value2:
                    results[data[i+1].get("time")] = value1
                    results[data[i].get("time")] = value2
                    return results
            return False


    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    while True:
        suite = unittest.TestSuite()
        suite.addTest(Calc044('Test'))
        runner = unittest.TextTestRunner()
        result = runner.run(suite)