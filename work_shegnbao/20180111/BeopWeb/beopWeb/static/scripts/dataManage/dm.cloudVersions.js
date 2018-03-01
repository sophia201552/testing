(function (beop) {
    var configMap = {
            recordURL: '/static/scripts/dataManage/views/cloudVersions/cloudVersions.html',
            settable_map: {
                pointId: true,
                isReverted: true,
                clearRevetedstatus: true
            },
            pointId: null,
            isReverted: null,
            clearRevetedstatus: null
        },
        _this = this,
        stateMap = {},
        jqueryMap = {},
        init, setJqueryMap, configModel, getVersionById, attachEvents, refreshVersions, isReverted, clearRevetedstatus, initMergeUI;

    init = function ($container) {
        stateMap.$container = $container;
        setJqueryMap();
        WebAPI.get(configMap.recordURL + '?=' + new Date().getTime().toString(16)).done(function (html) {
            stateMap.$container.html(html);
            _this.oldName = $('#point_name').val();
            refreshVersions();
        })
    };

    refreshVersions = function () {
        Spinner.spin(stateMap.$container.get(0));
        WebAPI.post('/point_tool/versions/', {pointId: configMap.pointId}).done(function (result) {
            if (result.success) {
                _this.versions = result.data.reverse();
                _this.versions.map(function (item) {
                    item.id = ObjectId();
                });
                attachEvents();
                stateMap.$container.find('#version-table').html(beopTmpl('tpl_version_body', {versions: _this.versions}));
                $('.pointFormContainer').scrollTop(0);
            }
        }).always(function () {
            Spinner.stop();
        })
    };

    initMergeUI = function (value, orig2) {
        var mergeView, highlight = true;
        if (value == null) return;
        var target = document.getElementById("version-calc-content");
        target.innerHTML = "";
        mergeView = CodeMirror.MergeView(target, {
            value: value,
            origLeft: null,
            orig: orig2,
            lineNumbers: true,
            mode: {name: "python", version: 2},
            highlightDifferences: highlight,
            revertButtons: false,
            showDifferences: true,
            allowEditingOriginals: false
        });
        mergeView.edit.refresh();
        $('.CodeMirror-merge-scrolllock').hide();
        $('.CodeMirror-vscrollbar').addClass('gray-scrollbar');
        $('.CodeMirror-hscrollbar').addClass('gray-scrollbar');
    };

    attachEvents = function () {
        var $versionDetailModal = $('#versionDetailModal');
        //查看
        jqueryMap.$container.off('click.cloudDetail').on('click.cloudDetail', '.cloudDetail', function () {
            _this.versionId = $(this).data('version-id');
            _this.lastVersionId = $(this).data('last-id') || '';
            $('#versionDetailModal').modal('show');
        });
        //还原到此版本
        jqueryMap.$container.off('click.cloudRevert').on('click.cloudRevert', '.cloudRevert', function () {
            var point = getVersionById($(this).data('version-id')), opt = {};
            var time = moment(point.modify_time);
            time = time.diff(new Date(), 'days') < 5 ? time.fromNow() : time;
            confirm(I18n.resource.tag.inspect.SURE_RESTORE_VERSION.format(time), function () {
                opt.id = configMap.pointId;
                opt.flag = point.params.flag;
                opt.value = point.value;
                opt.alias = point.alias;
                if (opt.flag == 2) {
                    opt.logic = point.params.logic;
                    opt.moduleName = point.params.moduleName;
                } else if (opt.flag == 1) {
                    opt.oldName = _this.oldName;
                    opt.point_value = point.pointValue;
                } else if (opt.flag == 0) {
                    opt.mapping = point.params.mapping.point;
                }
                $.post('/point_tool/editCloudPoint/' + AppConfig.projectId + '/', opt).done(function (result) {
                    if (result.success) {
                        alert.success(I18n.resource.tag.inspect.RESTORE_VERSION.format(time));
                        _this.hasReverted = true;
                        $('#point_name').val(opt.value);
                        $('#point_notes').val(opt.alias);
                        if (opt.flag == 2) {
                            $("#codeEditor").text(opt.logic);
                            beop.view.cloudSheet.setEditorValue(opt.logic);
                        } else if (opt.flag == 1) {
                            $('#point_value').val(opt.point_value);
                        } else if (opt.flag == 0) {
                            $('#point_mapping').val(opt.mapping);
                        }
                        refreshVersions();
                    } else {
                        alert.danger(result.msg);
                    }
                })
            });
            I18n.fillArea(jqueryMap.$container);
        });

        $versionDetailModal.on('show.bs.modal', function () {

        });
        $versionDetailModal.on('hide.bs.modal', function () {
            $('#version-modal-left').empty();
            $('#version-modal-right').empty();
        });

        $versionDetailModal.on('shown.bs.modal', function () {
            var value = '', lastPoint = {}, point = {}, $versionModalRight = $('#version-modal-right'),
                $versionModalLeft = $('#version-modal-left');
            if (_this.lastVersionId) {
                lastPoint = getVersionById(_this.lastVersionId);
                $versionModalLeft.html(beopTmpl('tpl_version_modal_body', {point: $.extend(true, {isLastVersion: true}, lastPoint)}));
                value = lastPoint.params ? lastPoint.params.logic : '';
            } else {
                $versionModalLeft.empty();
            }
            point = getVersionById(_this.versionId);
            $versionModalRight.html(beopTmpl('tpl_version_modal_body', {point: $.extend(true, {isLastVersion: false}, point)}));
            if (point.params && point.params.flag && point.params.flag === 2) {
                initMergeUI(value, point.params ? point.params.logic : '');
            } else {
                $('#version-calc-content').hide();
                $('.version-body-top').css('height', '100%');
            }
            I18n.fillArea($('#dataManagerContainer'));
            if ($versionModalRight.height() > $versionModalLeft.height()) {
                $versionModalLeft.css('height', $versionModalRight.height());
            } else {
                $versionModalRight.css('height', $versionModalLeft.height());
            }
        });
    };

    isReverted = function () {
        return _this.hasReverted;
    };

    clearRevetedstatus = function () {
        _this.hasReverted = false;
    };

    getVersionById = function (id) {
        if (!id) {
            return;
        }
        for (var i = 0, iLen = _this.versions.length; i < iLen; i++) {
            if (_this.versions[i].id == id) {
                return _this.versions[i];
            }
        }
    };

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container

        }
    };

    configModel = function (input_map) {
        beop.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };
//-------Exports------
    beop.view = beop.view || {};
    beop.view.cloudRecord = {
        configModel: configModel,
        init: init,
        isReverted: isReverted,
        clearRevetedstatus: clearRevetedstatus
    };
}(beop || (beop = {})));