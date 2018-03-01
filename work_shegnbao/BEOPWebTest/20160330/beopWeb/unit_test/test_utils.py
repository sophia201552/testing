import unittest
from beopWeb.mod_common.Utils import Utils
from bson import ObjectId, Binary, Code
from datetime import datetime


class UtilsCase(unittest.TestCase):
    def test_beop_response(self):
        code = 123
        msg = '123'
        normal_data = {
            "123": 123,
            "string": "string",
            "list": [123, 456],
            "dict": {"123": "123", "string": "string", "list": [123, "string"]}
        }
        normal_data_response = Utils.beop_response(True, normal_data, code, msg)
        assert normal_data_response
        bson_data = {
            '_id': ObjectId(),
            'date': datetime.now(),
            'binary': Binary(bytes()),
            'code': Code("function x(){return 1;}")
        }
        bson_data_response = Utils.beop_response(True, bson_data, code, msg)
        assert bson_data_response
