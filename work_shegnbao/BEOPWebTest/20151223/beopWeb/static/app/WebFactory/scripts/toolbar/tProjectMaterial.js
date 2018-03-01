(function () {

    function TProjectMaterial(toolbar, container) {
        TBase.apply(this, arguments);

    }

    TProjectMaterial.prototype = Object.create(TBase.prototype);
    TProjectMaterial.prototype.constructor = TProjectMaterial;

    TProjectMaterial.prototype.setSceneMode = function () {
        MaterialModal.show();
    };

    TProjectMaterial.prototype.tpl = '<button class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span title="项目素材控件" class="glyphicon glyphicon-certificate"></span></button>';
    

    TProjectMaterial.prototype.close = function () {

    };

    window.TProjectMaterial = TProjectMaterial;
} ());