/** 
 * Canvas Painter
 */

(function () {
    var class2type = Object.prototype.toString;

    var DEFAULT_PAGE_WIDTH = 800;
    var DEFAULT_PAGE_HEIGHT = 600;

    function GPainter(screen, options) {
        this.screen = screen;
        this.domContainer = screen.painterCtn;
        
        this.domCanvas = undefined;
        this.context2d = undefined;
        this.scale = undefined;

        this.stage = undefined;
        this.staticLayer = undefined;
        this.interactiveLayer = undefined;
        this.htmlLayer = undefined;
        this.bgLayer = undefined;
        this.background = undefined;

        // 默认的页面大小
        this.pageWidth = options.pageWidth || DEFAULT_PAGE_WIDTH;
        this.pageHeight = options.pageHeight || DEFAULT_PAGE_HEIGHT;

        // Event
        this.eventHandlers = {};

        // Model
        this.store = {};
        this.store.layerModelSet = screen.store.layerModelSet;
        this.store.widgetModelSet = screen.store.widgetModelSet;

        // bind observer
        this.bindLayerModelSetOb();
        this.bindWidgetModelSetOb();

        // 当前状态数据
        this.state = new Model({
            activeLayers: [],
            activeWidgets: []
        });
        this.bindStateOb();
    }

    GPainter.prototype = {
        constructor: GPainter,
            
        init: function () {},

        show: function () {
            var styles = window.getComputedStyle(this.domContainer);
            var width = parseInt(styles.width);
            var height = parseInt(styles.height);

            // 舞台创建
            this.stage = new Konva.Stage({
                container: this.domContainer,
                width: width,
                height: height
            });

            // 静态图层创建
            this.staticLayer = new GCanvasStage(this);

            // 交互图层创建
            this.interactiveLayer = new Konva.Layer({
                id: '__interactiveLayer',
                name: '__interactiveLayer'
            });
            this.interactiveLayer.getCanvas()._canvas.style.zIndex = 4;

            // html 图层创建
            this.htmlLayer = new GHtmlStage(this);

            // bg 图层创建
            this.bgLayer = new GHtmlStage(this);
            this.bgLayer.setZIndex(1);

            // 增加一个透明的背景 Rect
            this.background = new Konva.Rect({
                id: '__background',
                name: '__background',
                x: 0,
                y: 0,
                width: width,
                height: height
            });

            this.interactiveLayer.add(this.background);
            this.stage.add(this.interactiveLayer);

            // 默认显示比例为 1
            this.scale = 1;
            this.resizePage(this.pageWidth, this.pageHeight);
            this.initMouseListeners();
            this.initKeyListeners();
        },

        setActiveLayers: function (layerIds) {
            var layers = [], idx;

            if (typeof layerIds === 'string') {
                layerIds = [layerIds];
            }

            layerIds.forEach(function (row) {
                // 先在 canvas stage 中查找
                var layer = this.staticLayer.findOne('#'+row);
                if (!!layer) {
                    return layers.push(layer);
                }

                // 再在 bg stage 中查找
                layer = this.bgLayer.findOne('#'+row);
                if (!!layer) {
                    return layers.push(layer);
                }

                // 再在 html stage 中查找
                layer = this.htmlLayer.findOne('#'+row);
                if (!!layer) {
                    return layers.push(layer);
                }
            }, this);

            this.setState({
                activeLayers: layers
            });
        },

        /**
         * [setActiveWidgets description]
         * @param {Array|String} shapes 单个控件、控件数组、单个控件id、控件id数组
         */
        setActiveWidgets: function (shapes) {
            var type, rs = [];
            shapes = shapes || [];

            // 判断是否是数组
            type = Object.prototype.toString.call(shapes);
            if (type !== '[object Array]') {
                shapes = [shapes];
            }

            // 判断是 id 数组 还是 对象数组
            type = Object.prototype.toString.call(shapes[0]);
            if (type === '[object String]') {
                shapes.forEach(function (row) {
                    var search = this.find('#'+row)[0];
                    if (search) rs.push(search);
                }, this);
            } else {
                rs = shapes;
            }

            if (this.state.activeWidgets().length ===  0 && rs.length === 0) {
                return;
            }

            this.setState({
                activeWidgets: rs
            });
        },

        setState: function (options) {
            this.state.update(options);
        },
        bindStateOb: function () {
            this.state.addEventListener('update.activeLayers', function (e) {
                Log.info('painter change activing layers');
                // 1、所有图层的所有高亮的矩形
                var activeWidgets = this.state.activeWidgets();
                // 2、从中去除掉不在选中图层中的高亮矩形
                var activeLayers = this.state.activeLayers();
                var childsArr = [] ,childrensArr = [];
                // 循环遍历 activeLayers， 将所有 activeLayers 的 children 数组拼接成一个大的数组 childrenArr
                for(var k=0,layersLen = activeLayers.length;k < layersLen;k++){
                    childrensArr = childrensArr.concat(activeLayers[k].children);
                }
                // 循环遍历 activeWidgets，判断每个 widget 是否在 childrenArr 中，存在则保留在数组 childsArr，不存在则过滤掉
                for(var j= 0,widgetsLen = activeWidgets.length;j < widgetsLen;j++){
                    if(!(childrensArr.indexOf(activeWidgets[j]) === -1)) {
                        childsArr.push(activeWidgets[j]);
                    }
                }
                // 将过滤后的 activeWidgets 通过 setActiveWidgets 方法进行设置
                this.setActiveWidgets(childsArr);
            }, this);

            this.state.addEventListener('update.activeWidgets', function (e) {
                Log.info('painter change activing widgets');
                // 先清空交互图层中的可编辑矩形
                this.interactiveLayer.find('.resizable-group').destroy();
                this.state.activeWidgets().forEach(function (row) {
                    if (row.store.model.type() === 'CanvasPipe') {
                        this.interactiveLayer.add(new GResizableLine(row, this.staticLayer));
                    } else {
                        this.interactiveLayer.add(new GResizableRect(row, this.staticLayer));
                    }
                }, this);
                this.interactiveLayer.draw();
            }, this);
        },

        // 更新图层顺序
        updateLayerOrder: function () {
            this.store.layerModelSet.forEach(function (model) {
                var layer = this.findLayer(model._id());
                if (layer === null || layer.getLayerType() !== 'canvas') {
                    return;
                }
                layer.moveToBottom();
            }, this);
            this.staticLayer.draw();
        },

        addWidget: function (model) {
            var ModalClass = null;
            var widget = null;
            var layer, layerId = model.layerId(), list;

            if ( !(ModalClass = window.widgets.factory[model.type()]) ) {
                Log.error('Class not found: ' + model.type());
                return;
            }

            layer = this.findLayer(layerId);
            if (layer === null) {
                Log.warn('one widget that has no parent layer.');
                return;
            }


            list = layer.store.model.list();
            if (list.indexOf(model._id()) === -1) list.push(model._id());
            widget = new ModalClass(layer, model);
            widget.show();
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
            var ModalClass;
            if ( !(ModalClass = window.layers[model.type()]) ) {
                Log.error('Class not found: ' + model.type());
                return;
            }

            new ModalClass(this, model).show();
        },

        removeLayer: function (model) {
            var layer;

            layer = this.findLayer(model._id());

            if (layer === null) {
                Log.error('Can\'t find the layer in page when remove the layer.');
                return;
            }

            // 从画板上删除该图层
            layer.close();
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

        resizePage: function (width, height) {
            this.pageWidth = width;
            this.pageHeight = height;

            this.scaleTo(this.scale);
        },

        initMouseListeners: function () {
            var _this = this;

            this.interactiveLayer.on('mousedown', function (e) {
                _this.mouseDownActionPerformed(e);
            });

            this.interactiveLayer.on('mousemove', function (e) {
                _this.mouseMoveActionPerformed(e);
            });

            this.interactiveLayer.on('mouseup', function (e) {
                _this.mouseUpActionPerformed(e);
            });
        },
        mouseDownActionPerformed: function () {},
        mouseMoveActionPerformed: function () {},
        mouseUpActionPerformed: function () {},

        initKeyListeners: function () {
            var _this = this;
            var isInPainter = true;

            this.domContainer.addEventListener('mouseenter', function (e) {
                isInPainter = true;
            });

            this.domContainer.addEventListener('mouseleave', function (e) {
                isInPainter = false;
            });
    
            this.eventHandlers['keydown'] = function (e) {
                if (!isInPainter) return;
                _this.keyDownActionPerformed(e);
            };
            this.eventHandlers['keyup'] = function (e) {
                if (!isInPainter) return;
                _this.keyUpActionPerformed(e);
            };

            window.addEventListener('keydown', this.eventHandlers['keydown']);
            window.addEventListener('keyup', this.eventHandlers['keyup']);
        },
        keyDownActionPerformed: function (e) {},
        keyUpActionPerformed: function (e) {},

        getTransform: function () {
            return this.staticLayer.getTransform().m;
        },

        getViewportPosition: function () {
            var w = this.stage.width();
            var h = this.stage.height();
            var vw = this.pageWidth * this.scale;
            var vh = this.pageHeight * this.scale;

            return {
                x: (w-vw)/2,
                y: (h-vh)/2
            }
        },

        getOffset: function () {
            var ox = this.staticLayer.offsetX();
            var oy = this.staticLayer.offsetY();

            return {
                x: ox*this.scale,
                y: oy*this.scale
            }
        },

        getGridWidth: function () {
            return 10;
        },

        transform: function () {
            var offset = this.getOffset();
            var scale = this.scale;
            var x, y, w, h, rs = {};
            var abPos;

            if (arguments.length === 4) {
                x = arguments[0];
                y = arguments[1];
                w = arguments[2];
                h = arguments[3];

                return {
                    x: (x + offset.x)/scale,
                    y: (y + offset.y)/scale,
                    w: w/scale,
                    h: h/scale
                }
            } else if ( class2type.call(arguments[0].x) !== '[object Function]' ) {
                if (arguments[0].x !== undefined) rs.x = (arguments[0].x + offset.x)/scale;
                if (arguments[0].y !== undefined) rs.y = (arguments[0].y + offset.y)/scale;
                if (arguments[0].w !== undefined) rs.w = arguments[0].w/scale;
                if (arguments[0].h !== undefined) rs.h = arguments[0].h/scale;

                return rs;
            } else {
                abPos = arguments[0].getAbsolutePosition();
                x = abPos.x;
                y = abPos.y;
                w = arguments[0].width();
                h = arguments[0].height();

                return {
                    x: (x + offset.x)/scale,
                    y: (y + offset.y)/scale,
                    w: w/scale,
                    h: h/scale
                }
            }
        },

        inverseTransform: function () {
            var offset = this.getOffset();
            var scale = this.scale;
            var rs = {};

            if (arguments[0].x !== undefined) rs.x = arguments[0].x * scale - offset.x;
            if (arguments[0].y !== undefined) rs.y = arguments[0].y * scale - offset.y;
            if (arguments[0].w !== undefined) rs.w = arguments[0].w*scale;
            if (arguments[0].h !== undefined) rs.h = arguments[0].h*scale;

            return rs;
        },

        scaleTo: function (scale) {
            var offset;

            this.scale = scale;

            // 调整比例
            this.staticLayer.scale({
                x: scale,
                y: scale
            });

            offset = this.getViewportPosition();
            this.staticLayer.offsetX(-offset.x/scale);
            this.staticLayer.offsetY(-offset.y/scale);

            this.staticLayer.draw();

            // 处理 html layer 的缩放
            this.htmlLayer.scale(scale);

            // 处理 bg layer 的缩放
            this.bgLayer.scale(scale);
        },

        getAllLayers: function () {
            return this.staticLayer.getChildren()
                .concat(this.htmlLayer.getChildren())
                .concat(this.bgLayer.getChildren());
        },

        // 在图层中查找指定的图形
        find: function (selector) {
            var type = selector[0];
            var layers = this.getAllLayers();
            var rs = [];

            layers.forEach(function (layer) {
                var search = layer.find(selector);

                if (!search || !search.length) {
                    return;
                }
                rs = rs.concat(search);
            });

            return rs;
        },

        // 根据 layer id 查找 layer
        findLayer: function (layerId) {
            var selector = '#' + layerId;
            // 在 canvas layer 中查找
            var layer = this.staticLayer.findOne(selector);
            if (!!layer) {
                return layer;
            }

            // 在 html layer 中查找
            layer = this.htmlLayer.findOne(selector);
            if (!!layer) {
                return layer;
            }

            // 在 bg layer 中查找
            layer = this.bgLayer.findOne(selector);
            if (!!layer) {
                return layer;
            }

            return null;
        },

        draw: function () {
            this.staticLayer.draw();
            this.htmlLayer.draw();
            this.bgLayer.draw();
        },

        close: function () {
            // 由于 keydown 和 keyup 事件不会随着 DOM 删除而删除，所以这里手动删除
            window.removeEventListener('keydown', this.eventHandlers['keydown']);
            window.removeEventListener('keyup', this.eventHandlers['keyup']);

            /** 删除所有舞台 */
            this.htmlLayer.close();
            this.bgLayer.close();
            this.staticLayer.close();

            // Konva 对象的销毁和普通的不一样，有所区别
            this.stage.destroy();
            this.interactiveLayer.destroy();
        }
    };

    window.GPainter = GPainter;

} ());