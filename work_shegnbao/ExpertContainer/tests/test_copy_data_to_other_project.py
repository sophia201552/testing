#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *

@pytest.mark.p0
def test_id_None():
    proj_id=None
    lb = LogicBase(None, datetime.now())
    rt=lb.copy_data_to_other_project(proj_id)
    assert not rt,'copy_data_to_other_project:id=None,actual is not None'

@pytest.mark.p0
@pytest.mark.usefixtures("deletePointFromMysql")
@pytest.mark.parametrize(('destinationId'),[
    ([687]),(687),('687')
])
def test_correct(destinationId):
    from_proj_id=49
    pointList=['A11AHU_A_11_DmprRaCtrl','A11AHU_A_11_VFPos']
    lb = LogicBase(from_proj_id, datetime.now())
    rt=lb.copy_data_to_other_project(destinationId)
    assert  rt,'copy_data_to_other_project:return result is False'
    if '[' in str(destinationId):
        destinationId=int(str(destinationId).replace('[','').replace(']',''))
    expected_value=BEOPDataAccess.getInstance().getOrginalPointTimeValueList( from_proj_id,pointList)
    actual_value=BEOPDataAccess.getInstance().getOrginalPointTimeValueList(int(destinationId), pointList)
    assert expected_value,'expected value is null'
    assert actual_value,'actual value is null'
    assert expected_value==actual_value,'expected value does not  match actual value,expected value:%s,actual value:%s'%(expected_value,actual_value)

@pytest.fixture(scope='function')
def deletePointFromMysql(request):
    def fin():
        BEOPDataAccess.getInstance().deletePointFromMysql(687,['A11AHU_A_11_DmprRaCtrl','A11AHU_A_11_VFPos'])
    request.addfinalizer(fin)
