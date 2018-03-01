#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *
from ExpertContainer.api.views import *

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "logic_content", "point_name", "module_name", "timeObj", "expected_value"),[
    (72, "def main():\n    pointlist = ['Ti13_MR','Ti11_MR','Ti10_MR','Ti9_MR','Ti8_MR','Ti7_MR','IceTankRatio_svr_MR',"
         "'RealTimeCoolingCOP_svr_MR','BaseChillerSysCOP_sec_svr_MR','ChApprCondTemp_svr_MR','ChApprEvapTemp_svr_MR',"
         "'AverageChAMPS_svr_MR','Pi_P_MR','MeetRoom_VIPCO2_MR','MeetRoom_NorCO2_MR','VAV_RoomTemp_MR']\n    "
         "d = get_data(pointlist)\n    log_str(str(d))\n    s = 0\n    for i in range(len(pointlist)):\n        "
         "if d[i]>80:\n            s+=1\n    return s/0.16", "HVAC_KPITotalScore1", "calcpoint_72_HVAC_KPITotalScore1",
     datetime(year=2017, month=8, day=2, hour=0, minute=0, second=0), 12/0.16),
])
def test_cloudpoint_onlinetest_history(projId, logic_content, point_name, module_name, timeObj, expected_value):
    calResult, calInfo = do_onlinetest_history(projId, logic_content, point_name, module_name, timeObj)
    assert almost_equals(calResult, expected_value), "calc result(%s) is not equal to expected(%s)"%(calResult, expected_value)
    assert len(calInfo)>0, "calc produce must have more than one item"