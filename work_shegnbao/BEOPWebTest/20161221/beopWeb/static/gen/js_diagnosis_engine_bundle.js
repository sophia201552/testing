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
;(function (exports) {
    var _this;

    var OFFSET_X = 34;
    var OFFSET_Y = 34;

    function DiagnosisConfigScreen(data) {
        _this = this;
        this.store = data;

        this.container = null;
        this.animCtn = null;
        this.equipCtn = null;

        this.page = null;
        this.animController = null;

        this.tplParamList = [];
        this.unmatchedList = null;
        this.showDeferred = $.Deferred();
    }

    +function () {

        this.UNMATCHED_ITEM_TPL = '<div class="col-xs-3 unmatched-item" data-id="{id}" draggable="true">\
            <div class="media">\
                <div class="media-body">\
                    <h4 class="media-heading">{value}</h4>\
                    {alias}\
                </div>\
                <button type="button" class="close">\
                    <span>×</span>\
                </button>\
            </div>\
        </div>';

        this.show = function ($container, filterPanel) {
            WebAPI.get('/static/app/DiagnosisEngine/views/diagnosisConfig/diagnosisConfigScreen.html')
                .done(function (html) {
                    // PanelToggle.panelCenter.innerHTML = html;
                    // _this.container = PanelToggle.panelCenter.querySelector('#diagnosisConfigScreen');
                    _this.container = $container[0];
                    _this.filterPanel = filterPanel;
                    _this.container.innerHTML = '<div id="container-left"></div>'
                        + '<div id="container-right"></div>';
                    $(_this.container).removeClass("mr10 ml10 mt5");
                    $(_this.container).find('#container-left')[0].innerHTML = html;
                    _this.animCtn = _this.container.querySelector('#animLayer');
                    _this.equipCtn = _this.container.querySelector('#equipLayer');
                    if (!AppConfig.datasource) {
                        AppConfig.datasource = new DataSource(_this);
                        AppConfig.datasource.show();
                    } else {
                        AppConfig.datasource.show();
                    }
                    // if (!AppConfig.datasource) {
                    //     // 如果没有预加载，则先去加载数据，再做显示
                    //     Spinner.spin(_this.container);
                    //     WebAPI.get('/datasource/get/' + AppConfig.userId).done(function (result) {
                    //         _this.store.group = result.group;
                    //         AppConfig.datasource = new DataSource(_this);
                    //         AppConfig.datasource.iotOpt = {
                    //             tree: {
                    //                 event: {
                    //                     addDom: function (treeNode, $target) {
                    //                         if ($target.hasClass('projects')) {
                    //                             $target.find('#' + treeNode.tId + '_span').on('dragstart', function (e) {
                    //                                 EventAdapter.setData(treeNode);
                    //                             })
                    //                         }
                    //                     }
                    //                 }
                    //             }
                    //         };
                    //         AppConfig.datasource.show();
                    //
                    //     }).always(function (e) {
                    //         Spinner.stop();
                    //     });
                    // } else {
                    //     AppConfig.datasource.show();
                    // }
                    _this.showDeferred.resolve();
                    _this.init();
                });
        };

        this.init = function () {
            var _this = this;

            this.initAnimation();
            this.initPageScreen().done(function () {
                _this.initStatus();
            });
            this.attachEvents();
        };

        this.initStatus = function () {
            this.__getTplParamList();
            this.__refreshRemoveBtns();
        };

        this.attachEvents = function () {
            var _this = this;
            var $unmatchedList = $('#unmatchedList', this.container);

            this.container.ondrop = function (e) {
                var transferData = EventAdapter.getData() || {};
                var dsItemId = transferData.dsItemId;
                var type = transferData.type;
                _this.__onDropUnmatchedPoint(e, dsItemId);
                // // 如果是未匹配到的点拖拽到屏幕上
                // if (type === 'unmatched') {
                //     _this.__onDropUnmatchedPoint(e, dsItemId);
                //     return;
                // }

                // if (typeof dsItemId === 'string') {
                //     dsItemId = [dsItemId];
                // }
                // // 开始做动画
                // _this.animController.add(dsItemId.map(function (row) {
                //     return {
                //         id: row
                //     };
                // }));
                // _this.animController.start();
                //
                // _this.__matchDataSource(dsItemId).done(function (rs) {
                //     var data = rs;
                //     var matches = [];
                //     var unmatches = _this.unmatchedList = dsItemId;
                //     var map = {};
                //
                //     Object.keys(data).forEach(function (k) {
                //         var info = _this.__getDestInfoByTplParam(k);
                //         var dsId = data[k];
                //         var idx;
                //
                //         info.id = dsId;
                //         matches.push(info);
                //
                //         // 从未被配对的数据源中删除该项
                //         idx = unmatches.indexOf(dsId);
                //         unmatches.splice(idx, 1);
                //     });
                //
                //     // 把匹配的数据存入到 thing 中
                //     if (matches.length) {
                //         matches.forEach(function (row) {
                //             map[row.param] = row.id;
                //         });
                //         _this.__updateThing([{
                //             _id: _this.store.thingId,
                //             projId: _this.store.projId,
                //             name: _this.store.name,
                //             srcPageId: _this.store.srcPageId,
                //             dictVariable: map
                //         }]);
                //
                //         _this.store.dictVariable = map;
                //
                //         // 给动画一点延迟
                //         window.setTimeout(function () {
                //             _this.animController.match(matches);
                //         }, 1000);
                //     } else {
                //         window.setTimeout(function () {
                //             _this.__addToUnmatchesList();
                //             _this.animController.stop();
                //         }, 3000);
                //     }
                // });
            };
            this.container.ondragenter = function (e) {
                e.preventDefault();
            };
            this.container.ondragover = function (e) {
                e.preventDefault();
            };

            $unmatchedList.off('click').on('click', '.close', function (e) {
                var $ele = $(this).closest('.unmatched-item');
                $ele.remove();
            });

            // DRAG 事件
            $unmatchedList.off('dragstart').on('dragstart', '.unmatched-item', function (e) {
                EventAdapter.setData({
                    'dsItemId': this.dataset.id,
                    'type': 'unmatched'
                });
            });
        };

        // 处理用户手动匹配点的逻辑
        this.__onDropUnmatchedPoint = function (evt, dsItemId) {
            var _this = this;
            var tplParamList = this.tplParamList;
            var offset = $('#equipLayer', this.container).offset();
            var absoluteDropX = evt.pageX - offset.left;
            var absoluteDropY = evt.pageY - offset.top;
            var painter = this.page.painter;

            tplParamList.some(function (row) {
                var pos = row.modelPos;
                var o = {};
                // 判断是否 drop 到了某个控件的区域
                var hitShape = GUtil.getIntersectionByPoint(absoluteDropX, absoluteDropY, painter.getCanvasLayer(), painter.getRootLayer());

                if (hitShape) {
                    _this.store.dictVariable[row.param[0]] = dsItemId;
                    //_this.__updateThing([{
                    //    _id: _this.store.thingId,
                    //    projId: _this.store.projId,
                    //    name: _this.store.name,
                    //    srcPageId: _this.store.srcPageId,
                    //    dictVariable: _this.store.dictVariable
                    //}]);
                    o[row.param[0]] = dsItemId;
                    _this.page.reloadWidgetById(row.modelId, o);
                    _this.__addRemoveBtn(row);
                    return true;
                }

            });
        };

        this.__addToUnmatchesList = function () {
            var _this = this;
            var container = this.container.querySelector('#unmatchedList');
            var arrHtml = [];
            var unmatches = this.unmatchedList;

            if (!unmatches.length) {
                return;
            }

            // var dsInfo = AppConfig.datasource.getDSItemById(unmatches);
            //
            // dsInfo.forEach(function (row) {
            //     arrHtml.push(_this.UNMATCHED_ITEM_TPL.formatEL(row));
            // });

            $(container).append(arrHtml);
        };

        this.__getTplParamList = function () {
            var _this = this;
            var models, paramList = [];

            if (this.tplParamList.length) {
                return this.tplParamList.map(function (row) {
                    return row.param[0];
                });
            }

            models = this.page.getModelsByType('HtmlContainer');

            models.forEach(function (model) {
                var pattern = /<#\s*(\w*?)\s*#>/mg;
                var match, list = [];

                while (match = pattern.exec(model.option().html)) {
                    list.push(match[1]);
                }
                paramList.push({
                    modelId: model._id(),
                    param: list,
                    to: {
                        x: model.x() + model.w() / 2 + OFFSET_X,
                        y: model.y() + model.h() / 2 + OFFSET_Y
                    },
                    modelPos: {
                        x: model.x() + OFFSET_X,
                        y: model.y() + OFFSET_Y,
                        w: model.w(),
                        h: model.h()
                    }
                });
            });

            this.tplParamList = paramList;

            return paramList.map(function (row) {
                return row.param[0];
            });
        };

        this.__onArrivedCallback = function (data) {
            var o = {};
            o[data.param[0]] = data.id;

            // 刷新控件
            this.page.reloadWidgetById(data.modelId, o);
            // 更新删除按钮
            this.__addRemoveBtn(data);
        };

        this.__onAllArrivedCallback = function () {
            this.__addToUnmatchesList();
            // 杀死所有 ball
            this.animController.stop();
        };

        this.__refreshRemoveBtns = function () {
            var _this = this;
            var map = this.store.dictVariable;
            var tplParamList = this.tplParamList;
            var arr = [];

            Object.keys(map).forEach(function (k) {
                var match;
                if (map[k]) {
                    match = _this.__getDestInfoByTplParam(k);
                    if (match) {
                        arr.push(match);
                    }
                }
            });

            this.container.querySelector('#decorateLayer').innerHTML = '';

            arr.forEach(function (row) {
                _this.__addRemoveBtn(row);
            });
        };

        // 添加删除按钮
        this.__addRemoveBtn = function (data) {
            var _this = this;
            var modelId = data.modelId;
            var container = this.container.querySelector('#decorateLayer');
            var dom = document.createElement('button');
            var pos = data.modelPos;

            dom.classList.add('close');
            dom.style.position = 'absolute';
            dom.style.left = (pos.x + pos.w - 25) + 'px';
            dom.style.top = (pos.y + pos.h / 2 - 12) + 'px';
            dom.style.float = 'none';
            dom.style.fontSize = '24px';
            dom.style.color = '#c7254e';
            dom.style.opacity = 1;
            dom.innerHTML = '<span>×</span>';

            container.appendChild(dom);

            dom.onclick = function (e) {
                _this.store.dictVariable[data.param[0]] = '';

                _this.page.reloadWidgetById(modelId, {});
                // 将添加到控件上的点删除
                container.removeChild(this);
                // 更新 dictVariable 字段
                //_this.__updateThing([{
                //    _id: _this.store.thingId,
                //    projId: _this.store.projId,
                //    name: _this.store.name,
                //    srcPageId: _this.store.srcPageId,
                //    dictVariable: _this.store.dictVariable
                //}]);
            };
        };

        this.__updateThing = function (data) {
            // 更新 thing
            return WebAPI.post('/diagnosisEngine/saveThings', data);
        };

        this.__getDestInfoByTplParam = function (param) {
            var match, info = {};

            this.tplParamList.some(function (row) {
                if (row.param.indexOf(param) > -1) {
                    match = row;
                    return true;
                }
            });

            if (!match) {
                return;
            }

            return match;
        };

        this.__matchDataSource = function (data) {
            // var dsInfo = AppConfig.datasource.getDSItemById(data);
            var dsInfo = _this.filterPanel.tree.getNodesByParam("id", data, null);
            return WebAPI.post('/diagnosisEngine/matchPoints', {
                'type': this.store.type,
                // 'arrVariable': this.__getTplParamList(),
                'arrVariable': _this.store.arrVariable,
                'arrClass': dsInfo.map(function (row) {
                    return {
                        _id: row.id,
                        name: row.value,
                        note: row.alias
                    }
                })
            });
        };

        this.initPageScreen = function () {
            var PageScreen = namespace('observer.screens.PageScreen');

            if (this.page) {
                this.page.close();
            }
            this.page = new PageScreen({
                id: this.store.srcPageId,
                params: this.store.dictVariable
            }, this.equipCtn);
            return this.page.show();
        };

        this.initAnimation = function () {
            this.animController = new AnimController(_this.animCtn, {
                onArrived: this.__onArrivedCallback.bind(this),
                onAllArrived: this.__onAllArrivedCallback.bind(this)
            });
        };

        this.close = function () {
            if (this.page) {
                this.page.close();
            }
        };

    }.call(DiagnosisConfigScreen.prototype);

    exports.DiagnosisConfigScreen = DiagnosisConfigScreen;

}(window));
/**
 * Created by win7 on 2016/5/20.
 */
(function(){
    var _this;
    function PanelToggle(){
        _this = this;
        _this.panelLeft = undefined;
        _this.panelCenter = undefined;
        _this.panelRight = undefined;
        _this.opt = {
            left:{
                show:false,
                width:'15%'
            },
            center:{
                show:false,
                width:'70%'
            },
            right:{
                show:false,
                width:'15%'
            }
        }
    }
    PanelToggle.prototype = {
        init:function(){
            _this.panelLeft = document.getElementById('panelLeft');
            _this.panelCenter = document.getElementById('panelCenter');
            _this.panelRight = document.getElementById('panelRight');
            _this.toggle({
                left:{
                    show:false,
                    width:'15%'
                },
                center:{
                    show:false,
                    width:'70%'
                },
                right:{
                    show:false,
                    width:'15%'
                }
            })
        },
        toggle:function(opt){
            _this.opt = $.extend(true, {}, _this.opt, opt);
            if (_this.opt.left.show === true){
                _this.panelLeft.style.display = 'inline-block';
            }else if(_this.opt.left.show === false){
                _this.panelLeft.style.display = 'none';
            }
            if (_this.opt.center.show === true){
                _this.panelCenter.style.display = 'inline-block';
            }else if(_this.opt.center.show === false){
                _this.panelCenter.style.display = 'none';
            }
            if (_this.opt.right.show === true){
                _this.panelRight.style.display = 'inline-block';
            }else if(_this.opt.right.show === false){
                _this.panelRight.style.display = 'none';
            }
            _this.styleAdjust();
        },
        onresize:function(){
            _this.styleAdjust();
        },
        styleAdjust:function(){
            _this.panelLeft.style.width = _this.opt.left.width;
            _this.panelRight.style.width = _this.opt.right.width;
            _this.panelCenter.style.width = ElScreenContainer.clientWidth - _this.panelLeft.offsetWidth - _this.panelRight.offsetWidth - 1 + 'px';
        }
    };

    window.PanelToggle = new PanelToggle();
})(window);
/**
 * Created by win7 on 2016/5/20.
 */
(function(window){
    var _this;
    function TemplateTree(){
        _this=  this;
        _this.store = undefined;
        _this.ctn = undefined;
        _this.$modal = undefined;
        _this.tree = undefined;

        _this.opt = {
            click:function(){}
        };
    }
    TemplateTree.prototype = {
        modalCtnTpl:'\
                <div id="modalNodeTool" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="ttlNodeTool">\
                    <div class="modal-dialog">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                                <h4 class="modal-title" id="ttlNodeTool">Diagnosis Edit</h4>\
                            </div>\
                            <div class="modal-body">\
                            </div>\
                            <div class="modal-footer">\
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                                <button type="button" class="btn btnSure btn-primary">Save</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>',

        modalEditTpl:'\
                <div id="divAddModeSel" class="divSetPart">\
                    <label id="labelAddModeSel" class="labelSet">Add Mode:</label>\
                    <input type="radio" name="iptAddModeSel" id="iptAddSingle" class="iptAddModeSel" value="0" checked></input>\
                    Single\
                    <input type="radio" name="iptAddModeSel" id="iptAddMulti" class="iptAddModeSel" value="1"></input>\
                    Multiple\
                </div>\
                <div id="divDiagnosisNameEdit" class="form-group divSetPart">\
                    <label id="labelDiagnosisNameEdit" class="labelSet">Diagnosis Name:</label>\
                    <input class="form-control" type="text" id="iptDiagnosisNameEdit" value="<%name%>" \
                    placeholder = "set value like this: name<%x%> for batch"></input>\
                </div>\
                <div id="divBatchSet" class="form-group divSetPart">\
                    <label id="labelBatchSet" class="labelSet">Batch Configure:</label>\
                    <input class="form-control"type="text" id="iptBatchSet" disabled value=\'{\"x\":[\"1\",\"2\"]}\' \
                    placeholder =\'{\"x\":[\"1\",\"2\"]}\'></input>\
                </div>',
        initOpt:function(){
            _this.defaultOpt = {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: '_id',
                        pIdKey:'tempGrpId'
                    }
                },
                keep: {
                    leaf: true,
                    parent: true
                },
                edit: {
                    enable: true,
                    drag: {
                        isCopy: false,
                        isMove: false
                    },
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                view: {
                    addDiyDom: _this.beforeDomAdd,
                    addHoverDom: function () {
                    },
                    removeHoverDom: function () {
                    },
                    dblClickExpand: false,
                    showIcon: true,
                    showLine: true
                },
                callback: {
                    onClick:_this.onDomClk
                }
            }
        },
        beforeDomAdd:function(treeId,treeNode){
            var target = document.getElementById(treeNode['tId'] + '_a');

            if(!treeNode.tempGrpId) {
                var btnAdd = document.createElement('span');
                btnAdd.className = 'btnAdd btnNodeTool glyphicon glyphicon-plus';
                target.appendChild(btnAdd);
            }

            if(treeNode.tempGrpId) {
                var btnEdit = document.createElement('span');
                btnEdit.className = 'btnEdit btnNodeTool glyphicon glyphicon-pencil';
                target.appendChild(btnEdit);

                var btnDel = document.createElement('span');
                btnDel.className = 'btnDel btnNodeTool glyphicon glyphicon-remove';
                target.appendChild(btnDel);
            }

            if(!treeNode.tempGrpId){
                target.className += ' group'
            }
        },

        onDomClk:function(e,treeId,treeNode){
            var $target = $(e.target);
            if ($target.hasClass('btnAdd')){
                _this.editDiagnosis(treeNode,true);
            }else if ($target.hasClass('btnEdit')){
                _this.editDiagnosis(treeNode);
            }else if ($target.hasClass('btnDel') && treeNode.getParentNode()){
                    infoBox.confirm('Are you sure to delete diagnosis:' + treeNode.name +' ? The operation cannot recover.',okCallback);
                    function okCallback(){
                        var postData = [treeNode['_id']];
                        WebAPI.post('/diagnosisEngine/removeThing',postData ).done(function(e){
                            _this.tree.removeNode(treeNode);
                        }).error(function(){
                            alert('Delete fail！')
                        });
                    }
            }else{
                _this.opt.click[AppConfig.module] && _this.opt.click[AppConfig.module](e,treeNode)
            }
        },


        editDiagnosis:function(treeNode,isAdd){
            if(!_this.$modal) {
                _this.$modal = $(_this.modalCtnTpl);
            }

            var divBatchSet;
            var divAddModeSel;
            if (!isAdd){
                _this.$modal.find('.modal-body').html(_this.modalEditTpl.replace('<%name%>', treeNode.name));
                divBatchSet = _this.$modal.find('#divBatchSet')[0];
                divAddModeSel = _this.$modal.find('#divAddModeSel')[0];
                divBatchSet.style.display = 'none';
                divAddModeSel.style.display = 'none';
            }else{
                _this.$modal.find('.modal-body').html(_this.modalEditTpl.replace('<%name%>', treeNode.name));
                divBatchSet = _this.$modal.find('#divBatchSet')[0];
                divAddModeSel = _this.$modal.find('#divAddModeSel')[0];
                divBatchSet.style.display = 'block';
                divAddModeSel.style.display = 'block';
            }

            var iptBatchSet = _this.$modal.find('#iptBatchSet')[0];
            _this.$modal.find('.iptAddModeSel').off('click').on('click',function(e){
                var name = document.getElementById('iptDiagnosisNameEdit').value;
                if (e.target.id == 'iptAddMulti'){
                    iptBatchSet.disabled = false;
                    if (name.indexOf('<%x%>') < 0){
                        name += '<%x%>';
                    }
                }else{
                    name = name.replace(/<%x%>/g,'');
                    iptBatchSet.disabled = true;
                }
                document.getElementById('iptDiagnosisNameEdit').value = name;
            });


            _this.$modal.find('.btnSure').off('click').on('click',function(){
                var postData ;
                if (isAdd) {
                    if (document.getElementById('iptAddMulti').checked) {
                        postData = _this.getThingBatch(treeNode);
                    } else {
                        postData = [{
                            'name': document.getElementById('iptDiagnosisNameEdit').value,
                            'type': treeNode.type,
                            'projId': treeNode.projId,
                            'srcPageId': '',            //对应Factory中pageScreen的ID，用于加载诊断底图
                            'dictVariable': {},         //变量字典，标识诊断中用到的变量
                                                        //变量名: 数据源ID， 若数据源ID为空，则表示配对失败
                            'dictAlgorithm': {}         //诊断字典，记录该诊断对象中所应用的策略
                        }]
                    }
                }else{
                    postData = [{
                        '_id': treeNode['_id'],
                        'name': document.getElementById('iptDiagnosisNameEdit').value,
                        'type': treeNode.type,
                        'projId': treeNode.projId,
                        'srcPageId': treeNode.srcPageId,        //对应Factory中pageScreen的ID，用于加载诊断底图
                        'dictVariable': treeNode.dictVariable, //变量字典，标识诊断中用到的变量
                                                               //变量名: 数据源ID， 若数据源ID为空，则表示配对失败
                        'dictAlgorithm': treeNode.dictAlgorithm    //诊断字典，记录该诊断对象中所应用的策略
                    }]
                }
                if (!postData)return;
                WebAPI.post('/diagnosisEngine/saveThings',postData).done(function(result){
                    if (isAdd) {
                        for (var i = 0 ; i < postData.length; i++) {
                            postData[i]['_id'] = result.data[i];
                            postData[i].tempGrpId = treeNode['_id'];
                        }
                        _this.tree.addNodes(treeNode, postData);
                    }else{
                        treeNode.name = document.getElementById('iptDiagnosisNameEdit').value;
                        _this.tree.updateNode(treeNode);
                    }
                    _this.store = _this.tree.transformToArray(_this.tree.getNodes());
                    if(isAdd) {
                        alert('Add success！')
                    }else{
                        alert('Edit success！')
                    }
                    _this.$modal.modal('hide');
                }).error(function(){
                    if(isAdd) {
                        alert('Add fail！')
                    }else{
                        alert('Edit fail！')
                    }
                });
            });
            _this.$modal.modal('show');
        },

        getThingBatch:function(treeNode){
            var arrThing = [];
            var batchSet = document.getElementById('iptBatchSet').value;
            var name = document.getElementById('iptDiagnosisNameEdit').value.replace(/'/g,'"');
            var newNode = '';
            try {
                var dictBatch = JSON.parse(batchSet);
                for (var ele in dictBatch){
                    for (var i = 0; i < dictBatch[ele].length ;i++) {
                        arrThing.push({
                            'name':name.replace(new RegExp('<%' + ele + '%>' ,'g'),dictBatch[ele][i]),
                            'type':treeNode.type,
                            'projId':treeNode.projId,
                            'srcPageId': '',            //对应Factory中pageScreen的ID，用于加载诊断底图
                            'dictVariable': {},         //变量字典，标识诊断中用到的变量
                                                        //变量名: 数据源ID， 若数据源ID为空，则表示配对失败
                            'dictAlgorithm': {}        //诊断字典，记录该诊断对象中所应用的策略
                        })
                    }
                }
            }catch(e){
                infoBox.alert('The batch set format is not json,please check!');
                return false;
            }
            return arrThing;
        },

        setData:function(store,opt){
            _this.store = store;
            _this.initOpt();
            _this.setOpt(opt)
            _this.initTree();
        },

        setOpt:function(opt){
            if(opt)_this.opt = $.extend(true, {}, _this.opt, opt);
        },

        initTree:function(){
            if(!_this.ctn){
                if(_this.PanelToggle && _this.PanelToggle.panelLeft){
                    _this.ctn = _this.PanelToggle.panelLeft;
                }else{
                    _this.ctn = document.getElementById('panelLeft')
                }
            }

            if (_this.tree && _this.tree.destroy)_this.tree.destroy();
            _this.tree = $.fn.zTree.init($(_this.ctn), _this.defaultOpt, _this.store);

        },

        refresh:function(){
            WebAPI.get('/diagnosisEngine/getThingListByProjId/' + AppConfig.projectId).done(function(result){
                if (!result || result.data.length == 0)return;
                var dictGrp = {};
                var arrGrp= [];
                WebAPI.get('/iot/getClassFamily/thing/cn').done(function(dictCls){
                    for (var i = 0; i < result.data.length ;i++){
                        if (!dictGrp[result.data[i].type]){
                            dictGrp[result.data[i].type] = {
                                '_id':ObjectId(),
                                'type':result.data[i].type,
                                'projId':AppConfig.projectId,
                                'open':true
                            };
                            if(dictCls[result.data[i].type] && dictCls[result.data[i].type].name){
                                dictGrp[result.data[i].type].name = dictCls[result.data[i].type].name;
                            }else{
                                dictGrp[result.data[i].type].name = result.data[i].type;
                            }
                            arrGrp.push(dictGrp[result.data[i].type])
                        }
                        result.data[i].tempGrpId = dictGrp[result.data[i].type]['_id'];
                    }
                    _this.store =[].concat(arrGrp,result.data);
                    _this.initTree();
                })
            })
        }
    };
    window.TemplateTree = new TemplateTree();
    window.TemplateTree.initOpt();
})(window);
/**
 * Created by win7 on 2016/5/20.
 */
var PtRecognizeScreen = (function(){
    var _this;
    function PtRecognizeScreen(){
        _this = this;
        _this.$divSpinner = undefined;
        _this.$imgSpinner = undefined;
        _this.divResultGrp = undefined;

        _this.spinnerPos = undefined;

        this.diagnosisScreen = undefined;

        AppConfig.module = 'recognize';
    }
    PtRecognizeScreen.prototype = {
        //临时国际化映射
        dictI18n:{
            'AHU':'空调箱',
            'PAU':'新风箱',
            'Chiller':'冷机',
            'PriP':'冷冻泵',
            'SecP':'二次泵',
            'CWP':'冷却泵',
            'CT':'冷却塔',
            'Valve':'阀门',
            'HX':'板换',
            'WSHP':'水源热泵',
            'GSHP':'地源热泵',
            'FPTU':'地台风机',
            'CAVBox':'定风量风箱',
            'VAVBox':'变风量风箱',
            'PCW':'工艺冷却水',
            'GWP':'乙二醇泵',
            'VacP':'真空泵',
            'HWP':'热水泵',
            'MKP':'补水泵',
            'AirCPR':'空压机',
            'ACleaner':'空气净化器',
            'Filter':'过滤器',
            'Boiler':'锅炉',
            'Tank':'水箱',
            'FCU':'风机盘管',
            'Damper':'风阀',
            'Fan':'风机',
            'OtherPump':'其他水泵'
        },
        show:function(){
            WebAPI.get('/static/app/DiagnosisEngine/views/recognize/ptRecognizeScreen.html').done(function(resultHTML){
                PanelToggle.panelCenter.innerHTML = resultHTML;
                PanelToggle.toggle({
                    left: {
                        show:true
                    },
                    center:{
                        show:true
                    },
                    right:{
                        show:true
                    }
                });
                if (!AppConfig.datasource) {
                    // 如果没有预加载，则先去加载数据，再做显示
                    Spinner.spin(PanelToggle.panelRight);
                    WebAPI.get('/datasource/get/' + AppConfig.userId).done(function (result) {
                        _this.store.group = result.group;
                        AppConfig.datasource = new DataSource(_this);
                        AppConfig.datasource.iotOpt = {
                            base:{
                                divideByProject:true
                            },
                            tree:{
                                event:{
                                    addDom:function(treeNode,$target){
                                        if($target.hasClass('projects')){
                                            $target.find('#' + treeNode.tId + '_span').on('dragstart',function(e){
                                                EventAdapter.setData(treeNode);
                                            })
                                        }
                                    }
                                }
                            }};
                        AppConfig.datasource.show();

                    }).always(function (e) {
                        Spinner.stop();
                    });
                } else {
                    AppConfig.datasource.show();
                }

                _this.$divSpinner = $(document.getElementById('divRecognizeSpinner'));
                _this.$imgSpinner = $('.imgRecognizeSpinner');

                _this.divResultGrp = document.getElementById('divRecognizeResultGrp');
                _this.init();
            })
        },
        init:function(){
            TemplateTree.setOpt({
                click:{
                    'recognize':function(e,treeNode){
                        PanelToggle.panelCenter.innerHTML = '';

                        if (this.diagnosisScreen) {
                            this.diagnosisScreen.close();
                        }
                        if(treeNode.srcPageId === ''){
                            WebAPI.get('/diagnosisEngine/getTemplateList').done(function(result){
                                var tabs = [];
                                var isRepeated;
                                for(var i = 0,iLen=result.data.length;i<iLen;i++){
                                    isRepeated = false;
                                    for(var j = 0,jLen = tabs.length;j<jLen;j++){
                                        if(tabs[j]==result.data[i].type){
                                            isRepeated = true;
                                            break;
                                        }
                                    }
                                    if(!isRepeated){
                                        tabs.push(result.data[i].type);
                                    }
                                }
                                var Template = namespace('factory.components.template.Template');
                                this.template = new Template(PanelToggle.panelCenter);
                                this.template.show(tabs,treeNode);
                            });
                        }else{
                            this.diagnosisScreen = new DiagnosisConfigScreen({
                                name: treeNode.name,
                                projId: treeNode.projId,
                                thingId: treeNode._id,
                                srcPageId: treeNode.srcPageId,
                                type: treeNode.type,
                                dictVariable: treeNode.dictVariable
                            });
                            this.diagnosisScreen.show();
                        }
                    }
                }
            });
            _this.initSpinner();
            _this.attachEvent();
        },
        initSpinner:function(){
            _this.$divSpinner[0].style.height = _this.$divSpinner[0].offsetWidth + 'px';
            _this.spinnerPos = {
                left:_this.$divSpinner[0].offsetLeft,
                top:_this.$divSpinner[0].offsetTop,
                height: _this.$divSpinner[0].offsetHeight,
                width:_this.$divSpinner[0].offsetWidth,
                centerX:_this.$divSpinner[0].offsetLeft + _this.$divSpinner[0].offsetWidth / 2,
                centerY:_this.$divSpinner[0].offsetTop + _this.$divSpinner[0].offsetHeight / 2
            };
            _this.$divSpinner[0].ondragenter = function(e){
                e.preventDefault();
            };
            _this.$divSpinner[0].ondragover = function(e){
                e.preventDefault();
            };
            _this.$divSpinner[0].ondragleave = function(e){
                e.preventDefault();
            };
            _this.$divSpinner[0].ondrop = function(){
                var node = EventAdapter.getData();
                if (node.baseType != 'projects')return;
                if (_this.$imgSpinner[0].src != '/static/images/diagnosisEngine/recogSpinner_color.png') {
                    _this.$imgSpinner[0].src = '/static/images/diagnosisEngine/recogSpinner_color.png';
                }
                _this.spinnerSwitch(true);
                AppConfig.projectId = node.projId;
                var arrClass = [];
                for (var ele in AppConfig.datasource.iotFilter.dictClass.groups){
                    arrClass.push(ele);
                }
                var postData = [{
                    projId:node.projId,
                    arrClass:arrClass
                }];
                WebAPI.post('/diagnosisEngine/classifyPoints',postData).done(function(result){
                    if(!result)return;
                    var dictClass = AppConfig.datasource.iotFilter.dictClass.things;
                    var arrData = [];
                    for (var ele in result){
                        arrData.push({
                            '_id':ObjectId(),
                            type:ele,
                            projId:node.projId,
                            num: result[ele],
                            open:true,
                            name:_this.dictI18n[ele]?_this.dictI18n[ele]:ele
                        });
                        if (ele == 'Other'){
                            arrData[arrData.length - 1].name = 'Other';
                            continue;
                        }
                        if(dictClass[ele] && dictClass[ele].name){
                            arrData[arrData.length - 1].name = dictClass[ele].name;
                        }
                    }
                    //setTimeout(function() {
                        if(!(TemplateTree.store instanceof Array) || TemplateTree.store.length == 0) {
                            TemplateTree.setData(arrData);
                        }else{
                            var newArrData = [];
                            var isNew;
                            for (var i = 0; i < arrData.length ;i++){
                                isNew = true;
                                for(var j = 0; j < TemplateTree.store.length ;j++){
                                    if (!TemplateTree.store[j].tempGrpId && TemplateTree.store[j].type == arrData[i].type){
                                        isNew = false;
                                        break;
                                    }
                                }
                                if(isNew){
                                    newArrData.push(arrData[i]);
                                }
                            }
                            TemplateTree.tree.addNodes(null,newArrData);
                        }
                        _this.initRecognizeGrp(arrData);
                    //},3000)
                }).always(function(){
                    //setTimeout(function(){
                        _this.spinnerSwitch(false);
                    //},3000)
                });
            }
        },
        spinnerSwitch:function(status){
            _this.$imgSpinner.find('imgRecognizeSpinnerGrey').css('display','none');
            _this.$imgSpinner.find('imgRecognizeSpinnerColor').css('display','inline-block');
            if(status === true){
                _this.$divSpinner.addClass('spin')
            }else if(status === false){
                _this.$divSpinner.removeClass('spin')
            }else{
                if(_this.$divSpinner.hasClass('spin')){
                    _this.$divSpinner.removeClass('spin')
                }else{
                    _this.$divSpinner.addClass('spin')
                }
            }
        },
        initRecognizeGrp:function(arrData){
            var divResult,spResultType,spResultNum,btnDiagnosisAdd;
            _this.divResultGrp.innerHTML = '';
            for (var i = 0 ; i< arrData.length; i++){
                divResult = document.createElement('div');
                divResult.className = 'divRecognizeRs';

                spResultType = document.createElement('span');
                spResultType.className = 'spRecognizeType';
                spResultType.textContent = arrData[i].name?arrData[i].name:arrData[i].type;

                spResultNum = document.createElement('span');
                spResultNum.className = 'spRecognizeNum';
                spResultNum.textContent = arrData[i].num;

                btnDiagnosisAdd = document.createElement('span');
                btnDiagnosisAdd.className = 'btnDiagnosisAdd';
                btnDiagnosisAdd.textContent = 'Add Diagnosis Group';

                divResult.appendChild(spResultType);
                divResult.appendChild(spResultNum);
                divResult.appendChild(btnDiagnosisAdd);

                _this.divResultGrp.appendChild(divResult);
            }
            _this.setDivideLine();
            _this.setDivRsPos();
        },
        setDivRsPos:function(){
            _this.divResultGrp.style.left = _this.spinnerPos.centerX + 'px';
            _this.divResultGrp.style.top = _this.spinnerPos.centerY + 'px';
            var $divRs = $('.divRecognizeRs');
            var angleStep = 360 / $divRs.length;
            var radius = _this.spinnerPos.height * 0.85;
            var leftFromCenter = 0;
            var topFromCenter = 0;
            for (var i = 0 ; i < $divRs.length ;i++){
                leftFromCenter = radius * Math.sin(angleStep * (i + 0.5) * Math.PI / 180);
                topFromCenter = radius * Math.cos(angleStep * (i + 0.5) * Math.PI / 180);
                $divRs[i].style.left = leftFromCenter - $divRs[i].offsetWidth / 2 + 'px';
                $divRs[i].style.top = - topFromCenter - $divRs[i].offsetHeight / 2 + 'px';
            }
        },
        setDivideLine:function(){
            $('.divGrpLine').remove();
            var line;
            var grpNum = $('.divRecognizeRs').length;
            var angleStep = 360 / grpNum;
            var radius = _this.spinnerPos.height;
            if (grpNum == 1)return;

            for (var i = 0; i < grpNum ;i++){
                line = document.createElement('div');
                line.className ='divGrpLine';
                line.style.transform = 'rotate(' + (180 + angleStep * i) + 'deg)';
                _this.$divSpinner.append(line);
            }
        },
        onresize:function(){
            PanelToggle.onresize();
            _this.$divSpinner[0].style.height = _this.$divSpinner[0].offsetWidth + 'px';
            _this.spinnerPos = {
                left:_this.$divSpinner[0].offsetLeft,
                top:_this.$divSpinner[0].offsetTop,
                height: _this.$divSpinner[0].offsetHeight,
                width:_this.$divSpinner[0].offsetWidth,
                centerX:_this.$divSpinner[0].offsetLeft + _this.$divSpinner[0].offsetWidth / 2,
                centerY:_this.$divSpinner[0].offsetTop + _this.$divSpinner[0].offsetHeight / 2
            };

            _this.setDivRsPos();
            _this.setDivideLine();
        },
        attachEvent:function(){
        },
        close:function(){

        }
    };
    return PtRecognizeScreen;
})();
/*
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/`---'\____
             .'  \\|     |//  `.
            /  \\|||  :  |||//  \
           /  _||||| -:- |||||-  \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |   |
           \  .-\__  `-`  ___/-. /
         ___`. .'  /--.--\  `. . __
      ."" '<  `.___\_<|>_/___.'  >'"".
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         佛祖保佑       永无BUG
*/
/**
 * Created by win7 on 2016/5/20.
 */
