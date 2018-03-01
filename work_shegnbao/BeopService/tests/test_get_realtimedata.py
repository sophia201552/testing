# coding=utf-8
import pytest
from tests.utils import TestCommon

'''
项目id：72（上海华为）+293（利物浦）
点名列表中包括：原始点+现场点+虚拟点+计算点，由于实时数据一直更新，只检查是否有数值，对数值是否一致不进行验证
意外测试：项目id为字符串+非使用项目+空字符串用例各一个，点名为空列表、空字符串用例各一个，字符串+空格用例一个，
点名中有正确的有错误的点名用例一个，项目id和点名同时错误的用例一个，
测试用例共：11个
'''
huawei_test_point_list = ['VAV_J_54_18_Damper %', 'VAV_J_54_17_Air_Flow', 'euipmentIntactRate',
                          'MaxChApprEvapTemp_svr_dr']
huawei_test_wrong_pointList = ['VAV_J_54_18_Damper', 'VAV_J_54_17_Air_Flow', 'euipmentIntactRate',
                               'MaxChApprEvapTemp_svr_dr']
liverploost_test_point_list = ['L10S1_AHU1_averageTemp', 'L9S2_FCUS1_DAY_NGT', 'L29_Boiler1_SupplyT_tx_en',
                               'Accum_CWP003_PumpEnergyD']
liverploost_test_wrong_pointList = ['L10S1_AHU1_averageTemp01', 'L9S2_FCUS1_DAY_NGT', 'L29_Boiler1_SupplyT_tx_en',
                                    'Accum_CWP003_PumpEnergyD']


@pytest.mark.p0
def test_huawei():
    rt = TestCommon.getRealtimeData.run({
        'proj': 72,
        'pointList': huawei_test_point_list
    })
    expected = [
        {
            "name": "MaxChApprEvapTemp_svr_dr",
            "value": "97.93103448275862"
        },
        {
            "name": "VAV_J_54_17_Air_Flow",
            "value": "30.46"
        },
        {
            "name": "VAV_J_54_18_Damper %",
            "value": "100"
        },
        {
            "name": "euipmentIntactRate",
            "value": "[{'TotalNum': 193, 'SubSystemName': 'AHU', 'IntactRate': '100.00%', 'GoodNum': 193}, "
                     "{'TotalNum': 2578, 'SubSystemName': 'VAV', 'IntactRate': '99.96%', 'GoodNum': 2577.0}, "
                     "{'TotalNum': 34352, 'SubSystemName': '传感器和执行器', 'IntactRate': '99.76%', 'GoodNum': 34270}, "
                     "{'TotalNum': 1, 'SubSystemName': '冷却塔', 'IntactRate': '100.00%', 'GoodNum': 1}, "
                     "{'TotalNum': 7, 'SubSystemName': '冷机', 'IntactRate': '85.71%', 'GoodNum': 6.0}, "
                     "{'TotalNum': 35, 'SubSystemName': '水泵', 'IntactRate': '97.14%', 'GoodNum': 34.0}]"
        }
    ]
    TestCommon.getRealtimeData.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_huawei_wrong_pointList():
    rt = TestCommon.getRealtimeData.run({
        'proj': 72,
        'pointList': huawei_test_wrong_pointList
    })
    expected = [
        {
            "name": "VAV_J_54_17_Air_Flow",
            "value": "22.83"
        },
        {
            "name": "MaxChApprEvapTemp_svr_dr",
            "value": "100.0"
        },
        {
            "name": "euipmentIntactRate",
            "value": "[{'TotalNum': 193, 'SubSystemName': 'AHU', 'IntactRate': '100.00%', 'GoodNum': 193}, "
                     "{'TotalNum': 2578, 'SubSystemName': 'VAV', 'IntactRate': '99.96%', 'GoodNum': 2577.0}, "
                     "{'TotalNum': 34352, 'SubSystemName': '传感器和执行器', 'IntactRate': '99.76%', 'GoodNum': 34270}, "
                     "{'TotalNum': 1, 'SubSystemName': '冷却塔', 'IntactRate': '100.00%', 'GoodNum': 1}, "
                     "{'TotalNum': 7, 'SubSystemName': '冷机', 'IntactRate': '85.71%', 'GoodNum': 6.0}, "
                     "{'TotalNum': 35, 'SubSystemName': '水泵', 'IntactRate': '97.14%', 'GoodNum': 34.0}]"
        }
    ]
    TestCommon.getRealtimeData.assert_result_equals(expected, rt)


# check projid is empty string
@pytest.mark.p0
def test_empty_proj():
    rt = TestCommon.getRealtimeData.run({
        'proj': '',
        'pointList': huawei_test_point_list
    })
    expected = {"error": 1, "msg": "proj is necessary but content is empty."}
    TestCommon.getRealtimeData.assert_result_equals(expected, rt)


