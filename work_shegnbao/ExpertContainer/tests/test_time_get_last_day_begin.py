#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
import datetime
import pytest

@pytest.mark.p0
def test_get_real_time_for_datetime():
    now_time = datetime.datetime.now()
    lb = LogicBase(49, now_time, nMode=LogicBase.REALTIME)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_last_day_begin() == (now_time-datetime.timedelta(days=1)).strftime('%Y-%m-%d 00:00:00'),\
        "time_get_last_day_begin error:input time is not equal to instance time"
    assert lb._nMode == LogicBase.REALTIME, "time_get_last_day_begin error:run mode should be 0 when input time is now time"

@pytest.mark.p0
def test_get_history_time_for_datetime():
    history_time = datetime.datetime(year=2017, month=10, day=1)
    lb = LogicBase(49, history_time, nMode=LogicBase.REPAIR_HISTORY)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_last_day_begin() == (history_time-datetime.timedelta(days=1)).strftime('%Y-%m-%d 00:00:00'),\
        "time_get_last_day_begin error:input time is not equal to instance time"
    assert lb._nMode == LogicBase.REPAIR_HISTORY, "time_get_last_day_begin error:run mode should be 1 when input time is history time"

@pytest.mark.p0
def test_get_real_test_time_for_datetime():
    now_time = datetime.datetime.now()
    lb = LogicBase(49, now_time, nMode=LogicBase.ONLINE_TEST_REALTIME)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_last_day_begin() == (now_time-datetime.timedelta(days=1)).strftime('%Y-%m-%d 00:00:00'),\
        "time_get_last_day_begin error:input time is not equal to instance time"
    assert lb._nMode == LogicBase.ONLINE_TEST_REALTIME, "time_get_last_day_begin error:run mode should be 2 when input time is now test time"

@pytest.mark.p0
def test_get_history_test_time_for_datetime():
    history_time = datetime.datetime(year=2017, month=10, day=1)
    lb = LogicBase(49, history_time, nMode=LogicBase.ONLINE_TEST_HISTORY)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_last_day_begin() == (history_time-datetime.timedelta(days=1)).strftime('%Y-%m-%d 00:00:00'),\
        "time_get_last_day_begin error:input time is not equal to instance time"
    assert lb._nMode == LogicBase.ONLINE_TEST_HISTORY, "time_get_last_day_begin error:run mode should be 3 when input time is history test time"

@pytest.mark.p0
def test_get_real_time_for_str():
    now_time = datetime.datetime.now()
    now_time_str=now_time.strftime('%Y-%m-%d %H:%M:%S')
    lb = LogicBase(49, now_time_str, nMode=LogicBase.REALTIME)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_last_day_begin() == (now_time-datetime.timedelta(days=1)).strftime('%Y-%m-%d 00:00:00'),\
        "time_get_last_day_begin error:input time is not equal to instance time"
    assert lb._nMode == LogicBase.REALTIME, "time_get_last_day_begin error:run mode should be 0 when input time is now time"

@pytest.mark.p0
def test_get_history_time_for_str():
    history_time = datetime.datetime(year=2017, month=10, day=1)
    history_time_str=history_time.strftime('%Y-%m-%d %H:%M:%S')
    lb = LogicBase(49, history_time_str, nMode=LogicBase.REPAIR_HISTORY)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_last_day_begin() == (history_time-datetime.timedelta(days=1)).strftime('%Y-%m-%d 00:00:00'),\
        "time_get_last_day_begin error:input time is not equal to instance time"
    assert lb._nMode == LogicBase.REPAIR_HISTORY, "time_get_last_day_begin error:run mode should be 1 when input time is history time"

@pytest.mark.p0
def test_get_real_test_time_for_str():
    now_time = datetime.datetime.now()
    now_time_str=now_time.strftime('%Y-%m-%d %H:%M:%S')
    lb = LogicBase(49, now_time_str, nMode=LogicBase.ONLINE_TEST_REALTIME)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_last_day_begin() == (now_time-datetime.timedelta(days=1)).strftime('%Y-%m-%d 00:00:00'),\
        "time_get_last_day_begin error:input time is not equal to instance time"
    assert lb._nMode == LogicBase.ONLINE_TEST_REALTIME, "time_get_last_day_begin error:run mode should be 2 when input time is now test time"

@pytest.mark.p0
def test_get_history_test_time_for_str():
    history_time = datetime.datetime(year=2017, month=10, day=1)
    history_time_str = history_time.strftime('%Y-%m-%d %H:%M:%S')
    lb = LogicBase(49, history_time_str, nMode=LogicBase.ONLINE_TEST_HISTORY)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_last_day_begin() == (history_time-datetime.timedelta(days=1)).strftime('%Y-%m-%d 00:00:00'),\
        "time_get_last_day_begin error:input time is not equal to instance time"
    assert lb._nMode == LogicBase.ONLINE_TEST_HISTORY, "time_get_last_day_begin error:run mode should be 3 when input time is history test time"

@pytest.mark.p0
def test_get_time_with_str_wrong():
    test_time = datetime.datetime.now()
    test_time_str=test_time.strftime('%Y-%m-%d %H:%M')
    lb = LogicBase(49, test_time_str)
    assert lb, "create instance LogicBase failed"
    assert lb.time_get_last_day_begin() == None,\
        "time_get_hour_begin error:input time is not equal to instance time"