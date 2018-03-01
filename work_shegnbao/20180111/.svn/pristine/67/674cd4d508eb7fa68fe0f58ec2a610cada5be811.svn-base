class BaseIOT(object):
    """description of class"""

    params = {}
    config = {"attrs": {}}
    icon = None
    skin = None

    def __init__(self, params):
        self.params = params

    def getClass(self, i18n):
        jsonConfig = self.config

        jsonConfig['name'] = i18n.get(self.__class__.__name__)
        jsonConfig['parent'] = self.__class__.__mro__[1].__name__
        attrs = jsonConfig['attrs']
        for attr in attrs:
            attrs[attr]['name'] = i18n.get(attr)
        if (jsonConfig.get('links') is not None):
            inputLink = jsonConfig['links']['in']
            outputLink = jsonConfig['links']['out']
            for input in inputLink:
                inputLink[input]['name'] = i18n.get(input)
            for output in outputLink:
                outputLink[output]['name'] = i18n.get(output)

        return jsonConfig

    def getSkin(self, i18n):
        return self.skin