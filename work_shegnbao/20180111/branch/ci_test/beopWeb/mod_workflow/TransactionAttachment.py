'''
工单附件
'''

__author__ = 'Nomand'
from bson import ObjectId
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_task
from pymongo import ReturnDocument


class TransactionAttachment:
    default_attachment_item_model = {
        "userId": None,
        "fileName": None,
        "uploadTime": None,
        "uid": None
    }

    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_task]

    def add_upload_new_file(self, task_id, user_id, file_name, uid, time):
        '''
        添加工单附件

        :param task_id: 工单ID
        :param user_id: 用户ID
        :param file_name: 文件名称
        :param uid: 文件随机前缀, oss中文件名称包含文件前缀-文件名,防止上传覆盖
        :param time: 上传事件
        :return: True 上传成功; False 上传失败
        '''
        attachment_model = self.default_attachment_item_model.copy()
        attachment_model.update({
            "fileName": file_name,
            "userId": user_id,
            "uploadTime": time,
            "uid": uid
        })
        result = self.db.find_one_and_update({"_id": ObjectId(task_id)}, {"$push": {"attachment": attachment_model}},
                                             return_document=ReturnDocument.AFTER)
        return True if result else None

    def get_attachment_by_task_id(self, task_id):
        '''
        根据工单ID 获取附件列表

        :param task_id: 工单ID
        :return: 附件列表
        '''
        task = None
        if ObjectId.is_valid(task_id):
            task_id = ObjectId(task_id)
            task = self.db.find_one({"_id": task_id})
        return task.get('attachment', []) if task else []

    def delete_attachment(self, task_id, uid, file_name):
        '''
        删除工单附件

        :param task_id: 工单ID
        :param uid: 附件前缀
        :param file_name: 文件名称
        :return: mongodb操作结果
        '''
        task_id = task_id if isinstance(task_id, ObjectId) else ObjectId(task_id)
        current = self.db.find_one({"_id": task_id}, projection={'_id': False})
        new_attachment = current.get("attachment", [])
        for index, key in enumerate(new_attachment):
            if key.get("fileName") == file_name and str(key.get("uid")) == str(uid):
                del new_attachment[index]

        return self.db.find_one_and_update({"_id": task_id}, {"$set": {"attachment": new_attachment}},
                                           return_document=ReturnDocument.AFTER)
