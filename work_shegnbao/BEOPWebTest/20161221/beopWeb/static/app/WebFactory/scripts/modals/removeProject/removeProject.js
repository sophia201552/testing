(function () {
    function RemoveProModal() {
        this.screen = undefined;
        this.projectId = undefined;
    }
    RemoveProModal.prototype.show = function (screen, projectId) {
        var _this = this;
        this.showModal();
        this.screen = screen;
        this.projectId = projectId;
    }
    RemoveProModal.prototype.showModal = function () {
        var _this = this;
        WebAPI.get('/static/app/WebFactory/scripts/modals/removeProject/removeProject.html').done(function (resultHtml) {
            if (resultHtml) {
                $('#mainframe').parent().append(resultHtml);
                //绑定事件
                _this.eventAll();
            }
        });
    }
    RemoveProModal.prototype.eventAll = function () {
        var _this = this;
        var $removeProModal = $('#removeProModal');
        $removeProModal.modal();
        I18n.fillArea($removeProModal.fadeIn());
        $removeProModal.find('.btn-primary').off('click').click(function () {
            $removeProModal.remove();
        });
        $removeProModal.find('.directRemove').off('click').click(function () {
            var $this = $(this);
            $removeProModal.find('.removeProFst').hide();
            $removeProModal.find('.removeProSnd').show();
            //$removeProModal.find('.modal-title').html('发布到');
            $this.html(I18n.resource.admin.welcom.deleteProj.OK);
            $this.off('click').click(function () {
                _this.screen.removeProItem(_this.projectId);
                //var password = $('#removePass').val();
                //var relName = $('#removeName').val();
                //if (password === '' || relName == '') {
                //    $removeProModal.find('.wrongPromt').html('请填写密码或项目名称');
                //} else {
                //    $removeProModal.find('.wrongPromt').html('');
                //    var postData = {
                //        userId: AppConfig.userId,
                //        projId: $dom.parent().attr('projectid'),
                //        proPass: password,
                //        proNameEnglish: relName
                //    };
                //    WebAPI.post('/factory/removeProject/remove', postData).done(function (result) {
                //        //console.log(result);
                //        if (result.status === 'OK') {
                //            $dom.parent('.proHover').remove();
                //            $removeProModal.remove();
                //            var arr = JSON.parse(localStorage.getItem('fac_project_topArray_' +AppConfig.userId));
                //            if (arr.length !== 0) {
                //                for (var i = 0; i < arr.length; i++) {
                //                    if ($dom.parent().attr('projectid') == arr[i].id) {
                //                        arr.splice(i, 1);
                //                        console.log(arr);
                //                        localStorage.setItem('fac_project_topArray_' + AppConfig.userId, JSON.stringify([]));
                //                        localStorage.setItem('fac_project_topArray_' + AppConfig.userId, JSON.stringify(arr));
                //                    }
                //                }
                //            }
                //        }
                //    });
                //}
            });
        });
        $removeProModal.find('.close').off('click').click(function () {
            $removeProModal.remove();
        });
    }
    window.RemoveProModal = new RemoveProModal();
}());