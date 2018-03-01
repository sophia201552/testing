 /* Created by win7 on 2015/10/27.
  */
 var WorkflowAdd = (function() {
     var _this;

     function WorkflowAdd() {
         _this = this;
         _this.$wrapBg = undefined;

         _this.teamId = undefined;
         _this.taskGrp = [];
         _this.tag = [];
         _this.curProcess = {};

         _this.opt = {
             attachment: [],
             fields: {
                 critical: 0,
                 detail: null,
                 dueDate: new Date(+new Date() + 86400000).format('yyyy-MM-dd'),
                 process: null,
                 taskGroup: null,
                 template_id: null,
                 title: null
             },
             processMember: {

             },
             tags: [],
             watchers: []

         };

         this.fileAllow = {
             affixMaxSize: 5242880,
             fileNotAllowTypeList: []
         };

         this.customField = [];
         this.curTemplate = {};

         this.userPage = undefined;

         this.sideToolCtn = undefined;
         this.sideTool = undefined;
     }
     WorkflowAdd.navOptions = {
         top: '<div class="navTopItem title middle" i18n="appDashboard.workflow.WORKFLOW_CREATE"></div>',
         bottom: true,
         backDisable: false,
         module: 'workflow'
     };
     WorkflowAdd.prototype = {
         show: function() {
             this.customInputOpt = {
                     'iot': {
                         name: I18n.resource.appDashboard.workflow.OPEN_IOT,
                         act: function() {
                             //_this.barcodeInput();
                             _this.showDeviceTree();


                         }
                     },
                     'barcode': {
                         name: I18n.resource.appDashboard.workflow.OPEN_BARCODESCANNER,
                         act: function(dom, field) {
                             _this.getBarcode(dom, field).done(function(data) {
                                 //dom.querySelector('.noChoiceTip').classList.add('hide');
                                 dom.innerHTML = '<span class="linkItem" data-page="iot" data-id="' + data.id + '">' + data.name + '</span>';
                                 //var arrItem = $(dom).children().not('.noChoiceTip');
                                 //var str = '';
                                 //for (var i = 0; i < arrItem.length ;i++){
                                 //    str += arrItem[i].outerHTML;
                                 //}
                                 _this.opt.fields[field] = dom.innerHTML;
                             }).fail(function() {
                                 window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.ERR_BARCODESCANNER, 'short', 'center');
                             });
                         }
                     }
                 },

                 $.ajax({ url: 'static/app/dashboard/views/workflow/workflowAdd.html' }).done(function(resultHTML) {
                     $(ElScreenContainer).html(resultHTML);
                     //_this.$wrapBg = $(document.getElementById('wrapBg'));
                     _this.init();
                     I18n.fillArea($('#navTop'));
                     I18n.fillArea($('#wkAddInfo'));
                     I18n.fillArea($('#workflowAddBtn'));
                     I18n.fillArea($('#wkUserDialog'));
                 });
         },
         init: function() {
             //_this.initUploadImg();
             //_this.initUserShow();
             SpinnerControl.show();
             this.initSideTool();

             $.when(WebAPI.get('/workflow/taskGroup/'), WebAPI.get('/workflow/tags/')).done(function(taskGrp, tags) {
                 _this.taskGrp = taskGrp[0].data;
                 _this.tag = tags[0].data;
                 _this.initUserSelectPage();
                 _this.initDeadline();
                 _this.initCritical();
                 _this.initWatcher();
                 _this.initUploadFile();
                 _this.initTeam();
                 _this.initTag();
                 _this.initCreate();
                 _this.attachEvent();
             }).always(function() {
                 SpinnerControl.hide()
             });
         },
         initSideTool: function() {
             if (!this.sideToolCtn) this.sideToolCtn = document.getElementById('containerSideWidget').querySelector('.content');
             this.sideToolCtn.innerHTML = '';
         },
         showSideTool: function() {
             this.sideToolCtn.parentNode.classList.add('focus')
         },
         hideSideTool: function() {
             this.sideToolCtn.parentNode.classList.remove('focus')
         },
         attachEvent: function() {
             var _this = this;
             $('.wkChoiceList').off('tap').on('tap', '.wrapResult:not(.disableDefault)', function(e) {
                 e.currentTarget.nextElementSibling.classList.add('focus');
                 //_this.$wrapBg.addClass('focus');
             }).on('tap', '.panelMask', function(e) {
                 e.currentTarget.parentNode.classList.remove('focus');
                 //_this.$wrapBg.addClass('focus');
             });
         },
         initUserSelectPage: function() {
             this.userPage = new SelectPage({
                 type: 'user',
                 mode: 'radio',
                 ctn: document.getElementById('ctnUserSel'),
                 teamId: _this.opt.fields.taskGroup,
                 screen: _this
             });
         },
         initDeadline: function() {
             var $ctn = $('#wkDeadline');
             var $content = $ctn.find('.spContent');
             $content.text(new Date(+new Date() + 86400000).format('yyyy-MM-dd'));
             $ctn.off('tap').on('tap', function() {
                 if (typeof datePicker == 'undefined') return;
                 datePicker.show({
                         date: _this.opt.fields.dueDate ? new Date(_this.opt.fields.dueDate) : new Date(),
                         mode: 'date',
                         okText: AppConfig.language == 'zh' ? '确定' : 'Done',
                         cancelText: AppConfig.language == 'zh' ? '取消' : 'Cancel',
                         allowFutureDates: true,
                         doneButtonLabel: AppConfig.language == 'zh' ? '确定' : 'Done',
                         cancelButtonLabel: AppConfig.language == 'zh' ? '取消' : 'Cancel'
                     },
                     setDate,
                     function() {}
                 );
             });

             function setDate(date) {
                 if (!date) return;
                 var strDate = date.format('yyyy-MM-dd');
                 $content[0].textContent = strDate;
                 _this.opt.fields.dueDate = strDate;
             }
         },
         initCritical: function() {
             var $ctn = $('#wkCritical');
             var $content = $ctn.find('.spContent');
             var $list = $ctn.find('.panelEdit .content');
             var $wrapEdit = $ctn.find('.wrapEdit');
             $list.off('tap').on('tap', '.spItem', function(e) {
                 var $target = $(e.currentTarget);
                 $wrapEdit.removeClass('focus');
                 //_this.$wrapBg.removeClass('focus');
                 if ($target.hasClass('selected')) return;
                 $target.siblings().removeClass('selected');
                 $target.addClass('selected');
                 _this.opt.fields.critical = e.currentTarget.dataset.value;
                 $content.text(e.currentTarget.textContent);
                 $content.removeClass('critical-0 critical-1 critical-2').addClass('critical-' + _this.opt.fields.critical)
             });
         },
         initUploadFile: function($container, field) {
             var $ctn, storeAttr, isCustomFiled;
             var store = [];
             if ($container) {
                 $ctn = $container;
             } else {
                 $ctn = $('#wkFile');
             }
             if (field) {
                 isCustomFiled = true
                 storeAttr = field
             } else {
                 storeAttr = 'attachment';
             }
             var $wrapResult = $ctn.find('.wrapResult');
             var $content = $ctn.find('.spContent');
             var $iptFile = $('#iptFile');
             var $list = $ctn.find('.panelEdit .content');
             var $wrapEdit = $ctn.find('.wrapEdit');

             //var arrCamera = [];
             var arrFile = [];
             var arrDeleteFile = [];

             var $btnCamera = $ctn.find('.btnCamera');
             var $btnFile = $ctn.find('.btnFile');
             var $btnSure = $ctn.find('.btnSure');
             $btnCamera.off('tap').on('tap', function() {
                 if (navigator && navigator.camera) {
                     var cameraOpt = {
                         destinationType: Camera.DestinationType.DATA_URL,
                         targetHeight: $(window).height(),
                         targetWidth: $(window).width(),
                         quality: 50
                     };
                     navigator.camera.getPicture(
                         function(imgData) {
                             console.log('camera Success');
                             //var file = new Blob([imgData]);
                             //if (file.size > _this.fileAllow.affixMaxSize) {
                             //    console.log('文件大小超出限制');
                             //    return false;
                             //}
                             //var pic = {
                             //    fileName:new Date().format('yyyy-MMM-dd hh:mm:ss') + '.jpg',
                             //    uid:"",
                             //    uploadTime:new Date().format('yyyy-MMM-dd hh:mm:ss'),
                             //    url:imgData,
                             //    userId:AppConfig.userId,
                             //    fileClass: "icon-file-pic",
                             //    fileUploadTime: _this.setFileAddTime(new Date()),
                             //    isImageFile: true
                             //};
                             var bytes = window.atob(imgData); //去掉url的头，并转换为byte
                             //处理异常,将ascii码小于0的转换为大于0
                             var ab = new ArrayBuffer(bytes.length);
                             var ia = new Uint8Array(ab);
                             for (var i = 0; i < bytes.length; i++) {
                                 ia[i] = bytes.charCodeAt(i);
                             }

                             var pic = new Blob([ab], { type: 'image/jpeg' });
                             var file = new File([pic], new Date().format('yyyy-MMM-dd hh:mm:ss') + '.jpg');
                             if (file.size > _this.fileAllow.affixMaxSize) {
                                 console.log(I18n.resource.appDashboard.workflow.FILE_OUT_OF_SIZE);
                                 return false;
                             }
                             $list.append('<span class="spItem zepto-ev">' + file.name + '</span>');
                             arrFile.push(file)
                         },
                         function() {
                             console.log('camera Error')
                         },
                         cameraOpt
                     )
                 }
             });
             $btnFile.off('tap').on('tap', function() {
                 $iptFile.trigger('click');
             });
             $btnSure.off('tap').on('tap', function() {
                 store.forEach(function(file) {
                     if ($list.find('[data-value="' + file.uid + '"]').length == 0) {
                         arrDeleteFile.push(file);
                     }
                 });
                 SpinnerControl.show();
                 $.when(_this.uploadFile(arrFile), _this.removeFile(arrDeleteFile)).done(function(result) {
                     arrDeleteFile.forEach(function(deleteFile) {
                         store.forEach(function(file, index) {
                             if (deleteFile.uid == file.uid) {
                                 store.splice(index, 1)
                             }
                         });
                     });
                     if (result instanceof Array) {
                         store = [].concat(store, result);
                     }
                     //_this.opt.attachment = [].concat(_this.opt.attachment,arrCamera);
                     window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.FILE_UPLOAD_SUCCESS, 'short', 'center');
                     $content[0].innerHTML = '';
                     if (store.length > 0) {
                         var fileDom, iconDom;
                         for (var i = 0; i < store.length; i++) {
                             fileDom = document.createElement('span')
                             fileDom.className = 'spFile'
                             fileDom.innerHTML = '\
                            <span class="icon iconfont ' + store[i].fileClass + '"></span>\
                            <span class="name">' + store[i].fileName + '</span>\
                            <span class="time">' + store[i].fileUploadTime + '</span>';
                             if (store[i].isImageFile) {
                                 iconDom = fileDom.querySelector('.icon');
                                 iconDom.style.backgroundImage = 'url("' + store[i].url + '")';
                                 iconDom.classList.add('zepto-ev')
                             }
                             $content.append(fileDom)
                         }
                     } else {
                         $content[0].innerHTML = I18n.resource.appDashboard.workflow.NOT_APPEND
                     }
                     $wrapEdit.removeClass('focus');
                     $list.html('');
                     store.forEach(function(file) {
                         $list.append('<span class="spItem zepto-ev" data-value="' + file.uid + '">' + file.fileName + '</span>')
                     });
                     if (isCustomFiled) {
                         _this.opt.fields[storeAttr] = store;
                     } else {
                         _this.opt[storeAttr] = store;
                     }
                 }).fail(function() {
                     $wrapEdit.removeClass('focus');
                     window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.FILE_UPLOAD_FAIL, 'short', 'center');
                 }).always(function() {
                     SpinnerControl.hide();
                 });
             });
             $list.off('tap').on('tap', '.spItem', function(e) {
                 infoBox.confirm(I18n.resource.appDashboard.workflow.SURE_TO_DELETE_FILE, function() {
                     $(e.currentTarget).remove();
                 })
             });
             //$content.off('tap').on('tap',function(e){
             //    e.stopPropagation();
             //    $iptFile.trigger('click');
             //});
             var file, fileType, reader, strDivWkImg;
             $iptFile.off('change').on('change', function(e) {
                 e.stopPropagation();
                 e.preventDefault();

                 [].slice.call($iptFile[0].files).forEach(function(file) {
                     if (file.size > _this.fileAllow.affixMaxSize) {
                         infoBox.alert(file.name + I18n.resource.appDashboard.workflow.FILE_OUT_OF_SIZE)
                         console.log(I18n.resource.appDashboard.workflow.FILE_OUT_OF_SIZE);
                         return false;
                     }
                     arrFile.push(file);
                     $list.append('<span class="spItem zepto-ev">' + file.name + '</span>')
                 }.bind(this));
                 $iptFile[0].value = "";
             });
             $wrapResult.off('tap').on('tap', function(e) {
                 $list.html('');
                 arrFile = [];
                 arrDeleteFile = [];
                 //arrCamera = [];
                 store.forEach(function(file) {
                     $list.append('<span class="spItem zepto-ev" data-value="' + file.uid + '">' + file.fileName + '</span>')
                 });
                 $wrapEdit.addClass('focus');
             })
             $wrapResult.on('tap', '.icon', function(e) {
                 e.stopPropagation();
                 e.preventDefault();
                 var _store = {};
                 try {
                     _store = store[$(e.currentTarget).parent().index()]
                 } catch (e) {
                     _store = {};
                 }
                 if (!_store.url) return;
                 var bigPic = document.createElement('span');
                 bigPic.className = 'wrapBigPic zepto-ev';
                 if (_store.url.split('://')[0] == 'http' || _store.url.split('://')[0] == 'https') {
                     bigPic.innerHTML = '<img class="bigPic" src="' + _store.url + '">';
                 } else {
                     bigPic.innerHTML = '<img class="bigPic" src="data:image/jpeg;base64,' + _store.url + '">';
                 }
                 bigPic.innerHTML += '<span class="name">' + _store.fileName + '</span><span class="time">' + _store.fileUploadTime + '</span>'
                 bigPic.querySelector('.bigPic').onload = function() {
                     $('body').append(bigPic);
                 };
                 $(bigPic).off('tap').on('tap', function() {
                     $(bigPic).remove();
                 });
             })
         },
         removeFile: function(arrFile) {
             if (!(arrFile instanceof Array && arrFile.length > 0)) return $.Deferred().resolve();
             var ajax = [];
             arrFile.forEach(function(file) {
                 ajax.push(WebAPI.post('/workflow/attachment/delete', { fileName: file.fileName, uid: file.uid }))
             });
             return $.when.apply(this, ajax)
         },
         uploadFile: function(arrFile) {
             if (!(arrFile instanceof Array && arrFile.length > 0)) return $.Deferred().resolve();
             var formatData = this.setFormData(arrFile);
             var deferred = $.Deferred();
             var xhr = new XMLHttpRequest(),
                 self = this;
             xhr.onreadystatechange = function(event) {
                 //if (this.readyState !== 4) {
                 //    return;
                 //}
                 //var result = self.uploadComplete(event, this);
                 //if(result instanceof Array && result.length > 0 ){
                 //    deferred.resolveWith(self,[result]);
                 //}else{
                 //    deferred.resolve();
                 //}
             };
             xhr.onprogress = function(event) {
                 self.uploadFileProgress(event);
             };
             xhr.onload = function(event) {
                 if (this.readyState !== 4) {
                     return;
                 }
                 var result = self.uploadComplete(event, this);
                 if (result instanceof Array && result.length > 0) {
                     deferred.resolveWith(self, [result]);
                 } else {
                     deferred.resolve();
                 }
             };
             xhr.onerror = function() {
                 self.uploadFailed();
                 deferred.reject();
             };
             xhr.onabort = function() {
                 self.uploadCanceled();
                 deferred.reject();
             };
             xhr.open("POST", (typeof cordova != 'undefined' ? AppConfig.host : '') + "/workflow/attachment/upload");
             xhr.send(formatData);

             return deferred.promise();
         },
         setFormData: function(arrFile) {
             var formData = new FormData();
             arrFile.forEach(function(item) {
                 formData.append('file', item);
             }.bind(this));
             formData.append('userId', AppConfig.userId);
             return formData
         },
         //upload process percent
         uploadFileProgress: function(event) {
             if (event.lengthComputable) {
                 //console.log(100 * parseFloat(event.loaded / event.total).toFixed(2) + '%');
             }
         },
         //upload success callback
         uploadComplete: function(ev, xhrInstance, deferred) {
             if (xhrInstance.readyState !== 4) {
                 return;
             }
             if (xhrInstance.status === 200) {
                 try {
                     var result = JSON.parse(xhrInstance.responseText);
                 } catch (ex) {
                     console.log(I18n.resource.workflow.task.ATTACHMENT_FILE_FAIL_INFO);
                     return false;
                 }
                 if (result.success) {
                     //显示到页面上
                     return this.setFileClass(result.data);
                 } else {
                     console.log(I18n.resource.workflow.task.ATTACHMENT_FILE_FAIL_INFO);
                 }
             }
         },
         refreshContainer: function() {

         },
         //upload failed callback
         uploadFailed: function() {
             console.log("upload file failed")
         },
         //upload cancel abort callback
         uploadCanceled: function() {
             console.log("upload file canceled")
         },
         //image file to base64
         setFileClass: function(files) {
             files.forEach(function(item) {
                 item["fileClass"] = this.getFileTypeIconClass(item.fileName);
                 item["fileUploadTime"] = this.setFileAddTime(item.uploadTime);
                 if (item.fileClass == "icon-file-pic") {
                     item["isImageFile"] = true
                 }
             }.bind(this));
             return files;
         },
         //set file icon class by type
         getFileTypeIconClass: function(fileName) {
             var mineType = [{
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
             var fileType = fileName.split('.'),
                 defaultFileClassName = 'icon-file-file';
             fileType = fileType[fileType.length - 1];
             if (fileType) {
                 mineType.forEach(function(item, index, array) {
                     if (item.type.indexOf((String(fileType).toLowerCase())) !== -1) {
                         defaultFileClassName = item.class;
                     }
                 })
             }
             return defaultFileClassName;
         },
         //set file add time
         setFileAddTime: function(time) {
             var monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
             var date = new Date(time.replace(/-/g, '/'));
             return monthShort[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
         },
         initWatcher: function() {
             var $ctn = $('#wkWatcher');
             var $wrapResult = $ctn.find('.wrapResult');
             var $content = $ctn.find('.spContent');
             $wrapResult.off('tap').on('tap', function(e) {
                 _this.userPage.list = null;
                 _this.userPage.selectList = _this.opt.watchers;
                 _this.userPage.mode = 'check';
                 _this.userPage.teamId = null;
                 _this.userPage.callback = function(result) {
                     $content.html('');
                     if (result.length == 0) {
                         $content.text(I18n.resource.appDashboard.workflow.NO_CHOICE);
                     } else {
                         $content.html(result.map(function(user) { return '<span class="spSubContent">' + user.userfullname + '</span>' }).join(''));
                     }
                     _this.opt.watchers = result.map(function(user) { return user.id })
                 };
                 _this.userPage.show();
             });
         },
         initTeam: function() {
             var $ctn = $('#wkTeam');
             var $wrapEdit = $ctn.find('.wrapEdit');
             var $content = $ctn.find('.spContent');
             var $list = $ctn.find('.panelEdit .content');
             var item;
             for (var i = 0; i < this.taskGrp.length; i++) {
                 item = document.createElement('span');
                 item.className = 'spItem zepto-ev';
                 item.dataset.value = this.taskGrp[i]._id;
                 item.textContent = this.taskGrp[i].name ? this.taskGrp[i].name : I18n.resource.appDashboard.workflow.DEFAULT_PROJECT;
                 $list.append(item)
             }
             $list.off('tap').on('tap', '.spItem', function(e) {
                 var $target = $(e.currentTarget);
                 $wrapEdit.removeClass('focus');
                 //_this.$wrapBg.removeClass('focus');
                 if ($target.hasClass('selected')) return;
                 $target.siblings().removeClass('selected');
                 $target.addClass('selected');
                 _this.opt.fields.taskGroup = e.currentTarget.dataset.value;
                 $content.text(e.currentTarget.textContent);
                 _this.initProcess();
             });
             $list.find('.spItem').first().trigger('tap');
         },
         initTag: function() {
             var $ctn = $('#wkTag');
             var $content = $ctn.find('.spContent');
             var $list = $ctn.find('.panelEdit .content');
             var $wrapEdit = $ctn.find('.wrapEdit');
             var $wrapResult = $ctn.find('.wrapResult');
             var item;
             for (var i = 0; i < this.tag.length; i++) {
                 item = document.createElement('span');
                 item.className = 'spItem zepto-ev';
                 item.dataset.value = i;
                 item.textContent = this.tag[i].name;
                 $list.append(item)
             }
             $list.off('tap').on('tap', '.spItem', function(e) {
                 var $target = $(e.currentTarget);
                 $target.toggleClass('selected');
             });
             $wrapResult.on('tap', function() {
                 $list.find('.spItem').removeClass('selected');
                 for (var i = 0; i < _this.opt.tags.length; i++) {
                     $list.find('[data-value="' + _this.opt.tags[i].type + '"]').addClass('selected');
                 }
             });
             $wrapEdit.on('tap', '.btnSure', function() {
                 var $selTag = $list.find('.spItem.selected');
                 var arrTagText = [];
                 var arrTagValue = [];
                 for (var i = 0; i < $selTag.length; i++) {
                     arrTagText.push('<span class="spSubContent">' + $selTag[i].textContent + '</span>');
                     arrTagValue.push($selTag[i].textContent);
                 }
                 _this.opt.tags = arrTagValue;
                 if (_this.opt.tags.length == 0) {
                     $content.html(I18n.resource.appDashboard.workflow.NO_CHOICE);
                 } else {
                     $content.html(arrTagText.join(''));
                 }
                 $wrapEdit.removeClass('focus');
                 //_this.$wrapBg.removeClass('focus');
             })
         },
         initCreate: function() {
             $('#btnAddWk').off('tap').on('tap', function() {
                 if (!_this.opt.processMember) {
                     window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.CREATE_ERR1, 'short', 'center');
                     return;
                 } else {
                     for (var i = 0; i < _this.curProcess.nodes.length; i++) {
                         if (!(_this.opt.processMember[_this.curProcess.nodes[i]._id] instanceof Array && _this.opt.processMember[_this.curProcess.nodes[i]._id].length > 0)) {
                             window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.CREATE_ERR2, 'short', 'center');
                             return;
                         }
                     }
                 }
                 _this.opt.fields.detail = document.getElementById('inputWkDetail').value;
                 _this.opt.fields.title = document.getElementById('inputWkTitle').value;
                 var postData = _this.dealWithProcessCustom($.extend(true, {}, _this.opt));
                 SpinnerControl.show();
                 WebAPI.post('/workflow/task/save/', postData).done(function(resultData) {
                     if (resultData.success) {
                         window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.CREATE_SUCCESS, 'short', 'center');
                         router.to({
                             typeClass: WorkflowDetail,
                             data: {
                                 id: resultData.data
                             }
                         })
                     }
                 }).fail(function() {
                     window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.workflow.CREATE_FAIL, 'short', 'center');
                 }).always(function() {
                     SpinnerControl.hide();
                 });
             });
         },
         dealWithProcessCustom: function(postData) {
             var _this = this;
             if (this.curTemplate.option && this.curTemplate.option.title) {
                 if (this.curTemplate.option.title.static) {
                     postData.fields.title = this.curTemplate.option.title.static;
                 }
             }
             if (this.curTemplate.option) {
                 if (this.curTemplate.option.detail instanceof Array) {
                     var arrDetail = [];
                     this.curTemplate.option.detail.forEach(function(field) {
                         if (postData.fields[field]) {
                             arrDetail.push(postData.fields[field]);
                         }
                     });
                     if (arrDetail.length > 0) {
                         postData.fields.detail = arrDetail.join(' / ')
                     }
                 } else {
                     if (postData.fields[this.curTemplate.option.detail]) {
                         postData.fields.detail = postData.fields[this.curTemplate.option.detail];
                     }
                 }
             }
             return postData
         },
         initProcess: function() {
             if (!_this.opt.fields.taskGroup) return;
             var $ctn = $('#wkProcess');
             var $content = $ctn.find('.spContent');
             var $wrapEdit = $ctn.find('.wrapEdit');
             var $list = $ctn.find('.panelEdit .content');
             var curGrp = _this.taskGrp.filter(function(item) { return item._id == _this.opt.fields.taskGroup })[0];
             var process = curGrp.process;
             var spItem;
             $list.html('');
             $content.html('');
             for (var i = 0; i < process.length; i++) {
                 spItem = document.createElement('span');
                 spItem.className = 'spItem zepto-ev';
                 spItem.dataset.value = process[i]._id;
                 spItem.dataset.template = process[i].template._id;
                 spItem.textContent = process[i].name ? process[i].name : I18n.resource.appDashboard.workflow.DEFAULT_PROCESS;
                 $list.append(spItem)
             }
             if (process && process.length > 0) {
                 $list.off('tap').on('tap', '.spItem', function(e) {
                     var $target = $(e.currentTarget);
                     $wrapEdit.removeClass('focus');
                     //_this.$wrapBg.removeClass('focus');
                     if ($target.hasClass('selected')) return;
                     $target.siblings().removeClass('selected');
                     $target.addClass('selected');
                     _this.opt.fields.process = e.currentTarget.dataset.value;
                     _this.opt.fields.template_id = e.currentTarget.dataset.template;
                     _this.curProcess = process.filter(function(item) { return item._id == _this.opt.fields.process })[0];
                     _this.opt.processMember = {};
                     if (_this.curProcess) {
                         for (var i = 0; i < _this.curProcess.nodes.length; i++) {
                             _this.opt.processMember[_this.curProcess.nodes[i]._id] = []
                         }
                     }
                     $content.text(e.currentTarget.textContent);
                     _this.initProcessUser();
                 });

                 $list.find('.spItem').first().trigger('tap')
             } else {
                 $list.off('tap');
                 _this.opt.fields.process = '';
                 _this.opt.fields.template_id = '';
                 $content.text(I18n.resource.appDashboard.workflow.NO_CHOICE);
             }
         },
         initProcessField: function(template) {
             if (!template) return;
             this.curTemplate = template;
             $('#wkTitle').removeClass('hide');
             $('#wkDetail').removeClass('hide');
             $('#wkChoiceList>.wkItem').removeClass('hide');
             if (template.option && template.option.hide) {
                 template.option.hide.forEach(function(type) {
                     $('#wk' + type[0].toUpperCase() + type.slice(1)).addClass('hide');
                 })
             }
             var attr = template.fields;
             var container = document.getElementById('wkFieldAttr');
             attr.forEach(function(item) {
                 _this.customField.push(item.name);
                 _this.opt.fields[item.name] = '';
                 var dom;
                 switch (item.type) {
                     case 'custom':
                         dom = _this.createCustomFieldWrap(item);
                         break;
                     case 'complex':
                         dom = _this.createComplexFieldWrap(item);
                         break;
                     case 'date':
                         dom = _this.createDateFieldWrap(item);
                         break;
                     case 'file':
                         dom = _this.createFileFieldWrap(item);
                         break;
                     case 'select':
                         dom = _this.createSelectFieldWrap(item);
                         break;
                     default:
                         dom = _this.createDefaultFieldWrap(item);
                         break;
                 }
                 dom && container.appendChild(dom)
             })
         },
         createDefaultFieldWrap: function(field) {
             var dom = document.createElement('div');
             dom.className = 'wkItem divFieldAttr zepto-ev';
             dom.dataset.field = field.name;
             dom.dataset.type = field.type;
             dom.innerHTML = '\
            <div class="wrapResult zepto-ev disableDefault">\
                <label class="infoLabel">' + field.name + '</label>\
                <span class="spContent ' + field.type + '"><input class="iptContent" type="' + field.type + '" placeholder="' + (field.type == 'text' ? I18n.resource.appDashboard.workflow.INPUT_TIP : I18n.resource.appDashboard.workflow.NO_CHOICE) + '"></span>\
            </div>';
             //_this.opt.fields[item.name] = '1';
             //dom.querySelector('.spContentVal').onclick = function(e){
             //    $(e.currentTarget).next().focus()
             //};
             dom.querySelector('.iptContent').onchange = function(e) {
                 _this.opt.fields[field.name] = e.currentTarget.value;
             };
             return dom
         },
         createFileFieldWrap: function(field) {
             var dom = document.createElement('div');
             dom.className = 'wkItem divFieldAttr zepto-ev';
             dom.dataset.field = field.name;
             dom.dataset.type = field.type;
             dom.innerHTML = '\
            <div class="wrapResult zepto-ev disableDefault">\
                <label class="infoLabel" i18n="appDashboard.workflow.FILE"></label>\
                <span class="spContent" i18n="appDashboard.workflow.NO_CHOICE"></span>\
                <input id="iptFile" type="file" multiple style="display: none">\
            </div>\
            <div class="wrapEdit">\
                <div class="panelMask zepto-ev"></div>\
                <div class="panelEdit">\
                    <div class="tool">\
	                    <span class="panelTtl">' + field.name + '</span>\
                        <span class="btnCamera zepto-ev glyphicon glyphicon-camera"></span>\
	                    <span class="btnFile zepto-ev glyphicon glyphicon-file"></span>\
                        <span class="btnSure zepto-ev">' + I18n.resource.appDashboard.workflow.SURE + '</span>\
                    </div>\
                    <div class="content">\
                    </div>\
                </div>\
            </div>';
             //_this.opt.fields[item.name] = '1';
             //dom.querySelector('.spContentVal').onclick = function(e){
             //    $(e.currentTarget).next().focus()
             //};
             _this.opt.fields[field.name] = [];
             _this.initUploadFile($(dom), field.name);
             return dom
         },
         createDateFieldWrap: function(field) {
             var dom = document.createElement('div');
             dom.className = 'wkItem divFieldAttr zepto-ev';
             dom.dataset.field = field.name;
             dom.dataset.type = field.type;
             dom.innerHTML = '<div class="wrapResult zepto-ev disableDefault">\
                <label class="infoLabel">' + field.name + '</label>\
                <span class="spContent ' + field.type + '">' + new Date().format('yyyy-MM-dd') + '</span>\
            </div>';
             _this.opt.fields[field.name] = new Date().format('yyyy-MM-dd');
             $(dom).off('tap').on('tap', function(e) {
                 if (typeof datePicker == 'undefined') return;
                 datePicker.show({
                         date: _this.opt.fields[field.name] ? new Date(_this.opt.fields[field.name]) : new Date(),
                         mode: 'date',
                         okText: AppConfig.language == 'zh' ? '确定' : 'Done',
                         cancelText: AppConfig.language == 'zh' ? '取消' : 'Cancel',
                         allowFutureDates: true,
                         doneButtonLabel: AppConfig.language == 'zh' ? '确定' : 'Done',
                         cancelButtonLabel: AppConfig.language == 'zh' ? '取消' : 'Cancel'
                     },
                     setDate,
                     function() {}
                 );

                 function setDate(date) {
                     if (!date) return;
                     var strDate = date.format('yyyy-MM-dd');
                     e.currentTarget.querySelector('.spContent').textContent = strDate;
                     _this.opt.fields[field.name] = strDate;
                 }
             });
             return dom;
         },
         createSelectFieldWrap: function(field) {
             var dom = document.createElement('div');
             dom.className = 'wkItem divFieldAttr zepto-ev';
             dom.dataset.field = field.name;
             dom.dataset.type = field.type;
             dom.innerHTML = '\
            <div class="wrapResult zepto-ev">\
                <label class="infoLabel">' + field.name + '</label>\
                <span class="spContent ' + field.type + '">' + I18n.resource.appDashboard.workflow.NO_CHOICE + '</span>\
            </div>\
            <div class="wrapEdit">\
                <div class="panelMask zepto-ev"></div>\
                <div class="panelEdit">\
                    <div class="tool">\
                        <span class="panelTtl"">' + field.name + '</span>\
                    </div>\
                    <div class="content">\
                    </div>\
                </div>\
            </div>';
             var selectArea = dom.querySelector('.panelEdit .content');
             _this.setFieldSelectItem(field, selectArea);
             var $content = $(dom).find('.spContent');
             var $wrapEdit = $(dom.querySelector('.wrapEdit'));
             $(dom).off('tap').on('tap', '.spItem', function(e) {
                 $wrapEdit.removeClass('focus');
                 if (e.currentTarget.classList.contains('selected')) return;
                 $(e.currentTarget).siblings().removeClass('selected');
                 e.currentTarget.classList.add('selected');
                 _this.opt.fields[field.name] = e.currentTarget.textContent;
                 $content.text(e.currentTarget.textContent)
             });
             return dom;
         },
         createComplexFieldWrap: function(field) {
             var dom = document.createElement('div');
             dom.className = 'wkItem divFieldAttr zepto-ev';
             dom.dataset.field = field.name;
             dom.dataset.type = field.type;
             dom.innerHTML = '\
            <div class="wrapResult zepto-ev">\
                <label class="infoLabel">' + field.name + '</label>\
                <span class="spContent ' + field.type + '">' + I18n.resource.appDashboard.workflow.NO_CHOICE + '</span>\
            </div>\
            <div class="wrapEdit">\
                <div class="panelMask zepto-ev"></div>\
                <div class="panelEdit">\
                    <div class="tool">\
                        <span class="panelTtl"">' + field.name + '</span>\
                    </div>\
                    <div class="content">\
                    </div>\
                </div>\
            </div>';
             var selectArea = dom.querySelector('.panelEdit .content');
             field.option && field.option.forEach(function(opt) {
                 _this.setFieldSelectItem(opt, selectArea)
             }.bind(_this));
             var $content = $(dom).find('.spContent');
             var $wrapEdit = $(dom.querySelector('.wrapEdit'));
             $(dom).off('tap').on('tap', '.spItem', function(e) {
                 $wrapEdit.removeClass('focus');
                 if (e.currentTarget.classList.contains('selected')) return;
                 $(e.currentTarget).siblings().removeClass('selected');
                 e.currentTarget.classList.add('selected');
                 _this.opt.fields[field.name] = e.currentTarget.textContent;
                 $content.text(e.currentTarget.textContent)
             });
             $(selectArea).off('change').on('change', '.iptItem', function(e) {
                 $wrapEdit.removeClass('focus');
                 $(e.currentTarget).parent().siblings().removeClass('selected');
                 $(e.currentTarget).parent().addClass('selected');
                 _this.opt.fields[field.name] = e.currentTarget.value;
                 $content.text(e.currentTarget.value)
             });
             return dom;
         },
         createCustomFieldWrap: function(field) {
             var dom = document.createElement('div');
             dom.className = 'wkItem divFieldAttr zepto-ev';
             dom.dataset.field = field.name;
             dom.dataset.type = field.type;
             dom.innerHTML = '\
            <div class="wrapResult zepto-ev">\
                <label class="infoLabel">' + field.name + '</label>\
                <span class="spContent ' + field.type + '">' + I18n.resource.appDashboard.workflow.NO_CHOICE + '</span>\
            </div>';
             if (field.action instanceof Array) {
                 dom.innerHTML += '\
                <div class="wrapEdit">\
                    <div class="panelMask zepto-ev"></div>\
                    <div class="panelEdit">\
                        <div class="tool">\
                            <span class="panelTtl" i18n="appDashboard.workflow.TAG"></span>\
                        </div>\
                        <div class="content">\
                        </div>\
                    </div>\
                </div>';
                 var selectArea = dom.querySelector('.panelEdit .content');
                 field.action.forEach(function(ipt) {
                     if (!this.customInputOpt[ipt]) return;
                     selectArea.innerHTML += '<span class="spItem zepto-ev" data-act="' + ipt + '">' + this.customInputOpt[ipt].name + '</span>'
                 }.bind(_this));
                 var $wrapEdit = $(dom.querySelector('.wrapEdit'));
                 $(dom).off('tap').on('tap', '.spItem', function(e) {
                     $wrapEdit.removeClass('focus');
                     var iptOpt = _this.customInputOpt[e.currentTarget.dataset.act];
                     if (iptOpt) {
                         iptOpt.act && iptOpt.act(dom.querySelector('.spContent'), field.name);
                     }
                 });
             } else if (_this.customInputOpt[field.action]) {
                 $(dom).off('tap').on('tap', function(e) {
                     _this.customInputOpt[field.action].act && _this.customInputOpt[field.action].act(dom.querySelector('.spContent'), field.name);
                 });
             }
             return dom;
         },
         setFieldSelectItem: function(option, dom) {
             if (!option.type) return;
             switch (option.type) {
                 case 'select':
                     option.option.forEach(function(opt) {
                         if (typeof opt == 'string') {
                             dom.innerHTML += '<span class="spItem zepto-ev">' + opt + '</span>'
                         } else {
                             dom.innerHTML += '<span class="spItem zepto-ev" data-value="' + opt.val + '">' + opt.name + '</span>'
                         }
                     });
                     break;
                 case 'text':
                     dom.innerHTML += '\
                        <span class="spItem"><input class="iptItem" type="' + option.type + '" placeholder="' + (option.type == 'text' ? I18n.resource.appDashboard.workflow.INPUT_TIP : I18n.resource.appDashboard.workflow.NO_CHOICE) + '"></span>';
                     break;
             }
         },
         initProcessUser: function() {
             document.getElementById('wkFieldAttr').innerHTML = '';
             if (!_this.opt.fields.taskGroup) return;
             var $ctn = $('#wkProcessUser');
             var $content = $ctn.find('.spContent');
             var curGrp = _this.taskGrp.filter(function(item) { return item._id == _this.opt.fields.taskGroup })[0];
             var process = curGrp.process.filter(function(item) { return item._id == _this.opt.fields.process })[0];
             $content.html('');
             $ctn.removeClass('focus');
             if (process) {
                 _this.customField.forEach(function(item) {
                     delete _this.opt.fields[item]
                 });
                 this.initProcessField(process.template);

                 var nodes = process.nodes;
                 var node;
                 $ctn.addClass('focus');
                 $content.append(this.createNodeDom());
                 for (var i = 0; i < nodes.length; i++) {
                     node = this.createNodeDom(nodes[i], i);
                     $content.append(node);
                 }
                 $ctn.off('tap').on('tap', '.spProcessNode', function(e) {
                     var $target = $(e.currentTarget);
                     var index = $target.parent().index() - 1;
                     if ($target.parent().hasClass('creator')) return;
                     _this.userPage.selectList = _this.opt.processMember[process.nodes[index]._id];
                     _this.userPage.list = process.nodes[index].members;
                     _this.userPage.mode = 'radio';
                     _this.userPage.teamId = _this.opt.fields.taskGroup;
                     _this.userPage.callback = function(result) {
                         if (result.length > 0) {
                             $target[0].style.backgroundImage = 'url("' + result[0].userpic + '")';
                             $target.children().html(result.map(function(user) {
                                 return '<span>' + user.userfullname + '</span>'
                             }).join(''));
                             _this.opt.processMember[process.nodes[index]._id] = [result[0]]
                         } else {
                             $target[0].style.backgroundImage = 'url("https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/default_group.png")';
                             $target.children().html('<span>' + I18n.resource.appDashboard.workflow.NO_CHOICE + '</span>');
                             _this.opt.processMember[process.nodes[index]._id] = []
                         }
                         _this.opt.processMemeber = {}
                     };
                     _this.userPage.show();
                 });
                 var finishNode = document.createElement('span');
                 finishNode.className = 'completeNode';
                 finishNode.textContent = I18n.resource.appDashboard.workflow.IS_COMPLETE;
                 $content.append(finishNode);
             }
         },
         createNodeDom: function(node, index) {
             var dom = document.createElement('div');
             dom.className = 'divProcessNode';
             if (!node) {
                 node = {
                     behaviour: '0',
                     members: [{
                         userfullname: AppConfig.userProfile.fullname,
                         userpic: 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/' + AppConfig.userProfile.picture
                     }]
                 };
                 dom.className += ' creator';
             }

             var process = document.createElement('span');
             process.className = 'spProcessNode zepto-ev';
             if (node.archType == 4) {
                 process.style.backgroundImage = 'url("https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/avatar/user/default_group.png")';
             } else {
                 process.style.backgroundImage = 'url("' + node.members[0].userpic + '")';
             }

             var user = document.createElement('span');
             user.className = 'spProcessUser';
             if (index != null && node.members instanceof Array && node.members.length == 1) {
                 user.textContent = node.members[0].userfullname;
                 _this.opt.processMember[node._id] = [node.members[0]]
             } else {
                 if (node.archType == 4) {
                     user.textContent = I18n.resource.appDashboard.workflow.WHOLE_MEMBER;
                 } else if (node.archType == 3 && node.archName) {
                     user.textContent = node.archName;
                 } else {
                     user.textContent = node.members[0].userfullname
                 }
             }

             var behavior = document.createElement('span');
             behavior.className = 'spBehavior';
             switch (parseInt(node.behaviour)) {
                 case 0:
                     behavior.textContent = I18n.resource.appDashboard.workflow.PROCESS_CREATOR;
                     break;
                 case 1:
                     behavior.textContent = I18n.resource.appDashboard.workflow.PROCESS_REVIEW;
                     break;
                 case 2:
                     behavior.textContent = I18n.resource.appDashboard.workflow.PROCESS_EXECUTE;
                     break;
             }

             var guide = document.createElement('span');
             guide.className = 'spGuide';

             process.appendChild(user);
             dom.appendChild(process);
             dom.appendChild(behavior);
             dom.appendChild(guide);

             return dom;
         },
         getBarcode: function(dom, field) {
             var promise = $.Deferred();
             if (typeof cordova != 'undefined') {
                 cordova.plugins.barcodeScanner.scan(
                     function(result) {
                         console.log("We got a barcode\n" +
                             "Result: " + result.text + "\n" +
                             "Format: " + result.format + "\n" +
                             "Cancelled: " + result.cancelled);
                         var id = '',
                             text = '';
                         try {
                             id = JSON.parse(result.text).id;
                             text = JSON.parse(result.text).name;
                         } catch (e) {
                             promise.reject();
                             return;
                         }
                         promise.resolveWith(_this, [{ 'id': id, name: text }]);
                     },
                     function(error) {
                         console.log("Scanning failed: " + error);
                         promise.reject();
                     }
                 );
             } else {
                 promise.reject();
             }
             return promise.promise()
         },
         showDeviceTree: function() {
             var $container = $(document.getElementById('containerSideWidget')).show();
             var $btnCloseIot = $('#btnCloseIot');
             this.sideTool = new HierFilter($(this.sideToolCtn), 464, _this);
             this.sideTool.init();
             var option = {
                 search: {
                     show: false
                 },
                 class: {
                     show: false,
                         'projects': {
                             showNone: true
                         },
                         'groups': {
                             class: 'Group'
                         }
                 },
                 tree: {
                     show: true,
                     event: {
                         click: [{
                                 act: function() {},
                                 tar: 'all'
                             },
                             {
                                 act: onNodeClick,
                                 tar: 'things'
                             }
                         ]
                     }
                 }
             };

             this.sideTool.setOption(option);

             function onNodeClick(event, treeId, treeNode) {
                 $btnCloseIot.trigger('click');
                 var field = '设备';
                 var dom = $('[data-field="' + field + '"]').find('.spContent')[0];
                 //dom.querySelector('.noChoiceTip').classList.add('hide');
                 dom.innerHTML = '<span class="linkItem" data-page="iot" data-id="' + treeNode._id + '">' + treeNode.name + '</span>';
                 //var arrItem = $(dom).children();
                 //var str = '';
                 //for (var i = 0; i < arrItem.length ;i++){
                 //    str += arrItem[i].outerHTML;
                 //}
                 _this.opt.fields[field] = dom.innerHTML;

             }
             $btnCloseIot.off('click').on('click', function(e) {
                 _this.sideTool.close();
                 $(_this.sideToolCtn).empty();
                 $container.hide();
             });
         },
         close: function() {

         }
     };
     return WorkflowAdd;
 })();