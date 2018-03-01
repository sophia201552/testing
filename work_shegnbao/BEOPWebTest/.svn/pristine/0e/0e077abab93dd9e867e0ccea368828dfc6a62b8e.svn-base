var PageEditModal = (function () {
    var _this = undefined;
    function PageEditModal() {
        _this = this;
        _this.src = undefined;
        _this.callback = undefined;
    }

    PageEditModal.prototype.show = function(src, callback) {
        _this.src = src;
        _this.callback = callback;
        var $modalPageEdit = $('#pageEditModal');
        if (!$modalPageEdit || 0 == $modalPageEdit.length) {
            WebAPI.get('/static/app/WebFactory/scripts/modals/pageEditModal/pageEditModal.html').done(function (resultHTML) {
                _this.$contain = $(resultHTML);
                _this.init();
                _this.$contain.modal('show');
            }).always(function(e) {
            });
        }
        else {
            $modalPageEdit.modal('show');
            _this.init();
        }
    };

    PageEditModal.prototype.init = function() {
        _this.$btnOk = _this.$contain.find('#btnOk');
        _this.$inputPageName = _this.$contain.find('#inputPageName');
        _this.$selectPageType = _this.$contain.find('#selectPageType');
        _this.$divPageSize = _this.$contain.find('#divPageSize');
        _this.$inputPageWidth = _this.$contain.find('#inputPageWidth');
        _this.$inputPageHeight = _this.$contain.find('#inputPageHeight');

        _this.$inputPageName.val(_this.src.name);
        _this.$selectPageType.find('option[text=' + _this.src.type + ']').attr('selected' ,true);
        _this.$inputPageWidth.val(_this.src.width);
        _this.$inputPageHeight.val(_this.src.height);

        _this.attachEvent();
    };

    PageEditModal.prototype.close = function() {
        _this.$contain.remove();
    };

    PageEditModal.prototype.attachEvent = function() {
        _this.$btnOk.off().click(function(e){
            var pageName = _this.$inputPageName.val();
            var pageType = _this.$selectPageType.find("option:selected").text();
            var pageWidth = parseInt(_this.$inputPageWidth.val(), 10);
            var pageHeight = parseInt(_this.$inputPageHeight.val(), 10);
            var objPageCfg = {name:pageName, type:pageType, width:pageWidth, height:pageHeight};
            _this.callback(objPageCfg);
            _this.$contain.modal('hide');
        });
        _this.$selectPageType.change(function(e){
            var nowText = _this.$selectPageType.find("option:selected").text();
            if ('PageScreen' == nowText) {
                _this.$divPageSize.show();
            }
            else {
                _this.$divPageSize.hide();
            }
        });
    };

    PageEditModal = new PageEditModal();
    return PageEditModal;
})();