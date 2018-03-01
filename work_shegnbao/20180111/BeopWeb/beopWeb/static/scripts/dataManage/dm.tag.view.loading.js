var DmTagLoading = (function () {
    var _this;

    function DmTagLoading(projectId) {
        _this = this;
        PointManager.call(_this, projectId);
        _this.htmlUrl = '/static/scripts/dataManage/views/dm.importTag.html';
        _this.projectId = projectId;
    }

    DmTagLoading.prototype = Object.create(PointManager.prototype);
    DmTagLoading.prototype.constructor = DmTagLoading;


    var DmTagLoadingFunc = {
        show: function () {
            _this.init().done(function () {
                _this.$container = $("#tagContainer");
                _this.$container.html(beopTmpl('tpl_tag_loading'));
                _this.attachEvents();
                var getProcessInterval = setInterval(function () {
                    WebAPI.post('/tag/syncProgress/', {'projId': AppConfig.projectId}).done(function (result) {
                        if (result.success) {
                            if (!result.data) {
                                return;
                            }
                            if (result.data.progress == result.data.pointCount) {
                                clearInterval(getProcessInterval);
                                if (result.data.hasTasg == 1) {
                                    location.href = '#page=DmTagMark&projectId=' + AppConfig.projectId;
                                } else {
                                    location.href = '#page=DmTagTreeEdit&projectId=' + AppConfig.projectId;
                                }
                            }
                        }
                    })
                }, 2500);

                I18n.fillArea(_this.$container);
            });
        },

        /***
         * 添加方法
         */
        dmCancel: function () {
            location.href = '#page=DmTagIntroduce&projectId=' + _this.projectId;
        },

        // 绑定事件
        attachEvents: function () {
            _this.$container.off('click.dmCancel').on('click.dmCancel', '#dmCancel', _this.dmCancel);
        },
        // 取消事件
        detachEvents: function () {

        }
    };
    $.extend(DmTagLoading.prototype, DmTagLoadingFunc);
    return DmTagLoading;
})();
