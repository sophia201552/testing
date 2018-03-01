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

            var mouseDownTime, mouseDownPos;
            var MINWIDTH = 155,
                MINHEIGHT = 72;
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
                resizeDragStart: function() {
                    this.parent.children.forEach((v) => {
                        if (!(v.name() == 'dragLayer' || v.name() == 'size')) {
                            v.visible(false);
                        }
                    });
                    let lineLayer = this.parent.parent.find('#lineLayer')[0];
                    clearLines(lineLayer);
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
                    let refOutputId = this.parent.attrs.store.option.input[0] && this.parent.attrs.store.option.input[0].refOutputId;
                    if(!_this.props.draggable){
                        _this.props.customEvent.select(this.parent.attrs.id,this.parent.attrs.store.type, refOutputId);
                    }else{
                        _this.props.customEvent.select(this.parent.attrs.id,this.parent.parent);
                    }
                    
                },
                dragLayerClickFire: function(e) {
                    let isSelected = e.isSelected,
                        dragLayer = e.target,
                        group = dragLayer.parent,
                        layer = group.parent,
                        lineLayer = layer.parent.find('#lineLayer')[0],
                        nameText = getCustomMember('nameText', group),
                        close = getCustomMember('close', group),
                        config = getCustomMember('config', group),
                        size = getCustomMember('size', group);
                    dragLayer.fill(isSelected?'#f6a405':'#697174');
                    nameText.fill(isSelected?'#fff':'#cee2ec');
                    close.image(isSelected?image2:image);
                    config.image(isSelected?image2:image);
                    size.image(isSelected?image2:image);
                    lineLayer.find('.line_'+group.attrs.id)[0].find('.line').forEach(l=>{
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
                closeClick: function(e) {
                    if (+new Date() - (mouseDownTime || 0) > 200 || Math.abs(e.evt.clientX - mouseDownPos.x) > 30 || Math.abs(e.evt.clientY - mouseDownPos.y) > 30) {
                        return;
                    }
                    var attrs = this.parent.attrs,
                        layer = this.parent.parent;

                    attrs.block.remove(); //清除画板中block相关信息

                    _this.props.customEvent.close(attrs.id);
                    // createLines(attrs, layer); //更新线段
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

            var type = enumerators.moduleTypeNames[Number(attrs.store.type)];
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
                        fill: isSelected ? '#f6a405' : '#697174',
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
                    h(ReactKonva.Image, {
                        x: attrs.width - OPTION_BTN_SIZE - PADDING - STROKE_WIDTH / 2,
                        y: PADDING,
                        key: 'close',
                        name: 'close',
                        width: OPTION_BTN_SIZE,
                        height: OPTION_BTN_SIZE,
                        image: isSelected ? image2 : image,
                        visible: !isDebug,
                        crop: {
                            x: 16.5,
                            y: 0,
                            width: 16,
                            height: 16
                        },
                        strokeHitEnabled: false,
                        transformsEnabled: 'position',
                        onMouseDown: isDebug?doNth:actions.likeClick,
                        onMouseUp: isDebug?doNth:actions.closeClick
                    }),
                    h(ReactKonva.Image, {
                        x: attrs.width - OPTION_BTN_SIZE - PADDING - STROKE_WIDTH / 2 - PADDING - OPTION_BTN_SIZE,
                        y: PADDING,
                        key: 'config',
                        name: 'config',
                        width: OPTION_BTN_SIZE,
                        height: OPTION_BTN_SIZE,
                        image: isSelected ? image2 : image,
                        visible: !isDebug,
                        crop: {
                            x: 0,
                            y: 0,
                            width: 16.5,
                            height: 16
                        },
                        strokeHitEnabled: false,
                        transformsEnabled: 'position',
                        onMouseDown: isDebug?doNth:actions.likeClick,
                        onMouseUp: isDebug?doNth:actions.configClick
                    }),
                    h(ReactKonva.Image, {
                        x: attrs.width - STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2,
                        y: attrs.height - STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2,
                        key: 'size',
                        name: 'size',
                        width: SIZE_BTN_SIZE,
                        height: SIZE_BTN_SIZE,
                        image: isSelected ? image2 : image,
                        visible: !isDebug,
                        crop: {
                            x: 32.5,
                            y: 0,
                            width: 16,
                            height: 16
                        },
                        draggable: true,
                        strokeHitEnabled: false,
                        transformsEnabled: 'position',
                        onDragStart: isDebug?doNth:actions.resizeDragStart,
                        onDragMove: isDebug?doNth:actions.resizeDragMove,
                        onDragEnd: isDebug?doNth:actions.resizeDragEnd
                    })
                ])
            );
        }

    }


    exports.GShapeGroup = GShapeGroup;
}));