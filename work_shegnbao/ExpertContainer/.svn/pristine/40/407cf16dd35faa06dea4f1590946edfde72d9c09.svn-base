# -*- encoding=utf-8 -*-
''' 策略组态专用 api '''
from .LogicBase import *

class StrategyBase(LogicBase):
    ''' 策略组态专用 api '''
    def get_his_data_with_time(self, proj_id, point_list,
                               t_start, t_end, time_format):
        ''' 获取历史数据，并返回相应的时间数据 '''
        result = {'list': [], 'timeShaft': []}
        try:
            if isinstance(point_list, str):
                point_list = [point_list]
            his = self.get_data_time_range(proj_id, point_list, t_start, t_end, time_format)
            if his:
                for idx, item in enumerate(his):
                    temp = []
                    if 'error' in item:
                        result = None
                    else:
                        if 'history' in item:
                            history = item.get('history', [])
                            name = item.get('name')
                            if history:
                                for i in history:
                                    temp.append(float(i.get('value')))
                                    if idx == 0:
                                        result['timeShaft'].append(i.get('time'))
                                result['list'].append({'dsItemId': name, 'data': temp})
                            else:
                                result['list'].append({'dsItemId': name, 'data': []})
        except Exception as e:
            self.writeFileLog(proj_id, '%s:' % (get_current_func_name()) + e.__str__())
        return result
