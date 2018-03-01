

(function () {
    var stateMap, jqueryMap, configMap,
        init, show, define_routes, setJqueryMap;

    stateMap = {
        $container: $(".page-content")
    };

    configMap = {
        dtu_server_host: '192.168.1.96:5001'
    };


    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $sideMenu: $('#side-menu')
        };
    };

    show = function () {
        beop.main.prototype.init($('.page-content'));
    };

    init = function ($container) {
        stateMap.$container = $container;

        //------------configure and initialize Models
        beop.ctModel.init();
        //------------configure and initialize views
        beop.view.sheet.configModel({
            sheetModel: beop.ctModel.sheetModel,
            dtu_server_host: configMap.dtu_server_host
        });

        beop.view.localeSheet.configModel({
            sheetModel: beop.ctModel.sheetModel
        });

        beop.view.real_time_data.configModel({
            sheetModel: beop.ctModel.sheetModel
        });

        beop.view.pointMapping.configModel({
            sheetModel: beop.ctModel.sheetModel
        });

        beop.view.server_manage.configModel({
            dtuModel: beop.ctModel.dtuModel,
            dtu_server_host: configMap.dtu_server_host
        });


        //beop.ws.init();
        //if (localStorage.getItem('current_project')) {
        //    beop.ws.enterProject(localStorage.getItem('current_project'));
        //}

        setJqueryMap();

        define_routes();

    };

    define_routes = function () { // 路由方法调用
        var last_route = '';
        var enterFunc = function (route) {
            jqueryMap.$sideMenu.children('li').removeClass('active');
            jqueryMap.$sideMenu.find('li a[href="' + route + '"]').parents('li').addClass('active');
        };

        var exitFunc = function (route) {
            last_route = route;
        };

        Path.map("#pointTable(/:page)").enter(function () {
            enterFunc("#pointTable");
        }).to(function () {
            var page = typeof this.params['page'] === 'undefined' ? 1 : this.params['page'];
            beop.view.sheet.init(stateMap.$container, page);
        }).exit(function () {
            beop.view.sheet.destroy();
            exitFunc("#pointTable");
        });

        Path.map("#setting").enter(function () {
            enterFunc("#setting");
        }).to(function () {
            beop.view.sheet.loadPointSetting(stateMap.$container);
        }).exit(function () {
            exitFunc("#setting");
        });

        Path.map("#settingNameRule").enter(function () {
        }).to(function () {
            beop.view.standardName.init(stateMap.$container);
        }).exit(function () {
            exitFunc("#settingNameRule");
        });

        Path.map("#log").enter(function () {
            enterFunc("#log");
        }).to(function () {
            beop.view.operation_record.init(stateMap.$container);
        }).exit(function () {
            exitFunc("#log");
        });

        Path.map("#locale(/:page)").enter(function () {
            enterFunc("#locale");
        }).to(function () {
            var page = typeof this.params['page'] === 'undefined' ? 1 : this.params['page'];
            beop.view.localeSheet.init(stateMap.$container, page);
        }).exit(function () {
            beop.view.localeSheet.destroy();
            exitFunc("#locale(/:page)");
        });

        Path.map("#server").enter(function () {
            enterFunc("#server");
        }).to(function () {
            beop.view.server_manage.init(stateMap.$container);
        }).exit(function () {
            exitFunc("#server");
            beop.view.server_manage.destroyServerDetail();
        });

        Path.map("#server/:projectId").enter(function () {
            enterFunc("#server");
        }).to(function () {
            var projectId = this.params['projectId'];
            beop.view.server_manage.loadServerDetail(projectId, stateMap.$container);
        }).exit(function () {
            exitFunc("#server");
            beop.view.server_manage.destroyServerDetail();
        });

        Path.map("#engine").enter(function () {
            enterFunc("#engine");
        }).to(function () {
            beop.view.engine_debugging.init(stateMap.$container);
        }).exit(function () {
            exitFunc("#engine");
        });

        Path.map("#realTimeData").enter(function () {
            enterFunc("#realTimeData");
        }).to(function () {
            beop.view.real_time_data.init(stateMap.$container, '', 1);
        }).exit(function () {
            beop.view.real_time_data.destroy();
            exitFunc("#realTimeData");
        });

        Path.map("#realTimeData(/:page)").enter(function () {
            enterFunc("#realTimeData");
        }).to(function () {
            var page = typeof this.params['page'] === 'undefined' ? 1 : this.params['page'];
            if (last_route === '#realTimeData(/:page)') {
                beop.view.real_time_data.refreshPointList(page);
            } else if (last_route === '#realTimeData'){

            } else {
                beop.view.real_time_data.init(stateMap.$container, '', 1);
            }
        }).exit(function () {
            beop.view.real_time_data.destroy();
            exitFunc("#realTimeData(/:page)");
        });

        Path.map("#pointMapping(/:page)").enter(function () {
            enterFunc("#pointMapping");
        }).to(function () {
            var page = typeof this.params['page'] === 'undefined' ? 1 : this.params['page'];
            if (last_route === '#pointMapping(/:page)') {
                beop.view.pointMapping.loadSheet();
            } else {
                beop.view.pointMapping.init(stateMap.$container, '', page);
            }
        }).exit(function () {
            beop.view.pointMapping.destroy();
            exitFunc("#pointMapping(/:page)");
        });


        Path.map("#pointMapping/:text/:page").enter(function () {
            enterFunc("#pointMapping");
        }).to(function () {
            var page = typeof this.params['page'] === 'undefined' ? 1 : this.params['page'];
            var text = typeof this.params['text'] === 'undefined' ? '' : this.params['text'];
            if (last_route === '#pointMapping/:text/:page') {
                beop.view.pointMapping.loadSheet();
            } else {
                beop.view.pointMapping.init(stateMap.$container, text, page);
            }
        }).exit(function () {
            beop.view.pointMapping.destroy();
            exitFunc("#pointMapping/:text/:page");
        });

        Path.map("#autoMapping").enter(function () {
            enterFunc("#pointMapping");
        }).to(function () {
            beop.view.autoMapping.init(stateMap.$container);
        }).exit(function () {
            beop.view.autoMapping.destroy();
            exitFunc("#autoMapping");
        });

        Path.map("#autoMapping/result").enter(function () {
            enterFunc("#pointMapping");
        }).to(function () {
            beop.view.autoMappingResult.init(stateMap.$container);
        }).exit(function () {
            beop.view.autoMappingResult.destroy();
            exitFunc("#autoMapping");
        });

        Path.root("#pointTable");
        Path.listen();
    };

    var _main = function () {

    };
    _main.prototype = {
        init: init,
        show: show
    };

    beop.main = _main;
}(beop || (beop = {})));
var beop = beop || {};
beop.main.prototype.show();

var spinner = new LoadingSpinner({color: '#00FFFF'});
var I18n = new Internationalization();