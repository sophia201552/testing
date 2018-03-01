#coding=utf-8
__author__ = 'angelia'

from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
import pytest
from datetime import datetime
import random

site_value = random.randint(1,100)
virtual_value = random.randint(100,200)
calc_value = random.randint(200,300)
@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointList', 'expectedList'),[
    (49,['test_sitePoint01','test_virtualPoint01','test_calcPoint01'], [site_value,virtual_value,calc_value]),

])
def test_set_data_from_site(projId, pointList, expectedList):
    lb = LogicBase(projId, datetime(year=2017, month=10, day=1), nMode = LogicBase.REPAIR_HISTORY)
    if lb:
        rt = lb.set_data_from_site(projId, pointList, expectedList)
        if rt:
            actual_data = BEOPDataAccess.getInstance().getBufferRTDataWithTimeByProj(projId, pointList)
            for item in pointList:
                actual_value = actual_data.get(item)[1]
                expected_value = expectedList[pointList.index(item)]
                if actual_value:
                    assert str(actual_value) == str(expected_value), "%s: expected value is %s,which differs from actual value %s" %(item, expected_value, actual_value)
                else:
                    assert False, "get realtime data of %s failed" % item
        else:
            assert False, "set data from site failed"
    else:
        assert False, "create instance failed"

