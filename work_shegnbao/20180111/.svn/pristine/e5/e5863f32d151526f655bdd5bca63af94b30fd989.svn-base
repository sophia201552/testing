#coding=utf-8
__authot__ = 'angelia'

import pytest
from tests.utils import TestCommon
import json

@pytest.mark.p0
def test_load_project_permission():
    rt = TestCommon.LoadProjectPermission.run({
        'userId':1
    })
    expected = {
        'id': [72,293],
        'projectName_en': ['shhuawei', '175LiverpoolStreet'],
        'projectName': ['上海华为', '175Liverpoolst']
    }
    TestCommon.LoadProjectPermission.assert_result_equal(expected, rt)

@pytest.mark.p0
def test_load_project_permission_wrong():
    result = TestCommon.LoadProjectPermission.run({
        'userId':''
    })
    rt = json.loads(result.data.decode())
    expected = {
        'data': '',
        'success':False
    }
    TestCommon.LoadProjectPermission.assert_result_equal(expected, rt)