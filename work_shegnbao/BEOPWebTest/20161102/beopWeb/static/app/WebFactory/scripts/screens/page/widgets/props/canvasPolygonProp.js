(function (WidgetProp) {
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });
    var _this;
    var modal = `
        <div id="modal" class ="modal fade in" style="display: none;">
            <style>
                .wrap{
                    width:50%;height:auto;margin:10% 25%;background-color:#eee;z-index: 1;position: absolute;border-radius: 10px;
                }
                .titleLabel{
                    text-align: left;
                    width: 10%;
                }
                .checkDiv{
                    display: block;
                    padding: 3px 20px;
                    position: relative;
                    clear: both;
                    font-weight: normal;
                    line-height: 1.42857143;
                    color: #c7c7c7;
                    white-space: nowrap;
                    cursor: pointer;
                }
                .checkDiv:hover{
                    color: #fff;
                    background-color: #5a6676;
                }
                .checkDiv::before{
                    display: block;
                    content: "";
                    width: 12px;
                    height: 12px;
                    font-size: 12px;
                    text-align: center;
                    font-weight: bolder;
                    line-height: 12px;
                    background-color: #eee;
                    color: #31b0d5;
                    position: absolute;
                    left: 5px;
                    top: 50%;
                    margin-top: -6px;
                    border: 1px solid #ccc;
                }
                .checkDiv.checked::before{
                    content: "√";
                }
                #layersGroup>div{
                    display: inline-block;
                }
                .item{
                    margin-right:10px;
                }
                #eventsGroup .item.active,#eventsGroup .item:hover{ 
                    background-color: #3071a9;
                    border-color: #285e8e;
                    outLine:none;
                }
            </style>
            <div class="wrap">
                <div class="modal-header">
                    <a class="close" data-dismiss="modal">×</a>
                    <h3>Events</h3>
                </div>
                <div class="modal-body" style="overflow: visible;">
                    <div id ="eventsGroup">
                        <label class="titleLabel">Event</label>
                        <div id="eventsBtn" class="btn-group">
                            <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">
                            Add <span class="caret"></span>
                            </button>
                            <ul id="eventsList" class="dropdown-menu" role="menu">
                                <li><a href="#" data-type="hover">hover</a></li>
                                <li><a href="#" data-type="click">click</a></li>
                            </ul>
                        </div>
                    </div>
                    <div style="padding-top: 15px;position:relative;" id="layersGroup">
                        <label class="titleLabel">Layers</label>
                    </div>
                </div>
                <div class ="modal-footer">
                    <button id="save" type="button" class ="btn btn-success">Save</button>
                    <button type="button" class="btn btn-danger"  data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>`
    function CanvasPolygonProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
        _this = this;
    }

    CanvasPolygonProp.prototype = Object.create(WidgetProp.prototype);
    CanvasPolygonProp.prototype.constructor = CanvasPolygonProp;

    CanvasPolygonProp.prototype.tplPrivateProp = '\
    <li id="liEnumerateWrap" style="padding-top: 10px;">\
        <div class="divTool">\
            <div class="enumerateCtn">\
                <span class="span-bold">Events:</span>\
                <input id="inpShow" type="button" class="btn btn-default btn-xs" style="margin-left:10px;" value="Show"/>\
            </div>\
        </div>\
    </li>\
    ';

    /** override */
    CanvasPolygonProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model;
        var opt = model.option();
        var option = {};
        this.$propertyList.append(this.tplPrivateProp.formatEL(option)); 
        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };


    /** override */
    CanvasPolygonProp.prototype.close = function () {

    };

    /** override */
    CanvasPolygonProp.prototype.update = function () {
        console.log('polugon is update');
    };
    
    CanvasPolygonProp.prototype.attachEvent = function () {
        $('#inpShow').off('click').on('click', function () {
            var model = _this.store.model;
            var opt = model.option();
            var $modal;
            var eventList = '',layersList = '';
            $('body').append(modal);
            $modal = $("#modal");
            $modal.on('show.bs.modal', function () {
                var $eventsGroup = $('#eventsGroup', $modal);
                var $layersGroup = $('#layersGroup', $modal);
                var $eventsBtn = $('#eventsBtn');
                var layersMap = _this.panel.screen.painter.getLayerStatus();
                var info = {};
                var checkedType;
                var checkItem = function (layerMap) {
                    $layersGroup.find('.checked').removeClass('checked');
                    for (var k in layerMap) {
                        if(layerMap[k] == '1'){
                            $('[data-idValue=' + k + ']', $modal).addClass('checked');
                        }
                    }
                };
                //显示events
                opt.events.forEach(function (item, index) {
                    eventList += '<button type="button" class="btn btn-primary item" data-typeValue="' + item.type + '">' + item.type + '<span class="glyphicon glyphicon-remove" style="margin-left:6px"></span></button>';
                    info[item.type] = item.layerMap;
                });
                $eventsBtn.before(eventList);
                
                //显示layers
                for (var k in layersMap) {
                    var className = layersMap[k] == "0" ? "" : " checked";
                    layersList += '<div class="checkDiv'+ className +'" data-idValue="' + k + '">' + _this.panel.screen.painter.store.layerModelSet.findByProperty("_id", k).name()+'</div>';
                }
                $layersGroup.append(layersList);
                checkedType = '';
                //默认显示
                if (opt.events[0]) {
                    $('[data-typeValue=' + opt.events[0].type + ']').addClass('active');
                    //option优先级
                    checkItem(opt.events[0].layerMap);
                    checkedType = opt.events[0].type;
                }
                
                //events选中显示
                $('#eventsGroup', $modal).on('click', '.item', function () {
                    var $this = $(this);
                    $this.addClass('active').siblings().removeClass('active');
                    checkItem(info[$this.data('typevalue')]);
                    checkedType = $this.data('typevalue');
                });
                //添加events
                $('#eventsList', $modal).on('click', 'a', function () {
                    if ($eventsGroup.find('[data-typeValue=' + this.dataset.type + ']').length >= 1) return;
                    layersMap = _this.panel.screen.painter.getLayerStatus();
                    $('.item.active', $modal).removeClass('active');
                    $eventsBtn.before('<button type="button" class="btn btn-primary item active" data-typeValue="' + this.dataset.type + '">' + this.dataset.type + '<span class="glyphicon glyphicon-remove" style="margin-left:6px"></span></button>');
                    info[this.dataset.type] = layersMap;
                    checkItem(layersMap);
                    checkedType = [this.dataset.type];
                });
                //删除events
                $('#eventsGroup', $modal).on('click', '.glyphicon', function (e) {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();
                    var $parent = $(this).parent();
                    layersMap = _this.panel.screen.painter.getLayerStatus();
                    delete info[$parent.data('typevalue')];
                    $parent.remove();
                    var items = $('#eventsGroup .item');
                    if (items.length > 0) {
                        items.eq(0).click();
                        checkedType = items.eq(0).data('typevalue');
                    } else {
                        checkItem(layersMap);
                        checkedType = '';
                    }
                });

                //选择layers
                $layersGroup.on('click', '.checkDiv', function () {
                    var $this = $(this);
                    if (checkedType == '') return;
                    $this.toggleClass('checked');
                    info[checkedType][$this.data('idvalue')] = $this.hasClass('checked') ? 1 : 0;
                });

                //保存
                $('#save', $modal).on('click', function () {
                    var finEvents = [];
                    for (var k in info) {
                        finEvents.push({
                            'type': k,
                            'layerMap':info[k]
                        })
                    }
                    model['option.events'](finEvents);
                    $('[data-dismiss="modal"]').click();
                });
            });
            $modal.on('hidden.bs.modal', function () {
                $(this).remove();
            });
            $modal.modal('show');
        });
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory || {};
    window.widgets.props.CanvasPolygonProp = CanvasPolygonProp;

}(window.widgets.factory.WidgetProp));

/** Canvas Image Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function CanvasPolygonPropModel() {
        PropModel.apply(this, arguments);
    }

    CanvasPolygonPropModel.prototype = Object.create(PropModel.prototype);
    CanvasPolygonPropModel.prototype.constructor = CanvasPolygonPropModel;

    CanvasPolygonPropModel.prototype.option = function (params, attr) {//attr可以为空
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
    ['idDs', 'option.trigger', 'option.points', 'option.direction', 'option.preview', 'option.events'].forEach(function (type) {
        CanvasPolygonPropModel.prototype[type] = function (params) {
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
    //CanvasPolygonPropModel.prototype.idDs = function (params) {
    //    var v;
    //    if(params) {
    //        this._setProperty('idDs', params);
    //        return true;
    //    }
    //    if((v = this._isPropertyValueSame('idDs') ) !== false ) {
    //        return v;
    //    }
    //};

    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.CanvasPolygonPropModel = CanvasPolygonPropModel;

}(window.widgets.propModels.PropModel));