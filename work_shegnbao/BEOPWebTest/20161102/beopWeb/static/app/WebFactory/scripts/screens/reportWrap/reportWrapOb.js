;(function (exports, FacReportScreen) {
    var Spinner = new LoadingSpinner({color: '#00FFFF'});

    function FacReportWrapScreen(options, container) {
        this.container = (function (container) {
            if (typeof container === 'string') {
                return document.querySelector('#' + container);
            } else if (container instanceof HTMLElement) {
                return container;
            } else {
                return null;
            }
        } (container));
        this.container.innerHTML = '';

        this.options = options;

        this.store = null;
        //类名为row的包裹层
        this.row = null;
        //左边报表名
        this.leftCtn = null;
        //中间部分
        this.centerCtn = null;
        //右边部分
        this.rightCtn = null;

        // 当前显示的报表实例
        this.report = null;
    }

    +function () {

        this.show = function () {
            Spinner.spin(document.body);

            // 给 body 加上滚动样式
            this.container.classList.add('scrollable-y', 'gray-scrollbar');

            // 获取数据
            WebAPI.get( '/factory/reportWrap/' + [AppConfig.isFactory, this.options.id].join('/') ).done(function (rs) {
                this.store = rs;
                // 初始化操作
                this.init();

            }.bind(this)).always(function () {
                Spinner.stop();
            });
        };

        this.init = function () {
            var reportWrap, hash, dataArr, idx = 0, $eles;
            //初始化元素
            this.initLayoutDOM();
            // 事件
            this.attachEvents();
            //中间的容器
            reportWrap = document.querySelector("#centerCtn");

            this.setTreeOptions({
                container:reportWrap
            });

            // 是否有指定默认打开哪张报表
            if (typeof this.options.default !== 'undefined') {
                idx = this.options.default - 0; // 装换成 number
            } else {
                hash = window.location.hash;
                if(hash && hash.indexOf("response=") > -1) {
                    dataArr = hash.split("&");
                    for(var i=0, len = dataArr.length;i < len; i++) {
                        if(dataArr[i].indexOf("response=") !== -1) {
                            idx = dataArr[i].split("=")[1] - 1;
                            break;
                        }
                    } 
                }
            }
            $eles = this.leftCtn.find('.report-item');
            // 做防止越界的处理
            idx = Math.min(Math.max(0, idx), $eles.length - 1);
            
            $eles.eq(idx).trigger('click');
        };

        this.attachEvents = function () {
            var _this = this;

            var leftCtnTopDivs= $('.leftCtnTop').find("div");
            // 划过报表名字
            $('.reportListName').hover(function(){
                $(this).find(".report-item").addClass("in");
                $(this).find("span.copyUrl").show().attr("title",I18n.resource.report.chartConfig.COPY_LINK);
            },function(){
                $(this).find(".report-item").removeClass("in");
                $(this).find("span.copyUrl").hide();
            });
            // 点击报表名字
            this.leftCtn.on('click', '.report-item', function () { 
                var period;
                var $iptDate;
                var options, date, now;

                _this.destroyTree();
                $('.report-item').removeClass("selected");
                //章节名字后面的箭头
                if($(this).siblings("img").attr("src")=="/static/app/WebFactory/themes/default/images/down.svg"){
                    $(this).siblings("img").attr("src","/static/app/WebFactory/themes/default/images/left.svg");
                } else {
                    $(".report-item").siblings("img").attr("src","/static/app/WebFactory/themes/default/images/left.svg");
                    $(this).siblings("img").attr("src","/static/app/WebFactory/themes/default/images/down.svg");
                    $(this).addClass("selected");
                    $("<div>").addClass("navTree").appendTo($(this).parent());
                
                    period = this.dataset.period;
                    $iptDate = $(".form_datetime");
                    now = new Date();

                    switch (period) {
                        // 默认显示昨天的数据
                        case 'day':
                            var formatStr = timeFormatChange('yyyy-mm-dd');
                            date = new Date( now.valueOf() - 86400000 ).format('yyyy-MM-dd');
                            $iptDate.val( timeFormat(date,formatStr) );
                            options = {
                                format: formatStr,
                                minView: 'month',
                                startView: 'month',
                                forceParse: false
                            };
                            break;
                            // 默认显示上一周的数据
                        case 'week':
                            var formatStr = timeFormatChange('yyyy-mm-dd');
                            var weekDay = now.getDay()===0?13:7+(now.getDay()-1);
                            date =  new Date( now.valueOf() - 86400000 * weekDay);
                            date = date.format(timeFormat(date,formatStr));
                            $iptDate.val(date);
                            // var weekNum = DateUtil.getWeekNumber(new Date());
                            // $iptDate.val( weekNum[0]+'-'+ weekNum[1] + '-week');
                            options = {
                                format: formatStr,
                                minView: 'month',
                                startView: 'month',
                                forceParse: false
                            };
                            break;
                        // 默认显示上个月的数据
                        case 'month':
                            var formatStr = timeFormatChange('yyyy-mm');
                            date = new Date( now.valueOf() - now.getDate()*86400000 ).format('yyyy-MM');
                            $iptDate.val( timeFormat(date,formatStr) );
                            options = {
                                format: formatStr,
                                minView: 'year',
                                startView: 'year',
                                forceParse: false
                            };
                            break;
                        // 默认显示去年的数据
                        case 'year':
                            date = new Date( new Date( now.getFullYear() + '' ).valueOf() - 86400000 ).format('yyyy');
                            $iptDate.val( date );
                            options = {
                                format: 'yyyy',
                                minView: 'decade',
                                startView: 'decade'
                            };
                            break;
                    }

                    $iptDate.datetimepicker('remove');
                    window.setTimeout( function () {
                        $iptDate.datetimepicker( $.extend(false, options, {
                            autoclose: true,
                            endDate: function () {
                                var date = new Date().format('yyyy-MM-dd')
                                return date
                            }()
                        }) );
                    }, 0)

                    _this._showReport(this.dataset.id, period, date).always(function () {
                        _this.renderTree();
                    })
                }
            });
            //点击报表名字后面的箭头
            $(".reportListName").off("click.arrow").on("click.arrow",".arrow",function(){
                $(this).siblings(".report-item").trigger("click");
            })
            //单击复制链接按钮
            $(".reportListName").off("click.copyUrl").on("click.copyUrl",".copyUrl",function(){
                var reportChaptId = $(this).siblings(".report-item").attr("data-id");
                var isFactory = window.location.href.indexOf("factory") === -1 ?0:1;
                var input = document.createElement('textarea');
                var successful;

                document.body.appendChild(input);
                input.value = window.location.origin+'/factory/preview/report/'+reportChaptId+'/'+AppConfig.isFactory+'?projectId='+AppConfig.projectId;
                input.focus();
                input.select();
                successful = document.execCommand('Copy');
                
                input.remove();
                if(successful) {
                    alert(I18n.resource.report.chartConfig.COPY_LINK_SUCCESS);
                } else {
                    alert(I18n.resource.report.chartConfig.COPY_LINK_FAILED);
                }
            })
            $('.form_datetime').off('changeDate').on('changeDate', function(ev) {
                if (!_this.report) return;

                Spinner.spin(document.body);
                // 将代码放入到当前 js 线程队列的最后面执行
                // 从而回避卡住 UI 的问题
                window.setTimeout(function () {
                    _this.report.setReportDate(this.value);
                    Spinner.stop();
                }.bind(this), 0);
            });
            $('.pdfDownCtn').off('click').on('click',function(){
                if(!_this.report){return;}
                var checkReportId = _this.report.options.id;
                for(var j = 0;j<_this.store.list.length;j++){
                    if(_this.store.list[j].reportId === checkReportId){
                        var reportTitle = _this.store.list[j].reportName;
                        var period = _this.store.list[j].period;
                        var reportPeriod;
                        switch (period) {
                            case 'week':
                                reportPeriod = "周报";
                                break;
                            case 'day':
                                reportPeriod = "日报";
                                break;
                            case 'month':
                                reportPeriod = "月报";
                                break;
                            case 'year':
                                reportPeriod = "年报";
                                break;
                        }
                        break;
                    }
                }
                var arrHtml = [];
                arrHtml.push($('#centerCtn').html());
                var promise;
                var cover;
                // 显示 loading
                Spinner.spin(document.body);
                WebAPI.get("/project/getinfo/"+AppConfig.projectId).done(function (rs) {
                        //该报表所属项目信息
                        var projectInfo = rs.projectinfo;
                        WebAPI.get('/static/views/share/reportWrap/coverPage.html').done(function (result) {
                            result = result.formatEL({
                                projectImg: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.pdfCover),
                                title: reportTitle,
                                logo: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.logo),
                                date: $('.calendarCtn').children('input').val(),
                                projName: localStorage.getItem("language") === "zh"?projectInfo.name_cn:projectInfo.name_english
                            })
                            
                            //处理echart的数据var pageHeight = 750;
                            var allEchartsArr = Array.prototype.map.call($('[_echarts_instance_]'), function (row) { return echarts.getInstanceByDom(row); });
                            var allEchartsDom = $('[_echarts_instance_]');
                            for(var i = 0,len = allEchartsArr.length;i<len;i++){
                                var echartsId = allEchartsArr[i].id;
                                var echartsDom = allEchartsDom.filter('div[_echarts_instance_ = '+ echartsId +']');
                                var echartsHtml = echartsDom.html();
                                var imgWidth = 210*(echartsDom.width()/$('#centerCtn').width());
                                var imgUrl = allEchartsArr[i].getDataURL({backgroundColor: '#fff'});
                                var img;
                                if(imgUrl){
                                    img = '<img src="'+imgUrl+'" style=" width:'+ imgWidth +'mm;"/>';
                                }else{
                                    img = '<h4 style="width:'+ imgWidth +'px; height: 20px;">This chart has no data.</h4>';
                                }
                                arrHtml[0] = arrHtml[0].replace(echartsHtml,img);
                            }

                            // 先去服务端拉打印需要的模板
                            promise = WebAPI.get('/static/views/share/reportWrap/pdfTemplate.html');

                            // 在这里定义成功事件
                            promise.done(function (html) {
                                    var xhr, formData;
                                    // 生成最终的 html
                                    html = html.formatEL({
                                        projectImg: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.pdfCover),
                                        title: reportTitle,
                                        encoding: 'UTF-8',
                                        entitiesHtml: arrHtml[0],
                                        projName: localStorage.getItem("language") === "zh"?projectInfo.name_cn:projectInfo.name_english,
                                        logo: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.logo),
                                        date: $('.calendarCtn').children('input').val(),
                                        footerLeft: i18n_resource.report.reportWrap.GENERATED_BY_BEOP,
                                        footerRight: localStorage.getItem("language") === "zh"?"第 [page] 页 共[topage]页":"Page [page] of [topage]"
                                    });

                                    // 表单数据
                                    formData = new FormData();
                                    formData.append('html', html);
                                    formData.append('cover', result);
                                    formData.append('skin', 'default');

                                    xhr = new XMLHttpRequest();
                                    xhr.responseType = 'arraybuffer';
                                    xhr.open('POST', '/admin/getShareReportWrapPDF');
                                    xhr.onload = function () {
                                        var blob, url, lkPdfFile;
                                        if (this.status === 200) {
                                            blob = new Blob([xhr.response], {type: "application/pdf"});
                                            url = URL.createObjectURL(blob);

                                            // 这里用 a 标签来模拟下载，而不直接使用 window.open
                                            // 是因为 window.open 不能自定义下载文件的名称
                                            // 而 a 标签可以通过设置 download 属性来自定义下载文件的名称
                                            lkPdfFile = document.createElement('a');
                                            lkPdfFile.style = "display: none";
                                            lkPdfFile.id = "lkPdfFile";
                                            lkPdfFile.href = url;
                                            lkPdfFile.download = reportTitle + ' ' + $('.calendarCtn').children('input').val() +'.pdf';

                                            document.body.appendChild(lkPdfFile);
                                            lkPdfFile.click();
                                            window.URL.revokeObjectURL(url);
                                            window.setTimeout(function () {
                                                lkPdfFile.parentNode.removeChild(lkPdfFile);
                                            }, 0);
                                        } else {
                                            alert('Generate report failed, please try it again soon!');
                                        }
                                        // 隐藏 loading
                                        Spinner.stop();
                                    };
                                    xhr.send(formData);
                                // })

                            }).fail(function (e) {
                                throw e;
                            });

                        })
                })
            })
        };

        this._showReport = function (reportId, period, date) {
            if (this.report) {
                this.report.close();
            }

            this.report = new FacReportScreen({
                id: reportId,
                period: period,
                date: date
            }, this.centerCtn.children('div')[1] );
            
            return this.report.show();
        };
        this.initLayoutDOM = function () {
            $(this.container).removeClass("scrollable-y gray-scrollbar");
            this.row = $('<div class="reportContainer">').addClass("scrollable-y gray-scrollbar").css({"width":"100%",height:"100%"});
            this.row.appendTo(this.container);
            //创建左边内容
            var link = window.location.href;
            if(link.indexOf("externalChainPage") !== -1){
                this.leftCtn = $('<div id="leftCtn" class="externalChainStyle"></div>');
            }else{
                this.leftCtn = $('<div id="leftCtn"></div>');
            }
            this.leftCtn.appendTo(this.row);
            this.getReportList();

            //创建中间内容
            this.centerCtn = $('<div id="centerCtn"><div class="top"></div><div class="center"></div></div>');
            this.centerCtn.appendTo(this.row);
            this.centerCtnCon();
        };

        this.getReportList = function () {
            var arrHtml = ['<div class="leftCtnTop"></div>','<ul class="repotChapList">'];
            for(var i = 0, row, len = this.store.list.length;i < len; i++) {
                row = this.store.list[i];
                arrHtml.push('<li title="'+row.reportName+'" class="reportListName"><img class="arrow" src="/static/app/WebFactory/themes/default/images/left.svg"><span class="copyUrl"></span><a href="javascript:;" class="report-item" data-id="'+ row.reportId +'" data-period="'+ row.period +'">'+row.reportName+'</a></li>');
            }
            arrHtml.push('</ul>');
            return this.leftCtn.html(arrHtml.join(''));
        };
        this.centerCtnCon = function (){
            //pdf下载
            var pdfDownCtn = $('<div class="pdfDownCtn in"></div>');
            var pdfDownCon = '<span class="pdf_text">'+ I18n.resource.report.reportWrap.PDFDOWNLOAD +'</span>';
            pdfDownCtn.html(pdfDownCon);
            pdfDownCtn.appendTo($(".leftCtnTop"));
            
            //日历
            var newDate = new Date().format("yyyy-MM-dd");
            var calendarCtn = $('<div class="calendarCtn"></div>');
            calendarCtn.html('<input type="text" value="'+newDate+'" readonly class="form_datetime calendar_date">');
            calendarCtn.appendTo($(".leftCtnTop"));


            // 无需升级
            $(".form_datetime").datetimepicker({
                format: 'yyyy-mm-dd',
                minView: 'month',
                autoclose: true
            });
        };
        ///////////////////
        // tree - start ///
        ///////////////////
        +function () {
            // 报表导航树的默认配置
            var DEFAULT_TREE_OPTIONS = {
                container: document.body
            };

            this.optionsArr = [];

            this.treeOptions = {};
            //获取到的报表数据
            this.option = {};

            // 配置导航树
            this.setTreeOptions = function (options) {
                this.treeOptions = $.extend(false, DEFAULT_TREE_OPTIONS, options);
            };
            //渲染导航树
            this.renderTree = function () {
                var _this=this;
                var container = this.treeOptions.container;
                var $headline = $(container).find(".headline");

                var navTreeArr = ['<ul>'];
                Array.prototype.forEach.call($headline, function (row) {
                    var id = row.id;
                    var title = row.innerHTML;
                    // 章节的级别
                    var level = id.split('_')[1].split('-').length;
                    navTreeArr.push('<li><a href="#'+ id +'" title="'+title+'" class="col-xs-offset-'+(level-1)+' ">'+title+'</a></li>');
                    
                });
                navTreeArr.push("</ul>");
                $(".navTree").html(navTreeArr.join(''));
                //划过章节列表
                $('.navTree').find("li").hover(function(){
                    $(this).addClass("in");
                },function(){
                    $(this).removeClass("in");
                });
                //点击章节列表
                $('.navTree').find("li").click(function(){
                    $('.navTree').find("li").removeClass("selected")
                    $(this).addClass("selected");
                });
            };
            //销毁导航树
            this.destroyTree = function () {
                $(".navTree").empty().remove();
            };

        }.call(this);
        ///////////////////
        // tree - end ///
        ///////////////////
        this.close = function () {
            if (this.report) {
                this.report.close();
            }
            //清除数据
            this.store = null;
            //清空dom
            this.row = null;
            //清除左边报表名
            this.leftCtn = null;
            //清除中间部分
            this.centerCtn = null;
            //清除右边部分
            this.rightCtn = null;

            this.container.innerHTML = '';

            this.container.classList.remove('scrollable-y', 'gray-scrollbar');
        };

    }.call(FacReportWrapScreen.prototype);

    exports.FacReportWrapScreen = FacReportWrapScreen;
} ( namespace('observer.screens'), 
    namespace('observer.screens.FacReportScreen') ));
