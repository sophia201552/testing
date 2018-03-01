__author__ = 'win7'

from flask import Blueprint
from beopWeb import app

app.secret_key = 'rnbtech/3yX R~beop!jmN]LWX/,?RT'

bp_pointTool = Blueprint('pointTool', __name__, template_folder='templates/mod_cx_tool', url_prefix='/point_tool')

from .pointSettingControllers import *
from .pointSourceTypeControllers import *
from .cxtoolConfigControllers import *
from .terminalControllers import *
