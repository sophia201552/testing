/** toolbar.js */
(function () {
    function Toolbar(screen) {
        this.screen = screen;
        this.container = screen.toolbarCtn;
        this.page = screen.page;
        this.painter = this.page.painter;

        this.toolsCtn = undefined;
        this.optionToolsCtn = undefined;

        this.tools = [];
        this.optionTools = [];

        this.init();
    }

    Toolbar.prototype.init = function () {
        ////////////////
        // 绘图类工具 //
        ////////////////
        /** 箭头工具 */
        this.tools.push(TPointer);
        /** 手型工具 */
        this.tools.push(THand);
        /** Html 文本框工具 */
        this.tools.push(TText);
        /** Html 按钮工具 */
        this.tools.push(TButton);
        /** Canvas 图片工具 */
        this.tools.push(TImage);
        /** 测试工具 */
        this.tools.push(TRect);

        ////////////////
        // 设置类工具 //
        ////////////////
        /** 比例调整工具 */
        this.optionTools.push(TZoomSelect);

        /////////
        // DOM //
        /////////
        this.toolsCtn = document.createElement('div');
        this.toolsCtn.className = 'tools-ctn tool';
        
        this.optionToolsCtn = document.createElement('div');
        this.optionToolsCtn.className = 'tools-ctn option';

        // 清空容器
        while(this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        this.container.appendChild(this.toolsCtn);
        this.container.appendChild(this.optionToolsCtn);
    };

    Toolbar.prototype.show = function () {
        var _this = this;

        this.tools = this.tools.map(function (row) {
            var ins = new row(_this, _this.toolsCtn);
            ins.show();
            return ins;
        });
        this.optionTools = this.optionTools.map(function (row) {
            var ins = new row(_this, _this.optionToolsCtn);
            ins.show();
            return ins;
        });

        this.attachEvents();
        // 默认选中第一个控件
        $(this.tools[0].element).trigger('click');
    };

    Toolbar.prototype.attachEvents = function () {
        var _this = this;
        $(this.toolsCtn).on('click', '> button', function () {
            // 处理选中样式
            $(_this.toolsCtn).children('button').removeClass('t-active');
            $(this).addClass('t-active');
        });
    };

    Toolbar.prototype.close = function () {};

    window.Toolbar = Toolbar;
} ());