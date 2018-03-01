(function (exports, Base) {
    const DEFAULT_OPTIONS = {
    }

    class ProportionPie extends Base {
        constructor(container, options = DEFAULT_OPTIONS) {
            if (options !== DEFAULT_OPTIONS) {
                options = Object.assign({}, DEFAULT_OPTIONS, options);
            }
            super(container, options);
        }
        show() {
            var _this =this;
            var  $thisContainer = $(this.container);
            var dom=`  <div class="faultRatioContainer">
                <div class="faultBox  ">
                    <div class="faultTitle">
                         <span>${I18n.resource.overview.EQUIPMENT_HEALTH}</span>
                         <span class="glyphicon glyphicon-question-sign helpInfo" aria-hidden="true"></span>
                    </div>
                    <div class="faultPanelContainer clearfix">


                    </div>
                </div>
            </div>
            <div class="influenceRatioContainer">
                <div class="influenceBox ">
                    <div class="faultTitle">
                        <span>${I18n.resource.overview.CONSEQUENCE}</span>
                        <span class="glyphicon glyphicon-question-sign helpInfo" aria-hidden="true"></span>
                    </div>
                    <div class="influencePanelContainer"></div>
                </div>
                </div>
            <div style="clear:both;"></div>`
            $thisContainer.html(dom)
            this.$faultPanelContainer = $thisContainer.find('.faultPanelContainer');
            this.$faultPanelContainer.empty();
            this.$influencePanelContainer = $thisContainer.find('.influencePanelContainer');
            this.$influencePanelContainer.empty();
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
                      
            $.get('/diagnosis_v2/getEquipmentAvailability', getData).done(function (rs) {
                var dom = ``;
                var color;
                var shadow;
                var warnColor = ['57c9ff', 'fcb192', 'df92e6', 'e9728f'];
                var shadowColor=['87, 201, 255, 0.5','252, 177, 146, 0.7','223, 146, 230, 0.7','233, 114, 143, 0.7'];
                var width;
                for (var key in rs.data) {
                    width = Math.round(parseFloat(rs.data[key].intactRate));
                    width = isNaN(width)? 0: width;
                    width < 60 ? color = warnColor[3] : width < 80 ? color = warnColor[2] : width < 100 ? color = warnColor[1] : color = warnColor[0];
                    width < 60 ? shadow = shadowColor[3] : width < 80 ? shadow = shadowColor[2] : width < 100 ? shadow = shadowColor[1] : shadow = shadowColor[0];
                    let num = Math.round(parseFloat((rs.data[key].goodNum / rs.data[key].totalNum) * 100));
                    num = isNaN(num)? 0: num;
                    dom += `<div class="singlePanel clickShadow" title=" ${rs.data[key].className} Equipment Health :${num} FaultNum: ${rs.data[key].totalNum - rs.data[key].goodNum} ">
                            <div class="panelName">${rs.data[key].className}</div>
                                <div class="panelPower">${num}%</div>
                                <div class="panelBar">
                                    <div class="progress1" style="width: 100%">
                                        <span class="progressBar" style="width: ${width}%;background:#${color};box-shadow:0 0 4px 0 rgba(${shadow});"></span>
                                    </div>
                                </div>
                            </div>`
                }
                _this.$faultPanelContainer.html(dom)

            })


            // 右边

            $.get('/diagnosis_v2/getFaultInfoByConsequence', getData).done((rs) => {
                var domHtml = ``;
                var per;
                var color;
                var shadow;
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
                        good < 60 ? color = warnColor[3] : good < 80 ? color = warnColor[2] : good < 100 ? color = warnColor[1] : color = warnColor[0];
                        good < 60 ? shadow = shadowColor[3] : good < 80 ? shadow = shadowColor[2] : good < 100 ? shadow = shadowColor[1] : shadow = shadowColor[0];
                        domHtml += `<div class="overPlane">
                            <div class="rotatePlane">
                                <div class="singlePanel clickShadow back" title=" ${rs.data[key].consequence} accounts for ${per}% in total . Total : ${rs.data[key].total}, Closed: ${rs.data[key].processed}">
                                    <div class="panelName">${rs.data[key].consequence}</div>
                                    <div class="panelPower">${per}%</div>
                                    <div class="panelBar">
                                        <div class="progress1" style="width: 100%">
                                            <span class=" progressBar" style="width: ${good}%;background:#${color};box-shadow:0 0 4px 0 rgba(${shadow});"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="left"></div>
                                <div class="singlePanel clickShadow" title=" ${rs.data[key].consequence} accounts for ${per}% in total . Total : ${rs.data[key].total}, Closed: ${rs.data[key].processed}">
                                    <div class="panelName">${rs.data[key].consequence}</div>
                                    <div class="panelPower">${per}%</div>
                                    <div class="panelBar">
                                        <div class="progress1" style="width: 100%">
                                            <span class=" progressBar" style="width: ${good}%;background:#${color};box-shadow:0 0 4px 0 rgba(${shadow});"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
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
        }
        update(condition) {
            
        }
       

        close() {
            this.__proto__.destroyHelpTooltip(this.container);
        }
    }

    exports.ProportionPie = ProportionPie;
}(
    namespace('diagnosis.components'),
    namespace('diagnosis.components.Base')
    ));
