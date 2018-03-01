(function () {
    var _this;
    function PropertyPanel(screen) {
        _this = this;
        this.screen = screen;
        this.container = screen.propPanelCtn;
        this.state = screen.painter.state;
        this.$propertyList = undefined;
        this.widgetProp = undefined;
    }

    PropertyPanel.prototype.init = function () {
        this.$propertyList && this.$propertyList.remove();
        this.container.innerHTML = '';
        $(this.container).append('<ul id="propertyList" class="list-unstyled gray-scrollbar"></ul>');
        this.$propertyList = $('#propertyList');
        this.bindStateOb();
    };

    PropertyPanel.prototype.close = function () {
        if(this.$propertyList){
            this.$propertyList.next().remove();
            this.$propertyList.remove();
        }
        this.screen = null;
        this.container = null;
        this.state = null;
        this.$propertyList = null;
        this.widgetProp = null;
    };

    PropertyPanel.prototype.show = function () {
        this.init();
    };

    PropertyPanel.prototype.showWidgetProp = function(activeWidgets){
        var model = activeWidgets[0].store.model;
        var modelType = model.type();//存放第一个选中控件的类型
        var clazzList = namespace('widgets.props'), propClazz, propModelClazz;

        activeWidgets = activeWidgets.map(function (m) {
            var md = m.store.model;
            if(model.type() != md.type()) modelType = '';
            return md;
        });

        if(modelType !== '' && clazzList.hasOwnProperty(modelType + 'Prop')){// widget has the same type
            propClazz = clazzList[modelType + 'Prop'];
            propModelClazz = namespace('widgets.propModels.' + modelType + 'PropModel');
        } else {
             // widget has different type, just show property of [x,y,w,h]
             // or no widget prop class
            propClazz = namespace('widgets.props.WidgetProp');
            propModelClazz = namespace('widgets.propModels.PropModel');
        }
        this.widgetProp = new propClazz(this, this.$propertyList, new propModelClazz(activeWidgets, this.screen));
        this.widgetProp.show();
    };
    PropertyPanel.prototype.showLayerProp = function(activeLayers){
        var model = activeLayers[0].store.model;
        var modelType = model.type();//存放第一个选中控件的类型
        activeLayers = activeLayers.map(function (m) {
            var md = m.store.model;
            if(model.type() != md.type()) modelType = '';
            return md;
        });
        if(modelType != ''){//widget has the same type
            var type = model.type();
            type = type.substr(0,1).toUpperCase()+type.substr(1);
            this.widgetProp = new window.widgets.props[type+'Prop'](this, this.$propertyList, new window.widgets.propModels[type+'PropModel'](activeLayers));
        }else{//widget has different type, just show property of [x,y,w,h]
            this.widgetProp = new window.widgets.props['WidgetProp'](this, this.$propertyList, new window.widgets.propModels['PropModel'](activeLayers));
        }
        this.widgetProp.show();
    };
    PropertyPanel.prototype.bindStateOb = function () {
        this.state.addEventListener('update.activeLayers', function (e) {
            Log.info('property panel change activing layer');
            var activeLayers=this.state.activeLayers();
            if(activeLayers && activeLayers.length == 1 && activeLayers[0].store.model.type() === 'bg'){
                _this.showLayerProp(activeLayers);
            }else{
                _this.$propertyList.next().remove();
                _this.$propertyList.empty();
                }
        }, this);
        this.state.addEventListener('update.activeWidgets', function (e, data) {
            Log.info('property panel change activing widgets');
            var activeWidgets = this.state.activeWidgets();
            if(activeWidgets && activeWidgets.length > 0){
                activeWidgets.forEach(function(widget){
                    var model = widget.store.model;
                    model.removeEventListener('update', this.eventListenerPropModel);
                    model.addEventListener('update', this.eventListenerPropModel, this);
                }, this);
                _this.showWidgetProp(activeWidgets);
            }else{
                _this.$propertyList.next().remove();
                _this.$propertyList.empty();
            }
        }, this);
    };

    PropertyPanel.prototype.eventListenerPropModel = function(){
        Log.info('property model update');
        this.widgetProp.show();
    }

    window.PropertyPanel = PropertyPanel;

} ());