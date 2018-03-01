;(function (exports) {

    function Component() {

    }

    +function () {

        this.onRenderComplete = function () {
            throw new Error('onRenderComplete 方法需要实现才能使用');
        };

        /**
         * 控件的渲染方法
         */
        this.render = function () {
            throw new Error('render 方法需要实现才能使用');
        };

        /**
         * 控件的销毁方法
         */
        this.destroy = function () {
            throw new Error('destroy 方法需要实现才能使用');
        };

    }.call(Component.prototype);

    exports.Component = Component;

} ( namespace('factory.report.components') ));
