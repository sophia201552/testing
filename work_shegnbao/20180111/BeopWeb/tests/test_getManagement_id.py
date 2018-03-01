import pytestfrom beopWeb.mod_admin import controllersimport json@pytest.mark.p0@pytest.mark.parametrize(('id', 'expected'), [    (18, {"msg": "", "success": True, "code": "1",          "data": {"name_en": "Capitaland", "name_cn": "凯德", "phone": "", "code_name": "capitaland", "id": 18}}),    (17, {"msg": "", "success": True, "code": "1",          "data": {"name_en": "MyMatrix", "name_cn": "MyMatrix", "phone": "123456", "code_name": "facilitymatrix","id": 17}})])def test_get_management(id, expected):    rt = controllers.get_management(id)    rt = json.loads(bytes.decode(rt.data))    assert rt.get('success') == True, ' not equal .actual={0},expected={1}'.format(rt.get('data'), expected)    el = len(expected.get('data'))    al = len(rt.get('data'))    assert el == al, 'not equal,expected length is {0},actual is {1}'.format(el, al)    for key in expected.get('data').keys():        assert expected.get('data').get(key) == rt.get('data').get(key), 'not equal,actual is {0},not is {1}'.format(            rt.get('data').get(key), expected.get('data').get(key))