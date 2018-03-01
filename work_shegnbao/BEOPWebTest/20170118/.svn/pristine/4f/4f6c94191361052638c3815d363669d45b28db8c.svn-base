;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React', 'classNames'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports,
            require('React'),
            require('classNames')
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('classNames')
        );
    }
}(namespace('beop.strategy.components.Layout'), function(exports, React, cx) {
    var h = React.h;
    var Component = React.Component;

    var shadowClone = $.extend.bind($, false);

    function mergeProps(props, _private) {
        var _mergeKeys = Object.keys(_private);

        if (typeof props === 'undefined') {
            return _private;
        }

        Object.keys(props).forEach(function (p) {
            var type;
            if (_mergeKeys.indexOf(p) > -1) {
                switch(p) {
                    case 'class':
                    case 'className: ':
                        _private[p] = _private[p] + ' ' + props[p].trim();
                        return;
                    default:
                        break;
                }
            }
            _private[p] = props[p];
        });

        return _private;
    }

    function Container(props) {
        var attrs = mergeProps(props, {
            className: (function () {
                var flag = false;
                React.Children.toArray(props.children || []).some(function (child) {
                    if (child && child.props && (child.type === Sider || child.type === SiderGroup)) {
                        flag = true;
                        return true;
                    }
                });

                return flag ? 'layout-container layout-has-sider' : 'layout-container';
            } ())
        });

        return (
            h('div', attrs)
        );
    }

    class SiderGroup extends Component {

        constructor(props) {
            super(props);

            this.state = {
                active: props.active || 0
            };

            this.handlerSiderGroupBtnClick = this.handlerSiderGroupBtnClick.bind(this);
        }

        handlerSiderGroupBtnClick(data) {
            if (this.state.active !== data.idx) {
                this.setState({
                    active: data.idx
                });
                typeof this.props.onSiderChange === 'function' && this.props.onSiderChange(data.idx);
            }
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.active !== this.props.active) {
                this.setState({
                    active: nextProps.active || 0
                });
            }
        }

        render() {
            var _this = this;
            var attrs = mergeProps(this.props, {
                className: 'layout-sider-group'
            });
            var activeChild;

            React.Children.forEach(attrs.children, function (child, idx) {
                if (idx === _this.state.active) {
                    activeChild = child;
                    return false;
                }
            });

            return (
                h('div', {
                    id: attrs.id,
                    className: attrs.className
                }, [
                    h('div', {
                        className: 'layout-sider-group-content'
                    }, [ activeChild ]),
                    h(
                        'div.layout-sider-group-btn-wrap',
                        React.Children.map(attrs.children, function (child, i) {
                            return h('label', {
                                className: cx('layout-sider-group-btn', {'active': _this.state.active === i}),
                                onClick: React.linkEvent({
                                    ins: _this,
                                    idx: i,
                                }, _this.handlerSiderGroupBtnClick)
                            }, [
                                h('span', child.props.title)
                            ]);
                        })
                    )
                ])
            );
        }
    }

    function Sider(props) {
        var attrs = mergeProps(props, {
            className: 'layout-sider'
        });

        return (
            h('div', attrs)
        );
    }

    function Content(props) {
        var attrs = mergeProps(props, {
            className: 'layout-content'
        });

        return (
            h('.layout-content', attrs)
        );
    }

    exports.Container = Container;
    exports.SiderGroup = SiderGroup;
    exports.Sider = Sider;
    exports.Content = Content;
}));