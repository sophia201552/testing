# coding=utf-8
import pytest
from tests import TestSpecific
from tests.utils import TestCommon

"""
项目：华为（72），利物浦（293）
时间格式：'m5','h1','d1','M1'
点位：任意2个典型的点（1个原始，1个现场）
用例数据库：m5，v2，m5+v2
共计用例个数：24
缺少计算、虚拟点各12个，list中各一个点；秒数非零时的用例，1个，list放四个点；特殊用例4个，包括projectid、开始时间、结束时间、时间格式各一个；开始+结束时间同时错误用例一个
点名错误用例两个（列表只包含一个错误点名，列表包含两个点名，一个错误，一个正确）
新增m5,h1,d1查询时间过长的测试用例各一个，时间格式为非正常时间格式用例一个，点名为空列表、空字符串用例各一个，字符串+空格用例一个，开始、结束、开始+结束时间为浮点秒数时间格式各一个
projectid为字符串用例一个,开始时间超出项目开始时间用例m5,h1,d1各一个，projectid、开始时间、结束时间、时间格式、点名都错误的组合测试用例一个

#*****************************************************************************************************************
"""
# 以下内容为严观微添加，针对华为的历史数据，编写各种测试用例

huawei_test_point_list = ['ChAMPS01', 'VAV_J_54_13_Air_Flow']
huawei_test_pointList_virtual = ['BaseChillerSysCOP_sec_svr']
huawei_test_pointList_calc = ['Max_OUTDOORTemp_W']
huawei_test_pointList_accum = ['ChAMPS01', 'VAV_J_54_13_Air Flow', 'BaseChillerSysCOP_sec_svr', 'Max_OUTDOORTemp_W']
huawei_test_pointList_wrong = ['BaseChillerSysCOP_sec_svr', 'Max_OUTDOORTemp_W1']


