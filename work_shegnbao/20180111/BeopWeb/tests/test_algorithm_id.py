import pytestfrom beopWeb.mod_algorithm import controllerimport json@pytest.mark.p0@pytest.mark.parametrize(('algorithm_id', 'expected'), [    ("146528122847137926ccbc60", {'content': "calc_sum_this_week('ChGroupTotal001_GroupPower',1/12.0,'m5')", 'note': '', 'name': '冷机周用电量', '_id': '146528122847137926ccbc60', 'isFolder': False, 'parent_id': '14646924698430012e7c5763'}),])def test_select_searchUseId(algorithm_id, expected):    rt = controller.GetAlgorithmTemplateContent(algorithm_id)    rt=json.loads(rt)    assert rt,'actual value is []'    for key in rt.keys():        assert rt.get(key)==expected.get(key),'not equal ,acutal={0},expected={1}'.format(rt.get(key),expected.get(key))