;(function (exports, SuperClass) {

    function Block() {
        SuperClass.apply(this, arguments);

        this.store = null;
    }

    Block.prototype = Object.create(SuperClass.prototype);
    Block.prototype.constructor = Block;

    +function () {

        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            name: 'I18n.resource.report.optionModal.BLOCK',
            type: 'Block',
            spanC: 12,
            spanR: 4,
            className: 'block-container'
        });

        /** @override */
        this.initEntity = function () {
            var options = this.entity.modal.option;
            if ( typeof options.dataId === 'undefined') {
                options.dataId = '';
            }
        };

        /** @override */
        this.initTools = function (tools) {
            tools = tools || ['tplParamsConfigure', 'configure', 'remove'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        /** @override */
        this.initDropEvents = function () { /** 不需要 drop */ };

        /** @override */
        this.render = function (isProcessTask) {
            var _this = this;
            var promise = $.Deferred();
            var dataId = this.entity.modal.option.dataId;
            var date;

            while (row = _this.children.pop()) {
                row.destroy();
            }

            if (!dataId || dataId === '-1') {
                return;
            }

            date = (function () {
                var now = new Date();
                var reportDate = _this.getReportDate();
                var formatStr;

                switch(reportDate) {
                    case 'month':
                        formatStr = 'yyyy-MM';
                        break;
                    case 'year':
                        formatStr = 'yyyy';
                        break;
                    case 'day':
                    default:
                        formatStr = 'yyyy-MM-dd';
                        break;
                }
                return new Date().format(formatStr);
            } ());

            // 同步拉数据
            $.ajax({
                type:'get',
                url: '/factory/reportData/' + dataId + '/' + date,
                contentType: 'application/json',
                async: false
            }).done(function (rs) {
                var row;
                if (rs.status !== 'OK') {
                    alert(rs.msg);
                    return;
                }
                _this.store = JSON.parse(rs.data.content);

                _this.initLayout(_this.store || []);

                if (isProcessTask === true) {
                    _this.root.processTask();
                }

                _this.root.refreshTitle();
                _this.root.refreshSummary();
            });
        };

        /** @override */
        this.refreshTitle = function (chapterNo) {
            // 更新 title
            var containerChildren = [], i = 0;

            containerChildren = this.children.filter(function (row) {
                return row instanceof exports.Container;
            });

            // 将章节号后退一级（忽视掉 Block 本身）
            // chapterNo = chapterNo ? chapterNo.substring(0, chapterNo.length-2) : '';
            chapterNo = chapterNo ? (chapterNo + '.') : chapterNo;
            containerChildren.forEach(function (row) {
                var num = row.refreshTitle( chapterNo + (i+1) );
                if (num) {
                    i = i+num;
                } else {
                    i = i+1;
                }
            });

            return i;
        };

        /**
         * @override
         */
        this.hasChapterNo = function () {
            return false;
        };

    }.call(Block.prototype);

    exports.Block = Block;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Container') ));