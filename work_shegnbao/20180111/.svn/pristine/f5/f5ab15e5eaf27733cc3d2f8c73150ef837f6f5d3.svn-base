#coding=utf-8
__author__ = 'angelia'

import pytest
from tests.utils import TestCommon
from beopWeb.mod_admin.controllers import *

@pytest.mark.p0
def test_loadUsersTree_super():
    rt = TestCommon.LoadUsersTree.run({
        'userId':456,
    })
    expexted = {
        'isManager': 1,
        'sub': [
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                'userfullname': '123456',
                'userstatus': 'registered',
                'id': 3278,
                'supervisor': 456,
                'username': 'cttjane@sina.cn'
            }
        ],
        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/10309711.png',
        'userfullname': 'Angelia',
        'userstatus': 'registered',
        'id': 456,
        'supervisor': 114,
        'username': '1012325967@qq.com'
    }
    TestCommon.LoadUsersTree.assert_result_equals(expexted, rt)

@pytest.mark.p0
def test_loadUsersTree_direct():
    rt = TestCommon.LoadUsersTree.run({
        'userId':1151,
    })
    expexted = {
        'isManager': 0,
        'sub': [],
        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/19720613.jpg',
        'userfullname': 'Angelia02',
        'userstatus': 'registered',
        'id': 1151,
        'supervisor': 3200,
        'username': 'angelia.chen@rnbtech.com.hk'
    }
    TestCommon.LoadUsersTree.assert_result_equals(expexted, rt)

