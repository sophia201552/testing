;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'Konva'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('Konva'));
    } else {
        factory(
            root,
            namespace('Konva')
        );
    }
}(namespace('beop.strategy.components.Painter.Sketchpad.Graphics'), function(exports, Konva) {

    function GShape(config) {
        this.___init(config);
    };


    Konva.Util.addMethods(GShape, {
        ___init: function(config) {
            Konva.Group.prototype.___init.call(this, config);

            this.__createShapes();
        },
        __createShapes: function() {

            this.__wrapEvents();
        },
        __wrapEvents: function() {

        }
    });
    Konva.Util.extend(GShape, Konva.Group);

    exports.GShape = GShape;
}));
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'Konva', './gShape.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('Konva'),
            require('./gShape.js'));
    } else {
        factory(
            root,
            namespace('Konva'),
            namespace('beop.strategy.components.Painter.Sketchpad.Graphics.GShape')
        );
    }
}(namespace('beop.strategy.components.Painter.Sketchpad.Graphics'), function(exports, Konva, GShape) {

    function GArrow(config) {
        this.___init(config);
    };

    Konva.Util.addMethods(GArrow, {
        ___init: function(config) {
            Konva.Group.prototype.___init.call(this, config);
            this.__createShapes();
        },
        __createShapes: function() {
            var attrs = this.attrs;
            attrs.store.lines.forEach((line) => {
                var l = new Konva.Line({
                    id: line.id,
                    name: 'line ' + line.id.split('_')[0],
                    points: line.points,
                    stroke: '#6f7777',
                    strokeWidth: 1,
                    lineCap: 'round',
                    lineJoin: 'round'
                });
                this.add(l);
            });
            this.__wrapEvents();
        },
        __wrapEvents: function() {
            var _this = this;
            var attrs = this.attrs;
            this.on('update', function(e) {
                e.date.lines.forEach((line) => {
                    var target = _this.find('#' + line.id)[0];
                    if (target) {
                        target.points(line.points);
                    } else { //有增加
                        _this.add(new Konva.Line({
                            id: line.id,
                            name: 'line ' + line.id.split('_')[0],
                            points: line.points,
                            stroke: '#6f7777',
                            strokeWidth: 1,
                            lineCap: 'round',
                            lineJoin: 'round'
                        }));
                    }
                });

                var lines = this.find('.line');
                //有删除
                if (lines.length > e.date.lines.length) {
                    var a = new Set(lines.map(line => line.attrs.id)),
                        b = new Set(e.date.lines.map(line => line.id));
                    var deleteIds = [...a].filter(x => !b.has(x));
                    deleteIds.forEach((id) => {
                        _this.find('#' + id).destroy();
                    });
                }
            });
        }
    });
    Konva.Util.extend(GArrow, GShape);

    exports.GArrow = GArrow;
}));


