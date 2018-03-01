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
            I18n.fillArea(this.$modal);
            this.attachEvents();
        };

        this.droparea = function (type, $ele, value) {
            var name;
            switch(type) {
                // 数据源拖拽区域
                case 'droparea':
                    // reset
                    if(!value || value.trim() === '') {
                        $ele.attr('data-value', '').html('<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;">');
                    }
                    // recover
                    else {
                        // 获取数据源的名称
						name = AppConfig.datasource.getDSItemById(value).alias;
						if(/^[a-z0-9]{24}$/.test(value)){
	                      	$ele.attr({'data-value': value,
	                          	'title': name}).html('<input value="' + (name || value) + '" type="text">');
						}else{
							var projId = AppConfig.datasource.getDSItemById(value).projId;
	                        var str = (name?("@"+projId+"|"+name):value);
	                        console.log(AppConfig.datasource.getDSItemById(value));
	                        $ele.attr({'data-value': value,
	                            'title': name}).html('<input value="' + str + '" type="text">');
						}
                        $ele.parent('.drop-area-wrap').removeClass('noData');
                    }
                    break;
                // some more...
                default:
                    break;
            }
        }

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
                options.points.forEach(function(point, i) {
                    _this.droparea('droparea', $($('.drop-area')[i]), point);
                    if($('.drop-area', this.$wrap).closest('.col-md-9').children('.noData').length === 0) {
                        $('.drop-area', this.$wrap).closest('.col-md-9').append('<div class="col-md-12 drop-area-wrap noData" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                        '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div>'+
                        '<div class="drop-text" style="display: none;"><input type="text" i18n="placeholder=report.chartConfig.INTER_WORD"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
                        )
                    }
                    I18n.fillArea($('.drop-area'));
                    _this.dataDeal();
                });
            }
            var $haveData = $('.drop-area-wrap:not(".noData")');
            if(form.legend){
                form.legend.forEach(function(lengend,i){
                    $($('.drop-text')[i]).show();
                    $($('.drop-text')[i]).children('input').val(lengend);
                })
            }else if($haveData.length>0){
                $haveData.find('.drop-text').show();
            }
        };

        // @override
        this.reset = function () {
            var _this = this;
            this._setField('input', this.$iptChartOptions);
            this._setField('dropdown', this.$btnChartType);
            this._setField('dropdown', this.$btnTimeFormat);
            this._setField('dropdown', this.$btnTimePeriod);
            $('.divDataSource',this.$wrap).empty().append('<div class="col-md-12 drop-area-wrap noData" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div>' +
                '<div class="drop-text" style="display: none;"><input type="text" i18n="placeholder=report.chartConfig.INTER_WORD"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
            )
            I18n.fillArea($('.divDataSource'));
            _this.dataDeal();
        };

        this.dataDeal = function(){
            var _this = this;
            var $divDataSource = $('.divDataSource');
             // 加号的拖拽区域的事件处理
            $divDataSource.children('.noData').on('click', '.drop-area',function(){
                var $this = $(this);
                $this.find('.glyphicon-plus').hide();
                $this.find('input').show();
                $this.find('input').focus();
            }).on('blur', '.drop-area input',function(){
                var $this = $(this);
                if($this.val() === '' && $this.closest('.drop-area-wrap').hasClass('noData')){
                    $this.hide();
                    $this.prev('.glyphicon-plus').show();
                }else if($this.val() === '' && !$this.closest('.drop-area-wrap').hasClass('noData')){
                    $this.closest('.drop-area-wrap').remove();
                }else{
					if(/^[a-z0-9]{24}$/.test($this.closest('.drop-area').attr('data-value'))){
						return;
					}
					$this.closest('.drop-area').siblings('.drop-text').show();
                	if($this.val().indexOf('@') === 0){
	                    var currentPoint = $this.val().split('@')[1];
	                    if($this.val().indexOf('|') < 0){
	                        alert(I18n.resource.mainPanel.exportModal.POINT_FORMAT_ERROR);
//	                        $this.closest('.drop-area-wrap').remove();
	                        $this.closest('.drop-area').attr('data-state', '0');
	                        $this.closest('.drop-area').siblings('.drop-text').hide();
	                        _this.dataDeal();
	                        return;
	                    }
	                    var currentId = currentPoint.split('|')[0];
	                    var currentVal = currentPoint.split('|')[1];
	                    if(currentVal === ''){
	                        alert(I18n.resource.mainPanel.exportModal.POINT_FORMAT_ERROR);
	                        $this.closest('.drop-area').attr('data-state', '0');
	                        $this.closest('.drop-area').siblings('.drop-text').hide();
	                        _this.dataDeal();
	                        return;
	                    }else{
	                        currentVal = '^'+currentPoint.split('|')[1]+'$';
	                    }
	                    WebAPI.get('/point_tool/searchCloudPoint/'+ currentId +'/'+ currentVal).done(function(result){
	                        var data = result.data;
	                        if (data.total === 1) {

	                        }else{
	                            alert(I18n.resource.mainPanel.exportModal.NO_POINT);
	                            $this.closest('.drop-area').attr('data-state', '0');
	                            $this.closest('.drop-area').siblings('.drop-text').hide();
	                        }
	                        _this.dataDeal();
	                    }).always(function(){
	
	                    });
                	} else {
	                    var project = AppConfig.project;
	                    var currentVal = '^'+$this.val()+'$';
	                    if(project.bindId){
	                        var currentId = project.bindId;
	                        WebAPI.get('/point_tool/searchCloudPoint/'+ currentId +'/'+ currentVal).done(function(result){
	                            var data = result.data;
	                            if(data.total === 1){
									
	                            }else{
	                                alert(I18n.resource.mainPanel.exportModal.NO_POINT);
	                                $this.closest('.drop-area').attr('data-state', '0');
	                                $this.closest('.drop-area').siblings('.drop-text').hide();
	                            }
	                            
	                            _this.dataDeal();
	                        }).always(function(){
								
	                        });
	                    }else{
	                        alert(I18n.resource.mainPanel.exportModal.PROJECT_ID_ERROR);
	                        $this.closest('.drop-area').attr('data-state', '0');
	                        $this.closest('.drop-area').siblings('.drop-text').hide();
	                        _this.dataDeal();
	                        return;
	                    }
	                }
	                
                }
            }).on('keydown', '.drop-area input', function (e) {
                var ev = e || window.event;
                if (ev.keyCode === 13) {
                    this.blur();
                }
            }).on('change', '.drop-area input', function () {
                var $this = $(this);
                if ($this.val() && $this.closest('.drop-area-wrap').hasClass('noData')) {
                    $this.closest('.noData').removeClass('noData');
                    $this.parent().attr({'data-value':$this.val(),'title':$this.val()});
                    $this.closest('.divDataSource').append('<div class="col-md-12 noData drop-area-wrap" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                        '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div>' +
                        '<div class="drop-text" style="display: none;"><input type="text" i18n="placeholder=report.chartConfig.INTER_WORD"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
                    );
                    I18n.fillArea($this.closest('.divDataSource'));
                } else if (!$this.closest('.drop-area-wrap').hasClass('noData')){
                	$this.closest('.drop-area').attr('data-state','1');
                    $this.parent().attr({'data-value':$this.val(),'title':$this.val()});
                } else {
                    $this.hide();
                    $this.prev('.glyphicon-plus').show();
                }
            }).on('click', '.spanDataDel',function(){
                $(this).closest('.drop-area-wrap').remove();
            });
            // 数据源拖拽的事件处理
            $divDataSource.children().off('dragover', '.drop-area').on('dragover', '.drop-area', function (e) {
                e.preventDefault();
            });
            $divDataSource.children().off('dragenter', '.drop-area').on('dragenter', '.drop-area', function (e) {
                $(e.target).addClass('on');
                e.preventDefault();
                e.stopPropagation();
            });
            $divDataSource.children().off('dragleave', '.drop-area').on('dragleave', '.drop-area', function (e) {
                $(e.target).removeClass('on');
                $(e.target).parent('.drop-area-wrap').removeClass('noData');
                e.stopPropagation();
            });
            $divDataSource.children().off('drop', '.drop-area').on('drop', '.drop-area', function (e) {
                var itemId = EventAdapter.getData().dsItemId;
                var $target = $(e.target);
                var name;
                if(!itemId) return;
                $target.removeClass('on');
                $target.parent('.drop-area-wrap').removeClass('noData');
                if ($target.closest('.divDataSource').children('.noData').length === 0) {
                    $target.closest('.divDataSource').append('<div class="col-md-12 drop-area-wrap noData" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                        '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div>' +
                        '<div class="drop-text" style="display: none;"><input type="text" i18n="placeholder=report.chartConfig.INTER_WORD"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
                    )
                };
                I18n.fillArea($target.closest('.divDataSource'));
                _this.droparea('droparea', $target, itemId);
                $target.siblings('.drop-text').show();
                e.stopPropagation();
                _this.dataDeal();
            });
        }

        this.attachEvents = function () {
            var _this = this;
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
                        alert('I18n.resource.report.chartConfig.WRONG_INFO');
                    }

                    _this.$iptChartOptions.val(options);
                }, ['js']);
            });

            _this.dataDeal();

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
                modal.points = [];
                modal.option.legend = [];
                $('.drop-area-wrap:not(".noData")', this.$wrap).each(function () {
                	var target = $(this).find('.drop-area').not("[data-state='0']")[0];
                	if(target){
                		var value = target.dataset.value;
	                    var text = $(this).find('.drop-text').children('input').val();
	                    value && modal.points.push(value);
	                    if(text){
	                        modal.option.legend.push(text);
	                    }else{
	                        modal.option.legend.push('');
	                    }
                	}
                    
                });
                modal.option = $.extend(false, modal.option, form);
                _this.$modal.modal('hide');
                modalIns.render(true);

                e.preventDefault();

            }.bind(this));
        };

    }.call(Modal.prototype);

    exports.ChartConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));