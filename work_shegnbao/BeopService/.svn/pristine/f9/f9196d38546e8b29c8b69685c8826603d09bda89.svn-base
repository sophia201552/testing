# coding=utf-8
import pytest
from tests import TestSpecific
from tests.utils import TestCommon
import random
import string
@pytest.mark.p0
def test_49():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "db":"myTest",
        "point":ran_str,
        "value":"456",
        "token":"eyJhbGciOiJIUzI1NiIsImV4cCI6MT"
    }
    rt=TestCommon.SetRealtimedataByProjname.run(post_data)
    post_realtime={
        'proj': 49,
        'pointList': [ran_str]
    }
    realtime_rt = TestCommon.getRealtimeData.run(post_realtime)
    TestCommon.SetRealtimedataByProjname.assert_result_message_equals("success",rt)
    TestCommon.SetRealtimedataByProjname.assert_result_equals(post_data,realtime_rt)
@pytest.mark.p0
def test_49_with_null_db():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "db":"",
        "point":ran_str,
        "value":"456",
        "token":"eyJhbGciOiJIUzI1NiIsImV4cCI6MT"
    }
    rt=TestCommon.SetRealtimedataByProjname.run(post_data)
    TestCommon.SetRealtimedataByProjname.assert_result_message_equals(TestSpecific.SetRealtimedataByProjname.DB_NULL_ERROR,rt)
@pytest.mark.p0
def test_49_with_number_db():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "db":5546,
        "point":ran_str,
        "value":"456",
        "token":"eyJhbGciOiJIUzI1NiIsImV4cCI6MT"
    }
    rt=TestCommon.SetRealtimedataByProjname.run(post_data)
    TestCommon.SetRealtimedataByProjname.assert_result_message_equals(TestSpecific.SetRealtimedataByProjname.DB_NULL_ERROR,rt)
@pytest.mark.p0
def test_49_with_number_string_db():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "db":"123",
        "point":ran_str,
        "value":"456",
        "token":"eyJhbGciOiJIUzI1NiIsImV4cCI6MT"
    }
    rt=TestCommon.SetRealtimedataByProjname.run(post_data)
    TestCommon.SetRealtimedataByProjname.assert_result_message_equals(TestSpecific.SetRealtimedataByProjname.DB_NULL_ERROR,rt)
@pytest.mark.p0
def test_49_with_special_characters_db():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "db":"%^&$",
        "point":ran_str,
        "value":"456",
        "token":"eyJhbGciOiJIUzI1NiIsImV4cCI6MT"
    }
    rt=TestCommon.SetRealtimedataByProjname.run(post_data)
    TestCommon.SetRealtimedataByProjname.assert_result_message_equals(TestSpecific.SetRealtimedataByProjname.DB_NULL_ERROR,rt)
@pytest.mark.p0
def test_49_with_null():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={}
    rt=TestCommon.SetRealtimedataByProjname.run(post_data)
    TestCommon.SetRealtimedataByProjname.assert_result_message_equals(TestSpecific.SetRealtimedataByProjname.DB_NULL_ERROR,rt)

@pytest.mark.p0
def test_49_with_null_point():
    post_data={
        "db":"myTest",
        "point":"",
        "value":"456",
        "token":"eyJhbGciOiJIUzI1NiIsImV4cCI6MT"
    }
    rt=TestCommon.SetRealtimedataByProjname.run(post_data)
    post_realtime={
        'proj': 49,
        'pointList': [""]
    }
    realtime_rt = TestCommon.getRealtimeData.run(post_realtime)
    TestCommon.SetRealtimedataByProjname.assert_result_message_equals("success",rt)
    TestCommon.SetRealtimedataByProjname.assert_result_message_equals(TestSpecific.SetRealtimedataByProjname.NULL_POINT_ERROR,realtime_rt)
@pytest.mark.p0
def test_49_with_number_value():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "db":"myTest",
        "point":ran_str,
        "value":4562,
        "token":"eyJhbGciOiJIUzI1NiIsImV4cCI6MT"
    }
    rt=TestCommon.SetRealtimedataByProjname.run(post_data)
    post_realtime={
        'proj': 49,
        'pointList': [ran_str]
    }
    realtime_rt = TestCommon.getRealtimeData.run(post_realtime)
    TestCommon.SetRealtimedataByProjname.assert_result_message_equals("success",rt)
    TestCommon.SetRealtimedataByProjname.assert_result_equals(post_data,realtime_rt)
@pytest.mark.p0
def test_49_with_null_token():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "db":"myTest",
        "point":ran_str,
        "value":"123",
        "token":""
    }
    rt=TestCommon.SetRealtimedataByProjname.run(post_data)
    post_realtime={
        'proj': 49,
        'pointList': [ran_str]
    }
    realtime_rt = TestCommon.getRealtimeData.run(post_realtime)
    TestCommon.SetRealtimedataByProjname.assert_result_message_equals("success",rt)
    TestCommon.SetRealtimedataByProjname.assert_result_equals(post_data,realtime_rt)





