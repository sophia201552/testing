#coding=utf-8
__author__ = 'angelia'


from ExpertContainer.logic.LogicBase import LogicBase
import datetime
import pytest

#check point is usually normal everyday
@pytest.mark.p2
def test_get_lost_time_ratio_of_today_on():
    pointName = 'web_outdoorTemp'
    projId = 49
    now_time = datetime.datetime.now()
    lb = LogicBase(projId, now_time)
    assert lb, "create instance logic base failed"
    lost_ratio = lb.get_lost_time_ratio_of_today(projId , pointName)
    assert lost_ratio >= 0 and lost_ratio <= 1, "%s: the point %s is in range of 0-1, but actual get %s" %(projId, pointName, lost_ratio)

#check droppend point
@pytest.mark.p2
def test_get_lost_time_ratio_of_today_out():
    pointName = 'PHW_ByPassTemp_05'
    projId = 49
    now_time = datetime.datetime.now()
    lb = LogicBase(projId, now_time)
    assert lb, "create instance logic base failed"
    lost_ratio = lb.get_lost_time_ratio_of_today(projId , pointName)
    assert lost_ratio == 1, "%s: the point %s is out of date,but actual get %s" %(projId, pointName, lost_ratio)

#check part time of point is online everyday
@pytest.mark.p2
def test_get_lost_time_ratio_of_today_part():
    pointName = 'SHHH17'
    projId = 374
    now_time = datetime.datetime.now()
    lb = LogicBase(projId, now_time)
    assert lb, "create instance logic base failed"
    lost_ratio = lb.get_lost_time_ratio_of_today(projId , pointName)
    assert lost_ratio >= 0 and lost_ratio <= 1, "%s: the point %s is in range of 0-1, but actual get %s" %(projId, pointName, lost_ratio)