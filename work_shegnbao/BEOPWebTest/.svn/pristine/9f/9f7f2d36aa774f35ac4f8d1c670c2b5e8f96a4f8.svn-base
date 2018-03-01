/**
 * PageScreen
 */
(function () {

    function PageScreen(container) {
        this.domCtn = container;
        this.painter = undefined;

        this.init();
    }

    PageScreen.prototype = {
        show: function () {
            
        },
        init: function () {
            this.initPainter();
        },
        initPainter: function () {
            this.painter = new GPainter(this);
        }
    };

    window.PageScreen = PageScreen;
} ());