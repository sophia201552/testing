# -*- coding: utf-8 -*-
import pytest
from tests.utils import TestCommon


# 获取某一时刻的历史数据，用例选择华为，id=72
# 用例包括m5，v2，bSearchNearest=True，bSearchNearest=False，选择2个常用的点
@pytest.mark.p0
def test_get_history_at_time_v2_no_nearest():
    param = {
        "projId": 72,
        "pointList": ['ChAMPS01', 'VAV_J_54_13_Air Flow'],
        "bSearchNearest": False,
        "time": '2017-08-01 00:00:00'
    }
    expected_value = [90.1, 42.14]
    rt = TestCommon.GetHistoryAtTime.run(param)
    TestCommon.GetHistoryAtTime.assert_equal_result(expected_value, rt)


@pytest.mark.p0
def test_get_history_at_time_m5_no_nearest():
    param = {
        "projId": 72,
        "pointList": ['ChAMPS01', 'VAV_J_54_13_Air Flow'],
        "bSearchNearest": False,
        "time": '2017-07-01 00:00:00'
    }
    expected_value = [80.8, 40.26]
    rt = TestCommon.GetHistoryAtTime.run(param)
    TestCommon.GetHistoryAtTime.assert_equal_result(expected_value, rt)


@pytest.mark.p0
def test_get_history_at_time_m5_nearest():
    param = {
        "projId": 72,
        "pointList": ['ChAMPS01', 'VAV_J_54_13_Air Flow'],
        "bSearchNearest": True,
        "time": '2017-07-02 00:05:00'
    }
    expected_value = [80.3, 40.72]
    rt = TestCommon.GetHistoryAtTime.run(param)
    TestCommon.GetHistoryAtTime.assert_equal_result(expected_value, rt)


@pytest.mark.p0
def test_get_history_at_time_v2_nearest():
    param = {
        "projId": 72,
        "pointList": ['ChAMPS01', 'VAV_J_54_13_Air Flow'],
        "bSearchNearest": True,
        "time": '2017-08-02 00:05:00'
    }
    expected_value = [87.3, 42.26]
    rt = TestCommon.GetHistoryAtTime.run(param)
    TestCommon.GetHistoryAtTime.assert_equal_result(expected_value, rt)
