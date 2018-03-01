from beopWeb.mod_admin.dataManagerControllers import do_test_dataPointManager_load
import pytest,json


mark1 = pytest.mark.p0
mark2 = pytest.mark.parametrize(
        ("user_Id","project_Id","expected"),
        [
            (2265,72,["bottom_patch_1_fault","A11AHU_A_11_PressSaOut","A11AHU_A_11_TempSaIn","A11AHU_A_11_VFCtrl"]),
            (2265,49,["A11AHU_A_11_DmprEaCtrl","A11AHU_A_11_DmprOaCtrl","A11AHU_A_11_PressSaOut","A11AHU_A_11_TempSaInSp"]),
            (2265,293,["L10S1_AHU1_hotWaterValve","L10S1_AHU1_OADamperMin","L10S1_AHU1_reliefAirDampersPosition"]),
            #(2265,395,["B1F_CHW_VlveV6_OffState"])
        ]
)

@mark1
@mark2
def test_dataPointManager_loadData(user_Id,project_Id,expected):
    rt = do_test_dataPointManager_load(user_Id,project_Id)
    assert rt,"得到数据为空，期望数据有值"
    rt = json.loads(rt)
    rtlist = rt.get("list")
    assert len(rtlist)==len(expected),"得到的数据长度为%s,期望数据为%s"%(len(rtlist),len(expected))
    pointName = [point.get("name") for point in rtlist]
    for point in pointName:
        assert point in expected,"得到点的名称为{0}，期望点的名称为{1}".format(pointName,expected)
