(function(exports, Base) {
    const DEFAULT_OPTIONS = {}

    class Chart3D extends Base {
        constructor(container, options = DEFAULT_OPTIONS) {
            if (options !== DEFAULT_OPTIONS) {
                options = Object.assign({}, DEFAULT_OPTIONS, options);
            }
            super(container, options);
        }
        show() {
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
            let yVal = $thisContainer.find("#chart3D_Y_Selected").val();
            let zVal = $thisContainer.find("#chart3D_Z_Selected").val();
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
            }
            var entityIds = this.options.activeEntities().map(function(row){return row.id}).join(",") || null;
            entityIds && (data.entityIds = entityIds)

            var classNames = this.options.activeCategories().map(function(row){return row.className}).join(",") || null;
            classNames && (data.classNames = classNames)
            var faultIds = this.options.activeFaults().map(function(row){return row.faultId}).join(",") || null;
            faultIds && (data.faultIds = faultIds)
            Spinner.spin($thisContainer[0]);
            $.get('/diagnosis_v2/getInfoByDimensionality',data).done(function(result){
                _this.chartData = result.data;
                _this.renderEchart($chart3DContent[0]);
            }).always(function(){
                Spinner.stop();
            })        
        }
        getYOrZVal(val){
            return (val.charAt(0).toLowerCase() + val.slice(1)).replace(/\s/g, "");
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
                    arr.push(new Date(startTime + 86400000*i).format("MM-dd"));
                    i++;
                }
                return arr;
            }());
            var days = (function(){
                var arr = []
                _this.chartData.forEach(function(row){
                    if(arr.indexOf(row.y) < 0){
                        arr.push(row.y);
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
            var option = {
                tooltip: {
                    formatter: function(params) {
                        return hours[params.value[0]] + ', Equipment: ' + days[params.value[1]] + ', Fault: ' + +params.value[2];
                    }
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
                    data: days
                },
                zAxis3D: {
                    type: 'value'
                },
                grid3D: {
                    boxWidth: 200,
                    boxDepth: 80,
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