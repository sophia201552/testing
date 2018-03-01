(function () {

    window.GUtil = {
        DEG: 180 / Math.PI,
        SHADOW_SHAPE_NAME: '__shadowShape',
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
        getIntersection: function (x, y, layer) {
            return layer.getIntersection({
                x: x,
                y: y
            });
        },
        /**
         * 返回给定的点在指定 Html 图层的哪个图形范围中
         * @deprecated html图层和canvas图层进行合并后，此方法不再使用 20160707
         * @param  {Number} x          给定点的横坐标
         * @param  {Number} y          给定点的纵坐标
         * @param  {Array|Object} layer      指定的容器
         * @param  {Array} metrix      当前的转换矩阵，表示当前页面的缩放和偏移量
         * @return {Object} 若不在任何图形中，则返回 null，否则返回找到的图形
         */
        getIntersectionByPointInHtmlLayers: function (x, y, layer, metrix) {
            var children, pos;
            var stack = [];
            metrix = metrix || [1, 0, 0, 1, 0, 0];

            if( Object.prototype.toString.call(layer) === '[object Array]' ) {
                this.sortShapesByZIndex(layer);
                stack = stack.concat(layer);
                layer = stack.pop();
            }

            if(!layer) return null;

            do {
                /** 判断有没有子节点 */
                /** 如果有子节点，则加入栈中进行循环 */
                if( ['Layer', 'Group'].indexOf(layer.getType()) > -1 ) {
                    children = layer.getChildren();
                    // children 数组按照 z-index 排序
                    this.sortShapesByZIndex(children);
                    stack = stack.concat(Array.prototype.slice.call(children));
                    continue;
                }
                
                pos = getShapeRect(layer);
                if( this.isPointInRect(x, y, pos.x, pos.y, pos.w, pos.h) ) {
                    return layer;
                }
                
            } while(layer = stack.pop());

            return null;
        },
        /**
         * 返回给定的点在指定 Canvas 图层的哪个图形范围中
         * @deprecated html图层和canvas图层进行合并后，此方法不再使用 20160707
         * @param  {Number} x          给定点的横坐标
         * @param  {Number} y          给定点的纵坐标
         * @param  {Array|Object} layer      指定的 Factory Canvas 图层对象
         * @return {Object} 若不在任何图形中，则返回 null，否则返回找到的图形
         */
        getIntersectionByPointInCanvasLayers: function (x, y, layer, ignoreType) {
            var layerShape = null;
            var findShape = null;
            var shape = null;
            var stack = [], s;

            ignoreType = typeof ignoreType === 'undefined' ? [] : [ignoreType];
            ignoreType = ['Layer', 'Group'].concat(ignoreType);

            if ( Object.prototype.toString.call(layer) !== '[object Array]' ) {
                layer = [layer];
            }

            // 过滤掉非 canvas 图层
            layer = layer.filter(function (row) {
                return row.getLayerType() === 'canvas';
            });

            // 如果没有找到，则返回 null
            if (layer.length === 0) return null;

            // 获取 Layer 图层
            layerShape = layer[0].shape.getLayer();
            // 在 Layer 图层中查找指定位置有无图形
            // 注意，这里返回的 findShape 是 Konva 对象
            findShape = layerShape.getIntersection({
                x: x,
                y: y
            });

            if (!findShape) return null;

            // 深度搜索
            stack = stack.concat(layer);
            while ( s = stack.pop() ) {
                if (ignoreType.indexOf(s.getType()) > -1 ) {
                    stack = stack.concat(s.children);
                    continue;
                }

                if (s.hasShape(findShape)) {
                    shape = s;
                    break;
                }
            }

            return shape;
        },
        /**
         * 返回给定的点在指定图层的哪个图形范围中
         */
        getIntersectionByPoint: function (x, y, canvasLayer, rootLayer, ignoreType) {
            var layerShape = null;
            var shape = null;
            var stack = [], s;

            ignoreType = ignoreType || [];

            // 获取 canvas 图层对应的 Konva 图层对象
            layerShape = canvasLayer.getShape().getLayer();
            // 在 canvas 图层中查找指定位置有无图形
            // 注意，这里返回的 shape 是 Konva 对象
            shape = layerShape.getIntersection({
                x: x,
                y: y
            });

            if (!shape) return null;

            // 深度搜索
            rootLayer.getWidgets(true).some(function (row) {
                if (ignoreType.indexOf(row.getType()) > -1) {
                    return false;
                }
                if (row.hasShape(shape)) {
                    shape = row;
                    return true;
                }
            });
            return shape;
        },
        getIntersectionByRect: function (x, y, w, h, rootLayer) {
            var hitShapes = [];
            var isHit;
            var stack = [];
            var pos;
            var shape;
            var point, p1, p2;

            if(!rootLayer) return [];

            stack = rootLayer.getWidgets(true).filter(function (row) {
                return row.isVisible();
            });
            
            while (shape = stack.pop()) {
                pos = this.getShapeRect(shape);
                if (shape.store.model.type() === 'CanvasPipe' || shape.store.model.type() === 'CanvasCustomLine') {
                    point = shape.store.model['option.points']();
                    //坐标转换
                    p1 = point[0];
                    p2 = point[1];
                    //判断线和方形有无重合：先判断线和四边有无交叉，有则有重合，无则判断线的一端点是否在方形内，是则有重合，否则无重合。
                    isHit = this.getIntersectionByLine(p1, p2, {
                        x: x,
                        y: y,
                        w: w,
                        h: h
                    });
                } else if (shape.store.model.type() === 'CanvasHeat'||shape.store.model.type() === 'CanvasPolygon') {
                    var point = (function (points) {
                        var arr = [];
                        for (var i = 0, len = points.length; i < len; i += 2) {
                            arr.push({
                                x: points[i],
                                y: points[i + 1]
                            })
                        }
                        return arr;
                    })(shape.store.model['option.points']());
                    
                    for (var i = 0, len = point.length; i < len; i++) {
                        //坐标转换
                        var p1 = point[i%(len)],
                            p2 = point[(i+1)%(len)];
                        //判断线和方形有无重合：先判断线和四边有无交叉，有则有重合，无则判断线的一端点是否在方形内，是则有重合，否则无重合。
                        isHit = this.getIntersectionByLine(p1, p2, {
                            x: x,
                            y: y,
                            w: w,
                            h: h
                        });
                        if (isHit) {
                            break;
                        }
                    }
                } else {
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
                }
                

                if(isHit) {
                    hitShapes.push(shape);
                }
            }

            return hitShapes;
        },
        // 判断线和方形4边是否相交
        getIntersectionByLine: (function () {
            // 获取 v1 向量到 v2 向量，是顺时针，还是逆时针
            // 返回值大于0为逆时针
            // 返回值小于0为顺时针
            function getDirection(v1, v2) {
                return v1.x * v2.y - v1.y * v2.x;
            }

            return function (p1, p2, rect) {
                //方形4端点
                var rectPoints = [{
                    x:rect.x,
                    y:rect.y
                }, {
                    x:rect.x+rect.w,
                    y:rect.y
                }, {
                    x:rect.x+rect.w,
                    y:rect.y+rect.h
                }, {
                    x:rect.x,
                    y:rect.y+rect.h
                }];

                //取方形四边与线比较 判断有无交叉
                for (var i = 0; i < 4; i++) {
                    var p3 = rectPoints[i],
                        p4 = rectPoints[(i+1)%4];
                    //以两条线的一端点各取3条向量
                    var vector12 = { x: p2.x - p1.x, y: p2.y - p1.y },
                        vector13 = { x: p3.x - p1.x, y: p3.y - p1.y },
                        vector14 = { x: p4.x - p1.x, y: p4.y - p1.y };

                    var vector34 = { x: p4.x - p3.x, y: p4.y - p3.y },
                        vector31 = { x: p1.x - p3.x, y: p1.y - p3.y },
                        vector32 = { x: p2.x - p3.x, y: p2.y - p3.y };

                    if ( getDirection(vector12, vector13) * getDirection(vector12, vector14) < 0 && 
                        getDirection(vector34, vector31) * getDirection(vector34 , vector32) < 0) {
                        return true;
                    }
                }

                // 在这里处理线段在矩形内部的情况
                // 这里只要判断一个点即可
                if ( p1.x > rect.x && p1.x < (rect.x + rect.w) && 
                    p1.y > rect.y && p1.y < (rect.y + rect.h)) {
                    return true;
                }

                return false;
            };
        } ()),

        sortShapesByZIndex: function (shapes) {
            /** Konva 的 Collection 使用 sort 按照 index 排序时会有问题 */
            if(shapes instanceof Konva.Collection) return;
            shapes.sort(function (first, second) {
                return first.getZIndex() > second.getZIndex();
            });
        },
        getPipeRect: function (points) {
            var xMin, xMax, yMin, yMax;
            var pArr = [];
            
            // 先进行一次格式转换
            points.forEach(function (row) {
                if (typeof row !== 'number') {
                    pArr.push(row.x);
                    pArr.push(row.y);
                    return;
                }
                pArr.push(row);
            });

            for (var i = 0, len = pArr.length; i < len ; i += 2){
                if (typeof xMin === 'undefined' || pArr[i] < xMin) {
                    xMin = pArr[i];
                }
                if (typeof xMax === 'undefined' || pArr[i] > xMax) {
                    xMax = pArr[i];
                }
            }
            for (var i = 1, len = pArr.length; i < len ; i += 2){
                if (typeof yMin === 'undefined' || pArr[i] < yMin) {
                    yMin = pArr[i];
                }
                if (typeof yMax === 'undefined' || pArr[i] > yMax) {
                    yMax = pArr[i];
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
        /**
         * 计算点 p3 在线段 (p1, p2) 上的投影
         * 额外规则：若最终计算出的投影点 p0 在线段 (p1, p2) 之外，
         * 则返回超出方向的最大点（在这里为 p1 或 p2）
         * 计算公式
         * y = ((x2-x1)(y2-y1)(x3-x1)+(y2-y1)(y2-y1)y3+(x2-x1)(x2-x1)y1) / ((x2-x1)(x2-x1)+(y2-y1)(y2-y1))
         * x = x3 - (y2-y1)(y-y3)/(x2-x1);
         * 计算公式由算法组-张文博提供，感谢文博
         * @param  {Array} p1 线段的一个端点
         * @param  {Array} p2 线段的另一个端点
         * @param  {Array} p3 线段外一点
         * @return {Array}    投影点
         */
        getPointProjectionOnLine: function (p1, p2, p3) {
            // p[0]
            var x;
            // p[1]
            var y;
            // x2 - x1
            var a;
            // a * a
            var a2;
            // y2 - y1
            var b;
            // b * b
            var b2;
            // 是否在矩形内
            var isInRect = false;

            // 如果 x2 等于 x1，则说明 (p1, p2) 垂直于 x 轴，斜率不存在
            // 这里可以之间换算出结果
            if (p1[0] === p2[0]) {
                x = p1[0];
                y = p3[1];
            } else {
                a = p2[0] - p1[0];
                a2 = a * a;
                b = p2[1] - p1[1];
                b2 = b * b;
                // 直接套公式
                y = (a*b*(p3[0]-p1[0])+b2*p3[1]+a2*p1[1]) / (a2+b2);
                x = p3[0] - b*(y-p3[1]) / a;
            }

            // 处理投影不在线段上的情况
            if (p1[0] < p2[0]) {
                if (x < p1[0]) {
                    x = p1[0];
                    y = p1[1];
                } else if (x > p2[0]) {
                    x = p2[0];
                    y = p2[1];
                }
            } else {
                if (x < p2[0]) {
                    x = p2[0];
                    y = p2[1];
                } else if (x > p1[0]) {
                    x = p1[0];
                    y = p1[1];
                }
            }

            return {
                x: x,
                y: y
            };
        },
        getShapeRect: function (shape) {
            var pos = shape.position();

            return {
                x: pos.x,
                y: pos.y,
                w: shape.width(),
                h: shape.height()
            };
        },
        loadImage: (function () {
            var cacheMap = {};

            return function (url, callback, crossOrigin) {
                var image = new Image();

                // 如果缓存中有该图片，则无需重新加载
                if (cacheMap[url]) {
                    cacheMap[url].done(callback);
                    return;
                }

                cacheMap[url] = $.Deferred();
                cacheMap[url].done(callback);

                if (crossOrigin) {
                    image.crossOrigin = crossOrigin;
                }
                image.src = url;
                image.onload = function () {
                    cacheMap[url].resolve(this)
                };
            };
        }())
    };
} ());