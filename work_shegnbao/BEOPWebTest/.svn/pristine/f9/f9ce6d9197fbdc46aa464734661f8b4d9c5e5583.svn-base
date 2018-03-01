(function () {
    var stateMap, jqueryMap, configMap,
        init, show, define_routes, setJqueryMap;

    stateMap = {
        $container: $(".page-content")
    };

    configMap = {
        dtu_server_host: null
    };

    setJqueryMap = function () {
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

        beop.view.cloudSheet.configModel({
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
        Permission.check(document.body);
    };

    define_routes = function () { // 路由方法调用
        var last_route = '';
        var enterFunc = function (route) {
            //Alert.closeAll();   报错先注释了
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
            if (last_route === '#pointTable(/:page)') {
                beop.view.sheet.loadSheet(page);
            } else if (last_route === '#pointTable') {
                beop.view.sheet.loadSheet(page);
            } else {
                beop.view.sheet.init(stateMap.$container, page);
            }
        }).exit(function () {
            beop.view.sheet.destroy();
            exitFunc("#pointTable");
        });

        Path.map("#log").enter(function () {
            enterFunc("#log");
        }).to(function () {
            beop.view.operation_record.init(stateMap.$container);
        }).exit(function () {
            exitFunc("#log");
        });

        Path.map("#cloud(/:page)").enter(function () {
            enterFunc("#cloud");
        }).to(function () {
            var page = typeof this.params['page'] === 'undefined' ? 1 : this.params['page'];
            if (last_route === '#cloud(/:page)') {
                beop.view.cloudSheet.onLoadSheet(page);
            } else if (last_route === '#cloud') {
                beop.view.cloudSheet.onLoadSheet(page);
            } else {
                beop.view.cloudSheet.init(stateMap.$container, page);
            }
        }).exit(function () {
            beop.view.cloudSheet.destroy();
            exitFunc("#cloud(/:page)");
        });

        Path.map("#server").enter(function () {
            enterFunc("#server");
        }).to(function () {
            beop.view.server_manage.init(stateMap.$container);
        }).exit(function () {
            exitFunc("#server");
            beop.view.server_manage.destroyServerDetail();
        });

        Path.map("#server/:projectId/:dtuName").enter(function () {
            enterFunc("#server");
        }).to(function () {
            beop.view.server_manage.loadServerDetail(this.params['projectId'], this.params['dtuName'], stateMap.$container);
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
            beop.view.real_time_data.init(stateMap.$container, 1);
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
            } else if (last_route === '#realTimeData') {
                beop.view.real_time_data.refreshPointList(page);
            } else {
                location.hash = "#realTimeData";
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

        Path.root("#server");
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
