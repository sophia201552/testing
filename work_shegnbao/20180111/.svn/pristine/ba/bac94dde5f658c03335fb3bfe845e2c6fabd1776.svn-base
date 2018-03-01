; (function (exports, TimePicker, TagTree) {
    class Nav{
        constructor(container, diagnosis) {
            this.container = container;
            this.diagnosis = diagnosis;
        }
        init() {
            let html = `<div class="timeTop"></div>
                        <div class="treeCtn"></div>`;
            this.container.innerHTML = html;
            this.initTimePicker();
            this.initTagZtree();
            this.attachEvent();
        }
        initTimePicker() {
            let timePickerDom = this.container.querySelector('.timeTop');
            this.timePicker = new TimePicker(timePickerDom, this.diagnosis, this);
        }
        initTagZtree() {
            let tagTreeDom = this.container.querySelector('.treeCtn');
            this.tagTree = new TagTree(tagTreeDom, this.diagnosis, this);
        }
        show() {
            
        }
        attachEvent() {
            
        }
        close() {
            
        }
    }
    exports.Nav = Nav;
})(namespace('thermalComfort.Nav'),namespace('thermalComfort.Nav.TimePicker'),namespace('thermalComfort.Nav.TagTree'));