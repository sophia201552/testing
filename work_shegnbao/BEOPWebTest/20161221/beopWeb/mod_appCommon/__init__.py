from flask import Blueprint
bp_appCommon = Blueprint('appCommon', __name__, url_prefix='/appCommon')

from .controllers import *