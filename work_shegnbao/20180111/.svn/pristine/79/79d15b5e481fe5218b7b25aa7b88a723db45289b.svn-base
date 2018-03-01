from beopWeb.mod_admin.controllers import do_getPermission
import pytest
import json


mark1 = pytest.mark.p0
mark2 = pytest.mark.parametrize(
        ("data","exptends"),
    [

        ({"userId":2265},{"code":"1","success":True}),
        ({"userId":1},{"code":"1","success":True}),
        ({"userId":2},{"code":"1","success":True}),
        ({"userId":4},{"code":"1","success":True}),
        ({"userId":5},{"code":"1","success":True}),
        ({"userId":6},{"code":"1","success":True}),
        ({"userId":7},{"code":"1","success":True}),
        ({"userId":65},{"code":"1","success":True}),
        ({"userId":67},{"code":"1","success":True}),
        ({"userId":68},{"code":"1","success":True}),



    ]
)

@mark1
@mark2
def test_checkDbName(data,exptends):
    rv = do_getPermission(data)
    rv = rv.data
    assert rv,"调用方法后，返回数据为空"
    rv = json.loads(rv.decode("utf-8"))
    code = rv.get("code")
    status = rv.get("success")
    data = rv.get("data")
    assert code=="1" and status,"实际结果为{code:%s,success:%s}，期望结果为%s"%(code,status,exptends)
    assert data,"期望data有数据，实际数据为空"