"""
.. module:: 浏览器工具
"""
__author__ = 'win7'
import re

class BrowserUtils:
    @staticmethod
    def get_browser_main_version(version):
        '''
        获取浏览器主版本信息

        :param version: 浏览器版本信息
        :return: 浏览器主版本信息
        '''
        if not version:
            return None
        version = str(version)
        # 处理'12.3.4.5'转成12
        if '.' in version:
            return int(version[:version.find('.')])
        else:
            return int(version)

    @staticmethod
    def get_browser_accept_language(accept_languages):
        '''
        获取浏览器可接受语言

        :param accept_languages: 浏览器可接受语言列表
        :return: zh-CN或者en-US
        '''
        if re.search('zh-CN', str(accept_languages), re.IGNORECASE) \
                or re.search('zh-hans-cn', str(accept_languages), re.IGNORECASE):
            return 'zh-CN'
        else:
            return 'en-US'

    @staticmethod
    def get_first_accept_language(accept_language):
        '''
        获取浏览器第一个可接受语言
        :param accept_language: 可接受语言字符串
        :return: 第一个可接受语言
        '''
        return accept_language.split(';')[0]

    @staticmethod
    def get_browser_info(user_agent):
        '''
        从用户代理中获取浏览器类型及版本信息

        :param user_agent: 请求的用户代理信息
        :return: 浏览器类型及版本信息
        '''
        """ werkzeug里的useragents会将edge浏览器识别为chrome
            https://github.com/pallets/werkzeug/pull/845
        """
        browser_info = (user_agent.browser, BrowserUtils.get_browser_main_version(user_agent.version))
        if user_agent.browser == BrowserType.chrome:
            result = re.search('edge[^\d]*(\d+)', user_agent.string, re.IGNORECASE)
            if result:
                browser_info = (BrowserType.edge, BrowserUtils.get_browser_main_version(result.group(1)))

        return browser_info

    @staticmethod
    def is_support_browser(user_agent):
        '''
        检测是否支持当前浏览器

        :param user_agent: 浏览器用户代理
        :return: 是否支持用户代理的浏览器
        '''
        browser, version = BrowserUtils.get_browser_info(user_agent)

        if browser and version:
            browser = browser.lower()
            if not SupportBrowser.support_dict.get(browser):
                return False
            if isinstance(SupportBrowser.support_dict.get(browser), bool):
                return SupportBrowser.support_dict.get(browser) is True
            else:
                return BrowserUtils.get_browser_main_version(version) >= SupportBrowser.support_dict.get(browser)

        return False

class Platform:
    '''
    操作系统类型
    '''
    android = 'android'
    iphone = 'iphone'
    ipad = 'ipad'
    linux = 'linux'
    macos = 'macos'
    solaris = 'solaris'
    windows = 'windows'


class BrowserType:
    '''
    浏览器类型
    '''
    # all is lower case
    chrome = 'chrome'
    msie = 'msie'
    edge = 'edge'
    firefox = 'firefox'
    safari = 'safari'
    opera = 'opera'


class SupportBrowser:
    '''
    浏览器支持的最低版本
    '''
    # type:true支持所有版本
    # type:xx支持最低xx版本
    support_dict = {
        BrowserType.chrome: 42,
        BrowserType.safari: 10,
        BrowserType.firefox: True,  # firefox全部支持
        BrowserType.edge: True,  # edge全部支持
        BrowserType.msie: 11  # ie全部不支持
    }



