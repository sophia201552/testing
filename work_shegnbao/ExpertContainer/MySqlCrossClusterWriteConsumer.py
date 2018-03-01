import json
from ExpertContainer import app
from CrossClusterConsumer import CrossClusterConsumer
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess

"""
For write actions to tables to be replicated across all clusters, BeopWeb & BeopService will 
execute the write actions on MySQL server in local cluster first, then wrap the actions to other clusters
as MQ messages and enqueue into MySqlCrossClusterWrite queue.
This consumer is to consume cross-cluster MySQL write actions from MySqlCrossClusterWrite MQ.
"""
__author__ = 'tony'


def consume_mysql_write(body):
    # Still don't know how \\u00a0 is generated
    body = body.replace('\\u00a0', ' ')
    # Hack: sometimes the SQL contains words like doesn't but the apostrophy is not well-encoded
    body = body.replace('doesn\'t', 'doesn\'\'t')
    write_action = json.loads(body)
    BEOPDataAccess.getInstance().crossClusterUpdate(write_action)


if __name__ == '__main__':
    consumer = CrossClusterConsumer(app.config.get('MQ_MYSQL_CROSS_CLUSTER_WRITE'), consume_mysql_write, 0)
    consumer.run()
