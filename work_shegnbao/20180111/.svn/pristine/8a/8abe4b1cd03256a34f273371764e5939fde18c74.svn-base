var SwitchAccount = (function () {
    var _this;

    function SwitchAccount(arr) {
        _this = this;
        this.arrAccount = arr;
        this.container = $('body');
        this.dataList = undefined;
    }
    SwitchAccount.prototype = {
        show: function () {
            this.init();
        },
        init: function () {
            WebAPI.get('/static/app/LogisticsPlantform/views/switchAccount.html').done(function (result) {
                _this.container.append($(result));
                _this.initManager();
                _this.attachEvents();
            });
        },
        initManager: function () {
            WebAPI.post('/get_realtimedata', {
                "pointList": ["AdminUser"],
                "proj": "425"
            }).done(function (result) {
                console.log();
                var rs = eval(result[0].value)[0];
                _this.renderModal(rs);
            });
        },
        renderModal: function (points) {
            var dataList = points.childlist;
            this.dataList = dataList;
            this.getCookies();
            for (var i = 0; i < dataList.length; i++) {
                var data = dataList[i];
                var domTr = $('<div class="btn btn-default" style="display:block;margin-top:5px"></div>');
                domTr.append('<span>' + data.area + '</span>');
                this.container.find('#adminContent').append(domTr);
                (function (data) {
                    domTr.off('click').on('click', function (e) {
                        console.log(data);
                        _this.setCookies(data.userid);
                    });
                })(data);
            }
        },
        getCookies: function () {
            var arrCookie = document.cookie.split(';');
            for (var i = 0; i < arrCookie.length; i++) {
                if(arrCookie[i].indexOf('targetUserId') > -1){
                    var curId = arrCookie[i].split('=')[1];
                    if(curId == 2714){
                        this.container.find('#curAccount').html('管理员账号');
                    }else{
                        var curData = this.getIdName(curId);
                        this.container.find('#curAccount').html(curData.area);
                    }
                }
            }
        },
        getIdName:function(cId){
            for(var i=0;i<this.dataList.length;i++){
                if(this.dataList[i].userid == cId){
                    return this.dataList[i];
                }
            }
        },
        setCookies: function (data) {
            document.cookie = " targetUserId=" + data;
            window.location.reload();
        },
        attachEvents: function () {
            $('#btnCloseAccount').off('click').on('click', function () {
                _this.close();
            });
            $('#backAdmin').off('click').on('click',function(){
                _this.setCookies('2714');
            })
        },
        close: function () {
            this.container.find('#modalKPIConfigWrap').remove();
            this.dataList = undefined;
        }
    }
    return SwitchAccount;
})();