from beopWeb.mod_iot.model.Group import Group

class GroupRoom(Group):
    """智能传感器的房间，以后可能扩展"""

    config = {
        'attrs': {
        }
    }

    #params = {
    #    'gatewayId': '',
    #    'map': {
    #        'width': '',	    #长
    #        'height': '',	    #宽
    #        'scale': '',	    #比例尺
    #        'orientation': '',	#方向（偏转角度）
    #        'gps': [],	        #GPS
    #        'img': '',	        #地图图片
    #    }
    #    'mode': '',	        #控制模式
    #    'sm': '',	        #季节模式
    #}    