@pytest.mark.p0
def test_huawei_m5_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-08-01 00:00:00',
        'timeEnd': '2017-08-01 00:10:00',
        'timeFormat': 'm5',
        'pointList': huawei_test_point_list
    })
    expected = [{
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 90.1
            },
            {
                "error": False,
                "time": "2017-08-01 00:05:00",
                "value": 89.7
            },
            {
                "error": False,
                "time": "2017-08-01 00:10:00",
                "value": 89.1
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 42.14
            },
            {
                "error": False,
                "time": "2017-08-01 00:05:00",
                "value": 42.1
            },
            {
                "error": False,
                "time": "2017-08-01 00:10:00",
                "value": 42.29
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_m5_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-01 00:00:00',
        'timeEnd': '2017-07-01 00:10:00',
        'timeFormat': 'm5',
        'pointList': huawei_test_point_list
    })
    expected = [{
        "history": [
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 80.8
            },
            {
                "error": False,
                "time": "2017-07-01 00:05:00",
                "value": 80.8
            },
            {
                "error": False,
                "time": "2017-07-01 00:10:00",
                "value": 80.2
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 40.26
            },
            {
                "error": False,
                "time": "2017-07-01 00:05:00",
                "value": 40.16
            },
            {
                "error": False,
                "time": "2017-07-01 00:10:00",
                "value": 40.24
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_m5_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 17:00:00',  # 跨v2时间
        'timeEnd': '2017-07-20 19:00:00',  # 跨v2时间
        'timeFormat': 'm5',  # 'h1','d1','M1'
        'pointList': huawei_test_point_list  # site, raw
    })
    expected = [{
        "history": [
            {
                "error": False,
                "time": "2017-07-20 17:00:00",
                "value": 93.6
            },
            {
                "error": False,
                "time": "2017-07-20 17:05:00",
                "value": 94.0
            },
            {
                "error": False,
                "time": "2017-07-20 17:10:00",
                "value": 93.8
            },
            {
                "error": False,
                "time": "2017-07-20 17:15:00",
                "value": 93.4
            },
            {
                "error": False,
                "time": "2017-07-20 17:20:00",
                "value": 93.7
            },
            {
                "error": False,
                "time": "2017-07-20 17:25:00",
                "value": 93.9
            },
            {
                "error": False,
                "time": "2017-07-20 17:30:00",
                "value": 93.1
            },
            {
                "error": False,
                "time": "2017-07-20 17:35:00",
                "value": 93.7
            },
            {
                "error": False,
                "time": "2017-07-20 17:40:00",
                "value": 93.8
            },
            {
                "error": False,
                "time": "2017-07-20 17:45:00",
                "value": "86.5"
            },
            {
                "error": False,
                "time": "2017-07-20 17:50:00",
                "value": 80.4
            },
            {
                "error": True,
                "time": "2017-07-20 17:55:00",
                "value": 80.4
            },
            {
                "error": True,
                "time": "2017-07-20 18:00:00",
                "value": 80.4
            },
            {
                "error": False,
                "time": "2017-07-20 18:05:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:10:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:15:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:20:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:25:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:30:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:35:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:40:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:45:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:50:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 18:55:00",
                "value": 0
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 0
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-07-20 17:00:00",
                "value": 53.24
            },
            {
                "error": False,
                "time": "2017-07-20 17:05:00",
                "value": 53.29
            },
            {
                "error": False,
                "time": "2017-07-20 17:10:00",
                "value": 53.25
            },
            {
                "error": False,
                "time": "2017-07-20 17:15:00",
                "value": 53.36
            },
            {
                "error": False,
                "time": "2017-07-20 17:20:00",
                "value": 53.29
            },
            {
                "error": False,
                "time": "2017-07-20 17:25:00",
                "value": 53.37
            },
            {
                "error": False,
                "time": "2017-07-20 17:30:00",
                "value": 53.02
            },
            {
                "error": False,
                "time": "2017-07-20 17:35:00",
                "value": 53.2
            },
            {
                "error": False,
                "time": "2017-07-20 17:40:00",
                "value": 52.99
            },
            {
                "error": False,
                "time": "2017-07-20 17:45:00",
                "value": 53.17
            },
            {
                "error": False,
                "time": "2017-07-20 17:50:00",
                "value": 52.99
            },
            {
                "error": False,
                "time": "2017-07-20 17:55:00",
                "value": 52.74
            },
            {
                "error": True,
                "time": "2017-07-20 18:00:00",
                "value": 52.74
            },
            {
                "error": False,
                "time": "2017-07-20 18:05:00",
                "value": 52.92
            },
            {
                "error": False,
                "time": "2017-07-20 18:10:00",
                "value": 52.78
            },
            {
                "error": False,
                "time": "2017-07-20 18:15:00",
                "value": 52.97
            },
            {
                "error": False,
                "time": "2017-07-20 18:20:00",
                "value": 52.98
            },
            {
                "error": False,
                "time": "2017-07-20 18:25:00",
                "value": 52.86
            },
            {
                "error": False,
                "time": "2017-07-20 18:30:00",
                "value": 52.93
            },
            {
                "error": False,
                "time": "2017-07-20 18:35:00",
                "value": 52.66
            },
            {
                "error": False,
                "time": "2017-07-20 18:40:00",
                "value": 52.77
            },
            {
                "error": False,
                "time": "2017-07-20 18:45:00",
                "value": 52.72
            },
            {
                "error": False,
                "time": "2017-07-20 18:50:00",
                "value": 52.85
            },
            {
                "error": False,
                "time": "2017-07-20 18:55:00",
                "value": 52.49
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 52.45
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_h1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-08-01 00:00:00',
        'timeEnd': '2017-08-01 5:00:00',
        'timeFormat': 'h1',
        'pointList': huawei_test_point_list
    })
    expected = [{
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 90.1
            },
            {
                "error": False,
                "time": "2017-08-01 01:00:00",
                "value": 85.1
            },
            {
                "error": False,
                "time": "2017-08-01 02:00:00",
                "value": 83.6
            },
            {
                "error": False,
                "time": "2017-08-01 03:00:00",
                "value": 81.8
            },
            {
                "error": False,
                "time": "2017-08-01 04:00:00",
                "value": 80.3
            },
            {
                "error": False,
                "time": "2017-08-01 05:00:00",
                "value": 78.6
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 42.14
            },
            {
                "error": False,
                "time": "2017-08-01 01:00:00",
                "value": 42.59
            },
            {
                "error": False,
                "time": "2017-08-01 02:00:00",
                "value": 42.61
            },
            {
                "error": False,
                "time": "2017-08-01 03:00:00",
                "value": 42.55
            },
            {
                "error": False,
                "time": "2017-08-01 04:00:00",
                "value": 42.72
            },
            {
                "error": False,
                "time": "2017-08-01 05:00:00",
                "value": 42.62
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_d1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-08-01 03:00:00',
        'timeEnd': '2017-08-05 05:00:00',
        'timeFormat': 'd1',
        'pointList': huawei_test_point_list
    })
    expected = [{
        "history": [
            {
                "error": False,
                "time": "2017-08-01 03:00:00",
                "value": 81.8
            },
            {
                "error": False,
                "time": "2017-08-02 03:00:00",
                "value": 80.4
            },
            {
                "error": False,
                "time": "2017-08-03 03:00:00",
                "value": 78.1
            },
            {
                "error": False,
                "time": "2017-08-04 03:00:00",
                "value": 76.6
            },
            {
                "error": False,
                "time": "2017-08-05 03:00:00",
                "value": 77.6
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-08-01 03:00:00",
                "value": 42.55
            },
            {
                "error": False,
                "time": "2017-08-02 03:00:00",
                "value": 42.2
            },
            {
                "error": False,
                "time": "2017-08-03 03:00:00",
                "value": 41.92
            },
            {
                "error": False,
                "time": "2017-08-04 03:00:00",
                "value": 42.96
            },
            {
                "error": False,
                "time": "2017-08-05 03:00:00",
                "value": 42.52
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_M1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-08-01 00:00:00',
        'timeEnd': '2017-09-01 00:00:00',
        'timeFormat': 'M1',
        'pointList': huawei_test_point_list
    })
    expected = [{
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 90.1
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 78.2
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 42.14
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 40.7
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_h1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-01 00:00:00',
        'timeEnd': '2017-07-01 05:00:00',
        'timeFormat': 'h1',
        'pointList': huawei_test_point_list
    })
    expected = [{
        "history": [
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 80.8
            },
            {
                "error": False,
                "time": "2017-07-01 01:00:00",
                "value": 79.4
            },
            {
                "error": False,
                "time": "2017-07-01 02:00:00",
                "value": 76.9
            },
            {
                "error": False,
                "time": "2017-07-01 03:00:00",
                "value": 75.0
            },
            {
                "error": False,
                "time": "2017-07-01 04:00:00",
                "value": 74.4
            },
            {
                "error": False,
                "time": "2017-07-01 05:00:00",
                "value": 73.3
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 40.26
            },
            {
                "error": False,
                "time": "2017-07-01 01:00:00",
                "value": 40.39
            },
            {
                "error": False,
                "time": "2017-07-01 02:00:00",
                "value": 40.36
            },
            {
                "error": False,
                "time": "2017-07-01 03:00:00",
                "value": 40.31
            },
            {
                "error": False,
                "time": "2017-07-01 04:00:00",
                "value": "40.53"
            },
            {
                "error": False,
                "time": "2017-07-01 05:00:00",
                "value": 40.48
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_d1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-01 02:00:00',
        'timeEnd': '2017-07-05 02:00:00',
        'timeFormat': 'd1',
        'pointList': huawei_test_point_list
    })
    expected = [{
        "history": [
            {
                "error": False,
                "time": "2017-07-01 02:00:00",
                "value": 76.9
            },
            {
                "error": False,
                "time": "2017-07-02 02:00:00",
                "value": 76.8
            },
            {
                "error": False,
                "time": "2017-07-03 02:00:00",
                "value": 77.3
            },
            {
                "error": False,
                "time": "2017-07-04 02:00:00",
                "value": 79.9
            },
            {
                "error": False,
                "time": "2017-07-05 02:00:00",
                "value": 74.7
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-07-01 02:00:00",
                "value": 40.36
            },
            {
                "error": False,
                "time": "2017-07-02 02:00:00",
                "value": 40.66
            },
            {
                "error": False,
                "time": "2017-07-03 02:00:00",
                "value": 41.58
            },
            {
                "error": False,
                "time": "2017-07-04 02:00:00",
                "value": 42.02
            },
            {
                "error": False,
                "time": "2017-07-05 02:00:00",
                "value": 42.07
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_M1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-05-01 00:00:00',
        'timeEnd': '2017-07-01 00:00:00',
        'timeFormat': 'M1',
        'pointList': huawei_test_point_list
    })
    expected = [{
        "history": [
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": 84.3
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": 82.8
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 80.8
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": 38.28
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": 39.24
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 40.26
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_h1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-16 01:00:00',
        'timeEnd': '2017-07-19 01:00:00',
        'timeFormat': 'h1',
        'pointList': huawei_test_point_list
    })
    expected = [{
        "history": [
            {
                "error": False,
                "time": "2017-07-16 01:00:00",
                "value": 84.3
            },
            {
                "error": False,
                "time": "2017-07-16 02:00:00",
                "value": 82.9
            },
            {
                "error": False,
                "time": "2017-07-16 03:00:00",
                "value": 81.2
            },
            {
                "error": False,
                "time": "2017-07-16 04:00:00",
                "value": 79.2
            },
            {
                "error": False,
                "time": "2017-07-16 05:00:00",
                "value": 78.0
            },
            {
                "error": False,
                "time": "2017-07-16 06:00:00",
                "value": 76.6
            },
            {
                "error": False,
                "time": "2017-07-16 07:00:00",
                "value": 60.4
            },
            {
                "error": False,
                "time": "2017-07-16 08:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 09:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 10:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 11:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 12:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 13:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 14:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 15:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 16:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 17:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 18:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 19:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 20:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 21:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-16 22:00:00",
                "value": 92.9
            },
            {
                "error": False,
                "time": "2017-07-16 23:00:00",
                "value": 87.3
            },
            {
                "error": False,
                "time": "2017-07-17 00:00:00",
                "value": 85.0
            },
            {
                "error": False,
                "time": "2017-07-17 01:00:00",
                "value": 82.4
            },
            {
                "error": False,
                "time": "2017-07-17 02:00:00",
                "value": 79.3
            },
            {
                "error": False,
                "time": "2017-07-17 03:00:00",
                "value": 78.3
            },
            {
                "error": False,
                "time": "2017-07-17 04:00:00",
                "value": 76.7
            },
            {
                "error": False,
                "time": "2017-07-17 05:00:00",
                "value": 76.1
            },
            {
                "error": False,
                "time": "2017-07-17 06:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 07:00:00",
                "value": 93.9
            },
            {
                "error": False,
                "time": "2017-07-17 08:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 09:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 10:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 11:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 12:00:00",
                "value": 93.7
            },
            {
                "error": False,
                "time": "2017-07-17 13:00:00",
                "value": 93.4
            },
            {
                "error": False,
                "time": "2017-07-17 14:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 15:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 16:00:00",
                "value": 93.7
            },
            {
                "error": False,
                "time": "2017-07-17 17:00:00",
                "value": 94.0
            },
            {
                "error": False,
                "time": "2017-07-17 18:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 19:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 20:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 21:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 22:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-17 23:00:00",
                "value": 93.1
            },
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": 88.5
            },
            {
                "error": False,
                "time": "2017-07-18 01:00:00",
                "value": 85.9
            },
            {
                "error": False,
                "time": "2017-07-18 02:00:00",
                "value": 83.3
            },
            {
                "error": False,
                "time": "2017-07-18 03:00:00",
                "value": 81.5
            },
            {
                "error": False,
                "time": "2017-07-18 04:00:00",
                "value": 80.7
            },
            {
                "error": False,
                "time": "2017-07-18 05:00:00",
                "value": 77.9
            },
            {
                "error": False,
                "time": "2017-07-18 06:00:00",
                "value": 77.0
            },
            {
                "error": False,
                "time": "2017-07-18 07:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-18 08:00:00",
                "value": 93.7
            },
            {
                "error": False,
                "time": "2017-07-18 09:00:00",
                "value": 93.6
            },
            {
                "error": False,
                "time": "2017-07-18 10:00:00",
                "value": 92.9
            },
            {
                "error": False,
                "time": "2017-07-18 11:00:00",
                "value": 92.6
            },
            {
                "error": False,
                "time": "2017-07-18 12:00:00",
                "value": 93.9
            },
            {
                "error": False,
                "time": "2017-07-18 13:00:00",
                "value": 93.7
            },
            {
                "error": False,
                "time": "2017-07-18 14:00:00",
                "value": 88.3
            },
            {
                "error": False,
                "time": "2017-07-18 15:00:00",
                "value": 84.1
            },
            {
                "error": False,
                "time": "2017-07-18 16:00:00",
                "value": 94.0
            },
            {
                "error": False,
                "time": "2017-07-18 17:00:00",
                "value": 83.4
            },
            {
                "error": False,
                "time": "2017-07-18 18:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-18 19:00:00",
                "value": 90.5
            },
            {
                "error": False,
                "time": "2017-07-18 20:00:00",
                "value": 81.8
            },
            {
                "error": False,
                "time": "2017-07-18 21:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-18 22:00:00",
                "value": 0.0
            },
            {
                "error": False,
                "time": "2017-07-18 23:00:00",
                "value": 93.6
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": 91.0
            },
            {
                "error": False,
                "time": "2017-07-19 01:00:00",
                "value": 86.4
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": True,
                "time": "2017-07-16 01:00:00",
                "value": 40.84
            },
            {
                "error": False,
                "time": "2017-07-16 02:00:00",
                "value": 40.84
            },
            {
                "error": False,
                "time": "2017-07-16 03:00:00",
                "value": 40.73
            },
            {
                "error": False,
                "time": "2017-07-16 04:00:00",
                "value": 40.94
            },
            {
                "error": True,
                "time": "2017-07-16 05:00:00",
                "value": 40.94
            },
            {
                "error": False,
                "time": "2017-07-16 06:00:00",
                "value": 40.91
            },
            {
                "error": False,
                "time": "2017-07-16 07:00:00",
                "value": 41.04
            },
            {
                "error": False,
                "time": "2017-07-16 08:00:00",
                "value": 41.0
            },
            {
                "error": False,
                "time": "2017-07-16 09:00:00",
                "value": 41.07
            },
            {
                "error": False,
                "time": "2017-07-16 10:00:00",
                "value": 41.09
            },
            {
                "error": False,
                "time": "2017-07-16 11:00:00",
                "value": 41.1
            },
            {
                "error": False,
                "time": "2017-07-16 12:00:00",
                "value": 40.98
            },
            {
                "error": False,
                "time": "2017-07-16 13:00:00",
                "value": 41.13
            },
            {
                "error": False,
                "time": "2017-07-16 14:00:00",
                "value": 41.26
            },
            {
                "error": False,
                "time": "2017-07-16 15:00:00",
                "value": 41.27
            },
            {
                "error": False,
                "time": "2017-07-16 16:00:00",
                "value": 41.17
            },
            {
                "error": False,
                "time": "2017-07-16 17:00:00",
                "value": 41.43
            },
            {
                "error": False,
                "time": "2017-07-16 18:00:00",
                "value": 41.4
            },
            {
                "error": False,
                "time": "2017-07-16 19:00:00",
                "value": 41.5
            },
            {
                "error": False,
                "time": "2017-07-16 20:00:00",
                "value": 41.4
            },
            {
                "error": False,
                "time": "2017-07-16 21:00:00",
                "value": 41.31
            },
            {
                "error": False,
                "time": "2017-07-16 22:00:00",
                "value": 41.3
            },
            {
                "error": False,
                "time": "2017-07-16 23:00:00",
                "value": 41.33
            },
            {
                "error": False,
                "time": "2017-07-17 00:00:00",
                "value": 41.33
            },
            {
                "error": False,
                "time": "2017-07-17 01:00:00",
                "value": 41.17
            },
            {
                "error": False,
                "time": "2017-07-17 02:00:00",
                "value": 41.23
            },
            {
                "error": False,
                "time": "2017-07-17 03:00:00",
                "value": 41.33
            },
            {
                "error": False,
                "time": "2017-07-17 04:00:00",
                "value": 41.36
            },
            {
                "error": False,
                "time": "2017-07-17 05:00:00",
                "value": 41.3
            },
            {
                "error": False,
                "time": "2017-07-17 06:00:00",
                "value": 41.31
            },
            {
                "error": False,
                "time": "2017-07-17 07:00:00",
                "value": 55.35
            },
            {
                "error": False,
                "time": "2017-07-17 08:00:00",
                "value": 54.49
            },
            {
                "error": False,
                "time": "2017-07-17 09:00:00",
                "value": 51.9
            },
            {
                "error": False,
                "time": "2017-07-17 10:00:00",
                "value": 51.95
            },
            {
                "error": False,
                "time": "2017-07-17 11:00:00",
                "value": 51.51
            },
            {
                "error": False,
                "time": "2017-07-17 12:00:00",
                "value": 51.78
            },
            {
                "error": False,
                "time": "2017-07-17 13:00:00",
                "value": 52.1
            },
            {
                "error": False,
                "time": "2017-07-17 14:00:00",
                "value": 51.98
            },
            {
                "error": False,
                "time": "2017-07-17 15:00:00",
                "value": 52.09
            },
            {
                "error": False,
                "time": "2017-07-17 16:00:00",
                "value": 52.06
            },
            {
                "error": False,
                "time": "2017-07-17 17:00:00",
                "value": 52.35
            },
            {
                "error": False,
                "time": "2017-07-17 18:00:00",
                "value": 52.29
            },
            {
                "error": False,
                "time": "2017-07-17 19:00:00",
                "value": 52.76
            },
            {
                "error": False,
                "time": "2017-07-17 20:00:00",
                "value": 38.68
            },
            {
                "error": False,
                "time": "2017-07-17 21:00:00",
                "value": 40.76
            },
            {
                "error": False,
                "time": "2017-07-17 22:00:00",
                "value": 41.84
            },
            {
                "error": False,
                "time": "2017-07-17 23:00:00",
                "value": 42.08
            },
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": 41.87
            },
            {
                "error": False,
                "time": "2017-07-18 01:00:00",
                "value": 41.46
            },
            {
                "error": False,
                "time": "2017-07-18 02:00:00",
                "value": 41.5
            },
            {
                "error": False,
                "time": "2017-07-18 03:00:00",
                "value": 41.45
            },
            {
                "error": False,
                "time": "2017-07-18 04:00:00",
                "value": 41.41
            },
            {
                "error": False,
                "time": "2017-07-18 05:00:00",
                "value": 41.39
            },
            {
                "error": False,
                "time": "2017-07-18 06:00:00",
                "value": 41.64
            },
            {
                "error": False,
                "time": "2017-07-18 07:00:00",
                "value": 41.7
            },
            {
                "error": False,
                "time": "2017-07-18 08:00:00",
                "value": 54.42
            },
            {
                "error": False,
                "time": "2017-07-18 09:00:00",
                "value": 53.59
            },
            {
                "error": False,
                "time": "2017-07-18 10:00:00",
                "value": 52.93
            },
            {
                "error": False,
                "time": "2017-07-18 11:00:00",
                "value": 53.34
            },
            {
                "error": False,
                "time": "2017-07-18 12:00:00",
                "value": 53.06
            },
            {
                "error": False,
                "time": "2017-07-18 13:00:00",
                "value": 53.26
            },
            {
                "error": False,
                "time": "2017-07-18 14:00:00",
                "value": 53.08
            },
            {
                "error": False,
                "time": "2017-07-18 15:00:00",
                "value": 52.87
            },
            {
                "error": False,
                "time": "2017-07-18 16:00:00",
                "value": 52.93
            },
            {
                "error": False,
                "time": "2017-07-18 17:00:00",
                "value": 53.13
            },
            {
                "error": False,
                "time": "2017-07-18 18:00:00",
                "value": 53.58
            },
            {
                "error": False,
                "time": "2017-07-18 19:00:00",
                "value": 53.85
            },
            {
                "error": False,
                "time": "2017-07-18 20:00:00",
                "value": 53.59
            },
            {
                "error": False,
                "time": "2017-07-18 21:00:00",
                "value": 39.36
            },
            {
                "error": False,
                "time": "2017-07-18 22:00:00",
                "value": 41.3
            },
            {
                "error": False,
                "time": "2017-07-18 23:00:00",
                "value": 42.04
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": 42.05
            },
            {
                "error": False,
                "time": "2017-07-19 01:00:00",
                "value": 41.72
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_d1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-16 01:00:00',
        'timeEnd': '2017-07-19 01:00:00',
        'timeFormat': 'd1',
        'pointList': huawei_test_point_list
    })
    expected = [{
        "history": [
            {
                "error": False,
                "time": "2017-07-16 01:00:00",
                "value": 84.3
            },
            {
                "error": False,
                "time": "2017-07-17 01:00:00",
                "value": 82.4
            },
            {
                "error": False,
                "time": "2017-07-18 01:00:00",
                "value": 85.9
            },
            {
                "error": False,
                "time": "2017-07-19 01:00:00",
                "value": 86.4
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": True,
                "time": "2017-07-16 01:00:00",
                "value": 41.17
            },
            {
                "error": False,
                "time": "2017-07-17 01:00:00",
                "value": 41.17
            },
            {
                "error": False,
                "time": "2017-07-18 01:00:00",
                "value": 41.46
            },
            {
                "error": False,
                "time": "2017-07-19 01:00:00",
                "value": 41.72
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_M1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-01 00:00:00',
        'timeEnd': '2017-09-01 00:00:00',
        'timeFormat': 'M1',
        'pointList': huawei_test_point_list
    })
    expected = [{
        "history": [
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 80.8
            },
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 90.1
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 78.2
            }
        ],
        "name": "ChAMPS01"
    }, {
        "history": [
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 40.26
            },
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 42.14
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 40.7
            }
        ],
        "name": "VAV_J_54_13_Air Flow"
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


# virtual point
@pytest.mark.p0
def test_huaweiVirtual_m5_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 00:00:00',
        'timeEnd': '2017-07-20 00:20:33',
        'timeFormat': 'm5',
        'pointList': huawei_test_pointList_virtual
    })
    expected = [{
        "avg": 5.4,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-20 00:05:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-20 00:10:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-20 00:15:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-20 00:20:00",
                "value": "5.4"
            }
        ],
        "max": 5.4,
        "median": 5.4,
        "min": 5.4,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiVirtual_h1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 00:00:00',
        'timeEnd': '2017-07-20 04:20:33',
        'timeFormat': 'h1',
        'pointList': huawei_test_pointList_virtual
    })
    expected = [{
        "avg": 5.462000000000001,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-20 01:00:00",
                "value": "5.5"
            },
            {
                "error": False,
                "time": "2017-07-20 02:00:00",
                "value": "5.36"
            },
            {
                "error": False,
                "time": "2017-07-20 03:00:00",
                "value": "5.51"
            },
            {
                "error": False,
                "time": "2017-07-20 04:00:00",
                "value": "5.54"
            }
        ],
        "max": 5.54,
        "median": 5.5,
        "min": 5.36,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.06939740629158972
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiVirtual_d1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-16 00:00:00',
        'timeEnd': '2017-07-20 04:20:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_virtual
    })
    expected = [{
        "avg": 5.438,
        "history": [
            {
                "error": False,
                "time": "2017-07-16 00:00:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-17 00:00:00",
                "value": "5.27"
            },
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "5.69"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "5.4"
            }
        ],
        "max": 5.69,
        "median": 5.4,
        "min": 5.27,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.13760813929415677
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiVirtual_M1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-03-01 00:00:00',
        'timeEnd': '2017-07-20 04:20:33',
        'timeFormat': 'M1',
        'pointList': huawei_test_pointList_virtual
    })
    expected = [{
        "avg": 5.67,
        "history": [
            {
                "error": False,
                "time": "2017-03-01 00:00:00",
                "value": "5.82"
            },
            {
                "error": False,
                "time": "2017-04-01 00:00:00",
                "value": "5.83"
            },
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": "5.51"
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": "5.73"
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": "5.46"
            }
        ],
        "max": 5.83,
        "median": 5.73,
        "min": 5.46,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.1558204094462598
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiVirtual_m5_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 18:00:00',
        'timeEnd': '2017-07-20 18:20:33',
        'timeFormat': 'm5',
        'pointList': huawei_test_pointList_virtual
    })
    expected = [{
        "avg": 5.31,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:05:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:10:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:15:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:20:00",
                "value": 5.35
            }
        ],
        "max": 5.35,
        "median": 5.3,
        "min": 5.3,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.019999999999999928
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiVirtual_h1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 18:00:00',
        'timeEnd': '2017-07-20 22:20:33',
        'timeFormat': 'h1',
        'pointList': huawei_test_pointList_virtual
    })
    expected = [{
        "avg": 5.24,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 5.38
            },
            {
                "error": False,
                "time": "2017-07-20 20:00:00",
                "value": 5.32
            },
            {
                "error": False,
                "time": "2017-07-20 21:00:00",
                "value": 4.78
            },
            {
                "error": False,
                "time": "2017-07-20 22:00:00",
                "value": 5.42
            }
        ],
        "max": 5.42,
        "median": 5.32,
        "min": 4.78,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.23392306427541504
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiVirtual_d1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-21 00:00:00',
        'timeEnd': '2017-07-25 22:20:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_virtual
    })
    expected = [{
        "avg": 5.426,
        "history": [
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 5.25
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 5.33
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 5.52
            },
            {
                "error": False,
                "time": "2017-07-24 00:00:00",
                "value": 5.32
            },
            {
                "error": False,
                "time": "2017-07-25 00:00:00",
                "value": 5.71
            }
        ],
        "max": 5.71,
        "median": 5.33,
        "min": 5.25,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.1678809101714664
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiVirtual_M1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-08-01 00:00:00',
        'timeEnd': '2017-09-01 22:20:33',
        'timeFormat': 'M1',
        'pointList': huawei_test_pointList_virtual
    })
    expected = [{
        "avg": 5.195,
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 5.72
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 4.67
            }
        ],
        "max": 5.72,
        "median": 5.195,
        "min": 4.67,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.5249999999999999
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiVirtual_m5_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 17:00:00',
        'timeEnd': '2017-07-20 19:00:33',
        'timeFormat': 'm5',
        'pointList': huawei_test_pointList_virtual
    })
    expected = [{
        "avg": 5.3452,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 17:00:00",
                "value": "5.17"
            },
            {
                "error": False,
                "time": "2017-07-20 17:05:00",
                "value": "5.17"
            },
            {
                "error": False,
                "time": "2017-07-20 17:10:00",
                "value": "5.17"
            },
            {
                "error": False,
                "time": "2017-07-20 17:15:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:20:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:25:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:30:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:35:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:40:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:45:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:50:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 17:55:00",
                "value": "5.3"
            },
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:05:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:10:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:15:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 18:20:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:25:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:30:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:35:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:40:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:45:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:50:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 18:55:00",
                "value": 5.35
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 5.38
            }
        ],
        "max": 5.43,
        "median": 5.35,
        "min": 5.17,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.08030541700283979
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiVirtual_h1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 15:00:00',
        'timeEnd': '2017-07-20 20:00:33',
        'timeFormat': 'h1',
        'pointList': huawei_test_pointList_virtual
    })
    expected = [{
        "avg": 5.306666666666667,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 15:00:00",
                "value": "5.26"
            },
            {
                "error": False,
                "time": "2017-07-20 16:00:00",
                "value": "5.41"
            },
            {
                "error": False,
                "time": "2017-07-20 17:00:00",
                "value": "5.17"
            },
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 5.3
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 5.38
            },
            {
                "error": False,
                "time": "2017-07-20 20:00:00",
                "value": 5.32
            }
        ],
        "max": 5.41,
        "median": 5.3100000000000005,
        "min": 5.17,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.07866949147470638
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiVirtual_d1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_virtual
    })
    expected = [{
        "avg": 5.436666666666667,
        "history": [
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "5.69"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 5.25
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 5.33
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 5.52
            }
        ],
        "max": 5.69,
        "median": 5.415,
        "min": 5.25,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.14067298564006137
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiVirtual_M1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-05-01 00:00:00',
        'timeEnd': '2017-09-20 20:00:33',
        'timeFormat': 'M1',
        'pointList': huawei_test_pointList_virtual
    })
    expected = [{
        "avg": 5.417999999999999,
        "history": [
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": "5.51"
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": "5.73"
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": "5.46"
            },
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 5.72
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 4.67
            }
        ],
        "max": 5.73,
        "median": 5.51,
        "min": 4.67,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.38943035320837543
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


