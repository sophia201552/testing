__author__ = 'wuranxu'
#测试数据分析模块中，在数据组中添加点后界面图表显示问题
from time import sleep
from Methods.MemcacheTools import MemcacheTools
from selenium.webdriver.common.action_chains import ActionChains
import datetime
from Methods.LoginTools import *




class Case008(unittest.TestCase):
    url = "http://%s" % app.config['SERVERIP']
    testCaseID = 'Case008'
    projectName = "不针对项目"
    buzName = '测试数据分析模块中，在数据组中添加点后图表显示问题'
    start = 0.0
    now = 'None'
    startTime = ""

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)




    def Test(self):
        driver = self.driver
        #driver.implicitly_wait(8)
        time.sleep(4)
        # 点击用户菜单，进入数据分析
        driver.find_element_by_id("iconList").click()
        try:
            #进入数据分析
            driver.find_element_by_id("btnDataAnalys").click()
        except Exception:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0, '不选择项目->点击用户下拉菜单->进入数据分析界面时出错!'
        a = WebDriverTools()
        a.waitSpinner(driver,'用户菜单--数据分析')
        time.sleep(1)
        #点击界面工作集按钮
        driver.find_element_by_css_selector(".breadcrumb>li>a").click()
        time.sleep(2)
        #获取工作空间的个数
        Workplace = driver.find_elements_by_css_selector(".wsCtn")
        #遍历找到自动化测试专用的工作空间

        for ele in Workplace:
            if ele.find_element_by_css_selector("span[class='name']").text == "自动化测试专用(勿删)":
                #进入该工作空间
                ele.click()
                break
        time.sleep(2)
        #点击左侧图表缩略图的第一个
        self.click_image()
        a.waitSpinner(driver,'数据分析--左侧工作空间')
        time.sleep(1)
        L,L2 = [],[]
        L = driver.find_elements_by_tag_name("canvas")
        for e in range(0,len(L)):
            width = L[e].get_attribute("width")
            height = L[e].get_attribute("height")
            print("数据分析->工作空间->图表宽度为%s" % width)
            print("数据分析->工作空间->图表高度为%s" % height)
            if int(width) > 600 and int(height) > 600:
                pass
            else:
                driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,"数据分析->工作空间->上海华为数据分析->图表尺寸显示不正常(图表宽高度与默认值不相等)"
            print("数据分析->工作空间->图表尺寸显示正常!")
        #2016-01-06版本 数据组发生变化   2017-3-22版本代码我的取消了该功能,不需要在进行下面的检查
        # dataGroup = driver.find_element_by_css_selector("#treeMine li:nth-child(1)")
        # getId = dataGroup.get_attribute("id")
        # ActionChains(driver).move_to_element(dataGroup).perform()
        # time.sleep(0.5)
        # dataGroup.find_element_by_css_selector("#addBtnPage_"+getId).click()
        # '''driver.find_element_by_css_selector("#treeMine li:nth-child(1)").click()
        # sleep(0.5)
        # driver.find_element_by_css_selector("#dataSrcPanel ul:nth-last-child(1) li span[id='data_source_add']").click()'''
        # sleep(1)
        # #点击选择项目按钮
        # driver.find_element_by_id('dataSrcPrjName').click()
        # #选择第一个项目：上海中芯国际
        # driver.find_element_by_css_selector("#dataSrcPrjName option:nth-child(1)").click()
        # a.waitSpinner(driver,'数据分析->添加数据点->加载中芯国际数据点')
        # time.sleep(1)
        # #选中该项目的第一个数据点
        # driver.find_element_by_css_selector("#tableWatch tbody>tr>td").click()
        # #点击确认按钮添加数据点
        # driver.find_element_by_id("btnAddDataSrc").click()
        # sleep(3)
        # L2 = driver.find_elements_by_tag_name("canvas")
        # for e in range(0,len(L2)):
        #     width2 = L2[e].get_attribute("width")
        #     height2 = L2[e].get_attribute("height")
        #     print("数据分析->工作空间->图表宽度为%s" % width2)
        #     print("数据分析->工作空间->图表高度为%s" % height2)
        #     if width2 == width and height2 == height:
        #         pass
        #     else:
        #         driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
        #         assert 0,"数据分析->工作空间->上海华为数据分析->添加数据点后图表尺寸显示不正常(图表宽高度与默认值不相等)"
        #     print("数据分析->工作空间->图表尺寸显示正常!")
        '''#找到新加的数据点并删除
        group = driver.find_elements_by_css_selector("#dataSrcPanel ul:nth-last-child(1) .treeRow.ui-draggable")
        length = len(group)
        #点击数据点
        driver.find_element_by_css_selector("#dataSrcPanel ul:nth-last-child(1) li.rows div:nth-last-child(1)").click()
        #点击删除按钮
        sleep(1)
        try:
            driver.find_element_by_css_selector("#dataSrcPanel ul:nth-last-child(1) li.rows div:nth-last-child(1) span.glyphicon.glyphicon-remove-sign.panel-heading-btn.grow.dsTreeBtnRemove").click()
        except Exception:
            assert 0,"数据分析->工作空间->上海华为数据分析->添加数据点后删除该点出现错误!"
        sleep(3)
        #验证数据点总数是否少了1个
        group2 = driver.find_elements_by_css_selector("#dataSrcPanel ul:nth-last-child(1) .treeRow.ui-draggable")
        length2 = len(group2)
        if length != length2 + 1:
            assert 0,"数据分析->工作空间->上海华为数据分析->添加数据点后，删除新增加的数据点失败!"
        print("删除数据点成功!")'''
    def click_image(self):
        driver = self.driver
        #e元素为第一个图的标题，默认为untitled
        e = driver.find_element_by_css_selector("#divWSPane>div>h4.divPageTitle")
        #将鼠标移动到e元素上方30px的地方并点击，达到进入该图表的功能
        ActionChains(driver).move_to_element_with_offset(e,0,30).click().perform()

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})
        self.driver.quit()





if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case008('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
