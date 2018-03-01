#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest


@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointList', 'expectedList'),[
    (293,['Accum_ChGroup_GroupEnergyM', 'L11S1_VAVC2_DmprComd'], ['float', 'float']),
    (293,['Accum_ChGroup_GroupEnergyM', 'L11S1_VAVC2_DmprComd', 'MustBeNone'], ['float', 'float', 'NoneType']),
])
def test_get_data_real(projId, pointList, expectedList):
    lb = LogicBase(projId, datetime.now(), nMode = LogicBase.REALTIME)
    if lb:
        lb.before_actlogic()
        rt = lb.get_data(projId, pointList)
        lb.after_actlogic()
        assert rt and len(rt) == len(pointList), "length of return is %d, length of pointList is %s"%(len(rt), len(pointList))
        for index, item in enumerate(rt):
            assert type(item).__name__ == expectedList[index], "return item is not expected type"
    else:
        assert False, "create instance failed"

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointList', 'expectedList'),[
    (293,['Accum_ChGroup_GroupEnergyM', 'L11S1_VAVC2_DmprComd'], [41067.41666666666, 100]),
    (293,['Accum_ChGroup_GroupEnergyM', 'L11S1_VAVC2_DmprComd', 'MustBeNone'], [41067.41666666666, 100, None]),
])
def test_get_data_his(projId, pointList, expectedList):
    lb = LogicBase(projId, datetime(year=2017, month=10, day=1), nMode = LogicBase.REPAIR_HISTORY)
    if lb:
        rt = lb.get_data(projId, pointList)
        assert rt and len(rt) == len(pointList), "length of return is %d, length of pointList is %s"%(len(rt), len(pointList))
        for index, item in enumerate(rt):
            assert expectedList[index] == item, "hisory value is not equal, expected is %s and actual is %s"%(
                expectedList[index], item)
    else:
        assert False, "create instance failed"