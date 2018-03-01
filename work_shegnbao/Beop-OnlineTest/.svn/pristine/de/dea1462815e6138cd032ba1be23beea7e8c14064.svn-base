__author__ = 'woody'

import requests
from interfaceTest.Methods.BeopTools import *
import unittest
from interfaceTest import app
from datetime import datetime
import json
from requests.exceptions import ConnectTimeout

errors = []
url = "http://%s" % app.config['EXPERT_CONTAINER_URL']
class Calc008(unittest.TestCase):
    testCaseID = 'Calc008'
    projectName = "上海中芯国际"
    buzName = 'ExpertContainer是否存活'
    start = 0.0



    def setUp(self):
        self.start = datetime.now()


    def Test(self):
        global errors
        a = BeopTools()
        try:
            r = requests.get(url,timeout=10)
            if r.text == "ExpertContainer is running!":
                print(r.text)
            else:
                errors.append("错误信息算法容器ExpertContainer运行异常，请检查！")
        except Exception as e:
            print(e.__str__())
            errors.append("错误信息算法容器ExpertContainer运行异常,连接超过10秒,请检查！%s" % e.__str__())
        #抛出异常!
        errors2 = errors
        errors = []
        self.raiseError(errors2)



    #抛出异常函数
    def raiseError(self,error):
        if error != []:
            #print("\n".join(error))
            assert 0,"\n".join(error)
        else:
            pass


    def tearDown(self):
        use1 = str((datetime.now() - self.start).seconds)
        use = use1 + "s"
        now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())










if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Calc008('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
