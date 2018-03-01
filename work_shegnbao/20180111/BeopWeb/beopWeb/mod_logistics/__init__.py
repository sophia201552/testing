from flask import Blueprint
bp_logistics = Blueprint('logistics', __name__, url_prefix='/logistics')

from .controllers import *