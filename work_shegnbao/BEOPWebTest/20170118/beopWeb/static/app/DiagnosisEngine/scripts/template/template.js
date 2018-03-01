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