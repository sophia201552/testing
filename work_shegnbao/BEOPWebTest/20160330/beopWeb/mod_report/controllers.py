__author__ = 'win7'
from flask import request, render_template

from beopWeb.mod_report import bp_report
from beopWeb.mod_common.Utils import Utils
from .Report import Report
from beopWeb.mod_admin.MenuConfigure import MenuConfigure


@bp_report.route('/getReportMenu/<project_id>/', methods=['GET'])
def get_report_menu(project_id):
    reports = MenuConfigure().get_project_nav_list(project_id, 'ReportScreen')
    report_db = Report()
    for report_info in reports:
        report_structure = report_db.get_report_structure(project_id, report_info.get('reportFolder'))
        if report_structure:
            report_json_data = report_structure.get('data')
            for item in report_json_data:
                for unit in item.get('units'):
                    del unit['subUnits']
        report_info['_id'] = str(report_info['_id'])
        report_info['structure'] = report_structure
    return Utils.beop_response_success(reports)


@bp_report.route('/storeLatestReportData/<project_id>/<folder>/', methods=['POST'])
def store_latest_report_data(project_id, folder):
    report_data = request.get_json()
    old_report_data = Report().insert_or_update_report_data(project_id, folder, report_data)
    return Utils.beop_response_success(str(old_report_data))


@bp_report.route('/getReportHtml/', methods=['POST'])
def get_report_html():
    report_data = request.get_json()
    project_id = report_data.get('projectId')
    menu_id = report_data.get('menuId')
    chapter = report_data.get('chapter')
    unit_name = report_data.get('unit')

    report_db = Report()

    report_result_data = report_db.get_report_data(project_id, menu_id, chapter=chapter, unit=unit_name)
    if not report_result_data:
        return Utils.beop_response_error(msg='can not find the report detail')
    return Utils.beop_response_success(
        render_template('report/template_dashboard.html', report=report_result_data))