# calc point
@pytest.mark.p0
def test_huaweiCalc_m5_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 00:00:00',
        'timeEnd': '2017-07-20 00:20:33',
        'timeFormat': 'm5',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:05:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:10:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:15:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:20:00",
                "value": "54.48"
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiCalc_h1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 00:00:00',
        'timeEnd': '2017-07-20 04:20:33',
        'timeFormat': 'h1',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 01:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 02:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 03:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 04:00:00",
                "value": "54.48"
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiCalc_d1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-16 00:00:00',
        'timeEnd': '2017-07-20 04:20:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 54.452,
        "history": [
            {
                "error": False,
                "time": "2017-07-16 00:00:00",
                "value": "54.34"
            },
            {
                "error": False,
                "time": "2017-07-17 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "54.48"
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.34,
        "name": "Max_OUTDOORTemp_W",
        "std": 0.055999999999997385
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiCalc_M1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-03-01 00:00:00',
        'timeEnd': '2017-07-20 04:20:33',
        'timeFormat': 'M1',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 48.052,
        "history": [
            {
                "error": False,
                "time": "2017-03-01 00:00:00",
                "value": "43.86"
            },
            {
                "error": False,
                "time": "2017-04-01 00:00:00",
                "value": "43.83"
            },
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": "44.15"
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": "54.31"
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": "54.11"
            }
        ],
        "max": 54.31,
        "median": 44.15,
        "min": 43.83,
        "name": "Max_OUTDOORTemp_W",
        "std": 5.029625831013676
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiCalc_m5_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 18:00:00',
        'timeEnd': '2017-07-20 18:20:33',
        'timeFormat': 'm5',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:05:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:10:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:15:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:20:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiCalc_h1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 18:00:00',
        'timeEnd': '2017-07-20 22:20:33',
        'timeFormat': 'h1',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 20:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 21:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 22:00:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiCalc_d1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-21 00:00:00',
        'timeEnd': '2017-07-25 22:20:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 54.492,
        "history": [
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-24 00:00:00",
                "value": 54.51
            },
            {
                "error": False,
                "time": "2017-07-25 00:00:00",
                "value": 54.51
            }
        ],
        "max": 54.51,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0.014696938456699626
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiCalc_M1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-08-01 00:00:00',
        'timeEnd': '2017-09-01 22:20:33',
        'timeFormat': 'M1',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 54.39,
        "history": [
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 54.43
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 54.35
            }
        ],
        "max": 54.43,
        "median": 54.39,
        "min": 54.35,
        "name": "Max_OUTDOORTemp_W",
        "std": 0.03999999999999915
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiCalc_m5_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 17:00:00',
        'timeEnd': '2017-07-20 19:00:33',
        'timeFormat': 'm5',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 17:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:05:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:10:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:15:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:20:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:25:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:30:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:35:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:40:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:45:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:50:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:55:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:05:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:10:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:15:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:20:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:25:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:30:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:35:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:40:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:45:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:50:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 18:55:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiCalc_h1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 15:00:00',
        'timeEnd': '2017-07-20 20:00:33',
        'timeFormat': 'h1',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-20 15:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 16:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 17:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 18:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 19:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-20 20:00:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiCalc_d1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huaweiCalc_M1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-05-01 00:00:00',
        'timeEnd': '2017-09-20 20:00:33',
        'timeFormat': 'M1',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 52.27,
        "history": [
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": "44.15"
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": "54.31"
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": "54.11"
            },
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 54.43
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 54.35
            }
        ],
        "max": 54.43,
        "median": 54.31,
        "min": 44.15,
        "name": "Max_OUTDOORTemp_W",
        "std": 4.061369227243444
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


