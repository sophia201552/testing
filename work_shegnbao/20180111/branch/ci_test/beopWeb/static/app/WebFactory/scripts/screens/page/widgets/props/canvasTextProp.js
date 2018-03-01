(function (WidgetProp) {
    var _this = undefined;
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });
    function CanvasTextProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
        _this = this;
    }

    CanvasTextProp.prototype = Object.create(WidgetProp.prototype);
    CanvasTextProp.prototype.constructor = CanvasTextProp;

    CanvasTextProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li class="txtShow">\
                    <label class="text-content" i18n="mainPanel.canvasText.CONTENT"></label>\
                    <span class="p_span" style="display:none;">{text}</span>\
                    <span class="btnEditTxt glyphicon glyphicon-edit" style="padding-left: 10px;"></span>\
                </li>\
            </ul>\
            <ul class="list-inline" style="padding-top: 10px;">\
                <li class="txtShow" id="liColor">\
                    <label class="" i18n="mainPanel.canvasText.FONTCOLOR"></label>\
                    <input class="" type="color" value="{fontColor}">\
                </li>\
                <li class="txtShow" id="liBgColor" style="display:none;">\
                    <label class="" >背景颜色:</label>\
                    <input class="" type="color" value="{bgColor}">\
                </li>\
            </ul>\
            <ul class="list-inline" style="padding-top: 10px;">\
                <li class="txtShow">\
                    <label class="curLinkTo" i18n="mainPanel.canvasText.ROUNT"></label>\
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
            <ul class="list-inline">\
                <li class="txtShow" id="liFamily" style="display:none;">\
                    <label class="property-name" style="width: auto;" >字体:</label>\
                    <span class="property-value p_span">{fontFamily}</span>\
                    <input class="property-value p_input" type="text" value="{fontFamily}" style="width:80px;">\
                </li>\
                 <li class="txtShow" id="liSize">\
                    <label class="" i18n="mainPanel.canvasText.FONTSIZE"></label>\
                    <select>\
                        <option value="10">10px</option><option value="11">11px</option><option value="12">12px</option><option value="14">14px</option><option value="16">16px</option>\
                        <option value="18">18px</option><option value="20">20px</option><option value="24">24px</option><option value="36">36px</option>\
                    </select>\
                </li>\
                <li class="txtShow" id="liStyle">\
                    <label class="" i18n="mainPanel.canvasText.FONTTYPE"></label>\
                    <div class="btn-group btn-group-xs">\
                        <button type="button" class="btn btn-default" data-type = "bold"><span class="glyphicon glyphicon-bold"></span></button>\
                        <button type="button" class="btn btn-default" data-type = "italic"><span class="glyphicon glyphicon-italic"></span></button>\
                    </div>\
                </li>\
            </ul>\
            <ul class="list-inline" style="padding-top: 10px;">\
                <li class="txtShow" id="liTextAlign">\
                    <label class="" i18n="mainPanel.canvasText.HORIZONTAL_ALIGN"></label>\
                    <div class="btn-group btn-group-xs">\
                        <button type="button" class="btn btn-default" data-type = "left"><span class="glyphicon glyphicon-align-left"></span></button>\
                        <button type="button" class="btn btn-default" data-type = "center"><span class="glyphicon glyphicon-align-center"></span></button>\
                        <button type="button" class="btn btn-default" data-type = "right"><span class="glyphicon glyphicon-align-right"></span></button>\
                    </div>\
                </li>\
                <li class="txtShow" id="liVerticalAlign" style="">\
                    <label class="" i18n="mainPanel.canvasText.VERTICAL_ALIGN"></label>\
                    <div class="btn-group btn-group-xs">\
                        <button type="button" class="btn btn-default" data-type = "top"><span class="iconfont icon-shangduiqi"></span></button>\
                        <button type="button" class="btn btn-default" data-type = "middle"><span class="iconfont icon-duiqi"></span></button>\
                        <button type="button" class="btn btn-default" data-type = "bottom"><span class="iconfont icon-xiaduiqi"></span></button>\
                    </div>\
                </li>\
            </ul>\
            <ul class="list-inline" style="padding-top: 10px;">\
                <li class="txtShow" id="liLineHeight">\
                    <label class="" i18n="mainPanel.canvasText.LINEHEIGHT"></label>\
                    <select>\
                        <option value="1">1</option><option value="1.5">1.5</option><option value="1.75">1.75</option><option value="2">2</option>\
                        <option value="3">3</option><option value="4">4</option><option value="5">5</option>\
                    </select>\
                </li>\
            </ul>\
        </li>\
        <li>\
            <ul class="list-inline" style="position: relative;">\
                <li class="divPorpertyBase">\
                    <div class="dataSource">\
                        <span class="span-bold" i18n="mainPanel.canvasText.DATASOURCE"></span>\
                        <span class="spanDs" ds-id="{dsId}" style="display:{isShowDsName}">\
                            <span class="dsText">{dsName}</span>\
                            <span class="btnRemoveDs glyphicon glyphicon-remove"></span>\
                        </span>\
                        <span class="dropArea" style="display:{isShowDropArea}">\
                            <span class="glyphicon glyphicon-plus"></span>\
                            <input value="" type="text" style="display:none;border:none;" id="iptCloudPoint">\
                        </span>\
                        <input type="text" class="dsPreview" value="{dsPreview}" style="width:50px;" i18n="placeholder=mainPanel.canvasText.DEBUG_VALUE">\
                    </div>\
                </li>\
                <li id="liFloat" style="padding-top: 10px;">\
                    <label class="property-name exactNumber" style="width: auto;" i18n="mainPanel.canvasText.ACCURACY"></label>\
                    <span class="property-value p_span"></span>\
                    <input class="property-value p_input" type="text" value="">\
                </li>\
                <li id="liEnumerateWrap" style="padding-top: 10px;display:block;">\
                    <div class="divTool">\
                        <div class="enumerateCtn">\
                            <label for="ckbEnumerate" i18n="mainPanel.canvasText.ENUMERTATE"></label>\
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
        </li>';
    CanvasTextProp.prototype.editModal = '\
        <div class="modal fade" id="editModal">\
            <div class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
                        <h4 class="modal-title">Editor</h4>\
                    </div>\
                    <div class="modal-body">\
                        <textarea class="form-control" rows="3"></textarea>\
                    </div>\
                    <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                        <button type="button" class="btn btn-primary" id="submitEdit">Save changes</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
    ';
    /** override */
    CanvasTextProp.prototype.show = function () {
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
            fontFamily:model.option().fontFamily.length>0?model.option().fontFamily:'-',
            //fontSize:typeof model.option().fontSize === 'number'?model.option().fontSize:'-',
            fontColor:model.option().fontColor.length>0?model.option().fontColor:'#000000',
            bgColor:model.option().bgColor.length>0?model.option().bgColor:'#ffffff',
            isShowDsName: isShowDsName,
            isShowDropArea: isShowDropArea
        };
        
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));
        I18n.fillArea($('#propPanel'));
        
        //国际化
        $(".curPageName").text(I18n.resource.mainPanel.attrPanel.attrRepeat.PAGE_NAME);
        $("#iptPageScreen").attr("placeholder",I18n.resource.mainPanel.attrPanel.attrRepeat.FILL_IN_PAGE_NAME);

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

        //字体，字号，类型
        var $liFamily = $('#liFamily');
        var fontFamily = typeof model['option.fontFamily']() === 'string'? model['option.fontFamily']() : '-';
        $liFamily.children('span').text(fontFamily);
        $liFamily.children('input').val(fontFamily);

        var $liSize = $('#liSize');
        if(typeof model['option.fontSize']() === 'number'){
            $liSize.children('select').val(model['option.fontSize']());
        }else{
            $liSize.children('select').val('-');
        }

        var $liStyle = $('#liStyle');
        if(typeof model['option.fontStyle']() === 'string'){
            var fontStyle = model['option.fontStyle']().split(' ');
            fontStyle.forEach(function(row){
                $liStyle.find('[data-type = '+row+']').addClass('btnCheck');
            })
        }else{
            $liStyle.find('button').removeClass('btnCheck');
        }
        //var fontStyle = typeof model['option.fontStyle']() === 'string'? model['option.fontStyle']() : 'normal';
        //$liStyle.find('[data-type = '+fontStyle+']').addClass('btnCheck').siblings('.btn').removeClass('btnCheck');

        //对齐
        var $liTextAlign = $('#liTextAlign');
        var textAlign = typeof model['option.textAlign']() === 'string'? model['option.textAlign']() : 'left';
        $liTextAlign.find('[data-type = '+textAlign+']').addClass('btnCheck').siblings('.btn').removeClass('btnCheck');

        var $liVerticalAlign = $('#liVerticalAlign');
        var verticalAlign = typeof model['option.verticalAlign']() === 'string'? model['option.verticalAlign']() : 'top';
        $liVerticalAlign.find('[data-type = '+verticalAlign+']').addClass('btnCheck').siblings('.btn').removeClass('btnCheck');

        //行间距
        var $liLineHeight = $('#liLineHeight');
        if(typeof model['option.lineHeight']() === 'number'){
            $liLineHeight.children('select').val(model['option.lineHeight']());
        }else{
            $liLineHeight.children('select').val('-');
        }
        //数字精确位数
        var $liFloat = $('#liFloat');
        var float = typeof model['option.precision']() === 'number'? model['option.precision']() : '-';
        $liFloat.children('span').text(float);
        $liFloat.children('input').val(float);

        //枚举初始化
        var $enumerateWrap = $('#enumerateWrap');
        var trigger = model.models[0].option().trigger;
        var triggerEptCount = 0;
        if(!$.isEmptyObject(trigger)) {
            $('.enumerateItem').remove();
            for (var row in trigger) {
                addEnumerate(row, trigger[row]);
            }
            this.$propertyList.find('#ckbEnumerate')[0].value = 'Hide';
            $('#liEnumerateWrap .divTool .btnEnumerate').show();
            $("#enumerateWrap").show();
            var models =model.models;
            for (var i = 0; i < models.length; i++) {
                if($.isEmptyObject(models[i].option().trigger)) {
                    triggerEptCount += 1;
                }
            }
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
        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };

    /** override */
    CanvasTextProp.prototype.close = function () {

    };

    /** override */
    CanvasTextProp.prototype.update = function () {
    };

    CanvasTextProp.prototype.updateDs = function (id) {
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

    CanvasTextProp.prototype.cloudPoint = function (e) {
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

    CanvasTextProp.prototype.attachEvent = function () {
        var _this = this;
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
                        belongToPages = true;
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
        //修改文字内容
        $('.btnEditTxt', this.$propertyList).off('click').click(function(){
            var $editModal = $(_this.editModal);
            $(document.body).append($editModal);
            $editModal.on('shown.bs.modal', function (e) {
                var opt = _this.store.model.option();
                $editModal.find('textarea').val(opt.text);
            });
            $editModal.on('hidden.bs.modal', function (e) {
                $(document.body).find('#editModal').remove();
            });
            $editModal.off('click','#submitEdit').on('click','#submitEdit',function(){
                $editModal.modal('hide');
                var text = $editModal.find('textarea').val();
                _this.store.model['option.text'](text);
            });
            $editModal.modal('show');
        });
         //修改文本浮动
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
        //字体，字号,类型
        var $liFamily = $('#liFamily');
        var $liSize = $('#liSize');
        var $liStyle = $('#liStyle');
        $liFamily.off('change','input').on('change','input',function(){
            var fontFamilyVal = $(this).val();
            _this.store.model['option.fontFamily'](fontFamilyVal);
        });
        $liSize.off('change','select').on('change','select',function(){
            var $this = $(this);
            var fontSizeVal = parseInt($this.val());
            _this.store.model['option.fontSize'](fontSizeVal);
        });
        $liStyle.off('click','.btn').on('click','.btn',function(){
            if($(this).hasClass('btnCheck')){
                $(this).removeClass('btnCheck');
            }else{
                $(this).addClass('btnCheck');
            }
            var arr = [];
            var fontStyle;
            $liStyle.find('.btnCheck').each(function(){
                arr.push($(this).attr('data-type'));
            });
            if(arr.length === 0){
                fontStyle = "normal";
            }else{
                fontStyle = arr.join(' ');
            }
            _this.store.model['option.fontStyle'](fontStyle);
        });

        //对齐
        var $liTextAlign = $('#liTextAlign');
        $liTextAlign.off('click','.btn').on('click','.btn',function(){
            if($(this).hasClass('btnCheck')){return;}
            $(this).addClass('btnCheck').siblings('.btn').removeClass('btnCheck');
            var textAlign = $(this).attr('data-type');
            _this.store.model['option.textAlign'](textAlign);
        });
        var $liVerticalAlign = $('#liVerticalAlign');
        $liVerticalAlign.off('click','.btn').on('click','.btn',function(){
            if($(this).hasClass('btnCheck')){return;}
            $(this).addClass('btnCheck').siblings('.btn').removeClass('btnCheck');
            var verticalAlign = $(this).attr('data-type');
            _this.store.model['option.verticalAlign'](verticalAlign);
        });

        //颜色
        var $liColor = $('#liColor');
        var $liBgColor = $('#liBgColor');
        $liColor.off('change','input').on('change','input',function(){
            var fontColor = $(this).val();
            _this.store.model['option.fontColor'](fontColor);
        });
        $liBgColor.off('change','input').on('change','input',function(){
            var bgColor = $(this).val();
            _this.store.model['option.bgColor'](bgColor);
        });

        //行间距
        var $liLineHeight = $('#liLineHeight');
        $liLineHeight.off('change','select').on('change','select',function(){
            var $this = $(this);
            var lineHeight = parseFloat($this.val());
            _this.store.model['option.lineHeight'](lineHeight);
        });

        //数字精确位数
        var $liFloat = $('#liFloat');
        var currentVal = $liFloat.children('input').val();
        $liFloat.children('input').on('focus',function(){
            $liFloat.children('input').val(currentVal);
        });
        $liFloat.children('input').on('blur',function(){
            var blurVal = $liFloat.children('input').val();
            if(isNaN(blurVal)){
                alert('精确位数类型要为数字！');
                return;
            }
            $liFloat.children('span').text(blurVal);
            _this.store.model['option.precision'](parseInt(blurVal));
        });

        //数据源接收
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
            _this.store.model.update({
                'idDs': [],
                'option.preview':[]
            })
        });
        $('.dropArea', this.$propertyList)[0].ondragover = function(e){
            e.preventDefault();
            $(e.currentTarget).addClass('dragover');
            //console.log('drag over');
        };
        $('.dropArea', this.$propertyList)[0].ondragleave = function(e){
            e.preventDefault();
            $(e.currentTarget).removeClass('dragover');
            //console.log('drag over');
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

    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.CanvasTextProp = CanvasTextProp;

} (window.widgets.factory.WidgetProp));

/** Html Text Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function CanvasTextPropModel() {
        PropModel.apply(this, arguments);
    }

    CanvasTextPropModel.prototype = Object.create(PropModel.prototype);
    CanvasTextPropModel.prototype.constructor = CanvasTextPropModel;

    CanvasTextPropModel.prototype.option = function (params,attr) {
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
    ['idDs','option.text','option.precision','option.trigger','option.float','option.preview','option.fontFamily','option.fontSize','option.fontStyle','option.textAlign','option.verticalAlign','option.fontColor','option.bgColor','option.lineHeight'].forEach(function(type){
        CanvasTextPropModel.prototype[type] = function (params) {
            var v;
            if(params !== undefined) {
                this._setProperty(type, params);
                return true;
            }
            if((v = this._isPropertyValueSame(type) ) !== false ) {
                return v;
            }
        };
    });

    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.CanvasTextPropModel = CanvasTextPropModel;

} (window.widgets.propModels.PropModel));