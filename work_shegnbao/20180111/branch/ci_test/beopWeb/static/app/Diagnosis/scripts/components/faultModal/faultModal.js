// faultModal.js
;(function (exports, ModalNav,FaultPanelTable) {
    class FaultModal {
        constructor(diagnosis,callBack) {
            this.diagnosis = diagnosis;
            this.$faultModal = null;
            this.modalNav = null;
            this.faulttable = null;
            this.callBack = callBack;
            this.conditionModel = new Model({
                time:{
                    startTime: undefined,
                    endTime: undefined,
                },
                activeEntities:[],
                activeConsequences:[],
                activeCategories:[],
                activeAllEntities:[]
            });
            this.init();
        }
        init() {
            $('#faultModal').remove();
            const headHtml = `
                <div id="faultModal" class="modal fade" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                        <div class="modal-body">
                            <div id="modal-nav"></div>
                            <div id="modal-faulttable">
                                <div class="modal-fault-table-top">
                                    <div class="leftGroup">
                                        <button type="button" class="btn btn-default btn-info" id="btnEnablePush">${I18n.resource.faultModal.ENABLE_PUSH}</button>
                                        <button type="button" class="btn btn-default btn-info" id="btnDisablePush">${I18n.resource.faultModal.DISABLE_PUSH}</button>
                                        <button type="button" class="btn btn-default btn-info" id="btnMailPush">${I18n.resource.faultModal.MAIL_PUSH}</button>
                                        <button type="button" class="btn btn-default btn-info" id="btnAppPush">${I18n.resource.faultModal.APP_PUSH}</button>
                                    </div>
                                    <div class="rightGroup">
                                        <button type="button" class="btn btn-default btn-info" data-dismiss="modal">${I18n.resource.faultModal.CANCEL}</button>
                                        <button type="button" class="btn btn-default btn-success"" data-dismiss="modal" id="btnSave">${I18n.resource.faultModal.OK}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div><!-- /.modal-content -->
                    </div><!-- /.modal-dialog -->
                    </div><!-- /.modal -->
            `;
            $('body').append(headHtml);
            this.$faultModal = $('#faultModal').modal({
                keyboard: true,
                show: false
            })
            this.attachEvent();
            this.initModalNav();
            this.initFaulttable();
        }
        show() {
            var _this = this;
            this.$faultModal.modal('show');
            this.$faultModal.on('shown.bs.modal', function (e) {
                _this.faulttable.show();
            })
        }
        close() {
        }
        attachEvent() {
            const _this = this;
            
        }
        initModalNav() {
            let dom = document.querySelector('#modal-nav');
            this.modalNav = new ModalNav(dom,this);
            this.modalNav.show();
        }
        initFaulttable() {
            let dom = document.querySelector('#modal-faulttable');
            this.faulttable = new FaultPanelTable(dom,this,this.callBack);
        }
    }
    exports.FaultModal = FaultModal;
} ( namespace('diagnosis.components'),namespace('diagnosis.Pages.nav.ModalNav'),namespace('diagnosis.components.FaultPanelTable') ));