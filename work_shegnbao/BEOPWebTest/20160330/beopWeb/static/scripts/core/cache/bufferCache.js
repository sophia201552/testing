// dependencies: ['jQuery']
(function ($, undefined) {
    'use strict';

    var DB_INFO = {
        driver: 'indexedDB',
        storeName: 'buffer'
    };
    var log = console.warn.bind(console);
    var assert = {
        equal: function (val1, val2) {
            if(val1 !== val2) console.warn('assert - equal not expected!');
        }
    }

    var key_version, uId;

    function BufferCache() {
        this.db = new Beop.cache.BaseCache(DB_INFO);
    }

    +function () {

        this.init = function () {
            var _this = this;
            uId = AppConfig.userId;
            key_version = 'version?u='+uId;
            
            return this.db.getItem(key_version).then(function (v) {
                if(v === null) {
                    _this.db.setItem(key_version, 1).then(function () {
                        _this.activeVersion = 1;
                        _this.frozenVersion = 0;
                    });
                } else {
                    v = parseInt(v);
                    _this.activeVersion = v;
                    _this.frozenVersion = v - 1;
                }
            }, function () {
                _this.db.setItem(key_version, 1).then(function () {
                    _this.activeVersion = 1;
                    _this.frozenVersion = 0;
                });
            });
        };

        //////////
        // BASE //
        //////////
        /**
         * 获取缓冲区的数据对象，如果该对象不存在，则返回一个初始化的对象
         * @return {object} promise 对象
         */
        this.getBuffer = function (key, version) {
            var promise;

            version = version === undefined ? this.activeVersion : version;
            if(!key) {
                log('getBuffer - arguments can not be empty');
                promise = $.Deferred();
                promise.reject();
                return promise;
            }
            return this.db.getItem(key+'?u='+uId+'&v='+version).then(function (rs) {
                if(rs === null) {
                    rs = [];
                }
                return rs;
            });
        };

        /**
         * 将指定的数据对象放入缓冲区中
         * @param {object} data 将要放入缓冲区中的对象
         */
        this.setBuffer = function (data, key, version) {
            var promise;

            version = version === undefined ? this.activeVersion : version;
            if(!key) {
                log('setBuffer - arguments can not be empty');
                promise = $.Deferred();
                promise.reject();
                return promise;
            }
            return this.db.setItem(key+'?u='+uId+'&v='+version, data);
        };

        /**
         * 删除指定版本的缓冲区
         */
        this.removeBuffer = function (key, version) {
            var promise;

            version = version === undefined ? this.frozenVersion : version;
            if(!key) {
                log('removeBuffer - arguments can not be empty');
                promise = $.Deferred();
                promise.reject();
                return promise;
            }
            return this.db.removeItem(key+'?u='+uId+'&v='+version);
        };

        //////////
        // UTIL //
        //////////
        this.findDataById = function (id, type) {
            var promise = $.Deferred();

            this.getBuffer(type).then(function (rs) {
                // 在结果中查找是否有这条记录
                for (var i = 0, len = rs.length; i < len; i++) {
                    if(rs[i].id === id) {
                        break;
                    }
                }
                if(i !== len) {
                    promise.resolve(rs, i);
                } else {
                    promise.resolve(rs, -1);
                }
            }, function () {
                promise.reject();
            });

            return promise;
        };

        // 三种情况需要分析
        // 1、不存在工作空间
        // 2、存在工作空间，不存在此 modal
        // 3、存在工作空间，存在此 modal
        this.findModalById = function (modalId, id, type) {
            var promise = $.Deferred();

            this.findDataById(id, type).then(function (rs, i) {
                var row, row2;
                var t, len;

                // 不存在此工作空间
                if(i === -1) {
                    promise.resolve(rs, -1);
                    return;
                }

                // 存在此工作空间
                row = rs[i];
                // 在结果中查找是否有这条记录
                for (t = 0, len = row.modalList.length; t < len; t++) {
                    row2 = row.modalList[t];
                    if(row2.id === modalId) {
                        break;
                    }
                }

                // 存在此 modal
                if(t !== len) {
                    promise.resolve(rs, i, t);
                }
                // 不存在此 modal
                else {
                    promise.resolve(rs, i, -1)
                }
            }, function (rs, i) {
                promise.reject();
            });

            return promise;
        };

        ///////////////
        // OPARATION //
        ///////////////

        ///////////////
        // WORKSPACE //
        ///////////////
        /**
         * 增加一条 新增工作空间 的记录
         * @param {object} data 将要新增的工作空间对象
         */
        this.addWsCreateOp = function (data, type) {
            var _this = this;
            var promise = $.Deferred();

            type = type === undefined ? 'ws' : type;

            // 声明修改类型
            data.op = 'create';
            this.getBuffer(type).then(function (rs) {
                rs.push(data);

                _this.setBuffer(rs, type).then(function () {
                    promise.resolve();
                }, function () {
                    log('addWsCreateOp - ' + type + ' - setBuffer failed');
                    promise.reject();
                });
            }, function () {
                log('addWsCreateOp - ' + type + ' - getBuffer failed');
                promise.reject();
            });

            return promise;
        };

        /**
         * 增加一条 修改工作空间 的记录
         * @param {object} data 新的工作空间对象
         */
        this.addWsUpdateOp = function (data, type) {
            var _this = this;
            var promise = $.Deferred();

            type = type === undefined ? 'ws' : type;

            // 在缓存中查找是否已存在此工作空间的记录
            this.findDataById(data.id, type).then(function (rs, index) {
                var ws;
                // 如果存在，修改
                if(index !== -1) {
                    ws = rs[index];
                    // 此处先写死，好的方法是可以声明一个包裹类做这个事
                    ws.name = data.name;
                    ws.modifyTime = data.modifyTime;
                    // 注：这里无需更改操作类型
                } 
                // 如果不存在，追加
                else {
                    rs.push({
                        id: data.id,
                        name: data.name,
                        modifyTime: data.modifyTime,
                        modalList: [],
                        op: 'update'
                    });
                }

                _this.setBuffer(rs, type).then(function () {
                    promise.resolve();
                }, function () {
                    log('addWsUpdateOp - ' + type + ' - setBuffer failed');
                    promise.reject();
                });
            }, function () {
                log('addWsUpdateOp - ' + type + ' - findDataById failed');
                promise.reject();
            });

            return promise;
        };

        /**
         * 增加一条 删除工作空间 的记录
         * @param {[type]} data [description]
         */
        this.addWsDeleteOp = function (data, type) {
            var _this = this;
            var promise = $.Deferred();

            type = type === undefined ? 'ws' : type;

            // 在缓存中查找是否已存在此工作空间的记录
            this.findDataById(data.id, type).then(function (rs, index) {
                var ws;
                // 如果存在，修改
                if(index !== -1) {
                    ws = rs[index];
                    if(ws.op === 'create') {
                        rs.splice(index, 1);
                    } else {
                        rs[index] = {
                            id: data.id,
                            op: 'delete'
                        };
                    }
                } 
                // 如果不存在，追加
                else {
                    rs.push({
                        id: data.id,
                        op: 'delete'
                    });
                }

                _this.setBuffer(rs, type).then(function () {
                    promise.resolve();
                }, function () {
                    log('addWsDeleteOp - ' + type + ' - setBuffer failed');
                    promise.reject();
                });

            }, function () {
                log('addWsDeleteOp - ' + type + ' - findDataById failed');
                promise.reject();
            });

            return promise;
        };

        ///////////
        // MODAL //
        ///////////
        
        // 新增一条 新增modal 的操作
        this.addModalCreateOp = function (modal, id, type) {
            var _this = this;
            var promise = $.Deferred();

            // 在缓存中查找是否已存在此 工作空间/模板 的记录
            this.findDataById(id, type).then(function (rs, i) {
                // 存在此 工作空间/模板
                if(i !== -1) {
                    rs[i].modalList.push(modal);
                } 
                // 不存在此 工作空间/模板
                else {
                    rs.push({
                        id: id,
                        modalList: [modal],
                        op: 'update'
                    });
                }

                _this.setBuffer(rs, type).then(function () {
                    promise.resolve();
                }, function () {
                    log('addModalCreateOp - setBuffer failed');
                    promise.reject();
                });

            }, function () {
                log('addModalCreateOp - findDataById failed');
                promise.reject();
            });

            return promise;
        };

        // 新增一条 更新modal 的操作
        this.addModalUpdateOp = function (modal, id, type) {
            var _this = this;
            var promise = $.Deferred();

            // 在缓存中查找是否已存在此 工作空间/模板 的记录
            this.findModalById(modal.id, id, type).then(function (rs, i, t) {
                // 不存在 工作空间/模板
                if(i === -1) {
                    rs.push({
                        id: id,
                        op: 'update',
                        modalList: [modal]
                    });
                }
                // 存在 工作空间/模板，不存在 modal
                else if(t === -1) {
                    // 断言
                    assert.equal(rs[i].op, 'update');
                    rs[i].modalList.push(modal);
                }
                // 存在 工作空间/模板，存在 modal
                else {
                    // 注意，op 在这里应该不变
                    modal.op = rs[i].modalList[t].op;
                    // 合并操作
                    modal = $.extend(false, rs[i].modalList.splice(t, 1), modal);
                    rs[i].modalList.push(modal);
                }

                _this.setBuffer(rs, type).then(function () {
                    promise.resolve();
                }, function () {
                    log('addModalDeleteOp - setBuffer failed');
                    promise.reject();
                });

            }, function () {
                log('addModalDeleteOp - findModalById failed');
                promise.reject();
            });
            
            return promise;
        };

        // 新增一条 删除modal 的操作
        this.addModalDeleteOp = function (modalId, id, type) {
            var _this = this;
            var promise = $.Deferred();

            // 在缓存中查找是否已存在此 工作空间/模板 的记录
            this.findModalById(modalId, id, type).then(function (rs, i, t) {
                var op;
                // 不存在 工作空间/模板
                if(i === -1) {
                    rs.push({
                        id: id,
                        op: 'update',
                        modalList: [{
                            id: modalId,
                            op: 'delete'
                        }]
                    });
                }
                // 存在 工作空间/模板，不存在 modal
                else if(t === -1) {
                    // 断言
                    assert.equal(rs[i].op, 'update');
                    
                    rs[i].modalList.push({
                        id: modalId,
                        op: 'delete'
                    });
                }
                // 存在 工作空间/模板，存在 modal
                else {
                    op = rs[i].modalList[t].op;
                    if(op === 'create') {
                        rs[i].modalList.splice(t, 1);
                    } else if(op === 'update') {
                        rs[i].modalList[t] = {
                            id: modalId,
                            op: 'delete'
                        };
                    }
                }

                _this.setBuffer(rs, type).then(function () {
                    promise.resolve();
                }, function () {
                    log('addModalDeleteOp - setBuffer failed');
                    promise.reject();
                });

            }, function () {
                log('addModalDeleteOp - findModalById failed');
                promise.reject();
            });

            return promise;
        };

        ///////////
        // OTHER //
        ///////////
        this.freeze = function () {
            var promise = $.Deferred();
            // 检查上个冻结版本的数据是否提交成功
            this.db.keys().done( function (keys) {
                if( (keys.indexOf('ws?u='+uId+'&v='+this.frozenVersion) === -1 
                    && keys.indexOf('tpl?u='+uId+'&v='+this.frozenVersion) === -1)
                    && ( keys.indexOf('ws?u='+uId+'&v='+this.activeVersion) !== -1
                    || keys.indexOf('tpl?u='+uId+'&v='+this.activeVersion) !== -1) ) {
                    this.db.setItem(key_version, this.activeVersion+1)
                    .done( function () {
                        // 提交成功，版本号前移，冻结当前版本
                        this.frozenVersion = this.activeVersion;
                        this.activeVersion += 1;
                        promise.resolve();
                    }.bind(this) );
                } else {
                    promise.resolve();
                }
                // 提交失败，版本号保持原样，下一次提交会再次尝试提交失败的数据
            }.bind(this) );

            return promise;
        };
        this.getFrozenData = function () {

            function getDisplayData(data) {
                var rs = {};
                if(!data.length) return null;

                data.forEach(function (ws) {
                    switch(ws.op) {
                        // 若为 需要新增/删除 的工作空间，则直接加入，
                        // 无需做额外操作
                        case 'create':
                        case 'delete':
                            rs[ws.op] = rs[ws.op] || [];
                            rs[ws.op].push(ws);

                            // 将 ws 中所有的 op 都删除，防止向服务端传递冗余字段
                            delete ws.op;
                            ws.modalList && ws.modalList.forEach(function (row) {
                                delete row.op;
                            });

                            break;
                        // 若为需要修改的工作空间，则需要进一步对其中的
                        // modal 进行处理
                        case 'update':
                            rs.update = rs.update || [];
                            // 如果存在 modalList，则对 modal 进行操作分类
                            if(!!ws.modalList && !!ws.modalList.length) {
                                ws.modal = {};
                                ws.modalList.forEach(function (modal) {
                                    ws.modal[modal.op] = ws.modal[modal.op] || [];
                                    ws.modal[modal.op].push(modal);
                                    delete modal.op;
                                });
                            }
                            delete ws.op;
                            delete ws.modalList;
                            rs.update.push(ws);
                            break;
                        default:break;
                    }
                });
                return rs;
            }

            return function () {
                var arr = [];
                var promise = $.Deferred();

                // 冻结版本才能取数据
                this.freeze().then( function () {
                    arr.push( this.getBuffer('ws', this.frozenVersion).then(function (ws) {
                        return getDisplayData(ws);
                    }) );
                    arr.push( this.getBuffer('tpl', this.frozenVersion).then(function (tpl) {
                        return getDisplayData(tpl);
                    }) );
                    
                    $.when.apply($, arr).then(function () {
                        var rs = null;
                        if(arguments[0] !== null) {
                            rs = rs || {};
                            rs['ws'] = arguments[0];
                        }
                        if(arguments[1] !== null) {
                            rs = rs || {};
                            rs['tpl'] = arguments[1];
                        }
                        promise.resolve(rs);
                    });
                }.bind(this), function () {
                    log('getFrozenData - freeze failed');
                    promise.reject();
                } );
                return promise;
            };
        }.call(this);

        this.removeFrozenData = function () {
            var arr = [];
            
            arr.push( this.removeBuffer('ws', this.frozenVersion) );
            arr.push( this.removeBuffer('tpl', this.frozenVersion) );

            return $.when.apply($, arr);
        };

    }.call(BufferCache.prototype);

    /////////////
    // exports //
    /////////////
    this.Beop = this.Beop || {};
    this.Beop.cache = this.Beop.cache || {};

    this.Beop.cache.buffer = new BufferCache();

}).call(this, jQuery);