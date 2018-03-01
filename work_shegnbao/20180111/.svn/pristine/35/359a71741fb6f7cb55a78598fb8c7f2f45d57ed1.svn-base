/**
 * Created by vicky on 2016/4/18.
 */
(function(win){
    var _this = undefined;
    var paramType = {
        TEXT: {
            value: 0,
            name: 'Text'
        }
    };
    function AddByTplModal(){
        _this = this;
        this.$addByTplModal = undefined;
        this.template = undefined;
        this.callback = undefined;
        this._gTplContent = null;
        this.map = {};
        this.step = 1;
        this.sliceData = null;
    }

    AddByTplModal.prototype.show = function (template, type, callback) {
        this.template = $.extend(true, {}, template);
        this.callback = callback;
        if($('#addByTplModal').length === 0){
            WebAPI.get('/static/app/WebFactory/scripts/screens/page/modals/addByTplModal/addByTplModal.html').done(function (resultHTML) {
                $('#mainframe').parent().append(resultHTML);
                _this.$wrap = $('#addByTplModalWrap');
                I18n.fillArea($('#addByTplModalWrap').fadeIn());
                _this.$addByTplModal = $('#addByTplModal', _this.$wrap);
                _this.init(type);
                _this.$addByTplModal.modal('show');
                _this.$addByTplModal.on('hidden.bs.modal',function(e){
                    _this.close();
                    e.stopPropagation();
                });
            })
        }else{
            this.init(type);
            _this.$addByTplModal.modal('show');
            _this.$addByTplModal.off('hidden.bs.modal').on('hidden.bs.modal',function(e){
                _this.close();
                 e.stopPropagation();
            });
        }
    };

    AddByTplModal.prototype.init = function (type) {
        var activeNav = $('.navBar', _this.$addByTplModal);
        activeNav.children('li').removeClass('active').eq(0).addClass('active');
        //通过type判断模式
        if(type === 1){//批量
            $('.single', this.$addByTplModal).hide();
            $('.batch', this.$addByTplModal).show();
            //$('#iptReplace').prop('placeholder', '如:33<#x#>')
        }else{//单个
            $('.single', this.$addByTplModal).show();
            $('.batch', this.$addByTplModal).hide();
            //$('#iptReplace').prop('placeholder', '如:332')
        }
        $('input', this.$addByTplModal).val('');
        $('#iptTplName', this.$addByTplModal).text(this.template.name);

        this.attachEvent();
    };

    AddByTplModal.prototype.close = function(){
        this._gTplContent = null;
        this.map = {};
        this.step = 1;
        this.sliceData = null;
        $('#btnBack',_this.$addByTplModal).hide();
        $('#firstStep', _this.$addByTplModal).show().siblings().hide();
    };

    AddByTplModal.prototype.attachEvent = function () {
        var names = [];
        var namePostfix = [];
        var pageInfo = [];
        var activeNav = $('.navBar', _this.$addByTplModal);
        //下一步
        $('#buttonOk', this.$addByTplModal).off('click').on('click',function(){
            if(!_this.template.content.template) {
                alert(I18n.resource.admin.welcom.addByTpl.TEMP_DATA_FAIL);
                return;
            }
            var pageNameVal = $('#iptPageName', _this.$addByTplModal).val().trim();
            var pageNameBatchVal = $('#iptPageNameBatch', _this.$addByTplModal).val().trim();
            var placeBatchVal = $('#iptPlaceBatch', _this.$addByTplModal).val().trim();
            if(_this.step === 1){
            //多个增加
                if($('.single', _this.$addByTplModal).is(':hidden')){
                    // 占位符未填写错误提示
                    if(!placeBatchVal) {
                        infoBox.alert(I18n.resource.admin.welcom.addByTpl.PLACEHOLDER_NONE);
                        return;
                    }
                    // 页面名称未填写错误提示
                    if (!pageNameBatchVal) {
                        infoBox.alert(I18n.resource.admin.welcom.addByTpl.PAGE_NAME_NONE);
                        return;
                    }
                    var NameData = _this.getNameList(names,namePostfix);
                    names = NameData.names;
                    namePostfix = NameData.namePostfix;
                    names.forEach(function(name,index){
                        pageInfo.push(_this.newPageByTpl(name,namePostfix, index))
                    });
                }else{//单个增加
                    if(!pageNameVal) {
                        infoBox.alert(I18n.resource.admin.welcom.addByTpl.PAGE_NAME_NONE);
                        return;
                    }
                    pageInfo.push(_this.newPageByTpl($('#iptPageName').val().trim()))
                }
                var arrLayer = [];
                var arrWidget = [];
                var arrPage = [];
                pageInfo.forEach(function(pageCfg){
                    arrPage.push(pageCfg.page);
                    arrLayer = arrLayer.concat(pageCfg.layers);
                    arrWidget = arrWidget.concat(pageCfg.widgets);
                });
                _this._gTplContent = {
                    pages:arrPage,
                    layers:arrLayer,
                    widgets:arrWidget
                };
                //复制数据
                _this.sliceData = $.extend(true,{},_this._gTplContent);
                var variables = [];
                var params = [];
                if(_this._gTplContent.pages[0].option.variables){
                    variables = _this._gTplContent.pages[0].option.variables;
                    for(var k in variables){
                        params.push({
                            name: k,
                            value: variables[k].val,
                            descr: variables[k].descr
                        })
                    }
                }else{
                    params = _this.getTplParams();
                    if(params[0]){
                        params.forEach(function(row){
                            variables[row.name] = {
                                val:row.value,
                                descr:''
                            }
                        });
                    }else{
                        params = [];
                    }
                }
                var map = {};
                params.forEach(function (row) {
                    var name = row['name'];
                    if ( _this.map.hasOwnProperty(name) ) {
                        map[name] = _this.map[name];
                    } else {
                        map[name] = {
                            type: paramType.TEXT.value,
                            value: typeof row['value'] === 'undefined' ? '' : row['value'],
                            descr: typeof row['descr'] === 'undefined' ? '' : row['descr']
                        };
                    }
                });
                _this.map = map;
                // 更新视图
                _this.render();
                $('#btnBack',_this.$addByTplModal).show();
                $('#twoStep', _this.$addByTplModal).show().siblings().hide();
            }else if(_this.step === 2){
                _this.apply();
                $('#thirdStep', _this.$addByTplModal).show().siblings().hide();
                $(this).text(I18n.resource.admin.welcom.addByTpl.ACCOMPLISH);
            }else if(_this.step === 3){
                _this.newPageByIds(namePostfix);
                _this.callback(pageInfo);
                _this.$addByTplModal.modal('hide');
                $('#firstStep', _this.$addByTplModal).show().siblings().hide();
                $(this).text(I18n.resource.admin.welcom.addByTpl.NEXT_STEP);
            }
            activeNav.children('li').removeClass('active').eq(_this.step).addClass('active');
            _this.step++;
        });
        $('#twoStep', _this.$addByTplModal).on('change', 'input', function (e) {
            var data = $(this).serializeArray()[0];
            var p = {};
            p[data.name] = _this.layoutName(data);
            _this.setMap(p);
            e.stopPropagation();
        });
        $('#btnBack', _this.$addByTplModal).off('click').on('click', function (e) {
            _this.step--;
            activeNav.children('li').removeClass('active').eq(_this.step-1).addClass('active');
            if(_this.step === 1){
                 if($('.single', _this.$addByTplModal).is(':hidden')){
                     names = [];
                     namePostfix = [];
                 }
                pageInfo = [];
                $('#firstStep', _this.$addByTplModal).show().siblings().hide();
                $('#btnBack',_this.$addByTplModal).hide();
            }else if(_this.step === 2){
                _this._gTplContent = _this.sliceData;
                $('#twoStep', _this.$addByTplModal).show().siblings().hide();
                $('#btnBack',_this.$addByTplModal).show();
                $('#buttonOk', _this.$addByTplModal).text(I18n.resource.admin.welcom.addByTpl.NEXT_STEP);
            }
        });
    };
    AddByTplModal.prototype.getNameList = function(names,namePostfix){
        var input = $('#iptPageNameBatch').val().trim();
        var replaceVal = $('#iptReplace', _this.$addByTplModal).val().trim();
        var isMultiReplace = false;
        try {
            var config = $("#iptPlaceBatch").val().trim();//if the input is a valid JSON string or need to convert to a valid one
            config = config.replace((/([\w]+)(:)/g), "\"$1\"$2"); //add "" before : if doesnt exist
            config = config.replace((/'/g), "\"");  //replace '' with ""
            if (config == '') {
                alert(I18n.resource.admin.welcom.addByTpl.BATCH_PAGE_NAME_CFG_NONE);
                return names;
            } else {
                var nameConfig = JSON.parse(config);
                for (var item in nameConfig) {
                    if (nameConfig.hasOwnProperty(item)) {
                        var reg = new RegExp('<#' + item + '#>', 'g');
                        //判断替换点名是否需要批量
                        if(replaceVal.match(reg)){
                            isMultiReplace = true;
                        }
                        if (Object.prototype.toString.call(nameConfig[item]).slice() === '[object Array]') {
                            //confing in array
                            for (var j = 0; j < nameConfig[item].length; j++) {
                                if (names.length !== nameConfig[item].length) {
                                    names.push(input.replace(reg, nameConfig[item][j]));
                                } else {
                                    names[j] = names[j].replace(reg, nameConfig[item][j]);
                                }
                                isMultiReplace && namePostfix.push(nameConfig[item][j]);
                            }
                        } else {
                            //config in obj
                            var min = parseInt(nameConfig[item]["min"]);
                            var max = parseInt(nameConfig[item]["max"]);
                            var step = parseInt(nameConfig[item]["step"]) || 1;
                            for(var k = min; k <= max; k = k+step){
                                names.push(input.replace(reg, k));
                                isMultiReplace && namePostfix.push(k);
                            }
                        }
                    }
                }
            }
        } catch(e){

        }
        return {
            names:names,
            namePostfix:namePostfix
        };
    };

    AddByTplModal.prototype.newPageByTpl = function(name,namePostfix, index){
        var tplDsVal = $('#iptTplDs', _this.$addByTplModal).val().trim();
        var replaceVal = $('#iptReplace', _this.$addByTplModal).val().trim();
        var template = _this.template;
        var content = template.content;
        var data = JSON.parse(content.template);
        var newPage;
        // 维护 id-value map，方便后面查询使用
        var idExchageMap = {};

        data.layers = data.layers || [];
        data.widgets = data.widgets || [];

        // 兼容老数据
        (function () {
            if (!data.list || !data.list.length) {
                data.list = data.list || [];
                data.layers.forEach(function (row) {
                    if (!row.parentId) {
                        data.list.push(row._id);
                    }
                });
                data.widgets.forEach(function (row) {
                    if (!row.layerId) {
                        data.list.push(row._id);
                    }
                });
            }
        } ());

        newPage = {
            page: {
                _id: ObjectId(),
                width: content.width,
                height: content.height,
                display: content.display,
                pic: content.pic,
                option: $.extend(true,{},content.option),
                text: name,
                layerList: [],
                isHide: 0,
                isLock: 0,
                parent: ''
            },
            layers: data.layers,
            widgets: data.widgets
        };

        // 将 id 都换成新的
        (function () {
            data.layers.forEach(function (row) {
                var newId = ObjectId();

                idExchageMap[row._id] = newId;
                row._id = newId;

                row.pageId = newPage.page._id;
            });
            var changeIdArr = [];
            //先CanvasHeat
            data.widgets.forEach(function (row) {
                var newId = ObjectId();
                if (row.type === 'CanvasHeat') {
                    changeIdArr.push([row._id, newId]);
                    idExchageMap[row._id] = newId;
                    row._id = newId;

                    row.pageId = newPage.page._id;
                    if (row.layerId && idExchageMap[row.layerId]) {
                        row.layerId = idExchageMap[row.layerId];
                    } else {
                        if (row.layerId) {
                            console.warn('One widget can not find its parent layer when import from template, we had put it in the root layer. \nWidget id: ' + row._id + '\nLayer id: ' + row.layerId);
                        }
                        row.layerId = '';
                    }
                }
            });
            //再CanvasHeatP
            data.widgets.forEach(function (row) {
                var newId = ObjectId();
                if (row.type !== 'CanvasHeat') {
                    if(row.type === 'CanvasHeatP'){
                        for (var i = 0, len = changeIdArr.length; i < len;i++){
                            if (row.option.polygonId === changeIdArr[i][0]) {
                                row.option.polygonId = changeIdArr[i][1];
                            }
                        }
                    }
                    idExchageMap[row._id] = newId;
                    row._id = newId;

                    row.pageId = newPage.page._id;
                    if (row.layerId && idExchageMap[row.layerId]) {
                        row.layerId = idExchageMap[row.layerId];
                    } else {
                        if (row.layerId) {
                            console.warn('One widget can not find its parent layer when import from template, we had put it in the root layer. \nWidget id: ' + row._id + '\nLayer id: ' + row.layerId);
                        }
                        row.layerId = '';
                    }
                }
            });

            // 更新根节点的 list
            (function () {
                var ids = [];
                data.list.forEach(function (row) {
                    if (idExchageMap[row]) {
                        ids.push(idExchageMap[row]);
                    }
                });
                newPage.page.layerList = data.list = ids;
            } ());

            // 更新 parentId 和 list
            data.layers.forEach(function (row) {
                var ids = [];

                if (row.parentId && idExchageMap[row.parentId]) {
                    row.parentId = idExchageMap[row.parentId];
                } else {
                    if (row.parentId) {
                        console.warn('Can not find parent layer.\nLayer id: ' + row._id + '\nParent id: ' + row.parentId);
                    }
                    row.parentId = '';
                }
                row.list.forEach(function (item) {
                    if (idExchageMap[item]) {
                        ids.push(idExchageMap[item]);
                    }
                });
                row.list = ids;
            });
        } ());

        //替换 查找字符不为空
        if(tplDsVal && data.widgets && data.widgets.length){
            //如何点名也需要替换
            var replace = replaceVal;
            if(namePostfix.length > 0){
                replace =  replaceVal.split('<#')[0] + namePostfix[index];
            }
            data.widgets.forEach(function(widget){
                if(widget.type == 'HtmlContainer') {
                    _this.replaceHtml(tplDsVal, replace, widget);
                } else if(widget.type == 'HTMLScreenContainer') {

                } else {
                    _this.replaceId(tplDsVal, replace, widget);
                }
            });
        }
        return newPage;
    };
    AddByTplModal.prototype.newPageByIds = function(namePostfix){
         var tplDsVal = $('#iptTplDs', this.$addByTplModal).val().trim();
         var replaceVal = $('#iptReplace', this.$addByTplModal).val().trim();
        //替换 查找字符不为空
        if(tplDsVal && this._gTplContent.widgets && this._gTplContent.widgets.length){
            //如何点名也需要替换
            var replace = replaceVal;
            if(namePostfix.length>0){
                replace =  replaceVal.split('<#')[0] + namePostfix[index];
            }
            this._gTplContent.widgets.forEach(function(widget){
                if(widget.type == 'HtmlContainer') {
                    _this.replaceHtml(tplDsVal, replace, widget);
                } else if(widget.type == 'HTMLScreenContainer') {

                } else {
                    _this.replaceId(tplDsVal, replace, widget);
                }
            });
        }
    };
    AddByTplModal.prototype.replaceId = function replaceId(oldId, newId, widget){
        if(!widget.idDs) return;
        widget.idDs.forEach(function(id,index){
            var reg = new RegExp(oldId, 'mg');
            widget.idDs[index] = widget.idDs[index].replace(reg, newId);
        });
    };
    AddByTplModal.prototype.replaceHtml = function replaceHtml(oldStr, newStr, widget){
        if(!widget.option || !widget.option.html) return;
        var reg = new RegExp(oldStr, 'mg');
        widget.option.html = widget.option.html.replace(reg, newStr);
    };
    // 报表模板参数接口 - 开始
    // 获取模板中的模板参数
    AddByTplModal.prototype.getTplParams = function () {
        var options = this._gTplContent.widgets;
        var params = [];
        options.forEach(function(row){
            var arr = namespace('widgets.factory.'+row.type).prototype.getTplParams(row);
            params = params.concat(arr);
        });
        return params;
    };

    // 应用
    AddByTplModal.prototype.applyTplParams = function (params) {
        try{
            var widgets,reg,strNew;
            var pages = this._gTplContent.pages;
            if(pages.length === 1){
                widgets = this._gTplContent.widgets;
                for(var i in params){
                    reg = new RegExp('<#' + i + '#>','mg');
                    strNew = params[i];
                    widgets.forEach(function(row){
                        row = namespace('widgets.factory.'+row.type).prototype.applyTplParams({reg:reg,strNew:strNew,widget:row});
                    });
                    if(pages[0].option.variables){
                        pages[0].option.variables[i].val = strNew;
                    }
                }
            }else if(pages.length > 1){
                widgets = this._gTplContent.widgets;
                for(var i in params){
                    reg = new RegExp('<#' + i + '#>','mg');
                    strNew = params[i];
                    if(!(strNew instanceof Array)){
                        strNew = [strNew];
                    }
                    var len = widgets.length;
                    var add = 0;
                    strNew.forEach(function(row,j){
                        var index = (len/pages.length)*(j+1);
                        if(index > widgets.length){
                            return;
                        }
                        for(var k = index - len/pages.length; k<index;k++){
                            widgets[k] = namespace('widgets.factory.'+widgets[k].type).prototype.applyTplParams({reg:reg,strNew:strNew[add],widget:widgets[k]});
                        }
                        if(pages[add].option.variables){
                            pages[add].option.variables[i].val = strNew[add];
                        }
                        add++;
                    });
                    if(add*(len/pages.length) < len){
                        for(var m = add*(len/pages.length); m<len;m++){
                            widgets[m] = namespace('widgets.factory.'+widgets[m].type).prototype.applyTplParams({reg:reg,strNew:strNew[add-1],widget:widgets[m]});
                        }
                        for(var g = add;g<pages.length;g++){
                            if(pages[g].option.variables){
                                pages[g].option.variables[i].val = strNew[add-1];
                            }
                        }
                    }
                }
            }
        }catch (e){
            console.log('应用模板失败');
        }
    };
    AddByTplModal.prototype.setMap = function (params) {
        var _this = this;
        Object.keys(params).forEach(function (key) {
            _this.map[key].value = params[key];
        });
    };
    AddByTplModal.prototype.__getTplParams = function () {
        var _this = this;
        var params = {};

        Object.keys(this.map).forEach(function (key) {
            params[key] = _this.map[key].value;
        });

        return params;
    };
    AddByTplModal.prototype.layoutName = function (data){
        var str = data.value.trim();
        str = str.replace((/([\w]+)(:)/g), "\"$1\"$2");//add "" before : if doesnt exist
        str = str.replace((/'/g), "\"");  //replace '' with ""
        if(str.split('[').length === 1 && str.split('{').length === 1){
            return str;
        }else{
            var arr = JSON.parse(str);
            if(Object.prototype.toString.call(arr) === "[object Array]"){
                return arr;
            }else if(Object.prototype.toString.call(arr) === "[object Object]"){
                var newArr = [];
                var min = parseInt(arr["min"]);
                var max = parseInt(arr["max"]);
                var step = parseInt(arr["step"]) || 1;
                for(var k = min; k <= max; k = k+step){
                    newArr.push(k);
                }
                return newArr;
            }
        }
    };
    AddByTplModal.prototype.apply = function () {
        var params = this.__getTplParams();

        this.applyTplParams(params);
    };
    AddByTplModal.prototype.render = (function () {
        function getSelectTpl(type) {
            return '<select>' +
                Object.keys(paramType).map(function (key) {
                    if (type === paramType[key].value) {
                        return '<option value="{value}" selected>{name}</option><option value="1">Json</option>'.formatEL(paramType[key]);
                    } else {
                        return '<option value="{value}">{name}</option><option value="1">Json</option>'.formatEL(paramType[key]);
                    }
                }) + '</select>';
        }
        function getRowTpl(type) {
            return '<tr>\
                    <td>{name}</td>\
                    <td>' + getSelectTpl(type) + '</td>\
                    <td>{value}</td>\
                    <td>{descr}</td>\
                </tr>';
        }
        function getValueTpl(name, type, value) {
            return '<input type="text" class="iptPram"  name="'+name+'" value="'+(value || '')+'" />';
        }
        return function () {
            var _this = this;

            var items = Object.keys(this.map).map(function (p) {
                var row = _this.map[p];

                return getRowTpl(row.type).formatEL({
                    name: p,
                    value: getValueTpl(p, row.type, row.value),
                    descr:row.descr
                });
            });

            if (items.length) {
                $('#twoStep', _this.$addByTplModal).find('tbody').html(items);
                $('.iptPram').attr('placeholder', I18n.resource.report.templateConfig.WRITE_VALUE);
            } else {
                $('#twoStep', _this.$addByTplModal).find('tbody').html('<tr><td colspan="4" class="pramNo">无参数</td></tr>');
                $('.pramNo').text(I18n.resource.report.templateConfig.NO_PRAM);
            }
        }
    } ());

    // 报表模板参数接口 - 结束

    win.AddByTplModal = new AddByTplModal();
}(window));