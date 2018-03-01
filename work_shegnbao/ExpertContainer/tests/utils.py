from pytest import approx

class AssertionRecorder:
    def __init__(self):
        self._assertion_failures = []

    def check(self, predication, message):
        if not predication:
            self._assertion_failures.append(message)
        return predication


#直接用pytest的功能实现浮点数的比较
def almost_equals(expected, actual):
    return 0.0 == approx(expected-actual,abs=1e-3)

def assert_result_equal_getHistoryDataOfToday(actual,expected):
    assert expected, 'expected value is None'
    assert isinstance(expected, list), 'expected is not list'
    assert isinstance(actual, list), 'actual is not list'
    expected_his = (item.get('value') for item in expected[0].get('history'))
    point=expected[0].get('name')
    for i in actual:
        iter_expected = next(expected_his)
        assert i is not None,'pointname:{0} actual value is null'
        assert almost_equals(float(iter_expected),i), 'pointname:{0},expected value is not equal to acutal value, expected value is {1},acutal value is {2}'.\
            format(point, iter_expected,i)

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

def assert_equal_result(expected_value, actual_value):
    assert len(expected_value) == len(actual_value), "different length between excepted_value and actual_value"
    for index, value in enumerate(expected_value):
        assert value_equals(value, actual_value[index]), "expected value is %s, actual value is %s"%(value, actual_value[index])

def equal_result_getDataTimeRange(expected, actual):
    if expected is None and actual is None:
        return
    if not len(expected) and not len(actual):
        return
    # check general data structure
    assert expected is not None, 'expected is None'
    assert actual is not None, 'actual is None'
    assert len(expected) != 0, 'You should put in expected result but got empty'

    recorder = AssertionRecorder()

    # check error in expected
    if type(expected) == dict:
        assertion_message = 'Expected error message is %s but got %s in record!' % (expected, actual)
        assert expected == actual, assertion_message
    else:
        assert isinstance(expected, list), "expected value is not a list!"
        assert isinstance(actual, list), "actual value is not a list"
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

def assert_mongo_data(pointname,projId,value,actual):
    assert isinstance(actual,list),'actual is not list,'
    assert actual,'got history of %s in projId=%s is %s'%(pointname,projId,actual)
    assert 'no data history' not in actual[0],'actual is no history data'
    if isinstance(value,str) or isinstance(value,int) or  isinstance(value,float):
        value=[str(float(value))]
    if isinstance(pointname,str):
        pointname=[pointname]
    for index,item in enumerate(actual):
        actual_name=actual[index].get('name')
        actual_value=actual[index].get('history')[0].get('value')
        assert actual_name in pointname,'actual name is not in pointname actual name is %s,expected name in %s'%\
                                        (actual_name,pointname)
        assert float(actual_value)==float(value[index]), 'pointname:%s,expected  value is %s,actual got is %s' %\
                           (actual_name, value[index],actual_value)


def equal_result_getHisDataTimeRange(pointList, expected, actual):
    if expected is None and actual is None:
        return
    else:
        if not len(expected) and not len(actual):
            return
        else:
            assert expected, 'expected value is None'
            assert actual, 'actual value is None'
            assert isinstance(expected, list), 'expected is not list'
            assert isinstance(actual, list), 'actual is not list'
            assert len(expected) == len(actual), "actual result length is %s, differs from expected result length %s" %(len(actual), len(expected))
            if type(pointList) == list:
                for index in range(0, len(expected)):
                    for i in range(0, len(expected[index])):
                        assert expected[index][i] == actual[index][i], "%s: the %sth nunmber,actual result is %s, differs from expected result %s" %(pointList[index], i+1, actual[index][i], expected[index][i])
            else:
                assert expected == actual, "%s: actual result is %s, differs from expected result %s" %(pointList, actual, expected)


def assert_cache_data(pointList,valueList,actual_cache):
    for index,point in enumerate(pointList):
        actual_value=actual_cache.get(point)
        assert actual_value==valueList[index], \
            'actual  value do not match expected.acutal value is %s ,expected value is %s' % (actual_value,valueList[index])

def assert_mysqlbuffer_data(pointList,testTime,valueList,actual_buffer):
    assert isinstance(actual_buffer,dict),'actual is not dict'
    assert actual_buffer,'actual is none'
    for index,point in enumerate(pointList):
        acutal_time=actual_buffer.get(point)[0]
        actual_value=actual_buffer.get(point)[1]
        assert acutal_time==testTime ,\
            'actual point %s time do not match expected.acutal time is %s ,expected time is %s'%(point,acutal_time,testTime)
        assert actual_value==str(valueList[index]), \
            'actual point %s  value do not match expected.acutal value is %s ,expected value is %s' % (point,actual_value, str(valueList[index]))


