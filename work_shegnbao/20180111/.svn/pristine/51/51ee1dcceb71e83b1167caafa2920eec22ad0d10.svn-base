# coding=utf-8

from tests import TestSpecific
from tests.utils import TestCommon
import pytest

'''
项目：华为（72），利物浦（293）
时间格式：'m5','h1','d1','M1'
用例数据库：m5，v2，m5+v2
正确点位：原始点+现场点+虚拟点+计算点
常规测试用例：24个
异常测试用例：24个
秒数非零时的用例，1个，list放四个点；特殊用例4个，包括projectid、开始时间、结束时间、时间格式各一个；开始+结束时间同时错误用例一个
点名错误用例两个（列表只包含一个错误点名，列表包含两个点名，一个错误，一个正确）
新增m5,h1,d1查询时间过长的测试用例各一个，时间格式为非正常时间格式用例一个，点名为空列表、空字符串用例各一个，字符串+空格用例一个，开始、结束、开始+结束时间为浮点秒数时间格式各一个
projectid为字符串用例一个,开始时间超出项目开始时间用例m5,h1,d1各一个，projectid、开始时间、结束时间、时间格式、点名都错误的组合测试用例一个
总测试用例：48个
'''

huawei_test_point_list = ['ChAMPS01', 'VAV_J_54_13_Air Flow', 'BaseChillerSysCOP_sec_svr', 'Max_OUTDOORTemp_W']
huawei_test_pointList_wrong = ['BaseChillerSysCOP_sec_svr', 'Max_OUTDOORTemp_W1']
liverpoolst_test_point_list = ['L29_Chiller3_CHWsupplyTemp(LWT)', 'L29_Chiller3_CHWreturnTemp(EWT)',
                                    'STG2_CWReturnT_va', 'Accum_CTGroup_GroupEnergyM']
liverpoolst_test_pointList_wrong = ['L29_Chiller3_CHWsupplyTemp(LWT1)', 'L29_Chiller3_CHWreturnTemp(EWT)']

