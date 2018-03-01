var parameterList = (function() {
    var _this;

    parameterList.navOptions = {
        top: '<span id="roomName" class="topNavTitle">设备名称</span>',
        bottom: true,
        backDisable: false
    };

    function parameterList() {
        _this = this;
    }

    parameterList.prototype = {

        show: function () {
            WebAPI.get('/static/app/inputApp/views/screen/parameterList.html').done(function (resultHTML) {
                $('#indexMain').html(resultHTML);
                _this.init();
            });
        }
    }
    return parameterList;
})();
