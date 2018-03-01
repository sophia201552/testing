from flask import request, json, jsonify
import logging, uuid
from beopWeb import app
from beopWeb.mod_logistics import bp_logistics
from beopWeb.MongoConnManager import *
from beopWeb.BEOPDataAccess import *
from beopWeb.AuthManager import AuthManager


@app.route('/logistics')
def logistics():
    """Renders the home page."""
    return render_template('indexLogistics.html',
                           title='BeOP')


@bp_logistics.route('/test', methods=['GET'])
def test():
    return 'asdf'