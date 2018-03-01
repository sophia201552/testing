+function ($) {

    var useBuffer = true;

    // 不使用缓冲区
    !useBuffer && function () {
        this.analysis = this.analysis || {};

        //////////////////////////
        // WorkspaceModel Class //
        //////////////////////////
        function WorkspaceModel() {}

        +function () {
            this.create = function (data) {
                var params;
                var promise;
                // 如果不是模板
                // 或是需要保留副本的模板
                if( !data.templateId ) {
                    // 若不为模板
                    params = {
                        workspaceName: data.name,
                        modalList: data.modalList || [],
                        modifyTime: data.modifyTime,
                        modal: {
                            option: {},
                            imagebin: ''
                        }
                    };
                    promise = WebAPI.post('/analysis/modal/save/'+AppConfig.userId, params);
                }
                // 如果是不需要保留副本的模板
                else {
                    params = {
                        workspaceName: data.name,
                        templateId: data.templateId
                    };
                    promise = WebAPI.post('/analysis/template/apply/'+AppConfig.userId, params);
                }

                return promise;
            };

            this.update = function (data) {
                return WebAPI.post('/analysis/modal/save/' + AppConfig.userId, {
                    workspaceId: data.id,
                    workspaceName: data.name
                });
            };

            this.read = function () {

            };

            this.delete = function (wsId) {
                return WebAPI.get('/analysis/workspace/remove/'+ AppConfig.userId +'/' + wsId + '/0');
            };

        }.call(WorkspaceModel.prototype);
        
        /////////////////////////
        // TemplateModel Class //
        /////////////////////////
        function TemplateModel() {}

        +function () {
            this.create = function (data) {
                return WebAPI.post('/analysis/template/create/'+AppConfig.userId, {
                    templateName: data.name,
                    projectId: AppConfig.userId === 1 ? '' : AppConfig.projectId
                });
            };

            this.update = function (data) {
                return WebAPI.post('/analysis/modal/save/' + AppConfig.userId, {
                    templateId: data.id,
                    templateName: data.name
                });
            };

            this.read = function () {

            };

            this.delete = function (tplId) {
                return WebAPI.get('/analysis/workspace/remove/' + AppConfig.userId + '/' + tplId + '/1');
            };
        }.call(TemplateModel.prototype);

        //////////////////////
        // ModalModel class //
        //////////////////////
        function ModalModel() {}

        +function () {
            this.create = function () {

            };

            this.update = function (data, ws) {
                if(!ws.templateId) {
                    params = {
                        workspaceId: ws.id,
                        workspaceName: ws.name,
                        modal: data
                    };
                } else {
                    params = {
                        templateId: ws.templateId,
                        modal: data
                    };
                }

                return WebAPI.post('/analysis/modal/save/' + AppConfig.userId, params);
            };

            this.read = function () {

            };

            this.delete = function () {

            };
        }.call(ModalModel.prototype);
        

        // exports
        this.analysis.models = {
            WorkspaceModel: WorkspaceModel,
            TemplateModel: TemplateModel,
            ModalModel: ModalModel
        }

    }.call(this, window.Beop.cache.buffer);


    // 使用缓冲区
    useBuffer && function (buffer) {
        this.analysis = this.analysis || {};

        //////////////////////////
        // WorkspaceModel Class //
        //////////////////////////
        function WorkspaceModel() {}

        +function () {
            this.create = function (data) {
                var params;

                // 如果不是模板
                // 或是需要保留副本的模板
                if( !data.templateId ) {
                    // 若不为模板
                    params = {
                        id: data.id,
                        name: data.name,
                        modalList: data.modalList || [],
                        modifyTime: data.modifyTime
                    };

                    // 去除 modalList 数组的监控属性
                    params = $.extend(false, params, {modalList: params.modalList.concat()});
                    // 清除 __observeProps 属性
                    params.modalList = params.modalList.map(function (row) {
                        var newRow = $.extend(false, row, {});
                        delete newRow['__observeProps'];
                        return newRow;
                    });
                }
                // 如果是不需要保留副本的模板
                else {
                    params = {
                        id: data.id,
                        templateId: data.templateId,
                        name: data.name,
                        modifyTime: data.modifyTime,
                        modalList: []
                    };
                }

                if(data['dsOwnerId'] !== undefined) {
                    params['dsOwnerId'] = data['dsOwnerId'];
                }
                
                return buffer.addWsCreateOp(params);
            };

            this.update = function (data) {
                return buffer.addWsUpdateOp({
                    id: data.id,
                    name: data.name,
                    modifyTime: data.modifyTime
                });
            };

            this.read = function () {

            };

            this.delete = function (wsId) {
                return buffer.addWsDeleteOp({
                    id: wsId
                });
            };

        }.call(WorkspaceModel.prototype);

        /////////////////////////
        // TemplateModel Class //
        /////////////////////////
        function TemplateModel() {}

        +function () {
            this.create = function (data) {
                var params;
                params = {
                    id: data.id,
                    name: data.name,
                    modalList: data.modalList || [],
                    creatorId: data.creatorId,
                    projectId: data.projectId,
                    modifyTime: data.modifyTime
                };

                // 去除 modalList 数组的监控属性
                params = $.extend(false, params, {modalList: params.modalList.concat()});

                return buffer.addWsCreateOp(params, 'tpl');
            };

            this.update = function (data) {
                return buffer.addWsUpdateOp({
                    id: data.id,
                    name: data.name,
                    modifyTime: data.modifyTime
                }, 'tpl');
            };

            this.read = function () {

            };

            this.delete = function (tplId) {
                return buffer.addWsDeleteOp({
                    id: tplId
                }, 'tpl');
            };
        }.call(TemplateModel.prototype);

        //////////////////////
        // ModalModel class //
        //////////////////////
        function ModalModel() {}

        +function () {
            this.create = function (modal, id, type) {
                var params = {};
                params.id = modal.id;
                params.modifyTime = modal.modifyTime;
                params.type = modal.type;
                params.op = 'create';
                modal.note !== undefined && (params.note = modal.note);
                modal.option !== undefined && (params.option = modal.option);
                modal.name !== undefined && (params.name = modal.name);
                modal.imagebin !== undefined && (params.imagebin = modal.imagebin);

                return buffer.addModalCreateOp(params, id, type);
            };

            this.update = function (modal, id, type) {
                var params = {};
                params.id = modal.id;
                params.modifyTime = modal.modifyTime;
                params.type = modal.type;
                params.op = 'update';
                modal.note !== undefined && (params.note = modal.note);
                modal.option !== undefined && (params.option = modal.option);
                modal.name !== undefined && (params.name = modal.name);
                modal.imagebin !== undefined && (params.imagebin = modal.imagebin);

                return buffer.addModalUpdateOp(params, id, type);
            };

            this.read = function () {};

            this.delete = function (modalId, id, type) {
                return buffer.addModalDeleteOp(modalId, id, type);
            };
        }.call(ModalModel.prototype);

        // exports
        this.analysis.models = {
            WorkspaceModel: WorkspaceModel,
            TemplateModel: TemplateModel,
            ModalModel: ModalModel
        };
    }.call(this, window.Beop.cache.buffer);

}.call(this, jQuery);