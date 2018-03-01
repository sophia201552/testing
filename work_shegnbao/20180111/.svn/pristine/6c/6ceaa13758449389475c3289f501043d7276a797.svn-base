;(function (exports) {
    
    window.CAPTURE_INSTANCES = [];

    const Capture = Sup => class extends Sup {
        constructor(...args) {
            super(...args);
            this.captureDoms = [];
            this._captureDom = null;
            this.captureType = undefined;
        }
        capture() {
            throw new Error('capture method must be implemented!');
        }
        enableCapture(dom) {
            this._captureDom = dom;
            this._attachEvents();
        }
        disableCapture() {
            this._detachEvents();
            this._captureDom = null;
        }
        _attachEvents() {
            // 满足条件添加到 window.CAPTURE 中
            // 或，取消的时候从 window.CAPTURE 中删除
        }
        _detachEvents() {

        }
        _getHeightWithoutOverflow(dom) {
            let style = window.getComputedStyle(dom);
            let oldHeight = parseFloat(style.height);
            if(style.overflowY=='auto'){
                oldHeight = dom.scrollHeight;
            }
            
            let loop = (children, oldHeight)=>{
                if(!children) return oldHeight;
                Array.from(children).forEach(child=>{
                    let style = window.getComputedStyle(child);
                    if(style.overflowY=='auto'){
                        oldHeight += (child.scrollHeight-parseFloat(style.height));
                    }
                    oldHeight = loop(child.children, oldHeight);
                });
                return oldHeight;
            }
            oldHeight = loop(dom.children, oldHeight);
            return oldHeight;
        }
    }
    exports.Capture = Capture;
} (
    namespace('diagnosis.mixins')
));
