__author__ = 'win7'
import re


class Platform:
    android = 'android'
    iphone = 'iphone'
    ipad = 'ipad'
    linux = 'linux'
    macos = 'macos'
    solaris = 'solaris'
    windows = 'windows'


class BrowserType:
    # all is lower case
    chrome = 'chrome'
    msie = 'msie'
    edge = 'edge'
    firefox = 'firefox'
    safari = 'safari'
    opera = 'opera'


class SupportBrowser:
    # type:true支持所有版本
    # type:xx支持最低xx版本
    support_dict = {
        BrowserType.chrome: 39
    }


class BrowserUtils:
    @staticmethod
    def get_browser_main_version(version):
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
        if re.search('zh-CN', str(accept_languages), re.IGNORECASE) \
                or re.search('zh-hans-cn', str(accept_languages), re.IGNORECASE):
            return 'zh-CN'
        else:
            return 'en-US'

    @staticmethod
    def get_first_accept_language(accept_language):
        return accept_language.split(';')[0]

    @staticmethod
    def get_browser_info(user_agent):

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
