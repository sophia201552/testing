var NavFiles = (function () {
    var _this;

    function NavFiles() {
        _this = this;
        this.container = $('#divNavContainer');
        this.documentScreen = new DocumentScreen();
    }
    NavFiles.prototype = {
        show: function () {
            this.init();
        },
        init: function () {

            WebAPI.get('static/app/fileManagement/views/navFiles.html').done(function (result) {
                _this.container.html(result);
                _this.documentScreen.show();
                _this.attachEvent();
            });
        },

        attachEvent: function () {
            this.container.find('#fileContent').off("click", ".fileMenu").on("click", ".fileMenu", function (e) {
                $(this).toggleClass('current').siblings().removeClass('current');
                var dataType = $(e.currentTarget).attr('data-type');
                if (!$(this).hasClass('current')) {
                    dataType = 0;
                }
                var points = {
                    "keyword": '',
                    "type": dataType,
                    "id": 0,
                    "projectId": AppConfig.projectId
                }
                _this.documentScreen.initFileList(points);
            });
            $('.ProjectTitle').off('click').on("click", function () {
                $('.fileMenu').removeClass('current');
                var points = {
                    "keyword": '',
                    "type": 0,
                    "id": 0,
                    "projectId": AppConfig.projectId
                }
                _this.documentScreen.initFileList(points);
            })
        },
        bytesToSize: function (bytes) {
            if (bytes === 0) return '0 B';
            var k = 1024;
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },
        close: function () {

        }
    }
    return NavFiles;
})();