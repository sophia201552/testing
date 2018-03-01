#coding=utf-8
__author__ = 'angelia'

import pytest
from ExpertContainer.api.views import *
from ExpertContainer.dbAccess.RedisManager import RedisManager

_keyName = None

@pytest.mark.p2
@pytest.mark.usefixtures('deleteFromRedis')
@pytest.mark.parametrize(('projId', 'nameList', 'userId', 'timeFrom', 'timeTo', 'format', 'all'),[
    (49, ['test_alarm', 'test_alarm01'], 456, '2017-12-04 00:00:00', '2017-12-05 00:00:00', 'm5', 'true'),
    (49, ['test_alarm', 'test_alarm01'], 456, '2017-12-04 00:00:00', '2017-12-05 00:00:00', 'm5', ''),
])
def test_repairData_batch(projId, nameList, userId, timeFrom, timeTo, format, all):
    global _keyName
    rt = do_repairDataBatch(projId, nameList, userId, timeFrom, timeTo, format, all)
    if rt:
        assert rt.get('status'), 'Failed to schedule repair task'
        str_id = rt.get('data')
        name = 'expertrepairInfo_%s_%s' %(projId, str_id)
        _keyName = name
        assert RedisManager.get(name) is not None, 'Failed to send task to redis'
        # RedisManager.delete(name)
    else:
        assert False,'Failed to schedule repair task'

@pytest.fixture(scope='function')
def deleteFromRedis(request):
    def fin():
        global _keyName
        if _keyName is not None:
            RedisManager.delete(_keyName)
            _keyName = None
    request.addfinalizer(fin)