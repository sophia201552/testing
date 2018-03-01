var DataStatistic = (function() {
    function DataStatistic(pointList) {
        this.pointList = pointList ? pointList : [];
        this.store = [];
        this.head = [];
        this.queryConfig = {};
        this.selectPoints = [];

        this.tableCtn = undefined;
        this.spinner = new LoadingSpinner({ color: '#00FFFF' });
        this.requestOnLoading = undefined;
    }
    DataStatistic.prototype = {
        show: function() {
            WebAPI.get('/static/app/LogisticsPlantform/views/dataStatistic.html').done(function(html) {
                ElScreenContainer.innerHTML = html;
                this.tableCtn = ElScreenContainer.querySelector('.divStatisticTable');
                this.init();
            }.bind(this))
        },
        init: function() {
            this.initQueryTool();
            this.initStatistic();
        },
        initQueryTool: function() {
            var _this = this;
            $('.divQueryTool .btnQueryTool').click(function(e) {
                switch (e.currentTarget.dataset.action) {
                    case 'query':
                        _this.execQuery();
                        break;
                    case 'export':
                        _this.execExport();
                        break;
                    case 'map':
                        _this.execMap();
                        break;
                    default:
                        break;
                }
            })

            this.initTimeTool();
        },
        initTimeTool: function() {
            var $datePicker = $('.divTimeTool .iptContent');
            let now = new Date();
            //结束时间: 当前时间, 开始时间: 当前时间的前24小时
            $datePicker.eq(0).val(new Date(now.getTime() - 86400000).format('yyyy-MM-dd HH:mm')).datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                todayBtn: 'linked',
                endDate: now,
                autoclose: true,
                language: 'zh'
            });
            $datePicker.eq(1).val(now.format('yyyy-MM-dd HH:mm')).datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                todayBtn: 'linked',
                startDate: new Date(now.getTime() - 86400000),
                endDate: new Date(),
                autoclose: true,
                language: 'zh'
            });
            
            $datePicker.eq(0).on('change', function(e) {
                var target = e.currentTarget
                let startTime = new Date(target.value.replace(/-/g, '/')), now = new Date();
                let endTime = new Date(startTime.getTime() + 86400000);
                this.queryConfig[target.dataset.field] = startTime.format('yyyy-MM-dd HH:mm:ss');
                this.queryConfig['endTime'] = endTime.format('yyyy-MM-dd HH:mm:ss');
                //结束时间为开始时间的后24小时之内
                $datePicker.eq(1).val(endTime.format('yyyy-MM-dd HH:mm')).datetimepicker('remove').datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    todayBtn: 'linked',
                    startDate: startTime,
                    endDate: endTime.getTime() > now.getTime() ? now : endTime,
                    autoclose: true,
                    language: 'zh'
                }).on('change', (e) => {
                    let target = e.currentTarget;
                    let endTime = new Date(target.value.replace(/-/g, '/'));
                    this.queryConfig['endTime'] = endTime.format('yyyy-MM-dd HH:mm:ss');
                });
            }.bind(this));
            
            this.queryConfig = {
                startTime: new Date($datePicker[0].value.replace(/-/g, '/')).format('yyyy-MM-dd HH:mm:ss'),
                endTime: new Date($datePicker[1].value.replace(/-/g, '/')).format('yyyy-MM-dd HH:mm:ss'),
                projId: AppConfig.projectId
            }
        },
        execQuery: function() {
            this.initStatistic()
        },
        execExport: function() {
            var arrPointRow = $(this.tableCtn).find('.tr').not('.thead');
            var postData = {
                head: this.head.map((item, index) => {//去掉采集总次数及温度合格次数两列 替换成库门开启次数及压缩机运行时间
                    // return !(index === 4 || index === 5);
                    if(index === 4){
                        return '库门开启次数'
                    }
                    if(index === 5){
                        return '压缩机运行时间'
                    }
                    return item;
                }).filter((item, index) => {
                    if(index === 6){
                        return false;
                    }
                    return true;
                }),
                data: (function(arr){
                    var arrNew = [];
                    arr.forEach((item, index) => {
                        if(!arrPointRow[index].classList.contains('hide')){
                            arrNew.push(item.map((it, idx) => {
                                // return !(idx === 4 || idx === 5);//去掉采集总次数及温度合格次数两列
                                if(idx === 4 || idx === 5){
                                    return '-';
                                }
                                return it;
                            }).filter((it, idx) => {
                                if(idx === 6){
                                    return false;
                                }
                                return true;
                            }))
                        }
                    });
                    return arrNew;
                })(this.store),
                projId: AppConfig.projectId,
                begTime: this.queryConfig.startTime,
                endTime: this.queryConfig.endTime,
                type: (NavTree.focusGroup == 'fixed' ? 0 : 1)
            }
            var startTime = +new Date(this.queryConfig.startTime.replace(/-/g, '/'));
            var endTime = +new Date(this.queryConfig.endTime.replace(/-/g, '/'));
            if (endTime - startTime > 86400000) {
                infoBox.alert('暂不支持时间范围超过一天的数据导出，请谅解')
                return;
            }
            WebAPI.post('/logistics/export/excel/1', postData)
                .done(function(result) {
                    // console.log(result)
                    // window.open(result)
                    var aTag = document.createElement('a');
                    aTag.download = '数据分析-' + postData.begTime.split(' ')[0].replace(/-/g, '/') + '--' + postData.endTime.split(' ')[0].replace(/-/g, '/') + '.xls'
                    aTag.href = result;
                    document.body.appendChild(aTag);
                    aTag.onclick = function() {
                        document.body.removeChild(aTag)
                    }
                    aTag.click();
                })
        },
        execMap: function() {
            Router.back()
        },
        onNavGroupToggle: function() {
            this.selectPoints = NavTree.pointInfoArr;
            this.execQuery();
        },
        initStatistic: function() {
            this.getStatisticData().done(function() {
                this.initStatisticTable();
            }.bind(this)).always(function() {
                this.spinner.stop();
            }.bind(this))
        },
        initStatisticTable: function() {
            this.tableCtn.innerHTML = '';
            this.tableCtn.appendChild(this.createTableHead());
            if (this.store instanceof Array && this.store.length > 0) {
                this.store.forEach(function(item) {
                    this.tableCtn.appendChild(this.createTableItem(item));
                }.bind(this))
            }
        },
        createTableHead: function() {
            var dom = document.createElement('div');
            dom.className = 'thead tr'
            if (this.head instanceof Array && this.head.length > 0) {
                this.head.slice(1).forEach(function(item) {
                    if(item === '工作合格率'){//不显示工作合格率
                        return;
                    }
                    dom.innerHTML += '<span class="td">' + item + '</span>'
                }.bind(this))
            }
            return dom;
        },
        createTableItem: function(data) {
            var dom = document.createElement('div');
            dom.className = 'tr ptData_' + data[0];
            dom.dataset.id = data[0];
            if (this.selectPoints.length > 0) {
                dom.classList.add('hide');
                for (var i = 0; i < this.selectPoints.length; i++) {
                    if (this.selectPoints[i]._id == data[0]) {
                        dom.classList.remove('hide');
                        break;
                    }
                }
            }
            if (data instanceof Array && data.length > 0) {
                data.slice(1).forEach(function(item, index) {
                    if(index === 5){//不显示工作合格率
                        return;
                    }
                    dom.innerHTML += '<span class="td">' + item + '</span>'
                }.bind(this))
            }
            return dom;
        },
        onNavPointClick: function(points) {
            this.selectPoints = points;
            this.filterData(points);
        },
        filterData: function(points) {
            if (points.length == 0) {
                $(this.tableCtn).find('.tr.hide').removeClass('hide');
            } else {
                $(this.tableCtn).find('.tr').not('.thead').addClass('hide');
                points.forEach(function(item) {
                    var $dom = $(this.tableCtn).find('.ptData_' + item._id);
                    $dom.removeClass('hide');
                }.bind(this))
            }
        },
        getStatisticData: function() {
            var startTime = +new Date(this.queryConfig.startTime.replace(/-/g, '/'));
            var endTime = +new Date(this.queryConfig.endTime.replace(/-/g, '/'));
            if (isNaN(startTime) || isNaN(endTime)) {
                infoBox.alert('时间格式错误');
                return $.Deferred().reject();
            } else if (startTime >= endTime) {
                infoBox.alert('开始时间晚于结束时间，请检查');
                return $.Deferred().reject();
            }
            this.requestOnLoading && this.requestOnLoading.abort();
            this.spinner.spin(ElScreenContainer);
            this.requestOnLoading = WebAPI.post('/logistics/thing/getStatisticalList/' + (NavTree.focusGroup == 'fixed' ? 0 : 1), this.queryConfig).done(function(result) {
                try {
                    this.store = result.data
                } catch (e) {
                    this.store = [];
                }

                try {
                    this.head = result.head
                } catch (e) {
                    this.head = [];
                }
            }.bind(this)).always(function() {
                this.requestOnLoading = null;
            }.bind(this))
            return this.requestOnLoading;
        },
        close: function() {

        }
    }
    return DataStatistic
})()