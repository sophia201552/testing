//   2016/12/22  过冷过热区域汇总
var ModalColdHotAreaSummary = (function() {
    function ModalColdHotAreaSummary(screen, entityParams, _renderModal) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        ModalBase.call(this, screen, entityParams, renderModal);
        this.lastFiveMinutes = undefined;
        this.option = undefined;
    };
    ModalColdHotAreaSummary.prototype = new ModalBase();

    ModalColdHotAreaSummary.prototype.optionTemplate = {
        name: 'toolBox.modal.COLD_HOT_AREA_SUMMARY',
        parent: 0,
        mode: 'noConfigModal',
        maxNum: 1,
        title: '',
        minHeight: 3,
        minWidth: 3,
        maxHeight: 2,
        maxWidth: 4,
        type: 'ModalColdHotAreaSummary',
        scroll: false,
        tooltip: {
            'imgPC': true,
            'imgMobile': false,
            'isSpecData': false,
            'desc': ''
        }
    };

    ModalColdHotAreaSummary.prototype.renderModal = function() {
        $(this.container).attr('title', I18n.resource.toolBox.modal.COLD_HOT_AREA_SUMMARY);
        var _this = this;
        if ($(this.container).find('.dashboardCtn').length !== 0) {
            $(this.container).find('.dashboardCtn').html($(this.layoutPage()));
        } else {
            $(this.container).html($(this.layoutPage()));
        }

        I18n.fillArea($(this.container));
        if (AppConfig.project === undefined) {
            var projectId = AppConfig.projectId;
        } else {
            var projectId = AppConfig.project.bindId;
        }

        var points = this.entity.modal.pointName !== '' ? this.entity.modal.pointName : ['@' + projectId + '|AllRoom_UnderCool_svr', '@' + projectId + '|UnderCoolLimit_svr', '@' + projectId + '|OverHeatLimit_svr', '@' + projectId + '|AllRoom_OverHeat_svr']
        var option = {
            dsItemIds: points
        }
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', option).done(function(result) {
            var itemList = result.dsItemList;
            for (var i = 0; i < itemList.length; i++) {
                var data = itemList[i].data;
                var point = itemList[i].dsItemId.split('|')[1];
                if (point === "UnderCoolLimit_svr") {
                    $(_this.container).find(".minT").text(data + '℃');
                } else if (point === "OverHeatLimit_svr") {
                    $(_this.container).find(".maxT").text(data + "℃");
                } else if (point === "AllRoom_UnderCool_svr") {
                    $(_this.container).find(".coldT").text(data);
                } else if (point === "AllRoom_OverHeat_svr") {
                    $(_this.container).find(".overHeatT").text(data);
                } else {
                    $(_this.container).find('.coldHotAreaSummary').html('<div style="width: 100%;height: 100%;justify-content: center;align-items: center;display: flex;font-size: 14px;">请检查数据源是否为指定数据源格式！</div>');
                    break;
                }
            }
        })
        this.attatchEvents();
    };

    ModalColdHotAreaSummary.prototype.layoutPage = function() {
        return (
            '<div class="coldHotAreaSummary row">\
                <div class="line"></div>\
                <div class="col-xs-6">\
                    <div class="situation">\
                        <span class="iconfont icon-weibiaoti--3" style="color:rgb(68,123,229)"></span>\
                        <span style="font-size:1.2em;" i18n="toolBox.COLD_HOT_AREA_SUMMARY.OVER_COLD"></span>\
                    </div>\
                    <div class="temperatureBg bgblue">\
                        <span class="realTp coldT"></span>\
                    </div>\
                    <div class="static">\
                        <span i18n="toolBox.COLD_HOT_AREA_SUMMARY.STANDARD"></span>\
                        <span class="minT"></span>\
                    </div>\
                </div>\
                <div class="col-xs-6">\
                    <div class="situation">\
                        <span class="iconfont icon-weibiaoti--1" style="color:rgb(228,175,0);"></span>\
                        <span style="font-size:1.2em;" i18n="toolBox.COLD_HOT_AREA_SUMMARY.OVER_HOT"></span>\
                    </div>\
                    <div class="temperatureBg bgyellow">\
                      <span class="realTp overHeatT"></span>\
                    </div>\
                    <div class="static">\
                      <span i18n="toolBox.COLD_HOT_AREA_SUMMARY.STANDARD"></span>\
                      <span class="maxT"></span>\
                    </div>\
                </div>\
          </div>'
        );
    };

    ModalColdHotAreaSummary.prototype.attatchEvents = function(points) {
        var _this = this;
        $(this.container).off('click').on('click', function() {
            var pageId = I18n.type == "zh" ? '1470819364630456f538dd4e' : '1477988414773456b2b9cdd6';
            if (AppConfig.modalConfig && AppConfig.modalConfig.mapId) pageId = AppConfig.modalConfig.mapId;
            if (AppConfig.isFactory === 0) {
                ScreenManager.goTo({
                    page: 'observer.screens.PageScreen',
                    options: {
                        id: _this.screen.store.model.option().router_id ? _this.screen.store.model.option().router_id : '14840418452285112d218620',
                        interval_link: _this.screen.store.model.option().interval_link ? _this.screen.store.model.option().interval_link : pageId
                    },
                    container: 'indexMain'
                });
            }
        })
    };
    return ModalColdHotAreaSummary;
})()