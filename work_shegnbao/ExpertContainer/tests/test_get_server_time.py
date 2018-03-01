#coding=utf-8
__author__ = 'angelia'

from ExpertContainer.logic.LogicBase import LogicBase
import datetime
import pytest

#check china
@pytest.mark.p2
def test_get_server_time_E8():
    now_time = datetime.datetime.now()
    lb = LogicBase(49, now_time, nMode= LogicBase.ONLINE_TEST_HISTORY)
    assert lb, "create instance logic base failed"
    differ = abs(lb.get_server_time() - now_time).seconds
    assert differ <= 30, "get_server_time error:server time is %s, which differs from real time %s" % (lb.get_server_time(), now_time)

#check liverpoolstreet
@pytest.mark.p2
def test_get_server_time_E10():
    nGMT = 10
    now_time = datetime.datetime.now()
    lb = LogicBase(293, now_time)
    actual_project_time = lb.get_server_time(nGMT)
    project_time = now_time + datetime.timedelta(hours = nGMT - 8)
    differ = abs(actual_project_time - project_time).seconds
    assert lb, "create instance logic base failed"
    assert actual_project_time, "get actual project time from logic base failed"
    assert differ <= 30, "get_server_time error:server time is %s, which differs from real time %s" % (actual_project_time, project_time)

#check miami
@pytest.mark.p2
def test_get_server_time_W5():
    nGMT = -5
    now_time = datetime.datetime.now()
    lb = LogicBase(674, now_time)
    actual_project_time = lb.get_server_time(nGMT)
    project_time = now_time + datetime.timedelta(hours = nGMT - 8)
    differ = abs(actual_project_time - project_time).seconds
    assert lb, "create instance logic base failed"
    assert actual_project_time, "get actual project time from logic base failed"
    assert differ <= 30, "get_server_time error:server time is %s, which differs from real time %s" % (actual_project_time, project_time)