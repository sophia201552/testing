var SharpViewScreen = (function ($, window, undefined) {
    var _this = null;

    var showMode = {
        TILE: 'Tile',
        LINEAR: 'Linear'
    };

    var layoutClasses = {
        'Tile': TileLayout,
        'Linear': LinearLayout
    };

    // SharpViewScreen CLASS DEFINITION
    // =========================
    function SharpViewScreen(sliders, store) {
        _this = this;
        this.options = SharpViewScreen.DEFAULTS;
        // indicate the index of the showing slider
        this.cur = null;
        // the number of sliders
        this.total = sliders.length;
        // the sliders data sets
        this.sliderList = sliders;
        this.slidersStatus = {};

        this.layoutHandler = null;

        // compatible params
        this.store = store;
        this.factoryIoC = new FactoryIoC('analysis');
        this.curModal = null;
        this.datasource = new DataSource(this);
        // backup the original AppConfig.datasource
        this.dataSourceConflict = AppConfig.datasource;
        AppConfig.datasource = this.datasource;
        this.saveModalJudge = $.Deferred();

        // dom
        this.$stage = null;
        this.$sliders = null;

    }

    SharpViewScreen.prototype = {
        constructor: SharpViewScreen,
        show: function () {
            $.get('/static/views/observer/sharpViewScreen.html', function (html) {
                // use a wrap
                $('<div class="sharpview-wrap sharpview" id="sharpViewWrap">').appendTo('body').html(html);
                _this.init();
            });
        },
        init: function () {
            var arrHtml = [];
            // init the dom
            this.$stage = $('#sharpViewStage');

            // first, build all sliders
            for (var i = 0, len = this.sliderList.length; i < len; i++) {
                arrHtml.push(this.options.itemTmpl.format(i));
            }
            this.$stage.html(arrHtml.join(''));
            this.$sliders = this.$stage.children('*');

            // init the parallex
            Parallex.init();
            // do layout
            this.layout(showMode.LINEAR);

        },
        layout: function (mode) {
            var _this = this;
            var options = {};

            mode = mode || showMode.TILE;
            if( this.layoutHandler ) this.layoutHandler.destroy();
             switch(mode) {
                case showMode.TILE:
                    break;
                case showMode.LINEAR:
                    options.onFlipStart = function (e) {
                        var pos = e.pos;
                        if(pos === _this.cur) return;
                        if(pos > _this.cur) Parallex.flowLeft();
                        else Parallex.flowRight();
                    };
                    options.onFlipEnd = function (e) {
                        var pos = e.pos;
                        _this.cur = pos;
                        _this.renderSlider();
                    };
                    break;
             }

            this.layoutHandler = new layoutClasses[mode](this.$stage, this.$sliders, options);
            this.layoutHandler.layout();
        },
        renderSlider: function (container) {
            this.renderModal(this.cur);

            // do pre load
            this.renderModal(Math.min(this.total-1, Math.max(this.cur-1, 0)));
            this.renderModal(Math.min(this.total-1, Math.max(this.cur+1, 0)));

        },
        // compatible methods
        renderModal: function (index) {
            var container = this.$sliders.get(index);
            var modalId = this.sliderList[index].id;
            this.curModal = this.sliderList[index].option;
            // do not repeat
            if(this.slidersStatus[modalId] === 'loaded') return;

            var modalClass = this.factoryIoC.getModel(this.curModal.type);
            if (modalClass) {
                this.slidersStatus[modalId] = 'loaded';
                new modalClass(container, null, this).show();
            } else {
                this.alertNoData();
            }
        },
        updateModal: function () {},
        showConfigMode: function () {},
        setModalOption: function () {},
        spinnerStop: function () {},
        saveModal: function () {},
        alertNoData: function () {
            // alert(I18n.resource.analysis.paneConfig.ERR11);
        }, // end
        destroy: function () {
            $('#sharpViewWrap').remove();
            // destroy layout handler
            this.layoutHandler.destroy();
            // recover the datasource
            AppConfig.datasource = this.dataSourceConflict;
        }
    }

    // Defaults
    SharpViewScreen.DEFAULTS = {
        itemTmpl: '<div data-index="{0}"></div>'
    };

    // Layout CLASS DEFINITION
    // =========================
    function Layout($stage, $sliders) {
        this.$stage = $stage;
        this.$sliders = $sliders;

        this.curPos = null;
        this.total = null;

    } 

    Layout.prototype = {
        constructor: Layout,
        layout: function () {
            this.total = this.$sliders.length;
            this._layout.apply(this, arguments);
        },
        destroy: function () {
            this._destroy();
        }
    }

    // TileLayout CLASS DEFINITION
    // =========================
    function TileLayout($stage, $sliders) {
        Layout.apply(this, arguments);

        this.name = 'Tile';
    }

    TileLayout.prototype = Object.create(Layout.prototype);
    TileLayout.prototype.constructor = TileLayout;

    TileLayout.prototype._layout = function () {
        var per;
        for (var i = 0; i < this.total; i++) {
            per = (i-1)*105;
            this.$sliders.eq(i).css({
                'transform': 'translateZ(-2500px) translate('+per+'%, 0%)'
            });
        }
    };

    // LinearLayout CLASS DEFINITION
    // =========================
    function LinearLayout($stage, $sliders, options) {
        Layout.apply(this, arguments);
        this.options = $.extend({}, LinearLayout.DEFAULTS, options);

        this.name = 'linear';
    }

    LinearLayout.prototype = Object.create(Layout.prototype);
    LinearLayout.prototype.constructor = LinearLayout;

    // @override
    LinearLayout.prototype._layout = function (startPos) {
        var per;
        this.$stage.addClass(this.options.animateCls);
        this.attachEvents();

        // go to specified position
        this.to(startPos || 0);
    };

    LinearLayout.prototype.to = function (pos) {
        var _this = this;
        var pos = pos === undefined ? 0 : Math.min(Math.max(pos, 0), this.total-1);
        if(pos === this.curPos) {this.doBoundAnimation(); return;}
        this.curPos = pos;

        // trigger the 'onFlipStart' event
        typeof _this.options.onFlipStart === 'function' && _this.options.onFlipStart({pos: pos});

        this.$sliders.each(function (i) {
            // set style for the sliders before
            if(i < pos) $(this).removeClass().addClass('past');
            // set style for the sliders after
            if(i > pos) $(this).removeClass().addClass('future');
        });

        window.setTimeout((function (pos) {
            return function () {
                // set style for the current sliders 
                _this.$sliders.eq(pos).removeClass().addClass('present');
            }
        }(pos)), 50);
        
        this.$sliders.off().on('transitionend', function (e) {
            e = e.originalEvent;
            if(e.target.className !== 'present') return;

            if(e.propertyName === 'transform') {
                // trigger the 'onFlipEnd' event
                typeof _this.options.onFlipEnd === 'function' && _this.options.onFlipEnd({pos: pos});
            }
        });

    };
    LinearLayout.prototype.prev = function () {
        this.to(this.curPos - 1);
    };
    LinearLayout.prototype.next = function () {
        this.to(this.curPos + 1);
    };

    LinearLayout.prototype.doBoundAnimation = function () {
        $slider = this.$sliders.eq(this.curPos);
        if(this.curPos === 0) $slider.addClass('bound-left'); 
        else $slider.addClass('bound-right');
    };

    LinearLayout.prototype.attachEvents = function () {
        var _this = this;

        $(window).on('keydown.sharpview', function (e) {
            switch(e.keyCode) {
                // LEFT ARROW
                case 37:
                    _this.prev();
                    break;
                // UP ARROW
                case 38:
                    break;
                // RIGHT ARROW
                case 39:
                    _this.next();
                    break;
                // DOWN ARROW
                case 40:
                    break;
            }
        });

        $(window).on('keyup.sharpview', function (e) {
            switch(e.keyCode) {
                // LEFT ARROW
                case 37:
                    _this.$sliders.eq(_this.curPos).removeClass('bound-left');
                    break;
                // UP ARROW
                case 38:
                    break;
                // RIGHT ARROW
                case 39:
                    _this.$sliders.eq(_this.curPos).removeClass('bound-right');
                    break;
                // DOWN ARROW
                case 40:
                    break;
            }
        });
    };
    LinearLayout.prototype.detachEvents = function () {
        $(window).off('keydown.sharpview');
        $(window).off('keyup.sharpview');
    };

    // override
    LinearLayout.prototype._destroy = function () {
        this.detachEvents();
    };

    LinearLayout.DEFAULTS = {
        // options: 'linear-1'
        animateCls: 'linear-1'
    };


    // Parallex OBJECT DEFINITION
    // =========================

    var Parallex = {
        // unit: px
        step: 1000,
        // background moving rate
        rateBg1: 1,
        rateBg2: 0.5,
        rateBg3: 0.2,
        // current flow direction
        // it is flow left to right, when the value > 0
        // flow right to left, when the value < 0
        direction: 1,
        flowLeft: function () {
            this.direction = -1;
            this.flow();
        },
        flowRight: function () {
            this.direction = 1;
            this.flow();
        },
        flow: function () {
            var posBg1 = parseFloat(this.$bg1.css('background-position-x'));
            var posBg2 = parseFloat(this.$bg2.css('background-position-x'));
            var posBg3 = parseFloat(this.$bg3.css('background-position-x'));

            // recover the transition
            this.changeTransition('.5s', 'cubic-bezier(0.26,.86,.44,.985)');

            // left => right
            if(this.direction > 0) {
                this.$bg1.css('background-position-x', (posBg1+this.step*this.rateBg1) + 'px');
                this.$bg2.css('background-position-x', (posBg2+this.step*this.rateBg2) + 'px');
                this.$bg3.css('background-position-x', (posBg3+this.step*this.rateBg3) + 'px');
            }
            // right => left
            else {
                this.$bg1.css('background-position-x', (posBg1-this.step*this.rateBg1) + 'px');
                this.$bg2.css('background-position-x', (posBg2-this.step*this.rateBg2) + 'px');
                this.$bg3.css('background-position-x', (posBg3-this.step*this.rateBg3) + 'px');
            }
        },
        changeTransition: function (duration, TimingFn) {
            this.$bg1.css({'transition-duration':duration, 'transition-timing-function': TimingFn});
            this.$bg2.css({'transition-duration':duration, 'transition-timing-function': TimingFn});
            this.$bg3.css({'transition-duration':duration, 'transition-timing-function': TimingFn});
        },
        init: function () {
            var _this = this;
            this.$bg1 = $('#bg1');
            this.$bg2 = $('#bg2');
            this.$bg3 = $('#bg3');

            this.$bg1.off().on('transitionend', function (e) {
                var distance = 1500;
                var posBg1 = parseFloat(_this.$bg1.css('background-position-x'));
                var posBg2 = parseFloat(_this.$bg2.css('background-position-x'));
                var posBg3 = parseFloat(_this.$bg3.css('background-position-x'));
                e = e.originalEvent;

                // change the transition to show the slow scrolling animation
                _this.changeTransition('30s', 'linear');

                if(e.propertyName === 'background-position-x') {
                    if(_this.direction > 0) {
                        _this.$bg1.css('background-position-x', (posBg1+distance*_this.rateBg1) + 'px');
                        _this.$bg2.css('background-position-x', (posBg2+distance*_this.rateBg2) + 'px');
                        _this.$bg3.css('background-position-x', (posBg3+distance*_this.rateBg3) + 'px');
                    } else {
                        _this.$bg1.css('background-position-x', (posBg1-distance*_this.rateBg1) + 'px');
                        _this.$bg2.css('background-position-x', (posBg2-distance*_this.rateBg2) + 'px');
                        _this.$bg3.css('background-position-x', (posBg3-distance*_this.rateBg3) + 'px');
                    }
                }
                
            });
        }
    }

    return SharpViewScreen;
}(jQuery, window));