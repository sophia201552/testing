from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPMongoDataAccess import *
from bson import ObjectId
import logging


class Template:
    _template = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_template]

    default_fields = {
        'title': '',  # 工单名称
        'note': '',  # 工单Note
        'creator': 0,  # 发起人
        'createTime': None,  # 发起时间
        'completeTime': None,  # 结束时间
        'attachments': [],  # 附件列表
        'status': None,  # 工单状态:进行中,关闭
        'executor': 0,  # 当前执行人
        'watchers': []  # 工单的相关人员(应该做为可选项,用来解决一些工单需要被一些人关注,类似于邮件中的抄送)
    }

    @classmethod
    def add(cls, data):
        rt = ''
        try:
            if isinstance(data, dict):
                ret = Template._template.save(data)
                if ret:
                    rt = ret.__str__()
        except Exception as e:
            print('Template.add failed:' + e.__str__())
            logging.error('Template.add failed:' + e.__str__())
        return rt

    @classmethod
    def update(cls, template_id, data):
        rt = True
        try:
            if ObjectId.is_valid(template_id) and data:
                Template._template.update({'_id': ObjectId(template_id)}, {'$set': data})
        except Exception as e:
            rt = False
            print('Template.update failed:' + e.__str__())
            logging.error('Template.update failed:' + e.__str__())
        return rt

    @classmethod
    def delete(cls, template_id):
        rt = True
        try:
            if ObjectId.is_valid(template_id):
                Template._template.remove({'_id': ObjectId(template_id)})
        except Exception as e:
            rt = False
            print('Template.delete failed:' + e.__str__())
            logging.error('Template.delete failed:' + e.__str__())
        return rt

    @classmethod
    def get(cls, template_id):
        rt = {}
        try:
            if ObjectId.is_valid(template_id):
                rt = Template._template.find_one({'_id': ObjectId(template_id)})
                rt.update({'_id': rt.get('_id').__str__()})
        except Exception as e:
            print('Template.get failed:' + e.__str__())
            logging.error('Template.get failed:' + e.__str__())
        return rt

    @classmethod
    def get_default(cls):
        return Template.default_fields
