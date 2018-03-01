import logging
import os

from flask import request
from flask import json

from beopWeb.mod_history import bp_history
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_history.history import HistoryData
from beopWeb.mod_history.history import write_hisdata_excel

@bp_history.route('/getDifferData', methods=['POST'])
@Utils.response_wrapper
def startWorkspaceDataGenHistogramIncrement():
    post_data = request.get_json()
    h = HistoryData(**post_data)
    data = h.get_diff_data()
    return data

@bp_history.route('/exportHisDataExcel', methods=['POST'])
@Utils.file_response_wrapper
def export_hisdata_excel(tmp_file):
    '''
    postdata:
    {
        "dsItemIds": ["@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_Vab", "@674|MIC_ENC2_Digitrip1150_Main_20A_20Trip_20Unit_Vbc"],
        "columnNames": ["Vab", "Vbc"],
        "timeEnd": "2018-02-05 05:59:59",
        "timeFormat": "h1",
        "timeStart": "2018-02-05 03:00:00" 
    }
    '''
    post_data = request.get_json()
    write_hisdata_excel(tmp_file, **post_data)