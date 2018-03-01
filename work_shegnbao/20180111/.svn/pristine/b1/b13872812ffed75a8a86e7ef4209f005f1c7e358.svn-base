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
            namespace('beop.strategy.components.Sketchpad'),
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.containers'), function(
    exports,
    ReactRedux,
    Sketchpad,
    enumerators
) {
    var mapDispatchToProps = function(dispatch) {
        var actions = namespace('beop.strategy.modules.Sketchpad.actions');
        var paintterActions = namespace('beop.strategy.modules.Painter.actions');
        var equiptreeActions = namespace('beop.strategy.modules.EquipTree.actions');
        var oldIndex, startLoc, startPos, alignmentLoc = {},
            SCALE = 1;
        var clearLines = function(layer) {
                layer.find('.GArrow').visible(false);
                layer.draw();
            },
            createLines = function(attrs, layer) {
                if (attrs.block == undefined || layer == undefined) return;
                let updateLines = (lines)=>{
                    let line = Array.from(layer.children).find(c=>c.attrs.id == ('line_' + lines.id));
                    line && line.fire('update', { date: lines });
                };
                attrs.block.updateInfo();
                switch(attrs.type){
                    case 'group':
                    case 'module':
                        attrs.block.getAllLines().forEach(updateLines);
                        break;
                    case 'input':
                        attrs.block.getOneLines().forEach(updateLines);
                        attrs.block.opt.refOutputId && attrs.block.remove();
                        break;
                    case 'output':
                        attrs.block.getOneLines().forEach(updateLines);
                        break;
                }
                layer.find('.GArrow').visible(true);
                layer.draw();
            },
            onDragBoundFunc = function(target) {
                var pos = target.getAbsolutePosition();
                var dx = Math.abs(pos.x - startPos.x),
                    dy = Math.abs(pos.y - startPos.y);

                if (dx >= dy + 10) {
                    target.y(startPos.y / SCALE);
                    target.dragBoundFunc(function(pos) {
                        return {
                            x: pos.x,
                            y: target.getAbsolutePosition().y
                        }
                    });
                } else if (dy >= dx + 10) {
                    target.x(startPos.x / SCALE);
                    target.dragBoundFunc(function(pos) {
                        return {
                            x: target.getAbsolutePosition().x,
                            y: pos.y
                        }
                    });
                }
            },
            changeInToOut = function(e, moduleId, refModuleId, outputId){
                let attrs = e.target.attrs;
                attrs.store.type = enumerators.moduleInputOutputTypes.OTHER_MODULES;
                attrs.store.refModuleId = refModuleId;
                attrs.store.refOutputId = outputId;
                let block = attrs.block.sketchpad.find({
                    'opt._id': outputId
                })[0];
                block && block.toBeInput(moduleId);
                e.target.visible(false);
                e.target.parent.draw();
            },
            changeOutToIn = function(e, refModuleId, moduleId, inputId){
                let parent =  e.target.parent.parent.find('#layer')[0];
                let target = parent.find('#'+inputId)[0]||Array.from(parent.children).find(c=>c.attrs.id==inputId);
                let outputId = e.target.attrs.store._id;
                let attrs = target.attrs;
                attrs.store.type = enumerators.moduleInputOutputTypes.OTHER_MODULES;
                attrs.store.refModuleId = refModuleId;
                attrs.store.refOutputId = outputId;
                let block = attrs.block.sketchpad.find({
                    'opt._id': outputId
                })[0];
                block && block.toBeInput(moduleId);
                attrs.block.remove();
                target.visible(false);
                target.parent.draw();
            },
            updateLoc = function(attrs, id, type, e) {
                var x, y, w, h;
                var sketchpad = attrs.block.sketchpad,
                    PADDING = sketchpad.PADDING + 1,
                    layer = sketchpad.layer;
                var obstacle = sketchpad.tools.intersectionByRect(sketchpad.tools.rectToPoints(attrs.x - PADDING, attrs.y - PADDING, attrs.width + 2 * PADDING, attrs.height + 2 * PADDING), sketchpad.obstacle);
                if (obstacle.length == 0 || (obstacle.length == 1 && obstacle[0].id == attrs.id)) {
                    x = attrs.x;
                    y = attrs.y;
                    w = attrs.width;
                    h = attrs.height;
                } else {
                    // x = startLoc.x;
                    // y = startLoc.y;
                    // w = startLoc.w;
                    // h = startLoc.h;
                    x = attrs.x;
                    y = attrs.y;
                    w = attrs.width;
                    h = attrs.height;
                    // _this.rexizeX = startLoc.w + STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;
                    // _this.rexizeY = startLoc.h + STROKE_WIDTH / 2 - SIZE_BTN_SIZE / 2;
                    let offset = layer.parent.offset();
                    if (type == 'output') {
                        let flag = false;
                        obstacle.forEach(function(v) {
                            if (!flag && v.type == 'input' && !v.parentMap.has(attrs.block.child.id) && !attrs.block.parentMap.has(v.parent.id) && sketchpad.tools.intersectionByPoint({ x: e.evt.layerX / SCALE+offset.x, y: e.evt.layerY / SCALE+offset.y }, v)) {
                                flag = true;
                                let input = v;
                                x = input.opt.loc.x;
                                y = input.opt.loc.y;
                                w = input.opt.loc.w;
                                h = input.opt.loc.h;
                                changeOutToIn(e, attrs.id.split('_')[1], input.id.split('_')[1], input.id);//内部
                                attrs.customEvent.outputToInput(input.id.split('_')[1], attrs.id.split('_')[1], input.opt._id,  attrs.store._id);//数据
                            }
                        });
                    }else if(type == 'input'){
                        let flag = false;
                        obstacle.forEach(function(v) {
                            if (!flag && v.type == 'output' && !attrs.block.parentMap.has(v.child.id) && !v.parentMap.has(attrs.block.parent.id) && sketchpad.tools.intersectionByPoint({ x: e.evt.layerX / SCALE+offset.x, y: e.evt.layerY / SCALE+offset.y }, v)) {
                                flag = true;
                                let output = v;
                                x = output.opt.loc.x;
                                y = output.opt.loc.y;
                                w = output.opt.loc.w;
                                h = output.opt.loc.h;
                                changeInToOut(e, attrs.id.split('_')[1], output.id.split('_')[1], output.opt._id);//内部
                                attrs.customEvent.outputToInput(attrs.id.split('_')[1], output.id.split('_')[1], attrs.store._id, output.opt._id);//数据
                            }
                        });
                    }
                }

                //内部
                attrs.block.setLoc({
                    x: Math.round(x),
                    y: Math.round(y),
                    w: w,
                    h: h
                });
                e.target.x(x);
                e.target.y(y);
                e.target.parent&&e.target.parent.draw();
                
                
                attrs.customEvent.updateLoc(id, {//数据
                    x: Math.round(x),
                    y: Math.round(y),
                    w: w,
                    h: h
                }, type, attrs.store._id);

            },
            putDragStart = function(stage, target){
                let dragLayer = stage.find('#dragLayer')[0];
                target.moveTo(dragLayer);
                stage.draw();
            },
            putDragEnd = function(stage, target){
                let layer = stage.find('#layer')[0];
                target.moveTo(layer);
                stage.draw();
            };
        var events = {
            doBatchConfig: function() {
                dispatch(actions.doBatchConfig());
            },
            doExport: function() {
                dispatch(actions.doExport());
            },
            doDebug: function() {
                let api = dispatch(namespace('beop.strategy.modules.Sketchpad').actions.doSave());
                api = api.async||api;
                if(api){
                    dispatch(paintterActions.toggleSpin());
                    api.done(function(){
                        dispatch(paintterActions.toggleModuleDebugPanel());
                        dispatch(paintterActions.toggleSpin());
                    });
                }else{
                    dispatch(paintterActions.toggleModuleDebugPanel());
                }
            },
            doConfigParams: function () {
                dispatch(
                    actions.showParamsConfigModal()
                );
            },
            doSave: function(fn) {
                return dispatch(actions.doSave(fn));
            },
            doBack: function(data) {
                dispatch(actions.doBack(data));
            },
            stageDrop: function(data, e) {
                dispatch(actions.stageDrop(data, e));
            },
            stageDragmove: function() {
                dispatch(actions.stageDragmove());
            },
            moduleClose: function(id) {
                dispatch(actions.moduleClose(id));
                dispatch(actions.syncStrategyValue());
                dispatch(namespace('beop.strategy.modules.ModulePropPanel.actions').setPropData());
            },
            moduleConfig: function(id) {
                dispatch(namespace('beop.strategy.modules.ModuleConfigPanel.actions').showModuleConfigPanel(id));
            },
            moduleSelect: function(selectedId,layer) {
                dispatch(actions.moduleSelect(selectedId,layer));
                dispatch(namespace('beop.strategy.modules.ModulePropPanel.actions').setPropData());
            },
            moduleMouseOver: function(e) { //鼠标手势
                if (e.target.attrs.name == 'typeText') {
                    document.getElementById('sketchpadWrap').style.cursor = 'default';
                } else if (e.target.attrs.name == 'size') {
                    document.getElementById('sketchpadWrap').style.cursor = 'se-resize';
                } else {
                    document.getElementById('sketchpadWrap').style.cursor = 'pointer';
                }
            },
            moduleMouseOut: function() { //鼠标手势
                document.getElementById('sketchpadWrap').style.cursor = 'default';
            },
            moduleMouseEnter: function(e) { //鼠标移入时给予提示 并提升到顶部
                var layer = this.parent;
                this.find('.dragLayer')[0].shadowEnabled(true);
                oldIndex = this.getZIndex();
                this.moveToTop();
                layer.draw();
            },
            moduleMouseLeave: function(e) { //鼠标移入时取消提示
                var layer = this.parent;
                this.find('.dragLayer')[0].shadowEnabled(false);
                this.setZIndex(oldIndex);
                layer.draw();
            },
            moduleDragStart: function(bd, e) { //水平垂直拖拽
                SCALE = bd.SCALE;
                var _this = e.currentTarget;
                var attrs = _this.attrs,
                    layer = _this.parent,
                    lineLayer = layer.parent.find('#lineLayer')[0];
                clearLines(lineLayer);
                startLoc = { x: attrs.x, y: attrs.y, w: attrs.width, h: attrs.height };
                startPos = _this.getAbsolutePosition();
                if (e.target.nodeType == 'Group') { //防止给改变大小按钮绑定move事件
                    _this.off('dragmove').on('dragmove', function(e) {
                        var evt = e.evt;
                        //水平垂直拖拽
                        if (evt.ctrlKey && _this.dragBoundFunc() == undefined) {
                            onDragBoundFunc(_this);
                            layer.draw();
                        }
                    });
                }
            },
            moduleDragEnd: function(e) {
                var attrs = this.attrs.customEvent.stageDragEnd(this);
                let layer = this.parent||this.attrs.block.sketchpad.layer,
                    lineLayer = layer.parent.find('#lineLayer')[0];
                updateLoc(attrs, attrs.id, 'module', e);
                this.dragBoundFunc(undefined);
                createLines(attrs, lineLayer);
                let alignmentLine = this.parent && Array.from(this.parent.children).find(c=>c.attrs.id == ('alignmentLine_'+attrs.id));
                alignmentLine && alignmentLine.fire('update', { date: attrs });
            },
            inputMouseEnter: function() {
                oldIndex = this.getZIndex();
                this.moveToTop();
                this.parent.draw();
            },
            inputMouseLeave: function() {
                this.setZIndex(oldIndex);
                this.parent.draw();
            },
            putMouseOver: function(e) { //鼠标手势
                if (e.target.attrs.name == 'typeText' || e.target.attrs.name == 'dsText') {
                    document.getElementById('sketchpadWrap').style.cursor = 'default';
                }else {
                    document.getElementById('sketchpadWrap').style.cursor = 'pointer';
                }
            },
            putMouseOut: function() { //鼠标手势
                document.getElementById('sketchpadWrap').style.cursor = 'default';
            },
            inputDragStart: function(bd, e) {
                SCALE = bd.SCALE;
                var _this = e.currentTarget;
                var attrs = _this.attrs;
                let lineLayer = _this.parent.parent.find('#lineLayer')[0];
                putDragStart(_this.parent.parent, e.target);
                clearLines(lineLayer);
                startPos = _this.getAbsolutePosition();
                startLoc = { x: attrs.x, y: attrs.y, w: attrs.width, h: attrs.height };
            },
            inputDragMove: function(e) {
                var evt = e.evt;
                //水平垂直拖拽
                if (evt.ctrlKey && this.dragBoundFunc() == undefined) {
                    onDragBoundFunc(this);
                    this.parent.draw();
                }
            },
            inputDragEnd: function(e) {
                var attrs = this.attrs.customEvent.stageDragEnd(this);
                updateLoc(attrs, attrs.id.split('_')[1], 'input', e);
                this.dragBoundFunc(undefined);
                let lineLayer = this.parent.parent.find('#lineLayer')[0];
                putDragEnd(this.parent.parent, e.target);
                createLines(attrs, lineLayer);
            },
            outputToInput: function(moduleId, refModuleId,inputId,outputId) {
                dispatch(actions.outputToInput(...arguments));
            },
            outputMouseEnter: function() {
                oldIndex = this.getZIndex();
                this.moveToTop();
                this.parent.draw();
            },
            outputMouseLeave: function() {
                this.setZIndex(oldIndex);
                this.parent.draw();
            },
            outputDragStart: function(bd, e) {
                SCALE = bd.SCALE;
                var _this = e.currentTarget;
                var attrs = _this.attrs;
                let lineLayer = _this.parent.parent.find('#lineLayer')[0];
                putDragStart(_this.parent.parent, e.target);
                clearLines(lineLayer);
                startPos = _this.getAbsolutePosition();
                startLoc = { x: attrs.x, y: attrs.y, w: attrs.width, h: attrs.height };
            },
            outputDragMove: function(e) {
                var evt = e.evt;
                //水平垂直拖拽
                if (evt.ctrlKey && this.dragBoundFunc() == undefined) {
                    onDragBoundFunc(this);
                    this.parent.draw();
                }
            },
            outputDragEnd: function(e) {
                var attrs = this.attrs.customEvent.stageDragEnd(this);
                updateLoc(attrs, attrs.id.split('_')[1], 'output', e);
                this.dragBoundFunc(undefined);
                let lineLayer = this.parent.parent.find('#lineLayer')[0];
                putDragEnd(this.parent.parent, e.target);
                createLines(attrs, lineLayer);
            },
            groupDragEnd: function(e) {
                var attrs = this.attrs.customEvent.stageDragEnd(this);
                let layer = this.parent||this.attrs.block.sketchpad.layer,
                    lineLayer = layer.parent.find('#lineLayer')[0];
                updateLoc(attrs, attrs.id, 'group', e);
                this.dragBoundFunc(undefined);
                createLines(attrs, lineLayer);
                // let alignmentLine = this.parent && Array.from(this.parent.children).find(c=>c.attrs.id == ('alignmentLine_'+attrs.id));
                // alignmentLine && alignmentLine.fire('update', { date: attrs });
            },
            groupSelect: function(selectedId,layer) {
                dispatch(actions.moduleSelect(selectedId,layer));
                dispatch(namespace('beop.strategy.modules.ModulePropPanel.actions').setPropData([]));
            },
            stageDragMove: function(data, e) {
                var bd = data.bd;
                var attrs = e.target.attrs,
                    layer = e.target.parent,
                    moduleLayer = layer.parent.find('#moduleLayer')[0];
                var isXChange = false,
                    isYChange = false;
                bd.blocks.forEach(function(block) {
                    if (block.id == attrs.id) {
                        return;
                    }
                    var group = Array.from(moduleLayer.children).find(c=>c.attrs.id==('alignmentLine_' + block.id));
                    if (group == undefined) {
                        return;
                    }
                    var left = group.find('.left')[0],
                        right = group.find('.right')[0],
                        top = group.find('.top')[0],
                        bottom = group.find('.bottom')[0];

                    var leftDx = Math.abs(attrs.x - block.opt.loc.x),
                        leftDx2 = Math.abs(attrs.x + attrs.width - block.opt.loc.x),
                        rightDx = Math.abs(attrs.x - block.opt.loc.x - block.opt.loc.w),
                        rightDx2 = Math.abs(attrs.x + attrs.width - block.opt.loc.x - block.opt.loc.w),
                        topDy = Math.abs(attrs.y - block.opt.loc.y),
                        topDy2 = Math.abs(attrs.y + attrs.height - block.opt.loc.y),
                        bottomDy = Math.abs(attrs.y - block.opt.loc.y - block.opt.loc.h),
                        bottomDy2 = Math.abs(attrs.y + attrs.height - block.opt.loc.y - block.opt.loc.h);
                    if (leftDx <= 5) {
                        alignmentLoc.x = block.opt.loc.x;
                        left.visible(true);
                        isXChange = true;
                    } else if (leftDx2 <= 5) {
                        alignmentLoc.x = block.opt.loc.x - attrs.width;
                        left.visible(true);
                        isXChange = true;
                    } else {
                        left.visible(false);
                    }

                    if (rightDx <= 5) {
                        alignmentLoc.x = block.opt.loc.x + block.opt.loc.w;
                        right.visible(true);
                        isXChange = true;
                    } else if (rightDx2 <= 5) {
                        alignmentLoc.x = block.opt.loc.x + block.opt.loc.w - attrs.width;
                        right.visible(true);
                        isXChange = true;
                    } else {
                        right.visible(false);
                    }

                    if (topDy <= 5) {
                        alignmentLoc.y = block.opt.loc.y;
                        top.visible(true);
                        isYChange = true;
                    } else if (topDy2 <= 5) {
                        alignmentLoc.y = block.opt.loc.y - attrs.height;
                        top.visible(true);
                        isYChange = true;
                    } else {
                        top.visible(false);
                    }

                    if (bottomDy <= 5) {
                        alignmentLoc.y = block.opt.loc.y + block.opt.loc.h;
                        bottom.visible(true);
                        isYChange = true;
                    } else if (bottomDy2 <= 5) {
                        alignmentLoc.y = block.opt.loc.y + block.opt.loc.h - attrs.height;
                        bottom.visible(true);
                        isYChange = true;
                    } else {
                        bottom.visible(false);
                    }
                });
                !isXChange && (alignmentLoc.x = undefined);
                !isYChange && (alignmentLoc.y = undefined);
                moduleLayer.draw();
            },
            stageDragEnd: function(target) {
                var attrs = target.attrs;
                target.x(alignmentLoc.x || attrs.x);
                target.y(alignmentLoc.y || attrs.y);
                let moduleLayer = target.parent && target.parent.parent.find('#moduleLayer')[0];
                if(moduleLayer){
                    let alignmentLine = moduleLayer.find('.alignmentLine');
                    alignmentLine && alignmentLine.forEach(child=>{child.children.visible(false)});
                    moduleLayer.draw && moduleLayer.draw();
                }
                alignmentLoc = {};
                return attrs;
            },
            stageWheel:function(e){
                var num = -1;
                if (e.nativeEvent.wheelDelta > 0) {
                    num = 1;
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
                this.stage.draw();
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
                    document.getElementById('sketchpadWrap').style.cursor = 'pointer';
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
                        _this.stage.draw();
                    });
                }
            },
            stageMouseUp:function(e){
                if(e.nativeEvent.which==3){
                    document.getElementById('sketchpadWrap').style.cursor = 'default';
                    $(e.target).off('mousemove');
                }
            },
            stageReload: function(){
                dispatch(actions.reload());
            },
            stageKeyDown: function(e){
                if(e.keyCode == 46){
                    dispatch(actions.deleteValue());
                    dispatch(namespace('beop.strategy.modules.ModulePropPanel.actions').setPropData());
                }
            },
            stageClear: function(){
                dispatch(namespace('beop.strategy.modules.Sketchpad.actions').moduleSelect('clear'));
                dispatch(namespace('beop.strategy.modules.ModulePropPanel.actions').setPropData());
            },
            updateLoc: function(moduleId, loc, type, id) {
                dispatch(actions.updateLoc(...arguments));
            },
            updateModule: function(moduleId, data) {
                dispatch(actions.updateLoc(...arguments));
            },
            isDiffData: function(modules){
                return actions.isDiffData(modules);
            },
            selectedValueChange: function(id){
                dispatch(equiptreeActions.changeSelectedValueId(id));
                dispatch(namespace('beop.strategy.modules.DebugParamsPanel.actions').handleSelect(id));
            },
            strategyPreTasksChange: function(ids){
                dispatch(actions.strategyPreTasksChange(ids));
            },
            closeAddOutLinkModal: function(){
                dispatch(actions.closeAddOutLinkModal());
            },
            addOutLinkInputs: function(inputs){
                dispatch(actions.addOutLinkInputs(inputs));
                dispatch(actions.syncStrategyValue());
            },
            AddMatchingTagsParams: function(data,tagResults){
                dispatch(actions.AddMatchingTagsParams(data,tagResults));
            },
            updateModules: function(modules){
                dispatch(actions.updateModules(modules));
            },
            refreshRulePanel: function(){
                
            },
            gotoFaultsManger: function(){
                dispatch(namespace('beop.strategy.modules.FaultInfo.actions').updateFrom());
                history.pushState(null, '策略组态 - faults管理', '/strategy/faultManage');
            }
        };
        return events;
    }

    var mapStateToProps = function(state) {
        return {
            strategy: state.sketchpad.strategy,
            modules: state.sketchpad.modules,
            selectedIds: state.sketchpad.selectedIds,
            selectedValueId: state.equipTree.selectedValueId,
            strategyList: state.equipTree.items,
            outLinkData: state.sketchpad.outLinkData,
            showAddOutLinkModal: state.sketchpad.showAddOutLinkModal,
            targetModuleId: state.sketchpad.targetModuleId,
            bShowSpin: state.sketchpad.bShowSpin,
            tagResults: state.sketchpad.tagResults,
        };
    }

    exports.Sketchpad = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Sketchpad);
}));