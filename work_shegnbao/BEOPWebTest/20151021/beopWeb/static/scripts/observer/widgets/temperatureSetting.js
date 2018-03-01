var TemperatureSetting = (function () {
    function TemperatureSetting() {
        this.viewModel = null;
        this.init();
    }

    TemperatureSetting.prototype = {
        show: function () {
            $('#dialogModal').modal();
        },

        init: function () {
            var _this = this;
            WebAPI.get("/static/views/observer/widgets/temperatureSetting.html").done(function (resultHtml) {
                var $dialogContent = $("#dialogContent");
                $dialogContent.html(resultHtml);
                _this.renderView();
                _this.attachEvent();
                $('#dialogContent').removeClass('modal-lg');
                I18n.fillArea($dialogContent);
            });
        },
        renderView: function () {
            var _this = this;
            this.loadModel().done(function () {
                var t1 = null;
                t1 && clearTimeout(t1);
                t1 = setTimeout(function () {
                    $("#slider-range").ionRangeSlider({
                        min: 0,
                        max: 50,
                        from: parseInt(_this.viewModel[0].value),
                        to: parseInt(_this.viewModel[1].value),
                        type: 'double',//设置类型
                        step: 1,
                        prefix: "",//设置数值前缀
                        postfix: "℃",//设置数值后缀
                        prettify: true,
                        hasGrid: true,
                        onChange: function (obj) {
                            $rangeLeft.css("width", obj.fromX + 11 + 'px');
                            $rangeRight.css("width", $("#rangeWrapper").width() - obj.toX + 11 + 'px');
                        },
                        onFinish: function (obj) {
                            $rangeLeft.css("width", obj.fromX + 11 + 'px');
                            $rangeRight.css("width", $("#rangeWrapper").width() - obj.toX + 11 + 'px');
                        }
                    });

                    var $rangeLeft = $("#rangeWrapper .irs-line-left");
                    var $rangeRight = $("#rangeWrapper .irs-line-right");
                    var leftStr = $("#rangeWrapper .irs-slider").eq(0).css("left");
                    var rightStr = $("#rangeWrapper .irs-slider").eq(1).css("left");
                    var widthLeft = parseFloat(leftStr.substr(0, leftStr.length - 2)) + 11 + 'px';
                    var widthRight = parseFloat($("#rangeWrapper").width()-rightStr.substr(0, leftStr.length - 2)) + 11 + 'px';
                    $rangeLeft.css("width", widthLeft);
                    $rangeRight.css("width", widthRight);
                }, 300);
            });
        },
        loadModel: function () {
            var _this = this;
            return WebAPI.post('/admin/getColorSetting', {userId: AppConfig.userId}).done(function (result) {
                if (result.success) {
                    _this.viewModel = result.data;
                }
            })
        },
        attachEvent: function () {
            var _this = this;
            $('#btnSaveSetting').off().click(function () {
                _this.viewModel[0].value = parseFloat($("#rangeWrapper .irs-from").text());
                _this.viewModel[1].value = parseFloat($("#rangeWrapper .irs-to").text());
                WebAPI.post('/admin/setColorSetting', {
                    'setting': _this.viewModel,
                    userId: AppConfig.userId
                }).done(function (result) {
                    if (result.success) {
                        var alert = new Alert($('#dialogModal'), Alert.type.success, I18n.resource.code['2002']);
                        alert.showAtTop(2000);
                    }
                })
            });
            $('#dialogModal').on('hidden.bs.modal', function () {
                $('#dialogContent').addClass('modal-lg');
            });
        }
    };

    return TemperatureSetting;
})();