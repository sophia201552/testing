# coding=utf-8

import os
import time
from tests import TestSpecific
from mod_DataAccess.BEOPDataAccess import *

def almost_equals(expected, actual):
    return abs(expected - actual) < 0.001


class AssertionRecorder:
    def __init__(self):
        self._assertion_failures = []

    def check(self, predication, message):
        if not predication:
            self._assertion_failures.append(message)
        return predication

    def do_assertion(self):
        assert len(self._assertion_failures) == 0, \
            os.linesep + os.linesep.join(failure for failure in self._assertion_failures)


def value_equals(expected, actual):
    if isinstance(expected, float) and isinstance(actual, float):
        return almost_equals(expected, actual)
    elif isinstance(expected, float) or isinstance(actual, float):
        try:
            return almost_equals(float(expected), float(actual))
        except:
            return False
    elif isinstance(expected, str) or isinstance(actual, str):
        return str(expected) == str(actual)
    else:
        return expected == actual


class TestCommon:
    class GetHistoryDataPadded:
        @staticmethod
        def run(arguments):
            return TestSpecific.GetHistoryDataPadded.run(arguments)

        @staticmethod
        def assert_error(expected_error_message, actual_response_json):
            if expected_error_message is None or actual_response_json is None:
                assert expected_error_message is None and actual_response_json is None, \
                    "Expecting None but got non-None response json"
            actual_error_message = TestSpecific.GetHistoryDataPadded.get_error_from_response(actual_response_json)
            assert expected_error_message.strip() == actual_error_message.strip(),\
                "Actual error message is not as expected: %s" % actual_error_message

        @staticmethod
        def assert_no_history_data(actual_response_json):
            TestCommon.GetHistoryDataPadded.assert_error(
                TestSpecific.GetHistoryDataPadded.NO_HISTORY_DATA, actual_response_json)

        @staticmethod
        def assert_unsupported_timeFormat(actual_response_json):
            TestCommon.GetHistoryDataPadded.assert_error(
                TestSpecific.GetHistoryDataPadded.UNSUPPORTED_TIMEFORMAT, actual_response_json)

        @staticmethod
        def assert_invalid_time_string_error(actual_response_json):
            TestCommon.GetHistoryDataPadded.assert_error(
                TestSpecific.GetHistoryDataPadded.INVALID_TIME_STRING, actual_response_json)

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, list), "expected value is not a list!"
            assert isinstance(actual, list), "actual value is not a list"
            assert len(expected) != 0, 'You should put in expected result but got empty'

            recorder = AssertionRecorder()

            # check error in expected
            if 'error' in expected[0].keys():
                assertion_message = 'Expected error message is %s but got %s in record!' % (expected, actual)
                assert expected == actual, assertion_message
            else:
                # check point list equality
                expected.sort(key=lambda item: item.get("name"))
                actual.sort(key=lambda item: item.get("name"))
                expected_point_list = [item.get("name") for item in expected]
                actual_point_list = [item.get("name") for item in actual]
                assert expected_point_list == actual_point_list, (
                    "expected point list does not match actual point list! %s, %s" %
                    (expected_point_list, actual_point_list))

                # iterate over each point
                for i in range(0, len(expected)):
                    expected_item = expected[i]
                    actual_item = actual[i]
                    point_name = expected_item.get("name")
                    # check statistics information
                    for field_name in ["min", "max", "median", "avg", "std"]:
                        expected_stat_value = expected_item.get(field_name)
                        if expected_stat_value is None:
                            continue
                        actual_stat_value = actual_item.get(field_name)
                        assertion_message = 'Expecting %s but got %s in %s of %s' % (
                            expected_stat_value,
                            actual_stat_value,
                            field_name,
                            point_name
                        )
                        recorder.check(value_equals(expected_stat_value, actual_stat_value), assertion_message)

                    # check each history data record of the current point
                    expected_history = expected_item.get("history")
                    actual_history = actual_item.get("history")
                    if not recorder.check(expected_history is not None, "history of expected %s is None!" % point_name)\
                        or \
                       not recorder.check(actual_history is not None, "history of actual %s is None!" % point_name):
                        continue
                    if not recorder.check(isinstance(expected_history, list),
                                          "history of expected %s is not a list!" % point_name) or \
                        not recorder.check(isinstance(actual_history, list),
                                           "history of actual %s is not a list!" % point_name):
                        continue
                    # check expected record exists and is correct
                    for expected_record in expected_history:
                        if not recorder.check(expected_record is not None,
                                              "None record found in history of expected %s" % point_name):
                            continue
                        expected_record_time = expected_record.get("time")
                        if not recorder.check(expected_record_time is not None,
                                              "Record with value = %s in history of expected %s has a 'None' time" % (
                                                      expected_record.get("value"), point_name)):
                            continue
                        iter_actual_record_at_time = (actual_record for actual_record in actual_history
                                                      if actual_record is not None and
                                                      actual_record.get("time") == expected_record_time)
                        actual_record_at_time = next(iter_actual_record_at_time, None)
                        assertion_message = "Missing record with time = %s in history of actual %s" % (
                            expected_record_time, point_name)
                        if not recorder.check(actual_record_at_time is not None, assertion_message):
                            continue
                        extra_actual_record_at_time = next(iter_actual_record_at_time, None)
                        if not recorder.check(extra_actual_record_at_time is None,
                                              "Redundant record with time = %s in history of actual %s" % (
                                                      expected_record_time, point_name)):
                            continue
                        expected_record_value = expected_record.get("value")
                        actual_record_value = actual_record_at_time.get("value")
                        if expected_record_value is None and actual_record_value is None:
                            continue
                        assertion_message = \
                            'Expecting %s but got %s in record with time = %s in history of actual %s' % (
                                expected_record_value, actual_record_value, expected_record_time, point_name)
                        recorder.check(value_equals(expected_record_value, actual_record_value), assertion_message)

                    # check whether unexpected actual records exist
                    for actual_record in actual_history:
                        if not recorder.check(actual_record is not None,
                                              "None record found in history of actual %s" % point_name):
                            continue
                        actual_record_time = actual_record.get("time")
                        if not recorder.check(actual_record_time is not None,
                                              "Record with value = %s in history of actual %s has a 'None' time" % (
                                                      actual_record.get("value"), point_name)):
                            continue
                        iter_expected_record_at_time = (expected_record for expected_record in expected_history
                                                        if expected_record is not None
                                                        and expected_record.get("time") == actual_record_time)
                        expected_record_at_time = next(iter_expected_record_at_time, None)
                        if not recorder.check(expected_record_at_time is not None,
                                              "Unexpected record with time = %s in history of actual %s" % (
                                                      actual_record_time, point_name)):
                            continue
                        extra_expected_record_at_time = next(iter_expected_record_at_time, None)
                        recorder.check(extra_expected_record_at_time is None,
                                       "Redundant record with time = %s in history of expected %s" % (
                                           actual_record_time, point_name))

            recorder.do_assertion()

        #added by yan,for accum var only
        @staticmethod
        def assert_accum_var(orig_point_list, actual):
            if actual is None:
                return

            assert actual is not None, 'actual is None'
            assert isinstance(actual, list), "actual value is not a list"

            recorder = AssertionRecorder()

            if 'error' in actual[0].keys():
                assertion_message = 'Got error message %s in record!' % (actual)
                assert False, assertion_message
            else:
                actual.sort(key=lambda item: item.get("name"))
                actual_point_list = [x.get("name") for x in actual]
                more = list(set(orig_point_list) - set(actual_point_list))
                assert len(more) == 0, "actual points in result is less than original points"
                # iterate each item
                for i in range(0, len(actual)):
                    actual_item = actual[i]
                    actual_history = actual_item.get("history")
                    point_name = actual_item.get("name")
                    if not recorder.check(actual_history is not None, "history of actual %s is None!" % point_name):
                        continue
                    if not recorder.check(isinstance(actual_history, list), "history of actual %s is not a list!" % point_name):
                        continue
                    for index in range(0, len(actual_history)-1):
                        try:
                            value2 = float(actual_history[index+1].get("value"))
                            value1 = float(actual_history[index].get("value"))
                            if not recorder.check(value2-value1>=0, "%s: %s is not greater than %s"%(point_name, actual_history[index+1], actual_history[index])):
                                break
                        except Exception as e:
                            recorder.check(False, str(e))
            recorder.do_assertion()


    class getRealtimeData:
        @staticmethod
        def run(arguments):
            return TestSpecific.GetRealtimeData.run(arguments)

        @staticmethod
        def assert_error(expected_error_message, actual_response_json):
            if expected_error_message is None or actual_response_json is None:
                assert expected_error_message is None and actual_response_json is None, \
                    "Expecting None but got non-None response json"
            actual_error_message = TestSpecific.GetRealtimeData.get_error_from_response(actual_response_json)
            assert expected_error_message.strip() == actual_error_message.strip(),\
                "Actual error message is not as expected: %s" % actual_error_message

        @staticmethod
        def assert_result_equals(expected, actual):
            # check general data structure
            recorder = AssertionRecorder()
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            if type(expected) == list:
                assert len(expected) != 0 , 'You should put in expected result but got empty'
                # check point list equality
                if 'error' in expected[0].keys():
                    assertion_message = 'Expected error message is %s but got %s in record!' % (expected, actual)
                    assert expected == actual, assertion_message
                else:
                    expected.sort(key=lambda item: item.get("name"))
                    actual.sort(key=lambda item: item.get("name"))
                    expected_point_list = [item.get("name") for item in expected]
                    actual_point_list = [item.get("name") for item in actual]
                    assert expected_point_list == actual_point_list, (
                        "expected point list does not match actual point list! %s, %s" %
                        (expected_point_list, actual_point_list))

                    # iterate over each point
                    for i in range(0, len(expected)):
                        expected_item = expected[i]
                        actual_item = actual[i]
                        expected_record_value = expected_item.get("value")
                        actual_record_value = actual_item.get("value")
                        if expected_record_value is None and actual_record_value is None:
                            continue
                        assert len(actual_record_value) != 0 ,'Expecting result is not empty but got none'
                recorder.do_assertion()
             # check error in expected
            if type(expected) == dict:
                assert len(expected) != 0 , 'You should put in expected result but got empty'
                assertion_message = 'Expected error message is %s but got %s in record!' % (expected, actual)
                assert expected == actual, assertion_message
            recorder.do_assertion()

    class getRealtimeData_with_time:
        @staticmethod
        def run(arguments):
            return TestSpecific.GetRealtimeDataWithTime.run(arguments)

        @staticmethod
        def run_of_raw(arguments):
            return TestSpecific.GetRealtimeDataWithTime.run_of_raw(arguments)

        @staticmethod
        def assert_error(expected_error_message, actual_response_json):
            if expected_error_message is None or actual_response_json is None:
                assert expected_error_message is None and actual_response_json is None, \
                    "Expecting None but got non-None response json"
            actual_error_message = TestSpecific.GetRealtimeDataWithTime.get_error_from_response(actual_response_json)
            assert expected_error_message.strip() == actual_error_message.strip(),\
                "Actual error message is not as expected: %s" % actual_error_message

        @staticmethod
        def assert_result_equals(expected, actual):
            # check general data structure
            recorder = AssertionRecorder()
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a dict!"
            assert isinstance(actual, dict), "actual value is not a dict"
            assert len(expected) != 0 , 'You should put in expected result but got empty'

            # check point list equality
            if expected.get('status') == 0:
                expected_error = expected.get('message')
                actual_error = actual.get('message')
                assertion_message = 'Expected error message is %s but got %s in record!' % (expected_error, actual_error)
                assert expected_error == actual_error, assertion_message
            if expected.get('status') == 1:
                expected_data = expected.get('data')
                actual_data = actual.get('data')
                for index in range(0,len(expected_data)):
                    expected_item = expected_data[index]
                    actual_item = actual_data[index]
                    expected_name = expected_item[0]
                    actual_name = actual_item[0]
                    expected_value = expected_item[1]
                    actual_value = actual_item[1]
                    actual_time = actual_item[2]
                    assert expected_name == actual_name, (
                        "expected point name does not match actual point name! %s, %s" %
                        (expected_name, actual_name))
                    if expected_value is None and actual_value is None:
                        continue
                    assert len(actual_value) != 0 ,'Expecting result is not empty but got none'
                    assert actual_time is not None, '%s: get realtime data out of time' %(actual_name)
            recorder.do_assertion()

    class saveDataToMongodb:
        #get result
        @staticmethod
        def run(arguments):
            return TestSpecific.SaveDataToMongoDB.run(arguments)
        #assert result
        @staticmethod
        def assert_result(insert_data, result, his_data):
            len_result = len(result)
            assert len_result > 0, "result of saveDataToMongodb is []"
            data = insert_data.get('saveList')
            assert len_result == len(data), "result of saveDataToMongodb has different length of %s"%(insert_data,)
            assert isinstance(his_data, list) and len(his_data) >1, "get history data failed %s"%(insert_data,)
            assert len(his_data) == len(data), "hisdata has different length of %s"%(insert_data,)
            recorder = AssertionRecorder()
            for index, item in enumerate(result):
                r = item.get('result')
                recorder.check(r, "save %s failed"%(data[index]))
                if r:
                    for d in his_data:
                        if d.get('name') == data[index].get('pointName'):
                            v_r = d.get('history')[0].get('value')
                            v_i = data[index].get('pointValue')
                            t_r = d.get('history')[0].get('time')
                            t_i = data[index].get('timeAt')
                            recorder.check(v_r == v_i, "excepted value is %s, actual value is %s"%(v_i, v_r))
                            recorder.check(t_r == t_i, "excepted time is %s, actual time is %s" % (t_i, t_r))
                            break
                    else:
                        recorder.check(False, "%s is not in return result"%(data[index].get('pointName'),))
            recorder.do_assertion()

    class GetHistoryAtTime:
        @staticmethod
        def run(arguments):
            return TestSpecific.GetHistoryAtTime.run(arguments)

        @staticmethod
        def assert_equal_result(expected_value, actual_value):
            assert len(expected_value) == len(actual_value), "different length between excepted_value and actual_value"
            recorder = AssertionRecorder()
            for index, value in enumerate(expected_value):
                recorder.check(value_equals(value, actual_value[index]), "expected value is %s, actual value is %s"%(value, actual_value[index]))
            recorder.do_assertion()

    class CopyRealtimedataBetweenProject:
        @staticmethod
        def run(arguments):
            return TestSpecific.CopyRealtimedataBetweenProject.run(arguments)

        @staticmethod
        def assert_result(expected_value, actual_value, rt):
            assert rt.get('info') == 'Success', "failed to execute func 'copy_realtimedata_between_project'"
            recorder = AssertionRecorder()
            if expected_value.get('status') == 1 and actual_value.get('status') == 1:
                expected_data = expected_value.get('data')
                actual_data = actual_value.get('data')
                for expected in expected_data:
                    for actual in actual_data:
                        if expected[0] == actual[0]:
                            recorder.check(expected[1] == actual[1],
                                           "expected value(%s) is not equal to actual value(%s)"%(expected[1], actual[1]))
                            recorder.check(expected[2] == actual[2],
                                           "expected time(%s) is not equal to actual time(%s)"%(expected[2], actual[2]))
                            break
                    else:
                        recorder.check(False, "%s is not in return result" % (expected[0],))
            else:
                recorder.check(False, "wrong status of get_realtimedata_with_time")
            recorder.do_assertion()

    #added by sophia 2017/10/17
    class SyncDataToMongodb:
        @staticmethod
        def run(arguments):
            return TestSpecific.SyncDataToMongodb.run(arguments)
        @staticmethod
        def assert_error(expected_error_message, actual_response_json):
            if expected_error_message is None or actual_response_json is None:
                assert expected_error_message is None and actual_response_json is None, \
                    "Expecting None but got non-None response json"
            actual_error_message = TestSpecific.SyncDataToMongodb.get_error_from_response(actual_response_json)
            assert expected_error_message== actual_error_message,\
                "Actual error message is not as expected: %s" % actual_error_message
        @staticmethod
        def assert_result_message_equals(length,actual):
            assert actual is not None,'actual is None'
            assert isinstance(actual,dict),'actual result is not dic'
            assert 'error' in actual.keys(),'key error is not exist'
            assert 'msg' in actual.keys(),'key msg is not exist'
            assert actual.get('error')=='ok' and actual.get('msg')==TestSpecific.SyncDataToMongodb.INSERT_CORRECT %length,\
            "actual result message is not expected: %s " % actual.get('msg')

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a list!"
            assert isinstance(actual, list), "actual value is not a list"
            assert len(actual) != 0, 'actual result  got empty'

            recorder = AssertionRecorder()

            actual.sort(key=lambda item: item.get("avg"))
            expected_point_list = [item[1] for item in expected.get('hisdata')]
            expected_time_list=[item[0] for item in expected.get('hisdata')]
            expected_value_list=[item[2] for item in expected.get('hisdata')]
            actual_point_list = [item.get("name") for item in actual]
            for point in actual_point_list:
                assert point  in expected_point_list, ("expected point list does not match actual point list! %s, %s" % \
                                                       (expected_point_list, actual_point_list))
            iter_actual_record_time = (actual_record for actual_record in actual)
            iter_actual_record_value = (actual_record for actual_record in actual)
            for i in range(len(expected_time_list)):
                iter_actual_record_at_time=next(iter_actual_record_time,None).get('history')[i].get('time')
                iter_actual_record_at_value=next(iter_actual_record_value,None).get('history')[i].get('value')
                assert expected_time_list[i]==iter_actual_record_at_time,'expected time %s does not match actual time %s'% \
                                                                      (expected_time_list[i],iter_actual_record_at_time)
                assert str(float(expected_value_list[i]))==iter_actual_record_at_value,'expected value %s does not match actual value %s'%\
                                                                       (expected_value_list[i],iter_actual_record_at_value)

            recorder.do_assertion()

        @staticmethod
        def assert_result_null(expected,actual):
            assert isinstance(actual,list),'actual is not list'
            assert actual is not None,'actual is none'
            if actual[0].get('error'):
                assert expected==actual[0].get('error'),'actual does not match expected,actual:%s'% actual[0].get('error')

    class SetRealtimedataByProjname:
        @staticmethod
        def run(arguments):
            return TestSpecific.SetRealtimedataByProjname.run(arguments)
        @staticmethod
        def assert_error(expected_error_message, actual_response_json):
            if expected_error_message is None or actual_response_json is None:
                assert expected_error_message is None and actual_response_json is None, \
                    "Expecting None but got non-None response json"
            actual_error_message = TestSpecific.SyncDataToMongodb.get_error_from_response(actual_response_json)
            assert expected_error_message== actual_error_message,\
                "Actual error message is not as expected: %s" % actual_error_message
        @staticmethod
        def assert_result_message_equals(expected,actual):
            assert actual is not None,'actual is None'
            recorder = AssertionRecorder()
            recorder.check(actual==expected,"actual result message is not expected,actual: %s " %actual)

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a list!"
            assert isinstance(actual, list), "actual value is not a list"
            assert len(actual) != 0, 'actual result  got empty'

            recorder = AssertionRecorder()

            point_name=expected.get('point')
            actual_item=actual[0]
            recorder.check(actual_item.get('name')==point_name,'actual name does not match expected point name,actual:%s,expected:%s'%\
                           (actual_item.get('name'),point_name))
            recorder.check(actual_item.get('value')==str(expected.get('value')),'%s point actual value does not match expected value,actual value:%s,expected value:%s'%\
                           (point_name,actual_item.get('value'),expected.get('value')))
            recorder.do_assertion()

    class SetRealtimeDataByProjid:
        @staticmethod
        def run(arguments):
            return TestSpecific.SetRealtimeDataByProjid.run(arguments)


        @staticmethod
        def assert_error(expected_error_message, actual_response_json):
            if expected_error_message is None or actual_response_json is None:
                assert expected_error_message is None and actual_response_json is None, \
                    "Expecting None but got non-None response json"
            actual_error_message = TestSpecific.SetRealtimeDataByProjid.get_error_from_response(actual_response_json)
            assert expected_error_message== actual_error_message,\
                "Actual error message is not as expected: %s" % actual_error_message

        @staticmethod
        def assert_point_error(actual_response_json):
            TestCommon.SetRealtimeDataByProjid.assert_error(
                TestSpecific.SetRealtimeDataByProjid.POINTNAME_ERROR, actual_response_json)

        @staticmethod
        def assert_result_equals(request, expected, actual):
            # check general data structure
            assert request is not None, 'set result is None'
            assert isinstance(request, str), "set result is not str"

            # get_realtimedata has already checked,just check the value here
            if request == 'success':
                # check general data structure
                recorder = AssertionRecorder()
                assert expected is not None, 'expected is None'
                assert actual is not None, 'actual is None'
                if type(expected) == list:
                    assert len(expected) != 0 , 'You should put in expected result but got empty'
                    # check point list equality
                    if 'error' in expected[0].keys():
                        assertion_message = 'Expected error message is %s but got %s in record!' % (expected, actual)
                        assert expected == actual, assertion_message
                    else:
                        expected.sort(key=lambda item: item.get("name"))
                        actual.sort(key=lambda item: item.get("name"))
                        expected_point_list = [item.get("name") for item in expected]
                        actual_point_list = [item.get("name") for item in actual]
                        assert expected_point_list == actual_point_list, (
                            "expected point list does not match actual point list! %s, %s" %
                            (expected_point_list, actual_point_list))

                        # iterate over each point
                        for i in range(0, len(expected)):
                            expected_item = expected[i]
                            actual_item = actual[i]
                            expected_record_value = expected_item.get("value")
                            actual_record_value = actual_item.get("value")
                            if expected_record_value is None and actual_record_value is None:
                                continue
                            assert len(actual_record_value) != 0 ,'Expecting result is not empty but got none'
                            assert str(expected_record_value) == str(actual_record_value), (
                                "expected point value does not match actual point value! %s, %s" %
                                (expected_record_value, actual_record_value))
                    recorder.do_assertion()
                 # check error in expected
                if type(expected) == dict:
                    assert len(expected) != 0 , 'You should put in expected result but got empty'
                    assertion_message = 'Expected error message is %s but got %s in record!' % (expected, actual)
                    assert expected == actual, assertion_message
            else:
                assert expected is not None, 'expected is None'
                assert isinstance(expected, str), "expected value is not str"
                assert len(expected) != 0, "You should put in expected result but got empty"
                assert request == expected, "actual result is %s, which differs from expected result %s" % (request, expected)

    class GetSaveSvrProjIdList:
        @staticmethod
        def run():
            return TestSpecific.GetSaveSvrProjIdList.run()

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, list), "expected value is not list!"
            assert isinstance(actual, list), "actual value is not list"
            assert len(expected) != 0, 'You should put in expected result but got empty'

            recorder = AssertionRecorder()
            #check aliyun group
            idList = [15,18,19,71,72,76,90,120,122,126,
                        128,175,179,186,190,194,200,201,203,281,
                        284,293,318,364,373,374,376,396,421,457,
                        528,539,540,542]
            expected_checkList = {
                'id':idList,
                'SaveSvrHistory': []
            }
            for item in expected:
                assert isinstance(item, dict), "item of expected is not dict"
                item_id = item.get('id')
                item_svr_history = item.get('SaveSvrHistory')
                if item_id in idList:
                    expected_checkList['SaveSvrHistory'].append(item_svr_history)
            assert len(expected_checkList['id']) == len(expected_checkList['SaveSvrHistory']), "expected id doesn't match expected saveSvrHistory"
            azure_idList = [674]
            actual_idList = [item.get('id') for item in actual]
            for id in azure_idList:
                assert_message = 'actual result is wrong,azure group project is in actual '
                assert id not in actual_idList, assert_message
            for item in actual:
                if item.get('id') in idList:
                    assert isinstance(item, dict), "item of actual is not dict"
                    index = idList.index(item.get('id'))
                    actual_svr_history = item.get('SaveSvrHistory')
                    expected_svr_history = expected_checkList.get('SaveSvrHistory')[index]
                    assert expected_svr_history == actual_svr_history, "%s : actual saveSvrHistory is %s, which differs from expected saveSvrHistory %s" % (
                    item.get('id'), actual_svr_history, expected_svr_history
                )
            recorder.do_assertion()

    class UpdateThirdData:
        @staticmethod
        def run(arguments):
            return TestSpecific.UpdateThirdData.run(arguments)

        @staticmethod
        def assert_result_message( actual):
            assert actual is  None,'actual is None'

        @staticmethod
        def assert_result( expected,actual):
            assert actual is not  None,'actual is None'
            assert expected==actual,'expected does not match actual.expected:%s,actual:%s'%(expected,actual)

        @staticmethod
        def assert_dtuserver_prj_and_dtuserver_prj_info(expected):
            dtuname=expected.get('dtuName')
            now=datetime.now()
            while 1:
                dtu_list=BEOPDataAccess.getInstance().getDTUProjectList()
                dtu_recorder=[dtu for dtu in dtu_list if dtu.get('dtuname')==dtuname]
                if dtu_recorder:
                    break
                if (datetime.now()-now).seconds>120:
                    break
                time.sleep(2)
            ids=[item.get('id') for item in dtu_recorder]
            dtu_prj_info=BEOPDataAccess.getInstance().getDTUProjectInfoList()
            dtu_prj_info_id=[item.get('id') for item in dtu_prj_info if item.get('id') in ids]
            if dtuname!='DTUServerTest':
                for id in dtu_prj_info_id:
                    BEOPDataAccess.getInstance().removeDTUProjectInfo(id)
                    BEOPDataAccess.getInstance().removeDTUProject(id)
            assert len(dtu_recorder)!=0,'%s does not insert into table dtuserver_prj'%dtuname
            assert len(dtu_recorder)==1,'%s inserted  into table dtuserver_pro is not one,total  %s'%(dtuname,len(id))
            assert len(dtu_prj_info_id)==1,'dtuserver:%s insert into dtuserver_pri_info table is not more than 0'%expected.get('dtuName')


        #check rtdata_beopdata table if create succeess and value if insert besides this table is realtime data
        @staticmethod
        def assert_rttable(expected):
            time.sleep(2)
            dtuname=expected.get('dtuName')
            dtu_table=BEOPDataAccess.getInstance().getAllRTTableNames()
            dtu_table_recorder=[dtu for dtu in dtu_table if dtu=='rtdata_beopdata_'+dtuname.lower()]

            recorder = AssertionRecorder()

            now = datetime.now()
            while 1:
                dtu_rt_info=BEOPDataAccess.getInstance().getDtuTableInfo(dtuname)
                if dtu_rt_info:
                    break
                if (datetime.now()-now).seconds>120:
                    break
                time.sleep(2)

            assert len(dtu_table_recorder)!=0,'usage in  dtu named table does not exist.dtuname:%s'%dtuname
            assert len(dtu_table_recorder)==1,'usage in  dtu named table is not one,dtuname:%s total %s' % (dtuname,len(id))

            dtu_rt_info_record=[''.join(x[1]) for x in dtu_rt_info]
            assert  dtu_rt_info_record,'rtdata_beopdata_%s table does not have value,because value is not inserted'%dtuname
            for i in  range(len(expected.get('pointNameList'))):
                recorder.check(expected.get('pointNameList')[i] in dtu_rt_info_record,'actual pointname in rbdata_beopdata_%s table does not match expected,actual:%s,expected:%s '%\
                    (dtuname,dtu_rt_info_record[i],expected.get('pointNameList')[i]))

            recorder.do_assertion()

            if dtuname=='DTUServerTest':
                BEOPDataAccess.getInstance().deleteRTtable(dtuname)
            else:
                BEOPDataAccess.getInstance().deleteRTtable(dtuname,False)

        @staticmethod
        def assert_dtuserver_online_offline(expected):
            time.sleep(2)
            dtuname=expected.get('dtuName')
            recorder = AssertionRecorder()
            dtu_online_offline=BEOPDataAccess.getInstance().getAllDtuForOnlineOffline(dtuname)
            BEOPDataAccess.getInstance().deleteDtuserverOnOffline(dtuname)
            for item in dtu_online_offline:
                recorder.check(item[0] is not None,'actual time in dtu_online_offline table is none ')
                recorder.check(item[1]==dtuname,'actual dtuname in dtu_online_offline table does not match expected.actual:%s,expected:%s ' %(item[1],dtuname))
                recorder.check(item[2] is not None,'actual state in dtu_online_offline is not 5,actual :%d'%item[2])
            recorder.do_assertion()


        @staticmethod
        def assert_histdata(expected,actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a list!"
            assert isinstance(actual, list), "actual value is not a list"
            assert len(actual) != 0, 'actual result  got empty'

            recorder = AssertionRecorder()

            actual.sort(key=lambda item: item.get("avg"))
            expected_time = expected.get('time')
            pointNameList = expected.get('pointNameList')
            pointValueList = expected.get('pointValueList')

            actual_point_list = [item.get("name") for item in actual]
            for point in actual_point_list:
                assert point  in pointNameList, ("expected point list does not match actual point list! %s, %s" % \
                                                       (pointNameList, actual_point_list))
            iter_actual_record_time = (actual_record for actual_record in actual)
            iter_actual_record_value = (actual_record for actual_record in actual)
            for i in range(len(pointNameList)):
                iter_actual_record_at_time=next(iter_actual_record_time,None).get('history')[i].get('time')
                iter_actual_record_at_value=next(iter_actual_record_value,None).get('history')[i].get('value')
                assert expected_time==iter_actual_record_at_time,'expected time %s does not match actual time %s'% \
                                                                      (expected_time,iter_actual_record_at_time)
                assert str(float(pointValueList[i]))==iter_actual_record_at_value,'expected value %s does not match actual value %s'%\
                                                                       (pointValueList[i],iter_actual_record_at_value)

            recorder.do_assertion()

        @staticmethod
        def assert_trigger_one_calculation(before):
            now=datetime.now()
            flag=False
            bofore_time=before[2][2]
            while 1:
                after=BEOPDataAccess.getInstance().getBufferRTDataWithTimeByProj(687,['test1','test2','test3'])
                after_time=after[2][2]
                after_value=after[2][1]
                if after_time>bofore_time:
                    flag=True
                    break
                if (datetime.now()-now).seconds>600 :
                    break
                time.sleep(2)

            recorder = AssertionRecorder()

            recorder.check(flag,'calculation point test3 is not updated ,before time is %s,actual time is　%s' %(bofore_time,after_time))
            recorder.check(after_value=='3.0','actual test1=1 add test2=2 is not equal to test3,test3:%s' % after_value)

            recorder.do_assertion()
