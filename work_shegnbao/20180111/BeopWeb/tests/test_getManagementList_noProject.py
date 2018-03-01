import pytestfrom beopWeb.mod_admin import controllers@pytest.mark.p0@pytest.mark.parametrize(('userId', 'expected'), [    (1608, [{'phone': '123456', 'name_cn': 'MyMatrix', 'code_name': 'facilitymatrix', 'name_en': 'MyMatrix', 'id': 17,             'projectList': [                 {'name_english': 'Simc', 'name_cn': '上海中芯国际', 'latlng': '31.213228,121.607895', 'management': 17,                  'name_en': 'hsimc', 'id': 1, 'pic': 'hsimc.jpg'}]}]),    (2265, [{'phone': '123456', 'name_cn': 'MyMatrix', 'code_name': 'facilitymatrix', 'name_en': 'MyMatrix', 'id': 17,             'projectList': [                 {'name_english': 'Simc', 'name_cn': '上海中芯国际', 'latlng': '31.213228,121.607895', 'management': 17,                  'name_en': 'hsimc', 'id': 1, 'pic': 'hsimc.jpg'},                 {'name_english': 'Hospital Demo', 'name_cn': 'Hospital Demo', 'latlng': '30.9080326,-94.0146787',                  'management': 17, 'name_en': 'jasperhospita', 'id': 446, 'pic': 'jasperhospita.jpg'}]},            {'phone': '', 'name_cn': '凯德', 'code_name': 'capitaland', 'name_en': 'Capitaland', 'id': 18,             'projectList': [                 {'name_english': 'RCS', 'name_cn': 'RCS', 'latlng': '31.232849,121.475508', 'management': 18,                  'name_en': 'CapitalandRCS', 'id': 528, 'pic': 'CapitalandRCS.jpg'}]},            {'phone': '（+61）0497 666 577', 'name_cn': 'Industry-Tech', 'code_name': 'IndustryTech',             'name_en': 'Industry-Tech', 'id': 35, 'projectList': [                {'name_english': '175LiverpoolStreet', 'name_cn': '175Liverpoolst', 'latlng': '-33.8767149,151.211525',                 'management': 35, 'name_en': 'liverpoolst', 'id': 293, 'pic': 'liverpoolst.jpg'},                {'name_english': 'Greenslopes Private Hospital', 'name_cn': 'Greenslopes',                 'latlng': '-27.5107135,153.0484705', 'management': 35,                 'name_en': 'Greenslopes_Private_Hospital_Energy_Building', 'id': 421,                 'pic': 'Greenslopes_Private_Hospital_Energy_Building.jpg'},                {'name_english': '126 Church Street Parramatta', 'name_cn': '126 Church Street Parramatta',                 'latlng': '-33.8182289,151.0040679', 'management': 35, 'name_en': '126ChurchStreetParramatta',                 'id': 491, 'pic': '126ChurchStreetParramatta.jpg'}]}]),])def test_get_management_list(userId, expected):    rt = controllers.do_get_management_list(userId)    assert len(rt) == len(expected), ' not equal .actual length={0},expected length={1}'.format(len(rt), len(expected))    for index,item in enumerate(expected):        for key in item.keys():            if key == 'projectList':                acutal_projectList = rt[index].get(key)                expected_projectList = item.get(key)                assert len(acutal_projectList) == len(expected_projectList), 'not equal , acutal is {0},expected is {1}'.format(acutal_projectList.get(key), expected_projectList.get(key))                for pro_index, pro_item in enumerate(expected_projectList):                    for pro_key in pro_item.keys():                        assert pro_item.get(pro_key) == acutal_projectList[pro_index].get(pro_key), 'not equal , acutal is {0},expected is {1}'.format(acutal_projectList[pro_index].get(pro_key), pro_item.get(pro_key))            else:                assert expected[index].get(key) == rt[index].get(key), 'not equal , acutal is {0},expected is {1}'.format(rt[index].get(key),expected[index].get(key))