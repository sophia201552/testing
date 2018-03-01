;(function (exports) {

    function ReportTplPanel(screen) {
        this.close();

        this.screen = screen;
        this.container = screen.reportTplPanelCtn;
    }

    +function () {
        
        this.show = function () {
            // 获取模板数据
            this.__loadData().done(function (rs) {
                this.attachEvents();
            }.bind(this));
        };

        this.init = function () {
            var _this = this;
            var arrHtml;

            this.domGroupWrap = document.createElement('div');
            this.domGroupWrap.className = 'report-tpl-wrap';
            // this.domGroupWrap
            
            arrHtml = this.store.map(function (row) {
                return '<div class="report-tpl-item" data-id="'+row._id+'" draggable="true">'+row.name+'</div>';
            });

            this.domGroupWrap.innerHTML = arrHtml.join('');
            this.container.appendChild(this.domGroupWrap);
        };

        this.attachEvents = function () {
            var _this = this;

            $('.report-tpl-item', this.domGroupWrap).off().on('dragstart', function (e) {
                var template = _this.__findItemById(this.dataset.id);
                var dataTransfer = e.originalEvent.dataTransfer;

                dataTransfer.setData('layouts', JSON.stringify(template.content.layouts));
                dataTransfer.setData('type', 'template');
            });
        };

        this.__findItemById = function (id) {
            var rs = null;

            this.store.some(function (row) {
                if (row._id === id) {
                    rs = row;
                    return true;
                }
                return false;
            });

            return rs;
        };

        this.__loadData = function () {
            return WebAPI.get('/factory/material/get/report').then(function (rs) {
                this.store = rs;
                this.init();
            }.bind(this));
        };

        this.reload = function () {
            return this.__loadData();
        };

        this.close = function () {
            this.screen = null;
            this.store = null;
            this.domGroupWrap = null;
            this.container = null;
        };

    }.call(ReportTplPanel.prototype);

    exports.ReportTplPanel = ReportTplPanel;

} ( namespace('factory.panels') ));