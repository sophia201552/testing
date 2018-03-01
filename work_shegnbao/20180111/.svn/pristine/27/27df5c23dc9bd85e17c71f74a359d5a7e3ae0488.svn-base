import pytest
from beopWeb.mod_admin import dataManagerControllers
import json

mark1 = pytest.mark.p0
mark2 = pytest.mark.parametrize(("userId","projectId","expected"),[
    (2265,72,{"msg": "", "success": True, "code": "1"}),
    (2265,293,{"msg": "", "success": True, "code": "1"})
]
)


@mark1
@mark2
def test_dataPointManager_load(userId,projectId,expected):
    rv = dataManagerControllers.do_data_point_manager_load(userId,projectId).data
    assert rv,"实际结果为空，期望结果有数据"
    rv = json.loads(rv.decode("utf-8"))
    status = rv.get("success")
    code = rv.get("code")
    data = rv.get("data")
    if not status and code != 1 and not data:
        assert rv==expected,"请求值%s与预期值%s不同"%(rv,expected)