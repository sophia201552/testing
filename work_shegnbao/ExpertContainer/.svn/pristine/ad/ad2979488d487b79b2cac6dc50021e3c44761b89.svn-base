#coding=utf-8
__author__ = 'sophia'
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointname','value'),[
    (72,'ChAMPS01',[91.2, 93.2, 92.6, 93.3, 93.4, 94.2, 94.3, 94.3, 93.6, 93.6, 92.9, 94.0, 93.1]),
    ('72','ChAMPS01',[91.2, 93.2, 92.6, 93.3, 93.4, 94.2, 94.3, 94.3, 93.6, 93.6, 92.9, 94.0, 93.1]),
    ('72','A11AHU_A_11_DmprEaCtrl',[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]),
    (72,'A11AHU_A_11_DmprEaCtrl',[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]),
])
def test_correct(projId, pointname,value):
    lb = LogicBase(projId, datetime(year=2017,month=8,day=2,hour=12))
    assert lb, "create instance failed"
    rt = lb.get_history_data_of_last_hour(projId, pointname)
    assert isinstance(rt,list),'actual is not list'
    assert rt, 'get_history_data_of_last_hour :projId:%s,pointname:%s,actual got value is %s' %\
                       (projId, pointname,rt)
    assert len(rt)==13, 'get_history_data_of_last_hour :projId:%s,pointname:%s,expected value length is 13,actual got value length is %s' % \
               (projId, pointname, len(rt))
    assert value==rt,'get_history_data_of_last_hour :projId:%s,pointname:%s,expected value is %s,actual got value is %s' % \
               (projId, pointname,value, rt)

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointname'),[
    (72,'A11AHU_A_11_DmprEaCtrl222'),
    (72,''),
    (72, ['A11AHU_A_11_DmprEaCtrl', 'AllRoom_OverHeat_svr']),
])
def test_wrong(projId, pointname):
    lb = LogicBase(projId, datetime(year=2017,month=8,day=2,hour=12))
    assert lb, "create instance failed"
    rt = lb.get_history_data_of_last_hour(projId, pointname)
    assert not rt, 'get_history_data_of_last_hour :projId:%s,pointname:%s got value is  not None' % (projId, pointname)






