;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            'React'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('React')
        );
    } else {
        factory(
            root,
            namespace('ReactRedux'),
            namespace('beop.strategy.common'),
            namespace('beop.strategy.components.DebugView')
        );
    }
}(namespace('beop.strategy.containers'), function(
    exports,
    ReactRedux,
    commonUtil,
    DebugView
) {
    const deepClone = $.extend.bind($, true);
    var mapDispatchToProps = function(dispatch) {
        var sketchpadActions = namespace('beop.strategy.modules.Sketchpad').actions,
            painterActions = namespace('beop.strategy.modules.Painter.actions'),
            actions = namespace('beop.strategy.modules.DebugView').actions;
        var oldIndex;
        var events = {
            doBack: function() {
                dispatch(actions.clear());
                dispatch(sketchpadActions.doBack());
            },
            doRun: function(info,startFn,endFn) {
                dispatch(actions.doRun(info,startFn,endFn));
            },
            doClear: function(){
                dispatch(actions.doClear());
            },
            moduleMouseOver: function(e) {
                if (e.target.attrs.name == 'typeText') {
                    document.getElementById('debugSketchpadWrap').style.cursor = 'default';
                } else if (e.target.attrs.name == 'size') {
                    document.getElementById('debugSketchpadWrap').style.cursor = 'se-resize';
                } else {
                    document.getElementById('debugSketchpadWrap').style.cursor = 'pointer';
                }
            },
            moduleMouseOut: function(e) {
                document.getElementById('debugSketchpadWrap').style.cursor = 'default';
            },
            moduleMouseEnter: function(e) {
                var layer = this.parent;
                this.find('.dragLayer')[0].shadowEnabled(true);
                oldIndex = this.getZIndex();
                this.moveToTop();
                layer.draw();
            },
            moduleMouseLeave: function(e) {
                var layer = this.parent;
                this.find('.dragLayer')[0].shadowEnabled(false);
                this.setZIndex(oldIndex);
                layer.draw();
            },
            inputMouseEnter: function(e) {
                oldIndex = this.getZIndex();
                this.moveToTop();
                this.parent.draw();
            },
            inputMouseLeave: function(e) {
                this.setZIndex(oldIndex);
                this.parent.draw();
            },
            outputMouseEnter: function(e) {
                oldIndex = this.getZIndex();
                this.moveToTop();
                this.parent.draw();
            },
            outputMouseLeave: function(e) {
                this.setZIndex(oldIndex);
                this.parent.draw();
            },
            putMouseOver: function(e) { //鼠标手势
                if (e.target.attrs.name == 'typeText' || e.target.attrs.name == 'dsText') {
                    document.getElementById('debugSketchpadWrap').style.cursor = 'default';
                }else {
                    document.getElementById('debugSketchpadWrap').style.cursor = 'pointer';
                }
            },
            putMouseOut: function() { //鼠标手势
                document.getElementById('debugSketchpadWrap').style.cursor = 'default';
            },
            stageWheel:function(e){
                var num = -1;
                if (e.nativeEvent.wheelDelta > 0) {
                    num = 1
                }
                //记录缩放前鼠标在画板位置
                var $this = $(e.target);
                var offset = $this.offset(),
                    stageOffset = this.stage.offset();
                var x = e.clientX / this.scale - offset.left / this.scale + stageOffset.x,
                    y = e.clientY / this.scale - offset.top / this.scale  + stageOffset.y;

                var scale = Math.min(Math.max(0.25,this.scale + 0.05 * num),1.5);
                var dW = this.WIDTH/scale,
                    dH = this.HEIGHT/scale;

                this.stage.setWidth(this.WIDTH);
                this.stage.setHeight(this.HEIGHT);
                this.stage.scaleX(scale);
                this.stage.scaleY(scale);
                this.scale = scale;

                //缩放前后鼠标在画板位置差值
                var x2 = e.clientX / scale - offset.left / scale + stageOffset.x -x,
                    y2 = e.clientY / scale - offset.top / scale  + stageOffset.y -y;
                //画板位移 保持鼠标与画板位置对比
                this.stage.offset({
                    x:-x2+stageOffset.x,
                    y:-y2+stageOffset.y
                });
                this.layer.draw();
                
                //重新渲染缓冲
                if(this.scaleTimer){
                    clearTimeout(this.scaleTimer);
                }
                this.scaleTimer = setTimeout(()=>{
                    this.setState({
                        scale:this.scale
                    });
                    this.scaleTimer = undefined;
                },500);
            },
            stageMouseDown:function(e){
                if(e.nativeEvent.which==3){
                    var _this = this;
                    document.getElementById('debugSketchpadWrap').style.cursor = 'pointer';
                    var startPos = {
                        x:e.clientX,
                        y:e.clientY
                    }
                    var startOffset = _this.stage.offset();
                    // var minOffsetX = 1366*_this.scale - _this.WIDTH,
                    //     minOffsetY = 768*_this.scale - _this.HEIGHT;
                    $(e.target).off('mousemove').on('mousemove',function(evt){
                        var dx = evt.clientX - startPos.x - startOffset.x*_this.scale,
                            dy = evt.clientY - startPos.y - startOffset.y*_this.scale;
                        // _this.stage.offset({
                        //     x:Math.max(Math.min(-dx/_this.scale,minOffsetX),0),
                        //     y:Math.max(Math.min(-dy/_this.scale,minOffsetY),0)
                        // });
                        _this.stage.offset({
                            x:-dx/_this.scale,
                            y:-dy/_this.scale
                        });
                        _this.layer.draw();
                    });
                }
            },
            stageMouseUp:function(e){
                if(e.nativeEvent.which==3){
                    document.getElementById('debugSketchpadWrap').style.cursor = 'default';
                    $(e.target).off('mousemove');
                }
            },
            setDebugValue:function(list){
                dispatch(actions.setDebugValue(list));
            },
            closeValueModal:function(){
                dispatch(actions.closeValueModal());
            },
            clearConsole: function(){
                dispatch(actions.clearConsole());
            }
        };
        return events;
    }
    var mapStateToProps = function(state) {
        
        var copyObj = deepClone({}, {
            isDebug: state.painter.bShowDebugPanel,
            strategy: state.sketchpad.strategy,
            modules: state.sketchpad.modules,
            bShowConfigPanel: state.painter.bShowConfigPanel,
            consoleInfo: state.debugView.consoleInfo,
            debugValue: state.debugView.debugValue,
            selectedPutsId: state.debugView.selectedPutsId,
            selectedPutId: state.debugView.selectedPutId,
            runResult: state.debugView.runResult,
            selectedValueId: state.equipTree.selectedValueId,
            dbClickPut: state.debugView.dbClickPut,
        });
        return copyObj;
    }

    exports.DebugView = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(DebugView);
}));