__author__ = 'win7'

from beopWeb.mod_cxTool import bp_pointTool
from beopWeb.mod_cxTool.Cxtool_cfg import CxToolCfg
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.Project import Project


@bp_pointTool.route('/getCxToolServerConfig/<project_id>')
def cfg_get_server_config(project_id):
    ctc = CxToolCfg()
    host_port_config = ctc.get_config(project_id)

    if not host_port_config:
        return Utils.beop_response_error(
            msg='Can\' get the Cx-Server host information. please check the configuration.')
    p = Project()
    project = p.get_project_by_id(project_id)

    result = {
        'host': host_port_config,
        'projectName': project.get('name_cn')

    }
    return Utils.beop_response_success(result)
