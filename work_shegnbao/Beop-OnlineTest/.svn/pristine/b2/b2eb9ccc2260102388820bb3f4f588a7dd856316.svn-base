__author__ = 'sophia'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time
import re



class Smoke027(unittest.TestCase):
    testCaseID = 'Smoke027'
    projectName = "不针对项目"
    buzName = '验证计算点api文档是否是中文'
    timeout = 15
    serverip = app.config['SERVERIP']
    url_api = "http://%s/static/help/zh/cloud_point_api.html" % (serverip)


    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.check()
        BeopTools.raiseError(self.errors, self.testCaseID)

    def check(self):
        # 验证api文档的内容
        data_get = None
        try:
            data_get = BeopTools.getDataText(url=self.url_api, timeout=self.timeout)
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---访问%s接口失败" % (BeopTools.getTime(), self.testCaseID, self.url_api))

        if (data_get != None):
            res_h1 = r'<h1>(.*?)</h1>'
            m_h1 = re.findall(res_h1, data_get)
            for m in range(len(m_h1)):
                if 'API' in m_h1[m] or 'Detail' in m_h1[m]:
                    self.errors.append("错误信息[%s]%s---请求%s网址 API中文文档获取文档内容中<h1>标签内的内容,返回值不是中文,返回为%s" % (
                        BeopTools.getTime(), self.testCaseID, self.url_api, m_h1[m]))
                else:
                    print('已经显示为中文')
            res_h4 = r'<h4>(.*?)</h4>'
            m_h4 = re.findall(res_h4, data_get)
            for m in range(len(m_h4)):
                if m_h4[m] in ['Description', 'Paramters:', 'Sample', 'one point', 'return', 'more points']:
                    self.errors.append("错误信息[%s]%s---请求%sAPI中文文档获取文档内容中<h4>标签内的内容,返回值不是中文,返回为%s" % (
                    BeopTools.getTime(), self.testCaseID, self.url_api, m_h4[m]))
                else:
                    print('已经显示为中文')
            res_p = r'<p>(.*?)</p>'
            m_p = re.findall(res_p, data_get)
            for m in range(len(m_p)):
                if ('--' in m_p[m]):
                    p = m_p[m].split('--')[1]
                    if (p >= 'a' and p <= 'z') or (p >= 'A' and p <= 'Z'):
                        self.errors.append("错误信息[%s]%s---请求%sAPI中文文档获取文档内容中<p>标签内参数说明的内容,返回值不是中文,返回为%s" % (
                        BeopTools.getTime(), self.testCaseID, self.url_api, p))
                    else:
                        print('已经显示为中文')


    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke027('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
