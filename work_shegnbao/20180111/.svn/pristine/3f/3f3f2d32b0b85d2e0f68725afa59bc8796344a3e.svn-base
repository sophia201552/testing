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
                let isSelected = attrs.selectedIds && attrs.selectedIds.indexOf(line.id.split('_')[1])>=0;
                result.push(h(ReactKonva.Line, {
                    id: line.id,
                    key: line.id,
                    name: 'line ' + line.id.split('_')[0] + ' oneLine_' + line.id.split('_')[1],
                    points: line.points,
                    stroke: (attrs.isSelected ||isSelected) ? '#f6a405' : '#6f7777',
                    strokeWidth: 1,
                    lineCap: 'round',
                    lineJoin: 'round'
                }));
            });
            return result;
        },
        createAlignLines: function(attrs) {
            var result = [];
            var info = [{
                name: 'left',
                key: 'left',
                points: [attrs.x, attrs.y-attrs.h, attrs.x, attrs.y+attrs.h],
                stroke: 'red',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round',
                visible: false
            }, {
                name: 'top',
                key: 'top',
                points: [attrs.x-attrs.w, attrs.y, attrs.x+attrs.w, attrs.y],
                stroke: 'red',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round',
                visible: false
            }, {
                name: 'right',
                key: 'right',
                points: [attrs.x + attrs.width, attrs.y-attrs.h, attrs.x + attrs.width, attrs.y+attrs.h],
                stroke: 'red',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round',
                visible: false
            }, {
                name: 'bottom',
                key: 'bottom',
                points: [attrs.x-attrs.w, attrs.y + attrs.height, attrs.x+attrs.w, attrs.y + attrs.height],
                stroke: 'red',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round',
                visible: false
            }];
            info.forEach(function(v) {
                result.push(h(ReactKonva.Line, v));
            });
            return result;
        }
    };

    class GArrowGroup extends React.Component {

        constructor(props) {
            super(props);
        }

        render() {
            var attrs = this.props;
            return (
                h(ReactKonva.Group, this.props, theme.createLines(attrs))
            );
        }

    }

    class GAlignmentLineGroup extends React.Component {

        constructor(props) {
            super(props);
        }

        render() {
            var attrs = this.props;
            return (
                h(ReactKonva.Group, {
                    id: attrs.id,
                    key: attrs.id,
                    name: 'alignmentLine',
                    x: 0,
                    y: 0,
                    onUpdate: attrs.onUpdate
                }, theme.createAlignLines(attrs))
            );
        }
    }


    exports.GArrowGroup = GArrowGroup;
    exports.GAlignmentLineGroup = GAlignmentLineGroup;
}));