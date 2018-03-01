(function (WidgetProp) {
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });
    function CanvasPipeProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
    }

    CanvasPipeProp.prototype = Object.create(WidgetProp.prototype);
    CanvasPipeProp.prototype.constructor = CanvasPipeProp;

    CanvasPipeProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline">\
                <li id="pipeWidth"><label class="pipe-width">Pipewidth:</label><span class="property-value"> {width}</span><input class="property-value" type="text" value="{width}" style="display:none;border-color: #aaa;border-radius: 2px;width: 40px;"/>px</li>\
                <li id="pipeFlowDirection"><label class="pipe-flowDirection">水流反向:</label><input type="checkbox" style="vertical-align: middle;margin: 2px 0 5px 10px;"/>\
            </ul>\
        </li>\
        <li>\
            <ul class="list-inline">\
                <li id="pipeColor"><label class="pipe-color">Color:</label>\
                    <div class="dropdown">\
                      <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
                        <span class="colorSpan" style="background-color:{color}"></span>\
                      </button>\
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">\
                        <li><a href="#"><span class="colorSpan" style="background-color:#ff6f4f"></span></a></li>\
                        <li><a href="#"><span class="colorSpan" style="background-color:#5eb44f"></span></a></li>\
                        <li><a href="#"><span class="colorSpan" style="background-color:#3396ec"></span></a></li>\
                        <li><a href="#"><span class="colorSpan" style="background-color:#ed3434"></span></a></li>\
                        <li><a href="#" class = "custom">自定义</a></li>\
                      </ul>\
                    </div>\
                    <input class="property-value" type="color" value="{color}"/></li>\
                <li id="pipeAnimation"><label class="pipe-style">水流动画样式:</label>\
                    <div class="dropdown">\
                      <button class="btn btn-default dropdown-toggle" type="button" id="dropdownStyle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
                        <span class="styleSpan">{pipeAnimation}</span>\
                      </button>\
                      <ul class="dropdown-menu" aria-labelledby="dropdownStyle">\
                        <li><a href="#"><span class="styleSpan" data-index="0">细线</span></a></li>\
                        <li><a href="#"><span class="styleSpan" data-index="1">粗线</span></a></li>\
                        <li><a href="#"><span class="styleSpan" data-index="2">气泡</span></a></li>\
                      </ul>\
                    </div>\
            </ul>\
        </li>\
       <li>\
            <ul id="dataSList" class="list-inline" style="position: relative;">{dataSourceListHtml}\
                <li id="liDataSourceLogic" style="padding-top: 10px;width: 100%;">\
                    <label class="pipe-dataSourceLogic">逻辑:</label>\
                    <label class="radio-inline" style="margin: 0 5px 5px 5px;">\
                        <input type="radio" name="inlineRadioOptions" id="inlineRadioOr" value="0"> 或\
                    </label>\
                    <label class="radio-inline" style="margin: 0 5px 5px 5px;">\
                        <input type="radio" name="inlineRadioOptions" id="inlineRadioAnd" value="1"> 与\
                    </label>\
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
                            <div class="enumeratePart divEnumerateVal"><label class="enumerateLabel">Value:</label><input class="enumerateVal"></div>\
                            <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate">\
                        </li>\
                    </ul>\
                </div>\
            </ul>\
        </li>';

    /** override */
    CanvasPipeProp.prototype.show = function () {
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
            pipeAnimation: (function (pipeAnimation) {
                var rs;
                switch (pipeAnimation) {
                    case 0:
                        rs = '细线';
                        break;
                    case 1:
                        rs = '粗线';
                        break;
                    case 2:
                        rs = '气泡';
                        break;
                    default:
                        rs = '未知';
                }
                return rs;
            })(opt.pipeAnimation),
            dataSourceListHtml: (function (idDs) {
                var tpl = '<li class="divPorpertyBase">\
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
                    </li>';
                var htmlStr = '';
                if (!idDs || !(idDs instanceof Array) || idDs.length == 0) return tpl.formatEL({
                    isShowDsName: 'none',
                    dsName: '',
                    isShowDropArea: 'inline-block',
                    dsId: '',
                    dsPreview:opt.preview[0]?opt.preview[0]:''
                });
                for (var i in idDs) {
                    htmlStr += tpl.formatEL({
                        isShowDsName: 'inline-block',
                        dsId: idDs[i],
                        dsPreview:opt.preview[i]?opt.preview[i]:'',
                        dsName: (function (ids) {//获取点名
                            var idsName = [];
                            if (ids.indexOf('@') === 0) {
                                idsName = ids;
                                return idsName;
                            }
                            var arrItem = [];
                            arrItem = AppConfig.datasource.getDSItemById([ids]);
                            [ids].forEach(function (id) {
                                for (var m = 0; m < arrItem.length; m++) {
                                    if (id == arrItem[m].id) {
                                        idsName = arrItem[m].note ? arrItem[m].note : arrItem[m].alias;
                                        break;
                                    }
                                }
                                //idsName = AppConfig.datasource.getDSItemById(id).alias
                            });
                            return idsName;
                        }(idDs[i])),
                        isShowDropArea: 'none'
                    });
                    
                }
                htmlStr += tpl.formatEL({
                    isShowDsName: 'none',
                    dsName: '',
                    isShowDropArea: 'inline-block',
                    dsId: '',
                    dsPreview:opt.preview[opt.preview.length-1]?opt.preview[opt.preview.length-1]:''
                });
                return htmlStr;
            }(model.idDs()))
            //enumerateHTML: (function(trigger){//显示枚举列表
            //    var tpl = '<li class="enumerateItem"><label class="enumerateLabel">key:</label><input class="enumerateKey" value="{i}"><label class="enumerateLabel">value:</label><input class="enumerateVal" value="{val}"><span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></span></li>';
            //    var temp = '';
            //    if(!trigger || $.isEmptyObject(trigger)) return tpl.formatEL({i: '', val: ''});
            //    for(var i in trigger){
            //        temp += tpl.formatEL({i: i, val: trigger[i]})
            //    }
            //    return temp;
            //}(opt.trigger)),
        };
        //this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));

        //国际化
        $('.dataSource').find('.span-bold').html(I18n.resource.mainPanel.attrPanel.attrRepeat.DATA_SOURCE); 
        $('.pipe-width').html(I18n.resource.mainPanel.attrPanel.attrPipe.PIPE_WIDTH);
        $('.pipe-color').html(I18n.resource.mainPanel.attrPanel.attrPipe.PIPE_COLOR);
        $('.pipe-flowDirection').html(I18n.resource.mainPanel.attrPanel.attrPipe.REVERSE_FLOW);
        $('.custom').html(I18n.resource.mainPanel.attrPanel.attrPipe.CUSTOM_COLOR);
        //管道水流方向初始化
        if(model.option().points && typeof model.option().direction === 'number'){
            if(model.option().direction === 0){
                $('#pipeFlowDirection input', this.$propertyList).prop('checked',false);
            }else{
                $('#pipeFlowDirection input', this.$propertyList).prop('checked',true);
            }
        }
        //数据逻辑初始化
        var $liDataSourceLogic = $('#liDataSourceLogic',this.$propertyList);
        if(model.option() && typeof model.option().direction === 'number'){
            $liDataSourceLogic.find('input[value='+ opt.logic +']').prop('checked',true);
        }

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
        //枚举初始化
        //var $enumerateWrap = $('#enumerateWrap');
        //var trigger = model.models[0].option().trigger;
        //var strEnumerate='';
        //var triggerEptCount = 0;
        //if(!$.isEmptyObject(trigger)) {
        //    $('.enumerateItem').remove();
        //    for (var row in trigger) {
        //        strEnumerate += addEnumerate(row, trigger[row]);
			//
        //    }
			//$enumerateWrap.find('ul').append(strEnumerate);
        //    $('#liEnumerateWrap .divTool .btnEnumerate').show();
        //    var models = model.models;
        //    //判断选中的按钮的trigger是否有为空的，如果有则枚举不显示
        //    for (var i = 0; i < models.length; i++) {
        //        if ($.isEmptyObject(models[i].option().trigger)) {
        //            triggerEptCount += 1;
        //        }
        //    }
        //    if (triggerEptCount === 0 && model.idDs().length !== 0) {
        //        this.$propertyList.find('#ckbEnumerate')[0].checked = true;
        //        $enumerateWrap.show();
        //    } else {
        //        $enumerateWrap.find('ul').children().remove();
        //        addEnumerate('', '');
        //        }
        //}
        //function addEnumerate(key, value){
        //    var html =  '<li class="enumerateItem">\
        //        <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey" value={key}></div>\
        //        <div class="enumeratePart"><label class="enumerateLabel">Value:</label><input class="enumerateVal" value={value}></div>\
        //        <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
        //        ';
        //    var li = html.formatEL({
        //        key: key,
        //        value: value
        //    });
        //    return li;
        //};
        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };

    CanvasPipeProp.prototype.loadImage = function (value, callback) {

    }

    /** override */
    CanvasPipeProp.prototype.close = function () {

    };

    /** override */
    CanvasPipeProp.prototype.update = function () {
        console.log('pipe is update');
    };
    CanvasPipeProp.prototype.cloudPoint = function (e,index) {
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

                    var arr = _this.store.model.idDs()||[];
                    if (data.total === 1) {
                        if(index > -1){
                            arr[index] = $this.val();
                        }else{
                            arr.push($this.val());
                        }
                        _this.store.model.idDs(arr);
                        _this.store.model['option.trigger']({ 0: "0", 1: "1" });
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
                        var arr = _this.store.model.idDs()||[];
                        if (data.total === 1) {
                            if(index > -1){
                                arr[index] = '@' + currentId + '|' + $this.val();
                            }else{
                                arr.push('@' + currentId + '|' + $this.val());
                            }
                            _this.store.model.idDs(arr);
                            _this.store.model['option.trigger']({ 0: "0", 1: "1" });
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

    CanvasPipeProp.prototype.attachEvent = function () {
        var _this = this;
        //管道宽度输入框
        $('#pipeWidth input', this.$propertyList).off('change').change(function(){
            var opt = _this.store.model.option();
            opt.width = this.value;
            _this.store.model.option(opt,'width');
        });

        $('#pipeWidth span', this.$propertyList).off('click').click(function(){
            var $input = $(this).hide().next('input');
            $input.show().focus().val($input.val());
        });
        $('#pipeWidth input', this.$propertyList).off('blur').blur(function(){
            var $span = $(this).hide().prev('span');
            $span.show().focus().val($span.val());
        });

        //管道颜色选择
        $('#pipeColor .dropdown', this.$propertyList).off('click').on('click', 'li a', function () {
            if ($(this).hasClass('custom')) {
                $('#pipeColor input', this.$propertyList).trigger('click');
            } else {
                var opt = _this.store.model.option();
                opt.color = $(this).find('.colorSpan').css('backgroundColor');
                _this.store.model.option(opt, 'color');
            }
        });
        $('#pipeColor input', this.$propertyList).off('change').change(function () {
            var opt = _this.store.model.option();
            opt.color = this.value;
            _this.store.model.option(opt, 'color');
        });

        //水流动画样式选择
        $('#pipeAnimation .dropdown', this.$propertyList).off('click').on('click', 'li a', function () {
            var opt = _this.store.model.option();
            opt.pipeAnimation = Number($(this).find('.styleSpan').data('index'));
            _this.store.model.option(opt, 'pipeAnimation');
        });

        //管道水流方向选择
        $('#pipeFlowDirection input', this.$propertyList).off('change').on('change',function(){
            var opt = _this.store.model.option();
            if($(this).is(':checked')){
                opt.direction = 1;
            }else{
                opt.direction = 0;
            }
            _this.store.model.update({
                'option.direction': opt.direction
            });
        });

        //数据源接收
        var $dataSource = $('.dataSource');
        var $dropArea = $('.dropArea');
        var $dataSList = $('#dataSList');
        $dataSList.on('click', '.dropArea', function () {
            var $this = $(this);
            $this.find('.glyphicon-plus').hide();
            $this.find('input').show();
            $this.find('input').focus();
        }).on('blur', '.dropArea input', function (e) {
            _this.cloudPoint(e);
        });
        //拖拽数据源后的修改
        $dataSList.off('click','.dsText').on('click','.dsText',function(e){
            var $iptVal = $(this).text();
            $(this).hide().after('<input class="dsIpt" type="text" style="min-width:200px;border:none;">');
            $('.dsIpt').val($iptVal).focus().on('blur',function(e){
                if($iptVal != e.target.value){
                    var index = $('.divPorpertyBase').index($(e.target).closest('.divPorpertyBase'));
                    _this.cloudPoint(e,index);
                }
                if($(this).prev('.dsText').css('display') === 'none'){
                    $(this).hide();
                    $(this).prev('.dsText').text(e.target.value).show();
                }
            });
        });
        //调试值的修改
        $dataSList.off('change','.dsPreview').on('change','.dsPreview',function(){
            var $this = $(this);
            if(isNaN($this.val())){
                alert('调试值类型要为数字！');
                return;
            }
            var previewVal = $this.val();
            var previewArr = _this.store.model['option.preview']() || [];
            var index = $('.divPorpertyBase').index($this.closest('.divPorpertyBase'));
            previewArr[index] = previewVal;
            _this.store.model['option.preview'](previewArr);
        });
        $dataSList.on('drop', '.dropArea', function (e) {
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
                var arr = _this.store.model.idDs() || [];
                arr.push(dragName);
                _this.store.model.idDs(arr.slice());
            } else {
                var arr = _this.store.model.idDs() || [];
                arr.push(dragId);
                _this.store.model.idDs(arr.slice());
            }
            var previewArr = _this.store.model['option.preview']() || [];
            previewArr.push('');
            _this.store.model['option.preview'](previewArr);
            var trigger = _this.store.model['option.trigger']();
            if(!trigger || (Object.keys(trigger).length === 0)){
                _this.store.model['option.trigger']({ 0: "0", 1: "1" });
            }
            //var id = EventAdapter.getData().dsItemId;
            //_this.store.model.idDs(new Array(id));
        });
        $dataSList.on('dragenter', '.dataSource', function (e) {
            e.preventDefault();
        });
        $dataSList.on('dragover', '.dataSource', function (e) {
            e.preventDefault();
        });
        $dataSList.on('dragleave', '.dataSource', function (e) {
            e.preventDefault();
        });

        $dataSList.off('click', '.dataSource .btnRemoveDs').on('click', '.dataSource .btnRemoveDs', function (e) {
            var index = $(this).closest('.divPorpertyBase').index();
            var idDsArr = _this.store.model.idDs();
            var previewArr = _this.store.model['option.preview']();
            previewArr.splice(index, 1);
            idDsArr.splice(index, 1);
            _this.store.model.update({
                'idDs': idDsArr.concat(),
                'option.preview':previewArr.concat()
            })
        });
        $dataSList.on('dragover', '.dropArea', function (e) {
            e.preventDefault();
            $(e.currentTarget).addClass('dragover');
        });
        $dataSList.on('dragleave', '.dropArea', function (e) {
            e.preventDefault();
            $(e.currentTarget).removeClass('dragover');
        });

        //数据源逻辑选择
        var $liDataSourceLogic = $('#liDataSourceLogic',this.$propertyList);
        $liDataSourceLogic.find('input[name="inlineRadioOptions"]').off('change').on('change',function(){
            var curVal = $(this).val();
            _this.store.model.update({
                'option.logic': parseFloat(curVal)
            })
        });

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
            }else {
                $('#enumerateWrap').stop().slideUp();
                $(this).val('Show');
                $btnEnumerate.hide();
                $btnSaveEnumerate.hide();
            }
        }
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
                <div class="enumeratePart"><label class="enumerateLabel">key:</label><input class="enumerateKey"></div>\
                <div class="enumeratePart"><label class="enumerateLabel">value:</label><input class="enumerateVal"></div>\
                <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
                ');
            $ulEnumerate.append($li);
        };

        //删除枚举
        $('#enumerateWrap').off('click').on('click', '.btnRemove',function(){
            var enumerateKey= $(this).siblings().find('input.enumerateKey').val();
            if (enumerateKey) {
                delete _this.store.model['option.trigger']()[enumerateKey];
                _this.store.model.update({
                    'option.trigger': _this.store.model['option.trigger']()
                })
            }
            $(this).parent().remove();
            var $enumerateKeyS = $(".enumerateKey");
            if($enumerateKeyS.length == 0){
                $("#enumerateWrap").hide();
                $("#liEnumerateWrap").find("span.glyphicon").hide();
                _this.$propertyList.find('#ckbEnumerate').val('Show');
            }

            // _this.$propertyList.find('#ckbEnumerate').prop('checked', false);
        });
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.CanvasPipeProp = CanvasPipeProp;

} (window.widgets.factory.WidgetProp));

