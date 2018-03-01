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
            namespace('ReactKonva'),
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.components.Painter'), function(exports, React, ReactKonva, enumerators) {

    var h = React.h;

    var PADDING = 5,
        STROKE_WIDTH = 1,
        OPTION_BTN_SIZE = 15,
        OPTION_BTN_MARGGING = 5,
        SIZE_BTN_SIZE = 20,
        FONTSIZE = 14,
        SMALLFONTSIZE = 12;


    class GGroupShape extends React.Component {

        constructor(props) {
            super(props);
            this.rexizeX = undefined;
            this.rexizeY = undefined;
        }

        createEvents() {
            var _this = this;

            var mouseDownTime, mouseDownPos;
            var MINWIDTH = 170,
                MINHEIGHT = 60;
            var startLoc;
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
                    if (attrs.block == undefined || layer == undefined) return;
                    attrs.block.updateInfo();
                    attrs.block.getAllLines().forEach((lines) => {
                        var line = layer.find('#line_' + lines.id)[0];
                        line && line.fire('update', { date: lines });
                    });
                    layer.find('.GArrow').visible(true);
                    layer.draw();
                };

            return {
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
                    _this.props.customEvent.select(this.parent.attrs.id,this.parent.parent);
                    
                },
                dragLayerClickFire: function(e) {
                    let isSelected = e.isSelected,
                        dragLayer = e.target,
                        group = dragLayer.parent,
                        layer = group.parent,
                        lineLayer = layer.parent.find('#lineLayer')[0],
                        nameText = getCustomMember('nameText', group);
                    dragLayer.fill(isSelected?'#f6a405':'#108ee9');
                    nameText.fill(isSelected?'#fff':'#cee2ec');
                    lineLayer.find('.line_'+group.attrs.store._id)[0].find('.line').forEach(l=>{
                        l.stroke(isSelected?'#f6a405':'#6f7777');
                    })
                    lineLayer.find('.line_'+(group.attrs.id.split('_')[1]))[0].find('.oneLine_'+group.attrs.store._id).forEach(l=>{
                        l.stroke(isSelected?'#f6a405':'#6f7777');
                    })
                    if(isSelected){
                        group.addName('selected');
                    }else{
                        group.removeName('selected');
                    }
                    layer.draw();
                    lineLayer.draw();
                },
            }
        }

        render() {
            var attrs = this.props;
            var actions = this.createEvents();
            var type;
            switch(attrs.store.type){
                case 'consequence':
                    type = I18n && I18n.type === 'zh' ? '故障影响分组' : 'Consequence Group'
                    break;
            }
            var isSelected = this.props.isSelected,
                isDebug = !this.props.draggable,
                doNth = function(){};
            return (
                h(ReactKonva.Group, this.props, [
                    h(ReactKonva.Rect, {
                        x: 0,
                        y: 0,
                        key: 'dragLayer',
                        name: 'dragLayer',
                        width: attrs.width,
                        height: attrs.height,
                        cornerRadius: 8,
                        fill: isSelected ? '#f6a405' : '#108ee9',
                        strokeHitEnabled: false,
                        transformsEnabled: 'position',
                        shadowColor: '#f6a405',
                        shadowBlur: 10,
                        shadowEnabled: false,
                        onMouseDown: actions.likeClick,
                        onMouseUp: actions.dragLayerClick,
                        onDragLayerClickFire: actions.dragLayerClickFire
                    }),
                    h(ReactKonva.Text, {
                        x: 0,
                        y: (attrs.height - FONTSIZE) / 2,
                        key: 'nameText',
                        name: 'nameText',
                        text: (function(attrs) {
                            var txt = enumerators.fuzzyRuleFaultEffectNames[attrs.store.value];
                            // var maxNum = attrs.width / FONTSIZE;
                            // if (txt.length > maxNum) {
                            //     return txt.slice(0, maxNum) + '...';
                            // }
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
                        key: 'typeText',
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
                ])
            );
        }

    }


    exports.GGroupShape = GGroupShape;
}));