
;(function (exports, SuperClass) {
    var clickTimer = null;
    var CLICK_DELAY = 500;

    function ProjectRecycleTab() {
        SuperClass.apply(this, arguments);
    }

    ProjectRecycleTab.prototype = Object.create(SuperClass.prototype);
    ProjectRecycleTab.prototype.constructor = ProjectRecycleTab;

    +function () {
        /** @override */
        this.tabOptions = {
            title:'<div class="divTab"><span class="glyphicon glyphicon-trash"></span>Project</div>',
            itemTpl: '<div class="tpl-item report-item" id="{_id}" data-id="{_id}"><span class="glyphicon glyphicon-book"></span>\
            <span class="tpl-item-name" style="width:auto;">{name_cn}</span></div>',
            toolsTpl: '<div class="paneTempButton">\
                    <div class="cleanAll" title="Clean Recycle Bin"><span class="glyphicon glyphicon-fire"></span></div>\
                    <div class="restoreAll" title="Restore all the items"><span class="glyphicon glyphicon-refresh"></span></div>\
                    <div class="divRestore" title="Restore" style="display:none;"><span class="glyphicon glyphicon-repeat"></span></div>\
                    <div class="divDelete" title="Remove" style="display: none;"><span class="glyphicon glyphicon-trash"></span></div>\
                </div>',
            dataUrl: '/factory/projectRecycle'
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
                    alert('没有项目可以进行操作！');
                    return;
                }
                var message = '确认要清空回收站？';
                var url = '/factory/projectRecycle/delete';
                _this.itemOperate(message,url,true);
            });
            $tabName.find('.restoreAll').off('click').on('click',function(){
                if($tabContent.find('.tpl-item').length ===0){
                    alert('没有项目可以进行操作！');
                    return;
                }
                var message = '确认要还原所有项目？';
                var url = '/factory/projectRecycle/restore';
                _this.itemOperate(message,url,true);
            });
            $tabName.find('.divRestore').off('click').on('click',function(){
                var message = '确认要还原选中项目？';
                var url = '/factory/projectRecycle/restore';
                _this.itemOperate(message,url,false);
            });
            $tabName.find('.divDelete').off('click').on('click',function(){
                var message = '确认要清空选中项目？';
                var url = '/factory/projectRecycle/delete';
                _this.itemOperate(message,url,false);
            });
        };
        this.renderItems = function (data) {
            var _this = this;
            var arrHtml = [];
            if(data){
                data.forEach(function (row) {
                    var rowData = _this.format2VO(row);
                    if(rowData.bindId){
                        var tpl = $(_this.tabOptions.itemTpl.formatEL(rowData)).append('<span>('+ rowData.bindId +')</span>');
                        arrHtml.push($('<div></div>').html(tpl).html());
                    }else{
                        arrHtml.push(_this.tabOptions.itemTpl.formatEL(rowData));
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
                    if(url.split('/')[3] === 'restore'){
                        FactoryLogin.prototype.createPro(AppConfig.userId);
                    }
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

    }.call(ProjectRecycleTab.prototype);

    exports.ProjectRecycleTab = ProjectRecycleTab;

} (
    namespace('factory.components.template.tabs'),
    namespace('factory.components.template.tabs.Tab')
));
