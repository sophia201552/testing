from beopWeb.mod_admin.controllers import load_manager_account_info
import pytest,json

mark1 = pytest.mark.p0
exptend =[(1776, '1955308734'), (3617, '343942059@com.com'),
          (1, 'admin'), (77, 'algo'), (83, 'angela'), (456, 'Angelia'),
          (2365, 'AutoTester'), (2265, 'AutoTester'), (80, 'BeiruoZhu'),
          (2, 'BeOP'), (238, 'beopch'), (1560, 'beopcloud'), (162, 'bruce'),
          (1511, 'carol'), (81, 'charles'), (1334, 'chery'), (1368, 'Chuanling_ch'),
          (2398, 'David'), (1760, 'eric'), (203, 'feng'), (451, 'frank'), (82, 'glennwu'),
          (3265, 'Glennwudemo'), (114, 'golding'), (3650, 'Good'), (373, 'GuestManager'), (365, 'harvey'),
          (1502, 'Helen'), (6, 'hradmin'), (4, 'hwadmin'), (285, 'irene'), (513, 'irenel'), (139, 'irwin'),
          (173, 'jason'), (364, 'jessie'), (1649, 'kevin'), (217, 'kim.wu'), (67, 'kingsley'), (65, 'KRUZ'),
          (2200, 'lefi'), (405, 'lily'), (1509, 'Lion\r\n'), (255, 'lydia'), (215, 'owen'), (377, 'owen-test'),
          (1346, 'owen-test1'), (68, 'rikan'), (218, 'robin'), (85, 'roger'), (1442, 'russell'), (3283, 'salesadmin'),
          (1096, 'scqunkong'), (205, 'sean.zhang'), (84, 'shengchun'), (1508, 'Shirley\r\nShirley\r\n'),
          (2686, 'sliu@facilit'), (1608, 'sophia'), (2428, 'sophia199111'), (2399, 'supporter'), (366, 'teddy'),
          (382, 'tianming'), (448, 'tina'), (194, 'ting'), (3200, 'Tony'), (3600, 'tony_test'), (282, 'vivi'),
          (463, 'wayne'), (2715, 'Wendy'), (404, 'woody'), (1708, 'yiyi'), (3666, '凯德管理员'), (2276, '吴诚云'),
          (1890, '大客户经理演示账号'), (384, '张强'), (3654, '演示专用'), (3151, '王兵'), (374, '王力'),
          (2474, '苏经理'), (3299, '蔡孝栋'), (1449, '项目管理010'), (1451, '项目管理013'), (1452, '项目管理014'),
          (1453, '项目管理015'), (1454, '项目管理016'), (1455, '项目管理017'), (1456, '项目管理018'), (1457, '项目管理019'),
          (1458, '项目管理020'), (1459, '项目管理021'), (1460, '项目管理022'), (1461, '项目管理023'), (1462, '项目管理024'),
          (1463, '项目管理025'), (1464, '项目管理026'), (1465, '项目管理027'), (1466, '项目管理028'), (1467, '项目管理029'),
          (1468, '项目管理030')
          ]



@mark1
def test_loadManagerAccountInfo():
    rt = load_manager_account_info()
    rt = rt.data
    assert rt,"实际结果空，期望有值！"
    rt = json.loads(rt.decode("utf-8"))
    status = rt.get("success")
    code = rt.get("code")
    data = rt.get("data")
    data = [(i.get("id"),i.get("userfullname")) for i in data]
    assert status and code == "1","实际返回数据{success:%s,code:%s},期望返回数据为{success:True,code:1}"%(status,code)
    assert data.__len__()==exptend.__len__(),"实际返回data数据长度为%s,期望返回数据长度为%s"%(data.__len__(),exptend.__len__())
    for dt in data:
        assert dt in exptend,"实际返回data数据为%s,期望返回数据为%s"%(data,exptend)

