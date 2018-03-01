window.analysis = window.analysis || {};
window.analysis.panels = window.analysis.panels || {};
window.analysis.panels.TemplatePanel = ( function (window, $, Model, undefined) {

    function templatePanel(screen, tplData) {
        // analysisScreen 类对象
        this.screen = screen;
        this.tplData = tplData;
        this.tplType = AppConfig.userId === 1 ? 'pre' : 'user';

        this.model = new Model();
    };

    templatePanel.prototype.preTpl = '\
    <div class="template preTemplate template-item" data-id="{id}">\
    <div class="templateImgBg"></div>\
    <div class="templateImg"></div>\
    <div class="divTemplateBtnGroup">{btns}</div>\
    <h3>{name}</h3>\
    <div class="infoWrap">\
        <span class="name">Creator:&nbsp;{creatorName}</span>\
        <div class="modifyTime">{modifyTime}</div>\
    </div>\
    </div>';

    templatePanel.prototype.userTpl = '\
    <div class="template userTemplate template-item{isMyTpl}" data-id="{id}">\
    <div class="templateImgBg"></div>\
    <div class="templateImg"></div>\
    <div class="divTemplateBtnGroup">{btns}</div>\
    <h3><span class="tplName">{name}</span><span class="glyphicon glyphicon-pencil tplNameEdit"></span></h3>\
    <div class="infoWrap">\
        <span class="name">Creator:&nbsp;{creatorName}</span>\
        <div class="modifyTime">{modifyTime}</div>\
    </div>\
    </div>';

    templatePanel.prototype.show = function (container) {
        this.$container = $(container);
        this.init();
    };

    templatePanel.prototype.init = function () {
        // 显示 template 的平铺列表
        var _this = this;
        var arrHtml = [];

        // 渲染预置模板
        this.tplData.preTemplate.forEach( function (row) {
            arrHtml.push( _this.preTpl.formatEL({
                id: row.id,
                name: row.name,
                btns: ( function () {
                    if(AppConfig.userId === row.creatorId) {
                        return ['<span class="glyphicon glyphicon-edit grow btn-rt-corner"></span>',
                        '<span class="glyphicon glyphicon-remove-sign grow btn-rt-corner"></span>'].join('');
                    }
                    return '';
                } () ),
                creatorName: row.creatorName || 'Unknow',
                modifyTime: row.modifyTime || ''
            }) );
        } );

        // 渲染用户模板
        this.tplData.userTemplate.forEach( function (row) {
            arrHtml.push( _this.userTpl.formatEL({
                id: row.id,
                name: row.name,
                btns: ( function () {
                    if(AppConfig.userId === row.creatorId) {
                        return ['<span class="glyphicon glyphicon-edit grow btn-rt-corner"></span>',
                        '<span class="glyphicon glyphicon-remove-sign grow btn-rt-corner"></span>'].join('');
                    }
                    return '';
                }() ),
                creatorName: row.creatorName || 'Unknow',
                modifyTime: row.modifyTime || '',
                isMyTpl: row.creatorId == AppConfig.userId ? ' myTpl' : ''
            }) );
        } );

        // 添加 新增图标
        arrHtml.push('<div class="template template-add"><h3><span class="glyphicon glyphicon-plus" style="font-size: 28px;margin-left: -88px;"></span></h3></div>');

        this.$container.html( arrHtml.join('') );

        // 事件
        this.attachEvents();        
        this.attachItemsEvents( $('.template-item', this.$container) );
    };

    // 删除模板
    templatePanel.prototype.removeOne = function (data) {
        var _this = this;
        var tplId = data.id;

        var $item = _this.$container.children('[data-id="'+tplId+'"]');
        $item.remove();

        this.model.delete(tplId).done(function () {});
    };

    // 新增模板
    templatePanel.prototype.addOne = function (data) {
        var _this = this;
        var $item, data;
        var tpl = AppConfig.userId === 1 ? 'preTpl' : 'userTpl';

        // 添加 DOM
        $item = $(_this[tpl].formatEL({
            id: data.id,
            name: data.name,
            btns: ( function () {
                return ['<span class="glyphicon glyphicon-edit grow btn-rt-corner"></span>',
                '<span class="glyphicon glyphicon-remove-sign grow btn-rt-corner"></span>'].join('');
            }() ),
            creatorName : AppConfig.userProfile.fullname,
            modifyTime: new Date().format('yyyy-MM-dd HH:mm'),
            isMyTpl: ' myTpl'
        }) );

        $item.insertBefore( _this.$container.find('.template-add').eq(0) );

        this.model.create(data).done(function (rs) {
        });
    };

    templatePanel.prototype.updateOne = function (data) {
        var _this = this;
        var $tpl = $('[data-id="'+data.id+'"]', _this.$container);
        $tpl.find('.tplName').text(data.name);
        $tpl.find('.modifyTime').text(data.modifyTime);

        this.model.update(data).done(function () {});
    };

    templatePanel.prototype.findTemplateById = function (id) {
        var hit = null;
        var t, i, row, tpl;
        for(t in this.tplData){
            row = this.tplData[t];
            i = 0;
            while(tpl = row[i++]) {
                if(tpl.id === id) {
                    hit = tpl;
                    break;
                }
            }
            if(hit) return hit;
        }
        return null;
    };


    // 这里处理代理事件
    templatePanel.prototype.attachEvents = function () {
        var _this = this;
        var templates = _this.tplData[_this.tplType+'Template'];

        //  模板新增事件
        EventAdapter.on($(this.$container.find('.template-add')), 'click', function (e) {
        //this.$container.find('.template-add').on('click', function (e) {
            var template, i = 0, inputName;

            if(!AppConfig.projectId) {
                alert('Please choose a project in home page first.');
                return;
            }
            inputName = prompt('Please input template name: ');
            if(!inputName || $.trim(inputName).length == 0) return;
            templates.push({
                id: ObjectId(),
                creatorId: AppConfig.userId,
                modalList: [],
                name: inputName,
                projectId: AppConfig.projectId
            });

            e.stopPropagation();
        });

        // 模板删除事件
        EventAdapter.on(this.$container, 'click', '.glyphicon-remove-sign', function (e) {
        //this.$container.on( 'click', '.glyphicon-remove-sign', function (e) {
            var tplId, template, i = 0;

            if (confirm(I18n.resource.analysis.workspace.CONFIRM_TEMPLATE_DELETE)) {
                tplId = $(this).closest('.template-item').attr('data-id');
                while (template = templates[i++]) {
                    if(template.id === tplId) {
                        templates.splice(i-1, 1);
                        break;
                    }
                };
            }
            
            e.stopPropagation();
        } );

        // 模板编辑事件
        EventAdapter.on(this.$container, 'click', '.glyphicon-edit', function (e) {
        //this.$container.on( 'click', '.glyphicon-edit', function (e) {
            var tplId = $(this).closest('.template-item').attr('data-id');
            var template, i = 0;

            while (template = templates[i++]) {
                if(template.id === tplId) {
                    break;
                }
            };
            // 向 path 中添加一条信息
            template.templateId = template.id;
            _this.screen.path.push({
                type: 'CenterSliderPanel',
                title: template.name + ' [Template Edit Mode]',
                data: template
            });

            e.stopPropagation();
        } );

        // 模板应用事件
        EventAdapter.on(this.$container, 'click', '.template-item', function (e) {
        //this.$container.on( 'click', '.template-item', function (e) {
            e.stopPropagation();
            if(e.target.tagName.toLowerCase() == 'input') return;
            var tplId = this.dataset.id;
            var template = _this.findTemplateById(tplId);
            var modelName = template.name;
            var $divModalSel = $('#modelSelsect', ElScreenContainer);

            if ($divModalSel.length === 0) {
                $divModalSel = $('<div class="modal fade" id="modelSelsect" role="dialog" style="padding-top: 110px;"><div class="modal-dialog" role="document"><div class="modal-content">' +
                    '<div class="modal-header">'+
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                    '<h4 class="modal-title">' + I18n.resource.analysis.workspace.APPLICATION_TEMPLATE +  ' -  ' + modelName +
                    '</h4></div>' +
                    '<div class="modal-body">'+
                    '<p style="width:550px;margin:0 auto 10px;line-height:1.5;">' + I18n.resource.analysis.workspace.IS_SAVE_COPY_OF_TEMP + '</p>' +
                    '<p style="color:#A3A3A3;width:550px;margin:0 auto;line-height:1.5;">'+
                    I18n.resource.analysis.workspace.IF_SAVE_COPY +
                    '</p>' +
                    '</div>'+
                    '<div class="modal-footer">'+
                    '<button type="button" class="btn btn-default retain">'+ I18n.resource.analysis.workspace.SAVE +'</button>' +
                    '<button type="button" class="btn btn-default notRetain">'+ I18n.resource.analysis.workspace.NOT_SAVE +'</button>' +
                    '<button type="button" class="btn btn-default" data-dismiss="modal">'+ I18n.resource.analysis.workspace.CANCEL +'</button></div>' +
                    '</div></div></div>'
                );
                $(ElScreenContainer).append($divModalSel);
            }

            // 更换标题名称
            $('.modal-title', $divModalSel).html(I18n.resource.analysis.workspace.APPLICATION_TEMPLATE + '  -  ' + modelName);

            // 保留副本
            EventAdapter.on($('.retain', $divModalSel).off('click'), 'click', function (e) {
            //$('.retain', $divModalSel).off('click').one('click', function() {
                $divModalSel.modal('hide');
                // 切换到 workspace panel 视图
                _this.screen.path.splice(0, _this.screen.path.length, {
                    type: 'WorkspacePanel', title: I18n.resource.analysis.workspace.WORKSPACE_NAME, data: _this.screen.store.workspaces
                });
                
                _this.screen.store.workspaces.push({
                    id: ObjectId(),
                    name: template.name,
                    dsOwnerId: template.creatorId,
                    // 保留副本的情况下，modal id 需要重新生成
                    modalList: (function () {
                        var modalList = template.modalList.concat();
                        modalList.forEach(function (modal) {
                            modal.id = ObjectId();
                        });
                        return modalList;
                    } ()),
                    modifyTime: new Date().format('yyyy-MM-dd HH:mm')
                });
            });

            // 不保留副本
            EventAdapter.on($('.notRetain', $divModalSel).off('click'), 'click', function (e) {
            //$('.notRetain', $divModalSel).off('click').one('click', function() {
                $divModalSel.modal('hide');
                // 切换到 workspace panel 视图
                _this.screen.path.splice(0, _this.screen.path.length, {
                    type: 'WorkspacePanel', title: I18n.resource.analysis.workspace.WORKSPACE_NAME, data: _this.screen.store.workspaces
                });
                _this.screen.store.workspaces.push({
                    id: ObjectId(),
                    templateId: template.id,
                    name: template.name,
                    dsOwnerId: template.creatorId,
                    modalList: template.modalList,
                    modifyTime: new Date().format('yyyy-MM-dd HH:mm')
                });
            });

            $divModalSel.modal('show');
        });
        //模板名称编辑事件
        EventAdapter.on(this.$container, 'click', '.myTpl .tplNameEdit', function (e) {
        //this.$container.on('click','.myTpl .tplNameEdit', function(e){
            e.stopPropagation();
            var _that = this;
            //$(this).closest('.wsSet').attr('draggable',false);
            var oldName = $(this).prev('.tplName').html();
            var $editCt = $('<div style="position: absolute;top: 48%;left: 50%;margin-left: -50px;"></div>');
            var $input = $('<input type="text" style="display: inline-block; width: 120px;"/>').val(oldName);
            var $button = $('<button type="button" class="btn btn-default" style="display: inline-block;padding: 1px 5px;margin-left: 9px;margin-top: -2px;">OK</button>');//.click(function(e){
            EventAdapter.on($button, 'click', function (e) {
                e.stopPropagation();
                var newName = $input.val();
                $(_that).removeAttr('style');
                $(_that).prev('.tplName').show();
                //$(_that).show().attr('draggable',true);
                $input.remove();
                $(this).remove();

                if(!newName || newName.length == 0 || oldName == newName) return;
                var tplId = $(_that).closest('.userTemplate ').attr('data-id');
                var match = undefined;
                _this.tplData.userTemplate.forEach(function(userTpl){
                   if(userTpl.id == tplId){
                       match = userTpl;
                   }
                });

                if(match !== undefined) {
                    match.modifyTime = new Date().format('yyyy-MM-dd HH:mm');
                    match.name = newName;
                }
            });
            $(this).hide().prev('.tplName').hide();
            $editCt.append($input).append($button);
            $(this).after($editCt);
            $input.focus();
        });
    };

    templatePanel.prototype.detachEvents = function () {
        this.$container.off('click');
    };

    // 这里处理 item 事件，因为有些事件，用代理处理会有问题，比如 drag 系列事件、mouseover 事件等
    templatePanel.prototype.attachItemsEvents = function ($items) {

    };

    templatePanel.prototype.detachItemsEvents = function ($items) {

    };

    templatePanel.prototype.close = function () {
        // 清空 DOM
        // 使用 empty 可以清除 node 和其所包含的事件
        this.$container.empty();
        this.detachEvents();
    };

    return templatePanel;

} (window, jQuery, window.analysis.models.TemplateModel) );