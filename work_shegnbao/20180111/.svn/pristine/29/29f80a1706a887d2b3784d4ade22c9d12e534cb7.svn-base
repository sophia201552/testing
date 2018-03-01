(function (exports, Base) {
    const DEFAULT_OPTIONS = {
    }

    class ConsequenceFaults extends Base {
        constructor(container, options = DEFAULT_OPTIONS, overview) {
            if (options !== DEFAULT_OPTIONS) {
                options = Object.assign({}, DEFAULT_OPTIONS, options);
            }
            super(container, options);
            this.overview = overview;
        }
        show() {
            var _this = this;
            let $thisContainer = $(this.container);
            $thisContainer.html(`<div class="influenceBox ">
                                    <div class="faultTitle">
                                        <span>${I18n.resource.overview.CONSEQUENCE}</span>
                                        <span class="glyphicon glyphicon-question-sign helpInfo" aria-hidden="true"></span>
                                    </div>
                                    <div class="influencePanelContainer"></div>
                                </div>`);
            this.$influencePanelContainer = $thisContainer.find('.influencePanelContainer');
            this.$influencePanelContainer.empty();
            let getData = {
                "projectId": AppConfig.projectId,
                "startTime": this.options.time().startTime, 
                "endTime": this.options.time().endTime,
            }
            var entityIds = this.options.activeEntities().map(function(row){return row.id}).join(",") || null;
            entityIds && (getData.entityIds = entityIds);
            var classNames = this.options.activeCategories().map(function(row){return row.className}).join(",") || null;
            classNames && (getData.classNames = classNames)
            var faultIds = this.options.activeFaults().map(function(row){return row.faultId}).join(",") || null;
            faultIds && (getData.faultIds = faultIds)
            // 右边
            $.get('/diagnosis_v2/getFaultInfoByConsequence', getData).done((rs) => {
                var domHtml = ``;
                var per;
                var gColor,pColor;
                var gShadow,pShadow;
                var warnColor = ['57c9ff', 'fcb192', 'df92e6', 'e9728f'];
                var shadowColor=['87, 201, 255, 0.5','252, 177, 146, 0.7','223, 146, 230, 0.7','233, 114, 143, 0.7'];
                var total=0;
                var good=0;
                if (rs && rs.status == 'OK') {
                    for (var key in rs.data) {
                        total=parseInt(rs.data[key].total+total);
                    }
                    
                    for (var key in rs.data) {
                        per = Math.round(parseFloat(rs.data[key].total /total * 100));
                        per = isNaN(per)? 0: per;
                        good = Math.round(parseFloat(rs.data[key].processed /rs.data[key].total * 100));
                        good = isNaN(good)? 0: good;
                        good < 60 ? gColor = warnColor[3] : good < 80 ? gColor = warnColor[2] : good < 100 ? gColor = warnColor[1] : gColor = warnColor[0];
                        good < 60 ? gShadow = shadowColor[3] : good < 80 ? gShadow = shadowColor[2] : good < 100 ? gShadow = shadowColor[1] : gShadow = shadowColor[0]
                        per < 60 ? pColor = warnColor[3] : good < 80 ? pColor = warnColor[2] : good < 100 ? pColor = warnColor[1] : pColor = warnColor[0];
                        per < 60 ? pShadow = shadowColor[3] : good < 80 ? pShadow = shadowColor[2] : good < 100 ? pShadow = shadowColor[1] : pShadow = shadowColor[0]
                        domHtml += `<div class="boxPlane goto"><div class="overPlane">
                                <div class="singlePanel clickShadow back" title=" ${rs.data[key].consequence} accounts for ${per}% in total . Total : ${rs.data[key].total}, Closed: ${rs.data[key].processed}">
                                    <div class="panelName">${rs.data[key].consequence}</div>
                                    <div class="panelPower">${good}%</div>
                                    <div class="panelBar">
                                        <div class="progress1" style="width: 100%">
                                            <span class=" progressBar" style="width: ${good}%;background:#${gColor};box-shadow:0 0 4px 0 rgba(${gShadow});"></span>
                                        </div>
                                    </div>
                                    <div class="gotoBtn" data-info="${rs.data[key].consequence}">></div>
                                </div>
                                <div class="singlePanel clickShadow front" title=" ${rs.data[key].consequence} accounts for ${per}% in total . Total : ${rs.data[key].total}, Closed: ${rs.data[key].processed}">
                                    <div class="panelName">${rs.data[key].consequence}</div>
                                    <div class="panelPower">${per}%</div>
                                    <div class="panelBar">
                                        <div class="progress1" style="width: 100%">
                                            <span class=" progressBar" style="width: ${per}%;background:#${pColor};box-shadow:0 0 4px 0 rgba(${pShadow});"></span>
                                        </div>
                                    </div>
                                </div>
                        </div></div>`
                        // domHtml += `<div class="singlePanel clickShadow" title=" ${rs.data[key].consequence} accounts for ${per}% in total . Total : ${rs.data[key].total}, Closed: ${rs.data[key].processed}">
                        //     <div class="panelName">${rs.data[key].consequence}</div>
                        //         <div class="panelPower">${per}%</div>
                        //         <div class="panelBar">
                        //             <div class="progress1" style="width: 100%">
                        //                 <span class=" progressBar" style="width: ${good}%;background:#${color};box-shadow:0 0 4px 0 rgba(${shadow});"></span>
                        //             </div>
                        //         </div>
                        //     </div>`
                    }
                    _this.$influencePanelContainer.html(domHtml)
                }
            });
            this.attachEvents();
        }
        attachEvents(){
            var _this = this;
            $(this.container).off("click",".influenceBox .helpInfo").on("click",".influenceBox .helpInfo",function(){
                _this.__proto__.setHelpTppltip([
                    {
                        id:"consequence",
                        position:{
                            left: I18n.type === "zh"?50:110,
                            top:I18n.type === "zh"?"-50%":"-64%"
                        },
                        location:"right",
                        msg:`<p style="float: left;${I18n.type === "zh"?"width: 50%":"width: 60%"}">${I18n.resource.overview.CONSEQUENCE_HELP_INFO}</p>
                        <img style="float: left;${I18n.type === "zh"?"width: 50%;margin-top:15px;":"width: 40%;margin-top: 50px;"}" src = "../static/app/Diagnosis/themes/default/images/equipmentConsequence.png">`,
                        container: $(_this.container).find(".influenceBox")
                    }
                ]);
            })
            this.$influencePanelContainer.off('click.goto','.gotoBtn').on('click.goto','.gotoBtn',function(e){
                e.stopPropagation();
                const {info} = this.dataset;
                _this.overview.diagnosis.changePage(document.querySelector('#diagnosisV2Detail [data-class="HistoryPage"]'));
                _this.overview.diagnosis.conditionModel.searchKey(info);
                _this.overview.diagnosis.page.show();
            })
        }
        update(condition) {
            
        }

        close() {
            this.__proto__.destroyHelpTooltip(this.container);
        }
    }

    exports.ConsequenceFaults = ConsequenceFaults;
}(
    namespace('diagnosis.components'),
    namespace('diagnosis.components.Base')
    ));
