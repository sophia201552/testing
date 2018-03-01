/**
 * Created by vicky on 2016/1/28.
 */

var WorkOrder = (function () {
    var _this;

    function WorkOrder() {
        _this = this;
        this.screen = screen;
        this.$container = $('#tabWorkflow');
        this.workFlowType = {
            'maintain': 4
        };
        this.templateSelector = '#tpl-tabWorkflow';
        this.userData = null;
        this.userHasSelected = {
            'executor': [],
            'verifiers': [],
            'watchers': []
        };
        this.defaultOptions = {
            buttons: {},
            cb: {
                cancelCb: $.noop,
                submitCb: $.noop,
                submitSuccessCb: $.noop
            },
            data: {
                fields: {}
            },
            attachments: [],
            editable: true
        };
        this.equipNamelist = [];
        this.options = this.defaultOptions;
        this.uploadWidget = null;
        this.orderObj = null;
    }

    WorkOrder.prototype.setOptions = function (options, order) {
        if (options) {
            this.options = $.extend({}, this.defaultOptions, options);
        }
        this.orderObj = order;
        if (options.status == 'new') {
            this.userHasSelected = {
                'executor': [],
                'verifiers': [],
                'watchers': []
            }
        }
        return this;
    };

    WorkOrder.prototype.showAt = function ($container, data) {
        if ($container) {
            this.$container = $container;
        }
        this.render(data);
    };

    WorkOrder.prototype.show = function (data) {
        this.$container = $('#tabWorkflow');
        this.options = this.defaultOptions;
        this.options.status = 'add';//'add'用于点击任务tab时候
        this.render(data);
    };

    WorkOrder.prototype.render = function (data) {
        this.$container.html($(this.templateSelector).html());
        this.renderByType();
        this.requestUserMap();
        this.initFileUpload();

        var arrTds = [];
        this.equipNamelist = [];
        data.forEach(function (row) {
            arrTds.push(row.id);
        });

        if (_this.options.status === 'add') {
            data.forEach(function (row) {
                _this.equipNamelist.push(row.name);
            });
        } else {
            if (_this.options.data && _this.options.data.fields && _this.options.data.fields.equipments) {
                _this.equipNamelist = _this.options.data.fields.equipments;
            }
        }

        this.attachEvents(arrTds, _this.equipNamelist);
        this.refreshRelatedEquipmentTpl();
    };

    WorkOrder.prototype.close = function () {
        //to-do
    };

    WorkOrder.prototype.removeByValue = function (arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    };

    WorkOrder.prototype.renderByType = function () {
        var $content = _this.$container.find('.tab-workflow-content');
        $content.html(beopTmpl('tpl_WorkflowMaintain', {
            record: _this.options.data,
            editable: _this.options.status != 'detail'
        }));
        $('#divWorkOrderSystemType').val(_this.options.data.fields.systemType);
        $("#divWorkOrderMaintainCycle").val(_this.options.data.fields.maintainCycle);
        try {
            if (_this.options.data.fields && _this.options.data.fields.userInfo) {
                this.userHasSelected = {
                    executor: _this.options.data.fields.userInfo.executor,
                    verifiers: _this.options.data.fields.userInfo.verifiers,
                    watchers: _this.options.data.fields.userInfo.watchers
                };
            }
        } catch (e) {
            console.error(e);
        }

        $("#form_datetime, #takeEffectDatetime").datetimepicker({
            startView: 'month',
            minView: 'month',
            format: "yyyy-mm-dd",
            autoclose: true
        });
        //由于disabled传入bool值不起作用,删除disabled属性,当disabled=false模拟bool值在起作用
        $content.find('[disabled=false]').removeAttr('disabled');
        _this.$container.addClass(_this.options.status);
    };

    WorkOrder.prototype.attachEvents = function (arrTds) {
        $('#btnSend').off('click').on('click', function () {
            _this.maintainSubmit(arrTds);
        });

        this.$container.off('click.delete-name').on('click.delete-name', '.delete-name', function () {
            var $this = $(this);
            _this.removeByValue(_this.equipNamelist, $this.siblings('.equip-name').text());
            $this.closest('li').remove();
        });

        this.$container.off('click.save-task').on('click.save-task', '#btnSave', function () {
            var data = _this.getMaintainWorkOrder(arrTds);
            if (!data) {
                return;
            }
            Spinner.spin(ElScreenContainer);
            var newData = $.extend(true, {}, _this.options.data, data);
            WebAPI.post('/workflow/saveTask/', newData).done(function (result) {
                if (result.success) {
                    alert('计划保存成功！');
                    _this.orderObj.curData = _this.options.data = newData;
                }
            }).always(function () {
                Spinner.stop();
            })
        });

        this.$container.off('click.wf-people-add').on('click.wf-people-add', '.wf-people-add', function () {
            var $editItem = $(this);
            var type = $editItem.data('type');
            beop.view.memberSelected.init($("#wrapper"), {
                configModel: {
                    userMemberMap: _this.userData,
                    userHasSelected: _this.userHasSelected[type],
                    cb_dialog_hide: function (addedUserList) {
                        _this.userHasSelected[type] = addedUserList;
                        $("#wrapper").find('.wf-detail-userInfoWrapper').filter(function (index, item) {
                            return $(item).data('type') === type;
                        }).html(beopTmpl('tpl_wf_added_member_personal', {
                            members: addedUserList,
                            userListName: type ? type : 'addedUserList'
                        }))
                    },
                    maxSelected: type == 'executor' ? 1 : null
                }
            });
        });
    };

    WorkOrder.prototype.refreshRelatedEquipmentTpl = function () {
        $("#relatedEquipmentUl").empty().html(beopTmpl('tpl_wfRelatedEquipmentLi', {
            nameList: _this.equipNamelist
        }));
    };
    /**
     * 下次保养时间
     * @param effectiveDate
     * @param maintainCycle
     */
    WorkOrder.prototype.nextServiceTime = function (effectiveDate, maintainCycle) {
        var effectiveDate = new Date(effectiveDate);
        var internal = 0;
        switch (maintainCycle) {
            case 0://每月
                internal = 30;
                break;
            case 1://季度
                internal = 30 * 4;
                break;
            case 2://半年
                internal = 30 * 6;
                break;
            case 3://每年
                internal = 365;
                break;
            case 4://每两周
                internal = 14;
                break;

        }
        return new Date(effectiveDate.setDate(effectiveDate.getDate() + internal)).format('yyyy-MM-dd');
    };

    WorkOrder.prototype.getMaintainWorkOrder = function (arrTds) {
        var maintainProjectVal = $("#divWorkOrderMaintainProject").val().trim(),
            takeEffectDatetimeVal = $("#takeEffectDatetime").val().trim(),
            planTimeLongVal = $("#divWorkOrderPlanTimeLong").val().trim(),
            maintainDetailVal = $("#divWorkOrderMaintenanceDetail").val().trim(),
            maintainRemindTimeVal = $("#divWorkOrderRemindTime").val().trim(),
            divWorkOrderSystemTypeVal = $("#divWorkOrderSystemType").val();

        var positiveIntegerRegex = /^[1-9]+(\d{1,3})?$/;

        if (!maintainProjectVal) {
            alert('保养项目不能为空！');
            return;
        }

        if (!takeEffectDatetimeVal) {
            alert('生效时间不能为空！');
            return;
        }

        if (!maintainRemindTimeVal) {
            alert('提醒时间不能为空！');
            return;
        } else {
            if (!positiveIntegerRegex.test(maintainRemindTimeVal)) {
                alert('提醒时间必须为正整数！');
                return;
            }
        }

        if (!planTimeLongVal) {
            alert('计划时长不能为空！');
            return;
        } else {
            if (!positiveIntegerRegex.test(planTimeLongVal)) {
                alert('计划时长必须为正整数！');
                return;
            }
        }

        if (!maintainDetailVal) {
            alert('维保详情不能为空！');
            return;
        }

        if (!this.userHasSelected.executor.length) {
            alert('执行人不能为空！');
            return;
        }
        if (!divWorkOrderSystemTypeVal) {
            alert('系统分类不能为空！');
            return;
        }
        var maintainCycle = parseInt($("#divWorkOrderMaintainCycle").val().trim());
        return {
            executor: window.parent.AppConfig.userId,
            title: maintainProjectVal,
            attachment: this.uploadWidget.allFileList,
            detail: maintainDetailVal,
            status: -1,
            fields: {
                _ids: arrTds,
                projId: window.parent.AppConfig.projectId,
                type: 4,
                detail: maintainDetailVal,
                effectiveDate: takeEffectDatetimeVal,
                reminderDay: parseInt(maintainRemindTimeVal),
                maintainCycle: maintainCycle,
                duration: parseInt(planTimeLongVal),
                systemType: parseInt(divWorkOrderSystemTypeVal),
                equipments: this.equipNamelist,
                userInfo: this.userHasSelected,
                nextServiceDates: _this.nextServiceTime(takeEffectDatetimeVal, maintainCycle)
            }
        };
    };
    WorkOrder.prototype.maintainSubmit = function (arrTds) {
        var data = this.getMaintainWorkOrder(arrTds);
        if (!data) {
            return;
        }
        Spinner.spin(ElScreenContainer);
        WebAPI.post('/workflow/task/new/', data).done(function (result) {
            if (result.success) {
                $('.tab-handle').eq(4)[0].click();
                alert('计划新建成功！');
            }
        }).always(function () {
            Spinner.stop();
        })
    };

    WorkOrder.prototype.requestUserMap = function () {
        if (this.requestUserMapPromise) {
            return;
        }

        this.requestUserMapPromise = WebAPI.get('/workflow/group/user_team_dialog_list/' + window.parent.AppConfig.userId).done(function (result) {
            if (result.success) {
                _this.userData = result.data;
            }
        }).fail(function () {
            alert('服务器请求出错');
        });
    };

    WorkOrder.prototype.initFileUpload = function () {
        this.uploadWidget = new WfFileUpload();
        this.uploadWidget.set("$container", _this.$container.find('#wf-attachment-labelWrapper'));
        this.uploadWidget.set("isCreateNewTask", true);
        if (this.options && this.options.data) {
            this.uploadWidget.allFileList = this.options.data.attachment || [];
        }
        this.uploadWidget.show();
    };

    return new WorkOrder();

}());