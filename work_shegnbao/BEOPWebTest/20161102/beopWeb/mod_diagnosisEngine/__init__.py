from flask import Blueprint
bp_diagnosisEngine = Blueprint('diagnosisEngine', __name__, url_prefix='/diagnosisEngine')

from .controllers import *