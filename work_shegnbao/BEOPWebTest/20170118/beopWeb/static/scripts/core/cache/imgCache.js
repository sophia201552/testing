// dependencies: ['jQuery']
(function ($, undefined) {
    var DB_INFO = {
        driver: 'indexedDB',
        storeName: 'thumbnail'
    };

    function imgCache() {
        this.db = new Beop.cache.BaseCache(DB_INFO);
    }

    imgCache.prototype.getChkByWs = function (workspace) {
        var keyList = wsList2keyList([workspace]);
    
        return this.db.getItemList(keyList).then(function (rs) {
            var index;
            for (var k in rs) {
                if (!rs.hasOwnProperty(k)) {
                    continue;
                }
                if( ( index = keyList.indexOf(k) ) > -1 ) {
                    keyList.splice(index, 1);
                }
            }
            return {data: rs, absentList: keyList.map(function (row) { return row.split('_')[1]; })};
        });
    };

    imgCache.prototype.getByWsList = function (workspaceList) {
        var keyList = wsList2keyList(workspaceList);
        return this.db.getItemList(keyList);
    };

    imgCache.prototype.setByWs = function (workspace) {
        return this.setByWsList([workspace]);
    };

    imgCache.prototype.setByWsList = function (workspaceList) {
        var kvList = wsList2kvList(workspaceList);
        return this.db.setItemList(kvList);
    };

    imgCache.prototype.removeByWsList = function (workspaceList) {
        var keyList = wsList2keyList(workspaceList);
        return this.db.removeItemList(keyList);
    };

    imgCache.prototype.set = function (wsId, modalId, imagebin) {
        return this.db.setItem(wsId+'_'+modalId, imagebin);
    };

    ////////////////////
    // util functions //
    ////////////////////
    function wsList2keyList(workspaceList) {
        var keyList = [];
        workspaceList.forEach(function (workspace) {
            var wsId = workspace.id;
            keyList = keyList.concat( workspace.modalList.map(function (modal) {
                return wsId+'_'+modal.id;
            }) );
        });
        return keyList;
    }

    function wsList2kvList(workspaceList) {
        var kvList = [];
        workspaceList.forEach(function (workspace) {
            var wsId = workspace.id;

            workspace.modalList.forEach(function (modal) {
                if(!modal.imagebin || !modal.id || !wsId) {
                    return false;
                }
                kvList.push({key: wsId+'_'+modal.id, value: modal.imagebin});
            });
        });
        return kvList;
    }

    /////////////
    // exports //
    /////////////
    this.Beop = this.Beop || {};
    this.Beop.cache = this.Beop.cache || {};
    
    this.Beop.cache.img = new imgCache();

}).call(this, jQuery);