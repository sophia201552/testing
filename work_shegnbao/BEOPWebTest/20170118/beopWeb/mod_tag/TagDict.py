__author__ = 'win7'
import os
import csv


class TagDict:
    @staticmethod
    def get_list():
        storage = []
        with open(os.path.dirname(os.path.realpath(__file__)) + '/basicTag.csv', newline='', encoding='utf8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                storage.append({
                    'name': row[0],
                    'en': row[1],
                    'zh': row[2],
                    'type': row[3] if row[3] else ''
                })
        return storage

    @staticmethod
    def get_dict():
        storage = TagDict.get_list()
        return {item.get('name').upper(): item for item in storage}
