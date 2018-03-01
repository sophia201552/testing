;(function (exports) {

    var MODE_HTML = 'html';
    var MODE_CSS = 'css';
    var MODE_JS = 'js';

    function DeclareVariablesModal() {
        this.$modalWrap = null;

        this.modes = [];
        this.callback = null;
    }

    +function () {
        // 显示组件
        this.show = function (data, callback, modes) {
            var _this = this;
            var promise = $.Deferred();

            data = data || {};
            this.modes = modes || [MODE_HTML, MODE_CSS, MODE_JS];
            this.callback = callback;

            // 如果之前实例化过，直接 append 到页面上
            if (this.$modalWrap) {
                this.$modalWrap.appendTo(document.body);
                promise.resolve();
            } else {
                 // 如果没有实例化过，则进行实例化操作
                WebAPI.get('/static/app/WebFactory/scripts/screens/report/modals/declareVariablesModal/declareVariablesModal.html')
                .done(function (html) {
                    _this.init(html);
                    promise.resolve();
                });
            }

            promise.done(function () {
                _this.$declareVariables.css('display','block');
                // 初始化编辑器
                _this.initEditor(data);
            });
        };

        // 组件初始化
        this.init = function (html) {
            var element = HTMLParser(html);
            
            this.$modalWrap = $(element);
            this.$declareVariables = $('#declareVariables', this.$modalWrap);
            //数据源的表格
            this.$dataSourceTable = $('#dataSourceTable', this.$modalWrap);
            this.$tbody = $('tbody', this.$dataSourceTable);
            // this.$names = $('.name', this.$dataSourceTable);
            // this.$values = $('.value', this.$dataSourceTable);
            //jsCode
            this.$jsCode = $('.jsCode', this.$modalWrap);
            // 关闭按钮
            this.$btnClose = $('.close', this.$modalWrap);
            // 保存并退出按钮
            this.$btnSaveAndExit = $('.btn-submit', this.$modalWrap);

            this.$modalWrap.appendTo('body');
            I18n.fillArea(this.$modalWrap);

            // 绑定 modal 事件
            this.attachEvents();
        };

        this.initEditor = function (data) {
            var options = {
                lineNumbers: true,
                extraKeys: {
                    Tab: function(cm) {
                        if (cm.getSelection().length) {
                            CodeMirror.commands.indentMore(cm);
                        } else {
                            cm.replaceSelection("  ");
                        }
                    }
                }
            }
            // 初始化布局
            this.initLayout(data);
        };

        // 初始化布局
        this.initLayout = function (data) {
            var _this = this;
            if(data.js === ""){
                this.$tbody.html("");
                this.add();
            }else{
                var dataObj;
                try {
                    dataObj = new Function('return ' + data.js)();
                    _this.$tbody.html("");
                    $.each(dataObj,function(key,value){
                        _this.add(key,value);
                    })
                    this.$tbody.find("tr").each(function(){
                        var index = _this.$tbody.find("tr").index($(this));
                        if(index !== _this.$tbody.find("tr").length-1){
                            $(this).find(".addMinusBtn").removeClass("add").addClass("minus");
                            $(this).find("span").removeClass().addClass("glyphicon glyphicon-minus");
                        }
                    })
                } catch(e) {
                    alert(I18n.resource.report.VAR_DECLARATION_INFO);
                }
            }
        };
        this.add = function(key,value){
            var key = key === undefined?"":key;
            var value = value === undefined?"":value;
            var str = '<tr>\
                            <td>\
                                <input type="text" class="form-control name" value="'+key+'">\
                            </td>\
                            <td>\
                                <input type="text" class="form-control value" value="'+value+'">\
                            </td>\
                            <td class="addMinusBtn add">\
                                <span class="glyphicon glyphicon-plus"></span>\
                            </td>\
                        </tr>';
            this.$tbody.append($(str));
        };
        // 绑定事件
        this.attachEvents = function () {
            var _this = this;
            //名字 去重
            this.$tbody.off("blur").on("blur",".name",function(){
                var $names = _this.$tbody.find(".name");
                var name = $(this).val();
                var index = $names.index($(this));
                if(index === $names.length-1){
                    $names.each(function(i,$name) {
                        if(i !== $names.length-1){
                            if($name.value === name){
                                alert("名字重复")
                            }
                        }
                    })
                }
            });
            //js代码编辑
            this.$jsCode.off('click').on('click', function () {
                CodeEditorModal.show({
                    js: _this.getJsCode() || ''
                }, function (code) {
                    $("#codeEditorModalWrap").detach();
                    _this.initLayout(code);
                }, ['js']);
            });
            //加号 点击事件
            this.$dataSourceTable.off('click.add').on('click.add', '.add', function () {
                var index = _this.$dataSourceTable.find(".addMinusBtn").index($(this));
                var name = _this.$dataSourceTable.find(".name").eq(index).val();
                var value = _this.$dataSourceTable.find(".value").eq(index).val();
                if(name !== ""){
                    $(this).find("span").removeClass().addClass("glyphicon glyphicon-minus");
                    $(this).removeClass("add").addClass("minus");
                    _this.add();
                }
            });
            //减号
            this.$dataSourceTable.off('click.minus').on('click.minus', '.minus', function () {
                var index = _this.$dataSourceTable.find(".addMinusBtn").index($(this));
                _this.$tbody.find("tr").eq(index).detach();
            });
            // 关闭按钮事件
            this.$btnClose.off('click').on('click', function () {
                _this.hide();
            });
            //保存确认
            this.$btnSaveAndExit.off('click').on('click', function () {
                typeof _this.callback === 'function' && _this.callback(_this.getCode());
                _this.hide();
            });
        };

        this.getCode = function () {
            return {
                js: this.getJsCode()
            }
        };

        this.getJsCode = function () {
            var _this = this;
            this.$names = this.$tbody.find(".name");
            this.$values = this.$tbody.find(".value");
            if(this.$names.length !== 0){
                if(this.$names.length === 1 && this.$names.eq(0).val() === ""){
                    return '';
                }else{
                    var str = '{';
                    var valuable = [];
                    this.$names.each(function(i,$name){
                        if($name.value !== ""){
                            valuable.push(i);
                        }
                    })
                    for(var k=0,length=valuable.length;k<length;k++){
                        if(k === valuable.length-1){
                            str += _this.$names[k].value+':"'+_this.$values[k].value+'"}';
                        }else{
                            str += _this.$names[k].value+':"'+_this.$values[k].value+'",';
                        }    
                    }
                    
                    return str;
                }
            }
            return '';
        };

        // 组件状态还原
        this.reset = function () {
            // 重置回调函数
            this.callback = null;
        };

        // 隐藏组件
        this.hide = function () {
            if (this.$modalWrap) {
                this.reset();
                this.$modalWrap.detach();
            }
        };

    }.call(DeclareVariablesModal.prototype);

    exports.DeclareVariablesModal = new DeclareVariablesModal();
} (window));