from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_message
from .messageUser import MessageUser
from bson import ObjectId
from beopWeb.mod_admin import User


class Message:
    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_message]

    def add_message_with_return_id(self, message):
        result = self.db.insert_one(message)
        if result:
            return result.inserted_id
        else:
            return False

    def get_user_latest_message(self, use_id, limit=20, page=1):
        result = []
        mu = MessageUser()
        user = User()

        msg_list = mu.get_user_msgId_list(use_id, limit, page)
        for msg_item in msg_list:
            message = self.db.find_one({"_id": ObjectId(msg_item.get("msgId"))})

            # sender
            sender = message.get("sender")
            type = str(sender.get("type"))
            if type == '1':
                sender_id = sender.get("id")
                sender["userInfo"] = user.query_user_by_id(sender_id, 'userfullname', 'useremail', 'userpic', 'id')

            # comments
            comments = message.get("comments")
            for comment_item in comments:
                comment_id = comment_item.get("user")
                if comment_id:
                    comment_item["userInfo"] = user.query_user_by_id(comment_id, 'userfullname', 'useremail', 'userpic',
                                                                     'id')
            msg_item["message"] = message
            result.append(msg_item)
        return result
