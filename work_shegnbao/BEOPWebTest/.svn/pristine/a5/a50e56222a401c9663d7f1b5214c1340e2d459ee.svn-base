window.BeopCache = (function (window, undefined) {

    var TIME_STAMP = {
        m1: 60000, // 60*1000
        m5: 300000, // 5*60*1000
        h1: 3600000, // 60*60*1000
        d1: 86400000, // 24*60*60*1000
        //M1: 2678400000 // 31*24*60*60*1000
    };

    ////////////////////////////
    // Cache CLASS DEFINITION //
    ////////////////////////////
    function Cache() {
        this.mode = 'sessionStorage';
    };

    Cache.prototype.setItem = function (key, value) {
        if(typeof value === 'object') value = JSON.stringify(value);
        return window[this.mode].setItem(key, value);
    };

    Cache.prototype.getItem = function (key) {
        var rs = window[this.mode].getItem(key);
        try { rs = JSON.parse(rs); } catch (e) {}
        return rs;
    };

    Cache.prototype.removeItem = function (key) {
        return window[this.mode].removeItem(key);
    };

    Cache.prototype.each = function (handler) {
        var storage = window[this.mode];
        var key, value, rs;
        for (var i = 0, len = storage.length; i < len; i++) {
            key = storage.key(i);
            value = storage.getItem(key);
            try { 
                value = JSON.parse(value);
            } catch (e) {}
            if(handler.call(value, key, value) === false) break;
        }
    };

    //////////////////////////////
    // DSCache CLASS DEFINITION //
    //////////////////////////////
    function DSCache() {
        Cache.call(this, arguments);

        this.keyTpl = 'anal_{id}_{fmt}_{start}_{end}';
    };

    DSCache.prototype = Object.create(Cache.prototype);
    DSCache.prototype.constructor = DSCache;

    DSCache.prototype.set = function (data, tmFmt, tmStart, tmEnd) {
        var id, key;
        if( typeof tmStart === 'string' ) tmStart = new Date(tmStart);
        if( typeof tmEnd === 'string' ) tmEnd = new Date(tmEnd);

        // 将时间贴近到最近整时段
        tmStart = this.formatTime(tmStart, tmFmt);
        tmEnd = this.formatTime(tmEnd, tmFmt);

        for (var i = 0, len = data.list.length; i < len; i++) {
            id = data.list[i].dsItemId;
            key = this.keyTpl.formatEL({
                id: id,
                fmt: tmFmt,
                start: tmStart.valueOf(),
                end: tmEnd.valueOf()
            });
            this.merge2Cache(key, {
                list: [data.list[i]],
                timeShaft: data.timeShaft
            });
        }
    };

    DSCache.prototype.get = function (id, tmFmt, tmStart, tmEnd) {
        var _this = this;
        var key, rs, index1, index2;

        if( typeof tmStart === 'string' ) tmStart = new Date(tmStart);
        if( typeof tmEnd === 'string' ) tmEnd = new Date(tmEnd);
        // 将时间贴近到最近整时段
        tmStart = this.formatTime(tmStart, tmFmt);
        tmEnd = this.formatTime(tmEnd, tmFmt);

        key = this.keyTpl.formatEL({
            id: id,
            fmt: tmFmt,
            start: tmStart.valueOf(),
            end: tmEnd.valueOf()
        });
        rs = this.getItem(key);

        if(rs !== null) return rs;

        tmStart = tmStart.format('yyyy-MM-dd HH:mm:ss');
        tmEnd = tmEnd.format('yyyy-MM-dd HH:mm:ss');

        this.each(function (key, value) {
            if( _this.isExist(key, id, tmFmt, tmStart, tmEnd) ) {
                // 截取需要的时间
                index1 = value.timeShaft.indexOf(tmStart);
                index2 = value.timeShaft.indexOf(tmEnd);
                value.list[0].data = value.list[0].data.slice(index1, index2+1);
                value.timeShaft = value.timeShaft.slice(index1, index2+1);
                rs = value;
                return false;
            }
        });
        return rs;
    };

    DSCache.prototype.getBatch = function (ids, tmFmt, tmStart, tmEnd) {
        var find = [], rs = null;
        for ( var i = 0, len = ids.length; i < len; i++ ) {
            find = this.get( ids[i], tmFmt, tmStart, tmEnd );
            if( find !== null ) {
                // delete the id that could be found in cache
                ids.splice(i, 1);
                i--;len--;
                if( rs === null ) {
                    rs = find;
                } else {
                    rs.list.push(find.list[0]);
                }
            }
        }
        return rs;
    };

    DSCache.prototype.merge2Cache = function (newKey, newValue) {
        var arr = newKey.split('_');
        var kk = [arr[0], arr[1], arr[2]].join('_');
        var filter = [];

        this.each(function (key, value) {
            if( key.indexOf(kk) > -1 ) {
                filter.push({
                    key: key,
                    value: value
                });
            }
        });

        if(filter.length === 0) {
            this.setItem(newKey, newValue);
            return;
        }

        this.merge2group({
            key: newKey,
            value: newValue,
            fmt: arr[2],
            start: parseInt(arr[3]),
            end: parseInt(arr[4])
        }, filter);
    };

    DSCache.prototype.merge2group = function (row, group) {
        var timeArr = [], arr, ts, item;
        var start1, end1, start2, end2;
        var srcData;
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
        if(ts === undefined) return;

        start1 = row.start - ts;
        end1 = row.end + ts;

        srcData = {
            key: row.key,
            value: row.value
        };

        for(i = 0, len = timeArr.length; i < len; i++) {
            start2 = timeArr[i].start;
            end2 = timeArr[i].end;

            // 判断时间有无交集
            if(start1 > end2 || end1 < start2) {
                // 无交集
                continue;
            } else {
                // 有交集
                srcData = this.mergeData(srcData, {
                    key: timeArr[i].key,
                    value: this.getItem(timeArr[i].key)
                });
            }
        }

        if( srcData !== undefined ) {
            this.setItem( srcData.key, srcData.value );
        }
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

        // params
        startStr1 = item1.timeShaft[0];
        endStr1 = item1.timeShaft[item1.timeShaft.length-1];
        startStr2 = item2.timeShaft[0];
        endStr2 = item2.timeShaft[item2.timeShaft.length-1];

        start1 = new Date(startStr1).valueOf();
        end1 = new Date(endStr1).valueOf();
        start2 = new Date(startStr2).valueOf();
        end2 = new Date(endStr2).valueOf();

        // calculate for new start time and end time
        start = Math.min(start1, start2);
        end = Math.max(end1, end2);

        // 2 包含 1
        if( start === start2 && end === end2 ) {
            // we need not to do anything
            return;
        }
        // 1 包含 2
        if( start === start1 && end === end1 ) {
            this.removeItem(key2);
            return {
                key: key1,
                value: item1
            };
        }
        // 1右和2左 部分重叠
        if( start === start1 && end === end2 ) {
            index = item1.timeShaft.indexOf(startStr2);
            if( index === -1 ) return;
            data = item1.list[0].data.slice(0, index)
                .concat(item2.list[0].data);
            ts = item1.timeShaft.slice(0, index)
                .concat(item2.timeShaft);

            this.removeItem(key2);
            return {
                key: prefix.formatEL( {start: start1, end: end2} ),
                value: {
                    list: [{data: data, dsItemId: dsId}],
                    timeShaft: ts
                }
            };
        } 
        // 1左和2右 部分重叠
        if( start === start2 && end === end1 ) {
            index =  item1.timeShaft.indexOf(endStr2);
            if( index === -1 ) return;
            data = item2.list[0].data
                .concat(item1.list[0].data.slice(index));
            ts = item2.timeShaft
                .concat(item1.timeShaft.slice(index));

            this.removeItem(key2);
            return {
                key: prefix.formatEL( {start: start2, end: end1} ),
                value: {
                    list: [{data: data, dsItemId: dsId}],
                    timeShaft: ts
                }
            };
        }
        return;
    };

    DSCache.prototype.isExist = function (key, id, tmFmt, tmStart, tmEnd) {
        var arr = [];
        var rangeStart, rangeEnd;
        if(key.indexOf('anal_' + id + '_' + tmFmt) === -1) return false;
        arr = key.split('_');
        if( typeof tmStart === 'string' ) tmStart = new Date(tmStart);
        if( typeof tmEnd === 'string' ) tmEnd = new Date(tmEnd);
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
        
        if(typeof time === 'string') time = new Date(time);
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


    ////////////
    // RETURN //
    ////////////
    return {
        ds: new DSCache()
    }
} (window));