;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('React'));
    } else {
        factory(
            root,
            namespace('React'),
            namespace('ReactKonva')
        );
    }
}(namespace('beop.strategy.components.Painter'), function(exports, React, ReactKonva) {

    var h = React.h;

    var theme = {
        createLines: function(attrs) {
            var result = [];
            attrs.store.lines.forEach((line) => {
                result.push(h(ReactKonva.Line, {
                    id: line.id,
                    name: 'line ' + line.id.split('_')[0],
                    points: line.points,
                    stroke: attrs.isSelected ? '#f6a405' : '#6f7777',
                    strokeWidth: 1,
                    lineCap: 'round',
                    lineJoin: 'round'
                }));
            });
            return result;
        }
    };

    class GArrowGroup extends React.Component {

        constructor(props) {
            super(props);
            this.createEvents();
        }

        createEvents() {
            var _this = this;
            this.props.onUpdate = function(e) {
                e.date.lines.forEach((line) => {
                    var target = this.find('#' + line.id)[0];
                    if (target) {
                        target.points(line.points);
                    } else { //有增加
                        this.add(new Konva.Line({
                            id: line.id,
                            name: 'line ' + line.id.split('_')[0],
                            points: line.points,
                            stroke: '#6f7777',
                            strokeWidth: 1,
                            lineCap: 'round',
                            lineJoin: 'round'
                        }));
                    }
                });

                var lines = this.find('.line');
                //有删除
                if (lines.length > e.date.lines.length) {
                    var a = new Set(lines.map(line => line.attrs.id)),
                        b = new Set(e.date.lines.map(line => line.id));
                    var deleteIds = [...a].filter(x => !b.has(x));
                    deleteIds.forEach((id) => {
                        this.find('#' + id).destroy();
                    });
                }
                this.parent.draw();
            }
        }

        render() {
            var attrs = this.props;
            return (
                h(ReactKonva.Group, this.props, theme.createLines(attrs))
            );
        }

    }


    exports.GArrowGroup = GArrowGroup;
}));
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'Konva', './gShape.js', './gArrow.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('Konva'), require('./gShape.js'), require('./gArrow.js'));
    } else {
        factory(
            root,
            namespace('Konva'),
            namespace('beop.strategy.components.Painter.Sketchpad.Graphics.GShape'),
            namespace('beop.strategy.components.Painter.Sketchpad.Graphics.GArrow')
        );
    }
}(namespace('beop.strategy.components.Painter.Sketchpad.Graphics'), function(exports, Konva, GShape, GArrow) {

    function GStrategyShape(config) {
        this.___init(config);
    };
    var PADDING = 5,
        STROKE_WIDTH = 1,
        OPTION_BTN_SIZE = 15,
        OPTION_BTN_MARGGING = 5,
        SIZE_BTN_SIZE = 20,
        FONTSIZE = 16,
        SMALLFONTSIZE = 12;

    Konva.Util.addMethods(GStrategyShape, {
        ___init: function(config) {
            Konva.Group.prototype.___init.call(this, config);
            this.__createShapes();
        },
        __createShapes: function() {
            var attrs = this.attrs;
            var background, nameText, typeText, btnClose, btnConfig, resizer;
            var image = document.querySelector('#imgIcon'),
                image2 = document.querySelector('#imgIcon2');

            var type = undefined;
            //0，python代码；1，引用模板；2，远程REST服务调用；3，LaTex；4，固有控件
            switch (Number(attrs.store.type)) {
                case 0:
                    type = 'Python';
                    break;
                case 1:
                    type = '引用自模板';
                    break;
                case 2:
                    type = "REST服务";
                    break;
                case 3:
                    type = "LaTex";
                    break;
                case 4:
                    type = "固有控件";
                    break;
                case 101:
                    type = 'API';
                    break;
                case 102:
                    type = "KPI";
                    break;
                case 103:
                    type = "诊断";
                    break;
                case 104:
                    type = "模糊规则";
                    break;
                case 5:
                    type = "回归";
                    break;
                case 6:
                    type = "预测";
                    break;
                case 7:
                    type = "傅里叶分析";
                    break;
                case 8:
                    type = "小波分析";
                    break;
                case 9:
                    type = "拟合曲线";
                    break;
                case 10:
                    type = "历史曲线";
                    break;
                case 11:
                    type = "规则";
                    break;
            }
            // 背景
            this.add(background = new Konva.Rect({
                x: 0,
                y: 0,
                name: 'dragLayer',
                width: attrs.width,
                height: attrs.height,
                cornerRadius: attrs.width / 20,
                fill: '#697174',
                strokeHitEnabled: false,
                transformsEnabled: 'position',
                shadowColor: '#f6a405',
                shadowBlur: 10,
                shadowEnabled: false
            }));

            //名字说明
            this.add(nameText = new Konva.Text({
                x: 0,
                y: (attrs.height - FONTSIZE) / 2,
                name: 'nameText',
                text: (function(attrs) {
                    var txt = attrs.store.name;
                    var maxNum = attrs.width / FONTSIZE;
                    if (txt.length > maxNum) {
                        return txt.slice(0, maxNum) + '...';
                    }
                    return txt
                })(attrs),
                fontSize: FONTSIZE,
                fontFamily: '微软雅黑',
                fill: '#cee2ec',
                width: attrs.width,
                height: FONTSIZE,
                align: 'center'
            }));

            //类型说明
            this.add(type = new Konva.Text({
                x: 0,
                y: 0,
                name: 'typeText',
                text: type,
                fontSize: SMALLFONTSIZE,
                fontFamily: '微软雅黑',
                fill: '#849299',
                width: attrs.width,
                height: SMALLFONTSIZE,
                align: 'center',
                padding: PADDING,
                offsetY: -attrs.height
            }));

            // 关闭按钮
            this.add(btnClose = new Konva.Image({
                // stroke 一半在外一半在内，所以这里除以2
                x: attrs.width - OPTION_BTN_SIZE - PADDING - STROKE_WIDTH / 2,
                y: PADDING,
                name: 'close',
                width: OPTION_BTN_SIZE,
                height: OPTION_BTN_SIZE,
                image: image,
                crop: {
                    x: 16.5,
                    y: 0,
                    width: 16,
                    height: 16
                },
                strokeHitEnabled: false,
                transformsEnabled: 'position'
            }));

            // 配置按钮
            this.add(btnConfig = new Konva.Image({
                x: btnClose.x() - PADDING - OPTION_BTN_SIZE,
                y: PADDING,
                name: 'config',
                width: OPTION_BTN_SIZE,
                height: OPTION_BTN_SIZE,
                image: image,
                crop: {
                    x: 0,
                    y: 0,
                    width: 16.5,
                    height: 16
                },
                strokeHitEnabled: false,
                transformsEnabled: 'position'
            }));

            // 更改大小的按钮
            this.add(resizer = new Konva.Image({
                x: attrs.width - STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2,
                y: attrs.height - STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2,
                name: 'size',
                width: SIZE_BTN_SIZE,
                height: SIZE_BTN_SIZE,
                image: image,
                crop: {
                    x: 32.5,
                    y: 0,
                    width: 16,
                    height: 16
                },
                draggable: true,
                strokeHitEnabled: false,
                transformsEnabled: 'position'
            }));

            this.customMember = { background, nameText, typeText, btnClose, btnConfig, resizer, image, image2 };

            this.__wrapEvents();
        },
        __wrapEvents: function() {
            var _this = this;
            var attrs = this.attrs,
                MINWIDTH = 155,
                MINHEIGHT = 72;
            var children = this.getChildren(),
                parent = undefined;
            var btnClose = this.find('.close')[0],
                btnConfig = this.find('.config')[0],
                btnSizes = this.find('.size')[0],
                dragLayer = this.find('.dragLayer')[0],
                nameText = this.find('.nameText')[0],
                typeText = this.find('.typeText')[0];
            var rexizeX = btnSizes.x(),
                rexizeY = btnSizes.y();
            var mouseDownTime, oldIndex;

            var clearLines = function() {
                    parent.find('.GArrow').visible(false);
                    parent.draw();
                },
                createLines = function() {
                    if (attrs.block == undefined || parent == undefined) return;
                    attrs.block.updateInfo();
                    attrs.block.getAllLines().forEach((lines) => { //更新所有线
                        parent.find('#line_' + lines.id)[0].fire('update', { date: lines });
                    });
                    parent.find('.GArrow').visible(true);
                    parent.draw();
                };

            dragLayer.on('mousedown', function(e) {
                mouseDownTime = +new Date();
            });

            dragLayer.on('mouseup', function(e) {
                if (+new Date() - mouseDownTime > 200) {
                    return;
                }

                _this._fire('select', { evt: e.evt });
            });

            nameText.on('mousedown', function(e) {
                mouseDownTime = +new Date();
            });

            nameText.on('mouseup', function(e) {
                if (+new Date() - mouseDownTime > 200) {
                    return;
                }
                _this._fire('select');
            });

            btnClose.on('mousedown', function(e) {
                mouseDownTime = +new Date();
            });

            btnClose.on('mouseup', function(e) {
                if (+new Date() - mouseDownTime > 200) {
                    return;
                }
                parent.find('#line_' + attrs.id).destroy();
                parent.find('.input_' + attrs.id).destroy();
                parent.find('.output_' + attrs.id).destroy();
                attrs.block.remove(); //清除画板中block相关信息
                _this.destroy(); //删除图形
                _this._fire('close');
                createLines(); //更新线段
            });

            btnConfig.on('mousedown', function(e) {
                mouseDownTime = +new Date();
            });

            btnConfig.on('mouseup', function(e) {
                if (+new Date() - mouseDownTime > 200) {
                    return;
                }
                _this._fire('config');
            });

            btnSizes.on('mousedown', function(e) {
                e.evt.stopPropagation();
            });

            btnSizes.on('dragstart', function(e) {
                children.forEach((v) => {
                    if (!(v.name() == 'dragLayer' || v.name() == 'size')) {
                        v.visible(false);
                    }
                });
                clearLines();
            });

            btnSizes.on('dragmove', function(e) {
                var dx = Math.max(this.x() - rexizeX, MINWIDTH - attrs.width),
                    dy = Math.max(this.y() - rexizeY, MINHEIGHT - attrs.height);
                this.x(rexizeX + dx);
                this.y(rexizeY + dy);
                dragLayer.width(attrs.width + dx);
                dragLayer.height(attrs.height + dy);
                parent.draw();
            });

            btnSizes.on('dragend', function(e) {
                var dx = this.x() - rexizeX,
                    dy = this.y() - rexizeY;

                attrs.width = dragLayer.width();
                attrs.height = dragLayer.height();

                rexizeX = attrs.width + STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;
                rexizeY = attrs.height + STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;

                //重置块内元素位置
                btnClose.x(attrs.width - OPTION_BTN_SIZE - PADDING - STROKE_WIDTH / 2);
                btnConfig.x(btnClose.x() - PADDING - OPTION_BTN_SIZE);
                nameText.width(attrs.width);
                nameText.y((attrs.height - FONTSIZE) / 2);
                nameText.text((function(attrs) {
                    var txt = attrs.store.name;
                    var maxNum = attrs.width / FONTSIZE;
                    if (txt.length > maxNum) {
                        return txt.slice(0, maxNum) + '...';
                    }
                    return txt
                })(attrs));
                typeText.width(attrs.width);
                typeText.offsetY(-attrs.height);

                children.forEach((v) => {
                    v.visible(true);
                });

                attrs.store.loc.x = attrs.x;
                attrs.store.loc.y = attrs.y;
                attrs.store.loc.w = attrs.width;
                attrs.store.loc.h = attrs.height;

                parent.draw();
            });

            var startLoc, startPos;
            this.on('dragstart', function(e) {
                clearLines();
                startLoc = { x: this.attrs.x, y: this.attrs.y, w: this.attrs.width, h: this.attrs.height };
                startPos = this.getAbsolutePosition();
                if (e.target.nodeType == 'Group') { //防止给改变大小按钮绑定move事件
                    this.off('dragmove').on('dragmove', function(e) {
                        var evt = e.evt;
                        //水平垂直拖拽
                        if (evt.ctrlKey && this.dragBoundFunc() == undefined) {
                            var pos = this.getAbsolutePosition();
                            var dx = Math.abs(pos.x - startPos.x),
                                dy = Math.abs(pos.y - startPos.y);

                            if (dx >= dy + 10) {
                                this.y(startPos.y);
                                this.dragBoundFunc(function(pos) {
                                    return {
                                        x: pos.x,
                                        y: this.getAbsolutePosition().y
                                    }
                                });
                            } else if (dy >= dx + 10) {
                                this.x(startPos.x);
                                this.dragBoundFunc(function(pos) {
                                    return {
                                        x: this.getAbsolutePosition().x,
                                        y: pos.y
                                    }
                                });
                            }
                            this.parent.draw();
                        }
                    });
                }
            });

            this.on('dragend', function(e) {
                var sketchpad = this.attrs.block.sketchpad,
                    PADDING = sketchpad.PADDING + 1;
                var obstacle = sketchpad.tools.intersectionByRect(sketchpad.tools.rectToPoints(this.attrs.x - PADDING, this.attrs.y - PADDING, this.attrs.width + 2 * PADDING, this.attrs.height + 2 * PADDING), sketchpad.obstacle);
                if (obstacle.length == 0 || (obstacle.length == 1 && obstacle[0].id == attrs.id)) {
                    this.attrs.store.loc.x = this.attrs.x;
                    this.attrs.store.loc.y = this.attrs.y;
                } else {
                    this.x(startLoc.x);
                    this.y(startLoc.y);
                    this.width(startLoc.w);
                    this.height(startLoc.h);

                    rexizeX = attrs.width + STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;
                    rexizeY = attrs.height + STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;
                    //重置块内元素位置
                    btnSizes.x(attrs.width - STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2);
                    btnSizes.y(attrs.height - STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2);
                    dragLayer.width(attrs.width);
                    dragLayer.height(attrs.height);
                    btnClose.x(attrs.width - OPTION_BTN_SIZE - PADDING - STROKE_WIDTH / 2);
                    btnConfig.x(btnClose.x() - PADDING - OPTION_BTN_SIZE);
                    nameText.width(attrs.width);
                    nameText.y((attrs.height - FONTSIZE) / 2);
                    nameText.text((function(attrs) {
                        var txt = attrs.store.name;
                        var maxNum = attrs.width / FONTSIZE;
                        if (txt.length > maxNum) {
                            return txt.slice(0, maxNum) + '...';
                        }
                        return txt
                    })(attrs));
                    typeText.width(attrs.width);
                    typeText.offsetY(-attrs.height);
                    attrs.store.loc.x = attrs.x;
                    attrs.store.loc.y = attrs.y;
                    attrs.store.loc.w = attrs.width;
                    attrs.store.loc.h = attrs.height;
                }
                this.dragBoundFunc(undefined);
                this.parent && this.parent.draw();
                createLines();
            });

            this.on('mouseover', function(e) {
                if (e.target.attrs.name == 'typeText') {
                    document.getElementById('sketchpadWrapWrap').style.cursor = 'default';
                } else if (e.target.attrs.name == 'size') {
                    document.getElementById('sketchpadWrapWrap').style.cursor = 'se-resize';
                } else {
                    document.getElementById('sketchpadWrapWrap').style.cursor = 'pointer';
                }
            });

            this.on('mouseout', function() {
                document.getElementById('sketchpadWrapWrap').style.cursor = 'default';
            });

            this.on('mouseenter', function() {
                parent = _this.parent;
                //鼠标移入时给予提示 并提升到顶部
                this.customMember.background.shadowEnabled(true);
                oldIndex = this.getZIndex();
                this.moveToTop();
                parent.draw();
            });
            this.on('mouseleave', function() {
                this.customMember.background.shadowEnabled(false);
                this.setZIndex(oldIndex);
                parent.draw();
            });
        }
    });
    Konva.Util.extend(GStrategyShape, GShape);

    exports.GStrategyShape = GStrategyShape;
}));


