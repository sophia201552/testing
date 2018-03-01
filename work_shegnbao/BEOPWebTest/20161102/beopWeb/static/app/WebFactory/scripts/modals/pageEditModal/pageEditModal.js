var PageEditModal = (function () {
    var _this = undefined;

    function PageEditModal() {
        _this = this;
        _this.src = undefined;
        _this.callback = undefined;
    }
    
    PageEditModal.prototype.show = function(src, callback) {
        _this.src = src;
        _this.callback = callback;
        var $modalPageEdit = $('#pageEditModal');

        if (!$modalPageEdit || 0 == $modalPageEdit.length) {
            WebAPI.get('/static/app/WebFactory/scripts/modals/pageEditModal/pageEditModal.html').done(function (resultHTML) {
                _this.$contain = $(resultHTML);
                _this.init();
                _this.$contain.modal('show');
                if(_this.src.projId !== ""){
                    _this.$contain.find('.modal-title').html(i18n_resource.mainPanel.pageEditModal.EDIT_PAGE_TITLE);
                }else{
                    _this.$contain.find('.modal-title').html(i18n_resource.mainPanel.pageEditModal.ADD_PAGE_TITLE);
                }
            }).always(function(e) {
            });
        }
        else {
            $modalPageEdit.modal('show');
            _this.init();
        }
    };

    PageEditModal.prototype.init = function() {
        I18n.fillArea(_this.$contain);

        _this.$btnOk = _this.$contain.find('#btnOk');
        _this.$inputPageName = _this.$contain.find('#inputPageName');
        _this.$selectPageType = _this.$contain.find('#selectPageType');
        _this.$divPageSize = _this.$contain.find('#divPageSize');
        _this.$inputPageWidth = _this.$contain.find('#inputPageWidth');
        _this.$inputPageHeight = _this.$contain.find('#inputPageHeight');
        _this.$divPageDisplay = _this.$contain.find('#divPageDisplay');
        _this.$divReportType = _this.$contain.find('#divReportType');
        _this.$divPageUrl = _this.$contain.find('#divUrl');
        _this.$selectPageDisplay = _this.$contain.find('#selectPageDisplay');
        _this.$selectReportType = _this.$contain.find('#divReportType select');
        _this.$selectPageUrl = _this.$contain.find('#divUrl input');
        _this.$selectPageDisplayOption = _this.$contain.find('#selectPageDisplay option');
        _this.$iconBtton = _this.$contain.find('#divIcon span');
        _this.$bgBtton = _this.$contain.find('#divBg span');

        
        _this.$inputPageName.val(_this.src.name.split(' - ')[0]);
        _this.$selectPageType.val(_this.src.type).attr('data-type',_this.src.type);
        _this.$inputPageWidth.val(_this.src.width);
        _this.$inputPageHeight.val(_this.src.height);
        _this.$selectPageDisplayOption.eq(_this.src.display).prop('selected',true);
        _this.$iconBtton.attr("pic-name","");
        if(_this.src.reportType === '' || typeof(_this.src.reportType) === "undefined"){
           _this.$selectReportType.val('0');
        }else{
            _this.$selectReportType.val(_this.src.reportType);
        }
        if(_this.src.reportFolder === '' || typeof(_this.src.reportFolder) === "undefined"){
            _this.$contain.find('#divUrl input').val('');
        }else{
            _this.$contain.find('#divUrl input').val(_this.src.reportFolder);
        }
        if(_this.src.iconSkin == "" || typeof(_this.src.iconSkin) === "undefined"){
            _this.$iconBtton.removeClass().addClass("btn btn-default").text(i18n_resource.mainPanel.pageEditModal.SELECT);
        }else{
            _this.$iconBtton.removeClass().text("").addClass("btn btn-default glyphicon glyphicon-"+_this.src.iconSkin);
        }
        $("#divBg").removeAttr("data-bg");
        if(typeof(_this.src.option) === "undefined" || _this.src.option.background.type == "" ){
            _this.$bgBtton.removeClass().addClass("btn btn-default").text(i18n_resource.mainPanel.pageEditModal.SELECT);
        }else{
            _this.$bgBtton.removeClass().addClass("btn btn-default").text(i18n_resource.mainPanel.pageEditModal.SELECTED);
            if(_this.src.option.background.type == "image"){
                $("#divBg").attr("data-bg",_this.src.option.background.url+'_'+_this.src.option.background.display);
            }else{
                $("#divBg").attr("data-bg",_this.src.option.background.color);
            }
        }
        _this.attachEvents();
        if(_this.src.disabled === 1){
            _this.$selectPageType.prop('disabled',true);
        }else {
            _this.$selectPageType.prop('disabled',false);
        }

        _this.$selectPageType.trigger('change');
    };

    PageEditModal.prototype.close = function() {
        _this.$contain.remove();
    };
    PageEditModal.prototype.rgbToHex = function(rgb){
        var rgbArr = rgb.split(","); 
        var r = Number(rgbArr[0].split("rgb(")[1]);
        var g = Number(rgbArr[1]);
        var b = Number(rgbArr[2].split(")")[0]);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };
    PageEditModal.prototype.attachEvents = function() {
        
        _this.$selectPageType.change(function(e) {

            if ('PageScreen' === this.value) {
                _this.$divPageSize.show();
                _this.$divPageDisplay.show();
                $("#divBg").show();
                _this.$divReportType.hide();
                _this.$divPageUrl.hide();
            }else if(this.value === 'ReportScreen'){
                _this.$divPageSize.hide();
                _this.$divPageDisplay.hide();
                $("#divBg").hide();
                _this.$divReportType.show();
                _this.$divPageUrl.show();
            }
            else {
                _this.$divPageSize.hide();
                _this.$divPageDisplay.hide();
                $("#divBg").hide();
                _this.$divReportType.hide();
                _this.$divPageUrl.hide();
            }
        });
        //点击icon的按钮
        _this.$iconBtton.off("click").on("click",function(){
            WebAPI.get('static/scripts/spring/entities/modalMonitor.html').done(function(resultHTML){
                var $iconContainer = $('<div class="modal fade in">');
                $iconContainer.appendTo($("body"));
                $iconContainer.append($(resultHTML)).show();
                $("#ttlIconTool").html("").attr("i18n","mainPanel.iconSelect.ICON_TITLE");
                $(".btnSure").prev().html("").attr("i18n","mainPanel.pageEditModal.CLOSE");
                $(".btnSure").html("").attr("i18n","mainPanel.pageEditModal.SURE");
                // 国际化代码
                I18n.fillArea($iconContainer);
                $("#divColorSel").hide();
                var $modalIcon = $("#modalIconSel");
                $modalIcon.addClass("in").css("color","#666").show();

                var close = $modalIcon.find(".close");                  
                var closeBtn = $('button[data-dismiss = "modal"]');
                var btnSure = $modalIcon.find(".btnSure");  
                close.click(function(){
                    $iconContainer.remove();
                })
                closeBtn.click(function(){
                    $iconContainer.remove();
                })
                $modalIcon.find('.bs-glyphicons-list>li').click(function(e){
                    if($(e.currentTarget).hasClass('selected'))return;
                    $('.bs-glyphicons-list>li.selected').removeClass('selected');
                    $(e.currentTarget).addClass('selected');
                });
                btnSure.click(function(){
                    var icon = $('.bs-glyphicons-list>li.selected>.glyphicon-class').text();
                    if(icon == ""){
                        $("#divIcon").find("span").attr("i18n","mainPanel.pageEditModal.SELECT");
                    }else{
                        _this.$iconBtton.text("").removeClass().addClass("btn btn-default "+icon).attr("pic-name",icon.replace("glyphicon glyphicon-","")); 
                    }
                    close.trigger("click");
                    
                })
            })
        })
        
        //点击bg的按钮
        _this.$bgBtton.off("click").on("click",function(){
            WebAPI.get('/static/app/WebFactory/scripts/modals/bgModal/bgProp.html').done(function(resultHTML){
                var $bgContainer = $('<div class="modal fade in" id="bgContainer">');
                $bgContainer.appendTo($("body"));
                $bgContainer.append($(resultHTML)).show();
                
                var $modalBgSel = $("#modalBgSel");
                $modalBgSel.addClass("in").css("color","#666").show();
                $("#divBg").attr("data-bg","");
                if(typeof(_this.src.option) === "undefined" || _this.src.option.background.type == ""){
                    $(".ulBgVal").attr("i18n","mainPanel.bgSelect.BG_COLOR");
                    $(".bgColor").show().val("#e1e3e5");
                    $('#btnImg').hide();
                    $(".bgPreviewShow").css("background","");
                }else{
                    if(_this.src.option.background.type == "image"){
                        $(".ulBgVal").attr("i18n","mainPanel.bgSelect.BG_IMAGE");
                        $(".bgColor").hide();
                        $("#btnImg").show();
                        //背景属性面板
                        if(_this.src.option.background.display == "tile"){
                            $(".bgPreviewShow").css({
                                "background-image":"url("+_this.src.option.background.url+")",
                                "background-repeat":"repeat",
                                "background-size":"tile"
                            })
                        }else{
                            $(".bgPreviewShow").css({
                                "background-image":"url("+_this.src.option.background.url+")",
                                "background-repeat":"no-repeat",
                                "background-size":"100% 100%"
                            })
                        }
                    }else{
                        var color;
                        if(_this.src.option.background.color.indexOf("#") == -1){
                            color = _this.rgbToHex(_this.src.option.background.color);
                        }else{
                            color = _this.src.option.background.color;
                        }   
                        $(".ulBgVal").attr("i18n","mainPanel.bgSelect.BG_COLOR");
                        $("#btnImg").hide();
                        $(".bgColor").val(color).show();
                        $(".bgPreviewShow").css("background",_this.src.option.background.color);
                    }
                }
                window.BgProp.attachEvent();
            })
            
        })
        _this.$btnOk.off().click(function(e) {
            var projId = $("#lkName").attr("data-projId");
            var pageName = _this.$inputPageName.val();
            var pageType = _this.$selectPageType.val() === null?_this.$selectPageType.attr('data-type'):_this.$selectPageType.val();
            if(pageType === 'ReportScreen' && _this.$selectPageUrl.val() === ''){
                alert('请输入页面路径！');
                return;
            }
            var pageWidth = parseInt(_this.$inputPageWidth.val(), 10);
            var pageHeight = parseInt(_this.$inputPageHeight.val(), 10);
            var pageDisplay = parseInt(_this.$selectPageDisplay.val());
            var reportType = _this.$selectReportType.val();
            var pageUrl = _this.$selectPageUrl.val();
            var pageIcon = _this.$iconBtton.attr("pic-name");
            var pageBg = $("#divBg").attr("data-bg");
            var background = {
                    color:'',
                    type:'',
                    url:'',
                    display:''
                }
            if(typeof(pageBg) === "undefined"){
                if(typeof(_this.src.option) === "undefined" ){
                    var objPageCfg = {projId:projId, name:pageName, type:pageType, width:pageWidth, height:pageHeight, display:pageDisplay,reportType:reportType, reportFolder:pageUrl, iconSkin:pageIcon};
                }else{
                    var objPageCfg = {projId:projId, name:pageName, type:pageType, width:pageWidth, height:pageHeight, display:pageDisplay,reportType:reportType,reportFolder:pageUrl,iconSkin:pageIcon,option:_this.src.option};
                    if(_this.src.option.background.type === ""){
                        background = {
                            color:'#e1e3e5',
                            type:'color',
                            url:'',
                            display:''
                        }
                        var objPageCfg = {projId:projId, name:pageName, type:pageType, width:pageWidth, height:pageHeight, display:pageDisplay,reportType:reportType,reportFolder:pageUrl,iconSkin:pageIcon,option:{background:background}};
                    }
                }
            }else{
                if(pageBg == "" || typeof(pageBg) == "undefined"){
                    background = {
                        color:'#e1e3e5',
                        type:'color',
                        url:'',
                        display:''
                    }
                }else if(pageBg.indexOf("http") == 0){
                    background = {
                        color:'',
                        type:'image',
                        url:pageBg.split('_')[0],
                        display:pageBg.split('_')[1]
                    }
                }else if(pageBg.indexOf("rgb") == 0 || pageBg.indexOf("#") == 0){
                    background = {
                        color:pageBg,
                        type:'color',
                        url:'',
                        display:''
                    }
                }
                var objPageCfg = {projId:projId, name:pageName, type:pageType, width:pageWidth, height:pageHeight, display:pageDisplay,reportType:reportType,reportFolder:pageUrl,iconSkin:pageIcon,option:{background:background}};
           }
            
            _this.callback(objPageCfg);
            _this.$contain.modal('hide');
            $(".edit").hide();
        });
    };

    PageEditModal = new PageEditModal();
    return PageEditModal;
})();