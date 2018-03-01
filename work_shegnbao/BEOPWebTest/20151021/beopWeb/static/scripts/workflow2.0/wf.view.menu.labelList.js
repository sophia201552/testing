(function (beop) {
        var configMap = {
                htmlURL: '',
                settable_map: {
                    tags_model: true,
                    whereComeFrom: true
                },
                tags_model: null,
                whereComeFrom: null
            },
            stateMap = {
                labelTagList: [],
                tagDataList: {
                    update: [],//更新的Tag
                    new: []//新添加的Tag
                }
            },
            jqueryMap = {},
            setJqueryMap,
            configModel,
            init,
            onToggleUl, onLabelEdit, onLabelPlus, onLabelDelete, progressData, resetTagDataList, sendDataToBack;

        setJqueryMap = function () {
            var $container = stateMap.$container;

            jqueryMap = {
                $wrapper: $("#wf-outline"),
                $wf_label_form: $("#wf-label-form"),
                $wf_label_edit: $("#wf-label-edit"),
                $wf_label_plus: $("#wf-label-plus"),
                $wf_label_icon_wrapper: $("#wf-label-icon-wrapper"),
                $container: $container
            };
        };

        configModel = function (input_map) {
            beop.util.setConfigMap({
                input_map: input_map,
                settable_map: configMap.settable_map,
                config_map: configMap
            });
            return true;
        };

        init = function ($container) {
            stateMap.$container = $container;
            setJqueryMap();
            configMap.tags_model.getUserTags().done(function (result) {
                if (result.data) {
                    stateMap.labelTagList = result.data;
                    stateMap.$container.html(beopTmpl('tpl_wf_tags_list_text', {
                        labels: stateMap.labelTagList
                    }));
                }
                jqueryMap.$wrapper.off('click.wf-label-toggle').on('click.wf-label-toggle', '#wf-label-toggle', onToggleUl);
                jqueryMap.$wrapper.off('click.wf-label-edit').on('click.wf-label-edit', '#wf-label-edit', onLabelEdit);
                jqueryMap.$wrapper.off('click.wf-label-plus').on('click.wf-label-plus', '#wf-label-plus', onLabelPlus);
                jqueryMap.$wrapper.off('click.wf-label-delete').on('click.wf-label-delete', '.wf-label-delete', onLabelDelete);
            }).fail(function (result) {

            }).always(function () {
                I18n.fillArea(jqueryMap.$container);
            });
        };

        //---------DOM操作------

        //---------方法---------
        resetTagDataList = function () {
            stateMap.tagDataList.new = [];
            stateMap.tagDataList.update = [];
        };
        //---------事件---------
        onToggleUl = function () {
            var $this = $(this);
            if ($this.hasClass("wf-tags-ul-hide")) {
                jqueryMap.$container.show();
                jqueryMap.$wf_label_icon_wrapper.show();
                $this.removeClass("wf-tags-ul-hide").addClass("wf-tags-ul-show");
            } else if ($this.hasClass("wf-tags-ul-show")) {
                jqueryMap.$container.hide();
                jqueryMap.$wf_label_icon_wrapper.hide();
                $this.removeClass("wf-tags-ul-show").addClass("wf-tags-ul-hide");
            }
        };

        onLabelEdit = function () {
            var $this = $(this);
            if ($this.hasClass("glyphicon-edit")) { //编辑标签名
                $this.removeClass("glyphicon-edit").addClass("glyphicon-ok-circle");
                jqueryMap.$wf_label_plus.show();
                stateMap.$container.html(beopTmpl('tpl_wf_tags_list_input', {
                    labels: stateMap.labelTagList
                }));
                stateMap.$container.find('input').off().on('focus', function () {
                    $(this).select();
                })
            } else { // 查看标签名
                sendDataToBack().done(function () {
                    //这里setTimeout 500 是为了防止数据库数据插入过慢
                    setTimeout(function () {
                        configMap.tags_model.getUserTags().done(function (result) {
                            if (result.data) {
                                stateMap.labelTagList = result.data;
                                stateMap.$container.html(beopTmpl('tpl_wf_tags_list_text', {
                                    labels: stateMap.labelTagList
                                }));
                            }
                        }).always(function () {
                            jqueryMap.$wf_label_plus.hide();
                            $this.removeClass("glyphicon-ok-circle").addClass("glyphicon-edit");
                            Spinner.stop();
                            I18n.fillArea(jqueryMap.$container);
                        }).fail(function () {
                            Alert.danger(ElScreenContainer, 'Edit Tags Failed').showAtTop(300);
                        })
                    }, 500)
                }).fail(function () {
                    Alert.danger(ElScreenContainer, 'Edit Tags To DATABASE Failed').showAtTop(300);
                })
            }
        };

        onLabelPlus = function () {
            jqueryMap.$container.append(beopTmpl('tpl_wf_tags_list_input_empty'));
            jqueryMap.$wf_label_form.scrollTop(3000);
            I18n.fillArea($(ElScreenContainer));
        };

        onLabelDelete = function () {
            var $this = $(this);
            Spinner.spin(jqueryMap.$container.get(0));
            if ($(this).closest(".wf-label-li").attr("labelId")) {//删除已有标签
                configMap.tags_model.deleteTag({
                    'user_id': AppConfig.userId,
                    'tag_id': $(this).closest(".wf-label-li").attr("labelId")
                }).done(function (result) {
                    if (result.data) {
                        stateMap.labelTagList = result.data;
                    }
                }).fail(function (result) {

                }).always(function () {
                    Spinner.stop();
                });
            }
            $this.closest(".wf-label-li").remove();
        };

        progressData = function () {
            Spinner.spin(jqueryMap.$container.get(0));
            jqueryMap.$wf_lable_list = jqueryMap.$container.find('li');
            var updateList = jqueryMap.$container.find("li[labeltype!='new']"),
                newTagList = jqueryMap.$container.find("li[labeltype='new']");
            resetTagDataList();
            if (newTagList.length !== 0) {
                newTagList.each(function () {
                    var $this = $(this), value = $.trim($this.find('input').val());
                    if (value !== '') {
                        stateMap.tagDataList.new.push({
                            name: value,
                            color: "#fff"
                        })
                    }
                })
            }
            updateList.each(function () {
                var $this = $(this), value = $.trim($this.find('input').val()), id = $this.attr('labelid');
                stateMap.labelTagList.forEach(function (item, index, array) {
                    if (id == $.trim(item.id)) {
                        if ($.trim(item.name) !== value) {
                            stateMap.tagDataList.update.push({
                                id: $.trim($this.attr('labelid')),
                                name: value,
                                color: "#fff"
                            })
                        }
                    }
                });
            });
        };
        sendDataToBack = function () {
            progressData();
            var UserID = AppConfig.userId;
            var updateTagsLength = stateMap.tagDataList.update.length,
                newTagsLength = stateMap.tagDataList.new.length;
            if (updateTagsLength == 0 && newTagsLength == 0) {
                return $.Deferred().resolve();
            }
            function updateTag() {
                if (updateTagsLength !== 0) {
                    configMap.tags_model.editTag({user_id: UserID}, stateMap.tagDataList.update).fail(function () {
                    })
                } else {
                    return true;
                }
            }

            function addNewTag() {
                if (newTagsLength !== 0) {
                    configMap.tags_model.addTag({user_id: UserID}, stateMap.tagDataList.new).fail(function () {

                    });
                } else {
                    return true;
                }
            }

            function merge() {
                return Array.prototype.concat.apply([], arguments);
            }

            return $.when(addNewTag(), updateTag()).done(function () {
            })
        };

        //---------Exports---------
        beop.view = beop.view || {};
        beop.view.menu_tag_list = {
            configModel: configModel,
            init: init
        };
    }(beop || (beop = {}))
);