;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('React'));
    } else {
        factory(
            root,
            namespace('React'),
            namespace('ReactKonva')
        );
    }
}(namespace('beop.strategy.components.Painter'), function(exports, React, ReactKonva) {

    var h = React.h;

    var PADDING = 5,
        STROKE_WIDTH = 1,
        OPTION_BTN_SIZE = 15,
        OPTION_BTN_MARGGING = 5,
        SIZE_BTN_SIZE = 20,
        FONTSIZE = 16,
        SMALLFONTSIZE = 12;
    var image = document.querySelector('#imgIcon'),
        image2 = document.querySelector('#imgIcon2');


    class GShapeGroup extends React.Component {

        constructor(props) {
            super(props);
            this.rexizeX = undefined;
            this.rexizeY = undefined;
        }

        createEvents() {
            var _this = this;

            var oldIndex, mouseDownTime, mouseDownPos;
            var MINWIDTH = 155,
                MINHEIGHT = 72;
            var startLoc, startPos;
            var customMember = {};
            var getCustomMember = function(name, layer) {
                var rs;
                if (customMember[name] != undefined) {
                    rs = customMember[name];
                } else {
                    rs = customMember[name] = layer.find('.' + name)[0];
                }
                return rs;
            };
            var clearLines = function(layer) {
                    layer.find('.GArrow').visible(false);
                    layer.draw();
                },
                createLines = function(attrs, layer) {
                    if (attrs.block == undefined) return;
                    attrs.block.updateInfo();
                    attrs.block.getAllLines().forEach((lines) => {
                        var line = layer.find('#line_' + lines.id)[0];
                        line && line.fire('update', { date: lines });
                    });
                    layer.find('.GArrow').visible(true);
                    layer.draw();
                };

            this.props.onDragStart = function(e) {
                var attrs = this.attrs;
                clearLines(this.parent);
                startLoc = { x: attrs.x, y: attrs.y, w: attrs.width, h: attrs.height };
                startPos = this.getAbsolutePosition();
                if (e.target.nodeType == 'Group') { //防止给改变大小按钮绑定move事件
                    this.off('dragmove').on('dragmove', function(e) {
                        var evt = e.evt;
                        //水平垂直拖拽
                        if (evt.ctrlKey && this.dragBoundFunc() == undefined) {
                            var pos = this.getAbsolutePosition();
                            var dx = Math.abs(pos.x - startPos.x),
                                dy = Math.abs(pos.y - startPos.y);

                            if (dx >= dy + 10) {
                                this.y(startPos.y);
                                this.dragBoundFunc(function(pos) {
                                    return {
                                        x: pos.x,
                                        y: this.getAbsolutePosition().y
                                    }
                                });
                            } else if (dy >= dx + 10) {
                                this.x(startPos.x);
                                this.dragBoundFunc(function(pos) {
                                    return {
                                        x: this.getAbsolutePosition().x,
                                        y: pos.y
                                    }
                                });
                            }
                            this.parent.draw();
                        }
                    });
                }
            };

            this.props.onDragEnd = function(e) {
                var attrs = this.attrs;
                var x, y, w, h;
                var sketchpad = attrs.block.sketchpad,
                    PADDING = sketchpad.PADDING + 1;
                var obstacle = sketchpad.tools.intersectionByRect(sketchpad.tools.rectToPoints(attrs.x - PADDING, attrs.y - PADDING, attrs.width + 2 * PADDING, attrs.height + 2 * PADDING), sketchpad.obstacle);
                if (obstacle.length == 0 || (obstacle.length == 1 && obstacle[0].id == attrs.id)) {
                    // attrs.store.loc.x = attrs.x;
                    // attrs.store.loc.y = attrs.y;
                    x = attrs.x;
                    y = attrs.y;
                    w = attrs.width;
                    h = attrs.height;
                } else {
                    // this.x(startLoc.x);
                    // this.y(startLoc.y);
                    // this.width(startLoc.w);
                    // this.height(startLoc.h);
                    x = startLoc.x;
                    y = startLoc.y;
                    w = startLoc.w;
                    h = startLoc.h;
                    _this.rexizeX = startLoc.w + STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;
                    _this.rexizeY = startLoc.h + STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;

                    // rexizeX = attrs.width + STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;
                    // rexizeY = attrs.height + STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;
                    // //重置块内元素位置
                    // var btnSizes = getCustomMember('size', this),
                    //     dragLayer = getCustomMember('dragLayer', this),
                    //     btnClose = getCustomMember('close', this),
                    //     btnConfig = getCustomMember('config', this),
                    //     nameText = getCustomMember('nameText', this),
                    //     typeText = getCustomMember('typeText', this);
                    // btnSizes.x(attrs.width - STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2);
                    // btnSizes.y(attrs.height - STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2);
                    // dragLayer.width(attrs.width);
                    // dragLayer.height(attrs.height);
                    // btnClose.x(attrs.width - OPTION_BTN_SIZE - PADDING - STROKE_WIDTH / 2);
                    // btnConfig.x(btnClose.x() - PADDING - OPTION_BTN_SIZE);
                    // nameText.width(attrs.width);
                    // nameText.y((attrs.height - FONTSIZE) / 2);
                    // nameText.text((function(attrs) {
                    //     var txt = attrs.store.name;
                    //     var maxNum = attrs.width / FONTSIZE;
                    //     if (txt.length > maxNum) {
                    //         return txt.slice(0, maxNum) + '...';
                    //     }
                    //     return txt
                    // })(attrs));
                    // typeText.width(attrs.width);
                    // typeText.offsetY(-attrs.height);
                    // attrs.store.loc.x = attrs.x;
                    // attrs.store.loc.y = attrs.y;
                    // attrs.store.loc.w = attrs.width;
                    // attrs.store.loc.h = attrs.height;
                }
                this.dragBoundFunc(undefined);
                this.parent && this.parent.draw();
                _this.props.customEvent.dragend(attrs.id, {
                    x: x,
                    y: y,
                    w: w,
                    h: h
                });
                createLines(attrs, this.parent);
            };

            this.props.onMouseOver = function(e) {
                if (e.target.attrs.name == 'typeText') {
                    document.getElementById('sketchpadWrap').style.cursor = 'default';
                } else if (e.target.attrs.name == 'size') {
                    document.getElementById('sketchpadWrap').style.cursor = 'se-resize';
                } else {
                    document.getElementById('sketchpadWrap').style.cursor = 'pointer';
                }
            };
            this.props.onMouseOut = function(e) {
                document.getElementById('sketchpadWrap').style.cursor = 'default';
            };
            this.props.onMouseEnter = function(e) {
                //鼠标移入时给予提示 并提升到顶部
                getCustomMember('dragLayer', this).shadowEnabled(true);
                oldIndex = this.getZIndex();
                this.moveToTop();
                this.parent.draw();
            };
            this.props.onMouseLeave = function(e) {
                getCustomMember('dragLayer', this).shadowEnabled(false);
                this.setZIndex(oldIndex);
                this.parent.draw();
            };

            return {
                resizeDragStart: function() {
                    this.parent.children.forEach((v) => {
                        if (!(v.name() == 'dragLayer' || v.name() == 'size')) {
                            v.visible(false);
                        }
                    });
                    clearLines(this.parent.parent);
                },
                resizeDragMove: function() {
                    var attrs = this.parent.attrs;
                    var dragLayer = getCustomMember('dragLayer', this.parent);
                    var dx = Math.max(this.x() - _this.rexizeX, MINWIDTH - attrs.width),
                        dy = Math.max(this.y() - _this.rexizeY, MINHEIGHT - attrs.height);
                    this.x(_this.rexizeX + dx);
                    this.y(_this.rexizeY + dy);
                    dragLayer.width(attrs.width + dx);
                    dragLayer.height(attrs.height + dy);
                    this.parent.parent.draw();
                },
                resizeDragEnd: function() {
                    var attrs = this.parent.attrs;
                    var dx = this.x() - _this.rexizeX,
                        dy = this.y() - _this.rexizeY;
                    var dragLayer = getCustomMember('dragLayer', this.parent);
                    attrs.width = dragLayer.width();
                    attrs.height = dragLayer.height();

                    _this.rexizeX = attrs.width + STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;
                    _this.rexizeY = attrs.height + STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;
                    //重置块内元素位置
                    var btnCloseX = attrs.width - OPTION_BTN_SIZE - PADDING - STROKE_WIDTH / 2;
                    var nameText = getCustomMember('nameText', this.parent),
                        typeText = getCustomMember('typeText', this.parent);
                    getCustomMember('close', this.parent).x(btnCloseX);
                    getCustomMember('config', this.parent).x(btnCloseX - PADDING - OPTION_BTN_SIZE);
                    nameText.width(attrs.width);
                    nameText.y((attrs.height - FONTSIZE) / 2);
                    nameText.text((function(attrs) {
                        var txt = attrs.store.name;
                        var maxNum = attrs.width / FONTSIZE;
                        if (txt.length > maxNum) {
                            return txt.slice(0, maxNum) + '...';
                        }
                        return txt
                    })(attrs));
                    typeText.width(attrs.width);
                    typeText.offsetY(-attrs.height);

                    this.parent.children.forEach((v) => {
                        v.visible(true);
                    });

                    var x = attrs.store.loc.x = attrs.x;
                    var y = attrs.store.loc.y = attrs.y;
                    var w = attrs.store.loc.w = attrs.width;
                    var h = attrs.store.loc.h = attrs.height;
                    // _this.props.customEvent.dragend(attrs.id, {
                    //     x: x,
                    //     y: y,
                    //     w: w,
                    //     h: h
                    // });

                    this.parent.parent.draw();
                },
                likeClick: function(e) {
                    mouseDownTime = +new Date;
                    mouseDownPos = {
                        x: e.evt.clientX,
                        y: e.evt.clientY
                    }
                },
                dragLayerClick: function(e) {
                    if (+new Date() - (mouseDownTime || 0) > 200 || Math.abs(e.evt.clientX - mouseDownPos.x) > 30 || Math.abs(e.evt.clientY - mouseDownPos.y) > 30) {
                        return;
                    }
                    _this.props.customEvent.select(this.parent.attrs.id, this.parent.parent, image, image2);
                },
                closeClick: function(e) {
                    if (+new Date() - (mouseDownTime || 0) > 200 || Math.abs(e.evt.clientX - mouseDownPos.x) > 30 || Math.abs(e.evt.clientY - mouseDownPos.y) > 30) {
                        return;
                    }
                    var attrs = this.parent.attrs,
                        layer = this.parent.parent;
                    // layer.find('#line_' + attrs.id).destroy();
                    // layer.find('.input_' + attrs.id).destroy();
                    // layer.find('.output_' + attrs.id).destroy();
                    attrs.block.remove(); //清除画板中block相关信息
                    // this.parent.destroy(); //删除图形
                    // layer.draw();
                    _this.props.customEvent.close(attrs.id);
                    createLines(attrs, layer); //更新线段
                },
                configClick: function(e) {
                    if (+new Date() - (mouseDownTime || 0) > 200 || Math.abs(e.evt.clientX - mouseDownPos.x) > 30 || Math.abs(e.evt.clientY - mouseDownPos.y) > 30) {
                        return;
                    }
                    _this.props.customEvent.config();
                }
            }
        }

        render() {
            var attrs = this.props;
            this.rexizeX = attrs.width - STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;
            this.rexizeY = attrs.height - STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;
            var actions = this.createEvents();

            var type = undefined;
            //0，python代码；1，引用模板；2，远程REST服务调用；3，LaTex；4，固有控件
            switch (Number(attrs.store.type)) {
                case 0:
                    type = 'Python';
                    break;
                case 1:
                    type = '引用自模板';
                    break;
                case 2:
                    type = "REST服务";
                    break;
                case 3:
                    type = "LaTex";
                    break;
                case 4:
                    type = "固有控件";
                    break;
                case 101:
                    type = 'API';
                    break;
                case 102:
                    type = "KPI";
                    break;
                case 103:
                    type = "诊断";
                    break;
                case 104:
                    type = "模糊规则";
                    break;
                case 5:
                    type = "回归";
                    break;
                case 6:
                    type = "预测";
                    break;
                case 7:
                    type = "傅里叶分析";
                    break;
                case 8:
                    type = "小波分析";
                    break;
                case 9:
                    type = "拟合曲线";
                    break;
                case 10:
                    type = "历史曲线";
                    break;
                case 11:
                    type = "规则";
                    break;
            }

            var isSelected = this.props.isSelected;
            return (
                h(ReactKonva.Group, this.props, [
                    h(ReactKonva.Rect, {
                        x: 0,
                        y: 0,
                        name: 'dragLayer',
                        width: attrs.width,
                        height: attrs.height,
                        cornerRadius: 8,
                        fill: isSelected ? '#f6a405' : '#697174',
                        strokeHitEnabled: false,
                        transformsEnabled: 'position',
                        shadowColor: '#f6a405',
                        shadowBlur: 10,
                        shadowEnabled: false,
                        onMouseDown: actions.likeClick,
                        onMouseUp: actions.dragLayerClick
                    }),
                    h(ReactKonva.Text, {
                        x: 0,
                        y: (attrs.height - FONTSIZE) / 2,
                        name: 'nameText',
                        text: (function(attrs) {
                            var txt = attrs.store.name;
                            var maxNum = attrs.width / FONTSIZE;
                            if (txt.length > maxNum) {
                                return txt.slice(0, maxNum) + '...';
                            }
                            return txt
                        })(attrs),
                        fontSize: FONTSIZE,
                        fontFamily: '微软雅黑',
                        fill: isSelected ? '#fff' : '#cee2ec',
                        width: attrs.width,
                        height: FONTSIZE,
                        align: 'center',
                        onMouseDown: actions.likeClick,
                        onMouseUp: actions.dragLayerClick
                    }),
                    h(ReactKonva.Text, {
                        x: 0,
                        y: 0,
                        name: 'typeText',
                        text: type,
                        fontSize: SMALLFONTSIZE,
                        fontFamily: '微软雅黑',
                        fill: '#849299',
                        width: attrs.width,
                        height: SMALLFONTSIZE,
                        align: 'center',
                        padding: PADDING,
                        offsetY: -attrs.height
                    }),
                    h(ReactKonva.Image, {
                        x: attrs.width - OPTION_BTN_SIZE - PADDING - STROKE_WIDTH / 2,
                        y: PADDING,
                        name: 'close',
                        width: OPTION_BTN_SIZE,
                        height: OPTION_BTN_SIZE,
                        image: isSelected ? image2 : image,
                        crop: {
                            x: 16.5,
                            y: 0,
                            width: 16,
                            height: 16
                        },
                        strokeHitEnabled: false,
                        transformsEnabled: 'position',
                        onMouseDown: actions.likeClick,
                        onMouseUp: actions.closeClick
                    }),
                    h(ReactKonva.Image, {
                        x: attrs.width - OPTION_BTN_SIZE - PADDING - STROKE_WIDTH / 2 - PADDING - OPTION_BTN_SIZE,
                        y: PADDING,
                        name: 'config',
                        width: OPTION_BTN_SIZE,
                        height: OPTION_BTN_SIZE,
                        image: isSelected ? image2 : image,
                        crop: {
                            x: 0,
                            y: 0,
                            width: 16.5,
                            height: 16
                        },
                        strokeHitEnabled: false,
                        transformsEnabled: 'position',
                        onMouseDown: actions.likeClick,
                        onMouseUp: actions.configClick
                    }),
                    h(ReactKonva.Image, {
                        x: attrs.width - STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2,
                        y: attrs.height - STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2,
                        name: 'size',
                        width: SIZE_BTN_SIZE,
                        height: SIZE_BTN_SIZE,
                        image: isSelected ? image2 : image,
                        crop: {
                            x: 32.5,
                            y: 0,
                            width: 16,
                            height: 16
                        },
                        draggable: true,
                        strokeHitEnabled: false,
                        transformsEnabled: 'position',
                        onDragStart: actions.resizeDragStart,
                        onDragMove: actions.resizeDragMove,
                        onDragEnd: actions.resizeDragEnd
                    })
                ])
            );
        }

    }


    exports.GShapeGroup = GShapeGroup;
}));
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'Konva', './gShape.js', './gArrow.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('Konva'),
            require('./gShape.js'),
            require('./gArrow.js'));
    } else {
        factory(
            root,
            namespace('Konva'),
            namespace('beop.strategy.components.Painter.Sketchpad.Graphics.GShape'),
            namespace('beop.strategy.components.Painter.Sketchpad.Graphics.GArrow')
        );
    }
}(namespace('beop.strategy.components.Painter.Sketchpad.Graphics'), function(exports, Konva, GShape, GArrow) {

    function GInputShape(config) {
        this.___init(config);
    };
    var PADDING = 5,
        STROKE_WIDTH = 1,
        SIZE_BTN_SIZE = 10,
        CORNERRADIUS = 50,
        FONTSIZE = 14,
        SMALLFONTSIZE = 12;
    Konva.Util.addMethods(GInputShape, {
        ___init: function(config) {
            Konva.Group.prototype.___init.call(this, config);
            this.__createShapes();
        },
        __createShapes: function() {
            var attrs = this.attrs;
            var showType = undefined;
            //0， 数据源 1， 短信 2， 邮件 10， 数值 11， 字符串 12， 时间 13， JSON 100， 引用其他模块
            switch (Number(attrs.store.type)) {
                case 0:
                    showType = '数据源';
                    break;
                case 1:
                    showType = '短信';
                    break;
                case 2:
                    showType = '邮件';
                    break;
                case 10:
                    showType = '数值';
                    break;
                case 11:
                    showType = '字符串';
                    break;
                case 12:
                    showType = '时间';
                    break;
                case 13:
                    showType = 'JSON';
                    break;
                case 100:
                    showType = '引用';
                    break;
            };
            this.add(new Konva.Rect({
                x: 0,
                y: 0,
                name: 'dragLayer',
                width: attrs.width,
                height: attrs.height,
                cornerRadius: attrs.width / 5,
                fill: '#697174'
            }));

            //文字
            this.add(new Konva.Text({
                x: 0,
                y: (attrs.height - FONTSIZE) / 2,
                name: 'nameText',
                text: attrs.store.name,
                fontSize: FONTSIZE,
                fontFamily: '微软雅黑',
                fill: '#9fb0b8',
                width: attrs.width,
                height: FONTSIZE,
                align: 'center'
            }));

            this.add(new Konva.Text({
                x: 0,
                y: 0,
                name: 'typeText',
                text: showType,
                fontSize: SMALLFONTSIZE,
                fontFamily: '微软雅黑',
                fill: '#849299',
                width: attrs.width,
                height: SMALLFONTSIZE,
                align: 'center',
                padding: PADDING,
                offsetY: -attrs.height
            }));

            this.__wrapEvents();
        },
        __wrapEvents: function() {
            var attrs = this.attrs,
                MINWIDTH = 132,
                MINHEIGHT = 50;
            var _this = this;
            var children = this.getChildren();
            var dragLayer = this.find('.dragLayer')[0],
                nameText = this.find('.nameText')[0];
            var oldIndex, startPos;

            var clearLines = function() {
                    _this.parent.find('.GArrow').visible(false);
                    _this.parent.draw();
                },
                createLines = function() {
                    if (attrs.block == undefined) return;
                    attrs.block.updateInfo();
                    attrs.block.getAllLines().forEach((lines) => {
                        _this.parent.find('#line_' + lines.id)[0].fire('update', { date: lines });
                    });
                    _this.parent.find('.GArrow').visible(true);
                    _this.parent.draw();
                };

            this.on('dragstart', function(e) {
                clearLines();
                startPos = this.getAbsolutePosition();
            });

            this.on('dragmove', function(e) {
                var evt = e.evt;
                //水平垂直拖拽
                if (evt.ctrlKey && this.dragBoundFunc() == undefined) {
                    var pos = this.getAbsolutePosition();
                    var dx = Math.abs(pos.x - startPos.x),
                        dy = Math.abs(pos.y - startPos.y);

                    if (dx >= dy + 10) {
                        this.y(startPos.y);
                        this.dragBoundFunc(function(pos) {
                            return {
                                x: pos.x,
                                y: this.getAbsolutePosition().y
                            }
                        });
                    } else if (dy >= dx + 10) {
                        this.x(startPos.x);
                        this.dragBoundFunc(function(pos) {
                            return {
                                x: this.getAbsolutePosition().x,
                                y: pos.y
                            }
                        });
                    }
                    this.parent.draw();
                }
            });

            this.on('dragend', function(e) {
                this.attrs.store.loc.x = this.attrs.x;
                this.attrs.store.loc.y = this.attrs.y;
                this.dragBoundFunc(undefined);
                createLines();
            });

            this.on('changeToOutput', function(e) {
                attrs.block.remove(); //清除画板中block相关信息
                this.destroy(); //删除图形
                _this._fire('toOutput', { data: e.data });
            });

            this.on('mouseenter', function() {
                oldIndex = this.getZIndex();
                this.moveToTop();
                this.parent.draw();
            });

            this.on('mouseleave', function() {
                this.setZIndex(oldIndex);
                this.parent.draw();
            });

            this.on('updateText', function(e) {
                var showName;
                if (e.data != undefined) {
                    showName = e.data;
                    attrs.nameMap[attrs.store.name] = showName;
                } else {
                    showName = attrs.store.name;
                }

                nameText.text((function(showName) {
                    showName += '';
                    var maxNum = nameText.width() / 10;
                    if (showName.length > maxNum) {
                        return showName.slice(0, maxNum) + '...';
                    }
                    return showName
                })(showName));
                this.parent && _this.parent.draw();
            });
        }
    });
    Konva.Util.extend(GInputShape, GShape);

    exports.GInputShape = GInputShape;
}));


