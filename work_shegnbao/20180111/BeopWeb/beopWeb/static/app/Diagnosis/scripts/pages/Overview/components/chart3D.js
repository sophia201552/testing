(function(exports, Base) {
    const DEFAULT_OPTIONS = {}

    class Chart3D extends Base {
        constructor(container, options = DEFAULT_OPTIONS) {
            if (options !== DEFAULT_OPTIONS) {
                options = $.extend({}, DEFAULT_OPTIONS, options);
            }
            super(container, options);
        }
        show(yVal = "equipments",zVal = "numberOfFaults") {
            var _this = this;
            let $thisContainer = $(this.container);
            let dom = `<div class="chartBox clickShadow">
                            <div class="pieWithLineContainTitle">
                            </div>
                            <div class="chart3DContent"></div>
                            <div class="chartConditionBox">
                                <div class="" style="margin-bottom:5px;">
                                    <label class="control-label" style="padding-left:5px; padding-right:5px;margin-bottom:0px;">Y</label>
                                    <select style="height:30px;line-height:30px;display:inline-block;width:calc(100% - 50px)" id="chart3D_Y_Selected" class="chart3D_select" data-type ="y">
                                        <option value ="equipments">${I18n.resource.overview.EQUIPMENTS}</option>
                                        <option value ="consequence">${I18n.resource.overview.CONSEQUENCE}</option>
                                    </select>
                                </div>
                                <div class="" style="margin-bottom:5px;">
                                    <label class="control-label" style="padding-left:5px;padding-right:5px;margin-bottom:0px;">Z</label>
                                    <select style="height:30px;line-height:30px;display:inline-block;width:calc(100% - 50px)" id="chart3D_Z_Selected" class="chart3D_select" data-type ="z">
                                        <option value ="numberOfFaults">${I18n.resource.overview.NUM_OF_FAULTS}</option>
                                        <option value ="energy">${I18n.resource.overview.ENERGY}</option>
                                    </select>
                                </div>
                            </div>
                        </div>`;
            $thisContainer.html(dom);
            $(`option[value="${yVal}"]`).attr('selected', true);
            $(`option[value="${zVal}"]`).attr('selected', true);
            var $chart3DContent = $thisContainer.find('.chart3DContent');
            this.disableCapture();
            this.enableCapture($chart3DContent.closest('.clickShadow').parent()[0]);
            var time = this.options.time();
            var data = {
                "projectId": AppConfig.projectId,
                "startTime": time.startTime,
                "endTime": time.endTime,
                "x": 'time',
                "y": this.getYOrZVal(yVal),
                "z": this.getYOrZVal(zVal),
                "lang": I18n.type
            }
            var entityIds = this.options.activeEntities().map(function(row){return row.id}).join(",") || null;
            entityIds && (data.entityIds = entityIds)

            var classNames = this.options.activeCategories().map(function(row){return row.className}).join(",") || null;
            classNames && (data.classNames = classNames)
            var faultIds = this.options.activeFaults().map(function(row){return row.faultId}).join(",") || null;
            faultIds && (data.faultIds = faultIds)
            Spinner.spin($thisContainer[0]);
            this.async = this.getAllCategory().always(() => {
                $.get('/diagnosis_v2/getInfoByDimensionality',data).done(function(result){
                    _this.chartData = result.data;
                    _this.renderEchart($chart3DContent[0]);
                }).always(function(){
                    Spinner.stop();
                })  
                this.async = null;
            });
                  
        }
        getYOrZVal(val){
            return (val.charAt(0).toLowerCase() + val.slice(1)).replace(/\s/g, "");
        }
        getAllCategory() {
            let time = this.options.time();
            return $.get('/diagnosis_v2/getEquipmentAvailability',{
                projectId: AppConfig.projectId,
                startTime: time.startTime,
                endTime: time.endTime,
                lang: I18n.type
            }).done((rs)=>{
                if(rs&&rs.status=='OK'){
                    this.data = rs.data;
                }
            });
        }
        renderEchart($echartDiv) {
            var _this =this;
            var maxArr = [];
            var hours = (function(){
                var arr = []
                var time = _this.options.time();
                var startTime = Date.parse(time.startTime.slice(0,10));
                var endTime = Date.parse(time.endTime.slice(0,10));
                var length = (endTime - startTime)/86400000;
                var i = 0;
                while (i <= length){
                    // arr.push(new Date(startTime + 86400000*i).format("MM-dd"));
                    arr.push(moment(startTime).add(i, 'd').format('MM-DD'));
                    i++;
                }
                return arr;
            }());
            var days = (function(){
                var arr = []
                _this.data.forEach(function(row){
                    if(arr.indexOf(row.className) < 0){
                        arr.push(row.className);
                    }
                })
                return arr;
            }());
            var allData = (function(){
                var arr = [];
                days.forEach(function(row,i){
                    hours.forEach(function(col,j){
                        var item = [i,j,0];
                        arr.push(item);
                    })                   
                })
                return arr;
            }())
           
            var data = (function(){
                _this.chartData.forEach(function(row){
                    allData.forEach(function(curItem,i){
                        if(curItem[0] === days.indexOf(row.y) && curItem[1] === hours.indexOf(row.x.slice(5))){
                            allData[i][2] = row.z || 0;
                        }
                    })
                    // var item = [days.indexOf(row.y),hours.indexOf(row.x),row.z];
                    maxArr.push(row.z)
                })
            }());
            // 排序 
            var sort = (function(){
                var arr = []               
                days.forEach(function(row, i){
                    var temp = [], sum = 0                 
                    allData.forEach(function(col, j) {
                        if (i === col[0] ) {
                            temp.push(col[2])
                        }
                    })
                    temp.forEach(function(v) {
                        sum += v
                    })
                    arr.push(sum/temp.length);
                })
                for(var i = 0; i< arr.length; i++ ) {
                    for(var j = 0; j< arr.length; j++ ) {
                        if(arr[j] > arr[j+1] ) {
                            var temp = arr[j];
                            arr[j] = arr[j+1];
                            arr[j+1] = temp;
                            temp = days[j];
                            days[j] = days[j+1];
                            days[j+1] = temp;
                        }
                    }
                }
                allData.forEach(function(v, i){
                    v[2] = 0
                })
                _this.chartData.forEach(function(row){
                    allData.forEach(function(curItem,i){
                        if(curItem[0] === days.indexOf(row.y) && curItem[1] === hours.indexOf(row.x.slice(5))){
                            allData[i][2] = row.z || 0;
                        }
                    })
                })
            })();
            var option = {
                tooltip: {
                    formatter: function(params) {
                        var  dom = '';
                        if(params){
                            dom +=  `<div>
                                        <div><span style="display:inline-block; width:76px;text-align:right;">Time: </span><span> ${hours[params.value[0]]}</span></div>
                                        <div><span style="display:inline-block; width:76px;text-align:right;">Equipment: </span><span> ${days[params.value[1]]}</span></div>
                                        <div><span style="display:inline-block; width:76px;text-align:right;">Fault: </span><span> ${params.value[2]}</span></div>
                                    </div>`;
                        }
                        return dom;
                        //return hours[params.value[0]] + ', Equipment: ' + days[params.value[1]] + ', Fault: ' + +params.value[2];
                    },
                    position: [6,-28],
                    backgroundColor: 'rgba(255, 255, 255)',
                    textStyle: {
                        color: '#333'
                    },
                    hideDelay: 100,
                    transitionDuration: 0
                },
                visualMap: {
                    show: false,
                    max: maxArr.sort(function(a, b) { return a - b; })[maxArr.length - 1],
                    inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    }
                },
                xAxis3D: {
                    type: 'category',
                    data: hours
                },
                yAxis3D: {
                    type: 'category',
                    data: [],
                    axisLabel:{
                        interval: 0
                    }
                },
                zAxis3D: {
                    type: 'value'
                },
                grid3D: {
                    boxWidth: 200,
                    boxDepth: 125,
                    viewControl: {
                        // projection: 'orthographic'
                    },
                    light: {
                        main: {
                            intensity: 1,
                            shadow: true
                        },
                        ambient: {
                            intensity: 0.35
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            opacity: 0.3
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            opacity: 0.3
                        }
                    }
                },
                series: [{
                    type: 'bar3D',
                    data: allData.map(function(item) {
                        return {
                            value: [item[1], item[0], item[2]],
                        }
                    }),
                    shading: 'lambert',

                    label: {
                        textStyle: {
                            fontSize: 16,
                            borderWidth: 1
                        }
                    },

                    emphasis: {
                        label: {
                            textStyle: {
                                fontSize: 20,
                                color: '#900'
                            }
                        },
                        itemStyle: {
                            color: '#900'
                        }
                    }
                }]
            }

            var chart3D = echarts.init($echartDiv);
            this.chart3D = chart3D.setOption(option);
            window.onresize = chart3D.resize;
            
            chart3D.on('click', function (params) {
                var type = $('#chart3D_Y_Selected').val();
                AppConfig['fromHomeJump'] = true;
                if (type === 'equipments'){
                    _this.options.activeCategories([{
                        className: days[params.value[1]],
                        name: days[params.value[1]]
                    }]);
                } else if(type === 'consequence'){
                    _this.options.searchKey(days[params.value[1]]);
                }
                $('.pageNavContainer li').eq(1).trigger('click');
            })
        }
        update(condition) {

        }
        close() {
            this.chart3D.clear();
        }
    }

    exports.Chart3D = Chart3D;
}(
    namespace('diagnosis.components'),
    namespace('diagnosis.components.Base')
));