# check the second is single
@pytest.mark.p0
def test_huawei_d1_mix_singleSec():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:23',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_accum
    })
    expected = [{
        "avg": 5.436666666666667,
        "history": [
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "5.69"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 5.25
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 5.33
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 5.52
            }
        ],
        "max": 5.69,
        "median": 5.415,
        "min": 5.25,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.14067298564006137
    }, {
        "avg": 87.16666666666667,
        "history": [
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "88.5"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "91.0"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "83.1"
            },
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 86.1
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 88.2
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 86.1
            }
        ],
        "max": 91,
        "median": 87.15,
        "min": 83.1,
        "name": "ChAMPS01",
        "std": 2.461481035654937
    }, {
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }, {
        "avg": 42.178333333333335,
        "history": [
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "41.87"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "42.05"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "41.9"
            },
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 42.42
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 42.44
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 42.39
            }
        ],
        "max": 42.44,
        "median": 42.22,
        "min": 41.87,
        "name": "VAV_J_54_13_Air Flow",
        "std": 0.24518133878598794
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


# check the projectId is wrong
@pytest.mark.p0
def test_huawei_d1_mix_wrongId():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 1233,
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_no_history_data(rt)


# check the projectId is string
@pytest.mark.p0
def test_huawei_d1_mix_strProjId():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': '72',
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_calc
    })
    expected = [{
        "avg": 54.48,
        "history": [
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "54.48"
            },
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 54.48
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 54.48
            }
        ],
        "max": 54.48,
        "median": 54.48,
        "min": 54.48,
        "name": "Max_OUTDOORTemp_W",
        "std": 0
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


# check the timeStart is wrong
@pytest.mark.p0
def test_huawei_d1_mix_wrongTS():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# check the timeStart is float second
@pytest.mark.p0
def test_huawei_m5_new_tSFloat():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '1505800454.558458',
        'timeEnd': '2017-09-19 20:00:33',
        'timeFormat': 'm5',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# check the timeEnd is wrong
@pytest.mark.p0
def test_huawei_d1_mix_wrongTE():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:23',
        'timeEnd': '2017-07-23 :20:00',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# check the timeEnd is earier than timeSatrt
@pytest.mark.p0
def test_huawei_d1_mix_tEEailier():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-23 00:00:23',
        'timeEnd': '2016-07-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error(TestSpecific.GetHistoryDataPadded.START_TIME_GT_END_TIME, rt)


# check the timeEnd is float second
@pytest.mark.p0
def test_huawei_m5_new_tEFloat():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-09-19 00:20:00',
        'timeEnd': '1505802730.722475',
        'timeFormat': 'm5',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# check both timeSart and timeEnd are wrong
@pytest.mark.p0
def test_huawei_d1_mix_wrongTBoth():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00',
        'timeEnd': '2017-07-23 :20:00',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# check both timeSart and timeEnd are float second
@pytest.mark.p0
def test_huawei_m5_new_wrongTFloat():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '1505800454.558458',
        'timeEnd': '1505802730.722475',
        'timeFormat': 'm5',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# check the timeFormat of m5 out of range
@pytest.mark.p0
def test_huawei_m5_mix_outTimeRange():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-01-11 17:00:23',
        'timeEnd': '2017-08-11 19:20:00',
        'timeFormat': 'm5',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time range is %s days for m5" %
                                                 TestSpecific.GetHistoryDataPadded.M5_DAYS_RANGE, rt)


# check the timeFormat of h1 out of range
@pytest.mark.p0
def test_huawei_h1_mix_outTimeRange():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-01-11 17:00:23',
        'timeEnd': '2017-08-11 19:20:00',
        'timeFormat': 'h1',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time range is 60 days for h1", rt)


# check the timeFormat of d1 out of range
@pytest.mark.p0
def test_huawei_d1_mix_outTimeRange():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2016-08-11 17:00:23',
        'timeEnd': '2017-09-11 19:20:00',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time range is %s days for d1" %
                                                 TestSpecific.GetHistoryDataPadded.D1_DAYS_RANGE, rt)


# check the timeFormat of m5 out of project start time
@pytest.mark.p0
def test_huawei_m5_mix_outTimeRangeLong():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2014-01-11 17:00:23',
        'timeEnd': '2017-08-11 19:20:00',
        'timeFormat': 'm5',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time range is %s days for m5" %
                                                 TestSpecific.GetHistoryDataPadded.M5_DAYS_RANGE, rt)


# check the timeFormat of h1 out of project start time
@pytest.mark.p0
def test_huawei_h1_mix_outTimeRangeLong():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2014-01-11 17:00:23',
        'timeEnd': '2017-08-11 19:20:00',
        'timeFormat': 'h1',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time range is 60 days for h1", rt)


# check the timeFormat of d1 out of project start time
@pytest.mark.p0
def test_huawei_d1_mix_outTimeRangeLong():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2014-08-11 17:00:23',
        'timeEnd': '2017-09-11 19:20:00',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time range is %s days for d1" %
                                                 TestSpecific.GetHistoryDataPadded.D1_DAYS_RANGE, rt)


# check the timeFormat is wrong
@pytest.mark.p0
def test_huawei_d1_mix_wrongTimeFormat():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'D1',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time period format not supported", rt)


# check the timeFormat is normal string
@pytest.mark.p0
def test_huawei_d1_mix_wrongTimeFormat_normalStr():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'bgf',
        'pointList': huawei_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time period format not supported", rt)


# check the pointList is empty list
@pytest.mark.p0
def test_huawei_d1_mix_emptyPointList():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'd1',
        'pointList': []
    })
    TestCommon.GetHistoryDataPadded.assert_no_history_data(rt)


# check the pointList is empty string
@pytest.mark.p0
def test_huawei_d1_mix_emptyStringPoint():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-18 00:10:00',
        'timeFormat': 'm5',
        'pointList': ['']
    })
    TestCommon.GetHistoryDataPadded.assert_no_history_data(rt)


# check the pointList is blank
@pytest.mark.p0
def test_huawei_d1_mix_blankPoint():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'd1',
        'pointList': [' ']
    })
    TestCommon.GetHistoryDataPadded.assert_no_history_data(rt)


# check the pointList is wrong
@pytest.mark.p0
def test_huawei_d1_mix_wrongPoint():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'd1',
        'pointList': ['Max_OUTDOORTemp_W1']
    })
    TestCommon.GetHistoryDataPadded.assert_no_history_data(rt)


