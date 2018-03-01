;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(namespace('beop.util'), function (exports) {

    exports.MergeDiff = (function () {

        /** 将最终输出结果格式化成想要的方式 */
        function mergeGroup(id, group) {
            var rs = {
                _id: id,
                v: {},
                k: 'E'
            };
            var newDiff = null;

            // 合并所有编辑类的操作
            group.forEach(function (d) {
                var len = d.path.length;
                var kv = {};

                // 如果在这里发现有对象级别的操作，则说明随着业务逻辑的扩展，有一些新的情况没有被考虑到
                if (d.length === 1) {
                    Log.warn('root object \"' + d.path[0] + '" has an unexpected operation that has not been considered, we will ignore it.');
                    return;
                }

                // 属性的新增操作
                if (d.kind === 'N') {
                    // 将此新增操作合并到编辑操作中
                    if (len === 2) {
                        rs.v[d.path[1]] = d.rhs;
                    } else {
                        Log.warn('property "' + d.path.join('.') + '" is a object, expect not a object, will ignore it and do not upload to the server.');
                    }
                }
                // 编辑操作
                else if (d.kind === 'E') {
                    // 合并编辑操作
                    if (len === 2) {
                        rs._id = d.path[0];
                        kv[d.path[1]] = d.rhs;
                        rs.v = $.extend(false, rs.v, kv);
                    } else {
                        Log.warn('property "' + d.path.join('.') + '" is a object, expect not a object, will ignore it and do not upload to the server.');
                    }
                }
                // 删除操作
                else if (d.kind === 'D') {
                    // 将此删除操作合并到编辑操作中
                    if (len === 2) {
                        if (rs.v.hasOwnProperty(d.path[1])) {
                            delete rs.v[d.path[1]];
                        }
                    } else {
                        Log.warn('property "' + d.path.join('.') + '" is a object, expect not a object, will ignore it and do not upload to the server.');
                    }
                } else {
                    Log.warn('there shouldn\'t have any type except \'N\', \'E\' or \'D\' in the group diffs, unusual type: ' + d.kind);
                }
            });

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

                // 若操作为对象层级的操作，则后续所有操作均被忽略
                if (map[id].length === 1 && map[id][0].path.length === 1) return;
                
                // 若为对象层级的操作，则覆盖所有其他操作
                if (d.path.length === 1) {
                    map[id] = [d];
                    return;
                }

                map[id].push(d);
            }, this);

            // 格式化和合并
            for (var id in map) {
                if (!map.hasOwnProperty(id)) continue;

                // 若为对象层级的操作，则跳过进一步的合并操作
                if (map[id].length === 1 && map[id][0].path.length === 1) {
                    // 格式化对象
                    if (map[id][0].kind === 'D') {
                        rs.push({
                            k: 'D',
                            _id: map[id][0].lhs['_id']
                        });
                    } else if (map[id][0].kind === 'N') {
                        rs.push({
                            k: 'N',
                            v: map[id][0].rhs
                        });
                    }
                    continue;   
                }
                // 能走到这一步的，说明都是属性级别的操作，对象层级的操作在这之前已经全部过滤掉了
                rs.push( mergeGroup(id, map[id]) );
            }

            return rs;
        }
    } ());
}));