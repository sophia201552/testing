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
        SIZE_BTN_SIZE = 10,
        CORNERRADIUS = 50,
        FONTSIZE = 14,
        SMALLFONTSIZE = 12;
    var $textWidth = $('#textWidth').css('fontSize', FONTSIZE + 'px');
    class GInputGroup extends React.Component {

        constructor(props) {
            super(props);
        }

        createEvents(){
            var _this = this;
            var mouseDownTime, mouseUpTime, mouseDownPos;
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
            return {
                likeClick: function(e) {
                    mouseDownTime = +new Date;
                    mouseDownPos = {
                        x: e.evt.clientX,
                        y: e.evt.clientY
                    }
                },
                nameTextClick: function(e) {
                    if (+new Date - (mouseDownTime || 0) > 200 || Math.abs(e.evt.clientX - mouseDownPos.x) > 30 || Math.abs(e.evt.clientY - mouseDownPos.y) > 30) {
                        return;
                    }
                    // if(+new Date - (mouseUpTime || 0) <= 300){
                        //双击事件
                    // }
                    _this.props.customEvent.changeValue({
                        id:this.parent.attrs.store._id,
                        tittle: I18n.resource.modal.DEBUGGING_VALUES,
                        input:true,
                        isShow: true,
                    });
                    mouseUpTime = +new Date;
                },
                nameTextClickFire: function(e){

                    _this.props.customEvent.changeValue({
                        id:this.parent.attrs.store._id,
                        tittle:I18n.resource.modal.VIEW_AS_TEXT,
                        input:false,
                        isShow: true,
                    });
                },
                dragLayerClick: function(e) {
                    if (+new Date() - (mouseDownTime || 0) > 200 || Math.abs(e.evt.clientX - mouseDownPos.x) > 30 || Math.abs(e.evt.clientY - mouseDownPos.y) > 30) {
                        return;
                    }
                    
                    _this.props.customEvent.select(this.parent.attrs.id.split('_')[0],this.parent.parent);
                },
                dragLayerClickFire: function(e) {
                    
                    let isSelected = e.isSelected,
                        dragLayer = e.target,
                        group = dragLayer.parent,
                        layer = group.parent,
                        lineLayer = layer.parent.find('#lineLayer')[0],
                        nameText = getCustomMember('nameText', group);
                    let moduleId = group.attrs.id.split('_')[1],
                        inputId = group.attrs.id.split('_')[0];
                    dragLayer.fill(isSelected?'#f6a405':'#697174');
                    nameText.fill(isSelected?'#fff':'#9fb0b8');
                    lineLayer.find('.oneLine_'+inputId).forEach(l=>{
                        l.stroke(isSelected?'#f6a405' : '#6f7777');
                    });
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
            var attrs = this.props,
                actions = this.createEvents();
            var showType = enumerators.moduleInputOutputTypeNames[Number(attrs.store.type)],
                showName,showDs;
            var isDebug = !attrs.draggable;
            
            showDs = attrs.showDs&&(enumerators.moduleInputOutputTypes.DATA_SOURCE == attrs.store.type || enumerators.moduleInputOutputTypes.INPUT_DIAGNOSIS_FUZZYRULE == attrs.store.type || enumerators.moduleInputOutputTypes.STRING == attrs.store.type || enumerators.moduleInputOutputTypes.INPUT_HISTORY_DATA_SOURCE == attrs.store.type)&&/^@\d+\|[\S ]+$/.test(attrs.showDs)&& attrs.showDs.split('|')[1] || '';
            showName = (attrs.store.desc&&attrs.store.desc!=='')?attrs.store.desc:attrs.store.name;
            if(isDebug && attrs.value!==undefined){
                showName = showName+'：'+attrs.value;
            }

            var showDsWidth = $textWidth.css('fontSize', SMALLFONTSIZE + 'px').text(showDs).width()*1.2,
                typeWidth = $textWidth.css('fontSize', SMALLFONTSIZE + 'px').text(showType).width()*1.2,
                textWidth = $textWidth.css('fontSize', FONTSIZE + 'px').text(showName).width();
            var textPadding = 10;
            var rowWidth = attrs.width - 2 * textPadding;
            var rows = Math.min(2,Math.ceil(textWidth / rowWidth));
            var textHeight = Math.min(FONTSIZE * rows, attrs.height);
            if((rows == 2 && textWidth>=rowWidth*rows-2*textPadding-2) || /[\n\r]/.test(showName)){
                if(isDebug && attrs.value!=undefined){
                    showName = ((attrs.store.desc&&attrs.store.desc!=='')?attrs.store.desc:attrs.store.name)+' '+'@';
                    textWidth = $textWidth.text(showName).width();
                    rows = Math.min(2,Math.ceil(textWidth / (rowWidth-5)));
                    textHeight = Math.min(FONTSIZE * rows, attrs.height);
                }else{
                    let row1 = showName.substring(0,25);
                    let loopRow1 = (row1)=>{
                        textWidth = $textWidth.text(row1).width();
                        if(textWidth>=rowWidth-textPadding){
                            row1 = row1.substring(0,row1.length-1);
                            return loopRow1(row1);
                        }else{
                            return row1;
                        }
                    };
                    let loopRow2 = (row2)=>{
                        textWidth = $textWidth.text(row2).width();
                        if(textWidth>=rowWidth-textPadding){
                            row2 = row2.substring(0,row2.length-4)+'...';
                            return loopRow2(row2);
                        }else{
                            return row2;
                        }
                    };
                    row1 = loopRow1(row1);
                    let row2 = showName.substring(row1.length)+'...';
                    row2 = loopRow2(row2);
                    showName = row1+row2;
                }
            }
            
            var doNth = function(){};
            var isSelected = this.props.isSelected==undefined?false:this.props.isSelected;
            return (
                h(ReactKonva.Group, this.props, [
                    h(ReactKonva.Rect, {
                        x: 0,
                        y: 0,
                        key: 'dragLayer',
                        name: 'dragLayer',
                        width: attrs.width,
                        height: attrs.height,
                        cornerRadius: attrs.width / 5,
                        fill: isSelected?'#f6a405':'#697174',
                        onMouseDown: actions.likeClick,
                        onMouseUp: actions.dragLayerClick,
                        onDragLayerClickFire: actions.dragLayerClickFire
                    }),
                    h(ReactKonva.Text, {
                        x: textPadding,
                        y: (attrs.height - textHeight) / 2,
                        key: 'nameText',
                        name: 'nameText',
                        text: showName,
                        fontSize: FONTSIZE,
                        fontFamily: '微软雅黑',
                        fill: isDebug?'rgb(45, 183, 245)':isSelected ? '#fff' : '#9fb0b8',
                        width: attrs.width - 2 * textPadding,
                        height: textHeight,
                        align: 'center',
                        onMouseDown: actions.likeClick,
                        onMouseUp: isDebug?actions.nameTextClick:actions.dragLayerClick,
                        onNameTextDbClick: isDebug?actions.nameTextClickFire:doNth,
                    }),
                    h(ReactKonva.Text, { 
                        x: 0,
                        y: 0,
                        key: 'typeText',
                        name: 'typeText',
                        text: showType,
                        fontSize: SMALLFONTSIZE,
                        fontFamily: '微软雅黑',
                        fill: '#849299',
                        width: typeWidth,
                        height: SMALLFONTSIZE,
                        align: 'center',
                        // padding: PADDING,
                        offsetY: -attrs.height-PADDING,
                        offsetX: (typeWidth - attrs.width)/2
                    }),
                    h(ReactKonva.Text, { 
                        x: 0,
                        y: 0,
                        key: 'dsText',
                        name: 'dsText',
                        text: showDs,
                        fontSize: SMALLFONTSIZE,
                        fontFamily: '微软雅黑',
                        fill: '#849299',
                        width: showDsWidth,
                        height: SMALLFONTSIZE,
                        align: 'center',
                        // padding: PADDING,
                        offsetY: SMALLFONTSIZE+PADDING,
                        offsetX: (showDsWidth - attrs.width)/2
                    }),
                ])
            );
        }

    }


    exports.GInputGroup = GInputGroup;
}));