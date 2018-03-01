import pytest,json
from beopWeb.mod_admin.controllers import do_checkDbName

mark1 = pytest.mark.p0
mark2 = pytest.mark.parametrize(
        ("data","exptends"),
    [
        ({"dbName":"airflow"},{"code":"1","success":True}),
        ({"dbName":"beopdatabuffer"},{"code":"1","success":True}),
        ({"dbName":"beopoperation"},{"code":"1","success":True}),
        ({"dbName":"diagnosis"},{"code":"1","success":True}),
    ]
)

@mark1
@mark2
def test_delete_project_role(data,exptends):
    rv = do_checkDbName(data)
    rv = rv.data
    assert rv,"调用方法后，返回数据为空"
    rv = json.loads(rv.decode("utf-8"))
    code = rv.get("code")
    status = rv.get("success")
    data = rv.get("data")
    assert code=="1" and status,"实际结果为{code:%s,success:%s}，期望结果为%s"%(code,status,exptends)
    assert data,"期望data有数据，实际数据为空"