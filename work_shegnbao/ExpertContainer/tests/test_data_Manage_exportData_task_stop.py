#coding=utf-8
__author__ = 'angelia'

import pytest
from ExpertContainer.api.views import *
from ExpertContainer.dbAccess.RedisManager import RedisManager


@pytest.mark.p0
@pytest.mark.parametrize(('force', 'strforce', 'expected_st', 'expected','taskId'),[
    (0,'true', {'success': False, 'msg': 'task status is 1'}, {"msg": "ok", "success": True},[]),
    (0,'false', '', {'success': False, 'msg': ''},[]),
    (0,'false', '', {'success': False, 'msg': 'task is not found'},''),
])
def test_data_Manage_exportData_task_stop(force, strforce, expected_st, expected, taskId):
    if taskId == []:
        data = do_put_export_data_into_mq(2,'Day_Load' ,72, 456, 'm5', '2017-11-20 10:00:00', '2017-11-21 10:00:00',str(ObjectId()), {"error": True, "msg": '', "data": ''})
        taskId = data.get('msg')
        if strforce == 'true':
            RedisManager.hash_set(taskId, None, 'status', 1)
            rt_set = json.loads(do_stop_export_task(force, taskId, strforce))
            assert rt_set == expected_st, 'actual result is %s, which differs from expected %s' %(rt_set, expected_st)
            rt_after = RedisManager.hash_get(taskId)
            assert not rt_after, 'already delete task but failed'

            data = do_put_export_data_into_mq(2,'Day_Load' ,72, 456, 'm5', '2017-11-20 10:00:00', '2017-11-21 10:00:00',str(ObjectId()), {"error": True, "msg": '', "data": ''})
            taskId = data.get('msg')
            rt1 = json.loads(do_stop_export_task(force, taskId, strforce))
            if rt1:
                assert rt1 == expected, 'actual result is %s, which differs from expected %s' %(rt1, expected)
                step1_rt = RedisManager.hash_get(taskId)
                assert step1_rt.get('stop') == 1, 'actual task stop status is %s,which differs from 1' %(step1_rt.get('stop'))
                rt2 = do_stop_export_task(force, taskId, strforce)
                if rt2:
                    step2_rt = RedisManager.hash_get(taskId)
                    assert not step2_rt, 'already delete task but failed'
                else:
                    assert False, 'stop export task failed'
            else:
                assert False, 'stop export task failed'
        else:
            rt = json.loads(do_stop_export_task(force, taskId, strforce))
            assert rt == expected, 'actual result is %s, which differs from expected %s' %(rt, expected)
    else:
        rt = json.loads(do_stop_export_task(force, taskId, strforce))
        assert rt == expected, 'actual result is %s, which differs from expected %s' % (rt, expected)

