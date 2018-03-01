#coding=utf-8
__author__ = 'angelia'

import pytest
import datetime
import random
from ExpertContainer.logic.LogicBase import LogicBase
from tests.utils import *

projId = 49
pointName = ["test_sitePoint02", "test_virtualPoint02", "test_calcPoint02"]
valueList = [random.randint(1,100), random.randint(100,200), random.randint(200,300)]
test_time=[
    datetime.datetime(year=2017, month=11, day=20, hour=10),
    datetime.datetime(year=2017,month=9,day=12,hour=8),
        ]
@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointList', 'strTime', 'strValue'),[
    (projId,pointName[0],test_time[0], valueList[0]),
    (projId,pointName[0],test_time[1], valueList[2]),
    (projId,pointName[1],test_time[0], valueList[1]),
    (projId,pointName[1],test_time[1], valueList[2]),
    (projId,pointName[2],test_time[0], valueList[2]),
    (projId,pointName[2],test_time[1], valueList[1]),
])
def test_set_data_history_of_this_point(projId, pointList, strTime, strValue):
    lb = LogicBase(projId, datetime.datetime.now(), nMode = LogicBase.REALTIME)
    if lb:
        lb.curCalName = pointList#传入点名
        rt = lb.set_data_history_of_this_point(strTime, strValue)
        assert rt, "get set_data_history_of_this_point result failed"
        if isinstance(strTime,str):
            strTime=datetime.datetime.strptime(strTime, '%Y-%m-%d %H:%M:%S')
        actual=lb.get_data_at_time(projId, [pointList], strTime.strftime("%Y-%m-%d %H:%M:%S"))
        assert actual,'actual is none'
        assert None not in actual,'actual is none'
        for index, item in enumerate(actual):
            if isinstance(item, str):
                assert item == str(strValue), "index = %s, expected value is %s, actual value is %s" % (
                index, strValue, item)
            elif isinstance(item, float):
                assert almost_equals(item, float(strValue)), "index = %s, expected value is %s, actual value is %s" % (
                index, strValue, item)
    else:
        assert False, "create instance failed"

@pytest.mark.p0
@pytest.mark.parametrize(('projId','strPointName', 'strTime','strValue'),[
    (None,None,None,None),
])
def test_wrong(projId,strPointName, strTime,strValue):
    lb = LogicBase(projId, strTime)
    assert lb, "create instance failed"
    rt = lb.set_data_history(strPointName, strTime, strValue)
    assert not rt, 'set_data_history: return value is not False'
