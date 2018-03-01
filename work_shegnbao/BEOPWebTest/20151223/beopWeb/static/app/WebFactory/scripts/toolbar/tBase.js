(function () {

    function TBase(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;
        this.painter = toolbar.painter;

        this.container = container;
        this.element = HTMLParser(this.tpl);
        this.container.appendChild(this.element);
        
    }

    TBase.prototype.init = function () {};

    TBase.prototype.show = function () {
        this.attachEvents();
    };

    TBase.prototype.attachEvents = function () {
        $(this.element).off('click').on('click', function () {
            this.initSceneMode();
            this.setSceneMode();
        }.bind(this));
    };

    TBase.prototype.initSceneMode = function () {
        delete this.painter.mouseDownActionPerformed;
        delete this.painter.mouseUpActionPerformed;
        delete this.painter.mouseMoveActionPerformed;
        delete this.painter.keyDownActionPerformed;
        delete this.painter.keyUpActionPerformed;
    };

    TBase.prototype.setSceneMode = function () {
        this.painter.mouseDownActionPerformed = function(e) {
            this.mouseDownActionPerformed(e);
            // 鼠标按下，方才触发 move 事件
            this.painter.mouseMoveActionPerformed = this.mouseMoveActionPerformed.bind(this);
        }.bind(this);

        this.painter.mouseUpActionPerformed = function (e) {
            // 鼠标松开，移出 move 事件
            delete this.painter.mouseMoveActionPerformed;
            this.mouseUpActionPerformed(e);
        }.bind(this);

        this.painter.keyDownActionPerformed = this.keyDownActionPerformed.bind(this);

        this.painter.keyUpActionPerformed = this.keyUpActionPerformed.bind(this);
    };

    TBase.prototype.mouseDownActionPerformed = function (e) {};
    TBase.prototype.mouseMoveActionPerformed = function (e) {};
    TBase.prototype.mouseUpActionPerformed = function (e) {};

    TBase.prototype.keyDownActionPerformed = function (e) {};
    TBase.prototype.keyUpActionPerformed = function (e) {};

    TBase.prototype.close = function () {};

    window.TBase = TBase;
} ());