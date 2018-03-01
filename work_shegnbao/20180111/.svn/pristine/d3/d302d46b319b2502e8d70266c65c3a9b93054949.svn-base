__author__ = 'woody'
import logging

from flask import request, jsonify

from beopWeb.mod_cxTool import bp_pointTool
from beopWeb.mod_cxTool.PointTable import PointTable


@bp_pointTool.route('/reference', methods=['POST'])
def pointReference():
    '''Return the place where the point of BEOP locate.
    '''
    error = 1
    msg = None
    rt = {}
    try:
        data = request.get_json()
        pt = PointTable()
        pointname = data.get('point')
        projId = data.get('projId')
        rt = pt.get_point_reference(projId, pointname)
        error = 0
    except Exception as err:
        msg = str(err)
        logging.error(str(err))
    rv = dict(result=rt, msg=msg, error=error)
    return jsonify(rv)


