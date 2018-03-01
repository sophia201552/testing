(function (exports, Base) {
    const DEFAULT_OPTIONS = {
    }

    class ConsequenceFaults extends Base {
        constructor(container, options = DEFAULT_OPTIONS, overview) {
            if (options !== DEFAULT_OPTIONS) {
                options = $.extend({}, DEFAULT_OPTIONS, options);
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
                                    <div class="influencePanelContainer">
                                        <div class="consequencePie"></div>
                                        <div class="consequenceScale"></div>
                                    </div>
                                </div>`);
            this.$influencePanelContainer = $thisContainer.find('.influencePanelContainer');
            // this.$influencePanelContainer.empty();
            let getData = {
                "projectId": AppConfig.projectId,
                "startTime": this.options.time().startTime, 
                "endTime": this.options.time().endTime,
                "lang": I18n.type
            }
            var entityIds = this.options.activeEntities().map(function(row){return row.id}).join(",") || null;
            entityIds && (getData.entityIds = entityIds);
            var classNames = this.options.activeCategories().map(function(row){return row.className}).join(",") || null;
            classNames && (getData.classNames = classNames)
            var faultIds = this.options.activeFaults().map(function(row){return row.faultId}).join(",") || null;
            faultIds && (getData.faultIds = faultIds)
            // 右边
            $.get('/diagnosis_v2/getFaultInfoByConsequence', getData).done((rs) => {
                if(rs && rs.status == 'OK'){
                    var allTotal = 0;
                    rs.data.forEach(function(row){
                        allTotal += row.total;
                    })
                    var tpl = "";
                    var color = ['#4B7BEF','#56CBDB','#46AAFE','#9C7AE8'];
                    rs.data.forEach(function(row,i){
                        var per = Math.round(parseFloat(row.processed /row.total * 100));
                        per = isNaN(per)? 0: per;
                        var curColor = color[i];
                        tpl += `<div class="conseqencePanel" data-info = "${row.consequence}" title="${row.consequence} accounts for ${per}% in total . Total : ${row.total}, Closed: ${row.processed}">
                                    <div class="panelTitle"><span>${row.consequence}</span><span class="panelTitlePer">${per}%</span></div>
                                    <div class="panelBar">
                                        <div class="progress1" style="width: 100%">
                                            <span class=" progressBar" style="width: ${per}%;background:${curColor};"></span>
                                        </div>
                                    </div>
                                </div>`
                    })
                    _this.$influencePanelContainer.find(".consequenceScale").html(tpl)        
                    _this.initPie(rs.data,allTotal);
                }    
            });
            this.attachEvents();
        }
        initPie(data){
            let option = {
                color: ['#4B7BEF','#56CBDB','#46AAFE','#9C7AE8'],
                title: {
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 14,
                        color: "#69779f"
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(params, ticket, callback){
                        return params.name + ": " + params.value + " (" + params.percent + "%)"
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['75%', '90%'],
                        avoidLabelOverlap: false,
                        // center: ['25%', '50%'],
                        hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: (function(){
                            var pieData = []
                            data.forEach(function(row){
                                var item = {
                                    value:row.total, 
                                    name:row.consequence
                                }
                                pieData.push(item)
                            })
                            return pieData;
                        }())
                    }
                ]
            };
            echarts.init(this.$influencePanelContainer.find(".consequencePie")[0]).setOption(option);
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
            this.$influencePanelContainer.off('click.goto','.conseqencePanel').on('click.goto','.conseqencePanel',function(e){
                e.stopPropagation();
                const {info} = this.dataset;
                _this.overview.diagnosis.setBack();
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
