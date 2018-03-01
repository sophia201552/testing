var PointManager = (function () {
    function PointManager(projectId) {
        this.projectId = projectId;
        this.$container = null;
        this.layoutHtmlURL = '/static/scripts/dataManage/views/dm.html';
        this.htmlUrl = '';
        this.jqueryMap = {};
        this.stateMap = {};
    }

    PointManager.prototype = {
        init: function () {
            var _this = this;
            this.$ElScreenContainer = $(ElScreenContainer);
            this.$container = this.$ElScreenContainer.find('#dataManagerContainer');
            if (this.$container.length) {//如果已经加载数据管理container,不需要再加载
                return WebAPI.get(this.htmlUrl).done(function (htmlResult) {
                    _this.$container.find('.dataManagerContent').html(htmlResult);
                    _this.setJqueryMap();
                    _this.highlightMenu();
                    _this.bindEvents();
                });
            } else {
                return $.when(WebAPI.get(this.layoutHtmlURL), WebAPI.get(this.htmlUrl)).done(function (layoutHtmlResult, contentHtmlResult) {
                    _this.$ElScreenContainer.html(layoutHtmlResult[0]);
                    _this.$container = _this.$ElScreenContainer.find('#dataManagerContainer');
                    _this.$container.find('.dataManagerContent').html(contentHtmlResult[0]);
                    _this.setJqueryMap();
                    _this.makeMenu();
                    _this.highlightMenu();
                    _this.bindEvents();
                    I18n.fillArea(_this.$ElScreenContainer);
                });
            }
        },
        bindEvents: function () {
        },
        highlightMenu: function () {
            this.jqueryMap.$menuContainer.find('.page-link').removeClass('active').each(function (index, item) {
                var $item = $(item);
                if ($item.attr('href') === location.hash) {
                    $item.addClass('active');
                }
            });
        },
        makeMenu: function () {
            var _this = this;
            this.jqueryMap.$menuContainer.find('a').each(function (index, menuItem) {
                var $menuItem = $(menuItem);
                if ($menuItem.closest('#pointManagerCloudPointUl').length) {
                    $menuItem.closest('ul').find('a').removeClass('active');
                    $menuItem.closest('a').addClass('active');
                } else {
                    var href = $menuItem.attr('href');
                    if (/projectId=/.test(href)) {
                        href = href.replace(/(projectId=)([^&]?)(&?)/, '$1' + _this.projectId + '$3');
                        $menuItem.attr('href', href);
                    }
                }
            });
        },
        setJqueryMap: function () {
            var $container = this.$container;

            this.jqueryMap = {
                $container: $container,
                $pointManagerCloudPointUl: $container.find('#pointManagerCloudPointUl'),
                $pointManagerCloudPoint: $container.find('.pointManagerCloudPoint'),
                $menuContainer: $container.find('#dataManagerCloudMenu')
            };
            if (this.setPageJqueryMap) {
                this.setPageJqueryMap();
            }
        },

        setPageJqueryMap: function () {

        },
        resetData: function () {
            this.jqueryMap = {};
            this.stateMap = {};
            this.$container = null;
            this.$ElScreenContainer = null;
        },
        close: function () {
            this.resetData();
            this.detachEvents();
        },
        detachEvents: function () {

        }
    };

    return PointManager;
})();
