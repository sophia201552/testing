(function (WidgetProp) {
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });
    var modal = `
        <div id="diagnosisConfigModal" class ="modal fade in" style="display: none;">
            <style>
                #diagnosisConfigModal .modal-wrap{
                    width:60%;
                    height:80%;
                    top: 10%;
                    left: 20%;
                    background-color: #eee;
                    z-index: 1;
                    position: absolute;
                    border-radius: 10px;
                    color: #646464;
                }
                #diagnosisConfigModal .modal-header{
                    width: 100%;
                    height: 17%;
                }
                #diagnosisConfigModal .modal-body{
                    width: 100%;
                    height: 73%;
                }
                #diagnosisConfigModal .modal-footer{
                    width: 100%;
                    height: 10%;
                }
                #diagnosisConfigModal .modal-body table{
                    cursor: pointer;
                }
                #diagnosisConfigModal .modal-body .noData{
                    width: 200px;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                    font-size: 30px;
                }
                #diagnosisConfigModal .modal-body table td{
                    vertical-align: middle;
                }
                #diagnosisConfigModal .modal-body table thead th:hover{
                    background: #d9edf7;
                }
                #diagnosisConfigModal .modal-body table tbody tr:hover{
                    background: #d9edf7;
                }
                #diagnosisConfigModal .checkDiv{
                    background-color: #fafafa;
                    border: 1px solid #cacece;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0px -15px 10px -12px rgba(0,0,0,0.05);
                    padding: 9px;
                    border-radius: 0px;
                    display: inline-block;
                    position: relative;
                }
                #diagnosisConfigModal .checkDiv.radiuDiv{ 
                    border-radius: 50px;
                }
                
                #diagnosisConfigModal .checkDiv.checked{
                    background-color: #e9ecee;
                    color: #99a1a7;
                    border: 1px solid #adb8c0;
                }
                #diagnosisConfigModal .checkDiv.checked::before{
                    content: "\\2714";
                    font-size: 14px;
                    position: absolute;
                    top: 0px;
                    left: 3px;
                    color: #99a1a7;
                }
                #diagnosisConfigModal .checkDiv.radiuDiv.checked::before{
                    content: ' ';
                    width: 12px;
                    height: 12px;
                    border-radius: 50px;
                    position: absolute;
                    top: 3px;
                    background: #99a1a7;
                    box-shadow: inset 0px 0px 10px rgba(0,0,0,0.3);
                    text-shadow: 0px;
                    left: 3px;
                    font-size: 32px;
                }
                #diagnosisConfigModal .row{
                    margin-left: 0;
                }
            </style>
            <div class="modal-wrap">
                <div class="modal-header">
                    <a class="close" data-dismiss="modal">×</a>
                    <h3>Diagnosis Config</h3>
                    <div class ="row">
                        <div class="search input-group col-sm-4">
                            <input type="text" class="form-control" id="inputSearch" placeholder="Search">
                            <span class="input-group-btn">
                                <button class="btn btn-default" type="button" id="btnSearch">
                                    <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="modal-body">
                    <table class="table table-condensed">
                        <thead>
                            <tr>
                                <th id="id" data-reverse="1" i18n="">Id</th>
                                <th id="name" data-reverse="0" i18n="">Name</th>
                                <th id="pageId" data-reverse="0" i18n="">PageId</th>
                                <th id="zoneId" data-reverse="0" i18n="">ZoneId</th>
                                <th id="systemId" data-reverse="0" i18n="">SystemId</th>
                                <th id="subSystemId" data-reverse="0" i18n="">SubSystemId</th>
                                <th id="systemName" data-reverse="0" i18n="">SystemName</th>
                                <th id="subSystemName" data-reverse="0" i18n="">SubSystemName</th>
                                <th id="project" data-reverse="0" i18n="">Project</th>
                                <th id="state" data-reverse="0" i18n="">State</th>
                                <th id="check" data-reverse="0" i18n="">√</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                        <tfoot><tfoot>
                    </table>
                </div>
                <div class ="modal-footer">
                    <button id="save" type="button" class ="btn btn-success">Save</button>
                    <button type="button" class="btn btn-danger"  data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>`
    function HtmlTextProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
        _this = this;
    }

    HtmlTextProp.prototype = Object.create(WidgetProp.prototype);
    HtmlTextProp.prototype.constructor = HtmlTextProp;

    WidgetProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li>\
                    <span class="span-bold">Style:</span>\
                    <div class="btn-group">\
                      <button id="btnTxtStyle" type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                        {class} <span class="caret"></span>\
                      </button>\
                      <ul class="dropdown-menu" id="txtStyle">\
                        <li data-class="txtStyle1"><a href="#" class="txtStyle1">正文1</a></li>\
                        <li data-class="txtStyle8"><a href="#" class="txtStyle1">正文2</a></li>\
                        <li data-class="txtStyle2"><a href="#" class="txtStyle2">标题1</a></li>\
                        <li data-class="txtStyle3"><a href="#" class="txtStyle3">标题2</a></li>\
                        <li data-class="txtStyle4"><a href="#" class="txtStyle4">标题3</a></li>\
                        <li data-class="txtStyle5"><a href="#" class="txtStyle5">标题4</a></li>\
                        <li data-class="txtStyle6"><a href="#" class="txtStyle6">标题5</a></li>\
                        <li data-class="txtStyle7"><a href="#" class="txtStyle7">副标题</a></li>\
                      </ul>\
                    </div>\
                </li>\
            </ul>\
            <ul class="list-inline" style="padding-top: 10px;">\
                <li class="txtShow">\
                    <label class="text-content">Content:</label>\
                    <span class="p_span" style="display:none;">{text}</span>\
                    <span class="btnEditTxt glyphicon glyphicon-edit" style="padding-left: 10px;"></span>\
                </li>\
            </ul>\
            <ul class="list-inline" style="padding-top: 10px;display:none;">\
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
                        <input type="text" class="dsPreview" value="{dsPreview}" style="width:50px;" placeholder="调试值">\
                    </div>\
                </li>\
                <li id="liFloat" style="padding-top: 10px;">\
                        <label class="property-name exactNumber" style="width: 60px;">精确位数:</label>\
                        <span class="property-value p_span"></span>\
                        <input class="property-value p_input" type="text" value="">\
                </li>\
                <li id="liEnumerateWrap" style="padding-top: 10px;display:block;">\
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
        <li id="diagnosisConfigWrap" style="padding-top: 10px;display:block;">\
            <label for="ckbEnumerate">diagnosisConfig:</label>\
            <input id="diagnosisConfig" type="button" class="btn btn-default btn-xs" style="margin-left:10px;" value="Show"/>\
        </li>\
        <li>\
            <ul class="list-inline" style="position:realtive">\
                <li class="divPorpertyBase" id="liTempltConfigWrap">\
                    <div class="propertyTemplt">\
                        <label for="ckbpropertyTemplt">Customstyle:</label>\
                        <input id="ckbpropertyTemplt" type="checkbox"/>\
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
    HtmlTextProp.prototype.tplStyle = '' +
        '.Normal{\n' +
        '    /* Please input text normal style */\n' +
        '}\n' +
        '.Normal:hover{\n' +
        '    /* Please enter a state of suspension style text */\n'+
        '}' +
        '';
    /** override */
    HtmlTextProp.prototype.show = function () {
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
                var tempHTML = '<option id="noSkip" selected="selected" value="" i18n="mainPanel.attrPanel.attrRepeat.LINK_TO_CON">不跳转页面</option><option id="optS3db" value="-s3db">跳转s3db页面</option>', tpl = '<option value="{id}-{type}">{text}</option>';
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
        $('.span-bold').html(I18n.resource.mainPanel.attrPanel.attrRepeat.STYLE); 
        $('.text-content').html(I18n.resource.mainPanel.attrPanel.attrRepeat.CONTENT);
        $('.curLinkTo').html(I18n.resource.mainPanel.attrPanel.attrRepeat.LINK_TO);
        $('.curFloat').html(I18n.resource.mainPanel.attrPanel.attrRepeat.FLOAT);
        $('.exactNumber').html(I18n.resource.mainPanel.attrPanel.attrRepeat.EXACT_NUMBER);
        $('#noSkip').html(I18n.resource.mainPanel.attrPanel.attrRepeat.LINK_TO_CON);
        $('.dataSource').find('.span-bold').html(I18n.resource.mainPanel.attrPanel.attrRepeat.DATA_SOURCE);
        $('.propertyTemplt').find('label').html(I18n.resource.mainPanel.attrPanel.attrRepeat.CUSTOMSTYLE);
        $('.txtShow').find('.btnEditTxt').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.EDIT_CONTENT_TITLE);
        $('#btnPropTempltApply').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.SAVE_STYLE_TITLE);
        $('#btnPropTempltExport').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.EXPORT_STYLE_TITLE);
        $('#btnPropTempltImport').attr('title', I18n.resource.mainPanel.attrPanel.attrRepeat.IMPORT_STYLE_TITLE);
        var styleArr = [I18n.resource.mainPanel.attrPanel.attrText.TEXT_ONE, I18n.resource.mainPanel.attrPanel.attrText.TEXT_TWO, I18n.resource.mainPanel.attrPanel.attrText.TITLE_ONE, I18n.resource.mainPanel.attrPanel.attrText.TITLE_TWO,
                        I18n.resource.mainPanel.attrPanel.attrText.TITLE_THREE, I18n.resource.mainPanel.attrPanel.attrText.TITLE_FOUR, I18n.resource.mainPanel.attrPanel.attrText.TITLE_FIVE, I18n.resource.mainPanel.attrPanel.attrText.SUBTITLE];
        for (var m = 0; m < styleArr.length; m++) {
            $('#txtStyle').find('a').eq(m).html(styleArr[m]);
        }

        //设置页面默认选中项
        if(model.option().pageId){
            $('#pageList').val([model.option().pageId, model.option().pageType].join('-'));
            $('#iptFloat').parent('li').show();
            if(model.option().float === 1){
                $('#iptFloat').prop('checked',true);
            }else{
                $('#iptFloat').prop('checked',false);
            }
        }else{
            $('#iptFloat').parent('li').hide();
        }
        //$('#unchoose').html(I18n.resource.mainPanel.attrPanel.attrRepeat.SELECT_SCREEN);
        //文本预置样式的文本
        var btnTxt = option.class == '---' ? '---' : $('[data-class="' + option.class + '"] a').text();
        $('#btnTxtStyle').html(btnTxt + '<span class="caret"></span>');

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
            /*if (triggerEptCount === 0 && model.idDs().length !== 0) {
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
    HtmlTextProp.prototype.close = function () {

    };

    /** override */
    HtmlTextProp.prototype.update = function () {
    };

    HtmlTextProp.prototype.updateDs = function (id) {
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

    HtmlTextProp.prototype.cloudPoint = function (e) {
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

    HtmlTextProp.prototype.attachEvent = function () {
        var _this = this;
        var tempStyle = '';
        var templateId = null;
        //修改页面文本显示内容
        $('#pageList', this.$propertyList).off('change').change(function() {
            var opt = _this.store.model.option();
            var arr;

            if (!this.value) {
                opt.pageId = opt.pageType = '';
                opt.float = 0;
                $('#iptFloat').parent('li').hide();
            } else {
                $('#iptFloat').prop('checked',false);
                $('#iptFloat').parent('li').show();
                arr = this.value.split('-');
                opt.pageId = arr[0];
                opt.pageType = arr[1];
            }
            _this.store.model.update({
                'option.pageId': opt.pageId,
                'option.pageType': opt.pageType
            });
        });
        //选择文本样式
        $('#txtStyle li', this.$propertyList).off('click').click(function(){
            var htmlClass = this.dataset.class;
            _this.store.model['option.class'](htmlClass);
        });
        //预览文本样式
        $('#txtStyle li', this.$propertyList).hover(function(){
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

        $('.btnEditTxt', this.$propertyList).off('click').click(function(){
            EditorModal.show(_this.store.model.option().text, true, function (newContent) {
                var opt = _this.store.model.option();
                opt.text = newContent;
                _this.store.model.option(opt,'text');
            });
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
            if (AppConfig.datasource.currentObj === 'cloud') {
                var dragName = $('#tableDsCloud').find('tr[ptid="' + dragId + '"]').find('.tabColName').attr('data-value');
                var currentId = $('#selectPrjName').find('option:selected').val();
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
            //$dsPreview.remove();
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
                _this.store.model.templateId('');
                var tempOpt = _this.store.model.option();
                tempOpt.style = '';
                $('#inputTplStyle').val(_this.tplStyle);
                _this.store.model.option(tempOpt,'style');
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
            }else{
                tempOpt.style = null;
            }
            _this.store.model.option(tempOpt,'style');
        };
        //导入模板
        $('#btnPropTempltImport')[0].onclick = function(){
            MaterialModal.show([{'title':'Template',data:['Widget.HtmlText']}], function (data, isCopy) {
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
                creator: AppConfig.userProfile.fullname,
                time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                "public": 1,
                isFolder:0,
                group: '',
                type: 'widget.HtmlText',
                content: {
                    style:tplStyle
                }
            };
            WebAPI.post('/factory/material/save', data
            ).done(function(result){
                if(result && result._id){
                    data._id = result._id;
                }
            }).always(function(){

            });
        };

        $('#diagnosisConfig').off('click').on('click', function () {
            if(!AppConfig.project||!AppConfig.project.bindId){
                alert('Please create an online project first!');
                return;
            }
            var $modal = $(modal);
            $('body').append($modal);
            modalAttachEvent();
            $modal.modal('show');
        });

        function modalAttachEvent() {
            var model = _this.store.model;
            var opt = model.option();
            var $modal = $("#diagnosisConfigModal");
            var stateDivArr = ['<span class="label label-info" i18n="">occupied</span>', '<span class="label label-success" i18n="">free</span>'];
            var $btnSearch = $('#btnSearch', $modal),
                $inputSearch = $('#inputSearch', $modal),
                $thead = $('table thead', $modal),
                $tbody = $('table tbody', $modal),
                $noData = $('.noData', $modal),
                $save = $('#save', $modal);
            var projectId = AppConfig.project.bindId;
            var equipmentsData = sessionStorage.getItem('equipmentsData_' + projectId),
                filterDate, checkedDataId = {}, otherEquipments = [];
            var otherTextArr = _this.panel.screen.painter.findByCondition(function (row) { return row.store.model['option.equipments'] && row.store.model['option.equipments']().length > 0 && row.store.model['option.equipments']() });

            otherTextArr.forEach(function (it) {
                otherEquipments = otherEquipments.concat(it.store.model['option.equipments']());
            });

            $modal.on('show.bs.modal', function () {
                Spinner.spin(this);
                if (equipmentsData) {
                    equipmentsData = JSON.parse(equipmentsData);
                    filterDate = equipmentsData.concat();
                    refreshData(filterDate);
                    Spinner.stop();
                } else {
                    WebAPI.get('/diagnosis/getEquipments/'+projectId).done(function (rs) {
                        if(rs&&rs.length){
                            equipmentsData = rs;
                            filterDate = equipmentsData.concat();
                        }
                        refreshData(filterDate);
                    }).always(function () {
                        Spinner.stop();
                    });
                }
            });

            $modal.on('hidden.bs.modal', function () {
                if (equipmentsData) {
                    sessionStorage.setItem('equipmentsData_'+projectId, JSON.stringify(equipmentsData));
                }
                $(this).remove();
            });

            $btnSearch.off('click').on('click', function () {
                if(!filterDate){
                    return;
                }
                var val = $inputSearch.val().toLowerCase();
                filterDate = equipmentsData.filter(function (it) {
                    if (it.name.toLowerCase().indexOf(val) > -1 || it.systemName.toLowerCase().indexOf(val) > -1 || it.subSystemName.toLowerCase().indexOf(val) > -1) {
                        return it;
                    }
                });
                refreshData(filterDate);
            });

            $inputSearch.off('keydown').on('keydown', function (e) {
                if (e.keyCode == 13) {
                    $btnSearch.trigger('click');
                }
            });

            $thead.off('click').on('click', 'th', function () {
                if(!filterDate){
                    return;
                }
                var propName = this.id;
                var reverse = this.dataset.reverse;
                if (propName == 'check') {
                    var newData;
                    if (reverse == '1') {
                        newData = filterDate;
                        this.dataset.reverse = '0';
                    } else {
                        newData = filterDate.filter(function (it) {
                            if (checkedDataId[it.id] == 1) {
                                return it;
                            }
                        });
                        this.dataset.reverse = '1';
                    }
                    refreshData(newData);
                    return;
                }

                if (propName == 'state') {
                    if (reverse == '1') {
                        filterDate.sort(function (a, b) {
                            if (otherEquipments.find((function (it) { return it == a.id }))) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });
                        this.dataset.reverse = '0';
                    } else {
                        filterDate.sort(function (a, b) {
                            if (otherEquipments.find((function (it) { return it == a.id }))) {
                                return -1;
                            } else {
                                return 1;
                            }
                        });
                        this.dataset.reverse = '1';
                    }
                    refreshData(filterDate);
                    return;
                }
                
                if (reverse == '1') {
                    filterDate.sort(function (a, b) {
                        if (isNaN(Number(a[propName]))||isNaN(Number(b[propName]))) {
                            return (b[propName]).localeCompare(a[propName]);
                        } else {
                            return b[propName] - a[propName];
                        }
                    });
                    this.dataset.reverse = '0';
                } else {
                    filterDate.sort(function (a, b) {
                        if (isNaN(Number(a[propName]))||isNaN(Number(b[propName]))) {
                            return (a[propName]).localeCompare(b[propName]);
                        } else {
                            return a[propName] - b[propName]
                        }
                    });
                    this.dataset.reverse = '1';
                }
                refreshData(filterDate);
            })

            $tbody.off('click').on('click', 'tr', function (e) {
                var $this = $(this);
                var $checkDiv = $this.find('.checkDiv');
                var id = this.id.split('_')[1];

                var changeState = {
                    add: function ( $parent ) {
                        $parent.find('.state').html(stateDivArr[0]);
                    },
                    remove: function ( id, $parent ) {
                        if (otherEquipments.findIndex(function (it) { return it == id }) == -1) {
                            $parent.find('.state').html(stateDivArr[1]);
                        };
                    }
                };

                var changeOtherEquipments = {
                    add: function ( id ) {
                        otherEquipments.push(Number(id));
                    },
                    remove: function ( id ) {
                        var index = otherEquipments.findIndex(function (it) { return it == id });
                        if (index != -1) {
                            otherEquipments.splice(index, 1);
                        }
                    }
                };

                function removeChecked($checkedDivs) {
                    var $tr, itemId;
                    for (var i = 0, len = $checkedDivs.length; i < len; i++) {
                        $tr = $checkedDivs.eq(i).removeClass('checked').parent().parent();
                        itemId = $tr.attr('id').split('_')[1];
                        changeOtherEquipments.remove(itemId);
                        changeState.remove(itemId,$tr);
                    }
                }
                
                if (e.ctrlKey) {
                    if ($checkDiv.hasClass('checked')) {
                        checkedDataId[id] = 0;
                        changeOtherEquipments.remove(id);
                        changeState.remove(id,$this);
                    } else {
                        checkedDataId[id] = 1;
                        changeOtherEquipments.add(id);
                        changeState.add($this);
                    }
                    $checkDiv.toggleClass('checked');
                } else {
                    var $checkedDivs = $this.parent().find('.checkDiv.checked');
                    if ($checkDiv.hasClass('checked')) {
                        checkedDataId = {};
                        removeChecked($checkedDivs);
                    } else {
                        removeChecked($checkedDivs);
                        $checkDiv.addClass('checked');
                        checkedDataId = {
                            [id]: 1
                        };
                        changeOtherEquipments.add(id);
                        changeState.add($this);
                        
                    }
                }
            });

            $save.off('click').on('click', function () {
                var idArr = [];
                for (var k in checkedDataId) {
                    if (checkedDataId[k] == 1) {
                        idArr.push(Number(k));
                    }
                }
                _this.store.model['option.equipments'](idArr);
                $modal.remove();
                //WebAPI.post('/diagnosis/setModalTextId/'+projectId,data).done(function (e) {
                //    if (e) {
                //        equipmentsData.forEach(function (item,i) {
                //            if (idArr.find((it) =>(it == item.id))) {
                //                item.modalTextId = modelId;
                //            }
                //        });
                //        $modal.remove();
                //    }
                //});
            })

            function refreshData(data) {
                var $tbody = $("#diagnosisConfigModal tbody");
                if (!data || !data.length) {
                    $tbody.html('');
                    $('.modal-body').append('<div class="noData">No Data</div>')
                    return;
                }
                $('#diagnosisConfigModal .noData').remove();
                var str = '', checkDivStr, stateDivStr, info;
                var equipments = model['option.equipments']();
                
                for (var i = 0, len = data.length; i < len; i++) {
                    info = data[i];
                    if (model.models.length == 1 && (checkedDataId[info.id] == 1 || equipments.find(function(it){return it==info.id}))) {
                        checkDivStr = '<div class="checkDiv radiuDiv checked"></div>';
                        !checkedDataId[info.id] && (checkedDataId[info.id] = 1);
                    } else {
                        checkDivStr = '<div class="checkDiv radiuDiv"></div>';
                    }
                    if (otherEquipments.find(function(it){return it==info.id})) {
                        stateDivStr = stateDivArr[0];
                    } else {
                        stateDivStr = stateDivArr[1];
                    }
                    str += `<tr id="${'equipments_' + info.id}">
                                <td>${info.id}</td>
                                <td>${info.name}</td>
                                <td>${info.pageId}</td>
                                <td>${info.zoneId}</td>
                                <td>${info.systemId}</td>
                                <td>${info.subSystemId}</td>
                                <td>${info.systemName}</td>
                                <td>${info.subSystemName}</td>
                                <td>${info.project}</td>
                                <td class="state">${stateDivStr}</td>
                                <td>${checkDivStr}</td>
                            </tr>`;
                }
                $tbody.html(str);
            }
        }
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.HtmlTextProp = HtmlTextProp;

} (window.widgets.factory.WidgetProp));

/** Html Text Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function HtmlTextPropModel() {
        PropModel.apply(this, arguments);
    }

    HtmlTextPropModel.prototype = Object.create(PropModel.prototype);
    HtmlTextPropModel.prototype.constructor = HtmlTextPropModel;

    HtmlTextPropModel.prototype.option = function (params,attr) {
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
    ['idDs','option.text','option.class','templateId','option.precision','option.trigger','option.float','option.preview','option.equipments'].forEach(function(type){
        HtmlTextPropModel.prototype[type] = function (params) {
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
    window.widgets.propModels.HtmlTextPropModel = HtmlTextPropModel;

} (window.widgets.propModels.PropModel));