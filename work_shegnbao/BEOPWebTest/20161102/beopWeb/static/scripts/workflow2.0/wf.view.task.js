(function (beop) {
    var configMap = {
            htmlURL: '/static/views/workflow/task.html',
            settable_map: {
                taskModel: true,
                tags_model: true,
                group_model: true,
                attachmentModel: true,
                taskGroupModel: true,
                viewModel: true
            },
            taskModel: null,
            tags_model: null,
            group_model: null,
            attachmentModel: null,
            taskGroupModel: null,
            viewModel: {}
        },
        stateMap = {
            viewModel: configMap.viewModel
        },
        jqueryMap = {},
        setJqueryMap,
        configModel,
        init, attachEvents;

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = $.extend(jqueryMap ? jqueryMap : {}, {
            $container: $container,
            $taskContent: $container.find('#taskContent'),
            $processSelector: $container.find('#taskProcessSelector'),
            $taskGroupSelector: $container.find('#taskGroupSelector'),
            $taskTemplateFields: $container.find('#taskTemplateFields'),
            $taskGroupProcess: $container.find('#taskGroupProcess'),
            $taskContentForm: $container.find('#taskContent')
        });
    };

    configModel = function (input_map) {
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };

    init = function ($container, transId) {
        Spinner.spin(ElScreenContainer);
        stateMap.$container = $container;
        return configMap.taskGroupModel.getTaskGroup().done(function (result) {
            if (!result.success) {
                return false;
            }
            return WebAPI.get(configMap.htmlURL).done(function (resultHtml) {
                stateMap.$container.html(resultHtml);
                setJqueryMap();
                stateMap.viewModel.taskGroup = result.data ? result.data : [];

                if (stateMap.viewModel.taskGroup[0]) {
                    setProcessesByGroupId(stateMap.viewModel.taskGroup[0]._id);
                }


                jqueryMap.$taskGroupProcess.empty().append(beopTmpl('tpl_wf_task_group_process', stateMap.viewModel));

                initDatePicker();

                stateMap.transId = transId;
                attachEvents();
                I18n.fillArea(jqueryMap.$container);
            })
        }).always(function () {
            Spinner.stop();
        });

    };

    attachEvents = function () {
        jqueryMap.$taskContent.on('change', '#taskGroupSelector', changeTaskGroup);
        jqueryMap.$taskContent.on('change', '#taskProcessSelector', changeProcess);
        jqueryMap.$container.on('click.taskSave', '#taskSave', taskSave);
    };

//---------DOM操作------
    var renderGroupProcess, initDatePicker, renderTemplate;
    renderGroupProcess = function () {
        jqueryMap.$processSelector = $('#taskProcessSelector');
        jqueryMap.$processSelector.empty().append(beopTmpl('tpl_wf_task_process_option', {process: stateMap.viewModel.process}));
    };

    initDatePicker = function () {
        jqueryMap.$due_time = jqueryMap.$container.find('#dueTime');
        jqueryMap.$due_time.datetimepicker({
            minView: 2,
            format: "yyyy-mm-dd",
            startDate: new Date().format('yyyy-MM-dd 00:00:00'),
            autoclose: true
        });
    };

    renderTemplate = function (process_id) {
        jqueryMap.$taskTemplateFields = $('#taskTemplateFields');
        var template = getProcessTemplate(process_id);
        jqueryMap.$taskTemplateFields.empty().append(beopTmpl('tpl_wf_task_template', template));
    };
//---------方法---------
    var setProcessesByGroupId, getProcess, getProcessTemplate;

    setProcessesByGroupId = function (groupId) {
        for (var m = 0, n = stateMap.viewModel.taskGroup.length; m < n; m++) {
            if (stateMap.viewModel.taskGroup[m]._id == groupId) {
                stateMap.viewModel.process = stateMap.viewModel.taskGroup[m].process;
                break;
            }
        }
        renderTemplate(stateMap.viewModel.process[0]._id);
    };

    getProcess = function (process_id) {
        for (var m = 0, n = stateMap.viewModel.process.length; m < n; m++) {
            if (stateMap.viewModel.process[m]._id == process_id) {
                return stateMap.viewModel.process[m];
            }
        }
    };

    getProcessTemplate = function (process_id) {
        var process = getProcess(process_id);
        return process && process.template;
    };


//---------事件---------
    var changeTaskGroup, changeProcess, taskSave;
    changeTaskGroup = function () {
        setProcessesByGroupId($(this).val());
        renderGroupProcess();
    };

    changeProcess = function () {
        renderTemplate($(this).val())
    };

    taskSave = function () {
        Spinner.spin(jqueryMap.$container[0]);
        configMap.taskModel.saveTask(jqueryMap.$taskContentForm.serializeObject()).done(function (result) {
            if (result.success) {
                alert('success');
            }
        }).always(function () {
            Spinner.stop();
        });
    };

//---------Exports---------
    beop.view = beop.view || {};
    beop.view.task = {
        configModel: configModel,
        init: init
    };
}(beop || (beop = {})));
