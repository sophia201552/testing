/**
 * Created by win7 on 2015/10/28.
 */
var router = (function () {
    var _this;
    function Router() {
        this.path = [];
        _this = this;
    }

    Router.prototype = {
        //android回退键绑定
        // 回退一个页面
        back:function () {
            if(AppConfig.backDefault === false)return;
            if(_this.path.length <= 1 || _this.path[_this.path.length-1].typeClass.navOptions.backDisable){
                if(window.plugins) {
                    window.plugins.toast.show((AppConfig.language == 'zh')?'再按一次退出程序':'Press again to stop application', 'short', 'center');
                    document.removeEventListener("backbutton", _this.back, false);
                    var backInterval = window.setTimeout(
                        function () {
                            window.clearTimeout(backInterval);
                            document.addEventListener("backbutton", _this.back, false)
                        },
                        3000
                    );
                }
                
                if (window.customVariable && window.customVariable.lastGps) {
                    localStorage.setItem('lastGps'+AppConfig.userId, JSON.stringify(window.customVariable.lastGps));
                }
            }else {
                _this.path.pop();
                _this._display();
            }
            return _this;
        },
        // 前进一个页面
        to:function (pathNode) {
            _this.path.push(pathNode);
            _this._display();
            return _this;
        },
        empty:function () {
            _this.path.length = 0;
            return _this;
        },
        _display : function () {
            SpinnerControl.hide();
            Spinner.stop();
            $('.spinner').remove();
            var node = _this.path[this.path.length-1];
            var typeClass = node.typeClass;
            var data = node.data;
            var $body = $('body');
            var $navTop = $('#navTop');
            var $navBottom = $('#navBottom');
            // 初始化 nav
            //$body.removeClass('top-nav bottom-nav');
            //$navTop.removeClass('active');
            //$navBottom.removeClass('active');
            //$('.btn-back', '#navTop').hide();
            $navTop.children().not('#btnBack').remove();
            //放置导航条
            if(typeClass.navOptions) {
                if(typeClass.navOptions.bottom && typeof typeClass.navOptions.bottom != 'boolean') {
                    // 显示底部 nav
                    $navTop.append(typeClass.navOptions.bottom);
                }
                if(typeClass.navOptions.top  && typeof typeClass.navOptions.top != 'boolean') {
                    // 显示顶部 nav
                    //导航条工具按钮初始化
                    $navTop.append(typeClass.navOptions.top);
                }
                CssAdapter.adapter(typeClass.navOptions);
                // 如果当前路径不是第一级目录，显示"后退"按钮
                if(!typeClass.navOptions.backDisable) {
                    $navTop.removeClass('noBtnBack');
                }else{
                    $navTop.addClass('noBtnBack');
                }
            }

            //判断所属模块
            $('.bottomTool.selected').removeClass('selected');
            if(typeClass.navOptions && typeClass.navOptions.module) {
                switch (typeClass.navOptions.module) {
                    case 'project':
                        $('#btnProject').addClass('selected');
                        break;
                    case 'report':
                        $('#btnReport').addClass('selected');
                        break;
                    case 'workflow':
                        $('#btnWorkFlow').addClass('selected');
                        break;
                    case 'admin':
                        $('#btnAdminConfig').addClass('selected');
                        break;
                    default :
                        break;
                }
            }
            // 解绑切换功能
            //$(ElScreenContainer).hammer().off('swipeleft swiperight');
            //模态框内容清除
            $('#divModal').find('.modal-header').html('');
            $('#divModal').find('.modal-body').html('');
            // 显示页面内容
            if (node.param instanceof Array){
                var param = [node.typeClass].concat(node.param);
                ScreenManager.show.apply(this,param)
            }else {
                ScreenManager.show(node.typeClass, data);
            }
        }

    };
    return new Router();
})();