import pytest
from beopWeb.mod_admin import controllers



@pytest.mark.p0
@pytest.mark.parametrize(('req', 'expected'), [
    ({"userId":2265,"userList":[2265]},[
        {
            "useremail": "golding.gu@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/20705588.jpg",
            "id": 114,
            "userfullname": "golding"
        },
        {
            "useremail": "kruz.qian@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/24974991.jpg",
            "id": 65,
            "userfullname": "KRUZ"
        },
        {
            "useremail": "alice.xiong@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/22807957.png",
            "id": 1165,
            "userfullname": "alice"
        },
        {
            "useremail": "ruby.jiang@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/11258324.png",
            "id": 1218,
            "userfullname": "ruby"
        },
        {
            "useremail": "iw_cmu@tom.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png",
            "id": 1569,
            "userfullname": "IW_CMU"
        },
        {
            "useremail": "M_Yiping@yeah.net.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png",
            "id": 2643,
            "userfullname": "M_Yiping@yea"
        },
        {
            "useremail": "ntcacees@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png",
            "id": 2669,
            "userfullname": "ntcace"
        },
        {
            "useremail": "rnbcommon@sina.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png",
            "id": 2719,
            "userfullname": "冷链演示"
        },
        {
            "useremail": "BrightDTM@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png",
            "id": 2739,
            "userfullname": "BDTM内部测试"
        },
        {
            "useremail": "yingchu.qian@9v-sh.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png",
            "id": 2747,
            "userfullname": "yingchu.qian"
        },
        {
            "useremail": "Kasuya.takashi@takenaka.co.jp",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png",
            "id": 2794,
            "userfullname": "takashi"
        },
        {
            "useremail": "d_nakajima@afm.co.jp",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png",
            "id": 2795,
            "userfullname": "nakajima"
        },
        {
            "useremail": "Ericyangcem@Gmail.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png",
            "id": 3114,
            "userfullname": "Ericyangcem"
        },
        {
            "useremail": "qian_hanying@yahoo.co.jp",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png",
            "id": 3163,
            "userfullname": "sada "
        },
        {
            "useremail": "ntcace@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png",
            "id": 3188,
            "userfullname": "test"
        },
        {
            "useremail": "shixi01@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png",
            "id": 3191,
            "userfullname": "Bravo"
        },
        {
            "useremail": "shixi02@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png",
            "id": 3194,
            "userfullname": "Alpha"
        },
        {
            "useremail": "qianh_hanying_hanying@yahoo.co.jp",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png",
            "id": 3207,
            "userfullname": "qian_hanying"
        },
        {
            "useremail": "Kruz.qian@rnbtech.com.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png",
            "id": 3208,
            "userfullname": "qian"
        },
        {
            "useremail": "kruz.qian@rbbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png",
            "id": 3210,
            "userfullname": "qian"
        },
        {
            "useremail": "info@facilitymatrix.net",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png",
            "id": 3214,
            "userfullname": "FMinfo"
        },
        {
            "useremail": "YFBE@YFBE.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png",
            "id": 3220,
            "userfullname": "英菲葆尔"
        },
        {
            "useremail": "m_mukaigawara@afm.co.jp",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png",
            "id": 3320,
            "userfullname": "向川原 稔"
        },
        {
            "useremail": "ko_suzuki@afm.co.jp",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png",
            "id": 3321,
            "userfullname": "鈴木 康介"
        },
        {
            "useremail": "mi_fukuda@afm.co.jp",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png",
            "id": 3322,
            "userfullname": "福田 美月"
        },
        {
            "useremail": "kasuya.takashi@takenaka.co.jp",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png",
            "id": 3327,
            "userfullname": "粕谷 貴司"
        },
        {
            "useremail": "d_nakajima@afm.co.jp",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png",
            "id": 3328,
            "userfullname": "中島 大介"
        },
        {
            "useremail": "ikea1@ikea.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png",
            "id": 3640,
            "userfullname": "ikea"
        },
        {
            "useremail": "rui.he@jafco.co.jp",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png",
            "id": 3663,
            "userfullname": "何锐"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png",
            "id": 3664,
            "userfullname": "ikeademo"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png",
            "id": 3685,
            "userfullname": "ikeademoen"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png",
            "id": 3686,
            "userfullname": "pingtaiceshi"
        },
        {
            "useremail": "ntcace@aliyun.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png",
            "id": 3763,
            "userfullname": "ntcace"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png",
            "id": 3790,
            "userfullname": "InvitationTest"
        },
        {
            "useremail": "kingsley.he@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/19794688.png",
            "id": 67,
            "userfullname": "kingsley"
        },
        {
            "useremail": "nvgajc92140@chacuo.net",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png",
            "id": 2650,
            "userfullname": "inviteUsers"
        },
        {
            "useremail": "3289525927@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/27441555.jpg",
            "id": 2654,
            "userfullname": "Kirry"
        },
        {
            "useremail": "Kirry.gao@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png",
            "id": 2655,
            "userfullname": "Kirry"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png",
            "id": 3630,
            "userfullname": "123456789"
        },
        {
            "useremail": "2232502139@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png",
            "id": 3633,
            "userfullname": "catter"
        },
        {
            "useremail": "rikan.li@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/54268360.png",
            "id": 68,
            "userfullname": "rikan"
        },
        {
            "useremail": "uziype62159@chacuo.net",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png",
            "id": 2644,
            "userfullname": "ntcace@163.c"
        },
        {
            "useremail": "zbj0059@gmail.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png",
            "id": 2673,
            "userfullname": "zbj0059"
        },
        {
            "useremail": "murphy.ma@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png",
            "id": 69,
            "userfullname": "murphy"
        },
        {
            "useremail": "john.yang@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png",
            "id": 70,
            "userfullname": "john"
        },
        {
            "useremail": "mango.yan@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png",
            "id": 72,
            "userfullname": "mango"
        },
        {
            "useremail": "neil.yu@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/15581562.jpeg",
            "id": 73,
            "userfullname": "neil"
        },
        {
            "useremail": "matthew.zuo@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png",
            "id": 74,
            "userfullname": "matthew"
        },
        {
            "useremail": "robert.luo@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png",
            "id": 75,
            "userfullname": "robert"
        },
        {
            "useremail": "wanna.zhang@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/33831801.png",
            "id": 76,
            "userfullname": "wanna"
        },
        {
            "useremail": "amy.zhou@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png",
            "id": 77,
            "userfullname": "algo"
        },
        {
            "useremail": "fengyou.hua@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png",
            "id": 78,
            "userfullname": "fengyou"
        },
        {
            "useremail": "vicky.zhang@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/25786414.jpg",
            "id": 101,
            "userfullname": "vicky"
        },
        {
            "useremail": "owen.ou@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/27252988.jpg",
            "id": 215,
            "userfullname": "owen"
        },
        {
            "useremail": "408505925@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png",
            "id": 377,
            "userfullname": "owen-test"
        },
        {
            "useremail": "fdsfsfsdf@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png",
            "id": 1346,
            "userfullname": "owen-test1"
        },
        {
            "useremail": "1927748405@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png",
            "id": 1397,
            "userfullname": "owen-test0"
        },
        {
            "useremail": "peter.zhao@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png",
            "id": 262,
            "userfullname": "peter"
        },
        {
            "useremail": "irene.shen@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/14646559.jpg",
            "id": 285,
            "userfullname": "irene"
        },
        {
            "useremail": "523705863@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png",
            "id": 513,
            "userfullname": "irenel"
        },
        {
            "useremail": "slgz21@126.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png",
            "id": 1623,
            "userfullname": "slgz21"
        },
        {
            "useremail": "pgup22@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png",
            "id": 1637,
            "userfullname": "马仁勇"
        },
        {
            "useremail": "ctrlalt111@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png",
            "id": 1639,
            "userfullname": "张小娴"
        },
        {
            "useremail": "rnbtech111@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png",
            "id": 1640,
            "userfullname": "余华"
        },
        {
            "useremail": "tirnbtech@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png",
            "id": 1641,
            "userfullname": "史铁生"
        },
        {
            "useremail": "rnbtech11@sina.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png",
            "id": 1642,
            "userfullname": "刘亮程"
        },
        {
            "useremail": "shiftsl@139.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png",
            "id": 1766,
            "userfullname": "shift"
        },
        {
            "useremail": "ireneshen7@aliyun.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png",
            "id": 1968,
            "userfullname": "irene7"
        },
        {
            "useremail": "myp318@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png",
            "id": 2389,
            "userfullname": "小马哥"
        },
        {
            "useremail": "workordertest01@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png",
            "id": 2677,
            "userfullname": "workordertest01"
        },
        {
            "useremail": "workordertest02@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png",
            "id": 2678,
            "userfullname": "workordertest02"
        },
        {
            "useremail": "workordertest03@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png",
            "id": 2679,
            "userfullname": "workordertest03"
        },
        {
            "useremail": "sl@slsl1.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png",
            "id": 3315,
            "userfullname": "SLSL"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png",
            "id": 3729,
            "userfullname": "Irene123"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png",
            "id": 3731,
            "userfullname": "irene01"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png",
            "id": 3733,
            "userfullname": "Irene03"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png",
            "id": 3751,
            "userfullname": "Irene"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png",
            "id": 3752,
            "userfullname": "Irene02"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png",
            "id": 3753,
            "userfullname": "Irene06"
        },
        {
            "useremail": "18801791039@126.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/81650351.jpg",
            "id": 379,
            "userfullname": "Maggie"
        },
        {
            "useremail": "david.chen@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png ",
            "id": 402,
            "userfullname": "David"
        },
        {
            "useremail": "woody.wu@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/10000485.jpg",
            "id": 404,
            "userfullname": "woody"
        },
        {
            "useremail": "wuranxu@126.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png",
            "id": 2306,
            "userfullname": "AutoTester"
        },
        {
            "useremail": "619434176@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png",
            "id": 2365,
            "userfullname": "AutoTester"
        },
        {
            "useremail": "1613687333@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png",
            "id": 2366,
            "userfullname": "woodyTest02"
        },
        {
            "useremail": "wuranxu312@126.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png",
            "id": 2612,
            "userfullname": "wooooooooody"
        },
        {
            "useremail": "66666yueyue6@sina.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png",
            "id": 2649,
            "userfullname": "afieyfh"
        },
        {
            "useremail": "1516520442@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png",
            "id": 2707,
            "userfullname": "wqeqwew"
        },
        {
            "useremail": "lily.li@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png",
            "id": 405,
            "userfullname": "lily"
        },
        {
            "useremail": "12343403@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png",
            "id": 416,
            "userfullname": "golding2"
        },
        {
            "useremail": "1012325967@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/10309711.png",
            "id": 456,
            "userfullname": "Angelia"
        },
        {
            "useremail": "cttjane@sina.cn",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png",
            "id": 3278,
            "userfullname": "123456"
        },
        {
            "useremail": "lee.li@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png",
            "id": 527,
            "userfullname": "lee"
        },
        {
            "useremail": "will.wu@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/19910923.jpg",
            "id": 1101,
            "userfullname": "will"
        },
        {
            "useremail": "max.fan@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/22608808.png",
            "id": 1335,
            "userfullname": "max"
        },
        {
            "useremail": "stan.su@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png",
            "id": 1413,
            "userfullname": "stan"
        },
        {
            "useremail": "409800605@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png",
            "id": 1422,
            "userfullname": "zhanglun"
        },
        {
            "useremail": "dingjh0112@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png",
            "id": 1428,
            "userfullname": "Ding"
        },
        {
            "useremail": "carol.wei@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png",
            "id": 1511,
            "userfullname": "carol"
        },
        {
            "useremail": "beopcloud@126.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/1560_482406.jpg",
            "id": 1560,
            "userfullname": "beopcloud"
        },
        {
            "useremail": "hyejinsoo@yahoo.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png",
            "id": 3230,
            "userfullname": "test_ma"
        },
        {
            "useremail": "may.chen@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png",
            "id": 1589,
            "userfullname": "may"
        },
        {
            "useremail": "sophia.zhao@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png",
            "id": 1608,
            "userfullname": "sophia"
        },
        {
            "useremail": "sophia201552@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png",
            "id": 1747,
            "userfullname": "sophiatest"
        },
        {
            "useremail": "sophia1990529@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png",
            "id": 2411,
            "userfullname": "AutoTester"
        },
        {
            "useremail": "sophia1993219@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png",
            "id": 2427,
            "userfullname": "sophia199321"
        },
        {
            "useremail": "sophia19911124@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png",
            "id": 2428,
            "userfullname": "sophia199111"
        },
        {
            "useremail": "1281056983@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png",
            "id": 2611,
            "userfullname": "123456"
        },
        {
            "useremail": "1307518621@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png",
            "id": 2742,
            "userfullname": "test"
        },
        {
            "useremail": "2491432087@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png",
            "id": 2744,
            "userfullname": "test1223"
        },
        {
            "useremail": "lynch.bao@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png",
            "id": 1609,
            "userfullname": "lynch"
        },
        {
            "useremail": "wangtan@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png",
            "id": 1688,
            "userfullname": "wangtan"
        },
        {
            "useremail": "bill.sun@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/76535126.png",
            "id": 1743,
            "userfullname": "bill"
        },
        {
            "useremail": "eric.wang@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png",
            "id": 1760,
            "userfullname": "eric"
        },
        {
            "useremail": "ygyhjwy@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/49870724.jpg",
            "id": 2194,
            "userfullname": "杨光亿"
        },
        {
            "useremail": "lefi.li@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png",
            "id": 2200,
            "userfullname": "lefi"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png",
            "id": 3755,
            "userfullname": "lefi_test001"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png",
            "id": 3756,
            "userfullname": "lefi_test002"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png",
            "id": 3757,
            "userfullname": "lefi_test003"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png",
            "id": 3758,
            "userfullname": "lefi_a_test001"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png",
            "id": 3759,
            "userfullname": "lefi_a_test002"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png",
            "id": 3760,
            "userfullname": "A_test111"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png",
            "id": 3761,
            "userfullname": "A_test222"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png",
            "id": 3764,
            "userfullname": "lefi_mytest001"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png",
            "id": 3773,
            "userfullname": "mytest_11"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png",
            "id": 3774,
            "userfullname": "myTest_122"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png",
            "id": 3775,
            "userfullname": "mytest113"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png",
            "id": 3776,
            "userfullname": "myTest114"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png",
            "id": 3777,
            "userfullname": "mytest116"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png",
            "id": 3778,
            "userfullname": "mytest007"
        },
        {
            "useremail": "jack.jia@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png",
            "id": 2234,
            "userfullname": "jack"
        },
        {
            "useremail": "projecttest@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/20640546.png",
            "id": 2265,
            "userfullname": "AutoTester"
        },
        {
            "useremail": "55497569@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png",
            "id": 2656,
            "userfullname": "Woody"
        },
        {
            "useremail": "13304965@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png",
            "id": 3266,
            "userfullname": "rrr"
        },
        {
            "useremail": "1627450577@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png",
            "id": 3272,
            "userfullname": "aigo"
        },
        {
            "useremail": "95255214@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png",
            "id": 3280,
            "userfullname": "qazwsx"
        },
        {
            "useremail": "3289525957@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png",
            "id": 3622,
            "userfullname": "weishu"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png",
            "id": 3650,
            "userfullname": "Good"
        },
        {
            "useremail": "projecttest_pwdreset@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png",
            "id": 3749,
            "userfullname": "projecttes"
        },
        {
            "useremail": "hunter.su@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png",
            "id": 2273,
            "userfullname": "hunter"
        },
        {
            "useremail": "vivian.yang@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/26063712.jpg",
            "id": 2495,
            "userfullname": "vivian"
        },
        {
            "useremail": "rain.cao@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png",
            "id": 2522,
            "userfullname": "rain"
        },
        {
            "useremail": "notice@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png",
            "id": 2625,
            "userfullname": "notice"
        },
        {
            "useremail": "service@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png",
            "id": 2626,
            "userfullname": "service"
        },
        {
            "useremail": "david.chen007@outlook.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png",
            "id": 2670,
            "userfullname": "陈大为测试"
        },
        {
            "useremail": "daikon.my@gmail.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png",
            "id": 2693,
            "userfullname": "陈孝烽"
        },
        {
            "useremail": "daikon.chen@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png",
            "id": 2745,
            "userfullname": "陈孝烽"
        },
        {
            "useremail": "abby.jiang@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png",
            "id": 3041,
            "userfullname": "abby"
        },
        {
            "useremail": "marvin.zhou@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png",
            "id": 3042,
            "userfullname": "marvin"
        },
        {
            "useremail": "tony.nie@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/18046813.png",
            "id": 3200,
            "userfullname": "Tony"
        },
        {
            "useremail": "angelia.chen@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/19720613.jpg",
            "id": 1151,
            "userfullname": "Angelia02"
        },
        {
            "useremail": "tonywhitewhite@163.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png",
            "id": 3771,
            "userfullname": "tony163"
        },
        {
            "useremail": "176543457@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png",
            "id": 3772,
            "userfullname": "tonyqq6"
        },
        {
            "useremail": "julian.zhou@rnbtech.com.hk",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png",
            "id": 3215,
            "userfullname": "julian"
        },
        {
            "useremail": None,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png",
            "id": 3277,
            "userfullname": "rainf54rg"
        },
        {
            "useremail": "",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png",
            "id": 3598,
            "userfullname": "Ivy.Liu"
        },
        {
            "useremail": "315028435@qq.com",
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/82799259.png",
            "id": 3682,
            "userfullname": "Amy"
        }
    ]),
    ({"userId":2265,"userList":[114]},[
        {
            "userfullname": "golding",
            "useremail": "golding.gu@rnbtech.com.hk",
            "id": 114,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/20705588.jpg"
        },
        {
            "userfullname": "KRUZ",
            "useremail": "kruz.qian@rnbtech.com.hk",
            "id": 65,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/24974991.jpg"
        },
        {
            "userfullname": "alice",
            "useremail": "alice.xiong@rnbtech.com.hk",
            "id": 1165,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/22807957.png"
        },
        {
            "userfullname": "ruby",
            "useremail": "ruby.jiang@rnbtech.com.hk",
            "id": 1218,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/11258324.png"
        },
        {
            "userfullname": "IW_CMU",
            "useremail": "iw_cmu@tom.com",
            "id": 1569,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png"
        },
        {
            "userfullname": "M_Yiping@yea",
            "useremail": "M_Yiping@yeah.net.com",
            "id": 2643,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png"
        },
        {
            "userfullname": "ntcace",
            "useremail": "ntcacees@163.com",
            "id": 2669,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png"
        },
        {
            "userfullname": "冷链演示",
            "useremail": "rnbcommon@sina.com",
            "id": 2719,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png"
        },
        {
            "userfullname": "BDTM内部测试",
            "useremail": "BrightDTM@163.com",
            "id": 2739,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png"
        },
        {
            "userfullname": "yingchu.qian",
            "useremail": "yingchu.qian@9v-sh.com",
            "id": 2747,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png"
        },
        {
            "userfullname": "takashi",
            "useremail": "Kasuya.takashi@takenaka.co.jp",
            "id": 2794,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png"
        },
        {
            "userfullname": "nakajima",
            "useremail": "d_nakajima@afm.co.jp",
            "id": 2795,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png"
        },
        {
            "userfullname": "Ericyangcem",
            "useremail": "Ericyangcem@Gmail.com",
            "id": 3114,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png"
        },
        {
            "userfullname": "sada ",
            "useremail": "qian_hanying@yahoo.co.jp",
            "id": 3163,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png"
        },
        {
            "userfullname": "test",
            "useremail": "ntcace@163.com",
            "id": 3188,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png"
        },
        {
            "userfullname": "Bravo",
            "useremail": "shixi01@rnbtech.com.hk",
            "id": 3191,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png"
        },
        {
            "userfullname": "Alpha",
            "useremail": "shixi02@rnbtech.com.hk",
            "id": 3194,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png"
        },
        {
            "userfullname": "qian_hanying",
            "useremail": "qianh_hanying_hanying@yahoo.co.jp",
            "id": 3207,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png"
        },
        {
            "userfullname": "qian",
            "useremail": "Kruz.qian@rnbtech.com.com",
            "id": 3208,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png"
        },
        {
            "userfullname": "qian",
            "useremail": "kruz.qian@rbbtech.com.hk",
            "id": 3210,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png"
        },
        {
            "userfullname": "FMinfo",
            "useremail": "info@facilitymatrix.net",
            "id": 3214,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png"
        },
        {
            "userfullname": "英菲葆尔",
            "useremail": "YFBE@YFBE.com",
            "id": 3220,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png"
        },
        {
            "userfullname": "向川原 稔",
            "useremail": "m_mukaigawara@afm.co.jp",
            "id": 3320,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png"
        },
        {
            "userfullname": "鈴木 康介",
            "useremail": "ko_suzuki@afm.co.jp",
            "id": 3321,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png"
        },
        {
            "userfullname": "福田 美月",
            "useremail": "mi_fukuda@afm.co.jp",
            "id": 3322,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png"
        },
        {
            "userfullname": "粕谷 貴司",
            "useremail": "kasuya.takashi@takenaka.co.jp",
            "id": 3327,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png"
        },
        {
            "userfullname": "中島 大介",
            "useremail": "d_nakajima@afm.co.jp",
            "id": 3328,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png"
        },
        {
            "userfullname": "ikea",
            "useremail": "ikea1@ikea.com",
            "id": 3640,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png"
        },
        {
            "userfullname": "何锐",
            "useremail": "rui.he@jafco.co.jp",
            "id": 3663,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png"
        },
        {
            "userfullname": "ikeademo",
            "useremail": "",
            "id": 3664,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png"
        },
        {
            "userfullname": "ikeademoen",
            "useremail": "",
            "id": 3685,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png"
        },
        {
            "userfullname": "pingtaiceshi",
            "useremail": "",
            "id": 3686,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png"
        },
        {
            "userfullname": "ntcace",
            "useremail": "ntcace@aliyun.com",
            "id": 3763,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png"
        },
        {
            "userfullname": "InvitationTest",
            "useremail": "",
            "id": 3790,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png"
        },
        {
            "userfullname": "kingsley",
            "useremail": "kingsley.he@rnbtech.com.hk",
            "id": 67,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/19794688.png"
        },
        {
            "userfullname": "inviteUsers",
            "useremail": "nvgajc92140@chacuo.net",
            "id": 2650,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png"
        },
        {
            "userfullname": "Kirry",
            "useremail": "3289525927@qq.com",
            "id": 2654,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/27441555.jpg"
        },
        {
            "userfullname": "Kirry",
            "useremail": "Kirry.gao@rnbtech.com.hk",
            "id": 2655,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png"
        },
        {
            "userfullname": "123456789",
            "useremail": "",
            "id": 3630,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png"
        },
        {
            "userfullname": "catter",
            "useremail": "2232502139@qq.com",
            "id": 3633,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png"
        },
        {
            "userfullname": "rikan",
            "useremail": "rikan.li@rnbtech.com.hk",
            "id": 68,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/54268360.png"
        },
        {
            "userfullname": "ntcace@163.c",
            "useremail": "uziype62159@chacuo.net",
            "id": 2644,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png"
        },
        {
            "userfullname": "zbj0059",
            "useremail": "zbj0059@gmail.com",
            "id": 2673,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png"
        },
        {
            "userfullname": "murphy",
            "useremail": "murphy.ma@rnbtech.com.hk",
            "id": 69,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png"
        },
        {
            "userfullname": "john",
            "useremail": "john.yang@rnbtech.com.hk",
            "id": 70,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png"
        },
        {
            "userfullname": "mango",
            "useremail": "mango.yan@rnbtech.com.hk",
            "id": 72,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png"
        },
        {
            "userfullname": "neil",
            "useremail": "neil.yu@rnbtech.com.hk",
            "id": 73,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/15581562.jpeg"
        },
        {
            "userfullname": "matthew",
            "useremail": "matthew.zuo@rnbtech.com.hk",
            "id": 74,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png"
        },
        {
            "userfullname": "robert",
            "useremail": "robert.luo@rnbtech.com.hk",
            "id": 75,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png"
        },
        {
            "userfullname": "wanna",
            "useremail": "wanna.zhang@rnbtech.com.hk",
            "id": 76,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/33831801.png"
        },
        {
            "userfullname": "algo",
            "useremail": "amy.zhou@rnbtech.com.hk",
            "id": 77,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png"
        },
        {
            "userfullname": "fengyou",
            "useremail": "fengyou.hua@rnbtech.com.hk",
            "id": 78,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png"
        },
        {
            "userfullname": "vicky",
            "useremail": "vicky.zhang@rnbtech.com.hk",
            "id": 101,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/25786414.jpg"
        },
        {
            "userfullname": "owen",
            "useremail": "owen.ou@rnbtech.com.hk",
            "id": 215,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/27252988.jpg"
        },
        {
            "userfullname": "owen-test",
            "useremail": "408505925@qq.com",
            "id": 377,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png"
        },
        {
            "userfullname": "owen-test1",
            "useremail": "fdsfsfsdf@qq.com",
            "id": 1346,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png"
        },
        {
            "userfullname": "owen-test0",
            "useremail": "1927748405@qq.com",
            "id": 1397,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png"
        },
        {
            "userfullname": "peter",
            "useremail": "peter.zhao@rnbtech.com.hk",
            "id": 262,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png"
        },
        {
            "userfullname": "irene",
            "useremail": "irene.shen@rnbtech.com.hk",
            "id": 285,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/14646559.jpg"
        },
        {
            "userfullname": "irenel",
            "useremail": "523705863@qq.com",
            "id": 513,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png"
        },
        {
            "userfullname": "slgz21",
            "useremail": "slgz21@126.com",
            "id": 1623,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png"
        },
        {
            "userfullname": "马仁勇",
            "useremail": "pgup22@163.com",
            "id": 1637,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png"
        },
        {
            "userfullname": "张小娴",
            "useremail": "ctrlalt111@163.com",
            "id": 1639,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png"
        },
        {
            "userfullname": "余华",
            "useremail": "rnbtech111@163.com",
            "id": 1640,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png"
        },
        {
            "userfullname": "史铁生",
            "useremail": "tirnbtech@163.com",
            "id": 1641,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png"
        },
        {
            "userfullname": "刘亮程",
            "useremail": "rnbtech11@sina.com",
            "id": 1642,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png"
        },
        {
            "userfullname": "shift",
            "useremail": "shiftsl@139.com",
            "id": 1766,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png"
        },
        {
            "userfullname": "irene7",
            "useremail": "ireneshen7@aliyun.com",
            "id": 1968,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png"
        },
        {
            "userfullname": "小马哥",
            "useremail": "myp318@163.com",
            "id": 2389,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png"
        },
        {
            "userfullname": "workordertest01",
            "useremail": "workordertest01@rnbtech.com.hk",
            "id": 2677,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png"
        },
        {
            "userfullname": "workordertest02",
            "useremail": "workordertest02@rnbtech.com.hk",
            "id": 2678,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png"
        },
        {
            "userfullname": "workordertest03",
            "useremail": "workordertest03@rnbtech.com.hk",
            "id": 2679,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png"
        },
        {
            "userfullname": "SLSL",
            "useremail": "sl@slsl1.com",
            "id": 3315,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png"
        },
        {
            "userfullname": "Irene123",
            "useremail": "",
            "id": 3729,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png"
        },
        {
            "userfullname": "irene01",
            "useremail": "",
            "id": 3731,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png"
        },
        {
            "userfullname": "Irene03",
            "useremail": "",
            "id": 3733,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png"
        },
        {
            "userfullname": "Irene",
            "useremail": "",
            "id": 3751,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png"
        },
        {
            "userfullname": "Irene02",
            "useremail": "",
            "id": 3752,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png"
        },
        {
            "userfullname": "Irene06",
            "useremail": "",
            "id": 3753,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png"
        },
        {
            "userfullname": "Maggie",
            "useremail": "18801791039@126.com",
            "id": 379,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/81650351.jpg"
        },
        {
            "userfullname": "David",
            "useremail": "david.chen@rnbtech.com.hk",
            "id": 402,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png "
        },
        {
            "userfullname": "woody",
            "useremail": "woody.wu@rnbtech.com.hk",
            "id": 404,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/10000485.jpg"
        },
        {
            "userfullname": "AutoTester",
            "useremail": "wuranxu@126.com",
            "id": 2306,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png"
        },
        {
            "userfullname": "AutoTester",
            "useremail": "619434176@qq.com",
            "id": 2365,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png"
        },
        {
            "userfullname": "woodyTest02",
            "useremail": "1613687333@qq.com",
            "id": 2366,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png"
        },
        {
            "userfullname": "wooooooooody",
            "useremail": "wuranxu312@126.com",
            "id": 2612,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png"
        },
        {
            "userfullname": "afieyfh",
            "useremail": "66666yueyue6@sina.com",
            "id": 2649,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png"
        },
        {
            "userfullname": "wqeqwew",
            "useremail": "1516520442@qq.com",
            "id": 2707,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png"
        },
        {
            "userfullname": "lily",
            "useremail": "lily.li@rnbtech.com.hk",
            "id": 405,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png"
        },
        {
            "userfullname": "golding2",
            "useremail": "12343403@qq.com",
            "id": 416,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png"
        },
        {
            "userfullname": "Angelia",
            "useremail": "1012325967@qq.com",
            "id": 456,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/10309711.png"
        },
        {
            "userfullname": "123456",
            "useremail": "cttjane@sina.cn",
            "id": 3278,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png"
        },
        {
            "userfullname": "lee",
            "useremail": "lee.li@rnbtech.com.hk",
            "id": 527,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png"
        },
        {
            "userfullname": "will",
            "useremail": "will.wu@rnbtech.com.hk",
            "id": 1101,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/19910923.jpg"
        },
        {
            "userfullname": "max",
            "useremail": "max.fan@rnbtech.com.hk",
            "id": 1335,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/22608808.png"
        },
        {
            "userfullname": "stan",
            "useremail": "stan.su@rnbtech.com.hk",
            "id": 1413,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png"
        },
        {
            "userfullname": "zhanglun",
            "useremail": "409800605@qq.com",
            "id": 1422,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png"
        },
        {
            "userfullname": "Ding",
            "useremail": "dingjh0112@163.com",
            "id": 1428,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png"
        },
        {
            "userfullname": "carol",
            "useremail": "carol.wei@rnbtech.com.hk",
            "id": 1511,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png"
        },
        {
            "userfullname": "beopcloud",
            "useremail": "beopcloud@126.com",
            "id": 1560,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/1560_482406.jpg"
        },
        {
            "userfullname": "test_ma",
            "useremail": "hyejinsoo@yahoo.com",
            "id": 3230,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png"
        },
        {
            "userfullname": "may",
            "useremail": "may.chen@rnbtech.com.hk",
            "id": 1589,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png"
        },
        {
            "userfullname": "sophia",
            "useremail": "sophia.zhao@rnbtech.com.hk",
            "id": 1608,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png"
        },
        {
            "userfullname": "sophiatest",
            "useremail": "sophia201552@163.com",
            "id": 1747,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png"
        },
        {
            "userfullname": "AutoTester",
            "useremail": "sophia1990529@163.com",
            "id": 2411,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png"
        },
        {
            "userfullname": "sophia199321",
            "useremail": "sophia1993219@163.com",
            "id": 2427,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png"
        },
        {
            "userfullname": "sophia199111",
            "useremail": "sophia19911124@163.com",
            "id": 2428,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png"
        },
        {
            "userfullname": "123456",
            "useremail": "1281056983@qq.com",
            "id": 2611,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png"
        },
        {
            "userfullname": "test",
            "useremail": "1307518621@qq.com",
            "id": 2742,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png"
        },
        {
            "userfullname": "test1223",
            "useremail": "2491432087@qq.com",
            "id": 2744,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png"
        },
        {
            "userfullname": "lynch",
            "useremail": "lynch.bao@rnbtech.com.hk",
            "id": 1609,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png"
        },
        {
            "userfullname": "wangtan",
            "useremail": "wangtan@rnbtech.com.hk",
            "id": 1688,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png"
        },
        {
            "userfullname": "bill",
            "useremail": "bill.sun@rnbtech.com.hk",
            "id": 1743,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/76535126.png"
        },
        {
            "userfullname": "eric",
            "useremail": "eric.wang@rnbtech.com.hk",
            "id": 1760,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png"
        },
        {
            "userfullname": "杨光亿",
            "useremail": "ygyhjwy@163.com",
            "id": 2194,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/49870724.jpg"
        },
        {
            "userfullname": "lefi",
            "useremail": "lefi.li@rnbtech.com.hk",
            "id": 2200,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png"
        },
        {
            "userfullname": "lefi_test001",
            "useremail": "",
            "id": 3755,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png"
        },
        {
            "userfullname": "lefi_test002",
            "useremail": "",
            "id": 3756,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png"
        },
        {
            "userfullname": "lefi_test003",
            "useremail": "",
            "id": 3757,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png"
        },
        {
            "userfullname": "lefi_a_test001",
            "useremail": "",
            "id": 3758,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png"
        },
        {
            "userfullname": "lefi_a_test002",
            "useremail": "",
            "id": 3759,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png"
        },
        {
            "userfullname": "A_test111",
            "useremail": "",
            "id": 3760,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png"
        },
        {
            "userfullname": "A_test222",
            "useremail": "",
            "id": 3761,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png"
        },
        {
            "userfullname": "lefi_mytest001",
            "useremail": "",
            "id": 3764,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png"
        },
        {
            "userfullname": "mytest_11",
            "useremail": "",
            "id": 3773,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png"
        },
        {
            "userfullname": "myTest_122",
            "useremail": "",
            "id": 3774,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png"
        },
        {
            "userfullname": "mytest113",
            "useremail": "",
            "id": 3775,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png"
        },
        {
            "userfullname": "myTest114",
            "useremail": "",
            "id": 3776,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png"
        },
        {
            "userfullname": "mytest116",
            "useremail": "",
            "id": 3777,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png"
        },
        {
            "userfullname": "mytest007",
            "useremail": "",
            "id": 3778,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png"
        },
        {
            "userfullname": "jack",
            "useremail": "jack.jia@rnbtech.com.hk",
            "id": 2234,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png"
        },
        {
            "userfullname": "AutoTester",
            "useremail": "projecttest@rnbtech.com.hk",
            "id": 2265,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/12415938.png"
        },
        {
            "userfullname": "Woody",
            "useremail": "55497569@qq.com",
            "id": 2656,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png"
        },
        {
            "userfullname": "rrr",
            "useremail": "13304965@qq.com",
            "id": 3266,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png"
        },
        {
            "userfullname": "aigo",
            "useremail": "1627450577@qq.com",
            "id": 3272,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png"
        },
        {
            "userfullname": "qazwsx",
            "useremail": "95255214@qq.com",
            "id": 3280,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png"
        },
        {
            "userfullname": "weishu",
            "useremail": "3289525957@qq.com",
            "id": 3622,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png"
        },
        {
            "userfullname": "Good",
            "useremail": "",
            "id": 3650,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png"
        },
        {
            "userfullname": "projecttes",
            "useremail": "projecttest_pwdreset@rnbtech.com.hk",
            "id": 3749,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png"
        },
        {
            "userfullname": "hunter",
            "useremail": "hunter.su@rnbtech.com.hk",
            "id": 2273,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png"
        },
        {
            "userfullname": "vivian",
            "useremail": "vivian.yang@rnbtech.com.hk",
            "id": 2495,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/26063712.jpg"
        },
        {
            "userfullname": "rain",
            "useremail": "rain.cao@rnbtech.com.hk",
            "id": 2522,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png"
        },
        {
            "userfullname": "notice",
            "useremail": "notice@rnbtech.com.hk",
            "id": 2625,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png"
        },
        {
            "userfullname": "service",
            "useremail": "service@rnbtech.com.hk",
            "id": 2626,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png"
        },
        {
            "userfullname": "陈大为测试",
            "useremail": "david.chen007@outlook.com",
            "id": 2670,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png"
        },
        {
            "userfullname": "陈孝烽",
            "useremail": "daikon.my@gmail.com",
            "id": 2693,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png"
        },
        {
            "userfullname": "陈孝烽",
            "useremail": "daikon.chen@rnbtech.com.hk",
            "id": 2745,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png"
        },
        {
            "userfullname": "abby",
            "useremail": "abby.jiang@rnbtech.com.hk",
            "id": 3041,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png"
        },
        {
            "userfullname": "marvin",
            "useremail": "marvin.zhou@rnbtech.com.hk",
            "id": 3042,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png"
        },
        {
            "userfullname": "Tony",
            "useremail": "tony.nie@rnbtech.com.hk",
            "id": 3200,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/18046813.png"
        },
        {
            "userfullname": "Angelia02",
            "useremail": "angelia.chen@rnbtech.com.hk",
            "id": 1151,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/19720613.jpg"
        },
        {
            "userfullname": "tony163",
            "useremail": "tonywhitewhite@163.com",
            "id": 3771,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png"
        },
        {
            "userfullname": "tonyqq6",
            "useremail": "176543457@qq.com",
            "id": 3772,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png"
        },
        {
            "userfullname": "julian",
            "useremail": "julian.zhou@rnbtech.com.hk",
            "id": 3215,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png"
        },
        {
            "userfullname": "rainf54rg",
            "useremail": None,
            "id": 3277,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png"
        },
        {
            "userfullname": "Ivy.Liu",
            "useremail": "",
            "id": 3598,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png"
        },
        {
            "userfullname": "Amy",
            "useremail": "315028435@qq.com",
            "id": 3682,
            "userpic": "https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/82799259.png"
        }
    ])

])
def test_memberSelected(req, expected):
    data = controllers.do_admin_get_user_list(req)
    assert len(data)>=len(expected),'expected length={0},actual length={1}'
    for index,item in enumerate(expected):
        for key in item.keys():
            if key !='userpic':
                assert item.get(key)==data[index].get(key),'not equal,expected data is {0},acutal data is {1}'.format(item.get(key),data[index].get(key))
