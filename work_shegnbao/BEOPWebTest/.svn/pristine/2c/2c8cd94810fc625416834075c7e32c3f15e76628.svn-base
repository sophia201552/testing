(function () {
    function AddProModal() {
        this.screen = null;
    }
    AddProModal.prototype.show = function (screen) {
        var _this = this;
        this.$addProj = undefined;
        this.showModal();
        this.screen = screen;
    };
    AddProModal.prototype.showModal = function () {
        var _this = this;
        WebAPI.get('/static/app/WebFactory/scripts/modals/addProject/addProject.html').done(function (resultHtml) {
            if (resultHtml) {
                $('#modalframe').append(resultHtml);
                _this.addEvent();
            }
        });
    };
    AddProModal.prototype.addEvent = function () {
        var _this = this;
        _this.$addProj = $('#addProj');
        _this.$addProj.modal();
        I18n.fillArea(_this.$addProj.fadeIn());
        var postData = {}, itemList = {};
        var proNameVal;
        $('#addNewPro').off('click').click(function () {
            _this.$addProj.find('.wrongAlert').html('');
            proNameVal = _this.$addProj.find('.proName').val();
            if (proNameVal === '') {
                _this.$addProj.find('.wrongAlert').html(I18n.resource.admin.welcom.newProj.LOG_ADD);//'项目名称或项目中文名称或项目英文名称不能为空！'
            } else {
                postData = {
                    userId: AppConfig.userId,
                    proName: proNameVal,
                    proZhName: proNameVal,
                    proEnName: proNameVal
                };
                WebAPI.post('/factory/addProject/save', postData).done(function (result) {
                    if (result.status === 'OK') {
                        var $proBox;
                        itemList = {
                            id: result.data._id,
                            name_cn: proNameVal
                        };
                        $proBox = _this.screen.createProItem(itemList, AppConfig.userId);
                        _this.screen.$projectList.append($proBox);
                        _this.$addProj.remove();
                        //新建项目默认进入项目
                        $proBox.children('.proText').click();
                    } else {
                        _this.$addProj.find('.wrongAlert').html(result.msg);
                    } 
                });
            }
        });
        $('#addClose').off('click').click(function () {
            _this.$addProj.remove();
        })
        _this.$addProj.find('.close').off('click').click(function () {
            _this.$addProj.remove();
        });
    };
    AddProModal.prototype.close = function () {
        this.$addProj = null;
    };
    window.AddProModal = new AddProModal();
}());