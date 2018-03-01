#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *
from ExpertContainer.api.views import *

#多处都已经测试过该功能，这里是对返回值最简单的判断即可
@pytest.mark.p0
@pytest.mark.parametrize(("projId"), [72, 293])
def test_trigger_one_calculation(projId):
    rt = triggerOneCalculation(projId, None, False)
    assert rt, "calculation failed"