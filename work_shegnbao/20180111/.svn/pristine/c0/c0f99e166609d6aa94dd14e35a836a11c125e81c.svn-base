var ModalInteractiveTrendChart = (function() {
    function ModalInteractiveTrendChart(screen, entityParams, _renderModal) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        ModalBase.call(this, screen, entityParams, renderModal);
        this.pointsArr = [];
        this.seriesArr = [];
        this.timeArr = [];
    };
    ModalInteractiveTrendChart.prototype = new ModalBase();
    ModalInteractiveTrendChart.prototype.optionTemplate = {
        name: 'toolBox.modal.INTERACTIVE_TREND_CHART',
        parent: 0,
        mode: 'custom',
        maxNum: 1,
        minHeight: 6,
        minWidth: 12,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalInteractiveTrendChart'
    };
    ModalInteractiveTrendChart.prototype.renderModal = function() {
        this.layoutPage();
        this.initDom();
        this.renderTagTree();
    };
    ModalInteractiveTrendChart.prototype.layoutPage = function() {
        var startTime = new Date().format('yyyy-MM-dd 00:00:00');
        var endTime = new Date().format('yyyy-MM-dd HH:00:00');
        var dom = `<div class="interactiveTrendChart">
                        <div class="leftTagTree">
                            <div class="tagTreeTitle title">Point</div>
                            <div id="tagTreeCtn" class="gray-scrollbar"></div>
                        </div>
                        <div class="rightChart">
                            <div class="chartBoxTitle title">Curve</div>
                            <div class="configTime">
                                <div class="startTime">
                                    <label>` + I18n.resource.toolBox.modalInteractive.START_TIME + `</label>
                                    <input size="20" type="text" class="form_datetime" value="${startTime}">
                                </div>
                                <div class="endTime">
                                    <label>` + I18n.resource.toolBox.modalInteractive.END_TIME + `</label>
                                    <input size="20" type="text" class="form_datetime" value="${endTime}">
                                </div>
                                <div class="period">
                                    <select>
                                        <option>m1</option>
                                        <option>m5</option>
                                        <option>h1</option>
                                        <option>d1</option>
                                    </select>
                                 </div>
                                <button class="selectBtn btn btn-success">` + I18n.resource.toolBox.modalInteractive.QUERY + `</button>
                            </div>
                            <div class="chartCtn">
                                <div class="dataSourceCtn gray-scrollbar">
                                    <span class="prompt">` + I18n.resource.toolBox.modalInteractive.DATASROUCE_DRAG + `</span>
                                </div>
                                <div class="echartsBox"></div>
                            </div>
                        </div>
                    </div>`;
        $(this.container).html(dom);
        $(this.container).find('.form_datetime').datetimepicker({
            startView: '1',
            minView: '1',
            format: "yyyy-mm-dd hh:ii:ss",
            autoclose: true
        });

        this.attachEvents();
    };
    ModalInteractiveTrendChart.prototype.initDom = function() {
        this.$startTime = $(this.container).find('.startTime input');
        this.$endTime = $(this.container).find('.endTime input');
        this.$period = $(this.container).find('.period select');
    };
    ModalInteractiveTrendChart.prototype.renderTagTree = function() {
        var _this = this;
        beop.tag.tree.configModel({
            isOnlyGroup: false,
            hasWrapperNode: false,
            editable: false,
            isDrag: false,
            showIcon: false,
            isLoadCache: false,
            cb_on_add_dom: function(treeId, treeNode) {
                var $itemLeaf = $('#' + treeNode.tId);
                var ids = [];
                $itemLeaf.attr('nodeId', treeNode._id);
                $itemLeaf.attr('isParent', treeNode.isParent);
                $itemLeaf.attr('draggable', true);
                if (AppConfig.isFactory === 0) {
                    $('#tagTreeInfo').find('header').hide();
                }
            }
        });
        beop.tag.tree.init($(this.container).find('#tagTreeCtn'));
    };
    ModalInteractiveTrendChart.prototype.getDatas = function(obj, type) {
        var _this = this;
        var points = [];
        var startTime = obj.startTime;
        var endTime = obj.endTime;
        var period = obj.period;
        if (type === 'add') {
            points.push(obj.points);
        } else if (type === 'search') {
            points = this.pointsArr;
        }

        var projectId = AppConfig.projectId;
        var pointsArr = [];
        for (var i = 0, length = points.length; i < length; i++) {
            pointsArr.push('@' + projectId + '|' + points[i]);
        }
        var postData = {
            dsItemIds: pointsArr,
            timeStart: startTime,
            timeEnd: endTime,
            timeFormat: period
        }
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function(rs) {
            console.log(rs);
            var time = rs.timeShaft;
            var data = rs.list;
            if (type === 'search') {
                _this.seriesArr = [];
            }
            _this.timeArr = time;
            for (var i = 0, length = data.length; i < length; i++) {
                var obj = {
                    type: 'line',
                    name: data[i].dsItemId,
                    data: data[i].data
                }
                _this.seriesArr.push(obj);
            }
            _this.renderEcharts();
        })
    };
    ModalInteractiveTrendChart.prototype.renderEcharts = function() {
        var option = {
            tooltip: {
                trigger: 'axis',
            },
            xAxis: {
                type: 'category',
                name: 'x',
                splitLine: { show: false },
                data: this.timeArr
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: 10,
                containLabel: true
            },
            yAxis: {
                type: 'value',
                name: 'y'
            },
            series: this.seriesArr
        };
        this.chart = echarts.init($(this.container).find('.echartsBox')[0], AppConfig.chartTheme);
        this.chart.setOption(option);
    };
    ModalInteractiveTrendChart.prototype.attachEvents = function() {
        var _this = this;
        var eleDrag;
        $(this.container).off('dragstart ').on('dragstart', '[isparent="false"]', function(e) {
            /*拖拽开始*/
            eleDrag = e.target;
            return true;
        });
        $(this.container).off('dragover ').on('dragover', '.dataSourceCtn', function(e) {
            /*拖拽元素在目标元素头上移动的时候*/
            e.preventDefault();
            return true;
        });
        $(this.container).off('dragenter  ').on('dragenter', '.dataSourceCtn', function(e) {
            /*拖拽元素进入目标元素头上的时候*/
            return true;
        })
        $(this.container).off('drop ').on('drop', '.dataSourceCtn', function(e) {
            if (e.originalEvent.dataTransfer.files.length === 0) {
                var colorList = ["#E2583A", "#FD9F08", "#1D74A9", "#04A0D6", "#689C0F", "#109d83", "#FEC500"];
                var name = eleDrag.innerText;
                var index;
                if ($(_this.container).find('.singleDataSource').length === 0) {
                    index = 0;
                    $(this).html('');
                } else {
                    var length = $(this).find('.singleDataSource').length;
                    var lastIndex = $(this).find('.singleDataSource').eq(length - 1).data('index');
                    index = (Number(lastIndex) + 1) > 6 ? (Number(lastIndex) + 1) % 7 : (Number(lastIndex) + 1);
                }
                var singleDataSource = `<div class="singleDataSource" data-index="${index}" style="background:${colorList[index]};">
                                        <span class="dataSourceName" tutle="${name}">${name}</span>
                                        <span class="glyphicon glyphicon-remove" style="display:none;"></span>
                                    </div>`;
                $(this).append($(singleDataSource));
                _this.pointsArr.push(name);
                var obj = {
                    points: name,
                    startTime: _this.$startTime.val(),
                    endTime: _this.$endTime.val(),
                    period: _this.$period.find("option:selected").text()
                }
                _this.getDatas(obj, 'add');
            } else {
                // var f = e.originalEvent.dataTransfer.files[0];
                // var reader = new FileReader();
                // reader.onload = (function(file) {
                //     return function(e) {
                //         var div = document.createElement('div');
                //         div.className = "text"
                //         div.innerHTML = encodeHTML(this.result);

                //         $(_this.container).append(div, null);
                //     };
                // })(f);
                // //读取文件内容
                // reader.readAsText(f, 'utf-8');
            }
        });
        $(this.container).off('mouseover').on('mouseover', '.singleDataSource', function() {
            $(_this.container).find('.singleDataSource .glyphicon').hide();
            $(this).find('.glyphicon').show();
        });
        $(this.container).off('mouseout').on('mouseout', '.singleDataSource', function() {
            $(this).find('.glyphicon').hide();
        });
        $(this.container).off('click.remove').on('click.remove', '.singleDataSource .glyphicon', function() {
            var $parent = $(this).closest('.singleDataSource');
            var name = $parent.find('.dataSourceName').html();
            $parent.remove();
            if ($(_this.container).find('.singleDataSource').length === 0) {
                $(_this.container).find('.dataSourceCtn').html('<span class="prompt">' + I18n.resource.dashboard.modalInteractive.DATASROUCE_DRAG + '</span>');
            }
            //颜色变化 与 图表里的对应起来
            var colorList = ["#E2583A", "#FD9F08", "#1D74A9", "#04A0D6", "#689C0F", "#109d83", "#FEC500"];
            $(_this.container).find('.singleDataSource').each(function(index, ele) {
                $(ele).attr('data-index', index);
                var actualIndex = Number(index) > 6 ? Number(index) % 7 : Number(index);
                $(ele).css({ 'background': colorList[actualIndex] });
            })
            var index = _this.pointsArr.indexOf(name);
            _this.pointsArr.splice(index, 1);
            _this.seriesArr.splice(index, 1);
            _this.renderEcharts();
        });
        $(this.container).off('click.search').on('click.search', '.selectBtn', function() {
            var pointName = [];
            $(_this.container).find('.singleDataSource .dataSourceName').each(function() {
                pointName.push($(this).html());
            })
            if (pointName.length === 0) {
                alert(I18n.resource.dashboard.modalInteractive.DATASROUCE_DRAG);
            } else {
                var obj = {
                    points: pointName,
                    startTime: _this.$startTime.val(),
                    endTime: _this.$endTime.val(),
                    period: _this.$period.find("option:selected").text()
                }
                _this.getDatas(obj, 'search');
            }
        });
    };
    return ModalInteractiveTrendChart;
})()