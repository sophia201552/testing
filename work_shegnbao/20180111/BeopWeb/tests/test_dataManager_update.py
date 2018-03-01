from beopWeb.mod_admin.dataManagerControllers import do_test_dataManager_update
import pytest,json
mark1 = pytest.mark.p0
mark2 =pytest.mark.parametrize(("userId","projectId","points","expected"),[
    (2265,72,"bottom_patch_1_fault,A11AHU_A_11_PressSaOut,A11AHU_A_11_TempSaIn,A11AHU_A_11_VFCtrl",{"data": None, "success": True, "code": "1", "msg": ""}),
    (2265,293,"L10S1_AHU1_hotWaterValve,L10S1_AHU1_OADamperMin,L10S1_AHU1_reliefAirDampersPosition,L10S1_AHU1_returnAirDampe",{"data": None, "success": True, "code": "1", "msg": ""})
])


@mark1
@mark2
def test_dataManager_update(userId,projectId,points,expected):
    rt = do_test_dataManager_update(user_id=userId,project_id=projectId,points=points)
    rt = json.loads(rt.data.decode("utf-8"))
    assert rt==expected,"实际值为%s,期望值为%s"%(rt,expected)

