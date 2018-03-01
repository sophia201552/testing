import os

from flask import request, abort
import pdfkit
import xlsxwriter
from io import BytesIO

from beopWeb.mod_common.Utils import *
from beopWeb.mod_admin import bp_admin
from beopWeb.models import ExcelFile
from flask import request, json, jsonify, make_response, send_file
from .Project import Project


@bp_admin.route('/getShareReportPDF', methods=['POST'])
def get_share_report_pdf():
    html = request.form.get('html')
    skin = request.form.get('skin')
    # import pdb; pdb.set_trace()
    return do_get_share_report_pdf(html,skin)

def do_get_share_report_pdf(html,skin):
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
    return do_get_share_reportWrap_pdf(html, skin, cover_html)

def do_get_share_reportWrap_pdf(html,skin,cover_html):
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
    """
    发送报表邮件
    :return:
    """
    rq_data = request.get_json()
    return do_send_report_email(rq_data)


def do_send_report_email(rq_data):
    report_data = rq_data.get('reportData')
    subject = rq_data.get('subject', 'RNB tech: new report email')
    recipients = rq_data.get('recipients')
    trackingId = rq_data.get('trackingId')

    try:
        # This email template is only for Chinese
        email_html = render_template('email/reportEmail.html', data=report_data)
        result = Utils.EmailTool.send_email(subject, recipients, email_html, trackingId=trackingId)
        if result:
            return Utils.beop_response_success()
        else:
            return Utils.beop_response_error()

    except Exception as e:
        return Utils.beop_response_error(e)


@bp_admin.route('/sendReportSummaryEmail', methods=['POST'])
def send_report_summary_email():
    """
    发送报表摘要邮件
    :return:
    """
    rq_data = request.get_json()
    summary_data = rq_data.get('reportSummaryData')
    subject = rq_data.get('subject', 'RNB tech: new report email')
    recipients = rq_data.get('recipients')
    version = rq_data.get('version')
    project_id = rq_data.get('projectId')
    tracking_id = rq_data.get('trackingId')
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
                    # This email template is only for Chinese
                    email_html = render_template('email/reportSummaryEmail.html', data=summary_data,
                                                 version=date_str,
                                                 company=project.get('name_cn'),
                                                 name=name,
                                                 sex=call,
                                                 report_type=rq_data.get('reportType'),
                                                 report_title=rq_data.get('reportTitle', '运营'),
                                                 domain=app.config.get('SITE_DOMAIN'))
                Utils.EmailTool.send_email(subject, mail, email_html, trackingId=tracking_id)
        except Exception as e:
            return Utils.beop_response_error(e)
    return Utils.beop_response_success()


@app.route('/report/getReport/<project_code>/<report_folder>/<report_name>')
def get_report(project_code, report_folder, report_name):
    """
    获取报表
    :param project_code: 项目code
    :param report_folder: 报表目录
    :param report_name: 报表名称
    :return:
    """
    if project_code is None or report_folder is None or report_name is None:
        abort(404)
    report_path = 'projectReports/reports/' + project_code + '/' + report_folder + '/' + report_name + '.html'
    report_path_from_root = 'beopWeb/static/' + report_path
    if os.path.exists(report_path_from_root):
        return app.send_static_file(report_path)
    else:
        abort(404)


@app.route('/report/getReportList/<project_code>/<report_folder>/')
def get_report_list(project_code, report_folder):
    '''
    获取报表的列表
    :param project_code: 项目code
    :param report_folder: 报表目录
    :return:
    '''
    if project_code is None or report_folder is None:
        return Utils.beop_response_error()
    report_folder_path = 'beopWeb/static/projectReports/reports/' + project_code + '/' + report_folder + '/'
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
    '''
    删除报表生成的PDF文件
    :param project_id: 项目ID
    :param report_folder: 报表目录
    :param report_name: 报表名称
    :param user_id: 用户ID
    :return:
    '''
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
    '''
    报表详细信息
    :param project_id: 项目ID
    :param report_folder: 报表目录
    :param version: 报表文件名称
    :return:
    '''
    project = Project().get_project_by_id(project_id, ['name_en', 'name_cn'])
    report_path = 'beopWeb/static/projectReports/reports/{project}/{folder}/{version}.html'.format(
        project=project.get('name_en'),
        folder=report_folder,
        version=version)

    report_detail = ''
    with open(report_path, encoding='utf-8') as file:
        report_detail = file.read()
    return render_template('report/template_report_detail.html', report_detail=report_detail)


