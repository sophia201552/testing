window.analysis = window.analysis || {};
window.analysis.panels = window.analysis.panels || {};

window.analysis.panels.WorkspacePanel = ( function (window, $, Model, undefined) {

    function WorkspacePanel(screen, wsList) {
        // analysisScreen 类对象
        this.screen = screen;
        this.wsList = wsList;

        this.model = new Model();
    };

    WorkspacePanel.prototype.tpl = '\
    <div class="wsSet ws-item{cls}{tplCls}" draggable="true" data-id ="{id}">\
        <div class="wsCtn">\
            <div class="dragHere"></div>\
            <span class="check-cb-wrap"><i class="check-cb"></i></span>\
            <div class="infoWrap">\
                <span class="name">{name}</span><span class="glyphicon glyphicon-pencil wsNameEdit"></span>\
                <div class="modifyTime">{modifyTime}</div>\
            </div>\
            <div class="btnWsRemove"><span class="glyphicon glyphicon-remove-sign"></span></div>\
        </div>\
    </div>';

    WorkspacePanel.prototype.show = function (container) {
        this.$container = $(container);
        this.init();
    };
    WorkspacePanel.prototype.init = function () {
        var _this = this;
        var arrHtml = [];
        this.screen.store.workspaces.forEach( function (row, i) {
            arrHtml.push( _this.tpl.formatEL({
                id: row.id,
                name: row.name || 'Untitled',
                modifyTime: timeFormat(row.modifyTime,timeFormatChange('yyyy-mm-dd hh:ii')) || '',
                cls: (function () {
                    if(row.modalCount !== undefined) {
                        len = row.modalCount;
                    } else {
                        len = row.modalList.length;
                    }
                    return len > 0 ? '' : ' empty';
                } ()),
                tplCls: row.templateId ? ' fromTemplate' : ''
            }) );
        } );
        arrHtml.push('<div class="wsSet ws-add empty">\
                        <div class="wsCtn">\
                            <h3 style="color: #fff;position: absolute;left: 66px;top: 40px;"><span class="glyphicon glyphicon-plus"></span></h3>\
                        </div>\
                    </div>');
        this.$container.html( arrHtml.join('') );

        // 事件
        this.attachEvents();        
        this.attachItemsEvents( $('.ws-item', this.$container) );
    };

    // 这里处理代理事件
    WorkspacePanel.prototype.attachEvents = function () {
        var _this = this;

        EventAdapter.on(this.$container, 'click', '.check-cb-wrap', function (e) {
        //this.$container.on( 'click', '.check-cb-wrap', function (e) {
            $(this).closest('.wsSet').toggleClass('on');
            e.stopPropagation();
        } );
        EventAdapter.on(this.$container, 'click', '.wsNameEdit', function (e) {
        //this.$container.on('click','.wsNameEdit',function(e){
            e.stopPropagation();
            var _that = this;
            var $wsSet = $(this).closest('.wsSet');
            $wsSet.attr('draggable',false);
            $wsSet.find('.dragHere')[0].style.cursor = 'initial';
            var oldName = $(this).prev('.name').html();
            var $input = $('<input type="text" style="display: inline-block; width: 120px;"/>').val(oldName);
            EventAdapter.on($input, 'click', function (e) {
                //.click( function (e) {
                    e.stopPropagation();
                } );
            var $button = $('<button type="button" class="btn btn-default" style="display: inline-block;padding: 1px 5px;margin-left: 9px;margin-top: -2px;">OK</button>');//.click(function(e){
            EventAdapter.on($button, 'click', function (e) {
                e.stopPropagation();
                var newName = $input.val();
                $(_that).removeAttr('style');
                $(_that).prev('.name').show();
                $(_that).closest('.wsSet').attr('draggable',true);
                $wsSet.find('.dragHere').removeAttr('style');
                $input.remove();
                $(this).remove();

                if(!newName || newName.length == 0 || oldName == newName) return;
                var wsId = $(_that).closest('.ws-item').attr('data-id');
                var match = getWorkspaceById(wsId);
                if(match !== undefined) {
                    match.name = newName;
                }
            });
            $(this).hide().prev('.name').hide();
            $(this).after($button).after($input);
            $input.focus();
        });
        EventAdapter.on(this.$container, 'click', '.ws-item', function (e) {
        //this.$container.on( 'click', '.ws-item', function (e) {
            var wsId = this.dataset.id;
            var match = getWorkspaceById(wsId);
            if(match !== undefined) {
                _this.screen.path.push({
                    type: 'CenterSliderPanel',
                    title: match.name,
                    data: match
                });
            }
            //保存最近打开的工作空间
            localStorage.setItem('lastOpenWorkspaceId_' + AppConfig.userId,wsId);
        } );
        EventAdapter.on(this.$container, 'click', '.btnWsRemove', function (e) {
        //this.$container.on('click','.btnWsRemove',function(e){
            e.stopPropagation();
            var wsId = $(this).closest('.ws-item').attr('data-id');
            var match = getWorkspaceById(wsId);
            //TODO 测试confirm
            confirm(I18n.resource.analysis.workspace.CONFIRM_WORKSPACE_DELETE, function () {
                if (match !== undefined) {
                    _this.screen.store.workspaces.forEach(function (ws, index) {
                        if (ws.id == wsId) {
                            _this.screen.store.workspaces.splice(index, 1);
                        }
                    });
                }
            });
        });
        EventAdapter.on(this.$container.find('.ws-add').off('click'), 'click', function (e) {
        //this.$container.find('.ws-add').off('click').on('click', function(e){
            e.stopPropagation();
            var ws = {
                id: ObjectId(),
                name: 'new Workspace',
                modalList: [],
                modifyTime: new Date().format('yyyy-MM-dd HH:mm')
            }
            _this.screen.store.workspaces.push(ws);
        });

        // 找到对应的 workspace 的数据
        function getWorkspaceById(wsId){
            var workspaces = _this.screen.store.workspaces;
            for (var i = 0, len = workspaces.length; i < len; i++) {
                if(workspaces[i].id === wsId) {
                    match = workspaces[i];
                    break;
                }
            }
            return match;
        }
    };

    WorkspacePanel.prototype.detachEvents = function () {
        this.$container.off('click');
    };

    // 这里处理 item 事件，因为有些事件，用代理处理会有问题，比如 drag 系列事件、mouseover 事件等
    WorkspacePanel.prototype.attachItemsEvents = function ($items) {
        this.attachDragEvents( $('.ws-item', this.$container) );
    };

    WorkspacePanel.prototype.detachItemsEvents = function ($items) {
    };

    // 新增一个 workspace
    // data 格式:
    // {
    //    workspaceName: WSName,
    //    modalList: []
    // }
    WorkspacePanel.prototype.addOne = function (data) {
        var _this = this;
        var $item, idList;
        var spinner;

        // 添加 DOM
        $item = $( _this.tpl.formatEL({
            id: data.id,
            name: data.name || 'Untitled',
            modifyTime: data.modifyTime || '',
            cls: data.modalList.length > 0 ? '' : ' empty',
            tplCls: data.templateId ? ' fromTemplate' : ''
        }) );

        _this.$container.find('.ws-add').before($item);

        // 如果是来自模板，需要去加载 dsInfoList
        if(data.dsOwnerId !== undefined) {
            idList = [];
            data.modalList.forEach(function (modal) {
                var itemDs = modal.option['itemDS'];
                if(itemDs && itemDs.length) {
                    itemDs.forEach(function (item) {
                        item['arrId'].forEach(function (dsId) {
                            // 去重
                            if( idList.indexOf(dsId) === -1 ) {
                                idList.push(dsId);
                            }
                        });
                    });
                }
            });

            if(idList.length > 0) {
                spinner = new LoadingSpinner({ color: '#00FFFF' });
                spinner.spin($item[0])
                WebAPI.post('/analysis/getDsList/' + data.dsOwnerId, {
                    idList: idList
                }).done(function (rs) {
                    if(!!rs['dsInfoList']) {
                        _this.screen.mergeDsInfoList(rs['dsInfoList']);
                    }
                }).always(function () {
                    spinner.stop();
                });
            }
        }

        this.model.create(data).done(function () {
            // 绑定事件
            _this.attachItemsEvents($item);
            // 开始缓存处理
            if(data.modalList && data.modalList.length) {
                Beop.cache.img.setByWsList([data]);
            }
        });
    };

    // 删除一个 workspace
    WorkspacePanel.prototype.removeOne = function (data) {
        var _this = this;
        var wsId = data.id;
        var modalList = data.modalList;

        var $workSpace = _this.$container.find('[data-id="'+wsId+'"]');
        modalList.forEach(function(row){
            localStorage.removeItem('ws_'+ wsId + '_modal_' + row.id);
        });
        $workSpace.remove();

        this.model.delete(wsId).done(function (result) {
            // 开始缓存处理
            Beop.cache.img.removeByWsList([data]);
        });
    };

    // 更新一个 workspace
    WorkspacePanel.prototype.updateOne = function (data) {
        var _this = this;
        $('[data-id="'+data.id+'"]', _this.$container).find('.name').text(data.name);

        this.model.update(data).done(function () {});
    };

    WorkspacePanel.prototype.close = function () {
        // 清空 DOM
        // 使用 empty 可以清除 node 和其所包含的事件
        this.$container.empty();
        this.detachEvents();
    };

    WorkspacePanel.prototype.attachDragEvents = function($items){
        var _this = this;
        var startIndex, $dragEle;
        var dataUrl;
        // 获取宽度和高度，以便定义拖拽的中心点
        var sliderWidth = $items.eq(0).width();
        var sliderHeight = $items.eq(0).height();

        $items.off('dragstart').on('dragstart', function (e) {
            var $target = $dragEle = $(e.target);
            
            // 记录开始时的位置下标
            startIndex = $target.index();
            dataUrl = $target[0].style.backgroundImage;

            $target[0].style.backgroundImage = 'none';
            $dragEle.addClass('on-drag');
        });

        $items.off('dragover').on('dragover', function (e) {
            var $target = $(e.target);
            var oEvent = e.originalEvent;
            var offset;
            if($target === $dragEle) return;
            // 处理冒泡来的事件
            if( !$target.hasClass('ws-item') ) $target = $target.closest('.ws-item');
            
            offset = $target.offset();
            // 如果鼠标位于 slider 的右半部分
            // 则将待移动 slidre 追加到当前 slider 后面
            if( (oEvent.pageX - offset.left) > sliderWidth/2 ) {
                $dragEle.insertAfter($target);
            }
            // 如果鼠标位于 slider 的左半部分
            // 则将待移动 slidre 插入到当前 slider 前面
            else {
                $dragEle.insertBefore($target);
            }
            e.stopPropagation();
        });

        $items.off('dragend').on('dragend', function (e) {
            var endIndex = $dragEle.index();

            $dragEle[0].style.backgroundImage = dataUrl;
            $dragEle.removeClass('on-drag');

            _this.wsList.move(startIndex, endIndex);
        });
    };

    return WorkspacePanel;

} (window, jQuery, window.analysis.models.WorkspaceModel) );