/// <reference path="../lib/jquery-2.1.4.js" />
/// <reference path="../core/common.js" />
/// <reference path="analysis/analysisTendency.js" />
/// <reference path="analysis/analysisSpectrum.js" />
/// <reference path="analysis/analysisGroup.js" />
/// <reference path="analysis/analysisData.js" />
/// <reference path="../core/common.js" />
/// <reference path="../lib/jquery-1.8.3.js" />

var AnalysisScreen = (function () {
    // 用以解决数据分析 screen 之间切换，会同步两次的问题
    var syncDelayTimer = null;

    function AnalysisScreen() {
        this.store = undefined;
        this.factoryIoC = undefined;
        this.container = undefined;
        this.ltContainer = undefined;
        //this.rtContainer = undefined;
        this.arrColor = echarts.config.color;
        
        this.saveModalJudge = undefined;
        this.modalConfig = undefined;
        //this.targetSlide = undefined;

        this.curModal = {
            startTime: undefined,
            endTime: undefined,
            format: undefined,
            mode: undefined,
            itemDS: [] //datasource item ids.
        };

        this.path = [];

        // panels
        // 数据源 容器
        this.paneDatasource = undefined;
        // 首页模板 容器
        this.paneCenter = undefined;
        // 左侧 slider 容器
        this.paneLeft = undefined;
    }

    AnalysisScreen.prototype = {
        show: function () {
            var _this = this;
            var promise = $.Deferred();
            Spinner.spin(ElScreenContainer);

            // 处理之前一个 screen 也是数据分析的情况
            if(syncDelayTimer !== null) {
                window.clearTimeout(syncDelayTimer);
                syncDelayTimer = null;
            }

            WebAPI.get("/static/views/observer/analysisScreen.html").done(function (resultHtml) {
                Spinner.stop();
                $(ElScreenContainer).html(resultHtml);
                var side = new SidebarMenuEffect();
                side.init('#paneContent');
                document.querySelector('#leftCt').click();
                document.querySelector('#rightCt').click();

                // 开始同步逻辑
                _this.syncCheck();
            });
        },

        close: function () {
            var _this = this;

            // 如果中间的页面上存在 spinner，则给予提示信息
            var isExistSpinner = (function () {
                var $spinner = $('#anlsPaneContain').find('.spinner');
                return $spinner.length > 0;
            }());

            if (isExistSpinner) {
                //TODO 测试confirm
                confirm('Exit now will interrupt the current operation, continue?', function () {
                    _this.store = null;
                    _this.factoryIoC = null;
                    _this.container = null;
                    _this.curModal = null;
                    _this.modalConfig && _this.modalConfig.close && _this.modalConfig.close();
                    AppConfig.datasource = null;

                    _this.paneDatasource && _this.paneDatasource.close && _this.paneDatasource.close();
                    _this.wsPanel && _this.wsPanel.close && _this.wsPanel.close();
                    _this.tplPanel && _this.tplPanel.close && _this.tplPanel.close();
                    _this.paneCenter && _this.paneCenter.close && _this.paneCenter.close();

                    // 清除自定义全屏事件
                    delete FullScreenManager.onFullScreenEnter;
                    delete FullScreenManager.onFullScreenOut;

                    _this.detachResizeEvents();

                    // 停止 数据同步 定时器
                    // 停止前需要同步一次
                    if (_this.syncWorker.status === 'processing') {
                        _this.syncWorker.stop();
                    } else {
                        _this.syncWorker.stop();
                        _this.syncWorker.setOptions({
                            onProcessing: null,
                            onSuccess: null,
                            onFailed: null
                        });

                        syncDelayTimer = window.setTimeout(function () {
                            _this.syncWorker.start(0, 'once');
                        }, 500);
                    }
                });
            }
        },
        syncCheck: function () {
            var _this = this;

            // 初始化 数据同步 定时器
            this.syncWorker = new SyncWorker();

            // 检查缓冲区中是否有上一次未同步的数据
            this.syncWorker.setOptions({
                onSuccess: function () {
                    _this.init();
                    _this.initSyncWorker();
                },
                onFailed: function () {
                    alert('数据分析经历非法关闭，请确认您的数据完整');
                    window.Beop.cache.buffer.removeFrozenData().done(function () {
                        _this.init();
                        _this.initSyncWorker();
                    });
                }
            });

            // 初始化同步缓存
            window.Beop.cache.buffer.init().done(function () {
                _this.syncWorker.start(0);
            });
        },
        initSyncWorker: function (e) {
            var _this = this;
            
            this.syncWorker.setOptions({
                onProcessing: function () {
                    console.log('processing');
                },
                onSuccess: function () {
                    console.log('success');
                },
                onFailed: function () {
                    console.warn('failed');
                }
            });

        },
        doSync: function () {
            var _this = this;
            var promise = $.Deferred();

            this.syncWorker.setOptions({
                onSuccess: function () {
                    _this.initSyncWorker();
                    promise.resolve();
                }
            });

            this.syncWorker.start(0);
            return promise;
        },        

        onresize: function () {
            if (ScreenCurrent.paneCenter && ScreenCurrent.paneCenter.chart) {
                ScreenCurrent.paneCenter.chart.resize();
            }
        },

        init: function () {
            var _this = this;
            var localStorageFlag;

            this.container = document.getElementById('anlsPane');
            this.ltContainer = document.getElementById('workspacePane');
            this.rtContainer = document.getElementById('divAnlsDatasourcePane');

            this.$breadcrumb = $('.breadcrumb').eq(0);
            this.$itemTools = $('.itemTools').eq(0);
            this.arrToolBox = [
                //wsList - 0
                [{
                    type: 'glyphicon', value:'glyphicon glyphicon-search', id: 'btnPreview', title: 'Preview Workspaces'
                }, {
                    type: 'glyphicon', value:'glyphicon glyphicon-list-alt', id: 'btnShowTemplate', title: 'Show Template'
                }],
                //modalList - 1
                [{
                    type: 'glyphicon', value: 'glyphicon glyphicon-random', id: 'btnMoveTo', title: 'Move to Other workspace'
                },{
                    type: 'glyphicon', value: 'glyphicon glyphicon-share', id: 'btnShareTo', title: 'Create Share Report'
                },{
                    type: 'glyphicon', value: 'glyphicon glyphicon-play', id: 'btnPlay', title: 'Play Sliders'
                },{
                    type: 'button', value: i18n_resource.analysis.workspace.REVERSE_SELECT, id: 'btnSelectReverse', title: i18n_resource.analysis.workspace.REVERSE_SELECT
                },{
                    type: 'button', value: i18n_resource.analysis.workspace.SELECT_ALL, id: 'btnSelectAll', title: i18n_resource.analysis.workspace.SELECT_ALL
                }],
                // workspace chart detail - 2
                [{
                    type: 'glyphicon', value: 'glyphicon glyphicon-cog', id: 'btnConfigModal', title: 'Config'
                },{
                    type: 'glyphicon', value: 'glyphicon glyphicon-edit', id: 'btnCreateNote', title: 'Create Notes'
                }, {
                    type: 'glyphicon', value: 'glyphicon glyphicon-eye-open', id: 'btnNoteHideOrShow', title: 'Notes Hide Or Show'
                }, {
                    type: 'glyphicon', value: 'glyphicon glyphicon-th-large', id: 'graphSelsect', title: 'Select Graphs'
                },
                //{
                //    type: 'glyphicon', value: 'glyphicon glyphicon-leaf', id: 'chartModify', title: 'Modify Echart'
                //},
                {
                    type: 'glyphicon', value: 'glyphicon glyphicon-filter', id: 'btnDataFilter', title: 'Data Filter'
                },
                {
                    type: 'glyphicon', value: 'glyphicon glyphicon-download-alt', id: 'btnDownLoadExcel', title: 'Download the excel file'
                }],
                // templateList - 3
                [{
                    type: 'glyphicon', value: 'glyphicon glyphicon-log-in', id: 'btnReturnToWorkspace', title: 'Return To Workspace'
                }],
                // 暂未用到，先空着 - 4
                []
            ]

            this.attachResizeEvents();
            this.initBreadCrumb();
            this.initItemTools();

            Spinner.spin(ElScreenContainer);
            var lastOpenWorkspaceId = localStorage.getItem('lastOpenWorkspaceId_' + AppConfig.userId);
            if(lastOpenWorkspaceId === null) lastOpenWorkspaceId = 0;

            WebAPI.get('/analysis/getWorkspaces/' + AppConfig.userId+'/'+lastOpenWorkspaceId).done(function (result) {
                var temp;
                _this.store = result;

                // 初始化 ioc 容器
                _this.initIoc();

                // 初始化 数据源 容器
                _this.paneDatasource = AppConfig.datasource = new DataSource(_this);
                
                // 初始化工作空间的数据 observer
                _this.initWsObserver();
                // 初始化面包屑导航的数据 ovserver
                _this.initPathObserver();

                //如果有最近打开的工作空间则显示最近的,否则默认显示第一个工作空间
                if(_this.store.workspaces.length > 0){
                    if(lastOpenWorkspaceId !== 0){
                        for(var i = 0; i < _this.store.workspaces.length; i++){
                            if(_this.store.workspaces[i].id == lastOpenWorkspaceId){
                                temp = _this.store.workspaces[i];
                                break;
                            }
                        }
                        if(!temp){
                            temp = _this.store.workspaces[0];
                        }
                    }else{
                        temp = _this.store.workspaces[0];
                    }
                    _this.path.splice(0, _this.path.length,
                        {type: 'WorkspacePanel', title: I18n.resource.analysis.workspace.WORKSPACE_NAME, data: _this.store.workspaces},
                        {type: 'CenterSliderPanel', title: temp.name, data: temp});
                }
                // 如果当前还没有工作空间，则只显示工作空间的平铺页面
                else {
                    _this.path.push( {type: 'WorkspacePanel', title: I18n.resource.analysis.workspace.WORKSPACE_NAME, data: _this.store.workspaces} );
                }

                _this.paneDatasource.show();

                _this.modalConfig = new modalConfigurePane(document.getElementById('modalConfigContainer'),_this,'dataAnalysis');
                _this.modalConfig.show();
                I18n.fillArea($(ElScreenContainer));
                Spinner.stop();
            });
        },

        attachResizeEvents: function () {
            var _this = this;
            var handler = function (e) {
                if(e.originalEvent.propertyName !== 'transform') return;
                if(e.target !== _this.ltContainer && e.target !== _this.rtContainer) return;

                if( typeof _this.onresize === 'function' ) {
                    _this.onresize();
                }
            };
            $(this.ltContainer).off('transitionend').on('transitionend', handler);
            $(this.rtContainer).off('transitionend').on('transitionend', handler);
        },

        detachResizeEvents: function () {
            $(this.ltContainer).off('transitionend');
            $(this.rtContainer).off('transitionend');
        },

        mergeDsInfoList: function (dsList) {
            var dsInfoMap = {}, dsMap = {};

            if(!dsList || !dsList.length) return;
            if(!this.store.dsInfoList || !this.store.dsInfoList.length) {
                this.store.dsInfoList = dsList;
                return;
            }

            // 转换成 map
            this.store.dsInfoList.forEach(function (row) {
                dsInfoMap[row.id] = row;
            });
            dsList.forEach(function (row) {
                dsMap[row.id] = row;
            });

            for(var p in dsMap) {
                if( !dsMap.hasOwnProperty(p) ) continue;
                if( dsInfoMap.hasOwnProperty(p) ) continue;
                dsInfoMap[p] = dsMap[p];
                this.store.dsInfoList.push(dsMap[p]);
            }
        },

        initWsObserver: function () {
            var _this = this;

            var addModalArrayOb = function (arr) {
                observeHelper.watchArray( arr, 'modalList', function (sign, type, data) {
                    var changeData;
                    switch(type) {
                        case 'push':
                            // 为新增的元素添加对 name 属性的监控
                            observeHelper.watchProp( data.changeData, ['name', 'imagebin'], 'modal', function (sign, data) {
                                var params;
                                switch(sign) {
                                    case 'modal_name':
                                        params = {
                                            id: data.id,
                                            name: data.name,
                                            modifyTime: data.modifyTime
                                        }
                                        break;
                                    case 'modal_imagebin':
                                        params = {
                                            id: data.id,
                                            imagebin: data.imagebin,
                                            modifyTime: data.modifyTime
                                        }
                                        break;
                                }
                                // slider 更新
                                if(!_this.path[_this.path.length-1].isSlider) _this.paneCenter.updateSlider(params);
                                _this.paneLeft.updateSlider(params);
                            } );
                            // 新增一个 slider
                            if(!_this.path[_this.path.length-1].isSlider) _this.paneCenter.addSlider(data.changeData);
                            _this.paneLeft.addSlider(data.changeData);
                            break;
                        case 'splice':
                            changeData = data.changeData[0];
                            // 删除一个 slider
                            if(!_this.path[_this.path.length-1].isSlider) _this.paneCenter.removeSlider(changeData);
                            _this.paneLeft.removeSlider(changeData);
                            break;
                        case 'move':
                            _this.saveModalLayout();
                            break;
                    }
                } );

                arr.forEach( function (modal) {
                    // 为每个 modal 的 name 属性添加监控
                    observeHelper.watchProp( modal, ['name', 'imagebin'], 'modal', function (sign, data) {
                        var params;
                        switch(sign) {
                            case 'modal_name':
                                params = {
                                    id: data.id,
                                    name: data.name,
                                    modifyTime: data.modifyTime
                                };
                                break;
                            case 'modal_imagebin':
                                params = {
                                    id: data.id,
                                    imagebin: data.imagebin,
                                    modifyTime: data.modifyTime
                                };
                                break;
                        }
                        // slider 更新
                        if(!_this.path[_this.path.length-1].isSlider) _this.paneCenter.updateSlider(params);
                        _this.paneLeft.updateSlider(params);
                    } );
                } );
            };

            var addWsArrayOb = function (arr, name) {
                observeHelper.watchArray(arr, name, function (sign, type, data) {
                    switch(type) {
                        case 'push':
                            // 为新增的元素添加监控
                            addWorkspaceOb(data.changeData);
                            // 新增一个 workspace
                            _this.paneCenter.addOne(data.changeData);
                            break;
                        case 'splice':
                            // 删除一个 workspace
                            _this.paneCenter.removeOne(data.changeData[0]);
                            break;
                        case 'move':
                            _this.saveWorkspaceLayout();
                            break;
                    }
                });

                arr.forEach( function (row) {
                    // 为每个 workspace 添加监控
                    addWorkspaceOb(row);
                } );
            };

            var addWorkspaceOb = function (ws) {
                observeHelper.watchProp(ws, ['name', 'modalList'], 'workspace', function (sign, data) {
                    var item;
                    switch(sign) {
                        case 'workspace_name':
                            // 工作空间/模板 重命名逻辑
                            _this.paneCenter.updateOne(data);
                            break;
                        case 'workspace_modalList':
                            addModalArrayOb(data.modalList);
                            
                            if(_this.path.length === 2 &&
                                _this.path[0].type === 'WorkspacePanel') {
                                _this.paneCenter.init();
                            }
                            break;
                    };
                });
                addModalArrayOb(ws.modalList);
            };

            // 为 workspaces 数组新增监控
            addWsArrayOb(this.store.workspaces, 'workspace');

            // 为 templates 新增监控
            observeHelper.watchProp(this.store, 'templates', 'analysis', function (sign, data) {
                // 为预置模板对象添加监控
                addWsArrayOb(data.templates.preTemplate, 'analysis');
                // 为每个用户模板对象添加监控
                addWsArrayOb(data.templates.userTemplate, 'analysis');
            });
        },

        initPathObserver: function () {
            var _this = this;
            observeHelper.watchArray(this.path, 'analysis', function (sign, type, data) {
                var len = _this.path.length, oldLen = data.oldData.length;
                var item, modalClass;
                _this.renderBreadCrumb();
                _this.$itemTools.children().hide();
                item = _this.path[len-1];

                switch(len) {
                    case 1:
                        // 当前路径只有 1 组数据的时候，清空左侧 slider 容器
                        if(_this.paneLeft && _this.paneLeft.close) _this.paneLeft.close();
                        _this.panelLeft = null;
                        break;
                    case 2:
                        _this.refreshPaneLeft( new window.analysis.panels.LeftSliderPanel(_this, item.data) );
                        break;
                    case 3:
                        // 如果只是 slider 之间的切换，则不处理
                        if(len-oldLen <= 1) break;
                        // 渲染左侧
                        _this.refreshPaneLeft( new window.analysis.panels.LeftSliderPanel(_this, item.data) );
                        break;
                }
                // 渲染当前需要显示在中间的实例
                if(item.isSlider && item.type !== 'AnalysisTemplate') {
                    _this.renderModalById(item.data);
                } else {
                    _this.refreshPaneCenter(new window.analysis.panels[item.type](_this, item.data) );
                }
                _this.renderItemtools();
            });
        },

        refreshPaneLeft: function (entity) {
            if(this.paneLeft && this.paneLeft.close) this.paneLeft.close();
            this.paneLeft = entity;
            this.paneLeft.show(this.ltContainer);
        },

        refreshPaneCenter: function (entity) {
            if (this.paneCenter && this.paneCenter.close) this.paneCenter.close();
            this.paneCenter = entity;
            // 只读处理
            if(this.path[this.path.length-1].isSlider && this.paneLeft.readonly) {
                $(this.container).addClass('panel-readonly');
            } else {
                $(this.container).removeClass('panel-readonly');
            }
            this.paneCenter.show(this.container);
        },

        initBreadCrumb: function () {
            var _this = this;
            //this.$breadcrumb.on('click', 'a', function () {
            EventAdapter.on(this.$breadcrumb, 'click', 'a', function () {
                var $this = $(this);
                var level = parseInt( $this.attr('data-level') );
                var type = _this.path[level].type;
                _this.path.splice(level+1);
            });
        },

        renderBreadCrumb: function () {
            var arrHtml = [];
            var len = this.path.length;
            this.path.forEach( function (row, i) {
                if( len-1 === i) {
                    arrHtml.push('<li class="active">'+row.title+'</li>');
                    return;
                }
                arrHtml.push('<li><a href="javascript:;" data-level="'+i+'">'+row.title+'</a></li>');
            } );
            this.$breadcrumb.html( arrHtml.join('') );
        },

        initItemTools: function(){
            var arrToolHtml = [], _this = this;
            for(var i = 0, len = this.arrToolBox.length; i < len; i++){
                var toolBox = this.arrToolBox[i];
                for(var j in toolBox){
                    var tool = toolBox[j];
                    tool.level = i;
                    if (tool.type == 'glyphicon') {
                        if (tool.id === 'btnDownLoadExcel') {
                            arrToolHtml.push('<span class="glyphicon {value} panel-heading-btn grow" id="{id}" data-level="{level}" title="{title}"><a href="#" id="{id}_a" style="display: inline-block;width: 20px;height: 20px;position: absolute;top: 0;left: 0;" nothash></a></span>'
                                .formatEL(tool))
                        } else { 
                            arrToolHtml.push('<span class="glyphicon {value} panel-heading-btn grow" id="{id}" data-level="{level}" title="{title}"></span>'
                                .formatEL(tool))
                        }
                    }else if(tool.type == 'button'){
                        arrToolHtml.push('<button type="button" class="btn btn-default btn-xs" id="{id}" data-level="{level}" title="{title}">{value}</button>'
                                .formatEL(tool) );
                    }
                }
            }
            this.$itemTools.html(arrToolHtml.join(''))
            EventAdapter.on($(this.$itemTools.children('#btnPreview').off('click')), 'click',function(e){_this.preview();});
            EventAdapter.on($(this.$itemTools.children('#btnShareTo').off('click')), 'click',function(e){_this.shareTo();});
            EventAdapter.on($(this.$itemTools.children('#btnPlay').off('click')), 'click',function(e){_this.play();});
            EventAdapter.on($(this.$itemTools.children('#btnSelectAll').off('click')), 'click',function(e){_this.selectAll();});
            EventAdapter.on($(this.$itemTools.children('#btnSelectReverse').off('click')), 'click',function(e){_this.selectReverse();});
            EventAdapter.on($(this.$itemTools.children('#btnShowTemplate').off('click')), 'click',function(e){_this.showTemplate();});
            EventAdapter.on($(this.$itemTools.children('#btnReturnToWorkspace').off('click')), 'click',function(e){_this.returnToWorkspace();});
            EventAdapter.on($(this.$itemTools.children('#btnMoveTo').off('click')), 'click',function(e){_this.moveTo();});
            //this.$itemTools.children('#btnPreview').off('click').click(function(){_this.preview()});
            //this.$itemTools.children('#btnShareTo').off('click').click(function(){_this.shareTo();});
            //this.$itemTools.children('#btnPlay').off('click').click(function(){_this.play()});
            //this.$itemTools.children('#btnSelectAll').off('click').click(function(){_this.selectAll();});
            //this.$itemTools.children('#btnSelectReverse').off('click').click(function(){_this.selectReverse()});
            //this.$itemTools.children('#btnShowTemplate').off('click').click(function () {_this.showTemplate();});
            //this.$itemTools.children('#btnReturnToWorkspace').off('click').click(function () {_this.returnToWorkspace();});
            //this.$itemTools.children('#btnMoveTo').off('click').click(function () {_this.moveTo();});
        },

        renderItemtools: function(){
            var index = this.path.length - 1;
            // 临时兼容的写法，更好的做法是将 toolbox 实例化在各个 panel 内
            if(this.path[0].type === 'TemplatePanel') index += 3;
            // 5 和 2 是一样的工具栏
            if(index === 5) index = 2;

            // 只读模式下的 chart detail 不显示 toolbox
            if(this.path.length === 3 && this.paneLeft.readonly) return;
            this.$itemTools.children('[data-level="'+ index +'"]').show();
            if(this.path.length === 2 && this.paneLeft.readonly) {
                this.$itemTools.children('#btnMoveTo').hide();
            }
            if (this.container && $(this.container.firstChild).hasClass('anlsTemplate')) {
                $('#btnDownLoadExcel').hide();
            }
            //趋势图显示修改图表按钮
            if (this.curModal && this.curModal.type == 'AnlzTendency') {
                if ($(this.container).find('div').hasClass('divHover')) {
                    $('#chartModify').show();
                    $('#btnDataFilter').show();
                } else {
                    $('#chartModify').hide();
                    $('#btnDataFilter').hide();
                }
            } else {
                $('#chartModify').hide();
                $('#btnDataFilter').hide();
            }
        },

        hideAnlsPane: function () {
            $('#anlsPaneContain').hide();
            this.detachResizeEvents();
        },

        showAnlsPane: function () {
            $('#anlsPaneContain').show();
            this.attachResizeEvents();
            this.onresize();
        },

        initIoc: function () {
            this.factoryIoC = new FactoryIoC('analysis');
        },

        renderModal: function () {
            var option = this.curModal;
            var modalClass = this.factoryIoC.getModel(option.type);
            if (modalClass) {
                this.refreshPaneCenter(new modalClass(this.container, option, this));
            }
            else this.refreshPaneCenter(new window.analysis.panels.AnalysisTemplate(this));
            this.saveModal();
        },

        renderModalById: function (modal) {
            this.curModal = modal.option;
            this.renderModal();
            this.saveModalJudge.rejectWith(this,[this,$('#divWSPane .selected')]);
            this.saveModalJudge.rejectWith(this,[this,$('#divWSPane .selected')]);
        },

        saveWorkspaceLayout: function () {
            var _this = this;
            var workspaces = this.store.workspaces;
            WebAPI.post('/analysis/workspace/saveOrder/' + AppConfig.userId, {
                idList: this.store.workspaces.map( function (row) { return row.id; } )
            }).done(function () {
                _this.paneCenter.close();
                _this.paneCenter.show(_this.container);
            });
        },

        saveModalLayout: function () {
            var _this = this;
            var ws = this.paneLeft.ws;
            WebAPI.post('/analysis/modal/saveOrder/' + AppConfig.userId + '/0', {
                workspaceId: ws.id,
                idList: ws.modalList.map(function (row) { return row.id; })
            }).done(function () {
                _this.paneLeft.close();
                _this.paneLeft.show(_this.ltContainer);
                // 如果当前是在工作空间二级页面，则重新加载
                if(!_this.path[_this.path.length-1].isSlider) {
                    _this.paneCenter.close();
                    _this.paneCenter.show(_this.container);
                }
            });
        },

        // 处理 modal 的更新
        saveModal: function () {
            this.saveModalJudge = $.Deferred();
            $.when(this.saveModalJudge).done(function (_this, _mode, _chart,_targetSlider,_curModal,imgSaveJudge) {
                var currentWs = _this.paneLeft.ws;
                var modalList = currentWs.modalList;
                var imageSm, canvas, tempChartImageBin;
                var params, modal;
                var type;
                var modalId = _targetSlider.attr('data-id');

                for (var key in _curModal) {
                    if (_curModal[key] instanceof Date)
                        _curModal[key] = _curModal[key].format('yyyy-MM-dd HH:mm:ss');
                }

                params = {
                    id: modalId,
                    type: _curModal.type || '',
                    note: '',
                    option: _curModal,
                    modifyTime: new Date().format('yyyy-MM-dd HH:mm')
                }

                if (imgSaveJudge) {
                    if (!_chart) {
                        tempChartImageBin = _targetSlider.get(0).style.backgroundImage.replace('url(', '').replace(')', '');
                    } else {
                        //生成缩略图时隐藏toolbox 和 dataZoom(如果有的话)
                        var tempOption = _chart.getOption();
                        var isShowToolbox = undefined;
                        var isShowDataZoom = undefined;
                        if (tempOption.toolbox && tempOption.toolbox[0]) {
                            isShowToolbox = tempOption.toolbox[0].show;
                            tempOption.toolbox[0].show = false;
                        }
                        if (tempOption.dataZoom && tempOption.dataZoom[0]) {
                            isShowDataZoom = tempOption.dataZoom[0].show
                            tempOption.dataZoom[0].show = false;
                        }
                        if (tempOption.dataRange) {
                            tempOption.dataRange.show = false;
                        }
                        _chart.setOption(tempOption);
                        //设置缩略图背景颜色
                        //imageSm = _chart.getImage('jpeg');
                        imageSm = _chart.getDataURL({
                            type:'jpeg', 
                            pixelRatio:0.3,
                            backgroundColor: '#fff'
                        });
                        //还原toolbox和dataZoom
                        if(isShowToolbox){
                            tempOption.toolbox[0].show = isShowToolbox;
                        }
                        if(isShowDataZoom){
                            tempOption.dataZoom[0].show = isShowDataZoom;
                        }
                        _chart.setOption(tempOption);

                        canvas = document.createElement("canvas");
                        canvas.width = 480;
                        canvas.height = 300;
                        //canvas.getContext("2d").drawImage(imageSm, 0, 0, 480, 300);
                        //tempChartImageBin = canvas.toDataURL("image/jpeg");
                        tempChartImageBin = imageSm;//.getAttribute('src');
                    }
                    // 如果缩略图有修改，则添加到 storage 中
                    Beop.cache.img.set(currentWs.id, modalId, tempChartImageBin);

                    params.imagebin = tempChartImageBin;
                }

                type = !currentWs.templateId ? 'ws' : 'tpl';
                _this.paneLeft.model.update(params, currentWs.id, type).done(function () {
                    // 存入内存中
                    var i = 0;
                    while( modal = modalList[i++]) {
                        if(modal.id === modalId) {
                            modal.type = params.type;
                            modal.option = params.option;
                            modal.modifyTime = params.modifyTime;
                            params.imagebin !== undefined && (modal.imagebin = params.imagebin);
                            break;
                        }
                    }
                });
            });
            $('#btnDownLoadExcel_a').parent().show()
        },

        updateDataSources: function (updateData) {
            this.store.group = updateData;
        },

        alertNoData: function(){
            var _this = this;
            var $dataAlert = $("#dataAlert");
            new Alert($dataAlert, "danger", "<strong>" + I18n.resource.analysis.paneConfig.ERR11 + "</strong>").show().close();
            // _this.refreshPaneCenter(new window.analysis.panels.AnalysisTemplate(_this));
        },

        //toolBox eventAttach
        shareTo: function(){
            var selectedIds = $.makeArray(this.paneCenter.$container.find('.slider-item.checked').map(function () {
                return this.dataset.id; 
            }));
            var selectedNames;
            var workAndReport ;
            var modalList, data = [];


            if(selectedIds.length <= 0) {
                alert('You should choose one slider at least!');
                return;
            }
            modalList = this.paneCenter.ws.modalList;
            //workAndReport = new Date().format('yyyy-MM-dd') + '&nbsp;' + this.paneCenter.ws.name + '&nbsp' + modalList[0].name + '等' + modalList.length + '张表';
            if(!modalList || !modalList.length) return false;

            // get selected data from modalList
            for (var i = 0, item, arrPoints, len = modalList.length; i < len; i++) {
                if (selectedIds.indexOf(modalList[i]['id']) > -1) {
                    item = modalList[i];
                    if (item.id == selectedIds[0]) {
                        selectedNames = item.name;
                    }
                    //item.imagebin = '';
                    arrPoints = [];

                    if(!item.option.itemDS) continue;
                    for (var j = 0; j < item.option.itemDS.length; j++) {
                        arrPoints = arrPoints.concat(item.option.itemDS[j].arrId);
                    }

                    // 去除 __observeProps 属性
                    for(var p in item.__observeProps) {
                        if( !item.hasOwnProperty(p) ) continue;
                        Object.defineProperty(item, p, {
                            writable: true,
                            value: item.__observeProps[p]
                        });
                    }
                    delete item.__observeProps;
                    delete item.imagebin;

                    data.push({
                        "id": (+new Date()).toString() + i.toString(),
                        "spanC": 6,
                        "spanR": 4,
                        "modal": {
                            "interval": 0,
                            "option": item,
                            "title": item.name,
                            "points": arrPoints,
                            "type": "ModalAnalysis"
                        }
                    });
                }
            }
            //修改时间工作空间名选中的第一张表及选中多少张
            workAndReport = new Date().timeFormat(timeFormatChange('yyyy-mm-dd')) + ' ' + this.paneCenter.ws.name + ' <i style="font-weight:600;">' + selectedNames + '  </i>  ' + I18n.resource.analysis.shareLog.DESC_TIP_ETC +'  '+selectedIds.length+'  '+ I18n.resource.analysis.shareLog.DESC_TIP_TABLE;
            var strShare = 'SHARE' + AppConfig.userId.toString() + (+new Date()).toString(), postData;

            postData = {
                projectId: '',
                menuItemId: strShare,
                layout: [data],
                desc: workAndReport//,
                //shareLogId:
            };
            var dsInfoList = [].concat(this.store.dsInfoList);
            ScreenManager.show(EnergyScreen, strShare, postData, null, dsInfoList);
        },

        selectAll: function(){
            this.paneCenter.$container.find('.slider-item').addClass('checked');
        },

        selectReverse: function(){
            this.paneCenter.$container.find('.slider-item').toggleClass('checked');
        },

        play: function () {
            var _this = this;
            var sliders;
            var selectedIds = $.makeArray(this.paneCenter.$container.find('.slider-item.checked').map(function () {
                return this.dataset.id;
            }));

            if(selectedIds.length <= 0) {
                alert('You should choose one slider at least!');
                return;
            }
            $('html').addClass('sharpview-mode');
            // find slider sets
            sliders = _this.paneCenter.ws.modalList.filter(function (row) {
                return selectedIds.indexOf(row.id) > -1;
            });

            // 初始化 "播放放幻灯片" 按钮事件
            FullScreenManager.onFullScreenEnter = function () {
                _this.sharpViewScreen = new SharpViewScreen(sliders, _this.store);
                _this.sharpViewScreen.show();
            };
            FullScreenManager.onFullScreenOut = function () {
                $('html').removeClass('sharpview-mode');
                _this.sharpViewScreen.destroy();
            };
            FullScreenManager.toggle();
        },

        preview: function () {
            var _this = this;
            var promise = $.Deferred();
            var modalList = [], workspaces = this.store.workspaces;
            var wsIdsNeedLoad = [];
            var selectedWsIds = ([]).map.call( $(this.container).find('.wsSet.on'), function (row) { return row.dataset.id; } );
            var selectedWsList = [];
            var dsInfoList;

            if (selectedWsIds.length == 0) {
                alert('Please select at least one workspace!');
                return;
            }

            workspaces.forEach(function (ws) {
                if( selectedWsIds.indexOf(ws.id) === -1 ) {
                    return false;
                }

                // modalCount 可能存在的值：undefined、自然数
                if( ws.modalCount === undefined ) {
                    modalList = modalList.concat(ws.modalList);
                }
                // 需要去服务端加载的
                else if( ws.modalCount > 0 ) {
                    wsIdsNeedLoad.push(ws.id);
                }
            });

            if (!modalList.length && !wsIdsNeedLoad.length) return false;

            if(wsIdsNeedLoad.length > 0) {
                // 去服务端拉数据
                WebAPI.post('/analysis/getModals', {
                    idList: wsIdsNeedLoad
                }).done(function (rs) {
                    for(var prop in rs) {
                        if( !rs.hasOwnProperty(prop) ) {
                            continue;
                        }
                        modalList = modalList.concat(rs[prop].modalList);
                        _this.mergeDsInfoList(rs[prop].dsInfoList);
                    }
                    promise.resolve();
                });
            } else {
                promise.resolve();
            }

            promise.done(function () {
                var postData;
                var data = [];
                for (var i = 0, item, arrPoints, len = modalList.length; i < len; i++) {
                    item = modalList[i];
                    //item.imagebin = '';
                    arrPoints = [];
                    if(!item.option.itemDS) continue;
                    for (var j = 0, arrId; j < item.option.itemDS.length; j++) {
                        arrPoints = arrPoints.concat(item.option.itemDS[j].arrId);
                    }

                    data.push({
                        "id": (+new Date()).toString() + i.toString(),
                        "spanC": 6,
                        "spanR": 4,
                        "modal": {
                            "interval": 0,
                            "option": item,
                            "title": item.name,
                            "points": arrPoints,
                            "type": "ModalAnalysis"
                        }
                    });
                }

                postData = {
                    group: _this.store.group,
                    dsInfoList: _this.store.dsInfoList,
                    projectId: '',
                    layout: [data]
                };

                ScreenCurrent.close();
                ScreenCurrent = new EnergyScreen();
                ScreenCurrent.store = postData;
                ScreenCurrent.isForBencMark = true;
                ScreenCurrent.show();
            });
        },

        showModal: function(){
            var $dialog = $('#dialogModal');
            var $dialogContent = $dialog.find('#dialogContent').css({height: '90%', width: '90%', margin: 'auto', marginTop: '2.5%', backgroundColor: '#fff'});
            $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                $dialogContent.removeAttr('style').html('');
            }).modal({});

            var energyScreen = new EnergyScreen();
            energyScreen.container = $dialogContent[0];
            energyScreen.isForBencMark = true;
            energyScreen.init();
        },

        showTemplate: function () {
            var _this = this;
            var len = this.path.length;
            var pjIds;

            if(!this.store.templates) {
                pjIds = AppConfig.projectList.map(function (row, i) { return row.id; });
                Spinner.spin(this.container);
                WebAPI.post('/analysis/template/get/'+AppConfig.userId, {
                    projectIds: pjIds
                }).done(function (rs) {
                    _this.store.templates = rs;
                    _this.path.splice(0, len, {
                        type: 'TemplatePanel',
                        title: 'Templates',
                        data: rs
                    });
                }).always(function(){
                    Spinner.stop();
                });
            } else {
                this.path.splice(0, len, {
                    type: 'TemplatePanel',
                    title: 'Templates',
                    data: this.store.templates
                });
            }
        },

        returnToWorkspace: function ()  {
            this.path.splice(0, this.path.length, {
                type: 'WorkspacePanel',
                title: I18n.resource.analysis.workspace.WORKSPACE_NAME,
                data: this.store.workspaces
            });
        },

        moveTo: function(){
            var selectedModalIds = 
                Array.prototype.map.call($('.slider-item.checked', this.container), function (row) {
                    return row.dataset.id;
                });
            if(selectedModalIds.length == 0){
                alert('Please select at least one Slider!');
                return;
            }

            var $dialog = $('#dialogModal'),
                workspaceHtml =[],
                modalHtml,
                _this = this,
                targetWs = {};
            var wsTpl = '<div class="wsSet{isEmpty} moveTo" data-id="{id}"><div class="wsCtn"><div class="wsName">{name}</div></div></div>';

            this.store.workspaces.forEach(function(ws){
                //除了当前ws之外的ws
                if(_this.paneCenter.ws.id === ws.id || ws.templateId) return;

                workspaceHtml.push(wsTpl.formatEL({
                    id: ws.id,
                    name: ws.name,
                    isEmpty: ws.modalList.length > 0 ? '' : ' empty'
                }));
            });
            modalHtml = '<div class="modal-content" id="" style="height: calc(100% - 200px);">\
                <div class="modal-header">\
                    <button type="button" class="close" onclick="">\
                        <span aria-hidden="true">&times;</span>\
                    </button>\
                    <h3 class="modal-title">Move to Workspace</h3>\
                </div>\
                <div class="modal-body" style="height: calc(100% - 120px); overflow-y: auto;">' +
                workspaceHtml.join('') +
                    '<div style="clear: both;"></div>\
                </div>\
                <div class="modal-footer">\
                    <button id="confirmMove" class="btn btn-primary disabled">Confirm</button>\
                </div>\
            </div>';

            $dialog.find('#dialogContent').css({height: '100%'}).html(modalHtml);
            $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                //_this.close();
                Spinner.stop();
            }).modal({});
            EventAdapter.on($dialog.find('.close').off('click'), 'click', function(e) {
            //$dialog.find('.close').off('click').click(function(){
                $dialog.modal('hide');
                e.stopPropagation();
            });
            EventAdapter.on($dialog.find('#confirmMove').off('click'), 'click', function(e) {
            //$dialog.find('#confirmMove').off('click').click(function(e){
                e.stopPropagation();
                var data , modalIdList = [];
                var targetModalList = targetWs.modalList;
                var srcModalList = _this.paneLeft.ws.modalList;
                var moveModals = [];
                var modalModel = _this.paneLeft.model;
                var ws = _this.paneLeft.ws;

                $dialog.modal('hide');
                Spinner.spin(ElScreenContainer);
                // 先同步数据
                _this.doSync().done(function () {
                    // 做工作空间的移动操作
                    WebAPI.post('/analysis/modalMove/'+AppConfig.userId, {
                        srcWsId: ws.id,
                        destWsId: targetWs.id,
                        moveModalIdList: selectedModalIds
                    }).done(function (rs) {
                        if(rs.status === 'OK') {
                            for (var i = 0, len = srcModalList.length; i < len; i++) {
                                if( selectedModalIds.indexOf(srcModalList[i].id) > -1 ) {
                                    moveModals.push( srcModalList.splice(i, 1)[0] );
                                    len--;
                                    i--
                                }
                            }
                            moveModals.forEach(function (row) {
                                Array.prototype.push.call(targetModalList, row);
                            });
                        }
                    }).always(function () {
                        Spinner.stop();
                        _this.initSyncWorker();
                    });
                });
            });

            EventAdapter.on($($dialog.find('.wsSet').off('click')), 'click', function(e) {
            //$dialog.find('.wsSet').off('click').on('click', function(e){
                var targetWsId = $(this).attr('data-id');
                var workspaces = _this.store.workspaces;
                $(this).siblings('.wsSet').removeAttr('style');
                $(this).css({backgroundColor: 'rgba(90, 155, 226, 0.2)'});
                $dialog.find('#confirmMove').removeClass('disabled');
                for(var i = 0; i < workspaces.length; i++){
                    if(workspaces[i].id === targetWsId){
                        targetWs =  workspaces[i];
                        break;
                    }
                }
            });
        }

    }

    var observeHelper = {
        watchProp: function (target, props, sign, callback) {
            var _this = this;
            if(!target.__observeProps) target.__observeProps = {};
            props = typeof props === 'string' ? [props] : props;
            props.forEach( function (prop, i) {
                // prevent redefine
                if( target.__observeProps.hasOwnProperty(prop) ) return;
                target.__observeProps[prop] = target[prop];
                Object.defineProperty(target, prop, {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        return this.__observeProps[prop];
                    },
                    set: function (value) {
                        if(value === this.__observeProps[prop]) return;
                        this.__observeProps[prop] = value;
                        callback(sign+'_'+prop, this);
                    }
                });
            } );
        },
        watchArray: function (target, sign, callback) {
            var _this = this;
            target.push = function (data) {
                var old = this.concat();
                var rs = Array.prototype.push.call(this, data);
                callback(sign+'_push', 'push', {oldData: old, newData: this, changeData: data});
                return rs;
            };
            target.pop = function () {
                var old = this.concat();
                var data = Array.prototype.pop.call(this, data);
                callback(sign+'_pop', 'pop', {oldData: old, newData: this, changeData: data});
                return data;
            };
            target.splice = function () {
                var old = this.concat();
                var del = Array.prototype.splice.apply(this, Array.prototype.slice.call(arguments) );
                callback(sign+'_splice', 'splice', {oldData: old, newData: this, changeData: del});
                return del;
            };
            // 自定义 move 方法，用于移动数组中的某个元素
            target.move = function (from, to) {
                var old = this.concat();
                var change = Array.prototype.splice.call(this, to, 0, Array.prototype.splice.call(this, from, 1)[0]);
                callback(sign+'_move', 'move', {oldData: old, newData: this, changeData: change});
            };
            target.moveBatch = function (fromlist, toList) {
                fromList.forEach( function (row, i) {
                    Array.prototype.splice.call(this, row, 1);
                    // toList.
                } );
                // callback
            };

        }
    };

    var SyncWorker = ( function (window, $, buffer) {
        
        function SyncWorker(options) {
            this.options = $.extend({}, DEFAULTS, options);
            this.timer = null;
            // stop ready processing
            this.status = 'stop';
        }

        +function () {
            this.start = (function () {
                function process(once) {
                    var _this = this;
                    var promise = $.Deferred();

                    // 用户自定义 processing 事件执行
                    _this.excuteCallback('onProcessing');
                    _this.status = 'processing';

                    buffer.getFrozenData().then(function (data) {
                        // 若没有数据需要同步，直接结束本次请求
                        if(data === null) {
                            // 同步成功后将缓冲区中的数据清空
                            buffer.removeFrozenData().done(function () {
                                promise.resolve();
                            });
                            return;
                        }

                        console.log('transfer', data);

                        // 发送请求
                        WebAPI.post('/analysis/anlySync/'+AppConfig.userId, data)
                        .then(function (rs) {
                            if(rs.status === 'OK') {
                                // 同步成功后将缓冲区中的数据清空
                                buffer.removeFrozenData().done(function () {
                                    promise.resolve();
                                });
                            } else {
                                promise.reject(-2);
                            }
                        }, function (rs) {
                            promise.reject(-3);
                        });
                    }, function () {
                        promise.reject(-1);
                    });
                    
                    promise.then(function () {
                        // 成功回调
                        _this.excuteCallback('onSuccess');
                    }, function (errCode) {
                        switch(errCode) {
                            case -1:
                                console.warn('获取冻结版本数据失败');
                                break;
                            case -2:
                                console.warn('同步数据失败，接口执行错误');
                                break;
                            case -3:
                                console.warn('同步请求发送失败');
                                break;
                            default: break;
                        }
                        
                        // 失败回调
                        _this.excuteCallback('onFailed', errCode);
                    });

                    // 如果只执行一次
                    if(once) {
                        _this.stop();
                        return;
                    } else {
                        promise.always(function () {
                            if(_this.timer === null) return;
                            _this.timer = window.setTimeout(process.bind(_this), _this.options.interval);
                            _this.status = 'ready';
                        });
                    }
                    
                }

                return function (delay, mode) {
                    var once = mode === 'once' ? true : false;
                    delay = delay === undefined ? this.options.interval : delay;
                    // 只允许启用一次
                    if(this.timer !== null) {
                        this.stop();
                    }

                    this.timer = window.setTimeout(process.bind(this, once), delay);
                    this.status = 'ready';
                };

            } () );

            this.stop = function () {
                if(this.timer) {
                    window.clearTimeout(this.timer);
                    this.timer = null;
                }
                this.status = 'stop';
            };

            this.setOptions = function (options) {
                this.options = $.extend({}, this.options, options);
            };

            this.excuteCallback = function (type, data) {
                typeof this.options[type] === 'function' &&
                    this.options[type](data);
            };
        }.call(SyncWorker.prototype);

        var DEFAULTS = {
            interval: 60000
        };

        return SyncWorker;

    } ( window, jQuery, window.Beop.cache.buffer ) );

    return AnalysisScreen;
})();
