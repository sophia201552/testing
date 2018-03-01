;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports',
            '../Painter/Toolbar/index.js',
            '../Painter/Sketchpad/index.js'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports,
            require('../Painter/Toolbar/index.js'),
            require('../Painter/Sketchpad/index.js')
        );
    } else {
        factory(
            root,
            namespace('beop.strategy.components.Painter.Toolbar.Index'),
            namespace('beop.strategy.components.Painter.Sketchpad.Index')
        );
    }
}(namespace('beop.strategy.components.Painter'), function(exports, Toolbar, Sketchpad) {

    function Index(container, options) {
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }

        this.options = options || {};

        //dom
        this.painterWrap = undefined;
        // components
        this.toolbar = null;
        this.sketchpad = null;

        this.init();
    }

    // PROTOTYPES
    +

    function() {
        /**
         * Constructor
         */
        this.constructor = Index;

        /**
         * Initialize
         */
        this.init = function() {
            this.initDOM();
            this.initToolbar();
            this.initSketchpad();
        };

        this.initDOM = function() {
            var painterWrap = document.createElement('div');
            painterWrap.id = 'painterWrap';
            painterWrap.style = 'width:100%;height:100%;background:#313639';
            this.container.appendChild(painterWrap);
            this.painterWrap = painterWrap;
        };

        this.initToolbar = function() {
            var toolBarWrap = document.createElement('div');
            toolBarWrap.id = 'toolBarWrap';
            toolBarWrap.style = 'width:100%;height:74px;padding:8px;';
            this.painterWrap.appendChild(toolBarWrap);
            this.toolbar = new Toolbar(toolBarWrap);

        };

        this.destroyToolbar = function() {
            if (this.toolbar) {
                this.toolbar.close();
                this.toolbar = null;
            }
        };

        this.initSketchpad = function() {
            var sketchpadWrap = document.createElement('div');
            sketchpadWrap.id = 'sketchpadWrapWrap';
            sketchpadWrap.style = 'width:100%;height:calc(100% - 50px)';
            this.painterWrap.appendChild(sketchpadWrap);
            this.sketchpad = new Sketchpad(sketchpadWrap);
            var _this = this;
            $(sketchpadWrap).off('dragover drop dragenter dragleave').on('dragover', function(e) {
                e.preventDefault();
            }).on('dragenter', function(e) {
                _this.sketchpad.dragenterEvent(e);
            }).on('dragleave', function(e) {
                _this.sketchpad.dragleaveEvent(e);
            }).on('drop', function(e) {
                _this.sketchpad.dropEvent(e, _this.options);
            });
        };

        this.destroySketchpad = function() {
            if (this.sketchpad) {
                this.sketchpad.close();
                this.sketchpad = null;
            }
        };

        this.repaint = function() {
            this.sketchpad.repaint();
        };

        /**
         * @description 初始化 state
         */
        this.show = function() {
            this.toolbar.show();
            this.sketchpad.show(this.options);
        };

        this.close = function() {
            this.destroyToolbar();
            this.destroySketchpad();
        };

    }.call(Index.prototype);

    exports.Index = Index;
}));