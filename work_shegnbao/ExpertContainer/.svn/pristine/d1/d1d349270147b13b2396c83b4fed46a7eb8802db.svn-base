# coding=utf-8
__author__ = 'sophia'
from ExpertContainer.logic.LogicBase import LogicBase
import datetime
import pytest
import random
from ExpertContainer.api.api import HistoryDataMethods
from tests.utils import *

pointname=['testp1','testp2','testp3']
proj = 49
test_time = [
    datetime.datetime(year=2017, month=11, day=15, hour=13, minute=18),#m1
    datetime.datetime(year=2017, month=11, day=12, hour=13, minute=15),#m5
    datetime.datetime(year=2017, month=11, day=14, hour=12),#h1
    datetime.datetime(year=2017, month=11, day=13),#d1
    datetime.datetime(year=2017, month=11,day=1,hour=1),#M1
    datetime.datetime(year=2017, month=8, day=2, hour=15).strftime('%Y-%m-%d %H:%M:%S'),#string
    datetime.datetime(year=2017, month=8, day=3, hour=13, minute=18),  # m1
    datetime.datetime(year=2017, month=8, day=4, hour=13, minute=15),  # m5
    datetime.datetime(year=2017, month=8, day=5, hour=12),  # h1
    datetime.datetime(year=2017, month=8, day=6),  # d1
    datetime.datetime(year=2017, month=8, day=1, hour=1),  # M1

]

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'timeFormat', 'pointNameList', 'pointValueList', 'pointTimeLabelList','mode'), [
    # timeformat=m5 different mode insert to v2_beopdata
    (proj, 'm5', pointname, [random.randint(1,300)]*len(pointname), [test_time[1]]*len(pointname), LogicBase.REALTIME),
    (proj, 'm5', pointname, [random.randint(1,300)]*len(pointname), [test_time[1]]*len(pointname), LogicBase.REPAIR_HISTORY),
    (proj, 'm5', pointname, [random.randint(1,300)]*len(pointname), [test_time[1]]*len(pointname),LogicBase.ONLINE_TEST_REALTIME),
    (proj, 'm5', pointname, [random.randint(1,300)]*len(pointname), [test_time[1]]*len(pointname),LogicBase.ONLINE_TEST_HISTORY),
    # timeformat=h1 different mode
    (proj, 'h1', pointname, [random.randint(1,300)]*len(pointname), [test_time[2]]*len(pointname), LogicBase.REALTIME),
    (proj, 'h1', pointname, [random.randint(1,300)]*len(pointname), [test_time[2]]*len(pointname), LogicBase.REPAIR_HISTORY),
    (proj, 'h1', pointname, [random.randint(1,300)]*len(pointname), [test_time[2]]*len(pointname), LogicBase.ONLINE_TEST_REALTIME),
    (proj, 'h1', pointname, [random.randint(1,300)]*len(pointname),[test_time[2]]*len(pointname), LogicBase.ONLINE_TEST_HISTORY),
    # timeformat=d1 different mode
    (proj, 'd1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[3]] * len(pointname),LogicBase.REALTIME),
    (proj, 'd1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[3]] * len(pointname), LogicBase.REPAIR_HISTORY),
    (proj, 'd1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[3]] * len(pointname), LogicBase.ONLINE_TEST_REALTIME),
    (proj, 'd1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[3]] * len(pointname),LogicBase.ONLINE_TEST_HISTORY),
    # timeformat=M1 different mode
    (proj, 'M1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[4]] * len(pointname),LogicBase.REALTIME),
    (proj, 'M1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[4]] * len(pointname), LogicBase.REPAIR_HISTORY),
    (proj, 'M1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[4]] * len(pointname), LogicBase.ONLINE_TEST_REALTIME),
    (proj, 'M1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[4]] * len(pointname),LogicBase.ONLINE_TEST_HISTORY),
    # string in pointTimeLabelList which is in m5_beopdata table
    (proj, 'h1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[5]] * len(pointname), LogicBase.REPAIR_HISTORY),
    # timeformat=m5 different mode
    (proj, 'm5', pointname, [random.randint(1,300)]*len(pointname), [test_time[7]]*len(pointname), LogicBase.REALTIME),
    (proj, 'm5', pointname, [random.randint(1,300)]*len(pointname), [test_time[7]]*len(pointname), LogicBase.REPAIR_HISTORY),
    (proj, 'm5', pointname, [random.randint(1,300)]*len(pointname), [test_time[7]]*len(pointname),LogicBase.ONLINE_TEST_REALTIME),
    (proj, 'm5', pointname, [random.randint(1,300)]*len(pointname), [test_time[7]]*len(pointname),LogicBase.ONLINE_TEST_HISTORY),
    # timeformat=h1 different mode
    (proj, 'h1', pointname, [random.randint(1,300)]*len(pointname), [test_time[8]]*len(pointname), LogicBase.REALTIME),
    (proj, 'h1', pointname, [random.randint(1,300)]*len(pointname), [test_time[8]]*len(pointname), LogicBase.REPAIR_HISTORY),
    (proj, 'h1', pointname, [random.randint(1,300)]*len(pointname), [test_time[8]]*len(pointname), LogicBase.ONLINE_TEST_REALTIME),
    (proj, 'h1', pointname, [random.randint(1,300)]*len(pointname),[test_time[8]]*len(pointname), LogicBase.ONLINE_TEST_HISTORY),
    # timeformat=d1 different mode
    (proj, 'd1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[9]] * len(pointname),LogicBase.REALTIME),
    (proj, 'd1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[9]] * len(pointname), LogicBase.REPAIR_HISTORY),
    (proj, 'd1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[9]] * len(pointname), LogicBase.ONLINE_TEST_REALTIME),
    (proj, 'd1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[9]] * len(pointname),LogicBase.ONLINE_TEST_HISTORY),
    # timeformat=M1 different mode
    (proj, 'M1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[10]] * len(pointname),LogicBase.REALTIME),
    (proj, 'M1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[10]] * len(pointname), LogicBase.REPAIR_HISTORY),
    (proj, 'M1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[10]] * len(pointname), LogicBase.ONLINE_TEST_REALTIME),
    (proj, 'M1', pointname, [random.randint(1, 300)] * len(pointname), [test_time[10]] * len(pointname),LogicBase.ONLINE_TEST_HISTORY),
])
def test_correct(projId, timeFormat, pointNameList, pointValueList, pointTimeLabelList,mode):
    lb = LogicBase(projId, pointTimeLabelList, nMode=mode)
    assert lb, "create instance failed"
    rt = lb.set_data_time_range(projId, timeFormat, pointNameList, pointValueList, pointTimeLabelList)
    assert rt, 'set_data_time_range: return value is False'


    if isinstance(pointTimeLabelList[0],str):
        pointTimeLabelList[0]=datetime.datetime.strptime(pointTimeLabelList[0], '%Y-%m-%d %H:%M:%S')

    # get history data in mongo
    actual_mongo = lb.get_data_at_time(projId, pointNameList, pointTimeLabelList[0].strftime("%Y-%m-%d %H:%M:%S"))
    assert actual_mongo,'actual is none'
    assert None not in actual_mongo,'actual is none'
    for index, item in enumerate(actual_mongo):
        if isinstance(item, str):
            assert item == str(pointValueList[index]), "index = %s, expected value is %s, actual value is %s" % (
                index, pointValueList[index], item)
        elif isinstance(item, float):
            assert almost_equals(item,float(pointValueList[index])), "index = %s, expected value is %s, actual value is %s" % (
                index, pointValueList[index], item)

    if isinstance(pointTimeLabelList[0],datetime.datetime):
        pointTimeLabelList[0]=pointTimeLabelList[0].strftime('%Y-%m-%d %H:%M:%S')

    #delete mongo test  data
    for pointname in pointNameList:
        assert lb.delete_one_record(projId, pointname,pointTimeLabelList[0]), "failed to delete history test data"

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'timeFormat', 'pointNameList', 'pointValueList', 'pointTimeLabelList','mode'), [
    (proj, 'h1', pointname, [1],[test_time[5]], LogicBase.REPAIR_HISTORY),
    (-1, 'h1', pointname, [1]*len(pointname),[test_time[5]]*len(pointname), LogicBase.REPAIR_HISTORY),
])
def test_wrong(projId, timeFormat, pointNameList, pointValueList, pointTimeLabelList,mode):
    lb = LogicBase(projId, pointTimeLabelList,mode)
    assert lb, "create instance failed"
    rt = lb.set_data_time_range(projId, timeFormat, pointNameList, pointValueList, pointTimeLabelList)
    assert not rt, 'set_data_time_range: return value is not False'


