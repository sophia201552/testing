from .ParamInput import ParamInput

class ParamInputRef(ParamInput):
    def __init__(self, data, module):
        ParamInput.__init__(self, data, module)
        self._id = data.get('refOutputId', '')