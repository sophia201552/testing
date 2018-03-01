(function (beop) {
    var configMap = {
            htmlURL: '/point_tool/html/server',
            serverDetailURL: '/static/app/CxTool/views/serverManage.html',
            settable_map: {
                dtuModel: true,
                dtu_server_host: ''
            },
            dtu_server_host: '',
            dtuModel: null,
            statusRefreshTime: 2000
        },
        stateMap = {},
        jqueryMap = {},
        setJqueryMap, configModel, loadServerStatus, enterProject, loadServerDetail,
        getServerDetail, restartCore, destroyServerDetail, getCoreVersion,
        init;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $serverContainer: $container.find('#serverContainer'),
            $serverRestartBtn: $container.find('#serverRestartBtn'),
            $statusDisk: $container.find('#status-disk'),
            $statusCpu: $container.find('#status-cpu'),
            $statusMemory: $container.find('#status-memory'),
            $statusTime: $container.find('#status-time'),
            $coreUpdateTime: $container.find('#coreUpdateTime'),
            $coreVersion: $container.find('#coreVersion')
        };
    };

    configModel = function (input_map) {
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    init = function ($container) {
        stateMap.$container = $container;
        $.get(configMap.htmlURL).done(function (resultHtml) {
            stateMap.$container.html(resultHtml);
            setJqueryMap();
            loadServerStatus();
            jqueryMap.$serverContainer.on('click', '#servers_table tr', enterProject);
            I18n.fillArea(stateMap.$container);
        });
    };

    //---------DOM操作------


    //---------方法---------
    loadServerStatus = function () {
        configMap.dtuModel.loadServerStatus().done(function (result) {
            if (result.success) {
                jqueryMap.$serverContainer.html(beopTmpl('tpl_server_status', {statues: result.data}));
            }
        });
    };

    enterProject = function () {
        location.hash = '#server/' + $(this).attr('dtu');
    };

    loadServerDetail = function (dtu, $container) {
        stateMap.dtu_name = dtu;
        $.get(configMap.serverDetailURL).done(function (resultHtml) {
            if (!stateMap.$container) {
                stateMap.$container = $container;
            }
            stateMap.$container.html(resultHtml);
            I18n.fillArea(stateMap.$container);
            setJqueryMap();
            stateMap.serverDetailTimeoutId = 0;
            getServerDetail();
            jqueryMap.$serverRestartBtn.click(restartCore);
            getCoreVersion();
        });
    };

    getServerDetail = function () {
        return $.ajax({
            type: 'GET',
            url: 'http://' + configMap.dtu_server_host + '/serverDetail/' + stateMap.dtu_name,
            crossDomain: true
        }).done(function (result) {
            if (result.success) {
                if (!result.data) {
                    return;
                }
                var disk_info = '';
                if (result.data.disk) {
                    var disk_info_list = result.data.disk.split('/');
                    disk_info = Math.floor(disk_info_list[0] / 1024) + 'G/' + Math.floor(disk_info_list[1] / 1024) + 'G';
                }
                jqueryMap.$statusDisk.text(disk_info);
                jqueryMap.$statusCpu.text(result.data.cpu + '%');
                jqueryMap.$statusMemory.text(result.data.memory + '%');
                jqueryMap.$statusTime.text(result.data.time);
                if (result.data.version) {
                    jqueryMap.$coreVersion.text(result.data.version.core_version);
                    jqueryMap.$coreUpdateTime.text(result.data.version.core_update_time);
                }

            }
        }).fail(function () {
            //alert(I18n.resource.debugTools.info.SYSTEM_ERROR);
        }).always(function () {
            stateMap.serverDetailTimeoutId = setTimeout(function () {
                getServerDetail();
            }, configMap.statusRefreshTime);
        })
    };

    getCoreVersion = function () {
        return $.ajax({
            type: 'GET',
            url: 'http://' + configMap.dtu_server_host + '/getCoreVersion/' + stateMap.dtu_name,
            crossDomain: true
        }).done(function (result) {
            if (result.success) {
                jqueryMap.$coreUpdateTime.text(result.data ? result.data : '');
            }
        }).fail(function () {
            //alert(I18n.resource.debugTools.info.SYSTEM_ERROR);
        })
    };

    restartCore = function () {
        spinner.spin(jqueryMap.$container.get(0));
        $.ajax({
            type: 'POST',
            url: 'http://' + configMap.dtu_server_host + '/resetCore/' + stateMap.dtu_name,
            crossDomain: true,
            dataType: 'json'
        }).done(function (result) {
            if (result.success) {
                alert(I18n.resource.debugTools.info.RESTART_CORE_SUCCESSFUL);
            } else {
                alert(result.msg);
            }
        }).fail(function () {
            //alert(I18n.resource.debugTools.info.SYSTEM_ERROR);
        }).always(function () {
            spinner.stop();
        })
    };

    destroyServerDetail = function () {
        clearTimeout(stateMap.serverDetailTimeoutId);
    };

//---------事件---------


//---------Exports---------
    beop.view = beop.view || {};

    beop.view.server_manage = {
        configModel: configModel,
        loadServerDetail: loadServerDetail,
        destroyServerDetail: destroyServerDetail,
        init: init
    };
}(beop || (beop = {})));
