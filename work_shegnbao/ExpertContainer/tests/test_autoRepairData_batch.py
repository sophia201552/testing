#coding=utf-8
import pytest
from ExpertContainer.api.views import *
import json
@pytest.mark.p2
@pytest.mark.parametrize('data',[
    ( {'pointList':['testautoRepairData', 'testautoRepairData01'],
       "projId":49,
       "timeFrom":'2017-12-01 00:00:00',
       "timeTo":'2017-12-01 01:00:00'})
])
def test_autoRepairData_batch(data):
    rt = json.loads(do_autoRepairDataBatch(data))
    assert not rt.get('error'), 'Failed to autoRepairData batch'

