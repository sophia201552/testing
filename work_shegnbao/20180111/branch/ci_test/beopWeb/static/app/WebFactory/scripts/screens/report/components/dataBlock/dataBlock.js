(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'wf.report.components.Block']);
    } else if (typeof module === 'object' && module.exports) {
        factory(exports, require('wf.report.components.Block'));
    } else {
        factory(
            root,
            namespace('factory.report.components.Block')
        );
    }
} (namespace('factory.report.components'), function (exports, Super) {

    function DataBlock() {
        Super.apply(this, arguments);
    }

    DataBlock.prototype = Object.create(Super.prototype);
    DataBlock.prototype.constructor = DataBlock;

    +function () {
        /**
         * @override
         */
        this.optionTemplate = Mixin(this.optionTemplate, {
            name: 'I18n.resource.report.optionModal.DATA_BLOCK',
            type: 'DataBlock',
            spanC: 12,
            spanR: 4,
            className: 'block-container'
        });

        /**
         * @override
         */
        this.configModalType = 'Block';

        /** @override */
        this.canDropChildren = true;

        /** @override */
        this.refreshTitle = function (chapterNo) {
            Super.prototype.refreshTitle.apply(this, [chapterNo, true]);
        };

        /** @override */
        this.afterGetBlockData = function () {
            this.variables = {
                data: this.store
            };
            this.initLayout();
        };

        /**
         * @override
         */
        this.isChildrenReadonly = function () {
            return false;
        };

    }.call(DataBlock.prototype);

    exports.DataBlock = DataBlock;
}));