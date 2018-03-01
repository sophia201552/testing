/**
 * Created by win7 on 2015/9/14.
 */
var ProjectSel = (function(){
    var _this;

    var groupTpl = '<div class="list-group">' +
                    '<a class="list-group-item active">' +
                        '<h4 class="list-group-item-heading">{buildingName}</h4>'+
                    '</a>{itemsHtml}</div>';
    var groupItemTpl = '<a href="javascript:;" class="list-group-item room-item" data-id="{roomId}">'+
                '<h4 class="list-group-item-heading">{roomName}</h4>'+
            '</a>';


    ProjectSel.navOptions = {
        top: '<span id="roomName" class="topNavTitle">房间</span>',
        bottom: true
    };

    function ProjectSel(){
        _this = this;
        this.$qrcodePane = undefined;
    }

    ProjectSel.prototype = {
        show:function(){
            WebAPI.get('static/app/temperatureControl/views/admin/projectSel.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                _this.init();
            });
        },
        init:function(){
            this.$qrcodePane = $('#qrcodePane');
            _this.initRoom();
            _this.initRoomToggle();
            _this.attachEvents();
        },
        initRoom:function(){
            var room, checkbox, span, grade, label;
            var ctn = document.getElementById('projectSel');
            ctn.innerHTML = '';
            if(!roomAll || roomAll.length == 0){
                //todo 提示关联房间
                return;
            }
            for (var i= 0 ; i < roomAll.length; i++){
                room = document.createElement('div');
                room.className = 'divRoom';
                room.id = roomAll[i]["_id"];

                checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'regular-checkbox';
                checkbox.id = 'ckRoom_' + room.id;
                if(roomAll[i].grade === 0) checkbox.setAttribute('disabled', false);
                room.appendChild(checkbox);

                label = document.createElement('label');
                label.className = 'hidden';
                label.setAttribute('for', checkbox.id);
                room.appendChild(label);

                span = document.createElement('span');
                span.textContent = roomAll[i].name;
                span.className = 'name';
                room.appendChild(span);

                grade = document.createElement('span');
                if(roomAll[i].grade === 30){
                    grade.className = 'glyphicon glyphicon-king';
                }else if(roomAll[i].grade === 20){
                    grade.className = 'glyphicon glyphicon-queen';
                }else if(roomAll[i].grade === 10){
                    grade.className = 'glyphicon glyphicon-pawn';
                }
                room.appendChild(grade);

                ctn.appendChild(room);
            }

            //权限
            if($(':checkbox:disabled').length == roomAll.length){
                $('#btnQrcode').hide();
                $('#btnEdit').hide();
            }
        },
        initRoomToggle:function(){
            var ctn = document.getElementById('projectSel');
            $(ctn).hammer().on('tap',function(e){
                //点击复选框或者编辑状态时,不需要切换房间
                if(e.gesture.changedPointers[0].target.tagName == 'LABEL' || !$('#btnCancel').is(':hidden')) return;
                var $target = $(e.gesture.changedPointers[0].target).hasClass('divRoom') ?  $(e.gesture.changedPointers[0].target) : $(e.gesture.changedPointers[0].target).parent();
                if ($target.length == 1){
                    AppConfig.roomId = $target[0].id;
                    router.to({
                        typeClass:ObserverScreen
                    })
                }
            })
        },
        attachEvents: function(){
            var $projectSel = $('#projectSel');
            var $btnEdit = $('#btnEdit');
            var $btnCancel = $('#btnCancel');
            var $btnAdd = $('#btnAdd');
            var $btnGenerate = $('#btnGenerate');
            var $btnQrcode = $('#btnQrcode');
            var $btnBackToRoomPane = $('#btnBackToRoomPane');
            var $inviteCodePane = $('#inviteCodePane');

            //编辑按钮
            $btnEdit.hammer().off('tap').on('tap', function(){
                $(':checkbox:disabled').parent().addClass('disabled');
                $('.divRoom label').removeClass('hidden');
                $(this).hide().next('#btnCancel').show();
                $('#bottomBtns').removeClass('hidden');
            });

            //退出编辑状态
            $btnCancel.hammer().off('tap').on('tap', function(){
                $(':checkbox:disabled').parent().removeClass('disabled');
                $('.divRoom label').addClass('hidden');
                $(this).hide().prev('#btnEdit').show();
                $('#bottomBtns').addClass('hidden');
            });

            //生成二维码
            $btnGenerate.hammer().off('tap').on('tap', function(){
                //token/create
                var postData = {
                       'userId': AppConfig.userId,
                       'elapse': 14,
                       'arrRoomIds': []
                    }

                $('.divRoom input:checked').each(function(){
                    var id = $(this).parent('.divRoom').attr('id');
                    id && postData.arrRoomIds.push(id);
                });
                WebAPI.post('/appTemperature/token/create', postData).done(function(result){
                    _this.makeQrcode(result);
                })
            });

            //查看二维码列表
            $btnQrcode.hammer().off('tap').on('tap', function(){
                $projectSel.hide();
                _this.$qrcodePane.slideDown();
                _this.getTokenList();

                $btnEdit.hide();
                $btnQrcode.hide();
                $btnCancel.hide();
                $btnBackToRoomPane.show();

                $('.divRoom input').addClass('hidden');
                $('#bottomBtns').addClass('hidden');
            });

            //返回至房间列表
            $btnBackToRoomPane.hammer().off('tap').on('tap', function(){
                $btnEdit.show();
                $btnQrcode.show();
                $btnBackToRoomPane.hide();

                _this.$qrcodePane.hide();
                $projectSel.slideDown();
            });

            //添加房间, 即关联房间
            $btnAdd.off('touchstart').on('touchstart', function(){
                var $scanCode = $('#scanCode');
                var $inviteCode = $('#inviteCode');
                var $btnEdit = $('#btnEdit');
                var $btnCancel = $('#btnCancel');

                $scanCode.off('touchstart').on('touchstart', function(){
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
                    }else {
                        //relateRoom('56f8ec67fa17231610d91f0d');
                    }
                });

                $inviteCode.off('touchstart').on('touchstart', function(){
                    $inviteCodePane.removeClass('hidden');
                    $btnEdit.addClass('hidden');
                    $btnCancel.addClass('hidden');
                    $projectSel.addClass('hidden');
                    $('#btnInviteCode').off('touchstart').on('touchstart', function(){
                        relateRoom($('#iptInviteCode').val())
                    });
                });

                function relateRoom (token){
                    var postData = {
                        tokenId: token,
                        userId: AppConfig.userId
                    }
                    WebAPI.post('/appTemperature/token/corelateRoom', postData).done(function(result){
                        //AppConfig.roomId =
                        window.plugins && window.plugins.toast.show('关联成功' + result.text, 'short', 'center');
                        $projectSel.removeClass('hidden');
                        $inviteCodePane.addClass('hidden');

                        $btnEdit.removeClass('hidden');
                        $btnCancel.removeClass('hidden');
                        //获取新的房间列表
                        _this.getRoomList();
                    });
                }
            });
        },
        makeQrcode: function(text){
            $('#qrcode').empty().qrcode({width:200,height:200,correctLevel:0,text: text});
            $('#qrcodeModal').modal();
        },
        getTokenList: function(){

            var tpl = '<div class="itemQrcode" data-id={tokenId}><h4 class="token">{tokenId}</h4><div><span class="room">{roomIds}</span><span class="elapse">{elapse}失效</span></div></div>'
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
                        elapse: DateUtil.getRelativeDateInfo(new Date(), new Date(new Date(token.time.replace(/\-/g,'/')).getTime() + 86400000 * parseInt(token.elapse)))
                    });
                }
                _this.$qrcodePane.html(strHtml);
                _this.attachEventsToken();
            })
        },
        attachEventsToken: function(){
            var start, disX;
            $('.itemQrcode', this.$qrcodePane).hammer().off('tap').on('tap', function(e){
                if(e.target.id == "btnRemoveQrcode") return;
                $('#btnRemoveQrcode').remove();
                _this.makeQrcode(this.dataset.id);
                e.stopPropagation();
                e.preventDefault();
            });


            var oUl = document.getElementById('qrcodePane');

            var sX = 0;    // 手指初始x坐标
            var sLeft = 0; // 初始位移
            var curLeft = 0; // 当前位移
            var disX = 0;  // 滑动差值
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
                disX = sX - e.changedTouches[0].pageX;
                if(disX < 0) return;
                curLeft = sLeft - 30;
                $target[0].style.transform = 'translateX(' + curLeft + 'px)';
            }

            function touchend(e) {
                if (disX > 15) {
                    $('#btnRemoveQrcode').remove();
                    $target.append('<button class="btn btn-danger" id="btnRemoveQrcode" style="position: absolute;right: -70px;top: 0;height: 100%;padding: 6px 20px;border-radius: 0;">删除</button>');
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

            //(function () {
            //    this.show = function() {
    //        WebAPI.get('static/app/temperatureControl/views/admin/projectSel.html').done(function(resultHTML){
    //            $('#indexMain').html(resultHTML);
    //            _this.init();
    //        });
    //    };
    //
    //    this.close = function () {
    //
    //    };
    //
    //    this.init = function () {
    //        // 初始化一些需要使用的变量
    //        this.$container = $('#projectSel');
    //
    //        this.initNav();
    //        this.initList();
    //        this.attachEvents();
    //    };
    //
    //    this.initNav = function () {
    //        var $navTitle = $('.nav-title', '#navTop');
    //        $navTitle.text('地图切换').show();
    //    };
    //
    //    this.initList = (function () {
    //        function getHtml(buildingInfo) {
    //            var roomList = roomAll;
    //            var arrHtml = [];
    //
    //            for (var i = 0, room, len = roomList.length; i < len; i++) {
    //                room = roomList[i];
    //                if( room.buildingId === buildingInfo.id ) {
    //                    arrHtml.push( groupItemTpl.formatEL({
    //                        roomId: room.id,
    //                        roomName: room.name
    //                    }) );
    //                }
    //            }
    //            return groupTpl.formatEL({
    //                buildingName: buildingInfo.name,
    //                itemsHtml: arrHtml.join('')
    //            });
    //        }
    //
    //        return function () {
    //            var buildingList = AppConfig.buildingList;
    //            var arrHtml = [];
    //
    //            for (var i = 0, len = buildingList.length; i < len; i++) {
    //                arrHtml.push( getHtml(buildingList[i]) );
    //            }
    //
    //            this.$container.html( arrHtml.join('') );
    //        };
    //    } ());
    //
    //    this.attachEvents = function () {
    //        this.$container.on('click', '.room-item', function () {
    //            var roomId = this.dataset.id;
    //            if(roomId) {
    //                AppConfig.roomId = roomId;
    //                router.back();
    //            }
    //        });
    //    };
    //
    //
    //}).call(ProjectSel.prototype);

    return ProjectSel;
})();