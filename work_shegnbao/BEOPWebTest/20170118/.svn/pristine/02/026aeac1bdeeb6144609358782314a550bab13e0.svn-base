(function () {
    var _this;
    function HistoryPanel(screen) {
        _this = this;
        this.screen = screen;
        this.container = screen.historyPanelCtn;
        this.store = undefined;
        this.painter = this.screen.painter;
        this.historyList = new window.ModelSet();
        this.historyController = screen.historyController;
    }

    HistoryPanel.prototype.historyTools = [
        {id: 'delHistory', name: 'delete', icon: 'glyphicon glyphicon-trash', iconType: 1},
        {id: 'addSnap', name: 'create', icon: 'glyphicon glyphicon-camera', iconType: 1}
    ];

    //对historyRecordManager的数据监听
    HistoryPanel.prototype.init = function () {
        this.historyController.store.records.addEventListener('insert', this.bindHistoryRecordModelInsert, this);
        this.historyController.store.records.addEventListener('remove', this.bindHistoryRecordModelRemove, this);
        this.historyController.state.addEventListener('update.index', this.bindStateUpdate, this);

        this.historyController.store.snapshotModelSet.addEventListener('insert', this.bindSnapshotModelInsert, this);
        this.historyController.store.snapshotModelSet.addEventListener('remove', this.bindSnapshotModelRemove, this);
    };

    HistoryPanel.prototype.show = function () {
        this.$snapshotList = undefined;
        this.$historyList = undefined;
        $(this.container).empty();
        var $ul = $('<ul id="recordList" class="list-unstyled"></ul>');
        $ul.append('<li><ul id="snapList" class="list-unstyled"></ul></li>');
        $ul.append('<li><ul id="historyList" class="list-unstyled"></ul></li>');

        $(this.container).html($ul);

        this.$snapshotList = $('#snapList', this.container);
        this.$historyList = $('#historyList', this.container);
        this.init();
        this.initTools();

        for(var i = 0; i < this.historyController.store.records.length(); i++){
            this.renderHistoryRecordModel(this.historyController.store.records.models[i]);
        }

        for(var i = 0; i < this.historyController.store.snapshotModelSet.models.length; i++){
            this.renderSnapshot(this.historyController.store.snapshotModelSet.models[i]);
        }

        this.bindStateUpdate();
    };

    HistoryPanel.prototype.hide = function () {
        this.historyController.store.records.removeEventListener('insert', this.bindHistoryRecordModelInsert, this);
        this.historyController.state.removeEventListener('update.index', this.bindStateUpdate, this);

        this.historyController.store.snapshotModelSet.removeEventListener('insert', this.bindSnapshotModelInsert, this);
        this.historyController.store.snapshotModelSet.removeEventListener('remove', this.bindSnapshotModelInsert, this);
        this.historyController.store.snapshotModelSet.removeEventListener('update', this.bindSnapshotModelUpdate, this);
    };

    HistoryPanel.prototype.add = function (type, entity) {

    };
    HistoryPanel.prototype.addSnap = function () {
        var snapName = I18n.resource.mainPanel.exportModal.PHOTO + (_this.$snapshotList.children().length + 1);
        var data = {
            pageId: _this.screen.page._id,
            userId: AppConfig.userId,
            time: new Date().format('yyyy-MM-dd HH:mm:ss'),
            name: snapName,
            content: {
                list: _this.screen.getLayerList(),
                layers: _this.screen.getLayersData().serialize(),
                widgets: _this.screen.getWidgetsData().serialize()
            }
        };
        WebAPI.post('/factory/historyShot/save', data)
        .done(function(result){
            if(result && result._id){
                data._id = result._id;
                _this.historyController.store.snapshotModelSet.append(new Model(data));
            }
        }).always(function(){

        });
    };

    HistoryPanel.prototype.remove = function () {
        $('#snapList .historyItem.selected').each(function(){
            var id = $(this).attr('id');
            WebAPI.get('/factory/historyShot/remove/' + id).done(function(result){
                _this.historyController.store.snapshotModelSet.remove(_this.historyController.store.snapshotModelSet.findByProperty('_id', id));
            });
        });
    };

    HistoryPanel.prototype.close = function () {

    };

    HistoryPanel.prototype.bindHistoryRecordModelInsert = function(event, data){
        var model = data.models[0];
        this.renderHistoryRecord(model);
    };

    HistoryPanel.prototype.bindSnapshotModelInsert = function(event, data){
        var model = data.models[0];
        this.renderSnapshot(model);
    };

    HistoryPanel.prototype.bindSnapshotModelRemove = function(event, data){
        var model = data.models[0];
        this.$snapshotList.children('#' + model._id()).remove();
    };

    HistoryPanel.prototype.bindSnapshotModelUpdate = function(event, data){};

    HistoryPanel.prototype.renderHistoryRecordModel = function(data){
        var model = data;
        this.renderHistoryRecord(model);
    };

    HistoryPanel.prototype.renderHistoryRecord =  function(model){
        var $li = $('<li class="historyItem" id="'+ model.id() +'">').html('<span>'+ model.name() +'</span>');
        $li[0].onclick = function(){
            var index = $(this).index();
            _this.historyController.state.index(index);
        }
        this.$historyList.append($li);
    };

    HistoryPanel.prototype.renderSnapshot =  function(model){
        var timer = null;
        var $li = $('<li class="historyItem" id="'+ model._id() +'">').html('<span class="glyphicon glyphicon-camera" style="margin-right: 12px;"></span><span class="snapName">'+ model.name() +'</span>');
        
        $li.click(function(){
            var $this = $(this);

            if (timer) {
                window.clearTimeout(timer);
                timer = null;
                // 双击
                ~function () {
                    var id = this.id;
                    var shotModelSet = _this.historyController.store.snapshotModelSet;
                    var model = shotModelSet.findByProperty('_id', id);
                    var content, promise;

                    if (!model) return Log.warn('snap shot not found: ' + id);

                    promise = $.Deferred();
                    content = model.property('content');
                    // loading
                    Spinner.spin($("#panelframe")[0]);
                    if (!content) {
                        // 去服务端拉取快照的数据
                        WebAPI.get('/factory/historyShot/getDetail/'+id).done(function (rs) {
                            content = rs.content || {};
                            var imageModelIdArr = [];
                            for (var i = 0, len = content.widgets.length; i < len; i++) {
                                var imageModelId = content.widgets[i].option.trigger['default'];
                                var imageModel = _this.screen.store.imageModelSet.findByProperty('_id', imageModelId);
                                if (!imageModel) {
                                    imageModelIdArr.push(imageModelId);
                                }
                            }
                            WebAPI.post('/factory/material/getByIds', {
                                ids: imageModelIdArr
                            }).done(function (rs) {
                                if (rs.length) {
                                    for (var i = 0, len = rs.length; i < len; i++) {
                                        var imageModel = new Model($.extend(false, {
                                            _id: rs[i]._id
                                        }, rs[i].content));
                                        _this.screen.store.imageModelSet.append(imageModel)
                                    }
                                }
                                // 将快照保存到 modelset 中
                                model.content(content);
                                promise.resolve();
                            });
                            
                        });
                    } else {
                        promise.resolve();
                    }

                    promise.done(function () {
                        var index = _this.historyController.state.index();
                        if (index === -1) {
                            // 快照之间的切换，由于 index 一直都为 -1
                            // 所以 update 事件不会切换，这里手动执行
                            _this.historyController.update(content);
                        } else {
                            _this.historyController.state.index(-1);
                        }
                        
                        Spinner.stop();
                    });
                }.call(this);
            }
            // 单击
            else {
                // 判断当前是否是选中状态
                $("#delHistory").show();
                if ( $this.hasClass('selected') ) {
                    if($(this).find(".snapName").text() === "默认快照"){
                        $("#delHistory").hide();
                    }
                    timer = window.setTimeout(function () {
                        window.clearTimeout(timer);
                        timer = null;
                        // 更名逻辑
                        ~function () {
                            var $input = $('<input type="text"/>').val(model.name())
                            .blur(function () {
                                saveRename({_id: model._id(), name: this.value}, this);
                            })
                            .keypress(function (e) {
                                if(e.keyCode === 13) {
                                    saveRename({_id: model._id(), name: this.value}, this);
                                }
                            })
                            .click(function (e) {
                                e.stopPropagation();
                            });
                            $this.children('.snapName').hide();
                            $this.append($input);
                            $input.focus();

                            function saveRename(data, domInput){
                                WebAPI.post('/factory/historyShot/edit', data)
                                    .done(function(result){
                                        var $dom = $(domInput);
                                        if(result.status){
                                            model.name(data.name);
                                            $dom.prev('.snapName').text(data.name).show();//
                                        }else{
                                            $dom.prev('.snapName').show();//
                                        }
                                        $dom.remove();
                                    }).always(function(){

                                    });
                            }
                        }.call(this);
                    }.bind(this), 500);
                } else {
                    // 添加选中效果
                    $this.addClass('selected').siblings().removeClass('selected');
                    $("#delHistory").show();
                    if($(this).find(".snapName").text() === "默认快照"){
                        $("#delHistory").hide();
                    }
                    timer = window.setTimeout(function () {
                        window.clearTimeout(timer);
                        timer = null;
                    }, 500);
                }
            }
        });

        this.$snapshotList.append($li);
    };

    HistoryPanel.prototype.bindHistoryRecordModelRemove = function(event, data){
        $('#' + data.models[0].id()).remove();
    };

    HistoryPanel.prototype.bindStateUpdate = function(){
        var index = this.historyController.state.index();
        if (index > -1) {
            $('.historyItem', '#historyList').removeClass('shallow').filter(':gt('+index+')').addClass('shallow');
        } else {
            $('.historyItem', '#historyList').addClass('shallow');
        }
    };

    HistoryPanel.prototype.initTools = function () {
        $('.historyToolWrap').remove();
        var strHtml = '';
        var $ul = $('<ul class="list-inline historyToolWrap toolWrap"></ul>');

        for(var i = 0, tool; i < this.historyTools.length; i++){
            tool = this.historyTools[i];
            if(tool.iconType == 1){
                strHtml += ('<li><span class="'+ tool.icon +'" id="'+ tool.id +'"></span></li>');
            }
        }
        $ul.html(strHtml);
        $(this.container).append($ul);
        //event
        $('#addSnap')[0].onclick = this.addSnap;
        $('#delHistory')[0].onclick = this.remove;
    };

    window.HistoryPanel = HistoryPanel;

} ());

