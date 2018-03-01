(function (beop) {
    var makeError, setConfigMap;
    makeError = function (name_text, msg_text, data) {
        var error = new Error();
        error.name = name_text;
        error.message = msg_text;

        if (data) {
            error.data = data;
        }

        return error;
    };

    setConfigMap = function (arg_map) {
        var
            input_map = arg_map.input_map,
            settable_map = arg_map.settable_map,
            config_map = arg_map.config_map,
            key_name, error;

        for (key_name in input_map) {
            if (input_map.hasOwnProperty(key_name)) {
                if (settable_map.hasOwnProperty(key_name)) {
                    config_map[key_name] = input_map[key_name];
                }
                else {
                    error = makeError('Bad Input',
                        'Setting config key |' + key_name + '| is not supported'
                    );
                    throw error;
                }
            }
        }
    };

    $.fn.serializeObject = function () {
        var obj = {};
        this.serializeArray().map(function (item) {
            if (/\[\]$/.test(item.name)) {
                if (obj[item.name]) {
                    obj[item.name].push(item.value);
                } else {
                    obj[item.name] = [item.value];
                }
            } else {
                obj[item.name] = item.value;
            }

        });
        return obj;
    };

    beop.util = $.extend(beop.util ? beop.util : {}, {
        makeError: makeError,
        setConfigMap: setConfigMap
    })
}(beop || (beop = {})));


