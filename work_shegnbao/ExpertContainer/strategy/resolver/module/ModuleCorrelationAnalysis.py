''' 相关性分析模块 '''
import json
import re

from .ModuleBase import ModuleBase

class ModuleCorrelationAnalysis(ModuleBase):

    def breakdownData(self):
        ModuleBase.breakdownData(self);
        self.content = {
            'code': self._getCode()
        }

    ''' 相关性分析 '''
    def _getCode(self):
        arr_input = self.arrInput
        info = {
            'x': {}
        }
        points = []
        for i, item in enumerate(arr_input):
            if i == 0:
                base_value_name = item.name
                info['y'] = '|@%s@|' % item.name
            else:
                points.append(item.getValue())
                info['x']['x%d' % (i,)] = '|@%s@|' % item.name
        code = """
if type(%s) == str:
    %s = json.loads(%s)
url1 = 'http://' + app.config['BEOPWEB_ADDR'] + '/analysis/model/execRelationAnalysis'
url2 = 'http://' + app.config['BEOPWEB_ADDR'] + '/analysis/model/get'
post_data = %s
variables = json.loads(HttpTestTool.postJsonWithCookie(url1, data=post_data, t=60))
variables = variables.get('R')
html = ''
for k, v in variables.items():
    html += '<tr><td>{0}</td><td>{1:.5f}</td></tr>'.format(k, v)
variables = '<table><thead><th>Variable</th><th>Correlation Coefficient</th></thead><tbody>{0}</tbody></table>'.format(html)
model = HttpTestTool.postJsonWithCookie(url2, data=post_data, t=60)
model = json.dumps({
    "data": json.loads(model),
    "params": %s
})
""" % (base_value_name, base_value_name, base_value_name, json.dumps(info, indent=4), str(points))
        code = re.sub(r'"\|@(.*?)@\|"', r'\g<1>["list"][0]["data"]', code)
        return code
