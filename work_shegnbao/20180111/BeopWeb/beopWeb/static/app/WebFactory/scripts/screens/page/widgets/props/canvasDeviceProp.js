(function (WidgetProp) {
    var _this = undefined;
    function CanvasDeviceProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
        _this = this;

        this.iotStore = undefined;
        this.iotDictClass = undefined;
        this.data = null;
    }

    CanvasDeviceProp.prototype = Object.create(WidgetProp.prototype);
    CanvasDeviceProp.prototype.constructor = CanvasDeviceProp;

    CanvasDeviceProp.prototype.tplPrivateProp = '\
        <li>\
            <label class="ctnPropLabel deviceType">设备种类：</label>\
            <div id="divDeviceType" class="ctnPropContent">\
            </div>\
        </li>\
        <li>\
            <label class="ctnPropLabel devicePrefix">前缀：</label>\
            <div id="divDevicePrefix" class="ctnPropContent">\
                <span id="spDevicePrefix"></span>\
            </div>\
        </li>\
        <li>\
            <label class="ctnPropLabel deviceProp">属性：</label>\
            <ul id="ulDeviceAttr" class="ctnPropContent"></ul>\
        </li>\
        <li>\
            <label class="ctnPropLabel deviceLink">外连：</label>\
            <ul id="ulDeviceLink" class="ctnPropContent"></ul>\
        </li>\
        <li>\
            <label class="ctnPropLabel deviceEject">弹出：</label>\
            <div id="divDevicePop" class="ctnPropContent">\
                <span id="spDevicePop"></span>\
                <span id="btnDevicePopEdit" class="glyphicon glyphicon-edit"></span>\
            </div>\
        </li>\
        <li>\
            <label class="ctnPropLabel deviceDiagnosis">诊断：</label>\
            <div id="spDeviceDiagnosis" class="ctnPropContent"></div>\
        </li>\
        <li>\
            <label class="ctnPropLabel deviceSkin">外观：</label>\
            <div id="ctnDeviceSkin" class="ctnPropContent">\
                <div id="btnSkinScrollLeft" class="glyphicon glyphicon-menu-left"></div>\
                <div id="scrollDeviceSkin"></div>\
                <div id="btnSkinScrollRight" class="glyphicon glyphicon-menu-right"></div>\
            </div>\
        </li>';
        //<li>\
        //    <ul class="list-inline">\
        //        <li>\
        //            <label>预览：</label>\
        //            <span id="spDevicePreview"></span>\
        //        </li>\
        //    </ul>\
        //</li>';
    /** override */
    CanvasDeviceProp.prototype.show = function () {
        this.$propertyList.empty();
        var model = this.store.model;
        var modelOpt = model.option();
        var defaultOpt = {
            x: typeof model.x() === 'number' ? model.x() : '-',// model.x() || '-',
            y: typeof model.y() === 'number' ? model.y() : '-',//model.y() || '-',
            w: typeof model.w() === 'number' ? model.w() : '-',//model.w() || '-',
            h: typeof model.h() === 'number' ? model.h() : '-'//model.h() || '-'
        };
        var option = {
            text: modelOpt.text,
            pop:modelOpt.pop.name?modelOpt.pop.name:''
        };
        var promise = $.Deferred();

        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));

        $('.deviceType').html(I18n.resource.mainPanel.attrPanel.attrDevice.DEVICE_TYPE);
        $('.devicePrefix').html(I18n.resource.mainPanel.attrPanel.attrDevice.DEVICE_PREFIX);
        $('.deviceProp').html(I18n.resource.mainPanel.attrPanel.attrDevice.DEVICE_PROP);
        $('.deviceLink').html(I18n.resource.mainPanel.attrPanel.attrDevice.DEVICE_LINK);
        $('.deviceEject').html(I18n.resource.mainPanel.attrPanel.attrDevice.DEVICE_EJECT);
        $('.deviceDiagnosis').html(I18n.resource.mainPanel.attrPanel.attrDevice.DEVICE_DIAGNOSIS);
        $('.deviceSkin').html(I18n.resource.mainPanel.attrPanel.attrDevice.DEVICE_SKIN);        
        
        this.attachPubEvent(this.store.model);
        this.attachEvent();

        if (!_this.iotStore && modelOpt.iotStore.id) {
            WebAPI.post('iot/search/byid', {
                'id':[modelOpt.iotStore.id],
                'baseType':['things']
            }).done(function(result){
                _this.iotStore = result.things[0];
                _this.iotDictClass = result.class.things[_this.iotStore.type];
                _this.updateIotContent(modelOpt);
            });
        } else {
            _this.updateIotContent(modelOpt);
        }
    };

    /** override */
    CanvasDeviceProp.prototype.close = function () {

    };

    /** override */
    CanvasDeviceProp.prototype.update = function () {
        var model = this.store.model;
        var option = model.option();
        //更新设备详细信息
        //if (option.iotId.length > 0 ) {
            //WebAPI.post('/iot/search', model.iotId).done(function (resultData) {
            //    _this.iotStore = resultData;
            //    _this.updateIotDetail();
            //});
        //}else {
        //    _this.updateIotDetail();
        //}
        _this.iotStore = AppConfig.datasource.iotFilter.searchDeviceById(model.iotStore.id);
        _this.updateIotContent(option);

    };

    CanvasDeviceProp.prototype.updateIotContent = function (option) {
        var spDeviceType;
        //更新绑定设备id
        var divDeviceType = document.getElementById('divDeviceType');
        divDeviceType.innerHTML = '';
        if(!_this.iotStore){
            //设备拖拽提示容器
            spDeviceType = document.createElement('span');
            spDeviceType.className = 'spDeviceType spDeviceTypeTip';
            spDeviceType.innerHTML = '<span class="glyphicon glyphicon-plus"></span>';
            divDeviceType.appendChild(spDeviceType);
            return;
        }else {
            spDeviceType = document.createElement('span');
            spDeviceType.className = 'spDeviceType';
            spDeviceType.textContent = _this.iotStore.name;
            spDeviceType.dataset.id = _this.iotStore['_id'];
            divDeviceType.appendChild(spDeviceType);
        }
        //更新前缀
        _this.updateIotPrefix(option);

        //更新属性
        _this.updateIotAttr(option);

        //更新外联
        _this.updateIotLink(option);

        //更新弹出
        _this.updateIotPop(option);

        //更新诊断
        //TODO
        _this.updateIotDiagnosis(option);

        //更新皮肤
        _this.updateIotSkin(option);
    };
    //更新前缀
    CanvasDeviceProp.prototype.updateIotPrefix = function(option){
        var spDevicePrefix = document.getElementById('spDevicePrefix');
        spDevicePrefix.textContent = _this.iotStore.prefix;
    };

    //更新属性
    CanvasDeviceProp.prototype.updateIotAttr = function(option){
        var ulDeviceAttr = document.getElementById('ulDeviceAttr');
        var liDeviceAttr,chkBoxAttr,spAttrName,spAttrVal,btnStyle;
        var arrSpAttrVal = [];
        var promise = $.Deferred();

        for (var attr in _this.iotDictClass.attrs){
            liDeviceAttr = document.createElement('li');
            liDeviceAttr.className = 'liDeviceAttr';
            liDeviceAttr.dataset.attr = attr;

            chkBoxAttr = document.createElement('input');
            chkBoxAttr.className = 'chkAttr';
            chkBoxAttr.setAttribute('type','checkbox');
            if (option.tag[attr]){
                chkBoxAttr.checked = true;
            }

            spAttrName = document.createElement('span');
            spAttrName.className = 'spAttrName';
            spAttrName.textContent = _this.iotDictClass.attrs[attr].name;

            spAttrVal = document.createElement('span');
            spAttrVal.className = 'spAttrVal';
            spAttrVal.dataset.attr = attr;
            if (_this.iotStore.arrP[attr]){
                spAttrVal.dataset.attrId = _this.iotStore.arrP[attr];
                arrSpAttrVal.push(spAttrVal);
            } else {
                spAttrName.classList.add('not-support');
            }

            //btnStyle = document.createElement('button');
            //btnStyle.classname = 'btnStyle';
            //btnStyle.textContent = 'css';
            //btnStyle.setAttribute('disabled',true);

            liDeviceAttr.appendChild(chkBoxAttr);
            liDeviceAttr.appendChild(spAttrName);
            liDeviceAttr.appendChild(spAttrVal);
            //liDeviceAttr.appendChild(btnStyle);

            ulDeviceAttr.appendChild(liDeviceAttr);
        }

        var arrAttrVal = [];
        var dictAttrVal = {};
        for (var attr in _this.iotStore.arrP){
            if(!_this.iotStore.arrP[attr])continue;
            arrAttrVal.push(_this.iotStore.arrP[attr]);
            dictAttrVal[attr] = {
                id:_this.iotStore.arrP[attr]
            }
        }

        if (!_this.data) {
            WebAPI.post('/analysis/startWorkspaceDataGenPieChart', {dsItemIds:arrAttrVal}).done(function(result){
                _this.data = result;
                promise.resolve(result);
            });
        } else {
            promise.resolve(_this.data);
        }

        promise.done(function (result) {
            if (result.dsItemList && result.dsItemList.length > 0) {
                for (var i = 0 ; i < result.dsItemList.length; i++){
                    for (var attr in dictAttrVal){
                        if (dictAttrVal[attr].id == result.dsItemList[i].dsItemId){
                            dictAttrVal[attr].val = result.dsItemList[i].data
                        }
                    }
                }
                for (var i = 0; i < arrSpAttrVal.length; i++){
                    arrSpAttrVal[i].textContent = dictAttrVal[arrSpAttrVal[i].dataset.attr].val;
                }
            }
        });
    };

    //更新外连
    CanvasDeviceProp.prototype.updateIotLink = function(option){
        var ulDeviceLink = document.getElementById('ulDeviceLink');
        var liLink,spLinkName,spLinkDs,spLinkDsName,spLinkDsTip;
        var arrLinkStore = [],arrLinkId = [],arrLinkOpt = [],arrDsName = [];
        if (_this.iotDictClass.links){
            if(_this.iotDictClass.links.in){
                initLink('in')
            }
            if(_this.iotDictClass.links.out){
                initLink('out')
            }
            if (arrLinkId.length == 0)return;
            var postData = {
                id:arrLinkId,
                'baseType':['things']
            };
            WebAPI.post('iot/search/byid',postData).done(function(result){
                arrLinkStore = result.things;
                for (var i = 0; i < arrLinkStore.length ;i++){
                    arrLinkOpt[i].name = arrLinkStore[i].name;
                    arrDsName[i].textContent = arrLinkStore[i].name
                }
            });
        }

        function initLink(type){
            for (var ele in _this.iotDictClass.links[type]){
                liLink = document.createElement('li');
                liLink.className = 'liLink';
                liLink.dataset.type = type;
                liLink.dataset.attr = ele;

                spLinkName = document.createElement('span');
                spLinkName.className = 'spLinkName';
                spLinkName.textContent = _this.iotDictClass.links[type][ele].name;

                spLinkDs = document.createElement('span');
                spLinkDs.className = 'spLinkDs';

                spLinkDsName = document.createElement('span');
                spLinkDsName.className = 'spLinkDsName';
                if(option.link[type][ele].id){
                    spLinkDs.className += ' hasVal';
                    spLinkDs.dataset.id = option.link[type][ele].id;
                    arrLinkId.push(option.link[type][ele].id);
                    arrLinkOpt.push(option.link[type][ele]);
                    arrDsName.push(spLinkDsName);
                }

                spLinkDsTip = document.createElement('span');
                spLinkDsTip.className = 'spLinkDsTip glyphicon glyphicon-plus';

                spLinkDs.appendChild(spLinkDsName);
                spLinkDs.appendChild(spLinkDsTip);
                liLink.appendChild(spLinkName);
                liLink.appendChild(spLinkDs);
                ulDeviceLink.appendChild(liLink);
            }
        }
    };
    //更新弹出
    CanvasDeviceProp.prototype.updateIotPop = function(option){
        var selDevicePop = document.getElementById('spDevicePop');
        selDevicePop.textContent = option.pop.name;
    };

    //更新诊断
    CanvasDeviceProp.prototype.updateIotDiagnosis = function(option){
        var ulDeviceDiagnosis = document.getElementById('ulDeviceDiagnosis');
    };

    //更新皮肤
    CanvasDeviceProp.prototype.updateIotSkin = function(option){
        var scrollDeviceSkin = document.getElementById('scrollDeviceSkin');
        var arrSkinId = [];
        WebAPI.get('/iot/getClassDetail/'+ _this.iotStore['type'] +'/cn').done(function(result){
            var divDeviceSkin,imgSkin,spSkinName,spSkinSel;
            if(!result.skin || !result.skin[0])return;
            var selIndex = option.skin.index;
            var defaultId = '';
            for (var i = 0; i < result.skin[0].list.length; i++){
                defaultId = result.skin[0].list[i].content.trigger.default;

                divDeviceSkin = document.createElement('div');
                divDeviceSkin.className = 'divDeviceSkin';
                divDeviceSkin.dataset.skinId = defaultId;
                arrSkinId.push(defaultId);

                imgSkin = document.createElement('img');
                imgSkin.className = 'imgSkin';

                spSkinName = document.createElement('span');
                spSkinName.className = 'spSkinName';
                spSkinName.textContent = result.skin[0].list[i].name;

                //spSkinSel = document.createElement('span');
                //spSkinSel.className = 'spSkinSel glyphicon glyphicon-ok';

                divDeviceSkin.appendChild(imgSkin);
                divDeviceSkin.appendChild(spSkinName);
                //divDeviceSkin.appendChild(spSkinSel);
                scrollDeviceSkin.appendChild(divDeviceSkin);

                if(i == selIndex){
                    divDeviceSkin.className += ' selected'
                }
            }
            var $selDivDeviceSkin = $('.divDeviceSkin.selected');
            var $divDeviceSkin = $('.divDeviceSkin');
            WebAPI.post('/factory/material/getByIds',{ids:arrSkinId}).done(function(material){
                var $divDeviceSkin = $('.divDeviceSkin');
                for (var i = 0; i < $divDeviceSkin.length ;i++){
                    for (var j = 0; j < material.length; j++) {
                        if(material[j]['_id'] == $divDeviceSkin[i].dataset.skinId){
                            $divDeviceSkin.eq(i).find('.imgSkin')[0].src = material[j].content.url;
                            break;
                        }
                    }
                }

                if ($selDivDeviceSkin.length == 0 || $divDeviceSkin.length == 0)return;
                var left = - $selDivDeviceSkin[0].offsetLeft;
                var unitWidth = $divDeviceSkin.outerWidth(true);
                var scrollWidth = $(scrollDeviceSkin).width();
                var scrollMin = scrollWidth - unitWidth * $divDeviceSkin.length;
                if (scrollMin > 0)scrollMin = 0;
                left = Math.max(left,scrollMin);
                $divDeviceSkin.css('left',left + 'px');
            })
        });
    };

    CanvasDeviceProp.prototype.attachEvent = function(){
        //iot对象拖动
        var divDeviceType = document.getElementById('divDeviceType');
        var iotId,iotNode;

        divDeviceType.ondrop = function(e){
            if($(divDeviceType).children(':not(.spDeviceTypeTip)').length > 0){
                alert(I18n.resource.mainPanel.attrPanel.attrDevice.DEVICE_DROP_INFO);
                return;
            }
            e.preventDefault();
            $(e.currentTarget).find('dragover').removeClass('dragover');
            iotNode = EventAdapter.getData().dsNode;

            var models = _this.store.model.models;
            var opt = models[0].option();
           
            

            opt.iotStore.id = iotNode['_id'];
            opt.iotStore.type = iotNode['type'];

            //初始化link属性
            var dictClass = AppConfig.datasource.iotFilter.dictClass.things[iotNode.type];
            opt.link = {in:{},out:{}};
            if (dictClass.links){
                if(dictClass.links.in){
                    for (var ele in dictClass.links.in){
                        opt.link.in[ele] = {
                            name:dictClass.links.in[ele].name,
                            type:ele
                        }
                    }
                }
                if(dictClass.links.out){
                    for (var ele in dictClass.links.out){
                        opt.link.out[ele] = {
                            name:dictClass.links.out[ele].name,
                            type:ele
                        }
                    }
                }
            }
            _this.store.model.update({
                'option.iotStore': opt.iotStore,
                'option.link': opt.link,
                'option.skin': { index: 0 }
            });
        };
        divDeviceType.ondragenter = function(e){
            e.preventDefault();
        };
        $(divDeviceType).off('dragover').on('dragover','.spDeviceTypeTip', function(e){
            $(e.currentTarget).addClass('dragover');
            e.preventDefault();
        });
        $(divDeviceType).off('dragleave').on('dragleave','.spDeviceTypeTip', function(e){
            $(e.currentTarget).removeClass('dragover');
            e.preventDefault();
        });

        //文本控件选择
        var $ulDeviceAttr = $('#ulDeviceAttr');
        $ulDeviceAttr.off('change').on('change','.chkAttr',function(e){
            var opt = _this.store.model.option();
            var target = e.currentTarget;
            var dsId = target.parentNode.querySelector('.spAttrVal').dataset.attrId;

            if(target.checked){
                opt.tag[target.parentNode.dataset.attr] = {
                    ds: dsId
                };
            }else{
                delete opt.tag[target.parentNode.dataset.attr];
            }
            _this.store.model['option.tag'](opt.tag);
        });

        //外连拖拽
        var $ulDeviceLink = $('#ulDeviceLink');
        $ulDeviceLink.off('drop').on('drop','.liLink',function(e){
            var target = e.currentTarget;
            $(target).find('.dragover').removeClass('dragover');
            var opt = _this.store.model.option();
            opt.link[target.dataset.type][target.dataset.attr] = {id:EventAdapter.getData().dsItemId};
            _this.store.model['option.link'](opt.link);
        });

        $ulDeviceLink[0].ondragenter = function(e){
            e.preventDefault();
        };
        $ulDeviceLink.off('dragover').on('dragover','.spLinkDs', function(e){
            $(e.currentTarget).addClass('dragover');
            e.preventDefault();
        });
        $ulDeviceLink.off('dragleave').on('dragleave','.spLinkDs', function(e){
            $(e.currentTarget).removeClass('dragover');
            e.preventDefault();
        });

        $ulDeviceLink.off('click').on('click','.spLinkDs',function(e){
            var target = e.currentTarget;
            var opt = _this.store.model.option();
            opt.link[target.parentNode.dataset.type][target.parentNode.dataset.attr].id = null;
            _this.store.model['option.link'](opt.link);
        });

        //模板编辑
        document.getElementById('btnDevicePopEdit').onclick = function(e){
            MaterialModal.show([{'title':'Template',data:['Page']}],function(data){
                var opt = _this.store.model.option();
                opt.pop = {
                    'id':data[0].page['_id'],
                    'name':data[0].page.name
                };
                $('#materiaClose').trigger('click');
                _this.store.model['option.pop'](opt.pop);
            })
        };

        //皮肤选择
        var $scrollDeviceSkin = $('#scrollDeviceSkin');
        $scrollDeviceSkin.off('click').on('click','.divDeviceSkin',function(e){
            var $target = $(e.currentTarget);
            var opt = _this.store.model.option();
            if($target.hasClass('selected'))return;
            $scrollDeviceSkin.find('selected').removeClass('selected');
            $target.addClass('selected');
            opt.skin.index = $scrollDeviceSkin.children().index($target);
            _this.store.model['option.skin'](opt.skin);
        });
        var btnScrollLeft = document.getElementById('btnSkinScrollLeft');
        var isScrollFinish = true;
        btnScrollLeft.onclick = function(e){
            if (!isScrollFinish)return;
            isScrollFinish = false;
            var $divDeviceSkin = $scrollDeviceSkin.children();
            var unitWidth = $divDeviceSkin.outerWidth(true);
            var scrollWidth = $scrollDeviceSkin.width();
            var left = $divDeviceSkin[0]?$divDeviceSkin[0].offsetLeft:0;
            var scrollMin = scrollWidth - unitWidth * $divDeviceSkin.length;
            if (scrollMin > 0)scrollMin = 0;
            left -= unitWidth;
            left = Math.max(left,scrollMin);
            $divDeviceSkin.animate({'left':left + 'px'},100,function(){
                isScrollFinish = true;
            })
        };
        var btnScrollRight = document.getElementById('btnSkinScrollRight');
        btnScrollRight.onclick = function(e){
            if (!isScrollFinish)return;
            isScrollFinish = false;
            var $divDeviceSkin = $scrollDeviceSkin.children();
            var unitWidth = $divDeviceSkin.outerWidth(true);
            var scrollWidth = $scrollDeviceSkin.width();
            var left = $divDeviceSkin[0]?$divDeviceSkin[0].offsetLeft:0;
            var scrollMax = scrollWidth - unitWidth * $divDeviceSkin.length;
            if (scrollMax < 0)scrollMax = 0;
            left += unitWidth;
            left = Math.min(left,scrollMax);
            $divDeviceSkin.animate({'left':left + 'px'},100,function(){
                isScrollFinish = true;
            })
        };
    };
    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory  || {};
    window.widgets.props.CanvasDeviceProp = CanvasDeviceProp;

} (window.widgets.factory.WidgetProp));

