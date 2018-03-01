/**
 * PageScreen
 */
(function () {
    var _this;
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });

    function PageScreen(options, container, params) {
        _this = this;
        this.options = options;
        this.page = null;
        this.preview = '';
        this.lastDate = undefined;
        this.painterCtn = (function (container) {
            if (typeof container === 'string') {
                return document.querySelector('#' + container);
            } else if (container instanceof HTMLElement) {
                return container;
            } else {
                return null;
            }
        } (container));
        this.painterCtn.classList.add('web-factory-container');

        this.painter = null;

        this.store = {};
        this.store.layerModelSet = new ModelSet();
        this.store.widgetModelSet = new ModelSet();
        this.store.imageModelSet = new ModelSet();
        this.store.dictPoints = {};
        this.store.dictTexts = {};

        // 判断是否是数据回放模式
        this.isReplay = false;
        this.replayCtn = null;

        this._factoryIoC = null;

        // 记录初始化过程的进度的 promise 对象
        this.loadPromise = $.Deferred();
        //记录 显示的状态
        this.showStatusWidgets = [];
        //将所有控件按类型分类 储存
        this.typeGrouping = [];
        //所有控件的宽高 临时储存容器
        this.temporaryCtn = [];
    }

    PageScreen.prototype = {
        show: function () {
            var _this = this;
            var promise = $.Deferred();

            if (typeof this.options.template !== 'undefined') {
                // template data 的处理方式
                promise.resolveWith(this, [this.options.template]);
                
            } else if (typeof this.options.templateId !== 'undefined') {
                // template id 的处理方式
                WebAPI.get('/factory/template/' + this.options.templateId).done(function (rs) {
                    rs = rs.content;
                    this.options.template = {
                        page: {
                            width: rs.width,
                            height: rs.height,
                            display: rs.display
                        },
                        data: JSON.parse(rs.template)
                    };
                    promise.resolveWith(this, [this.options.template]);
                }.bind(this));
            } else {
                WebAPI.get('/factory/getPageDetail/'+this.options.id+'/'+AppConfig.isFactory).done(function (rs) {
                    promise.resolveWith(this, [rs]);
                }.bind(this));
            }

            return promise.done(function (rs) {
                var modelIds = [], defers = [];
                var dictPoints = this.store.dictPoints;
                var paramList = [];
                var _this = this;
                if(!rs || !rs.data || !rs.page) {
                    Log.error('get page detail faild!');
                }
                rs.data.list = rs.page.layerList;

                this.page = rs.page;
                //模式初始化
                this.modelInt();
                // 初始化控件
                this.init();
                // 将数据转换成可监控的数据
                this.updateModelSet(rs.data);
                
                // 如果是预览模式，则无需去遍历出数据源，这里直接返回
                if (this.preview === '1' && AppConfig.isFactory === 1) {
                    this.store.widgetModelSet.forEach(function (model) {
                        // 这里将控件id作为数据源，因为控件id是唯一的
                        dictPoints[model._id()] = [model._id()];
                    });
                    this.startDebugWorker();
                    return;
                }else if(this.preview === '2' && AppConfig.isFactory === 1){//如果是 预览的 points view模式  默认只显示点名 
                    var widgets = this.painter.getAllWidgets();
                    this.typeGrouping = this.widgetsTypeGrouping(widgets);
                    widgets.forEach(function (row) {
                        var model = row.store.model;
                        model.isHide(1);
                        row.detach();
                    });

                }   
                // 整理出 数据源 数组 和 模板参数 数组
                this.store.widgetModelSet.forEach(function (model) {
                    var dsId = model.property('idDs');
                    var options = model.option();
                    var id = model._id();

                    // 提取 faults 映射关系
                    if (AppConfig.isFactory !== 1 &&
                        model.type() === 'HtmlText' &&
                        options.equipments && 
                        options.equipments.length) {
                        options.equipments.forEach(function (row) {
                            _this.store.dictTexts[id] = _this.store.dictTexts[id] || [];
                            _this.store.dictTexts[id].push(row);
                        });
                    }

                    // HtmlDashboard 控件的取点是在其包含的 dashbaord 控件中
                    // 比较特殊，所以这里单独处理
                    if (model.type() === 'HtmlDashboard' &&
                        options.interval > 0 && 
                        options.points && 
                        options.points.length > 0) {
                        dictPoints[id] = dictPoints[id] || [];
                        dictPoints[id] = dictPoints[id].concat(options.points);
                        return;
                    }

                    if (!dsId) {
                        return;
                    }
                    if(this.preview === '2' && dsId.length !== 0){
                        var id = model._id();
                        var type = model.type();
                        var x = model.x();
                        var y = model.y();
                        if(type === "CanvasPipe"){
                            x = model.option().points[0].x;
                            y = model.option().points[0].y;
                        }
                        var str = '<div style="top:'+y+'px;left:'+x+'px;" class="pointNameLabel" data-id="'+id+'" data-type="'+type+'">\
                                        <span class="pointName">'+dsId+'</span>\
                                    </div>';
                        $(this.painter.getHtmlLayer().shape).append($(str));
                        $(this.painterCtn).off().on('click.pointNameLabel','.pointNameLabel',function(){
                            if($(this).css('background').indexOf('rgb(255, 255, 255)') !==-1){
                                $(this).css('background','rgb(255,0,0)');
                            }else{
                                $(this).css('background','rgb(255,255,255)');
                            }
                            
                        })
                    }
                    // 处理 HtmlContainer 模板中的数据源
                    if (typeof dsId.length === 'undefined') {
                        modelIds.push(model._id());
                        defers.push(dsId);
                    } else if (dsId.length > 0) {
                        dictPoints[id] = dictPoints[id] || [];
                        dictPoints[id] = dictPoints[id].concat(dsId);
                    }
                }.bind(this));

                $.when.apply($, defers).done(function () {
                    var args = Array.prototype.slice.call(arguments);
                    args.forEach(function (dsIds, i) {
                        var id = modelIds[i];
                        if (!dsIds || !dsIds.length) {
                            return;
                        }
                        dictPoints[id] = dictPoints[id] || [];
                        dictPoints[id] = dictPoints[id].concat(dsIds);
                    }.bind(this));

                    this.startWorker();
                }.bind(this));
                
            }).always(function () {
                this.painter.onLoad();
                this.loadPromise.resolve();
            }.bind(this));
        },
        factoryIoC: function () {
            if (!this._factoryIoC) {
                this._factoryIoC = new FactoryIoC('dashboard');
            }
            return this._factoryIoC;
        },
        showColorSetBtn: function (isShow) {
            if (AppConfig.isFactory == 1) return;
            if (isShow) {
                var tempDistribution = new ModelTempDistribution(this.options.id, null, null ,_this);
                tempDistribution.init();
                $("#btnTemperatureSetting").show().eventOff('click').eventOn('click', function (e) {
                    new TemperatureSetting('co',true).show();
                });
            } else {
                $("#btnTemperatureSetting").hide().eventOff('click');
                window.colorGettings && delete window.colorGettings;
            }
        },
        // 刷新某个控件
        reloadWidgetById: function (modelId, data) {
            var widget = this.painter.find('#'+modelId)[0];
            widget.reload(data);
        },
        /**
         * 拿到指定类型的控件的 model集合
         * @param  {object|array} types 指定的类型，可以为数组
         * @return {[type]}      [description]
         */
        getModelsByType: function (types) {
            var matches = [];

            // type 转换成数组
            if (typeof types === 'string') {
                types = [types];
            }

            this.store.widgetModelSet.forEach(function (model) {
                if ( types.indexOf( model.type()) > -1 ) {
                    matches.push(model);
                }
            });

            return matches;
        },
        startWorker: function () {
            var dsIds = [], dsMap = {};
            // 获取需要查询的数据源列表
            Object.keys(this.store.dictPoints).forEach(function (id) {
                dsIds = dsIds.concat(this.store.dictPoints[id]);
            }.bind(this));

            // 数组去重
            dsIds.forEach(function (dsId) {
                dsMap[dsId] = null;
            });
            dsIds = Object.keys(dsMap);

            if ( dsIds.length === 0 ) {
                return ;
            }
            this.workerUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
            this.workerUpdate.self = this;
            Spinner.spin(this.painterCtn);
            this.workerUpdate.addEventListener("message", this.onUpdateCallback, true);
            this.workerUpdate.addEventListener("error", function (e) {
                Log.error(e);
            }, true);

            this.workerUpdate.postMessage({pointList: dsIds, type: "datasourceRealtime"});
        },
        startDebugWorker: function () {
            var _this = this;
            var fakeData = [];
            var keys = Object.keys(this.store.dictPoints);

            this.store.widgetModelSet.forEach(function (model) { 
                if ( model['option.preview'] && typeof model['option.preview']() !== 'undefined' &&
                    keys.indexOf(model._id()) > -1 ) {
                    var previewData = model['option.preview']();

                    fakeData.push({
                        data: previewData[0],
                        dsItemId: model._id()
                    });
                }
            });
            
            // 延迟一秒执行
            window.setTimeout(function () {
                _this.onUpdateCallback({
                    data: {
                        dsItemList: fakeData
                    }
                });
            }, 1000);
            
        },
        stopWorker: function () {
            if (_this.workerUpdate) {
                _this.workerUpdate.terminate();
                _this.workerUpdate = null;
            }
        },
        init: function () {
            // 初始化 painter
            if(this.painter) {
                this.painter.close();
            }
            this.painter = new GReadonlyPainter(this, {
                pageWidth: this.page.width,
                pageHeight: this.page.height,
                // 0 - full screen
                // 1 - show in center
                display: this.page.display,
                carouselInterval: this.page.option ? this.page.option.carouselInterval : null,
                carouselDelay: this.page.option ? this.page.option.carouselDelay : null
            });
            //显示热图设置
            this.showColorSetBtn(true);
            this.painter.show();

            if (!AppConfig.isFactory) {
                this.initReplay();
            }
           
        },
        modelInt: function () {
            var _this = this;
            var $checkPreviewPattern = $('#checkPreviewPattern');
            var $pointViewModal = $('#pointViewModal');
            var v = localStorage.getItem('preview');
            var modal;
            if(v === '0'){
                modal = 'Real';
                this.preview = '0';
            }else if(v === '1'){
                modal = 'Debug';
                this.preview = '1';
            }else if(v === '2'){
                modal = 'Points View';
                this.preview = '2';
                $('.pointsViewBtn').css('display','inline-block');
            }else{
                modal = 'Real';
                this.preview = '0';
            }
            var text = modal+'<span class="caret"></span>';
            $('.dropdown-toggle', $checkPreviewPattern).html(text);

            if (this.page.type === 'PageScreen') {
                $checkPreviewPattern.css('display', 'block');
            } else {
                this.preview = '0';
            }
            //选择预览模式
            $('li', $checkPreviewPattern).off('click').on('click', function () {
                var $this = $(this);
                $this.parent().siblings('.dropdown-toggle').html($this.text() + '<span class="caret"></span>');
                localStorage.setItem('preview', this.dataset.checkvalue);
                $('.pointsViewBtn').hide();
                window.location.reload();
            })
            //在 point view模式下 点击配置按钮
            $('.pointViewConfig', $checkPreviewPattern).off('click').on('click',function(){
                $('.scalePercentage').hide();
                $('#pointViewModal table').html('');
                var str,flag,tableTypes=[];
                var allWidgets = _this.store.widgetModelSet.models;
                if(_this.showStatusWidgets.length === 0){
                    _this.typeGrouping.forEach(function(row){
                        var obj = {
                            type:row.type,
                            showWidget:false,
                            showPoint:true,
                            noShow:false
                        }
                        str = _this.pageWidgetsType(obj);
                        $('#pointViewModal table').append($(str));
                        _this.showStatusWidgets.push(obj);
                    })
                }else{
                    for(var j=0,jLength=_this.showStatusWidgets.length;j<jLength;j++){
                        var currentWidget = _this.showStatusWidgets[j];
                        str = _this.pageWidgetsType(currentWidget);
                        $('#pointViewModal table').append($(str));
                    }
                }
                $('#pointViewModal').modal('show');
            })  
            //在 point view模式下 点击缩放按钮
            $('.pointViewScale .glyphicon', $checkPreviewPattern).off('click').on('click',function(){
                if($('.scalePercentage').css('display') === 'block'){
                    $('.scalePercentage').hide();
                }else{
                    $('.scalePercentage').show();
                }
            })
            $('.pointViewScale input', $checkPreviewPattern).off('blur').on('blur',function(){
                var value = $(this).val();
                if(value.indexOf('%') !== -1){
                    value = Math.abs(value.split('%')[0]/100);
                    _this.scalePointsView(value,value);
                }
            })
            //点击缩放的具体比例
            $('.scalePercentage li', $checkPreviewPattern).off('click').on('click',function(){
                $('.pointViewScale input').val($(this).text());
                var value = $(this).text().split('%')[0]/100;
                _this.scalePointsView(value,value);
                $('.scalePercentage').hide();
            })

            //弹出框的取消按钮
            $('#pointViewModal').on('hide.bs.modal', function () {
                $('#pointViewModal table').html('');
            })
            //弹出框的点击button事件
            $pointViewModal.off('click.showBtn').on('click.showBtn','.showBtn',function(){
                if($(this).hasClass('btn-default')){
                    $(this).removeClass('btn-default').addClass('btn-success');
                    if($(this).hasClass('noShow')){
                        $(this).siblings().removeClass('btn-success').addClass('btn-default');
                    }else{
                        $(this).closest('tr').find('.noShow').removeClass('btn-success').addClass('btn-default');
                    }
                }else{
                    $(this).removeClass('btn-success').addClass('btn-default');
                    if(($(this).hasClass('showWidget') && $(this).closest('tr').find('.showPoint').hasClass('btn-success')) || ($(this).hasClass('showPoint') && $(this).closest('tr').find('.showWidget').hasClass('btn-success'))){
                        $(this).closest('tr').find('.noShow').removeClass('btn-success').addClass('btn-default');
                    }else if($(this).hasClass('noShow')){
                        $(this).closest('tr').find('.showWidget').removeClass('btn-default').addClass('btn-success');
                    }else if(($(this).hasClass('showWidget') && $(this).closest('tr').find('.showPoint').hasClass('btn-default')) || ($(this).hasClass('showPoint') && $(this).closest('tr').find('.showWidget').hasClass('btn-default'))){
                        $(this).closest('tr').find('.noShow').removeClass('btn-default').addClass('btn-success');
                    }
                }
            })
            //弹出框的确定按钮
            $('#btnTypeSure').off('click').on('click',function(){
                var $trs = $('#pointViewModal tr');
                $('#pointViewModal').modal('hide');
                Spinner.spin(_this.painterCtn);
                var widgets = _this.painter.getAllWidgets();
                var $pointsNameTooltip = $('.pointNameLabel');
                _this.showStatusWidgets = [];
                var $noShowBtns = $pointViewModal.find(".noShow.btn-success");//不显示
                if($noShowBtns.length === widgets.length){//所有的控件 点名 都不显示
                    $('.pointNameLabel').hide();
                }
                _this.painter.drawMode('manual');
                $trs.each(function(){
                    var type = $(this).attr('data-type');
                    var showWidgetStatus = $(this).find('.showWidget').hasClass('btn-success');
                    var showPointStatus = $(this).find('.showPoint').hasClass('btn-success');
                    var noShowStatus = $(this).find('.noShow').hasClass('btn-success');
                    var obj = {
                            type:type,
                            showWidget:showWidgetStatus,
                            showPoint:showPointStatus,
                            noShow:noShowStatus
                        }
                    _this.showStatusWidgets.push(obj);

                    var models;
                    function condition(widgetType) {
                        models = widgetType.models;
                        return widgetType.type === type;
                    }
                    if (_this.typeGrouping.some(condition)) {
                        for(var i=0,length=models.length;i<length;i++){
                            var model = models[i].store.model;
                            if(showWidgetStatus){
                                model.isHide(0);
                                models[i].attach();
                            }else{
                                model.isHide(1);
                                models[i].detach();
                            }   
                        }
                    }
                    
                    $pointsNameTooltip.each(function(){//遍历所有的点名label
                        if($(this).attr('data-type') === type){
                            if(showPointStatus){//显示
                                $(this).show();
                            }else{
                                $(this).hide();
                            }
                        }
                    })
                });
                _this.painter.drawMode('normal');
                $('#pointViewModal table').html('');
                Spinner.stop();
            })
        },
        pageWidgetsType:function(obj){
            var modalType,noSupportPoint='';
            switch (obj.type){
                case 'CanvasText':
                  modalType="简单文本";
                  break;
                case 'HtmlText':
                  modalType="文本控件";
                  break;
                case 'HtmlButton':
                  modalType="按钮控件";
                  break;
                case 'HtmlContainer':
                  modalType="Html 容器控件";
                  noSupportPoint = 'disabled'
                  break;
                case 'HtmlScreenContainer':
                  modalType="Screen 容器控件";
                  noSupportPoint = 'disabled'
                  break;
                case 'CanvasImage':
                  modalType="图片控件";
                  break;
                case 'CanvasPipe':
                  modalType="管道控件";
                  break;
                case 'CanvasHeat':
                  modalType="热力图选区控件";
                  noSupportPoint = 'disabled'
                  break;
                case 'CanvasHeatP':
                  modalType="热力图标记控件";
                  break;
                case 'HtmlDashboard':
                  modalType="Dashboard 控件";
                  noSupportPoint = 'disabled'
                  break;
                case 'CanvasPolygon':
                  modalType="多边形控件";
                  noSupportPoint = 'disabled'
                  break;
            }
            var swClassName = obj.showWidget ? 'btn-success' : 'btn-default';
            var spClassName = obj.showPoint ? 'btn-success' : 'btn-default';
            var nsClassName = obj.noShow ? 'btn-success' : 'btn-default';

            var str = '<tr data-type="'+obj.type+'">\
                        <td><span>'+modalType+'</span></td>\
                        <td>\
                            <button type="button" class="btn '+swClassName+' showBtn showWidget">显示画面</button>\
                            <button type="button" class="btn '+spClassName+' showBtn showPoint" '+noSupportPoint+'>显示点名</button>\
                            <button type="button" class="btn '+nsClassName+' showBtn noShow">不显示</button>\
                        </td>\
                    </tr>';
            
            return str;
        },
        widgetsTypeGrouping:function(widgets){
            var typeGrouping = [];
            var types = [];
            widgets.forEach(function (row) {
                var model = row.store.model;
                if(types.indexOf(model.type()) !== -1){//没有一样的
                    var index = types.indexOf(model.type());
                    typeGrouping[index].models.push(row);
                }else{
                    var arr = [];
                    var obj = {
                        type:model.type(),
                        models:[]
                    }
                    obj.models.push(row);
                    typeGrouping.push(obj);
                    types.push(model.type());
                }
            });
            return typeGrouping;
        },
        scalePointsView:function(scaleX,scaleY){
            var _this = this; 
            $('.pointNameLabel').css('transform','scale('+scaleX+','+scaleY+')');
            // var widgets = this.painter.getAllWidgets();
            // if(_this.temporaryCtn.length === 0){
            //     _this.painter.drawMode('manual');
            //     $.each(widgets,function(index,row){
            //         var model = row.store.model;
            //         if(model.type() === 'CanvasPipe'){
            //             // var x1 = model.option().points[0].x;
            //             // var x2 = model.option().points[1].x;
            //             // var y1 = model.option().points[0].y;
            //             // var y2 = model.option().points[1].y;
            //             // var width = model.option().width;

            //             // _this.temporaryCtn.push([{x:x1,y:y1},{x:x2,y:y2},{w:width}]);
            //             // var nowW = x2 - x1; 
            //             // var nowH = y2 - y1;
            //             // var w = nowW * scaleX;
            //             // var h = nowH * scaleX;
            //             // var pipeW = width * scaleX;

            //             // var arr = [{
            //             //     x: model.option().points[0].x,
            //             //     y: model.option().points[0].y
            //             // },{
            //             //     x: model.option().points[0].x + w,
            //             //     y: model.option().points[0].y + h
            //             // }];
            //             // row.shape.options.points = arr;
            //             // row.shape.options.width = pipeW;
            //             // model.option(row.shape.options);
                        
            //         }else if(model.type === 'CanvasHeat'){

            //         }else{
            //             _this.temporaryCtn.push({w:model.w(),h:model.h(),x:model.x(),y:model.y()});

            //             // var w = model.w()/_this.painter.pageWidth  * (_this.painter.pageWidth*scaleX);
            //             // var h = model.h()/_this.painter.pageHeight * (_this.painter.pageHeight*scaleX);

            //             var x = model.x()/_this.painter.pageWidth * (_this.painter.pageWidth*scaleX);
            //             var y = model.y()/_this.painter.pageHeight * (_this.painter.pageHeight*scaleX);
            //             // model.w(w);
            //             // model.h(h);
            //             model.x(x);
            //             model.y(y);
            //         }
            //     });
            //     _this.painter.drawMode('normal');
            // }else{
            //     _this.painter.drawMode('manual');
            //     $.each(widgets,function(index,row){
            //         var model = row.store.model;
            //         if(model.type() === 'CanvasPipe'){
            //             // var x1 = _this.temporaryCtn[index][0].x;
            //             // var x2 = _this.temporaryCtn[index][1].x;
            //             // var y1 = _this.temporaryCtn[index][0].y;
            //             // var y2 = _this.temporaryCtn[index][1].y;
            //             // var width = _this.temporaryCtn[index][2].w;
                        
            //             // var nowW = x2 - x1; 
            //             // var nowH = y2 - y1;
            //             // var w = nowW * scaleX;
            //             // var h = nowH * scaleX;
            //             // var pipeW = width * scaleX;
            //             // var arr = [{
            //             //     x: x1,
            //             //     y: y1
            //             // },{
            //             //     x: x1 + w,
            //             //     y: y1 + h  
            //             // }];
            //             // row.shape.options.points = arr;
            //             // row.shape.options.width = pipeW;
            //             // model.option(row.shape.options);
            //         }else if(model.type === 'CanvasHeat'){

            //         }else{
            //             var w = _this.temporaryCtn[index].w* scaleX;
            //             var h = _this.temporaryCtn[index].h * scaleX;
            //             var x = _this.temporaryCtn[index].x* scaleX;
            //             var y = _this.temporaryCtn[index].y * scaleX;
            //             model.w(w);
            //             model.h(h);
            //             model.x(x);
            //             model.y(y);
            //         } 
            //     });
            //     _this.painter.drawMode('normal');
            // }
        },
        // 初始化数据回放
        initReplay: function () {
            // 新增"数据回放"按钮
            var _this = this;
            var $btnTimeShaft = $('#btnDropdownNavList').find('.toolBacktrace');
            if ($btnTimeShaft.length > 0) {
                $btnTimeShaft.remove();
            }

            $btnTimeShaft = $('<li class="iconWrap"><a><span class="glyphicon glyphicon-play-circle"></span><span class="dropdownNav"></span></a></li>').addClass('toolBacktrace');
            $btnTimeShaft.find('.dropdownNav').text(I18n.resource.observer.widgets.BACKTRACE);
            $('#right-nav').find('#btnOperatingRecord').after($btnTimeShaft);

            $btnTimeShaft.eventOn('click', function (e) {
                if (_this.isReplay) {
                    // 调整按钮状态和文字
                    this.classList.remove('selected');
                    _this.quitReplayMode();
                } else {
                    // 调整按钮状态和文字
                    this.classList.add('selected');
                    _this.enterReplayMode();
                }
            }, ['navTool-backTrace', 'btnBackTrace', AppConfig.projectShowName, AppConfig.projectId]);

            // 创建容器
            this.replayCtn = document.createElement('div');
            this.replayCtn.id = 'replayCtn';
            this.replayCtn.style.width = '100%';
            this.replayCtn.style.height = '0px';
            this.painterCtn.appendChild(this.replayCtn);
        },
        // 进入数据回放模式
        enterReplayMode: function (d) {
            var styles = window.getComputedStyle( this.painterCtn );
            var width = parseInt(styles.width);
            var height = parseInt(styles.height);
            var promise = $.Deferred();

            // 关闭原有的刷新机制
            this.stopWorker();
            // 状态位更新
            this.isReplay = true;
            // 显示回放控件
            if (!this.replayTool) {
                this.replayTool = new TimeShaftPageScreen(this);
                promise = this.replayTool.show();
            } else {
                promise.resolve();
            }
            promise.done(function () {
                var time;
                if (d) {
                    this.replayTool.showFramePane();
                    time = d.valueOf();
                    this.replayTool.requestData(new Date(time - 7200000), new Date(time + 7200000), null, true);
                }
            }.bind(this));
            // 调整页面高度
            this.painter.resizePage(width, height - 100);
        },
        // 退出数据回放模式
        quitReplayMode: function () {
            var styles = window.getComputedStyle( this.painterCtn );
            var width = parseInt(styles.width);
            var height = parseInt(styles.height);
            // 开启原有的刷新机制
            this.startWorker();
            // 状态位更新
            this.isReplay = false;
            // 关闭回放控件
            this.replayTool.close();
            this.replayTool = null;
            // 还原页面高度
            this.painter.resizePage(width, height);
        },
        // 数据更新回调
        onUpdateCallback: function (e) {
            var _this = this.self ? this.self : this;
            Spinner.stop();
            if (e.data.error || !e.data.dsItemList) {
                Log.error('Refresh Data Failed!');
                return;
            }
            _this.renderData(e.data.dsItemList);
            _this.lastDate = e.data.dsItemList;
 
        },
        // 设备 错误/警告 信息更新回调
        onUpdateFaultsCallback: function (faults) {
            var _this = this;

            this.loadPromise.done(function () {
                var dictTexts = this.store.dictTexts;
                var faultMap = {};

                if (Object.keys(dictTexts).length === 0) {
                    return;
                }
                faults = faults || [];

                // 生成以 equipmentId 为 key 的 map
                faults.forEach(function (row) {
                    faultMap[row.equipmentId] = faultMap[row.equipmentId] || [];
                    faultMap[row.equipmentId].push({
                        faultId: row.faultId,
                        grade: row.grade
                    });
                });

                Object.keys(dictTexts).forEach(function (modelId) {
                    var textFaults = [];
                    var equipments = dictTexts[modelId];
                    var model = _this.store.widgetModelSet.findByProperty('_id', modelId);

                    equipments.forEach(function (row) {
                        if (faultMap[row]) {
                            textFaults = textFaults.concat(faultMap[row]);
                        }
                    });

                    if (!model['option.faults']) {
                        model.property('option.faults', textFaults);
                    } else {
                        model['option.faults'](textFaults);
                    }

                });
            }.bind(this));
        },
        renderLastData: function () {
            _this.lastDate && _this.renderData(_this.lastDate);
        },
        renderData: function(data) {
            var _this = this.self ? this.self : this;
            var arrModel, model, options, text;
            var dataMap = {};
            // 把返回的数据转换成 map
            data.forEach(function (row) {
                dataMap[row.dsItemId] = row.data;
            });

            this.painter.drawMode('manual');
            Object.keys(this.store.dictPoints).forEach(function (modelId) {
                var data;
                var model = _this.store.widgetModelSet.findByProperty('_id', modelId);
                var options = model.option(), type = model.type();
                var dsIds = type === 'HtmlDashboard' ? options.points : _this.store.dictPoints[modelId];
                var options = model.option();

                if (type === 'HtmlContainer') {
                    text = {};
                    dsIds.forEach(function (dsId) {
                        text[dsId] = dataMap[dsId];
                    });
                } else if (type === 'CanvasPipe') {
                    text = {};
                    dsIds.forEach(function (dsId) { 
                        data = parseFloat(dataMap[dsId]).toFixed(0);
                        if (options.trigger && typeof options.trigger[data] !== 'undefined') {
                            text[dsId] = options.trigger[data];
                        } else {
                            text[dsId] = dataMap[dsId];
                        }
                    });
                } else if (type === 'HtmlDashboard') {
                    text = {};
                    dsIds.forEach(function (dsId) {
                        text[dsId] = dataMap[dsId];
                    });
                } else {
                    data = parseFloat(dataMap[dsIds[0]]).toFixed(0);
                    if(options.trigger && typeof options.trigger[data] !== 'undefined'){
                        text = options.trigger[data];
                    } else {
                        text = dataMap[dsIds[0]];
                    }
                }

                if (typeof options.text === 'undefined') {
                    options.text = '';
                }

                // 兼容一下编辑模式下的数据
                if (typeof options.text === 'string') {
                    // 触发控件更新
                    model.property('option.text', {
                        content: options.text,
                        value: text
                    });
                } else {
                    model['option.text.value'](text);
                }
            });
            this.painter.drawMode('normal');
            this.painter.onUpdated();

        },

        resize: function () {
            var styles = window.getComputedStyle(this.painter.domContainer);
            var width = parseInt(styles.width);
            var height = parseInt(styles.height);

            this.painter.resizePage(width, height);
        },

        // 获取有序的数据
        getSortedData: function (data) {
            var stack = data.list.slice();
            var layerMap = Array.toMap(data.layers, '_id');
            var widgetMap = Array.toMap(data.widgets, '_id');
            var viewedIds = [];
            var id, item;
            var rs = [];

            while(id = stack.pop()) {
                item = layerMap[id];
                if (item) {
                    if (viewedIds.indexOf(id) > -1) {
                        Log.error('factory 图层出现嵌套循环，id：' + id);
                        continue;
                    }
                    viewedIds.push(id);
                    stack = item['list'].concat(stack);
                    // 兼容老数据
                    item.type = 'layer';
                    rs.push(item);
                } 
                // 若是控件
                else {
                    item = widgetMap[id];
                    if (item) {
                        if (viewedIds.indexOf(id) > -1) {
                            Log.error('factory 控件出现嵌套循环，id：' + id);
                            continue;
                        }
                        viewedIds.push(id);
                        rs.push(item);
                    } else {
                        Log.warn('未找到图层/控件，id：' + id);
                    }
                }
            }
            return rs;
        },

        updateModelSet: function (data) {
            var layers, widgets, images;
            var sortedData = [];
            var set = [], lastInsertType;

            this.painter.drawMode('manual');
            // 排序
            if (data.list) {
                sortedData = this.getSortedData(data);
            }

            data.images = data.images || [];
            images = data.images.map(function (row) {
                // 创建 Model
                var model = new NestedModel(row);
                return model;
            }, this);
            this.store.imageModelSet.append(images);

            // 开始添加图层和控件
            if (sortedData && sortedData.length) {
                sortedData.forEach(function (row, i, arr) {
                    // 判断出是图层还是控件
                    var type = row.type === 'layer' ? 'layer' : 'widget';
                    var model;
                    
                    if (lastInsertType && lastInsertType !== type) {
                        lastInsertType === 'layer' ? this.store.layerModelSet.append(set) : this.store.widgetModelSet.append(set);
                        set = [];
                    }
                    lastInsertType = type;

                    // 创建 Model
                    model = new NestedModel(row);
                    set.push(model);

                }, this);

                lastInsertType === 'layer' ? this.store.layerModelSet.append(set) : this.store.widgetModelSet.append(set);
                set = null;
            }

            // 更新图层显示顺序
            this.painter.updateLayerOrder();
            
            this.painter.drawMode('normal');
        },
        close: function () {
            if (this.painter) {
                this.painter.close();
                this.painter = null;
            }

            if (this.painterCtn) {
                this.painterCtn.classList.remove('web-factory-container');
                this.painterCtn.innerHTML = '';
                this.painterCtn = null;
            }

            this.page = null;
            this.store = null;
            //隐藏热图设置
            this.showColorSetBtn(false);

            if (this.workerUpdate) {
                this.workerUpdate.terminate();
                this.workerUpdate = null;
            }
        }
    };

    namespace('observer.screens').PageScreen = PageScreen;
} ());