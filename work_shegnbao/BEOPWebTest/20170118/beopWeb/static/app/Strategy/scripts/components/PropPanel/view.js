;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports);
    } else {
        factory(
            root
        );
    }
}(namespace('beop.strategy.components.PropPanel'), function (exports) {

    function View(container) {
        this.container = container;
    }

    // PROTOTYPES
    +function () {
        /**
         * Constructor 
         */
        this.constructor = View;

        this.init = function (intents) {
            this.theme.intents = intents;
        };

        this.ready = function (model) {

            return (
                 this.theme.topBtn(model.isShow)+this.theme.renderPanel(model.items)
            );
        };

        this.display = function (representation) {
            this.container.innerHTML = representation;
        };

    }.call(View.prototype);

    +function () {

        this.intents = {};

        this.topBtn = function(isShow) {
            if(isShow){
                return (
                    '<div class="propTopBtn">\
                        <button class="btn btn-default save" onclick="'+this.intents['save']+'({target:this})">保存</button>\
                        <button class="btn btn-default recover" onclick="'+this.intents['recover']+'()">恢复</button>\
                    </div>'
                );
            }else{
                return '';
            }
        };

        this.renderPanel = function(items){
            if(items.length === 1){
                var enable='',disable='';
                var diagnosis='',kpi='',point='';
                if( Number(items[0].status) === 0 ){//未启用
                    enable='';
                    disable='selected';
                }else{//启用
                    enable='selected';
                    disable='';
                }

                if( Number(items[0].type)=== 0 ){
                    diagnosis='selected';
                    kpi='';
                    point='';
                }else if( Number(items[0].type) === 1 ){
                    diagnosis='';
                    kpi='selected';
                    point='';
                }else{
                    diagnosis='';
                    kpi='';
                    point='selected';
                }
                return (
                    '<form class="form-inline">\
                        <div class="form-group">\
                            <label>名字</label>\
                            <input type="text" name="name" value="'+items[0].name+'">\
                        </div>\
                        <div class="form-group">\
                            <label>状态</label>\
                            <select value="'+items[0].status+'" name="status">\
                                <option value="1" '+enable+'>启用</option>\
                                <option value="0" '+disable+'>未启用</option>\
                            </select>\
                        </div>\
                        <div class="form-group">\
                            <label>运行间隔</label>\
                            <input type="text" value="'+items[0].interval+'" name="interval">\
                        </div>\
                        <div class="form-group">\
                            <label>类型</label>\
                            <select value="'+items[0].type+'" name="type">\
                                <option value="0" '+diagnosis+'>诊断</option>\
                                <option value="1" '+kpi+'>KPI</option>\
                                <option value="2" '+point+'>计算点</option>\
                            </select>\
                        </div>\
                        <div class="form-group">\
                            <label>ID</label>\
                            <input type="text" value="'+items[0]._id+'" disabled>\
                        </div>\
                        <div class="form-group">\
                            <label>描述</label>\
                            <input type="text" value="'+items[0].desc+'" title="'+items[0].desc+'" name="desc">\
                        </div>\
                        <div class="form-group">\
                            <label>从属</label>\
                            <input type="text" value="'+items[0].nodeId+'" disabled>\
                        </div>\
                        <div class="form-group">\
                            <label>最后运行时间</label>\
                            <input type="text" value="'+items[0].lastRuntime+'" disabled>\
                        </div>\
                        <div class="form-group">\
                            <label>修改人</label>\
                            <input type="text" value="'+items[0].userId+'" disabled>\
                        </div>\
                        <div class="form-group">\
                            <label>最后修改时间</label>\
                            <input type="text" value="'+items[0].lastTime+'" disabled name="lastTime">\
                        </div>\
                    </form>'
                );
            }else if(items.length === 0){
                return '';
            }else{
                var keys = Object.keys(items[0]);
                var obj = {};
                keys.forEach(function(key){
                    obj[key] = new Set(items.map((item)=>{return item[key]})).size>1?'':items[0][key];
                })
                var enable='',disable='';
                var diagnosis='',kpi='',point='';
                if( Number(obj.status) === 0 ){//未启用
                    enable='';
                    disable='selected';
                }else{//启用
                    enable='selected';
                    disable='';
                }

                if( Number(obj.type)=== 0 ){
                    diagnosis='selected';
                    kpi='';
                    point='';
                }else if( Number(obj.type) === 1 ){
                    diagnosis='';
                    kpi='selected';
                    point='';
                }else{
                    diagnosis='';
                    kpi='';
                    point='selected';
                }
                
                return (
                '<form class="form-inline">\
                    <div class="form-group">\
                        <label>名字</label>\
                        <input type="text" value="'+obj.name+'" name="name">\
                    </div>\
                    <div class="form-group">\
                        <label>状态</label>\
                        <select value="'+items[0].status+'" name="status">\
                            <option value="1" '+enable+'>启用</option>\
                            <option value="0" '+disable+'>未启用</option>\
                        </select>\
                    </div>\
                    <div class="form-group">\
                        <label>频率</label>\
                        <input type="text" value="'+obj.interval+'" name="interval">\
                    </div>\
                    <div class="form-group">\
                        <label>类型</label>\
                        <select value="'+items[0].type+'" name="type">\
                            <option value="0" '+diagnosis+'>诊断</option>\
                            <option value="1" '+kpi+'>KPI</option>\
                            <option value="2" '+point+'>计算点</option>\
                        </select>\
                    </div>\
                    <div class="form-group">\
                        <label>描述</label>\
                        <input type="text" value="'+obj.desc+'" title="'+obj.desc+'" name="desc">\
                    </div>\
                    <div class="form-group">\
                        <label>最后修改时间</label>\
                        <input type="text" value="'+items[0].lastTime+'" disabled name="lastTime">\
                    </div>\
                </form>'
                );
            }
        }

    }.call(View.prototype.theme = {});

    exports.View = View;
}));