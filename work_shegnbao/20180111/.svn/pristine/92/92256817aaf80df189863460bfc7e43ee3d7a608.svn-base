#coding=utf-8
__author__ = 'angelia'

import pytest
from tests.utils import TestCommon

@pytest.mark.p0
def test_isRcsAdmin():
    rt = TestCommon.IsRcsAdmin.run(456)
    expected = {
    "data": 0,
    "msg": "",
    "code": "1",
    "success": True
}
    TestCommon.IsRcsAdmin.assert_result_equal(expected, rt)

@pytest.mark.p0
def test_isRcsAdmin_expiry():
    rt = TestCommon.IsRcsAdmin.run(3278)
    expected = {
    "data": 0,
    "msg": "",
    "code": "1",
    "success": True
}
    TestCommon.IsRcsAdmin.assert_result_equal(expected, rt)

@pytest.mark.p0
def test_isRcsAdmin_none():
    rt = TestCommon.IsRcsAdmin.run('')
    expected = {
    "data": None,
    "msg": "",
    "code": "1",
    "success": False
}
    TestCommon.IsRcsAdmin.assert_result_equal(expected, rt)

@pytest.mark.p0
def test_isRcsAdmin_right():
    rt = TestCommon.IsRcsAdmin.run(65)
    expected = {
    "data": 1,
    "msg": "",
    "code": "1",
    "success": True
}
    TestCommon.IsRcsAdmin.assert_result_equal(expected, rt)