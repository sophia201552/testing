from flask import Blueprint
bp_energy = Blueprint('energy', __name__, url_prefix='/energy')

from .controllers import *