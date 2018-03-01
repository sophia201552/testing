var PointManagerCloudPoint = (function () {
    function PointManagerCloudPoint(projectId, pointType) {
        PointManager.call(this, projectId);
        this.pointType = pointType;
        this.htmlUrl = "/static/views/observer/pointManagerCloudPoint.html";
    }

    PointManagerCloudPoint.prototype = Object.create(PointManager.prototype);
    PointManagerCloudPoint.prototype.constructor = PointManagerCloudPoint;

    var PointManagerCloudPointFunc = {
        show: function () {
            var _this = this;
            this.init().done(function () {
                beop.view.cloudSheet.init($("#cloudPointWrapper"), 1, _this.pointType);
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
