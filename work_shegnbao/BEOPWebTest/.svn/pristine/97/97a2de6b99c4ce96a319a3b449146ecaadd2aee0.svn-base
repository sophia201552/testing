(function () {
    function ReleaseModal() {
        this.idFlag = undefined;
        this.pageId = undefined;
    }

    ReleaseModal.prototype.show=function(id,pageId){
        var _this = this;
        this.idFlag = id;
        this.pageId = pageId?pageId:'';
        this.showModal();
    };

    ReleaseModal.prototype.showModal = function () {
        var _this = this;

        WebAPI.get('/static/app/WebFactory/scripts/screens/page/modals/releaseModal/releaseModal.html')
        .done(function (resultHtml) {
            if (resultHtml) {
                $('#mainframe').parent().append(resultHtml);

                // 初始化项目列表下拉框
                _this.initDropDownList();

                // 绑定事件
                _this.attachEvents();

                $('#releaseModal').modal('show');
                I18n.fillArea($('#releaseModal').fadeIn());
            }
        });
    };

    ReleaseModal.prototype.initDropDownList = function () {
        var arrHtml = ['<option value="-1" i18n="mainPanel.releaseRepeat.SELECT"></option>'];//请选择
        var $relProj = $('#relProj');
        var $projNameBox = $('.projNameBox');

        arrHtml = AppConfig.projectList.map(function (row) {
            return '<option value="{id}">{name_cn}</option>'.formatEL(row);
        });

        $relProj.html(arrHtml.join(''));
        if (this.idFlag === 'lkRelease') {
            $relProj.prepend('<option value="newProject" i18n="mainPanel.releaseRepeat.NEW_PROJECT"></option>');//新项目
            if ($relProj.val() === 'newProject') {
                $projNameBox.show();
                $('#relPName').val(AppConfig.project.cnName);
            }
        } else {
            $projNameBox.hide();
        }
    };

    ReleaseModal.prototype.attachEvents = function () {
        var _this = this;
        var $releaseModal = $('#releaseModal');
        var $relProj = $('#relProj');

        //发布事件
        $releaseModal.find('.directRelease').off('click').click(function () {
            var $this = $(this);
            $releaseModal.find('.releaseFst').hide();
            $releaseModal.find('.releaseSnd').show();
            $releaseModal.find('.modal-title').html(I18n.resource.mainPanel.releaseRepeat.RELEASE_TITLE);
            $this.html(I18n.resource.mainPanel.releaseRepeat.TITLE);

            $relProj.change(function () {
                var $projNameBox = $('.projNameBox');
                if ($(this).val() === 'newProject' && _this.idFlag === 'lkRelease') {
                    $projNameBox.show();
                    $('#relPName').val(AppConfig.project.cnName);
                } else {
                    $projNameBox.hide();
                }
            });

            $this.off('click').click(function () {
                var relProjVal = $('#relProj').val();
                var projId = Number(relProjVal) ? Number(relProjVal) : relProjVal;
                var password = $('#relPass').val();
                var $errTip = $releaseModal.find('.wrongPromt');
                var relPName = $('#relPName').val();
                var project;

                if (projId === -1) {
                    $errTip.html(I18n.resource.mainPanel.releasePage.RELEASE_INFO_TIP);
                    return;
                }

                AppConfig.projectList.some(function (row) {
                    if (row.id === projId) {
                        project = row;
                        return true;
                    }
                    return false;
                });

                if (project) {
                    if (password === '') {
                        $errTip.html(I18n.resource.mainPanel.releasePage.RELEASE_INFO);
                        return;
                    }
                } else {
                    if (password === '') {
                        $errTip.html(I18n.resource.mainPanel.releaseProject.RELEASE_INFO);
                        return;
                    }
                }
                // 清除错误信息
                $errTip.html('');
                //if (_this.idFlag === 'lkRelease') {
                if (relProjVal === 'newProject') {
                    projId = -1;//发布为新项目时将projId设为-1
                }
                if (_this.idFlag === 'lkRelease') { 
                    if (relPName === '') {
                        $errTip.html('项目名称不能为空！');
                        return;
                    }
                }
                if (password !== '') { 
                    _this.publish(projId, _this.pageId, password, relPName);
                    $this.attr('disabled', 'disabled');
                    Spinner.spin($('#mainframe')[0]);
                }
                //} else if (_this.idFlag === 'lkReleasePage') {
                    //if(_this.pageId!==''){
                    //    _this.pagePublish(projId,_this.pageId);
                    //}
                //}
            });
        });
        $releaseModal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
            $('#releaseModalWrap').remove();
        });
    };

    ReleaseModal.prototype.publish = function (tProjId, pageId, password, relPName) {
        var data = pageId?{
            sourceId: pageId,
            targetId: pageId,
            projId: tProjId,
            password: password,
            userId: AppConfig.userId,
            type: 1//0项目1页面
        } : {
            sourceId: AppConfig.project.id,
            targetId: tProjId,
            userId: AppConfig.userId,
            password: password,
            userId: AppConfig.userId,
            projName: relPName,
            type: 0
        };

        WebAPI.post('/factory/publish', data).done(function(rs) {
            if (rs.status === 'OK') {
                alert(I18n.resource.mainPanel.releaseRepeat.OK);
            } else {
                alert(rs.msg || I18n.resource.mainPanel.releaseRepeat.NO);
            }
        }).always(function () {
            $('#releaseModal').modal('hide');
            $('.directRelease').removeAttr('disabled');
            Spinner.stop();
        });
    };
    ReleaseModal.prototype.close = function () {
        this.idFlag = null;
    };

    window.ReleaseModal = new ReleaseModal();
}());