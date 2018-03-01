# coding=utf-8
from ExpertContainer.api.views import *
import pytest
import json

dic = {'percent': '已完成', 'cur_num': 16025, 'format': 'm5', 'point_list': ['DTUOffStatus'],
        'updateTime': '2017-07-20 18:15:14', 'total': 16025, 'project_id': 293,
        'user_name': 'lee', 'user_id': 527, 'time_from': '2017-05-25 00:00:00',
        'act_start': '2017-07-20 14:21:50', 'time_to': '2017-07-19 15:20:00'}
obid = "59704bfec0e5d01c508ae068"
projId = 293
_keyName = 'expertrepairInfo_%s_%s' % (projId, obid)


@pytest.mark.p0
@pytest.mark.usefixtures('deleteFromRedis')
@pytest.mark.parametrize(('projId', 'expected', 'flag'), [
    (projId, dic, True),
    (None, [], False)
])
def test_repairDataStatus(projId, expected, flag):
    ArchiveManager.write_repair(projId, obid, dic)
    if flag:
        rt = json.loads(do_repairDataStatus(projId))
        assert len(rt) == 1, 'acutal length is not equal to expected,acutal is {0},expected is 1'.format(len(rt))
        data=rt.get(obid)
        for key in data.keys():
            assert data.get(key) == expected.get(key), 'not equal, acutal={0},expected={1}'.format(data.get(key),expected.get(obid).get(key))
    else:
        rt = json.loads(do_repairDataStatus(projId))
        assert rt == expected, 'acutal is not [],acutal is {0}'.format(rt)


@pytest.fixture(scope='function')
def deleteFromRedis(request):
    def fin():
        RedisManager.delete(_keyName)

    request.addfinalizer(fin)
