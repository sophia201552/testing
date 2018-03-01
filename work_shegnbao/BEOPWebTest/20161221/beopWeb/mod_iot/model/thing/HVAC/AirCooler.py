from beopWeb.mod_iot.model.thing.ThingHVAC import ThingHVAC

class AirCooler(ThingHVAC):
    """description of class"""

    config = {
        'attrs': {
            "RoomTSet":{},
            "DefrostPeriodSet":{},
            "FinT":{},
            "RoomT":{},
            "Ref":{},
            "Defrost":{},
            "OnOff":{},
        }
    }