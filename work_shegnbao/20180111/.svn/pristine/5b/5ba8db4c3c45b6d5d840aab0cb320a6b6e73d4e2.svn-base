/**
 * Created by vivian on 2017/7/13.
 * 数据接入 左侧饼图计算 接口get/allProjStaticInfo/userId 字段projects的长度是斜线的右侧 左侧是total_online_projects的数量;
 * 数据接入 右侧柱图 接口get/allProjStaticInfo 字段project_category;
 * 数据接入 底部数据接入 point/100m2的计算方式(data_density.table_points.calc + data_density.table_points.site + data_density.table_points.virtual)/data_density.total_area * 100;
 * 数据接入 底部数据接入point/device的计算方式(data_density.table_points.calc + data_density.table_points.site + data_density.table_points.virtual)/data_density.total_devices.length;
 * 预处理 左侧数据通量计算 ，因为计算点大概是5分钟计算一次。(在线原始点（raw）/5)k/(所有原始点（raw）/5) =>(total_online_points.raw/5)k/(data_density.table_points.raw /5);
 * 预处理 次/分钟  total_online_points.calc / 5;
 * 预处理 标签覆盖(Tag converage) tag.total_points_with_tags/(data_density.table_points.calc + data_density.table_points.site + data_density.table_points.virtual);
 * 预处理 磁盘覆盖(Storage) storage.total_disk_usage/总数量  总数量目前是假数据2TB;
 * 预处理 设备数量 data_density.total_devices  这里目前最多显示10个  超出了盛不下
 * 算法 数据池 接口get/allProjStaticInfo/userId 字段storage.total_disk_usage;
 * 算法 已输出 报表diagnosis.total_reports 警告diagnosis.total_fault_notices 故障diagnosis.current_fault_notices
 * 算法 相关 能耗=>energy.energy_use 费用=>energy.cost    CO2=>energy.co2_emission
 */
