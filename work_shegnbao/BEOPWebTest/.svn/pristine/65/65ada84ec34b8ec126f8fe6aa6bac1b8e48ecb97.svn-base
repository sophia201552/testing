/// <reference path="../spring/entities/modalCarbonFootprint.js" />
/// <reference path="../lib/jquery-2.1.4.js" />

var EnergyScreen = (function () {
    function EnergyScreen(id, store) {
        if (!id) {
            this.id = ScreenCurrent.id;
        } else {
            this.id = id;
        }
        this.factoryIoC = undefined;
        this.factoryIoCAnalysis = undefined;
        this.listEntity = undefined;
        this.mapRefresh = {};
        this.popRefresh = {};
        this.arrEntityOrder = undefined;
        this.requestPoints = [];
        this.dictPopToEntity = {};
        this.store = store ? store : undefined;
        this.container = undefined;

        if (store) {
            this.sharedesc = store.desc;
        }
        this.isForReport = store ? true : false;
        if (this.shareLogId) {
            this.isForReport = true;
        }
        this.isForBencMark = undefined;
        this.modalConfigPane = undefined;
        this.isConfigMode = false;
        this.workerUpdate = undefined;
        this.paneDatasource = undefined;
        this.arrColor = echarts.config.color;

        this.$obCanvasContainer = undefined;
        this.canvas = undefined;
        this.toolContainer = undefined;
    }

    EnergyScreen.prototype = {
        show: function () {
            this.container = document.getElementById('paneCenter');
            this.$obCanvasContainer = $(this.container);
            this.init();
        },

        close: function () {
            for (var key in this.listEntity) {
                this.listEntity[key].close();
            }

            if (this.workerUpdate) this.workerUpdate.terminate();
            this.workerUpdate = null;
            this.factoryIoC = null;
            this.factoryIoCAnalysis = null;
            this.listEntity = null;
            this.arrEntityOrder = null;
            this.store = null;
            this.container = null;
            this.dictPopToEntity = null;
            this.UNIT_WIDTH = null;
            this.UNIT_HEIGHT = null;
            AppConfig.datasource = null;
            this.paneDatasource && this.paneDatasource.close && this.paneDatasource.close();
            this.$obCanvasContainer = null;
            this.canvas = null;
            this.arrColor = null;
            this.mapRefresh = null;
            this.modalConfigPane = null;
            this.popRefresh = null;
            this.requestPoints = null;
            this.toolContainer = null;
            this.isForReport = null;
            this.isPlayback = null;

            this.shareLogId = null;
        },

        stop: function () {
            if (this.workerUpdate) this.workerUpdate.terminate();
        },

        onresize: function () {
            var entity;
            for (var key in ScreenCurrent.listEntity) {
                entity = ScreenCurrent.listEntity[key];
                if (entity.chart) entity.chart.resize();
                if (entity.entityAnalysis && entity.entityAnalysis.chart) entity.entityAnalysis.chart.resize();
            }
        },

        init: function () {
            var _this = this;

            Spinner.spin(ElScreenContainer);
            if (this.store) {
                initByData();
                Spinner.stop();
            } else {
                WebAPI.get("/spring/get/" + this.id).done(function (result) {
                    _this.store = result;
                    //_this.initStoreLayout = JSON.stringify(_this.store.layout);
                    initByData();
                }).always(function (e) {
                    Spinner.stop();
                });
            }
            function initByData() {
                //_this.paneDatasource = new DataSource(_this);
                //AppConfig.datasource = _this.paneDatasource;

                _this.initIoc();
                _this.initLayout();
                _this.initWorkerForUpdating();
            };
        },

        initIoc: function () {
            this.factoryIoC = new FactoryIoC('compatibleFrame');
        },

        initLayout: function () {
            this.listEntity = {};
            this.arrEntityOrder = [];

            if (!this.isForBencMark) {
                var side = new SidebarMenuEffect();
                side.init('#paneContent');
            }

            I18n.fillArea($('#toolBox'));

            if (!(this.store && this.store.layout)) return;
            for (var i = 0, item; i < this.store.layout.length; i++) {
                for (var j = 0; j < this.store.layout[i].length; j++) {
                    item = this.store.layout[i][j];
                    var modelClass, entity;
                    if (item.modal.type && (item.modal.type != 'ModalNone' || item.isNotRender == true)) {
                        //regist IoC
                        modelClass = this.factoryIoC.getModel(item.modal.type);
                        if (!modelClass) continue;
                        if (item.isNotRender) continue;
                        entity = new modelClass(this, item);
                        this.listEntity[item.id] = entity;
                        this.arrEntityOrder.push(item.id);
                        if (item.modal.interval && item.modal.interval >= 0 && item.modal.points) {
                            for (var k = 0, point, kLen = item.modal.points.length; k < kLen; k++) {
                                point = item.modal.points[k];
                                if (this.requestPoints.indexOf(point) < 0) {
                                    this.requestPoints.push(point);
                                }
                            }
                        }
                        entity.render();
                        //this.isForReport && entity.configure();
                    } else if (item.modal.type == 'ModalNone') {
                        modelClass = this.factoryIoC.getModel(item.modal.type);
                        entity = new modelClass(this, item);
                        this.listEntity[item.id] = entity;
                        this.arrEntityOrder.push(item.id);
                        entity.render();
                        //this.isForReport && entity.configure();
                    }
                }
            }
        },

        initWorkerForUpdating: function () {
            this.workerUpdate = new Worker("/static/app/CompatibleFrame/workerUpdater.js");
            this.workerUpdate.self = this;
            this.workerUpdate.addEventListener("message", this.refreshData, true);
            this.workerUpdate.addEventListener("error", function (e) {
                console.log(e)
            }, true);

            if (this.requestPoints && this.requestPoints.length > 0) {
                this.workerUpdate.postMessage({ pointList: this.requestPoints, type: "datasourceRealtime" });
            }
        },

        refreshData: function (e) {
            var _this = this.self ? this.self : this;
            if (!e.data.error && e.data.dsItemList) {
                var point;
                for (var i = 0, iLen = e.data.dsItemList.length; i < iLen; i++) {
                    point = e.data.dsItemList[i];
                    _this.mapRefresh[point.dsItemId] = point;
                    //如果point是pop绑定的点，加入到_this.popRefresh
                    if (_this.dictPopToEntity[point.dsItemId]) {
                        _this.popRefresh[point.dsItemId] = point;
                    }
                }
                var entity, arrUpdataData;
                for (var key in _this.listEntity) {
                    entity = _this.listEntity[key];
                    if (entity.entity.modal.type == "ModalNone" || entity.entity.modal.type == "ModalMix") continue;
                    arrUpdataData = [];

                    if (entity.entity.modal && entity.entity.modal.points) {
                        for (var i = 0, iLen = entity.entity.modal.points.length; i < iLen; i++) {
                            var point = entity.entity.modal.points[i];
                            if (!point) continue;
                            if (entity.entity.modal.points.indexOf(point) != i) continue;
                            if (_this.mapRefresh[point] != undefined)
                                arrUpdataData.push(_this.mapRefresh[point]);
                        }
                        if (entity.entity.modal.type == "ModalAppGauge") {
                            arrUpdataData.push({
                                'guageTitle': entity.entity.modal.option.guageTitle,
                                'guageFulTitle': entity.entity.modal.option.guageFulTitle,
                                'guageFixed': entity.entity.modal.option.guageFixed,
                                'guageUnit': entity.entity.modal.option.guageUnit,
                                'timeLocal': entity.entity.modal.option.timeLocal,
                                'guageDirect': entity.entity.modal.option.guageDirect,
                                'guageBgColor': entity.entity.modal.option.guageBgColor,
                                'transDataDot': entity.entity.modal.option.transDataDot
                            });
                        }
                        entity.entity.modal.popId && entity.renderPop(_this.popRefresh[entity.entity.modal.popId]);
                        entity.update(arrUpdataData);
                    }
                }
            } else {
                //new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code[e.data.error]).showAtTop(5000);
            }
        },

        render: function (data) {
            for (var key in this.listEntity) {
                this.listEntity[key].render();
            }
        },

        getDSItemById: function (datasourceItemId) {
            for (var i = 0, len = this.store.datasources[0].list.length; i < len; i++) {
                if (this.store.datasources[0].list[i].id === datasourceItemId) {
                    return this.store.datasources[0].list[i];
                }
            }
            return null;
        },

        updateDataSources: function (updateData) {
            this.store.group = updateData;
        },
    }
    return EnergyScreen;
})();
