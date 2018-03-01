__author__ = 'woody'
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
import unittest
import datetime, time
from selenium.webdriver.support.select import Select
from Methods.OtherTools import OtherTools
from Methods.WebDriverTools import WebDriverTools
from config import app
import os, csv, json, xlrd
from Methods.OldTools import OldTools

class Case045(unittest.TestCase):
    testCaseID = 'Case045'
    projectName = "MyTest"
    buzName = '现场点表导出/导入'
    now = 'None'
    errors = []
    url = "http://%s" % app.config['SERVERIP']
    downloadDir = app.config.get('DOWNLOAD_DIR')

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)
        self.a = WebDriverTools()



    def Test(self):
        driver = self.driver
        self.errors = []
        self.a.enterProject(driver, 49, self.projectName, self.errors)
        self.enterDataManage(driver)
        org_data = self.outPutData(driver)
        self.checkDownLoadList(org_data)
        self.upLoadFile(driver, org_data)
        self.delCsv()
        OtherTools.raiseError(self.errors)

    #进入数据管理页面
    def enterDataManage(self, driver):
        self.a.clickEle(driver, '#iconList', self.testCaseID, self.projectName, '用户菜单', self.errors)
        self.a.clickEle(driver, '#btnPointManager', self.testCaseID, self.projectName, '数据管理', self.errors)

    #导出数据
    def outPutData(self, driver):
        self.a.clickEle(driver, '#dataManagerCloudMenu li:nth-child(2) ul li:nth-child(1)',
                        self.testCaseID, self.projectName, '云点管理--现场点', self.errors)
        time.sleep(4)
        Select(driver.find_element_by_css_selector('.widget-sdt-rows-selector select')).select_by_value("1000")
        #先获取所有点表的信息再比对
        time.sleep(5)
        lines = driver.find_elements_by_css_selector('.table.table-bordered.table-striped tr')
        lines = lines[1:]
        org_data = []
        for line in lines:
            data = line.find_elements_by_css_selector('td')
            values = []
            for x in data:
                values.append(x.text)
            org_data.append(values)

        files_before = self.getDownloadList()
        print('导出点表前文件个数: %s' % files_before)
        self.a.clickEle(driver, '#point_export', self.testCaseID, self.projectName, '云点管理--现场点--导出点表', self.errors)
        time.sleep(10)
        files_after = self.getDownloadList()
        print('导出点表后文件个数: %s' % files_after)
        if files_after > files_before:
            print('文件下载成功!')
        else:
            self.errors.append('CaseID: %s, error: %s项目--数据管理--现场点--导出点表失败!' % (self.testCaseID, self.projectName, ))
        return org_data


    def checkDownLoadList(self, org_data):
        pointList = []
        try:
            for data in org_data:
                pointList.append([data[0], data[1], data[2]])
        except:
            print(data)
        org_data_temp = pointList[:]
        #xlxs = xlrd.open_workbook(self.downloadDir + '\\%s.xlsx' % self.projectName)
        lines = OldTools.xlsx(self.downloadDir + '\\%s.xlsx' % self.projectName)



        '''with open(self.downloadDir + '\\%s.csv' % self.projectName, encoding='utf-8') as csvFile:
            reader = csv.reader(csvFile)
            lines = [line for line in reader]'''
        #比对下载文件里的点的个数是否一样
        if len(org_data)!= len(lines):
            self.errors.append("CaseID: %s 项目名称: %s, error: 数据管理--现场点---导出点表后点表数量与原始不一致!网页中点个数为%d, csv文件点个数为%d" % (self.testCaseID, self.projectName, len(org_data), (len(lines)-1)))
        else:
            print('下载后的点表与web端显示的个数一致!')
        org_data_temp = sorted(org_data_temp)
        for index, line in enumerate(sorted(lines)):
            if line[0] in org_data_temp[index]:
                pass
            else:
                if 'mapping' in line:
                    pass
                else:
                    self.errors.append('CaseID: %s 项目名称: %s, error: 数据管理--现场点---导出点表后的csv中含有不存在的点!详细信息为%s' % (self.testCaseID, self.projectName, json.dumps(line)))




    def upLoadFile(self, driver, org_data):
        time.sleep(5)
        #self.a.clickEle(driver, '#point_import',self.testCaseID, self.projectName, '数据管理--现场点--导入点表', self.errors)
        #driver.execute_script('$("#point_import").click()')
        driver.find_element_by_css_selector('#uploadInput').click()
        #调用exe完成上传工作
        os.system(r'%s\Other\%s.exe' % (app.config['BASE_DIR'], self.testCaseID))
        time.sleep(10)
        self.a.clickEle(driver, '.btn.btn-info.alert-button', self.testCaseID, self.projectName, '数据管理--现场点--导入点表弹出框', self.errors)
        lines = driver.find_elements_by_css_selector('tbody.sheet-body tr')
        now_data = []
        for line in lines:
            data = line.find_elements_by_css_selector('td')
            values = []
            for x in data:
                values.append(x.text)
            now_data.append(values)
        if now_data != org_data:
            print("原始点表导出后再导入结果与之前不同!")
        else:
            print('原始点表导出后再导入结果与之前相同!')

    def delCsv(self):
        csv_path = self.downloadDir + '\\%s.xlsx' % self.projectName
        os.system('del %s' % csv_path)

    def getDownloadList(self):
        for root,dirs,files in os.walk(self.downloadDir):
            return len(files)





    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case045('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)