@pytest.mark.p0
def test_huawei_m5_old():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-07-20 00:00:00',
        'timeEnd': '2017-07-20 00:20:33',
        'timeFormat': 'm5',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.4,
            5.4,
            5.4,
            5.4,
            5.4
        ],
        "VAV_J_54_13_Air Flow": [
            41.9,
            41.76,
            41.71,
            41.78,
            41.97
        ],
        "Max_OUTDOORTemp_W": [
            54.48,
            54.48,
            54.48,
            54.48,
            54.48
        ],
        "ChAMPS01": [
            83.1,
            82.9,
            82.5,
            81.9,
            81.9
        ]
    },
    "timeStamp": [
        "2017-07-20 00:00:00",
        "2017-07-20 00:05:00",
        "2017-07-20 00:10:00",
        "2017-07-20 00:15:00",
        "2017-07-20 00:20:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False,
            False,
            False
        ],
        "VAV_J_54_13_Air Flow": [
            False,
            False,
            False,
            False,
            False
        ],
        "Max_OUTDOORTemp_W": [
            False,
            False,
            False,
            False,
            False
        ],
        "ChAMPS01": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_h1_old():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-07-20 00:00:00',
        'timeEnd': '2017-07-20 04:20:33',
        'timeFormat': 'h1',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.4,
            5.5,
            5.36,
            5.51,
            5.54
        ],
        "VAV_J_54_13_Air Flow": [
            41.9,
            41.77,
            41.84,
            41.72,
            41.72
        ],
        "Max_OUTDOORTemp_W": [
            54.48,
            54.48,
            54.48,
            54.48,
            54.48
        ],
        "ChAMPS01": [
            83.1,
            80.9,
            79.4,
            77.6,
            76
        ]
    },
    "timeStamp": [
        "2017-07-20 00:00:00",
        "2017-07-20 01:00:00",
        "2017-07-20 02:00:00",
        "2017-07-20 03:00:00",
        "2017-07-20 04:00:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False,
            False,
            False
        ],
        "VAV_J_54_13_Air Flow": [
            False,
            False,
            False,
            False,
            False
        ],
        "Max_OUTDOORTemp_W": [
            False,
            False,
            False,
            False,
            False
        ],
        "ChAMPS01": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_d1_old():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-07-16 00:00:00',
        'timeEnd': '2017-07-20 04:20:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.4,
            5.27,
            5.69,
            5.43,
            5.4
        ],
        "VAV_J_54_13_Air Flow": [
            41.09,
            41.33,
            41.87,
            42.05,
            41.9
        ],
        "Max_OUTDOORTemp_W": [
            54.34,
            54.48,
            54.48,
            54.48,
            54.48
        ],
        "ChAMPS01": [
            88.5,
            85,
            88.5,
            91,
            83.1
        ]
    },
    "timeStamp": [
        "2017-07-16 00:00:00",
        "2017-07-17 00:00:00",
        "2017-07-18 00:00:00",
        "2017-07-19 00:00:00",
        "2017-07-20 00:00:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False,
            False,
            False
        ],
        "VAV_J_54_13_Air Flow": [
            False,
            False,
            False,
            False,
            False
        ],
        "Max_OUTDOORTemp_W": [
            False,
            False,
            False,
            False,
            False
        ],
        "ChAMPS01": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_M1_old():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-03-01 00:00:00',
        'timeEnd': '2017-07-20 04:20:33',
        'timeFormat': 'M1',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.82,
            5.83,
            5.51,
            5.73,
            5.46
        ],
        "VAV_J_54_13_Air Flow": [
            35.48,
            34.6,
            38.28,
            39.24,
            40.26
        ],
        "Max_OUTDOORTemp_W": [
            43.86,
            43.83,
            44.15,
            54.31,
            54.11
        ],
        "ChAMPS01": [
            0,
            81.7,
            84.3,
            82.8,
            80.8
        ]
    },
    "timeStamp": [
        "2017-03-01 00:00:00",
        "2017-04-01 00:00:00",
        "2017-05-01 00:00:00",
        "2017-06-01 00:00:00",
        "2017-07-01 00:00:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False,
            False,
            False
        ],
        "VAV_J_54_13_Air Flow": [
            False,
            False,
            False,
            False,
            False
        ],
        "Max_OUTDOORTemp_W": [
            False,
            False,
            False,
            False,
            False
        ],
        "ChAMPS01": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_m5_new():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-07-20 18:00:00',
        'timeEnd': '2017-07-20 18:20:33',
        'timeFormat': 'm5',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.3,
            5.3,
            5.3,
            5.3,
            5.35
        ],
        "VAV_J_54_13_Air Flow": [
            52.92,
            52.92,
            52.78,
            52.97,
            52.98
        ],
        "Max_OUTDOORTemp_W": [
            54.48,
            54.48,
            54.48,
            54.48,
            54.48
        ],
        "ChAMPS01": [
            0,
            0,
            0,
            0,
            0
        ]
    },
    "timeStamp": [
        "2017-07-20 18:00:00",
        "2017-07-20 18:05:00",
        "2017-07-20 18:10:00",
        "2017-07-20 18:15:00",
        "2017-07-20 18:20:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False,
            False,
            False
        ],
        "VAV_J_54_13_Air Flow": [
            True,
            False,
            False,
            False,
            False
        ],
        "Max_OUTDOORTemp_W": [
            False,
            False,
            False,
            False,
            False
        ],
        "ChAMPS01": [
            True,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_h1_new():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-07-20 18:00:00',
        'timeEnd': '2017-07-20 22:20:33',
        'timeFormat': 'h1',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.3,
            5.38,
            5.32,
            4.78,
            5.42
        ],
        "VAV_J_54_13_Air Flow": [
            52.45,
            52.45,
            53.21,
            39.21,
            41.34
        ],
        "Max_OUTDOORTemp_W": [
            54.48,
            54.48,
            54.48,
            54.48,
            54.48
        ],
        "ChAMPS01": [
            0,
            0,
            0,
            0,
            93.5
        ]
    },
    "timeStamp": [
        "2017-07-20 18:00:00",
        "2017-07-20 19:00:00",
        "2017-07-20 20:00:00",
        "2017-07-20 21:00:00",
        "2017-07-20 22:00:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False,
            False,
            False
        ],
        "VAV_J_54_13_Air Flow": [
            True,
            False,
            False,
            False,
            False
        ],
        "Max_OUTDOORTemp_W": [
            False,
            False,
            False,
            False,
            False
        ],
        "ChAMPS01": [
            True,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_d1_new():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-07-21 00:00:00',
        'timeEnd': '2017-07-25 22:20:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.25,
            5.33,
            5.52,
            5.32,
            5.71
        ],
        "VAV_J_54_13_Air Flow": [
            42.42,
            42.44,
            42.39,
            43.29,
            43.4
        ],
        "Max_OUTDOORTemp_W": [
            54.48,
            54.48,
            54.48,
            54.51,
            54.51
        ],
        "ChAMPS01": [
            86.1,
            88.2,
            86.1,
            83.6,
            88.9
        ]
    },
    "timeStamp": [
        "2017-07-21 00:00:00",
        "2017-07-22 00:00:00",
        "2017-07-23 00:00:00",
        "2017-07-24 00:00:00",
        "2017-07-25 00:00:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False,
            False,
            False
        ],
        "VAV_J_54_13_Air Flow": [
            False,
            False,
            False,
            False,
            False
        ],
        "Max_OUTDOORTemp_W": [
            False,
            False,
            False,
            False,
            False
        ],
        "ChAMPS01": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_M1_new():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-08-01 00:00:00',
        'timeEnd': '2017-10-01 04:20:33',
        'timeFormat': 'M1',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.72,
            4.67,
            4.67
        ],
        "VAV_J_54_13_Air Flow": [
            42.14,
            40.7,
            38.96
        ],
        "Max_OUTDOORTemp_W": [
            54.43,
            54.35,
            0.01
        ],
        "ChAMPS01": [
            90.1,
            78.2,
            0
        ]
    },
    "timeStamp": [
        "2017-08-01 00:00:00",
        "2017-09-01 00:00:00",
        "2017-10-01 00:00:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False
        ],
        "VAV_J_54_13_Air Flow": [
            False,
            False,
            False
        ],
        "Max_OUTDOORTemp_W": [
            False,
            False,
            False
        ],
        "ChAMPS01": [
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_m5_mix():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-07-20 17:00:00',
        'timeEnd': '2017-07-20 19:00:33',
        'timeFormat': 'm5',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.17,
            5.17,
            5.17,
            5.43,
            5.43,
            5.43,
            5.43,
            5.43,
            5.43,
            5.43,
            5.43,
            5.3,
            5.3,
            5.3,
            5.3,
            5.3,
            5.35,
            5.35,
            5.35,
            5.35,
            5.35,
            5.35,
            5.35,
            5.35,
            5.38
        ],
        "VAV_J_54_13_Air Flow": [
            53.24,
            53.29,
            53.25,
            53.36,
            53.29,
            53.37,
            53.02,
            53.2,
            52.99,
            53.17,
            52.99,
            52.74,
            52.74,
            52.92,
            52.78,
            52.97,
            52.98,
            52.86,
            52.93,
            52.66,
            52.77,
            52.72,
            52.85,
            52.49,
            52.45
        ],
        "Max_OUTDOORTemp_W": [
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48
        ],
        "ChAMPS01": [
            93.6,
            94,
            93.8,
            93.4,
            93.7,
            93.9,
            93.1,
            93.7,
            93.8,
            86.5,
            80.4,
            80.4,
            80.4,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ]
    },
    "timeStamp": [
        "2017-07-20 17:00:00",
        "2017-07-20 17:05:00",
        "2017-07-20 17:10:00",
        "2017-07-20 17:15:00",
        "2017-07-20 17:20:00",
        "2017-07-20 17:25:00",
        "2017-07-20 17:30:00",
        "2017-07-20 17:35:00",
        "2017-07-20 17:40:00",
        "2017-07-20 17:45:00",
        "2017-07-20 17:50:00",
        "2017-07-20 17:55:00",
        "2017-07-20 18:00:00",
        "2017-07-20 18:05:00",
        "2017-07-20 18:10:00",
        "2017-07-20 18:15:00",
        "2017-07-20 18:20:00",
        "2017-07-20 18:25:00",
        "2017-07-20 18:30:00",
        "2017-07-20 18:35:00",
        "2017-07-20 18:40:00",
        "2017-07-20 18:45:00",
        "2017-07-20 18:50:00",
        "2017-07-20 18:55:00",
        "2017-07-20 19:00:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "VAV_J_54_13_Air Flow": [
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            True,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "Max_OUTDOORTemp_W": [
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "ChAMPS01": [
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            True,
            True,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_h1_mix():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-07-20 15:00:00',
        'timeEnd': '2017-07-20 20:20:33',
        'timeFormat': 'h1',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.26,
            5.41,
            5.17,
            5.3,
            5.38,
            5.32
        ],
        "VAV_J_54_13_Air Flow": [
            53.41,
            53.51,
            53.24,
            53.24,
            52.45,
            53.21
        ],
        "Max_OUTDOORTemp_W": [
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48
        ],
        "ChAMPS01": [
            0,
            93.1,
            93.6,
            93.6,
            0,
            0
        ]
    },
    "timeStamp": [
        "2017-07-20 15:00:00",
        "2017-07-20 16:00:00",
        "2017-07-20 17:00:00",
        "2017-07-20 18:00:00",
        "2017-07-20 19:00:00",
        "2017-07-20 20:00:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "VAV_J_54_13_Air Flow": [
            False,
            False,
            False,
            True,
            False,
            False
        ],
        "Max_OUTDOORTemp_W": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "ChAMPS01": [
            False,
            False,
            False,
            True,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_d1_mix():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-23 20:20:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.69,
            5.43,
            5.4,
            5.25,
            5.33,
            5.52
        ],
        "VAV_J_54_13_Air Flow": [
            41.87,
            42.05,
            41.9,
            42.42,
            42.44,
            42.39
        ],
        "Max_OUTDOORTemp_W": [
            54.48,
            54.48,
            54.48,
            54.48,
            54.48,
            54.48
        ],
        "ChAMPS01": [
            88.5,
            91,
            83.1,
            86.1,
            88.2,
            86.1
        ]
    },
    "timeStamp": [
        "2017-07-18 00:00:00",
        "2017-07-19 00:00:00",
        "2017-07-20 00:00:00",
        "2017-07-21 00:00:00",
        "2017-07-22 00:00:00",
        "2017-07-23 00:00:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "VAV_J_54_13_Air Flow": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "Max_OUTDOORTemp_W": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "ChAMPS01": [
            False,
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_M1_mix():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-05-01 00:00:00',
        'timeEnd': '2017-10-17 04:20:33',
        'timeFormat': 'M1',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.51,
            5.73,
            5.46,
            5.72,
            4.67,
            4.67
        ],
        "VAV_J_54_13_Air Flow": [
            38.28,
            39.24,
            40.26,
            42.14,
            40.7,
            38.96
        ],
        "Max_OUTDOORTemp_W": [
            44.15,
            54.31,
            54.11,
            54.43,
            54.35,
            0.01
        ],
        "ChAMPS01": [
            84.3,
            82.8,
            80.8,
            90.1,
            78.2,
            0
        ]
    },
    "timeStamp": [
        "2017-05-01 00:00:00",
        "2017-06-01 00:00:00",
        "2017-07-01 00:00:00",
        "2017-08-01 00:00:00",
        "2017-09-01 00:00:00",
        "2017-10-01 00:00:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "VAV_J_54_13_Air Flow": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "Max_OUTDOORTemp_W": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "ChAMPS01": [
            False,
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_m5_old():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-11 00:00:00',
        'timeEnd': '2017-04-11 00:20:33',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            6.3,
            6.3,
            6.32,
            6.28,
            6.28
        ],
        "Accum_CTGroup_GroupEnergyM": [
            7435.1,
            7436.7,
            7437.5,
            7438,
            7438.3
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            6.68,
            6.68,
            6.66,
            6.68,
            6.62
        ],
        "STG2_CWReturnT_va": [
            22.5,
            22.3,
            22.3,
            22,
            22
        ]
    },
    "timeStamp": [
        "2017-04-11 00:00:00",
        "2017-04-11 00:05:00",
        "2017-04-11 00:10:00",
        "2017-04-11 00:15:00",
        "2017-04-11 00:20:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            False,
            False,
            False
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_h1_old():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-11 00:00:00',
        'timeEnd': '2017-04-11 04:20:33',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            6.3,
            6.34,
            6.28,
            6.28,
            6.3
        ],
        "Accum_CTGroup_GroupEnergyM": [
            7435.1,
            7443.2,
            7446,
            7446,
            7446
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            6.68,
            6.69,
            6.69,
            6.67,
            6.65
        ],
        "STG2_CWReturnT_va": [
            22.5,
            21.2,
            20.8,
            20.1,
            19
        ]
    },
    "timeStamp": [
        "2017-04-11 00:00:00",
        "2017-04-11 01:00:00",
        "2017-04-11 02:00:00",
        "2017-04-11 03:00:00",
        "2017-04-11 04:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            False,
            False,
            False
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_d1_old():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-07 00:00:00',
        'timeEnd': '2017-04-11 04:20:33',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            6.35,
            6.29,
            6.3,
            6.28,
            6.3
        ],
        "Accum_CTGroup_GroupEnergyM": [
            3643.2,
            5324.7,
            5992.6,
            6634.7,
            7435.1
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            7.41,
            7.09,
            7.06,
            6.83,
            6.68
        ],
        "STG2_CWReturnT_va": [
            24,
            24,
            23.9,
            23.2,
            22.5
        ]
    },
    "timeStamp": [
        "2017-04-07 00:00:00",
        "2017-04-08 00:00:00",
        "2017-04-09 00:00:00",
        "2017-04-10 00:00:00",
        "2017-04-11 00:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            False,
            False,
            False
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_M1_old():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2016-12-01 00:00:00',
        'timeEnd': '2017-04-11 04:20:33',
        'timeFormat': 'M1',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            8.91,
            12.26,
            13.64,
            6.43,
            6.77
        ],
        "Accum_CTGroup_GroupEnergyM": [
            44922.270000000004,
            62943.70333333334,
            78907.66666666663,
            58860.475000000035,
            9010.099999999977
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            11.56,
            20.14,
            13.74,
            14.1,
            18.3
        ],
        "STG2_CWReturnT_va": [
            22.66,
            24.54,
            22.08,
            24,
            19.2
        ]
    },
    "timeStamp": [
        "2016-12-01 00:00:00",
        "2017-01-01 00:00:00",
        "2017-02-01 00:00:00",
        "2017-03-01 00:00:00",
        "2017-04-01 00:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            False,
            False,
            False
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_m5_new():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-11 18:00:00',
        'timeEnd': '2017-04-11 18:20:33',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            11.42,
            13.64,
            14.86,
            14.88,
            14.78
        ],
        "Accum_CTGroup_GroupEnergyM": [
            8365.9,
            8365.9,
            8358.6,
            8358.6,
            8358.6
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            11.54,
            14.5,
            15.04,
            15,
            14.95
        ],
        "STG2_CWReturnT_va": [
            24.8,
            24.8,
            23.3,
            23.7,
            23.7
        ]
    },
    "timeStamp": [
        "2017-04-11 18:00:00",
        "2017-04-11 18:05:00",
        "2017-04-11 18:10:00",
        "2017-04-11 18:15:00",
        "2017-04-11 18:20:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            True,
            False,
            True,
            False
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_h1_new():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-11 18:00:00',
        'timeEnd': '2017-04-11 22:20:33',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            11.42,
            15.54,
            6.24,
            6.23,
            6.26
        ],
        "Accum_CTGroup_GroupEnergyM": [
            8365.9,
            8358.6,
            8358.6,
            8358.6,
            8372.5
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            11.54,
            15.71,
            7.98,
            7.34,
            7.06
        ],
        "STG2_CWReturnT_va": [
            24.8,
            22.2,
            21,
            21.7,
            21
        ]
    },
    "timeStamp": [
        "2017-04-11 18:00:00",
        "2017-04-11 19:00:00",
        "2017-04-11 20:00:00",
        "2017-04-11 21:00:00",
        "2017-04-11 22:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            True,
            True,
            False
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_d1_new():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-12 00:00:00',
        'timeEnd': '2017-04-16 22:20:33',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            6.28,
            7.11,
            7.23,
            7.02,
            6.87
        ],
        "Accum_CTGroup_GroupEnergyM": [
            8372.5,
            8711.2,
            9010.1,
            9010.1,
            9010.1
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            6.86,
            15.6,
            16.38,
            17.44,
            18.02
        ],
        "STG2_CWReturnT_va": [
            18.8,
            19,
            19.7,
            20.4,
            21
        ]
    },
    "timeStamp": [
        "2017-04-12 00:00:00",
        "2017-04-13 00:00:00",
        "2017-04-14 00:00:00",
        "2017-04-15 00:00:00",
        "2017-04-16 00:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            False,
            True,
            True
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_M1_new():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-05-12 00:00:00',
        'timeEnd': '2017-09-12 00:20:33',
        'timeFormat': 'M1',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            6.65,
            6.65,
            8.93,
            6.28,
            6.93
        ],
        "Accum_CTGroup_GroupEnergyM": [
            24673.40000000001,
            6500,
            4896.099999999991,
            4579.900000000009,
            11792.599999999991
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            17.6,
            17.6,
            10.81,
            9.93,
            11.48
        ],
        "STG2_CWReturnT_va": [
            19.4,
            20.24,
            13.42,
            17.12,
            23.04
        ]
    },
    "timeStamp": [
        "2017-05-01 00:00:00",
        "2017-06-01 00:00:00",
        "2017-07-01 00:00:00",
        "2017-08-01 00:00:00",
        "2017-09-01 00:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            True,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            False,
            False,
            False
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            True,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_m5_mix():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-11 17:00:00',
        'timeEnd': '2017-04-11 19:00:00',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            6.13,
            6.13,
            6.13,
            6.13,
            6.13,
            6.13,
            6.13,
            6.13,
            6.13,
            6.13,
            6.13,
            6.13,
            11.42,
            13.64,
            14.86,
            14.88,
            14.78,
            14.78,
            14.68,
            14.86,
            15,
            14.92,
            15.16,
            15.22,
            15.54
        ],
        "Accum_CTGroup_GroupEnergyM": [
            8255.4,
            8265.4,
            8275.4,
            8285.4,
            8295.4,
            8305.4,
            8315.4,
            8325.4,
            8325.4,
            8345.4,
            8352.5,
            8352.5,
            8365.9,
            8365.9,
            8358.6,
            8358.6,
            8358.6,
            8358.6,
            8358.6,
            8358.6,
            8358.6,
            8358.6,
            8358.6,
            8358.6,
            8358.6
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            9.77,
            9.77,
            9.77,
            9.77,
            9.77,
            9.77,
            9.77,
            9.77,
            9.77,
            9.77,
            9.77,
            9.77,
            11.54,
            14.5,
            15.04,
            15,
            14.95,
            14.95,
            15.15,
            14.97,
            14.96,
            15.19,
            15.15,
            15.36,
            15.71
        ],
        "STG2_CWReturnT_va": [
            24.8,
            24.8,
            24.8,
            24.8,
            24.8,
            24.8,
            24.8,
            24.8,
            24.8,
            24.8,
            24.8,
            24.8,
            24.8,
            24.8,
            23.3,
            23.7,
            23.7,
            23.6,
            23.6,
            23.5,
            23.5,
            23,
            23,
            23,
            22.2
        ]
    },
    "timeStamp": [
        "2017-04-11 17:00:00",
        "2017-04-11 17:05:00",
        "2017-04-11 17:10:00",
        "2017-04-11 17:15:00",
        "2017-04-11 17:20:00",
        "2017-04-11 17:25:00",
        "2017-04-11 17:30:00",
        "2017-04-11 17:35:00",
        "2017-04-11 17:40:00",
        "2017-04-11 17:45:00",
        "2017-04-11 17:50:00",
        "2017-04-11 17:55:00",
        "2017-04-11 18:00:00",
        "2017-04-11 18:05:00",
        "2017-04-11 18:10:00",
        "2017-04-11 18:15:00",
        "2017-04-11 18:20:00",
        "2017-04-11 18:25:00",
        "2017-04-11 18:30:00",
        "2017-04-11 18:35:00",
        "2017-04-11 18:40:00",
        "2017-04-11 18:45:00",
        "2017-04-11 18:50:00",
        "2017-04-11 18:55:00",
        "2017-04-11 19:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            True,
            False,
            False,
            True,
            False,
            True,
            False,
            True,
            False,
            True,
            False,
            False,
            True,
            False,
            False,
            True,
            False
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            True,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_h1_mix():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-11 15:00:00',
        'timeEnd': '2017-04-11 20:20:00',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            6.2,
            6.28,
            6.13,
            11.42,
            15.54,
            6.24
        ],
        "Accum_CTGroup_GroupEnergyM": [
            8015.4,
            8135.4,
            8255.4,
            8365.9,
            8358.6,
            8358.6
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            10.27,
            9.94,
            9.77,
            11.54,
            15.71,
            7.98
        ],
        "STG2_CWReturnT_va": [
            24.8,
            24.8,
            24.8,
            24.8,
            22.2,
            21
        ]
    },
    "timeStamp": [
        "2017-04-11 15:00:00",
        "2017-04-11 16:00:00",
        "2017-04-11 17:00:00",
        "2017-04-11 18:00:00",
        "2017-04-11 19:00:00",
        "2017-04-11 20:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            False,
            False,
            False,
            True
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            True,
            True,
            True,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_d1_mix():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:00',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            6.3,
            6.28,
            6.3,
            6.28,
            7.11,
            7.23
        ],
        "Accum_CTGroup_GroupEnergyM": [
            5992.6,
            6634.7,
            7435.1,
            8372.5,
            8711.2,
            9010.1
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            7.06,
            6.83,
            6.68,
            6.86,
            15.6,
            16.38
        ],
        "STG2_CWReturnT_va": [
            23.9,
            23.2,
            22.5,
            18.8,
            19,
            19.7
        ]
    },
    "timeStamp": [
        "2017-04-09 00:00:00",
        "2017-04-10 00:00:00",
        "2017-04-11 00:00:00",
        "2017-04-12 00:00:00",
        "2017-04-13 00:00:00",
        "2017-04-14 00:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            False,
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_M1_mix():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-02-01 00:00:00',
        'timeEnd': '2017-07-14 21:20:00',
        'timeFormat': 'M1',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            13.64,
            6.43,
            6.77,
            6.65,
            6.65,
            8.93
        ],
        "Accum_CTGroup_GroupEnergyM": [
            78907.66666666663,
            58860.475000000035,
            9010.099999999977,
            24673.40000000001,
            6500,
            4896.099999999991
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            13.74,
            14.1,
            18.3,
            17.6,
            17.6,
            10.81
        ],
        "STG2_CWReturnT_va": [
            22.08,
            24,
            19.2,
            19.4,
            20.24,
            13.42
        ]
    },
    "timeStamp": [
        "2017-02-01 00:00:00",
        "2017-03-01 00:00:00",
        "2017-04-01 00:00:00",
        "2017-05-01 00:00:00",
        "2017-06-01 00:00:00",
        "2017-07-01 00:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            False,
            False,
            False,
            True,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            True,
            False
        ],
        "STG2_CWReturnT_va": [
            False,
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

# check the second is single
@pytest.mark.p0
def test_liverpoolst_d1_mix_singleSec():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:33',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            6.3,
            6.28,
            6.3,
            6.28,
            7.11,
            7.23
        ],
        "Accum_CTGroup_GroupEnergyM": [
            5992.6,
            6634.7,
            7435.1,
            8372.5,
            8711.2,
            9010.1
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            7.06,
            6.83,
            6.68,
            6.86,
            15.6,
            16.38
        ],
        "STG2_CWReturnT_va": [
            23.9,
            23.2,
            22.5,
            18.8,
            19,
            19.7
        ]
    },
    "timeStamp": [
        "2017-04-09 00:00:00",
        "2017-04-10 00:00:00",
        "2017-04-11 00:00:00",
        "2017-04-12 00:00:00",
        "2017-04-13 00:00:00",
        "2017-04-14 00:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            False,
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

# check the projectId is wrong
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongId():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 1233,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:33',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_no_history_data(rt)

# check the second is string
@pytest.mark.p0
def test_liverpoolst_d1_mix_singleSec():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': '293',
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:33',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_point_list
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            6.3,
            6.28,
            6.3,
            6.28,
            7.11,
            7.23
        ],
        "Accum_CTGroup_GroupEnergyM": [
            5992.6,
            6634.7,
            7435.1,
            8372.5,
            8711.2,
            9010.1
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            7.06,
            6.83,
            6.68,
            6.86,
            15.6,
            16.38
        ],
        "STG2_CWReturnT_va": [
            23.9,
            23.2,
            22.5,
            18.8,
            19,
            19.7
        ]
    },
    "timeStamp": [
        "2017-04-09 00:00:00",
        "2017-04-10 00:00:00",
        "2017-04-11 00:00:00",
        "2017-04-12 00:00:00",
        "2017-04-13 00:00:00",
        "2017-04-14 00:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWsupplyTemp(LWT)": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "Accum_CTGroup_GroupEnergyM": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            False,
            False
        ],
        "STG2_CWReturnT_va": [
            False,
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

# check the timeStart is wrong
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongTS():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_invalid_time_string_error(rt)

# check the timeStart is float second
@pytest.mark.p0
def test_liverpoolst_m5_new_tSFloat():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '1505800454.558458',
        'timeEnd': '2017-09-19 14:20:00',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_invalid_time_string_error(rt)

# check the timeEnd is wrong
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongTE():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 :20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_invalid_time_string_error(rt)

# check the timeEnd is earier than timeSatrt
@pytest.mark.p0
def test_liverpoolst_d1_mix_tEEailier():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-20 00:00:23',
        'timeEnd': '2016-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_error(TestSpecific.GetHistoryDataPaddedReduce.START_TIME_GT_END_TIME, rt)

# check the timeEnd is float second
@pytest.mark.p0
def test_liverpoolst_m5_new_tEFloat():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-09-19 00:20:00',
        'timeEnd': '1505802730.722475',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_invalid_time_string_error(rt)

# check both timeSart and timeEnd are wrong
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongTBoth():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00',
        'timeEnd': '2017-04-14 :20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_invalid_time_string_error(rt)

# check both timeSart and timeEnd are float second
@pytest.mark.p0
def test_liverpoolst_m5_new_wrongTFloat():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '1505800454.558458',
        'timeEnd': '1505802730.722475',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_invalid_time_string_error(rt)

# check the timeFormat of m5 out of range
@pytest.mark.p0
def test_liverpoolst_m5_mix_outTimeRange():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-01-11 17:00:23',
        'timeEnd': '2017-08-11 19:20:00',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_error("time range is %s days for m5" %
                                                 TestSpecific.GetHistoryDataPaddedReduce.M5_DAYS_RANGE, rt)
    
# check the timeFormat of h1 out of range
@pytest.mark.p0
def test_liverpoolst_h1_mix_outTimeRange():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-01-11 17:00:23',
        'timeEnd': '2017-08-11 19:20:00',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_error("time range is %s days for h1" %
                                                 TestSpecific.GetHistoryDataPaddedReduce.H1_DAYS_RANGE, rt)
    
# check the timeFormat of d1 out of range
@pytest.mark.p0
def test_liverpoolst_d1_mix_outTimeRange():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2016-08-11 17:00:23',
        'timeEnd': '2017-09-11 19:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_error("time range is %s days for d1" %
                                                 TestSpecific.GetHistoryDataPaddedReduce.D1_DAYS_RANGE, rt)
    
