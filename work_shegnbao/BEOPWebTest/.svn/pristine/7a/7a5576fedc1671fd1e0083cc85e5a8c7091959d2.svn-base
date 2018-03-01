// preview.js
+function (window) {
    var screens = namespace('factory.screens');

    function PreviewScreen() {
        this.pageCtn = document.querySelector('#pageContainer');
        this.pageId = document.querySelector('#hidPageId').value;
        this.page = null;
    }

    PreviewScreen.prototype.show = function () {
        this.page = new screens.PageScreenView(this.pageId, this.pageCtn);
        this.page.show();
    };

    PreviewScreen.prototype.close = function () {};

    $(function () {
        new PreviewScreen().show();
    });

}.call(this, window);