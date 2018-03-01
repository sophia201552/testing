// pagingTable
;(function (exports) {
    class PagingTable {
        constructor(container, options) {
            this.container = container;
            this.languagePage = {
                'zh-CN': {
                    TOTAL_NUM: '共有 {0} 项',
                    ROW_NUM_PER_PAGE: ' 项每页',
                    PAGINATION_FIRST: 'First',
                    PAGINATION_PREV: '<i class="iconfont">&#xe736;</i>',
                    PAGINATION_NEXT: '<i class="iconfont">&#xe736;</i>',
                    PAGINATION_LAST: 'Last'
                },
                'en-US': {
                    TOTAL_NUM: 'Total {0} items ',
                    ROW_NUM_PER_PAGE: ' rows per page',
                    PAGINATION_FIRST: 'First',
                    PAGINATION_PREV: '<i class="iconfont">&#xe736;</i>',
                    PAGINATION_NEXT: '<i class="iconfont">&#xe736;</i>',
                    PAGINATION_LAST: 'Last'
                }
            };
            this.defaultsOpt = {
                data: [],
                dataFilter: $.noop,
                url: null,
                method: 'post',
                postData: {},
                tableClass: 'table-bordered table-striped',
                theadCol: [],
                tbodyCol:[],
                trSet:{
                    data:null,
                    id:null,
                    calssName:null
                },
                tbodyHeight: null,
                onAdjustTable:$.noop,
                onBeforeRender: $.noop,
                onDoneRender: $.noop,
                onAfterRender: $.noop,
                language: 'en-US',
                headerAdjustFix: false,
                search:{
                    enable: false
                },
                paging:{
                    enable: false,
                    config:{
                        pageSizes: [50, 100, 150],
                        pageNum: 5,
                        noPagingHeight: "74vh",
                        totalNum: null
                    },
                    pagingKey:{
                        pageSize: 'page_Size',//每页的数目
                        pageNum: 'page_Num',//当前页数
                    }
                },
                sort:null,
                sortRule:null,
                more:false,
                onRowClick: null,
                onRowDbClick: null,
            }
            this.template = "<div class='widget-sdt-container fixed-header-table'>" +
            "    <div class='table-header'>" +
            "        <table>" +
            "            <thead></thead>" +
            "        </table>" +
            "    </div>" +
            "    <div class='table-body gray-scrollbar'>" +
            "        <table class='table widget-sdt-table'>" +
            "            <tbody></tbody>" +
            "        </table>" +
            "    <div class='table-footer widget-sdt-footer'>" +
            "        <div class='widget-sdt-footer-left'>" +
            "            <div class='widget-sdt-paging'></div><span class='italic'> / </span>"+
            "            <div class='widget-sdt-total'></div><span class='italic'> / </span>" +
            "            <div class='widget-sdt-rows-selector-container'>" +
            "                <span class='widget-sdt-rows-selector fl'></span>" +
            "                <span class='widget-sdt-rows-selector-text fl ml10 mt10'></span>" +
            "            </div>" +
            "        </div>" +
            "        <div class='widget-sdt-footer-right'>" +
            // "            <div class='widget-sdt-paging'></div>" +
            "           <div class='widget-sdt-more'><button type='button' class='btn btn-info btn-sm more'>More...</button></div>"+
            "        </div>" +
            "    </div>" +
            "    </div>" +
            // "    <div class='table-footer widget-sdt-footer'>" +
            // "        <div class='widget-sdt-footer-left'>" +
            // "            <div class='widget-sdt-paging'></div><span class='italic'> / </span>"+
            // "            <div class='widget-sdt-total'></div><span class='italic'> / </span>" +
            // "            <div class='widget-sdt-rows-selector-container'>" +
            // "                <span class='widget-sdt-rows-selector fl'></span>" +
            // "                <span class='widget-sdt-rows-selector-text fl ml10 mt10'></span>" +
            // "            </div>" +
            // "        </div>" +
            // "        <div class='widget-sdt-footer-right'>" +
            // // "            <div class='widget-sdt-paging'></div>" +
            // "           <div class='widget-sdt-more'><span class='more'>More...</span></div>"+
            // "        </div>" +
            // "    </div>" +
            "</div>";
            this.options = $.extend({}, this.defaultsOpt, options);

            this.init();
        }
        init() {
            this.createTable();
            this.initI18n();
            this.initSetting();
        }
        createTable(){
            this.$dataTable = $(this.template);
            if (this.options.tableClass) {
                this.$dataTable.find('table').removeClass().addClass('table ' + this.options.tableClass);
            }
            if(this.options.tbodyHeight){
                this.$dataTable.find('.table-body').css("height",this.options.tbodyHeight);
            }
            $(this.container).empty().append(this.$dataTable);
        }
        initI18n () {
            try {
                var language = I18n.type === 'zh' ? 'zh-CN' : 'en-US';
                this.i18n = this.languagePage[language];
            } catch (e) {
                this.i18n = this.languagePage[this.defaultsOpt.language];
            }
        }
        initSetting(){
            this.setting = {
                curPageSize: (this.options.paging.config.pageSizes && this.options.paging.config.pageSizes[0] === 50)?50:this.options.paging.config.pageSizes[0],
                formatString: function (format) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    return format.replace(/{(\d+)}/g, function (match, number) {
                        return typeof args[number] != 'undefined' ? args[number] : match;
                    });
                },
                curPageNum: 1,
                totalNum: 1,
                pageSizeKey: this.options.paging.pagingKey? this.options.paging.pagingKey.pageSize : this.defaultsOpt.paging.pagingKey.pageSize,
                pageNumKey: this.options.paging.pagingKey? this.options.paging.pagingKey.pageNum : this.defaultsOpt.paging.pagingKey.pageNum,
                sort:null,
                sortKey:this.options.sort? this.options.sort.sortKey : null,
                sortData:this.options.sort? this.options.sort.sortData : null,
            }
        }
        styleAdjustment () {
            var $scrollContainer = this.$dataTable.find('.gray-scrollbar');
            if ($scrollContainer[0].scrollHeight > $scrollContainer[0].clientHeight) {
                this.$dataTable.find('.table-header').css('padding-right', '23px');
            } else {
                this.$dataTable.find('.table-header').css('padding-right', '15px');
            }
            $scrollContainer.scrollTop(0);
        }
        show(){
            this.initTableHeader();
            this.ajax();
            this.initFooter();
            this.attachEvents();
        }
        initTableHeader(){
            var _this = this;
            var tpl = '<tr>';
            this.options.theadCol.forEach(function(row,i){
                var item = _this.options.theadCol[i];
                tpl += "<th data-index = '"+ i +"'";
                if(row.sort){
                    if(_this.setting.sort && _this.options.tbodyCol[i]["index"] === _this.setting.sort.key){
                        tpl += " data-sort = '"+ _this.setting.sort.order +"'";                   
                    }else{
                        tpl += " data-sort = 'asc'";
                    }
                }                
                if(row.width){
                   tpl += ' style="width:' + row.width + ';" data-width="'+ row.width +'"';
                }
                tpl += ">";
                if(row.sort){
                    if(_this.setting.sort && _this.options.tbodyCol[i]["index"] === _this.setting.sort.key){
                        if(_this.setting.sort.order === "asc"){
                            tpl += '<span class="glyphicon glyphicon-sort-by-attributes spanSort" aria-hidden="true"></span>';
                        }else{
                            tpl += '<span class="glyphicon glyphicon-sort-by-attributes-alt spanSort" aria-hidden="true"></span>';
                        }
                    }else{
                        tpl += '<span class="glyphicon glyphicon-sort-by-attributes spanSort" aria-hidden="true"></span>';
                    }
                }
                tpl += row.name;
                tpl += '</th>';
            })
            tpl += '</tr>';
            this.$tHead = this.$dataTable.find('.table-header thead');
            this.$tHead.empty().html(tpl);
            this.options.headerAdjustFix && this.makeHeaderFix();
        }
        ajax(){
            var _this = this;
            this.options.onBeforeRender();
            this.$dataTable.find('.table-footer').hide();           
            if(this.options.method === "get"){
                WebAPI.get(this.options.url).done(function(result){
                    _this.store = _this.options.dataFilter(result);
                    _this.initTableBody(_this.store);
                    _this.options.onDoneRender();
                    //分页处理
                    _this.setting.totalNum = _this.options.config.totalNum(result);
                    _this.initTotalNum();
                    _this.initPaging();
                }).always(function(){
                    _this.options.onAfterRender();
                })
            }else{
                if(this.options.paging.enable){
                    this.options.postData[this.setting.pageSizeKey] = this.setting.curPageSize;
                    this.options.postData[this.setting.pageNumKey] = this.setting.curPageNum;
                }                
                this.setting.sort && ( this.options.postData[this.setting.sortKey] = this.setting.sortData(this.setting.sort.key, this.setting.sort.order) );
                WebAPI.post(this.options.url,this.options.postData).done(function(result){
                    _this.store = _this.options.dataFilter(result);
                    _this.initTableBody(_this.store);
                    _this.options.onDoneRender();
                    //分页处理
                    _this.setting.totalNum = _this.options.paging.config.totalNum(result);
                    _this.initTableMore();
                    _this.initTotalNum();
                    _this.initPaging();
                }).always(function(){
                    _this.options.onAfterRender();
                })
            }
        }
        initTableBody(data){
            var _this = this;
            this.$tBody = this.$dataTable.find('.table-body tbody');
            var tpl = "";
            if(data){
                if(this.setting.sort && this.options.sortRule){
                    var key = this.setting.sort.key;
                    var sortType = this.setting.sort.order;
                    var sortRule = this.options.sortRule;
                    if(sortType === "asc"){
                        if(sortRule && sortRule[key]){
                            data = sortRule[key]["asc"](data);
                        }else{
                            data.sort(function (a, b) {
                                if(typeof a[key] === "number" && typeof b[key] === "number"){
                                    return a[key] - b[key];
                                }else{
                                    return (a[key]).localeCompare(b[key]);
                                }                            
                            });
                        }                       
                    }else{
                        if(sortRule && sortRule[key]){
                            data = sortRule[key]["desc"](data);
                        }else{
                            data.sort(function (a, b) {
                                if(typeof a[key] === "number" && typeof b[key] === "number"){
                                    return b[key] - a[key];
                                }else{
                                    return (b[key]).localeCompare(a[key]);
                                }                            
                            });    
                        }                                           
                    }    
                }
                data.forEach(function(row,i){
                    tpl += "<tr"                
                    if(_this.options.trSet){
                        var trSetData = _this.options.trSet.data;
                        var trSetId = _this.options.trSet.id;
                        var trSetClassName = _this.options.trSet.className;
                        if(trSetData){
                            Object.keys(trSetData).forEach(function(k){
                                if(typeof trSetData[k] === "function"){
                                    tpl += (" data-" + k +"="+ trSetData[k](row));
                                }else{
                                    tpl += (" data-" + k +"="+ row[trSetData[k]]);
                                }                            
                            })
                        } 
                        if(trSetId){
                            if(typeof trSetId === "function"){
                                tpl += (" id ="+ trSetId(row));
                            }else{
                                tpl += (" id ="+ row[trSetId]);
                            }                            
                        }
                        if(trSetClassName){
                            tpl += (" class ="+ trSetClassName);
                        }
                    }
                    tpl += ('>' + _this.initRowData(row) + '</tr>');
                })
            } 
            // if(this.options.more){
            //     this.$tBody.append(tpl);
            //     this.setting.curPageNum > 1 && ( this.$tBody.find("tr")[(this.setting.curPageNum - 1)*this.setting.curPageSize].scrollIntoView() )
            // }else{
                this.$tBody.empty().append(tpl);
            // }                      
            this.styleAdjustment();
            this.options.onAdjustTable(data);
        }
        initRowData(rowData){   
            var _this = this;        
            var tpl = "";            
            this.options.tbodyCol.forEach(function(col,i){
                var title = "";
                var value = "";
                var width = "";
                var className = "";
                if(col.name){
                    value = rowData[col.name];
                    col.title && (title = ("title = '" + value + "'"))
                }else{
                    if(col.index){
                        value = '<span class="ellipsis" style="flex:1">' + rowData[col.index] + '</span>';
                        col.title && (title += ("title = '" + rowData[col.index] + "'"))
                    }
                    if(col.html){
                        value = col.html;
                    }
                    if(col.converter){
                        value = '<span class="ellipsis style="flex:1">' + col.converter(rowData) + '</span>';
                        col.title && (title += ("title = '" + col.converter(rowData[col.index]) + "'"))
                    }
                }
                if(_this.$tHead.find('th').eq(i).attr("data-width")){
                    width = "style = 'width:" + _this.$tHead.find('th').eq(i).attr("data-width") + ";'";
                }
                if(col.className){
                    className = " class='" + col.className +"'";
                }
                tpl += ('<td '+ title + width + className +'><div style="display:flex">'+ value +'</div></td>');
            })
            return tpl;
        }
        initTableMore(){
            var $tableMore = this.$dataTable.find(".widget-sdt-more");
            if(this.options.more){
                if((this.setting.curPageNum + 1) > this._calcTotalPage()){
                    $tableMore.hide();
                }else{
                    $tableMore.show();
                }
                
            }else{
                $tableMore.hide();
            }
        }
        initFooter(){
            this.$footer = this.$dataTable.find('.table-footer');
            var $tBody = this.$dataTable.find('.table-body');
            if(this.options.paging.enable){                
                this.initPageNums();
                this.initTotalNum();
                // this.initPaging();
            }else{
                this.$footer.hide().css({
                    "height": "0",
                    "padding": "0"
                });
                $tBody.css("height",this.options.paging.config.noPagingHeight);
            }
        }
        initPageNums(){
            var SelectOptions = this.options.paging.config.pageSizes || this.defaultsOpt.paging.config.pageSizes;
            var html = '<select class="pageSizeSelect form-control">';
            for (var i = 0; i < SelectOptions.length; i++) {
                var rowsNum = SelectOptions[i];
                if (rowsNum === this.setting.curPageSize) {
                    html += '<option value="' + rowsNum + '" selected>' + rowsNum + '</option>';
                } else {
                    html += '<option value="' + rowsNum + '">' + rowsNum + '</option>';
                }
            }
            html += '</select>';
            this.$dataTable.find('.widget-sdt-rows-selector-text').text(this.i18n.ROW_NUM_PER_PAGE);
            this.$dataTable.find('.widget-sdt-rows-selector').html(html);
        }
        initTotalNum(){
            this.setting.totalNum = this.setting.totalNum ? this.setting.totalNum : 1;
            var num = '<span class="widget-sdt-total-num">' + this.setting.totalNum + '</span>';
            this.$dataTable.find('.widget-sdt-total').html(this.setting.formatString(this.i18n.TOTAL_NUM, num));
        }
        initPaging(){
            var _this = this;
            this.$dataTable.find('.table-footer').show(); 
            // if (this.$pagination) {
            //     this.$pagination.twbsPagination('destroy');
            // }
            // var paginationOptions = {
            //     totalPages: this._calcTotalPage(),
            //     visiblePages: 5,
            //     startPage: this.setting.curPageNum > this._calcTotalPage()?1:this.setting.curPageNum,
            //     first: this.i18n.PAGINATION_FIRST,
            //     prev: this.i18n.PAGINATION_PREV,
            //     next: this.i18n.PAGINATION_NEXT,
            //     last: this.i18n.PAGINATION_LAST,
            //     onPageClick: function (event, page) {
            //         if(_this.setting.curPageNum != page){
            //             _this.setting.curPageNum = page;
            //             _this.show();
            //         }                    
            //     }
            // };
            // this.$pagination = this.$dataTable.find('.widget-sdt-paging').twbsPagination(paginationOptions);
            var curPageNum = this.setting.curPageNum;
            var curPageSize = this.setting.curPageSize;
            var tpl = '<select class="pageSizeSelect form-control">';
            for(var i = 0,len = this._calcTotalPage();i<len;i++){
                var rightPageSiaze = i === len-1? this.setting.totalNum : (i+1)*curPageSize;      
                if ((i+1) === curPageNum) {
                    tpl += '<option value="' + (i+1) + '" selected>' + (i*curPageSize + " ~ " + rightPageSiaze) + '</option>';
                }else{
                    tpl += '<option value="' + (i+1) + '">' + (i*curPageSize + " ~ " + rightPageSiaze) + '</option>';
                }
            }
            this.$dataTable.find('.widget-sdt-paging').html(tpl);
        }
        _calcTotalPage(){
            var totalPage = Math.ceil(this.setting.totalNum / this.setting.curPageSize);
            return totalPage ? totalPage : 1;
        }
        attachEvents(){
            var _this = this;
            this.$dataTable.off("click.sort",".spanSort").on("click.sort",".spanSort",function(){
                // var sortData = $.extend(true,[],_this.store);
                var $curTh = $(this).closest("th");
                var index = parseInt($curTh.attr("data-index"));
                var key = _this.options.tbodyCol[index]["index"];
                if(!key){
                    return;
                }
                var sortType = $curTh.attr("data-sort");
                if(sortType === "asc"){
                    $curTh.attr("data-sort","desc");
                    _this.setting.sort = {
                        key: key,
                        order: "desc"
                    }
                }else{
                    $curTh.attr("data-sort","asc");
                    _this.setting.sort = {
                        key: key,
                        order: "asc"
                    }
                }
                if(_this.options.sortRule){                     
                    _this.initTableHeader();                              
                    _this.initTableBody(_this.store);
                }else{
                    _this.show();
                }                
            })
             /**
             * 单双击table row
             */
            if (this.options.onRowClick && typeof this.options.onRowClick === 'function') {
                this.$dataTable.off('click', '.table-body tr').on('click', '.table-body tr', function (e) {
                    _this.options.onRowClick(e,this,_this);                    
                });
            };
            if (this.options.onRowDbClick && typeof this.options.onRowDbClick === 'function') {    
                this.$dataTable.off('dblclick', '.table-body tr').on('dblclick', '.table-body tr', function (e) {                
                    _this.options.onRowDbClick(e,this,_this);
                });
            }
            /**
             * 改变每页数量
             */
            this.$dataTable.off('change', '.widget-sdt-rows-selector select').on('change', '.widget-sdt-rows-selector select', function () {                
                _this.setting.curPageSize = parseInt($(this).val());
                _this.setting.curPageNum = _this.setting.curPageNum > _this._calcTotalPage()?1:_this.setting.curPageNum;
                _this.show();
            });    
            this.$dataTable.off('change', '.widget-sdt-paging select').on('change', '.widget-sdt-paging select', function () {
                _this.setting.curPageNum = parseInt($(this).val());
                _this.show();
            });
            this.$dataTable.off('click', '.widget-sdt-more .more').on('click', '.widget-sdt-more .more', function () {
                _this.setting.curPageNum +=1;
                _this.show(); 
            });
        }
        makeHeaderFix() {
            var self = this;
            var $headers = this.$dataTable.find('.table-header th');
            var $tableHeader = this.$dataTable.find('.table-header');

            function setPixelWidths(i, pixelWidth) {
                $headers.eq(i).css('width', pixelWidth);
                self.$dataTable.find('.table-body tr:first td').eq(i).css('width', pixelWidth);
            }

            function setPercentageWidths(i, widthPercent) {
                var percentWidth = (widthPercent / self.$dataTable.outerWidth()) * 100;
                percentWidth = percentWidth.toFixed(2);
                $headers.not(':last-child').eq(i).css('width', percentWidth + '%')
                    .data('width', percentWidth + '%')
                    .attr('data-width', percentWidth + '%');
                self.$dataTable.find('.table-body tr:first td:not(:last-child)').eq(i).css('width', percentWidth + '%');
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
        }
    }

    exports.PagingTable = PagingTable;
}) (window);
