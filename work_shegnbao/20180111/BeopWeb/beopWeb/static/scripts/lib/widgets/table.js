(function ($, undefined) {

    var util = {
        string: {
            formatEL: function (str, o) {
                if(!str || !o) return '';

                for (var i in o) {
                    if (o.hasOwnProperty(i)) {
                        str = str.replace(new RegExp('{'+i+'}', 'g'), o[i]);
                    }
                }
                return str;
            }
        }
    };

    function Table(ele, options) {
        var $ele = this.$tblBody = $(ele);
        var id = $ele.attr('id');
        this.options = $.extend({}, Table.DEFAULTS, options);
        // table wrap
        this.$wrap = $('<div class="ui-tbl-w"></div>').insertAfter($ele);
        // table header wrap
        this.$hWrap = $('<div class="ui-tbl-whead"></div>').appendTo(this.$wrap);
        // table body wrap
        this.$bWrap = $('<div class="ui-tbl-wbody"></div>').appendTo(this.$wrap);
        // table footer wrap
        this.$fWrap = $('<div class="ui-tbl-wfoot"></div>').appendTo(this.$wrap);

        // table header
        this.$tblHeader = $('<table class="ui-tbl-htable table table-bordered">')
            .appendTo(this.$hWrap);
        // table body
        this.$tblBody = $ele.addClass('ui-tbl-btable table table-bordered')
            .appendTo(this.$bWrap);
        // table footer
        this.$tblFooter = $('<div class="ui-tbl-footer">').appendTo(this.$fWrap);

        // thead
        this.$thead = $('<thead>').appendTo(this.$tblHeader);
        // tbody
        this.$tbody = $('<tbody>').appendTo(this.$tblBody);

        typeof id === 'string' && this.$tblBody.attr('id', id);

        this.data = null;
        this.total = null;

        this._buildHeader();
    }

    Table.prototype._buildHeader = function () {
        var prefix = this.options.colPrefix;
        var cols = this.options.columns;
        var arrHtml = [];
        arrHtml.push('<tr>');
        for (var i = 0, len = cols.length; i < len; i++) {
            arrHtml.push(
                util.string.formatEL('<th class="{prefix}{name}">{title}</th>', 
                    {prefix: prefix, name: cols[i].name, title: cols[i].title})
            );
        }
        arrHtml.push('</tr>');
        this.$thead.html(arrHtml.join(''));
    };

    Table.prototype._buildFooter = function (ds) {
        var tpl = this.options.footerTpl;
        this.$tblFooter.html(
            util.string.formatEL(tpl, {total: ds.length})
        ).show();
    };

    // loading
    Table.prototype.loading = function () {
        // hide table footer
        this.$tblFooter.hide();
        this.$tbody.html('<tr><td class="ui-tbl-col-i-info" col-span="'+this.options.columns.length+'"><img src="/static/images/ballsline.gif" alt="loading" /></td></tr>');
    };

    Table.prototype.load = function (ds) {
        this._renderTable(ds);

        // initialize pagin info
        this.total = ds.length;
        this.data = ds;
    };

    Table.prototype._renderTable = function (ds) {
        var arrHtml   = [];
        var row       = null;
        var cssCls    = null;
        var formatter = null;
        var column    = null;

        if(!ds || ds.length <= 0) {
            this._showNoData();
            return;
        }

        // load table body
        for (var i = 0, leni = ds.length; i < leni; i++) {
            row = ds[i];

            arrHtml.push('<tr data-rowindex="'+i+'">');
            for (var t = 0, lent = this.options.columns.length; t < lent; t++) {
                column = this.options.columns[t];
                cssCls = this.options.colPrefix + column.name;
                arrHtml.push('<td class="'+cssCls+'">');
                switch(typeof column.formatter) {
                    case 'string':
                        arrHtml.push(util.string.formatEL(column.formatter, row));
                        break;
                    case 'function':
                        arrHtml.push(column.formatter(i, row) || '');
                        break;
                }
                arrHtml.push('</td>');
            }
            arrHtml.push('</tr>');
        }
        this.$tbody.html(arrHtml.join(''));

        // load table foot
        this._buildFooter(ds);
    };

    Table.prototype.filter = function (rule) {
        var ds = this.data;
        var result = [];

        if(!rule) {
            result = ds;   
        } else {
            for (var i = 0, len = ds.length; i < len; i++) {
                for (var r in rule) {
                    if (ds[i].hasOwnProperty(r)) {
                        if(ds[i][r].toLowerCase().indexOf(rule[r].toLowerCase()) > -1) {
                            result.push(ds[i]);
                        }
                    }
                }
            }
        }

        this._renderTable(result);
    };

    Table.prototype.setStretchHeight = function (l) {
        this.$bWrap.css('height', l);
    };

    Table.prototype.getData = function () {
        return this.data;
    };

    Table.prototype._showNoData = function () {
        // hide table footer
        this.$tblFooter.hide();
        this.$tbody.html('<tr><td class="ui-tbl-col-i-info" col-span="'+this.options.columns.length+'">no records</td></tr>');
    };

    Table.prototype.destroy = function () {};

    Table.DEFAULTS = {
        colPrefix: 'ui-tbl-col-',
        footerTpl: '<strong>{total}</strong> records in total'
    };

    // TABLE PLUGIN DEFINITION
    // =========================
    function Plugin(option, args) {
        var $this    = this;
        var data     = $this.data('ui.w.table');
        var options  = typeof option == 'object' && option;

        if (!data && option == 'destroy') return;
        if (!data) $this.data('ui.w.table', (data = new Table(this, options)));
        if (typeof option == 'string') return data[option](args);
    }

    $.fn.table = Plugin;

} (jQuery));