/**
 * Created by win7 on 2016/11/22.
 */
var ReportIndex = (function() {
    function ReportIndex() {
        this.tranditionalReportList = [];
        this.factoryReportList = [];
        this.factoryReportComplete = undefined;

        this.projectId = ProjectConfig.projectId
    }
    ReportIndex.navOptions = {
        top: '<div id="reportTtl" class="navTopItem title middle" i18n="appDashboard.message.MY_REPORT"></div>\
        <span id="btnAdminConfig" class="navTopItem right"></span>',
        bottom: true,
        backDisable: true,
        module: 'report'
    };
    ReportIndex.prototype = {
        reportTypeMap: {
            daily: '0',
            monthly: '1',
            weekly: '2'
        },

        show: function() {
            var _this = this;
            var msg = [];
            try {
                msg = JSON.parse(localStorage.getItem('pushReport')).filter(function(item) { return item.projectId != _this.projectId });
                if (!msg) msg = [];
            } catch (e) {
                msg = [];
            }
            localStorage.setItem('pushReport', JSON.stringify(msg))
            $('#btnReport .pushTip').text(0).hide();

            var _this = this;
            ElScreenContainer.innerHTML = '';
            I18n.fillArea($('#navTop'));
            WebAPI.get('static/app/dashboard/views/report/reportIndex.html').done(function(result) {
                ElScreenContainer.innerHTML = result;
                var $adminConfig = $('#btnAdminConfig');
                $adminConfig[0].innerHTML = '<img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com' + AppConfig.userProfile.picture + '"><span class="newMessageNum tip"></span>';
                $adminConfig.off('touchstart').on('touchstart', function(e) {
                    var adminConfigNew = new AdminConfigNew();
                    adminConfigNew.show();
                });
                _this.messageNumber();
                if (!ProjectConfig.projectId) {
                    window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.message.REPORT_NO_PROJECT, 'short', 'center');
                    return
                }
                _this.init();
                if (AppConfig.language == 'en') {
                    document.getElementById('reportTtl').innerHTML = ProjectConfig.projectInfo.name_english;
                } else if (AppConfig.language = 'zh') {
                    document.getElementById('reportTtl').innerHTML = ProjectConfig.projectInfo.name_cn;
                } else {
                    if (navigator && navigator.language && navigator.language.split('-')[0] == 'en') {
                        document.getElementById('reportTtl').innerHTML = ProjectConfig.projectInfo.name_english;
                    } else {
                        document.getElementById('reportTtl').innerHTML = ProjectConfig.projectInfo.name_cn;
                    }
                }
            });
        },
        messageNumber:function(){
            //获取消息数量
            if(AppConfig.newMessageNumber) {
                $('.newMessageNum').addClass('active').html(AppConfig.newMessageNumber);
            }
        },
        init: function() {
            var _this = this;
            SpinnerControl.show();
            WebAPI.get("/get_plant_pagedetails/" + ProjectConfig.projectId + "/" + AppConfig.userId + "/" + AppConfig.language).done(function(result) {
                if (result.navItems && result.navItems.length > 0) {
                    ProjectConfig.reportList = [];
                    _this.factoryReportList = result.navItems.filter(function(item) {
                        return item.type === 'FacReportWrapScreen';
                    });
                    _this.tranditionalReportList = result.navItems.filter(function(item) {
                        return item.type === 'ReportScreen';
                    });
                    _this.factoryReportComplete = $.Deferred();
                    ProjectConfig.reportList = [].concat(_this.tranditionalReportList);
                    if (_this.factoryReportList.length > 0 || _this.tranditionalReportList.length > 0) {
                        if (_this.factoryReportList.length > 0) {
                            _this.initFactoryReportList();
                        } else {
                            _this.factoryReportComplete.resolve();
                        }
                        if (_this.tranditionalReportList.length > 0) {
                            _this.factoryReportComplete.done(function() {
                                _this.initTraditionReportList();
                                SpinnerControl.hide();
                            });
                        } else {
                            SpinnerControl.hide();
                        }
                        _this.attachEvent();
                    } else {
                        SpinnerControl.hide();
                        window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.message.REPORT_ERR, 'short', 'center');
                    }
                } else {
                    SpinnerControl.hide();
                    window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.message.REPORT_ERR, 'short', 'center');
                }
            }).fail(function(e) {
                //new Alert($(AlertContainer), "danger", I18n.resource.appDashboard.message.REPORT_ERR).show().close();
                SpinnerControl.hide();
                window.plugins && window.plugins.toast.show(I18n.resource.appDashboard.message.REPORT_ERR, 'short', 'center');
            })
        },
        attachEvent: function() {
            var $item = $('.divReportItem');
            var _this = this,
                id;
            $(ElScreenContainer).off('tap').on('tap', '.divReportItem', function(e) {
                e.preventDefault();
                e.stopPropagation();
                id = e.currentTarget.id;
                if (e.currentTarget.dataset.src == 'factory') {
                    router.to({
                        typeClass: ProjectFactoryReport,
                        data: {
                            //reportDate:e.currentTarget.dataset.version,
                            reportId: id
                        }
                    });
                } else {
                    router.to({
                        typeClass: ProjectReport,
                        data: {
                            //reportDate:e.currentTarget.dataset.version,
                            reportId: id
                        }
                    });
                }
            })
        },
        initFactoryReportList: function() {
            var container = document.getElementById('ctnFactoryReport');
            var _this = this;
            if (!(this.factoryReportList.length && this.factoryReportList.length > 0)) {
                _this.factoryReportComplete.resolve();
                return;
            }
            var reportPage;
            var arguments1 = [];
            var dictReportItem = {};
            AppConfig.isFactory = 0;
            for (var i = 0; i < this.factoryReportList.length; i++) {
                reportPage = this.factoryReportList[i];
                dictReportItem[reportPage.id] = [];
                arguments1.push(getFactoryReport(reportPage))
            }
            $.when.apply(this, arguments1).always(function() {
                Object.keys(dictReportItem).forEach(function(wrap) {
                    dictReportItem[wrap].forEach(function(index) {
                        setReportIndexItem(index)
                    });
                    ProjectConfig.reportList = [].concat(dictReportItem[wrap], ProjectConfig.reportList);
                });
                _this.factoryReportComplete.resolve();
            });

            function getFactoryReport(page) {
                return WebAPI.get('/factory/reportWrap/' + AppConfig.isFactory + '/' + page.id).done(function(index) {
                    dictReportItem[page.id] = index.list;
                })
            }

            function setReportIndexItem(index) {
                var version = _this.getReportVersion(index.period);
                var reportName = index.reportName;

                var item = document.createElement('div');
                item.className = 'zepto-ev divReportItem media';
                item.id = index.reportId;
                item.dataset.src = 'factory';
                item.dataset.version = version;

                var icon = document.createElement('span');
                icon.className = 'spIcon iconfont icon-baobiao1 media-left';

                var infoCtn = document.createElement('div');
                infoCtn.className = 'infoCtn media-body media-body';
                var title = document.createElement('span');
                title.className = 'spTitle';
                title.textContent = reportName;

                var time = document.createElement('span');
                time.className = 'spTime';
                time.textContent = version;

                infoCtn.appendChild(title);
                infoCtn.appendChild(time);

                var entry = document.createElement('span');
                entry.className = 'spEntry glyphicon glyphicon-menu-right media-right';

                item.appendChild(icon);
                item.appendChild(infoCtn);
                item.appendChild(entry);
                container.appendChild(item);
            }
        },
        initTraditionReportList: function() {
            var _this = this;
            var container = document.getElementById('ctnTraditionalReport');
            _this.tranditionalReportList.forEach(function(val) {

                var version = _this.getReportVersion(val.reportType);
                var reportFolder = val.reportFolder;
                //var reportSummaryIndex = _this.reportSummaryShow[reportFolder];
                //var icon = _this.initReportIcon(reportFolder);

                var item = document.createElement('div');
                item.className = 'zepto-ev divReportItem';
                item.id = val.id;
                item.dataset.src = 'traditional';
                item.dataset.version = version;

                var icon = document.createElement('span');
                icon.className = 'spIcon iconfont icon-baobiao1';

                var title = document.createElement('span');
                title.className = 'spTitle';
                title.textContent = val.text;

                var time = document.createElement('span');
                time.className = 'spTime';
                time.textContent = version;

                var entry = document.createElement('span');
                entry.className = 'spEntry glyphicon glyphicon-menu-right';

                item.appendChild(icon);
                item.appendChild(title);
                item.appendChild(time);
                item.appendChild(entry);
                container.appendChild(item);
            })
        },
        getReportVersion: function(reportInfo, reportDate) {
            var thisDay, version;
            var reportType = reportInfo;
            var year, month, day;
            //this.reportDate = '2015-12-10';
            if (reportDate instanceof Date) {
                thisDay = reportDate;
            } else {
                thisDay = new Date();
            }
            if (reportType === this.reportTypeMap.daily || reportType == 'day') {
                //thisDay = new Date();
                if (+moment(thisDay.format('yyyy-MM-dd 00:00:00')) >= +moment(new Date().format('yyyy-MM-dd 00:00:00'))) {
                    thisDay = new Date();
                    thisDay.setDate(thisDay.getDate() - 1);
                }
                version = thisDay.format('yyyy-MM-dd');
            } else if (reportType === this.reportTypeMap.monthly || reportType == 'month') {
                //thisDay = new Date();
                if (+moment(thisDay.format('yyyy-MM-01')) >= +moment(new Date().format('yyyy-MM-01'))) {
                    thisDay = new Date();
                    thisDay.setMonth(thisDay.getMonth() - 1);
                }
                year = thisDay.getFullYear();
                month = thisDay.getMonth() + 1;
                version = year + '-' + StringUtil.padLeft(month, 2, '0');
            } else {
                var thisWeek = this.iso8601Week(thisDay);
                if (this.iso8601Week(new Date()) >= thisWeek) {
                    thisWeek = this.iso8601Week(new Date()) - 1;
                    thisDay = new Date();
                    thisDay = new Date(thisDay - 7 * 24 * 60 * 60 * 1000);
                }
                year = thisDay.getFullYear();
                version = DateUtil.getFirstDayOfWeek(year, thisWeek).format('yyyy-MM-dd');
            }
            return version;
        },
        iso8601Week: function(date) {
            //现在我们的项目把周日当做第一天,但是iso标准将周一当做一周中的第一天
            //var addOneDayDate = new Date(new Date(date).getTime() + 2 * 24 * 60 * 60 * 1000);
            var addOneDayDate = new Date(date);
            var time,
                checkDate = new Date(addOneDayDate.getTime());

            // Find Thursday of this week starting on Monday
            checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

            time = checkDate.getTime();
            checkDate.setMonth(0); // Compare with Jan 1
            checkDate.setDate(1);
            return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },
        close: function() {
            $(ElScreenContainer).off('tap');
        }
    };
    return ReportIndex
})();