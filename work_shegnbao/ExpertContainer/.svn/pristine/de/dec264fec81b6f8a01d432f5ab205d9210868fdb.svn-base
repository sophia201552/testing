#coding=utf-8

from ExpertContainer.dbAccess.BEOPDataAccess import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
from tests.utils import *
import pytest

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "acttime", "pointList", "valueList", "runMode"),
                         [
                             (49, datetime.strptime("2017-05-01 00:00:00", "%Y-%m-%d %H:%M:%S"), ["setpoint_1", "setpoint_2", "setpoint_3"], ["setvalue_1", "setvalue_2", "setvalue_3"], LogicBase.REALTIME),
                             (49, datetime.strptime("2017-08-01 00:00:00", "%Y-%m-%d %H:%M:%S"), ["setpoint_4", "setpoint_5", "setpoint_6"], ["setvalue_4", "setvalue_5", "setvalue_5"], LogicBase.REALTIME),
                             (49, datetime.strptime("2017-06-01 00:00:00", "%Y-%m-%d %H:%M:%S"), ["setpoint_7", "setpoint_8", "setpoint_9"], ["setvalue_7", "setvalue_8", "setvalue_9"], LogicBase.REPAIR_HISTORY),
                             (49, datetime.strptime("2017-09-01 00:00:00", "%Y-%m-%d %H:%M:%S"), ["setpoint_10", "setpoint_11", "setpoint_12"], ["setvalue_10", "setvalue_11", "setvalue_12"], LogicBase.REPAIR_HISTORY),
                             (49, datetime.strptime("2017-05-01 00:00:00", "%Y-%m-%d %H:%M:%S"), ["setpoint_13", "setpoint_14", "setpoint_15"], [2.1, 2.2, 2.3], LogicBase.REALTIME),
                             (49, datetime.strptime("2017-08-01 00:00:00", "%Y-%m-%d %H:%M:%S"), ["setpoint_16", "setpoint_17", "setpoint_18"], [3.1, 3.2, 3.3], LogicBase.REALTIME),
                             (49, datetime.strptime("2017-06-01 00:00:00", "%Y-%m-%d %H:%M:%S"), ["setpoint_19", "setpoint_20", "setpoint_21"], [4.1, 4.2, 4.3], LogicBase.REPAIR_HISTORY),
                             (49, datetime.strptime("2017-09-01 00:00:00", "%Y-%m-%d %H:%M:%S"), ["setpoint_22", "setpoint_23", "setpoint_24"], [5.1, 5.2, 5.3], LogicBase.REPAIR_HISTORY),
                         ])
def test_set_data_calc_point(projId, acttime, pointList, valueList, runMode):
    lb = LogicBase(projId, acttime, nMode=runMode)
    lb.set_data_calcpoint(projId, pointList, valueList)
    lb.initDataCacheFromRealtimeData()
    if LogicBase.REALTIME == runMode:
        realdata = lb.get_data_string(projId, pointList)
        assert realdata, "get_data_string return [], projId=%s"%(projId,)
        assert len(realdata) == len(valueList), "realtime return value has different length of input"
        for index, item in enumerate(realdata):
            if isinstance(item, str):
                assert item == str(valueList[index]), "index = %s, expected value is %s, actual value is %s" % (
                    index, valueList[index], item)
            elif isinstance(item, float):
                assert almost_equals(item, valueList[index]), "index = %s, expected value is %s, actual value is %s" % (
                    index, valueList[index], item)
    hisdata = lb.get_data_at_time(projId, pointList, acttime.strftime("%Y-%m-%d %H:%M:%S"))
    assert hisdata, "get_data_at_time return [], projId=%s" % (projId,)
    assert len(hisdata) == len(valueList), "history return value has different length of input"
    for index, item in enumerate(hisdata):
        if isinstance(item, str):
            assert item == str(valueList[index]), "index = %s, expected value is %s, actual value is %s" % (
            index, valueList[index], item)
        elif isinstance(item, float):
            assert almost_equals(item, valueList[index]), "index = %s, expected value is %s, actual value is %s" % (
            index, valueList[index], item)
    assert BEOPDataAccess.getInstance().deletePointFromBufferData(projId, pointList), "failed to delete real test data"
    for pointname in pointList:
        assert lb.delete_one_record(projId, pointname, acttime.strftime("%Y-%m-%d %H:%M:%S")), "failed to delete history test data"