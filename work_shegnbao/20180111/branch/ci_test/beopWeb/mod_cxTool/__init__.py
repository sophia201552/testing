__author__ = 'win7'

from flask import Blueprint

bp_pointTool = Blueprint('pointTool', __name__, template_folder='templates/mod_cx_tool', url_prefix='/point_tool')

from .pointSettingControllers import *
from .terminalControllers import *
from .pointReferenceControllers import *
from .proxyController import *
