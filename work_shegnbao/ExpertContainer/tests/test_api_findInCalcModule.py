# coding=utf-8
from ExpertContainer.api.views import *
import pytest
import json
from ExpertContainer.logic.LogicBase import LogicBase
import datetime

projId = 194
expected = {'msg': 'ok', 'data': [
    {'codeLine': [2], 'projId': 293, 'code': ["    rs = calc_daily_delta_of_accum('Accum_ChGroup_GroupEnergy')"],
     'moduleName': 'calcpoint_293_Accum_ChGroup_GroupEnergyD'},
    {'codeLine': [2], 'projId': 293, 'code': ["    rs = calc_daily_delta_of_accum('Accum_PCHWPGroup_GroupEnergy')"],
     'moduleName': 'calcpoint_293_Accum_PCHWPGroup_GroupEnergyD'},
    {'codeLine': [2], 'projId': 293, 'code': ["    rs = calc_daily_delta_of_accum('Accum_CHWPGroup_GroupEnergy')"],
     'moduleName': 'calcpoint_293_Accum_CHWPGroup_GroupEnergyD'},
    {'codeLine': [2], 'projId': 293, 'code': ["    rs = calc_daily_delta_of_accum('Accum_SCHWPGroup_GroupEnergy')"],
     'moduleName': 'calcpoint_293_Accum_SCHWPGroup_GroupEnergyD'},
    {'codeLine': [2], 'projId': 293, 'code': ["    rs = calc_daily_delta_of_accum('Accum_CWPGroup_GroupEnergy')"],
     'moduleName': 'calcpoint_293_Accum_CWPGroup_GroupEnergyD'},
    {'codeLine': [2], 'projId': 293, 'code': ["    rs = calc_daily_delta_of_accum('Accum_HWPGroup_GroupEnergy')"],
     'moduleName': 'calcpoint_293_Accum_HWPGroup_GroupEnergyD'},
    {'codeLine': [2], 'projId': 293, 'code': ["    rs = calc_daily_delta_of_accum('Accum_CTGroup_GroupEnergy')"],
     'moduleName': 'calcpoint_293_Accum_CTGroup_GroupEnergyD'}], 'error': 0}

@pytest.mark.p0
@pytest.mark.parametrize(('data', 'expected', 'flag'), [
    ({"projIdList": [194, 293], "apiName": "calc_daily_delta_of_accum"}, expected, True),
    ({}, "Wrong params, please check it!", False),
])
def test_api_findInCalcModule(data, expected, flag):
    if flag:
        rt = json.loads(do_find_api_in_calc(data))
        assert rt.get('error')==0 and rt.get('msg') == 'ok', 'actual is not equal to expcted ,acutal is {0}'.format(rt)
        assert len(rt)==len(expected),'acutal length is not equal to expected,acutal is {0},expected is {1}'.format(len(rt),len(expected))
        data=rt.get('data')
        for item in data:
            assert item in expected.get('data'),'{0} is not in expected'.format(item)
    else:
        rt = json.loads(do_find_api_in_calc(data))
        assert rt.get('error') == 1 and rt.get('msg') == expected, 'acutal is not False,acutal is {0}'.format(rt)
