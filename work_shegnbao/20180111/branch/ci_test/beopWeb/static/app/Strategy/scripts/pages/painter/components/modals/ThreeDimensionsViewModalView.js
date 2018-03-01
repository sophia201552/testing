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
            namespace('React'),
            namespace('antd'),
            namespace('ReactEcharts')
        );
    }
}(namespace('beop.strategy.components.modals'), function(
    exports,
    React,
    antd,
    ReactEcharts
) {
    var h = React.h;
    var linkEvent = React.linkEvent;
    const deepClone = $.extend.bind($, true);

    const { Layout, Form, Tag, Button, Table, Modal } = antd;
    const { Content, Header } = Layout;

    class ThreeDimensionsViewModal extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        componentDidMount() {
            this.setState({
                visible: this.props.visible
            });
        }
        onCancel() {
            if (this.refs.tdEcharts) {
                var tdEcharts = this.refs.tdEcharts.getEchartsInstance();
                tdEcharts.clear();
            }
            this.props.onCancel();
        }
        createCharts(data) {
            if (data) {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.log(e);
                }
            } else {
                return (h("div", [I18n.resource.modal.NO_DATA]))
            }

            data.timeShaft.forEach(function(row, i) {
                data.timeShaft[i] = timeFormat(row, 'yyyy-mm-dd hh:ii')
            });
            var x = data.timeShaft;
            var y = [];
            var z = [];
            var maxArr = [];

            data.list.forEach(function(row, i) {
                if (i > 0) {
                    var points = row.dsItemId.split("|");
                    y.push(points.length > 1 ? points[1] : points[0]);
                    row.data.forEach(function(item, j) {
                        maxArr.push(item.toFixed(2));
                        var data = [i-1, j, item.toFixed(2)];
                        z.push(data);
                    });
                }
            });

            var dataBase = [];
            var points = data.list[0].dsItemId.split('|');
            y.push(points.length > 1 ? points[1] : points[0]);
            data.list[0].data.forEach(function(item, j) {
                dataBase.push([data.list.length - 1, j, (item/4).toFixed(2)]);
                maxArr.push((item/4).toFixed(2));
            });

            var maxVal = maxArr.sort(function(a, b) { return a - b; })[maxArr.length - 1];

            var option = {
                tooltip: {
                    formatter: function(params) {
                        return x[params.value[0]] + ',' + y[params.value[1]] + ',' + (params.value[2]*4);
                    }
                },
                visualMap: {
                    max: maxVal,
                    inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    },
                    textStyle: {
                        color: '#fff'
                    }
                },
                xAxis3D: {
                    type: 'category',
                    data: x,
                    axisLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                yAxis3D: {
                    type: 'category',
                    data: y,
                    axisLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                zAxis3D: [{
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                }],
                grid3D: {
                    boxWidth: 200,
                    boxDepth: 80,
                    light: {
                        main: {
                            intensity: 1.2,
                            shadow: true
                        },
                        ambient: {
                            intensity: 0.3
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#333'
                        }
                    }
                },
                series: [{
                    type: 'bar3D',
                    data: z.map(function(item) {
                        return {
                            value: [item[1], item[0], item[2]]
                        }
                    }),
                    shading: 'lambert',
                    bevelSize: 0.3,
                    grid3DIndex: 0,

                    label: {
                        show: false,
                        textStyle: {
                            fontSize: 16,
                            borderWidth: 1
                        }
                    },
                    // itemStyle: {  
                    //     opacity: 0.9
                    // },

                    emphasis: {
                        label: {
                            textStyle: {
                                fontSize: 18,
                                color: '#eee'
                            }
                        },
                        itemStyle: {
                            color: '#eee'
                        }
                    }
                },
                {
                    type: 'bar3D',
                    // name: I18n.resource.modal.PREDICTED_VALUE,
                    data: dataBase.map(function(item) {
                        return {
                            value: [item[1], item[0], item[2]]
                        }
                    }),
                    shading: 'lambert',
                    bevelSize: 0.3,
                    grid3DIndex: 1,

                    label: {
                        show: false,
                        textStyle: {
                            fontSize: 16,
                            borderWidth: 1
                        }
                    },
                    // itemStyle: {  
                    //     opacity: 0.9
                    // },

                    emphasis: {
                        label: {
                            show: false,
                            textStyle: {                                
                                // fontSize: 18,
                                // color: '#eee'
                            }
                        },
                        itemStyle: {
                            color: '#eee'
                        }
                    }
                }]
            };
            return (
                h("div", {
                    style: {
                        width: '100%',
                        height: 'auto'
                    }
                }, [
                    h(ReactEcharts, {
                        style: {
                            width: '100%',
                            height: '800px'
                        },
                        option: option,
                        ref: "tdEcharts"
                    })
                ])
            )
        }

        render() {

            const {
                data,
                visible
            } = this.props;

            return (
                h(Modal, {
                    visible: visible,
                    maskClosable: false,
                    width: "90%",
                    title: I18n.resource.modal.TD_VIEW,
                    footer: null,
                    onCancel: this.onCancel.bind(this),
                    wrapClassName: "vertical-center-modal scrollable-modal"
                }, [this.createCharts(data)])
            );
        }
    }

    exports.ThreeDimensionsViewModal = ThreeDimensionsViewModal;
}));