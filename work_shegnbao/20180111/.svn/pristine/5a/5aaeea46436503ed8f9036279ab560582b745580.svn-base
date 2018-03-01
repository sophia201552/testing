/** 简化版的 painter，不可修改，不包含交互 */
(function () {

    var class2type = Object.prototype.toString;

    var DEFAULT_PAGE_WIDTH = 800;
    var DEFAULT_PAGE_HEIGHT = 600;

    var dpr = window.devicePixelRatio;

    var carouselTimer = null, carouselDelayTimer = null, carouselIdx, carouselEnabled = true;

    function GReadonlyPainter(screen, options) {
        this.screen = screen;
        this.domContainer = screen.painterCtn;
        
        this.domCanvas = undefined;
        this.context2d = undefined;
        this.scaleX = undefined;
        this.scaleY = undefined;

        this.stage = undefined;
        this.canvasStage = undefined;
        this.interactiveLayer = undefined;
        this.htmlStage = undefined;
        this.noScaledHtmlStage = undefined;
        this.bgStage = undefined;
        this.rootLayer = undefined;

        this.options = options;
        this.pageWidth = options.pageWidth || DEFAULT_PAGE_WIDTH;
        this.pageHeight = options.pageHeight || DEFAULT_PAGE_HEIGHT;

        // Model
        this.store = {};
        this.store.layerModelSet = screen.store.layerModelSet;
        this.store.widgetModelSet = screen.store.widgetModelSet;
        this.store.pageModel = new Model({
            id: this.screen.page.id,
            isHide: 0,
            isLock: 0,
            list: this.screen.page.layerList
        });

        // bind observer
        this.bindLayerModelSetOb();
        this.bindWidgetModelSetOb();

        this._drawMode = 'normal';

        // 遮罩图形
        this._maskShape = undefined;
        // 自动播放的存储对象
        this._carousel = [];
    }

    GReadonlyPainter.prototype = {
        constructor: GReadonlyPainter,

        init: function () {},

        show: function () {
            var styles = window.getComputedStyle(this.domContainer);
            var width = parseInt(styles.width);
            var height = parseInt(styles.height);
            var GLayer = namespace('layers.GLayer');

            // 舞台创建
            this.stage = new Konva.Stage({
                container: this.domContainer,
                width: width,
                height: height,
                draggable: false
            });

            // 根图层创建
            this.rootLayer = new GLayer(this, null, this.store.pageModel);

            // 静态图层创建
            this.canvasStage = new GCanvasStage(this);

            // html 图层创建
            this.htmlStage = new GHtmlStage(this);

            // html 图层（无需缩放）创建
            this.noScaledHtmlStage = new GHtmlStage(this);
            this.noScaledHtmlStage.setZIndex('');

            // bg 图层创建
            this.bgStage = new GHtmlStage(this);
            this.bgStage.setZIndex(1);
            this.bgStage.setBackground(
                this.screen.page.option ? this.screen.page.option.background : null
            );
            
            // 默认显示比例为 1
            this.scaleX = this.scaleY = 1;
            this.resizePage(width, height);

            this.initOnResize();
        },

        /**
         * 获取/设置画布的绘制频率
         * @param {string} mode 有三种
         *     normal - 正常的绘制频率，默认为此模式
         *     batch - 隔 500ms 的时间进行一次绘制
         *     manual - 设置为该模式后，在下一次切换回 normal 或 batch 之前，将不会进行任何绘制
         */
        drawMode: function (mode) {
            var lastMode = this._drawMode;

            if (typeof mode === 'undefined') {
                return lastMode;
            }

            mode = mode || 'normal';
            this._drawMode = mode;

            if (mode !== 'manual' && lastMode === 'manual') {
                // 从 manual 模式中退出时，自动触发一次绘制
                this.getCanvasLayer().draw();
            }
        },

        // 页面（包括所有控件）加载完成时的回调
        onLoad: function () {
            var _this = this;

            if (this._carousel && this._carousel.length) {
                this.stage.on('contentMousemove', function (e) {
                    if (carouselDelayTimer) {
                        window.clearTimeout(carouselDelayTimer);
                        carouselDelayTimer = null;
                    }
                    if (carouselTimer) {
                        window.clearTimeout(carouselTimer);
                        carouselTimer = null;
                        if (typeof carouselIdx !== 'undefined') {
                            _this._carousel[carouselIdx].playDown();
                        }
                    }
                    carouselDelayTimer = window.setTimeout(function(){
                        // 开始进行自动播放
                        _this.carousel();
                    }, _this.options.carouselDelay || 5000);
                });
                // 首次触发一次
                this.stage.fire('contentMousemove');
            }
        },

        // 加载数据完成时的回调
        onUpdated: function () {},

        // 自动播放
        carousel: function (idx) {
            var _this = this;
            var len = this._carousel.length;
            var lastIdx;

            if (typeof idx === 'undefined') {
                idx = 0;
            } else {
                lastIdx = (idx + len -1) % len;
            }

            if (typeof lastIdx !== 'undefined') {
                this._carousel[lastIdx].playDown();
            }
            this._carousel[idx].playUp();
            carouselIdx = idx;

            carouselTimer = window.setTimeout(function () {
                _this.carousel( (idx + 1) % len );
            }, this.options.carouselInterval || 5000);
        },

        addWidget: function (model) {
            var ModalClass = null;
            var widget = null;
            var layerId = model.layerId(), parent;
            var group, groupId = typeof model.groupId === 'function' ? model.groupId() : null;
            var layer = this.getParentByWidgetType(model.type(), model);
            
            if ( !(ModalClass = namespace('widgets.factory')[model.type()]) ) {
                Log.error('Class not found: ' + model.type());
                return;
            }

            // layerId 为空或不存在，则添加到根图层上
            if (!layerId) {
                parent = this.getRootLayer();
            } else {
                parent = this.find('#' + layerId)[0];
                if (!parent) {
                    Log.warn('one widget that has no parent layer.');
                    return;
                }
            }

            var isS = true;//是否预览
            // 如果存在组 id，则将其加入到其组中
            if (groupId) {
                group = this.find('#'+groupId)[0];
                if (!group) {
                    Log.warn('widget group not found!');
                    return;
                }
                group.add(model);
            }

            widget = new ModalClass(parent, layer, model);
            // 渲染控件
            widget.show(isS);
        },

        removeWidget: function (model) {
            var widget;

            widget = this.find('#'+model._id());

            if (widget.length === 0) {
                Log.error('Can\'t find the widget in page when remove the widget.');
                return;
            }

            // 从画板中删除该元素
            widget[0].close();
        },

        addLayer: function (model) {
            var ModalClass = namespace('layers.GLayer');
            var parentId = model.parentId();
            var parent;

            // 不存在 parentId，说明是在根目录
            if (!parentId) {
                parent = this.getRootLayer();
            } else {
                parent = this.find('#' + parentId)[0];
                if (!parent) {
                    Log.warn('one widget that has no parent layer.');
                    return;
                }
            }

            new ModalClass(this, parent, model).show();
        },

        removeLayer: function (model) {
            var layer;

            layer = this.find('#' + model._id())[0];
            if (!layer) {
                Log.error('Can\'t find the layer in page when remove the layer.');
                return;
            }

            // 从画板上删除该图层
            layer.close();
        },

        // 更新图层顺序
        updateLayerOrder: function () {
            var layerList = this.store.pageModel.list().slice();
            var widgets = this.find('*');
            var map = {};
            var item, id;
            var zIndex = 11, idx;

            // 更新图层层叠顺序
            this.getRootLayer().displayLayer(true);

            // 转换成 map
            widgets.forEach(function (row) {
                var model = row.store.model;
                map[model._id()] = row;
            });

            while (id = layerList.pop()) {
                item = map[id];
                if (!item) {
                    continue;
                }
                if (item.getType() === 'Layer') {
                    layerList = layerList.concat(item.store.model.list());
                } else {
                    idx = item.setZIndex(zIndex++);
                    if (typeof idx === 'number') {
                        zIndex = idx + 1;
                    }
                }
            }
            this.getCanvasLayer().draw();
        },

        bindWidgetModelSetOb: function () {
            this.store.widgetModelSet.addEventListener('insert', function (e, data) {
                data.models.forEach(function (model) {
                    this.addWidget(model);
                }, this);
                this.stage.draw();
                Log.info('insert {count} widget(s) at index {index}'.formatEL(data));
            }, this);

            this.store.widgetModelSet.addEventListener('remove', function (e, data) {
                data.models.forEach(function (model) {
                    this.removeWidget(model);
                }, this);
                this.stage.draw();

                Log.info('remove {count} widget(s)'.formatEL(data));
            }, this);
        },

        bindLayerModelSetOb: function () {
            this.store.layerModelSet.addEventListener('insert', function (e, data) {
                data.models.forEach(function (model) {
                    this.addLayer(model);
                }, this);
                this.stage.draw();

                Log.info('insert {count} layer(s) at index {index}'.formatEL(data));
            }, this);
            this.store.layerModelSet.addEventListener('remove', function (e, data) {
                data.models.forEach(function (model) {
                    this.removeLayer(model);
                }, this);
                this.stage.draw();

                Log.info('remove {count} layer(s)'.formatEL(data));
            }, this);
        },

        initOnResize: function () {
            var _this = this;

            window.onresize = function (e) {
                var styles = window.getComputedStyle(_this.domContainer);
                var width = parseInt(styles.width);
                var height = parseInt(styles.height);

                _this.resizePage(width, height);
                
                _this.fixZoom();
            };
        },

        resizePage: function (width, height) {
            width = parseFloat(width);
            height = parseFloat(height);
            this.stage.width(width);
            this.stage.height(height);

            if(this.options.display === 0){
                this.scaleTo(width/this.pageWidth, height/this.pageHeight);
            }else {
                this.scaleTo(1,1);
            }
        },

        getViewportPosition: function () {
            var w = this.stage.width();
            var h = this.stage.height();
            var vw = this.pageWidth * this.scaleX;
            var vh = this.pageHeight * this.scaleY;

            if (this.options.display === 0) {
                return {
                    x: 0,
                    y: 0
                };
            }

            return {
                x: (w-vw)/2,
                y: (h-vh)/2
            }
        },

        getStage: function () {
            return this.stage;
        },

        getPage: function () {
            return this.screen;
        },

        getPageSize: function () {
            return {
                w: this.pageWidth,
                h: this.pageHeight
            };
        },

        getAllLayers: function () {
            return this.getRootLayer().getLayers('*');
        },

        getAllWidgets: function () {
            return this.getRootLayer().getWidgets('*');
        },

        getRootLayer: function () {
            return this.rootLayer;
        },

        getCanvasLayer: function () {
            return this.canvasStage;
        },

        getHtmlLayer: function () {
            return this.htmlStage;
        },

        getBgLayer: function () {
            return this.bgStage;
        },

        getNoScaledHtmlLayer: function () {
            return this.noScaledHtmlStage;
        },

        // 获取图层的状态信息
        getLayerStatus: function () {
            var map = {};
            // 只取根目录下的图层
            var layers = this.getRootLayer().getLayers(false);

            layers.forEach(function (row) {
                map[row.store.model._id()] = 1 - row.store.model.isHide();
            });

            return map;
        },

        displayLayerByStatusMap: function (statusMap) {
            var layers = this.findByCondition({
                ids: Object.keys(statusMap),
                type: 'Layer'
            });

            layers.forEach(function (layer) {
                var model = layer.store.model;
                model.isHide(1 - statusMap[model._id()]);
            });
        },

        getScale: function () {
            return {
                x: this.scaleX,
                y: this.scaleY
            };
        },

        // 根据控件的类型，判断控件所属的图层
        getParentByWidgetType: function (widgetType, model) {
            switch(widgetType) {
                case 'HtmlText':
                case 'HtmlButton':
                case 'HtmlScreenContainer':
                case 'HtmlDashboard':
                case 'HtmlContainer':
                    if (!model['option.display'] || model['option.display']() === 0) {
                        return this.getHtmlLayer();
                    } else {
                        return this.getNoScaledHtmlLayer();
                    }
                default:
                    return this.getCanvasLayer();
            }
        },

        // 根据子图层的类型，判断子图层所属的根图层
        getParentByLayerType: function (layerType) {
            switch(layerType) {
                case 'canvas':
                    return this.getCanvasLayer();
                default:
                    return this.getHtmlLayer();
            }
        },

        getMaskShape: function () {
            if (this._maskShape) {
                return this._maskShape;
            }

            this._maskShape = new Konva.Rect({
                width: this.pageWidth,
                height: this.pageHeight,
                fill: '#000',
                opacity: 0,
                visible: false,
                perfectDrawEnabled: false
            });
            this.getCanvasLayer().add(this._maskShape);

            return this._maskShape;
        },

        // 在图层中查找指定的图形
        find: function (selector) {
            return this.getRootLayer().find(selector);
        },

        findByCondition: function (cond) {
            return this.getRootLayer().findByCondition(cond);
        },

        scaleTo: function (scaleX, scaleY) {
            var offset;

            this.scaleX = scaleX;
            this.scaleY = scaleY;

            offset = this.getViewportPosition();
            this.canvasStage.offsetX(-offset.x/scaleX);
            this.canvasStage.offsetY(-offset.y/scaleY);
            this.canvasStage.scale({
                x: scaleX,
                y: scaleY
            });

            this.canvasStage.draw();

            // 处理 html layer 的缩放
            this.htmlStage.scale(scaleX, scaleY);

            // 处理内容不缩放的 html layer 的缩放
            this.noScaledHtmlStage.scaleBound(scaleX, scaleY);

            // 处理 html layer 的缩放
            this.bgStage.scale(scaleX, scaleY);
        },

        fixZoom: function () {
            // 如果修改了浏览器的缩放比例，这里需要修复一下 chrome 浏览器
            // 字体最小只能缩放到 12px 的问题
            if (dpr < 1 && window.devicePixelRatio !== dpr) {
                dpr = window.devicePixelRatio;
                this.htmlStage.fixZoom();
            }
        },

        _registerCarousel: function (data) {
            this._carousel.push(data);
        },

        draw: function () {
            this.canvasStage.draw();
            this.htmlStage.draw();
            this.bgStage.draw();
        },

        close: function () {
            window.onresize = null;

            // 销毁“自动播放”延时定时器
            if (carouselDelayTimer) {
                window.clearTimeout(carouselDelayTimer);
                carouselDelayTimer = null;
            }
            // 销毁“自动播放”定时器
            if (carouselTimer) {
                window.clearTimeout(carouselTimer);
                carouselTimer = null;
            }

            /** 删除所有图层和控件 */
            this.rootLayer.close();

            /** 删除所有舞台 */
            this.htmlStage.close();
            this.bgStage.close();
            this.canvasStage.close();

            // Konva 对象的销毁和普通的不一样，有所区别
            this.stage.destroy();

            /** 将所有变量引用置为 null */
            this.store = null;

            /** 删除DOM */
            this.domContainer.innerHTML = '';
        }
    };

    window.GReadonlyPainter = GReadonlyPainter;

} ());