var PaneProjectCreator = (function() {
    var util = {
        tooltip: {
            show: function($ele, cnt) {
                $ele.attr('data-original-title', cnt);
                $ele.tooltip('show');
                if($ele[0].timer) { window.clearTimeout($ele[0].timer); $ele[0].timer = null; }
                $ele[0].timer = window.setTimeout(function() {
                    $ele.tooltip('hide');
                }, 3000);
            },
            hide: function($ele) {
                $ele.tooltip('hide');
            }
        },
        inputbox: {
            changeStatus: function($ele, status) {
                var $wrap = $ele.parent('div'),
                    $icon = $ele.siblings('.glyphicon'),
                    cls = $icon.attr('class').replace(/\s*\b(?:glyphicon-).+?\b\s*/, ' ').trim();
                $icon.attr('class', cls);
                switch(status) {
                    case 'success':
                        $wrap.addClass('has-success');
                        $icon.addClass('glyphicon-ok');
                        break;
                    case 'error':
                        $wrap.addClass('has-error');
                        $icon.addClass('glyphicon-remove');
                        break;
                    case 'default':
                    default:
                        $wrap.removeClass('has-error has-success');
                        $icon.addClass('glyphicon-pencil');
                        break;
                }
            }
        },
        upload: {
            readURL: function(ele, onSuccess, onError) {
                var file;

                if( !(ele.files && ele.files[0]) ) {
                    alert('上传文件出错了，请刷新页面后重试！');
                    typeof onError === 'function' && onError(1);
                    return false;
                }

                if( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {
                  alert('当前浏览器不支持最新的文件接口！');
                  typeof onError === 'function' && onError(2);
                  return false;
                }

                if( typeof FileReader === "undefined" ) {
                    alert( "当前浏览器不支持 FileReader 接口！" );
                    typeof onError === 'function' && onError(3);
                    return false;
                }

                file = ele.files[0];
                if( !( /image/i ).test( file.type ) ) {
                    alert( "当前文件不是图片，请选择正确的图片进行上传！" );
                    typeof onError === 'function' && onError(4);
                    return false;
                }
                var reader = new FileReader();

                reader.onload = onSuccess;
                reader.readAsDataURL(file);
            }
        }
    }

    function FlowControl () {
        this.$btnPrev = $('#btnPrev');
        this.$btnNext = $('#btnNext');
        this.$panes = $('.step-pane');
        this.$crumbs = $('.reg-wizard > ul li');
        this.step = 0;
        this.totalStep = this.$panes.length;
    }

    FlowControl.prototype.prev = function() {
        this.to(this.step-1);
    };

    FlowControl.prototype.next = function() {
        this.to(this.step+1);
    };

    FlowControl.prototype.to = function(step) {
        var $pane;
        step = Math.min(Math.max(1, step), this.totalStep);
        if(this.step === step) return false;
        $pane = this.$panes.filter('[data-prograss='+step+']');
        $crumb = this.$crumbs.filter('[data-step='+step+']');
        if($pane && $pane.length) {
            this.step = step;
            this.refreshStatus();
            $pane.addClass('active');
            if($crumb && $crumb.length) $crumb.addClass('active');
            return true;
        }
        return false;
    };

    FlowControl.prototype.refreshStatus = function() {
        var $crumb;
        this.$btnPrev.prop('disabled', this.step <= 1 ? true : false);
        this.$btnNext.prop('disabled', this.step >= this.totalStep ? true : false);
        this.$panes.removeClass('active');
        this.$crumbs.removeClass('active complete');
        for (var i = this.$crumbs.length - 1; i >= 0; i--) {
            $crumb = this.$crumbs.eq(i);
            if( parseInt($crumb.attr('data-step')) <  this.step ) {
                $crumb.addClass('complete');
            }
        };
    };

    function PaneProjectCreator() {
        this.map = null;
        this.flowCtl = null;

        // 0: 未填写或填写有误
        // 1: 填写正确
        this.formValidInfo = {
            '#iptPjName': 0,
            '#iptPjAddr': 0,
            '#iptPjCity': 0
        };
    }

    PaneProjectCreator.prototype = {
        show: function() {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            $.get("/static/views/admin/paneProjectCreator.html").done(function(resultHtml) {
                Spinner.stop();
                $(ElScreenContainer).html(resultHtml);
                // Internationalization
                I18n.fillArea($('#reg-wizard').not('input, .map_wrap'));
                I18n.fillAreaAttribute($('.pi_left_ct').eq(0).find('input'), 'placeholder');
                _this.init();
            });
        },
        init: function() {
            var _this = this;
            // initialize flow wizard
            this.flowCtl = new FlowControl();
            this.flowCtl.to(1);

            // do some map stuff ~
            beop.baseMap.load(function(map) {
                _this.map = map;
                // bind map events
                _this.attachMapEvents();
                // create map search pane
                _this.map.addSearchBox('#btnMapSch', '#mapSchPane');
            });
            // bind page events
            this.attachEvents();
        },
        validForm: function(onErrorHandler) {
            var error = 0;
            for (ctl in this.formValidInfo) {
                if (!this.formValidInfo.hasOwnProperty(ctl)) continue;
                if (this.formValidInfo[ctl] !== 1) {
                    error += 1;
                    typeof onErrorHandler && onErrorHandler.call($(ctl));
                }
            }
            return error <= 0;
        },
        attachEvents: function() {
            var _this = this;
            // form elements
            var $pjName = $('#iptPjName');
            var $pjAddr = $('#iptPjAddr');
            var $pjCity = $('#iptPjCity');
            var $pjLnglat = $('#iptPjLnglat');
            var $btnSubmit = $('#btnSubmit');

            // flow button elements
            var $btnPrevStep = $('#btnPrev');
            var $btnNextStep = $('#btnNext');

            // *.jpg upload elements
            var $imgPreview = $('#imgPreview');
            var $pjFile = $('#iptPjFile');

            // *.csv upload elements
            var $btnUploadCSV = $('#btnUploadCSV');
            var $spUploadInfo = $('#spUploadInfo');
            var $pjData = $('#iptPjData');

            // upload drag and drop elements
            var $divPjDataDropHandler = $('#divPjDataDropHandler');
            var $tip = $divPjDataDropHandler.children('p');
            var $uploadMask = $('#uploadMask');
            var $body = $('body');

            var isDataUploadReady = false;
            var isImgUploadReady = false;
            var uploadHandler = null;
            var fileSelected = null;
            // 为优化拖拽上传功能的体验而设置
            var dragFix = false;

            $pjName.tooltip( {title: '', trigger: 'manual'} );
            $pjAddr.tooltip( {title: '', trigger: 'manual'} );
            $pjCity.tooltip( {title: '', trigger: 'manual'} );
            $spUploadInfo.tooltip( {title: '', trigger: 'manual', placement: 'right'});

            $btnPrevStep.click(function() {
                _this.flowCtl.prev();
            });

            $btnNextStep.click(function() {
                if(_this.validForm(function () {$(this).trigger('blur');})) {
                    _this.flowCtl.next();
                }
            });

            $pjName.blur(function(e) {
                var $this = $(this),
                    $wrapDiv = $this.parent('div'),
                    value = $this.val().replace(/^\s+|\s+$/g, '');
                _this.formValidInfo['#iptPjName'] = 0;
                // 判空
                if(!value) {
                    _this.formValidInfo['#iptPjName'] = 0;
                    util.tooltip.show($this, I18n.resource.admin.projectCreator.ERROR_NOT_EMPTY);
                    util.inputbox.changeStatus($this, 'error');
                    return;
                }
                // 判断格式
                if(/[^A-Za-z0-9]/.test(value)) {
                    _this.formValidInfo['#iptPjName'] = 0;
                    util.tooltip.show($this, I18n.resource.admin.projectCreator.ERROR_WRONG_CRITERIA);
                    util.inputbox.changeStatus($this, 'error');
                    return;
                }
                // 无错则恢复
                util.inputbox.changeStatus($this, 'default');
                // 判断名称是否已经存在
                WebAPI.post("/proj_name/check", {proName: value}).done(function(result) {
                    result = eval('('+result+')');
                    if(!result.status) {
                        _this.formValidInfo['#iptPjName'] = 0;
                        util.tooltip.show($this, I18n.resource.admin.projectCreator.ERROR_EXIST_NAME);
                        util.inputbox.changeStatus($this, 'error');
                        return;
                    }
                    _this.formValidInfo['#iptPjName'] = 1;
                    util.inputbox.changeStatus($this, 'success');
                });

                e.preventDefault();
            }).focus(function(e) {
                util.tooltip.hide($(this));
                e.preventDefault();
            });

            $pjAddr.blur(function(e) {
                var $this = $(this);
                var val = $this.val().trim();
                if(val === '') {
                    _this.formValidInfo['#iptPjAddr'] = 0;
                    util.tooltip.show($this, I18n.resource.admin.projectCreator.ERROR_NOT_CHOOSE_ADDRESS);
                    return;
                }
                _this.formValidInfo['#iptPjAddr'] = 1;

                e.preventDefault();
            });

            $pjCity.blur(function(e) {
                var $this = $(this);
                var val = $this.val().trim();
                if(val === '') {
                    _this.formValidInfo['#iptPjCity'] = 0;
                    util.tooltip.show($this, I18n.resource.admin.projectCreator.ERROR_NOT_CHOOSE_ADDRESS);
                    return;
                }
                _this.formValidInfo['#iptPjCity'] = 1;
                e.preventDefault();
            });

            // bind *.jpg upload event
            $imgPreview.click(function(e) {
                $pjFile.click();
                e.preventDefault();
            });
            $pjFile.change(function(e) {
                var file = $(this)[0].files[0];
                if(file.name.match(/\.[A-Za-z0-9]+$/)[0].toLowerCase() !== '.jpg') {
                    isImgUploadReady = false;
                    alert('图片格式有误，请上传正确的 .jpg 格式文件！');
                    return;
                }
                util.upload.readURL($(this)[0], function(e) {
                    $('#imgPreview').attr('src', e.target.result);
                    isImgUploadReady = true;
                }, function (errCode) {
                    isImgUploadReady = false;
                });
                e.preventDefault();
            });

            // bind *.csv upload event
            $btnUploadCSV.click(function (e) {
                $pjData.click();
            });
            uploadHandler = function (file) {
                var formData = new FormData();
                var match = file.name.match(/\.[A-Za-z0-9]+$/);
                if(!file || !match || match[0].toLowerCase() !== '.csv') {
                    util.tooltip.show($spUploadInfo, '文件格式有误，请上传正确的 .csv 格式文件！');
                    isDataUploadReady = false;
                    return;
                }
                fileSelected = file;
                formData.append('config-file', file);
                // forbit multi click
                $btnUploadCSV.prop('disabled', true);
                $.ajax({
                    url: '/get_config_data/'+AppConfig.userId,
                    type: 'post',
                    data: formData,
                    dataType: 'json',
                    xhr: function () {
                        var xhr = $.ajaxSettings.xhr();
                        if(xhr.upload) {
                            xhr.upload.addEventListener('progress', function (e) {
                                var progress = Math.round(e.loaded / e.total * 100);
                                if(e.lengthComputable) {
                                    $spUploadInfo.html('正在上传...'+progress+'%');
                                }
                            }, false);
                            xhr.upload.addEventListener('load', function (e) {
                                $spUploadInfo.html('正在处理数据...');
                            }, false);
                        }
                        return xhr;
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                }).done(function (rs) {
                    $spUploadInfo.removeClass()
                        .addClass('text-success')
                        .html('上传成功 - '+file.name);
                    isDataUploadReady = true;
                }).fail(function (err) {
                    $spUploadInfo.removeClass()
                        .addClass('text-danger')
                        .html('上传失败，文件中有错误！');
                    isDataUploadReady = false;
                }).always(function () {
                    $btnUploadCSV.prop('disabled', false);
                });
            };
            $pjData.change(function () {
                var $this = $(this);
                var file = $this[0].files[0];
                uploadHandler(file);
            });

            // drag and drop upload events
            // drag enter
            $divPjDataDropHandler.on('dragenter', function (e) {
                dragFix = true;
                // console.log('div drag enter');
                $tip.html('松开鼠标开始上传');
                e.preventDefault();
                e.stopPropagation();
            });
            // drag leave
            $divPjDataDropHandler.on('dragleave', function (e) {
                dragFix = false;
                // console.log('div drag leave');
                $tip.html('请将文件拖拽到此处进行上传');
                e.preventDefault();
            });
            // drop
            $divPjDataDropHandler.on('drop', function (e) {
                var files, file;
                $divPjDataDropHandler.hide();
                $uploadMask.hide();
                $tip.html('请将文件拖拽到此处进行上传');
                // upload now
                files = e.originalEvent.dataTransfer.files;
                if(files.length > 1) alert('请注意：\n目前系统不支持同时上传多个文件，将会使用您选择的第一个文件进行上传！');
                file = files[0];
                uploadHandler(file);
                e.stopPropagation();
                e.preventDefault();
            });
            $uploadMask.on('dragenter', function (e) {
                // console.log('mask drag enter');
                e.stopPropagation();
            });
            // cacel drag leave events
            $uploadMask.on('dragleave', function (e) {
                // console.log('mask drag leave');
                e.stopPropagation();
                if(dragFix) return;
                $uploadMask.hide();
                $divPjDataDropHandler.hide();
            });
            // body drag enter events
            $body.on('dragenter', function (e) {
                // console.log('body drag enter');
                $divPjDataDropHandler.show();
                $uploadMask.show();
                e.preventDefault();
            });
            // mock escape event
            $body.on('keydown', function (e) {
                // console.log('body key up');
                if(e.keyCode === 27) {
                    $uploadMask.hide();
                    $divPjDataDropHandler.hide();
                    e.preventDefault();
                }
            });
            //  prevent 'drop' event on elements
            $body.add($uploadMask).add($divPjDataDropHandler).on('dragover', function (e) {
                e.preventDefault();
            });

            $body.on('drop', function (e) {
                $uploadMask.hide();
                $divPjDataDropHandler.hide();
                e.preventDefault();
            });

            // submit
            $btnSubmit.click(function () {
                if(!isDataUploadReady) {
                    util.tooltip.show($spUploadInfo, '请上传您的项目数据文件，并检查其正确性');
                    return;
                }
                var formData = new FormData();
                if(isImgUploadReady) formData.append('pro-pic-file', $pjFile[0].files[0]);
                formData.append('userId', AppConfig.userId);
                formData.append('userName', AppConfig.account);
                formData.append('projName', $pjName.val().trim());
                formData.append('dataFileName', fileSelected.name);
                formData.append('address', $pjAddr.val());
                formData.append('latlng', $pjLnglat.val());
                formData.append('weatherStationId', 101020100);
                // show loading
                Spinner.spin($('body')[0]);
                $.ajax({
                    url: '/project/create',
                    type: 'post',
                    data: formData,
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false
                }).done(function (rs) {
                    if(typeof rs.error === 'successful'){
                        alert('项目创建成功，需要您重新登录系统！');
                        window.location.reload();
                        //ScreenManager.show(ProjectManager);
                    } else {
                        alert('服务器正在忙碌，请稍后重试！');
                    }
                }).fail(function (e) {
                    alert('服务器正在忙碌，请稍后重试！');
                }).always(function (e) {
                    Spinner.stop();
                });
            });

            // close event
            $('#cancelRegist').click(function () {
                ScreenManager.show(UserManagerController, ProjectPermissionManager);
            });
        },
        attachMapEvents: function () {
            var _this = this;
            // 地图点击事件
            this.map.addListener('click', function(e) {
                var point = e.lnglat;
                _this.map.removeAllMarkers();
                _this.map.addMarker(point.lng, point.lat);
                _this.map.setFitView();
                // 获取位置的名称和经纬度
                _this.map.getAddress(point.lng, point.lat, function(rs) {
                    if(rs.status !== 0) return;
                    rs = rs.data;
                    var $pjAddr = $('#iptPjAddr');
                    var $pjCity = $('#iptPjCity');
                    var $pjLnglat = $('#iptPjLnglat')
                    var components = rs[0].components;
                    var city = components.city || components.province || rs[0].name;
                    $pjAddr.val(rs[0].name);
                    $pjCity.val(city);
                    $pjLnglat.val(point.lat+','+point.lng);
                    _this.formValidInfo['#iptPjAddr'] = 1;
                    _this.formValidInfo['#iptPjCity'] = 1;
                    util.inputbox.changeStatus($pjAddr, 'success');
                    util.inputbox.changeStatus($pjCity, 'success');
                });
            });
        },
        detachEvents: function() {
            $('#iptPjName').tooltip('destroy');
            $('#iptPjAddr').tooltip('destroy');
            $('#iptPjCity').tooltip('destroy');
            $('#btnPrev').unbind();
            $('#btnNext').unbind();
            $('#iptPjName').unbind();
            $('#iptPjAddr').unbind();
            $('#iptPjCity').unbind();
            $('#imgPreview').unbind();
            $('#iptPjFile').unbind();

            $('#divPjDataDropHandler').off();
            $('#uploadMask').off
            $('body').off();
        },
        close: function() {
            this.detachEvents();
            this.map.destroy();
        }
    }
    return PaneProjectCreator;
})();