var DiagnosisConfig = (function(){
    var _this;
    function DiagnosisConfig(){
        _this = this;
        AppConfig.module = 'configure'
    }
    DiagnosisConfig.prototype = {
        show:function(){
            WebAPI.get('/static/app/DiagnosisEngine/views/configure/diagnosisConfigScreen.html').done(function(resultHTML){
                PanelToggle.panelCenter.innerHTML = resultHTML;
                PanelToggle.toggle({
                    left: {
                        show:true
                    },
                    center:{
                        show:true
                    },
                    right:{
                        show:true
                    }
                });
                if (!AppConfig.datasource) {
                    // 如果没有预加载，则先去加载数据，再做显示
                    Spinner.spin(PanelToggle.panelRight);
                    WebAPI.get('/datasource/get/' + AppConfig.userId).done(function (result) {
                        _this.store.group = result.group;
                        AppConfig.datasource = new DataSource(_this);
                        AppConfig.datasource.iotOpt = {
                            tree:{
                                event:{
                                    addDom:function(treeNode,$target){
                                        if($target.hasClass('projects')){
                                            $target.find('#' + treeNode.tId + '_span').on('dragstart',function(e){
                                                EventAdapter.setData(treeNode);
                                            })
                                        }
                                    }
                                }
                            }};
                        AppConfig.datasource.show();

                    }).always(function (e) {
                        Spinner.stop();
                    });
                } else {
                    AppConfig.datasource.show();
                }

                _this.init();
            })
        },
        init:function(){
            TemplateTree.setOpt({
                click:{
                    'configure':function(e,treeNode){
                        if (treeNode.srcPageId){
                            //有模板 TODO
                            var diagnosisScreen = new DiagnosisConfigScreen({
                                name: treeNode.name,
                                projId: treeNode.projId,
                                thingId: treeNode._id,
                                srcPageId: treeNode.srcPageId,
                                type: treeNode.type,
                                dictVariable: treeNode.dictVariable
                            });
                            diagnosisScreen.show();
                            //ScreenManager.show(DiagnosisConfigScreen);
                        }else{
                            //无模板 TODO
                            WebAPI.get('/diagnosisEngine/getTemplateList').done(function(result){
                                var tabs = [];
                                var isRepeated;
                                for(var i = 0,iLen=result.data.length;i<iLen;i++){
                                    isRepeated = false;
                                    for(var j = 0,jLen = tabs.length;j<jLen;j++){
                                        if(tabs[j]==result.data[i].type){
                                            isRepeated = true;
                                            break;
                                        }
                                    }
                                    if(!isRepeated){
                                        tabs.push(result.data[i].type);
                                    }
                                }
                                var Template = namespace('factory.components.template.Template');
                                this.template = new Template(PanelToggle.panelCenter);
                                this.template.show(tabs,treeNode);
                            });
                        }
                    }
                }
            });
        },
        onresize:function(){
            PanelToggle.onresize();
        },
        attachEvent:function(){
        },
        close:function(){

        }
    };
    return DiagnosisConfig;
})();
/**
 * Created by vicky on 2016/5/23.
 * 诊断自定义
 */
var DnCstmScreen = (function(){
    var _this = undefined;
    function DnCstmScreen(params){// params 实例化自定义诊断对象的相关参数
        this.codemirror = undefined;
        this.params = params;
        _this = this;
        AppConfig.module = 'customAlgorithm';
    }
    DnCstmScreen.prototype = {
        show:function(){
            WebAPI.get('/static/app/DiagnosisEngine/views/custom/dnCstmScreen.html').done(function(resultHTML){
                PanelToggle.panelCenter.innerHTML = resultHTML;
                PanelToggle.toggle({
                    left: {
                        show:true
                    },
                    center:{
                        show:true
                    },
                    right:{
                        show:false
                    }
                });
                _this.init();
            })
        },
        init:function(){
            //初始化codemirror
            this.dCodeEditor = document.getElementById('dCodeEditor')
            this.codemirror = CodeMirror(this.dCodeEditor,{
                mode:  "python",
                lineNumbers: true,
                autofocus: true
            });

            TemplateTree.setOpt({
                click:{
                    'customAlgorithm':function(e,treeNode){
                            _this.getAlgorithmByIds(treeNode);
                    }
                }
            });
            //默认显示第一个
            if(TemplateTree.tree.getNodes().length > 0){
                this.getAlgorithmByIds(TemplateTree.tree.getNodes()[0]);
            }

            document.getElementById('btnSaveAlgorithm').onclick = this.saveAlgorithm;
        },
        onresize:function(){
            PanelToggle.onresize();
        },
        close:function(){

        },
        getAlgorithmByIds: function(treeNode){
            Spinner.spin(_this.dCodeEditor);
            var deviceNm = treeNode.name;
            WebAPI.post('/diagnosisEngine/getAlgorithmByIds',{data: [AppConfig.projectId]}).done(function(result){
                if(result && result.data && result.data.length > 0){
                    $('#crtDevice').html(deviceNm);
                    _this.codemirror.doc.setValue(result.data[0].content);
                    _this.codemirror.algorithmId = result.data[0]._id;
                }else{
                    _this.codemirror.doc.setValue('');
                    _this.codemirror.algorithmId = '';
                }
            }).fail(function(){

            }).always(function(){
                Spinner.stop();
            });
        },
        saveAlgorithm: function(){
            var postData = {
                'creatorId': AppConfig.userId,             //创建者ID
                'timeLastModify': new Date().format('yyyy-MM-dd HH:mm:ss'),       //最后修改时间
                'content': _this.codemirror.doc.getValue(),              //算法内容，为python代码段，可为空
                'src': '',                  //远程算法地址，为空则取content内容, 暂时都为空
                'status': 1
            }
            //'_id': ObjectId(''),        //编号   (有ID为update,无ID为insert)
            if(_this.codemirror.algorithmId){
                postData._id = _this.codemirror.algorithmId;
            }
            WebAPI.post('/diagnosisEngine/saveAlgorithm', {data: ''}).done(function(){
                alert('Save success',{delay: 1000});
            }).fail(function(){
                alert('Save failed',{delay: 1000});
            }).always(function(){

            });
        }
    };
    return DnCstmScreen;
})();
/**
 * Created by vicky on 2016/5/23.
 * 诊断历史
 */
