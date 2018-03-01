; (function (exports, Pages, Nav, FeedBackModal) {
    class ThermalComfort {
        constructor(container) {
            this.container = container;
            this.page = null;
            this.nav = null;
            this.conditionModel = new Model({
                time:{
                    startTime: undefined,
                    endTime: undefined,
                },
                activeEntities: [],
                activeAllEntities: [],
                activePoints: []
            });
        }
        init() {
            let _this = this;
            WebAPI.get('/static/app/ThermalComfort/views/thermalComfort.html').done(
                result => {
                    _this.container.innerHTML = result;
                    _this.initLayoutDOM();
                    _this.initNav();
                    _this.initContentNav();
                    _this.initPage();
                    _this.attachEvents();
                }
            );
        }
        initLayoutDOM() {
            this.navCtn = document.querySelector('.thermalComfort_nav');
            this.pageContainer = document.querySelector('.thermalComfort_content');
            this.contentNav = document.querySelector('.thermalComfort_item');
            this.contentInfo = document.querySelector('.thermalComfort_info');
        }
        initNav() {
            this.nav = new Nav['Nav'](this.navCtn, this);
            this.nav.init();
        }
        initContentNav() {
            let contentNav = `<ul>
                                <li class="active" data-class="TemperatureHumidityTrendChart">${i18n_resource.nav.TEMPERATURE_TREND}</li>
                                <li data-class="MonthlyTrend">${i18n_resource.nav.MONTHLY_TREND}</li>
                                <li data-class="AssociatedFault">${i18n_resource.nav.FAULTS}</li>
                            </ul>`;
            // <li data-class="Plan">${i18n_resource.nav.PLAN}</li>
            this.contentNav.innerHTML = contentNav;
        }
        initPage() {
            this.page = new Pages['TemperatureHumidityTrendChart'](this.contentInfo, this.conditionModel);
            this.page.init();
        }
        attachEvents() {
            var _this = this;
            $(this.contentNav).off('click').on('click', 'li', function () {
                $(_this.contentNav).find('li').removeClass('active');
                $(this).addClass('active');
                let className = $(this).attr('data-class');
                
                $(_this.contentInfo).empty();
                _this.page && _this.page.close();
                
                _this.page = new Pages[className](_this.contentInfo, _this.conditionModel);
                _this.page.init();
            })
        }
        close() {
            this.container.innerHTML = '';
        }
    }
    exports.ThermalComfort = ThermalComfort;
} ( namespace('thermalComfort'), namespace('thermalComfort.Pages'), namespace('thermalComfort.Nav')));
