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
        /** Canvas  简单文本框工具 */
        this.tools.push(TSimpleText);
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
        /** 设备设置 **/
        this.tools.push(TDevice);
        /** 放大镜工具 */
        this.tools.push(TZoomSelect);
        /** 项目素材库 */
        // this.tools.push(TProjectMaterial);
        /** 网格开关 */
        this.tools.push(TGridLine);
        /** 格式化 */
        this.tools.push(TLayout);
        /** 热力 */
        this.tools.push(THeat);
        /**Html5模板控件*/
        this.tools.push(THTMLTpl);
        /** 多边形 */
        this.tools.push(TPolygon);
        /** 线段 */
        this.tools.push(TLine);
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
    Toolbar.prototype.cursor = function (cursorType) {
        if (typeof cursorType === 'undefined') {
            return this.painter.domContainer.style.cursor;
        }
        this.painter.domContainer.style.cursor = cursorType;
    };

    Toolbar.prototype.attachEvents = function () {
        var _this = this;
        $(this.toolsCtn).off('click').on('click', ' .btn-switch', function () {
            var $this = $(this);
            // 处理选中样式
            $(_this.toolsCtn).find('.btn-switch').removeClass('t-active');
            $this.addClass('t-active');
            var attrType = $this.attr('data-type');
            if ($this.data().type !== 'heatCtrl') {
                //还原热力图图标
                $('#divHeat .dropdown-toggle').removeClass('btn-switch t-active')
                    .find(' .iconfont').removeClass('icon-relituxuanqu icon-relitubiaoji')
                    .addClass('icon-relitu');
            }
        });
        $(this.screen.windowCtn).off('keydown').on('keydown',function(e){
            //监控工具按键事件
            if(!e.target.id || e.target.id !== "windows" || e.ctrlKey){
                return;
            }
            var code = e.keyCode;
            if( [86, 77, 84, 66, 72, 83, 73, 80].indexOf(code) === -1 ) return;
            //if(["textarea","input"].indexOf(e.target.tagName.toLocaleLowerCase()) > -1) return;
            var $toolbar = $('#toolbar');
            switch (code){
                //v
                case 86:
                    $toolbar.find("button[data-type='pointerCtrl']").click();
                    break;
                //m
                case 77:
                    $toolbar.find("button[data-type='handCtrl']").click();
                    break;
                //t
                case 84:
                    $toolbar.find("button[data-type='textCtrl']").click();
                    break;
                //b
                case 66:
                    $toolbar.find("button[data-type='btnCtrl']").click();
                    break;
                //html
                case 72:
                    $toolbar.find("button[data-type='htmlCtrl']").click();
                    break;
                //screen
                case 83:
                    $toolbar.find("button[data-type='screenCtrl']").click();
                    break;
                //i
                case 73:
                    $toolbar.find("button[data-type='imgeCtrl']").click();
                    break;
                //p
                case 80:
                    $toolbar.find("button[data-type='pipeCtrl']").click();
                    break;
            }
        });
    };

    Toolbar.prototype.switchTool = function (type) {
        $(this.tools[0].element).trigger('click');
    };

    Toolbar.prototype.close = function () {
        //还原鼠标样式
        this.cursor('default');

        // 销毁工具
        this.tools.forEach(function (row) {
            row.close();
        });
    };

    window.Toolbar = Toolbar;
} ());