@pytest.mark.p0
def test_huawei_d1_mix_wrongPointList():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_wrong
    })
    expected = [{
        "avg": 5.436666666666667,
        "history": [
            {
                "error": False,
                "time": "2017-07-18 00:00:00",
                "value": "5.69"
            },
            {
                "error": False,
                "time": "2017-07-19 00:00:00",
                "value": "5.43"
            },
            {
                "error": False,
                "time": "2017-07-20 00:00:00",
                "value": "5.4"
            },
            {
                "error": False,
                "time": "2017-07-21 00:00:00",
                "value": 5.25
            },
            {
                "error": False,
                "time": "2017-07-22 00:00:00",
                "value": 5.33
            },
            {
                "error": False,
                "time": "2017-07-23 00:00:00",
                "value": 5.52
            }
        ],
        "max": 5.69,
        "median": 5.415,
        "min": 5.25,
        "name": "BaseChillerSysCOP_sec_svr",
        "std": 0.14067298564006137
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_allWrong():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': -2,
        'timeStart': '2017-04-09 25:61:61',
        'timeEnd': '2017-04-14 25:61:61',
        'timeFormat': 'sdf',
        'pointList': ['']
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# *********************************************************************************************************************
# 婷婷写在线下面
liverpoolst_test_pointList = ['L29_Chiller3_CHWsupplyTemp(LWT)', 'L29_Chiller3_CHWreturnTemp(EWT)']
liverpoolst_test_pointList_virtual = ['STG2_CWReturnT_va']
liverpoolst_test_pointList_calc = ['Accum_CTGroup_GroupEnergyM']
liverpoolst_test_pointList_accum = ['L29_Chiller3_CHWsupplyTemp(LWT)', 'L29_Chiller3_CHWreturnTemp(EWT)',
                                    'STG2_CWReturnT_va', 'Accum_CTGroup_GroupEnergyM']
liverpoolst_test_pointList_wrong = ['L29_Chiller3_CHWsupplyTemp(LWT1)', 'L29_Chiller3_CHWreturnTemp(EWT)']


@pytest.mark.p0
def test_liverpoolst_m5_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 00:00:00',
        'timeEnd': '2017-04-11 00:20:33',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList
    })
    expected = [{
        "avg": 6.664,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "6.68"
            },
            {
                "error": False,
                "time": "2017-04-11 00:05:00",
                "value": "6.68"
            },
            {
                "error": False,
                "time": "2017-04-11 00:10:00",
                "value": "6.66"
            },
            {
                "error": False,
                "time": "2017-04-11 00:15:00",
                "value": "6.68"
            },
            {
                "error": False,
                "time": "2017-04-11 00:20:00",
                "value": "6.62"
            }
        ],
        "max": 6.68,
        "median": 6.68,
        "min": 6.62,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 0.02332380757938104
    }, {
        "avg": 6.296000000000001,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "6.3"
            },
            {
                "error": False,
                "time": "2017-04-11 00:05:00",
                "value": "6.3"
            },
            {
                "error": False,
                "time": "2017-04-11 00:10:00",
                "value": "6.32"
            },
            {
                "error": False,
                "time": "2017-04-11 00:15:00",
                "value": "6.28"
            },
            {
                "error": False,
                "time": "2017-04-11 00:20:00",
                "value": "6.28"
            }
        ],
        "max": 6.32,
        "median": 6.3,
        "min": 6.28,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 0.014966629547095732
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolst_h1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 00:00:00',
        'timeEnd': '2017-04-11 04:20:33',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_pointList
    })
    expected = [{
        "avg": 6.676,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "6.68"
            },
            {
                "error": False,
                "time": "2017-04-11 01:00:00",
                "value": "6.69"
            },
            {
                "error": False,
                "time": "2017-04-11 02:00:00",
                "value": "6.69"
            },
            {
                "error": False,
                "time": "2017-04-11 03:00:00",
                "value": "6.67"
            },
            {
                "error": False,
                "time": "2017-04-11 04:00:00",
                "value": "6.65"
            }
        ],
        "max": 6.69,
        "median": 6.68,
        "min": 6.65,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 0.014966629547095779
    }, {
        "avg": 6.300000000000001,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "6.3"
            },
            {
                "error": False,
                "time": "2017-04-11 01:00:00",
                "value": "6.34"
            },
            {
                "error": False,
                "time": "2017-04-11 02:00:00",
                "value": "6.28"
            },
            {
                "error": False,
                "time": "2017-04-11 03:00:00",
                "value": "6.28"
            },
            {
                "error": False,
                "time": "2017-04-11 04:00:00",
                "value": "6.3"
            }
        ],
        "max": 6.34,
        "median": 6.3,
        "min": 6.28,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 0.021908902300206503
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolst_d1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-07 00:00:00',
        'timeEnd': '2017-04-11 04:20:33',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList
    })
    expected = [{
        "avg": 7.014,
        "history": [
            {
                "error": False,
                "time": "2017-04-07 00:00:00",
                "value": "7.41"
            },
            {
                "error": False,
                "time": "2017-04-08 00:00:00",
                "value": "7.09"
            },
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "7.06"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "6.83"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "6.68"
            }
        ],
        "max": 7.41,
        "median": 7.06,
        "min": 6.68,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 0.2490461804565572
    }, {
        "avg": 6.304,
        "history": [
            {
                "error": False,
                "time": "2017-04-07 00:00:00",
                "value": "6.35"
            },
            {
                "error": False,
                "time": "2017-04-08 00:00:00",
                "value": "6.29"
            },
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "6.3"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "6.28"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "6.3"
            }
        ],
        "max": 6.35,
        "median": 6.3,
        "min": 6.28,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 0.024166091947188967
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolst_M1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2016-12-01 00:00:00',
        'timeEnd': '2017-04-11 04:20:33',
        'timeFormat': 'M1',
        'pointList': liverpoolst_test_pointList
    })
    expected = [{
        "avg": 15.568000000000001,
        "history": [
            {
                "error": False,
                "time": "2016-12-01 00:00:00",
                "value": "11.56"
            },
            {
                "error": False,
                "time": "2017-01-01 00:00:00",
                "value": "20.14"
            },
            {
                "error": False,
                "time": "2017-02-01 00:00:00",
                "value": "13.74"
            },
            {
                "error": False,
                "time": "2017-03-01 00:00:00",
                "value": "14.1"
            },
            {
                "error": False,
                "time": "2017-04-01 00:00:00",
                "value": "18.3"
            }
        ],
        "max": 20.14,
        "median": 14.1,
        "min": 11.56,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 3.1599898734014955
    }, {
        "avg": 9.602,
        "history": [
            {
                "error": False,
                "time": "2016-12-01 00:00:00",
                "value": "8.91"
            },
            {
                "error": False,
                "time": "2017-01-01 00:00:00",
                "value": "12.26"
            },
            {
                "error": False,
                "time": "2017-02-01 00:00:00",
                "value": "13.64"
            },
            {
                "error": False,
                "time": "2017-03-01 00:00:00",
                "value": "6.43"
            },
            {
                "error": False,
                "time": "2017-04-01 00:00:00",
                "value": "6.77"
            }
        ],
        "max": 13.64,
        "median": 8.91,
        "min": 6.43,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 2.895896406986963
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolst_m5_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 18:00:00',
        'timeEnd': '2017-04-11 18:20:33',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList
    })
    expected = [{
        "avg": 14.206,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 11.54
            },
            {
                "error": False,
                "time": "2017-04-11 18:05:00",
                "value": 14.5
            },
            {
                "error": False,
                "time": "2017-04-11 18:10:00",
                "value": 15.04
            },
            {
                "error": False,
                "time": "2017-04-11 18:15:00",
                "value": 15
            },
            {
                "error": False,
                "time": "2017-04-11 18:20:00",
                "value": 14.95
            }
        ],
        "max": 15.04,
        "median": 14.95,
        "min": 11.54,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 1.3471094981477936
    }, {
        "avg": 13.916,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 11.42
            },
            {
                "error": False,
                "time": "2017-04-11 18:05:00",
                "value": 13.64
            },
            {
                "error": False,
                "time": "2017-04-11 18:10:00",
                "value": 14.86
            },
            {
                "error": False,
                "time": "2017-04-11 18:15:00",
                "value": 14.88
            },
            {
                "error": False,
                "time": "2017-04-11 18:20:00",
                "value": 14.78
            }
        ],
        "max": 14.88,
        "median": 14.78,
        "min": 11.42,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 1.3321501416882409
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolst_h1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 18:00:00',
        'timeEnd': '2017-04-11 22:20:33',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_pointList
    })
    expected = [{
        "avg": 9.926000000000002,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 11.54
            },
            {
                "error": False,
                "time": "2017-04-11 19:00:00",
                "value": 15.71
            },
            {
                "error": False,
                "time": "2017-04-11 20:00:00",
                "value": 7.98
            },
            {
                "error": False,
                "time": "2017-04-11 21:00:00",
                "value": 7.34
            },
            {
                "error": False,
                "time": "2017-04-11 22:00:00",
                "value": 7.06
            }
        ],
        "max": 15.71,
        "median": 7.98,
        "min": 7.06,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 3.3090155635777845
    }, {
        "avg": 9.138000000000002,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 11.42
            },
            {
                "error": False,
                "time": "2017-04-11 19:00:00",
                "value": 15.54
            },
            {
                "error": False,
                "time": "2017-04-11 20:00:00",
                "value": 6.24
            },
            {
                "error": False,
                "time": "2017-04-11 21:00:00",
                "value": 6.23
            },
            {
                "error": False,
                "time": "2017-04-11 22:00:00",
                "value": 6.26
            }
        ],
        "max": 15.54,
        "median": 6.26,
        "min": 6.23,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 3.7770591734840475
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolst_d1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-12 00:00:00',
        'timeEnd': '2017-04-16 22:20:33',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList
    })
    expected = [{
        "avg": 14.86,
        "history": [
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 6.86
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 15.6
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 16.38
            },
            {
                "error": False,
                "time": "2017-04-15 00:00:00",
                "value": 17.44
            },
            {
                "error": False,
                "time": "2017-04-16 00:00:00",
                "value": 18.02
            }
        ],
        "max": 18.02,
        "median": 16.38,
        "min": 6.86,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 4.08656334834051
    }, {
        "avg": 6.901999999999999,
        "history": [
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 6.28
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 7.11
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 7.23
            },
            {
                "error": False,
                "time": "2017-04-15 00:00:00",
                "value": 7.02
            },
            {
                "error": False,
                "time": "2017-04-16 00:00:00",
                "value": 6.87
            }
        ],
        "max": 7.23,
        "median": 7.02,
        "min": 6.28,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 0.33246954747765994
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolst_M1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-05-12 00:00:00',
        'timeEnd': '2017-09-12 00:00:00',
        'timeFormat': 'M1',
        'pointList': liverpoolst_test_pointList
    })
    expected = [{
        "avg": 13.484,
        "history": [
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": 17.6
            },
            {
                "error": True,
                "time": "2017-06-01 00:00:00",
                "value": 17.6
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 10.81
            },
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 9.93
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 11.48
            }
        ],
        "max": 17.6,
        "median": 11.48,
        "min": 9.93,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 3.3964722875359965
    }, {
        "avg": 7.087999999999999,
        "history": [
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": 6.65
            },
            {
                "error": True,
                "time": "2017-06-01 00:00:00",
                "value": 6.65
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 8.93
            },
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 6.28
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 6.93
            }
        ],
        "max": 8.93,
        "median": 6.65,
        "min": 6.28,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 0.9438728727959076
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolst_m5_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 17:00:00',
        'timeEnd': '2017-04-11 19:00:00',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList
    })
    expected = [{
        "avg": 12.388399999999999,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 17:00:00",
                "value": "9.77"
            },
            {
                "error": True,
                "time": "2017-04-11 17:05:00",
                "value": "9.77"
            },
            {
                "error": True,
                "time": "2017-04-11 17:10:00",
                "value": "9.77"
            },
            {
                "error": True,
                "time": "2017-04-11 17:15:00",
                "value": "9.77"
            },
            {
                "error": True,
                "time": "2017-04-11 17:20:00",
                "value": "9.77"
            },
            {
                "error": True,
                "time": "2017-04-11 17:25:00",
                "value": "9.77"
            },
            {
                "error": True,
                "time": "2017-04-11 17:30:00",
                "value": "9.77"
            },
            {
                "error": True,
                "time": "2017-04-11 17:35:00",
                "value": "9.77"
            },
            {
                "error": True,
                "time": "2017-04-11 17:40:00",
                "value": "9.77"
            },
            {
                "error": True,
                "time": "2017-04-11 17:45:00",
                "value": "9.77"
            },
            {
                "error": True,
                "time": "2017-04-11 17:50:00",
                "value": "9.77"
            },
            {
                "error": True,
                "time": "2017-04-11 17:55:00",
                "value": "9.77"
            },
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 11.54
            },
            {
                "error": False,
                "time": "2017-04-11 18:05:00",
                "value": 14.5
            },
            {
                "error": False,
                "time": "2017-04-11 18:10:00",
                "value": 15.04
            },
            {
                "error": False,
                "time": "2017-04-11 18:15:00",
                "value": 15
            },
            {
                "error": False,
                "time": "2017-04-11 18:20:00",
                "value": 14.95
            },
            {
                "error": False,
                "time": "2017-04-11 18:25:00",
                "value": 14.95
            },
            {
                "error": False,
                "time": "2017-04-11 18:30:00",
                "value": 15.15
            },
            {
                "error": False,
                "time": "2017-04-11 18:35:00",
                "value": 14.97
            },
            {
                "error": False,
                "time": "2017-04-11 18:40:00",
                "value": 14.96
            },
            {
                "error": False,
                "time": "2017-04-11 18:45:00",
                "value": 15.19
            },
            {
                "error": False,
                "time": "2017-04-11 18:50:00",
                "value": 15.15
            },
            {
                "error": False,
                "time": "2017-04-11 18:55:00",
                "value": 15.36
            },
            {
                "error": False,
                "time": "2017-04-11 19:00:00",
                "value": 15.71
            }
        ],
        "max": 15.71,
        "median": 11.54,
        "min": 9.77,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 2.6128064298757385
    }, {
        "avg": 10.532,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 17:00:00",
                "value": "6.13"
            },
            {
                "error": True,
                "time": "2017-04-11 17:05:00",
                "value": "6.13"
            },
            {
                "error": True,
                "time": "2017-04-11 17:10:00",
                "value": "6.13"
            },
            {
                "error": True,
                "time": "2017-04-11 17:15:00",
                "value": "6.13"
            },
            {
                "error": True,
                "time": "2017-04-11 17:20:00",
                "value": "6.13"
            },
            {
                "error": True,
                "time": "2017-04-11 17:25:00",
                "value": "6.13"
            },
            {
                "error": True,
                "time": "2017-04-11 17:30:00",
                "value": "6.13"
            },
            {
                "error": True,
                "time": "2017-04-11 17:35:00",
                "value": "6.13"
            },
            {
                "error": True,
                "time": "2017-04-11 17:40:00",
                "value": "6.13"
            },
            {
                "error": True,
                "time": "2017-04-11 17:45:00",
                "value": "6.13"
            },
            {
                "error": True,
                "time": "2017-04-11 17:50:00",
                "value": "6.13"
            },
            {
                "error": True,
                "time": "2017-04-11 17:55:00",
                "value": "6.13"
            },
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 11.42
            },
            {
                "error": False,
                "time": "2017-04-11 18:05:00",
                "value": 13.64
            },
            {
                "error": False,
                "time": "2017-04-11 18:10:00",
                "value": 14.86
            },
            {
                "error": False,
                "time": "2017-04-11 18:15:00",
                "value": 14.88
            },
            {
                "error": False,
                "time": "2017-04-11 18:20:00",
                "value": 14.78
            },
            {
                "error": False,
                "time": "2017-04-11 18:25:00",
                "value": 14.78
            },
            {
                "error": False,
                "time": "2017-04-11 18:30:00",
                "value": 14.68
            },
            {
                "error": False,
                "time": "2017-04-11 18:35:00",
                "value": 14.86
            },
            {
                "error": False,
                "time": "2017-04-11 18:40:00",
                "value": 15
            },
            {
                "error": False,
                "time": "2017-04-11 18:45:00",
                "value": 14.92
            },
            {
                "error": False,
                "time": "2017-04-11 18:50:00",
                "value": 15.16
            },
            {
                "error": False,
                "time": "2017-04-11 18:55:00",
                "value": 15.22
            },
            {
                "error": False,
                "time": "2017-04-11 19:00:00",
                "value": 15.54
            }
        ],
        "max": 15.54,
        "median": 11.42,
        "min": 6.13,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 4.291097761645615
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolst_h1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 15:00:00',
        'timeEnd': '2017-04-11 20:20:00',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_pointList
    })
    expected = [{
        "avg": 10.868333333333332,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 15:00:00",
                "value": "10.27"
            },
            {
                "error": False,
                "time": "2017-04-11 16:00:00",
                "value": "9.94"
            },
            {
                "error": False,
                "time": "2017-04-11 17:00:00",
                "value": "9.77"
            },
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 11.54
            },
            {
                "error": False,
                "time": "2017-04-11 19:00:00",
                "value": 15.71
            },
            {
                "error": False,
                "time": "2017-04-11 20:00:00",
                "value": 7.98
            }
        ],
        "max": 15.71,
        "median": 10.105,
        "min": 7.98,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 2.403521143840613
    }, {
        "avg": 8.635,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 15:00:00",
                "value": "6.2"
            },
            {
                "error": False,
                "time": "2017-04-11 16:00:00",
                "value": "6.28"
            },
            {
                "error": False,
                "time": "2017-04-11 17:00:00",
                "value": "6.13"
            },
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 11.42
            },
            {
                "error": False,
                "time": "2017-04-11 19:00:00",
                "value": 15.54
            },
            {
                "error": False,
                "time": "2017-04-11 20:00:00",
                "value": 6.24
            }
        ],
        "max": 15.54,
        "median": 6.26,
        "min": 6.13,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 3.6267880647573913
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolst_d1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:00',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList
    })
    expected = [{
        "avg": 9.901666666666666,
        "history": [
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "7.06"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "6.83"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "6.68"
            },
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 6.86
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 15.6
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 16.38
            }
        ],
        "max": 16.38,
        "median": 6.96,
        "min": 6.68,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 4.312402333837705
    }, {
        "avg": 6.583333333333333,
        "history": [
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "6.3"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "6.28"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "6.3"
            },
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 6.28
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 7.11
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 7.23
            }
        ],
        "max": 7.23,
        "median": 6.3,
        "min": 6.28,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 0.4163598870635303
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolst_M1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-02-01 00:00:00',
        'timeEnd': '2017-07-14 21:20:00',
        'timeFormat': 'M1',
        'pointList': liverpoolst_test_pointList
    })
    expected = [{
        "avg": 15.358333333333334,
        "history": [
            {
                "error": False,
                "time": "2017-02-01 00:00:00",
                "value": "13.74"
            },
            {
                "error": False,
                "time": "2017-03-01 00:00:00",
                "value": "14.1"
            },
            {
                "error": False,
                "time": "2017-04-01 00:00:00",
                "value": "18.3"
            },
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": 17.6
            },
            {
                "error": True,
                "time": "2017-06-01 00:00:00",
                "value": 17.6
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 10.81
            }
        ],
        "max": 18.3,
        "median": 15.850000000000001,
        "min": 10.81,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 2.6954679041350547
    }, {
        "avg": 8.178333333333333,
        "history": [
            {
                "error": False,
                "time": "2017-02-01 00:00:00",
                "value": "13.64"
            },
            {
                "error": False,
                "time": "2017-03-01 00:00:00",
                "value": "6.43"
            },
            {
                "error": False,
                "time": "2017-04-01 00:00:00",
                "value": "6.77"
            },
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": 6.65
            },
            {
                "error": True,
                "time": "2017-06-01 00:00:00",
                "value": 6.65
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 8.93
            }
        ],
        "max": 13.64,
        "median": 6.71,
        "min": 6.43,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 2.5854233480977324
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstVirtual_m5_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 00:00:20',
        'timeEnd': '2017-04-11 00:20:00',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList_virtual
    })
    expected = [{
        "avg": 22.22,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "22.5"
            },
            {
                "error": False,
                "time": "2017-04-11 00:05:00",
                "value": "22.3"
            },
            {
                "error": False,
                "time": "2017-04-11 00:10:00",
                "value": "22.3"
            },
            {
                "error": False,
                "time": "2017-04-11 00:15:00",
                "value": "22.0"
            },
            {
                "error": False,
                "time": "2017-04-11 00:20:00",
                "value": "22.0"
            }
        ],
        "max": 22.5,
        "median": 22.3,
        "min": 22,
        "name": "STG2_CWReturnT_va",
        "std": 0.19390719429665326
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstVirtual_h1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 00:00:20',
        'timeEnd': '2017-04-11 04:20:33',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_pointList_virtual
    })
    expected = [{
        "avg": 20.72,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "22.5"
            },
            {
                "error": False,
                "time": "2017-04-11 01:00:00",
                "value": "21.2"
            },
            {
                "error": False,
                "time": "2017-04-11 02:00:00",
                "value": "20.8"
            },
            {
                "error": False,
                "time": "2017-04-11 03:00:00",
                "value": "20.1"
            },
            {
                "error": False,
                "time": "2017-04-11 04:00:00",
                "value": "19.0"
            }
        ],
        "max": 22.5,
        "median": 20.8,
        "min": 19,
        "name": "STG2_CWReturnT_va",
        "std": 1.1617228585166084
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstVirtual_d1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-07 00:00:20',
        'timeEnd': '2017-04-11 04:20:33',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_virtual
    })
    expected = [{
        "avg": 23.520000000000003,
        "history": [
            {
                "error": False,
                "time": "2017-04-07 00:00:00",
                "value": "24.0"
            },
            {
                "error": False,
                "time": "2017-04-08 00:00:00",
                "value": "24.0"
            },
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "23.9"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "23.2"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "22.5"
            }
        ],
        "max": 24,
        "median": 23.9,
        "min": 22.5,
        "name": "STG2_CWReturnT_va",
        "std": 0.5912698199637791
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstVirtual_M1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2016-12-01 00:00:20',
        'timeEnd': '2017-04-11 04:20:33',
        'timeFormat': 'M1',
        'pointList': liverpoolst_test_pointList_virtual
    })
    expected = [{
        "avg": 22.496000000000002,
        "history": [
            {
                "error": False,
                "time": "2016-12-01 00:00:00",
                "value": "22.66"
            },
            {
                "error": False,
                "time": "2017-01-01 00:00:00",
                "value": "24.54"
            },
            {
                "error": False,
                "time": "2017-02-01 00:00:00",
                "value": "22.08"
            },
            {
                "error": False,
                "time": "2017-03-01 00:00:00",
                "value": "24.0"
            },
            {
                "error": False,
                "time": "2017-04-01 00:00:00",
                "value": "19.2"
            }
        ],
        "max": 24.54,
        "median": 22.66,
        "min": 19.2,
        "name": "STG2_CWReturnT_va",
        "std": 1.8710168358408752
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstVirtual_m5_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 18:00:20',
        'timeEnd': '2017-04-11 18:20:33',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList_virtual
    })
    expected = [{
        "avg": 24.060000000000002,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 24.8
            },
            {
                "error": False,
                "time": "2017-04-11 18:05:00",
                "value": 24.8
            },
            {
                "error": False,
                "time": "2017-04-11 18:10:00",
                "value": 23.3
            },
            {
                "error": False,
                "time": "2017-04-11 18:15:00",
                "value": 23.7
            },
            {
                "error": False,
                "time": "2017-04-11 18:20:00",
                "value": 23.7
            }
        ],
        "max": 24.8,
        "median": 23.7,
        "min": 23.3,
        "name": "STG2_CWReturnT_va",
        "std": 0.6216108107168025
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstVirtual_h1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 18:00:20',
        'timeEnd': '2017-04-11 22:20:33',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_pointList_virtual
    })
    expected = [{
        "avg": 22.14,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 24.8
            },
            {
                "error": False,
                "time": "2017-04-11 19:00:00",
                "value": 22.2
            },
            {
                "error": False,
                "time": "2017-04-11 20:00:00",
                "value": 21
            },
            {
                "error": False,
                "time": "2017-04-11 21:00:00",
                "value": 21.7
            },
            {
                "error": False,
                "time": "2017-04-11 22:00:00",
                "value": 21
            }
        ],
        "max": 24.8,
        "median": 21.7,
        "min": 21,
        "name": "STG2_CWReturnT_va",
        "std": 1.405133445620024
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstVirtual_d1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-12 00:00:20',
        'timeEnd': '2017-04-16 22:20:33',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_virtual
    })
    expected = [{
        "avg": 19.78,
        "history": [
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 18.8
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 19
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 19.7
            },
            {
                "error": False,
                "time": "2017-04-15 00:00:00",
                "value": 20.4
            },
            {
                "error": False,
                "time": "2017-04-16 00:00:00",
                "value": 21
            }
        ],
        "max": 21,
        "median": 19.7,
        "min": 18.8,
        "name": "STG2_CWReturnT_va",
        "std": 0.8304215796810674
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstVirtual_M1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-05-12 00:00:20',
        'timeEnd': '2017-09-12 00:00:20',
        'timeFormat': 'M1',
        'pointList': liverpoolst_test_pointList_virtual
    })
    expected = [{
        "avg": 18.644,
        "history": [
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": 19.4
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": 20.24
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 13.42
            },
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 17.12
            },
            {
                "error": False,
                "time": "2017-09-01 00:00:00",
                "value": 23.04
            }
        ],
        "max": 23.04,
        "median": 19.4,
        "min": 13.42,
        "name": "STG2_CWReturnT_va",
        "std": 3.226649035764503
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstVirtual_m5_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 17:00:20',
        'timeEnd': '2017-04-11 19:00:00',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList_virtual
    })
    expected = [{
        "avg": 24.131999999999998,
        "history": [
            {
                "error": True,
                "time": "2017-04-11 17:00:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 17:05:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 17:10:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 17:15:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 17:20:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 17:25:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 17:30:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 17:35:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 17:40:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 17:45:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 17:50:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 17:55:00",
                "value": 24.8
            },
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 24.8
            },
            {
                "error": False,
                "time": "2017-04-11 18:05:00",
                "value": 24.8
            },
            {
                "error": False,
                "time": "2017-04-11 18:10:00",
                "value": 23.3
            },
            {
                "error": False,
                "time": "2017-04-11 18:15:00",
                "value": 23.7
            },
            {
                "error": False,
                "time": "2017-04-11 18:20:00",
                "value": 23.7
            },
            {
                "error": False,
                "time": "2017-04-11 18:25:00",
                "value": 23.6
            },
            {
                "error": False,
                "time": "2017-04-11 18:30:00",
                "value": 23.6
            },
            {
                "error": False,
                "time": "2017-04-11 18:35:00",
                "value": 23.5
            },
            {
                "error": False,
                "time": "2017-04-11 18:40:00",
                "value": 23.5
            },
            {
                "error": False,
                "time": "2017-04-11 18:45:00",
                "value": 23
            },
            {
                "error": False,
                "time": "2017-04-11 18:50:00",
                "value": 23
            },
            {
                "error": False,
                "time": "2017-04-11 18:55:00",
                "value": 23
            },
            {
                "error": False,
                "time": "2017-04-11 19:00:00",
                "value": 22.2
            }
        ],
        "max": 24.8,
        "median": 24.8,
        "min": 22.2,
        "name": "STG2_CWReturnT_va",
        "std": 0.8063349180086402
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstVirtual_h1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 15:00:20',
        'timeEnd': '2017-04-11 20:20:00',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_pointList_virtual
    })
    expected = [{
        "avg": 23.733333333333334,
        "history": [
            {
                "error": True,
                "time": "2017-04-11 15:00:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 16:00:00",
                "value": 24.8
            },
            {
                "error": True,
                "time": "2017-04-11 17:00:00",
                "value": 24.8
            },
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 24.8
            },
            {
                "error": False,
                "time": "2017-04-11 19:00:00",
                "value": 22.2
            },
            {
                "error": False,
                "time": "2017-04-11 20:00:00",
                "value": 21
            }
        ],
        "max": 24.8,
        "median": 24.8,
        "min": 21,
        "name": "STG2_CWReturnT_va",
        "std": 1.547758235499187
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstVirtual_d1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:20',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_virtual
    })
    expected = [{
        "avg": 21.183333333333334,
        "history": [
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "23.9"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "23.2"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "22.5"
            },
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 18.8
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 19
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 19.7
            }
        ],
        "max": 23.9,
        "median": 21.1,
        "min": 18.8,
        "name": "STG2_CWReturnT_va",
        "std": 2.074782451781926
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstVirtual_M1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-02-01 00:00:20',
        'timeEnd': '2017-07-14 21:20:00',
        'timeFormat': 'M1',
        'pointList': liverpoolst_test_pointList_virtual
    })
    expected = [{
        "avg": 19.723333333333333,
        "history": [
            {
                "error": False,
                "time": "2017-02-01 00:00:00",
                "value": "22.08"
            },
            {
                "error": False,
                "time": "2017-03-01 00:00:00",
                "value": "24.0"
            },
            {
                "error": False,
                "time": "2017-04-01 00:00:00",
                "value": "19.2"
            },
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": 19.4
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": 20.24
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 13.42
            }
        ],
        "max": 24,
        "median": 19.82,
        "min": 13.42,
        "name": "STG2_CWReturnT_va",
        "std": 3.271623789836206
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstCalc_m5_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 00:00:20',
        'timeEnd': '2017-04-11 00:20:33',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 7437.12,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "7435.1"
            },
            {
                "error": False,
                "time": "2017-04-11 00:05:00",
                "value": "7436.7"
            },
            {
                "error": False,
                "time": "2017-04-11 00:10:00",
                "value": "7437.5"
            },
            {
                "error": False,
                "time": "2017-04-11 00:15:00",
                "value": "7438.0"
            },
            {
                "error": False,
                "time": "2017-04-11 00:20:00",
                "value": "7438.3"
            }
        ],
        "max": 7438.3,
        "median": 7437.5,
        "min": 7435.1,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 1.146123902551475
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstCalc_h1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 00:00:22',
        'timeEnd': '2017-04-11 04:20:33',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 7443.26,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "7435.1"
            },
            {
                "error": False,
                "time": "2017-04-11 01:00:00",
                "value": "7443.2"
            },
            {
                "error": False,
                "time": "2017-04-11 02:00:00",
                "value": "7446.0"
            },
            {
                "error": False,
                "time": "2017-04-11 03:00:00",
                "value": "7446.0"
            },
            {
                "error": False,
                "time": "2017-04-11 04:00:00",
                "value": "7446.0"
            }
        ],
        "max": 7446,
        "median": 7446,
        "min": 7435.1,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 4.221658441892098
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstCalc_d1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-07 00:00:22',
        'timeEnd': '2017-04-11 04:20:33',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 5806.06,
        "history": [
            {
                "error": False,
                "time": "2017-04-07 00:00:00",
                "value": "3643.2"
            },
            {
                "error": False,
                "time": "2017-04-08 00:00:00",
                "value": "5324.7"
            },
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "5992.6"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "6634.7"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "7435.1"
            }
        ],
        "max": 7435.1,
        "median": 5992.6,
        "min": 3643.2,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 1287.2360756287094
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstCalc_M1_old():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2016-12-01 00:00:22',
        'timeEnd': '2017-04-11 04:20:33',
        'timeFormat': 'M1',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 50928.84299999999,
        "history": [
            {
                "error": False,
                "time": "2016-12-01 00:00:00",
                "value": "44922.270000000004"
            },
            {
                "error": False,
                "time": "2017-01-01 00:00:00",
                "value": "62943.70333333334"
            },
            {
                "error": False,
                "time": "2017-02-01 00:00:00",
                "value": "78907.66666666663"
            },
            {
                "error": False,
                "time": "2017-03-01 00:00:00",
                "value": "58860.475000000035"
            },
            {
                "error": False,
                "time": "2017-04-01 00:00:00",
                "value": "9010.099999999977"
            }
        ],
        "max": 78907.66666666663,
        "median": 58860.475000000035,
        "min": 9010.099999999977,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 23593.821914593387
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstCalc_m5_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 18:00:22',
        'timeEnd': '2017-04-11 18:20:33',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 8361.52,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 8365.9
            },
            {
                "error": True,
                "time": "2017-04-11 18:05:00",
                "value": 8365.9
            },
            {
                "error": False,
                "time": "2017-04-11 18:10:00",
                "value": 8358.6
            },
            {
                "error": True,
                "time": "2017-04-11 18:15:00",
                "value": 8358.6
            },
            {
                "error": False,
                "time": "2017-04-11 18:20:00",
                "value": 8358.6
            }
        ],
        "max": 8365.9,
        "median": 8358.6,
        "min": 8358.6,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 3.5762550244630833
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstCalc_h1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 18:00:22',
        'timeEnd': '2017-04-11 22:20:33',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 8362.84,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 8365.9
            },
            {
                "error": False,
                "time": "2017-04-11 19:00:00",
                "value": 8358.6
            },
            {
                "error": True,
                "time": "2017-04-11 20:00:00",
                "value": 8358.6
            },
            {
                "error": True,
                "time": "2017-04-11 21:00:00",
                "value": 8358.6
            },
            {
                "error": False,
                "time": "2017-04-11 22:00:00",
                "value": 8372.5
            }
        ],
        "max": 8372.5,
        "median": 8358.6,
        "min": 8358.6,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 5.596641850252498
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstCalc_d1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-12 00:00:22',
        'timeEnd': '2017-04-16 22:20:33',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 8822.8,
        "history": [
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 8372.5
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 8711.2
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 9010.1
            },
            {
                "error": True,
                "time": "2017-04-15 00:00:00",
                "value": 9010.1
            },
            {
                "error": True,
                "time": "2017-04-16 00:00:00",
                "value": 9010.1
            }
        ],
        "max": 9010.1,
        "median": 9010.1,
        "min": 8372.5,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 253.16734386567327
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstCalc_M1_new():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-05-12 00:00:22',
        'timeEnd': '2017-08-12 22:20:33',
        'timeFormat': 'M1',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 10162.350000000002,
        "history": [
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": 24673.40000000001
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": 6500
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 4896.099999999991
            },
            {
                "error": False,
                "time": "2017-08-01 00:00:00",
                "value": 4579.900000000009
            }
        ],
        "max": 24673.40000000001,
        "median": 5698.049999999996,
        "min": 4579.900000000009,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 8409.52609678453
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstCalc_m5_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 17:00:22',
        'timeEnd': '2017-04-11 19:00:33',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 8335.016,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 17:00:00",
                "value": "8255.4"
            },
            {
                "error": False,
                "time": "2017-04-11 17:05:00",
                "value": "8265.4"
            },
            {
                "error": False,
                "time": "2017-04-11 17:10:00",
                "value": "8275.4"
            },
            {
                "error": False,
                "time": "2017-04-11 17:15:00",
                "value": "8285.4"
            },
            {
                "error": False,
                "time": "2017-04-11 17:20:00",
                "value": "8295.4"
            },
            {
                "error": False,
                "time": "2017-04-11 17:25:00",
                "value": "8305.4"
            },
            {
                "error": False,
                "time": "2017-04-11 17:30:00",
                "value": "8315.4"
            },
            {
                "error": False,
                "time": "2017-04-11 17:35:00",
                "value": "8325.4"
            },
            {
                "error": True,
                "time": "2017-04-11 17:40:00",
                "value": "8325.4"
            },
            {
                "error": False,
                "time": "2017-04-11 17:45:00",
                "value": "8345.4"
            },
            {
                "error": False,
                "time": "2017-04-11 17:50:00",
                "value": "8352.5"
            },
            {
                "error": True,
                "time": "2017-04-11 17:55:00",
                "value": "8352.5"
            },
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 8365.9
            },
            {
                "error": True,
                "time": "2017-04-11 18:05:00",
                "value": 8365.9
            },
            {
                "error": False,
                "time": "2017-04-11 18:10:00",
                "value": 8358.6
            },
            {
                "error": True,
                "time": "2017-04-11 18:15:00",
                "value": 8358.6
            },
            {
                "error": False,
                "time": "2017-04-11 18:20:00",
                "value": 8358.6
            },
            {
                "error": True,
                "time": "2017-04-11 18:25:00",
                "value": 8358.6
            },
            {
                "error": False,
                "time": "2017-04-11 18:30:00",
                "value": 8358.6
            },
            {
                "error": False,
                "time": "2017-04-11 18:35:00",
                "value": 8358.6
            },
            {
                "error": True,
                "time": "2017-04-11 18:40:00",
                "value": 8358.6
            },
            {
                "error": False,
                "time": "2017-04-11 18:45:00",
                "value": 8358.6
            },
            {
                "error": False,
                "time": "2017-04-11 18:50:00",
                "value": 8358.6
            },
            {
                "error": True,
                "time": "2017-04-11 18:55:00",
                "value": 8358.6
            },
            {
                "error": False,
                "time": "2017-04-11 19:00:00",
                "value": 8358.6
            }
        ],
        "max": 8365.9,
        "median": 8358.6,
        "min": 8255.4,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 34.03661181727723
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstCalc_h1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-11 15:00:22',
        'timeEnd': '2017-04-11 20:20:33',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 8248.216666666665,
        "history": [
            {
                "error": False,
                "time": "2017-04-11 15:00:00",
                "value": "8015.4"
            },
            {
                "error": False,
                "time": "2017-04-11 16:00:00",
                "value": "8135.4"
            },
            {
                "error": False,
                "time": "2017-04-11 17:00:00",
                "value": "8255.4"
            },
            {
                "error": False,
                "time": "2017-04-11 18:00:00",
                "value": 8365.9
            },
            {
                "error": False,
                "time": "2017-04-11 19:00:00",
                "value": 8358.6
            },
            {
                "error": True,
                "time": "2017-04-11 20:00:00",
                "value": 8358.6
            }
        ],
        "max": 8365.9,
        "median": 8307,
        "min": 8015.4,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 132.41420387892285
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstCalc_d1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:22',
        'timeEnd': '2017-04-14 21:20:33',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 7692.700000000001,
        "history": [
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "5992.6"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "6634.7"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "7435.1"
            },
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 8372.5
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 8711.2
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 9010.1
            }
        ],
        "max": 9010.1,
        "median": 7903.8,
        "min": 5992.6,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 1103.8625231431677
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolstCalc_M1_mix():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-02-01 00:00:22',
        'timeEnd': '2017-07-14 21:20:33',
        'timeFormat': 'M1',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 30474.623611111107,
        "history": [
            {
                "error": False,
                "time": "2017-02-01 00:00:00",
                "value": "78907.66666666663"
            },
            {
                "error": False,
                "time": "2017-03-01 00:00:00",
                "value": "58860.475000000035"
            },
            {
                "error": False,
                "time": "2017-04-01 00:00:00",
                "value": "9010.099999999977"
            },
            {
                "error": False,
                "time": "2017-05-01 00:00:00",
                "value": 24673.40000000001
            },
            {
                "error": False,
                "time": "2017-06-01 00:00:00",
                "value": 6500
            },
            {
                "error": False,
                "time": "2017-07-01 00:00:00",
                "value": 4896.099999999991
            }
        ],
        "max": 78907.66666666663,
        "median": 16841.749999999993,
        "min": 4896.099999999991,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 28504.20914926442
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


