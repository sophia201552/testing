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
        top: true
    };

    function ProjectSel(){
        _this = this;
    }

    (function () {
        this.show = function() {
            WebAPI.get('static/app/temperatureControl/views/admin/projectSel.html').done(function(resultHTML){
                $('#indexMain').html(resultHTML);
                _this.init();
            });
        };

        this.close = function () {

        };

        this.init = function () {
            // 初始化一些需要使用的变量
            this.$container = $('#projectSel');

            this.initNav();
            this.initList();
            this.attachEvents();
        };

        this.initNav = function () {
            var $navTitle = $('.nav-title', '#navTop');
            $navTitle.text('地图切换').show();
        };

        this.initList = (function () {
            function getHtml(buildingInfo) {
                var roomList = AppConfig.roomList;
                var arrHtml = [];

                for (var i = 0, room, len = roomList.length; i < len; i++) {
                    room = roomList[i];
                    if( room.buildingId === buildingInfo.id ) {
                        arrHtml.push( groupItemTpl.formatEL({
                            roomId: room.id,
                            roomName: room.name
                        }) );
                    }
                }
                return groupTpl.formatEL({
                    buildingName: buildingInfo.name,
                    itemsHtml: arrHtml.join('')
                });
            }

            return function () {
                var buildingList = AppConfig.buildingList;
                var arrHtml = [];

                for (var i = 0, len = buildingList.length; i < len; i++) {
                    arrHtml.push( getHtml(buildingList[i]) );
                }

                this.$container.html( arrHtml.join('') );
            };
        } ());
        
        this.attachEvents = function () {
            this.$container.on('click', '.room-item', function () {
                var roomId = this.dataset.id;
                if(roomId) {
                    AppConfig.roomId = roomId;
                    router.back();
                }
            });
        };


    }).call(ProjectSel.prototype);

    return ProjectSel;
})();