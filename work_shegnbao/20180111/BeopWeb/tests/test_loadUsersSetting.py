#coding=utf-8
__author__ = 'angelia'

import pytest
from tests.utils import TestCommon

@pytest.mark.p0
def test_loadUsersSetting_admin():
    rt = TestCommon.LoadUsersSetting.run({
        'userId':1,
        'currentUser':1151
    })
    expected = {
        "userRoleGroup": [
            "15",
            "2"
        ],
        "managers": [],
        "user": {
            "isManager": 1,
            "country": "WW",
            "userfullname": "admin",
            "useremail": "irene.shen@rnbtech.com.hk",
            "expiryDate": None,
            "username": "admin",
            "id": 1,
            "company": "R&B",
            "userpic": "/static/images/avatar/user/19069668.jpg",
            "supervisor": 0
        },
        "currentUserRoleGroup": [
            "1",
            "15",
            "2"
        ],
        "supervisor": {}
}

    TestCommon.LoadUsersSetting.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_loadUsersSetting_toSuper():
    rt = TestCommon.LoadUsersSetting.run({
        'userId':456,
        'currentUser':1151
    })
    expected = {
        "userRoleGroup": [
            "2",
            "10",
            "15",
            "3",
            "6",
            "1"
        ],
        "managers": [],
        "user": {
            "isManager": 1,
            "country": "WW",
            "userfullname": "Angelia",
            "useremail": "1012325967@qq.com",
            "expiryDate": None,
            "username": "1012325967@qq.com",
            "id": 456,
            "company": "升宝",
            "userpic": "/static/images/avatar/user/10309711.png",
            "supervisor": 114
        },
        "currentUserRoleGroup": [
            "1",
            "15",
            "2"
        ],
        "supervisor": {
            "userpic": "/static/images/avatar/user/20705588.jpg",
            "id": 114,
            "userfullname": "golding",
            "username": "golding.gu@rnbtech.com.hk"
        }
}
    TestCommon.LoadUsersSetting.assert_result_equals(expected, rt)

