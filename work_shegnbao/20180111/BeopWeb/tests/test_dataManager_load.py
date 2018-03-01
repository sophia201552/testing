from beopWeb.mod_admin.dataManagerControllers import do_test_dataManager_load
import pytest
import json

mark1 = pytest.mark.p0
mark2 = pytest.mark.parametrize(
        ("user_id","project_id","expected"),
        [
        (2265,72,["bottom_patch_1_fault","A11AHU_A_11_PressSaOut","A11AHU_A_11_TempSaIn","A11AHU_A_11_VFCtrl"]),
        (2265,49,["A11AHU_A_11_DmprEaCtrl","A11AHU_A_11_DmprOaCtrl","A11AHU_A_11_PressSaOut","A11AHU_A_11_TempSaInSp"]),
        (2265,293,["L10S1_AHU1_hotWaterValve","L10S1_AHU1_OADamperMin","L10S1_AHU1_reliefAirDampersPosition","L10S1_AHU1_returnAirDampe"]),
        (2265,395,["B1F_CHW_VlveV6_OffState"])
        ]
)


@mark1
@mark2
def test_dataManager_load(user_id,project_id,expected):
    rt = do_test_dataManager_load(user_id,project_id).data
    assert rt,"得到数据为空，期望数据有值"
    rt = json.loads(rt.decode("utf-8"))
    status = rt.get("success")
    code = rt.get("code")
    points = rt.get("data").get("points").split(",")
    assert status and code=="1","返回状态值为'success':%s,'code':%s，期望值为'success':True,'code':1"%(status,code)
    for point in points:
        assert point in expected,"得到点数据为%s,期望点数据为%s"%(points,expected)
