/// <reference path="../../core/common.js" />
/// <reference path="../../core/sprites.js" />
/// <reference path="../../lib/Chart.js" />

var ModelChart = (function () {
    function ModelChart(id, painter, behaviors) {
        Sprite.call(this, id, painter, behaviors);
        if (!(this.painter && this.painter.print)) this.painter = { paint: this.paint };
        if (!(this.behaviors && this.behaviors[0] && this.behaviors[0].execute)) this.behaviors = [];

        this.interval = 5000;
        this.units = undefined;
        this.dataTable = {};
        this.maxPointCount = 30;
        this.chartData = [];
        this.chartlabels = undefined;
        this.chart = undefined;
        this.chartOptions = {
            animation: false,
            bezierCurve: false,
            scaleStartValue: 0,
        };

        this.canvasOffline = undefined;
        this.ctxOffline = undefined;

        this.isRunning = false;
        this.receivedDate = {};
    };

    ModelChart.prototype = new Sprite();

    ModelChart.prototype.close = function () {
        this.isRunning = false;
        this.canvasOffline = null;
        this.ctxOffline = null;
    }

    ModelChart.prototype.drawLegend = function () {
        this.ctxOffline.textBaseline = "middle";
        this.ctxOffline.textAlign = "left";
        var legendItemBeginX = 0, legendItemHeight = 14, legendItemLine = 0;
        for (var i = 0; i < this.units.length; i++) {
            if (legendItemBeginX > (this.width * 0.8)) {
                legendItemBeginX = 0;
                legendItemLine += 1;
            }

            if ((!text) || text == '') continue;

            var text = this.units[i].title, itemHeight = legendItemHeight * legendItemLine;
            this.ctxOffline.fillStyle = this.units[i].color;
            this.ctxOffline.fillRect(legendItemBeginX + 50, 8 + itemHeight, 10, 4);
            this.ctxOffline.fillStyle = "#333333";
            this.ctxOffline.fillText(text, legendItemBeginX + 70, 10 + itemHeight);
            legendItemBeginX += this.ctxOffline.measureText(text).width + 50;
        }
    }

    ModelChart.prototype.paint = function (ctx) {
        ctx.drawImage(this.canvasOffline, this.x, this.y);
    },

    ModelChart.prototype.update = function (pointName, value) {
        this.receivedDate[pointName] = value;
        if (value < 0) this.chartOptions.scaleStartValue = null;
    }

    return ModelChart;
})();

var LineChart = (function () {
    function LineChart(id, painter, behaviors) {
        ModelChart.call(this, id, painter, behaviors);

    }
    LineChart.prototype = new ModelChart();
    LineChart.prototype.constructor = LineChart;
    LineChart.prototype.renderChart = function (_this) {
        if (!_this.isRunning) return;
        //update date, axis X
        _this.chartlabels.shift();
        _this.chartlabels.push(new Date().toLocaleTimeString());

        //update values which is based on the new data store, axis Y
        for (var pointName in _this.receivedDate) {
            _this.dataTable[pointName].shift();
            _this.dataTable[pointName].push(_this.receivedDate[pointName]);

            for (var i = 0; i < _this.chartData.length; i++) {
                if (_this.chartData[i].pointName == pointName) {
                    _this.chartData[i].data = _this.dataTable[pointName];
                    break;
                }
            }
        }

        //draw chart
        _this.canvasOffline.width = this.width;
        _this.canvasOffline.height = this.height;
        _this.ctxOffline.clearRect(0, 0, _this.canvasOffline.width, _this.canvasOffline.height);
        _this.chart = new Chart(_this.ctxOffline);
        _this.chart.Line({
            labels: _this.chartlabels,
            datasets: _this.chartData
        }, _this.chartOptions);

        //draw legend
        this.drawLegend();

        setTimeout(function () { _this.renderChart(_this) }, _this.interval);
    }
    LineChart.prototype.init = function () {
        this.canvasOffline = document.createElement("canvas");
        this.ctxOffline = this.canvasOffline.getContext("2d");
        this.canvasOffline.width = this.width;
        this.canvasOffline.height = this.height;

        //init chart
        var unit, sbColor, arr;
        for (var i = 0; i < this.units.length; i++) {
            unit = this.units[i];
            arr = [];
            for (var j = 0; j < this.maxPointCount; j++) arr.push(null);

            this.dataTable[unit.pointName] = arr;
            this.receivedDate[unit.pointName] = null;
            sbColor = new StringBuilder();
            sbColor.append("rgba(").append(unit.color.b).append(",").append(unit.color.g).append(",").append(unit.color.r);
            this.units[i].color = sbColor.toString().replace("rgba", "rgb") + ")";
            this.chartData.push({
                fillColor: sbColor.toString() + ", 0.5)",
                strokeColor: sbColor.toString() + ", 1)",
                pointColor: sbColor.toString() + ", 1)",
                pointStrokeColor: "#fff",
                data: this.dataTable[unit.pointName],
                pointName: unit.pointName,
            });
        }
        this.chartlabels = new Array();
        for (var i = 0; i < this.maxPointCount; i++) this.chartlabels.push('');
    }

    return LineChart;

})();


