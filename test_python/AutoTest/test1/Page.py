from test1.Base import BasePage
import time
class Common:
    @classmethod
    def login(cls,username,password):
        driver=BasePage.chrome()
        driver.find_element_by_id("txtName").send_keys(username)
        driver.find_element_by_id("txtPwd").send_keys(password)
        driver.find_element_by_id("btnLogin").click()
        return driver
    @classmethod
    def searchBox(cls,text):
        pass
    # def demo09_index():
    @classmethod
    def getBox(cls,driver):
        flag = driver.find_element_by_class_name("infoBox-footer").is_displayed()
        return flag
    @classmethod
    def sendSearchBox(cls,driver,text):
        driver.find_element_by_css_selector(".form-control.project-media-searchBox").send_keys(text)
        driver.find_element_by_id("advanceSearch-btn-1").click()
        return driver.find_element_by_css_selector(".search_result").text

    @classmethod
    def before(cls):
        driver = Common.login("sophia.zhao@rnbtech.com.hk", "zhao_123456")
        time.sleep(3)
        return driver