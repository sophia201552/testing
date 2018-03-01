#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

@pytest.mark.p0
def test_get_real_time():
    now_time = datetime.now()
    lb = LogicBase(49, now_time, LogicBase.REALTIME)
    assert lb, "create instance LogicBase failed"
    assert lb.get_act_time() == now_time, "get_act_time error:input time is not equal to instance time"
    assert lb._nMode == LogicBase.REALTIME, "get_act_time error:run mode should be 0 when input time is now time"

@pytest.mark.p0
def test_get_history_time():
    history_time = datetime(year=2017, month=10, day=1)
    lb = LogicBase(49, history_time, nMode=LogicBase.REPAIR_HISTORY)
    assert lb, "create instance LogicBase failed"
    assert lb.get_act_time() == history_time, "get_act_time error:input time is not equal to instance time"
    assert lb._nMode == LogicBase.REPAIR_HISTORY, "get_act_time error:run mode should be 1 when input time is history time"

@pytest.mark.p0
def test_get_real_test_time():
    now_time = datetime.now()
    lb = LogicBase(49, now_time, nMode=LogicBase.ONLINE_TEST_REALTIME)
    assert lb, "create instance LogicBase failed"
    assert lb.get_act_time() == now_time, "get_act_time error:input time is not equal to instance time"
    assert lb._nMode == LogicBase.ONLINE_TEST_REALTIME, "get_act_time error:run mode should be 2 when input time is now test time"

@pytest.mark.p0
def test_get_history_test_time():
    history_time = datetime(year=2017, month=10, day=1)
    lb = LogicBase(49, history_time, nMode=LogicBase.ONLINE_TEST_HISTORY)
    assert lb, "create instance LogicBase failed"
    assert lb.get_act_time() == history_time, "get_act_time error:input time is not equal to instance time"
    assert lb._nMode == LogicBase.ONLINE_TEST_HISTORY, "get_act_time error:run mode should be 3 when input time is history test time"