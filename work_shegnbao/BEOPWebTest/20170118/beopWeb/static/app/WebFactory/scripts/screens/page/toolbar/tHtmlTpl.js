/**
 * Created by win7 on 2016/8/16.
 */
(function () {

    function THTMLTpl() {
        TBase.apply(this, arguments);
    }

    THTMLTpl.prototype = Object.create(TBase.prototype);
    THTMLTpl.prototype.constructor = THTMLTpl;

    THTMLTpl.prototype.tpl = '\
<button class="btn-trigger" title="HTML模板" data-type="HTMLTpl">\
    <span class="glyphicon glyphicon-export"></span>\
</button>';

    THTMLTpl.prototype.onTrigger = function () {
        ConfigTplModal.trigger();
    };

    THTMLTpl.prototype.close = function () {
        ConfigTplModal.close();

        TBase.prototype.close.apply(this, arguments);
    };

    window.THTMLTpl = THTMLTpl;
} ());