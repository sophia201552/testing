__author__ = 'win7'
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_task_group
from bson import ObjectId
from .Team import Team
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.User import User


class TaskGroup:
    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_task_group]

    def get_task_group_by_user_id(self, user_id):
        groups = self.db.find({'$or': [{"arch.members": user_id}, {'creator': user_id}]})
        return [item for item in groups]

    def save_task_group(self, data):
        group = self.db.save(data)
        return True if group else False

    def get_task_group_by_id(self, id):
        if not id or not ObjectId.is_valid(id):
            return None
        result = self.db.find_one({"_id": ObjectId(id)})
        if result:
            user = User()
            team_id = result.get("team_id")
            team = Team()
            util = Utils()

            creator_id = result.get("creator")
            result["creator"] = user.query_user_by_id(creator_id, 'userfullname', 'useremail', 'id', 'userpic')
            process = result.get("process")

            # process 获取当前任务组的process详情和process对于的arch所有的成员
            current_process, all_arch_member = team.get_process_and_all_archMembers_by_team_id_by_process_id_list(
                team_id, process)
            result["process"] = current_process
            result["archAll"] = all_arch_member

            # process member
            process = result.get("process")
            for key in process:
                nodes = key.get('nodes')
                for node in nodes:
                    member_list = util.user_id_list_to_detail(node.get("members"))
                    node["members"] = member_list

            # now arch members 获取当前任务组已经选择的arch member
            for arch_item in result.get('arch'):
                members = arch_item.get("members")
                if members:
                    member_list = util.user_id_list_to_detail(members)
                    arch_item["members"] = member_list
            result["_id"] = str(result.get('_id'))
            return result
        else:
            return None
