(function () {
    function MaterialModal() {
        this.$sourceCtn = undefined;
        this.navBtn = [
            { type: 'pic', contain: '<div class="icoBtn priMeta"><span class="glyphicon glyphicon-picture icoBtnImg"></span><span class="icoBtnText" i18n="mainPanel.materalPanel.toolbar.PRIVATE_MATERAL"></span></div>'},
            { type: 'page', contain: '<div class="icoBtn pages"><span class="glyphicon glyphicon-picture icoBtnImg"></span><span class="icoBtnText" i18n="mainPanel.materalPanel.toolbar.PAGE_MATERAL"></span></div>' },
            { type: 'layer', contain: '<div class="icoBtn layers"><span class="glyphicon glyphicon-picture icoBtnImg"></span><span class="icoBtnText" i18n="mainPanel.materalPanel.toolbar.LAYER_MATERAL"></span></div>' },
            { type: 'widget', contain: '<div class="icoBtn widgets" data-filter="{filter}"><span class="glyphicon glyphicon-picture icoBtnImg"></span><span class="icoBtnText" i18n="mainPanel.materalPanel.toolbar.BUTTON_MATERAL"></span></div>' },
            { type: 'img', contain: '<div class="icoBtn pubMeta"><span class="glyphicon glyphicon-picture icoBtnImg"></span><span class="icoBtnText" i18n="mainPanel.materalPanel.toolbar.PUBLIC_MATERAL"></span></div>' }
        ];
        this.materiaModal = undefined;
        //this.btnOK = undefined;
        this.$photoUnload = undefined;
        this.$addPhoto = undefined;
        this.$addPrvtPhoto = undefined;
        this.$deletePrvt = undefined;
        this.$deletePage = undefined;
        this.$deleteLayer = undefined;
        this.$deleteWidget = undefined;
        this.$deletePub = undefined;
        this.$usePage = undefined;
        this.$batchApplyPage = undefined;
        this.$editPage = undefined;
        this.$editLayer = undefined;
        this.$addTemplate = undefined;
        this.store = { 'privateMaterial': [],'publicMaterial':[] };
        this.pageCtn = [];
        this.layerCtn = [];
        this.widgetCtn = [];
        this.onChosenCallback = null;
    }
    
    MaterialModal.prototype.show = function (navArr, callback) {
        var _this = this;
        this.onChosenCallback = callback;
        WebAPI.get('/static/app/WebFactory/scripts/screens/page/modals/materialModal/materialModal.html').done(function (resultHTML) {
            if ($('#materiaModal').length === 0) {
                $('#mainframe').parent().append(resultHTML);
            }
            $('#materiaModal').show();
            I18n.fillArea($('#materiaModal').fadeIn());
            $('#mainframe').addClass('blur');

            _this.materiaModal = $('#materiaModal');
            _this.$photoUnload = _this.materiaModal.find('.uploadPhoto');
            _this.$addPhoto = _this.materiaModal.find('.addPhoto');
            _this.$addPrvtPhoto = _this.materiaModal.find('.addPrvtPhoto');
            _this.$deletePrvt = _this.materiaModal.find('.deletePrvt');
            _this.$deletePage = _this.materiaModal.find('.deletePage');
            _this.$deleteLayer = _this.materiaModal.find('.deleteLayer');
            _this.$deleteWidget = _this.materiaModal.find('.deleteWidget');
            _this.$editWidget = _this.materiaModal.find('.editWidget');
            _this.$deletePub = _this.materiaModal.find('.deletePub');
            _this.$usePage = _this.materiaModal.find('.usePage');
            _this.$batchApplyPage = _this.materiaModal.find('.batchApplyPage');
            _this.$editPage = _this.materiaModal.find('.editPage');
            _this.$editLayer = _this.materiaModal.find('.editLayer');
            _this.$addTemplate = _this.materiaModal.find('.addPageTempate');

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
                    if (navTitle.indexOf(navBtnArr[j].type) === 0) {
                        $navContainer.append(navBtnArr[j].contain.formatEL({filter: navTitle.split('.')[1] || ''}));
                        break;
                    }
                }
            }
            I18n.fillArea($navContainer);

            _this.$sourceCtn = _this.materiaModal.find('.sourceCon');
            _this.$sourceCtn.children().remove();

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
                    _this.initWidgets($current[0].dataset.filter);
                } else {
                    _this.initPubMeta();
                }
            });
            _this.materiaModal.find('.icoBtn:first-child').trigger('click');
        });
    }
    MaterialModal.prototype.photoCellTpl = '<div class="{classAll}" id="photoItem_{id}"><span class="animFlag"></span><div class="thumbnail"><img id="{id}"/>\
                                            <div class="selectOK"><span class="glyphicon glyphicon-ok-sign"></span></div>\
                                            </div><div class="caption"><h3>{title}</h3></div></div>';
    MaterialModal.prototype.photoCell = function (result, $current, classAll) {
        var tempHtml = [];
        tempHtml.push(this.photoCellTpl.formatEL({
            classAll:classAll,
            id: result._id,
            title:result.name?result.name:''
        }));
        $current.append(tempHtml.join(''));
    };
    MaterialModal.prototype.showPage = function (data, $tools) {
        var _this = this;
        var $spanSearch = $('#spanSearch');
        var $spanRemove = $('#spanRemove');
        for (var i = 0; i < data.length; i++) {
            $pageBox = $('<div class="col-sm-6 col-md-4 col-lg-2 pageBox" id="' + data[i]._id + '">\
                            <div class="pageInfo"><div class="pageName">\
                            <span class="pageText pageText1">' + I18n.resource.mainPanel.materalPanel.materalRepeat.PAGE_NAME + '</span><span class="pageName">' + data[i].name + '</span></div>\
                            <div class="pageCreator"><span class="pageText pageText2">' + I18n.resource.mainPanel.materalPanel.materalRepeat.PAGE_CREATOR + '</span><span>' + data[i].creator + '</span></div>\
                            <div class="pageTime"><span class="pageText pageText3">' + I18n.resource.mainPanel.materalPanel.materalRepeat.PAGE_TIME + '</span><span>' + data[i].time + '</span></div></div>\
                            <div class="pageMask"><span class="glyphicon glyphicon-ok-sign"></span></div></div>');

            $pageBox.appendTo(this.$sourceCtn);
        }

        //页面，图层，控件的搜索
        $('#iptSearch').bind('keypress',function(event){
            var searchVal = $('#iptSearch').val();
            if (event.keyCode == "13" && searchVal != '') {
                $spanRemove.show();
                $spanSearch.hide();
                for(var i = 0; i < data.length; i++){
                    if(data[i].name.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0){
                        $('#' + data[i]._id).show();
                    }else{
                        $('#' + data[i]._id).hide();
                    }
                }
            } else if(event.keyCode == "13" && searchVal == '') {
                $spanRemove.hide();
                $spanSearch.show();
                for(var i = 0; i < data.length; i++){
                    $('#' + data[i]._id).hide();
                };
            }
        });
        $spanRemove.click(function(){
            $spanRemove.hide();
            $spanSearch.show();
            $('#iptSearch').val('');
            for(var i = 0; i < data.length; i++){
                $('#' + data[i]._id).show();
            };
        });

        this.$sourceCtn.off('click').on('click', '.pageBox', function (e) {
            var $target = $(e.currentTarget);
            var action;

            if ($target.hasClass('active')) {
                $target.removeClass('active');
                action = 'hide';
            } else {
                _this.$sourceCtn.find('.pageBox').removeClass('active');
                $target.addClass('active');
                action = 'show';
            }
            $tools.forEach(function ($tool) {
                $tool[action]();
            });
        });
    };
    MaterialModal.prototype.showPhoto = function (resule, photoBoxArray, $btnOne, $btnTwo) {
        for (var i = 0; i < resule.length; i++) {
            //根据interval判断图片或动画载入到不同的容器
            var interval;
            if (resule[i].interval === 0 || resule[i].interval) {
                interval = resule[i].interval;
            } else {
                interval = resule[i].content.interval;
            }
            if (interval === 0) {
                this.photoCell(resule[i], photoBoxArray[0], 'col-sm-1 col-md-1 col-lg-1 photoItem');//col-sm-6 col-md-4 col-lg-2 photoItem
                $('.photoItemBox').find('.animFlag').css('background', '#078A98').html(I18n.resource.mainPanel.materalPanel.materalRepeat.PHOTO);
            } else {
                this.photoCell(resule[i], photoBoxArray[1], 'col-sm-1 col-md-1 col-lg-1 photoItem');
                $('.animItemBox').find('.animFlag').html(I18n.resource.mainPanel.materalPanel.materalRepeat.ANIMATION);
            }
            var url, name;
            if (resule[i]) {
                url = resule[i].content ? resule[i].content.url : resule[i].url;
            }
            //this.photoCell(resule[i], $photoItemBox, 'col-sm-6 col-md-4 col-lg-2 photoItem');
            this.loadImage(resule[i]._id, url, this.loadResult);
            //图片素材的搜索
            var $spanSearch = $('#spanSearch');
            var $spanRemove = $('#spanRemove');
            $('#iptSearch').bind('keypress',function(event){
                var searchVal = $('#iptSearch').val();
                if (event.keyCode == "13" && searchVal != '') {
                    $spanRemove.show();
                    $spanSearch.hide();
                    for(var i = 0; i < resule.length; i++){
                        if(resule[i].name.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0){
                            $('#' + resule[i]._id).closest('div.photoItem').show();
                        }else{
                            $('#' + resule[i]._id).closest('div.photoItem').hide();
                        }
                    }
                } else if(event.keyCode == "13" && searchVal == '') {
                    $spanRemove.hide();
                    $spanSearch.show();
                    for(var i = 0; i < resule.length; i++){
                        $('#' + resule[i]._id).closest('div.photoItem').hide();
                    };
                }
            });
            $spanRemove.click(function(){
                $spanRemove.hide();
                $spanSearch.show();
                $('#iptSearch').val('');
                for(var i = 0; i < resule.length; i++){
                        $('#' + resule[i]._id).closest('div.photoItem').show();
                    };
            });
        }
        $('.photoItem').off('click').click(function (e) {
            var e = e || window.event;
            e.stopPropagation();
            var $current = $(this);
            var $thumbnail = $current.find('.thumbnail');
            if ($current.hasClass('active')) {
                $current.removeClass('active');
                //$thumbnail.removeClass('hideUseBtn');
                if (!$current.parents('.sourceCon').find('.photoItem').hasClass('active')) {
                    if ($btnOne !== null) $btnOne.hide();
                    $btnTwo.hide();
                }
            } else {
                if (!$current.find('img').hasClass('noImg')) {
                    $current.addClass('active');
                    //$thumbnail.addClass('hideUseBtn');
                    if ($btnOne !== null) $btnOne.show();
                    $btnTwo.show();
                }
            }
        });
    };
    //使用图片或动画
    MaterialModal.prototype.usePriPhoto = function (photoDiff) {
        var _this = this;
        _this.materiaModal.find('.thumbnail').append('<span class="usePriPhoto">' + I18n.resource.mainPanel.materalPanel.privateMateral.USE_PHOTO + '</span>');
        $('.usePriPhoto').off('click').click(function (e) {//this.btnOK
            var e = e || window.event;
            e.stopPropagation();
            e.preventDefault();
            var $itemActive = $(this).parents('.photoItem');
            var activeImgId = $itemActive.find('img').attr('id');
            var datas = (photoDiff === 'priPhoto') ? _this.store.privateMaterial : _this.store.publicMaterial;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i]._id === activeImgId) {
                    if (photoDiff === 'priPhoto') {
                        typeof _this.onChosenCallback === 'function' &&
                            _this.onChosenCallback(datas[i]);
                    } else {
                        var dataContent = {};
                        dataContent = datas[i].content;
                        dataContent['_id'] = datas[i]._id;
                        typeof _this.onChosenCallback === 'function' &&
                            _this.onChosenCallback(dataContent);
                    }
                    break;
                }
            }
            _this.materiaModal.hide();
            $('#mainframe').removeClass('blur');
        });
    };

    MaterialModal.prototype.initPriMeta = function () {
        var _this = this;
        var $photoItemBox = $('<div class="row photoItemBox"></div>');
        var $animItemBox = $('<div class="row animItemBox"></div>');

        this.reset();
        // 需要默认显示的按钮
        this.$addPhoto.show();
        this.$sourceCtn.append($photoItemBox).append($animItemBox);

        if (this.store.privateMaterial.length !== 0) {
            _this.showPhoto(this.store.privateMaterial, [$photoItemBox, $animItemBox],null , _this.$deletePrvt);//_this.btnOK
            _this.usePriPhoto('priPhoto');
        } else {
            WebAPI.get('/factory/projSprite/get/' + AppConfig.project.id).done(function (result) {
                _this.store.privateMaterial = result;
                _this.showPhoto(result, [$photoItemBox, $animItemBox],null , _this.$deletePrvt);//_this.btnOK
                _this.usePriPhoto('priPhoto');
            });
        }
        this.$addPhoto.off('click').click(function () {
            _this.materiaModal.find('.pubMeta').trigger('click');
        });
        this.$deletePrvt.off('click').click(function () {
            //删除素材事件
            var $activeImgs = _this.$sourceCtn.find('.active img');
            var $active = _this.$sourceCtn.find('.active');
            var data = [];
            for (var i = 0,len =$activeImgs.length ; i <len ; i++) {
                var itemId = $activeImgs.eq(i).attr('id');
                data.push(itemId);
            }
            //var spriteId = $active.find('img').attr('id');
            WebAPI.post('/factory/projSprite/remove/' + AppConfig.project.id , data).done(function (result) {
                if (result.status === 'OK') {
                    $active.remove();
                    _this.$deletePrvt.hide();
                    //_this.btnOK.hide();
                    _this.successAlert(I18n.resource.mainPanel.materalPanel.materalRepeat.DELETE_OK);
                }
            });
        });
    };

    MaterialModal.prototype.loadImage = function (id, src, callback) {
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

    // 重置容器
    MaterialModal.prototype.reset = function () {
        this.$sourceCtn.children().remove();

        this.$photoUnload.hide();
        this.$addPhoto.hide();
        this.$addPrvtPhoto.hide();
        this.$usePage.hide();
        this.$deletePrvt.hide();
        this.$deletePage.hide();
        this.$deleteLayer.hide();
        this.$deleteWidget.hide();
        this.$editWidget.hide();
        this.$deletePub.hide();
        this.$batchApplyPage.hide();
        this.$addTemplate.hide();
        this.$editPage.hide();
        this.$editLayer.hide();
    };

    MaterialModal.prototype.initPages = function () {
        var _this = this;
        var $pageBox = undefined;

        this.reset();
        // 需要默认显示的按钮
        this.$addTemplate.show();

        //todo 缓兵之计
        /*if (this.pageCtn.length !== 0) {
            _this.showPage(this.pageCtn, _this.$usePage, _this.$deletePage, 'page');
            //initPhoto(privateMaterial);
        } else {*/
            WebAPI.get('/factory/material/get/page').done(function (data) {
                _this.pageCtn = data;
                _this.showPage(data, [_this.$usePage, _this.$deletePage, _this.$editPage, _this.$batchApplyPage]);
            });
        /*}*/

        //删除页面
        this.$deletePage.off('click').click(function () {
            var $active = _this.$sourceCtn.find('.active');
            var pubMateId = { 'ids': [] };
            pubMateId.ids.push($active.attr('id'));
            WebAPI.post('/factory/material/remove', pubMateId).done(function (result) {
                if (result.status === 'OK') {
                    $active.remove();
                    _this.$usePage.hide();
                    _this.$deletePage.hide();
                    _this.$batchApplyPage.hide();
                }
            });
        });
        //编辑页面
        this.$editPage.off('click').click(function () {
            var pageId = _this.$sourceCtn.find('.active').attr('id');
            var page = (function () {
                if (!_this.pageCtn || _this.pageCtn.length == 0) return;
                for (var i = 0; i < _this.pageCtn.length; i++) {
                    if (_this.pageCtn[i]._id === pageId) {
                        return _this.pageCtn[i];
                    }
                }
                return null;
            }(pageId));
            var content = page.content;

            if (page.type === 'PageScreen' || page.type === 'page') {
                TemplateEditorModal.show({
                    js: content.js,
                    template: typeof content.template === 'string' ? content.template : JSON.stringify(content.template)
                }, function (code) {
                    try{
                        JSON.parse(code.template);
                        content.template = code.template;
                        content.js = code.js;
                    }catch(e){
                        alert(I18n.resource.mainPanel.materalPanel.materalRepeat.FORMAT_LOG);
                        return false;
                    }

                    if (content) { 
                        var data = {
                            _id: pageId,
                            content: $.extend(false, content, {
                                template: code.template,
                                js: code.js
                            })
                        };
                        WebAPI.post('/factory/material/edit', data).done(function (result) {

                        }).fail(function () {

                        }).always(function () {

                    });
                }
                });
            }
        });
        //使用页面
        this.$usePage.off('click').click(function () {
            var pageId = _this.$sourceCtn.find('.active').attr('id');
            var page = (function () {
                if (!_this.pageCtn || _this.pageCtn.length == 0) return;
                for (var i = 0; i < _this.pageCtn.length; i++) {
                    if (_this.pageCtn[i]._id === pageId) {
                        return _this.pageCtn[i];
                    }
                }
                return null;
            }(pageId));
            var content = page.content;

            TemplateEditorModal.show({
                js: content.js,
                template: content.template
            }, function () {

            });
        });

        // 批量生成
        this.$batchApplyPage.off('click').click(function () {
            var pageId = _this.$sourceCtn.find('.active').attr('id');
            var page = (function () {
                if (!_this.pageCtn || _this.pageCtn.length == 0) return;
                for (var i = 0; i < _this.pageCtn.length; i++) {
                    if (_this.pageCtn[i]._id === pageId) {
                        return _this.pageCtn[i];
                    }
                }
                return null;
            }(pageId));
            var content = page.content;

            TemplateBatchEditorModal.show({
                template: ['[', content.template, ']'].join('')
            }, function () {

            });
        });

        // 新建模板
        this.$addTemplate.off('click').click(function () {
            TemplateEditorModal.show({}, function () {

            });
        });
    };
    MaterialModal.prototype.initLayers = function () {
        var _this = this;
        this.reset();

        //todo 缓兵之计
        /*if (this.layerCtn.length !== 0) {
            _this.showPage(this.layerCtn, _this.$usePage, _this.$deleteLayer, 'layer');
        } else {*/
            WebAPI.get('/factory/material/get/layer').done(function (data) {
                _this.layerCtn = data;
                _this.showPage(data, [_this.$usePage, _this.$deleteLayer, _this.$editLayer]);
            });
        /*}*/
        //删除图层
        this.$deleteLayer.off('click').click(function () {
            var $active = _this.$sourceCtn.find('.active');
            var pubMateId = { 'ids': [] };
            pubMateId.ids.push($active.attr('id'));
            WebAPI.post('/factory/material/remove', pubMateId).done(function (result) {
                if (result.status === 'OK') {
                    $active.remove();
                    _this.$usePage.hide();
                    _this.$deleteLayer.hide();
                    _this.successAlert(I18n.resource.mainPanel.materalPanel.materalRepeat.DELETE_OK);
                }
            });
        });
        //编辑图层
        this.$editLayer.off('click').click(function () {
            var layerId = _this.$sourceCtn.find('.active').attr('id');
            var attr = ''
            var layer = (function () {
                if (!_this.layerCtn || _this.layerCtn.length == 0) return;
                for (var i = 0; i < _this.layerCtn.length; i++) {
                    if (_this.layerCtn[i]._id === layerId) {
                        return _this.layerCtn[i];
                    }
                }
                return null;
            }(layerId));
            if (layer.type === 'layer') {
                var content = JSON.stringify(layer.content);
                EditorModal.show(content, false, function (newContent) {
                    try{
                        layer.content = JSON.parse(newContent);
                    }catch(e){
                        alert(I18n.resource.mainPanel.materalPanel.materalRepeat.FORMAT_LOG);
                        return true;
                    }

                    if (layer.content) {
                        var data = {
                            _id: layerId, content: layer.content
                        }
                        WebAPI.post('/factory/material/edit', data).done(function (result) {

                        }).fail(function () {

                        }).always(function () {

                        });
                    }
                });
            }
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
    MaterialModal.prototype.initWidgets = function (filter) {
        var _this = this;
        this.reset();

        // 显示“新增模板”按钮
        this.$addTemplate.show();

        //todo 缓兵之计
        /*if (this.widgetCtn.length !== 0) {
            _this.showPage(this.widgetCtn, _this.$usePage, _this.$deleteWidget, 'widget');
        } else {*/
            WebAPI.get('/factory/material/get/widget').done(function (data) {
                if (filter) {
                    filter = 'widget.'+filter;
                    data = data.filter(function (row) {
                        return row.type === filter;
                    });    
                }
                _this.widgetCtn = data;
                _this.showPage(data, [_this.$usePage, _this.$deleteWidget, _this.$editWidget]);
            });
        /*}*/

        // 新增模板
        this.$addTemplate.off('click').click(function () {
            var $widgitNameModal = $('<div class="modal fade" id="widgitNameModal">\
              <div class="modal-dialog">\
                <div class="modal-content">\
                  <div class="modal-header">\
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                    <h4 class="modal-title">控件</h4>\
                  </div>\
                  <div class="modal-body">\
                        <div class="form-group form-goupCy">\
                            <label for="widgetName" class="col-sm-2 control-label">模板名称:</label>\
                            <div class="col-sm-10">\
                                <input type="text" class="form-control" id="widgetName" i18n="placeholder=mainPanel.exportModal.EXPORT_INFO">\
                            </div>\
                        </div>\
                        <div class="form-group form-goupCy">\
                            <label for="widgetType" class="col-sm-2 control-label">模板类型:</label>\
                            <div class="col-sm-10">\
                                <select class="form-control" id="widgetType"><option value="text">文本控件</option><option value="button">按钮控件</option><option value="html">HTML容器控件</option></select>\
                            </div>\
                        </div>\
                        <div class="form-group" id="wrongInfo">\
                        </div>\
                  </div>\
                  <div class="modal-footer">\
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
                    <button type="button" class="btn btn-primary" id="nameSub">确定</button>\
                  </div>\
                </div>\
              </div>\
            </div>');
            var $materiaModalWrap = $('#materiaModalWrap');
            $('#widgitNameModal').remove();
            $materiaModalWrap.append($widgitNameModal);
            $widgitNameModal.modal('show');
            $('#nameSub').on('click',function () {
                var widgetName = $('#widgetName').val();
                var $wrongInfo = $('#wrongInfo');
                var widgetType = 'widget.HtmlText';
                var widgetTypeSign = $('#widgetType').val();
                if (widgetTypeSign === 'text') {
                    widgetType = 'widget.HtmlText';
                } else if (widgetTypeSign === 'button') {
                    widgetType = 'widget.HtmlButton';
                } else if (widgetTypeSign === 'html') {
                    widgetType = 'widget.HtmlContainer';
                }
                if (widgetName === '') {
                    alert('请输入模板名称！');
                } else {
                    $widgitNameModal.modal('hide');
                    var _id = ObjectId();
                    var data = {
                        _id: _id,
                        name: widgetName,
                        content: (widgetTypeSign === 'text' || widgetTypeSign === 'button') ? { html: '', style: '', js: '' } : { html: '', css: '', js: '' },
                        creator: AppConfig.account,
                        time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                        group: '',
                        'public': 1,
                        type: widgetType
                    };
                    WebAPI.post('/factory/material/save', data).done(function (result) {
                        if (result.status === 'OK') {
                            _this.materiaModal.find('.widgets').trigger('click');
                        }
                    }).always(function () {

                    });
                    CodeEditorModal.show({}, function (code) {
                        var codeCopy ;
                        if (widgetTypeSign === 'text' || widgetTypeSign === 'button') {
                            codeCopy = {
                                style: code.css || ''
                            };
                        } else {
                            codeCopy = code;
                        }
                        var widget = {
                            _id: _id,
                            content: codeCopy
                        };
                        WebAPI.post('/factory/material/edit', widget).done(function (result) {
                            if (result.status === 'OK') {
                                _this.materiaModal.find('.widgets').trigger('click');
                            }
                        }).always(function () {

                        });
                    });
                }
            });
        });

        // 删除控件
        this.$deleteWidget.off('click').click(function () {
            var $active = _this.$sourceCtn.find('.active');
            var pubMateId = { 'ids': [] };
            pubMateId.ids.push($active.attr('id'));
            WebAPI.post('/factory/material/remove', pubMateId).done(function (result) {
                if (result.status === 'OK') {
                    $active.remove();
                    _this.$usePage.hide();
                    _this.$deleteWidget.hide();
                    _this.$editWidget.hide();
                    _this.successAlert(I18n.resource.mainPanel.materalPanel.materalRepeat.DELETE_OK);
                }
            });
        });

        //编辑控件
        this.$editWidget.off('click').click(function () {
            var widgetId = _this.$sourceCtn.find('.active').attr('id');
            var widget = (function(){
                if(!_this.widgetCtn || _this.widgetCtn.length == 0) return;
                for(var i = 0; i < _this.widgetCtn.length; i++){
                    if(_this.widgetCtn[i]._id === widgetId){
                        return _this.widgetCtn[i];
                    }
                }
                return null;
            }(widgetId));
            var content = widget.content;
            var type = 'html';

            if (widget.type.indexOf('HtmlContainer') === -1) {
                content = {
                    css: content['style'] || ''
                }
                type = 'style';
            }
            CodeEditorModal.show(content, function (code) {
                var data;
                if(type == 'style') {
                    widget.content.style = code.css;
                } else if(type == 'html') {
                    widget.content = code;
                }
                data = {
                    _id: widgetId,
                    content: widget.content
                };
                WebAPI.post('/factory/material/edit', data).done(function(result) { 

                }).fail(function () {

                });
            });
        });
        
        //使用控件
        this.$usePage.off('click').click(function () {
            var $itemActive = _this.materiaModal.find('.active');
            var activeImgId = $itemActive.attr('id');
            var datas = _this.widgetCtn;

            for (var i = 0; i < datas.length; i++) {
                if (datas[i]._id === activeImgId) {

                    //TODO 测试confirm
                    confirm(I18n.resource.mainPanel.materalPanel.buttonMateral.USE_COPY, function () {
                        typeof _this.onChosenCallback === 'function' &&
                        _this.onChosenCallback(datas[i], true);
                    }, function () {
                        typeof _this.onChosenCallback === 'function' &&
                        _this.onChosenCallback(datas[i], false);
                    });

                    break;
                }
            }
            _this.materiaModal.hide();
            $('#mainframe').removeClass('blur');
        });
    };

    MaterialModal.prototype.successAlert = function (alertCon) {
        var _this = this;
        var alertContent = alertCon || '';
        this.materiaModal.find('.alert-success').css('display', 'inline-block').html(alertCon);
        setTimeout(function () { _this.materiaModal.find('.alert-success').hide(); }, 1500);
    };

    MaterialModal.prototype.initPubMeta = function () {
        var _this = this;
        var $photoItemBox = $('<div class="row photoItemBox" id="photoItemBox"></div>');
        var $animItemBox = $('<div class="row animItemBox"></div>');
        var upData = {};

        this.reset();
        // 需要默认显示的按钮
        this.$photoUnload.show();
        this.$sourceCtn.append($photoItemBox).append($animItemBox);
        //todo 缓兵之计
        /*if (this.store.publicMaterial.length !== 0) {
            _this.showPhoto(this.store.publicMaterial, $photoItemBox, _this.$addPrvtPhoto, _this.$deletePub);
        } else {*/
            WebAPI.get('/factory/material/get/image').done(function (result) {
                _this.store.publicMaterial = result;
                _this.showPhoto(result, [$photoItemBox, $animItemBox], _this.$addPrvtPhoto, _this.$deletePub);
                _this.usePriPhoto('pubPhoto');
            });
        /*}*/
        
        //删除公共素材
        this.$deletePub.off('click').click(function () {
            //_this.deleteMaterial(_this.store.publicMaterial, _this.$addPrvtPhoto, _this.$deletePub);
            var $activeImgs = _this.$sourceCtn.find('.active img');
            var $active = _this.$sourceCtn.find('.active');
            var pubMateId = {'ids':[]};
            for (var j = 0,len=$activeImgs.length; j < len; j++) {
                var itemId = $activeImgs.eq(j).attr('id');
                pubMateId.ids.push(itemId);
            }
            WebAPI.post('/factory/material/remove', pubMateId).done(function (result) {
                if (result.status === 'OK') {
                    $active.remove();
                    _this.$addPrvtPhoto.hide();
                    _this.$deletePub.hide();
                    _this.successAlert(I18n.resource.mainPanel.materalPanel.materalRepeat.DELETE_OK);
                }
            });
        });
        //添加到私有素材事件
        this.$addPrvtPhoto.off('click').click(function () {
            var $activeImgs = _this.$sourceCtn.find('.active img');
            var $active = _this.$sourceCtn.find('.active');
            var data = [];
            for (var i = 0, len = $activeImgs.length; i < len; i++) {
                var itemId = $activeImgs.eq(i).attr('id');
                data.push(itemId);
            }
            WebAPI.post('/factory/projSprite/add/' + AppConfig.project.id , data).done(function (result) {
                if (result.status === 'OK') {
                    _this.store.privateMaterial = [];
                    $('.active').removeClass('active');
                    _this.$addPrvtPhoto.hide();
                    _this.$deletePub.hide();
                    _this.successAlert(I18n.resource.mainPanel.materalPanel.materalRepeat.ADD_OK);
                }
            });
        });
        //筛选符合规则的图片
        function filterImg(files) {
            var arrFiles = [];
            for (var i = 0, len = files.length; i < len; i++) {
                var file = files[i];
                if (!/(gif|jpg|png|jpeg)$/i.test(file.type)) {
                    alert(I18n.resource.mainPanel.materalPanel.publicMateral.UPLOAD_INFO);
                } else {
                    if (file.size > 614400) {
                        alert(I18n.resource.mainPanel.materalPanel.publicMateral.UPLOAD_INFO_TIP);
                    } else {
                        arrFiles.push(file);
                    }
                }
            }
            return arrFiles;
        };
        //读取并编辑符合规则的图片
        function readImage(files, imgsLoadSuccess) {
            var image = new Image();
            var $imgFilterBox = $('#imgFilterBox');
            var file;
            var imgInfoArr = [];
            var count = 0,i=0;
            var len = files.length;
            var imgFileCellTpl = '<div class="formSingle clearfix">\
                        <div class="imgCheck col-sm-2">\
                            <div class="imgCheckBox"><img src="{src}"/></div>\
                        </div>\
                        <div class="imgInfos col-sm-9">\
                            <div class="form-group">\
                                <label for="inputName" class="col-sm-1 control-label">Name:</label>\
                                <div class="col-sm-11">\
                                    <input type="text" class="form-control" id="inputName_{i}" placeholder="write name">\
                                </div>\
                            </div><div class="form-group">\
                                <label class="col-sm-1 control-label">Type:</label>\
                                <label class="radio-inline radio-inline_{i}">\
                                    <input type="radio" name="inlineRadioOptions_{i}" id="inlineRadio1_{i}" value="option1" checked> static\
                                </label>\
                                <label class="radio-inline radio-inline_{i} ">\
                                    <input type="radio" name="inlineRadioOptions_{i}" id="inlineRadio2_{i}" class="inlineRadio" value="option2"> animation\
                                </label>\
                            </div>\
                            <div id="radioAnimation_{i}" class="clearfix radioAnimation">\
                                <div class="form-group animationInfo">\
                                    <label for="inputWidth" class="col-sm-3 control-label">Frame:</label><div class="col-sm-8">\
                                        <input type="text" class="form-control" id="inputFrame_{i}" placeholder="write frame">\
                                    </div><span></span>\
                                </div>\
                                <div class="form-group animationInfo">\
                                    <label for="inputInterval" class="col-sm-3 control-label">Interval:</label><div class="col-sm-8">\
                                        <input type="text" class="form-control" id="inputInterval_{i}" placeholder="write interval">\
                                    </div><span>ms</span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>';
            //for (var i = 0; i < len; i++) {
            //建立编辑页面
            var editImgInfo=function(){
                var reader = new FileReader();
                file = files[i];
                if (file){
                    reader.readAsDataURL(file);
                    reader.onload = function (_file) {
                        image.src = _file.target.result;
                        image.onload = function () {
                            imgInfoArr.push({
                                pw: this.width,
                                ph: this.height
                            });
                            count += 1;
                            if (count === len) {
                                imgsLoadSuccess(imgInfoArr, files);
                            } else if (count<len) {
                                editImgInfo();
                            }
                            //imgsLoadSuccess(imgInfo, i);
                        //return imgInfo;
                        };
                        image.onerror = function () {
                            alert('Invaild file type' + file.type);
                        };
                        $imgFilterBox.append(imgFileCellTpl.formatEL({
                            src: image.src,
                            i: i
                        }));
                        i++;
                    };
                }
            }
            editImgInfo();
            //}
        };
        //为成功上传的图片建立dom对象
        function imgsLoadSuccess(imgInfoArr, imgStandardArr) {
            var imgContentArr = [];
            var $formModal = $('#formModal');//模态框
            var $fileUpload = $('#fileUpload');
            $formModal.modal('show');
            $formModal.off('hide.bs.modal').on('hide.bs.modal',function(){//每次隐藏模态框，清空处理一次图片路径
                        $fileUpload.replaceWith( $fileUpload = $fileUpload.clone(true));
                    });
            var $inputSelect = $formModal.find('.radio-inline');
            //动画模式被选中时
            $inputSelect.off('click').on('click', function () {
                var $radioAnimation = $(this).parents('.imgInfos').find('.radioAnimation');
                if ($('.inlineRadio').is(":checked")) {//animation被选中,弹出width和interval
                    $radioAnimation.show();
                } else {
                    $radioAnimation.hide();
                }
            });
            $formModal.off('shown.bs.modal').on('shown.bs.modal', function () {//弹出模态框
                $('#buttonOk').off('click').on('click', function () {//点击OK按钮
                    for (var j = 0, len = imgStandardArr.length; j < len; j++) {
                        var imgContent = {
                            interval: 0,
                            list: [],
                            name: '',
                            time: new Date().format('yyyy-MM-dd'),
                            creator: AppConfig.userProfile['fullname']
                        };
                        imgContent.w = imgInfoArr[j].pw;
                        imgContent.h = imgInfoArr[j].ph;
                        if ($('#inlineRadio2_' + j).is(":checked")) {//animation被选中
                            imgContent.name = $('#inputName_' + j).val();//改值
                            imgContent.pf = parseInt($('#inputFrame_' + j).val());//图片的帧数
                            imgContent.pw = parseInt(imgContent.w / imgContent.pf);//图片的单帧宽度
                            imgContent.interval = parseFloat($('#inputInterval_' + j).val());//图片的每帧的毫秒数
                            imgContent.list = [];
                            for (var i = 0; i < imgContent.pf; i++) {
                                imgContent.list.push(i * imgContent.pw, 0, imgContent.pw, imgContent.h);
                            }
                            //imgContent.list = $('#inputWidth').val().split(',').map(function (row) {return parseFloat(row);});
                            //submit();//ajax
                        } else {
                            imgContent.name = $('#inputName_' + j).val();//改值
                            //submit();//ajax
                        }
                        imgContentArr.push(imgContent);
                    }
                    submit();
                    $('#formModal').modal('hide');//隐藏模态框
                });
                function submit() {
                    for (var i = 0, len = imgStandardArr.length; i < len; i++) {
                        var formData = new FormData();
                        var id = ObjectId();
                        var count = 0;
                        imgContentArr[i].id = id;
                        formData.append('_id', id);
                        formData.append('name', imgContentArr[i].name + '.' + imgStandardArr[i].type.substring(6));
                        formData.append('creator', JSON.parse(localStorage.getItem('userInfo')).name);
                        formData.append('time', new Date().format('yyyy-MM-dd'));
                        formData.append('public', 1);
                        formData.append('group', []);
                        formData.append('type', 'image');
                        formData.append('content', JSON.stringify(imgContentArr[i]));
                        formData.append('image', imgStandardArr[i]);
                        formData.append('w', imgContentArr[i].w);
                        formData.append('h', imgContentArr[i].h);
                        $.ajax({
                            type: 'POST',
                            url: '/factory/material/saveform',
                            data: formData,
                            cache: false,
                            processData: false,  // 告诉jQuery不要去处理发送的数据
                            contentType: false,// 告诉jQuery不要去设置Content-Type请求头
                            success: function (data) {
                                _this.store.publicMaterial = [];
                                var standId = data.split('/')[4].split('.')[0];
                                if (count < imgStandardArr.length) {
                                    for (var j = 0, len = imgContentArr.length; j < len;j++){
                                        if (imgContentArr[j].id === standId) {
                                            _this.showPhoto([{ _id: imgContentArr[j].id, name: imgContentArr[j].name + '.' + imgStandardArr[j].name.split('.')[1], content: { url: 'http://images.rnbtech.com.hk/' + data, interval: imgContentArr[j].interval } }], [$photoItemBox, $animItemBox], _this.$addPrvtPhoto, _this.$deletePub);
                                            break;
                                        }
                                    }
                                    count++;
                                }
                            },
                            error: function (data) {
                                console.log(data);
                            }
                        });
                    }
                }
            });
        }
        //上传图片事件
        $('#fileUpload').off('change').change(function (e) {
            var imgFilterHtml;
            var imgCheck = e.target.files || e.dataTransfer.files;
            var imgStandardArr = filterImg(imgCheck);
            var $imgFilterBox = $('#imgFilterBox');
            $imgFilterBox.children().remove();
            //为每个图片添加索引
            for (var i = 0, file; file = imgStandardArr[i]; i++) {
                file.index = i;
            }
            readImage(imgStandardArr, imgsLoadSuccess);
        });
    };

    MaterialModal.prototype.close = function () {
        this.$sourceCtn = null;
        //this.btnOK = null;
        this.materiaModal = null;
        this.$photoUnload = null;
        this.$addPhoto = null;
        this.$addPrvtPhoto = null;
        this.$usePage = null;
        this.$deletePrvt = null;
        this.$deletePage = null;
        this.$deleteLayer = null;
        this.$deleteWidget = null;
        this.$deletePub = null;
        this.$batchApplyPage = null;
        this.$addTemplate = null;

        this.store = null;
        this.pageCtn = null;
        this.layerCtn = null;
        this.widgetCtn = null;
        this.onChosenCallback = null;
    };
    window.MaterialModal = new MaterialModal();
}());