(function () {

    window.GUtil = {
        DEG: 180 / Math.PI,
        isPointInRect: function (x, y, rx, ry, rw, rh) {
            return x>rx && x<(rx+rw) && y>ry && y<(ry+rh);
        },
        isIntersect: function (a, b) {
            return !(
                b.left > a.right ||
                b.right < a.left ||
                b.top > a.bottom ||
                b.bottom < a.top
            );
        },
        getIntersectionByPoint: function (x, y, shape, metrix, ignoreType) {
            var children, pos;
            var stack = [];
            metrix = metrix || [1, 0, 0, 1, 0, 0];
            ignoreType = typeof ignoreType === 'undefined' ? [] : [ignoreType];
            ignoreType = ['Layer', 'Group'].concat(ignoreType);

            if( Object.prototype.toString.call(shape) === '[object Array]' ) {
                this.sortShapesByZIndex(shape);
                stack = stack.concat(shape);
                shape = stack.pop();
            }

            if(!shape) return null;

            do {

                /** 判断有没有子节点 */
                /** 如果有子节点，则加入栈中进行循环 */
                if( ignoreType.indexOf(shape.getType()) > -1 ) {
                    children = shape.getChildren();
                    // children 数组按照 z-index 排序
                    this.sortShapesByZIndex(children);
                    stack = stack.concat(Array.prototype.slice.call(children));
                    continue;
                }
                
                pos = GUtil.transform(shape, metrix);
                if( this.isPointInRect(x, y, pos.x, pos.y, pos.w, pos.h) ) {
                    return shape;
                }
                
            } while(shape = stack.pop());

            return null;
        },
        getIntersectionByRect: function (x, y, w, h, shape, metrix) {
            var hitShapes = [];
            var children, isHit;
            var stack = [];
            var pos;

            if( Object.prototype.toString.call(shape) === '[object Array]' ) {
                this.sortShapesByZIndex(shape);
                stack = stack.concat(shape);
                shape = stack.pop();
            }

            if(!shape) return [];

            do {
                if(['Layer', 'Group'].indexOf(shape.getType()) > -1) {
                    stack = stack.concat(Array.prototype.slice.call(shape.getChildren()));
                    continue;
                }

                pos = GUtil.transform(shape, metrix);
                isHit = this.isIntersect({
                    left: pos.x,
                    top: pos.y,
                    right: pos.x+pos.w,
                    bottom: pos.y+pos.h
                }, {
                    left: x,
                    top: y,
                    right: x+w,
                    bottom: y+h
                });

                if(isHit) {
                    hitShapes.push(shape);
                }

            } while(shape = stack.pop());

            return hitShapes;
        },
        sortShapesByZIndex: function (shapes) {
            /** Konva 的 Collection 使用 sort 按照 index 排序时会有问题 */
            if(shapes instanceof Konva.Collection) return;
            shapes.sort(function (first, second) {
                return first.getZIndex() > second.getZIndex();
            });
        },
        getPipeRect: function (points) {
            var xMin, xMax, yMin, yMax;

            for (var i = 0, len = points.length; i < len ; i += 2){
                if (typeof xMin === 'undefined' || points[i] < xMin) {
                    xMin = points[i];
                }
                if (typeof xMax === 'undefined' || points[i] > xMax) {
                    xMax = points[i];
                }
            }
            for (var i = 1, len = points.length; i < len ; i += 2){
                if (typeof yMin === 'undefined' || points[i] < yMin) {
                    yMin = points[i];
                }
                if (typeof yMax === 'undefined' || points[i] > yMax) {
                    yMax = points[i];
                }
            }
            return {
                xMin: xMin,
                yMin: yMin,
                xMax: xMax,
                yMax: yMax,
                w: Math.max(xMax - xMin, 10),
                h: Math.max(yMax - yMin, 10)
            }
        },
        /** 坐标转换 */
        transform: function () {
            var x, y, w, h, m, inverse;
            var pos;
            if(arguments.length > 3) {
                x = arguments[0];
                y = arguments[1];
                w = arguments[2];
                h = arguments[3];
                m = arguments[4];
                inverse = arguments[5];
            } else {
                pos = arguments[0].getAbsolutePosition();
                x = pos.x;
                y = pos.y;
                w = arguments[0].width();
                h = arguments[0].height();
                m = arguments[1];
                inverse = arguments[2];
            }

            /** 
             * 处理 width 和 height 为负数的情况
             * width 和 height 为负数是允许存在的
             * width 为负数，相当于做垂直翻转
             * height 为负数，相当于做水平翻转
             */
            if(w < 0) {
                w = Math.abs(w);
                x = x - w;
            }
            if(h < 0) {
                h = Math.abs(h);
                y = y - h;
            }

            return inverse === true ? {
                x: x,
                y: y,
                w: w / m[0],
                h: h / m[3]
            } : {
                x: x,
                y: y,
                w: w * m[0],
                h: h * m[3]
            };
        },
        getDistance: function (p1, p2) {
            var dx = Math.abs(p1.x - p2.x);
            var dy = Math.abs(p1.y - p2.y);

            return Math.sqrt(dx*dx+dy*dy);
        },
        loadImage: function (url, callback) {
            var image = new Image();
            image.src = url;
            image.onload = function () {
                callback(this);
            };
        }
    };
} ());