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
            this.map = {};

            // 如果之前实例化过，直接 append 到页面上
            if (this.$modalWrap) {
                this.$modalWrap.appendTo(document.body);
                $('#declareVariables').modal('show');
                promise.resolve();
            } else {
                 // 如果没有实例化过，则进行实例化操作
                WebAPI.get('/static/app/WebFactory/scripts/screens/report/modals/declareVariablesModal/declareVariablesModal.html').done(function (html) {
                    _this.init(html);
                    $('#declareVariables').modal('show');
                    promise.resolve();
                });
            }

            promise.done(function () {
                var $panels = $('#panels');
                _this.$declareVariables.width($panels.width() - $panels.find('.splitter-container-horizontal').eq($panels.find('.splitter-container-horizontal').length-1).width());
                _this.$declareVariables.find('.modal-backdrop').width(_this.$declareVariables.width());
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
            this.$modalContent = $('.modal-body', this.$modalWrap);
            //jsCode
            this.$jsCode = $('.jsCode', this.$modalWrap);
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
            };
            // 初始化布局
            this.initLayout(data);
        };

        // 初始化布局
        this.initLayout = function (data){
            var _this = this;
            this.$modalContent.html("");
            var dataObj;
            try {
                var i = 0;
                if(typeof data.js === "string"){
                    dataObj = JSON.parse(data.js);
                    reader(dataObj,true);
                }else{
                    dataObj = data.js;
                    reader(dataObj);
                }
                function reader(arr,CodeEditor) {
                    if(arr instanceof Array){
                        $(_this.$modalWrap).find('.jsCode').hide();
                        arr.forEach(function (row) {
                            if (row instanceof Array) {
                                reader(row);
                                return;
                            }
                            // 渲染一个表格
                            _this.renderTable(row,i);
                            if(!CodeEditor){
                               _this.map[i] = row;
                            }
                            i += 1;
                        });
                    }else{
                        $(_this.$modalWrap).find('.jsCode').show();
                        _this.renderTable(arr);
                        if(!CodeEditor){
                            _this.map[0] = arr;
                        }
                    }
                }
            }catch(e) {
                alert(I18n.resource.report.VAR_DECLARATION_INFO);
            }
        };
        this.renderTable = function (data,i) {
            var table;
            var _this = this;
            var tpl;
            if(typeof i === "number"){
                tpl = '<table class="dataSourceTable" data-no = "'+ i +'"><caption>'+ data.title +'</caption>'+
                        '<thead><tr><th style="width:20%;">变量名</th><th>对应值</th><th>描述</th></tr></thead><tbody></tbody></table>';
            }else{
                tpl = '<table class="dataSourceTable"><thead><tr><th style="width:20%;">变量名</th><th>对应值</th><th>描述</th></tr></thead><tbody></tbody></table>';
            }
            table = HTMLParser(tpl.slice());
            this.$modalContent.append($(table));
            if(data.val && !$.isEmptyObject(data.val)){
                $.each(data.val,function(key,value){
                    _this.add($(table),key,value);
                });
                var $tbody = $(table).find('tbody');
                $(table).find("tr").each(function(){
                    var index = $tbody.find("tr").index($(this));
                    if(index !== $tbody.find("tr").length-1){
                        $(this).find(".addMinusBtn").removeClass("add").addClass("minus");
                        $(this).find("span").removeClass().addClass("glyphicon glyphicon-minus");
                    }
                });
            }else{
                this.add($(table));
            }
        };
        this.add = function($table,key,values){
            var key = key === undefined?"":key;
            var value;
            if(typeof values === "string" || typeof values === "number"){
                value = {
                    val: values.toString(),
                    descr: ''
                }
            }else if(typeof values === 'undefined'){
                value = {
                    val:'',
                    descr:''
                };
            }else{
                value = values;
            }
            var str = '<tr>\
                            <td>\
                                <input type="text" class="form-control name" value="'+key+'">\
                            </td>\
                            <td>\
                                <input type="text" class="form-control value" value="'+value.val+'">\
                            </td>\
                            <td>\
                                <input type="text" class="form-control descr" value="'+value.descr+'" placeholder="'+i18n_resource.report.VAR_DECLARATION_DESC_DETAIL+'">\
                            </td>\
                            <td class="addMinusBtn add">\
                                <span class="glyphicon glyphicon-plus"></span>\
                            </td>\
                        </tr>';
            $table.find('tbody').append($(str));
        };
        // 绑定事件
        this.attachEvents = function () {
            var _this = this;
            //名字 去重
            this.$modalContent.off("blur",".name").on("blur",".name",function(){
                var $table = $(this).closest('.dataSourceTable');
                var $names = $table.find(".name");
                var name = $(this).val();
                var index = $names.index($(this));
                if(index === $names.length-1){
                    $names.each(function(i,$name) {
                        if(i !== $names.length-1){
                            if($name.value === name){
                                alert("名字重复");
                                $name.value = '';
                            }
                        }
                    })
                }
            });
            //js代码编辑
            this.$jsCode.off('click').on('click', function () {
                var jsString;
                if(Object.keys(_this.getData()).length>1){
                    jsString= JSON.stringify([_this.getData()],null,2);
                }else{
                    jsString= JSON.stringify(_this.getData()[0],null,2);
                }
                CodeEditorModal.show({
                    js: jsString
                }, function (code) {
                    _this.initLayout(code);
                }, ['js']);
            });
            //加号 点击事件
            this.$modalContent.off('click.add').on('click.add', '.add', function () {
                var $table = $(this).closest('.dataSourceTable');
                var $curTr = $(this).closest('tr');
                var name = $curTr.find(".name").val();
                var value = $curTr.find(".value").val();
                if(name !== "" || value !== ""){
                    $(this).find("span").removeClass().addClass("glyphicon glyphicon-minus");
                    $(this).removeClass("add").addClass("minus");
                    _this.add($table);
                }
            });
            //减号
            this.$modalContent.off('click.minus').on('click.minus', '.minus', function () {
                var $curTr = $(this).closest('tr');
                $curTr.detach();
            });
            //保存确认
            this.$btnSaveAndExit.off('click').on('click', function () {
                typeof _this.callback === 'function' && _this.callback(_this.getData());
                $('#declareVariables').modal('hide');
            });
            //数据源拖拽
            this.$modalContent.off('drop','.value').on('drop','.value',function(e){
                var dragId = EventAdapter.getData().dsItemId;
                if (AppConfig.datasource.currentObj === 'cloud') {
                    var dragName = $('#tableDsCloud').find('tr[ptid="' + dragId + '"]').find('.tabColName').attr('data-value');
                    var currentId = $('#selectPrjName').find('option:selected').val();
                    if (currentId) {
                        dragName = '@' + currentId + '|' + dragName;
                    } else {
                        dragName = dragId;
                    }
                }else{
                    dragName = dragId;
                }
                $(this).val('<%'+dragName+'%>');
                e.preventDefault();
            });
            this.$modalContent.off('dragenter','.value').on('dragenter','.value',function(e){
                e.preventDefault();
            });
            this.$modalContent.off('dragover','.value').on('dragover','.value',function(e){
                e.preventDefault();
            });
        };

        this.getData = function () {
            var _this = this;
            var $table = $('.dataSourceTable');
            var name,value,descr;
            $table.each(function(){
                var row = $(this);
                var $trs = row.find('tbody').children('tr');
                var i = row.attr('data-no') || 0;
                if(_this.map[i].val){
                    Object.keys(_this.map[i].val).forEach(function(row){
                        delete _this.map[i].val[row];
                    });
                }
                $trs.each(function(){
                    var tr = $(this);
                    name = tr.find(".name").val();
                    value = tr.find(".value").val();
                    descr = tr.find(".descr").val();
                    if(value !== ''){
                        _this.map[i].val[name] = {};
                        _this.map[i].val[name]['val'] = value;
                        _this.map[i].val[name]['descr'] = descr;
                    }
                });
            });
            return this.map;
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