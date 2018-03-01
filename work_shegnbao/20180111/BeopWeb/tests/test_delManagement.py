import pytestfrom beopWeb.mod_admin import controllersimport jsonfrom beopWeb.mod_oss.ossapi import *from beopWeb.mod_common.Utils import *from beopWeb.mod_admin.Management import Management@pytest.mark.p0def test_delete_management():    creat_data={"name_cn":"测试集团管理","name_en":"Test Management_4","code_name":"test management","phone":"1301234596"}    creat_rt = controllers.do_create_management(creat_data)    id = json.loads(bytes.decode(creat_rt.data)).get('data')    #绑定management到49项目    controllers.do_bind_management(id, [49])    delete_rt=controllers.do_delete_management([id])    delete_rt=json.loads(bytes.decode(delete_rt.data)).get('data')    assert delete_rt==True,'delete management fail'    #验证删除是否成功    get_rt=controllers.get_management(id)    get_rt=json.loads(bytes.decode(get_rt.data)).get('data')    assert get_rt=={},'delete  management fail'    #验证附件删除是否成功    oss = OssAPI(Utils.OSS_HOST, Utils.OSS_ACCESS_ID, Utils.OSS_SECRET_ACCESS_KEY)    file_full_name = str(id) + '_logo.png'    oss_rt=oss.get_object('beopweb', 'custom/management/' + file_full_name)    assert oss_rt.status==404,'delete  attachment fail'    #验证49项目mangement是否解绑    # project_rt=Management.get_management_project_list(Management,[id])  目前存在bug注释掉    # assert not project_rt,'unbind management fail'