var FaultHistoryScreen = (function(){
    var _this = undefined;
    function FaultHistoryScreen(){

        this.codemirror = undefined;
        _this = this;
        AppConfig.module = 'faultHistory';

        this.chartOpt1 = {
                title: {
                    text: '',
                    subtext: '',
                    x: ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                legend: {
                    data:[],
                    x: 'center'
                },
                grid: {
                    left: 70,
                    right: 70,
                    bottom: 40,
                    //height: '66%',
                    borderColor: '#fff'
                },
                xAxis : {
                    type : 'category',
                    boundaryGap : false,
                    axisLine: {onZero: true},
                    data: [],
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                }
                ,
                yAxis : {
                    name : '',
                    type : 'value',
                    splitLine:{
                        lineStyle: {
                            color: 'rgba(80,80,80,0.5)'
                        }
                    },axisTick:{
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                }
            }

        this.chartOpt2 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                legend: {
                    data:[],
                    x: 'center',
                    show: false
                },
                grid: {
                    left: 70,
                    right: 70,
                    top: 40,
                    /*top: '80%',
                    height: '10%',*/
                    borderColor: '#000'
                },
                xAxis : {
                    //gridIndex: 1,
                    type : 'category',
                    boundaryGap : false,
                    axisLine: {onZero: true},
                    data: [],
                    position: 'top',
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                yAxis : {
                    //gridIndex: 1,
                    name : '',
                    type : 'value',
                    inverse: true,
                    //splitNumber: 1,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel: {
                        show: true
                    }
                }
            }
    }
    FaultHistoryScreen.prototype = {
        show:function(){
            try{
                /*PanelToggle = window.PanelToggle || window.frames[0].PanelToggle;
                TemplateTree = window.TemplateTree || window.frames[0].TemplateTree;*/
                if(!PanelToggle) return;
                WebAPI.get('/static/app/DiagnosisEngine/views/faultHistory/faultHistoryScreen.html').done(function(resultHTML){
                    PanelToggle.panelCenter.innerHTML = resultHTML;
                    PanelToggle.toggle({
                        left: {
                            show:true
                        },
                        center:{
                            show:true
                        },
                        right:{
                            show:false
                        }
                    });
                    _this.init();
                })
            }catch (e){

            }
        },
        init:function(){
            var chartWrap = document.getElementById('chartWrap');// || window.frames[0].document.getElementById('chartWrap');
            var chart1 = document.getElementById('chart1');// || window.frames[0].document.getElementById('chart1');
            var chart2 = document.getElementById('chart2');// || window.frames[0].document.getElementById('chart2');
            this.chart1 = echarts.init(chart1);
            this.chart2 = echarts.init(chart2);
            echarts.connect([chart1, chart2]);

            var $indexLine = $('#indexLine');
            var mouseLeft = 0;
            //鼠标移动时显示竖直线
            chartWrap.onmousemove = function(e){
                //鼠标相对于模态框的位置

                if(e.x != mouseLeft && _this.chart1.getOption()){
                    mouseLeft = e.x;
                }else{
                    return;
                }

                var modal = window.parent.document.getElementById('modalFaultHist'),modalDialog;
                if(modal){
                    modalDialog = $(modal).find('.modal-dialog')[0];
                }else{
                    modalDialog = document.getElementById('chartWrap');
                }
                var relativePosLeft = e.x - modalDialog.offsetLeft;
                if(relativePosLeft < _this.chartOpt1.grid.left || relativePosLeft > (modalDialog.offsetWidth - _this.chartOpt1.grid.right)){
                    $indexLine.hide();
                }else{
                    $indexLine.show().css({left: relativePosLeft});
                }
            }

            TemplateTree.setOpt({
                click:{
                    'faultHistory':function(e,treeNode){
                        _this.showChartFaultHist(treeNode);
                    }
                }
            });

            if(TemplateTree.tree && TemplateTree.tree.getNodes().length > 0){
                _this.showChartFaultHist(TemplateTree.tree.getNodes()[0]);
            }
        },
        onresize:function(){
            PanelToggle.onresize();
        },
        close:function(){

        },
        showChartFaultHist: function(treeNode){
            var now = new Date();
            this.param = {
                timeStart: new Date(now.getTime() - 604800000).format('yyyy-MM-dd HH:mm:00'),//7*24*60*60*1000=604800000
                timeEnd: now.format('yyyy-MM-dd HH:mm:00'),
                timeFormat: "h1"
            }
            $.when(this.getHistData(treeNode), this.getFaultData(treeNode)).done(function(){
                var option1 = {
                    legend: {
                        data: []
                    },
                    xAxis:{data: []}
                };
                var option2 = {
                    legend: {
                        data: []
                    },
                    xAxis:{data: []}
                };
                var arrSeries = [], arrLegend = [];

                //折线部分
                _this.dataHist.list.forEach(function(item){
                    var seriesI = {
                        name: item.dsItemId,
                        type:'line',
                        smooth: true,
                        data: item.data,
                        //xAxisIndex: 0,
                        //yAxisIndex: 0,
                        symbol: 'none',
                        itemStyle: {
                            normal:{
                                color: 'rgb(208, 158, 66)'
                            }
                        }
                    }
                    arrLegend.push(item.dsItemId);
                    arrSeries.push(seriesI)
                });
                //故障个数
                option2.legend.data = ['故障'];
                option2.series = [{
                    name: '故障',
                    type: 'bar',
                    //xAxisIndex: 1,
                    //yAxisIndex: 1,
                    data: _this.arrFault,
                    barWidth: 5,
                    itemStyle: {
                        normal: {
                            color: 'rgb(4, 160, 212)',
                            barBorderRadius: 2
                        }
                    }
                }];

                //格式化时间

                for(var i = 0, time; i < _this.dataHist.timeShaft.length; i++){
                    time = _this.dataHist.timeShaft[i];
                    _this.dataHist.timeShaft[i] = time.replace(/^\d{4}-/g, '').replace(/:\d{2}$/g, '');
                }

                option1.xAxis.data = _this.dataHist.timeShaft;
                option2.xAxis.data = _this.dataHist.timeShaft;
                option1.series = arrSeries;
                option1.legend.data = arrLegend;
                _this.chart1.clear();
                _this.chart1.setOption($.extend(true, option1, _this.chartOpt1));
                _this.chart2.clear();
                _this.chart2.setOption($.extend(true, option2, _this.chartOpt2));
            });
        },
        getHistData: function(treeNode){
            var postData = $.extend(true,{dsItemIds: []}, this.param);
            for(var i in treeNode.dictVariable){
                var dsItem = treeNode.dictVariable[i];
                if(dsItem && dsItem != ''){
                    postData.dsItemIds.push(dsItem);
                }
            }
            if(postData.dsItemIds.length > 0){
                return WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function(result){
                    _this.dataHist = result;
                });
            }
            return null;
        },
        getFaultData: function(treeNode){
            return WebAPI.get('/diagnosisEngine/getNoticeOccurrenceStatistics/'+ treeNode._id +'/'+ this.param.timeStart +'/'+ this.param.timeStart +'/' + this.param.timeFormat).done(function(result){
                _this.arrFault = result.data;
            });
        }
    };
    return FaultHistoryScreen;
})();
var DataSource = (function () {
    var _this;

    function DataSource(parent,opt) {
        _this = this;
        this.m_parent = parent;
        this.m_newPointList = [];
        this.m_allPointList = [];
        this.m_allGroupList = [];
        this.m_arrProjIdColorMap = {};
        this.m_dataSourceId;
        this.m_lang = I18n.resource.dataSource;
        this.m_selectItemId = 0;
        this.m_selectGroupId = 0;
        this.m_groupIconOpen = '/static/images/dataSource/group_head_sel.png';
        this.m_groupIconClose = '/static/images/dataSource/group_head_normal.png';
        this.m_cfgPanel;
        this.m_unassigned = 'unassigned';
        this.m_langFlag = ('zh' == localStorage['language']) ? 0 : 1;   // 0：zh，1：en
        this.$dsNavContain = undefined;
        this.m_curPageNum = 1;
        this.m_arrCloudTableInfo = [];
        this.disableIot = opt && opt.disableIot?true:false;
        this.treeObj = undefined;
        this.iotFilter = undefined;
        this.iotOpt = {};
    }

    DataSource.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            I18n.fillArea($('#divAnlsDatasourcePane'));
            I18n.fillArea($('#divEnergyAnlsPane'));
            _this.loadDataSourceRecord();
            _this.initContain();
            _this.initElement();
            //_this.initDrag();
            //_this.colapseGroups(sessionStorage.getItem('dsOpenGroupId'));
            Spinner.stop();
        },

        close: function () {
            this.m_newPointList = null;
            this.m_allPointList = null;
        },

        initContain: function () {
            this.initTreeNavStyle();

            //var _this = this;
            //var dsContain = $('#dataSrcContain');
            //dsContain.html('');

            //var panel = $('<div id="dataSrcPanel"></div>');
            //dsContain.append(panel);

            //var addGroup = $('<div id="dataSrcAddGroup"><input type="text" id="inputAddGroup" placeholder="+ Add group" ></input></div>');
            //dsContain.append(addGroup);
            //dsContain.keyup(function (e) {
            //    if (13 == e.keyCode) {
            //        _this.addNewGroup();
            //    }
            //});

            //var inputAdd = addGroup.find('#inputAddGroup');
            //inputAdd.attr('placeholder', _this.m_lang.ADD_GROUP);
            //inputAdd.blur(function (e) {
            //    _this.addNewGroup();
            //});
        },

        initTreeNavStyle: function () {
            WebAPI.get('/static/views/observer/dataSource.html').done(function (resultHtml) {
                _this.$dsNavContain = $(resultHtml);
                I18n.fillArea(_this.$dsNavContain);
                var $pageMine = _this.$dsNavContain.find('#pageMine');
                var $pageCloud = _this.$dsNavContain.find('#pageCloud');
                var $pageIot = _this.$dsNavContain.find('#pageIot');
                //主页和factory不同处理

                AppConfig.isFactory && _this.$dsNavContain.find('#liMine').css('display', 'none').attr('class', '');

                _this.$dsNavContain.find('#liMine').click(function (e) {
                    $('#liMine').attr('class', 'active');
                    $('#liCloud').attr('class', '');
                    $('#liIot').attr('class', '');
                    $pageMine.show();
                    $pageCloud.hide();
                    $pageIot.hide();
                    _this.currentObj = 'mine';
                });
                _this.$dsNavContain.find('#liCloud').click(function (e) {
                    if (_this.m_arrCloudTableInfo.length <= 0) {
                        _this.initDsCloud();
                    }
                    $('#liMine').attr('class', '');
                    $('#liCloud').attr('class', 'active');
                    $('#liIot').attr('class', '');
                    $pageMine.hide();
                    $pageIot.hide();
                    $pageCloud.show();
                    _this.currentObj = 'cloud';
                });
                if (_this.disableIot){
                    _this.$dsNavContain.find('#liIot').remove();
                }else {
                    _this.$dsNavContain.find('#liIot').click(function (e) {
                        $('#liMine').attr('class', '');
                        $('#liCloud').attr('class', '');
                        $('#liIot').attr('class', 'active');

                        $pageMine.hide();
                        $pageIot.html('').show();
                        $pageCloud.hide();
                        _this.initIotFilter();
                        _this.currentObj = 'iot';
                    });
                    _this.initIotFilter();
                }
                _this.initDsMine();
                AppConfig.isFactory && _this.initDsCloud();
                $('#dataSrcContain').empty();
                $('#dataSrcContain').append(_this.$dsNavContain);
                AppConfig.isFactory && $('#liCloud').click();
                var addGroup = $('<div id="dataSrcAddGroup"><input type="text" id="inputAddGroup" placeholder="+ Add group" ></div>');
                $pageMine.append(addGroup);
                $('#inputAddGroup').attr('placeholder', I18n.resource.dataSource.ADD_GROUP);

                $pageMine.keyup(function (e) {
                    if (13 == e.keyCode) {
                        _this.addNewGroup();
                    }
                });
                var inputAdd = addGroup.find('#inputAddGroup');
                inputAdd.attr('placeholder', _this.m_lang.ADD_GROUP);
                inputAdd.blur(function (e) {
                    _this.addNewGroup();
                });
            }).always(function (e) {
            });
        },
        initIotFilter: function () {
            var $ctn = _this.$dsNavContain.find('#pageIot');
            _this.iotFilter = new HierFilter($ctn);
            _this.iotFilter.init();
            _this.iotOpt = $.extend(true, {}, {
                base: {
                    divideByProject: true
                },
                tree: {
                    show: true,
                    event: {
                        click: [
                            {
                                act: onNodeClick,
                                tar: ['groups', 'projects']
                            },
                            {
                                act: ontThingClick,
                                tar: 'things'
                            },
                            {
                                act: function () {
                                    console.log('click things')
                                },
                                tar: 'things'
                            }
                        ],
                    },
                    drag: {
                        dragstart: [
                            {
                                act: onAttrDragStart,
                                tar: 'attrs'
                            },
                            {
                                act: onThingsDragStart,
                                tar: 'things'
                            }
                        ],
                        dragend: [
                            {
                                act: onAttrDragEnd,
                                tar: 'attrs'
                            },
                        ]
                    }
                }
            }, _this.iotOpt);
            _this.iotFilter.setOption(_this.iotOpt);
            function onNodeClick(event, treeId, treeNode) {
                if (_this.iotFilter.setDefault === true) {
                    if (!treeNode.children || treeNode.children.length == 0)return;
                    var node = treeNode.children[0];
                    _this.iotFilter.tree.selectNode(node);
                    _this.iotFilter.tree.setting.callback.onClick({target: document.getElementById(node.tId)}, node['_id'], node);
                    _this.iotFilter.setDefault = false
                }
            }

            function ontThingClick(event, treeId, treeNode) {
                var attrs = _this.iotFilter.dictClass['things'][treeNode.type].attrs;
                var arrNode = [];
                var node;
                for (var pt in treeNode.arrP) {
                    if (!attrs[pt])continue;
                    node = {
                        '_id': treeNode.arrP[pt],
                        'name': attrs[pt].name,
                        'attrType': pt,
                        'baseType': 'attrs'
                    };
                    arrNode.push(node)
                }
                if (!treeNode.children || treeNode.children.length == 0) {
                    _this.iotFilter.tree.addNodes(treeNode, arrNode, true);
                }
            }

            function onThingsDragStart(event, treeNode) {
                EventAdapter.setData({
                    'dsItemId': treeNode['_id'],
                    'dsNode': treeNode
                });
                $('.templatePara').css('display', 'block');
            }

            function onAttrDragStart(event, treeNode) {
                EventAdapter.setData({
                    'dsItemId': treeNode['_id'],
                    'dsNode': treeNode
                });
                $('.templatePara').css('display', 'block');
            }

            function onAttrDragEnd() {
                $('.templatePara').css('display', 'none');
                var $template = $('#anlsPane').find('.anlsTemplate');
                $template.attr('class', 'anlsTemplate');
            }

            function onNodeDblClick(event, treeId, treeNode, widget) {
            }
        },
        initDsMine: function () {
            var $inputSearch = _this.$dsNavContain.find('#inputDsMineSearch');
            $inputSearch.keyup(function (e) {
                var searchVal = $(this).val().trim();
                if (13 == e.keyCode && searchVal) {
                    WebAPI.get('/analysis/datasource/searchDsItemInfo/' + AppConfig.userId + '/' + searchVal).done(function (result) {
                        var treeMine = _this.$dsNavContain.find('#treeMine');
                        var zSetting = {
                            async: {
                                enable: false
                            },
                            view: {
                                addDiyDom: addDiyDom,
                                addHoverDom: addHoverDom,
                                removeHoverDom: removeHoverDom,
                                selectedMulti: false,
                                nameIsHTML: true
                            },
                            edit: {
                                enable: true,
                                drag: {
                                    isCopy: false,
                                    isMove: false
                                }
                            },
                            data: {
                                simpleData: {
                                    enable: true
                                }
                            },
                            callback: {
                                beforeRename: zTreeBeforeRename,
                                beforeRemove: zTreeBeforeRemove
                            }
                        };

                        function addDiyDom(treeId, treeNode) {
                            var $itemLeaf = $('#' + treeNode.tId);
                            $itemLeaf.attr('ptid', treeNode.id);
                            $itemLeaf.attr('draggable', true);
                            EventAdapter.on($itemLeaf, 'dragstart', function (e) {
                                $('.templatePara').css('display', 'block');
                                var tar = $(e.target);
                                var dragSrcId = tar.attr('ptid');
                                EventAdapter.setData({'dsItemId': dragSrcId});
                            });
                            EventAdapter.on($itemLeaf, 'dragover', function (e) {
                                e.preventDefault();
                            });
                            EventAdapter.on($itemLeaf, 'dragend', function (e) {
                                $('.templatePara').css('display', 'none');
                                var $template = $('#anlsPane').find('.anlsTemplate');
                                $template.attr('class', 'anlsTemplate');
                            });
                            if (!treeNode.isParent) {
                                if (0 == treeNode.type) {
                                    var prjName = _this.getProjectNameFromId(treeNode.projId, _this.m_langFlag);
                                    _this.initToolTips($itemLeaf, treeNode.name, prjName, treeNode.value, treeNode.note);
                                }
                                else if (1 == treeNode.type) {
                                    var showName = _this.getShowNameFromFormula(treeNode.value);
                                    _this.initFormulaToolTips($itemLeaf, treeNode.name, showName, treeNode.note);
                                }
                            }
                        }

                        function addHoverDom(treeId, treeNode) {
                            if (!treeNode.isParent) {
                                _this.setHoverColor(treeNode);
                            }
                        }

                        function removeHoverDom(treeId, treeNode) {
                            if (!treeNode.isParent) {
                                _this.removeHoverColor(treeNode);
                            }
                        }

                        function zTreeBeforeRename(treeId, treeNode, newName, isCancel) {
                            _this.zTreeBeforeRenameFunc(treeNode, newName);
                        }

                        function zTreeBeforeRemove(treeId, treeNode) {
                            _this.zTreeBeforeRemoveFunc(treeNode);
                        }

                        var zNodes = _this.generateSearchTree(result, searchVal);
                        _this.treeObj = $.fn.zTree.init(treeMine, zSetting, zNodes);
                        $('#dataSrcAddGroup').hide();
                    });
                }
                if (!searchVal) {
                    _this.initDsMineTree();
                    $('#dataSrcAddGroup').show();
                }
            });
            _this.$dsNavContain.find('#spanDsMineSearch').click(function (e) {
                $inputSearch.val('');
                _this.initDsMineTree();
                $('#dataSrcAddGroup').show();
            });
            //Spinner.spin(_this.$dsNavContain[2]);
            _this.initDsMineTree();
            $('#dataSrcAddGroup').show();
        },

        initDsMineTree: function () {
            var zSetting = {
                async: {
                    enable: true,
                    type: 'get',
                    url: function (treeId, treeNode) {
                        return '/analysis/datasource/getDsItemInfo/' + AppConfig.userId + '/' + (typeof treeNode === 'undefined' ? 'null' : treeNode.id);
                    },
                    dataFilter: dsItemfilter
                },
                view: {
                    addDiyDom: addDiyDom,
                    addHoverDom: addHoverDom,
                    removeHoverDom: removeHoverDom,
                    selectedMulti: false
                },
                edit: {
                    enable: true,
                    renameTitle: I18n.resource.dataSource.RENAME,
                    removeTitle: I18n.resource.dataSource.REMOVE,
                    drag: {
                        isCopy: false,
                        isMove: false
                    }
                },
                data: {
                    keep: {
                        leaf: true,
                        parent: true
                    },
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeRename: zTreeBeforeRename,
                    beforeRemove: zTreeBeforeRemove,
                    onAsyncSuccess: zTreeOnAsyncSuccess,
                    onAsyncError: zTreeOnAsyncError,
                    beforeEditName: zTreeBeforEditName
                    //beforeDrag: zTreeBeforeDrag
                    //onDrag: zTreeOnDrag
                }
            };

            function zTreeBeforEditName(treeId, treeNode) {
                if (treeNode.note && treeNode.note !== '' && treeNode.name.indexOf(treeNode.note) >= 0) {
                    treeNode.name = treeNode.name.split('(')[1].split(')')[0];
                }
            }

            function dsItemfilter(treeId, parentNode, responseData) {
                Spinner.spin(_this.$dsNavContain[2]);
                return _this.generateTreeEx(responseData);
            }

            function addDiyDom(treeId, treeNode) {
                if (treeNode.num) {
                    var aObj = _this.$dsNavContain.find("#" + treeNode.tId + "_switch");
                    var $badge = $('<span class="badge treeBadge">' + treeNode.num + '</span>');
                    aObj.next('a').after($badge);
                }

                var $itemLeaf = _this.$dsNavContain.find('#' + treeNode.tId);
                $itemLeaf.attr('ptid', treeNode.id);
                $itemLeaf.attr('draggable', true);
                EventAdapter.on($itemLeaf, 'dragstart', function (e) {
                    $('.templatePara').css('display', 'block');
                    var tar = $(e.target);
                    var dragSrcId = tar.attr('ptid');
                    EventAdapter.setData({'dsItemId': dragSrcId});
                    _this.stopBubble(e);
                });
                EventAdapter.on($itemLeaf, 'dragover', function (e) {
                    e.preventDefault();
                });
                EventAdapter.on($itemLeaf, 'dragend', function (e) {
                    $('.templatePara').css('display', 'none');
                    var $template = $('#anlsPane').find('.anlsTemplate');
                    $template.attr('class', 'anlsTemplate');
                });
                EventAdapter.on($itemLeaf, 'drop', function (e) {
                    var tar = $(e.target);
                    var dstTLi = tar.closest('li');
                    var dstId = dstTLi.eq(0).attr('id');
                    var dstNode = _this.treeObj.getNodeByTId(dstId);

                    var srcId = EventAdapter.getData().dsItemId;
                    var srcJq = $('li[ptid$=' + srcId + ']');
                    var srcTId = srcJq.eq(0).attr('id');
                    var srcNode = _this.treeObj.getNodeByTId(srcTId);

                    var dstParentId = dstNode.pId;
                    var dstParentJq = $('li[ptid$=' + dstParentId + ']');
                    var dstParentTId = dstParentJq.eq(0).attr('id');
                    var dstParentNode = _this.treeObj.getNodeByTId(dstParentTId);

                    var srcParentId = srcNode.pId;
                    var srcParentJq = $('li[ptid$=' + srcParentId + ']');
                    var srcParentTId = srcParentJq.eq(0).attr('id');
                    var srcParentNode = _this.treeObj.getNodeByTId(srcParentTId);

                    var postData = {};
                    var arrSrc = [];
                    var arrDst = [];
                    var srcParId = srcNode.pId;
                    var dstParId = dstNode.pId;
                    //var srcParParId = srcParentNode.pId;
                    //var dstParParId = dstParentNode.pId;
                    var saveType = 0;
                    if (srcNode.isParent && !dstNode.isParent) {    // group --> point, deny
                        return;
                    }
                    else if (!srcNode.isParent && !dstNode.isParent) {   // point --> point
                        if (_this.treeObj.moveNode(dstNode, srcNode, 'next', true)) {
                            if (srcParId == dstParId) {    // leaf, drag in group
                                $.each((dstParentNode.children), function (i, n) {
                                    arrDst.push(n.id);
                                });
                                postData[dstParentId] = arrDst;
                            }
                            else {  // node, drag cross groups
                                $.each((srcParentNode.children), function (i, n) {
                                    arrSrc.push(n.id);
                                });
                                $.each((dstParentNode.children), function (i, n) {
                                    arrDst.push(n.id);
                                });
                                var nSrcIdx = srcParentNode.getIndex();
                                var nDstIdx = dstParentNode.getIndex();
                                if (nDstIdx < nSrcIdx) {  // 往上拖
                                    postData[dstParId] = arrDst;
                                    postData[srcParId] = arrSrc;
                                }
                                else {  // 往下拖
                                    postData[srcParId] = arrSrc;
                                    postData[dstParId] = arrDst;
                                }
                            }
                        }
                    }
                    else if (!srcNode.isParent && dstNode.isParent) {   // point --> group
                        if (_this.treeObj.moveNode(dstNode, srcNode, 'inner', true)) {
                            if (srcParentNode.children) {
                                $.each((srcParentNode.children), function (i, n) {
                                    arrSrc.push(n.id);
                                });
                            }
                            $.each((dstNode.children), function (i, n) {
                                arrDst.push(n.id);
                            });
                            var nSrcIdx = srcParentNode.getIndex();
                            var nDstIdx = dstNode.getIndex();
                            if (nDstIdx < nSrcIdx) {  // 往上拖
                                postData[dstNode.id] = arrDst;
                                postData[srcParId] = arrSrc;
                            }
                            else {  // 往下拖
                                postData[srcParId] = arrSrc;
                                postData[dstNode.id] = arrDst;
                            }
                        }
                    }
                    else if (srcNode.isParent && dstNode.isParent) {   // group --> group
                        saveType = 1;
                        var nSrcIdx = srcNode.getIndex();
                        var nDstIdx = dstNode.getIndex();
                        if (_this.treeObj.moveNode(dstNode, srcNode, 'next', true)) {
                            var liGroup = $('#treeMine').children('li');
                            if (liGroup && liGroup.length > 0) {
                                postData.groupIdList = [];
                                $.each(liGroup, function (i, n) {
                                    postData.groupIdList.push($(n).attr('ptid'));
                                });
                            }
                            //if (srcNode.children) {
                            //    $.each((srcNode.children), function (i, n) {
                            //        arrSrc.push(n.id);
                            //    });
                            //}
                            //if (dstNode.children) {
                            //    $.each((dstNode.children), function (i, n) {
                            //        arrDst.push(n.id);
                            //    });
                            //}
                            //if (nDstIdx < nSrcIdx) {  // 往上拖
                            //    postData[dstNode.id] = arrDst;
                            //    postData[srcNode.id] = arrSrc;
                            //}
                            //else {  // 往下拖
                            //    postData[srcNode.id] = arrSrc;
                            //    postData[dstNode.id] = arrDst;
                            //}
                        }
                    }
                    if (0 == saveType) {
                        WebAPI.post('/analysis/datasource/saveLayout/' + AppConfig.userId, postData).done(function (data) {
                            if (data.success) {
                            }
                        }).always(function () {
                        });
                    }
                    else if (1 == saveType) {
                        WebAPI.post('/datasource/saveDataSourceGroupLayout/' + AppConfig.userId, postData).done(function (data) {
                            if ('successful' == data.error) {
                            }
                        }).always(function () {
                        });
                    }
                    _this.stopBubble(e);
                });

                if (treeNode.id == sessionStorage.getItem('dsOpenGroupId')) {
                    sessionStorage.removeItem('dsOpenGroupId');
                    if (treeNode.isParent && _this.treeObj) {
                        _this.treeObj.expandNode(treeNode, true, false, true);
                    }
                }

                if (!treeNode.isParent) {
                    if (0 == treeNode.type) {
                        var prjName = _this.getProjectNameFromId(treeNode.projId, _this.m_langFlag);
                        _this.initToolTips($itemLeaf, treeNode.name, prjName, treeNode.value, treeNode.note);
                    }
                    else if (1 == treeNode.type) {
                        var showName = _this.getShowNameFromFormula(treeNode.value);
                        _this.initFormulaToolTips($itemLeaf, treeNode.name, showName, treeNode.note);
                    }
                }
            }

            //var newCount = 1;
            function addHoverDom(treeId, treeNode) {
                if (treeNode.isParent) {    // add btn
                    var sObj = $("#" + treeNode.tId + "_span");
                    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) {
                        return;
                    }
                    //if (0 == $("#addBtnPage_"+treeNode.tId).length) {
                    //    var addStr = "<span class='button addPage' id='addBtnPage_" + treeNode.tId + "' title='add page' onfocus='this.blur();'></span>";
                    //    sObj.after(addStr);
                    //    var btnPage = $("#addBtnPage_" + treeNode.tId);
                    //    if (btnPage) btnPage.bind("click", function () {
                    //        if (_this.treeObj) {
                    //            _this.treeObj.addNodes(treeNode, {id: (100 + newCount), pId: treeNode.id, name: "new node" + (newCount++), isParent: false});
                    //        }
                    //        return false;
                    //    });
                    //}

                    if (0 == $("#addBtnFormula_" + treeNode.tId).length) {  // add formula
                        //var addStr = "<span class='button addFormula' id='addBtnFormula_" + treeNode.tId + "' title='add formula' onfocus='this.blur();'></span>";
                        var addStr = "<span class='iconfont' id='addBtnFormula_" + treeNode.tId + "' title='add group' onfocus='this.blur();' style='margin-left:4px'>&#xe63e;</span>";
                        sObj.after(addStr);
                        var btnGroup = $("#addBtnFormula_" + treeNode.tId);
                        if (btnGroup) btnGroup.attr('title', I18n.resource.dataSource.ADD_FORMULA);
                        if (btnGroup) btnGroup.bind("click", function () {
                            if (_this.m_cfgPanel) {
                                $(_this.m_cfgPanel.container).remove();
                            }
                            var addInterface = $('#addPointPanelContain');
                            if (!addInterface || addInterface.length > 0) {
                                return;
                            }
                            _this.m_selectGroupId = treeNode.id;
                            WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                                _this.m_cfgPanel = new DataSourceConfigure(_this, 1, true, '', '', '', -1);
                                _this.m_cfgPanel.show();
                            }).always(function (e) {
                            });
                            return false;
                        });
                    }

                    if (0 == $("#addBtnPage_" + treeNode.tId).length) {  // add page
                        //var addStr = "<span class='button addPage' id='addBtnPage_" + treeNode.tId + "' title='add page' onfocus='this.blur();'></span>";
                        var addStr = "<span class='glyphicon glyphicon-plus-sign button' id='addBtnPage_" + treeNode.tId + "' title='add point' onfocus='this.blur();' style='margin-left:4px;top:2px'></span>";
                        sObj.after(addStr);
                        var btnGroup = $("#addBtnPage_" + treeNode.tId);
                        if (btnGroup) btnGroup.attr('title', I18n.resource.dataSource.ADD_POINT);
                        if (btnGroup) btnGroup.bind("click", function () {
                            var parentNodes = _this.treeObj.getNodesByParam('id', treeNode.id, null);
                            if (parentNodes.length > 0) {
                                if (!parentNodes[0].zAsync) {
                                    _this.treeObj.expandNode(parentNodes[0], true, false, true);
                                }
                            }

                            if (_this.m_cfgPanel) {
                                $(_this.m_cfgPanel.container).remove();
                            }
                            var addInterface = $('#addPointPanelContain');
                            if (!addInterface || addInterface.length > 0) {
                                return;
                            }
                            _this.m_selectGroupId = treeNode.id;
                            WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                                _this.m_cfgPanel = new DataSourceConfigure(_this, 0, true, '', '', '', -1);
                                _this.m_cfgPanel.show();
                            }).always(function (e) {
                            });
                            return false;
                        });
                    }

                    if (0 == $("#addBtnGroup_" + treeNode.tId).length) {  // add group
                        //var addStr = "<span class='button addGroup' id='addBtnGroup_" + treeNode.tId + "' title='add group' onfocus='this.blur();'></span>";
                        var addStr = "<span class='glyphicon glyphicon-object-align-bottom button' aria-hidden='true' id='addBtnGroup_" + treeNode.tId + "' title='add group' onfocus='this.blur();' style='margin-left:20px;top:2px'></span>";
                        sObj.after(addStr);
                        var btnGroup = $("#addBtnGroup_" + treeNode.tId);
                        if (btnGroup) btnGroup.attr('title', I18n.resource.dataSource.ADD_POINT_GROUP);
                        if (btnGroup) btnGroup.bind("click", function () {
                            var newName = 'new group';
                            var postData = {
                                'groupId': '',
                                'name': newName,
                                'parent': (treeNode.id).toString(),
                                'userId': AppConfig.userId
                            }
                            WebAPI.post('/datasource/saveDataSourceGroup', postData).done(function (result) {
                                if ('successful' != result.error) {
                                    return;
                                }
                                var groupId = result.groupId;
                                if (groupId) {
                                    if (_this.treeObj) {
                                        if (treeNode.zAsync) {
                                            _this.treeObj.addNodes(treeNode, {
                                                id: result.groupId,
                                                pId: result.parentId,
                                                name: result.groupName,
                                                isParent: true
                                            });
                                        }
                                        else {
                                            _this.treeObj.expandNode(treeNode, true, false, true);
                                        }
                                    }
                                }
                            }).always(function (e) {
                            });
                            return false;
                        });
                    }
                }
                else {
                    _this.setHoverColor(treeNode);
                }
            };

            function removeHoverDom(treeId, treeNode) {
                $("#addBtnGroup_" + treeNode.tId).unbind().remove();
                $("#addBtnPage_" + treeNode.tId).unbind().remove();
                $("#addBtnFormula_" + treeNode.tId).unbind().remove();
                if (!treeNode.isParent) {
                    _this.removeHoverColor(treeNode);
                }
            };

            function zTreeBeforeRename(treeId, treeNode, newName, isCancel) {
                _this.zTreeBeforeRenameFunc(treeNode, newName);
            }

            function zTreeBeforeRemove(treeId, treeNode) {
                confirm(I18n.resource.dataSource.DELETE_GROUP_INFO, function () {
                    _this.zTreeBeforeRemoveFunc(treeNode);
                    _this.treeObj.removeNode(treeNode);
                });
                return false;
            }

            function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
                Spinner.stop();
            };

            function zTreeOnAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
                Spinner.stop();
            };

            //function zTreeBeforeDrag(treeId, treeNodes) {
            //    var evt;
            //    var el = document.getElementById(treeNodes[0].tId);
            //    if (document.createEvent) { // DOM Level 2 standard
            //        evt = document.createEvent("MouseEvent");
            //        evt.initMouseEvent("dragstart", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            //        el.dispatchEvent(evt);
            //    } else if (el.fireEvent) { // IE
            //        el.fireEvent('ondragstart');
            //    }
            //    return true;
            //};
            //function zTreeOnDrag(event, treeId, treeNodes){
            //    var evt;
            //    var el = document.getElementById(treeNodes[0].tId);
            //    if (document.createEvent) { // DOM Level 2 standard
            //        evt = document.createEvent("MouseEvent");
            //        evt.initMouseEvent("dragstart", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            //        el.dispatchEvent(evt);
            //    } else if (el.fireEvent) { // IE
            //        el.fireEvent('ondragstart');
            //    }
            //}

            $(document).ready(function () {
                var treeMine = _this.$dsNavContain.find('#treeMine');
                var arrInit = _this.generateTreeEx(_this.m_parent.store.group);
                _this.treeObj = $.fn.zTree.init(treeMine, zSetting, arrInit);
            });

            /*
             var prjId = 1;
             WebAPI.get('/factory/getPageList/' + prjId + '/1').done(function (result) { // for test
             if (result && result.data) {
             var zSetting = {
             view: {
             fontCss: {
             color: "#ffffff"
             },
             addDiyDom: addDiyDom
             },
             edit: {
             enable: true,
             editNameSelectAll: true,
             showRenameBtn: false,
             showRemoveBtn: false
             },
             data: {
             simpleData: {
             enable: true,
             idKey: 'id',
             pIdKey: 'pId',
             rootPId: 0
             }
             },
             callback: {}
             };

             function addDiyDom(treeId, treeNode) {
             if (treeNode.num) {
             var aObj = $("#" + treeNode.tId + "_switch");
             var $badge = $('<span class="badge treeBadge">' + treeNode.num + '</span>');
             aObj.next('a').after($badge);
             }
             }

             result.data = arrTest;  // for test
             var zProjNodes = _this.generateTreeEx(result.data); //

             $(document).ready(function () {
             var treeMine = _this.$dsNavContain.find('#treeMine');
             _this.treeObj = $.fn.zTree.init(treeMine, zSetting, zProjNodes);
             });
             }
             }).always(function (e) {
             })*/
        },

        zTreeBeforeRenameFunc: function (treeNode, newName) {
            if (treeNode.isParent) {    // group
                var postData = {
                    'groupId': treeNode.id,
                    'name': newName,
                    'parent': Boolean(treeNode.pId) ? (treeNode.pId).toString() : '',
                    'userId': AppConfig.userId
                }
                WebAPI.post('/datasource/saveDataSourceGroup', postData).done(function (result) {
                    if ('successful' != result.error) {
                        return false;
                    }
                }).always(function (e) {
                    return true;
                });
            }
            else {  // page
                var treeNodeNote = treeNode.note ? treeNode.note : '';
                newName = (treeNodeNote !== '') ? (treeNodeNote + '(' + newName + ')') : newName;
                var postData = {
                    itemList: [{
                        id: treeNode.id,
                        type: 0,
                        projId: treeNode.projId,
                        alias: newName,
                        note: treeNode.note,
                        value: treeNode.value,
                        groupId: treeNode.pId
                    }]
                };
                WebAPI.post('/analysis/datasource/saveMulti', postData).done(function (data) {
                    if (data.itemIdList.length > 0) {
                        return true;
                    }
                    return false;
                }).error(function (e) {
                    return false;
                }).always(function (e) {
                    treeNode.name = newName;
                    $('#treeMine').find('li[ptid=' + treeNode.id + ']').find('a span').eq(1).text(newName);
                });
            }
        },

        zTreeBeforeRemoveFunc: function (treeNode) {
            if (treeNode.isParent) {
                WebAPI.get('/datasource/deleteDataSourceGroup/' + AppConfig.userId + '/' + treeNode.id).done(function (result) {
                    if (('successful' != result.error)) {
                        return false
                    }
                }).always(function (e) {
                    return true;
                });
            }
            else {
                var $itemLeaf = _this.$dsNavContain.find('#' + treeNode.tId);
                if ($itemLeaf && $itemLeaf.length > 0) {
                    $itemLeaf.tooltip('destroy');
                }
                WebAPI.get('/analysis/datasource/removeSingle/' + treeNode.id).done(function (data) {
                    if (!data.success) {
                        return false;
                    }
                    else {
                        // modify num flag
                        var parentId = treeNode.pId;
                        var arrGroup = _this.m_parent.store.group;
                        for (var i = 0; i < arrGroup.length; i++) {
                            if (arrGroup[i].id == parentId) {
                                arrGroup[i].num -= 1;
                                var $nodeParent = $("li[ptid='" + parentId + "']");
                                if ($nodeParent && $nodeParent.length > 0) {
                                    var $spanBadge = $nodeParent.find('.treeBadge')
                                    if ($spanBadge && $spanBadge.length > 0) {
                                        $spanBadge.text(arrGroup[i].num.toString());
                                    }
                                }
                                break;
                            }
                        }
                        return true;
                    }
                }).always(function () {
                });
            }
        },

        generateTreeEx: function (arr) {
            var result = [];
            if (!arr) {
                return result;
            }

            var params;
            var unassigned;
            for (var i = 0, len = arr.length; i < len; i++) {
                var item = arr[i];
                if (item) {
                    var itemNode = item.note ? item.note : '';
                    var itemAlias = item.alias ? item.alias : '';
                    var itemName = itemAlias;
                    if (itemNode !== '' && itemAlias !== '') {
                        if (itemAlias.indexOf(itemNode) < 0) {
                            itemName = itemNode + ' (' + itemAlias + ')'
                        }
                    }
                    params = {
                        id: item.id,
                        pId: item.parentId,
                        isParent: item.isParent,
                        name: itemName,
                        value: item.value,
                        note: item.note,
                        projId: item.projId,
                        num: item.num,
                        type: item.type
                    }
                    if (!item.isParent) {
                        var leafIcon = (1 == item.type) ? 'ptFormula' : 'ptNormal';
                        params['iconSkin'] = leafIcon;
                    }
                    if ('unassigned' == item.alias) {
                        unassigned = params;
                    }
                    else {
                        result.push(params);
                    }
                }
            }
            if (unassigned) {
                result.push(unassigned);
            }
            return result;
        },

        generateSearchTree: function (arr, searchText) {
            var result = [];
            var params;
            for (var id in arr) {
                params = {
                    id: id,
                    pId: null,
                    isParent: true,
                    name: arr[id].groupName,
                    value: id,
                    note: '',
                    projId: '',
                    type: 0,
                    open: true
                };
                result.push(params);    // set group

                if (arr[id].dsList) {
                    for (var i = 0, len = arr[id].dsList.length; i < len; i++) {
                        var item = arr[id].dsList[i];
                        var keyWordName = item.alias;
                        searchText.replace(/[^\w\d\s\u4e00-\u9fa5]/g, ' ').split(/\s/g).forEach(function (search_item) {
                            if (search_item) {
                                keyWordName = keyWordName.replace(new RegExp("(" + search_item + ")(?![^<]*>|[^<>]*</)", "gi"), '<span class="keyword">$1</span>');
                            }
                        });
                        params = {
                            id: item.id,
                            pId: id,
                            isParent: false,
                            name: keyWordName,
                            value: item.value,
                            note: item.note,
                            projId: item.projId,
                            type: item.type,
                            iconSkin: (1 == item.type) ? 'ptFormula' : 'ptNormal'
                        };
                        result.push(params);    // set leaf
                    }
                }
            }
            return result;
        },

        setHoverColor: function (treeNode) {
            var $row = $('#' + treeNode.tId);
            if ($row && $row.length > 0) {
                $row.css('background-color', '#FFE6B0');
                var $name = $('#' + treeNode.tId + '_span');
                if ($name && $name.length > 0) {
                    $name.css('color', '#000');
                }
                $row.find('.edit').css('color', '#000');
                $row.find('.remove').css('color', '#000');
            }
        },

        removeHoverColor: function (treeNode) {
            var $row = $('#' + treeNode.tId);
            if ($row && $row.length > 0) {
                $row.css('background-color', '');
                var $name = $('#' + treeNode.tId + '_span');
                if ($name && $name.length > 0) {
                    $name.css('color', '');
                }
                $row.find('.edit').css('color', '');
                $row.find('.remove').css('color', '');
            }
        },

        initDsCloud: function () {
            // select
            var $selPrjName = _this.$dsNavContain.find('#selectPrjName');
            $selPrjName.empty();
            var opt;
            var prjId = AppConfig.project && AppConfig.project.bindId ? AppConfig.project.bindId : AppConfig.projectId;
            var nSize = AppConfig.projectList.length;
            for (var i = 0; i < nSize; i++) {
                var project = AppConfig.projectList[i];
                opt = document.createElement('option');
                if (0 == _this.m_langFlag) {
                    opt.textContent = project.name_cn;
                }
                else {
                    opt.textContent = project.name_english;
                }
                opt.value = project.id;
                $selPrjName.append(opt);
            }
            $selPrjName.val(prjId);
            $selPrjName.change(function (e) {
                var prjId = $('#selectPrjName').find('option:selected').val();
                _this.initDsCloudTable(prjId, 1, 50);
            });

            // search
            var $inputSearch = _this.$dsNavContain.find('#inputDsCloudSearch');
            $inputSearch.keyup(function (e) {
                var searchVal = $(e.currentTarget).val();
                if (13 == e.keyCode) {
                    var prjId = _this.$dsNavContain.find('#selectPrjName').val();
                    if (!prjId) {
                        return false;
                    }
                    var size = 50;
                    WebAPI.post('/point_tool/getCloudPointTable/', {
                        projectId: parseInt(prjId),
                        currentPage: 1,
                        pageSize: size,
                        searchText: searchVal
                    }).done(function (result) {
                        if (result.success && result.data) {
                            // empty table
                            var $tableBody = _this.$dsNavContain.find('#tableDsCloud tbody');
                            $tableBody.empty();

                            // fill table
                            _this.setCloudTable(result.data.pointTable);

                            var ptTotal = result.data.pointTotal;
                            var allPageNum = Math.ceil(ptTotal / size);
                            _this.setCloudNav(allPageNum);
                        }
                    }).always(function (e) {
                    });
                }
                if ('' == searchVal) {
                    _this.initDsCloudFunc();
                }
            });
            _this.$dsNavContain.find('#spanDsCloudSearch').click(function (e) {
                $inputSearch.val('');
                _this.initDsCloudFunc();
            });

            // table
            _this.initDsCloudTable(prjId, 1, 50);
        },

        initDsCloudTable: function (prjId, page, size) {
            if (!prjId) {
                return false;
            }
            Spinner.spin(_this.$dsNavContain[2]);
            WebAPI.post('/point_tool/getCloudPointTable/', {
                projectId: parseInt(prjId),
                currentPage: page,
                pageSize: size
            }).done(function (result) {
                if (result.success && result.data) {
                    // set table
                    _this.m_arrCloudTableInfo = result.data.pointTable;
                    _this.setCloudTable(_this.m_arrCloudTableInfo);

                    // set nav
                    var ptTotal = result.data.pointTotal;
                    var allPageNum = Math.ceil(ptTotal / size);
                    _this.setCloudNav(allPageNum);
                }
            }).always(function (e) {
                Spinner.stop();
            });
        },

        initDsCloudFunc: function () {
            // empty table
            var $tableBody = _this.$dsNavContain.find('#tableDsCloud tbody');
            $tableBody.empty();

            // init ds cloud table
            var prjId = _this.$dsNavContain.find('#selectPrjName').val();
            _this.initDsCloudTable(prjId, 1, 50);
        },

        setCurrentPage: function (curPageNum, size) {
            curPageNum = parseInt(curPageNum, 10);
            var prjId = _this.$dsNavContain.find('#selectPrjName').val();
            if (!prjId) {
                return false;
            }
            Spinner.spin(_this.$dsNavContain[2]);

            WebAPI.post('/point_tool/getCloudPointTable/', {
                projectId: parseInt(prjId),
                currentPage: curPageNum,
                pageSize: size,
                searchText: _this.$dsNavContain.find('#inputDsCloudSearch').val()
            }).done(function (result) {
                if (result.success && result.data) {
                    var ptTotal = result.data.pointTotal ? result.data.pointTotal : 0;
                    var allPageNum = Math.ceil(ptTotal / size);

                    //_this.m_pointList = {'pointList':result.pointList, 'customName':result.customName, 'pageAllNum':result.pageAllNum};
                    _this.m_curPageNum = curPageNum;
                    var liPageNum = $('#navPageNum').find('.pageNum');
                    if (curPageNum <= 3) {
                        liPageNum.eq(0).attr('value', '1');
                        liPageNum.eq(1).attr('value', '2');
                        liPageNum.eq(2).attr('value', '3');
                        liPageNum.eq(3).attr('value', '4');
                        liPageNum.eq(4).attr('value', '5');
                        liPageNum.eq(0).text('1');
                        liPageNum.eq(1).text('2');
                        liPageNum.eq(2).text('3');
                        liPageNum.eq(3).text('4');
                        liPageNum.eq(4).text('5');
                    }
                    else if (curPageNum >= allPageNum - 2) {
                        liPageNum.eq(0).attr('value', allPageNum - 4);
                        liPageNum.eq(1).attr('value', allPageNum - 3);
                        liPageNum.eq(2).attr('value', allPageNum - 2);
                        liPageNum.eq(3).attr('value', allPageNum - 1);
                        liPageNum.eq(4).attr('value', allPageNum);
                        liPageNum.eq(0).text(allPageNum - 4);
                        liPageNum.eq(1).text(allPageNum - 3);
                        liPageNum.eq(2).text(allPageNum - 2);
                        liPageNum.eq(3).text(allPageNum - 1);
                        liPageNum.eq(4).text(allPageNum);
                    }
                    else {
                        liPageNum.eq(0).attr('value', curPageNum - 2);
                        liPageNum.eq(1).attr('value', curPageNum - 1);
                        liPageNum.eq(2).attr('value', curPageNum);
                        liPageNum.eq(3).attr('value', curPageNum + 1);
                        liPageNum.eq(4).attr('value', curPageNum + 2);
                        liPageNum.eq(0).text(curPageNum - 2);
                        liPageNum.eq(1).text(curPageNum - 1);
                        liPageNum.eq(2).text(curPageNum);
                        liPageNum.eq(3).text(curPageNum + 1);
                        liPageNum.eq(4).text(curPageNum + 2);
                    }

                    // set current page background-color
                    for (var i = 0, len = liPageNum.length; i < len; i++) {
                        var item = liPageNum.eq(i);
                        if (item.attr('value') == curPageNum) {
                            item.closest('li').attr('class', 'active');
                        }
                        else {
                            item.closest('li').removeAttr('class');
                        }
                    }

                    _this.setCloudTable(result.data.pointTable);
                }
            }).always(function (e) {
                Spinner.stop();
            });
        },

        setCloudTable: function (ptTable, searchText) {
            var $tableBody = _this.$dsNavContain.find('#tableDsCloud tbody');
            if ($tableBody) {
                $tableBody.empty();
                for (var i = 0, len = ptTable.length; i < len; i++) {

                    var $itemTr = $('<tr ptId="' + ptTable[i]._id + '" draggable="true" title="' + ptTable[i].value + ' : ' + ptTable[i].alias + ' "></tr>');
                    //var $itemTdCnt = $('<td><span class="tabColNum">' + (i + 1) + '</span></td>');
                    var $itemTd = $('<td>');
                    var $itemTdName = $('<span class="tabColName" data-value="' + ptTable[i].value + '">' +ptTable[i].value + '</span>');
                    var $itemTdDesc = $('<span class="tabColDesc"> -- ' + ptTable[i].alias + '</span>');
                    var $itemTdIcon = $('<span class="btnFav glyphicon glyphicon-plus-sign" aria-hidden="true"></span>');
                    $itemTdIcon.off().click(function (e) {
                        var $row = $(e.currentTarget).closest('tr');
                        var ptId = $row.attr('ptId');
                        for (var i = 0, len = _this.m_arrCloudTableInfo.length; i < len; i++) {
                            if (ptId == _this.m_arrCloudTableInfo[i]._id) {
                                _this.insertIntoMineTable(_this.m_arrCloudTableInfo[i]);
                                break;
                            }
                        }
                    });
                    //$itemTr.append($itemTdCnt);
                    $itemTd.append($itemTdName);
                    $itemTdDesc.append($itemTdIcon);
                    $itemTd.append($itemTdDesc);
                    $itemTr.append($itemTd);
                    var start = null;
                    EventAdapter.on($itemTr, 'click', function (e) {
                        e = e || event;
                        var $this = $(this);
                        var $tableDsCloud = $('#tableDsCloud');
                        var trArr = $tableDsCloud.find('tr');
                        if (e.ctrlKey) {//17
                            //ctrl键
                            if (!e.shiftKey) {
                                if ($this.hasClass('activeTr')) {
                                    $this.removeClass('activeTr');
                                } else {
                                    $this.addClass('activeTr');
                                }
                                start = this;
                            } else {//ctrl+shift多选
                                var startIndex = $(start).index(), lastIndex = $this.index();
                                var selTr = trArr.slice(Math.min(startIndex, lastIndex), Math.max(startIndex, lastIndex) + 1);
                                //多选或反选
                                if ($(start).hasClass('activeTr')) {
                                    selTr.addClass('activeTr');
                                } else {
                                    selTr.removeClass('activeTr');
                                }
                            }
                        } else if (e.shiftKey) {//16
                            //shift键
                            if ($('.activeTr').length !== 0) {
                                var startIndex = $(start).index(), lastIndex = $this.index();
                                var selTr = trArr.slice(Math.min(startIndex, lastIndex), Math.max(startIndex, lastIndex) + 1);
                                selTr.addClass('activeTr');
                                trArr.not(selTr).removeClass('activeTr');
                            } else {
                                $this.addClass('activeTr');
                            }
                        } else {
                            trArr.removeClass('activeTr');
                            $this.addClass('activeTr');
                            start = this;
                        }
                    });
                    EventAdapter.on($itemTr, 'dragstart', function (e) {
                        $('.templatePara').css('display', 'block');
                        var tar = ($('.activeTr').length > 1) ? $('.activeTr') : $(e.target);
                        var targetId = $(e.target).attr('ptid');
                        var dragSrcId = undefined, isDragMore = false, dragId = [];
                        if ($('.activeTr').length > 1) {
                            tar.each(function (i, item) {
                                var itemId = $(item).attr('ptid');
                                if (itemId === targetId) {
                                    isDragMore = true;
                                }
                                dragId.push(itemId);
                            });
                            if (isDragMore) {
                                dragSrcId = dragId;
                            } else {
                                dragSrcId = targetId;
                            }
                        } else {
                            dragSrcId = tar.attr('ptid');
                        }
                        //var dragSrcId = tar.attr('ptid');
                        EventAdapter.setData({'dsItemId': dragSrcId});
                    });
                    EventAdapter.on($itemTr, 'dragover', function (e) {
                        e.preventDefault();
                    });
                    EventAdapter.on($itemTr, 'dragend', function (e) {
                        $('.templatePara').css('display', 'none');
                        var $template = $('#anlsPane').find('.anlsTemplate');
                        $template.attr('class', 'anlsTemplate');
                    });
                    $tableBody.append($itemTr);
                }
            }
        },

        setCloudNav: function (allPageNum) {
            var ul = $('<ul class="pagination">\
                <li><a class="pageFlag" value="First"><span aria-hidden="true">&laquo;</span></a></li>\
                <li><a class="pageFlag" value="Previous"><span aria-hidden="true">&lsaquo;</span></a></li>\
            </ul>');
            if (allPageNum > 5) {
                ul.append('<li class="active"><a class="pageFlag pageNum" value="1">1</a></li>\
                    <li><a class="pageFlag pageNum" value="2">2</a></li>\
                    <li><a class="pageFlag pageNum" value="3">3</a></li>\
                    <li><a class="pageFlag pageNum" value="4">4</a></li>\
                    <li><a class="pageFlag pageNum" value="5">5</a></li>');
            }
            else {
                for (var i = 0; i < allPageNum; i++) {
                    var numTmp = i + 1;
                    if (0 == i) {
                        ul.append('<li class="active"><a class="pageFlag pageNum" value="' + numTmp + '">' + numTmp + '</a></li>');
                    }
                    else {
                        ul.append('<li><a class="pageFlag pageNum" value="' + numTmp + '">' + numTmp + '</a></li>');
                    }
                }
            }
            ul.append('<li><a class="pageFlag" value="Next"><span aria-hidden="true">&rsaquo;</span></a></li>\
                        <li><a class="pageFlag" value="Last"><span aria-hidden="true">&raquo;</span></a></li>');

            var pageFlag = ul.find('.pageFlag');
            pageFlag.click(function (e) {
                var value = $(e.currentTarget).attr('value');
                if ('First' == value) {
                    if (_this.m_curPageNum != 1) {
                        _this.setCurrentPage(1, 50);
                    }
                }
                else if ('Previous' == value) {
                    if (_this.m_curPageNum > 1) {
                        _this.setCurrentPage(_this.m_curPageNum - 1, 50);
                    }
                }
                else if ('Next' == value) {
                    if (_this.m_curPageNum < allPageNum) {
                        _this.setCurrentPage(_this.m_curPageNum + 1, 50);
                    }
                }
                else if ('Last' == value) {
                    if (_this.m_curPageNum != allPageNum) {
                        _this.setCurrentPage(allPageNum, 50);
                    }
                }
                else {
                    if (_this.m_curPageNum != value) {
                        _this.setCurrentPage(value, 50);
                    }
                }
            });
            var $navPage = _this.$dsNavContain.find('#navPageNum');
            $navPage.empty();
            $navPage.append(ul);
        },

        insertIntoMineTable: function (newNode) {
            var nodeParent = _this.treeObj.getNodesByParam('name', 'unassigned', null);
            if (nodeParent.length > 0) {
                var postData = {
                    itemList: [{
                        type: 0,
                        projId: newNode.projId,
                        alias: newNode.value,
                        value: newNode.value,
                        groupId: nodeParent[0].id
                    }]
                };
                WebAPI.post('/analysis/datasource/saveMulti', postData).done(function (data) {
                    if (data.itemIdList.length > 0) {
                        var item = data.itemIdList[0];
                        var obj = {
                            id: item.id,
                            pId: item.groupId,
                            name: item.alias,
                            isParent: false,
                            value: item.value,
                            note: item.note
                        }
                        _this.treeObj.addNodes(nodeParent[0], -1, obj);
                    }
                }).always(function (e) {
                });
            }
        },

        initElement: function () {
            var _this = this;

            var len = AppConfig.projectList.length;
            var item;
            if (!(_this.m_parent.arrColor instanceof Array))return;
            var nColorSize = _this.m_parent.arrColor.length;
            for (var i = 0; i < len; i++) {
                item = AppConfig.projectList[i];
                _this.m_arrProjIdColorMap[item.id] = _this.m_parent.arrColor[i - parseInt(i / nColorSize) * nColorSize];
            }

            EventAdapter.on($('#data_source_add'), 'click', function (e) {
                //$('#data_source_add').click(function (e) {
                if (0 == _this.m_selectGroupId) {
                    alert(_this.m_lang.NO_SELECT_GROUP);
                    return;
                }
                if (undefined != _this.m_cfgPanel) {
                    _this.m_cfgPanel.close();
                }
                WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                    _this.m_cfgPanel = new DataSourceConfigure(_this, 0, true, '', '', '', -1);
                    _this.m_cfgPanel.show();
                }).error(function (result) {
                }).always(function (e) {
                });
            });

            EventAdapter.on($('#data_source_formula_add'), 'click', function (e) {
                //$('#data_source_formula_add').click(function (e) {
                if (0 == _this.m_selectGroupId) {
                    alert(_this.m_lang.NO_SELECT_GROUP);
                    return;
                }
                if (undefined != _this.m_cfgPanel) {
                    _this.m_cfgPanel.close();
                }
                WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                    _this.m_cfgPanel = new DataSourceConfigure(_this, 1, true, '', '', '', -1);
                    _this.m_cfgPanel.show();
                }).error(function (result) {
                }).always(function (e) {
                });
            });

            EventAdapter.on($('#divAnlsDatasourcePane'), 'click', function (e) {
                //$('#divAnlsDatasourcePane').click(function (e) {
                _this.clearSelect();
            }, false);

            $('#inputDsSearch').keyup(function (e) {
                var searchVal = $(e.currentTarget).val();
                if (13 == e.keyCode) {  // for show search ds
                    $('#dataSrcPanel').empty();
                    searchVal = searchVal.toLowerCase();
                    _this.insertTreeAllGroupItem(_this.m_allGroupList, _this.m_allPointList, searchVal);
                    $('#dataSrcAddGroup').hide();
                }
                if ('' == searchVal) {
                    $('#dataSrcPanel').empty();
                    _this.insertTreeAllGroupItem(_this.m_allGroupList, _this.m_allPointList, '');
                    _this.colapseGroupsDefault();
                    $('#dataSrcAddGroup').show();
                }
            });
        },

        insertIntoDataList: function (customName, ptName, ptDesc, prjName, iconColor, itemId, baseNode, bIsAppend, bIsSelected) {   // useless now
            var _this = this;

            var div;
            if (bIsSelected) {
                div = $('<div draggable="true" class="dsItem grow dsSelected" style="height:34px"></div>');
            }
            else {
                div = $('<div draggable="true" class="dsItem grow" style="height:34px"></div>');
            }
            div.attr('id', itemId);
            div.click(function (e) {
                _this.clearSelect();

                var target = $(e.currentTarget);
                if ('dsItem grow' == target.attr('class')) {
                    target.attr('class', 'dsItem grow dsSelected');
                } else {
                    target.attr('class', 'dsItem grow');
                }

                _this.stopBubble(e);
            });

            var icon = $('<div class="dsMark"></div>');
            icon.css('background-color', iconColor);
            div.append(icon);

            var custName = $('<div class="dsValue" style="height:36px;">' + customName + '</div>');
            div.append(custName);

            var btnRename = $('<span class="dsBtnRename grow glyphicon glyphicon-wrench"></span>');
            btnRename.click(function (e) {
                if (undefined != _this.m_cfgPanel) {
                    _this.m_cfgPanel.close();
                }

                _this.m_selectItemId = $(e.currentTarget).closest('.dsItem').get(0).id;
                var customName, ptDesc, ptName, item, prjId;
                for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                    item = _this.m_allPointList[i];
                    if (itemId === item.itemId) {
                        customName = item.customName;
                        ptName = item.ptName;
                        ptDesc = item.ptDesc;
                        prjId = item.prjId;
                        break;
                    }
                }
                WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                    _this.m_cfgPanel = new DataSourceConfigure(_this, 0, false, customName, ptName, ptDesc, prjId);
                    _this.m_cfgPanel.show();
                }).fail(function (result) {
                }).always(function (e) {
                });

                /*
                 var show = $(e.currentTarget).prevAll('.dsValue');
                 show.css('display', 'none');

                 var target = $(e.currentTarget).nextAll('.dsDivChange');
                 target.attr('class', 'dsDivChange show');
                 div.css('height', '280px');
                 div.css('width', '100%');

                 var item;
                 var strName = '';
                 var strDesc = '';
                 for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                 item = _this.m_allPointList[i];
                 if (itemId == item.itemId) {
                 strName = item.customName;
                 strDesc = item.ptDesc;
                 break;
                 }
                 }
                 var temp = target.find('input');
                 if (temp.length == 4) {
                 $(temp[0]).val(strName);
                 $(temp[1]).val(strDesc);
                 }

                 _this.stopBubble(e);
                 */
            }).error(function (e) {
            });
            div.append(btnRename);

            var btnRemove = $('<span class="dsBtnRemove grow glyphicon glyphicon-remove-sign"></span>');
            btnRemove.click(function (e) {
                //TODO 测试confirm
                confirm(_this.m_lang.REMOVE_CONFIRM_TIPS, function () {
                    var div = $(e.currentTarget).closest('.dsItem');
                    var dataSrcItemId = div.attr('id');

                    WebAPI.get('/analysis/datasource/removeSingle/' + dataSrcItemId).done(function (data) {
                        if (Boolean(data.success)) {
                            var len = _this.m_allPointList.length;
                            for (var i = 0; i < len; i++) {
                                if (dataSrcItemId == _this.m_allPointList[i].itemId) {
                                    _this.m_allPointList.splice(i, 1);
                                    break;
                                }
                            }
                            _this.calUpdateDataSources();

                            div.tooltip('destroy');
                            div.remove();

                            // delete workspace
                            var arr = data.deleteModal;
                            var len = arr.length;
                            if (len > 0) {
                                var delMod;
                                var arrDelTitle = [];
                                for (var i = 0; i < len; i++) {
                                    delMod = $('#' + arr[i]);
                                    arrDelTitle.push(delMod.find('.newDivPageTitle').val());
                                    delMod.remove();
                                }

                                var delTitle = _this.m_lang.WORKSPACE + ':';
                                for (var i = 0, len = arrDelTitle.length; i < len; i++) {
                                    delTitle += arrDelTitle[i] + ' ';
                                }
                                delTitle += _this.m_lang.REMOVE_RESULT;
                                alert(delTitle);
                            }
                        }
                    });
                });
            });
            div.append(btnRemove);

            //
            var divChange = $('<div class="dsDivChange"></div>');

            var ctlPrjName = $('<div class="form-group"><label style="color:#eee">' + _this.m_lang.PROJECT_NAME + ': ' + prjName + '</label></div>');
            ctlPrjName.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(ctlPrjName);

            var ctlPtName = $('<div class="form-group"><label style="color:#eee">' + _this.m_lang.POINT_NAME + ': ' + ptName + '</label></div>');
            ctlPtName.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(ctlPtName);

            var inputCustName = $('<div class="form-group"><label style="color:#eee">Custom Name</label><input type="text" class="form-control" value="" placeholder="Custom Name"></input></div>');
            inputCustName.find('label').text(_this.m_lang.CUSTOM_NAME);
            var ctlInput = inputCustName.find('input');
            ctlInput.attr('value', customName);
            ctlInput.attr('placeholder', _this.m_lang.CUSTOM_NAME);
            inputCustName.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(inputCustName);

            var inputDesc = $('<div class="form-group"><label style="color:#eee">Description</label><input type="text" class="form-control" value="" placeholder="Description"></input></div>');
            inputDesc.find('label').text(_this.m_lang.POINT_DESC);
            ctlInput = inputDesc.find('input');
            ctlInput.attr('value', ptDesc);
            ctlInput.attr('placeholder', _this.m_lang.POINT_DESC);
            inputDesc.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(inputDesc);

            var btnOk = $('<button class="btn btn-default btn-sm" style="position:absolute; right:70px;">OK</button>');
            btnOk.text(_this.m_lang.SURE);
            btnOk.click(function (e) {
                var temp = $(e.currentTarget).closest('.dsDivChange').find('input');
                var strName = $(temp[0]).val();
                var strDesc = $(temp[1]).val();
                var prjId, ptName, item;

                for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                    item = _this.m_allPointList[i];
                    if (itemId == item.itemId) {
                        prjId = item.prjId;
                        ptName = item.ptName;
                        break;
                    }
                }

                var postData = {
                    itemList: [{
                        id: itemId,
                        type: 0,
                        projId: prjId,
                        alias: strName,
                        note: strDesc,
                        value: ptName,
                        groupId: ''
                    }]
                };

                WebAPI.post('/analysis/datasource/saveMulti', postData).done(function (data) {
                    var id = (data.itemIdList)[0].id;

                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        if (id == _this.m_allPointList[i].itemId) {
                            _this.m_allPointList[i].customName = strName;
                            _this.m_allPointList[i].ptDesc = strDesc;
                            break;
                        }
                    }
                    _this.setToolTipsCustomName(div, strName);
                    _this.setToolTipsDesc(div, strDesc);
                    _this.calUpdateDataSources();
                    $('#' + id).find('.dsValue').text(strName);
                }).error(function (e) {
                });

            });
            divChange.append(btnOk);

            var btnCancel = $('<button class="btn btn-default btn-sm" style="position:absolute; right:15px;">Cancel</button>');
            btnCancel.text(_this.m_lang.CANCEL);
            btnCancel.click(function (e) {
            });
            divChange.append(btnCancel);

            div.append(divChange);


            if (bIsAppend) {
                baseNode.append(div);
            }
            else {
                baseNode.after(div);
            }
        },
        initToolTips: function (parent, customName, projectName, pointName, pointDesc) {
            var _this = this;

            var show = new StringBuilder();
            show.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:300px;">');
            show.append('    <div class="tooltipTitle tooltip-inner">GeneralRegressor</div>');
            show.append('    <div class="tooltipContent">');
            show.append('        <p class="customName tipStyle"><span class="tipTitleStyle">').append(_this.m_lang.CUSTOM_NAME).append('</span>: ').append(customName).append('</p>');
            show.append('        <p class="projectName tipStyle"><span class="tipTitleStyle">').append(_this.m_lang.PROJECT_NAME).append('</span>: ').append(projectName).append('</p> ');
            show.append('        <p class="pointName tipStyle"><span class="tipTitleStyle">').append(_this.m_lang.POINT_NAME).append('</span>: ').append(pointName).append('</p> ');
            show.append('        <p class="pointDesc tipStyle"><span class="tipTitleStyle">').append(_this.m_lang.POINT_DESC).append('</span>: ').append(pointDesc).append('</p> ');
            show.append('    </div>');
            show.append('    <div class="tooltip-arrow"></div>');
            show.append('</div>');
            var options = {
                placement: 'left',
                title: _this.m_lang.PARAM,
                template: show.toString(),
                trigger: 'hover'
            };
            parent.tooltip(options);
        },

        setToolTipsAll: function (row, userName, customName, projectName, pointName, pointDesc) {
            var tip = row.data('bs.tooltip').$tip;
            userName = ': ' + userName;
            customName = ': ' + customName;
            projectName = ': ' + projectName;
            pointName = ': ' + pointName;
            pointDesc = ': ' + pointDesc;
            tip.find('.userName').text(this.m_lang.USER_NAME + userName);
            tip.find('.customName').text(this.m_lang.CUSTOM_NAME + customName);
            tip.find('.projectName').text(this.m_lang.PROJECT_NAME + projectName);
            tip.find('.pointName').text(this.m_lang.POINT_NAME + pointName);
            tip.find('.pointDesc').text(this.m_lang.POINT_DESC + pointDesc);
        },

        setToolTipsCustomName: function (row, customName) {
            var tip = row.data('bs.tooltip').$tip;
            tip.find('.customName').text(this.m_lang.CUSTOM_NAME + ': ' + customName);
        },

        setToolTipsDesc: function (row, ptDesc) {
            var tip = row.data('bs.tooltip').$tip;
            tip.find('.pointDesc').text(this.m_lang.POINT_DESC + ': ' + ptDesc);
        },

        renderTabel: function () {
            var _this = this;

            var len = _this.m_newPointList.length;
            if (len <= 0) {
                return;
            }

            /*
             // check to delete repeat new items
             for (var i = 0, lenAll = _this.m_allPointList.length; i < lenAll; i++) {
             var allItem = _this.m_allPointList[i];
             if (allItem.ptName == '') {
             continue;
             }

             for (var j = 0, lenNew = _this.m_newPointList.length; j < lenNew; j++) {
             var newItem = _this.m_newPointList[j];
             if (newItem.ptName == '') {
             continue;
             }

             if (allItem.ptName == newItem.ptName) {
             if (allItem.prjId == newItem.prjId) {
             _this.m_newPointList.splice(j, 1);

             var showAlert = new Alert($('#showErr'), Alert.type.warning, _this.m_lang.FILTER_REPEAT_ITEM);
             showAlert.show(2000);
             break;
             }
             else {
             newItem.customName = newItem.ptName + '_' + newItem.prjName;
             }
             }
             }
             }*/

            var div = $('#dataSrcPanel');
            var rowBaseNum = div.find('.dsItem').length;
            var rowCount;
            var item;
            var eachItem;
            var postData;

            len = _this.m_newPointList.length;
            if (len > 0) {
                postData = {
                    itemList: []
                };

                var arrOld = [];
                var bIsExist = false;
                var parentId = _this.m_newPointList[0].groupId;
                var parentNodes = _this.treeObj.getNodesByParam('id', parentId, null);
                if (parentNodes.length > 0) {
                    arrOld = parentNodes[0].children;
                }

                for (var i = 0; i < len; i++) {
                    item = _this.m_newPointList[i];
                    eachItem = {
                        type: 0,
                        projId: item.prjId,
                        alias: item.customName,
                        note: item.ptDesc,
                        value: item.ptName,
                        groupId: item.groupId
                    }
                    var bFlag = false;
                    for (var j = 0; j < arrOld.length; j++) {
                        if (item.prjId == arrOld[j].projId && item.ptName == arrOld[j].value) {
                            bIsExist = true;
                            bFlag = true;
                            break;
                        }
                    }
                    if (!bFlag) {
                        postData.itemList.push(eachItem);
                    }
                }
                if (bIsExist) {
                    alert(I18n.resource.dataSource.ALREADY_EXIST);
                }

                var projName = _this.m_newPointList[0].prjName;
                var iconColor = _this.m_newPointList[0].iconColor;
                if (postData.itemList.length > 0) {
                    WebAPI.post('/analysis/datasource/saveMulti', postData).done(function (data) {
                        if (data.datasourceId) {
                            _this.m_dataSourceId = data.datasourceId;
                        }

                        var list = data.itemIdList;
                        var nAddlen = postData.itemList.length;
                        for (var i = 0; i < nAddlen; i++) {
                            if (postData.itemList[i].alias == list[i].alias) {
                                postData.itemList[i].itemId = list[i].id;
                            }
                        }

                        // insert into dataSource panel
                        if (_this.treeObj) {
                            var parentId = _this.m_newPointList[0].groupId;
                            var parentNodes = _this.treeObj.getNodesByParam('id', parentId, null);
                            if (parentNodes.length > 0) {
                                if (parentNodes[0].zAsync) {    // has async load
                                    var arrNodes = [];
                                    for (var i = 0; i < postData.itemList.length; i++) {
                                        var item = postData.itemList[i];
                                        var itemNode = item.note ? item.note : '';
                                        var itemAlias = item.alias ? item.alias : '';
                                        var itemName = itemAlias;
                                        if (itemNode !== '' && itemAlias !== '') {
                                            if (itemAlias.indexOf(itemNode) < 0) {
                                                itemName = itemNode + ' (' + itemAlias + ')'
                                            }
                                        }
                                        arrNodes.push({
                                            id: item.itemId,
                                            pId: item.groupId,
                                            isParent: false,
                                            name: itemName,
                                            value: item.value,
                                            projId: item.projId,
                                            note: item.note,
                                            type: 0,
                                            iconSkin: 'ptNormal'
                                        });
                                    }
                                    _this.treeObj.addNodes(parentNodes[0], arrNodes);
                                }
                                else {  // no async load
                                    _this.treeObj.expandNode(parentNodes[0], true, false, true);
                                }

                                // modify num flag
                                var arrGroup = _this.m_parent.store.group;
                                for (var i = 0; i < arrGroup.length; i++) {
                                    if (arrGroup[i].id == parentId) {
                                        arrGroup[i].num += nAddlen;
                                        var $nodeParent = $("li[ptid='" + parentId + "']");
                                        if ($nodeParent && $nodeParent.length > 0) {
                                            var $spanBadge = $nodeParent.find('.treeBadge')
                                            if ($spanBadge && $spanBadge.length > 0) {
                                                $spanBadge.text(arrGroup[i].num.toString());
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }

                        //var divInsert = $('#' + _this.m_selectGroupId);
                        //if (undefined != divInsert) {
                        //    for (var i = 0; i < len; i++) {
                        //        _this.insertTreeItem(divInsert, list[i].id, iconColor, list[i].alias, 0, '', true);
                        //        _this.initToolTips($('#'+list[i].id), list[i].alias, projName, list[i].value, list[i].note);
                        //    }
                        //}

                        /*
                         len = _this.m_newPointList.length;
                         var prjName;
                         for (var i = 0; i < len; i++) {
                         rowCount = rowBaseNum + i;
                         item = _this.m_newPointList[i];
                         prjName = _this.getProjectNameFromId(item.prjId);
                         _this.insertIntoDataList(item.customName, item.ptName, item.ptDesc, prjName, _this.m_arrProjIdColorMap[item.prjId], item.itemId, div, true, false);
                         _this.initToolTips(div.find('.dsItem').last(), item.ptName, prjName, item.ptName, item.ptDesc);
                         }
                         */

                        _this.m_allPointList = _this.m_allPointList.concat(_this.m_newPointList);
                        _this.calUpdateDataSources();
                    }).error(function () {
                    }).always(function () {
                    });
                }
            }
        },

        modifyTable: function () {
            var _this = this;
            var item;
            var eachItem;
            var postData;
            var len = _this.m_newPointList.length;
            if (len > 0) {
                postData = {
                    itemList: []
                };

                item = _this.m_newPointList[0];
                eachItem = {
                    id: item.itemId,
                    type: 0,
                    projId: item.prjId,
                    alias: item.customName,
                    note: item.ptDesc,
                    value: item.ptName,
                    groupId: item.groupId
                }
                postData.itemList.push(eachItem);

                WebAPI.post('/analysis/datasource/saveMulti', postData).done(function (data) {
                    if (data.datasourceId) {
                        _this.m_dataSourceId = data.datasourceId;
                    }

                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        if (item.itemId === _this.m_allPointList[i].itemId) {
                            _this.m_allPointList[i].prjId = item.prjId;
                            _this.m_allPointList[i].prjName = _this.m_newPointList[0].prjName;
                            _this.m_allPointList[i].customName = item.customName;
                            _this.m_allPointList[i].ptName = item.ptName;
                            _this.m_allPointList[i].ptDesc = item.ptDesc;
                            break;
                        }
                    }

                    // change item display
                    var divItem = $('#' + item.itemId);
                    divItem.find('.showName').text(item.customName);

                    // change tips
                    _this.setToolTipsAll(divItem, item.userName, item.customName, item.prjName, item.ptName, item.ptDesc);

                    _this.calUpdateDataSources();

                    Beop.cache.ds.remove(item.itemId);
                }).error(function () {
                }).always(function () {

                });
            }
        },

        initDrag: function () {
            var _this = this;
            _this.dragOperateSrc($('#dataSrcPanel').get(0));
            _this.dragOperateCfg($('.springConfigMask').parent().get(0));
        },

        dragOperateSrc: function (tableList) {
            if (undefined == tableList) {
                return;
            }

            var _this = this;
            EventAdapter.on($(tableList), 'dragstart',
                function (e) {
                    var tar = $(e.target);
                    var className = tar.attr('class');
                    if (!className) {
                        e.preventDefault();
                        return;
                    }
                    if (tar.children('input').length > 0) {
                        e.preventDefault();
                    }

                    if (-1 != className.indexOf('nav nav-list tree-group')) {
                        var dragSrcId = tar.attr('id');
                        EventAdapter.setData({'dsGroupId': dragSrcId});
                        //e.dataTransfer.setData('dsGroupId', dragSrcId);
                    }
                    else if (-1 != className.indexOf('treeRow ui-draggable')) {
                        var dragSrcId = tar.attr('id');
                        EventAdapter.setData({'dsItemId': dragSrcId});
                        //e.dataTransfer.setData('dsItemId', dragSrcId);
                    }
                    else {
                        return;
                    }
                    $('.templatePara').css('display', 'block');
                }
            );

            EventAdapter.on($(tableList), 'dragover',
                function (e) {
                    e.preventDefault();
                }
            );

            EventAdapter.on($(tableList), 'drop',
                function (e) {
                    var tarItem = $(e.target);
                    var tarId = 0;
                    var dstGroupId = 0;
                    var srcGroupId = 0;
                    var rowClass = tarItem.attr('class');
                    if (!rowClass) {
                        return;
                    }
                    var dragType = -1;   // （==0：组->组）；（==1：点->点）；（==2：点->组）
                    var draggedID = 0;
                    if (-1 != rowClass.indexOf('nav nav-list tree-group') || -1 != rowClass.indexOf('dsTreeHeader')) {
                        tarId = tarItem.closest('.nav').attr('id');
                        draggedID = EventAdapter.getData().dsGroupId;
                        //draggedID = e.dataTransfer.getData('dsGroupId');
                        if (Boolean(draggedID)) {
                            dragType = 0;
                        }
                        else {
                            draggedID = EventAdapter.getData().dsItemId;
                            //draggedID = e.dataTransfer.getData('dsItemId');
                            if (Boolean(draggedID)) {
                                dragType = 2;
                                tarId = tarItem.closest('.nav').attr('id');
                                dstGroupId = tarId;
                                srcGroupId = $('#' + draggedID).closest('.nav').attr('id');
                            }
                        }
                    }
                    else if (-1 != rowClass.indexOf('showName') || -1 != rowClass.indexOf('treeRow ui-draggable')) {
                        dragType = 1;
                        draggedID = EventAdapter.getData().dsItemId;
                        //draggedID = e.dataTransfer.getData('dsItemId');
                        tarId = tarItem.closest('.treeRow').attr('id');
                        dstGroupId = tarItem.closest('.nav').attr('id');
                        srcGroupId = $('#' + draggedID).closest('.nav').attr('id');
                    }
                    else {
                        return;
                    }
                    if (draggedID == tarId || !draggedID) {
                        return;
                    }

                    if (0 === dragType) {
                        // drag group
                        var item, groupName;
                        for (var i = 0, len = _this.m_allGroupList.length; i < len; i++) {
                            item = _this.m_allGroupList[i];
                            if (draggedID == item.id) {
                                groupName = item.name;
                                break;
                            }
                        }
                        $('#' + draggedID).remove();
                        _this.insertTreeGroup(draggedID, groupName, 1, $('#' + tarId));

                        for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                            item = _this.m_allPointList[i];
                            if (draggedID == item.groupId) {
                                if (item.itemType == 0) {
                                    _this.insertTreeItem($('#' + draggedID), item.itemId, item.iconColor, item.customName, 0, '', true);
                                } else {
                                    _this.insertTreeItem($('#' + draggedID), item.itemId, item.iconColor, item.customName, 0, '', false);
                                }

                                var prjName = _this.getProjectNameFromId(item.prjId, _this.m_langFlag);
                                _this.initToolTips($('#' + item.itemId), item.customName, prjName, item.ptName, item.ptDesc);
                            }
                        }
                        /*
                         var groups = $('#dataSrcPanel .nav');
                         var arrTemp = [];
                         $.each(groups, function(i, n){
                         var id = n.id;
                         if ('' != id) {
                         if ('groupEmpty' == id) {
                         id = '';
                         }
                         arrTemp.push(id);
                         }
                         });
                         var postData = {
                         'groupIdList':arrTemp
                         };
                         */
                        var dstGroup, srcGroup;
                        var arrDst = [], arrSrc = [];
                        dstGroup = $('#' + tarId).find('.rows').find('.treeRow');
                        srcGroup = $('#' + draggedID).find('.rows').find('.treeRow');
                        $.each(dstGroup, function (i, n) {
                            arrDst.push(n.id);
                        });
                        $.each(srcGroup, function (i, n) {
                            arrSrc.push(n.id);
                        });
                        var postData = {};
                        postData[tarId] = arrDst;
                        postData[draggedID] = arrSrc;
                        WebAPI.post('/datasource/saveDataSourceGroupLayout/' + AppConfig.userId, postData).done(function (data) {
                            if ('successful' == data.error) {
                                // success
                            }
                        }).error(function () {
                        }).always(function () {
                        });
                    }
                    else if (1 === dragType || 2 === dragType) {
                        // drag item
                        var itemType = 0;
                        var iconColor = '';
                        var custName = '';
                        var projId = 0;
                        var pointName = '';
                        var pointDesc = '';
                        for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                            if (draggedID == _this.m_allPointList[i].itemId) {
                                _this.m_allPointList[i].groupId = dstGroupId;
                                itemType = _this.m_allPointList[i].itemType;
                                iconColor = _this.m_allPointList[i].iconColor;
                                custName = _this.m_allPointList[i].customName;
                                projId = _this.m_allPointList[i].prjId;
                                pointName = _this.m_allPointList[i].ptName;
                                pointDesc = _this.m_allPointList[i].ptDesc;
                                break;
                            }
                        }

                        var selItem = $('#' + draggedID);
                        selItem.tooltip('destroy');
                        selItem.remove();
                        if (itemType == 0) {
                            _this.insertTreeItem($('#' + dstGroupId), draggedID, iconColor, custName, dragType, $('#' + tarId), true);
                        } else {
                            _this.insertTreeItem($('#' + dstGroupId), draggedID, iconColor, custName, dragType, $('#' + tarId), false);
                        }

                        if (0 == itemType) {
                            var prjName = _this.getProjectNameFromId(projId, _this.m_langFlag);
                            _this.initToolTips($('#' + draggedID), custName, prjName, showName, pointDesc);
                        }
                        else if (1 == itemType) {
                            var showName = _this.getShowNameFromFormula(pointName);
                            _this.initFormulaToolTips($('#' + draggedID), custName, showName, pointDesc);
                        }
                        else {
                            // error
                            return;
                        }
                        /*
                         var lyItem = $('#dataSrcPanel .treeRow');
                         var arrTemp = [];
                         $.each(lyItem, function(i, n) {
                         var id = n.id;
                         if ('' != id) {
                         arrTemp.push(id);
                         }
                         });
                         var postData = {
                         datasourceId: _this.m_dataSourceId,
                         list: arrTemp
                         };
                         */
                        var postData = {};
                        if (dstGroupId == srcGroupId) {
                            var srcGroup, arrSrc = [];
                            srcGroup = $('#' + srcGroupId).find('.rows').find('.treeRow');
                            $.each(srcGroup, function (i, n) {
                                arrSrc.push(n.id);
                            });
                            postData[srcGroupId] = arrSrc;
                        }
                        else {
                            var dstGroup, srcGroup;
                            var arrDst = [], arrSrc = [];
                            dstGroup = $('#' + dstGroupId).find('.rows').find('.treeRow');
                            srcGroup = $('#' + srcGroupId).find('.rows').find('.treeRow');
                            $.each(dstGroup, function (i, n) {
                                arrDst.push(n.id);
                            });
                            $.each(srcGroup, function (i, n) {
                                arrSrc.push(n.id);
                            });

                            var dstGroupCnt = 0, srcGroupCnt = 0;
                            var groups = $('#dataSrcPanel .nav');
                            $.each(groups, function (i, n) {
                                if (n.id == dstGroupId) {
                                    dstGroupCnt = i;
                                }
                                if (n.id == srcGroupId) {
                                    srcGroupCnt = i;
                                }
                            });
                            if (dstGroupCnt < srcGroupCnt) {  // 从下往上拖
                                postData[dstGroupId] = arrDst;
                                postData[srcGroupId] = arrSrc;
                            }
                            else {  // 从上往下拖
                                postData[dstGroupId] = arrDst;
                                postData[srcGroupId] = arrSrc;
                            }
                        }

                        WebAPI.post('/analysis/datasource/saveLayout/' + AppConfig.userId, postData).done(function (data) {
                            if (data.success) {

                            }
                        }).error(function () {
                        }).always(function () {
                        });
                    }
                });
        },

        dragOperateCfg: function (divItem) {
            if (undefined == divItem) {
                return;
            }

            var _this = this;
            EventAdapter.on($(divItem), 'dragstart',
                function (e) {
                    var target = $(e.target);
                    var className = target.attr('class');
                    if ('dsItem grow' != className && 'dsItem grow dsSelected' != className) {
                        return;
                    }
                    var dragSrcId = target.attr('id');
                    EventAdapter.setData({'dsItemId': dragSrcId});
                    //e.dataTransfer.setData('dsItemId', dragSrcId);
                }
            );

            EventAdapter.on($(divItem), 'dragover',
                function (e) {
                    e.preventDefault();
                }
            );

            EventAdapter.on($(divItem), 'drop',
                function (e) {
                    var target = $(e.target);
                }
            );
        },

        saveCurrentRecords: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);

            // delete first
            WebAPI.post('/delete_data_source_records_by_userid', {
                userId: AppConfig.userId
            }).done(function (result) {
                if (result != 0) {
                    Spinner.stop();
                    return;
                }

                // sort second
                var newPtList = [];
                var id;
                var len = _this.m_allPointList.length;
                var newRow;
                var item;
                $('#dataSrcPanel .dsItem').each(function () {
                    id = $(this).attr('id');
                    for (var i = 0; i < len; i++) {
                        item = _this.m_allPointList[i];
                        if (id == item.itemId) {
                            newRow = {
                                'itemId': id,
                                'userId': item.userId,
                                'userName': item.userName,
                                'customName': item.customName,
                                'prjId': item.prjId,
                                'prjName': item.prjName,
                                'ptName': item.ptName,
                                'ptDesc': item.ptDesc,
                                'iconColor': item.iconColor,
                                'itemId': item.itemId
                            }
                            newPtList.push(newRow);
                            break;
                        }
                    }
                });
                _this.m_allPointList = newPtList;

                // insert third
                var row;
                var data = [];
                var len = _this.m_allPointList.length;
                for (var i = 0; i < len; i++) {
                    item = _this.m_allPointList[i];
                    row = {
                        'userId': item.userId,
                        'customName': item.customName,
                        'projectId': item.prjId,
                        'pointName': item.ptName,
                        'pointDesc': item.ptDesc,
                        'iconColor': item.iconColor
                    }
                    data.push(row);
                }

                WebAPI.post('/save_data_source_record', {
                    sourceList: data
                }).done(function (result) {
                    if (0 == result) {
                        // success
                    }
                }).error(function (result) {
                    alert(I18n.resource.observer.widgets.DATABASE_OPERATION_FAILED + '！');
                    return;
                });
            }).error(function (result) {
                alert(I18n.resource.observer.widgets.FAIL_BEFORE_EXECUTING + '！');
                return;
            }).always(function () {
                Spinner.stop();
            });

        },

        loadDataSourceRecord: function () {
            var _this = this;
            //var dataPanel = $('#dataSrcPanel');

            var groupInfo = _this.m_parent.store.group;
            if (!groupInfo) {
                return;
            }

            _this.m_allGroupList = [];
            _this.m_allPointList = [];
            var itemDefault = null;
            for (var m = 0, n = groupInfo.length; m < n; m++) {
                var groupId = groupInfo[m].groupId;
                var groupName = groupInfo[m].groupName;
                var groupIsDefault = (Boolean(groupInfo[m].isDefault)) ? true : false;
                var data = groupInfo[m].datasourceList;
                var groupItem = {'id': groupId, 'name': groupName, 'isDefault': groupIsDefault};
                if (groupIsDefault) {
                    itemDefault = groupItem;
                }
                else {
                    _this.m_allGroupList.push(groupItem);
                }

                if (data) {
                    var len = data.length;
                    var item;
                    for (var i = 0; i < len; i++) {
                        item = {
                            userId: AppConfig.userId,
                            userName: AppConfig.account,
                            customName: data[i].alias,
                            prjId: data[i].projId,
                            prjName: _this.getProjectNameFromId(data[i].projId),
                            ptName: data[i].value,
                            ptDesc: data[i].note,
                            iconColor: _this.m_arrProjIdColorMap[data[i].projId],
                            itemId: data[i].id,
                            itemType: data[i].type,
                            itemValue: data[i].value,
                            groupId: groupId,
                            groupName: groupName
                        }
                        if (item.itemType == 1) {
                            item.iconColor = '#000000';
                        }
                        _this.m_allPointList.push(item);
                    }

                    /*
                     var prjName;
                     for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                     item = _this.m_allPointList[i];
                     if (item.itemType == 0) {
                     prjName = _this.getProjectNameFromId(item.prjId);
                     _this.insertIntoDataList(item.customName, item.ptName, item.ptDesc, prjName, item.iconColor, item.itemId, dataPanel, true, false);
                     _this.initToolTips(dataPanel.find('.dsItem').last(), item.customName, prjName, item.ptName, item.ptDesc);
                     }
                     else if (item.itemType == 1) {
                     _this.insertFormula(item.itemId, item.customName, item.iconColor, item.ptName, item.ptDesc);
                     _this.initFormulaToolTips(dataPanel.find('.dsItem').last(), item.customName, item.ptName, item.ptDesc);
                     }
                     }
                     */
                }
            }
            if (itemDefault) {
                _this.m_allGroupList.push(itemDefault);
            }
            //_this.insertTreeAllGroupItem(_this.m_allGroupList, _this.m_allPointList, '');

            /*            // insert groups and items
             for (var i = 0, len = _this.m_allGroupList.length; i < len; i++) {
             _this.insertTreeGroup(_this.m_allGroupList[i].id, _this.m_allGroupList[i].name, 0, '');
             }
             for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
             var item = _this.m_allPointList[i];
             var bIsPoint = true;
             if (0 == item.itemType) {
             bIsPoint = true;
             }
             else {
             bIsPoint = false;
             }

             var parentGroup = $('#' + item.groupId);
             _this.insertTreeItem(parentGroup, item.itemId, item.iconColor, item.customName, 0, '', bIsPoint);

             if (bIsPoint) {
             var prjName = _this.getProjectNameFromId(item.prjId, _this.m_langFlag);
             _this.initToolTips($('#'+item.itemId), item.customName, prjName, item.ptName, item.ptDesc);
             }
             else {
             var showName = _this.getShowNameFromFormula(item.ptName);
             _this.initFormulaToolTips($('#'+item.itemId), item.customName, showName, item.ptDesc);
             }
             }
             */
            //_this.colapseGroups();
        },

        colapseGroupsDefault: function () {
            // close all groups except unassigned
            var treeAllHead = $('.dsTreeHeader .dsGroupName');
            var item, row;
            for (var i = 0, len = treeAllHead.length; i < len; i++) {
                item = treeAllHead.eq(i);
                row = item.closest('.tree-group').find('.rows');
                if (!row || row.length <= 0) {
                    continue;
                }
                if (item.text() == this.m_unassigned) {
                    row.css('display', 'block');
                }
                else {
                    row.css('display', 'none');
                }
            }
        },

        colapseGroups: function (openGroupId) {
            if (!openGroupId) {
                return;
            }
            var treeAllRow = $('#dataSrcPanel .tree-group');
            var item, row;
            for (var i = 0, len = treeAllRow.length; i < len; i++) {
                item = treeAllRow.eq(i);
                row = item.find('.rows');
                if (!row || row.length <= 0) {
                    continue;
                }
                if (item.attr('id') == openGroupId) {
                    row.css('display', 'block');
                }
                else {
                    row.css('display', 'none');
                }
            }
            sessionStorage.removeItem('dsOpenGroupId');
        },

        getProjectNameFromId: function (id, langFlag) {
            var name;
            var len = AppConfig.projectList.length;
            var item;
            for (var i = 0; i < len; i++) {
                item = AppConfig.projectList[i];
                if (id == item.id) {
                    if (0 == langFlag) {
                        name = item.name_cn;
                    }
                    else {
                        name = item.name_en;
                    }
                    break;
                }
            }

            return name;
        },

        getProjectIdFromName: function (projectName) {
            var id;
            var len = AppConfig.projectList.length;
            var item;
            for (var i = 0; i < len; i++) {
                item = AppConfig.projectList[i];
                if (projectName == item.name_cn) {
                    id = item.id;
                    break;
                }
            }

            return id;
        },

        calUpdateDataSources: function () {
            return;
            var _this = this;
            var updateData = [];
            for (var i = 0, len = _this.m_allGroupList.length; i < len; i++) {
                var groupItem = {
                    'groupId': _this.m_allGroupList[i].id,
                    'groupName': _this.m_allGroupList[i].name,
                    'parentId': '',
                    'datasourceList': ''
                };

                var dsList = [];
                for (var j = 0, len2 = _this.m_allPointList.length; j < len2; j++) {
                    var curItem = _this.m_allPointList[j];
                    if (groupItem.groupId == curItem.groupId) {
                        var pushItem = {
                            'id': curItem.itemId,
                            'type': curItem.itemType,
                            'projId': curItem.prjId,
                            'alias': curItem.customName,
                            'note': curItem.ptDesc,
                            'value': curItem.ptName,
                            'groupId': curItem.groupId
                        };
                        dsList.push(pushItem);
                    }
                }
                groupItem.datasourceList = dsList;

                updateData.push(groupItem);
            }

            this.m_parent.updateDataSources(updateData);
        },

        renderFormula: function (_customName, _formulaVal, _formulaDesc) {
            var _this = this;
            var postData = {
                itemList: []
            };

            var prjId = 0;
            var eachItem = {
                type: 1,
                projId: prjId,
                alias: _customName,
                note: _formulaDesc,
                value: _formulaVal,
                groupId: _this.m_selectGroupId
            }
            postData.itemList.push(eachItem);

            WebAPI.post('/analysis/datasource/saveMulti', postData).done(function (data) {
                if (data.id != '') {
                    _this.m_dataSourceId = data.id;
                }

                var list = data.itemIdList;
                var item;
                var arrNewFormula = [];
                for (var i = 0, len = list.length; i < len; i++) {
                    item = {
                        'itemId': list[i].id,
                        'itemType': 1,
                        'customName': list[i].alias,
                        'itemValue': list[i].value,
                        'ptName': list[i].value,
                        'prjId': prjId,
                        'iconColor': '#000000',
                        'ptDesc': _formulaDesc,
                        'groupId': list[i].groupId
                    };
                    arrNewFormula.push(item);

                    //_this.m_allPointList.push(item);
                    //_this.insertTreeItem($('#'+_this.m_selectGroupId), item.itemId, item.iconColor, item.customName, 0, '', false);
                    //var showName = _this.getShowNameFromFormula(list[i].value);
                    //_this.initFormulaToolTips($('#'+item.itemId), item.customName, showName, _formulaDesc);
                }

                // insert into dataSource panel
                if (_this.treeObj) {
                    var parentId = arrNewFormula[0].groupId;
                    var parentNodes = _this.treeObj.getNodesByParam('id', parentId, null);
                    if (parentNodes.length > 0) {
                        if (parentNodes[0].zAsync) {    // has async load
                            var arrNodes = [];
                            for (var i = 0; i < len; i++) {
                                arrNodes.push({
                                    id: arrNewFormula[i].itemId,
                                    pId: arrNewFormula[i].groupId,
                                    isParent: false,
                                    name: arrNewFormula[i].customName,// alias
                                    value: arrNewFormula[i].itemValue,
                                    projId: arrNewFormula[i].prjId,
                                    note: arrNewFormula[i].ptDesc,
                                    type: 1,
                                    iconSkin: 'ptFormula'
                                });
                            }
                            _this.treeObj.addNodes(parentNodes[0], arrNodes);
                        }
                        else {  // no async load
                            _this.treeObj.expandNode(parentNodes[0], true, false, true);
                        }

                        // modify num flag
                        var arrGroup = _this.m_parent.store.group;
                        for (var i = 0; i < arrGroup.length; i++) {
                            if (arrGroup[i].id == parentId) {
                                arrGroup[i].num += 1;
                                var $nodeParent = $("li[ptid='" + parentId + "']");
                                if ($nodeParent && $nodeParent.length > 0) {
                                    var $spanBadge = $nodeParent.find('.treeBadge')
                                    if ($spanBadge && $spanBadge.length > 0) {
                                        $spanBadge.text(arrGroup[i].num.toString());
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                _this.calUpdateDataSources();
            });
        },

        modifyFormula: function (_customName, _formulaVal, _formulaDesc) {
            var _this = this;
            var postData = {
                itemList: []
            };
            var itemId = _this.m_selectItemId;

            var prjId = Number(AppConfig.projectId);
            var eachItem = {
                id: itemId,
                type: 1,
                projId: prjId,
                alias: _customName,
                note: _formulaDesc,
                value: _formulaVal,
                groupId: _this.m_selectGroupId
            }
            postData.itemList.push(eachItem);

            WebAPI.post('/analysis/datasource/saveMulti', postData).done(function (data) {
                if (data.id != '') {
                    _this.m_dataSourceId = data.id;
                }

                var list = data.itemIdList;
                if (list.length > 0) {
                    var showName = list[0].value;
                    var arr = showName.split('<%');

                    var arrId = [];
                    var arrItem = [];
                    for (var j = 0, len2 = arr.length; j < len2; j++) {
                        var id = arr[j].split('%>')[0];
                        if ('' != id) {
                            arrId.push(id);
                        }
                    }
                    arrItem = _this.getDSItemById(arrId);

                    for (var j = 0, len2 = arr.length; j < len2; j++) {
                        var id = arr[j].split('%>')[0];
                        if ('' == id) {
                            continue;
                        }

                        for (var m = 0; m < arrItem.length; m++) {
                            if (id == arrItem[m].id) {
                                var retVal = arrItem[m];
                                if (null == retVal) {
                                    continue;
                                }
                                showName = showName.replace(id, retVal.value);
                                break;
                            }
                        }
                        //var retVal = _this.getDSItemById(id);
                        //if (null == retVal) {
                        //    continue;
                        //}
                        //showName = showName.replace(id, retVal.value);
                    }
                    showName = showName.replace(/<%/g, '');
                    showName = showName.replace(/%>/g, '');

                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        if (itemId === _this.m_allPointList[i].itemId) {
                            _this.m_allPointList[i].customName = list[0].alias;
                            _this.m_allPointList[i].ptName = list[0].value;
                            _this.m_allPointList[i].ptDesc = list[0].note;
                            break;
                        }
                    }

                    var divFormula = $('#' + itemId);
                    divFormula.find('.showName').text(list[0].alias);
                    _this.setFormulaToolTipsAll(divFormula, list[0].alias, showName, list[0].note);

                    _this.calUpdateDataSources();

                    Beop.cache.ds.remove(itemId);
                }
            });
        },

        insertFormula: function (itemId, customName, iconColor, formula, desc) {    // useless now
            var _this = this;

            var div = $('<div draggable="true" class="dsItem grow" style="height:34px"></div>');
            div.attr('id', itemId);
            div.click(function (e) {
                _this.clearSelect();

                var tar = $(e.currentTarget);
                if ('dsItem grow' == tar.attr('class')) {
                    tar.attr('class', 'dsItem grow dsSelected');
                }
                else {
                    tar.attr('class', 'dsItem grow');
                }

                _this.stopBubble(e);
            });

            var icon = $('<div class="dsMark"></div>');
            icon.css('background-color', iconColor);
            div.append(icon);

            var name = $('<div class="dsValue" style="height:36px"></div>');
            name.text(customName);
            div.append(name);

            var btnRename = $('<span class="dsBtnRename grow glyphicon glyphicon-wrench"></span>');
            btnRename.click(function (e) {
                /*
                 _this.m_selectItemId = $(e.currentTarget).closest('.dsItem').get(0).id;
                 var customName, ptVal, ptDesc, item;
                 for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                 item = _this.m_allPointList[i];
                 if (itemId === item.itemId) {
                 customName = item.customName;
                 ptVal = item.itemValue;
                 ptDesc = item.ptDesc;
                 break;
                 }
                 }
                 WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                 new DataSourceConfigure(_this, 1, false, customName, ptVal, ptDesc).show();
                 }).fail(function (result) {
                 }).always(function (e) {
                 });
                 */

                var show = $(e.currentTarget).prevAll('.dsValue');
                show.css('display', 'none');

                var target = $(e.currentTarget).nextAll('.dsDivChange');
                target.attr('class', 'dsDivChange show');
                div.css('height', '240px');
                div.css('width', '100%');

                var item;
                var strName = '';
                var strFormula = '';
                var strDesc = '';
                for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                    item = _this.m_allPointList[i];
                    if (itemId == item.itemId) {
                        strName = item.customName;
                        strFormula = item.ptName;
                        strDesc = item.ptDesc;
                        break;
                    }
                }
                var temp = target.find('input');
                if (temp.length == 2) {
                    $(temp[0]).val(strName);
                    $(temp[1]).val(strDesc);
                }

                _this.stopBubble(e);

            }).error(function (e) {
            });
            div.append(btnRename);

            var btnRemove = $('<span class="dsBtnRemove grow glyphicon glyphicon-remove-sign"></span>');
            btnRemove.click(function (e) {
                //TODO 测试confirm
                confirm(_this.m_lang.REMOVE_CONFIRM, function () {
                    var div = $(e.currentTarget).closest('.dsItem');
                    var dataSrcItemId = div.attr('id');

                    WebAPI.get('/analysis/datasource/removeSingle/' + dataSrcItemId).done(function (data) {
                        if (Boolean(data.success)) {
                            var len = _this.m_allPointList.length;
                            for (var i = 0; i < len; i++) {
                                if (dataSrcItemId == _this.m_allPointList[i].itemId) {
                                    _this.m_allPointList.splice(i, 1);
                                    break;
                                }
                            }
                            _this.calUpdateDataSources();

                            div.tooltip('destroy');
                            div.remove();
                        }
                    });
                });
            });
            div.append(btnRemove);

            //
            var divChange = $('<div class="dsDivChange"></div>');

            var inputCustName = $('<div class="form-group"><label style="color:#eee">Custom Name</label><input type="text" class="form-control" value="" placeholder="Custom Name"></input></div>');
            inputCustName.find('label').text(_this.m_lang.CUSTOM_NAME);
            var ctlInput = inputCustName.find('input');
            ctlInput.attr('value', customName);
            ctlInput.attr('placeholder', _this.m_lang.CUSTOM_NAME);
            inputCustName.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(inputCustName);

            var ctlFormula = $('<div class="form-group"><label style="color:#eee">' + _this.m_lang.FORMULA_NAME + ': </label></div>');
            var showFormula = $('<span>' + formula + '</span>');
            showFormula.appendTo(ctlFormula.find('label')).mathquill();
            ctlFormula.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(ctlFormula);

            var inputDesc = $('<div class="form-group"><label style="color:#eee">Description</label><input type="text" class="form-control" value="" placeholder="Description"></input></div>');
            inputDesc.find('label').text(_this.m_lang.POINT_DESC);
            ctlInput = inputDesc.find('input');
            ctlInput.attr('value', desc);
            ctlInput.attr('placeholder', _this.m_lang.POINT_DESC);
            inputDesc.click(function (e) {
                _this.stopBubble(e);
            });
            divChange.append(inputDesc);

            var btnOk = $('<button class="btn btn-default btn-sm" style="position:absolute; right:70px;">OK</button>');
            btnOk.text(_this.m_lang.SURE);
            btnOk.click(function (e) {
                var temp = $(e.currentTarget).closest('.dsDivChange').find('input');
                var strName = $(temp[0]).val();
                var strDesc = $(temp[1]).val();
                var prjId, ptName, item;

                for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                    item = _this.m_allPointList[i];
                    if (itemId == item.itemId) {
                        prjId = item.prjId;
                        ptName = item.ptName;
                        break;
                    }
                }

                var postData = {
                    itemList: [{
                        id: itemId,
                        type: 1,
                        projId: prjId,
                        alias: strName,
                        note: strDesc,
                        value: ptName,
                        groupId: ''
                    }]
                };

                WebAPI.post('/analysis/datasource/saveMulti', postData).done(function (data) {
                    if (0 == data.itemIdList.length) {
                        return;
                    }

                    var id = (data.itemIdList)[0].id;
                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        if (id == _this.m_allPointList[i].itemId) {
                            _this.m_allPointList[i].customName = strName;
                            _this.m_allPointList[i].ptDesc = strDesc;
                            break;
                        }
                    }
                    _this.setToolTipsCustomName(div, strName);
                    _this.setToolTipsDesc(div, strDesc);
                    _this.calUpdateDataSources();
                    $('#' + id).find('.dsValue').text(strName);
                }).error(function (e) {
                });

            });
            divChange.append(btnOk);

            var btnCancel = $('<button class="btn btn-default btn-sm" style="position:absolute; right:15px;">Cancel</button>');
            btnCancel.text(_this.m_lang.CANCEL);
            btnCancel.click(function (e) {
            });
            divChange.append(btnCancel);

            div.append(divChange);


            $('#dataSrcPanel').append(div);
        },

        initFormulaToolTips: function (parent, customName, formula, desc) {
            var _this = this;

            var show = new StringBuilder();
            show.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:400px;">');
            show.append('    <div class="tooltipTitle tooltip-inner">GeneralRegressor</div>');
            show.append('    <div class="tooltipContent">');
            show.append('        <p class="customName tipStyle"><span class="tipTitleStyle">').append(_this.m_lang.CUSTOM_NAME).append('</span>: ').append(customName).append('</p>');
            show.append('        <p class="formula tipStyle" style="word-break:normal;"><span class="tipTitleStyle">').append(_this.m_lang.FORMULA_NAME).append('</span>: ').append('</p>');
            show.append('        <p class="pointDesc tipStyle"><span class="tipTitleStyle">').append(_this.m_lang.POINT_DESC).append('</span>: ').append(desc).append('</p>');
            show.append('    </div>');
            show.append('    <div class="tooltip-arrow"></div>');
            show.append('</div>');

            var showFormula = $('<span>' + formula + '</span>');
            var showObj = $(show.toString());
            showFormula.appendTo(showObj.find('.formula')).mathquill();

            var options = {
                placement: 'left',
                title: _this.m_lang.PARAM,
                template: showObj
            };
            parent.tooltip(options);
        },

        setFormulaToolTipsAll: function (row, customName, formulaVal, formulaDesc) {
            var tip = row.data('bs.tooltip').$tip;
            tip.find('.customName').html('<span style="font-weight:bold">' + this.m_lang.CUSTOM_NAME + '</span>: ' + customName);
            tip.find('.pointDesc').html('<span style="font-weight:bold">' + this.m_lang.POINT_DESC + '</span>: ' + formulaDesc);

            var showFormula = $('<span>' + formulaVal + '</span>');
            var dst = tip.find('.formula').html('<span style="font-weight:bold">' + this.m_lang.FORMULA_NAME + '</span>: ');
            showFormula.appendTo(dst).mathquill();
        },

        checkRepeatWithCustomName: function (_name) {
            var _this = this;
            var bRet = false;

            var grids = $('#dataSrcPanel .dsItem .dsValue');
            $.each(grids, function (i, n) {
                if (_name == $(n).text()) {
                    bRet = true;
                    return false;
                }
            });

            return bRet;
        },

        stopBubble: function (e) {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }
        },

        clearSelect: function (e) {
            var itemList = $('#dataSrcPanel .dsItem');
            itemList.attr('class', 'dsItem grow');
            itemList.css('height', '34px');
            itemList.css('width', '33%');

            var panel = $('#dataSrcPanel');
            panel.find('.dsDivChange').attr('class', 'dsDivChange');
            panel.find('.dsValue').css('display', 'inline');
        },

        insertTreeGroup: function (groupId, groupName, type, baseGroup) {
            // type         插入类型，0：尾部插入；1：插入目标位后（baseGroup）；2：插入目标位前（baseGroup）
            // baseGroup    关联 type == 1，插入前的基准Group，插入位置在其后；== 2，插入前的基准Group，插入位置在其前

            var _this = this;
            var divContain = $('#dataSrcPanel');

            var $ul = $('<ul class="nav nav-list tree-group" id="' + groupId + '" draggable="true">');
            //var $liHd = $('<li class="dsTreeHeader"><img src="/static/images/dataSource/group_head_sel.png" alt="png" class="dsTreeHeaderIcon"></li>');
            var $liHd = $('<li class="dsTreeHeader"><span class="dsTreeHeaderIcon open"></span></li>');
            var spanName = $('<span class="dsGroupName">' + groupName + '</span>');
            $liHd.append(spanName);

            if (groupName != _this.m_unassigned) {
                var btnRemove = $('<span class="glyphicon glyphicon-remove-sign panel-heading-btn grow dsTreeBtnDel" aria-hidden="true"></span>');
                EventAdapter.on(btnRemove, 'click', function (e) {
                    //btnRemove.click(function (e) {
                    var div = $(e.currentTarget).closest('.nav');
                    WebAPI.get('/static/views/observer/widgets/modalFrame.html').done(function (result) {
                        var res = $(result);
                        res.find('#modalFrmBody').text(_this.m_lang.REMOVE_CONFIRM);
                        var btnSure = res.find('#btnSure');
                        btnSure.click(function (e) {
                            if (undefined != _this.m_cfgPanel) {
                                _this.m_cfgPanel.close();
                                _this.m_parent.showAnlsPane();
                            }

                            var groupId = div.attr('id');

                            // remove group animation
                            div.css('position', 'relative');
                            div.css('animation', 'dsRemove 3s infinite');
                            div.css('-moz-animation', 'dsRemove 3s infinite');// Firefox
                            div.css('-webkit-animation', 'dsRemove 3s infinite');// Safari & Chrome
                            div.css('-o-animation', 'dsRemove 3s infinite');// Opera

                            WebAPI.get('/datasource/deleteDataSourceGroup/' + AppConfig.userId + '/' + groupId).done(function (data) {
                                if (('successful' == data.error)) {
                                    var len = _this.m_allGroupList.length;
                                    for (var i = 0; i < len; i++) {
                                        if (groupId == _this.m_allGroupList[i].id) {
                                            _this.m_allGroupList.splice(i, 1);
                                            div.remove();
                                            break;
                                        }
                                    }
                                    _this.calUpdateDataSources();
                                }
                            }).fail(function (e) {
                            });
                        });
                        res.modal('show');
                    }).always(function (e) {
                    });
                }).error(function (e) {
                });
                $liHd.append(btnRemove);
            }

            var btnAddDs = $('<span class="glyphicon glyphicon-plus-sign panel-heading-btn grow dsTreeBtnAdd" aria-hidden="true" id="data_source_add"></span>');
            EventAdapter.on(btnAddDs, 'click', function (e) {
                //btnAddDs.click(function (e) {
                var tar = $(e.currentTarget);
                _this.m_selectGroupId = tar.closest('.tree-group').get(0).id;
                _this.stopBubble(e);

                if (undefined != _this.m_cfgPanel) {
                    _this.m_cfgPanel.close();
                }
                WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                    _this.m_cfgPanel = new DataSourceConfigure(_this, 0, true, '', '', '', -1);
                    _this.m_cfgPanel.show();
                }).error(function (result) {
                }).always(function (e) {
                });
            });
            $liHd.append(btnAddDs);

            var btnAddFormula = $('<span><img src="/static/images/dataSource/formula_add_normal.png" alt="Formula add" class="dsTreeBtnFormula" id="data_source_formula_add" /></span>');
            EventAdapter.on(btnAddFormula, 'click', function (e) {
                //btnAddFormula.click(function (e) {
                var tar = $(e.currentTarget);
                _this.m_selectGroupId = tar.closest('.tree-group').get(0).id;
                _this.stopBubble(e);

                if (undefined != _this.m_cfgPanel) {
                    _this.m_cfgPanel.close();
                }
                WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                    _this.m_cfgPanel = new DataSourceConfigure(_this, 1, true, '', '', '', -1);
                    _this.m_cfgPanel.show();
                }).error(function (result) {
                }).always(function (e) {
                });
            });

            btnAddFormula.mouseenter(function (e) {
                var img = btnAddFormula.find('img');
                img.attr('src', '/static/images/dataSource/formula_add_hover.png');
                img.css('width', '23px');
                img.css('height', '20px');
            }).error(function (e) {
            });
            btnAddFormula.mouseleave(function (e) {
                var img = btnAddFormula.find('img');
                img.attr('src', '/static/images/dataSource/formula_add_normal.png');
                img.css('width', '21px');
                img.css('height', '19px');
            }).error(function (e) {
            });
            $liHd.append(btnAddFormula);

            if (groupName != _this.m_unassigned) {
                var spanEdit = $('<span class="glyphicon glyphicon-pencil panel-heading-btn grow dsEditGroupName" aria-hidden="true"></span>');
                EventAdapter.on(spanEdit, 'click', function (e) {
                    //spanEdit.click(function (e) {
                    var tar = $(e.currentTarget);

                    var groupName = tar.siblings('.dsGroupName');
                    groupName.hide();

                    var input = tar.siblings('.inputEditGroup');
                    input.val(groupName.text());
                    input.show();
                    input.select();

                    tar.siblings('.btn').show();

                    _this.stopBubble(e);
                });
                $liHd.append(spanEdit);

                var inputEdit = $('<input type="text" value="' + groupName + '" class="inputEditGroup">');
                inputEdit.hide();
                EventAdapter.on(inputEdit, 'click', function (e) {
                    //inputEdit.click(function (e) {
                    _this.stopBubble(e);
                });
                inputEdit.keyup(function (e) {
                    if (13 == e.keyCode) {
                        var tar = $(e.currentTarget);
                        tar.siblings('button').click();
                    }
                    _this.stopBubble(e);
                });
                $liHd.append(inputEdit);

                var btnEdit = $('<button class="btn btn-default btn-sm" type="submit">Change</button>');
                btnEdit.hide();
                EventAdapter.on(btnEdit, 'click', function (e) {
                    //btnEdit.click(function (e) {
                    var tar = $(e.currentTarget);
                    tar.hide();

                    var input = tar.siblings('.inputEditGroup');
                    var newName = input.val();
                    input.hide();

                    var groupName = tar.siblings('.dsGroupName');
                    var oldName = groupName.text();
                    groupName.show();

                    if (oldName != newName && '' != newName) {
                        // do db change
                        var postData = {
                            'groupId': groupId,
                            'name': newName,
                            'parent': '',
                            'userId': AppConfig.userId
                        }
                        WebAPI.post('/datasource/saveDataSourceGroup', postData).done(function (data) {
                            if (undefined == data) {
                                return;
                            }
                            if ('successful' == data.error) {
                                for (var i = 0, len = _this.m_allGroupList.length; i < len; i++) {
                                    if (groupId == _this.m_allGroupList[i].id) {
                                        _this.m_allGroupList[i].name = data.groupName;
                                        break;
                                    }
                                }
                                spanName.text(data.groupName);
                            }
                        }).fail(function (e) {
                        });
                    }
                    _this.stopBubble(e);
                });
                $liHd.append(btnEdit);
            }

            EventAdapter.on($liHd, 'click', function (e) {
                //$liHd.click(function (e) {
                divContain.find('.dsTreeBtnCfg').css('display', 'none');
                divContain.find('.dsTreeBtnRemove').css('display', 'none');
                divContain.find('.dsEditGroupName').css('display', 'none');

                var curTarHead = $(e.currentTarget);
                curTarHead.find('.dsTreeBtnRemove').css('display', 'inline');
                _this.m_selectGroupId = curTarHead.closest('.tree-group').get(0).id;

                //var $otherUl = $(this).parent('ul').siblings('ul');
                //$otherUl.find('.rows').slideUp();
                //$otherUl.find('i').removeClass('icon-minus').addClass('icon-plus');
                $(this).next('.rows').slideToggle();
                var icon = $(this).find('.dsTreeHeaderIcon');
                var imgPath = icon.attr('src');
                //if (_this.m_groupIconOpen == imgPath) {
                if (icon.hasClass('open')) {
                    //icon.attr('src', _this.m_groupIconClose);
                    icon.removeClass('open');
                    curTarHead.find('.dsGroupName').css('font-weight', '400');
                    curTarHead.find('.dsTreeBtnFormula').css('display', 'none');
                    curTarHead.find('.dsTreeBtnAdd').css('display', 'none');
                    curTarHead.find('.dsTreeBtnDel').css('display', 'none');
                    curTarHead.find('.dsEditGroupName').css('display', 'none');
                }
                else {
                    //icon.attr('src', _this.m_groupIconOpen);
                    icon.addClass('open');
                    curTarHead.find('.dsGroupName').css('font-weight', '700');
                    curTarHead.find('.dsTreeBtnFormula').css('display', 'inline');
                    curTarHead.find('.dsTreeBtnAdd').css('display', 'inline');
                    curTarHead.find('.dsTreeBtnDel').css('display', 'inline');
                    curTarHead.find('.dsEditGroupName').css('display', 'inline');
                }
                //var $i = $(this).find('i');
                //var toggleClass = (function () {
                //    if ($i.hasClass('icon-minus'))
                //        return 'icon-plus icon-white'
                //    else
                //        return 'icon-minus icon-white'
                //})();
                //$(this).find('i').removeClass().addClass(toggleClass)
            });
            $ul.prepend($liHd);

            var divLiRow = $('<li class="rows"></li>');
            $ul.append(divLiRow);

            if (0 === type) {
                divContain.append($ul);
            }
            else if (1 === type) {
                if ('' != baseGroup) {
                    baseGroup.after($ul);
                }
            }
            else if (2 === type) {
                if ('' != baseGroup) {
                    baseGroup.before($ul);
                }
            }
        },

        insertTreeItem: function (divParentGroup, itemId, iconColor, itemName, insertType, baseItem, bIsPoint) {
            // insertType   0:插入组尾；1：插入目标位后（关联baseItem）；2：插入组头
            // baseItem     关联 insertType == 1，插入前的基准Item，插入位置在其后
            // bIsPoint     true：表示插入是点，false：插入是公式

            var _this = this;
            var div = $('<div class="treeRow ui-draggable" id="' + itemId + '" draggable="true"> ');//html(itemName);

            var icon = $('<div class="dsMark" style="margin-top: -1px"></div>');
            icon.css('background-color', iconColor);
            div.append(icon);

            var divShowName = $('<span class="showName">' + itemName + '</span>');
            EventAdapter.on(divShowName, 'click', function (e) {
                //divShowName.click(function (e) {
                var oldCustName = $(e.currentTarget).text();
                var input = $('<input type="text" value="' + oldCustName + '" style="width:300px;position: absolute;top: 4px">');
                input.blur(function (e) {
                    var newCustName = $(e.currentTarget).val();
                    if (oldCustName != newCustName) {
                        var item, type, prjId, ptName, ptDesc, groupId, postData;
                        for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                            item = _this.m_allPointList[i];
                            if (itemId == item.itemId) {
                                type = item.itemType;
                                prjId = item.prjId;
                                ptName = item.ptName;
                                ptDesc = item.ptDesc;
                                groupId = item.groupId;
                                break;
                            }
                        }

                        postData = {
                            itemList: []
                        };

                        var eachItem = {
                            id: itemId,
                            type: type,
                            projId: prjId,
                            alias: newCustName,
                            note: ptDesc,
                            value: ptName,
                            groupId: groupId
                        }
                        postData.itemList.push(eachItem);

                        WebAPI.post('/analysis/datasource/saveMulti', postData).done(function (data) {
                            if (data.id != '') {
                                _this.m_dataSourceId = data.id;
                            }

                            var list = data.itemIdList;
                            var dstId, dstCustomName;
                            for (var i = 0, len = list.length; i < len; i++) {
                                dstId = list[i].id;
                                dstCustomName = list[i].alias;

                                for (var j = 0, len2 = _this.m_allPointList.length; j < len2; j++) {
                                    if (dstId == _this.m_allPointList[j].itemId) {
                                        _this.m_allPointList[j].customName = dstCustomName;
                                        break;
                                    }
                                }

                                divShowName.text(dstCustomName);
                                _this.setToolTipsCustomName(divShowName.closest('.treeRow'), dstCustomName);
                            }
                            _this.calUpdateDataSources();
                        });
                    }
                    input.remove();
                    divShowName.css('display', 'inline');
                });
                input.keyup(function (e) {
                    if (13 == e.keyCode) {
                        input.blur();
                    }
                    _this.stopBubble(e);
                });
                divShowName.after(input);
                divShowName.css('display', 'none');
                input.select();
            });
            div.append(divShowName);

            var btnRemove = $('<span class="glyphicon glyphicon-remove-sign panel-heading-btn grow dsTreeBtnRemove" aria-hidden="true"></span>');
            EventAdapter.on(btnRemove, 'click', function (e) {
                //btnRemove.click(function (e) {
                var promise = $.Deferred();
                var div = $(e.currentTarget).closest('.treeRow');
                var dataSrcItemId = div.attr('id');
                var dataSrcId = _this.m_dataSourceId;

                if (typeof _this.m_parent.doSync === 'function') {
                    _this.m_parent.doSync().done(function () {
                        promise.resolve();
                    });
                } else {
                    promise.resolve();
                }

                // start promise
                promise.done(function () {
                    WebAPI.get('/analysis/checkDatasourceBeforeDelete/' + dataSrcItemId + '/' + AppConfig.userId).done(function (chkData) {
                        var nWorkSpLen = chkData.workspaceInfo.length;
                        var nDashBoLen = chkData.dashboardInfo.length;
                        if (nWorkSpLen > 0 || nDashBoLen > 0) {
                            var show = _this.m_lang.REMOVE_CONFIRM_TIPS;
                            var name;
                            for (var i = 0; i < nWorkSpLen; i++) {
                                if (0 == i) {
                                    show += 'workspace: ';
                                }
                                name = chkData.workspaceInfo[i].modalName;
                                name = Boolean(name) ? name : 'Untitled';
                                show += name + ',';
                            }
                            for (var j = 0; j < nDashBoLen; j++) {
                                if (0 == j) {
                                    show += 'dashboard: ';
                                }
                                show += chkData.dashboardInfo[j].modalType + ',';
                            }
                            show += _this.m_lang.REMOVE_CONFIRM;

                            WebAPI.get('/static/views/observer/widgets/modalFrame.html').done(function (result) {
                                var res = $(result);
                                res.find('#modalFrmBody').text(show);
                                var btnSure = res.find('#btnSure');
                                btnSure.click(function (e) {
                                    if (undefined != _this.m_cfgPanel) {
                                        _this.m_cfgPanel.close();
                                        _this.m_parent.showAnlsPane();
                                    }

                                    // remove item animation
                                    div.css('position', 'relative');
                                    div.css('animation', 'dsRemove 3s infinite');
                                    div.css('-moz-animation', 'dsRemove 3s infinite');// Firefox
                                    div.css('-webkit-animation', 'dsRemove 3s infinite');// Safari & Chrome
                                    div.css('-o-animation', 'dsRemove 3s infinite');// Opera

                                    WebAPI.get('/analysis/datasource/removeSingle/' + dataSrcItemId).done(function (data) {
                                        if (Boolean(data.success)) {
                                            var len = _this.m_allPointList.length;
                                            for (var i = 0; i < len; i++) {
                                                if (dataSrcItemId == _this.m_allPointList[i].itemId) {
                                                    _this.m_allPointList.splice(i, 1);
                                                    break;
                                                }
                                            }
                                            _this.calUpdateDataSources();

                                            div.tooltip('destroy');
                                            div.remove();

                                            // delete workspace
                                            var arr = chkData.workspaceInfo;
                                            for (var i = 0, len = arr.length; i < len; i++) {
                                                var divWoSp = $('.divPage');
                                                for (var j = 0, len2 = divWoSp.length; j < len2; j++) {
                                                    if (arr[i].modalName == divWoSp.eq(j).find('.modalNameSp').text()) {
                                                        divWoSp.eq(j).remove();
                                                    }
                                                }
                                            }

                                            Beop.cache.ds.remove(dataSrcItemId);
                                        }
                                    }).fail(function (e) {
                                    });
                                });
                                res.modal('show');
                            }).always(function (e) {
                            });
                        }
                        else {
                            if (undefined != _this.m_cfgPanel) {
                                _this.m_cfgPanel.close();
                                _this.m_parent.showAnlsPane();
                            }

                            // remove item animation
                            div.css('position', 'relative');
                            div.css('animation', 'dsRemove 3s infinite');
                            div.css('-moz-animation', 'dsRemove 3s infinite');// Firefox
                            div.css('-webkit-animation', 'dsRemove 3s infinite');// Safari & Chrome
                            div.css('-o-animation', 'dsRemove 3s infinite');// Opera

                            WebAPI.get('/analysis/datasource/removeSingle/' + dataSrcItemId).done(function (data) {
                                if (Boolean(data.success)) {
                                    var len = _this.m_allPointList.length;
                                    for (var i = 0; i < len; i++) {
                                        if (dataSrcItemId == _this.m_allPointList[i].itemId) {
                                            _this.m_allPointList.splice(i, 1);
                                            break;
                                        }
                                    }
                                    _this.calUpdateDataSources();

                                    div.tooltip('destroy');
                                    div.remove();

                                    // delete workspace
                                    var arr = chkData.workspaceInfo;
                                    for (var i = 0, len = arr.length; i < len; i++) {
                                        var divWoSp = $('.divPage');
                                        for (var j = 0, len2 = divWoSp.length; j < len2; j++) {
                                            if (arr[i].modalName == divWoSp.eq(j).find('.modalNameSp').text()) {
                                                divWoSp.eq(j).remove();
                                            }
                                        }
                                    }

                                    Beop.cache.ds.remove(dataSrcItemId);
                                }
                            }).fail(function (e) {
                            });
                        }
                    }).fail(function (e) {
                    });
                });
                // end promise
            }).error(function (e) {
            });
            div.append(btnRemove);

            if (bIsPoint) {
                var btnCfg = $('<img src="/static/images/dataSource/item_edit.png" alt="png" class="dsTreeBtnCfg">');
                EventAdapter.on(btnCfg, 'click', function (e) {
                    //btnCfg.click(function (e) {
                    if (undefined != _this.m_cfgPanel) {
                        _this.m_cfgPanel.close();
                    }
                    var curTar = $(e.currentTarget);
                    _this.m_selectItemId = curTar.closest('.treeRow').get(0).id;
                    _this.m_selectGroupId = curTar.closest('.tree-group').get(0).id;
                    var customName, ptDesc, ptName, item, prjId;
                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        item = _this.m_allPointList[i];
                        if (itemId === item.itemId) {
                            customName = item.customName;
                            ptName = item.ptName;
                            ptDesc = item.ptDesc;
                            prjId = item.prjId;
                            break;
                        }
                    }
                    WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                        _this.m_cfgPanel = new DataSourceConfigure(_this, 0, false, customName, ptName, ptDesc, prjId);
                        _this.m_cfgPanel.show();
                    }).fail(function (result) {
                    }).always(function (e) {
                    });
                }).error(function (e) {
                });

                btnCfg.mouseenter(function (e) {
                    btnCfg.attr('src', '/static/images/dataSource/item_edit_hover.png');
                    btnCfg.css('width', '18px');
                    btnCfg.css('height', '18px');
                }).error(function (e) {
                });
                btnCfg.mouseleave(function (e) {
                    btnCfg.attr('src', '/static/images/dataSource/item_edit.png');
                    btnCfg.css('width', '16px');
                    btnCfg.css('height', '16px');
                }).error(function (e) {
                });

                div.append(btnCfg);
            } else {
                var btnCfg = $('<img src="/static/images/dataSource/item_edit.png" alt="png" class="dsTreeBtnCfg">');
                EventAdapter.on(btnCfg, 'click', function (e) {
                    //btnCfg.click(function (e){
                    if (undefined != _this.m_cfgPanel) {
                        _this.m_cfgPanel.close();
                    }
                    var curTar = $(e.currentTarget);
                    _this.m_selectItemId = curTar.closest('.treeRow').get(0).id;
                    _this.m_selectGroupId = curTar.closest('.tree-group').get(0).id;
                    var customName, ptDesc, ptName, item, prjId;
                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                        item = _this.m_allPointList[i];
                        if (itemId === item.itemId) {
                            customName = item.customName;
                            ptName = item.ptName;
                            ptDesc = item.ptDesc;
                            prjId = item.prjId;
                            break;
                        }
                    }
                    WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                        _this.m_cfgPanel = new DataSourceConfigure(_this, 1, false, customName, ptName, ptDesc, prjId);
                        _this.m_cfgPanel.show();
                    }).fail(function (result) {
                    }).always(function (e) {
                    });
                }).error(function (e) {
                });

                btnCfg.mouseenter(function (e) {
                    btnCfg.attr('src', '/static/images/dataSource/item_edit_hover.png');
                    btnCfg.css('width', '18px');
                    btnCfg.css('height', '18px');
                }).error(function (e) {
                });
                btnCfg.mouseleave(function (e) {
                    btnCfg.attr('src', '/static/images/dataSource/item_edit.png');
                    btnCfg.css('width', '16px');
                    btnCfg.css('height', '16px');
                }).error(function (e) {
                });
                div.append(btnCfg);
            }

            EventAdapter.on(div, 'click', function (e) {
                //div.click(function (e) {
                var divContain = $('#dataSrcPanel');
                //divContain.find('.tree-group').css('border-style', 'none');
                divContain.find('.dsTreeBtnCfg').css('display', 'none');
                divContain.find('.dsTreeBtnRemove').css('display', 'none');

                var curTarItem = $(e.currentTarget);
                //curTarItem.closest('.tree-group').css('border-style', 'solid');
                curTarItem.find('.dsTreeBtnCfg').css('display', 'inline');
                curTarItem.find('.dsTreeBtnRemove').css('display', 'inline');
                _this.m_selectGroupId = curTarItem.closest('.tree-group').get(0).id;
            });

            if (0 === insertType) {
                divParentGroup.find('.rows').append(div);
            }
            else if (1 === insertType) {
                if ('' != baseItem) {
                    baseItem.after(div);
                }
            }
            else if (2 === insertType) {
                var lyRow = divParentGroup.find('.rows').find('.treeRow');
                if (0 == lyRow.length) {
                    divParentGroup.find('.rows').append(div);
                }
                else {
                    lyRow.eq(0).before(div);
                }
            }
        },

        insertTreeAllGroupItem: function (groupList, pointList, searchPointName) {
            var _this = this;
            var divContain = $('#dataSrcPanel');

            // insert group
            var groupId, groupName, bIsDefault;
            for (var i = 0, len = groupList.length; i < len; i++) {
                groupId = groupList[i].id;
                groupName = groupList[i].name;
                bIsDefault = groupList[i].isDefault;

                var $ul = $('<ul class="nav nav-list tree-group" id="' + groupId + '" draggable="true" dropable="true" isDefault="' + bIsDefault + '">');
                //var $liHd = $('<li class="dsTreeHeader"><img src="/static/images/dataSource/group_head_sel.png" alt="png" class="dsTreeHeaderIcon"></li>');
                var $liHd;
                if (groupName == this.m_unassigned) {
                    $liHd = $('<li class="dsTreeHeader"><span class="dsTreeHeaderIcon open"></span></li>');
                }
                else {
                    $liHd = $('<li class="dsTreeHeader"><span class="dsTreeHeaderIcon"></span></li>');
                }
                var spanName = $('<span class="dsGroupName">' + groupName + '</span>');
                $liHd.append(spanName);

                if (groupName != _this.m_unassigned) {
                    var btnRemove = $('<span class="glyphicon glyphicon-remove-sign panel-heading-btn grow dsTreeBtnDel" aria-hidden="true" style="display:none"></span>');
                    EventAdapter.on($(btnRemove), 'click',
                        function (e) {
                            var div = $(e.currentTarget).closest('.nav');
                            WebAPI.get('/static/views/observer/widgets/modalFrame.html').done(function (result) {
                                var res = $(result);
                                res.find('#modalFrmBody').text(_this.m_lang.REMOVE_CONFIRM);
                                var btnSure = res.find('#btnSure');
                                btnSure.click(function (e) {
                                    if (undefined != _this.m_cfgPanel) {
                                        _this.m_cfgPanel.close();
                                        _this.m_parent.showAnlsPane();
                                    }

                                    var groupId = div.attr('id');

                                    // remove group animation
                                    div.css('position', 'relative');
                                    div.css('animation', 'dsRemove 3s infinite');
                                    div.css('-moz-animation', 'dsRemove 3s infinite');// Firefox
                                    div.css('-webkit-animation', 'dsRemove 3s infinite');// Safari & Chrome
                                    div.css('-o-animation', 'dsRemove 3s infinite');// Opera

                                    WebAPI.get('/datasource/deleteDataSourceGroup/' + AppConfig.userId + '/' + groupId).done(function (data) {
                                        if (('successful' == data.error)) {
                                            var len = _this.m_allGroupList.length;
                                            for (var i = 0; i < len; i++) {
                                                if (groupId == _this.m_allGroupList[i].id) {
                                                    _this.m_allGroupList.splice(i, 1);
                                                    div.remove();
                                                    break;
                                                }
                                            }
                                            _this.calUpdateDataSources();
                                        }
                                    }).fail(function (e) {
                                    });
                                });
                                res.modal('show');
                            }).always(function (e) {
                            });
                        }
                    );
                    $liHd.append(btnRemove);
                }

                var btnAddDs = $('<span class="glyphicon glyphicon-plus-sign panel-heading-btn grow dsTreeBtnAdd" aria-hidden="true" id="data_source_add" style="display:none"></span>');
                if (groupName == this.m_unassigned) {
                    btnAddDs.css('display', 'inline');
                }
                EventAdapter.on($(btnAddDs), 'click',
                    function (e) {
                        // clear data filter page if exist
                        var $pageFilter = $('#pageDataFilter');
                        if ($pageFilter.length > 0) {
                            $pageFilter.find('#btnCancel').click();
                        }

                        var tar = $(e.currentTarget);
                        _this.m_selectGroupId = tar.closest('.tree-group').get(0).id;
                        _this.stopBubble(e);

                        if (undefined != _this.m_cfgPanel) {
                            _this.m_cfgPanel.close();
                        }
                        WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                            _this.m_cfgPanel = new DataSourceConfigure(_this, 0, true, '', '', '', -1);
                            _this.m_cfgPanel.show();
                        }).error(function (result) {
                        }).always(function (e) {
                        });
                    }
                );
                $liHd.append(btnAddDs);

                var btnAddFormula = $('<span><img src="/static/images/dataSource/formula_add_normal.png" alt="Formula add" class="dsTreeBtnFormula" id="data_source_formula_add"  style="display:none"/></span>');
                if (groupName == this.m_unassigned) {
                    btnAddFormula.children('img').css('display', 'inline');
                }
                EventAdapter.on($(btnAddFormula), 'click',
                    function (e) {
                        // clear data filter page if exist
                        var $pageFilter = $('#pageDataFilter');
                        if ($pageFilter.length > 0) {
                            $pageFilter.find('#btnCancel').click();
                        }

                        var tar = $(e.currentTarget);
                        _this.m_selectGroupId = tar.closest('.tree-group').get(0).id;
                        _this.stopBubble(e);

                        if (undefined != _this.m_cfgPanel) {
                            _this.m_cfgPanel.close();
                        }
                        WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                            _this.m_cfgPanel = new DataSourceConfigure(_this, 1, true, '', '', '', -1);
                            _this.m_cfgPanel.show();
                        }).error(function (result) {
                        }).always(function (e) {
                        });
                    }
                );

                btnAddFormula.mouseenter(function (e) {
                    var img = btnAddFormula.find('img');
                    img.attr('src', '/static/images/dataSource/formula_add_hover.png');
                    img.css('width', '23px');
                    img.css('height', '20px');
                }).error(function (e) {
                });
                btnAddFormula.mouseleave(function (e) {
                    var img = btnAddFormula.find('img');
                    img.attr('src', '/static/images/dataSource/formula_add_normal.png');
                    img.css('width', '21px');
                    img.css('height', '19px');
                }).error(function (e) {
                });
                $liHd.append(btnAddFormula);

                if (groupName != _this.m_unassigned) {
                    var spanEdit = $('<span class="glyphicon glyphicon-pencil panel-heading-btn grow dsEditGroupName" aria-hidden="true" style="display:none"></span>');
                    EventAdapter.on($(spanEdit), 'click',
                        function (e) {
                            var tar = $(e.currentTarget);

                            var groupName = tar.siblings('.dsGroupName');
                            groupName.hide();

                            var input = tar.siblings('.inputEditGroup');
                            input.val(groupName.text());
                            input.show();
                            input.select();

                            tar.siblings('.btn').show();

                            _this.stopBubble(e);
                        }
                    );
                    $liHd.append(spanEdit);

                    var inputEdit = $('<input type="text" value="' + groupName + '" class="inputEditGroup">');
                    inputEdit.hide();
                    EventAdapter.on($(inputEdit), 'click',
                        function (e) {
                            _this.stopBubble(e);
                        }
                    );
                    inputEdit.keyup(function (e) {
                        if (13 == e.keyCode) {
                            var tar = $(e.currentTarget);
                            tar.siblings('button').click();
                        }
                        _this.stopBubble(e);
                    });
                    $liHd.append(inputEdit);

                    var btnEdit = $('<button class="btn btn-primary btn-sm" type="submit">Change</button>');
                    btnEdit.hide();
                    EventAdapter.on($(btnEdit), 'click',
                        function (e) {
                            var tar = $(e.currentTarget);
                            tar.hide();

                            var input = tar.siblings('.inputEditGroup');
                            var newName = input.val();
                            input.hide();

                            var groupName = tar.siblings('.dsGroupName');
                            var oldName = groupName.text();
                            groupName.show();

                            if (oldName != newName && '' != newName) {
                                // do db change
                                var ulNav = tar.closest('.nav');
                                var groupId = ulNav.attr('id');
                                var postData = {
                                    'groupId': groupId,
                                    'name': newName,
                                    'parent': '',
                                    'userId': AppConfig.userId
                                }
                                WebAPI.post('/datasource/saveDataSourceGroup', postData).done(function (data) {
                                    if (undefined == data) {
                                        return;
                                    }
                                    if ('successful' == data.error) {
                                        for (var i = 0, len = _this.m_allGroupList.length; i < len; i++) {
                                            if (groupId == _this.m_allGroupList[i].id) {
                                                _this.m_allGroupList[i].name = data.groupName;
                                                break;
                                            }
                                        }
                                        var spanName = ulNav.find('.dsGroupName');
                                        if (Boolean(spanName)) {
                                            spanName.text(data.groupName);
                                        }
                                    }
                                }).fail(function (e) {
                                });
                            }
                            _this.stopBubble(e);
                        }
                    );
                    $liHd.append(btnEdit);
                }

                EventAdapter.on($($liHd), 'click',
                    function (e) {
                        divContain.find('.dsTreeBtnCfg').css('display', 'none');
                        divContain.find('.dsTreeBtnRemove').css('display', 'none');
                        divContain.find('.dsEditGroupName').css('display', 'none');

                        var curTarHead = $(e.currentTarget);
                        curTarHead.find('.dsTreeBtnRemove').css('display', 'inline');
                        _this.m_selectGroupId = curTarHead.closest('.tree-group').get(0).id;

                        $(this).next('.rows').slideToggle();
                        var icon = $(this).find('.dsTreeHeaderIcon');
                        //var imgPath = icon.attr('src');
                        //if (_this.m_groupIconOpen == imgPath) {
                        if (icon.hasClass('open')) {
                            //icon.attr('src', _this.m_groupIconClose);
                            icon.removeClass('open');
                            curTarHead.find('.dsGroupName').removeClass('selected');
                            curTarHead.find('.dsTreeBtnFormula').css('display', 'none');
                            curTarHead.find('.dsTreeBtnAdd').css('display', 'none');
                            curTarHead.find('.dsTreeBtnDel').css('display', 'none');
                            curTarHead.find('.dsEditGroupName').css('display', 'none');
                        }
                        else {
                            //icon.attr('src', _this.m_groupIconOpen);
                            icon.addClass('open');
                            curTarHead.find('.dsGroupName').addClass('selected');
                            curTarHead.find('.dsTreeBtnFormula').css('display', 'inline-block');
                            curTarHead.find('.dsTreeBtnAdd').css('display', 'inline');
                            curTarHead.find('.dsTreeBtnDel').css('display', 'inline');
                            curTarHead.find('.dsEditGroupName').css('display', 'inline');
                        }
                    }
                );
                $ul.prepend($liHd);

                var divLiRow = $('<li class="rows"></li>');
                if (groupName == _this.m_unassigned) {
                    divLiRow.css('display', 'block');
                }
                else {
                    divLiRow.css('display', 'none');
                }
                $ul.append(divLiRow);

                // insert points
                var itemId, iconColor, itemName, itemPtName;
                var bHasSearched = false;
                for (var j = 0, len2 = pointList.length; j < len2; j++) {
                    if (groupId == pointList[j].groupId) {
                        itemId = pointList[j].itemId;
                        iconColor = pointList[j].iconColor;
                        itemName = pointList[j].customName;
                        itemPtName = pointList[j].ptName;
                        if ('' != searchPointName) {
                            var custNameLower = itemName.toLowerCase();
                            var ptNameLower = itemPtName.toLowerCase();
                            if (-1 == custNameLower.indexOf(searchPointName) && -1 == ptNameLower.indexOf(searchPointName)) {
                                continue;
                            }
                            else {
                                bHasSearched = true;
                            }
                        }

                        var div = $('<div class="treeRow ui-draggable" id="' + itemId + '" draggable="true" dropable="true"> ');
                        var icon = $('<div class="dsMark" style="margin-top: -1px"></div>');
                        icon.css('background-color', iconColor);
                        div.append(icon);

                        var divShowName = $('<span class="showName">' + itemName + '</span>');
                        EventAdapter.on($(divShowName), 'click',
                            function (e) {
                                var divCurShowName = $(e.currentTarget);
                                var oldCustName = divCurShowName.text();
                                var selItemId = divCurShowName.closest('.treeRow').attr('id');
                                var input = $('<input type="text" value="' + oldCustName + '" style="width:300px;position: absolute;top: 4px;background-color:#465b85">');
                                input.blur(function (e) {
                                    var $tar = $(e.currentTarget);
                                    var newCustName = $tar.val();
                                    if ('' == newCustName) {
                                        $tar.select();
                                        alert(I18n.resource.dataSource.CUSTOM_NOT_NULL);
                                        return;
                                    }
                                    if (oldCustName != newCustName) {
                                        var item, type, prjId, ptName, ptDesc, groupId, postData;
                                        for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                                            item = _this.m_allPointList[i];
                                            if (selItemId == item.itemId) {
                                                type = item.itemType;
                                                prjId = item.prjId;
                                                ptName = item.ptName;
                                                ptDesc = item.ptDesc;
                                                groupId = item.groupId;
                                                break;
                                            }
                                        }

                                        postData = {
                                            itemList: []
                                        };

                                        var eachItem = {
                                            id: selItemId,
                                            type: type,
                                            projId: prjId,
                                            alias: newCustName,
                                            note: ptDesc,
                                            value: ptName,
                                            groupId: groupId
                                        }
                                        postData.itemList.push(eachItem);

                                        WebAPI.post('/analysis/datasource/saveMulti', postData).done(function (data) {
                                            if (data.id != '') {
                                                _this.m_dataSourceId = data.id;
                                            }

                                            var list = data.itemIdList;
                                            var dstId, dstCustomName;
                                            for (var i = 0, len = list.length; i < len; i++) {
                                                dstId = list[i].id;
                                                dstCustomName = list[i].alias;

                                                for (var j = 0, len2 = _this.m_allPointList.length; j < len2; j++) {
                                                    if (dstId == _this.m_allPointList[j].itemId) {
                                                        _this.m_allPointList[j].customName = dstCustomName;
                                                        break;
                                                    }
                                                }

                                                divCurShowName.text(dstCustomName);
                                                _this.setToolTipsCustomName(divCurShowName.closest('.treeRow'), dstCustomName);
                                            }
                                            _this.calUpdateDataSources();
                                        });
                                    }
                                    input.remove();
                                    divCurShowName.css('display', 'inline');
                                });
                                input.keyup(function (e) {
                                    if (13 == e.keyCode) {
                                        input.blur();
                                    }
                                    _this.stopBubble(e);
                                });
                                divCurShowName.after(input);
                                divCurShowName.css('display', 'none');
                                input.select();
                            }
                        );
                        div.append(divShowName);

                        var btnRemove = $('<span class="glyphicon glyphicon-remove-sign panel-heading-btn grow dsTreeBtnRemove" aria-hidden="true"></span>');
                        EventAdapter.on($(btnRemove), 'click',
                            function (e) {
                                var promise = $.Deferred();
                                var div = $(e.currentTarget).closest('.treeRow');
                                var dataSrcItemId = div.attr('id');
                                var dataSrcId = _this.m_dataSourceId;

                                if (typeof _this.m_parent.doSync === 'function') {
                                    _this.m_parent.doSync().done(function () {
                                        promise.resolve();
                                    });
                                } else {
                                    promise.resolve();
                                }

                                Spinner.spin(div[0]);
                                // promise start
                                promise.done(function () {
                                    WebAPI.get('/analysis/checkDatasourceBeforeDelete/' + dataSrcItemId + '/' + AppConfig.userId)
                                        .done(function (chkData) {
                                            var nWorkSpLen = chkData.workspaceInfo.length;
                                            var nDashBoLen = chkData.dashboardInfo.length;
                                            if (nWorkSpLen > 0 || nDashBoLen > 0) {
                                                var show = _this.m_lang.REMOVE_CONFIRM_TIPS;
                                                var name;
                                                for (var i = 0; i < nWorkSpLen; i++) {
                                                    if (0 == i) {
                                                        show += 'workspace: ';
                                                    }
                                                    name = chkData.workspaceInfo[i].modalName;
                                                    name = Boolean(name) ? name : 'Untitled';
                                                    show += name + ',';
                                                }
                                                for (var j = 0; j < nDashBoLen; j++) {
                                                    if (0 == j) {
                                                        show += 'dashboard: ';
                                                    }
                                                    show += chkData.dashboardInfo[j].modalType + ',';
                                                }
                                                show += _this.m_lang.REMOVE_CONFIRM;

                                                WebAPI.get('/static/views/observer/widgets/modalFrame.html').done(function (result) {
                                                    var res = $(result);
                                                    res.find('#modalFrmBody').text(show);
                                                    var btnSure = res.find('#btnSure');
                                                    btnSure.click(function (e) {
                                                        if (undefined != _this.m_cfgPanel) {
                                                            _this.m_cfgPanel.close();
                                                            _this.m_parent.showAnlsPane();
                                                        }

                                                        // remove item animation
                                                        div.css('position', 'relative');
                                                        div.css('animation', 'dsRemove 3s infinite');
                                                        div.css('-moz-animation', 'dsRemove 3s infinite');// Firefox
                                                        div.css('-webkit-animation', 'dsRemove 3s infinite');// Safari & Chrome
                                                        div.css('-o-animation', 'dsRemove 3s infinite');// Opera

                                                        WebAPI.get('/analysis/datasource/removeSingle/' + dataSrcItemId).done(function (data) {
                                                            if (Boolean(data.success)) {
                                                                var len = _this.m_allPointList.length;
                                                                for (var i = 0; i < len; i++) {
                                                                    if (dataSrcItemId == _this.m_allPointList[i].itemId) {
                                                                        _this.m_allPointList.splice(i, 1);
                                                                        break;
                                                                    }
                                                                }
                                                                _this.calUpdateDataSources();

                                                                div.tooltip('destroy');
                                                                div.remove();

                                                                // delete workspace
                                                                var arr = chkData.workspaceInfo;
                                                                for (var i = 0, len = arr.length; i < len; i++) {
                                                                    var divWoSp = $('.divPage');
                                                                    for (var j = 0, len2 = divWoSp.length; j < len2; j++) {
                                                                        if (arr[i].modalName == divWoSp.eq(j).find('.modalNameSp').text()) {
                                                                            divWoSp.eq(j).remove();
                                                                        }
                                                                    }
                                                                }

                                                                Beop.cache.ds.remove(dataSrcItemId);
                                                            }
                                                        }).fail(function (e) {
                                                        });
                                                    });
                                                    res.modal('show');
                                                }).always(function (e) {
                                                });
                                            }
                                            else {
                                                // another remove logic
                                                // remove item animation
                                                div.css('position', 'relative');
                                                div.css('animation', 'dsRemove 3s infinite');
                                                div.css('-moz-animation', 'dsRemove 3s infinite');// Firefox
                                                div.css('-webkit-animation', 'dsRemove 3s infinite');// Safari & Chrome
                                                div.css('-o-animation', 'dsRemove 3s infinite');// Opera

                                                WebAPI.get('/analysis/datasource/removeSingle/' + dataSrcItemId).done(function (data) {
                                                    if (Boolean(data.success)) {
                                                        var len = _this.m_allPointList.length;
                                                        for (var i = 0; i < len; i++) {
                                                            if (dataSrcItemId == _this.m_allPointList[i].itemId) {
                                                                _this.m_allPointList.splice(i, 1);
                                                                break;
                                                            }
                                                        }
                                                        _this.calUpdateDataSources();

                                                        div.tooltip('destroy');
                                                        div.remove();

                                                        // delete workspace
                                                        var arr = chkData.workspaceInfo;
                                                        for (var i = 0, len = arr.length; i < len; i++) {
                                                            var divWoSp = $('.divPage');
                                                            for (var j = 0, len2 = divWoSp.length; j < len2; j++) {
                                                                if (arr[i].modalName == divWoSp.eq(j).find('.modalNameSp').text()) {
                                                                    divWoSp.eq(j).remove();
                                                                }
                                                            }
                                                        }

                                                        Beop.cache.ds.remove(dataSrcItemId);
                                                    }
                                                }).fail(function (e) {
                                                });
                                            }
                                        }).fail(function (e) {
                                        }).always(function (e) {
                                            Spinner.stop();
                                        });
                                });
                                // promise end
                            }
                        );
                        div.append(btnRemove);

                        var bIsPoint = (0 == pointList[j].itemType) ? true : false;
                        if (bIsPoint) {
                            var btnCfg = $('<img src="/static/images/dataSource/item_edit.png" alt="png" class="dsTreeBtnCfg">');
                            EventAdapter.on($(btnCfg), 'click',
                                function (e) {
                                    // clear data filter page if exist
                                    var $pageFilter = $('#pageDataFilter');
                                    if ($pageFilter.length > 0) {
                                        $pageFilter.find('#btnCancel').click();
                                    }

                                    if (undefined != _this.m_cfgPanel) {
                                        _this.m_cfgPanel.close();
                                    }
                                    var curTar = $(e.currentTarget);
                                    _this.m_selectItemId = curTar.closest('.treeRow').get(0).id;
                                    _this.m_selectGroupId = curTar.closest('.tree-group').get(0).id;
                                    var customName, ptDesc, ptName, item, prjId;
                                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                                        item = _this.m_allPointList[i];
                                        if (itemId === item.itemId) {
                                            customName = item.customName;
                                            ptName = item.ptName;
                                            ptDesc = item.ptDesc;
                                            prjId = item.prjId;
                                            break;
                                        }
                                    }
                                    WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                                        _this.m_cfgPanel = new DataSourceConfigure(_this, 0, false, customName, ptName, ptDesc, prjId);
                                        _this.m_cfgPanel.show();
                                    }).fail(function (result) {
                                    }).always(function (e) {
                                    });
                                }
                            );

                            btnCfg.mouseenter(function (e) {
                                btnCfg.attr('src', '/static/images/dataSource/item_edit_hover.png');
                                btnCfg.css('width', '18px');
                                btnCfg.css('height', '18px');
                            }).error(function (e) {
                            });
                            btnCfg.mouseleave(function (e) {
                                btnCfg.attr('src', '/static/images/dataSource/item_edit.png');
                                btnCfg.css('width', '16px');
                                btnCfg.css('height', '16px');
                            }).error(function (e) {
                            });

                            div.append(btnCfg);
                        } else {
                            var btnCfg = $('<img src="/static/images/dataSource/item_edit.png" alt="png" class="dsTreeBtnCfg">');
                            EventAdapter.on($(btnCfg), 'click',
                                function (e) {
                                    // clear data filter page if exist
                                    var $pageFilter = $('#pageDataFilter');
                                    if ($pageFilter.length > 0) {
                                        $pageFilter.find('#btnCancel').click();
                                    }

                                    if (undefined != _this.m_cfgPanel) {
                                        _this.m_cfgPanel.close();
                                    }
                                    var curTar = $(e.currentTarget);
                                    _this.m_selectItemId = curTar.closest('.treeRow').get(0).id;
                                    _this.m_selectGroupId = curTar.closest('.tree-group').get(0).id;
                                    var customName, ptDesc, ptName, item, prjId;
                                    for (var i = 0, len = _this.m_allPointList.length; i < len; i++) {
                                        item = _this.m_allPointList[i];
                                        if (itemId === item.itemId) {
                                            customName = item.customName;
                                            ptName = item.ptName;
                                            ptDesc = item.ptDesc;
                                            prjId = item.prjId;
                                            break;
                                        }
                                    }
                                    WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                                        _this.m_cfgPanel = new DataSourceConfigure(_this, 1, false, customName, ptName, ptDesc, prjId);
                                        _this.m_cfgPanel.show();
                                    }).fail(function (result) {
                                    }).always(function (e) {
                                    });
                                }
                            );

                            btnCfg.mouseenter(function (e) {
                                btnCfg.attr('src', '/static/images/dataSource/item_edit_hover.png');
                                btnCfg.css('width', '18px');
                                btnCfg.css('height', '18px');
                            }).error(function (e) {
                            });
                            btnCfg.mouseleave(function (e) {
                                btnCfg.attr('src', '/static/images/dataSource/item_edit.png');
                                btnCfg.css('width', '16px');
                                btnCfg.css('height', '16px');
                            }).error(function (e) {
                            });
                            div.append(btnCfg);
                        }

                        EventAdapter.on($(div), 'click',
                            function (e) {
                                var divContain = $('#dataSrcPanel');
                                divContain.find('.dsTreeBtnCfg').css('display', 'none');
                                divContain.find('.dsTreeBtnRemove').css('display', 'none');

                                var curTarItem = $(e.currentTarget);
                                curTarItem.find('.dsTreeBtnCfg').css('display', 'inline');
                                curTarItem.find('.dsTreeBtnRemove').css('display', 'inline');
                                _this.m_selectGroupId = curTarItem.closest('.tree-group').get(0).id;
                            }
                        );

                        $ul.find('.rows').append(div);

                        // init tips
                        if (bIsPoint) {
                            var prjName = _this.getProjectNameFromId(pointList[j].prjId, _this.m_langFlag);
                            _this.initToolTips(div, pointList[j].customName, prjName, pointList[j].ptName, pointList[j].ptDesc);
                        }
                        else {
                            var showName = _this.getShowNameFromFormula(pointList[j].ptName);
                            _this.initFormulaToolTips(div, pointList[j].customName, showName, pointList[j].ptDesc);
                        }
                    }
                }

                if ('' == searchPointName) {
                    divContain.append($ul);
                }
                else {
                    if (bHasSearched) {
                        divContain.append($ul);
                    }
                }
            }
        },

        getDSItemById: function (datasourceItemId) {
            //if (undefined != this.m_parent.store.group) {
            //    var itemGroup, lenItem;
            //    for (var i = 0, len = this.m_parent.store.group.length; i < len; i++) {
            //        itemGroup = this.m_parent.store.group[i];
            //        lenItem = itemGroup.datasourceList.length;
            //        for (var j = 0; j < lenItem; j++) {
            //            if (datasourceItemId == itemGroup.datasourceList[j].id) {
            //                return itemGroup.datasourceList[j];
            //            }
            //        }
            //    }
            //}
            var _this = this;
            var postData = [];
            var bIsArray = Object.prototype.toString.call(datasourceItemId) === '[object Array]';

            if (!bIsArray) {    // single
                if (this.m_parent.store.dsInfoList) {
                    var itemInfo;
                    for (var i = 0, len = this.m_parent.store.dsInfoList.length; i < len; i++) {
                        itemInfo = this.m_parent.store.dsInfoList[i];
                        if (datasourceItemId == itemInfo.id) {
                            return itemInfo;
                        }
                    }
                }
                for (var i = 0, len = _this.m_arrCloudTableInfo.length; i < len; i++) {
                    var item = _this.m_arrCloudTableInfo[i];
                    if (datasourceItemId == item._id) {
                        return {
                            id: item._id,
                            groupId: '',
                            alias: item.alias,
                            projId: item.projId,
                            type: 0,
                            value: item.value
                        }
                    }
                }
            }
            else {  // array
                var ret = [];
                if (this.m_parent.store.dsInfoList) {
                    var itemInfo;
                    for (var j = 0; j < datasourceItemId.length; j++) {
                        for (var i = 0, len = this.m_parent.store.dsInfoList.length; i < len; i++) {
                            itemInfo = this.m_parent.store.dsInfoList[i];
                            if (datasourceItemId[j] == itemInfo.id) {
                                ret.push(itemInfo);
                                break;
                            }
                        }
                    }
                    if (ret.length > 0) {
                        return ret;
                    }
                }
                for (var j = 0; j < datasourceItemId.length; j++) {
                    for (var i = 0, len = _this.m_arrCloudTableInfo.length; i < len; i++) {
                        var item = _this.m_arrCloudTableInfo[i];
                        if (datasourceItemId[j] == item._id) {
                            ret.push({
                                id: item._id,
                                groupId: '',
                                alias: item.alias,
                                projId: item.projId,
                                type: 0,
                                value: item.value
                            });
                        }
                    }
                }
                if (ret.length > 0) {
                    return ret;
                }
            }

            if (!bIsArray) {
                postData.push(datasourceItemId);
            }
            else {
                postData = datasourceItemId;
            }
            var dsRet = $.ajax({
                type: 'POST',
                url: '/analysis/datasource/getDsItemsById',
                data: JSON.stringify(postData),
                contentType: 'application/json',
                async: false
            }).responseText;
            if (dsRet) {
                var temp = JSON.parse(dsRet);
                var ret;
                if (!bIsArray) {
                    ret = temp[0];
                    if (!ret) {
                        ret = {
                            alias: undefined,
                            groupId: undefined,
                            id: undefined,
                            note: undefined,
                            projId: undefined,
                            type: undefined,
                            value: undefined
                        }
                    }
                }
                else {
                    ret = temp;
                }
                return ret;
            }
            return {};
        },

        getDSItemData: function (target, arrDSItemIds) {
            var _this = this.m_parent;

            var tmStart = _this.curModal.startTime.toDate();
            var tmEnd = _this.curModal.endTime.toDate();
            var tmFmt = _this.curModal.format;

            var key;
            // 新增"回归"和"预测"点的判定
            var preloadIds = [];
            var row = null, arrId;
            // 在这里拷贝一份，这点很重要
            var ids = arrDSItemIds.concat();

            var postData = {
                //dataSourceId: AppConfig.datasource.getId(),
                dsItemIds: ids,
                timeStart: tmStart.format('yyyy-MM-dd HH:mm:ss'),
                timeEnd: tmEnd.format('yyyy-MM-dd HH:mm:ss'),
                timeFormat: tmFmt
            };

            var promise = $.Deferred();

            // find in cache
            // notice that the ids may be changed in this call
            Beop.cache.ds.getBatch(ids, tmFmt, tmStart, tmEnd).done(function (rs) {
                promise.resolve(rs);
            }).fail(function (e) {
                console.warn(e);
                promise.reject();
            });

            promise.always(function (rs) {
                var idsNotFound, cacheData;
                if (rs) {
                    idsNotFound = rs.idsNotFound;
                    cacheData = rs.data;

                    if (idsNotFound.length > 0) {
                        postData.dsItemIds = idsNotFound;
                    } else {
                        target.spinnerStop();
                        target.renderModal(cacheData);
                        return;
                    }
                }

                WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function (data) {
                    if (data.error && data.error.length > 0) {
                        target.errAlert(data.error);
                        target.spinnerStop();
                        return;
                    }
                    Beop.cache.ds.set(data, tmFmt, tmStart, tmEnd).done(function () {
                        // combine with cacheData
                        if (cacheData && cacheData !== null) {
                            data = {
                                list: data.list.concat(cacheData.list),
                                timeShaft: (data.timeShaft.length > 0) ? data.timeShaft : cacheData.timeShaft
                            };
                        }

                    }).fail(function (e) {
                        console.warn(e);
                    }).always(function () {
                        target.renderModal(data);
                    });

                }).error(function (e) {
                    _this.paneCenter.spinnerStop();
                    _this.alertNoData();
                });
            });

        },

        getDSItemDataMulti: function (target, arrDSItemIds) {
            var _this = this.m_parent;
            _this.curModal.arrComparePeriodLabel = [];

            var tmStart = _this.curModal.startTime;
            tmStart = tmStart.length <= 10 ? tmStart + ' 00:00:00' : tmStart;
            var tmEnd = _this.curModal.endTime;
            tmEnd = tmEnd.length <= 10 ? tmEnd + ' 00:00:00' : tmEnd;
            var tmFmt = _this.curModal.format;
            var comparePeriod = _this.curModal.comparePeriod;

            var period1, period2, time;
            var startDate = new Date(tmStart);
            var endDate = new Date(tmEnd);
            var compareDateI18n = I18n.resource.analysis.historyCompare;
            if (comparePeriod == 'hour') {
                time = 3600000;//60 * 60 * 1000;
                period1 = new Date(startDate.getTime() + time).format('yyyy-MM-dd HH:mm:ss');
                period2 = new Date(endDate.getTime() + time).format('yyyy-MM-dd HH:mm:ss');

                _this.curModal.arrComparePeriodLabel.push(startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate() + ' ' + startDate.getHours() + ':00');
                _this.curModal.arrComparePeriodLabel.push(endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate() + ' ' + endDate.getHours() + ':00');
            }
            if (comparePeriod == 'day') {
                time = 86400000;//24 * 60 * 60 * 1000;
                period1 = new Date(startDate.getTime() + time).format('yyyy-MM-dd HH:mm:ss');
                period2 = new Date(endDate.getTime() + time).format('yyyy-MM-dd HH:mm:ss');
                _this.curModal.arrComparePeriodLabel.push(startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate());
                _this.curModal.arrComparePeriodLabel.push(endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate());
            }
            if (comparePeriod == 'week') {
                time = 604800000;//7 * 24 * 60 * 60 * 1000;
                period1 = new Date(startDate.getTime() + time).format('yyyy-MM-dd HH:mm:ss');
                period2 = new Date(endDate.getTime() + time).format('yyyy-MM-dd HH:mm:ss');

                _this.curModal.arrComparePeriodLabel.push(compareDateI18n.YEAR_WEEK.replace('<%year%>', startDate.getFullYear()).replace('<%week%>', getWeekNumber(tmStart)));
                _this.curModal.arrComparePeriodLabel.push(compareDateI18n.YEAR_WEEK.replace('<%year%>', endDate.getFullYear()).replace('<%week%>', getWeekNumber(tmEnd)));
            }
            if (comparePeriod == 'month') {
                period1 = getCurrentMonthLastDay(tmStart);
                period2 = getCurrentMonthLastDay(tmEnd);
                function getCurrentMonthLastDay(date) {
                    var current = date.toDate();
                    var currentMonth = current.getMonth();
                    var nextMonth = ++currentMonth;
                    var nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1);
                    return new Date(nextMonthDayOne.getTime());
                }

                _this.curModal.arrComparePeriodLabel.push(startDate.getFullYear() + '-' + (startDate.getMonth() + 1));
                _this.curModal.arrComparePeriodLabel.push(endDate.getFullYear() + '-' + (endDate.getMonth() + 1));
            }

            var postData = [{
                dsItemIds: arrDSItemIds,
                timeStart: tmStart.format('yyyy-MM-dd HH:mm:ss'),
                timeEnd: period1.format('yyyy-MM-dd HH:mm:ss'),
                timeFormat: tmFmt
            }, {
                dsItemIds: arrDSItemIds,
                timeStart: tmEnd.format('yyyy-MM-dd HH:mm:ss'),
                timeEnd: period2.format('yyyy-MM-dd HH:mm:ss'),
                timeFormat: tmFmt
            }];

            //var ItemKey = 'anal_' + tmFmt + '_' + arrDSItemIds[0];

            WebAPI.post('/analysis/startWorkspaceDataGenHistogramMulti', postData).done(function (data) {
                if (data.error && data.error.length > 0) {
                    target.errAlert(data.error);
                    target.spinnerStop();
                    return;
                }
                //sessionStorage.setItem(ItemKey, result);// 此 sessionStorage 没有再用到了
                target.renderModal(data);
            }).error(function (e) {
                _this.paneCenter.spinnerStop();
                _this.alertNoData();
            });


            /**
             * 判断年份是否为润年
             */
            function isLeapYear(year) {
                return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
            }

            /**
             * 获取某一年份的某一月份的天数
             */
            function getMonthDays(year, month) {
                return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
            }

            /**
             * 获取某年的某天是第几周
             */
            function getWeekNumber(date) {
                var now = date.toDate(),
                    year = now.getFullYear(),
                    month = now.getMonth(),
                    days = now.getDate();
                //那一天是那一年中的第多少天
                for (var i = 0; i < month; i++) {
                    days += getMonthDays(year, i);
                }

                //那一年第一天是星期几
                var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

                var week = null;
                if (yearFirstDay == 1) {
                    week = Math.ceil(days / yearFirstDay);
                } else {
                    days -= (7 - yearFirstDay + 1);
                    week = Math.ceil(days / 7) + 1;
                }

                return week;
            }
        },

        getShowNameFromFormula: function (formula) {
            var _this = this;
            var inputStr = formula;
            var nStart = inputStr.indexOf('<%');
            var nEnd = inputStr.indexOf('%>');
            if (-1 == nStart || -1 == nEnd) {
                return inputStr;
            }

            var id = inputStr.substring(nStart + 2, nEnd);
            if ('' == id) {
                return _this.getShowNameFromFormula(inputStr);
            }

            var retVal = _this.getDSItemById(id);
            if (null == retVal) {
                return _this.getShowNameFromFormula(inputStr);
            }

            inputStr = inputStr.replace('<%' + id + '%>', retVal.value);
            return _this.getShowNameFromFormula(inputStr);

            //var showName = formula;
            //var arr = showName.split('<%');
            //for (var k = 0, len2 = arr.length; k < len2; k++) {
            //    var id = arr[k].split('%>')[0];
            //    if ('' == id) {
            //        continue;
            //    }
            //    var retVal = _this.getDSItemById(id);
            //    if (null == retVal) {
            //        continue;
            //    }
            //    showName = showName.replace(id, retVal.value);
            //}
            //showName = showName.replace(/<%/g, '');
            //showName = showName.replace(/%>/g, '');
            //return showName;
        },

        addNewGroup: function () {
            var groupName = $('#inputAddGroup').val();
            if ('' == groupName) {
                return;
            }

            var _this = this;
            var postData = {
                'groupId': '',
                'name': groupName,
                'parent': '',
                'userId': AppConfig.userId
            }
            WebAPI.post('/datasource/saveDataSourceGroup', postData).done(function (data) {
                if ('successful' != data.error) {
                    return;
                }
                var groupId = data.groupId;
                if (groupId) {
                    if (_this.treeObj) {
                        var nodeUnassigned = _this.treeObj.getNodesByParam('name', 'unassigned', null);
                        var index = -1;
                        if (nodeUnassigned.length > 0) {
                            index = _this.treeObj.getNodeIndex(nodeUnassigned[0]);
                        }
                        _this.treeObj.addNodes(null, index, {
                            id: data.groupId,
                            pId: data.parentId,
                            name: data.groupName,
                            isParent: true
                        });
                    }
                }
                $('#inputAddGroup').val('');
                $('#inputAddGroup').blur();

                //var groupId = data.groupId;
                //if (groupId) {
                //    var bIsFind = false;
                //    for (var i = 0, len = _this.m_allGroupList.length; i < len; i++) {
                //        if (groupId === _this.m_allGroupList[i].id) {
                //            bIsFind = true;
                //            break;
                //        }
                //    }
                //    if (!bIsFind) {
                //        _this.m_allGroupList.push({'id': groupId, 'name': data.groupName, 'isDefault':false});
                //        var ulCnt = $('#dataSrcPanel').find('ul').length;
                //        if (ulCnt > 1) {
                //            var defaultGroup = $('#dataSrcPanel ul[isDefault=true]').eq(0);
                //            if (defaultGroup && defaultGroup.length > 0) {
                //                _this.insertTreeGroup(data.groupId, data.groupName, 1, defaultGroup.prev());
                //            }
                //            else {
                //                _this.insertTreeGroup(data.groupId, data.groupName, 0, null);
                //            }
                //        }
                //        else {
                //            var defaultGroup = $('#dataSrcPanel ul[isDefault=true]').eq(0);
                //            if (defaultGroup && defaultGroup.length > 0) {
                //                _this.insertTreeGroup(data.groupId, data.groupName, 2, defaultGroup.prev());
                //            }
                //            else {
                //                _this.insertTreeGroup(data.groupId, data.groupName, 0, null);
                //            }
                //        }
                //        $('#' + data.groupId).find('.dsTreeHeader').click();
                //    }
                //    $('#inputAddGroup').val('');
                //}
            }).fail(function (result) {
            }).always(function (e) {
            });
        }
    }

    return DataSource;
})();
/**
 * Created by win7 on 2016/2/6.
 */
