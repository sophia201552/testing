(function (WidgetProp) {
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });
    var _this;
    function CanvasHeatPProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
        _this = this;
    }

    CanvasHeatPProp.prototype = Object.create(WidgetProp.prototype);
    CanvasHeatPProp.prototype.constructor = CanvasHeatPProp;

    CanvasHeatPProp.prototype.tplPrivateProp = '\
        <li>\
            <ul class="list-inline tempFont">\
                <li id="prop-fontSize"><label class="property-name">size:</label><input id="inputSize" style="display:inline-block;width:50px;padding: 2px;" type="text" value="{fontSize}"/>px</li>\
                <li id="prop-fontColor" class="txtShow"><label class="property-name">color:</label><input id="inputColor" type="color" value="{fontColor}"/></li>\
                <li id="prop-unitType" class="txtShow"><label class="property-name">unit:</label>\
                <select id="inputUnitType">\
                        <option value="Celsius">Celsius</option><option value="Fahrenheit">Fahrenheit</option>\
                    </select></li>\
            </ul>\
        </li>\
       <li>\
            <ul class="list-inline" style="position: relative;">\
                <li class="divPorpertyBase">\
                    <div class="dataSource">\
                        <span class="span-bold">Datasource:</span>\
                        <span class="spanDs" ds-id="{dsId}" style="display:{isShowDsName}">\
                            <span class="dsText">{dsName}</span>\
                            <span class="btnRemoveDs glyphicon glyphicon-remove"></span>\
                        </span>\
                        <input type="text" class="dsPreview" value="{dsPreview}" style="width:50px;display:{isShowDsName};" placeholder="调试值">\
                        <span class="dropArea" style="display:{isShowDropArea}">\
                            <span class="glyphicon glyphicon-plus"></span>\
                            <input value="" type="text" style="display:none;border:none;" id="iptCloudPoint">\
                        </span>\
                    </div>\
 					</li>\
                <li id="liEnumerateWrap" style="padding-top: 10px;display:none">\
                    <div class="divTool">\
                        <div class="enumerateCtn">\
                            <span class="span-bold">Enumerate:</span>\
                        <input id="ckbEnumerate" type="checkbox" style="margin-left:10px;" />\
                        </div>\
                        <span id="btnAddEnumerate" class="glyphicon glyphicon-plus-sign btnEnumerate"></span>\
                        <span id="btnSaveEnumerate" class="glyphicon glyphicon-ok-circle btnEnumerate"></span>\
                    </div>\
                </li>\
                <div id="enumerateWrap">\
                    <ul class="list-unstyled">\
                        <li class="enumerateItem">\
                            <div class="enumeratePart"><label class="enumerateLabel">Key:</label><input class="enumerateKey"></div>\
                            <div class="enumeratePart divEnumerateVal"><label class="enumerateLabel">Value:</label><input class="enumerateVal"></div>\
                            <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate">\
                        </li>\
                    </ul>\
                </div>\
            </ul>\
        </li>';

    /** override */
    CanvasHeatPProp.prototype.show = function () {
        this.$propertyList.empty();
		var model = this.store.model,
            isShowDsName = 'none',
            isShowEnumerate = 'none',
            isShowDropArea = 'inline-block',
            isDisabled = ' disabled';
        var opt = model.option();
        var defaultOpt = {
            x: typeof model.x() === 'number' ? model.x() : '-',// model.x() || '-',
            y: typeof model.y() === 'number' ? model.y() : '-',//model.y() || '-',
            w: typeof model.w() === 'number' ? model.w() : '-',//model.w() || '-',
            h: typeof model.h() === 'number' ? model.h() : '-'//model.h() || '-'
        };
        var option = {
            html: opt.html,
            width: opt.radius*2,
            fontColor: opt.fill,
            fontSize: opt.fontSize,
            //unitType: opt.unitType === 0 ? 'Celsius ' : 'Fahrenheit',
            dsId: model.idDs(),
            dsName: (function (ids) {//获取点名
                var idsName = [];
                if (!ids || !(ids instanceof Array) || ids.length == 0) return;
                isShowDsName = 'inline-block';
                isShowDropArea = 'none';

                if (ids[0].indexOf('@') === 0) {
                    idsName = ids[0];
                    return idsName;
                }
                var arrItem = [];
                arrItem = AppConfig.datasource.getDSItemById(ids);
                ids.forEach(function (id) {
                    for (var m = 0; m < arrItem.length; m++) {
                        if (id == arrItem[m].id) {
                            idsName = arrItem[m].note ? arrItem[m].note : arrItem[m].alias;
                            break;
                        }
                    }
                });
                return idsName;
            }(model.idDs())),
            dsPreview: model.option().preview.length > 0 ? model.option().preview[0] : '',
            isShowDsName: isShowDsName,
            isShowDropArea: isShowDropArea
        };
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));

        //国际化
        //$('.dataSource').find('.span-bold').html(I18n.resource.mainPanel.attrPanel.attrRepeat.DATA_SOURCE);
        //$('.heatP-width').html(I18n.resource.mainPanel.attrPanel.attrPipe.PIPE_WIDTH);
        //$('.heatP-color').html(I18n.resource.mainPanel.attrPanel.attrPipe.PIPE_COLOR);
        //$('.heatP-flowDirection').html(I18n.resource.mainPanel.attrPanel.attrPipe.REVERSE_FLOW);

        //单位
        if(model.option().unitType){
            var $inputUnitType = $('#inputUnitType');
            if(opt.unitType === 0){
                $inputUnitType.val('Celsius');
            }else{
                $inputUnitType.val('Fahrenheit');
            }
        }
        
        this.attachPubEvent(this.store.model);
        this.attachEvent();
    };


    /** override */
    CanvasHeatPProp.prototype.close = function () {

    };

    /** override */
    CanvasHeatPProp.prototype.update = function () {
        console.log('heatP is update');
    };
    CanvasHeatPProp.prototype.cloudPoint = function (e) {
        var $this = $(e.currentTarget);
         if ($this.val() === '') {
             $this.hide();
             $this.prev().show();
         } else {
             if ($this.val().indexOf('@') === 0) {
                 var currentPoint = $this.val().split('@')[1];
                 if ($this.val().indexOf('|') < 0) {
                     alert('云点格式错误！');
                     return;
                 }
                 var currentId = currentPoint.split('|')[0];
                 var currentVal = currentPoint.split('|')[1];
                 if (currentVal === '') {
                     alert('云点格式错误！');
                     return;
                 } else {
                     currentVal = '^' + currentPoint.split('|')[1] + '$';
                 }
                 Spinner.spin($('body')[0]);
                 WebAPI.get('/point_tool/searchCloudPoint/' + currentId + '/' + currentVal).done(function (result) {
                     var data = result.data;
                     if (data.total === 1) {
                         _this.store.model.update({
                             'idDs': [$('#iptCloudPoint').val()]
                         });
                     } else {
                         alert(I18n.resource.mainPanel.exportModal.NO_POINT);
                     }
                 }).always(function () {
                     Spinner.stop();
                 });
             } else {
                 var project = AppConfig.project;
                 var currentVal = '^' + $this.val() + '$';
                 if (project.bindId) {
                     var currentId = project.bindId;
                     Spinner.spin($('body')[0]);
                     WebAPI.get('/point_tool/searchCloudPoint/' + currentId + '/' + currentVal).done(function (result) {
                         var data = result.data;
                         if (data.total === 1) {
                             _this.store.model.update({
                                 'idDs': ['@' + currentId + '|' + $('#iptCloudPoint').val()]
                             });
                         } else {
                             alert(I18n.resource.mainPanel.exportModal.NO_POINT);
                         }
                     }).always(function () {
                         Spinner.stop();
                     });
                 } else {
                     alert('该项目未绑定，写入的云点无效！');
                     return;
                 }
             }
         }
     };
    CanvasHeatPProp.prototype.attachEvent = function () {

        $('#inputUnitType,#inputSize,#inputColor').off('change').on('change', function () {
            var str, id = this.id, value = this.value;
            //if (isNaN(value)) return;
            var model = _this.store.model;
            switch(id){
                case 'inputUnitType':
                    value = value == 'Celsius' ? 0 : 1;
                    str = 'option.unitType';
                    break;
                case 'inputSize':
                    if (isNaN(value)) return;
                    str = 'option.fontSize';
                    break;
                case 'inputColor':
                    str = 'option.fill';
                    break;
                default:
                    return;
            }
            for (var i = 0, len = model.models.length; i < len; i++){
                model.models[i][str](value);
            }
        });

        //数据源接收
        var $dataSource = $('.dataSource');
        var $dropArea = $('.dropArea');
        var $dsPreview = $('.dsPreview');
        var $dsText = $('.dsText');
        $dropArea.on('click', function () {
            var $this = $(this);
            $this.find('.glyphicon-plus').hide();
            $this.find('input').show();
            $this.find('input').focus();
        }).on('blur', 'input', function (e) {
            _this.cloudPoint(e);
        });

        //拖拽数据源后的修改
        $dsText.off('click').on('click', function (e) {
            var $iptVal = $(this).text();
            $(this).hide().after('<input class="dsIpt" type="text" style="min-width:200px;border:none;">');
            $('.dsIpt').val($iptVal).focus().on('blur', function (e) {
                if ($iptVal != e.target.value) {
                    _this.cloudPoint(e);
                }
                if ($(this).prev('.dsText').css('display') === 'none') {
                    $(this).hide();
                    $(this).prev('.dsText').text(e.target.value).show();
                }
            });
        });

        //调试值的修改
        $dsPreview.off('change').on('change', function () {
            var $this = $(this);
            var previewVal = [$this.val()];
            _this.store.model['option.preview'](previewVal);
        });
        $dataSource[0].ondrop = function (e) {
            e.preventDefault();
            var dragId = EventAdapter.getData().dsItemId;
            if (AppConfig.datasource.currentObj === 'cloud') {
                var dragName = $('#tableDsCloud').find('tr[ptid="' + dragId + '"]').find('.tabColName').attr('data-value');
                var currentId = $('#selectPrjName').find('option:selected').val();
                if (currentId) {
                    dragName = '@' + currentId + '|' + dragName;
                } else {
                    dragName = dragId;
                }
                _this.store.model.idDs(new Array(dragName));
            } else {
                _this.store.model.idDs(new Array(dragId));
            }
            _this.store.model['option.trigger']({ 0: "0", 1: "1" });
            //var id = EventAdapter.getData().dsItemId;
            //_this.store.model.idDs(new Array(id));
        };
        $dataSource[0].ondragenter = function (e) {
            e.preventDefault();
        };
        $dataSource[0].ondragover = function (e) {
            e.preventDefault();
        };
        $dataSource[0].ondragleave = function (e) {
            e.preventDefault();
        };
        $dataSource.off('click').on('click', '.btnRemoveDs', function (e) {
            //数据源删除后,枚举也同时删除
            //var opt = _this.store.model.option();
            //_this.store.model.idDs([]);
            //opt.trigger = {};
            //_this.store.model.option(opt, 'trigger');
            _this.store.model.update({
                'idDs': [],
                'option.preview': []
                //'option.trigger': {}
            })
        });
        $('.dropArea', this.$propertyList)[0].ondragover = function (e) {
            e.preventDefault();
            $(e.currentTarget).addClass('dragover');
        };
        $('.dropArea', this.$propertyList)[0].ondragleave = function (e) {
            e.preventDefault();
            $(e.currentTarget).removeClass('dragover');
        };

        //是否启用枚举
        var $btnEnumerate = $('#liEnumerateWrap .divTool #btnAddEnumerate');
        var $btnSaveEnumerate = $('#liEnumerateWrap .divTool #btnSaveEnumerate');
        $('#ckbEnumerate')[0].onclick = function () {
            if ($(this).is(':checked')) {
                $('#enumerateWrap').slideDown();
                $btnEnumerate.show();
                $btnSaveEnumerate.show();
            } else {
                $('#enumerateWrap').slideUp();
                $btnEnumerate.hide();
                $btnSaveEnumerate.hide();
            }
        }
        if (!$('#ckbEnumerate').is(':checked')) {
            $btnEnumerate.hide();
            $btnSaveEnumerate.hide();
        }
        var $enumerateWrap = $('#enumerateWrap');
        var $ulEnumerate = $enumerateWrap.find('ul');
        //添加枚举
        $('#btnAddEnumerate')[0].onclick = function () {
            var $li = $('' +
                '<li class="enumerateItem">\
                <div class="enumeratePart"><label class="enumerateLabel">key:</label><input class="enumerateKey"></div>\
                <div class="enumeratePart"><label class="enumerateLabel">value:</label><input class="enumerateVal"></div>\
                <span class="glyphicon glyphicon-remove-circle btnRemove btnEnumerate"></li>\
                ');
            $ulEnumerate.append($li);
        };

        //删除枚举
        $('#enumerateWrap').off('click').on('click', '.btnRemove', function () {
            $(this).parents('#enumerateWrap').hide();
            var enumerateKey = $(this).siblings().find('input.enumerateKey').val();
            if (enumerateKey) {
                delete _this.store.model['option.trigger']()[enumerateKey];
                _this.store.model.update({
                    'option.trigger': _this.store.model['option.trigger']()
                })
            }
            $(this).parent().remove();
            _this.$propertyList.find('#ckbEnumerate').prop('checked', false);
        });

        //保存枚举
        $('#btnSaveEnumerate')[0].onclick = function (e) {
            var $arrKey = $('.enumerateKey'), $arrVal = $('.enumerateVal');
            var tempOpt = _this.store.model.option();
            tempOpt.trigger = {};
            for (var i = 0 ; i < $arrKey.length; i++) {
                var parseFloatKey = parseFloat($arrKey.eq(i).val()).toFixed(0);
                if (isNaN(parseFloatKey)) continue;
                tempOpt.trigger[parseFloatKey] = $arrVal.eq(i).val();
            }
            _this.store.model.option(tempOpt, 'trigger');
            //$('#enumerateWrap').slideUp();
        };
    };

    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory || {};
    window.widgets.props.CanvasHeatPProp = CanvasHeatPProp;

}(window.widgets.factory.WidgetProp));

/** Canvas Image Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function CanvasHeatPPropModel() {
        PropModel.apply(this, arguments);
    }

    CanvasHeatPPropModel.prototype = Object.create(PropModel.prototype);
    CanvasHeatPPropModel.prototype.constructor = CanvasHeatPPropModel;

    CanvasHeatPPropModel.prototype.option = function (params, attr) {//attr可以为空
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
    ['idDs', 'option.trigger', 'option.points', 'option.direction', 'option.preview'].forEach(function (type) {
        CanvasHeatPPropModel.prototype[type] = function (params) {
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
    //CanvasHeatPPropModel.prototype.idDs = function (params) {
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
    window.widgets.propModels.CanvasHeatPPropModel = CanvasHeatPPropModel;

}(window.widgets.propModels.PropModel));