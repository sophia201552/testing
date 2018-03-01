;(function (exports) {

    var paramType = {
        TEXT: {
            value: 0,
            name: '文本'
        }
    };

    function ReportTplParamsPanel(screen, container) {
        this.screen = screen;
        this.container = container;
        this.$container = $(this.container);

        this.map = {};
    }

    +function () {

        this.show = function () {
            this.init();
        };

        this.init = function () {
            // 初始化表格
            var tableTpl = '<table class="table table-bordered">\
                <thead>\
                    <tr>\
                        <th>参数名称</th>\
                        <th>类型</th>\
                        <th>值</th>\
                    </tr>\
                </thead>\
                <tbody><tr><td colspan="3">无参数</td></tr></tbody>\
                </table>';

            // 初始化按钮
            var btnsTpl = '<div class="tpl-params-btn-wrap">\
                <a href="javascript:;" id="lkRefreshTplParams"><span class="badge">刷新</span></a>\
                <a href="javascript:;" id="lkApplyTplParams"><span class="badge">应用</span></a>\
            </div>';

            this.container.innerHTML = btnsTpl + tableTpl;

            this.$table = this.$container.children('.table');

            this.attachEvents();
        };

        this.render = (function () {

            function getSelectTpl(type) {
                return '<select>' +
                    Object.keys(paramType).map(function (key) {
                        if (type === paramType[key].value) {
                            return '<option value="{value}" selected>{name}</option>'.formatEL(paramType[key]);
                        } else {
                            return '<option value="{value}">{name}</option>'.formatEL(paramType[key]);
                        }
                    }) + '</select>';
            }

            function getRowTpl(type) {
                return '<tr>\
                        <td>{name}</td>\
                        <td>' + getSelectTpl(type) + '</td>\
                        <td>{value}<button type="button" class="btn btn-default" data-toggle="popover">察看</button></td>\
                    </tr>'
            }

            return function () {
                var _this = this;
                
                var items = Object.keys(this.map).map(function (p) {
                    var row = _this.map[p];

                    return getRowTpl(row.type).formatEL({
                        name: p,
                        value: _this.__getValueTpl(p, row.type, row.value)
                    });
                });

                if (items.length) {
                    $('tbody', this.$table).html(items);
                } else {
                    $('tbody', this.$table).html('<tr><td colspan="3">无参数</td></tr>');
                }
            }

        } ());

        this.attachEvents = function () {
            var _this = this;

            $('#lkRefreshTplParams', this.$container).on('click', function () {
                this.refresh();
            }.bind(this));
            
            $('#lkApplyTplParams', this.$container).on('click', function () {
                this.apply();
            }.bind(this));

            this.$table.on('blur', 'input', function (e) {
                var data = $(this).serializeArray()[0];
                var p = {};
                p[data.name] = data.value;
                
                _this.__setMap(p);
                e.stopPropagation();
            });
            
            // this.$table.on('click', 'button', function (e) {
            //     var value=$(this).prev('input').val();
            //     var $this = $(this);
            //     var options = {
            //         container: 'body',
            //         html:true,
            //         placement:'top'
            //     };
            //     $this.popover(options);
            //     $this.data('bs.popover').options.content = (value || '')+'<button>确定</button>';
            //     e.stopPropagation();
            // });
        };

        this.__setMap = function (params) {
            var _this = this;
            Object.keys(params).forEach(function (key) {
                _this.map[key].value = params[key];
            });
        };

        this.__getValueTpl = function (name, type, value) {
            return '<input type="text" placeholder="请填写值" name="'+name+'" value="'+(value || '')+'" />';
        };

        this.refresh = function () {
            var _this = this;
            var params = this.screen.getTplParams();
            var map = {};

            params.forEach(function (row) {
                if ( _this.map.hasOwnProperty(row) ) {
                    map[row] = _this.map[row];
                } else {
                    map[row] = {
                        type: paramType.TEXT.value,
                        value: ''
                    };
                }
                
            });

            // 更新参数表
            this.map = map;
            // 更新视图
            this.render();
        };

        this.__getTplParams = function () {
            var _this = this;
            var params = {};

            Object.keys(this.map).forEach(function (key) {
                params[key] = _this.map[key].value;
            });

            return params;
        };

        this.apply = function () {
            var params = this.__getTplParams();
            
            this.screen.applyTplParams(params);
        };

        this.close = function () {
            if (this.$container) {
                this.$container.empty();
            }
            this.screen = null;
            this.container = null;
            this.$container = null;

            this.map = null;

            this.$table = null;
            this.$form = null;
        };

    }.call(ReportTplParamsPanel.prototype);

    exports.ReportTplParamsPanel = ReportTplParamsPanel;

} ( namespace('factory.panels') ));