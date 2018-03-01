;(function(root, factory) {
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
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.common.components'), function(
    exports,
    React,
    enums
) {
    var h = React.h;
    var linkEvent = React.linkEvent;

    const COLORS = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
    const SHAPE_OPACITY = .6;

    const createTransform = function(metrix) {
        return function (point) {
            return [point[0]-metrix[0], -point[1]+metrix[1]];
        }
    }

    const FuzzyRuleChart = React.createClass({
        getDefaultProps() {
            return {
                min: 0,
                max: 10,
                shapes: [],
                pos: [0, 0]
            }
        },
        componentDidMount() {
            var style = window.getComputedStyle(this.canvas);

            this.canvas.width = parseInt(style.width);
            this.canvas.height = parseInt(style.height);

            if (this.canvas.getContext) {
                this.context2d = this.canvas.getContext('2d');
            }
            this.setEnv({
                min: this.props.min,
                max: this.props.max
            });
            this.rangeH = 1;
            this.ratioY = this.canvas.height / this.rangeH;
            this.transformPoint = createTransform([this.props.min, this.rangeH]);
            this.renderCanvas();
        },
        componentWillReceiveProps(nextProps) {
            if (this.props.min !== nextProps.min || this.props.max !== nextProps.max) {
                this.setEnv({
                    min: typeof nextProps.min === 'undefined' ? this.props.min : nextProps.min,
                    max: typeof nextProps.max === 'undefined' ? this.props.max : nextProps.max
                });
                this.transformPoint = createTransform([nextProps.min, this.rangeH]);
            }
        },
        componentDidUpdate() {
            this.renderCanvas();
        },
        setEnv(data) {
            var width = this.canvas.width;
            var rangeW = this.rangeW = data.max - data.min;

            this.ratioX = width / rangeW;
        },
        drawViewRect() {
            let ctx = this.context2d;

            let pos = this.props.pos;
            let p = this.transformPoint([pos[0], pos[1]]);
            let w = this.rangeW - pos[0] + this.props.min;
            let h = pos[1];
            let ratioX = this.ratioX;
            let ratioY = this.ratioY;
            let x = p[0]*ratioX;
            let y = p[1]*ratioY;

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle ="#fff";
            ctx.setLineDash([5, 3]);
            ctx.strokeRect(x, y, w*ratioX, h*ratioY);

            this.context2d.restore();
        },
        drawTriangle(points, options) {
            let ctx = this.context2d;

            let h = points[points.length -1];
            let ratioX = this.ratioX;
            let ratioY = this.ratioY;
            let _f = parseFloat;
            let p1 = this.transformPoint([_f(points[0]), 0]);
            let p2 = this.transformPoint([_f(points[1]), this.rangeH]);
            let p3 = this.transformPoint([_f(points[2]), 0]);

            ctx.save();
            ctx.globalAlpha = SHAPE_OPACITY;

            ctx.beginPath();
            ctx.moveTo(p1[0]*ratioX, p1[1]*ratioY);
            ctx.lineTo(p2[0]*ratioX, p2[1]*ratioY);
            ctx.lineTo(p3[0]*ratioX, p3[1]*ratioY);
            ctx.fillStyle = options.color;
            ctx.fill();

            ctx.restore();
        },
        drawRect(points, options) {
            let ctx = this.context2d;

            let ratioX = this.ratioX;
            let ratioY = this.ratioY;
            let _f = parseFloat;
            let p1 = this.transformPoint([_f(points[0]), this.rangeH]);

            ctx.save();
            ctx.globalAlpha = SHAPE_OPACITY;

            ctx.beginPath();
            ctx.fillStyle = options.color;
            ctx.fillRect(p1[0]*ratioX, p1[1]*ratioY, (points[1]-points[0])*ratioX, this.rangeH*ratioY);

            ctx.restore();
        },
        drawTrapezoid(points, options) {
            let ctx = this.context2d;

            let ratioX = this.ratioX;
            let ratioY = this.ratioY;
            let _f = parseFloat;
            let p1 = this.transformPoint([_f(points[0]), 0]);
            let p2 = this.transformPoint([_f(points[1]), this.rangeH]);
            let p3 = this.transformPoint([_f(points[2]), this.rangeH]);
            let p4 = this.transformPoint([_f(points[3]), 0]);

            ctx.save();

            ctx.globalAlpha = SHAPE_OPACITY;
            ctx.beginPath();
            ctx.moveTo(p1[0]*ratioX, p1[1]*ratioY);
            ctx.lineTo(p2[0]*ratioX, p2[1]*ratioY);
            ctx.lineTo(p3[0]*ratioX, p3[1]*ratioY);
            ctx.lineTo(p4[0]*ratioX, p4[1]*ratioY);
            ctx.fillStyle = options.color;
            ctx.fill();

            this.context2d.restore();
        },
        renderCanvas() {
            this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.props.shapes.forEach(
                (shape, i) => {
                    let type = parseInt(shape.type);
                    switch(type) {
                        case enums.fuzzyRuleShapeTypes.TRIANGLE:
                            this.drawTriangle(shape.points, {
                                color: COLORS[i%11]
                            });
                            break;
                        case enums.fuzzyRuleShapeTypes.RECTANGLE:
                            this.drawRect(shape.points, {
                                color: COLORS[i%11]
                            });
                            break;
                        case enums.fuzzyRuleShapeTypes.TRAPEZOID:
                            this.drawTrapezoid(shape.points, {
                                color: COLORS[i%11]
                            });
                            break;
                    }
                }
            );
            this.drawViewRect();
        },
        saveCanvasRef(canvas) {
            this.canvas = canvas;
        },
        render() {
            return h('div', {
                style: {
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }
            }, [
                h('canvas', {
                    ref: this.saveCanvasRef,
                    style: {
                        width: '100%',
                        height: '100%'
                    }
                }),
                h('span', {
                    style: {
                        position: 'absolute',
                        right: '-35px',
                        width: '32px',
                        height: '32px',
                        overflow: 'hidden',
                        marginTop: '-16px',
                        top: (1 - this.props.pos[1]) * 100 + '%'
                    }
                }, [this.props.pos[1]])
            ]);
        }
    });

    exports.FuzzyRuleChart = FuzzyRuleChart;
}));