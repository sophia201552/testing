# coding=utf-8
from ExpertContainer.api.views import *
import pytest
import json
from ExpertContainer.dbAccess.RedisManager import RedisManager

taskId = "5a1ca3dafa9a16594a704d2d"
projId=49
@pytest.mark.p0
@pytest.mark.parametrize(('data','expected','flag'), [
    ({'projId': projId},{"userId": 2265, "taskEndTime": "2017-11-28 07:52:50", "status": 1, "endTime": "2017-11-28 07:46",
               "projId": projId, "taskId":taskId , "flag": -1, "progress": 100,
               "file": {"link": "/ExportData/data_seperate_4d2d_201711270746_201711280746_m5.zip",
                        "name": "data_seperate_4d2d_201711270746_201711280746_m5.zip"}, "userName": "AutoTester",
               "points": [], "format": "m5", "taskStartTime": "2017-11-28 07:46:39", "startTime": "2017-11-27 07:46"},True),
    ({},[],False)
])
def test_correct(data,expected,flag):
    RedisManager.hash_set(taskId, expected)
    rt = json.loads(do_list_export_task(data))
    RedisManager.hash_delete_task(taskId)
    if flag:
        assert isinstance(rt,list),'actual is not list'
        for item in rt:
            if item.get('taskId')==taskId:
                for key in item.keys():
                    assert item.get(key) == expected.get(key), 'acutal is not equal to expected,actual is {0},expected is {1}'.format(item,expected)
    else:
        assert len(expected)==0 and len(rt)==0,'data is {},acutal is not []'