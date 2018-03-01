''' 预测分析模块 '''
import json
import re

from ...Util import getCodeByTimeRange
from .ModuleBase import ModuleBase

class ModuleForecast(ModuleBase):
    ''' 预测分析 '''
    def breakdownData(self):
        ModuleBase.breakdownData(self)
        self.content = {
            'code': self._getCode()
        }

    def _getCode(self):
        arr_input = self.arrInput
        retract = self.getRetract(self.optionRetractLevel)
        info = {
            'modeltype': 'Line',
            'x': {}
        }

        time_range = self.store['option']['timeRange']
        if time_range is None:
            time_option = 'None', 'None', 'None'
        else:
            time_option = getCodeByTimeRange(time_range)

        model_param_name = arr_input[0].name

        code = """
url1 = 'http://' + app.config['BEOPWEB_ADDR'] + '/analysis/model/exec'
ref_data = json.loads(%s)
model = ref_data['data']
post_data={
    'modeltype': 'Line',
    'x': {}
}
params = ref_data.get('params', [])
time_start, time_end, time_format = %s

points = []
_proj_id = None
for i, param in enumerate(params):
    arr = param.replace('|', '@').split('@')
    points.append(arr[2])
    if _proj_id == None:
        _proj_id = int(arr[1])

his_data = get_his_data_with_time(_proj_id, points, time_start, time_end, time_format)
for i, item in enumerate(his_data['list']):
    post_data['x']['x'+str(i+1)] = his_data['list'][i]['data']
post_data['model'] = model.get('model')
data = HttpTestTool.postJsonWithCookie(url1, data=post_data, t=60)
his_data['list'].insert(0, {
    'dsItemId': 'Predicted Data',
    'data': json.loads(data)
})
result = json.dumps({
    'list': his_data['list'],
    'timeShaft': his_data['timeShaft']
})
        """ % (model_param_name, time_option)
        code = re.sub(r'"\|@(.*?)@\|"', r'\g<1>["list"][0]["data"]', code)
        return code

    def createHeaderPrivateParams(self):
        return None
