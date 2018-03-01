var AllMessages = (function () {
    'use strict';
    function AllMessages() {
        this._configMap = {
            url: "static/views/admin/allMessages.html"
        };

        //这些type需要和接口同步
        this._messageTypeList = ["notRead", "read", "all"];
        this._messageSubTypeList = ["all", "diagnosis", "workflow", "versionHistory"];

        this.state = {
            messageType: "all",
            messageSubType: "all",
            messageTotalCount: 0,
            pageSize: 15,
            pageNumber: 1
        };

        this._jqueryMap = {};

        this._apiMap = {
            queryMessageApi: "/message/api/v1/queryUserMessage",
            markAsReadApi: "/message/api/v1/markAsRead",
            deleteMsgApi: "/message/api/v1/deleteUserMsg"
        };
    }

    AllMessages.prototype = {
        show: function () {
            $(".infoBoxMessage").hide();
            Spinner.spin(ElScreenContainer);
            WebAPI.get(this._configMap.url + '?t=' + new Date().getTime()).done(function (resultHtml) {
                $(ElScreenContainer).html(resultHtml);
                this._init();
                I18n.fillArea(this._jqueryMap.$container);
            }.bind(this));
        },
        set messageType(type) {
            if (!type) {
                throw new SyntaxError("message Type isn\'t defined")
            }
            if (this._messageTypeList.indexOf(type) == -1) {
                throw new Error("message Type isn\'t supposed" + type)
            } else {
                this.state.messageType = type;
            }
        },
        get messageType() {
            return this.state.messageType;
        },
        set messageSubType(subType) {
            if (!subType) {
                throw new SyntaxError("message subType isn\'t defined")
            }
            if (this._messageSubTypeList.indexOf(subType) == -1) {
                throw new Error("message Type isn\'t supposed" + subType)
            } else {
                this.state.messageSubType = subType;
            }
        },
        get messageSubType() {
            return this.state.messageSubType;
        },
        _init: function () {
            this._setJqueryMap();
            this._attachEvent();
            this._fetchMessageData();
        },
        _setJqueryMap: function () {
            var $container = $("#all_messages_box");
            var $messageTableContainer = $container.find("#message-list-container");
            this._jqueryMap = {
                $container: $container,
                $leftContainer: $container.find('.nav-bar-list'),
                $rightContainer: $container.find('.allMessage-body'),
                $paginationContainer: $container.find('.pagination-container'),
                $messageTableContainer: $messageTableContainer,
                messageTableContainer: $messageTableContainer.get(0)
            }
        },
        /**
         * 获取数据统一接口
         * @private
         */
        _fetchMessageData: function () {

            //var {queryMessageApi}=this._apiMap;
            //var {pageSize,pageNumber,messageType,messageSubType}=this.state;
            Spinner.spin(this._jqueryMap.messageTableContainer);
            return WebAPI.post(this._apiMap.queryMessageApi, {
                limit: this.state.pageSize,
                page: this.state.pageNumber,
                type: this.state.messageType,
                tags: this.state.messageSubType
            }).done(function (result) {

                this.state.messageTotalCount = result.data.totalCount;

                //刷新消息列表
                this._renderMessageList(result.data.message);
                //更新页面state
                this._refreshDOMMessageTypeState();

                //生成翻页插件
                if (result.data.totalCount) {
                    this._jqueryMap.$paginationContainer = this._jqueryMap.$container.find('.pagination-container');
                    this._initTwbsPagination();
                }
            }.bind(this)).fail(function () {

                alert("get message data failed.");

            }).always(function () {
                Spinner.stop();
            });
        },
        /**
         * 刷新页面上的状态
         * @private
         */
        _refreshDOMMessageTypeState: function () {
            var self = this;
            //设置一级菜单 active
            this._jqueryMap.$leftContainer.find("a.switch-msg-type").removeClass('active').each(function () {
                if ($(this).attr("data-msg-type") == self.state.messageType) {
                    $(this).addClass("active");
                }
            });

            //设置二级菜单active
            this._jqueryMap.$rightContainer.find("a.switch-msg-type").removeClass('active').each(function () {
                if ($(this).attr("data-msg-sub-type") == self.state.messageSubType) {
                    $(this).addClass("active");
                }
            });

            //设置消息数量
        },
        /**
         * 事件绑定
         * @private
         */
        _attachEvent: function () {
            var self = this, $span = $('.allMessage-navBar-transform').find('span');

            //打开关闭侧导航
            this._jqueryMap.$container.off('click.navBarTransform').on('click.navBarTransform', '.allMessage-navBar-transform', function () {
                self._jqueryMap.$container.toggleClass('message-navBar-hidden');
                $span.toggleClass("glyphicon-chevron-left").toggleClass("glyphicon-chevron-right");
            });

            // 全部的切换事件
            this._jqueryMap.$container.off('click.changeMessageType').on('click.changeMessageType', 'a.switch-msg-type', function () {
                //设置消息的类型
                var $this = $(this);
                if ($this.hasClass("active")) {
                    return false;
                }
                var messageType = $this.attr('data-msg-type');
                var messageSubType = $this.attr("data-msg-sub-type");

                messageSubType && (self.messageSubType = messageSubType);
                messageType && ( self.messageType = messageType, self.messageSubType = "all");

                self.state.pageNumber = 1;
                self._fetchMessageData();
            });

            //checkbox prop
            this._jqueryMap.$rightContainer.off('change.message-check').on('change.message-check', '.message-check', function () {
                var $this = $(this), isChecked = $this.is(":checked");
                var $checked = self._jqueryMap.$rightContainer.find("input.message-check-item:checked"), $allCheck = self._jqueryMap.$rightContainer.find("input.message-check-item");

                if ($this.hasClass("message-check-all")) {
                    self._jqueryMap.$rightContainer.find("input.message-check").prop("checked", isChecked)
                } else {
                    if ($checked.length < $allCheck.length) {
                        self._jqueryMap.$rightContainer.find("input.message-check-all").prop('checked', false);
                    } else if ($checked.length == $allCheck.length) {
                        self._jqueryMap.$rightContainer.find("input.message-check-all").prop('checked', true);
                    }
                }
            });

            var getCheckedMsgIdList = function () {
                var msgIdList = [];
                self._jqueryMap.$rightContainer.find("input.message-check-item:checked").each(function () {
                    var $parentTR = $(this).closest('tr');
                    msgIdList.push($parentTR.attr("data-user-msg-id"));
                });
                return msgIdList;
            };

            //删除消息
            this._jqueryMap.$rightContainer.off('click.msg-delete').on('click.msg-delete', '.msg-delete', function () {
                Spinner.spin(self._jqueryMap.messageTableContainer);
                WebAPI.post(self._apiMap.deleteMsgApi, {
                    msgIdList: getCheckedMsgIdList()
                }).done(function () {
                    self._fetchMessageData();
                }).always(function () {
                    Spinner.stop();
                })
            });

            //标记已读
            this._jqueryMap.$rightContainer.off('click.msg-mark-as-read').on('click.msg-mark-as-read', '.msg-mark-as-read', function () {
                Spinner.spin(self._jqueryMap.messageTableContainer);
                WebAPI.post(self._apiMap.markAsReadApi, {
                    msgIdList: getCheckedMsgIdList()
                }).done(function () {
                    self._fetchMessageData();
                }).always(function () {
                    Spinner.stop();
                })
            });
        },
        /**
         * 生成翻页插件
         * @private
         */
        _initTwbsPagination: function () {
            var paginationOpts = {
                first: '&laquo;&laquo',
                prev: '&laquo;',
                next: '&raquo;',
                last: '&raquo;&raquo;',
                startPage: this.state.pageNumber,
                totalPages: Math.ceil(this.state.messageTotalCount / this.state.pageSize),
                onPageClick: this._paginationNextPageCb.bind(this)
            };
            this._jqueryMap.$paginationContainer.twbsPagination(paginationOpts);
        },
        /**
         *翻页插件回调
         * @private
         */
        _paginationNextPageCb: function (event, page) {
            this.state.pageNumber = page;
            this._fetchMessageData();
        },
        /**
         * 重新渲染消息表格
         * @param data
         * @private
         */
        _renderMessageList: function (data) {
            this._jqueryMap.$messageTableContainer.empty().html(beopTmpl('tpl_message_table_list', {
                'messageList': data
            }))
        }
    };
    return AllMessages;
})();