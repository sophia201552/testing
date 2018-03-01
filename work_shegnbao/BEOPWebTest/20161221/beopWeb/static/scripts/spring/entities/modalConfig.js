var ModalConfig = (function ($, undefined) {

    var arrForEach = Array.prototype.forEach;

    //////////////////////////////////
    // ModalConfig CLASS DEFINITION //
    //////////////////////////////////
    function ModalConfig(options) {
        // parameters
        this.options = $.extend({}, this.DEFAULTS, options);
        // DOM
        this.$wrap = null;
    };

    //////////////////////////////////////
    // ModalConfig PROTOTYPE DEFINITION //
    //////////////////////////////////////
    ModalConfig.prototype = {
        constructor: ModalConfig,
        // 显示配置弹出框
        show: function () {
            var _this = this;
            var htmlUrl = this.options.htmlUrl;
            var matches = htmlUrl.match(/\/?(\w+)(?:\.html)/);
            var id, domPanelContent, $ele;
            var promise = $.Deferred();

            // url有误
            if(!matches || matches[1] === undefined) {
                console.error('the url of config modal is illigal: '+ htmlUrl);
                return false;
            }

            // 自动将 "文件名+Wrap" 作为 wrap 层的 DOM id
            // id rule: "文件名+Wrap"
            id = matches[1] + 'Wrap';
            domPanelContent = document.getElementById(this.options.container || 'paneContent');

            if( ($ele = $('#'+id)).length > 0) {
                if ( !$.contains(domPanelContent, $ele[0]) ) {
                    domPanelContent.appendChild($ele[0]);
                }
                promise.resolve();
            } else {
                Spinner.spin(domPanelContent);

                // get the template from server
                WebAPI.get(htmlUrl).then(function (html) {
                    var rs;
                    Spinner.stop();
                    _this.$wrap = $('<div class="modal-config-wrap" id="'+id+'">')
                        .appendTo(domPanelContent).html(html);
                    _this.$modal = _this.$wrap.children('.modal');
                    _this._attachEvents();
                    return _this.init();
                }).always(function () {
                    promise.resolve();
                });
            }

            return promise.done(function () {
                _this.$modal.modal('show');
            });
        },
        /**
         * 设置表单某个字段的值
         * 这个方法的目的主要是：方便 reset 和 recover 表单的操作
         * 调用方式：__setField(type, $ele [,value])
         * @param  {string} type  告诉方法当前处理的表单字段是什么类型的
         * @param  {object(jQuery Wrap)} $ele  当前表单字段对应的 DOM 对象
         * @param  {number|string} value 需要向当前表单字段中填充的数值，可缺省，缺省时默认使用''，
         *                               当需要重置某个表单字段时，缺省该参数即可
         */
        _setField: function (type, $ele, value) {
            var itemMap, name;
            var _this = this;
            switch(type) {
                // 下拉列表
                case 'dropdown':
                    itemMap = $ele.data('dropdown-items');
                    if(!itemMap) {
                        $ele.data('dropdown-items', 
                            // value-text 映射表 
                            itemMap = (function () {
                                var rs = {};
                                $ele.siblings('ul').find('a').each(function (i, item) {
                                    var $item = $(item);
                                    var value = $item.attr('data-value');
                                    var text  = $item.text();
                                    if(!rs[value]) rs[value] = text;
                                });
                                return rs;
                            } ())
                        );   
                    }
                    $ele.attr('data-value', value).children('span').eq(0).text(itemMap[value]);
                    break;
                // 文本框
                case 'input':
                // 文本域
                case 'textarea':
                    value = value || '';
                    $ele.val(value);
                    break;
                // 数据源拖拽区域
                case 'droparea':
                    // reset
                    if(!value || value.trim() === '') {
                        $ele.attr('data-value', '').html('<span class="glyphicon glyphicon-plus"></span>');
                    }
                    // recover
                    else {
                        // 获取数据源的名称
                        name = AppConfig.datasource.getDSItemById(value).alias;
                        $ele.attr({'data-value': value,
                            'title': name}).html('<span>'+name+'</span>');
                    }
                    break;
                case 'select':
                    $ele.val(value);
                    break;
                // some more...
                default:
                    break;
            }
        },
        /**
         * 初始化一些公共的事件
         */
        _attachEvents: function () {
            var _this = this;
            var $modal;
            /////////////////////////////////
            // all dropdown selected event //
            /////////////////////////////////
            $('.dropdown-menu', this.$wrap).off('click.selected').on('click.selected', 'a', function (e) {
                var $this = $(this);
                var $btn = $this.parents('.dropdown-wrap').children('button');
                var value = $this.attr('data-value');
                var text = $this.text();

                $btn.attr('data-value', value);
                $btn.children('span').eq(0).text(text);

                e.preventDefault();
            });

            ////////////////////////////
            // modal show/hide events //
            ////////////////////////////
            $modal = $('.modal', this.$wrap);
            $modal.off('show.bs.modal').on('show.bs.modal', function (e) {
                var $rightCt;
                if(e.namespace !== 'bs.modal') return true;
                $rightCt = $('#rightCt');
                // recover the form
                _this.recoverForm(_this.options.modalIns.entity.modal);
                // show the data soucre panel
                if(!$rightCt.hasClass('rightCtOpen')) $rightCt.click();
            });
            $modal.off('hide.bs.modal').on('hide.bs.modal', function (e) {
                var $rightCt;
                if(e.namespace !== 'bs.modal') return true;
                $rightCt = $('#rightCt');
                // reset the form state
                _this.reset();
                // hide the data soucre panel
                if($rightCt.hasClass('rightCtOpen')) $rightCt.click();
            });

            ///////////////////////
            // point Drop EVENTS //
            ///////////////////////
            this.$wrap.off('dragover').on('dragover', '.drop-area', function (e) {
                e.preventDefault();
            });
            this.$wrap.off('dragenter').on('dragenter', '.drop-area', function (e) {
                $(e.target).addClass('on');
                e.preventDefault();
                e.stopPropagation();
            });
            this.$wrap.off('dragleave').on('dragleave', '.drop-area', function (e) {
                $(e.target).removeClass('on');
                e.stopPropagation();
            });
            this.$wrap.off('drop').on('drop', '.drop-area', function (e) {
                _this.onDropActionPerformed(e);
            });
        },
        onDropActionPerformed: function (e) {
            var _this = this;
            var itemId = EventAdapter.getData().dsItemId;
            var $target = $(e.target);
            var name;
            if(!itemId) return;
            $target.removeClass('on');
            _this._setField('droparea', $target, itemId);
            e.stopPropagation();
        },
        setOptions: function (options) {
            this.options = $.extend({}, this.options, options);
        }
    };

    return ModalConfig;
} (jQuery));