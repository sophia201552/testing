class PlatformLanguageConfig {
    constructor() {
        this.projectId = AppConfig.projectId;
        this.container = ElScreenContainer;
        this.screen = AppDriver;
        this.language = AppConfig.language;
    }
    show() {
        this.container = $('#indexMain');
        WebAPI.get('/static/app/Platform/views/module/platformLanguageConfig.html').done(function (result) {
            this.container.html(result);
            this.init();
        }.bind(this))
    }
    init() {
        this.initSelLanguage();
        this.initConfigDetail();
        this.attachEvent();
    }
    initSelLanguage() {
        var $selLanguage = $('#selLanguage');
        this.container.find('#selLanguage').val(this.language);
    }
    initConfigDetail() {
        var $selLanguage = $('#selLanguage').val();
        I18n.getProjectI18n(this.projectId, $selLanguage).always(function (result) {
            this.initConfigByJSON(I18n.exResource);
        }.bind(this))

    }
    initConfigByJSON(node) {
        if (!node) return;
        var $iptConfigJSON = $('#iptConfigJSON');
        $iptConfigJSON.val(JSON.stringify(node, undefined, 4));
    }
    attachEvent() {
        var _this = this;
        $('#selLanguage').change(function (e) {
            this.language = e.target.value;
            this.initConfigDetail();
        }.bind(this))
        $('#btnSure').off('click').on('click', function () {
            var $iptConfigVal;
            try {
                $iptConfigVal = JSON.parse($('#iptConfigJSON').val());
                var psData = {
                    id: _this.projectId,
                    resource: $iptConfigVal,
                    lang: this.language
                };
                WebAPI.post('/setpRrojectI18n', psData).done(function (result) {
                    if(result.data == true){
                        alert('Success')
                    }else{
                        alert('default')
                    }
                }).always(function () {
                    Spinner.stop();
                });
            } catch (e) {
                alert('JSON error \n' + e.toString());
            }
        }.bind(this));

    }
    close() {

    }
}