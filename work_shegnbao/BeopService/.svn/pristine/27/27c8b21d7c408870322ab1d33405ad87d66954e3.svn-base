# coding=utf-8
import pytest
from tests import TestSpecific
from tests.utils import TestCommon
from datetime import datetime,timedelta
import random
import string
@pytest.mark.p0
def test_49_m1():
    hisdata_time="2017-01-01 00:04:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"m1",
        "hisdata":[[hisdata_time,ran_str,2222]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    post_history={
        'projectId': post_data['id'],
        'timeStart':hisdata_time,
        'timeEnd': hisdata_time,
        'timeFormat': post_data['timeformat'],
        'pointList': [ran_str]
    }
    history_rt = TestCommon.GetHistoryDataPadded.run(post_history)
    TestCommon.SyncDataToMongodb.assert_result_message_equals(1,rt)
    TestCommon.SyncDataToMongodb.assert_result_equals(post_data,history_rt)
@pytest.mark.p0
def test_49_m5():
    hisdata_time="2017-01-01 00:05:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"m5",
        "hisdata":[[hisdata_time,ran_str,444]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    post_history={
        'projectId': post_data['id'],
        'timeStart':hisdata_time,
        'timeEnd': hisdata_time,
        'timeFormat': post_data['timeformat'],
        'pointList': [ran_str]
    }
    history_rt = TestCommon.GetHistoryDataPadded.run(post_history)
    TestCommon.SyncDataToMongodb.assert_result_message_equals(1,rt)
    TestCommon.SyncDataToMongodb.assert_result_equals(post_data,history_rt)
@pytest.mark.p0
def test_49_h1():
    hisdata_time="2017-01-01 01:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    post_history={
        'projectId': post_data['id'],
        'timeStart':hisdata_time,
        'timeEnd': hisdata_time,
        'timeFormat': post_data['timeformat'],
        'pointList': [ran_str]
    }
    history_rt = TestCommon.GetHistoryDataPadded.run(post_history)
    TestCommon.SyncDataToMongodb.assert_result_message_equals(1,rt)
    TestCommon.SyncDataToMongodb.assert_result_equals(post_data,history_rt)
@pytest.mark.p0
def test_49_d1():
    hisdata_time="2017-01-03 00:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    post_history={
        'projectId': post_data['id'],
        'timeStart':hisdata_time,
        'timeEnd': hisdata_time,
        'timeFormat': post_data['timeformat'],
        'pointList': [ran_str]
    }
    history_rt = TestCommon.GetHistoryDataPadded.run(post_history)
    TestCommon.SyncDataToMongodb.assert_result_message_equals(1,rt)
    TestCommon.SyncDataToMongodb.assert_result_equals(post_data,history_rt)
@pytest.mark.p0
def test_49_month():
    hisdata_time="2017-01-01 00:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    post_history={
        'projectId': post_data['id'],
        'timeStart':hisdata_time,
        'timeEnd': hisdata_time,
        'timeFormat': post_data['timeformat'],
        'pointList': [ran_str]
    }
    history_rt = TestCommon.GetHistoryDataPadded.run(post_history)
    TestCommon.SyncDataToMongodb.assert_result_message_equals(1,rt)
    TestCommon.SyncDataToMongodb.assert_result_equals(post_data,history_rt)