var BarChart = (function () {
    function BarChart(id, painter, behaviors) {
        ModelChart.call(this, id, painter, behaviors);
    }
    BarChart.prototype = new ModelChart();
    BarChart.prototype.constructor = BarChart;
    BarChart.prototype.renderChart = function (_this) {
        if (!_this.isRunning) return;

        for (var i = 0; i < _this.units.length; i++) {

            var unit = _this.units[i], pointName = unit.pointName;
            !_this.chartlabels[i] && (_this.chartlabels[i] = unit.title);
            for (var j = 0; j < _this.chartData.length; j++) {
                if (_this.chartData[j].pointName === pointName) {
                    _this.chartData[j].data[0] = Number(_this.receivedDate[pointName]);
                }
            }
        }

        //draw chart
        _this.canvasOffline.width = this.width;
        _this.canvasOffline.height = this.height;
        _this.ctxOffline.clearRect(0, 0, _this.canvasOffline.width, _this.canvasOffline.height);
        _this.chart = new Chart(_this.ctxOffline);
        _this.chart.Bar({
            labels: [' '],
            datasets: _this.chartData
        }, _this.chartOptions);

        //draw legend
        this.drawLegend();

        setTimeout(function () { _this.renderChart(_this) }, _this.interval);
    }
    BarChart.prototype.init = function () {
        this.canvasOffline = document.createElement("canvas");
        this.ctxOffline = this.canvasOffline.getContext("2d");
        this.canvasOffline.width = this.width;
        this.canvasOffline.height = this.height;
        this.chartlabels = [];
        //init chart

        var unit, sbColor;
        for (var i = 0; i < this.units.length; i++) {
            unit = this.units[i];
            this.dataTable[unit.pointName] = [];
            this.receivedDate[unit.pointName] = null;
            sbColor = new StringBuilder();
            sbColor.append("rgba(").append(unit.color.b).append(",").append(unit.color.g).append(",").append(unit.color.r);
            this.units[i].color = sbColor.toString().replace("rgba", "rgb") + ")";
            this.chartData.push({
                fillColor: sbColor.toString() + ", 0.5)",
                strokeColor: sbColor.toString() + ", 1)",
                data: this.dataTable[unit.pointName],
                pointName: unit.pointName,
            });
        }
    }
    return BarChart;
})();

var PieChart = (function () {

    function PieChart(id, painter, behaviors) {
        ModelChart.call(this, id, painter, behaviors);
        this.painter = { paint: this.paint };

    }
    PieChart.prototype = new ModelChart();
    PieChart.prototype.constructor = PieChart;

    PieChart.prototype.paint = function (ctx) {
        ctx.drawImage(this.canvasOffline, this.x + this.width * 0.1, this.y + this.height * 0.2);

        //draw legend
        ctx.save();
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        var legendItemBeginX = 0, legendItemHeight = 14, legendItemLine = 0;
        for (var i = 0; i < this.units.length; i++) {
            if (legendItemBeginX > (this.width * 0.8)) {
                legendItemBeginX = 0;
                legendItemLine += 1;
            }

            var text = this.units[i].title, itemHeight = legendItemHeight * legendItemLine;
            ctx.fillStyle = this.units[i].color;
            ctx.fillRect(legendItemBeginX + 50 + this.x, 8 + itemHeight + this.y, 10, 4);
            ctx.fillStyle = "#333333";
            ctx.font = "bold 14px 微软雅黑";
            ctx.fillText(text, legendItemBeginX + 70 + this.x, 10 + itemHeight + this.y);
            legendItemBeginX += ctx.measureText(text).width + 50;
        }
        ctx.restore();
    },

    PieChart.prototype.renderChart = function (_this) {
        if (!_this.isRunning) return;

        for (var i = 0; i < _this.units.length; i++) {
            var unit = _this.units[i], pointName = unit.pointName;
            for (var j = 0; j < _this.chartData.length; j++) {
                if (_this.chartData[j].pointName === pointName) {
                    _this.chartData[j].value = Number(_this.receivedDate[pointName]);
                    _this.chartData[j].label = unit.title;
                }
            }
        }

        //draw chart
        _this.canvasOffline.width = this.width * 0.8;
        _this.canvasOffline.height = this.height * 0.8;
        _this.ctxOffline.clearRect(0, 0, _this.canvasOffline.width, _this.canvasOffline.height);
        _this.chart = new Chart(_this.ctxOffline);
        _this.chart.Pie(_this.chartData, _this.chartOptions);

        setTimeout(function () { _this.renderChart(_this) }, _this.interval);
    }

    PieChart.prototype.init = function () {
        this.canvasOffline = document.createElement("canvas");
        this.ctxOffline = this.canvasOffline.getContext("2d");
        this.canvasOffline.width = this.width * 0.8;
        this.canvasOffline.height = this.height * 0.8;
        this.chartlabels = [];
        //init chart
        var unit, sbColor;
        for (var i = 0; i < this.units.length; i++) {
            unit = this.units[i];
            this.dataTable[unit.pointName] = [];
            this.receivedDate[unit.pointName] = null;
            sbColor = new StringBuilder();
            sbColor.append("rgba(").append(unit.color.b).append(",").append(unit.color.g).append(",").append(unit.color.r);
            this.units[i].color = sbColor.toString().replace("rgba", "rgb") + ")";
            this.chartData.push({
                color: sbColor.toString() + ", 1)",
                value: 0,
                label: '',
                pointName: unit.pointName,
            });
        }
    }
    return PieChart;

})();