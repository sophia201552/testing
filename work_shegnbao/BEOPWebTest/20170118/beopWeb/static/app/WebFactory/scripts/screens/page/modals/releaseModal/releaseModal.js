(function (exports) {
    function ReleaseModal() {
        this.pageId = undefined;
    }

    ReleaseModal.prototype.show = function(screen, pageId){
        this.screen = screen;
        this.pageId = pageId ? pageId : '';
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
        var arrHtml = ['<option value="-1" i18n="mainPanel.releaseRepeat.NEW_PROJECT"></option>'];
        var $relProj = $('#relProj');
        var bindId = AppConfig.project.bindId || -1;
        var project;

        if (bindId === -1) {
            $relProj.val(AppConfig.project.cnName);
            $relProj[0].dataset.id = -1;
            return;
        }

        AppConfig.projectList.some(function (row) {
            if (row.id === bindId) {
                project = row;
                return true;
            }
            return false;
        });

        if (project) {
            $relProj.val(project.name_cn);
            $relProj[0].dataset.id = project.id;
        } else {
            $relProj.val(AppConfig.project.cnName);
            $relProj[0].dataset.id = -1;
            alert('绑定项目丢失，继续发布将发布为新项目！');
        }
    };

    ReleaseModal.prototype.attachEvents = function () {
        var _this = this;
        var $releaseModal = $('#releaseModal');
        var $relProj = $('#relProj');

        //发布事件
        $releaseModal.find('.directRelease').off('click').click(function () {
            var $this = $(this);
            var projId = $('#relProj')[0].dataset.id;
            var password = $('#relPass').val();
            var $errTip = $releaseModal.find('.wrongPromt');
            var relPName = $('#relProj').val();
            var promise;
            
            projId = Number(projId) ? Number(projId) : projId;

            // 清除错误信息
            $errTip.html('');

            // 检查密码是否为空
            if (!password) {
                return $errTip.html(I18n.resource.mainPanel.releasePage.RELEASE_INFO);
            }

            if (!_this.pageId && projId === '-1' && relPName === '') {
                return $errTip.html(I18n.resource.admin.welcom.newProj.LOG_ADD);
            }

            // 发布
            $this.prop('disabled', true);
            _this.publish(projId, password, relPName);
            Spinner.spin($('#mainframe')[0]);
        });

        $releaseModal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
            $('#releaseModalWrap').remove();
        });
    };

    ReleaseModal.prototype.publish = function (tProjId, password, relPName) {
        var data;
        var pageList, pageIds, parentId, refPageIds;
        var models;
        // 发布页面
        if (this.pageId) {
            data = {
                sourceId: AppConfig.project.id,
                password: password,
                userId: AppConfig.userId,
                // 页面
                type: 1
            };
            // 如果发布页面是存在于文件夹中的，则需要将其所有文件夹的 id 一起进行发布
            pageList = this.screen.getPagesData().serialize();
            pageIds = [];
            refPageIds = [];
            parentId = this.pageId;

            // 循环遍历将包含该页面的所有文件夹找出来
            while(parentId) {
                pageList.some(function (row) {
                    if (row._id === parentId) {
                        pageIds.push(parentId);
                        parentId = row.parent;
                        return true;
                    }
                    return false;
                });
            }
            data['pageIds'] = pageIds;

            switch(true) {
                // 如果是 FacReportWrapScreen，则需要将其引用的报表也都进行发布
                case this.screen.page instanceof namespace('factory.screens.FacReportWrapScreen'):
                    this.screen.page.store.list.forEach(function (row) {
                        refPageIds.push(row.reportId);
                    });
                    break;
                // 如果是 PageScreen，则需要将其包含的控件引用的页面也进行发布
                case this.screen.page instanceof namespace('factory.screens.PageScreen'):
                    // 图片控件、文本控件、按钮控件需要将其跳转的页面也进行发布
                    // screen容器控件，需要将其引用的页面 id 也进行发布
                    models = this.screen.page.getModelsByType(['CanvasImage', 'HtmlText', 'HtmlButton', 'HtmlScreenContainer']);
                    // 将引用的页面 id 都加进来
                    models.forEach(function (row) {
                        var pageId = row['option.pageId']();
                        if (pageId) {
                            refPageIds.push(pageId);
                        }
                    });
                    break;
            }
            data['refPageIds'] = refPageIds;
        }
        // 发布项目
        else {
            data = {
                sourceId: AppConfig.project.id,
                targetId: tProjId,
                userId: AppConfig.userId,
                password: password,
                // 项目
                type: 0
            };
            if (tProjId === -1) {
                data['projName'] = relPName;
            }
        }

        WebAPI.post('/factory/publish', data).done(function(rs) {
            if (rs.status === 'OK') {
                if (rs.data) {
                    // 更新绑定的线上项目 id
                    AppConfig.project.bindId = rs.data.bindId;
                    // 如果是发布到新项目，则需要更新本地的项目列表
                    if (tProjId === -1) {
                        AppConfig.projectList.push({
                            id: rs.data.bindId,
                            name_cn: relPName,
                            name_en: relPName,
                            name_english: relPName
                        });
                    }
                }
                alert(I18n.resource.mainPanel.releaseRepeat.OK);
            } else {
                alert(rs.msg || I18n.resource.mainPanel.releaseRepeat.NO);
            }
        }).always(function () {
            $('#releaseModal').modal('hide');
            $('.directRelease').prop('disabled', false);
            Spinner.stop();
        });
    };
    ReleaseModal.prototype.close = function () {
        this.pageId = null;
    };

    exports.ReleaseModal = new ReleaseModal();
}( window ));