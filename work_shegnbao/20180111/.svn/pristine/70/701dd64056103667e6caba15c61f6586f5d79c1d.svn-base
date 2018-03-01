var Unit = (function() {
    function Unit() {
    }
    Unit.prototype = {
        getUnitSystem: function (unit_system) {
            if(unit_system === 1){//I_P
                type = 'I_PUnits';
            }else if(unit_system === 2){//SI
                type = 'SIUnits';
            }else{
                type = 'SIUnits';
            }
            return $.getScript('/static/scripts/observer/units/'+ type + '.js', function(data) {
                       return unitSystem;
                    });
        },
        fillAreaUnits: function($container){
            $container.find('[unit]').each(function(){
                var attrVal = $(this).attr('unit');
                $(this).html(eval(attrVal));
            });
        },
        getCurrencyUnit: function(unit_currency) {
            var unit;
            switch(unit_currency)
            {
                case 0:
                    unit = '¥';
                    break;
                case 2:
                    unit = '€';
                    break;
                case 3:
                    unit = '¥';
                    break;
                case 4:
                    unit = '￡';
                    break;
                case null:
                    unit = '¥';
                    break;
                default:
                    unit = '$';
            }
            return unit;
        }
    }
    return Unit;
})()