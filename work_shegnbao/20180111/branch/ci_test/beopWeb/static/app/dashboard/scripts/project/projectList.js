/**
 * Created by win7 on 2015/10/20.
 */
var ProjectList = (function() {
    var _this;

    function ProjectList() {
        _this = this;
        this.priority = undefined;
        this.priorityTar = undefined;
        this.hasItemSel = false;
    }
    ProjectList.navOptions = {
        top: '<div class="navTopItem middle title" i18n="appDashboard.project.PROJECT_LIST"></div>\
        <span id="btnAdminConfig" class="navTopItem right"></span>',
        bottom: true,
        backDisable: false,
        virtual: true
    };
    ProjectList.prototype = {
        show: function() {
            // if (ProjectConfig.projectId != null) {
            //     $('#btnBack').addClass('enable');
            // }
            $.ajax({ url: 'static/app/dashboard/views/project/projectList.html' }).done(function(resultHTML) {
                $(ElScreenContainer).html(resultHTML);
                var $adminConfig = $('#btnAdminConfig');
                $adminConfig[0].innerHTML = '<img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com' + AppConfig.userProfile.picture + '"><span class="newMessageNum tip"></span>';
                //$adminConfig[0].innerHTML = '<img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com' + AppConfig.userProfile.picture + '">';
                $adminConfig.off('touchstart').on('touchstart', function(e) {
                    var adminConfigNew = new AdminConfigNew();
                    adminConfigNew.show();
                });
                _this.init();
                _this.messageNumber();
                I18n.fillArea($('#navTop'));
            });
        },
        messageNumber:function(){
            //获取消息数量
            if(AppConfig.newMessageNumber) {
                $('.newMessageNum').addClass('active').html(AppConfig.newMessageNumber);
            }
        },
        init: function() {
            _this.priority = JSON.parse(localStorage.getItem('projPriority'));
            if (!_this.priority) {
                _this.priority = {};
                for (var i = 0; i < ProjectConfig.projectList.length; i++) {
                    _this.priority[ProjectConfig.projectList[i].id] = i
                }
                localStorage.setItem('projPriority', JSON.stringify(_this.priority));
            }
            _this.initTopNav();
            _this.initProjectList();
            _this.initPriority();
            _this.initProjectDisplay();
        },
        initProjectList: function(arg) {
            var arrProject = arg ? arg : ProjectConfig.projectList;
            arrProject = _this.sortProjByPriority(arrProject);
            var $ulProjectList = $('#ulProjectList');
            var strLiProject = new StringBuilder();
            var language = AppConfig.language;
            for (var i = 0, status = ''; i < arrProject.length; ++i) {
                strLiProject = new StringBuilder();

                arrProject[i].online ? status = 'online' : status = 'offline grayFillter';

                strLiProject.append('<div class="liProject zepto-ev ' + status + '" id="proj_' + arrProject[i].id + '"projId=' + arrProject[i].id + ' priority="' + arrProject[i].priority + '">');
                strLiProject.append('   <div class="projectIcon"><img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/project_img/' + arrProject[i].pic + '"></div>');
                strLiProject.append('   <div class="projectInfo">');
                if (language == 'en') {
                    strLiProject.append('   <div class="projectName title">' + arrProject[i].name_english);
                } else if (language = 'zh') {
                    strLiProject.append('   <div class="projectName title">' + arrProject[i].name_cn);
                } else {
                    if (navigator && navigator.language && navigator.language.split('-')[0] == 'en') {
                        strLiProject.append('   <div class="projectName title">' + arrProject[i].name_english);
                    } else {
                        strLiProject.append('   <div class="projectName title">' + arrProject[i].name_cn);
                    }
                }

                strLiProject.append('</div>');

                if (arrProject[i].online && arrProject[i].lastReceivedTime) {
                    strLiProject.append('   <div class="projectStatus online">' + DateUtil.getRelativeDateInfo(new Date(), new Date(arrProject[i].lastReceivedTime.replace(/-/g, '/'))) + '</div>');
                } else {
                    strLiProject.append('   <div class="projectStatus offlineStatus"><i class="iconfont">&#xe7e9;</i></div>');
                }
                strLiProject.append('   </div>');
                strLiProject.append('</div>');
                if (arrProject[i].id == ProjectConfig.projectId) {
                    var $temp = $(strLiProject.toString());
                    $temp.attr('id', 'projSel').removeClass('grayFillter').addClass('selected');
                    //$ulProjectList.prepend($temp);
                    //$temp = $(strLiProject.toString());
                    //$temp.find('.iconSelect').remove();
                    $ulProjectList.append($temp); //.css('display','none')
                    _this.hasItemSel = true;
                } else {
                    $ulProjectList.append(strLiProject.toString());
                }
            }
        },
        initProjectDisplay: function() {
            var _this = this;
            $('.liProject').off('tap').on('tap', function(e) {
                ProjectConfig.projectId = $(e.currentTarget).attr('projId');
                AppConfig.projectId = ProjectConfig.projectId;
                _this.initPriority();
                for (var i = 0; i < ProjectConfig.projectList.length; i++) {
                    if (ProjectConfig.projectId == ProjectConfig.projectList[i].id) {
                        ProjectConfig.projectInfo = ProjectConfig.projectList[i];
                        ProjectConfig.projectIndex = i;
                    }
                }
                _this.initFirstPage()
                    // router.to({
                    //     typeClass: ProjectSummary,
                    //     data: {
                    //         isFromProjLs: true
                    //     }
                    // })
            })
        },
        initFirstPage: function() {
            localStorage.setItem('defaultProject', JSON.stringify(ProjectConfig.projectInfo));
            localStorage.setItem('defaultProjectId', ProjectConfig.projectId);
            var $listReady = $.Deferred();
            var activeDashboard = false,
                activeReport = false;
            var module
            try {
                module = JSON.parse(localStorage.getItem('lastAppConfig')).module
            } catch (e) {
                module = null;
            }
            if (ProjectConfig.projectId) {
                this.setBottomNavStatus().done(function(page, report) {
                    activeDashboard = page.length > 0
                    activeReport = report.length > 0
                }).always(function() {
                    $listReady.resolve()
                });
            } else {
                $listReady.resolve()
            }
            $listReady.done(function() {
                switch (module) {
                    case 'project':
                        if (activeDashboard) {
                            router.empty().to({
                                typeClass: ProjectSummary,
                                data: {}
                            });
                        } else if (activeReport) {
                            router.empty().to({
                                typeClass: ReportIndex,
                                data: {}
                            });
                        } else {
                            router.empty().to({
                                typeClass: WorkflowIndex,
                                data: {}
                            });
                        }
                        break;
                    case 'report':
                        if (activeReport) {
                            router.empty().to({
                                typeClass: ReportIndex,
                                data: {}
                            });
                            break;
                        } else if (activeDashboard) {
                            router.empty().to({
                                typeClass: ProjectSummary,
                                data: {}
                            });
                        } else {
                            router.empty().to({
                                typeClass: WorkflowIndex,
                                data: {}
                            });
                        }
                    case 'workflow':
                        router.empty().to({
                            typeClass: WorkflowIndex,
                            data: {}
                        });
                        break;
                    default:
                        if (activeDashboard) {
                            router.empty().to({
                                typeClass: ProjectSummary,
                                data: {}
                            });
                        } else if (activeReport) {
                            router.empty().to({
                                typeClass: ReportIndex,
                                data: {}
                            });
                        } else {
                            router.empty().to({
                                typeClass: WorkflowIndex,
                                data: {}
                            });
                        }
                        break;
                }
            })
        },
        setBottomNavStatus: function() {
            var pageList = []
            var reportList = []
            var $promise = $.Deferred();
            SpinnerControl.show()
            WebAPI.get("/get_plant_pagedetails/" + ProjectConfig.projectId + "/" + AppConfig.userId).done(function(resultData) {
                if (resultData.navItems && resultData.navItems.length > 0) {
                    pageList = resultData.navItems.filter(function(ele) {
                        return ele.type === "EnergyScreen_M"
                    });
                    ProjectConfig.dashboardList = pageList
                    reportList = resultData.navItems.filter(function(item) {
                        return item.type === 'FacReportWrapScreen' || item.type === 'ReportScreen';
                    });

                    if (pageList.length > 0) {
                        $('#btnProject').removeClass('hide')
                    } else {
                        $('#btnProject').addClass('hide')
                    }

                    if (reportList.length > 0) {
                        $('#btnReport').removeClass('hide')
                    } else {
                        $('#btnReport').addClass('hide')
                    }
                    // if (reportList.length == 0 && pageList.length == 0) {
                    //     $('navBottom').removeClass('active')
                    // } else {
                    //     $('navBottom').addClass('active')
                    // }
                    $promise.resolveWith(this, [pageList, reportList])
                } else {
                    ProjectConfig.dashboardList = []
                    $('#btnProject').addClass('hide')
                    $('#btnReport').addClass('hide')
                    $promise.reject()
                }
            }).fail(function() {
                ProjectConfig.dashboardList = []
                $('#btnProject').addClass('hide')
                $('#btnReport').addClass('hide')
                $promise.reject()
            }).always(function() {
                SpinnerControl.hide()
            })
            return $promise
        },
        initPriority: function() {
            var initPriority = _this.priority[ProjectConfig.projectId];
            for (var ele in _this.priority) {
                if (_this.priority[ele] < initPriority) {
                    _this.priority[ele] += 1
                }
            }
            _this.priority[ProjectConfig.projectId] = 0;
            localStorage.setItem('projPriority', JSON.stringify(_this.priority));
        },
        //initPriority:function(proj){
        //    var $ctnPrioritySet = $('#ctnPrioritySet');
        //    var $divCurPriority = $('#divCurPriority');
        //    var $ulProjectList = $('#ulProjectList');
        //    $('.btnProjPriority').off('tap').on('tap',function(e){
        //        e.stopPropagation();
        //        $ctnPrioritySet.removeClass('off').addClass('on');
        //        _this.priorityTar = $(e.currentTarget).closest('.liProject');
        //        if(_this.priorityTar.attr('id') == 'projSel'){
        //            _this.priorityTar = $('#proj_' + _this.priorityTar.attr('projId'))
        //        }
        //        //$divCurPriority.html(_this.priorityTar.attr('priority'));
        //        var $dropdownBack = $('<div id="dropdownBack" class="zepto-ev"></div>');
        //        $(ElScreenContainer).append($dropdownBack);
        //        $dropdownBack.on('tap',function(e){
        //            $ctnPrioritySet.removeClass('on').addClass('off');
        //            _this.priorityTar = undefined;
        //            $dropdownBack.remove();
        //        })
        //    });
        //    $('#btnPriorityTop').off('tap').on('tap',function(){
        //        var initPriority = _this.priorityTar.attr('priority');
        //        var $liProject = $('.liProject');
        //        var priority;
        //        var startNum = _this.hasItemSel?1:0;
        //        if (0 == initPriority)return;
        //        for (var i = startNum;i < $liProject.length;i++){
        //            priority = $liProject.eq(i).attr('priority');
        //            if(priority >= initPriority){
        //                break;
        //            }
        //            $liProject.eq(i).attr('priority',parseInt(priority) + 1);
        //            _this.priority[$liProject.eq(i).attr('projId')] = parseInt(priority) + 1;
        //        }
        //        _this.priorityTar.attr('priority',0);
        //        _this.priority[_this.priorityTar.attr('projId')] = 0;
        //        $liProject.eq(startNum).before(_this.priorityTar);
        //        localStorage.setItem('projPriority',JSON.stringify(_this.priority));
        //    });
        //    $('#btnPriorityBottom').off('tap').on('tap',function(){
        //        var $liProject = $('.liProject');
        //        var maxPriority = $liProject.last().attr('priority');
        //        var initPriority = _this.priorityTar.attr('priority');
        //        if (maxPriority == initPriority)return;
        //        var index = $liProject.index(_this.priorityTar);
        //        var priority;
        //        var endNum = _this.hasItemSel?1:0;
        //        for (var i = $liProject.length - 1;i >= endNum;i--){
        //            priority = $liProject.eq(i).attr('priority');
        //            if (priority <= initPriority) {
        //                break;
        //            }
        //            priority -= 1;
        //            $liProject.eq(i).attr('priority',priority);
        //            _this.priority[$liProject.eq(i).attr('projId')] = parseInt(priority);
        //        }
        //        _this.priorityTar.attr('priority',maxPriority) ;
        //        _this.priority[_this.priorityTar.attr('projId')] = parseInt(maxPriority);
        //        $liProject.last().after(_this.priorityTar);
        //        localStorage.setItem('projPriority',JSON.stringify(_this.priority));
        //    });
        //    $('#btnPriorityUp').off('tap').on('tap',function(){
        //        var initPriority = _this.priorityTar.attr('priority');
        //        if (initPriority == 0)return;
        //        var $liProject = $('.liProject');
        //        var $prevProj = _this.priorityTar.prev();
        //        var prevPriority = $prevProj.attr('priority');
        //        _this.priorityTar.attr('priority',parseInt(prevPriority));
        //        _this.priority[_this.priorityTar.attr('projId')] = parseInt(prevPriority);
        //        $prevProj.attr('priority',initPriority);
        //        _this.priority[$prevProj.attr('projId')] = parseInt(initPriority);
        //        _this.priorityTar.after($prevProj);
        //        localStorage.setItem('projPriority',JSON.stringify(_this.priority));
        //    });
        //    $('#btnPriorityDown').off('tap').on('tap',function(){
        //        var initPriority = _this.priorityTar.attr('priority');
        //        var $liProject = $('.liProject');
        //        var $nextProj = _this.priorityTar.next();
        //        if ($nextProj.length == 0)return;
        //        var nextPriority = $nextProj.attr('priority');
        //        _this.priorityTar.attr('priority',parseInt(nextPriority));
        //        _this.priority[_this.priorityTar.attr('projId')] = parseInt(nextPriority);
        //        $nextProj.attr('priority',initPriority);
        //        _this.priority[$nextProj.attr('projId')] = parseInt(initPriority);
        //        _this.priorityTar.before($nextProj);
        //        localStorage.setItem('projPriority',JSON.stringify(_this.priority));
        //    });
        //},
        sortProjByPriority: function(arrProj) {
            var arr = [];
            var priority;
            var extra = 0;
            for (var i = 0; i < arrProj.length; i++) {
                priority = _this.priority[arrProj[i].id];
                if (priority == undefined) {
                    priority = arrProj.length + extra;
                    extra += 1;
                }
                arr[priority] = arrProj[i];
                arr[priority].priority = _this.priority[arrProj[i].id]
            }
            arr = arr.filter(function(ele) {
                return ele != undefined;
            });
            return arr;
        },
        initTopNav: function() {
            var language = AppConfig.language;
            if (language == 'en') {
                var serarchText = 'Search';
            } else if (language == 'zh') {
                var serarchText = '搜索';
            }
            $('.iptSearch').attr('placeholder', serarchText);
            // $('#btnProjectMap').off('touchstart').on('touchstart', function () {
            //     router.to({
            //         typeClass: ProjectMap,
            //         data: {}
            //     })
            // });
            $('.iptSearch').off('input propertychange').on('input propertychange', function(e) {
                $('#ulProjectList').html('');
                var target = $(e.currentTarget).val();
                var arrResult = [];
                for (var i = 0; i < ProjectConfig.projectList.length; i++) {
                    var arrName = [ProjectConfig.projectList[i].id, ProjectConfig.projectList[i].name_cn, ProjectConfig.projectList[i].name_en, ProjectConfig.projectList[i].name_english];
                    if (new RegExp(target, 'i').test(arrName.join())) {
                        arrResult.push(ProjectConfig.projectList[i])
                    }
                }
                _this.initProjectList(arrResult);
                //_this.initPriority();
                _this.initProjectDisplay();
            });
            // $('#btnBack').off('tap').on('tap', function() {
            //     if (ProjectConfig.projectId != null) {
            //         router.to({
            //             typeClass: ProjectSummary,
            //             data: {}
            //         })
            //     }
            // });
        },
        close: function() {
            // $('#btnBack').removeClass('enable').off('tap').on('tap', function() {
            //     router.back()
            // });
        }
    };
    return ProjectList;
})();