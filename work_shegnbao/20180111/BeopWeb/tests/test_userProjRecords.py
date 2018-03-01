from beopWeb.mod_admin.controllers import do_userProjRecords
import pytest,json




mark1 = pytest.mark.p0
mark2 = pytest.mark.parametrize(
        ("rq_data","exptends"),
    [(
        {"userId":2265},{"code":1,"success":True}
    )]
)

@mark1
@mark2
def test_userProjRecords(rq_data,exptends):
    rv = do_userProjRecords(rq_data)
    rv = rv.data
    assert rv,"期望结果有数据，实际结果为空！"
    rv = json.loads(rv.decode("utf-8"))
    status = rv.get("success")
    code = rv.get("code")
    data = rv.get("data")
    assert code=="1" and status,"实际结果为{code:%s,success%s},期望结果为%s"%(code,status,exptends)
    assert data,"实际返回数据data为空，期望返回有数据！"
