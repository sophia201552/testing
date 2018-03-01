/** 
 * Canvas Painter
 */

(function () {

    function GStage(domContainer) {
        this.domContainer = domContainer;
        
        this.domCanvas = undefined;
        this.context2d = undefined;
        this.scale = undefined;

        // 通过 requestAnimationFrame 获取的请求 id
        this.requestId = undefined;
    }

    GStage.prototype = {
        constructor: GStage,
        
        init: function () {
            var styles = window.getComputedStyle(this.domContainer);

            this.domCanvas = document.createElement('canvas');
            this.domCanvas.width = parseInt(styles.width);
            this.domCanvas.height = parseInt(styles.height);
            this.domContainer.appendChild(this.domCanvas);
            
            this.context2d = this.domCanvas.getContext('2d');
            this.setScale(1);

            this.startLoop();
        },

        startLoop: function () {
            this.repaint();
            this.requestId = window.requestAnimationFrame(this.startLoop.bind(this));
        },

        endLoop: function () {
            if(this.requestId) {
                window.cancelAnimationFrame(this.requestId);
                requestId = undefined;
            }
        },

        setScale: function (s) {
            this.scale = s;
            this.context2d.setScale(s);
        },

        getScale: function () {
            return this.scale;
        },

        repaint: function () {
            var ctx = this.context2d;
            ctx.save();
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
        },

        resize: function (w, h) {
            if (w != this.context2d.canvas.width || h != this.context2d.canvas.height) {
                this.context2d.canvas.width = w;
                this.context2d.canvas.height = h;
            }
        },

        initMouseListeners: function () {
            this.domCanvas.addEventListener('onmousedown', this.mouseDownActionPerformed.bind(this));
            this.domCanvas.addEventListener('onmouseup', this.mouseUpActionPerformed.bind(this));
            this.domCanvas.addEventListener('onmousemove', this.mouseMoveActionPerformed.bind(this));

        },

        mouseDownActionPerformed: function (e) {

        },

        mouseUpActionPerformed: function (e) {

        },

        mouseMoveActionPerformed: function (e) {

        }

    };

    window.GStage = GStage;

} ())