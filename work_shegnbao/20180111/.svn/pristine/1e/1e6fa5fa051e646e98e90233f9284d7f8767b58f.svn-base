var TemperatureSetting = (function() {
  var jqueryMap = {},
    stateMap = {
      slider: null
    };
  var defaultMin = 10,
    defaultMax = 40,
    defaultRadius = 50,
    defaultIsGradient = true,
    defaultColor = {
      co: '10,#0a6592;17.5,#2a9d8f;25,#e9c46a;32.5,#f4a261;40,#E71D36',
      '3d':
        '10,#3434ff;15,#35ffff;20,#36fe94;25,#6ff71c;30,#9fff39;35,#ffa922;40,#ff2323'
    };
  function TemperatureSetting(heatType, isAnotherColor) {
    this.viewModel = null;
    this.heatType = heatType;
    this.isAnotherColor = isAnotherColor;
  }

  TemperatureSetting.prototype = {
    show: function() {
      var _this = this,
        text,
        heatTypeI18n;
      this.init().done(function() {
        heatTypeI18n =
          I18n.resource.observer.entities[_this.heatType.toUpperCase()];
        text = I18n.resource.observer.entities.TITLE_HEAT_MAP_CONFIGURE.format(
          heatTypeI18n
        );
        jqueryMap.$dialogModal
          .find('#myModalLabel')
          .text(text)
          .end()
          .modal();
      });
    },

    close: function() {
      jqueryMap.$dialogModal.modal('hide');
      if (stateMap.slider && stateMap.slider.destroy) {
        stateMap.slider.destroy();
        stateMap.slider = null;
      }
    },

    init: function() {
      var _this = this;
      return WebAPI.get(
        '/static/views/observer/widgets/temperatureSetting.html'
      ).done(function(resultHtml) {
        var heat3DModalBody =
          '\
                    <div class="row">\
                        <div class="col-md-3"><label>' +
          I18n.resource.observer.entities.RADIUS +
          '</label></div>\
                        <div class="col-md-3"><input type="text" id="r" placeholder="" value="50"/></div>\
                    </div>\
                    <div class="row">\
                        <div class="list-unstyled color-setting-list">\
                            <div id="rangeWrapper">\
                                <input type="text" id="slider-range" class="dn"/>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="row">\
                        <div id="colorWrapper">\
                            <div class="col-md-12"><div id="gradientColorWrapper"><input type="text" id="gradientColor" placeholder="10,#000;40,#fff;"/></div></div>\
                        </div>\
                    </div>\
                ';
        var heatModalBody =
          '\
                    <div class="row">\
                        <div class="col-md-2">\
                            <div class="checkbox">\
                                <label>\
                                <input id="isGradient" type="checkbox" checked> ' +
          I18n.resource.observer.entities.GRADIENT +
          '\
                                </label>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="row">\
                        <div class="list-unstyled color-setting-list">\
                            <div id="rangeWrapper">\
                                <input type="text" id="slider-range" class="dn"/>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="row">\
                        <div id="colorWrapper">\
                            <div class="col-md-12"><div id="gradientColorWrapper"><input type="text" id="gradientColor" placeholder="10,#000;40,#fff;"/></div></div>\
                        </div>\
                    </div>\
                ';

        jqueryMap.$dialogContent = $('#dialogContent');
        jqueryMap.$dialogContent.html(resultHtml);
        jqueryMap.$dialogModal = $('#dialogModal');
        if (window.isHtmlHeat3D) {
          jqueryMap.$dialogContent.find('.modal-body').html(heat3DModalBody);
        } else {
          jqueryMap.$dialogContent.find('.modal-body').html(heatModalBody);
        }
        _this.renderView();
        _this.attachEvent();
        jqueryMap.$dialogContent.removeClass('modal-lg');
        I18n.fillArea(jqueryMap.$dialogContent);
      });
    },
    renderView: function() {
      var _this = this;
      Spinner.spin(jqueryMap.$dialogModal.find('.modal-content')[0]);
      this.loadModel()
        .done(function() {
          stateMap.slider = $('#slider-range')
            .ionRangeSlider({
              min: _this.viewModel.min,
              max: _this.viewModel.max,
              from: _this.viewModel.min,
              to: _this.viewModel.max,
              from_fixed: true,
              to_fixed: true,
              type: 'double', //设置类型
              step: 1,
              grid: true,
              grid_num: 5,
              hide_min_max: true
            })
            .data('ionRangeSlider');
            if($('#isGradient', jqueryMap.$dialogContent)[0]){
                $('#isGradient', jqueryMap.$dialogContent)[0].checked = _this.viewModel.isGradient;
            }
            if($('#r', jqueryMap.$dialogContent).length>0){
                $('#r', jqueryMap.$dialogContent).val(_this.viewModel.radius);
            }
          _this.initGradientColorWrapper(_this.viewModel.gradientColor);
        })
        .always(function() {
          Spinner.stop();
        });
    },
    loadModel: function() {
      var _this = this;
      return WebAPI.post('/admin/getColorSetting', {
        userId: AppConfig.userId,
        heatType: _this.heatType
      }).done(function(result) {
        if (result.success && result.data) {
          //用户配置
          _this.viewModel = result.data;
        } else if (window.isCanvasHeatColor) {
          //控件配置
          _this.viewModel = window.canvasHeatColorOption;
        } else {
          //默认值
          _this.viewModel = {
            isGradient: defaultIsGradient,
            radius: defaultRadius,
            gradientColor: defaultColor[_this.heatType],
            min: defaultMin,
            max: defaultMax
          };
        }
      });
    },
    attachEvent: function() {
      var _this = this;
      $('#btnSaveSetting')
        .off()
        .click(function() {
          var slider = $('#slider-range', this.$heatColorModal).data('ionRangeSlider');
          var isGradient =
              $('#isGradient', jqueryMap.$dialogContent)[0] &&
              $('#isGradient', jqueryMap.$dialogContent)[0].checked,
            r = Number($('#r', jqueryMap.$dialogContent).val()) || defaultRadius,
            gradien = $('#gradientColor', jqueryMap.$dialogContent).val(),
            from = slider.options.min,
            to = slider.options.max;
          isGradient = isGradient == undefined ? true : isGradient;
          _this.viewModel = {
            isGradient: isGradient,
            radius: r,
            gradientColor: gradien,
            min: from,
            max: to
          };
          var setting = {};
          setting[_this.heatType] = _this.viewModel;
          Spinner.spin(jqueryMap.$dialogModal.find('.modal-content')[0]);
          WebAPI.post('/admin/setColorSetting', {
            setting: setting,
            userId: AppConfig.userId
          })
            .done(function(result) {
              if (result.success) {
                _this.close();
                Alert.success(
                  ElScreenContainer,
                  I18n.resource.code['2002']
                ).showAtTop(2000);
              }
              $(ElScreenContainer).trigger('refreshHeatMap');
            })
            .always(function() {
              Spinner.stop();
            });
        });
      $('#isGradient', jqueryMap.$dialogContent)
        .off('change')
        .on('change', function(e) {
          _this.initCss($('#gradientColor', jqueryMap.$dialogContent).val());
        });
      $('#r', jqueryMap.$dialogContent)
        .off('blur')
        .on('blur', function(e) {
          if (isNaN(Number(this.value)) || Number(this.value) <= 0) {
            alert(I18n.resource.observer.entities.FORMAT_ERROR);
            $(this).val(_this.viewModel.radius);
          }
        });
      $('#gradientColorWrapper', jqueryMap.$dialogContent)
        .off('click')
        .on('click', function(e) {
          var $this = $(this);
          // $('.item', $this).remove();
          $('#gradientColor', $this)
            .focus();
        });
      $('#gradientColor', jqueryMap.$dialogContent)
        .off('blur')
        .on('blur', function(e) {
          var values = this.value.split(';').filter(function(v) {
            return v !== '';
          });
          var isError = values.some(function(v) {
            var rs = false;
            var arr = v.split(',');
            if (
              arr.length != 2 ||
              isNaN(Number(arr[0]))
            ) {
              rs = true;
            }
            try {
              chroma(arr[1]);
            } catch (error) {
              rs = true;
            }
            return rs;
          });
          if (isError) {
            alert(I18n.resource.observer.entities.FORMAT_ERROR);
            _this.initGradientColorWrapper(_this.viewModel.gradientColor);
          } else {
            _this.initGradientColorWrapper(this.value);
          }
        });
      $('#gradientColor', jqueryMap.$dialogContent)
        .off('keydown')
        .on('keydown', function(e) {
          if (e.key == 'Enter') {
            $(this).trigger('blur');
          }
        });
    },
    initGradientColorWrapper: function(gradientColor) {
      
      $('#gradientColor', jqueryMap.$dialogContent)
        .val(gradientColor);
      var $wrap = $('#gradientColorWrapper', jqueryMap.$dialogContent);
      $('.item', $wrap).remove();
      var values = gradientColor.split(';').filter(function(v) {
        return v !== '';
      }).sort(function(a,b){return Number(a.split(',')[0]) - Number(b.split(',')[0])});
      var minNum = undefined,
        maxNum = undefined;
      values.forEach(function(v) {
        var arr = v.split(',');
        if(minNum==undefined||arr[0]<=minNum){
          minNum = arr[0];
        }
        if(maxNum==undefined||arr[0]>=maxNum){
          maxNum = arr[0];
        }
        // $wrap.append('<label class="item">'+arr[0]+'</label>');
        $wrap.append(
          '<div class="item"><label>' +
            arr[0] +
            '</label><div class="colorBlock" style="background:' +
            arr[1] +
            ';"></div></div>'
        );
      });
      var slider = $('#slider-range', this.$heatColorModal).data('ionRangeSlider');
      slider.update({
        min: minNum,
        max: maxNum,
        from: minNum,
        to: maxNum,
        grid_num: Math.min(maxNum-minNum,slider.options.grid_num),
        hide_min_max: true,
        hide_from_to: true
      });
      slider.reset();
      this.initCss(gradientColor);
    },
    initCss: function(gradientColor) {
      var checked =
        $('#isGradient', jqueryMap.$dialogContent)[0] &&
        $('#isGradient', jqueryMap.$dialogContent)[0].checked;
      checked = checked == undefined ? true : checked;
      var slider = $('#slider-range', this.$heatColorModal).data('ionRangeSlider');
      var css = '';
      if (checked) {
        css = gradientColor
          .split(';')
          .filter(function(v) {
            return v !== '';
          }).sort(function(a,b){return Number(a.split(',')[0]) - Number(b.split(',')[0])})
          .map(function(v) {
            var temp = v.split(',');
            var num = (Number(temp[0]) - slider.options.min) / (slider.options.max - slider.options.min);
            return temp[1] + ' ' + num * 100 + '%';
          })
          .join(',');
      } else {
        var arr = [],
          map = {};
        gradientColor
          .split(';')
          .filter(function(v) {
            return v !== '';
          }).sort(function(a,b){return Number(a.split(',')[0]) - Number(b.split(',')[0])})
          .forEach(function(v, index) {
            var temp = v.split(',');
            var num = (Number(temp[0]) - slider.options.min) / (slider.options.max - slider.options.min);
            arr.push(num);
            map[num] = temp[1];
          });
        arr.sort(function(a, b) {
          return a - b;
        });
        css = arr
          .map(function(v, i) {
            var num = v,
              value = map[v],
              nextNum = arr[i + 1] == undefined ? 1 : arr[i + 1];
            nextNum = nextNum - 0.01;
            return (
              value +
              ' ' +
              num * 100 +
              '%' +
              ', ' +
              value +
              ' ' +
              nextNum * 100 +
              '%'
            );
          })
          .join(',');
      }
      $('#rangeWrapper .irs-bar', jqueryMap.$dialogContent).css(
        'background',
        'linear-gradient(to right, ' + css + ')'
      );
      $('#rangeWrapper .irs-slider', jqueryMap.$dialogContent).css(
        'background',
        'none'
      );
      $('#rangeWrapper .irs-line-left', jqueryMap.$dialogContent).css(
        'background',
        'none'
      );
      $('#rangeWrapper .irs-line-right', jqueryMap.$dialogContent).css(
        'background',
        'none'
      );
    }
  };

  return TemperatureSetting;
})();
