from beopWeb.mod_iot.model.thing.ThingHVAC import ThingHVAC

class HX(ThingHVAC):
    """description of class"""

    config = {
        'attrs': {
            "HXPriSupplyT":{},
            "HXPriReturnT":{},
            "HXSecSupplyT":{},
            "HXSecReturnT":{},
            "HXBypassValvePositionSet":{},
            "HXBypassValvePosition":{}
        }
    }