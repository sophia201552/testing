# coding=utf-8
__author__ = 'sophia'
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest


@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointname', 'value','mode'), [
    (72, 'A11AHU_A_11_DmprEaCtrl', 1,LogicBase.ONLINE_TEST_REALTIME),
    ('72', 'A11AHU_A_11_DmprEaCtrl',1,LogicBase.REALTIME),
    ('72', 'A11AHU_A_11_DmprEaCtrl',1,LogicBase.ONLINE_TEST_REALTIME),
    (72, ['A11AHU_A_11_DmprEaCtrl', 'AllRoom_OverHeat_svr'],[1, 87],LogicBase.ONLINE_TEST_REALTIME),
])
def test_get_data_json_correct(projId, pointname, value,mode):
    lb = LogicBase(projId, datetime.now(), nMode=mode)
    assert lb, "create instance LogicBase failed"
    rt = lb.get_data_json(projId, pointname)
    assert rt == value, 'get_data_json :projId:%s,pointname:%s ,expected value is %s,got value is  %s' % ( projId, pointname, value, rt)


@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointname'), [
    (72, 'A11AHU_A_11_DmprEaCtrl222'),
    (72, ''),
])
def test_get_data_json_wrong(projId, pointname):
    lb = LogicBase(projId, datetime.now(), nMode=2)
    assert lb, "create instance failed"
    rt = lb.get_data_json(projId, pointname)
    assert not rt, 'get_data_json :projId:%s,pointname:%s got value is  %s' % (projId, pointname, rt)
