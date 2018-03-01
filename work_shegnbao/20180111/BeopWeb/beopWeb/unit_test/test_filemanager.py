import unittest
from unittest import mock
import json
from beopWeb.fileManager import app
class fileManagerTest(unittest.TestCase):
    projId = 72


    def setUp(self):
        app.config['URL_CHECK'] = False
        self.client = app.test_client()


    def test_fileManagerGetInfo(self):
        r = self.client.get("/fileManager/info/72")
        rt = json.loads(r.data.decode())
        data = rt.get('data')
        self.assertIsNotNone(data, "projectId={} /fileManager/info/<projectId> return {} ! Please check it!".format(self.projId, {'data': None}))
        self.assertGreater(data.get('available'), 0, "projId={} file size is not greater than zero! It's size is {}".format(self.projId, rt['data']['available']))


    def test_fileManagerFilter(self):
        data = {'type': 0, 'projectId': self.projId, 'keyword': ""}
        r = self.client.post("/fileManager/filter", data=json.dumps(data), headers={'content-type': 'application/json'})
        rt = json.loads(r.data.decode())
        self.assertIsNot(rt, [], "data empty, please check it!")


if __name__ == "__main__":
    unittest.main()