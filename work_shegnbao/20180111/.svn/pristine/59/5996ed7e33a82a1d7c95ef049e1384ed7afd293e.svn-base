/** 
 * Canvas Painter
 */

;
(function(exports) {
    var class2type = Object.prototype.toString;

    var DEFAULT_PAGE_WIDTH = 800;
    var DEFAULT_PAGE_HEIGHT = 600;

    var dpr = window.devicePixelRatio;

    function GPainter(screen, options) {
        this.screen = screen;
        this.domContainer = screen.painterCtn;

        this.domCanvas = undefined;
        this.context2d = undefined;
        this.scale = undefined;
        this.offset = { x: 0, y: 0 };
        this.viewportPosition = undefined;

        this.stage = undefined;
        this.canvasStage = undefined;
        this.interactiveLayer = undefined;
        this.htmlStage = undefined;
        this.htmlLayer = undefined;
        this.bgStage = undefined;
        this.background = undefined;
        this.rootLayer = undefined;

        // 是否是场景模式
        this.isSceneMode = false;
        this.sceneModeStore = null;

        // 默认的页面大小
        this.pageWidth = options.pageWidth || DEFAULT_PAGE_WIDTH;
        this.pageHeight = options.pageHeight || DEFAULT_PAGE_HEIGHT;

        // Event
        this.eventHandlers = {};

        // element map
        this.elementMap = [];

        // Model
        this.store = {};
        this.store.layerModelSet = screen.store.layerModelSet;
        this.store.widgetModelSet = screen.store.widgetModelSet;
        this.store.pageModel = new Model({
            _id: this.screen.page.id,
            isHide: 0,
            isLock: 0,
            list: this.screen.page.layerList,
            variables: typeof this.screen.page.option === 'undefined' ? {} : this.screen.page.option.variables
        });

        // bind observer
        this.bindLayerModelSetOb();
        this.bindWidgetModelSetOb();

        // 当前状态数据
        this.state = new Model({
            activeLayers: [],
            activeWidgets: []
        });

        this.bindStateOb();
        this.bindPageModelOb();

        //退出场景时获取到的一些信息
        this.arr = [];

        // 网格间距
        this.gridWidth = 1;

        //图层缩放后的偏移量
        this.zoomScaleX = 0;
        this.zoomScaleY = 0;

        this._drawMode = 'normal';
    }

    GPainter.prototype = {
        constructor: GPainter,

        init: function() {},

        show: function() {
            var styles = window.getComputedStyle(this.domContainer);
            var width = parseInt(styles.width);
            var height = parseInt(styles.height);
            var GLayer = namespace('layers.GLayer');

            // 舞台创建
            this.stage = new Konva.Stage({
                container: this.domContainer,
                width: width,
                height: height
            });

            // 根图层创建
            this.rootLayer = new GLayer(this, null, this.store.pageModel);

            // 静态图层创建
            this.canvasStage = new GCanvasStage(this);

            // 交互图层创建
            this.interactiveLayer = new Konva.Layer({
                id: '__interactiveLayer',
                name: '__interactiveLayer',
                x: 0,
                y: 0
            });
            this.interactiveLayer.getCanvas()._canvas.style.zIndex = 4;

            // html 图层创建
            this.htmlStage = new GHtmlStage(this);

            // bg 图层创建
            this.bgStage = new GHtmlStage(this);
            this.bgStage.setZIndex(1);
            this.bgStage.setBackground(
                this.screen.page.option ? this.screen.page.option.background : null
            );

            this.stage.add(this.interactiveLayer);

            // 默认显示比例为 1
            this.fitView(this.pageWidth, this.pageHeight, width, height);

            this.initMouseListeners();
            this.initKeyListeners();
        },

        // 页面加载完成回调
        onLoad: function() {},

        /**
         * 获取/设置画布的绘制频率
         * @param {string} mode 有三种
         *     normal - 正常的绘制频率，默认为此模式
         *     batch - 隔 500ms 的时间进行一次绘制
         *     manual - 设置为该模式后，在下一次切换回 normal 或 batch 之前，将不会进行任何绘制
         */
        drawMode: function(mode) {
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

        batchDraw: function(fn) {
            var lastMode = this._drawMode;
            this.drawMode('manual');
            fn();
            this.drawMode(lastMode);
        },

        /**
         * 设置活动图层
         * @param {Array|String} layerIds 单个图层id或图层id数组
         */
        setActiveLayers: function(layerIds) {
            var layers = [],
                idx;
            layerIds = layerIds || [];

            if (typeof layerIds === 'string') {
                layerIds = [layerIds];
            }

            if (this.state.activeLayers().length === 0 && layerIds.length === 0) {
                return;
            }

            layers = this.findByCondition({
                ids: layerIds,
                type: 'Layer'
            });

            this.setState({
                activeLayers: layers
            });
        },

        /**
         * 设置活动控件
         * @param {Array|String} shapes 单个控件、控件数组、单个控件id、控件id数组
         */
        setActiveWidgets: function(shapes) {
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
                rs = this.findByCondition({
                    ids: shapes,
                    type: 'Widget'
                });
            } else {
                rs = shapes;
            }

            if (this.state.activeWidgets().length === 0 && rs.length === 0) {
                return;
            }

            this.setState({
                activeWidgets: rs
            });
        },

        getLayerId: function() {
            var widgets = this.state.activeWidgets(),
                layers = this.state.activeLayers(),
                widgetsLength = widgets.length,
                layersLength = layers.length;
            var layerId = '';
            if (layersLength == 1 && widgetsLength == 0) {
                layerId = layers[0].store.model._id();
            } else if (layersLength == 0 && widgetsLength == 1) {
                layerId = widgets[0].store.model.layerId();
            }
            return layerId;
        },

        setState: function(options) {
            this.state.update(options);
        },

        bindPageModelOb: function() {
            var _this = this;

            // layerList 属性变化监控
            this.store.pageModel.addEventListener('update.list', function(e) {
                Log.info('page list changed.');
                // 更新外部 page
                _this.screen.page.layerList = _this.store.pageModel.list();

                _this.updateLayerOrder();
            });

            this.store.pageModel.addEventListener('nodeMove', function(e, models) {
                this.screen.historyController.addRecord('layer', { name: i18n_resource.mainPanel.historyPanel.NODE_MOVE });
            }, this);
        },

        // 绑定当前图层选中状态的数据
        bindStateOb: function() {
            /*
            this.state.addEventListener('update.activeLayers', function (e) {
                Log.info('painter change activing layers');
            }, this);*/

            this.state.addEventListener('update.activeWidgets', function(e) {
                Log.info('painter change activing widgets');
                // 先清空交互图层中的可编辑矩形
                this.interactiveLayer.find('.resizable-group').destroy();
                this.state.activeWidgets().forEach(function(row) {
                    if (row.store.model.type() === 'CanvasPipe' || row.store.model.type() === 'CanvasCustomLine') {
                        this.interactiveLayer.add(new GResizableLine(row, this.canvasStage));
                    } else if (row.store.model.type() === 'CanvasHeat' || row.store.model.type() === 'CanvasPolygon') {
                        this.interactiveLayer.add(new GResizablePolygon(row, this.canvasStage));
                    } else {
                        this.interactiveLayer.add(new GResizableRect(row, this.canvasStage));
                    }
                }, this);
                this.interactiveLayer.draw();
            }, this);
        },

        // 更新图层顺序
        updateLayerOrder: function() {
            var layerList = this.store.pageModel.list().slice();
            var widgets = this.find('*');
            var map = {};
            var item, id;
            var zIndex = 1,
                idx;

            // 更新图层层叠顺序
            this.getRootLayer().displayLayer(true);

            // 转换成 map
            widgets.forEach(function(row) {
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
        //图层移动
        moveLayer: function(offsetX, offsetY, isScale) {
            var canvasLayer = this.canvasStage;
            var htmlLayer = this.htmlStage;
            var bgLayer = this.bgStage;
            var scale = this.scale;
            var tempX, tempY;
            this.offset.x += offsetX / scale;
            this.offset.y += offsetY / scale;
            //继续拖拽后的alt缩放
            this.zoomScaleX -= offsetX / scale;
            this.zoomScaleY -= offsetY / scale;
            //判断有无缩放
            if (isScale) {
                tempX = -this.zoomScaleX * scale;
                tempY = -this.zoomScaleY * scale;
            } else {
                tempX = offsetX;
                tempY = offsetY;
            }
            // canvas 图层的移动
            // 对于变化的部分，canvas 图层也会进行缩放处理，而 html 图层不会
            // 所以这里 canvas 图层需要对变化的部分进行反缩放处理，而 html 图层不用
            canvasLayer.offsetX(canvasLayer.offsetX() - tempX / scale);
            canvasLayer.offsetY(canvasLayer.offsetY() - tempY / scale);
            canvasLayer.draw();
            // html 图层的移动
            htmlLayer.position({
                x: htmlLayer.x() + tempX,
                y: htmlLayer.y() + tempY
            });

            //背景 图层的移动
            bgLayer.position({
                x: bgLayer.x() + tempX,
                y: bgLayer.y() + tempY
            });

            this.interactiveLayer.offset({ x: -this.viewportPosition.x / this.scale - this.offset.x, y: -this.viewportPosition.y / this.scale - this.offset.y })
        },
        //图层偏移复原
        offsetRestore: function() {
            this.zoomScaleX = 0;
            this.zoomScaleY = 0;
            this.offset.x = 0;
            this.offset.y = 0;
        },
        // 新增一个控件
        addWidget: function(model) {
            var ModalClass = null;
            var widget = null;
            var layerId = model.layerId(),
                list, parent;
            var group, groupId = typeof model.groupId === 'function' ? model.groupId() : null;
            var layer = this.getParentByWidgetType(model.type());

            // 新的数据结构，所有的 widget 都应该具有 pageId 这个属性
            // 如果没有，则在这里统一加上
            if (!model.pageId) {
                model.property('pageId', this.store.pageModel._id());
            }

            if (!(ModalClass = namespace('widgets.factory')[model.type()])) {
                Log.error('Class not found: ' + model.type());
                return;
            }

            // layerId 为空或不存在，则添加到根图层上
            if (!layerId) {
                parent = this.getRootLayer();
            } else {
                parent = this.find('#' + layerId)[0];
                if (!parent) {
                    Log.warn('one widget that has no parent layer, id: ' + model._id());
                    return;
                }
            }

            // 如果存在组 id，则将其加入到其组中
            if (groupId) {
                group = this.find('#' + groupId)[0];
                if (!group) {
                    Log.warn('widget group not found!');
                    return;
                }
                group.add(model);
            }

            widget = new ModalClass(parent, layer, model);
            // 渲染控件
            widget.show();

            // 加入到控件集合中
            this.elementMap[model._id()] = widget;
            // 处理父元素的 list 字段
            list = parent.store.model.list();
            if (list.indexOf(model._id()) === -1) {
                list.unshift(model._id());
                parent.store.model.list(list.slice());
            }
        },
        // 删除一个控件
        removeWidget: function(model) {
            var widget, list, idx;
            var parent;

            widget = this.find('#' + model._id())[0];

            if (!widget) {
                Log.error('Can\'t find the widget in page when remove the widget.');
                return;
            }

            // 从画板中删除该元素
            widget.close();

            // 从被包含图层中删除该 widget 的 id
            parent = widget.parent;
            list = parent.store.model.list();
            if ((idx = list.indexOf(model._id())) > -1) {
                list.splice(idx, 1);
                parent.store.model.list(list.slice());
            }

            // 从控件集合中删除
            if (!delete this.elementMap[widget.store.model._id()]) {
                Log.warn('Not found deleted widget in this.elementMap.');
            }
        },

        addLayer: function(model) {
            var ModalClass = namespace('layers.GLayer');
            var parentId = model.parentId();
            var parent, list;
            var layer;

            // 新的数据结构，所有的 layer 都应该具有 pageId 这个属性
            // 如果没有，则在这里统一加上
            if (!model.pageId) {
                model.property('pageId', this.store.pageModel._id());
            }

            // 不存在 parentId，说明是在根目录
            if (!parentId) {
                parent = this.getRootLayer();
            } else {
                parent = this.find('#' + parentId)[0];
                if (!parent) {
                    Log.warn('one layer that has no parent layer, id: ' + model._id());
                    return;
                }
            }

            layer = new ModalClass(this, parent, model);
            layer.show();

            // 添加到图层集合
            this.elementMap[model._id()] = layer;
            // 将 id 加入到父 layer 的 list 字段中
            // 处理父元素的 list 字段
            list = parent.store.model.list();
            if (list.indexOf(model._id()) === -1) {
                list.unshift(model._id());
                parent.store.model.list(list.slice());
            }

        },

        removeLayer: function(model) {
            var layer, parent, list;

            layer = this.find('#' + model._id())[0];
            if (!layer) {
                Log.error('Can\'t find the layer in page when remove the layer.');
                return;
            }

            // 从画板上删除该图层
            layer.close();

            parent = layer.parent;
            list = parent.store.model.list();
            if ((idx = list.indexOf(model._id())) > -1) {
                list.splice(idx, 1);
                parent.store.model.list(list.slice());
            }

            // 从图层集合中删除
            if (!delete this.elementMap[layer.store.model._id()]) {
                Log.warn('Not found deleted layer in this.elementMap.');
            }
        },

        bindWidgetModelSetOb: function() {
            this.store.widgetModelSet.addEventListener('insert', function(e, data) {
                data.models.forEach(function(model) {
                    this.addWidget(model);
                }, this);
                this.stage.draw();

                Log.info('insert {count} widget(s) at index {index}'.formatEL(data));
            }, this);

            this.store.widgetModelSet.addEventListener('remove', function(e, data) {
                data.models.forEach(function(model) {
                    this.removeWidget(model);
                }, this);
                this.draw();

                Log.info('remove {count} widget(s)'.formatEL(data));
            }, this);
        },

        bindLayerModelSetOb: function() {
            // 处理图层新建
            this.store.layerModelSet.addEventListener('insert', function(e, data) {
                data.models.forEach(function(model) {
                    this.addLayer(model);
                }, this);
                this.stage.draw();

                Log.info('insert {count} layer(s) at index {index}'.formatEL(data));
            }, this);

            // 处理图层删除
            this.store.layerModelSet.addEventListener('remove', function(e, data) {
                for (var i = data.models.length - 1; i > -1; i--) {
                    this.removeLayer(data.models[i]);
                }
                this.stage.draw();

                Log.info('remove {count} layer(s)'.formatEL(data));
            }, this);

            // 处理图层移动
        },

        // 让画布适应到可视区域的中间
        fitView: function(pageWidth, pageHeight, width, height) {
            // 定义画布和可视区域边界的间隙大小
            var space = 20;

            // 如果页面的宽度和高度分别都小于视图区域的宽度和高度
            // 则不需要进行缩放
            if (pageWidth < width && pageHeight < height) {
                this.scale = 1;
            }
            // 否则，则需要进行缩放
            // 判断是 宽度主导 还是 高度主导
            // 宽度主导
            else if (pageWidth >= pageHeight) {
                this.scale = width / (pageWidth + space * 2);
            }
            // 高度主导
            else {
                this.scale = height / (pageHeight + space * 2);
            }

            this.resizePage(pageWidth, pageHeight);
        },

        resizePage: function(width, height) {
            this.pageWidth = width;
            this.pageHeight = height;

            this.scaleTo(this.scale);
        },

        initMouseListeners: function() {
            var _this = this;
            var timer = null;
            var mUpX, mUpY;

            this.stage.on('contentMousedown', function(e) {
                var evt = e.evt;
                // 添加转换后的坐标
                evt.transformedX = (evt.layerX - _this.viewportPosition.x - _this.offset.x * _this.scale) / _this.scale;
                evt.transformedY = (evt.layerY - _this.viewportPosition.y - _this.offset.y * _this.scale) / _this.scale;

                // 鼠标左键
                if (evt.button === 0) {
                    _this.mouseDownActionPerformed(e);
                }
                // 鼠标滚轮
                else if (evt.button === 1) {
                    _this.mouseWheelDownActionPerformed(e);
                }
                // 鼠标右键
                else if (evt.button === 2) {
                    _this.mouseRightDownActionPerformed(e);
                }
            });

            this.stage.on('contentMousemove', function(e) {
                var evt = e.evt;
                // 添加转换后的坐标
                evt.transformedX = (evt.layerX - _this.viewportPosition.x - _this.offset.x * _this.scale) / _this.scale;
                evt.transformedY = (evt.layerY - _this.viewportPosition.y - _this.offset.y * _this.scale) / _this.scale;

                // 鼠标左键
                if (evt.button === 0) {
                    _this.mouseMoveActionPerformed(e);
                }
                // 鼠标滚轮
                else if (evt.button === 1) {
                    _this.mouseWheelMoveActionPerformed(e);
                }
                // 鼠标右键
                else if (evt.button === 2) {
                    _this.mouseRightMoveActionPerformed(e);
                }
            });

            this.stage.on('contentMouseup', function(e) {
                var evt = e.evt;
                // 添加转换后的坐标
                evt.transformedX = (evt.layerX - _this.viewportPosition.x - _this.offset.x * _this.scale) / _this.scale;
                evt.transformedY = (evt.layerY - _this.viewportPosition.y - _this.offset.y * _this.scale) / _this.scale;

                // 鼠标左键
                if (evt.button === 0) {
                    _this.mouseUpActionPerformed(e);
                }
                // 鼠标滚轮
                else if (evt.button === 1) {
                    _this.mouseWheelUpActionPerformed(e);
                    return;
                }
                // 鼠标右键
                else if (evt.button === 2) {
                    _this.mouseRightUpActionPerformed(e);
                    return;
                }

                if (timer === null) {
                    timer = window.setTimeout(function() {
                        window.clearTimeout(timer);
                        timer = null;
                    }, 500);
                }
                // 500ms 内点击第二次，并且两次点击点的 x y 距离相差都在 1 以内
                // 可以认为是在双击
                else if (Math.abs(evt.layerX - mUpX) < 1 && Math.abs(evt.layerY - mUpY) < 1) {
                    _this.dblclickActionPerformed(e);
                }
                mUpX = evt.layerX;
                mUpY = evt.layerY;
            });

            this.eventHandlers['dragenter'] = function(e) {
                e.preventDefault();
            };
            this.eventHandlers['dragover'] = function(e) {
                e.preventDefault();
            };
            this.eventHandlers['drop'] = function(e) {
                e.transformedX = (e.layerX - _this.viewportPosition.x - _this.offset.x * _this.scale) / _this.scale;
                e.transformedY = (e.layerY - _this.viewportPosition.y - _this.offset.y * _this.scale) / _this.scale;
                _this.dropActionPerformed(e);
            };
            this.eventHandlers['mousewheel'] = function(e) {
                _this.mouseWheelActionPerformed(e);
            };
            this.eventHandlers['contextmenu'] = function(e) {
                e.preventDefault();
                e.stopPropagation();
            };

            this.domContainer.addEventListener('mousewheel', this.eventHandlers['mousewheel']);
            this.domContainer.addEventListener('dragenter', this.eventHandlers['dragenter']);
            this.domContainer.addEventListener('dragover', this.eventHandlers['dragover']);
            this.domContainer.addEventListener('drop', this.eventHandlers['drop']);
            this.domContainer.addEventListener('contextmenu', this.eventHandlers['contextmenu']);
        },
        mouseDownActionPerformed: function() {},
        mouseRightDownActionPerformed: function() {},
        mouseWheelDownActionPerformed: function() {},

        mouseMoveActionPerformed: function() {},
        mouseRightMoveActionPerformed: function() {},
        mouseWheelMoveActionPerformed: function() {},

        mouseUpActionPerformed: function() {},
        mouseRightUpActionPerformed: function() {},
        mouseWheelUpActionPerformed: function() {},

        mouseWheelActionPerformed: function() {},
        dropActionPerformed: function() {},
        dblclickActionPerformed: function() {},

        initKeyListeners: function() {
            var _this = this;
            var isInPainter = true;

            this.domContainer.addEventListener('mouseenter', function(e) {
                isInPainter = true;
            });

            this.domContainer.addEventListener('mouseleave', function(e) {
                isInPainter = false;
            });

            this.eventHandlers['keydown'] = function(e) {
                if (!isInPainter) return;
                _this.keyDownActionPerformed(e);
            };
            this.eventHandlers['keyup'] = function(e) {

                if (!isInPainter) return;

                // 将按键事件再进行细分
                // ctrl+z
                if (e.keyCode === 90 && e.ctrlKey) {
                    // 优先执行用户定义的处理函数，没有再执行默认的处理函数
                    return typeof _this.customCtrlZKeyUpActionPerformed === 'function' ?
                        _this.customCtrlZKeyUpActionPerformed(e) :
                        _this.ctrlZKeyUpActionPerformed(e);
                }
                // ctrl+y
                if (e.keyCode === 89 && e.ctrlKey) {
                    return typeof _this.customCtrlYKeyUpActionPerformed === 'function' ?
                        _this.customCtrlYKeyUpActionPerformed(e) :
                        _this.ctrlYKeyUpActionPerformed(e);
                }

                _this.keyUpActionPerformed(e);
            };

            window.addEventListener('keydown', this.eventHandlers['keydown']);
            window.addEventListener('keyup', this.eventHandlers['keyup']);
        },
        keyDownActionPerformed: function(e) {},
        keyUpActionPerformed: function(e) {},
        customCtrlZKeyUpActionPerformed: null,
        customCtrlYKeyUpActionPerformed: null,
        ctrlZKeyUpActionPerformed: function(e) {},
        ctrlYKeyUpActionPerformed: function(e) {},

        getPage: function() {
            return this.screen;
        },

        getTransform: function() {
            return this.canvasStage.getTransform().m;
        },

        getViewportPosition: function() {
            var w = this.stage.width();
            var h = this.stage.height();
            var vw = this.pageWidth * this.scale;
            var vh = this.pageHeight * this.scale;

            return {
                x: (w - vw) / 2,
                y: (h - vh) / 2
            }
        },

        getOffset: function() {
            var ox = this.canvasStage.offsetX();
            var oy = this.canvasStage.offsetY();

            return {
                x: ox * this.scale,
                y: oy * this.scale
            }
        },

        setGridWidth: function(gridWidth) {
            this.gridWidth = gridWidth;
        },

        getGridWidth: function() {
            return this.gridWidth;
        },

        getScale: function() {
            return this.scale;
        },

        /** @deprecate */
        transform: function() {
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
                    x: (x + offset.x) / scale,
                    y: (y + offset.y) / scale,
                    w: w / scale,
                    h: h / scale
                }
            } else if (class2type.call(arguments[0].x) !== '[object Function]') {
                if (arguments[0].x !== undefined) rs.x = (arguments[0].x + offset.x) / scale;
                if (arguments[0].y !== undefined) rs.y = (arguments[0].y + offset.y) / scale;
                if (arguments[0].w !== undefined) rs.w = arguments[0].w / scale;
                if (arguments[0].h !== undefined) rs.h = arguments[0].h / scale;

                return rs;
            } else {
                abPos = arguments[0].getAbsolutePosition();
                x = abPos.x;
                y = abPos.y;
                w = arguments[0].width();
                h = arguments[0].height();

                return {
                    x: (x + offset.x) / scale,
                    y: (y + offset.y) / scale,
                    w: w / scale,
                    h: h / scale
                }
            }
        },

        /** @deprecate */
        inverseTransform: function() {
            var offset = this.getOffset();
            var scale = this.scale;
            var rs = {};

            if (arguments[0].x !== undefined) rs.x = arguments[0].x * scale - offset.x;
            if (arguments[0].y !== undefined) rs.y = arguments[0].y * scale - offset.y;
            if (arguments[0].w !== undefined) rs.w = arguments[0].w * scale;
            if (arguments[0].h !== undefined) rs.h = arguments[0].h * scale;

            return rs;
        },

        scaleTo: function(scale) {
            var offset;

            this.scale = scale;

            // 处理 canvas 图层的缩放
            this.canvasStage.scale({
                x: scale,
                y: scale
            });
            // 处理交互层的缩放
            this.interactiveLayer.scale({
                x: scale,
                y: scale
            });

            offset = this.viewportPosition = this.getViewportPosition();
            this.canvasStage.offsetX(-offset.x / scale);
            this.canvasStage.offsetY(-offset.y / scale);
            this.interactiveLayer.offsetX(-offset.x / scale);
            this.interactiveLayer.offsetY(-offset.y / scale);

            this.canvasStage.draw();

            // 处理 html layer 的缩放
            this.htmlStage.scale(scale);

            // 处理 bg layer 的缩放
            this.bgStage.scale(scale);
        },

        fixZoom: function() {
            // 如果修改了浏览器的缩放比例，这里需要修复一下 chrome 浏览器
            // 字体最小只能缩放到 12px 的问题
            if (dpr < 1 && window.devicePixelRatio !== dpr) {
                dpr = window.devicePixelRatio;
                this.htmlStage.fixZoom();
            }
        },

        getAllLayers: function() {
            return this.getRootLayer().getLayers('*');
        },

        getCanvasLayer: function() {
            return this.canvasStage;
        },

        getHtmlLayer: function() {
            return this.htmlStage;
        },

        getBgLayer: function() {
            return this.bgStage;
        },

        getRootLayer: function() {
            return this.rootLayer;
        },

        getAllWidgets: function() {
            return this.getRootLayer().getWidgets(true);
        },

        // 获取图层的状态信息
        getLayerStatus: function() {
            var map = {};
            // 只取根目录下的图层
            var layers = this.getRootLayer().getLayers(false);

            layers.forEach(function(row) {
                map[row.store.model._id()] = 1 - row.store.model.isHide();
            });

            return map;
        },

        // 在图层中查找指定的图形
        find: function(selector) {
            return this.getRootLayer().find(selector);
        },

        // 根据 id 数组查找控件
        findByIds: function(ids) {
            var _this = this;
            var rs = [];

            ids = ids || [];
            ids.forEach(function(id) {
                if (_this.elementMap[id]) {
                    rs.push(_this.elementMap[id]);
                }
            });

            return rs;
        },

        findByCondition: function(cond) {
            return this.getRootLayer().findByCondition(cond);
        },

        draw: function() {
            this.getCanvasLayer().draw();
            this.getHtmlLayer().draw();
            this.getBgLayer().draw();
        },

        // 进入场景模式（鼠标双击设备控件可触发）
        enterSceneMode: function(widgetId) {
            var widget = this.find('#' + widgetId)[0];
            var widgets = this.getAllWidgets();
            var widgetModel;

            widgets.forEach(function(row) {
                var model = row.store.model;

                if (model._id() === widgetId) {
                    widgetModel = model;
                }
                // 将不相关的控件，从图层上剔除
                else if (!model.groupId || model.groupId() !== widgetId) {
                    row.detach();
                }
            });

            // 如果没有找到相关 model，则不做任何事情
            if (!widgetModel) {
                return;
            }

            this.isSceneMode = true;
            this.sceneModeStore = {
                widgets: widgets,
                x: widgetModel.x(),
                y: widgetModel.y(),
                pageWidth: this.pageWidth,
                pageHeight: this.pageHeight
            };

            widgetModel.update({
                x: 0,
                y: 0
            });

            // 更改 painter 的大小，调整到目标控件的大小
            this.resizePage(widgetModel.w(), widgetModel.h());

            // 取消所有的控件选中
            this.setActiveWidgets();
        },

        // 退出场景模式
        quitSceneMode: function(widgetId) {
            var widget = this.find('#' + widgetId)[0];
            var widgets = this.sceneModeStore.widgets;
            var widgetModel;

            widgets.forEach(function(row) {
                var model = row.store.model;

                if (model._id() === widgetId) {
                    widgetModel = model;
                }
                // 将不相关的控件，从图层上剔除
                else if (!model.groupId || model.groupId() !== widgetId) {
                    row.attach();
                }
            });

            if (!widgetModel) {
                return;
            }

            this.isSceneMode = false;

            widgetModel.update({
                x: this.sceneModeStore.x,
                y: this.sceneModeStore.y
            });

            // 更改 painter 的大小，调整到目标控件的大小
            this.resizePage(this.sceneModeStore.pageWidth, this.sceneModeStore.pageHeight);

            // 退出的时候将组合控件进行选中
            this.setActiveWidgets(widgetId);

            // 释放不用的数据
            this.sceneModeStore = null;
        },
        // 根据控件的类型，判断控件所属的图层
        getParentByWidgetType: function(widgetType) {
            switch (widgetType) {
                case 'HtmlText':
                case 'HtmlButton':
                case 'HtmlContainer':
                case 'HtmlScreenContainer':
                case 'HtmlDashboard':
                    return this.getHtmlLayer();
                default:
                    return this.getCanvasLayer();
            }
        },

        // 根据子图层的类型，判断子图层所属的根图层
        getParentByLayerType: function(layerType) {
            switch (layerType) {
                case 'canvas':
                    return this.getCanvasLayer();
                default:
                    return this.getHtmlLayer();
            }
        },

        close: function() {
            var _this = this;
            // 由于 keydown 和 keyup 事件不会随着 DOM 删除而删除，所以这里手动删除
            Object.keys(this.eventHandlers).forEach(function(evtName) {
                window.removeEventListener(evtName, _this.eventHandlers[evtName]);
            });

            /** 删除所有图层 */
            this.rootLayer.close();

            /** 删除所有舞台 */
            this.htmlStage.close();
            this.bgStage.close();
            this.canvasStage.close();

            // Konva 对象的销毁和普通的不一样，有所区别
            this.stage.destroy();
            this.interactiveLayer.destroy();

            //删除诊断配置的缓存
            sessionStorage.removeItem('equipmentsData_' + AppConfig.project.bindId);
        }
    };

    exports.GPainter = GPainter;
}(window));