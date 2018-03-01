/**
 * Created by vicky on 2016/3/1.
 */

var Spinner = new LoadingSpinner({color: '#00FFFF'});
AppConfig = {};
(function(){
    var _this;
    function PatrolScreen(){
        _this = this;
        AppConfig.projectId = 72;
        AppConfig.userId = 1;
        this.init();
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
        $('#listNav a').off('click').on('click', function(){
            var target = this.dataset.target;
            $(this).addClass('active').siblings().removeClass('active');
            if(_this.screen) _this.screen.close();

            switch (target){
                case 'patrolPath':
                    _this.screen = new PatrolPath();
                    break;
                case 'patrolPerson':
                    _this.screen = new PatrolPerson();
                    break;
                case 'patrolReport':
                    _this.screen = new PatrolReport();
                    break;
                case 'patrolPoint':
                    _this.screen = new PatrolPoint();
                    break;
                case 'patrolSchedule':
                    _this.screen = new PatrolSchedule();
                    break;
            }

            _this.screen.show();
        });
    }

    new PatrolScreen();
}());