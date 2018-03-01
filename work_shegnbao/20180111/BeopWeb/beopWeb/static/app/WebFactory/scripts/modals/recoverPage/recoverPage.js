(function () {
    
        function RecoverPage() {
            this.$modal = null;
            this.callback = null;
        }
    
        +function () {
            this.show = function (callback) {
                var _this = this;
                var $wrap = $(document.body);
    
                this.callback = callback;
                if (this.$modal) {
                    $wrap.append(this.$modal);
                    this.$modal.modal('show');
                    return;
                }
                // 获取组件的 HTML
                WebAPI.get('/static/app/WebFactory/scripts/modals/recoverPage/recoverPage.html')
                .done(function (html) {
                    _this.$modal = $(html);
                    $wrap.append(_this.$modal);
                    _this.init();
                    _this.$modal.modal('show');
                });
    
            };
    
            this.init = function () {
                // 国际化代码
                I18n.fillArea(this.$modal);
                this.attachEvents();
            };
    
            // 事件绑定
            this.attachEvents = function () {
                var _this = this;
    
                this.$modal.off();
    
                this.$modal.on('hidden.bs.modal', function () {
                    _this.$modal.detach();
                });
    
                $('#btnOk', this.$modal).off().on('click', function () {
                    WebAPI.get('/factory/recoverPageList/' + AppConfig.project.id).done(function (rs) {
                        if (rs.status == 'OK') {
                            alert.success(I18n.resource.mainPanel.recoverPage.SUCCESS, {
                                buttons: {
                                    ok: {
                                        text: 'OK',
                                        i18n: 'common.CONFIRM',
                                        class: 'alert-button',
                                        callback: function () { window.location.reload(); }
                                    }
                                }
                            })
                        } else {
                            alert(I18n.resource.mainPanel.recoverPage.FAIL);
                        }
                    })
                });
            };

            this.close = function () {
                this.$modal.remove();
            };
    
        }.call(RecoverPage.prototype);
    
        window.RecoverPage = new RecoverPage();
    
    } ());