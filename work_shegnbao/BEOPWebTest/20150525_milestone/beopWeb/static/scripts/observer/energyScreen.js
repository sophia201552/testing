/// <reference path="../spring/entities/modalCarbonFootprint.js" />
/// <reference path="../lib/jquery-1.11.1.js" />

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
        this.arrEntityOrder = undefined;
        this.requestPoints = [];
        this.configParams = undefined;
        this.store = store ? store : undefined;
        this.container = undefined;

        this.isForReport = store ? true : false;

        this.modalConfigPane = undefined;
        this.isConfigMode = false;
        this.workerUpdate = undefined;
        this.paneDatasource = undefined;
        this.arrColor = echarts.config.color;

        this.spinnerRender = new LoadingSpinner({ color: '#00FFFF' });
    }

    EnergyScreen.prototype = {
        show: function () {
            var _this = this;

            ElScreenContainer.innerHTML = '';
            $.get("/static/views/observer/energyScreen.html").done(function (resultHtml) {

                var divMain = document.createElement('div');
                divMain.className = 'indexContent st-pusher';
                divMain.innerHTML = resultHtml;

                var stCt = $('<div id="st-container" class="st-container">')[0];
                stCt.appendChild(divMain);
                ElScreenContainer.appendChild(stCt);
                _this.container = document.getElementById('paneCenter');
                _this.modalConfigPane = new modalConfigurePane(document.getElementById('energyModal'),_this,'dashboard');
                _this.modalConfigPane.show();
                _this.init();
            });
        },

        close: function () {
            for (var key in this.listEntity) {
                if (this.listEntity[key].chart) {
                    this.listEntity[key].chart.clear();
                }
            }

            if (this.workerUpdate) this.workerUpdate.terminate();
            this.workerUpdate = null;
            this.factoryIoC = null;
            this.factoryIoCAnalysis = null;
            this.listEntity = null;
            this.arrEntityOrder = null;
            this.store = null;
            this.container = null;

            this.UNIT_WIDTH = null;
            this.UNIT_HEIGHT = null;

            AppConfig.datasource = null;
            $('#ulTools').html('');
            this.paneDatasource && this.paneDatasource.close && this.paneDatasource.close();
        },

        stop: function () {
            if (this.workerUpdate) this.workerUpdate.terminate();
        },

        init: function () {
            var _this = this;

            Spinner.spin(ElScreenContainer);
            if (this.store) {
                initByData();
                Spinner.stop();
            } else {
                WebAPI.get("/spring/get/" + this.id).done(function (result) {
                    _this.store = JSON.parse(result);
                    initByData();
                }).error(function (e) {
                    Spinner.stop();
                });
            }

            function initByData() {
                WebAPI.get('/datasource/get/' + AppConfig.userId).done(function (result) {
                    _this.store.group = JSON.parse(result).group;

                    _this.paneDatasource = new DataSource(_this);
                    AppConfig.datasource = _this.paneDatasource;

                    _this.initIoc();
                    _this.initLayout();
                    _this.initToolBar();
                    _this.initWorkerForUpdating();
                }).always(function (e) {
                    Spinner.stop();
                });
            };

            $('#btnModalAdd').off('click').click(function (e) {
                var entity = new ModalNone(_this, {
                    id: +new Date(),
                    spanC: 6,
                    spanR: 2,
                    modal: {}
                });
                _this.arrEntityOrder.push(entity.entity.id);
                _this.listEntity[entity.entity.id] = entity;
                entity.render();
                entity.configure();
            });
        },

        initToolBar: function () {
            var _this = this;

            if (AppConfig.isMobile) return;

            if (this.isForReport) {
                var btnMode = $('<span>')
                .addClass('badge grow')
                .text('sure')
                .css('cursor', 'pointer').css('background-color', '#5bc0de')
                .click(function (e) {
                    _this.saveLayout();
                });
            }
            else {
                var btnMode = $('<span>')
                .addClass('badge grow')
                .text(I18n.resource.observer.widgets.CONFIG_MODE)
                .css('cursor', 'pointer').css('background-color', '#5bc0de')
                .click(function (e) {
                    if (_this.isConfigMode) {
                        _this.isConfigMode = false;
                        e.currentTarget.classList.remove('toolbar-btn-selected');
                        _this.saveLayout();
                    } else {
                        _this.isConfigMode = true;
                        e.currentTarget.classList.add('toolbar-btn-selected');
                        _this.showConfigMode();

                        $('.sideTrans').fadeIn();
                        document.querySelector('#leftCt').click();
                        $($('.nav-header')[0]).click();
                        $(this).text(I18n.resource.observer.widgets.CONFIG_SAVE);
                    }
                });
            }

            var ulTools = $('#ulTools');
            ulTools.html('');
            btnMode.appendTo($('<li><a>')).appendTo(ulTools);
        },

        initIoc: function () {
            this.factoryIoC = new FactoryIoC('dashboard');
            this.factoryIoCAnalysis = new FactoryIoC('analysis');
        },

        initLayout: function () {
            this.listEntity = {};
            this.arrEntityOrder = [];

            var side = new SidebarMenuEffect('#paneContent', '#leftCt', '#rightCt');
            I18n.fillArea($('#toolBox'));

            if (!(this.store && this.store.layout)) return;
            for (var i = 0, div, item; i < this.store.layout.length; i++) {
                for (var j = 0; j < this.store.layout[i].length; j++) {
                    item = this.store.layout[i][j];

                    if (item.modal.type) {
                        //regist IoC
                        var modelClass = this.factoryIoC.getModel(item.modal.type);
                        var entity = new modelClass(this, item);
                        this.listEntity[item.id] = entity;
                        this.arrEntityOrder.push(item.id);
                        if (item.modal.interval && item.modal.interval >= 0) {
                            for (var k = 0, point, kLen = item.modal.points.length; k < kLen; k++) {
                                point = item.modal.points[k];
                                if (this.requestPoints.indexOf(point) < 0) {
                                    this.requestPoints.push(point);
                                }
                            }
                        }
                        entity.render();
                        this.isForReport && entity.configure();
                    }
                }
            }
        },

        initWorkerForUpdating: function () {
            this.workerUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
            this.workerUpdate.self = this;
            this.workerUpdate.addEventListener("message", this.refreshData, true);
            this.workerUpdate.addEventListener("error", function (e) { console.log(e) }, true);

            this.workerUpdate.postMessage({ pointList: this.requestPoints, type: "datasourceRealtime" });
        },

        refreshData: function (e) {
            var _this = this.self ? this.self : this;
            if (!e.data.error) {
                var point;
                for (var i = 0, iLen = e.data.length; i < iLen; i++) {
                    point = e.data[i];
                    _this.mapRefresh[point.dsItemId] = point;
                }

                var entity, arrUpdataData;
                for (var key in _this.listEntity) {
                    entity = _this.listEntity[key];
                    arrUpdataData = [];
                    for (var i = 0, iLen = e.data.length; i < iLen; i++) {
                        var point = entity.entity.modal.points[i];
                        if(!point) continue;
                        arrUpdataData.push(_this.mapRefresh[point]);
                    }
                    entity.update(arrUpdataData);
                }
            } else {
                new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code[e.data.error]).showAtTop(5000);
            }
        },

        saveLayout: function () {
            var _this = this;
            var arrEntity = [];
            for (var i = 0; i < this.arrEntityOrder.length; i++) {
                if (!this.listEntity[this.arrEntityOrder[i]].entity.modal.points || this.listEntity[this.arrEntityOrder[i]].entity.modal.points.length == 0)continue;
                arrEntity.push(this.listEntity[this.arrEntityOrder[i]].entity);
            }

            var data = {
                creatorId: AppConfig.userId,
                menuItemId: this.id,
                layout: [arrEntity]
            };
            this.store.id && (data.id = this.store.id);

            Spinner.spin(ElScreenContainer);
            WebAPI.post('/spring/saveLayout', data).done(function (result) {
                if (_this.isForReport) {
                    window.open("/share/db/" + AppConfig.userId + "/" + _this.id);
                    var retCon = confirm('Your analysis result has been shared at the new brower tab.');
                    if (true === retCon) {
                        ScreenManager.show(AnalysisScreen);
                    }
                } else {
                    ScreenManager.show(EnergyScreen);
                }
            }).always(function (result) {
                Spinner.stop();
            });
        },

        setEntity: function (entity) {
            //reference.
            //this.listEntity[entity.id].entity = entity;
        },

        replaceEntity: function (sourceId, targetId) {
            var $elSource = $('#divContainer_' + sourceId);
            var $elTarget = $('#divContainer_' + targetId);

            var source = this.listEntity[sourceId];
            var target = this.listEntity[targetId];

            source.entity.id = +new Date();

            target.entity.id = +new Date() + 1;

            this.listEntity[source.entity.id] = source;
            this.listEntity[target.entity.id] = target;

            delete this.listEntity[sourceId];
            delete this.listEntity[targetId];

            source.initContainer(targetId).configure();
            target.initContainer(sourceId).configure();
            

            this.arrEntityOrder[this.arrEntityOrder.indexOf(targetId)] = source.entity.id;
            this.arrEntityOrder[this.arrEntityOrder.indexOf(sourceId)] = target.entity.id;
        },

        rebornEntity: function (entityParams, tragetType,targetTitle) {
            this.removeEntity(entityParams.id);

            entityParams.modal.type = tragetType;
            entityParams.modal.title = targetTitle;
            var modelClass = this.factoryIoC.getModel(tragetType);
            entityParams.spanC = modelClass.prototype.optionTemplate.minWidth;
            entityParams.spanR = modelClass.prototype.optionTemplate.minHeight;
            var entity = new modelClass(this, entityParams);
            this.listEntity[entity.entity.id] = entity;
            this.arrEntityOrder.push(entity.entity.id);
            entity.configure();
        },

        removeEntity: function (id) {
            this.listEntity[id] = null;
            delete this.listEntity[id];
            this.arrEntityOrder.splice(this.arrEntityOrder.indexOf(id), 1);
        }, 

        render: function (data) {
            for (var key in this.listEntity) {
                this.listEntity[key].render();
            }
        },

        showConfigMode: function () {
            this.stop();

            for (var key in this.listEntity) {
                this.listEntity[key].configure();
            }

            this.initToolBox();
            this.initDataSourcePanel();
        },

        initToolBox: function () {
            var $toolBox = $($('.col-sm-2')[0].children[0]);
            var $modals = $('<div id="modalCt" class="panel-body">').appendTo($toolBox);
            var list, template, option, groupList = [];
            list = this.factoryIoC.getList();
            for (var ele = 0; ele < list.length; ele++) {
                template = list[ele];
                option = template.prototype.optionTemplate;
                if(!option) continue;
                if(option.parent != null) {
                    /*if (option.parent == 0) {
                        listRealTime.push(option);
                    } else if (option.parent == 1) {
                        listHistory.push(option);
                    }*/
                    if(!groupList[option.parent]){
                        groupList[option.parent] = new Array();
                    }
                    groupList[option.parent].push(option)
                }
            }
            for(var i = 0; i < groupList.length; i++){
                $modals.append(getModalList(groupList[i]));
            }

            function getModalList(group) {

                var $ul = $('<ul class="nav nav-list accordion-group">');
                var $liList = $('<li class="rows" style="display: none;">').appendTo($ul);
                for (var i in group) {
                    if (i == 0) {
                        var $liHd = $('<li class="nav-header">').append('<i class="icon-plus icon-white"></i>' + I18n.findContent(group[i].name))
                            .click(function () {
                                var $otherUl = $(this).parent('ul').siblings('ul');
                                $otherUl.find('.rows').slideUp();
                                $otherUl.find('i').removeClass('icon-minus').addClass('icon-plus');
                                $(this).next('.rows').slideToggle();
                                var $i = $(this).find('i');
                                var toggleClass = (function () {
                                    if ($i.hasClass('icon-minus'))
                                        return 'icon-plus icon-white'
                                    else
                                        return 'icon-minus icon-white'
                                })();
                                $(this).find('i').removeClass().addClass(toggleClass)
                            });
                        $ul.prepend($liHd);
                    } else {
                        var $div = $('<div class="lyrow ui-draggable" draggable="true"> ').html(I18n.findContent(group[i].name)).attr('type',group[i].type);
                        $div[0].ondragstart = function(e){
                            e.dataTransfer.setData("type",$(this).attr('type'));
                            e.dataTransfer.setData("title",$(this).text());
                        }
                        $liList.append($div);
                    }
                }
                return $ul;
            }
        },

        initDataSourcePanel: function () {
            var _this = this;
            _this.paneDatasource.show();
        },

        hideAnlsPane: function () {
            $('#paneCenter').hide();
            $('#energyModal').hide();
        },

        showAnlsPane: function () {
            $('#paneCenter').show();
            $('#energyModal').show();
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
        }
    }

    return EnergyScreen;
})();
