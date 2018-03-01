/// <reference path="../lib/jquery-2.1.4.min.js" />

var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var Spinner = new LoadingSpinner({ color: '#00FFFF' });        //等待加载时的转圈圈
var ScreenCurrent = undefined;                                 //前一页面对象的引用
//var navigation = responsiveNav("#navbar-collapse");          //响应式导航条
var AppConfig = {
    userId: undefined,
    account: undefined,
    isMobile: true
}; //基础配置文件
var ProjectConfig = {
    projectId:undefined,
    projectIndex:undefined,
    projectList:undefined,
    projectInfo:undefined,
    dashboardList:undefined,
    summaryList:undefined,
    summaryDetail:undefined,
    summaryId:undefined,
    summaryIndex:undefined,
    refreshTime:undefined,
    refreshInterval:7200000
};//报表配置文件
var WkConfig = {
    defaultSize : 13,
    wkList : {
        working:[],
        created:[],
        finished:[],
        joined:[]
    },
    refreshTime:undefined,
    refreshInterval: 1800000
};//工单配置文件
var I18n = undefined;                                          //国际化对象的引用

// 项目配置信息持久化存储管理
var appConfigManager = (function () {

    var DEFAULT_CONFIG = {
        // 默认 gps 为关闭状态
        gps: 0
        // ...
    };

    function get() {
        var options = window.localStorage.getItem('appConfig');

        if(options === null) {
            set(DEFAULT_CONFIG);
            return DEFAULT_CONFIG;
        }

        try { options = JSON.parse(options); } catch(e) {}

        return options;
    }

    function set(options) {
        window.localStorage.setItem( 'appConfig', JSON.stringify(options) );
    }

    return {
        get: get,
        set: set
    }

} ());

$(document).ready(function () {
    if (navigator.userAgent.match(/iP(ad|hone|od)|Android/i)) AppConfig.isMobile = true;
    InitI18nResource(navigator.language.split('-')[0]).always(function (rs) {
        I18n = new Internationalization(null, rs);
        Init();
    });
});
function Init(){
    I18n.fillArea($(".navbar"));
}