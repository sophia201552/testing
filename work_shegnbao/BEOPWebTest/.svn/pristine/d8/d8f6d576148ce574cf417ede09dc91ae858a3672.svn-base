(function (WidgetProp) {

    function CanvasHeatProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
    }

    

   

    CanvasHeatProp.prototype = Object.create(WidgetProp.prototype);
    CanvasHeatProp.prototype.constructor = CanvasHeatProp;
    CanvasHeatProp.prototype.tplPrivateProp = '';
    CanvasHeatProp.prototype.show = function () {
        
    };


    /** override */
    CanvasHeatProp.prototype.close = function () {

    };

    /** override */
    CanvasHeatProp.prototype.update = function () {
        
    };

    CanvasHeatProp.prototype.attachEvent = function () {
        
       
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory || {};
    window.widgets.props.CanvasHeatProp = CanvasHeatProp;
}(window.widgets.factory.WidgetProp));
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function CanvasHeatPropModel() {
        PropModel.apply(this, arguments);
    }

    CanvasHeatPropModel.prototype = Object.create(PropModel.prototype);
    CanvasHeatPropModel.prototype.constructor = CanvasHeatPropModel;

    CanvasHeatPropModel.prototype.option = function (params, attr) {//attr可以为空
        if (class2type.call(params) === '[object Object]') {
            if (arguments.length == 1) {
                this._setProperty('option', params);
            } else if (arguments.length == 2) {//只设置option的指定属性:attr
                this._setProperty('option.' + arguments[1], params[arguments[1]]);
            }
            return true;
        }
        var opt = $.extend(true, {}, this.models[0].option());
        for (var i = 1, len = this.models.length, modelOpt; i < len; i++) {
            modelOpt = this.models[i].option();
            for (var j in modelOpt) {
                if (opt[j] != modelOpt[j]) {
                    opt[j] = '';
                }
            }
        }
        return opt;
    };
    ['idDs', 'option.trigger', 'option.points', 'option.direction'].forEach(function (type) {
        CanvasHeatPropModel.prototype[type] = function (params) {
            var v;
            if (params) {
                this._setProperty(type, params);
                return true;
            }
            if ((v = this._isPropertyValueSame(type)) !== false) {
                return v;
            }
        };
    })

    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.CanvasHeatPropModel = CanvasHeatPropModel;

}(window.widgets.propModels.PropModel));