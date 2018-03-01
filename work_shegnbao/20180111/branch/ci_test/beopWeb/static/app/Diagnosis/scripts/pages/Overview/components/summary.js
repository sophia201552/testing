(function (exports, Base) {
    const DEFAULT_OPTIONS = {
    }

    class Summary extends Base {
        constructor(container, options=DEFAULT_OPTIONS) {
            if (options !== DEFAULT_OPTIONS) {
                options = Object.assign({}, DEFAULT_OPTIONS, options);
            }
            super(container, options);
        }
        show() {
            let $thisContainer = $(this.container);
            let $summaryContent = $thisContainer.find('.summaryContent');
            var dom=`<div class="summaryBox BlackBox clickShadow">
                    <div class="summaryTitle">
                        <span>${I18n.resource.overview.FAULT_SUMMARY}</span>
                    </div>
                    <div class="summaryContent">
                        <div class="summaryFirst">
                            <div class="summaryTitleSmart">
                               <div class="summaryTitleDot"></div>
                                <span class="summaryTitleName">${I18n.resource.overview.ASSOCIATED_FACTORS}</span>
                            </div>
                            <div class="summaryPanel">
                                <div class="summaryPanelLeft">
                                    <div class="summaryPanelName">
                                        Weather
                                    </div>
                                </div>
                                <div class="summaryPanelRight">
                                    <div class="summaryPanelBar">
                                        <div class="progressNew" style="width: 100%">
                                            <span class=" summaryProgressBar" style="width: 70%"></span>
                                        </div>
                                    </div>
                                    <div class="summaryPanelTip" title="High outdoor dry-bulb temperature ,increasing Chillers'enery use by 262kWh">
                                    High outdoor dry-bulb temperature ,increasing Chillers'enery use by 262kWh
                                        </div>
                                </div>
                            </div>
                            <div class="summaryPanel">
                                <div class="summaryPanelLeft">
                                    <div class="summaryPanelName" title="Number of PACHWP">
                                        Number of PACHWP
                                    </div>
                                </div>
                                <div class="summaryPanelRight">
                                    <div class="summaryPanelBar">
                                        <div class="progressNew" style="width: 100%">
                                            <span class=" summaryProgressBar" style="width: 30%"></span>
                                        </div>
                                    </div>
                                    <div class="summaryPanelTip" title="9:25 - 20:10 additional use of PCHWP on tower 1, increasing electricity use by 845kWh">
                                    9:25 - 20:10 additional use of PCHWP on tower 1, increasing electricity use by 845kWh
                                     </div>
                                </div>
                            </div>
                        </div>
                        <div class="summarySecond">
                            <div class="summaryTitleSmart">
                                <div class="summaryTitleDot"></div>
                                <span class="summaryTitleName">${I18n.resource.overview.ASSOCIATED_FAULT}</span>
                            </div>
                            <div class="summaryTable">
                                <div class="summaryTableBot"></div>
                                <div class="summaryTableName">
                                    <div class="summaryTableMain" title="Cluster 3 hearse air-cooling mechanism">Cluster 3 hearse air-cooling mechanism</div>
                                    <div class="summaryTableRight" title="Air conditioning room">Air conditioning room</div>
                                    <div class="summaryTableWarn">
                                        <span class="summaryTableWarnName" title="Group of building">Group of building</span>
                                        <span class="summaryTableWarnNum" title="50kWh">50kWh</span>
                                    </div>
                                </div>
                            </div>
                            <div class="summaryTable">
                                <div class="summaryTableBot"></div>
                                <div class="summaryTableName">
                                    <div class="summaryTableMain">air</div>
                                    <div class="summaryTableRight" title="Air conditioning room">Air conditioning room</div>
                                    <div class="summaryTableWarn">
                                        <span class="summaryTableWarnName" title="Group of building">Group of building</span>
                                        <span class="summaryTableWarnNum" title="50kWh">50kWh</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>`
            $thisContainer.html(dom)
        }
        update(condition) {

        }
        close() {

        }
    }

    exports.Summary = Summary;
} (
    namespace('diagnosis.components'),
    namespace('diagnosis.components.Base')
));
