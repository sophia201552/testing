(function(exports, Widget, CanvasWidgetMixin) {
  var threeDRender = exports.threeDRender;
  var defaultMin = 10,
  defaultMax = 40,
  defaultRadius = 50,
  defaultIsGradient = true,
  defaultColor = '10,#0a6592;17.5,#2a9d8f;25,#e9c46a;32.5,#f4a261;40,#E71D36',
  default3DColor = '10,#3434ff;15,#35ffff;20,#36fe94;25,#6ff71c;30,#9fff39;35,#ffa922;40,#ff2323';
  function HtmlHeat3D(layer, model) {
    // SuperClass.apply(this, arguments);
    Widget.apply(this, arguments);
    this.updateDataTimer = null;
  }

  HtmlHeat3D.prototype = Object.create(Widget.prototype);
  HtmlHeat3D.prototype.constructor = HtmlHeat3D;

  // HtmlHeat3D.prototype.tpl = '<div class="html-widget html-heat3D"></div>';

  HtmlHeat3D.prototype.init = function() {
    //兼容一下老数据格式
    this._format();

    Widget.prototype.init.apply(this, arguments);
  };

  //兼容老数据
  HtmlHeat3D.prototype._format = function() {
    // var model = this.store.model;
    // var options = model.option();
    // this.store.model.option(options);
  };

  /** override */
  HtmlHeat3D.prototype.show = function(isS) {
    _this = this;
    var model = this.store.model;
    var option = model.option();

    var width = model.w(),
      height = model.h(),
      color = 'red',
      id = model._id(),
      x = model.x(),
      y = model.y();
    this.shape = new Konva.Text({
      id: model._id(),
      x: 0,
      y: 0,
      text: isS ? '' : '3D',
      fontSize: height,
      fill: 'green',
      align: 'center'
    });
    var $innerBg = $('#innerBg');
    $innerBg.siblings('#3dMap').remove();
    $innerBg.prepend(
      '<div id="3dMap" style="position:relative;width:100%;height:100%;"></div>'
    );

    $('.html-layer');

    this.layer.add(this.shape);
    // this.shape.moveToTop();
    this.update();
  };

  /** override */
  HtmlHeat3D.prototype.update = function(e, propName) {
    var _this = this;
    var model = this.store.model;
    var option = model.option();
    var value;
    if (propName && propName.indexOf('update.option.data') > -1) {
      if (!this.updateDataTimer) {
        this.updateDataTimer = setTimeout(
          function() {
            //更新逻辑
            var width = option.width,
              height = option.height;
            var data = [];
            for (var k in option.data) {
              data.push(option.data[k].tempPoint);
            }
            var heatColor = _this.painter.store.widgetModelSet.findByProperty(
              'type',
              'CanvasHeatColor'
            );
            var threeDRenderOption;
            if (window.colorGettings) {
              //用户配置
              threeDRenderOption = {
                max: window.colorGettings.max,
                min: window.colorGettings.min,
                gradient: window.colorGettings.gradientColor,
                radius: window.colorGettings.radius,
                isGradient: window.colorGettings.isGradient
              };
            } else if (heatColor) {
              //heatColor控件
              var heartColorOption = heatColor.option();
              threeDRenderOption = {
                max: heartColorOption.max,
                min: heartColorOption.min,
                gradient: heartColorOption.gradientColor,
                radius: heartColorOption.radius,
                isGradient: heartColorOption.isGradient
              }
            } else {
              //默认
              threeDRenderOption = {
                max: defaultMax,
                min: defaultMin,
                gradient: default3DColor,
                radius: defaultRadius,
                isGradient: defaultIsGradient
              }
            }
            threeDRenderOption.width = width;
            threeDRenderOption.height = height;
            threeDRenderOption.afterDraw = function(imgSrc) {
                var $3dMap = $('#3dMap');

                var $image1 = $(
                    '<img id="3dMapImg1" src="' +
                      imgSrc +
                      '" style="width:100%;height:100%;position:absolute;left:0;top:0;z-index:0;opacity:0.7;"></img>'
                  ),
                  $image2 = $(
                    '<img id="3dMapImg2" src="' +
                      option.url +
                      '" style="width:100%;height:100%;position:absolute;left:0;top:0;z-index:1;"></img>'
                  );
                if ($3dMap.find('img').length > 0) {
                  $('#3dMapImg1', $3dMap)[0].src = imgSrc;
                } else {
                  $3dMap.append($image2);
                  $image2[0].onload = function() {
                    $3dMap.append($image1);
                  };
                }
              };
            var render = new threeDRender('lalala', threeDRenderOption);

            render.setData(data);
            render.render();
            this.updateDataTimer = null;
          }.bind(this),
          0
        );
      }
    }
    // 坐标变化
    if (
      !propName ||
      propName.indexOf('update.x') > -1 ||
      propName.indexOf('update.y') > -1
    ) {
      this.shape.position({
        x: model.x() + model.w() / 2,
        y: model.y() + model.h() / 2
      });
    }

    // 大小变化
    if (
      !propName ||
      propName.indexOf('update.w') > -1 ||
      propName.indexOf('update.h') > -1
    ) {
      this.shape.position({
        x: model.x() + model.w() / 2,
        y: model.y() + model.h() / 2
      });
      this.shape.offset({
        x: model.w() / 2,
        y: model.h() / 2
      });
      this.shape.width(model.w());
      this.shape.height(model.h());
      this.shape.fontSize && this.shape.fontSize(model.h());
    }
    //隐藏与否
    if (!propName || propName.indexOf('update.isHide') > -1) {
      if (this.store.model.isHide()) {
        this.detach();
      } else {
        this.attach();
      }
    }

    if (!propName || propName.indexOf('update.layerId') > -1) {
      this.setParent(model.layerId());
    }
  };

  HtmlHeat3D.prototype = Mixin(HtmlHeat3D.prototype, CanvasWidgetMixin);

  HtmlHeat3D.prototype.type = 'HtmlHeat3D';

  exports.HtmlHeat3D = HtmlHeat3D;
})(
  namespace('widgets.factory'),
  namespace('widgets.factory.Widget'),
  namespace('mixins.CanvasWidgetMixin')
);
