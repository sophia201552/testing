window.analysis = window.analysis || {};
window.analysis.panels = window.analysis.panels || {};

window.analysis.panels.LeftSliderPanel = ( function (window, $, Model, undefined) {

    function LeftSliderPanel(screen, ws) {
        this.screen = screen;
        this.ws = ws;
        this.readonly = ( ws.templateId && (ws.templateId !== ws.id) ) ? true : false;
        this.referTo = ws.templateId === ws.id ? 'tpl' : 'ws';

        this.model = new Model();
    };

    LeftSliderPanel.prototype.tpl = '\
    <div class="divPage slider-item{cls}" id="lp_{id}" data-id="{id}" draggable="true" style="{imagebin}" >\
        <h4 class="divPageTitle">\
        <div class="modalNameSp">{name}</div>\
        </h4>\
        {sign}\
        <div class="effect"></div>\
    </div>';

    LeftSliderPanel.prototype.show = function (container) {
        this.$container = $(container);
        this.init();
    };

    LeftSliderPanel.prototype.init = function () {
        var _this = this;
        // 判断是否有没有加载的数据
        // 在这里将 modalCount 作为一个标记位
        if(this.ws.modalCount !== undefined) {
            // 如果 modal 的个数为 0，则无需去服务器拉数据
            if(this.ws.modalCount === 0) {
                delete this.ws.modalCount;
                this.renderPanel();
            } 
            // 处理第一次带回来的 modalList 数据
            else if(this.ws.modalCount === -1) {
                delete this.ws.modalCount;
                _this.displayThumbnail(this.ws.modalList).done(function () {
                    _this.renderPanel();
                });
            }
            // 否则需要去服务端拉数据
            else {
                Spinner.spin(ElScreenContainer);
                WebAPI.post('/analysis/getModals', {
                    idList: [this.ws.id]
                }).done(function (rs) {
                    rs = rs[_this.ws.id];

                    _this.displayThumbnail(rs.modalList).done(function () {
                        delete _this.ws.modalCount;
                        _this.ws.modalList = rs.modalList;
                        _this.renderPanel();
                    }).always(function () {
                        Spinner.stop();
                    });

                    _this.screen.mergeDsInfoList(rs.dsInfoList);
                }).fail(function () {
                    Spinner.stop();
                });
            }
        } else {
            this.renderPanel();
        }
    };

    LeftSliderPanel.prototype.displayThumbnail = function (modalList) {
        var wsId = this.ws.id;
        var promise = $.Deferred();

        // 将空 modal 剔除
        modalList = modalList.filter(function (row) {
            return !!row.type;
        });

        window.Beop.cache.img.getChkByWs({
            id: wsId,
            modalList: modalList
        }).done(function (rs) {
            var imgData = rs.data;
            var absentList = rs.absentList;

            modalList.forEach(function (modal) {
                var key = wsId+'_'+modal.id;
                if(imgData[key] !== undefined) {
                    modal.imagebin = imgData[key];
                }
            });

            if(!absentList.length) {
                promise.resolve();
                return;
            }

            // 缺省的数据从服务端拿
            WebAPI.post('/analysis/getThumbnails', {
                modalIdList: absentList
            }).done(function (rs) {
                var modalsNeedCache = [];

                modalList.forEach(function (modal) {
                    if(rs[modal.id] !== undefined) {
                        modal.imagebin = rs[modal.id];
                        modalsNeedCache.push(modal);
                    }
                });

                window.Beop.cache.img.setByWs({
                    id: wsId,
                    modalList: modalsNeedCache
                }).fail(function () {
                    console.warn('thumbnail save to cache failed!');
                });
            }).fail(function () {
                console.warn('get thumbnail failed!');
            }).always(function () {
                promise.resolve();
            });
        });
        
        return promise;
    };

    LeftSliderPanel.prototype.renderPanel = function () {
        var _this = this, tempHTML = [];
        var sign  = this.readonly ? '<span class="btnRemove glyphicon glyphicon-link" title="From Template"></span>' 
            : '<span class="btnRemove glyphicon glyphicon-remove-sign" title="Remove"></span>';
        var cls = this.readonly ? ' slider-readonly' : '';

        this.$itemCtn = this.$container.find('.panel-body');
        this.$divWsName = $('.dropdownWS', this.$container);
        this.$panelHead = $('.panel-heading', this.$container);
        this.$btnGroup = $('#btnGroup', this.$container);
        this.$btnAddSlider = $('#btnPageAdd', this.$container);

        // 更新 modalList
        this.ws.modalList.forEach(function(modal){
            tempHTML.push(_this.tpl.formatEL({
                id: modal.id,
                name: modal.name || 'Untitled',
                sign: sign,
                cls: cls,
                imagebin: ( function () {
                    if(modal.imagebin) return 'background-image: url('+ modal.imagebin +')';
                    else return '';
                }() )
            }));
        });

        // 更新 workspace 名称
        this.$divWsName.text(this.ws.name);
        // 显示 head
        this.$panelHead.children().show();
        // 显示底部工具栏
        this.$btnGroup.show();

        // 如果是只读状态，则给 container 添加只读 css 类
        if(this.readonly) this.$container.addClass('panel-readonly');

        this.$itemCtn.html(tempHTML.join(''));

        this.attachEvent();
        this.attachItemEvents( this.$itemCtn.find('.slider-item') );
    };

    LeftSliderPanel.prototype.updateSlider = function(modal){
        var $modal = $('#lp_'+modal.id);
        var $name;

        if(!$modal || !$modal.length) return;

        if(modal.name) {
            $name = $('.modalNameSp', '#lp_' + modal.id);
            $name.html(modal.name || 'Untitled');
        }
        // 更新 imagebin
        if(modal.imagebin) $modal.css('background-image', 'url(' + modal.imagebin + ')');
    }

    LeftSliderPanel.prototype.removeSlider = function(modal){
        var newIndex, $newModal;
        var $modal = $('#lp_'+modal.id, this.$container);
        if( $modal.hasClass('selected') && this.ws.modalList.length > 0 ) {
            // 删除元素后，自动定位到下一个元素
            newIndex = Math.min( $modal.index(), this.ws.modalList.length-1 );
            $newModal = $('#lp_'+this.ws.modalList[newIndex].id,  this.$container);
        } else if( this.ws.modalList.length <= 0 ) {
            this.screen.path.pop();
        }

        $modal.remove();
        if( $newModal !== undefined ) {
            $newModal.trigger('click');
        }
    }

    LeftSliderPanel.prototype.addSlider = function(modal){
        var sign  = '<span class="btnRemove glyphicon glyphicon-remove-sign" title="Remove"></span>';
        var $slider = $( this.tpl.formatEL({
            id: modal.id,
            name: modal.name || 'Untitled',
            modifyTime: modal.modifyTime,
            sign: sign,
            cls: ''
        }) );
        this.$itemCtn.append($slider);
        // 将滚动条滚动到最底端
        this.$itemCtn[0].scrollTop = this.$itemCtn[0].scrollHeight;

        this.attachItemEvents($slider);

        $slider.trigger('click');
    };

    LeftSliderPanel.prototype.attachEvent = function(){
        var _this = this;

        EventAdapter.on(this.$btnAddSlider.off('click'), 'click', function (e) {
        //this.$btnAddSlider.off('click').click(function(e){
            var modal = {
                id: ObjectId(),
                name: '',
                type: '',
                note: '',
                modifyTime: new Date().format('yyyy-MM-dd HH:mm:ss'),
                option: {}
            };
            return _this.model.create(modal, _this.ws.id, _this.referTo)
            .done( function () {
                _this.ws.modalList.push(modal);
            } );
        });
    };

    LeftSliderPanel.prototype.detachEvent = function () {};

    LeftSliderPanel.prototype.attachItemEvents = function ($items) {
        var _this = this;       

        var $btnRemoveList = $('.btnRemove ', $items);
        var $titleList = $('.divPageTitle', $items);

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
                                var path = _this.screen.path[_this.screen.path.length-1];
                                modal.modifyTime = params.modifyTime;
                                modal.name = params.name;
                                // 更新 breadcrumb 文本
                                if(modalId === path.data['id']) {
                                    path.title = params.name;
                                    _this.screen.renderBreadCrumb();
                                }
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

        EventAdapter.on($items, 'click', function (e) {
        //$items.on('click',function(e){
            var modalList = _this.ws.modalList;
            var modalId = this.dataset.id;
            var modal, i = 0;
            var path = _this.screen.path;

            // 添加选中效果
            _this.$container.find('.selected').removeClass('selected');
            $(this).addClass('selected');

            for (; modal=modalList[i++];) {
                 if(modal.id === modalId) break;
            };

            _this.renderPath(modal);
            e.stopPropagation();
        });

        // drag drop events
        !this.ws.templateId && this.attachDragEvents( this.$container.find('.slider-item') );
    };

    LeftSliderPanel.prototype.attachDragEvents = function($items){
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
            if( (oEvent.pageY - offset.top) > sliderHeight/2 ) {
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

    LeftSliderPanel.prototype.close = function () {
        this.$itemCtn.empty();
        // 置空 workspace name
        this.$divWsName.text('');
        // 隐藏 slider 工具栏
        this.$panelHead.children().hide();
        // 隐藏底部工具栏
        this.$btnGroup.hide();
        // 去除容器的 readonly 样式类
        this.$container.removeClass('panel-readonly');
    };

    LeftSliderPanel.prototype.renderPath = function(modal){
        var path = this.screen.path;
        if(path[path.length-1].isSlider) {
            path.splice(path.length-1, 1, {
                isSlider: true,
                type: modal.type || 'AnalysisTemplate',
                title: modal.name || 'Untitled',
                data: modal
            });
        } else {
            path.push({
                isSlider: true,
                type: modal.type || 'AnalysisTemplate',
                title: modal.name || 'Untitled',
                data: modal
            });
        }
    };

    return LeftSliderPanel;

} (window, jQuery, window.analysis.models.ModalModel) );