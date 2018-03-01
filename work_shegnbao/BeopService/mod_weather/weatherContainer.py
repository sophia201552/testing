__author__ = 'may'

import json
import logging
from mod_DataAccess.BEOPDataAccess import *
from mod_weather import bp_weather
from mod_weather.HeFengWeather import HeFengWeather
from mod_weather.OpenWeather import OpenWeather

weather_conn = BEOPMongoDataAccess(app.config.get('WEATHER_DB_IP'), False, 'weatherdata')

@bp_weather.route('/set/weatherCityInfo/<heFengStationId>', methods=['GET'])
def setWeatherCityInfo(heFengStationId):
    rv = {'error': True}
    try:
        data = {}
        data['heFengStationId'] = heFengStationId
        data['_id'] = heFengStationId
        projInfo = HeFengWeather.search_city_by_cityid(heFengStationId)
        if projInfo:
            lat = projInfo.get('lat')
            lon = projInfo.get('lon')
            data['lat'] = lat
            data['lon'] = lon
            data['prov'] = projInfo.get('prov')
            data['cnty'] = projInfo.get('cnty')
            data['city'] = projInfo.get('city')
            openWeatherInfo = OpenWeather.get_info_by_latLon(lon, lat)
            data['openStationId'] = openWeatherInfo.get('id')
            if MongoConnManager.getConfigConn().saveWeatherCityInfo(data):
                rv['error'] = False
    except Exception as e:
        logging.error('setWeatherCityInfo failed' + e.__str__())
        rv['error'] = True
        print(e.__str__())
    return json.dumps(rv)


@bp_weather.route('/get_weather_stations', methods=['GET'])
def getWeatherstationIds():
    rv = BEOPDataAccess.getInstance().getWeatherstationIds()
    return json.dumps({'data': rv})


@bp_weather.route('/save_weather_data/<timeat>', methods=['GET'])
def saveWeatherData(timeat):
    rt = True
    try:
        timeObj = datetime.strptime(timeat, '%Y-%m-%d %H:%M:%S')
        timeUTCObj = timeObj + timedelta(hours=-8)
        allCityWeather = {}
        openStationIds = []
        allCityInfo = MongoConnManager.getConfigConn().getAllWeatherCityInfo()
        try:
            for item in allCityInfo:
                openStationId = item.get('openStationId')
                heFengStationId = item.get('heFengStationId')
                id = item.get('_id')
                allCityWeather[heFengStationId] = {'id': id, 'heFengStationId': heFengStationId,
                                                   'openStationId': openStationId, 'weather': {}}
                openStationIds.append(str(openStationId))
                # 获取和风的天气数据
                try:
                    heFengWeather = HeFengWeather.get_current_weather(heFengStationId)
                    if heFengWeather:
                        allCityWeather[heFengStationId]['weather']['heFeng'] = heFengWeather
                except Exception:
                    logging.error("获取和风天气出错! timeat=%s, id=%s", timeat, id, exc_info=True, stack_info=True)
        except Exception:
            logging.error("allCityInfo error! timeat=%s", timeat, exc_info=True, stack_info=True)

        # 获取openWeather的天气数据，因为单个查询有数量限制，所以采用一次查多个stationId的方式查询
        try:
            OpenWeaList = OpenWeather.get_weather_by_group_ids(openStationIds)
            for openWea in OpenWeaList:
                openStationId = openWea.get('id')
                if openStationId:
                    heFengInfo = MongoConnManager.getConfigConn().getOpenIdByHeFengId(openStationId)
                    if heFengInfo:
                        heFengId = heFengInfo.get('heFengStationId')
                        if heFengId:
                            allCityWeather[heFengId]['weather']['open'] = openWea
        except Exception:
            logging.error("获取openWeather错误! timeat=%s", timeat, exc_info=True, stack_info=True)

        # 存入历史天气数据库
        for key, value in allCityWeather.items():
            id = value.get('id')
            weather = value.get('weather')
            if id and weather:
                try:
                    weather_conn.saveWeatherData(weather, timeUTCObj, id)
                    logging.info("存入天气" + id)
                except Exception:
                    logging.error("存入天气错误! timeat=%s, id=%s", timeat, id, exc_info=True, stack_info=True)
    except Exception as e:
        rt = dict(msg=e.__str__())
        logging.error('saveWeatherData failed! timeat=%s', timeat, exc_info=True, stack_info=True)
    return json.dumps(rt, ensure_ascii=False)
