from beopWeb.mod_iot.model.thing.ThingHVAC import ThingHVAC

class VAVBox(ThingHVAC):
    """description of class"""

    config = {
        'attrs': {
            "VAVBoxAirFlow":{},
            "VAVBoxAutoMode":{},
            "VAVBoxDamperPosition":{},
            "VAVBoxAirFlowSet":{},
            "VAVBoxSeasonMode":{},
            "VAVBoxRoomTemp":{}
        }
    }