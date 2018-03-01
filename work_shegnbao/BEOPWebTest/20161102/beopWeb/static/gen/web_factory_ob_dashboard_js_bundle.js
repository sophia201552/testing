(function () {
    var _this;
    var Spinner = new LoadingSpinner({color: '#00FFFF'});

    function EnergyScreen(options, container) {
        _this = this;

        this.options = options;

        // 中间内容区域容器
        this.windowCtn = (function (container) {
            if (typeof container === 'string') {
                return document.querySelector('#' + container);
            } else if (container instanceof HTMLElement) {
                return container;
            } else {
                return null;
            }
        } (container));

        // 数据源面板容器
        this.dataSourcePanelCtn = null;
        // 可选模块面板容器
        this.modulePanelCtn = null;

        // dashboard 实际的显示区域
        this.container = null;
        this.$pageNav = null;

        // 一些存放数据的对象
        this.store = {};
        this.listEntity = [];
        this.arrEntityOrder = [];
        this.mapRefresh = {};
        this.popRefresh = {};
        this.requestPoints = [];
        this.dictPopToEntity = {};
        this.paneDatasource = null;

        // 实时更新者
        this.workerUpdate = null;
    }

    EnergyScreen.prototype.htmlUrl = '/static/app/WebFactory/views/energyScreen.html';

    EnergyScreen.prototype.show = function () {
        var _this = this;

        return WebAPI.get(this.htmlUrl).then(function (html) {
            _this.windowCtn.innerHTML = '';
            // 初始化布局
            _this.initLayout(html);
            // 初始化操作
            return _this.init();
        });
    };

    EnergyScreen.prototype.getPageData = function () {
        // loading
        Spinner.spin(this.windowCtn);
        var material;
        if($('#hidPageInfo').length > 0){
            material = JSON.parse($('#hidPageInfo').val()).material;
        }
        if(material === 1){
            return WebAPI.post("/factory/material/getByIds",{'ids': [this.options.id]})
                .always(function(e){
                    Spinner.stop();
                });
        }else{
            return WebAPI.get("/spring/get/" + this.options.id + '/' + AppConfig.isFactory)
                .always(function (e) {
                    Spinner.stop();
                });
        }
    };

    EnergyScreen.prototype.init = function () {
        var promise = this.getPageData();
        AppConfig.datasource = new DataSource(_this);
        return promise.done(function (rs) {
            var material;
            if($('#hidPageInfo').length > 0){
                material = JSON.parse($('#hidPageInfo').val()).material;
            }
            if(material === 1){
                rs[0].content.layout = [[rs[0].content.layout]];
                this.store = rs[0].content;
            }else{
                this.store = rs;
            }

            // 初始化 可选模块 工厂类
            this.initIoc();

            // 初始化图元数据
            this.initModuleLayout();

            // 开始加载数据
            this.initWorkerForUpdating();

            this.attachEvents();
        }.bind(this));
    };

    EnergyScreen.prototype.attachEvents = function () {
    };

    EnergyScreen.prototype.initIoc = function () {
        this.factoryIoC = new FactoryIoC('dashboard');
    };

    EnergyScreen.prototype.initLayout = function (html) {
        this.initLayoutDOM(html);
    };

    EnergyScreen.prototype.initLayoutDOM = function (html) {
        var divMain, stCt;

        // 初始化中间区域的内部 DOM
        divMain = document.createElement('div');
        divMain.className = 'indexContent st-pusher';
        divMain.innerHTML = html;

        stCt = $('<div id="st-container" class="st-container">')[0];
        stCt.appendChild(divMain);
        this.windowCtn.appendChild(stCt);

        this.container = divMain.querySelector('#paneCenter');
        this.$container = $(_this.container);
    };

    EnergyScreen.prototype.initWorkerForUpdating = function () {
        this.workerUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
        this.workerUpdate.self = this;
        this.workerUpdate.addEventListener("message", this.refreshData, true);
        this.workerUpdate.addEventListener("error", function (e) { console.log(e) }, true);

        this.workerUpdate.postMessage({ pointList: this.requestPoints, type: "datasourceRealtime" });
    };

    EnergyScreen.prototype.initModuleLayout = function () {
        if (!(this.store && this.store.layout)) return;
        for (var i = 0, item; i < this.store.layout.length; i++) {
            for (var j = 0; j < this.store.layout[i].length; j++) {
                item = this.store.layout[i][j];
                var modelClass,entity;
                if (item.modal.type && (item.modal.type != 'ModalNone' || item.isNotRender == true)) {
                    //regist IoC
                    modelClass = this.factoryIoC.getModel(item.modal.type);
                    if(!modelClass) continue;
                    if (item.isNotRender) continue;
                    entity = new modelClass(this, item);
                    this.listEntity[item.id] = entity;
                    this.arrEntityOrder.push(item.id);
                    if(item.modal.type == 'ModalAppButton'){
                        entity.render();
                        continue;
                    }
                    if (item.modal.interval && item.modal.interval >= 0) {
                        for (var k = 0, point, kLen = item.modal.points.length; k < kLen; k++) {
                            point = item.modal.points[k];
                            if (this.requestPoints.indexOf(point) < 0) {
                                this.requestPoints.push(point);
                            }
                        }
                    }
                    // if(item.modal.popId){
                    //     if(!this.dictPopToEntity[item.modal.popId]) this.dictPopToEntity[item.modal.popId] = [];
                    //     this.dictPopToEntity[item.modal.popId].push(item.id);
                    //     if (this.requestPoints.indexOf(item.modal.popId) < 0) {
                    //         this.requestPoints.push(item.modal.popId);
                    //     }
                    // }
                    entity.render();
                    //this.isForReport && entity.configure();
                }else if(item.modal.type == 'ModalNone'){
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
        if($springCtn.length == 1 && parseFloat($springCtn[0].style.height) >= parseFloat("99%") && parseFloat($springCtn[0].style.width) >= parseFloat("99%")){
            $springCtn.children('.panel-default').css({
                border: 'none',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%'
            });
        }
        if(this.options.isForMobile)this.$container.addClass('forMobile');
    };

    EnergyScreen.prototype.refreshData = function (e) {
            var _this = this.self ? this.self : this;
            if (!e.data.error && e.data.dsItemList) {
                var point;
                for (var i = 0, iLen = e.data.dsItemList.length; i < iLen; i++) {
                    point = e.data.dsItemList[i];
                    _this.mapRefresh[point.dsItemId] = point;
                    //如果point是pop绑定的点，加入到_this.popRefresh
                    if(_this.dictPopToEntity[point.dsItemId]){
                        _this.popRefresh[point.dsItemId] = point;
                    }
                }
                var entity, arrUpdataData;
                for (var key in _this.listEntity) {
                    entity = _this.listEntity[key];
                    if(entity.entity.modal.type =="ModalNone" || entity.entity.modal.type =="ModalMix")continue;
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
                                'guageFulTitle':entity.entity.modal.option.guageFulTitle,
                                'guageFixed':entity.entity.modal.option.guageFixed,
                                'guageUnit':entity.entity.modal.option.guageUnit,
                                'timeLocal':entity.entity.modal.option.timeLocal,
                                'guageDirect':entity.entity.modal.option.guageDirect,
                                'guageBgColor':entity.entity.modal.option.guageBgColor,
                                'transDataDot':entity.entity.modal.option.transDataDot
                            });
                        }
                        //entity.entity.modal.popId && entity.renderPop(_this.popRefresh[entity.entity.modal.popId]);
                        entity.update(arrUpdataData);
                    }
                }
            } else {
                //new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code[e.data.error]).showAtTop(5000);
            }
        },

    EnergyScreen.prototype.close = function () {
        // 销毁遗留的异常DOM
        $('.datetimepicker').remove();

        this.listEntity.forEach(function (row) {
            row.close();
        });

        if (this.workerUpdate) {
            this.workerUpdate.terminate();   
            this.workerUpdate = null;
        }

        if (this.windowCtn) {
            this.windowCtn.innerHTML = '';
            this.windowCtn = null;
        }

        this.store = null;
        this.listEntity = null;
        this.arrEntityOrder = null;
        this.dsInfolist = null;
        this.mapRefresh = null;
        this.requestPoints = null;
        this.dictPopToEntity = null;

    };

    namespace('observer.screens').EnergyScreen = EnergyScreen;
})();

