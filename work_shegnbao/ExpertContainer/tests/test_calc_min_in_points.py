#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "acTime", "pointList", "nMode", "expected"), [
    (72, datetime(year=2017, month=7, day=18, hour=0, minute=0, second=0), ["A11AHU_A_11_TempSaIn", "A14AHU_A_24_VFSA", "AllRoom_OverHeat_svr"], LogicBase.REPAIR_HISTORY, 1.0),
    (72, datetime(year=2017, month=7, day=18, hour=0, minute=5, second=0), ["A11AHU_A_11_TempSaIn", "A14AHU_A_24_VFSA", "AllRoom_OverHeat_svr"], LogicBase.REPAIR_HISTORY, 1.0),
    (72, datetime(year=2017, month=7, day=18, hour=2, minute=0, second=0), ["A11AHU_A_11_TempSaIn", "A14AHU_A_24_VFSA", "AllRoom_OverHeat_svr"], LogicBase.REPAIR_HISTORY, 1.0),
    (72, datetime(year=2017, month=1, day=18, hour=0, minute=0, second=0), ["A11AHU_A_11_TempSaIn", "A14AHU_A_24_VFSA", "AllRoom_OverHeat_svr"], LogicBase.REPAIR_HISTORY, None),
    (72, datetime(year=2017, month=7, day=20, hour=10, minute=0, second=0), ["A11AHU_A_11_TempSaIn", "A14AHU_A_24_VFSA", "AllRoom_OverHeat_svr"], LogicBase.REPAIR_HISTORY, 1.0),#will get nearest
    (72, datetime(year=2017, month=8, day=1, hour=12, minute=5, second=0), ["web_outdoorTemp", "VAV_J_54_18_Room Temp", "Water_Pump_SP_KPITotalScore"], LogicBase.REPAIR_HISTORY, 26.94)
])
def test_calc_min_in_points(projId, acTime, pointList, nMode, expected):
    lb = LogicBase(projId, acTime, nMode=nMode)
    rt = lb.calc_min_in_points(projId, pointList)
    if expected is None:
        assert rt == expected, "min in points should be None, but get %s"%(rt,)
    else:
        assert almost_equals(expected, rt), "not equal, expected is %s, actual is %s"%(expected, rt)