;(function ($, window, document) {
    "use strict";
    //工具包
    var util = {};
    var pluginName = "treeBox",
        defaults = {
            template: '',
            onClick: '',
        };

    function Plugin(element, options) {
        var _this = this;
        _this.el = element;
        _this.$el = $(_this.el);
        _this.settings = $.extend({}, defaults, options);
        _this._name = pluginName;
        _this.id = new Date().getTime();
        var searchText, treeNodes;
        _this.search = {
            set searchText(text) {
                searchText = text;
            },
            get searchText() {
                if (searchText) {
                    return searchText;
                } else {
                    return null;
                }
            }
        };
        _this.data = {
            set nodes(nodes) {
                treeNodes = nodes;
            }
        }
    }
})(jQuery, window, document);