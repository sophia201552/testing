;(function (exports, FactoryTplScreen) {

    var clickTimer = null;
    var CLICK_DELAY = 500;

    function TemplateList(container) {
        this.close();

        this.store = {};
        this.container = container;
    }

    +function () {

        this.tplItemTpl = '<div class="tpl-item" data-id="{_id}" data-type="{type}"><span class="glyphicon glyphicon-file"></span>\
        <span class="tpl-item-name" title="{name}">{name}</span></div>';

        this.show = function () {
            this.render();
        };

        this.render = function () {
            // 显示报表级别模板
            this.addTplPanel('report', '报表模板');
        };

        this.addTplPanel = function (type, title) {
            var wrapTpl = '<div class="panel-heading">'+title+'\
            <span class="glyphicon glyphicon-plus-sign btn-add-tpl" title="新增"></span>\
            <span class="glyphicon glyphicon-remove-sign btn-remove-tpl" title="删除"></span>\
            </div><div class="panel-body">{items}</div>';
            var arrHtml = [];

            this.__loadData(type).done(function (rs) {
                var domWrap;
                rs.forEach(function (row) {
                    arrHtml.push(this.tplItemTpl.formatEL(row));
                }.bind(this));

                domWrap = document.createElement('div');
                domWrap.className = 'panel panel-default tpl-panel';
                domWrap.id = type + 'TplPanel';
                domWrap.dataset.type = type;

                domWrap.innerHTML = wrapTpl.formatEL({
                    items: arrHtml.join(''),
                    type: type
                });

                this.container.appendChild(domWrap);
                this.attachEvents();
            }.bind(this));
        };

        this.__loadData = function (type) {
            return WebAPI.get('/factory/material/get/'+type).then(function (rs) {
                return this.store[type] = rs;
            }.bind(this));
        };

        this.attachEvents = function () {
            var _this = this;
            var $container = $(this.container);
            var $tplPanel = $('.tpl-panel', $container);

            $tplPanel.find('.btn-add-tpl').off().on('click', function (e) {
                var type = $(this).closest('.tpl-panel')[0].dataset.type;
                _this.addTplItem(type);
            });

            $tplPanel.find('.btn-remove-tpl').off().on('click', function (e) {
                var $item = $tplPanel.find('.tpl-item.on');

                if ($item.length <= 0) {
                    alert('请选择一个模板！');
                    return;
                }
                $item.remove();
                WebAPI.post('/factory/material/remove', {
                    ids: [$item[0].dataset.id]
                }).done(function (rs) {
                    if (rs.status === 'OK') {
                        alert('删除成功！');
                    }
                });
            });

            $tplPanel.on('click', '.tpl-item', function (e) {
                var $this = $(this);
                var ipt;

                if (!$this.hasClass('on')) {
                    $this.siblings('.tpl-item').removeClass('on');
                    $this.addClass('on');
                    clickTimer = window.setTimeout(function () {
                        window.clearTimeout(clickTimer);
                        clickTimer = null;
                    }, CLICK_DELAY);
                    return;
                }

                if (clickTimer) {
                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                    _this.showTemplateScreen({
                        id: this.dataset.id,
                        name: this.querySelector('.tpl-item-name').innerHTML
                    }, this.dataset.type);
                    return;
                }

                clickTimer = window.setTimeout(function () {
                    // 重命名
                    var $spName = $this.children('.tpl-item-name');
                    // rename 逻辑
                    ipt = document.createElement('input');
                    ipt.className = 'ipt-name-editor'
                    ipt.value = $spName.text();
                    ipt.onblur = function () {
                        var params = {};
                        // 如果名称有变动，或者是第一次新建，则进行更新
                        if (this.value !== $spName.text() || 
                            !$this[0].dataset.id) {
                            params = {
                                _id: $this[0].dataset.id,
                                name: this.value,
                                type: $this[0].dataset.type
                            };
                            _this.modifyTplItem(params);
                            $this[0].dataset.id = params._id;
                        }
                        $spName.text(this.value);
                        this.parentNode.removeChild(this);
                        $spName.show();
                    };
                    ipt.onkeyup = function (e) {
                        if (e.which === 13) {
                            this.blur();
                        }
                    };
                    ipt.onclick = function (e) {
                        e.stopPropagation();
                    };

                    $spName.hide();
                    $this.append(ipt);
                    ipt.focus();

                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                }, CLICK_DELAY);
            });

        };

        this.addTplItem = function (type, data) {
            var domPanel = this.container.querySelector('#'+type+'TplPanel');
            var domItemCtn = domPanel.querySelector('.panel-body');
            var isNew = !data;

            // 如果 data 不存在，则进行新增操作
            if (!data) {
                data = {
                    _id: '',
                    name: '未命名',
                    type: type
                };
            }

            var $item = $(this.tplItemTpl.formatEL(data));
            domItemCtn.appendChild($item[0]);

            if (isNew) {
                // 让名称处于可编辑状态
                $('.tpl-item', domItemCtn).removeClass('on');
                $item.addClass('on');
                $item.trigger('click');
            }
        };

        this.modifyTplItem = function (data) {
            var id;
            if (!data._id) {
                data._id = ObjectId();
                data.content = { layouts: [] }
                return WebAPI.post('/factory/material/save', data);
            }
            return WebAPI.post('/factory/material/edit', data);
        };

        this.showTemplateScreen = function (params, type) {

            $('#modalframe').hide();
                I18n.fillArea($('#mainframe').fadeIn());

            if (type === 'report') {
                new FactoryTplScreen().show(params, type);
            }
        };

        this.close = function () {
            this.container = null;
            this.store = null;

            window.onkeyup = null;
        };

    }.call(TemplateList.prototype);

    exports.TemplateList = TemplateList;

} ( namespace('factory.components'), namespace('factory.FactoryTplScreen') ));