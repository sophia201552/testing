__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import datetime, time

serverip = app.config['SERVERIP']
t = 30
site_url = 'http://%s/v1/data/set_realtimedata_from_site' % serverip
histroy_url = "http://%s/get_history_data_padded_reduce" % serverip
realtime_url = "http://%s/admin/dataPointManager/search/" % serverip


class Service019(unittest.TestCase):
    testCaseID = 'Service019'
    projectName = "不针对项目"
    buzName = '接口v1/data/set_realtimedata_from_site测试'
    start = 0.0
    now = 0
    startTime = ""
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.beopService()
        self.raiseError()

    def beopService(self):
        # 验证正确的参数,周期默认是m1,同时验证更新时间对不对
        data1 = {"projId": "1", "point": ['test_123_456'], "value": ['1'],
                 'time': str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())), 'timePeriod': 'm1',
                 'waitForFinish': '0'}
        result_120 = self.postURL(data1, site_url)
        self.checkResult(result_120, data1)
        realtime_data = {"projectId": 1, "current_page": 1, "page_size": "50", "text": "test_123_456",
                         "isAdvance": False, "order": None, "isRemark": None, "flag": None}
        result_realtime = self.postURL(realtime_data, realtime_url)
        self.checkRealTime(data1, result_realtime)
        ####验证传入中文参数,返回state为1
        data123 = {"projId": "214", "point": ["ztest1", "ztest2"], "value":["ceshi1","测试2"]}
        result_120 = self.postURL(data123, site_url)
        self.checkResult(result_120, data123)
        # 验证空的参数
        data2 = {}
        result_120 = self.postURL(data2, site_url)
        self.checkResult(result_120, data2)
        # 验证不完整的参数
        data3 = {"projId": "1", "point": ['test_123_456']}
        result_120 = self.postURL(data3, site_url)
        self.checkResult(result_120, data3)
        # 验证周期m1时候的值
        time_str = str(time.strftime("%Y-%m-%d %H:%M:00", time.localtime()))
        print(time_str)
        data4 = {"projId": "1", "point": ['test_123_data4'], "value": ['1'], 'time': time_str, 'timePeriod': 'm1',
                 'waitForFinish': '0'}
        result_120 = self.postURL(data4, site_url)
        self.checkResult(result_120, data4)
        histroy_data = {"projectId": 1, "pointList": ["test_123_data4"], "timeStart": time_str,
                        "timeEnd": time_str, "timeFormat": "m1"}
        result_history = self.postURL(histroy_data, histroy_url)
        self.checkHistory(data4, result_history)
        # 验证周期为m5时候的值
        time_str = self.comHM()
        print(time_str)
        data5 = {"projId": "1", "point": ['test_123_data5'], "value": ['1'], 'time': time_str,
                 'timePeriod': 'm5', 'waitForFinish': '0'}
        result_120 = self.postURL(data5, site_url)
        self.checkResult(result_120, data5)
        histroy_data = {"projectId": 1, "pointList": ["test_123_data5"], "timeStart": time_str,
                        "timeEnd": time_str, "timeFormat": "m5"}
        result_history = self.postURL(histroy_data, histroy_url)
        self.checkHistory(data5, result_history)
        # 验证周期为h1时候的值
        time_str = str(time.strftime("%Y-%m-%d %H:00:00", time.localtime()))
        print(time_str)
        data6 = {"projId": "1", "point": ['test_123_data6'], "value": ['1'], 'time': time_str,
                 'timePeriod': 'h1', 'waitForFinish': '0'}
        result_120 = self.postURL(data6, site_url)
        self.checkResult(result_120, data6)
        histroy_data = {"projectId": 1, "pointList": ["test_123_data6"], "timeStart": time_str,
                        "timeEnd": time_str, "timeFormat": "h1"}
        result_history = self.postURL(histroy_data, histroy_url)
        self.checkHistory(data6, result_history)
        # 验证周期为d1的值
        time_str = str(time.strftime("%Y-%m-%d 00:00:00", time.localtime()))
        print(time_str)
        data7 = {"projId": "1", "point": ['test_123_data7'], "value": ['1'], 'time': time_str,
                 'timePeriod': 'd1', 'waitForFinish': '0'}
        result_120 = self.postURL(data7, site_url)
        self.checkResult(result_120, data7)
        histroy_data = {"projectId": 1, "pointList": ["test_123_data7"], "timeStart": time_str,
                        "timeEnd": time_str, "timeFormat": "d1"}
        result_history = self.postURL(histroy_data, histroy_url)
        self.checkHistory(data7, result_history)
        # # 验证周期不为m1,h1,m5,d1..例如为m6,看是否能够插进去数据
        # data8 = {"projId": "1", "point": ['test_123_data8'], "value": ['3'], 'time': '2016-07-22 00:20:00',
        #          'timePeriod': 'm6', 'waitForFinish': '0'}
        # result_120 = self.postURL(data8, site_url)
        # self.checkPeriod(result_120, data8)
        # # 验证时间格式不对,服务器不能保存数据,并有相关提示
        # data9 = {"projId": "1", "point": ['test_123_data9'], "value": ['4'], 'time': '2016-08-22',
        #          'timePeriod': 'm5', 'waitForFinish': '0'}
        # result_120 = self.postURL(data9, site_url)
        # self.checkTime(result_120, data9)
        # # 验证时间大于目前时间,服务器不能保存数据,并有相关提示
        # data10 = {"projId": "1", "point": ['test_123_data10'], "value": ['5'], 'time': '2016-08-22 00:20:00',
        #           'timePeriod': 'm5', 'waitForFinish': '0'}
        # result_120 = self.postURL(data10, site_url)
        # self.checkTime(result_120, data10)

    # 验证历史接口返回的点值和预期的是否相等
    def checkHistory(self, data, result):
        tool = BeopTools()
        name = data['point'][0]
        value = data['value'][0]
        if (result is not None and result.get('data') is not None):
            result_value = int(result['data'][name][0])
            if (int(data['value'][0]) == int(result['data'][data['point'][0]][0])):
                print('%s历史接口的值和预期的一致都是%s' % (data['point'][0], data['value'][0]))
            else:
                self.errors.append(
                    '错误信息[%s]%s---没有保存数据,项目中芯国际(id=1)%s接口使用参数%s返回值和预期的点值不一致.预期点值:%s,%s接口返回的点值为:%d' % (
                    tool.getTime(), self.testCaseID, histroy_url, str(data), value, histroy_url, result_value))
        else:
            print(result)
            self.errors.append('错误信息[%s]%s---项目:中芯国际(id=1)%s接口使用参数%s返回的值为空或者是没有历史数据' % (
            tool.getTime(), self.testCaseID, histroy_url, str(data)))

    def comHM(self):
        time_str = str(time.strftime("%Y-%m-%d %H:%M", time.localtime()))
        h = time_str.split(' ')[1].split(':')[1][1]
        if (int(h) >= 0 and int(h) < 5):
            h0 = 0
        elif (int(h) >= 5 and int(h) <= 9):
            h0 = 5
        else:
            h0 = int(h)
        time_str0 = str(time_str.split(' ')[0]) + " " + str(time_str.split(' ')[1].split(':')[0]) + ":" + str(
            time_str.split(' ')[1].split(':')[1][0]) + str(h0) + ":00"
        return str(time_str0)

    def checkTime(self, result, data):
        tool = BeopTools()
        if result is not None:
            if type(result) == type({}) and 'state' in result.keys():
                self.errors.append(
                    '错误信息[%s]%s---项目中芯国际(id=1)%s接口使用参数%s返回值与期待的不一致.实际为%s,应该是有时间格式或者时间不能大于目前时间的提示,并且没有保存数据' % (
                    tool.getTime(), self.testCaseID, site_url, str(data), result))
            else:
                print('%s使用正确的参数返回值正确显示为%s' % (data['point'][0], result))

    def checkPeriod(self, result, data):
        tool = BeopTools()
        if result is not None:
            if type(result) == type({}) and 'state' in result.keys():
                self.errors.append(
                    '错误信息[%s]%s---项目中芯国际(id=1)%s接口使用参数%s返回值与期待的不一致.实际为%s,应该是周期只能是m1,m5,h1,d1的提示,并且没有保存数据' % (
                    tool.getTime(), self.testCaseID, site_url, str(data), result))
            else:
                print('%s使用正确的参数返回值正确显示为%s' % (data['point'][0], result))

    # 检查site_url接口返回过来的结果值
    def checkResult(self, result, data):
        tool = BeopTools()
        if result is not None:
            if type(result) == type({}) and 'state' in result.keys():
                print('%s使用正确的参数返回值正确显示为%s' % (data['point'][0], result))
            elif 'none' in result:
                if data == {}:
                    print('使用空的参数返回值正确返回值为%s' % (result))
                else:
                    print('%s点不完整的参数返回值正确返回值为%s' % (data['point'][0], result))
            else:
                self.errors.append('错误信息[%s]%s---项目中芯国际(id=1)%s接口使用参数%s返回值与期待的不一致.实际为%s,期待值:state:1' % (
                tool.getTime(), self.testCaseID, site_url, str(data), result))

    # 检查实时接口admin/dataPointManager/search/和site_url接口返回值是否相等
    def checkRealTime(self, value1, value2):
        tool = BeopTools()
        name = value1['point'][0]
        if value2 is not None and value2['list'] is not None:
            v1 = value1['value'][0]
            v2 = value2['list'][0]['pointvalue']
            update_time = value2['list'][0]['time']
            if (update_time):
                now = time.strftime("%Y-%m-%d %H:%M", time.localtime())
                now = datetime.datetime.strptime(now, "%Y-%m-%d %H:%M")
                update = datetime.datetime.strptime(update_time, "%Y-%m-%d %H:%M")
                second = self.doTime(now, update)
                if second > 60*60+300:
                    self.errors.append('错误信息[%s]%s---项目:中芯国际(id=1)%s接口点名%s更新时间超过5分钟' % (
                    tool.getTime(), self.testCaseID, realtime_url, name))
                else:
                    print("%s点更新正常。" % (name))
            if (int(v1) == int(v2)):
                print('实时接口的值和post的值一样均为%s' % v1)
            else:
                self.errors.append(
                    '错误信息没有保存数据,项目:中芯国际(id=1)%s接口使用参数%s,点值为%s,%s接口的点值为%s,两个值不一样' % (
                    site_url, str(value1), v1, realtime_url, v2))
        else:
            self.errors.append(
                '错误信息[%s]%s---项目:中芯国际(id=1)%s接口点名%s返回值为空' % (tool.getTime(), self.testCaseID, realtime_url, name))

    def doTime(self, now, update):
        if (now > update):
            second = (now - update).seconds
        else:
            second = (update - now).seconds
        return second

    # post数据
    def postURL(self, data, url):
        tool = BeopTools()
        a = BeopTools()
        try:
            result = a.postData(url=url, data=data, t=t)
            return result
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append("错误信息[%s]%s---访问%s接口失败." % (tool.getTime(), self.testCaseID, url))

    def writeLog(self, text):
        # logger = self.init_log()
        self.logger.info('[%s]---' % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '' + text)

    # 抛出异常值
    def raiseError(self):
        if self.errors != []:
            assert 0, "\n".join(self.errors)
        else:
            pass

    def tearDown(self):
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        # info.append([self.testCaseID, use, now])
