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

                Spinner.spin(document.getElementById('tagContainer'));
                WebAPI.get('/tag/project/state/' + AppConfig.projectId).done(function (result) {
                    if (result.success) {
                        if (!result.data.group) {
                            _this.dmNext();
                        } else {
                            var Spinner = new LoadingSpinner({color: '#00FFFF'});
                            Spinner.spin(document.getElementById('tagContainer'));
                            WebAPI.post('/tag/syncProgress/', {'projId': AppConfig.projectId}).done(function (result) {
                                if (result.success) {
                                    if (!result.data) {
                                        return;
                                    }
                                    if (result.data.progress === result.data.pointCount) {
                                        if (result.data.hasTasg == 1) {
                                            location.href = '#page=DmTagMark&projectId=' + AppConfig.projectId;
                                        } else {
                                            location.href = '#page=DmTagTreeEdit&projectId=' + AppConfig.projectId;
                                        }
                                    } else {
                                        _this.dmNext();
                                        I18n.fillArea(_this.$container);
                                    }
                                }
                            }).always(function () {
                                Spinner.stop();
                            })
                        }
                        I18n.fillArea(_this.$container);
                    } else {
                        throw error('请求失败');
                    }
                }).fail(function () {
                    alert('请求失败');
                }).always(function () {
                    Spinner.stop();
                });
            });
        },

        /***
         * 添加方法
         */
        dmNext: function () {
            WebAPI.get('/tag/syncCloudPointToThingTree/' + AppConfig.projectId);
            location.href = '#page=DmTagLoading&projectId=' + _this.projectId;
        },
    };
    $.extend(DmTagIntroduce.prototype, DmTagIntroduceFunc);
    return DmTagIntroduce;
})();
