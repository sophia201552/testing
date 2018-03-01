#coding=utf-8
__author__ = 'angelia'

import pytest
from tests.utils import TestCommon
from beopWeb.mod_admin.controllers import *

@pytest.mark.p0
def test_updateUsersSetting():
    old_data = do_load_users_setting({
        'userId':3278,
        'currentUser':1151
    })
    rt = TestCommon.UpdateUsersSetting.run({
        'userId':3278,
        'userRoleGroupList':['1','2','3','5','15'],
        'isManager':0,
        'supervisor':456,
        'country':'china'
    })
    new_data = do_load_users_setting({
        'userId':3278,
        'currentUser':1151
    })
    expected = {
        'userId':3278,
        'userRoleGroupList':['1','2','3','5','15'],
        'isManager':0,
        'supervisor':456,
        'country':'CH'
    }
    TestCommon.UpdateUsersSetting.assert_result_equal(old_data, new_data, expected, rt)

@pytest.mark.p0
def test_updateUsersSetting_country():
    old_data = do_load_users_setting({
        'userId':3278,
        'currentUser':1151
    })
    rt = TestCommon.UpdateUsersSetting.run({
        'userId':3278,
        'userRoleGroupList':['1','15'],
        'isManager':0,
        'supervisor':456,
        'country':'english'
    })
    new_data = do_load_users_setting({
        'userId':3278,
        'currentUser':1151
    })
    expected = {
        'userId':3278,
        'userRoleGroupList':['1','15'],
        'isManager':0,
        'supervisor':456,
        'country':'EN'
    }
    TestCommon.UpdateUsersSetting.assert_result_equal(old_data, new_data, expected, rt)