// nav.js
(function(exports, Structure, Fault, Category, TimePicker) {
    class Nav {
        constructor(container, diagnosis) {
            this.container = container;
            this.diagnosis = diagnosis;
            this.timePicker = null;
            this.structure = null;
            this.fault = null;
            this.category = null;
            this.state = new Model({
                time: {
                    startTime: undefined,
                    endTime: undefined
                }
            });
            this.init();
        }
        init() {
            const htmlWrap = `<div id="listWrap"><div id="structure"></div><div id="fault"></div></div>`;
            this.container.querySelector(
                '.diagnosis-v2-content'
            ).innerHTML = htmlWrap;
            this.initTimePicker();
            this.initStructure();
            this.initFault();
            //this.initCategory();
        }
        show() {}
        close() {}
        initTimePicker() {
            let timePickerDom = this.container.querySelector(
                '.diagnosis-v2-header'
            );
            this.timePicker = new TimePicker(
                timePickerDom,
                this.diagnosis,
                this
            );
            this.timePicker.show();
        }
        initStructure() {
            let structureDom = this.container.querySelector('#structure');
            this.structure = new Structure(structureDom, this.diagnosis, this);
            this.structure.show();
        }
        initFault() {
            let faultDom = this.container.querySelector('#fault');
            this.fault = new Fault(faultDom, this.diagnosis, this);
            this.fault.show();
        }
        initCategory() {
            let categoryDom = this.container.querySelector('#category');
            this.category = new Category(categoryDom, this.diagnosis, this);
            this.category.show();
        }
    }
    exports.Nav = Nav;
})(
    namespace('diagnosis.Pages.nav'),
    namespace('diagnosis.Pages.nav.Structure'),
    namespace('diagnosis.Pages.nav.Fault'),
    namespace('diagnosis.Pages.nav.Category'),
    namespace('diagnosis.Pages.nav.TimePicker')
);
