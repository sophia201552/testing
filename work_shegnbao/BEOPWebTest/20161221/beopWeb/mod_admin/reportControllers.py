import os

from flask import request, abort
import pdfkit

from beopWeb.mod_common.Utils import *
from beopWeb.mod_admin import bp_admin
from .Project import Project


@bp_admin.route('/getShareReportPDF', methods=['POST'])
def get_share_report_pdf():
    html = request.form.get('html')
    skin = request.form.get('skin')
    # import pdb; pdb.set_trace()
    css = ['beopWeb/static/scripts/lib/bootstrap/css/bootstrap.css', 'beopWeb/static/content/share-report-print.css']
    if skin == 'dark':
        css.append('beopWeb/static/content/index-black.css')
    try:
        output = pdfkit.from_string(html, False, css=css)
        return Response(output, mimetype='application/pdf')
    except Exception as e:
        logging.error(e)
        return '生成 pdf 出错，请稍后再试'


@bp_admin.route('/getShareReportWrapPDF', methods=['POST'])
def get_share_reportWrap_pdf():
    html = request.form.get('html')
    skin = request.form.get('skin')
    cover_html = request.form.get('cover')
    css = ['beopWeb/static/scripts/lib/bootstrap/css/bootstrap.css']
    if skin == 'dark':
        css.append('beopWeb/static/content/index-black.css')
    try:
        if cover_html:
            temp_cover_file_path = Utils.get_pdf_cover_temp_path()
            with open(temp_cover_file_path, 'w', encoding='utf-8') as f:
                f.write(cover_html)
            output = pdfkit.from_string(html, False, css=css, cover=temp_cover_file_path)
            os.remove(temp_cover_file_path)
        else:
            output = pdfkit.from_string(html, False, css=css)
        return Response(output, mimetype='application/pdf')
    except Exception as e:
        logging.error(e)
        return '生成 pdf 出错，请稍后再试'


@bp_admin.route('/sendReportEmail', methods=['POST'])
def send_report_email():
    rq_data = request.get_json()
    report_data = rq_data.get('reportData')
    subject = rq_data.get('subject', 'RNB tech: new report email')
    recipients = rq_data.get('recipients')

    try:
        email_html = render_template('email/reportEmail.html', data=report_data)
        result = Utils.EmailTool.send_email(subject, recipients, email_html)
        if result:
            return Utils.beop_response_success()
        else:
            return Utils.beop_response_error()

    except Exception as e:
        return Utils.beop_response_error(e)


@bp_admin.route('/sendReportSummaryEmail', methods=['POST'])
def send_report_summary_email():
    rq_data = request.get_json()
    summary_data = rq_data.get('reportSummaryData')
    subject = rq_data.get('subject', 'RNB tech: new report email')
    recipients = rq_data.get('recipients')
    version = rq_data.get('version')
    project_id = rq_data.get('projectId')
    project_db = Project()
    project = project_db.get_project_by_id(project_id, 'name_cn')
    date_str = version
    version_list = date_str.split('-')
    if len(version_list) == 2:
        date_str = version_list[0] + '年' + version_list[1] + '月'
    elif len(version_list) == 3:
        date_str = version_list[0] + '年' + version_list[1] + '月' + version_list[2] + '日'
    from beopWeb.mod_workflow.ReportEmailUser import ReportEmailUser

    reu = ReportEmailUser()
    report_setting_search = reu.get_all_settings_by_id(project_id)
    if not report_setting_search:
        return Utils.beop_response_error(msg='can not find project ' + str(project_id) + ' report mail settings')
    for key in report_setting_search:
        report_email_list = []
        email1 = key.get('mail1')
        email2 = key.get('mail2')
        email3 = key.get('mail3')
        if email1:
            report_email_list.append(email1)
        if email2:
            report_email_list.append(email2)
        if email3:
            report_email_list.append(email3)
        name = key.get('name')
        try:
            sex_number = int(key.get('sex'))
        except Exception:
            sex_number = -1
        # 1 man 0 woman 2 Unknown
        if sex_number == 1:
            call = '先生'
        elif sex_number == 0:
            call = '女士'
        else:
            call = ''
        try:
            for mail in report_email_list:
                if mail is None or not mail:
                    continue
                else:
                    email_html = render_template('email/reportSummaryEmail.html', data=summary_data,
                                                 version=date_str,
                                                 company=project.get('name_cn'),
                                                 name=name,
                                                 sex=call,
                                                 report_type=rq_data.get('reportType'),
                                                 report_title=rq_data.get('reportTitle', '运营'),
                                                 domain=app.config.get('SITE_DOMAIN'))

                Utils.EmailTool.send_email(subject, mail, email_html)

        except Exception as e:
            return Utils.beop_response_error(e)
    return Utils.beop_response_success()


@app.route('/report/getReport/<project_code>/<report_folder>/<report_name>')
def get_report(project_code, report_folder, report_name):
    if project_code is None or report_folder is None or report_name is None:
        abort(404)
    report_path = 'projectReports/reports/' + project_code + '/' + report_folder + '/' + report_name + '.html'
    report_path_from_root = 'beopWeb/static/' + report_path
    if os.path.exists(report_path_from_root):
        return app.send_static_file(report_path)
    else:
        abort(404)


@app.route('/report/getReportList/<project_code>/<report_folder>/<report_name>')
def get_report_list(project_code, report_folder, report_name):
    if project_code is None or report_folder is None or report_name is None:
        return Utils.beop_response_error()
    report_path_from_root = 'beopWeb/static/' + 'projectReports/reports/' \
                            + project_code + '/' + report_folder + '/' + report_name + '.html'
    report_folder_path = os.path.dirname(report_path_from_root)
    html_reports = []
    pdf_reports_map = {}
    if os.path.exists(report_folder_path):
        file_list = os.listdir(report_folder_path)
        for filename in file_list:
            if os.path.isfile(os.path.join(report_folder_path, filename)):
                if filename.endswith('.html'):
                    html_reports.append(os.path.splitext(filename)[0])
                elif filename.endswith('.pdf'):
                    pdf_path = '/static/projectReports/reports/' + project_code + '/' + report_folder + '/' + filename
                    pdf_reports_map[os.path.splitext(filename)[0]] = pdf_path

    return Utils.beop_response_success({'htmlReport': html_reports, 'pdfReportMap': pdf_reports_map})


@app.route('/report/delReportPDF/<project_id>/<report_folder>/<report_name>/<user_id>')
def del_report_pdf(project_id, report_folder, report_name, user_id):
    if not user_id or not project_id or not report_folder or not report_name:
        return Utils.beop_response_error(msg='缺少参数')
    project = Project()
    project_result = project.get_project_by_id(project_id, ('name_en',))
    project_code = project_result.get('name_en')
    if not project_code:
        return Utils.beop_response_error(msg='项目不存在')

    report_path = 'projectReports/reports/' + project_code + '/' + report_folder + '/' + report_name + '.pdf'
    report_path_from_root = 'beopWeb/static/' + report_path
    if os.path.exists(report_path_from_root):
        os.remove(report_path_from_root)
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@app.route('/report_detail/<project_id>/<report_folder>/<version>')
def report_detail(project_id, report_folder, version):
    project = Project().get_project_by_id(project_id, ['name_en', 'name_cn'])
    report_path = 'beopWeb/static/projectReports/reports/{project}/{folder}/{version}.html'.format(
        project=project.get('name_en'),
        folder=report_folder,
        version=version)

    report_detail = ''
    with open(report_path, encoding='utf-8') as file:
        report_detail = file.read()
    return render_template('report/template_report_detail.html', report_detail=report_detail)
