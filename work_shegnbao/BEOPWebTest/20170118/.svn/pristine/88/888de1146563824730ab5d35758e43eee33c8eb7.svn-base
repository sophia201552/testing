import unittest

from beopWeb.mod_common.I18n import I18n


class I18nTestCase(unittest.TestCase):
    def setUp(self):
        self.i18n = I18n()

    def test_set_lang(self):
        self.i18n.set_lang('zh-CN')
        assert self.i18n.lang == 'zh-CN'

        self.i18n.set_lang('en-US')
        assert self.i18n.lang == 'en-US'

    def test_trans_CN(self):
        self.i18n.set_lang('zh-CN')
        assert self.i18n.trans('ALERT_CAN_NOT_FIND_REPORT', num=1) == '未找到 1 项目报表！'

    def test_trans_EN(self):
        self.i18n.set_lang('en-US')
        assert self.i18n.trans('ALERT_CAN_NOT_FIND_REPORT', num=1) == 'Project 1 report is not found.'
