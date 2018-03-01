/**
 * Created by vicky on 2016/1/28.
 */
var Spinner = new LoadingSpinner({color: '#00FFFF'});

try {
    if (ElScreenContainer) {
    }
} catch (e) {
    ElScreenContainer = document.body;
}

try {
    if (AppConfig) {
    }
} catch (e) {
    AppConfig = {
        userId: 1
    }
}

(function () {
    var _this;

    function PageScreen() {
        _this = this;
        this.layout = {
            filterPanel: undefined,
            listPanel: undefined,
            infoPanel: undefined
        };
        
        this.$assetFilterPanel = $('#containerBox');
        this.router = [];
        this.projectConfig = undefined;
        this.displayParams = {arrKey: ['type', 'name', 'desc', 'manager', 'updateTime', 'endTime', 'status', 'model']};//
        this.show();
        this.attachEvent();
    }

    PageScreen.prototype.show = function () {
        var projectId = parseInt(location.href.split('projectId=')[1].split('&')[0]);//window.location.search.match(/\d+/g)
        projectId = parseInt(projectId);
        if (!isNaN(projectId)) {
            AppConfig.projectId = projectId
        }
        this.$assetFilterPanel.attr("data-project",projectId);
        InitI18nResource(navigator.language.split('-')[0]).always(function (rs) {
            I18n = new Internationalization(null, rs);
            _this.initPanels()
        });

    };
    PageScreen.prototype.attachEvent = function () {
        var _this = this;
        $("#containerBox").off("click.infobtn").on("click.infobtn",".infobtn",function(){
            $(".maintainRecordList").show();
            $(".maintainInfo").hide();

            $(".infoTitle").find("span").removeClass("in");
            $(".lChangeR").css("display","none");
            var index = $("#containerBox").find(".infobtn").index($(this));

            $(this).addClass("in");
            $(".lChangeR").eq(index).css("display","block");
        })
        $("#containerBox").on("click",".timeline-item",function(){
            $("#containerBox").find(".infoTitle").hide();
            $("#containerBox").find("#tabBaseInfo").hide();
            $("#containerBox").find("#tabMaintainRecord").hide();
            
            $("#containerBox").find(".maintainInfo").show();
        })
        $("#containerBox").off("click.groupInfo").on("click.groupInfo",".groupInfo",function(){

            $("#containerBox").find(".groupInfo").removeClass("in");
            $(this).addClass("in");
            var groupTitle = $(this).find(".groupTitle").text();
            var id = $(this).attr("data-id");
            var postData = {
                parent: [{
                    id: id,
                    type: "groups"
                }]
            };
            //渲染当前页面 的路径
            var obj = {
                data:[{
                    id:id,
                    type:'groups',
                    title:groupTitle,
                    parentName:''
                }],
                classFun:_this.filterPanel
            };
            _this.router.push(obj);

            _this.$assetFilterPanel.attr("data-thing-id",id);
            _this.filterPanel.initThings(postData,groupTitle);
        })
        $("#containerBox").off("click.thingInfo").on("click.thingInfo",".thingInfo",function(){
            var id = $(this).attr("data-id");
            var type = $(this).attr("data-type");
            var parentName = $(this).attr("data-parentName");
            var name = $(this).find(".thingTitle").text();
            //渲染当前页面 的路径
            var obj = {
                    data:[{
                        id:id,
                        type:type,
                        title:name,
                        parentName:_this
                    }],
                    classFun:PageScreen
                };
            _this.router.push(obj);
            _this.info(id,type,name,parentName);
        })
       // var btnBack = window.parent.document.getElementById('btnBack')
        $(".back").on("tap",function(){
            if(_this.$assetFilterPanel.find(".infoTitle") && _this.$assetFilterPanel.find(".infoTitle").css("display") === "none"){
                $("#containerBox").find(".infoTitle").show();
                $("#containerBox").find("#tabMaintainRecord").show();
                $("#containerBox").find(".maintainInfo").hide();
            }else{
                 _this.backPre.back(_this.router);
                _this.router.splice(_this.router.length-1,1);
            }
        })
    };
    PageScreen.prototype.initPanels = function () {
        this.backPath();
        this.initPanelFilter();
    };
    PageScreen.prototype.backPath = function () {
        this.backPre = new path();
    };
    PageScreen.prototype.initPanelFilter = function () {
        this.filterPanel = new listPanel(this.$assetFilterPanel, null, _this,this.path);
        this.filterPanel.init();
        //渲染当前页面 的路径
        var obj = {
                data:[{
                    id:AppConfig.projectId,
                    type:'',
                    title:'',
                    parentName:''
                }],
                classFun:this.filterPanel
            };
        this.router.push(obj);
        this.filterPanel.setOption();
    };
    PageScreen.prototype.info = function (id,type,name,parentName) {
        var info = '<div class="infoTitle">\
                        <div style="width:50%;float:left;padding: 10px 0;">\
                            <div class="infoButton"><span class="infobtn infoLeft in">台账详情</span></div>\
                        </div>\
                        <div style="width:50%;float:left;padding: 10px 0;">\
                            <div class="infoButton"><span class="infobtn infoRight">维修记录</span></div>\
                        </div>\
                    </div>\
                    <div role="tabpanel" class="tab-pane paneInfo gray-scrollbar gray-scrollbar lChangeR" id="tabBaseInfo" aria-labelledby="baseInfo-tab">\
                    </div>\
                    <div role="tabpanel" class="tab-pane paneInfo gray-scrollbar lChangeR" id="tabMaintainRecord" aria-labelledby="diagnosis-tab" style="display:none">\
                    </div>';
        this.$assetFilterPanel.html(info);
        //判断是 getThingDetail 还是 getPartDetail 接口
        if(type === "ThingPart"){
            var thingPart = '<div class="form-inline" style="background:rgb(250,250,250)">\
                                <div class="form-group" style="text-align:center;">\
                                    <div style="width:100%;margin:1rem;background:rgb(255,255,255);">\
                                        <img src="" id="partImg">\
                                    </div>\
                                </div>\
                                <div class="form-group container">\
                                    <label class="col-xs-4" for="partName">名称：</label>\
                                    <input class="col-xs-8" type="text" class="form-control divValue" id="partName" disabled>\
                                </div>\
                                <div class="form-group container">\
                                    <label class="col-xs-4" for="partModel">型号：</label>\
                                    <input class="col-xs-8" type="text" class="form-control divValue" id="partModel" disabled>\
                                </div>\
                                <div class="form-group container">\
                                    <label class="col-xs-4" for="partSize">规格：</label>\
                                    <input class="col-xs-8" type="text" class="form-control divValue" id="partSize" disabled>\
                                </div>\
                                <div class="form-group container">\
                                    <label class="col-xs-4" for="partBrand">品牌：</label>\
                                    <input class="col-xs-8" type="text" class="form-control divValue" id="partBrand" disabled>\
                                </div>\
                                <div class="form-group container">\
                                    <label class="col-xs-4" for="partSupplier">供应商：</label>\
                                    <input class="col-xs-8" type="text" class="form-control divValue" id="partSupplier" disabled>\
                                </div>\
                                <div class="form-group container">\
                                    <label class="col-xs-4" for="partUnit">单位：</label>\
                                    <input class="col-xs-8" type="text" class="form-control divValue" id="partUnit" disabled>\
                                </div>\
                                <div class="form-group container">\
                                    <label class="col-xs-4" for="partNum">数量：</label>\
                                    <input class="col-xs-8" type="text" class="form-control divValue" id="partNum" disabled>\
                                </div>\
                                <div class="form-group container">\
                                    <label class="col-xs-4" for="partWarningVal">库存警戒值：</label>\
                                    <input class="col-xs-8" type="text" class="form-control divValue" id="partWarningVal" disabled>\
                                </div>\
                                <div class="form-group container">\
                                    <label class="col-xs-4" for="partRemark">备注：</label>\
                                    <input class="col-xs-8" type="text" class="form-control divValue" id="partRemark" disabled>\
                                </div>\
                            </div>';
            $(thingPart).appendTo($("#tabBaseInfo"));
            WebAPI.get('/asset/getPartDetail/' + id).done(function (resultData) {
                var result = resultData.data;
                $("#partImg").attr("src",result.images);//图片地址
                $("#partName").val(result.name);//名称
                $("#partModel").val(result.model);//型号
                $("#partSize").val(result.spec);//规格
                $("#partBrand").val(result.brand);//品牌
                $("#partSupplier").val(result.supplier);//供应商
                $("#partUnit").val(result.unit);//单位
                $("#partNum").val(result.qty);//数量
                $("#partWarningVal").val(result.alarmValue);//库存警戒值
                $("#partRemark").val(result.remark);//备注
            });
        }else{
            var thing = '<div class="form-inline">\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="iptAssetName">名称</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptAssetName" disabled>\
                            </div>\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="selStatus">状态</label>\
                                <select class="col-xs-8" class="form-control divValue" id="selStatus" disabled style="height: 32px;color: #000;border:none;">\
                                    <option value="0">外借</option>\
                                    <option value="1">外修</option>\
                                    <option value="2">使用</option>\
                                    <option value="3">仓库</option>\
                                </select>\
                            </div>\
                             <div class="form-group container">\
                                <label class="col-xs-4" for="iptDescription">描述</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptDescription" disabled>\
                            </div>\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="iptBrand">品牌</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptBrand" disabled>\
                            </div>\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="iptProductArea">产地</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptProductArea" disabled/>\
                            </div>\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="iptSerialNum">序列号</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptSerialNum" disabled>\
                            </div>\
                            <div class="form-group container" style="margin-bottom:8px;">\
                                <label class="col-xs-4" for="iptManager">责任人</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptManager" disabled>\
                            </div>\
                            <div class="form-group container" style="display: block;width: 100%;">\
                                <label class="col-xs-4" for="txtRemark">备注</label>\
                                <textarea id="txtRemark" class="form-control divValue col-xs-8" rows="4" style="width: calc(100% - 100px);border: 1px solid #666;margin-left: 5rem;margin-bottom: 1rem;" disabled></textarea>\
                            </div>\
                            <div class="form-group container" style="margin-bottom:8px;">\
                                <label class="col-xs-4" style="width: 100%;">图片</label>\
                                <input type="file" class="form-control" id="iptAssetPhoto" accept="image/*" style="display: none;"/>\
                                <div id="divAssetImg" style="margin-top: 30px;"></div>\
                                <div id="divQRCodeImg"></div>\
                            </div>\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="iptSupplier">供应商</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptSupplier" disabled>\
                            </div>\
                            <div class="form-group container container">\
                                <label class="col-xs-4" for="iptPurchaser">采购人</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptPurchaser" disabled>\
                            </div>\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="iptBuyPrice">购置价格</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptBuyPrice" disabled>\
                            </div>\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="iptServiceLife">使用寿命</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptServiceLife" disabled/>\
                            </div>\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="iptProductTime">出厂时间</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue datetimepicker" id="iptProductTime" disabled data-format="yyyy-mm-dd" datetimepicker/>\
                            </div>\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="iptOvertime">过保时间</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue datetimepicker" id="iptOvertime" disabled data-format="yyyy-mm-dd" datetimepicker/>\
                            </div>\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="iptAssetId">ID</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptAssetId" disabled>\
                            </div>\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="iptAssetType">资产类型</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptAssetType" disabled>\
                            </div>\
                            <div class="form-group container">\
                                <label class="col-xs-4" for="iptAssetTag">标签</label>\
                                <input class="col-xs-8" type="text" class="form-control divValue" id="iptAssetTag" disabled>\
                            </div>\
                        </div>';
            $(thing).appendTo($("#tabBaseInfo"));
            WebAPI.get('/asset/getThingDetail/' + id).done(function(resultData){
                var result = resultData.data;
                //渲染dom
                $("#iptAssetName").val(name);//资产名称
                $("#selStatus").val(result.status);//状态
                $("#iptDescription").val(result.desc);//描述
                $("#iptBrand").val(result.brand);//品牌
                $("#iptProductArea").val(result.productArea ? result.productArea : '');//产地
                $("#iptSerialNum").val(result.sn);//序列号
                $("#iptManager").val(result.manager);//负责人

                $("#txtRemark").val(result.other ? result.other : '');//备注
                //图片

                $("#iptSupplier").val(result.supplier);//供应商
                $("#iptPurchaser").val(result.buyer);//采购人
                $("#iptBuyPrice").val(result.price);//购置价格
                $("#iptServiceLife").val(result.serviceLife ? result.serviceLife: '');//使用寿命
                $("#iptProductTime").val(result.productTime ? result.productTime.split(' ')[0] : '');//出厂日期
                $("#datetimepicker").val(result.guaranteeTime ? result.guaranteeTime.split(' ')[0] : '');//过保时间
                $("#iptAssetId").val(result._id);//资产id
                $("#iptAssetType").val(_this.filterPanel.dictClass.things[type]?_this.filterPanel.dictClass.things[type].name:'');//资产类型
            });
        }
        this.maintenanceRecord(id);
    };  
    PageScreen.prototype.maintenanceRecord = function(id){
        var maintenanceRecord = '<div class="maintainRecordList">\
                                    <div class="thead container">\
                                        <div class="col-xs-2 yearContainer">\
                                            <div class="recordYear">2016</div>\
                                        </div>\
                                        <div class="col-xs-8">工作内容</div>\
                                        <div class="col-xs-2">负责人</div>\
                                    </div>\
                                    <div class="timeline">\
                                    </div>\
                                    <div class="stroke"></div>\
                                </div>';
        $(maintenanceRecord).appendTo($("#tabMaintainRecord"));

        var  maintainInfo= '<div class="maintainInfo" style="display:none"></div>';
        $(maintainInfo).appendTo(this.$assetFilterPanel);
        //维修记录
        var endTime = (new Date()).format("yyyy-MM-dd hh:00:00");
        var stratTime = new Date(new Date().getTime()-30*24*60*60*1000).format("yyyy-MM-dd hh:00:00");
        var opt = {
            startTime:stratTime,
            endTime:endTime,
            thing_id:id
        }
        WebAPI.post('/asset/maintainRecords/list', opt).done(function (result) {
            $('#tabMaintainRecord').find(".timeline").html("");
            if (result.success) {
                if (result.data.records && result.data.records.length) {
                    _this.records = result.data.records;
                    var str = "";
                    var infoStr = "";
                    for(var i=0,length=_this.records.length;i<length;i++){
                        str += '<article class="timeline-item">\
                                    <div class="tineline-img container">\
                                        <div class="col-xs-2">\
                                            <span>'+_this.records[i].startTime.split(" ")[0].slice(5)+'</span>\
                                        </div>\
                                        <div class="col-xs-8 mainRecoed">\
                                            <span>'+_this.records[i].content+'</span>\
                                        </div>\
                                        <div class="col-xs-2">\
                                            <span>'+_this.records[i].operator+'</span>\
                                        </div>\
                                    </div>\
                                </article>';
                        infoStr +='<table>\
                                        <tbody>\
                                            <tr>\
                                                <td class="col-xs-4">开始时间</td>\
                                                <td class="col-xs-8">'+_this.records[i].startTime+'</td>\
                                            </tr>\
                                            <tr>\
                                                <td class="col-xs-4">结束时间</td>\
                                                <td class="col-xs-8">'+_this.records[i].endTime+'</td>\
                                            </tr>\
                                            <tr>\
                                                <td class="col-xs-4">负责人</td>\
                                                <td class="col-xs-8">'+_this.records[i].operator+'</td>\
                                            </tr>\
                                        </tbody>\
                                    </table>\
                                    <table>\
                                        <tbody>\
                                            <tr>\
                                                <td class="col-xs-4">成本</td>\
                                                <td class="col-xs-8">'+_this.records[i].cost+'</td>\
                                            </tr>\
                                            <tr>\
                                                <td class="col-xs-4">工作内容</td>\
                                                <td class="col-xs-8">'+_this.records[i].content+'</td>\
                                            </tr>\
                                        </tbody>\
                                    </table>';
                    }
                    $('#tabMaintainRecord').find(".timeline").append(str);
                    _this.$assetFilterPanel.find(".maintainInfo").append(infoStr);
                }
            }
        })
    };
    PageScreen.prototype.close = function(id){
        dom.off('touchstart').on('touchstart',function(){router.back();})
    } 
    new PageScreen();
}());