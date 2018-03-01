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
        minWidth: 2,
        maxHeight: 6,
        maxWidth: 12,
        type:'ModalNone'
    };

    ModalNone.prototype.renderModal = function () {
        //this.container.innerHTML = template;
        I18n.fillArea($('#coalSaveName').parent());
        $(this.container).parent().css('visibility','hidden');
        this.spinner.stop();
    },

    ModalNone.prototype.configure = function () {
        this.spinner.stop();
        var _this = this;
        $(_this.container).parent().css('visibility','');
        var divAdd = document.createElement('span');
        divAdd.className = 'glyphicon glyphicon-plus-sign springConfigBtn';
        this.container.appendChild(divAdd);
        var btnRemove = document.createElement('span');
        btnRemove.className = 'glyphicon glyphicon-remove-circle springConfigRemoveBtn grow';
        btnRemove.title = 'Remove';
        btnRemove.onclick = function (e) {
            if (_this.chart) _this.chart.clear();
            _this.screen.removeEntity(_this.entity.id);
            $('#divContainer_' + _this.entity.id).remove();
            _this = null;
        };
        this.container.appendChild(btnRemove);
        var btnHeightResize = document.createElement('div');
        var maxHeight = this.optionTemplate.maxHeight;
        var maxWidth = this.optionTemplate.maxWidth;
        var minHeight = this.optionTemplate.minHeight;
        var minWidth = this.optionTemplate.minWidth;
        btnHeightResize.className = 'divResize divHeightResize';
        btnHeightResize.innerHTML = '<label for="heightResize" >H: </label>' +
        '<input type="range" class="inputResize" id="heightResize" name="points" step="0.5" min="' + minHeight + '" max="' + maxHeight + '" value="' + _this.entity.spanR + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanR + ' /6</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanR + '"/>';
        this.container.appendChild(btnHeightResize);
        var btnWidthResize = document.createElement('div');
        btnWidthResize.className = 'divResize divWidthResize';
        btnWidthResize.innerHTML = '<label for="widthResize" >W: </label>' +
        '<input type="range" class="inputResize" id="widthResize" name="points" step="0.5" min="' + minWidth + '" max="' + maxWidth + '" value="' + _this.entity.spanC + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanC + ' /12</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanC + '"/>';
        this.container.appendChild(btnWidthResize);
        this.divResizeByMouseInit();
        this.divResizeByToolInit();
        var divParent = $(this.container).closest('.springContainer')[0];
        var divContent = $(divParent).find('.springContent')[0];
        divContent.draggable = 'true';
        divContent.ondragstart = function (e) {
            //e.preventDefault();
            e.dataTransfer.setData("id", $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', ''));
        };
        divContent.ondragover = function (e) {
            e.preventDefault();
        };
        divContent.ondragleave = function (e) {
            e.preventDefault();
        };
        divParent.ondrop = function (e) {
            if (e.dataTransfer.getData("type") && e.dataTransfer.getData("title")) {
                _this.screen.rebornEntity(_this.entity, e.dataTransfer.getData("type"), e.dataTransfer.getData("title"));
            }else if(e.dataTransfer.getData("id")){
                var targetId = $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', '');
                _this.screen.replaceEntity(e.dataTransfer.getData("id"), targetId);
            }
        }
    }

    return ModalNone;
})();