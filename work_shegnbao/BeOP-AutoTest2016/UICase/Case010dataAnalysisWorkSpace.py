__author__ = 'wuranxu'
from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import datetime, time
from Methods.LoginTools import LoginTools
from config import app
import unittest

#url = "http://beop.rnbtech.com.hk"
#该case用来验证数据分析工作集合的增删改等操作
url = "http://%s" % app.config['SERVERIP']

class Case010(unittest.TestCase):
    testCaseID = 'Case010'
    projectName = "不针对项目"
    buzName = '测试数据分析工作集合的增删改等操作是否正常'
    start = 0.0
    now = 'None'
    startTime = ""
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(url,self.testCaseID)
        self.driver = lg.login(self.driver)

    def Test(self):
        a = WebDriverTools()
        driver = self.driver
        #driver.implicitly_wait(8)
        time.sleep(4)
        # 点击用户菜单，进入数据分析
        driver.find_element_by_id("iconList").click()
        try:
            driver.find_element_by_id("btnDataAnalys").click()
        except Exception:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0, '不选择项目->点击用户下拉菜单->进入数据分析界面时出错!'
        a.waitSpinner(driver,'数据分析界面')
        time.sleep(1)
        #点击进入工作集页面，进行测试
        time.sleep(2)
        driver.find_element_by_css_selector(".breadcrumb>li>a").click()
        time.sleep(3)
        Workplace = len(driver.find_elements_by_css_selector(".wsCtn"))
        if Workplace:
            print("数据分析->工作集->工作空间数量为%d个!" % (Workplace - 1))
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID, time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->工作集->工作空间数量为0,请检查!"
        #点击"+"按钮，创建工作空间
        driver.find_element_by_css_selector(".wsSet.ws-add.empty>div").click()
        time.sleep(1)
        #测试增加工作空间的功能
        Workplace_add = len(driver.find_elements_by_css_selector(".wsCtn"))
        if Workplace + 1 == Workplace_add:
            print("创建工作集成功!数据分析->工作集->工作空间数量为%d个" % (Workplace_add - 1))
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->工作集->点击\'+\'按钮后创建工作空间失败!"

        #给新创建的工作空间命名
        time.sleep(6)
        e = driver.find_elements_by_css_selector(".glyphicon.glyphicon-pencil.wsNameEdit")
        m = len(e)
        ActionChains(driver).move_to_element(driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) .infoWrap")).perform()
        #调用js语句将铅笔按钮显示出来
        #driver.execute_script("document.getElementsByClassName('glyphicon glyphicon-pencil wsNameEdit')[document.getElementsByClassName('glyphicon glyphicon-pencil wsNameEdit').length-1].style.display='block'")
        time.sleep(3)
        e[m-1].click()

        #编辑新建工作空间的名字
        driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) .infoWrap input").clear()
        driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) .infoWrap input").send_keys("Beop-Test")
        driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) .infoWrap button").click()
        time.sleep(3)
        #判断名称是否被修改
        try:
            nm = driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) .infoWrap>span").text
        except Exception:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->工作集->修改新添加的工作空间名耗时超过3秒钟!"
        if nm == "Beop-Test":
            print("数据分析->工作集->修改新添加的工作空间名成功!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->工作集->修改新添加的工作空间名失败!"




        #进入该工作空间
        driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) .wsCtn").click()
        time.sleep(1)
        driver.find_element_by_css_selector(".glyphicon.glyphicon-plus").click()
        time.sleep(1)
        pictype = driver.find_elements_by_class_name("anlsTemplate")
        if len(pictype) >= 8:
            print("数据分析->新建工作空间并进入->添加图表->图表类型完整!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->新建工作空间并进入->添加图表->图表类型数量丢失,请检查!"
        l = driver.find_elements_by_css_selector("div[class~='divPage']")
        if len(l):
            print('数据分析->新建工作空间并进入->添加图表->左侧图表数量为%d' % len(l))
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->新建工作空间并进入->添加图表->左侧图表数量为0!"
        driver.find_element_by_id("btnPageAdd").click()
        time.sleep(3)
        picture = driver.find_elements_by_css_selector("div[class='effect']")
        if len(picture) == 2:
            print("数据分析->新建工作空间并进入->点击左下角+按钮添加图表成功!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->新建工作空间并进入->点击左下角+按钮添加图表失败!"
        time.sleep(2)
        driver.find_element_by_css_selector("#divWSPane>div .modalNameSp").click()
        driver.find_element_by_css_selector("#divWSPane>div .divPageTitle textarea").clear()
        driver.find_element_by_css_selector("#divWSPane>div .divPageTitle textarea").send_keys("test")
        driver.find_element_by_css_selector("#divWSPane>div .divPageTitle textarea").send_keys(Keys.ENTER)
        time.sleep(1.8)
        na = driver.find_element_by_css_selector("#divWSPane>div .modalNameSp").text
        if na == 'test':
            print("改名成功!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->新建工作空间并进入->添加图表->修改图表名称出错!"
        time.sleep(2)
        ActionChains(driver).move_to_element(driver.find_element_by_css_selector("#divWSPane>div .modalNameSp")).perform()
        driver.find_element_by_css_selector("#divWSPane>div>span").click()
        time.sleep(2)
        driver.find_element_by_css_selector(".breadcrumb>li>a").click()
        time.sleep(2)

        #销毁创建的工作空间
        ActionChains(driver).move_to_element(driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) .infoWrap")).perform()
        time.sleep(1)
        driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) .btnWsRemove>span").click()
        time.sleep(0.5)
        #driver.switch_to_alert().accept()
        try:
            sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认']
            sure[0].click()
            #driver.find_elements_by_css_selector(".btn.btn-info.alert-button")[0].click()
        except Exception as e:
            assert 0,"数据分析--删除工作空间时没有弹出是否删除该工作空间的提示窗口"
        time.sleep(1)
        Workplace_del = len(driver.find_elements_by_css_selector(".wsCtn"))
        if Workplace_del == Workplace:
            print("数据分析->工作集->删除新增加的工作空间成功,其数量为%d" % (Workplace_del-1))
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->工作集->删除新增加的工作空间失败,请检查!"



        #对模板的操作
        #进入模板
        time.sleep(1)
        driver.find_element_by_id("btnShowTemplate").click()
        time.sleep(4)
        #模糊匹配，找出包括+在内的模板
        tem = driver.find_elements_by_css_selector("#anlsPane div[class~='template']")
        if tem == []:
            assert 0,'数据分析->工作集->进入模板界面，模板丢失!'
        else:
            print("模板数量为%d" % (len(tem)-1))
        #点击+按钮
        driver.find_element_by_css_selector('.glyphicon.glyphicon-plus').click()
        time.sleep(1)
        try:
            #driver.switch_to_alert().accept()
            sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认']
            sure[0].click()
            #driver.find_element_by_css_selector(".btn.btn-info.alert-button").click()
        except Exception:
            assert 0,"未选择项目->数据分析->工作集->进入模板界面，点击添加模板按钮，没有弹出\'请先选择项目\'的提示框!"
        # 返回工作空间
        driver.find_element_by_id("btnReturnToWorkspace").click()
        time.sleep(0.5)
        back = len(driver.find_elements_by_css_selector(".wsCtn"))
        if  back:
            print("数据分析->工作集->进入模板后返回工作空间界面,工作空间数量为%d" % (back -1))
        else:
            assert 0,"数据分析->工作集->进入模板后返回工作空间界面,工作空间数量为0!"




    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case010('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)