@pytest.mark.p0
def test_loadUsersSetting_toLow():
    rt = TestCommon.LoadUsersSetting.run({
        'userId':114,
        'currentUser':114
    })
    expected = {
        "user": {
            "useremail": "golding.gu@rnbtech.com.hk",
            "id": 114,
            "supervisor": 1,
            "expiryDate": None,
            "userfullname": "golding",
            "country": "WW",
            "company": None,
            "isManager": 1,
            "userpic": "/static/images/avatar/user/20705588.jpg",
            "username": "golding.gu@rnbtech.com.hk"
        },
        "managers": [
            {
                "id": 114,
                "supervisor": 1,
                "userfullname": "golding",
                "isSub": True,
                "isManager": 1,
                "username": "golding.gu@rnbtech.com.hk",
                "sub": [
                    {
                        "id": 65,
                        "supervisor": 114,
                        "userfullname": "KRUZ",
                        "isSub": True,
                        "isManager": 1,
                        "username": "kruz.qian@rnbtech.com.hk",
                        "sub": [
                            {
                                "id": 1165,
                                "supervisor": 65,
                                "userfullname": "alice",
                                "isManager": 0,
                                "username": "alice.xiong@rnbtech.com.hk",
                                "sub": []
                            },
                            {
                                "id": 1218,
                                "supervisor": 65,
                                "userfullname": "ruby",
                                "isManager": 0,
                                "username": "ruby.jiang@rnbtech.com.hk",
                                "sub": []
                            },
                            {
                                "id": 1569,
                                "supervisor": 65,
                                "userfullname": "IW_CMU",
                                "isManager": 0,
                                "username": "iw_cmu@tom.com",
                                "sub": []
                            },
                            {
                                "id": 2643,
                                "supervisor": 65,
                                "userfullname": "M_Yiping@yea",
                                "isManager": 0,
                                "username": "M_Yiping@yeah.net.com",
                                "sub": []
                            },
                            {
                                "id": 2669,
                                "supervisor": 65,
                                "userfullname": "ntcace",
                                "isManager": 0,
                                "username": "ntcacees@163.com",
                                "sub": []
                            },
                            {
                                "id": 2719,
                                "supervisor": 65,
                                "userfullname": "冷链演示",
                                "isManager": 0,
                                "username": "rnbcommon@sina.com",
                                "sub": []
                            },
                            {
                                "id": 2739,
                                "supervisor": 65,
                                "userfullname": "BDTM内部测试",
                                "isManager": 0,
                                "username": "BrightDTM@163.com",
                                "sub": []
                            },
                            {
                                "id": 2747,
                                "supervisor": 65,
                                "userfullname": "yingchu.qian",
                                "isManager": 0,
                                "username": "yingchu.qian@9v-sh.com",
                                "sub": []
                            },
                            {
                                "id": 2794,
                                "supervisor": 65,
                                "userfullname": "takashi",
                                "isManager": 0,
                                "username": "Bak.Kasuya.takashi@takenaka.co.jp",
                                "sub": []
                            },
                            {
                                "id": 2795,
                                "supervisor": 65,
                                "userfullname": "nakajima",
                                "isManager": 0,
                                "username": "Bak.d_nakajima@afm.co.jp",
                                "sub": []
                            },
                            {
                                "id": 3114,
                                "supervisor": 65,
                                "userfullname": "Ericyangcem",
                                "isManager": 0,
                                "username": "Ericyangcem@Gmail.com",
                                "sub": []
                            },
                            {
                                "id": 3163,
                                "supervisor": 65,
                                "userfullname": "sada ",
                                "isManager": 0,
                                "username": "qian_hanying@yahoo.co.jp",
                                "sub": []
                            },
                            {
                                "id": 3188,
                                "supervisor": 65,
                                "userfullname": "test",
                                "isManager": 0,
                                "username": "ntcace@163.com",
                                "sub": []
                            },
                            {
                                "id": 3191,
                                "supervisor": 65,
                                "userfullname": "Bravo",
                                "isManager": 0,
                                "username": "shixi01@rnbtech.com.hk",
                                "sub": []
                            },
                            {
                                "id": 3194,
                                "supervisor": 65,
                                "userfullname": "Alpha",
                                "isManager": 0,
                                "username": "shixi02@rnbtech.com.hk",
                                "sub": []
                            },
                            {
                                "id": 3207,
                                "supervisor": 65,
                                "userfullname": "qian_hanying",
                                "isManager": 0,
                                "username": "qianh_hanying_hanying@yahoo.co.jp",
                                "sub": []
                            },
                            {
                                "id": 3208,
                                "supervisor": 65,
                                "userfullname": "qian",
                                "isManager": 0,
                                "username": "Kruz.qian@rnbtech.com.com",
                                "sub": []
                            },
                            {
                                "id": 3210,
                                "supervisor": 65,
                                "userfullname": "qian",
                                "isManager": 0,
                                "username": "kruz.qian@rbbtech.com.hk",
                                "sub": []
                            },
                            {
                                "id": 3214,
                                "supervisor": 65,
                                "userfullname": "FMinfo",
                                "isManager": 0,
                                "username": "info@facilitymatrix.net",
                                "sub": []
                            },
                            {
                                "id": 3220,
                                "supervisor": 65,
                                "userfullname": "英菲葆尔",
                                "isManager": 0,
                                "username": "YFBE@YFBE.com",
                                "sub": []
                            },
                            {
                                "id": 3320,
                                "supervisor": 65,
                                "userfullname": "向川原 稔",
                                "isManager": 0,
                                "username": "m_mukaigawara@afm.co.jp",
                                "sub": []
                            },
                            {
                                "id": 3321,
                                "supervisor": 65,
                                "userfullname": "鈴木 康介",
                                "isManager": 0,
                                "username": "ko_suzuki@afm.co.jp",
                                "sub": []
                            },
                            {
                                "id": 3322,
                                "supervisor": 65,
                                "userfullname": "福田 美月",
                                "isManager": 0,
                                "username": "mi_fukuda@afm.co.jp",
                                "sub": []
                            },
                            {
                                "id": 3327,
                                "supervisor": 65,
                                "userfullname": "粕谷 貴司",
                                "isManager": 0,
                                "username": "kasuya.takashi@takenaka.co.jp",
                                "sub": []
                            },
                            {
                                "id": 3328,
                                "supervisor": 65,
                                "userfullname": "中島 大介",
                                "isManager": 0,
                                "username": "d_nakajima@afm.co.jp",
                                "sub": []
                            },
                            {
                                "id": 3640,
                                "supervisor": 65,
                                "userfullname": "ikea",
                                "isManager": 0,
                                "username": "ikea",
                                "sub": []
                            },
                            {
                                "id": 3663,
                                "supervisor": 65,
                                "userfullname": "何锐",
                                "isManager": 0,
                                "username": "rui.he@jafco.co.jp",
                                "sub": []
                            },
                            {
                                "id": 3664,
                                "supervisor": 65,
                                "userfullname": "ikeademo",
                                "isManager": 0,
                                "username": "ikeademo",
                                "sub": []
                            },
                            {
                                "id": 3685,
                                "supervisor": 65,
                                "userfullname": "ikeademoen",
                                "isManager": 0,
                                "username": "ikeademoen",
                                "sub": []
                            },
                            {
                                "id": 3686,
                                "supervisor": 65,
                                "userfullname": "pingtaiceshi",
                                "isManager": 0,
                                "username": "pingtaiceshi",
                                "sub": []
                            },
                            {
                                "id": 3763,
                                "supervisor": 65,
                                "userfullname": "ntcace",
                                "isManager": 0,
                                "username": "ntcace",
                                "sub": []
                            },
                            {
                                "id": 3790,
                                "supervisor": 65,
                                "userfullname": "InvitationTest",
                                "isManager": 0,
                                "username": "InvitationTest",
                                "sub": []
                            }
                        ]
                    },
                    {
                        "id": 67,
                        "supervisor": 114,
                        "userfullname": "kingsley",
                        "isSub": True,
                        "isManager": 1,
                        "username": "kingsley.he@rnbtech.com.hk",
                        "sub": [
                            {
                                "id": 2650,
                                "supervisor": 67,
                                "userfullname": "inviteUsers",
                                "isManager": 0,
                                "username": "nvgajc92140@chacuo.net",
                                "sub": []
                            },
                            {
                                "id": 2654,
                                "supervisor": 67,
                                "userfullname": "Kirry",
                                "isManager": 0,
                                "username": "3289525927@qq.com",
                                "sub": []
                            },
                            {
                                "id": 2655,
                                "supervisor": 67,
                                "userfullname": "Kirry",
                                "isManager": 0,
                                "username": "Kirry.gao@rnbtech.com.hk",
                                "sub": []
                            },
                            {
                                "id": 3630,
                                "supervisor": 67,
                                "userfullname": "123456789",
                                "isManager": 0,
                                "username": "123456789",
                                "sub": []
                            },
                            {
                                "id": 3633,
                                "supervisor": 67,
                                "userfullname": "catter",
                                "isManager": 0,
                                "username": "catter",
                                "sub": []
                            }
                        ]
                    },
                    {
                        "id": 68,
                        "supervisor": 114,
                        "userfullname": "rikan",
                        "isSub": True,
                        "isManager": 1,
                        "username": "rikan.li@rnbtech.com.hk",
                        "sub": [
                            {
                                "id": 2644,
                                "supervisor": 68,
                                "userfullname": "ntcace@163.c",
                                "isManager": 0,
                                "username": "uziype62159@chacuo.net",
                                "sub": []
                            },
                            {
                                "id": 2673,
                                "supervisor": 68,
                                "userfullname": "zbj0059",
                                "isManager": 0,
                                "username": "zbj0059@gmail.com",
                                "sub": []
                            }
                        ]
                    },
                    {
                        "id": 69,
                        "supervisor": 114,
                        "userfullname": "murphy",
                        "isManager": 0,
                        "username": "murphy.ma@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 70,
                        "supervisor": 114,
                        "userfullname": "john",
                        "isManager": 0,
                        "username": "john.yang@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 72,
                        "supervisor": 114,
                        "userfullname": "mango",
                        "isManager": 0,
                        "username": "mango.yan@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 73,
                        "supervisor": 114,
                        "userfullname": "neil",
                        "isManager": 0,
                        "username": "neil.yu@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 74,
                        "supervisor": 114,
                        "userfullname": "matthew",
                        "isManager": 0,
                        "username": "matthew.zuo@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 75,
                        "supervisor": 114,
                        "userfullname": "robert",
                        "isManager": 0,
                        "username": "robert.luo@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 76,
                        "supervisor": 114,
                        "userfullname": "wanna",
                        "isManager": 0,
                        "username": "wanna.zhang@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 77,
                        "supervisor": 114,
                        "userfullname": "algo",
                        "isSub": True,
                        "isManager": 1,
                        "username": "amy.zhou@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 78,
                        "supervisor": 114,
                        "userfullname": "fengyou",
                        "isManager": 0,
                        "username": "fengyou.hua@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 101,
                        "supervisor": 114,
                        "userfullname": "vicky",
                        "isManager": 0,
                        "username": "vicky.zhang@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 215,
                        "supervisor": 114,
                        "userfullname": "owen",
                        "isSub": True,
                        "isManager": 1,
                        "username": "owen.ou@rnbtech.com.hk",
                        "sub": [
                            {
                                "id": 377,
                                "supervisor": 215,
                                "userfullname": "owen-test",
                                "isSub": True,
                                "isManager": 1,
                                "username": "408505925@qq.com",
                                "sub": []
                            },
                            {
                                "id": 1346,
                                "supervisor": 215,
                                "userfullname": "owen-test1",
                                "isSub": True,
                                "isManager": 1,
                                "username": "fdsfsfsdf@qq.com",
                                "sub": []
                            },
                            {
                                "id": 1397,
                                "supervisor": 215,
                                "userfullname": "owen-test0",
                                "isManager": 0,
                                "username": "1927748405@qq.com",
                                "sub": []
                            }
                        ]
                    },
                    {
                        "id": 262,
                        "supervisor": 114,
                        "userfullname": "peter",
                        "isManager": 0,
                        "username": "peter.zhao@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 285,
                        "supervisor": 114,
                        "userfullname": "irene",
                        "isSub": True,
                        "isManager": 1,
                        "username": "irene.shen@rnbtech.com.hk",
                        "sub": [
                            {
                                "id": 513,
                                "supervisor": 285,
                                "userfullname": "irenel",
                                "isSub": True,
                                "isManager": 1,
                                "username": "523705863@qq.com",
                                "sub": []
                            },
                            {
                                "id": 1623,
                                "supervisor": 285,
                                "userfullname": "slgz21",
                                "isManager": 0,
                                "username": "slgz21@126.com",
                                "sub": []
                            },
                            {
                                "id": 1637,
                                "supervisor": 285,
                                "userfullname": "马仁勇",
                                "isManager": 0,
                                "username": "pgup22@163.com",
                                "sub": []
                            },
                            {
                                "id": 1639,
                                "supervisor": 285,
                                "userfullname": "张小娴",
                                "isManager": 0,
                                "username": "ctrlalt111@163.com",
                                "sub": []
                            },
                            {
                                "id": 1640,
                                "supervisor": 285,
                                "userfullname": "余华",
                                "isManager": 0,
                                "username": "rnbtech111@163.com",
                                "sub": []
                            },
                            {
                                "id": 1641,
                                "supervisor": 285,
                                "userfullname": "史铁生",
                                "isManager": 0,
                                "username": "tirnbtech@163.com",
                                "sub": []
                            },
                            {
                                "id": 1642,
                                "supervisor": 285,
                                "userfullname": "刘亮程",
                                "isManager": 0,
                                "username": "rnbtech11@sina.com",
                                "sub": []
                            },
                            {
                                "id": 1766,
                                "supervisor": 285,
                                "userfullname": "shift",
                                "isManager": 0,
                                "username": "shiftsl@139.com",
                                "sub": []
                            },
                            {
                                "id": 1968,
                                "supervisor": 285,
                                "userfullname": "irene7",
                                "isManager": 0,
                                "username": "ireneshen7@aliyun.com",
                                "sub": []
                            },
                            {
                                "id": 2389,
                                "supervisor": 285,
                                "userfullname": "小马哥",
                                "isManager": 0,
                                "username": "myp318@163.com",
                                "sub": []
                            },
                            {
                                "id": 2677,
                                "supervisor": 285,
                                "userfullname": "workordertest01",
                                "isManager": 0,
                                "username": "workordertest01@rnbtech.com.hk",
                                "sub": []
                            },
                            {
                                "id": 2678,
                                "supervisor": 285,
                                "userfullname": "workordertest02",
                                "isManager": 0,
                                "username": "workordertest02@rnbtech.com.hk",
                                "sub": []
                            },
                            {
                                "id": 2679,
                                "supervisor": 285,
                                "userfullname": "workordertest03",
                                "isManager": 0,
                                "username": "workordertest03@rnbtech.com.hk",
                                "sub": []
                            },
                            {
                                "id": 3315,
                                "supervisor": 285,
                                "userfullname": "SLSL",
                                "isManager": 0,
                                "username": "sl@slsl1.com",
                                "sub": []
                            },
                            {
                                "id": 3729,
                                "supervisor": 285,
                                "userfullname": "Irene123",
                                "isManager": 0,
                                "username": "Irene123",
                                "sub": []
                            },
                            {
                                "id": 3731,
                                "supervisor": 285,
                                "userfullname": "irene01",
                                "isManager": 0,
                                "username": "Irene01",
                                "sub": []
                            },
                            {
                                "id": 3733,
                                "supervisor": 285,
                                "userfullname": "Irene03",
                                "isManager": 0,
                                "username": "Irene03",
                                "sub": []
                            },
                            {
                                "id": 3751,
                                "supervisor": 285,
                                "userfullname": "Irene",
                                "isManager": 0,
                                "username": "Irene",
                                "sub": []
                            },
                            {
                                "id": 3752,
                                "supervisor": 285,
                                "userfullname": "Irene02",
                                "isManager": 0,
                                "username": "Irene02",
                                "sub": []
                            },
                            {
                                "id": 3753,
                                "supervisor": 285,
                                "userfullname": "Irene06",
                                "isManager": 0,
                                "username": "Irene06",
                                "sub": []
                            }
                        ]
                    },
                    {
                        "id": 379,
                        "supervisor": 114,
                        "userfullname": "Maggie",
                        "isManager": 0,
                        "username": "18801791039@126.com",
                        "sub": []
                    },
                    {
                        "id": 402,
                        "supervisor": 114,
                        "userfullname": "David",
                        "isManager": 0,
                        "username": "david.chen@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 404,
                        "supervisor": 114,
                        "userfullname": "woody",
                        "isSub": True,
                        "isManager": 1,
                        "username": "woody.wu@rnbtech.com.hk",
                        "sub": [
                            {
                                "id": 2306,
                                "supervisor": 404,
                                "userfullname": "AutoTester",
                                "isManager": 0,
                                "username": "wuranxu@126.com",
                                "sub": []
                            },
                            {
                                "id": 2365,
                                "supervisor": 404,
                                "userfullname": "AutoTester",
                                "isSub": True,
                                "isManager": 1,
                                "username": "619434176@qq.com",
                                "sub": []
                            },
                            {
                                "id": 2366,
                                "supervisor": 404,
                                "userfullname": "woodyTest02",
                                "isManager": 0,
                                "username": "1613687333@qq.com",
                                "sub": []
                            },
                            {
                                "id": 2612,
                                "supervisor": 404,
                                "userfullname": "wooooooooody",
                                "isManager": 0,
                                "username": "wuranxu312@126.com",
                                "sub": []
                            },
                            {
                                "id": 2649,
                                "supervisor": 404,
                                "userfullname": "afieyfh",
                                "isManager": 0,
                                "username": "66666yueyue6@sina.com",
                                "sub": []
                            },
                            {
                                "id": 2707,
                                "supervisor": 404,
                                "userfullname": "wqeqwew",
                                "isManager": 0,
                                "username": "1516520442@qq.com",
                                "sub": []
                            }
                        ]
                    },
                    {
                        "id": 405,
                        "supervisor": 114,
                        "userfullname": "lily",
                        "isSub": True,
                        "isManager": 1,
                        "username": "lily.li@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 416,
                        "supervisor": 114,
                        "userfullname": "golding2",
                        "isManager": 0,
                        "username": "12343403@qq.com",
                        "sub": []
                    },
                    {
                        "id": 456,
                        "supervisor": 114,
                        "userfullname": "Angelia",
                        "isSub": True,
                        "isManager": 1,
                        "username": "1012325967@qq.com",
                        "sub": [
                            {
                                "id": 3278,
                                "supervisor": 456,
                                "userfullname": "123456",
                                "isManager": 0,
                                "username": "cttjane@sina.cn",
                                "sub": []
                            }
                        ]
                    },
                    {
                        "id": 527,
                        "supervisor": 114,
                        "userfullname": "lee",
                        "isManager": 0,
                        "username": "lee.li@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 1101,
                        "supervisor": 114,
                        "userfullname": "will",
                        "isManager": 0,
                        "username": "will.wu@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 1335,
                        "supervisor": 114,
                        "userfullname": "max",
                        "isManager": 0,
                        "username": "max.fan@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 1413,
                        "supervisor": 114,
                        "userfullname": "stan",
                        "isManager": 0,
                        "username": "stan.su@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 1422,
                        "supervisor": 114,
                        "userfullname": "zhanglun",
                        "isManager": 0,
                        "username": "409800605@qq.com",
                        "sub": []
                    },
                    {
                        "id": 1428,
                        "supervisor": 114,
                        "userfullname": "Ding",
                        "isManager": 0,
                        "username": "dingjh0112@163.com",
                        "sub": []
                    },
                    {
                        "id": 1511,
                        "supervisor": 114,
                        "userfullname": "carol",
                        "isSub": True,
                        "isManager": 1,
                        "username": "carol.wei@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 1560,
                        "supervisor": 114,
                        "userfullname": "beopcloud",
                        "isSub": True,
                        "isManager": 1,
                        "username": "beopcloud@126.com",
                        "sub": [
                            {
                                "id": 3230,
                                "supervisor": 1560,
                                "userfullname": "test_ma",
                                "isManager": 0,
                                "username": "hyejinsoo@yahoo.com",
                                "sub": []
                            }
                        ]
                    },
                    {
                        "id": 1589,
                        "supervisor": 114,
                        "userfullname": "may",
                        "isManager": 0,
                        "username": "may.chen@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 1608,
                        "supervisor": 114,
                        "userfullname": "sophia",
                        "isSub": True,
                        "isManager": 1,
                        "username": "sophia.zhao@rnbtech.com.hk",
                        "sub": [
                            {
                                "id": 1747,
                                "supervisor": 1608,
                                "userfullname": "sophiatest",
                                "isManager": 0,
                                "username": "sophia201552@163.com",
                                "sub": []
                            },
                            {
                                "id": 2411,
                                "supervisor": 1608,
                                "userfullname": "AutoTester",
                                "isManager": 0,
                                "username": "sophia1990529@163.com",
                                "sub": []
                            },
                            {
                                "id": 2427,
                                "supervisor": 1608,
                                "userfullname": "sophia199321",
                                "isManager": 0,
                                "username": "sophia1993219@163.com",
                                "sub": []
                            },
                            {
                                "id": 2428,
                                "supervisor": 1608,
                                "userfullname": "sophia199111",
                                "isSub": True,
                                "isManager": 1,
                                "username": "sophia19911124@163.com",
                                "sub": []
                            },
                            {
                                "id": 2611,
                                "supervisor": 1608,
                                "userfullname": "123456",
                                "isManager": 0,
                                "username": "1281056983@qq.com",
                                "sub": []
                            },
                            {
                                "id": 2742,
                                "supervisor": 1608,
                                "userfullname": "test",
                                "isManager": 0,
                                "username": "1307518621@qq.com",
                                "sub": []
                            },
                            {
                                "id": 2744,
                                "supervisor": 1608,
                                "userfullname": "test1223",
                                "isManager": 0,
                                "username": "2491432087@qq.com",
                                "sub": []
                            }
                        ]
                    },
                    {
                        "id": 1609,
                        "supervisor": 114,
                        "userfullname": "lynch",
                        "isManager": 0,
                        "username": "lynch.bao@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 1688,
                        "supervisor": 114,
                        "userfullname": "wangtan",
                        "isManager": 0,
                        "username": "wangtan@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 1743,
                        "supervisor": 114,
                        "userfullname": "bill",
                        "isManager": 0,
                        "username": "bill.sun@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 1760,
                        "supervisor": 114,
                        "userfullname": "eric",
                        "isSub": True,
                        "isManager": 1,
                        "username": "eric.wang@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 2194,
                        "supervisor": 114,
                        "userfullname": "杨光亿",
                        "isManager": 0,
                        "username": "ygyhjwy@163.com",
                        "sub": []
                    },
                    {
                        "id": 2200,
                        "supervisor": 114,
                        "userfullname": "lefi",
                        "isSub": True,
                        "isManager": 1,
                        "username": "lefi.li@rnbtech.com.hk",
                        "sub": [
                            {
                                "id": 3755,
                                "supervisor": 2200,
                                "userfullname": "lefi_test001",
                                "isManager": 0,
                                "username": "lefi_test001",
                                "sub": []
                            },
                            {
                                "id": 3756,
                                "supervisor": 2200,
                                "userfullname": "lefi_test002",
                                "isManager": 0,
                                "username": "lefi_test002",
                                "sub": []
                            },
                            {
                                "id": 3757,
                                "supervisor": 2200,
                                "userfullname": "lefi_test003",
                                "isManager": 0,
                                "username": "lefi_test003",
                                "sub": []
                            },
                            {
                                "id": 3758,
                                "supervisor": 2200,
                                "userfullname": "lefi_a_test001",
                                "isManager": 0,
                                "username": "lefi_a_test001",
                                "sub": []
                            },
                            {
                                "id": 3759,
                                "supervisor": 2200,
                                "userfullname": "lefi_a_test002",
                                "isManager": 0,
                                "username": "lefi_a_test002",
                                "sub": []
                            },
                            {
                                "id": 3760,
                                "supervisor": 2200,
                                "userfullname": "A_test111",
                                "isManager": 0,
                                "username": "A_test111",
                                "sub": []
                            },
                            {
                                "id": 3761,
                                "supervisor": 2200,
                                "userfullname": "A_test222",
                                "isManager": 0,
                                "username": "A_test222",
                                "sub": []
                            },
                            {
                                "id": 3764,
                                "supervisor": 2200,
                                "userfullname": "lefi_mytest001",
                                "isManager": 0,
                                "username": "lefi_mytest001",
                                "sub": []
                            },
                            {
                                "id": 3773,
                                "supervisor": 2200,
                                "userfullname": "mytest_11",
                                "isManager": 0,
                                "username": "mytest_11",
                                "sub": []
                            },
                            {
                                "id": 3774,
                                "supervisor": 2200,
                                "userfullname": "myTest_122",
                                "isManager": 0,
                                "username": "myTest_122",
                                "sub": []
                            },
                            {
                                "id": 3775,
                                "supervisor": 2200,
                                "userfullname": "mytest113",
                                "isManager": 0,
                                "username": "mytest113",
                                "sub": []
                            },
                            {
                                "id": 3776,
                                "supervisor": 2200,
                                "userfullname": "myTest114",
                                "isManager": 0,
                                "username": "myTest114",
                                "sub": []
                            },
                            {
                                "id": 3777,
                                "supervisor": 2200,
                                "userfullname": "mytest116",
                                "isManager": 0,
                                "username": "mytest116",
                                "sub": []
                            },
                            {
                                "id": 3778,
                                "supervisor": 2200,
                                "userfullname": "mytest007",
                                "isManager": 0,
                                "username": "mytest007",
                                "sub": []
                            }
                        ]
                    },
                    {
                        "id": 2234,
                        "supervisor": 114,
                        "userfullname": "jack",
                        "isManager": 0,
                        "username": "jack.jia@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 2265,
                        "supervisor": 114,
                        "userfullname": "AutoTester",
                        "isSub": True,
                        "isManager": 1,
                        "username": "projecttest@rnbtech.com.hk",
                        "sub": [
                            {
                                "id": 2656,
                                "supervisor": 2265,
                                "userfullname": "Woody",
                                "isManager": 0,
                                "username": "55497569@qq.com",
                                "sub": []
                            },
                            {
                                "id": 3266,
                                "supervisor": 2265,
                                "userfullname": "rrr",
                                "isManager": 0,
                                "username": "13304965@qq.com",
                                "sub": []
                            },
                            {
                                "id": 3272,
                                "supervisor": 2265,
                                "userfullname": "aigo",
                                "isManager": 0,
                                "username": "1627450577@qq.com",
                                "sub": []
                            },
                            {
                                "id": 3280,
                                "supervisor": 2265,
                                "userfullname": "qazwsx",
                                "isManager": 0,
                                "username": "95255214@qq.com",
                                "sub": []
                            },
                            {
                                "id": 3622,
                                "supervisor": 2265,
                                "userfullname": "weishu",
                                "isManager": 0,
                                "username": "weishu",
                                "sub": []
                            },
                            {
                                "id": 3650,
                                "supervisor": 2265,
                                "userfullname": "Good",
                                "isSub": True,
                                "isManager": 1,
                                "username": "good",
                                "sub": []
                            },
                            {
                                "id": 3749,
                                "supervisor": 2265,
                                "userfullname": "projecttes",
                                "isManager": 0,
                                "username": "projecttest_pwdreset@rnbtech.com.hk",
                                "sub": []
                            }
                        ]
                    },
                    {
                        "id": 2273,
                        "supervisor": 114,
                        "userfullname": "hunter",
                        "isManager": 0,
                        "username": "hunter.su@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 2495,
                        "supervisor": 114,
                        "userfullname": "vivian",
                        "isManager": 0,
                        "username": "vivian.yang@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 2522,
                        "supervisor": 114,
                        "userfullname": "rain",
                        "isManager": 0,
                        "username": "rain.cao@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 2625,
                        "supervisor": 114,
                        "userfullname": "notice",
                        "isManager": 0,
                        "username": "notice@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 2626,
                        "supervisor": 114,
                        "userfullname": "service",
                        "isManager": 0,
                        "username": "service@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 2670,
                        "supervisor": 114,
                        "userfullname": "陈大为测试",
                        "isManager": 0,
                        "username": "david.chen007@outlook.com",
                        "sub": []
                    },
                    {
                        "id": 2693,
                        "supervisor": 114,
                        "userfullname": "陈孝烽",
                        "isManager": 0,
                        "username": "daikon.my@gmail.com",
                        "sub": []
                    },
                    {
                        "id": 2745,
                        "supervisor": 114,
                        "userfullname": "陈孝烽",
                        "isManager": 0,
                        "username": "daikon.chen@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 3041,
                        "supervisor": 114,
                        "userfullname": "abby",
                        "isManager": 0,
                        "username": "abby.jiang@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 3042,
                        "supervisor": 114,
                        "userfullname": "marvin",
                        "isManager": 0,
                        "username": "marvin.zhou@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 3200,
                        "supervisor": 114,
                        "userfullname": "Tony",
                        "isSub": True,
                        "isManager": 1,
                        "username": "tony.nie@rnbtech.com.hk",
                        "sub": [
                            {
                                "id": 1151,
                                "supervisor": 3200,
                                "userfullname": "Angelia02",
                                "isManager": 0,
                                "username": "angelia.chen@rnbtech.com.hk",
                                "sub": []
                            },
                            {
                                "id": 3771,
                                "supervisor": 3200,
                                "userfullname": "tony163",
                                "isManager": 0,
                                "username": "tony163",
                                "sub": []
                            },
                            {
                                "id": 3772,
                                "supervisor": 3200,
                                "userfullname": "tonyqq6",
                                "isManager": 0,
                                "username": "tonyqq6",
                                "sub": []
                            }
                        ]
                    },
                    {
                        "id": 3215,
                        "supervisor": 114,
                        "userfullname": "julian",
                        "isManager": 0,
                        "username": "julian.zhou@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 3277,
                        "supervisor": 114,
                        "userfullname": "rainf54rg",
                        "isManager": 0,
                        "username": "343942059@qq.com",
                        "sub": []
                    },
                    {
                        "id": 3598,
                        "supervisor": 114,
                        "userfullname": "Ivy.Liu",
                        "isManager": 0,
                        "username": "IvyLiu",
                        "sub": []
                    },
                    {
                        "id": 3682,
                        "supervisor": 114,
                        "userfullname": "Amy",
                        "isManager": 0,
                        "username": "315028435@qq.com",
                        "sub": []
                    }
                ]
            },
            {
                "id": 65,
                "supervisor": 114,
                "userfullname": "KRUZ",
                "isSub": True,
                "isManager": 1,
                "username": "kruz.qian@rnbtech.com.hk",
                "sub": [
                    {
                        "id": 1165,
                        "supervisor": 65,
                        "userfullname": "alice",
                        "isManager": 0,
                        "username": "alice.xiong@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 1218,
                        "supervisor": 65,
                        "userfullname": "ruby",
                        "isManager": 0,
                        "username": "ruby.jiang@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 1569,
                        "supervisor": 65,
                        "userfullname": "IW_CMU",
                        "isManager": 0,
                        "username": "iw_cmu@tom.com",
                        "sub": []
                    },
                    {
                        "id": 2643,
                        "supervisor": 65,
                        "userfullname": "M_Yiping@yea",
                        "isManager": 0,
                        "username": "M_Yiping@yeah.net.com",
                        "sub": []
                    },
                    {
                        "id": 2669,
                        "supervisor": 65,
                        "userfullname": "ntcace",
                        "isManager": 0,
                        "username": "ntcacees@163.com",
                        "sub": []
                    },
                    {
                        "id": 2719,
                        "supervisor": 65,
                        "userfullname": "冷链演示",
                        "isManager": 0,
                        "username": "rnbcommon@sina.com",
                        "sub": []
                    },
                    {
                        "id": 2739,
                        "supervisor": 65,
                        "userfullname": "BDTM内部测试",
                        "isManager": 0,
                        "username": "BrightDTM@163.com",
                        "sub": []
                    },
                    {
                        "id": 2747,
                        "supervisor": 65,
                        "userfullname": "yingchu.qian",
                        "isManager": 0,
                        "username": "yingchu.qian@9v-sh.com",
                        "sub": []
                    },
                    {
                        "id": 2794,
                        "supervisor": 65,
                        "userfullname": "takashi",
                        "isManager": 0,
                        "username": "Bak.Kasuya.takashi@takenaka.co.jp",
                        "sub": []
                    },
                    {
                        "id": 2795,
                        "supervisor": 65,
                        "userfullname": "nakajima",
                        "isManager": 0,
                        "username": "Bak.d_nakajima@afm.co.jp",
                        "sub": []
                    },
                    {
                        "id": 3114,
                        "supervisor": 65,
                        "userfullname": "Ericyangcem",
                        "isManager": 0,
                        "username": "Ericyangcem@Gmail.com",
                        "sub": []
                    },
                    {
                        "id": 3163,
                        "supervisor": 65,
                        "userfullname": "sada ",
                        "isManager": 0,
                        "username": "qian_hanying@yahoo.co.jp",
                        "sub": []
                    },
                    {
                        "id": 3188,
                        "supervisor": 65,
                        "userfullname": "test",
                        "isManager": 0,
                        "username": "ntcace@163.com",
                        "sub": []
                    },
                    {
                        "id": 3191,
                        "supervisor": 65,
                        "userfullname": "Bravo",
                        "isManager": 0,
                        "username": "shixi01@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 3194,
                        "supervisor": 65,
                        "userfullname": "Alpha",
                        "isManager": 0,
                        "username": "shixi02@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 3207,
                        "supervisor": 65,
                        "userfullname": "qian_hanying",
                        "isManager": 0,
                        "username": "qianh_hanying_hanying@yahoo.co.jp",
                        "sub": []
                    },
                    {
                        "id": 3208,
                        "supervisor": 65,
                        "userfullname": "qian",
                        "isManager": 0,
                        "username": "Kruz.qian@rnbtech.com.com",
                        "sub": []
                    },
                    {
                        "id": 3210,
                        "supervisor": 65,
                        "userfullname": "qian",
                        "isManager": 0,
                        "username": "kruz.qian@rbbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 3214,
                        "supervisor": 65,
                        "userfullname": "FMinfo",
                        "isManager": 0,
                        "username": "info@facilitymatrix.net",
                        "sub": []
                    },
                    {
                        "id": 3220,
                        "supervisor": 65,
                        "userfullname": "英菲葆尔",
                        "isManager": 0,
                        "username": "YFBE@YFBE.com",
                        "sub": []
                    },
                    {
                        "id": 3320,
                        "supervisor": 65,
                        "userfullname": "向川原 稔",
                        "isManager": 0,
                        "username": "m_mukaigawara@afm.co.jp",
                        "sub": []
                    },
                    {
                        "id": 3321,
                        "supervisor": 65,
                        "userfullname": "鈴木 康介",
                        "isManager": 0,
                        "username": "ko_suzuki@afm.co.jp",
                        "sub": []
                    },
                    {
                        "id": 3322,
                        "supervisor": 65,
                        "userfullname": "福田 美月",
                        "isManager": 0,
                        "username": "mi_fukuda@afm.co.jp",
                        "sub": []
                    },
                    {
                        "id": 3327,
                        "supervisor": 65,
                        "userfullname": "粕谷 貴司",
                        "isManager": 0,
                        "username": "kasuya.takashi@takenaka.co.jp",
                        "sub": []
                    },
                    {
                        "id": 3328,
                        "supervisor": 65,
                        "userfullname": "中島 大介",
                        "isManager": 0,
                        "username": "d_nakajima@afm.co.jp",
                        "sub": []
                    },
                    {
                        "id": 3640,
                        "supervisor": 65,
                        "userfullname": "ikea",
                        "isManager": 0,
                        "username": "ikea",
                        "sub": []
                    },
                    {
                        "id": 3663,
                        "supervisor": 65,
                        "userfullname": "何锐",
                        "isManager": 0,
                        "username": "rui.he@jafco.co.jp",
                        "sub": []
                    },
                    {
                        "id": 3664,
                        "supervisor": 65,
                        "userfullname": "ikeademo",
                        "isManager": 0,
                        "username": "ikeademo",
                        "sub": []
                    },
                    {
                        "id": 3685,
                        "supervisor": 65,
                        "userfullname": "ikeademoen",
                        "isManager": 0,
                        "username": "ikeademoen",
                        "sub": []
                    },
                    {
                        "id": 3686,
                        "supervisor": 65,
                        "userfullname": "pingtaiceshi",
                        "isManager": 0,
                        "username": "pingtaiceshi",
                        "sub": []
                    },
                    {
                        "id": 3763,
                        "supervisor": 65,
                        "userfullname": "ntcace",
                        "isManager": 0,
                        "username": "ntcace",
                        "sub": []
                    },
                    {
                        "id": 3790,
                        "supervisor": 65,
                        "userfullname": "InvitationTest",
                        "isManager": 0,
                        "username": "InvitationTest",
                        "sub": []
                    }
                ]
            },
            {
                "id": 67,
                "supervisor": 114,
                "userfullname": "kingsley",
                "isSub": True,
                "isManager": 1,
                "username": "kingsley.he@rnbtech.com.hk",
                "sub": [
                    {
                        "id": 2650,
                        "supervisor": 67,
                        "userfullname": "inviteUsers",
                        "isManager": 0,
                        "username": "nvgajc92140@chacuo.net",
                        "sub": []
                    },
                    {
                        "id": 2654,
                        "supervisor": 67,
                        "userfullname": "Kirry",
                        "isManager": 0,
                        "username": "3289525927@qq.com",
                        "sub": []
                    },
                    {
                        "id": 2655,
                        "supervisor": 67,
                        "userfullname": "Kirry",
                        "isManager": 0,
                        "username": "Kirry.gao@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 3630,
                        "supervisor": 67,
                        "userfullname": "123456789",
                        "isManager": 0,
                        "username": "123456789",
                        "sub": []
                    },
                    {
                        "id": 3633,
                        "supervisor": 67,
                        "userfullname": "catter",
                        "isManager": 0,
                        "username": "catter",
                        "sub": []
                    }
                ]
            },
            {
                "id": 68,
                "supervisor": 114,
                "userfullname": "rikan",
                "isSub": True,
                "isManager": 1,
                "username": "rikan.li@rnbtech.com.hk",
                "sub": [
                    {
                        "id": 2644,
                        "supervisor": 68,
                        "userfullname": "ntcace@163.c",
                        "isManager": 0,
                        "username": "uziype62159@chacuo.net",
                        "sub": []
                    },
                    {
                        "id": 2673,
                        "supervisor": 68,
                        "userfullname": "zbj0059",
                        "isManager": 0,
                        "username": "zbj0059@gmail.com",
                        "sub": []
                    }
                ]
            },
            {
                "id": 77,
                "supervisor": 114,
                "userfullname": "algo",
                "isSub": True,
                "isManager": 1,
                "username": "amy.zhou@rnbtech.com.hk",
                "sub": []
            },
            {
                "id": 215,
                "supervisor": 114,
                "userfullname": "owen",
                "isSub": True,
                "isManager": 1,
                "username": "owen.ou@rnbtech.com.hk",
                "sub": [
                    {
                        "id": 377,
                        "supervisor": 215,
                        "userfullname": "owen-test",
                        "isSub": True,
                        "isManager": 1,
                        "username": "408505925@qq.com",
                        "sub": []
                    },
                    {
                        "id": 1346,
                        "supervisor": 215,
                        "userfullname": "owen-test1",
                        "isSub": True,
                        "isManager": 1,
                        "username": "fdsfsfsdf@qq.com",
                        "sub": []
                    },
                    {
                        "id": 1397,
                        "supervisor": 215,
                        "userfullname": "owen-test0",
                        "isManager": 0,
                        "username": "1927748405@qq.com",
                        "sub": []
                    }
                ]
            },
            {
                "id": 377,
                "supervisor": 215,
                "userfullname": "owen-test",
                "isSub": True,
                "isManager": 1,
                "username": "408505925@qq.com",
                "sub": []
            },
            {
                "id": 1346,
                "supervisor": 215,
                "userfullname": "owen-test1",
                "isSub": True,
                "isManager": 1,
                "username": "fdsfsfsdf@qq.com",
                "sub": []
            },
            {
                "id": 285,
                "supervisor": 114,
                "userfullname": "irene",
                "isSub": True,
                "isManager": 1,
                "username": "irene.shen@rnbtech.com.hk",
                "sub": [
                    {
                        "id": 513,
                        "supervisor": 285,
                        "userfullname": "irenel",
                        "isSub": True,
                        "isManager": 1,
                        "username": "523705863@qq.com",
                        "sub": []
                    },
                    {
                        "id": 1623,
                        "supervisor": 285,
                        "userfullname": "slgz21",
                        "isManager": 0,
                        "username": "slgz21@126.com",
                        "sub": []
                    },
                    {
                        "id": 1637,
                        "supervisor": 285,
                        "userfullname": "马仁勇",
                        "isManager": 0,
                        "username": "pgup22@163.com",
                        "sub": []
                    },
                    {
                        "id": 1639,
                        "supervisor": 285,
                        "userfullname": "张小娴",
                        "isManager": 0,
                        "username": "ctrlalt111@163.com",
                        "sub": []
                    },
                    {
                        "id": 1640,
                        "supervisor": 285,
                        "userfullname": "余华",
                        "isManager": 0,
                        "username": "rnbtech111@163.com",
                        "sub": []
                    },
                    {
                        "id": 1641,
                        "supervisor": 285,
                        "userfullname": "史铁生",
                        "isManager": 0,
                        "username": "tirnbtech@163.com",
                        "sub": []
                    },
                    {
                        "id": 1642,
                        "supervisor": 285,
                        "userfullname": "刘亮程",
                        "isManager": 0,
                        "username": "rnbtech11@sina.com",
                        "sub": []
                    },
                    {
                        "id": 1766,
                        "supervisor": 285,
                        "userfullname": "shift",
                        "isManager": 0,
                        "username": "shiftsl@139.com",
                        "sub": []
                    },
                    {
                        "id": 1968,
                        "supervisor": 285,
                        "userfullname": "irene7",
                        "isManager": 0,
                        "username": "ireneshen7@aliyun.com",
                        "sub": []
                    },
                    {
                        "id": 2389,
                        "supervisor": 285,
                        "userfullname": "小马哥",
                        "isManager": 0,
                        "username": "myp318@163.com",
                        "sub": []
                    },
                    {
                        "id": 2677,
                        "supervisor": 285,
                        "userfullname": "workordertest01",
                        "isManager": 0,
                        "username": "workordertest01@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 2678,
                        "supervisor": 285,
                        "userfullname": "workordertest02",
                        "isManager": 0,
                        "username": "workordertest02@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 2679,
                        "supervisor": 285,
                        "userfullname": "workordertest03",
                        "isManager": 0,
                        "username": "workordertest03@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 3315,
                        "supervisor": 285,
                        "userfullname": "SLSL",
                        "isManager": 0,
                        "username": "sl@slsl1.com",
                        "sub": []
                    },
                    {
                        "id": 3729,
                        "supervisor": 285,
                        "userfullname": "Irene123",
                        "isManager": 0,
                        "username": "Irene123",
                        "sub": []
                    },
                    {
                        "id": 3731,
                        "supervisor": 285,
                        "userfullname": "irene01",
                        "isManager": 0,
                        "username": "Irene01",
                        "sub": []
                    },
                    {
                        "id": 3733,
                        "supervisor": 285,
                        "userfullname": "Irene03",
                        "isManager": 0,
                        "username": "Irene03",
                        "sub": []
                    },
                    {
                        "id": 3751,
                        "supervisor": 285,
                        "userfullname": "Irene",
                        "isManager": 0,
                        "username": "Irene",
                        "sub": []
                    },
                    {
                        "id": 3752,
                        "supervisor": 285,
                        "userfullname": "Irene02",
                        "isManager": 0,
                        "username": "Irene02",
                        "sub": []
                    },
                    {
                        "id": 3753,
                        "supervisor": 285,
                        "userfullname": "Irene06",
                        "isManager": 0,
                        "username": "Irene06",
                        "sub": []
                    }
                ]
            },
            {
                "id": 513,
                "supervisor": 285,
                "userfullname": "irenel",
                "isSub": True,
                "isManager": 1,
                "username": "523705863@qq.com",
                "sub": []
            },
            {
                "id": 404,
                "supervisor": 114,
                "userfullname": "woody",
                "isSub": True,
                "isManager": 1,
                "username": "woody.wu@rnbtech.com.hk",
                "sub": [
                    {
                        "id": 2306,
                        "supervisor": 404,
                        "userfullname": "AutoTester",
                        "isManager": 0,
                        "username": "wuranxu@126.com",
                        "sub": []
                    },
                    {
                        "id": 2365,
                        "supervisor": 404,
                        "userfullname": "AutoTester",
                        "isSub": True,
                        "isManager": 1,
                        "username": "619434176@qq.com",
                        "sub": []
                    },
                    {
                        "id": 2366,
                        "supervisor": 404,
                        "userfullname": "woodyTest02",
                        "isManager": 0,
                        "username": "1613687333@qq.com",
                        "sub": []
                    },
                    {
                        "id": 2612,
                        "supervisor": 404,
                        "userfullname": "wooooooooody",
                        "isManager": 0,
                        "username": "wuranxu312@126.com",
                        "sub": []
                    },
                    {
                        "id": 2649,
                        "supervisor": 404,
                        "userfullname": "afieyfh",
                        "isManager": 0,
                        "username": "66666yueyue6@sina.com",
                        "sub": []
                    },
                    {
                        "id": 2707,
                        "supervisor": 404,
                        "userfullname": "wqeqwew",
                        "isManager": 0,
                        "username": "1516520442@qq.com",
                        "sub": []
                    }
                ]
            },
            {
                "id": 2365,
                "supervisor": 404,
                "userfullname": "AutoTester",
                "isSub": True,
                "isManager": 1,
                "username": "619434176@qq.com",
                "sub": []
            },
            {
                "id": 405,
                "supervisor": 114,
                "userfullname": "lily",
                "isSub": True,
                "isManager": 1,
                "username": "lily.li@rnbtech.com.hk",
                "sub": []
            },
            {
                "id": 456,
                "supervisor": 114,
                "userfullname": "Angelia",
                "isSub": True,
                "isManager": 1,
                "username": "1012325967@qq.com",
                "sub": [
                    {
                        "id": 3278,
                        "supervisor": 456,
                        "userfullname": "123456",
                        "isManager": 0,
                        "username": "cttjane@sina.cn",
                        "sub": []
                    }
                ]
            },
            {
                "id": 1511,
                "supervisor": 114,
                "userfullname": "carol",
                "isSub": True,
                "isManager": 1,
                "username": "carol.wei@rnbtech.com.hk",
                "sub": []
            },
            {
                "id": 1560,
                "supervisor": 114,
                "userfullname": "beopcloud",
                "isSub": True,
                "isManager": 1,
                "username": "beopcloud@126.com",
                "sub": [
                    {
                        "id": 3230,
                        "supervisor": 1560,
                        "userfullname": "test_ma",
                        "isManager": 0,
                        "username": "hyejinsoo@yahoo.com",
                        "sub": []
                    }
                ]
            },
            {
                "id": 1608,
                "supervisor": 114,
                "userfullname": "sophia",
                "isSub": True,
                "isManager": 1,
                "username": "sophia.zhao@rnbtech.com.hk",
                "sub": [
                    {
                        "id": 1747,
                        "supervisor": 1608,
                        "userfullname": "sophiatest",
                        "isManager": 0,
                        "username": "sophia201552@163.com",
                        "sub": []
                    },
                    {
                        "id": 2411,
                        "supervisor": 1608,
                        "userfullname": "AutoTester",
                        "isManager": 0,
                        "username": "sophia1990529@163.com",
                        "sub": []
                    },
                    {
                        "id": 2427,
                        "supervisor": 1608,
                        "userfullname": "sophia199321",
                        "isManager": 0,
                        "username": "sophia1993219@163.com",
                        "sub": []
                    },
                    {
                        "id": 2428,
                        "supervisor": 1608,
                        "userfullname": "sophia199111",
                        "isSub": True,
                        "isManager": 1,
                        "username": "sophia19911124@163.com",
                        "sub": []
                    },
                    {
                        "id": 2611,
                        "supervisor": 1608,
                        "userfullname": "123456",
                        "isManager": 0,
                        "username": "1281056983@qq.com",
                        "sub": []
                    },
                    {
                        "id": 2742,
                        "supervisor": 1608,
                        "userfullname": "test",
                        "isManager": 0,
                        "username": "1307518621@qq.com",
                        "sub": []
                    },
                    {
                        "id": 2744,
                        "supervisor": 1608,
                        "userfullname": "test1223",
                        "isManager": 0,
                        "username": "2491432087@qq.com",
                        "sub": []
                    }
                ]
            },
            {
                "id": 2428,
                "supervisor": 1608,
                "userfullname": "sophia199111",
                "isSub": True,
                "isManager": 1,
                "username": "sophia19911124@163.com",
                "sub": []
            },
            {
                "id": 1760,
                "supervisor": 114,
                "userfullname": "eric",
                "isSub": True,
                "isManager": 1,
                "username": "eric.wang@rnbtech.com.hk",
                "sub": []
            },
            {
                "id": 2200,
                "supervisor": 114,
                "userfullname": "lefi",
                "isSub": True,
                "isManager": 1,
                "username": "lefi.li@rnbtech.com.hk",
                "sub": [
                    {
                        "id": 3755,
                        "supervisor": 2200,
                        "userfullname": "lefi_test001",
                        "isManager": 0,
                        "username": "lefi_test001",
                        "sub": []
                    },
                    {
                        "id": 3756,
                        "supervisor": 2200,
                        "userfullname": "lefi_test002",
                        "isManager": 0,
                        "username": "lefi_test002",
                        "sub": []
                    },
                    {
                        "id": 3757,
                        "supervisor": 2200,
                        "userfullname": "lefi_test003",
                        "isManager": 0,
                        "username": "lefi_test003",
                        "sub": []
                    },
                    {
                        "id": 3758,
                        "supervisor": 2200,
                        "userfullname": "lefi_a_test001",
                        "isManager": 0,
                        "username": "lefi_a_test001",
                        "sub": []
                    },
                    {
                        "id": 3759,
                        "supervisor": 2200,
                        "userfullname": "lefi_a_test002",
                        "isManager": 0,
                        "username": "lefi_a_test002",
                        "sub": []
                    },
                    {
                        "id": 3760,
                        "supervisor": 2200,
                        "userfullname": "A_test111",
                        "isManager": 0,
                        "username": "A_test111",
                        "sub": []
                    },
                    {
                        "id": 3761,
                        "supervisor": 2200,
                        "userfullname": "A_test222",
                        "isManager": 0,
                        "username": "A_test222",
                        "sub": []
                    },
                    {
                        "id": 3764,
                        "supervisor": 2200,
                        "userfullname": "lefi_mytest001",
                        "isManager": 0,
                        "username": "lefi_mytest001",
                        "sub": []
                    },
                    {
                        "id": 3773,
                        "supervisor": 2200,
                        "userfullname": "mytest_11",
                        "isManager": 0,
                        "username": "mytest_11",
                        "sub": []
                    },
                    {
                        "id": 3774,
                        "supervisor": 2200,
                        "userfullname": "myTest_122",
                        "isManager": 0,
                        "username": "myTest_122",
                        "sub": []
                    },
                    {
                        "id": 3775,
                        "supervisor": 2200,
                        "userfullname": "mytest113",
                        "isManager": 0,
                        "username": "mytest113",
                        "sub": []
                    },
                    {
                        "id": 3776,
                        "supervisor": 2200,
                        "userfullname": "myTest114",
                        "isManager": 0,
                        "username": "myTest114",
                        "sub": []
                    },
                    {
                        "id": 3777,
                        "supervisor": 2200,
                        "userfullname": "mytest116",
                        "isManager": 0,
                        "username": "mytest116",
                        "sub": []
                    },
                    {
                        "id": 3778,
                        "supervisor": 2200,
                        "userfullname": "mytest007",
                        "isManager": 0,
                        "username": "mytest007",
                        "sub": []
                    }
                ]
            },
            {
                "id": 2265,
                "supervisor": 114,
                "userfullname": "AutoTester",
                "isSub": True,
                "isManager": 1,
                "username": "projecttest@rnbtech.com.hk",
                "sub": [
                    {
                        "id": 2656,
                        "supervisor": 2265,
                        "userfullname": "Woody",
                        "isManager": 0,
                        "username": "55497569@qq.com",
                        "sub": []
                    },
                    {
                        "id": 3266,
                        "supervisor": 2265,
                        "userfullname": "rrr",
                        "isManager": 0,
                        "username": "13304965@qq.com",
                        "sub": []
                    },
                    {
                        "id": 3272,
                        "supervisor": 2265,
                        "userfullname": "aigo",
                        "isManager": 0,
                        "username": "1627450577@qq.com",
                        "sub": []
                    },
                    {
                        "id": 3280,
                        "supervisor": 2265,
                        "userfullname": "qazwsx",
                        "isManager": 0,
                        "username": "95255214@qq.com",
                        "sub": []
                    },
                    {
                        "id": 3622,
                        "supervisor": 2265,
                        "userfullname": "weishu",
                        "isManager": 0,
                        "username": "weishu",
                        "sub": []
                    },
                    {
                        "id": 3650,
                        "supervisor": 2265,
                        "userfullname": "Good",
                        "isSub": True,
                        "isManager": 1,
                        "username": "good",
                        "sub": []
                    },
                    {
                        "id": 3749,
                        "supervisor": 2265,
                        "userfullname": "projecttes",
                        "isManager": 0,
                        "username": "projecttest_pwdreset@rnbtech.com.hk",
                        "sub": []
                    }
                ]
            },
            {
                "id": 3650,
                "supervisor": 2265,
                "userfullname": "Good",
                "isSub": True,
                "isManager": 1,
                "username": "good",
                "sub": []
            },
            {
                "id": 3200,
                "supervisor": 114,
                "userfullname": "Tony",
                "isSub": True,
                "isManager": 1,
                "username": "tony.nie@rnbtech.com.hk",
                "sub": [
                    {
                        "id": 1151,
                        "supervisor": 3200,
                        "userfullname": "Angelia02",
                        "isManager": 0,
                        "username": "angelia.chen@rnbtech.com.hk",
                        "sub": []
                    },
                    {
                        "id": 3771,
                        "supervisor": 3200,
                        "userfullname": "tony163",
                        "isManager": 0,
                        "username": "tony163",
                        "sub": []
                    },
                    {
                        "id": 3772,
                        "supervisor": 3200,
                        "userfullname": "tonyqq6",
                        "isManager": 0,
                        "username": "tonyqq6",
                        "sub": []
                    }
                ]
            }
        ],
        "currentUserRoleGroup": [
            "15",
            "17",
            "12",
            "13",
            "2",
            "3",
            "5",
            "8",
            "1",
            "19",
            "20",
            "4",
            "22",
            "14",
            "9",
            "7",
            "10",
            "6",
            "16",
            "21",
            "18"
        ],
        "supervisor": {
            "id": 1,
            "userpic": "/static/images/avatar/user/19069668.jpg",
            "username": "admin",
            "userfullname": "admin"
        },
        "userRoleGroup": [
            "15",
            "17",
            "12",
            "13",
            "2",
            "3",
            "5",
            "8",
            "1",
            "19",
            "20",
            "4",
            "22",
            "14",
            "9",
            "7",
            "10",
            "6",
            "16",
            "21",
            "18"
        ]
}
    TestCommon.LoadUsersSetting.assert_result_equals(expected, rt)