__author__ = 'yan'
from flask import Blueprint
bp_algorithm = Blueprint('algorithm', __name__, url_prefix='/algorithm')

from .controller import *
from .cloud_algorithm import *