class PlatformOverview {
    constructor() {
        this.container = $('#indexMain');
        this.staticData = undefined;
        this.dynamicData = undefined;
    }
    show() {
        this.init();
    }
    init() {
        WebAPI.get('/static/app/Platform/views/module/platformOverview.html').done(function(result) {
            this.ctn = document.getElementById('indexMain');
            this.ctn.innerHTML = result;
            this.attachEvent();
            this.renderUserChart();
            this.renderPvWebChart();
            this.renderConnectionChart();
        }.bind(this)).always(function() {
            I18n.fillArea($('.rightContainer'));
            I18n.fillArea($('#containerDisplayboard'));
        }.bind(this));
    }
    initModule() {

    }
    initQueryTime() {
        var $iptSelectTime = $('.iptSelectTime');
        $iptSelectTime.val(new Date().format('yyyy-MM-dd'));
        $('#spanSelectTime').datetimepicker({
            Format: 'yyyy-mm-dd',
            autoclose: true,
            startView: 2,
            minView: 2,
            todayHighlight: true
        });
        $('#spanSelectTime').datetimepicker().on('changeDay', function(ev) {
            $iptSelectTime.val(new Date(ev.date).format('yyyy-MM-dd'));
        });
    }
    attachEvent() {

        $('#myModal').on('shown.bs.modal', function() {
            let data = [{
                id: 1,
                projectName: 'demo1',
                status: 'online',
                data_flux: '850k / 1min',
                point: '46',
                storage: '10G',
                fault: '34',
                accessTime: '2017-08-11 09:00',
                updateTime: '2017-08-12 15:30'
            }, {
                id: 2,
                projectName: 'demo2',
                status: 'online',
                data_flux: '880k / 1min',
                point: '25',
                storage: '10G',
                fault: '31',
                accessTime: '2017-08-11 11:00',
                updateTime: '2017-08-12 16:30'
            }, {
                id: 3,
                projectName: 'demo3',
                status: 'offline',
                data_flux: '860k / 1min',
                point: '50',
                storage: '10G',
                fault: '26',
                accessTime: '2017-08-13 06:00',
                updateTime: '2017-08-14 11:00'
            }, {
                id: 4,
                projectName: 'demo4',
                status: 'offline',
                data_flux: '810k / 1min',
                point: '43',
                storage: '10G',
                fault: '35',
                accessTime: '2017-08-10 09:00',
                updateTime: '2017-08-12 15:30'
            }];
            $('#myModal .modal-body').html(`<div class="modalProjInfo"><table><thead class="projInfoNav">
                            <th>ID</th>
                            <th>Project</th>
                            <th>Status</th>
                            <th>Data Flux</th>
                            <th>Point</th>
                            <th>Storage</th>
                            <th>Fault</th>
                            <th>Access Time</th>
                            <th>Update Time</th>
                        </thead><tbody class="projInfoCtn"></tbody></table></div>`);
            let trDom = '';
            for (let i = 0, length = data.length; i < length; i++) {
                let item = data[i];
                trDom += `<tr class="projInfoTr">
                            <td>${item.id}</td>
                            <td>${item.projectName}</td>
                            <td>${item.status}</td>
                            <td>${item.data_flux}</td>
                            <td>${item.point}</td>
                            <td>${item.storage}</td>
                            <td>${item.fault}</td>
                            <td>${item.accessTime}</td>
                            <td>${item.updateTime}</td>
                        </tr>`;
            }
            $('#myModal .modal-body .projInfoCtn').html(trDom);
        });

        var target_link = {
            0: "/observer#page=ModBusInterface&projectId=",
            1: "/observer#page=PointManagerCloudPoint&pointType=0&projectId=",
            2: "/strategyV2?projectId=",
            3: "/factory"
        }
        $('.icon-bangzhu').off('click').on('click', function(e) {
            e.stopPropagation();
            new PlatformGuide().show();
        })
        $('.targetLink').off('click').on('click', '.headText,.icon-more', function(e) {
            var firstProjectId = document.querySelector('#navProject .navItem').dataset.id;
            var projectId = AppConfig.projectId ? AppConfig.projectId : firstProjectId;
            var tran_num = e.currentTarget.parentElement.parentElement.dataset.type;
            var target_url = window.location.origin + target_link[tran_num];
            if (!projectId) {
                return;
            }
            if (tran_num != 3) {
                target_url += projectId;
            }

            if (tran_num == 3 && AppConfig.permission) {
                var factory = AppConfig.permission.CPage ? AppConfig.permission.DPage ? AppConfig.permission.Epage ? 1 : 0 : 0 : 0;
                if (factory != 1) {
                    alert(i18n_resource.platform_app.extend_tip.PERMISSION_FACTORY)
                    return
                }
                if(AppConfig.projectId){
                    localStorage.setItem('indexToFactoryId', projectId);
                }
            }
            if ( tran_num == 2) {
                localStorage.setItem('indexToFactoryId', projectId);
            }
            window.open(target_url, '_blank');
        })
    }
    renderConnectionChart() {
        Spinner.spin($('#indexMain')[0]);
        $.when(WebAPI.get('/platform/get/allProjStaticInfo/' + AppConfig.userId), WebAPI.get('/platform/get/allProjDynamicInfo/' + AppConfig.userId)).done(function(result1, result2) {
            this.staticData = result1[0].data;
            this.dynamicData = result2[0].data;
            //渲染connect右侧柱图
            var connectData = result1[0].data;
            var buildOption = this.setBarOption({
                areaColor: [{
                    offset: 0,
                    color: '#93cef4'
                }, {
                    offset: 1,
                    color: '#5d94ed'
                }],
                xdata: Object.keys(connectData.project_category),
                sdata: Object.values(connectData.project_category)
            });
            buildOption.grid.top = '40px';
            buildOption.xAxis[0].axisLabel.textStyle.color = '#949ab3';
            buildOption.xAxis[0].axisLabel.interval = 0;
            buildOption.xAxis[0].axisLabel.formatter = function(value, index) {
                if (value.length > 13) {
                    if (value.indexOf('_') > -1) {
                        var arr = value.split('_')
                        return arr.join('\n')
                    }
                }
                return value
            }
            buildOption.series[0].label.normal.textStyle.color = '#566ea3';
            this.resizeEchart(buildOption, document.getElementById('building-chart'));

            //渲染预处理磁盘覆盖率
            var totalDisk = '2TB',
                totalDiskB = 1099511627776 * 2;
            var usDisk = this.bytesToSize(result1[0].data.storage.total_disk_usage);
            var usDiskRate = parseFloat(result1[0].data.storage.total_disk_usage / totalDiskB); //1099511627776 = totalDiskB  是1024GB
            usDiskRate = usDiskRate > 1 ? 1 : usDiskRate;
            var diskHtml = '<div class="cloud-row flex">\
                            <div class="coverage-text" i18n="platform_app.overview.STORAGE">Storage</div>\
                            <div class="dark-small-text">' + usDisk + '/' + totalDisk + '</div>\
                        </div>\
                        <div class="factorsMainBar">\
                            <div class="progress1" style="width: 100%">\
                                <span class="progressBar storage-color" style="width:' + usDiskRate.toFixed(2) * 100 + '%' + ';"></span>\
                            </div>\
                        </div>';
            $('#disk-cover').append(diskHtml);
            //渲染tag点覆盖率
            var totalPoint = result1[0].data.data_density.table_points;
            var totalPointNum = totalPoint.calc + totalPoint.site + totalPoint.virtual;
            var tagNum = result1[0].data.tag.total_points_with_tags;
            var tagUserPercent = parseFloat(tagNum / totalPointNum).toFixed(2) * 100 + '%';
            var tagHtml = '<div class="cloud-row flex">\
                            <div class="coverage-text" i18n="platform_app.overview.TAG_COVERAGE">Tag coverage</div>\
                            <div class="dark-small-text">' + tagUserPercent + '</div>\
                        </div>\
                        <div class="factorsMainBar">\
                            <div class="progress1" style="width: 100%">\
                                <span class="progressBar tag-converage-color" style="width:' + tagUserPercent + ';"></span>\
                            </div>\
                        </div>';
            $('#tag-cover').append(tagHtml);
            //渲染connect的数据密度
            var deviceJson = result1[0].data.data_density.total_devices;
            var tatalDeviceNum = !jQuery.isEmptyObject(deviceJson) ? Object.values(deviceJson).reduce(function(preValue, curValue) {
                return preValue + curValue;
            }) : 0;
            var pointArea = result1[0].data.data_density.total_area;
            var densityArea = pointArea ? (totalPointNum / pointArea * 100) : '--';
            densityArea = densityArea > 1 ? this.getThousandsBit(parseInt(densityArea)) : !(isNaN(densityArea)) && densityArea.toFixed(2);
            $('#density-area').html(densityArea);
            var densityDevice = tatalDeviceNum ? parseInt(totalPointNum / tatalDeviceNum) : '--';
            $('#density-device').html(this.getThousandsBit(densityDevice));
            //渲染connect左侧饼图
            var onlineData = result2[0].data;
            let dom = '<div class="firstLine">\
                            <span class="realVal" data-toggle="modal" data-target="#myModal">' + onlineData.total_online_projects + '</span>\
                            <span>/' + onlineData.projects.length + '</span>\
                        </div>\
                        <div class="secondLine">\
                            <span i18n="platform_app.overview.OFFLINE">Offline</span>\
                        </div>';
            $('.connect-center').html(dom);
            var option = {
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(255,255,255,1)',
                    textStyle: {
                        color: '#566ea3'
                    },
                    formatter: function(params, ticket, callback, a, v, d) {
                        let color, dom, percent;
                        percent = Number(params.value);
                        if (typeof(params.color) === "object") {
                            color = params.color.colorStops[0].color;
                        } else {
                            color = params.color;
                        }
                        dom = `<span>${params.seriesName}</span></br>
                            <div style="background:${color};width: 8px;height: 8px;border-radius:50%;display: inline-block;margin-right: 5px;"></div><span>${params.name}: ${percent}</span>`;
                        return dom;
                    }
                },
                series: [{
                        name: '',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '45%'],
                        selectedMode: 'single',
                        data: [{
                            value: 1
                        }],
                        itemStyle: {
                            normal: {
                                color: function(obj) {
                                    return {
                                        type: 'radial',
                                        x: 0.5,
                                        y: 0.5,
                                        r: 0.5,
                                        colorStops: [{
                                            offset: 0,
                                            color: 'rgba(255,255,255,0.1)' // 0% 处的颜色
                                        }, {
                                            offset: 0.8,
                                            color: 'rgba(88, 186, 231, 0.2)'
                                        }, {
                                            offset: 0.95,
                                            color: 'rgba(88, 186, 231, 0.45)'
                                        }, {
                                            offset: 1,
                                            color: 'rgba(88, 186, 231, 0.55)'
                                        }]
                                    }

                                },
                            }
                        },
                        silent: true,
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    },
                    {
                        name: 'Connection',
                        type: 'pie',
                        clockWise: false,
                        radius: ['64%', '68%'],
                        center: ['50%', '45%'],
                        hoverAnimation: false,
                        data: [{
                            value: onlineData.projects.length - onlineData.total_online_projects,
                            name: 'Offline',
                            itemStyle: {
                                normal: {
                                    color: '#e8efff'
                                }
                            }
                        }, {

                            value: onlineData.total_online_projects,
                            name: 'Online',
                            itemStyle: {
                                normal: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0,
                                            color: '#7abcee' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#8ea3d2' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    },
                                    shadowBlur: 10,
                                    shadowColor: 'rgba(222, 179, 151, 0.6)'
                                }
                            }
                        }],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        label: {
                            normal: {
                                show: false
                            }
                        }
                    }
                ]
            };
            option.backgroundColor = 'rgba(235,238,247,0.15)';
            this.resizeEchart(option, document.getElementById('connect-chart'));
            this.renderPrehandlingChart();
            this.renderAlgorithmChart();
        }.bind(this)).always(function() {
            Spinner.stop();
        })

    }
    bytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024;
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
    getThousands(value) {
        if (value >= 1000 || value <= -1000) {
            return parseInt(value / 1000) + 'k';
        } else {
            return value;
        }
    }
    renderPrehandlingChart() {
        var fiveMin = 5;
        var dynamicData = parseInt(this.dynamicData.total_online_points.raw / fiveMin);
        var staticData = parseInt(this.staticData.data_density.table_points.raw / fiveMin);
        var preHandleData = parseInt(this.dynamicData.total_online_points.calc / fiveMin);
        let dom = '<span class="min">1 <span>' + i18n_resource.platform_app.overview.MINS + '</span></span>\
                    <div class="firstLine">\
                        <span class="realVal">' + this.getThousands(dynamicData) + '</span>\
                        <span>/' + this.getThousands(staticData) + '</span>\
                    </div>\
                    <div class="secondLine">\
                        <span i18n="platform_app.overview.DATA_FLUX">Data Flux</span>\
                    </div>';
        $('.cloud-center').html(dom);
        this.container.find('.treatmentValue').html(this.getThousands(preHandleData));
        var deviceList = this.staticData.data_density.total_devices;
        var indexDevice = 0;
        $.each(deviceList, function(element, value) {
            if (indexDevice < 10) {
                var deviceRow = '<div class="equipmentRow"><p titile="' + element + '">' + element + '</p><p>' + value + '</p><i class="spline"></i></div>';
                this.container.find('.equipmentList').append(deviceRow);
            }
            indexDevice++;
        }.bind(this));
        var option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(255,255,255,1)',
                textStyle: {
                    color: '#566ea3'
                },
                formatter: function(params, ticket, callback, a, v, d) {
                    console.log(1);
                    let color, dom, percent;
                    percent = Number(params.value);
                    if (typeof(params.color) === "object") {
                        color = params.color.colorStops[0].color;
                    } else {
                        color = params.color;
                    }
                    dom = `<span>${params.seriesName}</span></br>
                            <div style="background:${color};width: 8px;height: 8px;border-radius:50%;display: inline-block;margin-right: 5px;"></div><span>${params.name}: ${percent}</span>`;
                    return dom;
                }
            },
            series: [{
                    name: '',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '45%'],
                    selectedMode: 'single',
                    data: [{
                        value: 1,
                        /*                        label: {
                                                    normal: {
                                                        formatter: this.getThousands(dynamicData)+'/' + this.getThousands(staticData),
                                                        textStyle: {
                                                            color: '#e47830',
                                                            fontSize: 28
                                                        }
                                                    }
                                                }*/
                    }],
                    itemStyle: {
                        normal: {
                            color: function(obj) {
                                return {
                                    type: 'radial',
                                    x: 0.5,
                                    y: 0.5,
                                    r: 0.5,
                                    colorStops: [{
                                        offset: 0,
                                        color: 'rgba(255,255,255,0.1)' // 0% 处的颜色
                                    }, {
                                        offset: 0.8,
                                        color: 'rgba(246, 180, 136, 0.2)'
                                    }, {
                                        offset: 0.95,
                                        color: 'rgba(246, 180, 136, 0.45)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(246, 180, 136, 0.55)'
                                    }]
                                }

                            },
                        }
                    },
                    silent: true,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    }
                },
                {
                    name: 'Connection',
                    type: 'pie',
                    clockWise: false,
                    radius: ['64%', '68%'],
                    center: ['50%', '45%'],
                    hoverAnimation: false,
                    data: [{
                        value: staticData - dynamicData,
                        name: 'Offline',
                        itemStyle: {
                            normal: {
                                color: '#fff1e8'
                            }
                        }
                    }, {
                        value: dynamicData,
                        name: 'Online',
                        itemStyle: {
                            normal: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: '#f19f72' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#f16c5a' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                                shadowBlur: 10,
                                shadowColor: 'rgba(222, 179, 151, 0.6)'
                            }
                        }
                    }],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    }
                }
            ]
        };
        option.backgroundColor = 'rgba(235,238,247,0.15)';
        this.resizeEchart(option, document.getElementById('preHandling-chart'));
    }
    renderPvWebChart() {
            var endTime = new Date().format('yyyy-MM-dd');
            var startTime = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd');
            //获取百度统计的数据
            var body = {
                "header": {
                    "account_type": 1,
                    "password": "RNB.beop-2013",
                    "token": "ad725e553199b5508833de543fd0c6dc",
                    "username": "beop"
                },
                "body": {
                    "site_id": '7220379',
                    "method": 'overview/getTimeTrendRpt',
                    "metrics": 'visitor_count',
                    "start_date": startTime.replace(/-/g, ""),
                    "end_date": endTime.replace(/-/g, ""),
                    "gran": 'hour'
                }
            }
            $.ajax("https://api.baidu.com/json/tongji/v1/ReportService/getData", {
                type: 'POST',
                data: JSON.stringify(body),
                dataType: "json",
                error: function() {
                    console.log('error');
                },
                success: function(data) {
                    var xData = data

                }
            })
            var option = this.setEchartOption({
                legend: [i18n_resource.platform_app.overview.WEB],
                lineColor: [{
                    offset: 0,
                    color: '#86f1fc'
                }, {
                    offset: 1,
                    color: '#85befc'
                }],
                areaColor: [{
                    offset: 0,
                    color: 'rgba(134,241,252,0.3)'
                }, {
                    offset: 1,
                    color: 'rgba(133,190,252,0.3)'
                }],
                xdata: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
                sdata: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
            });
            option.backgroundColor = 'rgba(235,238,247,0.15)';
            option.legend.show = true;
            option.legend.data = [i18n_resource.platform_app.overview.WEB, i18n_resource.platform_app.overview.APP];
            option.grid.top = '45px';
            option.tooltip.formatter = function(params) {
                var str = '',
                    total = 0;
                params.forEach(function(ele) {
                    str += ele.seriesName + ' : ' + ele.value + '<br/>';
                    total += parseFloat(ele.value);
                });
                str += i18n_resource.platform_app.overview.PV + ' : ' + total.toFixed(0);
                return str;
            };
            option.series[1] = {
                type: 'line',
                name: i18n_resource.platform_app.overview.APP,
                symbol: 'circle',
                smooth: true,
                showSymbol: false,
                stack: '总量',
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#e670fa'
                        }, {
                            offset: 1,
                            color: '#b6ccff'
                        }]),
                        shadowColor: 'rgba(156,80,70,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 0
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#b6ccff'
                        }, {
                            offset: 1,
                            color: '#e670fa'
                        }]),
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: 'rgba(182,204,255,0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(230,112,250,0.3)'
                        }]),
                    }
                },
                data: [120, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150]
            }
            this.resizeEchart(option, document.getElementById('pv-web-chart'));
        }
        /*    渲染Connection中柱图和Visualization的图*/
    renderUserChart() {
        var screenWidth = window.innerWidth;
        if(AppConfig.projectId){
            $(this.ctn.querySelector('.btnProjectEdit')).css('display','').click(()=>{
                Router.show(ProjectCreate);
            });

        }
        //假数据 获取最近在线的前五个项目
        var arrData = [36, 28, 23, 18, 12];
        var recentProj = $('.projectList .navItem.online .text');
        var projText = [];
        if(recentProj.length<6){
            recentProj = $('.projectList .navItem .text');
        }
        for(var i=0;i<recentProj.length;i++){
            projText.push($(recentProj[i]).text());
        }
        var option = this.setBarOption({
            areaColor: [{
                offset: 0,
                color: '#93cef4'
            }, {
                offset: 1,
                color: '#5d94ed'
            }],
            xdata: projText.length>5?projText.slice(0,5):projText,
            sdata: projText.length>5?arrData:arrData.slice(0,projText.length)
        });
        option.xAxis[0].axisLabel.formatter = function(value, index) {
            var limitNum = screenWidth > 1700 ? 7 : 5;
            var tranValue = [];
            if (value.length > limitNum && AppConfig.language == 'zh') {
                for (var i = 0, len = value.length + limitNum; i < len; i += limitNum) {
                    tranValue.push(value.slice(i, i + limitNum));
                }
                return tranValue.join('\n')
            }
            if (AppConfig.language == 'en') {
                var arr = value.indexOf(' ') > -1 ? value.split(' ') : [value];
                return arr.join('\n')
            }
            return value
        }
        this.resizeEchart(option, document.getElementById('user-chart'));

    }


    /*渲染算法图表*/
    renderAlgorithmChart() {
        var dataPool = this.getThousandsBit(this.staticData.storage.total_disk_usage) + ' (' + this.bytesToSize(this.staticData.storage.total_disk_usage) + ')';
        this.container.find('.data-pool-value').html(dataPool);
        this.container.find('#reportsValue').html(this.getThousandsBit(this.staticData.diagnosis.total_reports));
        this.container.find('#alertsValue').html(this.getThousandsBit(this.dynamicData.diagnosis.total_fault_notices));
        this.container.find('#faultsValue').html(this.getThousandsBit(this.dynamicData.diagnosis.current_fault_notices));
        this.container.find('#energyValue').html(this.getThousandsBit(this.dynamicData.energy.energy_use));
        this.container.find('#costValue').html(this.getThousandsBit(this.dynamicData.energy.cost));
        this.container.find('#CO2Value').html(this.getThousandsBit(this.dynamicData.energy.co2_emission));
        var option = this.setEchartOption({
            legend: 'fault',
            lineColor: [{
                offset: 0,
                color: '#fa6653'
            }, {
                offset: 1,
                color: '#ffc675'
            }],
            areaColor: [{
                offset: 0,
                color: 'rgba(255,198,117,0.3)'
            }, {
                offset: 1,
                color: 'rgba(250,102,83,0.3)'
            }],
            /* xdata: ['11-02', '11-03', '11-04', '11-05', '11-06', '11-07', '11-08'] */
            xdata: (function() {
                var timeArr = [];
                var myDate = new Date().getTime();
                var oneDay = 86400000;
                for (var i = 7; i > 0; i--) {
                    timeArr.push(new Date(myDate - oneDay * i).format("MM-dd"));
                }
                return timeArr;
            })(),
            sdata: [26, 15, 25, 44, 32, 48, 35]
        });
        option.backgroundColor = 'rgba(235,238,247,0.15)';
        this.resizeEchart(option, document.getElementById('algorithmChart'));
    }
    setEchartOption(options) {
        var choices = options || {};
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, choices.lineColor, false)
                    }
                }
            },
            legend: {
                show: false,
                icon: 'circle',
                top: '15',
                itemHeight: '10',
                data: [options.legend],
                textStyle: {
                    fontSize: 14,
                    color: '#333'
                }
            },
            grid: {
                top: '10px',
                left: '10px',
                right: '15px',
                bottom: '10px',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#808FA3',
                        fontSize: 10,
                        align: 'right'
                    }
                },

                data: choices.xdata
            }],
            yAxis: [{
                type: 'value',
                axisTick: {
                    show: false,
                    alignWithLabel: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                axisLabel: {
                    margin: 10,
                    formatter: function(value) {
                        if (value >= 1000 || value <= -1000) {
                            return value / 1000 + 'k';
                        } else {
                            return value;
                        }
                    },
                    textStyle: {
                        color: '#949ab3',
                        fontSize: 10
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#dfe2e5'
                    }
                }
            }],

            series: [{
                name: options.legend,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 3,
                showSymbol: false,
                stack: '总量',
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, choices.lineColor, false),
                        shadowColor: 'rgba(156,80,70,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 0
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, choices.areaColor, false)
                    }
                },
                itemStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, choices.lineColor, false)
                    }
                },
                data: choices.sdata.map(function(ele) {
                    return ele ? ele.toFixed(0) : 0;
                })
            }]
        };
        return option;
    }
    setBarOption(options) {
        var screenWidth = window.innerWidth;
        var choices = options || {};
        var option = {
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                show: false,
                icon: 'circle',
                top: '15',
                itemHeight: '10',
                textStyle: {
                    fontSize: 14,
                    color: '#949ab3'
                }
            },
            grid: {
                top: '10px',
                left: '10px',
                right: '10px',
                bottom: '5px',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    inside: false,
                    margin: 3,
                    interval: 0,
                    textStyle: {
                        color: '#949ab3',
                        align: 'center'
                    },
                },
                z: 10,
                data: choices.xdata
            }],
            yAxis: [{
                type: 'value',
                name: "Users",
                show: false,
                symbol: 'circle',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
            }],

            series: [{
                type: 'bar',
                barWidth: '80%',
                barCategoryGap: '10px',
                lineStyle: {
                    normal: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, choices.lineColor, false),
                        shadowColor: 'rgba(156,80,70,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 0
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, choices.areaColor, false)
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#949ab3',
                            fontSize: 12,
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, choices.areaColor, false),
                        barBorderRadius: [4, 4, 0, 0],
                    }
                },
                data: choices.sdata.map(function(ele) {
                    return ele ? ele.toFixed(0) : 0;
                })
            }]
        };
        return option;
    }
    resizeEchart(options, dom) {
        var echartDom = echarts.init(dom);
        echartDom.setOption(options);
        $(window).resize(function() {
            $(echartDom).resize();
        });
    }

    //获取千分位
    getThousandsBit(num) {
        if (num == null || num === "" || num == "--") return '--';
        if (num == 0) return 0;
        num = num.toFixed(0);　　
        var re = /\d{1,3}(?=(\d{3})+$)/g;　　
        var n1 = num.replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) {
            return s1.replace(re, "$&,") + s2;
        });　　
        return n1;
    }
    close() {

    }
}
window.PlatformOverview = PlatformOverview