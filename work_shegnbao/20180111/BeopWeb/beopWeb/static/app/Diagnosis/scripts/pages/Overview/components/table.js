(function (exports, Base) {
    const DEFAULT_OPTIONS = {
    }

    class Table extends Base {
        constructor(container, options=DEFAULT_OPTIONS, overview) {
            if (options !== DEFAULT_OPTIONS) {
                options = $.extend({}, DEFAULT_OPTIONS, options);
            }
            super(container, options, overview);
        }
        show() {
            let _this = this;
            let $thisContainer = $(this.container);
            var html = `
            <div class="tableBox BlackBox clickShadow goto">
                <div class="summaryTitle">
                    <span>${I18n.resource.overview.PRIORITY_FAULTS}</span>
                </div>
                <div class="tableContent"></div>
                <div class="gotoBtn" data-info="report">
                    <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>
                </div>
            </div>`;
            $thisContainer.html(html);
            if(AppConfig.projectId!==293){
                $thisContainer.find('.gotoBtn').hide();
            }
            let $tableContent = $thisContainer.find('.tableContent');
            var dom = `
            <div class="tableRow">
                <span class="tableRowTime">06-21 20:46</span>
                <span class="tableRowTip" title="PCHWP-3 frequency control fault">PCHWP-3 frequency control fault</span>
                <span class="tableRowCode" title="Chilled water Plant">Chilled water Plant</span>
            </div>`;

            let getData = {
                "projectId": AppConfig.projectId,
                "startTime": this.options.time().startTime, 
                "endTime": this.options.time().endTime,
                "lan": I18n.type
            }
            var entityIds = this.options.activeEntities().map(function(row){return row.id}).join(",") || null;
            entityIds && (getData.entityIds = entityIds)
            var classNames = this.options.activeCategories().map(function(row){return row.className}).join(",") || null;
            classNames && (getData.classNames = classNames)
            var faultIds = this.options.activeFaults().map(function(row){return row.faultId}).join(",") || null;
            faultIds && (getData.faultIds = faultIds)
            $.get('/diagnosis_v2/getPriorityFaults', getData).done((rs) => {
                var dom = ``;
                if (rs && rs.status == 'OK') {
                    _this.data = rs.data;
                    for (var key in rs.data) {
                        let time=rs.data[key].time.split('-')[1]+'-'+rs.data[key].time.split('-')[2];
                        let entityNames = Array.from(new Set(rs.data[key].entityNames.split(','))).join(',');
                        let colorArr = ['#00bae8', '#facc04', '#ea595c'];
                        let backgroundColor;
                        switch (rs.data[key].grade){
                            case 2:
                                backgroundColor = colorArr[2];
                                break; 
                            case 1:
                                backgroundColor = colorArr[1]; 
                                break;
                            case 0:
                                backgroundColor = colorArr[0]; 
                                break;    
                        }
                        dom += `<div class="tableRow" data-faultid="${rs.data[key].faultId}" data-entityid="${rs.data[key].entityId}" data-time="${rs.data[key].time}" data-classname="${rs.data[key].className}">
                            <span class="tableRowGrade" style="background:${backgroundColor};box-shadow: 0 0 1px 1px ${backgroundColor}"></span>
                            <span class="tableRowTime" title="${rs.data[key].time}">${time}</span>
                            <span class="tableRowTip" title="${rs.data[key].name}">${rs.data[key].name}</span>
                            <span class="tableRowCode" title="${entityNames}">${entityNames}</span>
                        </div>`
                        
                    }
                    
                    $tableContent.html(dom)
                }
            });
            this.attachEvents();
        }
        update(condition) {

        }
        close() {
            this.data = undefined;
        }
        attachEvents() {
            let _this = this;
            $('.tableContent', this.condition).off('click.goto', '.tableRow').on('click.goto', '.tableRow', function(e){
                const {entityid, faultid, time, classname} = this.dataset;
                _this.overview.diagnosis.setBack();
                _this.overview.diagnosis.changePage(document.querySelector('#diagnosisV2Detail [data-class="HistoryPage"]'), false);
                let activeFaults = _this.overview.diagnosis.nav.fault.findByIds([parseInt(faultid)]);
                let activeEntities = _this.overview.diagnosis.nav.structure.findByIds(entityid.split(',').map(row => parseInt(row)));
                let activeCategories = _this.overview.diagnosis.nav.category?_this.overview.diagnosis.nav.category.findByNames([classname]):[];
                _this.overview.diagnosis.conditionModel.activeEntities(activeEntities);
                _this.overview.diagnosis.conditionModel.activeFaults(activeFaults);
                _this.overview.diagnosis.conditionModel.activeCategories(activeCategories);
                // _this.overview.diagnosis.conditionModel.searchKey(time);
                AppConfig.fromPriorityFault = true;
                _this.overview.diagnosis.page.show();
            });

            $(this.container).off('click.goto', '.gotoBtn').on('click.goto', '.gotoBtn',function(e){
                e.stopPropagation();
                let params = {
                    page: 'observer.screens.FacReportWrapScreen',
                    options: {
                        id: '14925855233475115f8526a0',
                        type: 'fault'
                    },
                    response: 1,
                    container: 'indexMain'
                };
                if (window.parent.ScreenManager) {
                    window.parent.ScreenManager.goTo(params);
                } else {
                    params.projectId = AppConfig.projectId;
                    let hash = Object.keys(params).map(function (key) {
                        return `${key}=${window.encodeURIComponent(JSON.stringify(params[key]))}`;
                    }).join('&')
                    window.location.href = '/observer#'+hash;
                }
            })
        }
    }

    exports.Table = Table;
} (
    namespace('diagnosis.components'),
    namespace('diagnosis.components.Base')
));
