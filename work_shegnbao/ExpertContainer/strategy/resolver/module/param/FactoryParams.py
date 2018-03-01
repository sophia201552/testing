class FactoryParam(object):
    """description of class"""

    dictPath = {}
    dictCacheClass = {}

    def regist(self, moduleType, path):
        self.dictPath[moduleType] = path

    def new(self, moduleType):
        #if class is exist in cache, get the class from cache at first
        curClass = self.dictCacheClass.get(moduleType)

        if(curClass == None):
            path = self.dictPath.get(moduleType)
            if(path == None): return {}
            className = path    #TODO: 暂不支持二级目录
            path = "strategy.resolver.module.param.entity." + path

            module = __import__(path, None, None, [className])
            curClass = getattr(module, className)
            self.dictCacheClass[moduleType] = curClass

        return curClass

    def getClassDetail(self,type):
        return self.new(type)

    def clear(self): 
        self.dictPath = {}
        self.dictCacheClass = {}