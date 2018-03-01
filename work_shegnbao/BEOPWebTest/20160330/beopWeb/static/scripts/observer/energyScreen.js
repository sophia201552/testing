/// <reference path="../spring/entities/modalCarbonFootprint.js" />
/// <reference path="../lib/jquery-2.1.4.js" />

var EnergyScreen = (function () {
    function EnergyScreen(id, store, shareSaveChange, dsInfoList, isForMobile) {
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
        //this.configParams = undefined;
        this.store = store ? store : undefined;
        this.container = undefined;
        //this.initStoreLayout = store ? JSON.stringify(this.store.layout) : undefined;
        this.dsInfolist = dsInfoList;

        if (store) {
            this.sharedesc = store.desc;
        } else if (shareSaveChange) {
            this.sharedesc = shareSaveChange.desc;
        }
        this.isForReport = store ? true : false;
        this.shareLogId = shareSaveChange ? shareSaveChange.shareLogId : false;
        if (this.shareLogId) {
            this.isForReport = true;
        }
        this.isForBencMark = undefined;
        this.modalConfigPane = undefined;
        this.isConfigMode = false;
        this.workerUpdate = undefined;
        this.paneDatasource = undefined;
        this.arrColor = echarts.config.color;

        this.isScreenChange = undefined;

        //this.spinnerRender = new LoadingSpinner({ color: '#00FFFF' });

        this.isPlayback = false;
        this.$obCanvasContainer = undefined;
        this.canvas = undefined;
        this.toolContainer = undefined;

        this.isForMobile = isForMobile;
    }

    EnergyScreen.prototype = {
        show: function () {
            var _this = this;

            ElScreenContainer.innerHTML = '';
            WebAPI.get("/static/views/observer/energyScreen.html").done(function (resultHtml) {

                var divMain = document.createElement('div');
                divMain.className = 'indexContent st-pusher';
                divMain.innerHTML = resultHtml;

                var stCt = $('<div id="st-container" class="st-container">')[0];
                stCt.appendChild(divMain);
                ElScreenContainer.appendChild(stCt);
                _this.container = document.getElementById('paneCenter');
                _this.$obCanvasContainer = $(_this.container);
                _this.modalConfigPane = new modalConfigurePane(document.getElementById('energyModal'), _this, 'dashboard');
                _this.modalConfigPane.show();
                _this.init();
            });
        },

        close: function () {
            if (this.isConfigMode) {
                if (this.isScreenChange) {
                    //TODO 测试confirm
                    var _this = this;
                    confirm('There are some changes haven\'t been saved, do you want to save them before quit? ', function () {
                        _this.saveLayout();
                    });
                }
            }
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
            this.dsInfolist = null;
            this.mapRefresh = null;
            this.modalConfigPane = null;
            this.popRefresh = null;
            this.requestPoints = null;
            this.toolContainer = null;
            this.isForReport = null;
            this.isPlayback = null;
            // 注释以下这两行，解决切换 screen 时，页面偶尔会显示空的问题
            // this.isConfigMode = null;
            // this.isScreenChange = null;
            this.shareLogId = null;

            if (!this.isForBencMark) {
                if (ToolCurrent) ToolCurrent.close();
                ToolCurrent = null;
                $('#ulTools').html('');
                $('.toolBacktrace').remove();
                $('#btnConfigDashboard').remove();
            }
            this.isForBencMark = null;


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
                _this.paneDatasource = new DataSource(_this);
                AppConfig.datasource = _this.paneDatasource;

                _this.initIoc();
                _this.initLayout();
                _this.initToolBar();
                _this.initWorkerForUpdating();

                _this.initScreen();
                _this.initReplay();
            };

            $('#btnModalAdd').off('click').click(function (e) {
                var entity = new ModalNone(_this, {
                    id: (+new Date()).toString(),
                    spanC: 6,
                    spanR: 2,
                    modal: {type: "ModalNone"}
                });
                _this.arrEntityOrder.push(entity.entity.id);
                _this.listEntity[entity.entity.id] = entity;
                entity.render();
                entity.configure();
            });
        },


        initToolBar: function () {
            var _this = this;
            var ulTools;

            if (AppConfig.isMobile) return;
            if (this.isForBencMark) return;

            ulTools = $('#ulTools');
            ulTools.html('');

            if (this.isForReport) {
                var btnMode = $('<span>')
                    .addClass('badge grow toolbar-btn-selected')
                    .text('ok')
                    .css('cursor', 'pointer').css('background-color', '#5bc0de')
                    .click(function (e) {
                        _this.saveLayout();
                        _this.isConfigMode = false;
                    });
                _this.isConfigMode = true;
                //e.currentTarget.classList.add('toolbar-btn-selected');
                $('.springLinkBtn').hide();
                //_this.showConfigMode();

                $('.sideTrans').fadeIn();
                //document.querySelector('#leftCt').click();
                $($('.nav-header')[0]).click();
                //$(this).text(I18n.resource.observer.widgets.CONFIG_SAVE);

                btnMode.appendTo($('<li><a>')).appendTo(ulTools);
            } else {
                if (AppConfig.role_permission && AppConfig.role_permission.c_dashboard === "c_dashboard") {
                    var $liConfig = $('<li class="iconWrap" id="btnConfigDashboard" permission="DBWrite"><span class="glyphicon glyphicon-cog"></span><span class="dropdownNav">' + I18n.resource.observer.widgets.CONFIG_MODE + '</span> </li>');
                    var btnMode = $('<span>')
                        .addClass('badge grow')
                        //.text(I18n.resource.observer.widgets.CONFIG_MODE)
                        .text('')
                        .css('cursor', 'pointer').css('background-color', '#5bc0de')
                        .click(function (e) {
                            _this.isConfigMode = false;
                            e.currentTarget.classList.remove('toolbar-btn-selected');
                            _this.saveLayout();
                            $('.springLinkBtn').removeAttr('style');
                        });

                    $liConfig.click(function (e) {
                        _this.isConfigMode = true;
                        //e.currentTarget.classList.add('toolbar-btn-selected');
                        $('.springLinkBtn').hide();
                        _this.showConfigMode();

                        $('.sideTrans').fadeIn();
                        document.querySelector('#leftCt').click();
                        $($('.nav-header')[0]).click();
                        btnMode.text(I18n.resource.observer.widgets.CONFIG_SAVE);
                    });
                    btnMode.appendTo($('<li><a>')).appendTo(ulTools);
                    $liConfig.appendTo($('#liProjectMenu .list-inline'));
                } else {
                    $('#btnConfigDashboard').remove();
                }
            }
            try {
                Permission.check($('#liProjectMenu ul'));
            } catch (e) {
                console.log(e);
            }

        },

        initIoc: function () {
            this.factoryIoC = new FactoryIoC('dashboard');
            this.factoryIoCAnalysis = new FactoryIoC('analysis');
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
                        if (item.modal.interval && item.modal.interval >= 0) {
                            for (var k = 0, point, kLen = item.modal.points.length; k < kLen; k++) {
                                point = item.modal.points[k];
                                if (this.requestPoints.indexOf(point) < 0) {
                                    this.requestPoints.push(point);
                                }
                            }
                        }
                        if (item.modal.popId) {
                            if (!this.dictPopToEntity[item.modal.popId]) this.dictPopToEntity[item.modal.popId] = [];
                            this.dictPopToEntity[item.modal.popId].push(item.id);
                            if (this.requestPoints.indexOf(item.modal.popId) < 0) {
                                this.requestPoints.push(item.modal.popId);
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
            //如果一个页面只有entity且 spanR=6,spanC=12
            var $springCtn = $('#paneCenter').children('.springContainer');
            if ($springCtn.length == 1 && parseFloat($springCtn[0].style.height) >= parseFloat("99%") && parseFloat($springCtn[0].style.width) >= parseFloat("99%")) {
                $springCtn.children('.panel-default').css({
                    border: 'none',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%'
                });
            }

            var _this = this;
            if (_this.isForReport) {
                _this.showConfigMode();
                document.querySelector('#leftCt').click();
            }
            //else {
            //    $('.badge.grow').off('click.cfg').on('click.cfg', function () {
            //        if (_this.isConfigMode) {
            //            _this.showConfigMode();
            //        }
            //    });
            //}
        },

        initWorkerForUpdating: function () {
            this.workerUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
            this.workerUpdate.self = this;
            this.workerUpdate.addEventListener("message", this.refreshData, true);
            this.workerUpdate.addEventListener("error", function (e) {
                console.log(e)
            }, true);

            this.workerUpdate.postMessage({pointList: this.requestPoints, type: "datasourceRealtime"});
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
                    if (entity.entity.modal.type == "ModalNone" || entity.entity.modal.type == "ModalMix")continue;
                    arrUpdataData = [];

                    if (entity.entity.modal && entity.entity.modal.points) {
                        for (var i = 0, iLen = entity.entity.modal.points.length; i < iLen; i++) {
                            var point = entity.entity.modal.points[i];
                            if (!point) continue;
                            if (entity.entity.modal.points.indexOf(point) != i) continue;
                            if (_this.mapRefresh[point] != undefined)
                                arrUpdataData.push(_this.mapRefresh[point]);
                        }
                        entity.entity.modal.popId && entity.renderPop(_this.popRefresh[entity.entity.modal.popId]);
                        entity.update(arrUpdataData);
                    }
                }
            } else {
                //new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code[e.data.error]).showAtTop(5000);
            }
        },

        refreshDataTrace: function (e) {
            var _this = this;
            _this.refreshData(e);

            for (var key in this.listEntity) {
                if (undefined != _this.listEntity[key].goBackTrace) {
                    _this.listEntity[key].goBackTrace(e);
                }
            }
        },

        saveLayout: function () {
            var _this = this;
            var arrEntity = [];
            var entity = null;
            for (var i = 0; i < this.arrEntityOrder.length; i++) {
                entity = this.listEntity[this.arrEntityOrder[i]].entity;
                if (['ModalObserver', 'ModalNote', 'ModalMix', 'ModalHtml', 'ModalChartCustom', 'ModalWeather'].indexOf(entity.modal.type) > -1) {
                    // 传说中的后门
                    // the back door in legend
                    arrEntity.push(entity);
                } else if (entity.modal.type == 'ModalPointKPI') {
                    arrEntity.push(this.dealWithEntity(entity));
                } else if (entity.modal.type == 'ModalReportChapter') {
                    if (entity.modal.option && entity.modal.option.menuId && entity.modal.option.menuId != '') {
                        arrEntity.push(entity);
                    }
                } else {
                    if (entity.modal.type != 'ModalNone' && (!entity.modal.points || entity.modal.points.length == 0)) continue;
                    arrEntity.push(entity);
                }
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
                    //window.open("/share/db/" + AppConfig.userId + "/" + _this.id);
                    var argSkin = AppConfig.chartTheme == 'macarons' ? '' : '?skin=dark';
                    _this.initShareIframe("/share/db/" + AppConfig.userId + "/" + _this.id + argSkin);//增加皮肤参数
                    //var retCon = confirm('Your analysis result has been shared at the new brower tab.');
                    //if (true === retCon) {
                    ScreenManager.show(shareLogging, AppConfig.userId);
                    //}
                    //var shareURL = "/share/db/" + AppConfig.userId + "/" + _this.id;
                    //WebAPI.post('/analysis/saveShareLog/' + AppConfig.userId, shareURL).done(function (result) {
                    //    console.log(result.status)
                    //})
                } else {
                    if (_this.isConfigMode && _this.isScreenChange)return;
                    ScreenManager.show(EnergyScreen);
                }
            }).always(function (result) {
                if (_this.isConfigMode && _this.isScreenChange)return;
                Spinner.stop();
            });
            if (_this.isForReport) {
                //var shareURL = "/share/db/" + AppConfig.userId + "/" + _this.id;
                var modeType;//= _this.shareLogId ? true : false;
                if (_this.shareLogId) {
                    modeType = true;
                } else {
                    modeType = false;
                }
                var argSkin = AppConfig.chartTheme == 'macarons' ? '' : '?skin=dark';
                var arrDesc = _this.sharedesc.split(' ');
                if (parseInt(arrDesc[arrDesc.length - 3]) !== _this.arrEntityOrder.length) {
                    arrDesc[arrDesc.length - 3] = _this.arrEntityOrder.length;
                    _this.sharedesc = arrDesc.join(' ');
                }
                var postData = {
                    menuId: _this.id + argSkin,
                    mode: modeType,
                    shareLogId: _this.shareLogId,
                    desc: _this.sharedesc//,
                    //skin: AppConfig.chartTheme == 'macarons' ? 'default' : 'dark'
                }
                WebAPI.post('/analysis/saveShareLog/' + AppConfig.userId, postData).done(function (result) {
                    console.log(result.status)
                })
            }
        },

        saveLayoutOnly: function () {
            var _this = this;
            var arrEntity = [];
            var entity = null;
            for (var i = 0; i < this.arrEntityOrder.length; i++) {
                entity = this.listEntity[this.arrEntityOrder[i]].entity;
                if (['ModalObserver', 'ModalNote', 'ModalMix', 'ModalHtml', 'ModalChartCustom', 'ModalWeather'].indexOf(entity.modal.type) > -1) {
                    // 传说中的后门
                    // the back door in legend
                    arrEntity.push(entity);
                } else if (entity.modal.type == 'ModalPointKPI') {
                    arrEntity.push(this.dealWithEntity(entity));
                } else if (entity.modal.type == 'ModalReportChapter') {
                    if (entity.modal.option && entity.modal.option.menuId && entity.modal.option.menuId != '') {
                        arrEntity.push(entity);
                    }
                } else {
                    if (entity.modal.type != 'ModalNone' && (!entity.modal.points || entity.modal.points.length == 0)) continue;
                    arrEntity.push(entity);
                }
            }
            var data = {
                creatorId: AppConfig.userId,
                menuItemId: this.id,
                layout: [arrEntity]
            };
            this.store.id && (data.id = this.store.id);

            Spinner.spin(ElScreenContainer);
            WebAPI.post('/spring/saveLayout', data).done(function (result) {
            }).always(function (result) {
                Spinner.stop();
            });
        },

        dealWithEntity: function (entity) {
            entity.modal.points = [];
            entity.modal.interval = 5;
            entity.modal.option && entity.modal.option.kpiList && entity.modal.option.kpiList.forEach(function (kpiItem) {
                traverseTree(kpiItem);
            });
            function traverseTree(tree) {
                dealWithNode(tree);
                traverse(tree, 0);
            }

            function traverse(node, i) {//广度优先遍历
                var children = node.list;
                if (children != null && children.length > 0) {
                    dealWithNode(children[i]);
                    if (i == children.length - 1) {
                        for (var j = 0; j < children.length; j++) {
                            traverse(children[j], 0);
                        }
                    } else {
                        traverse(node, i + 1);
                    }
                }
            }

            function dealWithNode(child) {
                delete child.pointPassData;
                delete child.show;
                if (child.pointKPI) {
                    entity.modal.points.push(child.pointKPI);
                }
                if (child.pointGrade) {
                    entity.modal.points.push(child.pointGrade);
                }
                if (child.pointPass) {
                    entity.modal.points.push(child.pointPass);
                }
            }

            return entity;
        },

        setEntity: function (entity) {
            //reference.
            //this.listEntity[entity.id].entity = entity;
        },

        replaceEntity: function (sourceId, targetId, parentId) {
            if (sourceId == targetId) return;

            var _this = this;
            var source = this.listEntity[sourceId];
            var target = this.listEntity[targetId];

            source.entity.id = (+new Date()).toString();

            target.entity.id = (+new Date() + 1).toString();

            this.listEntity[source.entity.id] = source;
            this.listEntity[target.entity.id] = target;

            delete this.listEntity[sourceId];
            delete this.listEntity[targetId];

            source.initContainer(targetId).configure();
            target.initContainer(sourceId).configure();


            this.arrEntityOrder[this.arrEntityOrder.indexOf(targetId)] = source.entity.id;
            this.arrEntityOrder[this.arrEntityOrder.indexOf(sourceId)] = target.entity.id;

            //如果是组合图内部交换位置,则组合图的subChartIds更新
            if (parentId) {
                this.listEntity[parentId].entity.modal.option.subChartIds.forEach(function (i) {
                    if (i.id == sourceId) {
                        i.id = target.entity.id;
                    }
                });
                this.listEntity[parentId].entity.modal.option.subChartIds.forEach(function (i) {
                    if (i.id == targetId) {
                        i.id = source.entity.id;
                    }
                });
            }
            if (source.entity.modal.type == 'ModalMix') {
                source.entity.modal.option && source.entity.modal.option.subChartIds && source.entity.modal.option.subChartIds.forEach(function (i) {
                    var entity = _this.listEntity[i.id].entity, modelClass, item;
                    modelClass = _this.factoryIoC.getModel(entity.modal.type);
                    _this.container = $('#divContainer_' + source.entity.id).find('.chartsCt')[0];
                    item = new modelClass(_this, entity);
                    item.configure()
                });
            }
            if (target.entity.modal.type == 'ModalMix' && target.entity.modal.option && target.entity.modal.option.subChartIds) {
                target.entity.modal.option.subChartIds.forEach(function (i) {
                    var entity = _this.listEntity[i.id].entity, modelClass, item;
                    modelClass = _this.factoryIoC.getModel(entity.modal.type);
                    _this.container = $('#divContainer_' + target.entity.id).find('.chartsCt')[0];
                    item = new modelClass(_this, entity);
                    item.configure()
                });
            }
        },

        rebornEntity: function (entityParams, tragetType, targetTitle, modalNoneEdit) {
            this.removeEntity(entityParams.id);

            entityParams.modal.type = tragetType;
            entityParams.modal.title = '';
            var modelClass = this.factoryIoC.getModel(tragetType);
            if ((!entityParams.isNotRender) && entityParams.modal.type !== 'ModalMix' && !modalNoneEdit) {
                entityParams.spanC = modelClass.prototype.optionTemplate.minWidth;
                entityParams.spanR = modelClass.prototype.optionTemplate.minHeight;
            }
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
            Spinner.spin(document.getElementById('paneCenter'));
            for (var key in this.listEntity) {
                this.listEntity[key].configure();
            }

            this.initDataSourcePanel();

            this.initToolBox();
            Spinner.stop();
        },

        initToolBox: function () {
            var $toolBox = $($('.col-sm-2')[0].children[0]);
            var $modals = $('<div id="modalCt" class="panel-body">').appendTo($toolBox);
            var list, template, option, groupList = [];
            list = this.factoryIoC.getList();
            for (var ele = 0; ele < list.length; ele++) {
                template = list[ele];
                option = template.prototype.optionTemplate;
                if (!option) continue;
                if (option.parent != null) {
                    /*if (option.parent == 0) {
                     listRealTime.push(option);
                     } else if (option.parent == 1) {
                     listHistory.push(option);
                     }*/
                    if (!groupList[option.parent]) {
                        groupList[option.parent] = new Array();
                    }
                    groupList[option.parent].push(option)
                }
            }
            for (var i = 0; i < groupList.length; i++) {
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
                        var $div = $('<div class="lyrow ui-draggable" draggable="true"> ').html(I18n.findContent(group[i].name)).attr('type', group[i].type);
                        $div[0].ondragstart = function (e) {
                            e.dataTransfer.setData("type", $(this).attr('type'));
                            e.dataTransfer.setData("title", $(this).text());
                        }
                        $liList.append($div);
                    }
                }
                return $ul;
            }
        },

        initDataSourcePanel: function () {
            this.paneDatasource = new DataSource(this);
            AppConfig.datasource = this.paneDatasource;
            this.paneDatasource.show();
            //var _this = this;
            //WebAPI.get('/datasource/get/' + AppConfig.userId).done(function (result) {
            //    _this.store.group = result.group;
            //    _this.paneDatasource = new DataSource(_this);
            //    AppConfig.datasource = _this.paneDatasource;
            //    _this.paneDatasource.show();
            //}).always(function (e) {
            //    Spinner.stop();
            //});
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
        },
        screenChangeJudge: function () {
            var _this = this;
            var entity;
            var arrEntity = [];
            for (var i = 0; i < this.arrEntityOrder.length; i++) {
                entity = this.listEntity[this.arrEntityOrder[i]].entity;
                if (entity.modal.type === 'ModalObserver' || entity.modal.type === 'ModalNote') {
                    // 传说中的后门
                    // the back door in legend
                    arrEntity.push(entity);
                } else {
                    if (entity.modal.type != 'ModalNone' && (!entity.modal.points || entity.modal.points.length == 0)) continue;
                    arrEntity.push(entity);
                }
            }
            //if(_this.initStoreLayout != JSON.stringify(_this.store.layout)){
            //    return true;
            //}else {
            //    return false;
            //}
        },

        initReplay: function () {
            var _this = this;
            var $ele = $('#btnDropdownNavList').find('.toolBacktrace');
            if ($ele.length > 0) {
                $ele.remove();
            }
            this.toolContainer = $('#divEnergyTools');

            var btnTimeShaft = $('<li class="iconWrap"><span class="glyphicon glyphicon-play-circle"></span><span class="dropdownNav"></span></li>').addClass('toolBacktrace');
            var enterTime;
            btnTimeShaft.children('.dropdownNav').text(I18n.resource.observer.widgets.BACKTRACE);
            btnTimeShaft.eventOn('click', function (e) {
                if (_this.isPlayback) {
                    _this.quitBacktraceMode(_this, e);
                    if (enterTime) {
                        enterTime = new Date() - enterTime;
                        _hmt.push(['_trackEvent', 'navTool-backTrace-time', 'click', 'btnBakTrace-' + AppConfig.projectShowName + '-' + AppConfig.projectId, enterTime / 1000]);
                    }
                } else {
                    _this.enterBacktraceMode(_this, e);
                    enterTime = new Date();
                    _hmt.push(['_trackEvent', 'navTool-backTrace-enter', 'click', 'btnBakTrace-' + AppConfig.projectShowName + '-' + AppConfig.projectId]);
                }
            }, ['navTool-backTrace', 'btnBackTrace', AppConfig.projectShowName, AppConfig.projectId]);

            //$('#ulTools').html('');
            //var divider = $('<li>').addClass('divider');
            $('#right-nav').find('#btnOperatingRecord').after(btnTimeShaft);//.before(divider);
            if (this.isInDiagnosis) ToolCurrent = new TimeShaftDashboard(_this);
        },

        enterBacktraceMode: function (screen, e) {
            var _this = screen ? screen : this;
            _this.isPlayback = true;

            //e && e.currentTarget.classList.add('toolbar-btn-selected');
            if (e) {
                e.currentTarget.classList.add('selected');
                $(e.currentTarget).find('.dropdownNav').html(I18n.resource.observer.widgets.QUIT_TRACE);
            }

            if (!ToolCurrent) ToolCurrent = new TimeShaftDashboard(_this);
            ToolCurrent.containerHeight = 100;
            ToolCurrent.show();

            if (_this.workerUpdate) {
                _this.workerUpdate.terminate();
                _this.workerUpdate = null;
            }

            $.when(ToolCurrent.defer).done(function () {
                var jCanvas = _this.$obCanvasContainer;
                jCanvas.css({height: '100%', width: '100%'});

                var jParent = jCanvas.parent();
                var height = jCanvas.height() - ToolCurrent.containerHeight;
                var width = jCanvas.width();
                if (width > jParent.width()) {
                    width = jParent.width();
                    height = width / (_this.canvas.width / _this.canvas.height);
                }
                jCanvas.animate({
                    height: height,
                    width: width,
                    marginTop: (jParent.height() - height - ToolCurrent.containerHeight) / 2 + 'px'
                }, 400, function () {
                    _this.initScreen();
                    _this.renderElements();
                    _this.initWorkerForUpdating();  //
                });
            });
        },

        quitBacktraceMode: function (screen, e) {
            var _this = screen ? screen : this;
            _this.isPlayback = false;
            if (e) {
                e.currentTarget.classList.remove('selected');
                $(e.currentTarget).find('.dropdownNav').html(I18n.resource.observer.widgets.BACKTRACE);
            }
            ToolCurrent.close();
            ToolCurrent = null;

            _this.$obCanvasContainer.animate({height: '100%', width: '100%'}, 300, function () {
                _this.initScreen();
                _this.renderElements();
                _this.initWorkerForUpdating();  //
            });
        },

        initScreen: function () {
            if (this.isDetailPage) {
                //set the modal dialog width;
                var _this = this;
                var dialogWidth = this.store.page.width + 40 > $(window).width() ? $(window).width() - 200 : this.store.page.width + 40;
                var detailScreenModal = $('#detailScreenModal');
                var $toolBacktrace = $('.toolBacktrace');

                I18n.fillArea($('#detailScreenModal'));

                // 隐藏"数据回放"按钮
                $toolBacktrace.remove();

                if (this.dialogTitle) {
                    var oldDialogTitle = detailScreenModal.find('.modal-title').text();
                    detailScreenModal.find('.modal-title').text(this.dialogTitle);
                }
                detailScreenModal.find('.modal-dialog').css("margin", "0 auto 0 auto").css("width", dialogWidth);
                detailScreenModal.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                    if (ScreenModal) {
                        ScreenModal.close();
                        ScreenModal = null;
                    }
                    _this.initToolBar(tObscreen);
                    Spinner.stop();
                    oldDialogTitle && $(this).find('.modal-title').text(oldDialogTitle);
                }).modal({});
                Spinner.spin(detailScreenModal.find('.modal-body')[0]);


                var paddingLeft = (1920 - this.store.page.width) / 2;
                var paddingTop = (955 - this.store.page.height) / 2;
                convertPositionToReal(this.store.equipments);
                convertPositionToReal(this.store.buttons);
                convertPositionToReal(this.store.texts);
                convertTempDistributionsToReal(this.store.tempDistributions);

                function convertPositionToReal(arr) {
                    if (arr) {
                        for (var i = 0; i < arr.length; i++) {
                            var temp = arr[i];
                            temp.x = temp.x - paddingLeft;
                            temp.y = temp.y - paddingTop;
                        }
                    }
                }

                function convertTempDistributionsToReal(dis) {
                    if (!dis) {
                        return
                    }
                    dis.x -= paddingLeft;
                    dis.y -= paddingTop;
                    convertPositionToReal(dis.data);
                }

            } else {
                if (ScreenModal && !this.isInDiagnosis) {
                    if (ScreenCurrent) ScreenCurrent.close();
                    ScreenCurrent = ScreenModal;
                    ScreenModal = null;
                }
                if (this.isInDiagnosis) this.diagScreen.obScreen = this;
                tObscreen = this;

                //if screen is fullscreen, set tab button active
                $("#page-" + this.id).parent().addClass("active");
            }
        },

        renderElements: function () {
            //this.hitModel = new HitModel(this.canvas);
            this.dictRefreshMap = {};
        },

        renderData: function (data, curTm, startTm, endTm) {
            this.refreshDataTrace({data: data, currentTime: curTm, startTime: startTm, endTime: endTm});
        },

        initShareIframe: function (shareURL) {
            var strIframe = new StringBuilder();
            strIframe.append('<div class="modal fade" id="modalShareIframe" style="overflow-y:hidden">');
            strIframe.append('  <div class="modal-dialog" style="height:95%;width:80%">');
            strIframe.append('      <div class="modal-content" style="height:100%;">');
            strIframe.append('          <div class="modal-header" style="height:60px">');
            strIframe.append('              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            strIframe.append('              <h4 class="modal-title">' + this.sharedesc + '</h4>');
            strIframe.append('          </div>');
            strIframe.append('          <div class="modal-body" id="divShareIframe" style="height:calc(100% - 60px);padding:0">');
            strIframe.append('              <iframe src="' + shareURL + '" style="height:100%;width:100%;border:none;"></iframe>');
            strIframe.append('          </div>');
            strIframe.append('      </div>');
            strIframe.append('  </div>');
            strIframe.append('</div>');
            $('body').append(strIframe.toString());
            var $modalShareIframe = $('#modalShareIframe');
            I18n.fillArea($modalShareIframe);
            $modalShareIframe.modal({show: true});
            $modalShareIframe.on('hidden.bs.modal', function (e) {
                $modalShareIframe.remove();
            })
        }
    }
    return EnergyScreen;
})();
