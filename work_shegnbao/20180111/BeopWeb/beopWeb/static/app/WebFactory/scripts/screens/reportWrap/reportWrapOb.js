;
(function(exports, FacReportScreen) {
    var Spinner = new LoadingSpinner({ color: '#00FFFF' });

    function FacReportWrapScreen(options, container) {
        this.container = (function(container) {
            if (typeof container === 'string') {
                return document.querySelector('#' + container);
            } else if (container instanceof HTMLElement) {
                return container;
            } else {
                return null;
            }
        }(container));
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

    +

    function() {

        this.show = function() {
            Spinner.spin(document.body);

            // 给 body 加上滚动样式
            this.container.classList.add('scrollable-y');
            this.container.classList.add('gray-scrollbar');

            // 获取数据
            WebAPI.get('/factory/reportWrap/' + [AppConfig.isFactory, this.options.id].join('/')).done(function(rs) {
                this.store = rs;
                // 初始化操作
                this.init();

            }.bind(this)).always(function() {
                Spinner.stop();
            });
        };

        this.init = function() {
            var reportWrap, hash, dataArr, idx = 0,
                $eles;
            //初始化元素
            this.initLayoutDOM();
            // 事件
            this.attachEvents();
            //中间的容器
            reportWrap = document.querySelector("#centerCtn");

            this.setTreeOptions({
                container: reportWrap
            });

            // 是否有指定默认打开哪张报表
            if (typeof this.options.default !== 'undefined') {
                idx = this.options.default-0; // 装换成 number
            } else {
                hash = window.location.hash;
                if (hash && hash.indexOf("response=") > -1) {
                    dataArr = hash.split("&");
                    for (var i = 0, len = dataArr.length; i < len; i++) {
                        if (dataArr[i].indexOf("response=") !== -1) {
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

        this.getReportShownDate = function(options) {
            var dateStr = this.report.options.date;
            var period = this.report.options.period;
            var date, timeStamp, arr, formatStr;

            options = options || {};
            // 目前只处理周报的时间格式
            if (period === 'week') {
                timeStamp = Date.parse(dateStr);
                if (isNaN(timeStamp)) {
                    return dateStr;
                }
                date = new Date(timeStamp);
                arr = DateUtil.getWeekNumber(date);
                if (options.format === 'week') {
                    return 'Week ' + arr[1] + ' ' + arr[0];
                }
                formatStr = timeFormatChange('yyyy-mm-dd');
                arr = DateUtil.getDateRangeOnWeekNumber(arr[0], arr[1]);

                return timeFormat(arr[0], formatStr) + '-' + timeFormat(arr[1], formatStr);
            } else if (period === 'month') {
                timeStamp = Date.parse(dateStr);
                if (isNaN(timeStamp)) {
                    return dateStr;
                }
                date = new Date(timeStamp);
                var dateLast = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                formatStr = timeFormatChange('yyyy-mm-dd');
                return timeFormat(date, formatStr) + '-' + timeFormat(dateLast, formatStr)
            } else if (period === 'day') {
                timeStamp = Date.parse(dateStr);
                if (isNaN(timeStamp)) {
                    return dateStr;
                }
                date = new Date(timeStamp);
                formatStr = timeFormatChange('yyyy-mm-dd');
                return timeFormat(date, formatStr)
            }

            return dateStr;
        };

        this.attachEvents = function() {
            var _this = this;

            var leftCtnTopDivs = $('.leftCtnTop').find("div");
            // 划过报表名字
            $('.reportListName').hover(function () {
                $(this).find("span.copyUrl").show().attr("title", I18n.resource.report.chartConfig.COPY_LINK);
                $(this).find(".report-item").addClass("in");
            }, function() {
                $(this).find(".report-item").removeClass("in");
                $(this).find("span.copyUrl").hide();
            });
            // 点击报表名字
            this.leftCtn.on('click', '.report-item', function() {
                var period;
                var $iptDate;
                var options, date, now;

                _this.destroyTree();
                $('.report-item').removeClass("selected");
                //章节名字后面的箭头
                if ($(this).siblings("img").attr("src") == "/static/app/WebFactory/themes/default/images/down.svg") {
                    $(this).siblings("img").attr("src", "/static/app/WebFactory/themes/default/images/left.svg");
                } else {
                    $(".report-item").siblings("img").attr("src", "/static/app/WebFactory/themes/default/images/left.svg");
                    $(this).siblings("img").attr("src", "/static/app/WebFactory/themes/default/images/down.svg");
                    $(this).addClass("selected");
                    $("<div>").addClass("navTree").appendTo($(this).parent());

                    period = this.dataset.period;
                    $iptDate = $(".form_datetime");
                    now = new Date();

                    switch (period) {
                        // 默认显示昨天的数据
                        case 'day':
                            var formatStr = timeFormatChange('yyyy-mm-dd');
                            date = new Date(now.valueOf() - 86400000).format('yyyy-MM-dd');
                            $iptDate.val(timeFormat(date, formatStr));
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
                            var weekDay = now.getDay() === 0 ? 13 : 7 + (now.getDay() - 1);
                            date = new Date(now.valueOf() - 86400000 * weekDay).format('yyyy-MM-dd');
                            $iptDate.val(timeFormat(date, formatStr));
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
                            date = new Date(now.valueOf() - now.getDate() * 86400000).format('yyyy-MM');
                            $iptDate.val(timeFormat(date, formatStr));
                            options = {
                                format: formatStr,
                                minView: 'year',
                                startView: 'year',
                                forceParse: false
                            };
                            break;
                            // 默认显示去年的数据
                        case 'year':
                            date = new Date(new Date(now.getFullYear() + '').valueOf() - 86400000).format('yyyy');
                            $iptDate.val(date);
                            options = {
                                format: 'yyyy',
                                minView: 'decade',
                                startView: 'decade'
                            };
                            break;
                    }

                    $iptDate.datetimepicker('remove');
                    window.setTimeout(function() {
                        $iptDate.datetimepicker($.extend(false, options, {
                            autoclose: true,
                            endDate: function() {
                                var date = new Date().format('yyyy-MM-dd')
                                return date
                            }()
                        }));
                    }, 0)

                    _this._showReport(this.dataset.id, period, date).always(function() {
                        _this.renderTree();
                    })
                }
            });
            //点击报表名字后面的箭头
            $(".reportListName").off("click.arrow").on("click.arrow", ".arrow", function () {
                $(this).siblings(".report-item").trigger("click");
            });
            //单击复制链接按钮
            $(".reportListName").off("click.copyUrl").on("click.copyUrl", ".copyUrl", function () {
                var $a = $(this).siblings(".report-item");
                var reportChaptId = $a.attr("data-id");
                var period = $a.attr("data-period");
                var isFactory = window.location.href.indexOf("factory") === -1 ? 0 : 1;
                var input = document.createElement('textarea');
                var successful;
                var date = $('.calendar_date').val();
                //当前是否是选中状态 选中状态直接用日历里所显示日期 未选中判断是何种类型的报表 在处理时间
                var isSelected = $a.hasClass('selected');
                if (!isSelected) {
                    var now = new Date();
                    switch (period) {
                        case 'week':
                            var weekDay = now.getDay() === 0 ? 13 : 7 + (now.getDay() - 1);
                            date = new Date(now.valueOf() - 86400000 * weekDay).format('yyyy-MM-dd');
                            break;
                            // 默认显示上个月的数据
                        case 'month':
                            date = new Date(now.valueOf() - now.getDate() * 86400000).format('yyyy-MM');
                            break;
                            // 默认显示去年的数据
                        case 'year':
                            date = new Date(new Date(now.getFullYear() + '').valueOf() - 86400000).format('yyyy');
                            break;
                    }
                }
                document.body.appendChild(input);
                input.value = window.location.origin + '/factory/preview/report/' + reportChaptId + '/' + AppConfig.isFactory + '?projectId=' + AppConfig.projectId + '&date=' + window.encodeURIComponent(date);
                input.focus();
                input.select();
                successful = document.execCommand('Copy');
                input.parentNode.removeChild(input);
                if (successful) {
                    alert(I18n.resource.report.chartConfig.COPY_LINK_SUCCESS);
                } else {
                    alert(I18n.resource.report.chartConfig.COPY_LINK_FAILED);
                }
            })
            $('.form_datetime').off('changeDate').on('changeDate', function(ev) {
                if (!_this.report) return;
                trackEvent('报表时间切换', 'Report.Date.Change');
                Spinner.spin(document.body);
                // 将代码放入到当前 js 线程队列的最后面执行
                // 从而回避卡住 UI 的问题
                window.setTimeout(function() {
                    if (_this.report.reportEntity.loadingArr){
                        _this.report.reportEntity.loadingArr.forEach(v=>{
                            v.abort();
                        });
                        _this.report.reportEntity.loadingArr = undefined;
                    }
                    if(_this.report.reportEntity.loadingLayoutScript){
                        _this.report.reportEntity.loadingLayoutScript.reject && _this.report.reportEntity.loadingLayoutScript.reject();
                        _this.report.reportEntity.loadingLayoutScript = undefined;
                    }
                    _this.report.setReportDate(this.value);
                    Spinner.stop();
                }.bind(this), 0);
            });
            // 报表字体大小样式
            function textFontSize() {
                var fontSize = AppConfig.reportFontSize? AppConfig.reportFontSize : 12 ;
                var reportStyle = '#reportWrap .chapter-summary-wrap *{\
                                    font-size: '+ fontSize + 'px !important;\
                                }\
                                #reportWrap .chapter-2 p{\
                                    font-size: '+ fontSize + 'px !important;\
                                }\
                                #reportWrap .chapter-3 p{\
                                    font-size: '+ fontSize + 'px !important;\
                                }\
                                table{\
                                    font-size: '+ fontSize + 'px !important;\
                                }\
                                .report-container h1{\
                                    font-size: '+ (fontSize + 6) + 'px !important;\
                                }\
                                .report-container h2{\
                                    font-size: '+ (fontSize + 4) + 'px  !important;\
                                }\
                                .report-container h3{\
                                    font-size: '+ (fontSize + 2) + 'px  !important;\
                                }';
                return reportStyle;
            }
            
            $('.wordDownCtn').eventOff('click').eventOn('click', function() {
                if (!_this.report) { return; }
                if (_this.report.reportEntity.loadingArr != undefined) {
                    _this.report.reportEntity.setActive($('#reportWrap').height());
                    return;
                }else if(_this.report.reportEntity.anyoneFailed){
                    alert(I18n.resource.report.reportWrap.LOADERROR);
                    return;
                }
                trackEvent('报表Word下载', 'Report.Word.Download');
                var checkReportId = _this.report.options.id;
                for (var j = 0; j < _this.store.list.length; j++) {
                    if (_this.store.list[j].reportId === checkReportId) {
                        var reportTitle = _this.store.list[j].reportName;
                        break;
                    }
                }
                var arrHtml = [];
                arrHtml.push($('#centerCtn').html());
                var promise;
                var cover;
                // 显示 loading
                Spinner.spin(document.body);
                var bedEnd = function() {
                    Spinner.stop();
                    alert('Generate report failed, please try it again soon!');
                };
                WebAPI.get("/project/getinfo/" + AppConfig.projectId).done(function(rs) {
                    //该报表所属项目信息
                    var projectInfo = rs.projectinfo;
                    //封面
                    var coverPage = '<div class="wordCover">\
                                        <div class="info">\
                                            <h1>{title}</h1>\
                                            <div>\
                                                <span>{projName}</span>\
                                                <span>{date}</span>\
                                            </div>\
                                            <p align="center"><img class="projectImg" src="{projectImg}" onerror="this.onerror=null;this.src=\''+"https://beopweb.oss-cn-hangzhou.aliyuncs.com/custom/project_img/pdf_cover.png"+'\'" height="520" width="{projectImgW}"/></p>\
                                        </div>\
                                    </div>';
                    var url = BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.pdfCover);
                    var urlSplit = url.split('//')[1].split('/');
                    var newUrl = '';
                    for(var i = 1;i<urlSplit.length;i++){
                        newUrl += '/'+urlSplit[i];
                    }
                    var urlCurrent = '';
                    WebAPI.get(newUrl).done(function(result){
                       urlCurrent = BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.pdfCover);
                    }).fail(function(e){
                        urlCurrent = "http://beopweb.oss-cn-hangzhou.aliyuncs.com/custom/project_img/cover_word.jpg";
                    }).always(function(){
                        var projectImgInMain = '<img id="fainalDeleteImg" src="'+urlCurrent+'" style="visibility:hidden;" crossorigin="anonymous"/>';
                        $('#centerCtn').append(projectImgInMain);
                        var $fainalDeleteImg = $('#fainalDeleteImg');
                        $fainalDeleteImg.load(function(){
                            function convertImagesToBase64 () {
                                var canvas = document.createElement('canvas');
                                var ctx = canvas.getContext('2d');
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                canvas.width = $fainalDeleteImg.width();//width,height不能为0
                                canvas.height = $fainalDeleteImg.height();
                                ctx.drawImage($fainalDeleteImg[0], 0, 0);
                                var dataURL = canvas.toDataURL('image/jpeg');
                                urlCurrent = dataURL;
                                canvas.remove && canvas.remove();
                             }
                            convertImagesToBase64();
                            var projectImgW = 520 * $fainalDeleteImg.width() / $fainalDeleteImg.height();
                            coverPage = coverPage.formatEL({
                                projectImg: urlCurrent,//BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.pdfCover),
                                title: reportTitle,
                                logo: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.logo),
                                date: _this.getReportShownDate(),
                                projName: localStorage.getItem("language") === "zh" ? projectInfo.name_cn : projectInfo.name_english,
                                projectImgW:projectImgW
                            })
                            $('#fainalDeleteImg').empty().remove();
                            //处理echart的数据var pageHeight = 750;
                            var allEchartsArr = Array.prototype.map.call($('[_echarts_instance_]'), function(row) { return echarts.getInstanceByDom(row); });
                            var allEchartsDom = $('[_echarts_instance_]');
                            for (var i = 0, len = allEchartsArr.length; i < len; i++) {
                                var echartsId = allEchartsArr[i].id;
                                var echartsDom = allEchartsDom.filter('div[_echarts_instance_ = ' + echartsId + ']');
                                var echartsHtml = echartsDom.html();
                                var imgWidth = (1) * 100 * 14 / 2.65; //1为比例 100px为2.65cm 纸张共14cm
                                var imgHeight = imgWidth / (echartsDom.width() / echartsDom.height());
                                var imgUrl = allEchartsArr[i].getDataURL({ backgroundColor: '#fff', width: '300px' });
                                var img;
                                if (imgUrl) {
                                    img = '<p style="text-align:center;"><img height="' + imgHeight + '" width="' + imgWidth + '" src="' + imgUrl + '" /></p>';
                                } else {
                                    img = '<h4 style="width:' + imgWidth + 'px; height: 20px;text-align:center;">This chart has no data.</h4>';
                                }
                                arrHtml[0] = arrHtml[0].replace(echartsHtml, img);
                            }
                            //处理表格居中
                            var $tables = $('#centerCtn table');
                            $tables.each(function(i, v) {
                                var tableHtml = $(v).parent().html();
                                arrHtml[0] = arrHtml[0].replace(tableHtml, '<div style="text-align:center;">' + tableHtml + '</div>');
                            });
                            WebAPI.get('/static/views/share/reportWrap/wordTemplate.html').done(function(html) {
                                html = html.formatEL({
                                    coverPage: coverPage,
                                    reportStyle: textFontSize(),
                                    entitiesHtml: arrHtml[0]
                                });

                                jQuery.getScript("/static/scripts/lib/html-docx/FileSaver.js").done(function() {
                                    jQuery.getScript("/static/scripts/lib/html-docx/html-docx.min.js").done(function() {
                                        Spinner.stop();
                                        var converted = htmlDocx.asBlob(html, { orientation: 'landscape', margins: { top: 720, left: 700, right: 700 } });
                                        saveAs(converted, reportTitle + ' ' + _this.getReportShownDate({
                                            format: 'week'
                                        }) + '.docx');
                                    });
                                }).fail(bedEnd);

                            }).fail(bedEnd);
                        })

                    })

                }).fail(bedEnd);

            }, 'factory-报表Word下载');

            $('.pdfDownCtn').eventOff('click').eventOn('click', function() {
                if (!_this.report) { return; }
                if (_this.report.reportEntity.loadingArr != undefined) {
                    _this.report.reportEntity.setActive($('#reportWrap').height());
                    return;
                }else if(_this.report.reportEntity.anyoneFailed){
                    alert(I18n.resource.report.reportWrap.LOADERROR);
                    return;
                }
                trackEvent('报表PDF下载', 'Report.PDF.Download');
                var checkReportId = _this.report.options.id;
                for (var j = 0; j < _this.store.list.length; j++) {
                    if (_this.store.list[j].reportId === checkReportId) {
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
                WebAPI.get("/project/getinfo/" + AppConfig.projectId).done(function(rs) {
                    //该报表所属项目信息
                    var projectInfo = rs.projectinfo;
                    WebAPI.get('/static/views/share/reportWrap/coverPage.html').done(function(result) {
                        result = result.formatEL({
                            projectImg: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.pdfCover),
                            title: reportTitle,
                            logo: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.logo),
                            date: _this.getReportShownDate(),
                            projName: localStorage.getItem("language") === "zh" ? projectInfo.name_cn : projectInfo.name_english
                        })

                        //处理echart的数据var pageHeight = 750;
                        var allEchartsArr = Array.prototype.map.call($('[_echarts_instance_]'), function(row) { return echarts.getInstanceByDom(row); });
                        var allEchartsDom = $('[_echarts_instance_]');
                        for (var i = 0, len = allEchartsArr.length; i < len; i++) {
                            var echartsId = allEchartsArr[i].id;
                            var echartsDom = allEchartsDom.filter('div[_echarts_instance_ = ' + echartsId + ']');
                            var echartsHtml = echartsDom.html();
                            var imgWidth = 210 * (echartsDom.width() / $('#centerCtn').width());
                            var imgUrl;
                            if(echartsDom.width()<=1055){
                                imgUrl = allEchartsArr[i].getDataURL({pixelRatio:1.5, backgroundColor: '#fff' });
                            }else{
                                imgUrl = allEchartsArr[i].getDataURL({ backgroundColor: '#fff' });
                            }
                            var img;
                            if (imgUrl) {
                                img = '<img src="' + imgUrl + '"/>';
                                // img = '<img src="' + imgUrl + '" style=" width:' + imgWidth + 'mm;"/>';
                            } else {
                                img = '<h4 style="width:' + imgWidth + 'px; height: 20px;">This chart has no data.</h4>';
                            }
                            arrHtml[0] = arrHtml[0].replace(echartsHtml, img);
                        }

                        // 先去服务端拉打印需要的模板
                        promise = WebAPI.get('/static/views/share/reportWrap/pdfTemplate.html');
                        var searchCountry=WebAPI.get('/getProjectProperties/'+AppConfig.projectId);
                        // 在这里定义成功事件
                        $.when(promise,searchCountry).done(function(html,rs) {
                            var isAu=rs[0].country_name_twoletter&&rs[0].country_name_twoletter=='AU'?1:0
                            var xhr, formData;
                            // 生成最终的 html
                            html = html[0].formatEL({
                                projectImg: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.pdfCover),
                                title: reportTitle,
                                encoding: 'UTF-8',
                                entitiesHtml: arrHtml[0],
                                projName: localStorage.getItem("language") === "zh" ? projectInfo.name_cn : projectInfo.name_english,
                                logo: BEOPUtil.getProjectImgByType(AppConfig.projectId, BEOPUtil.projectImgType.logo),
                                date: _this.getReportShownDate(),
                                footerLeft: isAu?i18n_resource.report.reportWrap.GENERATED_BY_ADOPT:i18n_resource.report.reportWrap.GENERATED_BY_BEOP,
                                footerRight: localStorage.getItem("language") === "zh" ? "第 [page] 页 共[topage]页" : "Page [page] of [topage]",
                                reportStyle: textFontSize(),
                            });

                            // 表单数据
                            formData = new FormData();
                            formData.append('html', html);
                            formData.append('cover', result);
                            formData.append('skin', 'default');

                            xhr = new XMLHttpRequest();
                            xhr.open('POST', '/admin/getShareReportWrapPDF');
                            xhr.responseType = 'arraybuffer';
                            xhr.onload = function() {
                                var blob, url, lkPdfFile;
                                if (this.status === 200) {
                                    if(!AppConfig.isHeadless){
                                        blob = new Blob([xhr.response], { type: "application/pdf" });
                                        jQuery.getScript("/static/scripts/lib/html-docx/FileSaver.js").done(function () {
                                            saveAs(blob, reportTitle + ' ' + _this.getReportShownDate({
                                                format: 'week'
                                            }) + '.pdf');
                                        });
                                    }
                                   
                                } else {
                                    alert('Generate report failed, please try it again soon!');
                                }
                                // 隐藏 loading
                                Spinner.stop();
                            };
                            xhr.send(formData);
                            // })

                        }).fail(function(e) {
                            throw e;
                        });

                    })
                })
            }, 'factory-报表PDF下载')
            $('.excelDownCtn').eventOff('click').eventOn('click', function() {
                if (!_this.report) { return; }
                if (_this.report.reportEntity.loadingArr != undefined) {
                    _this.report.reportEntity.setActive($('#reportWrap').height());
                    return;
                }else if(_this.report.reportEntity.anyoneFailed){
                    alert(I18n.resource.report.reportWrap.LOADERROR);
                    return;
                }
                var store = [];
                var root = {}
                var rootCtn = document.querySelector('.report-container-wrap.root-container')
                var chapter = root
                var chapterCtn;
                var chapterStore;
                store = _this.setExcelChapterTemplate($(rootCtn), 0)
                    //_this.setExcelChapterStore(root, store)
                if (!store.sub || store.sub.length == 0) {
                    return
                }
                store = store.sub
                store.forEach(function(chap) {
                    this.setExcelChapterPos(chap)
                }.bind(_this))

                console.log(store)
                var curReport;
                for (var j = 0; j < _this.store.list.length; j++) {
                    if (_this.store.list[j].reportId === _this.report.options.id) {
                        curReport = _this.store.list[j];
                    }
                }
                if (!curReport) {
                    alert('Generate report failed, please try it again soon!');
                    return;
                }

                xhr = new XMLHttpRequest();
                // xhr.responseType = 'arraybuffer';
                xhr.open('POST', '/admin/getShareReportExcel');
                xhr.onload = function() {
                    var blob, url, lkExcelFile;
                    if (this.status === 200 && this.response) {
                        blob = new Blob([xhr.response], { type: "application/vnd.ms-excel" });
                        jQuery.getScript("/static/scripts/lib/html-docx/FileSaver.js").done(function () {
                            saveAs(blob, curReport.reportName + ' ' + _this.getReportShownDate({
                                format: curReport.period
                            }) + '.xlsx');
                        })
                    } else {
                        alert('Generate report failed, please try it again soon!');
                    }
                    // 隐藏 loading
                    Spinner.stop();
                };
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.responseType = 'arraybuffer';
                xhr.send(JSON.stringify(store));

            }, 'factory-报表EXCEL下载')
        };
        this.getExcelTextHeight = function(text) {
            var line = text.split('\n');
            var col = 0;
            for (var i = 0; i < line.length; i++) {
                col++;
                if (line[i]) {
                    col = col + parseInt(line[i].replace(/[^\x00-\xff]/g, "aa").length / 200);
                }
            }
            return col;
        };
        this.setExcelChapterTemplate = function($dom, level) {
            var _this = this;
            if ($dom.length == 0) return
            var $content = $dom.find('>.report-container>.report-content')
            var chapter = {}
            if ($dom[0].id && $dom[0].id.indexOf('reportContainer_') >= 0) {
                chapter.id = $dom[0].id.split('_')[1]
            }
            if ($dom.hasClass('report-summary-container')) {
                // chapter.template = 'summary'
                // chapter.title = I18n.resource.report.optionModal.SUMMARY
                // chapter.store = [];
                // $content.find('.chapter-summary-wrap p').each(function(i, des) {
                //     if (des.innerText) {
                //         var textHeight = _this.getExcelTextHeight(des.innerText)
                //         chapter.store.push({ data: des.innerText, height: textHeight });
                //     }
                // })
                chapter.template = 'container';
                chapter.title = I18n.resource.report.optionModal.SUMMARY
                chapter.sub = []
                // var $summary = $content.children('.report-summary-container')
                // if ($summary.length > 0) {
                //     chapter.sub.push(this.setExcelChapterTemplate($summary, level + 1))
                // }
                chapter.sub.push(this.setExcelChapterStore($content))
            } else {
                chapter.template = 'container';
                chapter.title = $content.children('.headline').text()
                chapter.sub = []
                var $summary = $content.children('.report-summary-container')
                if ($summary.length > 0) {
                    chapter.sub.push(this.setExcelChapterTemplate($summary, level + 1))
                }
                if ($dom.find('.chapter-' + (level + 1)).length == 0) {
                    chapter.sub.push(this.setExcelChapterStore($content))
                } else {
                    $dom.find('.chapter-' + (level + 1)).each(function(index, child) {
                        chapter.sub.push(this.setExcelChapterTemplate($(child).parent().parent(), level + 1))
                    }.bind(this))
                }
            }
            return chapter
        };
        this.setExcelChapterStore = function($ctn) {
            var _this = this;
            var chapter = {}
            chapter.template = 'html'
            chapter.store = []
            if ($ctn[0].querySelector('table')) {
                $ctn.find('table').each(function(index, tb) {
                    var $tb = $(tb)
                    var arrHead = []
                    var arrData = [];
                    if ($tb.prev('p').length > 0) {
                        chapter.store.push({ template: 'table', role: 'title', height: _this.getExcelTextHeight($tb.prev('p')[0].innerText), data: $tb.prev('p')[0].innerText })
                    }
                    $tb.find('thead tr').each(function(i, tr) {
                        arrHead = [];
                        var arrDom = [];
                        $(tr).find('td').each(function(index, dom){arrDom.push(dom)});
                        $(tr).find('th').each(function(index, dom){arrDom.push(dom)});
                        arrDom.forEach(function(th) {
                            if(th.getAttribute('rowspan') || th.getAttribute('colspan')){
                                arrHead.push({col:parseInt(th.getAttribute('colspan')) || 1,row:parseInt(th.getAttribute('rowspan')) || 1,content:th.innerHTML})
                            }else {
                                arrHead.push(th.innerHTML)
                            }
                        })
                        chapter.store.push({ template: 'table', role: 'head', data: arrHead })
                    })
                    // $tb.find('thead td').each(function(i, tr) {
                    //     if(th.getAttribute('rowspan') || th.getAttribute('colspan')){
                    //         arrHead.push({col:parseInt(th.getAttribute('colspan')) || 1,row:parseInt(th.getAttribute('rowspan')) || 1,content:th.innerHTML})
                    //     }else {
                    //         arrHead.push(th.innerHTML)
                    //     }
                    // })
                    $tb.find('tbody tr').each(function(i, tr) {
                        arrData = [];
                        var arrDom = [];
                        $(tr).find('td').each(function(index, dom){arrDom.push(dom)});
                        $(tr).find('th').each(function(index, dom){arrDom.push(dom)});
                        arrDom.forEach(function(td) {
                            if(td.getAttribute('rowspan') || td.getAttribute('colspan')){
                                arrData.push({col:parseInt(td.getAttribute('colspan')) || 1,row:parseInt(td.getAttribute('rowspan')) || 1,content:td.innerHTML})
                            }else {
                                arrData.push(td.innerHTML)
                            }
                        })
                        chapter.store.push({ template: 'table', role: 'data', data: arrData })
                    })
                })
            }
            if ($ctn[0].querySelector('[_echarts_instance_]')) {
                var $chartCtn = $ctn.find('[_echarts_instance_]');
                var chartIns, chartOpt, chartStore,chartType
                for (var i = 0; i < $chartCtn.length; i++) {
                    chartIns = echarts.getInstanceById($chartCtn[i].getAttribute('_echarts_instance_'))
                    chartOpt = chartIns.getOption()
                    chartType = 'line'
                    try {
                        if (!(chartOpt.series instanceof Array)) return
                        for (var j = 0; j < chartOpt.series.length; j++) {
                            if (chartOpt.series[i].type == 'pie') {
                                chartType = 'pie';
                                break;
                            } else if (chartOpt.series[i].type == 'gauge') {
                                chartType = 'gauge';
                                break;
                            }
                        }
                        chartStore = {
                            'role': 'data',
                            'data': {
                                'title': {
                                    'name': (chartOpt.title && chartOpt.title[0]) ? chartOpt.title[0].text : ''
                                },
                                'type': chartType,
                            },
                            'subType': '',
                            'template': 'chart'
                        }
                        switch (chartType) {
                            case 'line':
                                if (chartOpt.xAxis[0].type == 'value' && chartOpt.yAxis[0].type == 'category') {
                                    chartStore.data.xAxis = [{ name: chartOpt.xAxis[0].name }]
                                    chartStore.data.yAxis = chartOpt.yAxis.map(function(item) { return { name: item.name } })
                                    chartStore.data.subtype = chartOpt.series[0].stack ? 'stacked' : ''
                                    chartStore.data.series = chartOpt.series.map(function(item) {
                                        return {
                                            isAxisReverse: true,
                                            name: item.name,
                                            values: item.data.map(function(d) { return parseFloat(d) }),
                                            categories: chartOpt.yAxis[0].data,
                                            type: item.type,
                                            y2_axis: item.yAxisIndex ? true : false
                                        }
                                    })
                                } else {
                                    chartStore.data.subtype = chartOpt.series[0].stack ? 'stacked' : ''
                                    chartStore.data.xAxis = [{ name: chartOpt.xAxis[0].name }]
                                    chartStore.data.yAxis = chartOpt.yAxis.map(function(item) { return { name: item.name } })
                                    chartStore.data.series = chartOpt.series.map(function(item) {
                                        return {
                                            name: item.name,
                                            values: item.data.map(function(d) { return parseFloat(d) }),
                                            categories: chartOpt.xAxis[0].data,
                                            type: item.type,
                                            y2_axis: item.yAxisIndex ? true : false
                                        }
                                    })
                                }
                                break;
                            case 'pie':
                                chartStore.data.series = chartOpt.series.map(function(item) {
                                    return {
                                        name: item.name,
                                        values: item.data.map(function(d) { return parseFloat(d.value) }),
                                        categories: item.data.map(function(d) { return d.name }),
                                        type: item.type,
                                        points: item.data.map(function(d, index) { return { fill: { color: chartOpt.color[index % chartOpt.color.length] } } }),
                                    }
                                })
                                break;
                            case 'gauge':
                                chartStore.data.series = chartOpt.series.map(function(item) {
                                    return {
                                        name: item.name,
                                        values: item.data.map(function(d) { return parseFloat(d.value) }),
                                        categories: item.data.map(function(d) { return d.name }),
                                        type: item.type,
                                        points: item.data.map(function(d, index) { return { fill: { color: chartOpt.color[index % chartOpt.color.length] } } }),
                                    }
                                })
                                break;
                        }
                        chapter.store.push(chartStore)
                    } catch (e) {}
                }
            }
            $ctn.find('p').each(function(i, des) {
                if ($(des).next('table').length > 0) return;
                if (des.innerText) {
                    var textHeight = _this.getExcelTextHeight(des.innerText)
                    chapter.store.push({ template: 'desc', data: des.innerText, height: textHeight });
                }
            })
            return chapter
        };
        this.setExcelChapterPos = function(chap, parent) {
            var row = 0;
            if (chap.template == 'container') {
                chap.row1 = 0;
                chap.row2 = 0;
                chap.col1 = 0;
                chap.col2 = 0;
                if (chap.sub instanceof Array && chap.sub.length > 0) {
                    for (var i = 0; i < chap.sub.length; i++) {
                        this.setExcelChapterPos(chap.sub[i], chap)
                    }
                }
            } else if (chap.template == 'summary') {
                chap.row1 = 0;
                chap.row2 = 0;
                chap.col1 = 0;
                chap.col2 = 0;
                if (chap.store instanceof Array && chap.store.length > 0) {
                    chap.col2 = 10;
                    for (var i = 0; i < chap.store.length; i++) {
                        chap.row2++;
                    }
                }
                if (chap.sub instanceof Array && chap.sub.length > 0) {
                    for (var i = 0; i < chap.sub.length; i++) {
                        this.setExcelChapterPos(chap.sub[i], chap)
                    }
                }
            } else if (chap.template == 'table') {
                chap.col1 = 0;
                chap.col2 = 0;
                chap.row1 = parent.row2;
                chap.row2 = chap.row1;
                if (chap.store instanceof Array && chap.store.length > 0) {
                    for (var i = 0; i < chap.store.length; i++) {
                        chap.row2 = chap.row2 + 1;
                        if (chap.store[i].role == 'title') {
                            chap.col2 = Math.max(1, chap.col2);
                        } else if (chap.store[i].role == 'head') {
                            chap.col2 = Math.max(chap.store[i].data.length, chap.col2);
                        } else if (chap.store[i].role == 'data') {
                            chap.col2 = Math.max(chap.store[i].data.length, chap.col2);
                        }
                    }
                }
                parent.col2 = Math.max(parent.col2, chap.col2);
                parent.row2 = chap.row2;
            } else if (chap.template == 'html') {
                chap.col1 = 0;
                chap.col2 = 0;
                chap.row1 = parent.row2;
                chap.row2 = chap.row1;
                if (chap.store && chap.store instanceof Array) {
                    for (var i = 0; i < chap.store.length; i++) {
                        //chap.col2 = Math.max(chap.col2, Math.ceil(chap.store[i].length / 10))
                        if (chap.store[i].template == 'table') {
                            chap.row2 = chap.row2 + 1;
                            if (chap.store[i].role == 'title') {
                                chap.col2 = Math.max(1, chap.col2);
                            // } else if (chap.store[i].role == 'head') {
                            //     chap.col2 = Math.max(chap.store[i].data.length, chap.col2);
                            } else if (chap.store[i].role == 'data' || chap.store[i].role == 'head') {
                                chap.col2 = Math.max(chap.store[i].data.length, chap.col2);
                                for (var k = 0; k< chap.store[i].data.length;k++){
                                    var tempTbData = chap.store[i].data[k];
                                    if(tempTbData.row) {
                                        for (var l = 1; l < tempTbData.row;l++) {
                                            if (chap.store[i + l] && chap.store[i + l].template == 'table') {
                                                chap.store[i + l].data.splice(k,0,'<%blank%>');
                                                //chap.store[i + l].data.slice(k).forEach(function(tbData,_index){
                                                //    if(typeof tbData != 'object'){
                                                //        tbData = {
                                                //            col1_offset:1,
                                                //            content:tbData
                                                //        }
                                                //    }else{
                                                //        if(!tbData.col1_offset)tbData.col1_offset = 0 ;
                                                //        tbData.col1_offset++
                                                //    }
                                                //    chap.store[i + l].data[k + _index] = tbData
                                                //})
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (chap.store[i].template == 'chart') {
                            if (chap.store[i].role == 'data') {
                                chap.row2 = chap.row2 + 29;
                                chap.col2 = Math.max(10, chap.col2);
                            }
                        } else {
                            chap.row2 = chap.row2 + 1;
                            chap.col2 = Math.max(10, chap.col2);
                        }
                    }
                }
                parent.col2 = Math.max(parent.col2, chap.col2)
                parent.row2 = chap.row2;
            } else if (chap.template == 'chart') {
                chap.col1 = 0;
                chap.col2 = 0;
                chap.row1 = parent.row2;
                chap.row2 = chap.row1;
                for (var i = 0; i < chap.store.length; i++) {
                    if (chap.store[i].role == 'data') {
                        chap.row2 = chap.row2 + 29;
                    }
                }
                chap.col2 = 10;
                parent.col2 = Math.max(parent.col2, chap.col2)
                parent.row2 = chap.row2;
            }
        };
        this._showReport = function(reportId, period, date) {
            if (this.report) {
                this.report.close();
            }

            this.report = new FacReportScreen({
                id: reportId,
                period: period,
                date: date
            }, this.centerCtn.children('div')[1]);

            return this.report.show();
        };
        this.initLayoutDOM = function() {
            $(this.container).removeClass("scrollable-y gray-scrollbar");
            this.row = $('<div class="reportContainer">').addClass("scrollable-y gray-scrollbar").css({ "width": "100%", height: "100%" });
            this.row.appendTo(this.container);
            //创建左边内容
            var link = window.location.href;
            if (link.indexOf("externalChainPage") !== -1) {
                this.leftCtn = $('<div id="leftCtn" class="externalChainStyle"></div>');
            } else {
                this.leftCtn = $('<div id="leftCtn"></div>');
            }
            this.leftCtn.appendTo(this.row);
            this.getReportList();

            //创建中间内容
            this.centerCtn = $('<div id="centerCtn"><div class="top"></div><div class="center"></div></div>');
            this.centerCtn.appendTo(this.row);
            this.centerCtnCon();
        };

        this.getReportList = function() {
            var arrHtml = ['<div class="leftCtnTop"><div class="downloadBox"></div></div>', '<ul class="repotChapList">'];
            for (var i = 0, row, len = this.store.list.length; i < len; i++) {
                row = this.store.list[i];
                arrHtml.push('<li title="' + row.reportName + '" class="reportListName"><img class="arrow" src="/static/app/WebFactory/themes/default/images/left.svg"><span class="copyUrl"></span><a href="javascript:;" class="report-item" data-id="' + row.reportId + '" data-period="' + row.period + '" data-offset = "' + row.periodStartTime + '">' + row.reportName + '</a></li>');
            }
            arrHtml.push('</ul>');
            return this.leftCtn.html(arrHtml.join(''));
        };
        this.centerCtnCon = function() {
            //pdf下载
            var pdfDownCtn = $('<div class="pdfDownCtn in"></div>');
            var pdfDownCon = '<span class="iconfont icon-pdf" style="margin-left:10px;"></span><span class="pdf_text">' + I18n.resource.report.reportWrap.PDFDOWNLOAD + '</span>';
            pdfDownCtn.html(pdfDownCon);
            pdfDownCtn.appendTo($(".downloadBox"));

            //word下载
            var wordDownCtn = $('<div class="wordDownCtn in"></div>');
            var wordDownCon = '<span class="iconfont icon-word" style="margin-left:10px;"></span><span class="word_text">' + I18n.resource.report.reportWrap.WORDDOWNLOAD + '</span>';
            wordDownCtn.html(wordDownCon);
            wordDownCtn.appendTo($(".downloadBox"));

            //excel下载
            var excelDownCtn = $('<div class="excelDownCtn in"></div>');
            var excelDownCon = '<span class="iconfont icon-excel" style="margin-left:10px;"></span><span class="excel_text">' + I18n.resource.report.reportWrap.EXCELDOWNLOAD + '</span>';
            excelDownCtn.html(excelDownCon);
            excelDownCtn.appendTo($(".downloadBox"));

            //日历
            var newDate = new Date().format("yyyy-MM-dd");
            var calendarCtn = $('<div class="calendarCtn"></div>');
            calendarCtn.html('<input type="text" value="' + newDate + '" readonly class="form_datetime calendar_date">');
            calendarCtn.appendTo($(".leftCtnTop"));


            // 无需升级
            $(".form_datetime").datetimepicker({
                format: 'yyyy-mm-dd',
                minView: 'month',
                autoclose: true
            });
            var _this = this;
            $(".form_datetime").on("click", function() {
                var date = new Date($(this).val());
                var datetimepickerDays = $(".datetimepicker").find(".datetimepicker-days");
                var curTr = datetimepickerDays.find("td.active").closest("tr");
                _this.getWeekStartEndTime(date, curTr);
                $(".datetimepicker-days").off("mouseover", ".day").on("mouseover", ".day", function() {
                    $(this).closest("tbody").find("td").removeClass("tdHigh");
                    var curTime = $(this).html() + $(this).closest(".table-condensed").find(".switch").html();
                    if ($(this).hasClass("old")) {
                        curTime = new Date(new Date(curTime).setMonth(new Date(curTime).getMonth() + 1)).format("yyyy-MM-dd");
                    } else if ($(this).hasClass("new")) {
                        curTime = new Date(new Date(curTime).setMonth(new Date(curTime).getMonth() + 1)).format("yyyy-MM-dd");
                    }
                    var curTr = $(this).closest("tr");
                    var date = new Date(curTime);
                    _this.getWeekStartEndTime(date, curTr);
                });
                $(".datetimepicker-days").off("mouseout", ".day").on("mouseout", ".day", function() {
                    $(this).closest("tbody").find("td").removeClass("tdHigh");
                });
                $(".datetimepicker-days").off("mouseout", "tbody").on("mouseout", "tbody", function() {
                    var datetimepickerDays = $(".datetimepicker").find(".datetimepicker-days");
                    var curTr = datetimepickerDays.find("td.active").closest("tr");
                    _this.getWeekStartEndTime(date, curTr);
                })
            });
        };
        this.getWeekStartEndTime = function(date, curTr) {
            var selectedReport = $(this.leftCtn).find("a.selected");
            var dataPeriod = selectedReport.data("period");
            var periodStartTime = selectedReport.data("offset");
            if (dataPeriod != "week") { return; }
            var monday;
            if (date.getDay() === 0) {
                monday = date.setDate(date.getDate() - 6);
            } else {
                monday = date.setDate(date.getDate() + 1 - date.getDay());
            }
            monday = new Date(monday);
            var dStart = new Date(monday.valueOf() + (periodStartTime === 0 ? periodStartTime : periodStartTime - 7) * 86400000);
            var dEnd = new Date(dStart.valueOf() + 86400000 * 6);
            var datetimepickerDays = $(".datetimepicker").find(".datetimepicker-days");
            //var curTr = datetimepickerDays.find("td.active").closest("tr");
            var curTds = curTr.find("td");
            var prevTds = curTr.prev("tr").find("td");
            var nextTds = curTr.next("tr").find("td");
            var startTd, endTd;
            [prevTds, curTds, nextTds].some(function(item) {
                startTd = item.filter(function(i, row) {
                    return parseInt($(row).html()) === parseInt(dStart.format("yyyy-MM-dd").split("-")[2])
                });
                if (startTd.length > 0) {
                    return true;
                }
            });
            [prevTds, curTds, nextTds].some(function(item) {
                endTd = item.filter(function(i, row) {
                    return parseInt($(row).html()) === parseInt(dEnd.format("yyyy-MM-dd").split("-")[2])
                });
                if (endTd.length > 0) {
                    return true;
                }
            });
            if (startTd.length > 0) {
                startTd.addClass("tdHigh");
                startTd.nextAll("td").addClass("tdHigh");
            }
            if (endTd.length > 0) {
                endTd.addClass("tdHigh");
                endTd.prevAll("td").addClass("tdHigh");
            }
        };
        ///////////////////
        // tree - start ///
        ///////////////////
        +

        function() {
            // 报表导航树的默认配置
            var DEFAULT_TREE_OPTIONS = {
                container: document.body
            };

            this.optionsArr = [];

            this.treeOptions = {};
            //获取到的报表数据
            this.option = {};

            // 配置导航树
            this.setTreeOptions = function(options) {
                this.treeOptions = $.extend(false, DEFAULT_TREE_OPTIONS, options);
            };
            //渲染导航树
            this.renderTree = function() {
                var _this = this;
                var container = this.treeOptions.container;
                var $headline = $(container).find(".headline");

                var navTreeArr = ['<ul>'];
                Array.prototype.forEach.call($headline, function(row) {
                    var id = row.id;
                    var title = row.innerHTML;
                    // 章节的级别
                    var level = id.split('_')[1].split('-').length;
                    navTreeArr.push('<li><a href="#' + id + '" title="' + title + '" class="col-xs-offset-' + (level - 1) + ' ">' + title + '</a></li>');

                });
                navTreeArr.push("</ul>");
                $(".navTree").html(navTreeArr.join(''));
                //划过章节列表
                $('.navTree').find("li").hover(function() {
                    $(this).addClass("in");
                }, function() {
                    $(this).removeClass("in");
                });
                //点击章节列表
                $('.navTree').find("li").click(function() {
                    $('.navTree').find("li").removeClass("selected");
                    $(this).addClass("selected");
                });
            };
            //销毁导航树
            this.destroyTree = function() {
                $(".navTree").empty().remove();
            };

        }.call(this);
        ///////////////////
        // tree - end ///
        ///////////////////
        this.close = function() {
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

            this.container.classList.remove('scrollable-y');
            this.container.classList.remove('gray-scrollbar');
        };

    }.call(FacReportWrapScreen.prototype);

    exports.FacReportWrapScreen = FacReportWrapScreen;
}(namespace('observer.screens'),
    namespace('observer.screens.FacReportScreen')));