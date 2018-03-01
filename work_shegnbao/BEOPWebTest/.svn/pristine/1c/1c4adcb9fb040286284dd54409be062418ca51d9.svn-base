var TemperatureSetting = (function () {

    var jqueryMap = {}, stateMap = {
        slider: null
    };

    function TemperatureSetting(heatType) {
        this.viewModel = null;
        this.heatType = heatType;
    }

    TemperatureSetting.prototype = {
        show: function () {
            var _this = this, text, heatTypeI18n;
            this.init().done(function () {
                heatTypeI18n = I18n.resource.observer.entities[_this.heatType.toUpperCase()];
                text = I18n.resource.observer.entities.TITLE_HEAT_MAP_CONFIGURE.format(heatTypeI18n);
                jqueryMap.$dialogModal.find('#myModalLabel').text(text).end().modal();
            });
        },

        close: function () {
            jqueryMap.$dialogModal.modal('hide');
            if (stateMap.slider && stateMap.slider.destroy) {
                stateMap.slider.destroy();
                stateMap.slider = null;
            }
        },

        init: function () {
            var _this = this;
            return WebAPI.get("/static/views/observer/widgets/temperatureSetting.html").done(function (resultHtml) {
                jqueryMap.$dialogContent = $("#dialogContent");
                jqueryMap.$dialogContent.html(resultHtml);
                jqueryMap.$dialogModal = $('#dialogModal');
                _this.renderView();
                _this.attachEvent();
                jqueryMap.$dialogContent.removeClass('modal-lg');
                I18n.fillArea(jqueryMap.$dialogContent);

            });
        },
        renderView: function () {
            var _this = this, defaultMax = 27, defaultMin = 11;
            Spinner.spin(jqueryMap.$dialogModal.find('.modal-content')[0]);
            this.loadModel().done(function () {
                var min, max;
                if (_this.viewModel) {
                    min = typeof _this.viewModel.min != 'undefined' && _this.viewModel.min.value != '' ? _this.viewModel.min.value : defaultMin;
                    max = typeof _this.viewModel.max != 'undefined' && _this.viewModel.max.value != '' ? _this.viewModel.max.value : defaultMax;
                } else {
                    min = defaultMin;
                    max = defaultMax;
                }
                stateMap.slider = $("#slider-range").ionRangeSlider({
                    min: 0,
                    max: 100,
                    from: min,
                    to: max,
                    type: 'double',//设置类型
                    step: 1,
                    hasGrid: true
                }).data("ionRangeSlider");
            }).always(function () {
                Spinner.stop();
            });
        },
        loadModel: function () {
            var _this = this;
            return WebAPI.post('/admin/getColorSetting', {
                userId: AppConfig.userId,
                heatType: _this.heatType
            }).done(function (result) {
                if (result.success) {
                    _this.viewModel = result.data;
                }
            })
        },
        attachEvent: function () {
            var _this = this;
            $('#btnSaveSetting').off().click(function () {
                var $rangeWrapper = $("#rangeWrapper"), minValue = parseFloat($rangeWrapper.find(".irs-from").text()),
                    maxValue = parseFloat($rangeWrapper.find(".irs-to").text());
                if (_this.viewModel && _this.viewModel[_this.heatType]) {
                    _this.viewModel[_this.heatType].min.value = minValue;
                    _this.viewModel[_this.heatType].max.value = maxValue;
                } else {
                    _this.viewModel = {};
                    _this.viewModel[_this.heatType] = {
                        "min": {
                            "color": "blue",
                            "value": minValue
                        },
                        "max": {
                            "color": "red",
                            "value": maxValue
                        }
                    }
                }
                Spinner.spin(jqueryMap.$dialogModal.find('.modal-content')[0]);
                WebAPI.post('/admin/setColorSetting', {
                    'setting': _this.viewModel,
                    userId: AppConfig.userId
                }).done(function (result) {
                    if (result.success) {
                        _this.close();
                        Alert.success(ElScreenContainer, I18n.resource.code['2002']).showAtTop(2000);
                    }
                    $(ElScreenContainer).trigger('refreshHeatMap');
                }).always(function () {
                    Spinner.stop();
                })
            });
        }
    };

    return TemperatureSetting;
})();