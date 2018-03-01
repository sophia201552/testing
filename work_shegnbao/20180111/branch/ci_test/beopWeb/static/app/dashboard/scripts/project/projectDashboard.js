/**
 * Created by win7 on 2015/12/21.
 */
var ProjectDashboard = (function() {
    var _this;

    function ProjectDashboard(data) {
        _this = this;
        if (data) {
            if (data.screen) this.screen = data.screen;
            if (data.menuId) this.menuId = data.menuId;
        }
        if(data && data.projectInfo){
            this.projectInfo = data.projectInfo
        }else{
            this.projectInfo = ProjectConfig.projectInfo
        }
        this.isIndex = !!(data.isIndex);
        this.store = undefined;
        this.factoryIoc = undefined;
        this.container = undefined;
        this.requestPoints = [];
        this.mapRefresh = {};
        this.popRefresh = {};
        this.dictPopToEntity = {};
        if (data && data.name) {
            this.dashboardName = data.name;
        }
        AppConfig.datasource = undefined;
        this.isForMobile = true;
    }
    ProjectDashboard.navOptions = {
        top: '<span id="btnProjectMap" class="hide navTopItem left icon iconfont icon-gengduo" aria-hidden="true"></span>' +
            '<div class="navTopItem middle title"><span id="dashboardName"></span><span id="projName" style="display:none"></span></div>' +
            '<span id="btnAdminConfig" class="navTopItem right"></span>',
        bottom: true,
        backDisable: false,
        module: 'project'
    };
    ProjectDashboard.prototype = {
        show: function() {
            var msg = [];
            try {
                msg = JSON.parse(localStorage.getItem('pushDashboard')).filter(function(item) { return item.menuId != _this.menuId });
                if (!msg) msg = [];
            } catch (e) {
                msg = [];
            }
            localStorage.setItem('pushDashboard', JSON.stringify(msg))
            var pageForCurProject = msg.filter(function(item) { return item.projectId == _this.projectId })
            if (pageForCurProject.length == 0) {
                $('#btnProject .pushTip').text(0).hide();
            } else {
                $('#btnProject .pushTip').text(pageForCurProject.length > 99 ? '99+' : pageForCurProject.length).show();
            }

            ElScreenContainer.innerHTML = '';
            $.ajax({ url: 'static/app/dashboard/views/project/projectDashboard.html' }).done(function(resultHtml) {
                ElScreenContainer.innerHTML = resultHtml;
                _this.container = document.getElementById('ctn-dashboard');
                $('#btnAdminConfig').html('<img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com' + AppConfig.userProfile.picture + '"><span class="newMessageNum tip"></span>');
                if (_this.dashboardName) document.getElementById('dashboardName').innerHTML = _this.dashboardName;
                var language = localStorage.getItem('language');
                if (language == 'en') {
                    document.getElementById('projName').innerHTML = _this.projectInfo.name_english;
                } else if (language = 'zh') {
                    document.getElementById('projName').innerHTML = _this.projectInfo.name_cn;
                } else {
                    if (navigator && navigator.language && navigator.language.split('-')[0] == 'en') {
                        document.getElementById('projName').innerHTML = _this.projectInfo.name_english;
                    } else {
                        document.getElementById('projName').innerHTML = _this.projectInfo.name_cn;
                    }
                }
                //CssAdapter.setIndexMain();
                _this.init();
                //Push.onReceiveMessage(function(){
                //    infoBox.alert(Push.plugin.receiveNotification);
                //})
            });
        },
        init: function() {
            _this.initTopNav();
            _this.initIoc();
            SpinnerControl.show();
            WebAPI.get('/spring/get/' + this.menuId + '/' + _this.projectInfo.id).done(function(resultData) {
                _this.store = resultData;
                AppConfig.datasource = new DataSource(_this);
                _this.initLayout();
                _this.initWorkerForUpdating();
            }).always(function() {
                SpinnerControl.hide();
            })
        },
        initIoc: function() {
            this.factoryIoC = new FactoryIoC('dashboard');
            this.factoryIoCAnalysis = new FactoryIoC('analysis');
        },
        initLayout: function() {
            this.listEntity = {};
            this.arrEntityOrder = [];

            //I18n.fillArea($('#toolBox'));

            if (!(this.store && this.store.layout)) return;
            for (var i = 0, item; i < this.store.layout.length; i++) {
                for (var j = 0; j < this.store.layout[i].length; j++) {
                    item = this.store.layout[i][j];
                    var modelClass, entity;
                    if (item.modal.type && (item.modal.type != 'ModalNone' || item.isNotRender == true)) {
                        //regist IoC
                        modelClass = this.factoryIoC.getModel(item.modal.type);
                        if (!modelClass) continue;
                        if (item.isNotRender) continue;
                        entity = new modelClass(this, item);
                        this.listEntity[item.id] = entity;
                        this.arrEntityOrder.push(item.id);
                        if (item.modal.interval && item.modal.interval >= 0 && item.modal.points) {
                            for (var k = 0, point, kLen = item.modal.points.length; k < kLen; k++) {
                                point = item.modal.points[k];
                                if (this.requestPoints.indexOf(point) < 0) {
                                    this.requestPoints.push(point);
                                }
                            }
                        }
                        if (item.modal.popId) {
                            if (!this.dictPopToEntity[item.modal.popId]) this.dictPopToEntity[item.modal.popId] = [];
                            this.dictPopToEntity[item.modal.popId].push(item.id);
                            if (this.requestPoints.indexOf(item.modal.popId) < 0) {
                                this.requestPoints.push(item.modal.popId);
                            }
                        }
                        entity.render();
                    } else if (item.modal.type == 'ModalNone') {
                        modelClass = this.factoryIoC.getModel(item.modal.type);
                        entity = new modelClass(this, item);
                        this.listEntity[item.id] = entity;
                        this.arrEntityOrder.push(item.id);
                        entity.render();
                    }
                }
            }
            //如果一个页面只有entity且 spanR=6,spanC=12
            var $springCtn = $('#paneCenter').children('.springContainer');
            if ($springCtn.length == 1 && parseFloat($springCtn[0].style.height) >= parseFloat("99%") && parseFloat($springCtn[0].style.width) >= parseFloat("99%")) {
                $springCtn.children('.panel-default').css({ border: 'none' });
            }
        },
        initWorkerForUpdating: function() {
            this.workerUpdate = new Worker("static/views/js/worker/workerUpdate.js");
            this.workerUpdate.self = this;
            this.workerUpdate.addEventListener("message", this.refreshData, true);
            this.workerUpdate.addEventListener("error", function(e) { console.log(e) }, true);

            this.workerUpdate.postMessage({ pointList: this.requestPoints, type: "datasourceRealtime" });
        },
        refreshData: function(e) {
            var _this = this.self ? this.self : this;
            if (!e.data.error && e.data.dsItemList) {
                var point;
                for (var i = 0, iLen = e.data.dsItemList.length; i < iLen; i++) {
                    point = e.data.dsItemList[i];
                    _this.mapRefresh[point.dsItemId] = point;
                    //如果point是pop绑定的点，加入到_this.popRefresh
                    if (_this.dictPopToEntity[point.dsItemId]) {
                        _this.popRefresh[point.dsItemId] = point;
                    }
                }
                var entity, arrUpdataData;
                for (var key in _this.listEntity) {
                    entity = _this.listEntity[key];
                    if (entity.entity.modal.type == "ModalNone" || entity.entity.modal.type == "ModalMix") continue;
                    arrUpdataData = [];

                    if (entity.entity.modal && entity.entity.modal.points) {
                        for (var i = 0, iLen = entity.entity.modal.points.length; i < iLen; i++) {
                            var point = entity.entity.modal.points[i];
                            if (!point) continue;
                            if (entity.entity.modal.points.indexOf(point) != i) continue;
                            if (_this.mapRefresh[point] != undefined)
                                arrUpdataData.push(_this.mapRefresh[point]);
                        }
                        if (entity.entity.modal.type == "ModalAppGauge") {
                            //arrUpdataData.push({ 'dataTitle': entity.entity.modal.option.gaugeTitle });
                            arrUpdataData.push({ 'dataTitle': entity.entity.modal.option.gaugeTitle, 'guageTitle': entity.entity.modal.option.guageTitle, 'guageFixed': entity.entity.modal.option.guageFixed, 'guageUnit': entity.entity.modal.option.guageUnit, 'guageMax': entity.entity.modal.option.guageMax });
                        }
                        entity.entity.modal.popId && entity.renderPop(_this.popRefresh[entity.entity.modal.popId]);
                        entity.update(arrUpdataData);
                    }
                }
            } else {
                //new Alert(ElScreenContainer, Alert.type.danger, I18n.resource.code[e.data.error]).showAtTop(5000);
            }
        },
        messageNumber:function(){
            //获取消息数量
            if(AppConfig.newMessageNumber) {
                $('.newMessageNum').addClass('active').html(AppConfig.newMessageNumber);
            }
        },
        initTopNav: function() {
            _this.messageNumber();
            if (_this.isIndex) {
                $('#btnProjectMap').removeClass('hide').off('touchstart').on('touchstart', function() {
                    router.to({
                        typeClass: ProjectList,
                        data: {}
                    })
                });
                $('#navTop').addClass('noBtnBack');
            } else {
                $('#btnProjectMap').addClass('hide')
            }

            $('#btnAdminConfig').off('touchstart').on('touchstart', function(e) {
                var adminConfigNew = new AdminConfigNew();
                adminConfigNew.show();
            });
        },
        close: function() {
            if (_this.workerUpdate) {
                _this.workerUpdate.terminate();
                _this.workerUpdate = null;
            }
        }
    };
    return ProjectDashboard;
})();