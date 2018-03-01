# from beopWeb.MongoConnManager import MongoConnManager
# from beopWeb.BEOPMongoDataAccess import *
# from beopWeb.mod_workflow_process import *
#
# from bson import ObjectId
# import logging
#
#
# class Order:
#     _mongo_collection_order = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_order]
#
#     @classmethod
#     def new_order(cls, processId):
#         rt = ''
#         insert_data = {}
#         try:
#             if ObjectId.is_valid(processId):
#                 template_data = Process.workflowProcessGetTemplate(processId)
#                 if template_data:
#                     template_data.pop('_id')
#                 process_data = Process.workflowProcessGetById(processId)
#                 if process_data:
#                     process_data.pop('_id')
#                     if 'template_id' in process_data:
#                         process_data.pop('template_id')
#                     nodeslist = process_data.get('nodes')
#                     for item in nodeslist:
#                         item.update({'executorId': 0, 'note': ''})
#                 insert_data.update(
#                     {'process_id': ObjectId(processId), 'fields': template_data, 'process': process_data, 'status': -1,
#                      'node_index': 0})
#                 dbrv = Order._mongo_collection_order.update({'_id': ObjectId()}, {'$set': insert_data}, True)
#                 if dbrv.get('ok'):
#                     rt = dbrv.get('upserted').__str__()
#         except Exception as e:
#             print('new_order error:' + e.__str__())
#             logging.error('new_order error:' + e.__str__())
#         return rt
#
#     @classmethod
#     def order_action(cls, work_order_id, action, executorId, note, node_index):
#         # 0:running,1:finished,2:terminate
#         rt = True
#         node_index = int(node_index)
#         try:
#             if ObjectId.is_valid(work_order_id):
#                 ret = Order._mongo_collection_order.find_one({'_id': ObjectId(work_order_id)})
#                 if ret:
#                     status = ret.get('status')
#                     index = ret.get('node_index')
#                     if index != node_index:
#                         raise Exception('index error')
#                     process = ret.get('process')
#                     nodeList = []
#                     if process:
#                         nodeList = process.get('nodes')
#                     length = len(nodeList)
#                     if status < 1:
#                         if index < length and length > 0:
#
#                             if int(action) == ProcessAction.action_not_pass:
#                                 pass
#                             elif int(action) == ProcessAction.action_pass:
#                                 nodeList[index].update({'executorId': int(executorId), 'note': note})
#                                 if index < length - 1:
#                                     index += 1
#                                     status = 0
#                                 elif index == length - 1:
#                                     status = 1
#                             elif int(action) == ProcessAction.action_terminate:
#                                 nodeList[index].update({'executorId': int(executorId), 'note': note})
#                                 status = 2
#                         Order._mongo_collection_order.update({'_id': ObjectId(work_order_id)}, {
#                         '$set': {'status': status, 'node_index': index, 'process': process}})
#         except Exception as e:
#             rt = False
#             print('order_action error:' + e.__str__())
#             logging.error('order_action error:' + e.__str__())
#         return rt
#
#     @classmethod
#     def order_status(cls, orderId):
#         rt = {}
#         try:
#             if ObjectId.is_valid(orderId):
#                 ret = Order._mongo_collection_order.find_one({'_id': ObjectId(orderId)})
#                 if ret:
#                     ret.pop('_id')
#                     status = ret.get('status')
#                     index = ret.get('node_index')
#                     process = ret.get('process')
#                     nodeList = []
#                     if process:
#                         nodeList = process.get('nodes', [])
#                     length = len(nodeList)
#                     if index < length and length > 0:
#                         content = nodeList[index]
#                         rt = dict(content, status=status, index=index)
#         except Exception as e:
#             print('order_status error:' + e.__str__())
#             logging.error('order_status error:' + e.__str__())
#         return rt
