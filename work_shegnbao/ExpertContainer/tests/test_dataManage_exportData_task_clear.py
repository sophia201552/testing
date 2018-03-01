# coding=utf-8
from ExpertContainer.api.views import *
import pytest
import json
from ExpertContainer.dbAccess.RedisManager import RedisManager

projId=49
taskId = "5a1ca3dafa9a16594a704d2d"
@pytest.mark.p0
@pytest.mark.parametrize(('data','expected','flag'), [
    ({'projId':projId},'ok',True),
    ({'projId':projId,'force':'True'},'ok',True),
    ({'projId':projId,'taskId':taskId},'ok',True),
    ({'projId':projId,'taskId':taskId,'force':'True'},'ok',True),
    ({},'',False),
    ({'projId':projId,'force':True},"'bool' object has no attribute 'lower'",False),
])
def test_dataManage_exportData_task_clear(data,expected,flag):
    if flag:
        content = {"userId": 2265, "taskEndTime": "2017-11-28 07:52:50", "status": 1, "endTime": "2017-11-28 07:46",
                   "projId": projId, "taskId": taskId, "flag": -1, "progress": 100,
                   "file": {"link": "/ExportData/data_seperate_4d2d_201711270746_201711280746_m5.zip",
                            "name": "data_seperate_4d2d_201711270746_201711280746_m5.zip"}, "userName": "AutoTester",
                   "points": [], "format": "m5", "taskStartTime": "2017-11-28 07:46:39",
                   "startTime": "2017-11-27 07:46"}
        RedisManager.hash_set(taskId, content)
        rt = json.loads(do_clear_export_task(data))
        assert isinstance(rt,dict),'actual is not dict'
        assert rt.get('success')==True and rt.get('msg')==expected,'acutal is not True,acutal is {0}'.format(rt)
    else:
        rt = json.loads(do_clear_export_task(data))
        assert rt.get('success')==False and rt.get('msg')==expected,'acutal is not False,acutal is {0}'.format(rt)


