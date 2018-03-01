import pytestfrom beopWeb.mod_admin import controllersimport jsonglobal id@pytest.mark.p0@pytest.mark.usefixtures("deleteManagement")@pytest.mark.parametrize(('data','expected'), [    ({"name_cn":"测试","name_en":"Test Management_3","code_name":"test management_3","phone":"13012345789"},True),])def test_get_management(data,expected):    creat_data={"name_cn":"测试集团管理","name_en":"Test Management_2","code_name":"test management","phone":"1301234596"}    creat_rt = controllers.do_create_management(creat_data)    global id    id = json.loads(bytes.decode(creat_rt.data)).get('data')    data.update({"id":id})    update_rt = controllers.do_update_management(data)    update_rt = json.loads(bytes.decode(update_rt.data)).get('data')    assert update_rt== expected, ' not equal .actual={0},expected={1}'.format(update_rt.get('data'), expected)    actual = controllers.get_management(id)    actual = (json.loads(bytes.decode(actual.data))).get('data')    for key in actual.keys():        assert actual.get(key)==data.get(key),' not equal .actual={0},expected={1}'.format(actual.get(key),data.get(key))@pytest.fixture(scope='function')def deleteManagement(request):    global id    def fin():        controllers.do_delete_management(id)    request.addfinalizer(fin)