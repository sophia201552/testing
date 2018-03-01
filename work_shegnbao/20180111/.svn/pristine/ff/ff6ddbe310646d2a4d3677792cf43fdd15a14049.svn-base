import configparser
import logging
import os
import re
from datetime import datetime
from .Constants import Constants


class I18n:
    """
    后台国际化
    加载国际化资源ini来加载国际化配置
    国际化资源文件在mod_common.locale中
    """
    lang = 'en-US'
    config = None
    resource = None
    section_name = 'resource'

    def __init__(self, lang='en-US'):
        self.lang = lang

    def set_section_name(self, name):
        """
        设置国际化资源中的section, 默认为resource

        :param name: section名字
        """
        self.section_name = name

    def set_lang(self, lang):
        """
        设置当前语言

        :param lang:
        """
        if not lang or lang == 'en':
            lang = 'en-US'
        elif lang == 'zh':
            lang = 'zh-CN'
        self.lang = lang
        self._load_resource()

    def get_lang(self):
        """
        获得当前语言
        """
        return self.lang

    def _load_resource(self):
        """
        加载国际化资源
        """
        if self.config is None:
            self.config = configparser.ConfigParser()
        locale_file_path = os.path.join(os.path.dirname(__file__), 'locale', str(self.lang) + '.ini')
        try:
            with open(locale_file_path, encoding='utf-8') as config_file:
                self.config.read_file(config_file)
                logging.info('加载国际化文件' + locale_file_path)
        except Exception:
            logging.error('国际化文件加载失败' + locale_file_path)

    def trans(self, msg_key, **args):
        """
        对字符串进行国际化

        :param msg_key: 国际化key值
        :param args: 其他参数
        """
        try:
            if not self.config:
                self._load_resource()
            return self.config.get(self.section_name, msg_key, fallback='', vars=args)
        except Exception as e:
            logging.error('beop: 国际化翻译失败.' + str(e))
            return ''

    def trans_time(self, t_time):
        """
        对时间进行国际化

        :param t_time: 需要国际化的时间文本
        :return: 国际化后端时间文本
        """
        if not t_time:
            return ''
        full = '\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}'
        short = '\d{4}-\d{2}-\d{2}'

        if re.compile(full).match(t_time):
            if self.lang == 'zh':
                t_format = Constants.DEFAULT_DISPLAY_TIME_FORMAT_ZH
            else:
                t_format = Constants.DEFAULT_DISPLAY_TIME_FORMAT_EN
            d = datetime.strptime(t_time, '%Y-%m-%d %H:%M:%S')
            return d.strftime(t_format)
        elif re.compile(short).match(t_time):
            if self.lang == 'zh':
                t_format = Constants.DEFAULT_DISPLAY_TIME_FORMAT_SHORT_ZH
            else:
                t_format = Constants.DEFAULT_DISPLAY_TIME_FORMAT_SHORT_EN
            d = datetime.strptime(t_time, '%Y-%m-%d')
            return d.strftime(t_format)
        return t_time
