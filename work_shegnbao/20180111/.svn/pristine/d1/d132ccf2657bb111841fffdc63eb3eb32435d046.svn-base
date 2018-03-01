from beopWeb.mod_admin.dataManagerControllers import do_test_dataManager_remove
from beopWeb.mod_cxTool.pointSettingControllers import do_test__dataManager_remove
import pytest,json

fixture = pytest.fixture(scope="function")
mark1 = pytest.mark.p0
mark2 = pytest.mark.parametrize(
        ("user_id","project_id","points","expented"),
        [
            (2265,72,["test_kirry"],"true")
        ]

)




@fixture
def set_points(request):
    data = {"flag":0,"value":"test_kirry","alias":"test for unit","mapping":"test_kirry","logic":"return 1+12+1"}
    project_id = 72
    user_id = 2265
    rv = do_test__dataManager_remove(data,project_id,user_id)
    assert json.loads(rv.data.decode("utf-8")).get("success"),"新增云点失败"




@mark1
@mark2
@pytest.mark.usefixtures("set_points")
def test_dataManager_remove(user_id,project_id,points,expented):
    rt = do_test_dataManager_remove(user_id,project_id,points)
    rt = rt.data
    assert rt,"实际数据为空，期望数据有值"
    rt = json.loads(rt.decode("utf-8"))
    status = rt.get('success')
    assert status,"实际结果状态为false，预期结果状态为%s"%expented
