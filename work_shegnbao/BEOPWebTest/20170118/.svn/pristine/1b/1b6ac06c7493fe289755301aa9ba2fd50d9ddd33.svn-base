;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.components.Painter.Calculation'), function(exports) {

    class SketchpadChild {
        //作为block 有输入参数children  输出参数parents 画板 parent
        //作为输入参数 有目标容器parent 有出线line
        //作为输出参数 有接收容器child 有入线inLine
        constructor(opt, type = 'modular', parentId = '') {
            this.opt = opt;
            this.id = opt['_id'] || parentId;
            this.type = type; //类型(策略模板/输入参数/输出参数)
            this.parents = []; //输出参数
            this.parent = undefined; //策略模板(作为输入参数)
            this.children = []; //输入参数
            this.child = undefined; //策略模板(作为输出参数)
            this.sketchpad = undefined; //控制器
            this.line = []; //线(作为输入参数)
            this.inLine = []; //线(作为输出参数)
            this.lineSegment = [];
            this.PADDING = 10; //块与线之间的padding
            this.inPoint = undefined; //输入点
            this.outPoint = undefined; //输出点
            this.points = []; //块的4角(包含padding)
            this.pointsWithoutPadding = []; //块的4角(不包含padding)
            this.minX = undefined; //(包含padding)
            this.maxX = undefined; //(包含padding)
            this.minY = undefined; //(包含padding)
            this.maxY = undefined; //(包含padding)
            this.maxW = undefined; //(包含padding)
            this.maxH = undefined; //(包含padding)
            this.init();
        }

        init() {
            this._createInfo();
        }

        add(cognateBlock) {
            switch (this.type) {
                case 'output':
                    this.setChild(cognateBlock);
                    cognateBlock.addParents(this);
                    break;
                case 'input':
                    this.setParent(cognateBlock);
                    cognateBlock.addChildren(this);
                    break;
            }
        }

        repaint() {
            this.sketchpad.repaint();
        }

        setSketchpad(sketchpad) {
            this.sketchpad = sketchpad;
        }

        addParents(parents) {
            let ids = new Set(this.parents.map((parent) => { return parent.id }));
            if (!ids.has(parents.id)) {
                this.parents.push(parents);
            }
        }

        setParent(parent) {
            this.parent = parent;
        }

        addChildren(children) {
            let ids = new Set(this.children.map((child) => { return child.id }));
            if (!ids.has(children.id)) {
                this.children.push(children);
            }
        }

        findById(id) {
            var result;
            this.children.forEach(child => {
                if (child.id == id) {
                    result = child;
                }
            });
            this.parents.forEach(parent => {
                if (parent.id == id) {
                    result = parent;
                }
            });
            return result;
        }

        setChild(child) {
            this.child = child;
        }

        getAllLines() {
            return this.sketchpad.getAllLines();
        }

        remove() {
            this.sketchpad.remove(this.id, this.type);
        }

        destroy() {
            let block = this;
            switch (block.type) {
                case 'input':
                    break;
                case 'output':
                    break;
                case 'modular':
                    //输入点有可能作为其他模块的输出点存在  故删除parent引用
                    block.children.forEach(child => {
                        child.setParent();
                    });
                    let outputNames = block.parents.map((output) => {
                        return output.opt.name;
                    });
                    outputNames.forEach((outputName) => {
                        let inputs = this.sketchpad.find('opt.name', outputName);
                        inputs.forEach((input) => {
                            if (input.child && input.child.id == block.id) {
                                let i = input.parent.children.findIndex((child) => {
                                    return child.id == input.id;
                                });
                                input.parent.children.splice(i, 1);
                            }
                        });
                    });
                    break;
            }
        }

        toBeInput(parentId) {
            let parent = this.sketchpad.findBlockById(parentId);
            this.setParent(parent);
            parent.addChildren(this);
        }

        updateInfo() {
            this._createInfo();
            this.repaint();
        }

        _createInfo() {
            let opt = this.opt,
                minX = opt.loc.x - this.PADDING,
                maxX = opt.loc.x + opt.loc.w + this.PADDING,
                minY = opt.loc.y - this.PADDING,
                maxY = opt.loc.y + opt.loc.h + this.PADDING;

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
            this.pointsWithoutPadding = [{ //顺时针方向
                x: opt.loc.x,
                y: opt.loc.y
            }, {
                x: opt.loc.x + opt.loc.w,
                y: opt.loc.y
            }, {
                x: opt.loc.x + opt.loc.w,
                y: opt.loc.y + opt.loc.h
            }, {
                x: opt.loc.x,
                y: opt.loc.y + opt.loc.h
            }];
            this.inPoint = {
                x: minX - 1,
                y: opt.loc.y + opt.loc.h / 2
            };
            this.outPoint = {
                x: maxX + 1,
                y: opt.loc.y + opt.loc.h / 2
            };
        }
    }

    class Sketchpad {
        constructor(props) {
            this.WIDTH = props.width;
            this.HEIGHT = props.height;
            this.blocks = []; //策略模块集合
            this.inputs = [];
            this.outputs = [];
            this.blockIds = new Set();
            this.lines = []; //画板上的所有线
            this.obstacle = []; //画板上的所有障碍物
            this.PADDING = 10; //块与线之间的padding
            this.INPUTWIDTH = 132;
            this.INPUTHEIGHT = 50;
            this.maxStep = 1000;
            this.tools = {
                intersectionByLine: Sketchpad.intersectionByLine,
                intersectionByRect: Sketchpad.intersectionByRect,
                intersectionByPoint: Sketchpad.intersectionByPoint,
                rectToPoints: Sketchpad.rectToPoints
            };
            this.init();
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

        static blockAndBlock(block, blocks = [], isDeep = false) {
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

        static intersectionByRect(points = [], blocks = []) { //块与块是否有交点
            var finArr = [];
            blocks.forEach((block) => {
                var tag = false;
                points.forEach((point) => {
                    if (tag) {
                        return;
                    }
                    var hasIntersection = Sketchpad.intersectionByPoint(point, block);
                    if (hasIntersection) {
                        tag = true;
                    }
                });
                if (tag) {
                    finArr.push(block);
                    return;
                }

                block.points.forEach((point) => {
                    if (tag) {
                        return;
                    }
                    var hasIntersection = Sketchpad.intersectionByPoint(point, { points: points });
                    if (hasIntersection) {
                        tag = true;
                    }
                });
                if (tag) {
                    finArr.push(block);
                    return;
                }

                block.points.forEach((point2, l, arr2) => {
                    if (tag) {
                        return;
                    }
                    points.forEach((point1, i, arr1) => {
                        if (tag) {
                            return;
                        }
                        var hasIntersection = Sketchpad.intersectionByLine(arr1[i], arr1[(i + 1) % 4], arr2[l], arr2[(l + 1) % 4]);
                        if (hasIntersection) {
                            tag = true;
                        }
                    })

                });
                if (tag) {
                    finArr.push(block);
                    return;
                }
            });

            return finArr;
        }

        static intersectionByPoint(point, block) { //块与点是否有交点
            var xArr = block.points.map(point => point.x),
                yArr = block.points.map(point => point.y);
            var maxX = Math.max(...xArr),
                minX = Math.min(...xArr),
                maxY = Math.max(...yArr),
                minY = Math.min(...yArr);
            if (point.x <= maxX && point.x >= minX && point.y >= minY && point.y <= maxY) {
                return true;
            } else {
                return false;
            }
        }

        static rectToPoints(x, y, w, h) { //块的xywh转四角坐标
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

        intersectionByPoint(point, block) {
            return Sketchpad.intersectionByPoint(point, block);
        }

        init() {
            // this._createStage();
        }

        clear() {
            this.blocks = []; //策略模块集合
            this.inputs = [];
            this.outputs = [];
            this.blockIds = new Set();
            this.lines = []; //画板上的所有线
            this.obstacle = []; //画板上的所有障碍物
            this.maxStep = 1000;
            // this.HEIGHT = undefined; //画板高度
            // this.WIDTH = undefined; //画板宽度
            this.init();
        }

        resize(props) {
            // this.clear();
            this.WIDTH = parseFloat(props.width);
            this.HEIGHT = parseFloat(props.height);
            this.maxStep = (this.WIDTH + this.HEIGHT) / this.PADDING * 2;
        }

        add(blocks = []) { //添加画板元素
            if (!(blocks instanceof Array)) {
                blocks = [blocks];
            }
            blocks.forEach((block) => {
                let cognateId = block['id'].split('_')[1];
                let cognateBlock;
                if (cognateId != undefined) { //判断是否是输入参数或输出参数
                    cognateBlock = this.findBlockById(cognateId);
                    block.add(cognateBlock);
                } else {
                    block.setParent(this);
                    this._addBlock(block);
                }
                block.setSketchpad(this);
            });

            this.repaint();
            return this.lines;
        }
        repaint() { //重新计算
            this._createObstacle();
            this.lines = this._paintLine();
        }

        findBlockById(id, blocks) { //根据id查找策略模板
            let result = undefined;
            blocks = blocks || this.blocks;
            blocks.forEach((block) => {
                if (block.id == id) {
                    result = block;
                }
            });
            return result;
        }

        findBlockIndexById(id, blocks) { //根据id查找策略模板在数组中的index
            let index = undefined;
            blocks = blocks || this.blocks;
            blocks.forEach((block, i) => {
                if (block.id == id) {
                    index = i;
                }
            });
            return index;
        }

        find(...arg) {
            let selects;
            switch (arg.length) {
                case 1:
                    selects = arg[0];
                    break;
                case 2:
                    selects = {
                        [arg[0]]: arg[1]
                    };
                    break;
                default:
                    return;
            }
            let result = [];
            let space = (obj, path) => {
                path = path.split('.');
                for (let i = 0, len = path.length; i < len; i++) {
                    let p = path[i].trim();
                    obj = obj[p];
                    if (!obj) {
                        return;
                    }
                }
                return obj;
            }

            let verification = (block) => {
                for (let k in selects) {
                    if (space(block, k) !== selects[k]) {
                        return;
                    }
                }
                result.push(block);
            }

            this.blocks.forEach((block) => {
                verification(block);
                block.children.forEach((input) => {
                    verification(input);
                });
                block.parents.forEach((output) => {
                    verification(output);
                });
            });
            return result;
        }

        getAllLines() {
            return this.lines;
        }

        remove(id, type = 'modular') { //根据id删除策略模板
            let index, block;
            switch (type) {
                case 'input':
                    this.blocks.forEach(b => {
                        let target = b.findById(id);
                        if (target) {
                            index = this.findBlockIndexById(id, b.children);
                            block = b.children.splice(index, 1)[0];
                        }
                    });
                    break;
                case 'output':
                    break;
                case 'modular':
                    index = this.findBlockIndexById(id);
                    block = this.blocks.splice(index, 1)[0];
                    break;
            };
            if (block) {
                block.destroy();
                this.repaint();
            }
        }

        createSortInfo(block, num = 0, type = 'input') {
            if (num == 0) {
                return [];
            }
            let _this = this;
            let intersection; //交点
            let W = _this.INPUTWIDTH + 2 * _this.PADDING, //输入/输出参数的宽(包含padding)
                H = _this.INPUTHEIGHT + 2 * _this.PADDING, //输入/输出参数的高(包含padding)
                MINSPAN = _this.PADDING, //块与块之间排列的间隔
                MAXSPAN = (num - 1) * MINSPAN,
                maxW = W + MINSPAN,
                maxH = H + MINSPAN;
            let w, h, x, y, points;
            let funArr;
            switch (type) {
                case 'input':
                    funArr = [left, top, botton, right];
                    break;
                case 'output':
                    funArr = [right, botton, left, top];
                    break;
            }
            //子级排列优先级
            for (let i = 0; i < 4; i++) {
                let infoArr = funArr[i](1);
                if (infoArr) {
                    return infoArr;
                }
            }
            return [];

            function left(span) {
                if (block.minX > maxW + span) {
                    w = maxW;
                    h = num * H + MAXSPAN;
                    x = block.minX - span;
                    y = block.minY - (h - block.maxH) / 2;
                    y = Math.min(Math.max(0, y), (_this.HEIGHT - h));
                    points = Sketchpad.rectToPoints(x, y, w, h);
                    intersection = Sketchpad.intersectionByRect(points, _this.obstacle);
                    y = y + _this.PADDING;
                    if (intersection.length < 1) {
                        let finArr = [];
                        for (let i = 0; i < num; i++) {
                            finArr.push({ x: x, y: y + i * maxH, w: _this.INPUTWIDTH, h: _this.INPUTHEIGHT });
                        }
                        return finArr;
                    } else {
                        return left(span + 1);
                    }
                } else {
                    return false;
                }
            }

            function top(span) {
                if (block.minY > maxH + span) {
                    w = num * W + MAXSPAN;
                    h = maxH;
                    x = block.minX - (w - block.maxW) / 2;
                    y = block.minY - span;
                    x = Math.min(Math.max(0, x), (_this.WIDTH - w));
                    points = Sketchpad.rectToPoints(x, y, w, h);
                    intersection = Sketchpad.intersectionByRect(points, _this.obstacle);
                    x = x + _this.PADDING;
                    if (intersection.length < 1) {
                        let finArr = [];
                        for (let i = 0; i < num; i++) {
                            finArr.push({ x: x + i * maxW, y: y, w: _this.INPUTWIDTH, h: _this.INPUTHEIGHT });
                        }
                        return finArr;
                    } else {
                        return top(span + 1);
                    }
                } else {
                    return false;
                }
            }

            function botton(span) {
                if (_this.HEIGHT > block.maxY + maxH + span) {
                    w = num * W + MAXSPAN;
                    h = maxH;
                    x = block.minX - (w - block.maxW) / 2;
                    y = block.maxY + span;
                    x = Math.min(Math.max(0, x), (_this.WIDTH - w));
                    points = Sketchpad.rectToPoints(x, y, w, h);
                    intersection = Sketchpad.intersectionByRect(points, _this.obstacle);
                    x = x + _this.PADDING;
                    y = y + _this.PADDING * 3;
                    if (intersection.length < 1) {
                        for (let i = 0; i < num; i++) {
                            let finArr = [];
                            for (let i = 0; i < num; i++) {
                                finArr.push({ x: x + i * maxW, y: y, w: _this.INPUTWIDTH, h: _this.INPUTHEIGHT });
                            }
                            return finArr;
                        }
                        return true;
                    } else {
                        return botton(span + 1);
                    }
                } else {
                    return false;
                }
            }

            function right(span) {
                if (_this.WIDTH > block.maxX + maxW + span) {
                    w = maxW;
                    h = num * H + MAXSPAN;
                    x = block.maxX + span;
                    y = block.minY - (h - block.maxH) / 2;
                    y = Math.min(Math.max(0, y), (_this.HEIGHT - h));
                    points = Sketchpad.rectToPoints(x, y, w, h);
                    intersection = Sketchpad.intersectionByRect(points, _this.obstacle);
                    x = x + _this.PADDING * 3;
                    y = y + _this.PADDING;
                    if (intersection.length < 1) {
                        let finArr = [];
                        for (let i = 0; i < num; i++) {
                            finArr.push({ x: x, y: y + i * maxH, w: _this.INPUTWIDTH, h: _this.INPUTHEIGHT });
                        }
                        return finArr;
                    } else {
                        return right(span + 1);
                    }
                } else {
                    return false;
                }
            }
        }

        _addBlock(block) { //添加策略模板
            if (!this.blockIds.has(block.id)) {
                this.blocks.push(block);
                this.blockIds.add(block.id);
            }
        }

        // _createStage() { //计算容器大小
        //     let $container = $(this.container);
        //     this.WIDTH = $container.width();
        //     this.HEIGHT = $container.height();
        // }

        _createObstacle() { //创建障碍物
            let obstacle = [];
            let inputs = [];
            let outputs = [];
            let create = function(blocks) {
                blocks.forEach((block) => {
                    obstacle.push(block);
                    if (block.children) {
                        inputs = inputs.concat(block.children);
                        create(block.children); //添加输入参数
                    }
                    if (block.parents) {
                        outputs = outputs.concat(block.parents);
                        create(block.parents); //添加输出参数
                    }
                });
            };
            create(this.blocks); //添加策略模板
            this.obstacle = obstacle;
            this.outputs = outputs;
            this.inputs = inputs;
        }

        _paintLine() {
            this.count = 0;
            var colors = this._getColors();
            var arr1 = [];
            this.blocks.forEach((block, i) => {
                let arr2 = [];
                let color = "rgb(" + colors[i].toString() + ")";
                //输入参数的线
                block.children.forEach((child, index) => {
                    child.line = [{ //起始点
                        point: child.outPoint,
                        targetPoint: block.inPoint
                    }];
                    for (let i = 0; i < child.line.length; i++) {
                        var data = this._step(child.line[i], block, block.inPoint);
                        if (data && (data.point.x !== block.inPoint.x || data.point.y != block.inPoint.y)) {
                            child.line.push(data);
                        } else {
                            child.line.push({
                                point: block.inPoint,
                                targetPoint: undefined
                            });
                            break;
                        }
                        if (i > this.maxStep) { //出错 防止死循环
                            // child.line.push({
                            //     point: block.inPoint,
                            //     targetPoint: undefined
                            // });
                            console.log('遮挡');
                            // this._clearLine();
                            child.line = [];
                        }
                    }
                    child.line.length > 0 && child.line.unshift({ //出口
                        point: {
                            x: child.opt.loc.x + child.opt.loc.w,
                            y: child.opt.loc.y + child.opt.loc.h / 2
                        },
                        targetPoint: child.outPoint
                    })
                    var points = [];
                    child.line.forEach((v) => {
                        points.push(v.point.x, v.point.y);
                    });
                    points.length > 0 && points.push(block.opt.loc.x - 1, block.opt.loc.y + block.opt.loc.h / 2); //入口
                    arr2.push({ id: 'inline_' + child.id, points: points });
                });

                var lineLength = arr2.length;
                if (arr2.length > 0) {
                    //箭头
                    var p = arr2[arr2.length - 1].points
                    arr2.push({ id: 'line_' + block.id + '_end', points: [block.inPoint.x + this.PADDING / 2, block.inPoint.y - this.PADDING / 2, block.inPoint.x + this.PADDING - 1, block.inPoint.y, block.inPoint.x + this.PADDING / 2, block.inPoint.y + this.PADDING / 2] });
                }


                //输出参数的线
                block.parents.forEach((parent, index) => {
                    parent.inLine = [{
                        point: parent.inPoint,
                        targetPoint: block.outPoint
                    }];
                    for (let i = 0; i < parent.inLine.length; i++) {
                        var data = this._step(parent.inLine[i], block, block.outPoint);
                        if (data && (data.point.x !== block.outPoint.x || data.point.y != block.outPoint.y)) {
                            parent.inLine.push(data);
                        } else {
                            parent.inLine.push({
                                point: block.outPoint,
                                targetPoint: undefined
                            });
                            break;
                        }
                        if (i > this.maxStep) { //出错 防止死循环
                            // child.line.push({
                            //     point: block.inPoint,
                            //     targetPoint: undefined
                            // });
                            console.log('遮挡');
                            // this._clearLine();
                            parent.inLine = [];
                        }
                    }
                    parent.inLine.length > 0 && parent.inLine.unshift({ //入口
                        point: {
                            x: parent.opt.loc.x - 1,
                            y: parent.opt.loc.y + parent.opt.loc.h / 2
                        },
                        targetPoint: parent.inPoint
                    })
                    var points = [];
                    parent.inLine.forEach((v) => {
                        points.push(v.point.x, v.point.y);
                    });
                    if (points.length > 0) {
                        points.push(block.opt.loc.x + block.opt.loc.w + 1, block.opt.loc.y + block.opt.loc.h / 2); //出口
                        points.unshift(parent.inPoint.x + this.PADDING / 2, parent.inPoint.y - this.PADDING / 2, parent.inPoint.x + this.PADDING - 1, parent.inPoint.y, parent.inPoint.x + this.PADDING / 2, parent.inPoint.y + this.PADDING / 2);
                    }

                    arr2.push({ id: 'outline_' + parent.id, points: points });
                });


                arr1.push({ id: block.id, color: color, lines: arr2 });

            });
            return arr1;
        }

        _getDirectionArr(directionArr, lastDirection, dX, dY) { //确认方向
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
            return true;
        }

        _step(data, block, finTarget) {
            var x = undefined,
                y = undefined;
            var firstPoint = data.point,
                lastPoint = undefined,
                targetPoint = data.targetPoint;
            var dX = firstPoint.x - targetPoint.x,
                dY = firstPoint.y - targetPoint.y;
            var intersectionInfo = undefined, //交点信息
                directionArr = [], //方向
                tempDirection = [],
                firstDirection = undefined, //第一牵引方向
                lastDirection = data.lastDirection; //上一次牵引方向

            if (this._getDirectionArr(directionArr, lastDirection, dX, dY) == false) {
                return false;
            }

            var newTarget = (intersectionInfo, targetPoint, d) => {
                // console.log(d);
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
                            if (a >= 0) { //往左
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
                            if (c + d >= obstacle.maxW) { //往左
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
                            } else { //异侧
                                var c = intersection.y - obstacle.maxY,
                                    d = targetPoint.y - obstacle.maxY;
                                if (c + d <= obstacle.maxH) { //往上
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
                        }
                        break;
                }

                return target;
            }

            var newTarget2 = (intersectionInfo, targetPoint, d) => {
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
                        y = firstPoint.y - Math.min(this.PADDING, dY);
                        break;
                    case 2:
                        x = firstPoint.x;
                        y = firstPoint.y + Math.min(this.PADDING, -dY);
                        break;
                    case 3:
                        y = firstPoint.y;
                        x = firstPoint.x - Math.min(this.PADDING, dX);
                        break;
                    case 4:
                        y = firstPoint.y;
                        x = firstPoint.x + Math.min(this.PADDING, -dX);
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
                        this.count = 0;
                        return {
                            point: lastPoint,
                            targetPoint: targetPoint
                        };
                    }
                    let aa = newTarget2(intersectionInfo, targetPoint, firstDirection);
                    // if (this.count > 0) {
                    //     aa = newTarget(intersectionInfo, targetPoint, firstDirection);
                    // } else {
                    //     aa = newTarget2(intersectionInfo, targetPoint, firstDirection);
                    // }
                    if (aa) { //障碍在挡住目标点
                        this.count++;
                        return {
                            point: firstPoint,
                            targetPoint: aa,
                            lastDirection: firstDirection
                        };
                    } else {
                        return to((index + 1) % 3);
                    }
                } else if (lastPoint.x == targetPoint.x && lastPoint.y == targetPoint.y) {
                    this.count = 0;
                    return {
                        point: lastPoint,
                        targetPoint: finTarget
                    };
                } else {
                    this.count = 0;
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

        _getColors() {
            var COLORS = {
                black: [0, 0, 0],
                blue: [0, 0, 255],
                blueviolet: [138, 43, 226],
                brown: [165, 42, 42],
                burlywood: [222, 184, 135],
                cadetblue: [95, 158, 160],
                chartreuse: [127, 255, 0],
                chocolate: [210, 105, 30],
                coral: [255, 127, 80],
                cornflowerblue: [100, 149, 237],
                cornsilk: [255, 248, 220],
                crimson: [220, 20, 60],
                cyan: [0, 255, 255],
                darkblue: [0, 0, 139],
                darkcyan: [0, 139, 139],
                darkgoldenrod: [184, 132, 11],
                darkgray: [169, 169, 169],
                darkgreen: [0, 100, 0],
                darkgrey: [169, 169, 169],
                darkkhaki: [189, 183, 107],
                darkmagenta: [139, 0, 139],
                darkolivegreen: [85, 107, 47],
                darkorange: [255, 140, 0],
                darkorchid: [153, 50, 204],
                darkred: [139, 0, 0],
                darksalmon: [233, 150, 122],
                darkseagreen: [143, 188, 143],
                darkslateblue: [72, 61, 139],
                darkslategray: [47, 79, 79],
                darkslategrey: [47, 79, 79],
                darkturquoise: [0, 206, 209],
                darkviolet: [148, 0, 211],
                deeppink: [255, 20, 147],
                deepskyblue: [0, 191, 255],
                dimgray: [105, 105, 105],
                dimgrey: [105, 105, 105],
                dodgerblue: [30, 144, 255],
                firebrick: [178, 34, 34],
                floralwhite: [255, 255, 240],
                forestgreen: [34, 139, 34],
                fuchsia: [255, 0, 255],
                gainsboro: [220, 220, 220],
                ghostwhite: [248, 248, 255],
                gold: [255, 215, 0],
                goldenrod: [218, 165, 32],
                gray: [128, 128, 128],
                green: [0, 128, 0],
                greenyellow: [173, 255, 47],
                grey: [128, 128, 128],
                honeydew: [240, 255, 240],
                hotpink: [255, 105, 180],
                indianred: [205, 92, 92],
                indigo: [75, 0, 130],
                ivory: [255, 255, 240],
                khaki: [240, 230, 140],
                lavender: [230, 230, 250],
                lavenderblush: [255, 240, 245],
                lawngreen: [124, 252, 0],
                lemonchiffon: [255, 250, 205],
                lightblue: [173, 216, 230],
                lightcoral: [240, 128, 128],
                lightcyan: [224, 255, 255],
                lightgoldenrodyellow: [250, 250, 210],
                lightgray: [211, 211, 211],
                lightgreen: [144, 238, 144],
                lightgrey: [211, 211, 211],
                lightpink: [255, 182, 193],
                lightsalmon: [255, 160, 122],
                lightseagreen: [32, 178, 170],
                lightskyblue: [135, 206, 250],
                lightslategray: [119, 136, 153],
                lightslategrey: [119, 136, 153],
                lightsteelblue: [176, 196, 222],
                lightyellow: [255, 255, 224],
                lime: [0, 255, 0],
                limegreen: [50, 205, 50],
                linen: [250, 240, 230],
                magenta: [255, 0, 255],
                maroon: [128, 0, 0],
                mediumaquamarine: [102, 205, 170],
                mediumblue: [0, 0, 205],
                mediumorchid: [186, 85, 211],
                mediumpurple: [147, 112, 219],
                mediumseagreen: [60, 179, 113],
                mediumslateblue: [123, 104, 238],
                mediumspringgreen: [0, 250, 154],
                mediumturquoise: [72, 209, 204],
                mediumvioletred: [199, 21, 133],
                midnightblue: [25, 25, 112],
                mintcream: [245, 255, 250],
                mistyrose: [255, 228, 225],
                moccasin: [255, 228, 181],
                navajowhite: [255, 222, 173],
                navy: [0, 0, 128],
                oldlace: [253, 245, 230],
                olive: [128, 128, 0],
                olivedrab: [107, 142, 35],
                orange: [255, 165, 0],
                orangered: [255, 69, 0],
                orchid: [218, 112, 214],
                palegoldenrod: [238, 232, 170],
                palegreen: [152, 251, 152],
                paleturquoise: [175, 238, 238],
                palevioletred: [219, 112, 147],
                papayawhip: [255, 239, 213],
                peachpuff: [255, 218, 185],
                peru: [205, 133, 63],
                pink: [255, 192, 203],
                plum: [221, 160, 203],
                powderblue: [176, 224, 230],
                purple: [128, 0, 128],
                rebeccapurple: [102, 51, 153],
                red: [255, 0, 0],
                rosybrown: [188, 143, 143],
                royalblue: [65, 105, 225],
                saddlebrown: [139, 69, 19],
                salmon: [250, 128, 114],
                sandybrown: [244, 164, 96],
                seagreen: [46, 139, 87],
                seashell: [255, 245, 238],
                sienna: [160, 82, 45],
                silver: [192, 192, 192],
                skyblue: [135, 206, 235],
                slateblue: [106, 90, 205],
                slategray: [119, 128, 144],
                slategrey: [119, 128, 144],
                snow: [255, 255, 250],
                springgreen: [0, 255, 127],
                steelblue: [70, 130, 180],
                tan: [210, 180, 140],
                teal: [0, 128, 128],
                thistle: [216, 191, 216],
                transparent: [255, 255, 255, 0],
                tomato: [255, 99, 71],
                turquoise: [64, 224, 208],
                violet: [238, 130, 238],
                wheat: [245, 222, 179],
                white: [255, 255, 255],
                whitesmoke: [245, 245, 245],
                yellow: [255, 255, 0],
                yellowgreen: [154, 205, 5]
            };
            var arr = [];
            for (let key in COLORS) {
                arr.push(COLORS[key]);
            }
            return arr;
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
                        return Number(v.maxX - v.PADDING);
                    }));
                    var minX = Math.min.apply(this, obstacleArr.map((v) => {
                        return Number(v.minX + v.PADDING);
                    }));
                    var y = Math.min.apply(this, obstacleArr.map((v) => {
                        return Number(v.opt.y)
                    }));
                    var maxY = Math.max.apply(this, obstacleArr.map((v) => {
                        return Number(v.maxY - v.PADDING);
                    }));
                    var minY = Math.min.apply(this, obstacleArr.map((v) => {
                        return Number(v.minY + v.PADDING);
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

    exports.Main = Sketchpad;
    exports.Child = SketchpadChild;
}));