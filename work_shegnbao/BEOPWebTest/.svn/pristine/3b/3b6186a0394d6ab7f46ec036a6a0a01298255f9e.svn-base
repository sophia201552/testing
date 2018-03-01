class BaseIOT(object):
    """description of class"""

    params = {}
    config = {"attrs": {}}

    def __init__(self, params):
        self.params = params

    def getClass(self, i18n):
        jsonConfig = self.config

        jsonConfig['name'] = i18n.get(self.__class__.__name__)
        jsonConfig['parent'] = self.__class__.__mro__[1].__name__
        attrs = jsonConfig['attrs']
        for attr in attrs:
            attrs[attr]['name'] = i18n.get(attr)

        return jsonConfig