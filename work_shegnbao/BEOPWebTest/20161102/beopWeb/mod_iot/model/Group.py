from copy import copy
from bson.objectid import ObjectId
from .BaseIOT import BaseIOT

class Group(BaseIOT):
    """description of class"""

    #params, ex: 
    #    {
    #        "_id": ObjectId("2232a1137ddcf32fbc302113"), 
    #        "_idProj": ObjectId("111151137ddcf32fbc302111"),
    #        "_idPrt": ObjectId("2222a1137ddcf32fbc302111"),
    #        "prefix": "18F",
    #        "arrP": ["_energy_total331", "_energy_total332"],
    #        "name": "18F",
    #        "type": "Group",
    #        "weight": 0
    #}

    def toJson(self):
        data = {}
        data["_id"] = self.params.get("_id").__str__()
        data["_idProj"] = self.params.get("_idProj").__str__()
        data["pId"] = self.params.get("_idPrt").__str__()
        data["prefix"] = self.params.get("prefix")
        data["arrP"] = self.params.get("arrP")
        data["name"] = self.params.get("name")
        data["type"] = self.params.get("type")
        data["weight"] = self.params.get("weight")
        data["projId"] = self.params.get("projId")
        data["params"] = self.params.get("params")

        #data = copy(self.params)
        #data["_id"] = data.get("_id").__str__()
        #data["_idProj"] = data.get("_idProj").__str__()
        #data["pId"] = data.get("_idPrt").__str__()
        #data["_idPrt"] = None
        return data

    def parseJson(self, json):
        data = json
        data["_id"] = ObjectId(json.get("_id"))
        data["_idProj"] = ObjectId(json.get("_idProj"))
        data["_idPrt"] = ObjectId(json.get("pId"))
        return data
