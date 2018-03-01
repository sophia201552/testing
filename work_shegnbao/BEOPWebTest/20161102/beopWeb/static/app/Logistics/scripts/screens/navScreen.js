/**
 * Created by win7 on 2016/10/21.
 */
var NavScreen = (function(){
    function NavScreen(ctn,map){
        this.ctn = ctn;
        this.$ctn = $(this.ctn);
        this.option = undefined;
        this.filter = undefined;
        this.$iframe = undefined;
        this.$iframeCtn = undefined;
        this.mapScreen = map;

        this.spinner = new LoadingSpinner({color: '#00FFFF'});

        this.initOpt();
    }
    NavScreen.prototype = {
        initOpt:function() {
            var _this = this;
            this.option = {
                content: ['search', 'selFilter', 'tabFilter', 'indexTree', 'toolBar'],
                module: {
                    search: {
                        type: 'search'
                    },
                    selFilter: {
                        type: 'selFilter',
                        content:['province','city','district'],
                        option:{
                            province:{
                                type:'province',
                                option:[
                                    {name:'江苏',val:'jiangsu'},
                                    {name:'上海',val:'shanghai'}
                                ]
                            },
                            'city':{
                                type:'city',
                                option:[
                                    {name:'常州',val:'jiangsu'},
                                    {name:'苏州',val:'shanghai'}
                                ]
                            },
                            'district':{
                                type:'city',
                                option:[
                                    {name:'天宁区',val:'tianning'},
                                    {name:'钟楼区',val:'zhonglou'},
                                    {name:'新北区',val:'xinbei'}
                                ]
                            }
                        }
                    },
                    tabFilter: {
                        content: ['Warehouse', 'Transporter'],
                        type: 'tabFilter',
                        option: {
                            Warehouse: {
                                type: 'Warehouse',
                                name: '固定点',
                                click: function () {
                                    _this.triggerGroup('Warehouse')
                                }
                            },
                            Transporter: {
                                type: 'Transporter',
                                name: '移动点',
                                click: function () {
                                    _this.triggerGroup('Transporter')
                                }
                            }
                        }
                    },
                    indexTree: {
                        type: 'indexTree',
                        event: {
                            beforeInit: function () {
                                _this.spinner.spin(_this.ctn);
                                var postData = {
                                    parent:[],
                                    projId:[AppConfig.projectId]
                                };
                                WebAPI.post('/iot/search',postData).done(function(resultData){
                                    if(!resultData.projects[0])return;
                                    var opt = {
                                        callback:_this.divideIndexContent.bind(_this)
                                    };
                                    _this.filter.store = {
                                        groups:[],
                                        projects:[],
                                        things:[]
                                    };
                                    resultData.projects[0].baseType = 'projects';
                                    _this.filter.getChildrenNode(resultData.projects[0],opt);
                                });
                                return false;
                            },
                            onNodeRender:_this.onNodeRender.bind(_this),
                            onClick:_this.onNodeClick.bind(_this)
                        }
                    },
                    toolBar: {
                        type: 'toolBar'
                    }
                },
                theme: null,
                projId: AppConfig.projectId,
                id: null
            }
        },
        init:function(){
            var _this = this;
            WebAPI.get('/static/app/Logistics/scripts/screens/navScreen.html').done(function(result){
                _this.ctn.innerHTML = result;

                _this.$iframeCtn = $('#divPageScreenContainer');
                _this.$iframe = _this.$iframeCtn.find('iframe');

                _this.filter = new IotFilter(_this,_this.ctn,_this.option);
                _this.filter.init();
                _this.attachEvent();
            });
        },
        attachEvent:function(){
            var _this = this;
            $('#btnRemoveIframe').off('click').on('click',function(){
                _this.$ctn.find('.spLink.onLink').removeClass('onLink');
                _this.updateIframe(null,true);
            })
        },
        triggerGroup:function(type){
            this.filter.indexTree.hideNodes(this.filter.indexTree.transformToArray(this.filter.indexTree.getNodes()));
            var node = this.filter.indexTree.getNodesByParam("type",type);
            this.filter.indexTree.showNodes(node)
        },
        divideIndexContent:function(){
            var _this = this;
            var topGroup = this.filter.store.groups.filter(function(group){
                return group.pId == 'None';
            });
            var arrPostData = topGroup.map(function(node){
                return {
                    parent:[{
                        id: node['_id'],
                        type: node['baseType']
                    }],
                    projId:[AppConfig.projectId]
                }
            });

            var deffer = $.Deferred();
            var doneNum = 0;
            var store = {
                groups:[],
                projects:[],
                things:[]
            };
            for (var i = 0; i < arrPostData.length ;i++) {
                WebAPI.post('/iot/search', arrPostData[i]).done(function (resultData) {
                    //Object.keys(resultData).forEach(function(type){
                    //    if(type == 'class')return;
                    //    resultData[type].forEach(function(unit){
                    //        unit.baseType = type;
                    //        unit.isHidden = true;
                    //    });
                    //});
                    //store = {
                    //    groups: store.groups.concat(resultData.groups),
                    //    projects: store.projects.concat(resultData.projects),
                    //    things: store.things.concat(resultData.things)
                    //};
                    fakeData[resultData.things[0].type].forEach(function(unit){
                        unit.baseType = 'things';
                        unit.isHidden = true;
                        unit.type = resultData.things[0].type;
                    });
                    store = {
                        groups: [],
                        projects: [],
                        things: store.things.concat(fakeData[resultData.things[0].type])
                    };
                    doneNum++;
                    if(doneNum == arrPostData.length){
                        deffer.resolve();
                    }
                });
            }
            deffer.done(function(){
                _this.spinner.stop();
                _this.filter.store = store;
                _this.filter.renderIndexTree(_this.filter.body.querySelector('.divIndexTree'));
                _this.attachIndexTreeEvent();
                var type = _this.filter.opt.module.tabFilter.content[0];
                _this.filter.$ctn.find('.divTabBox[data-type="'+ type +'"]').addClass('focus');
                _this.triggerGroup(type)
            })
        },
        updateIndexContent:function(){

        },
        onNodeRender:function(node){
            if(node.type == 'Warehouse'){
                this.onWarehouseRender(node)
            }else{
                this.onTransporterRender(node)
            }
        },
        onNodeClick:function(e,node){
            var $treeDom = $('#iotFilterIndexTree');
            var $pageScreen = $('#divPageScreenContainer');
            var $focusLink = $treeDom.find('.spLink.onLink');
            $focusLink.removeClass('onLink');
            $pageScreen.hide();
            //var status = {
            //    '0': '停止',
            //    '1': '行驶'
            //};
            //$('.amap-marker').find('.dataContainer').empty();
            //$('#echartContainer').empty();
            //var $allMarker=$('.amap-marker').find('.markerDot');
            //$allMarker.removeClass('active animated flash');
            //var $marker=$('[id='+node._id+']');
            //var dataContent;
            //if(node.type=="Transporter"){
            //    dataContent = '<ul class="dataDetail"><li><span>名称:</span><span>' + node.name + '</span></li><li><span>速度:</span><span>' + node.params.speed + 'km/h</span></li><li><span>状态:</span><span>' + status[node.params.status] + '</span></li><li><span>位置:</span><span>' + node.params.gps + '</span></li><li class="btnTool"><button class="btnHisReview" id="btnHisReview">历史回放</button></li></ul>';
            //
            //} else {
            //    dataContent = '<ul class="dataDetail"><li><span>名称:</span><span>' + node.name + '</span></li><li><span>温度:</span><span>' + node.params.temp + '℃</span></li><li class="btnTool"><button class="btnHisReview">查看详情</button></li></ul>';
            //}
            //$marker.find('.dataContainer').html(dataContent);
            //$marker.addClass('active');
            //$marker.addClass('animated flash');
            this.mapScreen.hideTransporterPlane();
            this.mapScreen.selectMarker(node);
        },
        onWarehouseRender:function(node){
            var $target = $('#' + node.tId).find('>a');
            $target.parent()[0].dataset.id = node._id;
            var spTemperature = document.createElement('span');
            var tempVal = node.params?node.params.temp:'';
            spTemperature.className = 'spTemperature spAttr';
            spTemperature.innerHTML = '\
                <span class="spAttrVal spLink" data-point="">' + tempVal + '℃</span>';
            if(tempVal > 11){
                spTemperature.className += ' warning';
            }

            //var spLink = document.createElement('span');
            //spLink.className = 'spLink spNodeTool glyphicon glyphicon-list';

            //$target.append(spLink);
            $target.append(spTemperature);
        },
        onTransporterRender:function(node){
            var $target = $('#' + node.tId).find('>a');
            $target.parent()[0].dataset.id = node._id;

            var spSpeed = document.createElement('span');
            spSpeed.className = 'spSpeed spAttr';
            spSpeed.innerHTML = '<label class="spAttrLabel">车速: ' + (node.params ? node.params.speed : '') + 'km/h</label>';

            var spStatus = document.createElement('span');
            spStatus.className = 'spStatus spAttr';
            spStatus.innerHTML = '\
                <label class="spAttrLabel">状态: ' + (node.params ? this.getTransporterStatus(node.params.status) : '') + '</label>';

            var spTemperature = document.createElement('span');
            spTemperature.className = 'spTemperature spAttr';
            var tempVal = node.params?node.params.temp:'';
            spTemperature.innerHTML = '\
                <span class="spAttrVal" data-point="">'+tempVal+'℃</span>';
            if(tempVal > 11){
                spTemperature.className += ' warning';
            }
            $target.append(spTemperature);
            $target.append(spSpeed);
            $target.append(spStatus);
        },

        getTransporterStatus:function(status){
            switch (status){
                case 0:
                    return '停止';
                case 1:
                    return '行驶'
            }
        },
        attachIndexTreeEvent:function(){
            var _this = this;
            var $treeDom = $('#iotFilterIndexTree');

            var node;
            $treeDom.on('click','.spLink',function(e){
                e.stopPropagation();
                var $target = $(e.currentTarget);
                var $focusLink = $treeDom.find('.spLink.onLink');
                _this.mapScreen.hideTransporterPlane();
                if($target.hasClass('onLink')){
                    $target.removeClass('onLink');
                    _this.updateIframe(null,true);
                    return;
                }
                if($focusLink.length > 0){
                    $focusLink.removeClass('onLink')
                }
                var id = $target.parent().parent()[0].id.slice(0,-2);
                node = _this.filter.indexTree.getNodeByTId(id);
                _this.updateIframe(node.link);
                $target.addClass('onLink');
            })
        },
        updateIframe:function(id,isHide){
            Spinner.spin(this.$iframeCtn[0]);
            if(isHide){
                this.$iframeCtn.hide();
                return;
            }
            this.$iframeCtn.show();
            this.$iframe[0].src = location.origin + '/factory/preview/page/' + id;
            this.$iframe[0].onload = function(){
                Spinner.stop();
            }
        },
        show:function(){
            if(!this.filter)this.init();
            this.$ctn.show();
        },
        hide:function(){
            this.$ctn.hide();
        },
        destroy:function(){
            this.ctn.innerHTML = '';
        }
    };
    return NavScreen
})();