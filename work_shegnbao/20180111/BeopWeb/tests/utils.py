# coding=utf-8

import os
from tests import TestSpecific


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

    class GetHistoryDataPaddedReduce:
        @staticmethod
        def run(arguments):
            return TestSpecific.GetHistoryDataPaddedReduce.run(arguments)

        @staticmethod
        def assert_error(expected_error_message, actual_response_json):
            if expected_error_message is None or actual_response_json is None:
                assert expected_error_message is None and actual_response_json is None, \
                    "Expecting None but got non-None response json"
            actual_error_message = TestSpecific.GetHistoryDataPaddedReduce.get_error_from_response(actual_response_json)
            assert expected_error_message.strip() == actual_error_message.strip(),\
                "Actual error message is not as expected: %s" % actual_error_message

        @staticmethod
        def assert_no_history_data(actual_response_json):
            TestCommon.GetHistoryDataPaddedReduce.assert_error(
                TestSpecific.GetHistoryDataPaddedReduce.NO_HISTORY_DATA, actual_response_json)

        @staticmethod
        def assert_invalid_time_string_error(actual_response_json):
            TestCommon.GetHistoryDataPaddedReduce.assert_error(
                TestSpecific.GetHistoryDataPaddedReduce.INVALID_TIME_STRING, actual_response_json)

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a dict!"
            assert isinstance(actual, dict), "actual value is not a dict"
            assert len(expected) != 0, 'You should put in expected result but got empty'

            recorder = AssertionRecorder()

            if 'error' in expected.keys():
                assertion_message = 'Expected error message is %s but got %s in record!' % (expected, actual)
                assert expected == actual, assertion_message
            else:
                # check group type
                assert len(expected) == len(actual), ("actual result is %s, which differs from expected reuslt %s" % (actual, expected))
                expected_timeStamp = expected.get('timeStamp')
                actual_timeStamp = actual.get('timeStamp')
                assert isinstance(expected_timeStamp, list), "timeStamp of expected is not a list!"
                assert isinstance(actual_timeStamp, list), "timeStamp of actual is not a list!"
                assert expected_timeStamp == actual_timeStamp,(
                    "actual timeStamp is %s, which does not match expected list %s!" %
                    (actual_timeStamp, expected_timeStamp))

                expected_data = expected.get('data')
                actual_data = actual.get('data')
                assert isinstance(expected_data, dict), "data of expected is not a dict!"
                assert isinstance(actual_data, dict), "data of actual is not a dict!"
                expected_pointList = sorted(list(expected_data.keys()), key = str.lower)
                actual_pointList = sorted(list(actual_data.keys()), key = str.lower)
                assert expected_pointList == actual_pointList,(
                    "actual point list is %s, which does not match expected point list %s!" %
                    (actual_pointList, expected_pointList))

                expected_attr = expected.get('attr')
                actual_attr = actual.get('attr')
                assert isinstance(expected_attr, dict), "attribution of expected is not a dict!"
                assert isinstance(actual_attr, dict), "attribution of actual is not a dict!"
                assert expected_attr == actual_attr,(
                    "actual attribution is %s, which does not match expected attribution %s!" %
                    (actual_attr, expected_attr))

                #check the value of point
                for item in expected_pointList:
                    expected_valueList = expected_data.get(item)
                    actual_valueList = actual_data.get(item)
                    expected_attrList = expected_attr.get(item)
                    actual_attrList = actual_attr.get(item)
                    assert isinstance(expected_valueList, list), "%s: valueList of expected is not a list" % item
                    assert isinstance(actual_valueList, list), "%s: valueList of actual is not a list" % item
                    assert len(expected_valueList) == len(expected_timeStamp),("%s: expected value doesn't match the expected time" % item)
                    assert len(actual_valueList) == len(actual_timeStamp),("%s: actual value doesn't match the actual time" % item)
                    assert isinstance(expected_attrList, list), "%s :attribution of expected is not a list!" % item
                    assert isinstance(actual_attrList, list), "%s :attribution of expected is not a list!" % item
                    assert expected_attrList == actual_attrList, "%s: attribution of actual is %s, which differs from attribution of expected %s" % (item, actual_attrList, expected_attrList)
                    if not recorder.check(expected_valueList is not None, "history of expected %s is None" % item)\
                        or \
                        not recorder.check(actual_valueList is not  None, "history of actual %s is None" % item):
                        continue
                    for index in range(0, len(expected_valueList)):
                        expected_value = expected_valueList[index]
                        actual_value = actual_valueList[index]
                        expected_time = expected_timeStamp[index]
                        actual_time = actual_timeStamp[index]
                        if expected_time is not None and actual_time is not None:
                            continue
                        assert expected_time == actual_time,("expected time is %s,which doesn't match the actual time %s" % (expected_time, actual_time))
                        if expected_value is None and actual_value is None:
                            continue
                        assertion_message = "Expecting %s but got %s in record with time = %s in history of actual %s" % (
                            expected_value, actual_value, expected_data, actual_data
                        )
                        recorder.check(value_equals(expected_data, actual_data), assertion_message)
            recorder.do_assertion()

    # added by sophia 2017/10/10
    class AnalysisStartWorkspaceDataGenPieChart:
        @staticmethod
        def run(arguments):
            return TestSpecific.AnalysisStartWorkspaceDataGenPieChart.run(arguments)

        @staticmethod
        def assert_error(expected_error_message, actual_response_json):
            if expected_error_message is None or actual_response_json is None:
                assert expected_error_message is None and actual_response_json is None, \
                    "Expecting None but got non-None response json"
            actual_error_message = TestSpecific.AnalysisStartWorkspaceDataGenPieChart.get_error_from_response(actual_response_json)
            assert expected_error_message.strip() == actual_error_message.strip(),\
                "Actual error message is not as expected: %s" % actual_error_message

        @staticmethod
        def assert_no_realtime_data(actual_response_json):
            TestCommon.AnalysisStartWorkspaceDataGenPieChart.assert_error(
                TestSpecific.AnalysisStartWorkspaceDataGenPieChart.NO_HISTORY_DATA, actual_response_json)

        @staticmethod
        def assert_invalid_dsItemId_string_error(actual_response_json):
            if 'dsItemList' in actual_response_json.keys():
                point_name=[item.get('dsItemId') for item in actual_response_json.get('dsItemList')]
                point_value=[item.get('data') for item in actual_response_json.get('dsItemList')]
                for i in range(0,len(point_name)):
                    if '@' not in point_name[i]:
                        assert point_value[i]==TestSpecific.AnalysisStartWorkspaceDataGenPieChart.INVALID_DSITEMID_STRING,\
                            'using error name %s, response is %s'%(point_name[i],TestSpecific.AnalysisStartWorkspaceDataGenPieChart.INVALID_DSITEMID_STRING)

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a dict!"
            assert isinstance(actual, dict), "actual value is not a dict"
            assert len(expected) != 0, 'You should put in expected result but got empty'

            recorder = AssertionRecorder()

            # check dsItemList in expected
            if 'dsItemList' not in expected.keys():
                assert 0,'expected format does have dsItemList'
            else:
                assertion_message = 'Expected dsItemList message is %s but got %s in record!' % (expected, actual)
                assert len(expected.get('dsItemList'))!=0, assertion_message
                # check point list equality
                expected=expected['dsItemList']
                actual=actual['dsItemList']
                expected_point_list = [item.get("dsItemId") for item in expected]
                actual_point_list = [item.get("dsItemId") for item in actual]
                assert expected_point_list == actual_point_list, (
                    "expected point list does not match actual point list! %s, %s" %
                    (expected_point_list, actual_point_list))

                # iterate over each point
                for i in range(0, len(expected)):
                    expected_item = expected[i]
                    actual_item = actual[i]
                    point_name = expected_item.get("dsItemId")
                    # check statistics information
                    expected_point_data=expected_item.get('data')
                    actual_point_data=actual_item.get('data')
                    assert expected_point_data!='Null','expected %s data value is null'%point_name
                    assert actual_point_data!='Null','actual %s data value is  null'%point_name
            recorder.do_assertion()

    # added by may 2018/01/06
    class ProjectStatus:
        @staticmethod
        def run(arguments):
            return TestSpecific.ProjectStatus.run(arguments)
        @staticmethod
        def assert_result_equals(expected, actual):
            expectedDetail = expected.get("detail")
            actualDetail = actual.get("detail")
            assert len(expectedDetail) == len(actualDetail), "Actual detail is not as expected"
            for index, actualDetailItem in enumerate(actualDetail):
                expectedDetailItem = expectedDetail[index]
                assert expectedDetailItem.get('offTotalTime') == actualDetailItem.get('offTotalTime'), \
                    "Actual detail[%d][\"offTotalTime\"] is not as expected" % (index,)
                assert expectedDetailItem.get('offEndTime') == actualDetailItem.get('offEndTime'), \
                    "Actual detail[%d][\"offEndTime\"] is not as expected" % (index,)
                assert expectedDetailItem.get('offStartTime') == actualDetailItem.get('offStartTime'), \
                    "Actual detail[%d][\"offStartTime\"] is not as expected" % (index,)
                assert expectedDetailItem.get('dtu') == actualDetailItem.get('dtu'), \
                    "Actual detail[%d][\"dtu\"] is not as expected" % (index,)

        @staticmethod
        def assert_result_equals_endTime_now(expected, actual):
            expectedDetail = expected.get("detail")
            actualDetail = actual.get("detail")
            assert len(expectedDetail) == len(actualDetail), "Actual detail is not as expected"
            for index, actualDetailItem in enumerate(actualDetail):
                expectedDetailItem = expectedDetail[index]
                assert expectedDetailItem.get('offStartTime') == actualDetailItem.get('offStartTime'), \
                    "Actual detail[%d][\"offStartTime\"] is not as expected" % (index,)
                assert expectedDetailItem.get('dtu') == actualDetailItem.get('dtu'), \
                    "Actual detail[%d][\"dtu\"] is not as expected" % (index,)

    class ProjectStatusHistory:
        @staticmethod
        def run(arguments):
            return TestSpecific.ProjectStatusHistory.run(arguments)
        @staticmethod
        def assert_result_equals(expected, actual):
            assert len(expected) == len(actual), 'Actual length is not as expected'
            for index, actualItem in enumerate(actual):
                expectedItem = expected[index]
                assert expectedItem.get('dtu') == actualItem.get(
                    'dtu'), 'actual[%s][\'dtu\'] is not as expected' % (index,)
                assert len(expectedItem.get('history')) == len(
                    actualItem.get('history')), 'actual[%s][\'history\'] is not as expected' % (
                    index,)
                for i, actualHistoryItem in enumerate(actualItem.get('history')):
                    expectedHistoryItem = expectedItem.get('history')[i]
                    assert actualHistoryItem.get('time') == expectedHistoryItem.get(
                        'time'), 'Actual time is not as expected'
                    assert actualHistoryItem.get('state') == expectedHistoryItem.get(
                        'state'), 'Actual state is not as expected'

    # added by sophia 2017/10/12
    class AnalysisStartWorkspaceDataGenHistogram:
        @staticmethod
        def run(arguments):
            return TestSpecific.AnalysisStartWorkspaceDataGenHistogram.run(arguments)

        @staticmethod
        def assert_error(expected_error_message, actual_response_json):
            if expected_error_message is None or actual_response_json is None:
                assert expected_error_message is None and actual_response_json is None, \
                    "Expecting None but got non-None response json"
            actual_error_message = TestSpecific.AnalysisStartWorkspaceDataGenHistogram.get_error_from_response(actual_response_json)
            assert expected_error_message.strip() == actual_error_message.strip(),\
                "Actual error message is not as expected: %s" % actual_error_message

        @staticmethod
        def assert_no_history_data(actual_response_json):
            TestCommon.AnalysisStartWorkspaceDataGenPieChart.assert_error(
                TestSpecific.AnalysisStartWorkspaceDataGenPieChart.NO_HISTORY_DATA, actual_response_json)

        @staticmethod
        def assert_invalid_dsItemId_string_error(actual_response_json):
            if 'dsItemList' in actual_response_json.keys():
                point_name=[item.get('dsItemId') for item in actual_response_json.get('dsItemList')]
                point_value=[item.get('data') for item in actual_response_json.get('dsItemList')]
                for i in range(0,len(point_name)):
                    if '@' not in point_name[i]:
                        assert point_value[i]==TestSpecific.AnalysisStartWorkspaceDataGenPieChart.INVALID_DSITEMID_STRING,\
                            'using error name %s, response is %s'%(point_name[i],TestSpecific.AnalysisStartWorkspaceDataGenPieChart.INVALID_DSITEMID_STRING)

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a dict!"
            assert isinstance(actual, dict), "actual value is not a dict"

            recorder = AssertionRecorder()

            assert "list" in actual.keys(),'actual value does not have key list'
            assert 'timeShaft' in actual.keys(),'actual value does not have key timeShaft'
            assert actual.get('list'),'actual value list is null'
            assert isinstance(actual.get('list'),list),'actual value list is not list'
            expected_list=expected.get('list')
            actual_list=actual.get('list')
            # check point list equality
            expected_list.sort(key=lambda item: item.get("dsItemId"))
            actual_list.sort(key=lambda item: item.get("dsItemId"))
            expected_dsItemId_list = [item.get("dsItemId") for item in expected_list]
            actual_dsItemId_list = [item.get("dsItemId") for item in actual_list]
            assert actual_dsItemId_list,'actual dsItemId list is null'
            assert expected_dsItemId_list == actual_dsItemId_list, (
                "expected dsItemId list does not match actual dsItemId list! %s, %s" %
                (expected_dsItemId_list, actual_dsItemId_list))

            # iterate over each item
            for i in range(0, len(expected_list)):
                expected_item = expected_list[i]
                actual_item = actual_list[i]
                dsItemId = expected_item.get("dsItemId")
                # check each history data record of the current point
                expected_history = expected_item.get("data")
                actual_history = actual_item.get("data")
                actual_time=actual.get('timeShaft')
                expected_time=expected.get('timeShaft')
                if not recorder.check(expected_history is not None, "history of expected %s is None!" % dsItemId)\
                    or \
                   not recorder.check(actual_history is not None, "history of actual %s is None!" % dsItemId):
                    continue
                if not recorder.check(isinstance(expected_history, list),
                                      "history of expected %s is not a list!" % dsItemId) or \
                    not recorder.check(isinstance(actual_history, list),
                                       "history of actual %s is not a list!" % dsItemId):
                    continue
                iter_actual_record_at_time = (actual_record_time for actual_record_time in actual_time
                                                  if actual_record_time is not None)
                iter_expected_record_at_time=(expected_record_time for expected_record_time in expected_time
                                                  if expected_record_time is not None)
                iter_actual_record_value = (actual_record_value for actual_record_value in actual_history
                                                  if actual_record_value is not None)
                iter_expected_record_value = (expected_history_value for expected_history_value in expected_history
                                                  if expected_history_value is not None)
                # check actual record exists and is correct
                for expected_history_value in expected_history:
                    actual_record_at_time = next(iter_actual_record_at_time, None)
                    expected_record_at_time=next(iter_expected_record_at_time,None)
                    assertion_message = "Missing record with time = %s in history of actual %s" % (
                        expected_record_at_time, dsItemId)
                    if not recorder.check(actual_record_at_time is not None, assertion_message):
                        continue
                    assertion_message = "%s point in expected record of time %s is not equal in actual record of time" % (
                        expected_record_at_time, dsItemId)
                    recorder.check(value_equals(expected_record_at_time,actual_record_at_time),assertion_message)
                    actual_record_value = next(iter_actual_record_value, None)
                    expected_record_value = next(iter_expected_record_value, None)
                    if expected_record_value is None and actual_record_value is None:
                        continue
                    assertion_message = \
                        'Expecting %s but got %s in record with value = %s in history of actual %s' % (
                            expected_record_value, actual_record_value, expected_record_at_time, dsItemId)
                    recorder.check(value_equals(expected_record_value, actual_record_value), assertion_message)
            recorder.do_assertion()

        @staticmethod
        def assert_not_existed(actual):
            assert actual is not None,"actual value is none"
            assert isinstance(actual,dict),"actual value is not dict"
            assert "list"  in actual.keys(),'actual value does not have key list'
            assert 'timeShaft'  in actual.keys(),'actual value does not have key timeShaft'
            actual_timeShaft=actual.get('timeShaft')
            actual_list_data=actual.get('list')[0].get('data')
            actual_list_dsItemId=actual.get('list')[0].get('dsItemId')
            assert not actual_list_data,'actual value data have value,actually does not have value'
            assert not actual_timeShaft,'actual value timeShaft have value.actually does not have value'
            assert actual_list_dsItemId,'actual dsItemId value is null'

        @staticmethod
        def assert_invaild_time_string(actual_response_json):
            TestCommon.AnalysisStartWorkspaceDataGenPieChart.assert_error(
                TestSpecific.AnalysisStartWorkspaceDataGenHistogram.INVAILD_TIME_STRING, actual_response_json)


    class UpdateProjectInfo:
        @staticmethod
        def run():
            return TestSpecific.UpdateProjectInfo.run()

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, bool), "expected value is not a bool!"
            assert isinstance(actual, bool), "actual value is not a bool"

            recorder = AssertionRecorder()
            assert expected == actual, ("actual result is %s, which differs from expected result %s" % (actual, expected))
            recorder.do_assertion()

    class UpdateProjectLocateMap:
        @staticmethod
        def run():
            return TestSpecific.UpdateProjectLocateMap.run()

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, bool), "expected value is not a bool!"
            assert isinstance(actual, bool), "actual value is not a bool"

            recorder = AssertionRecorder()
            assert expected == actual, ("actual result is %s, which differs from expected result %s" % (actual, expected))
            recorder.do_assertion()

    class GetAllMemValue:
        @staticmethod
        def run():
            return TestSpecific.GetAllMemValue.run()

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a dict!"
            assert isinstance(actual, dict), "actual value is not a dict"
            assert len(expected) != 0, 'You should put in expected result but got empty'

            recorder = AssertionRecorder()

            assert len(expected) == len(actual), ("actual result is %s, which differs from expected result %s" % (actual, expected))
            #check each group
            expected_projList = expected.get('projectInfoList')
            actual_projList = actual.get('projectInfoList')
            assert isinstance(expected_projList, list), "expected project list is not list"
            assert isinstance(actual_projList, list), "actual project list is not list"


            expected_projMap = expected.get('projectLocateMap')
            actual_projMap = actual.get('projectLocateMap')
            assert isinstance(expected_projMap, dict), "expected project list is not dict"
            assert isinstance(actual_projMap, dict), "actual project list is not dict"

            #check pointList and attrbution
            projList = [15,18,19,71,72,76,90,120,122,126,
                        128,175,179,186,190,194,200,201,203,281,
                        284,293,318,364,373,374,376,396,421,457,
                        528,539,540,542]
            expected_check_projList = {'id':[],
                                       'mysqlname':[],
                                       'collectionname':[],
                                       'v2_time':[]
                                       }
            for item in expected_projList:
                assert isinstance(item, dict), "item in expected projInfo list is not dict"
                if item.get('id') in projList:
                    expected_check_projList['id'].append(item.get('id'))
                    expected_check_projList['mysqlname'].append(item.get('mysqlname'))
                    expected_check_projList['collectionname'].append(item.get('collectionname'))
                    expected_check_projList['v2_time'].append(item.get('v2_time'))
            assert len(expected_check_projList['id']) == len(expected_check_projList['mysqlname']),\
                "expected mqlname list number is %s doesn't match id list number %s" % (expected_check_projList['mysqlname'], expected_check_projList['id'])
            assert len(expected_check_projList['id']) == len(expected_check_projList['collectionname']),\
                "expected collectionname list number is %s doesn't match id list number %s" % (expected_check_projList['collectionname'], expected_check_projList['id'])
            assert len(expected_check_projList['id']) == len(expected_check_projList['v2_time']),\
                "expected v2_time list number is %s doesn't match id list number %s" % (expected_check_projList['v2_time'], expected_check_projList['id'])

            for item in actual_projList:
                assert isinstance(item, dict), "item in actual projInfo list is not dict"
                actual_id = item.get('id')
                if actual_id in expected_check_projList.get('id'):
                    i = expected_check_projList.get('id').index(actual_id)
                    #check each part of value
                    expected_mysqlname = expected_check_projList.get('mysqlname')[i]
                    expected_collectionname = expected_check_projList.get('collectionname')[i]
                    expected_v2_time = expected_check_projList.get('v2_time')[i]
                    actual_mysqlname = item.get('mysqlname')
                    actual_collectionname = item.get('collectionname')
                    actual_v2_time = item.get('v2_time')
                    assert actual_mysqlname is not None,"actual_mysqlname is None"
                    assert expected_mysqlname is not None,"expected_mysqlname is None"
                    assert actual_collectionname is not None,"actual_collectionname is None"
                    assert expected_collectionname is not None,"expected_collectionname is None"
                    assert actual_v2_time is not None,"actual_v2_time is None"
                    assert expected_v2_time is not None,"expected_v2_time is None"
                    mysql_assertion_message = \
                        "%s:actual mysqlname is %s, which differs from expected mysqlname %s" % (
                          actual_id, actual_mysqlname, expected_mysqlname)
                    if not recorder.check(value_equals(expected_mysqlname, actual_mysqlname), mysql_assertion_message):
                        continue
                    collection_assertion_message = \
                        "%s:actual collectionname is %s, which differs from expected collectionname %s" % (
                          actual_id, actual_collectionname, expected_collectionname)
                    if not recorder.check(value_equals(actual_collectionname, expected_collectionname), collection_assertion_message):
                        continue
                    v2_assertion_message = \
                        "%s:actual v2_time is %s, which differs from actual v2_time %s" % (
                          actual_id, actual_v2_time, expected_v2_time)
                    recorder.check(value_equals(actual_v2_time, expected_v2_time), v2_assertion_message)
            recorder.do_assertion()



        # added by sophia 2017/10/19
    class ProjectClusterMapUpdate:
        @staticmethod
        def run():
            return TestSpecific.ProjectClusterMapUpdate.run()

        @staticmethod
        def assert_result(expected, actual):
            assert actual is not None,'actual is none'
            assert expected==actual,'expected value is not matched actual value'

    # added by sophia 2017/10/19
    class ProjectClusterMapGet:
        @staticmethod
        def run():
            return TestSpecific.ProjectClusterMapGet.run()

        @staticmethod
        def assert_result(actual):
            assert actual is not None,'actual is none'
            assert isinstance(actual,dict),'actual is not dict'

            recorder = AssertionRecorder()

            keys=actual.keys()
            for key in keys:
                item_actual=actual.get(key)
                recorder.check(item_actual is not None,'acutal key %s value is none' % key)
                recorder.check(isinstance(item_actual,dict),'acutal key %s value is none' % key)
                recorder.check('beopwebHttp' in item_actual.keys(),\
                               'beopwebHttp is not in acutal key %s value' % key)
                recorder.check('beopwebHttps' in item_actual.keys(),\
                               'beopwebHttps is not in acutal key %s value' % key)
                recorder.check('clusterName' in item_actual.keys(),
                               'clusterName is not in acutal key %s value' % key)
                recorder.check(item_actual.get("beopwebHttp") is not None,
                               'beopwebHttp is in acutal key %s value is none' % key)
                recorder.check(item_actual.get("clusterName") is not None,
                               'clusterName is in acutal key %s value is none' % key)
                recorder.check(isinstance(item_actual.get("beopwebHttp"),str),
                               'beopwebHttp is in acutal key %s value is not string' % key)
                recorder.check(isinstance(item_actual.get("clusterName"),str) is not None,
                               'clusterName is in acutal key %s value is not string' % key)

            recorder.do_assertion()

    class StartWorkspaceDataGenHistogramIncrement_v2:
        @staticmethod
        def run(arguments):
            return TestSpecific.StartWorkspaceDataGenHistogramIncrement_v2.run(arguments)

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a dict!"
            assert isinstance(actual, dict), "actual value is not a dict"
            assert len(expected) != 0, 'You should put in expected result but got empty'

            recorder = AssertionRecorder()

            assert len(expected) == len(actual), ("actual result is %s, which differs from expected result %s" % (actual, expected))
            #check each group
            expected_timeList = expected.get('timeShaft')
            actual_timeList = actual.get('timeShaft')
            expected_pvList = expected.get('list')
            actual_pvList = actual.get('list')
            if expected_timeList is None and actual_timeList is None:
                return
            assert len(expected_timeList) == len(actual_timeList), "acutal time list length differs from expected"
            assert len(expected_pvList) == len(actual_pvList), "actual point differs from expected"
            for index in range(0, len(expected_timeList)):
                assert expected_timeList[index] == actual_timeList[index], "actual time is %s, which differs from expected time %s" %(
                    actual_timeList[index], expected_timeList[index]
                )
            nameList = []
            errorList = []
            dataList = []
            for item in expected_pvList:
                if '@' in item.get('dsItemId'):
                    name = item.get('dsItemId').split('|')[1]
                else:
                    name = item.get('dsItemId')
                nameList.append(name)
                errorList.append(item.get('errorFlag'))
                dataList.append(item.get('data'))
            for item in actual_pvList:
                if '@' in item.get('dsItemId'):
                    name_actual = item.get('dsItemId').split('|')[1]
                else:
                    name_actual = item.get('dsItemId')
                actual_error = item.get('errorFlag')
                actual_data = item.get('data')
                expected_error = errorList[nameList.index(name_actual)]
                expected_data = dataList[nameList.index(name_actual)]
                if actual_error is None and expected_error is None:
                    return
                if actual_data is None and expected_data is None:
                    return
                for i in range(0, len(expected_timeList)-1):
                    assert actual_error[i] == expected_error[i], "%s:at time %s,actual error is %s, which differs from expected error %s" %(
                        name_actual, expected_timeList[i], actual_error[i], expected_error[i]
                    )
                    assert actual_data[i] == expected_data[i], "%s:at time %s,actual data is %s, which differs from data %s" % (
                        name_actual, expected_timeList[i], actual_data[i], expected_data[i]
                    )
            recorder.do_assertion()

    class LoadUsersSetting:
        @staticmethod
        def run(arguments):
            return TestSpecific.LoadUsersSetting.run(arguments)

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a dict!"
            assert isinstance(actual, dict), "actual value is not a dict"

            assert len(expected) == len(actual), 'actual result is %s, which differs from expected result %s' % (len(actual), len(expected))

            expected_roleGroup = expected['userRoleGroup']
            actual_roleGroup = actual['userRoleGroup']
            assert len(expected_roleGroup) == len(actual_roleGroup), 'actual user role group length is %s, which differs from expected %s' %(len(actual_roleGroup), len(expected_roleGroup))
            expected_roleGroup.sort()
            actual_roleGroup.sort()
            assert expected_roleGroup == actual_roleGroup, 'actual user role group is %s, which differs from expected %s' %(actual_roleGroup, expected_roleGroup)
            expected_managers = expected['managers']
            actual_managers = actual['managers']
            assert expected_managers == actual_managers, 'actual managers is %s, which differs from expected %s' %(actual_managers, expected_managers)
            expected_user = expected['user']
            actual_user = actual['user']
            user_attr = ['isManager', 'country', 'userfullname','useremail', 'expiryDate', 'username', 'id', 'company', 'userpic', 'supervisor']
            for ind in range(len(user_attr)):
                attr = user_attr[ind]
                assert expected_user.get(attr) == actual_user.get(attr) ,'%s: actual user attribution is %s, which differs from expected %s' \
                                                                                     %(attr, actual_user.get(attr), expected_user.get(attr))
            expected_currentRole = expected['currentUserRoleGroup']
            actual_currentRole = actual['currentUserRoleGroup']
            assert len(expected_currentRole) == len(actual_currentRole), 'actual current role group length is %s,which differs from expected %s' %(len(actual_currentRole), len(expected_currentRole))
            expected_currentRole.sort()
            actual_currentRole.sort()
            assert actual_currentRole == expected_currentRole, 'actual current role group is %s,which differs from expected %s' %(actual_currentRole ,expected_currentRole)
            expected_sup = expected['supervisor']
            actual_sup = actual['supervisor']
            sup_attr = ['id', 'userpic', 'username', 'userfullname']
            for ind in range(len(sup_attr)):
                attr = sup_attr[ind]
                assert actual_sup.get(attr) == expected_sup.get(attr), 'actual supervisor attribution is %s, which differs from expected %s' %(actual_sup.get(attr) ,expected_sup.get(attr))

    class LoadUsersTree:
        @staticmethod
        def run(arguments):
            return TestSpecific.LoadUsersTree.run(arguments)

        @staticmethod
        def assert_result_equals(expected, actual):
            if expected is None and actual is None:
                return
            # check general data structure
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a dict!"
            assert isinstance(actual, dict), "actual value is not a dict"

            assert len(expected) == len(actual), 'actual result is %s, which differs from expected result %s' % (len(actual), len(expected))
            attr = ['isManager', 'sub', 'userpic', 'userfullname','userstatus', 'id', 'supervisor', 'username']
            for ind in range(len(attr)):
                attr_name = attr[ind]
                assert actual.get(attr_name) == expected.get(attr_name), '%s: actual attribution is %s, which differs from expected %s' \
                                                                         %(attr_name, actual.get(attr_name), expected.get(attr_name))

        @staticmethod
        def assert_result_admin(expected, actual):
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a dict!"
            assert isinstance(actual, dict), "actual value is not a dict"

            assert len(expected) == len(actual), 'actual result is %s, which differs from expected result %s' % (len(actual), len(expected))
            expected_user = expected.get('UserRoleGroupList')
            actual_user = actual.get('UserRoleGroupList')
            assert len(actual_user) == len(expected_user), 'actual user role list length differs from expected'
            for ind in range(len(expected_user)):
                assert actual_user[ind] == expected_user[ind], 'actual user role is %s, which differs from expected %s' %(actual_user[ind], expected_user[ind])

    class IsRcsAdmin:
        @staticmethod
        def run(arguments):
            return TestSpecific.IsRcsAdmin.run(arguments)

        @staticmethod
        def assert_result_equal(expected, actual):
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a dict!"
            assert isinstance(actual, dict), "actual value is not a dict"

            assert len(expected) == len(actual), 'actual result is %s, which differs from expected result %s' % (len(actual), len(expected))
            expected_data = expected.get('data')
            actual_data = actual.get('data')
            assert expected.get('success') == actual.get('success'),  'actual result is %s,which differs from expected %s' %(actual.get('success'), expected.get('success'))
            assert actual_data == expected_data, 'actual data is %s,which differs from expected %s' %(actual_data, expected_data)

    class GetProjectPermissionByUserId:
        @staticmethod
        def run(arguments):
            return TestSpecific.GetProjectPermissionByUserId.run(arguments)

        @staticmethod
        def assert_result_equal(expected, actual):
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a dict!"
            assert isinstance(actual, dict), "actual value is not a dict"

            assert len(expected) == len(actual), 'actual result is %s, which differs from expected result %s' % (len(actual), len(expected))
            keyList = list(expected.keys())
            for item in keyList:
                expected_enName = expected[item]['projectName_en']
                actual_enName = actual[int(item)]['projectName_en']
                assert actual_enName == expected_enName, '%s: actual english name is %s, which differs from expected %s'\
                                                         %(item, actual_enName, expected_enName)
                expected_name = expected[item]['projectName']
                actual_name = actual[int(item)]['projectName']
                assert actual_name == expected_name, '%s: actual name is %s, which differs from expected %s'\
                                                         %(item, actual_name, expected_name)
                expected_role = expected[item]['roles']
                actual_role = actual[int(item)]['roles']
                assert len(actual_role) == len(expected_role), '%s: actual role length is %s, which differs from expected %s' \
                                                               %(item, len(actual_role), len(expected_role))
                assert actual_role == expected_role, '%s: actual role is %s, which differs from expected %s' \
                                                     %(item, actual_role, expected_role)

    class LoadManagersByUserId:
        @staticmethod
        def run(arguments):
            return TestSpecific.LoadManagersByUserId.run(arguments)

        @staticmethod
        def assert_result_equal(expected, actual):
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, list), "expected value is not a list!"
            assert isinstance(actual, list), "actual value is not a list"

            if len(expected) is 0 and len(actual) is 0:
                return
            assert len(expected) == len(actual), 'actual result is %s, which differs from expected result %s' % (len(actual), len(expected))
            attr = ['userfullname', 'sub', 'supervisor', 'isManager', 'id', 'username']
            expected_data = expected[0]
            actual_data = actual[0]
            assert len(actual_data) == len(expected_data), 'actual data length differs from expected'
            for ind in range(len(attr)):
                item = attr[ind]
                assert actual_data.get(item) == expected_data.get(item), '%s: actual attrbution is %s, which differs from expected %s' \
                                                                         %(item, actual_data.get(item), expected_data.get(item))

    class UpdateUsersSetting:
        @staticmethod
        def run(arguments):
            return TestSpecific.UpdateUsersSetting.run(arguments)

        @staticmethod
        def assert_result_equal(result, result_new, expected, actual):
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            assert isinstance(expected, dict), "expected value is not a dict!"
            assert isinstance(actual, dict), "actual value is not a dict"
            old_data = {
                'userId':result['user']['id'],
                'userRoleGroupList':result['userRoleGroup'],
                'isManager':result['user']['isManager'],
                'supervisor':result['user']['supervisor'],
                'country':result['user']['country']
            }
            if actual.get('success'):
                new_data = {
                    'userId':result_new['user']['id'],
                    'userRoleGroupList':result_new['userRoleGroup'],
                    'isManager':result_new['user']['isManager'],
                    'supervisor':result_new['user']['supervisor'],
                    'country':result_new['user']['country']
                }
                assert new_data.get('userId') == expected.get('userId'), 'userId: actual result is %s, which differs from expected %s' \
                                                                         %(new_data.get('userId'), expected.get('userId'))
                new_role = new_data.get('userRoleGroupList').sort()
                expected_role = expected.get('userRoleGroupList').sort()
                assert new_role == expected_role, 'userRoleGroupList: actual result is %s, which differs from expected %s' \
                                                                         %(new_role, expected_role)
                assert new_data.get('isManager') == expected.get('isManager'), 'isManager: actual result is %s, which differs from expected %s' \
                                                                         %(new_data.get('isManager'), expected.get('isManager'))
                assert new_data.get('supervisor') == expected.get('supervisor'), 'supervisor: actual result is %s, which differs from expected %s' \
                                                                         %(new_data.get('supervisor'), expected.get('supervisor'))
                assert new_data.get('country') == expected.get('country'), 'country: actual result is %s, which differs from expected %s' \
                                                                         %(new_data.get('country'), expected.get('country'))
            else:
                assert False, 'update users seeting failed'
            TestSpecific.UpdateUsersSetting.run(old_data)

    class LoadProjectPermission:
        @staticmethod
        def run(arguments):
            return TestSpecific.LoadProjectPermission.run(arguments)

        @staticmethod
        def assert_result_equal(expected, actual):
            assert expected is not None, 'expected is None'
            assert actual is not None, 'actual is None'
            if actual.get('data')is None:
                assert isinstance(expected, dict), "expected value is not a dict!"
                assert isinstance(actual, dict), "actual value is not a dict"

                if len(expected) is 0 and len(actual) is 0:
                    return

                projList = actual.get('projectList')
                expected_id = expected.get('id')
                actual_idList = []
                for item in projList:
                    actual_id = item.get('id')
                    actual_idList.append(actual_id)
                for name in expected_id:
                    assert name in actual_idList, 'id: %s is needed,which does not exist in actual' % name
            else:
                if len(actual.get('data')) is 0 and len(expected.get('data')) is 0:
                    return

