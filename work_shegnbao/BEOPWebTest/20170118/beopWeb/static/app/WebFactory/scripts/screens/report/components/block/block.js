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
            tools = tools || ['variable', 'configure', 'remove'];
            SuperClass.prototype.initTools.call(this, tools); 
        };

        /** @override */
        this.initDropEvents = function () { /** 不需要 drop */ };

        /** @override */
        this.render = function (isProcessTask) {
            var _this = this;
            var promise = $.Deferred();
            var dataId = this.entity.modal.option.dataId;

            while (row = _this.children.pop()) {
                row.destroy();
            }

            if (!dataId || dataId === '-1') {
                return;
            }
            var url;
            if(this.entity.modal.option.findType === 'name'){
                url = '/factory/reportDataByName?name='+encodeURI(dataId)+'&date='+this.transformToSupportingDateFormat( this.getReportDate() );
            }else{
                url = '/factory/reportData/' + dataId + '/' + this.transformToSupportingDateFormat( this.getReportDate() );
            }

            // 同步拉数据
            $.ajax({
                type:'get',
                url: url,
                contentType: 'application/json',
                async: false
            }).done(function (rs) {
                var row;
                if (rs.status !== 'OK') {
                    if(AppConfig.isReportConifgMode){
                        alert(rs.msg);
                        return;
                    }else{  
                        _this.showNoData();
                        return;
                    }
                }
                $(_this.container).html("");
                _this.store = _this.formatBlockData(rs.data);

                _this.initLayout(_this.store || []);

                if (isProcessTask === true) {
                    _this.root.processTask();
                }

                _this.root.refreshTitle();
                _this.root.refreshSummary();
            });
        };

        // 将日期格式转换成
        this.transformToSupportingDateFormat = function (dateStr) {
            return dateStr.toDate().format('yyyy-MM-dd');
        };

        this.showNoData = function () {
            var str = '<div style="margin: 0 auto;width: 500px;height: 160px;margin-top:200px;">\
                            <img src="/static/images/project_img/report.png" alt="report">\
                            <div style="display:inline-block;margin-left:50px;"><p><strong i18n="observer.reportScreen.REPORT_FAIL_INFO">当前报表尚未生成</strong></p></div>\
                        </div>'
            $(this.container).html(str);  
        };
        /**
         * 格式化动态块数据
         */
        this.formatBlockData = function (data) {
            return JSON.parse(data.content);
        };

        /** @override */
        this.refreshTitle = function (chapterNo, isHideNo) {
            // 更新 title
            var containerChildren = [], i = 0;

            containerChildren = this.children.filter(function (row) {
                return row instanceof exports.Container;
            });

            chapterNo = chapterNo ? (chapterNo + '.') : chapterNo;
            containerChildren.forEach(function (row) {
                var num = row.refreshTitle(chapterNo + (i+1), isHideNo);
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

        /**
         * @override
         */
        this.isChildrenReadonly = function () {
            return true;
        };

    }.call(Block.prototype);

    exports.Block = Block;

} ( namespace('factory.report.components'),
    namespace('factory.report.components.Container') ));