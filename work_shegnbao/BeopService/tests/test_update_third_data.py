# coding=utf-8
import pytest
from tests import TestSpecific
from tests.utils import TestCommon
import random
import string
from mod_DataAccess.BEOPDataAccess import *


# @pytest.mark.p0
# def test_dtu_type0_prjId_exist():
#     ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
#     before_rt = BEOPDataAccess.getInstance().getBufferRTDataWithTimeByProj(687, ['test1', 'test2', 'test3'])
#     post_data = {
#         "dtuName": "DTUServerTest",
#         "time": "2016-10-01 02:00:00",
#         "type": 0,
#         "pointNameList": ["%s" % ran_str],
#         "pointValueList": ["111"],
#         "length": 1,
#         "source": "test"
#     }
#     rt = TestCommon.UpdateThirdData.run(post_data)
#     TestCommon.UpdateThirdData.assert_result(TestSpecific.UpdateThirdData.CORRECT, rt)
#     TestCommon.UpdateThirdData.assert_dtuserver_prj_and_dtuserver_prj_info(post_data)
#     TestCommon.UpdateThirdData.assert_rttable(post_data)
#     TestCommon.UpdateThirdData.assert_dtuserver_online_offline(post_data)
#     post_history = {
#         'projectId': 687,
#         'timeStart': post_data.get('time'),
#         'timeEnd': post_data.get('time'),
#         'timeFormat': 'm5',
#         'pointList': post_data.get('pointNameList')
#     }
#     now = datetime.now()
#     while 1:
#         history_rt = TestCommon.GetHistoryDataPadded.run(post_history)
#         if [item.get("name") for item in history_rt]:
#             break
#         if (datetime.now() - now()).seconds > 300:
#             break
#             time.sleep(2)
#     TestCommon.UpdateThirdData.assert_histdata(post_data, history_rt)
#     TestCommon.UpdateThirdData.assert_trigger_one_calculation(before_rt)
#
#
# @pytest.mark.p0
# def test_dtu_type2_prjId_exist():
#     ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
#     post_data = {
#         "dtuName": "DTUServerTest",
#         "time": "2016-10-01 02:00:00",
#         "type": 2,
#         "pointNameList": ["%s" % ran_str],
#         "pointValueList": ["111"],
#         "length": 1,
#         "source": "test"
#     }
#     rt = TestCommon.UpdateThirdData.run(post_data)
#     TestCommon.UpdateThirdData.assert_result(TestSpecific.UpdateThirdData.CORRECT, rt)
#     TestCommon.UpdateThirdData.assert_dtuserver_prj_and_dtuserver_prj_info(post_data)
#     TestCommon.UpdateThirdData.assert_dtuserver_online_offline(post_data)
#     post_history = {
#         'projectId': 687,
#         'timeStart': post_data.get('time'),
#         'timeEnd': post_data.get('time'),
#         'timeFormat': 'm5',
#         'pointList': post_data.get('pointNameList')
#     }
#     now = datetime.now()
#     while 1:
#         history_rt = TestCommon.GetHistoryDataPadded.run(post_history)
#         if [item.get("name") for item in history_rt]:
#             break
#         if (datetime.now() - now()).seconds > 300:
#             break
#             time.sleep(2)
#     TestCommon.UpdateThirdData.assert_histdata(post_data, history_rt)
#
#
# @pytest.mark.p0
# def test_dtu_type0_prjId_not_exist():
#     ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
#     post_data = {
#         "dtuName": ran_str,
#         "time": "2016-10-01 02:00:00",
#         "type": 0,
#         "pointNameList": ["%s" % ran_str],
#         "pointValueList": ["111"],
#         "length": 1,
#         "source": "test"
#     }
#     rt = TestCommon.UpdateThirdData.run(post_data)
#     TestCommon.UpdateThirdData.assert_result(TestSpecific.UpdateThirdData.CORRECT, rt)
#     TestCommon.UpdateThirdData.assert_dtuserver_prj_and_dtuserver_prj_info(post_data)
#     TestCommon.UpdateThirdData.assert_rttable(post_data)
#     TestCommon.UpdateThirdData.assert_dtuserver_online_offline(post_data)
#
#
# @pytest.mark.p0
# def test_dtu_type1_prjId_not_exist():
#     ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
#     post_data = {
#         "dtuName": ran_str,
#         "time": "2016-10-01 02:00:00",
#         "type": 1,
#         "pointNameList": ["%s" % ran_str],
#         "pointValueList": ["111"],
#         "length": 1,
#         "source": "test"
#     }
#     rt = TestCommon.UpdateThirdData.run(post_data)
#     TestCommon.UpdateThirdData.assert_result(TestSpecific.UpdateThirdData.CORRECT, rt)
#     TestCommon.UpdateThirdData.assert_dtuserver_prj_and_dtuserver_prj_info(post_data)
#     TestCommon.UpdateThirdData.assert_rttable(post_data)
#     TestCommon.UpdateThirdData.assert_dtuserver_online_offline(post_data)
#
# @pytest.mark.p0
# def test_dtu_type2_prjId_not_exist():
#     ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
#     post_data = {
#         "dtuName": ran_str,
#         "time": "2016-10-01 02:00:00",
#         "type": 2,
#         "pointNameList": ["%s" % ran_str],
#         "pointValueList": ["111"],
#         "length": 1,
#         "source": "test"
#     }
#     rt = TestCommon.UpdateThirdData.run(post_data)
#     TestCommon.UpdateThirdData.assert_result(TestSpecific.UpdateThirdData.CORRECT, rt)
#     TestCommon.UpdateThirdData.assert_dtuserver_prj_and_dtuserver_prj_info(post_data)
#     TestCommon.UpdateThirdData.assert_dtuserver_online_offline(post_data)
#
#
# @pytest.mark.p0
# def test_dtu_two_pointname_prjId_not_exist():
#     ran_str1 = ''.join(random.sample(string.ascii_letters + string.digits, 8))
#     ran_str2 = ''.join(random.sample(string.ascii_letters + string.digits, 8))
#     post_data = {
#         "dtuName": ran_str1,
#         "time": "2016-10-01 02:00:00",
#         "type": 0,
#         "pointNameList": ["%s" % ran_str1, "%s" % ran_str2],
#         "pointValueList": ["111", "222"],
#         "length": 2,
#         "source": "test"
#     }
#     rt = TestCommon.UpdateThirdData.run(post_data)
#     TestCommon.UpdateThirdData.assert_result(TestSpecific.UpdateThirdData.CORRECT, rt)
#     TestCommon.UpdateThirdData.assert_dtuserver_prj_and_dtuserver_prj_info(post_data)
#     TestCommon.UpdateThirdData.assert_rttable(post_data)
#     TestCommon.UpdateThirdData.assert_dtuserver_online_offline(post_data)


