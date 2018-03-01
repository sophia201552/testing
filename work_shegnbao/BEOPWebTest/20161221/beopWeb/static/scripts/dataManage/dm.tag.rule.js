(function (beop) {
    var defaultList = [{
            type: beop.tag.constants.ruleType.NOT_LIMIT// 1:字符串 , 2: 数字, 3:　不限定
        },
        {
            type: beop.tag.constants.ruleType.NOT_LIMIT
        },
        {
            type: beop.tag.constants.ruleType.NOT_LIMIT
        }
    ];

    var defaultOption = {
        list: defaultList,
        defaultList: defaultList
    };

    var stateMap = {
        option: null,
        $container: null
    };

    var init, attachEvents,
        isShowRuleBtn, refreshRuleView, ruleAdd, ruleRemove, ruleEdit, ruleReset,
        renderIndex,
        getRuleList;

    init = function ($container, option) {
        stateMap.$container = $container;
        stateMap.option = option ? $.extend({}, defaultOption, option) : defaultOption;
        WebAPI.get("/static/scripts/dataManage/views/dm.rule.html" + '?=' + new Date().getTime()).done(function (resultHtml) {
            stateMap.$container.append(resultHtml);
            refreshRuleView();
            attachEvents();
        });
    };

    refreshRuleView = function () {
        $('#ruleUl').html(beopTmpl('tpl_rule_view', {
            'list': stateMap.option.list
        }));
    };

    isShowRuleBtn = function () {
        var $this = $(this);
        if ($this.find('.rule-add').is(':visible')) {
            $this.removeClass('active');
        } else {
            $this.addClass('active');
        }
    };

    renderIndex = function () {
        stateMap.$container.find('.rule-num').each(function (index, element) {
            $(this).text(index + 1);
        });
    };

    ruleAdd = function () {
        var $this = $(this),
            index = stateMap.$container.find('.rule-li').index($this.closest('.rule-li'));
        stateMap.$container.find('.rule-li').eq(index).after(beopTmpl('tpl_rule_view_add'));
        renderIndex();
    };

    ruleReset = function () {
        stateMap.option.list = defaultOption.defaultList;
        refreshRuleView();
    };

    ruleRemove = function () {
        $(this).closest('.rule-li').remove();
        renderIndex();
    };

    ruleEdit = function () {
        var $this = $(this),
            val = parseInt($(this).val()),
            $li = $this.closest('.rule-li');

        if ($this.hasClass('rule-type')) {
            if (val == 3) { // 1:字符串 , 2: 数字, 3:　不限定
                $li.find('.length-type').remove().end().find('.rule-value').remove();
            } else {
                if (!$li.find('.length-type').length) {
                    $li.append(beopTmpl('tpl_rule_view_add_group'));
                }
                $li.find('.rule-value').val('');
            }
        } else if ($this.hasClass('length-type')) {
            if (val == 1) { // 1:定长, 2:不定长  tpl_rule_view_add_input
                $li.append(beopTmpl('tpl_rule_view_add_input'));
            } else if (val == 2) {
                $li.find('.rule-value').remove();
            }
        }
    };

    getRuleList = function () {
        var sendRuleList = [];
        stateMap.$container.find('.rule-li').each(function (index, element) {
            var ruleMap = {},
                $element = $(element);
            ruleMap.type = parseInt($element.find('.rule-type').val());
            if ($element.find('.length-type').length) {
                ruleMap.lengthType = parseInt($element.find('.length-type').val());
            }
            if ($element.find('.rule-value').length) {
                ruleMap.value = $element.find('.rule-value').val();
            }
            sendRuleList.push(ruleMap);
        });
        return sendRuleList;
    };

    attachEvents = function () {
        stateMap.$container.off('mouseover.rule-index').on('mouseover.rule-index', '.rule-index', isShowRuleBtn);
        stateMap.$container.off('mouseout.rule-index').on('mouseout.rule-index', '.rule-index', isShowRuleBtn);
        stateMap.$container.off('click.rule-add').on('click.rule-add', '.rule-add', ruleAdd);
        stateMap.$container.off('click.rule-remove').on('click.rule-remove', '.rule-remove', ruleRemove);
        stateMap.$container.off('change.rule-type').on('change.rule-type', '.rule-type', ruleEdit);
        stateMap.$container.off('change.length-type').on('change.length-type', '.length-type', ruleEdit);
    };

//---------Exports---------
    beop.tag = beop.tag || {};

    beop.tag.rule = {
        init: init,
        reset: ruleReset,
        getRuleList: getRuleList
    };
}(beop || (beop = {})));
