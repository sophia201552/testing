import os
import logging
import json
import uuid

from werkzeug.utils import secure_filename
from flask import request

from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_dqd.dqd import DQD, UnknownSheetKeyException, InvalidExcelFormat
from beopWeb.mod_dqd import bp_dqd


@bp_dqd.route('/configs/<int:projId>', methods=['GET'])
def dqd_config_get(projId):
    debug_msg = None
    error_code = None
    try:
        pageIndex = request.args.get('pageIndex')
        pageSize = request.args.get('pageSize')
        searchKeyName = request.args.get('searchKeyName')
        searchType = request.args.get('searchType')
        searchPattern = request.args.get('searchPattern')
        fieldsConfigured = request.args.get('fieldsConfigured')
        sortKeyName = request.args.get('sortKeyName')
        sortOrder = request.args.get('sortOrder')
        dqd = DQD(projId)
        data = dqd.config_get(pageIndex, pageSize, searchKeyName, searchType,
                              searchPattern, fieldsConfigured, sortKeyName, sortOrder)
    except Exception as e:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        error_code = 'ERROR_UNKNOWN'
        debug_msg = e.__str__()
    if not error_code:
        return Utils.beop_response_success(data=data)
    else:
        return Utils.beop_response_error(code=error_code, msg=debug_msg)


@bp_dqd.route('/configs/<int:projId>', methods=['POST'])
def dqd_config_post(projId):
    post_data = request.get_json()
    debug_msg = None
    error_code = None
    try:
        if post_data:
            configs = post_data.get('configs')
            if configs:
                dqd = DQD(projId)
                data = dqd.config_post(configs)
                if data:
                    error_code = 'ERROR_UPDATE_FAILURE'
            else:
                error_code = 'ERROR_INVALID_PARAM'
        else:
            error_code = 'ERROR_INVALID_PARAM'
    except Exception as e:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        error_code = 'ERROR_UNKNOWN'
        debug_msg = e.__str__()
    if not error_code:
        return Utils.beop_response_success(data=data)
    else:
        return Utils.beop_response_error(code=error_code, msg=debug_msg, data=data)

EXCANGER_ALLOWED_EXTENSIONS = set(['xlsx', 'xls'])
UPLOAD_FOLDER = '/tmp/' if os.name != 'nt' else os.getcwd()


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in EXCANGER_ALLOWED_EXTENSIONS


def random_file_name():
    return str(uuid.uuid4())


@bp_dqd.route('/exchangerData/<int:projId>', methods=['POST'])
def exchanger_data_upload(projId):
    error = None
    error_code = None
    if 'file' not in request.files:
        return Utils.beop_response_error(code='ERROR_NO_FILE_PART')
    upload_file = request.files['file']
    if upload_file.filename == '':
        return Utils.beop_response_error(code='ERROR_NO_SELECTED_FILE')
    if upload_file and allowed_file(upload_file.filename):
        try:
            filename = secure_filename(upload_file.filename)
            full_path = os.path.join(UPLOAD_FOLDER, random_file_name())
            upload_file.save(full_path)
            dqd = DQD(projId)
            dqd.exchanger_data_upload(full_path)
        except UnknownSheetKeyException:
            error_code = 'ERROR_UNKNOWN_SHEET_KEY'
        except InvalidExcelFormat:
            error_code = 'ERROR_INVAILD_EXCEL_FORMAT'
        except Exception as e:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
            error_code = 'ERROR_UNKNOWN'
            debug_msg = e.__str__()
        finally:
            if full_path:
                os.remove(full_path)
    else:
        return Utils.beop_response_error(code='ERROR_FILE_NOT_ALLOWED')
    if not error_code:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(code=error_code, msg=debug_msg)
