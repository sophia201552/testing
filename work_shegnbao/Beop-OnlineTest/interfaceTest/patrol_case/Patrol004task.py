__author__ = 'woody'
import json
import time
import datetime
import unittest
import logging
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app


'''
    1.首先获取巡更路线,添加该路线的排班，再检测是否添加进去
    2.删除该排班记录，获取排班信息，是否还是存在该记录
    3.删除该巡更路线，查看该路线是否还在排班之中
'''
projectId = 76
serverip=app.config['SERVERIP']
get_path_url = "http://%s/patrol/path/getAll/%d" % (serverip,projectId)
new_path = "巡更测试路线"
add_path_url = "http://%s/patrol/path/save/%d" % (serverip,projectId)
del_path_url = "http://%s/patrol/path/remove/%d/"% (serverip,projectId)




class Patrol004(unittest.TestCase):
    testCaseID = 'Patrol004'
    projectName = "巡更系统"
    buzName = '巡更排班'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    a = BeopTools()
    path_id = None



    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.logger = self.init_log()


    def Test(self):
        self.errors = []
        self.isPathAdded()
        self.Task()
        self.isPathDeleted(self.path_id)
        self.raiseError(self.errors)

    #写错误信息至日志文件
    def writeLog(self, text):
        #logger = self.init_log()
        self.logger.warning('[%s]---' % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '' + text)



    #获取巡更路线
    def getPath(self):
        rt = []
        a = BeopTools()
        try:
            rt = a.tokenGet(url=get_path_url, timeout=60)
        except Exception as e:
            self.writeLog(e.__str__())
            print(e.__str__())
            self.errors.append("错误信息发送get请求%s接口失败!")
            return rt
        pathes = rt.get('data',[])
        return pathes


    #输出path信息
    def infoPath(self,pathes):
        pathObjectId = []
        try:
            for index, path in enumerate(pathes):
                point = path.get("path",[])
                path_name = path.get('name')
                path_id = path.get('_id')
                pathObjectId.append(path_id)
                path_point_num = len(point)
                #
                if path_name and path_id and path_point_num:
                    print("巡更路线编号 %d, 路线名称 %s, 巡更路线id %s 巡更点个数为%d" % ((index+1), path_name, path_id, path_point_num))
                else:
                    self.errors.append("错误信息巡更路线中有信息不存在!巡更路线名称 %s, 巡更路线id %s 巡更点个数为%d。" % (path_name, path_id, path_point_num))

        except Exception as e:
            self.writeLog(e.__str__())
            print(e.__str__())
            self.errors.append("错误信息获取巡更路线信息时出错，请查看日志!")
        return pathObjectId




    #添加path
    def addPath(self):
        a = self.a
        rt = None
        pointList = ["5770bd67833c976a73096bf4","5770bd75833c976a740c968e",'578f21d7833c9764bcc8db9e']
        test_data = {
                        "name":new_path,
                        "elapse":30,
                        "timeRange":"-60 +60",
                        "status":1,"path":pointList
                    }
        try:
            rt = a.postJsonToken(url=add_path_url, data=test_data, t=10)
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
        return rt

    def delPath(self,path_id):
        rt = {}
        post_data = {"_id":path_id,"status":0}
        url = del_path_url + path_id
        try:
            rt = self.a.postJsonToken(url=url, data=post_data, t=10)
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append("错误信息删除巡更路线失败,其id为%s" % (path_id, ))
        if rt.get('data',False):
            print("删除巡更路线成功!")
        else:
            self.errors.append("错误信息[%s]  删除巡更路线返回结果不为True,为%s!请检查!" % (self.getTime(), json.dumps(rt)))


    def isPathDeleted(self,path_id):
        pathesOld = self.getPath()
        self.delPath(path_id)
        old_pathes = self.infoPath(pathesOld)
        pathesNew = self.getPath()
        new_pathes = self.infoPath(pathesNew)
        if path_id not in new_pathes and len(new_pathes) == len(old_pathes) - 1:
            print("删除巡更路线成功!")
        else:
            self.errors.append("错误信息[%s] id为%s的巡更路线删除失败!" % (self.getTime(), str(path_id)))
        #self.path_id = path_id
        #return path_id


    def getTime(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    #验证路线是否添加
    def isPathAdded(self):
        pathesBefore = self.getPath()
        path = self.addPath()
        path_id = path.get('data')
        old_pathes = self.infoPath(pathesBefore)
        pathesAfter = self.getPath()
        new_pathes = self.infoPath(pathesAfter)
        if path_id in new_pathes and len(new_pathes) == len(old_pathes) + 1:
            print("添加巡更路线成功!")
        else:
            self.errors.append("错误信息巡更路线添加失败!")
        self.path_id = path_id
        return path_id





    def Task(self):
        #获取今天是星期几
        week = datetime.datetime.now().weekday()
        if week > 0:
            #delta = week
            #获取到周一
            monday = str((datetime.datetime.now() - datetime.timedelta(days=week)).date())
        else:
            #获取到周一
            monday = str(datetime.datetime.now().date())

        saturday = str((datetime.datetime.now() + datetime.timedelta(days=(6-week))).date())


        task_save_url = "http://%s/patrol/mission/save/%s" % (app.config['SERVERIP'],projectId)
        original_data = {
                        "startTime":monday,
                        "interval":"7",
                        "option":{
                                "578ddcc71c95476b0b1881b9":{
                                                            "16:00":[None,"5770bc64833c976a740c968d",None,None,None,None,None],
                                                            "19:00":[None,None,"5770bc64833c976a740c968d",
                                                                    "5770bc64833c976a740c968d","5770bc64833c976a740c968d",
                                                                    None,"5770bc64833c976a740c968d"]
                                                            },
                                "578ef127833c9764bcc8db5c":{
                                                            "11:00":[None,None,None,None,"5770bc64833c976a740c968d",None,None],
                                                            "12:00":[None,None,"5770bc64833c976a740c968d","5770bc64833c976a740c968d",None,None,None],
                                                            "12:30":[None,None,"5770bc64833c976a740c968d",None,None,None,None]
                                                            },


                        },
                        "_id":"578ddcd51c95476b09cabe90"
                        }

        edit_data = {
                      "startTime":monday,
                      "interval":"7",
                      "option":{
                                "578ddcc71c95476b0b1881b9":{
                                                            "16:00":[None,"5770bc64833c976a740c968d",None,None,None,None,None],
                                                            "19:00":[None,None,"5770bc64833c976a740c968d",
                                                                    "5770bc64833c976a740c968d","5770bc64833c976a740c968d",
                                                                    None,"5770bc64833c976a740c968d"]
                                                            },
                                "578ef127833c9764bcc8db5c":{
                                                            "11:00":[None,None,None,None,"5770bc64833c976a740c968d",None,None],
                                                            "12:00":[None,None,"5770bc64833c976a740c968d","5770bc64833c976a740c968d",None,None,None],
                                                            "12:30":[None,None,"5770bc64833c976a740c968d",None,None,None,None]
                                                            },

                                self.path_id: {
                                                        "10:00":[None,None,None,None,"5770bc64833c976a740c968d","5770bc64833c976a740c968d",None]
                                            }
                                },
                      "_id":"578ddcd51c95476b09cabe90"
                    }

        #先获取排班信息
        task_old = self.getTask(monday,saturday)

        #获取之前的任务个数
        misson_old = len(task_old.keys())

        #修改排班信息
        try:
            self.a.postJsonToken(url=task_save_url, data=edit_data, t=10)
        except Exception as e:
            self.writeLog(e.__str__())
            print(e.__str__())
            self.errors.append("错误信息[%s]巡更排班保存出错!请查看日志!" % self.getTime())

        #再次获取排班信息
        task_new = self.getTask(monday,saturday)

        #获取之前的任务个数
        misson_new = len(task_new.keys())

        if misson_new != misson_old + 1:
            self.errors.append("错误信息[%s]  巡更新增一条排班记录后获取排班信息,排班数量没有增加!" % (self.getTime(), ))
        else:
            print("新增巡更班次成功!")


        executor_man = ['5770bc64833c976a740c968d', '5770bc64833c976a740c968d']

        try:
            r = False
            for key, value in task_new.items():
                if key == self.path_id:
                    print("找到新增加的巡更路线的排班班次!")
                    #应该只添加了1条记录
                    people = value.get("10:00", [])
                    executor = [x for x in people if x is not None]
                    if executor == executor_man:
                        print("新增巡更班次排班人员正确!")
        except Exception as e:
            self.writeLog(e.__str__())
            print(e.__str__())
            self.errors.append("错误信息[%s]  巡更排班后获取到的信息与预期不符,请查看!" % self.getTime())

        #还原巡更记录
        try:
            self.a.postJsonToken(url=task_save_url, data=original_data, t=10)
        except Exception as e:
            self.writeLog(e.__str__())
            print(e.__str__())
            self.errors.append("错误信息[%s]巡更排班保存出错!请查看日志!" % self.getTime())










    def getTask(self,start,end):
        tasks = None
        get_task_url = "http://%s/patrol/mission/get/%d/%s/%s" % (app.config['SERVERIP'],projectId, start, end)
        try:
            tasks = self.a.tokenGet(url=get_task_url, timeout=10)
        except Exception as e:
            self.writeLog(e.__str__())
            self.errors.append("错误信息[%s] 请求%s接口失败!请查看日志!" % (self.getTime(), get_task_url,))
        try:
            tasks = tasks.get('data')[0]['option']
        except Exception as e:
            self.writeLog(e.__str__())
            self.errors.append("错误信息[%s]获取巡更排班信息失败,详情请查看日志!" % (self.getTime()))
        return tasks



    def init_log(self):
        handler = logging.FileHandler(r".\log\%s.txt" % self.testCaseID, encoding='utf-8')
        logger = logging.getLogger()
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        return logger


    #抛出异常函数
    def raiseError(self,error):
        if error != []:
            #print("\n".join(error))
            assert 0,"\n".join(error)
        else:
            pass





    def tearDown(self):
        self.errors = []
        self.path_id = None
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        ##info.append([self.testCaseID, use, now])




if __name__ == '__main__':

    suite = unittest.TestSuite()
    suite.addTest(Patrol004('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
