/**
 * PageScreen
 */
(function () {
    var _this;

    function PageScreen(options, container) {
        _this = this;

        this.options = options;
        this.page = null;


        this.painterCtn = (function (container) {
            if (typeof container === 'string') {
                return document.querySelector('#' + container);
            } else if (container instanceof HTMLElement) {
                return container;
            } else {
                return null;
            }
        } (container));

        this.painter = null;

        this.store = {};
        this.store.layerModelSet = new ModelSet();
        this.store.widgetModelSet = new ModelSet();
        this.store.imageModelSet = new ModelSet();
        this.store.dictPoints = {};

    }

    PageScreen.prototype = {
        show: function () {
            var promise = $.Deferred();

            if (typeof this.options.template !== 'undefined') {
                // template data 的处理方式
                promise.resolveWith(this, [this.options.template]);
                
            } else if (typeof this.options.templateId !== 'undefined') {
                // template id 的处理方式
                WebAPI.get('/factory/template/' + this.options.templateId).done(function (rs) {
                    rs = rs.content;
                    this.options.template = {
                        page: {
                            width: rs.width,
                            height: rs.height,
                            display: rs.display
                        },
                        data: JSON.parse(rs.template)
                    };
                    promise.resolveWith(this, [this.options.template]);
                }.bind(this));
            } else {
                WebAPI.get('/factory/getPageDetail/'+this.options.id+'/'+AppConfig.isFactory).done(function (rs) {
                    promise.resolveWith(this, [rs]);
                }.bind(this));
            }

            promise.done(function (rs) {
                var dsId;
                if(!rs || !rs.data || !rs.page) {
                    Log.error('get page detail faild!');
                }
                this.page = rs.page;

                // 初始化控件
                this.init();
                // 将数据转换成可监控的数据
                this.updateModelSet(rs.data);
                for (var i = 0, len = this.store.widgetModelSet.models.length; i < len; i++) {
                    dsId = this.store.widgetModelSet.models[i].property('idDs');
                    if(dsId && dsId.length) {
                        dsId = dsId[0]
                    } else {
                        continue;
                    }
                    if(!this.store.dictPoints[dsId]){
                         this.store.dictPoints[dsId] = [];
                    }
                    this.store.dictPoints[dsId].push(this.store.widgetModelSet.models[i]._id());
                }
                this.workerUpdate = new Worker("/static/views/js/worker/workerUpdate.js");
                this.workerUpdate.self = this;
                this.workerUpdate.addEventListener("message", this.refreshData, true);
                this.workerUpdate.addEventListener("error", function (e) {
                    Log.error(e);
                }, true);

                if(Object.keys(this.store.dictPoints).length > 0) {
                    this.workerUpdate.postMessage({
                        pointList: Object.keys(this.store.dictPoints),
                        type: "datasourceRealtime"
                    });
                }
            });
        },
        init: function () {
            // 初始化 painter
            if(this.painter) {
                this.painter.close();
            }
            this.painter = new GReadonlyPainter(this, {
                pageWidth: this.page.width,
                pageHeight: this.page.height,
                // 0 - full screen
                // 1 - show in center
                display: this.page.display
            });
            this.painter.show();
        },
        refreshData: function(e){
            var _this = this.self ? this.self : this;
            var arrModel,model,tempOpt;

            if (e.data.error || !e.data.dsItemList) {
                Log.error('Refresh Data Failed!');
                return;
            }
            
            for (var i = 0, iLen = e.data.dsItemList.length; i < iLen; i++) {
                arrModel = _this.store.dictPoints[e.data.dsItemList[i].dsItemId];
                for (var j = 0; j < arrModel.length;j++){
                    model = _this.store.widgetModelSet.findByProperty('_id', arrModel[j]);
                    tempOpt = model.option();
                    if(tempOpt.trigger && tempOpt.trigger[parseFloat(e.data.dsItemList[i].data).toFixed(0)]){
                        tempOpt.text = tempOpt.trigger[parseFloat(e.data.dsItemList[i].data).toFixed(0)]
                    }else {
                        tempOpt.text = e.data.dsItemList[i].data;
                    }
                    model.option(tempOpt);
                }
            }
        },

        updateModelSet: function (data) {
            var layers, widgets, images;

            layers = data.layers.map(function (row) {
                // 创建 Model
                var model = new NestedModel(row);
                return model;
            }, this);

            widgets = data.widgets.map(function (row) {
                // 创建 Model
                var model = new NestedModel(row);
                return model;
            }, this);

            data.images = data.images || [];
            images = data.images.map(function (row) {
                // 创建 Model
                var model = new NestedModel(row);
                return model;
            }, this);

            this.store.imageModelSet.append(images);
            this.store.layerModelSet.append(layers);
            this.store.widgetModelSet.append(widgets);

            // 更新图层显示顺序
            this.painter.updateLayerOrder();
        },
        close: function () {
            if (this.painter) {
                this.painter.close();
                this.painter = null;
            }

            if (this.painterCtn) {
                this.painterCtn.innerHTML = '';
                this.painterCtn = null;
            }

            this.page = null;
            this.store = null;

            if (this.workerUpdate) {
                this.workerUpdate.terminate();
                this.workerUpdate = null;
            }
        }
    };

    namespace('observer.screens').PageScreen = PageScreen;
} ());