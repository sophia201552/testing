var DmTagMain = (function () {
    var _this;

    function DmTagMain(projectId) {
        _this = this;
        PointManager.call(_this, projectId);
        _this.htmlUrl = '/static/scripts/dataManage/views/dm.importTag.html';
        _this.projectId = projectId;
        _this.nextPage = 'DmTagIntroduce';  // Create Loading Edit View
    }

    DmTagMain.prototype = Object.create(PointManager.prototype);
    DmTagMain.prototype.constructor = DmTagMain;


    var DmTagFunc = {
        show: function () {
            _this.init().done(function () {
                _this.$container = $("#tagContainer");
                _this.attachEvents();
                location.hash = 'page=' + _this.nextPage + '&projectId=' + _this.projectId;
            });
        },

        // 绑定事件
        attachEvents: function () {
        },
        // 取消事件
        detachEvents: function () {

        }
    };
    $.extend(DmTagMain.prototype, DmTagFunc);
    return DmTagMain;
})();
