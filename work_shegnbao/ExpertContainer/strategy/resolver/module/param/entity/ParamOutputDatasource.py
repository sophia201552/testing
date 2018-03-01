from .ParamOutput import ParamOutput

class ParamOutputDatasource(ParamOutput):
    def __init__(self, data):
        ParamOutput.__init__(self, data)
        self.isPassed = True

    def after(self):
        # TODO:
        # request.post("set_realtime_data", {})
        pass