/**
 * Created by win7 on 2016/5/28.
 */
(function () {
    function EnergyScreen_M(options, container) {
        if(options){
            options.isForMobile = true;
        }else{
            options = {
                isForMobile:true
            }
        }
        namespace('observer.screens').EnergyScreen.call(this,options,container)
    }
    EnergyScreen_M.prototype = Object.create(namespace('observer.screens.EnergyScreen').prototype);
    namespace('observer.screens').EnergyScreen_M = EnergyScreen_M;
})();
/**
 * tooltip 扩展模块
 */
(function (exports) {
    /////////////
    // TOOLTIP //
    /////////////
    var configMap = {
        // delay to load
        textTooltipTemplate: '<div class="tooltip observer-text-tooltip observer-text-editor" draggable="true" data-h5-draggable-node="true" data-ds-id="">\
        <div class="tooltip-inner">\
        <div>\
        <span id="pointName"></span>\
        <span class="label" style="font-weight:500;margin-left:5px;padding:1px 3px;color:#000;background-color:#c7c7c7;">Copy</span>\
        </div>\
        <div id="pointAlias">12312312</div><div><a class="lkAddToDS" href="javascript:;">\
        {interAnalysis}</a></div></div></div>',
        textEditorZIndex: 2200,
        textEditorOpacity: 0.8,
        textTooltipBackgroundColor: '#1A1A1A',
        textEditorIdPrefix: 'observer-text-editor-'
    };
    var TOOLTIP_DELAY = 1000;
    var $tooltip = null;
    var tooltipTimer = null;
    var tooltip = {
        show: function () {
            $tooltip.css('display', '');
            $tooltip.css('opacity', configMap.textEditorOpacity);
            if (tooltipTimer) { window.clearTimeout(tooltipTimer); tooltipTimer = null; }
        },
        hide: function () {
            if (!tooltipTimer) {
                tooltipTimer = window.setTimeout(function () {
                    $tooltip !== null && $tooltip.css('opacity', 0);
                    tooltipTimer = null;
                }, TOOLTIP_DELAY);
            }
        }
    };
    var dsLoadPromise = null;
    // 记录一下上一次加载的数据源，用于连续两次查询相同数据源的优化
    var lastQueryDs = null;

    var TooltipMixin = {
        enableTooltip: true,
        isInMouseOver: false,
        initTooltip: function (opt) {
            var _this, shape, ds, clickable;
            var container, shapeItem;
            // 容器的偏移量
            var offset;

            opt = $.extend(false, {}, opt);
            _this = this;
            shape = opt.shape || this.shape;
            ds = opt.ds || this.store.model.idDs()[0];
            clickable = typeof opt.clickable === 'undefined' ? false : opt.clickable;
            container = opt.container || this.page.painterCtn;

            if (shape.nodeType === 'Shape'){
                shapeItem = shape;
            } else {
                shapeItem = $(shape);
            }

            offset = $(container).offset();
            shapeItem.on('mouseenter',function(event){
                if (_this.isInMouseOver) return;
                $tooltip = _this.createTooltip(container, {
                    ds: ds,
                    clickable: clickable
                });
                tooltip.show();
                if (event.evt) {
                    container.style.cursor = 'pointer';
                    _this.checkPopoverBoundary(container, $tooltip, event.evt.pageX - offset.left, event.evt.pageY - offset.top);
                } else {
                    this.style.cursor = 'pointer';
                    _this.checkPopoverBoundary(container, $tooltip, event.pageX - offset.left, event.pageY - offset.top);
                }
                _this.isInMouseOver = true;
            });
            shapeItem.on('mouseleave ',function(e){
                if (e.evt) {
                    container.style.cursor = 'auto';
                } else {
                    this.style.cursor = 'auto';
                }
                tooltip.hide();
                _this.isInMouseOver = false;
            });
        },
        createTooltip: function (container, params) {
            var _this = this;
            var template, $template = $tooltip;
            var ds = params.ds;
            var clickable = params.clickable;
            var $pointName;
            // 是否是老式的数据源使用格式，即：纯数据源ID 的格式
            var isOldDsFormat = false;

            if (!$template || !$template.length) {
                template = configMap.textTooltipTemplate.formatEL({
                    interAnalysis:I18n.resource.observer.observerScreen.TEXT_ADD_TO_DATASOURCE
                });
                $template = $(template);
                $template.on('mouseenter', function () {
                    tooltip.show();
                }).on('mouseleave', function () {
                    tooltip.hide();
                }).on('transitionend', function (e) {
                    e = e.originalEvent;
                    if (e.propertyName === 'opacity' && e.target.style.opacity === '0') {
                        e.target.style.display = 'none';
                    }
                    e.stopPropagation();
                }).css({
                    'display': 'block',
                    'max-width': 'none',
                    'opacity': configMap.textEditorOpacity,
                    'z-index': configMap.textEditorZIndex - 1
                }).find('.tooltip-inner').css({
                    'background-color': configMap.textTooltipBackgroundColor,
                    'opacity': configMap.textEditorOpacity,
                    'max-width': 'none'
                });

                // 点名复制逻辑
                $template.find('.label').click(function (e) {
                    var input = document.createElement('textarea');

                    document.body.appendChild(input);
                    input.value = $template.find('#pointName').text();
                    input.focus();
                    input.select();
                    document.execCommand('Copy');
                    input.remove();
                    e.preventDefault();
                    e.stopPropagation();
                });

                if (clickable) {
                    $template.find('.lkAddToDS').click(function (e) {
                        var pointName = $(this).parents('.tooltip-inner').find('#pointName').text();
                        new ModalAppendPointToDs(false, null, [pointName]).show();
                        e.preventDefault();
                    });
                }
            }

            if (!$.contains(container, $template[0])) {
                $(container).append($template);
            }

            $template[0].dataset.dsId = ds;
            
            // 如果本次请求的数据源信息和上一次一致，则沿用上一次查询的结果
            if (lastQueryDs === ds) {
                return $template;
            }

            if (dsLoadPromise && dsLoadPromise.state() === 'pending') {
                // 中止上一次的请求
                dsLoadPromise.abort();
            }
            dsLoadPromise = WebAPI.post('/analysis/datasource/getDsItemsById', [ds]);
            lastQueryDs = ds;

            if (ds.indexOf('|') > -1) {
                ds = ds.split('|')[1];
            } else {
                isOldDsFormat = true;
            }
            $template.find('#pointName').text(ds);
            $template.find('#pointAlias').text('loading');

            dsLoadPromise.done(function (rs) {
                var alias;
                if (rs && rs.length) {
                    alias = rs[0].alias;
                }

                if (isOldDsFormat) {
                    $template.find('#pointName').text(rs[0].value);
                }

                if (alias && alias !== rs[0].value) {
                    $template.find('#pointAlias').text(rs[0].alias).show();
                }
                // 如果 alias 不存在 或 alias 和 value 一致，则隐藏 alias
                else {
                    $template.find('#pointAlias').text('').hide();
                }
            });

            return $template;
        },
        checkPopoverBoundary: function (container, $popover, pageX, pageY) {
            var $container = $(container),
                offsetX = 10,
                offsetY = 0,
                popoverWidth = $popover.width(),
                popoverHeight = $popover.height(),
                rightX = Math.min(pageX + popoverWidth + offsetX, $container.width() - 5),
                rightY = Math.min(pageY + popoverHeight + offsetY, $container.height() - 5);

            $popover.css({
                left: rightX - popoverWidth + offsetX,
                top: rightY - popoverHeight + offsetY
            })
        }
    };


    exports.TooltipMixin = TooltipMixin;
} (
    namespace('mixins')
));