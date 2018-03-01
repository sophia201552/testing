(function (beop) {

    //---------Exports---------
    beop.tag = beop.tag || {};
    beop.tag.constants = beop.tag.constants || {};

    beop.tag.constants.viewType = {
        CREATE: 'CREATE',
        DETAIL: 'DETAIL',
        EDIT: 'EDIT'
    };

    beop.tag.constants.ruleType = {
        STRING: 1,
        NUMBER: 2,
        NOT_LIMIT: 3
    };

    beop.tag.constants.ruleValueLength = {
        FIXED: 1,
        NOT_FIXED: 2
    }


}(beop || (beop = {})));