/** Canvas Image Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function CanvasPipePropModel() {
        PropModel.apply(this, arguments);
    }

    CanvasPipePropModel.prototype = Object.create(PropModel.prototype);
    CanvasPipePropModel.prototype.constructor = CanvasPipePropModel;

    CanvasPipePropModel.prototype.option = function (params, attr) {//attr可以为空
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
            for(var j in modelOpt){
                if(Array.isArray(modelOpt[j])){
                    var item = modelOpt[j].slice().toString();
                    if (opt[j].slice().toString() != item) {
                        opt[j] = [];
                    }
                }else{
                    if (opt[j] != modelOpt[j]) {
                        if (j === 'trigger') {
                            opt[j] = {};
                        } else {
                            opt[j] = '';
                        }
                    }
                }
            }
        }
        return opt;
    };
    ['idDs','option.trigger','option.points','option.direction','option.preview','option.logic'].forEach(function(type){
        CanvasPipePropModel.prototype[type] = function (params) {
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
    //CanvasPipePropModel.prototype.idDs = function (params) {
    //    var v;
    //    if(params) {
    //        this._setProperty('idDs', params);
    //        return true;
    //    }
    //    if((v = this._isPropertyValueSame('idDs') ) !== false ) {
    //        return v;
    //    }
    //};

    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.CanvasPipePropModel = CanvasPipePropModel;

} (window.widgets.propModels.PropModel));