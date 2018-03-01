# coding=utf-8
__author__ = 'sophia'
from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.api.api import HistoryDataMethods
from tests.utils import *
import datetime
import pytest
import random
import time

test_time = [
    datetime.datetime(year=2017, month=11, day=11, hour=12),
    datetime.datetime(year=2017, month=11, day=12, hour=13, minute=15),
    datetime.datetime(year=2017, month=11, day=13),
    datetime.datetime(year=2017, month=11, day=14, hour=15),
    datetime.datetime(year=2017, month=8, day=2, hour=12),
]
proj = 49


@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointList', 'testTime', 'valueList', 'flag', 'mode'), [
    # v2_data_beopdata table
    # different time format for flag=0 mode=0:timeformat in (m5,h1,d1)
    (proj, 'test_v2_1', test_time[0], random.randint(1, 100), 0, LogicBase.REALTIME),
    (proj, 'test_v2_2', test_time[1], random.randint(1, 100), 0, LogicBase.REALTIME),
    (proj, 'test_v2_3', test_time[2], random.randint(1, 100), 0, LogicBase.REALTIME),
    # different flag as mode=0
    (proj, 'test_v2_5', test_time[0], random.randint(1, 100), 1, LogicBase.REALTIME),
    (proj, 'test_v2_6', test_time[0], random.randint(1, 100), 2, LogicBase.REALTIME),

    # # different flag  as mode=2
    (proj, 'test_v2_7', test_time[0], random.randint(1, 100), 0, LogicBase.ONLINE_TEST_REALTIME),
    (proj, 'test_v2_8', test_time[0], random.randint(1, 100), 1, LogicBase.ONLINE_TEST_REALTIME),
    (proj, 'test_v2_9', test_time[0], random.randint(1, 100), 2, LogicBase.ONLINE_TEST_REALTIME),

    # pointList as flag=0
    (proj, ['test_v2_0_1','test_v2_0_2'], test_time[3], [random.randint(1, 100)] * 2, 0, LogicBase.REALTIME),
    # pointList as flag=1
    (proj, ['test_v2_0_3','test_v2_0_4'], test_time[3], [random.randint(1, 100)] * 2, 1, LogicBase.REALTIME),
    # pointList as flag=2
    (proj, ['test_v2_0_5','test_v2_0_6'], test_time[3], [random.randint(1, 100)] * 2, 1, LogicBase.REALTIME),

    # m5_data_beopdata table
    # different flag  as mode=0
    (proj, 'test_m5_1', test_time[4], random.randint(1, 100), 0, LogicBase.REALTIME),
    (proj, 'test_m5_2', test_time[4], random.randint(1, 100), 1, LogicBase.REALTIME),
    (proj, 'test_m5_3', test_time[4], random.randint(1, 100), 2, LogicBase.REALTIME),

    # different flag  as mode=2
    (proj, 'test_m5_4', test_time[4], random.randint(1, 100), 0, LogicBase.ONLINE_TEST_REALTIME),
    (proj, 'test_m5_5', test_time[4], random.randint(1, 100), 1, LogicBase.ONLINE_TEST_REALTIME),
    (proj, 'test_m5_6', test_time[4], random.randint(1, 100), 2, LogicBase.ONLINE_TEST_REALTIME),

    # pointList as flag=0
    (proj, ['test_m5_0_1','test_m5_0_2'], test_time[4], [random.randint(1, 100)] * 2, 0, LogicBase.REALTIME),
    # pointList as flag=1
    (proj, ['test_m5_0_3','test_m5_0_4'], test_time[4], [random.randint(1, 100)] * 2, 1, LogicBase.REALTIME),
    # pointList as flag=2
    (proj, ['test_m5_0_5','test_m5_0_6'], test_time[4], [random.randint(1, 100)] * 2, 1, LogicBase.REALTIME),

])
def test_correct(projId, pointList, testTime, valueList, flag, mode):
    lb = LogicBase(projId, testTime, nMode=mode)
    assert lb, "create instance failed"
    if isinstance(valueList, int):
        valueList = str(valueList)
    rt = lb.set_data(projId, pointList, valueList, flag)
    assert rt, 'set_data: return value is False'
    # 判断buffer数据库有没有更新
    if isinstance(pointList, str):
        pointList = [pointList]
        valueList = [valueList]

    actual_buffer = BEOPDataAccess.getInstance().getBufferRTDataWithTimeByProj(projId, pointList)
    assert_mysqlbuffer_data(pointList, testTime, valueList, actual_buffer)

    # 判断cache有没有更新
    actual_cache = DataManager.get_realtime_data(projId, pointList)
    assert_cache_data(pointList, valueList, actual_cache)

    # 判断mongo数据库有没有更新
    actual_mongo = lb.get_data_at_time(projId, pointList, testTime.strftime("%Y-%m-%d %H:%M:%S"))
    assert actual_mongo,'actual is none'
    assert None not in actual_mongo,'actual is none'
    for index, item in enumerate(actual_mongo):
        if isinstance(item, str):
            assert item == str(valueList[index]), "index = %s, expected value is %s, actual value is %s" % (
            index, valueList[index], item)
        elif isinstance(item, float):
            assert almost_equals(item, float(valueList[index])), "index = %s, expected value is %s, actual value is %s" % (
            index, valueList[index], item)

    # 删除buffer数据和mongo数据
    if flag == 0 or flag == 2:
        assert BEOPDataAccess.getInstance().deletePointFromBufferData(projId,pointList), "failed to delete real test data"
    else:
        assert BEOPDataAccess.getInstance().deletePointFromBufferData(projId, pointList,'vpoint'), "failed to delete real test data"
    for pointname in pointList:
        assert lb.delete_one_record(projId, pointname,testTime.strftime("%Y-%m-%d %H:%M:%S")), "failed to delete history test data"


@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointList', 'testTime', 'valueList', 'flag', 'mode'), [
    (None, None, None, None, None, None),
    (-1,'test_m5_11',test_time[0],random.randint(1,100),0,LogicBase.REALTIME),
    (proj, 'test_m5_11', None, random.randint(1, 100), 0, LogicBase.REALTIME)
])
def test_wrong(projId, pointList, testTime, valueList, flag, mode):
    lb = LogicBase(projId, testTime, mode)
    assert lb, "create instance failed"
    rt = lb.set_data(projId, pointList, valueList, flag)
    assert not rt, 'set_data: return value is not False'
