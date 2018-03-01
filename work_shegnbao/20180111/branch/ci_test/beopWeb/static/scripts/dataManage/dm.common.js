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
    InitI18nResource().done(function (rs) {
        if (!rs) {
            beop.tag.constants.ruleExample = {};
            return;
        }
        beop.tag.constants.ruleExample = {
            NOT_LIMIT: rs.tag.inspect.ANY_STRING, //不限定
            FIXED_STRING: rs.tag.inspect.FIXED_STRING, //固定字符串
            FIXED_NUMBER: rs.tag.inspect.FIXED_LENGTH_STRING,//固定长度数字
            VAR_NUMBER: rs.tag.inspect.NOT_FIXED_STRING //不固定长度数字
        };
    });


    beop.tag.constants.markState = {
        ALL: 0, // 全部
        MARK: 1, //标记
        NOT_MARK: 2, //未标记
        Unknown:3, //未知
        Uncertain:4 //不确定
    };

    beop.dm = beop.dm || {};
    beop.dm.constants = beop.dm.constants || {};
    beop.dm.constants.voteType = {
        UP: 1,
        DOWN: 2
    };
    if (!beop.dm.constants.EXPERT_SERVICE_URL) {
        $.ajax({
            url: "/getExpertContainerUrl",
            type: "GET",
            async: false
        }).done(function (result) {
            if (result && result.success) {
                beop.dm.constants.EXPERT_SERVICE_URL = result.data;
            }
        }).always(function () {
            if (!beop.dm.constants.EXPERT_SERVICE_URL) {
                console.error('无法获得ExpertContainerUrl');
            }
        });
    }


}(beop || (beop = {})));
