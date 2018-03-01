# -*- coding:utf-8 -*-

import requests, json

class HeFengWeather:
    """
    免费用户每天4000次访问量
    """
    FREE_KEY = 'cd306c83da7c47a7b9fc350dc3492368'#注册的免费key
    KEY = 'd8a6feec93e34d2284cf932adf3270b3'#收费key，2018年7月5号到期
    FREE_API_PREFIX = 'https://free-api.heweather.com/v5/'#免费的url
    PAYMENT_API_PREFIX = 'https://api.heweather.com/v5/'#收费的url

    @staticmethod
    def search_city_by_cnname(cityname):
        """
        通过此接口获取城市信息
        :param cityname: 北京
        :return:
        """
        if isinstance(cityname, str) and len(cityname) > 0:
            url = (HeFengWeather.PAYMENT_API_PREFIX + "search?" +
                   "city=" + cityname + "&key=" + HeFengWeather.KEY)
            rt = requests.get(url, timeout=3)
            if rt.status_code == 200:
                rt = json.loads(rt.text)
                info = rt.get('HeWeather5')
                if info:
                    rt = info[0]
                    if rt.get('status') == 'ok':
                        return rt.get('basic')
        return None

    @staticmethod
    def search_city_by_enname(cityname):
        """
        通过此接口获取城市信息
        :param cityname: beijing
        :return:
        """
        if isinstance(cityname, str) and len(cityname) > 0:
            url = (HeFengWeather.PAYMENT_API_PREFIX + "search?" +
                   "city=" + cityname + "&key=" + HeFengWeather.KEY)
            rt = requests.get(url, timeout=3)
            if rt.status_code == 200:
                rt = json.loads(rt.text)
                info = rt.get('HeWeather5')
                if info:
                    rt = info[0]
                    if rt.get('status') == 'ok':
                        return rt.get('basic')
        return None

    @staticmethod
    def search_city_by_cityid(cityid):
        """
        通过此接口获取城市信息
        :param cityid: CN101010100
        :return:
        """
        if isinstance(cityid, str) and len(cityid) > 0:
            url = (HeFengWeather.PAYMENT_API_PREFIX + "search?" +
                   "city=" + cityid + "&key=" + HeFengWeather.KEY)
            rt = requests.get(url, timeout=3)
            if rt.status_code == 200:
                rt = json.loads(rt.text)
                info = rt.get('HeWeather5')
                if info:
                    rt = info[0]
                    if rt.get('status') == 'ok':
                        return rt.get('basic')
        return None

    @staticmethod
    def search_city_by_cityip(cityip):
        """
        通过此接口获取城市信息
        :param cityip: 60.194.130.1
        :return:
        """
        if isinstance(cityip, str) and len(cityip) > 0:
            url = (HeFengWeather.PAYMENT_API_PREFIX + "search?" +
                   "city=" + cityip + "&key=" + HeFengWeather.KEY)
            rt = requests.get(url, timeout=3)
            if rt.status_code == 200:
                rt = json.loads(rt.text)
                info = rt.get('HeWeather5')
                if info:
                    rt = info[0]
                    if rt.get('status') == 'ok':
                        return rt.get('basic')
        return None

    @staticmethod
    def search_city_by_lonlat(lon, lat):
        """
        通过此接口获取城市信息
        :param lon: 116.391000
        :param lat: 39.904000
        :return:
        """
        if isinstance(lon, str) and isinstance(lat, str):
            if len(lon) > 0 and len(lat) > 0:
                url = (HeFengWeather.PAYMENT_API_PREFIX + "search?" +
                       "city=" + lon + ',' + lat + "&key=" + HeFengWeather.KEY)
                rt = requests.get(url, timeout=3)
                if rt.status_code == 200:
                    rt = json.loads(rt.text)
                    info = rt.get('HeWeather5')
                    if info:
                        rt = info[0]
                        if rt.get('status') == 'ok':
                            return rt.get('basic')
        return None

    @staticmethod
    def get_current_weather(cityid):
        """
        通过城市的id获取实时天气
        :param cityid:CN101010100 
        :return: 
        """

        if isinstance(cityid, str) and len(cityid) > 0:
            url = (HeFengWeather.PAYMENT_API_PREFIX + "now?" +
                   "city=" + cityid + "&key=" + HeFengWeather.KEY)
            rt = requests.get(url, timeout=3)
            if rt.status_code == 200:
                rt = json.loads(rt.text)
                info = rt.get('HeWeather5')
                if info:
                    rt = info[0]
                    if rt.get('status') == 'ok':
                        info = rt.get('now')
                        basic = rt.get('basic')
                        if basic:
                            update_time = basic.get('update')
                            if update_time:
                                info['update_utc'] = update_time.get('utc')
                        return info
        return None

    @staticmethod
    def free_get_all(id):
        """
        通过城市的id获取全部的天气信息
        :param id: 
        :return: 
        """
        pass

    @staticmethod
    def free_get_forecast_daily(id):
        """
        通过城市id获取天气预报，免费用户仅获得3天预报数据
        :param id: 
        :return: 
        """
        pass

    @staticmethod
    def free_get_forecast_hourly(id):
        """
        通过城市id获取小时的预报，免费用户仅可获得当天每三小时的预报数据
        :param id: 
        :return: 
        """
        pass

    @staticmethod
    def free_get_airquality_and_forecastaqi(id):
        """
        通过用户id获取天气质量和空气质量指数预报，免费用户仅可获取当天AQI实况数据
        :param id: 
        :return: 
        """
        pass

    @staticmethod
    def free_get_living_index(id):
        """
        通过用户id获取生活指数，目前提供7大生活指数，每三小时更新，仅限国内城市包含此数据
        :param id: 
        :return: 
        """
        pass