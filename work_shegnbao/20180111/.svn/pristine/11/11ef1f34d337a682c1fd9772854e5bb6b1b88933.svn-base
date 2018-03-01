/**
 * Created by win7 on 2016/9/22.
 */

;
(function ($, window, document, undefined) {

    "use strict";
    var languagePage = {
        'zh-CN': {
            TOTAL_NUM: '共有 {0} 项',
            ROW_NUM_PER_PAGE: ' 项每页',
            PAGINATION_FIRST: '<<',
            PAGINATION_PREV: '<',
            PAGINATION_NEXT: '>',
            PAGINATION_LAST: '>>'
        },
        'en-US': {
            TOTAL_NUM: 'Total {0} items ',
            ROW_NUM_PER_PAGE: ' rows per page',
            PAGINATION_FIRST: '<<',
            PAGINATION_PREV: '<',
            PAGINATION_NEXT: '>',
            PAGINATION_LAST: '>>'
        }
    };

    var util = {
        log_flag: ' {0} {1} [SimpleDataTable] {2}',
        formatString: function (format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        },
        log: function (msg) {
            console.log(this.formatString(this.log_flag, new Date().toLocaleTimeString(), '[LOG]', msg));
        },
        getScrollBarWidth: function () {
            var $outer = $('<div class="gray-scrollbar">').css({
                    visibility: 'hidden',
                    width: 100,
                    overflow: 'scroll'
                }).appendTo('body'),
                widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
            $outer.remove();
            return 100 - widthWithScroll;
        }
    };

    var pluginName = "simpleDataTable",
        defaults = {
            template: "<div class='widget-sdt-container fixed-header-table'>" +
            "    <div class='widget-sdt-footer-header clearfix'>" +
            "        <div class='widget-sdt-footer-header-left'></div>" +
            "        <div class='widget-sdt-footer-header-right'>" +
            "            <div class='input-group widget-sdt-search-container'>" +
            "                <input class='form-control' placeholder='search' id='widget-sdt-search'>" +
            "                <span class='input-group-addon'><span class='glyphicon glyphicon-zoom-in'></span></span>" +
            "            </div>" +
            "        </div>" +
            "    </div>" +
            "    <div class='table-header'>" +
            "        <table>" +
            "            <thead></thead>" +
            "        </table>" +
            "    </div>" +
            "    <div class='table-body gray-scrollbar'>" +
            "        <table class='table widget-sdt-table'>" +
            "            <tbody></tbody>" +
            "        </table>" +
            "    </div>" +
            "    <div class='table-footer widget-sdt-footer'>" +
            "        <div class='widget-sdt-footer-left'>" +
            "            <div class='widget-sdt-total'></div>" +
            "            <div class='widget-sdt-rows-selector-container'>" +
            "                <span class='widget-sdt-rows-selector fl'></span>" +
            "                <span class='widget-sdt-rows-selector-text fl ml10 mt10'></span>" +
            "            </div>" +
            "        </div>" +
            "        <div class='widget-sdt-footer-right'>" +
            "            <div class='widget-sdt-paging'></div>" +
            "        </div>" +
            "    </div>" +
            "</div>",
            data: [],
            url: null,
            method: 'post',
            postData: {},
            tableClass: 'table-bordered table-striped',
            dataType: null,
            dataFilter: $.noop,
            isSearch: true,
            isPaging: true,
            isOrdering: true,
            searchIn: null,
            rowsNums: [10, 20, 30],
            colNames: [],
            //{name,index,width,sortType,formatter,editable}
            colModel: [],
            caption: '',
            sortName: null,
            sortOrder: null,
            language: 'en-US',
            languagePage: languagePage,
            post: $.post,
            get: $.get,
            onBeforeRender: null,
            onAfterRender: null,
            searchInput: null,
            first: null,
            prev: null,
            next: null,
            last: null,
            onRowClick: null,
            onRowDbClick: null,
            onShowMore: null
        };

    var showKey = '_sdtShowNotConflict';

    // The actual plugin constructor
    function Plugin(element, options) {
        var self = this;
        self.el = element;
        self.$el = $(self.el);

        self.settings = $.extend({}, defaults, options);
        self._name = pluginName;
        self.id = new Date().getTime();

        var searchText, pageNum = 1, pageSize, itemList, totalItems = [], searchOrder;
        searchText = this.settings.searchOptions ? self.settings.postData[self._getSearchField('searchText')] : self.settings.postData.searchText;
        self.search = {
            set searchText(text) {
                searchText = text;
                this.pageNum = 1;
            },
            get searchText() {
                if (searchText) {
                    return searchText.trim ? searchText.trim() : searchText;
                } else {
                    return null;
                }
            },
            set pageNum(num) {
                try {
                    pageNum = num;
                } catch (e) {
                    pageNum = 1;
                }
                if (self.settings.url) {
                    self._requestAsyncData();
                } else {
                    self._pageData();
                }
            },
            get pageNum() {
                return pageNum;
            },
            set pageSize(size) {
                try {
                    pageSize = parseInt(size);
                } catch (e) {
                    self.settings.pageSizeIndex = self.settings.pageSizeIndex ? self.settings.pageSizeIndex : 0;
                    pageSize = self.settings.rowsNums[self.settings.pageSizeIndex];
                }
                this.pageNum = 1;
                self._initPaging();
            },
            get pageSize() {
                if (pageSize) {
                    return pageSize;
                }
                if (self.settings.pageSizeIndex) {
                    self.settings.pageSizeIndex = self.settings.pageSizeIndex ? self.settings.pageSizeIndex : 0;
                    pageSize = self.settings.rowsNums[self.settings.pageSizeIndex];
                } else {
                    for (var i = 0; i < self.settings.rowsNums.length; i++) {
                        var rowsNum = self.settings.rowsNums[i];
                        if (rowsNum == self.settings.pageSize) {
                            self.settings.pageSizeIndex = rowsNum;
                        }
                    }
                    if (!self.settings.pageSizeIndex) {
                        self.settings.pageSizeIndex = 0;
                        self.settings.pageSize = self.settings.rowsNums[self.settings.pageSizeIndex];
                    }
                    pageSize = parseInt(self.settings.pageSize);
                }
                return pageSize;
            },
            set order(order) {
                searchOrder = order;
                if (self.settings.url) {
                    self._requestAsyncData();
                }
            },
            get order() {
                return searchOrder;
            }
        };
        self.data = {
            set items(items) {
                itemList = items;
                self.refreshBody();
            },
            get items() {
                return itemList;
            },
            set totalItems(tItems) {
                var oldTotalItems = totalItems;
                totalItems = tItems;
                this.totalNum = totalItems.length;
                if (oldTotalItems.length != totalItems.length) {
                    self._initPaging();
                }
                self._pageData();
            },
            get totalItems() {
                return totalItems;
            },
            totalNum: 0

        };
        self.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            var self = this;
            self._initI18n();
            self._createTable();
            self._initHeader();
            self._addFilterEvent();
            self._prepareData().done(function () {
                self._makeHeaderFix();
            });
            self._initFooter();
            self._attachEvent();
            self.$el.append(self.$dataTable);
            self._styleAdjustment();
        },
        _styleAdjustment: function () {
            var $scrollContainer = this.$dataTable.find('.gray-scrollbar');
            if ($scrollContainer[0].scrollHeight > $scrollContainer[0].clientHeight) {
                this.$dataTable.find('.table-header').css('padding-right', '23px');
            } else {
                this.$dataTable.find('.table-header').css('padding-right', '15px');
            }
            $scrollContainer.scrollTop(0);
        },
        _getSearchField: function (fieldName) {
            return this.settings.searchOptions && this.settings.searchOptions[fieldName] ? this.settings.searchOptions[fieldName] : fieldName;
        },
        _addFilterEvent: function () { // 绑定筛选事件
            var self = this;
            if (!self.settings.filters || !self.settings.filters.length) {
                return;
            }

            for (var i = 0; i < self.settings.filters.length; i++) {
                var item = self.settings.filters[i];
                if (item && item.element) {
                    item.element.each(function (index, elementItem) {
                        $(elementItem).off().on(item.event || 'click', function () {
                            self.search.pageNum = 1;
                        });
                    })
                }
            }
        },
        _addFilterParam: function () { // 获取筛选参数
            if (!this.settings.filters || !this.settings.filters.length) {
                return;
            }
            for (var i = 0; i < this.settings.filters.length; i++) {
                var item = this.settings.filters[i];
                if (item.callback) {
                    this.settings.postData[item.param] = item.callback(item.element.val(), item.element);
                } else {
                    if (item.type == 'checkbox') {
                        this.settings.postData[item.param] = item.element.is(':checked') ? true : false;
                    } else if (item.type == 'radio') {
                        var val = item.element.filter(':checked').val();
                        if (item.converter && typeof item.converter === 'function') {
                            val = item.converter(val);
                        }
                        if (typeof val === typeof undefined) {
                            try {
                                delete this.settings.postData[item.param];
                            } catch (e) {
                                console.log(e);
                            }
                        } else {
                            this.settings.postData[item.param] = val;
                        }
                    }
                }
            }
        },
        _requestAsyncData: function () {
            var self = this;
            self._addFilterParam();
            self.settings.postData[self._getSearchField('pageSize')] = self.search.pageSize;
            self.settings.postData[self._getSearchField('pageNum')] = self.search.pageNum;
            self.settings.postData[self._getSearchField('searchText')] = self.search.searchText;
            self.settings.postData[self._getSearchField('searchOrder')] = self.search.order;
            if (self.settings.onBeforeRender && typeof self.settings.onBeforeRender === 'function') {
                self.settings.onBeforeRender(self);
            }
            return self.settings.post(self.settings.url, self.settings.postData).done(function (result) {
                if (self.settings.dataFilter && typeof self.settings.dataFilter === 'function') {
                    self.data.items = self.settings.dataFilter(result);

                    if (self.settings.totalNumIndex) {
                        if (typeof self.settings.totalNumIndex === 'function') {
                            self.data.totalNum = self.settings.totalNumIndex(result);
                        } else {
                            self.data.totalNum = self._nestedIndex(result, self.settings.totalNumIndex);
                        }
                    }
                    self._initTotalNum();
                    self._initPaging()
                }
            }).always(function () {
                if (self.settings.onAfterRender && typeof self.settings.onAfterRender === 'function') {
                    self.settings.onAfterRender(self);
                }
            })
        },
        _prepareData: function () {
            if (this.settings.url) {
                return this._requestAsyncData();
            } else {
                var defer = $.Deferred();
                this._calcTotalPage();
                this._searchInArray();
                this.refreshBody();
                this._initTotalNum();
                return defer.resolve();
            }
        },
        _searchInArray: function () {
            if (!this.search.searchText) {
                this.data.items = this.settings.data;
            } else {
                var searchKeyList = this.search.searchText.split ? this.search.searchText.split(/\s+/g) : this.search.searchText;
                var searchRegex = new RegExp(searchKeyList.join('.*'), 'i');

                var result = [];
                if (this.settings.searchIn) {

                } else {
                    for (var i = 0; i < this.settings.data.length; i++) {
                        var data = this.settings.data[i];
                        var isMatched = false, newData = {};
                        for (var prop in data) {
                            if (!data.hasOwnProperty(prop)) {
                                continue;
                            }
                            var value = data[prop];
                            newData[prop] = value;
                            if (searchRegex.test(data[prop])) {
                                isMatched = true;
                                for (var j = 0; j < searchKeyList.length; j++) {
                                    var searchKey = searchKeyList[j];
                                    value = value.replace(new RegExp("(" + searchKey + ")(?![^<]*>|[^<>]*</)", "gi"), '<span class="keyword">$1</span>');
                                }
                                newData[prop + showKey] = value;
                            }
                        }
                        if (isMatched) {
                            result.push(newData);
                        }
                    }
                    this.data.items = result;
                }
            }
            this.data.totalItems = this.data.items;
            this._pageData();
        },
        _calcTotalPage: function () {
            var totalPage = Math.ceil(this.data.totalNum / this.search.pageSize);
            return totalPage ? totalPage : 1;
        },
        _pageData: function () {
            this.data.items = this.data.totalItems.slice(
                (this.search.pageNum - 1) * this.search.pageSize,
                this.search.pageNum * this.search.pageSize);
        },
        _createTable: function () {
            this.$dataTable = $(this.settings.template);
            if (this.settings.tableClass) {
                this.$dataTable.find('table').removeClass().addClass('table ' + this.settings.tableClass);
            }
            if (this.settings.isSearch) {
                if (this.settings.searchInput) {
                    this.$searchInput = $(this.settings.searchInput);
                    this.$searchIco = this.$searchInput.siblings('.icon.iconfont');
                } else {
                    this.$searchInput = this.$dataTable.find('.widget-sdt-search-container').css('display', 'table');
                }
            }
        },
        _initI18n: function () {
            try {
                var language = I18n.type === 'zh' ? 'zh-CN' : 'en-US';
                this.i18n = this.settings.languagePage[language];
            } catch (e) {
                this.i18n = defaults.languagePage[defaults.language];
            }
        },
        _initHeader: function () {
            var html = '<tr>';
            if (this.settings.showLineNum) {
                html += '<th style="width:43px;" data-width="43px;">序号</th>';
            }
            for (var i = 0; i < this.settings.colNames.length; i++) {
                var col = this.settings.colModel[i];
                var colName = this.settings.colNames[i];
                html += '<th';
                if (col.width) {
                    html += ' style="width:' + col.width + '" data-width="' + col.width + '"';
                }
                if (colName == 'checkbox') {
                    html += ' ><input type="checkbox" class="selectAll" /></th>';
                } else {
                    html += ' >' + colName + '</th>';
                }

            }
            html += '</tr>';
            this.$dataTable.find('.table-header thead').html(html);
        },
        _nestedIndex: function (data, index) {
            var ret = data;
            if (/\./.test(index)) {
                var indexList = index.split(/\./g);
                for (var i = 0; i < indexList.length; i++) {
                    if (!ret) {
                        return ret;
                    }
                    ret = ret[indexList[i]];
                }
            } else {
                ret = data[index];
            }

            if (ret === 0) {
                return 0;
            } else {
                return ret ? ret : '';
            }
        },
        _initRow: function (rowData, lineNum) {
            var colModel = this.settings.colModel, html = '<tr>';
            if (this.settings.rowIdKey) {
                html = '<tr id="' + rowData[this.settings.rowIdKey] + '">';
            }

            if (this.settings.showLineNum) {
                html += '<td style="width:43px;" data-width="43px;">' + lineNum + '</td>';
            }

            for (var i = 0; i < colModel.length; i++) {
                var col = colModel[i];
                var value = '';
                var style = [];
                if (col.index) {
                    if (typeof this._nestedIndex(rowData, col.index) !== typeof '') {
                        value = this._nestedIndex(rowData, col.index);
                    } else {
                        if (this._nestedIndex(rowData, col.index + showKey)) {
                            value += this._nestedIndex(rowData, col.index + showKey);
                        } else if (this._nestedIndex(rowData, col.index) !== undefined) {
                            value += this._nestedIndex(rowData, col.index);
                        }
                    }
                } else {
                    value = '';
                }


                if (col.highlight) {
                    col.html = true;//如果是显示高亮当前列默认设置支持html配置
                    value = this._highlight(value);
                }
                if (col.style) {
                    style.push(col.style(value));
                }
                if (col.converter) {
                    value = col.converter(value, rowData);
                }
                if (!col.html) {
                    try {
                        html += '<td title="' + (StringUtil ? StringUtil.htmlEscape(value) : value) + '"';
                    } catch (e) {
                        html += '<td title="' + value + '"';
                    }
                } else {
                    html += '<td';
                }

                if (col.type == 'int' || col.type == 'float') {
                    if (col.type == 'int' || col.type == 'float') {
                        style.push('text-align: right;');
                    }
                }
                if (style.length) {
                    html += ' style="';
                    for (var s = 0, sLen = style.length; s < sLen; s++) {
                        html += style[s];
                    }
                    html += '"';
                }
                html += '><div style="display:flex"><span class="ellipsis ';
                if (col.itemClass) {
                    html += col.itemClass + '" style="flex:1">';
                } else {
                    html += '" style="flex:1">';
                }

                if (!col.html) {
                    try {
                        html += (StringUtil ? StringUtil.htmlEscape(value) : value);
                    } catch (e) {
                        html += value;
                    }
                } else {
                    html += value;
                }

                html += '</span>';
                if (col.copy && value && value.length > 15) {
                    html += '<span class="show-more"><span class="icon iconfont"></span></span>';
                }
                if (col.isCheckColumn) {
                    html += '<input type="checkbox" class="checkbox-single" />';
                }
                if (col.checkbox) {
                    html += '<input type="checkbox" class="simple-table-checkbox" ';
                    if (col.disabled) {
                        html += 'disabled';
                    }
                    if (col.checkboxParam && rowData[col.checkboxParam]) {
                        html += ' checked'
                    }
                    html += ' />';
                }
                html += '</div></td>';
            }
            html += '</tr>';
            return html;
        },

        _initFooter: function () {

            if (this.settings.rowsNums) {
                this._initRowsNum(this.settings.rowsNums);
            }

            this._initTotalNum();
        },
        _initPaging: function () {
            var self = this;
            if (!this.settings.isPaging) {
                return false;
            }
            if (this.$pagination) {
                this.$pagination.twbsPagination('destroy');
            }
            var paginationOptions = {
                totalPages: this._calcTotalPage(),
                visiblePages: 5,
                first: this.settings.first ? this.settings.first : this.i18n.PAGINATION_FIRST,
                prev: this.settings.prev ? this.settings.prev : this.i18n.PAGINATION_PREV,
                next: this.settings.next ? this.settings.next : this.i18n.PAGINATION_NEXT,
                last: this.settings.last ? this.settings.last : this.i18n.PAGINATION_LAST,
                onPageClick: function (event, page) {
                    if (self.search.pageNum !== parseInt(page)) {
                        self.search.pageNum = parseInt(page);
                    }
                }
            };
            if (this.search.pageNum) {
                paginationOptions['startPage'] = this.search.pageNum > this._calcTotalPage() ? 1 : this.search.pageNum;
            }
            this.$pagination = this.$dataTable.find('.widget-sdt-paging').twbsPagination(paginationOptions);
        },
        _initRowsNum: function () {
            var html = '<select class="pageSizeSelect form-control">';
            for (var i = 0; i < this.settings.rowsNums.length; i++) {
                var rowsNum = this.settings.rowsNums[i];
                if (rowsNum === this.search.pageSize) {
                    html += '<option value="' + rowsNum + '" selected>' + rowsNum + '</option>';
                } else {
                    html += '<option value="' + rowsNum + '">' + rowsNum + '</option>';
                }
            }
            html += '</select>';
            this.$dataTable.find('.widget-sdt-rows-selector-text').text(this.i18n.ROW_NUM_PER_PAGE);
            this.$dataTable.find('.widget-sdt-rows-selector').html(html);
        },
        _initTotalNum: function () {
            this.data.totalNum = this.data.totalNum ? this.data.totalNum : 0;
            var num = '<span class="widget-sdt-total-num">' + this.data.totalNum + '</span>';
            this.$dataTable.find('.widget-sdt-total').html(util.formatString(this.i18n.TOTAL_NUM, num));
        },

        setCaption: function (caption) {
            this._setSetting('caption', caption);
            this.$el.text(this.settings.caption);
        },
        _setSetting: function (key, settingItem) {
            if (key && settingItem) {
                this.settings[key] = settingItem;
            }
        },
        _selectRow: function ($row) {
            if (!$row) {
                return;
            }
            $row.addClass('active');
        },
        _replaceHighlightText: function (value, key) {
            var keywordList = key.replace ? key.replace('/[^\w\d\s]/g', ' ').split(/\s/g) : key.searchText;
            var ret = value;
            keywordList.forEach(function (char) {
                if (char) {
                    ret = ret.replace(new RegExp("(" + char + ")(?![^<]*>|[^<>]*</)", "gi"), '<span class="keywords-text">$1</span>');
                }
            });
            return ret;
        },
        _highlight: function (value) {
            if (!value || typeof value !== typeof '') {
                return value;
            }
            var text = value;
            if ($.isArray(this.search.searchText)) {
                for (var i = 0; i < this.search.searchText.length; i++) {
                    if (!this.search.searchText[i]) {
                        continue;
                    }
                    text = this._replaceHighlightText(text, this.search.searchText[i]);
                }
            } else {
                if (this.search.searchText) {
                    text = this._replaceHighlightText(text, this.search.searchText);
                }
            }
            return text;
        },
        _attachEvent: function () {
            var self = this;
            /**
             * 搜索
             */
            if (self.$searchInput) {
                self.$searchInput.off('keydown').on('keydown', function (e) {
                    if (e.keyCode == 13) {
                        var val = $(this).val();
                        self.search.searchText = val;
                        util.log('search ' + val);
                    }
                });
                self.$searchIco.off('click').on('click', function () {
                    var val = self.$searchInput.val();
                    self.search.searchText = val;
                    util.log('search ' + val);
                });
            }
            /**
             * 改变每页数量
             */
            self.$el.on('change', '.widget-sdt-rows-selector select', function () {
                self.search.pageSize = $(this).val();
            });
            /**
             * 单击table row
             */
            self.$el.on('click', '.table-body tr', function (e) {//单击table row
                var $target = $(e.target);
                if ($target.hasClass('inactive')) {
                    return;
                }
                var $this = $(this);
                if (e.ctrlKey) {
                    if ($this.hasClass('active')) {
                        $this.removeClass('active');
                    } else {
                        self._selectRow($this);
                    }
                } else if (e.shiftKey) {
                    var allSelectedRow = self.$dataTable.find('.table-body .active');
                    if (!allSelectedRow.length) {
                        self._selectRow($this);
                    } else {
                        var $allRows = self.$dataTable.find('.table-body tr');
                        var selectedMinIndex = $allRows.index(allSelectedRow[0]),
                            selectedMaxIndex = $allRows.index(allSelectedRow[allSelectedRow.length - 1]);
                        var minIndex = Math.min($this.index(), selectedMinIndex), maxIndex = Math.max($this.index(), selectedMaxIndex);

                        for (; minIndex < maxIndex + 1; minIndex++) {
                            self._selectRow($($allRows[minIndex]));
                        }
                    }
                } else {
                    $this.parents('.fixed-header-table').find('.table-body .active').removeClass('active');
                    self._selectRow($this);
                }

                if (self.settings.onRowClick && typeof self.settings.onRowClick === 'function') {
                    self.settings.onRowClick(this, $(this).data('value'));
                }
                if (e.shiftKey) {
                    try {
                        window.getSelection().removeAllRanges();
                    } catch (e) {
                    }
                }
            });
            self.$el.on('click', '.show-more', function (e) {
                if (self.settings.onShowMore && typeof self.settings.onShowMore === 'function') {
                    self.settings.onShowMore(this, $(this).closest('tr').data('value'), e);
                }
            });
            self.$el.on('click', '.simple-table-checkbox', function (e) { // 非第一列静态checkbox
                if (self.settings.onCheckboxSelect && typeof self.settings.onCheckboxSelect === 'function') {
                    self.settings.onCheckboxSelect(this, $(this).closest('tr').data('value'), e);
                }
            });
            self.$el.on('click', '.checkbox-single', function (e) { // 第一列静态checkbox
                var $selectAll = self.$el.find('.selectAll');
                if ($(this).is(':checked')) {
                    var isALlSelectFlag = true, $checkbox = self.$el.find('.checkbox-single');
                    for (var i = 0; i < $checkbox.length; i++) {
                        if (!$checkbox.eq(i).is(':checked')) {
                            isALlSelectFlag = false;
                        }
                    }
                    if (isALlSelectFlag) {
                        $selectAll.prop('checked', true);
                    }
                } else {
                    $selectAll.prop('checked', false);
                }
            });

            /**
             * 双击table row
             */
            self.$el.on('dblclick', '.table-body tr', function (e) {
                if (self.settings.onRowDbClick && typeof self.settings.onRowDbClick === 'function') {
                    self.settings.onRowDbClick(this, $(this).data('value'), e, self);
                }
            });

            /**
             * 点击table checkbox
             */
            self.$el.on('click', '.selectAll', function (e) {
                var $checkbox = self.$el.find('.checkbox-single');
                $(this).is(':checked') ? $checkbox.prop('checked', true) : $checkbox.prop('checked', false);

            });

        },
        _makeHeaderFix: function () {
            var self = this;
            var $headers = this.$el.find('.table-header th');
            var $tableHeader = this.$el.find('.table-header');

            function setPixelWidths(i, pixelWidth) {
                $headers.eq(i).css('width', pixelWidth);
                self.$el.find('.table-body tr:first td').eq(i).css('width', pixelWidth);
            }

            function setPercentageWidths(i, widthPercent) {
                var percentWidth = (widthPercent / self.$el.outerWidth()) * 100;
                percentWidth = percentWidth.toFixed(2);
                $headers.not(':last-child').eq(i).css('width', percentWidth + '%')
                    .data('width', percentWidth + '%')
                    .attr('data-width', percentWidth + '%');
                self.$el.find('.table-body tr:first td:not(:last-child)').eq(i).css('width', percentWidth + '%');
            }

            $headers.each(function (idx) {
                var $header = $(this);
                var startX = null;
                var $resizeHandle = $("<div class='resize-handle'></div>");

                // Initialize widths to percentages
                var width = $header.data('width');
                if (width) {
                    if (width.indexOf && width.indexOf('px') != -1) {
                        setPixelWidths(idx, width)
                    } else if (width.indexOf && width.indexOf('%') != -1) {
                        setPercentageWidths(idx, width.substring(0, width.indexOf('%')) * $tableHeader.width() / 100);
                    } else {
                        setPercentageWidths(idx, width * $tableHeader.width() / 100);
                    }

                } else {
                    // setPercentageWidths(idx, $header.outerWidth());
                }

                // Add resize handle with drag handler
                $(this).append($resizeHandle.on('mousedown', onDragStart));

                function adjustWidth(offset) {
                    var column_width = $header.outerWidth() - offset;
                    if (column_width <= 8) {
                        return;
                    }
                    console.log($header.outerWidth() + ', ' + offset + ', ' + column_width);
                    setPixelWidths(idx, column_width + 'px');
                }

                function onDragStart(e) {
                    $resizeHandle.addClass('dragging');
                    startX = e.screenX;

                    $(window).on('mousemove', onDrag).on('mouseup', onDragEnd);

                    return false;
                }

                function onDrag(e) {
                    adjustWidth(startX - e.screenX);
                    startX = e.screenX;
                }

                function onDragEnd(e) {
                    $resizeHandle.removeClass('dragging');

                    setPercentageWidths(idx, $header.outerWidth());
                    $(window).off('mousemove', onDrag).off('mouseup', onDragEnd);
                }
            });
        },
        /**
         * 设置搜索项
         * @param option
         * @param value
         */
        setSearch: function (option, value) {
            if (this.search.hasOwnProperty(option)) {
                this.search[option] = value;
            }
        },
        /**
         *获取checkbox选中的行
         * @returns {Array}
         */
        getCheckedRows: function () {
            var ret = [];
            this.$el.find('.checkbox-single:checked').each(function (index, item) {
                ret.push($(item).closest('tr').data('value'));
            });
            return ret;
        },
        /**
         *获取选择的行
         * @returns {Array}
         */
        getSelectedRows: function () {
            return this.$dataTable.find('.table-body tbody tr.active');
        },

        /**
         *获取全部的tr
         * @returns {Array}
         */
        getAllRows: function () {
            return this.$dataTable.find('.table-body tbody tr');
        },

        /**
         * 全选行
         */
        selectAll: function () {
            this.$dataTable.find('.table-body tbody tr').removeClass('active').addClass('active');
        },

        /**
         * 反选行
         */
        reverseSelect: function () {
            var $allRows = this.$dataTable.find('.table-body tbody tr');
            for (var i = 0, len = $allRows.length; i < len; i++) {
                if ($($allRows[i]).hasClass('active')) {
                    $($allRows[i]).removeClass('active');
                } else {
                    $($allRows[i]).addClass('active');
                }
            }
        },

        /** 获取全部点个数
         *
         */
        getAllNodesNum: function () {
            return this.data.totalNum;
        },

        /**获取选择的行数据
         *
         * @returns {*}
         */
        getSelectedData: function () {
            var ret = [];
            this.$el.find('.table-body tbody tr.active').each(function (index, item) {
                ret.push($(item).data('value'));
            });
            return ret;
        },
        /**获取选择的当前页的所有数据
         *
         * @returns {*}
         */
        getAllData: function () {
            var ret = [];
            this.$el.find('.table-body tbody tr').each(function (index, item) {
                ret.push($(item).data('value'));
            });
            return ret;
        },

        /**
         * 设置Table请求数据
         * @param key
         * @param value
         */
        setPostData: function (key, value) {
            this.settings.postData[key] = value;
        },

        /**
         * 删除Table请求数据
         * @param key
         */
        delPostData: function (key) {
            try {
                delete this.settings.postData[key];
            } catch (e) {
                console.error(e);
            }
        },

        /**
         * 刷新TableBody
         */
        refreshBody: function () {
            var self = this;
            var $tBody = this.$dataTable.find('.table-body tbody').empty(),
                $rows = $('<div></div>');
            if (!this.data.items) {
                this.data.items = [];
            }
            for (var i = 0; i < this.data.items.length; i++) {
                var $row = $(this._initRow(this.data.items[i], i + 1));
                $row.data('value', this.data.items[i]);
                if (i === 0) {
                    this.$el.find('.table-header th').each(function (index, th) {
                        var $th = $(th);
                        if ($th.data('width')) {
                            $row.find('td').eq(index).css('width', $th.data('width'));
                        }
                    })
                }
                $rows.append($row);
            }
            $tBody.append($rows.children());
            if (this.$dataTable.find('.selectAll').length && this.$dataTable.find('.selectAll').is(':checked')) {
                $tBody.find('tr').find('td:eq(0) .checkbox-single').prop('checked', true);
            }
            self._styleAdjustment();
        },
        /**
         *请求新的数据更新Table
         */
        refreshTable: function () {
            this._requestAsyncData();
        },
        getPageSize: function () {
            return this.search.pageSize;
        },
        /**
         * 设置table数据
         * @param data
         */
        setData: function (data) {
            if (!$.isArray(data)) {
                return;
            }

            this.data.totalItems = data;
            this.refreshBody();
        }
    });

    $.fn[pluginName] = function (option) {
        if (!this.length) {
            return;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        var methodReturn, instance;

        if (typeof option === 'string') {
            instance = this.data("plugin_" + pluginName);
            methodReturn = instance[option].apply(instance, args);
            return ( methodReturn === undefined ) ? $(this) : methodReturn;
        } else if (typeof option === 'object') {
            this.empty();
            return this.data("plugin_" + pluginName, new Plugin(this, option || {}));
        }
    };

})
(jQuery, window, document);