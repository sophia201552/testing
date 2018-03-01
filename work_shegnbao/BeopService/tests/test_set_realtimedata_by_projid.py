#-*- coding: utf-8 -*-
import pytest
from tests.utils import TestCommon
import random

'''
项目id：49
常规测试：3个
测试点：现场点+虚拟点+计算点用例各一个
异常测试：6个
projid为空字符串+空列表+空字典用例各一个，点名为空列表+空字典，点值为字符串用例一个
总测试用例：9个
'''

myTest_site_point = "test_sitePoint"
myTest_virtual_point = "test_virtualPoint"
myTest_calc_point = "test_calcPoint"
site_value = random.randint(1,100)
virtual_value = random.randint(100,200)
calc_value = random.randint(200,300)
@pytest.mark.p0
def test_myTest_sitePoint():
    request = TestCommon.SetRealtimeDataByProjid.run({
        'proj': 49,
        'point': myTest_site_point,
        'value': site_value
    })
    rt = TestCommon.getRealtimeData.run({
        'proj': 49,
        'pointList': [myTest_site_point]
    })
    expected = [
        {
        "name": myTest_site_point,
        "value": site_value
        }
    ]
    TestCommon.SetRealtimeDataByProjid.assert_result_equals(request, expected, rt)
@pytest.mark.p0
def test_myTest_virtualPoint():
    request = TestCommon.SetRealtimeDataByProjid.run({
        'proj': 49,
        'point': myTest_virtual_point,
        'value': virtual_value
    })
    rt = TestCommon.getRealtimeData.run({
        'proj': 49,
        'pointList': [myTest_virtual_point]
    })
    expected = [
        {
        "name": myTest_virtual_point,
        "value": virtual_value
        }
    ]
    TestCommon.SetRealtimeDataByProjid.assert_result_equals(request, expected, rt)
@pytest.mark.p0
def test_myTest_calcPoint():
    request = TestCommon.SetRealtimeDataByProjid.run({
        'proj': 49,
        'point': myTest_calc_point,
        'value': calc_value
    })
    rt = TestCommon.getRealtimeData.run({
        'proj': 49,
        'pointList': [myTest_calc_point]
    })
    expected = [
        {
        "name": myTest_calc_point,
        "value": calc_value
        }
    ]
    TestCommon.SetRealtimeDataByProjid.assert_result_equals(request, expected, rt)
@pytest.mark.p0
def test_myTest_strProj():
    request = TestCommon.SetRealtimeDataByProjid.run({
        'proj': "",
        'point': myTest_calc_point,
        'value': calc_value
    })
    rt = []
    expected = "set_realtimedata_by_projid error:projId="
    TestCommon.SetRealtimeDataByProjid.assert_result_equals(request, expected, rt)
@pytest.mark.p0
def test_myTest_emptyListProj():
    request = TestCommon.SetRealtimeDataByProjid.run({
        'proj': [],
        'point': myTest_calc_point,
        'value': calc_value
    })
    rt = []
    expected = "set_realtimedata_by_projid error:projId=[]"
    TestCommon.SetRealtimeDataByProjid.assert_result_equals(request, expected, rt)
@pytest.mark.p0
def test_myTest_emptyDictProj():
    request = TestCommon.SetRealtimeDataByProjid.run({
        'proj': {},
        'point': myTest_calc_point,
        'value': calc_value
    })
    rt = []
    expected = "set_realtimedata_by_projid error:projId={}"
    TestCommon.SetRealtimeDataByProjid.assert_result_equals(request, expected, rt)
@pytest.mark.p0
def test_myTest_emptyListPoint():
    request = TestCommon.SetRealtimeDataByProjid.run({
        'proj': 49,
        'point': [],
        'value': calc_value
    })
    TestCommon.SetRealtimeDataByProjid.assert_point_error(request)
@pytest.mark.p0
def test_myTest_emptyDictPoint():
    request = TestCommon.SetRealtimeDataByProjid.run({
        'proj': 49,
        'point': {},
        'value': calc_value
    })
    TestCommon.SetRealtimeDataByProjid.assert_point_error(request)
@pytest.mark.p0
def test_myTest_strValuePoint():
    request = TestCommon.SetRealtimeDataByProjid.run({
        'proj': 49,
        'point': myTest_calc_point,
        'value': "this is calc point"
    })
    rt = TestCommon.getRealtimeData.run({
        'proj': 49,
        'pointList': [myTest_calc_point]
    })
    expected = [
        {
        "name": myTest_calc_point,
        "value": "this is calc point"
        }
    ]
    TestCommon.SetRealtimeDataByProjid.assert_result_equals(request, expected, rt)


