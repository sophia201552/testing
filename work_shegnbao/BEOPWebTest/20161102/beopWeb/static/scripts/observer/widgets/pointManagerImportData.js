var PointManagerImportData = (function () {

    function PointManagerImportData(projectId) {
        PointManager.call(this, projectId);
        this.htmlUrl = '/static/views/observer/pointManagerImportData.html';
    }

    PointManagerImportData.prototype = Object.create(PointManager.prototype);
    PointManagerImportData.prototype.constructor = PointManagerImportData;

    var PointManagerImportDataFunc = {
        show: function () {
            var _this = this;
            this.init().done(function () {
                if (AppConfig.projectName != null) {
                    $('#stPjName').html(AppConfig.projectName);
                }
                _this.attachEvents();
                I18n.fillArea($(ElScreenContainer));
            });
        },
        close: function () {
            this.detachEvents();
        },

        attachEvents: function () {
            var _this = this;

            // form elements
            var $pjData = $('#iptPjData');
            var $btnConfirm = $('#btnConfirmUpload');

            // upload *.csv elements
            var $spUploadInfo = $('#spUploadInfo');
            var $btnUploadCSV = $('#btnUploadCSV');

            // upload drag and drop elements
            var $divPjDataDropHandler = $('#divPjDataDropHandler');
            var $tip = $divPjDataDropHandler.children('p');
            var $uploadMask = $('#uploadMask');
            var $body = $('body');

            // -1: error
            // 0: success
            var uploadStatus = -1;
            var fileSelected;
            var dragFix = false;

            $spUploadInfo.tooltip({title: '', trigger: 'manual', placement: 'right'});

            var uploadHandler = function (file) {
                var formData = new FormData();
                var match = file.name.match(/\.[A-Za-z0-9]+$/);
                var supportFiles = ['.csv', '.xls', '.xlsx'];
                if (!file || !match || supportFiles.indexOf(match[0].toLowerCase()) < 0) {
                    util.tooltip.show($spUploadInfo, I18n.resource.dataManage.INVALID_FILE_TYPE);
                    isDataUploadReady = false;
                    return;
                }
                fileSelected = file;
                formData.append('config-file', file);
                $.ajax({
                    url: '/get_config_data/' + AppConfig.userId,
                    type: 'post',
                    data: formData,
                    dataType: 'json',
                    xhr: function () {
                        var xhr = $.ajaxSettings.xhr();
                        if (xhr.upload) {
                            xhr.upload.addEventListener('progress', function (e) {
                                var progress = Math.round(e.loaded / e.total);
                                if (e.lengthComputable) {
                                    $('#spUploadInfo').html(I18n.resource.dataManage.UPLOADING + progress * 100 + '%');
                                }
                            }, false);
                            xhr.upload.addEventListener('load', function (e) {
                                $('#spUploadInfo').html(I18n.resource.dataManage.PROCESSING);
                            }, false);
                        }
                        return xhr;
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                }).done(function (rs) {
                    $('#spUploadInfo').removeClass()
                        .addClass('text-success')
                        .html(I18n.resource.dataManage.UPLOAD_SUCCESS + file.name);
                    uploadStatus = 0;
                    $('#btnConfirmUpload').removeAttr('disabled');
                }).fail(function (err) {
                    $('#spUploadInfo').removeClass()
                        .addClass('text-danger')
                        .html(I18n.resource.dataManage.UPLOAD_FAILED);
                    uploadStatus = -1;
                });
            };
            var fileNameList = [];

            var uploadHandlerEx = function (file) {
                fileNameList = [];
                var formData = new FormData();
                for (var i = 0; i < file.length; i++) {
                    var match = file[i].name.match(/\.[A-Za-z0-9]+$/);
                    var supportFiles = ['.csv', '.xls', '.xlsx'];
                    if (!file[i] || !match || supportFiles.indexOf(match[0].toLowerCase()) < 0) {
                        util.tooltip.show($spUploadInfo, I18n.resource.dataManage.INVALID_FILE_TYPE);
                        isDataUploadReady = false;
                        return;
                    }
                    fileSelected = file[i];
                    formData.append('config-file', file[i]);
                    fileNameList.push(file[i].name);
                }
                Spinner.spin(ElScreenContainer);
                $.ajax({
                    url: '/get_config_data/' + AppConfig.userId,
                    type: 'post',
                    data: formData,
                    dataType: 'json',
                    xhr: function () {
                        var xhr = $.ajaxSettings.xhr();
                        if (xhr.upload) {
                            xhr.upload.addEventListener('progress', function (e) {
                                var progress = Math.round(e.loaded / e.total);
                                if (e.lengthComputable) {
                                    $('#spUploadInfo').html(I18n.resource.dataManage.UPLOADING + progress * 100 + '%');
                                }
                            }, false);
                            xhr.upload.addEventListener('load', function (e) {
                                $('#spUploadInfo').html(I18n.resource.dataManage.PROCESSING);
                            }, false);
                        }
                        return xhr;
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                }).done(function (rs) {
                    $('#spUploadInfo').removeClass()
                        .addClass('text-success')
                        .html(I18n.resource.dataManage.UPLOAD_SUCCESS + fileNameList.join(','));
                    uploadStatus = 0;
                    $('#btnConfirmUpload').removeAttr('disabled');
                }).fail(function (err) {
                    $('#spUploadInfo').removeClass()
                        .addClass('text-danger')
                        .html(I18n.resource.dataManage.UPLOAD_FAILED);
                    uploadStatus = -1;
                }).always(function () {
                    Spinner.stop();
                });
            };

            // bind *.csv upload event
            $btnUploadCSV.click(function (e) {
                $pjData.click();
            });
            $pjData.change(function () {
                uploadHandlerEx($(this)[0].files);
            });

            // drag and drop upload events
            // drag enter
            $divPjDataDropHandler.on('dragenter', function (e) {
                dragFix = true;
                $tip.html(I18n.resource.dataManage.DRAG_RELEASE_TIP);
                e.stopPropagation();
                e.preventDefault();
            });
            // drag leave
            $divPjDataDropHandler.on('dragleave', function (e) {
                dragFix = false;
                $tip.html(I18n.resource.dataManage.DRAG_TIP);
                e.stopPropagation();
                e.preventDefault();
            });
            // drop
            $divPjDataDropHandler.on('drop', function (e) {
                var files, file;
                $divPjDataDropHandler.hide();
                $uploadMask.hide();
                $tip.html(I18n.resource.dataManage.DRAG_TIP);
                // upload now
                files = e.originalEvent.dataTransfer.files;
                if (files.length > 1) alert(I18n.resource.dataManage.NOT_SUPPORT_MULTI_UPLOAD);
                file = files[0];
                uploadHandler(file);
                e.stopPropagation();
                e.preventDefault();
            });
            $uploadMask.on('dragleave', function (e) {
                e.stopPropagation();
                if (dragFix) return;
                $uploadMask.hide();
                $divPjDataDropHandler.hide();
            });
            $body.on('dragenter', function (e) {
                $divPjDataDropHandler.show();
                $uploadMask.show();
                e.preventDefault();
            });
            //  prevent 'drop' event on elements
            $body.add($uploadMask).add($divPjDataDropHandler).on('dragover', function (e) {
                e.preventDefault();
            });
            // mock escape event
            $body.on('keydown', function (e) {
                // console.log('body key up');
                if (e.keyCode === 27) {
                    $uploadMask.hide();
                    $divPjDataDropHandler.hide();
                    e.preventDefault();
                }
            });
            $body.on('drop', function (e) {
                $uploadMask.hide();
                $divPjDataDropHandler.hide();
                e.preventDefault();
            });

            $btnConfirm.click(function () {
                if (_this.projectId == null) {
                    alert(I18n.resource.dataManage.CHOOSE_PROJECT_FIRST);
                    return;
                }
                if (uploadStatus !== 0) {
                    alert(I18n.resource.dataManage.UPLOAD_DATA_FIRST);
                    return;
                }
                Spinner.spin($body[0]);
                // submit
                WebAPI.post('/project/import_user_data/' + AppConfig.userId, {
                    dataFileName: fileNameList,
                    projId: _this.projectId
                }).done(function (rs) {
                    if (typeof rs === 'object' && rs.error === 'successful') {
                        alert(I18n.resource.dataManage.DATA_IMPORT_SUCCESS);
                        ScreenManager.show(PointManager);
                    } else {
                        alert(I18n.resource.dataManage.DATA_IMPORT_FAILED);
                    }
                }).fail(function () {
                    alert(I18n.resource.dataManage.DATA_IMPORT_FAILED);
                }).always(function () {
                    Spinner.stop();
                });
            });
        },
        detachEvents: function () {
            // detachEvents drag and drop upload events
            $('#divPjDataDropHandler').off();
            $('#uploadMask').off();
            $('body').off();
        }
    };
    $.extend(PointManagerImportData.prototype, PointManagerImportDataFunc);
    return PointManagerImportData;
})();
