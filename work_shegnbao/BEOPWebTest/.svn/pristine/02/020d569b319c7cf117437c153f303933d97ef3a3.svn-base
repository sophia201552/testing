;(function (exports) {

    var paramType = {
        TEXT: {
            value: 0,
            name: 'Text'
        }
    };

    function ReportTplParamsPanel(screen, container) {
        this.screen = screen;
        this.container = container;
        this.$container = $(this.container);

        this.map = {};
        this.valMap = {};
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
                        <th class="pramName">参数名称</th>\
                        <th class="pramType">类型</th>\
                        <th class="pramValue">值</th>\
                    </tr>\
                </thead>\
                <tbody><tr><td colspan="3" class="pramNo">无参数</td></tr></tbody>\
                </table>';

            // 初始化按钮
            var btnsTpl = '<div class="tpl-params-btn-wrap">\
                <a href="javascript:;" id="lkRefreshTplParams"><span class="badge">刷新</span></a>\
                <a href="javascript:;" id="lkApplyTplParams"><span class="badge">应用</span></a>\
            </div>';

            this.container.innerHTML = btnsTpl + tableTpl;
            $('.pramName').text(I18n.resource.report.templateConfig.PRAM_NAME);
            $('.pramType').text(I18n.resource.report.templateConfig.PRAM_TYPE);
            $('.pramValue').text(I18n.resource.report.templateConfig.PRAM_VALUE);
            $('.pramNo').text(I18n.resource.report.templateConfig.NO_PRAM);
            $('#lkRefreshTplParams').find('.badge').text(I18n.resource.report.templateConfig.REFRESH);
            $('#lkApplyTplParams').find('.badge').text(I18n.resource.report.templateConfig.APPLY);

            this.$table = this.$container.children('.table');

            this.attachEvents();
        };

        this.render = (function () {

            function getSelectTpl(type) {
                return '<select>' +
                    Object.keys(paramType).map(function (key) {
                        if (type === paramType[key].value) {
                            return '<option value="{value}" selected>{name}</option><option value="1">Json</option>'.formatEL(paramType[key]);
                        } else {
                            return '<option value="{value}">{name}</option><option value="1">Json</option>'.formatEL(paramType[key]);
                        }
                    }) + '</select>';
            }

            function getRowTpl(type) {
                return '<tr>\
                        <td>{name}</td>\
                        <td>' + getSelectTpl(type) + '</td>\
                        <td>{value}</td>\
                    </tr>';
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
                    $('.iptPram').attr('placeholder', I18n.resource.report.templateConfig.WRITE_VALUE);
                } else {
                    $('tbody', this.$table).html('<tr><td colspan="3" class="pramNo">无参数</td></tr>');
                    $('.pramNo').text(I18n.resource.report.templateConfig.NO_PRAM);
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
                p[data.name] = _this.layoutName(data);
                _this.__setMap(p);
                e.stopPropagation();
            });
        };

        this.__setMap = function (params) {
            var _this = this;
            Object.keys(params).forEach(function (key) {
                _this.map[key].value = params[key];
            });
        };

        this.layoutName = function (data){
            var str = data.value.trim();
            str = str.replace((/([\w]+)(:)/g), "\"$1\"$2");//add "" before : if doesnt exist
            str = str.replace((/'/g), "\"");  //replace '' with ""
            if(str.split('[').length === 1 && str.split('{').length === 1){
                return str;
            }else{
                var arr = JSON.parse(str);
                if(Object.prototype.toString.call(arr) === "[object Array]"){
                    return arr;
                }else if(Object.prototype.toString.call(arr) === "[object Object]"){
                    var newArr = [];
                    var min = parseInt(arr["min"]);
                    var max = parseInt(arr["max"]);
                    var step = parseInt(arr["step"]) || 1;
                    for(var k = min; k <= max; k = k+step){
                        newArr.push(k);
                    }
                    return newArr;
                }
            }
        };

        this.__getValueTpl = function (name, type, value) {
            return '<input type="text" class="iptPram"  name="'+name+'" value="'+(value || '')+'" />';
        };

        this.refresh = function () {
            var _this = this;
            var params = this.screen.getTplParams();
            var map = {};

            params.forEach(function (row) {
                var name = row['name'];
                if ( _this.map.hasOwnProperty(name) ) {
                    map[name] = _this.map[name];
                } else {
                    map[name] = {
                        type: paramType.TEXT.value,
                        value: typeof row['value'] === 'undefined' ? '' : row['value']
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