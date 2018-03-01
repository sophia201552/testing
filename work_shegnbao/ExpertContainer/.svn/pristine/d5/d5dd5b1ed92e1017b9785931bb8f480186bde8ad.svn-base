from ExpertContainer.api.utils import *
import logging

__author__ = 'tony'


class CrossClusterConsumer:
    def __init__(self, queue_name, worker_func, msg_to_skip):
        self._msg_to_skip = msg_to_skip
        self._queue_name = queue_name
        self._last_wait_seconds = 16
        self._worker_func = worker_func

    def callback(self, ch, method, __, body):
        try:
            if self._msg_to_skip > 0:
                logging.info("_msg_to_skip is %s, skipping %s", self._msg_to_skip, body)
                ch.basic_ack(delivery_tag=method.delivery_tag)
                self._msg_to_skip -= 1
            else:
                decoded_body = body.decode(encoding='utf-8')

                self._worker_func(decoded_body)

                ch.basic_ack(delivery_tag=method.delivery_tag)
                logging.info("msg %s consumed", body)
                self._last_wait_seconds = 16
        except:
            logging.error("Failed to perform request: %s.", body, exc_info=True, stack_info=True)
            ch.basic_reject(delivery_tag=method.delivery_tag, requeue=True)
            wait_seconds = self._last_wait_seconds * 2 if self._last_wait_seconds < 3600 else 3600
            logging.error("Message rejected. Sleep for %s seconds before next consumption.", wait_seconds)
            self._last_wait_seconds = wait_seconds
            time.sleep(wait_seconds)
        return True

    def run(self):
        while True:
            try:
                logging.info('******** %s Consumer Starting ********', self._queue_name)
                credentials = pika.PlainCredentials(app.config['MQ_USERNAME'], app.config['MQ_PASSWORD'])
                connection = pika.BlockingConnection(pika.ConnectionParameters(
                    host=app.config['MQ_ADDRESS'], credentials=credentials))
                channel = connection.channel()
                channel.queue_declare(queue=self._queue_name, durable=True)
                channel.basic_qos(prefetch_count=1)
                channel.basic_consume(self.callback, queue=self._queue_name)
                channel.start_consuming()
            except:
                logging.error('Failed to start consumer. Retry after 30 seconds.', exc_info=True, stack_info=True)
                time.sleep(30)

