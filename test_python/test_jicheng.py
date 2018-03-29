from selenium import  webdriver
import unittest
import time
from test_python.test_context import Test
class Page:
    def __init__(self,driver,base_url="http://www.baidu.com"):
        self.driver=driver
        self.url=base_url
    def getUrl(self,url):
        self.driver.get(url)

    def find_element(self,ele):
         return self.driver.find_element_by_css_selector(ele)

    def send_keys(self,ele,text):
        self.find_element(ele).send_keys(text)

    def click(self,ele):
        self.find_element(ele).click()
    def getTtile(self):
        return self.driver.title

class SearchPage(Page):
    def __init__(self,driver,url):
        Page.__init__(self,driver=driver,base_url=url)

    def search(self,text):
        self.send_keys("#kw",text)
        time.sleep(1)
        self.click("#su")
        return self.driver.title
    def openUrl(self):
        self.getUrl(self.url)

class Conmmon:
    @staticmethod
    def loginChrome():
        driver = webdriver.Chrome()
        driver.maximize_window()
        return driver

class Test(unittest.TestCase):

    def setUp(self):
        self.driver=Conmmon.loginChrome()

    def test_search(self):
        search_page=SearchPage(self.driver,url='http://baidu.com')
        search_page.openUrl()
        title=search_page.search("51testing")
        assert title=='51testing_百度搜索','search fail'

    def tearDown(self):
        self.driver.quit()