# check the second is single
@pytest.mark.p0
def test_liverpoolst_d1_mix_singleSec():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_accum
    })
    expected = [{
        "avg": 7692.700000000001,
        "history": [
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "5992.6"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "6634.7"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "7435.1"
            },
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 8372.5
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 8711.2
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 9010.1
            }
        ],
        "max": 9010.1,
        "median": 7903.8,
        "min": 5992.6,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 1103.8625231431677
    }, {
        "avg": 9.901666666666666,
        "history": [
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "7.06"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "6.83"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "6.68"
            },
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 6.86
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 15.6
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 16.38
            }
        ],
        "max": 16.38,
        "median": 6.96,
        "min": 6.68,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 4.312402333837705
    }, {
        "avg": 6.583333333333333,
        "history": [
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "6.3"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "6.28"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "6.3"
            },
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 6.28
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 7.11
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 7.23
            }
        ],
        "max": 7.23,
        "median": 6.3,
        "min": 6.28,
        "name": "L29_Chiller3_CHWsupplyTemp(LWT)",
        "std": 0.4163598870635303
    }, {
        "avg": 21.183333333333334,
        "history": [
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "23.9"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "23.2"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "22.5"
            },
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 18.8
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 19
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 19.7
            }
        ],
        "max": 23.9,
        "median": 21.1,
        "min": 18.8,
        "name": "STG2_CWReturnT_va",
        "std": 2.074782451781926
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


