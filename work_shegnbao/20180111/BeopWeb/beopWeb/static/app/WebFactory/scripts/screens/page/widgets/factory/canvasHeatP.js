﻿(function(exports, Widget, CanvasWidgetMixin, CanvasHeatC, TooltipMixin) {
  var _this;
  function CanvasHeatP(layer, model) {
    Widget.apply(this, arguments);
    this.text = undefined;
    this.children = [];
    this.rect = undefined;
    _this = this;
    //this.init();
  }

  CanvasHeatP.prototype = Object.create(Widget.prototype);
  CanvasHeatP.prototype.constructor = CanvasHeatP;

  CanvasHeatP.prototype.init = function() {
    this._format();
    Widget.prototype.init.apply(this, arguments);
  };
  CanvasHeatP.prototype._format = function() {
    //兼容老数据
    var options = this.store.model.option();
    if (typeof this.store.model.isHide === 'undefined') {
      this.store.model.property('isHide', 0);
    }
    if (!options.preview) {
      options.preview = [];
    }
    if (!options.heat3DId) {
      options.heat3DId = undefined;
    }
    this.store.model.option(options);
  };
  /** override */
  CanvasHeatP.prototype.show = function(isS) {
    //isS  true表示预览  false表示非预览
    _this = this;
    var model = this.store.model;
    var option = model.option();

    var radius = option.radius,
      width = (height = radius * 2),
      color = option.fill,
      id = model._id(),
      x = model.x(),
      y = model.y(),
      centerX = x + radius,
      centerY = y + radius;

    if (isS) {
      var fontSize = option.fontSize,
        unitType = option.unitType;
      var polygonArr = option.polygonArr;
      var polygonId = option.polygonId;

      width = width * 2 + Number(fontSize);
      // width = 60;
      this.shape = new Konva.Text({
        id: id,
        name: 'heat-circle hc_' + id,
        text: '--',
        fontSize: fontSize,
        fontFamily: 'Calibri',
        fill: color,
        fontStyle: 'bold',
        width: width,
        height: fontSize,
        // x: centerX-width/2,
        // y: centerY-fontSize/2,
        x: x - fontSize / 2,
        y: y,
        align: 'center',
        stroke: 'black',
        strokeEnabled: false,
        strokeWidth: 0,
        align: 'center',
        padding: (height - fontSize) / 2
      });
    } else {
      this.shape = new Konva.Rect({
        id: id,
        name: 'heat-circle hc_' + id,
        x: x,
        y: y,
        width: width,
        height: height,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 4
      });
    }
    if (model.idDs().length) {
      this.enableTooltip &&
        this.initTooltip({
          clickable: AppConfig.isFactory === 0
        });
    }
    this.layer.add(this.shape);
    this.shape.moveToTop();
    this.update();
  };

  /** override */
  CanvasHeatP.prototype.update = function(e, propType) {
    var model = this.store.model;
    var option = model.option();
    var polygonId = option.polygonId;
    var radius = option.radius;
    var temp;
    if (!propType || propType.indexOf('update.idDs') > -1) {
      if ($.fn.zTree) {
        var treeObj = $.fn.zTree.getZTreeObj('parentTree');
      }
      if (treeObj) {
        var node = treeObj.getNodeByParam('modelId', model._id());
        if (node && model.idDs) {
          var idDs = model.idDs();
          var name;
          if (idDs.length > 0) {
            name = idDs[0];
            name !== node.name &&
              ((node.name = name), treeObj.updateNode(node));
          } else {
            node.name = I18n.resource.mainPanel.layerName.HEATP;
            treeObj.updateNode(node);
          }
        }
      }
    }

    if (
      option.text &&
      propType &&
      propType.indexOf('update.option.text') > -1
    ) {
      temp = option.text.value; //接受的温度
      temp = Number(temp).toFixed(1);
      this.shape.text(temp);
      var heatColor = this.painter.store.widgetModelSet.findByProperty(
        'type',
        'CanvasHeatColor'
      );
      var ca;
      if (window.colorGettings) {
        //用户配置
        ca = new CanvasHeatC({
          max: window.colorGettings.max,
          min: window.colorGettings.min,
          data: temp,
          gradient: window.colorGettings.gradientColor,
          radius: window.colorGettings.radius,
          isGradient: window.colorGettings.isGradient
        });
      } else if (heatColor) {
        //heatColor控件
        var heatColorOption = heatColor.option();
        ca = new CanvasHeatC({
          max: heatColorOption.max,
          min: heatColorOption.min,
          data: temp,
          gradient: heatColorOption.gradientColor,
          radius: heatColorOption.radius,
          isGradient: heatColorOption.isGradient
        });
      } else {
        //默认
        ca = new CanvasHeatC({ data: temp });
      }

      var polygonColor = ca.color();
      var heatPolygon = this.painter.store.widgetModelSet.findByProperty(
        '_id',
        polygonId
      );

      var heat3DId = option.heat3DId;
      var heat3D = this.painter.store.widgetModelSet.findByProperty(
        '_id',
        heat3DId
      );
      if (heat3D) {
        window.isHtmlHeat3D = true;
        var heat3DData = heat3D['option.data']();
        var modelId = model._id();
        heat3DData[modelId] = {
          tempPoint: [model.x() + radius, model.y() + radius, Number(temp)]
        };
        heat3D.update({
          'option.data': heat3DData
        });
      } else {
        window.isHtmlHeat3D = false;
        heatPolygon &&
          heatPolygon.update({
            'option.color': polygonColor
          });
      }
    }
    if (
      propType &&
      (propType.indexOf('update.x') > -1 || propType.indexOf('update.y') > -1)
    ) {
      this.shape.x(model.x());
      this.shape.y(model.y());
    }
    if (propType && propType.indexOf('update.option.fill') > -1) {
    }

    if (propType && propType.indexOf('update.option.polygonId') > -1) {
    }

    //更新 isHide
    if (!propType || propType.indexOf('update.isHide') > -1) {
      if (this.store.model.isHide()) {
        this.detach();
      } else {
        this.attach();
      }
    }

    if (!propType || propType.indexOf('update.layerId') > -1) {
      this.setParent(model.layerId());
    }

    this.layer.draw();
  };
  CanvasHeatP.prototype = Mixin(CanvasHeatP.prototype, CanvasWidgetMixin);

  CanvasHeatP.prototype.x = function() {
    var model = this.store.model;
    return model.x() - model['option.radius']() * 2;
  };

  CanvasHeatP.prototype.y = function() {
    var model = this.store.model;
    return model.y() - model['option.radius']();
  };

  CanvasHeatP.prototype.width = function() {
    return this.store.model['option.radius']() * 2;
  };

  CanvasHeatP.prototype.height = function() {
    return this.store.model['option.radius']() * 2;
  };

  CanvasHeatP.prototype.getType = function() {
    return 'Combine';
  };
  CanvasHeatP.prototype.moveToBottom = function() {};
  CanvasHeatP.prototype._refresh = function() {
    var model = this.store.model;
    model.emit('update', 'update.option.text.value');
  };

  CanvasHeatP.prototype = Mixin(CanvasHeatP.prototype, TooltipMixin);

  exports.CanvasHeatP = CanvasHeatP;
})(
  namespace('widgets.factory'),
  namespace('widgets.factory.Widget'),
  namespace('mixins.CanvasWidgetMixin'),
  namespace('widgets.factory.CanvasHeatC'),
  namespace('mixins.TooltipMixin')
);