@bp_admin.route('/getShareReportExcel', methods=['POST'])
def get_share_reportWrap_excel():
    data = request.get_json()
    # filename = ObjectId().__str__() + '.xlsx'
    try:
        return do_get_share_reportWrap_excel(data)
    except Exception as e:
        logging.error(e)
        print(e)
        rt = {'status':0, 'message':e.__str__()}
    return jsonify(rt)

def do_get_share_reportWrap_excel(data):
    output = BytesIO()
    excel = xlsxwriter.Workbook(output)
    for i in range(0, len(data)):
        chapter = data[i]
        make_excel_sheet(chapter, excel)
    excel.close()
    output.seek(0)

    return send_file(output, attachment_filename="testing.xlsx", as_attachment=True)

def make_excel_sheet(chapter,excel):
    if (chapter['template'] != 'container' and chapter['template'] != 'summary'):
        return
    if chapter['row2'] != 0 and chapter['col2'] != 0:
        sheet = excel.add_worksheet(chapter['title'][0:30]) #创建sheet
    try:
        if chapter['template'] == 'summary':
            if 'sheet' in locals().keys() :
                set_sheet_data(chapter,chapter,sheet,excel)
        else :
            if 'sub' in chapter.keys() and isinstance(chapter['sub'],list):
                for i in range(0,len(chapter['sub'])):
                    if chapter['sub'][i]['template'] == 'summary':
                        make_excel_sheet(chapter['sub'][i],excel)
                    elif chapter['sub'][i]['template'] == 'container':
                        make_excel_sheet(chapter['sub'][i],excel)
                    else:
                        if 'sheet' in locals().keys() :
                            set_sheet_data(chapter['sub'][i],chapter,sheet,excel)
    except Exception as e:
        logging.error(e)
        print(e)


