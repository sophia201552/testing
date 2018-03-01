// dependencies: ['jQuery']
(function ($, undefined) {

    var TIME_STAMP = {
        m1: 60000, // 60*1000
        m5: 300000, // 5*60*1000
        h1: 3600000, // 60*60*1000
        d1: 86400000 // 24*60*60*1000
        //M1: 2678400000 // 31*24*60*60*1000
    };

    var DB_INFO = {
        driver: 'indexedDB',
        storeName: 'datasource'
    };

    //////////////////////////////
    // DSCache CLASS DEFINITION //
    //////////////////////////////
    function DSCache() {
        this.db = new Beop.cache.BaseCache(DB_INFO);
        this.keyTpl = 'anal_{id}_{fmt}_{start}_{end}';
    };

    DSCache.prototype.get = function (id, tmFmt, tmStart, tmEnd) {
        var _this = this;
        var key;
        var promise = $.Deferred();

        if(tmFmt === 'M1') {
            promise.resolve(null);
            return promise;
        }

        if( typeof tmStart === 'string' ) tmStart = tmStart.toDate();
        if( typeof tmEnd === 'string' ) tmEnd = tmEnd.toDate();
        // 将时间贴近到最近整时段
        tmStart = this.formatTime(tmStart, tmFmt);
        tmEnd = this.formatTime(tmEnd, tmFmt);

        key = this.keyTpl.formatEL({
            id: id,
            fmt: tmFmt,
            start: tmStart.valueOf(),
            end: tmEnd.valueOf()
        });

        this.db.getItem(key).done(function (rs) {
            var index1, index2;

            if(rs !== null) {
                promise.resolve(rs);
                return promise;
            };

            tmStart = tmStart.format('yyyy-MM-dd HH:mm:ss');
            tmEnd = tmEnd.format('yyyy-MM-dd HH:mm:ss');

            _this.db.iterate(function (key, value, i) {
                if( _this.isExist(key, id, tmFmt, tmStart, tmEnd) ) {
                    // 截取需要的时间
                    index1 = value.timeShaft.indexOf(tmStart);
                    index2 = value.timeShaft.indexOf(tmEnd);
                    value.list[0].data = value.list[0].data.slice(index1, index2+1);
                    value.timeShaft = value.timeShaft.slice(index1, index2+1);
                    rs = value;
                    return false;
                }
            }).done(function () {
                promise.resolve(rs);
            }).fail(function (e) {
                promise.reject(e);
            });
        }).fail(function (e) {
            promise.reject(e);
        });

        return promise;
    };

    DSCache.prototype.getBatch = function (ids, tmFmt, tmStart, tmEnd) {
        var find, rs = null;
        var promiseArr = [];
        var idsNotFound = [];

        for ( var i = 0, len = ids.length; i < len; i++ ) {
            (function (i) {
                promiseArr.push( this.get( ids[i], tmFmt, tmStart, tmEnd ).done(function (find) {
                   if( find !== null ) {
                        if( rs === null ) rs = find;
                        else rs.list.push(find.list[0]);
                    } else {
                        idsNotFound.push(ids[i]);
                    } 
                }) );
                
            }).call(this, i);
        }

        return $.when.apply($, promiseArr).then(function () {
            return {data: rs, idsNotFound: idsNotFound};
        });
    };

    DSCache.prototype.set = function (data, tmFmt, tmStart, tmEnd) {
        var promise = $.Deferred();
        var list = data.list.concat();

        if(tmFmt === 'M1') {
            promise.resolve(null);
            return promise;
        }
        
        // 判断数据是否为空，如果为空，则不存
        if(data === null || !data.timeShaft || !data.timeShaft.length) {
            promise.resolve(null);
            return promise;
        }

        if( typeof tmStart === 'string' ) tmStart = tmStart.toDate();
        if( typeof tmEnd === 'string' ) tmEnd = tmEnd.toDate();

        // 将时间贴近到最近整时段
        tmStart = this.formatTime(tmStart, tmFmt);
        tmEnd = this.formatTime(tmEnd, tmFmt);

        function circle() {
            var _this = this;
            var item = list.shift();
            var id, key;

            if(!item) {
                promise.resolve();
                return;
            }

            id = item.dsItemId;
            key = this.keyTpl.formatEL({
                id: id,
                fmt: tmFmt,
                start: tmStart.valueOf(),
                end: tmEnd.valueOf()
            });
            this.merge2Cache(key, {
                list: [item],
                timeShaft: data.timeShaft
            }).done(function () {
                circle.call(_this);
            }).fail(function (e) {
                promise.reject(e);
            });
        }

        circle.call(this);

        return promise;
    };

    DSCache.prototype.remove = function (itemIds) {
        var _this = this;
        var keys = [];
        var promise = $.Deferred();

        if(typeof itemIds === 'string') {
            itemIds = [itemIds];
        }

        // 先查找出缓存中符合条件的 key 值
        this.db.keys().done(function (rs) {
            console.log(rs);
        });

        this.db.iterate(function (key) {
            var isExist = itemIds.some(function (row, i) { if( key.indexOf('anal_'+row) > -1 ) return true; });
            if(isExist) keys.push(key);
        }).done(function () {
            if(keys.length > 0) {
                _this.db.removeItemList(keys).done(function () {
                    promise.resolve();
                }).fail(function () {
                    promise.reject();
                });
                return;
            }
            promise.reject();
        }).fail(function () {
            console.warn( 'remove ds key failed! key: '+keys.join(',') );
            promise.reject();
        });

        return promise;
    };

    DSCache.prototype.merge2Cache = function (newKey, newValue) {
        var _this = this;
        var arr = newKey.split('_');
        var kk = [arr[0], arr[1], arr[2]].join('_');
        var filter = [];
        var promise = $.Deferred();

        this.db.iterate(function (key, value, index) {
            if( key.indexOf(kk) > -1 ) {
                filter.push({
                    key: key,
                    value: value
                });
            }
        }).done(function () {
            if(filter.length === 0) {
                _this.db.setItem(newKey, newValue).done(function () {
                    promise.resolve();
                });
                return;
            }

            _this.merge2group({
                key: newKey,
                value: newValue,
                fmt: arr[2],
                start: parseInt(arr[3]),
                end: parseInt(arr[4])
            }, filter).then(function () {
                promise.resolve();
            }, function (e) {
                promise.reject(e);
            });
        }).fail(function (e) {
            promise.reject(e);
        });

        return promise;
    };

    DSCache.prototype.merge2group = function (row, group) {
        var _this = this;
        var timeArr = [], arr, ts, item;
        var start1, end1, start2, end2;
        var srcData;
        var promise = $.Deferred();
        // 生成时间数组
        for(var i = 0, len = group.length; i < len; i++) {
            arr = group[i].key.split('_');

            item = {
                key: group[i].key,
                fmt: arr[2],
                start: parseInt(arr[3]),
                end: parseInt(arr[4])
            };

            timeArr.push(item);
        }

        ts = TIME_STAMP[row.fmt];
        // 不对不支持的时间格式进行合并
        if(ts === undefined) {
            promise.reject();
            return;
        }

        start1 = row.start - ts;
        end1 = row.end + ts;

        srcData = {
            key: row.key,
            value: row.value
        };

        function circle() {
            var _this = this;
            var item = timeArr.shift();
            var start2, end2;

            if(!item) {
                // 合并完毕
                // 将合并后的数据存入缓存中
                this.db.setItem( srcData.key, srcData.value );
                promise.resolve();
                return;
            }
                
            start2 = item.start;
            end2 = item.end;
            // 判断时间有无交集
            if(start1 > end2 || end1 < start2) {
                // 无交集
                circle.call(this);
            } else {
                // 有交集
                this.db.getItem(item.key).done(function (value) {
                    _this.mergeData(srcData, {
                        key: item.key,
                        value: value
                    }).done(function (rs) {
                        srcData = rs;
                        // 如果现有数据已经被包含于已有的数据，则无需做任何处理
                        if(srcData === null) {
                            promise.resolve();
                            return;
                        }
                        circle.call(_this);
                    });
                    
                }).fail(function () {
                    promise.reject();
                    return;
                });
            }
        }

        circle.call(this);

        return promise;
    };

    DSCache.prototype.mergeData = function (d1, d2) {
        var key1 = d1.key, key2 = d2.key;
        var item1 = d1.value, item2 = d2.value;
        var arr = key1.split('_');
        var dsId = arr[1];
        var prefix = this.keyTpl.formatEL({id: arr[1], fmt: arr[2]});

        var start1, end1, start2, end2;
        var start, end;

        var index, data, ts, result;
        var promise = $.Deferred();

        // params
        startStr1 = item1.timeShaft[0];
        endStr1 = item1.timeShaft[item1.timeShaft.length-1];
        startStr2 = item2.timeShaft[0];
        endStr2 = item2.timeShaft[item2.timeShaft.length-1];

        start1 = startStr1.toDate().valueOf();
        end1 = endStr1.toDate().valueOf();
        start2 = startStr2.toDate().valueOf();
        end2 = endStr2.toDate().valueOf();

        // calculate for new start time and end time
        start = Math.min(start1, start2);
        end = Math.max(end1, end2);

        // 2 包含 1
        if( start === start2 && end === end2 ) {
            // we need not to do anything
            promise.resolve(null);
            return promise;
        }
        // 1 包含 2
        if( start === start1 && end === end1 ) {
            this.db.removeItem(key2).done(function () {
                promise.resolve(d1);
            });
            return promise;
        }
        // 1右和2左 部分重叠
        if( start === start1 && end === end2 ) {
            index = item1.timeShaft.indexOf(startStr2);
            // 如果没有找到，说明 1右和2座 刚好相差一个单位
            if( index === -1 ) index = item1.timeShaft.length;
            data = item1.list[0].data.slice(0, index)
                .concat(item2.list[0].data);
            ts = item1.timeShaft.slice(0, index)
                .concat(item2.timeShaft);

            this.db.removeItem(key2).done(function () {
                promise.resolve({
                    key: prefix.formatEL( {start: start1, end: end2} ),
                    value: {
                        list: [{data: data, dsItemId: dsId}],
                        timeShaft: ts
                    }
                });
            });
            return promise;
        } 
        // 1左和2右 部分重叠
        if( start === start2 && end === end1 ) {
            index =  item1.timeShaft.indexOf(endStr2);
            // 如果没有找到，说明 1左和2右 刚好相差一个单位
            if( index === -1 ) index = 0;
            data = item2.list[0].data
                .concat(item1.list[0].data.slice(index));
            ts = item2.timeShaft
                .concat(item1.timeShaft.slice(index));

            this.db.removeItem(key2).done(function () {
                promise.resolve({
                    key: prefix.formatEL( {start: start2, end: end1} ),
                    value: {
                        list: [{data: data, dsItemId: dsId}],
                        timeShaft: ts
                    }
                });
            });
            return promise;
        }
        // 没有重叠部分
        promise.resolve(d1);
        return promise;
    };

    DSCache.prototype.isExist = function (key, id, tmFmt, tmStart, tmEnd) {
        var arr = [];
        var rangeStart, rangeEnd;
        if(key.indexOf('anal_' + id + '_' + tmFmt) === -1) return false;
        arr = key.split('_');
        if( typeof tmStart === 'string' ) tmStart = tmStart.toDate();
        if( typeof tmEnd === 'string' ) tmEnd = tmEnd.toDate();
        tmStart = tmStart.valueOf();
        tmEnd = tmEnd.valueOf();

        // 2 包含 1
        if(tmStart >= parseInt(arr[3]) && tmEnd <= parseInt(arr[4])) return true;
        
        return false;
    };

    // 将时间贴近到最近的整时段(上或者下)
    DSCache.prototype.formatTime = function (time, fmt, mode) {
        var ts = TIME_STAMP[fmt];
        mode = mode === 'up' ? 'ceil' : 'floor';

        // 不对不支持的时间格式进行处理
        if(ts === undefined) return;
        
        if(typeof time === 'string') time = time.toDate();
        time = time.valueOf();

        if(fmt === 'd1') {
            // 手动修正时差
            time = new Date( Math[mode](time / ts) * ts )
                .format('yyyy-MM-dd 00:mm:ss');
        } else {
            time = new Date( Math[mode](time / ts) * ts )
                .format('yyyy-MM-dd HH:mm:ss');
        }
        return new Date(time);
    };

    /////////////
    // exports //
    /////////////
    this.Beop = this.Beop || {};
    this.Beop.cache = this.Beop.cache || {};
    
    this.Beop.cache.ds = new DSCache();
}).call(this, jQuery);