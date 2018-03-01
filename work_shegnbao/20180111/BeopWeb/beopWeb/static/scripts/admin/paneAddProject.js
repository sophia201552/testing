var PaneAddProject = (function () {
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


    function PaneAddProject(projId) {
        this.map = null;
        this.projId = projId;
    }

    PaneAddProject.prototype = {
        show: function () {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            WebAPI.get("/static/views/admin/paneAddProject.html").done(function (resultHtml) {
                Spinner.stop();
                $(ElScreenContainer).html(resultHtml);
                I18n.fillArea($('#reg-wizard').not('input, .map_wrap'));
                _this.init();
            });
        },
        init: function () {
            this.$formWrap = $('#formWrap');
            this.$pjName = $('#addProjectName', this.$formWrap);
            this.$pjAddr = $('#iptPjAddr', this.$formWrap);
            this.$pjLnglat = $('#iptPjLnglat', this.$formWrap);
            this.$imgPreview = $('#imgPreview');
            this.$pjFile = $('#iptPjFile');
            this.$btnSubmit = $('#btnSubmit');
            this.$btnSwitchMap = $('#switch-map-btn');
            this.loadMap('AMap');
            // bind page events
            this.attachEvents();

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
            // bind *.jpg upload event
            this.$imgPreview.click(function (e) {
                _this.$pjFile.click();
                e.preventDefault();
            });
            this.$pjFile.change(function (e) {
                var file = this.files[0];
                if (file.name.match(/\.[A-Za-z0-9]+$/)[0].toLowerCase() !== '.jpg') {
                    isImgUploadReady = false;
                    alert('invalid image format.');
                    return;
                }
                util.upload.readURL(this, function (e) {
                    _this.$imgPreview.attr('src', e.target.result);
                    $("#addProjectDefaultPic").text(file.name);
                    isImgUploadReady = true;
                }, function (errCode) {
                    isImgUploadReady = false;
                });
                e.preventDefault();
            });

            // submit
            this.$btnSubmit.click(function () {
                var formData = new FormData(),
                    nameVal = _this.$pjName.val().trim();
                if (nameVal == '') {
                    alert(I18n.resource.admin.projectCreator.PROJECT_NAME_REQUIRED);
                    return;
                }

                formData.append('userId', AppConfig.userId);
                formData.append('name', nameVal);
                formData.append('note', $("#addProjectNote").val().trim());
                formData.append('address', $("#iptPjAddr").val().trim());
                formData.append('latlng', _this.$pjLnglat.val().trim());
                if (isImgUploadReady) {
                    formData.append('pro-pic-file', _this.$pjFile[0].files[0]);
                }
                formData.append('cluster', $('#iptPjCluster').val().trim());
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
                        AppConfig.projectList = rs.projects;
                        AppConfig.projectId = rs.projectId;
                        WebAPI.post('/factory/addProject/save', {
                            userId: AppConfig.userId,
                            proName: nameVal,
                            proZhName: nameVal,
                            proEnName: nameVal,
                            bindId: rs.projectId,
                            projId: AppConfig.projectId
                        }).done(function (result) {
                            if (result.status === 'OK') {
                                new PaneProjectSelector().initProject(AppConfig.projectId).done(function () {
                                    location.hash = 'page=ModBusInterface';
                                });
                            } else {
                                _this.projectFailedInFactory();
                            }
                        }).fail(function () {
                            _this.projectFailedInFactory();
                        });
                    } else {
                        alert('Server is busy, Please try again later.');
                    }
                }).fail(function (e) {
                    alert('Server is busy, Please try again later.');
                }).always(function (e) {
                    Spinner.stop();
                });
            });

            // close event
            $('#cancelRegister').click(function () {
                history.go(-1);
            });
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
                    _this.$pjAddr.val(rs[0].name);
                    _this.$pjLnglat.val(point.lat + ',' + point.lng);
                });
            });
        },
        detachEvents: function () {
            this.$btnSubmit.unbind();
            this.$pjAddr.unbind();
            this.$imgPreview.unbind();
            $('body').off();
        },
        close: function () {
            this.detachEvents();
            this.map.destroy();
        }
    };
    return PaneAddProject;
})();