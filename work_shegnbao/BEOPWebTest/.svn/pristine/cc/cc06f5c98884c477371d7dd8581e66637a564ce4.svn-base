/**
 * Created by win7 on 2015/10/28.
 */
var router = (function () {
    function Router() {
        this.path = [];
    }

    +function () {
        // 回退一个页面
        this.back = function () {
            this.path.pop();
            this._display();
            return this;
        };
        // 前进一个页面
        this.to = function (pathNode) {
            this.path.push(pathNode);
            this._display();
            return this;
        };
        this.empty = function () {
            this.path.length = 0;
            return this;
        };
        this._display = function () {
            var node = this.path[this.path.length-1];
            var typeClass = node.typeClass;
            var data = node.data;
            var $body = $('body');
            var $navTop = $('#navTop');
            var $navBottom = $('#navBottom');
            // 初始化 nav
            $body.removeClass('top-nav bottom-nav');
            $navTop.hide();
            $navBottom.hide();
            $('.btn-back', '#navTop').hide();
            $navTop.find(':not(.btn-back)').remove();
            //放置导航条
            if(typeClass.navOptions) {
                if(typeClass.navOptions.bottom) {
                    // 显示底部 nav
                    $body.addClass('bottom-nav');
                    $navBottom.show();
                }
                if(typeClass.navOptions.top) {
                    // 显示顶部 nav
                    $body.addClass('top-nav');
                    //导航条工具按钮初始化
                    $navTop.append(typeClass.navOptions.top).show();
                }
            }

            // 如果当前路径不是第一级目录，显示"后退"按钮
            if(this.path.length > 1 && !typeClass.navOptions.backDisable) {
                $body.addClass('top-nav');
                $('.btn-back', '#navTop').show();
            }
            //判断所属模块
            $('.navTool.selected').removeClass('selected');
            if(typeClass.navOptions && typeClass.navOptions.module) {
                switch (typeClass.navOptions.module) {
                    case 'project':
                        $('#btnProject').addClass('selected');
                        break;
                    case 'message':
                        $('#btnMessage').addClass('selected');
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
            $(ElScreenContainer).hammer().off('swipeleft swiperight');
            // 显示页面内容
            ScreenManager.show(node.typeClass,data);
        };

    }.call(Router.prototype);

    return new Router();

}).call(this);