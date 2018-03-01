;(function (exports, SuperClass) {

    function Modal() {
        SuperClass.apply(this, arguments);

        this.dataList = [];
    }

    Modal.prototype = Object.create(SuperClass.prototype);

    +function () {
        this.DEFAULTS = {
            htmlUrl: '/static/app/WebFactory/scripts/screens/report/components/table/tableConfigModal.html'
        };

        this.init = function () {
            this.$modal      = $('.modal', this.$wrap);
            this.$form       = $('#formModal', this.$wrap);
            this.$btnSubmit  = $('#btnSubmit', this.$wrap);

            this.$selRow  = $('#selRow', this.$wrap);
            this.$selColumn  = $('#selColumn', this.$wrap);
            this.$selInterval  = $('#selInterval', this.$wrap);
            this.$dateStart  = $('#dateStart', this.$wrap);
            this.$dateEnd  = $('#dateEnd', this.$wrap);
            this.$chbxSwapRC  = $('#chbxSwapRC', this.$wrap);

            this.$droparea  = $('.droparea', this.$wrap);
            this.$btnAddDs  = $('#btnAddDs', this.$wrap);

            this.$divOptDs  = $('#divOptDs', this.$wrap);
            this.$divOptHist  = $('#divOptHist', this.$wrap);
            this.$divOptRT  = $('#divOptRT', this.$wrap);
            this.$dsTemplate  = $('.dsTemplate', this.$wrap);

            I18n.fillArea(this.$modal);
            this.attachEvents();
        };

        // @override
        this.recoverForm = function(options) {
            var _this = this;
            var form = options.option;
            if (!form) {
                _this.reset();
            } else {
                if($.isEmptyObject(form)){
                    _this.reset();
                }else{
                    this._setField('select', this.$selRow, form.y);
                    this._setField('select', this.$selColumn, form.x);

                    this.showCorrespond(this.$selRow, form.y, form);
                    this.showCorrespond(this.$selColumn, form.x, form);
                }
            }
        };

        this.showCorrespond = function($sel,val,form){
            var _this = this;
            var now;
            switch (val){
                case 'dataSource':
                    $sel.after(this.$divOptDs.removeClass('hidden'));
                    this.$divOptDs.find('.dsWrap').remove();
                    if(form.dataSrc && form.dataSrc.length > 0){
                        form.dataSrc.forEach(function(data){
                            var $clone = _this.$dsTemplate.clone().removeClass('hidden dsTemplate');
                            var dsName = AppConfig.datasource.getDSItemById(data.dsId).alias;
                            _this.$divOptDs.append($clone);

                            $clone.find('.droparea').removeClass('glyphicon glyphicon-plus').attr('dsId', data.dsId).attr('title',dsName).text(dsName);
                            $clone.find('.dsTitle').val(data.title);
                            _this.attachDsItem($clone.find('.droparea')[0]);
                        });
                    }
                    break;
                case 'history':
                    now = new Date();
                    this.$divOptHist.children('.timeRange').removeClass('hidden');
                    $sel.after(this.$divOptHist.removeClass('hidden'));
                    this._setField('select', this.$selInterval, form.interval);
                    this._setField('input', this.$dateStart, form.start ? form.start : new Date(now.getTime() - 604800000).format('yyyy-MM-dd 00:00'));
                    this._setField('input', this.$dateEnd, form.end ? form.end : now.format('yyyy-MM-dd 00:00'));
                    break;
                case 'realtime':
                    //todo
                    $sel.after(this.$divOptRT.removeClass('hidden'));
                    break;
                case 'default':
                    this.$divOptHist.children('.timeRange').addClass('hidden');
                    $sel.after(this.$divOptHist.removeClass('hidden'));
            }
        }

        // @override
        this.reset = function () {
            var now = new Date();
            this.$dateStart.val('');
            this.$dateEnd.val('');
            var $clone = this.$dsTemplate.clone().removeClass('hidden dsTemplate');
            this.$divOptDs.children('.dsWrap').remove().end().append($clone);
            this.attachDsItem($clone.find('.droparea')[0]);

            this.$selRow.after(this.$divOptHist.removeClass('hidden'));
            this.$dateStart.val(new Date(now.getTime() - 604800000).format('yyyy-MM-dd 00:00'));//7*24*60*60*1000=604800000
            this.$dateEnd.val(now.format('yyyy-MM-dd 00:00'));
        };

        this.attachEvents = function () {
            var _this = this;

            // 确实按钮点击事件
            this.$btnSubmit.off().click(function (e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var optConfig = {}, isSubmit = true;
                getDataByType(optConfig, _this.$selRow, 'y');//type
                getDataSource(optConfig, 'x');

                //check form
                //type
                if(optConfig.y == '' && isSubmit){
                    alert(I18n.resource.report.tableConfig.TYPE + 'is not yet selected');
                    isSubmit = false;
                }
                //dateStart
                if(optConfig.start == '' && isSubmit){
                    alert('Start time is required');
                    isSubmit = false;
                }
                //dateEnd
                if(optConfig.end == '' && isSubmit){
                    alert('End time is required');
                    isSubmit = false;
                }
                //droparea 数据源
                if(optConfig.dataSrc && optConfig.dataSrc.length == 0 && isSubmit){
                    alert('Data sources need at least one');
                    isSubmit = false;
                }else if(optConfig.dataSrc.length > 0){
                    for(var i = 0; i < optConfig.dataSrc.length; i++){
                        if(optConfig.dataSrc[i].dsId && !optConfig.dataSrc[i].title && isSubmit){
                            alert('No input header');
                            isSubmit = false;
                        }
                    }
                }

                if(!isSubmit){ return; }

                modal.option.isSwap = _this.$chbxSwapRC.prop('checked');
                modal.option = $.extend(false, modal.option, optConfig);

                _this.$modal.modal('hide');
                modalIns.render(true);

                e.preventDefault();
            }.bind(this));

            //行列选择
            this.$selRow.off().change(function(){
                var selVal = this.value;
                var $formGroup = $(this).closest('.form-group');
                $formGroup.next('.divAppend').addClass('hidden');
                /*if(selVal == 'dataSource'){
                    if($formGroup.next('.dsWrap').length == 0){
                        $formGroup.after(this.$divOptDs.removeClass('hidden').append(this.$dsTemplate.clone().removeClass('hidden dsTemplate')));
                    }
                }else */
                if(selVal == 'history'){
                    _this.$divOptHist.children('.timeRange').removeClass('hidden');
                    $(this).after(_this.$divOptHist.removeClass('hidden'));
                }else if(selVal == 'realtime'){
                    $(this).after(_this.$divOptRT.removeClass('hidden'));
                }else if(selVal == 'default'){
                    _this.$divOptHist.children('.timeRange').addClass('hidden');
                    $(this).after(_this.$divOptHist.removeClass('hidden'));
                }
            });

            //数据源
            this.$droparea.each(function(){
                _this.attachDsItem(this);
            });


            this.$btnAddDs.off().click(function(){
                var $cloneDom = _this.$dsTemplate.clone().removeClass('hidden dsTemplate');
                var $droparea = $cloneDom.find('.droparea');

                $droparea.text('').attr('dsId', '');
                $cloneDom.find('.dsTitle').val('');

                _this.$divOptDs.append($cloneDom);

                _this.attachDsItem($droparea[0]);
            });

            $('input.dpInlineBlock').datetimepicker({
                autoclose: true
            });

            function getDataByType(optConfig, $sel, type){
                var selVal = $sel.val();
                switch (selVal){
                    case 'history':
                        optConfig.start = _this.$divOptHist.find('#dateStart').val();
                        optConfig.end = _this.$divOptHist.find('#dateEnd').val();
                        optConfig[type] = selVal;
                        optConfig.interval = _this.$divOptHist.find('#selInterval').val();
                        break;
                    case 'realtime':
                        break;
                    case 'default':
                        optConfig[type] = selVal;
                        optConfig.interval = _this.$divOptHist.find('#selInterval').val();
                }
            }

            function getDataSource(optConfig, type){

                optConfig[type] = 'dataSource';
                optConfig.dataSrc = [];

                _this.$divOptDs.children('.dsWrap').each(function(){
                    var dsId = $(this).find('.droparea').attr('dsId');
                    if(dsId){
                        optConfig.dataSrc.push({
                            dsId: dsId,
                            title: $(this).find('.dsTitle').val()
                        });
                    }
                });

            }
        };

        this.attachDsItem = function(droparea){
            droparea.ondragover = function(e){
                e.preventDefault();
            };

            droparea.ondrop = function(e){
                e.preventDefault();
                try{
                    var dsItemId = EventAdapter.getData().dsItemId, alias;
                    if(dsItemId){
                        alias = AppConfig.datasource.getDSItemById(dsItemId).alias;
                        $(this).removeClass('glyphicon glyphicon-plus').attr('dsId', dsItemId).attr('title',alias).text(alias);
                    }
                }catch (e){
                    console.log('data source id is not found');
                }
            };

            $(droparea).closest('.dsWrap').find('.btnRemove').off().click(function(){
                $(this).closest('.dsWrap').remove();
            });
        }

    }.call(Modal.prototype);

    exports.TableConfigModal = new Modal();

} ( namespace('factory.report.components'), ModalConfig ));