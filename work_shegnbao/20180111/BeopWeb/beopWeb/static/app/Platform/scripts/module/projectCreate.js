var ProjectCreate = (function () {
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


    function ProjectCreate() {
        this.map = null;
        this.container = ElScreenContainer;
        this.projId = AppConfig.projectId ?AppConfig.projectId :undefined;

        this.validator = null;
        this.isAdvance = false;
        this.attrWhiteList = ['id','area','country_name_twoletter','datadb','insertTime','isAdvance','isFavorite','online','source','system','type','lastReceivedTime','name_en','name_cn','s3dbname','mysqlname','update_time','latlng','address','name_english','weather_station_id','pic','collectionname','SaveSvrHistory','is_delete','is_advance','logo','data_time_zone','time_format','is_diag','arrDp','unit_system','unit_currency','hisdata_structure_v2_from_time','management','i18n'];
    }

    ProjectCreate.prototype = {
        show: function () {
            AppConfig.systemEntrance = this.projId?'edit':'add';
            //AppConfig.systemEntrance = 'add';
            var _this = this;
            Spinner.spin(this.container);
            WebAPI.get("/static/app/Platform/views/module/projectCreate.html").done(function (resultHtml) {
                Spinner.stop();
                $(_this.container).html(resultHtml);
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
            this.$projDataSource = $("#dtuName", this.$formWrap);
            this.$RP_RealTimeDS = $("#realProjectBox .realTimeDS", this.$formWrap);
            this.$RP_historyDS = $("#realProjectBox .historyDS", this.$formWrap);

            this.$VP_RealTimeDS = $("#virtualProjectBOX .realTimeDS", this.$formWrap);
            this.$VP_historyDS = $("#virtualProjectBOX .historyDS", this.$formWrap);

            this.$pjAddr = $('#iptPjAddr', this.$formWrap);
            this.$pjLnglat = $('#iptPjLnglat', this.$formWrap);

            this.$pjDateFormat = $('#iptPjDateFormat', this.$formWrap);
            this.$pjCluster = $('#iptPjCluster', this.$formWrap);
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
            this.projectDataSource = false;
            this.loadMap('AMap').done(function () {
                // 如果当前是"修改"模式，则需要将当前项目的数据恢复到表单上
                if (_this.projId) {
                    WebAPI.get("/project/getinfo/" + _this.projId).done(function (rs) {
                        _this.recoverForm(rs.projectinfo);
                        if (rs.projectinfo) {
                            _this.$DSType.filter('[value=' + rs.projectinfo.dsType + ']').click();
                        }
                        //新加属性显示
                        _this.attrDisplay();
                    })
                }
            });
            // bind page events
            this.attachEvents();

            // initlize the validator
            this.initValidator();

            this.$pjCode.attr('placeholder', i18n_resource.admin.projectCreator.PANE1_FORM_ITEM1_TIP);
            this.$pjNameZh.attr('placeholder', i18n_resource.admin.projectCreator.PANE1_FORM_ITEM2_TIP)
        },
        attrDisplay:function(){
            Spinner.spin($('.reg-attribute ')[0]);
            WebAPI.get('/get/projectDetail/' + AppConfig.projectId).done(function (result) {
                var currentProjectAttr = BEOPUtil.getProjectById(this.projId);
                currentProjectAttr = result;
                for(var attr in currentProjectAttr){
                    var isWhite = this.attrWhiteList.indexOf(attr) >= 0 || ["equipment_count","raw_count"].indexOf(attr) >= 0 ? true : false;                    
                    if(!isWhite){
                        var attrList = `<div class="attrBox clearfix">
                            <input type="text" class="col-xs-6 attrName" placeholder="属性名" value="${attr}"/>
                            <input type="text" class="col-xs-4 attrValue" placeholder="属性值" value="${currentProjectAttr[attr]}"/>
                            <div class="btnRemoveAttr col-xs-2"><span class="glyphicon glyphicon-remove-circle"></span></div>
                        </div>`;
                        var $attrJson = $('#attrJson');
                        $attrJson.append(attrList);
                    }
                }
            }.bind(this)).always(()=>{
                Spinner.stop();
            })
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
            defer.resolve();
            return defer;
        },
        recoverForm: function (form) {
            var latlng;
            if (!form) return;
            this.$pjCode.val(form.name_en).prop('readonly', true);
            this.$pjNameZh.val(form.name_cn);
            this.$pjNameEn.val(form.name_english);
            this.$pjDateFormat.val(form.time_format);
            this.$pjCluster.val(form.clusterName);
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
                this.$projDataSource.val(this.projectDataSource);
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
                this.$imgLogoPreview.attr('src', 'https://beopweb.oss-cn-hangzhou.aliyuncs.com/custom/project_img/' + this.projId + '_logo.png');
            }
            
            if (form.latlng) {
                this.$pjLnglat.val(form.latlng);
            }

            if (form.address) {
                this.$pjAddr.val(form.address);
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

        setFormFieldError: function ($formField) {
            if ($formField) {
                $formField.addClass('has-error').removeClass('has-success');
            }
        },

        setFormFieldSuccess: function ($formField) {
            if ($formField) {
                $formField.addClass('has-success').removeClass('has-error');
            }
        },

        setFormFieldHelpText: function (value) {
            $("#prompt_information").show().text(value);
        },

        /***
         * 检查虚拟项目实时数据标识是否正确
         * @param dbName 实时数据标识
         */
        checkRealTimeDb: function (dbName) {
            var _this = this;
            WebAPI.post('/admin/checkRealTimeDb', {realTimeDb: dbName}).done(function (result) {
                if (result.success && (!result.data || !result.data.length)) {
                    _this.$VP_RealTimeDS.text('beopdata_' + dbName);
                    _this.isRealDbValid = true;
                } else {
                    _this.$VP_RealTimeDS.text('');
                    _this.isRealDbValid = false;
                }
            }).fail(function () {
                _this.isRealDbValid = false;
            });
        },

        checkDbName: function (dbName) {
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

                _this.isDTUValid = true;
            }).fail(function () {
                _this.isDTUValid = false;
                _this.setFormFieldError(_this.$projDataSource);
                _this.setFormFieldHelpText(I18n.resource.admin.projectCreator.PJ_REALITY_VALUE_TIPS_SERVER_ERROR);
            })
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
                var $this = $(this), dbName = $this.val().trim();
                _this.isDTUValid = false;//一旦填写实际项目标识,就开始检查是否项目标识是否合法
                checkTimer && clearTimeout(checkTimer);
                if (!dbName) {
                    //如果删除了项目标识,就不进行检查.
                    _this.isDTUValid = true;
                    _this.setFormFieldSuccess(_this.$projDataSource);
                    _this.setFormFieldHelpText('');

                    _this.$RP_RealTimeDS.empty().text('').attr('title', '');
                    _this.$RP_historyDS.empty().text('').attr('title', '');
                    return false;
                }
                checkTimer = setTimeout(function () {
                    _this.checkDbName(dbName);
                }, 500);
            });

            this.$DSType.off('change').on('change', function () {
                var $this = $(this);
                $this.closest('.form-ds-type').removeClass('real virtual').addClass($this.val());
                if ($this.val() === 'virtual') {
                    _this.checkRealTimeDb(_this.$pjCode.val());
                }
            });
            // bind *.jpg upload event
            this.$imgPreview.off('click').click(function (e) {
                _this.$pjFile.click();
                e.preventDefault();
            });
            this.$pjFile.off('change').change(function (e) {
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

            this.$imgLogoPreview.off('click').click(function (e) {
                _this.$pjLogo.click();
                e.preventDefault();
            });

            this.$pjLogo.off('change').change(function (e) {
                util.upload.readURL($(this)[0], function (e) {
                    _this.$imgLogoPreview.attr('src', e.target.result);
                });
                e.preventDefault();
            });

            // submit
            this.$btnSubmit.off('click').click(function (ev) {
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

                    //真实项目
                    if (_this.$DSType.filter(':checked').val() == 'real') {
                        if (_this.isDTUValid === false) {// _this.isDTUValid === undefined is ok.
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
                    formData.append('cluster', _this.$pjCluster.val().trim());

                    // show loading
                    var postUrl = '/project/';
                    if (AppConfig.systemEntrance === 'add') {
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
                            AppConfig.projectList = rs.projects;
                            AppConfig.projectId = rs.projectId;
                            var projDateFormatVal = +_this.$pjDateFormat.val();
                            if (AppConfig.systemEntrance === 'add') {
                                alert(I18n.resource.admin.projectCreator.CREATE_PROJECT_SUCCESSFULLY);
                                AppDriver.addNewProject(form.pjNameZh);
                            } else {
                                alert(I18n.resource.admin.projectCreator.EDIT_PROJECT_SUCCESSFULLY);
                            }
                            var currentId = AppConfig.projectId?AppConfig.projectId:AppConfig.projectList[AppConfig.projectList.length - 1].id;
                            //属性事件

                            var attrList = $('#attrJson').find('.attrBox');
                            var postDataAttr = {};
                            for(var i = 0;i<attrList.length;i++){
                                var $item = $(attrList[i]);
                                var attrName = $item.find('.attrName').val();
                                var attrValue = $item.find('.attrValue').val();
                                if(attrName.trim()!=''&&attrValue.trim()!=''){
                                    var isWhiteList = false;
                                    for(var j = 0;j<_this.attrWhiteList.length;j++){
                                        if(_this.attrWhiteList[j]===attrName){
                                            isWhiteList = true;
                                            break;
                                        }
                                    }
                                    if(!isWhiteList){
                                        postDataAttr[attrName] = attrValue;
                                    }
                                 }
                            }
                            if(Object.keys(postDataAttr).length>0){
                                WebAPI.post('/setProjectProperties/'+currentId,postDataAttr).done(function(result){
                                    if(result){
                                        alert(I18n.resource.admin.projectCreator.EDIT_PROJECT_SUCCESSFULLY);
                                        var nowProject = AppConfig.projectList[AppConfig.projectList.length - 1];
                                        for(var item in postDataAttr){
                                            AppConfig.projectCurrent[item] = postDataAttr[item];
                                            nowProject[item] = postDataAttr[item];
                                        }
                                    }else{
                                        alert(I18n.resource.admin.projectCreator.SAVE_PROJECT_FAIL);
                                    }
                                })
                            }
                            //history.go(-1);
                        } else {
                            alert(I18n.resource.admin.projectCreator.SAVE_PROJECT_FAIL);
                        }
                    }).fail(function (e) {
                        alert(I18n.resource.admin.projectCreator.SAVE_PROJECT_FAIL);
                    }).always(function (e) {
                        Spinner.stop();
                    });

                });
            });

            // close event
            $('#cancelRegist').click(function () {
                history.go(-1);
            });

            this.$isAdvance.change(function () {
                _this.isAdvance = $(this).prop('checked');
                if (_this.isAdvance) {
                    _this.$regStep.addClass('advance');
                } else {
                    _this.$regStep.removeClass('advance');
                }
            })

            //属性编辑事件
            $('#btnAddAttr').off('click').on('click',function(){
                var attrList = `<div class="attrBox clearfix">
                    <input type="text" class="col-xs-6 attrName" placeholder="属性名"></input>
                    <input type="text" class="col-xs-4 attrValue" placeholder="属性值"></input>
                    <div class="btnRemoveAttr col-xs-2"><span class="glyphicon glyphicon-remove-circle"></span></div>
                </div>`
                var $attrJson = $('#attrJson');
                $attrJson.append(attrList);
                _this.attachEvents();
            })

            //属性删除事件
            $(this.container).off('click', '.btnRemoveAttr').on('click', '.btnRemoveAttr', function (e) {
                var $target = $(e.currentTarget);
                var postData = {};
                postData[$target.siblings('.attrName').val()] = null;
                this.removeCostomPorperty(postData).done(()=>{
                    $target.parents('.attrBox').empty().remove();
                })
            }.bind(this))

            $('.attrName').off('blur').blur(function(){
                var $this = $(this);
                var thisValue = $this.val();
                if(thisValue.trim()!=''){
                    for(var j = 0;j<_this.attrWhiteList.length;j++){
                        if(_this.attrWhiteList[j]===thisValue){
                            alert('请修改属性名！');
                            break;
                        }
                    }
                }
            })
        },
        projectFailedInFactory: function () {
            alert('Create project failed');
            WebAPI.post('/admin/deleteProject', {
                'projectId': AppConfig.projectId
            }).done(function () {
                delete AppConfig.projectId;
                AppConfig.projectList.pop();
            });
        },
        removeCostomPorperty: function(postData){
            var currentId = AppConfig.projectId?AppConfig.projectId:AppConfig.projectList[AppConfig.projectList.length - 1].id;
            return WebAPI.post('/setProjectProperties/' + currentId, postData).done(function (result) {                
                if (result) {
                    alert('success');
                } else {
                    alert('fail');
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
            //this.map.destroy();
        }
    };
    return ProjectCreate;
})();