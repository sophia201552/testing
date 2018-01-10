import pytest
# 需要作为前提的,如登录,直接就可以封装为before,把函数名作为参数传给该用例.
@pytest.fixture()
def before():
    print ('\nbefore each test')

def test_1(before):
    print ('test_1()')

def test_2(before):
    print ('test_2()')
    assert 0