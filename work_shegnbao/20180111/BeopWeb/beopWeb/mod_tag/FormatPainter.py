import re
import itertools
from bson import ObjectId
from beopWeb.MongoConnManager import MongoConnManager
from functools import reduce
from collections import Counter, OrderedDict


class FormatPainter:
    def __init__(self, project_id, source_id_list, target_id_list):
        self.project_id = project_id
        self.source_id_list = source_id_list
        self.target_id_list = target_id_list
        self.cloud_point = MongoConnManager.getConfigConn().mdbBb['cloudPoint']

    def point_name_to_set(self, name):
        return set(filter(None, re.split("[, \-!?:_]+", name.lower())))

    def get_point_list(self, parent_id):
        point_list = list(self.cloud_point.find({'projId': self.project_id, 'prt': ObjectId(parent_id), 'type': 'thing'},
                                                {'name': 1, 'tag': 1}))
        for point in point_list:
            point['string_set'] = self.point_name_to_set(point['name'].lower())
        return point_list

    def get_extract_dict(self, point_list):
        # prepare point calc set
        for point in point_list:
            point['string_set_calc'] = set(point['string_set'])
            point['tag_set_calc'] = set(point['tag'])
        
        extract_dict = {}

        string_set_list = [ list(point['string_set_calc']) for point in point_list ]
        string_set_list_sum = reduce((lambda x, y: x + y), string_set_list)
        counter = Counter(string_set_list_sum)
        counter_dict = {}
        for item in counter.most_common():
            if counter_dict.get(item[1]):
                counter_dict[item[1]].append(item[0])
            else:
                counter_dict[item[1]] = [item[0], ]
        counter_dict = OrderedDict(sorted(counter_dict.items(), reverse=True))

        for count, string_list in counter_dict.items():
            for string in string_list:
                match_point_dict = {}
                public_tag_set = {}
                string_comb_list = [string, ]
                # get match point
                for string_same_count in counter_dict[count]:
                    for point in point_list:
                        if {string_same_count, }.issubset(point['string_set_calc']):
                            if match_point_dict.get(string_same_count):
                                match_point_dict[string_same_count].append(point)
                            else:
                                match_point_dict[string_same_count] = [point, ]

                for string_match, match_point_list in match_point_dict.items():
                    if string_match != string and match_point_list == match_point_dict[string]:
                        string_comb_list.append(string_match)
                        string_list.remove(string_match)

                # get public tag set
                if match_point_dict:
                    public_tag_set = set(reduce((lambda x, y: x & y), ( point['tag_set_calc'] for point in match_point_dict[string])))
                # filt string and tag set
                for match_point in match_point_dict[string]:
                    match_point['string_set_calc'] -= set(string_comb_list)
                    # match_point['tag_set_calc'] -= public_tag_set
                # add result to extract dict
                extract_dict[tuple(string_comb_list)] = public_tag_set

        return extract_dict    

    def string_set_to_tag(self, string_set, extract_dict):
        extract_dict = dict(extract_dict)
        tag_set = set()

        # full match
        key_need_del = []
        for extract_tuple, extract_tag in extract_dict.items():
            if set(extract_tuple).issubset(string_set):
                tag_set |= extract_tag
                string_set -= set(extract_tuple)
                key_need_del.append(extract_tuple)
        
        for key in key_need_del:
            del extract_dict[key]

        # fuzzy match
        fuzzy_string_set = set()
        for s in string_set:
            fuzzy_string_set.add(re.sub(r'\d+', '\d', s))
        for extract_tuple, extract_tag in extract_dict.items():
            fuzzy_extract_set = set()
            for t in extract_tuple:
                fuzzy_extract_set.add(re.sub(r'\d+', '\d', t))
            if fuzzy_extract_set.issubset(fuzzy_string_set):
                tag_set |= extract_tag
                string_set -= set(extract_tuple)

        all_set = True if not string_set else False
        return tag_set, all_set

    def update_target_tag(self, target_list, extract_dict):
        rv = []
        for point in target_list:
            tag_set_predict, all_set = self.string_set_to_tag(point['string_set'], extract_dict)
            if not all_set:
                rv.append(point)
            # all set or not
            self.update_tag(point['_id'], list(tag_set_predict))
        return rv
        
    def get_extract_dict_origin(self, source_point_list):
        extract_dict = {}
        for point in source_point_list:
            fuzzy_name = re.sub(r'\d+', '\d', point['name'].lower())
            extract_dict[fuzzy_name] = point['tag']
        return extract_dict

    def update_tag(self, point_id, tag_list):
        self.cloud_point.update({'projId': self.project_id, '_id': point_id}, {'$set': {'tag': tag_list}})

    def update_target_tag_origin(self, target_point_list, extract_dict_origin):
        rv = []
        for point in target_point_list:
            fuzzy_name = re.sub(r'\d+', '\d', point['name'])
            predict_tag_list = extract_dict_origin.get(fuzzy_name.lower())
            if predict_tag_list is not None:
                self.update_tag(point['_id'], predict_tag_list)
            else:
                rv.append(point)
        return rv

    def update_target_tag_public(self, source_point_list, target_point_list):
        if not target_point_list:
            return []
        source_point_public = reduce((lambda x, y: x & y), ( point['string_set'] for point in source_point_list))
        if source_point_public:
            for point in source_point_list:
                point['string_set_calc'] = point['string_set'] - source_point_public
        target_point_public = reduce((lambda x, y: x & y), ( point['string_set'] for point in target_point_list))
        if target_point_public:
            for point in target_point_list:
                point['string_set_calc'] = point['string_set'] - target_point_public
        for target_point in target_point_list[:]:
            for source_point in source_point_list:
                if source_point['string_set_calc'] == target_point['string_set_calc']:
                    target_point_list.remove(target_point)
                    self.update_tag(target_point['_id'], source_point['tag'])
                    break
        return target_point_list

    def update_target_directory_tag(self, source_id, target_id):
        source_id = ObjectId(source_id)
        target_id = ObjectId(target_id)
        tag_list = self.cloud_point.find_one({'_id': source_id}, {'tag': 1, '_id': 0}).get('tag')
        self.cloud_point.update_one({'_id': target_id}, {'$set': {'tag': tag_list}})

    def format_painter(self):
        source_point_list = []
        for source_id in self.source_id_list:
            source_point_list += self.get_point_list(source_id)
        extract_dict_origin = self.get_extract_dict_origin(source_point_list)
        extract_dict = self.get_extract_dict(source_point_list)
        for target_id in self.target_id_list:
            # update directory tag
            self.update_target_directory_tag(self.source_id_list[0], target_id)
            # update point tag with pipeline
            target_point_list = self.get_point_list(target_id)
            rv = self.update_target_tag_origin(target_point_list, extract_dict_origin)
            rv = self.update_target_tag_public(source_point_list, rv)
            rv = self.update_target_tag(rv, extract_dict)