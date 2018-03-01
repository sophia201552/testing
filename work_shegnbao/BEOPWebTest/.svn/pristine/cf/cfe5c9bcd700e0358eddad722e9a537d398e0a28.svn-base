;(function (exports, SuperClass) {

    function Modal() {
        SuperClass.apply(this, arguments);
    }

    Modal.prototype = Object.create(SuperClass.prototype);

    +function () {
        var DEFAULT_CHART_OPTIONS = '{\r\n\r\n}';
        
        this.DEFAULTS = {
            htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/chart/chartConfigModal.html'
        };

        this.init = function () {
            this.$modal           = $('.modal', this.$wrap);
            this.$modalCt         = $('.modal-content', this.$wrap);
            this.$formWrap        = $('.form-wrap', this.$wrap);
            this.$iptChartOptions = $('#iptChartOptions', this.$wrap);
            this.$btnChartType    = $('#btnChartType', this.$wrap);
            this.$btnTimeFormat   = $('#btnTimeFormat', this.$wrap);
            this.$btnTimePeriod   = $('#btnTimePeriod',this.$wrap);
            // drop area
            this.$btnSubmit       = $('#btnSubmit', this.$wrap);
            
            this.attachEvents();
        };

        // @override
        this.recoverForm = function(options) {
            var _this = this;
            var form = options.option;
            if (!form) {
                _this.reset();
            } else {
                this._setField('input', this.$iptChartOptions, form.chartOptions);
                this._setField('dropdown', this.$btnTimePeriod, form.timePeriod);
                this._setField('dropdown', this.$btnChartType, form.chartType);
                this._setField('dropdown', this.$btnTimeFormat, form.timeFormat);
            }

            if(options.points) {
                $(options.points).each(function(i, row){
                    if (options.points[i]) {
                        _this._setField('droparea', $($('.drop-area')[i]), options.points[i]);
                        if($('.drop-area', this.$wrap).closest('.col-md-9').children('.noData').length === 0){
                            $('.drop-area', this.$wrap).closest('.col-md-9').append('<div class="col-md-6 noData drop-area-wrap" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                            '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
                            )
                        }
                        $('.drop-area', this.$wrap).next('.spanDataDel').on('click',function(){
                            $(this).closest('.col-md-6').remove();
                        })
                    }
                });
            }
        };

        // @override
        this.reset = function () {
            var _this = this;
            this._setField('input', this.$iptChartOptions);
            this._setField('dropdown', this.$btnChartType);
            this._setField('dropdown', this.$btnTimeFormat);
            this._setField('dropdown', this.$btnTimePeriod);
            $('.divDataSource',this.$wrap).empty().append('<div class="col-md-6 noData drop-area-wrap" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
            )
        };

        this.attachEvents = function () {
            var _this = this;
            var $divDataSource = $('.divDataSource', this.$wrap);
            var $btnChartConfig = $('#btnChartConfig', this.$wrap);

            // 配置按钮事件
            $btnChartConfig.off().on('click', function () {
                var modelIns = _this.options.modalIns;
                var opt =  _this.$iptChartOptions.val() || DEFAULT_CHART_OPTIONS;

                CodeEditorModal.show({
                    js: opt
                }, function (code) {
                    var options = code.js || '';
                    try {
                        // 检测 js 对象的合法性
                        new Function('return ' + options)();
                    } catch (e) {
                        alert('图表配置中含有错误，将不会被保存！');
                    }

                    _this.$iptChartOptions.val(options);
                }, ['js']);
            });

            // 加号的拖拽区域的事件处理
            $divDataSource.on('click', '.noData',function(){
                var $this = $(this);
                $this.find('.glyphicon-plus').hide();
                $this.find('input').show();
                $this.find('input').focus();
            }).on('blur', 'div input',function(){
                var $this = $(this);
                if($this.val() === '' && $this.closest('.col-md-6').hasClass('noData')){
                    $this.hide();
                    $this.prev().show();
                }
                if($this.val() === '' && !$this.closest('.col-md-6').hasClass('noData')){
                    $this.closest('.col-md-6').remove();
                }
            }).on('change', 'div input',function(){
                var $this = $(this);
                if ($this.val() && $this.closest('.col-md-6').hasClass('noData')) {
                    $this.closest('.noData').removeClass('noData');
                    $this.parent().attr({'data-value':$this.val(),'title':$this.val()});
                    $this.closest('.col-md-9').append('<div class="col-md-6 noData drop-area-wrap" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                        '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
                    )
                } else if (!$this.closest('.col-md-6').hasClass('noData')){
                    $this.parent().attr({'data-value':$this.val(),'title':$this.val()});
                } else {
                    $this.hide();
                    $this.prev().show();
                }
            }).on('click', 'div .spanDataDel',function(){
                $(this).closest('.col-md-6').remove();
            });

            // 提交按钮事件
            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};
                var chartOptions;

                // 判断 JSON 格式是否正确
                chartOptions = (function (options) {
                    try {
                        new Function('return ' + options)();
                    } catch (e) {
                        return '';
                    }
                    return options;
                } ( this.$iptChartOptions.val().trim() ) );
                // 如果不正确，则不存储
                if (chartOptions) {
                    form.chartOptions = chartOptions;
                };

                form.chartType = this.$btnChartType.attr('data-value');
                form.timeFormat = this.$btnTimeFormat.attr('data-value');
                form.timePeriod = this.$btnTimePeriod.attr('data-value');
                modal.points = Array.prototype.map.call($('.drop-area', this.$wrap), function (row) {
                    return row.dataset.value;
                });
                modal.option = $.extend(false, modal.option, form);

                _this.$modal.modal('hide');
                modalIns.render();

                e.preventDefault();

            }.bind(this));
        };

    }.call(Modal.prototype);

    exports.ChartConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));