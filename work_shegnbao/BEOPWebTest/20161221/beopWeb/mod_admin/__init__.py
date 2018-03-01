__author__ = 'liqian'
from flask import Blueprint

bp_admin = Blueprint('admin', __name__, template_folder='templates/mod_admin', url_prefix='/admin')
from .controllers import *
from .dataManagerControllers import *
from .benchmarkControllers import *
from .reportControllers import *
