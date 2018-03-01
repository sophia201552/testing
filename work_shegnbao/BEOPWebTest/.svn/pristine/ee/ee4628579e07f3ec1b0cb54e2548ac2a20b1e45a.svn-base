/**
 * Created by Administrator on 2016/1/25.
 */
var WorkflowInsert = (function () {

    //配置
    var ConfigMap = {
        //DOM ID Class
        el: {
            "container": "#workflow-insert-container",
            "modalContainer": "#wf-add-person",
            "faultCurveContainer": "#workflow-insert-curve",
            "userGroupContainer": "#wf-user-group-list",
            "calendarContainer": "#dueTime",
            "confirmBtn": "#workflow-insert-submit-btn"
        }
    };
    /*
     param = {
     noticeId: _this.currentEvent.content.id,
     title: _this.currentEvent.content.fault.name,
     detail: _this.currentEvent.content.fault.description,
     dueDate: new Date(+new Date() + 172800000).format('yyyy-MM-dd'),  //结束时间为两天后
     critical: faultGrade,
     projectId: _this.currentEvent.content.project,
     chartPointList: _this.currentEvent.content.fault.points,
     chartQueryCircle: 'm5',
     description: '冷凝器进水温度读数无规律波动, 请检查相应传感器',
     name: "冷凝器进水温度无规律波动",
     time: new Date(momentTime).format('yyyy-MM-dd HH:mm:ss'),
     chartStartTime: new Date(momentTime - 43200000).format('yyyy-MM-dd HH:mm:ss'), //报警发生前半天
     chartEndTime: new Date(momentTime + 43200000).format('yyyy-MM-dd HH:mm:ss')   //报警发生后半天
     };
     */
    function WorkflowInsert(insertData) {
        //数据来源
        this.insertData = insertData;

        //外部的回调Map
        this.eventCbList = {};

        //modal类型 来判断点击 确定 和 取消 的 回调类型
        // default 默认的时候 提交表单或者取消（modal关闭）
        // addPerson 添加人员（添加人员或者取消添加人员）
        this.modalType = "default";

        //用户有没有任务组
        this.isUserHasGroup = false;

        //echarts实例
        this.echartsInstance = null;

        //jquery map
        this.jqueryMap = {};

        //modal body detach
        this.modalBodyDetach = null;

        //等待上传的文件队列
        this.pendingFiles = [];

        //工单信息
        this.taskModelInfo = null;

        //form data
        this.formData = new FormData();

        //当前的spinner
        this.spinner = new LoadingSpinner({color: '#00FFFF'});

        //stateMap
        this.stateMap = {
            userSelectedMap: {
                "verifiers": [],
                "executor": [],
                "watchers": []
            },
            userGroupList: []
        }
    }

    WorkflowInsert.prototype = {
        //public
        show: function () {
            Spinner.spin(ElScreenContainer);
            WebAPI.get("/static/views/workflow/workflowInsert.html" + '?=' + new Date().getTime()).done(function (resultHtml) {
                $('body').append(resultHtml);
                this.jqueryMap.$container = $((ConfigMap.el.container)).find('.modal');
                this.jqueryMap.$workflowInsertTitle = this.jqueryMap.$container.find('.modal-title');
                this._init();
                this._setModalJqueryMap();
                I18n.fillArea(this.jqueryMap.$container);
            }.bind(this));
            return this;
        },
        //主动关闭和销毁
        close: function () {
            this._destroy();
        },
        //提交
        submitSuccess: function (fn) {
            this.eventCbList.submitSuccess = fn ? fn : this._noop;
            return this;
        },
        //取消
        cancel: function (fn) {
            this.eventCbList.cancel = fn ? fn : this._noop;
            return this;
        },
        //失败
        fail: function (fn) {
            this.eventCbList.fail = fn ? fn : this._noop;
            return this;
        },
        //private
        _destroy: function () {
            this.echartsInstance && this.echartsInstance.dispose();
            $(ConfigMap.el.container).remove();
            this.jqueryMap = null;
            this.pendingFiles = null;
            this.modalBodyDetach = null;
        },
        _init: function () {
            //检查用户是否有任务组
            var _this = this;
            _this._bindEventsCommon();
            this._checkIsUserHasGroup().done(function () {
                if (_this.isUserHasGroup) {
                    _this._loadDataNormal().done(function () {
                        _this._bindEventsNormal();
                    }).fail(function (err) {
                        console.error(err);
                    })
                } else {
                    _this._loadDataNormalSpecial().done(function () {
                        _this._bindEventsSpecial();
                    })
                }
                I18n.fillArea(_this.jqueryMap.$container);
                Spinner.stop();
                _this.jqueryMap.$container.modal({backdrop: 'static'});
            });
        },
        //set modal jquery map
        _setModalJqueryMap: function () {
            this.jqueryMap.$modalHeader = this.jqueryMap.$container.find('.modal-header');
            this.jqueryMap.$modalBody = this.jqueryMap.$container.find('.modal-body');
            this.jqueryMap.$modalFooter = this.jqueryMap.$container.find('.modal-footer');
            this.jqueryMap.$fileUploadBtn = this.jqueryMap.$container.find('#wf-attachment-input-btn');
        },
        //检查用户是否拥有任务组
        _checkIsUserHasGroup: function () {
            return WebAPI.get('/workflow/users/group/' + AppConfig.userId).done(function (result) {
                if (result.success) {
                    var key;
                    for (key in result.data) {
                        if (result.data.hasOwnProperty(key)) {
                            this.stateMap.userGroupList = this.stateMap.userGroupList.concat(result.data[key]);
                        }
                    }
                    this.isUserHasGroup = this.stateMap.userGroupList.length > 0;
                }
            }.bind(this));
        },
        //通用的绑定事件
        _bindEventsCommon: function () {
            var _this = this;
            this.jqueryMap.$container.off();

            //modal show
            this.jqueryMap.$container.on('hidden.bs.modal', this._onModalHide.bind(this)).on('show.bs.modal', this._onModalShow.bind(this));
            //modal hide
            this.jqueryMap.$container.on('click.workflow-insert-cancel-btn', '#workflow-insert-cancel-btn', this._onCancelClick.bind(this));
            //添加人员
            this.jqueryMap.$container.on('click.wf-people-add', '.wf-people-add', this._addUserSelectDialog.bind(this));
            //点击确定
            this.jqueryMap.$container.on('click.workflow-insert-submit-btn', ConfigMap.el.confirmBtn, this._onConfirm.bind(this));
            //添加附件
            this.jqueryMap.$container.on('click.wf-attachment-input-btn', '#wf-attachment-input-btn', this._uploadFile.bind(this));
        },
        //用户有任务组就直接读取当前错误参数
        _loadDataNormal: function () {
            var failed = function (data) {
                console.error('Get loadInsertPage error !');
                console.log(data);
            };
            if ($.isEmptyObject(this.insertData)) {
                return $.Deferred().reject('insertData' + 'isn\'t a unEmptyObject! ');
            }
            //处理DOM
            this.jqueryMap.$workflowInsertTitle.html(I18n.resource.workflow.main.NEW_FAULT_ORDER).attr("i18n", 'workflow.main.NEW_FAULT_ORDER');
            this.jqueryMap.$modalBody.empty().html(beopTmpl('temp_fault_new_order', {
                fault: this.insertData
            }));
            this._refreshGroupMenuList();
            I18n.fillArea(this.jqueryMap.$container);
            //请求echarts数据
            return this._getChartData().done(function (result) {
                if (result.success) {
                    I18n.fillArea(this.jqueryMap.$container);
                }
            }.bind(this)).always(function () {
                Spinner.stop();
            }).fail(function () {
                failed(this.insertData);
            }.bind(this));
        },
        //用户没有任务组添加任务组
        _loadDataNormalSpecial: function () {
            var $dfd = $.Deferred();
            this.jqueryMap.$workflowInsertTitle.html(I18n.resource.workflow.main.NEW_TASK_GROUP).attr("i18n", 'workflow.main.NEW_TASK_GROUP');
            this.jqueryMap.$modalBody.empty().html(beopTmpl('temp_fault_group_add'));
            $dfd.resolve();
            return $dfd;
        },
        //noop
        _noop: function () {
            return false;
        },
        //通用的添加人员
        _addUserSelectDialog: function (ev) {
            var $modalBody = this.jqueryMap.$modalBody, $this = $(ev.target);
            // 2016-03-18 选择人物框放在了body下
            //this.modalBodyDetach = $modalBody.children().detach();
            this.modalType = "addPerson";
            if (this.isUserHasGroup) {
                this._openUserSelectDialog($this.data('type'));
            } else {
                this._openUserSelectDialog();
            }
            I18n.fillArea($(this.jqueryMap.$container));
        },
        _openUserSelectDialog: function (type) {
            var _this = this;
            var setUserSelectedNormal = function (result, type) {
                var flag = null;
                beop.view.memberSelected.configModel({
                    userMemberMap: result.data,
                    cb_dialog_hide: _this._renderAddedUsersNormal(type),
                    userHasSelected: _this.stateMap.userSelectedMap[type],
                    maxSelected: type == 'executor' ? 1 : null,
                    maxDelete: flag,
                    enableDeleteMember: true,
                    enableAddMember: true
                });
                beop.view.memberSelected.init($('body'));
            }, setUserSelectedSpecial = function (result) {
                beop.view.memberSelected.configModel({
                    cb_dialog_hide: _this._renderAddedUsersSpecial(),
                    maxSelected: null,
                    userMemberMap: result.data,
                    userHasSelected: _this.stateMap.userSelectGroupList
                });
                beop.view.memberSelected.init($('body'));
            };
            if (this.isUserHasGroup) {
                if (beop.model.stateMap.groupId) {
                    WebAPI.get('/workflow/group/group_user_list/' + AppConfig.userId + '/' + beop.model.stateMap.groupId).done(function (result) {
                        if (result.success) {
                            setUserSelectedNormal(result, type);
                        }
                    }).fail(function () {
                        infoBox.alert('获取人物选择框模板失败');
                    });
                } else {
                    WebAPI.get('/workflow/group/user_dialog_list/' + AppConfig.userId).done(function (result) {
                        if (result.success) {
                            setUserSelectedNormal(result, type);
                        }
                    }).fail(function () {
                        infoBox.alert('获取人物选择框模板失败');
                    });
                }
            } else {
                WebAPI.get('/workflow/group/user_dialog_list/' + AppConfig.userId).done(function (result) {
                    if (result.success) {
                        setUserSelectedSpecial(result);
                    }
                }).fail(function () {
                    infoBox.alert('获取人物选择框模板失败');
                });
            }
        },
        //没有任务组的添加人物回调
        _renderAddedUsersSpecial: function () {
            return function (addedUserList) {
                this.stateMap.userSelectGroupList = addedUserList;
                // 2016-03-18 选择人物框放在了body下
                //this._restoreModalBodyDetach();
                this.jqueryMap.$container.find("#wf-workflow-memberList").html(beopTmpl('temp_wf_added_member', {members: this.stateMap.userSelectGroupList}));
                //恢复modal类型
                this.modalType = 'default';
            }.bind(this);
        },
        //有任务组的添加人物回调
        _renderAddedUsersNormal: function (type) {
            return function (addedUserList) {
                this.stateMap.userSelectedMap[type] = addedUserList;
                // 2016-03-18 选择人物框放在了body下
                //this._restoreModalBodyDetach();
                var _this = this;
                this.jqueryMap.$modalBody.find(".wf-detail-userInfoWrapper").each(function (index, item) {
                    var $item = $(item);
                    var picType = $item.data("type");
                    $item.html(beopTmpl('temp_wf_added_member_personal', {
                        members: _this.stateMap.userSelectedMap[picType],
                        userListName: picType ? picType : 'addedUserList'
                    }));
                });
                //恢复modal类型
                this.modalType = 'default';
            }.bind(this);
        },
        //恢复modalBodyDetach
        _restoreModalBodyDetach: function () {
            if (this.modalBodyDetach) {
                this.jqueryMap.$modalBody.empty().append(this.modalBodyDetach);
            } else {
                throw new SyntaxError('there is no modalBody Detach in here !');
            }
        },
        //上传文件
        _uploadFile: function () {
            Spinner.spin(ElScreenContainer);
            var _this = this;
            var fileUploadInstance = new WfFileUpload(true, this.pendingFiles.length, true);
            fileUploadInstance.init(function () {
                Spinner.stop();
            }).uploadSuccess(function (list) {
                _this._showUploadFile(list, this);
            }).close(function (file) {

            })
        },
        //显示上传文件列表
        _showUploadFile: function (list, fileUploadInstance) {
            this.pendingFiles = this.pendingFiles.concat(list);
            fileUploadInstance = null;
            var html = '', _this = this;
            this.pendingFiles.forEach(function (item) {
                html += beopTmpl('wf_file_list_temp', {
                    file: item.file,
                    fileId: item.id,
                    iconClass: item.iconClass,
                    fileBase64: item.fileBase64,
                    uid: item.uid,
                    fileName: item.file.name
                })
            });
            var AUTOSENDFILE = true;
            this.jqueryMap.$container.find('.wf-attachment-nav').empty().html(html);
            this.jqueryMap.$container.off('click.wf-remove-upload-item').on('click.wf-remove-upload-item', '.wf-remove-upload-item', function () {
                var $this = $(this), $files = $this.closest('div.files'), fileId = $files.attr('data-file-id'), uid = $files.attr('data-file-uid'), fileName = $files.attr('data-file-name');
                var removeAttachmentLi = function () {
                    _this.pendingFiles.forEach(function (item, index, array) {
                        if (item.id == fileId) {
                            array.splice(index, 1);
                        }
                    });
                    _this.jqueryMap.$container.find('.wf-attachment-nav').find('li').each(function () {
                        var $that = $(this);
                        if ($that.find('.files').attr('data-file-id') == fileId) {
                            $that.fadeOut();
                        }
                    })
                };
                if (AUTOSENDFILE) {
                    confirm(I18n.resource.workflow.task.ATTACHMENT_DELETE_NOTE, function () {
                        Spinner.spin(ElScreenContainer);
                        WebAPI.post('/workflow/attachment/deleteByName', {
                            fileId: fileId,
                            uid: uid,
                            name: fileName
                        }).done(function (result) {
                            if (result.success) {
                                removeAttachmentLi();
                            }
                        }).always(function () {
                            Spinner.stop();
                        });
                    });
                } else {
                    confirm(I18n.resource.workflow.task.ATTACHMENT_DELETE_NOTE, function () {
                        if (!fileId) {
                            return false;
                        } else {
                            removeAttachmentLi();
                        }
                    });
                }
            });
        },
        //点击取消的时候
        _onCancelClick: function () {
            //如果是默认取消
            if (this.modalType == 'default') {
                this.jqueryMap.$container.modal('hide')
            } else if (this.modalType == 'addPerson') {
                //如果是添加人员的取消
                this.modalType = 'default';
                //this._restoreModalBodyDetach();
            }
        },
        //点击确定
        _onConfirm: function () {
            var _this = this;
            if (this.modalType == 'addPerson') {
                //主动触发点击事件
                this.jqueryMap.$container.find('#wf-member-comfirm-btn').click();
            } else if (this.modalType == 'default') {
                //点击确定的时候判断是提交任务组还是工单
                if (this.isUserHasGroup) {
                    if (_this._pageTaskCheck()) {
                        this._newTaskSubmit();
                    }
                } else {
                    if (_this._pageTaskGroupCheck()) {
                        this._newTaskGroupSubmit();
                    }
                }
            }
        },
        _pageTaskCheck: function () {//任务页面校验
            var $dialog = $("#workflow-insert-container"), i18n = I18n.resource.workflow.common;
            var title_val = $dialog.find('input[name="title"]').val().trim(),
                detail_val = $dialog.find('textarea[name="detail"]').val().trim();
            if (title_val === "") {
                Alert.danger($dialog, i18n.TITLE_REQUIRED).showAtTop(2000);
                return false;
            }
            if (detail_val === "") {
                Alert.danger($dialog, i18n.DETAIL_REQUIRED).showAtTop(2000);
                return false;
            }
            return true;
        },
        _pageTaskGroupCheck: function () {//任务组页面校验
            var $dialog = $("#workflow-insert-container"), i18n = I18n.resource.workflow.common;
            var title_val = $dialog.find('input[name="name"]').val().trim(),
                detail_val = $dialog.find('textarea[name="description"]').val().trim();
            if (title_val === "") {
                Alert.danger($dialog, i18n.GROUP_NAME_REQUIRED).showAtTop(2000);
                return false;
            }
            if (detail_val === "") {
                Alert.danger($dialog, i18n.DETAIL_REQUIRED).showAtTop(2000);
                return false;
            }
            return true;
        },

        //modal显示的时候
        _onModalShow: function () {

        },
        //modal隐藏的时候
        _onModalHide: function () {
            this._destroy();
            this.eventCbList.cancel && this.eventCbList.cancel.call(this)
        },
        //正常情况下的绑定事件
        _bindEventsNormal: function () {
            var _this = this;
            $(ConfigMap.el.calendarContainer).datetimepicker({
                minView: 2,
                format: "yyyy-mm-dd",
                autoclose: true
            });
            this.jqueryMap.$container.on('submit', this._newTaskSubmit.bind(this));
            this.jqueryMap.$container.find(ConfigMap.el.userGroupContainer).off().on('change', function () {
                _this._setUserTaskGroupId($(this).val())
            });
        },
        //设置用户工单任务组id访问历史
        _setUserTaskGroupId: function (value) {
            if (beop.model && beop.model.stateMap) {
                beop.model.stateMap.groupId = value;
            } else {
                if (beop.model) {
                    beop.model.stateMap = {};
                    beop.model.stateMap.groupId = value;
                } else {
                    beop.model = {};
                    beop.model.stateMap = {};
                    beop.model.stateMap.groupId = value;
                }
            }
        },
        //新的任务组添加完成后返回到创建工单的步骤
        _returnCreateTask: function () {
            Spinner.spin(this.jqueryMap.$container.get(0));
            this.isUserHasGroup = true;
            this._loadDataNormal();
            Spinner.stop();
        },
        //新的任务组添加提交事件
        _newTaskGroupSubmit: function () {
            var formObject = this.jqueryMap.$container.find('#wf-add-group-form').serializeObject(), _this = this;
            WebAPI.post('/workflow/group/new/' + AppConfig.userId, formObject).done(function (result) {
                if (result.success) {
                    Alert.success(_this.jqueryMap.$container.get(0), i18n_resource.workflow.task.ADD_GROUP_SUCCESS).showAtTop(500);
                    _this._setUserTaskGroupId(result.data);
                    _this._returnCreateTask();
                }
            }).fail(function (err) {
                Alert.danger(_this.jqueryMap.$container.get(0), err.msg).showAtTop(2000);
            })
        },
        //新的工单提交事件
        _newTaskSubmit: function () {
            //先提交工单 然后提交文件上传
            var _this = this;
            Spinner.spin(this.jqueryMap.$container.get(0));
            this._submitData().done(function (result) {
                if (result.success) {

                    //TODO 为了创建后发送邮件这里先这样写，不走下面的流程
                    _this.pendingFiles = [];

                    if (_this.pendingFiles && _this.pendingFiles.length) {
                        //上传文件
                        _this._submitFileUpload(result.data).done(function (uploadResult) {
                            if (uploadResult && uploadResult.success) {
                                Alert.success(_this.jqueryMap.$container.get(0), I18n.resource.workflow.main.THE_WORK_ORDER + I18n.resource.workflow.main.IS_CREATED_SUCCESSFULLY).showAtTop(2000);
                                _this.eventCbList.submitSuccess && _this.eventCbList.submitSuccess.call(_this, _this.taskModelInfo, _this.pendingFiles);
                            } else {
                                Alert.danger(_this.jqueryMap.$container.get(0), I18n.resource.workflow.task.ATTACHMENT_FILE_FAIL_INFO).showAtTop(2000);
                            }
                        }).fail(function () {
                            Alert.danger(_this.jqueryMap.$container.get(0), I18n.resource.workflow.task.ATTACHMENT_FILE_FAIL_INFO).showAtTop(2000);
                            _this.eventCbList.fail && _this.eventCbList.fail.call(_this);
                        });
                    } else {
                        Alert.success(_this.jqueryMap.$container.get(0), I18n.resource.workflow.main.IS_CREATED_SUCCESSFULLY).showAtTop(2000);
                        _this.eventCbList.submitSuccess && _this.eventCbList.submitSuccess.call(_this, _this.taskModelInfo);
                    }
                } else {
                    Alert.danger(_this.jqueryMap.$container.get(0), result.msg).showAtTop(2000);
                    _this.eventCbList.fail && _this.eventCbList.fail.call(_this);
                }
            }).fail(function () {
                Alert.danger(_this.jqueryMap.$container.get(0), I18n.resource.workflow.main.CREATE_WORKFLOW_FAILED).showAtTop(2000);
                _this.eventCbList.fail && _this.eventCbList.fail.call(_this);
            }).always(function () {
                Spinner.stop();
            })
        },
        _submitData: function () {
            return WebAPI.post('/workflow/transaction/new/', this._getSubmitData());
        },
        _submitFileUpload: function (transId) {
            var _this = this;
            this.pendingFiles.forEach(function (item) {
                _this.formData.append('file', item.file);
            });
            _this.formData.append('transId', transId);
            _this.formData.append('userId', AppConfig.userId);
            return $.ajax({
                url: 'workflow/attachment/upload',
                type: 'post',
                data: _this.formData,
                cache: false,
                contentType: false,
                processData: false
            });
        },
        //得到提交数据
        _getSubmitData: function () {
            var $formData = this.jqueryMap.$container.find('#wf-detail-form').serializeObject();
            $formData["pendingFiles"] = [];
            this.pendingFiles.forEach(function (item) {
                $formData.pendingFiles.push({
                    fileName: item.file.name,
                    uid: item.uid
                });
            });
            var param = {
                chartPointList: this.insertData.chartPointList,
                chartQueryCircle: this.insertData.chartQueryCircle,
                chartStartTime: this.insertData.chartStartTime,
                chartEndTime: this.insertData.chartEndTime,
                userId: AppConfig.userId,
                projectId: AppConfig.projectId || Number(this.insertData.projectId),
                noticeId: this.insertData.noticeId
            };
            this.taskModelInfo = $.extend(true, {}, param, $formData);
            return this.taskModelInfo;
        },
        //如果用户没有任务组的情况下绑定事件
        _bindEventsSpecial: function () {

        },
        //移除事件绑定
        _removeEvents: function () {

        },
        //刷新任务组菜单
        _refreshGroupMenuList: function () {
            var html = "";
            this.stateMap.userGroupList.forEach(function (item) {
                html += '<option value="' + item.id + '">' + item.name + '</option>';
            });
            $(ConfigMap.el.userGroupContainer).empty().html(html).val(beop.model.stateMap.groupId);
        },
        //获取错误echarts图表数据
        _getChartData: function () {
            var data = this.insertData, _this = this;
            this.spinner.spin($(ConfigMap.el.faultCurveContainer).get(0));
            var failed = function (err) {
                console.error('get charts data error!' + err);
                console.log(data);
            };
            return WebAPI.post('/workflow/loadInsertPage', {
                noticeId: data.noticeId,
                title: data.name,
                detail: data.description,
                dueDate: data.dueDate,
                critical: data.critical,
                projectId: data.projectId,
                chartPointList: data.chartPointList,
                chartQueryCircle: data.chartQueryCircle,
                chartStartTime: data.chartStartTime,
                chartEndTime: data.chartEndTime,
                userId: AppConfig.userId
            }).done(function (result) {
                if (result.success) {
                    this._renderChart(result.data, this.spinner);
                } else {
                    failed(result);
                }
            }.bind(this)).always(function () {

            }).fail(function (err) {
                failed(err);
                spinner.stop();
            });
        },
        //加载错误echarts图表
        _renderChart: function (data, spinner, $echartContainer) {
            var list_description = data.list_description,
                list_value = data.list_value,
                arrXAxis = [], result = [];
            if (data.list_time.length > 0) {
                result = data.list_time[0].split(',');
            }
            result.forEach(function (item) {
                arrXAxis.push(item.split(' ')[1])
            });
            var arrSeriesTemp = [];
            for (var i = 0; i < list_value.length; i++) {
                var arrDatas = [];
                if (i < 8) {
                    var item = list_value[i];
                    if (item) {
                        var strDatas = item.split(",");
                        for (var j = 0; j < strDatas.length; ++j) {
                            arrDatas.push(parseFloat(strDatas[j]).toFixed(1));
                        }
                    }
                    arrSeriesTemp.push(
                        {
                            name: list_description[i],
                            type: 'line',
                            itemStyle: {normal: {lineStyle: {type: 'solid'}}},
                            data: arrDatas
                        });
                }
            }
            var option =
            {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        if (params[0].name.length > 0) {
                            var strResult = result[params[0].dataIndex] + '<br/>';
                            for (var i = 0; i < params.length; ++i) {
                                strResult += params[i].seriesName + ' : ' + params[i].value;
                                if (i != params.length - 1) {
                                    strResult += '<br/>';
                                }
                            }
                        }
                        return strResult;
                    }
                },
                legend: {
                    data: list_description,
                    x: 'center'
                },
                toolbox: {
                    show: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {onZero: false},
                        data: arrXAxis
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        scale: true
                    }
                ],
                series: arrSeriesTemp
            };
            this.echartsInstance = echarts.init($echartContainer ? $echartContainer : this.jqueryMap.$container.find(ConfigMap.el.faultCurveContainer).get(0));
            this.echartsInstance.setOption(option);
            window.onresize = this.echartsInstance.resize;
            spinner.stop();
        },
        _renderForm: function (form) {

        }

    };

    return WorkflowInsert;

})();