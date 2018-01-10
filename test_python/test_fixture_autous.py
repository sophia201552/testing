import time
import pytest

@pytest.fixture(scope="module", autouse=True)
def mod_header(request):
    print('\n-----------------')
    print('module      : %s' % request.module.__name__)
    print('-----------------')

@pytest.fixture(scope="function", autouse=True)
def func_header(request):
    print('\n-----------------')
    print('function    : %s' % request.function.__name__)
    print('time        : %s' % time.asctime())
    print('-----------------')

def test_one():
    print('in test_one()')

def test_two():
    print('in test_two()')