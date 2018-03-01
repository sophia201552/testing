#coding=utf-8
__author__ = 'sophia'
from ExpertContainer.logic.LogicBase import LogicBase
import datetime
import pytest

test_time = datetime.datetime.now()
@pytest.mark.p0
@pytest.mark.parametrize(('initTime', 'expectedTime'),[
    (test_time,test_time.strftime('%Y-%m-%d 00:00:00')),
    (test_time.strftime('%Y-%m-%d %H:%M:%S'),test_time.strftime('%Y-%m-%d 00:00:00')),
])
def test_get_time(initTime,expectedTime):
    lb = LogicBase(49, initTime)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_day_begin() == expectedTime,\
        "time_get_day_begin error:input time is not equal to instance time"

@pytest.mark.p0
def test_get_time_with_str_wrong():
    test_time = datetime.datetime.now()
    test_time_str=test_time.strftime('%Y-%m-%d %H:%M')
    lb = LogicBase(49, test_time_str)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_day_begin() == None,\
        "time_get_day_begin error:input wrong format of time is not equal to None"