var DmTagIntroduce = (function () {
    var _this;

    function DmTagIntroduce(projectId) {
        _this = this;
        PointManager.call(_this, projectId);
        _this.htmlUrl = '/static/scripts/dataManage/views/dm.importTag.html';
        _this.projectId = projectId;
    }

    DmTagIntroduce.prototype = Object.create(PointManager.prototype);
    DmTagIntroduce.prototype.constructor = DmTagIntroduce;


    var DmTagIntroduceFunc = {
        show: function () {
            _this.init().done(function () {
                _this.$container = $("#tagContainer");
                _this.$container.html(beopTmpl('tpl_tag_create'));
                _this.attachEvents();
            });
        },

        /***
         * 添加方法
         */
        dmNext: function () {
            WebAPI.get('/tag/syncCloudPointToThingTree/' + AppConfig.projectId);
            location.href = '#page=DmTagLoading&projectId=' + _this.projectId;
        },

        dmEdit: function () {
            location.href = '#page=DmTagTreeEdit&projectId=' + _this.projectId;
        },

        // 绑定事件
        attachEvents: function () {
            _this.$container.off('click.dmNext').on('click.dmNext', '#dmNext', _this.dmNext);
            _this.$container.off('click.dmEdit').on('click.dmEdit', '#dmEdit', _this.dmEdit);
        },
        // 取消事件
        detachEvents: function () {

        }
    };
    $.extend(DmTagIntroduce.prototype, DmTagIntroduceFunc);
    return DmTagIntroduce;
})();
