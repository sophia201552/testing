/**
 * PageScreenView
 */
(function () {
    var _this;

    function PageScreenView(pageId, containter) {
        _this = this;
        this.pageId = pageId;

        this.painterCtn = containter;

        this.painter = null;

        this.store = {};
        this.store.layerModelSet = new ModelSet();
        this.store.widgetModelSet = new ModelSet();
        this.store.imageModelSet = new ModelSet();
        this.store.dictPoints = {};
    }

    PageScreenView.prototype = {
        show: function () {
            WebAPI.get('/factory/getPageDetail/'+this.pageId+'/1').done(function (rs) {
                if(!rs || !rs.data) {
                    Log.error('get page detail faild!');
                }
                // 初始化控件
                this.init();
                // 将数据转换成可监控的数据
                this.updateModelSet(rs.data);
                var dsId;
                for (var i = 0 ; i < this.store.widgetModelSet.models.length; i++){
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
                    console.log(e)
                }, true);
                if(Object.keys(this.store.dictPoints).length > 0) {
                    this.workerUpdate.postMessage({
                        pointList: Object.keys(this.store.dictPoints),
                        type: "datasourceRealtime"
                    });
                }
            }.bind(this));
        },
        init: function () {
            // 初始化 painter
            if(this.painter) {
                this.painter.close();
            }
            this.painter = new GReadonlyPainter(this);
            this.painter.show();
        },
        refreshData: function(e){
            var _this = this.self ? this.self : this;
            if (!e.data.error && e.data.dsItemList) {
                var arrModel,model,tempOpt;
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
            } else {
                Log.info('Refresh Data Failed!')
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

            images = data.images.map(function (row) {
                // 创建 Model
                var model = new NestedModel(row);
                return model;
            }, this);

            this.store.imageModelSet.append(images);
            this.store.layerModelSet.append(layers);
            this.store.widgetModelSet.append(widgets);
        },
        close: function () {
            if (this.workerUpdate) this.workerUpdate.terminate();
            this.workerUpdate = null;
        }
    };

    namespace('factory.screens').PageScreenView = PageScreenView;
} ());