(function (FacHtmlContainer) {

    function HtmlContainer() {
        FacHtmlContainer.apply(this, arguments);
    }

    HtmlContainer.prototype = Object.create(FacHtmlContainer.prototype);
    HtmlContainer.prototype.constructor = HtmlContainer;

    /** override */
    HtmlContainer.prototype.show = function () {
        var model = this.store.model;
        var options = model.option();
        var info = null;

        this.shape = HTMLParser(this.tpl);
        this.shape.id = model._id();
        this.shape.style.position = 'absolute';
        this.update();

        this.layer.add(this.shape);

        HtmlContainer.templateHelper.render(this.shape, options, this.page.options.params);
    };

    /** override */
    HtmlContainer.prototype.update = function () {
        FacHtmlContainer.prototype.update.apply(this, arguments);
    };


    /*----------------
     * STATIC METHODS
     * ---------------*/
    // Html 控件渲染核心方法
    // 该方法暴露为 static 对象，是为了让模板中的代码也可以调用到
    HtmlContainer.templateHelper = {
        render: function (container, code, params) {
            var worker = null;
            var dsNameList = [];
            var guid = new Date().valueOf();
            var formattedCode, _template;

            window.__f_hc = window.__f_hc || {};
            window.__f_hc[guid] = _template = {
                api: new TemplateAPI(),
                params: params
            };

            // 1、格式化代码
            formattedCode = (function (container, code, params, ds, guid) {
                var _this = this;
                var patternScript = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/img;
                var scriptContent = [];

                var htmlWrapTpl = '<div id="hc_'+guid+'">|code|</div>';

                var jsWrapTpl = (function () {
                    return '(function(__data) {'+
                    'var _api = __data.api, _params = __data.params, _container = document.querySelector("#hc_'+guid+'");' +
                    '|code|}).call(null, window.__f_hc["'+guid+'"])';
                } ());

                var cssWrapTpl = '<style>|code|</style>';
                // script 标签处理
                var formatHtml = code.html.replace(patternScript, function($0, $1, $2, $3) {
                    if( $2.trim() !== '') scriptContent.push( $2 );
                    return '';
                });
                // 给 css selector 加上 id 的前缀
                // /([,|\}|\r\n][\s]*)([\.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/mg
                // /([^\r\n,{}]+)(,(?=[^}]*{)|\s*(?={))/mg
                var formatCss = code.css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*(?={))/mg, function ($0, $1, $2) {
                    return '#hc_' + guid + ' ' + $1;
                });
                var formatJs = jsWrapTpl.replace('|code|', code.js);
                formatCss = cssWrapTpl.replace('|code|', formatCss);
                formatHtml = htmlWrapTpl.replace('|code|', formatHtml);

                return {
                    html: formatHtml,
                    css: formatCss,
                    js: formatJs
                }
            } (container, code, params, _template.api.dataMap, guid));

            // 2、预处理数据源标签
            (function (code) {
                var parser = TextTemplateParser;
                // $0: 属性+值
                // $1: 属性名
                // $2: 属性值
                code.html = code.html.replace(/([\w-]+?)="([^"]*<%.+?%>[^"]*)"/mg, function ($0, $1, $2) {
                    var tokens = parser.parse($2, ['<%', '%>']);
                    var infoStr;
                    tokens.forEach(function (row) {
                        if(row.type === parser.types.binding) {
                            row.content = '';
                            if (dsNameList.indexOf(row.value) === -1) {
                                dsNameList.push(row.value);
                            }
                        }
                    });
                    infoStr = window.encodeURIComponent(JSON.stringify(tokens));

                    return $1+'="" data-inner-ds-info="'+infoStr+'" data-inner-ds-attr="'+$1+'"';
                });
                // 整理出数据源的数据
                code.html = code.html.replace(/<%(.+?)%>/mg, function($0, $1) {
                    if (dsNameList.indexOf($1) === -1) {
                        dsNameList.push($1);
                    }
                    return '<span class="text-node-placeholder" data-name="'+$1+'">'+$1+'</span>';
                });
            } (formattedCode));
            
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

            // 5、绑定数据源
            this.createDsBinding(container, dsNameList, _template.api.dataMap);

            // 6、开启线程进行数据实时刷新
            ~function (worker, dsNameList, _api) {
                if (worker) {
                    worker.terminate();
                    worker = null;
                }
                if(dsNameList.length) {
                    worker = new Worker("/static/views/js/worker/workerUpdate.js");
                    worker.self = this;
                    worker.addEventListener("message", function (e) {
                        var ds = _api.dataMap;
                        if (e.data.error || !e.data.dsItemList) {
                            Log.error('Refresh Data Failed!');
                            return;
                        }
                        e.data.dsItemList.forEach(function (row) {
                            ds[row.dsItemId] = row.data;
                        });

                        // 调用自定义更新事件
                        typeof _api.onUpdated === 'function' && _api.onUpdate.call();
                    }, true);
                    worker.addEventListener("error", function (e) {
                        Log.error(e);
                    }, true);
                    worker.postMessage({
                        pointList: dsNameList,
                        type: "datasourceRealtime"
                    });
                }
            }.call(this, worker, dsNameList, _template.api);

            return {
                close: function () {
                    if (worker) {
                        worker.terminate();
                        worker = null;
                    }
                    if (window.__f_hc[guid]) {
                        window.__f_hc[guid].api = null;
                        window.__f_hc[guid].params = null;
                        window.__f_hc[guid] = null;
                    }
                }
            }
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
        },
        _formatNumber: function (num, optionStr) {
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
        }
    };

    // 暴露到模板中的 api
    var TemplateAPI = (function () {
        function TemplateAPI() {
            this.dataMap = {};
        }

        +function () {
            this.getAttachedTemplate = function (template, params) {
                var pattern = /<#\s*(\w*?)\s*#>/mg;
                var match;

                return template.replace(pattern, function ($0, $1) {
                    if (!params[$1]) {
                        return $0;
                    }
                    return params[$1];
                });
            };

            this.render = function (container, templateId, params) {
                var _this = this;
                var screen = $(container).data('f.HtmlContainer');
                if (screen) screen.close();

                // 从服务端拉取模板信息
                WebAPI.get('/factory/template/' + templateId).done(function (data) {
                    var type = data.type;
                    var content = data.content;
                    
                    // 页面模板
                    if (type === 'page') {
                        if (params) content.template = _this.getAttachedTemplate(content.template, params);
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
                    }
                    // Html 容器控件模板
                    else if (type === 'widget.HtmlContainer') {
                        if (params) content.html = _this.getAttachedTemplate(content.html, params);
                        screen = namespace('widgets.factory.HtmlContainer.templateHelper').render(container, content, params);
                    }

                    // 将 screen 的引用存入到容器 dom 中，方便需要的时候拿到
                    $(container).data('f.hc', screen);
                });
            };

            this.getHistoryData = function (params) {
                return WebAPI.post('/analysis/startWorkspaceDataGenHistogram', params);
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

    window.widgets = window.widgets || {};
    window.widgets.factory = window.widgets.factory  || {};
    window.widgets.factory.HtmlContainer = HtmlContainer;

} (window.widgets.factory.HtmlContainer));