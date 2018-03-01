var PointManagerImportData = (function () {

    function PointManagerImportData(projectId) {
        PointManager.call(this, projectId);
        this.htmlUrl = '/static/scripts/dataManage/views/dm.importData.html';
    }

    PointManagerImportData.prototype = Object.create(PointManager.prototype);
    PointManagerImportData.prototype.constructor = PointManagerImportData;

    var PointManagerImportDataFunc = {
        show: function () {
            var _this = this;
            this.init().done(function () {
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
            var $btnConfirm = $('#btnConfirmUpload');

            // upload *.csv elements
            var $spUploadInfo = $('#spUploadInfo');
            var $exportTemplate = $('#exportTemplate');
            var $exportFileContent = $('#exportFileContent');

            // upload drag and drop elements
            var $divPjDataDropHandler = $('#divPjDataDropHandler');
            var $tip = $divPjDataDropHandler.children('p');
            var $uploadMask = $('#uploadMask');
            var $body = $('body');
            // -1: error
            // 0: success
            var uploadStatus = -1;
            var dragFix = false;

            $spUploadInfo.tooltip({title: '', trigger: 'manual', placement: 'right'});

            var uploadHandler = function (file) {
                var formData = new FormData();
                var match = file.name.match(/\.[A-Za-z0-9]+$/);
                var supportFiles = ['.csv'];
                if (!file || !match || supportFiles.indexOf(match[0].toLowerCase()) < 0) {
                    util.tooltip.show($spUploadInfo, I18n.resource.dataManage.INVALID_FILE_TYPE);
                    return;
                }
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
                    $('#btnConfirmUpload').removeAttr('disabled').addClass('exportActive');
                }).fail(function (err) {
                    $('#spUploadInfo').removeClass()
                        .addClass('text-danger')
                        .html(I18n.resource.dataManage.UPLOAD_FAILED);
                    uploadStatus = -1;
                });
            };
            var fileNameList = [];

            var uploadHandlerEx = function (file) {
                if (!file || !file[0]) {
                    return;
                }
                fileNameList = [];
                var formData = new FormData();
                var match;
                //防止选中文件点击取消上传时报错;
                if (file[0].name) {
                    match = file[0].name.match(/\.[A-Za-z0-9]+$/);
                }
                var supportFiles = ['.csv', '.xlsx'];
                if (!match || supportFiles.indexOf(match[0].toLowerCase()) < 0) {
                    alert.danger(I18n.resource.dataManage.INVALID_FILE_TYPE);
                    return;
                }
                formData.append('config-file', file[0]);
                fileNameList.push(file[0].name);

                Spinner.spin(ElScreenContainer);
                $.ajax({
                    url: '/get_config_data/' + AppConfig.userId,
                    type: 'post',
                    data: formData,
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false
                }).done(function () {
                    $('#exportFileContent').empty().html(beopTmpl('export_file_panel'));
                    var $exportFileName = $exportFileContent.find('[data-name="nameExportFile"]');
                    var $exportFileTime = $exportFileContent.find('[data-time="timeExportFile"]');
                    $exportFileName.html(fileNameList.join(',')).attr('title', fileNameList.join(','));
                    var curExportTime = timeFormat(new Date(), timeFormatChange('yyyy-mm-dd'));
                    $exportFileTime.html(curExportTime).attr('title', curExportTime);
                    uploadStatus = 0;
                    $('#btnConfirmUpload').removeAttr('disabled').addClass('exportActive');
                }).fail(function () {
                    alert.danger(I18n.resource.common.SERVER_REQUEST_FAILED);
                    uploadStatus = -1;
                }).always(function () {
                    Spinner.stop();
                });

            };

            $('#divUploadWrap').off('click.delExportFile').on('click.delExportFile', '#delExportFile', function () {
                $exportFileContent.empty().html(beopTmpl('init_export_file_panel'));
                var $iptPjData = $('#iptPjData');
                $iptPjData.after($iptPjData.clone().val(''));
                $iptPjData.remove();
                fileNameList = [];
                $('#btnConfirmUpload').attr('disabled', 'disabled').removeClass('exportActive');
                I18n.fillArea($('#importDataBox'));
            }).off('change.iptPjData').on('change.iptPjData', '#iptPjData', function () {
                uploadHandlerEx($(this)[0].files);
            }).off('click.btnUploadCSV').on('click.btnUploadCSV', '#btnUploadCSV', function () {
                $('#divUploadWrap').find('#iptPjData').click();
            });

            $exportTemplate.click(function () {
                $('#selectExportFormat').modal();
                I18n.fillArea($(ElScreenContainer));
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
                Spinner.spin(ElScreenContainer);
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
