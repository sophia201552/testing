__author__ = 'yan'

from datetime import datetime, timedelta
import logging
from flask import request, json
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_workflow_process import *
from .Process import Process
from .Template import Template
from bson import ObjectId


@bp_workflow_process.route('/add', methods=['POST'])
def workflowProcessAdd():
    rt = ''
    data = request.get_json()
    template_id = data.get('template_id')
    nodes = data.get('nodes')
    if data and template_id and nodes and isinstance(nodes, list):
        rt = Process.workflowProcessUpdate(data)
    return Utils.beop_response_success(rt) if rt else Utils.beop_response_error()


@bp_workflow_process.route('/remove/<processId>', methods=['GET'])
def workflowProcessRemove(processId):
    rt = False
    if ObjectId.is_valid(processId):
        rt = Process.workflowProcessRemove(processId)
    return Utils.beop_response_success(rt) if rt else Utils.beop_response_error()


@bp_workflow_process.route('/edit/<processId>', methods=['POST'])
def workflowProcessEdit(processId):
    rt = False
    data = request.get_json()
    if data and ObjectId.is_valid(processId):
        rt = Process.workflowProcessUpdate(processId, data)
    return Utils.beop_response_success(rt) if rt else Utils.beop_response_error()


@bp_workflow_process.route('/getAll', methods=['GET'])
def workflowProcessGetAll():
    # TODO 测试数据
    rt = [{"_id": "56ea8afd645514b54063a225", "name": "Fault",
           "nodes": [
               {"arch_id": "7cfc94700011458295407709", "behaviour": 2, "arch_type": {"type": 1, "name": "super admin"},
                "members": [{"id": 1, "useremail": "", "userfullname": "admin",
                             "userpic": "http://images.rnbtech.com.hk/static/images/avatar/default/5.png"}],
                "memberType": 1},
               {"arch_id": "9e3e8c780011458295437593", "behaviour": 1, "arch_type": {"type": 2, "name": "admin"},
                "members": [
                    {"id": 68, "useremail": "rikan.li@rnbtech.com.hk",
                     "userfullname": "李乾",
                     "userpic": "http://images.rnbtech.com.hk/static/images/avatar/default/5.png"},
                    {"id": 404, "useremail": "woody.wu@rnbtech.com.hk",
                     "userfullname": "吴冉旭",
                     "userpic": "http://images.rnbtech.com.hk/static/images/avatar/default/5.png"},
                    {"id": 408, "useremail": "nomand.zhang@rnbtech.com.hk",
                     "userfullname": "Nomand",
                     "userpic": "http://images.rnbtech.com.hk/static/images/avatar/default/5.png"}],
                "memberType": 2}],
           "template_id": "56d65435fecfda0318f63176", "type": 1}]
    return Utils.beop_response_success(rt)


@bp_workflow_process.route('/bindTemplate', methods=['POST'])
def workflowProcessBindTemplate():
    process_id = None
    template_id = None
    rt = Process.workflowProcessBindTemplate(process_id, template_id)
    return Utils.beop_response_success(rt)


@bp_workflow_process.route('/changeTemplate', methods=['POST'])
def workflowProcessChangeTemplate():
    process_id = None
    template_id = None
    rt = Process.workflowProcessChangeTemplate(process_id, template_id)
    return Utils.beop_response_success(rt)


@bp_workflow_process.route('/template/add', methods=['POST'])
def workOrderTemplateAdd():
    rt = ''
    data = request.get_json()
    if data:
        rt = Template.add(data)
    return Utils.beop_response_success(rt) if rt else Utils.beop_response_error()


@bp_workflow_process.route('/template/update/<templateId>', methods=['POST'])
def workOrderTemplateUpdate(templateId):
    rt = False
    data = request.get_json()
    if data and ObjectId.is_valid(templateId):
        rt = Template.update(templateId, data)
    return Utils.beop_response_success(rt) if rt else Utils.beop_response_error()


@bp_workflow_process.route('/template/delete/<templateId>', methods=['POST'])
def workOrderTemplateDelete(templateId):
    rt = False
    if ObjectId.is_valid(templateId):
        rt = Template.delete(templateId)
    return Utils.beop_response_success(rt) if rt else Utils.beop_response_error()


@bp_workflow_process.route('/template/get/<templateId>', methods=['POST'])
def workOrderTemplateGet(templateId):
    rt = {}
    if ObjectId.is_valid(templateId):
        rt = Template.get(templateId)
    return Utils.beop_response_success(rt) if rt else Utils.beop_response_error()


@bp_workflow_process.route('/template/get_default', methods=['POST'])
def workOrderTemplateGetDefault():
    rt = Template.get_default()
    return Utils.beop_response_success(rt) if rt else Utils.beop_response_error()
