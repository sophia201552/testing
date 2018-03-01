from copy import copy
from bson.objectid import ObjectId
from .BaseIOT import BaseIOT


class Thing(BaseIOT):
    """description of class"""

    #params, ex:    
    #{
    #    "_id": ObjectId("5555a1137ddcf32fbc302222"),
    #    "_idGrp": ObjectId("2232a1137ddcf32fbc302113"),
    #    "prefix": "",
    #    "arrP": ["point221", "point222", "point223"],
    #    "path": "",
    #    "name": "thing2",
    #    "type": "Thing"
    #}
    
    def toJson(self):
        data = {}
        data["_id"] = self.params.get("_id").__str__()

        arrIdGrp = []
        for x in self.params.get("arrIdGrp"):
            arrIdGrp.append(x.__str__())

        data["pId"] = arrIdGrp
        data["prefix"] = self.params.get("prefix")
        data["arrP"] = self.params.get("arrP")
        data["unArrP"] = self.params.get("unArrP")
        data["name"] = self.params.get("name")
        data["type"] = self.params.get("type")
        data["path"] = self.params.get("path")
        data["projId"] = self.params.get("projId")
        data["params"] = self.params.get("params")
        data["link"] = self.params.get("link")
        data["icon"] = self.icon

        #data = copy(self.params)
        #data["_id"] = data.get("_id").__str__()
        #data["pId"] = data.get("_idGrp").__str__()
        #data["_idGrp"] = None
        return data

    def parseJson(self, json):
        data = json
        #data["_id"] = ObjectId(json.get("_id"))
        #data["_idGrp"] = ObjectId(json.get("pId"))
        return data
