from beopWeb.mod_iot.model.thing.ThingSmartDevice import ThingSmartDevice

class ControllerFCU(ThingSmartDevice):
    """description of class"""

    #params = {
    #    'gatewayId': '', 	#网关ID
    #    'type': '', 	    #0：路由 1：控制器
    #    'gps': '', 	        #坐标
    #    'mac': '', 	        #MAC
    #    'address': '', 	    #networkAddress
    #}

    config = {
        'attrs': {
            "FCUSignalStrength":{},
            "FCUBattery":{},
            "FCUOnOff":{},
            "FCUValvePositionD":{},
            "FCUValvePositionA":{},
            "FCUSpeedD":{},
            "FCUSpeedA":{},

            "FCUValvePositionDSet":{},
            "FCUValvePositionASet":{},
            "FCUSpeedDSet":{},
            "FCUSpeedASet":{},
            "FCUSeasonModeSet":{},
            "FCUSeasonMode":{},
            "FCUTSet":{},
            "FCUAutoMode":{},
            "FCUOnOffSet":{},
        }
    }