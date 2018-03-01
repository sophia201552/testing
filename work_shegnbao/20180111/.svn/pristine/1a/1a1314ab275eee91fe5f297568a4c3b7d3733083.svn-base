# coding=utf-8
# 测试闪电功能，即在线掉线功能
# added by may 2017/1/6
import pytest
from datetime import datetime
from tests.utils import TestCommon


@pytest.mark.p0
@pytest.mark.parametrize(('data', 'expected'), [
    # 100_01 开始时间之前dtu状态是...1,0,0开始时间和结束时间之间状态01
    ({
         "projectId": 72,
         "dtu": ["shhwhn02"],
         "startTime": '2017-03-30 16:08:00',
         "endTime": '2017-04-09 13:06:00'
     },
     {
         'dtuNameList': ['shhwhn02'],
         'dtuOffNameList': ['shhwhn02'],
         'detail': [
             {
                 'offTotalTime': '15:3:32',
                 'offEndTime': '2017-04-06 16:12:54',
                 'offStartTime': '2017-03-22 12:40:01',
                 'dtu': 'shhwhn02'
             }
         ],
         'lastUpdateTime': '2017-11-06 23:38:00',
         'timeZone': 8,
         'projType': 1
     }
    ),
    #011_01
    ({
         "projectId": 72,
         "dtu": ["shhwhn02"],
         "startTime": '2017-04-14 00:00:00',
         "endTime": '2017-04-14 01:16:00'
     },
     {
         'dtuNameList': ['shhwhn02'],
         'dtuOffNameList': ['shhwhn02'],
         'detail': [
             {
                 'offTotalTime': '0:0:28',
                 'offEndTime': '2017-04-14 01:15:40',
                 'offStartTime': '2017-04-14 00:47:20',
                 'dtu': 'shhwhn02'
             }
         ],
         'lastUpdateTime': '2017-11-06 23:38:00',
         'timeZone': 8,
         'projType': 1
     }
    ),
    #100_1
    ({
         "projectId": 72,
         "dtu": ["shhwhn02"],
         "startTime": '2017-04-17 15:17:00',
         "endTime": '2017-04-17 15:18:00'
     },
     {
         'dtuNameList': ['shhwhn02'],
         'dtuOffNameList': ['shhwhn02'],
         'detail': [
             {
                 'offTotalTime': '3:13:37',
                 'offEndTime': '2017-04-17 15:17:33',
                 'offStartTime': '2017-04-14 01:40:18',
                 'dtu': 'shhwhn02'
             }
         ],
         'lastUpdateTime': '2017-11-06 23:38:00',
         'timeZone': 8,
         'projType': 1
     }),
    # 011_1
    ({
         "projectId": 72,
         "dtu": ["shhwhn02"],
         "startTime": '2017-04-17 15:35:00',
         "endTime": '2017-04-17 15:36:00'
     },
     {
         'dtuNameList': ['shhwhn02'],
         'dtuOffNameList': ['shhwhn02'],
         'detail': [

         ],
         'lastUpdateTime': '2017-11-06 23:38:00',
         'timeZone': 8,
         'projType': 1
     }),
    # 011_-
    ({
         "projectId": 72,
         "dtu": ["shhwhn02"],
         "startTime": '2017-05-25 10:30:00',
         "endTime": '2017-05-25 10:30:00'
     },
     {
         'dtuNameList': ['shhwhn02'],
         'dtuOffNameList': ['shhwhn02'],
         'detail': [

         ],
         'lastUpdateTime': '2017-11-06 23:38:00',
         'timeZone': 8,
         'projType': 1
     }),
    # timeZone11 1000－101
    ({
         "projectId": 293,
         "dtu": [],
         "startTime": '2017-03-20 20:48:00',
         "endTime": '2017-03-21 05:05:00'
     },
     {'dtuNameList': ['qantas'],
      'detail': [
          {'offEndTime': '2017-03-20 20:48:10',
           'offStartTime': '2017-03-20 13:14:19',
           'dtu': 'qantas',
           'offTotalTime': '0:7:33'
           },
          {'offEndTime': '2017-03-21 05:04:15',
           'offStartTime': '2017-03-21 03:00:07',
           'dtu': 'qantas',
           'offTotalTime': '0:2:4'
           }],
      'projType': 1, 'timeZone': 11,
      'lastUpdateTime': '2017-11-06 21:35:00',
      'dtuOffNameList': ['qantas']})
])
def test_project_status(data, expected):
    rt = TestCommon.ProjectStatus.run(data)
    TestCommon.ProjectStatus.assert_result_equals(expected, rt)

