#-*- coding: utf-8 -*-
import pytest
from tests.utils import TestCommon

#对49项目进行历史数据的存储测试@pytest.mark.p0
def test_49_saveDataToMongodb_v2():
    import time
    insert_data = {'saveList':[{'projId':49,
                              'pointName':'yanguanwei_name_1',
                              'pointValue':'yanguanwei_value_1',
                              'timeAt':'2017-10-16 00:00:00'},
                             {'projId': 49,
                              'pointName': 'yanguanwei_name_2',
                              'pointValue': 'yanguanwei_value_2',
                              'timeAt': '2017-10-16 00:00:00'}
                             ]
                 }
    rt = TestCommon.saveDataToMongodb.run(insert_data.get('saveList'))
    time.sleep(2)#delay 2 seconds
    his_data = TestCommon.GetHistoryDataPadded.run({
        'projectId': 49,
        'timeStart': '2017-10-16 00:00:00',
        'timeEnd': '2017-10-16 00:00:00',
        'timeFormat': 'm5',
        'pointList': ['yanguanwei_name_1','yanguanwei_name_2']
    })
    TestCommon.saveDataToMongodb.assert_result(insert_data, rt, his_data)
@pytest.mark.p0
def test_49_saveDataToMongodb_m5():
    import time
    insert_data = {'saveList':[{'projId':49,
                              'pointName':'yanguanwei_name_3',
                              'pointValue':'yanguanwei_value_3',
                              'timeAt':'2017-01-01 00:00:00'},
                             {'projId': 49,
                              'pointName': 'yanguanwei_name_4',
                              'pointValue': 'yanguanwei_value_4',
                              'timeAt': '2017-01-01 00:00:00'}
                             ]
                 }
    rt = TestCommon.saveDataToMongodb.run(insert_data.get('saveList'))
    time.sleep(2)#delay 2 secondds
    his_data = TestCommon.GetHistoryDataPadded.run({
        'projectId': 49,
        'timeStart': '2017-01-01 00:00:00',
        'timeEnd': '2017-01-01 00:00:00',
        'timeFormat': 'm5',
        'pointList': ['yanguanwei_name_3','yanguanwei_name_4']
    })
    TestCommon.saveDataToMongodb.assert_result(insert_data, rt, his_data)
