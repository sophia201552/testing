(function () {

    function TBase(toolbar, container) {
        this.toolbar = toolbar;
        this.screen = toolbar.screen;
        this.painter = toolbar.painter;

        this.container = container;
        this.element = HTMLParser(this.tpl);
        this.container.appendChild(this.element);
        var toolbarTypeArr = ['pointerCtrl', 'handCtrl', 'textCtrl', 'btnCtrl', 'htmlCtrl', 'screenCtrl', 'imgeCtrl', 'pipeCtrl','zoomCtr', 'materalCtrl', 'gridLineCtrl', 'deviceCtr', 'layoutCtrl', 'heatCtrl', 'HTMLTpl', 'polygonCtrl'];
        var toolbarTitleIner = [I18n.resource.mainPanel.toolbar.ARROW_TOOL, I18n.resource.mainPanel.toolbar.HAND_TOOL, I18n.resource.mainPanel.toolbar.TEXT_TOOL, I18n.resource.mainPanel.toolbar.BUTTON_TOOL,
                               I18n.resource.mainPanel.toolbar.HTML_TOOL, I18n.resource.mainPanel.toolbar.SCREEN_TOOL, I18n.resource.mainPanel.toolbar.IMG_TOOL, I18n.resource.mainPanel.toolbar.PIPE_TOOL,
                               I18n.resource.mainPanel.toolbar.ZOOM_TOOL, I18n.resource.mainPanel.toolbar.MATERAL_TOOL, I18n.resource.mainPanel.toolbar.GRID_TOOL, I18n.resource.mainPanel.toolbar.DEVICE_TOOL,
                               I18n.resource.mainPanel.toolbar.LAYOUT_TOOL,I18n.resource.mainPanel.toolbar.THERMODY_TOOL, I18n.resource.mainPanel.toolbar.HtmlContainer_TOOL, I18n.resource.mainPanel.toolbar.POLYGON_TOOL];

        for (var i = 0; i < toolbarTypeArr.length;i++){
            $(this.container).find('button[data-type="' + toolbarTypeArr[i] + '"]').attr('title', toolbarTitleIner[i]);
        }
    }

    TBase.prototype.option = {
        cursor: 'default'
    };

    TBase.prototype.init = function () {};

    TBase.prototype.show = function () {
        this.init();
        this.attachEvents();
    };

    TBase.prototype.attachEvents = function () {
        var cssClassList = this.element.classList;

        // 开关式的按钮
        if (cssClassList.contains('btn-switch')) {
            $(this.element).off('click').on('click', function () {
                this.toolbar.cursor(this.option.cursor);
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
        delete this.painter.dblclickActionPerformed;

        delete this.painter.mouseRightDownActionPerformed;
        delete this.painter.mouseWheelDownActionPerformed;
        delete this.painter.mouseRightUpActionPerformed;
        delete this.painter.mouseWheelUpActionPerformed;
        delete this.painter.mouseRightMoveActionPerformed;
        delete this.painter.mouseWheelMoveActionPerformed;
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

        this.painter.mouseRightDownActionPerformed = this.mouseRightDownActionPerformed.bind(this);
        this.painter.mouseWheelDownActionPerformed = THand.prototype.mouseDownActionPerformed.bind(this);

        this.painter.mouseRightUpActionPerformed = this.mouseRightUpActionPerformed.bind(this);
        this.painter.mouseWheelUpActionPerformed = function (e) {
            THand.prototype.mouseUpActionPerformed.call(this, e, this.option.cursor);
        }.bind(this);

        this.painter.mouseRightMoveActionPerformed = this.mouseRightMoveActionPerformed.bind(this);
        this.painter.mouseWheelMoveActionPerformed = THand.prototype.mouseMoveActionPerformed.bind(this);

        this.painter.keyDownActionPerformed = this.keyDownActionPerformed.bind(this);
        this.painter.keyUpActionPerformed = this.keyUpActionPerformed.bind(this);
        this.painter.dropActionPerformed = this.dropActionPerformed.bind(this);
        this.painter.dblclickActionPerformed = this.dblclickActionPerformed.bind(this);
    };

    TBase.prototype.mouseDownActionPerformed = function (e) {};
    TBase.prototype.mouseMoveActionPerformed = function (e) {};
    TBase.prototype.mouseUpActionPerformed = function (e) {};

    TBase.prototype.mouseRightDownActionPerformed = function (e) {};
    TBase.prototype.mouseRightUpActionPerformed = function (e) {
        this.painter.setActiveWidgets();
        this.painter.setActiveLayers();
    };
    TBase.prototype.mouseRightMoveActionPerformed = function (e) {};

    TBase.prototype.dropActionPerformed = function (e) {
        var data = EventAdapter.getData();
        var entity;

        if (data.tplId){
            ConfigTplModal.dropWidgetTpl(e,this.painter);
            return;
        }

        if (data.type) {
            entity = {
                _id: ObjectId(),
                layerId: this.painter.state.activeLayers()[0] || '',
                pageId: this.painter.getPage().page.id,
                x: e.transformedX,
                y: e.transformedY,
                w: 200,
                h: 100,
                idDs: [],
                type: 'HtmlDashboard',
                option: {
                    type: data.type,
                    display: 1,
                    bg: 'blackBg'//默认 黑色字体
                },
                isHide:0
            };
            this.painter.store.widgetModelSet.append(new NestedModel(entity));
        }
    };

    TBase.prototype.dblclickActionPerformed = function (e) {};

    TBase.prototype.keyDownActionPerformed = function (e) {};
    TBase.prototype.keyUpActionPerformed = function (e) {};

    TBase.prototype.getPainter = function () {
        return this.painter;
    };

    TBase.prototype.getPage = function () {
        return this.screen;
    };

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