/** Tag Match  */
;(function(root, factory) {
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
            namespace('beop.strategy.enumerators')
        );
    }
}(namespace('beop.strategy.common'), function(
    exports,
    enums
) {

    const UNDF = window.undefined;

    function _match(srcArr, destArr) {
        if (!srcArr.length) {
            return 0;
        }

        let srcArrLen = srcArr.length;
        let destArrLen = destArr.length;
        // shadow copy
        srcArr = srcArr.slice();
        destArr = destArr.slice();

        let item, i = 0;
        while ( item = srcArr[i] ) {
            if (destArr.indexOf(item) > -1) {
                srcArr = srcArr.filter(row => row !== item);
                destArr = destArr.filter(row => row !== item);
            } else {
                i += 1;
            }
        }

        return Math.min(
            (srcArrLen - srcArr.length) / srcArrLen,
            (destArrLen - destArr.length) / destArrLen 
        );
    }

    function matchGroups(mods, groups) {
        if (!mods || !mods.length) {
            return UNDF;
        }

        if (Object.prototype.toString.call(groups) !== '[object Array]') {
            groups = [groups];
        }

        let similarity = {};
        mods.forEach(mod => {
            let tags = mod.option.tags || [];
            similarity[mod._id] = {};
            groups.forEach(gp => {
                similarity[mod._id][gp._id] = _match(tags, gp['tag'] || []);
            });
        });
        return similarity;
    }

    function matchThings(mod, things) {
        if (!mod) {
            return UNDF;
        }
        let modTags = mod.option.tags;
        let similarity = {
            'input': {},
            'output': {}
        };

        if (Object.prototype.toString.call(things) !== '[object Array]') {
            things = [things];
        }

        Object.keys(similarity).forEach(type => {
            let data = mod.option[type];
            data.forEach(row => {
                if (row.option && (row.option.type === enums.fuzzyRuleInputOutputTypes.FORMULA ||
                    row.option.type === enums.fuzzyRuleInputOutputTypes.SERIESANALYSISCODE)) {
                    return false;        
                }
                let dataSimilarity = similarity[type][row['_id']] = {};
                let tags = row['option'] && row['option']['tags'];
                tags = tags || [];
                things.forEach(thing => {
                    dataSimilarity[thing['_id']] = _match(tags, thing['tag'] || []);
                });
            });
        });

        return similarity;
    }

    exports.tagMatcher = {
        matchGroups,
        matchThings
    }
}));