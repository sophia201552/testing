#edcoding=utf-8

from testlink import *
from tests.uitest.user import *
from datetime import datetime

class TestLinkAccess:

    _DEFAULT_IP = '192.168.1.240'
    _URL = "http://%s/lib/api/xmlrpc/v1/xmlrpc.php" % (_DEFAULT_IP,)

    _TLC_MAP = \
        {
            'mango': None,
            'kirry': None,
            'sophia': None,
            'angelia': None,
        }

    def __init__(self, name):
        self.name = name
        self.tlc = self.get_client_by_user_name(name)

    def get_client_by_user_name(self, name):
        if name not in get_name_list():
            raise Exception("name is invalid")
        tlc = TestLinkAccess._TLC_MAP.get(name)
        if tlc is None:
            tlc = TestlinkAPIClient(TestLinkAccess._URL, get_key_by_name(name))
            TestLinkAccess._TLC_MAP[name] = tlc
        return tlc

    def get_project_id(self, project_name = "BeopWeb"):
        return self.tlc.getProjectIDByName(project_name)

    def get_test_plan(self):
        return self.tlc.getProjectTestPlans(self.get_project_id())

    def get_builds_for_test_plan(self, plan_id):
        return self.tlc.getBuildsForTestPlan(plan_id)

    def get_test_plan_id(self, plan_name):
        plan_id = None
        plans = self.get_test_plan()
        for item in plans:
            if item.get("name") == plan_name:
                plan_id = item.get("id")
                break
        return plan_id

    def create_build(self, plan_name, build_name):
        plan_id = self.get_test_plan_id(plan_name)
        if plan_id is not None:
            if not build_name:
                now_time = datetime.now()
                build_name = "早班-%04d%02d%02d"%(now_time.year, now_time.month, now_time.day)
            build_name_list = [x.get("name") for x in self.get_builds_for_test_plan(plan_id)]
            if build_name not in build_name_list:
                self.tlc.createBuild(plan_id, build_name, "")
            else:
                raise Exception("%s is already exist for %s"%(build_name, plan_name))
        else:
            raise Exception("Get test plan id failed")

    def get_test_suit_for_test_plan(self, plan_name):
        plan_id = self.get_test_plan_id(plan_name)
        suits = self.tlc.getTestSuitesForTestPlan(plan_id)
        return suits

    def get_cases_for_suit(self, suit_id, deep=True, detail='full'):
        return self.tlc.getTestCasesForTestSuite(suit_id, deep, detail)



    # def get_all_case_ids_for_test_plan(self, plan_name):
    #     plan_id = self.get_test_plan_id(plan_name)
    #     if plan_id is None:
    #         raise Exception("%s is not exist"%(plan_name, ))
    #     all_cases = self.tlc.getTestCasesForTestPlan(plan_id)
    #     return [x for x in all_cases]
    #
    # def get_cases_detail(self, plan_name):
    #     detail = {"active":[], "deactive":[]}
    #     for id in self.get_all_case_ids_for_test_plan(plan_name):
    #         case_detail = self.get_test_case_detail(id)
    #         if case_detail.get("active") == '1':
    #             detail["active"].append(case_detail)
    #         else:
    #             detail["deactive"].append(case_detail)
    #     return detail
    #
    # def get_test_case_detail(self, case_id):
    #     return self.tlc.getTestCase(case_id)[0]



