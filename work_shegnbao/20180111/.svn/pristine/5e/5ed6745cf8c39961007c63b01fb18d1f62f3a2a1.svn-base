;(function (exports) {
    function BgProp() {
       
    }

    +function () {
        this.attachEvent = function () {
            // 国际化代码
            I18n.fillArea($("#modalBgSel"));
            
            var $modalBgSel = $("#modalBgSel");
            var close = $modalBgSel.find(".close");
            var btnClose = $modalBgSel.find(".btnClose"); 
            var btnSure = $modalBgSel.find(".btnSure"); 

            var _this= this;
            //保存按钮
            btnSure.off("click").on("click", function () {
                var $ulBgVal = $('.ulBgVal');
                var $divBg = $('#divBg');
                var type = $ulBgVal.html();
                if (type === '默认' || type === 'default') {
                    $divBg.attr("data-type",'default');
                    $divBg.find("span").removeClass().addClass("btn btn-default").text(i18n_resource.mainPanel.pageEditModal.SELECT);
                } else if(type === '纯色' || type === 'color'){
                    var color = $('.bgColor').val();;
                    $divBg.attr("data-bg", color).attr('data-type', 'color');
                    $divBg.find("span").removeClass().addClass("btn btn-default").text(i18n_resource.mainPanel.pageEditModal.SELECTED);
                } else if (type === '图片' || type === 'image'){
                    var display = $("#showDisplay").attr("data-view");
                    var previewShowStyle = $(".bgPreviewShow").attr("style");
                    var imgInfo = previewShowStyle.split(";");
                    if(_this.imageInfo === undefined){
                        var pattern = /\"(.*)\"/;
                        var result = imgInfo[0].match(pattern);
                        var image = result[1];
                    }else{
                        var image = _this.imageInfo.url;
                    }
                    $divBg.attr("data-bg", image + "_" + display).attr('data-type', 'image');
                    $divBg.find("span").removeClass().addClass("btn btn-default").text(i18n_resource.mainPanel.pageEditModal.SELECTED);
                }
                $modalBgSel.modal('hide');
            })
              
            $('#ulBg').off('click').on('click', 'a', function () {
                var $current = $(this);
                $(".bgPreviewShow").css("background","");
                _this.bgChange($current);
            });
            $(".bgColor").change(function() {
                $(".bgPreviewShow").css("background-color",$(this).val());
            });
            $('#ulStyle').off('click').on('click', 'a', function () {
                var $current = $(this);
                var $button = $current.closest('ul').siblings('.btn').children();
                $button.eq(0).html( $current.html() );
                var imageType = $current.attr("data-view"); 
                if(imageType == "tile"){
                    $("#btnImg").find("span").eq(0).attr("data-view","tile");
                    $(".bgPreviewShow").css({
                        "background-repeat":"repeat",
                        "background-size":"contain"
                    });
                }else{
                    $("#btnImg").find("span").eq(0).attr("data-view","stretch");
                    $(".bgPreviewShow").css({
                        "background-repeat":"no-repeat",
                        "background-size":"100% 100%"
                    });
                }
            });
            //选择图片
            $("#btnBg").off("click").on("click", function () {
                MaterialModal.show([{ 'title': 'Template', data: ['Image'] }], function (data) {
                    _this.imageInfo = data;
                    var url = data.url;
                    $(".bgPreviewShow").css("background-image", "url(" + url + ")");
                    var imgRepeat = $("#btnImg").find("span").eq(0).attr("data-view");
                    if (imgRepeat == "tile") {
                        $(".bgPreviewShow").css({
                            "background-repeat": "repeat",
                            "background-size": "contain"
                        });
                    } else {
                        $(".bgPreviewShow").css({
                            "background-repeat": "no-repeat",
                            "background-size": "100% 100%"
                        });
                    }
                });
            });
        };

        this.bgChange = function ($current,firstLoad) {
            var $ul = $current.closest('ul');
            var $button = $ul.siblings('.btn').children();
            var $input = $ul.siblings('input');
            var $btnImg = $('#btnImg');
            var $liTxtshow = $btnImg.prev('.txtShow');
            var type = $current[0].dataset.view;
            $button.eq(0).html($current.html());
            if (type === 'default'){
                $input.show().attr('disabled', true).val("#e1e3e5");
                $btnImg.hide();
                $(".bgPreviewShow").css("background","#e1e3e5");
            }else if ( type === 'color' ) {
                $input.show().val('#ffffff').attr('disabled', false);
                $(".bgPreviewShow").css("background-color",$input.val());
                $btnImg.hide();
            } else if ( type === 'image' ) {
                $input.hide();
                $btnImg.show();
            }
        }

    }.call(BgProp.prototype);

    exports.BgProp = new BgProp();
} (window));