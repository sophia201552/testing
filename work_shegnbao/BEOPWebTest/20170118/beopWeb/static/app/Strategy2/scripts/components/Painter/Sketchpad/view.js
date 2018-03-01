;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../../core/Event.js', './Graphics/gShape.js', './Graphics/gStrategyShape.js', './Graphics/gInputShape.js', './Graphics/gOutputShape.js', './Graphics/gArrow.js', './sketchpad.js', './sketchpad.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('../../core/Event.js'),
            require('./Graphics/gShape.js'),
            require('./Graphics/gStrategyShape.js'),
            require('./Graphics/gInputShape.js'),
            require('./Graphics/gOutputShape.js'),
            require('./Graphics/gArrow.js'),
            require('./sketchpad.js'),
            require('./sketchpad.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Event'),
            namespace('beop.strategy.components.Painter.Sketchpad.Graphics.GShape'),
            namespace('beop.strategy.components.Painter.Sketchpad.Graphics.GStrategyShape'),
            namespace('beop.strategy.components.Painter.Sketchpad.Graphics.GInputShape'),
            namespace('beop.strategy.components.Painter.Sketchpad.Graphics.GOutputShape'),
            namespace('beop.strategy.components.Painter.Sketchpad.Graphics.GArrow'),
            namespace('beop.strategy.components.Painter.Sketchpad.Main'),
            namespace('beop.strategy.components.Painter.Sketchpad.Child')
        );
    }
}(namespace('beop.strategy.components.Painter.Sketchpad'), function(exports, Event, GShape, GStrategyShape, GInputShape, GOutputShape, GArrow, Sketchpad, SketchpadChild) {

    function View(container) {
        this.container = container;
    }

    // PROTOTYPES
    +

    function() {
        /**
         * Constructor
         */
        this.constructor = View;

        this.init = function(actions) {
            this.actions = actions;
            var $container = $(this.container);
            this.stage = new Konva.Stage({
                container: this.container.id,
                width: $container.width(),
                height: $container.height()
            });
            this.layer = new Konva.Layer();
            this.stage.add(this.layer);
            this.bd = new Sketchpad(this.container);

        };

        this.ready = function(model) {
            this.layer.remove();
            this.layer = new Konva.Layer();
            this.stage.add(this.layer);
            this.bd.clear();

            var outputIdsSet = new Set(),
                moduleIdsSet = new Set();
            var outputArr = [];
            //生成策略模块
            model.modules.forEach((module) => {
                moduleIdsSet.add(module['_id']);
                var block = new SketchpadChild(module);
                var gShape = new GStrategyShape({
                    id: module['_id'],
                    x: module.loc.x,
                    y: module.loc.y,
                    width: module.loc.w,
                    height: module.loc.h,
                    draggable: true,
                    store: module,
                    block: block
                });
                gShape.on('close', this.actions.moduleClose);
                gShape.on('config', this.actions.moduleConfig);
                gShape.on('select', this.actions.moduleSelect);
                this.bd.add(block);
                this.layer.add(gShape);
            });
            //生成策略模块的输入输出
            model.modules.forEach((module) => {
                var block = this.bd.findBlockById(module['_id']);
                var inputsWithoutLoc = [];
                //生成策略模块输入参数
                module.option.input.forEach((input) => {
                    if (input.loc == undefined) { //收集没有loc的输入并跳过生成 
                        inputsWithoutLoc.push(input);
                        return;
                    }
                    createInput.bind(this)(input);
                });

                //策略模块输入参数默认位置生成
                var newInputsLoc = this.bd.createSortInfo(block, inputsWithoutLoc.length, 'input');

                newInputsLoc.forEach((loc, i) => {
                    inputsWithoutLoc[i].loc = loc;
                    createInput.bind(this)(inputsWithoutLoc[i]);
                });

                function createInput(input) {
                    var block;
                    if (input.type == 100 && input.refId && moduleIdsSet.has(input.refId) && outputIdsSet.has(input.name)) {
                        block = this.bd.find({
                            'opt.name': input.name,
                            'child.id': input.refId
                        })[0];
                        block.toBeInput(module['_id']);
                    } else {
                        var id = ObjectId() + '_' + module['_id'];
                        block = new SketchpadChild(input, 'input', id);
                        var gInputShape = new GInputShape({
                            id: id,
                            name: 'input_' + module['_id'],
                            x: input.loc.x,
                            y: input.loc.y,
                            width: input.loc.w,
                            height: input.loc.h,
                            draggable: true,
                            store: input,
                            block: block
                        });
                        gInputShape.on('toOutput', this.actions.toOutput);
                        this.layer.add(gInputShape);
                    }
                    this.bd.add(block);
                }

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
                var newOutputsLoc = this.bd.createSortInfo(block, outputsWithoutLoc.length, 'output');

                newOutputsLoc.forEach((loc, i) => {
                    outputsWithoutLoc[i].loc = loc;
                    createOutput.bind(this)(outputsWithoutLoc[i]);
                });

                function createOutput(output) {
                    outputIdsSet.add(output.name);
                    var id = ObjectId() + '_' + module['_id'];
                    var block = new SketchpadChild(output, 'output', id);
                    outputArr.push(block);
                    var gOutputShape = new GOutputShape({
                        id: id,
                        name: 'output_' + module['_id'],
                        x: output.loc.x,
                        y: output.loc.y,
                        width: output.loc.w,
                        height: output.loc.h,
                        draggable: true,
                        store: output,
                        block: block
                    });
                    this.bd.add(block);
                    this.layer.add(gOutputShape);
                }
            });

            this.createLines();
        };

        this.add = function(model) {
            console.log('add', model);

            this.layer.find('.GArrow').destroy();
            var data = model.update.add;
            var block = new SketchpadChild(data);
            var gShape = new GStrategyShape({
                id: data['_id'],
                x: data.loc.x,
                y: data.loc.y,
                width: data.loc.w,
                height: data.loc.h,
                draggable: true,
                store: data,
                block: block
            });
            gShape.on('close', this.actions.moduleClose);
            gShape.on('config', this.actions.moduleConfig);
            gShape.on('select', this.actions.moduleSelect);
            this.bd.add(block);
            this.layer.add(gShape);

            this.createLines();
            this.noSelect(model);
            model.modules.push(data);
            model.selectIds = [];
            model.update = null;
        }

        this.destroy = function(model) {
            console.log('destroy', model);
            var id = model.update.destroyId;
            var target = model.modules,
                index = target.findIndex((v) => { return v['_id'] == id });

            if (index == -1) {
                model.modules.forEach(module => {
                    target = module.option.input;
                    index = target.findIndex((v) => { return v['_id'] == id });
                    if (index == -1) {
                        target = module.option.output;
                        index = target.findIndex((v) => { return v['_id'] == id });
                        if (index != -1) {
                            target.splice(index, 1);
                        }
                    } else {
                        target.splice(index, 1);
                    }
                });
            } else {
                target.splice(index, 1);
            }

            // model.selectIds = [];
            model.update = null;
        }

        this.update = function(model) {
            console.log('update', model);
            //更新选中
            var selectId = model.update.selectId,
                inputToOutput = model.update.inputToOutput,
                inputOpt = model.update.inputOpt;
            if (selectId != undefined) {
                var index = model.selectIds.indexOf(selectId);
                if (index > -1) { //已经是选中状态
                    model.selectIds.splice(index, 1);
                } else { //不是选中状态
                    model.selectIds = [selectId];
                }
                this.noSelect(model);
                model.selectIds.forEach((selectId) => {
                    var target = this.layer.find('#' + selectId)[0];
                    target.customMember.background.fill('#f6a405');
                    target.customMember.btnClose.image(target.customMember.image2);
                    target.customMember.btnConfig.image(target.customMember.image2);
                    target.customMember.resizer.image(target.customMember.image2);
                    target.customMember.nameText.fill('#fff');
                    this.layer.find('#line_' + selectId)[0].find('.line').stroke('#f6a405');
                });
                this.layer.draw();
                Event.emit('SHOW_SELECT_ATTR.Sketchpad', {
                    model: model
                });
            }
            //更新输入点为引用模板
            if (inputToOutput != undefined) {
                model.modules.forEach(module => {
                    if (module['_id'] == inputToOutput.id) {
                        module.option.input.forEach(input => {
                            if (input.name == inputToOutput.oldName) {
                                input.type = inputToOutput.type;
                                input.name = inputToOutput.name;
                                input.refId = inputToOutput.refId;
                            }
                        });
                    }

                });
            }

            //更新输入点信息
            if (inputOpt != undefined) {

            }
            model.update = null;
        };

        this.createLines = function() {
            //清空箭头线 防止重复
            this.layer.find('.GArrow').destroy();
            var allLines = this.bd.getAllLines();
            allLines.forEach((lines) => {
                var gArrow = new GArrow({
                    id: 'line_' + lines.id,
                    name: 'GArrow',
                    x: 0,
                    y: 0,
                    store: lines
                });
                this.layer.add(gArrow);
            });
            this.layer.draw();
        }

        this.noSelect = function(model) {
            model.modules.forEach((module) => {
                var target = this.layer.find('#' + module['_id'])[0];
                target.customMember.background.fill('#697174');
                target.customMember.btnClose.image(target.customMember.image);
                target.customMember.btnConfig.image(target.customMember.image);
                target.customMember.resizer.image(target.customMember.image);
                target.customMember.nameText.fill('#cee2ec');
                this.layer.find('#line_' + module['_id'])[0].find('.line').stroke('#6f7777')
            });
            this.layer.draw();
        }

        this.display = function(representation) {};

    }.call(View.prototype);

    exports.View = View;
}));