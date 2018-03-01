#coding=utf-8
__author__ = 'angelia'

import pytest
from tests.utils import TestCommon

@pytest.mark.p0
def test_GetProjectPermissionByUserId():
    rt = TestCommon.GetProjectPermissionByUserId.run({
        'userId':1151
    })
    expected = {
        "1": {
            "projectName_en": "Simc",
            "projectName": "上海中芯国际",
            "roles": [
                {
                    "roleId": 1,
                    "roleName": "RNB研发"
                }
            ]
        },
        "10": {
            "projectName_en": "Wanda Kunming (Hotel)",
            "projectName": "昆明万达酒店",
            "roles": [
                {
                    "roleId": 11,
                    "roleName": "RNB研发"
                }
            ]
        },
        "11": {
            "projectName_en": "Wanda Kunming (Commercial)",
            "projectName": "昆明万达商业",
            "roles": [
                {
                    "roleId": 12,
                    "roleName": "RNB研发"
                }
            ]
        },
        "12": {
            "projectName_en": "Wanda Kunming (Shopping Mall)",
            "projectName": "昆明万达百货",
            "roles": [
                {
                    "roleId": 13,
                    "roleName": "RNB研发"
                }
            ]
        },
        "17": {
            "projectName_en": "Huawei Shenzhen",
            "projectName": "深圳华为",
            "roles": [
                {
                    "roleId": 18,
                    "roleName": "RNB研发"
                }
            ]
        },
        "49": {
            "projectName_en": "myTest",
            "projectName": "myTest",
            "roles": [
                {
                    "roleId": 121,
                    "roleName": "RNB研发"
                }
            ]
        },
        "71": {
            "projectName_en": "DemoEn06-R&D center",
            "projectName": "DemoEn06-R&D center",
            "roles": [
                {
                    "roleId": 144,
                    "roleName": "RNB研发"
                }
            ]
        },
        "72": {
            "projectName_en": "shhuawei",
            "projectName": "上海华为",
            "roles": [
                {
                    "roleId": 129,
                    "roleName": "业主"
                }
            ]
        },
        "74": {
            "projectName_en": "TestSquare",
            "projectName": "TestSquare",
            "roles": [
                {
                    "roleId": 162,
                    "roleName": "RNB研发"
                }
            ]
        },
        "76": {
            "projectName_en": "DemoCh06",
            "projectName": "演示06",
            "roles": [
                {
                    "roleId": 147,
                    "roleName": "维护组"
                }
            ]
        },
        "77": {
            "projectName_en": "KerryJingan",
            "projectName": "静安嘉里中心",
            "roles": [
                {
                    "roleId": 156,
                    "roleName": "RNB研发"
                }
            ]
        },
        "80": {
            "projectName_en": "TheCenter",
            "projectName": "世纪商贸",
            "roles": [
                {
                    "roleId": 176,
                    "roleName": "RNB研发"
                }
            ]
        },
        "84": {
            "projectName_en": "Galaxy",
            "projectName": "深圳星河发展中心",
            "roles": [
                {
                    "roleId": 174,
                    "roleName": "RNB研发"
                }
            ]
        },
        "100": {
            "projectName_en": "YangzhouColgate",
            "projectName": "扬州高露洁",
            "roles": [
                {
                    "roleId": 220,
                    "roleName": "RNB组态"
                }
            ]
        },
        "120": {
            "projectName_en": "MercedesBenzArena",
            "projectName": "梅赛德斯奔驰",
            "roles": [
                {
                    "roleId": 303,
                    "roleName": "pa"
                }
            ]
        },
        "128": {
            "projectName_en": "Celestica_Suzhou_Technology",
            "projectName": "苏州天弘（科技）有限公司 Celestica (Suzhou)",
            "roles": [
                {
                    "roleId": 319,
                    "roleName": "pa"
                }
            ]
        },
        "175": {
            "projectName_en": "DemoEn09",
            "projectName": "英文演示项目09",
            "roles": [
                {
                    "roleId": 560,
                    "roleName": "sales"
                }
            ]
        },
        "293": {
            "projectName_en": "175LiverpoolStreet",
            "projectName": "175Liverpoolst",
            "roles": [
                {
                    "roleId": 863,
                    "roleName": "test"
                }
            ]
        },
        "316": {
            "projectName_en": "CorporateAvenue03",
            "projectName": "企业天地3号楼",
            "roles": [
                {
                    "roleId": 590,
                    "roleName": "pa"
                }
            ]
        },
        "373": {
            "projectName_en": "xiongmaoyunpingtai",
            "projectName": "中电熊猫云平台",
            "roles": [
                {
                    "roleId": 664,
                    "roleName": "pa"
                }
            ]
        },
        "391": {
            "projectName_en": "nbcnlfs",
            "projectName": "长宁来福士",
            "roles": [
                {
                    "roleId": 691,
                    "roleName": "pa"
                }
            ]
        },
        "394": {
            "projectName_en": "Bugis Plus",
            "projectName": "新加坡Bugis+",
            "roles": [
                {
                    "roleId": 698,
                    "roleName": "pa"
                }
            ]
        },
        "396": {
            "projectName_en": "Canature",
            "projectName": "开能环保",
            "roles": [
                {
                    "roleId": 862,
                    "roleName": "test"
                }
            ]
        },
        "419": {
            "projectName_en": "SingaporeBugisCn",
            "projectName": "新加坡武吉士",
            "roles": [
                {
                    "roleId": 736,
                    "roleName": "pa"
                }
            ]
        },
        "466": {
            "projectName_en": "DemoCBRE",
            "projectName": "DemoCBRE",
            "roles": [
                {
                    "roleId": 799,
                    "roleName": "pa"
                }
            ]
        },
        "473": {
            "projectName_en": "GSA Demo",
            "projectName": "美国某项目",
            "roles": [
                {
                    "roleId": 809,
                    "roleName": "pa"
                }
            ]
        },
        "494": {
            "projectName_en": "LogisticsDemo",
            "projectName": "物流平台demo",
            "roles": [
                {
                    "roleId": 839,
                    "roleName": "pa"
                }
            ]
        },
        "575": {
            "projectName_en": "Facility Matrix Demo",
            "projectName": "Facility Matrix Demo",
            "roles": [
                {
                    "roleId": 950,
                    "roleName": "pa"
                }
            ]
        }
}
    TestCommon.GetProjectPermissionByUserId.assert_result_equal(expected, rt)

