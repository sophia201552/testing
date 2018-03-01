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