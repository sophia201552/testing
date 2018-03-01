// Factory 组件：模板
;(function (exports, tabsPackage) {

    var DEFAULTS = {
        tabs: []
    };

    function Template(container, options) {
        this.container = container;
        this.options = $.extend(false, {}, DEFAULTS, options);

        this.leftCtn = null;
        this.rightCtn = null;

        this.tabs = [];
        //AppConfig.module = "recognize";
    }

    +function () {

        this.show = function (tabs,treeNode) {
            var _this = this;
            _this.treeNode = treeNode;

            this._getHtml().done(function () {
                // tabs 逻辑处理
                _this._initTabs(tabs);
                // 事件
                _this._attachEvents();
            });
        };

        // 获取 html，填充至容器中
        this._getHtml = function () {
            return WebAPI.get('/static/app/DiagnosisEngine/scripts/template/template.html').then(function (html) {
                PanelToggle.panelCenter.innerHTML = html;
            });
        };

        // 绑定事件
        this._attachEvents = function () {
            var _this = this;
            var $litab = $('#templateTabs ul').children('li');
            $litab.off('click').on('click',function(){
                var $this = $(this);
                if(!$this.hasClass('liCheck')){
                    $this.addClass('liCheck');
                    $this.siblings().removeClass('liCheck');
                }
                var type = this.dataset.type;
                _this._showTab(type);
            })
        };

        // 初始化 tabs
        this._initTabs = function (tabs) {
            var _this = this;
            var tabs = tabs;
            var tpl = '<ul>';
            tabs.forEach(function (row) {
                tpl += '<li class="liTab" data-type="'+row+'">'+row+'</li>';
            });
            tpl += '</ul>';
            var clazz = tabsPackage[ 'EquipmentTab'];
            var ins;
            ins = new clazz(document.querySelector('#tabContent'));
            _this.tabs.push(ins);
            $('#templateTabs').append(tpl);
            // 默认显示第一个
            this._showTab($('#templateTabs ul li')[0].dataset.type);
        };

        // 显示一个 tab
        this._showTab = function (type) {
            var _this = this;
            var ins = this.tabs[0];
            //if (!ins) {
            //    Log.warn('the tab at index \''+idx+'\' is not a valiable TabClass.');
            //    return;
            //}
            //
            //// 隐藏其他的 tab
            //this.tabs.forEach(function (row) {
            //    row.hide();
            //});
            // 只显示指定的 tab
            //var type = this.options.tabs[idx];
            ins.show(type,false,_this.treeNode);
        };

        this.close = function () {
            // 销毁 tabs
            this.tabs.forEach(function (row) {
                row.close();
            });

            // 销毁 dom
            this.container.innerHTML = '';
            this.container = this.leftCtn = this.rightCtn = null;
        };

    }.call(Template.prototype);

    exports.Template = Template;
}(
    namespace('factory.components.template'),
    namespace('factory.components.template.tabs')
));
;(function (exports) {

    function Tab(container) {
        this.container = container;
        this.$domCache = null;

        this.toolCtn = null;
        this.itemCtn = null;

        this.store = null;
        this.list = [];
        this.type = null;
    }

    +function () {
        this.tabOptions = {
            title: '',
            toolsTpl: '',
            itemTpl:'',
            dataUrl: ''
        };

        // 将原始数据转换成显示需要的 View Object
        this.format2VO = function (data) {
            return data;
        };

        /**
         * 显示 Tab
         * @param  {boolean} fromCache 是否从缓存读取数据，此举旨在防止无意义的加载，缺省时为 true
         */
        this.show = function (type,fromCache,treeNode) {
            var _this = this;
            _this.type = type;
            _this.treeNode = treeNode;
            fromCache = typeof fromCache === 'undefined' ? true : fromCache;

            if (fromCache && typeof this.$domCache !== 'undefined') {
                // 尝试从缓存读取
                this.$domCache.appendTo(_this.container);
                return;
            }

            // 获取数据
            this.getData().done(function () {
                _this.render();
                _this.attachEvents();
            });
        };

        this.getData = function () {
            var _this = this;
            return WebAPI.get(this.tabOptions.dataUrl).then(function (rs) {
                _this.store = rs;
            });
        };

        // 渲染
        this.render = function () {
            this.renderTools();
            this.renderItems();
        };

        this.renderTools = function () {
            var _this = this;
            $('#tabName').empty().append(_this.tabOptions.toolsTpl.formatEL({type:_this.type}));
        };

        // 渲染模板项
        this.renderItems = function () {
            var _this = this;
            var arrHtml = [];

            this.store.forEach(function(row){
                var data = _this.format2VO(row);
                if(row.type === _this.type){
                    arrHtml.push(_this.tabOptions.itemTpl.formatEL({
                        _id:data._id,
                        srcPageId:data.srcPageId,
                        name:data.name
                    }));
                }
            })
            this.container.innerHTML = arrHtml.join('');
        };

        // 事件绑定
        this.attachEvents = function () {
            var _this = this;
            var $itemCtn = $(this.itemCtn);

            // 先清空已有事件
            $itemCtn.off();

            $itemCtn.on('click', '.tpl-item', function (e) {
                _this.onItemClickActionPerformed(e);
            });

            $itemCtn.on('click', '.tpl-item .slider-cb', function (e) {
                _this.onItemChangeActionPerformed(e);
            });
        };

        ////////////////
        // Events API //
        ////////////////
        /// START
        
        // 模板项被点击时的事件处理函数
        this.onItemClickActionPerformed = function () {
            throw new Error('"onItemClickActionPerformed" method need to be instantiate!');
        };

        // 模板项选中状态被更改时的事件处理函数
        this.onItemChangeActionPerformed = function () {
            throw new Error('"onItemChangeActionPerformed" method need to be instantiate!');
        };
        /// END

        // 隐藏 Tab
        this.hide = function () {
            this.$domCache = $(this.container).empty();
        };

        // 关闭 Tab
        this.close = function () {
            if (this.$domCache) {
                this.$domCache.remove();
                this.$domCache = null;
            }

            this.store = null;
            this.container.innerHTML = '';
            this.list = null;
        };

    }.call(Tab.prototype);

    exports.Tab = Tab;
} (
    namespace('factory.components.template.tabs')
));
;(function (exports, SuperClass) {

    function EquipmentTab() {
        SuperClass.apply(this, arguments);
    }

    EquipmentTab.prototype = Object.create(SuperClass.prototype);
    EquipmentTab.prototype.constructor = EquipmentTab;

    +function () {

        /** @override */
        this.tabOptions = {
            title: '<span>模板</span>',
            toolsTpl: '<span>{type}模板</span>',
            itemTpl:'<div class="divBox col-sm-2" data-id="{_id}"><div class="thumbnail"><img data-src-page-id="{srcPageId}" class="img-responsive" src="/static/app/DiagnosisEngine/themes/default/images/{srcPageId}.png"></div>' +
            '<div class="caption"><h3>{name}</h3></div></div>',
            dataUrl:'/diagnosisEngine/getTemplateList'
        };

        /** @override */
        this.getData = function () {
            var _this = this;
            return WebAPI.get(this.tabOptions.dataUrl).then(function (rs) {
                _this.store = rs.data;
            });
        };
        /** @override */
        this.attachEvents = function () {
            var _this = this;
            var $tabContent = $('#tabContent');
            $tabContent.children('.divBox').off().on('click',function(){
                var $this = $(this);
                var currentId = $this.attr('data-id');
                var data;
                _this.store.forEach(function(row){
                    if(row._id === currentId){
                        data = row;
                        data._id = _this.treeNode._id;
                        data.name = _this.treeNode.name;
                    }
                })
                infoBox.confirm('To determine the application templates?',function(){
                    WebAPI.post('/diagnosisEngine/saveThings',[data]).done(function(){
                        this.diagnosisScreen = new DiagnosisConfigScreen({
                            name: data.name,
                            projId: AppConfig.projectId,
                            thingId: data._id,
                            srcPageId: data.srcPageId,
                            type: data.type,
                            dictVariable: data.dictVariable
                        });
                        this.diagnosisScreen.show();
                        _this.treeNode.srcPageId = data.srcPageId;
                        TemplateTree.tree.updateNode(_this.treeNode);
                    })
                })
            })
        };

    }.call(EquipmentTab.prototype);

    exports.EquipmentTab = EquipmentTab;

} (
    namespace('factory.components.template.tabs'),
    namespace('factory.components.template.tabs.Tab')
));
