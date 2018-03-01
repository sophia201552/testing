__author__ = 'win7'
import os
import logging
import base64

from flask import request, render_template, make_response, send_file
import pdfkit

from beopWeb.mod_report import bp_report
from beopWeb.mod_common.Utils import Utils
from .Report import Report
from beopWeb.mod_admin.MenuConfigure import MenuConfigure
from .WordReport import WordReport
import re


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


@bp_report.route('/exportWord/', methods=['POST'])
def export_word():
    report_data = request.get_json()
    report = report_data.get('report')
    folder = report_data.get('folder')
    version = report_data.get('version')
    project_name = report_data.get('projectName')

    pdf_folder = 'beopWeb/static/projectReports/reports/' + project_name + '/' + folder
    pdf_filename = version + '.docx'
    pdf_full_path = pdf_folder + '/' + pdf_filename
    if not os.path.exists(pdf_folder):
        return Utils.beop_response_error()
    try:
        WordReport(report, version).save(pdf_full_path)
    except Exception as e:
        logging.error('word 报表下载出错:' + str(report_data) + '\n' + str(e))
        return Utils.beop_response_error()
    return Utils.beop_response_success(pdf_full_path[len('beopWeb'):])


@bp_report.route('/uploadChart/', methods=['POST'])
def upload_chart():
    report_data = request.get_json()
    key = report_data.get('key')
    chart = report_data.get('chart')
    try:
        chart = chart[len('data:image/png;base64,'):]
        with open(Utils.REPORT_UPLOAD_IMAGE_FOLDER + key + '.png', 'wb') as fp:
            fp.write(base64.decodestring(chart.encode()))
    except Exception as e:
        return Utils.beop_response_error(msg=str(e))

    return Utils.beop_response_success()


@bp_report.route('/getReportPDF', methods=['POST'])
def get_report_pdf():
    rq_data = request.get_json()
    folder = rq_data.get('folder')
    version = rq_data.get('version')
    project_name = rq_data.get('projectName')
    project_id = rq_data.get('projectId')
    cover_html = rq_data.get('cover')
    pdf_folder = 'beopWeb/static/projectReports/reports/' + project_name + '/' + folder
    pdf_filename = version + '.pdf'
    pdf_full_path = pdf_folder + '/' + pdf_filename
    if not os.path.exists(pdf_folder):
        return Utils.beop_response_error()

    if not os.path.exists(pdf_full_path):
        html = rq_data.get('html')
        css = ['beopWeb/static/scripts/lib/bootstrap/css/bootstrap.css', 'beopWeb/static/projectReports/reportPDF.css']
        if rq_data.get('skin') == 'dark':
            css.append('beopWeb/static/content/index-black.css')

        try:
            def repl(match_obj):
                if match_obj.group(1):
                    image_path = 'beopWeb' + match_obj.group(1)
                    with open(image_path, 'rb') as image:
                        encode_str = base64.b64encode(image.read())
                        return '<img class="chartImage" src="data:image/png;base64,' + encode_str.decode() + '"'

            html = re.sub(r'<img[^>]+img-src="(\S+)"', repl, html)
            if cover_html:
                temp_cover_file_path = Utils.get_pdf_cover_temp_path()
                with open(temp_cover_file_path, 'w', encoding='utf-8') as f:
                    f.write(cover_html)
                pdfkit.from_string(html, pdf_full_path, css=css, cover=temp_cover_file_path)
                os.remove(temp_cover_file_path)
            else:
                pdfkit.from_string(html, pdf_full_path, css=css)
        except Exception as e:
            logging.error(e)

        # 删除上传的文件
        try:
            image_folder = 'beopWeb/static/projectReports/reports/'
            image_list = os.listdir(image_folder)
            for name in image_list:
                if name.startswith(str(project_id) + str(folder) + str(version)):
                    os.remove(image_folder + name)
        except:
            pass

    created_pdf = '/static/projectReports/reports/' + project_name + '/' + folder + '/' + pdf_filename

    file_list = os.listdir(pdf_folder)
    pdf_reports_map = {}
    for filename in file_list:
        if os.path.isfile(os.path.join(pdf_folder, filename)):
            if filename.endswith('.pdf'):
                pdf_path = '/static/projectReports/reports/' + project_name + '/' + folder + '/' + filename
                pdf_reports_map[os.path.splitext(filename)[0]] = pdf_path
    return Utils.beop_response_success({'createdPDF': created_pdf, 'pdfMap': pdf_reports_map})


@bp_report.route('/projectReports/downloadHTML/<projName>/<folderName>/<reportName>')
def download_report_HTML(projName, folderName, reportName):
    try:
        path = os.getcwd() + "/beopWeb/static/projectReports/reports/" + str(projName)
        if os.path.exists(path):
            path = path + '/' + str(folderName)
            if os.path.exists(path):
                reportName = reportName + '.html'
                path = path + '/' + reportName
                if os.path.exists(path):
                    rt = make_response(send_file(path))
                    rt.headers["Content-Disposition"] = "attachment; filename=%s;" % reportName
                    return rt
                else:
                    msg = 'No file'
            else:
                msg = 'No file'
        else:
            msg = 'No file'
    except Exception as e:
        print('download_report_HTML error:' + e.__str__())
        logging.error(e.__str__())
        msg = e.__str__()
    return Utils.beop_response_error(msg=msg)
