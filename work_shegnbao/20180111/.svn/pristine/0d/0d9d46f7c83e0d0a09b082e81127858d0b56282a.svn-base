from beopWeb.mod_iot.model.Group import Group
class CTSGroup(Group):
    """description of class"""

    config = {
        'attrs': {
            'CWSupplyT': {},
            'CWReturnT': {
                "filter": {
                    't': "range", 
                    'opt': ['0 - 10', '10 - 100', 'custom']
                    }
                },
            'CWAutoOpenStatus': {
                "filter": {
                    't': "enum", 
                    'opt': {
                        '0': 'ON',
                        '1': 'OFF'
                        }
                    }
                },
            }
        }

    