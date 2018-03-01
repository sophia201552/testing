# coding=utf-8
import pytest
from tests import TestSpecific
from tests.utils import TestCommon

'''
项目id：72（上海华为）+293（利物浦）
点名列表中包括：原始点+现场点+虚拟点+计算点，由于实时数据一直更新，只检查是否有数值，对数值是否一致不进行验证
意外测试：项目id为字符串+非使用项目用例各一个，点名为空列表、空字符串用例各一个，字符串+空格用例一个，点名中有正确的有错误的点名用例一个，项目id和点名同时错误的用例一个，
测试用例共：11个
'''
huawei_test_point_list = ['VAV_J_54_18_Damper %', 'VAV_J_54_17_Air_Flow', 'CH5_COPOwnerE14F63943_value', 'MaxChApprEvapTemp_svr_dr']
huawei_test_wrong_pointList = ['VAV_J_54_18_Damper', 'VAV_J_54_17_Air_Flow', 'CH5_COPOwnerE14F63943_value', 'MaxChApprEvapTemp_svr_dr']
liverploost_test_point_list = ['L10S1_AHU1_averageTemp', 'L9S2_FCUS1_DAY_NGT', 'L29_Boiler1_SupplyT_tx_en', 'Accum_CWP003_PumpEnergyD']
liverploost_test_wrong_pointList = ['L10S1_AHU1_averageTemp01', 'L9S2_FCUS1_DAY_NGT', 'L29_Boiler1_SupplyT_tx_en', 'Accum_CWP003_PumpEnergyD']


@pytest.mark.p0
def test_huawei():
    rt = TestCommon.getRealtimeData_with_time.run({
        'projId': 72,
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": [
        [
            "MaxChApprEvapTemp_svr_dr",
            "100.0",
            "2017-10-16 10:58:00"
        ],
        [
            "VAV_J_54_17_Air_Flow",
            "18.12",
            "2017-10-16 10:59:00"
        ],
        [
            "VAV_J_54_18_Damper %",
            "100",
            "2017-10-16 10:59:00"
        ],
        [
            "CH5_COPOwnerE14F63943_value",
            "5.79",
            "2017-10-16 11:01:57"
        ]
    ],
    "message": "",
    "status": 1
}
    TestCommon.getRealtimeData_with_time.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_huawei_wrong_pointList():
    rt = TestCommon.getRealtimeData_with_time.run({
        'projId': 72,
        'pointList': huawei_test_wrong_pointList
    })
    expected = {
    "data": [
        [
            "MaxChApprEvapTemp_svr_dr",
            "100.0",
            "2017-10-16 10:58:00"
        ],
        [
            "VAV_J_54_17_Air_Flow",
            "18.12",
            "2017-10-16 10:59:00"
        ],
        [
            "CH5_COPOwnerE14F63943_value",
            "5.76",
            "2017-10-16 10:55:44"
        ]
    ],
    "message": "",
    "status": 1
}
    TestCommon.getRealtimeData_with_time.assert_result_equals(expected, rt)

#check projid is not real
@pytest.mark.p0
def test_noReal_proj():
    rt = TestCommon.getRealtimeData_with_time.run({
        'projId': 100000,
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": [],
    "message": "no realtime data",
    "status": 0
}
    TestCommon.getRealtimeData_with_time.assert_result_equals(expected, rt)

#check projid is string
@pytest.mark.p0
def test_huawei_strId():
    rt = TestCommon.getRealtimeData_with_time.run({
        'projId': '72',
        'pointList': huawei_test_point_list
    })
    expected = {
    "data": [
        [
            "MaxChApprEvapTemp_svr_dr",
            "100.0",
            "2017-10-16 10:58:00"
        ],
        [
            "VAV_J_54_17_Air_Flow",
            "18.12",
            "2017-10-16 10:59:00"
        ],
        [
            "VAV_J_54_18_Damper %",
            "100",
            "2017-10-16 10:59:00"
        ],
        [
            "CH5_COPOwnerE14F63943_value",
            "5.79",
            "2017-10-16 11:01:57"
        ]
    ],
    "message": "",
    "status": 1
}
    TestCommon.getRealtimeData_with_time.assert_result_equals(expected, rt)

#check pointList is empty list
@pytest.mark.p0
def test_huawei_empty_pointList():
    rt = TestCommon.getRealtimeData_with_time.run({
        'projId': 72,
        'pointList': []
    })
    expected = {
    "data": [],
    "message": "pointList is empty",
    "status": 0
}
    TestCommon.getRealtimeData_with_time.assert_result_equals(expected, rt)

#check pointList is empty string
@pytest.mark.p0
def test_huawei_emptyString_pointList():
    rt = TestCommon.getRealtimeData_with_time.run({
        'projId': 72,
        'pointList': ['']
    })
    expected = {
    "data": [],
    "message": "pointList is empty",
    "status": 0
}
    TestCommon.getRealtimeData_with_time.assert_result_equals(expected, rt)

#check pointList is blank
@pytest.mark.p0
def test_huawei_blank_pointList():
    rt = TestCommon.getRealtimeData_with_time.run({
        'projId': 72,
        'pointList': [' ']
    })
    expected = {
    "data": [],
    "message": "pointList is empty",
    "status": 0
}
    TestCommon.getRealtimeData_with_time.assert_result_equals(expected, rt)

#check all are wrong
@pytest.mark.p0
def test_huawei_blank_pointList():
    rt = TestCommon.getRealtimeData_with_time.run({
        'projId': 10000000,
        'pointList': ['111']
    })
    expected = {
    "data": [],
    "message": "no realtime data",
    "status": 0
}
    TestCommon.getRealtimeData_with_time.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverlpoolst():
    rt = TestCommon.getRealtimeData_with_time.run({
        'projId': 293,
        'pointList': liverploost_test_point_list
    })
    expected = {
    "data": [
        [
            "Accum_CWP003_PumpEnergyD",
            "469.31",
            "2017-10-13 19:55:00"
        ],
        [
            "L10S1_AHU1_averageTemp",
            "22.5",
            "2017-10-13 19:55:00"
        ],
        [
            "L9S2_FCUS1_DAY_NGT",
            "0",
            "2017-10-13 19:55:00"
        ],
        [
            "L29_Boiler1_SupplyT_tx_en",
            "The supply temperature of 1#boiler is invalid as the related equipment is off",
            "2017-10-13 16:55:10"
        ]
    ],
    "message": "",
    "status": 1
}
    TestCommon.getRealtimeData_with_time.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_liverlpoolst_wrong_pointList():
    rt = TestCommon.getRealtimeData_with_time.run({
        'projId': 293,
        'pointList': liverploost_test_wrong_pointList
    })
    expected = {
    "data": [
        [
            "Accum_CWP003_PumpEnergyD",
            "476.06",
            "2017-10-13 20:10:00"
        ],
        [
            "L9S2_FCUS1_DAY_NGT",
            "1",
            "2017-10-13 20:10:00"
        ],
        [
            "L29_Boiler1_SupplyT_tx_en",
            "The supply temperature of 1#boiler is invalid as the related equipment is off",
            "2017-10-13 17:10:10"
        ]
    ],
    "message": "",
    "status": 1
}
    TestCommon.getRealtimeData_with_time.assert_result_equals(expected, rt)

