;(function (exports, FactoryTplScreen) {

    var clickTimer = null;
    var CLICK_DELAY = 500;

    function TemplateList(container) {
        this.close();

        this.store = {};
        this.container = container;
        this.list = [];
    }

    +function () {

        this.tplItemTpl = '<div class="tpl-item" data-id="{_id}" data-type="{type}" data-groupid ="{group}"><span class="glyphicon glyphicon-file"></span>\
        <span class="tpl-item-name" title="{name}">{name}</span></div>';
        this.groupItemGroup = '<div class="group-item" data-id="{_id}" data-type="{type}" data-groupid ="{group}"><span class="glyphicon glyphicon-folder-close"></span>\
        <span class="group-item-name" title="{name}">{name}</span></div>';
        this.upGroup = '<div class="upGroup" data-type="{type}" data-id="{_id}" data-groupid ="{group}"><span class="glyphicon glyphicon-folder-close"></span>\
        <span class="group-item-name" title="...">...</span></div>';

        this.show = function () {
            this.render();
        };

        this.render = function () {
            // 显示报表级别模板
            this.addTplPanel('report', I18n.resource.report.REPORT_NAME);
        };

        this.addTplPanel = function (type, title) {
            var wrapTpl = '<div class="panel-heading">'+title+'\
            <span class="glyphicon glyphicon-folder-close btn-add-group" title="新增"></span>\
            <span class="glyphicon glyphicon-plus-sign btn-add-tpl" title="新增"></span>\
            <span class="glyphicon glyphicon-remove-sign btn-remove-tpl" style="display: none;" title="删除"></span>\
            </div><div class="panel-body">{items}</div>';
            var arrHtml = [];

            this.__loadData(type).done(function (rs) {
                var domWrap;
                rs.forEach(function (row) {
                    if(!row.isFolder){
                        row.isFolder = 0;
                    }
                    if(!row.group){
                        row.group = row._id;
                    }
                    if (row.name === I18n.resource.report.REPORT_SUB_NAME) { row.name = I18n.resource.report.REPORT_SUB_NAME }
                    if(row.group === row._id){
                        if (row.isFolder === 0) {
                            arrHtml.push(this.tplItemTpl.formatEL(row));
                        }else{
                            arrHtml.push(this.groupItemGroup.formatEL(row));
                        }
                    }
                }.bind(this));

                domWrap = document.createElement('div');
                domWrap.className = 'panel panel-default tpl-panel';
                domWrap.id = type + 'TplPanel';
                domWrap.dataset.type = type;

                domWrap.innerHTML = wrapTpl.formatEL({
                    items: arrHtml.join(''),
                    type: type
                });

                this.container.appendChild(domWrap);
                $('.btn-add-group').attr('title', I18n.resource.report.ADD);
                $('.btn-add-tpl').attr('title', I18n.resource.report.ADD);
                $('.btn-remove-tpl').attr('title', I18n.resource.report.DELETE);
                this.attachEvents();
            }.bind(this));
        };

        this.__loadData = function (type) {
            return WebAPI.post('/factory/material/group/'+type,{userList:AppConfig.templateUserList}).then(function (rs) {
                return this.store[type] = rs.data;
            }.bind(this));
        };

        this.attachEvents = function () {
            var _this = this;
            var $container = $(this.container);
            var $tplPanel = $('.tpl-panel', $container);
            var $panelBody = $('.panel-body', $container);

            $tplPanel.find('.btn-add-tpl').off().on('click', function (e) {
                var type = $(this).closest('.tpl-panel')[0].dataset.type;
                _this.addTplItem(type);
            });

            $tplPanel.find('.btn-add-group').off().on('click', function (e) {
                var type = $(this).closest('.tpl-panel')[0].dataset.type;
                _this.addGroupItem(type);
            });

            $tplPanel.find('.btn-remove-tpl').off().on('click', function (e) {
                var $item = $tplPanel.find('.on');

                if ($item.length <= 0) {
                    alert(I18n.resource.report.SELECT_INFO);
                    return;
                }

                confirm(I18n.resource.report.REMOVE_INFO, function () {
                    $item.remove();
                    WebAPI.post('/factory/material/remove', {
                        ids: [$item[0].dataset.id]
                    }).done(function (rs) {
                        if (rs.status === 'OK') {
                            alert(I18n.resource.report.REMOVE_INFO_SUCCESS);
                        }
                    });
                });
            });

            $tplPanel.on('click', '.tpl-item', function (e) {
                var $this = $(this);
                var ipt;

                if (!$this.hasClass('on')) {
                    $this.siblings().removeClass('on');
                    $this.addClass('on');
                    clickTimer = window.setTimeout(function () {
                        window.clearTimeout(clickTimer);
                        clickTimer = null;
                    }, CLICK_DELAY);
                    return;
                }

                if (clickTimer) {
                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                    _this.showTemplateScreen({
                        id: this.dataset.id,
                        name: this.querySelector('.tpl-item-name').innerHTML
                    }, this.dataset.type);
                    return;
                }

                clickTimer = window.setTimeout(function () {
                    // 重命名
                    var $spName = $this.children('.tpl-item-name');
                    // rename 逻辑
                    ipt = document.createElement('input');
                    ipt.className = 'ipt-name-editor';
                    ipt.value = $spName.text();
                    ipt.onblur = function () {
                        var params = {};
                        // 如果名称有变动，或者是第一次新建，则进行更新
                        if (this.value !== $spName.text() || 
                            !$this[0].dataset.id) {
                            params = {
                                _id: $this[0].dataset.id,
                                name: this.value,
                                type: $this[0].dataset.type
                            };
                            _this.modifyTplItem(params);
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
                    ipt.focus();

                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                }, CLICK_DELAY);
            });

            $tplPanel.on('click', '.group-item', function (e) {
                var $this = $(this);
                var ipt;

                if (!$this.hasClass('on')) {
                    $this.siblings().removeClass('on');
                    $this.addClass('on');
                    clickTimer = window.setTimeout(function () {
                        window.clearTimeout(clickTimer);
                        clickTimer = null;
                    }, CLICK_DELAY);
                    return;
                }

                if (clickTimer) {
                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                    var upGroupData = {
                        _id:'...',
                        group:$this[0].dataset.id,
                        type:'report'
                    }
                    WebAPI.post('/factory/material/group/'+$this[0].dataset.type+'/'+$this[0].dataset.id,{userList:AppConfig.templateUserList}).done(function(result){
                        if(result.data){
                            _this.list.push(result.data[0].group);
                        }
                         _this.downFolder(result,upGroupData);
                    })
                    return;
                }

                clickTimer = window.setTimeout(function () {
                    // 重命名
                    var $spName = $this.children('.group-item-name');
                    // rename 逻辑
                    ipt = document.createElement('input');
                    ipt.className = 'ipt-name-editor';
                    ipt.value = $spName.text();
                    ipt.onblur = function () {
                        var params = {};
                        // 如果名称有变动，或者是第一次新建，则进行更新
                        if (this.value !== $spName.text() ||
                            !$this[0].dataset.id) {
                            params = {
                                _id: $this[0].dataset.id,
                                name: this.value,
                                type: $this[0].dataset.type
                            };
                            _this.modifyGroupItem(params);
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
                    ipt.focus();

                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                }, CLICK_DELAY);
            })
        };

        this.addTplItem = function (type, data) {
            var domPanel = this.container.querySelector('#'+type+'TplPanel');
            var domItemCtn = domPanel.querySelector('.panel-body');
            var isNew = !data;

            // 如果 data 不存在，则进行新增操作
            if (!data) {
                data = {
                    _id: '',
                    name: I18n.resource.report.REPORT_SUB_NAME,
                    type: type,
                    group:''
                };
            }

            var $item = $(this.tplItemTpl.formatEL(data));
            domItemCtn.appendChild($item[0]);

            if (isNew) {
                // 让名称处于可编辑状态
                $('.tpl-item', domItemCtn).removeClass('on');
                $item.addClass('on');
                $item.siblings().removeClass('on');
                $item.trigger('click');
            }
        };

        this.addGroupItem = function (type,data){
            var domPanel = this.container.querySelector('#'+type+'TplPanel');
            var domItemCtn = domPanel.querySelector('.panel-body');
            var isNew = !data;

            // 如果 data 不存在，则进行新增操作
            if (!data) {
                data = {
                    _id: '',
                    name: I18n.resource.report.REPORT_SUB_NAME,
                    type: type,
                    group:''
                };
            }

            var $item = $(this.groupItemGroup.formatEL(data));
            domItemCtn.appendChild($item[0]);

            if (isNew) {
                // 让名称处于可编辑状态
                $('.group-item', domItemCtn).removeClass('on');
                $item.addClass('on');
                $item.siblings().removeClass('on');
                $item.trigger('click');
            }
        };

        this.modifyTplItem = function (data) {
            var id;
            if (!data._id) {
                data._id = ObjectId();
                data.content = { layouts: [] };
                data.group =  $('#tplContainer .upGroup').length === 0?data._id:$('#tplContainer .upGroup')[0].dataset.groupid;
                data.isFolder = 0;
                return WebAPI.post('/factory/material/save', data);
            }
            return WebAPI.post('/factory/material/edit', data);
        };

        this.modifyGroupItem = function (data) {
            var id;
            if (!data._id) {
                data._id = ObjectId();
                data.content = { layouts: [] };
                data.group =  $('#tplContainer .upGroup').length === 0?data._id:$('#tplContainer .upGroup')[0].dataset.groupid;
                data.isFolder = 1;
                return WebAPI.post('/factory/material/save', data);
            }
            return WebAPI.post('/factory/material/edit', data);
        };

        this.downFolder = function(result,upGroupData){
            var _this =this;
            var $panelBody = $('#reportTplPanel').find('.panel-body');
            if(!result.data){
                _this.list.push(upGroupData.group);
                $panelBody.empty().append(_this.upGroup.formatEL(upGroupData));
            }else if(result.data[0]._id === result.data[0].group){
                upGroupData._id = 'null';
                $panelBody.empty().append(_this.upGroup.formatEL(upGroupData));
                var len = result.data.length;
                if(len>1) {
                    for (var i = 1; i < len; i++) {
                        if (result.data[i].isFolder === 0) {
                            $panelBody.append(_this.tplItemTpl.formatEL(result.data[i]));
                        } else {
                            $panelBody.append(_this.groupItemGroup.formatEL(result.data[i]));
                        }
                    }
                }
            }else if(result.data[0]._id != result.data[0].group){
                $panelBody.empty().append(_this.upGroup.formatEL(upGroupData));
                var len = result.data.length;
                for (var i = 0; i < len; i++) {
                    if (result.data[i].isFolder === 0) {
                        $panelBody.append(_this.tplItemTpl.formatEL(result.data[i]));
                    } else {
                        $panelBody.append(_this.groupItemGroup.formatEL(result.data[i]));
                    }
                }
            }
            $panelBody.find('.upGroup').off('dblclick').on('dblclick',function(){
                var $this = $(this);
                if(this.dataset.id === 'null'){
                    _this.list.splice(_this.list.length-1,1);
                    $('#tplContainer').empty();
                    _this.addTplPanel('report', I18n.resource.report.REPORT_NAME);
                }else{
                    WebAPI.post('/factory/material/group/'+$(this)[0].dataset.type+'/'+_this.list[_this.list.length-2],{userList:AppConfig.templateUserList}).done(function(result){
                        $panelBody.empty();
                        _this.list.splice(_this.list.length-1,1);
                        var upGroupData = {
                            _id:_this.list.length-1>0?'...':'null',
                            group:$this[0].dataset.groupid,
                            type:'report'
                        };
                        _this.downFolder(result,upGroupData);
                    })
                }
            })
        };
        this.showTemplateScreen = function (params, type) {

            $('#modalframe').hide();
                I18n.fillArea($('#mainframe').fadeIn());

            if (type === 'report') {
                new FactoryTplScreen().show(params, type);
            }
        };

        this.close = function () {
            this.container = null;
            this.store = null;
            this.list = null;

            window.onkeyup = null;
        };

    }.call(TemplateList.prototype);

    exports.TemplateList = TemplateList;

} ( namespace('factory.components'), namespace('factory.FactoryTplScreen') ));