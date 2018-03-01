#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
import datetime
import pytest

@pytest.mark.p0
def test_get_time():
    test_time = datetime.datetime(year=2017, month=10, day=31)
    lb = LogicBase(49, test_time)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_week_begin() == "2017-10-30 00:00:00",\
        "time_get_week_begin error:input time is not equal to instance time"

@pytest.mark.p0
def test_get_time_with_str():
    test_time = datetime.datetime(year=2017, month=10, day=31)
    test_time_str=test_time.strftime('%Y-%m-%d %H:%M:%S')
    lb = LogicBase(49, test_time_str)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_week_begin() == "2017-10-30 00:00:00",\
        "time_get_week_begin error:input time is not equal to instance time"


@pytest.mark.p0
def test_get_time_with_str_wrong():
    test_time = datetime.datetime(year=2017, month=10, day=31)
    test_time_str=test_time.strftime('%Y-%m-%d %H:%M')
    lb = LogicBase(49, test_time_str)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_week_begin() == None,\
        "time_get_week_begin error:input wrong format of time is not equal to None"