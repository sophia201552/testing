import pytest
import assert_lan
import utils
global driver
# @pytest.mark.usefixtures("teardown")
class TestLogin:
    def setup_method(self, method):
        print("setup_method      method:%s" % method.__name__)
        self.driver = utils.getChrome()

    @pytest.mark.p0
    def test_login(self):
        USERNAME='projecttest@rnbtech.com.hk'
        PASSWORD='h=Lp4U8+Lp'
        print('running')
        driver=assert_lan.assert_result(self.driver,USERNAME,PASSWORD)





    def teardown_method(self, method):
        print("teardown_method   method:%s" % method.__name__)
        self.driver.quit()

