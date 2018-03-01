;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'dockspawn'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('dockspawn'));
    } else {
        factory(
            root,
            namespace('dockspawn')
        );
    }
}(namespace('beop.util'), function (exports, dockspawn) {

    var delayTimer = null;
    var DELAY_TIME = 500;

    exports.LayoutBuilder = {
        container: null,
        dockManager: null,
        documentNode: null,
        layouts: {},
        init: function (container) {
            var _this = this;
            var dockManager = this.dockManager = new dockspawn.DockManager(container);

            dockManager.initialize();

            this.documentNode = this.dockManager.context.model.documentManagerNode;
            this.container = container;

            // 自适应
            window.onresize = this.onResized;
            this.onResized();

            return this;
        },
        onResized: function () {
            var _this = this;
            var container = this.container;
            
            this.dockManager.resize(window.innerWidth - (container.clientLeft + container.offsetLeft), window.innerHeight - (container.clientTop + container.offsetTop));

            if (delayTimer) {
                window.clearTimeout(delayTimer);
                delayTimer = null;
            }

            delayTimer = window.setTimeout(function () {
                if(_this.onCustomResized && typeof _this.onCustomResized === 'function'){
                    _this.onCustomResized();
                }
                window.clearTimeout(delayTimer);
                delayTimer = null;
            }, DELAY_TIME);
        },
        createDivElement: function (domId, caption) {
            var dom;

            domId = domId || ('dockspawn_' + ObjectId());
            if ( Object.keys(this.layouts).indexOf(domId) > -1 ) {
                throw new error('id already exists: ' + domId);
            }

            dom = document.createElement('div')
            dom.id = domId;
            dom.setAttribute('caption', caption || 'Untitled');

            return dom;
        },
        layout: function () {},
        dockTop: function () {},
        dockBottom: function () {},
        dockRight: function (domId, caption, ratio, targetDomId) {
            return this._dock('Right', domId, caption, ratio, targetDomId);
        },
        dockLeft: function (domId, caption, ratio, targetDomId) {
            return this._dock('Left', domId, caption, ratio, targetDomId);
        },
        dockFill: function (domId, caption, targetDomId) {
            return this._dock('Fill', domId, caption, null, targetDomId);
        },
        _dock: function (type, domId, caption, ratio, targetDomId) {
            var dom, dockPanel, dockNode, targetDockNode;

            if (!!targetDomId) {
                targetDockNode = (this.layouts[targetDomId] && this.layouts[targetDomId].dockNode) || undefined;
            }
            // targetDomId 不存在，则 dockFill 到 documentNode
            else {
                targetDockNode = this.documentNode;
            }

            if (!targetDockNode) {
                Log.warn('dockFill fail, not found dock node: ' + targetDomId);
                return;
            }

            dom = this.createDivElement(domId, caption);
            this.container.appendChild(dom);
            dockPanel = new dockspawn.PanelContainer(dom, this.dockManager);

            if (type === 'Fill') {
                dockNode = this.dockManager['dockFill'](targetDockNode, dockPanel);
            } else {
                dockNode = this.dockManager['dock'+type](targetDockNode, dockPanel, ratio || .2);
            }

            this.layouts[dom.id] = {
                dom: dom,
                dockPanel: dockPanel,
                dockNode: dockNode
            };

            return dom;
        },
        
        unDock: function (domId) {
            var layout;

            if (typeof domId === 'object') {
                domId = domId.id;
            }

            layout = this.layouts[domId];
            if (!layout) {
                Log.warn('Has not undock any panel.');
                return;
            }

            // 判断是否为浮动窗口
            if (layout.dockPanel.floatingDialog) {
                // 存在，则使用浮动窗口的销毁方式
                layout.dockPanel.floatingDialog.destroy();
            } else {
                // 不存在，则使用固定停靠窗口的销毁方式
                layout.dockPanel.performUndock();
            }

            delete this.layouts[domId];

            return true;
        },
        destroy: function () {
            var _this = this;
            
            Object.keys(this.layouts).forEach(function (domId) {
                _this.unDock(domId);
            });

            this.container = null;
            this.dockManager = null;
            this.documentNode = null;
        }
    };
}));