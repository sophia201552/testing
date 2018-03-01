(function (beop) {
    var defaultRules = [
        {type: beop.tag.constants.ruleType.NOT_LIMIT},
        {type: beop.tag.constants.ruleType.NOT_LIMIT},
        {type: beop.tag.constants.ruleType.NOT_LIMIT}
    ];

    var stateMap = {
        option: null,
        $container: null,
        rules: $.extend(true, [], defaultRules),
        currentRule: null
    }, jqueryMap = {}, setJqueryMap;

    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container
        };
    };

    var init, attachEvents,
        refreshRuleView, addRule, deleteRule, editRule, resetRule, selectRuleType,
        getRuleList, confirmRule, updateRule;

    init = function ($container, rules) {
        stateMap.$container = $container;
        stateMap.rules = rules ? rules : $.extend([], defaultRules);
        WebAPI.get("/static/scripts/dataManage/views/dm.rule.html" + '?=' + new Date().getTime()).done(function (resultHtml) {
            stateMap.$container.append(resultHtml);
            setJqueryMap();
            refreshRuleView();
            attachEvents();
        });
    };

    var setCurrentRuleItem = function ($el) {
        if (!$el) {
            stateMap.currentRule = null;
        }
        var index = $el.closest('.rule-item').attr('data-index');
        stateMap.currentRule = stateMap.rules[index];
        stateMap.currentIndex = index;
    };

    var getRuleItemElement = function () {
        return jqueryMap.$container.find('.rule-item[data-index=' + stateMap.currentIndex + ']');
    };

    refreshRuleView = function () {
        $('#ruleUl').html(beopTmpl('tpl_rule_view', {
            rules: stateMap.rules
        }));
    };

    addRule = function () {
        setCurrentRuleItem($(this));
        stateMap.rules.splice(stateMap.currentIndex, 0, {type: beop.tag.constants.ruleType.NOT_LIMIT});
        refreshRuleView();
        getRuleItemElement().addClass('flipInX');
    };

    resetRule = function () {
        stateMap.rules = $.extend(true, [], defaultRules);
        refreshRuleView();
    };

    updateRule = function (type, value) {
        stateMap.currentRule['type'] = parseInt(type);
        if (stateMap.type === beop.tag.constants.ruleType.FIXED_NUMBER || stateMap.type === beop.tag.constants.ruleType.FIXED_STRING) {
            stateMap.currentRule['value'] = value;
        } else {
            delete stateMap.currentRule.value;
        }
        stateMap.rules[stateMap.currentIndex] = stateMap.currentRule;
    };

    deleteRule = function (e) {
        e.stopPropagation();
        setCurrentRuleItem($(this));
        stateMap.rules.splice(stateMap.currentIndex, 1);
        getRuleItemElement().addClass('flipOutX').on('animationend', function () {
            refreshRuleView();
        });
    };

    selectRuleType = function () {
        var $this = $(this),
            $editValue = stateMap.$container.find('#rule-edit-value'),
            $detailRule = jqueryMap.$container.find('.detail-rule');
        if ($this.hasClass('active')) {
            return;
        }
        $this.addClass('active').siblings().removeClass('active');
        stateMap.type = parseInt($this.attr('data-value'));
        $editValue.val('');
        $editValue.removeAttr('disabled');

        switch (stateMap.type) {
            case beop.tag.constants.ruleType.NOT_LIMIT:
                $editValue.val(beop.tag.constants.ruleExample.NOT_LIMIT).attr('disabled', 'disabled');
                $detailRule.html(I18n.resource.tag.rule.RULE_DETAIL[0]).attr('title', I18n.resource.tag.rule.RULE_DETAIL[0]);
                break;
            case beop.tag.constants.ruleType.FIXED_STRING:
                $editValue.attr('placeholder', beop.tag.constants.ruleExample.FIXED_STRING);
                $detailRule.html(I18n.resource.tag.rule.RULE_DETAIL[1]).attr('title', I18n.resource.tag.rule.RULE_DETAIL[1]);
                break;
            case beop.tag.constants.ruleType.FIXED_NUMBER:
                $editValue.attr('placeholder', beop.tag.constants.ruleExample.FIXED_NUMBER);
                $detailRule.html(I18n.resource.tag.rule.RULE_DETAIL[2]).attr('title', I18n.resource.tag.rule.RULE_DETAIL[2]);
                break;
            case beop.tag.constants.ruleType.VAR_NUMBER:
                $editValue.val(beop.tag.constants.ruleExample.VAR_NUMBER).attr('disabled', 'disabled');
                $detailRule.html(I18n.resource.tag.rule.RULE_DETAIL[3]).attr('title', I18n.resource.tag.rule.RULE_DETAIL[3]);
                break;
        }
    };

    editRule = function () {
        setCurrentRuleItem($(this));
        jqueryMap.$container.find('#tag_rule_edit').modal();
        jqueryMap.$container.find('.rule-type[data-value=' + stateMap.currentRule.type + ']').addClass('active').siblings().removeClass('active');
        stateMap.type = stateMap.currentRule.type;

        var $ruleValue = jqueryMap.$container.find('#rule-edit-value');
        var $detailRule = jqueryMap.$container.find('.detail-rule');
        switch (stateMap.currentRule.type) {
            case beop.tag.constants.ruleType.NOT_LIMIT:
                $ruleValue.attr('disabled', 'disabled').val(beop.tag.constants.ruleExample.NOT_LIMIT);
                $detailRule.html(I18n.resource.tag.rule.RULE_DETAIL[0]).attr('title', I18n.resource.tag.rule.RULE_DETAIL[0]);
                break;
            case beop.tag.constants.ruleType.VAR_NUMBER:
                $ruleValue.attr('disabled', 'disabled').val(beop.tag.constants.ruleExample.VAR_NUMBER);
                $detailRule.html(I18n.resource.tag.rule.RULE_DETAIL[3]).attr('title',I18n.resource.tag.rule.RULE_DETAIL[3]);
                break;
            case beop.tag.constants.ruleType.FIXED_NUMBER:
                $ruleValue.removeAttr('disabled').val(stateMap.currentRule.value);
                $detailRule.html(I18n.resource.tag.rule.RULE_DETAIL[2]).attr('title',I18n.resource.tag.rule.RULE_DETAIL[2]);
                break;
            case beop.tag.constants.ruleType.FIXED_STRING:
                $ruleValue.removeAttr('disabled').val(stateMap.currentRule.value);
                $detailRule.html(I18n.resource.tag.rule.RULE_DETAIL[1]).attr('title',I18n.resource.tag.rule.RULE_DETAIL[1]);
                break;
        }
        I18n.fillArea(jqueryMap.$container);
    };

    confirmRule = function () {
        var $editValue = stateMap.$container.find('#rule-edit-value');
        if (!$editValue.val()) {
            alert.danger('规则输入内容不能为空');
            return;
        }
        if (stateMap.type === beop.tag.constants.ruleType.FIXED_NUMBER) {
            if (!/^[0-9]+$/.test($editValue.val())) {
                alert.danger('请输入正确的数字');
                return;
            }
        }
        getRuleItemElement().css('background', '#0077ee');

        updateRule(jqueryMap.$container.find('.rule-type.active').attr('data-value'), $editValue.val());

        refreshRuleView();
        jqueryMap.$container.find('#tag_rule_edit').modal('hide');
    };

    getRuleList = function () {
        return stateMap.rules;
    };

    var getRulesString = function () {
        var rulesCondition = [];
        for (var i = 0; i < stateMap.rules.length; i++) {
            if (stateMap.rules[i].type == beop.tag.constants.ruleType.NOT_LIMIT) {
                rulesCondition.push(beop.tag.constants.ruleExample.NOT_LIMIT);
            } else if (stateMap.rules[i].type == beop.tag.constants.ruleType.VAR_NUMBER) {
                rulesCondition.push(beop.tag.constants.ruleExample.VAR_NUMBER);
            } else if (stateMap.rules[i].type == beop.tag.constants.ruleType.FIXED_NUMBER) {
                rulesCondition.push(stateMap.rules[i].value + '位数字');
            } else {
                rulesCondition.push(stateMap.rules[i].value);
            }
        }
        return rulesCondition;
    };

    attachEvents = function () {
        stateMap.$container.off('click.rule-add').on('click.rule-add', '.rule-add', addRule);
        stateMap.$container.off('click.rule-delete').on('click.rule-delete', '.rule-delete', deleteRule);
        stateMap.$container.off('click.rule-edit').on('click.rule-edit', '.rule-edit', editRule);
        stateMap.$container.off('click.rule-type').on('click.rule-type', '.rule-type', selectRuleType);
        stateMap.$container.off('click.rule-confirm').on('click.rule-confirm', '#rule-confirm', confirmRule);
    };

//---------Exports---------
    beop.tag = beop.tag || {};

    beop.tag.rule = {
        init: init,
        reset: resetRule,
        getRuleList: getRuleList,
        getRulesString: getRulesString
    };
}(beop || (beop = {})));
