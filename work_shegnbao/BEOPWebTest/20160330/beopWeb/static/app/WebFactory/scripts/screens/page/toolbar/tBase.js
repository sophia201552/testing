(function () {

    function TBase(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;
        this.painter = toolbar.painter;

        this.container = container;
        this.element = HTMLParser(this.tpl);
        this.container.appendChild(this.element);
        var toolbarTypeArr = ['pointerCtrl', 'handCtrl', 'textCtrl', 'btnCtrl', 'htmlCtrl', 'screenCtrl', 'imgeCtrl', 'pipeCtrl', 'materalCtrl', 'gridLineCtrl'];
        var toolbarTitleIner = [I18n.resource.mainPanel.toolbar.ARROW_TOOL, I18n.resource.mainPanel.toolbar.HAND_TOOL, I18n.resource.mainPanel.toolbar.TEXT_TOOL, I18n.resource.mainPanel.toolbar.BUTTON_TOOL,
                               I18n.resource.mainPanel.toolbar.HTML_TOOL, I18n.resource.mainPanel.toolbar.SCREEN_TOOL, I18n.resource.mainPanel.toolbar.IMG_TOOL, I18n.resource.mainPanel.toolbar.PIPE_TOOL,
                               I18n.resource.mainPanel.toolbar.MATERAL_TOOL, I18n.resource.mainPanel.toolbar.GRID_TOOL];

        for (var i = 0; i < toolbarTypeArr.length;i++){
            $(this.container).find('button[data-type="' + toolbarTypeArr[i] + '"]').attr('title', toolbarTitleIner[i]);
        }
    }

    TBase.prototype.init = function () {};

    TBase.prototype.show = function () {
        this.attachEvents();
    };

    TBase.prototype.attachEvents = function () {
        var cssClassList = this.element.classList;

        // 开关式的按钮
        if (cssClassList.contains('btn-switch')) {
            $(this.element).off('click').on('click', function () {
                this.initSceneMode();
                this.setSceneMode();
            }.bind(this));
        }
        // 触发式的按钮
        else if (cssClassList.contains('btn-trigger')) {
            $(this.element).off('click').on('click', function () {
                this.onTrigger();
            }.bind(this));
        }
    };

    TBase.prototype.onTrigger = function () {};

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

    TBase.prototype.close = function () {
        // 清除变量引用
        this.toolbar = null;
        this.screen = null;
        this.painter = null;
        this.container = null;

        // 删除 DOM
        this.element.parentNode.removeChild(this.element);
    };

    window.TBase = TBase;
} ());