def set_sheet_data(chapter,parent,sheet,excel):
    row1 = int(chapter['row1'])
    row2 = int(chapter['row2'])
    col1 = int(chapter['col1'])
    col2 = int(chapter['col2'])
    row = row1
    if 'temp_data_row' in parent.keys():
        temp_data_row = parent['temp_data_row']
    else:
        temp_data_row = int(parent['row2'])
    if chapter['template'] == 'table':
        for i in range(0,len(chapter['store'])):
            if (chapter['store'][i]['role'] == 'title'):
                sheet.merge_range(row,col1,row,col2-1,chapter['store'][i]['data'],set_style('table','title',excel))
                if('height' in chapter['store'][i].keys()):
                    sheet.set_row(row, 13.5 * chapter['store'][i]['height'])
                row = row + 1
            else :
                for j in range(0,len(chapter['store'][i]['data'])):
                    # sheet.col(j).width = 5120
                    headCol = 0
                    if chapter['store'][i]['role'] == 'head' :
                        headCol = i
                        sheet.write(row,col1+j,chapter['store'][i]['data'][j],set_style('table','head',excel))
                    elif (i - headCol)% 2 == 1:
                        sheet.write(row,col1+j,chapter['store'][i]['data'][j],set_style('table','odd',excel))
                    else:
                        sheet.write(row,col1+j,chapter['store'][i]['data'][j],set_style('table','even',excel))
                row = row + 1
        sheet.set_column(0,col2-1,20)
    elif chapter['template'] == 'html':
        headCol = 0
        for i in range(0,len(chapter['store'])):
            if(chapter['store'][i]['template'] == 'table'):
                if (chapter['store'][i]['role'] == 'title'):
                    sheet.merge_range(row,col1,row,col2-1,chapter['store'][i]['data'],set_style('table','title',excel))
                    if('height' in chapter['store'][i].keys()):
                        sheet.set_row(row, 13.5 * chapter['store'][i]['height'])
                    row = row + 1
                else :
                    if chapter['store'][i]['role'] == 'head' :
                        headCol = i
                    temp_col1_offset = 0
                    for j in range(0,len(chapter['store'][i]['data'])):
                        # sheet.col(j).width = 5120
                        data = chapter['store'][i]['data'][j]
                        temp_row = 1
                        temp_col = 1
                        if data == '<%blank%>':
                            temp_col1_offset = temp_col1_offset + 1
                            continue
                        if isinstance(data,dict):
                            temp_row = int(data.get('row',1))
                            temp_col = int(data.get('col',1))
                            data = data.get('content','')
                        if temp_row == 1 and temp_col == 1:
                            if chapter['store'][i]['role'] == 'head' :
                                sheet.write(row,temp_col1_offset,data,set_style('table','head',excel))
                            elif (i - headCol)% 2 == 1:
                                sheet.write(row,temp_col1_offset,data,set_style('table','odd',excel))
                            else:
                                sheet.write(row,temp_col1_offset,data,set_style('table','even',excel))
                        else:
                            if chapter['store'][i]['role'] == 'head' :
                                headCol = i
                                sheet.merge_range(row,temp_col1_offset,row+temp_row-1,temp_col1_offset + temp_col-1,data,set_style('table','head',excel))
                            elif (i - headCol)% 2 == 1:
                                sheet.merge_range(row,temp_col1_offset,row+temp_row-1,temp_col1_offset + temp_col-1,data,set_style('table','span',excel))
                            else:
                                sheet.merge_range(row,temp_col1_offset,row+temp_row-1,temp_col1_offset + temp_col-1,data,set_style('table','span',excel))
                        temp_col1_offset = temp_col1_offset + temp_col
                    row = row + 1
            elif (chapter['store'][i]['template'] == 'desc'):
                sheet.merge_range(row,col1,row,col2-1,chapter['store'][i]['data'],set_style('html','',excel))
                if('height' in chapter['store'][i].keys()):
                    sheet.set_row(row, 13.5 *chapter['store'][i]['height'])
                # ceilHeight = int(sys.getsizeof(chapter['store'][i]['data'])/200) + 1
                # sheet.row(row).height = ceilHeight * 220
                row = row + 1
            elif (chapter['store'][i]['template'] == 'chart'):
                chartOpt = chapter['store'][i]['data']
                chartType = chartOpt['type']
                combineChart = False
                for j in range (0,len(chartOpt['series'])):
                    series = chartOpt['series'][j]
                    if (combineChart == False):
                        if(series['type'] == 'bar'):
                            if ('isAxisReverse' in series.keys() and series['isAxisReverse']):
                                chart = excel.add_chart({'type':'bar','subtype': chartOpt['subtype']})
                            else:
                                chart = excel.add_chart({'type':'column','subtype': chartOpt['subtype']})
                        elif (series['type'] == 'gauge'):
                            chart = excel.add_chart({'type':'doughnut'})
                        else :
                            chart = excel.add_chart({'type':series['type']})

                        chart.set_title(chartOpt['title'])
                        if(chartType == 'line'):
                            chart.set_x_axis(chartOpt['xAxis'][0])
                            chart.set_y_axis(chartOpt['yAxis'][0])
                            if(len(chartOpt['yAxis']) > 1):
                                chart.set_y2_axis(chartOpt['yAxis'][1])
                        combineChart = chart
                    else:
                        chart = combineChart

                    sheet.set_row(temp_data_row, None, None, {'hidden': True})
                    sheet.write_row(temp_data_row, col1, series['categories'])

                    sheet.set_row(temp_data_row+1, None, None, {'hidden': True})
                    sheet.write_row(temp_data_row+1, col1, series['values'])

                    if(chartType == 'line'):
                        chart.add_series({
                            'name': series.get('name',''),
                            'values': [sheet.get_name(), temp_data_row+1, 0, temp_data_row+1,  len(series['values'])-1],
                            'categories': [sheet.get_name(), temp_data_row, 0, temp_data_row, len(series['categories'])-1],
                            'y2_axis': series['y2_axis']
                        })
                    elif (chartType == 'gauge'):
                        chart.add_series({
                            'name': series.get('name',''),
                            'values': [sheet.get_name(), temp_data_row+1, 0, temp_data_row+1,  len(series['values'])-1],
                            'categories': [sheet.get_name(), temp_data_row, 0, temp_data_row, len(series['categories'])-1],
                            'points':series['points']
                        })
                    elif (chartType == 'pie'):
                        chart.add_series({
                            'name': series.get('name',''),
                            'values': [sheet.get_name(), temp_data_row+1, 0, temp_data_row+1,  len(series['values'])-1],
                            'categories': [sheet.get_name(), temp_data_row, 0, temp_data_row, len(series['categories'])-1],
                            'points':series['points']
                        })
                    else:
                        continue
                    temp_data_row = temp_data_row + 2
                    # if combineChart == False:
                    #     combineChart = chart
                    #     combineChart.set_title(chartOpt['title'])
                    #     if(chartType == 'line'):
                    #         combineChart.set_x_axis(chartOpt['xAxis'][0])
                    #         combineChart.set_y_axis(chartOpt['yAxis'][0])
                    #         if(len(chartOpt['yAxis']) > 1):
                    #             combineChart.set_y2_axis(chartOpt['yAxis'][1])
                    # else:
                    #     combineChart.combine(chart)
                combineChart.set_size({'x_scale': 2, 'y_scale': 2})
                sheet.insert_chart(row,col1, combineChart)
                combineChart.show_hidden_data()
                row = row + 29
        sheet.set_column(0,col2-1,20)
        # for i in range(0,col2):
        #     # sheet.col(i).width = 5120
        #     pass
    elif chapter['template'] == 'summary':
        for i in range(0,len(chapter['store'])):
            sheet.merge_range(row,col1,row,col2-1,chapter['store'][i]['data'],set_style('summary','',excel))
            if('height' in chapter['store'][i].keys()):
                sheet.set_row(row, 13.5 * chapter['store'][i]['height'])
            # ceilHeight = int(sys.getsizeof(chapter['store'][i])/200) + 1
            row = row + 1
            # sheet.row(row1+i).height = ceilHeight * 220
        sheet.set_column(0,col2-1,20)
        # for i in range(0,col2):
        #     # sheet.col(i).width = 5120
        #     pass
    elif chapter['template'] == 'chart':
        for i in range(0,len(chapter['store'])):
            chartOpt = chapter['store'][i]['data']
            chartType = chartOpt['type']
            combineChart = False
            for j in range (0,len(chartOpt['series'])):
                series = chartOpt['series'][j]
                if (combineChart == False):
                    if(series['type'] == 'bar'):
                        chart = excel.add_chart({'type':'column'})
                    elif (series['type'] == 'gauge'):
                        chart = excel.add_chart({'type':'doughnut'})
                    else :
                        chart = excel.add_chart({'type':series['type']})

                    chart.set_title(chartOpt['title'])
                    if(chartType == 'line'):
                        chart.set_x_axis(chartOpt['xAxis'][0])
                        chart.set_y_axis(chartOpt['yAxis'][0])
                        if(len(chartOpt['yAxis']) > 1):
                            chart.set_y2_axis(chartOpt['yAxis'][1])
                    combineChart = chart
                else:
                    chart = combineChart

                sheet.set_row(temp_data_row, None, None, {'hidden': True})
                sheet.write_row(temp_data_row, col1, series['categories'])

                sheet.set_row(temp_data_row+1, None, None, {'hidden': True})
                sheet.write_row(temp_data_row+1, col1, series['values'])

                if(chartType == 'line'):
                    chart.add_series({
                        'name': series['name'],
                        'values': [sheet.get_name(), temp_data_row+1, 0, temp_data_row+1,  len(series['values'])-1],
                        'categories': [sheet.get_name(), temp_data_row, 0, temp_data_row, len(series['categories'])-1],
                        'y2_axis': series['y2_axis']
                    })
                elif (chartType == 'gauge'):
                    chart.add_series({
                        'name': series['name'],
                        'values': [sheet.get_name(), temp_data_row+1, 0, temp_data_row+1,  len(series['values'])-1],
                        'categories': [sheet.get_name(), temp_data_row, 0, temp_data_row, len(series['categories'])-1],
                        'points':series['points']
                    })
                elif (chartType == 'pie'):
                    chart.add_series({
                        'name': series['name'],
                        'values': [sheet.get_name(), temp_data_row+1, 0, temp_data_row+1,  len(series['values'])-1],
                        'categories': [sheet.get_name(), temp_data_row, 0, temp_data_row, len(series['categories'])-1],
                        'points':series['points']
                    })
                else:
                    continue
                temp_data_row = temp_data_row + 2
                # if combineChart == False:
                #     combineChart = chart
                #     combineChart.set_title(chartOpt['title'])
                #     if(chartType == 'line'):
                #         combineChart.set_x_axis(chartOpt['xAxis'][0])
                #         combineChart.set_y_axis(chartOpt['yAxis'][0])
                #         if(len(chartOpt['yAxis']) > 1):
                #             combineChart.set_y2_axis(chartOpt['yAxis'][1])
                # else:
                #     combineChart.combine(chart)
            combineChart.set_size({'x_scale': 2, 'y_scale': 2})
            sheet.insert_chart(row,col1, combineChart)
            combineChart.show_hidden_data()
            row = row + 29
    else:
        pass
    parent['temp_data_row']= temp_data_row

def set_style(template,role,workbook):
    style = workbook.add_format() # 初始化样式
    style.set_align('vjustify')
    if template == 'table':
        style.set_align('center')
        if role == 'title':
            style.set_align('left')
            #style.set_font_color('#999999')
        elif role == 'head':
            style.set_bold()
            style.set_font_color('#ffffff')
            style.set_fg_color('#ffbf00')
            style.set_border(1)
            style.set_border_color('#fad67d')
        elif role == 'even':
            style.set_fg_color('#fef0cc')
            style.set_font_color('#333333')
            style.set_border(1)
            style.set_border_color('#fad67d')
        elif role == 'span':
            style.set_font_color('#333333')
            style.set_border(1)
            style.set_border_color('#fad67d')
            style.set_align('vjustify')
        else:
            style.set_font_color('#333333')
            style.set_border(1)
            style.set_border_color('#fad67d')
    return style