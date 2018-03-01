#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *
from ExpertContainer.api.views import *

#和计算点类似，没什么好测试的，仅仅意思一下吧
@pytest.mark.p0
def test_diagnosis_onlinetest():
    calResult, calInfo = do_diagnosis_onlinetest(49, "def main():\n    if get_data(\"A11AHU_A_11_PressSaOut\") > 0:\n        return True\n    else:\n        return False\n    return None", "diagnosis_test")
    assert calResult, "if condition return True"
