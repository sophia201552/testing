(function () {

    function ImportProjectModal() {
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
            WebAPI.get('/static/app/WebFactory/scripts/modals/importProjectModal/importProjectModal.html')
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

            // 初始化项目列表
            this.initProjectList();
            this.attachEvents();

            $('#selProjectList', this.$modal).trigger('change');
        };

        this.initProjectList = function () {
            var arrHtml = AppConfig.projectList.map(function (project) {
                return '<option value="'+project.id+'">'+project['name_'+(I18n.type === 'zh' ? 'cn' : I18n.type)]+'</option>';
            });
            $('#selProjectList', this.$modal).empty().html(arrHtml.join(''));
        };

        // 事件绑定
        this.attachEvents = function () {
            var _this = this;

            this.$modal.off();

            this.$modal.on('hidden.bs.modal', function () {
                _this.reset();
                _this.$modal.detach();
            });

            $('#btnSubmit', this.$modal).off().on('click', function () {
                var data = _this.getFormData();
                var $this = $(this);

                if (!data.iptNewProjectName.trim()) {
                    alert('新的项目名称不能为空！');
                    return;
                }

                $this.prop('disabled', true);

                WebAPI.post('/factory/importOnlineProject', {
                    projectId: data['selectedProject'],
                    newProjName: data['iptNewProjectName'],
                    userId: AppConfig.userId
                }).done(function (rs) {
                    if (rs.status === 'OK') {
                        _this.$modal.modal('hide');
                        typeof _this.callback === 'function' && _this.callback(rs.data);
                        MergeNavModal.show(data['selectedProject'], rs.id);
                    }
                    else if (rs.status === 'Duplicated') {
                        _this.$modal.modal('hide');
                        if(rs.permission === 0){
                            alert('The project is authorized by'+ rs.username.join(' ') +',please contact him for access before doing project importing！');
                        }else{
                            MergeNavModal.show(data['selectedProject'], rs.id);
                        }
                    }
                    else {
                        alert(rs.msg);
                    }
                }).always(function () {
                    $this.prop('disabled', false);
                });
            });

            $('#selProjectList', this.$modal).off().on('change', function () {
                var title = $(this).children('[value="'+this.value+'"]')[0].innerHTML;
                $('#iptNewProjectName').val(title || '');
            });
        };

        this.getFormData = function () {
            var data = {};
            
            $('#formProject', this.$modal).serializeArray().forEach(function (row) {
                data[row.name] = row.value;
            });

            return data;
        };

        // 重置组件状态
        this.reset = function () {
            var $selProjectList = $('#selProjectList', this.$modal);

            $selProjectList.val($('option:first', $selProjectList).val());
        };

        this.close = function () {
            this.$modal.remove();
        };

    }.call(ImportProjectModal.prototype);

    window.ImportProjectModal = new ImportProjectModal();

} ());