/** Html Device Prop Model */
(function (PropModel) {

    var class2type = Object.prototype.toString;

    function CanvasDevicePropModel() {
        PropModel.apply(this, arguments);
    }

    CanvasDevicePropModel.prototype = Object.create(PropModel.prototype);
    CanvasDevicePropModel.prototype.constructor = CanvasDevicePropModel;

    CanvasDevicePropModel.prototype.option = function (params,attr) {
        if (class2type.call(params) === '[object Object]') {
            if (arguments.length == 1) {
            this._setProperty('option', params);
            } else if (arguments.length == 2) {//只设置option的指定属性:attr
                this._setProperty('option.' + arguments[1], params[arguments[1]]);
            }
            return true;
        }

       
        var opt = $.extend(true, {}, this.models[0].option());
        for(var i = 1, modelLen = this.models.length, modelOpt; i < modelLen; i ++){
            modelOpt = this.models[i].option(); 
            var diffArr = diff(opt, modelOpt);

            if(diffArr == null){
                return opt;
            }else{
                for(var j=0,diffLen=diffArr.length;j<diffLen;j++){
                    if(diffArr[j].path[0] == "iotStore"){
                        for(var k in modelOpt){
                            if (opt[k] != modelOpt[k]) {
                                if (k === 'trigger') {
                                    opt[k] = {};
                                } else {
                                    opt[k] = '';
                                }
                            }
                        }
                    }else if(diffArr[j].path[0] == "tag"){
                        opt["tag"] = {}
                    }
                }
            }
            

        }
        return opt;
    };

    ['option.iotStore','option.text','option.link','option.tag','option.pop','option.skin'].forEach(function(type){
        CanvasDevicePropModel.prototype[type] = function (params) {
            var v;
            if(params) {
                this._setProperty(type, params);
                return true;
            }
            if((v = this._isPropertyValueSame(type) ) !== false ) {
                return v;
            }
        };
    })

    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.CanvasDevicePropModel = CanvasDevicePropModel;

} (window.widgets.propModels.PropModel));