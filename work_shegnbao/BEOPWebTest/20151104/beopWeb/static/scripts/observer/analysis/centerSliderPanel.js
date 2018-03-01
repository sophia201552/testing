window.analysis = window.analysis || {};
window.analysis.panels = window.analysis.panels || {};

window.analysis.panels.CenterSliderPanel = ( function (window, $, Model, undefined) {

    function CenterSliderPanel(screen, ws) {
        this.screen = screen;
        this.ws = ws;
        this.readonly = ( ws.templateId && (ws.templateId !== ws.id) ) ? true : false;
        this.referTo = ws.templateId === ws.id ? 'tpl' : 'ws';

        this.model = new Model();
    };

    CenterSliderPanel.prototype.tpl = '\
    <div class="divPage slider-item{cls}" id="cp_{id}" data-id="{id}" draggable="true" style="{imagebin}">\
        <h4 class="divPageTitle">\
            <div class="modalNameSp">{name}</div>\
        </h4>\
        {sign}\
        <div class="effect"></div>\
        <span class="slider-cb-wrap"><i class="slider-cb"></i></span>\
        <div class="sliderInfo">\
            <span class="modifyTime">Recently:&nbsp;&nbsp;{modifyTime}</span>\
        </div>\
    </div>';

    CenterSliderPanel.prototype.show = function (container) {
        this.$container = $(container);
        this.init();
    };

    CenterSliderPanel.prototype.init = function () {
        var _this = this;
        
        if(this.ws.modalCount === undefined) {
            this.renderPanel();
        }
    };

    CenterSliderPanel.prototype.renderPanel = function () {
        var _this = this, tempHTML = [];
        var sign  = this.readonly ? '<span class="btnRemove glyphicon glyphicon-link" title="From Template"></span>' 
            : '<span class="btnRemove glyphicon glyphicon-remove-sign" title="Remove"></span>';
        var cls = this.readonly ? ' slider-readonly' : '';

        this.$itemCtn = this.$container;
        
        this.ws.modalList.forEach(function(modal){
            tempHTML.push(_this.tpl.formatEL({
                id: modal.id,
                name: modal.name || 'Untitled',
                sign: sign,
                modifyTime: modal.modifyTime,
                cls: cls,
                imagebin: ( function () {
                    if(modal.imagebin) return 'background-image: url('+ modal.imagebin +')';
                    else return '';
                }() )
            }));
        });
        if(!this.readonly) {
            //添加模板新增按钮
            tempHTML.push('<div class="divPage slider-item-add" style="background-image: none;">\
            <h4 style="cursor: pointer;z-index: 1;position: absolute;left: 50%;top: 50%;margin-left: -16px;margin-top: -16px;" id="btnAddSlider">\
                <span class="glyphicon glyphicon-plus" style="font-size: 32px;"></span>\
            </h4>\
            <div class="effect"></div>\
            </div>');
        }
        this.$container.html(tempHTML.join(''));

        this.attachEvent();
        this.attachItemEvents( this.$container.find('.slider-item') );
    };

    CenterSliderPanel.prototype.attachEvent = function($container){
        var _this = this;

        EventAdapter.on($(this.$container.find('.slider-item-add')), 'click', function (e) {
        //this.$container.find('.slider-item-add').click(function(){
            var modal = {
                id: ObjectId(),
                name: "",
                note: "",
                option: {},
                type: "",
                modifyTime: new Date().format('yyyy-MM-dd HH:mm')
            }
            return _this.model.create(modal, _this.ws.id, _this.referTo)
                .done( function () {
                    _this.ws.modalList.push(modal);
                } );
        });
    }

    CenterSliderPanel.prototype.attachItemEvents = function ($items) {
        var _this = this;       

        var $btnRemoveList = $('.btnRemove ', $items);
        var $titleList = $('.divPageTitle', $items);
        var $checkBoxList = $('.slider-cb', $items);

        !this.readonly && EventAdapter.on($btnRemoveList, 'click', function (e) {
        //!this.readonly && $btnRemoveList.on('click', function(e){
            e.stopPropagation();
            var modalId = $(this).closest('.divPage').attr('data-id');
            
            return _this.model.delete(modalId, _this.ws.id, _this.referTo)
                .done( function () {
                    var modal, i = 0;
                    for(; (modal = _this.ws.modalList[i]); i++) {
                        if(modal.id === modalId) {
                            _this.ws.modalList.splice(i,1);
                            return;
                        }
                    }
                } );
        });

        !this.readonly && EventAdapter.on($titleList, 'click', function (e) {
        //!this.readonly && $titleList.on('click', function(e){
            e.stopPropagation();
            var $target = $(e.target);
            var $textarea = $('<textarea value="" placeholder="Input name"/>');
            $textarea
                .blur(function () {
                    var modal, i = 0;
                    var modalId = $(this).closest('.divPage').attr('data-id');
                    var params;

                    $(this).closest('.divPage').attr('draggable', true);

                    $(this).prev('.modalNameSp').show();
                    $(this).remove();

                    for(; (modal = _this.ws.modalList[i]); i++) {
                        if(modal.id === modalId) {
                            params = {
                                id: modalId,
                                name: $(this).val(),
                                modifyTime: new Date().format('yyyy-MM-dd HH:mm')
                            };
                            _this.model.update(params, _this.ws.id, _this.referTo)
                            .done( function (modal) {
                                modal.modifyTime = params.modifyTime;
                                modal.name = params.name;
                            }.bind(this, modal) );
                            break;
                        }
                    }
                })
                .keypress(function(e){
                    if(e.keyCode === 13) $(this).blur();
                })
                .focus(function() {
                    $(this).closest('.divPage').attr('draggable', false);
                    $(this).select().prev('.modalNameSp').hide();
                });
            EventAdapter.on($textarea, 'click', function (e) {
            //.click(function(e) {
                e.stopPropagation();
            });

            $target.hide().after($textarea);
            $textarea.val($target.html()).focus();
        });

        EventAdapter.on($checkBoxList, 'click', function (e) {
        //$checkBoxList.on('click', function(e){
            e.stopPropagation();
            var $slider = $(this).closest('.divPage');
            $slider.toggleClass('checked');
        });

        EventAdapter.on($items, 'click', function (e) {
        //$items.on('click', function(e){
            e.stopPropagation();
            var sliderId = $(this).attr('data-id');
            $('#lp_' + sliderId).trigger('click');
        });

        // drag drop events
        !this.ws.templateId && this.attachDragEvents( this.$container.find('.slider-item') );
    };

    CenterSliderPanel.prototype.updateSlider = function(modal){
        var _this = this;
        var $modal = $('#cp_'+modal.id);
        var $name, $modifyTime;

        if(!$modal || !$modal.length) return;

        if(modal.name) {
            $name = $('.modalNameSp', $modal);
            // 更新名称
            $name.text(modal.name || 'Untitled');
        }
        
        $modifyTime = $('.modifyTime', $modal);
        // 更新修改时间
        $modifyTime.text('Recently:  ' + modal.modifyTime || '');
        // 更新 imagebin
        if(modal.imagebin) $modal.css('background-image', 'url(' + modal.imagebin + ')');
    }

    CenterSliderPanel.prototype.removeSlider = function(modal){
        $('#cp_'+modal.id, this.$container).remove();
    }

    CenterSliderPanel.prototype.addSlider = function(modal){
        var $slider;
        var sign  = this.readonly ? '<span class="btnRemove glyphicon glyphicon-link" title="From Template"></span>' 
            : '<span class="btnRemove glyphicon glyphicon-remove-sign" title="Remove"></span>';
        var cls = this.readonly ? ' slider-readonly' : '';

        $slider = $( this.tpl.formatEL({
            id: modal.id,
            name: modal.name || 'Untitled',
            modifyTime: modal.modifyTime,
            sign: sign,
            cls: cls
        }) );

        this.$itemCtn.find('.slider-item-add').before($slider);
        // 将滚动条滚动到最底端
        this.$itemCtn[0].scrollTop = this.$itemCtn[0].scrollHeight;

        this.attachItemEvents($slider);
        return $slider;
    }

    CenterSliderPanel.prototype.close = function () {
        this.$container.empty();
        this.$container.off();
    };

    CenterSliderPanel.prototype.attachDragEvents = function($items){
        var _this = this;
        var startIndex, $dragEle;
        var dataUrl;
        // 获取宽度和高度，以便定义拖拽的中心点
        var sliderWidth = $items.eq(0).width();
        var sliderHeight = $items.eq(0).height();

        $items.off('dragstart').on('dragstart', function (e) {
            var $target = $dragEle = $(e.target);
            
            // 记录开始时的位置下标
            startIndex = $target.index();
            dataUrl = $target[0].style.backgroundImage;

            $target[0].style.backgroundImage = 'none';
            $target.addClass('on-drag');
        });

        $items.off('dragover').on('dragover', function (e) {
            var $target = $(e.target);
            var oEvent = e.originalEvent;
            var offset;
            if($target === $dragEle) return;
            // 处理冒泡来的事件
            if( !$target.hasClass('divPage') ) $target = $target.closest('.divPage');
            
            offset = $target.offset();
            // 如果鼠标位于 slider 的右半部分
            // 则将待移动 slidre 追加到当前 slider 后面
            if( (oEvent.pageX - offset.left) > sliderWidth/2 ) {
                $dragEle.insertAfter($target);
            }
            // 如果鼠标位于 slider 的左半部分
            // 则将待移动 slidre 插入到当前 slider 前面
            else {
                $dragEle.insertBefore($target);
            }
            e.stopPropagation();
        });

        $items.off('dragend').on('dragend', function (e) {
            var endIndex = $dragEle.index();

            $dragEle[0].style.backgroundImage = dataUrl;
            $dragEle.removeClass('on-drag');

            // 如果起始位置和结束位置一样，则不做处理
            if(startIndex === endIndex) return;

            _this.ws.modalList.move(startIndex, endIndex);
        });
    };

    return CenterSliderPanel;

} (window, jQuery, window.analysis.models.ModalModel) );