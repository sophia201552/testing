// modalNav.js
;(function (exports, Structure, Consequence, Category, TimePicker) {
    class ModalNav{
        constructor(container, diagnosis) {
            this.container = container;
            this.diagnosis = diagnosis;
            this.timePicker = null;
            this.structure = null;
            this.consequence = null;
            this.category = null;
            this.init();
        }
        init() {
            const htmlWrap = `<div class="listHead"></div><div class="listWrap"><div class="structure"></div><div class="consequence"></div><div class="category"></div></div>`;
            this.container.innerHTML = htmlWrap;
            this.initTimePicker();
            this.initStructure();
            this.initConsequence();
            this.initCategory();
        }
        show() {

        }
        close() {

        }
        initTimePicker() {
            let timePickerDom = this.container.querySelector('.listHead');
            this.timePicker = new TimePicker(timePickerDom, this.diagnosis, this);
            this.timePicker.show();
        }
        initStructure() {
            let structureDom = this.container.querySelector('.structure');
            this.structure = new Structure(structureDom, this.diagnosis, this);
            this.structure.show();
        }
        initConsequence() {
            let consequenceDom = this.container.querySelector('.consequence');
            this.consequence = new Consequence(consequenceDom, this.diagnosis, this);
            this.consequence.show();
        }
        initCategory() {
            let categoryDom = this.container.querySelector('.category');
            this.category = new Category(categoryDom, this.diagnosis, this);
            this.category.show();
        }
    }
    exports.ModalNav = ModalNav;
} ( namespace('diagnosis.Pages.nav'), namespace('diagnosis.Pages.nav.Structure'), namespace('diagnosis.Pages.nav.Consequence'), namespace('diagnosis.Pages.nav.Category'), namespace('diagnosis.Pages.nav.TimePicker') ));