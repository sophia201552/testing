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