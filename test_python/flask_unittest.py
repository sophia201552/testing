from flask import Flask, jsonify
from flask.ext.testing import TestCase
import unittest

app = Flask(__name__)


@app.route("/ajax/")
def some_json():
    return jsonify(success=False)


class TestViews(TestCase):
    def create_app(self):
        app.config['TESTING'] = True
        return app

    def test_some_json(self):
        response = self.client.get("/ajax/")
        ''''' 
               判断还回的JSON对像是不是{'success':True} 
        '''
        self.assertEquals(response.json, dict(success=True))


if __name__ == '__main__':
    unittest.main()