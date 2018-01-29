import utils

def assert_result(driver,USERNAME,PASSWORD):
    url = "http://192.168.1.221:1080"
    # driver=utils.getChrome()
    driver.get(url)
    driver.find_element_by_id("txtName").send_keys(USERNAME)
    driver.find_element_by_id("txtPwd").send_keys(PASSWORD)
    driver.find_element_by_id("btnLogin").click()
    ele = driver.find_element_by_id( 'navHomeLogo').is_displayed()
    assert ele,'login fail'
    return driver