# check the projectId is wrong
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongId():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 1233,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_no_history_data(rt)


# check the projectId is string
@pytest.mark.p0
def test_liverpoolst_d1_mix_strProjId():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': '293',
        'timeStart': '2017-04-09 00:00:22',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_calc
    })
    expected = [{
        "avg": 7692.700000000001,
        "history": [
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "5992.6"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "6634.7"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "7435.1"
            },
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 8372.5
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 8711.2
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 9010.1
            }
        ],
        "max": 9010.1,
        "median": 7903.8,
        "min": 5992.6,
        "name": "Accum_CTGroup_GroupEnergyM",
        "std": 1103.8625231431677
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


# check the timeStart is wrong
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongTS():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# check the timeStart is float second
@pytest.mark.p0
def test_liverpoolst_m5_new_tSFloat():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '1505800454.558458',
        'timeEnd': '2017-09-19 14:20:00',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# check the timeEnd is wrong
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongTE():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 :20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# check the timeEnd is earier than timeSatrt
@pytest.mark.p0
def test_liverpoolst_d1_mix_tEEailier():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-20 00:00:23',
        'timeEnd': '2016-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error(TestSpecific.GetHistoryDataPadded.START_TIME_GT_END_TIME, rt)


# check the timeEnd is float second
@pytest.mark.p0
def test_liverpoolst_m5_new_tEFloat():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-09-19 00:20:00',
        'timeEnd': '1505802730.722475',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# check both timeSart and timeEnd are wrong
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongTBoth():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00',
        'timeEnd': '2017-04-14 :20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# check both timeSart and timeEnd are float second
