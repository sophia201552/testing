;(function (exports, SuperClass) {

    function Modal() {
        SuperClass.apply(this, arguments);

        this.dataList = [];
    }

    Modal.prototype = Object.create(SuperClass.prototype);

    +function () {
        this.DEFAULTS = {
            htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/block/blockConfigModal.html'
        };

        this.init = function () {
            this.$modal      = $('.modal', this.$wrap);
            this.$form       = $('#formModal', this.$wrap);
            
            this.$iptDataId  = $('#iptDataId', this.$wrap);
            this.$ulDataList = $('#ulDataList', this.$wrap);
            
            this.$selReportData = $('#selReportData', this.$wrap);
            this.$btnSubmit = $('#btnSubmit', this.$wrap);
            this.$isPageBreak = $('#iptIsPageBreak', this.$wrap);
            this.store = null;
            I18n.fillArea(this.$modal);
            this.attachEvents();
        };

        // @override
        this.recoverForm = function(options) {
            var target = this.$modal.find('.modal-content')[0];
            Spinner.spin(target);
            var _this = this;
            var form = options.option;
            if (!form) return;
            WebAPI.get('/factory/getReportData').done(function(result){
                var data = result.data;
                _this.store = result.data;
                var tpl = '';
                var notSelected = true;
                data.forEach(function(row){
                    if(form.dataId === row.dataId){
                        tpl += '<option class="optData" value="'+ row.dataId +'" selected>'+ row.name +'</option>';
                        _this.$iptDataId.hide();
                        notSelected = false;
                    }else if(form.dataId === row.name){
                        tpl += '<option class="optData" value="'+ row.dataId +'" selected>'+ row.name +'</option>';
                        _this.$iptDataId.hide();
                        notSelected = false;
                    }else{
                        tpl += '<option class="optData" value="'+ row.dataId +'">'+ row.name +'</option>';
                    }
                });
                _this.$selReportData.append(tpl);
                if(notSelected){
                    if(form.findType && form.findType === 'name'){
                        _this.$selReportData.val('name');
                        _this.$iptDataId.attr('placeholder','请填写数据Name').show();
                        _this._setField('input', _this.$iptDataId, form.dataId);
                    }else{
                        _this.$selReportData.val('id');
                        _this.$iptDataId.attr('placeholder','请填写数据Id').show();
                        _this._setField('input', _this.$iptDataId, form.dataId);
                    }
                }
                Spinner.stop();
            });
            //分页
            var isPageBreak = this.options.modalIns.entity.modal.option.isPageBreak;
            var status = isPageBreak ? isPageBreak : true;
            this.$isPageBreak.prop('checked', isPageBreak);
        };

        // @override
        this.reset = function () {
            var _this = this;
            this.store = null;
            this.$selReportData.find('.optData').remove();
            this._setField('input', this.$iptDataId);
        };

        this.attachEvents = function () {
            var _this = this;
            this.$selReportData.off('change').on('change',function(){
                if($(this).val() === 'id'){
                    _this.$iptDataId.attr('placeholder','请填写数据ID').show();
                }else if($(this).val() === 'name'){
                    _this.$iptDataId.attr('placeholder','请填写数据Name').show();
                }else{
                    _this.$iptDataId.hide();
                }
                _this._setField('input', _this.$iptDataId);
            });
            // 确实按钮点击事件
            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};

                if(_this.$selReportData.val() === 'id'){
                    form.dataId = _this.$iptDataId.val();
                    form.findType = '';
                }else if(_this.$selReportData.val() === 'name'){
                    _this.store.some(function(row){
                        if(row.name === _this.$iptDataId.val()){
                            form.findType = '';
                            form.dataId = row.dataId;
                            return true;
                        }
                    });
                    if(!form.dataId){
                        form.dataId = _this.$iptDataId.val();
                        form.findType = 'name';
                    }
                }else{
                    form.dataId = _this.$selReportData.val();
                    form.findType = '';
                }
                form.isPageBreak = _this.$isPageBreak.prop('checked');
                modal.option = $.extend(false, modal.option, form);

                _this.$modal.modal('hide');
                modalIns.render(true);

                e.preventDefault();
            }.bind(this));
        };

    }.call(Modal.prototype);

    exports.BlockConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));