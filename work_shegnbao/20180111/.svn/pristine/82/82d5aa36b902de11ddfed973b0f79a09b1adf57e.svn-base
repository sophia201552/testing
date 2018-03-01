// preview.js
+function(window) {
    var screens = namespace('observer.screens');
    var I18N_PATH = '/static/app/WebFactory/views/js/i18n/';
    var currentScreen;

    window.Spinner = new LoadingSpinner({ color: '#00FFFF' });

    window.AppConfig = {
        isReportConifgMode: false,
        userId: null,
        menu: [],
        chartTheme: theme.Dark
    };
    window.I18n = null;
    AppConfig.datasource = {
        getDSItemById: DataSource.prototype.getDSItemById.bind({
            m_parent: {
                store: {
                    dsInfoList: []
                }
            },
            m_arrCloudTableInfo: []
        })
    };

    $(document).ready(function() {
        initI18n(navigator.language.split('-')[0], false);
        initUnit();
    });

    function initI18n(lang, isForce) {
        InitI18nResource(lang, isForce, I18N_PATH).always(function(rs) {
            I18n = new Internationalization(null, rs);
            I18n.fillArea($('#checkPreviewPattern'));
            currentScreen = new PreviewScreen();
            currentScreen.layout();
            currentScreen.attachEvents();
            currentScreen.show();
        });
    };

    function initUnit() {
        var projectId = AppConfig.projectId ? AppConfig.projectId : '';
        if (projectId !== "") {
            WebAPI.get('/project/getinfo/' + projectId).done(function(rs) {
                var proInfo = rs.projectinfo;
                Unit = new window.Unit();
                AppConfig.unit_currency = Unit.getCurrencyUnit(proInfo.unit_currency);
                Unit.getUnitSystem(proInfo.unit_system).always(function(rs) {
                    AppConfig.unit_system = unitSystem;
                });
            })
        } else {
            AppConfig.unit_currency = '¥';
            AppConfig.unit_system = unitSystem;
        }
    };

    function PreviewScreen() {
        this.pageCtn = document.querySelector('#pageContainer');
        this.pageInfo = JSON.parse(document.querySelector('#hidPageInfo').value);
        AppConfig.userId = document.querySelector('#hidUserId').value;
        AppConfig.projectId = this.pageInfo['onlineProjId'] ? parseInt(this.pageInfo['onlineProjId']) : '';
        this.page = null;
    }
    PreviewScreen.prototype.layout = function() {
        if (top.location.pathname.indexOf('previewProject') === -1) {
            var domHtml = '<div class="nav" style="background: -webkit-linear-gradient(top, #151515, #222);height: 53px;line-height: 53px;">\
                            <a href="javascript:;" style="padding: 0px 15px;font-size: 18px;">WebFactory</a>\
                        </div>';
            $(this.pageCtn).before(domHtml);
            $(this.pageCtn).css({ position: 'fixed', top: '53px' });
        }
    }
    PreviewScreen.prototype.generateTreeEx = function(arr) {
        var result = [];
        var params;
        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            params = { id: item._id, pId: item.parent, name: item.text + ' - ' + item.type, type: item.type };
            if ('DropDownList' == item.type) {
                params = { id: item._id, pId: item.parent, name: item.text, type: item.type };
                params.isParent = true;
                params.isHide = item.isHide;
                result.push(params);
            } else if ('PageScreen' == item.type) {
                params.isParent = false;
                params.isHide = item.isHide;
                params.isLock = item.isLock;
                params.layerList = item.layerList;
                params.width = item.width;
                params.height = item.height;
                params.display = item.display;
                result.push(params);
            } else {
                params.isParent = false;
                params.isHide = item.isHide;
                params.isLock = item.isLock;
                result.push(params);
            }
        }
        return result;
    }
    PreviewScreen.prototype.show = function() {
        var p = {};
        var _this = this;
        if (!this.pageInfo) {
            document.write('页面不存在或页面类型错误！');
            return;
        }
        if (this.pageInfo.templateId) {
            this.pageInfo.params = JSON.parse(this.pageInfo.params);
            if (screens[this.pageInfo.type]) {
                this.page = new screens[this.pageInfo.type](this.pageInfo, this.pageCtn);
                this.page.show();
            } else {
                this.page && this.page.close();
            }

        } else if (this.pageInfo.type) {
            if (screens[this.pageInfo.type]) {
                this.page = new screens[this.pageInfo.type]({
                    id: this.pageInfo._id,
                    date: this.pageInfo.date
                }, this.pageCtn);
                this.page.show();
            } else {
                this.page && this.page.close();
            }
        }


    };

    PreviewScreen.prototype.attachEvents = function() {
        var _this = this;
        // 自适应
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            _this.page.resize();
        });
    };

    PreviewScreen.prototype.close = function() {};

}.call(this, window);