@pytest.mark.p0
def test_49_different_time():
    hisdata_time_h1_1="2017-01-01 01:00:00"
    hisdata_time_h1_2="2017-01-01 02:00:00"
    hisdata_time_h3_3="2017-01-01 03:00:00"
    ran_str_h1_1 = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    ran_str_h1_2 = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    ran_str_h3_3 = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[[hisdata_time_h1_1,ran_str_h1_1,111],[hisdata_time_h1_2,ran_str_h1_2,222],[hisdata_time_h3_3,ran_str_h3_3,333]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    post_history={
        'projectId': post_data['id'],
        'timeStart':hisdata_time_h1_1,
        'timeEnd': hisdata_time_h3_3,
        'timeFormat': post_data['timeformat'],
        'pointList': [ran_str_h1_1,ran_str_h1_2,ran_str_h3_3]
    }
    history_rt = TestCommon.GetHistoryDataPadded.run(post_history)
    TestCommon.SyncDataToMongodb.assert_result_message_equals(3,rt)
    TestCommon.SyncDataToMongodb.assert_result_equals(post_data,history_rt)
@pytest.mark.p0
def test_49_h1_strId():
    hisdata_time="2017-01-01 02:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":'49',
        "timeformat":"h1",
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    post_history={
        'projectId': post_data['id'],
        'timeStart':hisdata_time,
        'timeEnd': hisdata_time,
        'timeFormat': post_data['timeformat'],
        'pointList': [ran_str]
    }
    history_rt = TestCommon.GetHistoryDataPadded.run(post_history)
    TestCommon.SyncDataToMongodb.assert_result_message_equals(1,rt)
    TestCommon.SyncDataToMongodb.assert_result_equals(post_data,history_rt)
@pytest.mark.p0
def test_h1_wrong_dbname_with_nullstr():
    hisdata_time="2017-01-01 02:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":456,
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    TestCommon.SyncDataToMongodb.assert_error(TestSpecific.SyncDataToMongodb.DBNAME_WITH_NULL,rt)
@pytest.mark.p0
def test_h1_wrong_timeformat_with_number():
    hisdata_time="2017-01-01 02:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":456,
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    TestCommon.SyncDataToMongodb.assert_error(TestSpecific.SyncDataToMongodb.TIMEFORMAT_ERROR,rt)
@pytest.mark.p0
def test_h1_wrong_timeformat_with_string():
    hisdata_time="2017-01-01 02:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":'',
        "timeformat":'tyii',
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    TestCommon.SyncDataToMongodb.assert_error(TestSpecific.SyncDataToMongodb.TIMEFORMAT_ERROR,rt)
@pytest.mark.p0
def test_h1_wrong_timeformat_with_special_characters():
    hisdata_time="2017-01-01 02:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":'',
        "timeformat":'&^^%&*',
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    TestCommon.SyncDataToMongodb.assert_error(TestSpecific.SyncDataToMongodb.TIMEFORMAT_ERROR,rt)
@pytest.mark.p0
def test_49_h1_out_range_of_minTime_for_project():
    hisdata_time="2017-01-01 02:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2013-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    TestCommon.SyncDataToMongodb.assert_error(TestSpecific.SyncDataToMongodb.OUT_TIME_ERROR,rt)
@pytest.mark.p0
def test_49_h1_wrong_minTime():
    hisdata_time="2017-01-01 02:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2014-01-01 00:00",
        "maxtime":"2017-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    TestCommon.SyncDataToMongodb.assert_error(TestSpecific.SyncDataToMongodb.TIME_ERROR.format("".join(post_data['mintime'])),rt)

@pytest.mark.p0
def test_49_h1_out_range_of_maxTime_for_project():
    hisdata_time="2017-01-01 02:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2018-08-11 23:59:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    TestCommon.SyncDataToMongodb.assert_error(TestSpecific.SyncDataToMongodb.OUT_TIME_ERROR,rt)
@pytest.mark.p0
def test_49_h1_wrong_maxTime():
    hisdata_time="2017-01-01 02:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    TestCommon.SyncDataToMongodb.assert_error(TestSpecific.SyncDataToMongodb.TIME_ERROR .format(post_data['maxtime']),rt)
@pytest.mark.p0
def test_49_h1_wrong_Time():
    hisdata_time="2017-01-01 02:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[[hisdata_time,ran_str,111]],
        "mintime":"2014-01-01 00:00",
        "maxtime":"2017-08-11 23:59"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    TestCommon.SyncDataToMongodb.assert_error(TestSpecific.SyncDataToMongodb.TIME_ERROR.format(post_data['mintime']),rt)
@pytest.mark.p0
def test_49_h1_null_history():
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:00"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    TestCommon.SyncDataToMongodb.assert_error(TestSpecific.SyncDataToMongodb.NO_HISTORY,rt)
@pytest.mark.p0
def test_49_h1_null_history_list():
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[[]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:00"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    TestCommon.SyncDataToMongodb.assert_error(TestSpecific.SyncDataToMongodb.OUT_LIST_RANGE,rt)
@pytest.mark.p0
def test_49_h1_wrong_time_history():
    hisdata_time="2017-01-01 02:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[[hisdata_time,ran_str,899]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:00"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    TestCommon.SyncDataToMongodb.assert_error(TestSpecific.SyncDataToMongodb.HISTORY_TIME_ERROR.format(hisdata_time),rt)
@pytest.mark.p0
def test_49_h1_outTime_of_history():
    hisdata_time="2018-10-01 02:00:00"
    ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    post_data={
        "dbname":"beopdata_myTest",
        "mysqlname":"beopdata_myTest",
        "id":49,
        "timeformat":"h1",
        "hisdata":[[hisdata_time,ran_str,988]],
        "mintime":"2014-01-01 00:00:00",
        "maxtime":"2017-08-11 23:59:00"
    }
    rt=TestCommon.SyncDataToMongodb.run(post_data)
    post_history={
        'projectId': post_data['id'],
        'timeStart':hisdata_time,
        'timeEnd': hisdata_time,
        'timeFormat': post_data['timeformat'],
        'pointList': [ran_str]
    }
    history_rt = TestCommon.GetHistoryDataPadded.run(post_history)
    TestCommon.SyncDataToMongodb.assert_result_message_equals(1,rt)
    TestCommon.SyncDataToMongodb.assert_result_null('no data history',history_rt)



