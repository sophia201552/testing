(function (WidgetProp) {
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });
    function CanvasImageProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
    }

    CanvasImageProp.prototype = Object.create(WidgetProp.prototype);
    CanvasImageProp.prototype.constructor = CanvasImageProp;

    CanvasImageProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li>\
                    <label class="img-canvas">Image: </label><button id="btnChooseImg" type="button" class="btn btn-xs btn-default">Choose</button>\
                    <label class="rotate-canvas">Rotate: </label><input id="inputRotate" class="p_input" value="{rotate}"/>°\
                </li>\
            </ul>\
        </ii>\
        <li>\
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
                        <input type="text" class="dsPreview" value="{dsPreview}" style="width:50px;" placeholder="调试值">\
                    </div>\
                    </li>\
                    <li id="liEnumerateWrap" style="padding-top: 10px;">\
                    <div class="divTool">\
                        <div class="enumerateCtn">\
                            <span class="span-bold">Enumerate:</span>\
                            <input id="ckbEnumerate" type="button" class="btn btn-default btn-xs" style="margin-left:10px;" value="Show"/>\
                        </div>\
                        <span id="btnAddEnumerate" class="glyphicon glyphicon-plus-sign btnEnumerate"></span>\
                    </div>\
                </li>\
                <div id="enumerateWrap">\
                    <ul class="list-unstyled">\
                        <li class="enumerateItem">\
                            <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey"></div>\
                            <div class="enumeratePart divEnumerateVal"><label class="enumerateLabel">Value:</label><input class="enumerateVal"><span class="glyphicon glyphicon-picture btnEnumerate btnChoosePic"></span></div>\
                            <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate">\
                        </li>\
                    </ul>\
                </div>\
            </ul>\
        </li>';

    /** override */
    CanvasImageProp.prototype.show = function () {
        var _this = this;
        this.$propertyList.empty();
        var model = this.store.model, isShowDsName = 'none', isShowDropArea = 'inline-block';
        var opt = model.option();
        var defaultOpt = {
            x: typeof model.x() === 'number' ? model.x() : '-',// model.x() || '-',
            y: typeof model.y() === 'number' ? model.y() : '-',//model.y() || '-',
            w: typeof model.w() === 'number' ? model.w() : '-',//model.w() || '-',
            h: typeof model.h() === 'number' ? model.h() : '-'//model.h() || '-'
        };

        var option = {
            html: opt.html,
            width: opt.width,
            color: opt.color,
            dsId: model.idDs(),
            rotate: typeof opt.rotate === 'number' ?opt.rotate:'-',
            selectHTML: (function(){
                var tempHTML = '<option id="noSkip" selected="selected" value="" i18n="mainPanel.attrPanel.attrRepeat.LINK_TO_CON">不跳转页面</option><option id="optPageScreen" value="-Custom">根据页面名称查找</option><option id="optS3db" value="-s3db">跳转s3db页面</option>',
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
            dsName: (function(ids){//获取点名
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
            //enumerateHTML: (function(trigger){//显示枚举列表
            //    var tpl = '<li class="enumerateItem"><label class="enumerateLabel">key:</label><input class="enumerateKey" value="{i}"><label class="enumerateLabel">value:</label><input class="enumerateVal" value="{val}"><span class="glyphicon glyphicon-picture btnEnumerate btnChoosePic"></span><span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></span></li>';
            //    var temp = '';
            //    if(!trigger || $.isEmptyObject(trigger)) return tpl.formatEL({i: '', val: ''});
            //    for(var i in trigger){
            //        temp += tpl.formatEL({i: i, val: trigger[i]})
            //    }
            //    return temp;
            //}(opt.trigger)),
            isShowDsName: isShowDsName,
            isShowDropArea: isShowDropArea
        };
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));

        //国际化
        $('.dataSource').find('.span-bold').html(I18n.resource.mainPanel.attrPanel.attrRepeat.DATA_SOURCE);
        $('.img-canvas').html(I18n.resource.mainPanel.attrPanel.attrImg.IMAGE);
        $('.curLinkTo').html(I18n.resource.mainPanel.attrPanel.attrRepeat.LINK_TO);
        $('.curFloat').html(I18n.resource.mainPanel.attrPanel.attrRepeat.FLOAT);
        $('.rotate-canvas').html(I18n.resource.mainPanel.attrPanel.attrImg.ROTATE);
        $('#btnChooseImg').html(I18n.resource.mainPanel.attrPanel.attrImg.CHOOSE);
        $('#noSkip').text(I18n.resource.mainPanel.attrPanel.attrRepeat.LINK_TO_CON);

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
         //枚举初始化
        var $enumerateWrap = $('#enumerateWrap');
        var trigger = model.models[0].option().trigger;
		var strEnumerate='';
        if ( !$.isEmptyObject(trigger)) {
            $('.enumerateItem').remove();
            for (var row in trigger) {
                this.addEnumerate(row, trigger[row]);
            }
            var $enumerateItem = $(".enumerateItem");
            if($enumerateItem.length == 1 && $enumerateItem.find(".enumerateKey").val() == "default"){
                $enumerateItem.remove();
            }else{
                $enumerateItem.each(function(){
                    if($(this).find(".enumerateKey").val() == "default"){
                        $(this).remove();
                    }
                })
                this.$propertyList.find('#ckbEnumerate')[0].value = 'Hide';
                $('#liEnumerateWrap .divTool .btnEnumerate').show();
                $("#enumerateWrap").show();
            }
        }
        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };


    /** override */
    CanvasImageProp.prototype.close = function () {

    };

    CanvasImageProp.prototype.addEnumerate=function(key, value) {
        var $enumerateWrap = $('#enumerateWrap');
        var html = '<li class="enumerateItem">\
                <div class="enumeratePart"><label class="enumerateLabel">  Key:</label><input class="enumerateKey" style="width:calc(100% - 55px)" value="'+key+'"></div>\
                <div class="enumeratePart"><label class="enumerateLabel">Value:</label><input class="enumerateVal" style="width:calc(100% - 90px)" value="'+value+'"><span class="glyphicon glyphicon-picture btnEnumerate btnChoosePic"></span><span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></div></li>\
                ';
        
        $enumerateWrap.find('ul').append(html);
    };
    /** override */
    CanvasImageProp.prototype.update = function () { };

    CanvasImageProp.prototype.cloudPoint = function (e) {
        var _this = this;
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
                        _this.store.model.update({
                            'idDs': [$this.val()]
                        });
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
                            _this.store.model.update({
                                'idDs': ['@'+currentId+'|'+$this.val()]
                            });
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

    CanvasImageProp.prototype.attachEvent = function () {
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
        $('#btnChooseImg', this.$propertyList).off('click').click(function(){
            MaterialModal.show([{'title':'Template',data:['Image']}], function (data) {
                var model = _this.store.model;
                //var options = model.option();
                var w = model.w();
                var h = model.h();
                //model['option.trigger.default'](data._id);
                //options.trigger.default = data._id;
                _this.panel.screen.store.imageModelSet.append( new Model(data) );

                //w = (data.pw || data.w || w);
                //h = (data.h || h);
                //model.w(data.pw || data.w || w);
                //model.h(data.h || h);
                //model.option(options);
                //model['option'](options);
                model.update({
                    'w': data.pw || data.w || w,
                    'h': data.h || h,
                    'option.trigger.default': data._id
                });
            });
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
        $dataSource[0].ondrop = function(e){
            e.preventDefault();
            var dragId = EventAdapter.getData().dsItemId;
            if (AppConfig.datasource.currentObj === 'cloud') {
                var dragName = $('#tableDsCloud').find('tr[ptid="' + dragId + '"]').find('.tabColName').attr('data-value');
                var currentId = $('#selectPrjName').find('option:selected').val();
                if (currentId) {
                    dragName = '@' + currentId + '|' + dragName;
                } else {
                    dragName = dragId;
                }
                _this.store.model.idDs(new Array(dragName));
            } else {
                _this.store.model.idDs(new Array(dragId));
            }
            //var id = EventAdapter.getData().dsItemId;
            //_this.store.model.idDs(new Array(id));
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
            //_this.store.model.option(opt, 'trigger');
            //var triggerAll = _this.store.model.models[0].option().trigger;
            //var triggerDefault = {};
            //triggerDefault = triggerAll.default ? { 'default': triggerAll.default } : {};
            _this.store.model.update({
                'idDs': [],
                'option.preview':[]
                //'option.trigger': triggerDefault
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
            if ($(this).val() === 'Show') {
                //当删除没提交时，ul的内容为空需要重新载入子元素
                if ($('#enumerateWrap').find('.list-unstyled').children().length===0) {
                    _this.addEnumerate('','');
                }
                $('#enumerateWrap').stop().slideDown();
                $(this).val('Hide');
                $btnEnumerate.show();
                $btnSaveEnumerate.show();
                /*if(){
                    _this.addEnumerate("","");
                }*/
            }else {
                $('#enumerateWrap').stop().slideUp();
                $(this).val('Show');
                $btnEnumerate.hide();
                $btnSaveEnumerate.hide();
            }
        }
        if ($('#ckbEnumerate').val() === 'Show') {
            _this.addEnumerate("","");
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
                <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey" style="width:calc(100% - 55px)"></div>\
                <div class="enumeratePart"><label class="enumerateLabel">Value:</label><input class="enumerateVal" style="width:calc(100% - 90px)"><span class="glyphicon glyphicon-picture btnEnumerate btnChoosePic"></span><span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></div>\
                </li>\
                ');
            $ulEnumerate.append($li);
        }
        $('#enumerateWrap').off('click').on('click', '.btnRemove',function(){
            //删除枚举
            $(this).parents('.enumerateItem').remove();
            var enumerateKey= $(this).parent().siblings().find('input.enumerateKey').val();
            if (enumerateKey) {
                _this.panel.screen.layerPanel.painter.state.activeWidgets().forEach(function (row) {
                    delete row.store.model['option.trigger']()[enumerateKey];
                    row.store.model.update({
                        'option.trigger': row.store.model['option.trigger']()
                    });
                }, _this);
            }
            var $enumerateKeyS = $(".enumerateKey");
            if($enumerateKeyS.length == 0){
                $("#enumerateWrap").hide();
                $("#liEnumerateWrap").find("span.glyphicon").hide();
                _this.$propertyList.find('#ckbEnumerate').val('Show');
            }
            // _this.$propertyList.find('#ckbEnumerate').prop('checked', false);
        }).on('click', '.btnChoosePic',function(){
            //枚举:选择图片
            var key = $.trim($(this).closest('.enumerateItem').find('.enumerateKey').val());
            var _btn = this;
            if(!key){
                //todo
                alert(I18n.resource.mainPanel.attrPanel.attrImg.ENUMER_INFO);
            }else{
                MaterialModal.show([{'title':'Template',data:['Image']}], function (data) {
                    var options = _this.store.model.option();
                    options.trigger[key] = data._id;
                    _this.store.model.option(options,'trigger');
                    $(_btn).siblings('.enumerateVal').val(data._id);
                });
            }
        });

        $('#inputRotate', this.$propertyList).off('change').on('change', function(){
            if(isNaN(this.value)) return;
            var opt = _this.store.model.option();
            opt.rotate = Number(this.value);
            _this.store.model.option(opt,'rotate');
        });
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.CanvasImageProp = CanvasImageProp;

} (window.widgets.factory.WidgetProp));

/** Canvas Image Prop Model */
(function (PropModel) {

    var _this;
    var class2type = Object.prototype.toString;

    function CanvasImagePropModel() {
        _this = this;
        PropModel.apply(this, arguments);
    }

    CanvasImagePropModel.prototype = Object.create(PropModel.prototype);
    CanvasImagePropModel.prototype.constructor = CanvasImagePropModel;

    CanvasImagePropModel.prototype.option = function (params) {
        if(class2type.call(params) === '[object Object]') {
            if(arguments.length == 1){
                this._setProperty('option', params);
            }else if(arguments.length == 2){//只设置option的指定属性:attr
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
    ['idDs','option.trigger.default','option.trigger','option.float','option.preview'].forEach(function(type){
        CanvasImagePropModel.prototype[type] = function (params) {
            var v;
            if(params) {
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
    window.widgets.propModels.CanvasImagePropModel = CanvasImagePropModel;

} (window.widgets.propModels.PropModel));