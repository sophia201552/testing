from flask import Blueprint

bp_modbus = Blueprint('modbus', __name__, url_prefix="/modbus")
bp_terminal = Blueprint('terminal', __name__, url_prefix="/terminal")

from .controller import *
