(function (beop) {
    //公用
    var stateMap = {};

    //region ---------------------------------- dmModel start ----------------------------------
    var insertTaskReply, getTaskReply, setPointId, deleteTaskReply, getPointId, getTagIcons, setFeedbackId;

    var tagIcons, hasEquipment;
    var dmModel = (function () {
        getTaskReply = function () {
            return WebAPI.post('/point_tool/comments/', {"pointId": stateMap.pointId});
        };
        insertTaskReply = function (detail) {
            if (!detail.hasOwnProperty("pointId")) {
                detail["pointId"] = stateMap.pointId;
            }
            return WebAPI.post('/point_tool/comments/add/', detail);
        };
        setPointId = function (pointId) {
            stateMap.pointId = pointId;
        };
        deleteTaskReply = function (model) {
            return WebAPI.post('/point_tool/comments/delete/', model);
        };
        getPointId = function () {
            return stateMap.pointId;
        };
        getTagIcons = function () {
            if (!tagIcons) {
                $.ajax({
                    url: '/tag/equipmentIcons',
                    type: 'GET',
                    async: false
                }).done(function (result) {
                    if (result && result.success) {
                        tagIcons = result.data;
                    }
                });
            }

            return tagIcons;
        };

        hasEquipment = function (tags) {
            if (!tags || !tags.length) {
                return;
            }
            var equipments = beop.tag.panel.getTagsByType('Equipment');
            var equipmentsMap = {};
            for (var i = 0; i < equipments.length; i++) {
                var equipment = equipments[i];
                equipmentsMap[equipment.name] = equipment;
            }

            for (var j = 0; j < tags.length; j++) {
                var tag = tags[j];
                if (equipmentsMap[tag]) {
                    return equipmentsMap[tag];
                }
            }
        };
        return {
            getTaskReply: getTaskReply,
            insertTaskReply: insertTaskReply,
            deleteTaskReply: deleteTaskReply,
            setPointId: setPointId,
            getPointId: getPointId,
            getTagIcons: getTagIcons,
            hasEquipment: hasEquipment
        }
    })();

    var fdModel = (function () {
        getTaskReply = function () {
            return WebAPI.get('/workflow/task/comment/get/' + stateMap.feedbackId);
        };
        insertTaskReply = function (detail) {
            if (!detail.hasOwnProperty("pointId")) {
                detail["taskId"] = stateMap.feedbackId;
            }
            return WebAPI.post('/workflow/task/comment/add', detail);
        };
        setFeedbackId = function (feedbackId) {
            stateMap.feedbackId = feedbackId;
        };

        return {
            getTaskReply: getTaskReply,
            insertTaskReply: insertTaskReply,
            setFeedbackId: setFeedbackId
        }
    })();

    //endregion ---------------------------------- dmModel end ----------------------------------
    beop.model = beop.model ? beop.model : {};
    $.extend(beop.model, {
        dmModel: dmModel,
        fdModel: fdModel
    })
})
(beop || (beop = {}));