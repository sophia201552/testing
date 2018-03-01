class PlatformGuide {
    constructor(opt) {
        this.opt = opt;
        this.container = undefined;

    }
    show() {
        WebAPI.get('/static/app/Platform/views/module/platformGuide.html').done(rsHtml => {
            this.container = $('#moduleCtn');
            this.container.html('').append(rsHtml);
            I18n.fillArea(this.container);
            this.init();
            this.attachEvent();
        });

    };
    init() {

    };

    attachEvent() {
        $('.checkboxRow,.panelNameTitleContainer').off('click').on('click', function (e) {
            let href = $(this).attr('href');
            let projectId = $(this).attr('data-project');
            localStorage.setItem('indexToFactoryId',projectId);
            window.open(href);
            return false;
        });
        
    }

    destory() {
        this.opt = null;
        this.container = null;
    }
}