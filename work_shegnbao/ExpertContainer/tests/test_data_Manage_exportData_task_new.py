#coding=utf-8
__author__ = 'angelia'

import pytest
from ExpertContainer.api.views import *
from ExpertContainer.dbAccess.RedisManager import RedisManager


@pytest.mark.p0
@pytest.mark.parametrize(('flag', 'points', 'projId', 'userId', 'format', 'startTime', 'endTime', 'rt', 'rv'),[
    ('','' ,72, 456, 'm5', '2017-11-20 10:00:00', '2017-11-21 10:00:00',str(ObjectId()), {"error": True, "msg": '', "data": ''}),
    (2,'' ,72, 456, 'm5', '2017-11-20 10:00:00', '2017-11-21 10:00:00',str(ObjectId()), {"error": True, "msg": '', "data": ''}),
    ('','Day_Load' ,72, 456, 'm5', '2017-11-20 10:00:00', '2017-11-21 10:00:00',str(ObjectId()), {"error": True, "msg": '', "data": ''}),
    (2,'Day_Load' ,72, 456, 'm5', '2017-11-20 10:00:00', '2017-11-21 10:00:00',str(ObjectId()), {"error": True, "msg": '', "data": ''}),
])
def test_data_Manage_exportData_task_new(flag, points, projId, userId, format, startTime, endTime, rt, rv):
    r = do_put_export_data_into_mq(flag, points, projId, userId, format, startTime, endTime, rt, rv)
    if r:
        taskId = r.get('msg')
        if taskId:
            actual = RedisManager.hash_get(taskId)
            RedisManager.hash_delete_task(taskId)
            if actual:
                actual_flag = actual.get('flag')
                actual_projId = actual.get('projId')
                actual_userId = actual.get('userId')
                actual_format = actual.get('format')
                actual_st = actual.get('startTime')
                actual_et = actual.get('endTime')
                actual_points = actual.get('points')
                assert actual_flag == flag, 'actual flag is %s, which differs from expected' %(actual_flag, flag)
                assert actual_points == points, 'actual points is %s, which differs from expected' %(actual_points, points)
                assert actual_projId == projId, 'actual projId is %s, which differs from expected' %(actual_projId, projId)
                assert actual_userId == userId, 'actual userId is %s, which differs from expected' %(actual_userId, userId)
                assert actual_format == format, 'actual format is %s, which differs from expected' %(actual_format, format)
                assert actual_st == startTime, 'actual start time is %s, which differs from expected' %(actual_st, startTime)
                assert actual_et == endTime, 'actual end time is %s, which differs from expected' %(actual_et, endTime)
            else:
                assert False, 'expected task does not exist in redis'
        else:
            assert r == rt, 'actual result is %s, which differs from expected' %(r, rt)
    else:
        assert False, 'get data manage export data task failed'


