#coding=utf-8
__author__ = 'angelia'

import pytest
import datetime
from ExpertContainer.logic.LogicBase import LogicBase

#unfinished
@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointName','act_time', 'expected'),[
    (49,'GDdymi7S',"2017-11-02 16:01:00", ("2017-11-02 16:00:00", 456)),
    (49,'BP3r9eHX',"2017-11-02 16:01:00", ("2017-11-02 16:00:00", 4562)),
    (49,'test_calcPoint05',"2017-11-10 16:00:00", (None,None)),
    (49,'GDdymi7S',"2017-08-10 00:00:00", ("2017-08-03 00:04:00", 455))
])
def test_get_last_update_time_value(projId, act_time, pointName,expected):
    if type(act_time) == str:
        act_time = datetime.datetime.strptime(act_time,"%Y-%m-%d %H:%M:%S")
    lb = LogicBase(projId, act_time, nMode = LogicBase.REALTIME)
    rt = lb.get_last_update_time_value(projId, pointName)
    assert expected, "expected is None"
    if rt:
        if expected[0] is None and expected[1] is None:
            assert expected == rt, "expected point has not result,but actual got %s" % rt
        else:
            last_time = datetime.datetime.strptime(expected[0],"%Y-%m-%d %H:%M:%S")
            last_time_actual = rt[0]
            value = expected[1]
            value_actual = rt[1]
            assert last_time == last_time_actual, "%s:actual last update time is %s,which differs from %s" %(pointName, last_time_actual, last_time)
            assert value == value_actual, "%s:actual last update value is %s,which differs from %s" %(pointName, value_actual, value)
    else:
        assert False, "create instance failed"
