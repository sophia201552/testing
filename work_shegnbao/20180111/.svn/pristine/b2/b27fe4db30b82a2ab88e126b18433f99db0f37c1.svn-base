(function(WidgetProp) {
    var _this = undefined;

    function HtmlDashboardProp(propCtn, model) {
        WidgetProp.apply(this, arguments);
        this.pointsArr = [];
        _this = this;
    }

    HtmlDashboardProp.prototype = Object.create(WidgetProp.prototype);
    HtmlDashboardProp.prototype.constructor = HtmlDashboardProp;

    HtmlDashboardProp.prototype.tplPrivateProp = '\
        <li id="dashboardChangeBg" style="display:none">\
            <div style="display: flex;">\
                <span style="width:60px;"i18n="mainPanel.canvasText.SKIN"></span>\
                <select id="prop_bg" value="{bg}" style="width: 40%">\
                    <option value ="blackBg" i18n="mainPanel.canvasText.SKIN_BLACK"></option>\
                    <option value ="whiteBg" i18n="mainPanel.canvasText.SKIN_WHITE"></option>\
                    <option class="coolBg" value ="coolBg" i18n="mainPanel.canvasText.SKIN_COOL" style="display: none;"></option>\
                </select>\
            </div>\
        </li>\
        <li id="dashboardStyle" style="display:none">\
            <ul>\
                <li style="display:flex;padding: 2px 0;">\
                    <label style="width:60px;font-weight:normal;" i18n="mainPanel.canvasText.TITLE"></label>\
                    <input type="text" i18n="placeholder=mainPanel.canvasText.TITLE_TIP" value="{titleName}" class="titleName blurVal" style="width:calc(100% - 60px);padding-left:4px;">\
                </li>\
                <li style="display:flex;padding: 2px 0;">\
                    <label i18n="mainPanel.canvasText.TITLE_STYLE" style="width:60px;font-weight:normal;"></label>\
                    <textarea style="min-height:60px;width:calc(100% - 60px);" class="titleCss blurVal">{titleCss}</textarea>\
                </li>\
                <li style="display:flex;padding: 2px 0;">\
                    <label i18n="mainPanel.canvasText.CONTENT_STYLE" style="width:60px;font-weight:normal;"></label>\
                    <textarea style="min-height:70px;width:calc(100% - 60px);" class="containerCss blurVal">{containerCss}</textarea>\
                </li>\
            </ul>\
        </li>\
        {consequence}\
        {enableDataSource}\
        {pointName}\
        <li id="routerPageId" style="display:none">\
            <ul>\
                <li style="display: flex;padding: 2px 0;">\
                    <label style="width: 60px;font-weight:normal;" i18n="mainPanel.canvasText.ROUNT" style="display:block;"></label>\
                    <input  class="router blurVal" type="text" i18n="placeholder=mainPanel.canvasText.ROUTER_PLACEHOLDER" value="{router_id}" style="padding-left:4px;width: calc(100% - 60px);">\
                </li>\
                {interval_link}\
                {report_link}\
            </ul>\
        </li>';


    HtmlDashboardProp.prototype.show = function() {
        var projectId = AppConfig.projectId;
        this.$propertyList.empty();
        var model = this.store.model;
        var defaultOpt = {
            x: model.x() || '-',
            y: model.y() || '-',
            w: model.w() || '-',
            h: model.h() || '-'
        };
        var option = model.models[0].option();
        if (model.models[0].type() === "HtmlDashboard") {
            var modelType = this.store.model.models[0].option().type;
            if (modelType === 'ModalColdHotAreaSummary'){
                this.pointsArr = option.pointName !== '' ? option.pointName : ['@' + projectId + '|AllRoom_UnderCool_svr', '@' + projectId + '|UnderCoolLimit_svr', '@' + projectId + '|OverHeatLimit_svr', '@' + projectId + '|AllRoom_OverHeat_svr'];
            } else if (modelType === 'ModalEnergyTrendAnalysis'){
                this.pointsArr =option.pointName !== '' ? option.pointName : ['@' + projectId + '|Accum_RealTimePower_svr'];
            } else if (modelType === 'ModalEquipmentPerfectRate' || modelType === 'ModalEquipmentPerfectRateCoolSkin'){
                 this.pointsArr = option.pointName !== '' ? option.pointName : ['@' + projectId + '|equipmentIntactRate'];//需要修改默认点名  projectId需改回
                _this.updateDs(this.pointsArr);
            }
        }
        var option = {
            bg: option.bg || 'blackBg',
            titleName: option.titleName || '',
            titleCss: option.titleCss || '',
            containerCss: option.containerCss || '',
            enableDataSource:enableDataSourceDom(),
            pointName: datasourceArrToDom(),
            router_id: option.router_id || '',
            interval_link: intervalLink(),
            report_link: reportLink(),
            consequence: consequenceDom()
        };
        function consequenceDom() {
            var consequenceArr = option.consequenceProp;
            var content = '';
            if (option.type === 'ModalPriorityHandlingFaults') {
                for (var i = 0, ilen = consequenceArr.length; i < ilen; i++){
                    var item = consequenceArr[i];
                    if (item.status === 0){
                        className = 'btn-default';
                    } else {
                        className = 'btn-success';
                    }
                    content += '<div style="border-radius: 4px;padding: 2px 4px;margin-bottom: 4px;">\
                                    <button class="consequenceName btn '+ className + '" title="' + item.type + '" style="padding: 0 4px;line-height: 20px;width: 100px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">' + item.type + '</button>\
                                    <input class="blurVal consequenceTitle" type="text" placeholder="'+i18n_resource.mainPanel.canvasText.ENTER_SUBTITLE+'" value="'+item.title+'" style="padding-left: 4px;">\
                                </div>';
                }
                var consequenceDom = '<li>\
                                        <label style="width: 60px;" i18n="mainPanel.canvasText.CONSEQUENCE">相关：</label>\
                                        <div class="consequenceDom" style="padding-left: 60px;">\
                                            '+content+
                                        '</div>\
                                    </li > ';
                return consequenceDom;
            } else {
                return '';
            }
            
        }
        function enableDataSourceDom(){
            var modelType = option.type;
            var dataSourceSelDom = '';
            if(modelType=='ModalEquipmentPerfectRate'){
                dataSourceSelDom += '<li style="position:relative">' +
                    '<span id="enableData" i18n="mainPanel.canvasText.WHETHER_ENABLED_DATA_SOURCE">是否启用数据源：</span>'+
                    '<input type="checkbox" id="enableDataIpt" style="position:absolute;top:4px"/>'+
                    '</li>'
            }
            return dataSourceSelDom;
        };
        function datasourceArrToDom() {
            if (_this.pointsArr.length === 0) {
                return '';
            } else {
                var str = '';
                for (var i = 0, length = _this.pointsArr.length; i < length; i++) {
                    str += '<li>\
                                <div class="spanDs" ds-id="' + _this.pointsArr[i] + '" style="padding-left: 2px;padding-right:0px;display: flex;align-item: center;">\
                                    <span class="dsText" style="width: calc(100% - 22px);overflow: hidden;text-overflow: ellipsis;" title="' + _this.pointsArr[i] + '">' + _this.pointsArr[i] + '</span>\
                                    <span class="btnRemoveDs glyphicon glyphicon-remove" style="right: 2px;"></span>\
                                </div>\
                                <div class="dropArea" style="display:none">\
                                    <span class="glyphicon glyphicon-plus"></span>\
                                    <input value="" type="text" style="display:none;border:none;" id="iptCloudPoint">\
                                </div>\
                            </li>'
                }
                var domStr = '<li id="dataSourceCtn">\
                                <div style="display: flex;">\
                                    <span style="padding-top:3px;width: 60px;" i18n="mainPanel.canvasText.DATASOURCE">数据源：</span>\
                                    <ul class="dataSource" style="width: calc(100% - 60px);padding-left:10px;">' +
                    str +
                    '</ul>\
                                </div>\
                            </li>';
                return domStr;
            }
        };
        function intervalLink() {
            var link = option.interval_link;
            if (option.type === 'ModalColdHotAreaSummary' || option.type === 'ModalColdHotAreaSummaryCoolSkin') {
                return '<li style="display: flex;padding: 2px 0;">\
                            <label i18n="mainPanel.canvasText.INTERNAL_LINK" style="width: 60px;font-weight:normal;"></label>\
                            <input  class="link blurVal" type="text" i18n="placeholder=mainPanel.canvasText.INTERNAL_LINK_PLACEHOLDER" value="' + link + '" style="padding-left:4px;width: calc(100% - 60px);">\
                        </li>'
            } else {
                return '';
            }
        };
        function reportLink() {
            var link = option.report_link;
            var chapter = option.chapter;
            if (option.type === 'ModalPriorityHandlingFaults' || option.type === 'ModalPriorityHandlingFaultsCoolSkin') {
                return '<li style="display: flex;padding: 2px 0;">\
                            <label i18n="mainPanel.canvasText.REPORT_LINK" style="width: 60px;font-weight:normal;"></label>\
                            <input  class="report_link blurVal" type="text" i18n="placeholder=mainPanel.canvasText.REPORT_LINK_PLACEHOLDER" value="' + link + '" style="padding-left:4px;width: calc(100% - 60px);">\
                        </li>\
                        <li style="display: flex;padding: 2px 0;">\
                            <label i18n="mainPanel.canvasText.CHAPTER" style="width: 60px;font-weight:normal;"></label>\
                            <input  class="chapter blurVal" type="text" i18n="placeholder=mainPanel.canvasText.CHAPTER_PLACEHOLDER" value="' + chapter + '" style="padding-left:4px;width: calc(100% - 60px);">\
                        </li>'
            } else {
                return '';
            }
        };
        this.$propertyList.html(this.tplProp.formatEL(defaultOpt));
        this.$propertyList.append(this.tplPrivateProp.formatEL(option));
        if(model.models[0].option().type=='ModalEquipmentPerfectRate'){
            if(model.models[0].option().isDataSource){
                $('#enableDataIpt').prop('checked',true);
                $('#dataSourceCtn').show();
            }else{
                $('#dataSourceCtn').hide();
            }
        }

        I18n.fillArea(this.$propertyList);

        //htmlDashboard 控件 显示五个首页控件的特有属性面板
        if (model.models[0].type() === "HtmlDashboard") {
            this.$propertyList.find("#dashboardChangeBg").css("display", "block");
            var modelType = this.store.model.models[0].option().type;
            var modalStr = 'ModalColdHotAreaSummary,ModalEquipmentPerfectRate,ModalWorkOrderStatistics,ModalPriorityHandlingFaultList,ModalEnergyTrendAnalysis,ModalEquipmentRateAndHistoryData,ModalPriorityHandlingFaults,ModalEquipmentRateAndHistoryData,modalRealTimeAndHistoryChartCoolSkin';
            var thirdSkinStr = 'ModalEquipmentPerfectRate,ModalEnergyTrendAnalysis,ModalPriorityHandlingFaults,modalRealTimeAndHistoryChartCoolSkin';
            if (modalStr.indexOf(modelType) !== -1) {
                this.$propertyList.find("#dashboardStyle").css("display", "block");
                this.$propertyList.find("#routerPageId").css("display", "block");
            }
            //有第三种皮肤的才显示 第三个选项
            if (thirdSkinStr.indexOf(modelType) !== -1){
                this.$propertyList.find(".coolBg").css("display", "block");
            }
        }
        $(this.$propertyList).find('option').attr("selected", false);
        $(this.$propertyList).find('option').each(function() {
            if (option.bg === $(this).val()) {
                $(this).attr("selected", true);
            }
        })
        this.attachPubEvent(this.store.model);
        this.attachEvent(this.store.model);
    };

    HtmlDashboardProp.prototype.attachEvent = function(model) {
        //htmlDashboard皮肤切换
        $(this.$propertyList).off('change.bg').on('change.bg', '#prop_bg', function(event) {
            var selectVal = $(this).val();
            $("#" + model.models[0]._id()).removeClass().addClass('html-widget html-container ' + selectVal);
            _this.store.model.update({
                'option.bg': selectVal
            });
        });
        //是否用数据源加载数据
        $('#enableDataIpt').off('click').on('click',function(e){
            var $dataSourceCtn = $('#dataSourceCtn');
            if($(this).prop('checked')){
                _this.store.model.update({
                    'option.isDataSource': true
                })
                $dataSourceCtn.show();
            }else{
                _this.store.model.update({
                    'option.isDataSource': false
                })
                $dataSourceCtn.hide();
            }
        })
        //htmlDashboard 五个控件 修改标题 背景
        //要跳转到的页面id  修改 
        this.$propertyList.off('focusout.blurVal').on('focusout.blurVal', '.blurVal', function() {
            var $currentCtn = $('#' + _this.store.model.models[0]._id());
            var info = $(this).val();
            if ($(this).hasClass('titleName')) {
                _this.store.model.update({
                    'option.titleName': info
                })
                if (_this.store.model.models[0].option().type !== 'modalRealTimeAndHistoryChartCoolSkin'){
                    if (info === '') {
                        $currentCtn.find('.dashboardTitle').remove();
                        $currentCtn.append($currentCtn.find('.dashboardCtn>div'));
                        $currentCtn.find('.dashboardCtn').remove();
                        if ($currentCtn.find('.rightCornerCtn').length !== 0) {
                            $currentCtn.find('div').eq(0).css({ 'margin-top': '30px' });
                        }
                    } else {
                        if ($currentCtn.find('.dashboardCtn').length === 0) {
                            $currentCtn.attr('style', $currentCtn.attr('style') + _this.store.model.models[0].option().containerCss);
                            var dashboardTitle = '<div class="dashboardTitle" style="' + _this.store.model.models[0].option().titleCss + '">' + _this.store.model.models[0].option().titleName + '</div>';
                            var dashboardCtn = '<div class="dashboardCtn" style="width:100%;height:calc(100% - 50px);"></div>';
                            var previousHTml = $currentCtn.html();
                            $currentCtn.html(dashboardTitle + dashboardCtn);
                            $currentCtn.find('.dashboardCtn').html(previousHTml);
                            //将右上角的东西 拿出来 append到当前的容器里 
                            if (_this.store.model.models[0].option().type === "ModalEquipmentRateAndHistoryData" || _this.store.model.models[0].option().type === "ModalPriorityHandlingFaults") {
                                $currentCtn.append($currentCtn.find('.dashboardCtn .rightCornerCtn'));
                                $currentCtn.find('.dashboardCtn>div').css({ 'margin-top': 0 });
                            }
                        } else {
                            $currentCtn.attr('style', $currentCtn.attr('style') + _this.store.model.models[0].option().containerCss);
                            $currentCtn.find('.dashboardTitle').html(_this.store.model.models[0].option().titleName).attr('style', _this.store.model.models[0].option().titleCss);
                            $currentCtn.find('.equipmentRatetHistoryData').css({ 'margin-top': 0, height: '100%' });
                        }
                    }
                }
            } else if ($(this).hasClass('titleCss')) {
                _this.store.model.update({
                    'option.titleCss': info
                })
                if (_this.store.model.models[0].option().type !== 'modalRealTimeAndHistoryChartCoolSkin') { 
                    if (_this.store.model.models[0].option().titleName !== '') {
                        $currentCtn.find('.dashboardTitle').attr('style', _this.store.model.models[0].option().titleCss);
                    }
                }
            } else if ($(this).hasClass('containerCss')) {
                _this.store.model.update({
                    'option.containerCss': info
                })
                $currentCtn.attr('style', $currentCtn.attr('style') + _this.store.model.models[0].option().containerCss);
            } else if ($(this).hasClass('router')) {
                _this.store.model.update({
                    'option.router_id': info
                })
            } else if ($(this).hasClass('link')) {
                _this.store.model.update({
                    'option.interval_link': info
                })
            } else if ($(this).hasClass('report_link')) {
                _this.store.model.update({
                    'option.report_link': info
                })
            }else if ($(this).hasClass('chapter')) {
                _this.store.model.update({
                    'option.chapter': Number(info)
                })
            } else if ($(this).hasClass('consequenceTitle')){
                var arr = [];
                $('.consequenceName').each(function () {
                    var status;
                    if ($(this).hasClass('btn-success')){
                        status = 1;
                    } else {
                        status = 0;
                    }
                    arr.push({
                        type: $(this).text(),
                        title: $(this).next('input').val(),
                        status: status
                    });
                })
                _this.store.model.update({
                    'option.consequenceProp': arr
                });
            }
        });
        //数据源删除一个 出现一个添加数据源的  
        this.$propertyList.off('click.btnRemoveDs').on('click.btnRemoveDs', '.btnRemoveDs', function() {
            var length = 0;
            $('.btnRemoveDs').closest('.spanDs').each(function() {
                if ($(this).css('display') === 'none') {
                    length += 1;
                }
            })
            if (length === 0) {
                $(this).closest('.spanDs').hide().next('.dropArea').show();
            } else {
                alert('一次只能编辑一个数据源！');
            }
        })
        if ($('.dataSource').length !== 0) {
            //数据源接收
            var $dataSource = $('.dataSource');
            var $dropArea = $('.dropArea');
            var $dsText = $('.dsText');
            var $dsPreview = $('.dsPreview');
            $dropArea.on('click', function() {
                var $this = $(this);
                $this.find('.glyphicon-plus').hide();
                $this.find('input').show();
                $this.find('input').focus();
            }).on('blur', 'input', function(e) {
                var $iptVal = $(this).prev('.spanDs').attr('ds-id');
                _this.cloudPoint(e, $iptVal);
            });
            //点击已有点名 出现输入框 
            $dsText.off('click').on('click', function(e) {
                $(this).closest('.spanDs').find('.dsIpt').remove();
                var $iptVal = $(this).text();
                $(this).hide().after('<input class="dsIpt" type="text" style="min-width:200px;width: calc(100% - 22px);border:none;">');
                $('.dsIpt').val($iptVal).focus().on('blur', function(e) {
                    if ($iptVal != e.target.value) {
                        _this.cloudPoint(e, $iptVal);
                    }
                    if ($(this).prev('.dsText').css('display') === 'none') {
                        $(this).hide();
                        $(this).prev('.dsText').text(e.target.value).show();
                    }
                });
            });
            $dataSource[0].ondrop = function(e) {
                var dragId = EventAdapter.getData().dsItemId;
                if (AppConfig.datasource.currentObj === 'cloud' || AppConfig.datasource.currentObj === 'tag') {
                    var pointInfo = getPointInfoByIdAndType(AppConfig.datasource.currentObj,dragId);
                    var dragName = pointInfo.name;
                    var currentId = pointInfo.projectId;
                    if (currentId) {
                        dragName = '@' + currentId + '|' + dragName;
                    } else {
                        dragName = dragId;
                    }
                    var pointsNameArr = [];
                    $('.dataSource').find('.spanDs').each(function() {
                        if ($(this).css('display') !== 'none') {
                            pointsNameArr.push($(this).attr('ds-id'));
                        } else {
                            pointsNameArr.push(dragName);
                        }
                    })
                    _this.updateDs(pointsNameArr);
                }
                e.preventDefault();
            };
            $dataSource[0].ondragenter = function(e) {
                e.preventDefault();
            };
            $dataSource[0].ondragover = function(e) {
                e.preventDefault();
            };
            $dataSource[0].ondragleave = function(e) {
                e.preventDefault();
            };
            $('.dropArea', this.$propertyList)[0].ondragover = function(e) {
                e.preventDefault();
                $(e.currentTarget).addClass('dragover');
                console.log('drag over');
            };
            $('.dropArea', this.$propertyList)[0].ondragleave = function(e) {
                e.preventDefault();
                $(e.currentTarget).removeClass('dragover');
                console.log('drag over');
            };
        };
        //选与不选 consequence
        this.$propertyList.off('click.consequenceName').on('click.consequenceName', '.consequenceName', function () {
            if ($(this).hasClass('btn-success')) {//取消选中
                $(this).removeClass('btn-success').addClass('btn-default');
                $(this).next('input').val('');
            } else { 
                $(this).removeClass('btn-default').addClass('btn-success');
            }
            var arr = [];
            $('.consequenceName').each(function () {
                var status;
                if ($(this).hasClass('btn-success')){
                    status = 1;
                } else {
                    status = 0;
                }
                 arr.push({
                    type: $(this).text(),
                    title: $(this).next('input').val(),
                    status: status
                });
            })
            _this.store.model.update({
                'option.consequenceProp': arr
            });
        })
    };
    HtmlDashboardProp.prototype.cloudPoint = function(e, originalVal) {
        var $this = $(e.currentTarget);
        var promise = $.Deferred();

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
                WebAPI.get('/point_tool/searchCloudPoint/' + currentId + '/' + currentVal).done(function(result) {
                    var data = result.data;
                    if (data.total === 1) {
                        $this.closest('.dropArea').hide().prev('.spanDs').show().attr('ds-id', $this.val()).find('.dsText').attr('title', $this.val()).html($this.val());
                        _this.pointsArr.splice(_this.pointsArr.indexOf(originalVal), 1, $this.val());
                        _this.updateDs(_this.pointsArr);
                    } else {
                        alert(I18n.resource.mainPanel.exportModal.NO_POINT);
                    }
                }).always(function() {
                    Spinner.stop();
                });
            } else {
                var project = AppConfig.project;
                var currentVal = '^' + $this.val() + '$';
                if (project.bindId) {
                    var currentId = project.bindId;
                    Spinner.spin($('body')[0]);
                    WebAPI.get('/point_tool/searchCloudPoint/' + currentId + '/' + currentVal).done(function(result) {
                        var data = result.data;
                        if (data.total === 1) {
                            $this.closest('.dropArea').hide().prev('.spanDs').show().attr('ds-id', $this.val()).find('.dsText').attr('title', $this.val()).html($this.val());
                            _this.pointsArr.splice(_this.pointsArr.indexOf(originalVal), 1, $this.val());
                            _this.updateDs(_this.pointsArr);
                        } else {
                            alert(I18n.resource.mainPanel.exportModal.NO_POINT);
                        }
                    }).always(function() {
                        Spinner.stop();
                    });
                } else {
                    alert('该项目未绑定，写入的云点无效！');
                    return;
                }
            }
        }
    };
    HtmlDashboardProp.prototype.updateDs = function(pointsArr) {
        this.store.model.update({
            'option.pointName': pointsArr
        });
    };
    window.widgets = window.widgets || {};
    window.widgets.props = window.widgets.factory || {};
    window.widgets.props.HtmlDashboardProp = HtmlDashboardProp;

}(window.widgets.factory.WidgetProp));

/** Html Container Prop Model */
(function(PropModel) {

    var class2type = Object.prototype.toString;

    function HtmlDashboardPropModel() {
        PropModel.apply(this, arguments);  
    }

    HtmlDashboardPropModel.prototype = Object.create(PropModel.prototype);
    HtmlDashboardPropModel.prototype.constructor = HtmlDashboardPropModel;

    HtmlDashboardPropModel.prototype.option = function(params, attr) {

    }
    window.widgets = window.widgets || {};
    window.widgets.propModels = window.widgets.propModels || {};
    window.widgets.propModels.HtmlDashboardPropModel = HtmlDashboardPropModel;

}(window.widgets.propModels.PropModel));