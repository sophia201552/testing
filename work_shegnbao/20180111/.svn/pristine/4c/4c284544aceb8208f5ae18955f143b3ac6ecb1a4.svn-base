// preview.js
+function (window) {
    var screens = namespace('observer.screens');
    var currentScreen;

    window.Spinner = new LoadingSpinner({ color: '#00FFFF' });

    window.AppConfig = {
        isFactory: 1,
        isReportConifgMode: false,
        userId: null,
        menu: [],
        chartTheme: theme.Dark
    };

    AppConfig.datasource = {
        getDSItemById: DataSource.prototype.getDSItemById.bind({
            m_parent: {
                store: {
                    dsInfoList: []
                }
            },
            m_arrCloudTableInfo: []
        })
    };

    $(document).ready(function () {
        initUnit();
        currentScreen = new PreviewProject();
        currentScreen.attachEvents();
        currentScreen.show();
    });
    
    function initUnit(){
        var pageInfo = JSON.parse(document.querySelector('#hidPageInfo').value);
        AppConfig.projectId = pageInfo['onlineProjId'] ? parseInt(pageInfo['onlineProjId']) : '';
        if(AppConfig.projectId !== ""){
            WebAPI.get('/project/getinfo/'+AppConfig.projectId).done(function(rs){
                var proInfo = rs.projectinfo;
                Unit = new window.Unit();
                AppConfig.unit_currency = Unit.getCurrencyUnit(proInfo.unit_currency);
                Unit.getUnitSystem(proInfo.unit_system).always(function (rs) {
                    AppConfig.unit_system = unitSystem;
                }); 
            })
        }else{
            AppConfig.unit_currency = '¥';
            AppConfig.unit_system = unitSystem;
        }
    };

    function PreviewProject() {
        this.pageCtn = document.querySelector('#pageContainer');
        this.pageInfo = JSON.parse(document.querySelector('#hidPageInfo').value);
        AppConfig.userId = document.querySelector('#hidUserId').value;
        this.page = null;
    }

    PreviewProject.prototype.getUrlByPage = function (page) {
        var url = '/factory/preview/{0}/' + page._id;

        switch(page.type) {
            case 'PageScreen':
                return url.format('page');
            case 'FacReportScreen':
                return url.format('report');
            case 'FacReportWrapScreen':
                return url.format('reportWrap');
            case 'EnergyScreen':
                return url.format('dashboard');
            case 'EnergyScreen_M':
                return url.format('dashboard');
            default:
                return 'javascript:alert(\'暂不支持在 web factory 预览此页面，请在线上预览！\');';
        }
    };

    PreviewProject.prototype.show = function () {
        var p = {};
        var _this = this;
       
        WebAPI.get('/factory/getPageList/' + this.pageInfo.projectId + '/1').done(function (result) {

            if (result.status !== 'OK') {
                alert(result.msg);
                return;
            }
            var pageTypes = $("#pageTypes");
            var pages = result.data;
            //转化为需要的数据格式
            // var zProjNodes = _this.generateTreeEx(pages);

            var str = "";
            var allSonArr = [];
            $.each(pages,function(i,obj){
                if(obj.isHide !== 1){
                    if (obj.parent == "" || obj.parent == undefined) {
                        //写入导航栏里的预览一级目录
                        if (obj.type == "DropDownList") {
                            str += '<li class="first"><a class="firstText ' + obj.type + '" href="javascript:;" target="myFrame" id="' + obj._id + '"><span class="glyphicon glyphicon-' + obj.pic + '"></span>' + obj.text.split(" - ")[0] + '<span class="glyphicon glyphicon-chevron-down"></span></a><ul class="secondList"></ul></li>';
                        } else {
                            str += '<li class="first"><a class="firstText ' + obj.type + '" href="' + _this.getUrlByPage(obj) + '" target="myFrame" id="' + obj._id + '"><span class="glyphicon glyphicon-' + obj.pic + '"></span>' + obj.text.split(" - ")[0] + '</a></li>';
                        }
                    } else {
                        allSonArr.push(obj)
                    }
                }
                
            });
            pageTypes.html(str);

            var sonStr = "";
            var sameNum = [];
            $.each(allSonArr,function(i,secondSonObj){
                pageTypes.find(".first").each(function(){
                    if($(this).find(".firstText").attr("id") == secondSonObj.parent){
                        if(secondSonObj.type == "DropDownList"){
                            sonStr = '<li><a href="javascript:;" target="myFrame" id="'+secondSonObj._id+'" class="secondText '+secondSonObj.type+'"><span class="glyphicon glyphicon-'+secondSonObj.pic+'"></span>'+secondSonObj.text.split(" - ")[0]+'<span class="glyphicon glyphicon-chevron-down"></span></a><ul class="thirdList"></ul></li>';
                        }else{
                            sonStr = '<li><a href="' + _this.getUrlByPage(secondSonObj) + '" target="myFrame" id="'+secondSonObj._id+'" class="secondText '+secondSonObj.type+'"><span class="glyphicon glyphicon-'+secondSonObj.pic+'"></span>'+secondSonObj.text.split(" - ")[0]+'</a></li>';
                        }
                        $(sonStr).appendTo($(this).find(".secondList"));
                        sameNum.push(i);
                        
                    }
                })
            });

            var thirdSonArr = allSonArr;
            for(var i = 0;i<sameNum.length;i++){
                thirdSonArr.splice(sameNum[i],1," ");
            }

            var thirdSonStr = "";
            var thirdListContainer = $(".thirdList");
            $.each(thirdSonArr,function(i,thirdSonObj){
                thirdListContainer.each(function(){
                    if(thirdSonObj == " "){
                        return;
                    }else{
                        if($(this).prev("a").attr("id") == thirdSonObj.parent){
                            thirdSonStr = '<li><a href="' + _this.getUrlByPage(thirdSonObj) + '" target="myFrame" id="'+thirdSonObj._id+'" class="thirdText"><span class="glyphicon glyphicon-'+thirdSonObj.pic+'"></span>'+thirdSonObj.text.split(" - ")[0]+'</a></li>';
                            $(thirdSonStr).appendTo($(this));
                        }
                    }
                })
            });

            $("#myFrame").show();
            //导航ul的宽度
            var ulW;
            var wSum = 0;

            $(".first").each(function(){
                var _this = this;
                wSum += $(this).width()+10;
            });
            pageTypes.css("width",wSum);
            
            var $pageTypesAS = $(pageTypes).find("a");
            $.each($pageTypesAS,function(i,dom){
                if($("#myFrame").attr("src")){
                    return;
                }
                if(i == 0){
                   if($pageTypesAS.eq(0).hasClass("DropDownList")){
                        $pageTypesAS.eq(0).addClass("selected");
                        $pageTypesAS.eq(1).addClass("selected");
                    }else{
                        $pageTypesAS.eq(0).addClass("selected");
                        $("#myFrame").attr("src",$pageTypesAS.eq(i).attr("href"));
                    } 
                }else{
                    $("#myFrame").attr("src",$pageTypesAS.eq(i).attr("href"));
                }
            });
            //导航 点击事件
            //点击一级导航
            var  $pageTypesBox = $("#pageTypesBox");
            var navHeight;
            $(pageTypes).find("a.firstText").off("click").on("click",function(){
                if($(this).hasClass("selected")){
                    if($(this).next(".secondList").css("display") === "none"){
                        $(this).next(".secondList").show();
                    }else{
                        $(this).removeClass("selected");
                        $(this).next(".secondList").hide();
                    }
                }else{
                    $(".secondList").hide();
                    $(pageTypes).find("a").removeClass("selected");
                    $(this).addClass("selected");
                    $(this).next(".secondList").show();
                }
                navHeight = $(".first").height() + $(this).next(".secondList").height();
                $pageTypesBox.height(navHeight+'px');

                if($(this).attr("href") !== "javascript:;"){
                    $(".secondList").hide();
                    $(".thirdList").hide();
                    $(pageTypes).find("a").removeClass("selected");
                    $(this).addClass("selected");
                    $("#pageTypesBox").height("100%");
                }
            })
            //二级导航
            $(pageTypes).find("a.secondText").off("click").on("click",function(){
                if($(this).hasClass("selected")){
                    $(this).removeClass("selected");
                    $(this).next("ul").hide();
                }else{
                    $(".thirdList").hide();
                    $(pageTypes).find("a").removeClass("selected");

                    $(this).closest('ul').prev("a").addClass('selected');
                    $(this).addClass("selected");
                    $(this).next("ul").show();
                }
                navHeight = $(".first").height() + $(this).closest("ul").height() + $(this).next("ul").height();
                $pageTypesBox.height(navHeight+'px');

                if($(this).attr("href") !== "javascript:;"){
                    $(".secondList").hide();
                    $(".thirdList").hide();
                    $(pageTypes).find("a").removeClass("selected");
                    $(this).addClass("selected");
                    $("#pageTypesBox").height("100%");
                }
            })
            //三级导航
            $(pageTypes).find("a.thirdText").off("click").on("click",function(){
                if($(this).attr("href") !== "javascript:;"){
                    $(".secondList").hide();
                    $(".thirdList").hide();
                    $(pageTypes).find("a").removeClass("selected");
                    $(this).addClass("selected");
                    $("#pageTypesBox").height("100%");
                }
            })
            //导航左右按钮点击事件
            //div的宽度   UL
            var $divPages = $("#pageTypesBox");
            var $ulPages = $("#pageTypes");
            var divPagesW = $divPages.width();
            var ulPagesW = $ulPages.width();
            var isPlay = false;
            //ulW > divW  出现左右按钮
            if(divPagesW < ulPagesW){
                $("#pagesPreviewNav").find(".scrollBtn").show();
                $('#scrollBtnRight').click(function () {
                    if (isPlay) return;
                    if (-parseInt($ulPages.css('marginLeft')) > ulPagesW - divPagesW)return;
                    isPlay = true;
                    $ulPages.animate({"marginLeft": "-=100px"}, function () {
                        isPlay = false;
                    })
                });
                $('#scrollBtnLeft').click(function () {
                    if (isPlay) return;
                    if (-parseInt($ulPages.css('marginLeft')) < 100)return;
                    isPlay = true;
                    $ulPages.animate({"marginLeft": "+=100px"}, function () {
                        isPlay = false;
                    })
                });       
            }else{
                $("#pagesPreviewNav").find(".scrollBtn").hide();
            }
        });
        
    };

    PreviewProject.prototype.attachEvents = function () {
        var _this = this;
        // 自适应
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            _this.page.resize();
        });


    };

    PreviewProject.prototype.close = function () {};

}.call(this, window);