(function (exports, Base) {
    const DEFAULT_OPTIONS = {
    }

    class Table extends Base {
        constructor(container, options=DEFAULT_OPTIONS, overview) {
            if (options !== DEFAULT_OPTIONS) {
                options = Object.assign({}, DEFAULT_OPTIONS, options);
            }
            super(container, options, overview);
        }
        show() {
            let _this = this;
            let $thisContainer = $(this.container);
            var html=` <div class="tableBox BlackBox clickShadow">
                <div class="summaryTitle">
                    <span>${I18n.resource.overview.PRIORITY_FAULTS}</span>
                </div>
                <div class="tableContent">
                </div>`
            $thisContainer.html(html);
            let $tableContent = $thisContainer.find('.tableContent');
            var dom=`<div class="tableRow">
                            <span class="tableRowTime">06-21 20:46</span>
                            <span class="tableRowTip" title="PCHWP-3 frequency control fault">PCHWP-3 frequency control fault</span>
                            <span class="tableRowCode" title="Chilled water Plant">Chilled water Plant</span>
                        </div>`

            let getData = {
                "projectId": AppConfig.projectId,
                "startTime": this.options.time().startTime, 
                "endTime": this.options.time().endTime,
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
                        dom += `<div class="tableRow" data-faultid="${rs.data[key].faultId}" data-entityid="${rs.data[key].entityId}" data-time="${rs.data[key].time}" data-classname="${rs.data[key].className}">
                            <span class="tableRowTime" title="${rs.data[key].time}">${time}</span>
                            <span class="tableRowTip" title="${rs.data[key].name}">${rs.data[key].name}</span>
                            <span class="tableRowCode" title="${rs.data[key].entityNames}">${rs.data[key].entityNames}</span>
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
                _this.overview.diagnosis.changePage(document.querySelector('#diagnosisV2Detail [data-class="HistoryPage"]'));
                let activeFaults = _this.overview.diagnosis.nav.fault.findByIds([parseInt(faultid)]);
                let activeEntities = _this.overview.diagnosis.nav.structure.findByIds([parseInt(entityid)]);
                let activeCategories = _this.overview.diagnosis.nav.category.findByNames([classname]);
                _this.overview.diagnosis.conditionModel.activeEntities(activeEntities);
                _this.overview.diagnosis.conditionModel.activeFaults(activeFaults);
                _this.overview.diagnosis.conditionModel.activeCategories(activeCategories);
                _this.overview.diagnosis.conditionModel.searchKey(time);
                _this.overview.diagnosis.page.show();
            });
        }
    }

    exports.Table = Table;
} (
    namespace('diagnosis.components'),
    namespace('diagnosis.components.Base')
));
