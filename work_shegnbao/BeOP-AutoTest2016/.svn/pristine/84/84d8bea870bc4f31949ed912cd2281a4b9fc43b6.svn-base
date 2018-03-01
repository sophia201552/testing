'''
Created on 2015年7月29日

@author: Anthony
'''
import unittest, time, random
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import NoSuchElementException
import datetime
from Methods.MemcacheTools import MemcacheTools
from Methods.OldTools import OldTools
from Methods.WebDriverTools import WebDriverTools
from Methods.LoginTools import LoginTools
tag = 'Shanghai Huawei default web-page after login'
shtag = 'Shanghai Huawei:Data Analysis>'
itemname = 'Case005SHHuawei'
tagname = 'Data Analysis'


class Case005(unittest.TestCase):
    testCaseID = 'Case005'
    projectName = '上海华为'
    buzName = '数据分析:图标'
    start = 0.0
    now = 'None'
    startTime = ""
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.loginInitial_Chrome(self.testCaseID)
        self.driver = lg.loginnow(self.driver)
        #WebDriverTools.getBrowserVersion(self.driver, 'Chrome')

    def Test(self):
        driver = self.driver
        itemproject = 'Shanghai Huawei'
        ls=['div[id="project-72-shhuawei-undefined"]', 'div[project-id="72"]']
        OldTools.icon_view_login(driver,self.projectName,ls)
        # Data Analysis tag-loading
        OldTools.tag_load_via_click(
            driver, 'Case005:', itemname, tagname, '#ulPages.nav.nav-pills.navbar-left>li:nth-child(5) .nav-btn-text')
        # statistic via clicking on workbench hyperlink
        a = ActionChains(driver)
        hover_config = driver.find_element_by_css_selector(
            '#anlsPaneContain ol.breadcrumb li a')
        time.sleep(3)
        a.move_to_element(hover_config).perform()
        hover_config.click()
        time.sleep(3)
        try:
            original_bench = driver.find_elements_by_css_selector(
                '#anlsPane .wsCtn')
        except Exception:
            assert 0, 'Case-103:找不到默认工作空间'
        if len(original_bench) > 0:
            original_bench[0].click()
            time.sleep(2)
        try:
            add_slide_button=driver.find_element_by_css_selector('#btnAddSlider .glyphicon-plus')
        except Exception:
            assert 0,'找不到添加Slider按钮'
        #Add slide
        if add_slide_button is not None:
            add_slide_button.click()
            time.sleep(4)
        # Data Analysis-Amount of icon text
        iconmixed = {"AnlzTendency": "AnlzTendency", "AnlzSpectrum": "AnlzSpectrum", "AnlzScatter": "AnlzScatter",
                     "AnlzHistoryCompare": "AnlzHistoryCompare", "AnlzHistoryCompare_Line": "AnlzHistoryCompare_Line",
                     "AnlzStack": "AnlzStack",
                     "AnlzPieRealtime": "AnlzPieRealtime", "AnlzEnergy": "AnlzEnergy",
                     # "AnlzCluster": "PatternAnalysis", "AnlzCluster_AHU": "AHUDiagnosis",
                     # "AnlzCluster_Chiller": "Chiller Machine Diagnosis"
                     }
        OldTools.get_texts_or_icons('Case-104:', driver, itemname, 'Data Analysis',
                                     'div[id="anlsPane"] .anlsTemplate[templatetype=""] h3', iconmixed)
        # Calculate the amount of workbench
        '''ogn = 0
        workbenchid = '55b1fa1b2575230fd86181ea'
        benchname = "Workbench20"
        # Workbench,Overview API post
        url = 'http://192.168.1.208/analysis/modal/save/278'
        if len(original_bench) >0:
            ogn = len(original_bench)
        else:
            # Add workbench now
            try:
                group = driver.find_element_by_css_selector(
                    '#anlsPane .glyphicon-plus')
            except NoSuchElementException:
                assert 0, 'Case-103:不能找到创建工作空间按钮'
            # Add workbench
            if group is not None:
                group.click()
            original_bench = driver.find_elements_by_css_selector(
                '#anlsPane div.wsSet.ws-item')
            if len(original_bench) == ogn + 1:
                pass
            else:
                assert 0, "Case-103,创建工作组失败"
            try:
                edit_group = driver.find_elements_by_css_selector(
                    '#anlsPane .infoWrap .wsNameEdit')
            except NoSuchElementException:
                assert 0, 'Case-103:工作空间组不能被编辑，找不到编辑按钮'
            if len(edit_group) > 0:
                try:
                    edit_group[len(edit_group) - 1].click()
                except NoSuchElementException:
                    assert 0, 'Case-103,点击工作空间编辑按钮失败'
            # get textbox type input
            time.sleep(2)
            driver.find_element_by_css_selector('input[type="text"]').clear()
            benchname = 'Workbench' + str(random.randint(3, 300))
            driver.find_element_by_css_selector(
                'input[type="text"]').send_keys(benchname)
            time.sleep(2)
            # Add workbench via API
            benchname = 'Workbench' + str(random.randint(9, 999))
            current_date = time.strftime('%Y-%m-%d %H:%M', time.localtime(time.time()))
            paramdic = {'workspaceName': benchname, 'modalList': [
            ], ' modifyTime': current_date, 'modal': {'option': {}, 'imagebin': ""}}
            workbenchid = BaseLogin.get_xid('workspaceId', url, paramdic)
            # Calculate the amount of workbench again
            try:
                original_bench = driver.find_elements_by_css_selector(
                    '#anlsPane div.wsSet.ws-item')
            except Exception:
                assert 0, 'Case-103:统计当前工作组失败'
            if len(original_bench) == ogn + 2:
                pass
            else:
                assert 0, "Case-103,创建工作组失败"
            # Re-click for local refresh
            BaseLogin.tag_load_via_click(
                driver, 'Case-103:', itemname, tagname,
                '#ulPages.nav.nav-pills.navbar-left>li:nth-child(5) .nav-btn-text')

        # Enter workbench
        original_bench[len(original_bench) - 1].click()

        # calculate the amount of overview
        overview_id = '55b747fa2575230d4c47bdec'
        try:
            overview = driver.find_elements_by_css_selector(
                'div[id="anlsPane"] .slider-item[style=""] .effect')
        except Exception:
            assert 0, 'Case-103,找不到工作空间的缩略图'
        if len(overview) > 0:
            pass
        else:
            try:
                overview_addbutton = driver.find_element_by_css_selector(
                    '#btnAddSlider .glyphicon-plus')
            except NoSuchElementException:
                assert 0, 'Case-103:找不到视图添加按钮'
            # Click on + to create a new one
            if overview_addbutton is not None:
                overview_addbutton.click()
            overview_now = driver.find_elements_by_css_selector(
                'div[id="anlsPane"] .slider-item[style=""] .effect')
            if len(overview) + 1 == len(overview_now):
                pass
            else:
                assert 0, '创建缩略图失败'
            currentdate = time.strftime('%Y-%m-%d', time.localtime(time.time()))
            overview_name = 'Overview' + str(random.randint(1110, 9990))
            paramdic2 = {'workspaceId': workbenchid, 'workspaceName': benchname, 'modal': {
                'name': overview_name, 'note': "", 'option': {}, 'type': "", 'modifyTime': currentdate,
                '__observeProps': {'name': ""}}}
            overview_id = BaseLogin.get_xid('modalId', url, paramdic2)
        time.sleep(2)
        overview_locator = '#cp_' + overview_id
        # driver.find_element_by_css_selector(overview_locator).click()
        # driver.execute_javascript()
        overbox = driver.find_element_by_css_selector(overview_locator)
        x = overbox.size.get('height')
        y = overbox.size.get('width')
        action = ActionChains(driver)
        action.move_to_element(overbox)
        action.move_by_offset(x, y)
        action.click()
        action.perform()
        # driver.execute_script('document.getElementById("'+overview_id+'").click();')
        time.sleep(3)
        # Data Analysis-Amount of icon text
        iconmixed = {"AnlzTendency": "Tendency", "AnlzSpectrum": "Spectrum", "AnlzScatter": "Scatter",
                     "AnlzHistoryCompare": "HistoryCompared", "AnlzHistoryCompare_Line": "History Curved",
                     "AnlzStack": "Area",
                     "AnlzPieRealtime": "RealTimePieChart", "AnlzEnergy": "EnergyConsumedHistogram",
                     "AnlzCluster": "PatternAnalysis", "AnlzCluster_AHU": "AHUDiagnosis",
                     "AnlzCluster_Chiller": "Chiller Machine Diagnosis"}
        BaseLogin.get_texts_or_icons('Case-104:', driver, itemname, 'Data Analysis',
                                     'div[id="anlsPane"] .anlsTemplate[templatetype=""] h3', iconmixed)
        # Data Analysis-icon image
        BaseLogin.get_texts_or_icons('Case-104:', driver, itemname, 'Data Analysis-icon:',
                                     'div[id="anlsPane"] .anlsTemplate[templatetype=""] .templateImg', iconmixed)
        # Data Analysis-Colour
        for c in sorted(iconmixed.keys()):
            ps = driver.find_element_by_css_selector(
                'div[id="anlsPane"] .anlsTemplate[templatetype="' + c + '"] .templateImgBg')
            colour = ps.value_of_css_property('background-color')
            if colour is None:
                assert 0, 'Case-104:' + shtag + ' icon-,' + \
                          iconmixed.get(c) + ',of which colour lost'
            else:
                pass'''

    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case005('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)