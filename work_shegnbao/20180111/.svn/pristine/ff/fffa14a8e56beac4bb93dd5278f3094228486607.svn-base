/**
 * Created by win7 on 2017/3/10.
 */

(function (exports) {
    class BaseView {
        constructor($container, model) {
            this.html = '';
            this.stateMap = {};
            this.jqueryMap = {};
            this.$container = $container;
            this._model = model;
            this.views = [];
        }

        set model(model) {
            if (!model) {
                throw ('配置' + this.toString() + 'model错误:' + model);
            }
            this._model = model;
        }

        get model() {
            return this._model;
        }

        init($container) {
            let _this = this;
            if ($container) {
                this.$container = $container;
            }
            if (!this.html) {
                console.error("" + this.toString() + "初始化失败, htmlURL:" + this.html)
            }
            console.log('开始初始化:' + this.toString());
            if (this.$container && this.$container[0]) {
                Spinner.spin(this.$container[0]);
            }
            return WebAPI.get(this.html).done(function (resultHtml) {
                _this.$container.html(resultHtml);
                I18n.fillArea(_this.$container);
                _this.setJqueryMap();
                _this._attachEvent();
            }).always(function () {
                Spinner.stop();
            });
        }

        _setOptions() {

        }

        _setOption() {

        }

        _create() {

        }

        _attachEvent() {

        }

        destroy() {
            this.$container = null;
        }

        setJqueryMap() {
            this.jqueryMap = {
                $container: this.$container
            };
        }

        _refresh() {

        }

        toString() {
            return this.constructor.name;
        }

    }

    exports.BaseView = BaseView;

})(namespace('beop.mb'));
//# sourceURL=mb.baseView.js