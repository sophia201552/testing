var ConfigProject = (function() {
    function ConfigProject(projId) {
        this.projId = projId;
        this._id = undefined;
        this.store = undefined;
        this.renderArr = [];
    }
    ConfigProject.prototype = {
        show: function() {
            var _this = this;
            Spinner.spin(ElScreenContainer);
            var promise = $.Deferred();

            WebAPI.get('/static/views/admin/configProject.html').done(function(resultHtml) {
                Spinner.stop();
                $(ElScreenContainer).html(resultHtml);
                I18n.fillArea($(ElScreenContainer));
                _this.init();
                promise.resolve();
                _this.initRenderChartData();
            })
            promise.done(function() {
                WebAPI.get('/project/getinfo/' + _this.projId).done(function(result) {
                    var proInfo = result.projectinfo;
                    _this.$img.attr('src', '/static/images/project_img/' + proInfo.pic);
                    _this.$proName.html(proInfo.name_cn);
                })
            })
        },

        init: function() {
            this.$img = $(ElScreenContainer).find('.proImg');
            this.$proName = $(ElScreenContainer).find('.proName');
            this.$currencyUnit = $(ElScreenContainer).find('.currencyUnit');
            this.$unitStandard = $(ElScreenContainer).find('.unitStandard');
            this.attachEvents();
        },

        initRenderChartData: function() {
            var _this = this;
            var promise = $.Deferred();
            WebAPI.post('/iot/search', { "parent": [], "projId": [this.projId] }).done(function(result) {
                _this._id = result.projects[0]._id;
                promise.resolve();
            })
            promise.done(function() {
                WebAPI.get('/benchmark/config/get/' + _this._id).done(function(result) {
                        _this.store = result;

                        if (result.cost !== undefined) {
                            _this.renderArr = result.cost;
                        }
                        for (var i = 0, length = _this.renderArr.length; i < length; i++) {
                            _this.addSingleRow(_this.renderArr[i], length);
                        }
                        delete _this.renderChart;
                        _this.renderChart = _this.renderChart.bind(_this);
                    })
                    //项目表  拿到项目信息  渲染单位设置
                WebAPI.get('/project/getinfo/' + _this.projId).done(function(result) {
                    var proInfo = result.projectinfo;
                    if (proInfo.unit_system === null) {
                        proInfo.unit_system = 0;
                    }
                    if (proInfo.unit_currency === null) {
                        proInfo.unit_currency = 0;
                    }
                    _this.renderUnit(proInfo);
                })
            })
        },
        saveEleSettting: function() {
            var _this = this;
            this.renderArr = [];
            var cost = [];
            var isNull = false;
            $(ElScreenContainer).find('.divCost').each(function () {
                if ($(this).find('.spCostVal').html() === '' || $(this).find('.spCostTime').html()==='' || $(this).find('.spCostWeight').html() === ''){
                    alert('Please Check!');
                    isNull = true;
                } else {
                    var obj = {
                        cost: $(this).find('.spCostVal').html(),
                        time: $(this).find('.spCostTime').html()
                    }
                    _this.renderArr.push(obj);
                    var objThree = {
                        cost: $(this).find('.spCostVal').html(),
                        time: $(this).find('.spCostTime').html(),
                        weight: $(this).find('.spCostWeight').html()
                    }
                    cost.push(objThree);
                }
            })
            if (isNull){
                return;
            }
            this.renderChart();
            var options = {
                '_id': this._id,
                'cost': cost,
                'point': this.store.point,
                'relate': []
            }
            WebAPI.post('/benchmark/config/save', options).done(result => {
                if (result == true) {
                    infoBox.alert(I18n.resource.benchmark.paramsConfig.SAVE_SUCCESS);
                }
            }).fail(function() {
                infoBox.alert(I18n.resource.benchmark.paramsConfig.SAVE_FAIL)
            })
        },
        saveProUnit: function() {
            var _this = this;
            var options = {
                'proId': this.projId,
                'unit_currency': this.$currencyUnit.val(),
                'unit_system': $('input[name=unitStandard]:checked').data('index')
            }
            WebAPI.post('/project/unitconfig/save', options).done(result => {
                if (result == true) {
                    infoBox.alert(I18n.resource.benchmark.paramsConfig.SAVE_SUCCESS);
                    AppConfig.unit_currency = Unit.getCurrencyUnit( Number(_this.$currencyUnit.val()));
                    Unit.getUnitSystem( Number($('input[name=unitStandard]:checked').data('index')) ).always(function (rs) {
                        AppConfig.unit_system = unitSystem;
                    }); 
                }
            }).fail(function() {
                infoBox.alert(I18n.resource.benchmark.paramsConfig.SAVE_FAIL)
            })
        },
        attachEvents: function() {
            var _this = this;
            //点击确定 退出配置页面 回到初始页面
            $(ElScreenContainer).off('click.saveAndQuit').on('click.saveAndQuit', '.saveAndQuit', function() {
                _this.saveProUnit();
                _this.saveEleSettting();
                ScreenManager.show(UserManagerController, 'ProjectPermissionManager');
            });
            $(ElScreenContainer).off('click.quitCurrentPage').on('click.quitCurrentPage', '.quitCurrentPage', function() {
                ScreenManager.show(UserManagerController, 'ProjectPermissionManager');
            });
            //切换title的点击事件
            $(ElScreenContainer).off('click.unitTitle').on('click.unitTitle', '.unitTitle', function() {
                $(ElScreenContainer).find('.configTitle li').removeClass('action');
                $(this).addClass('action');

                var index = Number($(this).data('index'));
                $(ElScreenContainer).find('.detail>div').hide();
                if (index === 0){
                    $(ElScreenContainer).find('.detail>div.btnBox').show();
                }
                $(ElScreenContainer).find('.detail>div').eq(index).show(function() {
                    if (index === 1) {
                        _this.renderChart();
                    }
                });
            });
            //切换电费的
            $(ElScreenContainer).off('click.diffFeeTitle').on('click.diffFeeTitle', '.diffFeeTitle', function() {
                $(ElScreenContainer).find('.diffFeeTitle input:checked').prop("checked", false);
                $(this).find("input").prop("checked", true);
                var index = Number($(this).data('index'));
                $(ElScreenContainer).find('.elecDiffInfo>div').hide();
                $(ElScreenContainer).find('.elecDiffInfo>div').eq(index).show();
            });
            //input 失去焦点 拿到内容 以span显示
            $(ElScreenContainer).off('blur').on('blur', '.iptCost', function() {
                var val = $(this).val();
                var $parent = $(this).closest('.divCost');
                if (val !== ''){
                    $(this).prev('span').html(val).css('display', 'inline-block');
                    $(this).hide();
                }
            });
            //编辑按钮
            $(ElScreenContainer).off('dblclick').on('dblclick', '.spCost', function() {
                    var val = $(this).html();
                    $(this).hide();
                    $(this).next('input').val(val).css('display', 'inline-block');
                })
                //删除按钮
            $(ElScreenContainer).off('click.btnCostDel').on('click.btnCostDel', '.btnCostDel', function() {
                var $parent = $(this).closest('.divCost');
                $parent.remove();
            });
            //添加按钮点击事件 
            $(ElScreenContainer).off('click.btnCostAdd').on('click.btnCostAdd', '.btnCostAdd', function() {
                _this.addSingleRow();
            });
            //单位保存
            $(ElScreenContainer).off('click.btnEleSaveing').on('click.btnEleSaveing', '.btnEleSaveing', function() {
                _this.saveProUnit();
            });
            //电费保存
            $(ElScreenContainer).off('click.btnEleSaveing').on('click.btnEleSaveing', '.btnEleSaveing', function() {
                _this.saveEleSettting();
            });
        },
        renderChart: function () {
            var arrCostItem = this.renderArr;
            var arrData = [],
                arrTime = [];
            for (var i = 0; i < arrCostItem.length; i++) {
                arrData.push(arrCostItem[i].cost);
                arrTime.push(arrCostItem[i].time);
            }

            var option = {
                grid: {
                    top: 20
                },
                xAxis: [{
                    type: 'value'
                }],
                yAxis: [{
                    type: 'category',
                    axisTick: { show: false },
                    data: arrTime
                }],
                series: [{
                    name: '收入',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    data: arrData
                }]
            }
            echarts.init(document.getElementById('divCostChart'), AppConfig.chartTheme).setOption(option);
        },
        addSingleRow: function(row, length) {
            if (row === undefined) {
                var singleCost = '<div class="divCost">\
                    <span class="spCost spCostTime" style="display: none;"></span>\
                    <input class="iptCost form-control iptCostTime" value="" style="display: inline-block;">\
                    <span class="spCost spCostVal" style="display: none;"></span>\
                    <input class="iptCost form-control iptCostVal" value="" style="display: inline-block;">\
                    <span class="spCost spCostWeight" style="display: none;"></span>\
                    <input class="iptCost form-control iptCostWeight" value="" style="display: inline-block;">\
                    <span class="btnCostDel btnCost glyphicon glyphicon-remove"></span>\
                </div>';
            } else {
                if (row.weight === undefined) {
                    row.weight = (1 / length).toFixed(2);
                }
                var singleCost = '<div class="divCost">\
                    <span class="spCost spCostTime" style="display: inline-block;">' + row.time + '</span>\
                    <input class="iptCost form-control iptCostTime" value="" style="display: none;">\
                    <span class="spCost spCostVal" style="display: inline-block;">' + row.cost + '</span>\
                    <input class="iptCost form-control iptCostVal" value="" style="display: none;">\
                    <span class="spCost spCostWeight" style="display: inline-block;">' + row.weight + '</span>\
                    <input class="iptCost form-control iptCostWeight" value="" style="display: none;">\
                    <span class="btnCostDel btnCost glyphicon glyphicon-remove"></span>\
                </div>';
            }
            $(ElScreenContainer).find('.costBox').append($(singleCost));
        },
        renderUnit: function(proInfo) {
            var _this = this;
            this.$currencyUnit.find("option[value=" + proInfo.unit_currency + "]").prop("selected", true);
            this.$unitStandard.find("input[name=unitStandard][data-index=" + proInfo.unit_system + "]").prop("checked", true);
        },
    };
    return ConfigProject;
})();