from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_message_user
from bson import ObjectId


class MessageUser:
    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_message_user]

    # 更新单个用户已读某条消息
    def mark_message_read(self, user_id, msg_id):
        result = self.db.update_one({"user_id": user_id, "message.msgId": ObjectId(msg_id)},
                                    {"$set": {"message.$.isRead": 1}})
        return True if result.modified_count == 1 else False

    # 给单个用户添加用户消息
    def add_user_message(self, user_id, msg_id):
        self.db.find_one_and_update({"user_id": user_id},
                                    {"$push": {"message": {"msgId": ObjectId(msg_id), "isRead": 0}}},
                                    upsert=True)

    # 给多个用户添加用户消息
    def add_user_group_message(self, user_list, msg_id):
        if user_list and len(user_list):
            for user_id in user_list:
                self.add_user_message(user_id, msg_id)

    # 把全部消息已读
    def mark_all_message_read(self, user_id):
        return self.db.update_one({"user_id": user_id}, {"$set": {"message.$.isRead": 1}})

    # 删除所有用户中某条消息
    def remove_msg(self, msg_id):
        pass

    # 删除用户某消息
    def remove_user_msg(self, user_id, msg_id):
        pass

    # 删除某用户全部消息
    def clear_user_msg(self, user_id):
        pass

    # 查看用户所有的消息
    def get_user_msgId_list(self, user_id, limit, page):
        data = self.db.find_one({"user_id": user_id})
        result = []
        if data:
            message_list = data.get("message")
            for message_item in message_list[(page - 1) * limit:limit]:
                result.append(message_item)
        else:
            result = []
        return result
