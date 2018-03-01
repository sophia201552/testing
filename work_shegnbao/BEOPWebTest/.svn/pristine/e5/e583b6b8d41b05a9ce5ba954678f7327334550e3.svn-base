(function () {
    var util = {
        upload: {
            readURL: function (ele, onSuccess, onError) {
                var file;

                if (!(ele.files && ele.files[0])) {
                    alert('file upload failed, try again.');
                    typeof onError === 'function' && onError(1);
                    return false;
                }

                if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
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
                if (!(/image/i).test(file.type)) {
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

    function AddProModal() {
        this.screen = null;
    }

    AddProModal.prototype.show = function (screen) {
        var _this = this;
        this.$addProj = undefined;
        this.showModal();
        this.screen = screen;
        this.map = null;
        this.validator = null;
        this.isAdvance = false;
        this.projId = screen.editProjId;//项目id
        this.projectId = undefined;//项目projectId
        this.configProjId = screen.configProjId;
    };
    AddProModal.prototype.showModal = function () {
        var _this = this;
        WebAPI.get('/static/app/WebFactory/scripts/modals/addProject/addProject.html').done(function (resultHtml) {
            if (resultHtml) {
                $('#modalframe').append(resultHtml);
                _this.addEvent();
            }
        });
    };
    AddProModal.prototype.showProjModal = function (projectId) {
        var _this = this;
        this.projectId = projectId;
        var proNameVal = _this.$addProj.find('.proName').val();
        $('#addProj').modal('hide');
        var $modalframe = $('#modalframe');
        Spinner.spin($modalframe[0]);
        //var $newProModal = $('#newProModal');
        var $regWizard = $('#reg-wizard');
        if ($regWizard.length === 0) {
            WebAPI.get("/static/views/admin/paneProjectCreator.html").done(function (resultHtml) {
                Spinner.stop();
                //var newProModal = '<div class="modal fade" id="newProModal">\
                //                    <div class="modal-dialog">\
                //                        <div class="modal-content">\
                //                        <div class="modal-header">\
                //                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                //                            <h4 class="modal-title">Modal title</h4>\
                //                        </div>\
                //                        <div class="modal-body">\
                //                        </div>\
                //                        <div class="modal-footer">\
                //                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                //                            <button type="button" class="btn btn-primary">Save changes</button>\
                //                        </div>\
                //                    </div>\
                //                  </div>\
                //                </div>'
                $modalframe.find('.frame-container').hide();
                $modalframe.append(resultHtml);
                $('#iptPjNameZh').val(proNameVal);
                //$modalframe.append(newProModal);
                //$('#newProModal').find('.modal-body').append(resultHtml)
                //$('#newProModal').modal('show')
                // Internationalization
                // 根据是创建还是修改项目，动态修改标题
                if (_this.projectId)
                    $('.header', '#reg-wizard').children('span').eq(0).attr('i18n', 'admin.projectCreator.REGIST_STEP1_TITLE_2');
                I18n.fillArea($('#reg-wizard').not('input, .map_wrap'));
                I18n.fillAreaAttribute($('.pi_left_ct').eq(0).find('input'), 'placeholder');
                _this.init();
            });
        } else {
            Spinner.stop();
            $modalframe.find('.frame-container').hide();
            $regWizard.show();
            if (_this.projectId)
                $('.header', '#reg-wizard').children('span').eq(0).attr('i18n', 'admin.projectCreator.REGIST_STEP1_TITLE_2');
            $('#iptPjNameZh').val(proNameVal);
            _this.init();
        }
    }
    AddProModal.prototype.addEvent = function () {
        var _this = this;
        _this.$addProj = $('#addProj');
        _this.$addProj.modal();
        I18n.fillArea(_this.$addProj.fadeIn());
        //点击编辑修改文字
        if (_this.projId) {
            _this.$addProj.find('.modal-title').html('编辑项目');
            if (_this.configProjId) {
                $('#addOnlinePro').html('编辑在线项目');
            } else {
                $('#addOnlinePro').html('创建在线项目');
            }
            $('#addNewPro').html('确定');
            _this.$addProj.find('.proName').val(_this.screen.editProjName);
        } else {
            _this.$addProj.find('.modal-title').html('新建项目');
            $('#addOnlinePro').html('生成在线项目');
            $('#addNewPro').html('新增');
            _this.$addProj.find('.proName').val('');
        }
        var postData = {}, itemList = {};
        var proNameVal, projDateFormat;
        //新增按钮
        $('#addNewPro').off('click').click(function () {
            _this.$addProj.find('.wrongAlert').html('');
            proNameVal = _this.$addProj.find('.proName').val();
            projDateFormat = _this.$pjDateFormat ? +_this.$pjDateFormat.val() : 0;
            if (proNameVal === '') {
                _this.$addProj.find('.wrongAlert').html(I18n.resource.admin.welcom.newProj.LOG_ADD);//'项目名称或项目中文名称或项目英文名称不能为空！'
            } else {
                if (_this.projId) {
                    if (_this.configProjId) {
                        postData = {
                            userId: AppConfig.userId,
                            proName: proNameVal,
                            proZhName: proNameVal,
                            proEnName: proNameVal,
                            projId: _this.projId,
                            bindId: _this.configProjId,
                            timeFormat: projDateFormat
                        };
                    } else {
                        postData = {
                            userId: AppConfig.userId,
                            proName: proNameVal,
                            proZhName: proNameVal,
                            proEnName: proNameVal,
                            projId: _this.projId,
                            timeFormat: projDateFormat
                        };
                    }
                } else {
                    postData = {
                        userId: AppConfig.userId,
                        proName: proNameVal,
                        proZhName: proNameVal,
                        proEnName: proNameVal,
                        timeFormat: projDateFormat
                    };
                }
                WebAPI.post('/factory/addProject/save', postData).done(function (result) {
                    if (result.status === 'OK') {
                        var $proBox;
                        if (!_this.projId) {
                            itemList = {
                                id: result.data._id,
                                name_cn: proNameVal
                            };
                            $proBox = _this.screen.createProItem(itemList, AppConfig.userId);
                            _this.screen.$projectList.append($proBox);
                            _this.$addProj.remove();
                        } else {
                            _this.$addProj.remove();
                            $proBox = $('#projectList').find('.divHover[projectid="' + _this.projId + '"]');
                            $proBox.children('.proText').text(proNameVal);
                        }
                        //新建项目默认进入项目
                        $proBox.children('.proText').click();
                    } else {
                        _this.$addProj.find('.wrongAlert').html(result.msg);
                    }
                });
            }
        });
        //生成在线项目按钮
        $('#addOnlinePro').off('click').click(function () {
            if (_this.projId) {
                var projectId = _this.configProjId ? _this.configProjId : null;
                if (!BEOPUtil.isUndefined(projectId)) {
                    _this.showProjModal(projectId);
                }
            } else {
                proNameVal = _this.$addProj.find('.proName').val();
                if (proNameVal === '') {
                    _this.$addProj.find('.wrongAlert').html(I18n.resource.admin.welcom.newProj.LOG_ADD);//'项目名称或项目中文名称或项目英文名称不能为空！'
                } else {
                    _this.showProjModal();
                }
            }
        });
        $('#addClose').off('click').click(function () {
            _this.$addProj.remove();
        });
        _this.$addProj.find('.close').off('click').click(function () {
            _this.$addProj.remove();
        });
    };
    AddProModal.prototype.init = function () {
        var _this = this;

        //////////////////
        // DOM ELEMENTS //
        //////////////////
        this.$formWrap = $('#formWrap');
        this.$pjCode = $('#iptPjCode', this.$formWrap);
        this.$pjNameZh = $('#iptPjNameZh', this.$formWrap);
        this.$pjNameEn = $('#iptPjNameEn', this.$formWrap);
        this.iptPjRealityMarkValue = $("#iptPjRealityMarkValue", this.$formWrap);
        this.$pjAddr = $('#iptPjAddr', this.$formWrap);
        this.$pjLnglat = $('#iptPjLnglat', this.$formWrap);
        this.$pjDateFormat = $('#iptPjDateFormat', this.$formWrap);

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
        this.pjRealityMarkValue = false;
        this.loadMap('AMap').done(function () {
            // 如果当前是"修改"模式，则需要将当前项目的数据恢复到表单上
            if (_this.projectId) {
                WebAPI.get("/project/getinfo/" + _this.projectId).done(function (rs) {
                    _this.recoverForm(rs.projectinfo);
                })
            }
        });
        // bind page events
        this.attachEvents();

        // initlize the validator
        this.initValidator();
    };
    AddProModal.prototype.recoverForm = function (form) {
        var latlng;
        if (!form) return;
        this.$pjCode.val(form.name_en).prop('readonly', true);
        this.$pjNameZh.val(form.name_cn);
        this.$pjNameEn.val(form.name_english);
        this.$pjDateFormat.val(form.time_format);
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
            this.pjRealityMarkValue = form.datadb;
            this.iptPjRealityMarkValue.val(this.pjRealityMarkValue).attr('disabled', true);
        }
        latlng = form.latlng.split(',');
        this.map && this.map.trigger('click', {lnglat: this.map.getPoint(latlng[1], latlng[0])});
        this.$imgPreview.attr({
            'src': '/static/images/project_img/' + form.pic,
            'data-name': form.pic
        });
    };
    // init validator
    AddProModal.prototype.initValidator = function () {
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
    };
    AddProModal.prototype.loadMap = function (type) {
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
    };
    AddProModal.prototype.attachMapEvents = function () {
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
    };
    //在线项目事件
    AddProModal.prototype.attachEvents = function () {
        var _this = this;
        var isImgUploadReady = false;
        // Map Change
        this.$btnSwitchMap.off().on('click', function () {
            var $this = $(this), attrPrefix = 'data-map-type', type = $this.attr(attrPrefix);
            var $AMapSearch = $('.map-sch-wrap');
            _this.map.destroy();
            _this.$pjAddr.val('');
            if (type === 'AMap') {
                $AMapSearch.find('input').val('').end().find('#mapSchPane li').remove().end().hide();
                if ($('#btnGoogleSch').length == 0) {
                    $('#mapContainer').before('<input type="text" class="form-control" id="btnGoogleSch" style="display:none;" placeholder="Search Box" />');
                }
                _this.loadMap('GMap');
                $this.fadeOut(function () {
                    $this.text(I18n.resource.admin.projectCreator.CHANGE_MAP_TO_AMAP).attr(attrPrefix, 'GMap')
                }).fadeIn();
            } else if (type === 'GMap') {
                $AMapSearch.show();
                _this.loadMap('AMap');
                $this.fadeOut(function () {
                    $this.text(I18n.resource.admin.projectCreator.CHANGE_MAP_TO_GOOGLE).attr(attrPrefix, 'AMap')
                }).fadeIn();
            } else {
                $this.fadeOut().text(I18n.resource.admin.projectCreator.CHANGE_MAP_ERROR).fadeIn();
            }
        });
        //真实项目标识
        var checkPJRealityMarkValueTimer = null;
        var $iptPjRealityMarkValueParent = this.iptPjRealityMarkValue.closest('div.form-group');
        var iptPjRealityMarkValueSuccess = function () {
            $iptPjRealityMarkValueParent.addClass('has-success').removeClass('has-error').find(".help-block").text(I18n.resource.admin.projectCreator.PJ_REALITY_VALUE_TIPS_SUCCESS);
        }, iptPjRealityMarkValueFailed = function () {
            $iptPjRealityMarkValueParent.removeClass('has-success').addClass('has-error').find(".help-block").text(I18n.resource.admin.projectCreator.PJ_REALITY_VALUE_TIPS_FAILED);
        }, iptPjRealityMarkValueServerError = function () {
            $iptPjRealityMarkValueParent.removeClass('has-success').addClass('has-error').find(".help-block").text(I18n.resource.admin.projectCreator.PJ_REALITY_VALUE_TIPS_SERVER_ERROR);
        }, iptPjRealityMarkValueDefault = function () {
            $iptPjRealityMarkValueParent.removeClass('has-success').removeClass('has-error').find(".help-block").text(I18n.resource.admin.projectCreator.PJ_REALITY_VALUE_TIPS_DEFAULT);
        };
        this.iptPjRealityMarkValue.off().on('keyup', function () {
            var $this = $(this), value = $this.val().trim();
            if (!value) {
                iptPjRealityMarkValueDefault();
                _this.pjRealityMarkValue = false;
                return false;
            }
            checkPJRealityMarkValueTimer = setTimeout(function () {
                WebAPI.post('/admin/checkPJRealityMarkValue', {realityPJMarkValue: value}).done(function (result) {
                    if (result.success) {
                        if (!result.data.isReality) {
                            iptPjRealityMarkValueFailed();
                            _this.pjRealityMarkValue = undefined;
                        } else {
                            iptPjRealityMarkValueSuccess();
                            _this.pjRealityMarkValue = value;
                        }
                    } else {
                        iptPjRealityMarkValueServerError();
                        _this.pjRealityMarkValue = undefined;
                    }
                }).fail(function () {
                    _this.pjRealityMarkValue = undefined;
                    iptPjRealityMarkValueServerError();
                })
            }, 1333);
        }).on('keydown', function () {
            clearTimeout(checkPJRealityMarkValueTimer);
        });

        //关闭按钮
        $('#cancelRegist').click(function () {
            var $modalframe = $('#modalframe');
            $modalframe.find('.frame-container').show();
            $('#reg-wizard').remove();
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
        //提交按钮
        this.$btnSubmit.off('click').click(function (ev) {
            var defer;
            if (_this.pjRealityMarkValue === undefined) {
                alert("Invalid project identification.");
                ev.preventDefault();
                return false;
            }
            if (_this.configProjId) defer = _this.validator.not('pjCode').valid();
            else defer = _this.validator.valid();
            defer.then(function (form) {
                var formData = new FormData();

                if (isImgUploadReady) formData.append('pro-pic-file', _this.$pjFile[0].files[0]);
                if (_this.isAdvance) {
                    formData.append('isAdvance', _this.isAdvance ? 1 : 0);
                    formData.append('pro-pic-logo', _this.$pjLogo[0].files[0]);
                }
                if (_this.projectId) {
                    formData.append('projId', _this.projectId);
                    formData.append('projCode', _this.$pjCode.val());
                } else {
                    formData.append('projCode', form.pjCode);
                }
                //reality project mark value
                if (_this.pjRealityMarkValue) {
                    formData.append("realityMarkValue", _this.pjRealityMarkValue)
                }

                formData.append('userId', AppConfig.userId);
                formData.append('projNameZh', form.pjNameZh);
                formData.append('projNameEn', form.pjNameEn);
                formData.append('address', form.pjAddr);
                formData.append('latlng', _this.$pjLnglat.val());
                formData.append('weatherStationId', 101020100);
                formData.append('projDateFormat', +_this.$pjDateFormat.val());
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
                        AppConfig.projectList = rs.projects;
                        AppConfig.projectId = rs.projectId;
                        var projDateFormat = +_this.$pjDateFormat.val();
                        if (_this.projId) {
                            var postData = {
                                userId: AppConfig.userId,
                                proName: form.pjNameZh,
                                proZhName: form.pjCode,
                                proEnName: form.pjNameEn,
                                bindId: rs.projectId,
                                projId: _this.projId,
                                timeFormat: projDateFormat
                            };
                        } else {
                            var postData = {
                                userId: AppConfig.userId,
                                proName: form.pjNameZh,
                                proZhName: form.pjCode,
                                proEnName: form.pjNameEn,
                                bindId: rs.projectId,
                                timeFormat: projDateFormat
                            };
                        }
                        WebAPI.post('/factory/addProject/save', postData).done(function (result) {
                            var $proBox;
                            if (result.status === 'OK') {

                                if (!_this.projId) {
                                    itemList = {
                                        id: result.data._id,
                                        name_cn: form.pjNameZh
                                    };
                                    $proBox = _this.screen.createProItem(itemList, AppConfig.userId);
                                    _this.screen.$projectList.append($proBox);
                                    $proBox.attr('configProjId', rs.projectId);
                                    _this.$addProj.remove();
                                } else {
                                    _this.$addProj.remove();
                                    $proBox = $('#projectList').find('.divHover[projectid="' + _this.projId + '"]');
                                    $proBox.attr('configProjId', rs.projectId);
                                    $proBox.find(".proText").addClass("bindPro");
                                }

                            }
                        });
                        //关掉当前页面
                        var $modalframe = $('#modalframe');
                        $modalframe.find('.frame-container').show();
                        $('#reg-wizard').remove();
                        //location.hash = '#page=UserManagerController&manager=ProjectPermissionManager&projectId=' + AppConfig.projectId;
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
        this.$isAdvance.change(function () {
            _this.isAdvance = $(this).prop('checked');
            if (_this.isAdvance) {
                _this.$regStep.addClass('advance');
            } else {
                _this.$regStep.removeClass('advance');
            }
        })
    };
    AddProModal.prototype.close = function () {
        this.$addProj = null;
        this.$btnSubmit.unbind();
        this.$pjCode.unbind();
        this.$pjAddr.unbind();
        this.$imgPreview.unbind();
        this.projId = null;
        this.configProjId = null

        $('body').off();
        this.map.destroy();
    };
    window.AddProModal = new AddProModal();
}());