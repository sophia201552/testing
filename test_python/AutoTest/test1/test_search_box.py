from test1.Page import Common
from test1.Base import BasePage
import time
import pytest
#
# def test_search_box_with_id():
#     # driver=Common.login("sophia.zhao@rnbtech.com.hk","zhao_123456")
#     project=Common.sendSearchBox(Common.before(),"724")
#     assert project=="1 个相关项目",'login fail'
#
# def test_search_box_with_Chinese():
#
#     project=Common.sendSearchBox(Common.before(),"上海华为")
#     assert project=="1 个相关项目",'login fail'
#
# def test_search_box_with_Chinese_multiple():
#     # driver=Common.login("sophia.zhao@rnbtech.com.hk","zhao_123456")
#     project=Common.sendSearchBox(Common.before(),"华为")
#     assert project=="6 个相关项目",'login fail'
#
# def teardown_function(function):
#     BasePage.teardown()

import unittest
class TestSearch(unittest.TestCase):
    def setUp(self):
        self.driver=Common.before()
    def test_search_box_with_Chinese(self):
        project=Common.sendSearchBox(self.driver,"上海华为")
        assert project=="2 个相关项目",'login fail'
    def tearDown(self):
        self.driver.quit()

if __name__=='__main__':
    unittest.main()














