var WorkflowCalendar = (function () {

    function WorkflowCalendar() {
        this.noticeList = [];
        this.eventType = {
            'notice': 1,
            'workflow': 2
        };
        this.currentEvent = null;
        this.currentElement = null;
        this.$calendar = null;
        this.displayType = 2; //0:不显示, 1:显示所有,2:显示个人,3:显示团队
        this.oldColor = null;
        this.addedNoticedMap = {};
        this.$dateTimePicker = null;
        this.isManager = false;
        this.DOMDone = null;
        this.noticePromiseMap = {};
        this.projectId = window.localStorage.getItem('calendarDefault') == null ? AppConfig.projectList[0].id : window.localStorage.getItem('calendarDefault');
        this.firstRender = true; //判断是否是第一次加载
        this.equipments_list = [];
        this.zones_list = [];
        this.currentPage = 1;
        this.pageSize = 20;
        this.overdue_type = 'all';
        this.user_level = 'all';
        this.fault_time_type = 'all';
    }

    WorkflowCalendar.prototype = {
        show: function (wrapper, dateTimePicker) {
            var _this = this;
            $.get("/static/views/workflow/calendar.html").done(function (resultHtml) {
                if (wrapper) {
                    var arr = resultHtml.split('<div class="datetimepicker-container"></div>'), html = '';
                    for (var i = 0; i < arr.length; i++) {
                        html += arr[i]
                    }
                    $(wrapper).html(html);
                    _this.isManager = true;
                } else {
                    $(ElScreenContainer).html(resultHtml);
                }
                _this.$dateTimePicker = $(dateTimePicker).length == 1 ? $(dateTimePicker) : $('.datetimepicker-container');
                setTimeout(function () {
                    _this.DOMDone && _this.DOMDone();
                    Spinner.spin($('#events')[0]);
                }, 0);
                _this.init();
                I18n.fillArea($("#wrap"));
            });
            return this;
        },

        close: function () {
            this.resetVariable();
            this.detachEvents();
        },
        resetVariable: function () {
            this.noticeList = [];
            this.equipments_list = [];
            this.zones_list = [];
            this.currentPage = 1;
            this.overdue_type = 'all';
            this.user_level = 'all';
            this.fault_time_type = 'all';
        },
        refreshPage: function () {

        },
        Done: function (func) {
            this.DOMDone = func;
        },
        init: function () {
            this.$calendar = $('#calendar');
            this.renderProjectSelector();
            this.attachEvent();
            //判断 localStorage
            if (window.localStorage.calendarDefault) {
                $('.project-selector').val(window.localStorage.calendarDefault)
            }
        },
        renderProjectSelector: function () {
            var $projectSelector = $('.project-selector');
            for (var m = 0; m < AppConfig.projectList.length; m++) {
                var projectItem = AppConfig.projectList[m];
                var projectName = StringUtil.getI18nProjectName(projectItem);
                $projectSelector.append('<option value="' + projectItem.id + '">' + projectName + '</option>');
            }
        },
        paginationRefresh: function (totalNum) {//分页插件显示
            var _this = this;
            var totalPages = Math.ceil(totalNum / _this.pageSize);
            if (!totalNum) {
                return;
            }
            $("#paginationWrapper").empty().html('<ul id="pool-pagination" class="pagination fr"></ul>');
            while (totalPages < _this.currentPage && _this.currentPage > 1) {
                _this.currentPage = _this.currentPage - 1;
            }
            var pageOption = {
                first: '&laquo;&laquo',
                prev: '&laquo;',
                next: '&raquo;',
                last: '&raquo;&raquo;',
                startPage: _this.currentPage ? _this.currentPage : 1,
                totalPages: !totalPages ? 1 : totalPages,
                initiateStartPageClick: false,
                onPageClick: function (event, page) {
                    _this.currentPage = page;
                    _this.fetchNoticesData(true);
                }
            };
            if (_this.currentPage) {
                pageOption['startPage'] = _this.currentPage ? _this.currentPage : 1;
            }
            $("#pool-pagination").twbsPagination(pageOption);
        },
        fetchNoticesData: function (force) {
            var $paginationWrapper = $("#paginationWrapper");
            Spinner.spin($('#events')[0]);
            var _this = this;
            var projectID = window.localStorage.getItem('calendarDefault') == null ? this.projectId : window.localStorage.getItem('calendarDefault');
            if (force) {
                this.noticePromiseMap[projectID] = null;
            }
            var noticePromise = this.noticePromiseMap[projectID];
            if (!noticePromise) {
                noticePromise = $.getJSON('/diagnosis/getRealtimeFaultPoints/' + projectID + '/' +
                    _this.overdue_type + '/' + _this.user_level + '/' + _this.fault_time_type + '/' +
                    _this.currentPage + '/' + _this.pageSize);
                this.noticePromiseMap[projectID] = noticePromise;
            }
            var dfd = $.Deferred();
            //返回一个dfd对象
            noticePromise.done(function (faultsResult) {
                var faults = faultsResult.dataFaults;
                var total = faultsResult.total;
                if (Array.isArray(faults)) {
                    if (faults.length) {
                        var dataDealWith = function () {
                            var noticesList = [];
                            //2、遍历所有的faults
                            faults.forEach(function (faultsItem, index, array) {
                                //equipment 和 zone 和 zoneId 做了初始化
                                var equipment = {}, zone = {}, zoneId = undefined;
                                var equipmentId = faultsItem.equipmentId;
                                _this.equipments_list.forEach(function (equipments, index, array) {
                                    //3、找到 data.equipments 里面对应的 equipmentId
                                    if (equipmentId == equipments.id) {
                                        equipment = equipments;
                                        zoneId = equipment.zoneId;
                                        //4、如果找到equipment，根据 equipments 的 zoneId 找相应的 zones
                                        _this.zones_list.forEach(function (zones, index, array) {
                                            if (zoneId == zones.id) {
                                                zone = zones;
                                            }
                                        });
                                        //5、跳出第二层forEach循环，继续循环最外层的 faults
                                        return true;
                                    }
                                });
                                //6、第二层forEach循环跳出后就添加数据
                                //按照原来的获取属性的格式添加
                                noticesList.push({
                                    project: projectID,
                                    id: faultsItem.id,
                                    equipmentId: equipmentId,
                                    zoneId: zoneId,
                                    time: faultsItem.time,
                                    fault: {
                                        points: faultsItem.points,
                                        name: faultsItem.name,
                                        userFaultGrade: faultsItem.grade,
                                        description: faultsItem.description,
                                        equipment: equipment ? $.extend(true, {}, equipment, {zone: zone}) : {}
                                    }
                                });
                            });
                            _this.noticeList = noticesList;
                            _this.paginationRefresh(total);
                            _this.renderNoticeList();
                            $paginationWrapper.show();
                            dfd.resolve();
                        };
                        if (_this.equipments_list && _this.equipments_list.length) { //0、已经请求过equipments 和 zones
                            dataDealWith();
                        } else {
                            $.getJSON('/diagnosis/getStruct/' + projectID).done(function (data) {//1、如果有faults的话再去请求另外一个接口返回equipment和zones，没有则返回
                                _this.equipments_list = data.equipments;
                                _this.zones_list = data.zones;
                                dataDealWith();
                            }).fail(function () {
                                dfd.reject();
                            });
                        }
                    } else {
                        _this.noticeList = [];
                        $("#taskPoolContent").html("");
                        _this.paginationRefresh(1);
                        $paginationWrapper.hide();
                        dfd.resolve();
                    }
                } else {
                    _this.noticeList = [];
                    $("#taskPoolContent").html("");
                    _this.paginationRefresh(1);
                    $paginationWrapper.hide();
                    dfd.resolve();
                }
            }).fail(function () {
                dfd.reject();
            }).always(function () {
                Spinner.stop();
            });
            return dfd;
        },
        renderNoticeList: function () {
            $('.event-container:first').empty();
            var i = 0,
                notice,
                $events = $('<div id="itemContent"></div>'),
                $eventItems,
                eventColor, _this = this;
            for (i; i < this.noticeList.length; i++) {
                notice = this.noticeList[i];
                $eventItems = $('<div class="fc-event ui-draggable ui-draggable-handle ui-draggable-able ellipsis" title="fault info">' +
                    '<span class="zoneInfo">' +
                    '<em class="mr20" title="equipment name">' + notice.fault.equipment.name + '</em>' +
                    '</span>' +
                    '<span class="itemPoolTitle" title="fault name">' + notice.fault.name + '</span>' +
                    '<span class="itemTime" title="fault time">' + notice.time + '</span>' +
                    '</div>');
                var dateNow = new Date();
                var date = new Date(notice.time);
                //当日
                if (date.getDate() == dateNow.getDate()) {
                    $eventItems.attr('data-today', 'true');
                }
                //昨日
                if (date.getDate() == (dateNow.getDate() - 1)) {
                    $eventItems.attr('data-yesterday', 'true');
                }
                //当周 判断日期和今天的日期相减是否小于或等于7 而且 是本月
                if (this.getThisWeek().some(function (item) {
                        return (item == date.getDate())
                    })) {
                    $eventItems.attr('data-week', 'true')
                }
                //判断季度
                if (getQuarterSeason(dateNow.getMonth() + 1).filter(function (element) {
                        return element == (date.getMonth() + 1)
                    }).length !== 0) {
                    $eventItems.attr('data-season', 'true')
                }
                //得到季度
                function getQuarterSeason(month) {
                    if (month < 3) {
                        return [1, 2, 3]
                    } else if (month >= 4 && month <= 6) {
                        return [4, 5, 6]
                    } else if (month >= 7 && month <= 9) {
                        return [7, 8, 9]
                    } else if (month >= 10 && month <= 12) {
                        return [10, 11, 12]
                    }
                }

                //判断逾期
                switch (Math.abs((date.getMonth() + 1) - (dateNow.getMonth() + 1))) {
                    case 1:
                        $eventItems.attr('data-one-month', 'true');
                        break;
                    case 2:
                        $eventItems.attr('data-two-month', 'true');
                        break;
                    case 3:
                        $eventItems.attr('data-three-month', 'true');
                        break;
                    case 6:
                        $eventItems.attr('data-half-year', 'true');
                        break;
                }
                //当月 判断月份 是否 等于 当前月份
                if (date.getMonth() == dateNow.getMonth()) {
                    $eventItems.attr('data-month', 'true')
                }
                //当年 判断年份 是否 等于当前年
                if (date.getFullYear() == dateNow.getFullYear()) {
                    $eventItems.attr('data-year', 'true')
                }
                //设置时间
                $eventItems.attr('data-dates', notice.time);
                //设置错误等级
                $eventItems.attr('userFaultGrade', this.noticeList[i].fault.userFaultGrade);

                switch ($eventItems.attr('userFaultGrade')) {
                    case '0':
                        eventColor = '#3a87ad';
                        $eventItems.addClass('FaultGrade0');
                        break;
                    case '1':
                        eventColor = '#fdbb4a';
                        $eventItems.addClass('FaultGrade1');
                        break;
                    case '2':
                        eventColor = '#ed7a3a';
                        $eventItems.addClass('FaultGrade2');
                        break;
                    default :
                        $eventItems.addClass('FaultGradeUndifined');
                }
                $eventItems.draggable({
                    zIndex: 999,
                    opacity: 1,
                    revert: true,
                    revertDuration: 0,
                    distance: 5,
                    appendTo: 'body',
                    containment: 'window',
                    scroll: false,
                    helper: 'clone'
                });
                $eventItems.data('event', {
                    id: this.noticeList[i].id,
                    title: notice.fault.name,
                    startTime: notice.time,
                    description: notice.fault.description,
                    allDay: true,
                    userFaultGrade: notice.fault.userFaultGrade,
                    content: notice,
                    taskType: this.eventType.notice,
                    editable: true,
                    stick: true,
                    //设置拖拽过去后的默认颜色
                    color: eventColor
                }).on('click', function () {
                    _this.currentEvent = $(this).data('event');
                    _this.showWorkInfoDefault(_this, $(this).data('event'), true)
                });
                if (this.addedNoticedMap[notice.id]) {
                    this.displayAddScheduler($eventItems);
                }

                $events.append($eventItems);
            }

            $events.append('<div id="taskPoolInfoTxt" class="dn tc" i18n="workflow.calendar.NO_TASK"></div>');
            $('.event-container').append($events);
            this.checkEmptyTasks();
            I18n.fillArea($("#wrap"));
        },
        showWorkInfoDefault: function (_this, event, isFromEventPool) {
            var $workflowInfo = $('#workflowInfo'), $wfContent = $('#wf-outline');
            _this.setWinData(event, isFromEventPool);
            $workflowInfo.attr('data-from', 'events');
            $workflowInfo.find('#itemDel,#itemEdit,.calendarInfoColor').hide();
            _this.itemContenteditable(false);
            $workflowInfo.css({
                'left': $wfContent.outerWidth() / 2 - $workflowInfo.width() / 2 + 'px',
                'top': $wfContent.outerHeight() / 2 - $workflowInfo.height() / 2 + 'px'
            }).show();
            _this.getEcharts.call(_this, event, $workflowInfo.find('.taskPoolInfoEcharts').get(0));
        },
        displayAddScheduler: function (item) {
            var $item = $(item);
            if ($item.find('.label-success').length === 0) {
                $item.append('<div class="label label-success added-calendar" i18n="workflow.calendar.ADD_SCHEDULER"></div>');
                $item.removeClass('ui-draggable-able');
            }
        },
        getThisWeek: function () {
            var dateNow = new Date(),
                dayNow = dateNow.getDate(),
                daysTotalMonth = new Date(dateNow.getFullYear(), dateNow.getMonth(), 0).getDate(),
                result = [], i;
            if (daysTotalMonth - dayNow >= 7) {
                for (i = 0; i <= 7; i++) {
                    result.push(dayNow++);
                }
            } else {
                var length = daysTotalMonth - dayNow;
                for (i = 0; i <= length; i++) {
                    result.push(dayNow++);
                }
                for (i = 1; i <= 7 - length; i++) {
                    result.push(i);
                }
            }
            return result;
        },
        showUserCalendar: function (userId) {
            var _this = this;
            var eventSource = {
                url: '/workflow/plan/listTasks',
                type: 'POST',
                data: {
                    userId: userId
                },
                error: function () {
                    Alert.danger(ElScreenContainer, 'there was an error while fetching events!').showAtTop(2000);
                },
                success: function (result) {
                    _this.fetchNoticesData().done(function (data) {
                        Spinner.stop();
                        result.map(function (item) {
                            _this.addedNoticedMap[item.noticeId] = item;
                        });
                        //这里只画一次DOM，其他地方比如筛选项目的时候都可以重新画DOM
                        if (_this.firstRender) {
                            _this.renderNoticeList();
                            _this.firstRender = false;
                        }
                    })
                },
                textColor: 'white',
                backgroundColor: '#5484ed'
            };
            this.$calendar.fullCalendar('removeEventSource', '/workflow/plan/listTasks');
            this.$calendar.fullCalendar('addEventSource', eventSource);
        },
        showGroupCalendar: function (groupId) {
            var _this = this;
            var eventSource = {
                url: '/workflow/plan/listTasks',
                type: 'POST',
                data: {
                    groupId: groupId
                },
                error: function () {
                    Alert.danger(ElScreenContainer, 'there was an error while fetching events!').showAtTop(2000);
                },
                success: function (result) {
                    _this.fetchNoticesData().done(function (data) {
                        Spinner.stop();
                        result.map(function (item) {
                            _this.addedNoticedMap[item.noticeId] = item;
                        });
                        //这里只画一次DOM，其他地方比如筛选项目的时候都可以重新画DOM
                        if (_this.firstRender) {
                            _this.renderNoticeList();
                            _this.firstRender = false;
                        }
                    })
                },
                textColor: 'white',
                backgroundColor: '#5484ed'
            };
            this.$calendar.fullCalendar('removeEventSource', '/workflow/plan/listTasks');
            this.$calendar.fullCalendar('addEventSource', eventSource);
        },
        attachEvent: function () {
            var _this = this;
            $.spEvent.subEvent($('#wf-content'), 'wf-task-list-calendar', function (event, type, id) {
                if (type === 'group') {
                    _this.showGroupCalendar(id);
                } else if (type === 'user') {
                    if (!id) {
                        id = AppConfig.userId;
                    }
                    _this.showUserCalendar(id);
                }
            });

            //日期变更切换
            this.$dateTimePicker.datetimepicker({
                inline: true,
                sideBySide: true,
                minView: 2,
                format: "yyyy-mm-dd ",
                todayHighlight: true
                //因为通过 datetimepicker 得到的时间默认的就是早上八点，而且多了八个小时,这里把它初始为00:00.但是得到的时间就是早上八点了，权宜之计
                //或者通过 它 来选择的时间 只要日期 把具体时间给干掉，fullcalendar 更新只更新日期
            }).datetimepicker('update', moment(new Date()).format('YYYY-MM-DD 00:00')).on('changeDate', function (date) {
                var dateChangeNow = moment(date.date).format('YYYY-MM-DD');
                //TODO 这里来判断视图类型加载视图 确定代码后请去掉TODO
                switch (_this.$calendar.fullCalendar('getView').type) {
                    case 'month':
                        _this.$calendar.fullCalendar('changeView', 'month');
                        break;
                    case 'basicWeek':
                        _this.$calendar.fullCalendar('changeView', 'basicWeek');
                        break;
                    case 'basicDay':
                        _this.$calendar.fullCalendar('changeView', 'basicDay');
                        break;
                    default :
                        break;
                }
                _this.$calendar.fullCalendar('gotoDate', dateChangeNow);
                _this.$dateTimePicker.datetimepicker('update', moment(date.date).format('YYYY-MM-DD 00:00'));
                //加入事件队列
                /*setTimeout(function () {
                 _this.setEventsTotalTips(new Date(date.date).getFullYear(), new Date(date.date).getMonth() + 1);
                 }, 0);*/
                $('.fc-bg').find('td').each(function () {
                    $(this).css('backgroundColor', 'transparent');
                    if ($(this).attr('data-date') == dateChangeNow) {
                        $(this).css('backgroundColor', '#ccc');
                    }
                })
            });
            this.$calendar.fullCalendar({
                eventSources: [],
                events: [],
                eventLimit: true,
                firstDay: 0,
                lang: localStorage.getItem('language') === 'zh' ? "zh-cn" : localStorage.getItem('language'),
                defaultView: "month",
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                lazyFetching: true,
                allDayDefault: true,
                editable: true,
                droppable: true,
                dropAccept: '.ui-draggable-able',
                drop: function (date, jsEvent, ui) {
                    var $this = $(this);
                    if ($this.find('.added-calendar').length) {
                        alert('已加入日程,不能重复加入！');
                        return false;
                    }
                    WebAPI.post('/workflow/plan/addNoticeToScheduler', {
                        userId: AppConfig.userId,
                        notice: $this.data('event').content,
                        color: $this.data('event').color,
                        startTime: date.format('YYYY-MM-DD HH:mm:ss')
                    }).done(function (result) {
                        if (result.success) {
                            if ($this.data('event') && $this.data('event').id && result.data.id) {
                                var event = _this.$calendar.fullCalendar('clientEvents', $this.data('event').id)[0];
                                event.id = result.data.id;
                                $('#calendar').fullCalendar('updateEvent', event);
                            }
                            _this.noticeList.forEach(function (item, index, array) {
                                if (array[index].id == $this.data('event').id) {
                                    array.splice(index, 1)
                                }
                            });
                            BackgroundWorkers.schedulerReporter ? BackgroundWorkers.schedulerReporter.postMessage({
                                type: 'fetchWorkflowData',
                                userId: AppConfig.userId
                            }) : $.noop();
                            _this.displayAddScheduler($this);
                            I18n.fillArea($("#wrap"));
                        } else {
                            Alert.danger(ElScreenContainer, I18n.resource.workflow.team.ADD_SCHEDULE_FAILED).showAtTop(2000)
                        }
                    })
                },
                eventDrop: function (event) {
                    var eventItem = {
                        startTime: event.start.format('YYYY-MM-DD HH:mm:ss')
                    };
                    if (event.end) {
                        eventItem['endTime'] = event.end.format('YYYY-MM-DD HH:mm:ss');
                    } else {
                        if (event.allDay) {
                            eventItem['endTime'] = event.start.format('YYYY-MM-DD') + ' 23:59:59';
                        } else {
                            eventItem['endTime'] = moment(event.start).add(2, 'h').format('YYYY-MM-DD HH:mm:ss');
                        }
                    }

                    WebAPI.post('/workflow/plan/updateScheduledTask', {
                        scheduleId: event.id,
                        event: eventItem
                    }).done(function (result) {
                        return result.success;
                    });
                },
                eventResize: function (event) {
                    WebAPI.post('/workflow/plan/updateScheduledTask', {
                        scheduleId: event.id,
                        event: {
                            startTime: event.start.format('YYYY-MM-DD HH:mm:ss'),
                            endTime: event.end.format('YYYY-MM-DD HH:mm:ss')
                        }
                    }).done(function (result) {
                        return result.success;
                    });
                },
                eventClick: function (event, jsEvent) { //日历记录点击事件
                    //清空弹出窗口的数据
                    _this.oldColor = event.color;
                    _this.itemContenteditable(false);
                    _this.setWinData(event);
                    var $workflowInfo = $("#workflowInfo");
                    if (!event.editable) {
                        $workflowInfo.find('#itemDel,#itemEdit').hide();
                    } else {
                        $workflowInfo.find('#itemDel,#itemEdit').show();
                    }
                    $workflowInfo.find('.calendarInfoColor').show();
                    $workflowInfo.data("event", event);
                    var wh = $(window).height();
                    var ww = $(window).width();
                    var oh = $workflowInfo.height();
                    var x = jsEvent.clientX - $workflowInfo.width() / 2;
                    var y = jsEvent.clientY - 43;
                    if ((wh - y) < (oh + 40)) {
                        y = y - oh + 30;
                        if (y < 50) {
                            y = 60;
                        }
                    }
                    if (_this.isManager) {
                        if (jsEvent.clientX < ww / 2) {
                            x = x - 80;
                        } else {
                            x = x - 240;
                        }
                    }
                    $workflowInfo.css({
                        "left": x,
                        "top": y
                    }).show();
                    _this.getEcharts.call(_this, event, $workflowInfo.find('.taskPoolInfoEcharts').get(0));
                    jsEvent.stopPropagation();
                    return false;
                },
                viewRender: function (view) {

                    //绑定回到今天按钮
                    $('.fc-today-button').one('click', function () {
                        _this.$dateTimePicker.datetimepicker('update', moment(new Date()).format('YYYY-MM-DD'));
                        $('.fc-bg').find('td').each(function () {
                            $(this).css('backgroundColor', 'transparent');
                            if ($(this).attr('data-date') == moment(new Date()).format('YYYY-MM-DD')) {
                                $(this).css('backgroundColor', '#eee')
                            }
                        });
                    });

                    if (view.type == "basicWeek") {
                        $('.fc-bg').find('td').each(function () {
                            $(this).css('backgroundColor', 'transparent');
                            if ($(this).attr('data-date') == view.start.format()) {
                                $(this).css('backgroundColor', '#ccc')
                            } else if ($(this).attr('data-date') == moment(new Date()).format('YYYY-MM-DD')) {
                                $(this).css('backgroundColor', '#eee')
                            }
                        });
                    }
                },
                eventRender: function (event, element) {
                    element.on('click', function () {
                        _this.currentEvent = event;
                        _this.currentElement = element;
                    });
                },
                eventAfterAllRender: function () {
                    var date = _this.$calendar.fullCalendar('getDate');
                    _this.$dateTimePicker.datetimepicker('update', moment(date).format('YYYY-MM-DD 00:00'));
                    /*setTimeout(function () {
                     _this.setEventsTotalTips(new Date(date).getFullYear(), new Date(date).getMonth() + 1);
                     }, 100)*/
                }

            });
            this.showUserCalendar(AppConfig.userId);
            $("#calendarDateStart").datetimepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                miniView: 1,
                endDate: new Date()
            });

            $("#calendarDateEnd").datetimepicker({
                format: "yyyy-mm-dd",
                miniView: 1,
                autoclose: true
            });

            $('#calendar').on("click.winEdit", function (e) {
                var $workflowInfo = $("#workflowInfo"), isFormEvents = $workflowInfo.attr('data-from');
                if (isFormEvents) {
                    isFormEvents = true;
                    $workflowInfo.attr('data-from', '')
                } else {
                    isFormEvents = false;
                }
                if (!$(e.target).closest("#workflowInfo").length && $workflowInfo.is(':visible')) {
                    $workflowInfo.hide();
                    if (!isChangeColor && !isFormEvents) {
                        _this.currentEvent.color = _this.oldColor;
                        _this.$calendar.fullCalendar('updateEvent', _this.currentEvent)
                    }
                }
            });

            _this.setCalendarHeight();
            $(window).on("resize.calendarHeight", function () {
                _this.setCalendarHeight();
            });
            //点击任务池对象查看详细信息
            var timer = null;
            var $taskPoolInfoEcharts = $('#taskPoolInfo').find('.taskPoolInfoEcharts');
            $("#events").on("mouseover", '.fc-event', function () {
                var $this = $(this);
                var item = $(this).data("event");
                var $taskPoolInfo = $("#taskPoolInfo");
                $("#taskPoolTitle").text(item.title);
                $("#taskPoolDetail").text(item.description);
                $("#taskPoolTime").text(item.startTime);
                $("#equipmentName").text(item.content.fault.equipment.points);
                var wh = $(window).height();
                var x = $this.offset().left - (_this.isManager ? 590 : 215);
                var y = $this.offset().top + $taskPoolInfo.height();
                if (y > wh) {
                    y = $this.offset().top - $taskPoolInfo.height();
                    $taskPoolInfo.find('.tooltip-arrow').css('top', '55px');
                } else {
                    y = $this.offset().top - $this.height() * 2;
                    $taskPoolInfo.find('.tooltip-arrow').css('top', '65px');
                }
                //这里的高度是css里面写好的，可以自定义,区其余地方不要动
                var echartsHeight = 200;
                $taskPoolInfo.css({
                    "left": x - 200,
                    "top": y
                }).toggleClass('wf-bounceleft').show();
                clearTimeout(timer);
                timer = setTimeout(function () {
                    if (y > 360) {
                        $taskPoolInfo.animate({top: y - echartsHeight + 'px'}, 'fast');
                        $taskPoolInfo.find('.tooltip-arrow').css('top', 65 + echartsHeight + 'px');
                    }
                    _this.getEcharts.call(_this, item, $taskPoolInfoEcharts.get(0));
                    $taskPoolInfoEcharts.slideDown();
                }, 2000);
            }).on("mouseout", '.fc-event', function (e) {
                $("#taskPoolTitle").text('');
                $("#taskPoolDetail").text('');
                $("#taskPoolTime").text('');
                $("#taskPoolPoints").text('');
                $("#equipmentName").text('');
                $("#taskPoolInfo").toggleClass('wf-bounceleft').hide().find('.taskPoolInfoEcharts').empty();
                clearTimeout(timer);
                $taskPoolInfoEcharts.hide();
                timer = null;
            });

            //修改弹出窗口事件
            var oldColor, isChangeColor = false;
            $("#workflowInfo .itemColor").click(function () {
                $("#workflowInfo .itemColor").each(function () {
                    $(this).removeClass('active');
                });
                $(this).addClass('active');
                isChangeColor = false;
                var color = $(this).attr("data-color");
                $("#workflowInfo").data("color", color);
                if ($("#workflowInfo").data("color")) {
                    _this.currentEvent.color = $("#workflowInfo").data("color");
                    _this.$calendar.fullCalendar('updateEvent', _this.currentEvent)
                }
            });
            //删除
            $("#itemDel").click(function () {
                WebAPI.post('/workflow/plan/delScheduledTask', {scheduleId: _this.currentEvent.id}).done(function (result) {
                    if (result.success) {
                        _this.$calendar.fullCalendar("removeEvents", _this.currentEvent._id);
                        if (_this.projectId == _this.currentEvent.content.project) {
                            _this.noticeList.push(_this.currentEvent.content);
                            delete _this.addedNoticedMap[_this.currentEvent.noticeId];
                            _this.renderNoticeList();
                        }
                        $("#workflowInfo").hide();
                        try {
                            //删除当天符合条件时,更新badge
                            if (_this.currentEvent.start.format('YYYY-MM-DD') == new Date().format('yyyy-MM-dd')
                                && _this.currentEvent.start - new Date() <= 0
                                && (_this.currentEvent.allDay || _this.currentEvent.end - new Date() >= 0)) {
                                var $workflowMenuButtonBadge = $('#paneWorkflow').find('.workflow-menu-button .badge');
                                $workflowMenuButtonBadge.text(parseInt($workflowMenuButtonBadge.text()) - 1);
                                var $menuItemCalendarBadge = $('#paneWorkflow').find('.menuItemCalendar .badge');
                                $menuItemCalendarBadge.text(parseInt($menuItemCalendarBadge.text()) - 1);
                            }
                        } catch (e) {

                        }

                    } else {
                        Alert.danger(ElScreenContainer, 'delete event failed!');
                    }
                });
            });
            function changeSelectorInfo(index, which) {
                var $calenderSelectorInfo = $('#wf-calender-selectorInfo');
                $calenderSelectorInfo.show();
                if (index == 1) {
                    var value = $(which).text();
                    var i18 = I18n.resource.workflow.calendar;
                    switch (value) {
                        case i18.SERIOUS:
                            $calenderSelectorInfo.find('span').eq(index).attr('i18n', $(which).attr('i18n')).parent().css('backgroundColor', '#ed7a3a').addClass('label label-primary');
                            break;
                        case  i18.EMERGENCY:
                            $calenderSelectorInfo.find('span').eq(index).attr('i18n', $(which).attr('i18n')).parent().css('backgroundColor', '#fdbb4a').addClass('label label-primary');
                            break;
                        case i18.GENERAL:
                            $calenderSelectorInfo.find('span').eq(index).attr('i18n', $(which).attr('i18n')).parent().css('backgroundColor', '#3a87ad').addClass('label label-primary');
                            break;
                        case i18.All:
                            $calenderSelectorInfo.find('span').eq(index).attr('i18n', $(which).attr('i18n')).parent().css('backgroundColor', '#428bca').addClass('label label-primary');
                            break;
                    }
                } else {
                    $calenderSelectorInfo.find('span').eq(index).attr('i18n', $(which).attr('i18n')).parent().addClass('label label-primary');
                }
                I18n.fillArea($calenderSelectorInfo);
            }

            //选择逾期时间
            $('#wf-Time-overdue').find('a').click(function () {
                _this.currentPage = 1;
                var value = $(this).text();
                var i18 = I18n.resource.workflow.calendar;
                $('#events .dropdown-menu li').removeClass('active');
                changeSelectorInfo(0, this);
                $(this).parent().addClass('active');
                _this.setCalendarHeight();
                switch (value) {
                    case i18.All:
                        //changeEventContainer(1, 'all');
                        _this.overdue_type = 'all';
                        break;
                    case i18.ONE_MONTH :
                        //changeEventContainer(1, 'data-one-month');
                        _this.overdue_type = 'one-month';
                        break;
                    case i18.TWO_MONTH:
                        //changeEventContainer(1, 'data-two-month');
                        _this.overdue_type = 'two-month';
                        break;
                    case i18.THREE_MONTH:
                        //changeEventContainer(1, 'data-three-month');
                        _this.overdue_type = 'three-month';
                        break;
                    case i18.HALF_YEAR:
                        //changeEventContainer(1, 'data-half-year');
                        _this.overdue_type = 'half-year';
                        break;
                    default :
                        return false;
                }
                _this.fetchNoticesData(true);
            });

            //选择紧急程度
            $('#wf-Emergency-degree').find('a').click(function () {
                _this.currentPage = 1;
                var value = $(this).text();
                var i18 = I18n.resource.workflow.calendar;
                $('#events .dropdown-menu li').removeClass('active');
                changeSelectorInfo(1, this);
                $(this).parent().addClass('active');
                switch (value) {
                    case i18.All:
                        //changeEventContainer(1, 'all');
                        _this.user_level = 'all';
                        break;
                    case i18.GENERAL:
                        //changeEventContainer(2, 0);
                        _this.user_level = 0;
                        break;
                    case i18.EMERGENCY:
                        //changeEventContainer(2, 1);
                        _this.user_level = 1;
                        break;
                    case i18.SERIOUS:
                        //changeEventContainer(2, 2);
                        _this.user_level = 2;
                        break;
                }
                _this.fetchNoticesData(true);
            });

            //选择故障时间
            $('#wf-fault-time').find('a').click(function () {
                _this.currentPage = 1;
                var value = $(this).text();
                var i18 = I18n.resource.workflow.calendar;
                $('#events .dropdown-menu li').removeClass('active');
                changeSelectorInfo(2, this);
                $(this).parent().addClass('active');
                switch (value) {
                    case i18.All:
                        //changeEventContainer(1, 'all');
                        _this.fault_time_type = 'all';
                        break;
                    case i18.TODAY :
                        //changeEventContainer(1, 'data-today');
                        _this.fault_time_type = 'today';
                        break;
                    case i18.YESTERDAY:
                        //changeEventContainer(1, 'data-yesterday');
                        _this.fault_time_type = 'yesterday';
                        break;
                    case i18.THIS_WEEK:
                        //changeEventContainer(1, 'data-week');
                        _this.fault_time_type = 'week';
                        break;
                    case i18.THIS_MONTH:
                        //changeEventContainer(1, 'data-month');
                        _this.fault_time_type = 'month';
                        break;
                    case i18.THIS_SEASON:
                        //changeEventContainer(1, 'data-season');
                        _this.fault_time_type = 'season';
                        break;
                    case i18.THIS_YEAR:
                        //changeEventContainer(1, 'data-year');
                        _this.fault_time_type = 'year';
                        break;
                    default :
                        return false;
                }
                _this.fetchNoticesData(true);
            });

            $('#createWF').click(function () {
                var $calendarSavedHtml = $('#indexMain').children().detach(), wiInstance;

                function insertCallback() {
                    back();
                    BackgroundWorkers.schedulerReporter ? BackgroundWorkers.schedulerReporter.postMessage({
                        type: 'fetchWorkflowData',
                        userId: AppConfig.userId
                    }) : $.noop();
                    Alert.success(ElScreenContainer, I18n.resource.workflow.calendar.ORDER_CREATION_SUCCESS).showAtTop(2000);
                }

                var momentTime = _this.currentEvent.content.time.toDate();
                var faultGrade = 0;
                if (_this.currentEvent.content.fault.userFaultGrade) {
                    faultGrade = _this.currentEvent.content.fault.userFaultGrade;
                }
                var back = function () {
                    wiInstance = null;
                    $('#indexMain').empty().append($calendarSavedHtml);
                };

                var equipmentName, zone, diagnosisZones, zoneID, equipmentsArr;
                WebAPI.get('/diagnosis/getStruct/' + _this.currentEvent.content.project).done(function (result) {
                    _this.result = result;
                    equipmentsArr = _this.result.equipments;
                    diagnosisZones = _this.result.zones;

                    for (var i = 0; i < equipmentsArr.length; i++) {
                        if (_this.currentEvent.content.equipmentId === equipmentsArr[i].id) {
                            equipmentName = equipmentsArr[i].name;
                            zoneID = equipmentsArr[i].zoneId;
                            break;
                        }
                    }

                    for (var k = 0; k < diagnosisZones.length; k++) {
                        if (zoneID === diagnosisZones[k].id) {
                            zone = diagnosisZones[k].subBuildingName;
                            break;
                        }
                    }

                    wiInstance = new WorkflowInsert({
                        zone: zone,
                        equipmentName: equipmentName,
                        noticeId: _this.currentEvent.content.id,
                        title: _this.currentEvent.content.fault.name,
                        detail: _this.currentEvent.content.fault.description,
                        dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'),  //结束时间为两天后
                        critical: faultGrade,
                        projectId: _this.currentEvent.content.project,
                        chartPointList: _this.currentEvent.content.fault.points,
                        chartQueryCircle: 'm5',
                        description: _this.currentEvent.content.fault.description,
                        name: _this.currentEvent.content.fault.name,
                        time: new Date(momentTime).format('yyyy-MM-dd HH:mm:ss'),
                        chartStartTime: new Date(momentTime - 43200000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天
                        chartEndTime: new Date(momentTime + 43200000).format('yyyy-MM-dd HH:mm:ss')   //报警发生后半天
                    });
                    wiInstance.show().submitSuccess(function (taskModelInfo, uploadFiles) {
                        insertCallback();
                        this.close();
                        wiInstance = null;
                    }).cancel(function () {
                        back();
                        wiInstance = null;
                    }).fail(function () {

                    });

                });
            });
            //关闭按钮
            $("#itemClose").click(function () {
                var $workflowInfo = $("#workflowInfo"), isFormEvents = $workflowInfo.attr('data-from');
                if (isFormEvents) {
                    isFormEvents = true;
                    $workflowInfo.attr('data-from', '')
                } else {
                    isFormEvents = false;
                }
                if (!isChangeColor && _this.currentEvent && !isFormEvents) {
                    _this.currentEvent.color = _this.oldColor;
                    _this.$calendar.fullCalendar('updateEvent', _this.currentEvent)
                }
                $workflowInfo.hide();
            });
            //编辑
            $("#itemEdit").click(function () {
                _this.itemContenteditable(true);
                $(this).hide();
                $("#itemSave").show();
                $('#wf-name').removeClass('ellipsis');
            });
            //保存
            $("#itemSave").click(function () {
                var date_start = $("#calendarDateStart").val();
                var date_end = $("#calendarDateEnd").val();
                if (date_start > date_end) {
                    $("#errorInfo").text(I18n.resource.workflow.calendar.DATE_ERROR_INFO).show();
                    return false;
                } else {
                    $("#errorInfo").hide();
                }
                WebAPI.post('/workflow/plan/updateScheduledTask', {
                    scheduleId: _this.currentEvent.id,
                    event: {
                        startTime: new Date($(".calendarDateStart").val()).format('yyyy-MM-dd HH:mm:00'),
                        endTime: new Date($(".calendarDateEnd").val()).format('yyyy-MM-dd HH:mm:00'),
                        title: $("#wf-name").text(),
                        color: $("#workflowInfo").data("color")
                    }
                }).done(function (result) {
                    if (result.success) {
                        _this.currentEvent.title = $('#wf-name').text();
                        _this.currentEvent.start = $(".calendarDateStart").val();
                        _this.currentEvent.end = moment($(".calendarDateEnd").val()).add(1, 'days').format('YYYY-MM-DD HH:MM:00');

                        if ($("#workflowInfo").data("color")) {
                            _this.currentEvent.color = $("#workflowInfo").data("color");
                        }
                        _this.$calendar.fullCalendar('updateEvent', _this.currentEvent);
                        isChangeColor = true;
                        $("#workflowInfo").hide();
                    } else {
                        Alert.danger(ElScreenContainer, I18n.resource.workflow.calendar.SAVE_FAILED);
                    }

                });
            });

            $('#events select.task-filter').each(function () {
                $(this).change(function () {
                    var value = $(this).val();
                    var i18 = I18n.resource.workflow.calendar;
                    switch (value) {
                        case i18.TODAY :
                            changeEventContainer(1, 'data-today');
                            break;
                        case i18.THIS_WEEK:
                            changeEventContainer(1, 'data-week');
                            break;
                        case i18.THIS_MONTH:
                            changeEventContainer(1, 'data-month');
                            break;
                        case i18.THIS_YEAR:
                            changeEventContainer(1, 'data-year');
                            break;
                        case i18.All:
                            changeEventContainer(1, 'all');
                            break;
                        default :
                            return false;
                    }
                })
            });
            function changeEventContainer(type, changeType) {
                if (arguments.length == 2) {
                    if (type == 1) {
                        $('.event-container').find('.fc-event').each(function () {
                            $(this).hide();
                            changeType == 'all' ? $(this).show() :
                                $(this).attr(changeType) == 'true' ? $(this).show() : $(this).hide();
                        });
                    } else if (type == 2) {
                        $('.event-container').find('.fc-event').each(function () {
                            $(this).hide();
                            $(this).attr('userFaultGrade') == changeType ? $(this).show() : $(this).hide();
                        });
                    } else return false;
                }
                _this.checkEmptyTasks();

                $("#taskPoolInfo").hide();
            }

            $('#events select.project-selector').change(function () {
                _this.resetVariable();
                _this.checkEmptyTasks();
                _this.projectId = $(this).val();
                var selectorInfo = $("#wf-calender-selectorInfo");
                selectorInfo.hide();
                selectorInfo.children('section').removeClass('label label-primary').attr("style", "");
                selectorInfo.find(".condition_txt").text("").removeAttr('i18n').removeAttr('value');
                //添加 localStorage
                window.localStorage.calendarDefault = $(this).val();
                Spinner.spin($('#events')[0]);
                _this.fetchNoticesData(true).done(function (result) {
                    Spinner.stop();
                    _this.renderNoticeList();
                });
            });

        }
        ,
        checkEmptyTasks: function () {
            var $taskPoolInfoTxt = $("#taskPoolInfoTxt");
            if (!($("#itemContent>.fc-event:visible").length)) {
                $taskPoolInfoTxt.show();
            } else {
                $taskPoolInfoTxt.hide();
            }
        }
        ,
        setEventsTotalTips: function (_year, _month) {
            var _this = this, i;
            var result = [], _Arr_prevMonth = [], _Arr_nextMonth = [], lastDay;

            //得到上个月有多少事件
            var prevDay = new Date(_year, _month - 1, 0).getDate();
            var firstDay = new Date(_year, _month - 1, 1).getDay();
            var dayTotal = new Date(_year, _month, 0).getDate();
            for (i = 0; i < firstDay; i++) {
                //获取到上个月最后的天数
                _Arr_prevMonth.push(prevDay--);
            }
            _Arr_prevMonth.sort().forEach(function (item, index, array) {
                result.push(_this.$calendar.fullCalendar('clientEvents', function (event) {
                    return event.start.format('YYYY-MM-DD') == moment(new Date(_year + '-' + (_month - 1) + '-' + item)).format('YYYY-MM-DD')
                }).length);
            });


            //得到这个月有多少个事件
            for (i = 1; i <= dayTotal; i++) {
                result.push(_this.$calendar.fullCalendar('clientEvents', function (event) {
                    return event.start.format('YYYY-MM-DD') == moment(new Date(_year + '-' + _month + '-' + i)).format('YYYY-MM-DD')
                }).length);
            }
            // 得到下个月有多少事件

            //固定的显示42个表格
            for (i = 0, lastDay = 42 - result.length; i < lastDay; i++) {
                _Arr_nextMonth.push(i + 1);
            }
            _Arr_nextMonth.forEach(function (item, index, array) {
                result.push(_this.$calendar.fullCalendar('clientEvents', function (event) {
                    return event.start.format('YYYY-MM-DD') == moment(new Date(_year + '-' + (_month + 1) + '-' + array[index])).format('YYYY-MM-DD')
                }).length);
            });

            _this.$dateTimePicker.find('.datetimepicker-days tbody td').each(function (i, item) {
                if (result[i] !== 0) {
                    $(item).attr('data-eventstotal', result[i])
                }
            });
        },
        getEcharts: function (event, echartContainer) {
            $(echartContainer).empty();
            var Spinner = new LoadingSpinner({color: '#00FFFF'});
            var momentTime = event.content.time.toDate();
            beop.view.faultCurve.configModel({
                transactions_model: beop.model.transactionsModel
            });
            return beop.view.faultCurve.init($(echartContainer), {
                points: event.content.fault.points,
                timeFormat: 'm5',
                timeStart: new Date(momentTime - 3600000).format('yyyy-MM-dd HH:mm:ss'),
                timeEnd: new Date(momentTime + 3600000).format('yyyy-MM-dd HH:mm:ss'),
                projectId: parseInt(event.content.fault.equipment.project)
            }).always(function () {
                Spinner.stop();
            });
        },
        detachEvents: function () {
            $(window).off("resize.calendarHeight");
        },
        setFloatingWin: function ($win, h) {//设置浮动窗口
            var wh = $(window).height();
            var top = (wh - h) / 2;
            $win.find(".modal-dialog").css({
                'top': top
            });
            $win.modal();
        },
        setCalendarHeight: function () {
            var wh = $(window).height(),
                $wrap = $("#wrap"),
                $navHeader = $("#navHeader");
            this.isManager ? $wrap.css("height", wh - $navHeader.height() - 12) : $wrap.css("height", wh - $navHeader.height());
            $("#taskPoolContent").css("height", $("#events").height() - $(".event-selector").height() - 100);
            this.$calendar.fullCalendar('option', 'height', wh - 100);
        },
        setWinData: function (event, isFromEventPool) {//1.点击记录将值附到弹出框中  2. 点击弹出窗口关闭按钮
            var _this = this, $this = $(this);
            var $calendarDateStart = $(".calendarDateStart");
            var $calendarDateEnd = $(".calendarDateEnd");
            $('#wf-name').addClass('ellipsis');
            $("#errorInfo").hide();
            $("#itemSave").hide();
            $("#itemEdit").show();
            var dateStart = moment(event.start).format('YYYY-MM-DD');
            var dateEnd = event.end ? moment(event.end).subtract('days', 1).format('YYYY-MM-DD') : moment(event.start).format('YYYY-MM-DD');
            var title = I18n.resource.workflow.calendar.NO_TITLE;
            if (event.title && event.title.split(': ').length === 2) {
                title = event.title.split(': ')[1];
            } else {
                title = event.title ? event.title : title;
            }

            if (isFromEventPool) {
                $("#owner").parent().hide();
            } else {
                $("#owner").text(event.username ? event.username : AppConfig.userProfile.fullname).parent().show();
            }
            $('#wf-name').text(title);
            $("#wf-detail").text(event.content.fault.description);
            $("#wf-critical").text(event.content.fault.userFaultGrade == 2 ? I18n.resource.workflow.calendar.FAULT : I18n.resource.workflow.calendar.WARNING);
            $("#wf-equipmentName").text(event.content.fault.equipment.name);
            $("#wf-zones").text(event.content.fault.equipment.zone ? event.content.fault.equipment.zone.subBuildingName : '');
            //$("#wf-points").text(event.content.fault.points).attr('title', event.content.fault.points);
            if (isFromEventPool) {
                $calendarDateStart.parent().hide();
                $calendarDateEnd.parent().hide();
            } else {
                $calendarDateStart.val(dateStart).parent().show();
                $calendarDateEnd.val(dateEnd).parent().show();
            }
            //$("#wf-remind").text(event.isNotice ? 'Yes' : 'No');
            $('.colorWrapper .itemColor').each(function () {
                if ($(this).attr('data-color') == _this.oldColor) {
                    $(this).show();
                }
            });

            var projectName = '';
            for (var i = 0; i < AppConfig.projectList.length; i++) {
                if (event.content.project == AppConfig.projectList[i].id) {
                    projectName = StringUtil.getI18nProjectName(AppConfig.projectList[i]);
                    break;
                }
            }
            $("#wf-projectName").text(projectName);
            I18n.fillArea($(ElScreenContainer));
        },
        itemContenteditable: function (flag) {
            var $itemColor = $("#workflowInfo .itemColor");
            $("#wf-name").attr("contenteditable", flag);
            if (flag === true) {
                $itemColor.show();
            } else {
                $itemColor.hide();
            }
            $(".calendarDateStart").attr({
                "contenteditable": flag,
                "disabled": !flag
            });
            $(".calendarDateEnd").attr({
                "contenteditable": flag,
                "disabled": !flag
            });
        }
    };

    return WorkflowCalendar;
})();