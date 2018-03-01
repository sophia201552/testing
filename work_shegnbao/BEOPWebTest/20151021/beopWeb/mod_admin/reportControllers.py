import os

from flask import request, Response, abort, url_for
import pdfkit

from beopWeb.mod_common.Utils import *
from beopWeb.mod_workflow.ReportEmailSetting import *
from beopWeb.mod_admin import bp_admin
from .Project import Project


@bp_admin.route('/getReportPDF', methods=['POST'])
def get_report_pdf():
    folder = request.get_json().get('folder')
    version = request.get_json().get('version')
    project_name = request.get_json().get('projectName')

    pdf_folder = 'beopWeb/static/projectReports/reports/' + project_name + '/' + folder
    pdf_filename = version + '.pdf'
    pdf_full_path = pdf_folder + '/' + pdf_filename
    if not os.path.exists(pdf_folder):
        return Utils.beop_response_error()

    if not os.path.exists(pdf_full_path):
        html = '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8"></head><body>' + request.get_json().get(
            'html') + '</body></html>'
        options = {
            'encoding': 'UTF-8',
            'print-media-type': '',
            'exclude-from-outline': ''
        }
        css = ['beopWeb/static/content/index.css', 'beopWeb/static/scripts/lib/bootstrap/css/bootstrap.css',
               'beopWeb/static/projectReports/report.css', 'beopWeb/static/projectReports/reportPDF.css']
        try:
            pdfkit.from_string(html, pdf_full_path, options=options, css=css)
        except Exception as e:
            logging.error(e)
    created_pdf = '/static/projectReports/reports/' + project_name + '/' + folder + '/' + pdf_filename

    file_list = os.listdir(pdf_folder)
    pdf_reports_map = {}
    for filename in file_list:
        if os.path.isfile(os.path.join(pdf_folder, filename)):
            if filename.endswith('.pdf'):
                pdf_path = '/static/projectReports/reports/' + project_name + '/' + folder + '/' + filename
                pdf_reports_map[os.path.splitext(filename)[0]] = pdf_path
    return Utils.beop_response_success({'createdPDF': created_pdf, 'pdfMap': pdf_reports_map})


@bp_admin.route('/getShareReportPDF', methods=['POST'])
def get_share_report_pdf():
    html = request.form.get('html')
    # import pdb; pdb.set_trace()
    css = ['beopWeb/static/scripts/lib/bootstrap/css/bootstrap.css', 'beopWeb/static/content/share-report-print.css']
    try:
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

    report_setting = ReportEmailSetting()
    report_setting_search = report_setting.get_all_settings_by_id(project_id)
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
        name = key.get('nickname')
        sex_number = key.get('sex')
        call = ''
        # 1 man 0 woman
        if sex_number == 1:
            call = '先生'
        elif sex_number == 0:
            call = '女士'
        # 得到 reportFolder List
        report_type = eval(key.get('reportSetting'))
        reporter_folder_list = []
        for reporter_folder in report_type:
            reporter_folder_list.append(reporter_folder.get("reportFolder"))

        # 从 summary_data 里面 得到正确的 reportFolde
        summary_report_folder = []
        for folder in reporter_folder_list:
            for summary_data_list in summary_data:
                report_name = summary_data_list.get("reportName")
                if report_name == folder:
                    summary_report_folder.append(summary_data_list)
        if not summary_report_folder:
            continue
        try:
            for mail in report_email_list:
                email_html = render_template('email/reportSummaryEmail.html', data=summary_report_folder,
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
@app.route('/report/getReport/<project_code>/<report_folder>/<report_name>/<user_id>')
def get_report(project_code, report_folder, report_name, user_id=0):
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
