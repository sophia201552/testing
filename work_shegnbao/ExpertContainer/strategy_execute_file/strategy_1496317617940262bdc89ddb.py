# -*- encoding=utf-8 -*-
from ExpertContainer.logic.StrategyBase import *
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.api.globalMapping import *
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.api.LogOperator import LogOperatorStrategy
_logger = LogOperatorStrategy()

class LogicAct(StrategyBase):

    def actlogic(self):
        rt = None
        try:
            rt = self.action()
        except Exception as e:
            _logger.writeLog(get_file_name(__file__), '%s:'%(get_current_func_name())+e.__str__(), True)
            rt = None
        return rt

    def m15129795595971496317617940262bdc89ddb(self):
        def main():
            try:
                _inputs = {}
                def fun149631762331526201ec6bab(): 
                    base_value,param_1,param_2,param_3 = self.get_his_data_with_time(72, 'RealTimeCoolingCOP_svr_dr', '2016-12-01 19:48:00', '2016-12-31 19:49:00', 'd1'),self.get_his_data_with_time(72, 'Ti9_dr', '2016-12-01 19:48:00', '2016-12-31 19:49:00', 'd1'),self.get_his_data_with_time(72, 'Ti11_dr', '2016-12-01 19:48:00', '2016-12-31 19:49:00', 'd1'),self.get_his_data_with_time(72, 'Ti13_dr', '2016-12-01 19:48:00', '2016-12-31 19:49:00', 'd1')
                    _inputs.update({
                        '1496318127831262754ec00a': param_1,
                        '14963181293232620b6b5546': param_2,
                        '14963176233152621042df42': base_value,
                        '1496318132962262573bdd0c': param_3
                    })
                    
                    if type(base_value) == str:
                        base_value = json.loads(base_value)
                    url1 = 'http://' + app.config['BEOPWEB_ADDR'] + '/analysis/model/execRelationAnalysis'
                    url2 = 'http://' + app.config['BEOPWEB_ADDR'] + '/analysis/model/get'
                    post_data = {
                        'y': base_value['list'][0]['data'],
                        'x': {
                            'x2': param_2['list'][0]['data'],
                            'x3': param_3['list'][0]['data'],
                            'x1': param_1['list'][0]['data']
                        }
                    }
                    variables = json.loads(HttpTestTool.postJsonWithCookie(url1, data=post_data, t=60))
                    variables = variables.get('R')
                    html = ''
                    for k, v in variables.items():
                        html += '<tr><td>{0}</td><td>{1:.5f}</td></tr>'.format(k, v)
                    variables = '<table><thead><th>Variable</th><th>Correlation Coefficient</th></thead><tbody>{0}</tbody></table>'.format(html)
                    model = HttpTestTool.postJsonWithCookie(url2, data=post_data, t=60)
                    model = json.dumps({
                        'data': json.loads(model),
                        'params': ['@72|Ti9_dr', '@72|Ti11_dr', '@72|Ti13_dr']
                    })
                    
                    return variables,model 
                var14963176233162629f574ca9,var14963176233162623ae50938 = fun149631762331526201ec6bab() 
                def fun14963977019232621cceb296(model): 
                    
                    url1 = 'http://' + app.config['BEOPWEB_ADDR'] + '/analysis/model/exec'
                    ref_data = json.loads(model)
                    model = ref_data['data']
                    post_data={
                        'modeltype': 'Line',
                        'x': {}
                    }
                    params = ref_data.get('params', [])
                    time_start, time_end, time_format = ('2017-05-01 18:01:00', '2017-05-31 18:02:00', 'd1')
                    
                    points = []
                    _proj_id = None
                    for i, param in enumerate(params):
                        arr = param.replace('|', '@').split('@')
                        points.append(arr[2])
                        if _proj_id == None:
                            _proj_id = int(arr[1])
                    
                    his_data = self.get_his_data_with_time(_proj_id, points, time_start, time_end, time_format)
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
                            
                    return result 
                var14963977019232629b02e858 = fun14963977019232621cceb296(var14963176233162623ae50938) 
                return {'rs': {'14963176233162629f574ca9': var14963176233162629f574ca9,'14963176233162623ae50938': var14963176233162623ae50938,'14963977019232629b02e858': var14963977019232629b02e858}, 'console': {}, 'watch': {}, 'input': json.dumps(_inputs)}
            except Exception as e:
                _logger.writeLog(get_file_name(__file__), '%s:'%(get_current_func_name())+e.__str__(), True)
                return {'msg':e.__str__(), 'error':1}
        return main()

    def action(self):
        rt = True
        try:
            rt = self.m15129795595971496317617940262bdc89ddb()
        except Exception as e:
            _logger.writeLog(get_file_name(__file__), '%s:'%(get_current_func_name())+e.__str__(), True)
            rt = {'msg':e.__str__(), 'error':1}
        return rt
