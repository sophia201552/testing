from beopWeb.mod_admin import bp_admin
from flask import request
from .MenuConfigure import MenuConfigure
from beopWeb.mod_common.Utils import *

# 加载benchmark配置页面
@bp_admin.route('/benchmarkConfigure', methods=['POST'])
def benchmark_configure():
    mc = MenuConfigure()
    benchmark = mc.get_benchmark_model()
    return Utils.beop_response_success(benchmark)


# 保存benchmark配置页面
@bp_admin.route('/benchmarkEdit', methods=['POST'])
def benchmark_edit():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    menu = rq_data.get('menu')
    mc = MenuConfigure()
    success, latest_data = mc.save_benchmark_model(menu.get('nav'))
    if success:
        return Utils.beop_response_success(latest_data, '2002')
    else:
        return Utils.beop_response_error(latest_data, '1004')


# 加载项目benchmark配置页面
@bp_admin.route('/loadBenchmarkMenu', methods=['POST'])
def load_benchmark_menu():
    rq_data = request.get_json()
    project_id = rq_data.get('projectId')
    mc = MenuConfigure()
    menu_model = mc.get_benchmark_menu_edit_model(project_id)
    return Utils.beop_response_success(menu_model)
