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