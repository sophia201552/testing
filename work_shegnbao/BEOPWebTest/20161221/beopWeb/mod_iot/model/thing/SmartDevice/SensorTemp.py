from beopWeb.mod_iot.model.thing.ThingSmartDevice import ThingSmartDevice

class SensorTemp(ThingSmartDevice):
    """description of class"""

    #params = {
    #    'gatewayId': '',	#网关ID
    #    'endpoint': '',	    #传感类型
    #    'roomId': '',	    #所在房间ID
    #    'cId': '',	        #对应controllerId
    #    'gps': '',	        #坐标
    #    'mac': '',	        #MAC
    #    'address': '',	    #networkAddress
    #}

    config = {
        'attrs': {
            "SensorT":{},
            "SensorH":{},
            "SensorBattery":{},
            "SensorSignalStrength":{},
        }
    }