// preview.js
+function (window) {
    var screens = namespace('observer.screens');
    var I18N_PATH = '/static/app/WebFactory/views/js/i18n/';

    window.AppConfig = {
        isFactory: 1,
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

    $(document).ready(function () {
        initI18n(navigator.language.split('-')[0], false);
    });

    function initI18n(lang, isForce) {
        InitI18nResource(lang, isForce, I18N_PATH).always(function (rs) {
            I18n = new Internationalization(null, rs);
            new PreviewScreen().show();
        });
    };

    function PreviewScreen() {
        this.pageCtn = document.querySelector('#pageContainer');
        this.pageInfo = JSON.parse(document.querySelector('#hidPageInfo').value);
        AppConfig.userId = document.querySelector('#hidUserId').value;
        this.page = null;
    }

    PreviewScreen.prototype.show = function () {
        var p = {};
        if (!this.pageInfo) {
            document.write('页面不存在或页面类型错误！');
            return;
        } 

        if (this.pageInfo.templateId) {
            this.pageInfo.params = JSON.parse(this.pageInfo.params);
            this.page = new screens[this.pageInfo.type](this.pageInfo, this.pageCtn);
        } else {
            this.page = new screens[this.pageInfo.type]({
                id: this.pageInfo._id
            }, this.pageCtn);
        }
        this.page.show();
    };

    PreviewScreen.prototype.close = function () {};

}.call(this, window);