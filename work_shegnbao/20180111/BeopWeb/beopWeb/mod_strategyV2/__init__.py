from flask import Blueprint
bp_strategyV2 = Blueprint('strategyV2', __name__, template_folder='../static/webpack-gen/', url_prefix='/strategyV2')

from .controllers import *
from .module_controllers import *