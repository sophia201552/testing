from .ParamBase import ParamBase

class ParamOutput(ParamBase):
    def __init__(self, data):
        ParamBase.__init__(self, data)
        # 是否需要传递，True：数据源、中间量等
        self.isPassed = False