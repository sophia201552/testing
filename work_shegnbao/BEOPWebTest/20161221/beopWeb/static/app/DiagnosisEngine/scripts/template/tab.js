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