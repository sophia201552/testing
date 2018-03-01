from beopWeb.mod_iot.model.thing.ThingHVAC import ThingHVAC

class CT(ThingHVAC):
    """description of class"""

    config = {
        'attrs': {
            'CTRemoteMode': {},
            'CTAutoMode': {},
            'CTRunHour': {},
            'CTOnOff': {
                "filter": {
                    't': "enum", 
                    'opt': {
                        '0': 'ON',
                        '1': 'OFF'
                        }
                    }
                },
            'CTEnable': {
                "filter": {
                    't': "enum", 
                    'opt': {
                        '0': 'ON',
                        '1': 'OFF'
                        }
                    }
                }, 
            'CTErr': {},
            'CTVSDErr': {},
            'CTOnOffSet': {},
            'CTVSDFreq': {},
            'CTVSDFreqSet': {},
            'CTVSDFreqPercent': {},
            'CTVSDFreqPercentSet': {},
            'CTPower': {},
            'CTElecUse': {},
            'CTRunNumber': {},
            'CTRunNumberSet': {},
            'CTSupplyT': {
                "filter": {
                    't': "range", 
                    'opt': ['1000 - 2000', '10000 - 100000', 'custom']
                    }
                },
            'CTReturnT': {},
            }
        }
