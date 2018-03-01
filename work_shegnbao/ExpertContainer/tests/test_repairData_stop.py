#coding=utf-8

import pytest
from ExpertContainer.api.views import *
from ExpertContainer.dbAccess.RedisManager import RedisManager
import json
_keyName = None
projId=49
userId=2265
@pytest.mark.p2
@pytest.mark.usefixtures('deleteFromRedis')
@pytest.mark.parametrize(('data','flag'),[
    ({'projId':projId,'userId':userId,'obId':None},True),
    ({'projId':projId,'userId':userId,'obId':None},False),
    ({'projId':None,'userId':userId,'obId':None},False),
    ({'projId':projId,'userId':None,'obId':None},False),
    ({'projId':projId,'userId':userId,'obId':'123'},False),
])
def test_repairData_stop(data,flag):
    global _keyName
    repartdata = do_repairDataBatch(projId, "test_repairdata_stop", userId, '2017-12-04 00:00:00', '2017-12-05 00:00:00', 'm5', 'true')
    if flag:
        str_id = repartdata.get('data')
        data['obId'] = str_id
        name = 'expertrepairInfo_%s_%s' % (projId, str_id)
        _keyName = name
        rt = json.loads(do_repairDataStop(data))
        assert rt.get('success'),'Failed to repairDataStop'
        info=RedisManager.get(name)
        assert info['cancel'] == 1,'repairDataStop:cancel key is not 1'
        assert info['percent'] == '已取消','repairDataStop:percent key is not 已取消'
    else:
        rt = json.loads(do_repairDataStop(data))
        assert not rt.get('success'), 'repairDataStop:wrong data success '



@pytest.fixture(scope='function')
def deleteFromRedis(request):
    def fin():
        global _keyName
        if _keyName is not None:
            RedisManager.delete(_keyName)
            _keyName = None
    request.addfinalizer(fin)