/**
 * Created by win7 on 2015/9/14.
 */
var ProjectSel = (function(){
    var _this;
    ProjectSel.navOptions = {
        top: '<span id="roomName" class="topNavTitle" i18n="admin.navTitle.ROOM"></span>\
            <span class="topNavRight" id="btnConfig">\
                  <span class="iconfont icon-shezhi" aria-hidden="true"></span>\
            </span>',
        bottom: true
    };

    function ProjectSel(){
        _this = this;
        this.isModal = false;
        this.$qrcodePane = undefined;
    }

    ProjectSel.prototype = {
        show:function(){
            WebAPI.get('static/app/temperatureControl/views/admin/projectSel.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                I18n.fillArea($('#indexMain'));
                I18n.fillArea($('#navTop'));
                _this.init();
            });
        },
        init:function(){
            AppConfig.roomInit = false;
            this.$qrcodePane = $('#qrcodePane');
            _this.initRoom();
            _this.initRoomToggle();
            _this.attachEvents();
        },
        initRoom:function(){
            var room, checkbox, span, grade, label,spanName;
            var map, img, imgMask, roomName;
            var roomList = document.getElementById('projectSel');
            var mapList = document.getElementById('divMapList');
            var divUserName = document.getElementById('divUserName');
            var imgUser = document.getElementById('imgUser');
            divUserName.innerHTML = AppConfig.userProfile ? AppConfig.userProfile.fullname : AppConfig.userProfile.name;
            if(AppConfig.userProfile.picture){//头像
                imgUser.src = 'http://images.rnbtech.com.hk' + AppConfig.userProfile.picture;
            }

            roomList.innerHTML = '';
            mapList.innerHTML = '';
            if(!roomAll || roomAll.length == 0){
                //todo 提示关联房间
                window.plugins && window.plugins.toast.show(I18n.resource.admin.roomPage.NO_ROOM_TIP, 'short', 'center');
                return;
            }
            for (var i= 0, j = roomAll.length; i < roomAll.length; i++, j--){
                room = document.createElement('div');
                room.className = 'divRoom listBorder light';
                room.id = roomAll[i]["_id"];

                /*location = document.createElement('i');
                location.className = 'iconfont location';
                location.innerHTML = '&#xe64f';
                room.appendChild(location);*/

                grade = document.createElement('span');
                if(roomAll[i].grade === 30){
                    grade.className = 'glyphicon glyphicon-king';   
                }else if(roomAll[i].grade === 20){
                    grade.className = 'glyphicon glyphicon-queen';
                }else if(roomAll[i].grade === 10){
                    grade.className = 'glyphicon glyphicon-pawn';
                }

                spanName = document.createElement('span');
                spanName.textContent = roomAll[i].name;
                spanName.className = 'name';

                checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'regular-checkbox';
                checkbox.id = 'ckRoom_' + room.id;
                if(roomAll[i].grade === 0) checkbox.setAttribute('disabled', true);

                label = document.createElement('label');
                label.className = 'hidden';
                label.setAttribute('for', checkbox.id);

                room.appendChild(checkbox);
                room.appendChild(label);
                roomList.appendChild(room);
                room.appendChild(spanName);
                room.appendChild(grade);

                map = document.createElement('div');
                map.className = 'divImgItem';
                map.id = roomAll[i]._id;
                map.style.zIndex = j;

                img = document.createElement('img');
                img.src = roomAll[i].params.map.img;
                if(curRoom && roomAll[i]._id == curRoom._id){
                    map.classList.add('active');
                }

                imgMask = document.createElement('div');
                imgMask.className = 'imgMask';

                roomName =document.createElement('div');
                roomName.innerHTML = grade.outerHTML + roomAll[i].name;
                roomName.className = 'roomName';

                imgMask.appendChild(roomName);
                map.appendChild(imgMask);
                map.appendChild(img);
                mapList.appendChild(map);
            }

            //权限
            if($(':checkbox:disabled').length == roomAll.length){
                $('#btnQrcode').hide();// 我的二维码
                $('#listPane').find('#btnQrcode').hide();//列表 我的二维码
                $('#btnEdit').hide();//地图 编辑按钮
                $('#btnEditList').hide();//列表 编辑按钮
            }

            $(roomList)
        },
        initRoomToggle:function(){
            var ctn = document.getElementById('projectSel');
            $(ctn).hammer().on('tap',function(e){
                //点击复选框或者编辑状态时,不需要切换房间
                if(e.gesture.changedPointers[0].target.tagName == 'LABEL' || !$('#btnCancel').is(':hidden')) return;
                var $target = $(e.gesture.changedPointers[0].target).hasClass('divRoom') ?  $(e.gesture.changedPointers[0].target) : $(e.gesture.changedPointers[0].target).parent();
                if ($target.length == 1){
                    AppConfig.roomId = $target[0].id;
                    AppConfig.roomInit = true;
                    router.to({
                        typeClass:ObserverScreen
                    })
                }
            });


        },
        attachEvents: function(){
            var $btnEdit = $('#btnEdit');
            var $btnEditList = $('#btnEditList');
            var $btnAddList = $('#btnAddList,#btnAdd');
            var $btnCancel = $('#btnCancel');
            var $btnGenerate = $('#btnGenerate');

            var $roomPane = $('#roomPane');
            var $inviteCodePane = $('#inviteCodePane');

            var $scanCode = $('[id="scanCode"]');
            var $inviteCode = $('[id="inviteCode"]');
            var $btnQrcode = $('[id="btnQrcode"]');
            var $menu;

            //编辑按钮
            $btnEdit.hammer().off('tap').on('tap', function(){
                $('[data-target="listPane"]').trigger('touchend');
                $btnEditList.trigger('touchend');
            });
            $btnEditList.off('touchend').on('touchend', function(){
                $(':checkbox:disabled').parent().addClass('disabled');
                $('.divRoom label').removeClass('hidden');
                $(this).addClass('hidden');
                $('#btnAddList').addClass('hidden');
                $btnGenerate.removeClass('hidden');
                $btnCancel.removeClass('hidden');
            });

            //退出编辑状态
            $btnCancel.hammer().off('tap').on('tap', function(){
                quitEdit();
                $btnAddList.removeClass('hidden');
                $btnEditList.removeClass('hidden');
            });

            function quitEdit(){
                $(':checkbox:disabled').parent().removeClass('disabled');
                $('.divRoom label').addClass('hidden');
                $btnCancel.addClass('hidden');
                $btnGenerate.addClass('hidden');
                $btnEditList.removeClass('hidden');
                $btnAddList.removeClass('hidden');
            }

            //生成二维码
            $btnGenerate.hammer().off('tap').on('tap', function(){
                var postData = {
                       'userId': AppConfig.userId,
                       'elapse': 14,
                       'arrRoomIds': []
                    }

                $('.divRoom input:checked').each(function(){
                    var id = $(this).parent('.divRoom').attr('id');
                    id && postData.arrRoomIds.push(id);
                });
                if(postData.arrRoomIds.length == 0){
                    window.plugins && window.plugins.toast.show(I18n.resource.admin.roomPage.SELECT_ROOM, 'short', 'center');
                    return;
                }
                WebAPI.post('/appTemperature/token/create', postData).done(function(result){
                    _this.makeQrcode(result);
                    quitEdit();
                })
            });

            //添加房间, 即关联房间$btnAdd
            $btnAddList.off('touchstart').on('touchstart', function (e) {
                $menu = $(this).find('.dropdown-menu');
                $menu.toggle();
            });
            
            $scanCode.off('touchstart').on('touchstart', function (e) {
                e.preventDefault();
                e.stopPropagation();
                quitEdit();
                $menu.hide();
                if (typeof cordova != 'undefined') {
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            console.log("We got a barcode\n" +
                                "Result: " + result.text + "\n" +
                                "Format: " + result.format + "\n" +
                                "Cancelled: " + result.cancelled);
                            //todo
                            relateRoom(result.text);
                        },
                        function (error) {
                            console.log("Scanning failed: " + error);
                        }
                    );
                } else {
                    //relateRoom('56f8ec67fa17231610d91f0d');
                }
            });

            $inviteCode.off('touchstart').on('touchstart', function (e) {
                e.preventDefault();
                e.stopPropagation();
                quitEdit();
                $menu.hide();
                $inviteCodePane.removeClass('hidden');
                $roomPane.addClass('hidden');
                //确定按钮
                $('#btnInviteCode').off('touchstart').on('touchstart', function () {
                    relateRoom($('#iptInviteCode').val())
                });
                //取消按钮
                $('#btnCancelInvite').off('touchstart').on('touchstart', function () {
                    $menu.hide();
                    $inviteCodePane.addClass('hidden');
                    $roomPane.removeClass('hidden');
                });
            });

            //查看二维码列表
            $btnQrcode.off('touchstart').on('touchstart', function (e) {
                e.preventDefault();
                e.stopPropagation();
                quitEdit();
                $menu.hide();
                _this.getTokenList();

                $menu.hide();
                $roomPane.addClass('hidden');
                $inviteCodePane.addClass('hidden');
                _this.$qrcodePane.removeClass('hidden');
            });


            function relateRoom(token) {
                var postData = {
                    tokenId: token,
                    userId: AppConfig.userId
                }
                WebAPI.post('/appTemperature/token/corelateRoom', postData).done(function (result) {
                    //AppConfig.roomId =
                    if (result) {
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.roomPage.CORRECT_ASSOCIATION, 'short', 'center');
                        //获取新的房间列表
                        _this.getRoomList();
                        $menu.hide();
                        $inviteCodePane.addClass('hidden');
                        $roomPane.removeClass('hidden');
                    } else {
                        window.plugins && window.plugins.toast.show(I18n.resource.admin.roomPage.ASSOCIATED_FAILURE, 'short', 'center');
                        $menu.hide();
                    }  
                });
            }
            //配置按钮
            $('#btnConfig').off('touchstart').on('touchstart', function (e) {
                router.to({
                    typeClass: AdminConfigure
                });
                e.preventDefault();
            });

            //编辑状态时, 选择房间, 避免只有点击checkbox才能打钩
            $('.divRoom').off('touchend').on('touchend', function(e){
                var $label = $(this).children('label');
                if(!$label.hasClass('hidden') && !$(this).hasClass('disabled')){
                    if($label.prev('input').prop('checked')){
                        $label.prev('input').prop('checked', false);
                    }else{
                        $label.prev('input').prop('checked', true);
                    }
                    e.preventDefault();
                }
            });

            $('.btnTabRoom').off('touchend').on('touchend', function () {
                $(this).addClass('active').siblings().removeClass('active');
                $('#' + this.dataset.target).addClass('active').siblings().removeClass('active');
            });

            var map = document.getElementById('divMapList');
            var mapTouch = {}, timer = null;
            var where = 'top';
            var maxScrollTop = $(map).find('.divImgItem').length * $(map).find('.divImgItem').height() - $(map).height();
            var $items = $('#divMapList .divImgItem');
            var centerLine = $(map).height() / 2;
            //房间上下滑动
            map.addEventListener('touchstart', touchstart, false);
            map.addEventListener('touchmove', touchmove, false);
            map.addEventListener('touchend', touchend, false);
            $(map).off('scroll').on('scroll', function () {
                var scrollTop = $(this).scrollTop();
                $items.each(function (i, item) {
                    var top = $(item).offset().top;
                    var height = item.offsetHeight;
                    if ((top <= centerLine + height / 3) && (top >= centerLine - height / 3)) {
                        $(item).addClass('active').siblings('.divImgItem.active').removeClass('active');
                    }
                })
                if (scrollTop >= maxScrollTop-10) {
                    where = 'bottom';
                } else if (scrollTop < maxScrollTop-10 && scrollTop > 10) {
                    where = 'center';
                } else {
                    where = 'top';
                }
            })
            function touchstart(e) {
                mapTouch = {
                    x: e.changedTouches[0].pageX,
                    y: e.changedTouches[0].pageY,
                    isMove: false
                }
            }
            function touchmove(e) {
                if (timer) return;
                if (Math.abs(e.changedTouches[0].pageY - mapTouch.y) > 30) {
                    mapTouch.isMove = true;
                }
                ////判断手势上下
                //if(e.changedTouches && e.changedTouches.length > 0){
                //    $active = $('.divImgItem.active');
                //    //向下
                //    if(e.changedTouches[0].pageY - mapTouch.y < -15){
                //        $next = $active.next('.divImgItem');
                //        if($next.length == 1){
                //            $active.removeClass('active');
                //            $next.addClass('active');
                //        }
                //    }else if(e.changedTouches[0].pageY - mapTouch.y > 15){
                //        $prev = $active.prev('.divImgItem');
                //        if($prev.length == 1){
                //            $active.removeClass('active');
                //            $prev.addClass('active');
                //        }
                //    }
                //}

                //if($next || $prev){
                //    timer = setTimeout(function(){
                //        clearTimeout(timer);
                //        timer = null;
                //    }, 500);
                //}
            }
            //直接选择某个房间
            function touchend(e) {
                if (mapTouch.isMove) {
                    var $active = $('#divMapList .divImgItem.active');
                    if (where === 'top' && e.changedTouches[0].pageY - mapTouch.y > 50 && $active.prev('.divImgItem')[0]) {
                        $active.removeClass('active').prev('.divImgItem').addClass('active');
                    }
                    if (where === 'bottom' && e.changedTouches[0].pageY - mapTouch.y < -50 && $active.next('.divImgItem')[0]) {
                        $active.removeClass('active').next('.divImgItem').addClass('active');
                    }
                    mapTouch.isMove = false
                    return;
                }
                var $tar = $(e.target).closest('.divImgItem')

                if ($tar.hasClass('active')) {
                    var targetId = $tar.attr('id');
                    //为了避免多次点击
                    var timer = null;
                    if (targetId && !timer) {
                        AppConfig.roomId = targetId;
                        AppConfig.roomInit = true;
                        router.to({
                            typeClass: ObserverScreen
                        })
                    }
                    timer = setTimeout(function(){
                        clearTimeout(timer);
                        timer = null;
                    }, 500)
                } else {
                    $('.divImgItem.active').removeClass('active');
                    $tar.addClass('active');
                }
                
            }
        },
        makeQrcode: function(text){
            $('#qrcode').empty().qrcode({width:200,height:200,correctLevel:0,text: text});
            $('#qrcodeModal').modal();
            $('#txtCopyCode').html(I18n.resource.admin.roomPage.INVITE_CODE + '\t<span class="canSelect">' +text + '</span>');
            $('#txtCopyCode').off('touchend').on('touchend', function (e) {
                e.stopPropagation();
            });
            	
            $('#qrcodeModal').off('hide.bs.modal').on('hide.bs.modal', function () {
                _this.isModal = false;
            })
            _this.isModal = true;
        },
        getTokenList: function(){

            var tpl = '<div class="itemQrcode listBorder" data-id={tokenId}>'+ I18n.resource.admin.roomPage.INVITE_CODE +'<span class="token">{tokenId}</span><div><span class="room">{roomIds}</span></div><div><span class="elapse">{elapse}<lable i18n="admin.roomPage.INVALID">失效</lable></span></div></div>'
            WebAPI.get('/appTemperature/token/getListByUserId').done(function(result){
                var strHtml = '';
                if(!result.data || $.isEmptyObject(result.data)) return;
                for(var i = 0, token; i < result.data.length; i++){
                    token = result.data[i];
                    strHtml += tpl.formatEL({
                        tokenId: token._id,
                        roomIds: (function(roomIds){
                            var arr = [];
                            if(!roomIds || roomIds.length == 0) return;
                            roomIds.forEach(function(id){
                                for(var i = 0; i < roomAll.length; i++){
                                    if(id == roomAll[i]._id){
                                        arr.push(roomAll[i].name);
                                        break;
                                    }
                                }
                            });
                            return arr.join(',');
                        })(token.arrRoomIds),
                        elapse: DateUtil.getRelativeDateInfo(new Date(), new Date(new Date(token.time.replace(/\-/g,'/').split('.')[0]).getTime() + 86400000 * parseInt(token.elapse)))
                    });
                }
                $('#qrcodeList').html(strHtml);
                _this.attachEventsToken();
            })
        },
        attachEventsToken: function(){
            //$('.itemQrcode', this.$qrcodePane).hammer().off('tap').on('tap', function(e){
            //    if(e.target.id == "btnRemoveQrcode") return;
            //    $('#btnRemoveQrcode').remove();
            //    _this.makeQrcode(this.dataset.id);
            //    e.stopPropagation();
            //    e.preventDefault();
            //});


            var oUl = document.getElementById('qrcodePane');

            var sX = 0;    // 手指初始x坐标
            var sLeft = 0; // 初始位移
            var curLeft = 0; // 当前位移
            var $target = undefined;
            var $btnRemove = undefined;

            oUl.addEventListener('touchstart', touchstart, false);

            function touchstart(e) {
                e.preventDefault();
                if(e.target.id == "btnRemoveQrcode") return;
                if(e.target.className == 'itemQrcode' || $(e.target).closest('.itemQrcode').length == 1){
                    $target = e.target.className == 'itemQrcode' ? $(e.target) : $(e.target).closest('.itemQrcode');
                    sX = e.changedTouches[0].pageX;

                    // 计算初始位移
                    sLeft = $target[0].style.transform ? -parseInt(/\d+/.exec($target[0].style.transform)[0]) : 0;
                    oUl.style.transition = 'none';

                    document.addEventListener('touchmove', touchmove, false);
                    document.addEventListener('touchend', touchend, false);
                }
            }

            function touchmove(e) {
                var disX = sX - e.changedTouches[0].pageX;
                if(disX < 0) return;
                curLeft = sLeft - 30;
                $target[0].style.transform = 'translateX(' + curLeft + 'px)';
            }

            function touchend(e) {
                var disX = sX - e.changedTouches[0].pageX;
                if (!_this.isModal&&disX > 15) {
                    $('#btnRemoveQrcode').remove();
                    $target.append('<button class="btn btn-danger" id="btnRemoveQrcode" style="position: absolute;right: -70px;top: 0;height: 100%;padding: 6px 20px;border-radius: 0;" i18n="admin.roomPage.DELETE">删除</button>');
                    $btnRemove = $('#btnRemoveQrcode');

                    $btnRemove[0].style.transition = '.5s';
                    $btnRemove[0].style.transform = 'translateX(-70px)';

                    $btnRemove.hammer().off('tap').on('tap', function(e){
                        e.stopPropagation();
                        e.preventDefault();
                        $target.remove();
                        WebAPI.get('/appTemperature/token/remove/' + $target[0].dataset.id).done(function(result){

                        });
                    });
                } else if (!_this.isModal&&disX <-15) {
                    
                } else {
                    if (e.target.id == "btnRemoveQrcode") return;
                    $('#btnRemoveQrcode').remove();
                    _this.makeQrcode($('.itemQrcode', this.$qrcodePane)[0].dataset.id);
                }
                $target[0].style.transition = '.5s';
                $target[0].style.transform = 'translateX(0px)';
            }
        },
        getRoomList: function(){
            WebAPI.get('/appTemperature/room/getlist/' + AppConfig.userId).done(function (rs) {
                roomAll = rs.roomList;
                _this.initRoom();
                _this.initRoomToggle();
            });
        }

    };

    return ProjectSel;
})();