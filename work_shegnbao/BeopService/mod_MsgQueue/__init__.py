__author__ = 'murphy'

from flask import Blueprint

bp_mq = Blueprint('mq', __name__, url_prefix='/mq')
from .mqServer import *

