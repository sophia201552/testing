(function (WidgetProp) {
    var _this = undefined;
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });
    function HtmlButtonProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
        _this = this;
    }

    HtmlButtonProp.prototype = Object.create(WidgetProp.prototype);
    HtmlButtonProp.prototype.constructor = HtmlButtonProp;

    HtmlButtonProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li>\
                    <span class="span-bold">Style:</span>\
                    <div class="btn-group">\
                      <button id="btnTxtStyle" type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                        {class}<span class="caret"></span>\
                      </button>\
                      <ul class="dropdown-menu" id="btnTxtStyleList">\
                        <li data-class="default"><a href="#">Default</a></li>\
                        <li data-class="primary"><a href="#">Primary</a></li>\
                        <li data-class="success"><a href="#">Success</a></li>\
                        <li data-class="info"><a href="#">Info</a></li>\
                        <li data-class="warning"><a href="#">Warning</a></li>\
                        <li data-class="danger"><a href="#">Danger</a></li>\
                        <li data-class="link"><a href="#">Link</a></li>\
                        <li data-class="pink"><a href="#">Pink</a></li>\
                        <li data-class="blue"><a href="#">Blue</a></li>\
                        <li data-class="green"><a href="#">Green</a></li>\
                      </ul>\
                    </div>\
                </li>\
            </ul>\
            <ul class="list-inline" style="padding-top: 10px;">\
                <li class="txtShow">\
                    <label class="text-content">Content:</label>\
                    <span class="btnEditTxt glyphicon glyphicon-edit" style="padding-left: 10px;"></span>\
                </li>\
            </ul>\
            <ul class="list-inline" style="padding-top: 10px;">\
                <li class="txtShow">\
                    <label class="curLinkTo">跳转:</label>\
                    <select id="pageList">\
                      {selectHTML}\
                    </select>\
                </li>\
                <li class="txtShow">\
                    <label class="curFloat">浮动:</label>\
                    <input type="checkbox" id="iptFloat" style="vertical-align: middle;margin: 0 0 5px 10px;">\
                </li>\
                <li class="txtShow liS3db" style="display:none;">\
                    <label class="curS3db">s3db:</label>\
                    <input type="text" id="iptS3db" style="vertical-align: middle;margin: 0 0 5px 0;width:200px;">\
                </li>\
                <li class="txtShow liPageScreen" style="display:none;">\
                    <label class="curPageName">页面名称:</label>\
                    <input type="text" id="iptPageScreen" style="vertical-align: middle;margin: 0 0 5px 0;width:200px;" placeholder="填写页面名称+<#x#>">\
                </li>\
            </ul>\
        </li>\
        <li>\
            <ul class="list-inline" style="position: relative;">\
                <li class="divPorpertyBase">\
                    <div class="dataSource">\
                        <span class="span-bold">Datasource:</span>\
                        <span class="spanDs" ds-id="{dsId}" style="display:{isShowDsName}">\
                            <span class="dsText">{dsName}</span>\
                            <span class="btnRemoveDs glyphicon glyphicon-remove"></span>\
                        </span>\
                        <span class="dropArea" style="display:{isShowDropArea}">\
                            <span class="glyphicon glyphicon-plus"></span>\
                            <input value="" type="text" style="display:none;border:none;" id="iptCloudPoint">\
                        </span>\
                        <input type="text" class="dsPreview" value="{dsPreview}" style="width:50px;" placeholder="Value">\
                    </div>\
                </li>\
                <li id="liEnumerateWrap" style="padding-top: 10px;">\
                    <div class="divTool">\
                    <div class="enumerateCtn">\
                        <label for="ckbEnumerate">Enumerate:</label>\
                        <input id="ckbEnumerate" type="button" class="btn btn-default btn-xs" style="margin-left:10px;" value="Show"/>\
                    </div>\
                        <span id="btnAddEnumerate" class="glyphicon glyphicon-plus-sign btnEnumerate"></span>\
                    </div>\
                </li>\
                <div id="enumerateWrap">\
                    <ul class="list-unstyled">\
                        <li class="enumerateItem">\
                            <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey"></div>\
                            <div class="enumeratePart divEnumerateVal"><label class="enumerateLabel">Value:</label><input class="enumerateVal"></div>\
                            <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate">\
                        </li>\
                    </ul>\
                </div>\
            </ul>\
        </li>\
        <li>\
            <ul class="list-inline" style="position:realtive">\
                <li class="divPorpertyBase" id="liTempltConfigWrap">\
                    <div class="propertyTemplt">\
                        <label for="ckbpropertyTemplt">Customstyle:</label>\
                        <input id="ckbpropertyTemplt" type="checkbox" />\
                    </div>\
                    <div class="divTool">\
                        <span id="btnPropTempltApply" class="glyphicon glyphicon-check"></span>\
                        <span id="btnPropTempltExport" class="glyphicon glyphicon-export"></span>\
                        <span id="btnPropTempltImport" class="glyphicon glyphicon-import"></span>\
                    </div>\
                </li>\
                <div id="templtConfigWrap">\
                    <ul class="list-unstyled">\
                        <li class="tplStyle">\
                            <label class="sr-only" for="inputNormalTemplt"></label>\
                            <textarea class="form-control gray-scrollbar" id="inputTplStyle" rows="3"></textarea>\
                        </li>\
                    </ul>\
                </div>\
            </ul>\
        </li>';
    //<span class="p_span">{text}</span><input class="p_input" type="text" value="{text}"/>\
        HtmlButtonProp.prototype.tplStyle = '' +
        '.Normal{\n' +
        '    /* Please input text normal style */\n' +
        '}\n' +
        '.Normal:hover{\n' +
        '    /* Please enter a state of suspension style text */\n'+
        '}' +
        '';
    /** override */
    HtmlButtonProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model, isShowDsName = 'none',  isShowDropArea = 'inline-block';
        var defaultOpt = {
            x: typeof model.x() === 'number' ? model.x() : '-',// model.x() || '-',
            y: typeof model.y() === 'number' ? model.y() : '-',//model.y() || '-',
            w: typeof model.w() === 'number' ? model.w() : '-',//model.w() || '-',
            h: typeof model.h() === 'number' ? model.h() : '-'//model.h() || '-'
        };
        var option = {
            text: model.option().text,
            class: model.option().class ? model.option().class: '---',
            dsId: model.idDs(),
            selectHTML: (function(){
                var tempHTML = '<option id="noSkip" selected="selected" value="" i18n="mainPanel.attrPanel.attrRepeat.LINK_TO_CON">不跳转页面</option><option id="optPageScreen" value="-Custom" i18n="mainPanel.attrPanel.attrRepeat.LOOK_UP_PAGE_NAME">根据页面名称查找</option><option id="optS3db" value="-s3db" i18n="mainPanel.attrPanel.attrRepeat.JUMP_S3DB_PAGE">跳转s3db页面</option>',
                    tpl = '<option value="{id}-{type}">{text}</option>';
                var pages = _this.panel.screen.screen.getPageList();
                if(!pages.length) return;
                pages.forEach(function(page){
                    if(page.type !== 'DropDownList' && page._id != _this.panel.screen.page.id){
                        tempHTML += tpl.formatEL({
                            id: page._id, 
                            text: page.text, 
                            type: page.type
                        });
                    }
                });
                return tempHTML;
            }()),
            dsName: (function(ids){
                var idsName = [];
                if(!ids || !(ids instanceof Array) || ids.length == 0) return;
                isShowDsName = 'inline-block';
                isShowDropArea = 'none';

                if(ids[0].indexOf('@') === 0){
                    idsName = ids[0];
                    return idsName;
                }
                var arrItem = [];
                arrItem = AppConfig.datasource.getDSItemById(ids);
                ids.forEach(function(id){
                    for (var m = 0; m < arrItem.length; m++) {
                        if (id == arrItem[m].id) {
                            idsName = arrItem[m].note ? arrItem[m].note : arrItem[m].alias;
                            break;
                        }
                    }
                    //idsName = AppConfig.datasource.getDSItemById(id).alias
                });
                return idsName;
            }(model.idDs())),
            dsPreview:model.option().preview.length>0?model.option().preview[0]:'',
            isShowDsName: isShowDsName,
            isShowDropArea: isShowDropArea
        };
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));
        //国际化
        I18n.fillArea($('#propPanel'));
        $('.span-bold').html(I18n.resource.mainPanel.attrPanel.attrRepeat.STYLE);
        $('.text-content').html(I18n.resource.mainPanel.attrPanel.attrRepeat.CONTENT); 
        $('.curLinkTo').html(I18n.resource.mainPanel.attrPanel.attrRepeat.LINK_TO);
        $('.curFloat').html(I18n.resource.mainPanel.attrPanel.attrRepeat.FLOAT);
        $('#noSkip').html(I18n.resource.mainPanel.attrPanel.attrRepeat.LINK_TO_CON);
        $('.dataSource').find('.span-bold').html(I18n.resource.mainPanel.attrPanel.attrRepeat.DATA_SOURCE);
        $('.propertyTemplt').find('label').html(I18n.resource.mainPanel.attrPanel.attrRepeat.CUSTOMSTYLE);
        $('.txtShow').find('.btnEditTxt').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.EDIT_CONTENT_TITLE);
        $('#btnPropTempltApply').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.SAVE_STYLE_TITLE);
        $('#btnPropTempltExport').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.EXPORT_STYLE_TITLE);
        $('#btnPropTempltImport').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.IMPORT_STYLE_TITLE);
        $(".curPageName").text(I18n.resource.mainPanel.attrPanel.attrRepeat.PAGE_NAME);
        $("#iptPageScreen").attr("placeholder",I18n.resource.mainPanel.attrPanel.attrRepeat.FILL_IN_PAGE_NAME);
        var styleArr = [I18n.resource.mainPanel.attrPanel.attrButton.STYLE_ONE, I18n.resource.mainPanel.attrPanel.attrButton.STYLE_TWO, I18n.resource.mainPanel.attrPanel.attrButton.STYLE_THREE, I18n.resource.mainPanel.attrPanel.attrButton.STYLE_FOUR,
                        I18n.resource.mainPanel.attrPanel.attrButton.STYLE_FIVE, I18n.resource.mainPanel.attrPanel.attrButton.STYLE_SIX, I18n.resource.mainPanel.attrPanel.attrButton.STYLE_SEVEN, I18n.resource.mainPanel.attrPanel.attrButton.STYLE_EIGHT,
                        I18n.resource.mainPanel.attrPanel.attrButton.STYLE_NINE, I18n.resource.mainPanel.attrPanel.attrButton.STYLE_TEN];
        for (var m = 0; m < styleArr.length; m++) {
            $('#btnTxtStyleList').find('a').eq(m).html(styleArr[m]);
        }
        //跳转页面浮动
        var $iptFloat = $('#iptFloat');
        if(model.option().float){
            $iptFloat.parent('li').show();
            if(model.option().float === 1){
                $iptFloat.prop('checked',true);
            }else{
                $iptFloat.prop('checked',false);
            }
        }
        //设置页面默认选中项
        if(model.option().pageId){
            var pages = [];
            _this.panel.screen.screen.getPageList().forEach(function(row){
                if(row.type != 'DropDownList'){
                    pages.push(row);
                }
            });
            if(!pages.length) return;
            var ObjectId;
            pages.some(function(row){
                if(row._id === model.option().pageId){
                    ObjectId = true;
                    return true;
                }
            });
            if(ObjectId){
                $('#pageList').val([model.option().pageId, model.option().pageType].join('-'));
            }else{
                if(model.option().pageType === 's3db'){
                    $('#optS3db').prop('selected',true);
                    $('.liS3db').show().find('#iptS3db').val(model.option().pageId);
                }else{
                    var replace;
                    //导入替换跳转页面占位符
                    pages.some(function(row){
                        if(row.text.split(' - ')[0] === model.option().pageId){
                            _this.store.model.update({
                                'option.pageId': row._id,
                                'option.pageType': row.type
                            });
                            replace = true;
                            return replace;
                        }
                    });
                    if(!replace){
                        $('#optPageScreen').prop('selected',true);
                        $('.liPageScreen').show().find('#iptPageScreen').val(model.option().pageId);
                    }
                }
            }
        }else{
            if(model.option().pageType){
                if(model.option().pageType === 's3db'){
                    $('#optS3db').prop('selected',true);
                    $('.liPageScreen').hide();
                    $('.liS3db').show();
                }else{
                    $('#optPageScreen').prop('selected',true);
                    $('.liPageScreen').show();
                    $('.liS3db').hide();
                }
            }else{
                $iptFloat.parent('li').hide();
            }
        }

        //按钮预置样式的文本
        var btnTxt = option.class == '---' ? '---' : $('[data-class="' + option.class + '"] a').text();
        $('#btnTxtStyle').html(btnTxt + '<span class="caret"></span>');

        //枚举初始化
        var $enumerateWrap = $('#enumerateWrap');
        var trigger = model.models[0].option().trigger;
        var triggerEptCount = 0;
        if(!$.isEmptyObject(trigger)){
            $('.enumerateItem').remove();
            for (var row in trigger){
                addEnumerate(row, trigger[row]);
            }
            this.$propertyList.find('#ckbEnumerate')[0].value = 'Hide';
            $('#liEnumerateWrap .divTool .btnEnumerate').show();
            $("#enumerateWrap").show();
            var models = model.models;
            //判断选中的按钮的trigger是否有为空的，如果有则枚举不显示
            for (var i = 0; i < models.length; i++) {
                if ($.isEmptyObject(models[i].option().trigger)) {
                    triggerEptCount += 1;
                }
            }
            /*if (triggerEptCount === 0 && model.idDs().length!==0) {
                this.$propertyList.find('#ckbEnumerate')[0].checked = true;
                $enumerateWrap.show();
            } else {
                $enumerateWrap.find('ul').children().remove();
                addEnumerate('', '');
            }*/
        }
        function addEnumerate(key, value){
            var html =  '<li class="enumerateItem">\
                <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey" value={key}></div>\
                <div class="enumeratePart"><label class="enumerateLabel">Value:</label><input class="enumerateVal" value="{value}"></div>\
                <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
                ';
            var $li = $(html.formatEL({
                key: key,
                value: value
            }));
            $enumerateWrap.find('ul').append($li);
        };
        if(model.option().style) {
            this.$propertyList.find('#inputTplStyle').val(model.option().style).prop('disabled', false);
            this.$propertyList.find('#ckbpropertyTemplt')[0].checked = true;
            $('#templtConfigWrap').show();
        }else if(model.models.length>1){
            if (!model.option().style) {
                this.$propertyList.find('#inputTplStyle').val(this.tplStyle).prop('disabled', false);
                this.$propertyList.find('#ckbpropertyTemplt')[0].checked = true;
                $('#templtConfigWrap').show();
            }
        }else {
            this.$propertyList.find('#inputTplStyle').val(this.tplStyle).prop('disabled',true);
            $('#liTempltConfigWrap .divTool').hide();
        }
        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };

    /** override */
    HtmlButtonProp.prototype.close = function () {

    };

    /** override */
    HtmlButtonProp.prototype.update = function () {

    };

    HtmlButtonProp.prototype.updateDs = function (id) {
        var text = this.store.model['option.text']();

        if (text && text.indexOf('<%value%>') > -1) {
            this.store.model.update({
                'idDs': [id]
            });
        } else {
            this.store.model.update({
                'idDs': [id],
                'option.text': '<%value%>'
            });
        }
    };
    HtmlButtonProp.prototype.cloudPoint = function (e) {
        var $this = $(e.currentTarget);
        var promise = $.Deferred();

        if($this.val() === ''){
            $this.hide();
            $this.prev().show();
        }else{
            if($this.val().indexOf('@') === 0){
                var currentPoint = $this.val().split('@')[1];
                if($this.val().indexOf('|') < 0){
                    alert('云点格式错误！');
                    return;
                }
                var currentId = currentPoint.split('|')[0];
                var currentVal = currentPoint.split('|')[1];
                if(currentVal === ''){
                    alert('云点格式错误！');
                    return;
                }else{
                    currentVal = '^'+currentPoint.split('|')[1]+'$';
                }
                Spinner.spin($('body')[0]);
                WebAPI.get('/point_tool/searchCloudPoint/'+ currentId +'/'+ currentVal).done(function(result){
                    var data = result.data;

                    if(data.total === 1){
                        _this.updateDs( $this.val() );
                    } else {
                        alert(I18n.resource.mainPanel.exportModal.NO_POINT);
                    }
                }).always(function () {
                    Spinner.stop();
                });
            }else{
                var project = AppConfig.project;
                var currentVal = '^'+$this.val()+'$';
                if(project.bindId){
                    var currentId = project.bindId;
                    Spinner.spin($('body')[0]);
                    WebAPI.get('/point_tool/searchCloudPoint/'+ currentId +'/'+ currentVal).done(function(result){
                        var data = result.data;
                        if(data.total === 1){
                            _this.updateDs( '@'+currentId+'|'+$this.val() );
                        }else{
                            alert(I18n.resource.mainPanel.exportModal.NO_POINT);
                        }
                    }).always(function () {
                        Spinner.stop();
                    });
                } else {
                    alert('该项目未绑定，写入的云点无效！');
                    return;
                }
            }
        }
    };

    HtmlButtonProp.prototype.attachEvent = function () {
        var _this = this;
        var tempStyle = '';
        var templateId = null;

        //修改页面文本显示内容
        $('#pageList', this.$propertyList).off('change').change(function() {
            var opt = _this.store.model.option();
            var $iptFloat = $('#iptFloat');
            var arr;

            if (!this.value) {
                $iptFloat.parent('li').hide();
                $('.liPageScreen').hide();
                $('.liS3db').hide();
                opt.pageId = opt.pageType = '';
            } else {
                if($('#optS3db').prop('selected')){
                    $('.liS3db').show();
                }else if($('#optPageScreen').prop('selected')){
                    $('.liPageScreen').show();
                }else{
                    $('.liS3db').hide();
                    $('.liPageScreen').hide();
                }
                $iptFloat.prop('checked',false);
                $iptFloat.parent('li').show();
                arr = this.value.split('-');
                opt.pageId = arr[0];
                opt.pageType = arr[1];
            }
            _this.store.model.update({
                'option.pageId': opt.pageId,
                'option.pageType': opt.pageType
            });
        });
        $('.liS3db', this.$propertyList).off('change').on('change',function(){
            var opt = _this.store.model.option();
            opt.pageId = $(this).find('#iptS3db').val();
            _this.store.model.update({
                'option.pageId': opt.pageId
            });
        });
        $('.liPageScreen', this.$propertyList).off('change').on('change',function(){
            var opt = _this.store.model.option();
            var val = $(this).find('#iptPageScreen').val();
            if(val.indexOf('<#')>-1 && val.indexOf('#>')>-1){
                opt.pageId = val;
            }else{
                var pages = [];
                _this.panel.screen.screen.getPageList().forEach(function(row){
                    if(row.type != 'DropDownList'){
                        pages.push(row);
                    }
                });
                var belongToPages;
                pages.some(function(row){
                    if(row.text.split(' - ')[0] === val){
                        opt.pageId = row._id;
                        opt.pageType = row.type;
                        return true;
                    }
                });
                if(!belongToPages){
                    opt.pageId = val;
                }
            }
            _this.store.model.update({
                'option.pageId': opt.pageId,
                'option.pageType': opt.pageType
            });
        });
        //选择按钮样式
        $('#btnTxtStyleList li', this.$propertyList).off('click').click(function(){
            var opt = _this.store.model.option();
            opt.class = this.dataset.class;
            _this.store.model.option(opt,'class');
        });
        //预览按钮样式
        $('#btnTxtStyleList li', this.$propertyList).hover(function(){
            tempStyle = this.dataset.class;
            for(var i = 0, model; i < _this.store.model.models.length; i++){
                model = _this.store.model.models[i];
                $('#' + model._id()).removeClass(model.option().class).addClass(tempStyle);
            }
        }, function(){
            for(var i = 0, model; i < _this.store.model.models.length; i++){
                model = _this.store.model.models[i];
                $('#' + model._id()).removeClass(tempStyle).addClass(model.option().class);
            }
        });

        //修改按钮显示内容
        $('.btnEditTxt', this.prototype).off('click').click(function(){
            EditorModal.show(_this.store.model.option().text, true, function (newContent) {
                var opt = _this.store.model.option();
                opt.text = newContent;
                _this.store.model.option(opt,'text');
            });
        });
        //修改按钮浮动
        $('#iptFloat').on('change',function(){
            var opt = _this.store.model.option();
            if(!$(this).is(':checked')){
                opt.float = 0;
            }else{
                opt.float = 1;
            }
            _this.store.model.update({
                'option.float': opt.float
            });
        });
        //修改数据源
        var $dataSource = $('.dataSource');
        var $dropArea = $('.dropArea');
        var $dsText = $('.dsText');
        var $dsPreview = $('.dsPreview');
        $dropArea.on('click',function(){
            var $this = $(this);
            $this.find('.glyphicon-plus').hide();
            $this.find('input').show();
            $this.find('input').focus();
        }).on('blur','input',function(e){
            _this.cloudPoint(e);
        });
        //拖拽数据源后的修改
        $dsText.off('click').on('click',function(e){
            var $iptVal = $(this).text();
            $(this).hide().after('<input class="dsIpt" type="text" style="min-width:200px;border:none;">');
            $('.dsIpt').val($iptVal).focus().on('blur',function(e){
                if($iptVal != e.target.value){
                    _this.cloudPoint(e);
                }
                if($(this).prev('.dsText').css('display') === 'none'){
                    $(this).hide();
                    $(this).prev('.dsText').text(e.target.value).show();
                }
            });
        });
        //调试值的修改
        $dsPreview.off('change').on('change',function(){
            var $this = $(this);
            if(isNaN($this.val())){
                alert('调试值类型要为数字！');
                return;
            }
            var previewVal = [$this.val()];
            _this.store.model['option.preview'](previewVal);
        });
        $dataSource[0].ondrop = function (e) {
            var dragId = EventAdapter.getData().dsItemId;
            if (AppConfig.datasource.currentObj === 'cloud' || AppConfig.datasource.currentObj === 'tag') {
                var pointInfo = getPointInfoByIdAndType(AppConfig.datasource.currentObj,dragId);
                var dragName = pointInfo.name;
                var currentId = pointInfo.projectId;
                if (currentId) {
                    dragName = '@' + currentId + '|' + dragName;
                } else {
                    dragName = dragId;
                }
                _this.updateDs(dragName);
            } else {
                _this.updateDs(dragId);
            }
            e.preventDefault();
        };
        $dataSource[0].ondragenter = function(e){
            e.preventDefault();
        };
        $dataSource[0].ondragover = function(e){
            e.preventDefault();
        };
        $dataSource[0].ondragleave = function(e){
            e.preventDefault();
        };
        $dataSource.off('click').on('click','.btnRemoveDs',function(e){
            //数据源删除后,枚举也同时删除
            //var opt = _this.store.model.option();
            //_this.store.model.idDs([]);
            //opt.trigger = {};
            //_this.store.model.option(opt,'trigger');
            //var triggerAll = _this.store.model.models[0].option().trigger;
            //var triggerDefault = {};
            //triggerDefault = triggerAll.default ? { 'default': triggerAll.default } : {};
            _this.store.model.update({
                'idDs': [],
                //'option.trigger': triggerDefault,
                'option.text': 'Button',
                'option.preview':[]
            })
        });
        $('.dropArea', this.$propertyList)[0].ondragover = function(e){
            e.preventDefault();
            $(e.currentTarget).addClass('dragover');
            console.log('drag over');
        };
        $('.dropArea', this.$propertyList)[0].ondragleave = function(e){
            e.preventDefault();
            $(e.currentTarget).removeClass('dragover');
            console.log('drag over');
        };

        //是否启用枚举
        var $btnEnumerate = $('#liEnumerateWrap .divTool #btnAddEnumerate');
        var $btnSaveEnumerate = $('#liEnumerateWrap .divTool #btnSaveEnumerate');
        $('#ckbEnumerate')[0].onclick = function(){
            if($(this).val() === 'Show'){
                if($("#enumerateWrap").find("li").length == 0){
                    var $li = $('' +
                        '<li class="enumerateItem">\
                        <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey"></div>\
                        <div class="enumeratePart"><label class="enumerateLabel">Value:</label><input class="enumerateVal"></div>\
                        <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
                        ');
                    $("#enumerateWrap").find("ul").append($li);
                }
                $('#enumerateWrap').stop().slideDown();
                $(this).val('Hide');
                $btnEnumerate.show();
                $btnSaveEnumerate.show();
            }else{
                $('#enumerateWrap').stop().slideUp();
                $(this).val('Show');
                $btnEnumerate.hide();
                $btnSaveEnumerate.hide();
            }
        };
        if ($('#ckbEnumerate').val() === 'Show') {
            $btnEnumerate.hide();
            $btnSaveEnumerate.hide();
        }
        var $enumerateWrap = $('#enumerateWrap');
        var $ulEnumerate= $enumerateWrap.find('ul');
        //枚举的key和val的保存
        $ulEnumerate.off('change','input').on('change','input',function(){
            var tempOpt = _this.store.model.option();
            var enumerateKey,enumerateVal;
            if($(this).hasClass('enumerateKey')){
                enumerateKey = this.value;
                enumerateVal = $(this).closest('.enumeratePart').next().find('.enumerateVal').val();
            }else{
                enumerateKey = $(this).closest('.enumeratePart').prev().find('.enumerateKey').val();
                enumerateVal = this.value;
            }
            if(isNaN(enumerateKey)) return;
            var index = $ulEnumerate.find('.enumerateItem').index($(this).closest('.enumerateItem'));
            var k = Object.keys(tempOpt.trigger)[index];
            if(tempOpt.trigger[k]){
                delete tempOpt.trigger[k];
            }
            tempOpt.trigger[enumerateKey] = enumerateVal;
            _this.store.model.option(tempOpt, 'trigger');
        });
        //添加枚举
        $('#btnAddEnumerate')[0].onclick = function(){
            var $li = $('' +
                '<li class="enumerateItem">\
                <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey"></div>\
                <div class="enumeratePart"><label class="enumerateLabel">Value:</label><input class="enumerateVal"></div>\
                <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
                ');
            $ulEnumerate.append($li);
        };

        //删除枚举
        $enumerateWrap.off('click').on('click', '.btnRemove',function(){
            var enumerateKey= $(this).siblings().find('input.enumerateKey').val();
            if(enumerateKey){
                delete _this.store.model['option.trigger']()[enumerateKey];
                _this.store.model.update({
                    'option.trigger': _this.store.model['option.trigger']()
                })
            }
            $(this).parent().remove();
            var $enumerateKeyS = $(".enumerateKey");
            if($enumerateKeyS.length == 0){
                $("#enumerateWrap").hide();
                $("#liEnumerateWrap").find("span").hide();
                _this.$propertyList.find('#ckbEnumerate').val('Show');
            }
        });

        //启用样式模板编辑
        var tpltConfigWrap = $('#templtConfigWrap');
        var divCustom = $('#liTempltConfigWrap .divTool');
        $('#ckbpropertyTemplt')[0].onclick = function(){
            if($(this).is(':checked')){
                $('#inputTplStyle').prop('disabled',false);
                tpltConfigWrap.stop().slideDown();
                 divCustom.show();
            }else{
                $('#inputTplStyle').prop('disabled',true);
                tpltConfigWrap.stop().slideUp();
                divCustom.hide();
            }
        };
        //应用模板
        $('#btnPropTempltApply')[0].onclick = function(){
            var tempOpt = _this.store.model.option();
            if($('#ckbpropertyTemplt').is(':checked')) {
                tempOpt.style = $('#inputTplStyle').val();
                // 如果有模板 id，则说明是不保留副本的模板应用
                if (templateId) {
                    _this.store.model.templateId(templateId);
                    // 这里需要将 templateId 置为空，以免和保留副本的模版应用混合到一起
                    templateId = null;
                } else {
                    _this.store.model.templateId('');
                }
            } else {
                tempOpt.style = null;
            }
            _this.store.model.option(tempOpt,'style');
        };
        //取消样式
        $('#ckbpropertyTemplt').off('click').click(function () {
            if (!$(this).is(':checked')) {
                _this.store.model.templateId('');
                var tempOpt = _this.store.model.option();
                tempOpt.style = '';
                $('#inputTplStyle').val(_this.tplStyle);
                _this.store.model.option(tempOpt,'style');
            }
        });
        //导入模板
        $('#btnPropTempltImport')[0].onclick = function () {
            MaterialModal.show([{'title':'Template',data:['Widget.HtmlButton']}], function (data, isCopy) {
                // 根据判断，确定是否是保留副本的引用
                if (isCopy === false) {
                    templateId = data._id;
                }
                $('#inputTplStyle').val(data.content.style).prop('disabled',false);
                _this.$propertyList.find('#ckbpropertyTemplt')[0].checked = true;
                tpltConfigWrap.slideDown();
                $('#btnPropTempltApply').trigger('click');
            });
        };
         
        //导出模板
        $('#btnPropTempltExport')[0].onclick = function(){
            var templateName = prompt(I18n.resource.mainPanel.exportModal.EXPORT_INFO);
            if(!templateName) return;
            var tplStyle = $('#inputTplStyle').val();
            var data = {
                _id: ObjectId(),
                name: templateName,
                creator: AppConfig.userProfile.id,
                time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                "public": 1,
                isFolder:0,
                group: '',
                type: 'widget.HtmlButton',
                content: {
                    style:tplStyle
                }
            };
            WebAPI.post('/factory/material/save', data).done(function(result){
                if(result && result._id){
                    data._id = result._id;
                }
            }).always(function(){

            });
        };
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.HtmlButtonProp = HtmlButtonProp;

} (window.widgets.factory.WidgetProp));

/** Html Button Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function HtmlButtonPropModel() {
        PropModel.apply(this, arguments);
    }

    HtmlButtonPropModel.prototype = Object.create(PropModel.prototype);
    HtmlButtonPropModel.prototype.constructor = HtmlButtonPropModel;


    HtmlButtonPropModel.prototype.option = function (params,attr) {
        if (class2type.call(params) === '[object Object]') {
            if (arguments.length == 1) {
            this._setProperty('option', params);
            } else if (arguments.length == 2) {//只设置option的指定属性:attr
                this._setProperty('option.' + arguments[1], params[arguments[1]]);
            }
            return true;
        }
        var opt = $.extend(true, {}, this.models[0].option());
        for(var i = 1, len = this.models.length, modelOpt; i < len; i ++){
            modelOpt = this.models[i].option();
            for(var i in modelOpt){
                if(Array.isArray(modelOpt[i])){
                    var item = modelOpt[i].slice().toString();
                    if (opt[i].slice().toString() != item) {
                        opt[i] = [];
                    }
                }else{
                    if (opt[i] != modelOpt[i]) {
                        if (i === 'trigger') {
                            opt[i] = {};
                        } else {
                            opt[i] = '';
                        }
                    }
                }
            }
        }
        return opt;
    };

    ['idDs','option.text','templateId','option.trigger','option.float','option.preview'].forEach(function(type){
        HtmlButtonPropModel.prototype[type] = function (params) {
            var v;
            if(params) {
                this._setProperty(type, params);
                return true;
            }
            if((v = this._isPropertyValueSame(type) ) !== false ) {
                return v;
            }
        };
    })

    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.HtmlButtonPropModel = HtmlButtonPropModel;

} (window.widgets.propModels.PropModel));