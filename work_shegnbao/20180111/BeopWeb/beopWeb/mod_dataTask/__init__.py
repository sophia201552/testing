from flask import Blueprint

bp_dataTask = Blueprint('dataTask', __name__, url_prefix="/dataTask")

from .controller import *
