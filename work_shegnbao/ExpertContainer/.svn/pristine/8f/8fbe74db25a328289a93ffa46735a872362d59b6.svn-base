#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "point_name_list", "condition", "run_name_list", "expected"), [
    (194, ['ChAMPS01','ChAMPS02','ChAMPS03','ChAMPS04','ChAMPS05','ChAMPS06'], '>10', ['ChAMPS01','ChAMPS02','ChAMPS03','ChAMPS04','ChAMPS05','ChAMPS06'], 0),
    (72, ['ChAMPS01','ChAMPS02','ChAMPS03','ChAMPS04','ChAMPS05','ChAMPS06','ChAMPS07'],'>10',['ChAMPS01','ChAMPS02','ChAMPS03','ChAMPS04','ChAMPS05','ChAMPS06','ChAMPS07'], 83.8)
])
def test_calc_avg_if_run(projId, point_name_list, condition, run_name_list, expected):
    lb = LogicBase(projId, datetime.now())
    lb.before_actlogic()
    rt = lb.calc_avg_if_run(projId, point_name_list, condition, run_name_list)
    if expected is None:
        assert rt == expected, "avg should be None, but get %s"%(rt,)
    else:
        assert almost_equals(expected, rt), "not equal, expected is %s, actual is %s"%(expected, rt)