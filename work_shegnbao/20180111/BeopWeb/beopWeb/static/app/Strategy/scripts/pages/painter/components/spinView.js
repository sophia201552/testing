;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'exports'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(
            exports
        );
    } else {
        factory(
            root,
            namespace('React'),
            namespace('antd')
        );
    }
}(namespace('beop.strategy.components'), function(
    exports,
    React,
    antd
) {
    var h = React.h;

    const {Spin} = antd;

    class Spinner extends React.Component{
        constructor(props,context) {
            super(props,context);
            this.state = {
                display:this.props.bShowSpin?'block':'none'
            }
        }
        componentWillReceiveProps(props) {
            this.setState({
                display:props.bShowSpin?'block':'none'
            })
        }
        render() {
            let isCustom = this.props.id ?true:false;
            let style = {};
            if(!isCustom){
                style = {
                    width: '100%',
                    height:'100%'
                }
            }

            return h('div',{
                id: this.props.id || "spinnerWrap",
                style:Object.assign({
                    display:this.state.display,
                    backgroundColor:'rgba(0,0,0,0.3)',
                    position:'fixed',
                    zIndex:'1001'
                },style)
            },[
                h(Spin,{
                    size:'large',
                    style:{
                        position:'absolute',
                        left:'50%',
                        top:'50%',
                        marginLeft:'-16px',
                        marginTop:'-16px'
                    }
                },[])
            ])
        }
    }

    exports.Spinner = Spinner;
}));