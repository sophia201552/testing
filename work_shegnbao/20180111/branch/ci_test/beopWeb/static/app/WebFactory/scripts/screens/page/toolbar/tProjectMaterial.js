(function () {

    function TProjectMaterial() {
        TBase.apply(this, arguments);
    }

    TProjectMaterial.prototype = Object.create(TBase.prototype);
    TProjectMaterial.prototype.constructor = TProjectMaterial;

    TProjectMaterial.prototype.tpl = '\
<button class="btn-trigger" title="项目素材控件" data-type="materalCtrl">\
    <span class = "iconfont icon-tupianku"></span>\
</button>';
    
    TProjectMaterial.prototype.onTrigger = function () {
        MaterialModal.show();
    };

    window.TProjectMaterial = TProjectMaterial;
} ());