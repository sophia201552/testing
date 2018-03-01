;(function (exports, SuperClass) {
    var clickTimer = null;
    var CLICK_DELAY = 500;


    function ReportTab() {
        SuperClass.apply(this, arguments);
    }

    ReportTab.prototype = Object.create(SuperClass.prototype);
    ReportTab.prototype.constructor = ReportTab;

    +function () {
        this.groupItemGroup = '<div class="tpl-item group-item" draggable="true" id="{_id}" data-id="{_id}" data-type="{type}" data-groupid ="{group}"><span class="glyphicon glyphicon-folder-open"></span>\
        <span class="tpl-item-name" title="{name}">{name}</span></div>';
        this.upGroup = '<div class="tpl-item upGroup" data-type="{type}" data-id="{_id}" data-groupid ="{group}" data-parent-group-id="{parentGroupId}"><span class="glyphicon glyphicon-chevron-left"></span>\
        <span class="tpl-item-name" title="...">...</span></div>';

        /** @override */
        this.tabOptions = {
            title: '<div class="divTab"><span class="glyphicon glyphicon-list"></span>Report</div><ul id="treeReportTemplate" class="ztree treeTemplate" style="display: none;"></ul>',
            toolsTpl: '<div class="paneTempButton">\
                    <div class="addTempate" title="Add Template"><span class="glyphicon glyphicon-file"></span></div>\
                    <div class="addGroup" title="Add Folder"><span class="glyphicon glyphicon-folder-open"></span></div>\
                    <div class="divEdit" title="Edit" style="display:none;"><span class="glyphicon glyphicon-edit"></span></div>\
                    <div class="divDelete" title="Remove"><span class="glyphicon glyphicon-trash"></span></div>\
                    <div class="col-sm-4 divSearch"><div class="input-group"><input type="text" class="form-control iptSearch" placeholder="Search for name!"><span class="spanSearch"><span class="glyphicon glyphicon-search" aria-hidden="true"></span><span class="glyphicon glyphicon-remove" aria-hidden="true" style="display:none;"></span></span></div></div>\
                </div>',
            itemTpl: '<div class="tpl-item report-item" draggable="true" id="{_id}" data-id="{_id}" data-type="{type}" data-groupid ="{group}" data-creator="{creator}"><div class></div><span class="glyphicon glyphicon-file"></span>\
            <span class="tpl-item-name">{name}</span></div>',
            dataUrl: '/factory/material/group/report'
        };

        /** @override */
        this.attachEvents = function () {
            // 工具按钮的事件绑定
            var _this = this;
            var $tabName = $('#tabName', this.domWrap);
            var $tabContent = $('#tabContent', this.domWrap);
            var $templateLeft = $('#templateLeft', this.domWrap);
            $tabName.find('.addTempate').off().on('click', function (e) {
                _this.addTplItem();
            });
            $tabName.find('.addGroup').off().on('click', function (e) {
                _this.addGroupItem();
            });
            $tabName.find('.divEdit').off('click').on('click',function () {
                var $tabContent = $('#tabContent', this.domWrap);
                var data=$tabContent.find('.active');                
                if(typeof _this.permission(data) === 'object'){
                    data.name= $tabContent.find('.active').find('.tpl-item-name').html();
                    _this.showTemplateScreen({
                            id: data[0].dataset.id,
                            name: data.name
                        }, data[0].dataset.type);
                    }else{
                        alert(_this.permission(data));
                    }
            });
            $tabContent.off('dblclick','.group-item');
            $tabContent.off('dragstart', '.tpl-item').on('dragstart', '.tpl-item', _this.drag().start);
            $tabContent.off('dragend', '.tpl-item').on('dragend', '.tpl-item', _this.drag().end);            
            $tabContent.off('dragover', '.tpl-item.group-item,.tpl-item.upGroup').on('dragover', '.tpl-item.group-item,.tpl-item.upGroup', _this.drag().over);
            $templateLeft.off('dragover','#treeReportTemplate li a').on('dragover','#treeReportTemplate li a', _this.drog().over);
            $tabContent.off('dragenter', '.tpl-item.group-item,.tpl-item.upGroup').on('dragenter', '.tpl-item.group-item,.tpl-item.upGroup', _this.drag().enter);
            $templateLeft.off('dragenter','#treeReportTemplate li a').on('dragenter','#treeReportTemplate li a', _this.drog().enter);
            $tabContent.off('dragleave', '.tpl-item').on('dragleave', '.tpl-item', _this.drag().leave);
            $templateLeft.off('dragleave','#treeReportTemplate li a').on('dragleave','#treeReportTemplate li a', _this.drog().leave);
            $tabContent.off('drop', '.tpl-item.group-item,.tpl-item.upGroup').on('drop', '.tpl-item.group-item,.tpl-item.upGroup', _this.drag().drop);
            $templateLeft.off('drop','#treeReportTemplate li a').on('drop','#treeReportTemplate li a', _this.drog().drop);
            var start = null;
            $tabContent.off('click',".tpl-item:not('.upGroup ')").on('click', ".tpl-item:not('.upGroup ')", function (e) {
                var $this = $(this);
                var ipt;
                var allPageBox = $tabContent.children('.tpl-item');
                
                if (e.ctrlKey) {//17
                    //ctrl键
                    if (!e.shiftKey) {
                        if ($this.hasClass('active')) {
                            $this.removeClass('active');
                        } else {
                            $this.addClass('active');
                        }
                        start = this;
                    } else {//ctrl+shift多选
                        var startIndex = $(start).index(), lastIndex = $this.index();
                        var selPageBox = allPageBox.slice(Math.min(startIndex, lastIndex), Math.max(startIndex, lastIndex) + 1);
                        //多选或反选
                        if ($(start).hasClass('active')) {
                            selPageBox.addClass('active');
                        } else {
                            selPageBox.removeClass('active');
                        }
                    }
                    return;
                } else if (e.shiftKey) {//16
                    //shift键
                    if ($tabContent.find('.active').length !== 0) {
                        var startIndex = $(start).index(), lastIndex = $this.index();
                        var selPageBox = allPageBox.slice(Math.min(startIndex, lastIndex), Math.max(startIndex, lastIndex) + 1);
                        selPageBox.addClass('active');
                        allPageBox.not(selPageBox).removeClass('active');
                    } else {
                        $this.addClass('active');
                    }
                    return;
                }
                //else{
                //    allPageBox.removeClass('active');
                //    $this.addClass('active');
                //    start = this;
                //}

                if (!$this.hasClass('active')) {
                    allPageBox.removeClass('active');
                    $this.addClass('active');
                    start = this;
                    _this.toolsTpl();
                    clickTimer = window.setTimeout(function () {
                        window.clearTimeout(clickTimer);
                        clickTimer = null;
                    }, CLICK_DELAY);
                    return;
                }

                if (clickTimer) {
                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                    if($this.hasClass('report-item')){
                        if(typeof _this.permission($this) === 'string'){
                            alert(_this.permission($this));
                            return;
                        }
                        _this.showTemplateScreen({
                            id: this.dataset.id,
                            name: this.querySelector('.tpl-item-name').innerHTML
                        }, this.dataset.type);
                    }else{
                        _this.slider(this);
                    }
                    return;
                }
                if($this.hasClass('active')){
                    allPageBox.removeClass('active');
                    $this.addClass('active');

                    start = this;
                    clickTimer = window.setTimeout(function () {
                        if($this.hasClass('upGroup')){return;}
                        // 重命名
                        if($this.attr('id') != ''){
                            if(typeof _this.permission($this) === 'string'){
                                alert(_this.permission($this));
                                window.clearTimeout(clickTimer);
                                clickTimer = null;
                                return;
                            }
                        }
                        var $spName = $this.children('.tpl-item-name');
                        // rename 逻辑
                        ipt = document.createElement('input');
                        ipt.className = 'ipt-name-editor';
                        ipt.value = $spName.text();
                        ipt.onblur = function () {
                            $tabContent.find('.tpl-item').prop('draggable',true);
                            if($this.hasClass('group-item')){
                                $tabContent.on('dblclick','.group-item',function(){
                                    _this.slider(this);
                                });
                            }
                            //$this.removeClass('active');
                            var params = {};
                            // 如果名称有变动，或者是第一次新建，则进行更新
                            if (this.value !== $spName.text() ||
                                !$this[0].dataset.id) {
                                params = {
                                    _id: $this[0].dataset.id,
                                    name: this.value
                                    //type: $this[0].dataset.type
                                };
                                if($this.hasClass('report-item')){
                                    _this.modifyTplItem(params);
                                }else{
                                    _this.modifyGroupItem(params);
                                }
                                $this.attr('id',params._id);
                                $this[0].dataset.id = params._id;
                                $this[0].dataset.groupid = params.group;
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

                            $tabContent.find('.tpl-item').prop('draggable',false);
                            if($this.hasClass('group-item')){
                                $tabContent.off('dblclick','.group-item');
                            }
                        };
                        ipt.focus();

                        window.clearTimeout(clickTimer);
                        clickTimer = null;
                    }, CLICK_DELAY);
                }
            
            })
        };
        this.addTplItem = function (data) {
            var domItemCtn = this.domWrap.querySelector('#tabContent');
            var isNew = !data;

            // 如果 data 不存在，则进行新增操作
            if (!data) {
                data = {
                    _id: '',
                    name: I18n.resource.report.REPORT_SUB_NAME,
                    type: 'report',
                    group:'',
                    creator:AppConfig.userProfile.fullname
                };
            }

            var $item = $(this.tabOptions.itemTpl.formatEL(data));
            domItemCtn.appendChild($item[0]);

            if (isNew) {
                // 让名称处于可编辑状态
                $('.tpl-item', domItemCtn).removeClass('active');
                $item.addClass('active');
                //$item.siblings().removeClass('on');
                $item.trigger('click');
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
                    type: 'report',
                    group:''
                };
            }

            var $item = $(this.groupItemGroup.formatEL(data));
            domItemCtn.appendChild($item[0]);

            if (isNew) {
                // 让名称处于可编辑状态
                $('.tpl-item', domItemCtn).removeClass('active');
                $item.addClass('active');
                //$item.siblings().removeClass('on');
                $item.trigger('click');
            }
        };
        this.modifyTplItem = function (data) {
            var _this = this;
            if (!data._id) {
                data._id = ObjectId();
                data.type = 'report';
                data.content = { layouts: [] };
                data.group =  $('.upGroup', this.container).length === 0?'':$('.upGroup', this.container)[0].dataset.groupid;
                data.isFolder = 0;
                data.creator = AppConfig.userProfile.fullname;
                return WebAPI.post('/factory/material/save', data).done(function(result){
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
        this.modifyGroupItem = function (data) {
            var _this = this;
            if (!data._id) {
                data._id = ObjectId();
                data.type = 'report';
                data.content = { layouts: [] };
                data.group =  $('.upGroup', this.container).length === 0?'':$('.upGroup', this.container)[0].dataset.groupid;
                data.isFolder = 1;
                data.creator = AppConfig.userProfile.fullname;
                return WebAPI.post('/factory/material/save', data).done(function(result){
                    if (result.status === 'OK') {
                        _this.store.push(data);
                        _this.treeObj.addNodes(_this.treeObj.getNodeByParam('id',data.group),_this.generateTreeEx([data]),true);
                    }
                });
            }
            return WebAPI.post('/factory/material/edit', data).done(function(){
                var treeNode = _this.treeObj.getNodeByParam('id',data._id);
                treeNode.name = data.name;
                _this.treeObj.updateNode(treeNode);
            });
        };
        this.slider = function (current){
            var _this = this;
            var $this = $(current);
            var upGroupData = {
                _id:'...',
                group: current.dataset.id,
                parentGroupId: current.dataset.groupid,
                type:'report'
            };
            if(!$.isEmptyObject(_this.search)){
                _this.search.searchList.push($this[0].dataset.id);
            }else{
                _this.list.push($this[0].dataset.id);
            }
            //console.log(_this.list);
            WebAPI.get('/factory/material/group/'+$this[0].dataset.type+'/'+$this[0].dataset.id).done(function(result){
                 _this.downFolder(result,upGroupData);
            })
        };
        this.downFolder = function(result,upGroupData){
            var _this =this;
            var $tabName = $('#tabName', this.domWrap);
            $tabName.find('.divEdit').hide();
            _this.store = result.data;
            var $panelBody = $('#tabContent', this.domWrap);
            if(!result.data){
                $panelBody.empty().append(_this.upGroup.formatEL(upGroupData));
            }else{
                $panelBody.empty().append(_this.upGroup.formatEL(upGroupData));
                var len = result.data.length;
                for (var i = 0; i < len; i++) {
                    var resultDataCur = result.data[i];
                    if(!resultDataCur.isFolder){
                        resultDataCur.isFolder = 0;
                    }
                    resultDataCur['creator'] = resultDataCur.creator?resultDataCur.creator:'未知';
                    if (resultDataCur.isFolder === 0) {
                        $panelBody.append(_this.tabOptions.itemTpl.formatEL(resultDataCur));
                    } else {
                        $panelBody.append(_this.groupItemGroup.formatEL(resultDataCur));
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
                                type:'report'
                            };
                            _this.downFolder(result,upGroupData);
                        })
                    }else{
                        _this.renderItems(_this.search.data);
                    }
                    return;
                }
                if(!_this.list[_this.list.length-2]){
                    $tabName.find('.divEdit').hide();
                    _this.list.splice(_this.list.length-1,1);
                    //console.log(_this.list);
                    WebAPI.get('/factory/material/group/report').done(function(result){
                        _this.renderItems(result.data);
                    });
                    //$('#templateTabs', _this.domWrap).find('.divCheck').trigger('click');
                }else{
                    WebAPI.get('/factory/material/group/'+$(this)[0].dataset.type+'/'+_this.list[_this.list.length-2]).done(function(result){
                        $panelBody.empty();
                        _this.list.splice(_this.list.length - 1, 1);
                        //console.log(_this.list);
                        var groupId = _this.list[_this.list.length - 1];
                        var upGroupData = {
                            _id:_this.list.length > 0 ? '...' : '',
                            group: groupId,
                            parentGroupId: _this.list.length > 1 ? _this.list[_this.list.length - 2] : '',
                            type:'report'
                        };
                        _this.downFolder(result,upGroupData);
                    })
                }
            })
            _this.initTooltip();
        };
        this.toolsTpl = function () {
            var $tabName = $('#tabName', this.domWrap);
            var $tabContent = $('#tabContent', this.domWrap);
            if($tabContent.find('.active').length === 0){
                $tabName.find('.divEdit').hide();                
            }else{
                if($tabContent.find('.active').hasClass('group-item')){
                    $tabName.find('.divEdit').hide(); 
                }else{
                    $tabName.find('.divEdit').show();
                }            
            }
        }
        this.showTemplateScreen = function (params, type) {
            $('#modalframe').hide();
                I18n.fillArea($('#mainframe').fadeIn());

            if (type === 'report') {
                var FactoryTplScreen = new namespace('factory.FactoryTplScreen');
                new FactoryTplScreen().show(params, type);
            }
        };

    }.call(ReportTab.prototype);

    exports.ReportTab = ReportTab;

} (
    namespace('factory.components.template.tabs'),
    namespace('factory.components.template.tabs.Tab')
));