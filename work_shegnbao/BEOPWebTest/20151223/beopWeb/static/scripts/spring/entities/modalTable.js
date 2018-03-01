var ModalTable = (function () {
    function ModalTable(containerId, entityParams) {
        ModalBase.call(this, containerId, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };

    ModalTable.prototype = new ModalBase();

    ModalTable.prototype.renderModal = function () {
        this.container.textContent = JSON.stringify(this.option);
    },

    ModalTable.prototype.updateModal = function (options) {

    },

    ModalTable.prototype.showConfigMode = function () {
    }

    return ModalTable;
})();