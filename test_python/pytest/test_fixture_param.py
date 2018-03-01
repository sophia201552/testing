import pytest

#如何带参数 fixture还可以带参数，可以把参数赋值给params，默认是None。对于param里面的每个值，fixture都会去调用执行一次，就像执行for循环一样把params里的值遍历一次
@pytest.fixture(params=[1, 2, 3])
def test_data(request):
    return request.param


def test_not_2(test_data):
    print('test_data: %s' % test_data)
    assert test_data != 2
