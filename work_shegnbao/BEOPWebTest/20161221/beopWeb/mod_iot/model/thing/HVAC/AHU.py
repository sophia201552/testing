from beopWeb.mod_iot.model.thing.ThingHVAC import ThingHVAC

class AHU(ThingHVAC):
    """description of class"""

    config = {
        'attrs': {
            "SeasonSwitch":{},
            "SeasonSwitchVlve":{},
            "UnitOnOff":{},
            "UnitOnOffSet":{},
            "UnitError":{},
            "UnitAutoMode":{},
            "UnitSmokeWarning":{}
        }
    }

    icon = 'icon-shujutubiao25'