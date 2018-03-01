''' 历史数据源 '''
from .ParamInput import ParamInput
from ....EnumBook import EnumModuleType

from .....Util import getCodeByTimeRange

class ParamInputHistoryDatasource(ParamInput):
    ''' 历史数据源输入类 '''
    def parse(self):
        if not self.refModuleId:
            #若有调试值，则优先使用
            if self.debugValue:
                return str(self.debugValue)
            else:
                value = self.getValue()
                options = self.getOptions()
                ds_options = options.get('dataSource', {})

                time_start = ds_options.get('startTime')
                time_end = ds_options.get('endTime')
                time_format = ds_options.get('timeFormat')

                arr = value.replace('|', '@').split('@')
                # 如果输入参数有配置，则使用输入参数的配置
                if time_start and time_end and time_format:
                    return 'get_his_data_with_time(%s, "%s", "%s", "%s", "%s")' % (
                        arr[1], arr[2], time_start, time_end, time_format)
                # 否则，如果是“相关性分析”或“预测”模块的输入，则使用模块的配置
                else:
                    module = self.module
                    module_type = module.store['type']
                    if module_type == EnumModuleType.CORRELATION_ANALYSIS.value or \
                        module_type == EnumModuleType.FORECAST.value:
                        time_range = module.store['option']['timeRange']
                        if time_range is None:
                            return 'None'
                        time_start, time_end, time_format = \
                            getCodeByTimeRange(time_range)
                        return 'get_his_data_with_time(%s, "%s", "%s", "%s", "%s")' % (
                            arr[1], arr[2], time_start, time_end, time_format)
