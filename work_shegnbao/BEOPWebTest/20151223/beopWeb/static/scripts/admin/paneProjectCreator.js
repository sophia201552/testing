var PaneProjectCreator = (function() {
    var util = {
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


    function PaneProjectCreator(projId) {
        this.map = null;
        this.projId = projId;

        this.validator = null;
    }

    PaneProjectCreator.prototype = {
        show: function() {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            WebAPI.get("/static/views/admin/paneProjectCreator.html").done(function (resultHtml) {
                Spinner.stop();
                $(ElScreenContainer).html(resultHtml);
                // Internationalization
                // 根据是创建还是修改项目，动态修改标题
                if(_this.projId !== undefined)
                    $('.header', '#reg-wizard').children('span').eq(0).attr('i18n', 'admin.projectCreator.REGIST_STEP1_TITLE_2');
                I18n.fillArea($('#reg-wizard').not('input, .map_wrap'));
                I18n.fillAreaAttribute($('.pi_left_ct').eq(0).find('input'), 'placeholder');
                _this.init();
            });
        },
        init: function() {
            var _this = this;

            //////////////////
            // DOM ELEMENTS //
            //////////////////
            this.$formWrap   = $('#formWrap');
            this.$pjCode     = $('#iptPjCode', this.$formWrap);
            this.$pjNameZh   = $('#iptPjNameZh', this.$formWrap);
            this.$pjNameEn   = $('#iptPjNameEn', this.$formWrap);
            this.$pjAddr     = $('#iptPjAddr', this.$formWrap);
            this.$pjLnglat   = $('#iptPjLnglat', this.$formWrap);
            
            this.$imgPreview = $('#imgPreview');
            this.$pjFile     = $('#iptPjFile');

            this.$btnSubmit = $('#btnSubmit');

            ///////////////
            // MAP STUFF //
            ///////////////
            beop.baseMap.load(function(map) {
                _this.map = map;
                // bind map events
                _this.attachMapEvents();
                // create map search pane
                _this.map.addSearchBox('#btnMapSch', '#mapSchPane');
            });
            // bind page events
            this.attachEvents();

            // initlize the validator
            this.initValidator();

            // 如果当前是"修改"模式，则需要将当前项目的数据恢复到表单上
            if(this.projId !== undefined) {
                this.recoverForm( AppConfig.projectList.filter(function (row) {
                    return row.id === _this.projId;
                })[0] );
            }
        },
        recoverForm: function (form) {
            var latlng;
            if(!form) return;
            this.$pjCode.val(form.name_en).prop('readonly', true);
            this.$pjNameZh.val(form.name_cn);
            this.$pjNameEn.val(form.name_english);
            latlng = form.latlng.split(',');
            this.map.trigger('click', { lnglat: this.map.getPoint(latlng[1], latlng[0])});
            this.$imgPreview.attr({
                'src': '/static/images/project_img/'+form.pic,
                'data-name': form.pic
            });
        },
        // init validator
        initValidator: function () {
            this.validator = new Validator(this.$formWrap, {
                elements: [{
                    name: 'pjCode',
                    selector: this.$pjCode,
                    rules: [{
                        valid: 'require',
                        msg: 'Project code must not be empty!'  
                    }, {
                        valid: 'word',
                        msg: 'Project code should only containes letters, numbers and \'_\''
                    }, {
                        valid: function (val) {
                            var _this = this;
                            WebAPI.post("/proj_name/check", {proName: val}).done(function (rs) {
                                if(rs.status === 'OK' && !rs.data.isExist) {
                                    _this.success();
                                } else {
                                    _this.fail();
                                }
                            });
                        },
                        msg: 'Project code already exists!'
                    }]
                }, {
                    name: 'pjNameZh',
                    selector: this.$pjNameZh,
                    rules: [{
                        valid: 'require',
                        msg: 'Project chinese name cannot be empty!'
                    }]
                }, {
                    name: 'pjNameEn',
                    selector: this.$pjNameEn,
                    rules: [{
                        valid: 'require',
                        msg: 'Project english name cannot be empty!'
                    }, {
                        valid: 'word',
                        msg: 'Project english name should only containes letters, numbers and \'_\''
                    }]
                }, {
                    name: 'pjAddr',
                    selector: this.$pjAddr,
                    rules: [{
                        valid: 'require',
                        msg: 'Project address cannot be empty!'
                    }]
                }]
            });
        },
        attachEvents: function() {
            var _this = this;
            var isImgUploadReady = false;

            // bind *.jpg upload event
            this.$imgPreview.click(function(e) {
                _this.$pjFile.click();
                e.preventDefault();
            });
            this.$pjFile.change(function(e) {
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

            // submit
            this.$btnSubmit.click(function () {
                var defer;
                if(_this.projId !== undefined) defer = _this.validator.not('pjCode').valid();
                else defer = _this.validator.valid();
                defer.then(function (form) {
                    var formData = new FormData();

                    if(isImgUploadReady) formData.append('pro-pic-file', _this.$pjFile[0].files[0]);
                    if(_this.projId !== undefined) {
                        formData.append('projId', _this.projId);   
                        formData.append('projCode', _this.$pjCode.val());
                    } else {
                        formData.append('projCode', form.pjCode);
                    }

                    formData.append('userId', AppConfig.userId);
                    formData.append('projNameZh', form.pjNameZh);
                    formData.append('projNameEn', form.pjNameEn);
                    formData.append('address', form.pjAddr);
                    formData.append('latlng', _this.$pjLnglat.val());
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
                        if(rs.status === 'OK'){
                            alert(rs.msg);
                            window.location.reload();
                        } else {
                            alert('服务器正在忙碌，请稍后重试！');
                        }
                    }).fail(function (e) {
                        alert('服务器正在忙碌，请稍后重试！');
                    }).always(function (e) {
                        Spinner.stop();
                    });

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
                    var components = rs[0].components;
                    var city = components.city || components.province || rs[0].name;
                    _this.$pjAddr.val(rs[0].name);
                    _this.$pjLnglat.val(point.lat+','+point.lng);
                });
            });
        },
        detachEvents: function() {
            this.$btnSubmit.unbind();
            this.$pjCode.unbind();
            this.$pjAddr.unbind();
            this.$imgPreview.unbind();

            $('body').off();
        },
        close: function() {
            this.detachEvents();
            this.map.destroy();
        }
    }
    return PaneProjectCreator;
})();