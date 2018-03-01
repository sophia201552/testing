/**
 * dashboard html 图元模块
 * @description 
 * 在这个图元中，可以使用正常的 html、css 和 js 功能，
 * 除此之外，还有自定义的标签可以使用
 * @history
 * 2015-08-07 新增自定义标签 <LinkTo />
 * 2015-08-06 新增自定义标签 <DataSource />
 * 2015-08-05 初版完成，提供执行 htlm、css 和 js 的功能
 * 细节更改见 SVN
 */
(function() {
    // 自定义标签集合
    var tags = {};
    // 在这里定义需要的自定义标签按钮
    // 需要/不需要 某个自定义标签，在这里直接 增加/删除 即可
    var TOOLBOX = ['DataSource', 'LinkTo'];
    var PATTERN_STR = '<('+TOOLBOX.join('|')+').*?(/|'+TOOLBOX.join('|')+')>';
    // 存储图元需要的数据
    window.__spring_html_modal = {};
    
    // 运行指定的 js 脚本
    function runScript(content) {
        var done = false;
        var script = document.createElement("script");
        var head = document.getElementsByTagName("head")[0];
        script.type = "text\/javascript";
        script.text = content;
        head.appendChild(script);
        head.removeChild(script);
    } 

    // 空标签，仅作继承用
    tags.Base = (function() {
        function Base(modal) {
            // 放 toolBtn 的容器
            this.$textarea = modal.$textarea;
            this.$modalCt  = modal.$modalCt;
            this.$toolBtn  = null;
            this.init();
        }

        Base.prototype.init = function() {
            throw new Error('init 方法未被实现，不可直接调用');
        };

        Base.prototype.render = function($container) {
            throw new Error('render 方法未被实现，不可直接调用');
        };

        return Base;
    }() );

    // DataSource 标签
    // 用法
    // <DataSource [AttributeName=Value][ ,AttributeName=Value] />
    // 属性
    // data-id: 数据源的 id
    tags.DataSource = (function() {
        var _this;
        // 自定义 DataSource
        function DataSource(modal) {
            _this = this;
            tags.Base.call(this, modal);
        }

        DataSource.prototype = Object.create(tags.Base.prototype);
        DataSource.prototype.constructor = DataSource;

        DataSource.prototype.insertTpl = '<DataSource data-id="{id}"{linkTo}/>';

        /*-- @override --*/
        DataSource.prototype.init = function() {
            var arrHtml = [];

            this.$toolBtn = $('<button type="button" class="btn btn-default" data-toggle="collapse" data-target="#panelDataSourceConfig" aria-expanded="false">\
                DataSource\
                </button>');
            this.$toolConfig = $('#panelDataSourceConfig', this.$modalCt);

        };

        /*-- @override --*/
        DataSource.prototype.render = function($btnCtn) {
            $btnCtn.append(this.$toolBtn);
            this.attachEvents();
        };

        DataSource.prototype.attachEvents = function() {
        };

        /*-- @static --*/
        DataSource.save = function(dataset, modal) {
            var id;
            if(!dataset) return;

            id = dataset.id;
            if( id && modal.points.indexOf(id) === -1 ) modal.points.push(id);
        };

        DataSource.getStaticRender = function(dom) {
            var dataset = dom.dataset;
            var menuId = dataset.linkTo;
            var $ele;
            if(menuId) {
                $ele = $('<a href="javascript:;" data-is="DataSource" data-id="'+dataset.id+'">Loading</a>');
                $ele.click(function(e) {
                    var $ev =  $('#ulPages [pageid="'+ menuId +'"]');
                    if($ev[0].className !== 'nav-btn-a'){
                        $ev = $ev.children('a');
                        $ev.closest('.dropdown').children('a').trigger('click');
                    }
                    $ev.trigger('click');
                });
                return $ele;
            }
            else return $('<span data-is="DataSource" data-id="'+dataset.id+'">Loading</span>');
        };

        DataSource.getRealTimeRender = function($ele, map) {
            var dataset = $ele[0].dataset;
            $ele.html( map[dataset.id] );
        };

        return DataSource;
    }() );

    tags.LinkTo = (function() {
        var _this;
        // 自定义标签 LinkTo
        function LinkTo(modal) {
            _this = this;
            tags.Base.call(this, modal);
        }

        LinkTo.prototype = Object.create(tags.Base.prototype);
        LinkTo.prototype.constructor = LinkTo;

        LinkTo.prototype.insertTpl = '<LinkTo data-id="{id}" ></LinkTo>';

        /*-- @override --*/
        LinkTo.prototype.init = function() {
            var arrHtml = [];

            this.$toolBtn = $('<button type="button" class="btn btn-default" data-parent="#collapseList" data-toggle="collapse" data-target="#panelLinkToConfig" aria-expanded="false">LinkTo</button>');
            this.$toolConfig = $('#panelLinkToConfig', this.$modalCt);
        };

        /*-- @override --*/
        LinkTo.prototype.render = function($btnCtn) {
            $btnCtn.append(this.$toolBtn);
            this.attachEvents();
        };

        LinkTo.prototype.attachEvents = function() {
        };

        /*-- @static --*/
        LinkTo.save = function(dataset, modal) {
            // 不需要做任何事
        };
        LinkTo.getStaticRender = function(dom, doc) {
            var dataset = dom.dataset;
            var menuId = dataset.id;

            doc = doc || window.document;
            $ele = $('<a href="javascript:;">'+(dom.innerHTML||'Link To')+'</a>', doc);
            $ele.click(function () {
                var $ev =  $('#ulPages [pageid="'+ menuId +'"]');
                if($ev[0].className !== 'nav-btn-a'){
                    $ev = $ev.children('a');
                    $ev.closest('.dropdown').children('a').trigger('click');
                }
                $ev.trigger('click');
            });
            return $ele;
        };

        return LinkTo;
    }() );

    /*--------------------------------
     * ModalHtml 图元配置类定义
     --------------------------------*/
    var ModalHtmlConfig = (function() {
        var _this;

        // 存储当前页面所有可链接的menu的html
        var gMenusHtml;

        function ModalHtmlConfig(options) {
            _this = this;

            ModalConfig.call(this, options);

            this.toolbox = [];
        }

        ModalHtmlConfig.prototype = Object.create(ModalConfig.prototype);
        ModalHtmlConfig.prototype.constructor = ModalHtmlConfig;

        ModalHtmlConfig.prototype.DEFAULTS = {
            htmlUrl: '/static/views/observer/widgets/modalHtmlConfig.html'
        };

        // @override
        ModalHtmlConfig.prototype.init = function() {
            this.$modal          = $('.modal', this.$wrap);
            this.$modalCt        = $('.modal-content', this.$wrap);
            this.$formWrap       = $('.form-wrap', this.$wrap);
            this.$dsGroupList    = $('.form-horizontal', '#panelDataSourceConfig');
            this.$linkGroupList  = $('.form-horizontal', '#panelLinkToConfig');
            this.$textarea       = $('.form-textarea', this.$formWrap);
            this.$btnSubmit      = $('.btn-submit', this.$wrap);
            this.$toolboxCtn     = $('.toolbox-ctn', this.$formWrap);
            
            this.$btnResizeFull  = $('.btn-resize-full', this.$wrap);
            this.$btnResizeSmall = $('.btn-resize-small', this.$wrap);

            this.attachEvents();

            // 初始化 toolbox
            this.initToolbox();
        };

        ModalHtmlConfig.prototype.initToolbox = function() {
            // 这里可以添加 分组逻辑
            var $toolboxGroup = $('<div class="btn-group" role="group">')
                .appendTo(this.$toolboxCtn);
            TOOLBOX.forEach(function(row) {
                var labelClass = tags[row];
                var labelIns;
                // 验证自定义标签类是否可用
                if (typeof labelClass !== 'function') {
                    console.warn('没有找到自定义标签: ' + row);
                    return;
                }

                labelIns = new labelClass(_this);
                labelIns.render($toolboxGroup);
            });

            var $tools = $('.btn', $toolboxGroup);
            $toolboxGroup.on('click', '.btn', function() {
                $(this).toggleClass('btn-primary');
            });
        };

        // @override
        ModalHtmlConfig.prototype.recoverForm = function(form) {
            var _this = this;
            var options;
            if(!form || !form.option) {
                // 额外新增一行空白行
                this.addDsFormGroup();
                return;
            }
            options = form.option;

            // 设置用户数据源配置
            var arrId = [];
            form.points.forEach(function (row) {
                arrId.push(row);
            });
            var arrItem = AppConfig.datasource.getDSItemById(arrId);
            form.points.forEach(function (row) {
                for (var m = 0; m < arrItem.length; m++) {
                    if (row == arrItem[m].id) {
                        var $ele = _this.addDsFormGroup({
                            id: row,
                            cls: ' dropped',
                            value: row,
                            name: arrItem[m].alias || '未找到名称',
                            display: 'inline'
                        });
                        break;
                    }
                }
            });
            // 额外新增一行空白行
            this.addDsFormGroup();

            // 设置 html 文本
            this._setField('textarea', this.$textarea, options.html);
        };

        // @override
        ModalHtmlConfig.prototype.reset = function () {
            this.$dsGroupList.empty();
            this._setField('textarea', this.$textarea);
        };

        ModalHtmlConfig.prototype.addDsFormGroup = function (data) {
            if(data === undefined) {
                data = {
                    id: '引用变量名',
                    cls: '',
                    value: '',
                    name: '<span class="glyphicon glyphicon-plus"></span>'
                }
            }
            return $('<div class="form-group{cls}">\
                <label class="col-md-2 control-label" for="">Point</label>\
                <div class="col-md-4">\
                    <div class="label-area div-ds-id">{id}</div>\
                </div>\
                <div class="col-md-4">\
                    <div class="drop-area div-ds-point" data-value="{value}">\
                        {name}\
                    </div>\
                </div>\
                <div class="col-md-2">\
                    <div class="opt-icon-area">\
                        <span class="glyphicon glyphicon-remove"></span>\
                    </div>\
                </div>\
            </div>'.formatEL(data)).appendTo(_this.$dsGroupList);
        };

        ModalHtmlConfig.prototype.initLinkFormGroup = function () {
            var arrHtml = [];
            // 填充 "链接到" 列表
            for (var i in AppConfig.menu) {
                if (!AppConfig.menu.hasOwnProperty(i)) continue;
                
                arrHtml.push('<div class="form-group">\
                    <label class="col-md-2 control-label" for="">Link</label>\
                    <div class="col-md-4">\
                        <div class="label-area">{id}</div>\
                    </div>\
                    <div class="col-md-4"><div class="label-area">{name}</div></div>\
                </div>'.formatEL({
                    id: i,
                    name: AppConfig.menu[i]
                }));
            }

            return this.$linkGroupList.html(arrHtml.join(''));
        };

        ModalHtmlConfig.prototype.attachEvents = function () {
            var _this = this;

            ///////////////////////
            // modal show EVENTS //
            ///////////////////////
            this.$modal.on('show.bs.modal', function () {
                _this.initLinkFormGroup();
            });

            /////////////////
            // drop EVENTS //
            /////////////////
            this.$wrap.on('drop', '.drop-area', function (e, isNotShowMsg) {
                var $this = $(this);
                var dsId = $this[0].dataset.value;
                var $formGroup = $this.closest('.form-group');

                if (_this.$dsGroupList.find('[data-value="'+dsId+'"]').length > 1) {
                    _this._setField('droparea', $formGroup.find('.drop-area'));
                    if(!isNotShowMsg){
                       alert('该数据源已存在于列表中！');
                    }
                    return false;
                } else {
                    // 显示删除按钮
                    $formGroup.addClass('dropped');
                    // 显示引用变量名
                    $formGroup.find('.label-area').text(dsId);
                }

                _this.addDsFormGroup();

                e.stopPropagation();
            });

            //////////////////////////////
            // datasource delete EVENTS //
            //////////////////////////////
            this.$wrap.on('click', '.opt-icon-area', function (e) {
                $(this).closest('.form-group').remove();
            });

            ///////////////////
            // resize EVENTS //
            ///////////////////
            this.$btnResizeFull.off().click(function() {
                var height = _this.$modal.height();
                _this.$modal.addClass('maxium-screen');
                _this.$textarea.height(height-208);
            });

            this.$btnResizeSmall.off().click(function() {
                _this.$modal.removeClass('maxium-screen');
                _this.$textarea.height('auto');
            });

            ///////////////////
            // submit EVENTS //
            ///////////////////
            this.$btnSubmit.off().click( function(e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};
                var html;
                var toolboxStr, pattern, match;

                html = form.html = _this.$textarea.val();

                // 初始化 points
                modal.points = [];

                // 获取用户配置的数据源 id 列表
                _this.$dsGroupList.find('.dropped .drop-area').each(function () {
                    modal.points.push($(this)[0].dataset.value);
                });

                // 开始对文本进行处理
                // 复杂的逻辑要开始了 w(ﾟДﾟ)w 伸爪
                // 匹配自定义标签
                toolboxStr = TOOLBOX.join('|');
                // 该正则表达式存在的问题
                // 1、未处理空格
                // 2、会出现自定义标签的穿插匹配，如匹配到 <custom1></custom2>
                // 3、欢迎补充
                pattern = new RegExp(PATTERN_STR, 'ig');
                while ( (match = pattern.exec(html)) !== null ) {
                    // match[0] - tagStr
                    // match[1] - tagName
                    try {
                        // 如果匹配到了自定义标签
                        var dom = $(match[0])[0];
                    } catch(e) {
                        // 如果不是一个合法的自定义标签
                        // 则不处理
                        continue;
                    }

                    // 自定义标签的 save 行为处理
                    tags[match[1]].save(dom.dataset, modal);
                }

                // 以上是老版本的数据源提取逻辑，下面是新版本的数据源提取逻辑
                // 为 <%数据源id%> 的形式添加数据源提取逻辑
                pattern = new RegExp('<%([^,<>%]+).*?%>', 'mg');
                while ( (match = pattern.exec(html)) !== null ) {
                    if (modal.points.indexOf(match[1]) === -1) {
                        modal.points.push(match[1]);
                    }
                }

                // save to modal
                modal.option = form;
                modal.dsChartCog = [{accuracy: 2}];
                modal.interval = 60000;

                // close modal
                _this.$modal.modal('hide');
                // preview the modification
                modalIns.preview();

                e.preventDefault();
            } );

            this.$textarea[0].addEventListener("dragover", function(event) {
                event.preventDefault();
            });
            this.$textarea[0].addEventListener("drop", function(event) {
                event.preventDefault();
                var text = '<%' + EventAdapter.getData().dsItemId + '%>';
                insertText(event.target, text);
                _this.$wrap.find('.drop-area[data-value=""]').trigger('drop', true);
            });

            //在光标位置插入拖入的数据源
            function insertText(obj,str) {
                if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                    var startPos = obj.selectionStart,
                        endPos = obj.selectionEnd,
                        cursorPos = startPos,
                        tmpStr = obj.value;
                    obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                    cursorPos += str.length;
                    obj.selectionStart = obj.selectionEnd = cursorPos;
                } else {
                    obj.value += str;
                }
            }

        };

        return ModalHtmlConfig;
    } ());

    /*--------------------------------
     * ModalHtml 图元类定义
     --------------------------------*/
    this.ModalHtml = (function() {
        function ModalHtml(screen, entityParams) {
            ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
            // 用于使 update 方法始终运行于 render 之后
            // firstUpdateData 用于存储第一次 update 时，传递过来的数据（如果 update 先执行的话）
            this.promise = $.Deferred();
            this.firstUpdateData = null;
            // 用于记录上一次的更新时间
            this.lastUpdateTimeTick = null;
            // 自定义标签 map
            // 例：{'DataSource': ..., 'LinkTo': ...}
            this.customTags = {};

            this.initCustomVaribles();
        }

        ModalHtml.prototype = Object.create(ModalBase.prototype);
        ModalHtml.prototype.constructor = ModalHtml;

        ModalHtml.prototype.optionTemplate = {
            name:'toolBox.modal.MODAL_HTML',
            parent:0,
            mode:'custom',
            maxNum: 10,
            title:'',
            minHeight:1,
            minWidth:2,
            maxHeight:6,
            maxWidth:12,
            type:'ModalHtml'
        };

        ModalHtml.prototype.initCustomVaribles = function () {
            var container = this.container;
            var screen;
            // 自定义回调事件
            window.__spring_html_modal[this.entity.id] = this.customVaribles = {};
            // 初始化一些自定义变量
            this.customVaribles.dataMap = {};
            // 点击的data-link-params的值保存到this.customVaribles
            var arrParams = window.location.hash.split('&');
            if(arrParams && arrParams.length> 0){//arrParams.indexOf('response=') > -1
                for(var i = 0; i < arrParams.length; i++){
                    if(arrParams[i].indexOf('response=') > -1){
                        this.customVaribles.dataParams = arrParams[i];
                    }
                }
            }
            // 初始化一些内置方法
            // linkTo: 跳转到指定页面
            this.customVaribles.linkTo = function (menuId, ctnSelector, linkType, linkName, linkParams) {
                var $ev, ctn;

                // 兼容以往的跳转方式
                if (!ctnSelector && !linkType) {
                    $ev =  $('#ulPages [pageid="'+ menuId +'"]');
                    if ($ev.length > 0) {
                        if ($ev[0].className !== 'nav-btn-a'){
                            $ev = $ev.children('a');
                            $ev.closest('.dropdown').children('a').trigger('click');
                        }
                        $ev.trigger('click');
                        if(linkParams){
                            window.location.hash = window.location.hash + '&response=' + linkParams;
                        }
                        return;
                    }
                }

                // 如果是链接到容器
                if(ctnSelector) {
                    // 如果需要限制为在本容器中查找，写成如下方式即可
                    // container.querySelector(ctnSelector);
                    ctn = document.querySelector(ctnSelector);
                    // 不存在此容器，不做任何事
                    if(!ctn) return;

                    // 初始化 dashboard
                    ctn.innerHTML = '';
                    if(screen) {
                        screen.close();
                        screen = null;
                    }
                }

                linkType = linkType || 'EnergyScreen';
                switch(linkType) {
                    case 'EnergyScreen_M':
                    case 'EnergyScreen':
                        if(!ctn) {
                            if(!AppConfig.isMobile) {
                                ScreenManager.show(EnergyScreen, menuId);
                            }else{
                                var isIndex = linkType == 'EnergyScreen_M';
                                router.to({
                                    typeClass: ProjectDashboard,
                                    data: {
                                        menuId:menuId,
                                        isIndex:isIndex,
                                        name:linkName
                                    }
                                })
                            }
                        } else {
                            screen = new EnergyScreen();
                            screen.id = menuId;
                            screen.container = ctn;
                            screen.isForBencMark = true;
                            screen.init();
                        }
                        break;
                    case 'ObserverScreen':
                        if(!ctn) {
                            ScreenManager.show(ObserverScreen, menuId);
                        } else {
                            screen = new ObserverScreen(menuId);
                            ctn.innerHTML = '<div class="divMain" style="width: 100%; height: 100%;">\
                                    <div class="div-canvas-ctn" style="padding: 0; margin: 0 auto; height: 100%; width: 100%;">\
                                        <canvas class="canvas-ctn" style="width: 100%; height: 100%;">浏览器不支持</canvas>\
                                    </div>\
                                    <div id="divObserverTools" style="height: 0"></div>\
                                </div>';
                            screen.isInDashBoard = true;
                            screen.show(ctn);
                        }
                        break;
                    // 不识别的类型不做处理
                    default: return;
                }
            };
        };

        ModalHtml.prototype.initCustomTags = function(doc) {
            var _this = this;
            doc = doc || document;
            // 处理自定义标签
            TOOLBOX.forEach(function(row, i) {
                var $tagEle = $(row, doc);
                var thisTags = [];
                var staticHtmlRender;

                if(!$tagEle.length) return;
                if( typeof (staticHtmlRender = tags[row].getStaticRender) !== 'function' ) return;

                ([]).forEach.call($tagEle, function(rowt, t) {
                    var $rs = staticHtmlRender(rowt);
                    if(!$rs) return;
                    thisTags.push($rs);
                    $(rowt).replaceWith($rs);
                });

                if(thisTags.length) _this.customTags[row] = thisTags;
            });
        };

        ModalHtml.prototype.initCustomAttrs = function () {
            var _this = this;
            var $container = $(this.container);
            var energyScreen;

            $container.on('click', '[data-link-to]', function (e) {
                var linkType = this.dataset['linkType'];
                var ctnSelector = this.dataset['linkTarget'];
                var menuId = this.dataset['linkTo'];
                var linkName = this.dataset['linkName'];
                var linkParams = this.dataset['linkParams'];
                try{
                    linkParams = JSON.parse(linkParams);
                }catch (e){}
                // 跳转
                _this.customVaribles.linkTo(menuId, ctnSelector, linkType, linkName, linkParams);
                e.preventDefault();
            });
        };

        ModalHtml.prototype._formatNumber = function (num, optionStr) {
            var rs = '';
            var toString = Object.prototype.toString;
            var decimalPortion;
            var numstr, isNegative;
            var options = (function () {
                var arr = optionStr.split(',');
                var opt = {};

                arr.forEach(function (kv) {
                    var kvArr = kv.split('=');
                    if( kvArr.length === 1 ) {
                        opt[kv] = 'true';
                    } else {
                        opt[kvArr[0]] = kvArr[1];
                    }
                });

                return opt;
            } ());

            if( isNaN(num) ) return num;
            num = parseFloat(num);
            isNegative = num < 0;
            // 去除负号
            num = Math.abs(num);

            // 处理小数精度
            if( !isNaN(options.p) ) {
                options.p = parseInt(options.p);
                num = num.toFixed(options.p);
            }

            // 小数部分不考虑
            decimalPortion = (num + '').split('.')[1] || '';
            num = parseInt(num);

            // 处理千分位字符
            if(options.ts === 'true') {
                numstr = num + '';
                while( numstr.length > 3 ) {
                    rs = ',' + numstr.substr(-3, 3) + rs;
                    numstr = numstr.substr(0, numstr.length - 3);
                }
                rs = numstr + rs;
            } else {
                rs = num + '';
            }

            rs = decimalPortion === '' ? rs : (rs + '.' + decimalPortion);
            // 结果为0，不管是否负数，不需要返回负号
            if (parseFloat(rs) === 0) { return rs; }

            // 处理负号
            return (isNegative ? '-' : '') + rs;
        };

        ModalHtml.prototype.buildDsBinding = function() {
            var _this = this;
            var dataMap = this.customVaribles.dataMap = {};
            var $container = $(this.container);
            var ds = dataMap;
            var textNodeMap = {}, attrNodeMap = {};
            var dsNameList = this.entity.modal.points;
            var $textNodes = $container.find('.text-node-placeholder');
            var $attrNodes = $container.find('[data-inner-ds-info]');

            dsNameList.forEach(function(name) {
                var $nodes;

                /** 数据源在文本节点中使用 */
                if( ($nodes = $textNodes.filter('[data-name^="'+name+'"]')).length ) {
                    $nodes.each(function () {
                        var text = document.createTextNode('');
                        if(!textNodeMap[name]) {
                            textNodeMap[name] = [{
                                name: this.getAttribute('data-name'),
                                node: text
                            }];   
                        } else {
                            textNodeMap[name].push({
                                name: this.getAttribute('data-name'),
                                node: text
                            });
                        }
                        this.parentNode.replaceChild(text, this);
                    });
                } else {
                    textNodeMap[name] = [];
                }

                /** 数据源在属性节点中使用 */
                if( ($nodes = $attrNodes.filter('[data-inner-ds-info*="'+name+'"]')).length ) {
                    $nodes.each(function () {
                        var $this = $(this);
                        var attr = $this.data('ds.attr');
                        var info = $this.data('ds.info');

                        if(attr === undefined) {
                            $this.data('ds.attr', (attr = this.getAttribute('data-inner-ds-attr')) );
                        }
                        if(info === undefined) {
                            info = window.decodeURIComponent(this.getAttribute('data-inner-ds-info') );
                            $this.data('ds.info', (info = JSON.parse(info)) );
                        }

                        if(!attrNodeMap[name]) {
                            attrNodeMap[name] = [{
                                node: this.getAttributeNode(attr),
                                info: info
                            }]
                        } else {
                            attrNodeMap[name].push({
                                node: this.getAttributeNode(attr),
                                info: info
                            });
                        }
                    });
                } else {
                    attrNodeMap[name] = [];
                }

                if(!ds.__observerProps) ds.__observerProps = {};
                if(!ds.__observerProps.hasOwnProperty(name)) {
                    ds.__observerProps[name] = null;
                    Object.defineProperty(ds, name, {
                        get: function () {
                            return this.__observerProps[name];
                        },
                        set: function (value) {
                            if(value === this.__observerProps[name]) return;
                            this.__observerProps[name] = value;
                            // 更新对应的 text node
                            textNodeMap[name].forEach(function (row) {
                                var content = row.name;
                                var node = row.node;
                                var idx = content.indexOf(',');

                                if(idx > -1) {
                                    row.node.data = _this._formatNumber(value, content.substr(idx+1));
                                } else {
                                    row.node.data =  isNaN(value) ? value : parseFloat(value).toString();
                                }

                            });
                            attrNodeMap[name].forEach(function (row) {
                                var info = row.info;
                                var str = '';
                                info.forEach(function (row) {
                                    var idx;
                                    if(row.type === TextTemplateParser.types.text) {
                                        str += row.value;
                                    } else if(row.type === TextTemplateParser.types.binding) {
                                        if( row.value.indexOf(name) > -1 ) {
                                            idx = row.value.indexOf(',');
                                            if(idx > -1) {
                                                row.content = _this._formatNumber(value, row.value.substr(idx+1));
                                            } else {
                                                row.content = isNaN(value) ? value : parseFloat(value).toString();
                                            }
                                        }
                                        str += row.content;
                                    }
                                });
                                row.node.value = str;
                            });
                        }
                    });
                }
            });

            // 删除不需要的属性
            $attrNodes.each(function () {
                this.removeAttribute('data-inner-ds-info');
                this.removeAttribute('data-inner-ds-attr');
            });
        };


        // 需要实例化的接口
        ModalHtml.prototype.renderModal = function() {
            var _this = this;
            var options = this.entity.modal.option;
            var info;
            var parser = TextTemplateParser;

            if(!options) {
                $(this.container).html('');
                this.spinner.stop();
                return;
            }
            info = this.getFormatHtml(options.html);

            // $0: 属性+值
            // $1: 属性名
            // $2: 属性值
            info.html = info.html.replace(/([\w-]+?)="([^"]*<%.+?%>[^"]*)"/mg, function ($0, $1, $2) {
                var tokens = parser.parse($2, ['<%', '%>']);
                var infoStr;
                tokens.forEach(function (row) {
                    if(row.type === parser.types.binding) {
                        row.content = '';
                    }
                });
                infoStr = window.encodeURIComponent(JSON.stringify(tokens));

                return $1+'="" data-inner-ds-info="'+infoStr+'" data-inner-ds-attr="'+$1+'"';
            });
            // 整理出数据源的数据
            info.html = info.html.replace(/<%(.+?)%>/mg, function($0, $1) {
                return '<span class="text-node-placeholder" data-name="'+$1+'">'+$1+'</span>';
            });

            $(this.container).html( info.html );
            runScript(info.scriptContent);

            // 初始化自定义标签
            _this.initCustomTags();
            _this.initCustomAttrs();
            _this.buildDsBinding();

            // onRenderComplete
            if( typeof _this.customVaribles.onRenderComplete === 'function' ) {
                _this.customVaribles.onRenderComplete.call(null);
            }

            // 开始执行 update 方法
            _this.promise.done(function(data) {
                if(!data) return;
                _this.updateModal(data);
            });
            _this.promise.resolve(_this.firstUpdateData);

            _this.spinner.stop();
        };

        // 需要实例化的接口
        ModalHtml.prototype.updateModal = function(data) {
            var _this = this;
            var modal, updateInterval, options, now;
            var thisTags;
            var dataMap = this.customVaribles.dataMap;
            var customEventHandlers;
            
            // 如果 render 方法没有执行完，则不执行
            if( this.promise.state() === 'pending') {
                this.firstUpdateData = data;
                return;
            }

            modal = this.entity.modal;
            updateInterval = modal.interval;
            options = this.entity.options;
            nowTick = new Date().valueOf();
            
            // 判断是否到达更新时间
            if( this.lastUpdateTimeTick && (nowTick - this.lastUpdateTimeTick) < updateInterval ) return;
            this.lastUpdateTimeTick = nowTick;

            // 将 data 转换成 map 格式
            data.forEach(function(row) {
                dataMap[row.dsItemId] = row.data;
            });

            // 开始更新自定义标签
            for(var tagName in this.customTags) {
                if( !this.customTags.hasOwnProperty(tagName) ) continue;
                thisTags = this.customTags[tagName];

                thisTags.forEach(function($row, i) {
                    var handler = tags[tagName].getRealTimeRender;
                    if( typeof handler !== 'function' ) return;
                    handler($row, dataMap);
                });
            }

            // 回调处理
            // onUpdateComplete
            if( typeof this.customVaribles.onUpdateComplete === 'function' ) {
                this.customVaribles.onUpdateComplete.call(null, dataMap);
            }

        };

        // 需要实例化的接口
        ModalHtml.prototype.showConfigMode = function() {};

        ModalHtml.prototype.showConfigModal = function(container, options) {
            this.configModal.setOptions({modalIns: this});
            this.configModal.show();
        };
        
        // 放在 prototype 中的原因是：所有的同类型模块公用一个配置模块
        ModalHtml.prototype.configModal = new ModalHtmlConfig();

        ModalHtml.prototype.getFormatHtml = function(html) {
            var _this = this;
            var patternScript = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/img;
            // var patternStyle = /<style\b[^>]*>([\s\S]*?)<\/style>/img;
            // var patternLink = /<link\b[^>]*?>/img;
            var scriptContent = [];
            // var styleTags = [];
            // var linkTags = [];

            var wrapTpl = '(function() { |code| }).call(window.__spring_html_modal[\''+_this.entity.id+'\'])';
            // script 标签处理
            var formatHtml = html.replace(patternScript, function($0, $1, $2, $3) {
                if( $2.trim() !== '') scriptContent.push( $2 );
                return '';
            });

            return {
                scriptContent: wrapTpl.replace( '|code|', scriptContent.join(';\n') ),
                html: formatHtml
            }
            // style 标签处理
            // html.replace(patternStyle, function($0, $1) {
            //     styleTags.push();
            //     return '';
            // });
        };

        ModalHtml.prototype.preview = function () {};

        ModalHtml.prototype.close = function() {};

        return ModalHtml;
    }());

    var TextTemplateParser = (function() {
        function TextTemplateParser() {}

        TextTemplateParser.types = {
            text: 0,
            binding: 1
        };

        TextTemplateParser.parse = function(template, delimiters) {
            var index, lastIndex, lastToken, length, substring, tokens, value;
            tokens = [];
            length = template.length;
            index = lastIndex = 0;

            while (lastIndex < length) {
                index = template.indexOf(delimiters[0], lastIndex);
                if (index < 0) {
                    tokens.push({
                        type: this.types.text,
                        value: template.slice(lastIndex)
                    });
                    break;
                } else {
                    if (index > 0 && lastIndex < index) {
                        tokens.push({
                            type: this.types.text,
                            value: template.slice(lastIndex, index)
                        });
                    }
                    lastIndex = index + delimiters[0].length;
                    index = template.indexOf(delimiters[1], lastIndex);
                    if (index < 0) {
                        substring = template.slice(lastIndex - delimiters[0].length);
                        lastToken = tokens[tokens.length - 1];
                        if ((lastToken !== undefined ? lastToken.type : void 0) === this.types.text) {
                            lastToken.value += substring;
                        } else {
                            tokens.push({
                                type: this.types.text,
                                value: substring
                            });
                        }
                        break;
                    }
                    value = template.slice(lastIndex, index).trim();
                    tokens.push({
                        type: this.types.binding,
                        value: value
                    });
                    lastIndex = index + delimiters[1].length;
                }
            }
            return tokens;
        };

        return TextTemplateParser;
    }());

}).call(this);