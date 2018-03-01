;(function (exports) {

    function MemberSelectedModal() {
        this.$modalWrap = null;
        this.$modal = null;

        this.callback = null;

        this.state = {};
        // 默认选中的用户
        this.state.selectedUser = [];

        this.emailRegex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
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
            var _this = this;
            WebAPI.post('/admin/memberSelected/', {
                userId: AppConfig.userId,
                userList: _this.state.selectedUser.map(function (item) {
                    return item.id
                })
            }).done(function (rs) {
                if (rs.success) {
                    // 显示用户选择模态框
                    beop.view.memberSelected.init($(document.body), {
                        configModel: {
                            userMemberMap: rs.data,
                            userHasSelected: _this.state.selectedUser,
                            cb_dialog_hide: _this.onConfirmCallback.bind(_this),
                            maxSelected: null
                        }
                    });
                }
            });
        };

        this.attachEvents = function () {
            var _this = this;
            this.$modal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                _this.hide();
            });

            $('#addPersonPower').off('click').click(function () {
                var inputText = $('#input-search-name').val();
                inputText = inputText ? inputText.trim() : inputText;
                if (!inputText || !_this.emailRegex.test(inputText)) {
                    alert('invalid input text.')
                }
                WebAPI.post('/admin/select/searchUseId', {userEmail:inputText}).done(function (rs) {
                    if (rs.success && rs.data) {
                        beop.view.memberSelected.addMember(rs.data).renderCheckedUsers();
                    } else {
                        alert('The email is not exist.')
                    }
                });

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
}(window));