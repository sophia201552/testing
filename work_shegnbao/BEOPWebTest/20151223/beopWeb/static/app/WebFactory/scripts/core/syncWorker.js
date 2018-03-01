/** 数据同步 */
(function ($, window) {
    var _this;

    function SyncWorker(factory) {
        _this = this;
        this.factory = factory;
        this.store = null;
    }

    SyncWorker.prototype.init = function () {
        window.removeEventListener('keydown', this.onKeyDownActionPerformed);
        window.addEventListener('keydown', this.onKeyDownActionPerformed, false);
    };

    SyncWorker.prototype.onKeyDownActionPerformed = function (e) {
        if(e.which === 83 && e.ctrlKey) {
            e.stopPropagation();
            e.preventDefault();
            try {
                _this.sync();
            } catch (e) {
                Log.exception(e);                
            }
        }
    };

    SyncWorker.prototype.initPagesData = function (data) {
        this.store = this.store || {};
        this.store.pages = $.extend(true, {}, data.toMap('_id'));
    };

    SyncWorker.prototype.initLayersData = function (data) {
        this.store = this.store || {};
        this.store.layers = $.extend(true, {}, data.toMap('_id'));
    };

    SyncWorker.prototype.initWidgetsData = function (data) {
        this.store = this.store || {};
        this.store.widgets = $.extend(true, {}, data.toMap('_id'));
    };

    SyncWorker.prototype.syncPage = function () {
        var diffPages;

        if (this.store === null) {
            Log.info('data loading now');
            return;
        }

        diffOfPages = this.diffPages();
        if (diffOfPages === null) {
            Log.info('no data need to be upload.');
        } else {
            WebAPI.post('/factory/save/'+AppConfig.project.id, {
                page: diffOfPages
            }).done(function (rs) {
                if (rs.status === 'OK') {
                    Log.info('sync data success!');
                } else {
                    Log.warn('sync data failed, data process error!');
                }
            }).fail(function () {
                console.warn('sync data failed, backend error!');
            });
        }
    };

    SyncWorker.prototype.sync = function (type) {
        var diffs = {};
        var diffOfPages, diffOfLayers, diffOfWidgets;

        if (this.store === null) {
            Log.info('data loading now');
            return;
        }

        diffOfPages = this.diffPages();
        diffOfLayers = this.diffLayers();
        diffOfWidgets = this.diffWidgets();

        if (diffOfPages !== null) diffs['page'] = diffOfPages;
        if (diffOfLayers !== null) diffs['layer'] = diffOfLayers;
        if (diffOfWidgets !== null) diffs['widget'] = diffOfWidgets;

        if (diffOfPages === null && 
            diffOfLayers === null && 
            diffOfWidgets === null) {
            Log.info('no data need to be upload.');
        } else {
            WebAPI.post('/factory/save/'+AppConfig.project.id, diffs).done(function (rs) {
                if (rs.status === 'OK') {
                    Log.info('sync data success!');
                } else {
                    Log.warn('sync data failed, data process error!');
                }
            }).fail(function () {
                console.warn('sync data failed, backend error!');
            });
        }
    };

    SyncWorker.prototype.mergeDiffs = (function () {

        /** 将最终输出结果格式化成想要的方式 */
        function mergeGroup(id, group) {
            var rs = {};
            var newDiff = null;

            // 合并所有编辑类的操作
            group.forEach(function (d) {
                var kv = {};
                // 是否是新增的
                if (d.kind === 'N') {
                    newDiff = d;
                }
                // 新增后是否有编辑操作
                else if (d.kind === 'E') {
                    // 合并编辑操作
                    if (d.path.length === 2) {
                        rs._id = d.path[0];
                        kv[d.path[1]] = d.rhs;
                        rs.v = $.extend(false, rs.v, kv);
                    } else {
                        Log.warn('property "' + d.path.join('.') + '" is a object, expect not a object, will ignore it and do not upload to the server.');
                    }
                } else {
                    Log.warn('there shouldn\'t have any type except \'N\' and \'E\' in the group diffs, unusual type: ' + d.kind);
                }
            });

            // 若是新创建的，则将编辑操作合并到创建操作中
            if (newDiff) {
                rs = $.extend(false, {
                    k: 'N',
                    v: newDiff.rhs
                }, rs);
            } else {
                rs._id = id;
                rs.k = 'E';
            }

            return rs;
        }

        return function (diffs) {
            // 先按照 _id 进行分类
            var map = {};
            var rs = [];

            // 转换成 map
            diffs.forEach(function (d) {
                var id = d.path[0];
                map[id] = map[id] || [];

                // 若已删除，则不再进一步处理
                if (map[id].length === 1 && map[id][0].kind === 'D') return;
                
                // 若为删除操作，则覆盖所有其他操作
                if (d.kind === 'D') {
                    map[id] = [d];
                    return;
                }

                map[id].push(d);
            }, this);

            // 格式化和合并
            for (var id in map) {
                if (!map.hasOwnProperty(id)) continue;

                // 若为删除操作，则跳过
                if (map[id].length === 1 && map[id][0].kind === 'D') {
                    // 格式化一下
                    rs.push({
                        k: 'D',
                        _id: map[id][0].lhs['_id']
                    });
                    continue;   
                }
                rs.push( mergeGroup(id, map[id]) );
            }

            return rs;
        }
    } ());

    SyncWorker.prototype.diffPages = function () {
        var oldData = this.store.pages;
        var newData = this.factory.getPagesData();
        var rs = null;

        if (typeof oldData === 'undefined') return null;

        newData = newData.toMap('_id');
        rs = window.diff(oldData, newData, function (lhs, rhs, path) {
            var cmp;
            if (path.length !== 2 || ['layerList'].indexOf(path[1]) === -1) return;
            cmp = window.diff(lhs, rhs);
            return cmp !== null;
        });

        if (rs !== null) {
            rs = this.mergeDiffs(rs);
            this.store.pages = $.extend(true, {}, newData);
        }

        return rs;
    };

    SyncWorker.prototype.diffLayers = function () {
        var oldData = this.store.layers;
        var newData = this.factory.getLayersData();
        var rs = null;

        if (typeof oldData === 'undefined') return null;

        newData = newData.toMap('_id');
        rs = window.diff(oldData, newData);

        if (rs !== null) {
            rs = this.mergeDiffs(rs);
            this.store.layers = $.extend(true, {}, newData);
        }

        return rs;
    };

    SyncWorker.prototype.diffWidgets = function () {
        var oldData = this.store.widgets;
        var newData = this.factory.getWidgetsData();
        var rs = null;

        if (typeof oldData === 'undefined') return null;
        
        newData = newData.toMap('_id');
        rs = window.diff(oldData, newData, function (lhs, rhs, path) {
            var cmp;
            if (path.length !== 2 || ['option', 'idDs'].indexOf(path[1]) === -1) return;
            cmp = window.diff(lhs, rhs);
            return cmp !== null;
        });

        if (rs !== null) {
            rs = this.mergeDiffs(rs);
            this.store.widgets = $.extend(true, {}, newData);
        }

        return rs;
    };

    SyncWorker.prototype.close = function () {
        _this = null;
        this.factory = null;
        this.store = null;
        window.removeEventListener('keydown', this.onKeyDownActionPerformed);
    };

    window.SyncWorker = SyncWorker;
}.call(this, jQuery, window));