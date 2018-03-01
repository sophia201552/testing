(function (exports, Base) {
    const DEFAULT_OPTIONS = {
    }

    class EquipmentHealth extends Base {
        constructor(container, options = DEFAULT_OPTIONS, overview) {
            if (options !== DEFAULT_OPTIONS) {
                options = $.extend({}, DEFAULT_OPTIONS, options);
            }
            super(container, options);
            this.overview = overview;
        }
        show() {
            let lanDict = {
                heathTitle:'{name}的设备健康率是 {num}，\n该指标主要体现故障严重程度对于设备整体可靠性的影响。'
            }
            if(I18n.type != 'zh'){
                lanDict = {
                    heathTitle:'The equipment health of {name} is {num},\nwhich indicates the reliability of CHILLERS considering different impacts of faults detected.'
                }
            }
            var _this = this;
            let $thisContainer = $(this.container);
            $thisContainer.html(`<div class="faultBox">
                                    <div class="faultTitle">
                                        <span>${I18n.resource.overview.EQUIPMENT_HEALTH}</span>
                                        <span class="glyphicon glyphicon-question-sign helpInfo" aria-hidden="true"></span>
                                    </div>
                                    <div class="faultPanelContainer clearfix">
                                    </div>
                                </div>`);
            this.$faultPanelContainer = $thisContainer.find('.faultPanelContainer');
            this.$faultPanelContainer.empty();
            let getData = {
                "projectId": AppConfig.projectId,
                "startTime": this.options.time().startTime, 
                "endTime": this.options.time().endTime,
                "lang": I18n.type
            }
            var entityIds = this.options.activeEntities().map(function(row){return row.id}).join(",") || null;
            entityIds && (getData.entityIds = entityIds)
            var classNames = this.options.activeCategories().map(function(row){return row.className}).join(",") || null;
            classNames && (getData.classNames = classNames)
            var faultIds = this.options.activeFaults().map(function(row){return row.faultId}).join(",") || null;
            faultIds && (getData.faultIds = faultIds)
                      
            $.get('/diagnosis_v2/getEquipmentAvailability', getData).done(function (rs) {
                var dom = ``;
                var color;
                var shadow;
                var warnColor = ['57c9ff', 'fcb192', 'df92e6', 'e9728f'];
                var shadowColor = ['87, 201, 255, 0.5', '252, 177, 146, 0.7', '223, 146, 230, 0.7', '233, 114, 143, 0.7'];
                var width;

                rs.data = rs.data.sort(function (lhs, rhs) {
                    let lhsRate = lhs.goodNum / lhs.totalNum;
                    let rhsRate = rhs.goodNum / rhs.totalNum;
                    return lhsRate - rhsRate;
                }).slice(0, 8);
                for (var key in rs.data) {
                    width = parseFloat(rs.data[key].intactRate);
                    width = isNaN(width) ? 0 : width;
                    width < 60 ? color = warnColor[3] : width < 80 ? color = warnColor[2] : width < 100 ? color = warnColor[1] : color = warnColor[0];
                    width < 60 ? shadow = shadowColor[3] : width < 80 ? shadow = shadowColor[2] : width < 100 ? shadow = shadowColor[1] : shadow = shadowColor[0];
                    let num = parseInt(parseFloat(rs.data[key].intactRate))+'%';
                    dom += `<div class="singlePanel clickShadow goto" title="${lanDict.heathTitle.formatEL({name: rs.data[key].className, num:num})}">
                                <div class="panelName">${rs.data[key].className}</div>
                                <div class="panelPower">${num}</div>
                                <div class="panelBar">
                                    <div class="progress1" style="width: 100%">
                                        <span class="progressBar" style="width: ${width}%;background:#${color};box-shadow:0 0 4px 0 rgba(${shadow});"></span>
                                    </div>
                                </div>
                                <div class="gotoBtn" data-info="${rs.data[key].className}">
                                    <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>
                                </div>
                            </div>`
                }
                _this.$faultPanelContainer.html(dom)

            });
            this.attachEvents();
        }
        attachEvents(){
            var _this = this;
            $(this.container).off("click",".faultBox .helpInfo").on("click",".faultBox .helpInfo",function(){
                _this.__proto__.setHelpTppltip([
                    {
                        id:"health",
                        position:{
                            left: I18n.type === "zh"?80:140,
                            top:I18n.type === "zh"?"-42%":"-70%"
                        },
                        location:"right",
                        msg:`<p style="float: left;width: 50%">${I18n.resource.overview.HEALTH_HEIP_INFO}</p>
                        <img style="float: left;width: 50%;${I18n.type === "zh"?"":"margin-top: 37px;"}" src = "../static/app/Diagnosis/themes/default/images/equipmentHealth.png">`,
                        container: $(_this.container).find(".faultBox")
                    }
                ]);
            })
            this.$faultPanelContainer.off('click.goto','.gotoBtn').on('click.goto','.gotoBtn',function(e){
                e.stopPropagation();
                const {info} = this.dataset;
                _this.overview.diagnosis.setBack();
                _this.overview.diagnosis.changePage(document.querySelector('#diagnosisV2Detail [data-class="HistoryPage"]'));
                _this.overview.diagnosis.conditionModel.activeCategories([{className:info,name: info}]);
                _this.overview.diagnosis.page.show();
            })
        }
        update(condition) {
            
        }

        close() {
            this.__proto__.destroyHelpTooltip(this.container);
        }
    }

    exports.EquipmentHealth = EquipmentHealth;
}(
    namespace('diagnosis.components'),
    namespace('diagnosis.components.Base')
    ));