var WorkflowTool = (function () {
    var pic_path = '/static/images/workflow/', templateStorage;

    function getStatusText(status) {
        if (status == 0) {
            status = 'new';
        }
        switch (status) {
            case 'new':
                return I18n.resource.workflow.main.NEW;
            case 1 || 'closed':
                return I18n.resource.workflow.main.CLOSE;
            case 2 || 'start':
                return I18n.resource.workflow.main.DEALING;
            case 3 || 'pause':
                return I18n.resource.workflow.main.PAUSED;
            case 4 || 'completed':
                return I18n.resource.workflow.main.FINISHED;
            case 5 || 'deleted':
                return I18n.resource.workflow.main.DELETED;
        }
    }

    function translate(text) {
        if (!text) {
            return '';
        }

        try {
            text = JSON.parse(text);
        } catch (e) {
        }

        var Translation = function (text) {
            switch (text) {
                case 'detail':
                    return I18n.resource.workflow.main.WORKFLOW_DETAIL;
                case 'dueDate':
                    return I18n.resource.workflow.notice.DEADLINE;
                case 'title':
                    return I18n.resource.workflow.main.FAULT_TITLE;
                case 'due_date':
                    return I18n.resource.workflow.common.DEADLINE;
                case 'critical':
                    return I18n.resource.workflow.urgencyLevel.URGENCY_LEVEL;
                case 'executor':
                    return I18n.resource.workflow.common.EXECUTOR;
                case 'assignTime':
                    return I18n.resource.workflow.notice.TASK_ASSIGN_TIME;
                case 'groupid':
                    return I18n.resource.workflow.task.TASK_GROUP;
                case 'tags':
                    return I18n.resource.workflow.task.TAGS;
                case 'verifiers':
                    return I18n.resource.workflow.task.VERIFIERS;
                case 'watchers':
                    return I18n.resource.workflow.task.WATCHERS;
                case 'op':
                    return I18n.resource.workflow.task.STATUS;
                default :
                    return text;
            }
        };

        var criticalTranslate = function (num) {
            var level = I18n.resource.workflow.urgencyLevel[parseInt(num)];
            //兼容老的数据
            if (level == 'undefined' || level == undefined || level == null) {
                return ''
            } else {
                return level;
            }
        };

        var groupIdTranslate = function (num) { // 用户组
            for (var i = 0; i < beop.model.stateMap.group_list.length; i++) {
                var groupItem = beop.model.stateMap.group_list[i];
                if (groupItem.id == num) {
                    //兼容老的数据
                    if (groupItem.name == 'undefined' || groupItem.name == undefined || groupItem.name == null) {
                        return ''
                    } else {
                        return groupItem.name;
                    }
                }
            }
        };

        var listObjTranslate = function (list) { // 审核人，相关人员
            if (!list) {
                return "";
            }
            var text = "";
            for (var i = 0; i < list.length; i++) {
                if (i != list.length - 1) {
                    text += list[i].userfullname + ", ";
                } else {
                    text += list[i].userfullname;
                }
            }
            //兼容老的数据
            if (text == 'undefined' || text == null || text == undefined) {
                return ''
            } else {
                return text;
            }
        };

        var html = '<ul class="historyEdit list-unstyled">';
        if ($.isPlainObject(text)) {
            for (var prop in text) {
                if (prop == 'critical') {
                    html += '<li><span class="historyConTitle">' + Translation(prop) + '：</span> ' + '<span class="oldName">' + (criticalTranslate(text[prop].old) ? criticalTranslate(text[prop].old) : '' ) + '</span><strong class="historyAction">' + I18n.resource.workflow.notice.TASK_MODIFY + '</strong><span class="newName">' + (criticalTranslate(text[prop].new) ? criticalTranslate(text[prop].new) : '') + '</span></li>';
                } else if (prop == 'groupid') {
                    html += '<li><span class="historyConTitle">' + Translation(prop) + '：</span> ' + '<span class="oldName">' + (groupIdTranslate(text[prop].old) ? groupIdTranslate(text[prop].old) : '') + '</span><strong class="historyAction">' + I18n.resource.workflow.notice.TASK_MODIFY + '</strong><span class="newName">' + (groupIdTranslate(text[prop].new) ? groupIdTranslate(text[prop].new) : '') + '</span></li>';
                } else if (prop == 'watchers') {
                    html += '<li><span class="historyConTitle">' + Translation(prop) + '：</span> ' + '<span class="oldName">' + (listObjTranslate(text[prop].old) ? listObjTranslate(text[prop].old) : '') + '</span><strong class="historyAction">' + I18n.resource.workflow.notice.TASK_MODIFY + '</strong><span class="newName">' + (listObjTranslate(text[prop].new) ? listObjTranslate(text[prop].new) : '') + '</span></li>';
                } else if (prop == 'verifiers') {
                    html += '<li><span class="historyConTitle">' + Translation(prop) + '：</span> ' + '<span class="oldName">' + (listObjTranslate(text[prop].old) ? listObjTranslate(text[prop].old) : '') + '</span><strong class="historyAction">' + I18n.resource.workflow.notice.TASK_MODIFY + '</strong><span class="newName">' + (listObjTranslate(text[prop].new) ? listObjTranslate(text[prop].new) : '') + '</span></li>';
                } else if (prop == 'op') {
                    html += '<li><span class="historyConTitle">' + Translation(prop) + '：</span> ' + '<strong class="historyAction">' + I18n.resource.workflow.notice.TASK_MODIFY + '</strong><span class="newName">' + (text[prop] ? text[prop] : '') + '</span></li>';
                } else if (prop == 'delete_reply') {
                    html += '<li><span class="historyConTitle"></span> ' + '<strong class="historyAction"></strong><span class="newName">' + (text[prop] ? ( text[prop] ? text[prop] : '' ) : '') + '</span></li>';
                } else if (prop == 'reply') {
                    html += '<li><span class="historyConTitle"></span> ' + '<strong class="historyAction"></strong><span class="newName">' + (text[prop] ? ( text[prop] ? text[prop] : '' ) : '') + '</span></li>';
                }
                else {
                    if (prop != 'forward') {
                        html += '<li><span class="historyConTitle">' + Translation(prop) + '：</span> ' + '<span class="oldName">' + (text[prop].old ? text[prop].old : '') + '</span><strong class="historyAction">' + I18n.resource.workflow.notice.TASK_MODIFY + '</strong><span class="newName">' + (text[prop].new ? text[prop].new : '') + '</span></li>';
                    } else {
                        html += '<li><span class="historyConTitle">' + Translation(prop) + '：</span> ' + '<span class="oldName">' + (text[prop].old ? text[prop].old : '') + '</span><strong class="historyAction">' + I18n.resource.workflow.notice.TASK_MODIFY + '</strong><span class="newName">' + (text[prop].new ? text[prop].new : '') + '</span></li>';
                    }
                }

            }
            html += '</ul>';
            return html;
        } else {
            // 兼容之前的detail
            var textList = text.split('was renamed');
            if (textList.length != 2) {
                switch (text) {
                    case 'edit':
                        return I18n.resource.workflow.notice.TASK_EDIT;
                    case 'complete':
                        return I18n.resource.workflow.notice.TASK_FINISH;
                    case 'restart':
                        return I18n.resource.workflow.notice.TASK_RESTART;
                    case 'start':
                        return I18n.resource.workflow.notice.TASK_START;
                    case 'pause':
                        return I18n.resource.workflow.notice.TASK_PAUSE;
                    case 'reply':
                        return I18n.resource.workflow.notice.TASK_REPLY + ':';
                    case 'new':
                        return I18n.resource.workflow.notice.TASK_CREATE;
                    case 'verified':
                        return I18n.resource.workflow.notice.TASK_VERIFIED;
                    case 'not_pass':
                        return I18n.resource.workflow.notice.TASK_VERIFIED_FAILED;
                    case 'delete':
                        return I18n.resource.workflow.notice.TASK_DELETE;
                    case 'forward':
                        return I18n.resource.workflow.notice.TASK_FORWARD;
                    case 'close':
                        return I18n.resource.workflow.notice.TASK_CLOSED;
                    case 'delete_reply':
                        return I18n.resource.workflow.notice.DELETE_REPLY + ':';
                    default :
                        return text;
                }
            } else {
                return '<p>' + 'title' + ':' + textList[0] + ' <strong>' + I18n.resource.workflow.notice.TASK_MODIFY + '</strong>' + textList[1] + '</p>';
            }
        }
    }

    function recordTranslate(text) {
        switch (text) {
            case 'complete':
                return I18n.resource.workflow.record.FINISH;
            case 'start':
                return I18n.resource.workflow.record.START;
            case 'new':
                return I18n.resource.workflow.record.CREATE;
            case 'verified':
                return I18n.resource.workflow.record.VERIFIED;
            default :
                return text;
        }
    }

    function updateBadge(count, list) {
        var $badge = $('#paneWorkflow').find('li[screen="mine"]').find('.badge');
        if (!count) {
            $badge.text('').data('new-tasks', '');
        } else {
            $badge.text(count).data('new-tasks', list);
        }
    }

    function updateNewTaskCount() {
        if (!AppConfig['userId']) {
            return;
        }
        WebAPI.get('/workflow/new_task_count/' + AppConfig['userId']).done(function (r_obj) {
            if (!r_obj.length) return false;
            var storageNewTask = localStorage.getItem('new_task_' + AppConfig['userId']);
            if (!storageNewTask) {
                updateBadge(r_obj.length, r_obj);
            } else {
                try {
                    storageNewTask = JSON.parse(storageNewTask);
                } catch (e) {
                    return false;
                }
                var unreadList = [];
                for (var n = 0, len = r_obj.length; n < len; n++) {
                    if ($.inArray(r_obj[n], storageNewTask) === -1) {
                        unreadList.push(r_obj[n]);
                    }
                }
                updateBadge(unreadList.length, unreadList);
                localStorage.setItem('new_task_temp_' + AppConfig['userId'], result);
            }
        })
    }

    function getTemplate(template, selector) {
        templateStorage = templateStorage || {};
        var promise;
        if (templateStorage[template]) {
            promise = templateStorage[template];
        } else {
            promise = templateStorage[template] = WebAPI.get(template);
        }
        var dfd = $.Deferred();
        promise.done(function (result) {
            var $result = $(result), $template = $result.find(selector).children();
            var $return = $template.clone()
            I18n.fillArea($return)
            dfd.resolve($return);
        });
        return dfd;
    }

    function getWorkflowTemplate(selector) {
        return getTemplate('/static/views/workflow/template.html', selector);
    }

    function inherits(clazz, base) {
        var clazzPrototype = clazz.prototype;

        function F() {
        }

        F.prototype = base.prototype;
        clazz.prototype = new F();
        for (var prop in clazzPrototype) {
            clazz.prototype[prop] = clazzPrototype[prop];
        }
        clazz.constructor = clazz;
    }

    function getUserName(rawUserName) {
        if (rawUserName.indexOf('@') > 0) {
            return rawUserName.substring(0, rawUserName.indexOf('@'))
        }
        return rawUserName;
    }

    function delArrInvalidValue(arr) { //将数组为空项删除
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == '' || arr[i] == null) {
                arr.splice(i, 1);
                i = i - 1;
            }
        }
        return arr;
    }

    function screeningItem($obj, str, num) { //我创建的筛选工单
        if ($obj.hasClass("selectAll")) {
            $(".task-item").show();
            return;
        }
        var text = $obj.text();
        if (!num) {//(状态,截止日期,工单名,执行人)
            $.each($(".task-item ." + str), function (index, item) {
                var $item = $(item);
                var itemStatus = $item.text();
                if (text !== itemStatus) {
                    $item.closest(".task-item").hide();
                } else {
                    $item.closest(".task-item").show();
                }
            });
        } else {//(紧急程度 )
            var urgencyClass = $obj.attr("urgencyClass");
            $(".task-item").hide();
            $(".task-item ." + urgencyClass).closest(".task-item").show();
        }
    }

    return {
        pic_path: pic_path,
        getStatusText: getStatusText,
        updateBadge: updateBadge,
        updateNewTaskCount: updateNewTaskCount,
        getWorkflowTemplate: getWorkflowTemplate,
        inherits: inherits,
        getUserName: getUserName,
        translate: translate,
        recordTranslate: recordTranslate,
        delArrInvalidValue: delArrInvalidValue,
        screeningItem: screeningItem
    };
})();
