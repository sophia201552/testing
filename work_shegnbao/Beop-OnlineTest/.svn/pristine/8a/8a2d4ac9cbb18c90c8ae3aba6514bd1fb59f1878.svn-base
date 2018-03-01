__author__ = 'woody'
import unittest
import time, datetime

class MyTestResult(unittest.TestResult):
    successes = []
    failures = []
    sendtime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time()))
    x = datetime.datetime.today()

    def addSuccess(self, test):
        test.test_id = test.testCaseID + test.projectName + test.buzName
        if self.successes != []:
            for case in self.successes:
                if test.testCaseID == case[0].testCaseID:
                    self.successes.remove(case)
            self.successes.append([test,{}])
        else:
            self.successes.append([test,{}])


    def addError(self, test, err):
        test.test_id = test.testCaseID + test.projectName + test.buzName
        if self.failures != []:
            for case in self.failures:
                if test.testCaseID == case[0].testCaseID:
                    self.failures.remove(case)
            self.failures.append([test, err])
        else:
            self.failures.append([test, err])

    def addFailure(self, test, err):
        test.test_id = test.testCaseID + test.projectName + test.buzName
        if self.failures != []:
            for case in self.failures:
                if test.testCaseID == case[0].testCaseID:
                    self.failures.remove(case)

            self.failures.append([test, err])
        else:
            self.failures.append([test, err])