@pytest.mark.p0
def test_none_dtuname():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data = {
        "dtuName": None,
        "time": "2016-10-01 02:00:00",
        "type": 0,
        "pointNameList": ["%s" % ran_str],
        "pointValueList": ["111"],
        "length": 1,
        "source": "test"
    }
    rt = TestCommon.UpdateThirdData.run(post_data)
    TestCommon.UpdateThirdData.assert_result_message(rt)


@pytest.mark.p0
def test_none_time():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data = {
        "dtuName": "DTUServerTest",
        "time": None,
        "type": 0,
        "pointNameList": ["%s" % ran_str],
        "pointValueList": ["111"],
        "length": 1,
        "source": "test"
    }
    rt = TestCommon.UpdateThirdData.run(post_data)
    TestCommon.UpdateThirdData.assert_result_message(rt)


@pytest.mark.p0
def test_none_type():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data = {
        "dtuName": "DTUServerTest",
        "time": "2016-10-01 02:00:00",
        "type": None,
        "pointNameList": ["%s" % ran_str],
        "pointValueList": ["111"],
        "length": 1,
        "source": "test"
    }
    rt = TestCommon.UpdateThirdData.run(post_data)
    TestCommon.UpdateThirdData.assert_result_message(rt)


@pytest.mark.p0
def test_invaild_type():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data = {
        "dtuName": "DTUServerTest",
        "time": "2016-10-01 02:00:00",
        "type": 3,
        "pointNameList": ["%s" % ran_str],
        "pointValueList": ["111"],
        "length": 1,
        "source": "test"
    }
    rt = TestCommon.UpdateThirdData.run(post_data)
    TestCommon.UpdateThirdData.assert_result_message(rt)