def assert_error(expected_error_message, actual_response_json):
    if actual_response_json is None:
        return None
    if not isinstance(actual_response_json, dict):
        return None
    if actual_response_json.get("error") != "historyData":
        return None
    if expected_error_message is None or actual_response_json is None:
        assert expected_error_message is None and actual_response_json is None, \
            "Expecting None but got non-None response json"
    actual_error_message = actual_response_json.get('msg')
    assert expected_error_message.strip() == actual_error_message.strip(),\
        "Actual error message is not as expected: %s" % actual_error_message

def equal_result_getHisDataWithTime(expected, actual):
    if expected is None and actual is None:
        assert True
    else:
        assert expected, 'expected value is None'
        assert actual, 'actual value is None'
        assert isinstance(expected, dict), 'expected is not dict'
        assert isinstance(actual, dict), 'actual is not dict'
        assert len(expected) == len(actual), "actual result length is %s, which differs from expected result length %s" %(len(actual), len(expected))
        if 'list' in expected.keys():
            timeList = expected.get('timeShaft')
            timeList_actual = actual.get('timeShaft')
            valueList = expected.get('list')
            valueList_actual = actual.get('list')
            assert timeList == timeList_actual, "expected time list is %s, but got %s" %(timeList, timeList_actual)
            assert len(valueList) == len(valueList_actual), "actual point length differs from expected point length"
            pointList = []
            pvList = []
            for item in valueList:
                pointList.append(item.get('dsItemId'))
                pvList.append(item.get('data'))
            for i in valueList_actual:
                name = i.get('dsItemId')
                if len(name):
                    assert name, "actual point name is None"
                    data = i.get('data')
                    assert data, "actual value list is None"
                    index = pointList.index(name)
                    data_expected = pvList[index]
                    assert len(data) == len(data_expected), "%s: actual value length is %s, which differs from expected value length" %(name, len(data), len(data_expected))
                    for i in range(0, len(data_expected)):
                        assert data[i] == data_expected[i], "%s with location of %s: actual value list is %s, which differs from expected value list %s" %(name, i+1, data[i], data_expected[i])
                else:
                    assert expected == actual, "actual result is %s, which differs from expected result" %(actual, expected)

def equal_result_calcPointFindLostInfo(expected, actual):
    assert expected, 'expected value is None'
    assert actual, 'actual value is None'
    assert isinstance(expected, dict), 'expected is not dict'
    assert isinstance(actual, dict), 'actual is not dict'
    assert len(expected) == len(actual), 'actual result length is %s, which differs from expected result length %s" %(len(actual), len(expected))'
    if actual.get('error'):
        assert actual.get('msg') == expected.get('msg'), 'actual result message is %s, which differs from expected %s' %(actual.get('msg'), expected.get('msg'))
    else:
        expected_data = expected.get('data')
        actual_data = actual.get('data')
        if expected_data is None and actual_data is None:
            return
        else:
            assert len(expected_data) == len(actual_data), 'actual data length is %s, which differs from expected data length %s' %(len(actual_data), len(expected_data))
            pList = []
            etList = []
            stList = []
            for item in expected_data:
                eT = item.get('endTime')
                point = item.get('pointList')
                point.sort()
                sT = item.get('startTime')
                if point not in pList:
                    pList.append(point)
                    etList.append([eT])
                    stList.append([sT])
                else:
                    etList[pList.index(point)].append(eT)
                    stList[pList.index(point)].append(sT)
            for item in actual_data:
                point_actual = item.get('pointList')
                point_actual.sort()
                sT_actual = item.get('startTime')
                eT_actual = item.get('endTime')
                assert point_actual in pList, 'actual point is %s, which does not exit in expected' %point_actual
                ind = pList.index(point_actual)
                sT_expected = stList[ind]
                eT_expected = etList[ind]
                ind_in = sT_expected.index(sT_actual)
                assert ind_in is not None, '%s: actual get start time is %s, which does not exit in expected' %(point_actual, sT_actual)
                assert eT_actual == eT_expected[ind_in],  '%s: actual get end time is %s, which differs from expected %s' %(point_actual, eT_actual, eT_expected[ind_in])
