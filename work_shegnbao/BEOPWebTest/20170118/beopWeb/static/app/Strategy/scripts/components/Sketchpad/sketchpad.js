
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.components.Sketchpad'), function (exports) {

    class SketchpadChild {
        constructor(opt) {
            this.opt = opt;
            this.id = opt.id;
            this.parent = undefined;
            this.children = [];
            this.line = [];
            this.lineSegment = [];
            this.SPAN = 10;
            this.inPoint = undefined;
            this.outPoint = undefined;
            this.minX = undefined;
            this.maxX = undefined;
            this.minY = undefined;
            this.maxY = undefined;
            this.maxW = undefined;
            this.maxH = undefined;
            this.$dom = undefined;
            this.init();
        }

        init() {
            this._createInfo();
        }

        add(children = []) {
            if (children instanceof Array) {
                this.children = this.children.concat(children);
            } else {
                this.children.push(children);
            }
            // this.children.sort((a, b) => {
            //     return Math.hypot(this.inPoint.x - a.outPoint.x, this.inPoint.y - a.outPoint.y) - Math.hypot(this.inPoint.x - b.outPoint.x, this.inPoint.y - b.outPoint.y);
            // });
            this.repaint();
        }

        paint() {
            this._createInfo();
            this._paint();
            this._paintChildren();
        }

        repaint() {
            this.parent.repaint();
        }

        setDom(dom) {
            this.$dom = dom;
        }

        setParent(parent) {
            this.parent = parent;
        }

        updateInfo() {
            this._createInfo();
        }

        _createInfo() {
            var opt = this.opt,
                minX = opt.x - this.SPAN,
                maxX = opt.x + opt.w + this.SPAN,
                minY = opt.y - this.SPAN,
                maxY = opt.y + opt.h + this.SPAN;
            this.minX = minX;
            this.maxX = maxX;
            this.minY = minY;
            this.maxY = maxY;
            this.maxW = maxX - minX;
            this.maxH = maxY - minY;
            this.points = [{ //顺时针方向
                x: minX,
                y: minY
            }, {
                x: maxX,
                y: minY
            }, {
                x: maxX,
                y: maxY
            }, {
                x: minX,
                y: maxY
            }];
            this.inPoint = {
                x: minX - 1,
                y: opt.y + opt.h / 2
            };
            this.outPoint = {
                x: maxX + 1,
                y: opt.y + opt.h / 2
            };

        }

        _paint() {
            var opt = this.opt;
            this._createDom();
            //TODO 创建模块
            this.canvas.fillRect(opt.x, opt.y, opt.w, opt.h);
        }

        _paintChildren() {
            var children = this.children;
            children.forEach((child) => {
                child.parent = this;
                child.paint();
            });
        }

    }

    class Sketchpad {
        constructor(dom) {
            this.container = dom;
            this.blocks = [];
            this.blockIds = new Set();
            this.obstacle = [];
            this.wrapDom = undefined;
            this.canvasDom = undefined;
            this.canvas = undefined;
            this.SPAN = 10;
            this.BLOCKWIDTH = 100;
            this.BLOCKHEIGHT = 100;
            this.INPUTWIDTH = 50;
            this.INPUTHEIGHT = 50;
            this.HEIGHT = undefined;
            this.WIDTH = undefined;
            this.init(dom);
        }

        static intersectionByLine(a, b, c, d) { //计算两条线段交点
            // // 三角形abc 面积的2倍 
            // var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);

            // // 三角形abd 面积的2倍 
            // var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);

            // // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理); 
            // if (area_abc * area_abd >= 0) {
            //     return false;
            // }

            // // 三角形cda 面积的2倍 
            // var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
            // // 三角形cdb 面积的2倍 
            // // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出. 
            // var area_cdb = area_cda + area_abc - area_abd;
            // if (area_cda * area_cdb >= 0) {
            //     return false;
            // }

            // //计算交点坐标 
            // var t = area_cda / (area_abd - area_abc);
            // var dx = t * (b.x - a.x),
            //     dy = t * (b.y - a.y);
            // return {
            //     x: a.x + dx,
            //     y: a.y + dy
            // };


            /** 1 解线性方程组, 求线段交点. **/
            // 如果分母为0 则平行或共线, 不相交  
            var denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
            if (denominator == 0) {
                return false;
            }

            // 线段所在直线的交点坐标 (x , y)      
            var x = ((b.x - a.x) * (d.x - c.x) * (c.y - a.y) +
                (b.y - a.y) * (d.x - c.x) * a.x -
                (d.y - c.y) * (b.x - a.x) * c.x) / denominator;
            var y = -((b.y - a.y) * (d.y - c.y) * (c.x - a.x) +
                (b.x - a.x) * (d.y - c.y) * a.y -
                (d.x - c.x) * (b.y - a.y) * c.y) / denominator;

            /** 2 判断交点是否在两条线段上 **/
            if (
                // 交点在线段1上  
                (x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0
                // 且交点也在线段2上  
                &&
                (x - c.x) * (x - d.x) <= 0 && (y - c.y) * (y - d.y) <= 0
            ) {

                // 返回交点p  
                return {
                    x: x,
                    y: y
                }
            }
            //否则不相交  
            return false
        }

        static BlockAndBlock(block, blocks = [], isDeep = false) {
            if (isDeep) {
                var intersectionInfo = []
                blocks.forEach((block2) => {
                    var points1 = block.points,
                        points2 = block2.points;
                    block.points.forEach((points1, i, arr1) => {
                        block2.points.forEach((points2, l, arr2) => {
                            var intersection = Sketchpad.intersectionByLine(points1, arr1[(i + 1) % 4], points2, arr2[(l + 1) % 4]);
                            if (intersection) {
                                intersectionInfo.push({
                                    intersection: intersection,
                                    obstacle: obstacle
                                });
                            }
                        });
                    });
                });
                return intersectionInfo;
            } else {
                var intersectionInfo = []
                blocks.forEach((block2) => {
                    if (intersectionInfo.length > 0) {
                        return;
                    }
                    var points1 = block.points,
                        points2 = block2.points;
                    block.points.forEach((points1, i, arr1) => {
                        if (intersectionInfo.length > 0) {
                            return;
                        }
                        block2.points.forEach((points2, l, arr2) => {
                            if (intersectionInfo.length > 0) {
                                return;
                            }
                            var intersection = Sketchpad.intersectionByLine(points1, arr1[(i + 1) % 4], points2, arr2[(l + 1) % 4]);
                            if (intersection) {
                                intersectionInfo.push({
                                    intersection: intersection,
                                    obstacle: obstacle
                                });
                            }
                        });
                    });
                });
                return intersectionInfo;
            }
        }

        static intersectionByRect(points = [], blocks = []) {
            var xArr = points.map((point) => {
                    return point.x
                }),
                yArr = points.map((point) => {
                    return point.y
                });
            var maxX = Math.max(...xArr),
                minX = Math.min(...xArr),
                maxY = Math.max(...yArr),
                minY = Math.min(...yArr);
            var finArr = [],
                idSet = new Set();
            blocks.forEach((block) => {
                block.points.forEach((point2, l, arr2) => {
                    if (idSet.has(block.id)) {
                        return;
                    }
                    points.forEach((point1, i, arr1) => {
                        var intersection = Sketchpad.intersectionByLine(arr1[i], arr1[(i + 1) % 4], arr2[l], arr2[(l + 1) % 4]);
                        if (intersection) {
                            finArr.push(block);
                            idSet.add(block.id);
                        }
                    })
                    if (point2.x <= maxX && point2.x >= minX && point2.y >= minY && point2.y <= maxY) {
                        finArr.push(block);
                        idSet.add(block.id);
                    }
                });
            });

            return finArr;
        }

        static rectToPoints(x, y, w, h) {
            var points = [{
                x: x,
                y: y
            }, {
                x: x + w,
                y: y
            }, {
                x: x + w,
                y: y + h
            }, {
                x: x,
                y: y + h
            }];
            return points;
        }

        init(dom) {
            this._createCanvas(dom);
            this.resize();
            this.canvas.strokeStyle = "rgb(0,0,0)";
            this.canvas.fillStyle = "#FFF";
            this.WIDTH = this.canvas.canvas.width;
            this.HEIGHT = this.canvas.canvas.height;
            this._attachEvent();
        }

        resize() {
            var $canvasDom = $(this.canvasDom),
                $wrapDom = $(this.wrapDom);
            $canvasDom.attr({
                width: $wrapDom.width(),
                height: $wrapDom.height()
            });
            this.repaint();
        }

        add(blocks = []) {
            if (blocks instanceof Array) {
                blocks.forEach((block) => {
                    this._addBlock(block);
                    block.setParent(this);
                });
            } else {
                this._addBlock(blocks);
                blocks.setParent(this);
            }
            this.repaint();
        }

        findBlockById(id) {
            var fin = undefined;
            this.blocks.forEach((block) => {
                if (block.id == id) {
                    fin = block;
                }
            });
            return block;
        }

        paint() {
            this._paintBlock(this.blocks);
            this._paintHtml(this.blocks);
            this._paintLine();
        }

        repaint() {
            this._clearCanvas();
            this._createObstacle();
            this.paint();
            this.canvas.save();
        }

        clear() {
            this._clearCanvas();
            this._clearHtml();
        }

        _addBlock(block) {
            if (!this.blockIds.has(block.id)) {
                this.blocks.push(block);
                this.blockIds.add(block.id);
            }
        }

        _createCanvas(dom) {
            var wrap = document.createElement('div'),
                canvas = document.createElement('canvas');
            canvas.style = canvas.style || {};
            wrap.id = 'canvasWrap';
            wrap.style = "width: 100%;height: 100%;position: relative;";
            dom.appendChild(wrap);
            wrap.appendChild(canvas);
            this.wrapDom = wrap;
            this.canvasDom = canvas;
            this.canvas = canvas.getContext('2d');
            this.canvas.strokeStyle = "rgb(0,0,0)";
            this.canvas.fillStyle = "#FFF";
        }

        _createLine(line) {
            this.canvas.beginPath();
            this.canvas.moveTo(line[0].point.x, line[0].point.y);
            line.forEach((data) => {
                this.canvas.lineTo(data.point.x, data.point.y);
            });
            this.canvas.stroke();
            this.canvas.closePath();
        }

        _attachEvent() {
            var _this = this;
            $(this.wrapDom).off('drop,dragover').on('dragover', function(e) {
                e.preventDefault();
            }).on('drop', function(e) {
                var $this = $(this);
                var offset = $this.offset(),
                    info = JSON.parse(e.originalEvent.dataTransfer.getData('info'));
                var x = e.originalEvent.x - offset.left - info.x,
                    y = e.originalEvent.y - offset.top - info.y;
                var block = new SketchpadChild({
                    id: +new Date(),
                    x: x,
                    y: y,
                    w: _this.BLOCKWIDTH,
                    h: _this.BLOCKHEIGHT,
                    dom: {
                        w: info.w,
                        h: info.h
                    }
                });
                _this.add(block);
            });
        }

        _clearLine() {
            this.canvas.restore();
        }

        _clearCanvas() {
            this.canvas.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        }

        _clearHtml() {
            $('.strategyBlock', this.wrapDom).remove();
        }

        _paintBlock(blocks) {
            blocks.forEach((block) => {
                this.canvas.fillRect(block.opt.x, block.opt.y, block.opt.w, block.opt.h);
                if (block.children) {
                    this._paintBlock(block.children);
                }
            });
        }

        _paintHtml(blocks) {
            blocks.forEach((block) => {
                if (!block.$dom) {
                    this._createHtml(block);
                };

                if (block.children) {
                    this._paintHtml(block.children);
                }
            });
        }

        _createHtml(block) {
            var _this = this;
            var opt = block.opt;
            var tpl = `<div class="strategyBlock" id="html_${opt.id}" style="position:absolute;background:#ccc;left:0;top:0;"></div>`;
            var $wrapDom = $(this.wrapDom),
                $blockHtml = $(tpl).appendTo($wrapDom);
            block.setDom($blockHtml);
            var oldX, oldY;
            $blockHtml.css({
                left: opt.x,
                top: opt.y,
                width: opt.dom.w,
                height: opt.dom.h,
                opacity: 0
            }).animate({
                width: opt.w,
                height: opt.h,
                opacity: 1
            }).off('dblclick,mousedown,mouseup').on('dblclick', function() {
                var num = Number.parseInt(prompt("请输入个数", "1"));
                if (num) {
                    var intersection, direction = [3, 1, 2, 4]; //1234上下左右
                    var W = _this.INPUTWIDTH + 2 * _this.SPAN,
                        H = _this.INPUTHEIGHT + 2 * _this.SPAN,
                        MINSPAN = 2 * _this.SPAN,
                        MAXSPAN = (num - 1) * _this.SPAN;
                    var w, h, x, y, points;
                    var funArr = [left, top, botton, right],
                        cArr = [W + MINSPAN, H + MINSPAN, H + MINSPAN, W + MINSPAN];
                    for (let i = 0; i < 2; i++) {
                        let is = funArr[i](cArr[i]);
                        if (is) {
                            break;
                        }
                    }
                    // left(W + MINSPAN);
                }

                function left(minInputWidth) {
                    if (block.minX > minInputWidth) {
                        w = W;
                        h = num * H + MAXSPAN;
                        x = block.minX - minInputWidth;
                        y = block.minY - (h - block.maxH) / 2 + _this.SPAN;
                        y = Math.min(Math.max(0, y), (_this.HEIGHT - h + 2 * _this.SPAN));
                        points = Sketchpad.rectToPoints(x, y, w, h);
                        intersection = Sketchpad.intersectionByRect(points, _this.obstacle);

                        if (intersection.length < 1) {
                            for (let i = 0; i < num; i++) {
                                var child = new SketchpadChild({
                                    id: +new Date(),
                                    x: x,
                                    y: y + i * (_this.INPUTHEIGHT + MINSPAN + _this.SPAN),
                                    w: _this.INPUTWIDTH,
                                    h: _this.INPUTHEIGHT,
                                    dom: {
                                        w: 0,
                                        h: 0
                                    }
                                });
                                child.setParent(block);
                                _this._addBlock(block);
                                block.add(child);
                            }
                            return true;
                        } else {
                            return left(minInputWidth + 1);
                        }
                    } else {
                        return false;
                    }
                }

                function top(minInputHeight) {
                    if (block.minY > minInputHeight) {
                        w = num * W + MAXSPAN;
                        h = H;
                        x = block.minX - (w - block.maxW) / 2 + _this.SPAN;
                        y = block.minY - minInputHeight;
                        x = Math.min(Math.max(0, x), (_this.WIDTH - w));
                        points = Sketchpad.rectToPoints(x, y, w, h);
                        intersection = Sketchpad.intersectionByRect(points, _this.obstacle);

                        if (intersection.length < 1) {
                            for (let i = 0; i < num; i++) {
                                var child = new SketchpadChild({
                                    id: +new Date(),
                                    x: x + i * (_this.INPUTWIDTH + MINSPAN + _this.SPAN),
                                    y: y,
                                    w: _this.INPUTWIDTH,
                                    h: _this.INPUTHEIGHT,
                                    dom: {
                                        w: 0,
                                        h: 0
                                    }
                                });
                                child.setParent(block);
                                block.add(child);
                            }
                            return true;
                        } else {
                            return top(minInputHeight + 1);
                        }
                    } else {
                        return false;
                    }
                }

                function botton(minInputHeight) {
                    if (_this.HEIGHT > block.maxY + minInputHeight) {
                        w = num * W + MAXSPAN;
                        h = H;
                        x = block.minX - (w - block.maxW) / 2 + _this.SPAN;
                        y = block.maxY + minInputHeight - _this.INPUTHEIGHT
                        x = Math.min(Math.max(0, x), (_this.WIDTH - w));
                        points = Sketchpad.rectToPoints(x, y, w, h);
                        intersection = Sketchpad.intersectionByRect(points, _this.obstacle);

                        if (intersection.length < 1) {
                            for (let i = 0; i < num; i++) {
                                var child = new SketchpadChild({
                                    id: +new Date(),
                                    x: x + i * (_this.INPUTWIDTH + MINSPAN + _this.SPAN),
                                    y: y,
                                    w: _this.INPUTWIDTH,
                                    h: _this.INPUTHEIGHT,
                                    dom: {
                                        w: 0,
                                        h: 0
                                    }
                                });
                                child.setParent(block);
                                block.add(child);
                            }
                            return true;
                        } else {
                            return botton(minInputHeight + 1);
                        }
                    } else {
                        return false;
                    }
                }

                function right(minInputWidth) {
                    if (_this.WIDTH > block.maxX + minInputWidth) {
                        w = W;
                        h = num * H + MAXSPAN;
                        x = block.maxX + minInputWidth - _this.INPUTWIDTH;
                        y = block.minY - (h - block.maxH) / 2 + _this.SPAN;
                        y = Math.min(Math.max(0, y), (_this.HEIGHT - h + 2 * _this.SPAN));
                        points = Sketchpad.rectToPoints(x, y, w, h);
                        intersection = Sketchpad.intersectionByRect(points, _this.obstacle);

                        if (intersection.length < 1) {
                            for (let i = 0; i < num; i++) {
                                var child = new SketchpadChild({
                                    id: +new Date(),
                                    x: x,
                                    y: y + i * (_this.INPUTHEIGHT + MINSPAN + _this.SPAN),
                                    w: _this.INPUTWIDTH,
                                    h: _this.INPUTHEIGHT,
                                    dom: {
                                        w: 0,
                                        h: 0
                                    }
                                });
                                child.setParent(block);
                                block.add(child);
                            }
                            return true;
                        } else {
                            return right(minInputWidth + 1);
                        }
                    } else {
                        return false;
                    }
                }

            }).on('mousedown', function(e) {
                oldX = e.originalEvent.clientX;
                oldY = e.originalEvent.clientY;
                $wrapDom.on('mousemove', function(e) {
                    var newX = e.originalEvent.clientX,
                        newY = e.originalEvent.clientY;
                    var left = Number.parseFloat($blockHtml.css('left')),
                        top = Number.parseFloat($blockHtml.css('top'));
                    var dx = newX - oldX,
                        dy = newY - oldY;
                    oldX = newX;
                    oldY = newY;
                    $blockHtml.css({
                        left: left + dx,
                        top: top + dy
                    })
                    block.opt.x += dx;
                    block.opt.y += dy;
                    block.updateInfo();
                    _this.repaint();
                })
            }).on('mouseup', function(e) {
                $wrapDom.off('mousemove');
            });
        }

        _createObstacle(blocks) {
            var obstacle = [];
            var create = function(blocks) {
                blocks.forEach((block) => {
                    obstacle.push(block);
                    if (block.children) {
                        create(block.children);
                    }
                });
            };
            create(this.blocks);
            this.obstacle = obstacle;

            // this._mergeObstacle();
        }

        _paintLine() {
            var maxStep = (this.WIDTH + this.HEIGHT) / this.SPAN * 2;
            this.blocks.forEach((block) => {
                block.children.length > 0 && this._createLine([{ //入口
                    point: block.inPoint
                }, {
                    point: {
                        x: block.opt.x,
                        y: block.opt.y + block.opt.h / 2
                    }
                }]);
                block.children.forEach((child, index) => {
                    child.line = [{
                        point: child.outPoint,
                        targetPoint: block.inPoint
                    }];
                    for (let i = 0; i < child.line.length; i++) {
                        var data = this._step(child.line[i], child);
                        if (data && (data.point.x !== block.inPoint.x || data.point.y != block.inPoint.y)) {
                            child.line.push(data);
                        } else {
                            child.line.push({
                                point: block.inPoint,
                                targetPoint: undefined
                            });
                            break;
                        }
                        if (i > maxStep) { //出错 防止死循环
                            console.log('遮挡');
                            // this._clearLine();
                            child.line = [];
                        }
                    }
                    child.line.unshift({ //出口
                        point: {
                            x: child.opt.x + child.opt.w,
                            y: child.opt.y + child.opt.h / 2
                        },
                        targetPoint: child.outPoint
                    })
                    this._createLine(child.line);
                });
            });
        }

        _step(data, child) {
            var x = undefined,
                y = undefined;
            var firstPoint = data.point,
                lastPoint = undefined,
                targetPoint = data.targetPoint;
            var line = child.line,
                block = child.parent;
            var dX = firstPoint.x - targetPoint.x,
                dY = firstPoint.y - targetPoint.y;
            var intersectionInfo = undefined, //交点信息
                directionArr = [], //方向
                tempDirection = [],
                firstDirection = undefined, //第一牵引方向
                lastDirection = data.lastDirection; //上一次牵引方向

            //确认方向
            //1234上下左右
            if (lastDirection && lastDirection > 2) {
                if (dY > 0) { //上
                    directionArr.push(1);
                    if (dX > 0) {
                        directionArr.push(3);
                    }
                    if (dX == 0) {
                        directionArr.push(3);
                    }
                    if (dX < 0) {
                        directionArr.push(4);
                    }
                }
                if (dY == 0) { //中
                    if (dX > 0) {
                        directionArr.push(3);
                    }
                    if (dX == 0) {
                        console.log('success');
                        return false;
                    }
                    if (dX < 0) {
                        directionArr.push(4);
                    }
                }
                if (dY < 0) { //下
                    directionArr.push(2);
                    if (dX > 0) {
                        directionArr.push(3);
                    }
                    if (dX == 0) {
                        directionArr.push(3);
                    }
                    if (dX < 0) {
                        directionArr.push(4);
                    }
                }
            } else {
                if (dX > 0) { //左
                    directionArr.push(3);
                    if (dY > 0) { //上
                        directionArr.push(1);
                        directionArr.push(2);
                    }
                    if (dY == 0) { //中
                        directionArr.push(2);
                        directionArr.push(1);
                    }
                    if (dY < 0) { //下
                        directionArr.push(2);
                        directionArr.push(1);
                    }
                }

                if (dX == 0) { //中
                    if (dY > 0) { //上
                        directionArr.push(1);
                        directionArr.push(3);
                        directionArr.push(2);
                    }
                    if (dY == 0) { //中
                        console.log('success');
                        return false;
                    }
                    if (dY < 0) { //下
                        directionArr.push(2);
                        directionArr.push(3);
                        directionArr.push(1);
                    }
                    directionArr.push(4);
                }

                if (dX < 0) { //右
                    directionArr.push(4);
                    if (dY > 0) { //上
                        directionArr.push(1);
                        directionArr.push(2);
                    }
                    if (dY == 0) { //中
                        directionArr.push(1);
                        directionArr.push(2);
                    }
                    if (dY < 0) { //下
                        directionArr.push(2);
                        directionArr.push(1);
                    }
                }
            }

            var newTarget2 = (child, intersectionInfo, targetPoint, d) => {
                var obstacle = intersectionInfo.obstacle,
                    intersection = intersectionInfo.intersection;
                var target = null;
                // if (child.id == obstacle.id) {
                //     return target;
                // }
                switch (d) {
                    case 1:
                    case 2:
                        var centerX = obstacle.minX + obstacle.maxW / 2;
                        var a = intersection.x - centerX,
                            b = targetPoint.x - centerX;
                        var y = d == 1 ? obstacle.maxY - 1 : obstacle.minY + 1;
                        if (a * b >= 0) { //同侧
                            if (a <= 0) { //往左
                                target = {
                                    x: obstacle.minX - 1,
                                    y: y
                                }
                            } else { //往右
                                target = {
                                    x: obstacle.maxX + 1,
                                    y: y
                                }
                            }
                        } else { //异侧
                            var c = intersection.x - obstacle.minX,
                                d = targetPoint.x - obstacle.minX;
                            if (c + d <= obstacle.maxW) { //往左
                                target = {
                                    x: obstacle.minX - 1,
                                    y: y
                                }
                            } else { //往右
                                target = {
                                    x: obstacle.maxX + 1,
                                    y: y
                                }
                            }
                        }
                        break;
                    case 3:
                    case 4:
                        if (targetPoint.y <= obstacle.maxY && targetPoint.y >= obstacle.minY) {
                            var centerY = obstacle.outPoint.y;
                            var a = intersection.y - centerY,
                                b = targetPoint.y - centerY;
                            var x = d == 3 ? obstacle.maxX - 1 : obstacle.minX + 1;
                            if (a * b >= 0) { //同侧
                                if (a <= 0) { //往上
                                    target = {
                                        x: x,
                                        y: obstacle.minY - 1
                                    }
                                } else { //往下
                                    target = {
                                        x: x,
                                        y: obstacle.maxY + 1
                                    }
                                }
                            } else { //异侧
                                var c = intersection.y - obstacle.maxY,
                                    d = targetPoint.y - obstacle.maxY;
                                if (c + d >= obstacle.maxH) { //往上
                                    target = {
                                        x: x,
                                        y: obstacle.minY - 1
                                    }
                                } else { //往下
                                    target = {
                                        x: x,
                                        y: obstacle.maxY + 1
                                    }
                                }
                            }
                        } else {
                            var a = intersection.y - targetPoint.y;
                            var x = d == 3 ? obstacle.maxX - 1 : obstacle.minX + 1;
                            if (a >= 0) { //往上
                                target = {
                                    x: x,
                                    y: obstacle.minY - 1
                                }
                            } else { //往下
                                target = {
                                    x: x,
                                    y: obstacle.maxY + 1
                                }
                            }
                        }
                        break;
                }

                return target;
            }

            var to = (index) => {
                firstDirection = directionArr[index];
                switch (firstDirection) {
                    case 1:
                        x = firstPoint.x;
                        y = firstPoint.y - Math.min(this.SPAN, dY);
                        break;
                    case 2:
                        x = firstPoint.x;
                        y = firstPoint.y + Math.min(this.SPAN, -dY);
                        break;
                    case 3:
                        y = firstPoint.y;
                        x = firstPoint.x - Math.min(this.SPAN, dX);
                        break;
                    case 4:
                        y = firstPoint.y;
                        x = firstPoint.x + Math.min(this.SPAN, -dX);
                        break;
                }

                lastPoint = {
                    x: x,
                    y: y
                };
                intersectionInfo = this._getIntersection(firstPoint, lastPoint, firstDirection);
                if (intersectionInfo) { //遇到障碍
                    if (!(Math.abs(intersectionInfo.intersection.x - firstPoint.x) == 1 || Math.abs(intersectionInfo.intersection.y - firstPoint.y) == 1)) {
                        lastPoint = intersectionInfo.intersection;
                        switch (firstDirection) {
                            case 1:
                                lastPoint.y += 1;
                                break;
                            case 2:
                                lastPoint.y -= 1;
                                break;
                            case 3:
                                lastPoint.x += 1;
                                break;
                            case 4:
                                lastPoint.x -= 1;
                                break;
                        }
                        return {
                            point: lastPoint,
                            targetPoint: targetPoint
                        };
                    }
                    let aa = newTarget2(child, intersectionInfo, targetPoint, firstDirection);
                    if (aa) { //障碍在挡住目标点
                        return {
                            point: firstPoint,
                            targetPoint: aa,
                            lastDirection: firstDirection
                        };
                    } else {
                        return to((index + 1) % 3);
                    }
                } else if (lastPoint.x == targetPoint.x && lastPoint.y == targetPoint.y) {
                    return {
                        point: lastPoint,
                        targetPoint: block.inPoint
                    };
                } else {
                    return {
                        point: lastPoint,
                        targetPoint: targetPoint
                    };
                }
            }
            return to(0);
        }

        _getIntersection(a, b, direction) {
            var minX, maxX, minY, maxY;
            var newObstacle = [],
                intersectionArr = [],
                intersection = undefined;
            var fin = undefined,
                fn = undefined;

            switch (direction) {
                case 1:
                    minY = b.y;
                    maxY = a.y;
                    fn = function(data) {
                        if (data.intersection.y < fin.y) {
                            fin = data;
                        }
                    };
                    break;
                case 2:
                    minY = a.y;
                    maxY = b.y;
                    fn = function(data) {
                        if (data.intersection.y > fin.y) {
                            fin = data;
                        }
                    };
                    break;
                case 3:
                    minX = b.x;
                    maxX = a.x;
                    fn = function(data) {
                        if (data.intersection.x > fin.x) {
                            fin = data;
                        }
                    };
                    break;
                case 4:
                    minX = a.x;
                    maxX = b.x;
                    fn = function(data) {
                        if (data.intersection.x < fin.x) {
                            fin = data;
                        }
                    };
                    break;
            }

            //筛选出范围内图形
            if (minX !== undefined) {
                newObstacle = this.obstacle.filter((obstacle) => {
                    return !(obstacle.maxX < minX || obstacle.minX > maxX);
                })
            } else {
                newObstacle = this.obstacle.filter((obstacle) => {
                    return !(obstacle.maxY < minY || obstacle.minY > maxY);
                })
            }

            //与范围内所有图形的交点
            newObstacle.forEach((obstacle) => {
                obstacle.points.forEach((point, i, arr) => {
                    intersection = Sketchpad.intersectionByLine(a, b, point, arr[(i + 1) % 4]);
                    intersection && intersectionArr.push({
                        intersection: intersection,
                        obstacle: obstacle
                    });
                });
                // intersection = Sketchpad.segmentsIntr(a, b, {
                //     x: obstacle.minX,
                //     y: obstacle.minY
                // }, {
                //     x: obstacle.maxX,
                //     y: obstacle.minY
                // });
                // intersection && intersectionArr.push({
                //     intersection: intersection,
                //     obstacle: obstacle
                // });
                // intersection = Sketchpad.segmentsIntr(a, b, {
                //     x: obstacle.maxX,
                //     y: obstacle.minY
                // }, {
                //     x: obstacle.maxX,
                //     y: obstacle.maxY
                // });
                // intersection && intersectionArr.push({
                //     intersection: intersection,
                //     obstacle: obstacle
                // });
                // intersection = Sketchpad.segmentsIntr(a, b, {
                //     x: obstacle.maxX,
                //     y: obstacle.maxY
                // }, {
                //     x: obstacle.minX,
                //     y: obstacle.maxY
                // });
                // intersection && intersectionArr.push({
                //     intersection: intersection,
                //     obstacle: obstacle
                // });
                // intersection = Sketchpad.segmentsIntr(a, b, {
                //     x: obstacle.minX,
                //     y: obstacle.maxY
                // }, {
                //     x: obstacle.minX,
                //     y: obstacle.minY
                // });
                // intersection && intersectionArr.push({
                //     intersection: intersection,
                //     obstacle: obstacle
                // });
            });

            //确认最近的交点
            if (intersectionArr.length > 0) {
                fin = intersectionArr[0];
                intersectionArr.forEach(fn);
                return fin;
            } else {
                return false;
            }

        }



        _mergeObstacle() {
            var ids = [];
            var obstacleArr = [];
            var select = (obstacle1) => {
                var arr = [];
                this.obstacle.forEach((obstacle2) => {
                    if (ids.indexOf(obstacle2.id) > -1) {
                        return;
                    }
                    var arr1 = obstacle1.points,
                        arr2 = obstacle2.points;
                    for (let i = 0, len = arr1.length; i < len; i++) {
                        let intersection;
                        for (let l = 0, len = arr2.length; l < len; l++) {
                            intersection = Sketchpad.intersectionByLine(arr1[i], arr1[(i + 1) % 4], arr2[l], arr2[(l + 1) % 4]);
                            if (intersection) {
                                arr.push(obstacle2);
                                ids.push(obstacle2.id);
                                arr = arr.concat(select(obstacle2));
                                break;
                            }
                        }
                        if (intersection) {
                            break;
                        }
                    }

                });
                return arr;
            }
            this.obstacle.forEach((obstacle1) => {
                if (ids.indexOf(obstacle1.id) > -1) {
                    return;
                }
                ids.push(obstacle1.id);
                var obstacleArr = select(obstacle1);
                console.log(obstacleArr.length)
                obstacleArr.push(obstacle1);
                if (obstacleArr.length > 1) {
                    var x = Math.min.apply(this, obstacleArr.map((v) => {
                        return Number(v.opt.x)
                    }));
                    var maxX = Math.max.apply(this, obstacleArr.map((v) => {
                        return Number(v.maxX - v.SPAN);
                    }));
                    var minX = Math.min.apply(this, obstacleArr.map((v) => {
                        return Number(v.minX + v.SPAN);
                    }));
                    var y = Math.min.apply(this, obstacleArr.map((v) => {
                        return Number(v.opt.y)
                    }));
                    var maxY = Math.max.apply(this, obstacleArr.map((v) => {
                        return Number(v.maxY - v.SPAN);
                    }));
                    var minY = Math.min.apply(this, obstacleArr.map((v) => {
                        return Number(v.minY + v.SPAN);
                    }));
                    console.log(maxX - minX, maxY - minY)
                        // parent.append([new Child({
                        //     id: +new Date(),
                        //     x: x,
                        //     y: y,
                        //     w: maxX - minX,
                        //     h: maxY - minY
                        // }, canvas)])
                }

            });
        }
    }

    exports.Index = Sketchpad;
}));

