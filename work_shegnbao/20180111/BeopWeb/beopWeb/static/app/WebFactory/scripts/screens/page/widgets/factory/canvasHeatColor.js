(function (exports, Widget, CanvasWidgetMixin) {
    var threeDRender = exports.threeDRender;
    function CanvasHeatColor(layer, model) {
        // SuperClass.apply(this, arguments);
        Widget.apply(this, arguments);
        this.updateDataTimer = null;
    }

    CanvasHeatColor.prototype = Object.create(Widget.prototype);
    CanvasHeatColor.prototype.constructor = CanvasHeatColor;

    CanvasHeatColor.prototype.init = function () {
        //兼容一下老数据格式
        this._format();

        Widget.prototype.init.apply(this, arguments);
    };

    //兼容老数据
    CanvasHeatColor.prototype._format = function () {

    };

    /** override */
    CanvasHeatColor.prototype.show = function (isS) {

        _this = this;
        var model = this.store.model;
        var option = model.option();
        
        var width = model.w(),
            height = model.h(),
            id = model._id(),
            x = model.x(),
            y = model.y();
        this.shape = new Konva.Text({
            id: model._id(),
            x: 0,
            y: 0,
            text: isS?'':'HeatColor',
            fontSize: height,
            fill: 'blue',
            align: 'center',
        });

        this.layer.add(this.shape);
        // this.shape.moveToTop();
        this.update();
    };

    /** override */
    CanvasHeatColor.prototype.update = function (e, propName) {
        var _this = this;
        var model = this.store.model;
        var option = model.option();
        var value;
        if(propName && propName.indexOf('update.option.data') > -1){
            
            // if(!this.updateDataTimer){
            //     this.updateDataTimer = setTimeout(function(){
            //         //更新逻辑
            //         var width = option.width,
            //             height = option.height;
            //         var data = [];
            //         for(var k in option.data){
            //             data.push(option.data[k].tempPoint);
            //         }
            //         var render = new threeDRender('lalala',{
            //             width: width,
            //             height: height,
            //             max: window.colorGettings?window.colorGettings.max:28,
            //             min:window.colorGettings?window.colorGettings.min:20,
            //             gradientColor: window.colorGettings?window.colorGettings.gradientColor:'0,#3434ff;0.17,#35ffff;0.33,#36fe94;0.5,#6ff71c;0.67,#9fff39;0.83,#ffa922;1,#ff2323;',
            //             afterDraw: function(imgSrc){
            //                 var $3dMap = $('#3dMap');

            //                 var $image1 = $('<img id="3dMapImg1" src="'+imgSrc+'" style="width:100%;height:100%;position:absolute;left:0;top:0;z-index:0;opacity:0.7;"></img>'),
            //                     $image2 = $('<img id="3dMapImg2" src="'+option.url+'" style="width:100%;height:100%;position:absolute;left:0;top:0;z-index:1;"></img>');
            //                 if($3dMap.find('img').length>0){
            //                     $('#3dMapImg1', $3dMap)[0].src = imgSrc;
            //                 }else{
            //                     $3dMap.append($image2);
            //                     $image2[0].onload = function(){
            //                         $3dMap.append($image1);
            //                     }
            //                 }
                            
            //             }
            //         });
                    
            //         render.setData(data);
            //         render.render();
            //         this.updateDataTimer = null;
            //     }.bind(this), 0);
            // }
        }
        // 坐标变化
        if ( !propName || propName.indexOf('update.x') > -1 ||
            propName.indexOf('update.y') > -1 ) {
            this.shape.position({
                x: model.x() + model.w() / 2,
                y: model.y() + model.h() / 2
            });
        }

        // 大小变化
        if ( !propName || propName.indexOf('update.w') > -1 ||
            propName.indexOf('update.h') > -1 ) {
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
            this.shape.fontSize&&this.shape.fontSize(model.h());
        }
        //隐藏与否
        if (!propName || propName.indexOf('update.isHide') > -1) {
            if(this.store.model.isHide()){
                this.detach();
            }else{
                this.attach();
            }
        }

        if (!propName || propName.indexOf('update.layerId') > -1) {
            this.setParent(model.layerId());
        }
    };

    CanvasHeatColor.prototype = Mixin(CanvasHeatColor.prototype, CanvasWidgetMixin);

    CanvasHeatColor.prototype.type = 'CanvasHeatColor';

    exports.CanvasHeatColor = CanvasHeatColor;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.Widget'),
    namespace('mixins.CanvasWidgetMixin')
));