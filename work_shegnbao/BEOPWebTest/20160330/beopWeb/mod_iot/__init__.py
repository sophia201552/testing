from flask import Blueprint
from beopWeb import app
bp_iot = Blueprint('iot', __name__, url_prefix='/iot')

from .controllers import *
from .factory import Factory

with app.app_context():
    app.fac = Factory()
    app.fac.regist("Project", "")
    

    app.fac.regist("Group", "")
    app.fac.regist("CTSGroup", "group")
    app.fac.regist("GroupRoom", "group")


    app.fac.regist("Thing", "")
    app.fac.regist("ThingHVAC", "thing")
    app.fac.regist("CT", "thing.HVAC")
    app.fac.regist("Ch", "thing.HVAC")
    app.fac.regist("AHU", "thing.HVAC")
    app.fac.regist("FCU", "thing.HVAC")
    app.fac.regist("WP", "thing.HVAC")
    app.fac.regist("VAVBox", "thing.HVAC")
    app.fac.regist("HX", "thing.HVAC")
    app.fac.regist("IceTank", "thing.HVAC")
    app.fac.regist("Vlve", "thing.HVAC")

    app.fac.regist("ThingSmartDevice", "thing")
    app.fac.regist("SensorTemp", "thing.SmartDevice")
    app.fac.regist("ControllerFCU", "thing.SmartDevice")
    app.fac.regist("Gateway", "thing.SmartDevice")
