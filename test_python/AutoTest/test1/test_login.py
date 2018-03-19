from test1.Page import Common
from test1.Base import BasePage
import time
# def test_login():
#     driver=Common.login("sophia.zhao@rnbtech.com.hk","zhao_123456")
#     time.sleep(5)
#     # flag=driver.find_element_by_id("project-media-control").is_displayed()
#     assert driver.current_url=="http://beop.rnbtech.com.hk/observer#page=PaneProjectSelector",'login fail'
#
# def test_login_with_null():
#     driver = Common.login("", "")
#     time.sleep(5)
#     # flag = driver.find_element_by_class_name("infoBox-footer").is_displayed()
#     flag=Common.getBox(driver)
#     assert flag, 'login success with null'
#
# def teardown_function(function):
#     BasePage.teardown()


import unittest
class TestSearch(unittest.TestCase):
    def setUp(self):
        self.driver=Common.before()
    def test_search_box_with_Chinese(self):
        project=Common.sendSearchBox(self.driver,"上海华为")
        assert project=="1 个相关项目",'login fail'
    def tearDown(self):
        self.driver.quit()

if __name__=='__main__':
    unittest.main()


