from beopWeb.mod_iot.model.Group import Group

class GroupSpace(Group):
    """封闭空间，父节点永远是GroupRoom（房间）"""
    
    config = {
        'attrs': {
        }
    }
    #params = {
    #    'roomId': '',	    #roomId	
    #    'arrWallIds': '',	#墙ID	Array
    #    'path': '',	        #边框	Object
    #    'x': '',	        #x	
    #    'y': '',	        #y	
    #    'width': '',	    #长	    temp 以后用path代替
    #    'height': '',	    #宽		temp 以后用path代替
    #}