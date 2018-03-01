/** 
 * Canvas Painter
 */

(function () {

    var VIEWPORT_WIDTH = 800;
    var VIEWPORT_HEIGHT = 600;

    function GPainter(screen) {
        this.screen = screen;
        this.domContainer = screen.domCtn;
        
        this.domCanvas = undefined;
        this.context2d = undefined;
        this.scale = undefined;

        this.stage = undefined;
        this.layer = undefined;
        this.viewport = undefined;

        this.init();
    }

    GPainter.prototype = {
        constructor: GPainter,
        
        init: function () {
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
            this.staticLayer = new Konva.FastLayer({
                id: 'staticLayer',
                name: 'staticLayer'
            });

            // 交互图层创建
            this.activeLayer = new Konva.Layer({
                id: 'activeLayer',
                name: 'activeLayer'
            });

            // 可视区域创建
            this.viewport = new Konva.Rect({
                id: 'viewport',
                name: 'viewport',
                fill: '#fff',
                x: (width - VIEWPORT_WIDTH)/2,
                y: (height - VIEWPORT_HEIGHT)/2,
                width: VIEWPORT_WIDTH,
                height: VIEWPORT_HEIGHT
            });

            this.staticLayer.add(this.viewport);
            this.stage.add(this.staticLayer);
            this.stage.add(this.activeLayer);

            this.scale = 1;
            this.initMouseListeners();
            this.initKeyListeners();
        },

        resize: function () {
        },

        createShape: (function () {

            function update(activeAnchor) {
                var group = activeAnchor.getParent();
                var x, y, width, height;

                var topLeft = group.find('.top-left')[0];
                var topMiddle = group.find('.top-middle')[0];
                var topRight = group.find('.top-right')[0];
                var rightMiddle = group.find('.right-middle')[0];
                var bottomRight = group.find('.bottom-right')[0];
                var bottomMiddle = group.find('.bottom-middle')[0];
                var bottomLeft = group.find('.bottom-left')[0];
                var leftMiddle = group.find('.left-middle')[0];

                var shape = group.find('.resizable-shape')[0];

                var anchorX = activeAnchor.getX();
                var anchorY = activeAnchor.getY();

                switch (activeAnchor.getName().split(' ')[1]) {
                    case 'top-left':
                        topRight.setY(anchorY);
                        bottomLeft.setX(anchorX);
                        break;
                    case 'top-middle':
                        topLeft.setY(anchorY);
                        topRight.setY(anchorY);
                        break;
                    case 'top-right':
                        topLeft.setY(anchorY);
                        bottomRight.setX(anchorX);
                        break;
                    case 'right-middle':
                        topRight.setX(anchorX);
                        bottomRight.setX(anchorX);
                        break;
                    case 'bottom-right':
                        topRight.setX(anchorX);
                        bottomLeft.setY(anchorY);
                        break;
                    case 'bottom-middle':
                        bottomLeft.setY(anchorY);
                        bottomRight.setY(anchorY);
                        break;
                    case 'bottom-left':
                        topLeft.setX(anchorX);
                        bottomRight.setY(anchorY);
                        break;
                    case 'left-middle':
                        topLeft.setX(anchorX);
                        bottomLeft.setX(anchorX);
                        break;
                }

                width = topRight.getX() - topLeft.getX();
                height = bottomLeft.getY() - topLeft.getY();

                // 调整 4 个中点的位置
                x = topLeft.getX() + width/2;
                y = topLeft.getY() + height/2;
                topMiddle.setX(x);
                topMiddle.setY(topLeft.getY());
                rightMiddle.setX(topRight.getX());
                rightMiddle.setY(y);
                bottomMiddle.setX(x);
                bottomMiddle.setY(bottomLeft.getY());
                leftMiddle.setX(topLeft.getX());
                leftMiddle.setY(y);

                // 调整图形的位置和大小
                shape.position(topLeft.position());

                if(width && height) {
                    shape.width(width);
                    shape.height(height);
                }
            }
            
            function addAnchor(group, name) {
                var anchor = new Konva.Circle({
                    stroke: '#666',
                    fill: '#ddd',
                    strokeWidth: 2,
                    radius: 4,
                    name: name,
                    draggable: true,
                    dragOnTop: true,
                    visible: false
                });
                var type = name.split(' ')[1];

                if(type === 'top-middle' || type === 'bottom-middle') {
                    // 限制垂直拖动
                    anchor.dragBoundFunc(function (pos) {
                        return {
                            x: this.getAbsolutePosition().x,
                            y: pos.y
                        }
                    });
                } else if(type === 'left-middle' || type === 'right-middle') {
                    // 限制水平拖动
                    anchor.dragBoundFunc(function (pos) {
                        return {
                            x: pos.x,
                            y: this.getAbsolutePosition().y
                        }
                    });
                }

                anchor.on('dragmove', function() {
                    var layer = this.getLayer();
                    update(this);
                    layer.draw();
                });
                anchor.on('mousedown touchstart', function() {
                    group.setDraggable(false);
                    this.moveToTop();
                });
                anchor.on('dragend', function() {
                    var layer = this.getLayer();
                    group.setDraggable(true);
                    layer.draw();
                });
                // 鼠标悬浮样式定义
                anchor.on('mouseover', function() {
                    var layer = this.getLayer();
                    this.setStrokeWidth(4);
                    layer.draw();
                });
                anchor.on('mouseout', function() {
                    var layer = this.getLayer();
                    this.setStrokeWidth(2);
                    layer.draw();
                });

                group.add(anchor);
            }

            return function (type, options) {
                var shape, group, bound;
                options = options || {};
                options.name = options.name ? options.name+' resizable-shape' : 'resizable-shape';
                shape = new Konva[type](options);
                group = new Konva.Group({
                    draggable: true
                });
                bound = shape.getClientRect();

                group.on('mousedown', function (e) {
                    e.cancelBubble = true;
                });

                group.add(shape);
                addAnchor(group, 'anchor top-left');
                addAnchor(group, 'anchor top-middle');
                addAnchor(group, 'anchor top-right');
                addAnchor(group, 'anchor right-middle');
                addAnchor(group, 'anchor bottom-right');
                addAnchor(group, 'anchor bottom-middle');
                addAnchor(group, 'anchor bottom-left');
                addAnchor(group, 'anchor left-middle');

                group.find('.anchor').each(function (anchor, i) {
                    switch (anchor.getName().split(' ')[1]) {
                        case 'top-left':
                            anchor.setX(bound.x);
                            anchor.setY(bound.y);
                            break;
                        case 'top-middle':
                            anchor.setX(bound.x + bound.width / 2);
                            anchor.setY(bound.y);
                            break;
                        case 'top-right':
                            anchor.setX(bound.x + bound.width);
                            anchor.setY(bound.y);
                            break;
                        case 'right-middle':
                            anchor.setX(bound.x + bound.width);
                            anchor.setY(bound.y + bound.height / 2);
                            break;
                        case 'bottom-right':
                            anchor.setX(bound.x + bound.width);
                            anchor.setY(bound.y + bound.height);
                            break;
                        case 'bottom-middle':
                            anchor.setX(bound.x + bound.width / 2);
                            anchor.setY(bound.y + bound.height);
                            break;
                        case 'bottom-left':
                            anchor.setX(bound.x);
                            anchor.setY(bound.y + bound.height);
                            break;
                        case 'left-middle':
                            anchor.setX(bound.x);
                            anchor.setY(bound.y + bound.height / 2);
                            break;
                    }
                    anchor.visible(true);
                });

                return group;
            };
        }()),
        
        initMouseListeners: function () {
            var _this = this;

            this.activeLayer.on('mousedown', function () {
                _this.mouseDownActionPerformed.call(_this);
            });

            this.activeLayer.on('mousemove', function () {
                _this.mouseMoveActionPerformed.call(_this);
            });

            this.activeLayer.on('mouseup', function () {
                _this.mouseUpActionPerformed.call(_this);
            });
        },
        mouseDownActionPerformed: function () {},
        mouseMoveActionPerformed: function () {},
        mouseUpActionPerformed: function () {},
        initKeyListeners: function () {
            //window.addEventListener('keyup', this.keyUpActionPerformed.bind(this));
        },
        keyUpActionPerformed: function (e) {},

        scaleTo: function (scale) {
            var width = this.stage.width();
            var height = this.stage.height();
            // 调整比例
            this.stage.scale({
                x: scale,
                y: scale
            });
            // 调整位置
            this.stage.position({
                x: -width * (scale - 1) / 2,
                y: -height * (scale - 1) / 2
            });

            this.scale = scale;
            this.stage.draw();
        }
    };

    window.GPainter = GPainter;

} ())