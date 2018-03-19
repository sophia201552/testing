from selenium.webdriver.chrome.webdriver import WebDriver as chrome
from selenium.webdriver.firefox.webdriver import WebDriver as ff
from selenium.webdriver.common.action_chains import ActionChains as AC
from Methods.OtherTools import OtherTools
from Methods.Log import log
from Methods.Log import Log
from config import app
def reRun(N=2):
    def decorator(func):
        def wrapper(*args, **kw):
            error = ''
            for i in range(0, N):
                try:
                    return func(*args, **kw)
                except Exception as e:
                    error = e.__str__()
                    Log.writeLogError(app.config['CSS_ERROR'], func.__name__ + e.__str__())
            raise Exception("%s函数出错!详情: %s" % (func.__name__, error))
        return wrapper
    return decorator

class Chrome(chrome):
    '''
        此为浏览器定义，之前启动一个chrome语句如下：
        from selenium import webdriver
        driver = webdriver.Chrome()
        封装之后启动语句如下:
        from Methods.CommonMethods import Chrome
        driver = Chrome()
    '''
    pass

class Firefox(ff):
    '''
        此为浏览器定义，之前启动一个Firefox语句如下：
        from selenium import webdriver
        driver = webdriver.Firefox()
        封装之后启动语句如下:
        from Methods.CommonMethods import Chrome
        driver = Firefox()
    '''
    pass


class DriverMethods(object):
    '''
        将Chrome或者其他浏览器类的实例中的方法封装起来
        driver = Chrome()
        methods = DriverMethod(driver)
        methods.send('#css', 'hello')   #此处是对id为"css"的元素发送文本内容"hello"
        methods中含有以往的driver中的属性和方法，封装了更简单的语句

    '''

    def __init__(self, driver):
        '''
        :param driver:
        driver为Chrome类的实例
        '''
        self.driver = driver



    @log
    def send(self, page, cssName, text):
        '''

        :param css:  css元素
        :param text:     发送给该input标签的内容
        :return:
        :e.g: driver.send('#txtName', '你好召唤师!')
        '''
        css = OtherTools.getCss(page, cssName)
        return self.driver.find_element_by_css_selector(css).send_keys(text)

    @log
    def click(self, page, cssName):
        '''

        :param css: css元素
        :return:
        :e.g: driver.click('#username')
        '''
        css = OtherTools.getCss(page, cssName)
        return self.driver.find_element_by_css_selector(css).click()

    @log
    def clear(self, page, cssName):
        '''

        :param css: css元素
        :return:
        :e.g: driver.clear('#username')
        '''
        css = OtherTools.getCss(page, cssName)
        return self.driver.find_element_by_css_selector(css).clear()

    @log
    def cssEle(self, page, cssName):
        '''

        :param css:
        :return:
        :e.g: driver.cssEle('#username')  #返回一个WebElement实例
        '''
        css = OtherTools.getCss(page, cssName)
        return WebElement(self.driver.find_element_by_css_selector(css))

    @log
    def element(self, page, cssName):
        '''

        :param css:
        :return:
        :e.g: driver.cssEle('#username')  #返回一个WebElement实例
        '''
        css = OtherTools.getCss(page, cssName)
        return self.driver.find_element_by_css_selector(css)


    @log
    def cssEles(self, page, cssName):
        '''

        :param css:
        :return:
        :e.g: driver.cssEles('#username') #返回一个list
        '''
        css = OtherTools.getCss(page, cssName)
        return [WebElement(x) for x in self.driver.find_elements_by_css_selector(css)]
        # return self.driver.find_elements_by_css_selector(css)

    def display(self, page, cssName):
        '''

        :param page, cssName:
        :return: True or False
        :e.g: driver.display('#username')
        '''
        return self.driver.find_element_by_css_selector(OtherTools.getCss(page, cssName)).is_displayed()

    def text(self, page, cssName):
        '''

        :param cssName:
        :return: True or False
        :e.g: driver.display('#username')
        '''
        return self.driver.find_element_by_css_selector(OtherTools.getCss(page, cssName)).text

    def tagEles(self, tagname):
        '''

        :param tagname:
        :return:
        :e.g: driver.tagEles('html') #返回一个list
        '''
        return [WebElement(x) for x in self.driver.find_elements_by_tag_name(tagname)]

    def attr(self, ele, name):
        return WebElement(ele).getAttr(name)

    def getEleAttr(self, page, cssName, attrName):
        return self.driver.find_element_by_css_selector(OtherTools.getCss(page, cssName)).get_attribute(attrName)

    def quit(self):
        '''
        退出浏览器
        :return:
        :e.g: driver.quit()
        '''
        return self.driver.quit()

class WebElement(object):
    '''
        初始化一个新的WebElement类，通过WebElement元素来构造
    '''

    def __init__(self, ele):
        '''

        :param ele: WebElement元素
        my_element = WebElement(driver.find_element_by_id('haha'))
        '''
        self.ele = ele

    @property
    def text(self):
        return self.ele.text

    def click(self):
        return self.ele.click()

    def send(self, page, cssName, text):
        return self.ele.find_element_by_css_selector(OtherTools.getCss(page, cssName)).send_keys(text)

    def cssEle(self, page, cssName):
        return self.ele.find_element_by_css_selector(OtherTools.getCss(page, cssName))

    def cssEles(self, page, cssName):
        return self.ele.find_elements_by_css_selector(OtherTools.getCss(page, cssName))

    def display(self, page, cssName):
        return self.ele.find_element_by_css_selector(OtherTools.getCss(page, cssName)).is_displayed()

    def tagEles(self, tagname):
        return self.ele.find_elements_by_tag_name(tagname)

    def clickEle(self, page, cssName):
        return self.ele.find_element_by_css_selector(OtherTools.getCss(page, cssName)).click()

    def getAttr(self, name):
        return self.ele.get_attribute(name)

    def eleText(self, page, cssName):
        return self.ele.find_element_by_css_selector(OtherTools.getCss(page, cssName)).text

    def getEleAttr(self, page, cssName, attrName):
        return self.ele.find_element_by_css_selector(OtherTools.getCss(page, cssName)).get_attribute(attrName)

class Action(AC):
    '''
        from selenium.webdriver.common.action_chains import ActionChains
        继承自该类

        使用方法：
        from Methods.CommonMethods import Action
        action = Action(driver)
        action.move_to_element('#username').perform()
    '''
    pass


