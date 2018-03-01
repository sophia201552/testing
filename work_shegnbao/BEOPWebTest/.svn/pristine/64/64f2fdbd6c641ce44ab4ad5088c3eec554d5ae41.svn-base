;(function (exports, SuperClass) {
    var clickTimer = null;
    var CLICK_DELAY = 500;
    function LayerTab() {
        SuperClass.apply(this, arguments);
    }

    LayerTab.prototype = Object.create(SuperClass.prototype);
    LayerTab.prototype.constructor = LayerTab;

    +function () {
        this.groupItemGroup = '<div class="tpl-item group-item pageBox" draggable="true" id="{_id}" data-id="{_id}" data-type="layer" data-groupid ="{group}">\
        <div class="pageName"><span class="glyphicon glyphicon-folder-open"></span><span class="item-name">{name}</span></div>\
        <div class="pageCreator"><span class="pageText">{creator}</span></div>\
        <div class="pageTime"><span class="pageText">{time}</span></div>\
                            <span class="slider-cb-wrap"><i class="slider-cb"></i></span></div>';
        this.upGroup = '<div class="tpl-item upGroup pageBox" data-type="{type}" data-id="{_id}" data-groupid ="{group}" data-parent-group-id="{parentGroupId}"><span class="glyphicon glyphicon-chevron-left"></span>\
        <span class="group-item-name" title="...">...</span></div>';
        /** @override */
        this.tabOptions = {
            title:'<div class="divTab"><span class="glyphicon glyphicon-education"></span>Layer</div><ul id="treeLayerTemplate" class="ztree treeTemplate" style="display: none;"></ul>',
            itemTpl: '<div class="child-item tpl-item pageBox" draggable="true" id="{_id}" data-type="layer" data-id="{_id}" data-groupid ="{group}">\
                            <div class="pageName"><span class="glyphicon glyphicon-file"></span><span class="item-name">{name}</span></div>\
                            <div class="pageBody"><div class="pageCreator"><span class="pageText">{creator}</span></div>\
                            <div class="pageTime"><span class="pageText">{time}</span></div>\
                            <span class="slider-cb-wrap"><i class="slider-cb"></i></span></div></div>',
            toolsTpl: '<div class="paneTempButton">\
                    <div class="addTempate" title="Add Layer"><span class="glyphicon glyphicon-file"></span></div>\
                    <div class="addGroup" title="Add Folder"><span class="glyphicon glyphicon-folder-open"></span></div>\
                    <div class="divEdit" title="Edit" style="display:none;"><span class="glyphicon glyphicon-edit"></span></div>\
                    <div class="divDelete" title="Remove" style="display: none;"><span class="glyphicon glyphicon-trash"></span></div>\
                    <div class="col-sm-4 divSearch"><div class="input-group"><input type="text" class="form-control iptSearch" placeholder="Search for name!"><span class="spanSearch"><span class="glyphicon glyphicon-search" aria-hidden="true"></span><span class="glyphicon glyphicon-remove" aria-hidden="true" style="display:none;"></span></span></div></div>\
                </div>',
            dataUrl: '/factory/material/group/layer'
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
            $templateLeft.off('dragover','#treeLayerTemplate li a').on('dragover','#treeLayerTemplate li a', _this.drog().over);
            $tabContent.off('dragenter', '.tpl-item.group-item,.tpl-item.upGroup').on('dragenter', '.tpl-item.group-item,.tpl-item.upGroup', _this.drag().enter);
            $templateLeft.off('dragenter','#treeLayerTemplate li a').on('dragenter','#treeLayerTemplate li a', _this.drog().enter);
            $tabContent.off('dragleave', '.tpl-item').on('dragleave', '.tpl-item', _this.drag().leave);
            $templateLeft.off('dragleave','#treeLayerTemplate li a').on('dragleave','#treeLayerTemplate li a', _this.drog().leave);
            $tabContent.off('drop', '.tpl-item.group-item,.tpl-item.upGroup').on('drop', '.tpl-item.group-item,.tpl-item.upGroup', _this.drag().drop);
            $templateLeft.off('drop','#treeLayerTemplate li a').on('drop','#treeLayerTemplate li a', _this.drog().drop);
            $tabContent.off('click', '.pageBox .pageName').on('click', '.pageBox .pageName', function (e) {
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
                    }
                    else{
                        _this.editLayerBox();  
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
                                name: this.value,
                                type: 'layer'
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
                    ipt.onfocus = function(){
                        $tabContent.off('dblclick','.group-item');
                        $tabContent.find('.tpl-item').prop('draggable',false);
                    };
                    ipt.focus();

                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                }, CLICK_DELAY);
            });
            $tabContent.off('dblclick','.pageBody').on('dblclick','.pageBody',function(){
                _this.editLayerBox();
            });

            if (this.options.allowUse) {
                $tabContent.off('click','.pageBox .pageName');
                $tabContent.off('dblclick','.pageBody');
                $tabContent.off('dblclick', '.child-item').on('dblclick', '.child-item', function (e) {
                    var id = this.dataset.id;
                    var data = {ids:[id]};
                    WebAPI.post('/factory/material/getByIds',data).done(function(result){
                        typeof _this.options.callback === 'function' &&
                                _this.options.callback(result[0]);
                    })
                    _this.screen.close();
                });
            }
            this.attachToolEvents();
        };

        this.attachToolEvents = function () {
            var _this = this;
            var $tabName = $('#tabName', this.domWrap);
            var $tabContent = $('#tabContent', this.domWrap);
            $tabName.find('.addTempate').off('click').click(function () {
                var $widgitNameModal = $('<div class="modal fade" id="widgitNameModal">\
                  <div class="modal-dialog">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                        <h4 class="modal-title">Layer</h4>\
                      </div>\
                      <div class="modal-body">\
                            <div class="form-group form-goupCy">\
                                <label for="widgetName" class="col-sm-2 control-label">Name:</label>\
                                <div class="col-sm-10">\
                                    <input type="text" class="form-control" id="widgetName" placeholder="Please input template name">\
                                </div>\
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
                    if (widgetName === '') {
                        alert('Please input template name!');
                    } else {
                        $widgitNameModal.modal('hide');
                        var _id = ObjectId();
                        var data = {
                            _id: _id,
                            layerId: ObjectId(),
                            name: widgetName,
                            content: {},
                            creator: AppConfig.userProfile.fullname,
                            time: new Date().format('yyyy-MM-dd HH:mm:ss'),
                            group: $('.upGroup', this.container).length === 0?'':$('.upGroup', this.container)[0].dataset.groupid,
                            isFolder: 0,
                            'public': 1,
                            type: 'layer'
                        };
                        $tabContent.append($(_this.tabOptions.itemTpl.formatEL(data)));
                        WebAPI.post('/factory/material/save', data).done(function (result) {
                            if (result.status === 'OK') {
                                _this.store.push(data);
                                _this.treeObj.addNodes(_this.treeObj.getNodeByParam('id',data.group),_this.generateTreeEx([data]),true);
                                var content ='{}';
                                EditorModal.show(content, false, function (newContent) {
                                    try{
                                        content = JSON.parse(newContent);
                                    }catch(e){
                                        alert('Format Error!');
                                        return true;
                                    }
                                    if (content) {
                                        if($('#materialModal').length === 0){
                                            id = $('#tabContent', this.domWrap).children('.pageBox:last').attr('id');
                                        }else{
                                            id = $('#materialModal').find('#tabContent').children('.pageBox:last').attr('id');
                                        }
                                        var data = {
                                            _id: id,
                                            content: content
                                        }
                                        WebAPI.post('/factory/material/edit', data).done(function (result) {

                                        }).fail(function () {

                                        }).always(function () {

                                        });
                                    }
                                });
                            } else {
                                alert(result.msg || 'There are files with the same!');
                            }
                        });
                    }
                });
            });
            $tabName.find('.addGroup').off('click').click(function(){
                _this.addGroupItem();
            });
            $tabName.find('.divEdit').off('click').on('click',function () {
                _this.editLayerBox();
            });
        };
        this.editLayerBox=function(){
            var _this=this;
            var $tabContent = $('#tabContent', this.domWrap);
            var $active = $tabContent.find('.active');
            if(typeof _this.permission($active) === 'object'){
                var data = _this.permission($active);
                WebAPI.post('/factory/material/getByIds',data).done(function(result){
                    var layer = result[0];
                    if (layer.type === 'layer') {
                        var content = JSON.stringify(layer.content);
                        EditorModal.show(content, false, function (newContent) {
                            try{
                                layer.content = JSON.parse(newContent);
                            }catch(e){
                                alert('Format Error!');
                                return true;
                            }
                            if (layer.content) {
                                var data = {
                                    _id: layer._id, content: layer.content
                                }
                                WebAPI.post('/factory/material/edit', data).done(function (result) {

                                }).fail(function () {

                                }).always(function () {

                                });
                            }
                        });
                    }
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
            var $upGroup = $('.upGroup', this.container);
            if (!data._id) {
                data._id = ObjectId();
                data.layerId = ObjectId();
                data.content = {};
                data.group =  $upGroup.length === 0 ? '' : $upGroup[0].dataset.groupid;
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
                type:'layer'
            };
            if(!$.isEmptyObject(_this.search)){
                _this.search.searchList.push($this[0].dataset.id);
            }else{
                _this.list.push($this[0].dataset.id);
            }
            WebAPI.get('/factory/material/group/'+$this[0].dataset.type+'/'+$this[0].dataset.id).done(function(result){
                 _this.downFolder(result,upGroupData);
            })
        };
        this.downFolder = function(result,upGroupData){
            var _this =this;
            var $panelBody = $('#tabContent', this.domWrap);
            var $tabName = $('#tabName', this.domWrap);
            $tabName.find('.divEdit').hide();
            $tabName.find('.divDelete').hide();
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
                    if (result.data[i].isFolder === 0) {
                        $panelBody.append(_this.tabOptions.itemTpl.formatEL(result.data[i]));
                    } else {
                        $panelBody.append(_this.groupItemGroup.formatEL(result.data[i]));
                    }
                }
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
                                type:'layer'
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
                    WebAPI.get('/factory/material/group/layer').done(function(result){
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
                            type:'layer'
                        };
                        _this.downFolder(result,upGroupData);
                    })
                }
            })
            _this.initTooltip();
        }

    }.call(LayerTab.prototype);

    exports.LayerTab = LayerTab;

} (
    namespace('factory.components.template.tabs'),
    namespace('factory.components.template.tabs.Tab')
));