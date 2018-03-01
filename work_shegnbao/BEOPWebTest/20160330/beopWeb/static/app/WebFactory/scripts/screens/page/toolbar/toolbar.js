/** toolbar.js */
(function () {
    function Toolbar(screen) {
        this.screen = screen;
        this.container = screen.toolbarCtn;
        this.painter = screen.painter;

        this.toolsCtn = undefined;
        this.optionToolsCtn = undefined;

        this.tools = [];
        this.optionTools = [];
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
        /** Html 容器工具 */
        this.tools.push(THtml);
        /** Screen 容器工具 */
        this.tools.push(TScreen);
        /** Canvas 图片工具 */
        this.tools.push(TImage);
        /** 管道工具 */
        this.tools.push(TPipe);
        /** 管道编辑工具 */
        // this.tools.push(TPipeEdit);
        /** 放大镜工具 */
        this.tools.push(TZoomSelect);
        /** 项目素材库 */
        this.tools.push(TProjectMaterial);
        /** 网格开关 */
        this.tools.push(TGridLine);
        /** 格式化 */
        this.tools.push(TLayout);

        ////////////////
        // 设置类工具 //
        ////////////////
        /** 比例调整工具 */
        // this.optionTools.push(TZoomSelect);

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

        this.init();

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
    //改变类为window的对象的cursor属性
    Toolbar.prototype.changeCursor = function (cursorType) {
        this.painter.domContainer.style.cursor = cursorType;
    }
    Toolbar.prototype.attachEvents = function () {
        var _this = this;
        $(this.toolsCtn).off('click').on('click', '> .btn-switch', function () {
            // 处理选中样式
            $(_this.toolsCtn).children('.btn-switch').removeClass('t-active');
            $(this).addClass('t-active');
            var attrType = $(this).attr('data-type');
            if (attrType === 'handCtrl') {
                //当点击手型工具时鼠标样式变为手型
                _this.changeCursor('-webkit-grab');
            } else if (attrType === 'pointerCtrl' || attrType === 'pipeEditCtrl') {
                //当点击箭头工具或管道编辑工具时鼠标样式变为默认
                _this.changeCursor('default');
            } else {
                //当点击其他工具时鼠标样式变为十字型
                _this.changeCursor('crosshair');
        }
        });
    };

    Toolbar.prototype.switchTool = function (type) {
        $(this.tools[0].element).trigger('click');
    };

    Toolbar.prototype.close = function () {
        //还原鼠标样式
        this.changeCursor('default');
        sessionStorage.removeItem('copy');
    };

    window.Toolbar = Toolbar;
} ());