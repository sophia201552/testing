(function (beop) {

    //---------Exports---------
    beop.tag = beop.tag || {};
    beop.tag.constants = beop.tag.constants || {};

    /**
     * Tag页面类型
     * @type {{CREATE: string, DETAIL: string, EDIT: string}}
     */
    beop.tag.constants.viewType = {
        CREATE: 'CREATE',
        DETAIL: 'DETAIL',
        EDIT: 'EDIT'
    };

    /**
     * TAG规则类型
     * @type {{NOT_LIMIT: number, FIXED_STRING: number, FIXED_NUMBER: number, VAR_NUMBER: number}}
     */
    beop.tag.constants.ruleType = {
        NOT_LIMIT: 1, //不限定
        FIXED_STRING: 2, //固定字符串
        FIXED_NUMBER: 3,//固定长度数字
        VAR_NUMBER: 4//不固定长度数字
    };
    /***
     * TAG 规则类型示例
     * @type {{NOT_LIMIT: number, FIXED_STRING: number, FIXED_NUMBER: number, VAR_NUMBER: number}}
     */
    beop.tag.constants.ruleExample = {
        NOT_LIMIT: '任意字符串', //不限定
        FIXED_STRING: 'rule', //固定字符串
        FIXED_NUMBER: '固定长度数字',//固定长度数字
        VAR_NUMBER: '不固定长度数字' //不固定长度数字
    };

}(beop || (beop = {})));
