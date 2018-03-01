#coding=utf-8
__author__ = 'angelia'

import pytest
import datetime
from ExpertContainer.logic.LogicBase import LogicBase

test_time = [datetime.datetime(year=2017, month=11, day=20, hour=10, minute = 12, second = 12),
             ]
@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'EnterEvapPointName', 'LeaveEvapPointName', 'flowPointName','OnOffPointName','acttime','expected'),[
    (539,'xiqu_CHW_SupplyT_01','xiqu_CHW_ReturnT_01','xiqu_CHW_Flow','xiqu_ChGroup_RunNum',test_time[0], 0),
    (539,'xiqu_CHW_ReturnT_01','xiqu_CHW_SupplyT_01','xiqu_CHW_Flow','xiqu_CHW_ReturnT_01',test_time[0], None),
    (539,'T1_1025','xiqu_CHW_SupplyT_01','xiqu_CHW_Flow','xiqu_ChGroup_RunNum',test_time[0], None),
    (539,'xiqu_CHW_ReturnT_01','T1_1025','xiqu_CHW_Flow','xiqu_ChGroup_RunNum',test_time[0], None),
    (539,'xiqu_CHW_ReturnT_01','xiqu_CHW_SupplyT_01','xiqu_CHW_Flow','xiqu_ChGroup_RunNum',test_time[0], None),
    (539,'xiqu_CHW_ReturnT_01','xiqu_CHW_SupplyT_01','T1_1033','xiqu_ChGroup_RunNum',test_time[0], None)
])
def test_calc_load_w_flow(projId, EnterEvapPointName, LeaveEvapPointName, flowPointName, OnOffPointName, acttime,expected):
    lb = LogicBase(projId, acttime ,nMode = LogicBase.REPAIR_HISTORY)
    if lb:
        rt = lb.calc_load_w_flow(projId, EnterEvapPointName, LeaveEvapPointName, flowPointName, OnOffPointName)
        if expected is None and rt is None :
            return
        else:
            assert rt == expected, 'actual calc subtraction given time is %s,which differs from expected %s' %(rt, expected)
    else:
        assert False, 'create instance failed'


