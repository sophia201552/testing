/// <reference path="../observerScreen.js" />
/// <reference path="../../lib/jquery-1.11.1.min.js" />
/// <reference path="../../core/common.js" />

var OperatingPane = (function () {
    function OperatingPane(pointName, value, description, screen) {
        this.pointName = pointName;
        this.value = value;
        this.description = description;
        this.screen = screen;
        this.element = undefined;
        this.i18  = I18n.resource.observer.widgets;
        this.init();
    };

    OperatingPane.prototype = {
        show: function () {
            $('#dialogOperatingPane').modal({});
        },

        close: function () {
            this.pointName = null;
            this.value = null;
            this.description = null;
            this.screen = null;
            this.element.parentNode.removeChild(this.element);
        },

        init: function () {
            var _this = this;

            //if the old dialog did NOT be removed, remove it
            $("#dialogOperatingPane").remove();

            this.element = document.createElement("div");
            this.element.id = "dialogOperatingPane";
            this.element.className = "modal fade";
            this.element.attributes["tabindex"] = -1;
            this.element.attributes["role"] = "dialog";
            this.element.attributes["aria-labelledby"] = "myModalLabel";
            this.element.attributes["aria-hidden"] = true;

            var divModal = document.createElement("div");
            divModal.className = "modal-dialog";
            var sb = new StringBuilder();
            sb.append('<div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span>\
                <span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel" i18n="observer.widgets.ACTION_CONFIRM"></h4></div>\
                <div class="modal-body">');
            sb.append(I18n.resource.observer.widgets.CONFIRM).append(this.description).append("？");
            sb.append('</div><div class="modal-footer"></div></div>')
            divModal.innerHTML = sb.toString();


            var btnSure = document.createElement("button");
            btnSure.type = "button";
            btnSure.className = "btn btn-primary";
            btnSure.attributes["data-dismiss"] = "modal";
            btnSure.textContent = this.i18.CONFIRM;
            btnSure.onclick = function (e) {
                $("#dialogOperatingPane .modal-footer").hide();
                $("#dialogOperatingPane .modal-body").html(_this.i18.EXECUTING+"...");
                _this.initProcessBar();
                _this.setValue();
            };

            var btnCancel = document.createElement("button");
            btnCancel.type = "button";
            btnCancel.className = "btn";
            btnCancel.attributes["data-dismiss"] = "modal";
            btnCancel.textContent = this.i18.CANCEL;
            btnCancel.onclick = function (e) {
                $('#dialogOperatingPane').modal('hide');
            };

            this.element.appendChild(divModal);
            $("body").append(this.element);
            var $footer = $("#dialogOperatingPane .modal-footer");
            $footer.append(btnSure);
            $footer.append(btnCancel);

            $('#dialogOperatingPane').on('hidden.bs.modal', function (e) {
                _this.close();
            })
        },

        setValue: function () {
            var _this = this;
            this.updateProcess("10%： "+this.i18.START_SENDING_REQUEST+"...", 10);
            
            WebAPI.post("/set_realtimedata", { db: AppConfig.projectId, point: this.pointName, value: this.value })
            .done(function (result) {
                _this.updateProcess("40%： "+ _this.i18.REQUEST_SENT_CONFIRM+"...+", 40);
                var count = 1;

                var interval = setInterval(function () {
                    WebAPI.post("/get_realtimedata", { proj: AppConfig.projectId, pointList: [_this.pointName] })
                    .done(function (result) {
                        var data = JSON.parse(result);
                        if (!data.error && data[0].value && data[0].value == _this.value) {
                            _this.updateProcess("100%: "+I18n.resource.observer.widgets.DATA_OPERATION_COMPLETE+"！", 100);
                            clearInterval(interval);
                            _this.screen.refreshData({ data: data });

                            setTimeout(function () { $('#dialogOperatingPane').modal('hide'); }, 1000);
                        }
                        else {
                            if (count < 5) {
                                var percen = 40 + count * 10;
                                _this.updateProcess(percen.toString() + "%: 第 " + count.toString() + I18n.resource.observer.widgets.TIMES_DATA_CONFIRM, 40 + count * 10);
                                count++;
                            }
                            else {
                                _this.processError("error： "+I18n.resource.observer.widgets.FAIL_TRY_AGAIN+"！");
                                clearInterval(interval);
                            }
                        }
                    })
                }, 2000)
            })
            .error(function (result) {
                _this.processError("error： "+I18n.resource.observer.widgets.FAIL_SEND_REQUEST);
            });
        },

        processError: function (strMessage) {
            var $bars = $("#divOperatingBar .progress-bar");
            $bars.removeClass("progress-bar-success");
            $bars.addClass("progress-bar-danger");
            this.updateProcess(strMessage, 100);
        },

        initProcessBar: function () {
            var divProcessBar = document.createElement("div");
            divProcessBar.id = "divOperatingBar";
            divProcessBar.className = "progress";
            divProcessBar.style.height = "30px";
            divProcessBar.style.marginTop = "10px";
            var divBar = document.createElement("div");
            divBar.className = "progress-bar progress-bar-success progress-bar-striped active";
            divBar.style.lineHeight = "30px";
            divBar.setAttribute("role", "progressbar");
            divBar.setAttribute("role", "progressbar");
            divProcessBar.appendChild(divBar);

            $('#dialogOperatingPane .modal-body').append(divProcessBar);
        },

        updateProcess: function (strProcess, value) {
            var $bars = $("#divOperatingBar .progress-bar");
            $bars.html(strProcess);
            $bars.width(value + "%");
        }
    }

    return OperatingPane;
})();