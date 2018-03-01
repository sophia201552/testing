// category.js
(function(exports) {
    class Category {
        constructor(container, diagnosis, nav) {
            this.container = container;
            this.diagnosis = diagnosis;
            this.nav = nav;
            this.async = null;
            this.selectedIds = new Set();
            this.data = [];
            this.init();
        }
        init() {
            const headHtml = `<div class="itemHead"><span class="headIcon"><span class="out"></span><span class="in"></span></span><span class="headText">${I18n
                .resource.nav
                .EQUIPMENTS}</span></div><div class="itemList"></div>`;
            this.container.innerHTML = headHtml;
            this.attachEvent();
            this.unbindStateOb();
            this.bindStateOb();
            this.async = this.getData().always(() => {
                this.async = null;
            });
        }
        show() {}
        close() {
            if (this.async) {
                this.async.abort();
                this.async = undefined;
            }
        }
        attachEvent() {
            const _this = this;
            let $container = $(this.container),
                $itemList = $container.find('.itemList');
            $itemList.off('click').on('click', '.item', function(e) {
                let id = this.dataset.id;
                if (_this.selectedIds.has(id)) {
                    _this.selectedIds.delete(id);
                } else {
                    _this.selectedIds.add(id);
                }
                let categories = [];
                _this.data.forEach(v => {
                    if (_this.selectedIds.has(v.className)) {
                        categories.push(v);
                    }
                });
                // _this.diagnosis.conditionModel.activeCategories(categories);
                _this.diagnosis.gotoHistory({
                    activeCategories: categories
                });
            });
        }
        bindStateOb() {
            this.diagnosis.conditionModel.addEventListener(
                'update.activeCategories',
                this.updateActiveCategories,
                this
            );
        }
        unbindStateOb() {
            this.diagnosis.conditionModel.removeEventListener(
                'update.activeCategories',
                this.updateActiveCategories,
                this
            );
        }
        updateActiveCategories() {
            $('.itemList .item', this.container).removeClass('selected');
            this.selectedIds.clear();
            let activeCategories = this.diagnosis.conditionModel.activeCategories();
            activeCategories.forEach(v => {
                this.selectedIds.add(v.className);
                $(`.item[data-id='${v.className}']`, this.container).addClass(
                    'selected'
                );
            });
        }
        getData() {
            let time = this.diagnosis.conditionModel.time();
            return $.get('/diagnosis_v2/getEquipmentAvailability', {
                projectId: AppConfig.projectId,
                startTime: time.startTime,
                endTime: time.endTime,
                lang: I18n.type
            }).done(rs => {
                if (rs && rs.status == 'OK') {
                    let $wrap = $(this.container)
                        .find('.itemList')
                        .html('');
                    this.createItem(rs.data);
                    this.data = rs.data;
                    this.data.forEach(v => {
                        v.name = v.className;
                    });
                    this.updateActiveCategories();
                }
            });
        }
        createItem(data = []) {
            let domHtml = '';
            data.sort((v1,v2)=>parseInt(v1.intactRate)-parseInt(v2.intactRate));
            data.forEach(v => {
                let errorClassName = '';
                let intactRate = parseInt(v.intactRate);
                if (intactRate < 60) {
                    errorClassName = 'error';
                }
                domHtml += `<div data-id="${v.className}" class="item" title="${v.className}"><span class="itemIcon iconfont icon-xiangmusucai"></span><span class="itemText">${v.className}</span><span class="itemEnd ${errorClassName}">${intactRate}%</span></div>`;
            });
            this.container.querySelector('.itemList').innerHTML = domHtml;
        }
        findByNames(names) {
            let namesSet = new Set(names);
            return this.data.filter(v => namesSet.has(v.className));
        }
    }
    exports.Category = Category;
})(namespace('diagnosis.Pages.nav'));