;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('React'));
    } else {
        factory(
            root,
            namespace('React'),
            namespace('ReactKonva')
        );
    }
}(namespace('beop.strategy.components.Painter'), function(exports, React, ReactKonva) {

    var h = React.h;

    var PADDING = 5,
        STROKE_WIDTH = 1,
        SIZE_BTN_SIZE = 10,
        CORNERRADIUS = 50,
        FONTSIZE = 14,
        SMALLFONTSIZE = 12;
    class GInputGroup extends React.Component {

        constructor(props) {
            super(props);
        }

        createEvents() {
            var _this = this;
            var oldIndex, startPos;
            var clearLines = function(layer) {
                    layer.find('.GArrow').visible(false);
                    layer.draw();
                },
                createLines = function(attrs, layer) {
                    if (attrs.block == undefined) return;
                    attrs.block.updateInfo();
                    attrs.block.getAllLines().forEach((lines) => {
                        var line = layer.find('#line_' + lines.id)[0];
                        line && line.fire('update', { date: lines });
                    });
                    layer.find('.GArrow').visible(true);
                    layer.draw();
                };
            this.props.onDragStart = function() {
                clearLines(this.parent);
                startPos = this.getAbsolutePosition();
            };
            this.props.onDragMove = function(e) {
                var evt = e.evt;
                //水平垂直拖拽
                if (evt.ctrlKey && this.dragBoundFunc() == undefined) {
                    var pos = this.getAbsolutePosition();
                    var dx = Math.abs(pos.x - startPos.x),
                        dy = Math.abs(pos.y - startPos.y);

                    if (dx >= dy + 10) {
                        this.y(startPos.y);
                        this.dragBoundFunc(function(pos) {
                            return {
                                x: pos.x,
                                y: this.getAbsolutePosition().y
                            }
                        });
                    } else if (dy >= dx + 10) {
                        this.x(startPos.x);
                        this.dragBoundFunc(function(pos) {
                            return {
                                x: this.getAbsolutePosition().x,
                                y: pos.y
                            }
                        });
                    }
                    this.parent.draw();
                }
            };
            this.props.onDragEnd = function() {
                // this.attrs.store.loc.x = this.attrs.x;
                // this.attrs.store.loc.y = this.attrs.y;
                this.attrs.customEvent.dragend(this.attrs.id.split('_')[1], {
                    x: this.attrs.x,
                    y: this.attrs.y,
                    w: this.attrs.width,
                    h: this.attrs.height
                }, this.attrs.store.name, 'input');
                this.dragBoundFunc(undefined);
                createLines(this.attrs, this.parent);
            };
            this.props.onMouseEnter = function() {
                oldIndex = this.getZIndex();
                this.moveToTop();
                this.parent.draw();
            };
            this.props.onMouseLeave = function() {
                this.setZIndex(oldIndex);
                this.parent.draw();
            };
            this.props.onChangeToOutput = function(e) {
                attrs.block.remove(); //清除画板中block相关信息
                this.destroy(); //删除图形
                this.parent.draw();
                this.props.toOutput({ data: e.data });
                // _this._fire('toOutput', { data: e.data });
            }
        }

        render() {
            var attrs = this.props;
            this.createEvents();
            var showType = undefined;
            //0， 数据源 1， 短信 2， 邮件 10， 数值 11， 字符串 12， 时间 13， JSON 100， 引用其他模块
            switch (Number(attrs.store.type)) {
                case 0:
                    showType = '数据源';
                    break;
                case 1:
                    showType = '短信';
                    break;
                case 2:
                    showType = '邮件';
                    break;
                case 10:
                    showType = '数值';
                    break;
                case 11:
                    showType = '字符串';
                    break;
                case 12:
                    showType = '时间';
                    break;
                case 13:
                    showType = 'JSON';
                    break;
                case 100:
                    showType = '引用';
                    break;
            };

            var showName = attrs.showName && attrs.showName.split('|')[1] || attrs.store.name;
            showName += '';
            var fontNum = (attrs.width - 20) / 10;
            var vNum = Math.ceil(showName.length / fontNum);
            var textHeight = Math.min(FONTSIZE * vNum, attrs.height);

            return (
                h(ReactKonva.Group, this.props, [
                    h(ReactKonva.Rect, {
                        x: 0,
                        y: 0,
                        name: 'dragLayer',
                        width: attrs.width,
                        height: attrs.height,
                        cornerRadius: attrs.width / 5,
                        fill: '#697174'
                    }),
                    h(ReactKonva.Text, {
                        x: 10,
                        y: (attrs.height - textHeight) / 2,
                        name: 'nameText',
                        text: showName,
                        fontSize: FONTSIZE,
                        fontFamily: '微软雅黑',
                        fill: '#9fb0b8',
                        width: attrs.width - 20,
                        height: textHeight,
                        align: 'center'
                    }),
                    h(ReactKonva.Text, {
                        x: 0,
                        y: 0,
                        name: 'typeText',
                        text: showType,
                        fontSize: SMALLFONTSIZE,
                        fontFamily: '微软雅黑',
                        fill: '#849299',
                        width: attrs.width,
                        height: SMALLFONTSIZE,
                        align: 'center',
                        padding: PADDING,
                        offsetY: -attrs.height
                    }),
                ])
            );
        }

    }


    exports.GInputGroup = GInputGroup;
}));
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'Konva', './gShape.js', './gArrow.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('Konva'), require('./gShape.js'), require('./gArrow.js'));
    } else {
        factory(
            root,
            namespace('Konva'),
            namespace('beop.strategy.components.Painter.Sketchpad.Graphics.GShape'),
            namespace('beop.strategy.components.Painter.Sketchpad.Graphics.GArrow')
        );
    }
}(namespace('beop.strategy.components.Painter.Sketchpad.Graphics'), function(exports, Konva, GShape, GArrow) {

    function GOutputShape(config) {
        this.___init(config);
    };
    var PADDING = 5,
        STROKE_WIDTH = 1,
        SIZE_BTN_SIZE = 10,
        CORNERRADIUS = 50,
        FONTSIZE = 14,
        SMALLFONTSIZE = 12;
    Konva.Util.addMethods(GOutputShape, {
        ___init: function(config) {
            Konva.Group.prototype.___init.call(this, config);
            this.__createShapes();
        },
        __createShapes: function() {
            var attrs = this.attrs;
            var showType = undefined;
            //0， 数据源 1， 短信 2， 邮件 10， 数值 11， 字符串 12， 时间 13， JSON 100， 引用其他模块
            switch (Number(attrs.store.type)) {
                case 0:
                    showType = '数据源';
                    break;
                case 1:
                    showType = '短信';
                    break;
                case 2:
                    showType = '邮件';
                    break;
                case 10:
                    showType = '数值';
                    break;
                case 11:
                    showType = '字符串';
                    break;
                case 12:
                    showType = '时间';
                    break;
                case 13:
                    showType = 'JSON';
                    break;
            };

            this.add(new Konva.Rect({
                x: 0,
                y: 0,
                name: 'dragLayer',
                width: attrs.width,
                height: attrs.height,
                cornerRadius: attrs.width / 5,
                fill: '#697174'
            }));

            //文字
            this.add(new Konva.Text({
                x: 0,
                y: (attrs.height - FONTSIZE) / 2,
                name: 'nameText',
                text: (function(showName) {
                    var maxNum = attrs.width / 10;
                    if (showName.length > maxNum) {
                        return showName.slice(0, maxNum) + '...';
                    }
                    return showName
                })(attrs.store.name),
                fontSize: FONTSIZE,
                fontFamily: '微软雅黑',
                fill: '#9fb0b8',
                width: attrs.width,
                height: FONTSIZE,
                align: 'center'
            }));

            this.add(new Konva.Text({
                x: 0,
                y: 0,
                name: 'typeText',
                text: showType,
                fontSize: SMALLFONTSIZE,
                fontFamily: '微软雅黑',
                fill: '#849299',
                width: attrs.width,
                height: SMALLFONTSIZE,
                align: 'center',
                padding: PADDING,
                offsetY: -attrs.height
            }));

            this.__wrapEvents();
        },
        __wrapEvents: function() {
            var attrs = this.attrs,
                MINWIDTH = 132,
                MINHEIGHT = 50;
            var _this = this;
            var children = this.getChildren();
            var dragLayer = this.find('.dragLayer')[0];
            var oldIndex, startPos;
            var clearLines = function() {
                    _this.parent.find('.GArrow').visible(false);
                    _this.parent.draw();
                },
                createLines = function() {
                    if (attrs.block == undefined) return;
                    attrs.block.updateInfo();
                    attrs.block.getAllLines().forEach((lines) => {
                        _this.parent.find('#line_' + lines.id)[0].fire('update', { date: lines });
                    });
                    _this.parent.find('.GArrow').visible(true);
                    _this.parent.draw();
                };

            this.on('dragstart', function(e) {
                clearLines();
                startPos = this.getAbsolutePosition();
            });

            this.on('dragmove', function(e) {
                var evt = e.evt;
                //水平垂直拖拽
                if (evt.ctrlKey && this.dragBoundFunc() == undefined) {
                    var pos = this.getAbsolutePosition();
                    var dx = Math.abs(pos.x - startPos.x),
                        dy = Math.abs(pos.y - startPos.y);

                    if (dx >= dy + 10) {
                        this.y(startPos.y);
                        this.dragBoundFunc(function(pos) {
                            return {
                                x: pos.x,
                                y: this.getAbsolutePosition().y
                            }
                        });
                    } else if (dy >= dx + 10) {
                        this.x(startPos.x);
                        this.dragBoundFunc(function(pos) {
                            return {
                                x: this.getAbsolutePosition().x,
                                y: pos.y
                            }
                        });
                    }
                    this.parent.draw();
                }
            });

            this.on('dragend', function(e) {
                var bd = attrs.block.sketchpad;
                var opt = attrs.block.opt;
                //合并目标输入点
                if (!attrs.block.parent) { //该输出点没有被引用
                    bd.inputs.forEach(input => {
                        //在输入点上且不是同模块的输入点  也不是已有引用的输入点
                        if (!input.child && bd.tools.intersectionByPoint({ x: e.evt.layerX, y: e.evt.layerY }, input) && input.parent.id != attrs.block.child.id) {
                            var target = this.parent.find('#' + input.id)[0];
                            //改变位置
                            this.x(input.opt.loc.x);
                            this.y(input.opt.loc.y);

                            //改变连线对象
                            attrs.block.toBeInput(input.id.split('_')[1]);
                            //删除输入点图形 更新数据
                            target.fire('changeToOutput', {
                                data: {
                                    id: input.id.split('_')[1],
                                    type: 100,
                                    oldName: input.opt.name,
                                    name: opt.name,
                                    refId: attrs.id.split('_')[1]
                                }
                            });
                        }
                    });
                }

                this.attrs.store.loc.x = attrs.x;
                this.attrs.store.loc.y = attrs.y;
                this.dragBoundFunc(undefined);
                createLines();
            });

            this.on('mouseenter', function() {
                oldIndex = this.getZIndex();
                this.moveToTop();
                this.parent.draw();
            });

            this.on('mouseleave', function() {
                this.setZIndex(oldIndex);
                this.parent.draw();
            });

        }
    });
    Konva.Util.extend(GOutputShape, GShape);

    exports.GOutputShape = GOutputShape;
}));

