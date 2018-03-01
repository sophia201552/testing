var PointManagerCloudPoint = (function () {
    function PointManagerCloudPoint(projectId, pointType, pointID) {
        PointManager.call(this, projectId);
        this.pointId = pointID;
        this.pointType = pointType;
        this.htmlUrl = "/static/scripts/dataManage/views/dm.cloudPoint.html";
    }

    PointManagerCloudPoint.prototype = Object.create(PointManager.prototype);
    PointManagerCloudPoint.prototype.constructor = PointManagerCloudPoint;

    var PointManagerCloudPointFunc = {
        show: function () {
            var _this = this;
            this.init().done(function () {
                beop.view.cloudSheet.init($("#cloudPointWrapper"), 1, _this.pointType, _this.pointId);
                I18n.fillArea($(ElScreenContainer));
                $('[data-toggle="tooltip"]').tooltip();
            })
        },
        close: function () {
            beop.view.cloudSheet.destroy();
        }
    };

    $.extend(PointManagerCloudPoint.prototype, PointManagerCloudPointFunc);

    return PointManagerCloudPoint;
})();
