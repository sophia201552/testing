from flask import Blueprint

bp_workflow_process = Blueprint('workflow_process', __name__, template_folder='templates/mod_workflow_process',
                                url_prefix='/workflow_process')

from .controllers import *
from .Process import *
from .Template import *
