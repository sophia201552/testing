from copy import copy
from bson.objectid import ObjectId
from .BaseIOT import BaseIOT


class Project(BaseIOT):
    """description of class"""

    lang = 'cn'

    #params, ex: 
    #{
    #    "_id": ObjectId("111151137ddcf32fbc302111"),
    #    "_idMgt": ObjectId("000051137ddcf32fbc302111"),
    #    "codeName": 111,
    #    "dictName": { "cn": 'cn111', "en": 'en111' },
    #    "latLng": '20,20',
    #    "arrP": ['111_energy_total', '111_energy_total2', '111_energy_total'],
    #    "type": "Project"
    #},

    def toJson(self):
        data = {}
        data["_id"] = self.params.get("_id").__str__()
        data["_idMgt"] = self.params.get("_idMgt").__str__()
        data["codeName"] = self.params.get("codeName")
        data["name"] = self.params.get("dictName").get(self.lang)
        data["arrP"] = self.params.get("arrP")
        data["type"] = self.params.get("type")
        data["latLng"] = self.params.get("latLng")
        data["projId"] = self.params.get("projId")
        data["params"] = self.params.get("params")

        #data = copy(self.params)
        #data["_id"] = data.get("_id").__str__()
        #data["_idMgt"] = data.get("_idProj").__str__()
        return data

    def parseJson(self, json):
        data = json
        data["_id"] = ObjectId(json.get("_id"))
        data["_idMgt"] = ObjectId(json.get("_idProj"))
        return data
