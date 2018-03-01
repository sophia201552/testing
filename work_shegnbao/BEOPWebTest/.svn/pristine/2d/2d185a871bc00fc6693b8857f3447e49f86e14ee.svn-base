/// <reference path="../../../lib/jquery-2.1.4.min.js" />
var DrawGraph = (function () {
    var _this;
    function DrawGraph(screenPre, graph, container,color) {//graphsList:传入的图形参数集合
        _this = this;
        this.container = container;
        this.color = color;
        this.screenPre = screenPre;
        this.graph = graph;
        this.svgW = undefined;//画板父容器宽度
        this.svgH = undefined;//画板父容器高度
    }
    DrawGraph.prototype = {
        show: function () {},
        render: function () { },
        //创建初始画板
        createBoard: function () {
            var $svgGraph = $('.svgGraph');
            if ($svgGraph.length === 0) {
                $svgGraph = $('<svg class="svgGraph" style="position:absolute;z-index:149;">\
                        <defs><marker id="arrowHead" orient="auto" markerWidth="2" markerHeight="4" refX="0.1" refY="2"><path d="M0,0 V4 L2,2 Z" fill="red"/></marker>\
                        </defs>\
                        <path id="arrow-line" marker-end="url(#arrowHead)" stroke-width="4" fill="none" stroke="red" d=""/>\
                        <ellipse style="fill:rgba(0,0,0,0);stroke-width:2px;" orient="auto" class="circle" orient="auto"/>\
                        <rect style="fill:rgba(0,0,0,0);stroke-width:2px;" class="rect" orient="auto"/>\
                        </svg>');
                _this.$svgBox.append($svgGraph);
            }
            this.svgW = $('#anlsPaneContain .panel-body').width();
            this.svgH = $('#anlsPaneContain .panel-body').height();
            $svgGraph[0].setAttribute("viewBox", "0 0 " + this.svgW + " " + this.svgH);
            $svgGraph[0].setAttribute("width", this.svgW);
            $svgGraph[0].setAttribute("height", this.svgH);
            return $svgGraph;
        },
        //删除图形
        deleteGraph: function () {
            if ($('.deleteGraph').length === 0) {
                return;
            }
            $('.deleteGraph').hover(function (e) {
                $(this).css('cursor', 'pointer');
            }, function () {
                $(this).css('cursor', '');
            });
            $('.deleteGraph').off('click').click(function () {
                $(this).parent('.svgCopyBox').remove();
                var index = _this.getGraphListIndex($(this).parent('.svgCopyBox').children('.svgGraphCopy').attr('id'));
                if (index != undefined) {
                    _this.screenPre.curModal.graphList.splice(index, 1);
                    _this.screenPre.saveModal();
                    _this.screenPre.saveModalJudge.resolveWith(_this.screenPre, [_this.screenPre, 1, _this.chart, $('#divWSPane .selected'), _this.screenPre.curModal, false]);
                }
            });
        },
        //显示删除按钮
        graphHover: function ($svgCopyBox) {
            $svgCopyBox.hover(function () {
                _this.deleteGraph();
                $(this).children('.deleteGraph').show();
                $(this).css({ 'cursor': 'move' }).addClass('svgCopyBoxTem');
            }, function () {
                $(this).removeClass('svgCopyBoxTem');
                $(this).children('.deleteGraph').hide();
                $(this).css('border', 'none');
            });
        },
        //拖动图形
        graphDrag: function (id) {
            var $target = $('#' + id);
            if ($target.length === 0) {
                return;
            }
            var svgGraphCopy = $target[0];
            var disX = 0, disY = 0;
            svgGraphCopy.onmousedown = function (e) {
                var svgCopyBox = svgGraphCopy.parentNode;
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                //当鼠标按下时计算鼠标与拖拽对象的距离
                disX = e.clientX + scrollLeft - svgCopyBox.offsetLeft;
                disY = e.clientY + scrollTop - svgCopyBox.offsetTop;
                this.onmousemove = function (e) {
                    var ol = e.clientX + scrollLeft;
                    var ot = e.clientY + scrollTop;
                    //当鼠标拖动时计算div的位置
                    var l = ol - disX;
                    var t = ot - disY;
                    svgCopyBox.style.left = l + "px";
                    svgCopyBox.style.top = t + "px";
                    //禁止超出paneBody
                    var isTop = svgCopyBox.offsetTop < 0
                    var isLeft = svgCopyBox.offsetLeft < 0;
                    var isRight = svgCopyBox.offsetParent.offsetWidth - svgCopyBox.offsetLeft < svgCopyBox.offsetWidth;
                    var isBottom = svgCopyBox.offsetParent.offsetHeight - svgCopyBox.offsetTop < svgCopyBox.offsetHeight;

                    if (isTop) {
                        svgCopyBox.style.top = '0px';
                    }
                    if (isLeft) {
                        svgCopyBox.style.left = '0px';
                    }
                    if (isRight) {
                        svgCopyBox.style.left = svgCopyBox.parentNode.offsetWidth - svgCopyBox.offsetWidth + 'px';
                    }
                    if (isBottom) {
                        svgCopyBox.style.top = svgCopyBox.parentNode.offsetHeight - svgCopyBox.offsetHeight + 'px';
                    }
                }
                this.onmouseup = function (e) {
                    this.onmousemove = null;
                    this.onmouseup = null;
                    var graph = {
                        id: id,
                        top: (parseInt(svgCopyBox.style.top.split('px')[0]) * 100 / _this.$svgBox.height()).toFixed(2) + '%',
                        left: (parseInt(svgCopyBox.style.left.split('px')[0]) * 100 / _this.$svgBox.width()).toFixed(2) + '%',
                    }
                    _this.saveGraph(graph);
                }
            }
        },
        getGraphListIndex: function (id) {
            for (var i = 0; i < _this.screenPre.curModal.graphList.length; i++) {
                if (_this.screenPre.curModal.graphList[i].id == id) {
                    return i;
                }
            }
        },
        getGraphData: function ($graph) {
            if (_this.screenPre.curModal.graphList == undefined) _this.screenPre.curModal.graphList = [];
            var id = $graph.attr('id');
            var type = $graph.attr('type');
            var graph = {
                chartName: _this.screenPre.curModal.type,
                id: id,
                type: type,
                color: _this.color,
                top: (parseInt($graph.parent('.svgCopyBox').css('top').split('px')[0]) * 100 / _this.$svgBox.height()).toFixed(2) + '%',
                left: (parseInt($graph.parent('.svgCopyBox').css('left').split('px')[0]) * 100 / _this.$svgBox.width()).toFixed(2) + '%',
                width: $graph.width(),
                height: $graph.height(),
                marker_id: $graph.find('marker') ? $graph.find('marker').attr('id') : null,
                path_d: $graph.children('path') ? $graph.children('path').attr('d') : null,
                cx: $graph.children('ellipse') ? $graph.children('ellipse').attr('cx') : null,
                cy: $graph.children('ellipse') ? $graph.children('ellipse').attr('cy') : null,
                rx: $graph.children('ellipse') ? $graph.children('ellipse').attr('rx') : null,
                ry: $graph.children('ellipse') ? $graph.children('ellipse').attr('ry') : null,
            }
            return graph;
        },
        //保存图形
        saveGraph: function (graph) {
            var isSave = false;
            var index = _this.getGraphListIndex(graph.id);
            //新建图形保存
            if (index == undefined) {
                _this.screenPre.curModal.graphList.push(graph);
                doSave();
            } else {//移动时保存
                var graph_old = _this.screenPre.curModal.graphList[index];
                if (graph.left && graph.left != graph_old.left) {
                    isSave = true
                }
                if (!isSave && graph.top && graph.top != graph_old.top) {
                    isSave = true
                }
                if (isSave) {
                    _this.screenPre.curModal.graphList[index].left = graph.left;
                    _this.screenPre.curModal.graphList[index].top = graph.top;
                    doSave();
                }
            }
            function doSave() {
                _this.screenPre.saveModal();
                _this.screenPre.saveModalJudge.resolveWith(_this.screenPre, [_this.screenPre, 1, _this.chart, $('#divWSPane .selected'), _this.screenPre.curModal, false]);
            }
        }
    }
    return DrawGraph;
})();
//画箭头
var DrawArrow = (function () {
    var _this;
    function DrawArrow(screenPre, graph, container, color) {
        DrawGraph.call(this, screenPre, graph, container, color);
        this.screenPre = screenPre;
        this.graph = graph;
        this.container = container;
        if (!this.color || this.color == '') {
            this.color = 'red';
        } else {
            this.color = color;
        }
        this.$svgBox = $('.svgBox');
        this.$parentContainer = $(this.container).parent();
        if (!this.$svgBox || $('.svgBox').length === 0) {
            this.$svgBox = $('<div class="svgBox" style="width:100%;height:100%;position:absolute;top:0;left:0;"></div>');
            this.$parentContainer.append(this.$svgBox);
        }
        _this = this;
    }
    DrawArrow.prototype = new DrawGraph();
    DrawArrow.prototype.show = function () {
        this.render(this.graph);
        _this.graphHover($('#' + this.graph.id).parent('.svgCopyBox'));
        _this.graphDrag(this.graph.id);
    };
    //渲染箭头
    DrawArrow.prototype.render = function (graph) {
        var $box_arrow = $('<div class="svgCopyBox" style="width:' + (graph.width + 8) + 'px;height:' + (graph.height + 8) + 'px;padding:2px;position:absolute;left:' + graph.left + ';top:' + graph.top + ';z-index:149;">\
                <span class="glyphicon glyphicon-remove deleteGraph deleteGraphTem"></span>\
                <svg class="svgGraphCopy" id="'+ graph.id + '" viewBox="0 0 ' + graph.width + ' ' + graph.height + '" width="' + graph.width + '" height="' + graph.height + '" >\
                <defs><marker id="'+ graph.marker_id + '" orient="auto" markerWidth="2" markerHeight="4" refX="0.1" refY="2"><path d="M0,0 V4 L2,2 Z" fill="' + graph.color + '"/></marker></defs>\
                <path class="arrow-line2" marker-end="url(#'+ graph.marker_id + ')" stroke-width="4" stroke="' + graph.color + '" d="' + graph.path_d + '"/>\
                </svg></div>');
        this.$svgBox.append($box_arrow);
    };
    //画箭头
    DrawArrow.prototype.drawing = function () {
        var $svgGraph = this.createBoard();
        var $svgGraphCopy = $('.svgGraphCopy');
        var $svgCopyBox = $('.svgCopyBox');
        function rotate(angle) {
            var arrowLine = $('#arrow-line')[0];
            arrowLine.setAttribute("transform", "rotate(" + angle + ")");
        }
        function lineTo(start, end) {
            var arrowLine = $('#arrow-line')[0];
            var arrowHeadP = $('#arrowHead path')[0];
            arrowLine.setAttribute('d', 'M' + start.join(',') + ' L' + end.join(','));
            arrowLine.setAttribute("stroke", _this.color);
            arrowHeadP.setAttribute('fill', _this.color);
        }
        $svgGraph[0].onmousedown = function (e) {
            var downX = e.offsetX;
            var downY = e.offsetY;
            $svgGraph[0].onmousemove = function (e) {
                var curX = e.offsetX;
                var curY = e.offsetY;
                lineTo([downX, downY], [curX, curY]);
            }
            $svgGraph[0].onmouseup = function (e) {
                if (!_this.$svgBox) {
                    $('.svgBox').remove();
                    return
                }
                var xDiffer = Math.abs(e.offsetX - downX);
                var yDiffer = Math.abs(e.offsetY - downY);
                if (xDiffer < 20) {
                    xDiffer = 20
                }
                if (yDiffer < 20) {
                    yDiffer = 20
                }
                $svgGraph[0].onmousemove = null;
                $svgGraph[0].onmouseup = null;
                // 1   新建svg保存图形删除初始画板
                var newGraphId = new Date().getTime();
                if (e.offsetX >= downX && e.offsetY < downY) {
                    $svgCopyBox = $('<div class="svgCopyBox" style="width:' + (xDiffer + 8) + 'px;height:' + (yDiffer + 8) + 'px;padding:2px;position:absolute;left:' + (downX * 100 / _this.svgW) + '%;top:' + ((e.offsetY) * 100 / _this.svgH-0.6) + '%;z-index:149;">' +
                        '<span class="glyphicon glyphicon-remove deleteGraph deleteGraphTem"></span></div>');
                    $svgGraphCopy = $('<svg class="svgGraphCopy" id="' + newGraphId + '" viewBox="0 0 ' + xDiffer + ' ' + yDiffer + '" width="' + xDiffer + '" height="' + yDiffer + '" type="arrow">' +
                        '<defs><marker id="marker_' + newGraphId + '" orient="auto" markerWidth="2" markerHeight="4" refX="0.1" refY="2"><path d="M0,0 V4 L2,2 Z" fill="' + _this.color + '"/></marker></defs>' +
                        '<path class="arrow-line2" marker-end="url(#marker_' + newGraphId + ')" stroke-width="4" stroke="' + _this.color + '" d="M0 , ' + yDiffer + 'L' + Math.abs(e.offsetX - downX - 8) + ',8"/>' +
                        '</svg>');
                    $svgCopyBox.append($svgGraphCopy);
                    _this.$svgBox.append($svgCopyBox);
                    _this.graphHover($('#' + newGraphId).parent('.svgCopyBox'));
                    $('.svgGraph').remove();
                    _this.graphDrag(newGraphId);
                    _this.saveGraph(_this.getGraphData($svgGraphCopy));
                }
                    // 4
                else if (e.offsetX > downX && e.offsetY >= downY) {
                    $svgCopyBox = $('<div class="svgCopyBox" style="width:' + (xDiffer + 8) + 'px;height:' + (yDiffer + 8) + 'px;padding:2px;position:absolute;left:' + (downX * 100 / _this.svgW) + '%;top:' + (downY * 100 / _this.svgH) + '%;z-index:149;">' +
                       '<span class="glyphicon glyphicon-remove deleteGraph deleteGraphTem"></span></div>');
                    $svgGraphCopy = $('<svg class="svgGraphCopy" id="' + newGraphId + '" viewBox="0 0 ' + xDiffer + ' ' + yDiffer + '" width="' + xDiffer + '" height="' + yDiffer + '" type="arrow">' +
                        '<defs><marker id="marker_' + newGraphId + '" orient="auto" markerWidth="2" markerHeight="4" refX="0.1" refY="2"><path d="M0,0 V4 L2,2 Z" fill="' +_this.color + '"/></marker></defs>' +
                        '<path class="arrow-line1" marker-end="url(#marker_' + newGraphId + ')" stroke-width="4" stroke="' + _this.color + '" d="M0 ,0 ' + 'L' + Math.abs(e.offsetX - downX - 8) + ',' + Math.abs(e.offsetY - downY - 8) + '"/>' +
                        '</svg>');
                    $svgCopyBox.append($svgGraphCopy);
                    _this.$svgBox.append($svgCopyBox);
                    _this.graphHover($('#' + newGraphId).parent('.svgCopyBox'));
                    $('.svgGraph').remove();
                    _this.graphDrag(newGraphId);
                    _this.saveGraph(_this.getGraphData($svgGraphCopy));
                }
                    // 2
                else if (e.offsetX <= downX && e.offsetY <= downY) {
                    $svgCopyBox = $('<div class="svgCopyBox" style="width:' + (xDiffer + 8) + 'px;height:' + (yDiffer + 8) + 'px;padding:2px;position:absolute;left:' + ((e.offsetX) * 100 / _this.svgW) + '%;top:' + ((e.offsetY) * 100 / _this.svgH) + '%;z-index:149;">' +
                       '<span class="glyphicon glyphicon-remove deleteGraph deleteGraphTem"></span></div>');
                    $svgGraphCopy = $('<svg class="svgGraphCopy" id="' + newGraphId + '" id="new Date().getTime()" viewBox="0 0 ' + xDiffer + ' ' + yDiffer + '" width="' + xDiffer + '" height="' + yDiffer + '" type="arrow">' +
                            '<defs><marker id="marker_' + newGraphId + '" orient="auto" markerWidth="2" markerHeight="4" refX="0.1" refY="2"><path d="M0,0 V4 L2,2 Z" fill="' + _this.color + '"/></marker></defs>' +
                            '<path class="arrow-line1" marker-end="url(#marker_' + newGraphId + ')" stroke-width="4" stroke="' + _this.color + '" d="M ' + xDiffer + ',' + yDiffer + 'L8,8"/>' +
                            '</svg>');
                    $svgCopyBox.append($svgGraphCopy);
                    _this.$svgBox.append($svgCopyBox);
                    _this.graphHover($('#' + newGraphId).parent('.svgCopyBox'));
                    $('.svgGraph').remove();
                    _this.graphDrag(newGraphId);
                    _this.saveGraph(_this.getGraphData($svgGraphCopy));
                }
                    // 3
                else if (e.offsetX < downX && e.offsetY >= downY) {
                    $svgCopyBox = $('<div class="svgCopyBox" style="width:' + (xDiffer + 8) + 'px;height:' + (yDiffer + 8) + 'px;padding:2px;position:absolute;left:' + ((e.offsetX) * 100 / _this.svgW) + '%;top:' + (downY*100 / _this.svgH) + '%;z-index:149;">' +
                       '<span class="glyphicon glyphicon-remove deleteGraph deleteGraphTem"></span></div>');
                    $svgGraphCopy = $('<svg class="svgGraphCopy" id="' + newGraphId + '" viewBox="0 0 ' + xDiffer + ' ' + yDiffer + '" width="' + xDiffer + '" height="' + yDiffer + '" type="arrow" >\
                            <defs><marker id="marker_' + newGraphId + '" orient="auto" markerWidth="2" markerHeight="4" refX="0.1" refY="2"><path d="M0,0 V4 L2,2 Z" fill="' + _this.color + '"/></marker></defs>\
                            <path class="arrow-line1" marker-end="url(#marker_' + newGraphId + ')" stroke-width="4" stroke="' + _this.color + '" d="M' + xDiffer + ' ,0 ' + ' L8,' + Math.abs(e.offsetY - downY - 8) + '"/>\
                            </svg>');
                    $svgCopyBox.append($svgGraphCopy);
                    _this.$svgBox.append($svgCopyBox);
                    _this.graphHover($('#' + newGraphId).parent('.svgCopyBox'));
                    $('.svgGraph').remove();
                    _this.graphDrag(newGraphId);
                    _this.saveGraph(_this.getGraphData($svgGraphCopy));
                }
                $('#graphBox').hide();
                $('.graphActive').click();
                $('.svgGraph').remove();
            }
        }
    };
    return DrawArrow;
})();
//画圆形
var DrawCircle = (function () {
    var _this;
    function DrawCircle(screenPre, graph, container, color) {
        DrawGraph.call(this, screenPre, graph, container,color);
        this.graph = graph;
        this.container = container;
        this.screenPre = screenPre;
        this.$svgBox = $('.svgBox');
        this.$parentContainer = $(this.container).parent();
        if (!this.$svgBox || $('.svgBox').length === 0) {
            this.$svgBox = $('<div class="svgBox" style="width:100%;height:100%;position:absolute;top:0;left:0;"></div>');
            this.$parentContainer.append(this.$svgBox);
        }
        if (!this.color || this.color == '') {
            this.color = 'red';
        } else {
            this.color = color;
        }
        _this = this;
    }
    DrawCircle.prototype = new DrawGraph();
    DrawCircle.prototype.show = function () {
        this.render(this.graph);
        _this.graphHover($('#' + this.graph.id).parent('.svgCopyBox'));
        _this.graphDrag(this.graph.id);
    };
    //渲染圆形
    DrawCircle.prototype.render = function (graph) {
        var $box_cicle = $('<div class="svgCopyBox" style="width:' + (graph.width + 8) + 'px;height:' + (graph.height + 8) + 'px;padding:2px;position:absolute;left:' + graph.left + ';top:' + graph.top + ';z-index:149;">\
            <span class="glyphicon glyphicon-remove deleteGraph deleteGraphTem"></span>\
            <svg class="svgGraphCopy" id="' + graph.id + '" viewBox="0 0 ' + graph.width + ' ' + graph.height + '" width="' + graph.width + '" height="' + graph.height + '" >\
            <ellipse style="fill:rgba(0,0,0,0);stroke-width:3px;stroke:'+ graph.color + '" orient="auto" cx="' + graph.cx + '" cy="' + graph.cy + '" rx="' + graph.rx + '" ry="' + graph.ry + '" x="0" y="0"/>\
            </svg></div>');
        this.$svgBox.append($box_cicle);
    };
    //画圆形
    DrawCircle.prototype.drawing = function () {
        var $svgGraph = this.createBoard();
        var $svgGraphCopy = $('.svgGraphCopy');
        var $svgCopyBox = $('.svgCopyBox');
        function circleTo(start, end) {
            var circle = $('.circle')[0];
            circle.setAttribute("cx", start[0] + Math.abs(end[0] - start[0]) / 2);
            circle.setAttribute("cy", start[1] + Math.abs(end[1] - start[1]) / 2);
            circle.setAttribute("rx", Math.abs(end[0] - start[0]) / 2);
            circle.setAttribute("ry", Math.abs(end[1] - start[1]) / 2);
            circle.setAttribute("stroke", _this.color);
        }
        $svgGraph[0].onmousedown = function (e) {
            var downX = e.offsetX;
            var downY = e.offsetY;

            $svgGraph[0].onmousemove = function (e) {
                var curX = e.offsetX;
                var curY = e.offsetY;
                circleTo([downX, downY], [curX, curY]);
            };

            $svgGraph[0].onmouseup = function (e) {
                if (!_this.$svgBox) {
                    $('.svgBox').remove();
                    return
                }
                $svgGraph[0].onmousemove = null;
                $svgGraph[0].onmouseup = null;
                var newGraphId = new Date().getTime();
                $svgCopyBox = $('<div class="svgCopyBox" style="width:' + (Math.abs(e.offsetX - downX) + 8) + 'px;height:' + (Math.abs(e.offsetY - downY) + 8) + 'px;position:absolute;left:' + (downX * 100 / _this.svgW) + '%;top:' + (downY * 100 / _this.svgH) + '%;z-index:149;padding:2px;">' +
                       '<span class="glyphicon glyphicon-remove deleteGraph deleteGraphTem"></span></div>');
                $svgGraphCopy = $('<svg class="svgGraphCopy" id="' + newGraphId + '" viewBox="0 0 ' + Math.abs(e.offsetX - downX) + ' ' + Math.abs(e.offsetY - downY) + '" width="' + Math.abs(e.offsetX - downX) + '" height="' + Math.abs(e.offsetY - downY) + '" type="circle">' +
                        '<ellipse style="fill:rgba(0,0,0,0);stroke-width:3px;stroke:' + _this.color + '" orient="auto" cx="' + Math.abs(e.offsetX - downX) / 2 + '" cy="' + Math.abs(e.offsetY - downY) / 2 + '" rx="' + Math.abs(e.offsetX - downX - 4) / 2 + '" ry="' + Math.abs(e.offsetY - downY - 4) / 2 + '" x="0" y="0"/>' +
                        '</svg>');
                $svgCopyBox.append($svgGraphCopy);
                _this.$svgBox.append($svgCopyBox);
                _this.graphHover($('#'+newGraphId).parent('.svgCopyBox'));
                _this.graphDrag(newGraphId);
                _this.saveGraph(_this.getGraphData($svgGraphCopy));
                $('#graphBox').hide();
                $('.graphActive').click();
                $('.svgGraph').remove();
            }
        }
    };
    return DrawCircle;
})();
//画方形
var DrawRect = (function () {
    var _this;
    function DrawRect(screenPre, graph, container, color) {
        DrawGraph.call(this, screenPre, graph, container,color);
        this.graph = graph;
        this.container = container;
        this.screenPre = screenPre;
        this.$svgBox = $('.svgBox');
        this.$parentContainer = $(this.container).parent();
        if (!this.$svgBox || $('.svgBox').length === 0) {
            this.$svgBox = $('<div class="svgBox" style="width:100%;height:100%;position:absolute;top:0;left:0;"></div>');
            this.$parentContainer.append(this.$svgBox);
        }
        if (!this.color || this.color == '') {
            this.color = 'red';
        } else {
            this.color = color;
        }
        _this = this;
    }
    DrawRect.prototype = new DrawGraph();
    DrawRect.prototype.show = function () {
        this.render(this.graph);
        _this.graphHover($('#' + this.graph.id).parent('.svgCopyBox'));
        _this.graphDrag(this.graph.id);
    };
    //渲染方形
    DrawRect.prototype.render = function (graph) {
        var $box_rect = $('<div class="svgCopyBox" style="width:' + (graph.width + 8) + 'px;height:' + (graph.height + 8) + 'px;padding:2px;position:absolute;left:' + graph.left + ';top:' + graph.top + ';z-index:149;">\
            <span class="glyphicon glyphicon-remove deleteGraph deleteGraphTem"></span>\
            <svg class="svgGraphCopy" id="'+ graph.id + '" viewBox="0 0 ' + graph.width + ' ' + graph.height + '" width="' + graph.width + '" height="' + graph.height + '" >\
            <rect style="fill:rgba(0,0,0,0);stroke-width:4px;stroke:'+ graph.color + '" orient="auto" width="' + graph.width + '" height="' + graph.height + '"/>\
            </svg></div>');
        this.$svgBox.append($box_rect);
    };
    //画方形
    DrawRect.prototype.drawing = function () {
        var $svgGraph = this.createBoard();
        var $svgGraphCopy = $('.svgGraphCopy');
        var $svgCopyBox = $('.svgCopyBox');
        function rectTo(start, end) {
            var rect = $('.rect')[0];
            //var rectShow = $('#rectShow')[0];
            rect.setAttribute('width', Math.abs(end[0] - start[0]));
            rect.setAttribute('height', Math.abs(end[1] - start[1]));
            rect.setAttribute('x', start[0]);
            rect.setAttribute('y', start[1]);
            rect.setAttribute('stroke', _this.color);
        }
        $svgGraph[0].onmousedown = function (e) {
            var downX = e.offsetX;
            var downY = e.offsetY;

            $svgGraph[0].onmousemove = function (e) {
                var curX = e.offsetX;
                var curY = e.offsetY;
                rectTo([downX, downY], [curX, curY]);
            };

            $svgGraph[0].onmouseup = function (e) {
                if (!_this.$svgBox) {
                    $('.svgBox').remove();
                    return
                }
                $svgGraph[0].onmousemove = null;
                $svgGraph[0].onmouseup = null;
                var newGraphId = new Date().getTime();
                $svgCopyBox = $('<div class="svgCopyBox" style="width:' + (Math.abs(e.offsetX - downX) + 8) + 'px;height:' + (Math.abs(e.offsetY - downY) + 8) + 'px;padding:2px;position:absolute;left:' + (downX * 100 / _this.svgW) + '%;top:' + (downY * 100 / _this.svgH) + '%;z-index:149;">' +
                       '<span class="glyphicon glyphicon-remove deleteGraph deleteGraphTem"></span></div>');
                $svgGraphCopy = $('<svg class="svgGraphCopy" id="' + newGraphId + '" viewBox="0 0 ' + Math.abs(e.offsetX - downX) + ' ' + Math.abs(e.offsetY - downY) + '" width="' + Math.abs(e.offsetX - downX) + '" height="' + Math.abs(e.offsetY - downY) + '" type="rect">' +
                        '<rect style="fill:rgba(0,0,0,0);stroke-width:4px;stroke:' + _this.color + '" orient="auto" width="' + Math.abs(e.offsetX - downX) + '" height="' + Math.abs(e.offsetY - downY) + '"/>' +
                        '</svg>');

                $svgCopyBox.append($svgGraphCopy);
                _this.$svgBox.append($svgCopyBox);
                _this.graphHover($('#' + newGraphId).parent('.svgCopyBox'));
                _this.graphDrag(newGraphId);
                _this.saveGraph(_this.getGraphData($svgGraphCopy));
                $('#graphBox').hide();
                $('.graphActive').click();
                $('.svgGraph').remove();
            }
        }
    };
    return DrawRect;
})();
var AnlzBase = (function () {
    var _this ;
    function AnlzBase(container, option, screen) {
        _this = this;
        this.container = container;
        this.options = option;
        this.screen = screen;
        this.paneChart = undefined;
        this.paneNotes = undefined;
        this.chart = undefined;
        this.noteCount = 0;
        this.chartAnimationDuration = 500;
        this.spinnerRender = new LoadingSpinner({ color: '#00FFFF' });
        this.noteDefaultWidth = 440;
        this.noteDefaultHeight = 220;

        this.dockArea = [];
        this.$paneDock = null;
        this.$dockManager = null;
        this.$dockPreviewer = null;
    }

    AnlzBase.prototype = {
        show: function () {
            this.initTools();
            this.container.innerHTML = '';
            // 初始化便签
            this.$paneNotes = $('<div style="position: relative; width: 100%; height: 100%;">');
            this.paneNotes = this.$paneNotes[0];
            // 初始化 docker
            this.$parentContainer = $(this.container).parent();
            this.$parentContainer.append($('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">').append(this.paneNotes));
            this.initDock();

            if(!this.screen.curModal.noteList){
                this.screen.curModal.noteList = [];
            }else{
                _this.initNotes();
            }

            $divBackgroundContainer = $('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">');
            if (!this.paneChart) {
                this.paneChart = $('<div style="width: 100%; height: 100%;">')[0];
                $(this.container).append($divBackgroundContainer).append(this.paneChart);
            }
            else {
                $(this.container).append($divBackgroundContainer);
            }
            _this.spinnerRender.spin(this.container.parentElement);
            //显示图形 遍历
            if (!this.screen.curModal.graphList) {
                this.screen.curModal.graphList = [];
            } else {
                var graphList = this.screen.curModal.graphList;
                var graph = undefined;
                for (var i = 0; i < graphList.length; i++) {
                    if (graphList[i].type == 'arrow') {
                        graph = new DrawArrow(_this.screen, graphList[i], this.container, '');
                    } else if (graphList[i].type == 'rect') {
                        graph = new DrawRect(_this.screen, graphList[i], this.container, '');
                    } else if (graphList[i].type == 'circle') {
                        graph = new DrawCircle(_this.screen, graphList[i], this.container, '');
                    }
                    graph.show();
                }
            }
            this.init();
        },
        renderModal: function (data) {
            _this = this;
            _this.spinnerRender.stop();
            try {
                _this.render(data);
            } catch (e) {
                console.warn(e);
            }
            setTimeout(function () {
                _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, 1,_this.chart,$('#divWSPane .selected'),_this.screen.curModal,true]);
                _this.spinnerRender.stop();
            }, _this.chartAnimationDuration);
        },
        spinnerStop: function(){
            Spinner.stop();
            _this.spinnerRender.stop();
        },
        close: function () {
            this.spinnerRender.stop();
            
            this.screen = null;
            this.options = null;

            this.$paneNotes.parent().remove();
            this.$paneNotes = null;
            this.paneNotes = null;
            $('.svgBox').remove();
            $('#graphBox').hide();
            this.resetDock();
            this.$paneDock = null;
            this.$dockManager = null;
            this.$dockPreviewer = null;
            this.container = null;
        },

        init: function () { },
        errAlert: function(err){
            var $dataAlert = $('#dataAlert');
            switch(err){
                case 'no data history':
                    new Alert($dataAlert, "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE6 + "</strong>").show().close();
                    break;
                case 'time':
                    new Alert($dataAlert, "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE7 + "</strong>").show().close();
                    break;
                case 'invalid time string':
                    new Alert($dataAlert, "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE8 + "</strong>").show().close();
                    break;
                default :
                    new Alert($dataAlert, "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE9 + "</strong>").show().close();
                    break;
            }
            //setTimeout(function () {
            //    _this.screen.refreshPaneCenter(new AnalysisTemplate(_this.screen));
            //}, 500);
        },
        initDock: function () {
            var arrHtml = [], previewerHtml = [];
            var $paneDock = $('.pane-dock', this.$parentContainer);

            if( $paneDock.length ) {
                this.$paneDock = $paneDock;
                this.$dockManager = $('.dock-manager', $paneDock);
                this.$dockPreviewer = $('.dock-previewer-manager', $paneDock);
                return;
            }
            // 添加 fill
            arrHtml.push('<div class="dock-wheel dock-wheel-fill-icon" data-type="fill"></div>');
            previewerHtml.push('<div class="dock-previewer dock-previewer-fill" data-type="fill" style="display:none;"></div>');
            // 添加 top
            arrHtml.push('<div class="dock-wheel dock-wheel-top-icon" data-type="top"></div>');
            previewerHtml.push('<div class="dock-previewer dock-previewer-top" data-type="top" style="display:none;"></div>');
            // 添加 right
            arrHtml.push('<div class="dock-wheel dock-wheel-right-icon" data-type="right"></div>');
            previewerHtml.push('<div class="dock-previewer dock-previewer-right" data-type="right" style="display:none;"></div>');
            // 添加 down
            arrHtml.push('<div class="dock-wheel dock-wheel-down-icon" data-type="bottom"></div>');
            previewerHtml.push('<div class="dock-previewer dock-previewer-down" data-type="bottom" style="display:none;"></div>');
            // 添加 left
            arrHtml.push('<div class="dock-wheel dock-wheel-left-icon" data-type="left"></div>');
            previewerHtml.push('<div class="dock-previewer dock-previewer-left" data-type="left" style="display:none;"></div>');

            this.$paneDock = $('<div class="pane-dock" style="position: absolute; left: 0; top: 0; width:100%; height:100%;">');
            this.$dockManager = $('<div class="dock-manager" style="position: absolute;left: 0; top: 0; width:100%; height:100%;">');
            this.$dockPreviewer = $('<div class="dock-previewer-manager" style="position: absolute; left:0; top:0; width:100%;height:100%;">');

            this.$dockManager[0].innerHTML = arrHtml.join('');
            this.$dockPreviewer[0].innerHTML = previewerHtml.join('');

            this.$paneDock[0].appendChild(this.$dockManager[0]);
            this.$paneDock[0].appendChild(this.$dockPreviewer[0]);
            this.$parentContainer[0].appendChild(this.$paneDock[0]);

        },
        resetDock: function () {
            // 清空 dock container
            this.$parentContainer.children('.dock-window-ctn').remove();
            this.$parentContainer.children('.dock-note-toolbar').remove();
            this.$paneDock.remove();
            // 将中间位置重新定位
            $(this.container).css({
                'top': 0,
                'left': 0,
                'bottom': 0,
                'right': 0
            });
        },
        //配置按钮
        initTools: function () {
            var _this = this;
            var $noteHideShow = $('#btnNoteHideOrShow');
            var $graphSelect = $('#graphSelsect');
            var $graphsBox = $('#graphBox');
            var $btnDownLoadExcel = $('#btnDownLoadExcel_a');
            $('.itemTools .glyphicon-log-out').off('click').on('click', function () {
                if (!_this.screen) return;
                _this.screen.refreshPaneCenter(new window.analysis.panels.AnalysisTemplate(_this.screen));
                $('.divPage.selected').removeClass('selected');
                $('.itemTools .glyphicon-cog').off('click');
                $('#rightCt').trigger('click');
            });
            $('.itemTools .glyphicon-cog').off('click').on('click', function () {
                var optionTemplate = _this.screen.factoryIoC.getModel(_this.screen.curModal.type).prototype.optionTemplate;
                var data = [];
                for (var i = 0; i < _this.screen.curModal.itemDS.length; i++) {
                    data.push({});
                    data[i].dsType = _this.screen.curModal.itemDS[i].type;
                    data[i].dsId = _this.screen.curModal.itemDS[i].arrId;
                    data[i].dsName = [];

                    var arrId = _this.screen.curModal.itemDS[i].arrId;
                    var arrItem = [];
                    arrItem = AppConfig.datasource.getDSItemById(arrId);
                    for (var j = 0; j <arrId.length; j++) {
                        var id = arrId[j];
                        for (var m = 0; m < arrItem.length; m++) {
                            if (id == arrItem[m].id) {
                                data[i].dsName.push(arrItem[m].alias);
                                break;
                            }
                        }
                        //data[i].dsName.push(AppConfig.datasource.getDSItemById(_this.screen.curModal.itemDS[i].arrId[j]).alias);
                    }
                }
                var option = {};
                option = {
                    modeUsable: optionTemplate.chartConfig,
                    allDataNeed: (optionTemplate.templateParams.paraAnlysMode == 'all'),
                    rowDataType: optionTemplate.templateParams.paraName,
                    dataTypeMaxNum: optionTemplate.templateParams.dataTypeMaxNum,
                    templateType: _this.screen.curModal.type,
                    dsChartCog: _this.screen.curModal.dsChartCog,
                    optionPara: {
                        mode: _this.screen.curModal.mode,
                        startTime: _this.screen.curModal.startTime,
                        endTime: _this.screen.curModal.endTime,
                        interval: _this.screen.curModal.format,
                        dataItem: data
                    }
                };
                _this.screen.modalConfig.showModalInit(false, option)
            });

            $('.itemTools .glyphicon-edit').off('click').click(function () {
                _this.createNote();
                $noteHideShow.removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
                $('.divNote').show();
            });
            //导出excel按钮
            $('#btnDownLoadExcel_a').off('click').click(function () {
                var xAxisList = _this.options.xAxisData; 
                var itemDSList = _this.options.itemDS;
                var str = '坐标轴';
                var dataListArr = [];
                //if (xAxisList&&xAxisList.length !== 0) {
                //    str ='坐标轴,' + xAxisList.join(',');
                //}
                var dictDataList = _this.options.dataList ? _this.options.dataList : {};
                if (dictDataList) {
                    for (var item in dictDataList) {
                        var itemL = dictDataList[item];
                        if (itemL.length > 1 && Object.prototype.toString.call(itemL[0]) === '[object Array]') {
                            for (var m = 0, lens = itemL.length; m < lens;m++ ){
                                dataListArr.push(itemL[m]);
                            }
                        } else {
                            dataListArr.push(itemL);
                        }
                        str += ','+item;
                    }
                    if (xAxisList && xAxisList.length !== 0) {
                        for (var i = 0, len = xAxisList.length; i < len; i++) {
                            str += '\n' + xAxisList[i];
                            for (var j = 0, lens = dataListArr.length; j < lens; j++) {
                                str += ',' + dataListArr[j][i];
                            }
                        }
                    } else {
                        //饼图，实时点只有一个
                        for (var n = 0; n < 1; n++) {
                            str += '\n';
                            for (var p = 0, length = dataListArr.length; p < length; p++) {
                                str += ',' + dataListArr[p][n];
                            }
                        }
                        //for (var n = 0, lenss = dataListArr.length; n < lenss; n++) {
                        //    str += '\n';
                        //    var dataListItem = dataListArr[n];
                        //    if (Object.prototype.toString.call(dataListItem) !== '[object Array]') {
                        //        str += ',' + dataListItem;
                        //    } else {
                        //        for (var p = 0, length = dataListItem.length; p < length; p++) {
                        //            str += ',' + dataListArr[n][p];
                        //        }
                        //    }
                        //}
                    }
                } else {
                    str = '无数据';
                    //if (itemDSList && itemDSList.length > 0) {
                    //    for(var i = 0,len = itemDSList.length;i<len;i++){
                    //        var itemDsItem = itemDSList[i];
                    //        for(var j=0,lenth =itemDsItem.arrId.length;j<lenth;j++ ){
                    //            var arrIdItem = itemDsItem.arrId[j];
                    //            str += '\n' + arrIdItem;
                    //            if (xAxisList && xAxisList.length !== 0) {
                    //                for (var z = 0, lens = xAxisList.length; z < lens; z++) {
                    //                    str += ',--';
                    //                }
                    //            } else {
                    //                str += ',--';
                    //            }
                                
                    //        }
                    //    }
                    //}
                }
                //var str = "栏位1,栏位2,栏位3\n值1,值2,值3";
                //var str ='a1,a2\na3,a4';
                //str =  encodeURIComponent(str);   
                //aLink.href = "data:text/csv;charset=utf-8,\ufeff"+str;//decodeURIComponent

                $(this).attr('download', _this.screen.path[_this.screen.path.length - 1].title+'.csv');
                str = "\ufeff" + str;
                var blob = new Blob([str], { type: 'text/csv;charset=utf-8' });
                var csvUrl = URL.createObjectURL(blob);
                document.getElementById("btnDownLoadExcel_a").href = csvUrl;
            });
            //眼睛按钮
            $noteHideShow.removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
            $noteHideShow.off('click').click(function () {
                if ($noteHideShow.hasClass('glyphicon-eye-close')) {
                    $noteHideShow.removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
                    $('.divNote').show();
                } else if ($noteHideShow.hasClass('glyphicon-eye-open')) {
                    $noteHideShow.removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
                    $('.divNote').hide();
                }
            });
            //图形选择按钮
            //$graphsBox = $('<div style="position:absolute;right:51px;width:90px;border:1px solid #777;padding:5px 10px;top:40px;display:none;z-index:20;background:#fff;" id="graphBox">' +
            //              '<i class="icon-arrow-right" style="font-size:18px;color:#B6B4B4;margin-right:15px;display:inline-block!important;"></i>' +
            //              '<i class="icon-check-empty" style="margin-right:10px;font-size:18px;"></i>' +
            //              '<i class="icon-circle-blank" style="font-size:18px;"></i>' +
            //              +'</div>');
            //$('#anlsPaneContain .panel-heading').addClass('dropdown');
            //$graphSelect.attr({ 'data-toggle': 'dropdown', 'aria-haspopup': 'true', 'aria-expanded': 'false' });
            if ($graphsBox.length===0) { 
                $graphsBox = $('<ul id="graphBox" style="top:36px;left:auto;right:18px;width:118px;float:right;padding:5px 10px;position:absolute;z-index:150;border:1px solid #DDDDDE;border-radius:5px;background:#fff;display:none;">' +// class="dropdown-menu" aria-labelledby="dropdownSel"
                               '<li style="width:98px;margin:0 auto;list-style:none;" class="graphSel"><span class="glyphicon glyphicon-arrow-right firstSpan" value="arrow" style="font-size:18px;color:#B6B4B4;margin-right:15px;display:inline-block!important;" id="arrowActive"></span>' +
                               '<span class="icon-check-empty" id="rectActive" value="rect" style="width:16px;height:16px;border:2px solid #B6B4B4;margin-right:15px;display:inline-block!important;"></span>' +
                               '<span class="icon-circle-blank" id="circleActive" value="circle" style="width:18px;height:18px;border:2px solid #B6B4B4;border-radius:9px;display:inline-block!important;"></span></li>' +
                               '<li class="colorTotal" style="width:98px;margin:10px auto 0px;list-style:none;display:none;"><div style="width:24px;height:24px;border:1px solid #BDBEBF;float:left;margin-right:10px;">' +
                               '<span class="colorSelect" style="display:block;width:20px;height:20px;margin:1px;background:red;"></span></div>' +
                               '<div class="colorList" style="float:left;width:60px;margin-top:-5px;">' +
                               '<span style="display:inline-block;width:11px;height:11px;background:#000;margin-right:3px;line-height:11px;font-size:11px;"></span>' +
                               '<span style="display:inline-block;width:11px;height:11px;background:#7ab900;margin-right:3px;line-height:11px;font-size:11px;"></span>' +
                               '<span style="display:inline-block;width:11px;height:11px;line-height:11px;background:#007acc;margin-right:3px;font-size:11px;"></span>' +
                               '<span style="display:inline-block;width:11px;height:11px;line-height:11px;background:#ecede5;margin-right:3px;font-size:11px;"></span>' +
                               '<span style="display:inline-block;width:11px;height:11px;line-height:11px;background:#ff2525;margin-right:3px;font-size:11px;"></span>' +
                               '<span style="display:inline-block;width:11px;height:11px;line-height:11px;background:#fcd209;margin-right:3px;font-size:11px;"></span>' +
                               '<span style="display:inline-block;width:11px;height:11px;line-height:11px;background:#ff5500;margin-right:3px;font-size:11px;"></span>' +
                               '<span style="display:inline-block;width:11px;height:11px;line-height:11px;background:#a6b16c;font-size:11px;"></span></div>' +
                               '<br style="clear:both;"></li>' +
                               '</ul>');
                $('#anlsPaneContain').append($graphsBox);
            }
            $('#anlsPaneContain').css('position','relative');
            $('#graphSelsect').off('click').click(function () {
                if ($graphsBox.is(':hidden')) {//visible
                    $graphsBox.show();
                } else {
                    $graphsBox.hide();
                }
            });
            $('#btnDataFilter').off('click').click(function () {
                new DataCalcFilterContain(_this).show();
            });
            $('#anlsPaneContain .colorList span').hover(function () {
                $(this).css({ 'border-width': '1px', 'border-style': 'solid', 'border-color': '#ddddde','border-radius':'5px' });
            }, function () {
                $(this).css({ 'border': 'none', 'border-radius': '0px' });
            });
            $('#anlsPaneContain .colorList span').off('click').click(function () {
                var graphType = $('.graphActive').attr('value');
                $('#anlsPaneContain .colorSelect').css('background-color', $(this).css('background-color'));
                var color = $('#anlsPaneContain .colorSelect').css('background-color');
                $('.svgGraph').remove();
                drawGraph(graphType,color);
            });
            //几何图形点击事件
            $('#anlsPaneContain .graphSel span').off('click').click(function () {
                var color = $('#anlsPaneContain .colorSelect').css('background-color');
                var $graphSel = $(this);
               var graphType = $graphSel.attr('value');
               if (!$graphSel.hasClass('graphActive')) {
                   if ($graphSel.hasClass('firstSpan')) {
                       $graphSel.css('color', '#000');
                   } else {
                       $graphSel.css('border', '2px solid #000');
                   }
                    $graphSel.siblings().css('color', '#B6B4B4');
                    $graphSel.siblings().removeClass('graphActive');
                    $graphSel.addClass('graphActive');
               } else {
                   if ($graphSel.hasClass('firstSpan')) {
                       $graphSel.css('color', '#B6B4B4');
                   } else {
                       $graphSel.css('border', '2px solid #B6B4B4');
                   }
                   $graphSel.removeClass('graphActive');
                }

                if ($('#anlsPaneContain .graphSel span').hasClass('graphActive')) {
                    $('#anlsPaneContain .colorTotal').show();
                } else {
                    $('#anlsPaneContain .colorTotal').hide();
                }
                drawGraph(graphType, color);
                //解决$svgBox不存在时的bug
                //if (!_this.$svgBox) {
                //    _this.$svgBox = $('<div class="svgBox" style="width:100%;height:100%;position:absolute;top:0;left:0;"></div>');
                //    $('#anlsPaneContain .panel-body').append(_this.$svgBox);
                //} else {
                //    if (_this.$svgBox.length === 0) {
                //        _this.$svgBox = $('<div class="svgBox" style="width:100%;height:100%;position:absolute;top:0;left:0;"></div>');
                //        $('#anlsPaneContain .panel-body').append(_this.$svgBox);
                //    }
                //}
                //_this.createGraphs(_this.graphType, _this.color);
            });
            function drawGraph(graphType,color){
                var drawGraph = undefined;
                if (graphType == 'arrow') {
                    drawGraph = new DrawArrow(_this.screen, {}, _this.container, color);
                } else if (graphType == 'rect') {
                    drawGraph = new DrawRect(_this.screen, {}, _this.container, color);
                } else if (graphType == 'circle') {
                    drawGraph = new DrawCircle(_this.screen, {}, _this.container, color);
                }
                drawGraph.drawing();
            }
        },
        createNote: function (note) {
            var origZIndex;
            var notePos = getDivNotePos();
            var dockTriggerIndex = null;
            var $divNote = $('<div class="divNote">')
                .click(function(){
                    if($('.divNote').length > 1){
                        _this.curtNote = $divNote[0];
                        if(this.style.zIndex < _this.getNoteMaxZIndex()){
                            this.style.zIndex = _this.getNoteMaxZIndex() + 1;
                            origZIndex = this.style.zIndex;
                        }
                    }
                })
                .hover(function(e){
                    if(this.style.zIndex < _this.getNoteMaxZIndex()){
                        origZIndex = getComputedStyle(this).zIndex;
                        this.style.zIndex = _this.getNoteMaxZIndex() + 1;
                    }
                })
                .attr('id', note ? note.id : (new Date()).valueOf())
                .css({
                    zIndex: _this.getNoteMaxZIndex() + 1,
                    left: note ? note.x : 'auto',
                    right: note ? 'auto' : notePos.x + 'px',
                    top: note ? note.y : notePos.y,
                    width: note ? note.width : this.noteDefaultWidth + 'px',
                    height: note ? note.height : this.noteDefaultHeight + 'px',
                    backgroundColor: note ? note.bgColor : ''
                })
                .mousedown(_this.doDown)
                .mouseup(_this.doUp);

            var $divTitle = $('<div class="title">').appendTo($divNote);

            $divTitle[0].draggable = true;

            setDrag($divTitle[0]);
            var disX = 0;
            var disY = 0;
            function setDrag(obj){
                obj.onmouseover = function(){
                    obj.style.cursor = "move";
                }
                obj.onmousedown = function(event){
                    var realDragObj = obj.parentNode
                    var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
                    var scrollLeft = document.documentElement.scrollLeft||document.body.scrollLeft;
                    //当鼠标按下时计算鼠标与拖拽对象的距离
                    disX = event.clientX +scrollLeft-realDragObj.offsetLeft;
                    disY = event.clientY +scrollTop-realDragObj.offsetTop;

                    // 显示停靠按钮
                    _this.showDockWheel();

                    document.onmousemove=function(event){
                        var ol = event.clientX + scrollLeft;
                        var ot = event.clientY + scrollTop;
                        //当鼠标拖动时计算div的位置
                        var l = ol - disX;
                        var t = ot - disY;
                        realDragObj.style.left = l + "px";
                        realDragObj.style.top = t + "px";
                        //禁止超出pane
                        var isTop = realDragObj.offsetTop < 0
                        var isLeft = realDragObj.offsetLeft < 0;
                        var isRight = realDragObj.offsetParent.offsetWidth - realDragObj.offsetLeft < realDragObj.offsetWidth;
                        var isBottom = realDragObj.offsetParent.offsetHeight - realDragObj.offsetTop < realDragObj.offsetHeight;

                        if(isTop){
                            realDragObj.style.top = '0px';
                        }
                        if(isLeft){
                            realDragObj.style.left = '0px';
                        }
                        if(isRight){
                            realDragObj.style.left = realDragObj.parentNode.offsetWidth - realDragObj.offsetWidth + 'px';
                        }
                        if(isBottom){
                            realDragObj.style.top = realDragObj.parentNode.offsetHeight - realDragObj.offsetHeight + 'px';
                        }

                        var area;
                        // 如果此时鼠标是存在于某个 dockWheel 中的，
                        // 则只检测鼠标是否离开了这个 dockWheel，提高性能
                        if(dockTriggerIndex !== null) {
                            area = _this.dockArea[dockTriggerIndex];
                            if( ol > area.left && ol < area.right
                                && ot > area.top && ot < area.bottom ) {
                            } else {
                                dockTriggerIndex = null;
                                area.$ele.removeClass('on');
                                _this.hideDockPreviewer();
                            }
                            return;
                        }

                        // 判断是否触及 dock 区域
                        for (var i = 0, len = _this.dockArea.length; i < len; i++) {
                            area = _this.dockArea[i];
                            if( ol > area.left && ol < area.right
                                && ot > area.top && ot < area.bottom ) {
                                dockTriggerIndex = i;
                                area.$ele.addClass('on');
                                _this.showDockPreviewer(area.$ele[0].dataset.type);
                                return;
                            }
                        }

                    }
                    document.onmouseup = function(){
                        var area = _this.dockArea[dockTriggerIndex];
                        document.onmousemove = null;
                        document.onmouseup = null;
                        //保存移动后位置
                        var note = {
                            id: realDragObj.id,
                            x: ((realDragObj.offsetLeft/realDragObj.offsetParent.offsetWidth)*100).toFixed(2) + '%',
                            y: ((realDragObj.offsetTop/realDragObj.offsetParent.offsetHeight)*100).toFixed(2) + '%'
                        };
                        // 隐藏 dock
                        _this.hideDockPreviewer();
                        _this.hideDockWheel();
                        
                        if(dockTriggerIndex !== null) {
                            // save layout
                            _this.saveDockNoteLayout(note.id, area.$ele[0].dataset.type);
                            note.x = '10%';
                            note.y = '10%';
                            _this.saveDockLayout();
                            return false;
                        }
                        
                        _this.saveNote(note);
                    }
                    return false;
                }
            }

            var $divPin = $('<div class="glyphicon pinIcon grow">').appendTo($divTitle);
            $divPin.mousedown(function(e){
                _this.removeNote(this);
                e.stopPropagation();
            });

            var $divText = $('<div class="divText gray-scrollbar">').appendTo($divNote);

            if(_this.isShareMode !== 1){
                +function () {
                    var timer = null;
                    $divText.off('click').click(function () {
                        if(timer !== null) {
                            return;
                        }
                        timer = window.setTimeout(function () {
                            timer = null;
                        }, 500);
                        showEditor();
                    });
                }.call(this);

                function showEditor(e) {
                    var $modalConfig;
                    WebAPI.get('/static/views/observer/widgets/modalUEditor.html').done(function(resultHTML){
                        $('.divNote').hide();
                        $('.dock-layout').hide();
                        $('.svgBox').hide();
                        $(_this.container).append(resultHTML);
                        $modalConfig = $('#modalUEditor');
                        $modalConfig.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                            $('.divNote').show();
                            $('.dock-layout').show();
                            $('#modalUEditorContainer').remove();
                            $('#edui_fixedlayer').remove();
                            $('#anlsPane').css({overflowX: 'hidden', overflowY: 'auto'})
                            $('.svgBox').show();
                        });
                        $modalConfig.off('show.bs.modal').on('show.bs.modal', function () {
                            $('#anlsPane').css({overflow: 'visible'})
                            UE.delEditor('ueditor');
                            UE.getEditor('ueditor',{lang: (I18n.type == 'zh' ? 'zh-cn': 'en')}).ready(function(){
                                UE.insertPic(this);//绑定插入图片事件
                                //设置内容
                                $(document.querySelector('iframe')).addClass('gray-scrollbar')
                                var bodyEditor = document.querySelector('iframe').contentWindow.document.querySelector('body');
                                note && note.bgColor && (bodyEditor.style.backgroundColor = note.bgColor);
                                bodyEditor.innerHTML = note ? note.text : '';
                            });
                        });
                        $modalConfig.off('shown.bs.modal').on('shown.bs.modal', function () {

                        });
                        $modalConfig.modal('show');

                        $(_this.container).find('#saveNote').off('click').on('click',function(){
                            var body = $('iframe', '.edui-editor-iframeholder')[0].contentWindow.document.querySelector('body');
                            var content = body.innerHTML;
                            var newNote = {
                                id: $divNote[0].id
                            };
                            if(note){
                                newNote.text = content;
                                newNote.bgColor = body.style.backgroundColor;
                            }else{//新创建note
                                newNote.text = content;
                                newNote.bgColor = body.style.backgroundColor;
                                newNote.height = _this.noteDefaultHeight + 'px';
                                newNote.width = _this.noteDefaultWidth + 'px';
                                $divNote[0].style.right = '';
                                $divNote[0].style.left = ($divNote.parent().width() - _this.noteDefaultWidth) + 'px';
                            }
                            _this.saveNote(newNote);
                            $divText.html(content);
                            $divNote.css({backgroundColor: newNote.bgColor})
                            $modalConfig.modal('hide');
                            if(note){
                                note.text = content;
                                note.bgColor = newNote.bgColor;
                            }else{
                                note = newNote;
                            }
                        })
                    });
                }
            }
            $divText.html(note ? note.text : '');
            note && note.bgColor && $divNote.css({backgroundColor: note.bgColor });
            $(this.paneNotes).append($divNote);


            $(document).on('click','#st-container',_this.doClick);
            $(document).on('mousemove','#st-container',_this.doMove);

            function getDivNotePos(){
                var pos = {}
                var $lastNote = $('.divNote:nth-last-child(1)');

                if($lastNote[0]){
                    if($lastNote[0].offsetLeft < 100){
                        pos.x = 0;
                        pos.y = $lastNote[0].offsetTop + $lastNote[0].offsetHeight + 20;
                        _this.noteCount = 0;
                    }else{
                        ++_this.noteCount;
                        pos.x = _this.noteCount * 130;
                        pos.y = $lastNote[0].offsetTop;
                    }
                }else{
                    pos.x = 0;
                    pos.y = 0;
                }
                return pos;
            }
        },

        removeNote: function (obj) {
            //TODO 测试confirm
            confirm(i18n_resource.analysis.workspace.CONFIRM_NOTE_DELETE, function () {
                var $divNote = $(obj).closest('.divNote');
                $divNote.remove();
                var index = _this.getNoteListIndex($divNote.attr('id'));
                if (index != undefined) {
                    _this.screen.curModal.noteList.splice(index, 1);
                    _this.screen.saveModal();
                    _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, 1, _this.chart, $('#divWSPane .selected'), _this.screen.curModal, true]);
                }
            });
        },

        initNotes: function () {
            var _this = this;
            var notes = this.screen.curModal.noteList;
            var layout = this.screen.curModal.layout || {};
            if(!notes.length) return;

            notes.forEach(function (row) {
                var dockPosition = null;
                for (var t in layout) {
                    if ( !layout.hasOwnProperty(t) ) {
                        continue;
                    }
                    if(!layout[t] || !layout[t].length) {
                        continue;
                    }
                    if( layout[t].indexOf(row.id) > -1 ) {
                        dockPosition = t;
                        break;
                    }
                }
                if(!!dockPosition) {
                    _this.createDockNote(row, dockPosition);
                } else {
                    _this.createNote(row);
                }
            });
            _this.layoutDockNotes();
        },
        //initGraphs:function(graphs){
        //    var graphs = this.screen.curModal.graphList;
        //    if (!graphs.length) return;
        //},
        hideNotes: function () {
        },

        showNotes: function () {
        },

        getNoteMaxZIndex: function(){
            var divNoteList = $('.divNote');
            var maxZIndex = 102;
            for(var i = 0; i < divNoteList.length; i++){
                var zIndex = parseInt(getComputedStyle(divNoteList[i]).zIndex);
                if(zIndex > maxZIndex){
                    maxZIndex = zIndex;
                }
            }
            return maxZIndex;
        },

        getNoteListIndex: function(id){
            for(var i = 0; i < _this.screen.curModal.noteList.length; i++){
                if(_this.screen.curModal.noteList[i].id == id){
                    return i;
                }
            }
        },

        showDockWheel: function() {
            var _this = this;
            var $dockFill = this.$dockManager.children('.dock-wheel-fill-icon');
            var $dockTop = this.$dockManager.children('.dock-wheel-top-icon');
            var $dockRight = this.$dockManager.children('.dock-wheel-right-icon');
            var $dockDown = this.$dockManager.children('.dock-wheel-down-icon');
            var $dockLeft = this.$dockManager.children('.dock-wheel-left-icon');
            var offset;

            this.$parentContainer.addClass('on');
            // 初始化命中区域
            [$dockFill, $dockTop, $dockRight, $dockDown, $dockLeft].forEach(function ($dock, i) {
                offset = $dock.offset();
                _this.dockArea.push({
                    'left': offset.left,
                    'top': offset.top,
                    'right': offset.left + $dock.width(),
                    'bottom': offset.top + $dock.height(),
                    '$ele': $dock
                });
            });
        },

        hideDockWheel: function () {
            this.$parentContainer.removeClass('on');
            this.$dockManager.children().removeClass('on');
        },

        showDockPreviewer: function (type) {
            this.$dockPreviewer.show();
            this.$dockPreviewer.children('[data-type="'+type+'"]').show();
        },

        hideDockPreviewer: function () {
            this.$dockPreviewer.children().hide();
            this.$dockPreviewer.hide();
        },

        // 将笔记标签定位到页面 layout 中
        saveDockNoteLayout: function (noteId, direction) {
            var layout = this.screen.curModal.layout;
            var notes = this.screen.curModal.noteList;
            var note;
            // 错误情况处理
            if( ['top', 'right', 'bottom', 'left'].indexOf(direction) === -1 ) return;
            if(!layout) {
                layout = this.screen.curModal.layout = {};
            }

            layout[direction] = layout[direction] || [];
            if( layout[direction].indexOf(noteId) > -1 ) return;
            layout[direction].push(noteId);

            $('#'+noteId).remove();

            // 找到这个 note
            note = notes.filter(function (row, i) {
                return row.id === noteId;
            });

            if(note && note.length) {
                this.createDockNote(note[0], direction);
                this.layoutDockNotes();

                _this.screen.saveModal();
                _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, 1, _this.chart,$('#divWSPane .selected'), _this.screen.curModal, false]);
            }
        },

        initDockToolbar: function () {
            /*var $toolbar = this.$parentContainer.children('.dock-note-toolbar');
            if($toolbar.length) return;

            this.$parentContainer.append('<div class="dock-note-toolbar">' +
                '<div class="dock-note-toolbar-title"></div>' +
                getWysiwyg(false) + 
                '</div>');
            $toolbar = this.$parentContainer.children('.dock-note-toolbar');
            var $title = $toolbar.children('.dock-note-toolbar-title');

            // 鼠标移动事件
            (function () {
                var _this = this;
                var downX, downY, downLeft, downTop;
                var childPos, parentPos = this.$parentContainer.offset();
                var maxLeft, maxTop;

                $title.mousedown(function (e) {
                    var width = $toolbar.outerWidth();
                    var height = $toolbar.outerHeight();
                    var parentWidth = _this.$parentContainer.width();
                    var parentHeight = _this.$parentContainer.height();

                    // 这里没有考虑 scroll width/height，因为父容器有 overflow-x: hidden
                    maxLeft = parentWidth - width;
                    maxTop = parentHeight - height;

                    downX = e.pageX;
                    downY = e.pageY;
                    childPos = $toolbar.position();

                    $(document).mousemove(function (e) {
                        var offsetX = e.pageX - downX;
                        var offsetY = e.pageY - downY;
                        var newLeft = Math.max(0, Math.min(maxLeft, childPos.left+offsetX) );
                        var newTop = Math.max(0, Math.min(maxTop, childPos.top+offsetY) );

                        $toolbar.css('left', newLeft);
                        $toolbar.css('top', newTop);
                        e.preventDefault();
                    });
                    $(document).mouseup(function (e) {
                        $(document).off('mousemove');
                        $(document).off('mouseup');
                        e.preventDefault();
                    });
                });
            }).call(this);*/
        },

        createDockNote: function (note, direction) {
            var _this = this;
            var $ctn = this.$parentContainer.children('.dock-window-ctn');
            var $divNote = $('<div class="dock-note" style="background-color: '+ note.bgColor +'">'+
                '<div class="dock-note-resizer" data-direction="'+direction+'"></div>'+
                '<button type="button" class="close editor"><span aria-hidden="true">' + I18n.resource.analysis.workspace.EDIT_NOTE + '</span></button>'+
                '<button type="button" class="close cancel"><span aria-hidden="true">'+ I18n.resource.analysis.workspace.CANCEL_FIX +'</span></button>'+
                '<div class="dock-note-ct gray-scrollbar" data-id="'+note.id+'"></div>'+
                '<button id="saveDockNote" type="button" class="" style="display:none;position:absolute;bottom:5px;right:5px;z-index: 9999;color: #333;border-radius: 4px;box-shadow: 0px 3px 8px 2px #ccc;border: 1px solid #ccc;">Save</button>'+
                '</div>');
            var $divNoteCt = $divNote.children('.dock-note-ct');
            var $noteResizer = $divNote.children('.dock-note-resizer');
            var $layoutCtn, $layoutCtnWrap;
            // 包裹 layoutCtn 的容器，因为 top/bottom 和 left/right 的存放容器不一样
            var $layoutContainer;

            if($ctn.length === 0) {
                $ctn = $('<div class="dock-window-ctn">');
                this.$parentContainer.append($ctn[0]);
            }

            if( ['top', 'bottom'].indexOf(direction) > -1 ) {
                $layoutContainer = $ctn;
                $divNoteCt.height(note.height);
            }
            if( ['left', 'right'].indexOf(direction) > -1 ) {
                $layoutCtnWrap = $ctn.children('.dock-layout-wrap');
                if($layoutCtnWrap.length === 0) {
                    $layoutCtnWrap = $('<div class="dock-layout-wrap">');
                    $ctn.append($layoutCtnWrap);
                }
                $layoutContainer = $layoutCtnWrap;
                $divNoteCt.width(note.width);
            }

            $layoutCtn = $layoutContainer.children('.dock-layout-'+direction);
            if($layoutCtn.length === 0) {
                $layoutCtn = $('<div class="dock-layout dock-layout-'+direction+'" data-direction="'+direction+'">');
                $layoutContainer.append($layoutCtn);
            }
            
            $divNoteCt.html(note.text);
            $layoutCtn.append($divNote);

            // 事件
            $divNote.children('.cancel').off().click(function () {
                var $this = $(this);
                var $curNote = $this.closest('.dock-note');
                var $curNoteCt = $curNote.children('.dock-note-ct');
                var id = $curNoteCt[0].dataset.id;
                var index = _this.getNoteListIndex(id);
                var note = _this.screen.curModal.noteList[index];
                var arr = _this.screen.curModal.layout[direction];

                for (var i = 0, len = arr.length; i < len; i++) {
                    if(arr[i] === id) {
                        arr.splice(i ,1);
                        break;
                    }
                }

                _this.createNote({
                    id: id,
                    text: $curNoteCt.html(),
                    x: note.x,
                    y: note.y,
                    width: note.width,
                    height: note.height,
                    bgColor: note.bgColor
                });
                $curNote.remove();

                _this.layoutDockNotes('top');
                _this.saveDockLayout();
            });

            $divNote.children('.editor').off().click(function (e) {
                //进入编辑模式前,其他处于编辑模式的便签先保存
                $(document).click();
                var realHeight = getComputedStyle($divNoteCt[0]).height;
                var height = realHeight < '100px' ? '100px' : realHeight;
                var width = getComputedStyle($divNoteCt[0]).width;
                var $saveDockNote = $('#saveDockNote');
                $divNoteCt.hide();
                $('.divNote').hide();
                $('.svgBox').hide();
                $divNote.append('<div style="width: '+ width +';height: '+ height +';"><script id="ueditor" type="text/plain" style="height:calc(100% - 20px);"></script></div>');
                UE.delEditor('ueditor');
                UE.getEditor('ueditor',{lang: (I18n.type == 'zh' ? 'zh-cn': 'en')}).ready(function(){
                    UE.insertPic(this);//绑定插入图片事件

                    $saveDockNote.show();
                    //设置内容
                    var iframe = document.querySelector('iframe');
                    var iframeHtml = iframe.contentWindow.document.querySelector('html');
                    var bodyEditor = iframe.contentWindow.document.querySelector('body');
                    $(iframe).addClass('gray-scrollbar');
                    $(iframeHtml).css({overflowX: 'hidden'});
                    note && note.bgColor && (bodyEditor.style.backgroundColor = note.bgColor);
                    $('.edui-editor-iframeholder').css({height: parseInt(height.split('px')[0]) - $('.edui-editor-toolbarbox').height()});
                    bodyEditor.innerHTML = note ? note.text : '';

                    $saveDockNote.off('click').on('click',function(){
                        Spinner.spin($('.dock-layout')[0]);
                        $divNoteCt[0].innerHTML = bodyEditor.innerHTML;
                        var newNote = {
                            id: $divNoteCt.attr('data-id'),
                            text: $divNoteCt[0].innerHTML,
                            bgColor: bodyEditor.style.backgroundColor
                        }
                        _this.saveNote(newNote);
                        //更新当前note
                        note.text = $divNoteCt[0].innerHTML;
                        note.bgColor = bodyEditor.style.backgroundColor;
                        $(this).hide();

                        var timer = setTimeout(function(){
                            UE.delEditor('ueditor');
                            $('#ueditor').parent().remove();
                            $divNoteCt.show();
                            $('.divNote').show();
                            $('.svgBox').show();
                            clearTimeout(timer);
                            Spinner.stop();
                        }, 500);
                    });
                });
            });
            // resizer
            $noteResizer.off('mousedown').mousedown( function (e) {
                //退出编辑模式
                $(document).click();
                var $resizer = $(this);
                var $note = $resizer.closest('.dock-note');
                var $noteCt = $note.children('.dock-note-ct');
                var $wrap = _this.$parentContainer.find('.dock-layout-wrap');
                var $container = $(_this.container);
                var direction = $resizer[0].dataset.direction;
                var downX, downY;
                var downWidth = $noteCt.width();
                var downHeight = $noteCt.height();
                var ctnPos = {
                    left: parseFloat( $container.css('left') ) || 0,
                    right: parseFloat( $container.css('right') ) || 0,
                    top: parseFloat( $container.css('top') ) || 0,
                    bottom: parseFloat( $container.css('bottom') ) || 0
                }

                downX = e.pageX;
                downY = e.pageY;

                $(document).mousemove(function (e) {
                    var moveX = e.pageX;
                    var moveY = e.pageY;
                    var delta;

                    if( direction === 'left') {
                        delta = moveX - downX;
                        $noteCt.width(downWidth + delta);
                    } else if( direction === 'right') {
                        delta = downX - moveX;
                        $noteCt.width(downWidth + delta);
                    } else if( direction === 'top' ) {
                        delta = moveY - downY;
                        $noteCt.height(downHeight + delta);
                        $wrap.css('top', ctnPos.top + delta);
                    } else if( direction === 'bottom' ) {
                        delta = downY - moveY;
                        $noteCt.height(downHeight + delta);
                        $wrap.css('bottom', ctnPos.bottom + delta);
                    }
                });
                $(document).mouseup(function (e) {
                    var $this = $(this);
                    var id = $noteCt[0].dataset.id;
                    var params = {id: id};
                    var moveX = e.pageX;
                    var moveY = e.pageY;
                    var delta;
                    
                    if( direction === 'left') {
                        delta = moveX - downX;
                        $noteCt.width(downWidth + delta);
                        $container.css('left', ctnPos.left + delta);
                    } else if( direction === 'right') {
                        delta = downX - moveX;
                        $noteCt.width(downWidth + delta);
                        $container.css('right', ctnPos.right + delta);
                    } else if( direction === 'top' ) {
                        delta = moveY - downY;
                        $noteCt.height(downHeight + delta);
                        $wrap.css('top', ctnPos.top + delta);
                        $container.css('top', ctnPos.top + delta);
                    } else if( direction === 'bottom' ) {
                        delta = downY - moveY;
                        $noteCt.height(downHeight + delta);
                        $wrap.css('bottom', ctnPos.bottom + delta);
                        $container.css('bottom', ctnPos.bottom + delta);
                    }

                    if(direction === 'left' || direction === 'right') {
                        params['width'] = $note.width();
                    } else {
                        params['height'] = $note.height();
                    }

                    _this.saveNote(params);
                    _this.screen.onresize();

                    $this.off('mousemove');
                    $this.off('mouseup');
                });

                e.stopPropagation();
            } );
        },

        layoutDockNotes: function () {
            var _this = this;
            var $ctn = this.$parentContainer.children('.dock-window-ctn');
            var $layoutCtnWrap = $ctn.children('.dock-layout-wrap');
            var $container = $(this.container);
            $ctn.find('.dock-layout').each(function (i, dom) {
                var $this = $(this);
                var direction = $this[0].dataset.direction;
                var $notes = $this.children('.dock-note');
                var sum = 0;
                // 说明这一条边已经没有 note 了
                // 删除容器
                if($notes.length === 0) {
                    $this.remove();
                }

                // 针对 左右/上下 固定方式进行不同的处理
                if( ['left', 'right'].indexOf(direction) > -1 ) {
                    $notes.each(function (i, dom) {
                        var $this = $(this);
                        var width = $this.outerWidth();
                        sum += width;
                    });
                }
                if( ['top', 'bottom'].indexOf(direction) > -1 ) {
                    $notes.each(function (i, dom) {
                        var $this = $(this);
                        var height = $this.outerHeight();
                        sum += height;
                    });
                    // 如果高度改变了，则左右容器的 wrap 层做相应调整
                    $layoutCtnWrap.css( direction, sum );
                }

                $container.css( direction, sum );
            });

            _this.screen.onresize();
        },

        saveDockLayout: function () {
            _this.screen.saveModal();
            _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, 1,_this.chart,$('#divWSPane .selected'),_this.screen.curModal,true]);
        },

        //resize
        resizeObject: function() {
            this.el = null;
            this.dir = "";      //type of current resize (n, s, e, w, ne, nw, se, sw)
            this.grabx = null;
            this.graby = null;
            this.width = null;
            this.height = null;
            this.left = null;
            this.top = null;
        },

        getDirection:function(el) {
             var xPos, yPos, offset, dir;
             dir = "";

             xPos = window.event.offsetX;
             yPos = window.event.offsetY;

             offset = 8;
             if (yPos<offset) dir += "n";
             else if (yPos > el.offsetHeight-offset) dir += "s";
             if (xPos<offset) dir += "w";
             else if (xPos > el.offsetWidth-offset) dir += "e";

             return dir;
        },

        doDown:function() {
            if(this.style.cursor.indexOf('-resize') > -1){
                $('.divTextEditor').blur();
                var el = _this.getReal(event.srcElement, "className", "divNote");
                 if (el == null) {
                     _this.theobject = null;
                     return;
                 }

                if(el.className && el.className.indexOf('divNote') < 0) return;

                _this.dir = _this.getDirection(el);
                 if (_this.dir == "") return;

                 _this.leftObject = new _this.resizeObject();

                 _this.leftObject.el = el;
                 _this.leftObject.dir = _this.dir;

                 _this.leftObject.grabx = window.event.clientX;
                 _this.leftObject.graby = window.event.clientY;
                 _this.leftObject.width = el.offsetWidth;
                 _this.leftObject.height = el.offsetHeight;
                 _this.leftObject.left = el.offsetLeft;
                 _this.leftObject.top = el.offsetTop;

                 window.event.returnValue = false;
                 window.event.cancelBubble = true;
            }
        },

        doUp:function(e) {
            if(e.target.classList.contains('pinIcon')) return;
            if (_this.leftObject != null) {
                var note = {
                    id: _this.leftObject.el.id,
                    width: _this.leftObject.el.style.width,
                    height: _this.leftObject.el.style.height
                }
                _this.saveNote(note);
                _this.leftObject = null;
            }
        },

        doMove:function(e) {
            var el, str, xMin, yMin;
            xMin = _this.noteDefaultWidth/4; //The smallest width possible
            yMin = _this.noteDefaultHeight/5; //             height

            //el = _this.getReal(event.srcElement, "className", "divNote");
            el = event.srcElement;
            if(!el) return;
            if (el.className && typeof(el.className) == 'string' && el.className.indexOf("divNote" ) > -1 ) {
                str = _this.getDirection(el);
                //Fix the cursor
                if (str == "") str = "default";
                else str += "-resize";
                el.style.cursor = str;
            }

            //Dragging starts here
             if(_this.leftObject != null) {
                  if (_this.dir.indexOf("e") != -1)
                   _this.leftObject.el.style.width = Math.max(xMin, _this.leftObject.width + window.event.clientX - _this.leftObject.grabx) + "px";

                  if (_this.dir.indexOf("s") != -1)
                   _this.leftObject.el.style.height = Math.max(yMin, _this.leftObject.height + window.event.clientY - _this.leftObject.graby) + "px";

                  if (_this.dir.indexOf("w") != -1) {
                   _this.leftObject.el.style.left = Math.min(_this.leftObject.left + window.event.clientX - _this.leftObject.grabx, _this.leftObject.left + _this.leftObject.width - xMin) + "px";
                   _this.leftObject.el.style.width = Math.max(xMin, _this.leftObject.width - window.event.clientX + _this.leftObject.grabx) + "px";
                  }
                  if (_this.dir.indexOf("n") != -1) {
                   _this.leftObject.el.style.top = Math.min(_this.leftObject.top + window.event.clientY - _this.leftObject.graby, _this.leftObject.top + _this.leftObject.height - yMin) + "px";
                   _this.leftObject.el.style.height = Math.max(yMin, _this.leftObject.height - window.event.clientY + _this.leftObject.graby) + "px";
                  }

                  window.event.returnValue = false;
                  window.event.cancelBubble = true;
             }
        },

        doClick:function(e){
            if (!_this.screen || !_this.screen.curModal)return;

            if(_this.curtNote){
                if(e.target.classList.contains('pinIcon')) return;

                if(e.target == _this.curtNote || $(e.target).closest('.divNote')[0] == _this.curtNote){
                    _this.curtNote.style.zIndex = _this.getNoteMaxZIndex() + 1;
                }else{
                    var $thisEditor = $(_this.curtNote).find('.divTextEditor');
                    $(_this.curtNote).find('.btn-toolbar').slideUp('1000',function(){
                        $thisEditor.hide();
                        $(_this.curtNote).find('.divText').html($thisEditor.html()).show();
                        _this.curtNote.style.minWidth = '';
                        _this.curtNote.style.minHeight = '';
                    });
                    $thisEditor.removeClass('editing');

                    var id = $(_this.curtNote).attr('id');
                    var index = _this.getNoteListIndex(id);

                    var note = {
                        id: id,
                        text: $(_this.curtNote).find('.divTextEditor').html(),
                        width: $(_this.curtNote).css('width'),
                        height: $(_this.curtNote).css('height')
                    }
                    _this.saveNote(note)
                }
            }
        },

        getReal:function(el, type, value) {
            var temp = el;
            while ((temp != null) && (temp.tagName != "BODY")) {
                 if (eval("temp." + type) == value) {
                      el = temp;
                      return el;
                 }
                 temp = temp.parentElement;
             }
             return el;
        },
        saveNote:function(note){
            var id = note.id;
            var isSave = false
            if (_this.screen.curModal.noteList == undefined)return;
            var index = _this.getNoteListIndex(id);
            if(index == undefined){
                if(!note.text || $.trim(note.text.length) == 0) return;
                var $divNote = $('#'+id);
                //var pos = $divNote.position();
                var note = {
                    id: id,
                    x: ((parseInt(getComputedStyle($divNote[0]).left.split('px')[0])/$divNote.parent().width())*100).toFixed(2) + '%',
                    y: ((parseInt(getComputedStyle($divNote[0]).top.split('px')[0])/$divNote.parent().height())*100).toFixed(2) + '%',
                    width: note.width,
                    height: note.height,
                    text: note.text,
                    bgColor: note.bgColor
                 }
                _this.screen.curModal.noteList.push(note);
                doSave();
            }else{
                var note_old = _this.screen.curModal.noteList[index];
                if(note.x && note.x != note_old.x){
                     isSave = true
                }
                if(!isSave && note.y && note.y != note_old.y){
                     isSave = true
                }
                if(!isSave && note.width && note.width != note_old.width){
                     isSave = true
                }
                if(!isSave && note.height && note.height != note_old.height){
                     isSave = true
                }
                if(!isSave && note.text && note.text != note_old.text){
                     isSave = true
                }
                if(isSave){
                    _this.screen.curModal.noteList[index] = {
                         id: id,
                         x: note.x ? note.x :note_old.x,
                         y: note.y ? note.y : note_old.y,
                         width: note.width ? note.width : note_old.width,
                         height: note.height ? note.height : note_old.height,
                         text: note.text ? note.text : note_old.text,
                         bgColor: note.bgColor ? note.bgColor : note_old.bgColor
                     }
                    doSave();
                }
            }

            function doSave(){
                 _this.screen.saveModal();
                 _this.screen.saveModalJudge.resolveWith(_this.screen, [_this.screen, 1,_this.chart,$('#divWSPane .selected'),_this.screen.curModal,false]);
            }
        },
        initPointAlias :function(arrPointsAlias){
            var lastRepeatIndex = -1 ;
            var tempAlias;
            var repeatNum = 0;
            var tempIndex;
            for (var i =0 ;i < arrPointsAlias.length; ++i){
                lastRepeatIndex = arrPointsAlias.lastIndexOf(arrPointsAlias[i]);
                if (lastRepeatIndex > i){
                    repeatNum = 1;
                    tempAlias = arrPointsAlias[i];
                    arrPointsAlias[i] = tempAlias + '_No1';
                    tempIndex = i;
                    for (var j = tempIndex + 1; j < lastRepeatIndex + 1 ;++j){
                        repeatNum +=1;
                        tempIndex = arrPointsAlias.indexOf(tempAlias);
                        if(tempIndex == -1)break;
                        arrPointsAlias[tempIndex] = tempAlias + '_No' + repeatNum;
                    }
                }
            }
            return arrPointsAlias;
        }
    };

    return AnlzBase;
})();