@pytest.mark.p0
def test_GetProjectPermissionByUserId_lower():
    rt = TestCommon.GetProjectPermissionByUserId.run({
        'userId': 1151
    })
    expected = {
        "1": {
            "roles": [
                {
                    "roleName": "RNB研发",
                    "roleId": 1
                }
            ],
            "projectName": "上海中芯国际",
            "projectName_en": "Simc"
        },
        "10": {
            "roles": [
                {
                    "roleName": "RNB研发",
                    "roleId": 11
                }
            ],
            "projectName": "昆明万达酒店",
            "projectName_en": "Wanda Kunming (Hotel)"
        },
        "11": {
            "roles": [
                {
                    "roleName": "RNB研发",
                    "roleId": 12
                }
            ],
            "projectName": "昆明万达商业",
            "projectName_en": "Wanda Kunming (Commercial)"
        },
        "12": {
            "roles": [
                {
                    "roleName": "RNB研发",
                    "roleId": 13
                }
            ],
            "projectName": "昆明万达百货",
            "projectName_en": "Wanda Kunming (Shopping Mall)"
        },
        "17": {
            "roles": [
                {
                    "roleName": "RNB研发",
                    "roleId": 18
                }
            ],
            "projectName": "深圳华为",
            "projectName_en": "Huawei Shenzhen"
        },
        "49": {
            "roles": [
                {
                    "roleName": "RNB研发",
                    "roleId": 121
                }
            ],
            "projectName": "myTest",
            "projectName_en": "myTest"
        },
        "71": {
            "roles": [
                {
                    "roleName": "RNB研发",
                    "roleId": 144
                }
            ],
            "projectName": "DemoEn06-R&D center",
            "projectName_en": "DemoEn06-R&D center"
        },
        "72": {
            "roles": [
                {
                    "roleName": "业主",
                    "roleId": 129
                }
            ],
            "projectName": "上海华为",
            "projectName_en": "shhuawei"
        },
        "74": {
            "roles": [
                {
                    "roleName": "RNB研发",
                    "roleId": 162
                }
            ],
            "projectName": "TestSquare",
            "projectName_en": "TestSquare"
        },
        "76": {
            "roles": [
                {
                    "roleName": "维护组",
                    "roleId": 147
                }
            ],
            "projectName": "演示06",
            "projectName_en": "DemoCh06"
        },
        "77": {
            "roles": [
                {
                    "roleName": "RNB研发",
                    "roleId": 156
                }
            ],
            "projectName": "静安嘉里中心",
            "projectName_en": "KerryJingan"
        },
        "80": {
            "roles": [
                {
                    "roleName": "RNB研发",
                    "roleId": 176
                }
            ],
            "projectName": "世纪商贸",
            "projectName_en": "TheCenter"
        },
        "84": {
            "roles": [
                {
                    "roleName": "RNB研发",
                    "roleId": 174
                }
            ],
            "projectName": "深圳星河发展中心",
            "projectName_en": "Galaxy"
        },
        "100": {
            "roles": [
                {
                    "roleName": "RNB组态",
                    "roleId": 220
                }
            ],
            "projectName": "扬州高露洁",
            "projectName_en": "YangzhouColgate"
        },
        "120": {
            "roles": [
                {
                    "roleName": "pa",
                    "roleId": 303
                }
            ],
            "projectName": "梅赛德斯奔驰",
            "projectName_en": "MercedesBenzArena"
        },
        "128": {
            "roles": [
                {
                    "roleName": "pa",
                    "roleId": 319
                }
            ],
            "projectName": "苏州天弘（科技）有限公司 Celestica (Suzhou)",
            "projectName_en": "Celestica_Suzhou_Technology"
        },
        "175": {
            "roles": [
                {
                    "roleName": "sales",
                    "roleId": 560
                }
            ],
            "projectName": "英文演示项目09",
            "projectName_en": "DemoEn09"
        },
        "293": {
            "roles": [
                {
                    "roleName": "test",
                    "roleId": 863
                }
            ],
            "projectName": "175Liverpoolst",
            "projectName_en": "175LiverpoolStreet"
        },
        "316": {
            "roles": [
                {
                    "roleName": "pa",
                    "roleId": 590
                }
            ],
            "projectName": "企业天地3号楼",
            "projectName_en": "CorporateAvenue03"
        },
        "373": {
            "roles": [
                {
                    "roleName": "pa",
                    "roleId": 664
                }
            ],
            "projectName": "中电熊猫云平台",
            "projectName_en": "xiongmaoyunpingtai"
        },
        "391": {
            "roles": [
                {
                    "roleName": "pa",
                    "roleId": 691
                }
            ],
            "projectName": "长宁来福士",
            "projectName_en": "nbcnlfs"
        },
        "394": {
            "roles": [
                {
                    "roleName": "pa",
                    "roleId": 698
                }
            ],
            "projectName": "新加坡Bugis+",
            "projectName_en": "Bugis Plus"
        },
        "396": {
            "roles": [
                {
                    "roleName": "test",
                    "roleId": 862
                }
            ],
            "projectName": "开能环保",
            "projectName_en": "Canature"
        },
        "419": {
            "roles": [
                {
                    "roleName": "pa",
                    "roleId": 736
                }
            ],
            "projectName": "新加坡武吉士",
            "projectName_en": "SingaporeBugisCn"
        },
        "466": {
            "roles": [
                {
                    "roleName": "pa",
                    "roleId": 799
                }
            ],
            "projectName": "DemoCBRE",
            "projectName_en": "DemoCBRE"
        },
        "473": {
            "roles": [
                {
                    "roleName": "pa",
                    "roleId": 809
                }
            ],
            "projectName": "美国某项目",
            "projectName_en": "GSA Demo"
        },
        "494": {
            "roles": [
                {
                    "roleName": "pa",
                    "roleId": 839
                }
            ],
            "projectName": "物流平台demo",
            "projectName_en": "LogisticsDemo"
        },
        "575": {
            "roles": [
                {
                    "roleName": "pa",
                    "roleId": 950
                }
            ],
            "projectName": "Facility Matrix Demo",
            "projectName_en": "Facility Matrix Demo"
        }
    }
    TestCommon.GetProjectPermissionByUserId.assert_result_equal(expected, rt)

@pytest.mark.p0
def test_GetProjectPermissionByUserId_expiry():
    rt = TestCommon.GetProjectPermissionByUserId.run({
        'userId':3278
    })
    expected = {
        "1": {
            "roles": [
                {
                    "roleName": "RNB研发",
                    "roleId": 1
                }
            ],
            "projectName": "上海中芯国际",
            "projectName_en": "Simc"
        }
    }
    TestCommon.GetProjectPermissionByUserId.assert_result_equal(expected, rt)
