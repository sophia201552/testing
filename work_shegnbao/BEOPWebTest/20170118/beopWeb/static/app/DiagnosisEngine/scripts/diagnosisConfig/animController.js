;(function (exports) {

    var BALL_MOVE_STEP = 5;
    var BALL_ATTACH_STEP = 15;

    var BALL_POSITION = {
        TOP: 0,
        RIGHT: 1,
        BOTTOM: 2,
        LEFT: 3,
        AUTO: 4
    };

    var ANIMATION_STATUS = {
        RUNNING: 0,
        PAUSE: 1,
        STOP: 2
    };

    var DEFAULTS = {};

    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;
    var request;

    function AnimController(container, options) {
        this.container = container;

        this.options = $.extend(false, {}, DEFAULTS, options);

        this.balls = [];
        this.matchedBalls = [];
        this.arrivedBalls = [];

        this.ctx = null;
        this.width = null;
        this.height = null;

        this.animInfo = {
            ballImage: null,
            imgWidth: 39,
            imgHeight: 39
        };

        this.status = ANIMATION_STATUS.STOP;

        this._init();
    }

    +function () {

        this._init = function () {
            var domCanvas = document.createElement('canvas');
            var computedStyle = window.getComputedStyle(this.container);
            var width = parseInt(computedStyle.width);
            var height = parseInt(computedStyle.height);

            domCanvas.width = this.width = width;
            domCanvas.height = this.height = height;

            domCanvas.style.width = width + 'px';
            domCanvas.style.height = height + 'px';

            this.container.innerHTML = '';
            this.container.appendChild(domCanvas);

            this.ctx = domCanvas.getContext('2d');

            this.animInfo.ballImage = document.querySelector('#imgBall');
        };

        // 开始动画
        this.start = function () {
            if (this.status === ANIMATION_STATUS.RUNNING) {
                return;
            }
            this.status = ANIMATION_STATUS.RUNNING;
            this._loop();
        };

        // 动画循环
        this._loop = function () {
            this._render();
            this._update();

            request = requestAnimationFrame(this._loop.bind(this));
        };

        // 渲染逻辑
        this._render = function () {
            var _this = this;
            var ctx = this.ctx;

            // 清空画布
            ctx.clearRect(0, 0, this.width, this.height);

            // 渲染还在周边徘徊的小球们
            // 渲染正在奔向目标的小球们
            this.balls.concat(this.matchedBalls).forEach(function (ball) {
                if (ball.delay > 0) {
                    return;
                }
                ctx.drawImage(_this.animInfo.ballImage, ball.x, ball.y);
            });

            this.arrivedBalls.forEach(function (ball) {
                var width = _this.animInfo.imgWidth * ball.scale;
                var height = _this.animInfo.imgHeight * ball.scale;
                var dw = (_this.animInfo.imgWidth - width) / 2;
                var dh = (_this.animInfo.imgHeight - height) / 2;

                ctx.drawImage(_this.animInfo.ballImage, ball.x + dw, ball.y + dh, width, height);
            });
        };

        // 更新小球的状态
        this._update = function () {
            var _this = this;

            var boundBottom = this.height - this.animInfo.imgHeight;
            var boundRight = this.width - this.animInfo.imgWidth;

            // 先处理还在周边徘徊的小球们
            this.balls.forEach(function (ball) {
                if (ball.delay > 0) {
                    ball.delay -= 1;
                    return;
                }
                switch(ball.pos) {
                    // 上边界
                    case BALL_POSITION.TOP:
                        ball.y = 0;
                        if (ball.x > 0) {
                            ball.x -= BALL_MOVE_STEP;
                        } else {
                            ball.x = 0;
                            ball.pos = BALL_POSITION.LEFT;
                        }
                        break;
                    // 左边界
                    case BALL_POSITION.LEFT:
                        ball.x = 0
                        if (ball.y < boundBottom) {
                            ball.y += BALL_MOVE_STEP;
                        } else {
                            ball.y = boundBottom;
                            ball.pos = BALL_POSITION.BOTTOM;
                        }
                        break;
                    // 下边界
                    case BALL_POSITION.BOTTOM:
                        ball.y = boundBottom;
                        if (ball.x < boundRight) {
                            ball.x += BALL_MOVE_STEP;
                        } else {
                            ball.x = boundRight;
                            ball.pos = BALL_POSITION.RIGHT;
                        }
                        break;
                    // 右边界
                    case BALL_POSITION.RIGHT:
                        ball.x = boundRight;
                        if (ball.y > 0) {
                            ball.y -= BALL_MOVE_STEP;
                        } else {
                            ball.y = 0;
                            ball.pos = BALL_POSITION.TOP;
                        }
                        break;
                }

            });

            // 处理奔向目标的小球们
            this.matchedBalls.forEach(function (ball) {
                var destPos = ball.to;
                if ( Math.abs(ball.x-destPos.x) < 20 && Math.abs(ball.y-destPos.y) < 20 ) {
                    // 抵达后，从 matchedBalls 数组中放入到 reachedBalls 数组中
                    _this.remove(_this.matchedBalls, ball);
                    ball.scale = 1;
                    _this.arrivedBalls.push(ball);
                    return;
                }
                ball.x += ball.stepX;
                ball.y += ball.stepY;
            });

            // 处理到达了目的地的小球们
            this.arrivedBalls.forEach(function (ball) {
                ball.scale -= 0.1;

                if (ball.scale <= 0) {
                    // 小球再见，从此消失
                    _this.remove(_this.arrivedBalls, ball);
                    // 启用回调
                    _this.excuteCallback('arrived', ball);
                    if (_this.matchedBalls.length === 0 && _this.arrivedBalls.length === 0) {
                        _this.excuteCallback('all-arrived');
                    }
                }
            });
        };

        this.excuteCallback = function (type, data) {
            switch(type) {
                case 'arrived':
                    typeof this.options.onArrived === 'function' && this.options.onArrived(data);
                    break;
                case 'all-arrived':
                    typeof this.options.onAllArrived === 'function' && this.options.onAllArrived(data);
                    break;
                default:
                    break;
            }
        };

        this.add = function (ball) {
            var _this = this;

            if (Object.prototype.toString.call(ball) !== '[object Array]') {
                ball = [ball];
            }

            ball.forEach(function (row, i) {
                row.x = _this.width;
                row.y = 0;
                row.delay = i * Math.ceil(_this.animInfo.imgWidth / BALL_MOVE_STEP);
                row.pos = BALL_POSITION.TOP;
                _this.balls.push(row);
            });
        };

        this.remove = function (balls, ball) {
            if (Object.prototype.toString.call(ball) !== '[object Array]') {
                ball = [ball];
            }

            for (var i = 0, len = balls.length; i < len; i++) {
                if ( ball.indexOf(balls[i]) > -1 ) {
                    balls.splice(i, 1);
                    i--;
                    len--;
                }
            }
        };

        this.match = function (data) {
            var _this = this;
            var arr = [], removed;

            if (Object.prototype.toString.call(data) !== '[object Array]') {
                data = [data];
            }

            data.forEach(function (row) {
                var id = row.id;
                var ball = _this.findById(id);
                var dy, dx, rotate;

                if (ball === null) {
                    console.warn('can not find ball with "id": ' + id);
                    return;
                }

                _this.remove(_this.balls, ball);
                ball.pos = BALL_POSITION.AUTO;

                // 合并对象
                ball = $.extend(true, {}, ball, row);

                // 由于小球有大小，所以这里对目标点的位置进行一些调整
                ball.to.x = ball.to.x - _this.animInfo.imgWidth / 2;
                ball.to.y = ball.to.y - _this.animInfo.imgHeight / 2;

                // 算一些参数
                // 计算旋转角度，由于 canvas 的 y 轴方向和笛卡尔坐标系的 y 轴方向相反
                // 所以这边的 y 都取负值
                rotate = Math.atan2(ball.to.y - ball.y, ball.to.x - ball.x);
                ball.stepX = Math.cos(rotate) * BALL_ATTACH_STEP;
                ball.stepY = Math.sin(rotate) * BALL_ATTACH_STEP;

                _this.matchedBalls.push(ball);
            });
        };

        this.findById = function (id) {
            var findRs = null;

            this.balls.some(function (ball) {
                if (ball.id === id) {
                    findRs = ball;
                    return true;
                }
                 return false;
            });

            return findRs;
        };

        // 暂停动画
        this.pause = function () {
            if (request) {
                cancelAnimationFrame(request);
                this.status = ANIMATION_STATUS.PAUSE;
            }
        };

        // 停止动画
        this.stop = function () {
            this.pause();
            this.balls.length = 0;
            this._render();

            this.status = ANIMATION_STATUS.STOP;
        };

    }.call(AnimController.prototype);

    exports.AnimController = AnimController;

} (window));