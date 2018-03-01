from flask import Blueprint
bp_temp = Blueprint('temp', __name__, url_prefix='/appTemperature')

from .controllers import *