# check the timeFormat of m5 out of project start time
@pytest.mark.p0
def test_liverpoolst_m5_mix_outTimeRangeLong():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2014-01-11 17:00:23',
        'timeEnd': '2017-08-11 19:20:00',
        'timeFormat': 'm5',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_error("time range is %s days for m5" %
                                                 TestSpecific.GetHistoryDataPaddedReduce.M5_DAYS_RANGE, rt)


# check the timeFormat of h1 out of project start time
@pytest.mark.p0
def test_liverpoolst_h1_mix_outTimeRangeLong():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2014-01-11 17:00:23',
        'timeEnd': '2017-08-11 19:20:00',
        'timeFormat': 'h1',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_error("time range is %s days for h1" %
                                                 TestSpecific.GetHistoryDataPaddedReduce.H1_DAYS_RANGE, rt)


# check the timeFormat of d1 out of project start time
@pytest.mark.p0
def test_liverpoolst_d1_mix_outTimeRangeLong():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2014-08-11 17:00:23',
        'timeEnd': '2017-09-11 19:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_error("time range is %s days for d1" %
                                                 TestSpecific.GetHistoryDataPaddedReduce.D1_DAYS_RANGE, rt)

# check the timeFormat is wrong
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongTimeFormat():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'D1',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_error("time period format not supported", rt)


