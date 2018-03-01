#coding=utf-8
__author__ = 'sophia'
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointname','nSearchDays','result'),[
    (72,'ChAMPS01',30,93.9),
    (72,'VAV_J_54_13_Air Flow',60,58.88),
    (72,'BaseChillerSysCOP_sec_svr',90,5.28),
    (72,'Max_OUTDOORTemp_W',150,54.43),
    (72,'ChAMPS01',120,93.9),
])
def test_get_last_value(projId, pointname,nSearchDays,result):
    lb = LogicBase(projId, datetime(year=2017,month=8,day=2,hour=12))
    assert lb, "create instance failed"
    rt=lb.get_last_value(projId, pointname,nSearchDays)
    assert  rt,'get_last_value :projId:%s,pointname:%s got value is null'%(projId,pointname)
    assert  rt==result,'get_last_value :projId:{0},pointname:{1} expected value is {2},actual got value is {3}'.format(projId,pointname,result,rt)


@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointname','nSearchDays'),[
    (72,None,30)
])
def test_wrong(projId, pointname,nSearchDays):
    lb = LogicBase(projId, datetime.now())
    assert lb, "create instance failed"
    rt = lb.get_last_value(projId, pointname,nSearchDays)
    assert not rt, 'get_last_value :projId:%s,pointname:%s got value is  not None' % (projId, pointname)
