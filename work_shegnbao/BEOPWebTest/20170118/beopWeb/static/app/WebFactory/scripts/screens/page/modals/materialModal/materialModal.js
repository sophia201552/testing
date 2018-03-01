;(function (exports) {

    //var DEFAULT_TABS = ['Page','Layer','Widget','Image'];
    var DEFAULT_TABS = [
        {'title':'Template',data: ['Report','Page','Layer','Widget','Image']}
    ];



    function MaterialModal() {
        this.$modal = null;
        this.template = null;
        this.tabs = [];
        this.showTemplateType = [];
        this.callback = null;
    }

    +function () {

        this.show = function (tabs,callback) {
            var _this = this;
            this.tabs = typeof tabs === 'undefined' ? DEFAULT_TABS : tabs;

            this.callback = callback;

            if (this.$modal) {
                this.template && this.template.close();
                this.$modal.remove();
            }

            //this.tabs = tabs;

            for(var i = 0,len = this.tabs.length;i<len;i++){
                var tabsArr = [],tabsData = [];
                var tab = this.tabs[i];
                tab.data.forEach(function(row){
                    if(row.indexOf('.')> -1 ){
                        tabsArr.push(row.split('.')[0]);
                        _this.showTemplateType.push(row.split('.')[1]);
                    }else{
                        tabsArr.push(row);
                    }
                });
                tabsArr.forEach(function(row){
                    if(tabsData.indexOf(row)<0){
                        tabsData.push(row);
                    }
                });
                this.tabs[i].data = tabsData;
            }
            //tabsArr.forEach(function(row){
            //    if(_this.tabs.indexOf(row)<0){
            //        _this.tabs.push(row);
            //    }
            //});
            this.$modal = $('<div class="modal" id="materialModal" style="display:none;">\
                <div class="modal-dialog" style="width: 85%; height: calc(100% - 60px);">\
                    <div class="modal-content" style="width: 100%;height: 100%;border: none;">\
                        <div class="modal-header" style="display:none;">\
                            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>\
                        </div>\
                        <div class="modal-body container" style="width: 100%;height: 100%;padding: 0 15px;background-color:#272b30;"></div>\
                        <button type="button" id="materiaClose" class="close" data-dismiss="modal" aria-label="Close" style="position: absolute;top: 2px;right: 6px;color: white;font-size: 25px;"><span aria-hidden="true">&times;</span></button>\
                    </div>\
                </div>\
            </div>');

            this.$modal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                _this.$modal.detach();
            });
            this.$modal.modal('show');

            this.initTemplate();
        };

        this.initTemplate = function () {
            var _this = this;
            var clazz = namespace('factory.components.template.Template');
            var options = {};

            if (typeof this.callback === 'function') {
                options['callback'] = this.callback;
                options['allowUse'] = true;
            }

            this.template = new clazz(this.$modal[0].querySelector('.modal-body'), {
                modules: this.tabs,
                showTemplateType:this.showTemplateType,
                tabOptions: options,
                onClose: function () {
                    _this.$modal.modal('hide');
                    _this.template = null;
                }
            });
            this.template.show();
            this.tabs = [];
            this.showTemplateType = [];
        };

    }.call(MaterialModal.prototype);

    exports.MaterialModal = new MaterialModal();

} (window));