#coding=utf-8
__author__ = 'sophia'
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointname','avg'),[
    (72,'ChAMPS01',93.36153846153846),
    ('72','ChAMPS01',93.36153846153846),
    ('72','A11AHU_A_11_DmprEaCtrl',0.0),
    (72,'A11AHU_A_11_DmprEaCtrl',0.0),
])
def test_correct(projId, pointname,avg):
    lb = LogicBase(projId, datetime(year=2017,month=8,day=2,hour=12))
    assert lb, "create instance failed"
    rt = lb.get_avg_data_of_last_hour(projId, pointname)
    assert rt==avg, 'get_avg_data_of_last_hour :projId:%s,pointname:%s,expected value is %s ,actual got value is %s' %\
                       (projId, pointname,avg,rt)

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointname'),[
    (72,'A11AHU_A_11_DmprEaCtrl222'),
    (72,''),
    (72, ['A11AHU_A_11_DmprEaCtrl', 'AllRoom_OverHeat_svr']),
])
def test_wrong(projId, pointname):
    lb = LogicBase(projId, datetime(year=2017,month=8,day=2,hour=12))
    assert lb, "create instance failed"
    rt = lb.get_avg_data_of_last_hour(projId, pointname)
    assert not rt, 'get_avg_data_of_last_hour :projId:%s,pointname:%s actual got value is  not None' % (projId, pointname)






