(function(exports, SuperClass) {
  function DynamicTable() {
    SuperClass.apply(this, arguments);

    this.store = null;
  }

  DynamicTable.prototype = Object.create(SuperClass.prototype);

  +function() {
    this.constructor = DynamicTable;

    this.optionTemplate = Mixin(this.optionTemplate, {
      group: '基本',
      name: 'I18n.resource.report.optionModal.DYNAMIC_TABLE',
      minWidth: 6,
      minHeight: 5,
      maxWidth: 12,
      maxHeight: 15,
      type: 'DynamicTable'
    });

    this._getStyle = function(styleOpt) {
      styleOpt = styleOpt || {};
      var arr = [];
      for (var field in styleOpt) {
        if (styleOpt.hasOwnProperty(field)) {
          arr.push(field + ':' + styleOpt[field]);
        }
      }
      return arr.join(';');
    };

    /* override */
    this.initResizer = function() {};

    /** @override */
    this.resize = function() {
      var ele = this.container.parentNode;
      ele.style.height = 'auto';
    };

    /** @override */
    this.render = function(isProcessTask) {
      var _this = this;
      if (!this.entity.modal.variables.hasOwnProperty('_table_')) {
        this.container.innerHTML = '未配置数据源';
        return;
      }
      var promise = $.Deferred();
      this.registVariableProcessTask(this.entity.modal.variables).done(
        function() {
          promise.resolve();
        }.bind(this)
      );

      promise.done(
        function() {
          var variables = this.variables;
          if (typeof variables['_table_'] !== 'object') {
            this.container.innerHTML = '配置数据有误';
            return;
          }

          var data;
          try {
            data = JSON.parse(variables['_table_'].data); // data
          } catch(e) {
            this.container.innerHTML = '配置数据有误';
            return;
          }

          var arrHtml = ['<table>'];
          if (data.caption) {
            arrHtml.push(
              '<caption{style}>'.formatEL({
                style: data.caption.style
                  ? ' style="' + _this._getStyle(data.caption.style) + ';"'
                  : ''
              })
            );
            arrHtml.push(data.caption.val);
            arrHtml.push('</caption>');
          }
          if (data.headers && data.headers.length) {
            arrHtml.push('<thead>');
            data.headers.forEach(function(row) {
              arrHtml.push('<tr>');
              row.forEach(function(subRow) {
                arrHtml.push(
                  '<th{col}{row}{style}>{val}</th>'.formatEL({
                    col: subRow.col ? ' colspan="' + subRow.col + '"' : '',
                    row: subRow.row ? ' rowspan="' + subRow.row + '"' : '',
                    val: subRow.val,
                    style: subRow.style
                      ? ' style="' + _this._getStyle(subRow.style) + ';"'
                      : ''
                  })
                );
              });
              arrHtml.push('</tr>');
            });
            arrHtml.push('</thead>');
          }
          if (data.rows && data.rows.length) {
            arrHtml.push('<tbody>');
            data.rows.forEach(function(row) {
              arrHtml.push('<tr>');
              row.forEach(function(subRow) {
                arrHtml.push(
                  '<th{col}{row}{style}>{val}</th>'.formatEL({
                    col: subRow.col ? ' colspan="' + subRow.col + '"' : '',
                    row: subRow.row ? ' rowspan="' + subRow.row + '"' : '',
                    val: subRow.val,
                    style: subRow.style
                      ? ' style="' + _this._getStyle(subRow.style) + ';"'
                      : ''
                  })
                );
              });
              arrHtml.push('</tr>');
            });
            arrHtml.push('</tbody>');
          }
          arrHtml.push('</table>');

          this.container.innerHTML = arrHtml.join('');
        }.bind(this)
      );

      if (isProcessTask === true) {
        this.root.processTask();
      }
    };

    /** @override */
    this.initTools = function(tools) {
      tools = tools || ['variable', 'remove'];
      SuperClass.prototype.initTools.call(this, tools);
    };

    /** @override */
    this.destroy = function() {};
  }.call(DynamicTable.prototype);

  exports.DynamicTable = DynamicTable;
})(
  namespace('factory.report.components'),
  namespace('factory.report.components.Base')
);
