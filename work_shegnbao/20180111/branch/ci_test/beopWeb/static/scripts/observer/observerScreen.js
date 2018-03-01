/// <reference path="../lib/jquery-2.1.4.min.js" />
/// <reference path="../core/timer.js" />
/// <reference path="../core/sprites.js" />
/// <reference path="../core/common.js" />
/// <reference path="../core/commonCanvas.js" />
/// <reference path="../lib/jquery-1.8.3.js" />
/// <reference path="../core/timer.js" />


var ObserverScreen = (function () {

    var tObscreen = null;

    function ObserverScreen(id) {
        this.id = id;

        this.container = undefined;
        this.$obCanvasContainer = undefined;
        this.$canvasContainer = undefined;

        this.canvas = undefined;
        this.ctx = undefined;
        this.cacheCanvas = undefined;
        this.cacheCtx = undefined;
        this.hitModel = undefined;
        this.workerUpdate = undefined;
        this.isRunning = true;
        this.store = {};                      //store of all elements of this page.
        this.dictRefreshMap = undefined;             //the relationship between dataPoint id and element id. using for refresh data.
        this.stopWatch = undefined;

        this.dictPipelines = undefined;
        this.dictEquipments = undefined;
        this.dictCharts = undefined;
        this.dictGages = undefined;
        this.dictRulers = undefined;
        this.dictButtons = undefined;
        this.dictCheckboxs = undefined;
        this.dictTexts = undefined;
        this.dictTempDistributions = undefined;
        this.dictRects = undefined;

        this.dictImages = {};                 //store of all images which is used by every page elements;
        this.indexImageLoaded = 0;            //using for recording the process of loading images.

        this.isDetailPage = false;
        this.dialogTitle = undefined;

        this.isDataReady = false;
        this.isPlayback = false;              //whether this screen bases on realtime data or history data.
        this.toolContainer = undefined;       //JQuery object
    }


    ObserverScreen.prototype = {
        show: function (container) {
            var _this = this;

            if (_this.isDetailPage) {
                _this.container = ElScreenContainer;
                _this.initContainer();

                Spinner.spin(_this.container);
                _this.init();
            }
            else {
                _this.container = container || _this.container;
                if (_this.container) {
                    _this.initContainer();
                    initHtml(_this.container);
                } else {
                    _this.container = ElScreenContainer;
                    WebAPI.get("/static/views/observer/observerScreen.html").done(function (resultHtml) {
                        $(_this.container).html(resultHtml);
                        _this.initContainer();
                        initHtml();
                    });
                }

                function initHtml() {
                    Spinner.spin(_this.container);
                    _this.init();
                    I18n.fillArea($(_this.container));
                }
            }
        },

        initContainer: function () {
            if (this.container === ElScreenContainer) {
                this.$obCanvasContainer = $('#divObserverCanvas');
                this.$canvasContainer = $('#canvasOverview');
            } else {
                this.$obCanvasContainer = $('.div-canvas-ctn', $(this.container));
                this.$canvasContainer = $('.canvas-ctn', $(this.container));
            }
        },

        close: function () {
            $('.observer-text-editor').remove();
            // reset tooltip
            ModelText.destroy();
            $('.toolBacktrace').remove();
            if (this.workerUpdate) this.workerUpdate.terminate();
            this.workerUpdate = null;
            for (var item in this.dictCharts) this.dictCharts[item].close();
            this.isRunning = null;
            this.canvas = null;
            this.ctx = null;
            this.cacheCanvas = null;
            this.store = null;
            this.dictRefreshMap = null;
            this.dictPipelines = null;
            this.dictGages = null;
            this.dictRulers = null;
            this.dictEquipments = null;
            this.dictButtons = null;
            this.dictTexts = null;
            this.dictCheckboxs = null;
            this.dictImages = null;
            this.dictRects = null;

            this.hitModel = null;
            this.stopWatch = null;
            if (!this.isDetailPage) {
                $('#ulTools').html('');
                if (ToolCurrent) ToolCurrent.close();
                ToolCurrent = null;
            }

            $('#btnTemperatureSetting').hide().eventOff('click');
        },

        stop: function () {
            this.isRunning = false;
            if (this.workerUpdate) {
                this.workerUpdate.terminate();
                this.workerUpdate = null;
            }
        },

        resume: function () {
            //TODO
            this.isRunning = true;
            this.initWorkerForUpdating();
            requestAnimationFrame(animate);
        },

        resize: function () {
            this.initScreen();
            this.renderElements();
            if (this.workerUpdate) {
                this.workerUpdate.terminate();
                this.initWorkerForUpdating();
            }
        },

        onresize: function () {
            ScreenCurrent.resize();
        },

        init: function () {
            var _this = this;
            WebAPI.get("/get_plant/" + AppConfig.projectId + "/" + this.id + "/" + AppConfig.userId).done(function (result) {
                _this.store = result;

                _this.initScreen();
                if (!_this.isDetailPage && !_this.isInDashBoard) _this.initToolBar();
                _this.initImageDictionary();

                _this.renderElements();

                if (_this.isPlayback) {
                    ToolCurrent.requestDataForCurrentMoment(_this);
                } else {
                    _this.initWorkerForUpdating();
                }
                _this.initAnimation(); //start animation.
            }).error(function (e) {

                alert(I18n.resource.observer.widgets.DATA_REQUEST_FAILED);
                Spinner.stop();
            });
        },

        renderElements: function () {
            this.hitModel = new HitModel(this.canvas);
            this.dictRefreshMap = {};
            this.initPipelines();
            this.initEquipments();
            this.initCharts();
            this.initGages();
            this.initRulers();
            this.initCheckboxs();
            this.initButtons();
            this.initTexts();
            this.initTempDistribution();
            this.initRects();

            //this.initCanvasCache();

            this.initHitModel();
        },

        initToolBar: function (ins) {
            var _this = !ins ? this : ins;
            var $ele = $('#btnDropdownNavList').find('.toolBacktrace');
            if ($ele.length > 0) {
                $ele.remove();
            }
            this.toolContainer = $('#divObserverTools');

            var btnTimeShaft = $('<li class="iconWrap"><a><span class="glyphicon glyphicon-play-circle"></span><span class="dropdownNav"></span></a></li>').addClass('toolBacktrace');
            btnTimeShaft.find('.dropdownNav').text(I18n.resource.observer.widgets.BACKTRACE);
            btnTimeShaft.eventOn('click',function (e) {
                if (_this.isPlayback) {
                    _this.quitBacktraceMode(_this, e);
                } else {
                    _this.enterBacktraceMode(_this, e);
                }
            },'历史回放');

            $('#ulTools').html('');
            $('#right-nav').find('#btnOperatingRecord').after(btnTimeShaft);
            if (_this.isInDiagnosis && !_this.isPlayback) ToolCurrent = new TimeShaft(_this);
        },

        enterBacktraceMode: function (screen, e) {
            var _this = screen ? screen : this;
            _this.isPlayback = true;

            //e && e.currentTarget.classList.add('toolbar-btn-selected');
            if (e) {
                e.currentTarget.classList.add('selected');
                //$(e.currentTarget).find('.dropdownNav').html(I18n.resource.observer.widgets.QUIT_TRACE);
            }

            if (!ToolCurrent) ToolCurrent = new TimeShaft(_this);
            ToolCurrent.containerHeight = 100;
            ToolCurrent.show();

            if (_this.workerUpdate) {
                this.workerUpdate.terminate();
                this.workerUpdate = null;
            }

            $.when(ToolCurrent.defer).done(function () {
                var jCanvas = _this.$obCanvasContainer;//$('#divObserverCanvas');
                jCanvas.css({height: '100%', width: '100%'});

                var jParent = jCanvas.parent();
                var height = jCanvas.height() - ToolCurrent.containerHeight;
                var width = height * _this.canvas.width / _this.canvas.height;
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
                });
            });
        },

        quitBacktraceMode: function (screen, e) {
            var _this = screen ? screen : this;
            _this.isPlayback = false;

            //e && e.currentTarget.classList.remove('toolbar-btn-selected');
            if (e) {
                e.currentTarget.classList.remove('selected');
                //$(e.currentTarget).find('.dropdownNav').html(I18n.resource.observer.widgets.BACKTRACE);
            }
            ToolCurrent.close();
            ToolCurrent = null;

            _this.$obCanvasContainer.animate({height: '100%', width: '100%'}, 300, function () {
                _this.initScreen();
                _this.renderElements();
                _this.initWorkerForUpdating();
            });
        },

        initScreen: function () {
            this.isDetailPage = (this.store.page.type != "fullscreen") && !this.isInDashBoard;

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

                    //TODO: to be beautiful
                    if (_this.diagScreen && _this.diagScreen.ScreenModal) {
                        if (_this.diagScreen.obScreen) {
                            _this.diagScreen.obScreen = new ObserverScreen(_this.diagScreen.obScreen.id);
                            _this.diagScreen.initObScreen();
                            _this.diagScreen.obScreen.show(_this.diagScreen.$obContainer[0]);
                        }

                        _this.diagScreen.ScreenModal.close();
                        _this.diagScreen.ScreenModal = null;
                    }

                    _this.initToolBar(tObscreen);
                    Spinner.stop();
                    oldDialogTitle && $(this).find('.modal-title').text(oldDialogTitle);
                }).modal();
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
                if (!this.isPlayback) {
                    $('.div-canvas-ctn').css({marginTop: 0});
                }
            }

            if (this.isDetailPage) {
                this.canvas = document.getElementById("canvasDetail");
            } else {
                this.canvas = this.$canvasContainer[0];
            }
            this.ctx = this.canvas.getContext("2d");
            this.canvas.width = this.store.page.width;
            this.canvas.height = this.store.page.height;
        },

        initWorkerForUpdating: function () {
            if (this.workerUpdate) {
                this.workerUpdate.terminate();
            }
            this.workerUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
            this.workerUpdate.self = this;
            this.workerUpdate.addEventListener("message", this.refreshData, true);
            //TODO 
            this.workerUpdate.addEventListener("error", function (e) {
                console.log(e)
            }, true);

            this.workerUpdate.postMessage({
                projectId: AppConfig.projectId,
                id: this.id,
                pointList: Object.keys(this.dictRefreshMap),
                type: "dataRealtime"
            });
        },

        initAnimation: function () {
            var _this = this;
            this.stopWatch = new Stopwatch();
            this.stopWatch.start();

            requestAnimationFrame(animate);
            function animate() {
                if (_this.isRunning) {
                    _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                    //_this.ctx.drawImage(_this.cacheCanvas, 0, 0);

                    //update unit detail
                    var item, element, time = _this.stopWatch.getElapsedTime();
                    for (item in _this.dictPipelines) {
                        element = _this.dictPipelines[item];
                        element.update(_this.ctx, 250);
                    }

                    for (item in _this.dictEquipments) {
                        element = _this.dictEquipments[item];
                        element.update(null, time);
                        element.refreshImage(_this.store.animationList, _this.dictImages);
                    }

                    //paint
                    for (var i = 0; i < 10; i++) {
                        for (item in _this.dictPipelines) {
                            element = _this.dictPipelines[item];
                            if (element.layer == i) element.paint(_this.ctx);
                        }
                        for (item in _this.dictEquipments) {
                            element = _this.dictEquipments[item];
                            if (element.layer == i) element.paint(_this.ctx);
                        }
                        for (item in _this.dictButtons) {
                            element = _this.dictButtons[item];
                            if (element.layer == i) element.paint(_this.ctx);
                        }
                        for (item in _this.dictTexts) {
                            element = _this.dictTexts[item];
                            if (element.layer == i) element.paint(_this.ctx);
                        }
                        for (item in _this.dictTempDistributions) {
                            element = _this.dictTempDistributions[item];
                            if (element.layer == i) element.paint(_this.ctx);
                        }
                        for (item in _this.dictRects) {
                            element = _this.dictRects[item];
                            if (element.layer == i) element.paint(_this.ctx);
                        }
                    }
                    for (item in _this.dictCharts) {
                        _this.dictCharts[item].paint(_this.ctx);
                    }
                    for (item in _this.dictGages) {
                        _this.dictGages[item].paint(_this.ctx);
                    }
                    for (item in _this.dictRulers) {
                        _this.dictRulers[item].paint(_this.ctx);
                    }

                    for (item in _this.dictCheckboxs) _this.dictCheckboxs[item].paint(_this.ctx);

                    //如果有热力图，画出热力图标尺
                    for (item in _this.dictTempDistributions) {
                        _this.dictTempDistributions[item].createHeatRuler(_this.ctx);
                    }
                    

                    ////Test: mouse location test
                    //if (_this.obj) {
                    //    _this.ctx.strokeStyle = "#FFF";
                    //    _this.ctx.lineWidth = 1;

                    //    var x = _this.obj.x;
                    //    var y = _this.obj.y;

                    //    _this.ctx.beginPath();
                    //    _this.ctx.moveTo(0, y + 1);
                    //    _this.ctx.lineTo(_this.canvas.width, y + 1);
                    //    _this.ctx.stroke();

                    //    _this.ctx.beginPath();
                    //    _this.ctx.moveTo(x + 1, 0);
                    //    _this.ctx.lineTo(x + 1, _this.canvas.height);
                    //    _this.ctx.stroke();
                    //}

                    requestAnimationFrame(animate);
                }
            }
        },

        initHitModel: function () {
            var _this = this;
            var $canvas = this.isDetailPage ? $("#canvasDetail") : this.$canvasContainer;
            var lastHoverTargetId = undefined;
            //click event of canvas.
            if (_this.canvas.scrollWidth > 0) {
                _this.hitModel.scaleX = _this.store.page.width / _this.canvas.scrollWidth;
                _this.hitModel.scaleY = _this.store.page.height / _this.canvas.scrollHeight;
            }

            $canvas.off('click').click(function (e) {
                if (!_this.hitModel) return;
                var result = _this.hitModel.firstHitId(e.clientX, e.clientY, null);
                if (result && result.id && result.id != "") {
                    var item = _getHitModelItem(result.type, result.id);
                    item && item.mouseDown && item.mouseDown(e);
                    if (item instanceof ModelRuler.ModelRulerCurrentReference) {
                        console.log('click ModelRulerCurrentReference');
                    } else if (item instanceof ModelText) {
                        console.log('click ModelText');
                    } else {
                        if (item && item.link != undefined) {
                            _this.showDetailDialog(item.link, item.name);
                        } else {
                            new OperatingPane(item.idCom, item.setValue, item.description, _this).show();
                        }
                    }
                }
                e.preventDefault();
            });

            var _getHitModelItem = function (type, id) {
                var item;
                switch (Number(type)) {
                    case _this.enmuElementType.equipment:
                        item = _this.dictEquipments[id];
                        break;
                    case _this.enmuElementType.button:
                        item = _this.dictButtons[id];
                        break;
                    case _this.enmuElementType.ruler:
                        var index_array = id.split('_');
                        if (!index_array || index_array.length != 2) {
                            item = null;
                            break;
                        }
                        var rulerId = index_array[0], refIndex = index_array[1];
                        item = _this.dictRulers[rulerId].references[refIndex];
                        break;
                    case _this.enmuElementType.text:
                        item = _this.dictTexts[id];
                        break;
                    default:
                        item = null;
                }
                return item;
            }

            var targetMouseHoverEnd = function(){
                _this.canvas.style.cursor = "auto";
                if (_this.hitModel.currentModel && _this.hitModel.currentModel.id) {
                    var item = _getHitModelItem(_this.hitModel.currentModel.type, _this.hitModel.currentModel.id);
                    item && item.mouseOut && item.mouseOut();
                    _this.hitModel.currentModel = null;
                }
            }

            $canvas.mousemove(function (e) {
                if (!_this.hitModel) return;
                var result = _this.hitModel.firstHitId(e.clientX, e.clientY, null);

                ////Test: mouse location test
                //_this.obj = _this.hitModel.convertToCanvasPosition(e.clientX, e.clientY);

                if(result && result.id && result.id != "" && result.id!=lastHoverTargetId){
                    targetMouseHoverEnd();
                }
                if (result && result.id && result.id != "") {
                    lastHoverTargetId = result.id;
                    _this.canvas.style.cursor = "pointer";
                    _this.hitModel.currentModel = result;
                    var item = _getHitModelItem(result.type, result.id);
                    item && item.mouseEnter && item.mouseEnter(e);
                } else {
                    lastHoverTargetId = undefined;
                    targetMouseHoverEnd();
                }
                e.preventDefault();
            });
        },

        renderData: function (data) {
            this.refreshData({data: data});
        },

        refreshData: function (e) {
            var _this = this.self ? this.self : this;
            if (e.data && !e.data.error) {
                var tempDistributionsUpdated = {};
                for (var i = 0; i < e.data.length; i++) {
                    var item = _this.dictRefreshMap[e.data[i].name];
                    if (item) {
                        if (item.pipelines) {
                            for (var j = 0; j < item.pipelines.length; j++) {
                                var pipline = _this.dictPipelines[item.pipelines[j]];
                                pipline.dictIdCom[e.data[i].name] = e.data[i].value == 1 ? true : false;
                            }
                        }
                        if (item.equipments) {
                            for (var j = 0; j < item.equipments.length; j++) {
                                var equipment = _this.dictEquipments[item.equipments[j]];
                                equipment.value = e.data[i].value;
                                equipment.update(null, null);
                            }
                        }
                        if (item.charts) {
                            for (var j = 0; j < item.charts.length; j++) {
                                _this.dictCharts[item.charts[j]].update(e.data[i].name, e.data[i].value);
                            }
                        }
                        if (item.gages) {
                            for (var j = 0; j < item.gages.length; j++) {
                                _this.dictGages[item.gages[j]].update(e.data[i].value);
                            }
                        }
                        if (item.tempDistributions) {
                            for (var j = 0; j < item.texts.length; j++) {
                                if (item.tempDistributions && item.tempDistributions.length > 0) {
                                    if (!tempDistributionsUpdated[item.tempDistributions[j]]) {
                                        tempDistributionsUpdated[item.tempDistributions[j]] = [];
                                    }
                                    tempDistributionsUpdated[item.tempDistributions[j]].push(e.data[i]);
                                    _this.dictTexts[item.texts[j]].update(e.data[i].value, true);
                                }
                                else {
                                    _this.dictTexts[item.texts[j]].update(e.data[i].value);
                                }
                            }
                            continue;
                        }

                        if (item.texts) {
                            for (var j = 0; j < item.texts.length; j++) {
                                _this.dictTexts[item.texts[j]].update(e.data[i].value);
                            }
                        }
                        if (item.rulers) {
                            for (var j = 0; j < item.rulers.length; j++) {
                                _this.dictRulers[item.rulers[j]].update(e.data[i].name, e.data[i].value);
                            }
                        }
                    }
                }
                // 防止同一个温度图多次绘制
                for (var tempId in tempDistributionsUpdated) {
                    var tempUpdatedData = tempDistributionsUpdated[tempId];
                    _this.dictTempDistributions[tempId].update(tempUpdatedData);
                }

                //TODO: to be removed;
                for (var pointName in _this.dictCharts) {
                    var chart = _this.dictCharts[pointName];
                    if (!chart.isRunning) {
                        chart.isRunning = true;
                        chart.renderChart(chart);
                    }
                }
            } else {
                //new Alert(_this.container, Alert.type.danger, I18n.resource.code[e.data.error]).showAtTop(5000);
            }

            _this.isDataReady = true;
        },

        initCanvasCache: function () {
            this.cacheCanvas = document.createElement("canvas");
            this.cacheCtx = this.cacheCanvas.getContext("2d");
            this.cacheCanvas.width = this.canvas.width;
            this.cacheCanvas.height = this.canvas.height;

            //paint
            var item, element;
            for (var i = 0; i < 10; i++) {
                for (item in this.dictEquipments) {
                    element = this.dictEquipments[item];
                    if ((!element.idCom || element.idCom == "") && element.layer == i) element.paint(this.cacheCtx);
                }
                for (item in this.dictButtons) {
                    element = this.dictButtons[item];
                    if ((!element.idCom || element.idCom == "") && element.layer == i) element.paint(this.cacheCtx);
                }
            }
            for (item in this.dictTexts) {
                element = this.dictTexts[item];
                if (!element.idCom || element.idCom == "") element.paint(this.cacheCtx);
            }
        },

        initImageDictionary: function () {
            if (this.store.images) {
                var item;
                for (var i = 0; i < this.store.images.length; i++) {
                    item = this.store.images[i];
                    this.addImageIntoRequestQueue(item);
                }
            }

            if (this.store.animationImages) {
                var item;
                for (var i = 0; i < this.store.animationImages.length; i++) {
                    item = this.store.animationImages[i];
                    this.addImageIntoRequestQueue("animation_" + item);
                }
            }

            //wait for loading images.
            var _this = this;
            var interval = setInterval(function (e) {
                var isCompleted = true;
                for (var key in _this.dictImages) {
                    if (!_this.dictImages[key].complete) {
                        isCompleted = false;
                        break;
                    }
                }
                if (isCompleted && _this.isDataReady) {
                    clearInterval(interval);
                    Spinner.stop();
                }
            }, 300);
        },

        initPipelines: function () {
            this.dictPipelines = {};
            if (this.store.pipelines) {
                var item, tempLine;
                for (var i = 0; i < this.store.pipelines.length; i++) {
                    item = this.store.pipelines[i];

                    tempLine = new ModelPipeline(item.id, null, null);
                    tempLine.x = parseInt(item.startX);
                    tempLine.y = parseInt(item.startY);
                    tempLine.startX = parseInt(item.startX);
                    tempLine.startY = parseInt(item.startY);
                    tempLine.endX = parseInt(item.endX);
                    tempLine.endY = parseInt(item.endY);
                    tempLine.lineWidth = parseInt(item.width);
                    tempLine.direction = item.direction == "1" ? false : true;
                    tempLine.speed = 1;
                    tempLine.layer = item.layer;
                    tempLine.waterType = item.waterType;
                    tempLine.color = item.color

                    if (item.idCom && item.idCom.toString() != "") {
                        tempLine.idCom = item.idCom;
                        var arr = item.idCom.split(',');
                        for (var j = 0; j < arr.length; j++) {
                            if (arr[j] && arr[j].toString() != "") {
                                tempLine.dictIdCom[arr[j]] = false;
                                this.addElementIdIntoDictRefreshMap(arr[j], this.enmuElementType.pipeline, item.id);
                            }
                        }
                    }

                    this.dictPipelines[item.id] = tempLine;
                }
            }
        },

        initEquipments: function () {
            this.dictEquipments = {};
            if (this.store.equipments) {
                var item, tempEquip;
                for (var i = 0; i < this.store.equipments.length; i++) {
                    item = this.store.equipments[i];

                    tempEquip = new ModelEquipment(item.id, null, null);
                    tempEquip.x = item.x;
                    tempEquip.y = item.y;
                    tempEquip.width = item.width;
                    tempEquip.height = item.height;
                    tempEquip.animation = item.animation;
                    tempEquip.idCom = item.idCom;
                    tempEquip.layer = item.layer;

                    if (!item.isFromAnimation) {
                        tempEquip.image = this.dictImages[item.idPicture];
                    }
                    else {
                        if (tempEquip.animation[0]) {
                            tempEquip.image = this.dictImages[tempEquip.animation[0].animationId];
                        }
                    }

                    if (item.rotate != "0.0") tempEquip.rotate = item.rotate;

                    if (item.idCom && item.id != "")
                        this.addElementIdIntoDictRefreshMap(item.idCom, this.enmuElementType.equipment, item.id);
                    if (item.link > -1) {
                        tempEquip.link = item.link;
                        this.hitModel.add(item.id, this.enmuElementType.equipment, item.x, item.y, item.width, item.height);
                    }
                    this.dictEquipments[item.id] = tempEquip;
                }
            }
        },

        initCharts: function () {
            this.dictCharts = {};
            function ChartFactory(elementType) {
                var chart;
                switch (Number(elementType)) {
                    case 52:
                        chart = LineChart;
                        break;
                    case 53:
                        chart = BarChart;
                        break;
                    case 54:
                        chart = PieChart;
                        break;
                    default:
                        chart = LineChart;
                }
                return chart;
            }

            if (this.store.charts) {
                var item, tempChart;
                for (var i = 0; i < this.store.charts.length; i++) {

                    item = this.store.charts[i];
                    var ElementChart = ChartFactory(item.elementType)
                    tempChart = new ElementChart(item.id, null, null);
                    tempChart.x = item.x;
                    tempChart.y = item.y;
                    tempChart.width = item.width;
                    tempChart.height = item.height;
                    tempChart.units = item.data;
                    if (item.interval && item.interval != '') tempChart.interval = item.interval;

                    tempChart.init();

                    for (var j = 0; j < item.data.length; j++)
                        this.addElementIdIntoDictRefreshMap(item.data[j].pointName, this.enmuElementType.chart, item.id);
                    this.dictCharts[item.id] = tempChart;
                }
            }
        },

        initGages: function () {
            this.dictGages = {};
            if (this.store.gages) {
                var item, tempGage;
                for (var i = 0; i < this.store.gages.length; i++) {
                    item = this.store.gages[i];

                    tempGage = new ModelGage(item.id, null, null);
                    tempGage.width = item.width;
                    tempGage.height = item.height;
                    tempGage.idCom = item.idCom;
                    tempGage.minValue = item.min;
                    tempGage.maxValue = item.max;

                    if (item.pagetype === 'floating' && item.xposition && item.yposition) {
                        tempGage.x = item.x - item.xposition;
                        tempGage.y = item.y - item.yposition;
                    } else {
                        tempGage.x = item.x;
                        tempGage.y = item.y;
                    }

                    this.addElementIdIntoDictRefreshMap(item.idCom, this.enmuElementType.gage, item.id);
                    this.dictGages[item.id] = tempGage;
                }
            }
        },

        initRulers: function () {
            this.dictRulers = {};
            if (this.store.rulers) {
                var item, tempRuler;
                for (var i = 0; i < this.store.rulers.length; i++) {
                    item = this.store.rulers[i];

                    tempRuler = new ModelRuler(this, item.id, null, null);
                    tempRuler.x = item.x;
                    tempRuler.y = item.y;
                    tempRuler.width = item.width;
                    tempRuler.height = item.height;

                    tempRuler.minValue = item.min;
                    tempRuler.maxValue = item.max;
                    tempRuler.name = item.name;
                    tempRuler.decimal = item.decimal;
                    tempRuler.mainScale = item.mainScale;
                    tempRuler.minorScale = item.minorScale;

                    for (var j = 0; j < item.levels.length; j++) tempRuler.levels.push(item.levels[j]);
                    for (var j = 0; j < item.references.length; j++) {
                        if (item.references[j].idCom != "") {
                            this.addElementIdIntoDictRefreshMap(item.references[j].idCom, this.enmuElementType.ruler, item.id);
                        }
                        tempRuler.references.push(item.references[j]);
                    }

                    tempRuler.init();
                    this.dictRulers[item.id] = tempRuler;
                    for (var n = 0, len = tempRuler.references.length; n < len; n++) {
                        var ref = tempRuler.references[n];
                        Number(ref.isInUp) !== 1 && ref.panel && this.hitModel.add(item.id + '_' + n, this.enmuElementType.ruler, ref.panel.x, ref.panel.y, ref.panel.w, ref.panel.h);
                    }
                }
            }
        },

        initButtons: function () {
            this.dictButtons = {};
            if (this.store.buttons) {
                var item, tempButton;
                for (var i = 0; i < this.store.buttons.length; i++) {
                    item = this.store.buttons[i];

                    tempButton = new ModelButton(item.id, null, null);
                    tempButton.x = item.x;
                    tempButton.y = item.y;
                    tempButton.width = item.width;
                    tempButton.height = item.height;
                    tempButton.image = this.dictImages[item.comm];
                    tempButton.imageComm = this.dictImages[item.comm];
                    tempButton.imageOver = this.dictImages[item.over];
                    tempButton.imageDown = this.dictImages[item.down];
                    tempButton.imageDisable = this.dictImages[item.disable];
                    tempButton.idCom = item.idCom;
                    tempButton.setValue = item.setValue;
                    tempButton.description = item.description;
                    tempButton.layer = item.layer;
                    tempButton.fontSize = item.fontSize;
                    tempButton.fontColor = item.fontColor;

                    if (item.text) tempButton.text = item.text;
                    if (item.link > -1) tempButton.link = item.link;

                    this.hitModel.add(item.id, this.enmuElementType.button, item.x, item.y, item.width, item.height);

                    this.dictButtons[item.id] = tempButton;
                }
            }
        },

        initCheckboxs: function () {
            this.dictCheckboxs = {};
            if (this.store.checkboxs) {
                var item, tempCheckbox;
                for (var i = 0; i < this.store.checkboxs.length; i++) {
                    item = this.store.checkboxs[i];

                    tempCheckbox = new ModelButton(item.id, null, null);
                    tempCheckbox.x = item.x;
                    tempCheckbox.y = item.y;
                    tempCheckbox.width = item.width;
                    tempCheckbox.height = item.height;
                    tempCheckbox.layer = item.layer;
                    tempCheckbox.idCom = item.idCom;
                    tempCheckbox.type = item.type;
                    tempCheckbox.fontColor = item.fontColor;
                    tempCheckbox.fontSize = item.fontSize;
                    tempCheckbox.setValue = item.setValue;
                    tempCheckbox.unsetValue = item.unsetValue;
                    tempCheckbox.text = item.text;
                    tempCheckbox.idGroup = item.idGroup;
                    tempCheckbox.expression = item.expression;

                    this.dictCheckboxs[item.id] = tempCheckbox;
                }
            }
        },

        initTempDistribution: function () {
            this.dictTempDistributions = {};
            if (this.store.tempDistributions
                && !!this.store.tempDistributions.data
                && this.store.tempDistributions.data.length) {
                var item, tempDistribution;
                item = this.store.tempDistributions;
                tempDistribution = new ModelTempDistribution(item.pageid, null, null);
                tempDistribution.layer = item.layer;
                tempDistribution.data = item.data;
                tempDistribution.width = item.width;
                tempDistribution.height = item.height;
                tempDistribution.x = item.x;
                tempDistribution.y = item.y;
                tempDistribution.heatType = item.heatType;
                tempDistribution.init();
                this.dictTempDistributions[item.pageid] = tempDistribution;
                for (var n = 0, len = item.data.length; n < len; n++) {
                    var point = item.data[n];
                    this.addElementIdIntoDictRefreshMap(point.idCom, this.enmuElementType.temperature, item.pageid);
                }


                $("#btnTemperatureSetting").show().eventOff('click').eventOn('click', function (e) {
                    new TemperatureSetting(item.heatType).show();
                });
            }else if (this.id) {
                tempDistribution = new ModelTempDistribution(this.id, null, null);
                tempDistribution.init();
                this.dictTempDistributions[this.id] = tempDistribution;
            }
        },

        initRects: function () {
            var rects;
            
            this.dictRects = {};
            if (this.store.rects && this.store.rects.length) {
                for (var i = 0, row, len = this.store.rects.length; i < len; i++) {
                    row = this.store.rects[i];
                    rects = new ModelRect(row.id, null, null);

                    rects.x = parseInt(row.x);
                    rects.y = parseInt(row.y);
                    rects.width = parseInt(row.width);
                    rects.height = parseInt(row.height);
                    rects.layer = row.layer;

                    this.dictRects[row.id] = rects;
                }
            }
        },

        initTexts: function () {
            var _this = this;
            var modalTextIds = {};
            var dicEquipments, dicFaults, getErrData, getErrDataNew;
            if (this.isInDiagnosis) {
                dicEquipments = this.diagScreen.dictEquipment;
                dicFaults = this.diagScreen.dictFault;
                getErrData = function (id) {
                    var data = [];
                    for (var t in dicEquipments) {
                        if (dicEquipments[t].modalTextId === id) {
                            data = data.concat(dicEquipments[t].faultIds.concat());
                        }
                    }
                    return data;
                };
                //获得projectId=80状态下所需要的数据
                if (AppConfig.projectId == 80) {
                    getErrDataNew = function (id) {
                        var dataNew = [];
                        for (var t in dicEquipments) {
                            if (dicEquipments[t].modalTextId === id) {
                                if (dicEquipments[t].subSystemName) {
                                    dataNew = dataNew.concat(dicEquipments[t].subSystemName);
                                } else {
                                    continue;
                                }
                            }
                        }
                        return dataNew;
                    };
                }
            }
            this.dictTexts = {};
            if (this.isInDiagnosis) {
                for (var i in dicEquipments) {
                    modalTextIds[dicEquipments[i].modalTextId] = dicEquipments[i].id;
                }
            }

            if (this.store.texts) {
                var item, tempText;
                for (var i = 0; i < this.store.texts.length; i++) {
                    item = this.store.texts[i];

                    tempText = new ModelText(item.id, null, null);
                    tempText.x = item.x;
                    tempText.y = item.y;
                    tempText.width = item.width;
                    tempText.height = item.height;
                    tempText.value = item.text;
                    tempText.fontSize = item.fontSize;
                    tempText.decimalplace = item.decimalplace;
                    tempText.font = item.font;
                    tempText.showMode = item.showMode;
                    tempText.readWrite = item.rw;
                    tempText.layer = item.layer;
                    tempText.align = item.align;

                    if (item.showMode == 0 && item.bindString && item.bindString != "") {
                        var arr = item.bindString.split('|');
                        var strs;
                        for (var j = 0; j < arr.length; j++) {
                            strs = arr[j].split(":");
                            tempText.dictBindString[strs[0]] = strs[1];
                        }
                    }
                    if (item.color) {
                        tempText.color = 'rgb(' + item.color.b + ',' + item.color.g + ',' + item.color.r + ')';
                    }
                    if (item.idCom && item.id != "") {
                        tempText.idCom = item.idCom;
                        tempText.value = "--";
                        this.addElementIdIntoDictRefreshMap(item.idCom, this.enmuElementType.text, item.id);
                    }

                    // 新增特殊的 ModalText
                    if (this.isInDiagnosis) {
                        //tempText.color = 'rgb(255,0,0)';
                        if (modalTextIds[item.id]) {
                            tempText.isErrTip = true;
                            tempText.getErrData = getErrData;
                            if (AppConfig.projectId == 80) {
                                tempText.getErrDataNew = getErrDataNew;
                            }
                            tempText.retrunToMoment = function (date) {
                                _this.enterBacktraceMode();

                                Spinner.spin(ElScreenContainer);
                                ToolCurrent.showFramePane();

                                var time = date.toDate();
                                ToolCurrent.requestData(new Date(+time - 7200000), new Date(+time + 7200000), null, true);
                            }
                            this.diagScreen.dictObserverText[item.id] = tempText;
                            tempText.updateDiagnosisGrade(0); //init notice grade
                        }
                    }

                    if ((item.idCom && item.id != "") || this.isInDiagnosis)
                        this.hitModel.add(item.id, this.enmuElementType.text, item.x, item.y - (item.height / 2), item.width, item.height);

                    this.dictTexts[item.id] = tempText;
                }
            }

            if (this.isInDiagnosis) this.diagScreen.resetFloor();
        },

        addElementIdIntoDictRefreshMap: function (idCom, enmuElementType, elementId) {
            if (!this.dictRefreshMap[idCom])
                this.dictRefreshMap[idCom] = {
                    pipelines: [],
                    equipments: [],
                    buttons: [],
                    texts: [],
                    charts: [],
                    gages: [],
                    rulers: [],
                    tempDistributions: []
                };
            switch (enmuElementType) {
                case this.enmuElementType.text:
                    this.dictRefreshMap[idCom].texts.push(elementId);
                    break;
                case this.enmuElementType.pipeline:
                    this.dictRefreshMap[idCom].pipelines.push(elementId);
                    break;
                case this.enmuElementType.equipment:
                    this.dictRefreshMap[idCom].equipments.push(elementId);
                    break;
                case this.enmuElementType.chart:
                    this.dictRefreshMap[idCom].charts.push(elementId);
                    break;
                case this.enmuElementType.button:
                    this.dictRefreshMap[idCom].buttons.push(elementId);
                    break;
                case this.enmuElementType.gage:
                    this.dictRefreshMap[idCom].gages.push(elementId);
                    break;
                case this.enmuElementType.temperature:
                    this.dictRefreshMap[idCom].tempDistributions.push(elementId);
                    break;
                case this.enmuElementType.ruler:
                    this.dictRefreshMap[idCom].rulers.push(elementId);
                    break;
                default:
                    break;
            }
        },

        addImageIntoRequestQueue: function (id) {
            if (this.dictImages[id]) return this.dictImages[id];

            var img = new Image();
            img.src = new StringBuilder().append("/static/images/plant/").append(AppConfig.projectName).append("/").append(id).append(".png").toString();

            var _this = this;
            img.addEventListener("load", function (e) {
                _this.indexImageLoaded++;
            });

            this.dictImages[id] = img;
            return img;
        },

        showDetailDialog: function (pageid, dialogTitle) {
            var obScreen;
            if (!this.isInDiagnosis) {
                if (ScreenModal) ScreenModal.close();
                ScreenModal = new ObserverScreen(pageid);
                dialogTitle && (ScreenModal.dialogTitle = dialogTitle);
                if (this.isPlayback) ScreenModal.isPlayback = true;
                ScreenModal.isDetailPage = true;
                ScreenModal.show();
            } else {
                // this.close();
                this.diagScreen.obScreen.close();
                obScreen = new ObserverScreen(pageid);
                obScreen.isInDiagnosis = true;
                obScreen.diagScreen = this.diagScreen;
                dialogTitle && (obScreen.dialogTitle = dialogTitle);
                if (this.isPlayback) obScreen.isPlayback = true;
                obScreen.isDetailPage = false;
                obScreen.show(this.container);
                this.diagScreen.ScreenModal = obScreen;
                obScreen = null;
            }
        },

        showErrTip: function (modalTextId) {
            try {
                var text = this.dictTexts[modalTextId];
                var scaleX = this.hitModel.scaleX;
                var scaleY = this.hitModel.scaleY;
                var rect = this.canvas.getBoundingClientRect();
                var e = {
                    pageX: text.x / scaleX + rect.left + this.canvas.scrollLeft,
                    pageY: text.y / scaleY + rect.top + this.canvas.scrollTop
                };
                text.mouseEnter(e);
            } catch (e) {
                // 在不同楼层间快速切换时，以上参数中可能有些还正在初始化中，此时该函数处于不稳定状态
                // 在这里加上 try catch 来处理该情况
                console.log('click too fast!');
            }

        },

        hideErrTip: function (modalTextId) {
            try {
                var text = this.dictTexts[modalTextId];
                text.mouseOut(null);
            } catch (e) {
                // 原因同上
                console.log('click too fast!');
            }
        },

        //enmu of element type
        enmuElementType: {pipeline: 0, equipment: 1, button: 2, text: 3, chart: 4, gage: 5, ruler: 6, temperature: 7}
    };

    return ObserverScreen;
})();