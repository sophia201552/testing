__author__ = 'win7'

import configparser
import logging
import os


class I18n:
    lang = 'en-US'
    config = None
    resource = None
    section_name = 'resource'

    def __init__(self, lang='en-US'):
        self.lang = lang

    def set_section_name(self, name):
        self.section_name = name

    def set_lang(self, lang):
        if not lang or lang == 'en' or 'zh-' not in lang:
            lang = 'en-US'
        elif lang == 'zh':
            lang = 'zh-CN'
        self.lang = lang
        self._load_resource()

    def get_lang(self):
        return self.lang

    def _load_resource(self):
        if self.config is None:
            self.config = configparser.ConfigParser()
        locale_file_path = os.path.join(os.path.dirname(__file__), 'locale', str(self.lang) + '.ini')
        try:
            with open(locale_file_path, encoding='utf-8') as config_file:
                self.config.read_file(config_file)
                logging.info('加载国际化文件' + locale_file_path)
        except:
            logging.error('国际化文件加载失败' + locale_file_path)

    def trans(self, msg_key, **args):
        try:
            if not self.config:
                self._load_resource()
            return self.config.get(self.section_name, msg_key, fallback='', vars=args)
        except Exception as e:
            logging.error('beop: 国际化翻译失败.' + str(e))
            return ''
