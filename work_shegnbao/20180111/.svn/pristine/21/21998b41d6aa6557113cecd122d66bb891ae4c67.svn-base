var WfFileUpload = (function ($) {
    var configMap = {
        uploadModalContainerId: '#wf-attachment',
        uploadModalId: '#uploadModal'
    };
    var fileUpload = function (currentAttachAmount) {
        if (typeof FileReader === 'undefined') {
            throw new Error('Your browse isn\'t suppose FileReader');
        } else if (typeof  $ === 'undefined') {
            throw new ReferenceError('fileUpload need\'s jQuery');
        }
        this.allowSetStoreKey = ["$container", "onCloseCb", "onErrorCb", "isCreateNewTask"];
        this.store = {
            $container: undefined,
            onCloseCb: undefined,
            onErrorCb: undefined,
            isCreateNewTask: false
        };
        this.cbList = {};
        this.formData = new FormData();
        this.allFileList = [];
        this.pendingFileList = [];
        this.currentAttachAmount = currentAttachAmount || 0;
        this.maxAttachment = 5;
        this.uploadModalContainerId = configMap.uploadModalContainerId;
        this.fileAllow = {
            affixMaxSize: 5242880,
            fileNotAllowTypeList: []
        };
        this.window = window.parent ? window.parent : window;
    };
    fileUpload.prototype = {
        set: function (key, value) {
            if (this.allowSetStoreKey.indexOf(key) == -1) {
                console.error("key is not supposed: " + key);
                return false;
            } else {
                this.store[key] = value;
            }
        },
        get: function (key) {
            return this.store[key] || undefined
        },
        show: function (cb) {
            cb && (this.cbList.__initCb = cb);
            this.init();
        },
        init: function () {
            this.__showUploadModal();
            return this;
        },
        close: function (cb) {
            cb && (this.cbList.__closeCb = cb);
            return this;
        },
        uploadSuccess: function (cb) {
            cb && (this.cbList.__uploadCompleteCb = cb);
            return this;
        },
        __noop: function () {
        },

        _destroy: function () {
            $('body').find(configMap.uploadModalContainerId).remove();
            this.cbList._closeCb && this.cbList._closeCb.call(this, this.pendingFileList);
        },
        __showUploadModal: function () {
            var self = this;
            WebAPI.get('/static/views/workflow/upload.html' + '?=' + new Date().getTime()).done(function (result) {
                this.store.$container.empty().html(result);
                I18n.fillArea(this.store.$container);
                this.cbList.__initCb && this.cbList.__initCb();
                this.__bindEvents();
                if (self.store.isCreateNewTask) {
                    var attachBox = self.store.$container.find('#wf-attachment-list-container');
                    if (attachBox && attachBox.length) {
                        attachBox.empty().html(beopTmpl('tpl_wf_attachment_list', {attachmentList: self.allFileList}));
                    }
                } else {
                    WebAPI.get('/workflow/attachment/getFiles/' + self.window.beop.model.stateMap.cur_trans.id).done(function (fileResult) {
                        if (fileResult.success == true) {
                            self.__setFileClass(fileResult.data);
                            self.allFileList = fileResult.data;
                            self.store.$container.find('#wf-attachment-list-container').empty().html(beopTmpl('tpl_wf_attachment_list', {attachmentList: self.allFileList}));
                        } else {
                            alert('get files failed');
                        }
                    });
                }
            }.bind(this));
        },
        __bindEvents: function () {
            var self = this, $container = this.store.$container.find(this.uploadModalContainerId);
            $container.off();

            var $fileElement = $container.find('input[type="file"]');

            //添加文件
            $container.on('click', '.wf-attachment-add', function () {
                if (self.currentAttachAmount && self.pendingFileList && self.pendingFileList.length + self.currentAttachAmount >= self.maxAttachment) {
                    alert(I18n.resource.workflow.task.ATTACHMENT_FILE_AMOUNT_INFO);
                } else {
                    $fileElement.trigger('click');
                }
            });

            //删除文件
            $container.on('click', ".wf-attachment-delete-btn", function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                confirm(I18n.resource.workflow.task.ATTACHMENT_DELETE_NOTE, function () {
                    self.__removeUploadFileItem(ev, this, true);
                }.bind(this));
            });

            //上传 input 框 发生变化的时候
            $fileElement.off().on('change', function (ev) {
                self.__fileElementChange(ev, this);
            });
        },

        //remove upload item
        __removeUploadFileItem: function (ev, dom, isRemove) {
            var self = this, data = {}, $this = $(ev.target.closest('li'));
            data.uid = $this.data('uid');
            if (self.window.beop.model.stateMap.cur_trans) {
                data.taskId = self.window.beop.model.stateMap.cur_trans.id;
            }
            data.fileName = $this.data('filename');
            if (isRemove) {
                WebAPI.post('/workflow/attachment/delete', data).done(function (result) {
                    if (result.success) {
                        self.__removeFileFromAllFileList(data.uid);
                        self.__refreshContainer();
                    } else {
                        alert('delete file failed');
                    }
                }).fail(function () {
                    alert('delete file failed');
                }).always(function () {

                });
            }
        },
        __removeFileFromAllFileList: function (uid) {
            var m, len, list = this.allFileList;
            for (m = 0, len = list.length; m < len; m++) {
                if (list[m].uid == uid) {
                    list.splice(m, 1);
                    break;
                }
            }
        },
        __refreshContainer: function () {
            $('#wf-attachment-list-container').empty().html(beopTmpl('tpl_wf_attachment_list', {attachmentList: this.allFileList}));
        },
        __fileElementChange: function (ev, $dom) {
            this.pendingFileList = [];
            ev.stopPropagation();
            ev.preventDefault();

            [].slice.call($dom.files).forEach(function (file) {
                if (!this.__checkFileSize(file, $dom)) {
                    alert(I18n.resource.workflow.task.ATTACHMENT_FILE_ERROR_INFO_SIZE);
                    return false;
                }
                this.pendingFileList.push(file);
            }.bind(this));
            $dom.value = "";
            this.__uploadFile();
        },
        __checkFileSize: function (file, $dom) {
            //this.fileAllow.fileNotAllowTypeList.indexOf($dom.value.match(/\.(.+)$/)[1]) === -1
            return file.size <= this.fileAllow.affixMaxSize;
        },

        //start upload files
        __uploadFile: function () {
            this._setFormData.call(this);
            $(configMap.uploadModalContainerId).css('position', 'relative');
            Spinner.spin($(configMap.uploadModalContainerId).get(0));
            var xhr = new XMLHttpRequest(), self = this;
            xhr.onreadystatechange = function (event) {
                self._uploadComplete(event, this);
            };
            xhr.upload.onloadstart = function () {
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

        //set post data
        _setFormData: function () {
            this.formData = new FormData();
            this.pendingFileList.forEach(function (item) {
                this.formData.append('file', item);
            }.bind(this));
            if (this.window.beop.model.stateMap.cur_trans) {
                this.formData.append('taskId', this.window.beop.model.stateMap.cur_trans._id);
            }
            this.formData.append('userId', AppConfig.userId);
        },
        //upload process percent
        _uploadFileProgress: function (event) {
            if (event.lengthComputable) {
                //console.log(100 * parseFloat(event.loaded / event.total).toFixed(2) + '%');
            }
        },
        //upload success callback
        _uploadComplete: function (ev, xhrInstance) {
            if (xhrInstance.readyState !== 4) {
                return;
            }
            if (xhrInstance.status === 200) {
                try {
                    var result = JSON.parse(xhrInstance.responseText);
                } catch (ex) {
                    alert(I18n.resource.workflow.task.ATTACHMENT_FILE_FAIL_INFO);
                    Spinner.stop();
                    return false;
                }
                Spinner.stop();
                if (result.success) {
                    //显示到页面上
                    this.__setFileClass(result.data);
                    this.allFileList = this.allFileList.concat(result.data);
                    this.__refreshContainer();
                    this.cbList.__uploadCompleteCb && this.cbList.__uploadCompleteCb.call(this, this.pendingFileList, ev, xhrInstance);
                } else {
                    alert(I18n.resource.workflow.task.ATTACHMENT_FILE_FAIL_INFO);
                }
            }
        },
        //upload failed callback
        _uploadFailed: function () {
            alert("upload file failed")
        },
        //upload cancel abort callback
        _uploadCanceled: function () {
            alert("upload file canceled")
        },
        //image file to base64
        __setFileClass: function (files) {
            files.forEach(function (item) {
                item["fileClass"] = this._getFileTypeIconClass(item.fileName);
                item["fileUploadTime"] = this.__setFileAddTime(item.uploadTime);
                if (item.fileClass == "icon-file-pic") {
                    item["isImageFile"] = true
                }
            }.bind(this));
        },
        //set file icon class by type
        _getFileTypeIconClass: function (fileName) {
            var mineType = [
                {
                    type: ['png', 'jpeg', 'jpg', 'bmp', 'webpg'],
                    class: 'icon-file-pic'
                },
                {
                    type: ['docx', 'doc', 'wps'],
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
                    type: ['xlsx', 'xls', 'xlsb', 'xlsm', 'xlst'],
                    class: 'icon-file-excel'
                },
                {
                    type: ['exe'],
                    class: 'icon-file-exe'
                },
                {
                    type: ['zip', 'jar'],
                    class: 'icon-file-zip'
                }, {
                    type: ['rar'],
                    class: 'icon-file-rar'
                }
            ];
            var fileType = fileName.split('.'), defaultFileClassName = 'icon-file-file';
            fileType = fileType[fileType.length - 1];
            if (fileType) {
                mineType.forEach(function (item, index, array) {
                    if (item.type.indexOf((String(fileType).toLowerCase())) !== -1) {
                        defaultFileClassName = item.class;
                    }
                })
            }
            return defaultFileClassName;
        },
        //set file add time
        __setFileAddTime: function (time) {
            var monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var date = new Date(time);
            return monthShort[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
        }
    };
    return fileUpload;
})
(jQuery);