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
        this.systemEntrance = undefined;//判断是新增项目或修改项目
        this.configProjId = screen.configProjId;
        this.isDTUValid = true; //检查实际项目 项目标识是否合法. 默认为true, 表示没有填写或者改变, 是合法的.
        this.isRealDbValid = true;//检查虚拟项目的实时数据标识是否合法. 默认为true, 标识没有填写或者改变, 是合法的.
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
            _this.$addProj.find('.modal-title').html(I18n.resource.admin.welcom.newProj.EDIT_PROJECT);
            if (_this.configProjId) {
                $('#addOnlinePro').html(I18n.resource.admin.welcom.newProj.EIDT_ONLINE);
            } else {
                $('#addOnlinePro').html(I18n.resource.admin.welcom.newProj.ADD_ONLINE);
            }
            $('#addNewPro').html(I18n.resource.admin.welcom.newProj.ADD);
            //若ID符合赋值给input
            var nameVal=sessionStorage.getItem('valId')==_this.screen.editProjId?sessionStorage.getItem('val'):_this.screen.editProjName
            _this.$addProj.find('.proName').val(nameVal);
        } else {
            _this.$addProj.find('.modal-title').html(I18n.resource.admin.welcom.newProj.ADD_PROJECT);
            $('#addOnlinePro').html(I18n.resource.admin.welcom.newProj.ADD_ONLINE);
            $('#addNewPro').html(I18n.resource.admin.welcom.newProj.ADD);
            _this.$addProj.find('.proName').val('');
        }
        var postData = {}, itemList = {};
        var proNameVal, projDateFormat;
        //新增按钮
        $('#addNewPro').off('click').click(function () {
            _this.$addProj.find('.wrongAlert').html('');
            proNameVal = _this.$addProj.find('.proName').val().trim();
            projDateFormat = _this.$pjDateFormat ? +_this.$pjDateFormat.val() : 0;
            if (!proNameVal) {
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
                            sessionStorage.setItem('val',proNameVal)
                            sessionStorage.setItem('valId',_this.screen.editProjId)
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
                    _this.systemEntrance = '';
                }
            } else {
                proNameVal = _this.$addProj.find('.proName').val();
                if (proNameVal === '') {
                    _this.$addProj.find('.wrongAlert').html(I18n.resource.admin.welcom.newProj.LOG_ADD);//'项目名称或项目中文名称或项目英文名称不能为空！'
                } else {
                    _this.showProjModal();
                    _this.systemEntrance = 'add';
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

        this.$projDataSource = $("#dtuName", this.$formWrap);
        this.$RP_RealTimeDS = $("#realProjectBox .realTimeDS", this.$formWrap);
        this.$RP_historyDS = $("#realProjectBox .historyDS", this.$formWrap);

        this.$VP_RealTimeDS = $("#virtualProjectBOX .realTimeDS", this.$formWrap);
        this.$VP_historyDS = $("#virtualProjectBOX .historyDS", this.$formWrap);

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

        this.$realProject = $('#realProject');
        this.$virtualProject = $('#virtualProject');
        this.$DSType = $('.DSType');


        ///////////////
        // MAP STUFF //
        ///////////////
        this.loadMap('AMap').done(function () {
            // 如果当前是"修改"模式，则需要将当前项目的数据恢复到表单上
            if (_this.projectId) {
                WebAPI.get("/project/getinfo/" + _this.projectId).done(function (rs) {
                    _this.recoverForm(rs.projectinfo);

                    if (rs.projectinfo) {
                        _this.$DSType.filter('[value=' + rs.projectinfo.dsType + ']').click();
                    }
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
            this.$projDataSource.val(form.datadb);
        }

        if (form.mysqlname) {
            if (form.dsType == 'real') {
                this.$RP_RealTimeDS.text(form.mysqlname).attr('title', form.mysqlname);
            } else {
                this.$VP_RealTimeDS.val(form.mysqlname);
            }
        }

        if (form.collectionname) {
            if (form.dsType == 'real') {
                this.$RP_historyDS.text(form.collectionname).attr('title', form.collectionname);
            } else {
                this.$VP_historyDS.val(form.collectionname);
            }
        }

        if (form.is_advance) {
            this.$isAdvance.prop("checked", true);
            this.$regStep.addClass('advance');
            this.$imgLogoPreview.attr('src', '/custom/project_img/' + this.projectId + '_logo.png');
        }

        if (form.latlng) {
            this.$pjLnglat.val(form.latlng);
        }

        if (form.address) {
            this.$pjAddr.val(form.address);
        }

        latlng = form.latlng.split(',');
        this.map && this.map.trigger('click', {
            lnglat: this.map.getPoint(latlng[1], latlng[0]),
            updateAddress: false
        });
        this.$imgPreview.attr({
            'src': '/static/images/project_img/' + form.pic + '?' + new Date().getTime(),
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

            e.updateAddress = typeof e.updateAddress === 'undefined' ? true : e.updateAddress;

            _this.map.removeAllMarkers();
            _this.map.addMarker(point.lng, point.lat);
            _this.map.setFitView();

            if (e.updateAddress) {
                // 获取位置的名称和经纬度
                _this.map.getAddress(point.lng, point.lat, function (rs) {
                    if (rs.status !== 0) return;
                    rs = rs.data;
                    var components = rs[0].components;
                    var city = components.city || components.province || rs[0].name;
                    _this.$pjAddr.val(rs[0].name);
                    _this.$pjLnglat.val(point.lat + ',' + point.lng);
                });
            }
        });
    };
    AddProModal.prototype.setFormFieldError = function ($formField) {
        if ($formField) {
            $formField.addClass('has-error').removeClass('has-success');
        }
    };

    AddProModal.prototype.setFormFieldSuccess = function ($formField) {
        if ($formField) {
            $formField.addClass('has-success').removeClass('has-error');
        }
    };

    AddProModal.prototype.setFormFieldHelpText = function (value) {
        $("#prompt_information").show().text(value);
    };

    /***
     * 检查虚拟项目实时数据标识是否正确
     * @param dbName 实时数据标识
     */
    AddProModal.prototype.checkRealTimeDb = function (dbName) {
        var _this = this;
        WebAPI.post('/admin/checkRealTimeDb', {realTimeDb: dbName}).done(function (result) {
            if (result.success && (!result.data || !result.data.length)) {
                _this.$VP_RealTimeDS.text('beopdata_' + dbName);
                _this.isRealDbValid = true;
            } else {
                _this.$VP_RealTimeDS.text(I18n.resource.admin.projectCreator.REAL_TIME_DATA_USED.format(dbName));
                _this.isRealDbValid = false;
            }
        }).fail(function () {
            _this.isRealDbValid = false;
        });
    };

    AddProModal.prototype.checkDbName = function (dbName) {
        var _this = this;
        WebAPI.post('/admin/checkDbName', {
            dbName: dbName
        }).done(function (result) {
            if (!result.success) {
                _this.isDTUValid = false;
                _this.setFormFieldError(_this.$projDataSource);
                _this.setFormFieldHelpText(I18n.resource.admin.projectCreator.PJ_REALITY_VALUE_TIPS_SERVER_ERROR);
                return;
            }

            $("#prompt_information").hide();
            _this.setFormFieldSuccess(_this.$projDataSource);
            _this.$RP_RealTimeDS.empty().text(result.data.realTimeDS).attr('title', result.data.realTimeDS);
            _this.$RP_historyDS.empty().text(result.data.historyDS).attr('title', result.data.historyDS);

            if (!result.data.valid) {
                _this.isDTUValid = false;
                _this.setFormFieldError(_this.$projDataSource);
                _this.setFormFieldHelpText(I18n.resource.admin.projectCreator.DATA_IDENT_NOT_EXIST.format(dbName));
                return;
            }

            if (result.data.used) {
                _this.isDTUValid = false;
                _this.setFormFieldError(_this.$projDataSource);
                _this.setFormFieldHelpText(I18n.resource.admin.projectCreator.PROJECT_IDENT_USED.format(dbName));
                return;
            }

            _this.isDTUValid = true;
        }).fail(function () {
            _this.isDTUValid = false;
            _this.setFormFieldError(_this.$projDataSource);
            _this.setFormFieldHelpText(I18n.resource.admin.projectCreator.PJ_REALITY_VALUE_TIPS_SERVER_ERROR);
        })
    };

    //在线项目事件
    AddProModal.prototype.attachEvents = function () {
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
                _this.map && _this.map.trigger('click', {
                    lnglat: _this.map.getPoint(latlng[1], latlng[0])
                });
            });

        });

        var nameTimer = null;
        this.$pjCode.off().on('keyup', function () {
            var $this = $(this), value = $this.val().trim();
            nameTimer && clearTimeout(nameTimer);
            if (!value) {
                _this.$VP_RealTimeDS.text('');
                return;
            }

            nameTimer = setTimeout(function () {
                _this.checkRealTimeDb(value);
            }, 500);
        });

        //真实项目标识
        var checkTimer = null;
        this.$projDataSource.off().on('keyup', function () {
            var $this = $(this), dbname = $this.val().trim();
            _this.isDTUValid = false;//一旦填写实际项目标识,就开始检查是否项目标识是否合法
            checkTimer && clearTimeout(checkTimer);
            if (!dbname) {
                //如果删除了项目标识,就不进行检查.
                _this.isDTUValid = true;
                _this.setFormFieldSuccess(_this.$projDataSource);
                _this.setFormFieldHelpText('');
                return false;
            }
            checkTimer = setTimeout(function () {
                _this.checkDbName(dbname);
            }, 500);
        });

        this.$DSType.on('change', function () {
            var $this = $(this);
            $this.closest('.form-ds-type').removeClass('real virtual').addClass($this.val());
            if ($this.val() === 'virtual') {
                _this.checkRealTimeDb(_this.$pjCode.val());
            }
        });

        //关闭按钮
        $('#cancelRegist').click(function () {
            $('#modalframe').find('.frame-container').show();
            $("#addProj").remove();
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

        //提交按钮
        this.$btnSubmit.off('click').click(function (ev) {
            var defer;
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

                //真实项目
                if (_this.$DSType.filter(':checked').val() == 'real') {
                    if (!_this.isDTUValid) {
                        alert.danger(I18n.resource.admin.projectCreator.IDENT_ILLEGAL);
                        return;
                    }
                    formData.append("dbName", _this.$projDataSource.val());
                } else {
                    //虚拟项目
                    if (!_this.isRealDbValid) {
                        alert.danger(I18n.resource.admin.projectCreator.DATA_FULL_NOT_SUBMIT);
                        return;
                    }
                    formData.append("realTimeDS", _this.$VP_RealTimeDS.text().trim());
                    if (_this.$VP_historyDS.val()) {
                        formData.append("historyDS", _this.$VP_historyDS.val().trim());
                    }
                }

                formData.append('userId', AppConfig.userId);
                formData.append('projNameZh', form.pjNameZh);
                formData.append('projNameEn', form.pjNameEn);
                formData.append('address', form.pjAddr);
                formData.append('latlng', _this.$pjLnglat.val());
                formData.append('projDateFormat', +_this.$pjDateFormat.val());
                // show loading
                var postUrl = '/project/';
                if (_this.projectId == undefined) {
                    postUrl += 'create';
                } else {
                    postUrl += 'edit';
                }
                Spinner.spin($('body')[0]);
                $.ajax({
                    url: postUrl,
                    type: 'post',
                    data: formData,
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false
                }).done(function (rs) {
                    if (rs.status === 'OK') {
                        //if (_this.systemEntrance === 'add') {
                        //    alert('Create project successfully');
                        //} else {
                        //    alert('Edit project successfully');
                        //    infoBox.alert('Edit project successfully',{type: 'success', delay: 1000});
                        //}
                        AppConfig.projectList = rs.projects;
                        AppConfig.projectId = rs.projectId;
                        var projDateFormat = +_this.$pjDateFormat.val();
                        var postData = {
                            userId: AppConfig.userId,
                            proName: form.pjCode,
                            proZhName: form.pjNameZh,
                            proEnName: form.pjNameEn,
                            bindId: rs.projectId,
                            projId: _this.projId,
                            timeFormat: projDateFormat
                        };
                        if (_this.projId) {
                            postData['projId'] = _this.projId;
                        }
                        WebAPI.post('/factory/addProject/save', postData).done(function (result) {
                            var $proBox;
                            if (result.status === 'OK') {

                                if (!_this.projId) {
                                    itemList = {
                                        id: result.data._id,
                                        name_cn: form.pjNameZh,
                                        bindId: rs.projectId
                                    };
                                    $proBox = _this.screen.createProItem(itemList, AppConfig.userId);
                                    _this.screen.$projectList.append($proBox);
                                    $proBox.attr('configProjId', rs.projectId);
                                    _this.$addProj.remove();
                                } else {
                                    _this.$addProj.remove();
                                    $proBox = $('#projectList').find('.divHover[projectid="' + _this.projId + '"]');
                                    $proBox.attr('configProjId', rs.projectId);
                                    var $proText = $proBox.find(".proText");
                                    $proText.addClass("bindPro");
                                    $proText.attr('title', form.pjNameZh);
                                    $proText.text(form.pjNameZh);
                                }
                                if (_this.systemEntrance === 'add') {
                                    confirm('Create project successfully,Do you want to refresh immediately?',function(){
                                        window.location.reload();
                                    },function(){
                                        setTimeout("window.location.reload()",3000);
                                    });
                                } else {
                                    confirm('Edit project successfully,Do you want to refresh immediately?',function(){
                                        window.location.reload();
                                    },function(){
                                        setTimeout("window.location.reload()",3000);
                                    });
                                }
                                $('.infoBox').append("<div id='infoBoxProgress'></div>");
                                setTimeout("window.location.reload()",3000);
                            }
                        }).always(function (e) {
                            Spinner.stop();
                        });
                        //关掉当前页面
                        //var $modalframe = $('#modalframe');
                        //$modalframe.find('.frame-container').show();
                        //$("#addProj").remove();
                        //$('#reg-wizard').remove();
                        //location.hash = '#page=UserManagerController&manager=ProjectPermissionManager&projectId=' + AppConfig.projectId;
                    } else {
                        alert('Server is busy, Please try again later.');
                    }
                }).fail(function (e) {
                    Spinner.stop();
                    alert('Server is busy, Please try again later.');
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
        });
        this.$realProject.off('click').click(function () {
            $("#virtualProjectBOX").hide();
            $("#realProjectBox").show();
        });
        this.$virtualProject.off('click').click(function () {
            $("#realProjectBox").hide();
            $("#virtualProjectBOX").show();
        });

    };
    AddProModal.prototype.close = function () {
        this.$addProj = null;
        this.$btnSubmit.unbind();
        this.$pjCode.unbind();
        this.$pjAddr.unbind();
        this.$imgPreview.unbind();
        this.projId = null;
        this.configProjId = null;

        $('body').off();
        this.map.destroy();
    };
    window.AddProModal = new AddProModal();
}());