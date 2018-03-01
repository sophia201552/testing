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
        #task_id = task_id if isinstance(task_id, ObjectId) else ObjectId(task_id)
        task = None
        if ObjectId.is_valid(task_id):
            task_id = ObjectId(task_id)
            task = self.db.find_one({"_id": task_id})
        return task.get('attachment', []) if task else []

    def delete_attachment(self, task_id, uid, file_name):
        task_id = task_id if isinstance(task_id, ObjectId) else ObjectId(task_id)
        current = self.db.find_one({"_id": task_id}, projection={'_id': False})
        new_attachment = current.get("attachment", [])
        for index, key in enumerate(new_attachment):
            if key.get("fileName") == file_name and str(key.get("uid")) == str(uid):
                del new_attachment[index]

        return self.db.find_one_and_update({"_id": task_id}, {"$set": {"attachment": new_attachment}},
                                           return_document=ReturnDocument.AFTER)

    def is_user_hasOwn_file(self, user_id, task_id, file_name, file_uid):
        task_id = task_id if isinstance(task_id, ObjectId) else ObjectId(task_id)
        result = self.db.find(
                {"$and": [{"_id": task_id}, {"attachment.userId": user_id}, {"attachment.name": file_name},
                          {"attachment.uid": file_uid}]})
        return [item for item in result] if result else []
