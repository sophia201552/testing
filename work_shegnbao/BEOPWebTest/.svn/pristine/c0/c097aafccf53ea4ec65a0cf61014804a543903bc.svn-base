from beopWeb import app
from beopWeb.BEOPDataAccess import *
import sys
import os
import re
import copy
from flask import Flask,request,session,g,make_response,redirect,url_for,abort,render_template,send_file,flash,json,jsonify
import mysql.connector
from datetime import datetime,timedelta
import time
import calendar
from beopWeb.BEOPDataAccess import *
from os import environ, listdir, path, unlink, remove, makedirs
import csv
import requests
from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess
from beopWeb.MongoConnManager import MongoConnManager

@app.route('/appDashboard/project/summary/<projectId>', methods=['GET'])
def getSummary(projectId):
    rt = False
    try:
        dbname = 'diagnosis'

        if len(projectId) > 0:
            sql = ('select topic, dashboard from app where projectId=%s' )
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, sql,(projectId,))
            for topic,dashboard in rv:
                rt={
                    'dashboardList': dashboard.replace('\r','').replace('\n','').replace('\'','\"'),
                    'summaryList': topic.replace('\r','').replace('\n','').replace('\'','\"')
                }
    except Exception as e:
        print('appDbGetSummary failed')
        print(e.__str__())
        logging.error(e.__str__())
        logging.exception(e)

    return json.dumps(rt, ensure_ascii=False)
