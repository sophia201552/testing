__author__ = 'sophia'
import unittest
from datetime import datetime, timedelta

from interfaceTest.Methods.BeopTools import *
from interfaceTest import app

t = 30
serverip = app.config['SERVERIP']
test_url = "http://121.41.28.69:4000/cloudPoint/onlinetest"
history_url = "http://%s/get_history_data_padded_reduce" % serverip
realtime_url = "http://%s/admin/dataPointManager/search/" % serverip


class Calc003(unittest.TestCase):
    testCaseID = 'Calc003'
    projectName = "上海中芯国际"
    buzName = '数据管理--修改计算点,并验证根据现场点算计算点值是否正确'
    start = 0.0
    now = 0
    startTime = ""
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())

    def Test(self):
        self.doPoint()
        self.raiseError()

    def alterPoint(self, logic, result):
        notEqual = False
        point_test = {'content': logic, 'projId': 1, 'pointName': "sophia", 'moduleName': "calcpoint_1_sophia",
                      'writeToReal': 1}
        point_194 = {'content': logic, 'projId': 194, 'pointName': "sophia",
                     'moduleName': "calcpoint_194_sophia",
                     'writeToReal': 1}
        a = BeopTools()
        if (logic == "calc_eff_smooth(194,'Plant001_Load', 'Plant001_GroupPower')"):
            try:
                pf = a.postForm(url=test_url, data=point_194, t=30)
            except Exception as e:
                print(e.__str__())
                assert 0, "错误信息访问%s接口失败!" % test_url
        else:
            try:
                pf = a.postForm(url=test_url, data=point_test, t=30)
            except Exception as e:
                print(e.__str__())
                assert 0, "错误信息访问%s接口失败!" % test_url
        if (result == None or pf['value'] == None):
            print("公式%s现场点该阶段没有历史数据" % logic)
        else:
            if (type(pf['value']) == type([])):
                for r in range(len(result)):
                    notEqual = self.compareValue(pf['value'][r], result[r])
                    if (notEqual == False):
                        self.errors.append("错误信息公式%s返回的结果值不正确应该是%s" % (logic, str(result)))
                        break
                if (notEqual == True):
                    print("公式%s返回的结果值正确%s" % (logic, str(pf['value'])))
            else:
                notEqual = self.compareValue(pf['value'], result)
                if (notEqual):
                    print("公式%s返回的结果值正确%s" % (logic, str(pf['value'])))
                else:
                    # print("添加到错误信息的时间:" + str(datetime.datetime.now()),
                    #       '公式%s返回的结果值不正确%s应该是%s' % (logic, str(pf['value']), str(result)))
                    self.errors.append("错误信息公式%s返回的结果值不正确%s应该是%s" % (logic, str(pf['value']), str(result)))

    def doPoint(self):
        print(datetime.datetime.now())
        self.errors = []
        now = datetime.datetime.now()
        # a = BeopTools()
        # 根据现场点算计算点,验证返回的结果值
        # 计算某一年的结果
        one_year = {"projectId": 1, "pointList": ["OutdoorTdbin"], "timeStart": "2015-01-01 00:00:00",
                    "timeEnd": "2015-12-31 23:55:00", "timeFormat": "d1"}
        sum_year = self.postError(history_url, one_year, t)
        sum_year_data = self.cacResult(sum_year)
        live_logic26 = "return calc_sum_year(1,'OutdoorTdbin',1,2015)"
        self.alterPoint(live_logic26, str(sum_year_data) + "+0.5")
        # 计算去年的结果
        last_year = {"projectId": 1, "pointList": ["OutdoorTdbin"], "timeStart": str(now.year - 1) + "-01-01 00:00:00",
                     "timeEnd": str(now.year - 1) + "-12-31 23:55:00", "timeFormat": "d1"}
        sum_last_year = self.postError(history_url, last_year, t)
        sum_last_year_data = self.cacResult(sum_last_year)
        live_logic25 = "return calc_sum_last_year(1,'OutdoorTdbin',1)"
        self.alterPoint(live_logic25, str(sum_last_year_data) + "+0.5")
        # 计算今年的结果
        ty = datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S")
        this_year = {"projectId": 1, "pointList": ["OutdoorTdbin"], "timeStart": str(now.year) + "-01-01 00:00:00",
                     "timeEnd": ty,
                     "timeFormat": "d1"}
        sum_this_year = self.postError(history_url, this_year, t)
        sum_this_year_data = self.cacResult(sum_this_year)
        live_logic24 = "return calc_sum_this_year(1,'OutdoorTdbin',1)"
        self.alterPoint(live_logic24, sum_this_year_data)
        # 计算某个月(2月份)的结果
        one_month = {"projectId": 1, "pointList": ["OutdoorTdbin"], "timeStart": "2016-02-01 00:00:00",
                     "timeEnd": "2016-02-29 23:55:00", "timeFormat": "h1"}
        sum_one_month = self.postError(history_url, one_month, t)
        sum_one_month_data = self.cacResult(sum_one_month)
        live_logic23 = "return calc_sum_one_month(1,'OutdoorTdbin',1,'h1',2)"
        self.alterPoint(live_logic23, str(sum_one_month_data))
        # 计算某个星期(2016-5-2到2016-5-8)的结果
        one_week = {"projectId": 1, "pointList": ["OutdoorTdbin"], "timeStart": "2016-05-02 00:00:00",
                    "timeEnd": "2016-05-08 23:55:00", "timeFormat": "m5"}
        sum_one_week = self.postError(history_url, one_week)
        sum_one_week_data = self.cacResult(sum_one_week)
        num = self.isWhichNum()
        live_logic22 = "return calc_sum_one_week(1,'OutdoorTdbin',1,'m5'," + str(num) + ")"
        self.alterPoint(live_logic22, sum_one_week_data)
        # 计算这个月的结果
        ty = datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S")
        this_month = {"projectId": 1, "pointList": ["OutdoorTdbin"],
                      "timeStart": str(now.year) + "-" + str(now.month) + "-01 00:00:00", "timeEnd": ty,
                      "timeFormat": "h1"}
        sum_this_month = self.postError(history_url, this_month, t)
        sum_this_month_data = self.cacResult(sum_this_month)
        live_logic21 = "calc_sum_this_month(1,'OutdoorTdbin',1,'h1')"
        self.alterPoint(live_logic21, str(sum_this_month_data))
        # 计算这个星期的结果
        sum_this_week = self.postError(history_url, self.getwWeekMon())
        sum_this_week_data = self.cacResult(sum_this_week)
        live_logic20 = "calc_sum_this_week(1,'OutdoorTdbin',1,'m5')"
        self.alterPoint(live_logic20, sum_this_week_data)
        # 计算上一个小时最大开关的次数
        live_logic19 = "return calc_count_in_day(1,'ChOnOff01','m5',-1)"
        self.alterPoint(live_logic19, '<5')
        # 计算一天最大的值
        ty = datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S")
        today = {"projectId": 1, "pointList": ["OutdoorTdbin"],
                 "timeStart": str(datetime.datetime.now().date()) + " 00:00:00",
                 "timeEnd": ty,
                 "timeFormat": "m5"}
        sum_today = self.postError(history_url, today, t)
        sum_today_data = self.maxResult(sum_today)
        live_logic18 = "return calc_max_in_day(1,'OutdoorTdbin','m5')"
        self.alterPoint(live_logic18, sum_today_data)
        # 计算昨天和今天同时刻的比值
        yesterday, this_day = self.getDay()
        sum_yesterday = self.postError(history_url, yesterday)
        sum_this_day = self.postError(history_url, this_day)
        live_logic17 = "return calc_compare_same_time_diff_day(1,'OutdoorTdbin','m5')"
        sum_this_day_data = self.compareSameTimeDiffDay(sum_yesterday, sum_this_day)
        self.alterPoint(live_logic17, sum_this_day_data)
        # 计算今天的总值
        ty = datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S")
        today = {"projectId": 1, "pointList": ["OutdoorTdbin"],
                 "timeStart": str(datetime.datetime.now().date()) + " 00:00:00",
                 "timeEnd": ty,
                 "timeFormat": "m5"}
        sum_today = self.postError(history_url, today)
        sum_today_data = self.cacResult(sum_today)
        live_logic16 = "return calc_sum_day(1,'OutdoorTdbin',1,'m5')"
        self.alterPoint(live_logic16, sum_today_data)
        # 计算小时和
        hour = {"projectId": 1, "pointList": ["OutdoorTdbin"],
                "timeStart": str(datetime.datetime.now().date()) + " " + str(
                    datetime.datetime.now().hour - 1) + ":00:00",
                "timeEnd": str(datetime.datetime.now().date()) + " " + str(datetime.datetime.now().hour - 1) + ":55:00",
                "timeFormat": "m5"}
        sum_hour = self.postError(history_url, hour)
        sum_hour_data = self.cacResult(sum_hour)
        live_logic15 = "calc_sum_hour(1,'OutdoorTdbin',1,'m5')"
        self.alterPoint(live_logic15, sum_hour_data)
        # 计算机房能效比
        ty = datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S")
        live_logic14 = "calc_eff_smooth(194,'Plant001_Load', 'Plant001_GroupPower')"
        # plant = {"projectId": 194, "pointList": ["Plant001_Eff"],
        #          "timeStart": str(datetime.datetime.now().date()) + " 00:00:00", "timeEnd": ty, "timeFormat": "m5"}
        plant = {"projectId": 194, "current_page": 1, "page_size": "50", "text": "Plant001_Eff", "isAdvance": False,
                 "order": None, "isRemark": False, "flag": None}
        sum_this_plant = self.postError(realtime_url, plant, t)
        sum_this_plant_data = sum_this_plant['list'][0]['value']
        self.alterPoint(live_logic14, round(float(sum_this_plant_data), 2))

        # 计算点修改为公式,验证返回的结果值
        logic2 = "1+2"
        self.alterPoint(logic2, result=3)
        logic3 = "2/1"
        self.alterPoint(logic3, result=2)
        logic4 = "1*2"
        self.alterPoint(logic4, result=2)
        logic5 = "return get_data('sophia5')+get_data('sophia2')"
        self.alterPoint(logic5, result=3)
        logic6 = "return get_data('sophia5')/get_data('sophia2')"
        self.alterPoint(logic6, result=0.5)
        logic7 = "return get_data('sophia5')*get_data('sophia2')"
        self.alterPoint(logic7, result=2)
        logic8 = "return get_data('sophia2')-get_data('sophia5')"
        self.alterPoint(logic8, result=1)
        logic9 = "return get_history_data_of_last_hour(1,'sophia5')"
        self.alterPoint(logic9, result=[1.0] * 13)
        logic10 = "return get_avg_data_of_last_hour(1,'sophia5')"
        self.alterPoint(logic10, result=1)
        logic11 = "return get_status_timeratio_of_last_hour(1,'sophia5',1)"
        self.alterPoint(logic11, result=1)
        logic12 = "calc_power_by_run(1, 'sophia5', 0.1)"
        self.alterPoint(logic12, result=0.1)
        logic13 = "calc_power_by_vsd_run(1, 'sophia5', 1, 0.1)"
        self.alterPoint(logic13, result=0.002)
        logic14 = "calc_power_by_amp(1, 'sophia2', 0.1)"
        self.alterPoint(logic14, result=0.002)
        logic15 = "calc_delta_if_run(1, 'sophia2', 'sophia5','sophia2')"
        self.alterPoint(logic15, result=2.0)
        logic16 = "return calc_max_in_points(1,['sophia5','sophia2'])"
        self.alterPoint(logic16, result=2)
        logic17 = "return calc_min_in_points(1,['sophia5','sophia2'])"
        self.alterPoint(logic17, result=1)
        logic18 = "return calc_sum_in_points(1,['sophia5','sophia2'])"
        self.alterPoint(logic18, result=3)
        logic19 = "return calc_avg_if_run(1,['sophia5','sophia2'],'>0',['sophia5','sophia2'])"
        self.alterPoint(logic19, result=1.5)
        logic20 = "calc_eff_smooth(1,'sophia5', 'sophia2')"
        self.alterPoint(logic20, result=2.00)
        logic21 = "calc_sum_hour(1,'sophia5',1,'m5')"
        self.alterPoint(logic21, result=12.00)
        logic22 = "return calc_max_in_day(1,'sophia5','m5')"
        self.alterPoint(logic22, result=1)

    def cacResult(self, time):  # 这里需要验证一下如果是空的数据
        if 'error' in time.keys() and time['error'] == "historyData" and time['msg'] == "no history data":
            return
        temp = sum(time['data']['OutdoorTdbin'])
        value = round(temp, 2)
        return value

    def maxResult(self, time):
        if 'error' in time.keys() and time['error'] == "historyData" and time['msg'] == "no history data":
            return
        temp = max(time['data']['OutdoorTdbin'])
        value = round(temp, 2)
        return value

    def compareSameTimeDiffDay(self, yes, this):
        if 'error' in yes.keys() and yes[
            'msg'] == "no history data" or ('error' in this.keys() and this[
            'msg'] == "no history data"):
            return
        this = this['data']['OutdoorTdbin'][0]
        yes = yes['data']['OutdoorTdbin'][0]
        temp = (this - yes) / yes * 100
        value = round(temp, 2)
        return value

    def postError(self, url, data, t=30):
        try:
            a = BeopTools()
            value = a.postData(url, data, t)
            return value
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息访问%s接口出现问题,延时超过%d秒") % (url, t)

    # 获取今天和昨天的日期
    def getDay(self):
        now = datetime.datetime.now()
        ty = datetime.datetime.strftime(now, "%Y-%m-%d %H:%M")
        yes0 = now + timedelta(days=-1)
        yes = datetime.datetime.strftime(yes0, "%Y-%m-%d %H:%M")
        yes_hour = yes.split(" ")[1].split(":")[0]
        yes_min = yes.split(" ")[1].split(":")[1]
        ty_hour = ty.split(" ")[1].split(":")[0]
        ty_min = ty.split(" ")[1].split(":")[1]
        ty_m0 = self.comHM(ty_min[1])
        yes_m0 = self.comHM(yes_min[1])
        yes = str(yes0.date()) + " " + yes_hour + ":" + yes_min[0] + yes_m0
        ty = str(now.date()) + " " + ty_hour + ":" + ty_min[0] + ty_m0
        yesterday = {"projectId": 1, "pointList": ["OutdoorTdbin"], "timeStart": yes + ":00", "timeEnd": yes + ":00",
                     "timeFormat": "m5"}
        this_day = {"projectId": 1, "pointList": ["OutdoorTdbin"], "timeStart": ty + ":00", "timeEnd": ty + ":00",
                    "timeFormat": "m5"}
        return (yesterday, this_day)

    # 获取本周一的时间
    def getwWeekMon(self):
        now = datetime.datetime.now()
        day = now.isoweekday()
        ty = datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S")
        if day == 7:
            mon = now + timedelta(days=-6)
        elif day == 6:
            mon = now + timedelta(days=-5)
        elif day == 5:
            mon = now + timedelta(days=-4)
        elif day == 4:
            mon = now + timedelta(days=-3)
        elif day == 3:
            mon = now + timedelta(days=-2)
        elif day == 2:
            mon = now + timedelta(days=-1)
        else:
            mon = now
        this_week = {"projectId": 1, "pointList": ["OutdoorTdbin"], "timeStart": str(mon.date()) + " 00:00:00",
                     "timeEnd": ty,
                     "timeFormat": "m5"}
        return this_week

    def comHM(self, h):
        if (int(h) > 0 and int(h) < 5):
            h0 = 0
        elif (int(h) > 5 and int(h) < 9):
            h0 = 5
        else:
            h0 = int(h)
        return str(h0)

    # 比较返回过来的值和预期的值是否相等
    def compareValue(self, value1, value2):
        epsinon = 0.0000001
        if "<" in str(value2):
            value = value2.split("<")[1]
            if (float(value) - float(value1) <= 5):
                return True
            else:
                return False

        if "+" in str(value2):
            value = value2.split("+")[0]
            if (abs(float(value1) - float(value)) <= 0.5):
                return True
            else:
                return False
        else:
            # 比较两浮点是否相等
            if (abs(float(value1) - float(value2)) <= epsinon):
                return True
            else:
                return False

    def isWhichNum(self):
        now = datetime.datetime.now()
        ee = datetime.datetime(2016, 5, 2)
        num = (now - ee).days
        value = num / 7
        if (value != 0):
            return -(int(value))

    def raiseError(self):

        if self.errors != []:
            assert 0, "\n".join(self.errors)
        else:
            pass

    def tearDown(self):
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

