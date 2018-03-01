import logging
from bson import ObjectId
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_message_user
from beopWeb.mod_admin.Project import Project
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_workflow.Team import Team


class Message_type:
    NotRead = "notRead"
    Read = "read"
    All = "all"


class Message_model:
    DocumentModel = {
        "userId": None,
        "msgId": None,
        "isRead": None,  # 0 未读 消息 1 已读消息
        "tags": []
    }


class MessageUser:
    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_message_user]

    # 给多个用户添加消息-基类
    # 添加消息统一用这个方法
    def __add_many_user_message(self, user_id_list, msg_id, tags=None, project_id=None):
        if not isinstance(user_id_list, list):
            user_id_list = [user_id_list]

        if not isinstance(msg_id, ObjectId):
            msg_id = ObjectId(msg_id)

        user_id_list = list(set(user_id_list))
        for user_id in user_id_list:
            if user_id:
                self.__add_user_message(user_id, msg_id, tags=tags, project_id=project_id)
        return True

    # 给单个用户添加用户消息
    def __add_user_message(self, user_id, msg_id, tags=None, project_id=None):
        document = Message_model.DocumentModel.copy()
        document.update({
            "userId": int(user_id),
            "msgId": msg_id,
            "isRead": 0,
            "tags": tags if tags else []
        })

        if project_id:
            document.update({
                "_projectId": project_id
            })

        rv = self.db.insert_one(document)
        return rv.inserted_id if rv else False

    # ---------------------------------------------------------------------------
    # EXPORTS METHODS
    # 特殊
    def add_many_user_message(self, user_id_list, msg_id, tags):
        if not isinstance(user_id_list, list):
            user_id_list = [user_id_list]

        if not isinstance(msg_id, ObjectId):
            msg_id = ObjectId(msg_id)

        for user_id in user_id_list:
            self.__add_user_message(user_id, msg_id, tags=tags)
        return True

    # 添加多个种类的工单消息，tags控制在这里，而不是外部
    def add_workflow_users_message(self, user_id_list, msg_id):
        return self.__add_many_user_message(user_id_list, msg_id, tags=["workflow", "activity"])

    # 添加诊断消息
    def add_diagnosis_user_message(self, user_id_list, msg_id, project_id):
        return self.__add_many_user_message(user_id_list, msg_id, tags=["diagnosis"], project_id=project_id)

    # 添加版本消息
    def add_version_history_user_message(self, user_id_list, msg_id):
        return self.__add_many_user_message(user_id_list, msg_id, tags=["versionHistory"])

    # 给一个项目发消息
    def add_project_users_message(self, project_id, msg_id):
        user_id_list = Project.get_all_user_id_list_by_project_id(project_id)
        if user_id_list:
            self.__add_many_user_message(user_id_list, msg_id, tags=["project"])
        return True

    # 给一个团队发送消息
    def add_team_users_message(self, team_id, msg_id):
        team = Team()
        team_id_list = team.get_team_all_user_id_list_by_team_id(team_id)
        if team_id_list:
            self.__add_many_user_message(team_id_list, msg_id, tags=["team"])
        return True

    # 给团队下的一个用户组添加消息
    def add_team_arch_users_message(self, arch_id, msg_id):
        pass

    # 给任务组下的一个用户组添加消息
    def add_group_arch_users_message(self, arch_id, msg_id):
        pass

    # 更新单个用户已读某条消息
    def mark_message_read(self, user_id, msg_user_id_list):
        msg_user_id_list = [ObjectId(item) if not isinstance(item, ObjectId) else item for item in msg_user_id_list]

        for msg_id in msg_user_id_list:
            self.db.update({"userId": user_id, "_id": msg_id},
                           {"$set": {"isRead": 1}})
        return True

    # 把全部消息已读
    def mark_all_message_read(self, user_id):
        self.db.update({"userId": user_id}, {"$set": {"isRead": 1}}, multi=True)

    # 删除某用户单条消息
    def delete_user_one_msg(self, user_id, msg_id):
        msg_id = Utils.get_object_id(msg_id)
        rv = self.db.find_one_and_delete({"userId": user_id, "_id": msg_id})
        return True if rv else False

    # 删除用户消息列表
    def delete_user_msg_by_msg_id_list(self, user_id, msg_id_list):
        for msg_id in msg_id_list:
            self.delete_user_one_msg(user_id, msg_id)
        return True

    # 删除某用户全部消息
    def delete_user_all_msg(self, user_id):
        rv = self.db.find_one_and_delete({"userId": user_id})
        logging.WARNING("删除用户id为%s的全部消息" % (user_id))
        return True if rv else False

    # 查看用户所有的消息
    # msg_type 见上面的 Message_type
    def query_user_msgId_list(self, user_id, page_size, page_num, msg_type=Message_type.All,
                              is_list_today_task=False, tags=None):
        db_query = {"userId": user_id}

        if tags:
            if tags == Message_type.All:
                pass
            else:
                db_query["tags"] = {"$in": tags if isinstance(tags, list) else [tags]}

        all_msg_id_list_count = 0
        msg_id_list = []

        # 如果是 listTodayTask的时候不需要进行分页处理
        if is_list_today_task:
            db_query["isRead"] = 0
        else:
            try:
                page_num = int(page_num)
                page_size = int(page_size)
            except Exception as e:
                return [], 0

            start_num = (page_num - 1) * page_size
            end_num = page_size + (page_num - 1) * page_size

            # 1、如果是只查询未读消息
            if msg_type == Message_type.NotRead:
                db_query["isRead"] = 0

            # 2、如果是只查询已读消息
            elif msg_type == Message_type.Read:
                db_query["isRead"] = 1

            # 3、如果是查询全部的消息
            elif msg_type == Message_type.All:
                pass

            # 3、如果查询不合法，默认返回全部的消息
            else:
                pass

        rv = self.db.find(db_query)

        if rv:
            message_list = [item for item in rv]
            message_list.sort(key=lambda m: m.get('msgId'), reverse=True)

            all_msg_id_list_count = len(message_list)

            if is_list_today_task:
                msg_id_list = message_list
            else:
                msg_id_list = message_list[start_num:end_num]

            return msg_id_list, all_msg_id_list_count
        else:
            return msg_id_list, all_msg_id_list_count