@pytest.mark.p0
def test_liverpoolst_m5_new_wrongTFloat():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '1505800454.558458',
        'timeEnd': '1505802730.722475',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


# check the timeFormat of m5 out of range
@pytest.mark.p0
def test_liverpoolst_m5_mix_outTimeRange():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-01-11 17:00:23',
        'timeEnd': '2017-08-11 19:20:00',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time range is %s days for m5" %
                                                 TestSpecific.GetHistoryDataPadded.M5_DAYS_RANGE, rt)


# check the timeFormat of h1 out of range
@pytest.mark.p0
def test_liverpoolst_h1_mix_outTimeRange():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-01-11 17:00:23',
        'timeEnd': '2017-08-11 19:20:00',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time range is 60 days for h1", rt)


# check the timeFormat of d1 out of range
@pytest.mark.p0
def test_liverpoolst_d1_mix_outTimeRange():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2016-08-11 17:00:23',
        'timeEnd': '2017-09-11 19:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time range is %s days for d1" %
                                                 TestSpecific.GetHistoryDataPadded.D1_DAYS_RANGE, rt)


# check the timeFormat of m5 out of project start time
@pytest.mark.p0
def test_liverpoolst_m5_mix_outTimeRangeLong():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2014-01-11 17:00:23',
        'timeEnd': '2017-08-11 19:20:00',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time range is %s days for m5" %
                                                 TestSpecific.GetHistoryDataPadded.M5_DAYS_RANGE, rt)


# check the timeFormat of h1 out of project start time
@pytest.mark.p0
def test_liverpoolst_h1_mix_outTimeRangeLong():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2014-01-11 17:00:23',
        'timeEnd': '2017-08-11 19:20:00',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time range is 60 days for h1", rt)


# check the timeFormat of d1 out of project start time
@pytest.mark.p0
def test_liverpoolst_d1_mix_outTimeRangeLong():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2014-08-11 17:00:23',
        'timeEnd': '2017-09-11 19:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time range is %s days for d1" %
                                                 TestSpecific.GetHistoryDataPadded.D1_DAYS_RANGE, rt)


# check the timeFormat is wrong
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongTimeFormat():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'D1',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time period format not supported", rt)


# check the timeFormat is normal string
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongTimeFormat_normalStr():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'bgf',
        'pointList': liverpoolst_test_pointList_accum
    })
    TestCommon.GetHistoryDataPadded.assert_error("time period format not supported", rt)


# check the pointList is empty list
@pytest.mark.p0
def test_liverpoolst_d1_mix_emptyPointList():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': []
    })
    TestCommon.GetHistoryDataPadded.assert_no_history_data(rt)


# check the pointList is empty string
@pytest.mark.p0
def test_liverpoolst_d1_mix_emptyStringPoint():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-10 21:20:00',
        'timeFormat': 'd1',
        'pointList': ['']
    })
    # TODO: The logic here is really weird. Let's fix it someday
    TestCommon.GetHistoryDataPadded.assert_no_history_data(rt)


# check the pointList is blank
@pytest.mark.p0
def test_liverpoolst_d1_mix_blankPoint():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': [' ']
    })
    TestCommon.GetHistoryDataPadded.assert_no_history_data(rt)


# check the pointList is wrong
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongPoint():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': ['L29_Chiller3_CHWsupplyTemp(LWT)001']
    })
    TestCommon.GetHistoryDataPadded.assert_no_history_data(rt)


@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongPointList():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_wrong
    })
    expected = [{
        "avg": 9.901666666666666,
        "history": [
            {
                "error": False,
                "time": "2017-04-09 00:00:00",
                "value": "7.06"
            },
            {
                "error": False,
                "time": "2017-04-10 00:00:00",
                "value": "6.83"
            },
            {
                "error": False,
                "time": "2017-04-11 00:00:00",
                "value": "6.68"
            },
            {
                "error": False,
                "time": "2017-04-12 00:00:00",
                "value": 6.86
            },
            {
                "error": False,
                "time": "2017-04-13 00:00:00",
                "value": 15.6
            },
            {
                "error": False,
                "time": "2017-04-14 00:00:00",
                "value": 16.38
            }
        ],
        "max": 16.38,
        "median": 6.96,
        "min": 6.68,
        "name": "L29_Chiller3_CHWreturnTemp(EWT)",
        "std": 4.312402333837705
    }]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverpoolst_allWrong():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': -2,
        'timeStart': '2017-04-09 25:61:61',
        'timeEnd': '2017-04-14 25:61:61',
        'timeFormat': 'sdf',
        'pointList': ['']
    })
    TestCommon.GetHistoryDataPadded.assert_invalid_time_string_error(rt)


@pytest.mark.p0
def test_huawei_m5_specific_point():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 17:55:00',
        'timeEnd': '2017-07-20 18:00:00',
        'timeFormat': 'm5',
        'pointList': ['CalcHourlyBChEff_svr']
    })
    expected =[
        {
            "avg": 0.6000000000000001,
            "max": 0.66,
            "name": "CalcHourlyBChEff_svr",
            "history": [
                {
                    "time": "2017-07-20 17:55:00",
                    "value": 0.54,
                    "error": False
                },
                {
                    "time": "2017-07-20 18:00:00",
                    "value": 0.66,
                    "error": False
                }
            ],
            "min": 0.54,
            "median": 0.6000000000000001,
            "std": 0.06
        }
    ]

    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_m5_specific_point_another_time():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 72,
        'timeStart': '2017-07-20 23:58:00',
        'timeEnd': '2017-07-21 00:00:00',
        'timeFormat': 'm5',
        'pointList': ['CalcHourlyBChEff_svr']
    })
    expected =[
        {
            "avg": 0.65,
            "max": 0.65,
            "name": "CalcHourlyBChEff_svr",
            "history": [
                {
                    "time": "2017-07-21 00:00:00",
                    "value": 0.65,
                    "error": False
                }
            ],
            "min": 0.65,
            "median": 0.65,
            "std": 0.0
        }
    ]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)