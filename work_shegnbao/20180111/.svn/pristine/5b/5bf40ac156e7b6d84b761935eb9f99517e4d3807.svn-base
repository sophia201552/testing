from beopWeb.mod_admin.controllers import do_checkRealTimeDb
import pytest
import json

mark1 = pytest.mark.p0
mark2 = pytest.mark.parametrize(
        ("data","exptends"),
    [

        ({"realTimeDb":"beopdatabuffer"},{"code":"1","success":True}),

    ]
)

@mark1
@mark2
def test_checkDbName(data,exptends):
    rv = do_checkRealTimeDb(data)
    rv = rv.data
    assert rv,"调用方法后，返回数据为空"
    rv = json.loads(rv.decode("utf-8"))
    code = rv.get("code")
    status = rv.get("success")
    assert code=="1" and status,"实际结果为{code:%s,success:%s}，期望结果为%s"%(code,status,exptends)