# check the timeFormat is normal string
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongTimeFormat_normalStr():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'bgf',
        'pointList': liverpoolst_test_point_list
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_error("time period format not supported", rt)

# check the pointList is empty list
@pytest.mark.p0
def test_liverpoolst_d1_mix_emptyPointList():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': []
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_no_history_data(rt)

# check the pointList is empty string
@pytest.mark.p0
def test_liverpoolst_d1_mix_emptyStringPoint():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': ['']
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_no_history_data(rt)

# check the pointList is blank
@pytest.mark.p0
def test_liverpoolst_d1_mix_blankPoint():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': [' ']
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_no_history_data(rt)

# check the pointList is wrong
@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongPoint():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-09 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': ['L29_Chiller3_CHWsupplyTemp(LWT)001']
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_no_history_data(rt)

@pytest.mark.p0
def test_liverpoolst_d1_mix_wrongPointList():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 293,
        'timeStart': '2017-04-10 00:00:23',
        'timeEnd': '2017-04-14 21:20:00',
        'timeFormat': 'd1',
        'pointList': liverpoolst_test_pointList_wrong
    })
    expected = {
    "data": {
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            6.83,
            6.68,
            6.86,
            15.6,
            16.38
        ]
    },
    "timeStamp": [
        "2017-04-10 00:00:00",
        "2017-04-11 00:00:00",
        "2017-04-12 00:00:00",
        "2017-04-13 00:00:00",
        "2017-04-14 00:00:00"
    ],
    "attr": {
        "L29_Chiller3_CHWreturnTemp(EWT)": [
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_d1_mix_wrongPointList():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': 72,
        'timeStart': '2017-07-18 00:00:00',
        'timeEnd': '2017-07-23 20:00:33',
        'timeFormat': 'd1',
        'pointList': huawei_test_pointList_wrong
    })
    expected = {
    "data": {
        "BaseChillerSysCOP_sec_svr": [
            5.69,
            5.43,
            5.4,
            5.25,
            5.33,
            5.52
        ]
    },
    "timeStamp": [
        "2017-07-18 00:00:00",
        "2017-07-19 00:00:00",
        "2017-07-20 00:00:00",
        "2017-07-21 00:00:00",
        "2017-07-22 00:00:00",
        "2017-07-23 00:00:00"
    ],
    "attr": {
        "BaseChillerSysCOP_sec_svr": [
            False,
            False,
            False,
            False,
            False,
            False
        ]
    }
}
    TestCommon.GetHistoryDataPaddedReduce.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverpoolst_allWrong():
    rt = TestCommon.GetHistoryDataPaddedReduce.run({
        'projectId': -2,
        'timeStart': '2017-04-09 25:61:61',
        'timeEnd': '2017-04-14 25:61:61',
        'timeFormat': 'sdf',
        'pointList': ['']
    })
    TestCommon.GetHistoryDataPaddedReduce.assert_invalid_time_string_error(rt)
