// ModalObserverConfig CLASS DEFINITION
var ModalObserverConfig = ( function ($, window, undefined) {
    var _this;

    function ModalObserverConfig(options) {
        _this = this;
        // parameters
        this.options = $.extend({}, DEFAULTS, options);
        // DOM
        this.$wrap = null;
    }

    ModalObserverConfig.prototype.show = function () {
        var domPanelContent = document.getElementById('paneContent');
        if($('#modalObserverConfigWrap').length > 0) {
            this.$modal.modal('show');
            return;
        }

        Spinner.spin(domPanelContent);
        // get the template from server
        WebAPI.get('/static/views/observer/widgets/modalObserverConfig.html').done(function (html) {
            _this.$wrap = $('<div class="modal-observer-config-wrap" id="modalObserverConfigWrap">')
                .appendTo(domPanelContent).html(html);
            _this.$modal = _this.$wrap.children('.modal');

            WebAPI.get("/get_s3db_pages/" + AppConfig.projectId + "/" + AppConfig.userId).done(function (result) {
                _this.init(result.pages);
                _this.$modal.modal('show');
            }).always(function (msg) {
                Spinner.stop();
            });
            
        });
    };

    ModalObserverConfig.prototype.init = function (data) {
        // DOM
        this.$formWrap      = $('#obFormWrap', '#modalObserverConfigWrap');
        this.$btnClose      = $('.close', '#modalObserverConfigWrap');
        this.$sltObserverId = $('#sltObserverId', '#obFormWrap');
        this.$btnSubmit     = $('#btnObSubmit', '#modalObserverConfigWrap');

        var sb = new StringBuilder();
        for (var i = 0, item, len = data.length; i < len; i++) {
            item = data[i];
            sb.append('<option value="').append(item.id).append('">')
                .append(item.name + ' (width: ' + item.width + ', height: ' + item.height + ')</option>');
        }

        this.$sltObserverId.html(sb.toString());

        this.attachEvents();
    };

    ModalObserverConfig.prototype.attachEvents = function () {
        this.$btnSubmit.off().click( function (e) {
            var form = {};
            form.id = _this.$sltObserverId.val().trim();

            // save to modal
            _this.options.onSubmit.call(_this.options.modalIns, form);
            // close modal
            _this.$btnClose.trigger('click');
            e.preventDefault();
        } );
    };

    ModalObserverConfig.prototype.setOptions = function (options) {
        this.options = $.extend({}, this.options, options);
    };

    var DEFAULTS = {};

    return ModalObserverConfig;

}(jQuery, window) );


// ModalObserver CLASS DEFINITION
var ModalObserver = (function ModalObserver($, window, undefined) {
    
    function ModalObserver(screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this._render, null, this._showConfig);
        this.options = $.extend(true, {}, DEFAULTS);
        this.obScreen = null;
    };

    ModalObserver.prototype = Object.create(ModalBase.prototype);
    ModalObserver.prototype.constructor = ModalObserver;

    ModalObserver.prototype.optionTemplate = {
        name: 'toolBox.modal.OBSERVER',
        parent: 0,
        mode: 'custom',
        maxNum: 1,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalObserver',
        tooltip: {
            'imgPC': false,
            'imgMobile': false,
            'desc': ''
        }
    };

    ModalObserver.prototype._render = function () {
        var options = this.entity.modal.option;
        var id = options.id || '200000360';

        this.obScreen = new ObserverScreen(id);
        this.container = $(this.container).html('<div class="divMain" style="width: 100%; height: 100%;">\
                <div class="div-canvas-ctn" style="padding: 0; margin: 0 auto; height: 100%; width: 100%;">\
                    <canvas class="canvas-ctn" style="width: 100%; height: 100%;">浏览器不支持</canvas>\
                </div>\
                <div id="divObserverTools" style="height: 0"></div>\
            </div>')[0];
        this.obScreen.isInDashBoard = true;
        this.obScreen.show(this.container);
    };

    ModalObserver.prototype._showConfig = function () {};

    ModalObserver.prototype.showConfigModal = function () {
        this.configModal.setOptions({modalIns: this});
        this.configModal.show();
    };

    ModalObserver.prototype.saveConfig = function (form) {
        this.entity.modal.option = form;
        this.entity.modal.points = [];
    };

    ModalObserver.prototype.configModal = new ModalObserverConfig({onSubmit: function (form) { this.saveConfig(form); }});

    ModalObserver.prototype._close = function () {
        if(this.obScreen) this.obScreen.close();
    };

    // DEFAULTS OPTION
    var DEFAULTS = {
    };

    return ModalObserver;

} (jQuery, window));
