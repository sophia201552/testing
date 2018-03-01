/////////////////////////////////
/// CanvasPipeShape DEFINITION //
/////////////////////////////////
(function (CanvasLine, CanvasCircle, CanvasRect) {

    function CanvasPipeShape(layer, options) {
        this.layer = layer;
        this.options = options;

        // 当前图形的位置和大小信息
        this.shapeInfo = null;

        this.line = null;
        this.joins = [];
        this.rects = [];
        this.rectsEx = [];

        this.moves = [];
        this.anim = null;
        this.animationOptions = {
            speed: 50
        }
    }

    CanvasPipeShape.prototype.CIRCLE_RADIUS = 10;
    CanvasPipeShape.prototype.BEND_Length = 17;

    CanvasPipeShape.prototype.paint = function (isActive) {
        var x, y;
        var points = this.options.points;
        var color = this.options.color;
        var width = this.options.width;
        var id = this.options._id;
        var rotation = 0;
        //节点颜色处理
        var deepColor = (function (rgb) {
            var r, g, b, ds;
            if (rgb.charAt(0) == '#') {
                r = rgb.substring(1, 3);
                g = rgb.substring(3, 5);
                b = rgb.substring(5, 7);
                r = parseInt(r, 16);
                g = parseInt(g, 16);
                b = parseInt(b, 16);
            } else {
                ds = rgb.split(/\D+/);
                r = Number(ds[1]);
                g = Number(ds[2]);
                b = Number(ds[3]);
            }
            r = Math.round(0.8 * r);
            g = Math.round(0.8 * g);
            b = Math.round(0.8 * b);

            return 'rgb('+r+','+g+','+b+')';
        })(color);
        //弯头宽度 = 管道宽度 + 4px;
        if(width && Number(width)){
            this.CIRCLE_RADIUS = Number(width) / 2;
            this.BEND_Length = this.CIRCLE_RADIUS * 1.4;
        }

        // 不存在，则进行创建
        if (!this.line) {
            this.line = new CanvasLine(this.layer, {
                id: id,
                name: 'pipe-line pipe-' + id,
                lineJoin: 'round',
                perfectDrawEnabled: false
                        
                //20160526 Neil: 谁搞定渐变，我请吃饭
                //fillLinearGradientStartPoint: { x: this.options.points[0].x, y: this.options.points[0].y },
                //fillLinearGradientEndPoint: { x: this.options.points[0].x, y: this.options.points[1].y },
                //fillLinearGradientColorStops: [0, 'red', 0.5, 'blue', 1, 'green'],
                //fillPriority: 'linear-gradient',
            });

            for (var i = 0, len = points.length; i < len; i+=1) {
                // 添加圆形连接点
                this.joins.push(new CanvasCircle(this.layer, {
                    id: 'pipejoin_'+id,
                    name: 'pipe-joint pipe-joint-circle pipe-'+id,
                    fill: '#888',
                    perfectDrawEnabled: false
                }));

                // 添加方形管道入口/出口
                if (i - 1 > -1) {
                    this.rects.push(new CanvasRect(this.layer, {
                        id: id+'_r_f_'+i,
                        name: 'pipe-joint pipe-joint-rect',
                        fill: '#888',
                        perfectDrawEnabled: false
                    }));
                    this.rectsEx.push(new CanvasRect(this.layer, {
                        id: id+'_r_e_f_'+i,
                        name: 'pipe-joint pipe-joint-rectEx',
                        fill: '#888',
                        perfectDrawEnabled: false
                    }));
                }

                if (i + 1 < len) {
                    this.rects.push(new CanvasRect(this.layer, {
                        id: id+'_r_b_'+i,
                        name: 'pipe-joint-rect',
                        fill: '#888',
                        perfectDrawEnabled: false
                    }));
                    this.rectsEx.push(new CanvasRect(this.layer, {
                        id: id+'_r_e_f_'+i,
                        name: 'pipe-joint pipe-joint-rectEx',
                        fill: '#888',
                        perfectDrawEnabled: false
                    }));
                }
            }
        }

        // 更新 - 开始
        this.line.points( (function (points) {
            var arr = [];
            points.forEach(function (row) {
                arr.push(row.x);
                arr.push(row.y);
            });
            return arr;
        }(points)) );
        this.line.stroke(color ? color : 'rgba(0, 114, 201, .7)');
        this.line.strokeWidth(width ? width : 14);
        this.line.opacity(isActive ? 1 : 1);

        for (var i = 0, len = points.length; i < len; i += 1) {
            // 圆形连接点
            this.joins[i].x(points[i].x - this.CIRCLE_RADIUS);
            this.joins[i].y(points[i].y - this.CIRCLE_RADIUS);
            this.joins[i].offsetX(-this.CIRCLE_RADIUS);
            this.joins[i].offsetY(-this.CIRCLE_RADIUS);
            this.joins[i].radius(this.CIRCLE_RADIUS);
            this.joins[i].fill(deepColor ? deepColor : 'rgba(0, 114, 201, .7)');

            // 方形管道入口/出口
            if (i - 1 > -1) {
                rotation = Math.atan2(points[i-1].y-points[i].y, points[i-1].x-points[i].x) * GUtil.DEG;
                this.rects[i].x(points[i].x);
                this.rects[i].y(points[i].y);
                this.rects[i].width(this.BEND_Length*1.5);
                this.rects[i].height(this.CIRCLE_RADIUS * 2);
                this.rects[i].offsetY(this.CIRCLE_RADIUS);
                this.rects[i].rotation(rotation);
                this.rects[i].fill(deepColor ? deepColor : 'rgba(0, 114, 201, .7)');

                this.rectsEx[i].x(points[i].x);
                this.rectsEx[i].y(points[i].y);
                this.rectsEx[i].width(this.BEND_Length/2.2);
                this.rectsEx[i].height(this.CIRCLE_RADIUS * 2 * 1.2);
                this.rectsEx[i].offsetY(this.CIRCLE_RADIUS * 1.2);
                this.rectsEx[i].offsetX(-this.BEND_Length*1.1);
                this.rectsEx[i].rotation(rotation);
                this.rectsEx[i].fill(deepColor ? deepColor : 'rgba(0, 114, 201, .7)');
            }

            if (i + 1 < len) {
                rotation = Math.atan2(points[i+1].y-points[i].y, points[i+1].x-points[i].x) * GUtil.DEG;
                this.rects[i].x(points[i].x);
                this.rects[i].y(points[i].y);
                this.rects[i].width(this.BEND_Length*1.5);
                this.rects[i].height(this.CIRCLE_RADIUS * 2);
                this.rects[i].offsetY(this.CIRCLE_RADIUS);
                this.rects[i].rotation(rotation);
                this.rects[i].fill(deepColor ? deepColor : 'rgba(0, 114, 201, .7)');

                this.rectsEx[i].x(points[i].x);
                this.rectsEx[i].y(points[i].y);
                this.rectsEx[i].width(this.BEND_Length/2.2);
                this.rectsEx[i].height(this.CIRCLE_RADIUS * 2 * 1.2);
                this.rectsEx[i].offsetY(this.CIRCLE_RADIUS * 1.2);
                this.rectsEx[i].offsetX(-this.BEND_Length*1.1);
                this.rectsEx[i].rotation(rotation);
                this.rectsEx[i].fill(deepColor ? deepColor : 'rgba(0, 114, 201, .7)');
            }
        }

        if (isActive) {
            this.addAnimation();
        } else {
            this.removeAnimation();
        }

        this.shapeInfo = GUtil.getPipeRect(points);
    };

    CanvasPipeShape.prototype.addAnimation = function () {
        var _this = this;
        var options = this.options;
        var points = options.points;
        var distance, durations;

        // 若已存在，则不再继续
        if (this.moves && this.moves.length) {
            return;
        }

        distance = GUtil.getDistance(points[0], points[1]);
        durations = distance / _this.animationOptions.speed * 1000;

        // 添加动画
        this.anim = new Konva.Animation(function (frame) {
            var item = _this.moves[0];
            var prograss = (frame.time % durations) / durations;
            var d = distance * prograss * (options.direction === 0 ? 1 : -1);

            item.fillPatternX(d);
        }, _this.layer.shape);

        GUtil.loadImage('/static/images/factory/widget/pop_2.png', function (image) {
            var scale = options.width / image.height;
            var radian = Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x);
            var widget = new Konva.Image({
                //x、y坐标为 {x + (管道以中轴定点旋转/图片以左下角旋转 的差值) - 弯头长度}
                x: points[0].x + options.width * Math.cos(radian - Math.PI / 2) / 2 + _this.BEND_Length * Math.cos(radian)*2,//*2是为了让动画的初出点在接口处
                y: points[0].y + options.width * Math.sin(radian - Math.PI / 2) / 2 + _this.BEND_Length * Math.sin(radian)*2,//*2是为了让动画的初出点在接口处
                fillPatternImage: image,
                width: distance - 2 * _this.BEND_Length*2,//*2是为了让动画的消失点在接口处
                height: image.width,
                offsetY:-1.2,//为了让缩放的图片居中
                fillPatternScale: { x: scale*0.5, y: scale*0.5 },//*缩放图片
                fillPatternRepeat: 'repeat-x',
                fillPriority: 'pattern',
                rotation: radian * 180 / Math.PI,
                perfectDrawEnabled: false
            });

            _this.moves.push(widget);
            _this.layer.add(widget);

            _this.anim.start();
        });
    };

    CanvasPipeShape.prototype.removeAnimation = function () {
        this.moves.forEach(function (row) {
            row.destroy();
        });
        this.moves = [];
        if (this.anim) this.anim.stop();
    };

    CanvasPipeShape.prototype.updatePoints = function (points) {
        this.options.points = points;
        this.paint();
    };

    CanvasPipeShape.prototype.toArray = function () {
        var shapes = [];
        shapes.push(this.line);
        shapes = shapes.concat(this.moves);
        shapes = shapes.concat(this.rects).concat(this.joins).concat(this.rectsEx);
        return shapes;
    };

    CanvasPipeShape.prototype.id = function () {
        return this.options._id;
    };

    CanvasPipeShape.prototype.remove = function () {
        this.joins.forEach(function(row){
            row.shape.remove();
        });
        this.rects.forEach(function(row){
            row.shape.remove();
        });
        this.rectsEx.forEach(function(row){
            row.shape.remove();
        });
        this.line.shape.remove();
    };
    /** @override */
    CanvasPipeShape.prototype.setZIndex = function (zIndex) {
        this.line.shape.setZIndex(zIndex++);
        this.moves.forEach(function (row) {
            row.setZIndex(zIndex++);
        });
        this.rects.forEach(function (row) {
            row.shape.setZIndex(zIndex++);
        });
        this.joins.forEach(function (row) {
            row.shape.setZIndex(zIndex++);
        });
        this.rectsEx.forEach(function (row) {
            row.shape.setZIndex(zIndex++);
        });
        return zIndex;
    };

    /** @override */
    CanvasPipeShape.prototype.getZIndex = function () {
        return this.line.getZIndex();
    };

    /** @override */
    CanvasPipeShape.prototype.getAbsolutePosition = function () {
        var painter = this.layer.painter;
        return painter.inverseTransform({
            x: this.shapeInfo.xMin,
            y: this.shapeInfo.yMin
        });
    };

    CanvasPipeShape.prototype.moveToBottom = function () {};

    CanvasPipeShape.prototype.isVisible = function () {
        return this.line.isVisible();
    };

    CanvasPipeShape.prototype.show = function () {
        this.joins.forEach(function(row){
            row.shape.show();
        });
        this.rects.forEach(function(row){
            row.shape.show();
        });
        this.rectsEx.forEach(function(row){
            row.shape.show();
        });
        this.line.shape.show();
    };

    CanvasPipeShape.prototype.hide = function () {
        this.joins.forEach(function(row){
            row.shape.hide();
        });
        this.rects.forEach(function(row){
            row.shape.hide();
        });
        this.rectsEx.forEach(function(row){
            row.shape.hide();
        });
        this.line.shape.hide();
    };

    CanvasPipeShape.prototype.destroy = function () {
        if (this.line) this.line.shape.destroy();
        this.joins.forEach(function (row) {
            row.shape.destroy();
        });
        
        this.rects.forEach(function (row) {
            row.shape.destroy();
        });

        this.rectsEx.forEach(function (row) {
            row.shape.destroy();
        });

        this.moves.forEach(function (row) {
            row.destroy();
        });
        this.moves = [];
        this.line = null;
        this.joins = [];
        this.rects = [];

        if (this.anim) this.anim.stop();
    };

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.CanvasPipeShape = CanvasPipeShape;

} ( window.widgets.factory.CanvasLine,
    window.widgets.factory.CanvasCircle,
    window.widgets.factory.CanvasRect));