from flask import request, json, jsonify, render_template
from beopWeb import app
from beopWeb.mod_bill import bp_bill
from beopWeb.MongoConnManager import *
from beopWeb.BEOPDataAccess import *

@app.route('/bill')
def bill():
    return render_template('indexBill.html', title='BEOP Bill')
