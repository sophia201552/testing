from flask import Blueprint
bp_diagnosis = Blueprint('diagnosis', __name__, template_folder='templates/mod_diagnosis', url_prefix='/diagnosis_v2')

from .controllers import *