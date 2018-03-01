;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../../core/Event.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('../../core/Event.js'));
    } else {
        factory(
            root,
            namespace('beop.strategy.core.Event')
        );
    }
}(namespace('beop.strategy.components.Painter.Toolbar'), function(exports, Event) {

    function Actions() {
        this.present = null;
    }

    // PROTOTYPES
    +

    function() {
        /**
         * Constructor
         */
        this.constructor = Actions;

        this.init = function(present) {
            this.present = present;
        };

        this.back = function(data, present) {
            Event.emit('SHOW_TABLE', {
                action: 'back',
                from: 'Painter',
                id: data.target.dataset.id
            });
        }

        this.dragstart = function(e) {
            var $this = $(e.target);
            var offset = $this.offset();
            var type = $this.data('type');
            var info = {
                x: e.clientX - offset.left,
                y: e.clientY - offset.top,
                w: $this.width(),
                h: $this.height(),
                type: type
            }
            e.dataTransfer.setData("info", JSON.stringify(info));
        }

        this.save = function(data, present) {
            Event.emit('SYNC_MODULES_DATA');
        };

        this.debug = function(data, present) {

        }

        this.recover = function(data, present) {
            present = present || this.present;
            var rs = {
                isRecover: true
            }
            present(rs);
        };

    }.call(Actions.prototype);

    var actions = new Actions();
    var n = "beop.strategy.components.Painter.Toolbar.actions";

    actions.intents = {
        back: 'namespace(\'' + n + '\').' + 'back',
        dragstart: 'namespace(\'' + n + '\').' + 'dragstart',
        save: 'namespace(\'' + n + '\').' + 'save',
        debug: 'namespace(\'' + n + '\').' + 'debug',
        recover: 'namespace(\'' + n + '\').' + 'recover'
    };
    exports.actions = actions;
}));