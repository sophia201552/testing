
;(function (exports, SuperClass) {
    var clickTimer = null;
    var CLICK_DELAY = 500;

    function PageRecycleTab() {
        SuperClass.apply(this, arguments);
    }

    PageRecycleTab.prototype = Object.create(SuperClass.prototype);
    PageRecycleTab.prototype.constructor = PageRecycleTab;

    +function () {
        this.groupItemGroup = '<div class="tpl-item group-item" id="{_id}" data-id="{_id}" data-type="{type}" data-parentid ="{parent}"><span class="glyphicon glyphicon-folder-open"></span>\
        <span class="tpl-item-name" title="{text}">{text}</span></div>';
        /** @override */
        this.tabOptions = {
            title:'<div class="divTab"><span class="glyphicon glyphicon-trash"></span>Page</div>',
            itemTpl: '<div class="tpl-item report-item" id="{_id}" data-id="{_id}" data-type="{type}" data-parentid ="{parent}"><span class="glyphicon glyphicon-file"></span>\
            <span class="tpl-item-name">{text}</span></div>',
            toolsTpl: '<div class="paneTempButton">\
                    <div class="cleanAll" title="Clean Recycle Bin"><span class="glyphicon glyphicon-fire"></span></div>\
                    <div class="restoreAll" title="Restore all the items"><span class="glyphicon glyphicon-refresh"></span></div>\
                    <div class="divRestore" title="Restore" style="display:none;"><span class="glyphicon glyphicon-repeat"></span></div>\
                    <div class="divDelete" title="Remove" style="display: none;"><span class="glyphicon glyphicon-trash"></span></div>\
                </div>',
            dataUrl: '/factory/pageRecycle'
        };
        /** @override */
        this.attachEvents = function () {
            var _this = this;
            var $tabContent = $('#tabContent', this.domWrap);
            var $tabName = $('#tabName', this.domWrap);
            $tabContent.off('dblclick click','.group-item').on('dblclick','.group-item',function(){
                return;
            });
            $tabName.find('.cleanAll').off('click').on('click',function(){
                if($tabContent.find('.tpl-item').length ===0){
                    alert(I18n.resource.admin.templateTooltip.NO_PAGE_OPRATE);
                    return;
                }
                var message = I18n.resource.admin.templateTooltip.CONFIRM_EMPTY;
                var url = '/factory/recycle/delete';
                _this.itemOperate(message,url,true);
            });
            $tabName.find('.restoreAll').off('click').on('click',function(){
                if($tabContent.find('.tpl-item').length ===0){
                    alert(I18n.resource.admin.templateTooltip.NO_PAGE_OPRATE);
                    return;
                }
                var message = I18n.resource.admin.templateTooltip.CONFIRM_INSTORE;
                var url = '/factory/recycle/restore';
                _this.itemOperate(message,url,true);
            });
            $tabName.find('.divRestore').off('click').on('click',function(){
                var message = I18n.resource.admin.templateTooltip.CONFIRM_SELECTED_INSTORE;
                var url = '/factory/recycle/restore';
                _this.itemOperate(message,url,false);
            });
            $tabName.find('.divDelete').off('click').on('click',function(){
                var message = I18n.resource.admin.templateTooltip.CONFIRM_SELECTED;
                var url = '/factory/recycle/delete';
                _this.itemOperate(message,url,false);
            });
        };
        this.renderItems = function (data) {
            var _this = this;
            var arrHtml = [];
            if(data){
                data.forEach(function (row) {
                    var rowData = _this.format2VO(row);
                    if(rowData.type != 'DropDownList'){
                        arrHtml.push(_this.tabOptions.itemTpl.formatEL(rowData));
                    }else{
                        arrHtml.push(_this.groupItemGroup.formatEL(rowData));
                    }
                });
            }
            this.container.innerHTML = arrHtml.join('');
        };
        this.itemOperate = function (message,url,all) {
            var $tabContent = $('#tabContent', this.domWrap);
            confirm(message,function(){
                var allItem;
                if(all){
                    allItem = $tabContent.children('.tpl-item');
                }else{
                    allItem = $tabContent.find('.active');
                }
                var allItemId  = [];
                allItem.each(function(){
                    allItemId.push($(this).attr('id'));
                });
                var data = {
                    ids:allItemId
                };
                WebAPI.post(url,data).done(function(){
                    allItem.remove();
                })
            },function(){
                return;
            })
        };
        //
        this.toolsTpl = function () {
            var $tabName = $('#tabName', this.domWrap);
            var $tabContent = $('#tabContent', this.domWrap);
            if($tabContent.find('.active').length === 0){
                $tabName.find('.divRestore').hide();
                $tabName.find('.divDelete').hide();
            }else{
                $tabName.find('.divRestore').show();
                $tabName.find('.divDelete').show();
            }
        }

    }.call(PageRecycleTab.prototype);

    exports.PageRecycleTab = PageRecycleTab;

} (
    namespace('factory.components.template.tabs'),
    namespace('factory.components.template.tabs.Tab')
));