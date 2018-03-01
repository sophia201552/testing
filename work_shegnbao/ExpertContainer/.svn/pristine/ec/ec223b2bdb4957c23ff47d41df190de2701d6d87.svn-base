#coding=utf-8
__author__ = 'sophia'
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointname','status'),[
    (72,'ChAMPS01',8),
    ('72','ChAMPS01',8),
    ('72','A11AHU_A_11_DmprEaCtrl',0),
    (72,'A11AHU_A_11_DmprEaCtrl',0),
])
def test_changed(projId, pointname,status):
    lb = LogicBase(projId, datetime(year=2017,month=8,day=2,hour=12))
    assert lb, "create instance failed"
    rt = lb.get_status_change_of_last_hour(projId, pointname)
    assert rt==status, 'get_status_change_of_last_hour :projId:%s,pointname:%s,expected is %s ,actual got status is  %s' %\
                       (projId, pointname,status,rt)

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointname'),[
    (72,'A11AHU_A_11_DmprEaCtrl222'),
    (72,''),
    (72, ['A11AHU_A_11_DmprEaCtrl', 'AllRoom_OverHeat_svr']),
])
def test_wrong(projId, pointname):
    lb = LogicBase(projId, datetime(year=2017,month=8,day=2,hour=12))
    assert lb, "create instance failed"
    rt = lb.get_status_change_of_last_hour(projId, pointname)
    assert not rt, 'get_status_change_of_last_hour :projId:%s,pointname:%s got value is  not 0' % (projId, pointname)






