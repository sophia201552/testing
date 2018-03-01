(function (beop) {
    var stateMap = {
            tagList: []
        },
        jqueryMap = {},
        setJqueryMap,
        init;

    var _tagsShow, _tagEdit, _tagDelete, _tagSave, _tagAddWin, _tagAdd;


    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $wf_add_tag_win: $("#wf_add_tag_win"),
            $wf_add_tag_confirm: $("#wf_add_tag_confirm"),
            $wf_add_tag_name: $("#wf_add_tag_name"),
            $wf_team_tags_wrapper: $container.find('#wf_team_tags_wrapper'),
            $wf_team_tags_List: $container.find('#wf_team_tags_List')

        };
    };

    init = function ($box, tagList, viewType) { // viewType 为团队页面的view 类型
        stateMap.tagList = tagList;
        stateMap.$container = $box;
        setJqueryMap();
        stateMap.$container.off('click.wf-add-tags').on('click.wf-add-tags', '.wf-add-tags', _tagAddWin);
        stateMap.$container.off('click.wf-tag-delete').on('click.wf-tag-delete', '.wf-tag-delete', _tagDelete);
        stateMap.$container.off('click.wf-tag-edit').on('click.wf-tag-edit', '.wf-tag-edit', _tagEdit);
        stateMap.$container.off('click.wf-tag-save').on('click.wf-tag-save', '.wf-tag-save', _tagSave);

        jqueryMap.$wf_add_tag_confirm.off().on('click', _tagAdd);
        _tagsShow(viewType);
    };

    //---------方法---------
    _tagsShow = function (opType) { // opType - 标签的显示类型
        //jqueryMap.$container.empty().append(beopTmpl('tpl_team_default_tags'));
        setJqueryMap();
        if (opType == 'show') {
            jqueryMap.$wf_team_tags_wrapper.append(beopTmpl('tpl_team_add_tags', {
                'tags': stateMap.tagList,
                'opType': opType
            }));
        } else if (opType == 'edit') {
            jqueryMap.$wf_team_tags_wrapper.append(beopTmpl('tpl_team_add_tags', {
                'tags': stateMap.tagList,
                'opType': opType
            }));
            jqueryMap.$container.append('<span class="glyphicon glyphicon-plus-sign wf-add-tags"></span>');
        }  else if (opType == 'create') {
            jqueryMap.$container.append('<span class="glyphicon glyphicon-plus-sign wf-add-tags"></span>');
        }
    };

    //---------DOM操作------
    _tagAddWin = function () {
        jqueryMap.$wf_add_tag_name.val('');
        if (jqueryMap.$wf_team_tags_wrapper.find('.wf-tag-wrapper').length < 10) {
            jqueryMap.$wf_add_tag_win.modal();
        } else {
            alert('最多只能加十个标签');
        }
    };

    _tagAdd = function () { // 添加标签弹出框提交
        var val = jqueryMap.$wf_add_tag_name.val().trim();
        if (val !== '') {
            jqueryMap.$wf_team_tags_wrapper.append(beopTmpl('tpl_wf_add_tag', {
                'opType': 'edit',
                'name': val
            }));
            jqueryMap.$wf_add_tag_win.modal('hide');
        } else {
            alert('标签名不能为空');
        }
    };


    _tagDelete = function () {
        $(this).closest('.wf-tag-wrapper').remove();
    };

    _tagSave = function () {
        var $this = $(this), $parentsBox = $this.closest('.wf-tag-wrapper'), $name = $parentsBox.find('.wf-tag-name');
        if ($name.text().trim().length < 15) {
            $this.hide();
            $parentsBox.find('.wf-tag-edit').show();
            $parentsBox.find('.wf-tag-val').val($name.text());
            $name.attr('contenteditable', 'false').removeClass('wf-tag-name-editable');
        } else {
            alert('标签名不能超过15个字符');
        }
    };

    _tagEdit = function () {
        var $this = $(this), $parentsBox = $this.closest('.wf-tag-wrapper');
        $this.hide();
        $parentsBox.find('.wf-tag-save').show();
        $parentsBox.find('.wf-tag-name').attr('contenteditable', 'true').addClass('wf-tag-name-editable');
    };


    //---------Exports---------
    beop.view = beop.view || {};
    beop.view.teamTagsCurd = {
        init: init
    };
}(beop || (beop = {})));
