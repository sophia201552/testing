from flask import Blueprint

bp_history = Blueprint('history', __name__, template_folder='templates/mod_history', url_prefix='/history')

from .controllers import *