var HierFilter = (function(){
    function HierFilter($ctn,projectId,parent,theme){
        this.$ctn = $ctn;
        this.projectId = projectId;
        this.theme = theme;
        this.opt = undefined;
        this.parent = parent;
        this.defaultOpt = {
                title:{
                    show:false
                },
                base:{
                    divideByProject:true
                },
                search:{
                    show:true
                },
                class: {
                    show:true,
                    projects: {
                        show: true,
                        class: 'all',
                        showAll: true,
                        showNone: true,
                        add:true,
                        delete:true
                    },
                    groups: {
                        show: true,
                        class: 'all',
                        showAll: true,
                        showNone: true,
                        add:true,
                        delete:true
                    },
                    things: {
                        show: true,
                        class: 'all',
                        showAll: true,
                        showNone: true,
                        add:true,
                        delete:true
                    }
                },
                tree:{
                    show:true,
                    event:{},
                    drag:{
                        enable:true
                    },
                    base:{
                        expandReload:true,
                    },
                    tool:{
                        add:{

                        },
                        beforeAdd:{

                        },
                        edit:{

                        },
                        del:{

                        }
                    },
                    check:{
                        enable:false
                    }
                }
            };
        this.dictClass = {};
        this.store = undefined;
        this.initDeferred = $.Deferred();
        this.$paneClass = undefined;
        this.$paneSearch = undefined;
        this.$paneTree = undefined;
        this.$paneAdd = undefined;

        this.tree = undefined;
        this.setDefault = false;
        this.prevProjId = undefined;
        this.isSearch = false;

        this.showStatus = {'projects':'all','groups':'all','things':'all'};
    }
    HierFilter.prototype = {
        init:function(ctn,theme){
            var _this = this;
            _this.$ctn = ctn?ctn:_this.$ctn;
            _this.theme = theme?theme:_this.theme;
            if(!_this.projectId) {
                if (AppConfig && AppConfig.projectId) {
                    _this.projectId = AppConfig.projectId;
                } else {
                    if (window.parent && window.parent.AppConfig.projectId) {
                        _this.projectId = window.parent.AppConfig.projectId;
                    }
                }
            }
            if(!_this.projectId)_this.projectId = -1;
            WebAPI.get('/static/scripts/iot/hierFilter.html').done(function(resultHTML){
                _this.$ctn.append(resultHTML);
                I18n.fillArea($('#filterWrapper'));
                _this.initAddPane();
                _this.initSearch();
                _this.initDeferred.resolve();
            });
        },
        setOption:function(opt){
            var _this = this;
            _this.initDeferred.done(function() {
                _this.opt = $.extend(true, {}, _this.defaultOpt, opt);
                var postData = {
                    parent: [],
                    projId:[_this.projectId]
                };
                if (!_this.opt.base.divideByProject)delete postData.projId;
                $.when(
                    WebAPI.get('/iot/getClassFamily/group/cn'),
                    WebAPI.get('/iot/getClassFamily/thing/cn'),
                    WebAPI.get('/iot/getClassFamily/project/cn')
                ).done(function (groups,things,projects) {
                    _this.dictClass['groups'] = groups[0];
                    _this.dictClass['things'] = things[0];
                    _this.dictClass['projects'] = projects[0];
                    WebAPI.post('/iot/search', postData).done(function (resultDate) {
                        _this.store = {
                            groups: resultDate.groups,
                            projects: resultDate.projects,
                            things: resultDate.things
                        };
                        _this.isSearch = false;
                        var $Deffer = $.Deferred();
                        if (resultDate.projects.length == 0) {
                            _this.setIotProject().done(function(result){
                                if (result && result.status == 'success') {
                                    _this.store.projects[0]._id = result._id;
                                    $Deffer.resolve();
                                }else{
                                    $Deffer.reject();
                                }
                            }).fail(function(){
                                $Deffer.reject();
                            });
                        }else{
                            $Deffer.resolve();
                        }
                        $Deffer.done(function(){
                            for (var i = 0; i < _this.store.groups.length; i++) {
                                _this.store.groups[i].isParent = true;
                                //_this.store.groups[i].open = true;
                                _this.store.groups[i].baseType = 'groups';
                            }
                            for (var i = 0; i < _this.store.projects.length; i++) {
                                _this.store.projects[i].isParent = true;
                                //_this.store.projects[i].open = true;
                                _this.store.projects[i].baseType = 'projects';
                            }
                            for (var i = 0; i < _this.store.things.length; i++) {
                                _this.store.things[i].baseType = 'things';
                            }
                            for (var type in _this.store) {
                                if (_this.opt.class && _this.opt.class[type] && _this.opt.class[type].class) {
                                    if (_this.dictClass[type][_this.opt.class[type].class] && _this.dictClass[type][_this.opt.class[type].class].parent == 'BaseIOT') {
                                        _this.showStatus[type] = 'all'
                                    } else {
                                        _this.showStatus[type] = _this.opt.class[type].class
                                    }
                                }
                            }
                            _this.initClassPane();
                            //_this.initClassDetail();
                            _this.initTreePane(_this.store);
                            _this.opt.tree.event.afterInit && _this.opt.tree.event.afterInit();
                            var node = _this.tree.getNodes();
                            if (node.length == 0)return;
                            node = node[0];
                            _this.tree.selectNode(node);
                            _this.setDefault = true;
                            _this.tree.setting.callback.onClick({target: document.getElementById(node.tId)}, node['_id'], node);
                        });
                    });
                });
            });
        },
        setIotProject:function(){
            if (!(AppConfig && (AppConfig.projectList instanceof Array)))return;
            if (!this.projectId)return;
            var info;
            for (var i = 0; i < AppConfig.projectList.length ;i++){
                if (AppConfig.projectList[i].id == this.projectId){
                    info = AppConfig.projectList[i];
                    break;
                }
            }
            if (!info)return;

            var postData = {
                '_idMgt':'bbbbbbbbbbbbf32fbc300001',
                codeName:info.name_en,
                dictName:{
                    cn:info.name_cn,
                    en:info.name_en
                },
                latLng:info.latlng,
                arrP:{},
                type:'Project',
                projId:this.projectId
            };
            this.store.projects = [{
                codeName:info.name_en,
                name:info.name_cn,
                latLng:info.latlng,
                arrP:{},
                type:'Project',
                projId:this.projectId
            }];
            return WebAPI.post('/iot/setIotProject',postData)
        },
        refresh:function(){

        },
        dispose:function(){

        },
        close:function(){

        },
        initClassPane:function(){
            var _this = this;
            if(!(_this.opt.class && _this.opt.class.show ))return;
            _this.$paneClass = $('#paneIotType');
            _this.$paneClass.html('');
            setClassSel('projects');
            setClassSel('groups');
            setClassSel('things');
            function setClassSel(type){
                if(_this.opt.class && _this.opt.class[type] && _this.opt.class[type].show){
                    var strType = type.slice(0,type.length - 1);
                    strType = strType[0].toLocaleUpperCase() + strType.slice(1);
                    var $divSelect = $('\
                    <div class="divSelect" value="all">\
                        <span class="spSelRs">'+I18n.resource.benchmark.conmmenTree.TREE_ALL+'</span>\
                        <span class="glyphicon glyphicon-triangle-bottom"></span>\
                    </div>');
                    var selOpt = [];
                    if (_this.opt.class[type].showAll){
                        selOpt.push({
                            value:'all',
                            name:I18n.resource.benchmark.conmmenTree.TREE_ALL
                        })
                    }
                    if (_this.opt.class[type].showNone){
                        selOpt.push({
                            value:'none',
                            name:I18n.resource.benchmark.conmmenTree.TREE_HIDE
                        })
                    }
                    for (var cls in  _this.dictClass[type]){
                        if (_this.dictClass[type][cls].parent == 'BaseIOT')continue;
                        selOpt.push({
                            value:cls,
                            name:_this.dictClass[type][cls].name,
                            parent:_this.dictClass[type][cls].parent,
                        })
                    }
                    var $selector = _this.setSel(selOpt).addClass('selClass');
                    if ($selector.find('li').length == 0)return;
                    $selector.off('click').on('click','li',function(e){
                        e.stopPropagation();
                        var value = $(e.currentTarget).attr('value');
                        $selector.prevAll('.spSelRs').text($(e.currentTarget).children('span').text());
                        $selector.attr('value');
                        var opt = {
                            'type':type,
                            'val': value
                        };
                        _this.showStatus[opt.type] = opt.val;
                        _this.initTreeData(opt);
                        _this.initAttrPane(opt)
                    });
                    $selector.attr('value',_this.showStatus[type]);
                    if (_this.showStatus[type] == 'all'){
                        $divSelect.children('.spSelRs').text(I18n.resource.benchmark.conmmenTree.TREE_ALL);
                    }else if(_this.showStatus[type] == 'none'){
                        $divSelect.children('.spSelRs').text(I18n.resource.benchmark.conmmenTree.TREE_HIDE);
                    }else {
                        var arrKey = Object.keys(_this.dictClass[type]);
                        for (var i = 0; i < arrKey.length; i++) {
                            if (arrKey[i] == _this.showStatus[type]) {
                                $divSelect.children('.spSelRs').text(_this.dictClass[type][arrKey[i]].name);
                                break;
                            }
                        }
                    }
                    $divSelect.append($selector);
                    _this.$paneClass.append($divSelect);
                }
            }
        },
        setSel:function(selOpt){
            var _this = this;
            var $selector = $('<ul>');
            var tempArr = [].concat(selOpt);
            var dictTree = {};
            var level = 0;
            var length = tempArr.length;
            var numLeft = length;
            var isRoot;
            for (var i = 0; i < length; i++) {
                isRoot = true;
                for (var j = 0; j < length; j++) {
                    if (i == j)continue;
                    if (selOpt[j].value == tempArr[i].parent) {
                        isRoot = false;
                        break;
                    }
                }
                if (isRoot){
                    tempArr[i].level = level;
                    if (!dictTree[level])dictTree[level] = [];
                    dictTree[level].push(tempArr[i]);
                    tempArr[i] = null;
                }
            }
            while (numLeft > 0) {
                numLeft = 0;
                level++;
                for (var i = 0; i < length ;i++) {
                    if(!tempArr[i])continue;
                    for (var j = 0; j < dictTree[level-1].length; j++) {
                        if (tempArr[i].parent == dictTree[level-1][j].value){
                            if (!dictTree[level])dictTree[level] = [];
                            dictTree[level].push(tempArr[i]);
                            tempArr[i] = null;
                            break;
                        }
                    }
                }
                for (var i = 0; i < length; i++){
                    if(tempArr[i])numLeft++;
                }
            }
            var $option,$parent = [],$parentTemp = [];
            var $spName;
            for (var i = 0 ; i < dictTree['0'].length ;i++){
                $option = $('<li>');
                $option.addClass('level_0 '+ dictTree['0'][i].value)
                    .attr('value',dictTree['0'][i].value);
                $spName = $('<span>').text(dictTree['0'][i].name);
                $option.append($spName);
                $option.append('<ul>');
                $selector.append($option);
                $parent.push($option);
            }
            for (var ele in dictTree){
                if (ele == '0')continue;
                for (var i = 0 ; i < dictTree[ele].length;i++){
                    $option = $('<li>');
                    $option.addClass('level_'+ ele +' '+ dictTree[ele][i].value)
                        .attr('value',dictTree[ele][i].value);
                    $spName = $('<span>').text(dictTree[ele][i].name);
                    $option.append($spName);
                    $option.append('<ul>');
                    for (var j = 0; j < $parent.length; j++){
                        if ($parent[j].attr('value') == dictTree[ele][i].parent){
                            $parent[j].children('ul').append($option);
                            break;
                        }
                    }
                    $parentTemp.push($option);
                }
                $parent = $parentTemp;
                $parentTemp = [];
            }
            //for (var i = 0 ; i< selOpt.length;i++){
            //    $option = $('<option>').attr('value',selOpt[i].value).text(selOpt[i].name);
            //    $selector.append($option);
            //}
            return $selector
        },
        initAttrPane:function(opt){
            var _this = this;
            var $paneClass,cls,type,clsStore,$divAttr,attrStore,$selAttr,parentStore;
            cls = opt.val;
            type = opt.type;
            clsStore = _this.searchClass(cls);
            $paneClass = $('#paneIot-' + type).html('').removeClass('on');
            if(!clsStore)return;
            $paneClass.append('<div class="className">' + clsStore.name + '</div>');
            parentStore = _this.searchClass(clsStore.parent);
            if(parentStore && parentStore.name) {
                $paneClass.append('<div class="classParentName">' + parentStore.name + '</div>');
            }
            $divAttr = $('<div class="divAttr">');
            for (var attr in clsStore.attrs) {
                attrStore = clsStore.attrs[attr];
                setAttr(attrStore, $divAttr);
                $paneClass.find('.className').after($divAttr);
            }
            if($paneClass.find('select').length > 0) {
                $paneClass.addClass('on');
            }
            function setAttr(attrStore,$divAttr){
                if (attrStore.filter){
                    $divAttr.append('<span class="label">' + attrStore.name +'</span>');
                    $selAttr = $('<select class="filterAttr">').addClass('attr').attr('filterMode',attrStore.filter.t);
                    if (attrStore.filter.t = 'enum'){
                        for (var attrOpt in attrStore.filter.opt){
                            $selAttr.append('<option value="' + attrOpt + '">' + attrStore.filter.opt[attrOpt] + '</option>')
                        }
                    }else if(attrStore.filter.t = 'range'){
                        for (var j = 0 ; j < attrStore.filter.opt.length; j++){
                            $selAttr.append('<option value="' + attrStore.filter.opt[j] + '">' + attrStore.filter.opt[j] + '</option>')
                        }
                    }
                    $divAttr.append($selAttr);
                }
            }
        },
        initSearch:function(){
            var _this = this;
            var $iptSearch = $('#paneIotSearch').find('input');
            $iptSearch.next().off('click').on('click',function(){
                if ($iptSearch.val() == '')return;
                $iptSearch.val('');
                clearSearch();
            });
            $iptSearch.on('propertychange input',function(e){
                if ($iptSearch.val() == '') {
                    clearSearch();
                }
            });
            $iptSearch.keyup(function(e){
                if (13 == e.keyCode) {
                    $iptSearch.blur();
                    var projId;
                    var selectNode = _this.tree.getSelectedNodes()[0];
                    if (!selectNode || !selectNode['projId']){
                        projId = _this.prevProjId?_this.prevProjId:_this.projectId;
                    }else{
                        var parentNode = selectNode.getParentNode();
                        while(parentNode) {
                            selectNode = parentNode;
                            parentNode = selectNode.getParentNode();
                        }
                        _this.prevProjId = selectNode['projId'];
                    }
                    var postData;
                    if ($iptSearch.val() == ''){
                        clearSearch();
                    }else {
                        postData = {
                            searchName:$iptSearch.val(),
                            projId:projId?projId:_this.projectId
                        };
                        if (!_this.opt.base.divideByProject)delete postData.projId;
                        WebAPI.post('/iot/fuzzysearch', postData).done(function (result) {
                            if(!result || !result.data)return;
                            _this.isSearch = true;
                            $.fn.zTree.destroy('paneIotData');
                            _this.store = {
                                projects:[],
                                groups:[],
                                things:[]
                            };
                            _this.tree = null;
                            for (var i = 0 ; i < result.data.length;i++){
                                result.data[i].pId = result.data[i]['_idPrt'];
                                _this.store[result.data[i].baseType].push(result.data[i])
                            }
                            for (var i = 0; i < _this.store.groups.length; i++) {
                                _this.store.groups[i].isParent = true;
                                //_this.store.groups[i].open = true;
                                _this.store.groups[i].baseType = 'groups';
                            }
                            for (var i = 0; i < _this.store.projects.length; i++) {
                                _this.store.projects[i].isParent = true;
                                //_this.store.projects[i].open = true;
                                _this.store.projects[i].baseType = 'projects';
                            }
                            for (var i = 0; i < _this.store.things.length; i++) {
                                _this.store.things[i].baseType = 'things';
                            }
                            _this.initTreePane(_this.store);
                        })
                    }
                }
            });

            function clearSearch(){
                var postData = {
                    parent: [],
                    projId:[_this.projectId]
                };
                if (!_this.opt.base.divideByProject)delete postData.projId;
                WebAPI.post('/iot/search', postData).done(function (result) {
                    if(!result )return;
                    _this.isSearch = false;
                    $.fn.zTree.destroy('paneIotData');
                    _this.store = {
                        projects:[],
                        groups:[],
                        things:[]
                    };
                    _this.tree = null;
                    _this.store = {
                        groups: result.groups,
                        projects: result.projects,
                        things: result.things
                    };
                    for (var i = 0; i < _this.store.groups.length; i++) {
                        _this.store.groups[i].isParent = true;
                        //_this.store.groups[i].open = true;
                        _this.store.groups[i].baseType = 'groups';
                    }
                    for (var i = 0; i < _this.store.projects.length; i++) {
                        _this.store.projects[i].isParent = true;
                        //_this.store.projects[i].open = true;
                        _this.store.projects[i].baseType = 'projects';
                    }
                    for (var i = 0; i < _this.store.things.length; i++) {
                        _this.store.things[i].baseType = 'things';
                    }
                    _this.initClassPane();
                    //_this.initClassDetail();
                    _this.initTreePane(_this.store);
                })
            }
        },
        searchName:function(name){
            var _this = this;
            for (var type in _this.store.class){
                for( var keyName in _this.store.class[type]){
                    if(keyName == name)return _this.store.class[type][keyName]
                }
            }
        },
        searchDeviceById:function(id,type){
            var _this = this;
            if(!id)return [];
            var arrDevice = [];
            var arrId = [];
            if(type){
                if (id instanceof Array) {
                    for (var i = 0 ; i < id.length; i++){
                        arrId[i] = {id:id[i],index:i}
                    }
                    for (var i = 0; i < _this.store[type].length; i++) {
                        for (var j = 0; j < arrId.length ;j++) {
                            if (_this.store[type][i]['_id'] == arrId[j].id) {
                                arrDevice[arrId[j].index] = _this.store[type][i];
                                arrId.splice(j,1);
                                break;
                            }
                        }
                    }
                }else{
                    for (var i = 0; i < _this.store[type].length; i++) {
                        if (_this.store[type][i]['_id'] == id) {
                            return [_this.store[type][i]]
                        }
                    }
                }
            }else{
                if (id instanceof Array) {
                    for (var i = 0 ; i < id.length; i++){
                        arrId[i] = {id:id[i],index:i}
                    }
                    for (var ele in _this.store) {
                        for (var i = 0; i < _this.store[ele].length; i++) {
                            for (var j = 0; j < arrId.length ;j++) {
                                if (_this.store[ele][i]['_id'] == arrId[j].id) {
                                    arrDevice[arrId[j].index] = _this.store[ele][i];
                                    arrId.splice(j,1);
                                    break;
                                }
                            }
                        }
                    }
                }else{
                    for (var ele in _this.store) {
                        for (var i = 0; i < _this.store[ele].length; i++) {
                            if (_this.store[ele][i]['_id'] == id) {
                                return [_this.store[ele][i]]
                            }
                        }
                    }
                }
            }
            return arrDevice;
        },
        searchClass:function(cls){
            var _this = this;
            for( var type in _this.dictClass) {
                for (var keyCls in _this.dictClass[type]) {
                    if (keyCls == cls)return _this.dictClass[type][keyCls]
                }
            }
        },
        initTreePane:function(opt,parentNode){
            var _this = this;
            if(_this.tree)return;
            _this.$paneTree =$('#paneIotData');
            _this.$paneTree.off('click');
            if(_this.opt.tree && _this.opt.tree.show){

                var setting = {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: '_id'
                        }
                    },
                    keep: {
                        leaf: true,
                        parent: true
                    },
                    check:{
                        enable: _this.opt.tree.check.enable
                    },
                    //async: {
                    //    enable:true,
                    //    contentType:'application/json',
                    //    diyParam: diyParam,
                    //    dataFilter:dataFilter,
                    //    url:'/iot/search'
                    //},
                    edit: {
                        enable: true,
                        drag:{
                            isCopy:false,
                            isMove:false
                        },
                        showRemoveBtn:false,
                        showRenameBtn:false
                    },
                    view: {
                        addDiyDom:addDiyDom,
                        addHoverDom:addHoverDom,
                        removeHoverDom:removeHoverDom,
                        dblClickExpand:false,
                        showIcon:true,
                        showLine:true
                    },
                    callback: {
                        //onRightClick: function (event, treeId, item) {

                        //},
                        //beforeExpand:function(event, treeId, treeNode){
                        //    _this.childAppend(treeNode);
                        //},
                        beforeRename:function(){
                            return false;
                        },
                        beforeRemove:function(){
                        },
                        beforeDrag:function(){
                            return false;
                        },
                        beforeAsync:function(){

                        },
                        onAsyncSuccess:function(){

                        },
                        onDblClick:function (event, treeId, treeNode){
                            if(!_this.opt.tree.event.dblClick)return;
                            _this.opt.tree.event.dblClick.call(_this, event, treeId, treeNode);
                        },
                        onClick: function (event, treeId, treeNode) {
                            //_this.childAppend(treeNode);
                            //return;
                            //if (!(event.target instanceof HTMLElement))return;
                            if(!_this.opt.tree.event.click)return;
                            var that = this;
                            var dblFlag = false;
                            var clkInterval;
                            if(typeof  treeNode.clickTime =='undefined'){
                                clkInterval = Infinity;
                            }else{
                                clkInterval = new Date() - treeNode.clickTime;
                            }
                            treeNode.clickTime = new Date();
                            $(event.target).on('click.judgeDbl',function(){
                                dblFlag = true;
                            });
                            var dblJudge = window.setInterval(function(){
                                $(event.target).off('click.judgeDbl');
                                window.clearInterval(dblJudge);
                                if(!dblFlag && clkInterval > 200) {
                                    if(_this.opt.tree.event.click.isDefault === false){
                                        _this.opt.tree.event.click.act.call(that, event, treeId, treeNode);
                                        return;
                                    }
                                    _this.childAppend(treeNode, function () {
                                        if (_this.opt.tree.event.click){
                                            if (!_this.opt.tree.event.click instanceof Array) {
                                                _this.opt.tree.event.click.call(that, event, treeId, treeNode);
                                            }else{
                                                for (var i = 0; i < _this.opt.tree.event.click.length ;i++){
                                                    if (_this.opt.tree.event.click[i].tar.toString().indexOf(treeNode.baseType) > -1 || _this.opt.tree.event.click[i].tar == 'all'){
                                                        _this.opt.tree.event.click[i].act.call(that, event, treeId, treeNode)
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    //_this.opt.tree.event.click.call(that, event, treeId, treeNode);
                                }
                            },200);
                        }
                    }
                };
                if (_this.opt.tree.extend){
                    $.extend(true,setting,setting,_this.opt.tree.extend)
                }
                var zNodes = _this.initTreeData(opt);
                _this.tree = $.fn.zTree.init(this.$paneTree, setting, zNodes);
                //if (_this.opt.tree.drag && _this.opt.tree.drag.enable){
                //    _this.$paneTree.attr('draggable',true);
                //    if (_this.opt.tree.drag.dragstart) {
                //        attachDragEvent('dragstart');
                //    }
                //    if (_this.opt.tree.drag.drop) {
                //        attachDragEvent('drop');
                //    }
                //}
                _this.$paneTree.on('click','.btnEdit',function(e){
                    e.stopPropagation();
                    var treeNode = _this.tree.getNodeByTId(e.target.parentNode.parentNode.id);
                    var parentNode = treeNode.getParentNode();
                    new CreateDeviceModal({
                        mode: 'edit',
                        baseType: treeNode.baseType,
                        filter: _this,
                        parentNode: parentNode,
                        treeNode: treeNode
                    });
                });
                _this.$paneTree.on('click','.btnDelete',function(e){
                    e.stopPropagation();
                    var treeNode = _this.tree.getNodeByTId(e.target.parentNode.parentNode.id);
                    infoBox.confirm('确认删除节点 ' + treeNode.name +' ? 注意子文件及文件夹也将被删除并不可恢复。',okCallback);
                    function okCallback() {
                        var postData = [{
                            'id': [treeNode['_id']],
                            'type': treeNode['baseType']
                        }];
                        WebAPI.post('/iot/delIotInfo', postData).done(function () {
                            var nodes = _this.tree.getNodesByParam('_id', $(e.target.parentNode.parentNode).attr('ptid'));
                            for (var i = 0; i < nodes.length; i++) {
                                _this.tree.removeNode(nodes[i]);
                            }
                            if (typeof _this.opt.tree.tool.delete == 'function') {
                                _this.opt.tree.tool.delete.call(_this, treeNode)
                            }
                        });
                    }
                });
                _this.$paneTree.on('click','.btnTemplate',function(e){
                    e.stopPropagation();
                    var treeNode = _this.tree.getNodeByTId(e.target.parentNode.id);
                    var strModalContent = new StringBuilder();
                    //strModalContent.append('<div class="modal fade">');
                    //strModalContent.append('   <div class="modal-dialog">');
                    //strModalContent.append('       <div class="modal-content">');
                    //strModalContent.append('           <div class="modal-header">');
                    //strModalContent.append('               <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
                    //strModalContent.append('               <h4 class="modal-title">Modal title</h4>');
                    //strModalContent.append('           </div>');
                    //strModalContent.append('           <div class="modal-body">');
                    strModalContent.append('               <iframe style="width:100%;height:100%;" name="ifram_factory" sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-modals" frameborder="0"></iframe>');
                    //strModalContent.append('           </div>');
                    //strModalContent.append('           <div class="modal-footer">');
                    //strModalContent.append('               <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>');
                    //strModalContent.append('               <button type="button" class="btn btn-primary">Save changes</button>');
                    //strModalContent.append('           </div>');
                    //strModalContent.append('       </div>');
                    //strModalContent.append('   </div>');
                    //strModalContent.append('</div>');
                    var $modalContent = $(strModalContent.toString());
                    var $modal = $('#templateModal');
                    $modal.find('.modal-content').append($modalContent);
                    $modal.modal('show');
                    $modal.off().on('shown.bs.modal',function(){
                        //WebAPI.get('/asset/getThingDetail/'+ treeNode['_id']).done(function(result){
                            var form, ipt;
                            //postData = {};
                            //for (var ele in treeNode.arrP){
                            //    postKey = _this.dictClass[treeNode.baseType][treeNode.type].attrs[ele].name;
                            //    if (postKey) {
                            //        postData[postKey] = treeNode.arrP[ele]
                            //    }
                            //}
                            //if (result.data) {
                                // 动态创建表单
                                // iframe 的 name 不能用大小写驼峰，否则 form 的 target 属性链接会失败
                                // 按照官方的说法，“iframe 需要一个明确的名称”
                                form = document.createElement('form');
                                form.action = '/factory/preview/8f54051d0011456903054765';
                                form.method = 'post';
                                form.target = 'ifram_factory';

                                ipt = document.createElement('input');
                                ipt.type = 'hidden';
                                ipt.name = 'params';
                                ipt.value = JSON.stringify(treeNode.arrP);

                                form.appendChild(ipt);
                                document.body.appendChild(form);
                                form.submit();
                                document.body.removeChild(form);
                            //}
                        });
                    //});
                    $modal.on('hidden.bs.modal',function(){
                        $modalContent.remove();
                    })
                });
                _this.$paneTree.on('click','.projects>.button.switch',function(e){
                    var $target = $(e.currentTarget);
                    var node = _this.tree.getNodeByTId($target.parent().attr('id'));
                    //node.open = !node.open;
                    _this.childAppend(node,function(){});
                    return false;
                });
                _this.$paneTree.on('click','.groups>.button.switch',function(e){
                    var $target = $(e.currentTarget);
                    var node = _this.tree.getNodeByTId($target.parent().attr('id'));
                    //node.open = !node.open;
                    _this.childAppend(node,function(){});
                    return false;
                });
                function diyParam(treeNode){
                    return {
                        parent: [{
                            id: treeNode['_id'],
                            type: treeNode['baseType']
                        }]
                    }
                }

                function dataFilter(treeId, parentNode, resultData){
                    for (var type in resultData.class) {
                        for (var cls in resultData.class[type]) {
                            _this.dictClass[type][cls] = resultData.class[type][cls]
                        }
                    }
                    _this.initClassPane();
                }
                function addDiyDom(treeId,treeNode){
                    var $target = $('#' + treeNode.tId);
                    $target.attr('ptId',treeNode['_id']);
                    $target.addClass(treeNode.baseType);
                    if (treeNode.baseType == 'groups' || treeNode.baseType == 'things') {
                    //    $target.append('\
                    //<span class="btnEdit btnTreeNode glyphicon glyphicon-edit"></span>\
                    //<span class="btnDelete btnTreeNode glyphicon glyphicon-remove-sign"></span>\
                    //<span class="btnTemplate btnTreeNode glyphicon glyphicon-comment"></span>\
                    //');
                        $target.children('a').append('\
                    <span class="btnDelete btnTreeNode glyphicon glyphicon-remove-sign"></span>\
                    <span class="btnEdit btnTreeNode glyphicon glyphicon-edit"></span>\
                    ');
                    }
                    if (_this.opt.tree.drag && _this.opt.tree.drag.enable){
                        $target.attr('draggable',true);
                        if (_this.opt.tree.drag.dragstart) {
                            attachDragEvent('dragstart',$target,treeNode);
                        }
                        if (_this.opt.tree.drag.dragend) {
                            attachDragEvent('dragend',$target.children('a'),treeNode);
                        }
                        if (_this.opt.tree.drag.drop) {
                            attachDragEvent('dragover',$target.children('a'),treeNode);
                            attachDragEvent('dragleave',$target.children('a'),treeNode);
                            attachDragEvent('drop',$target.children('a'),treeNode);
                        }
                    }
                    if (typeof _this.opt.tree.event.addDom == 'function'){
                        _this.opt.tree.event.addDom.call(_this,treeNode,$target);
                    }

                }
                function addHoverDom(treeId,treeNode){
                    if(treeNode.isParent)return;
                    var $target = $('#' + treeNode.tId);
                    $target.css({
                        'background-color': 'rgb(76, 100, 148)'
                    });
                    $target.children('a').css('color','black');
                }
                function removeHoverDom(treeId,treeNode){
                    if(treeNode.isParent)return;
                    var $target = $('#' + treeNode.tId);
                    $target.css({
                        'background-color':'transparent'
                    });
                    $target.children('a').css('color','inherit');
                }
                function attachDragEvent(type,target,treeNode){
                    if (type == 'dragover' || type== 'dragleave'){
                        target.on(type,function (e) {
                            e.preventDefault();
                            _this.opt.tree.drag[type] && _this.opt.tree.drag[type].call(_this,e,treeNode);
                        });
                        return ;
                    }
                    if (_this.opt.tree.drag[type]) {
                        if (_this.opt.tree.drag[type] instanceof Function){
                            target.on(type,function (e) {
                                e.preventDefault();
                                _this.opt.tree.drag[type].call(_this,e,treeNode);
                            });
                        }else if(_this.opt.tree.drag[type].act instanceof Function && _this.opt.tree.drag[type].tar == treeNode.baseType){
                            target.on(type,function (e) {
                                _this.opt.tree.drag[type].act.call(_this,e,treeNode);
                            });
                        }else if(_this.opt.tree.drag[type] instanceof Array){
                            _this.opt.tree.drag[type].forEach(function(event,i){
                                if (event.act instanceof Function && event.tar == treeNode.baseType) {
                                    target.on(type,function (e) {
                                        e.stopPropagation();
                                        event.act.call(_this, e, treeNode);
                                    });
                                }
                            })
                        }
                    }
                }
                //function attachDragEvent(type){
                //    if (_this.opt.tree.drag[type]) {
                //        if (_this.opt.tree.drag[type] instanceof Function){
                //            _this.$paneTree.on('dragstart', 'li', function (e) {
                //                var treeNode = _this.tree.getNodeByTId($(e.target).attr('id'));
                //                _this.opt.tree.drag[type].call(_this,e,treeNode);
                //            });
                //        }else if(_this.opt.tree.drag[type].act instanceof Function && _this.opt.tree.drag[type].tar){
                //            _this.$paneTree.on(type, _this.opt.tree.drag[type].tar == 'all'?null:'.'+ _this.opt.tree.drag[type].tar, function (e) {
                //                var treeNode = _this.tree.getNodeByTId($(e.target).attr('id'));
                //                _this.opt.tree.drag[type].act.call(_this,e,treeNode);
                //            });
                //        }else if(_this.opt.tree.drag[type] instanceof Array){
                //            _this.opt.tree.drag[type].forEach(function(event,i){
                //                if (event.act instanceof Function && event.tar) {
                //                    _this.$paneTree.on('dragstart', event.tar == 'all'?null:'.'+ event.tar, function (e) {
                //                        e.stopPropagation();
                //                        var treeNode = _this.tree.getNodeByTId($(e.currentTarget).attr('id'));
                //                        event.act.call(_this, e, treeNode);
                //                    });
                //                }
                //            })
                //        }
                //    }
                //}
            }
        },
        initTreeData: function (option) {
            var _this = this;
            if (!_this.tree) {
                var data = [];
                data = data.concat(this.store.projects);
                data = data.concat(this.store.groups);
                data = data.concat(this.store.things);
            }else{
                var root = _this.tree.getNodes();
                var data = _this.tree.transformToArray(root);
                for (var i = 0;i < data.length;i++){
                    if (data[i].baseType == option.type){
                        _this.tree.showNode(data[i]);
                        if (option.val == 'all'){
                            continue;
                        }else if(option.val =='none'){
                            //data[i].isHidden = true;
                            //_this.tree.updateNode(data[i]);
                            _this.tree.hideNode(data[i]);
                        }else if (data[i].type != option.val) {
                            //data[i].isHidden = true;
                            //_this.tree.updateNode(data[i]);
                            _this.tree.hideNode(data[i]);
                        }
                    }
                }
            }
            //var length;
            //if (option.type == 'groups') {
            //    if (option.val != 'all'){
            //        length = arrGroups.length;
            //        for (var i = 0; i < length;i++){
            //            if (arrGroups[i].type != option.val){
            //                arrGroups.splice(i,1);
            //                length--;
            //                i--
            //            }
            //        }
            //    }
            //}
            //else if (option.type == 'things') {
            //    if (option.val != 'all') {
            //        length = arrThings.length;
            //        for (var i = 0; i < length; i++) {
            //            if (arrThings[i].type != option.val) {
            //                arrThings.splice(i, 1);
            //                length--;
            //                i--
            //            }
            //        }
            //    }
            //} else if (option.type == 'projects'){
            //    if (option.val != 'all'){
            //        length = arrProjects.length;
            //        for (var i = 0; i < length;i++){
            //            if (arrProjects[i].type != option.val){
            //                arrProjects.splice(i,1);
            //                length--;
            //                i--
            //            }
            //        }
            //    }
            //}
            //data = data.concat(arrProjects);
            //data = data.concat(arrGroups);
            //data = data.concat(arrThings);
            if (typeof _this.opt.tree.data == 'function'){
                _this.opt.tree.data.call(_this,data)
            }
            return data;
        },
        getChildren:function(treeNode,func,opt){
            var _this = this;
            var postData = {
                parent: [{
                    id: treeNode['_id'],
                    type: treeNode['baseType']
                }]
            };
            return WebAPI.post('/iot/search', postData).done(function (resultData) {
                for (var type in resultData.class) {
                    for (var cls in resultData.class[type]) {
                        _this.dictClass[type][cls] = resultData.class[type][cls]
                    }
                }
                var tempArr = [];
                for (var ele in resultData) {
                    if (ele == 'class')continue;
                    if (typeof _this.opt.tree.data == 'function'){
                        _this.opt.tree.data.call(_this,resultData[ele],ele)
                    }
                    var flag;
                    for (var i = 0; i < resultData[ele].length; i++) {
                        for (var j = 0; j < _this.store[ele].length; j++) {
                            if (_this.store[ele][j]['_id'] == resultData[ele][i]['_id']) {
                                if (ele == 'groups' && !resultData[ele][i].pId) {
                                    resultData[ele][i].pId = resultData[ele][i]['_idProj'];
                                }
                                if (_this.store[ele][j]['pId'] == resultData[ele][i]['pId']) {
                                    flag = true;
                                } else {
                                    if (treeNode.children) {
                                        for (var k = 0; k < treeNode.children.length; k++) {
                                            if (resultData[ele][i]['_id'] == treeNode.children[k]['_id']) {
                                                flag = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                //_this.store[ele][j] = resultData[ele][i];
                                break;
                            }
                        }
                        if (resultData[ele][i].icon) {
                            resultData[ele][i].iconSkin = 'iconfont '+resultData[ele][i].icon;
                            delete resultData[ele][i].icon;
                        }
                                if (_this.opt.tree.base.expandReload || !flag) {
                                    if (ele == 'groups' || ele == 'projects') {
                                        resultData[ele][i].isParent = true;
                                    }
                                    resultData[ele][i].baseType = ele;
                                    //resultData[ele][i].open = true;
                                    if (!flag) {
                                        _this.store[ele].push(resultData[ele][i]);
                                    }
                                    tempArr.push(resultData[ele][i]);
                                }
                    }
                }
                if(_this.opt.tree.base.expandReload){
                    _this.tree.removeChildNodes(treeNode);
                }
                if (tempArr.length == 0) {
                    func(resultData);
                    //_this.tree.expandNode(treeNode);
                    return;
                }
                if (!opt || opt.add !== false){
                    _this.tree.addNodes(treeNode, tempArr, true);
                }
                if(!opt || opt.expand !== false){
                    _this.tree.expandNode(treeNode,null,false,true,true);
                }
                //_this.tree.expandNode(treeNode);
                _this.initClassPane();
                func(resultData);
                //_this.initTreePane(_this.store,treeNode)
            })
        },
        childAppend:function(treeNode,func){
            var _this = this;
            if(treeNode.open){
                _this.tree.expandNode(treeNode,null,false,true,true);
                return;
            }else {
                if(treeNode.baseType == 'things') {
                    func();
                    _this.tree.expandNode(treeNode,null,false,true,true);
                    return;
                }else {
                    var postData = {
                        parent: [{
                            id: treeNode['_id'],
                            type: treeNode['baseType']
                        }]
                    };
                    WebAPI.post('/iot/search', postData).done(function (resultData) {
                        for (var type in resultData.class) {
                            for (var cls in resultData.class[type]) {
                                _this.dictClass[type][cls] = resultData.class[type][cls]
                            }
                        }
                        var tempArr = [];
                        for (var ele in resultData) {
                            if (ele == 'class')continue;
                            if (typeof _this.opt.tree.data == 'function'){
                                _this.opt.tree.data.call(_this,resultData[ele],ele)
                            }
                            var flag;
                            for (var i = 0; i < resultData[ele].length; i++) {
                                for (var j = 0; j < _this.store[ele].length; j++) {
                                    if (_this.store[ele][j]['_id'] == resultData[ele][i]['_id']) {
                                        if (ele == 'groups' && !resultData[ele][i].pId) {
                                            resultData[ele][i].pId = resultData[ele][i]['_idProj'];
                                        }
                                        if (_this.store[ele][j]['pId'] == resultData[ele][i]['pId']) {
                                            flag = true;
                                        } else {
                                            if (treeNode.children) {
                                                for (var k = 0; k < treeNode.children.length; k++) {
                                                    if (resultData[ele][i]['_id'] == treeNode.children[k]['_id']) {
                                                        flag = true;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        _this.store[ele][j] = resultData[ele][i];
                                        break;
                                    }
                                }
                                if (_this.opt.tree.base.expandReload || !flag) {
                                    if (ele == 'groups' || ele == 'projects') {
                                        resultData[ele][i].isParent = true;
                                    }
                                    resultData[ele][i].baseType = ele;
                                    //resultData[ele][i].open = true;
                                    if (!flag) {
                                        _this.store[ele].push(resultData[ele][i]);
                                    }
                                    tempArr.push(resultData[ele][i]);
                                }
                            }
                        }
                        if(_this.opt.tree.base.expandReload){
                            _this.tree.removeChildNodes(treeNode);
                        }
                        if (tempArr.length == 0) {
                            func();
                            _this.tree.expandNode(treeNode,null,false,true,true);
                            return;
                        }
                        _this.tree.addNodes(treeNode, tempArr, true);
                        for (var base in _this.showStatus){
                            _this.initTreeData({'type':base,'val':_this.showStatus[base]});
                        }
                        _this.tree.expandNode(treeNode,null,false,true,true);
                        _this.initClassPane();
                        func();
                        //_this.initTreePane(_this.store,treeNode)
                    })
                }
            }
        },
        initAddPane:function(){
            var _this = this;
            _this.$paneAdd = $('#paneIotAdd');
            var $btnAdd = $('.btnAddEle');
            $btnAdd.click(function(e){
                var parentNode = _this.tree.getSelectedNodes()[0];
                var callBack;
                if (typeof _this.opt.tree.tool.beforeAdd == 'function'){
                    callBack = _this.opt.tree.tool.beforeAdd.call(_this,parentNode)
                }
                if (typeof _this.opt.tree.tool.beforeAdd.act == 'function'){
                    callBack = _this.opt.tree.tool.beforeAdd.act.call(_this,parentNode)
                }
                if(callBack && callBack.parentNode){
                    parentNode = callBack.parentNode;
                }
                //if (_this.opt.tree.tool.beforeAdd.default || typeof _this.opt.tree.tool.beforeAdd == 'function') {
                    if (parentNode.length == 0) {
                        alert('请选择父节点');
                        return;
                    }
                    if(callBack && callBack.isForbid){
                        alert(callBack.msg);
                        return;
                    }
                    new CreateDeviceModal({
                        mode: 'add',
                        baseType: $(e.currentTarget).attr('typeAdd'),
                        filter: _this,
                        parentNode: parentNode
                    });
                //}
            });
        }
    };
    return HierFilter;
})();

var CreateDeviceModal = (function () {
    var _this;

    function CreateDeviceModal(opt) {
        _this = this;
        this.devices = null;
        this.names = null;
        this.type = null;
        this.mode = opt.mode;
        this.baseType = opt.baseType?opt.baseType:undefined;
        this.filter = opt.filter?opt.filter:undefined;
        this.parentNode = opt.parentNode;
        this.treeNode = opt.treeNode;
        this.group = [];
        this.prefix = null;
        this.batch = null; //批量
        this.batchErr = {
            name:false,
            prefix:false
        };
        this.show();    }

    CreateDeviceModal.prototype = {
        show: function () {
            var _this = this;
            if(_this.mode == 'add' && _this.baseType =='things' && _this.parentNode.baseType == 'projects'){
                alert('项目下不支持直接增加设备');
                return;
            }
            WebAPI.get("/static/scripts/iot/config/addThing.html").done(function (rsHtml) {
                _this.content = rsHtml;
                _this.$createDev = $("#modalIotCfg");
                _this.$createDev.find("#ctnIotCfg").html(rsHtml);
                if(_this.mode == 'add') {
                    _this.$createDev.find('.modal-title').text('添加' + _this.baseType);
                }else{
                    _this.$createDev.find('.modal-title').text('修改' + _this.baseType);
                }
                _this.$createDev.modal({backdrop: 'static', keyboard: false }); //closing modal by 'escape' keydown and click on outside are not allowed                _this.init();
                _this.init();
            });
        },
        init: function () {
            var _this = this;
            _this.names = [];
            _this.devices = [];
            _this.prefix = [];
            _this.type = "";
            _this.batch = false;
            _this.$createDev.modal('show');
            _this.$innerSLD = $("#createModalSld");
            _this.closeBtn = document.getElementById("closeBtn"); //$("$closeBtn")
            _this.skipBtn = document.getElementById("skipBtn"); //$("#skipBtn")
            _this.nextBtn = document.getElementById("nextBtn");//$("#nextBtn")
            _this.confirmBtn = document.getElementById("confirmBtn");
            _this.nameInput = document.getElementById("nameInput");
            _this.nameConfigInput = document.getElementById("batchNameArea");
            _this.prefixInput = document.getElementById("prefixInput");
            _this.typeList = document.getElementById("typeList");
            _this.groupList = document.getElementById("addedGroup");
            _this.bindDataGroup = document.getElementById("bindDataGroup");

            _this.typeDataSource = null;
            if (_this.parentNode.baseType == 'things') {
                _this.parentNode = _this.parentNode.getParentNode();
            }
            _this.initTypeList();
            _this.initParentType();
            if (_this.mode == 'edit'){
                _this.initEditMode();
            }
            _this.attachEvent();
        },
        attachEvent: function () {
            //setup onclick or onchange events
            var _this = this;
            var btnAddParent = document.getElementById("btnAddParent");
            btnAddParent.addEventListener("click", _this.parentAdd, false);
            _this.closeBtn.onclick = function () {
                _this.closeModal(false);
            };
            _this.confirmBtn.onclick = function () {
                _this.closeModal(true);
            };
            _this.nextBtn.onclick = function () {
                var currentIndex = _this.$innerSLD.find('.active').index();
                _this.checkValid(currentIndex);
            };
            _this.$innerSLD.on('slide.bs.carousel', _this.onCarouselMove);

            $(".batchBtn").on("change", function () {
                var batch = $(this).attr("data-batch");
                if (batch === "true") {
                    $("#divNameBatch").removeClass("hide");
                    $("#divPrefixBatch").removeClass("hide");
                    _this.batch = true;
                } else {
                    $("#divNameBatch").addClass("hide");
                    $("#divPrefixBatch").addClass("hide");
                    _this.batch = false;
                }
            });
        },
        closeModal: function (flag) {
            //flag 判断是否中途退出
            var _this = this;
            if (flag) {
                if(_this.mode == 'add'){
                    _this.addModeClose();
                }else if(_this.mode == 'edit'){
                    _this.editModeClose();
                }
                //window.alert("您已成功创建设备");
                _this.devices = null;
                _this.name = null;
                _this.type = null;
                _this.group = [];
                _this.prefix = null;
                _this.batch = false; //批量

                _this.$createDev.modal('hide');
                _this.$createDev.find("#dialogContent").empty();
            } else {
                var message = "确定要中途退出吗？";
                infoBox.confirm(message, callback);
                function callback(){
                    _this.devices = null;
                    _this.names = null;
                    _this.type = null;
                    _this.group = [];
                    _this.prefix = null;
                    _this.batch = false; //批量
                    _this.$createDev.modal('hide');
                    _this.$createDev.find("#dialogContent").empty();
                }
            }
        },
        editModeClose:function(){
            var postData = [];
            for (var i = 0; i < _this.devices.length; i++) {
                postData.push({
                    '_id':_this.treeNode['_id'],
                    name:_this.devices[i].name,
                    arrP:_this.devices[i].arrP,
                    _idProj:_this.parentNode.baseType == 'projects'?_this.parentNode['_id']:_this.parentNode['_idProj'],
                    projId:_this.parentNode.projId,
                    pId:_this.parentNode.baseType == 'projects'?undefined:_this.pId,
                    path:null,
                    prefix:_this.devices[i].prefix,
                    type:_this.type,
                    weight:0,
                    baseType:_this.baseType
                })
            }
            WebAPI.post('/iot/setIotInfo', postData).done(function (result) {
                if (result.data && result.data.length == 0)return;
                $.extend(true,_this.treeNode,postData[0]);
                _this.filter.tree.updateNode(_this.treeNode);
                for (var  i = 0 ; i < _this.filter.store[_this.treeNode['baseType']].length; i++){
                    if (_this.filter.store[_this.treeNode['baseType']][i]['_id'] == _this.treeNode['_id']){
                        for (var ele in _this.filter.store[_this.treeNode['baseType']][i]){
                            _this.filter.store[_this.treeNode['baseType']][i][ele] = _this.treeNode[ele]
                        }
                        break;
                    }
                }
                var func;
                if (typeof _this.filter.opt.tree.tool.edit == 'function'){
                    func = _this.filter.opt.tree.tool.edit;
                }else if(typeof _this.filter.opt.tree.tool.edit.act == 'function'){
                    func = _this.filter.opt.tree.tool.edit.act;
                }else{
                    return;
                }
                if ( _this.mode == 'edit'){
                    func.call(_this.filter,_this.treeNode)
                }
            });
        },
        addModeClose:function(){
            var postData = [];
            for (var i = 0; i < _this.devices.length; i++) {
                postData.push({
                    name:_this.devices[i].name,
                    arrP:_this.devices[i].arrP,
                    _idProj:_this.parentNode.baseType == 'projects'?_this.parentNode['_id']:_this.parentNode['_idProj'],
                    projId:_this.parentNode.projId,
                    pId:_this.parentNode.baseType == 'projects'?undefined:_this.pId,
                    path:null,
                    prefix:_this.devices[i].prefix,
                    type:_this.type,
                    weight:0,
                    baseType:_this.baseType
                })
            }
            WebAPI.post('/iot/setIotInfo', postData).done(function (result) {
                if (result.data && result.data.length == 0)return;
                postData.forEach(function (val, index) {
                    val['_id'] = result.data[index];
                    if(_this.baseType == 'groups'){
                        val.isParent = true;
                    }
                });
                var arrParent = [];
                var arrNodes = [];
                var parent;
                if (_this.pId instanceof Array) {
                    arrParent.push(_this.parentNode);
                    _this.filter.tree.addNodes(_this.parentNode, postData);
                    for (var i = 0; i < _this.pId.length; i++) {
                        if(_this.parentNode['_id'] == _this.pId[i])continue;
                        parent = _this.filter.tree.getNodeByParam('_id', _this.pId[i]);
                        arrParent.push(parent);
                        _this.filter.tree.addNodes(parent, postData);
                    }
                } else {
                    _this.filter.tree.addNodes(_this.parentNode, postData);
                    arrParent.push(_this.parentNode);
                }
                _this.filter.store[_this.baseType] = _this.filter.store[_this.baseType].concat(postData);
                var func;
                if (typeof _this.filter.opt.tree.tool.add == 'function'){
                    func = _this.filter.opt.tree.tool.add;
                }else if(typeof _this.filter.opt.tree.tool.add.act == 'function'){
                    func = _this.filter.opt.tree.tool.add.act;
                }else{
                    return;
                }
                for (var i = 0 ;i < postData.length ;i++){
                    arrNodes.push(_this.filter.tree.getNodeByParam('_id', postData[i]['_id']))
                }
                func.call(_this.filter,arrParent,arrNodes)
            });
        },
        initEditMode:function(){
            $('#divBatch').hide();
            $('#nameInput').val(_this.treeNode.name);
            $('#prefixInput').val(_this.treeNode.prefix)
        },
        createDevice: function(){            //create objects and add values
            var _this = this;
            var typeProp;
            for (var i = 0, len = _this.names.length; i < len; i++) {
                var obj = {};
                obj.name = _this.names[i];
                obj.type = _this.type;
                if (_this.prefix && _this.prefix[i]) {
                    obj.prefix = _this.prefix[i];
                } else {
                    obj.prefix = '';
                }
                obj.attrs = []; //containing the fullName, cnName, id and value of binddata
                obj.arrP = {};
                typeProp = _this.typeDataSource[_this.type];
                for (var attr in typeProp['attrs']) {
                    if (typeProp['attrs'].hasOwnProperty(attr)) {
                        var att = {};
                        att['name'] = attr;
                        att["fullName"] = obj.prefix + attr;
                        att["cnName"] = typeProp['attrs'][attr]["name"];
                        att["value"] = '--';
                        att["id"] = null;
                        obj["attrs"].push(att);
                    }
                }
                _this.devices.push(obj);
            }
        },
        updateDevice: function () {
            var _this = this;
            //update devices' info if added
        },
        initTypeList: function () {
            var _this = this;
            var arrHtml = ["<option value='-1'>请选择</option>"];
            var $typeList = $("#typeList");
            var clsList = [];
            _this.typeDataSource = _this.filter.dictClass[_this.baseType];
            //WebAPI.get('/iot/getClassFamily/' + _this.baseType.slice(0, -1) + '/cn').done(function (result) {
            //    if (result) {
            //        _this.typeDataSource = result;
            var baseType = _this.baseType.substring(0,_this.baseType.length - 1);
            baseType = baseType?baseType:_this.treeNode.baseType.substring(0,_this.treeNode.baseType -1);
            WebAPI.get('/iot/getClassFamilyByProjId/' + _this.parentNode.getPath()[0]['_id'] +'/' + baseType + '/cn').done(function(result){
                if (!result || $.isEmptyObject(result)){
                    clsList = _this.typeDataSource;
                }else{
                    clsList = result;
                }
                for (var obj in clsList) {
                    if (clsList.hasOwnProperty(obj)) {
                        var name = clsList[obj]["name"];
                        if(obj == 'Thing' || obj == 'Group'){
                            arrHtml.push("<option selected value='" + obj + "'>" + name + "</option>");
                        }else {
                            arrHtml.push("<option value='" + obj + "'>" + name + "</option>");
                        }
                    }
                }
                $typeList.html(arrHtml.join(''));
                if (_this.mode == 'edit') {
                    $('#typeList').val(_this.treeNode.type);
                }
                    //} else {
                    //    console.log("type list is null");
                    //}
                //});
            });
        },
        initParentType: function () {
            var _this = this;
            var arrHtml = ['<option value="-1">全部</option>'];
            var $parentTypeList = $("#parentTypeList");
            var $parentList = $('.parentList');

            //init subGroupList
            if (_this.baseType == 'groups'){
                $parentList.html('<option value="'+ _this.parentNode['_id'] +'">' + _this.parentNode.name + '</option>');
                $parentList.attr("disabled","disabled");
            }else {
                $parentList.html(arrHtml.join(''));
                $('#btnAddParent').show();
            }
            //init GroupList
            //WebAPI.get('/iot/getClassFamily/' + _this.parentNode.baseType.slice(0, -1) + '/cn').done(function (result) {
            //    if (result) {
                    _this.groupDataSource = _this.filter.dictClass[_this.parentNode.baseType];
                    if (_this.baseType == "groups" && _this.groupDataSource[_this.parentNode.type]) {
                        $parentTypeList.html('<option value="' + _this.parentNode.type + '">' + _this.groupDataSource[_this.parentNode.type].name + '</option>')
                            .attr('disabled', 'disabled');
                        return;
                    }
                    for (var obj in _this.groupDataSource) {
                        if (_this.groupDataSource.hasOwnProperty(obj)) {
                            var name = _this.groupDataSource[obj]["name"];
                            arrHtml.push("<option value='" + obj + "'>" + name + "</option>");
                        }
                    }
                    var arrParentList = ['<option value="-1">请选择</option>'];
                    for (var i = 0; i < _this.filter.store.groups.length; i++) {
                        if (_this.filter.store.groups[i]['_id'] == _this.parentNode['_id']) {
                            $parentList.val(_this.parentNode['_id'])
                        }
                        arrParentList.push('<option value="' + _this.filter.store.groups[i]['_id'] + '">' + _this.filter.store.groups[i].name + '</option>')
                    }
                    $parentList.html(arrParentList.join(''));
                    $parentTypeList.html(arrHtml.join(''));
                    if(_this.mode == 'add'){
                        $parentList.val(_this.parentNode['_id']);
                    } else if(_this.mode == 'edit'){
                        if(typeof _this.treeNode.pId =='string'){
                            $('.parentList').eq(0).val(_this.treeNode.pId)
                        }else if(_this.treeNode.pId instanceof Array){
                            $('.parentList').eq(0).val(_this.treeNode.pId[0]);
                            for (var i = 1; i < _this.treeNode.pId.length; i++){
                                _this.parentAdd().val(_this.treeNode.pId[i])
                            }
                        }
                    }
                //}else {
            //        console.log("type list is null");
            //    }
            //});
            $parentTypeList.on("change", function () {
                if (_this.baseType == 'groups')return;
                var selectedOpt = $("#parentTypeList option:selected").attr("value");
                _this.getParentList(selectedOpt);
            });
        },
        getParentList: function (val) {
            var _this = this;
            var arrHtml = ["<option value='-1'>请选择</option>"];
            var $parentList = $('.parentList');
            for (var i = 0; i < _this.filter.store.groups.length; i++) {
                if (val == -1 || _this.filter.store.groups[i].type == val) {
                    if (_this.filter.store.groups[i]['_id'] == _this.parentNode['_id']) {
                        $parentList.val(_this.parentNode['_id'])
                    }
                    arrHtml.push('<option value="' + _this.filter.store.groups[i]['_id'] + '">' + _this.filter.store.groups[i].name + '</option>')
                } else {

                }
            }
            $parentList.html(arrHtml.join(""));
        },
        parentAdd: function () {
            var $divParentList = $($('.divParentList')[0].outerHTML);
            $('#boxParentList').append($divParentList);
            return $divParentList;
        },
        //getSubGroupList: function(val){
        //    var _this = this;
        //    var arrHtml = ["<option value='-1'>请选择</option>"];
        //    var $subGroupList = $("#subGroupList");
        //    if(val !== '-1'){
        //        var data = _this.groupDataSource[val]["attrs"];
        //        if(Object.keys(data).length > 0){
        //            for(var obj in data){
        //                if(data.hasOwnProperty(obj)){
        //                    var name = data[obj]["name"];
        //                    arrHtml.push("<option text='"+name+"' value='"+obj+"'>"+name+"</option>");
        //                }
        //            }
        //            $subGroupList.html(arrHtml.join(""));
        //            $subGroupList.removeAttr("disabled");
        //        }else{
        //            $subGroupList.html(arrHtml.join(""));
        //            $subGroupList.attr("disabled", "disabled");
        //        }
        //    }else{
        //        $subGroupList.html(arrHtml.join(""));
        //        $subGroupList.attr("disabled", "disabled");
        //    }
        //},
        generateName: function () {
            var _this = this;
            var input = _this.nameInput.value.trim();
            var names = [];
            if (_this.batch) {
                try {
                    var config = $("#batchNameArea").val().trim();//if the input is a valid JSON string or need to convert to a valid one
                    config = config.replace((/([\w]+)(:)/g), "\"$1\"$2"); //add "" before : if doesnt exist
                    config = config.replace((/'/g), "\"");  //replace '' with ""
                    if (config == '') {
                        alert('名称批量设置为空！');
                        return names
                    } else {
                        var nameConfig = JSON.parse(config);
                        for (var item in nameConfig) {
                            if (nameConfig.hasOwnProperty(item)) {
                                var reg = new RegExp('<#' + item + '#>', 'g');
                                if (Object.prototype.toString.call(nameConfig[item]).slice() === '[object Array]') {
                                    //confing in array
                                    for (var j = 0; j < nameConfig[item].length; j++) {
                                        if (names.length !== nameConfig[item].length) {
                                            names.push(input.replace(reg, nameConfig[item][j]));
                                        } else {
                                            names[j] = names[j].replace(reg, nameConfig[item][j]);
                                        }
                                    }
                                } else {
                                    //config in obj
                                    var min = parseInt(nameConfig[item]["min"], 10);
                                    var max = parseInt(nameConfig[item]["max"], 10);
                                    var step = parseInt(nameConfig[item]["step"], 10) || 1;
                                    for (var k = 0; k < max - min + 1; k++) {
                                        if (names.length !== max - min + 1) {
                                            names.push(input.replace(reg, k + min));
                                        } else {
                                            console.log(typeof names[k]);
                                            names[k] = names[k].replace(reg, k * step + min);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                catch(e){
                    _this.batchErr.name = true;
                }
            } else {
                names.push(input);
            }
            return names;
        },
        generatePrefix: function () {
            //generate prefix (default as names)
            var _this = this;
            var input = _this.prefixInput.value.trim();
            var prefix = [];
            if (_this.batch) {
                try {
                    if (input === '' || input.length === 0) {
                        //if the user hasn't input the prefix then the prefix will be the same as names with '_' behind
                        for (var i = 0; i < _this.names.length; i++) {
                            //var name = _this.names[i];
                            //name += (name.slice(-1) === "_") ? "" : "_";
                            prefix.push('');
                        }
                    } else {
                        //if the prefixInput is filled
                        var config = $("#batchPrefixArea").val().trim();//if the input is a valid JSON string or need to convert to a valid one
                        config = config.replace((/([\w]+)(:)/g), "\"$1\"$2"); //add "" before : if doesnt exist
                        config = config.replace((/'/g), "\"");  //replace '' with ""
                        if (config == '') {
                            alert('前缀批量设置为空！');
                            return prefix
                        }
                        var prefixConfig = JSON.parse(config);
                        for (var item in prefixConfig) {
                            if (prefixConfig.hasOwnProperty(item)) {
                                var reg = new RegExp('<#' + item + '#>', 'g');
                                if (Object.prototype.toString.call(prefixConfig[item]).slice() === '[object Array]') {
                                    //confing in array
                                    var pre;
                                    for (var j = 0; j < prefixConfig[item].length; j++) {
                                        if (prefix.length !== prefixConfig[item].length) {
                                            pre = input.replace(reg, prefixConfig[item][j]);
                                            //pre += (pre.slice(-1) === "_") ? "" : "_";
                                            prefix.push(pre);
                                        } else {
                                            pre = prefix[j].replace(reg, prefixConfig[item][j]);
                                            //pre += (pre.slice(-1) === "_") ? "" : "_";
                                            prefix[j] = pre;
                                        }
                                    }
                                } else {
                                    //config in obj
                                    var min = parseInt(prefixConfig[item]["min"], 10);
                                    var max = parseInt(prefixConfig[item]["max"], 10);
                                    //var step = parseInt(prefixConfig[item]["step"],10) || 1 ;
                                    for (var k = 0; k < max - min + 1; k++) {
                                        if (prefix.length !== max - min + 1) {
                                            prefix.push(input.replace(reg, k + min));
                                        } else {
                                            console.log(typeof prefix[k]);
                                            prefix[k] = prefix[k].replace(reg, k + min);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }catch(e){
                    _this.batchErr.prefix = true;
                }
            } else {
                if (input === '' || input.length === 0) {
                    //if the user hasn't input the prefix then the prefix will be the same as names with '_' behind
                    //    for(var i=0;i<_this.names.length;i++){
                    //        var name = _this.names[i];
                    //        name += (name.slice(-1) === "_")? "":"_";
                    //        prefix.push(name);
                    //    }
                    prefix.push('');
                } else {
                    //if the prefixInput is filled
                    //input += (input.slice(-1) === "_")? "":"_";
                    prefix.push(input);
                }
            }
            return prefix;
        },
        generatePId: function () {
            var $parentList = $('.parentList');
            var pId = {};
            var arrPId = [];
            pId[_this.parentNode['_id']] = true;
            for (var i = 0; i < $parentList.length; i++) {
                if ($parentList.eq(i).val() && $parentList.eq(i).val() != '-1') {
                    pId[$parentList.eq(i).val()] = true
                }
            }
            for (var ele in pId) {
                arrPId.push(ele)
            }
            if (arrPId.length == 1)arrPId = arrPId.toString();
            return arrPId;
        },
        addGroup: function () {
            var _this = this;
            var groupList = document.getElementById("groupList"),
                subGroupList = document.getElementById("subGroupList"),
                group = groupList.options[groupList.selectedIndex].value,
                subGroup = subGroupList.options[subGroupList.selectedIndex].value,
                subGroupName = subGroupList.options[subGroupList.selectedIndex].text;
            //not the the default option    
            if (group !== "-1" && subGroup !== "-1") {
                var addedGroup = document.getElementById("addedGroup");
                var div = document.createElement("div"),
                    name = document.createElement("span"),
                    rmBtn = document.createElement("div"),
                    icon = document.createElement("span");

                div.className = "col-sm-3 btn";
                div.setAttribute("data-group", group);
                div.setAttribute("data-subgroup", subGroup);
                div.setAttribute("data-name", subGroupName);

                name.innerHTML = subGroupName;
                icon.className = "glyphicon glyphicon-minus";

                rmBtn.appendChild(icon);
                rmBtn.style.float = "right";

                div.appendChild(name);
                div.appendChild(rmBtn);
                addedGroup.appendChild(div);

                if (addedGroup.classList.contains("hide")) {
                    addedGroup.classList.remove("hide");
                }
                rmBtn.onclick = function (e) {
                    var addedGroup = document.getElementById("addedGroup"),
                        currentRow = e.target.parentElement.parentElement;//e.target ==> <span>
                    addedGroup.removeChild(currentRow);
                    if (addedGroup.childElementCount === 0) {
                        addedGroup.classList.add("hide");
                    }
                }
            }
        },
        removeGroup: function (e) {
            //console.log("remove");
            var addedGroup = document.getElementById("addedGroup"),
                currentRow = e.parentNode;
            addedGroup.removeChild(currentRow);
            if (addedGroup.childElementCount === 0) {
                addedGroup.classList.add("hide");
            }
        },
        getAddedGroup: function () {
            //groups in obj
            var _this = this;
            var arr = [];
            var groupRow = document.getElementById("addedGroup").childNodes;
            for (var i = 0; i < groupRow.length; i++) {
                if (groupRow[i].nodeName.toLowerCase() == 'div' && groupRow[i].hasAttribute("data-group")) {
                    var g = {};
                    g.group = groupRow[i].getAttribute("data-group");
                    g.subGroup = groupRow[i].getAttribute("data-subGroup");
                    g.name = groupRow[i].getAttribute("data-name");
                    arr.push(g);
                }
            }
            return arr;
        },
        getBindDataSource: function () {
            var _this = this;

            _this.devices.forEach(function (val, index) {
                var device = val;
                var p = device.prefix;
                var attrs = device.attrs;
                var arrP = device.arrP;
                WebAPI.get("/point_tool/searchCloudPoint/" + _this.parentNode.projId + "/" + p + "/").done(function (result) {
                    if (result.success) {
                        var data = result.data["pointTable"];
                        if (data.length == 0){
                            _this.initBindData(device);
                            return;
                        }
                        var idGroup = [];
                        for (var n = 0, len = data.length; n < len; n++) {
                            idGroup.push(data[n]._id);
                        }
                        //console.log(_this.devices[i].attrs);
                        for (var j = 0; j < attrs.length; j++) {
                            for (var k = 0; k < data.length; k++) {
                                if (attrs[j]["fullName"] === data[k]["value"]) {
                                    attrs[j]["id"] = data[k]["_id"];
                                    arrP[attrs[j]["name"]] = data[k]["_id"];
                                }
                            }
                        }
                        var postData = {"dsItemIds": idGroup};
                        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData).done(function (result) {
                            if (result.dsItemList && result.dsItemList.length > 0) {
                                var d = result["dsItemList"];
                                for (var l = 0; l < attrs.length; l++) {
                                    for (var m = 0; m < d.length; m++) {
                                        if (attrs[l]["id"] === d[m]["dsItemId"]) {
                                            attrs[l]["value"] = d[m]["data"];
                                        }
                                    }
                                }
                            } else {
                                console.log("the data of bind point is not loaded");
                            }
                            _this.initBindData(device);
                        });
                    } else {
                        console.log("the data of prefix attrs is not loaded");
                    }
                }).fail(function(){
                    _this.initBindData(device);
                });
            })
        },
        initBindData: function (device) {
            var _this = this;
            var names = _this.names;
            var frag = document.createDocumentFragment();
            //for(var i=0,len=_this.devices.length;i<len;i++){
            var name = document.createElement("label"),
                wrap = document.createElement("div"),
                container = document.createElement("div");

            wrap.className = "form-group row";
            container.className = "container-fluid";
            container.setAttribute("data-name", device.name);
            name.className = "text-center col-sm-12 form-control-label";
            name.innerHTML = "名称(Name)：" + device.name;
            wrap.appendChild(name);
            container.appendChild(wrap);

            for (var k = 0, leng = device.attrs.length; k < leng; k++) {
                var div = document.createElement("div"),
                    lab = document.createElement("label"),
                    cnlab = document.createElement("label"),
                    btn = document.createElement("div");
                // span = document.createElement("span");

                div.className = "form-group row";
                lab.className = "text-center col-sm-4 form-control-label";
                cnlab.className = "text-center col-sm-4 form-control-label";
                btn.className = "btn text-center col-sm-3";
                // span.className = "glyphicon glyphicon-plus";

                div.id = device.attrs[k]["id"];
                lab.innerHTML = device.attrs[k]["fullName"];
                cnlab.innerHTML = device.attrs[k]["cnName"];
                btn.innerHTML = device.attrs[k]["value"];

                div.appendChild(lab);
                div.appendChild(cnlab);
                div.appendChild(btn);

                container.appendChild(div);
            }
            frag.appendChild(container);
            //}
            _this.bindDataGroup.appendChild(frag);
        },
        generateFullBindData: function () {
            var _this = this;
            var arr = [];
            //_this.prefix += (_this.prefix.slice(-1) === "_")? "":"_";
            for (var i = 0; i < _this.devices.length; i++) {
                for (var attr in _this.type["attrs"]) {
                    if (_this.type["attrs"].hasOwnProperty(attr)) {
                        var obj = {};
                        obj["fullName"] = _this.devices[i]["prefix"] + attr;
                        obj["cnName"] = _this.type["attrs"][attr]["name"];
                        obj["value"] = '--';
                        obj["id"] = null;
                        arr.push(obj);
                        _this.devices[i]["attrs"].push(obj);
                    }
                }
            }
            return arr;
        },
        onCarouselMove: function () {
            var _this = this;
            var currentIndex = $(this).find('.active').index() + 1;
            if (currentIndex !== 1) {
                //$("#skipBtn").removeAttr("disabled");
            } else {
                //$("#skipBtn").attr("disabled", "disabled").addClass("hide");
                $("#nextBtn").hide();
                $("#confirmBtn").removeClass("hide");
            }
        },
        checkValid: function (index) {
            var _this = this;
            var valid;
            if (index === 0) {
                _this.batchErr = {
                    name:false,
                    prefix:false
                };
                _this.names = _this.generateName();
                _this.prefix = _this.generatePrefix();
                if (_this.nameInput.value.trim() === "") {
                    alert("请输入设备名称");
                    _this.nameInput.focus();
                    valid = false;
                } else if (_this.batch && _this.nameConfigInput.value.trim() === "") {
                    alert("请输入名称批量设置");
                    _this.nameConfigInput.focus();
                } else if (_this.typeList.options[_this.typeList.selectedIndex].value === '-1') {
                    alert("请选择类型");
                    _this.typeList.focus();
                    valid = false;
                    // }else if(_this.prefixInput.value.trim() === ""){
                    //     alert("请输入前缀名称");
                    //     prefixInput.focus();
                    //     valid = false;
                } else if( _this.batchErr.name){
                    alert("名字批量设置格式错误，请检查");
                } else if( _this.batchErr.prefix){
                    alert("前缀批量设置格式错误，请检查");
                } else {
                    valid = true;
                }
                if (valid) {
                    _this.type = _this.typeList.options[_this.typeList.selectedIndex].value;
                    _this.pId = _this.generatePId();
                    _this.createDevice();
                    //if(_this.names.length == 0|| _this.prefix.length == 0)return;

                    if (_this.mode == 'edit' || _this.prefix && _this.prefix instanceof Array && _this.prefix.join('').length > 0) {
                        _this.getBindDataSource();
                        $("#createModalSld").carousel("next");
                    } else {
                        _this.closeModal(true)
                    }
                }
            }
        }
    };
    return CreateDeviceModal;
})();

/**
 * Created by win7 on 2016/5/19.
 */
var ModuleSelScreen = (function(){
    var _this;
    function ModuleSelScreen() {
        _this = this;
    }

    ModuleSelScreen.prototype = {
        show:function(){
            WebAPI.get('/static/app/DiagnosisEngine/views/moduleSelScreen.html').done(function(resultHTML){
                PanelToggle.panelCenter.innerHTML = resultHTML;
                PanelToggle.toggle({
                    center:{
                        show:true
                    }
                });
                _this.init();
            })
        },
        init:function(){
            _this.initEntrance();
        },
        initEntrance:function(){
            document.getElementById('divPtRecognize').onclick = function(){
                ScreenManager.show(PtRecognizeScreen);
            };
            document.getElementById('divDiagnosisConfig').onclick = function(){
                ScreenManager.show(DiagnosisConfig);
            };
            document.getElementById('divDiagnosisCustom').onclick = function(){
                ScreenManager.show(DnCstmScreen, AppConfig.projectId);
            };
        },
        onresize:function(){
            PanelToggle.onresize();
        },
        close:function(){

        }
    };
    return ModuleSelScreen;
})();
/*
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/`---'\____
             .'  \\|     |//  `.
            /  \\|||  :  |||//  \
           /  _||||| -:- |||||-  \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |   |
           \  .-\__  `-`  ___/-. /
         ___`. .'  /--.--\  `. . __
      ."" '<  `.___\_<|>_/___.'  >'"".
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         佛祖保佑       永无BUG
*/
var ElScreenContainer = document.getElementById('indexMain');  //所有子模块的共用容器
var ScreenCurrent = undefined;                                 //当前页面对象的引用
var ScreenModal = undefined;                                   //共用弹出框中，加载对象的引用。若模块有私有弹出框，无需赋值。
var ScreenPrevious = undefined;                                //前一页面对象的引用
var ToolCurrent = undefined;
var Spinner = new LoadingSpinner({color: '#00FFFF'});        //等待加载时的转圈圈
var AppConfig = AppConfig || {
        userId: 101,
        projectId: 72,
        projectList: [{
            "address": "上海市浦东新区金桥镇新金桥路2222",
            "id": 72,
            "lastReceivedTime": "2016-05-20 15:52:09",
            "latlng": "31.260944,121.629994",
            "name_cn": "上海华为",
            "name_en": "shhuawei",
            "name_english": "shhuawei",
            "online": "Online",
            "pic": "shhuawei.jpg",
            "updateMarker": false
        }], //临时数据
        module:'',
        "isFactory": 1
    }; //配置文件
var I18n = I18n ? I18n : undefined;                                          //国际化对象的引用
echarts.config = echarts.config || { color: ['#E2583A','#FD9F08','#FEC500','#1D74A9','#04A0D6','#689C0F','#109d83'] };

$(document).ready(function () {
    InitI18nResource().always(function(rs){
        I18n = new Internationalization(null, rs);
        ScreenManager.show(IndexScreen);
    })
});


var IndexScreen = (function () {
    var _this;
    function IndexScreen() {
        _this = this;
        this.arrColor = ["#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0", "#1e90ff", "#ff6347", "#7b68ee", "#00fa9a", "#ffd700", "#6699FF", "#ff6666", "#3cb371", "#b8860b", "#30e0e0"];
    }

    IndexScreen.prototype = {
        show: function () {
            this.init();
        },

        close: function () {
        },

        init: function () {
            PanelToggle.init();
            this.initNav();
            ScreenManager.show(ModuleSelScreen);
            //预加载数据
            WebAPI.get('/analysis/datasource/getDsItemInfo/' + AppConfig.userId + '/null').done(function (result) {
                AppConfig.datasource = new DataSource({
                    store: {
                        group: result
                    },
                    arrColor: _this.arrColor
                });
                AppConfig.datasource.iotOpt = {
                    base:{
                        divideByProject:true
                    },
                    tree:{
                        event:{
                            addDom:function(treeNode,$target){
                                if($target.hasClass('projects')){
                                    $target.find('#' + treeNode.tId + '_span').attr('draggable',true).on('dragstart',function(e){
                                        var ptId = e.currentTarget.parentNode.parentNode.dataset.ptId;
                                        EventAdapter.setData(treeNode)
                                    })
                                }
                            }
                        }
                    }};
                $(PanelToggle.panelRight).append('<div id="dataSrcContain" class="gray-scrollbar" style="height: 100%;overflow-y: auto;"></div>')
            });
            //生成树
            WebAPI.get('/diagnosisEngine/getThingListByProjId/' + AppConfig.projectId).done(function(result){
                if (!result || result.data.length == 0)return;
                var dictGrp = {};
                var arrGrp= [];
                WebAPI.get('/iot/getClassFamily/thing/cn').done(function(dictCls){
                    for (var i = 0; i < result.data.length ;i++){
                        if (!dictGrp[result.data[i].type]){
                            dictGrp[result.data[i].type] = {
                                '_id':ObjectId(),
                                'type':result.data[i].type,
                                'projId':AppConfig.projectId,
                                'open':true
                            };
                            if(dictCls[result.data[i].type] && dictCls[result.data[i].type].name){
                                dictGrp[result.data[i].type].name = dictCls[result.data[i].type].name;
                            }else{
                                dictGrp[result.data[i].type].name = result.data[i].type;
                            }
                            arrGrp.push(dictGrp[result.data[i].type])
                        }
                        result.data[i].tempGrpId = dictGrp[result.data[i].type]['_id'];
                    }
                    TemplateTree && TemplateTree.setData([].concat(arrGrp,result.data));
                    //TemplateTree && TemplateTree.setData([].concat(result.data,result.data));
                })
            })
        },

        initNav:function(){
            document.getElementById('divBrand').onclick = function(){
                ScreenManager.show(IndexScreen);
            };
            document.getElementById('divScreenTtl').onclick = function(){
                ScreenManager.show(IndexScreen);
            }
        }
    };

    return IndexScreen;
})();
