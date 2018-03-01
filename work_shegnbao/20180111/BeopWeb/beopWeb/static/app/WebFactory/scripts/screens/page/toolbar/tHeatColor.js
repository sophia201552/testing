(function(exports) {
  var _this;
  var modalHtml =
    '\
        <div class="modal fade" id="heatColorModal">\
            <div class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
                        <h4 class="modal-title">热力图颜色配置</h4>\
                    </div>\
                    <div class="modal-body"></div>\
                    <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\
                        <button type="button" class="btn btn-primary" id="addBtn">Save</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
    ';
  var heat3DModalBody =
    '\
        <div class="row">\
            <div class="col-md-3"><label>辐射半径</label></div>\
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
            <div class="col-md-12">\
                <div class="checkbox">\
                    <label>\
                    <input id="isGradient" type="checkbox" checked> 渐变\
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
  var defaultMin = 10,
    defaultMax = 40,
    defaultRadius = 50,
    defaultColor = {
      default: '10,#0a6592;17.5,#2a9d8f;25,#e9c46a;32.5,#f4a261;40,#E71D36',
      heat3D:
        '10,#3434ff;15,#35ffff;20,#36fe94;25,#6ff71c;30,#9fff39;35,#ffa922;40,#ff2323'
    };
  function THeatColor(toolbar, container) {
    this.toolbar = toolbar;
    this.screen = toolbar.screen;
    this.painter = toolbar.painter;

    this.container = container;
    this.layer = this.painter.interactiveLayer;

    this.objId = ObjectId();
    this.$heatColorModal = undefined;
    _this = this;
    this.init();
  }

  THeatColor.prototype.option = {
    cursor: 'crosshair'
  };

  THeatColor.prototype.init = function() {
    this.$heatColorModal = $(modalHtml);
    $(document.body).append(this.$heatColorModal);
    this.removeEvent();
    this.attachEvent();
  };

  THeatColor.prototype.show = function() {
    var heat3D = this.painter.store.widgetModelSet.findByProperty(
      'type',
      'HtmlHeat3D'
    );
    var heatColor = this.painter.store.widgetModelSet.findByProperty(
      'type',
      'CanvasHeatColor'
    );
    var isHeat3D = true;
    if (heat3D) {
      this.$heatColorModal.find('.modal-body').html(heat3DModalBody);
      isHeat3D = true;
    } else {
      this.$heatColorModal.find('.modal-body').html(heatModalBody);
      isHeat3D = false;
    }

    this.attachModalEvent(isHeat3D);
    
    if(heatColor){
      var o = heatColor.option();
      _this.initGradientColorWrapper(
        o.gradientColor
      );
      if($('#isGradient', this.$heatColorModal)[0]){
        $('#isGradient', this.$heatColorModal)[0].checked = o.isGradient;
        $('#isGradient', this.$heatColorModal).trigger('change');
      }
      
      $('#r', _this.$heatColorModal).val(o.radius)
    }else{
      _this.initGradientColorWrapper(
        defaultColor[isHeat3D ? 'heat3D' : 'default']
      );
    }
    this.$heatColorModal.modal('show');
  };

  THeatColor.prototype.attachModalEvent = function(isHeat3D) {
    $('#slider-range', this.$heatColorModal)
      .ionRangeSlider({
        min: defaultMin,
        max: defaultMax,
        from: defaultMin,
        to: defaultMax,
        from_fixed: true,
        to_fixed: true,
        type: 'double', //设置类型
        step: 1,
        grid: true,
        grid_num: 5,
        hide_min_max: true,
        hide_from_to: true
      })
      .data('ionRangeSlider');
    $('#isGradient', this.$heatColorModal)
      .off('change')
      .on('change', function(e) {
        _this.initCss($('#gradientColor', this.$heatColorModal).val());
      });
    $('#r', this.$heatColorModal)
      .off('blur')
      .on('blur', function(e) {
        if (isNaN(Number(this.value))||Number(this.value)<=0) {
          alert('半径格式错误');
          $(this).val(defaultRadius);
        }
      });
    $('#gradientColorWrapper', this.$heatColorModal)
      .off('click')
      .on('click', function(e) {
        var $this = $(this);
        // $('.item', $this).remove();
        $('#gradientColor', $this)
          .focus();
      });
    $('#gradientColor', this.$heatColorModal)
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
          alert('颜色配置格式错误');
          _this.initGradientColorWrapper(
            defaultColor[isHeat3D ? 'heat3D' : 'default']
          );
        } else {
          _this.initGradientColorWrapper(this.value);
        }
      });
    $('#gradientColor', this.$heatColorModal)
      .off('keydown')
      .on('keydown', function(e) {
        if (e.key == 'Enter') {
          $(this).trigger('blur');
        }
      });
  };
  THeatColor.prototype.initGradientColorWrapper = function(gradientColor) {
    
    $('#gradientColor', this.$heatColorModal)
      .val(gradientColor)
    var $wrap = $('#gradientColorWrapper', this.$heatColorModal);
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
      grid_num: Math.min(maxNum-minNum,slider.options.grid_num)
    });
    slider.reset();
    this.initCss(gradientColor);
  };
  THeatColor.prototype.initCss = function(gradientColor) {
    var checked =
      $('#isGradient', this.$heatColorModal)[0] &&
      $('#isGradient', this.$heatColorModal)[0].checked;
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
    $('#rangeWrapper .irs-bar', this.$heatColorModal).css(
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
  };
  THeatColor.prototype.attachEvent = function() {
    this.$heatColorModal.on('shown.bs.modal', function(e) {});
    this.$heatColorModal.on('hidden.bs.modal', function(e) {
      $(document.body)
        .find('#heatColorModal')
        .remove();
    });
    $('#addBtn', this.$heatColorModal).on('click', function(e) {
      var old = _this.painter.store.widgetModelSet.findByProperty(
        'type',
        'CanvasHeatColor'
      );
      var slider = $('#slider-range', this.$heatColorModal).data('ionRangeSlider');
      var isGradient =
          $('#isGradient', _this.$heatColorModal)[0] &&
          $('#isGradient', _this.$heatColorModal)[0].checked,
        r = Number($('#r', _this.$heatColorModal).val()) || defaultRadius,
        gradien = $('#gradientColor', _this.$heatColorModal).val(),
        from = slider.options.min,
        to = slider.options.max;
      isGradient = isGradient == undefined ? true : isGradient;
      if (old) {
        old['option.isGradient'](isGradient);
        old['option.radius'](r);
        old['option.gradientColor'](gradien);
        old['option.min'](from);
        old['option.max'](to);
      } else {
        _this.tools._save(isGradient, r, gradien, from, to);
      }
      _this.$heatColorModal.modal('hide');
    });
  };

  THeatColor.prototype.removeEvent = function() {
    $('#addBtn', this.$heatColorModal).off('click');
  };

  THeatColor.prototype.tools = {
    _save: function(isGradient, r, gradien, from, to) {
      var entity, layerId;
      entity = this._createEntity(isGradient, r, gradien, from, to);
      entity.layerId = _this.painter.getLayerId();
      entity.isHide = 0;
      _this.painter.store.widgetModelSet.append(new NestedModel(entity));
    },

    _createEntity: function(isGradient, r, gradien, from, to) {
      var entity = {};
      entity.type = 'CanvasHeatColor';
      entity._id = _this.objId;
      entity.x = 0;
      entity.y = 0;
      entity.w = 250;
      entity.h = 40;
      entity.option = {
        data: {},
        isGradient: isGradient,
        radius: r,
        gradientColor: gradien,
        min: from,
        max: to
      };
      return entity;
    }
  };

  window.THeatColor = THeatColor;

  exports.THeatColor = THeatColor;
})(namespace('toolbar'));
