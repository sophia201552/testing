var ModalNone = (function () {
    function ModalNone(screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this.renderModal, null, null);
    }

    ModalNone.prototype = new ModalBase();
    ModalNone.prototype.optionTemplate = {
        name: '',
        //parent: 0,
        mode: ['realTime'],
        maxNum: 1,
        title: '',
        minHeight: 1,
        minWidth: 1,
        maxHeight: 6,
        maxWidth: 12,
        type:'ModalNone'
    };

    ModalNone.prototype.renderModal = function () {
        //this.container.innerHTML = template;
        I18n.fillArea($('#coalSaveName').parent());
        this.spinner.stop();
    },

    ModalNone.prototype.configure = function () {
        var _this = this;

        var divAdd = document.createElement('span');
        divAdd.className = 'glyphicon glyphicon-plus-sign springConfigBtn';
        this.container.appendChild(divAdd);

        var $divParent = $(this.container).closest('.springContent')[0];
        $divParent.ondragover = function (e) {
            e.preventDefault();
        };
        $divParent.ondragleave = function (e) {
            e.preventDefault();
        };
        $divParent.ondrop = function (e) {
            _this.screen.rebornEntity(_this.entity, e.dataTransfer.getData("type"),e.dataTransfer.getData("title"));
        }
    }

    return ModalNone;
})();