@pytest.mark.p0
@pytest.mark.parametrize(('data', 'expected'), [
    # 100_-
    ({
         "projectId": 72,
         "dtu": ["shhwhn02"],
         "startTime": '2017-04-17 15:17:00',
         "endTime": '2017-04-17 15:17:00'
     },
     {
         'dtuNameList': ['shhwhn02'],
         'dtuOffNameList': [],
         'detail': [{
             'offStartTime': '2017-04-14 01:40:18',
             'dtu': 'shhwhn02'

         }],
         'lastUpdateTime': '2017-11-06 23:38:00',
         'timeZone': 8,
         'projType': 1
     }),
])
def test_project_status_endTimeNow(data, expected):
    rt = TestCommon.ProjectStatus.run(data)
    TestCommon.ProjectStatus.assert_result_equals_endTime_now(expected, rt)


@pytest.mark.p0
@pytest.mark.parametrize(('data', 'expected'), [
    # 100_01
    ({
         "projectId": 72,
         "dtu": ["shhwhn02"],
         "startTime": '2017-03-30 16:08:00',
         "endTime": '2017-04-09 13:06:00'
     },[{'dtu': 'shhwhn02',
         'history':
             [{'time': '2017-03-16 14:29:41', 'state': 1},
              {'time': '2017-03-22 12:40:01', 'state': 0},
              {'time': '2017-03-22 12:57:27', 'state': 0},
              {'time': '2017-03-30 16:08:52', 'state': 0},
              {'time': '2017-04-06 16:12:54', 'state': 1}
              ]}]),
    # 011_01
    ({
         "projectId": 72,
         "dtu": ["shhwhn02"],
         "startTime": '2017-04-14 00:00:00',
         "endTime": '2017-04-14 01:16:00'
     }, [{'dtu': 'shhwhn02',
          'history': [{'state': 1, 'time': '2017-04-13 10:34:42'},
                      {'state': 0, 'time': '2017-04-14 00:47:20'},
                      {'state': 1, 'time': '2017-04-14 01:15:40'}]}]),
    # 100_1
    ({
         "projectId": 72,
         "dtu": ["shhwhn02"],
         "startTime": '2017-04-17 15:17:00',
         "endTime": '2017-04-17 15:18:00'
     }, [{'dtu': 'shhwhn02',
          'history': [{'state': 1, 'time': '2017-04-14 01:15:40'},
                      {'state': 0, 'time': '2017-04-14 01:40:18'},
                      {'state': 0, 'time': '2017-04-14 01:50:40'},
                      {'state': 1, 'time': '2017-04-17 15:17:33'}]}]),
    # 011_1
    ({
         "projectId": 72,
         "dtu": ["shhwhn02"],
         "startTime": '2017-04-17 15:35:00',
         "endTime": '2017-04-17 15:36:00'
     }, [{'history': [{'state': 1, 'time': '2017-04-17 15:23:33'},
                      {'state': 1, 'time': '2017-04-17 15:35:32'}],
          'dtu': 'shhwhn02'}]),

    # 011_-
    ({
         "projectId": 72,
         "dtu": ["shhwhn02"],
         "startTime": '2017-05-25 10:30:00',
         "endTime": '2017-05-25 10:30:00'
     },[{'dtu': 'shhwhn02', 'history': []}]),
    # timeZone11 1000－101
    ({
         "projectId": 293,
         "dtu": ["qantas"],
         "startTime": '2017-03-20 20:48:00',
         "endTime": '2017-03-21 05:05:00'
     }, [{'history': [{'state': 1, 'time': '2017-03-18 15:32:23'},
                      {'state': 0, 'time': '2017-03-20 13:14:19'},
                      {'state': 0, 'time': '2017-03-20 13:41:01'},
                      {'state': 1, 'time': '2017-03-20 20:48:10'},
                      {'state': 0, 'time': '2017-03-21 03:00:07'},
                      {'state': 1, 'time': '2017-03-21 05:04:15'}],
          'dtu': 'qantas'}])
])
def test_project_status_history(data, expected):
    rt = TestCommon.ProjectStatusHistory.run(data)
    TestCommon.ProjectStatusHistory.assert_result_equals(expected, rt)
