/**
 * Created by vicky on 2016/4/18.
 */
(function(win){
    var _this = undefined;
    function AddByTplModal(){
        _this = this;
        this.$addByTplModal = undefined;
        this.template = undefined;
        this.callback = undefined;
    };

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
                    //_this.close();
                    e.stopPropagation();
                });
            })
        }else{
            this.init(type);
            _this.$addByTplModal.modal('show');
            _this.$addByTplModal.off('hidden.bs.modal').on('hidden.bs.modal',function(e){
                //_this.close();
                 e.stopPropagation();
            });
        }
    };

    AddByTplModal.prototype.init = function (type) {
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

    };

    AddByTplModal.prototype.attachEvent = function () {
        $('#buttonOk', this.$addByTplModal).off('click').on('click', function(){
            var arrPage = [];
            var tplDsVal = $('#iptTplDs', _this.$addByTplModal).val().trim();
            var replaceVal = $('#iptReplace', _this.$addByTplModal).val().trim();
            var pageNameBatchVal = $('#iptPageNameBatch', _this.$addByTplModal).val().trim();
            var placeBatchVal = $('#iptPlaceBatch', _this.$addByTplModal).val().trim();
            var pageNameVal = $('#iptPageName', _this.$addByTplModal).val().trim();
            var names = [];
            var namePostfix = [];
            var isMultiReplace = false;

            if(!_this.template.content.template) {
                alert(I18n.resource.admin.welcom.addByTpl.TEMP_DATA_FAIL);
                return;
            }
            var tpl = JSON.parse(_this.template.content.template);

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
                names = getNameList();
                names.forEach(function(name, index){
                    arrPage.push(newPageByTpl(name, index))
                });
            }else{//单个增加
                if(!pageNameVal) {
                    infoBox.alert(I18n.resource.admin.welcom.addByTpl.PAGE_NAME_NONE);
                    return;
                }
                arrPage.push(newPageByTpl($('#iptPageName').val().trim()))
            }


            _this.callback(arrPage);
            _this.$addByTplModal.modal('hide');

            function replaceId(oldId, newId, widget){
                if(!widget.idDs) return;
                widget.idDs.forEach(function(id,index){
                    var reg = new RegExp(oldId, 'mg');
                    widget.idDs[index] = widget.idDs[index].replace(reg, newId);
                });
            }

            function replaceHtml(oldStr, newStr, widget){
                if(!widget.option || !widget.option.html) return;
                var reg = new RegExp(oldStr, 'mg');
                widget.option.html = widget.option.html.replace(reg, newStr);
            }

            function newPageByTpl(name, index) {
                var cloneTpl = $.extend(true, {}, tpl);
                var template = _this.template;
                var content = template.content;
                var data = JSON.parse(content.template);
                var newPage;
                var layerMap, widgetMap;
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
                } ())
                
                newPage = {
                    page: {
                        _id: ObjectId(),
                        width: content.width,
                        height: content.height,
                        display: content.display,
                        pic: content.pic,
                        option: content.option,
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
                    if(isMultiReplace){
                        replace =  replaceVal.split('<#')[0] + namePostfix[index];
                    }
                    data.widgets.forEach(function(widget){
                        if(widget.type == 'HtmlContainer') {
                            replaceHtml(tplDsVal, replace, widget);
                        } else if(widget.type == 'HTMLScreenContainer') {

                        } else {
                            replaceId(tplDsVal, replace, widget)
                        }
                    });
                }
                return newPage;
            }

            function getNameList(){
                var input = $('#iptPageNameBatch').val().trim();
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
                return names;
            }
        })
    };

    win.AddByTplModal = new AddByTplModal();
}(window));