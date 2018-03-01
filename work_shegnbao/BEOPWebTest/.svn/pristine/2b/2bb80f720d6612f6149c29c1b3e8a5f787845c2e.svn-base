class Factory(object):
    """description of class"""

    dictPath = {}
    dictCacheClass = {}

    def regist(self, className, path):
        self.dictPath[className] = path

    def new(self, className):
        #if class is exist in cache, get the class from cache at first
        curClass = self.dictCacheClass.get(className)

        if(curClass == None):
            path = self.dictPath.get(className)
            if(path == None): return {}
            if path != '': path += "."
            path = "beopWeb.mod_iot.model." + path + className

            module = __import__(path, None, None, [className])
            curClass = getattr(module, className)
            self.dictCacheClass[className] = curClass

        return curClass

    def getClassFamily(self, type):
        if type in ['project', 'group', 'thing']: 
            baseClassName = type.capitalize()
        else: return {}

        dictClass = {}
        dictClass[baseClassName] = self.new(baseClassName)
        for clsName in self.dictPath:
            path = self.dictPath[clsName]
            if path != '' and path.find(type, 0, len(type)) == 0:
                dictClass[clsName] = self.new(clsName)
        return dictClass

    def getClassDetail(self,type):
        return self.new(type)

    def clear(self): 
        self.dictPath = {}
        self.dictCacheClass = {}