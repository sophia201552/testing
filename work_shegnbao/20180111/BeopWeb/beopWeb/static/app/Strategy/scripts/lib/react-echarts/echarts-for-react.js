;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'React', 'classNames', 'CodeMirror'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('React'), require('classNames'), require('CodeMirror'));
    } else {
        factory(
            root,
            root.React,
            root.echarts
        );
    }
}(window, function (exports, React, echarts) {
    const h = React.h;

    const ReactEcharts = React.createClass({
        propTypes: {
            option: React.PropTypes.object.isRequired,
            notMerge: React.PropTypes.bool,
            lazyUpdate: React.PropTypes.bool,
            style: React.PropTypes.object,
            className: React.PropTypes.string,
            theme: React.PropTypes.string,
            onChartReady: React.PropTypes.func,
            showLoading: React.PropTypes.bool,
            onEvents: React.PropTypes.object
        },
        componentDidMount() {
            let echartObj = this.renderEchartDom();
            let onEvents = this.props.onEvents || [];

            for (let eventName in onEvents) {
                // ignore the event config which not satisfy
                if (typeof eventName === 'string' && typeof onEvents[eventName] === 'function') {
                    // binding event
                    echartObj.on(eventName, function(param) {onEvents[eventName](param, echartObj);});
                }
            }
            // on chart ready
            if (typeof this.props.onChartReady === 'function') this.props.onChartReady(echartObj);

            // on resize
            // elementResizeEvent(this.refs.echartsDom, function() {
            //     echartObj.resize();
            // });
        },
        // update
        componentDidUpdate() {
            this.renderEchartDom()
        },
        // remove
        componentWillUnmount() {
            echarts.dispose(this.refs.echartsDom)
        },
        // render the dom
        renderEchartDom() {
            // init the echart object
            let echartObj = this.getEchartsInstance();
            // set the echart option
            echartObj.setOption(this.props.option, this.props.notMerge || false, this.props.lazyUpdate || false);
            // set loading mask
            if (this.props.showLoading) echartObj.showLoading();
            else echartObj.hideLoading();

            return echartObj;
        },
        getEchartsInstance() {
            // return the echart object
            return echarts.getInstanceByDom(this.refs.echartsDom) || echarts.init(this.refs.echartsDom, this.props.theme);
        },
        render() {
            // for render
            return h('div', {
                ref: 'echartsDom',
                className: this.props.className,
                style: this.props.style || { height: '300px' }
            });
        }
    });

    exports.ReactEcharts = ReactEcharts;
}))
