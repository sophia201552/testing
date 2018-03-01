/**
 * Created by vicky on 2016/3/1.
 */

var Spinner = new LoadingSpinner({color: '#00FFFF'});
AppConfig = {};
(function(){
    var _this;
    function PatrolScreen(){
        _this = this;
        AppConfig.projectId = parseInt(location.href.split('projectId=')[1].split('&')[0]);
        AppConfig.userId = 1;
        InitI18nResource(navigator.language.split('-')[0]).always(function (rs) {
            I18n = new Internationalization(null,rs);
            _this.init();
        });
    }

    PatrolScreen.prototype.init = function(){
        this.attachEvent();
        $('#listNav a:eq(0)').click();
    }

    PatrolScreen.prototype.show = function(){

    }

    PatrolScreen.prototype.close = function(){

    }

    PatrolScreen.prototype.attachEvent = function(){
        var timeOut = null;
        $('#listNav a').off('click').on('click', function(){
            //避免多次连击
            if(timeOut) return;
            timeOut = setTimeout(function(){
                timeOut = null;
            },500);

            var target = this.dataset.target;
            $(this).addClass('active').siblings().removeClass('active');
            if(_this.screen) _this.screen.close();

            switch (target){
                case 'patrolPath':
                    _this.screen = new PatrolPath(_this);
                    break;
                case 'patrolPerson':
                    _this.screen = new PatrolPerson(_this);
                    break;
                case 'patrolReport':
                    _this.screen = new PatrolReport(_this);
                    break;
                case 'patrolPoint':
                    _this.screen = new PatrolPoint(_this);
                    _this.sortData = _this.sortData =='1'?'1':'0';
                    break;
                case 'patrolSchedule':
                    _this.screen = new PatrolSchedule(_this);
                    break;
            }

            _this.screen.show();
        });
    }

    PatrolScreen.prototype.getMonday = function(date){
        var monday = date;
        if(monday.getDay() === 0){
            monday = monday.setDate(monday.getDate()-6);
        }else{
            monday = monday.setDate(monday.getDate()+1-monday.getDay());
        }
        return new Date(monday).format('yyyy-MM-dd');
    };

    PatrolScreen.prototype.getSunday = function(date){
        var sunday = date;
        if(sunday.getDay() === 0){
            sunday = date;
        }else{
            sunday = sunday.setDate(sunday.getDate()+7-sunday.getDay());
        }

        return new Date(sunday).format('yyyy-MM-dd');
    };
    PatrolScreen.prototype.daysBetween = function(DateOne,DateTwo) {
        var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));
        var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);
        var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));

        var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));
        var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);
        var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));

        var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);
        return Math.abs(cha);
    };

    new PatrolScreen();
}());