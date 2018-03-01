(function () {
    function MaterialModal() {
        this.$sourceCtn = undefined;
        this.navBtn = [
            { type:'pic',contain: '<div class="icoBtn priMeta"><span class="glyphicon glyphicon-picture icoBtnImg"></span><span class="icoBtnText">私有素材</span></div>' },
            { type:'page',contain: '<div class="icoBtn pages"><span class="glyphicon glyphicon-picture icoBtnImg"></span><span class="icoBtnText">页面</span></div>' },
            { type:'layer',contain: '<div class="icoBtn layers"><span class="glyphicon glyphicon-picture icoBtnImg"></span><span class="icoBtnText">图层</span></div>' },
            { type:'widget',contain: '<div class="icoBtn widgets"><span class="glyphicon glyphicon-picture icoBtnImg"></span><span class="icoBtnText">控件</span></div>' },
            { type: 'img', contain: '<div class="icoBtn pubMeta"><span class="glyphicon glyphicon-picture icoBtnImg"></span><span class="icoBtnText">公共素材</span></div>' }
        ];
        this.materiaModal = undefined;
        this.btnOK = undefined;
        this.$photoUnload = undefined;
        this.$addPhoto = undefined;
        this.$addPrvtPhoto = undefined;
        this.$usePage = undefined;
        this.$deletePrvt = undefined;
        this.$deletePage = undefined;
        this.$deleteLayer = undefined;
        this.$deleteWidget = undefined;
        this.$deletePub = undefined;
        this.store = { 'privateMaterial': [],'publicMaterial':[] };
        this.pageCtn = [];
        this.layerCtn = [];
        this.widgetCtn = [];
        this.onChosenCallback = null;
    }
    
    MaterialModal.prototype.show = function (navArr, callback) {
        var _this = this;
        this.onChosenCallback = callback;
        WebAPI.get('/static/app/WebFactory/scripts/modals/materialModal/materialModal.html').done(function (resultHTML) {
            if ($('#materiaModal').length === 0) {
                $('#mainframe').parent().append(resultHTML);
            }
            $('#materiaModal').show();
            $('#mainframe').addClass('blur');
            _this.materiaModal = $('#materiaModal');
            _this.$photoUnload = _this.materiaModal.find('.uploadPhoto');
            _this.$addPhoto = _this.materiaModal.find('.addPhoto');
            _this.$addPrvtPhoto = _this.materiaModal.find('.addPrvtPhoto');
            _this.$usePage = _this.materiaModal.find('.usePage');
            _this.$deletePrvt = _this.materiaModal.find('.deletePrvt');
            _this.$deletePage = _this.materiaModal.find('.deletePage');
            _this.$deleteLayer = _this.materiaModal.find('.deleteLayer');
            _this.$deleteWidget = _this.materiaModal.find('.deleteWidget');
            _this.$deletePub = _this.materiaModal.find('.deletePub');
            $('#materiaClose').off('click').click(function () {
                _this.materiaModal.hide();
                $('#mainframe').removeClass('blur');
            });
            //加载素材页面左侧导航
            var $navContainer = _this.materiaModal.find('.icoBtn-container');
            $navContainer.children().remove();
            if (!navArr) navArr = ['pic', 'page', 'layer', 'widget', 'img'];
            for (var i = 0; i < navArr.length; i++) {
                var navTitle = navArr[i];
                var isExsit = false;
                var navBtnArr = _this.navBtn;
                for (var j = 0; j < navBtnArr.length; j++) {
                    if (navBtnArr[j].type=== navTitle) {
                        $navContainer.append(navBtnArr[j].contain);
                        break;
                    }
                }
            }

            _this.$sourceCtn = _this.materiaModal.find('.sourceCon');
            _this.$sourceCtn.children().remove();
            _this.btnOK = _this.materiaModal.find('.usePhoto');
            _this.btnOK.hide();
            _this.materiaModal.find('.icoBtn').off('click').click(function () {
                var $current = $(this);
                $current.css('background', 'rgba(28,173,189,0.8)');
                $current.siblings().css('background', 'transparent');
                if ($current.hasClass('priMeta')) {
                    _this.initPriMeta();
                } else if ($current.hasClass('pages')) {
                    _this.initPages();
                } else if ($current.hasClass('layers')) {
                    _this.initLayers();
                } else if ($current.hasClass('widgets')) {
                    _this.initWidgets();
                } else {
                    _this.initPubMeta();
                }
            });
            _this.materiaModal.find('.icoBtn:first-child').trigger('click');
        });
    }
    MaterialModal.prototype.photoCellTpl = '<div class="{classAll}" id="photoItem_{id}"><div class="thumbnail"><img id="{id}"/>\
                                            <div class="selectOK"><span class="glyphicon glyphicon-ok-sign"></span></div>\
                                            <div class="caption"><h3>{title}</h3></div></div></div>';
    MaterialModal.prototype.photoCell = function (result, $current, classAll) {
        var tempHtml = [];
        tempHtml.push(this.photoCellTpl.formatEL({
            classAll:classAll,
            id: result._id,
            title:result.name?result.name:''
        }));
        $current.append(tempHtml.join(''));
    };
    MaterialModal.prototype.showpage = function (data, $btnOne, $btnTwo, type) {
        var _this = this;
        for (var i = 0; i < data.length; i++) {
            if (data[i].type == type) {
                $pageBox = $('<div class="col-sm-6 col-md-4 col-lg-3 pageBox" id="' + data[i]._id + '">\
                                <div class="pageInfo"><div class="pageName">\
                                <span>页面名称:</span><span>' + data[i].name + '</span></div>\
                                <div class="pageCreator"><span>创始人:</span><span>' + data[i].creator + '</span></div>\
                                <div class="pageTime"><span>创始时间:</span><span>' + data[i].time + '</span></div></div>\
                                <div class="pageMask"><span class="glyphicon glyphicon-ok-sign"></span></div></div>');
                _this.$sourceCtn.append($pageBox);
                $('#' + data[i]._id).off('click').click(function () {
                    var $current = $(this);
                    if ($current.hasClass('active')) {
                        $current.removeClass('active');
                        $btnOne.hide();
                        $btnTwo.hide();
                    } else {
                        $current.siblings().removeClass('active');
                        $current.addClass('active');
                        $btnOne.show();
                        $btnTwo.show();
                    }
                });
            }
        }
    };
    MaterialModal.prototype.showPhoto = function (resule, $photoItemBox, $btnOne, $btnTwo) {
        for (var i = 0; i < resule.length; i++) {
            //if (resule[i].interval === 0) {
            //    _this.photoCell(resule[i], $photoItemBox, 'col-sm-6 col-md-4 col-lg-3 photoItem');
            //} else {
            //    _this.photoCell(resule[i], $animItemBox, 'col-sm-12 col-md-12 photoItem');
            //}
            var url,name;
            if (resule[i]) {
                url = resule[i].content ? resule[i].content.url : resule[i].url;
            }
            this.photoCell(resule[i], $photoItemBox, 'col-sm-6 col-md-4 col-lg-3 photoItem');
            this.loadImage(resule[i]._id, url, this.loadResult);
        }
        $('.photoItem').off('click').click(function () {
            var $current = $(this);
            if ($current.hasClass('active')) {
                $current.removeClass('active');
                $btnOne.hide();
                $btnTwo.hide();
            } else {
                if (!$current.find('img').hasClass('noImg')) {
                    $current.parents('.sourceCon').find('.photoItem').removeClass('active');
                    $current.addClass('active');
                    $btnOne.show();
                    $btnTwo.show();
                }
            }
        });
    }
    MaterialModal.prototype.initPriMeta = function () {
        var _this = this;
        this.$sourceCtn.children().remove();
        this.btnOK.hide();
        this.$photoUnload.hide();
        this.$addPhoto.show();
        this.$addPrvtPhoto.hide();
        this.$usePage.hide();
        this.$deletePrvt.hide();
        this.$deletePage.hide();
        this.$deleteLayer.hide();
        this.$deleteWidget.hide();
        this.$deletePub.hide();//JSON.parse(localStorage.getItem('privateMaterial'));
        var $photoItemBox = $('.photoItemBox');
        var $animItemBox = $('.animItemBox');
        $photoItemBox = $('<div class="row photoItemBox"></div>');
        $animItemBox = $('<div class="row animItemBox"></div>')
        this.$sourceCtn.append($photoItemBox).append($animItemBox);
        if (this.store.privateMaterial.length !== 0) {
            _this.showPhoto(this.store.privateMaterial, $photoItemBox, _this.btnOK, _this.$deletePrvt);
        } else {
            WebAPI.get('/factory/projSprite/get/' + AppConfig.project.id).done(function (result) {
                _this.store.privateMaterial = result;
                _this.showPhoto(result, $photoItemBox, _this.btnOK, _this.$deletePrvt);
            });
        }
        this.btnOK.off('click').click(function () {
            var $itemActive = _this.materiaModal.find('.active');
            var activeImgId = $itemActive.find('img').attr('id');
            var datas = _this.store.privateMaterial
            for (var i = 0; i < datas.length; i++) {
                if (datas[i]._id === activeImgId) {
                    typeof _this.onChosenCallback === 'function' && 
                        _this.onChosenCallback(datas[i]);
                    break;
                }
            }
            _this.materiaModal.hide();
            $('#mainframe').removeClass('blur');
        });
        this.$addPhoto.off('click').click(function () {
            _this.materiaModal.find('.pubMeta').trigger('click');
        });
        this.$deletePrvt.off('click').click(function () {
            //删除素材事件
            var $active = _this.$sourceCtn.find('.active');
            var spriteId = $active.find('img').attr('id');
            WebAPI.get('/factory/projSprite/remove/' + AppConfig.project.id + '/' + spriteId).done(function (result) {
                if (result.status === 'OK') {
                    _this.store.privateMaterial = [];
                    $active.remove();
                    _this.$deletePrvt.hide();
                    _this.btnOK.hide();
                }
            });
        });
    };
    MaterialModal.prototype.loadImage = function (id,src,callback) {
        var imgLoad = new window.Image();
        //当图片成功加载到浏览器缓存
        imgLoad.onload = function (e) {
            if (typeof (imgLoad.readyState) == 'undefined') {
                imgLoad.readyState = 'undefined';
            }
            if ((imgLoad.readyState == 'complete' || imgLoad.readyState == 'loaded') || imgLoad.complete) {
                callback({ 'id': id, 'src': src, 'msg': 'ok' });
            } else {
                //imgLoad.onreadystatechange(e);ie8及以下版本会出现
            }
        };
        imgLoad.onerror = function (e) {
            callback({ 'id': id, 'msg': 'error' });
        };
        imgLoad.src = src;
    };
    //图片加载回调函数
    MaterialModal.prototype.loadResult = function (data) {
        var currentObj = document.getElementById('' + data.id);
        data = data || {};
        if (typeof (data.msg) != 'undefined') {
            if (data.msg == 'ok') {
                if (currentObj) {
                    $(currentObj).addClass('photoLoad');
                    currentObj.src = data.src;
                }
            } else {
                if (currentObj) {
                    currentObj.src = '/static/images/home/yellowDot.png';
                    $(currentObj).addClass('noImg photoLoad');
                }
            }
        }
    };
    MaterialModal.prototype.initPages = function () {
        var _this = this;
        this.$sourceCtn.children().remove();
        this.btnOK.hide();
        this.$photoUnload.hide();
        this.$addPhoto.hide();
        this.$addPrvtPhoto.hide();
        this.$usePage.hide();
        this.$deletePrvt.hide();
        this.$deletePage.hide();
        this.$deleteLayer.hide();
        this.$deleteWidget.hide();
        this.$deletePub.hide();
        var $pageBox = undefined;
        if (this.pageCtn.length !== 0) {
            _this.showpage(this.pageCtn, _this.$usePage, _this.$deletePage, 'page');
            //initPhoto(privateMaterial);
        } else {
            WebAPI.get('/factory/material/get/page').done(function (data) {
                _this.pageCtn = data;
                _this.showpage(data, _this.$usePage, _this.$deletePage, 'page');
            });
        }
        //删除页面
        this.$deletePage.off('click').click(function () {
            var $active = _this.$sourceCtn.find('.active');
            var pubMateId = { 'ids': [] };
            pubMateId.ids.push($active.attr('id'));
            WebAPI.post('/factory/material/remove', pubMateId).done(function (result) {
                if (result.status === 'OK') {
                    _this.pageCtn = [];
                    $active.remove();
                    _this.$usePage.hide();
                    _this.$deletePage.hide();
                }
            });
        });
        //使用页面
        this.$usePage.off('click').click(function () {
            var $itemActive = _this.materiaModal.find('.active');
            var activeImgId = $itemActive.attr('id');
            var datas = _this.pageCtn;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i]._id === activeImgId) {
                    typeof _this.onChosenCallback === 'function' && 
                        _this.onChosenCallback(datas[i]);
                    break;
                }
            }
            _this.materiaModal.hide();
            $('#mainframe').removeClass('blur');
        });
    };
    MaterialModal.prototype.initLayers = function () {
        var _this = this;
        this.$sourceCtn.children().remove();
        this.btnOK.hide();
        this.$photoUnload.hide();
        this.$addPhoto.hide();
        this.$addPrvtPhoto.hide();
        this.$usePage.hide();
        this.$deletePrvt.hide();
        this.$deletePage.hide();
        this.$deleteLayer.hide();
        this.$deleteWidget.hide();
        this.$deletePub.hide();
        if (this.layerCtn.length !== 0) {
            _this.showpage(this.layerCtn, _this.$usePage, _this.$deleteLayer, 'layer');
        } else {
            WebAPI.get('/factory/material/get/layer').done(function (data) {
                _this.layerCtn = data;
                _this.showpage(data, _this.$usePage, _this.$deleteLayer, 'layer');
            });
        }
        //删除图层
        this.$deleteLayer.off('click').click(function () {
            var $active = _this.$sourceCtn.find('.active');
            var pubMateId = { 'ids': [] };
            pubMateId.ids.push($active.attr('id'));
            WebAPI.post('/factory/material/remove', pubMateId).done(function (result) {
                if (result.status === 'OK') {
                    _this.layerCtn = [];
                    $active.remove();
                    _this.$usePage.hide();
                    _this.$deleteLayer.hide();
                }
            });
        });
        //使用图层
        this.$usePage.off('click').click(function () {
            var $itemActive = _this.materiaModal.find('.active');
            var activeImgId = $itemActive.attr('id');
            var datas = _this.layerCtn;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i]._id === activeImgId) {
                    typeof _this.onChosenCallback === 'function' && 
                        _this.onChosenCallback(datas[i]);
                    break;
                }
            }
            _this.materiaModal.hide();
            $('#mainframe').removeClass('blur');
        });
    };
    MaterialModal.prototype.initWidgets = function () {
        var _this = this;
        this.$sourceCtn.children().remove();
        this.btnOK.hide();
        this.$photoUnload.hide();
        this.$addPhoto.hide();
        this.$addPrvtPhoto.hide();
        this.$usePage.hide();
        this.$deletePrvt.hide();
        this.$deletePage.hide();
        this.$deleteLayer.hide();
        this.$deleteWidget.hide();
        this.$deletePub.hide();
        if (this.widgetCtn.length !== 0) {
            _this.showpage(this.widgetCtn, _this.$usePage, _this.$deleteWidget, 'widget');
        } else {
            WebAPI.get('/factory/material/get/widget').done(function (data) {
                _this.widgetCtn = data;
                _this.showpage(data, _this.$usePage, _this.$deleteWidget, 'widget');
            });
        }
        //删除控件
        this.$deleteWidget.off('click').click(function () {
            var $active = _this.$sourceCtn.find('.active');
            var pubMateId = { 'ids': [] };
            pubMateId.ids.push($active.attr('id'));
            WebAPI.post('/factory/material/remove', pubMateId).done(function (result) {
                if (result.status === 'OK') {
                    _this.widgetCtn = [];
                    $active.remove();
                    _this.$usePage.hide();
                    _this.$deleteWidget.hide();
                }
            });
        });
        //使用控件
        this.$usePage.off('click').click(function () {
            var $itemActive = _this.materiaModal.find('.active');
            var activeImgId = $itemActive.attr('id');
            var datas = _this.widgetCtn;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i]._id === activeImgId) {
                    typeof _this.onChosenCallback === 'function' && 
                        _this.onChosenCallback(datas[i]);
                    break;
                }
            }
            _this.materiaModal.hide();
            $('#mainframe').removeClass('blur');
        });
    };
    MaterialModal.prototype.initPubMeta = function () {
        var _this = this;
        this.$sourceCtn.children().remove();
        this.btnOK.hide();
        this.$addPhoto.hide();
        this.$addPrvtPhoto.hide();
        this.$usePage.hide();
        this.$deletePrvt.hide();
        this.$deletePage.hide();
        this.$deleteLayer.hide();
        this.$deleteWidget.hide();
        this.$deletePub.hide();
        var $photoItemBox = $('.photoItemBox');
        var $animItemBox = $('.animItemBox');
        var upData = {};
        this.$photoUnload.show();
        $photoItemBox = $('<div class="row photoItemBox" id="photoItemBox"></div>');
        $animItemBox = $('<div class="row animItemBox"></div>');
        this.$sourceCtn.append($photoItemBox).append($animItemBox);
        if (this.store.publicMaterial.length !== 0) {
            _this.showPhoto(this.store.publicMaterial, $photoItemBox, _this.$addPrvtPhoto, _this.$deletePub);
        } else {
            WebAPI.get('/factory/material/get/image').done(function (result) {
                _this.store.publicMaterial = result;
                _this.showPhoto(result, $photoItemBox, _this.$addPrvtPhoto, _this.$deletePub);
            });
        }
        //删除公共素材
        this.$deletePub.off('click').click(function () {
            //_this.deleteMaterial(_this.store.publicMaterial, _this.$addPrvtPhoto, _this.$deletePub);
            var $active = _this.$sourceCtn.find('.active');
            var pubMateId = {'ids':[]};
            pubMateId.ids.push($active.find('img').attr('id'));
            WebAPI.post('/factory/material/remove', pubMateId).done(function (result) {
                if (result.status === 'OK') {
                    _this.store.publicMaterial = [];
                    $active.remove();
                    _this.$addPrvtPhoto.hide();
                    _this.$deletePub.hide();
                }
            });
        });
        //添加到私有素材事件
        this.$addPrvtPhoto.off('click').click(function () {
            var $activeImg = _this.$sourceCtn.find('.active').find('img');
            var materialId = $activeImg.attr('id');
            WebAPI.get('/factory/projSprite/add/' + AppConfig.project.id + '/' + materialId).done(function (result) {
                if (result.status === 'OK') {
                    _this.store.privateMaterial = [];
                    _this.materiaModal.find('.priMeta').trigger('click')
                }
            });
        });
        //上传图片事件
        $('#fileUpload').off('change').change(function () {
            var formData = new FormData();
            var id = ObjectId();
            if ($(this)[0].files[0].name) {
                var imgContent = {
                    interval: 0,
                    list: [],
                    name: $(this)[0].files[0].name,
                    time: new Date().format('yyyy-MM-dd'),
                    creator: JSON.parse(localStorage.getItem('userInfo')).name,
                    w: 200,
                    h: 100
                };
                formData.append('_id', id);
                formData.append('name', $(this)[0].files[0].name);
                formData.append('creator', JSON.parse(localStorage.getItem('userInfo')).name);
                formData.append('time', new Date().format('yyyy-MM-dd'));
                formData.append('public', 1);
                formData.append('group', []);
                formData.append('type', 'image');
                formData.append('content', JSON.stringify(imgContent));
                formData.append('image', $(this)[0].files[0]);
                $.ajax({
                    type: 'POST',
                    url: '/factory/material/saveform',
                    data: formData,
                    cache: false,
                    processData: false,  // 告诉jQuery不要去处理发送的数据
                    contentType: false,// 告诉jQuery不要去设置Content-Type请求头 
                    success: function (data) {
                        _this.store.publicMaterial = [];
                        _this.showPhoto([{ _id: id, name: $('#fileUpload')[0].files[0].name, content: { url: 'http://images.rnbtech.com.hk/' + data } }], $('#photoItemBox'), _this.$addPrvtPhoto, _this.$deletePub);
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            }
        });
    };

    MaterialModal.prototype.close = function () {
        this.$sourceCtn = null;
        this.btnOK = null;
        this.materiaModal = null;
        this.btnOK = null;
        this.$photoUnload = null;
        this.$addPhoto = null;
        this.$addPrvtPhoto = null;
        this.$usePage = null;
        this.$deletePrvt = null;
        this.$deletePage = null;
        this.$deleteLayer = null;
        this.$deleteWidget = null;
        this.$deletePub = null;
        this.store = null;
        this.pageCtn = null;
        this.layerCtn = null;
        this.widgetCtn = null;
        this.onChosenCallback = null;
    };
    window.MaterialModal = new MaterialModal();
}())