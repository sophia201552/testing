#edcoding=utf-8

_MANGO_KEY = '8d71fe63b35e8628fb9617bb4ea03df8'
_KIRRY_KEY = '8f4513fdd7e0fcbb3fdb2e2a0a9d55d9'
_SOPHIA_KEY = ''
_ANGELIA_KEY = '51b09021a0ffc203d7977be63f1efcb6'

_NAME_LIST = ['mango', 'kirry', 'sophia', 'angelia']

def get_key_by_name(name):
    if name == 'mango':
        return _MANGO_KEY
    if name == 'kirry':
        return _KIRRY_KEY
    if name == 'sophia':
        return _SOPHIA_KEY
    if name == 'angelia':
        return _ANGELIA_KEY

def get_name_list():
    return _NAME_LIST