@pytest.mark.p0
def test_None_pointNameList():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data = {
        "dtuName": "DTUServerTest",
        "time": "2016-10-01 02:00:00",
        "type": 1,
        "pointNameList": None,
        "pointValueList": ["111"],
        "length": 1,
        "source": "test"
    }
    rt = TestCommon.UpdateThirdData.run(post_data)
    TestCommon.UpdateThirdData.assert_result_message( rt)


@pytest.mark.p0
def test_None_pointValueList():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data = {
        "dtuName": "DTUServerTest",
        "time": "2016-10-01 02:00:00",
        "type": 1,
        "pointNameList": ["%s" % ran_str],
        "pointValueList": None,
        "length": 1,
        "source": "test"
    }
    rt = TestCommon.UpdateThirdData.run(post_data)
    TestCommon.UpdateThirdData.assert_result_message(rt)


@pytest.mark.p0
def test_None_data():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data = {}
    rt = TestCommon.UpdateThirdData.run(post_data)
    TestCommon.UpdateThirdData.assert_result_message(rt)


@pytest.mark.p0
def test_length_not_match():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data = {
        "dtuName": "DTUServerTest",
        "time": "2016-10-01 02:00:00",
        "type": 1,
        "pointNameList": ["%s" % ran_str],
        "pointValueList": ["111"],
        "length": 2,
        "source": "test"
    }
    rt = TestCommon.UpdateThirdData.run(post_data)
    TestCommon.UpdateThirdData.assert_result_message(rt)


@pytest.mark.p0
def test_None_length():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data = {
        "dtuName": "DTUServerTest",
        "time": "2016-10-01 02:00:00",
        "type": 1,
        "pointNameList": ["%s" % ran_str],
        "pointValueList": ["111"],
        "length": None,
        "source": "test"
    }
    rt = TestCommon.UpdateThirdData.run(post_data)
    TestCommon.UpdateThirdData.assert_result_message(rt)


@pytest.mark.p0
def test_None_source():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data = {
        "dtuName": "DTUServerTest",
        "time": "2016-10-01 02:00:00",
        "type": 1,
        "pointNameList": ["%s" % ran_str],
        "pointValueList": ["111"],
        "length": 1,
        "source": None
    }
    rt = TestCommon.UpdateThirdData.run(post_data)
    TestCommon.UpdateThirdData.assert_result_message(rt)


@pytest.mark.p0
def test_not_exist_dtuname():
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data = {
        "time": "2016-10-01 02:00:00",
        "type": 1,
        "pointNameList": ["%s" % ran_str],
        "pointValueList": ["111"],
        "length": 1,
        "source": "test"
    }
    rt = TestCommon.UpdateThirdData.run(post_data)
    TestCommon.UpdateThirdData.assert_result_message(rt)


# # This test takes too long. Needs optimization.
# @pytest.mark.p2
# def test_dtu_type1_prjId_exist():
#     ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
#     before_rt = BEOPDataAccess.getInstance().getBufferRTDataWithTimeByProj(687, ['test1', 'test2', 'test3'])
#     post_data = {
#         "dtuName": "DTUServerTest",
#         "time": "2016-10-01 02:00:00",
#         "type": 1,
#         "pointNameList": ["%s" % ran_str],
#         "pointValueList": ["111"],
#         "length": 1,
#         "source": "test"
#     }
#     rt = TestCommon.UpdateThirdData.run(post_data)
#     TestCommon.UpdateThirdData.assert_result(TestSpecific.UpdateThirdData.CORRECT, rt)
#     TestCommon.UpdateThirdData.assert_dtuserver_prj_and_dtuserver_prj_info(post_data)
#     print('assert_dtuserver_prj_and_dtuserver_prj_info')
#     TestCommon.UpdateThirdData.assert_rttable(post_data)
#     print('assert_rttable')
#     TestCommon.UpdateThirdData.assert_dtuserver_online_offline(post_data)
#     print('assert_dtuserver_online_offline')
#     TestCommon.UpdateThirdData.assert_trigger_one_calculation(before_rt)
#     print('assert_trigger_one_calculation')
