# -*- encoding=utf-8 -*-
__author__ = 'yan'

import sys
sys.path.append("..")
from ExpertContainer.api.utils import *
from ExpertContainer.api.LogOperatorListen import LogOperatorListenStrategy
from ExpertContainer.dbAccess.RedisManager import RedisManager
import socket, re
import traceback
import sys, time, threading
from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.api.cacheProfile import DataManager

_logger = None
strProcessName = 'StrategyConsumer_1'

def generate_file_strategy(projId, item_name, module_name, code, input=None, output=None):#todo
    path = get_strategy_file_path()
    add_head_strategy(os.path.join(path, item_name+'.py'))
    add_body_strategy(os.path.join(path, item_name+'.py'), code, module_name, 293)#todo
    add_action_strategy(os.path.join(path, item_name+'.py'), [module_name])
    return True

def callback(ch, method, properties, body):
    try:
        msgb = body.decode(encoding='utf-8')
        msg = json.loads(msgb)
        if msg:
            for key_item, value_item in msg.items():
                item_name = 'strategy_' + key_item
                for key_module, value_module in value_item.items():
                    module_name = 'strategy_' + key_module
                    code = value_module.get('code')
                    input = value_module.get('input')
                    output = value_module.get('output')
                    if input:
                        for ds_alias in input:
                            for item in mapping_list:
                                if item.get('add_id') == 1:
                                    name = item.get('name')
                                    name = name.strip()
                                    ru = "%s\([ ]*\'%s\'"%(name, ds_alias)
                                    m = re.search(ru, code)
                                    if m:
                                        code = code.replace("'%s'"%(ds_alias), "%s,'%s'"%(input.get(ds_alias).get('projId'), input.get(ds_alias).get('value')))
                    if generate_file_strategy(item_name, module_name, input, output, code):
                        import_string = 'strategy.strategy_execute_file.%s' % (item_name)
                        __import__(import_string)
                        ins = None
                        attr = getattr(sys.modules[import_string], 'LogicAct')
                        if attr:
                            ins = attr(293, datetime.now(), None, LogicBase.REALTIME)#todo
                            allSitePointsValues = DataManager.set_realdata_flag_0(293)#todo
                            cloudSitePointsAll = mongo_operator.getCloudPointSiteType(293)#todo
                            ins.initCloudSitePoints(cloudSitePointsAll)
                            ins.initDataCacheByValueLists(allSitePointsValues)
                        else:
                            raise Exception('Load module %s failed' % (import_string,))
                        ins.before_actlogic_diagnosis()
                        ins.actlogic()
                        ins.after_actlogic()
                        if import_string in sys.modules:
                            sys.modules.pop(import_string)
                        if ins:
                            del ins
    except Exception as e:
        _logger.writeLog('%s:' % (
        get_current_func_name()) + 'callback exception[%s]:'%(str(msg)) + e.__str__(), True)
    finally:
        ch.basic_ack(delivery_tag = method.delivery_tag)
        return True
    return True

def runConsume():
    try:
        _logger.writeLog('%s:'%(get_current_func_name())+'strategy consumer start',True)
        credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'],credentials = credentials))
        channel = connection.channel()
        channel.queue_declare(queue='strategy_queue', durable=True)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(callback, queue='strategy_queue')
        channel.start_consuming()
    except Exception as e:
        _logger.writeLog('exception occurs:'+e.__str__(), True)
        traceback.print_stack()

def heartbeat_router(name):
    try:
        while True:
            now_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            RedisManager.set_heartbeat_time(name, now_time)
            time.sleep(10)
    except Exception as e:
        print(e)

if __name__ == '__main__':
    strProcessName = sys.argv[1] if len(sys.argv) > 1 else 'StrategyConsumer_1'
    myname = socket.getfqdn(socket.gethostname())
    _logger = LogOperatorListenStrategy(strProcessName+'_'+myname)
    t = threading.Thread(target=heartbeat_router, args=(strProcessName, ), name='heartbeat_strategy_consumer', daemon=True)
    t.start()
    runConsume()