@pytest.mark.p0
def test_loadUsersTree_admin():
    rt = TestCommon.LoadUsersTree.run({
        'userId':1,
    })
    expexted = {
        'UserRoleGroupList': [
            {
                'name':'后台组',
                'id': 1,
                'roles': 'BSCode,WFManager,BAdmin'
            },
            {
                'name': '数据接入组',
                'id': 2,
                'roles': 'BSData,DTSever,WFManager,BAdmin'
            },
            {
                'name': '文档管理员',
                'id': 3,
                'roles': 'BSDocument,BAdmin'
            },
            {
                'name': '算法组',
                'id': 4,
                'roles': 'DataOperator,BAdmin'
            },
            {
                'name': '前端开发',
                'id': 5,
                'roles': 'DataOperator,WFManager,BAdmin'
            },
            {
                'name': '测试与产品组',
                'id': 6,
                'roles': 'DTSever,WFAdmin,BAdmin'
            },
            {
                'name': '技术支持主管',
                'id': 7,
                'roles': 'WFAdmin,BAdmin,DataOperator'
            },
            {
                'name': '技术支持',
                'id': 8,
                'roles': 'WikiAdmin,WFManager,DataOperator,BEngineer'
            },
            {
                'name': '工程部',
                'id': 9,
                'roles': 'DTUser,WFUser'
            },
            {
                'name': '其他所有系统用户',
                'id': 10,
                'roles': 'BGeneralUser'
            },
            {
                'name': '直接用户中的只读用户',
                'id': 11,
                'roles': 'DCROnly'
            },
            {
                'name': '直接用户中的数据分析员',
                'id': 12,
                'roles': 'DCDataAnalyst'
            },
            {
                'name': '直接用户中的工程师',
                'id': 13,
                'roles': 'DCEngineer'
            },
            {
                'name': '直接用户中的管理员',
                'id': 14,
                'roles': 'DCAdmin'
            },
            {
                'name': '平台用户的只读用户',
                'id': 15,
                'roles': 'SCROnly'
            },
            {
                'name': '平台用户的数据分析员',
                'id': 16,
                'roles': 'SCDataAnalyst'
            },
            {
                'name': '平台用户中的webfactory工程师',
                'id': 17,
                'roles': 'SCWFEngineer'
            },
            {
                'name': '平台用户中的调试工程师',
                'id': 18,
                'roles': 'SCDEngineer'
            },
            {
                'name': '平台用户中的管理人',
                'id': 19,
                'roles': 'SCManager'
            },
            {
                'name': '平台用户中的admin',
                'id': 20,
                'roles': 'SCAdmin'
            },
            {
                'name': '人员管理',
                'id': 21,
                'roles': 'PManager'
            },
            {
                'name': 'root',
                'id': 22,
                'roles': 'PRoot'
            },
            {
                'name': '超级管理员',
                'id': 23,
                'roles': 'Capitaland_SuperAdmin'
            },
            {
                'name': '数据分析师',
                'id': 24,
                'roles': 'Capitaland_DataAnalyst'
            },
            {
                'name': '区域工程师',
                'id': 25,
                'roles': 'Capitaland_RegionEngineer'
            },
            {
                'name': '区域物业总',
                'id': 26,
                'roles': 'Capitaland_RPManager'
            },
            {
                'name': '单体项目物业负责人',
                'id': 27,
                'roles': 'Capitaland_MPPManager'
            },
            {
                'name': '单体项目工程经理',
                'id': 28,
                'roles': 'Capitaland_MEPManager'
            },
            {
                'name': '单体项目工程主管',
                'id': 29,
                'roles': 'Capitaland_MPESupervisor'
            },
            {
                'name': '集团用户',
                'id': 30,
                'roles': 'GroupUserRole'
            },
            {
                'name': '平台用户',
                'id': 31,
                'roles': 'PlatformUserRole'
            },
            {
                'name': '演示账号',
                'id': 32,
                'roles': 'DemoAccountRole'
            }
        ],
        'isManager': 1,
        'sub': [
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': 'BeOP',
                'userstatus': 'registered',
                'id': 2,
                'supervisor': 1,
                'username': 'beop'
            },
            {
                'isManager': 1,
                'sub': [
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': 'hwuser',
                        'userstatus': 'registered',
                        'id': 5,
                        'supervisor': 4,
                        'username': 'hwuser'
                    }
                ],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                'userfullname': 'hwadmin',
                'userstatus': 'registered',
                'id': 4,
                'supervisor': 1,
                'username': 'hwadmin'
            },
            {
                'isManager': 1,
                'sub': [
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': 'hruser',
                        'userstatus': 'registered',
                        'id': 7,
                        'supervisor': 6,
                        'username': 'hruser'
                    }
                ],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                'userfullname': 'hradmin',
                'userstatus': 'registered',
                'id': 6,
                'supervisor': 1,
                'username': 'hradmin'
            },
            {
                'isManager': 1,
                'sub': [
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': 'theuns57',
                        'userstatus': 'registered',
                        'id': 1782,
                        'supervisor': 81,
                        'username': 'theuns57@gmail.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': 'Yanchao Li',
                        'userstatus': 'registered',
                        'id': 2667,
                        'supervisor': 81,
                        'username': 'yanchao.li@cbre.com.sg'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': 'Amol Gudhate',
                        'userstatus': 'invited',
                        'id': 2668,
                        'supervisor': 81,
                        'username': 'amol.gudhate@cbre.co.in'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': 'Jonny',
                        'userstatus': 'registered',
                        'id': 3203,
                        'supervisor': 81,
                        'username': 'jonny@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': 'kenlam',
                        'userstatus': 'registered',
                        'id': 3613,
                        'supervisor': 81,
                        'username': 'kenlam'
                    }
                ],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/48545644.jpeg',
                'userfullname': 'charles',
                'userstatus': 'registered',
                'id': 81,
                'supervisor': 1,
                'username': 'charleswong@rnbtech.com.hk'
            },
            {
                'isManager': 1,
                'sub': [
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': 'Xuxiaoyi',
                        'userstatus': 'registered',
                        'id': 2657,
                        'supervisor': 82,
                        'username': 'john.xu@murata.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': 'Yuji Mitsui',
                        'userstatus': 'registered',
                        'id': 2658,
                        'supervisor': 82,
                        'username': 'y_mitsui@murata.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': 'yangm2',
                        'userstatus': 'invited',
                        'id': 2796,
                        'supervisor': 82,
                        'username': 'yangm2@asme.org'
                    },
                    {
                        'isManager': 1,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': 'Glennwudemo',
                        'userstatus': 'registered',
                        'id': 3265,
                        'supervisor': 82,
                        'username': 'Glennwu@demo.com'
                    }
                ],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': 'glennwu',
                'userstatus': 'registered',
                'id': 82,
                'supervisor': 1,
                'username': 'glennwu@rnbtech.com.hk'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                'userfullname': 'shengchun',
                'userstatus': 'expired',
                'id': 84,
                'supervisor': 1,
                'username': 'shengchun.ouyang@rnbtech.com.hk'
            },
            {
                'isManager': 1,
                'sub': [
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '祁伟',
                        'userstatus': 'expired',
                        'id': 2648,
                        'supervisor': 85,
                        'username': 'wei.qi@uvchip.com'
                    }
                ],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                'userfullname': 'roger',
                'userstatus': 'expired',
                'id': 85,
                'supervisor': 1,
                'username': 'roger.jiang@rnbtech.com.hk'
            },
            {
                'isManager': 1,
                'sub': [
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/22807957.png',
                                'userfullname': 'alice',
                                'userstatus': 'expired',
                                'id': 1165,
                                'supervisor': 65,
                                'username': 'alice.xiong@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/11258324.png',
                                'userfullname': 'ruby',
                                'userstatus': 'registered',
                                'id': 1218,
                                'supervisor': 65,
                                'username': 'ruby.jiang@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                'userfullname': 'IW_CMU',
                                'userstatus': 'expired',
                                'id': 1569,
                                'supervisor': 65,
                                'username': 'iw_cmu@tom.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                'userfullname': 'M_Yiping@yea',
                                'userstatus': 'invited',
                                'id': 2643,
                                'supervisor': 65,
                                'username': 'M_Yiping@yeah.net.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                'userfullname': 'ntcace',
                                'userstatus': 'registered',
                                'id': 2669,
                                'supervisor': 65,
                                'username': 'ntcacees@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                'userfullname': '冷链演示',
                                'userstatus': 'registered',
                                'id': 2719,
                                'supervisor': 65,
                                'username': 'rnbcommon@sina.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': 'BDTM内部测试',
                                'userstatus': 'registered',
                                'id': 2739,
                                'supervisor': 65,
                                'username': 'BrightDTM@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                'userfullname': 'yingchu.qian',
                                'userstatus': 'registered',
                                'id': 2747,
                                'supervisor': 65,
                                'username': 'yingchu.qian@9v-sh.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': 'takashi',
                                'userstatus': 'registered',
                                'id': 2794,
                                'supervisor': 65,
                                'username': 'Bak.Kasuya.takashi@takenaka.co.jp'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': 'nakajima',
                                'userstatus': 'registered',
                                'id': 2795,
                                'supervisor': 65,
                                'username': 'Bak.d_nakajima@afm.co.jp'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                'userfullname': 'Ericyangcem',
                                'userstatus': 'invited',
                                'id': 3114,
                                'supervisor': 65,
                                'username': 'Ericyangcem@Gmail.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': 'sada ',
                                'userstatus': 'invited',
                                'id': 3163,
                                'supervisor': 65,
                                'username': 'qian_hanying@yahoo.co.jp'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': 'test',
                                'userstatus': 'registered',
                                'id': 3188,
                                'supervisor': 65,
                                'username': 'ntcace@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                'userfullname': 'Bravo',
                                'userstatus': 'expired',
                                'id': 3191,
                                'supervisor': 65,
                                'username': 'shixi01@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                'userfullname': 'Alpha',
                                'userstatus': 'expired',
                                'id': 3194,
                                'supervisor': 65,
                                'username': 'shixi02@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': 'qian_hanying',
                                'userstatus': 'expired',
                                'id': 3207,
                                'supervisor': 65,
                                'username': 'qianh_hanying_hanying@yahoo.co.jp'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': 'qian',
                                'userstatus': 'expired',
                                'id': 3208,
                                'supervisor': 65,
                                'username': 'Kruz.qian@rnbtech.com.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': 'qian',
                                'userstatus': 'expired',
                                'id': 3210,
                                'supervisor': 65,
                                'username': 'kruz.qian@rbbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': 'FMinfo',
                                'userstatus': 'registered',
                                'id': 3214,
                                'supervisor': 65,
                                'username': 'info@facilitymatrix.net'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': '英菲葆尔',
                                'userstatus': 'registered',
                                'id': 3220,
                                'supervisor': 65,
                                'username': 'YFBE@YFBE.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                'userfullname': '向川原 稔',
                                'userstatus': 'registered',
                                'id': 3320,
                                'supervisor': 65,
                                'username': 'm_mukaigawara@afm.co.jp'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                'userfullname': '鈴木 康介',
                                'userstatus': 'registered',
                                'id': 3321,
                                'supervisor': 65,
                                'username': 'ko_suzuki@afm.co.jp'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                'userfullname': '福田 美月',
                                'userstatus': 'registered',
                                'id': 3322,
                                'supervisor': 65,
                                'username': 'mi_fukuda@afm.co.jp'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': '粕谷 貴司',
                                'userstatus': 'registered',
                                'id': 3327,
                                'supervisor': 65,
                                'username': 'kasuya.takashi@takenaka.co.jp'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': '中島 大介',
                                'userstatus': 'registered',
                                'id': 3328,
                                'supervisor': 65,
                                'username': 'd_nakajima@afm.co.jp'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': 'ikea',
                                'userstatus': 'registered',
                                'id': 3640,
                                'supervisor': 65,
                                'username': 'ikea'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                'userfullname': '何锐',
                                'userstatus': 'registered',
                                'id': 3663,
                                'supervisor': 65,
                                'username': 'rui.he@jafco.co.jp'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': 'ikeademo',
                                'userstatus': 'registered',
                                'id': 3664,
                                'supervisor': 65,
                                'username': 'ikeademo'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': 'ikeademoen',
                                'userstatus': 'registered',
                                'id': 3685,
                                'supervisor': 65,
                                'username': 'ikeademoen'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': 'pingtaiceshi',
                                'userstatus': 'registered',
                                'id': 3686,
                                'supervisor': 65,
                                'username': 'pingtaiceshi'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': 'ntcace',
                                'userstatus': 'registered',
                                'id': 3763,
                                'supervisor': 65,
                                'username': 'ntcace'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': 'InvitationTest',
                                'userstatus': 'registered',
                                'id': 3790,
                                'supervisor': 65,
                                'username': 'InvitationTest'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/24974991.jpg',
                        'userfullname': 'KRUZ',
                        'userstatus': 'registered',
                        'id': 65,
                        'supervisor': 114,
                        'username': 'kruz.qian@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': 'inviteUsers',
                                'userstatus': 'invited',
                                'id': 2650,
                                'supervisor': 67,
                                'username': 'nvgajc92140@chacuo.net'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/27441555.jpg',
                                'userfullname': 'Kirry',
                                'userstatus': 'registered',
                                'id': 2654,
                                'supervisor': 67,
                                'username': '3289525927@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                'userfullname': 'Kirry',
                                'userstatus': 'expired',
                                'id': 2655,
                                'supervisor': 67,
                                'username': 'Kirry.gao@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                'userfullname': '123456789',
                                'userstatus': 'expired',
                                'id': 3630,
                                'supervisor': 67,
                                'username': '123456789'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                'userfullname': 'catter',
                                'userstatus': 'registered',
                                'id': 3633,
                                'supervisor': 67,
                                'username': 'catter'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/19794688.png',
                        'userfullname': 'kingsley',
                        'userstatus': 'registered',
                        'id': 67,
                        'supervisor': 114,
                        'username': 'kingsley.he@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                'userfullname': 'ntcace@163.c',
                                'userstatus': 'expired',
                                'id': 2644,
                                'supervisor': 68,
                                'username': 'uziype62159@chacuo.net'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                'userfullname': 'zbj0059',
                                'userstatus': 'invited',
                                'id': 2673,
                                'supervisor': 68,
                                'username': 'zbj0059@gmail.com'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/54268360.png',
                        'userfullname': 'rikan',
                        'userstatus': 'expired',
                        'id': 68,
                        'supervisor': 114,
                        'username': 'rikan.li@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': 'murphy',
                        'userstatus': 'registered',
                        'id': 69,
                        'supervisor': 114,
                        'username': 'murphy.ma@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': 'john',
                        'userstatus': 'registered',
                        'id': 70,
                        'supervisor': 114,
                        'username': 'john.yang@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': 'mango',
                        'userstatus': 'registered',
                        'id': 72,
                        'supervisor': 114,
                        'username': 'mango.yan@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/15581562.jpeg',
                        'userfullname': 'neil',
                        'userstatus': 'registered',
                        'id': 73,
                        'supervisor': 114,
                        'username': 'neil.yu@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': 'matthew',
                        'userstatus': 'registered',
                        'id': 74,
                        'supervisor': 114,
                        'username': 'matthew.zuo@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': 'robert',
                        'userstatus': 'registered',
                        'id': 75,
                        'supervisor': 114,
                        'username': 'robert.luo@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/33831801.png',
                        'userfullname': 'wanna',
                        'userstatus': 'registered',
                        'id': 76,
                        'supervisor': 114,
                        'username': 'wanna.zhang@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': 'algo',
                        'userstatus': 'registered',
                        'id': 77,
                        'supervisor': 114,
                        'username': 'amy.zhou@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': 'fengyou',
                        'userstatus': 'registered',
                        'id': 78,
                        'supervisor': 114,
                        'username': 'fengyou.hua@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/25786414.jpg',
                        'userfullname': 'vicky',
                        'userstatus': 'expired',
                        'id': 101,
                        'supervisor': 114,
                        'username': 'vicky.zhang@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': 'owen-test',
                                'userstatus': 'registered',
                                'id': 377,
                                'supervisor': 215,
                                'username': '408505925@qq.com'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': 'owen-test1',
                                'userstatus': 'invited',
                                'id': 1346,
                                'supervisor': 215,
                                'username': 'fdsfsfsdf@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': 'owen-test0',
                                'userstatus': 'invited',
                                'id': 1397,
                                'supervisor': 215,
                                'username': '1927748405@qq.com'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/27252988.jpg',
                        'userfullname': 'owen',
                        'userstatus': 'registered',
                        'id': 215,
                        'supervisor': 114,
                        'username': 'owen.ou@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': 'peter',
                        'userstatus': 'registered',
                        'id': 262,
                        'supervisor': 114,
                        'username': 'peter.zhao@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                'userfullname': 'irenel',
                                'userstatus': 'registered',
                                'id': 513,
                                'supervisor': 285,
                                'username': '523705863@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': 'slgz21',
                                'userstatus': 'expired',
                                'id': 1623,
                                'supervisor': 285,
                                'username': 'slgz21@126.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                'userfullname': '马仁勇',
                                'userstatus': 'registered',
                                'id': 1637,
                                'supervisor': 285,
                                'username': 'pgup22@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                'userfullname': '张小娴',
                                'userstatus': 'registered',
                                'id': 1639,
                                'supervisor': 285,
                                'username': 'ctrlalt111@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                'userfullname': '余华',
                                'userstatus': 'registered',
                                'id': 1640,
                                'supervisor': 285,
                                'username': 'rnbtech111@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                'userfullname': '史铁生',
                                'userstatus': 'registered',
                                'id': 1641,
                                'supervisor': 285,
                                'username': 'tirnbtech@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': '刘亮程',
                                'userstatus': 'registered',
                                'id': 1642,
                                'supervisor': 285,
                                'username': 'rnbtech11@sina.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                'userfullname': 'shift',
                                'userstatus': 'registered',
                                'id': 1766,
                                'supervisor': 285,
                                'username': 'shiftsl@139.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': 'irene7',
                                'userstatus': 'registered',
                                'id': 1968,
                                'supervisor': 285,
                                'username': 'ireneshen7@aliyun.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                'userfullname': '小马哥',
                                'userstatus': 'expired',
                                'id': 2389,
                                'supervisor': 285,
                                'username': 'myp318@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                'userfullname': 'workordertest01',
                                'userstatus': 'registered',
                                'id': 2677,
                                'supervisor': 285,
                                'username': 'workordertest01@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': 'workordertest02',
                                'userstatus': 'registered',
                                'id': 2678,
                                'supervisor': 285,
                                'username': 'workordertest02@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                'userfullname': 'workordertest03',
                                'userstatus': 'registered',
                                'id': 2679,
                                'supervisor': 285,
                                'username': 'workordertest03@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                'userfullname': 'SLSL',
                                'userstatus': 'invited',
                                'id': 3315,
                                'supervisor': 285,
                                'username': 'sl@slsl1.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                'userfullname': 'Irene123',
                                'userstatus': 'registered',
                                'id': 3729,
                                'supervisor': 285,
                                'username': 'Irene123'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                'userfullname': 'irene01',
                                'userstatus': 'registered',
                                'id': 3731,
                                'supervisor': 285,
                                'username': 'Irene01'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': 'Irene03',
                                'userstatus': 'registered',
                                'id': 3733,
                                'supervisor': 285,
                                'username': 'Irene03'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                'userfullname': 'Irene',
                                'userstatus': 'expired',
                                'id': 3751,
                                'supervisor': 285,
                                'username': 'Irene'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                'userfullname': 'Irene02',
                                'userstatus': 'expired',
                                'id': 3752,
                                'supervisor': 285,
                                'username': 'Irene02'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                'userfullname': 'Irene06',
                                'userstatus': 'expired',
                                'id': 3753,
                                'supervisor': 285,
                                'username': 'Irene06'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/14646559.jpg',
                        'userfullname': 'irene',
                        'userstatus': 'registered',
                        'id': 285,
                        'supervisor': 114,
                        'username': 'irene.shen@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/81650351.jpg',
                        'userfullname': 'Maggie',
                        'userstatus': 'registered',
                        'id': 379,
                        'supervisor': 114,
                        'username': '18801791039@126.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png ',
                        'userfullname': 'David',
                        'userstatus': 'registered',
                        'id': 402,
                        'supervisor': 114,
                        'username': 'david.chen@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': 'AutoTester',
                                'userstatus': 'expired',
                                'id': 2306,
                                'supervisor': 404,
                                'username': 'wuranxu@126.com'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                'userfullname': 'AutoTester',
                                'userstatus': 'expired',
                                'id': 2365,
                                'supervisor': 404,
                                'username': '619434176@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                'userfullname': 'woodyTest02',
                                'userstatus': 'expired',
                                'id': 2366,
                                'supervisor': 404,
                                'username': '1613687333@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': 'wooooooooody',
                                'userstatus': 'expired',
                                'id': 2612,
                                'supervisor': 404,
                                'username': 'wuranxu312@126.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                'userfullname': 'afieyfh',
                                'userstatus': 'expired',
                                'id': 2649,
                                'supervisor': 404,
                                'username': '66666yueyue6@sina.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                'userfullname': 'wqeqwew',
                                'userstatus': 'expired',
                                'id': 2707,
                                'supervisor': 404,
                                'username': '1516520442@qq.com'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/10000485.jpg',
                        'userfullname': 'woody',
                        'userstatus': 'registered',
                        'id': 404,
                        'supervisor': 114,
                        'username': 'woody.wu@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': 'lily',
                        'userstatus': 'registered',
                        'id': 405,
                        'supervisor': 114,
                        'username': 'lily.li@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': 'golding2',
                        'userstatus': 'expired',
                        'id': 416,
                        'supervisor': 114,
                        'username': '12343403@qq.com'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                'userfullname': '123456',
                                'userstatus': 'registered',
                                'id': 3278,
                                'supervisor': 456,
                                'username': 'cttjane@sina.cn'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/10309711.png',
                        'userfullname': 'Angelia',
                        'userstatus': 'registered',
                        'id': 456,
                        'supervisor': 114,
                        'username': '1012325967@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': 'lee',
                        'userstatus': 'registered',
                        'id': 527,
                        'supervisor': 114,
                        'username': 'lee.li@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/19910923.jpg',
                        'userfullname': 'will',
                        'userstatus': 'expired',
                        'id': 1101,
                        'supervisor': 114,
                        'username': 'will.wu@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/22608808.png',
                        'userfullname': 'max',
                        'userstatus': 'registered',
                        'id': 1335,
                        'supervisor': 114,
                        'username': 'max.fan@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': 'stan',
                        'userstatus': 'registered',
                        'id': 1413,
                        'supervisor': 114,
                        'username': 'stan.su@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': 'zhanglun',
                        'userstatus': 'expired',
                        'id': 1422,
                        'supervisor': 114,
                        'username': '409800605@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': 'Ding',
                        'userstatus': 'expired',
                        'id': 1428,
                        'supervisor': 114,
                        'username': 'dingjh0112@163.com'
                    },
                    {
                        'isManager': 1,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': 'carol',
                        'userstatus': 'registered',
                        'id': 1511,
                        'supervisor': 114,
                        'username': 'carol.wei@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                'userfullname': 'test_ma',
                                'userstatus': 'invited',
                                'id': 3230,
                                'supervisor': 1560,
                                'username': 'hyejinsoo@yahoo.com'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/1560_482406.jpg',
                        'userfullname': 'beopcloud',
                        'userstatus': 'registered',
                        'id': 1560,
                        'supervisor': 114,
                        'username': 'beopcloud@126.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': 'may',
                        'userstatus': 'registered',
                        'id': 1589,
                        'supervisor': 114,
                        'username': 'may.chen@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                'userfullname': 'sophiatest',
                                'userstatus': 'expired',
                                'id': 1747,
                                'supervisor': 1608,
                                'username': 'sophia201552@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                'userfullname': 'AutoTester',
                                'userstatus': 'expired',
                                'id': 2411,
                                'supervisor': 1608,
                                'username': 'sophia1990529@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                'userfullname': 'sophia199321',
                                'userstatus': 'expired',
                                'id': 2427,
                                'supervisor': 1608,
                                'username': 'sophia1993219@163.com'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                'userfullname': 'sophia199111',
                                'userstatus': 'expired',
                                'id': 2428,
                                'supervisor': 1608,
                                'username': 'sophia19911124@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': '123456',
                                'userstatus': 'expired',
                                'id': 2611,
                                'supervisor': 1608,
                                'username': '1281056983@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                'userfullname': 'test',
                                'userstatus': 'expired',
                                'id': 2742,
                                'supervisor': 1608,
                                'username': '1307518621@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                'userfullname': 'test1223',
                                'userstatus': 'expired',
                                'id': 2744,
                                'supervisor': 1608,
                                'username': '2491432087@qq.com'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': 'sophia',
                        'userstatus': 'registered',
                        'id': 1608,
                        'supervisor': 114,
                        'username': 'sophia.zhao@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': 'lynch',
                        'userstatus': 'expired',
                        'id': 1609,
                        'supervisor': 114,
                        'username': 'lynch.bao@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': 'wangtan',
                        'userstatus': 'expired',
                        'id': 1688,
                        'supervisor': 114,
                        'username': 'wangtan@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/76535126.png',
                        'userfullname': 'bill',
                        'userstatus': 'registered',
                        'id': 1743,
                        'supervisor': 114,
                        'username': 'bill.sun@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': 'eric',
                        'userstatus': 'expired',
                        'id': 1760,
                        'supervisor': 114,
                        'username': 'eric.wang@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/49870724.jpg',
                        'userfullname': '杨光亿',
                        'userstatus': 'registered',
                        'id': 2194,
                        'supervisor': 114,
                        'username': 'ygyhjwy@163.com'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': 'lefi_test001',
                                'userstatus': 'registered',
                                'id': 3755,
                                'supervisor': 2200,
                                'username': 'lefi_test001'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                'userfullname': 'lefi_test002',
                                'userstatus': 'registered',
                                'id': 3756,
                                'supervisor': 2200,
                                'username': 'lefi_test002'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': 'lefi_test003',
                                'userstatus': 'registered',
                                'id': 3757,
                                'supervisor': 2200,
                                'username': 'lefi_test003'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': 'lefi_a_test001',
                                'userstatus': 'registered',
                                'id': 3758,
                                'supervisor': 2200,
                                'username': 'lefi_a_test001'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': 'lefi_a_test002',
                                'userstatus': 'registered',
                                'id': 3759,
                                'supervisor': 2200,
                                'username': 'lefi_a_test002'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                'userfullname': 'A_test111',
                                'userstatus': 'registered',
                                'id': 3760,
                                'supervisor': 2200,
                                'username': 'A_test111'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                'userfullname': 'A_test222',
                                'userstatus': 'registered',
                                'id': 3761,
                                'supervisor': 2200,
                                'username': 'A_test222'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                'userfullname': 'lefi_mytest001',
                                'userstatus': 'registered',
                                'id': 3764,
                                'supervisor': 2200,
                                'username': 'lefi_mytest001'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': 'mytest_11',
                                'userstatus': 'registered',
                                'id': 3773,
                                'supervisor': 2200,
                                'username': 'mytest_11'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': 'myTest_122',
                                'userstatus': 'registered',
                                'id': 3774,
                                'supervisor': 2200,
                                'username': 'myTest_122'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                'userfullname': 'mytest113',
                                'userstatus': 'registered',
                                'id': 3775,
                                'supervisor': 2200,
                                'username': 'mytest113'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                'userfullname': 'myTest114',
                                'userstatus': 'registered',
                                'id': 3776,
                                'supervisor': 2200,
                                'username': 'myTest114'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                'userfullname': 'mytest116',
                                'userstatus': 'registered',
                                'id': 3777,
                                'supervisor': 2200,
                                'username': 'mytest116'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': 'mytest007',
                                'userstatus': 'registered',
                                'id': 3778,
                                'supervisor': 2200,
                                'username': 'mytest007'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': 'lefi',
                        'userstatus': 'registered',
                        'id': 2200,
                        'supervisor': 114,
                        'username': 'lefi.li@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': 'jack',
                        'userstatus': 'expired',
                        'id': 2234,
                        'supervisor': 114,
                        'username': 'jack.jia@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                'userfullname': 'Woody',
                                'userstatus': 'registered',
                                'id': 2656,
                                'supervisor': 2265,
                                'username': '55497569@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                'userfullname': 'rrr',
                                'userstatus': 'registered',
                                'id': 3266,
                                'supervisor': 2265,
                                'username': '13304965@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                'userfullname': 'aigo',
                                'userstatus': 'expired',
                                'id': 3272,
                                'supervisor': 2265,
                                'username': '1627450577@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                'userfullname': 'qazwsx',
                                'userstatus': 'expired',
                                'id': 3280,
                                'supervisor': 2265,
                                'username': '95255214@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': 'weishu',
                                'userstatus': 'expired',
                                'id': 3622,
                                'supervisor': 2265,
                                'username': 'weishu'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': 'Good',
                                'userstatus': 'expired',
                                'id': 3650,
                                'supervisor': 2265,
                                'username': 'good'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': 'projecttes',
                                'userstatus': 'registered',
                                'id': 3749,
                                'supervisor': 2265,
                                'username': 'projecttest_pwdreset@rnbtech.com.hk'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': 'AutoTester',
                        'userstatus': 'registered',
                        'id': 2265,
                        'supervisor': 114,
                        'username': 'projecttest@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': 'hunter',
                        'userstatus': 'expired',
                        'id': 2273,
                        'supervisor': 114,
                        'username': 'hunter.su@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/26063712.jpg',
                        'userfullname': 'vivian',
                        'userstatus': 'registered',
                        'id': 2495,
                        'supervisor': 114,
                        'username': 'vivian.yang@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': 'rain',
                        'userstatus': 'registered',
                        'id': 2522,
                        'supervisor': 114,
                        'username': 'rain.cao@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': 'notice',
                        'userstatus': 'registered',
                        'id': 2625,
                        'supervisor': 114,
                        'username': 'notice@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': 'service',
                        'userstatus': 'registered',
                        'id': 2626,
                        'supervisor': 114,
                        'username': 'service@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '陈大为测试',
                        'userstatus': 'expired',
                        'id': 2670,
                        'supervisor': 114,
                        'username': 'david.chen007@outlook.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '陈孝烽',
                        'userstatus': 'expired',
                        'id': 2693,
                        'supervisor': 114,
                        'username': 'daikon.my@gmail.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '陈孝烽',
                        'userstatus': 'registered',
                        'id': 2745,
                        'supervisor': 114,
                        'username': 'daikon.chen@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': 'abby',
                        'userstatus': 'registered',
                        'id': 3041,
                        'supervisor': 114,
                        'username': 'abby.jiang@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': 'marvin',
                        'userstatus': 'registered',
                        'id': 3042,
                        'supervisor': 114,
                        'username': 'marvin.zhou@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/19720613.jpg',
                                'userfullname': 'Angelia02',
                                'userstatus': 'registered',
                                'id': 1151,
                                'supervisor': 3200,
                                'username': 'angelia.chen@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': 'tony163',
                                'userstatus': 'registered',
                                'id': 3771,
                                'supervisor': 3200,
                                'username': 'tony163'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': 'tonyqq6',
                                'userstatus': 'registered',
                                'id': 3772,
                                'supervisor': 3200,
                                'username': 'tonyqq6'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/18046813.png',
                        'userfullname': 'Tony',
                        'userstatus': 'registered',
                        'id': 3200,
                        'supervisor': 114,
                        'username': 'tony.nie@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': 'julian',
                        'userstatus': 'registered',
                        'id': 3215,
                        'supervisor': 114,
                        'username': 'julian.zhou@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': 'rainf54rg',
                        'userstatus': 'expired',
                        'id': 3277,
                        'supervisor': 114,
                        'username': '343942059@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': 'Ivy.Liu',
                        'userstatus': 'registered',
                        'id': 3598,
                        'supervisor': 114,
                        'username': 'IvyLiu'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/82799259.png',
                        'userfullname': 'Amy',
                        'userstatus': 'registered',
                        'id': 3682,
                        'supervisor': 114,
                        'username': '315028435@qq.com'
                    }
                ],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/20705588.jpg',
                'userfullname': 'golding',
                'userstatus': 'registered',
                'id': 114,
                'supervisor': 1,
                'username': 'golding.gu@rnbtech.com.hk'
            },
            {
                'isManager': 1,
                'sub': [
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '鲁放放',
                        'userstatus': 'expired',
                        'id': 1983,
                        'supervisor': 282,
                        'username': '407671107@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': 'zutai',
                        'userstatus': 'expired',
                        'id': 1984,
                        'supervisor': 282,
                        'username': 'zutai.1@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '杨梦',
                        'userstatus': 'expired',
                        'id': 2076,
                        'supervisor': 282,
                        'username': '952496016@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '黄澈熠',
                        'userstatus': 'expired',
                        'id': 2380,
                        'supervisor': 282,
                        'username': '602459093@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '邓泽霖',
                        'userstatus': 'expired',
                        'id': 2381,
                        'supervisor': 282,
                        'username': '623916078@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': '王昕',
                        'userstatus': 'expired',
                        'id': 2382,
                        'supervisor': 282,
                        'username': '710534945@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': '马晓倩',
                        'userstatus': 'registered',
                        'id': 2605,
                        'supervisor': 282,
                        'username': '18801732774@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '姚婧',
                        'userstatus': 'expired',
                        'id': 2622,
                        'supervisor': 282,
                        'username': '1123994583@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': '陆淑婷',
                        'userstatus': 'expired',
                        'id': 2623,
                        'supervisor': 282,
                        'username': '727685543@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '杨林浇',
                        'userstatus': 'registered',
                        'id': 2624,
                        'supervisor': 282,
                        'username': 'jjyangx@126.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '耿文博',
                        'userstatus': 'registered',
                        'id': 2676,
                        'supervisor': 282,
                        'username': '441321972@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '赵钰婷',
                        'userstatus': 'registered',
                        'id': 2681,
                        'supervisor': 282,
                        'username': '1148309597@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': 'vivi小号',
                        'userstatus': 'registered',
                        'id': 3714,
                        'supervisor': 282,
                        'username': 'vivi2'
                    }
                ],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/16355807.JPG',
                'userfullname': 'vivi',
                'userstatus': 'registered',
                'id': 282,
                'supervisor': 1,
                'username': 'vivi.wang@rnbtech.com.hk'
            },
            {
                'isManager': 1,
                'sub': [
                    {
                        'isManager': 1,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': 'beopch',
                        'userstatus': 'expired',
                        'id': 238,
                        'supervisor': 373,
                        'username': 'beopch@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': 'beopdemoen',
                        'userstatus': 'registered',
                        'id': 239,
                        'supervisor': 373,
                        'username': 'beopdemoen@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': 'GuestLsw',
                        'userstatus': 'registered',
                        'id': 277,
                        'supervisor': 373,
                        'username': 'lsw@gearea.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': 'DemoUser',
                        'userstatus': 'registered',
                        'id': 396,
                        'supervisor': 373,
                        'username': 'beopdemo@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': 'Guest US',
                        'userstatus': 'registered',
                        'id': 399,
                        'supervisor': 373,
                        'username': 'beopUS@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': 'Guest SG',
                        'userstatus': 'registered',
                        'id': 400,
                        'supervisor': 373,
                        'username': 'beopsg@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': 'Guest JP',
                        'userstatus': 'registered',
                        'id': 401,
                        'supervisor': 373,
                        'username': 'beopjp@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': 'Suzuki San',
                        'userstatus': 'expired',
                        'id': 414,
                        'supervisor': 373,
                        'username': 'beopsuzuki@sina.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': 'Toyota San',
                        'userstatus': 'expired',
                        'id': 415,
                        'supervisor': 373,
                        'username': 'beoptoyota@sina.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': 'beopau',
                        'userstatus': 'registered',
                        'id': 454,
                        'supervisor': 373,
                        'username': 'beopau@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': 'beoptw',
                        'userstatus': 'registered',
                        'id': 455,
                        'supervisor': 373,
                        'username': 'beoptw@163.com'
                    }
                ],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                'userfullname': 'GuestManager',
                'userstatus': 'registered',
                'id': 373,
                'supervisor': 1,
                'username': 'beopguest@163.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                'userfullname': '13810091136',
                'userstatus': 'registered',
                'id': 375,
                'supervisor': 1,
                'username': '13810091136@139.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                'userfullname': 'chang',
                'userstatus': 'expired',
                'id': 376,
                'supervisor': 1,
                'username': '174683130@qq.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                'userfullname': 'SFadmin',
                'userstatus': 'registered',
                'id': 388,
                'supervisor': 1,
                'username': 'ELY1004@163.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                'userfullname': '50578069',
                'userstatus': 'apply',
                'id': 389,
                'supervisor': 1,
                'username': '50578069@qq.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                'userfullname': 'shhuaweidemo',
                'userstatus': 'registered',
                'id': 390,
                'supervisor': 1,
                'username': 'shhuaweidemo@163.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                'userfullname': 'poor_ham',
                'userstatus': 'registered',
                'id': 397,
                'supervisor': 1,
                'username': 'poor_ham@hotmail.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                'userfullname': 'RNBMaggie',
                'userstatus': 'registered',
                'id': 410,
                'supervisor': 1,
                'username': 'maggie.zhang@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                'userfullname': '234876317',
                'userstatus': 'registered',
                'id': 412,
                'supervisor': 1,
                'username': '234876317@qq.com'
            },
            {
                'isManager': 1,
                'sub': [
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': 'coco',
                        'userstatus': 'registered',
                        'id': 1331,
                        'supervisor': 448,
                        'username': 'coco.xu@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': 'roy',
                        'userstatus': 'registered',
                        'id': 2058,
                        'supervisor': 448,
                        'username': 'roy.luo@rnbtech.com.hk'
                    }
                ],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                'userfullname': 'tina',
                'userstatus': 'registered',
                'id': 448,
                'supervisor': 1,
                'username': 'tina.tang@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                'userfullname': 'bo',
                'userstatus': 'registered',
                'id': 449,
                'supervisor': 1,
                'username': 'bo.wu@rnbtech.com.hk'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                'userfullname': 'frank',
                'userstatus': 'expired',
                'id': 451,
                'supervisor': 1,
                'username': 'Frank.chan@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                'userfullname': 'zouqing',
                'userstatus': 'expired',
                'id': 457,
                'supervisor': 1,
                'username': 'aresdonga@126.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                'userfullname': 'spring',
                'userstatus': 'registered',
                'id': 458,
                'supervisor': 1,
                'username': 'spring.li@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': 'hhh',
                'userstatus': 'apply',
                'id': 460,
                'supervisor': 1,
                'username': 'hhh@rrr.com'
            },
            {
                'isManager': 1,
                'sub': [
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/17889113.jpg',
                        'userfullname': 'sam',
                        'userstatus': 'registered',
                        'id': 1725,
                        'supervisor': 463,
                        'username': 'sam.lou@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/14407692.jpg',
                        'userfullname': 'Haley、',
                        'userstatus': 'registered',
                        'id': 1755,
                        'supervisor': 463,
                        'username': 'haley.yang@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': 'hobit',
                        'userstatus': 'registered',
                        'id': 1756,
                        'supervisor': 463,
                        'username': 'hobit.lai@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': 'michael',
                        'userstatus': 'registered',
                        'id': 2595,
                        'supervisor': 463,
                        'username': 'michael.zhang@rnbtech.com.hk'
                    }
                ],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                'userfullname': 'wayne',
                'userstatus': 'registered',
                'id': 463,
                'supervisor': 1,
                'username': 'wayne.ma@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                'userfullname': 'hzj',
                'userstatus': 'invited',
                'id': 467,
                'supervisor': 1,
                'username': 'hezhengjun@aliyun.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com',
                'userfullname': '',
                'userstatus': '',
                'id': 999,
                'supervisor': 1,
                'username': 'abcd'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                'userfullname': 'Powerlink',
                'userstatus': 'registered',
                'id': 1018,
                'supervisor': 1,
                'username': 'powerlinkplatform@tom.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                'userfullname': 'fei',
                'userstatus': 'registered',
                'id': 1063,
                'supervisor': 1,
                'username': 'fei.wang@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/29472854.jpeg',
                'userfullname': 'young',
                'userstatus': 'registered',
                'id': 1239,
                'supervisor': 1,
                'username': 'young.liu@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                'userfullname': 'tai',
                'userstatus': 'expired',
                'id': 1318,
                'supervisor': 1,
                'username': 'tai.zhang@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/10947712.jpg',
                'userfullname': 'sunny',
                'userstatus': 'registered',
                'id': 1332,
                'supervisor': 1,
                'username': 'sunny.hu@rnbtech.com.hk'
            },
            {
                'isManager': 1,
                'sub': [
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': 'sally',
                        'userstatus': 'registered',
                        'id': 1333,
                        'supervisor': 1334,
                        'username': 'sally.gu@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': 'dolorse',
                        'userstatus': 'registered',
                        'id': 1832,
                        'supervisor': 1334,
                        'username': 'dolorse.yang@rnbtech.com.hk'
                    }
                ],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                'userfullname': 'chery',
                'userstatus': 'registered',
                'id': 1334,
                'supervisor': 1,
                'username': 'cherry.chen@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                'userfullname': 'hardy',
                'userstatus': 'registered',
                'id': 1402,
                'supervisor': 1,
                'username': 'hardy.zhu@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                'userfullname': 'woody小号',
                'userstatus': 'registered',
                'id': 1417,
                'supervisor': 1,
                'username': '1330235169@qq.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                'userfullname': 'host',
                'userstatus': 'registered',
                'id': 1430,
                'supervisor': 1,
                'username': '17608220@qq.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                'userfullname': 'display',
                'userstatus': 'registered',
                'id': 1439,
                'supervisor': 1,
                'username': '841820707@qq.com'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '项目管理020',
                'userstatus': 'registered',
                'id': 1458,
                'supervisor': 1,
                'username': '项目管理'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '项目管理021',
                'userstatus': 'registered',
                'id': 1459,
                'supervisor': 1,
                'username': '项目管理'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '项目管理022',
                'userstatus': 'registered',
                'id': 1460,
                'supervisor': 1,
                'username': '项目管理'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '项目管理023',
                'userstatus': 'registered',
                'id': 1461,
                'supervisor': 1,
                'username': '项目管理'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '项目管理024',
                'userstatus': 'registered',
                'id': 1462,
                'supervisor': 1,
                'username': '项目管理'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '项目管理025',
                'userstatus': 'registered',
                'id': 1463,
                'supervisor': 1,
                'username': '项目管理'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '项目管理027',
                'userstatus': 'expired',
                'id': 1465,
                'supervisor': 1,
                'username': '项目管理'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '项目管理029',
                'userstatus': 'registered',
                'id': 1467,
                'supervisor': 1,
                'username': '项目管理'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '项目管理030',
                'userstatus': 'expired',
                'id': 1468,
                'supervisor': 1,
                'username': '项目管理'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 1720,
                'supervisor': 1,
                'username': '18516703935'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                'userfullname': '583654289',
                'userstatus': 'expired',
                'id': 1750,
                'supervisor': 1,
                'username': '583654289@qq.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                'userfullname': 'Eric',
                'userstatus': 'registered',
                'id': 1758,
                'supervisor': 1,
                'username': 'eric.chang@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/14634333.jpeg',
                'userfullname': 'viper',
                'userstatus': 'registered',
                'id': 1759,
                'supervisor': 1,
                'username': 'viper.li@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 1840,
                'supervisor': 1,
                'username': '13916025504'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                'userfullname': '大客户经理演示账号',
                'userstatus': 'registered',
                'id': 1890,
                'supervisor': 1,
                'username': '13764669848@163.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 1947,
                'supervisor': 1,
                'username': '15000489426'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 1953,
                'supervisor': 1,
                'username': '18516600716'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 1970,
                'supervisor': 1,
                'username': '15121038467'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 1991,
                'supervisor': 1,
                'username': '18916409043'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2024,
                'supervisor': 1,
                'username': '18605799944'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                'userfullname': 'sam',
                'userstatus': 'registered',
                'id': 2029,
                'supervisor': 1,
                'username': 'sam.cheung@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2123,
                'supervisor': 1,
                'username': '15858604023'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2195,
                'supervisor': 1,
                'username': '18658376677'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2235,
                'supervisor': 1,
                'username': '18601679872'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/2240_465420.jpg',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2240,
                'supervisor': 1,
                'username': '15921360369'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2241,
                'supervisor': 1,
                'username': '13816368457'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2287,
                'supervisor': 1,
                'username': '14714423846'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2309,
                'supervisor': 1,
                'username': '18698188176'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2359,
                'supervisor': 1,
                'username': '13501989945'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2433,
                'supervisor': 1,
                'username': '13916955112'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2459,
                'supervisor': 1,
                'username': '13570835435'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                'userfullname': 'mi',
                'userstatus': 'registered',
                'id': 2540,
                'supervisor': 1,
                'username': 'milicic@126.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2590,
                'supervisor': 1,
                'username': '13922455398'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2642,
                'supervisor': 1,
                'username': '15858281061'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2682,
                'supervisor': 1,
                'username': '18918326049'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2683,
                'supervisor': 1,
                'username': '13314205161'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2684,
                'supervisor': 1,
                'username': '15895360096'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2685,
                'supervisor': 1,
                'username': '18118158863'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                'userfullname': 'stephen',
                'userstatus': 'registered',
                'id': 2690,
                'supervisor': 1,
                'username': 'stephen.yip@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                'userfullname': 'beop.cloud',
                'userstatus': 'invited',
                'id': 2740,
                'supervisor': 1,
                'username': 'beop.cloud@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2741,
                'supervisor': 1,
                'username': 'aa@3423.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2743,
                'supervisor': 1,
                'username': 'rewrew@qq.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2746,
                'supervisor': 1,
                'username': '18202118925'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                'userfullname': 'quanshang1234@qq.com',
                'userstatus': 'registered',
                'id': 2756,
                'supervisor': 1,
                'username': 'quanshang1234@qq.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 2850,
                'supervisor': 1,
                'username': '13764669848'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3052,
                'supervisor': 1,
                'username': '15954831917'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3183,
                'supervisor': 1,
                'username': '18321264705'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3184,
                'supervisor': 1,
                'username': '13584812056'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3213,
                'supervisor': 1,
                'username': '13041883712'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3223,
                'supervisor': 1,
                'username': '18271454397'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3224,
                'supervisor': 1,
                'username': '18682173933'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/26255768.jpg',
                'userfullname': '毛先生',
                'userstatus': 'registered',
                'id': 3225,
                'supervisor': 1,
                'username': '106415537@qq.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                'userfullname': 'qczndv91236@chacuo.net',
                'userstatus': 'registered',
                'id': 3227,
                'supervisor': 1,
                'username': 'qczndv91236@chacuo.net'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                'userfullname': None,
                'userstatus': 'registered',
                'id': 3228,
                'supervisor': 1,
                'username': None
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '13916866457',
                'userstatus': 'registered',
                'id': 3238,
                'supervisor': 1,
                'username': '13916866457'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                'userfullname': '13801601024',
                'userstatus': 'registered',
                'id': 3240,
                'supervisor': 1,
                'username': '13801601024'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                'userfullname': 'rush.pu',
                'userstatus': 'registered',
                'id': 3241,
                'supervisor': 1,
                'username': 'rush.pu@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                'userfullname': '13918650775',
                'userstatus': 'registered',
                'id': 3243,
                'supervisor': 1,
                'username': '13918650775'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                'userfullname': '赵晓磊（3）',
                'userstatus': 'registered',
                'id': 3244,
                'supervisor': 1,
                'username': '649510495@qq.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                'userfullname': '赵晓磊（5）',
                'userstatus': 'invited',
                'id': 3245,
                'supervisor': 1,
                'username': 'ahwhzxl@163.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                'userfullname': 'wki',
                'userstatus': 'invited',
                'id': 3246,
                'supervisor': 1,
                'username': 'wkizpv12389@chacuo.net'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                'userfullname': 'ewzalr06853@chacuo.net',
                'userstatus': 'registered',
                'id': 3247,
                'supervisor': 1,
                'username': 'ewzalr06853@chacuo.net'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                'userfullname': 'vwldzy65720@chacuo.net',
                'userstatus': 'registered',
                'id': 3248,
                'supervisor': 1,
                'username': 'vwldzy65720@chacuo.net'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                'userfullname': 'zuphda94105@chacuo.net',
                'userstatus': 'registered',
                'id': 3251,
                'supervisor': 1,
                'username': 'zuphda94105@chacuo.net'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                'userfullname': 'cwuxqf61579@chacuo.net',
                'userstatus': 'registered',
                'id': 3252,
                'supervisor': 1,
                'username': 'cwuxqf61579@chacuo.net'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                'userfullname': 'nvkmle54038@chacuo.net',
                'userstatus': 'registered',
                'id': 3255,
                'supervisor': 1,
                'username': 'nvkmle54038@chacuo.net'
            },
            {
                'isManager': 1,
                'sub': [
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': 'mike',
                                'userstatus': 'expired',
                                'id': 383,
                                'supervisor': 80,
                                'username': 'mike.quan@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                'userfullname': 'Laurance',
                                'userstatus': 'registered',
                                'id': 2020,
                                'supervisor': 80,
                                'username': 'Laurance.Siew@goodman.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                'userfullname': 'Ricky',
                                'userstatus': 'registered',
                                'id': 2021,
                                'supervisor': 80,
                                'username': 'Ricky.Chan@goodman.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                'userfullname': ' xiaoguang.c',
                                'userstatus': 'registered',
                                'id': 2232,
                                'supervisor': 80,
                                'username': 'xiaoguang.cui@aramark.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                'userfullname': '279727754',
                                'userstatus': 'registered',
                                'id': 2233,
                                'supervisor': 80,
                                'username': '279727754@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                'userfullname': 'BAZ',
                                'userstatus': 'expired',
                                'id': 2252,
                                'supervisor': 80,
                                'username': 'bavis_z@hotmail.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                'userfullname': 'Colin Hong',
                                'userstatus': 'expired',
                                'id': 2257,
                                'supervisor': 80,
                                'username': 'Colin.KN.Hong@linkreit.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                'userfullname': 'Vincent Ng',
                                'userstatus': 'registered',
                                'id': 2258,
                                'supervisor': 80,
                                'username': 'Vincent.KC.Ng@linkreit.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': 'Keith Chan',
                                'userstatus': 'expired',
                                'id': 2259,
                                'supervisor': 80,
                                'username': 'Keith.km.chan@linkreit.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                'userfullname': 'Thomas Li',
                                'userstatus': 'registered',
                                'id': 2260,
                                'supervisor': 80,
                                'username': 'Thomas.YS.Li@linkreit.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                'userfullname': 'Li.jiang',
                                'userstatus': 'registered',
                                'id': 2695,
                                'supervisor': 80,
                                'username': 'jiangli@cod-macau.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': 'lawrencelei',
                                'userstatus': 'registered',
                                'id': 2696,
                                'supervisor': 80,
                                'username': 'lawrencelei@cod-macau.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                'userfullname': 'test',
                                'userstatus': 'registered',
                                'id': 2697,
                                'supervisor': 80,
                                'username': '4439928@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                'userfullname': 'lawrencelei',
                                'userstatus': 'registered',
                                'id': 2799,
                                'supervisor': 80,
                                'username': 'lawrencelei@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': 'Christ.K.Lai',
                                'userstatus': 'registered',
                                'id': 3048,
                                'supervisor': 80,
                                'username': 'Christ.kw.lai@linkreit.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                'userfullname': 'Fenix.To',
                                'userstatus': 'registered',
                                'id': 3049,
                                'supervisor': 80,
                                'username': 'Fenix.yk.to@linkreit.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                'userfullname': 'Jeff.C.Liu',
                                'userstatus': 'invited',
                                'id': 3050,
                                'supervisor': 80,
                                'username': 'Jeffery.cf.liu@linkreit.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                'userfullname': 'Cat.Wong',
                                'userstatus': 'invited',
                                'id': 3279,
                                'supervisor': 80,
                                'username': 'Cat.wang@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                'userfullname': 'Alex.Lio',
                                'userstatus': 'registered',
                                'id': 3281,
                                'supervisor': 80,
                                'username': 'Alexlio@Cod-Macau.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                'userfullname': 'BenLeong',
                                'userstatus': 'registered',
                                'id': 3282,
                                'supervisor': 80,
                                'username': 'BenLeong@Cod-Macau.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                'userfullname': 'MC',
                                'userstatus': 'registered',
                                'id': 3291,
                                'supervisor': 80,
                                'username': 'Mctang@cod-macau.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': 'kamyu.wong',
                                'userstatus': 'registered',
                                'id': 3301,
                                'supervisor': 80,
                                'username': 'kamyu.wong@goodman.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                'userfullname': 'jf8j45ijj',
                                'userstatus': 'registered',
                                'id': 3461,
                                'supervisor': 80,
                                'username': 'fh8349jid98'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': 'j4f930fjrkoejk0o',
                                'userstatus': 'registered',
                                'id': 3471,
                                'supervisor': 80,
                                'username': 'hjfk8349jtri'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': 'hf4895jrtoe',
                                'userstatus': 'registered',
                                'id': 3481,
                                'supervisor': 80,
                                'username': 'jhfi3984jr'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                'userfullname': 'hf8549jrte',
                                'userstatus': 'registered',
                                'id': 3491,
                                'supervisor': 80,
                                'username': 'hf3948fjert98'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                'userfullname': 'djf945tfodrt9',
                                'userstatus': 'registered',
                                'id': 3593,
                                'supervisor': 80,
                                'username': 'dfj94jfjff4'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                'userfullname': 'djf4rfef0',
                                'userstatus': 'registered',
                                'id': 3594,
                                'supervisor': 80,
                                'username': 'dfj904rjfop40'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                'userfullname': 'djf945tfodrt9',
                                'userstatus': 'registered',
                                'id': 3595,
                                'supervisor': 80,
                                'username': 'djsf9ijrfj9fr'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                'userfullname': 'jsdfi0eroi',
                                'userstatus': 'registered',
                                'id': 3596,
                                'supervisor': 80,
                                'username': 'sjdf0erjk0fojk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                'userfullname': 'syfu8943yu',
                                'userstatus': 'registered',
                                'id': 3610,
                                'supervisor': 80,
                                'username': 'rh8349ruj'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': 'ehjrf89r43uhjtr',
                                'userstatus': 'registered',
                                'id': 3612,
                                'supervisor': 80,
                                'username': 'h84903tjfreio'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                'userfullname': 'kenlam@clp.com.hk',
                                'userstatus': 'registered',
                                'id': 3614,
                                'supervisor': 80,
                                'username': 'kenlam@clp.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                'userfullname': 'bmak@clp.com.hk',
                                'userstatus': 'registered',
                                'id': 3615,
                                'supervisor': 80,
                                'username': 'bmak@clp.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                'userfullname': 'Max.Wong',
                                'userstatus': 'registered',
                                'id': 3651,
                                'supervisor': 80,
                                'username': 'max.hk.wong@linkreit.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                'userfullname': 'Ben Wong',
                                'userstatus': 'registered',
                                'id': 3748,
                                'supervisor': 80,
                                'username': 'Ben Wong'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': 'BeiruoZhu',
                        'userstatus': 'registered',
                        'id': 80,
                        'supervisor': 3283,
                        'username': 'beiruo.zhu@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [
                                            {
                                                'isManager': 1,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/17346938.jpg',
                                                'userfullname': '王力',
                                                'userstatus': 'expired',
                                                'id': 374,
                                                'supervisor': 1131,
                                                'username': 'quanshang123@qq.com'
                                            },
                                            {
                                                'isManager': 1,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                                'userfullname': '张强',
                                                'userstatus': 'invited',
                                                'id': 384,
                                                'supervisor': 1131,
                                                'username': 'test@liqian.com'
                                            }
                                        ],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                        'userfullname': 'mojiawu',
                                        'userstatus': 'registered',
                                        'id': 1131,
                                        'supervisor': 139,
                                        'username': 'mojiawu@foxmail.com'
                                    },
                                    {
                                        'isManager': 1,
                                        'sub': [
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                                'userfullname': '伍为民',
                                                'userstatus': 'expired',
                                                'id': 3292,
                                                'supervisor': 1449,
                                                'username': 'Wu.weimin@capitaland.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                                'userfullname': 'gagamok@163.com',
                                                'userstatus': 'expired',
                                                'id': 3501,
                                                'supervisor': 1449,
                                                'username': 'gagamok'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                                'userfullname': '就发ij简单43jk',
                                                'userstatus': 'registered',
                                                'id': 3719,
                                                'supervisor': 1449,
                                                'username': 'jf940jk90k409'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                                'userfullname': 'nichengjfd0e9',
                                                'userstatus': 'registered',
                                                'id': 3737,
                                                'supervisor': 1449,
                                                'username': 'denglmigfjri'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                                'userfullname': 'nichengfj9fu90e',
                                                'userstatus': 'registered',
                                                'id': 3738,
                                                'supervisor': 1449,
                                                'username': 'dneglijf8ej'
                                            }
                                        ],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                        'userfullname': '项目管理010',
                                        'userstatus': 'registered',
                                        'id': 1449,
                                        'supervisor': 139,
                                        'username': '项目管理'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                        'userfullname': '能耗BMS',
                                        'userstatus': 'registered',
                                        'id': 2324,
                                        'supervisor': 139,
                                        'username': '3195944715@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                        'userfullname': '邹湘峰',
                                        'userstatus': 'registered',
                                        'id': 2564,
                                        'supervisor': 139,
                                        'username': 'sz@basepoint.net.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                        'userfullname': 'gagamok@163.com',
                                        'userstatus': 'registered',
                                        'id': 3511,
                                        'supervisor': 139,
                                        'username': 'gagamok1'
                                    },
                                    {
                                        'isManager': 1,
                                        'sub': [
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                                'userfullname': '试卷分析034',
                                                'userstatus': 'registered',
                                                'id': 3718,
                                                'supervisor': 3617,
                                                'username': 'jf9034jf3ef'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                                'userfullname': 'fh94ehjr09j',
                                                'userstatus': 'registered',
                                                'id': 3720,
                                                'supervisor': 3617,
                                                'username': 'jf4903rujwo'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                                'userfullname': 'fhjt9845jtoiej',
                                                'userstatus': 'registered',
                                                'id': 3721,
                                                'supervisor': 3617,
                                                'username': 'J9450JTOPWE4'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                                'userfullname': 'jf4903jtrfoew',
                                                'userstatus': 'registered',
                                                'id': 3722,
                                                'supervisor': 3617,
                                                'username': 'fj9rf0j4rof0owe9kj'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                                'userfullname': 'frejk94kolerkjop',
                                                'userstatus': 'registered',
                                                'id': 3734,
                                                'supervisor': 3617,
                                                'username': 'j490rjkfe'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                                'userfullname': 'nichenge9ri9034iro',
                                                'userstatus': 'registered',
                                                'id': 3735,
                                                'supervisor': 3617,
                                                'username': 'denglifj9j490'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                                'userfullname': 'nichengjfgi',
                                                'userstatus': 'registered',
                                                'id': 3736,
                                                'supervisor': 3617,
                                                'username': 'denglunfije09'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                                'userfullname': 'nichengre9tiu90',
                                                'userstatus': 'registered',
                                                'id': 3739,
                                                'supervisor': 3617,
                                                'username': 'denglije9'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                                'userfullname': 'nichengj90i',
                                                'userstatus': 'registered',
                                                'id': 3740,
                                                'supervisor': 3617,
                                                'username': 'denengj'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                                'userfullname': 'hf8ijdsji0',
                                                'userstatus': 'registered',
                                                'id': 3741,
                                                'supervisor': 3617,
                                                'username': 'je09tk'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                                'userfullname': 'nichengjf9oe',
                                                'userstatus': 'registered',
                                                'id': 3742,
                                                'supervisor': 3617,
                                                'username': 'denglinmk'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                                'userfullname': 'sifj904e',
                                                'userstatus': 'registered',
                                                'id': 3745,
                                                'supervisor': 3617,
                                                'username': 'fj9ejrkfo'
                                            }
                                        ],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                        'userfullname': '343942059@com.com',
                                        'userstatus': 'registered',
                                        'id': 3617,
                                        'supervisor': 139,
                                        'username': '343942059小号'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                        'userfullname': 'FU.XiuZhang@capitaland.com',
                                        'userstatus': 'expired',
                                        'id': 3618,
                                        'supervisor': 139,
                                        'username': 'FU.XiuZhang'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                        'userfullname': 'ZHENG.Yi@capitaland.com',
                                        'userstatus': 'expired',
                                        'id': 3619,
                                        'supervisor': 139,
                                        'username': 'ZHENG.Yi'
                                    },
                                    {
                                        'isManager': 1,
                                        'sub': [
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                                'userfullname': '凯德01',
                                                'userstatus': 'registered',
                                                'id': 3189,
                                                'supervisor': 3666,
                                                'username': 'kd01@rnbtech.com.hk'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                                'userfullname': '凯德02',
                                                'userstatus': 'registered',
                                                'id': 3190,
                                                'supervisor': 3666,
                                                'username': 'kd02@rnbtech.com.hk'
                                            },
                                            {
                                                'isManager': 1,
                                                'sub': [
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                                        'userfullname': '阮逸群',
                                                        'userstatus': 'registered',
                                                        'id': 3293,
                                                        'supervisor': 3299,
                                                        'username': 'Ruan.yiqun@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                                        'userfullname': '蒋健嵘',
                                                        'userstatus': 'registered',
                                                        'id': 3294,
                                                        'supervisor': 3299,
                                                        'username': 'Jiang.jianrong@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                                        'userfullname': '严国昌',
                                                        'userstatus': 'registered',
                                                        'id': 3295,
                                                        'supervisor': 3299,
                                                        'username': 'Yan.guochang@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                                        'userfullname': '陈永林',
                                                        'userstatus': 'registered',
                                                        'id': 3296,
                                                        'supervisor': 3299,
                                                        'username': 'Chen.yonglin@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                                        'userfullname': 'Wang Xiaobo',
                                                        'userstatus': 'registered',
                                                        'id': 3297,
                                                        'supervisor': 3299,
                                                        'username': 'Wang.xiaobo@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                                        'userfullname': 'Jo Chan',
                                                        'userstatus': 'registered',
                                                        'id': 3298,
                                                        'supervisor': 3299,
                                                        'username': 'Jo.chan@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                                        'userfullname': '郭海',
                                                        'userstatus': 'registered',
                                                        'id': 3303,
                                                        'supervisor': 3299,
                                                        'username': 'Guo.hai@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                                        'userfullname': 'su.teng',
                                                        'userstatus': 'registered',
                                                        'id': 3521,
                                                        'supervisor': 3299,
                                                        'username': 'su.teng@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                                        'userfullname': 'tian.guangqiang',
                                                        'userstatus': 'registered',
                                                        'id': 3531,
                                                        'supervisor': 3299,
                                                        'username': 'tian.guangqiang@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                                        'userfullname': 'yang.jianping',
                                                        'userstatus': 'registered',
                                                        'id': 3551,
                                                        'supervisor': 3299,
                                                        'username': 'yang.jianping@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                                        'userfullname': 'sun.quan',
                                                        'userstatus': 'registered',
                                                        'id': 3561,
                                                        'supervisor': 3299,
                                                        'username': 'sun.quan@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                                        'userfullname': 'FU.XiuZhang',
                                                        'userstatus': 'registered',
                                                        'id': 3620,
                                                        'supervisor': 3299,
                                                        'username': 'FU.XiuZhang@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                                        'userfullname': 'ZHENG.Yi',
                                                        'userstatus': 'registered',
                                                        'id': 3621,
                                                        'supervisor': 3299,
                                                        'username': 'ZHENG.Yi@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                                        'userfullname': '黄伟',
                                                        'userstatus': 'registered',
                                                        'id': 3667,
                                                        'supervisor': 3299,
                                                        'username': 'HUANG.Wei4@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                                        'userfullname': '杨雪涛',
                                                        'userstatus': 'registered',
                                                        'id': 3668,
                                                        'supervisor': 3299,
                                                        'username': 'yang.xuetao@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                                        'userfullname': '袁方',
                                                        'userstatus': 'registered',
                                                        'id': 3669,
                                                        'supervisor': 3299,
                                                        'username': 'yuan.fang@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                                        'userfullname': '汪先华',
                                                        'userstatus': 'registered',
                                                        'id': 3670,
                                                        'supervisor': 3299,
                                                        'username': 'Anson.Wang@cbre.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                                        'userfullname': '黄岩',
                                                        'userstatus': 'registered',
                                                        'id': 3671,
                                                        'supervisor': 3299,
                                                        'username': 'HUANG.Yan2@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                                        'userfullname': '陈静芬',
                                                        'userstatus': 'registered',
                                                        'id': 3672,
                                                        'supervisor': 3299,
                                                        'username': 'TAN.Deborah@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                                        'userfullname': '胡茂华',
                                                        'userstatus': 'registered',
                                                        'id': 3674,
                                                        'supervisor': 3299,
                                                        'username': 'hu.maohua@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                                        'userfullname': '李永铭',
                                                        'userstatus': 'registered',
                                                        'id': 3675,
                                                        'supervisor': 3299,
                                                        'username': 'Li.YongMing@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                                        'userfullname': '陆宏光',
                                                        'userstatus': 'registered',
                                                        'id': 3676,
                                                        'supervisor': 3299,
                                                        'username': 'LU.HongGuang@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                                        'userfullname': '王强',
                                                        'userstatus': 'registered',
                                                        'id': 3677,
                                                        'supervisor': 3299,
                                                        'username': 'wang.qiang11@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                                        'userfullname': '周勇',
                                                        'userstatus': 'registered',
                                                        'id': 3678,
                                                        'supervisor': 3299,
                                                        'username': 'ZHOU.Yong@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                                        'userfullname': '刘敏敏',
                                                        'userstatus': 'registered',
                                                        'id': 3679,
                                                        'supervisor': 3299,
                                                        'username': 'Liu.minmin@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                                        'userfullname': '余浩',
                                                        'userstatus': 'registered',
                                                        'id': 3680,
                                                        'supervisor': 3299,
                                                        'username': 'yu.hao1@capitaland.com'
                                                    },
                                                    {
                                                        'isManager': 0,
                                                        'sub': [],
                                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                                        'userfullname': '米建春',
                                                        'userstatus': 'registered',
                                                        'id': 3681,
                                                        'supervisor': 3299,
                                                        'username': 'mi.jianchun@capitaland.com'
                                                    }
                                                ],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                                'userfullname': '蔡孝栋',
                                                'userstatus': 'registered',
                                                'id': 3299,
                                                'supervisor': 3666,
                                                'username': 'CAI.XiaoDong@capitaland.com'
                                            },
                                            {
                                                'isManager': 1,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                                'userfullname': '演示专用',
                                                'userstatus': 'registered',
                                                'id': 3654,
                                                'supervisor': 3666,
                                                'username': 'kd01@capitaland.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                                'userfullname': 'he48irj3i0',
                                                'userstatus': 'registered',
                                                'id': 3723,
                                                'supervisor': 3666,
                                                'username': 'jf94083jto9e'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                                'userfullname': 'nichengj',
                                                'userstatus': 'registered',
                                                'id': 3743,
                                                'supervisor': 3666,
                                                'username': 'dengljinifj'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                                'userfullname': 'nichengjrgoi1d',
                                                'userstatus': 'registered',
                                                'id': 3744,
                                                'supervisor': 3666,
                                                'username': 'dneglrkgoiu9'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                                'userfullname': 'nichengjfe90ruf9',
                                                'userstatus': 'registered',
                                                'id': 3746,
                                                'supervisor': 3666,
                                                'username': 'denglkrgf9u9'
                                            }
                                        ],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                        'userfullname': '凯德管理员',
                                        'userstatus': 'registered',
                                        'id': 3666,
                                        'supervisor': 139,
                                        'username': 'admin@capitaland.com'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/20866867.jpg',
                                'userfullname': 'irwin',
                                'userstatus': 'registered',
                                'id': 139,
                                'supervisor': 83,
                                'username': 'irwin.mo@rnbtech.com.hk'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': 'sean.zhang',
                                'userstatus': 'expired',
                                'id': 205,
                                'supervisor': 83,
                                'username': 'sean.zhang@rnbtech.com.hk'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/38842513.jpg',
                                'userfullname': 'kim.wu',
                                'userstatus': 'expired',
                                'id': 217,
                                'supervisor': 83,
                                'username': 'kim.wu@rnbtech.com.hk'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/86076057.jpg',
                                'userfullname': 'jessie',
                                'userstatus': 'expired',
                                'id': 364,
                                'supervisor': 83,
                                'username': 'jessie.zhou@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': 'bowei',
                                'userstatus': 'registered',
                                'id': 369,
                                'supervisor': 83,
                                'username': 'bowei.zhang@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                'userfullname': 'yiping',
                                'userstatus': 'expired',
                                'id': 1411,
                                'supervisor': 83,
                                'username': '1169718155@qq.com'
                            },
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                        'userfullname': 'Wissam',
                                        'userstatus': 'registered',
                                        'id': 2397,
                                        'supervisor': 1442,
                                        'username': 'w.salama@preciseair.com.au'
                                    },
                                    {
                                        'isManager': 1,
                                        'sub': [
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                                'userfullname': 'andrew.d',
                                                'userstatus': 'registered',
                                                'id': 3206,
                                                'supervisor': 2398,
                                                'username': 'andrew.dentonburke@ap.jll.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                                'userfullname': 'nick.jones',
                                                'userstatus': 'registered',
                                                'id': 3211,
                                                'supervisor': 2398,
                                                'username': 'nick.jones@unsw.edu.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                                'userfullname': 'James Minaha',
                                                'userstatus': 'invited',
                                                'id': 3216,
                                                'supervisor': 2398,
                                                'username': 'jminahan@marprop.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                                'userfullname': 'Jason Min',
                                                'userstatus': 'registered',
                                                'id': 3217,
                                                'supervisor': 2398,
                                                'username': 'Jason.Min@cbre.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                                'userfullname': 'Mark Peek',
                                                'userstatus': 'registered',
                                                'id': 3218,
                                                'supervisor': 2398,
                                                'username': 'Mark.Peek@cbre.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                                'userfullname': 'Bence Balazs',
                                                'userstatus': 'registered',
                                                'id': 3219,
                                                'supervisor': 2398,
                                                'username': 'benceb@marprop.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                                'userfullname': 'bak.greg.herbst',
                                                'userstatus': 'registered',
                                                'id': 3221,
                                                'supervisor': 2398,
                                                'username': 'bak.greg.herbst@lendlease.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                                'userfullname': 'andrew',
                                                'userstatus': 'registered',
                                                'id': 3222,
                                                'supervisor': 2398,
                                                'username': 'andrew@impact-group.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                                'userfullname': 'virginie.s',
                                                'userstatus': 'registered',
                                                'id': 3267,
                                                'supervisor': 2398,
                                                'username': 'virginie.sandilya@cefc.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                                'userfullname': 'Sebastian.L',
                                                'userstatus': 'invited',
                                                'id': 3268,
                                                'supervisor': 2398,
                                                'username': 'Sebastian.Loewensteijn@cefc.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                                'userfullname': 'iain.wood',
                                                'userstatus': 'invited',
                                                'id': 3269,
                                                'supervisor': 2398,
                                                'username': 'iain.wood@cefc.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                                'userfullname': 'Luke Brown',
                                                'userstatus': 'registered',
                                                'id': 3285,
                                                'supervisor': 2398,
                                                'username': 'Luke.Brown@colliers.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                                'userfullname': 'QIC',
                                                'userstatus': 'invited',
                                                'id': 3287,
                                                'supervisor': 2398,
                                                'username': 'A.Dalzell@qic.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                                'userfullname': 'Paul Myors',
                                                'userstatus': 'registered',
                                                'id': 3341,
                                                'supervisor': 2398,
                                                'username': 'paul.myors@emsenergysavings.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                                'userfullname': 'itechdemo',
                                                'userstatus': 'registered',
                                                'id': 3571,
                                                'supervisor': 2398,
                                                'username': 'Brisull Industries'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                                'userfullname': 'itechdemo',
                                                'userstatus': 'registered',
                                                'id': 3572,
                                                'supervisor': 2398,
                                                'username': 'Brisull'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                                'userfullname': 'Guy Goodwin',
                                                'userstatus': 'registered',
                                                'id': 3637,
                                                'supervisor': 2398,
                                                'username': 'Guy.Goodwin@centuria.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                                'userfullname': 'Grant McFarlane',
                                                'userstatus': 'registered',
                                                'id': 3638,
                                                'supervisor': 2398,
                                                'username': 'Grant.McFarlane@centuria.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                                'userfullname': 'Lend Lease',
                                                'userstatus': 'registered',
                                                'id': 3643,
                                                'supervisor': 2398,
                                                'username': 'jamie.oreilly@ap.jll.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                                'userfullname': 'Nick Mavropsi Knight Frank',
                                                'userstatus': 'registered',
                                                'id': 3658,
                                                'supervisor': 2398,
                                                'username': 'Nick.Mavropsi@au.knightfrank.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                                'userfullname': 'Kori Chan',
                                                'userstatus': 'registered',
                                                'id': 3673,
                                                'supervisor': 2398,
                                                'username': 'kori@twm.com.pg'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                                'userfullname': 'Scott Simm',
                                                'userstatus': 'registered',
                                                'id': 3687,
                                                'supervisor': 2398,
                                                'username': 'scott.simm@canberraaircon.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                                'userfullname': 'Sean Martin',
                                                'userstatus': 'registered',
                                                'id': 3717,
                                                'supervisor': 2398,
                                                'username': 's.martin@ccsgroup.net.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                                'userfullname': 'Dave McLauchlan',
                                                'userstatus': 'registered',
                                                'id': 3789,
                                                'supervisor': 2398,
                                                'username': 'dave@buddy.com'
                                            }
                                        ],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                        'userfullname': 'David',
                                        'userstatus': 'registered',
                                        'id': 2398,
                                        'supervisor': 1442,
                                        'username': 'david@industry-tech.com.au'
                                    },
                                    {
                                        'isManager': 1,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                        'userfullname': 'supporter',
                                        'userstatus': 'registered',
                                        'id': 2399,
                                        'supervisor': 1442,
                                        'username': 'myp318@126.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                        'userfullname': 'Ravi',
                                        'userstatus': 'expired',
                                        'id': 2647,
                                        'supervisor': 1442,
                                        'username': 'Ravi.Bhattaram@cbre.co.in'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                        'userfullname': 'Geoff Adams',
                                        'userstatus': 'registered',
                                        'id': 2672,
                                        'supervisor': 1442,
                                        'username': 'AdamsG@ramsayhealth.com.au'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                        'userfullname': 'Peter.H',
                                        'userstatus': 'expired',
                                        'id': 2718,
                                        'supervisor': 1442,
                                        'username': 'peter.hilderson@ap.jll.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                        'userfullname': '周俊豪',
                                        'userstatus': 'registered',
                                        'id': 3043,
                                        'supervisor': 1442,
                                        'username': '751661626@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': 'xdds',
                                        'userstatus': 'expired',
                                        'id': 3044,
                                        'supervisor': 1442,
                                        'username': 'modernhallclient@163.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': 'xd@xd.com',
                                        'userstatus': 'expired',
                                        'id': 3045,
                                        'supervisor': 1442,
                                        'username': 'xd@xd.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                        'userfullname': '8@8.com',
                                        'userstatus': 'expired',
                                        'id': 3046,
                                        'supervisor': 1442,
                                        'username': '8@8.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                        'userfullname': 'xdds',
                                        'userstatus': 'registered',
                                        'id': 3047,
                                        'supervisor': 1442,
                                        'username': 'szxdds@163.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                        'userfullname': 'Greg Herbst',
                                        'userstatus': 'registered',
                                        'id': 3226,
                                        'supervisor': 1442,
                                        'username': 'Greg.Herbst@lendlease.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                        'userfullname': 'Mark Peek',
                                        'userstatus': 'registered',
                                        'id': 3599,
                                        'supervisor': 1442,
                                        'username': 'Mark'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                        'userfullname': 'Account Test1',
                                        'userstatus': 'expired',
                                        'id': 3636,
                                        'supervisor': 1442,
                                        'username': '15216702492@163.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                        'userfullname': 'Paul',
                                        'userstatus': 'registered',
                                        'id': 3645,
                                        'supervisor': 1442,
                                        'username': 'paulcfc@CLP.com.hk'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                        'userfullname': 'Alan',
                                        'userstatus': 'registered',
                                        'id': 3646,
                                        'supervisor': 1442,
                                        'username': 'yweng1@its.jnj.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                        'userfullname': 'Greg',
                                        'userstatus': 'registered',
                                        'id': 3655,
                                        'supervisor': 1442,
                                        'username': 'GMoore@retprogroup.com.au'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                        'userfullname': 'Mahesh',
                                        'userstatus': 'registered',
                                        'id': 3656,
                                        'supervisor': 1442,
                                        'username': 'MKumar@retprogroup.com.au'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                        'userfullname': 'Ben',
                                        'userstatus': 'registered',
                                        'id': 3657,
                                        'supervisor': 1442,
                                        'username': 'ben.rollo@armadafunds.com.au'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                        'userfullname': '王蕾',
                                        'userstatus': 'registered',
                                        'id': 3689,
                                        'supervisor': 1442,
                                        'username': 'shirleyw2003@163.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                        'userfullname': '735028192@qq.com',
                                        'userstatus': 'registered',
                                        'id': 3724,
                                        'supervisor': 1442,
                                        'username': 'SpringTest'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                        'userfullname': '1828891650@qq.com',
                                        'userstatus': 'registered',
                                        'id': 3725,
                                        'supervisor': 1442,
                                        'username': '1828891650@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                        'userfullname': 'joperrehu-6028@yopmail.com',
                                        'userstatus': 'registered',
                                        'id': 3726,
                                        'supervisor': 1442,
                                        'username': 'joperrehu-6028@yopmail.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                        'userfullname': 'xahacottep-6147@yopmail.com',
                                        'userstatus': 'registered',
                                        'id': 3727,
                                        'supervisor': 1442,
                                        'username': 'xahacottep-6147@yopmail.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                        'userfullname': 'Stephan',
                                        'userstatus': 'registered',
                                        'id': 3728,
                                        'supervisor': 1442,
                                        'username': 'abozifasi-2906@yopmail.com'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/43788780.jpg',
                                'userfullname': 'russell',
                                'userstatus': 'registered',
                                'id': 1442,
                                'supervisor': 83,
                                'username': 'russell.ma@rnbtech.com.hk'
                            },
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                        'userfullname': 'William Wu',
                                        'userstatus': 'expired',
                                        'id': 1382,
                                        'supervisor': 1451,
                                        'username': 'William.Wu@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                        'userfullname': 'Lennie Ong',
                                        'userstatus': 'registered',
                                        'id': 1383,
                                        'supervisor': 1451,
                                        'username': 'Lennie.ong@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                        'userfullname': 'May Lv',
                                        'userstatus': 'registered',
                                        'id': 1384,
                                        'supervisor': 1451,
                                        'username': 'May.Lv@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                        'userfullname': 'Bowen Gao',
                                        'userstatus': 'expired',
                                        'id': 1385,
                                        'supervisor': 1451,
                                        'username': 'hao.guo@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                        'userfullname': '吴沂城',
                                        'userstatus': 'invited',
                                        'id': 1387,
                                        'supervisor': 1451,
                                        'username': 'yicheng.wu@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                        'userfullname': '黄国华',
                                        'userstatus': 'invited',
                                        'id': 1388,
                                        'supervisor': 1451,
                                        'username': 'Philip.wong@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                        'userfullname': '许路',
                                        'userstatus': 'registered',
                                        'id': 1389,
                                        'supervisor': 1451,
                                        'username': 'Jim.xu@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': '陈跃喜',
                                        'userstatus': 'invited',
                                        'id': 1390,
                                        'supervisor': 1451,
                                        'username': 'Yuexi.chen@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                        'userfullname': '魏振清',
                                        'userstatus': 'invited',
                                        'id': 1391,
                                        'supervisor': 1451,
                                        'username': 'Zhenqing.wei@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                        'userfullname': 'sam.sang',
                                        'userstatus': 'expired',
                                        'id': 1486,
                                        'supervisor': 1451,
                                        'username': 'sam.sang@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                        'userfullname': '郭先生',
                                        'userstatus': 'registered',
                                        'id': 1909,
                                        'supervisor': 1451,
                                        'username': 'Charles.Guo@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                        'userfullname': 'henryng',
                                        'userstatus': 'registered',
                                        'id': 1914,
                                        'supervisor': 1451,
                                        'username': 'Henry.ng@cbre.com.cn'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': '项目管理013',
                                'userstatus': 'registered',
                                'id': 1451,
                                'supervisor': 83,
                                'username': '项目管理'
                            },
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': '上汽2-2管理员',
                                        'userstatus': 'registered',
                                        'id': 406,
                                        'supervisor': 1452,
                                        'username': 'tengxiong@saicmotor.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                        'userfullname': 'shangqi1',
                                        'userstatus': 'registered',
                                        'id': 1226,
                                        'supervisor': 1452,
                                        'username': '563066690@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                        'userfullname': '小欣',
                                        'userstatus': 'expired',
                                        'id': 1915,
                                        'supervisor': 1452,
                                        'username': '153831354@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                        'userfullname': 'nfi89erwjf',
                                        'userstatus': 'registered',
                                        'id': 3712,
                                        'supervisor': 1452,
                                        'username': 'fn49803jtfr'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': '项目管理014',
                                'userstatus': 'registered',
                                'id': 1452,
                                'supervisor': 83,
                                'username': '项目管理'
                            },
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                        'userfullname': '吴骏',
                                        'userstatus': 'expired',
                                        'id': 2126,
                                        'supervisor': 1454,
                                        'username': 'jun.wu4@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                        'userfullname': '腾飞大厦物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2127,
                                        'supervisor': 1454,
                                        'username': 'beiqi.yan@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                        'userfullname': '邵志涛',
                                        'userstatus': 'expired',
                                        'id': 2128,
                                        'supervisor': 1454,
                                        'username': 'szt_2011@126.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                        'userfullname': '思南公馆物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2129,
                                        'supervisor': 1454,
                                        'username': 'aloysius.chui@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                        'userfullname': '周剑锋',
                                        'userstatus': 'expired',
                                        'id': 2130,
                                        'supervisor': 1454,
                                        'username': 'ceomicron@126.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                        'userfullname': '金桥国际物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2131,
                                        'supervisor': 1454,
                                        'username': 'edmond.chan@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                        'userfullname': '龚鹏程',
                                        'userstatus': 'expired',
                                        'id': 2132,
                                        'supervisor': 1454,
                                        'username': 'Geet.Gong@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                        'userfullname': '万宝国际物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2133,
                                        'supervisor': 1454,
                                        'username': 'dawson.miao@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                        'userfullname': '陆茂生',
                                        'userstatus': 'expired',
                                        'id': 2134,
                                        'supervisor': 1454,
                                        'username': 'lu_mao_sheng@163.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                        'userfullname': '首信银都物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2135,
                                        'supervisor': 1454,
                                        'username': 'tianbo.zhang@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                        'userfullname': '沈国伟',
                                        'userstatus': 'expired',
                                        'id': 2136,
                                        'supervisor': 1454,
                                        'username': 'guowei.shen@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                        'userfullname': '丰盛创建大厦物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2137,
                                        'supervisor': 1454,
                                        'username': 'Yaqing.Pan@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                        'userfullname': '朱纯',
                                        'userstatus': 'expired',
                                        'id': 2138,
                                        'supervisor': 1454,
                                        'username': 'chun.zhu@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                        'userfullname': '瀛通绿地大厦物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2139,
                                        'supervisor': 1454,
                                        'username': 'Fang.Lu@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                        'userfullname': '衡山坊物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2140,
                                        'supervisor': 1454,
                                        'username': 'johnson.zhu@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                        'userfullname': '张永发',
                                        'userstatus': 'expired',
                                        'id': 2141,
                                        'supervisor': 1454,
                                        'username': 'yongfa.zhang@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                        'userfullname': '祥生福田雅园物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2142,
                                        'supervisor': 1454,
                                        'username': 'frank.jiang@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                        'userfullname': '顾伟钢',
                                        'userstatus': 'expired',
                                        'id': 2143,
                                        'supervisor': 1454,
                                        'username': 'weigang.gu@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                        'userfullname': '顾敏',
                                        'userstatus': 'expired',
                                        'id': 2145,
                                        'supervisor': 1454,
                                        'username': 'min.gu@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                        'userfullname': '日月光物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2146,
                                        'supervisor': 1454,
                                        'username': 'reynold.lu@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                        'userfullname': '李佳',
                                        'userstatus': 'expired',
                                        'id': 2147,
                                        'supervisor': 1454,
                                        'username': 'jia.li@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                        'userfullname': '国信世纪海景园物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2148,
                                        'supervisor': 1454,
                                        'username': 'jackie.mao@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                        'userfullname': '杨明高',
                                        'userstatus': 'expired',
                                        'id': 2149,
                                        'supervisor': 1454,
                                        'username': 'minggao.yang@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                        'userfullname': '畅星大厦物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2150,
                                        'supervisor': 1454,
                                        'username': 'Johnny.zhuang@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                        'userfullname': '周嵘',
                                        'userstatus': 'expired',
                                        'id': 2151,
                                        'supervisor': 1454,
                                        'username': 'rong.zhou@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                        'userfullname': '浦汇大厦物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2152,
                                        'supervisor': 1454,
                                        'username': 'Dora.Zhang3@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                        'userfullname': '高磊',
                                        'userstatus': 'expired',
                                        'id': 2153,
                                        'supervisor': 1454,
                                        'username': 'ray.gao@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': '陈凌',
                                        'userstatus': 'expired',
                                        'id': 2154,
                                        'supervisor': 1454,
                                        'username': '2412145544@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                        'userfullname': '无锡红豆国际广场物业总经',
                                        'userstatus': 'expired',
                                        'id': 2155,
                                        'supervisor': 1454,
                                        'username': 'ming.ge@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                        'userfullname': '朱卫青',
                                        'userstatus': 'expired',
                                        'id': 2156,
                                        'supervisor': 1454,
                                        'username': 'weiqing.zhu@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                        'userfullname': '无锡苏宁广场物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2157,
                                        'supervisor': 1454,
                                        'username': 'Fang.Ren@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                        'userfullname': '顾康荣',
                                        'userstatus': 'expired',
                                        'id': 2158,
                                        'supervisor': 1454,
                                        'username': 'kangrong.gu@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                        'userfullname': '无锡国金中心物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2159,
                                        'supervisor': 1454,
                                        'username': 'Guoming.Chen@cbre.com.hk'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                        'userfullname': '无锡保利达物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2160,
                                        'supervisor': 1454,
                                        'username': 'liang.chu@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                        'userfullname': '任飞',
                                        'userstatus': 'expired',
                                        'id': 2161,
                                        'supervisor': 1454,
                                        'username': '76734417@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                        'userfullname': '苏州广电物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2162,
                                        'supervisor': 1454,
                                        'username': 'Ron.lu@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                        'userfullname': '曹致新',
                                        'userstatus': 'expired',
                                        'id': 2163,
                                        'supervisor': 1454,
                                        'username': 'jacob.cao@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                        'userfullname': '苏州现代传媒广场物业总经',
                                        'userstatus': 'expired',
                                        'id': 2164,
                                        'supervisor': 1454,
                                        'username': 'xian.zhou@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                        'userfullname': '张令军',
                                        'userstatus': 'expired',
                                        'id': 2165,
                                        'supervisor': 1454,
                                        'username': 'lingjun.zhang@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                        'userfullname': '东郊中心物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2166,
                                        'supervisor': 1454,
                                        'username': 'ivy.zhu@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                        'userfullname': '向小明',
                                        'userstatus': 'expired',
                                        'id': 2167,
                                        'supervisor': 1454,
                                        'username': 'xiangxiaoming118@126.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                        'userfullname': '昆城景苑物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2168,
                                        'supervisor': 1454,
                                        'username': 'chengchao.wang@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                        'userfullname': '魏春',
                                        'userstatus': 'expired',
                                        'id': 2169,
                                        'supervisor': 1454,
                                        'username': 'chun.wei@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                        'userfullname': '昆城广场物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2170,
                                        'supervisor': 1454,
                                        'username': 'guorong.zhou@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': '杨光',
                                        'userstatus': 'expired',
                                        'id': 2171,
                                        'supervisor': 1454,
                                        'username': 'Tom.Yang@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                        'userfullname': '南翔太茂物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2172,
                                        'supervisor': 1454,
                                        'username': 'Weimin.Zhu@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                        'userfullname': 'cn\\zhenyu.tan',
                                        'userstatus': 'expired',
                                        'id': 2173,
                                        'supervisor': 1454,
                                        'username': 'zhenyu.tan@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                        'userfullname': '金桥太茂物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2174,
                                        'supervisor': 1454,
                                        'username': 'Peter.Zhu@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                        'userfullname': '陈凌华',
                                        'userstatus': 'expired',
                                        'id': 2175,
                                        'supervisor': 1454,
                                        'username': 'linghua.chen@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                        'userfullname': '泰康世纪大厦物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2176,
                                        'supervisor': 1454,
                                        'username': 'Shangang.Lu@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                        'userfullname': '葛华',
                                        'userstatus': 'expired',
                                        'id': 2177,
                                        'supervisor': 1454,
                                        'username': 'hua.ge@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                        'userfullname': 'frank.xu',
                                        'userstatus': 'expired',
                                        'id': 2178,
                                        'supervisor': 1454,
                                        'username': 'frank.xu@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                        'userfullname': '杭州东部国际物业总经理',
                                        'userstatus': 'expired',
                                        'id': 2179,
                                        'supervisor': 1454,
                                        'username': 'yu.zhang@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                        'userfullname': '侯宣',
                                        'userstatus': 'expired',
                                        'id': 2180,
                                        'supervisor': 1454,
                                        'username': 'jack.hou@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': '余凡',
                                        'userstatus': 'expired',
                                        'id': 2181,
                                        'supervisor': 1454,
                                        'username': 'david.yu@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                        'userfullname': '宗西有',
                                        'userstatus': 'expired',
                                        'id': 2182,
                                        'supervisor': 1454,
                                        'username': 'xiyou.zong@cbre.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                        'userfullname': '周琦',
                                        'userstatus': 'expired',
                                        'id': 2183,
                                        'supervisor': 1454,
                                        'username': 'george.zhou@cbre.com.cn'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': '项目管理016',
                                'userstatus': 'registered',
                                'id': 1454,
                                'supervisor': 83,
                                'username': '项目管理'
                            },
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                        'userfullname': 'Nik',
                                        'userstatus': 'registered',
                                        'id': 2563,
                                        'supervisor': 1455,
                                        'username': 'Nik.Sudhakar@cbre.com.hk'
                                    },
                                    {
                                        'isManager': 1,
                                        'sub': [
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                                'userfullname': 'Tushar ',
                                                'userstatus': 'registered',
                                                'id': 2560,
                                                'supervisor': 2715,
                                                'username': 'Tushar.Aggarwal@cbre.com.au'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                                'userfullname': 'Yeo, Mark',
                                                'userstatus': 'registered',
                                                'id': 3780,
                                                'supervisor': 2715,
                                                'username': 'Mark.Yeo@cbre.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                                'userfullname': 'Feng, Jessica',
                                                'userstatus': 'registered',
                                                'id': 3781,
                                                'supervisor': 2715,
                                                'username': 'Jessica.Feng@cbre.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                                'userfullname': 'Yang, SH',
                                                'userstatus': 'registered',
                                                'id': 3782,
                                                'supervisor': 2715,
                                                'username': 'SH.Yang@cbrekorea.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                                'userfullname': 'Suh, YJ',
                                                'userstatus': 'registered',
                                                'id': 3783,
                                                'supervisor': 2715,
                                                'username': 'Yj.Suh@cbre.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                                'userfullname': 'Savla, Himesh',
                                                'userstatus': 'registered',
                                                'id': 3784,
                                                'supervisor': 2715,
                                                'username': 'Himesh.Savla@cbre.co.in'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                                'userfullname': 'Podar, Ashish',
                                                'userstatus': 'registered',
                                                'id': 3785,
                                                'supervisor': 2715,
                                                'username': 'ashish.podar@cbre.co.in'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                                'userfullname': 'Pandit, Rajesh',
                                                'userstatus': 'registered',
                                                'id': 3786,
                                                'supervisor': 2715,
                                                'username': 'Rajesh.Pandit@cbre.co.in'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                                'userfullname': 'Smith, Michael',
                                                'userstatus': 'registered',
                                                'id': 3787,
                                                'supervisor': 2715,
                                                'username': 'Michael.ASmith@cbre.com.hk'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                                'userfullname': 'Gerrelli, David',
                                                'userstatus': 'registered',
                                                'id': 3788,
                                                'supervisor': 2715,
                                                'username': 'David.Gerrelli@cbre.com'
                                            }
                                        ],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': 'Wendy',
                                        'userstatus': 'registered',
                                        'id': 2715,
                                        'supervisor': 1455,
                                        'username': 'Wendy.Michael@cbre.com.hk'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': '项目管理017',
                                'userstatus': 'registered',
                                'id': 1455,
                                'supervisor': 83,
                                'username': '项目管理'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': '项目管理018',
                                'userstatus': 'registered',
                                'id': 1456,
                                'supervisor': 83,
                                'username': '项目管理'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': '项目管理019',
                                'userstatus': 'registered',
                                'id': 1457,
                                'supervisor': 83,
                                'username': '项目管理'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': '谢洋',
                                'userstatus': 'invited',
                                'id': 1487,
                                'supervisor': 83,
                                'username': 'yang.xie@heatcraft.com.cn'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/18757575.jpg',
                                'userfullname': 'Helen',
                                'userstatus': 'registered',
                                'id': 1502,
                                'supervisor': 83,
                                'username': 'smuhuan@163.com'
                            },
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                        'userfullname': '华东电网',
                                        'userstatus': 'registered',
                                        'id': 3779,
                                        'supervisor': 1508,
                                        'username': '523404296@qq.com'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': 'Shirley\r\nShirley\r\n',
                                'userstatus': 'registered',
                                'id': 1508,
                                'supervisor': 83,
                                'username': 'lijiarong0405@163.com'
                            },
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                        'userfullname': '王总',
                                        'userstatus': 'registered',
                                        'id': 3632,
                                        'supervisor': 1509,
                                        'username': 'hdny@sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                        'userfullname': '丁经理',
                                        'userstatus': 'registered',
                                        'id': 3652,
                                        'supervisor': 1509,
                                        'username': 'shangshi_dj@yeah.net'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                        'userfullname': '总降站长',
                                        'userstatus': 'registered',
                                        'id': 3665,
                                        'supervisor': 1509,
                                        'username': '1129680598@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                        'userfullname': 'Jerry',
                                        'userstatus': 'registered',
                                        'id': 3732,
                                        'supervisor': 1509,
                                        'username': 'jerry.yuan@ikea.com'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/28740333.jpg',
                                'userfullname': 'Lion\r\n',
                                'userstatus': 'registered',
                                'id': 1509,
                                'supervisor': 83,
                                'username': 'ylfsingle@163.com'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': 'kevin',
                                'userstatus': 'registered',
                                'id': 1649,
                                'supervisor': 83,
                                'username': 'kevin.tao@rnbtech.com.hk'
                            },
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                        'userfullname': '陈洪祥',
                                        'userstatus': 'registered',
                                        'id': 1488,
                                        'supervisor': 1708,
                                        'username': 'hongxiang.chen@heatcraft.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                        'userfullname': '张志',
                                        'userstatus': 'registered',
                                        'id': 1965,
                                        'supervisor': 1708,
                                        'username': 'zhi.zhang@heatcraft.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                        'userfullname': '屠文洪',
                                        'userstatus': 'registered',
                                        'id': 2280,
                                        'supervisor': 1708,
                                        'username': 'wenhong.tu@heatcraft.com.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                        'userfullname': '王海辉',
                                        'userstatus': 'registered',
                                        'id': 2521,
                                        'supervisor': 1708,
                                        'username': '11021213@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                        'userfullname': '邬志强',
                                        'userstatus': 'registered',
                                        'id': 2600,
                                        'supervisor': 1708,
                                        'username': 'wuzhiqiangshpl@163.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                        'userfullname': '陈志辉',
                                        'userstatus': 'registered',
                                        'id': 2665,
                                        'supervisor': 1708,
                                        'username': '173231072@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': '邢喜安',
                                        'userstatus': 'registered',
                                        'id': 2674,
                                        'supervisor': 1708,
                                        'username': 'andy.xing@lemeridien.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                        'userfullname': '汲晓露',
                                        'userstatus': 'invited',
                                        'id': 2680,
                                        'supervisor': 1708,
                                        'username': 'jixiaolu@runpaq.com'
                                    },
                                    {
                                        'isManager': 1,
                                        'sub': [
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                                'userfullname': 'testuser',
                                                'userstatus': 'registered',
                                                'id': 3051,
                                                'supervisor': 2686,
                                                'username': 'userfm801@gmail.com'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                                'userfullname': 'testuser',
                                                'userstatus': 'registered',
                                                'id': 3164,
                                                'supervisor': 2686,
                                                'username': 'ywang@facilitymatrix.net'
                                            },
                                            {
                                                'isManager': 0,
                                                'sub': [],
                                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                                'userfullname': 'operator',
                                                'userstatus': 'registered',
                                                'id': 3754,
                                                'supervisor': 2686,
                                                'username': 'operator'
                                            }
                                        ],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                        'userfullname': 'sliu@facilit',
                                        'userstatus': 'registered',
                                        'id': 2686,
                                        'supervisor': 1708,
                                        'username': 'sliu@facilitymatrix.net'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                        'userfullname': '裘依依（小号）',
                                        'userstatus': 'registered',
                                        'id': 2698,
                                        'supervisor': 1708,
                                        'username': '419709740@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                        'userfullname': '13501856340',
                                        'userstatus': 'registered',
                                        'id': 3231,
                                        'supervisor': 1708,
                                        'username': 'frederic.guilloux@adenservices.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                        'userfullname': 'laurent.ye',
                                        'userstatus': 'registered',
                                        'id': 3232,
                                        'supervisor': 1708,
                                        'username': 'laurent.ye@adenservices.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                        'userfullname': 'vianney.pean',
                                        'userstatus': 'registered',
                                        'id': 3233,
                                        'supervisor': 1708,
                                        'username': 'vianney.pean@adenservices.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                        'userfullname': 'daniel.peng',
                                        'userstatus': 'registered',
                                        'id': 3234,
                                        'supervisor': 1708,
                                        'username': 'daniel.peng@adenservices.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                        'userfullname': 'helen.lin',
                                        'userstatus': 'registered',
                                        'id': 3235,
                                        'supervisor': 1708,
                                        'username': 'helen.lin@adenservices.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': 'walker.jia',
                                        'userstatus': 'registered',
                                        'id': 3236,
                                        'supervisor': 1708,
                                        'username': 'walker.jia@adenservices.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                        'userfullname': 'xinkun.zhao',
                                        'userstatus': 'registered',
                                        'id': 3237,
                                        'supervisor': 1708,
                                        'username': 'xinkun.zhao@adenservices.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                        'userfullname': 'arnaud.d',
                                        'userstatus': 'registered',
                                        'id': 3319,
                                        'supervisor': 1708,
                                        'username': 'arnaud.dauvillier@adenservices.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                        'userfullname': 'Celine',
                                        'userstatus': 'registered',
                                        'id': 3631,
                                        'supervisor': 1708,
                                        'username': 'celine.cz.zhang@adenservices.com'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                'userfullname': 'yiyi',
                                'userstatus': 'registered',
                                'id': 1708,
                                'supervisor': 83,
                                'username': 'yiyi.qiu@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': 'JIEMA',
                                'userstatus': 'registered',
                                'id': 1889,
                                'supervisor': 83,
                                'username': 'Tangjie@hzjiema.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                'userfullname': 'David',
                                'userstatus': 'registered',
                                'id': 2207,
                                'supervisor': 83,
                                'username': 'david.azar@octagonalgroup.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': '宋经理',
                                'userstatus': 'registered',
                                'id': 2295,
                                'supervisor': 83,
                                'username': 'da.song@colliersrems.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                'userfullname': 'Scott ',
                                'userstatus': 'invited',
                                'id': 2561,
                                'supervisor': 83,
                                'username': 'Scott.Sullivan@cbre.com.au'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                'userfullname': '朱刚',
                                'userstatus': 'registered',
                                'id': 2692,
                                'supervisor': 83,
                                'username': '1061127482@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': '胡洋',
                                'userstatus': 'registered',
                                'id': 2703,
                                'supervisor': 83,
                                'username': 'Feoras.Hu@cbre.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': 'ricky',
                                'userstatus': 'registered',
                                'id': 2704,
                                'supervisor': 83,
                                'username': 'ricky.huang@cbre.com.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                'userfullname': 'adonis.li',
                                'userstatus': 'invited',
                                'id': 2708,
                                'supervisor': 83,
                                'username': 'adonis.li@cbre.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                'userfullname': 'pgjn@pgjn.com',
                                'userstatus': 'registered',
                                'id': 3152,
                                'supervisor': 83,
                                'username': 'chenyanwen@pgjc.com.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': 'joanna',
                                'userstatus': 'registered',
                                'id': 3161,
                                'supervisor': 83,
                                'username': 'joanna.he@cbre.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': 'Arnaud D',
                                'userstatus': 'expired',
                                'id': 3318,
                                'supervisor': 83,
                                'username': 'arnaud.daubillier@adenservices.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': 'Michael Liu',
                                'userstatus': 'registered',
                                'id': 3431,
                                'supervisor': 83,
                                'username': 'Michael'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                'userfullname': 'GionaGao',
                                'userstatus': 'registered',
                                'id': 3541,
                                'supervisor': 83,
                                'username': 'GionaGao'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                'userfullname': 'salesadmin@rnbtech.com.hk',
                                'userstatus': 'registered',
                                'id': 3580,
                                'supervisor': 83,
                                'username': '小欣'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                'userfullname': 'M_Yiping@yeah.net',
                                'userstatus': 'expired',
                                'id': 3581,
                                'supervisor': 83,
                                'username': '小马'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                'userfullname': 'BeOP1112',
                                'userstatus': 'expired',
                                'id': 3582,
                                'supervisor': 83,
                                'username': '小大'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                'userfullname': 'Zhongxinguoji1',
                                'userstatus': 'expired',
                                'id': 3583,
                                'supervisor': 83,
                                'username': '中芯国际'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': 'Stephen',
                                'userstatus': 'registered',
                                'id': 3715,
                                'supervisor': 83,
                                'username': 'stephen.tam@cbre.com.cn'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': 'angela',
                        'userstatus': 'registered',
                        'id': 83,
                        'supervisor': 3283,
                        'username': 'angela.wang@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': 'bruce',
                        'userstatus': 'registered',
                        'id': 162,
                        'supervisor': 3283,
                        'username': 'bruce.xu@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': 'jason',
                        'userstatus': 'expired',
                        'id': 173,
                        'supervisor': 3283,
                        'username': 'jason.zou@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': 'ting',
                        'userstatus': 'expired',
                        'id': 194,
                        'supervisor': 3283,
                        'username': 'ting.hai@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': 'feng',
                                'userstatus': 'expired',
                                'id': 203,
                                'supervisor': 218,
                                'username': 'feng.min@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/16581010.jpg',
                                'userfullname': 'sonia',
                                'userstatus': 'registered',
                                'id': 222,
                                'supervisor': 218,
                                'username': 'sonia.chen@rnbtech.com.hk'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': 'lydia',
                                'userstatus': 'expired',
                                'id': 255,
                                'supervisor': 218,
                                'username': 'lydia.li@rnbtech.com.hk'
                            },
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                                        'userfullname': '周敏丰',
                                        'userstatus': 'registered',
                                        'id': 1444,
                                        'supervisor': 365,
                                        'username': 'minfeng.zhou@sf-pv.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                        'userfullname': '张国兴',
                                        'userstatus': 'registered',
                                        'id': 1476,
                                        'supervisor': 365,
                                        'username': 'george-zgx@163.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                        'userfullname': '林总',
                                        'userstatus': 'registered',
                                        'id': 1614,
                                        'supervisor': 365,
                                        'username': 'cwlin@vip.sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                        'userfullname': 'jiahong',
                                        'userstatus': 'registered',
                                        'id': 1615,
                                        'supervisor': 365,
                                        'username': '13962047@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                        'userfullname': '宫经理',
                                        'userstatus': 'expired',
                                        'id': 1685,
                                        'supervisor': 365,
                                        'username': 'double_gong@colpal.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                        'userfullname': '吴文',
                                        'userstatus': 'registered',
                                        'id': 1736,
                                        'supervisor': 365,
                                        'username': 'thyck@sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                        'userfullname': '季海军',
                                        'userstatus': 'invited',
                                        'id': 1837,
                                        'supervisor': 365,
                                        'username': 'haijun_ji@colpal.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                        'userfullname': '徐工',
                                        'userstatus': 'registered',
                                        'id': 2617,
                                        'supervisor': 365,
                                        'username': 'xushyo@celestica.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': '王运德',
                                        'userstatus': 'registered',
                                        'id': 2691,
                                        'supervisor': 365,
                                        'username': 'ydwang@celestica.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                        'userfullname': '谢总（天弘）',
                                        'userstatus': 'registered',
                                        'id': 2694,
                                        'supervisor': 365,
                                        'username': 'thchia@celestica.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                        'userfullname': '天弘科技黄总',
                                        'userstatus': 'registered',
                                        'id': 3300,
                                        'supervisor': 365,
                                        'username': 'chhuang@celestica.com'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': 'harvey',
                                'userstatus': 'registered',
                                'id': 365,
                                'supervisor': 218,
                                'username': 'harvey.zhu@rnbtech.com.hk'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': 'tianming',
                                'userstatus': 'expired',
                                'id': 382,
                                'supervisor': 218,
                                'username': 'tianming.gu@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': 'SHHW_Wangfen',
                                'userstatus': 'registered',
                                'id': 391,
                                'supervisor': 218,
                                'username': 'Wangfengxia@huawei.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                'userfullname': 'SHHW_linshuy',
                                'userstatus': 'registered',
                                'id': 392,
                                'supervisor': 218,
                                'username': 'linshuyang@huawei.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': 'SHHW_shacgd',
                                'userstatus': 'registered',
                                'id': 393,
                                'supervisor': 218,
                                'username': 'shacgd@huawei.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                'userfullname': 'SHHW_shacga',
                                'userstatus': 'registered',
                                'id': 394,
                                'supervisor': 218,
                                'username': 'shacga@huawei.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': 'VIPclients',
                                'userstatus': 'expired',
                                'id': 398,
                                'supervisor': 218,
                                'username': 'rnbvipclients@126.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': 'SHHW',
                                'userstatus': 'registered',
                                'id': 407,
                                'supervisor': 218,
                                'username': 'shacgc@huawei.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                'userfullname': 'Alex',
                                'userstatus': 'registered',
                                'id': 486,
                                'supervisor': 218,
                                'username': '14324190@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': 'shhuawei001',
                                'userstatus': 'registered',
                                'id': 511,
                                'supervisor': 218,
                                'username': 'shhuawei001@sina.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': '付正华',
                                'userstatus': 'registered',
                                'id': 1137,
                                'supervisor': 218,
                                'username': 'shacgi1@huawei.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': '孙海',
                                'userstatus': 'registered',
                                'id': 1138,
                                'supervisor': 218,
                                'username': 'shapga7@huawei.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                'userfullname': 'cmlai_cn',
                                'userstatus': 'invited',
                                'id': 1364,
                                'supervisor': 218,
                                'username': 'cmlai_cn@jcap.com.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                'userfullname': 'cynthia',
                                'userstatus': 'invited',
                                'id': 1365,
                                'supervisor': 218,
                                'username': 'cynthia@jcap.com.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                'userfullname': 'fl_huang',
                                'userstatus': 'expired',
                                'id': 1366,
                                'supervisor': 218,
                                'username': 'fl_huang@jcap.com.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                'userfullname': 'Daniel_chen',
                                'userstatus': 'expired',
                                'id': 1367,
                                'supervisor': 218,
                                'username': 'Daniel_chen@jcap.com.cn'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                'userfullname': 'Chuanling_ch',
                                'userstatus': 'expired',
                                'id': 1368,
                                'supervisor': 218,
                                'username': 'Chuanling_chen@jcap.com.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                'userfullname': 'b2dongli',
                                'userstatus': 'expired',
                                'id': 1369,
                                'supervisor': 218,
                                'username': 'b2dongli@jcap.com.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': 'andy.yi',
                                'userstatus': 'expired',
                                'id': 1370,
                                'supervisor': 218,
                                'username': 'andy.yi@rnbtech.com.hk'
                            },
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                        'userfullname': '袁孝义',
                                        'userstatus': 'registered',
                                        'id': 1789,
                                        'supervisor': 1453,
                                        'username': 'xiaoyiyuan@MBARENA.COM'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                        'userfullname': '张丽',
                                        'userstatus': 'registered',
                                        'id': 1790,
                                        'supervisor': 1453,
                                        'username': 'zhang_li@expogroup.sh.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                        'userfullname': '周洁',
                                        'userstatus': 'registered',
                                        'id': 1791,
                                        'supervisor': 1453,
                                        'username': 'zhoujie2010@expogroup.sh.cn'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                        'userfullname': '姜其军',
                                        'userstatus': 'registered',
                                        'id': 1792,
                                        'supervisor': 1453,
                                        'username': 'qijunjiang@MBARENA.COM'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                        'userfullname': '唐永浩',
                                        'userstatus': 'registered',
                                        'id': 1793,
                                        'supervisor': 1453,
                                        'username': 'timtang@MBARENA.COM'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                        'userfullname': '周羽飞',
                                        'userstatus': 'registered',
                                        'id': 1794,
                                        'supervisor': 1453,
                                        'username': 'yufeizhou@MBARENA.COM'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                        'userfullname': '郁宇诚',
                                        'userstatus': 'invited',
                                        'id': 1795,
                                        'supervisor': 1453,
                                        'username': 'jackyyu@MBARENA.COM'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                        'userfullname': '谢嘉亮',
                                        'userstatus': 'registered',
                                        'id': 1796,
                                        'supervisor': 1453,
                                        'username': 'jialiangxie@MBARENA.COM'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                        'userfullname': '杨颖路',
                                        'userstatus': 'invited',
                                        'id': 1797,
                                        'supervisor': 1453,
                                        'username': 'yyl@vspsecuritygroup.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                        'userfullname': '华总',
                                        'userstatus': 'registered',
                                        'id': 1798,
                                        'supervisor': 1453,
                                        'username': 'davidhua@MBARENA.COM'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': '燕宣武',
                                        'userstatus': 'registered',
                                        'id': 1799,
                                        'supervisor': 1453,
                                        'username': 'tomyan@MBARENA.COM'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                        'userfullname': '周程银',
                                        'userstatus': 'invited',
                                        'id': 1800,
                                        'supervisor': 1453,
                                        'username': 'chenyinzhou@MBARENA.COM'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                        'userfullname': '吴立啸',
                                        'userstatus': 'invited',
                                        'id': 1801,
                                        'supervisor': 1453,
                                        'username': 'foxwu@MBARENA.COM'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                        'userfullname': '闵坚',
                                        'userstatus': 'invited',
                                        'id': 1802,
                                        'supervisor': 1453,
                                        'username': 'jianmin@MBARENA.COM'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                        'userfullname': '葛纪文',
                                        'userstatus': 'registered',
                                        'id': 1803,
                                        'supervisor': 1453,
                                        'username': 'MSDS@siicpm.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                        'userfullname': '周光杰',
                                        'userstatus': 'registered',
                                        'id': 2619,
                                        'supervisor': 1453,
                                        'username': 'guangjiezhou@mbarena.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': '冯海',
                                        'userstatus': 'invited',
                                        'id': 2620,
                                        'supervisor': 1453,
                                        'username': '314248722@qq.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                        'userfullname': '邹福权',
                                        'userstatus': 'invited',
                                        'id': 2621,
                                        'supervisor': 1453,
                                        'username': '18917999998@163.com'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': '项目管理015',
                                'userstatus': 'registered',
                                'id': 1453,
                                'supervisor': 218,
                                'username': '项目管理'
                            },
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                        'userfullname': 'George Zhou',
                                        'userstatus': 'registered',
                                        'id': 1380,
                                        'supervisor': 1466,
                                        'username': 'George.Zhou@cbre.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                        'userfullname': 'Baoyue Kan',
                                        'userstatus': 'registered',
                                        'id': 1381,
                                        'supervisor': 1466,
                                        'username': 'Baoyue.Kan@cbre.com'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': '项目管理028',
                                'userstatus': 'registered',
                                'id': 1466,
                                'supervisor': 218,
                                'username': '项目管理'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                'userfullname': 'nike',
                                'userstatus': 'expired',
                                'id': 1495,
                                'supervisor': 218,
                                'username': 'nike.lu@rnbtech.com.hk'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                'userfullname': 'rnbclients',
                                'userstatus': 'expired',
                                'id': 1588,
                                'supervisor': 218,
                                'username': 'rnbclients@126.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                'userfullname': '王彦臻',
                                'userstatus': 'registered',
                                'id': 1817,
                                'supervisor': 218,
                                'username': '54410318@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                'userfullname': 'Engineer',
                                'userstatus': 'registered',
                                'id': 1829,
                                'supervisor': 218,
                                'username': 'michaelru@hotmail.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': '董宇光',
                                'userstatus': 'registered',
                                'id': 1908,
                                'supervisor': 218,
                                'username': 'y00fratal@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': '平安电子',
                                'userstatus': 'expired',
                                'id': 1964,
                                'supervisor': 218,
                                'username': 'chang@iemstech.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                'userfullname': '和传电气',
                                'userstatus': 'registered',
                                'id': 2026,
                                'supervisor': 218,
                                'username': '13774416070@163.com'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': '吴诚云',
                                'userstatus': 'registered',
                                'id': 2276,
                                'supervisor': 218,
                                'username': 'wuchengyun@me.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                'userfullname': '上实工程条线',
                                'userstatus': 'registered',
                                'id': 2277,
                                'supervisor': 218,
                                'username': 'gctx@siicpm.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                'userfullname': '徐卫东',
                                'userstatus': 'registered',
                                'id': 2278,
                                'supervisor': 218,
                                'username': 'gzzxbgla@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                'userfullname': '沈豪强',
                                'userstatus': 'registered',
                                'id': 2279,
                                'supervisor': 218,
                                'username': 'shq19600312@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': '雪球1',
                                'userstatus': 'registered',
                                'id': 2615,
                                'supervisor': 218,
                                'username': 'xueqiu1608@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                'userfullname': '雪球2',
                                'userstatus': 'registered',
                                'id': 2616,
                                'supervisor': 218,
                                'username': 'xueqiu16081@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': '陈鑫龙',
                                'userstatus': 'invited',
                                'id': 2629,
                                'supervisor': 218,
                                'username': 'chenxinlong@cecpandalcd.com.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                'userfullname': '阙祥明',
                                'userstatus': 'invited',
                                'id': 2630,
                                'supervisor': 218,
                                'username': 'quexiangming@cecpandalcd.com.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                'userfullname': '林志诚',
                                'userstatus': 'invited',
                                'id': 2631,
                                'supervisor': 218,
                                'username': 'linzhicheng@cecpandalcd.com.cn'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': '欧阳生春',
                                'userstatus': 'registered',
                                'id': 2632,
                                'supervisor': 218,
                                'username': '13774246130@126.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': '陈鑫龙',
                                'userstatus': 'registered',
                                'id': 2633,
                                'supervisor': 218,
                                'username': 'kevin19880605@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                'userfullname': '辛长征',
                                'userstatus': 'invited',
                                'id': 2634,
                                'supervisor': 218,
                                'username': 'xincz@vanke.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': '谷海峰',
                                'userstatus': 'registered',
                                'id': 2635,
                                'supervisor': 218,
                                'username': 'guhf02@vanke.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': '赵云',
                                'userstatus': 'invited',
                                'id': 2636,
                                'supervisor': 218,
                                'username': 'zhaoyun@vanke.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': '左培强',
                                'userstatus': 'expired',
                                'id': 2637,
                                'supervisor': 218,
                                'username': 'zuopeiq1@vanke.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                'userfullname': '陆培元',
                                'userstatus': 'registered',
                                'id': 2659,
                                'supervisor': 218,
                                'username': 'lu0111@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': '张春彬',
                                'userstatus': 'invited',
                                'id': 2688,
                                'supervisor': 218,
                                'username': 'zhangcb@vanke.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': '黄毅旻',
                                'userstatus': 'registered',
                                'id': 2689,
                                'supervisor': 218,
                                'username': 'huangym02@vanke.com'
                            },
                            {
                                'isManager': 1,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                'userfullname': '王兵',
                                'userstatus': 'invited',
                                'id': 3151,
                                'supervisor': 218,
                                'username': 'Harvey.Wang@cbre.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': '严洋',
                                'userstatus': 'registered',
                                'id': 3204,
                                'supervisor': 218,
                                'username': 'yang.yan@huawei.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                                'userfullname': '钱伟',
                                'userstatus': 'registered',
                                'id': 3205,
                                'supervisor': 218,
                                'username': 'qianwei@huawei.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                                'userfullname': '袁成伍',
                                'userstatus': 'invited',
                                'id': 3351,
                                'supervisor': 218,
                                'username': 'kobe.yuan@cbre.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': '石磊',
                                'userstatus': 'registered',
                                'id': 3641,
                                'supervisor': 218,
                                'username': 'lei.shi1@ikea.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                'userfullname': '程立光',
                                'userstatus': 'registered',
                                'id': 3642,
                                'supervisor': 218,
                                'username': 'liguang.cheng@ikea.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/23091671.png',
                                'userfullname': 'sherwin.li',
                                'userstatus': 'registered',
                                'id': 3684,
                                'supervisor': 218,
                                'username': 'sherwin.li'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': 'robin',
                        'userstatus': 'registered',
                        'id': 218,
                        'supervisor': 3283,
                        'username': 'robin.ru@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': 'teddy',
                        'userstatus': 'expired',
                        'id': 366,
                        'supervisor': 3283,
                        'username': 'teddy.zhu@rnbtech.com.hk'
                    },
                    {
                        'isManager': 1,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': 'scqunkong',
                        'userstatus': 'registered',
                        'id': 1096,
                        'supervisor': 3283,
                        'username': 'XU.xukai@huawei.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '深圳华为G区业主2',
                        'userstatus': 'expired',
                        'id': 1097,
                        'supervisor': 3283,
                        'username': '472225995@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '深圳华为G区业主3',
                        'userstatus': 'registered',
                        'id': 1098,
                        'supervisor': 3283,
                        'username': '451832850@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '玉兰大剧院业主',
                        'userstatus': 'registered',
                        'id': 1193,
                        'supervisor': 3283,
                        'username': '393565493@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '梁建柱',
                        'userstatus': 'registered',
                        'id': 1320,
                        'supervisor': 3283,
                        'username': 'tfszk@huawei.com'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 1,
                                'sub': [
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                        'userfullname': '华德能源推广号1',
                                        'userstatus': 'registered',
                                        'id': 1878,
                                        'supervisor': 1776,
                                        'username': 'huadenengyuan001@sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                        'userfullname': '华德能源推广号2',
                                        'userstatus': 'registered',
                                        'id': 1879,
                                        'supervisor': 1776,
                                        'username': 'huadenengyuan002@sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                        'userfullname': '华德能源推广号3',
                                        'userstatus': 'registered',
                                        'id': 1880,
                                        'supervisor': 1776,
                                        'username': 'huadenengyuan003@sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                        'userfullname': '华德能源推广号4',
                                        'userstatus': 'registered',
                                        'id': 1881,
                                        'supervisor': 1776,
                                        'username': 'huadenengyuan004@sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                        'userfullname': '谭荣华',
                                        'userstatus': 'registered',
                                        'id': 1882,
                                        'supervisor': 1776,
                                        'username': 'huadenengyuan005@sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                        'userfullname': '天津华迈邦德6',
                                        'userstatus': 'registered',
                                        'id': 1883,
                                        'supervisor': 1776,
                                        'username': 'huadenengyuan006@sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                        'userfullname': '天津华迈邦德7',
                                        'userstatus': 'registered',
                                        'id': 1884,
                                        'supervisor': 1776,
                                        'username': 'huadenengyuan007@sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': '天津华迈邦德8',
                                        'userstatus': 'registered',
                                        'id': 1885,
                                        'supervisor': 1776,
                                        'username': 'huadenengyuan008@sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                                        'userfullname': '天津华迈邦德9',
                                        'userstatus': 'registered',
                                        'id': 1886,
                                        'supervisor': 1776,
                                        'username': 'huadenengyuan009@sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                        'userfullname': '天津华迈邦德10',
                                        'userstatus': 'registered',
                                        'id': 1887,
                                        'supervisor': 1776,
                                        'username': 'huadenengyuan010@sina.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                        'userfullname': 'yatai023@126.com',
                                        'userstatus': 'registered',
                                        'id': 1888,
                                        'supervisor': 1776,
                                        'username': 'yatai023@126.com'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                        'userfullname': '1111143jrefol',
                                        'userstatus': 'registered',
                                        'id': 3585,
                                        'supervisor': 1776,
                                        'username': 'fnj8943jf'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                                        'userfullname': 'jfdkejfi',
                                        'userstatus': 'registered',
                                        'id': 3586,
                                        'supervisor': 1776,
                                        'username': '11111ngf9i4e'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                        'userfullname': 'jfd9843jt',
                                        'userstatus': 'registered',
                                        'id': 3587,
                                        'supervisor': 1776,
                                        'username': '222222h4389jrtf'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                        'userfullname': 'jfd9034jtrfo',
                                        'userstatus': 'registered',
                                        'id': 3588,
                                        'supervisor': 1776,
                                        'username': 'j9430jtfrek'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                        'userfullname': 'jfr9430',
                                        'userstatus': 'registered',
                                        'id': 3589,
                                        'supervisor': 1776,
                                        'username': 'jt4930jt'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                        'userfullname': 'hf8943hjrfeoi',
                                        'userstatus': 'registered',
                                        'id': 3590,
                                        'supervisor': 1776,
                                        'username': '1111hjr4893uj'
                                    },
                                    {
                                        'isManager': 0,
                                        'sub': [],
                                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                        'userfullname': 'fhn8439hjtroei',
                                        'userstatus': 'registered',
                                        'id': 3591,
                                        'supervisor': 1776,
                                        'username': '22222hfr89hjt'
                                    }
                                ],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': '1955308734',
                                'userstatus': 'registered',
                                'id': 1776,
                                'supervisor': 1464,
                                'username': '1955308734@qq.com'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '项目管理026',
                        'userstatus': 'registered',
                        'id': 1464,
                        'supervisor': 3283,
                        'username': '项目管理'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/26353765.JPG',
                        'userfullname': 'Catherine',
                        'userstatus': 'registered',
                        'id': 1630,
                        'supervisor': 3283,
                        'username': 'catherine.wang@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': 'ruilifeng',
                        'userstatus': 'registered',
                        'id': 1658,
                        'supervisor': 3283,
                        'username': '398010490@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '业主2',
                        'userstatus': 'registered',
                        'id': 1659,
                        'supervisor': 3283,
                        'username': '406195008@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '周总',
                        'userstatus': 'registered',
                        'id': 1768,
                        'supervisor': 3283,
                        'username': '18621369669@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '三环',
                        'userstatus': 'registered',
                        'id': 1805,
                        'supervisor': 3283,
                        'username': 'shanghaisanhuan@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '张颖',
                        'userstatus': 'invited',
                        'id': 2283,
                        'supervisor': 3283,
                        'username': 'zoezhang88@126.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': 'chenxiangbo',
                        'userstatus': 'registered',
                        'id': 2332,
                        'supervisor': 3283,
                        'username': '913963099@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '用户2',
                        'userstatus': 'expired',
                        'id': 2333,
                        'supervisor': 3283,
                        'username': '1280191705@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': 'liusong',
                        'userstatus': 'registered',
                        'id': 2334,
                        'supervisor': 3283,
                        'username': '583205035@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '创维业主',
                        'userstatus': 'registered',
                        'id': 2454,
                        'supervisor': 3283,
                        'username': 'szcwyf@126.com'
                    },
                    {
                        'isManager': 1,
                        'sub': [
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': '周忆祥',
                                'userstatus': 'registered',
                                'id': 2757,
                                'supervisor': 2474,
                                'username': 'zyx@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': '叶志荣',
                                'userstatus': 'registered',
                                'id': 2784,
                                'supervisor': 2474,
                                'username': 'yezhirong@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                'userfullname': '周志萍',
                                'userstatus': 'registered',
                                'id': 2785,
                                'supervisor': 2474,
                                'username': 'zhouzhiping@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': '乔火明',
                                'userstatus': 'registered',
                                'id': 2786,
                                'supervisor': 2474,
                                'username': 'qhm@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': '瞿亚明',
                                'userstatus': 'registered',
                                'id': 2787,
                                'supervisor': 2474,
                                'username': 'ray@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': '王丽丽',
                                'userstatus': 'registered',
                                'id': 2788,
                                'supervisor': 2474,
                                'username': 'wanglili@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                                'userfullname': '王蕊',
                                'userstatus': 'registered',
                                'id': 2789,
                                'supervisor': 2474,
                                'username': 'wangrui@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                'userfullname': '胡亦忠',
                                'userstatus': 'registered',
                                'id': 2790,
                                'supervisor': 2474,
                                'username': 'hyz@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                                'userfullname': '周名车',
                                'userstatus': 'registered',
                                'id': 2791,
                                'supervisor': 2474,
                                'username': 'zhoumingche@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': '刘惠明',
                                'userstatus': 'invited',
                                'id': 2792,
                                'supervisor': 2474,
                                'username': 'liuhuiming@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': '闫俊伟',
                                'userstatus': 'registered',
                                'id': 2793,
                                'supervisor': 2474,
                                'username': 'yanjunwei@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                'userfullname': '保安部',
                                'userstatus': 'registered',
                                'id': 2797,
                                'supervisor': 2474,
                                'username': 'sml@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                                'userfullname': 'xinge521',
                                'userstatus': 'registered',
                                'id': 2798,
                                'supervisor': 2474,
                                'username': 'xinge521_ai@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                'userfullname': '陈高源',
                                'userstatus': 'registered',
                                'id': 2801,
                                'supervisor': 2474,
                                'username': 'chengaoyuan@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                'userfullname': '益飞',
                                'userstatus': 'registered',
                                'id': 2802,
                                'supervisor': 2474,
                                'username': 'yyyifei2@163.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                                'userfullname': '冯婷',
                                'userstatus': 'registered',
                                'id': 2803,
                                'supervisor': 2474,
                                'username': 'fengting@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                'userfullname': '瞿佳',
                                'userstatus': 'registered',
                                'id': 2804,
                                'supervisor': 2474,
                                'username': 'qujia@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': '伍海辉',
                                'userstatus': 'registered',
                                'id': 2805,
                                'supervisor': 2474,
                                'username': 'wuhaihui@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                                'userfullname': '应立中',
                                'userstatus': 'invited',
                                'id': 2806,
                                'supervisor': 2474,
                                'username': 'lizhongy@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': '唐佩英',
                                'userstatus': 'invited',
                                'id': 2807,
                                'supervisor': 2474,
                                'username': 'hr@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                                'userfullname': '范雷',
                                'userstatus': 'registered',
                                'id': 2808,
                                'supervisor': 2474,
                                'username': 'fanlei@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                                'userfullname': '梁启敏',
                                'userstatus': 'registered',
                                'id': 2809,
                                'supervisor': 2474,
                                'username': 'lqm@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                'userfullname': '陆军',
                                'userstatus': 'invited',
                                'id': 2810,
                                'supervisor': 2474,
                                'username': 'lujun@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': '计波',
                                'userstatus': 'registered',
                                'id': 2811,
                                'supervisor': 2474,
                                'username': 'jibo@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                                'userfullname': '王超',
                                'userstatus': 'registered',
                                'id': 2812,
                                'supervisor': 2474,
                                'username': 'wangchao@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': '姚军',
                                'userstatus': 'invited',
                                'id': 2813,
                                'supervisor': 2474,
                                'username': 'yaojun2@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                'userfullname': '谭清',
                                'userstatus': 'registered',
                                'id': 2814,
                                'supervisor': 2474,
                                'username': 'tanqing@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                                'userfullname': '王爱明',
                                'userstatus': 'registered',
                                'id': 2815,
                                'supervisor': 2474,
                                'username': 'alanwang@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                                'userfullname': '梁兴',
                                'userstatus': 'registered',
                                'id': 2816,
                                'supervisor': 2474,
                                'username': '2851132003@qq.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                                'userfullname': '陶雄翔',
                                'userstatus': 'registered',
                                'id': 2817,
                                'supervisor': 2474,
                                'username': 'david.tao@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                                'userfullname': '邵戎',
                                'userstatus': 'registered',
                                'id': 2818,
                                'supervisor': 2474,
                                'username': 'shaorong@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': '李旭鹏',
                                'userstatus': 'registered',
                                'id': 2819,
                                'supervisor': 2474,
                                'username': 'lixupeng@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                                'userfullname': '刘同',
                                'userstatus': 'registered',
                                'id': 2820,
                                'supervisor': 2474,
                                'username': 'liutong@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                                'userfullname': '胡继东',
                                'userstatus': 'registered',
                                'id': 2821,
                                'supervisor': 2474,
                                'username': 'hjd@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': '陈玉兵',
                                'userstatus': 'registered',
                                'id': 2822,
                                'supervisor': 2474,
                                'username': 'chenyubing@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                                'userfullname': '邹雷',
                                'userstatus': 'registered',
                                'id': 2823,
                                'supervisor': 2474,
                                'username': 'zoulei@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                                'userfullname': '曹林',
                                'userstatus': 'registered',
                                'id': 2824,
                                'supervisor': 2474,
                                'username': 'caolin@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                                'userfullname': '袁同斌',
                                'userstatus': 'invited',
                                'id': 2826,
                                'supervisor': 2474,
                                'username': 'yuantongbin@canature.com'
                            },
                            {
                                'isManager': 0,
                                'sub': [],
                                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                                'userfullname': 'sjj',
                                'userstatus': 'registered',
                                'id': 3747,
                                'supervisor': 2474,
                                'username': 'sjj'
                            }
                        ],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '苏经理',
                        'userstatus': 'registered',
                        'id': 2474,
                        'supervisor': 3283,
                        'username': 'sushenghui@canature.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '汪演示',
                        'userstatus': 'registered',
                        'id': 2618,
                        'supervisor': 3283,
                        'username': 'yinglove0311@126.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '谢经理',
                        'userstatus': 'invited',
                        'id': 2627,
                        'supervisor': 3283,
                        'username': 'mqxie@shpl.com.cn'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '叶枫',
                        'userstatus': 'invited',
                        'id': 2628,
                        'supervisor': 3283,
                        'username': 'chris@shpl.com.cn'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '谢敏琴',
                        'userstatus': 'registered',
                        'id': 2638,
                        'supervisor': 3283,
                        'username': 'xieminqin@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': '肖程',
                        'userstatus': 'registered',
                        'id': 2639,
                        'supervisor': 3283,
                        'username': 'deject121@126.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '蔡元鑫',
                        'userstatus': 'registered',
                        'id': 2640,
                        'supervisor': 3283,
                        'username': 'chimp21152@126.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '岳镭',
                        'userstatus': 'registered',
                        'id': 2641,
                        'supervisor': 3283,
                        'username': 'yueleiyuelei@hotmail.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '钱国华',
                        'userstatus': 'registered',
                        'id': 2651,
                        'supervisor': 3283,
                        'username': 'qiangh2010@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '孙跃',
                        'userstatus': 'invited',
                        'id': 2652,
                        'supervisor': 3283,
                        'username': 'sunyue@shpl.com.cn'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '叶枫',
                        'userstatus': 'registered',
                        'id': 2653,
                        'supervisor': 3283,
                        'username': 'momiji_0930@126.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '孙悦',
                        'userstatus': 'invited',
                        'id': 2660,
                        'supervisor': 3283,
                        'username': 'taojun1220@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '刘献阳',
                        'userstatus': 'registered',
                        'id': 2661,
                        'supervisor': 3283,
                        'username': 'xyliu@shpl.com.cn'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '左斌',
                        'userstatus': 'registered',
                        'id': 2662,
                        'supervisor': 3283,
                        'username': 'bzuo@shpl.com.cn'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '陶金',
                        'userstatus': 'registered',
                        'id': 2663,
                        'supervisor': 3283,
                        'username': 'taojin@shpl.com.cn'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '平静芝',
                        'userstatus': 'expired',
                        'id': 2664,
                        'supervisor': 3283,
                        'username': 'pingingblue@126.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': '平静芝',
                        'userstatus': 'registered',
                        'id': 2666,
                        'supervisor': 3283,
                        'username': 'pingjingblue@126.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '变频维修部',
                        'userstatus': 'registered',
                        'id': 2671,
                        'supervisor': 3283,
                        'username': '898579642@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': '杜鲁辉',
                        'userstatus': 'registered',
                        'id': 2675,
                        'supervisor': 3283,
                        'username': 'duluhui3@gmail.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '华建江',
                        'userstatus': 'expired',
                        'id': 2687,
                        'supervisor': 3283,
                        'username': 'huajj01@vanke.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '颜描星',
                        'userstatus': 'invited',
                        'id': 2699,
                        'supervisor': 3283,
                        'username': '353549754@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '蒋婉娟',
                        'userstatus': 'registered',
                        'id': 2700,
                        'supervisor': 3283,
                        'username': '1751145239@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '孙跃',
                        'userstatus': 'registered',
                        'id': 2709,
                        'supervisor': 3283,
                        'username': '13916987925@163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明中一区',
                        'userstatus': 'registered',
                        'id': 2711,
                        'supervisor': 3283,
                        'username': 'yy02pg@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明中二区',
                        'userstatus': 'registered',
                        'id': 2712,
                        'supervisor': 3283,
                        'username': 'panyi1@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明东郊区',
                        'userstatus': 'registered',
                        'id': 2713,
                        'supervisor': 3283,
                        'username': 'liweibing@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': '光明管理员',
                        'userstatus': 'registered',
                        'id': 2714,
                        'supervisor': 3283,
                        'username': 'lizhenhong@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '俞增',
                        'userstatus': 'expired',
                        'id': 2716,
                        'supervisor': 3283,
                        'username': '49771158@a.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': '俞增',
                        'userstatus': 'registered',
                        'id': 2717,
                        'supervisor': 3283,
                        'username': '49771158@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '光明静安常德块',
                        'userstatus': 'registered',
                        'id': 2721,
                        'supervisor': 3283,
                        'username': 'zqnz_cd@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明静安胶愚块',
                        'userstatus': 'registered',
                        'id': 2722,
                        'supervisor': 3283,
                        'username': 'zqnz_jy@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明静安泰兴块',
                        'userstatus': 'registered',
                        'id': 2723,
                        'supervisor': 3283,
                        'username': 'zqnz_tx@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': '光明静安武定块',
                        'userstatus': 'registered',
                        'id': 2724,
                        'supervisor': 3283,
                        'username': 'zqnz_wd@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明静安西康块',
                        'userstatus': 'registered',
                        'id': 2725,
                        'supervisor': 3283,
                        'username': 'zqnz_xk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': '光明静安余姚块',
                        'userstatus': 'registered',
                        'id': 2726,
                        'supervisor': 3283,
                        'username': 'zqnz_yy@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明卢湾合肥块',
                        'userstatus': 'registered',
                        'id': 2727,
                        'supervisor': 3283,
                        'username': 'zqnz_hf@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明卢湾淡水块',
                        'userstatus': 'registered',
                        'id': 2728,
                        'supervisor': 3283,
                        'username': 'zqnz_ds@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明黄浦方斜块',
                        'userstatus': 'registered',
                        'id': 2729,
                        'supervisor': 3283,
                        'username': 'zqnz_fx@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明黄浦黄陂块',
                        'userstatus': 'registered',
                        'id': 2730,
                        'supervisor': 3283,
                        'username': 'zqnz_hp@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明卢湾鲁浦块',
                        'userstatus': 'registered',
                        'id': 2731,
                        'supervisor': 3283,
                        'username': 'zqnz_lp@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明卢湾蒙西块',
                        'userstatus': 'registered',
                        'id': 2732,
                        'supervisor': 3283,
                        'username': 'zqnz_mx@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明卢湾绍兴块',
                        'userstatus': 'registered',
                        'id': 2733,
                        'supervisor': 3283,
                        'username': 'zqnz_sx@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明黄浦白渡块',
                        'userstatus': 'registered',
                        'id': 2734,
                        'supervisor': 3283,
                        'username': 'zqnz_bd@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明黄浦普育块',
                        'userstatus': 'registered',
                        'id': 2735,
                        'supervisor': 3283,
                        'username': 'zqnz_py@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明黄浦河南块',
                        'userstatus': 'registered',
                        'id': 2736,
                        'supervisor': 3283,
                        'username': 'zqnz_hn@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明黄浦北京块',
                        'userstatus': 'registered',
                        'id': 2737,
                        'supervisor': 3283,
                        'username': 'zqnz_bj@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明黄浦西藏块',
                        'userstatus': 'registered',
                        'id': 2738,
                        'supervisor': 3283,
                        'username': 'zqnz_xz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明南区',
                        'userstatus': 'registered',
                        'id': 2748,
                        'supervisor': 3283,
                        'username': 'jiangqiang@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明北区',
                        'userstatus': 'registered',
                        'id': 2749,
                        'supervisor': 3283,
                        'username': 'yuyulan@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明北郊区',
                        'userstatus': 'registered',
                        'id': 2750,
                        'supervisor': 3283,
                        'username': 'beijiao@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明东区',
                        'userstatus': 'registered',
                        'id': 2751,
                        'supervisor': 3283,
                        'username': 'zhoujiayuan@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明嘉定区',
                        'userstatus': 'registered',
                        'id': 2752,
                        'supervisor': 3283,
                        'username': 'jdnq@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明松江区',
                        'userstatus': 'registered',
                        'id': 2753,
                        'supervisor': 3283,
                        'username': 'yy08@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明青浦区',
                        'userstatus': 'registered',
                        'id': 2754,
                        'supervisor': 3283,
                        'username': 'lihc@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '光明西区',
                        'userstatus': 'registered',
                        'id': 2755,
                        'supervisor': 3283,
                        'username': 'guoyuezhi@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明长宁程桥块',
                        'userstatus': 'registered',
                        'id': 2758,
                        'supervisor': 3283,
                        'username': 'zqnz_cq@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明长宁东浜块',
                        'userstatus': 'registered',
                        'id': 2759,
                        'supervisor': 3283,
                        'username': 'zqnz_db@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明长宁法镇块',
                        'userstatus': 'registered',
                        'id': 2760,
                        'supervisor': 3283,
                        'username': 'zqnz_fz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明长宁娄山块',
                        'userstatus': 'registered',
                        'id': 2761,
                        'supervisor': 3283,
                        'username': 'zqnz_ls@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明长宁清池块',
                        'userstatus': 'registered',
                        'id': 2762,
                        'supervisor': 3283,
                        'username': 'zqnz_qc@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明长宁三角块',
                        'userstatus': 'registered',
                        'id': 2763,
                        'supervisor': 3283,
                        'username': 'zqnz_sj@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明长宁水城块',
                        'userstatus': 'registered',
                        'id': 2764,
                        'supervisor': 3283,
                        'username': 'zqnz_sc@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明长宁万航块',
                        'userstatus': 'registered',
                        'id': 2765,
                        'supervisor': 3283,
                        'username': 'zqnz_wh@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '光明长宁威宁块',
                        'userstatus': 'registered',
                        'id': 2766,
                        'supervisor': 3283,
                        'username': 'zqnz_wn@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明长宁新泾块',
                        'userstatus': 'registered',
                        'id': 2767,
                        'supervisor': 3283,
                        'username': 'zqnz_xj@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明长宁昭化块',
                        'userstatus': 'registered',
                        'id': 2768,
                        'supervisor': 3283,
                        'username': 'zqnz_zh@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明徐汇漕溪块',
                        'userstatus': 'registered',
                        'id': 2769,
                        'supervisor': 3283,
                        'username': 'zqnz_cx@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '光明徐汇长桥块',
                        'userstatus': 'registered',
                        'id': 2770,
                        'supervisor': 3283,
                        'username': 'zqnz_changq@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': '光明徐汇东安块',
                        'userstatus': 'registered',
                        'id': 2771,
                        'supervisor': 3283,
                        'username': 'zqnz_da@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明徐汇港口块',
                        'userstatus': 'registered',
                        'id': 2772,
                        'supervisor': 3283,
                        'username': 'zqnz_gk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明徐汇广元块',
                        'userstatus': 'registered',
                        'id': 2773,
                        'supervisor': 3283,
                        'username': 'zqnz_gy@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明徐汇嘉善块',
                        'userstatus': 'registered',
                        'id': 2774,
                        'supervisor': 3283,
                        'username': 'zqnz_js@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明徐汇康健块',
                        'userstatus': 'registered',
                        'id': 2775,
                        'supervisor': 3283,
                        'username': 'zqnz_kj@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明徐汇凌云块',
                        'userstatus': 'registered',
                        'id': 2776,
                        'supervisor': 3283,
                        'username': 'zqnz_ly@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明徐汇龙南块',
                        'userstatus': 'registered',
                        'id': 2777,
                        'supervisor': 3283,
                        'username': 'zqnz_ln@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明徐汇石龙块',
                        'userstatus': 'registered',
                        'id': 2778,
                        'supervisor': 3283,
                        'username': 'zqnz_sl@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明徐汇田林块',
                        'userstatus': 'registered',
                        'id': 2779,
                        'supervisor': 3283,
                        'username': 'zqnz_tl@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明徐汇宛平块',
                        'userstatus': 'registered',
                        'id': 2780,
                        'supervisor': 3283,
                        'username': 'zqnz_wp@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': '光明徐汇徐浦块',
                        'userstatus': 'registered',
                        'id': 2781,
                        'supervisor': 3283,
                        'username': 'zqnz_xp@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': '光明徐汇永乌块',
                        'userstatus': 'registered',
                        'id': 2782,
                        'supervisor': 3283,
                        'username': 'zqnz_yw@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明徐汇中山块',
                        'userstatus': 'registered',
                        'id': 2783,
                        'supervisor': 3283,
                        'username': 'zqnz_zs@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': 'amksza',
                        'userstatus': 'invited',
                        'id': 2800,
                        'supervisor': 3283,
                        'username': 'amksza@huawei.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明常州区',
                        'userstatus': 'registered',
                        'id': 2825,
                        'supervisor': 3283,
                        'username': 'czyyb@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明南区龙柏块',
                        'userstatus': 'registered',
                        'id': 2827,
                        'supervisor': 3283,
                        'username': 'nq_longbai@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明南区航华块',
                        'userstatus': 'registered',
                        'id': 2828,
                        'supervisor': 3283,
                        'username': 'nq_hanghua@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '光明南区诸翟块',
                        'userstatus': 'registered',
                        'id': 2829,
                        'supervisor': 3283,
                        'username': 'nq_zhudi@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明南区七宝块',
                        'userstatus': 'registered',
                        'id': 2830,
                        'supervisor': 3283,
                        'username': 'nq_qibao@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明南区虹桥块',
                        'userstatus': 'registered',
                        'id': 2831,
                        'supervisor': 3283,
                        'username': 'nq_hongqiao@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明南区华漕块',
                        'userstatus': 'registered',
                        'id': 2832,
                        'supervisor': 3283,
                        'username': 'nq_huacao@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明南区纪王块',
                        'userstatus': 'registered',
                        'id': 2833,
                        'supervisor': 3283,
                        'username': 'nq_jiwang@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明南区静城块',
                        'userstatus': 'registered',
                        'id': 2834,
                        'supervisor': 3283,
                        'username': 'nq_jingcheng@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明南区南方块',
                        'userstatus': 'registered',
                        'id': 2835,
                        'supervisor': 3283,
                        'username': 'nq_nanfang@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': '光明南区平南块',
                        'userstatus': 'registered',
                        'id': 2836,
                        'supervisor': 3283,
                        'username': 'nq_pingnan@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明南区梅陇块',
                        'userstatus': 'registered',
                        'id': 2837,
                        'supervisor': 3283,
                        'username': 'nq_meilongi@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明南区报春块',
                        'userstatus': 'registered',
                        'id': 2838,
                        'supervisor': 3283,
                        'username': 'nq_baochun@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明南区颛马块',
                        'userstatus': 'registered',
                        'id': 2839,
                        'supervisor': 3283,
                        'username': 'nq_zhuanma@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明南区莲花块',
                        'userstatus': 'registered',
                        'id': 2840,
                        'supervisor': 3283,
                        'username': 'nq_lianhua@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明南区马桥块',
                        'userstatus': 'registered',
                        'id': 2841,
                        'supervisor': 3283,
                        'username': 'nq_maqiao@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明南区北桥块',
                        'userstatus': 'registered',
                        'id': 2842,
                        'supervisor': 3283,
                        'username': 'nq_beiqiao@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明南区碧江块',
                        'userstatus': 'registered',
                        'id': 2843,
                        'supervisor': 3283,
                        'username': 'nq_bijiang@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '光明南区华坪块',
                        'userstatus': 'registered',
                        'id': 2844,
                        'supervisor': 3283,
                        'username': 'nq_huaping@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明南区浦江块',
                        'userstatus': 'registered',
                        'id': 2845,
                        'supervisor': 3283,
                        'username': 'nq_pujing@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明南区江榉块',
                        'userstatus': 'registered',
                        'id': 2846,
                        'supervisor': 3283,
                        'username': 'nq_jiangjue@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '光明南区江文块',
                        'userstatus': 'registered',
                        'id': 2847,
                        'supervisor': 3283,
                        'username': 'nq_jiangwen@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明南区鲁汇块',
                        'userstatus': 'registered',
                        'id': 2848,
                        'supervisor': 3283,
                        'username': 'nq_luhui@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明南区吴泾块',
                        'userstatus': 'registered',
                        'id': 2849,
                        'supervisor': 3283,
                        'username': 'nq_wujing@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': '光明东区顾路块',
                        'userstatus': 'registered',
                        'id': 2851,
                        'supervisor': 3283,
                        'username': 'dq_glk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明东区沪东块',
                        'userstatus': 'registered',
                        'id': 2852,
                        'supervisor': 3283,
                        'username': 'dq_hdk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明东区金鹏块',
                        'userstatus': 'registered',
                        'id': 2853,
                        'supervisor': 3283,
                        'username': 'dq_jpk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明东区浦兴块',
                        'userstatus': 'registered',
                        'id': 2854,
                        'supervisor': 3283,
                        'username': 'dq_pxk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明东区集行块',
                        'userstatus': 'registered',
                        'id': 2855,
                        'supervisor': 3283,
                        'username': 'dq_jhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明东区顾三块',
                        'userstatus': 'registered',
                        'id': 2856,
                        'supervisor': 3283,
                        'username': 'dq_gsk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明东区江镇块',
                        'userstatus': 'registered',
                        'id': 2857,
                        'supervisor': 3283,
                        'username': 'dq_jzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明东区六团块',
                        'userstatus': 'registered',
                        'id': 2858,
                        'supervisor': 3283,
                        'username': 'dq_ltk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明东区蔡路块',
                        'userstatus': 'registered',
                        'id': 2859,
                        'supervisor': 3283,
                        'username': 'dq_clk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明东区川沙块',
                        'userstatus': 'registered',
                        'id': 2860,
                        'supervisor': 3283,
                        'username': 'dq_chsk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明东区合庆块',
                        'userstatus': 'registered',
                        'id': 2861,
                        'supervisor': 3283,
                        'username': 'dq_hqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明东区王港块',
                        'userstatus': 'registered',
                        'id': 2862,
                        'supervisor': 3283,
                        'username': 'dq_wgk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明东区前哨块',
                        'userstatus': 'registered',
                        'id': 2863,
                        'supervisor': 3283,
                        'username': 'dq_qshk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '光明东区张江块',
                        'userstatus': 'registered',
                        'id': 2864,
                        'supervisor': 3283,
                        'username': 'dq_zhjk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明东区孙桥块',
                        'userstatus': 'registered',
                        'id': 2865,
                        'supervisor': 3283,
                        'username': 'dq_sqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明东区迪斯尼块',
                        'userstatus': 'registered',
                        'id': 2866,
                        'supervisor': 3283,
                        'username': 'dq_dsn@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明东区民生块',
                        'userstatus': 'registered',
                        'id': 2867,
                        'supervisor': 3283,
                        'username': 'dq_msk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明东区万德块',
                        'userstatus': 'registered',
                        'id': 2868,
                        'supervisor': 3283,
                        'username': 'dq_wdk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明东区枣庄块',
                        'userstatus': 'registered',
                        'id': 2869,
                        'supervisor': 3283,
                        'username': 'dq_zzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明东区金桥块',
                        'userstatus': 'registered',
                        'id': 2870,
                        'supervisor': 3283,
                        'username': 'dq_jqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明东区桃林块',
                        'userstatus': 'registered',
                        'id': 2871,
                        'supervisor': 3283,
                        'username': 'dq_tlk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明东区罗山块',
                        'userstatus': 'registered',
                        'id': 2872,
                        'supervisor': 3283,
                        'username': 'dq_lsk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': '光明东区锦绣块',
                        'userstatus': 'registered',
                        'id': 2873,
                        'supervisor': 3283,
                        'username': 'dq_jxk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明东区南码头块',
                        'userstatus': 'registered',
                        'id': 2874,
                        'supervisor': 3283,
                        'username': 'dq_nmtk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明东区商城块',
                        'userstatus': 'registered',
                        'id': 2875,
                        'supervisor': 3283,
                        'username': 'dq_shck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明东区潍坊块',
                        'userstatus': 'registered',
                        'id': 2876,
                        'supervisor': 3283,
                        'username': 'dq_wfk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '光明东区塘桥块',
                        'userstatus': 'registered',
                        'id': 2877,
                        'supervisor': 3283,
                        'username': 'dq_tqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明东区严桥块',
                        'userstatus': 'registered',
                        'id': 2878,
                        'supervisor': 3283,
                        'username': 'dq_yqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '光明东区上钢块',
                        'userstatus': 'registered',
                        'id': 2879,
                        'supervisor': 3283,
                        'username': 'dq_sgk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明东区杨思块',
                        'userstatus': 'registered',
                        'id': 2880,
                        'supervisor': 3283,
                        'username': 'dq_ysk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明东区济阳块',
                        'userstatus': 'registered',
                        'id': 2881,
                        'supervisor': 3283,
                        'username': 'dq_jyk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '光明东区上浦块',
                        'userstatus': 'registered',
                        'id': 2882,
                        'supervisor': 3283,
                        'username': 'dq_spk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': '光明东区林恒块',
                        'userstatus': 'registered',
                        'id': 2883,
                        'supervisor': 3283,
                        'username': 'dq_lhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明东区三林块',
                        'userstatus': 'registered',
                        'id': 2884,
                        'supervisor': 3283,
                        'username': 'dq_slk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明东区永泰块',
                        'userstatus': 'registered',
                        'id': 2885,
                        'supervisor': 3283,
                        'username': 'dq_ytk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明东区北蔡块',
                        'userstatus': 'registered',
                        'id': 2886,
                        'supervisor': 3283,
                        'username': 'dq_bck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明东区六里块',
                        'userstatus': 'registered',
                        'id': 2887,
                        'supervisor': 3283,
                        'username': 'dq_llk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明东区下南块',
                        'userstatus': 'registered',
                        'id': 2888,
                        'supervisor': 3283,
                        'username': 'dq_xnk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': '光明东区上南块',
                        'userstatus': 'registered',
                        'id': 2889,
                        'supervisor': 3283,
                        'username': 'dq_snk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明东区花木块',
                        'userstatus': 'registered',
                        'id': 2890,
                        'supervisor': 3283,
                        'username': 'dq_hmk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明东区齐河块',
                        'userstatus': 'registered',
                        'id': 2891,
                        'supervisor': 3283,
                        'username': 'dq_qhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明东区高桥块',
                        'userstatus': 'registered',
                        'id': 2892,
                        'supervisor': 3283,
                        'username': 'dq_gqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明东区高南块',
                        'userstatus': 'registered',
                        'id': 2893,
                        'supervisor': 3283,
                        'username': 'dq_gnk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明东区凌桥块',
                        'userstatus': 'registered',
                        'id': 2894,
                        'supervisor': 3283,
                        'username': 'dq_lqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明东区高东块',
                        'userstatus': 'registered',
                        'id': 2895,
                        'supervisor': 3283,
                        'username': 'dq_gdk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': '光明东区杨园块',
                        'userstatus': 'registered',
                        'id': 2896,
                        'supervisor': 3283,
                        'username': 'dq_yyk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明东区东沟块',
                        'userstatus': 'registered',
                        'id': 2897,
                        'supervisor': 3283,
                        'username': 'dq_dgk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': '光明西区甘泉块',
                        'userstatus': 'registered',
                        'id': 2898,
                        'supervisor': 3283,
                        'username': 'xq_gqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明西区延长块',
                        'userstatus': 'registered',
                        'id': 2899,
                        'supervisor': 3283,
                        'username': 'xq_yck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '光明西区万里块',
                        'userstatus': 'registered',
                        'id': 2900,
                        'supervisor': 3283,
                        'username': 'xq_wlk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明西区子长块',
                        'userstatus': 'registered',
                        'id': 2901,
                        'supervisor': 3283,
                        'username': 'xq_zck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明西区武威块',
                        'userstatus': 'registered',
                        'id': 2902,
                        'supervisor': 3283,
                        'username': 'xq_wwk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明西区石泉块',
                        'userstatus': 'registered',
                        'id': 2903,
                        'supervisor': 3283,
                        'username': 'xq_sqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明西区中宁块',
                        'userstatus': 'registered',
                        'id': 2904,
                        'supervisor': 3283,
                        'username': 'xq_znk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明西区铜川块',
                        'userstatus': 'registered',
                        'id': 2905,
                        'supervisor': 3283,
                        'username': 'xq_tck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明西区真北块',
                        'userstatus': 'registered',
                        'id': 2906,
                        'supervisor': 3283,
                        'username': 'xq_zbk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明西区梅岭块',
                        'userstatus': 'registered',
                        'id': 2907,
                        'supervisor': 3283,
                        'username': 'xq_mlk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明西区宁夏块',
                        'userstatus': 'registered',
                        'id': 2908,
                        'supervisor': 3283,
                        'username': 'xq_nxk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明西区柳青块',
                        'userstatus': 'registered',
                        'id': 2909,
                        'supervisor': 3283,
                        'username': 'xq_lqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明西区长寿块',
                        'userstatus': 'registered',
                        'id': 2910,
                        'supervisor': 3283,
                        'username': 'xq_csk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明西区东淡块',
                        'userstatus': 'registered',
                        'id': 2911,
                        'supervisor': 3283,
                        'username': 'xq_ddk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明西区大渡块',
                        'userstatus': 'registered',
                        'id': 2912,
                        'supervisor': 3283,
                        'username': 'xq_dadk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明西区真新块',
                        'userstatus': 'registered',
                        'id': 2913,
                        'supervisor': 3283,
                        'username': 'xq_zhxk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明西区东旺块',
                        'userstatus': 'registered',
                        'id': 2914,
                        'supervisor': 3283,
                        'username': 'xq_dwk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明西区昆仑块',
                        'userstatus': 'registered',
                        'id': 2915,
                        'supervisor': 3283,
                        'username': 'xq_klk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明西区江桥块',
                        'userstatus': 'registered',
                        'id': 2916,
                        'supervisor': 3283,
                        'username': 'xq_jqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明西区同普块',
                        'userstatus': 'registered',
                        'id': 2917,
                        'supervisor': 3283,
                        'username': 'xq_tpk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明西区封浜块',
                        'userstatus': 'registered',
                        'id': 2918,
                        'supervisor': 3283,
                        'username': 'xq_fbk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明西区岭南块',
                        'userstatus': 'registered',
                        'id': 2919,
                        'supervisor': 3283,
                        'username': 'xq_lnk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明西区广茂块',
                        'userstatus': 'registered',
                        'id': 2920,
                        'supervisor': 3283,
                        'username': 'xq_gmk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明西区中营块',
                        'userstatus': 'registered',
                        'id': 2921,
                        'supervisor': 3283,
                        'username': 'xq_zhyk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明西区闻喜块',
                        'userstatus': 'registered',
                        'id': 2922,
                        'supervisor': 3283,
                        'username': 'xq_wxk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': '光明西区平顺块',
                        'userstatus': 'registered',
                        'id': 2923,
                        'supervisor': 3283,
                        'username': 'xq_psk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明西区永和块',
                        'userstatus': 'registered',
                        'id': 2924,
                        'supervisor': 3283,
                        'username': 'xq_yhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明西区和田块',
                        'userstatus': 'registered',
                        'id': 2925,
                        'supervisor': 3283,
                        'username': 'xq_htk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明西区永平块',
                        'userstatus': 'registered',
                        'id': 2926,
                        'supervisor': 3283,
                        'username': 'xq_ypk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': '光明西区天目块',
                        'userstatus': 'registered',
                        'id': 2927,
                        'supervisor': 3283,
                        'username': 'xq_tmk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明北区玉田',
                        'userstatus': 'registered',
                        'id': 2928,
                        'supervisor': 3283,
                        'username': 'bq_ytk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明北区广二',
                        'userstatus': 'registered',
                        'id': 2929,
                        'supervisor': 3283,
                        'username': 'bq_gek@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明北区广粤',
                        'userstatus': 'registered',
                        'id': 2930,
                        'supervisor': 3283,
                        'username': 'bq_gyk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '光明北区海虹',
                        'userstatus': 'registered',
                        'id': 2931,
                        'supervisor': 3283,
                        'username': 'bq_hhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明北区车站',
                        'userstatus': 'registered',
                        'id': 2932,
                        'supervisor': 3283,
                        'username': 'bq_czk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明北区新市',
                        'userstatus': 'registered',
                        'id': 2933,
                        'supervisor': 3283,
                        'username': 'bq_xsk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '光明北区新四川北',
                        'userstatus': 'registered',
                        'id': 2934,
                        'supervisor': 3283,
                        'username': 'bq_xsck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': '光明北区乍浦',
                        'userstatus': 'registered',
                        'id': 2935,
                        'supervisor': 3283,
                        'username': 'bq_zpk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '光明北区新港',
                        'userstatus': 'registered',
                        'id': 2936,
                        'supervisor': 3283,
                        'username': 'bq_xgk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明北区提篮',
                        'userstatus': 'registered',
                        'id': 2937,
                        'supervisor': 3283,
                        'username': 'bianzhihui@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明北区嘉兴',
                        'userstatus': 'registered',
                        'id': 2938,
                        'supervisor': 3283,
                        'username': 'bq_gxk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明北区欧阳',
                        'userstatus': 'registered',
                        'id': 2939,
                        'supervisor': 3283,
                        'username': 'bq_oyk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明北区密云',
                        'userstatus': 'registered',
                        'id': 2940,
                        'supervisor': 3283,
                        'username': 'bq_myk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明北区包头',
                        'userstatus': 'registered',
                        'id': 2941,
                        'supervisor': 3283,
                        'username': 'bq_btk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明北区工农',
                        'userstatus': 'registered',
                        'id': 2942,
                        'supervisor': 3283,
                        'username': 'bq_gnk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明北区中原',
                        'userstatus': 'registered',
                        'id': 2943,
                        'supervisor': 3283,
                        'username': 'bq_zyk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明北区政立',
                        'userstatus': 'registered',
                        'id': 2944,
                        'supervisor': 3283,
                        'username': 'bq_zlk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '光明北区政通',
                        'userstatus': 'registered',
                        'id': 2945,
                        'supervisor': 3283,
                        'username': 'bq_ztk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': '光明北区世界',
                        'userstatus': 'registered',
                        'id': 2946,
                        'supervisor': 3283,
                        'username': 'bq_shjk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明北区市光',
                        'userstatus': 'registered',
                        'id': 2947,
                        'supervisor': 3283,
                        'username': 'bq_shgk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': '光明北区许昌',
                        'userstatus': 'registered',
                        'id': 2948,
                        'supervisor': 3283,
                        'username': 'bq_xck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': '光明北区政本',
                        'userstatus': 'registered',
                        'id': 2949,
                        'supervisor': 3283,
                        'username': 'bq_zhbk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明北区鞍山',
                        'userstatus': 'registered',
                        'id': 2950,
                        'supervisor': 3283,
                        'username': 'bq_ansk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明北区飞虹',
                        'userstatus': 'registered',
                        'id': 2951,
                        'supervisor': 3283,
                        'username': 'bq_fhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明北区凤城',
                        'userstatus': 'registered',
                        'id': 2952,
                        'supervisor': 3283,
                        'username': 'bq_fchk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明北区双阳',
                        'userstatus': 'registered',
                        'id': 2953,
                        'supervisor': 3283,
                        'username': 'bq_shyk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明北区复旦',
                        'userstatus': 'registered',
                        'id': 2954,
                        'supervisor': 3283,
                        'username': 'bq_fdk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明北区宁国',
                        'userstatus': 'registered',
                        'id': 2955,
                        'supervisor': 3283,
                        'username': 'bq_ngk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明北区定海',
                        'userstatus': 'registered',
                        'id': 2956,
                        'supervisor': 3283,
                        'username': 'bq_dhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明北区内江',
                        'userstatus': 'registered',
                        'id': 2957,
                        'supervisor': 3283,
                        'username': 'bq_njk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明北区辽源',
                        'userstatus': 'registered',
                        'id': 2958,
                        'supervisor': 3283,
                        'username': 'bq_lyk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': '光明北区黄兴',
                        'userstatus': 'registered',
                        'id': 2959,
                        'supervisor': 3283,
                        'username': 'bq_hxk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明北区隆杭',
                        'userstatus': 'registered',
                        'id': 2960,
                        'supervisor': 3283,
                        'username': 'bq_lhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明青浦区凤溪块',
                        'userstatus': 'registered',
                        'id': 2961,
                        'supervisor': 3283,
                        'username': 'qp_fxk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明青浦区华新块',
                        'userstatus': 'registered',
                        'id': 2962,
                        'supervisor': 3283,
                        'username': 'qp_hxk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明青浦区赵巷块',
                        'userstatus': 'registered',
                        'id': 2963,
                        'supervisor': 3283,
                        'username': 'qp_xgk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明青浦区重固块',
                        'userstatus': 'registered',
                        'id': 2964,
                        'supervisor': 3283,
                        'username': 'qp_zgk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明青浦区航运新城块',
                        'userstatus': 'registered',
                        'id': 2965,
                        'supervisor': 3283,
                        'username': 'qp_hyxck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '光明青浦区万寿块',
                        'userstatus': 'registered',
                        'id': 2966,
                        'supervisor': 3283,
                        'username': 'qp_wsk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明青浦区徐泾块',
                        'userstatus': 'registered',
                        'id': 2967,
                        'supervisor': 3283,
                        'username': 'qp_xjk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明青浦区谢家宅块',
                        'userstatus': 'registered',
                        'id': 2968,
                        'supervisor': 3283,
                        'username': 'qp_xjzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明青浦区大盈块',
                        'userstatus': 'registered',
                        'id': 2969,
                        'supervisor': 3283,
                        'username': 'qp_dyk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明青浦区赵屯块',
                        'userstatus': 'registered',
                        'id': 2970,
                        'supervisor': 3283,
                        'username': 'qp_ztk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明青浦区白鹤块',
                        'userstatus': 'registered',
                        'id': 2971,
                        'supervisor': 3283,
                        'username': 'qp_bhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': '光明青浦区航运块',
                        'userstatus': 'registered',
                        'id': 2972,
                        'supervisor': 3283,
                        'username': 'qp_hyk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '光明青浦区朱家角块',
                        'userstatus': 'registered',
                        'id': 2973,
                        'supervisor': 3283,
                        'username': 'qp_zhjk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明青浦区金泽块',
                        'userstatus': 'registered',
                        'id': 2974,
                        'supervisor': 3283,
                        'username': 'qp_jzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明青浦区沈巷块',
                        'userstatus': 'registered',
                        'id': 2975,
                        'supervisor': 3283,
                        'username': 'qp_shgk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '光明青浦区莲盛块',
                        'userstatus': 'registered',
                        'id': 2976,
                        'supervisor': 3283,
                        'username': 'qp_lsk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明青浦区西岑块',
                        'userstatus': 'registered',
                        'id': 2977,
                        'supervisor': 3283,
                        'username': 'qp_xck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明青浦区商榻块',
                        'userstatus': 'registered',
                        'id': 2978,
                        'supervisor': 3283,
                        'username': 'qp_shtk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明青浦区小蒸块',
                        'userstatus': 'registered',
                        'id': 2979,
                        'supervisor': 3283,
                        'username': 'qp_xzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明青浦区练塘块',
                        'userstatus': 'registered',
                        'id': 2980,
                        'supervisor': 3283,
                        'username': 'qp_ltk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明北郊崇明块',
                        'userstatus': 'registered',
                        'id': 2981,
                        'supervisor': 3283,
                        'username': 'bj_cmk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明北郊新河块',
                        'userstatus': 'registered',
                        'id': 2982,
                        'supervisor': 3283,
                        'username': 'bj_xhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明北郊堡镇块',
                        'userstatus': 'registered',
                        'id': 2983,
                        'supervisor': 3283,
                        'username': 'bj_bzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明北郊陈家镇块',
                        'userstatus': 'registered',
                        'id': 2984,
                        'supervisor': 3283,
                        'username': 'bj_cjzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明北郊长兴岛块',
                        'userstatus': 'registered',
                        'id': 2985,
                        'supervisor': 3283,
                        'username': 'bj_cxdk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明北郊杨行块',
                        'userstatus': 'registered',
                        'id': 2986,
                        'supervisor': 3283,
                        'username': 'bj_yhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明北郊顾村块',
                        'userstatus': 'registered',
                        'id': 2987,
                        'supervisor': 3283,
                        'username': 'bj_gck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明北郊永清块',
                        'userstatus': 'registered',
                        'id': 2988,
                        'supervisor': 3283,
                        'username': 'bj_yqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明北郊临江块',
                        'userstatus': 'registered',
                        'id': 2989,
                        'supervisor': 3283,
                        'username': 'bj_ljk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明北郊宝山块',
                        'userstatus': 'registered',
                        'id': 2990,
                        'supervisor': 3283,
                        'username': 'bj_bsk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明北郊罗店块',
                        'userstatus': 'registered',
                        'id': 2991,
                        'supervisor': 3283,
                        'username': 'bj_ldk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明北郊罗南块',
                        'userstatus': 'registered',
                        'id': 2992,
                        'supervisor': 3283,
                        'username': 'bj_lnk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明北郊月浦块',
                        'userstatus': 'registered',
                        'id': 2993,
                        'supervisor': 3283,
                        'username': 'bj_ypk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明北郊盛桥镇块',
                        'userstatus': 'registered',
                        'id': 2994,
                        'supervisor': 3283,
                        'username': 'bj_sqzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明北郊美兰湖',
                        'userstatus': 'registered',
                        'id': 2995,
                        'supervisor': 3283,
                        'username': 'bj_mlhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明北郊刘行块',
                        'userstatus': 'registered',
                        'id': 2996,
                        'supervisor': 3283,
                        'username': 'bj_lhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明北郊华灵块',
                        'userstatus': 'registered',
                        'id': 2997,
                        'supervisor': 3283,
                        'username': 'bj_hlk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明北郊大华块',
                        'userstatus': 'registered',
                        'id': 2998,
                        'supervisor': 3283,
                        'username': 'bj_dhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明北郊祁连块',
                        'userstatus': 'registered',
                        'id': 2999,
                        'supervisor': 3283,
                        'username': 'bj_qlk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明北郊大场块',
                        'userstatus': 'registered',
                        'id': 3000,
                        'supervisor': 3283,
                        'username': 'bj_dck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明北郊淞南块',
                        'userstatus': 'registered',
                        'id': 3001,
                        'supervisor': 3283,
                        'username': 'bj_snk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明北郊淞良块',
                        'userstatus': 'registered',
                        'id': 3002,
                        'supervisor': 3283,
                        'username': 'bj_slk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明北郊高境块',
                        'userstatus': 'registered',
                        'id': 3003,
                        'supervisor': 3283,
                        'username': 'bj_gjk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明北郊泗塘块',
                        'userstatus': 'registered',
                        'id': 3004,
                        'supervisor': 3283,
                        'username': 'bj_stk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明北郊通河块',
                        'userstatus': 'registered',
                        'id': 3005,
                        'supervisor': 3283,
                        'username': 'bj_thk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明北郊呼玛块',
                        'userstatus': 'registered',
                        'id': 3006,
                        'supervisor': 3283,
                        'username': 'bj_hmk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明北郊三泉块',
                        'userstatus': 'registered',
                        'id': 3007,
                        'supervisor': 3283,
                        'username': 'bj_sqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明松江区西林块',
                        'userstatus': 'registered',
                        'id': 3008,
                        'supervisor': 3283,
                        'username': 'sj_xlk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明松江区大学城二期块',
                        'userstatus': 'registered',
                        'id': 3009,
                        'supervisor': 3283,
                        'username': 'sj_dxceqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明松江区松江新城块',
                        'userstatus': 'registered',
                        'id': 3010,
                        'supervisor': 3283,
                        'username': 'sj_sjxck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明松江区车墩块',
                        'userstatus': 'registered',
                        'id': 3011,
                        'supervisor': 3283,
                        'username': 'sj_cdk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明松江区新桥块',
                        'userstatus': 'registered',
                        'id': 3012,
                        'supervisor': 3283,
                        'username': 'sj_xqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明松江区洞泾块',
                        'userstatus': 'registered',
                        'id': 3013,
                        'supervisor': 3283,
                        'username': 'sj_djk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明松江区佘山块',
                        'userstatus': 'registered',
                        'id': 3014,
                        'supervisor': 3283,
                        'username': 'sj_shsk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明松江区九亭块',
                        'userstatus': 'registered',
                        'id': 3015,
                        'supervisor': 3283,
                        'username': 'sj_jtk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明松江区泗泾块',
                        'userstatus': 'registered',
                        'id': 3016,
                        'supervisor': 3283,
                        'username': 'sj_sjk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明松江区桥东块',
                        'userstatus': 'registered',
                        'id': 3017,
                        'supervisor': 3283,
                        'username': 'sj_qdk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明松江区北九亭块',
                        'userstatus': 'registered',
                        'id': 3018,
                        'supervisor': 3283,
                        'username': 'sj_bjtk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明松江区西林块1',
                        'userstatus': 'registered',
                        'id': 3019,
                        'supervisor': 3283,
                        'username': 'sj_xilin1@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明松江区辰花块',
                        'userstatus': 'registered',
                        'id': 3020,
                        'supervisor': 3283,
                        'username': 'sj_chhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明嘉定嘉定城南块',
                        'userstatus': 'registered',
                        'id': 3021,
                        'supervisor': 3283,
                        'username': 'jd_cnk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明嘉定城区块',
                        'userstatus': 'registered',
                        'id': 3022,
                        'supervisor': 3283,
                        'username': 'jd_cqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明嘉定安亭块',
                        'userstatus': 'registered',
                        'id': 3023,
                        'supervisor': 3283,
                        'username': 'jd_atk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明嘉定马陆块',
                        'userstatus': 'registered',
                        'id': 3024,
                        'supervisor': 3283,
                        'username': 'jd_mlk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明嘉定胜辛块',
                        'userstatus': 'registered',
                        'id': 3025,
                        'supervisor': 3283,
                        'username': 'jd_shxk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': '光明嘉定南翔块',
                        'userstatus': 'registered',
                        'id': 3026,
                        'supervisor': 3283,
                        'username': 'jd_nxk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明嘉定方泰块',
                        'userstatus': 'registered',
                        'id': 3027,
                        'supervisor': 3283,
                        'username': 'jd_ftk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明嘉定嘉定新城块',
                        'userstatus': 'registered',
                        'id': 3028,
                        'supervisor': 3283,
                        'username': 'jd_xck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明嘉定戬浜块',
                        'userstatus': 'registered',
                        'id': 3029,
                        'supervisor': 3283,
                        'username': 'jd_jbk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': '光明嘉定外岗块',
                        'userstatus': 'registered',
                        'id': 3030,
                        'supervisor': 3283,
                        'username': 'jd_wgk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明嘉定朱桥块',
                        'userstatus': 'registered',
                        'id': 3031,
                        'supervisor': 3283,
                        'username': 'jd_zqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明嘉定南门块',
                        'userstatus': 'registered',
                        'id': 3032,
                        'supervisor': 3283,
                        'username': 'jd_nmk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明嘉定黄渡块',
                        'userstatus': 'registered',
                        'id': 3033,
                        'supervisor': 3283,
                        'username': 'jd_hdk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明东区龚路块',
                        'userstatus': 'registered',
                        'id': 3034,
                        'supervisor': 3283,
                        'username': 'dq_gonglk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明东区御桥块',
                        'userstatus': 'registered',
                        'id': 3035,
                        'supervisor': 3283,
                        'username': 'dq_yuqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明西区普善块',
                        'userstatus': 'registered',
                        'id': 3036,
                        'supervisor': 3283,
                        'username': 'xq_pusk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明西区中西块',
                        'userstatus': 'registered',
                        'id': 3037,
                        'supervisor': 3283,
                        'username': 'xq_zhxik@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明北郊罗泾块',
                        'userstatus': 'registered',
                        'id': 3038,
                        'supervisor': 3283,
                        'username': 'bj_luojk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': '光明杭州区',
                        'userstatus': 'registered',
                        'id': 3039,
                        'supervisor': 3283,
                        'username': 'chenjunjun@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明台州区',
                        'userstatus': 'registered',
                        'id': 3040,
                        'supervisor': 3283,
                        'username': 'wangfeng@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明东郊星火农场块',
                        'userstatus': 'registered',
                        'id': 3053,
                        'supervisor': 3283,
                        'username': 'dj_xhnc@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明东郊西渡镇块',
                        'userstatus': 'registered',
                        'id': 3054,
                        'supervisor': 3283,
                        'username': 'dj_xdz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明东郊亭林镇块',
                        'userstatus': 'registered',
                        'id': 3055,
                        'supervisor': 3283,
                        'username': 'dj_tlz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明东郊朱泾块',
                        'userstatus': 'registered',
                        'id': 3056,
                        'supervisor': 3283,
                        'username': 'dj_zj@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明东郊山阳块',
                        'userstatus': 'registered',
                        'id': 3057,
                        'supervisor': 3283,
                        'username': 'dj_sy@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明东郊金卫块',
                        'userstatus': 'registered',
                        'id': 3058,
                        'supervisor': 3283,
                        'username': 'dj_jw@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明东郊张埝镇块',
                        'userstatus': 'registered',
                        'id': 3059,
                        'supervisor': 3283,
                        'username': 'dj_znz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明东郊新镇块',
                        'userstatus': 'registered',
                        'id': 3060,
                        'supervisor': 3283,
                        'username': 'dj_xz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明东郊航头镇块',
                        'userstatus': 'registered',
                        'id': 3061,
                        'supervisor': 3283,
                        'username': 'dj_htz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明东郊新场镇块',
                        'userstatus': 'registered',
                        'id': 3062,
                        'supervisor': 3283,
                        'username': 'dj_xcz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明东郊惠南块',
                        'userstatus': 'registered',
                        'id': 3063,
                        'supervisor': 3283,
                        'username': 'dj_hn@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明东郊黄路镇块',
                        'userstatus': 'registered',
                        'id': 3064,
                        'supervisor': 3283,
                        'username': 'dj_huanglz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明东郊六灶块',
                        'userstatus': 'registered',
                        'id': 3065,
                        'supervisor': 3283,
                        'username': 'dj_liuzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明东郊祝桥块',
                        'userstatus': 'registered',
                        'id': 3066,
                        'supervisor': 3283,
                        'username': 'dj_zq@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明东郊康沈块',
                        'userstatus': 'registered',
                        'id': 3067,
                        'supervisor': 3283,
                        'username': 'dj_ks@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明东郊家具厂块',
                        'userstatus': 'registered',
                        'id': 3068,
                        'supervisor': 3283,
                        'username': 'dj_jjc@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明东郊惠南镇一块',
                        'userstatus': 'registered',
                        'id': 3069,
                        'supervisor': 3283,
                        'username': 'dj_hnz1@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明东郊金水苑',
                        'userstatus': 'registered',
                        'id': 3070,
                        'supervisor': 3283,
                        'username': 'dj_jsy@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明东郊新苑块',
                        'userstatus': 'registered',
                        'id': 3071,
                        'supervisor': 3283,
                        'username': 'dj_xyk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明东郊南桥新城块',
                        'userstatus': 'registered',
                        'id': 3072,
                        'supervisor': 3283,
                        'username': 'dj_nqxck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明东郊石化新城块',
                        'userstatus': 'registered',
                        'id': 3073,
                        'supervisor': 3283,
                        'username': 'dj_shxck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明东郊下沙镇块',
                        'userstatus': 'registered',
                        'id': 3074,
                        'supervisor': 3283,
                        'username': 'dj_xsz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明东郊坦直镇块',
                        'userstatus': 'registered',
                        'id': 3075,
                        'supervisor': 3283,
                        'username': 'dj_tzz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明东郊中港块',
                        'userstatus': 'registered',
                        'id': 3076,
                        'supervisor': 3283,
                        'username': 'dj_zgk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': '光明东郊漕泾镇块',
                        'userstatus': 'registered',
                        'id': 3077,
                        'supervisor': 3283,
                        'username': 'dj_cjzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明东郊建桥块',
                        'userstatus': 'registered',
                        'id': 3078,
                        'supervisor': 3283,
                        'username': 'dj_jqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明东郊电子信息块',
                        'userstatus': 'registered',
                        'id': 3079,
                        'supervisor': 3283,
                        'username': 'dj_dzxx@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明东郊五四农场块',
                        'userstatus': 'registered',
                        'id': 3080,
                        'supervisor': 3283,
                        'username': 'dj_wusnc@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明东郊塘外块',
                        'userstatus': 'registered',
                        'id': 3081,
                        'supervisor': 3283,
                        'username': 'dj_twk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明东郊兴塔镇块',
                        'userstatus': 'registered',
                        'id': 3082,
                        'supervisor': 3283,
                        'username': 'dj_xtzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明东郊宣桥镇块',
                        'userstatus': 'registered',
                        'id': 3083,
                        'supervisor': 3283,
                        'username': 'dj_xqz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明东郊书院镇块',
                        'userstatus': 'registered',
                        'id': 3084,
                        'supervisor': 3283,
                        'username': 'dj_syz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': '光明东郊大团镇块',
                        'userstatus': 'registered',
                        'id': 3085,
                        'supervisor': 3283,
                        'username': 'dj_dtz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明东郊盐仓块',
                        'userstatus': 'registered',
                        'id': 3086,
                        'supervisor': 3283,
                        'username': 'dj_yc@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明东郊洪庙镇块',
                        'userstatus': 'registered',
                        'id': 3087,
                        'supervisor': 3283,
                        'username': 'dj_hmz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明东郊新奉浦块',
                        'userstatus': 'registered',
                        'id': 3088,
                        'supervisor': 3283,
                        'username': 'dj_xfp@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明东郊南桥一块',
                        'userstatus': 'registered',
                        'id': 3089,
                        'supervisor': 3283,
                        'username': 'dj_nq1@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '光明东郊朱泾一块',
                        'userstatus': 'registered',
                        'id': 3090,
                        'supervisor': 3283,
                        'username': 'dj_zj1@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明东郊康桥镇块',
                        'userstatus': 'registered',
                        'id': 3091,
                        'supervisor': 3283,
                        'username': 'dj_kangqz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明东郊科教园块',
                        'userstatus': 'registered',
                        'id': 3092,
                        'supervisor': 3283,
                        'username': 'dj_kjy@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                        'userfullname': '光明东郊周浦镇块',
                        'userstatus': 'registered',
                        'id': 3093,
                        'supervisor': 3283,
                        'username': 'dj_zpz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                        'userfullname': '光明东郊西门块',
                        'userstatus': 'registered',
                        'id': 3094,
                        'supervisor': 3283,
                        'username': 'dj_xm@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明东郊东海农场块',
                        'userstatus': 'registered',
                        'id': 3095,
                        'supervisor': 3283,
                        'username': 'dj_dhnc@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明东郊奉城镇块',
                        'userstatus': 'registered',
                        'id': 3096,
                        'supervisor': 3283,
                        'username': 'dj_fcz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明东郊南桥镇块',
                        'userstatus': 'registered',
                        'id': 3097,
                        'supervisor': 3283,
                        'username': 'dj_nqz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明东郊理工北门',
                        'userstatus': 'registered',
                        'id': 3098,
                        'supervisor': 3283,
                        'username': 'dj_lgbm@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': '光明东郊枫泾镇块',
                        'userstatus': 'registered',
                        'id': 3099,
                        'supervisor': 3283,
                        'username': 'dj_fjz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明东郊朱行镇块',
                        'userstatus': 'registered',
                        'id': 3100,
                        'supervisor': 3283,
                        'username': 'dj_zhz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '光明东郊吕巷镇块',
                        'userstatus': 'registered',
                        'id': 3101,
                        'supervisor': 3283,
                        'username': 'dj_lvxiangz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明东郊石化块',
                        'userstatus': 'registered',
                        'id': 3102,
                        'supervisor': 3283,
                        'username': 'dj_sh@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                        'userfullname': '光明东郊庄行镇块',
                        'userstatus': 'registered',
                        'id': 3103,
                        'supervisor': 3283,
                        'username': 'dj_zhzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明东郊燎原农场块',
                        'userstatus': 'registered',
                        'id': 3104,
                        'supervisor': 3283,
                        'username': 'dj_lync@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明东郊青村镇块',
                        'userstatus': 'registered',
                        'id': 3105,
                        'supervisor': 3283,
                        'username': 'dj_qck@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明东郊万祥镇块',
                        'userstatus': 'registered',
                        'id': 3106,
                        'supervisor': 3283,
                        'username': 'dj_wangxz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明东郊钱桥块',
                        'userstatus': 'registered',
                        'id': 3107,
                        'supervisor': 3283,
                        'username': 'dj_qqk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                        'userfullname': '光明东郊新寺镇块',
                        'userstatus': 'registered',
                        'id': 3108,
                        'supervisor': 3283,
                        'username': 'dj_xszk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明东郊肖塘镇块',
                        'userstatus': 'registered',
                        'id': 3109,
                        'supervisor': 3283,
                        'username': 'dj_xiaotzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明东郊奉浦块',
                        'userstatus': 'registered',
                        'id': 3110,
                        'supervisor': 3283,
                        'username': 'dj_fpk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明东郊金汇块',
                        'userstatus': 'registered',
                        'id': 3111,
                        'supervisor': 3283,
                        'username': 'dj_jhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明东郊泰日镇块',
                        'userstatus': 'registered',
                        'id': 3112,
                        'supervisor': 3283,
                        'username': 'dj_trzk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明东郊拓林镇块',
                        'userstatus': 'registered',
                        'id': 3113,
                        'supervisor': 3283,
                        'username': 'dj_tuolz@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/8.png',
                        'userfullname': '光明中二区升平块',
                        'userstatus': 'registered',
                        'id': 3123,
                        'supervisor': 3283,
                        'username': 'zqnz_spk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/4.png',
                        'userfullname': '光明中二区龙华块',
                        'userstatus': 'registered',
                        'id': 3124,
                        'supervisor': 3283,
                        'username': 'zqnz_lhk@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明黄浦豫园块',
                        'userstatus': 'registered',
                        'id': 3150,
                        'supervisor': 3283,
                        'username': 'zqnz_yuy@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': '光明合肥区',
                        'userstatus': 'registered',
                        'id': 3165,
                        'supervisor': 3283,
                        'username': 'hfyyb@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                        'userfullname': '光明芜湖区',
                        'userstatus': 'registered',
                        'id': 3166,
                        'supervisor': 3283,
                        'username': 'wuhuyyb@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明淮安区',
                        'userstatus': 'registered',
                        'id': 3167,
                        'supervisor': 3283,
                        'username': 'hayyb@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明南京区',
                        'userstatus': 'registered',
                        'id': 3168,
                        'supervisor': 3283,
                        'username': 'jilulu@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明南通区',
                        'userstatus': 'registered',
                        'id': 3169,
                        'supervisor': 3283,
                        'username': 'chenyongjin@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/7.png',
                        'userfullname': '光明苏州区',
                        'userstatus': 'registered',
                        'id': 3170,
                        'supervisor': 3283,
                        'username': 'panlian@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明泰州区',
                        'userstatus': 'registered',
                        'id': 3171,
                        'supervisor': 3283,
                        'username': 'liujiayan2@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': '光明无锡区',
                        'userstatus': 'registered',
                        'id': 3172,
                        'supervisor': 3283,
                        'username': 'wxyyb@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                        'userfullname': '光明徐州区',
                        'userstatus': 'registered',
                        'id': 3173,
                        'supervisor': 3283,
                        'username': 'lujinying@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': '光明盐城区',
                        'userstatus': 'registered',
                        'id': 3174,
                        'supervisor': 3283,
                        'username': 'zhaomei@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': '光明扬州区',
                        'userstatus': 'registered',
                        'id': 3175,
                        'supervisor': 3283,
                        'username': 'caiyinfeng@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                        'userfullname': '光明镇江区',
                        'userstatus': 'registered',
                        'id': 3176,
                        'supervisor': 3283,
                        'username': 'chenrongjun@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': '光明湖州区',
                        'userstatus': 'registered',
                        'id': 3177,
                        'supervisor': 3283,
                        'username': 'zhongmei@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': '光明嘉兴区',
                        'userstatus': 'registered',
                        'id': 3178,
                        'supervisor': 3283,
                        'username': 'wujinying@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明金华区',
                        'userstatus': 'registered',
                        'id': 3179,
                        'supervisor': 3283,
                        'username': 'chengrong@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': '光明宁波区',
                        'userstatus': 'registered',
                        'id': 3180,
                        'supervisor': 3283,
                        'username': 'zhangaijuan@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': '光明绍兴区',
                        'userstatus': 'registered',
                        'id': 3181,
                        'supervisor': 3283,
                        'username': 'zhanglili6@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': '光明温州区',
                        'userstatus': 'registered',
                        'id': 3182,
                        'supervisor': 3283,
                        'username': 'wusisi@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                        'userfullname': '富涛',
                        'userstatus': 'registered',
                        'id': 3239,
                        'supervisor': 3283,
                        'username': 'huaqingye@vip.163.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': 'Ge Qing',
                        'userstatus': 'registered',
                        'id': 3289,
                        'supervisor': 3283,
                        'username': 'geqing.lin@rnbtech.com.hk'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': 'mayTest',
                        'userstatus': 'registered',
                        'id': 3290,
                        'supervisor': 3283,
                        'username': '1920545597@qq.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': '光明南区莘庄块',
                        'userstatus': 'registered',
                        'id': 3361,
                        'supervisor': 3283,
                        'username': 'nq_xinzhuang@brightdairy.com'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': 'fj943jkewfo',
                        'userstatus': 'registered',
                        'id': 3441,
                        'supervisor': 3283,
                        'username': 'h843jr'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/15.png',
                        'userfullname': 'fj4930tkjfrops',
                        'userstatus': 'registered',
                        'id': 3451,
                        'supervisor': 3283,
                        'username': 'fjhi490'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                        'userfullname': 'j439jtj9',
                        'userstatus': 'registered',
                        'id': 3576,
                        'supervisor': 3283,
                        'username': 'hndf8932'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                        'userfullname': 'nf4i39erok',
                        'userstatus': 'registered',
                        'id': 3578,
                        'supervisor': 3283,
                        'username': 'dfn94e3wi'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': 'jf493erfik',
                        'userstatus': 'registered',
                        'id': 3579,
                        'supervisor': 3283,
                        'username': 'hjf943j'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                        'userfullname': 'mark.peek@cbre.com.au',
                        'userstatus': 'registered',
                        'id': 3597,
                        'supervisor': 3283,
                        'username': 'Mark Peek'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/18.png',
                        'userfullname': 'yf489',
                        'userstatus': 'registered',
                        'id': 3603,
                        'supervisor': 3283,
                        'username': 'h4j89ru9043'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                        'userfullname': 'jf984j',
                        'userstatus': 'registered',
                        'id': 3604,
                        'supervisor': 3283,
                        'username': 'j904re3utjf'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': 'jf894',
                        'userstatus': 'registered',
                        'id': 3605,
                        'supervisor': 3283,
                        'username': 'jr9jt09'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                        'userfullname': 'fh8349j',
                        'userstatus': 'registered',
                        'id': 3606,
                        'supervisor': 3283,
                        'username': 'fh40983jt'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                        'userfullname': 'jfdij43e',
                        'userstatus': 'registered',
                        'id': 3607,
                        'supervisor': 3283,
                        'username': '4u39tu'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                        'userfullname': 'er4343r',
                        'userstatus': 'registered',
                        'id': 3608,
                        'supervisor': 3283,
                        'username': '345rr4f43'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/21.png',
                        'userfullname': 'fji490',
                        'userstatus': 'registered',
                        'id': 3609,
                        'supervisor': 3283,
                        'username': 'jg4r93e0tui094'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/6.png',
                        'userfullname': 'fj94rjopsdfk',
                        'userstatus': 'registered',
                        'id': 3730,
                        'supervisor': 3283,
                        'username': 'f9430rjfewor09'
                    },
                    {
                        'isManager': 0,
                        'sub': [],
                        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                        'userfullname': '光明上海商贸',
                        'userstatus': 'registered',
                        'id': 3750,
                        'supervisor': 3283,
                        'username': 'shsm@brightdairy.com'
                    }
                ],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/23.png',
                'userfullname': 'salesadmin',
                'userstatus': 'registered',
                'id': 3283,
                'supervisor': 1,
                'username': 'salesadmin@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/14.png',
                'userfullname': 'ireeses',
                'userstatus': 'expired',
                'id': 3284,
                'supervisor': 1,
                'username': 'ireeses@163.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/3.png',
                'userfullname': 'shapgg@huawei.com',
                'userstatus': 'registered',
                'id': 3286,
                'supervisor': 1,
                'username': 'shapgg@huawei.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3288,
                'supervisor': 1,
                'username': '18908615959'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                'userfullname': 'afdsaf',
                'userstatus': 'registered',
                'id': 3302,
                'supervisor': 1,
                'username': 'fdasfds@1243.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                'userfullname': 'Sl',
                'userstatus': 'expired',
                'id': 3307,
                'supervisor': 1,
                'username': 'sl@sl.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/11.png',
                'userfullname': 'SLL',
                'userstatus': 'expired',
                'id': 3308,
                'supervisor': 1,
                'username': 'sl@slsl.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/16.png',
                'userfullname': 'sltest',
                'userstatus': 'expired',
                'id': 3323,
                'supervisor': 1,
                'username': 'slsl@sl.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3371,
                'supervisor': 1,
                'username': '18505103378'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/19.png',
                'userfullname': 'Sltest',
                'userstatus': 'expired',
                'id': 3573,
                'supervisor': 1,
                'username': 'Sltest'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3592,
                'supervisor': 1,
                'username': '17717488078'
            },
            {
                'isManager': 1,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/5.png',
                'userfullname': 'tony_test',
                'userstatus': 'registered',
                'id': 3600,
                'supervisor': 1,
                'username': 'tonytest@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/22.png',
                'userfullname': 'testforM',
                'userstatus': 'registered',
                'id': 3601,
                'supervisor': 1,
                'username': 'testforM'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/17.png',
                'userfullname': 'testforM2',
                'userstatus': 'registered',
                'id': 3602,
                'supervisor': 1,
                'username': 'testforM2'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3616,
                'supervisor': 1,
                'username': '13953759728'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                'userfullname': 'azuretest_may01',
                'userstatus': 'registered',
                'id': 3634,
                'supervisor': 1,
                'username': 'azuretest_may01'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                'userfullname': 'azuretest_may02',
                'userstatus': 'registered',
                'id': 3635,
                'supervisor': 1,
                'username': 'azuretest_may02'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/10.png',
                'userfullname': 'IKEA Demo',
                'userstatus': 'registered',
                'id': 3639,
                'supervisor': 1,
                'username': 'IKEA@ikea.com'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/20.png',
                'userfullname': 'Account name',
                'userstatus': 'registered',
                'id': 3644,
                'supervisor': 1,
                'username': 'Login name'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/13.png',
                'userfullname': 'xiaxin',
                'userstatus': 'registered',
                'id': 3653,
                'supervisor': 1,
                'username': 'xiaxin.liu@rnbtech.com.hk'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3659,
                'supervisor': 1,
                'username': '15806065999'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/12.png',
                'userfullname': '111',
                'userstatus': 'registered',
                'id': 3660,
                'supervisor': 1,
                'username': '2334sdd'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/2.png',
                'userfullname': 'Hezhengjun',
                'userstatus': 'registered',
                'id': 3661,
                'supervisor': 1,
                'username': 'Hezhengjun01'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '111',
                'userstatus': 'expired',
                'id': 3662,
                'supervisor': 1,
                'username': '111'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3683,
                'supervisor': 1,
                'username': '15276154515'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/1.png',
                'userfullname': '',
                'userstatus': 'registered',
                'id': 3713,
                'supervisor': 1,
                'username': '15520580166'
            },
            {
                'isManager': 0,
                'sub': [],
                'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/default/9.png',
                'userfullname': 'invitation',
                'userstatus': 'expired',
                'id': 3716,
                'supervisor': 1,
                'username': 'invitation1'
            }
        ],
        'userpic': 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/19069668.jpg',
        'userfullname': 'admin',
        'userstatus': 'registered',
        'id': 1,
        'supervisor': 0,
        'username': 'admin'
    }
    TestCommon.LoadUsersTree.assert_result_admin(expexted, rt)

@pytest.mark.p0
def test_loadUsersTree_wrong():
    rt = TestCommon.LoadUsersTree.run({
        'userId':1152,
    })
    expexted = None
    TestCommon.LoadUsersTree.assert_result_equals(expexted, rt)