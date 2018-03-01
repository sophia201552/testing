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
        self.lang = lang
        self._load_resource()

    def _load_resource(self):
        if self.config is None:
            self.config = configparser.ConfigParser()
        locale_file_path = os.path.join(os.path.dirname(__file__), 'locale', str(self.lang) + '.ini')
        try:
            with open(locale_file_path, encoding='utf-8') as config_file:
                self.config.read_file(config_file)
        except:
            logging.error('没有找到本地化文件' + locale_file_path)

    def trans(self, msg_key, **args):
        try:
            return self.config.get(self.section_name, msg_key, fallback='', vars=args)
        except:
            return ''
