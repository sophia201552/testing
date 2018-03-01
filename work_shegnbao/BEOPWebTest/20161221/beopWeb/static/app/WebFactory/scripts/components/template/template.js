// Factory 组件：模板
;(function (exports, tabsPackage) {

    //var DEFAULTS = {
    //    tabs: ['Report','Page','Layer','Widget','Image']
    //};
    var DEFAULTS = {
         modules: [
        {'title':'Template',data: ['Report','Page','Layer','Widget','Image']},
        {'title':'Recycle',data: ['Page','Project']}
    ]};

    function Template(container, options) {
        this.container = container;
        this.options = $.extend(false, {}, DEFAULTS, options);

        this.leftCtn = null;
        this.rightCtn = null;

        this.tabs = {};
        this.activeTabIns = null;
    }

    +function () {

        this.show = function () {
            var _this = this;
            this._getHtml().done(function () {
                // tabs 逻辑处理
                _this._initTabs();
                // 事件
                _this._attachEvents();
            });
        };

        // 获取 html，填充至容器中
        this._getHtml = function () {
            var _this = this;
            return WebAPI.get('/static/app/WebFactory/scripts/components/template/template.html').then(function (html) {
                _this.container.innerHTML = html;
                _this.leftCtn = _this.container.querySelector('#templateLeft');
                _this.rightCtn = _this.container.querySelector('#templateRight');
            });
        };

        // 绑定事件
        this._attachEvents = function () {
            var _this = this;
            var $divTab = $('.divTab', this.leftCtn);
            $divTab.off('click').on('click', function() {
                var $this = $(this);
                $divTab.removeClass('divCheck');
                $this.addClass('divCheck');
                $this.parent().siblings().find('.treeTemplate').hide();
                var currentTreeTemplate = $this.next('.treeTemplate');
                if(currentTreeTemplate.css('display') === 'none'){
                    currentTreeTemplate.show();
                }else{
                    currentTreeTemplate.hide();
                }
                _this._showTab( $(this).parent('.tab-item')[0].dataset.type );
            });
        };

        // 初始化 tabs
        this._initTabs = function () {
            var _this = this;
            var tabs = this.options.modules;
            var domContainer = this.rightCtn.querySelector('#tabContent');

            tabs.forEach(function (item) {
                var arrHtml = [];
                var title = item.title;
                item.data.forEach(function(row){
                    var clazz, ins;
                    var arr, type, options;

                    if (typeof row === 'object') {
                        type = row.type;
                        options = row.options;
                    } else {
                        type = row;
                    }

                    if(title === 'Template'){
                        type = type.substr(0, 1).toUpperCase() + type.substr(1);
                    }else{
                        type = type.substr(0, 1).toUpperCase() + type.substr(1) + title;
                    }
                    //type = type.substr(0, 1).toUpperCase() + type.substr(1);
                    arr = type.split('.');

                    clazz = tabsPackage[arr[0] + 'Tab'];

                    if (!clazz) {
                        Log.warn('template tab type not supportted: ' + type);
                        return;
                    }

                    ins = new clazz(_this, domContainer, $.extend(false, $.extend(false, _this.options.tabOptions, options)) );
                    _this.tabs[type] = ins;

                    // 生成左侧导航部分
                    arrHtml.push('<li class="tab-item" data-type="'+ type +'">' + ins.tabOptions.title + '</li>');
                });
                _this.leftCtn.querySelector('#ul'+ item.title +'Tabs').innerHTML = arrHtml.join('');
                $(_this.leftCtn).find('#div'+ item.title).show();
            });

            // 默认显示第一个
            this._showTab( Object.keys(this.tabs)[0] );
        };

        // 显示一个 tab
        this._showTab = function (type) {
            var _this = this;
            var ins = this.tabs[type];
            var $tabItems;

            if (!ins) {
                Log.warn('the tab with type \''+type+'\' is not a valiable TabClass.');
                return;
            }

            // 切换左侧 tab 页的高亮样式
            $tabItems = $('.tab-item', this.leftCtn);
            $tabItems.find('.divTab').removeClass('divCheck');
            $tabItems.filter('[data-type="'+type+'"]').find('.divTab').addClass('divCheck');
            $(this.rightCtn).attr('data-type',type);

            // 隐藏当前的 tab
            this.activeTabIns && this.activeTabIns.hide();
            this.activeTabIns = ins;
            ins.list = [];
            // 只显示指定的 tab
            ins.show();
        };

        this.close = function () {
            var _this = this;
            // 销毁 tabs
            Object.keys(this.tabs).forEach(function (row) {
                var tab = _this.tabs[row];
                tab.close();
            });

            // 销毁 dom
            this.container.innerHTML = '';
            this.container.parentNode.removeChild(this.container);
            this.container = this.leftCtn = this.rightCtn = null;

            typeof this.options.onClose === 'function' && this.options.onClose();
        };

    }.call(Template.prototype);

    exports.Template = Template;
}(
    namespace('factory.components.template'),
    namespace('factory.components.template.tabs')
));