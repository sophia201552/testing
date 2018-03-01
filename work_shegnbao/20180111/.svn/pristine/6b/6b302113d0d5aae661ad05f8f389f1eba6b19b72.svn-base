(function(exports, SuperClass, LayoutsConfigModal, DateUtil) {
  function Base(parent, entity, root, idx) {
    SuperClass.apply(this, arguments);

    this.screen = parent;
    this.entity = entity;
    this.entity.id = this.entity.id || ObjectId();

    this.wrap = null;
    this.container = null;
    this.spinner = null;

    this.variables = null;

    this.root = root || this;

    this.initEntity();

    this.init(idx);
  }

  Base.prototype = Object.create(SuperClass.prototype);
  Base.prototype.constructor = Base;

  +function() {
    this.UNIT_WIDTH = 100 / 12;

    this.UNIT_HEIGHT = 60;

    this.TPL_PARAMS_PATTERN = /<#\s*(\w*?)\s*#>/gm;

    this.TPL_PARAMS_IN_VARIABLES_PATTERN = /<@\s*(\w*?)\s*@>/gm;

    /**
     * 用于指示模态框的类型，设置此属性的意义是可以让控件使用其他控件的配置框，而不需要重新定义一个类
     * 查找控件的模态框，优先会去查找有没有 this.entity.modal.type + 'ConfigModal' 的类
     * 如果没有，再会去查找有没有 this.configModalType + 'ConfigModal' 的类
     */
    this.configModalType = undefined;

    // 初始化 entity 数据结构
    this.initEntity = function() {};

    /**
     * @override
     */
    this.render = function() {};

    /**
     * 初始化控件容器
     * @param  {number} insertIdx 容器待插入的位置下标
     */
    this.init = function(insertIdx) {
      var _this = this;
      var divWrap, divParent, spanIcon;

      this.wrap = divWrap = document.createElement('div');
      divWrap.id = 'reportContainer_' + this.entity.id;
      divWrap.className = 'report-container-wrap';
      if (this.entity.type === 'DashboardWidget') {
        if (this.entity.modal.isPageBreak) {
          divWrap.classList.add('pageBreak');
        }
      } else {
        if (this.entity.modal.option.isPageBreak) {
          divWrap.classList.add('pageBreak');
        }
      }

      if (this.optionTemplate.className) {
        this.optionTemplate.className.split(' ').forEach(function(v) {
          divWrap.classList.add(v);
        });
      }

      divParent = document.createElement('div');
      divParent.classList.add('report-container');
      // 如果chart类型 添加导出数据源按钮
      if (
        AppConfig.isFactory != 1 &&
        !AppConfig.isReportConifgMode &&
        this.entity.modal.option.isExportData
      ) {
        spanIcon = document.createElement('span');
        spanIcon.classList.add(
          'exportDataIcon',
          'glyphicon',
          'glyphicon-export'
        );
        divParent.appendChild(spanIcon);
        spanIcon.onclick = function (e) {
          var regx = /^[A-Za-z0-9]*$/;
          if (regx.test(this.entity.modal.points[0])) {
            new ModalAppendPointToDs(true, this.entity.modal.points, null).show();
          } else {
            // var postPoint = [];
            // this.entity.modal.points.forEach((element) => {
            //   if (element.indexOf('|') > -1) {
            //     postPoint.push(element.split('|')[1]);
            //   }
            // })
            new ModalAppendPointToDs(false, null, this.entity.modal.points).show();
          }
        }.bind(this);
      }
      divWrap.appendChild(divParent);

      if (typeof insertIdx === 'undefined') {
        this.screen.container.appendChild(divWrap);
      } else {
        // 插入到指定的位置下标
        this.screen.container.insertBefore(
          divWrap,
          this.screen.container.childNodes[insertIdx]
        );
      }

      // 如果是在动态报表块中，则不添加任何配置按钮
      if (AppConfig.isReportConifgMode) {
        // 初始化头部
        this.initHeader();
        if (!this.isReadonly()) {
          // 初始化工具
          this.initTools();
          // 初始化大小调节器
          this.initResizer();
        }
      }

      this.container = document.createElement('div');
      this.container.className = 'report-content clearfix';
      divParent.appendChild(this.container);

      this.resize();

      return this;
    };

    /** 初始化控件头部 */
    this.initHeader = function() {
      var divWrap = this.wrap;
      var divParent = divWrap.querySelector('.report-container');
      // 添加头部
      var divTop, divHeader;

      divTop = document.createElement('div');
      divTop.classList.add('report-top-box');
      divTop.classList.add('clearfix');
      divParent.appendChild(divTop);

      divHeader = document.createElement('div');
      divHeader.className = 'report-header';
      if (this.optionTemplate.type === 'DashboardWidget') {
        divHeader.innerHTML = eval(this.entity.name);
      } else {
        divHeader.innerHTML = eval(this.optionTemplate.name);
      }

      divTop.appendChild(divHeader);

      this.initTitle();
    };

    this.initTools = function(tools) {
      var _this = this;
      // 控件最外层包裹层
      var divWrap;
      // 控件最外层
      var divTop;
      //按钮容器
      var divToolWrap;
      // 配置按钮
      var btn, tool, len;

      divWrap = this.wrap;
      divTop = divWrap.querySelector('.report-top-box');
      divToolWrap = document.createElement('div');
      divToolWrap.className = 'report-tool-wrap';

      // 控件默认的按钮
      tools = tools || ['variable', 'configure', 'remove'];
      // 复制数组
      tools = tools.concat();
      len = tools.length;

      while ((tool = tools.shift())) {
        switch (tool) {
          // 变量声明
          case 'variable':
            btn = document.createElement('a');
            btn.className = 'report-tool-btn';
            btn.title = I18n.resource.report.VAR_DECLARATION;
            btn.href = 'javascript:;';
            btn.innerHTML =
              '<span class="glyphicon glyphicon-th-large"></span>';
            divToolWrap.appendChild(btn);
            btn.onclick = function(e) {
              DeclareVariablesModal.show(
                {
                  js: _this.getDeclareVariables()
                },
                function(code) {
                  _this.render(true);
                },
                ['js'],
                $('#reportWrap')
              );
            };
            break;
          // 动态生成 layouts
          case 'layouts':
            btn = document.createElement('a');
            btn.className = 'report-tool-btn';
            btn.title = I18n.resource.report.VAR_DECLARATION;
            btn.href = 'javascript:;';
            btn.innerHTML = '<span class="glyphicon glyphicon-tasks"></span>';
            divToolWrap.appendChild(btn);
            btn.onclick = function(e) {
              var option = _this.entity.modal.option;

              CodeEditorModal.show(
                {
                  js: option.layoutScript
                },
                function(code) {
                  option.layoutScript = code.js;
                  confirm(
                    '是否立即替换报表结构？替换后不可恢复',
                    function() {
                      _this.clear();
                      _this.render(true);
                    },
                    function() {}
                  );
                },
                [CodeEditorModal.MODES.MODE_JS]
              );
            };
            break;
          // 配置按钮
          case 'configure':
            btn = document.createElement('a');
            btn.className = 'report-tool-btn ';
            btn.title = I18n.resource.report.chapterConfig.CONFIG;
            btn.href = 'javascript:;';
            btn.innerHTML = '<span class="glyphicon glyphicon-cog"></span>';
            divToolWrap.appendChild(btn);
            btn.onclick = function(e) {
              _this.showConfigModal();
            };
            break;
          // 删除按钮
          case 'remove':
            btn = document.createElement('a');
            btn.className = 'report-tool-btn ';
            btn.title = I18n.resource.report.REMOVE_BTN;
            btn.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';
            divToolWrap.appendChild(btn);
            btn.onclick = function(e) {
              confirm(I18n.resource.report.CONFIRM_DELETE, function() {
                if (_this.chart) _this.chart.clear();
                _this.screen.remove(_this.entity.id);
                $(_this.wrap).remove();
              });
            };
            break;
          case 'export':
            btn = document.createElement('a');
            btn.className = 'report-tool-btn ';
            btn.title = I18n.resource.report.EXPORT_BTN;
            btn.innerHTML = '<span class="glyphicon glyphicon-export"></span>';
            divToolWrap.appendChild(btn);
            btn.onclick = function() {
              var name;
              if ((name = prompt(I18n.resource.report.ENTER_TEMPLATE_NAME))) {
                typeof _this.export === 'function' &&
                  _this
                    .export(name)
                    .done(function() {
                      alert(I18n.resource.report.EXPORT_SUCCESS);
                    })
                    .fail(function() {
                      alert(I18n.resource.report.EXPORT_ERROR);
                    });
              } else {
                alert(I18n.resource.report.ERROR_TEMPLATE_NAME);
              }
            };
            break;
          case 'pageBreak':
            var isPageBreakClass = '';
            if (this.entity.modal.option.isPageBreak) {
              isPageBreakClass = ' active';
            }
            btn = document.createElement('a');
            btn.className = 'report-tool-btn' + isPageBreakClass;
            btn.title = I18n.resource.report.PAGEBREAK_BTN;
            btn.href = 'javascript:;';
            btn.innerHTML =
              '<span style="font-weight: 600;" class="iconfont icon-fenye"></span>';
            divToolWrap.appendChild(btn);
            btn.onclick = function(e) {
              $(this).toggleClass('active');
              _this.entity.modal.option.isPageBreak = !_this.entity.modal.option
                .isPageBreak;
            };
            break;
        }
      }
      if (len > 0) {
        //divParent.appendChild(divToolWrap);
        divTop.appendChild(divToolWrap);
      }
    };

    this.getDeclareVariables = function() {
      this.entity.modal.variables = this.entity.modal.variables || {};
      return {
        title: this.entity.modal.type,
        val: this.entity.modal.variables
      };
    };

    this.initResizer = function() {
      var _this = this;
      var divWrap = this.wrap;
      var $divTop = $(divWrap.querySelector('.report-top-box'));
      var iptResizerCol, iptResizerRow;
      var options = this.optionTemplate;
      this.entity.spanC = this.entity.spanC || options.minWidth;
      this.entity.spanR = this.entity.spanR || options.minHeight;

      // 新增宽高的编辑
      var $resizers = $(
        (
          '<div class="btn-group number-resizer-wrap">\
                <label class="control-label">' +
          I18n.resource.report.LABEL_WIDTH +
          ':</label><input type="number" class="btn btn-default number-resizer-col" value="{width}" min="{minWidth}" max="{maxWidth}">\
                <label class="control-label">' +
          I18n.resource.report.LABEL_HEIGHT +
          ':</label><input type="number" class="btn btn-default number-resizer-row" value="{height}" min="{minHeight}" max="{maxHeight}">\
            </div>'
        ).formatEL({
          width: this.entity.spanC,
          height: this.entity.spanR,
          minWidth: options.minWidth,
          minHeight: options.minHeight,
          maxWidth: options.maxWidth,
          maxHeight: options.maxHeight
        })
      ).appendTo($divTop);

      iptResizerCol = $resizers[0].querySelector('.number-resizer-col');
      iptResizerRow = $resizers[0].querySelector('.number-resizer-row');

      iptResizerRow.onchange = function() {
        this.value = Math.max(
          Math.min(options.maxHeight, this.value),
          options.minHeight
        );
        _this.entity.spanR = Math.floor(this.value);
        _this.resize();
      };
      iptResizerCol.onchange = function() {
        this.value = Math.max(
          Math.min(options.maxWidth, this.value),
          options.minWidth
        );
        _this.entity.spanC = Math.floor(this.value);
        _this.resize();
      };
      _this.divResizeByMouseInit();
    };
    this.divResizeByMouseInit = function() {
      var _this = this;
      var divContainer = $(this.wrap).get(0);
      var resizeOnRight = document.createElement('div');
      resizeOnRight.className = 'resizeOnRight';
      divContainer.appendChild(resizeOnRight);
      var resizeOnBottom = document.createElement('div');
      resizeOnBottom.className = 'resizeOnBottom';
      divContainer.appendChild(resizeOnBottom);
      var resizeOnCorner = document.createElement('div');
      resizeOnCorner.className = 'resizeOnCorner';
      divContainer.appendChild(resizeOnCorner);
      var mouseStart = {};
      var containerStart = {};
      var w, h, tempSpanR, tempSpanC;
      resizeOnBottom.onmousedown = function(e) {
        e.stopPropagation();
        var $reportWrap = $('#reportWrap');
        var oEvent = e || event;
        mouseStart.y = oEvent.clientY;
        containerStart.h = $(divContainer).height();
        doResizeOnType(e, 'bottom');
        $reportWrap.off('mousemove').on('mousemove', function(e) {
          doResizeOnType(e, 'bottom');
        });
        $reportWrap.off('mouseup').on('mouseup', function(e) {
          stopResizeOnType(e, 'bottom');
          $reportWrap.off('mousemove mouseup');
          $(resizeOnBottom).off('mousedown');
        });
      };
      resizeOnRight.onmousedown = function(e) {
        e.stopPropagation();
        var $panels = $('#panels');
        var oEvent = e || event;
        mouseStart.x = oEvent.clientX;
        containerStart.w = $(divContainer).width();
        var minSpanC;
        if (_this.entity.modal.type === 'Table') {
          minSpanC = 6;
        } else {
          minSpanC = 3;
        }
        containerStart.minW =
          $(divContainer)
            .parent()
            .width() *
            (minSpanC * _this.UNIT_WIDTH / 100) -
          parseInt($(divContainer).css('padding-left')) -
          parseInt($(divContainer).css('padding-right'));
        doResizeOnType(e, 'right');
        $panels.off('mousemove').on('mousemove', function(e) {
          doResizeOnType(e, 'right');
        });
        $panels.off('mouseup').on('mouseup', function(e) {
          stopResizeOnType(e, 'right');
          $panels.off('mousemove mouseup');
          $(resizeOnRight).off('mousedown');
        });
      };
      resizeOnCorner.onmousedown = function(e) {
        e.stopPropagation();
        var $panels = $('#panels');
        var oEvent = e || event;
        mouseStart.x = oEvent.clientX;
        mouseStart.y = oEvent.clientY;
        containerStart.w = $(divContainer).width();
        containerStart.h = $(divContainer).height();
        doResizeOnType(e, 'corner');
        $panels.off('mousemove').on('mousemove', function(e) {
          doResizeOnType(e, 'corner');
        });
        $panels.off('mouseup').on('mouseup', function(e) {
          stopResizeOnType(e, 'corner');
          $panels.off('mousemove mouseup');
          $(resizeOnCorner).off('mousedown');
        });
      };

      function doResizeOnType(e, type) {
        var oEvent = e || event;
        var differenceX, differenceY;
        switch (type) {
          case 'bottom':
            //if(oEvent.clientY - containerStart.h < $(divContainer).offset().top){
            //    return;
            //}
            differenceY = oEvent.clientY - mouseStart.y;
            h = differenceY + containerStart.h;
            divContainer.style.height = h + 'px';
            break;
          case 'right':
            if (
              oEvent.clientX - containerStart.minW <
              $(divContainer).offset().left +
                parseInt($(divContainer).css('padding-left'))
            ) {
              return;
            }
            differenceX = oEvent.clientX - mouseStart.x;
            w = differenceX + containerStart.w;
            $(divContainer).width(w);
            break;
          case 'corner':
            differenceX = oEvent.clientX - mouseStart.x;
            w = differenceX + containerStart.w;
            $(divContainer).width(w);
            differenceY = oEvent.clientY - mouseStart.y;
            h = differenceY + containerStart.h;
            divContainer.style.height = h + 'px';
            break;
        }
      }

      function stopResizeOnType(e, type) {
        var oEvent = e || event;
        var differenceX, differenceY;
        switch (type) {
          case 'bottom':
            differenceY = oEvent.clientY - mouseStart.y;
            h = differenceY + containerStart.h;
            tempSpanR = Math.round(h / _this.UNIT_HEIGHT);
            $(divContainer)
              .find('.number-resizer-row')
              .val(tempSpanR)
              .trigger('change');
            break;
          case 'right':
            differenceX = oEvent.clientX - mouseStart.x;
            w = differenceX + containerStart.w;
            tempSpanC = Math.round(
              w *
                100 /
                ($(divContainer)
                  .parent()
                  .width() *
                  _this.UNIT_WIDTH)
            );
            $(divContainer)
              .find('.number-resizer-col')
              .val(tempSpanC)
              .trigger('change');
            break;
          case 'corner':
            differenceX = oEvent.clientX - mouseStart.x;
            w = differenceX + containerStart.w;
            tempSpanC = Math.round(
              w *
                100 /
                ($(divContainer)
                  .parent()
                  .width() *
                  _this.UNIT_WIDTH)
            );
            differenceY = oEvent.clientY - mouseStart.y;
            h = differenceY + containerStart.h;
            tempSpanR = Math.round(h / _this.UNIT_HEIGHT);
            $(divContainer)
              .find('.number-resizer-row')
              .val(tempSpanR)
              .trigger('change');
            $(divContainer)
              .find('.number-resizer-col')
              .val(tempSpanC)
              .trigger('change');
            break;
        }
      }
    };

    this.initTitle = function() {};

    this.showConfigModal = function(modal) {
      var domWindows = document.querySelector('#windowRightPanel');

      if (!modal) {
        modal = exports[this.entity.modal.type + 'ConfigModal'];
        if (!modal && this.configModalType) {
          modal = exports[this.configModalType + 'ConfigModal'];
        }
      }

      if (!modal) {
        alert('no config modal found!');
        return;
      }

      modal.setOptions({
        modalIns: this,
        container: 'reportWrap'
      });

      modal.show().done(function() {
        // 设置位置
        modal.$modal.css({
          top: domWindows.scrollTop + 'px',
          bottom: -domWindows.scrollTop + 'px'
        });
      });
    };

    this.resize = function() {
      $(this.wrap).css({
        width: this.entity.spanC * this.UNIT_WIDTH + '%',
        height: this.entity.spanR * this.UNIT_HEIGHT + 'px'
      });
    };

    // 获取模板参数
    this.getTplParams = function() {
      var str = function() {
        var variables = this.entity.modal.variables;
        var str = '';
        if (!variables) {
          return '';
        }
        Object.keys(variables).forEach(function(k) {
          str += variables[k];
        });

        return str;
      }.call(this);
      var pattern = this.TPL_PARAMS_IN_VARIABLES_PATTERN;
      var match = null;
      var params = [];

      while ((match = pattern.exec(str))) {
        params.push(match[1]);
      }

      return params;
    };

    // 从本身开始，逐级向上级匹配，返回匹配到的某个控件
    this.closest = function(cond) {
      var parent = this;
      var tmp;

      while (parent && parent !== this.root) {
        // 判断类型
        if (cond['type']) {
          tmp =
            Object.prototype.toString.call(cond['type']) === '[object Array]'
              ? cond['type']
              : [cond['type']];
          if (tmp.indexOf(parent.entity.modal.type) > -1) {
            return parent;
          }
        }
        parent = parent.screen;
      }

      return null;
    };

    // 获取指定容器的模板参数值
    this.getTplParamsValue = function() {
      var tplParams = (this.closest({ type: 'ChapterContainer' }) || this)
        .entity.modal.option.tplParams;
      var variables = this.variables;

      return $.extend(true, {}, tplParams, variables);
    };

    // 应用模板参数
    this.applyTplParams = function(params) {
      this.entity.modal.option.tplParams = params;
    };

    /**
     * 获取报表全局配置的时间
     *
     * @returns 不同的时间周期所代表的日期字符串;如果是在编辑模式且是不支持的时间周期的话，返回null
     */
    this.getReportDate = function() {
      var options = this.root.entity.modal.option;
      var date = this.root.screen.options.date;
      var now, nowValue, weekDay, year, month;
      var tmp;

      if (!date) {
        now = new Date();
        nowValue = now.valueOf() - now.getTimezoneOffset() * 60000;
        switch (options.period || 'day') {
          case 'day':
            date = new Date(
              (Math.floor(nowValue / 86400000) - 1) * 86400000
            ).format('yyyy-MM-dd');
            break;
          case 'week':
            weekDay = now.getDay() === 0 ? 13 : 7 + (now.getDay() - 1);
            date = new Date(
              (Math.floor(nowValue / 86400000) - weekDay) * 86400000
            ).format('yyyy-MM-dd');
            break;
          case 'month':
            year = now.getFullYear();
            month = now.getMonth();
            tmp = year * 12 + month - 1;
            year = parseInt(tmp / 12);
            month = tmp % 12 + 1;
            month = month < 10 ? '0' + month : month;
            date = [year, month].join('-');
            break;
          case 'year':
            year = now.getFullYear();
            date = year - 1 + '';
            break;
          default:
            break;
        }
      } else {
        now = new Date(date);
        nowValue = now.valueOf() - now.getTimezoneOffset() * 60000;
        switch (options.period || 'day') {
          case 'week':
            weekDay = now.getDay() === 0 ? 6 : now.getDay() - 1;
            date = new Date((nowValue / 86400000 - weekDay) * 86400000).format(
              'yyyy-MM-dd'
            );
            break;
        }
      }

      return date;
    };

    /**
     * 获取报表的周期间隔，缺省值为 'day'
     * 'day' - 日报
     * 'week' - 周报
     * 'month' - 月报
     * 'year' - 年报
     *
     * @returns 'day'、'week'、'month'、'year'
     */
    this.getReportPeriod = function() {
      return this.root.entity.modal.option.period || 'day';
    };

    // 获取报表全局配置
    this.getReportOptions = function() {
      var options = this.root.entity.modal.option;
      var periodStartTime =
        typeof options.periodStartTime !== 'undefined'
          ? options.periodStartTime
          : 0;
      var params = {};
      var dStart, dEnd, month, year;

      dStart = new Date(this.getReportDate());
      // 处理时间周期的偏移量
      switch (options.period || 'day') {
        // 天
        case 'day':
          // 偏移单位为：小时
          dStart = new Date(dStart.valueOf() + periodStartTime * 3600000);
          dEnd = new Date(dStart.valueOf() + 86400000);
          params['timeFormat'] = 'm5';
          break;
        // 周
        case 'week':
          dStart = new Date(
            dStart.valueOf() +
              (periodStartTime === 0 ? periodStartTime : periodStartTime - 7) *
                86400000
          );
          dEnd = new Date(dStart.valueOf() + 86400000 * 7);
          params['timeFormat'] = 'd1';
          break;
        // 月
        case 'month':
          // 偏移单位为：天
          if (periodStartTime !== 0) {
            year = dStart.getFullYear();
            month = DateUtil.getLastMonth(dStart.getMonth() + 1);
            if (month === 12) {
              year -= 1;
            }
            dStart = [year, month, '01'].join('-').toDate();
          }
          dStart = new Date(dStart.valueOf() + periodStartTime * 86400000);
          dEnd = new Date(
            dStart.valueOf() + DateUtil.daysInMonth(dStart) * 86400000
          );
          params['timeFormat'] = 'd1';
          break;
        // 年
        case 'year':
          // 偏移单位为：月
          year = dStart.getFullYear();
          if (periodStartTime !== 0) {
            year -= 1;
          }
          month = dStart.getMonth() + periodStartTime + 1;
          month = month < 10 ? '0' + month : month;

          dStart = new Date([year, month].join('-'));
          dEnd = new Date(
            dStart.valueOf() +
              (DateUtil.isLeapYear(year) ? 366 : 365) * 86400000
          );
          params['timeFormat'] = 'd1';
          break;
      }
      // 处理时区
      dStart = new Date(dStart.valueOf() + dStart.getTimezoneOffset() * 60000);
      // 最后减去 1s 是为了回到上一天，否则查询结果会多一天
      dEnd = new Date(dEnd.valueOf() + dEnd.getTimezoneOffset() * 60000 - 1000);
      params['startTime'] = dStart.format('yyyy-MM-dd HH:mm:ss');
      params['endTime'] = dEnd.format('yyyy-MM-dd HH:mm:ss');

      return params;
    };

    // 注册一个处理变量的任务
    this.registVariableProcessTask = function(variables) {
      return this.root.registTask(variables, this).then(
        function(rs) {
          this.variables = this.createObjectWithChain(rs);
        }.bind(this)
      );
    };

    // 将变量定义字符串中的模板参数用真实的参数替换掉
    this._getTplParamsAttachedVariables = function(variables) {
      var params = this.getTplParamsValue();
      var pattern = this.TPL_PARAMS_IN_VARIABLES_PATTERN;
      var obj = {};

      if (!params || !variables) {
        return variables;
      }

      Object.keys(variables).forEach(function(k) {
        var row = variables[k];
        obj[k] = row.replace(pattern, function($0, $1) {
          // 如果不是云点
          return params[$1] || '';
        });
      });
      return obj;
    };

    this.createObjectWithChain = (function() {
      function PropFunction(props) {
        var _this = this;
        for (var p in props) {
          // 这里需要去访问继承链上的属性，所以不用 hasOwnProperty
          _this[p] = props[p];
        }
      }

      return function(props) {
        PropFunction.prototype = this.screen.variables || {};
        return new PropFunction(props);
      };
    })();

    // 判断某个控件是否在某种类型的容器内
    // 示例：判断某个控件是否在章节容器中 - isIn('ChapterContainer')
    this.isIn = function(type) {
      var parent, find;

      if (typeof type !== 'string') {
        return false;
      }

      if (this === this.root) {
        return false;
      }

      find = false;
      parent = this.screen;

      while (parent !== null) {
        if (parent.optionTemplate.type === type) {
          find = true;
          break;
        }
        if (parent === this.root) {
          return false;
        }
        parent = parent.screen;
      }

      return find;
    };

    /**
     * 将当前控件导出成模板
     * @param {name} 导出模板的名称
     * @return
     */
    this.export = function(name) {
      alert(I18n.resource.report.NOT_SUPPORT_EXPORT);
    };

    /**
     * 指示当前是否有章节号，默认为有
     * @return {Boolean} true 为有，false为无
     */
    this.hasChapterNo = function() {
      return true;
    };

    /**
     * 指示当前控件是否只读
     */
    this.isReadonly = function() {
      // 根据父容器的 isChildrenReadonly 方法进行判断
      if (this === this.root) {
        return false;
      }
      if (this.entity.modal && this.entity.modal.isReadonly) {
        return true;
      }
      return this.screen.isChildrenReadonly();
    };

    this.destroy = function() {};

    this.clear = function() {};
  }.call(Base.prototype);

  exports.Base = Base;
})(
  namespace('factory.report.components'),
  namespace('factory.report.components.Component'),
  namespace('factory.report.modals.LayoutsConfigModal'),
  DateUtil
);