# check projid is not real
@pytest.mark.p0
def test_noReal_proj():
    rt = TestCommon.getRealtimeData.run({
        'proj': 100000,
        'pointList': huawei_test_point_list
    })
    expected = [{"error": 1, "msg": "no realtime data"}]
    TestCommon.getRealtimeData.assert_result_equals(expected, rt)


# check projid is string
@pytest.mark.p0
def test_huawei_strId():
    rt = TestCommon.getRealtimeData.run({
        'proj': '72',
        'pointList': huawei_test_point_list
    })
    expected = [
        {
            "name": "MaxChApprEvapTemp_svr_dr",
            "value": "97.93103448275862"
        },
        {
            "name": "VAV_J_54_17_Air_Flow",
            "value": "30.46"
        },
        {
            "name": "VAV_J_54_18_Damper %",
            "value": "100"
        },
        {
            "name": "euipmentIntactRate",
            "value": "[{'TotalNum': 193, 'SubSystemName': 'AHU', 'IntactRate': '100.00%', 'GoodNum': 193}, "
                     "{'TotalNum': 2578, 'SubSystemName': 'VAV', 'IntactRate': '99.96%', 'GoodNum': 2577.0}, "
                     "{'TotalNum': 34352, 'SubSystemName': '传感器和执行器', 'IntactRate': '99.76%', 'GoodNum': 34270}, "
                     "{'TotalNum': 1, 'SubSystemName': '冷却塔', 'IntactRate': '100.00%', 'GoodNum': 1}, "
                     "{'TotalNum': 7, 'SubSystemName': '冷机', 'IntactRate': '85.71%', 'GoodNum': 6.0}, "
                     "{'TotalNum': 35, 'SubSystemName': '水泵', 'IntactRate': '97.14%', 'GoodNum': 34.0}]"
        }
    ]
    TestCommon.getRealtimeData.assert_result_equals(expected, rt)


# check pointList is empty list
@pytest.mark.p0
def test_huawei_empty_pointList():
    rt = TestCommon.getRealtimeData.run({
        'proj': 72,
        'pointList': []
    })
    expected = {"error": 1, "msg": "pointList is array but every item content is all empty."}
    TestCommon.getRealtimeData.assert_result_equals(expected, rt)


# check pointList is empty string
@pytest.mark.p0
def test_huawei_emptyString_pointList():
    rt = TestCommon.getRealtimeData.run({
        'proj': 72,
        'pointList': ['']
    })
    expected = {"error": 1, "msg": "pointList is array but every item content is all empty."}
    TestCommon.getRealtimeData.assert_result_equals(expected, rt)


# check pointList is blank
@pytest.mark.p0
def test_huawei_blank_pointList():
    rt = TestCommon.getRealtimeData.run({
        'proj': 72,
        'pointList': [' ']
    })
    expected = {"error": 1, "msg": "pointList is array but every item content is all empty."}
    TestCommon.getRealtimeData.assert_result_equals(expected, rt)


# check all are wrong
@pytest.mark.p0
def test_huawei_blank_pointList():
    rt = TestCommon.getRealtimeData.run({
        'proj': 10000000,
        'pointList': ['111']
    })
    expected = [{"error": 1, "msg": "no realtime data"}]
    TestCommon.getRealtimeData.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverlpoolst():
    rt = TestCommon.getRealtimeData.run({
        'proj': 293,
        'pointList': liverploost_test_point_list
    })
    expected = [
        {
            "name": "L29_Boiler1_SupplyT_tx_en",
            "value": "The supply temperature of 1#boiler is invalid as the related equipment is off"
        },
        {
            "name": "Accum_CWP003_PumpEnergyD",
            "value": "502.46"
        },
        {
            "name": "L9S2_FCUS1_DAY_NGT",
            "value": "1"
        },
        {
            "name": "L10S1_AHU1_averageTemp",
            "value": "22.5"
        }
    ]
    TestCommon.getRealtimeData.assert_result_equals(expected, rt)


@pytest.mark.p0
def test_liverlpoolst_wrong_pointList():
    rt = TestCommon.getRealtimeData.run({
        'proj': 293,
        'pointList': liverploost_test_wrong_pointList
    })
    expected = [
        {
            "name": "L29_Boiler1_SupplyT_tx_en",
            "value": "The supply temperature of 1#boiler is invalid as the related equipment is off"
        },
        {
            "name": "L9S2_FCUS1_DAY_NGT",
            "value": "1"
        },
        {
            "name": "Accum_CWP003_PumpEnergyD",
            "value": "480.75"
        }
    ]
    TestCommon.getRealtimeData.assert_result_equals(expected, rt)
