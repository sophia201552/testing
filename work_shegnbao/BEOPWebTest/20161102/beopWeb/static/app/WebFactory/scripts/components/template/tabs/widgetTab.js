;(function (exports, SuperClass) {
    var clickTimer = null;
    var CLICK_DELAY = 500;

    function WidgetTab() {
        SuperClass.apply(this, arguments);
    }

    WidgetTab.prototype = Object.create(SuperClass.prototype);
    WidgetTab.prototype.constructor = WidgetTab;

    +function () {
        this.groupItemGroup = '<div class="tpl-item group-item pageBox" draggable="true" id="{_id}" data-id="{_id}" data-type="widget" data-groupid ="{group}">\
        <div class="pageName"><span class="glyphicon glyphicon-folder-open"></span><span class="item-name">{name}</span></div>\
        <div class="pageCreator"><span class="pageText">{creator}</span></div>\
        <div class="pageTime"><span class="pageText">{time}</span></div>\
                            <span class="slider-cb-wrap"><i class="slider-cb"></i></span></div>';
        this.upGroup = '<div class="tpl-item upGroup pageBox" data-type="{type}" data-id="{_id}" data-groupid ="{group}" data-parent-group-id="{parentGroupId}"><span class="glyphicon glyphicon-chevron-left"></span>\
        <span class="group-item-name" title="...">...</span></div>';
        /** @override */
        this.tabOptions = {
            title:'<div class="divTab"><span class="glyphicon glyphicon-th-large"></span>Widget</div><ul id="treeWidgetTemplate" class="ztree treeTemplate" style="display: none;"></ul>',
            itemTpl: '<div class="child-item tpl-item pageBox" draggable="true" id="{_id}" data-type="widget" data-id="{_id}" data-groupid ="{group}">\
                            <div class="pageName"><span class="glyphicon glyphicon-file"></span><span class="item-name">{name}</span></div>\
                            <div class="pageBody"><div class="pageCreator"><span class="pageText">{creator}</span></div>\
                            <div class="pageTime"><span class="pageText">{time}</span></div>\
                            <div class="pageType" style="display:none;"><span class="pageText">{type}</span></div>\
                            <span class="slider-cb-wrap"><i class="slider-cb"></i></span></div></div>',
            toolsTpl: '<div class="paneTempButton">\
                    <div class="addTempate" title="Add Widget"><span class="glyphicon glyphicon-file"></span></div>\
                    <div class="addGroup" title="Add Folder"><span class="glyphicon glyphicon-folder-open"></span></div>\
                    <div class="divEdit" title="Edit Widget" style="display:none;"><span class="glyphicon glyphicon-edit"></span></div>\
                    <div class="divDelete" title="Remove" style="display:none;"><span class="glyphicon glyphicon-trash"></span></div>\
                    <div class="col-sm-4 divSearch"><div class="input-group"><input type="text" class="form-control iptSearch" placeholder="Search for name!"><span class="spanSearch"><span class="glyphicon glyphicon-search" aria-hidden="true"></span><span class="glyphicon glyphicon-remove" aria-hidden="true" style="display:none;"></span></span></div></div>\
                </div>',
            dataUrl: function () {
                var url = 'factory/material/group/widget';
                if (this.options.filter) {
                    return url + '.' + this.options.filter;
                }
                return url;
            }
        };
        /** @override */
        this.attachEvents = function () {
            var _this = this;
            var $tabContent = $('#tabContent', this.domWrap);
            var $templateLeft = $('#templateLeft', this.domWrap);
            $tabContent.off('dblclick','.group-item').on('dblclick','.group-item',function(){
                _this.slider(this);
            });
            $tabContent.off('dragstart', '.tpl-item').on('dragstart', '.tpl-item', _this.drag().start);
            $tabContent.off('dragend', '.tpl-item').on('dragend', '.tpl-item', _this.drag().end);
            $tabContent.off('dragover', '.tpl-item.group-item,.tpl-item.upGroup').on('dragover', '.tpl-item.group-item,.tpl-item.upGroup', _this.drag().over);
            $templateLeft.off('dragover','#treeWidgetTemplate li a').on('dragover','#treeWidgetTemplate li a', _this.drog().over);
            $tabContent.off('dragenter', '.tpl-item.group-item,.tpl-item.upGroup').on('dragenter', '.tpl-item.group-item,.tpl-item.upGroup', _this.drag().enter);
            $templateLeft.off('dragenter','#treeWidgetTemplate li a').on('dragenter','#treeWidgetTemplate li a', _this.drog().enter);
            $tabContent.off('dragleave', '.tpl-item').on('dragleave', '.tpl-item', _this.drag().leave);
            $templateLeft.off('dragleave','#treeWidgetTemplate li a').on('dragleave','#treeWidgetTemplate li a', _this.drog().leave);
            $tabContent.off('drop', '.tpl-item.group-item,.tpl-item.upGroup').on('drop', '.tpl-item.group-item,.tpl-item.upGroup', _this.drag().drop);
            $templateLeft.off('drop','#treeWidgetTemplate li a').on('drop','#treeWidgetTemplate li a', _this.drog().drop);
            $tabContent.off('click','.pageBox .pageName').on('click', '.pageBox .pageName', function (e) {
                var $this = $(this);
                var ipt;
                var $item = $this.parent('.tpl-item');


                if (!$item.hasClass('active')){
                    clickTimer = window.setTimeout(function () {
                        window.clearTimeout(clickTimer);
                        clickTimer = null;
                    }, CLICK_DELAY);
                    return;
                }
                if (clickTimer) {
                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                    if($item.hasClass('group-item')){
                        _this.slider($item[0]);
                    }else{
                        _this.editWidgetBox();
                    }
                    return;
                }

                if($item.attr('id') != ''){
                    if(typeof _this.permission($item) === 'string'){
                        alert(_this.permission($item));
                        return;
                    }
                }
                clickTimer = window.setTimeout(function () {
                    // 重命名
                    var $spName = $this.find('.item-name');
                    // rename 逻辑
                    ipt = document.createElement('input');
                    ipt.className = 'ipt-name-editor';
                    ipt.value = $spName.text();
                    ipt.onblur = function () {
                        $tabContent.on('dblclick','.group-item',function(){
                            _this.slider(this);
                        });
                        $tabContent.find('.tpl-item').prop('draggable',true);
                        var params = {};
                        // 如果名称有变动，或者是第一次新建，则进行更新
                        if (this.value !== $spName.text() ||
                            !$this.closest('.pageBox')[0].dataset.id) {
                            params = {
                                _id: $this.closest('.pageBox')[0].dataset.id,
                                name: this.value
                                //type: 'widget'
                            };
                            _this.modifyGroupItem(params);
                            $this.closest('.pageBox').attr('id',params._id);
                            $this.closest('.pageBox')[0].dataset.id = params._id;
                            $this.closest('.pageBox')[0].dataset.groupid = params.group;
                        }
                        $spName.text(this.value);
                        this.parentNode.removeChild(this);
                        $spName.show();
                    };
                    ipt.onkeyup = function (e) {
                        if (e.which === 13) {
                            this.blur();
                        }
                    };
                    ipt.onclick = function (e) {
                        e.stopPropagation();
                    };

                    $spName.hide();
                    $this.append(ipt);
                    ipt.onfocus = function(e){
                        e.stopPropagation();
                        $tabContent.off('dblclick','.group-item');
                        $tabContent.find('.tpl-item').prop('draggable',false);
                    };
                    ipt.focus();

                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                }, CLICK_DELAY);
            });
            $tabContent.off('dblclick','.pageBody').on('dblclick','.pageBody',function(){
                _this.editWidgetBox();
            });

            if (this.options.allowUse) {
                $tabContent.off('click','.pageBox .pageName');
                $tabContent.off('dblclick','.pageBody');
                $tabContent.off('dblclick', '.child-item').on('dblclick', '.child-item', function (e) {
                    var id = this.dataset.id;
                     var data = {ids:[id]};
                    WebAPI.post('/factory/material/getByIds',data).done(function(result){
                       // 测试confirm
                        confirm(I18n.resource.mainPanel.materalPanel.buttonMateral.USE_COPY, function () {
                            typeof _this.options.callback === 'function' &&
                            _this.options.callback(result[0], true);
                        }, function () {
                            typeof _this.options.callback === 'function' &&
                            _this.options.callback(result[0], false);
                        });
                    });
                    _this.screen.close();
                });
            }

            this.attachToolEvents();
        };

        this.attachToolEvents = function () {
            var _this = this;
            var $tabName = $('#tabName', this.domWrap);
            var $tabContent = $('#tabContent', this.domWrap);
            var $templateTabs = $('#templateTabs', this.container);
            // 新增模板
            $tabName.find('.addTempate').off('click').click(function () {
                var $widgitNameModal = $('<div class="modal fade" id="widgitNameModal">\
                  <div class="modal-dialog">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                        <h4 class="modal-title">Widget</h4>\
                      </div>\
                      <div class="modal-body">\
                            <div class="form-group form-goupCy">\
                                <label for="widgetName" class="col-sm-2 control-label">Name:</label>\
                                <div class="col-sm-10">\
                                    <input type="text" class="form-control" id="widgetName" placeholder="Please input template name">\
                                </div>\
                            </div>\
                            <div class="form-group form-goupCy">\
                                <label for="widgetType" class="col-sm-2 control-label">Type:</label>\
                                <div class="col-sm-10">\
                                    <select class="form-control" id="widgetType"><option value="text">TextWidget</option><option value="button">ButtonWidget</option><option value="htmlContainer">HTMLContainerWidget</option><option value="htmlScreenContainer">HTMLScreenContainerWidget</option></select>\
                                </div>\
                            </div>\
                            <div class="form-group" id="wrongInfo">\
                            </div>\
                      </div>\
                      <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\
                        <button type="button" class="btn btn-primary" id="nameSub">Ok</button>\
                      </div>\
                    </div>\
                  </div>\
                </div>');
                $('#widgitNameModal').remove();
                $(document.body).append($widgitNameModal);
                I18n.fillArea($widgitNameModal);
                $widgitNameModal.modal('show');
                $('#nameSub').on('click',function () {
                    var widgetName = $('#widgetName').val();
                    var widgetType = 'widget.HtmlText';
                    var widgetTypeSign = $('#widgetType').val();
                    if (widgetTypeSign === 'text') {
                        widgetType = 'widget.HtmlText';
                    } else if (widgetTypeSign === 'button') {
                        widgetType = 'widget.HtmlButton';
                    } else if (widgetTypeSign === 'htmlContainer') {
                        widgetType = 'widget.HtmlContainer';
                    }else if(widgetTypeSign === 'htmlScreenContainer'){
                         widgetType = 'widget.HtmlScreenContainer';
                    }
                    if (widgetName === '') {
                        alert('Please input template name!');
                    } else {
                        $widgitNameModal.modal('hide');
                        var _id = ObjectId();
                        var data = {
                            _id: _id,
                            name: widgetName,
                            content: (widgetTypeSign === 'text' || widgetTypeSign === 'button') ? { html: '', style: '', js: '' } : { html: '', css: '', js: '' },
                            creator: AppConfig.userProfile.fullname,
                            time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                            group: $('.upGroup', this.container).length === 0?'':$('.upGroup', this.container)[0].dataset.groupid,
                            isFolder: 0,
                            'public': 1,
                            type: widgetType
                        };
                        $tabContent.append($(_this.tabOptions.itemTpl.formatEL(data)));
                        WebAPI.post('/factory/material/save', data).done(function (result) {
                            if (result.status === 'OK') {
                                _this.store.push(data);
                                _this.treeObj.addNodes(_this.treeObj.getNodeByParam('id',data.group),_this.generateTreeEx([data]),true);
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
                                        //if (result.status === 'OK') {
                                        //    $templateTabs.find('.liCheck').trigger('click');
                                        //}
                                    }).always(function () {

                                    });
                                });
                            } else {
                                alert(result.msg || 'There are files with the same!');
                            }
                        });
                    }
                });
            });
            //新增文件夹
            $tabName.find('.addGroup').off('click').click(function(){
                _this.addGroupItem();
            });
            //编辑控件
            $tabName.find('.divEdit').off('click').click(function () {
                _this.editWidgetBox();
            });
        };

        this.editWidgetBox=function(){
            var _this=this;
            var $tabContent = $('#tabContent', this.domWrap);
            var $active = $tabContent.find('.active');
            if(typeof _this.permission($active) === 'object'){
                var data = _this.permission($active);
                WebAPI.post('/factory/material/getByIds',data).done(function(result){
                    var widget = result[0];
                    var content = widget.content;
                    var type = 'html';

                    if (widget.type.indexOf('HtmlContainer') === -1) {
                        content = {
                            css: content['style'] || ''
                        };
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
                            _id: widget._id,
                            content: widget.content
                        };
                        WebAPI.post('/factory/material/edit', data).done(function(result) {

                        }).fail(function () {

                        });
                    });
                })
            }else{
                alert(_this.permission($active));
            }
        };

        this.addGroupItem = function (data){
            var domItemCtn = this.domWrap.querySelector('#tabContent');
            var isNew = !data;

            // 如果 data 不存在，则进行新增操作
            if (!data) {
                data = {
                    _id: '',
                    name: I18n.resource.report.REPORT_SUB_NAME,
                    group:'',
                    creator : AppConfig.userProfile.fullname,
                    time : new Date().format('yyyy-MM-dd HH:mm:ss')
                };
            }

            var $item = $(this.groupItemGroup.formatEL(data));
            domItemCtn.appendChild($item[0]);

            if (isNew) {
                $('.tpl-item', domItemCtn).removeClass('active');
                $item.addClass('active');
                // 让名称处于可编辑状态
                $item.children('.pageName').trigger('click');
            }
        };
        this.modifyGroupItem = function (data) {
            var _this = this;
            if (!data._id) {
                data._id = ObjectId();
                data.content = {};
                data.type = 'widget';
                data.group =  $('.upGroup', this.container).length === 0?'':$('.upGroup', this.container)[0].dataset.groupid;
                data.isFolder = 1;
                data.creator = AppConfig.userProfile.fullname;
                data.time = new Date().format('yyyy-MM-dd HH:mm:ss');
                data.public =1;
                return WebAPI.post('/factory/material/save', data).done(function (result) {
                    if (result.status === 'OK') {
                        _this.store.push(data);
                        _this.treeObj.addNodes(_this.treeObj.getNodeByParam('id',data.group),_this.generateTreeEx([data]),true);
                    }
                });
            }
            return WebAPI.post('/factory/material/edit', data).done(function(){
                var treeNode = _this.treeObj.getNodeByParam('id',data._id);
                treeNode && (treeNode.name = data.name);
                _this.treeObj.updateNode(treeNode);
            });
        };
        this.slider = function (current){
            var _this = this;
            var $this = $(current);
            var upGroupData = {
                _id: '...',
                group: current.dataset.id,
                parentGroupId: current.dataset.groupid,
                type: 'widget'
            };
            if(!$.isEmptyObject(_this.search)){
                _this.search.searchList.push($this[0].dataset.id);
            }else{
                _this.list.push($this[0].dataset.id);
            }
            WebAPI.get('/factory/material/group/' + $this[0].dataset.type + '/' + $this[0].dataset.id).done(function (result) {
                _this.downFolder(result, upGroupData);
            })
        };
        this.downFolder = function(result,upGroupData){
            var $panelBody = $('#tabContent', this.domWrap);
            var $tabName = $('#tabName', this.domWrap);
            $tabName.find('.divEdit').hide();
            $tabName.find('.divDelete').hide();
            var _this =this;
            _this.store = result.data;
            if(!result.data){
                $panelBody.empty().append(_this.upGroup.formatEL(upGroupData));
            }else{
                $panelBody.empty().append(_this.upGroup.formatEL(upGroupData));
                var len = result.data.length;
                for (var i = 0; i < len; i++) {
                    if(!result.data[i].isFolder){
                        result.data[i].isFolder = 0;
                    }
                    if (result.data[i].isFolder === 1) {
                        $panelBody.append(_this.groupItemGroup.formatEL(result.data[i]));
                    } else {
                        if(_this.screen.options.showTemplateType && _this.screen.options.showTemplateType.length > 0){
                            _this.screen.options.showTemplateType.forEach(function(row){
                                var rowDataType;
                                if(result.data[i].type.split('.')[1]){
                                    rowDataType = result.data[i].type.split('.')[1];
                                }else{
                                    rowDataType = result.data[i].type;
                                }
                                if(rowDataType.toLowerCase() === row.toLowerCase()){
                                    $panelBody.append(_this.tabOptions.itemTpl.formatEL(result.data[i]));
                                }
                            })
                        }else{
                            $panelBody.append(_this.tabOptions.itemTpl.formatEL(result.data[i]));
                        }
                    }
                }
                _this.initTooltip();
            }
            $panelBody.find('.upGroup').off('dblclick').on('dblclick',function(){
                if(!$.isEmptyObject(_this.search)){
                    _this.search.searchList.splice(_this.search.searchList.length-1,1);
                    if(_this.search.searchList.length > 0){
                        WebAPI.get('/factory/material/group/'+$(this)[0].dataset.type+'/'+_this.search.searchList[_this.search.searchList.length-1]).done(function(result){
                            $panelBody.empty();
                            var groupId = _this.search.searchList[_this.search.searchList - 1];
                            var upGroupData = {
                                _id:'...',
                                group: groupId,
                                parentGroupId: _this.list.length > 1 ? _this.list[_this.list.length - 2] : '',
                                type:'widget'
                            };
                            _this.downFolder(result,upGroupData);
                        })
                    }else{
                        _this.renderItems(_this.search.data);
                    }
                    return;
                }
                if(!_this.list[_this.list.length-2]){
                    var $tabName = $('#tabName', this.domWrap);
                    $tabName.find('.divEdit').hide();
                    $tabName.find('.divDelete').hide();
                    _this.list.splice(_this.list.length-1,1);
                    WebAPI.get('/factory/material/group/widget').done(function(result){
                        _this.renderItems(result.data);
                    });
                }else{
                    WebAPI.get('/factory/material/group/'+$(this)[0].dataset.type+'/'+_this.list[_this.list.length-2]).done(function(result){
                        $panelBody.empty();
                        _this.list.splice(_this.list.length - 1, 1);
                        var groupId = _this.list[_this.list.length - 1];
                        var upGroupData = {
                            _id: _this.list.length > 0 ? '...' : '',
                            group: groupId,
                            parentGroupId: _this.list.length > 1 ? _this.list[_this.list.length - 2] : '',
                            type:'widget'
                        };
                        _this.downFolder(result,upGroupData);
                    })
                }
            })
        }

    }.call(WidgetTab.prototype);

    exports.WidgetTab = WidgetTab;
    
} (
    namespace('factory.components.template.tabs'),
    namespace('factory.components.template.tabs.Tab')
));