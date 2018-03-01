/**
 * Created by golding on 2014/12/17.
 */
/// <reference path="../lib/jquery-2.1.4.js" />


//下面是jQuery的代码
$(document).ready(function () {
   var _this = this;
    $("#mainContainer").html("12345678");
   WebAPI.get("/wx/getdailyreport/1").done(function (resultHtml) {
       $("#mainContainer").html(resultHtml);
       //_this.init();
   });
});
