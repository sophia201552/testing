;(function (exports, SuperClass) {
    // 单独使用一个 spinner，用于数据加载时的 laoding
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });

    function ReportContainer() {
        SuperClass.apply(this, arguments);
        window.PageRenderComplete = false;
    }

    ReportContainer.prototype = Object.create(SuperClass.prototype);
    ReportContainer.prototype.constructor = ReportContainer;

    +function () {
        /** @override */
        this.optionTemplate = Mixin(this.optionTemplate, {
            group: '基本',
            name: 'I18n.resource.report.REPORT_RIGHT_NAME',
            minWidth: 12,
            minHeight: 6,
            maxWidth: 12,
            maxHeight: 6,
            spanC: 12,
            spanR: 12,
            type: 'ReportContainer',
            className: 'root-container'
        });

        /** @override */
        this.initTools = function(tools) {
            tools = tools || ['variable', 'layouts'];
            SuperClass.prototype.initTools.call(this, tools);
        };

        /** @override */
        this.render = function (isProcessTask) {
            this.registVariableProcessTask(this.entity.modal.variables).done(function (variables) {
                // 保存 variables
                this.variables = variables;
            }.bind(this));
            var promise = undefined;
            if(this.entity.modal.option.layoutScript){
                var timeOption = this.getReportOptions();
                var script = this.entity.modal.option.layoutScript.formatEL({
                    outStartTime: timeOption.startTime,
                    outEndTime: timeOption.endTime,
                    lan: I18n.type,
                    projectId: AppConfig.projectId,
                    period:this.entity.modal.option.period
                })
                var fun = new Function(script);
                try {
                    promise = fun();
                } catch (error) {
                    alert('自定义layouts代码错误');
                    promise = undefined;
                }
                
                if(!promise){
                    promise = $.Deferred();
                    promise.resolve();
                }else{
                    this.loadingLayoutScript = promise;
                }
            }else{
                promise = $.Deferred();
                promise.resolve();
            }
            promise.done(function(layouts){
                if(layouts){
                    this.entity.modal.option.layouts = layouts[0].modal.option.layouts;
                    if(layouts[0].modal.type == 'DiagnosisBlock'){
                        this.entity.modal.option.layouts = layouts;
                    }
                }
                if (!this.children.length) {
                    this.initLayout();
                } else {
                    this.children.forEach(function (row) {
                        row.render();
                    });
                }

                if (isProcessTask === true) {
                    var _this = this;
                    AppConfig.isReportConifgMode && Spinner.spin(document.body);
                    this.processTask(null).always(function () {
                        // 汇总信息需要等到页面数据加载完毕才进行渲染
                        Spinner.stop();
                        this.refreshSummary();
                        
                        // loaded
                        this.onLoad();
                        
                    }.bind(this));
                }

                // 刷新标题
                this.refreshTitle();
                if(this.entity.modal.option.layoutScript){
                    this.renderTree();
                }
            }.bind(this));
        };

        this.onLoad = function () {
            // phantom
            console.log('phantom - render summary complete');
            window.PageRenderComplete = true;
            document.getElementsByTagName('html')[0].classList.add('renderComplete')
        }

        this.destroy = function(){
            if(this.loadingArr){//取消未完成的请求
                this.loadingArr.forEach(loading=>{
                    loading.abort&&loading.abort();
                });
                this.loadingArr = undefined;
            }
            if(this.loadingLayoutScript){
                this.loadingLayoutScript.reject && this.loadingLayoutScript.reject();
                this.loadingLayoutScript = undefined;
            }
            this.variableProcessTasks.length = 0;
            SuperClass.prototype.destroy.apply(this, arguments);
        }

        /** @override */
        this.clear = function(){
            SuperClass.prototype.clear.apply(this, arguments);
        }

    }.call(ReportContainer.prototype);

    exports.ReportContainer = ReportContainer;

} ( namespace('factory.report.components'), 
    namespace('factory.report.components.Container')
));