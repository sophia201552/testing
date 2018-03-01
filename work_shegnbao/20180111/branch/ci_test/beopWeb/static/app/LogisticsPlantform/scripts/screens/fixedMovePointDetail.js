/**
 * Created by win7 on 2017/3/2.
 */
var FixedMovePointDetail = (function(){
    var _this;
    function FixedMovePointDetail(){
        _this = this;
        this.container = ElScreenContainer.querySelector('#divMap');
    }
    FixedMovePointDetail.prototype = {
        show: function(){
            this.init();
        },
        init: function(){
            WebAPI.get('/static/app/LogisticsPlantform/views/FixedMoveDetailScreen.html').done(function(result){
                $(_this.container).append($(result));
                _this.renderChart();
                _this.renderTable();
            });
        },
        renderChart: function () {
            
            var FMChart = echarts.init(this.container.querySelector(".FMechart"));
            FMChart.setOption(option);
        },
        renderTable: function(){
            var ctnTable = this.container.querySelector(".tableDetail tbody");

        }
    }
    return FixedMovePointDetail;
})();