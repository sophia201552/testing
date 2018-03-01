var PaneProjectCreator = (function () {
    var util = {
        upload: {
            readURL: function (ele, onSuccess, onError) {
                var file;

                if (!(ele.files && ele.files[0])) {
                    alert('file upload failed, try again.');
                    typeof onError === 'function' && onError(1);
                    return false;
                }

                if (!( window.File && window.FileReader && window.FileList && window.Blob )) {
                    alert('he browser not support the latest API.');
                    typeof onError === 'function' && onError(2);
                    return false;
                }

                if (typeof FileReader === "undefined") {
                    alert("The browser not support the latest API.");
                    typeof onError === 'function' && onError(3);
                    return false;
                }

                file = ele.files[0];
                if (!( /image/i ).test(file.type)) {
                    alert("invalid file type.");
                    typeof onError === 'function' && onError(4);
                    return false;
                }
                var reader = new FileReader();

                reader.onload = onSuccess;
                reader.readAsDataURL(file);
            }
        }
    };


    function PaneProjectCreator(projId) {
        this.map = null;
        this.projId = projId;

        this.validator = null;
        this.isAdvance = false;
    }

    PaneProjectCreator.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            WebAPI.get("/static/views/admin/paneProjectCreator.html").done(function (resultHtml) {
                Spinner.stop();
                $(ElScreenContainer).html(resultHtml);
                // Internationalization
                // 根据是创建还是修改项目，动态修改标题
                if (_this.projId !== undefined)
                    $('.header', '#reg-wizard').children('span').eq(0).attr('i18n', 'admin.projectCreator.REGIST_STEP1_TITLE_2');
                I18n.fillArea($('#reg-wizard').not('input, .map_wrap'));
                I18n.fillAreaAttribute($('.pi_left_ct').eq(0).find('input'), 'placeholder');
                _this.init();
            });
        },
        init: function () {
            var _this = this;

            //////////////////
            // DOM ELEMENTS //
            //////////////////
            this.$formWrap = $('#formWrap');
            this.$pjCode = $('#iptPjCode', this.$formWrap);
            this.$pjNameZh = $('#iptPjNameZh', this.$formWrap);
            this.$pjNameEn = $('#iptPjNameEn', this.$formWrap);
            this.$projDataSource = $("#iptPjRealityMarkValue", this.$formWrap);
            this.$pjAddr = $('#iptPjAddr', this.$formWrap);
            this.$pjLnglat = $('#iptPjLnglat', this.$formWrap);

            this.$imgPreview = $('#imgPreview');
            this.$pjFile = $('#iptPjFile');
            this.$pjLogo = $('#iptPjLogo');
            this.$imgLogoPreview = $('#imgLogoPreview');
            this.$isAdvance = $('#isAdvance');
            this.$regStep = $('.reg-step-ct');


            this.$btnSubmit = $('#btnSubmit');
            this.$btnSwitchMap = $('#switch-map-btn');


            ///////////////
            // MAP STUFF //
            ///////////////
            this.projectDataSource = false;
            this.loadMap('AMap').done(function () {
                // 如果当前是"修改"模式，则需要将当前项目的数据恢复到表单上
                if (_this.projId !== undefined) {
                    _this.recoverForm(AppConfig.projectList.filter(function (row) {
                        return row.id === _this.projId;
                    })[0]);
                }
            });
            // bind page events
            this.attachEvents();

            // initlize the validator
            this.initValidator();
        },
        loadMap: function (type) {
            var defer = $.Deferred();
            beop.baseMap.loadAccurateMap(type, function (map) {
                this.map = map;
                // bind map events
                this.attachMapEvents();
                // create map search pane
                this.map.addSearchBox('#btnMapSch', '#mapSchPane');
                defer.resolve();
            }.bind(this));
            return defer;
        },
        recoverForm: function (form) {
            var latlng;
            if (!form) return;
            this.$pjCode.val(form.name_en).prop('readonly', true);
            this.$pjNameZh.val(form.name_cn);
            this.$pjNameEn.val(form.name_english);
            if (form.isAdvance) {
                this.$isAdvance.prop('disabled', true);
                this.$isAdvance.prop('checked', form.isAdvance ? true : false);
                this.$regStep.addClass('advance');
                if (form.logo) {
                    this.$imgLogoPreview.attr('src', form.logo);
                }
                this.isAdvance = Boolean(form.isAdvance);
            }
            if (form.datadb) {
                this.projectDataSource = form.datadb;
                this.$projDataSource.val(this.projectDataSource).attr('disabled', true);
            }
            latlng = form.latlng.split(',');
            this.map && this.map.trigger('click', {lnglat: this.map.getPoint(latlng[1], latlng[0])});
            this.$imgPreview.attr({
                'src': '/static/images/project_img/' + form.pic,
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
                                if (rs.status === 'OK' && !rs.data.isExist) {
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
                        valid: 'wordWithSpace',
                        msg: 'Project english name should only containes letters, numbers, space and \'_\'; Space should not before or after project name.'
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
        attachEvents: function () {
            var _this = this;
            var isImgUploadReady = false;
            // Map Change
            this.$btnSwitchMap.off().on('click', function () {
                var $this = $(this), attrPrefix = 'data-map-type', type = $this.attr(attrPrefix);
                var $AMapSearch = $('.map-sch-wrap');
                var promise;

                _this.map.destroy();
                _this.$pjAddr.val('');
                if (type === 'AMap') {
                    $AMapSearch.find('input').val('').end().find('#mapSchPane li').remove().end().hide();
                    if ($('#btnGoogleSch').length == 0) {
                        $('#mapContainer').before('<input type="text" class="form-control" id="btnGoogleSch" style="display:none;" placeholder="Search Box" />');
                    }
                    promise = _this.loadMap('GMap');
                    $this.fadeOut(function () {
                        $this.text(I18n.resource.admin.projectCreator.CHANGE_MAP_TO_AMAP).attr(attrPrefix, 'GMap')
                    }).fadeIn();
                } else if (type === 'GMap') {
                    $AMapSearch.show();
                    promise = _this.loadMap('AMap');
                    $this.fadeOut(function () {
                        $this.text(I18n.resource.admin.projectCreator.CHANGE_MAP_TO_GOOGLE).attr(attrPrefix, 'AMap')
                    }).fadeIn();
                } else {
                    $this.fadeOut().text(I18n.resource.admin.projectCreator.CHANGE_MAP_ERROR).fadeIn();
                    return;
                }

                promise.done(function () {
                    // 切换地图后，重新显示之前选择的地址
                    var latlng = _this.$pjLnglat.val().split(',');
                    if (latlng.length < 2) {
                        // 未选择地址，则不做后续操作
                        return;
                    }
                    _this.map && _this.map.trigger('click', {lnglat: _this.map.getPoint(latlng[1], latlng[0])});
                });
            });
            //真实项目标识
            var checkPJRealityMarkValueTimer = null;
            var $iptPjRealityMarkValueParent = this.$projDataSource.closest('div.form-group');
            var iptPjRealityMarkValueSuccess = function () {
                $iptPjRealityMarkValueParent.addClass('has-success').removeClass('has-error').find(".help-block").text(I18n.resource.admin.projectCreator.PJ_REALITY_VALUE_TIPS_SUCCESS);
            }, iptPjRealityMarkValueFailed = function () {
                $iptPjRealityMarkValueParent.removeClass('has-success').addClass('has-error').find(".help-block").text(I18n.resource.admin.projectCreator.PJ_REALITY_VALUE_TIPS_FAILED);
            }, iptPjRealityMarkValueServerError = function () {
                $iptPjRealityMarkValueParent.removeClass('has-success').addClass('has-error').find(".help-block").text(I18n.resource.admin.projectCreator.PJ_REALITY_VALUE_TIPS_SERVER_ERROR);
            }, iptPjRealityMarkValueDefault = function () {
                $iptPjRealityMarkValueParent.removeClass('has-success').removeClass('has-error').find(".help-block").text(I18n.resource.admin.projectCreator.PJ_REALITY_VALUE_TIPS_DEFAULT);
            };
            this.$projDataSource.off().on('keyup', function () {
                var $this = $(this), value = $this.val().trim();
                if (!value) {
                    iptPjRealityMarkValueDefault();
                    _this.projectDataSource = false;
                    return false;
                }
                checkPJRealityMarkValueTimer = setTimeout(function () {
                    WebAPI.post('/admin/checkProjDataSource', {dataSource: value}).done(function (result) {
                        if (result.success) {
                            if (!result.data.isReality) {
                                iptPjRealityMarkValueFailed();
                                _this.projectDataSource = undefined;
                            } else {
                                iptPjRealityMarkValueSuccess();
                                _this.projectDataSource = value;
                            }
                        } else {
                            iptPjRealityMarkValueServerError();
                            _this.projectDataSource = undefined;
                        }
                    }).fail(function () {
                        _this.projectDataSource = undefined;
                        iptPjRealityMarkValueServerError();
                    })
                }, 1333);
            }).on('keydown', function () {
                clearTimeout(checkPJRealityMarkValueTimer);
            });
            // bind *.jpg upload event
            this.$imgPreview.click(function (e) {
                _this.$pjFile.click();
                e.preventDefault();
            });
            this.$pjFile.change(function (e) {
                var file = $(this)[0].files[0];
                if (file.name.match(/\.[A-Za-z0-9]+$/)[0].toLowerCase() !== '.jpg') {
                    isImgUploadReady = false;
                    alert('invalid image format.');
                    return;
                }
                util.upload.readURL($(this)[0], function (e) {
                    $('#imgPreview').attr('src', e.target.result);
                    isImgUploadReady = true;
                }, function (errCode) {
                    isImgUploadReady = false;
                });
                e.preventDefault();
            });

            this.$imgLogoPreview.click(function (e) {
                _this.$pjLogo.click();
                e.preventDefault();
            });

            this.$pjLogo.change(function (e) {
                util.upload.readURL($(this)[0], function (e) {
                    _this.$imgLogoPreview.attr('src', e.target.result);
                });
                e.preventDefault();
            });

            // submit
            this.$btnSubmit.click(function (ev) {
                var defer;
                if (_this.projectDataSource === undefined) {
                    alert("Invalid project identification.");
                    ev.preventDefault();
                    return false;
                }
                if (_this.projId !== undefined) defer = _this.validator.not('pjCode').valid();
                else defer = _this.validator.valid();
                defer.then(function (form) {
                    var formData = new FormData();

                    if (isImgUploadReady) formData.append('pro-pic-file', _this.$pjFile[0].files[0]);
                    if (_this.isAdvance) {
                        formData.append('isAdvance', _this.isAdvance ? 1 : 0);
                        formData.append('pro-pic-logo', _this.$pjLogo[0].files[0]);
                    }
                    if (_this.projId !== undefined) {
                        formData.append('projId', _this.projId);
                        formData.append('projCode', _this.$pjCode.val());
                    } else {
                        formData.append('projCode', form.pjCode);
                    }
                    //reality project mark value
                    if (_this.projectDataSource) {
                        formData.append("realityMarkValue", _this.projectDataSource)
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
                        if (rs.status === 'OK') {
                            if (AppConfig.systemEntrance === 'add') {
                                alert('Create project successfully');
                            } else {
                                alert('Edit project successfully');
                            }
                            AppConfig.projectId = rs.projectId;
                            if (rs.projects) {
                                AppConfig.projectList = rs.projects;
                            }
                            location.hash = '#page=UserManagerController&manager=ProjectPermissionManager&projectId=' + AppConfig.projectId;
                        } else {
                            alert('Server is busy, Please try again later.');
                        }
                    }).fail(function (e) {
                        alert('Server is busy, Please try again later.');
                    }).always(function (e) {
                        Spinner.stop();
                    });

                });
            });

            // close event
            $('#cancelRegist').click(function () {
                ScreenManager.show(UserManagerController, 'ProjectPermissionManager');
            });

            this.$isAdvance.change(function () {
                _this.isAdvance = $(this).prop('checked');
                if (_this.isAdvance) {
                    _this.$regStep.addClass('advance');
                } else {
                    _this.$regStep.removeClass('advance');
                }
            })
        },
        attachMapEvents: function () {
            var _this = this;
            // 地图点击事件
            this.map.addListener('click', function (e) {
                var point = e.lnglat;
                _this.map.removeAllMarkers();
                _this.map.addMarker(point.lng, point.lat);
                _this.map.setFitView();
                // 获取位置的名称和经纬度
                _this.map.getAddress(point.lng, point.lat, function (rs) {
                    if (rs.status !== 0) return;
                    rs = rs.data;
                    var components = rs[0].components;
                    var city = components.city || components.province || rs[0].name;
                    _this.$pjAddr.val(rs[0].name);
                    _this.$pjLnglat.val(point.lat + ',' + point.lng);
                });
            });
        },
        detachEvents: function () {
            this.$btnSubmit.unbind();
            this.$pjCode.unbind();
            this.$pjAddr.unbind();
            this.$imgPreview.unbind();

            $('body').off();
        },
        close: function () {
            this.detachEvents();
            this.map.destroy();
        }
    };
    return PaneProjectCreator;
})();