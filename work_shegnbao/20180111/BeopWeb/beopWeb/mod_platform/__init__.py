from flask import Blueprint

bp_platform = Blueprint('platform', __name__, url_prefix='/platform')

from .controllers import *