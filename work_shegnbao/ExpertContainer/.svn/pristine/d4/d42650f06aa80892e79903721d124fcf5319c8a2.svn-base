#coding=utf-8
__author__ = 'angelia'

from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.mqAccess.MQManager import MQManager
import datetime
import pytest
#ack_recent_message

#check china
@pytest.mark.p0
def test_sys_get_mq_count():
    now_time = datetime.datetime.now()
    lb = LogicBase(49, now_time)
    assert lb, "create instance logic base failed"

    postData = {
        'name': 'test_sys_get_mq_count',
        'value':'test_mq'
    }
    mq_count_before = lb.sys_get_mq_count(postData.get('name'))
    r = MQManager.RabbitMqWorkQueueSend(postData.get('name'), postData.get('value'))
    mq_count = lb.sys_get_mq_count(postData.get('name'))
    assert mq_count == mq_count_before +1, "sys_get_mq_count error:only set one mq,but get %s" % (mq_count - mq_count_before)
    if r:
        lb.ack_recent_message(postData.get('name'))
        mq_count_later = lb.sys_get_mq_count(postData.get('name'))
        assert mq_count_later == mq_count_before, "sys_get_mq_count error:only delete one mq,but get %s" % (mq_count - mq_count_later)
    else:
        assert mq_count == mq_count_before, "sys_get_mq_count error:didn't add one quene,but get %s" % (mq_count)