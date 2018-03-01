from flask import Blueprint
bp_patrol = Blueprint('patrol', __name__, url_prefix='/patrol')

from .controllers import *
from .patrol import *