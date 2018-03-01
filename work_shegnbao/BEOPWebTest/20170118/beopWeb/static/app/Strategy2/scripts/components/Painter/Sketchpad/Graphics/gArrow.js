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