#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest


@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointList', 'expectedList'),[
    (293,['Accum_ChGroup_GroupEnergyM', 'L11S1_VAVC2_DmprComd'], ['int', 'int']),
    (293,['Accum_ChGroup_GroupEnergyM', 'L11S1_VAVC2_DmprComd', 'MustBeNone'], ['int', 'int', 'NoneType']),
])
def test_get_data_int_real(projId, pointList, expectedList):
    lb = LogicBase(projId, datetime.now(), nMode = LogicBase.REALTIME)
    if lb:
        lb.before_actlogic()
        rt = lb.get_data_int(projId, pointList)
        lb.after_actlogic()
        assert rt and len(rt) == len(pointList), "length of return is %d, length of pointList is %s"%(len(rt), len(pointList))
        for index, item in enumerate(rt):
            assert type(item).__name__ == expectedList[index], "return item is not expected type"
    else:
        assert False, "create instance failed"

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointList', 'expectedList'),[
    (293,['Accum_ChGroup_GroupEnergyM', 'L11S1_VAVC2_DmprComd'], [41067, 100]),
    (293,['Accum_ChGroup_GroupEnergyM', 'L11S1_VAVC2_DmprComd', 'MustBeNone'], [41067, 100, None]),
])
def test_get_data_int_his(projId, pointList, expectedList):
    lb = LogicBase(projId, datetime(year=2017, month=10, day=1), nMode = LogicBase.REPAIR_HISTORY)
    if lb:
        rt = lb.get_data_int(projId, pointList)
        assert rt and len(rt) == len(pointList), "length of return is %d, length of pointList is %s"%(len(rt), len(pointList))
        for index, item in enumerate(rt):
            assert expectedList[index] == item, "hisory value is not equal, expected is %s and actual is %s"%(
                expectedList[index], item)
    else:
        assert False, "create instance failed"