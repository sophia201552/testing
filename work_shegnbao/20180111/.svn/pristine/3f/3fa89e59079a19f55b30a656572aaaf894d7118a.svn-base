(function (exports, FacHtmlContainer, ToolTipMixin) {

    function HtmlContainer() {
        FacHtmlContainer.apply(this, arguments);

        this.instance = null;
    }

    HtmlContainer.prototype = Object.create(FacHtmlContainer.prototype);
    HtmlContainer.prototype.constructor = HtmlContainer;

    /** override */
    HtmlContainer.prototype.show = function () {
        var model = this.store.model;
        var options = model.option();

        FacHtmlContainer.prototype.show.apply(this, arguments);
        this.shape.style.border = 'none';

        HtmlContainer.templateHelper.ins = this;
        this.instance = HtmlContainer.templateHelper.render(this.shape, options, this.page.options.params);
        this.store.model.serialize().idDs = this.instance.defer;

        this.attachCustomEvents();
    };

    /** @override */
    HtmlContainer.prototype.preview = function () {};

    /** override */
    HtmlContainer.prototype.update = function (e, propName) {
        var model = this.store.model;
        var scale;

        FacHtmlContainer.prototype.update.apply(this, arguments);

        if (!propName || propName.indexOf('update.option.display') > -1) {
            if (model['option.display']() === 1) {
                scale = this.painter.getScale();
                this.shape.style.left = model.x() * scale.x + 'px';
                this.shape.style.top = model.y() * scale.y + 'px';
                this.shape.style.width = model.w() * scale.x + 'px';
                this.shape.style.height = model.h() * scale.y + 'px';
            }
        }

        if (propName && propName.indexOf('update.option.text') > -1) {
            // 更新模板
            this.instance && this.instance.update(this.store.model.option().text.value);
        }
    };

    HtmlContainer.prototype.attachCustomEvents = function () {
        var _this = this;

        $(this.shape).off('click').on('click', '[data-link-to]', function (e) {
            var linkType = this.dataset['linkType'];
            var ctnSelector = this.dataset['linkTarget'];
            var menuId = this.dataset['linkTo'];
            var linkName = this.dataset['linkName'];
            var linkParams = this.dataset['linkParams'];

            try{
                linkParams = JSON.parse(linkParams);
            } catch (e){}
            // 跳转
            _this.instance.methods.linkTo(menuId, ctnSelector, linkType, linkName, linkParams);
            e.preventDefault();
        });
    };

    HtmlContainer.prototype.reload = function (params) {
        var options = this.store.model.option();

        this.instance && this.instance.close();
        this.instance = HtmlContainer.templateHelper.render(this.shape, options, params);
        this.store.model.serialize().idDs = this.instance.defer;
    };

    HtmlContainer.prototype.close = function () {
        this.instance && this.instance.close();
        FacHtmlContainer.prototype.close.apply(this, arguments);
    };

    HtmlContainer.prototype = Mixin(HtmlContainer.prototype, ToolTipMixin);

    /*----------------
     * STATIC METHODS
     * ---------------*/
    // Html 控件渲染核心方法
    // 该方法暴露为 static 对象，是为了让模板中的代码也可以调用到
    HtmlContainer.templateHelper = {
        ins: null,
        // rootGuid - 根模板的 guid
        render: function (container, code, params, rootGuid) {
            var _this = this;
            var guid = ObjectId();
            var formattedCode, _api;

            // 默认为 guid
            rootGuid = typeof rootGuid === 'undefined' ? guid : rootGuid;

            _api = namespace('__f_hc')[guid] = new TemplateAPI(guid, rootGuid, params);
            // 如果是根模板
            if (rootGuid !== guid) {
                namespace('__f_hc')[rootGuid].children.push(guid);
            }

            // 1、格式化代码
            formattedCode = (function (_api, container, code, params, guid) {
                var scriptContent = [];
                var templateParseInfo = _this.getAttachedTemplate(code.html, params);
                var html = templateParseInfo.template;

                var htmlWrapTpl = '<div class="ps-w-html-contaienr" id="hc_'+guid+'">|code|</div>';

                var jsWrapTpl = (function () {
                    return '(function(_api) {'+
                    'var _params = _api.params, _container = _api.container = document.querySelector("#hc_'+guid+'");\ntry{\n' +
                    '|code|\n}catch(e){console.error(e);};_api.__run(_container);}).call(null, window.__f_hc["'+guid+'"])';
                } ());

                var cssWrapTpl = '<style>|code|</style>';
                // script 标签处理
                var formatHtml = html.replace(_this.ins.JS_FORMAT_PATTERN, function($0, $1, $2, $3) {
                    if( $2.trim() !== '') scriptContent.push( $2 );
                    return '';
                });
                // 给 css selector 加上 id 的前缀
                // /([,|\}|\r\n][\s]*)([\.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/mg
                // /([^\r\n,{}]+)(,(?=[^}]*{)|\s*(?={))/mg
                var formatCss = code.css.replace(_this.ins.CSS_FORMAT_PATTERN, function ($0, $1, $2) {
                    // 屏蔽一些特殊情况
                    // @keyframes、百分比
                    if (/@\S+|\d+?%/mg.exec($0) !== null) {
                        return $0;
                    }
                    return '#hc_' + guid + ' ' + $0;
                }).replace(/\s+__container__/gm, '');
                var formatJs = jsWrapTpl.replace('|code|', code.js.replace('$', '$$$$'));
                formatCss = cssWrapTpl.replace('|code|', formatCss);
                formatHtml = htmlWrapTpl.replace('|code|', formatHtml);

                _api.tplParamList = templateParseInfo.list;

                return {
                    html: formatHtml,
                    css: formatCss,
                    js: formatJs
                };
            } (_api, container, code, params, guid));

            // 2、预处理数据源标签
            (function (code, dsNameList, dsIdGrouped) {
                var parser = TextTemplateParser;
                // $0: 属性+值
                // $1: 属性名
                // $2: 属性值
                code.html = code.html.replace(/([\w-]+?)="([^"]*<%[^<>]+?%>[^"]*)"/mg, function ($0, $1, $2) {
                    var tokens = parser.parse($2, ['<%', '%>']);
                    var infoStr;
                    tokens.forEach(function (row) {
                        var dsId;
                        if(row.type === parser.types.binding) {
                            row.content = '';
                            if (dsNameList.indexOf(row.value) === -1) {
                                dsNameList.push(row.value);
                                if (row.value.indexOf(',') > -1) {
                                    dsId = row.value.split(',')[0].trim();
                                } else {
                                    dsId = row.value;
                                }
                                dsIdGrouped[dsId] = dsIdGrouped[dsId] || [];
                                dsIdGrouped[dsId].push(row.value);
                            }
                        }
                    });
                    infoStr = window.encodeURIComponent(JSON.stringify(tokens));

                    return $1+'="" data-inner-ds-info="'+infoStr+'" data-inner-ds-attr="'+$1+'"';
                });
                // 整理出数据源的数据
                code.html = code.html.replace(/<%([^<>]+?)%>/mg, function($0, $1) {
                    var dsId;
                    if (dsNameList.indexOf($1) === -1) {
                        dsNameList.push($1);
                        if ($1.indexOf(',') > -1) {
                            dsId = $1.split(',')[0].trim();
                        } else {
                            dsId = $1;
                        }
                        dsIdGrouped[dsId] = dsIdGrouped[dsId] || [];
                        dsIdGrouped[dsId].push($1);
                    }
                    return '<span class="text-node-placeholder" data-name="'+$1+'">'+$1+'</span>';
                });
            } (formattedCode, _api.dsNameList, _api.dsIdGrouped));
            
            // 3、渲染 html
            container.innerHTML = [formattedCode.html, formattedCode.css].join('\n');

            // 4、执行 js
            (function (code) {
                var done = false;
                var script = document.createElement("script");
                var head = document.getElementsByTagName("head")[0];
                script.type = "text\/javascript";
                script.text = code;
                head.appendChild(script);
                head.removeChild(script);
            } (formattedCode.js));

            return {
                methods: {
                    linkTo: _api.linkTo
                },
                defer: _api.defer,
                close: function () {
                    _api.close();
                    window.__f_hc[guid] = null;
                },
                update: function (data) {
                    _api.update(data);
                },
                reload: function (data) {}
            }
        },
        bindDs: function (container, guid) {
            var _api = namespace('__f_hc.' + guid);
            var childrenGuid = _api.children || [];
            var dsIdList = [];
            var dsNameList = [];
            var dataMap = {};
            var templates = [_api];

            childrenGuid.forEach(function (id) {
                templates.push( namespace('__f_hc.' + id) );
            });

            templates.forEach(function (row) {
                dsIdList = dsIdList.concat( Object.keys(row.dsIdGrouped) );
                dsNameList = dsNameList.concat(row.dsNameList);
            });

            // 绑定数据源
            this.createDsBinding(container, dsNameList, dataMap = {});

            return {
                screen: {
                    close: function () {
                        window.__f_hc[guid] = null;
                    }
                },
                dsList: dsIdList,
                dataMap: dataMap
            };
        },
        createDsBinding: function (container, dsNameList, ds) {
            var _this = this;
            var $container = $(container);
            var textNodeMap = {}, attrNodeMap = {};
            var $textNodes = $container.find('.text-node-placeholder');
            var $attrNodes = $container.find('[data-inner-ds-info]');

            dsNameList.forEach(function(name) {
                var $nodes;

                /** 数据源在文本节点中使用 */
                if( ($nodes = $textNodes.filter('[data-name="'+name+'"]')).length ) {
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
                if( ($nodes = $attrNodes.filter('[data-inner-ds-info="'+name+'"]')).length ) {
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
                                var options;

                                if(idx > -1) {
                                    options = _this._parseOptionStr( content.substr(idx+1) );
                                    node.data = _this._formatNumber(value, options);
                                    _this._formatNode(node, options, {
                                        dsId: content.substr(0, idx)
                                    });
                                } else {
                                    node.data =  isNaN(value) ? _this._decodeHtml(value) : parseFloat(value).toString();
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
                                                row.content = _this._formatNumber( value, _this._parseOptionStr(row.value.substr(idx+1)) );
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
        },
        _parseOptionStr: function (optionStr) {
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
        },
        _formatNumber: function (num, options) {
            var rs = '';
            var toString = Object.prototype.toString;
            var decimalPortion;
            var numstr, isNegative;

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
        },
        _formatNode: function (node, options, params) {
            var domWrap;

            // 如果已经包裹过，则不再包裹
            if (options.draggable && !node.parentNode.dataset.h5DraggableNode) {
                domWrap = document.createElement('span');
                node.parentNode.insertBefore(domWrap, node);
                domWrap.appendChild(node);

                this.ins.enableTooltip && this.ins.initTooltip({
                    shape: domWrap,
                    ds: params.dsId,
                    container: this.ins.page.painterCtn,
                    clickable: AppConfig.isFactory === 0
                });
            }
        },
        _decodeHtml: function (html) {
            var txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        },
        getAttachedTemplate: function (template, params) {
            var pattern = /<#\s*(\w*?)\s*#>/mg;
            var list = [];

            if (params) {
                template = template.replace(pattern, function ($0, $1) {
                    list.push($1);
                    if (!params[$1]) {
                        return $0;
                    }
                    return params[$1];
                });
            }

            return {
                template: template,
                list: list
            };
        },
        getTemplateParamList: function (template) {
            var pattern = /<#\s*(\w*?)\s*#>/mg;
            var match, list = [];

            while( match = pattern.exec(template) ) {
                list.push(match[1]);
            }

            return list;
        }
    };

    // 暴露到模板中的 api
    var TemplateAPI = (function () {

        // 记录处于加载状态的模板
        var templateLoading = {};
        // 存储模板缓存
        var templateCache = {};

        function TemplateAPI(guid, rootGuid, params) {
            this.dataMap = {};
            this.obDataMap = {};
            this.dsIdGrouped = {};

            // 模板请求集合
            this.__tplRequests = [];
            // 根模板的 guid
            this.rootGuid = rootGuid;
            // 全局唯一 id
            this.guid = guid;
            // 模板参数
            this.params = params;
            // 模板参数列表
            this.tplParamList = [];
            // 存储实时数据源列表
            this.dsNameList = [];
            // 该模板中包含的子模板 guid 集合
            this.children = [];
            // 跟踪该模板的加载情况
            this.defer = $.Deferred();
            // 内部引用别的 screen 时保留的实例
            this.refScreen = null;
        }

        +function () {
            this.__getTemplate = function (templateId) {
                var promise;
                // 先查看缓存是否有匹配
                if (templateCache[templateId]) {
                    promise = $.Deferred();
                    promise.resolve(templateCache[templateId]);
                    return promise;
                }
                // 再判断该模板是否正在加载
                else if (templateLoading[templateId]) {
                    // 如果是，则返回正在加载的 promise 对象
                    return templateLoading[templateId];
                }
                // 都没有匹配到，说明是第一次加载该模板，需要发一个请求
                else {
                    promise = WebAPI.get('/factory/template/' + templateId);
                    templateLoading[templateId] = promise;
                    promise.done(function (data) {
                        templateCache[templateId] = data;
                    }).always(function () {
                        templateLoading[templateId] = null;
                    });
                    return promise;
                }
            };

            /** 开始处理动态加载的模板 */
            this.__run = function () {
                var _this = this;
                var promise = $.Deferred();
                var requests = this.__tplRequests;
                var requestMap = {};
                var defers = [];
                var templateHelper = namespace('widgets.factory.HtmlContainer.templateHelper');

                if (!requests.length) {
                    promise.resolve();
                } else {
                    // 处理模板，将需要加载的模板按照 模板id 进行分类
                    requests.forEach(function (req) {
                        if ( !requestMap.hasOwnProperty(req.templateId) ) {
                            requestMap[req.templateId] = []
                        }
                        requestMap[req.templateId].push(req);
                    });

                    // 开始加载模板
                    Object.keys(requestMap).forEach(function (templateId) {
                        var row = requestMap[templateId];
                        // 从服务端拉取模板信息
                        var d = _this.__getTemplate(templateId);

                        var defer = d.then(function (data) {
                            var type = data.type;
                            var content = data.content;
                            var deferArr = [];

                            deferArr = row.map(function (item) {
                                var container = item['container'];
                                var params = item['params'];
                                var screen = $(container).data('f.hc');
                                var html;

                                if (screen) screen.close();
                                // 页面模板
                                if (type === 'page') {
                                    if (params) content.template = templateHelper.getAttachedTemplate(content.template, params)['template'];
                                    screen = new (namespace('observer.screens').PageScreen)({
                                        params: params,
                                        template: {
                                            page: {
                                                width: content.width,
                                                height: content.height,
                                                display: content.display
                                            },
                                            data: JSON.parse(content.template)
                                        }
                                    }, container);
                                    screen.show();
                                    // 将 screen 的引用存入到容器 dom 中，方便需要的时候拿到
                                    $(container).data('f.hc', screen);
                                    return;
                                }
                                // Html 容器控件模板
                                else if (type === 'widget.HtmlContainer') {
                                    if (params) html = templateHelper.getAttachedTemplate(content.html, params)['template'];
                                    screen = namespace('widgets.factory.HtmlContainer.templateHelper').render(container, {
                                        html: html,
                                        css: content.css,
                                        js: content.js
                                    }, params, _this.rootGuid);
                                    // 将 screen 的引用存入到容器 dom 中，方便需要的时候拿到
                                    $(container).data('f.hc', screen);
                                    return screen.defer;
                                }
                            }).filter(function (row) {
                                return !!row;
                            });

                            return $.when.apply($, deferArr);
                        });

                        defers.push(defer);
                    });

                    // 等待所有
                    $.when.apply($, defers).fail(function () {
                        console.error('有模板加载失败！');
                    }).always(function () {
                        promise.resolve();
                    });
                }

                return promise.then(function () {
                    var rs;
                    // 对根模板进行 绑定动态数据源，开启 worker 线程 的操作
                    if (_this.rootGuid !== _this.guid) {
                        return;
                    }
                    // 数据源处理，仅根模板需要进行，子模板由根模板统一处理
                    rs = namespace('widgets.factory.HtmlContainer.templateHelper').bindDs(_this.container, _this.guid);
                    // 将 screen 的引用存入到容器 dom 中，方便需要的时候拿到
                    $(_this.container).data('f.hc', rs.screen);
                    // 将模板缓存清空
                    templateCache = {};

                    _this.obDataMap = rs.dataMap;
                    return rs.dsList;
                }).always(function (dsList) {
                    _this.defer.resolve(dsList);
                });
            };

            this.render = function (container, templateId, params) {
                var _this = this;

                this.__tplRequests.push({
                    container: container,
                    templateId: templateId,
                    params: params
                });
                return;
            };

            this.update = function (data) {
                var _this = this;
                var childrenGuid = this.children || [];
                var templates = [this];

                // 非顶层模板无法调用 update 方法
                if (this.guid !== this.rootGuid) {
                    Log.warn('Only the top-level template in a "HtmlContainer" can use "_api.update" method!');
                    return;
                }

                childrenGuid.forEach(function (id) {
                    templates.push( namespace('__f_hc.' + id) );
                });

                templates.forEach(function (row) {
                    Object.keys(row.dsIdGrouped).forEach(function (key) {
                        var dsIds = row.dsIdGrouped[key];
                        var dsVal = data[key];

                        dsIds.forEach(function (dsName) {
                            _this.obDataMap[dsName] = dsVal;
                        });
                        
                        row.dataMap[key] = dsVal;
                        // 调用自定义更新事件
                        typeof row.onUpdated === 'function' && row.onUpdated.call(null, row.dataMap);
                    });
                });
                
            };

            this.getHistoryData = function (params) {
                return WebAPI.post('/analysis/startWorkspaceDataGenHistogram', params);
            };

            // 初始化一些内置方法
            // linkTo: 跳转到指定页面
            this.linkTo = function (menuId, ctnSelector, linkType, linkName, linkParams) {
                var $ev, ctn;

                // 如果是链接到容器
                if(ctnSelector) {
                    // 如果需要限制为在本容器中查找，写成如下方式即可
                    // container.querySelector(ctnSelector);
                    ctn = document.querySelector(ctnSelector);
                    // 不存在此容器，不做任何事
                    if(!ctn) return;

                    // 初始化 dashboard
                    ctn.innerHTML = '';
                    if(this.refScreen) {
                        this.refScreen.close();
                        this.refScreen = null;
                    }
                }

                linkType = linkType || 'EnergyScreen';
                switch(linkType) {
                    case 'EnergyScreen_M':
                    case 'EnergyScreen':
                        if(!ctn) {
                            if(!AppConfig.isMobile) {
                                ScreenManager.goTo({
                                    page: linkType,
                                    id: menuId
                                });
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
                            this.refScreen = new EnergyScreen();
                            this.refScreen.id = menuId;
                            this.refScreen.container = ctn;
                            this.refScreen.isForBencMark = true;
                            this.refScreen.init();
                        }
                        break;
                    case 'ObserverScreen':
                        if(!ctn) {
                            ScreenManager.goTo({
                                page: linkType,
                                id: menuId
                            });
                        } else {
                            this.refScreen = new ObserverScreen(menuId);
                            ctn.innerHTML = '<div class="divMain" style="width: 100%; height: 100%;">\
                                    <div class="div-canvas-ctn" style="padding: 0; margin: 0 auto; height: 100%; width: 100%;">\
                                        <canvas class="canvas-ctn" style="width: 100%; height: 100%;">浏览器不支持</canvas>\
                                    </div>\
                                    <div id="divObserverTools" style="height: 0"></div>\
                                </div>';
                            this.refScreen.isInDashBoard = true;
                            this.refScreen.show(ctn);
                        }
                        break;
                    case 'FacReportScreen':
                        if (!ctn) {
                            ScreenManager.goTo({
                                page: 'observer.screens.FacReportScreen',
                                options: {
                                    id: menuId
                                },
                                container: 'indexMain'
                            });
                        }
                        break;
                    case 'FacReportWrapScreen':
                        if (!ctn) {
                            if(AppConfig.isMobile){
                                router.to(
                                    {
                                        typeClass: MessageFactoryReport,
                                        data: {
                                        }
                                    }
                                )
                            }else {
                                ScreenManager.goTo({
                                    page: 'observer.screens.FacReportWrapScreen',
                                    options: {
                                        id: menuId
                                    },
                                    container: 'indexMain',
                                    response: linkParams
                                });
                            }
                        }
                        break;
                    // 系统诊断
                    case 'DiagnosisScreen':
                        // 系统诊断目前不支持在特定容器中显示
                        if (!ctn) {
                            ScreenManager.goTo({
                                page: linkType,
                                options: {
                                    defaultMenuId: menuId
                                }
                            });
                        }
                        break;
                    // 不识别的类型不做处理
                    default: return;
                }
            };

            this.close = function () {
                var _this = this;
                var childrenGuid = this.children || [];
                var templates = [this];

                childrenGuid.forEach(function (id) {
                    templates.push( namespace('__f_hc.' + id) );
                });

                templates.forEach(function (row) {
                    // 调用自定义销毁事件
                    typeof row.onBeforeClose === 'function' && row.onBeforeClose.call(null);
                });

                // 销毁容器
                if (this.container) {
                    this.container.innerHTML = '';
                }
            };

        }.call(TemplateAPI.prototype);

        return TemplateAPI;
    } ());

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

    exports.HtmlContainer = HtmlContainer;
} (
    namespace('widgets.factory'),
    namespace('widgets.factory.HtmlContainer'),
    namespace('mixins.TooltipMixin')
));