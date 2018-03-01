from beopWeb.mod_iot.model.thing.ThingHVAC import ThingHVAC

class IceTank(ThingHVAC):
    """description of class"""

    config = {
        'attrs': {
            "IceTankLevel":{},
            "IceTankRatio":{},
        }
    }