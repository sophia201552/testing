#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

@pytest.mark.p0
def test_correct():
    prj=49
    lb = LogicBase(prj, datetime.now())
    data=lb.get_data_all_of_project(prj)
    assert data,'mytest project lost data in rtdata_49 or rtdata_49_vpoint,actual value is %s'% data
    assert  len(data)>=35554,'mytest project lost data in rtdata_49 or rtdata_49_vpoint.data length is less than 35554'

@pytest.mark.p0
def test_wrong():
    prj=None
    lb = LogicBase(prj, datetime.now())
    data=lb.get_data_all_of_project(prj)
    assert not data,'mytest project should be null actual is %s' %data