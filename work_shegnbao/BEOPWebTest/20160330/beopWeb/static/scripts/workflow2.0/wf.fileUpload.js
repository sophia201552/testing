var WfFileUpload = (function ($) {
    var configMap = {
        uploadModalContainerId: '#uploadModal-container',
        uploadModalId: '#uploadModal'
    };
    var fileUpload = function (autoSendFile, currentAttachAmount, isNewTask) {
        if (typeof FileReader === 'undefined') {
            throw new Error('Your browse isn\'t suppose FileReader');
        } else if (typeof  $ === 'undefined') {
            throw new ReferenceError('fileUpload need\'s jQuery');
        } else if (typeof $.fn.modal === 'undefined') {
            throw new ReferenceError('fileUpload need\'s bootstrap modal');
        }
        this.formData = new FormData();
        this.allFileList = [];
        this.pendingFileList = [];
        this.successFileLength = 0;
        this.$progress = null;
        this.cbList = {};
        this.currentAttachAmount = currentAttachAmount || null;
        this.maxAttachment = 5;
        this._autoSendFile = autoSendFile;
        this.uploadModalContainerId = configMap.uploadModalContainerId;
        this.fileAllow = {
            affixMaxSize: 5242880,
            fileNotAllowTypeList: []
        };
        this.isNewTask = isNewTask;
    };
    fileUpload.prototype = {
        show: function () {
            this.init();
        },
        init: function (cb) {
            this._showUploadModal();
            if (cb) {
                this.cbList._initCb = cb;
            }
            return this;
        },
        close: function (cb) {
            if (cb) {
                this.cbList._closeCb = cb;
            }
            return this;
        },
        uploadSuccess: function (cb) {
            if (cb) {
                this.cbList._uploadCompleteCb = cb;
            }
            return this;
        },
        _destroy: function () {
            $('body').find(configMap.uploadModalContainerId).remove();
            this.cbList._closeCb && this.cbList._closeCb.call(this, this.pendingFileList);
        },
        _showUploadModal: function () {
            var self = this;
            WebAPI.get('/static/views/workflow/fileUpload.html' + '?=' + new Date().getTime()).done(function (result) {
                $('body').append(result);
                I18n.fillArea($(configMap.uploadModalContainerId));
                $(configMap.uploadModalId).modal('show').on('hidden.bs.modal', self._destroy.bind(self));
                self.$progress = $(configMap.uploadModalContainerId).find('.progress');
                self._bindEvents();
                self.cbList._initCb && self.cbList._initCb.call(self);
            });
        },
        _bindEvents: function () {
            var self = this, $container = $(configMap.uploadModalContainerId);
            $container.off();
            var $fileElement = $(configMap.uploadModalContainerId).find('input[type="file"]');
            $container.on('click', '[data-file-type="add"]', function () {
                if (self.currentAttachAmount && self.pendingFileList && self.pendingFileList.length + self.currentAttachAmount >= self.maxAttachment) {
                    alert(I18n.resource.workflow.task.ATTACHMENT_FILE_AMOUNT_INFO);
                } else {
                    $fileElement.trigger('click');
                }
            });
            $container.on('click', '[data-file-type="remove-upload-item"]', function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                var _this = this;
                confirm(I18n.resource.workflow.task.ATTACHMENT_DELETE_NOTE, function () {
                    self._removeUploadFileItem(ev, _this, true);
                });
            });
            //添加或者删除文件到上传队列当中
            $container.off('click.add-upload-item').on('click.add-upload-item', '.files', function (ev) {
                var $this = $(this), fileId = $this.closest('div.files').attr('data-file-id');
                if (!fileId) {
                    return false;
                } else {
                    if ($this.hasClass('active')) {
                        $this.removeClass('active');
                        self._removeUploadFileItem(ev, this);
                    } else {
                        $this.addClass('active');
                        self._addUploadFileItem(ev, this);
                    }
                }
            });
            $container.on('click', '[data-file-type="upload"]', function () {
                if (self._autoSendFile && self.pendingFileList.length) {
                    self._uploadFile()
                } else {
                    $(configMap.uploadModalId).modal('hide');
                    self.cbList._uploadCompleteCb && self.cbList._uploadCompleteCb.call(self, self.pendingFileList);
                }
            });
            $fileElement.on('change', function (ev) {
                self._fileElementChange(ev, this);
            })
        },
        _addUploadFileItem: function (ev, $dom) {
            var $file = $($dom).closest('div.files'), fileId = $file.attr('data-file-id'), self = this;
            this.allFileList.forEach(function (item) {
                if (item.id == fileId) {
                    self.pendingFileList.push(item);
                }
            });
            this._setUploadInfo();
        },
        _removeUploadFileItem: function (ev, $dom, isRemove) {
            var $file = $($dom).closest('div.files'), fileId = $file.attr('data-file-id'), self = this;
            this.pendingFileList.forEach(function (item, index, array) {
                if (item.id == fileId) {
                    array.splice(index, 1);
                }
            });
            self._setUploadInfo();
            if (isRemove) {
                $file.fadeOut(300, function () {
                    $file.closest('.files-li').remove();
                });
            }
        },
        _setUploadInfo: function () {
            var $container = $(configMap.uploadModalContainerId), $uploadInfo = $container.find('.upload-file-info'), self = this;
            var size = 0;
            this.pendingFileList.forEach(function (item) {
                size += item.file.size
            });
            size = parseFloat(size / 1024 / 1024).toFixed(2);
            if (this.pendingFileList.length > 0) {
                $uploadInfo.css({"opacity": 1}).html(
                    I18n.resource.workflow.task.ATTACHMENT_FILE_INFO_TEXT.format([self.allFileList.length, size, self.successFileLength])
                );
            } else {
                $uploadInfo.css({"opacity": 0});
            }
        },
        _fileElementChange: function (ev, $dom) {
            ev.stopPropagation();
            ev.preventDefault();
            var file = $dom.files[0];
            if (file) {
                if (!this._checkFile(file, $dom)) {
                    //现在只有大小现在，个数限制在前台
                    alert(I18n.resource.workflow.task.ATTACHMENT_FILE_ERROR_INFO_SIZE);
                    return false;
                }
                var fileInfo = {
                    name: file.name,
                    type: file.type,
                    iconClass: this._getFileTypeIconClass(file.name),
                    size: file.size,
                    lastModified: file.lastModified,
                    lastModifiedDate: file.lastModifiedDate
                };
                this._addToNavList(file, fileInfo);
            }
        },
        _checkFile: function (file, $dom) {
            //this.fileAllow.fileNotAllowTypeList.indexOf($dom.value.match(/\.(.+)$/)[1]) === -1
            return file.size <= this.fileAllow.affixMaxSize;
        },
        _addToNavList: function (file, fileInfo) {
            var $filesNav = $(configMap.uploadModalContainerId).find('ul.files-nav'),
                fileId = new Date().getTime().toString(16), self = this,
                filter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
            if (filter.test(file.type)) {
                Spinner.spin(ElScreenContainer);
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function (ev) {
                    $filesNav.find('.upload-drag-area').before($(beopTmpl('file_list_temp', {
                        file: fileInfo,
                        fileId: fileId,
                        fileBase64: ev.target.result
                    })).fadeIn(300, function () {
                        self.allFileList.push({
                            id: fileId,
                            file: file,
                            iconClass: fileInfo.iconClass,
                            fileBase64: ev.target.result
                        });
                        self.pendingFileList.push({
                            id: fileId, file: file, iconClass: fileInfo.iconClass,
                            fileBase64: ev.target.result
                        });
                        self._setUploadInfo();
                        Spinner.stop();
                    }));
                };
            } else {
                $filesNav.find('.upload-drag-area').before($(beopTmpl('file_list_temp', {
                    file: fileInfo,
                    fileId: fileId,
                    fileBase64: null
                })).fadeIn(300, function () {
                    self.allFileList.push({
                        id: fileId, file: file, iconClass: fileInfo.iconClass,
                        fileBase64: null
                    });
                    self.pendingFileList.push({
                        id: fileId, file: file, iconClass: fileInfo.iconClass,
                        fileBase64: null
                    });
                    self._setUploadInfo();
                }));
            }
        },
        _uploadFile: function () {
            this._setFormData.call(this);
            Spinner.spin($(configMap.uploadModalId).get(0));
            var xhr = new XMLHttpRequest(), self = this;
            xhr.onreadystatechange = function (event) {
                self._uploadComplete(event, this);
            };
            xhr.upload.onloadstart = function () {
                self._UploadFileStart();
            };
            xhr.onprogress = xhr.upload.onprogress = function (event) {
                self._uploadFileProgress(event);
            };
            xhr.onload = xhr.upload.onload = function (event) {

            };
            xhr.onerror = xhr.upload.onerror = function () {
                Spinner.stop();
                self._uploadFailed();
            };
            xhr.onabort = xhr.upload.onabort = function () {
                self._uploadCanceled();
            };
            xhr.open("POST", "workflow/attachment/upload");
            xhr.send(this.formData);
        },
        _setFormData: function () {
            var fileIdList = [];
            this.pendingFileList.forEach(function (item) {
                this.formData.append('file', item.file);
                fileIdList.push(item.id);
            }.bind(this));
            this.formData.append('file_ids', fileIdList);
            this.formData.append('transId', this.isNewTask ? "" : beop.model.stateMap.cur_trans.id);
            this.formData.append('userId', AppConfig.userId);
        },
        _UploadFileStart: function () {
            this.$progress.show();
        },
        _uploadFileProgress: function (event) {
            if (event.lengthComputable) {
                var percentComplete = 100 * parseFloat(event.loaded / event.total).toFixed(2) + '%';
                this.$progress.find('.progress-bar').css('width', percentComplete).find('i').text(percentComplete);
            }
        },
        _uploadComplete: function (ev, xhrInstance) {
            var self = this;
            if (xhrInstance.readyState !== 4) {
                return;
            }
            if (xhrInstance.status === 200) {
                try {
                    var result = JSON.parse(xhrInstance.responseText);
                } catch (ex) {
                    alert(I18n.resource.workflow.task.ATTACHMENT_FILE_FAIL_INFO);
                    console.error(ex);
                }
                if (result.success) {
                    setTimeout(function () {
                        Spinner.stop();
                        self.$progress.fadeOut(300, function () {
                            self.$progress.find('.progress-bar').css('width', 0).find('i').text('0%');
                            $(configMap.uploadModalId).modal('hide');
                            self.successFileLength = self.allFileList.length - self.pendingFileList.length;
                            if (self.isNewTask) {
                                self.pendingFileList.forEach(function (item, index, array) {
                                    result.data.forEach(function (data) {
                                        if (data.fileId == item.id) {
                                            array[index]['uid'] = data.uid;
                                        }
                                    });
                                });
                            }
                            self.cbList._uploadCompleteCb && self.cbList._uploadCompleteCb.call(self, self.pendingFileList, ev, xhrInstance);
                        });
                    }, 1000);
                } else {
                    alert(I18n.resource.workflow.task.ATTACHMENT_FILE_FAIL_INFO);
                }
            }
        },
        _uploadFailed: function () {

        },
        _uploadCanceled: function () {

        },
        _getFileTypeIconClass: function (name) {
            var mineType = [
                {
                    type: ['png', 'jpeg', 'jpg', 'bmp', 'webpg'],
                    class: 'icon-file-pic'
                },
                {
                    type: ['docx','doc','wps'],
                    class: "icon-file-doc"
                },
                {
                    type: ['ppt'],
                    class: "icon-file-ppt"
                },
                {
                    type: ['pdf'],
                    class: 'icon-file-pdf'
                },
                {
                    type: ['xlsx','xls','xlsb','xlsm','xlst'],
                    class: 'icon-file-excel'
                },
                {
                    type: ['exe'],
                    class: 'icon-file-exe'
                },
                {
                    type: ['zip', 'jar'],
                    class: 'icon-file-zip'
                },{
                    type:['rar'],
                    class:'icon-file-rar'
                }
            ];
            var fileType = name.split('.'), defaultFileClassName = 'icon-file-file';
            fileType = fileType[fileType.length - 1];
            if (fileType) {
                mineType.forEach(function (item, index, array) {
                    if (item.type.indexOf((String(fileType).toLowerCase())) !== -1) {
                        defaultFileClassName = item.class;
                        return true;
                    }
                })
            }
            return defaultFileClassName;
        },
        _getFileAddTime: function (time) {
            var monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var date = new Date(time);
            return monthShort[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
        }
    };
    return fileUpload;
})
(jQuery);