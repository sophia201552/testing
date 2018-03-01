/**
 * Created by win7 on 2016/5/3.
 */
(function () {

    function TDevice() {
        TShape.apply(this, arguments);

        this.supportLayerType = 'canvas';
    }

    TDevice.prototype = Object.create(TShape.prototype);
    TDevice.prototype.constructor = TDevice;

    TDevice.prototype.tpl = '\
<button class="btn-switch" title="设备控件" data-type="deviceCtr" style="display:none;">\
    <span class = "iconfont icon-shebeikongjian"></span>\
</button>';

    void function () {

        this.createEntity = function () {
            return {
                option: {
                    text: 'device',//文本
                    iotStore:{
                        id:'',
                        type:''
                    },//绑定设备的对象
                    link:{in:{},out:{}},//外连的对象：link:{in:{'attr1':'id','attr2':'id'},out:{}}
                    pop:{},//弹出框对象: pop:{id:'',name:''}
                    diagnosis:[],
                    tag:{},//文本控件: tag:{'attr':{}}
                    skin:{'index': null},
                    dsMap: {}
                },
                type: 'CanvasDevice',
                idDs: []
            };
        };

    }.call(TDevice.prototype);

    TDevice.prototype.close = function () {  };

    window.TDevice = TDevice;
} ());