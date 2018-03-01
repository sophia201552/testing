var PointManagerImportTagTpl = (function () {
    var _this;
    function PointManagerImportTagTpl(projectId) {
        _this = this;
        PointManager.call(_this, projectId);
        _this.htmlUrl = '/static/scripts/dataManage/views/dm.importTag.html';
        _this.projectId = projectId;
    }

    PointManagerImportTagTpl.prototype = Object.create(PointManager.prototype);
    PointManagerImportTagTpl.prototype.constructor = PointManagerImportTagTpl;


    var PointManagerImportTagTplFunc = {
        show: function () {
            _this.init().done(function () {
                _this.$tagBox = $("#tagBox");
                //_this.$tagBox.html(beopTmpl('tpl_tag_create'));
                _this.attachEvents();
            });
        },

        /***
         * 添加方法
         */


        // 绑定事件
        attachEvents: function () {
            //_this.$tagBox.off('click.test').on('click.test', '.test', _this.test);
        },
        // 取消事件
        detachEvents: function () {

        }
    };
    $.extend(PointManagerImportTagTpl.prototype, PointManagerImportTagTplFunc);
    return PointManagerImportTagTpl;
})();
