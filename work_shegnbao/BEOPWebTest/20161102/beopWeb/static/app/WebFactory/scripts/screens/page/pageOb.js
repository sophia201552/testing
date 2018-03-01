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
            var $checkPreviewPattern = $('#checkPreviewPattern');
            
            var v = localStorage.getItem('preview');
            var text = (v === '1' ? 'Debug' : 'Real')+'<span class="caret"></span>';
            $('.dropdown-toggle', $checkPreviewPattern).html(text);
            this.preview = (v === '1' ? '1' : '0');

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
                window.location.reload();
            })
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
            var viewedLayerIds = [], viewedWidgetIds = [];
            var id, item;
            var rs = {
                layers: [],
                widgets: []
            };

            while(id = stack.pop()) {
                item = layerMap[id];
                // 若是图层
                if (item) {
                    if (viewedLayerIds.indexOf(id) > -1) {
                        Log.error('factory 图层出现嵌套循环，id：' + id);
                        continue;
                    }
                    viewedLayerIds.push(id);
                    stack = item['list'].concat(stack);
                    rs.layers.push(item);
                }
                // 若是控件
                else {
                    item = widgetMap[id];
                    if (item) {
                        if (viewedWidgetIds.indexOf(id) > -1) {
                            Log.error('factory 控件出现嵌套循环，id：' + id);
                            continue;
                        }
                        viewedWidgetIds.push(id);
                        rs.widgets.push(item);
                    } else {
                        Log.warn('未找到控件，id：' + id);
                    }
                }
            }

            return rs;
        },

        updateModelSet: function (data) {
            var layers, widgets, images;
            var sortedData;

            this.painter.drawMode('manual');
            // 排序
            if (data.list) {
                sortedData = this.getSortedData(data);
                data.layers = sortedData.layers;
                data.widgets = sortedData.widgets;
            }

            layers = data.layers.map(function (row) {
                // 创建 Model
                var model = new NestedModel(row);
                return model;
            }, this);

            widgets = data.widgets.map(function (row) {
                // 创建 Model
                var model = new NestedModel(row);
                return model;
            }, this);

            data.images = data.images || [];
            images = data.images.map(function (row) {
                // 创建 Model
                var model = new NestedModel(row);
                return model;
            }, this);

            this.store.imageModelSet.append(images);
            this.store.layerModelSet.append(layers);
            this.store.widgetModelSet.append(widgets);

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