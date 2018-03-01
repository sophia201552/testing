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
    var _this = null;

    function WorkflowInsert(insertData) {
        _this = this;
        //数据来源
        this.insertData = insertData;

        //外部的回调Map
        this.eventCbList = {};

        //modal类型 来判断点击 确定 和 取消 的 回调类型
        // default 默认的时候 提交表单或者取消（modal关闭）
        // addPerson 添加人员（添加人员或者取消添加人员）
        this.modalType = "default";

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
                this.jqueryMap.$container = $(ConfigMap.el.container).find('.modal');
                this.jqueryMap.$workflowInsertTitle = this.jqueryMap.$container.find('.modal-title');
                this._setModalJqueryMap();
                this._init();
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
            _this._loadDataNormal().done(function () {
                _this._bindEventsNormal();
            }).fail(function (err) {
                console.error(err);
            }).always(function () {
                Spinner.stop();
            });
            I18n.fillArea(_this.jqueryMap.$container);
            _this.jqueryMap.$container.modal({backdrop: 'static'});
            _this._uploadFile();
        },
        //set modal jquery map
        _setModalJqueryMap: function () {
            this.jqueryMap.$modalHeader = this.jqueryMap.$container.find('.modal-header');
            this.jqueryMap.$modalBody = this.jqueryMap.$container.find('.modal-body');
            this.jqueryMap.$modalFooter = this.jqueryMap.$container.find('.modal-footer');
            this.jqueryMap.$fileUploadBtn = this.jqueryMap.$container.find('#wf-attachment-input-btn');
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
            return this._renderFaultChart().done(function (result) {
                if (result.success) {
                    I18n.fillArea(this.jqueryMap.$container);
                }
            }.bind(this)).always(function () {
                Spinner.stop();
            }).fail(function () {
                failed(this.insertData);
            }.bind(this));
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
            this._openUserSelectDialog($this.data('type'));
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
            };
            var groupUserPromise = null;
            if (beop.model.stateMap.groupId) {
                groupUserPromise = WebAPI.get('/workflow/group/group_user_list/' + AppConfig.userId + '/' + beop.model.stateMap.groupId)
            } else {
                groupUserPromise = WebAPI.get('/workflow/group/user_dialog_list/' + AppConfig.userId)
            }
            groupUserPromise.done(function (result) {
                if (result.success) {
                    setUserSelectedNormal(result, type);
                }
            }).fail(function () {
                alert('获取人物选择框模板失败');
            });
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
                }).end().find('.wf-detail-userInfoWrapper dl').on('click', function (event) {
                    event.stopPropagation();
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
            var _this = this;
            _this.fileUploadInstance = new WfFileUpload();
            _this.fileUploadInstance.set("$container", _this.jqueryMap.$modalBody.find('#wf-attachment-labelWrapper'));
            _this.fileUploadInstance.set("isCreateNewTask", true);
            _this.fileUploadInstance.show();
        },
        //显示上传文件列表

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
                if (_this._pageTaskCheck()) {
                    this._newTaskSubmit();
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
                format: timeFormatChange('yyyy-mm-dd'),
                autoclose: true,
                forceParse: false
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
            this._loadDataNormal();
            Spinner.stop();
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
            return WebAPI.post('/workflow/task/save/', this._getSubmitData());
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
            var formData = this.jqueryMap.$container.find('#wf-detail-form').serializeObject();
            formData["pendingFiles"] = [];
            this.pendingFiles.forEach(function (item) {
                formData.pendingFiles.push({
                    fileName: item.file.name,
                    uid: item.uid
                });
            });
            var fields = {
                fields: {
                    faultId: _this.insertData.noticeId,
                    title: formData.title,
                    dueDate: formData.dueDate,
                    critical: formData.critical,
                    detail: formData.detail,
                    pendingFiles: formData.pendingFiles,
                    type: beop.constants.taskType.DIAGNOSIS,
                    charts: {
                        projectId: this.insertData.projectId ? this.insertData.projectId : AppConfig.projectId,
                        chartPointList: this.insertData.chartPointList,
                        chartQueryCircle: this.insertData.chartQueryCircle,
                        chartStartTime: this.insertData.chartStartTime,
                        chartEndTime: this.insertData.chartEndTime
                    }
                }
            };
            var processMember = {
                    processMember: {
                        "0": this.stateMap.userSelectedMap.executor,
                        "1": this.stateMap.userSelectedMap.verifiers
                    }
                },
                attachment = {
                    attachment: _this.fileUploadInstance && _this.fileUploadInstance.allFileList
                };

            this.taskModelInfo = $.extend(true, {}, fields, processMember, attachment);
            return this.taskModelInfo;
        },
        //刷新任务组菜单
        _refreshGroupMenuList: function () {
            var html = "";
            this.stateMap.userGroupList.forEach(function (item) {
                if (item.type == 0) {
                    html += "<option value='" + item.id + "' selected>" + I18n.resource.workflow.main.DEFAULT_GROUP + "</option>";
                } else {
                    if (beop.model.stateMap.groupId == item.id) {
                        html += '<option value="' + item.id + '" selected>' + item.name + '</option>';
                    } else {
                        html += '<option value="' + item.id + '">' + item.name + '</option>';
                    }
                }
            });

            if (!html) {
                html = "<option value='default' selected>" + I18n.resource.workflow.main.DEFAULT_GROUP + "</option>";
            }
            $(ConfigMap.el.userGroupContainer).html(html);
        },
        //获取诊断echarts图表数据
        _renderFaultChart: function () {
            var _this = this;
            if (this.insertData.chartPointList == '') {
                $('#wf-detail-curve-box').hide();
                return $.Deferred().resolve({success: true});
            }
            this.spinner.spin($(ConfigMap.el.faultCurveContainer).get(0));

            beop.view.faultCurve.configModel({
                transactions_model: beop.model.transactionsModel
            });
            return beop.view.faultCurve.init($('#workflow-insert-curve'), {
                points: this.insertData.chartPointList,
                timeFormat: this.insertData.chartQueryCircle,
                timeStart: this.insertData.chartStartTime,
                timeEnd: this.insertData.chartEndTime,
                projectId: this.insertData.projectId ? this.insertData.projectId : AppConfig.projectId
            }).always(function () {
                _this.spinner.stop();
            });
        }
    };

    return WorkflowInsert;

})();