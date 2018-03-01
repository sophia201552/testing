#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *
from ExpertContainer.api.views import *

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "orginName", "newName", "flag"), [
    (293, "L10S1_VAVC2_CtlStpt", "L10S1_VAVC2_CtlStpt_new", 0),
    (293, "AllRoom_TSetDiag", "AllRoom_TSetDiag_new", 1),
    (293, "CHWP001_PumpEnergy_W", "CHWP001_PumpEnergy_W_new", 2)
])
def test_renameCalcRealTimeData(projId, orginName, newName, flag):
    rt = do_setCalcRealTimeData(projId, orginName, newName, flag)
    assert rt.get("state") == 1, "result is incorrect"
    realdata = BEOPDataAccess.getInstance().getBufferRTDataByProj(projId, [orginName, newName])
    assert realdata.get(orginName) == None, "orginName must be None"
    assert realdata.get(newName) is not None, "newName must not be None"
    #restore
    rt = do_setCalcRealTimeData(projId, newName, orginName, flag)
    assert rt.get("state") == 1, "result is incorrect"
    realdata = BEOPDataAccess.getInstance().getBufferRTDataByProj(projId, [orginName, newName])
    assert realdata.get(newName) == None, "newName must be None"
    assert realdata.get(orginName) is not None, "orginName must not be None"