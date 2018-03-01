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