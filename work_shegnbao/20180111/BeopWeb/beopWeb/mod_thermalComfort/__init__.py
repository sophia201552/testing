from flask import Blueprint
bp_thermalComfort = Blueprint('thermalComfort', __name__, template_folder='templates/mod_thermalComfort', url_prefix='/thermalComfort')

from .controllers import *