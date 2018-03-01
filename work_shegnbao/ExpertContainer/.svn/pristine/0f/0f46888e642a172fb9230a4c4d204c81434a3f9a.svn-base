__author__ = 'yan'

from ExpertContainer.api.utils import *
from ExpertContainer.calculation.MsgClearListenThread import MsgClearListenThread


def startThreadQueueListner():
    try:
        thread = MsgClearListenThread("ClearQueueReal", app.config['MQ_RECEIVE_TRIGGER_NAME'])
        thread.setDaemon(False)
        thread.start()

        threadClearRepair = MsgClearListenThread("ClearQueueRepair", app.config['MQ_RECEIVE_PATCH_NAME'])
        threadClearRepair.setDaemon(False)
        threadClearRepair.start()
        logging.info('====== 计算点队列监听线程启动 ======')
    except Exception:
        logging.error('====== 计算点队列监听线程发生异常 ======', exc_info=True, stack_info=True)


if __name__ == '__main__':
    startThreadQueueListner()
