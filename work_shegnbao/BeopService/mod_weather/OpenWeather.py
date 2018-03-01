# -*- coding:utf-8 -*-

import requests
import json
import logging


class OpenWeather:
    """
    免费用户每分钟可以使用60次。
    Availability：95%
    官网:http://openweathermap.org/api
    """
    FREE_KEY = 'f800fc200c81e99f6761beb1c746e48f'
    FREE_API_PREFIX = 'http://api.openweathermap.org/data/2.5/'

    @staticmethod
    def get_info_by_latLon(lon, lat):
        """
        :param lon: 经度
        :param lat: 纬度
        :return: 天气
        """
        rt = False
        try:
            url = '%sweather?lat=%s&lon=%s&appid=%s' % (OpenWeather.FREE_API_PREFIX, lat, lon, OpenWeather.FREE_KEY)
            req = requests.get(url, timeout=5)
            if req.status_code == 200:
                rt = json.loads(req.text)
                return rt
        except Exception as e:
            print(e.__str__())
        return rt

    @staticmethod
    def get_weather_by_group_ids(ids):
        rt = []
        try:
            def getWeatherOnce(idStr):
                getWeatherRT = None
                try:
                    url = '%sgroup?id=%s&appid=%s' % (OpenWeather.FREE_API_PREFIX, idStr, OpenWeather.FREE_KEY)
                    req = requests.get(url, timeout=10)
                    if req.status_code == 200:
                        getWeatherRT = json.loads(req.text)
                except Exception as e:
                    print('getWeatherOnce error ' + e.__str__())
                    logging.error('getWeatherOnce error ' + e.__str__())
                return getWeatherRT

            idsLen = len(ids)
            i = 0
            while i < idsLen:
                curIds = ids[i: i + 20]
                curIdsStr = ','.join(curIds)
                i = i + 20
                curRt = getWeatherOnce(curIdsStr)
                # 免费接口的服务器不稳定，如果取不到再多取两次
                if not curRt:
                    curRt = getWeatherOnce(curIdsStr)
                if not curRt:
                    curRt = getWeatherOnce(curIdsStr)
                if curRt:
                    curList = curRt.get('list')
                    if curList:
                        rt += curList
        except Exception as e:
            print(e.__str__())
        return rt
