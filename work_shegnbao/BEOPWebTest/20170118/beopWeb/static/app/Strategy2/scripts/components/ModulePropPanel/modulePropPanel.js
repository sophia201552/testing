;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports',
            '../core/model.js',
            '../core/Event.js',
            'React'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('../core/model.js'),
            require('../core/Event.js'),
            require('React')
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Model'),
            namespace('beop.strategy.core.Event'),
            namespace('beop.strategy.core.constants'),
            namespace('React')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    Model,
    Event,
    constants,
    React
) {
    var h = React.h;
    var linkEvent = React.linkEvent;

    var actions = {
        dispatch: null

    };

    var theme = {
        createRow:function(text, input) {
            return h('.form-group', { style: { width: '100%' } }, [h('label', {
                style: {
                    fontSize: '14px',
                    width: '30%',
                    padding: '6px'
                }
            }, text), input]);
        },

        propView:function (selectedModules) {
            var INPUT_WIDTH = '69%';
            var item = selectedModules[0];
            var type;

            if (!item) {
                return null;
            }
            switch (item.type){
                case 0:
                    type = '诊断';
                    break;
                case 1:
                    type = 'KPI';
                    break;
                case 2:
                    type = '计算点';
                    break;
            }
            return h('form.form-inline', { style: { padding: '15px' } }, [
                theme.createRow('名字', h('input', {
                    type: 'text',
                    value: item.name,
                    style: {
                        width: INPUT_WIDTH
                    },
                    onChange: linkEvent('name', this.onChangeHandler)
                })),
                theme.createRow('类型', h('label', {
                    style: {
                        fontSize: '14px',
                        width: INPUT_WIDTH,
                        padding: '6px 7px',
                        'font-weight': 'normal'
                    }
                },[type])),
                theme.createRow('描述', h('input', {
                    type: 'text',
                    name: 'desc',
                    value: item.desc,
                    title: item.desc,
                    style: {
                        width: INPUT_WIDTH
                    },
                    onChange: linkEvent('desc', this.onChangeHandler)
                }))
            ])
        }
    };

    class ModulePropPanel extends React.Component{
        constructor(props, context) {
            super(props, context);

            actions.dispatch = this.context.dispatch;

            this.state = this.props.modulePropPanel;
            this.onChangeHandler = this.onChangeHandler.bind(this);
        }

        onChangeHandler(key, e) {
            var items = this.props.modulePropPanel.selectedModules;
            var value = e.currentTarget.value;

            items.forEach(function (row) {
                if (key in row) {
                    row[key] = value;
                }
            });

            this.setState({
                items: items
            });
            actions.dispatch({
                type: constants.modulePropPanel.CHANGE_SELECTEDMODULES_PROPS,
                props: items
            });
        }

        render(){
            return (
                h('div', {
                    id: 'ModulePropPanel',
                    style: { width: '100%', height: '100%' }
                },[
                    theme.propView.call(this,this.props.modulePropPanel.selectedModules)
                ])
            );
        }
    }

    exports.ModulePropPanel = ModulePropPanel;
}));