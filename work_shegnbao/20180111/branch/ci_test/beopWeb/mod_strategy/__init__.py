from flask import Blueprint
bp_strategy = Blueprint('strategy', __name__, template_folder='templates/mod_strategy', url_prefix='/strategy')

from .controllers import *