;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('React'));
    } else {
        factory(
            root,
            namespace('React'),
            namespace('ReactKonva')
        );
    }
}(namespace('beop.strategy.components.Painter'), function(exports, React, ReactKonva) {

    var h = React.h;
    var PADDING = 5,
        STROKE_WIDTH = 1,
        SIZE_BTN_SIZE = 10,
        CORNERRADIUS = 50,
        FONTSIZE = 14,
        SMALLFONTSIZE = 12;

    class GOutputGroup extends React.Component {

        constructor(props) {
            super(props);
        }

        createEvents() {
            var _this = this;
            var oldIndex, startPos;
            var MINWIDTH = 132,
                MINHEIGHT = 50;
            var clearLines = function(layer) {
                    layer.find('.GArrow').visible(false);
                    layer.draw();
                },
                createLines = function(attrs, layer) {
                    if (attrs.block == undefined) return;
                    attrs.block.updateInfo();
                    attrs.block.getAllLines().forEach((lines) => {
                        var line = layer.find('#line_' + lines.id)[0];
                        line && line.fire('update', { date: lines });
                    });
                    layer.find('.GArrow').visible(true);
                    layer.draw();
                };
            this.props.onDragStart = function() {
                clearLines(this.parent);
                startPos = this.getAbsolutePosition();
            };
            this.props.onDragMove = function(e) {
                var evt = e.evt;
                //水平垂直拖拽
                if (evt.ctrlKey && this.dragBoundFunc() == undefined) {
                    var pos = this.getAbsolutePosition();
                    var dx = Math.abs(pos.x - startPos.x),
                        dy = Math.abs(pos.y - startPos.y);

                    if (dx >= dy + 10) {
                        this.y(startPos.y);
                        this.dragBoundFunc(function(pos) {
                            return {
                                x: pos.x,
                                y: this.getAbsolutePosition().y
                            }
                        });
                    } else if (dy >= dx + 10) {
                        this.x(startPos.x);
                        this.dragBoundFunc(function(pos) {
                            return {
                                x: this.getAbsolutePosition().x,
                                y: pos.y
                            }
                        });
                    }
                    this.parent.draw();
                }
            };
            this.props.onDragEnd = function(e) {
                var attrs = this.attrs;
                var bd = attrs.block.sketchpad;
                var opt = attrs.block.opt;
                var x, y;
                //合并目标输入点
                if (!attrs.block.parent) { //该输出点没有被引用
                    bd.inputs.forEach(input => {
                        //在输入点上且不是同模块的输入点  也不是已有引用的输入点
                        if (!input.child && bd.tools.intersectionByPoint({ x: e.evt.layerX, y: e.evt.layerY }, input) && input.parent.id != attrs.block.child.id) {
                            var target = this.parent.find('#' + input.id)[0];
                            //改变位置
                            // this.x(input.opt.loc.x);
                            // this.y(input.opt.loc.y);

                            // //改变连线对象
                            // attrs.block.toBeInput(input.id.split('_')[1]);
                            // //删除输入点图形 更新数据
                            // target.fire('changeToOutput', {
                            //     data: {
                            //         id: input.id.split('_')[1],
                            //         type: 100,
                            //         oldName: input.opt.name,
                            //         name: opt.name,
                            //         refId: attrs.id.split('_')[1]
                            //     }
                            // });
                            x = input.opt.loc.x;
                            y = input.opt.loc.y;
                            attrs.customEvent.merge(input.id.split('_')[1], input.opt.name, attrs.id.split('_')[1], opt.name);
                        }
                    });
                }

                // this.attrs.store.loc.x = this.attrs.x;
                // this.attrs.store.loc.y = this.attrs.y;
                this.attrs.customEvent.dragend(this.attrs.id.split('_')[1], {
                    x: x || this.attrs.x,
                    y: y || this.attrs.y,
                    w: this.attrs.width,
                    h: this.attrs.height
                }, this.attrs.store.name, 'output');
                this.dragBoundFunc(undefined);
                createLines(this.attrs, this.parent);
            };
            this.props.onMouseEnter = function() {
                oldIndex = this.getZIndex();
                this.moveToTop();
                this.parent.draw();
            };
            this.props.onMouseLeave = function() {
                this.setZIndex(oldIndex);
                this.parent.draw();
            };
        }

        render() {
            this.createEvents();
            var attrs = this.props;

            var showType = undefined;
            //0， 数据源 1， 短信 2， 邮件 10， 数值 11， 字符串 12， 时间 13， JSON 100， 引用其他模块
            switch (Number(attrs.store.type)) {
                case 0:
                    showType = '数据源';
                    break;
                case 1:
                    showType = '短信';
                    break;
                case 2:
                    showType = '邮件';
                    break;
                case 10:
                    showType = '数值';
                    break;
                case 11:
                    showType = '字符串';
                    break;
                case 12:
                    showType = '时间';
                    break;
                case 13:
                    showType = 'JSON';
                    break;
                case 100:
                    showType = '引用';
                    break;
            };

            return (
                h(ReactKonva.Group, this.props, [
                    h(ReactKonva.Rect, {
                        x: 0,
                        y: 0,
                        name: 'dragLayer',
                        width: attrs.width,
                        height: attrs.height,
                        cornerRadius: attrs.width / 5,
                        fill: '#697174'
                    }),
                    h(ReactKonva.Text, {
                        x: 0,
                        y: (attrs.height - FONTSIZE) / 2,
                        name: 'nameText',
                        text: (function(showName) {
                            var maxNum = attrs.width / 10;
                            if (showName.length > maxNum) {
                                return showName.slice(0, maxNum) + '...';
                            }
                            return showName
                        })(attrs.store.name),
                        fontSize: FONTSIZE,
                        fontFamily: '微软雅黑',
                        fill: '#9fb0b8',
                        width: attrs.width,
                        height: FONTSIZE,
                        align: 'center'
                    }),
                    h(ReactKonva.Text, {
                        x: 0,
                        y: 0,
                        name: 'typeText',
                        text: showType,
                        fontSize: SMALLFONTSIZE,
                        fontFamily: '微软雅黑',
                        fill: '#849299',
                        width: attrs.width,
                        height: SMALLFONTSIZE,
                        align: 'center',
                        padding: PADDING,
                        offsetY: -attrs.height
                    }),
                ])
            );
        }

    }


    exports.GOutputGroup = GOutputGroup;
}));
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
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('React'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.constants'),
            namespace('React'),
            namespace('ReactKonva'),
            namespace('beop.strategy.components.Painter.GInputGroup'),
            namespace('beop.strategy.components.Painter.GOutputGroup'),
            namespace('beop.strategy.components.Painter.GShapeGroup'),
            namespace('beop.strategy.components.Painter.GArrowGroup'),
            namespace('beop.strategy.components.Painter.Calculation')
        );
    }
}(namespace('beop.strategy.components.Painter'), function(exports, constants, React, ReactKonva, GInputGroup, GOutputGroup, GShapeGroup, GArrowGroup, Calculation) {

    var h = React.h;
    var linkEvent = React.linkEvent;
    var SketchpadChild = Calculation.Child;
    var actions = {
        dispatch: null,
        model: undefined,
        selectedModulesIds: undefined,
        valueArr: [],
        moduleConfig: function(moduleId) {
            console.dir(arguments);
            actions.dispatch({
                type: constants.painter.SHOW_CONFIG_PANEL,
                moduleId: moduleId
            });
        },
        moduleClose: function(destroyId) {
            actions.dispatch({
                type: constants.painter.REMOVE_MODEULE,
                value: destroyId
            });
            // var model = actions.model;
            // var target = model.modules,
            //     index = target.findIndex((v) => { return v['_id'] == destroyId });

            // if (index == -1) {
            //     model.modules.forEach(module => {
            //         target = module.option.input;
            //         index = target.findIndex((v) => { return v['_id'] == destroyId });
            //         if (index == -1) {
            //             target = module.option.output;
            //             index = target.findIndex((v) => { return v['_id'] == destroyId });
            //             if (index != -1) {
            //                 target.splice(index, 1);
            //             }
            //         } else {
            //             target.splice(index, 1);
            //         }
            //     });
            // } else {
            //     target.splice(index, 1);
            // }
        },
        moduleSelect: function(selectId, layer, image, image2) {
            var selectIds = actions.selectedModulesIds;
            var index = selectIds.indexOf(selectId);
            if (index > -1) { //已经是选中状态
                selectIds.splice(index, 1);
            } else { //不是选中状态
                selectIds = [selectId];
            }
            actions.dispatch({
                type: constants.painter.SELECTED_PROPS,
                value: selectIds
            });
            // actions.noSelect(layer, image);
            // selectIds.forEach((selectId) => {
            //     var target = layer.find('#' + selectId)[0];
            //     target.find('.dragLayer')[0].fill('#f6a405');
            //     target.find('.close')[0].image(image2);
            //     target.find('.config')[0].image(image2);
            //     target.find('.size')[0].image(image2);
            //     target.find('.nameText')[0].fill('#fff');
            //     layer.find('#line_' + selectId)[0].find('.line').stroke('#f6a405');
            // });
            // layer.draw();


        },
        dragend: function(id, loc, name, type) {
            actions.dispatch({
                type: constants.painter.UPDATE_LOC,
                value: {
                    id: id,
                    loc: loc,
                    name: name,
                    type: type
                }
            });
        },
        noSelect: function(layer, image) {
            actions.model.modules.forEach((module) => {
                var target = layer.find('#' + module['_id'])[0];
                target.find('.dragLayer')[0].fill('#697174');
                target.find('.close')[0].image(image);
                target.find('.config')[0].image(image);
                target.find('.size')[0].image(image);
                target.find('.nameText')[0].fill('#cee2ec');
                layer.find('#line_' + module['_id'])[0].find('.line').stroke('#6f7777');
            });
            layer.draw();
        },
        toOutput: function() {

        },
        merge: function(id, name, refId, newName) {
            actions.dispatch({
                type: constants.painter.MERGE_INPUT_OUTPUT,
                value: {
                    id: id,
                    name: name,
                    refId: refId,
                    newName: newName
                }
            });
        },
        drop: function(id) {
            return function(e) {
                var dsItemId = e.dataTransfer.getData('dsItemId');
                if (dsItemId) {
                    //绑定数据源
                    // var dsItemId = EventAdapter.getData().dsItemId;
                    var ds;
                    if (AppConfig.datasource.currentObj === 'cloud') {
                        var dragName = $('#tableDsCloud').find('tr[ptid="' + dsItemId + '"]').find('.tabColName').attr('data-value');
                        var currentId = $('#selectPrjName').find('option:selected').val();
                        if (currentId) {
                            dragName = '@' + currentId + '|' + dragName;
                        } else {
                            dragName = dsItemId;
                        }
                        ds = dragName;
                    } else {
                        ds = dsItemId;
                    }
                    var skip = false;
                    bd.blocks.forEach((block) => {
                        if (skip) return;
                        block.children.forEach((child) => {
                            // view.layer.find('#' + child.id)[0].find('.dragLayer').stroke('black');
                            // view.layer.draw();
                            if (skip || child.child != undefined) {
                                return;
                            }
                            var offset = $('#sketchpadWrap').offset();
                            var isOK = bd.tools.intersectionByPoint({ x: e.clientX - offset.left, y: e.clientY - offset.top }, child);
                            if (isOK) {
                                skip = true;
                                actions.dispatch({
                                    type: constants.painter.CHANGE_INPUT_DS,
                                    value: {
                                        id: child.parent.opt._id,
                                        name: child.opt.name,
                                        type: 0,
                                        default: ds,
                                    }
                                });
                                // child.opt.type = 0;
                                // child.opt.default = ds;
                                // var text = view.layer.find('#' + child.id)[0].find('.text')[0];
                                // text.text((function(showName) {
                                //     var maxNum = text.width() / 10;
                                //     if (showName.length > maxNum) {
                                //         return showName.slice(0, maxNum) + '...';
                                //     }
                                //     return showName
                                // })(ds));
                            }

                        });
                    });
                } else {
                    //新增
                    var $this = $(e.target);
                    var offset = $this.offset(),
                        info = JSON.parse(e.dataTransfer.getData('info'));
                    var x = e.clientX - offset.left - info.x,
                        y = e.clientY - offset.top - info.y;
                    var type, name;
                    switch (info.type) {
                        case 'py':
                            type = 0;
                            name = "Python";
                            break;
                        case 'API':
                            type = 1;
                            name = "远程API";
                            break;
                        case 'KPI':
                            type = 2;
                            name = "KPI";
                            break;
                        case 'diagnose':
                            type = 3;
                            name = "诊断";
                            break;
                        case 'fr':
                            type = 4;
                            name = "模糊规则";
                            break;
                        case 'return':
                            type = 5;
                            name = "回归";
                            break;
                        case 'forecast':
                            type = 6;
                            name = "预测";
                            break;
                        case 'Fa':
                            type = 7;
                            name = "傅里叶分析";
                            break;
                        case 'Wa':
                            type = 8;
                            name = "小波分析";
                            break;
                        case 'Fc':
                            type = 9;
                            name = "拟合曲线";
                            break;
                        case 'Hc':
                            type = 10;
                            name = "历史曲线";
                            break;
                        case 'rule':
                            type = 11;
                            name = "规则";
                            break;
                    }

                    var opt;
                    if (info.dataId) {

                        WebAPI.get('/strategy/template/' + info.dataId).done(function(rs) {
                            if (rs.status === 'OK') {
                                var inputs = [],
                                    outputs = [];
                                actions.getInputAndOutput(rs.data.data.modules).forEach(put => {
                                    inputs = inputs.concat(put.input);
                                    outputs = outputs.concat(put.output);
                                });;

                                type = 1;
                                name = rs.data.data.strategy.name;
                                desc = rs.data.data.strategy.desc;
                                opt = { // 无模板引用的模块
                                    // 模块编号
                                    '_id': ObjectId(),
                                    'strategyId': id,
                                    // 模块调用方式：0，python代码；1，引用模板；2，远程REST服务调用；3，LaTex；4，固有控件
                                    'type': type,
                                    // 模块名称
                                    'name': name,
                                    // 模块描述
                                    'desc': desc,
                                    // 配置项，根据type类型不同，而稍有差别，但都有input、output、content
                                    'option': {
                                        // 输入参数
                                        'input': inputs,
                                        // 输出参数
                                        'output': outputs,
                                        // 内容
                                        'content': {

                                        }
                                    },
                                    'loc': {
                                        'x': x,
                                        'y': y,
                                        'w': 155,
                                        'h': 72
                                    }
                                };
                                actions.dispatch({
                                    type: constants.painter.ADD_MODULE,
                                    value: opt
                                });
                            }
                        }).fail(function() {
                            alert('获取模板数据失败')
                        });

                    } else {
                        opt = { // 无模板引用的模块
                            // 模块编号
                            '_id': ObjectId(),
                            'strategyId': id,
                            // 模块调用方式：0，python代码；1，引用模板；2，远程REST服务调用；3，LaTex；4，固有控件
                            'type': type,
                            // 模块名称
                            'name': name,
                            // 模块描述
                            'desc': '高大上的玩意儿，你猜是干嘛的',
                            // 配置项，根据type类型不同，而稍有差别，但都有input、output、content
                            'option': {
                                // 输入参数
                                'input': [],
                                // 输出参数
                                'output': [],
                                // 内容
                                'content': {

                                }
                            },
                            'loc': {
                                'x': x,
                                'y': y,
                                'w': 155,
                                'h': 72
                            }
                        };
                    }

                    actions.dispatch({
                        type: constants.painter.ADD_MODULE,
                        value: opt
                    });
                }
            }
        },
        getInputAndOutput: function(data) {
            var repeat = {};
            var a = [];
            data.forEach(module => {
                module.option.input.forEach(input => {
                    if (input.type == 100) {
                        repeat[input.refId] ? repeat[input.refId].push(input.name) : repeat[input.refId] = [input.name];
                    }
                });
            });
            data.forEach(module => {
                var inputs = [],
                    outputs = [];
                var isNeedCheck = repeat[module['_id']];
                module.option.input.forEach(input => {
                    if (input.type != 100) {
                        inputs.push(input);
                    }
                });
                module.option.output.forEach(output => {
                    if (!(isNeedCheck && isNeedCheck.indexOf(output.name) > -1)) {
                        outputs.push(output);
                    }
                });
                a.push({
                    id: module['_id'],
                    input: inputs,
                    output: outputs
                });
            });
            return a;
        },
        batchConfig: function(data) {
            actions.dispatch({
                type: constants.modal.SHOW_MODAL,
                modalType: 'BatchConfigModal',
                props: data
            });
        },
        debugClick: function() {
            actions.dispatch({
                type: constants.modal.SHOW_MODAL,
                modalType: 'DebugModal',
                props: undefined
            });
        },
        saveClick: function() {

        },
        backClick: function() {
            actions.dispatch({
                type: constants.toolbar.EXIT_STRATEGY
            });
        }
    };
    var bd = new Calculation.Main({
        width: 1000,
        height: 800
    });
    var outputIdsSet = new Set(),
        moduleIdsSet = new Set();
    var outputArr = [];
    var theme = {
        paint: function(model) {
            return this.createModul(model).concat(this.createInAndOut(model)).concat(this.createLines(model));
        },
        createModul: function(model) {
            var result = [];
            //生成策略模块
            model.modules.forEach((module, i) => {
                actions.valueArr[i] = actions.valueArr[i] || {};
                moduleIdsSet.add(module['_id']);
                var block = new SketchpadChild(module);
                result.push(h(GShapeGroup, {
                    id: module['_id'],
                    x: module.loc.x,
                    y: module.loc.y,
                    width: module.loc.w,
                    height: module.loc.h,
                    draggable: true,
                    store: module,
                    block: block,
                    isSelected: actions.selectedModulesIds.indexOf(module['_id']) > -1,
                    customEvent: {
                        close: actions.moduleClose,
                        config: linkEvent(module['_id'], actions.moduleConfig),
                        select: actions.moduleSelect,
                        dragend: actions.dragend
                    }
                }));
                bd.add(block);
            });
            return result;
        },
        createInAndOut: function(model) {
            var result = [];
            var inputNameSet = new Set();
            //生成策略模块的输出
            model.modules.forEach((module, i) => {
                var block = bd.findBlockById(module['_id']);
                var outputsWithoutLoc = [];

                //生成策略模块输出参数
                module.option.output.forEach((output) => {
                    if (output.loc == undefined) { //收集没有loc的输出并跳过生成 
                        outputsWithoutLoc.push(output);
                        return;
                    }
                    createOutput.bind(this)(output);
                });

                //策略模块输出参数默认位置生成
                var newOutputsLoc = bd.createSortInfo(block, outputsWithoutLoc.length, 'output');

                newOutputsLoc.forEach((loc, i) => {
                    outputsWithoutLoc[i].loc = loc;
                    createOutput.bind(this)(outputsWithoutLoc[i]);
                });

                function createOutput(output) {
                    outputIdsSet.add(output.name);
                    var id = ObjectId() + '_' + module['_id'];
                    var block = new SketchpadChild(output, 'output', id);
                    outputArr.push(block);
                    result.push(h(GOutputGroup, {
                        id: id,
                        name: 'output_' + module['_id'],
                        x: output.loc.x,
                        y: output.loc.y,
                        width: output.loc.w,
                        height: output.loc.h,
                        draggable: true,
                        store: output,
                        block: block,
                        customEvent: {
                            dragend: actions.dragend,
                            merge: actions.merge
                        }
                    }));
                    bd.add(block);
                }
            });

            //生成策略模块的输入
            model.modules.forEach((module, index) => {
                var block = bd.findBlockById(module['_id']);
                var inputsWithoutLoc = [];

                //生成策略模块输入参数
                module.option.input.forEach((input, i) => {
                    if (input.loc == undefined) { //收集没有loc的输入并跳过生成 
                        inputsWithoutLoc.push(input);
                        return;
                    }
                    createInput.bind(this)(input);
                });

                //策略模块输入参数默认位置生成
                var newInputsLoc = bd.createSortInfo(block, inputsWithoutLoc.length, 'input');
                newInputsLoc.forEach((loc, i) => {
                    inputsWithoutLoc[i].loc = loc;
                    createInput.bind(this)(inputsWithoutLoc[i]);
                });

                function createInput(input) {
                    var block;
                    if (input.type == 100 && input.refId && moduleIdsSet.has(input.refId) && outputIdsSet.has(input.name)) {
                        block = bd.find({
                            'opt.name': input.name,
                            'child.id': input.refId
                        })[0];
                        block.toBeInput(module['_id']);
                    } else {
                        //name检测
                        var rename = function(name, num) {
                            if (inputNameSet.has(name)) {
                                var arr = name.split('_'),
                                    last = parseInt(arr[arr.length - 1]);;
                                if (isNaN(last)) {
                                    arr.push(++num);
                                } else {
                                    num = ++last;
                                    arr[arr.length - 1] = num;
                                }
                                name = arr.join('_');
                                return rename(name, num);
                            } else {
                                inputNameSet.add(name);
                                return name;
                            }
                        }
                        input.name = rename(input.name, 0);
                        var id = ObjectId() + '_' + module['_id'];
                        block = new SketchpadChild(input, 'input', id);
                        result.push(h(GInputGroup, {
                            id: id,
                            name: 'input_' + module['_id'],
                            x: input.loc.x,
                            y: input.loc.y,
                            width: input.loc.w,
                            height: input.loc.h,
                            draggable: true,
                            store: input,
                            block: block,
                            showName: actions.valueArr[index][input.name],
                            customEvent: {
                                toOutput: actions.toOutput,
                                dragend: actions.dragend
                            }
                        }));
                        // gInputShape.on('toOutput', this.actions.toOutput);
                        // gInputShape.fire('updateText', { data: nameMap[input.name] });
                    }
                    bd.add(block);
                }

            });

            return result;
        },
        createLines: function(model) {
            var result = [];
            //清空箭头线 防止重复
            // this.layer.find('.GArrow').destroy();
            var allLines = bd.getAllLines();
            allLines.forEach((lines) => {
                result.push(h(GArrowGroup, {
                    id: 'line_' + lines.id,
                    name: 'GArrow',
                    x: 0,
                    y: 0,
                    store: lines,
                    isSelected: actions.selectedModulesIds.indexOf(lines.id) > -1
                }));
            });
            return result;
        },
        rightBtnGroup: function(data) {
            return (
                h('div', {
                    className: 'btn-group fr',
                    style: {
                        border: 'none',
                        padding: '0',
                        position: 'absolute',
                        top: '12px',
                        right: '12px'
                    }
                }, [
                    theme.batchConfigBtn(data), theme.exportBtn(), theme.debugBtn(), theme.saveBtn.call(this), theme.animateBtn(), theme.backBtn()
                ])
            )
        },
        batchConfigBtn: function(data) {
            return (
                h('button', { className: 'btn btn-primary', onClick: linkEvent(data, actions.batchConfig) }, ['批量配置参数'])
            )
        },
        exportBtn: function() {
            return (
                h('button', { className: 'btn btn-primary', onClick: actions.debugClick }, ['导出'])
            )
        },
        debugBtn: function() {
            return (
                h('button', { className: 'btn btn-primary', onClick: actions.debugClick }, ['调试'])
            )
        },
        saveBtn: function() {
            return (
                h('button', { id: 'saveBtn', className: 'btn btn-primary', onClick: linkEvent({}, this.props.handleSync) }, ['保存'])
            )
        },
        animateBtn: function() {
            return (
                h('button', { id: 'saveAnimate', className: 'btn btn-primary' }, [this.saveAnimate()])
            )
        },
        backBtn: function() {
            return (
                h('button', { className: 'btn btn-primary fl', onClick: actions.backClick }, ['返回'])
            )
        },
        saveAnimate: function() {
            return (
                h('div', { className: 'spCss ' }, [
                    h('div', { className: 'rect1' }),
                    h('div', { className: 'rect2' }),
                    h('div', { className: 'rect3' }),
                    h('div', { className: 'rect4' }),
                    h('div', { className: 'rect5' })
                ])
            )
        }
    };

    var preventFn = function(e) { e.preventDefault(); };

    class Sketchpad extends React.Component {

        constructor(props, context) {
            super(props, context);

            this.state = {};
            this.HEIGHT = 800;
            this.WIDTH = 1000;

            this.refs = {};
        }

        refDefine(name) {
            var refs = this.refs = this.refs || {};

            return function(dom) {
                refs[name] = dom;
            };
        }

        componentDidMount() {
            var stage = this.refs.stage.getStage();
            var style = {
                width: '1260px',
                height: '886px'
            }//window.getComputedStyle(this.refs.domWrap);

            stage.setWidth(parseFloat(style.width));
            stage.setHeight(parseFloat(style.height));
            this.WIDTH = parseFloat(style.width);
            this.HEIGHT = parseFloat(style.height);
            bd.resize({
                width: style.width,
                height: style.height
            });
        }

        componentWillUnmount() {}

        render() {
            var model = this.props.tempStrategy,
                selectedModulesIds = this.props.selectedModulesIds;
            actions.dispatch = actions.dispatch || this.context.dispatch;
            actions.model = model;
            actions.selectedModulesIds = selectedModulesIds;
            actions.valueArr = model.strategy.value || [];
            bd = new Calculation.Main({
                width: this.WIDTH,
                height: this.HEIGHT
            });
            return (
                h('#sketchpadWrap.gray-scrollbar', {
                    ref: this.refDefine('domWrap'),
                    style: {
                        width: '100%',
                        height: 'calc(100% - 74px)',
                        position: 'relative',
                        zIndex: 10,
                        overflow: 'auto'
                    },
                    onDragStart: preventFn,
                    onDragOver: preventFn,
                    onDrop: actions.drop(this.props.tempStrategy.strategy._id)
                }, [
                    theme.rightBtnGroup.call(this, this.props.tempStrategy.strategy.value),
                    h(ReactKonva.Stage, {
                        ref: this.refDefine('stage')
                    }, [
                        h(ReactKonva.Layer,
                            theme.paint(model)
                        )
                    ])
                ])
            );
        }
    }

    exports.Sketchpad = Sketchpad;
}));