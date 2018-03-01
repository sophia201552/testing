from flask import Blueprint
bp_asset = Blueprint('asset', __name__, url_prefix='/asset')

from .controllers import *