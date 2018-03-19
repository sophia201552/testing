from selenium import webdriver

class BasePage:
    url="http://beop.rnbtech.com.hk"
    @classmethod
    def chrome(cls):
        cls.driver=webdriver.Chrome()
        cls.driver.get(cls.url)
        cls.driver.implicitly_wait(10)
        cls.driver.maximize_window()
        return cls.driver

    @classmethod
    def teardown(cls):
        cls.driver.quit()

