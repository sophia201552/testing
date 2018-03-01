from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_workflow import bp_workflow
from beopWeb.AuthManager import AuthManager
from beopWeb.mod_workflow.Team import Team

# 获取项目标签列表
@bp_workflow.route('/tags/', methods=['GET'])
def get_tags():
    user_id = AuthManager.get_userId()
    team = Team()
    found_team = team.get_team_by_user_id(user_id)
    return Utils.beop_response_success(found_team.get('tags'))
