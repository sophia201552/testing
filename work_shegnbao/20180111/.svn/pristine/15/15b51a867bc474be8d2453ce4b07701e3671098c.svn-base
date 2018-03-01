# coding=utf-8
import pytest
from tests.utils import TestCommon

#396开能环保新增测试用例
kaineng_test_pointList = ['WQMonit001_PH', 'Room_RH_003', 'Accum_watermeter_lifeuseH_T_va', 'x_10000001_UV3']
@pytest.mark.p0
def test_kaineng_m5_specific_time():
    rt = TestCommon.GetHistoryDataPadded.run({
        'projectId': 396,
        'timeStart': '2017-11-14 00:00:00',
        'timeEnd': '2017-11-15 00:00:00',
        'timeFormat': 'm5',
        'pointList': kaineng_test_pointList
    })
    expected = [
    {
        "name": "Accum_watermeter_lifeuseH_T_va",
        "max": 101.06,
        "history": [
            {
                "value": 99.98,
                "time": "2017-11-14 00:00:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 00:05:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 00:10:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 00:15:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 00:20:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 00:25:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 00:30:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 00:35:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 00:40:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 00:45:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 00:50:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 00:55:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 01:00:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 01:05:00",
                "error": True
            },
            {
                "value": 99.98,
                "time": "2017-11-14 01:10:00",
                "error": False
            },
            {
                "value": 98.21,
                "time": "2017-11-14 01:15:00",
                "error": False
            },
            {
                "value": 84.05,
                "time": "2017-11-14 01:20:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 01:25:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 01:30:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 01:35:00",
                "error": False
            },
            {
                "value": 99.83,
                "time": "2017-11-14 01:40:00",
                "error": False
            },
            {
                "value": 101.06,
                "time": "2017-11-14 01:45:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 01:50:00",
                "error": False
            },
            {
                "value": 0.2,
                "time": "2017-11-14 01:55:00",
                "error": False
            },
            {
                "value": 0.4,
                "time": "2017-11-14 02:00:00",
                "error": False
            },
            {
                "value": 0.7,
                "time": "2017-11-14 02:05:00",
                "error": False
            },
            {
                "value": 1.17,
                "time": "2017-11-14 02:10:00",
                "error": False
            },
            {
                "value": 1.49,
                "time": "2017-11-14 02:15:00",
                "error": False
            },
            {
                "value": 1.49,
                "time": "2017-11-14 02:20:00",
                "error": False
            },
            {
                "value": 1.97,
                "time": "2017-11-14 02:25:00",
                "error": False
            },
            {
                "value": 2.09,
                "time": "2017-11-14 02:30:00",
                "error": False
            },
            {
                "value": 2.14,
                "time": "2017-11-14 02:35:00",
                "error": False
            },
            {
                "value": 2.37,
                "time": "2017-11-14 02:40:00",
                "error": False
            },
            {
                "value": 2.6,
                "time": "2017-11-14 02:45:00",
                "error": False
            },
            {
                "value": 2.88,
                "time": "2017-11-14 02:50:00",
                "error": False
            },
            {
                "value": 0.17,
                "time": "2017-11-14 02:55:00",
                "error": False
            },
            {
                "value": 0.42,
                "time": "2017-11-14 03:00:00",
                "error": False
            },
            {
                "value": 0.56,
                "time": "2017-11-14 03:05:00",
                "error": False
            },
            {
                "value": 0.76,
                "time": "2017-11-14 03:10:00",
                "error": False
            },
            {
                "value": 0.94,
                "time": "2017-11-14 03:15:00",
                "error": False
            },
            {
                "value": 1.15,
                "time": "2017-11-14 03:20:00",
                "error": False
            },
            {
                "value": 1.3,
                "time": "2017-11-14 03:25:00",
                "error": False
            },
            {
                "value": 1.33,
                "time": "2017-11-14 03:30:00",
                "error": False
            },
            {
                "value": 1.61,
                "time": "2017-11-14 03:35:00",
                "error": False
            },
            {
                "value": 1.83,
                "time": "2017-11-14 03:40:00",
                "error": False
            },
            {
                "value": 2.18,
                "time": "2017-11-14 03:45:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 03:50:00",
                "error": False
            },
            {
                "value": 0.22,
                "time": "2017-11-14 03:55:00",
                "error": False
            },
            {
                "value": 0.5,
                "time": "2017-11-14 04:00:00",
                "error": False
            },
            {
                "value": 0.67,
                "time": "2017-11-14 04:05:00",
                "error": False
            },
            {
                "value": 0.78,
                "time": "2017-11-14 04:10:00",
                "error": False
            },
            {
                "value": 0.78,
                "time": "2017-11-14 04:15:00",
                "error": False
            },
            {
                "value": 1.15,
                "time": "2017-11-14 04:20:00",
                "error": False
            },
            {
                "value": 1.15,
                "time": "2017-11-14 04:25:00",
                "error": False
            },
            {
                "value": 1.53,
                "time": "2017-11-14 04:30:00",
                "error": False
            },
            {
                "value": 1.53,
                "time": "2017-11-14 04:35:00",
                "error": False
            },
            {
                "value": 1.96,
                "time": "2017-11-14 04:40:00",
                "error": False
            },
            {
                "value": 2.08,
                "time": "2017-11-14 04:45:00",
                "error": False
            },
            {
                "value": 2.42,
                "time": "2017-11-14 04:50:00",
                "error": False
            },
            {
                "value": 0.17,
                "time": "2017-11-14 04:55:00",
                "error": False
            },
            {
                "value": 0.43,
                "time": "2017-11-14 05:00:00",
                "error": False
            },
            {
                "value": 0.59,
                "time": "2017-11-14 05:05:00",
                "error": False
            },
            {
                "value": 0.94,
                "time": "2017-11-14 05:10:00",
                "error": False
            },
            {
                "value": 1.38,
                "time": "2017-11-14 05:15:00",
                "error": False
            },
            {
                "value": 1.69,
                "time": "2017-11-14 05:20:00",
                "error": False
            },
            {
                "value": 1.97,
                "time": "2017-11-14 05:25:00",
                "error": False
            },
            {
                "value": 2.3,
                "time": "2017-11-14 05:30:00",
                "error": False
            },
            {
                "value": 2.57,
                "time": "2017-11-14 05:35:00",
                "error": False
            },
            {
                "value": 2.82,
                "time": "2017-11-14 05:40:00",
                "error": False
            },
            {
                "value": 3.08,
                "time": "2017-11-14 05:45:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 05:50:00",
                "error": False
            },
            {
                "value": 0.34,
                "time": "2017-11-14 05:55:00",
                "error": False
            },
            {
                "value": 0.62,
                "time": "2017-11-14 06:00:00",
                "error": False
            },
            {
                "value": 0.85,
                "time": "2017-11-14 06:05:00",
                "error": False
            },
            {
                "value": 1.2,
                "time": "2017-11-14 06:10:00",
                "error": False
            },
            {
                "value": 1.43,
                "time": "2017-11-14 06:15:00",
                "error": False
            },
            {
                "value": 1.62,
                "time": "2017-11-14 06:20:00",
                "error": False
            },
            {
                "value": 1.76,
                "time": "2017-11-14 06:25:00",
                "error": False
            },
            {
                "value": 1.96,
                "time": "2017-11-14 06:30:00",
                "error": False
            },
            {
                "value": 1.96,
                "time": "2017-11-14 06:35:00",
                "error": False
            },
            {
                "value": 2.28,
                "time": "2017-11-14 06:40:00",
                "error": False
            },
            {
                "value": 2.44,
                "time": "2017-11-14 06:45:00",
                "error": False
            },
            {
                "value": 2.44,
                "time": "2017-11-14 06:50:00",
                "error": False
            },
            {
                "value": 0.23,
                "time": "2017-11-14 06:55:00",
                "error": False
            },
            {
                "value": 0.51,
                "time": "2017-11-14 07:00:00",
                "error": False
            },
            {
                "value": 0.8,
                "time": "2017-11-14 07:05:00",
                "error": False
            },
            {
                "value": 1.15,
                "time": "2017-11-14 07:10:00",
                "error": False
            },
            {
                "value": 1.68,
                "time": "2017-11-14 07:15:00",
                "error": False
            },
            {
                "value": 2.23,
                "time": "2017-11-14 07:20:00",
                "error": False
            },
            {
                "value": 2.68,
                "time": "2017-11-14 07:25:00",
                "error": False
            },
            {
                "value": 3.05,
                "time": "2017-11-14 07:30:00",
                "error": False
            },
            {
                "value": 3.36,
                "time": "2017-11-14 07:35:00",
                "error": False
            },
            {
                "value": 3.75,
                "time": "2017-11-14 07:40:00",
                "error": False
            },
            {
                "value": 4.17,
                "time": "2017-11-14 07:45:00",
                "error": False
            },
            {
                "value": 4.56,
                "time": "2017-11-14 07:50:00",
                "error": False
            },
            {
                "value": 4.56,
                "time": "2017-11-14 07:55:00",
                "error": False
            },
            {
                "value": 1.08,
                "time": "2017-11-14 08:00:00",
                "error": False
            },
            {
                "value": 1.49,
                "time": "2017-11-14 08:05:00",
                "error": False
            },
            {
                "value": 2.02,
                "time": "2017-11-14 08:10:00",
                "error": False
            },
            {
                "value": 2.41,
                "time": "2017-11-14 08:15:00",
                "error": False
            },
            {
                "value": 2.6,
                "time": "2017-11-14 08:20:00",
                "error": False
            },
            {
                "value": 3.17,
                "time": "2017-11-14 08:25:00",
                "error": False
            },
            {
                "value": 3.54,
                "time": "2017-11-14 08:30:00",
                "error": False
            },
            {
                "value": 3.89,
                "time": "2017-11-14 08:35:00",
                "error": False
            },
            {
                "value": 4.81,
                "time": "2017-11-14 08:40:00",
                "error": False
            },
            {
                "value": 5.41,
                "time": "2017-11-14 08:45:00",
                "error": False
            },
            {
                "value": 5.7,
                "time": "2017-11-14 08:50:00",
                "error": False
            },
            {
                "value": 0.51,
                "time": "2017-11-14 08:55:00",
                "error": False
            },
            {
                "value": 1.24,
                "time": "2017-11-14 09:00:00",
                "error": False
            },
            {
                "value": 1.99,
                "time": "2017-11-14 09:05:00",
                "error": False
            },
            {
                "value": 2.5,
                "time": "2017-11-14 09:10:00",
                "error": False
            },
            {
                "value": 2.64,
                "time": "2017-11-14 09:15:00",
                "error": False
            },
            {
                "value": 2.64,
                "time": "2017-11-14 09:20:00",
                "error": False
            },
            {
                "value": 3.91,
                "time": "2017-11-14 09:25:00",
                "error": False
            },
            {
                "value": 4.46,
                "time": "2017-11-14 09:30:00",
                "error": False
            },
            {
                "value": 5.09,
                "time": "2017-11-14 09:35:00",
                "error": False
            },
            {
                "value": 5.75,
                "time": "2017-11-14 09:40:00",
                "error": False
            },
            {
                "value": 6.13,
                "time": "2017-11-14 09:45:00",
                "error": False
            },
            {
                "value": 6.93,
                "time": "2017-11-14 09:50:00",
                "error": False
            },
            {
                "value": 0.52,
                "time": "2017-11-14 09:55:00",
                "error": False
            },
            {
                "value": 1.15,
                "time": "2017-11-14 10:00:00",
                "error": False
            },
            {
                "value": 1.8,
                "time": "2017-11-14 10:05:00",
                "error": False
            },
            {
                "value": 2.28,
                "time": "2017-11-14 10:10:00",
                "error": False
            },
            {
                "value": 2.74,
                "time": "2017-11-14 10:15:00",
                "error": False
            },
            {
                "value": 3.02,
                "time": "2017-11-14 10:20:00",
                "error": False
            },
            {
                "value": 3.95,
                "time": "2017-11-14 10:25:00",
                "error": False
            },
            {
                "value": 4.51,
                "time": "2017-11-14 10:30:00",
                "error": False
            },
            {
                "value": 4.75,
                "time": "2017-11-14 10:35:00",
                "error": False
            },
            {
                "value": 5.33,
                "time": "2017-11-14 10:40:00",
                "error": False
            },
            {
                "value": 6.02,
                "time": "2017-11-14 10:45:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 10:50:00",
                "error": False
            },
            {
                "value": 0.44,
                "time": "2017-11-14 10:55:00",
                "error": False
            },
            {
                "value": 0.87,
                "time": "2017-11-14 11:00:00",
                "error": False
            },
            {
                "value": 1.07,
                "time": "2017-11-14 11:05:00",
                "error": False
            },
            {
                "value": 1.73,
                "time": "2017-11-14 11:10:00",
                "error": False
            },
            {
                "value": 2.21,
                "time": "2017-11-14 11:15:00",
                "error": False
            },
            {
                "value": 2.86,
                "time": "2017-11-14 11:20:00",
                "error": False
            },
            {
                "value": 3.23,
                "time": "2017-11-14 11:25:00",
                "error": False
            },
            {
                "value": 3.67,
                "time": "2017-11-14 11:30:00",
                "error": False
            },
            {
                "value": 4.32,
                "time": "2017-11-14 11:35:00",
                "error": False
            },
            {
                "value": 4.66,
                "time": "2017-11-14 11:40:00",
                "error": False
            },
            {
                "value": 5.29,
                "time": "2017-11-14 11:45:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 11:50:00",
                "error": False
            },
            {
                "value": 0.45,
                "time": "2017-11-14 11:55:00",
                "error": False
            },
            {
                "value": 0.76,
                "time": "2017-11-14 12:00:00",
                "error": False
            },
            {
                "value": 1.33,
                "time": "2017-11-14 12:05:00",
                "error": False
            },
            {
                "value": 2.13,
                "time": "2017-11-14 12:10:00",
                "error": False
            },
            {
                "value": 2.34,
                "time": "2017-11-14 12:15:00",
                "error": False
            },
            {
                "value": 3.12,
                "time": "2017-11-14 12:20:00",
                "error": False
            },
            {
                "value": 4.24,
                "time": "2017-11-14 12:25:00",
                "error": False
            },
            {
                "value": 4.39,
                "time": "2017-11-14 12:30:00",
                "error": False
            },
            {
                "value": 5.42,
                "time": "2017-11-14 12:35:00",
                "error": False
            },
            {
                "value": 6.13,
                "time": "2017-11-14 12:40:00",
                "error": False
            },
            {
                "value": 6.8,
                "time": "2017-11-14 12:45:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 12:50:00",
                "error": False
            },
            {
                "value": 0.66,
                "time": "2017-11-14 12:55:00",
                "error": False
            },
            {
                "value": 0.87,
                "time": "2017-11-14 13:00:00",
                "error": False
            },
            {
                "value": 1.91,
                "time": "2017-11-14 13:05:00",
                "error": False
            },
            {
                "value": 2.54,
                "time": "2017-11-14 13:10:00",
                "error": False
            },
            {
                "value": 3.06,
                "time": "2017-11-14 13:15:00",
                "error": False
            },
            {
                "value": 3.6,
                "time": "2017-11-14 13:20:00",
                "error": False
            },
            {
                "value": 4.1,
                "time": "2017-11-14 13:25:00",
                "error": False
            },
            {
                "value": 4.4,
                "time": "2017-11-14 13:30:00",
                "error": False
            },
            {
                "value": 5.03,
                "time": "2017-11-14 13:35:00",
                "error": False
            },
            {
                "value": 5.41,
                "time": "2017-11-14 13:40:00",
                "error": False
            },
            {
                "value": 6.06,
                "time": "2017-11-14 13:45:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 13:50:00",
                "error": False
            },
            {
                "value": 0.54,
                "time": "2017-11-14 13:55:00",
                "error": False
            },
            {
                "value": 0.99,
                "time": "2017-11-14 14:00:00",
                "error": False
            },
            {
                "value": 1.42,
                "time": "2017-11-14 14:05:00",
                "error": False
            },
            {
                "value": 1.78,
                "time": "2017-11-14 14:10:00",
                "error": False
            },
            {
                "value": 2.17,
                "time": "2017-11-14 14:15:00",
                "error": False
            },
            {
                "value": 2.54,
                "time": "2017-11-14 14:20:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 14:25:00",
                "error": False
            },
            {
                "value": 3.68,
                "time": "2017-11-14 14:30:00",
                "error": False
            },
            {
                "value": 4.27,
                "time": "2017-11-14 14:35:00",
                "error": False
            },
            {
                "value": 4.86,
                "time": "2017-11-14 14:40:00",
                "error": False
            },
            {
                "value": 5.45,
                "time": "2017-11-14 14:45:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 14:50:00",
                "error": False
            },
            {
                "value": 0.45,
                "time": "2017-11-14 14:55:00",
                "error": False
            },
            {
                "value": 0.9,
                "time": "2017-11-14 15:00:00",
                "error": False
            },
            {
                "value": 1.17,
                "time": "2017-11-14 15:05:00",
                "error": False
            },
            {
                "value": 1.53,
                "time": "2017-11-14 15:10:00",
                "error": False
            },
            {
                "value": 2,
                "time": "2017-11-14 15:15:00",
                "error": False
            },
            {
                "value": 2.55,
                "time": "2017-11-14 15:20:00",
                "error": False
            },
            {
                "value": 2.97,
                "time": "2017-11-14 15:25:00",
                "error": False
            },
            {
                "value": 3.51,
                "time": "2017-11-14 15:30:00",
                "error": False
            },
            {
                "value": 3.8,
                "time": "2017-11-14 15:35:00",
                "error": False
            },
            {
                "value": 4.23,
                "time": "2017-11-14 15:40:00",
                "error": False
            },
            {
                "value": 4.72,
                "time": "2017-11-14 15:45:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 15:50:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 15:55:00",
                "error": False
            },
            {
                "value": 1.02,
                "time": "2017-11-14 16:00:00",
                "error": False
            },
            {
                "value": 1.48,
                "time": "2017-11-14 16:05:00",
                "error": False
            },
            {
                "value": 1.69,
                "time": "2017-11-14 16:10:00",
                "error": False
            },
            {
                "value": 1.69,
                "time": "2017-11-14 16:15:00",
                "error": False
            },
            {
                "value": 2.66,
                "time": "2017-11-14 16:20:00",
                "error": False
            },
            {
                "value": 2.66,
                "time": "2017-11-14 16:25:00",
                "error": False
            },
            {
                "value": 2.66,
                "time": "2017-11-14 16:30:00",
                "error": False
            },
            {
                "value": 4.27,
                "time": "2017-11-14 16:35:00",
                "error": False
            },
            {
                "value": 4.73,
                "time": "2017-11-14 16:40:00",
                "error": False
            },
            {
                "value": 4.73,
                "time": "2017-11-14 16:45:00",
                "error": False
            },
            {
                "value": 4.73,
                "time": "2017-11-14 16:50:00",
                "error": False
            },
            {
                "value": 4.73,
                "time": "2017-11-14 16:55:00",
                "error": False
            },
            {
                "value": 0.88,
                "time": "2017-11-14 17:00:00",
                "error": False
            },
            {
                "value": 0.88,
                "time": "2017-11-14 17:05:00",
                "error": False
            },
            {
                "value": 0.88,
                "time": "2017-11-14 17:10:00",
                "error": False
            },
            {
                "value": 0.88,
                "time": "2017-11-14 17:15:00",
                "error": False
            },
            {
                "value": 3.64,
                "time": "2017-11-14 17:20:00",
                "error": False
            },
            {
                "value": 3.64,
                "time": "2017-11-14 17:25:00",
                "error": False
            },
            {
                "value": 3.64,
                "time": "2017-11-14 17:30:00",
                "error": False
            },
            {
                "value": 3.64,
                "time": "2017-11-14 17:35:00",
                "error": False
            },
            {
                "value": 5.32,
                "time": "2017-11-14 17:40:00",
                "error": False
            },
            {
                "value": 5.32,
                "time": "2017-11-14 17:45:00",
                "error": False
            },
            {
                "value": 5.32,
                "time": "2017-11-14 17:50:00",
                "error": False
            },
            {
                "value": 5.32,
                "time": "2017-11-14 17:55:00",
                "error": False
            },
            {
                "value": 1.06,
                "time": "2017-11-14 18:00:00",
                "error": False
            },
            {
                "value": 1.06,
                "time": "2017-11-14 18:05:00",
                "error": False
            },
            {
                "value": 1.06,
                "time": "2017-11-14 18:10:00",
                "error": False
            },
            {
                "value": 1.06,
                "time": "2017-11-14 18:15:00",
                "error": False
            },
            {
                "value": 1.06,
                "time": "2017-11-14 18:20:00",
                "error": False
            },
            {
                "value": 1.06,
                "time": "2017-11-14 18:25:00",
                "error": False
            },
            {
                "value": 4.75,
                "time": "2017-11-14 18:30:00",
                "error": False
            },
            {
                "value": 4.75,
                "time": "2017-11-14 18:35:00",
                "error": False
            },
            {
                "value": 5.72,
                "time": "2017-11-14 18:40:00",
                "error": False
            },
            {
                "value": 5.72,
                "time": "2017-11-14 18:45:00",
                "error": False
            },
            {
                "value": 5.72,
                "time": "2017-11-14 18:50:00",
                "error": False
            },
            {
                "value": 5.72,
                "time": "2017-11-14 18:55:00",
                "error": True
            },
            {
                "value": 5.72,
                "time": "2017-11-14 19:00:00",
                "error": True
            },
            {
                "value": 5.72,
                "time": "2017-11-14 19:05:00",
                "error": True
            },
            {
                "value": 5.72,
                "time": "2017-11-14 19:10:00",
                "error": True
            },
            {
                "value": 5.72,
                "time": "2017-11-14 19:15:00",
                "error": True
            },
            {
                "value": 5.72,
                "time": "2017-11-14 19:20:00",
                "error": True
            },
            {
                "value": 5.72,
                "time": "2017-11-14 19:25:00",
                "error": True
            },
            {
                "value": 0.42,
                "time": "2017-11-14 19:30:00",
                "error": False
            },
            {
                "value": 3.41,
                "time": "2017-11-14 19:35:00",
                "error": False
            },
            {
                "value": 3.41,
                "time": "2017-11-14 19:40:00",
                "error": False
            },
            {
                "value": 3.41,
                "time": "2017-11-14 19:45:00",
                "error": False
            },
            {
                "value": 0,
                "time": "2017-11-14 19:50:00",
                "error": False
            },
            {
                "value": 0.26,
                "time": "2017-11-14 19:55:00",
                "error": False
            },
            {
                "value": 0.26,
                "time": "2017-11-14 20:00:00",
                "error": False
            },
            {
                "value": 0.82,
                "time": "2017-11-14 20:05:00",
                "error": False
            },
            {
                "value": 0.82,
                "time": "2017-11-14 20:10:00",
                "error": False
            },
            {
                "value": 1.51,
                "time": "2017-11-14 20:15:00",
                "error": False
            },
            {
                "value": 1.51,
                "time": "2017-11-14 20:20:00",
                "error": False
            },
            {
                "value": 1.51,
                "time": "2017-11-14 20:25:00",
                "error": False
            },
            {
                "value": 1.51,
                "time": "2017-11-14 20:30:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 20:35:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 20:40:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 20:45:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 20:50:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 20:55:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 21:00:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 21:05:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 21:10:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 21:15:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 21:20:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 21:25:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 21:30:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 21:35:00",
                "error": False
            },
            {
                "value": 2.85,
                "time": "2017-11-14 21:40:00",
                "error": False
            },
            {
                "value": 2.38,
                "time": "2017-11-14 21:45:00",
                "error": False
            },
            {
                "value": 2.38,
                "time": "2017-11-14 21:50:00",
                "error": False
            },
            {
                "value": 2.38,
                "time": "2017-11-14 21:55:00",
                "error": False
            },
            {
                "value": 2.38,
                "time": "2017-11-14 22:00:00",
                "error": False
            },
            {
                "value": 2.38,
                "time": "2017-11-14 22:05:00",
                "error": False
            },
            {
                "value": 0.66,
                "time": "2017-11-14 22:10:00",
                "error": False
            },
            {
                "value": 0.91,
                "time": "2017-11-14 22:15:00",
                "error": False
            },
            {
                "value": 0.91,
                "time": "2017-11-14 22:20:00",
                "error": False
            },
            {
                "value": 1.33,
                "time": "2017-11-14 22:25:00",
                "error": False
            },
            {
                "value": 1.33,
                "time": "2017-11-14 22:30:00",
                "error": False
            },
            {
                "value": 1.57,
                "time": "2017-11-14 22:35:00",
                "error": False
            },
            {
                "value": 1.57,
                "time": "2017-11-14 22:40:00",
                "error": False
            },
            {
                "value": 2.02,
                "time": "2017-11-14 22:45:00",
                "error": False
            },
            {
                "value": 2.02,
                "time": "2017-11-14 22:50:00",
                "error": False
            },
            {
                "value": 2.02,
                "time": "2017-11-14 22:55:00",
                "error": False
            },
            {
                "value": 0.11,
                "time": "2017-11-14 23:00:00",
                "error": False
            },
            {
                "value": 0.57,
                "time": "2017-11-14 23:05:00",
                "error": False
            },
            {
                "value": 0.57,
                "time": "2017-11-14 23:10:00",
                "error": False
            },
            {
                "value": 0.94,
                "time": "2017-11-14 23:15:00",
                "error": False
            },
            {
                "value": 0.94,
                "time": "2017-11-14 23:20:00",
                "error": False
            },
            {
                "value": 0.94,
                "time": "2017-11-14 23:25:00",
                "error": False
            },
            {
                "value": 0.94,
                "time": "2017-11-14 23:30:00",
                "error": False
            },
            {
                "value": 1.89,
                "time": "2017-11-14 23:35:00",
                "error": False
            },
            {
                "value": 1.89,
                "time": "2017-11-14 23:40:00",
                "error": False
            },
            {
                "value": 1.89,
                "time": "2017-11-14 23:45:00",
                "error": False
            },
            {
                "value": 1.89,
                "time": "2017-11-14 23:50:00",
                "error": False
            },
            {
                "value": 1.89,
                "time": "2017-11-14 23:55:00",
                "error": False
            },
            {
                "value": 1.89,
                "time": "2017-11-15 00:00:00",
                "error": False
            }
        ],
        "std": 24.040552796917638,
        "avg": 8.75159169550173,
        "min": 0,
        "median": 2.28
    },
    {
        "name": "Room_RH_003",
        "max": 57.43,
        "history": [
            {
                "value": 56.91,
                "time": "2017-11-14 00:00:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 00:05:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 00:10:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 00:15:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 00:20:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 00:25:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 00:30:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 00:35:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 00:40:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 00:45:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 00:50:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 00:55:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 01:00:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 01:05:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 01:10:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 01:15:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 01:20:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 01:25:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 01:30:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 01:35:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 01:40:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 01:45:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 01:50:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 01:55:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 02:00:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 02:05:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 02:10:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 02:15:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 02:20:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 02:25:00",
                "error": True
            },
            {
                "value": 56.91,
                "time": "2017-11-14 02:30:00",
                "error": False
            },
            {
                "value": 56.91,
                "time": "2017-11-14 02:35:00",
                "error": False
            },
            {
                "value": 56.42,
                "time": "2017-11-14 02:40:00",
                "error": False
            },
            {
                "value": 56.42,
                "time": "2017-11-14 02:45:00",
                "error": False
            },
            {
                "value": 56.42,
                "time": "2017-11-14 02:50:00",
                "error": False
            },
            {
                "value": 56.43,
                "time": "2017-11-14 02:55:00",
                "error": False
            },
            {
                "value": 56.43,
                "time": "2017-11-14 03:00:00",
                "error": False
            },
            {
                "value": 56.44,
                "time": "2017-11-14 03:05:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 03:10:00",
                "error": False
            },
            {
                "value": 55.95,
                "time": "2017-11-14 03:15:00",
                "error": False
            },
            {
                "value": 55.97,
                "time": "2017-11-14 03:20:00",
                "error": False
            },
            {
                "value": 55.47,
                "time": "2017-11-14 03:25:00",
                "error": False
            },
            {
                "value": 55.97,
                "time": "2017-11-14 03:30:00",
                "error": False
            },
            {
                "value": 55.97,
                "time": "2017-11-14 03:35:00",
                "error": False
            },
            {
                "value": 56.46,
                "time": "2017-11-14 03:40:00",
                "error": False
            },
            {
                "value": 55.96,
                "time": "2017-11-14 03:45:00",
                "error": False
            },
            {
                "value": 55.96,
                "time": "2017-11-14 03:50:00",
                "error": False
            },
            {
                "value": 55.96,
                "time": "2017-11-14 03:55:00",
                "error": False
            },
            {
                "value": 55.96,
                "time": "2017-11-14 04:00:00",
                "error": False
            },
            {
                "value": 55.47,
                "time": "2017-11-14 04:05:00",
                "error": False
            },
            {
                "value": 55.96,
                "time": "2017-11-14 04:10:00",
                "error": False
            },
            {
                "value": 55.96,
                "time": "2017-11-14 04:15:00",
                "error": False
            },
            {
                "value": 55.96,
                "time": "2017-11-14 04:20:00",
                "error": False
            },
            {
                "value": 55.96,
                "time": "2017-11-14 04:25:00",
                "error": False
            },
            {
                "value": 55.96,
                "time": "2017-11-14 04:30:00",
                "error": False
            },
            {
                "value": 55.96,
                "time": "2017-11-14 04:35:00",
                "error": False
            },
            {
                "value": 55.47,
                "time": "2017-11-14 04:40:00",
                "error": False
            },
            {
                "value": 55.46,
                "time": "2017-11-14 04:45:00",
                "error": False
            },
            {
                "value": 55.46,
                "time": "2017-11-14 04:50:00",
                "error": False
            },
            {
                "value": 55.46,
                "time": "2017-11-14 04:55:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 05:00:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 05:05:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 05:10:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 05:15:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 05:20:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 05:25:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 05:30:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 05:35:00",
                "error": False
            },
            {
                "value": 55.44,
                "time": "2017-11-14 05:40:00",
                "error": False
            },
            {
                "value": 55.44,
                "time": "2017-11-14 05:45:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 05:50:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 05:55:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 06:00:00",
                "error": False
            },
            {
                "value": 55.93,
                "time": "2017-11-14 06:05:00",
                "error": False
            },
            {
                "value": 55.93,
                "time": "2017-11-14 06:10:00",
                "error": False
            },
            {
                "value": 55.92,
                "time": "2017-11-14 06:15:00",
                "error": False
            },
            {
                "value": 56.41,
                "time": "2017-11-14 06:20:00",
                "error": False
            },
            {
                "value": 55.93,
                "time": "2017-11-14 06:25:00",
                "error": False
            },
            {
                "value": 56.42,
                "time": "2017-11-14 06:30:00",
                "error": False
            },
            {
                "value": 55.93,
                "time": "2017-11-14 06:35:00",
                "error": False
            },
            {
                "value": 55.93,
                "time": "2017-11-14 06:40:00",
                "error": False
            },
            {
                "value": 55.92,
                "time": "2017-11-14 06:45:00",
                "error": False
            },
            {
                "value": 55.93,
                "time": "2017-11-14 06:50:00",
                "error": False
            },
            {
                "value": 55.44,
                "time": "2017-11-14 06:55:00",
                "error": False
            },
            {
                "value": 55.45,
                "time": "2017-11-14 07:00:00",
                "error": False
            },
            {
                "value": 55.44,
                "time": "2017-11-14 07:05:00",
                "error": False
            },
            {
                "value": 55.45,
                "time": "2017-11-14 07:10:00",
                "error": False
            },
            {
                "value": 55.43,
                "time": "2017-11-14 07:15:00",
                "error": False
            },
            {
                "value": 55.91,
                "time": "2017-11-14 07:20:00",
                "error": False
            },
            {
                "value": 56.4,
                "time": "2017-11-14 07:25:00",
                "error": False
            },
            {
                "value": 56.4,
                "time": "2017-11-14 07:30:00",
                "error": False
            },
            {
                "value": 56.4,
                "time": "2017-11-14 07:35:00",
                "error": False
            },
            {
                "value": 55.91,
                "time": "2017-11-14 07:40:00",
                "error": False
            },
            {
                "value": 55.92,
                "time": "2017-11-14 07:45:00",
                "error": False
            },
            {
                "value": 55.44,
                "time": "2017-11-14 07:50:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 07:55:00",
                "error": False
            },
            {
                "value": 55.45,
                "time": "2017-11-14 08:00:00",
                "error": False
            },
            {
                "value": 55.45,
                "time": "2017-11-14 08:05:00",
                "error": False
            },
            {
                "value": 55.44,
                "time": "2017-11-14 08:10:00",
                "error": False
            },
            {
                "value": 55.93,
                "time": "2017-11-14 08:15:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 08:20:00",
                "error": False
            },
            {
                "value": 55.94,
                "time": "2017-11-14 08:25:00",
                "error": False
            },
            {
                "value": 55.93,
                "time": "2017-11-14 08:30:00",
                "error": False
            },
            {
                "value": 56.42,
                "time": "2017-11-14 08:35:00",
                "error": False
            },
            {
                "value": 56.42,
                "time": "2017-11-14 08:40:00",
                "error": False
            },
            {
                "value": 56.91,
                "time": "2017-11-14 08:45:00",
                "error": False
            },
            {
                "value": 56.91,
                "time": "2017-11-14 08:50:00",
                "error": False
            },
            {
                "value": 57.4,
                "time": "2017-11-14 08:55:00",
                "error": False
            },
            {
                "value": 56.91,
                "time": "2017-11-14 09:00:00",
                "error": False
            },
            {
                "value": 57.4,
                "time": "2017-11-14 09:05:00",
                "error": False
            },
            {
                "value": 57.4,
                "time": "2017-11-14 09:10:00",
                "error": False
            },
            {
                "value": 57.4,
                "time": "2017-11-14 09:15:00",
                "error": False
            },
            {
                "value": 57.4,
                "time": "2017-11-14 09:20:00",
                "error": False
            },
            {
                "value": 57.4,
                "time": "2017-11-14 09:25:00",
                "error": False
            },
            {
                "value": 57.4,
                "time": "2017-11-14 09:30:00",
                "error": False
            },
            {
                "value": 57.4,
                "time": "2017-11-14 09:35:00",
                "error": False
            },
            {
                "value": 57.4,
                "time": "2017-11-14 09:40:00",
                "error": False
            },
            {
                "value": 57.4,
                "time": "2017-11-14 09:45:00",
                "error": False
            },
            {
                "value": 57.42,
                "time": "2017-11-14 09:50:00",
                "error": False
            },
            {
                "value": 57.42,
                "time": "2017-11-14 09:55:00",
                "error": False
            },
            {
                "value": 57.43,
                "time": "2017-11-14 10:00:00",
                "error": False
            },
            {
                "value": 56.93,
                "time": "2017-11-14 10:05:00",
                "error": False
            },
            {
                "value": 56.93,
                "time": "2017-11-14 10:10:00",
                "error": False
            },
            {
                "value": 56.93,
                "time": "2017-11-14 10:15:00",
                "error": False
            },
            {
                "value": 56.45,
                "time": "2017-11-14 10:20:00",
                "error": False
            },
            {
                "value": 56.45,
                "time": "2017-11-14 10:25:00",
                "error": False
            },
            {
                "value": 56.45,
                "time": "2017-11-14 10:30:00",
                "error": False
            },
            {
                "value": 56.45,
                "time": "2017-11-14 10:35:00",
                "error": False
            },
            {
                "value": 56.44,
                "time": "2017-11-14 10:40:00",
                "error": False
            },
            {
                "value": 56.45,
                "time": "2017-11-14 10:45:00",
                "error": False
            },
            {
                "value": 56.45,
                "time": "2017-11-14 10:50:00",
                "error": False
            },
            {
                "value": 55.95,
                "time": "2017-11-14 10:55:00",
                "error": False
            },
            {
                "value": 56.43,
                "time": "2017-11-14 11:00:00",
                "error": False
            },
            {
                "value": 56.92,
                "time": "2017-11-14 11:05:00",
                "error": False
            },
            {
                "value": 56.92,
                "time": "2017-11-14 11:10:00",
                "error": False
            },
            {
                "value": 56.42,
                "time": "2017-11-14 11:15:00",
                "error": False
            },
            {
                "value": 56.42,
                "time": "2017-11-14 11:20:00",
                "error": False
            },
            {
                "value": 55.93,
                "time": "2017-11-14 11:25:00",
                "error": False
            },
            {
                "value": 55.93,
                "time": "2017-11-14 11:30:00",
                "error": False
            },
            {
                "value": 55.44,
                "time": "2017-11-14 11:35:00",
                "error": False
            },
            {
                "value": 55.44,
                "time": "2017-11-14 11:40:00",
                "error": False
            },
            {
                "value": 55.44,
                "time": "2017-11-14 11:45:00",
                "error": False
            },
            {
                "value": 54.95,
                "time": "2017-11-14 11:50:00",
                "error": False
            },
            {
                "value": 54.95,
                "time": "2017-11-14 11:55:00",
                "error": False
            },
            {
                "value": 54.94,
                "time": "2017-11-14 12:00:00",
                "error": False
            },
            {
                "value": 54.94,
                "time": "2017-11-14 12:05:00",
                "error": False
            },
            {
                "value": 54.44,
                "time": "2017-11-14 12:10:00",
                "error": False
            },
            {
                "value": 54.44,
                "time": "2017-11-14 12:15:00",
                "error": False
            },
            {
                "value": 54.44,
                "time": "2017-11-14 12:20:00",
                "error": False
            },
            {
                "value": 53.95,
                "time": "2017-11-14 12:25:00",
                "error": False
            },
            {
                "value": 53.95,
                "time": "2017-11-14 12:30:00",
                "error": False
            },
            {
                "value": 53.45,
                "time": "2017-11-14 12:35:00",
                "error": False
            },
            {
                "value": 53.45,
                "time": "2017-11-14 12:40:00",
                "error": False
            },
            {
                "value": 53.46,
                "time": "2017-11-14 12:45:00",
                "error": False
            },
            {
                "value": 52.95,
                "time": "2017-11-14 12:50:00",
                "error": False
            },
            {
                "value": 52.96,
                "time": "2017-11-14 12:55:00",
                "error": False
            },
            {
                "value": 52.46,
                "time": "2017-11-14 13:00:00",
                "error": False
            },
            {
                "value": 52.46,
                "time": "2017-11-14 13:05:00",
                "error": False
            },
            {
                "value": 52.47,
                "time": "2017-11-14 13:10:00",
                "error": False
            },
            {
                "value": 51.98,
                "time": "2017-11-14 13:15:00",
                "error": False
            },
            {
                "value": 51.98,
                "time": "2017-11-14 13:20:00",
                "error": False
            },
            {
                "value": 51.98,
                "time": "2017-11-14 13:25:00",
                "error": False
            },
            {
                "value": 51.98,
                "time": "2017-11-14 13:30:00",
                "error": False
            },
            {
                "value": 52.48,
                "time": "2017-11-14 13:35:00",
                "error": False
            },
            {
                "value": 51.97,
                "time": "2017-11-14 13:40:00",
                "error": False
            },
            {
                "value": 51.98,
                "time": "2017-11-14 13:45:00",
                "error": False
            },
            {
                "value": 51.98,
                "time": "2017-11-14 13:50:00",
                "error": False
            },
            {
                "value": 51.97,
                "time": "2017-11-14 13:55:00",
                "error": False
            },
            {
                "value": 51.97,
                "time": "2017-11-14 14:00:00",
                "error": False
            },
            {
                "value": 52.46,
                "time": "2017-11-14 14:05:00",
                "error": False
            },
            {
                "value": 51.96,
                "time": "2017-11-14 14:10:00",
                "error": False
            },
            {
                "value": 52.46,
                "time": "2017-11-14 14:15:00",
                "error": False
            },
            {
                "value": 52.46,
                "time": "2017-11-14 14:20:00",
                "error": False
            },
            {
                "value": 51.95,
                "time": "2017-11-14 14:25:00",
                "error": False
            },
            {
                "value": 52.45,
                "time": "2017-11-14 14:30:00",
                "error": False
            },
            {
                "value": 52.44,
                "time": "2017-11-14 14:35:00",
                "error": False
            },
            {
                "value": 52.45,
                "time": "2017-11-14 14:40:00",
                "error": False
            },
            {
                "value": 52.45,
                "time": "2017-11-14 14:45:00",
                "error": False
            },
            {
                "value": 52.96,
                "time": "2017-11-14 14:50:00",
                "error": False
            },
            {
                "value": 53.46,
                "time": "2017-11-14 14:55:00",
                "error": False
            },
            {
                "value": 52.96,
                "time": "2017-11-14 15:00:00",
                "error": False
            },
            {
                "value": 52.97,
                "time": "2017-11-14 15:05:00",
                "error": False
            },
            {
                "value": 52.97,
                "time": "2017-11-14 15:10:00",
                "error": False
            },
            {
                "value": 52.97,
                "time": "2017-11-14 15:15:00",
                "error": False
            },
            {
                "value": 52.97,
                "time": "2017-11-14 15:20:00",
                "error": False
            },
            {
                "value": 53.47,
                "time": "2017-11-14 15:25:00",
                "error": False
            },
            {
                "value": 52.97,
                "time": "2017-11-14 15:30:00",
                "error": False
            },
            {
                "value": 52.97,
                "time": "2017-11-14 15:35:00",
                "error": False
            },
            {
                "value": 52.98,
                "time": "2017-11-14 15:40:00",
                "error": False
            },
            {
                "value": 52.47,
                "time": "2017-11-14 15:45:00",
                "error": False
            },
            {
                "value": 52.96,
                "time": "2017-11-14 15:50:00",
                "error": False
            },
            {
                "value": 52.97,
                "time": "2017-11-14 15:55:00",
                "error": False
            },
            {
                "value": 52.96,
                "time": "2017-11-14 16:00:00",
                "error": False
            },
            {
                "value": 52.46,
                "time": "2017-11-14 16:05:00",
                "error": False
            },
            {
                "value": 51.96,
                "time": "2017-11-14 16:10:00",
                "error": False
            },
            {
                "value": 51.95,
                "time": "2017-11-14 16:15:00",
                "error": False
            },
            {
                "value": 51.96,
                "time": "2017-11-14 16:20:00",
                "error": False
            },
            {
                "value": 51.95,
                "time": "2017-11-14 16:25:00",
                "error": False
            },
            {
                "value": 51.95,
                "time": "2017-11-14 16:30:00",
                "error": False
            },
            {
                "value": 51.45,
                "time": "2017-11-14 16:35:00",
                "error": False
            },
            {
                "value": 51.45,
                "time": "2017-11-14 16:40:00",
                "error": False
            },
            {
                "value": 51.45,
                "time": "2017-11-14 16:45:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 16:50:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 16:55:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 17:00:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 17:05:00",
                "error": False
            },
            {
                "value": 50.95,
                "time": "2017-11-14 17:10:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 17:15:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 17:20:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 17:25:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 17:30:00",
                "error": False
            },
            {
                "value": 51.45,
                "time": "2017-11-14 17:35:00",
                "error": False
            },
            {
                "value": 51.96,
                "time": "2017-11-14 17:40:00",
                "error": False
            },
            {
                "value": 51.95,
                "time": "2017-11-14 17:45:00",
                "error": False
            },
            {
                "value": 51.96,
                "time": "2017-11-14 17:50:00",
                "error": False
            },
            {
                "value": 51.96,
                "time": "2017-11-14 17:55:00",
                "error": False
            },
            {
                "value": 51.97,
                "time": "2017-11-14 18:00:00",
                "error": False
            },
            {
                "value": 52.47,
                "time": "2017-11-14 18:05:00",
                "error": False
            },
            {
                "value": 52.47,
                "time": "2017-11-14 18:10:00",
                "error": False
            },
            {
                "value": 52.47,
                "time": "2017-11-14 18:15:00",
                "error": False
            },
            {
                "value": 52.47,
                "time": "2017-11-14 18:20:00",
                "error": False
            },
            {
                "value": 52.48,
                "time": "2017-11-14 18:25:00",
                "error": False
            },
            {
                "value": 52.48,
                "time": "2017-11-14 18:30:00",
                "error": False
            },
            {
                "value": 52.99,
                "time": "2017-11-14 18:35:00",
                "error": False
            },
            {
                "value": 52.99,
                "time": "2017-11-14 18:40:00",
                "error": False
            },
            {
                "value": 52.98,
                "time": "2017-11-14 18:45:00",
                "error": False
            },
            {
                "value": 52.98,
                "time": "2017-11-14 18:50:00",
                "error": False
            },
            {
                "value": 52.47,
                "time": "2017-11-14 18:55:00",
                "error": False
            },
            {
                "value": 52.97,
                "time": "2017-11-14 19:00:00",
                "error": False
            },
            {
                "value": 52.96,
                "time": "2017-11-14 19:05:00",
                "error": False
            },
            {
                "value": 52.96,
                "time": "2017-11-14 19:10:00",
                "error": True
            },
            {
                "value": 52.96,
                "time": "2017-11-14 19:15:00",
                "error": True
            },
            {
                "value": 52.96,
                "time": "2017-11-14 19:20:00",
                "error": True
            },
            {
                "value": 52.96,
                "time": "2017-11-14 19:25:00",
                "error": True
            },
            {
                "value": 52.96,
                "time": "2017-11-14 19:30:00",
                "error": True
            },
            {
                "value": 52.96,
                "time": "2017-11-14 19:35:00",
                "error": True
            },
            {
                "value": 51.46,
                "time": "2017-11-14 19:40:00",
                "error": False
            },
            {
                "value": 51.47,
                "time": "2017-11-14 19:45:00",
                "error": False
            },
            {
                "value": 51.47,
                "time": "2017-11-14 19:50:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 19:55:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 20:00:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 20:05:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 20:10:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 20:15:00",
                "error": False
            },
            {
                "value": 51.46,
                "time": "2017-11-14 20:20:00",
                "error": False
            },
            {
                "value": 51.45,
                "time": "2017-11-14 20:25:00",
                "error": False
            },
            {
                "value": 51.45,
                "time": "2017-11-14 20:30:00",
                "error": False
            },
            {
                "value": 50.94,
                "time": "2017-11-14 20:35:00",
                "error": False
            },
            {
                "value": 51.42,
                "time": "2017-11-14 20:40:00",
                "error": False
            },
            {
                "value": 51.41,
                "time": "2017-11-14 20:45:00",
                "error": False
            },
            {
                "value": 51.4,
                "time": "2017-11-14 20:50:00",
                "error": False
            },
            {
                "value": 51.4,
                "time": "2017-11-14 20:55:00",
                "error": False
            },
            {
                "value": 51.39,
                "time": "2017-11-14 21:00:00",
                "error": False
            },
            {
                "value": 51.39,
                "time": "2017-11-14 21:05:00",
                "error": False
            },
            {
                "value": 51.87,
                "time": "2017-11-14 21:10:00",
                "error": False
            },
            {
                "value": 51.38,
                "time": "2017-11-14 21:15:00",
                "error": False
            },
            {
                "value": 51.87,
                "time": "2017-11-14 21:20:00",
                "error": False
            },
            {
                "value": 51.87,
                "time": "2017-11-14 21:25:00",
                "error": False
            },
            {
                "value": 51.86,
                "time": "2017-11-14 21:30:00",
                "error": False
            },
            {
                "value": 51.87,
                "time": "2017-11-14 21:35:00",
                "error": False
            },
            {
                "value": 51.86,
                "time": "2017-11-14 21:40:00",
                "error": False
            },
            {
                "value": 52.36,
                "time": "2017-11-14 21:45:00",
                "error": False
            },
            {
                "value": 51.86,
                "time": "2017-11-14 21:50:00",
                "error": False
            },
            {
                "value": 52.36,
                "time": "2017-11-14 21:55:00",
                "error": False
            },
            {
                "value": 51.86,
                "time": "2017-11-14 22:00:00",
                "error": False
            },
            {
                "value": 51.86,
                "time": "2017-11-14 22:05:00",
                "error": False
            },
            {
                "value": 51.86,
                "time": "2017-11-14 22:10:00",
                "error": False
            },
            {
                "value": 51.86,
                "time": "2017-11-14 22:15:00",
                "error": False
            },
            {
                "value": 51.38,
                "time": "2017-11-14 22:20:00",
                "error": False
            },
            {
                "value": 51.36,
                "time": "2017-11-14 22:25:00",
                "error": False
            },
            {
                "value": 51.36,
                "time": "2017-11-14 22:30:00",
                "error": False
            },
            {
                "value": 51.37,
                "time": "2017-11-14 22:35:00",
                "error": False
            },
            {
                "value": 51.36,
                "time": "2017-11-14 22:40:00",
                "error": False
            },
            {
                "value": 51.85,
                "time": "2017-11-14 22:45:00",
                "error": False
            },
            {
                "value": 51.85,
                "time": "2017-11-14 22:50:00",
                "error": False
            },
            {
                "value": 52.36,
                "time": "2017-11-14 22:55:00",
                "error": False
            },
            {
                "value": 52.37,
                "time": "2017-11-14 23:00:00",
                "error": False
            },
            {
                "value": 51.87,
                "time": "2017-11-14 23:05:00",
                "error": False
            },
            {
                "value": 51.42,
                "time": "2017-11-14 23:10:00",
                "error": False
            },
            {
                "value": 50.92,
                "time": "2017-11-14 23:15:00",
                "error": False
            },
            {
                "value": 50.44,
                "time": "2017-11-14 23:20:00",
                "error": False
            },
            {
                "value": 50.44,
                "time": "2017-11-14 23:25:00",
                "error": False
            },
            {
                "value": 50.45,
                "time": "2017-11-14 23:30:00",
                "error": False
            },
            {
                "value": 50.44,
                "time": "2017-11-14 23:35:00",
                "error": False
            },
            {
                "value": 50.44,
                "time": "2017-11-14 23:40:00",
                "error": False
            },
            {
                "value": 50.94,
                "time": "2017-11-14 23:45:00",
                "error": False
            },
            {
                "value": 50.95,
                "time": "2017-11-14 23:50:00",
                "error": False
            },
            {
                "value": 50.94,
                "time": "2017-11-14 23:55:00",
                "error": False
            },
            {
                "value": 50.94,
                "time": "2017-11-15 00:00:00",
                "error": False
            }
        ],
        "std": 2.2283444500433354,
        "avg": 54.23979238754325,
        "min": 50.44,
        "median": 54.94
    },
    {
        "name": "WQMonit001_PH",
        "max": 7.85,
        "history": [
            {
                "value": 7.85,
                "time": "2017-11-14 00:00:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 00:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 00:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 00:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 00:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 00:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 00:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 00:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 00:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 00:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 00:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 00:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 01:00:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 01:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 01:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 01:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 01:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 01:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 01:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 01:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 01:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 01:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 01:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 01:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 02:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 02:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 02:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 02:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 02:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 02:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 02:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 02:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 02:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 02:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 02:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 02:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 03:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 03:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 03:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 03:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 03:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 03:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 03:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 03:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 03:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 03:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 03:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 03:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 04:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 04:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 04:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 04:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 04:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 04:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 04:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 04:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 04:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 04:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 04:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 04:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 05:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 05:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 05:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 05:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 05:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 05:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 05:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 05:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 05:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 05:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 05:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 05:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 06:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 06:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 06:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 06:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 06:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 06:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 06:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 06:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 06:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 06:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 06:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 06:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 07:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 07:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 07:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 07:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 07:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 07:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 07:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 07:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 07:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 07:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 07:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 07:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 08:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 08:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 08:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 08:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 08:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 08:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 08:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 08:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 08:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 08:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 08:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 08:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 09:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 09:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 09:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 09:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 09:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 09:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 09:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 09:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 09:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 09:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 09:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 09:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 10:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 10:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 10:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 10:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 10:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 10:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 10:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 10:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 10:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 10:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 10:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 10:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 11:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 11:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 11:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 11:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 11:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 11:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 11:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 11:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 11:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 11:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 11:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 11:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 12:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 12:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 12:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 12:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 12:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 12:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 12:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 12:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 12:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 12:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 12:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 12:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 13:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 13:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 13:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 13:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 13:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 13:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 13:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 13:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 13:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 13:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 13:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 13:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 14:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 14:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 14:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 14:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 14:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 14:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 14:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 14:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 14:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 14:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 14:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 14:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 15:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 15:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 15:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 15:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 15:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 15:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 15:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 15:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 15:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 15:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 15:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 15:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 16:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 16:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 16:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 16:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 16:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 16:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 16:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 16:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 16:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 16:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 16:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 16:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 17:00:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 17:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 17:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 17:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 17:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 17:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 17:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 17:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 17:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 17:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 17:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 17:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 18:00:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 18:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 18:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 18:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 18:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 18:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 18:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 18:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 18:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 18:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 18:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 18:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 19:00:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 19:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 19:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 19:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 19:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 19:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 19:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 19:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 19:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 19:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 19:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 19:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 20:00:00",
                "error": False
            },
            {
                "value": 7.85,
                "time": "2017-11-14 20:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 20:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 20:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 20:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 20:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 20:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 20:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 20:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 20:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 20:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 20:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 21:00:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 21:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 21:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 21:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 21:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 21:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 21:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 21:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 21:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 21:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 21:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 21:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 22:00:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 22:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 22:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 22:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 22:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 22:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 22:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 22:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 22:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 22:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 22:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 22:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 23:00:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 23:05:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 23:10:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 23:15:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 23:20:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 23:25:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 23:30:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 23:35:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 23:40:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 23:45:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 23:50:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-14 23:55:00",
                "error": True
            },
            {
                "value": 7.85,
                "time": "2017-11-15 00:00:00",
                "error": True
            }
        ],
        "std": 8.881784197001252e-16,
        "avg": 7.8500000000000005,
        "min": 7.85,
        "median": 7.85
    },
    {
        "name": "x_10000001_UV3",
        "max": 1.855,
        "history": [
            {
                "value": 1.855,
                "time": "2017-11-14 00:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 00:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 00:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 00:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 00:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 00:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 00:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 00:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 00:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 00:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 00:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 00:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 01:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 01:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 01:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 01:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 01:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 01:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 01:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 01:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 01:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 01:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 01:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 01:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 02:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 02:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 02:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 02:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 02:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 02:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 02:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 02:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 02:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 02:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 02:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 02:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 03:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 03:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 03:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 03:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 03:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 03:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 03:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 03:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 03:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 03:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 03:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 03:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 04:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 04:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 04:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 04:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 04:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 04:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 04:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 04:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 04:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 04:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 04:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 04:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 05:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 05:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 05:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 05:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 05:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 05:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 05:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 05:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 05:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 05:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 05:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 05:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 06:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 06:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 06:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 06:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 06:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 06:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 06:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 06:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 06:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 06:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 06:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 06:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 07:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 07:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 07:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 07:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 07:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 07:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 07:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 07:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 07:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 07:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 07:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 07:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 08:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 08:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 08:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 08:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 08:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 08:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 08:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 08:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 08:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 08:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 08:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 08:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 09:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 09:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 09:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 09:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 09:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 09:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 09:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 09:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 09:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 09:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 09:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 09:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 10:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 10:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 10:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 10:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 10:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 10:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 10:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 10:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 10:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 10:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 10:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 10:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 11:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 11:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 11:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 11:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 11:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 11:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 11:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 11:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 11:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 11:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 11:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 11:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 12:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 12:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 12:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 12:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 12:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 12:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 12:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 12:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 12:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 12:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 12:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 12:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 13:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 13:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 13:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 13:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 13:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 13:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 13:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 13:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 13:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 13:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 13:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 13:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 14:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 14:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 14:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 14:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 14:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 14:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 14:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 14:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 14:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 14:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 14:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 14:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 15:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 15:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 15:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 15:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 15:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 15:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 15:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 15:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 15:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 15:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 15:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 15:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 16:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 16:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 16:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 16:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 16:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 16:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 16:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 16:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 16:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 16:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 16:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 16:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 17:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 17:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 17:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 17:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 17:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 17:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 17:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 17:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 17:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 17:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 17:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 17:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 18:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 18:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 18:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 18:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 18:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 18:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 18:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 18:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 18:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 18:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 18:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 18:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 19:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 19:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 19:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 19:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 19:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 19:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 19:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 19:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 19:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 19:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 19:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 19:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 20:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 20:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 20:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 20:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 20:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 20:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 20:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 20:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 20:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 20:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 20:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 20:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 21:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 21:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 21:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 21:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 21:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 21:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 21:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 21:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 21:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 21:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 21:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 21:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 22:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 22:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 22:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 22:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 22:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 22:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 22:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 22:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 22:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 22:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 22:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 22:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 23:00:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 23:05:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 23:10:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 23:15:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 23:20:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 23:25:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 23:30:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 23:35:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 23:40:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 23:45:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 23:50:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-14 23:55:00",
                "error": False
            },
            {
                "value": 1.855,
                "time": "2017-11-15 00:00:00",
                "error": False
            }
        ],
        "std": 2.220446049250313e-16,
        "avg": 1.8550000000000002,
        "min": 1.855,
        "median": 1.855
    }
]
    TestCommon.GetHistoryDataPadded.assert_result_equals(expected, rt)