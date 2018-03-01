import logging
import json
from ExpertContainer import app
from CrossClusterConsumer import CrossClusterConsumer

__author__ = 'tony'


def consume_algo_notice(body):
    notice = json.loads(body)
    logging.info('algo notice consumed: %s', notice)


if __name__ == '__main__':
    consumer = CrossClusterConsumer(app.config.get('MQ_ALGO_CROSS_CLUSTER_NOTICE'), consume_algo_notice, 1)
    consumer.run()
