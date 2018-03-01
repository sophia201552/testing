(function(exports, SuperClass, ChartThemeConfig) {
  function Html() {
    SuperClass.apply(this, arguments);

    this.guids = [];
  }

  Html.prototype = Object.create(SuperClass.prototype);

  // html container api
  function HCAPI() {}

  +function() {
    this.getHistoryData = function(params) {
      return WebAPI.post('/analysis/startWorkspaceDataGenHistogram', params);
    };

    this.getChartThemes = function() {
      // 复制一份，防止用户覆盖
      return $.extend(true, {}, ChartThemeConfig);
    };
  }.call(HCAPI.prototype);

  +function() {
    this.optionTemplate = {
      group: '基本',
      name: 'I18n.resource.report.optionModal.HTML',
      minWidth: 3,
      minHeight: 1,
      maxWidth: 12,
      maxHeight: 100,
      type: 'Html',
      className: 'report-module-text'
    };

    /** @override */
    this.init = function() {
      SuperClass.prototype.init.apply(this, arguments);

      $(this.container)
        .off('click.externLinks')
        .on('click.externLinks', '.link-to-report[data-id]', function() {
          var reportId = this.dataset.id;
          var $ele = $('.report-item[data-id="' + reportId + '"]');
          if ($ele.length === 0) {
            alert('Report Not Found!');
            return;
          }
          $ele.trigger('click');
        });
    };

    /** @override */
    this.initEntity = function() {
      var options = this.entity.modal.option;

      options.html = options.html || '';
      options.css = options.css || '';
      options.js = options.js || '';
    };

    this.getTemplateAPI = function() {
      return new HCAPI();
    };

    /* override */
    this.initResizer = function() {};

    /** @override */
    this.render = function(isProcessTask) {
      this.registVariableProcessTask(this.entity.modal.variables).done(
        function() {
          var options = this.entity.modal.option;
          var formattedCode, html, guid;

          if (!options) {
            $(this.container).html('');
            return;
          }
          guid = ObjectId();
          this.guids.push(guid);
          code = this.__getTplParamsAttachedHtml(options);
          formattedCode = this._getFormattedHtml(code, guid);
          namespace('__f_hc')[guid] = {
            api: this.getTemplateAPI(),
            reportOptions: this.getReportOptions(),
            variables: this.variables
          };

          this._runCode(formattedCode);
        }.bind(this)
      );

      if (isProcessTask === true) {
        this.root.processTask();
      }
    };

    this._runCode = function(code) {
      // 渲染 html
      this.container.innerHTML = [code.html, code.css].join('\n');
      // 执行 js
      (function(code) {
        var done = false;
        var script = document.createElement('script');
        var head = document.getElementsByTagName('head')[0];
        script.type = 'text/javascript';
        script.text = code;
        head.appendChild(script);
        head.removeChild(script);
      })(code.js);
    };

    this._getFormattedHtml = function(code, guid) {
      var _this = this;
      var patternScript = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gim;

      var htmlWrapTpl = '<div id="hc_' + guid + '">|code|</div>';

      var jsWrapTpl = (function() {
        return (
          '(function(_data) {' +
          'var _api = _data.api, _reportOptions = _data.reportOptions, _variables = _data.variables, _container = document.querySelector("#hc_' +
          guid +
          '"); if(!_container) {return;}' +
          '|code|\n}).call(null, window.__f_hc["' +
          guid +
          '"]);'
        );
      })();

      var cssWrapTpl = '<style>|code|</style>';
      //css 全局
      //数据质量报表 全局样式
      code.css += '#dataMonitoring table { table-layout: fixed; } #dataMonitoring table td { word-break: break-all; }';
      // script 标签处理
      var formatHtml = code.html.replace(patternScript, function(
        $0,
        $1,
        $2,
        $3
      ) {
        return '';
      });
      // 给 css selector 加上 id 的前缀
      // /([,|\}|\r\n][\s]*)([\.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/mg
      // /([^\r\n,{}]+)(,(?=[^}]*{)|\s*(?={))/mg
      var formatCss = code.css.replace(
        /([^\r\n,{}]+)(,(?=[^}]*{)|\s*(?={))/gm,
        function($0, $1, $2) {
          return '#hc_' + guid + ' ' + $1;
        }
      );
      var formatJs = jsWrapTpl.replace('|code|', code.js);
      formatCss = cssWrapTpl.replace('|code|', formatCss);
      formatHtml = htmlWrapTpl.replace('|code|', formatHtml);

      return {
        html: formatHtml,
        css: formatCss,
        js: formatJs
      };
    };

    // 获取替换模板参数后的 code
    this.__getTplParamsAttachedHtml = function(code) {
      var _this = this;
      var pattern = this.TPL_PARAMS_PATTERN;
      var params = this.getTplParamsValue();

      if (!params || Object.keys(params).length === 0) {
        return code;
      } else {
        return {
          html: (code.html || '').replace(pattern, function($0, $1) {
            return params[$1];
          }),
          js: (code.js || '').replace(pattern, function($0, $1) {
            return params[$1];
          }),
          css: (code.css || '').replace(pattern, function($0, $1) {
            return params[$1];
          })
        };
      }
    };

    /** @override */
    this.getTplParams = function() {
      var options = this.entity.modal.option;
      var str = options.html + options.css + options.js;
      var pattern = this.TPL_PARAMS_PATTERN;
      var match = null;
      var params = [];

      while ((match = pattern.exec(str))) {
        params.push(match[1]);
      }

      return params;
    };

    /** @override */
    this.resize = function() {
      var ele = this.container.parentNode;
      ele.style.height = 'auto';
    };

    /** @override */
    this.showConfigModal = function() {
      var _this = this;
      var option = this.entity.modal.option;

      CodeEditorModal.show(option, function(code) {
        _this.entity.modal.option.html = code.html;
        _this.entity.modal.option.js = code.js;
        _this.entity.modal.option.css = code.css;
        _this.render(true);
      });
    };

    /** @override */
    this.destroy = function() {
      SuperClass.prototype.destroy.apply(this, arguments);

      this.guids.forEach(function(guid) {
        namespace('__f_hc')[guid] = null;
      });

      this.wrap.parentNode.removeChild(this.wrap);
    };
  }.call(Html.prototype);

  exports.Html = Html;
})(
  namespace('factory.report.components'),
  namespace('factory.report.components.Base'),
  namespace('factory.report.config.ChartThemeConfig')
);
