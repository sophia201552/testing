from flask import Blueprint
bp_factory = Blueprint('factory', __name__, template_folder='templates/mod_factory', url_prefix='/factory')

from .controllers import *