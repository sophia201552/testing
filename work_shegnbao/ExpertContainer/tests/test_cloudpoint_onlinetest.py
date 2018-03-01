#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *
from ExpertContainer.api.views import *

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "logic_content", "point_name", "module_name", "write_to_real", "expected_value"),[
    (49, "def main():\n    return get_data(\"copy_realdata_test\")+12345", "copy_realdata_test1", "calcpoint_49_copy_realdata_test1", 0, 12370.17),
    (49, "def main():\n    return get_data(\"copy_realdata_test\")+20000", "copy_realdata_test1", "calcpoint_49_copy_realdata_test1", 1, 20025.17),
])
def test_cloudpoint_onlinetest(projId, logic_content, point_name, module_name, write_to_real, expected_value):
    calc_value = None
    assert BEOPDataAccess.getInstance().deletePointFromBufferData(projId, [point_name]), "delete point failed"
    calResult, calInfo = do_online_test(projId, logic_content, point_name, module_name, write_to_real)
    if write_to_real == 1:
        calc_value = BEOPDataAccess.getInstance().getBufferRTDataByProj(projId, [point_name])
        calc_value = float(calc_value.get(point_name))
        assert almost_equals(calc_value, expected_value), "buffer result(%s) is not equal to expected(%s)"%(calc_value, expected_value)
    assert almost_equals(calResult, expected_value), "calc result(%s) is not equal to expected(%s)"%(calResult, expected_value)
    assert len(calInfo)>0, "calc produce must have more than one item"