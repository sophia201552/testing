;(function (exports) {

    function MemberSelectedModal() {
        this.$modalWrap = null;
        this.$modal = null;

        this.callback = null;

        this.state = {};
        // 默认选中的用户
        this.state.selectedUser = [];
    }

    ~function () {

        this.show = function (callback) {
            var _this = this;
            var domWrap = document.body;

            this.callback = callback;

            // 如果之前实例化过，直接 append 到页面上
            if (this.$modalWrap) {
                this.$modalWrap.appendTo(domWrap);
                this.initModal();
                return;
            } 
            
            // 如果没有实例化过，则进行实例化操作
            WebAPI.get('/static/app/WebFactory/scripts/modals/memberSelectedModal/memberSelectedModal.html')
            .done(function (html) {
                _this.$modalWrap = $(html).appendTo(domWrap);
                _this.init();
            });
        };

        this.setState = function (state) {
            this.state = $.extend(false, this.state, state);
            return this;
        };

        this.init = function () {
            // 初始化 DOM
            this.$modal = this.$modalWrap.children('.modal');

            this.initModal();
            this.attachEvents();
        };

        this.initModal = function () {
            // 显示用户选择模态框
            beop.view.memberSelected.configModel({
                group_model: {
                    userDialogList: function () {
                        return WebAPI.get('/workflow/group/user_dialog_list/'+AppConfig.userId);
                    }
                },
                maxSelected: null,
                userHasSelected: this.state.selectedUser,
                cb_dialog_hide: this.onConfirmCallback.bind(this)
            });
            beop.view.memberSelected.init($(document.body));
        };

        this.attachEvents = function () {
            var _this = this;
            this.$modal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                _this.hide();
            });
        };

        this.reset = function () {
            this.setState({
                memberSelected: []
            });
        };

        this.onConfirmCallback = function () {
            typeof this.callback === 'function' && this.callback.apply(null, arguments);
        };

        this.hide = function () {
            this.reset();
            if (this.$modalWrap) {
                this.$modalWrap.detach();
            }
        };

    }.call(MemberSelectedModal.prototype);

    exports.MemberSelectedModal = new MemberSelectedModal();
} (window));