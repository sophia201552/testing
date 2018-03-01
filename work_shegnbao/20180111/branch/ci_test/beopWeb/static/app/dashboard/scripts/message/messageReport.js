/**
 * Created by win7 on 2015/11/3.
 */
var MessageReport = (function(){
    var _this = this;
    function MessageReport(reportDate){
        _this = this;
        this.reportDate = reportDate;
    }
    MessageReport.navOptions = {
        top: '<div class="topNavTitle" i18n="appDashboard.message.MY_REPORT"></div>',
        bottom:true,
        backDisable:false,
        module:'message'
    };
    MessageReport.prototype = {
        reportTypeMap: {
            daily: '0',
            monthly: '1',
            weekly: '2'
        },

        reportSummaryShow:{
            'KPIReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            },
            'KPIMonthReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                },
                'report-unit-2':{
                    'page-header':true,
                    'report-unit-2-1':['well','summary','canvas-container']
                }
            },
            'CostReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            },
            'MonthPatternReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            },
            'CostMonthReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            },
            'DailyReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            },
            'RunReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            },
            'DiagnosisReport':{
                'report-unit-1':{
                    'page-header':true,
                    'report-unit-1-1':['well','summary','canvas-container']
                }
            }
        },
        reportIcon : {
            'KPI':'<svg x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                        <path class="svgpath" data-index="path_0" fill="#272636" d="M938.88 83.392 540.992 83.392 540.992 39.68C540.992 23.68 528 10.688 512 10.688c-16 0-28.928 12.992-28.928 28.992l0 43.712L85.12 83.392c-36.288 0-65.664 29.376-65.664 65.664l0 540.864c0 36.288 29.376 65.664 65.664 65.664l397.952 0 0 33.024-179.84 136.32c-12.736 9.664-15.232 27.84-5.568 40.576 9.664 12.736 27.84 15.232 40.576 5.568l144.896-109.76 0 41.92c0 16 12.992 28.928 28.928 28.928 16 0 28.992-12.992 28.992-28.928l0-41.92 144.896 109.76c5.248 3.968 11.392 5.888 17.472 5.888 8.768 0 17.408-3.968 23.104-11.456 9.664-12.736 7.168-30.912-5.568-40.576l-179.84-136.32 0-33.024 397.952 0c36.288 0 65.664-29.376 65.664-65.664L1004.736 149.056C1004.608 112.768 975.168 83.392 938.88 83.392L938.88 83.392zM946.688 689.92c0 4.288-3.456 7.744-7.744 7.744L85.12 697.664c-4.288 0-7.744-3.456-7.744-7.744L77.376 149.056c0-4.288 3.456-7.744 7.744-7.744L938.88 141.312c4.288 0 7.744 3.456 7.744 7.744L946.624 689.92 946.688 689.92zM817.152 314.688 606.208 485.312 383.104 333.888C372.096 326.4 357.376 327.424 347.456 336.32L169.216 496.768C157.376 507.456 156.352 525.76 167.104 537.664 177.792 549.568 196.096 550.528 208 539.84l161.344-145.216 222.144 150.72c4.928 3.328 10.624 4.992 16.256 4.992 6.464 0 12.928-2.176 18.24-6.464l227.648-184.128c12.416-10.048 14.336-28.288 4.288-40.704C847.872 306.56 829.632 304.64 817.152 314.688L817.152 314.688zM817.152 314.688" />\
                    </svg>',
            'Cost':'<svg x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                        <path class="svgpath" data-index="path_0" fill="#272636" d="M271.232 591.232l562.88 0 0 51.584L271.232 642.816 271.232 591.232 271.232 591.232 271.232 591.232zM271.232 591.232" />\
                        <path class="svgpath" data-index="path_1" fill="#272636" d="M269.888 789.184l562.88 0 1.28 55.36L271.232 844.544 269.888 789.184 269.888 789.184 269.888 789.184zM269.888 789.184" />\
                        <path class="svgpath" data-index="path_2" fill="#272636" d="M573.824 388.672l260.288 0 0 52.48L573.824 441.152 573.824 388.672 573.824 388.672 573.824 388.672zM573.824 388.672" />\
                        <path class="svgpath" data-index="path_3" fill="#272636" d="M629.76 186.048l204.352 0 0 53.44L629.76 239.488 629.76 186.048 629.76 186.048 629.76 186.048zM629.76 186.048" />\
                        <path class="svgpath" data-index="path_4" fill="#272636" d="M881.088 1006.592 198.208 1006.592c-44.992 0-81.536-38.4-81.536-85.504L116.672 102.912c0-47.104 36.544-85.504 81.536-85.504l682.88 0c44.992 0 81.536 38.4 81.536 85.504l0 818.112C962.624 968.192 926.016 1006.592 881.088 1006.592L881.088 1006.592 881.088 1006.592zM187.648 69.184c-9.216 0-16.96 9.664-16.96 21.056L170.688 933.76c0 11.456 7.808 21.056 16.96 21.056l704 0c9.216 0 16.96-9.664 16.96-21.056L908.608 90.24c0-11.456-7.808-21.056-16.96-21.056L187.648 69.184 187.648 69.184 187.648 69.184zM187.648 69.184" />\
                        <path class="svgpath" data-index="path_5" fill="#272636" d="M490.688 334.848C498.112 347.52 501.888 362.24 501.888 379.2c0 25.92-7.744 47.552-23.168 64.832-15.488 17.28-37.76 27.52-66.944 30.592l0 44.416L374.592 519.04 374.592 474.816c-48.576-4.992-78.72-33.28-90.304-84.736L341.76 375.04c5.312 32.384 22.912 48.576 52.864 48.576 14.016 0 24.32-3.456 30.912-10.432 6.592-6.976 9.92-15.296 9.92-25.088 0-10.176-3.328-17.856-9.92-23.04C419.008 359.808 404.288 353.216 381.568 345.152c-20.416-7.104-36.416-14.08-47.936-21.056C322.176 317.184 312.832 307.52 305.664 295.04 298.432 282.56 294.912 267.968 294.912 251.456c0-21.696 6.464-41.344 19.2-58.688C326.976 175.36 347.072 164.736 374.592 160.832L374.592 126.592l37.184 0 0 34.304c41.536 4.992 68.48 28.48 80.768 70.528L441.216 252.416c-9.984-28.8-25.344-43.264-46.336-43.264-10.496 0-18.88 3.2-25.216 9.664-6.4 6.464-9.6 14.272-9.6 23.424 0 9.344 3.072 16.512 9.216 21.504 6.144 4.992 19.2 11.2 39.36 18.496 22.016 8.064 39.424 15.744 51.904 22.848C473.152 312.32 483.136 322.24 490.688 334.848L490.688 334.848 490.688 334.848zM490.688 334.848" />\
                    </svg>',
            'Pattern':'<svg x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                            <path class="svgpath" data-index="path_0" fill="#272636" d="M211.776 531.328l0 240.192L91.712 771.52 91.712 531.328 211.776 531.328M211.776 471.296 91.712 471.296c-33.088 0-60.032 26.944-60.032 60.032l0 240.192c0 33.152 26.944 60.032 60.032 60.032l120.064 0c33.088 0 60.032-26.944 60.032-60.032L271.808 531.328C271.808 498.24 244.928 471.296 211.776 471.296L211.776 471.296 211.776 471.296zM211.776 471.296" />\
                            <path class="svgpath" data-index="path_1" fill="#272636" d="M572.032 111.04l0 660.48L451.968 771.52 451.968 111.04 572.032 111.04M572.032 51.008 451.968 51.008c-33.088 0-60.032 26.944-60.032 60.032l0 660.48c0 33.152 26.944 60.032 60.032 60.032l120.064 0c33.088 0 60.032-26.944 60.032-60.032L632.064 111.04C632.064 77.952 605.184 51.008 572.032 51.008L572.032 51.008 572.032 51.008zM572.032 51.008" />\
                            <path class="svgpath" data-index="path_2" fill="#272636" d="M932.288 291.2 932.288 291.2 932.288 291.2l0 480.32 0 0-120.064 0 0 0L812.224 291.2l0 0L932.288 291.2M932.288 231.168l-120.064 0c-33.152 0-60.032 26.944-60.032 60.032l0 480.32c0 33.152 26.944 60.032 60.032 60.032l120.064 0c33.088 0 60.032-26.944 60.032-60.032L992.32 291.2C992.32 258.048 965.44 231.168 932.288 231.168L932.288 231.168 932.288 231.168zM932.288 231.168" />\
                            <path class="svgpath" data-index="path_3" fill="#272636" d="M962.304 951.68 61.696 951.68c-16.576 0-30.016-13.44-30.016-30.016 0-16.576 13.44-30.016 30.016-30.016l900.672 0c16.576 0 30.016 13.44 30.016 30.016C992.32 938.24 978.944 951.68 962.304 951.68L962.304 951.68zM962.304 951.68" />\
                        </svg>',
            'Daily':'<svg x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                            <path class="svgpath" data-index="path_0" fill="#272636" d="M880.128 1000.704 123.072 1000.704c-18.816 0-34.112-15.296-34.112-34.112L88.96 73.6c0-18.816 15.296-34.112 34.112-34.112l757.056 0c18.816 0 34.112 15.296 34.112 34.112l0 893.056C914.176 985.472 898.944 1000.704 880.128 1000.704L880.128 1000.704zM157.184 932.544l688.832 0L846.016 107.712 157.184 107.712 157.184 932.544 157.184 932.544zM157.184 932.544" />\
                            <path class="svgpath" data-index="path_1" fill="#272636" d="M743.296 278.08 259.904 278.08c-18.816 0-34.112-15.296-34.112-34.112 0-18.816 15.296-34.112 34.112-34.112l483.392 0c18.816 0 34.112 15.296 34.112 34.112C777.408 262.848 762.112 278.08 743.296 278.08L743.296 278.08zM743.296 278.08" />\
                            <path class="svgpath" data-index="path_2" fill="#272636" d="M604.8 484.352 260.224 484.352c-18.816 0-34.112-15.232-34.112-34.112 0-18.816 15.232-34.112 34.112-34.112L604.8 416.128c18.816 0 34.112 15.296 34.112 34.112C638.912 469.056 623.616 484.352 604.8 484.352L604.8 484.352zM604.8 484.352" />\
                            <path class="svgpath" data-index="path_3" fill="#272636" d="M536 654.912 260.224 654.912c-18.816 0-34.112-15.296-34.112-34.112 0-18.816 15.232-34.112 34.112-34.112l275.712 0c18.816 0 34.112 15.232 34.112 34.112C570.048 639.616 554.816 654.912 536 654.912L536 654.912zM536 654.912" />\
                            <path class="svgpath" data-index="path_4" fill="#272636" d="M535.616 828.096 259.904 828.096c-18.816 0-34.112-15.232-34.112-34.112 0-18.816 15.296-34.112 34.112-34.112l275.712 0c18.816 0 34.112 15.232 34.112 34.112C569.728 812.864 554.432 828.096 535.616 828.096L535.616 828.096zM535.616 828.096" />\
                            <path class="svgpath" data-index="path_5" fill="#272636" d="M707.648 415.168l68.672 0 0 68.288-68.672 0L707.648 415.168 707.648 415.168zM707.648 415.168" />\
                            <path class="svgpath" data-index="path_6" fill="#272636" d="M707.648 587.776l68.672 0 0 68.288-68.672 0L707.648 587.776 707.648 587.776zM707.648 587.776" />\
                            <path class="svgpath" data-index="path_7" fill="#272636" d="M707.648 758.784l68.672 0 0 68.288-68.672 0L707.648 758.784 707.648 758.784zM707.648 758.784" />\
                        </svg>',
            'Run':'<svg x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                        <path class="svgpath" data-index="path_0" fill="#272636" d="M179.456 123.136c0 0-66.432-2.176-66.432 68.608l0 746.112c0 0-3.264 64.256 67.52 69.632l678.464 0c0 0 72.96 4.032 69.76-68.032l0-748.8c0 0 5.44-63.872-68.608-68.224l-145.216 0 0 59.008 132.736 0c0 0 22.144-1.792 21.824 17.408l0 731.328c0 0 1.472 18.88-15.232 18.88L187.008 949.056c0 0-17.088 0.704-16.512-17.472L170.496 201.728c0 0-1.6-21.056 17.984-20.736l137.408 0L325.888 122.88 179.456 123.136 179.456 123.136 179.456 123.136zM179.456 123.136" />\
                        <path class="svgpath" data-index="path_1" fill="#272636" d="M378.88 556.16c0 8.832-6.528 16.064-14.656 16.064l-27.52 0c-8.128 0-14.72-7.232-14.72-16.064L321.984 275.712c0-8.896 6.592-16.128 14.72-16.128l27.52 0c8.128 0 14.656 7.232 14.656 16.128L378.88 556.16 378.88 556.16 378.88 556.16zM378.88 556.16" />\
                        <path class="svgpath" data-index="path_2" fill="#272636" d="M547.456 550.016c0 8.64-6.272 15.744-14.016 15.744l-26.24 0c-7.744 0-14.016-7.04-14.016-15.744L493.184 275.328c0-8.704 6.272-15.808 14.016-15.808l26.24 0c7.744 0 14.016 7.04 14.016 15.808L547.456 550.016 547.456 550.016 547.456 550.016zM547.456 550.016" />\
                        <path class="svgpath" data-index="path_3" fill="#272636" d="M716.16 553.28c0 8.64-6.272 15.744-14.016 15.744l-26.24 0c-7.744 0-14.016-7.04-14.016-15.744L661.888 278.592c0-8.704 6.272-15.808 14.016-15.808l26.24 0c7.744 0 14.016 7.04 14.016 15.808L716.16 553.28 716.16 553.28 716.16 553.28zM716.16 553.28" />\
                        <path class="svgpath" data-index="path_4" fill="#272636" d="M724.288 707.648c0 7.744-7.808 14.016-17.408 14.016L334.208 721.664c-9.6 0-17.408-6.272-17.408-14.016l0-26.176c0-7.744 7.808-13.952 17.408-13.952l372.672 0c9.6 0 17.408 6.272 17.408 13.952L724.288 707.648 724.288 707.648 724.288 707.648zM724.288 707.648" />\
                        <path class="svgpath" data-index="path_5" fill="#272636" d="M724.288 842.432c0 7.36-7.808 13.376-17.408 13.376L334.208 855.808c-9.6 0-17.408-5.952-17.408-13.376l0-25.088c0-7.36 7.808-13.376 17.408-13.376l372.672 0c9.6 0 17.408 5.952 17.408 13.376L724.288 842.432 724.288 842.432 724.288 842.432zM724.288 842.432" />\
                        <path class="svgpath" data-index="path_6" fill="#272636" d="M647.488 122.432 567.616 35.648C543.04 14.144 519.68 16.512 519.68 16.512 490.816 14.976 471.488 35.328 471.488 35.328L392.704 122.432 316.48 122.88l0 58.176 408.384 0.448-0.256-59.008L647.488 122.496 647.488 122.432 647.488 122.432zM462.272 122.432l47.36-55.488C520.192 53.76 530.944 66.368 530.944 66.368l45.888 56.064L462.272 122.432 462.272 122.432 462.272 122.432zM462.272 122.432" />\
                    </svg>',
            'Diagnosis':'<svg x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                            <path class="svgpath" data-index="path_0" fill="#272636" d="M316.864 681.728c41.984 0 75.968-32 75.968-71.424 0-14.336-4.544-27.776-12.352-38.912L462.208 443.52C464.384 443.712 466.56 443.84 468.864 443.84c2.24 0 4.416-0.128 6.656-0.32l81.664 127.872C549.312 582.592 544.768 595.968 544.768 610.304c0 39.424 34.048 71.424 75.968 71.424 41.984 0 75.968-32 75.968-71.424 0-14.912-4.864-28.736-13.184-40.192l134.784-221.632c1.664 0.128 3.392 0.192 4.992 0.192 41.984 0 75.968-31.936 75.968-71.36 0-39.424-34.048-71.424-75.968-71.424-41.92 0-75.968 32-75.968 71.424 0 14.976 4.864 28.736 13.248 40.192L625.792 539.136C624.128 539.008 622.464 538.944 620.8 538.944c-2.24 0-4.416 0.128-6.656 0.32L532.48 411.392c7.808-11.2 12.352-24.576 12.352-38.976 0-39.424-33.984-71.36-75.968-71.36-41.984 0-75.968 31.936-75.968 71.36 0 14.4 4.544 27.776 12.352 38.976L323.52 539.264C321.344 539.072 319.104 538.944 316.864 538.944c-41.92 0-75.968 31.936-75.968 71.36S274.944 681.728 316.864 681.728L316.864 681.728zM936.448 901.824 93.952 901.824 93.952 59.328c0-20.224-16.384-36.608-36.608-36.608-20.224 0-36.608 16.384-36.608 36.608l0 879.104c0 20.224 16.384 36.608 36.608 36.608l879.104 0c20.224 0 36.608-16.384 36.608-36.608C973.056 918.208 956.672 901.824 936.448 901.824L936.448 901.824zM936.448 901.824" />\
                        </svg> ',
            'Month':'<svg x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">\
                        <path class="svgpath" data-index="path_0" fill="#272636" d="M246.912 727.04c26.56 20.544 56.512 30.848 89.984 30.848 26.752 0 47.872-6.528 63.488-19.648 15.616-13.12 23.424-30.72 23.424-52.736 0-49.088-35.136-73.664-105.472-73.664L286.016 611.84 286.016 571.2 316.8 571.2c62.272 0 93.44-23.04 93.44-69.184 0-42.624-23.808-63.872-71.424-63.872-27.2 0-52.864 9.216-76.928 27.584L261.888 419.392c25.408-14.72 55.04-22.08 88.96-22.08 33.088 0 59.648 8.64 79.68 25.92 20.032 17.28 30.08 39.744 30.08 67.264 0 50.752-25.92 83.456-77.696 97.984l0 1.024c28.032 3.008 50.24 12.928 66.496 29.696 16.256 16.768 24.448 37.696 24.448 62.784 0 34.944-12.544 63.04-37.696 84.416-25.152 21.376-58.624 32.064-100.352 32.064-36.736 0-66.432-6.848-88.96-20.544L246.912 727.04 246.912 727.04zM246.912 727.04" />\
                        <path class="svgpath" data-index="path_1" fill="#272636" d="M534.784 605.504c0-68.48 11.328-120.32 34.048-155.456s55.616-52.736 98.752-52.736c82.176 0 123.264 66.304 123.264 198.976 0 65.472-11.584 115.584-34.688 150.208-23.168 34.688-55.616 51.968-97.344 51.968-39.424 0-69.952-16.448-91.584-49.344C545.6 716.224 534.784 668.352 534.784 605.504L534.784 605.504zM584.896 603.264c0 103.04 26.112 154.624 78.4 154.624 51.456 0 77.184-52.352 77.184-157.12 0-108.416-25.216-162.624-75.648-162.624C611.584 438.144 584.896 493.184 584.896 603.264L584.896 603.264zM584.896 603.264" />\
                        <path class="svgpath" data-index="path_2" fill="#272636" d="M831.744 81.664c-17.92 0-32.512-14.656-32.512-32.512L799.232 42.496c0-17.92-14.656-32.512-32.512-32.512l-6.656 0c-17.92 0-32.512 14.656-32.512 32.512l0 6.656c0 17.92-14.656 32.512-32.512 32.512L329.344 81.664c-17.92 0-32.512-14.656-32.512-32.512L296.832 42.496c0-17.92-14.656-32.512-32.512-32.512L257.6 9.984c-17.92 0-32.512 14.656-32.512 32.512l0 6.656c0 17.92-14.656 32.512-32.512 32.512L42.432 81.664c-17.92 0-32.512 14.656-32.512 32.512l0 867.328c0 17.92 14.656 32.512 32.512 32.512l939.072 0c17.856 0 32.512-14.656 32.512-32.512L1014.016 114.176c0-17.856-14.656-32.512-32.512-32.512L831.744 81.664 831.744 81.664zM942.4 909.824c0 17.856-14.656 32.512-32.512 32.512L114.176 942.336c-17.92 0-32.512-14.656-32.512-32.512L81.664 185.92c0-17.92 14.656-32.512 32.512-32.512l78.4 0c17.92 0 32.512 14.656 32.512 32.512L225.088 227.2c0 17.92 14.656 32.512 32.512 32.512L264.32 259.712c17.92 0 32.512-14.656 32.512-32.512L296.832 185.92c0-17.92 14.656-32.512 32.512-32.512l365.568 0c17.92 0 32.512 14.656 32.512 32.512L727.424 227.2c0 17.92 14.656 32.512 32.512 32.512l6.656 0c17.92 0 32.512-14.656 32.512-32.512L799.104 185.92c0-17.92 14.656-32.512 32.512-32.512l78.08 0c17.92 0 32.512 14.656 32.512 32.512L942.4 909.824 942.4 909.824zM942.4 909.824" />\
                    </svg>'
        },
        reportSummaryTemplate:'\
        <div style="width: 100%; height: 100%; overflow-x: hidden; overflow-y: hidden;" id="beopReport">\
            <link rel="stylesheet" href="/static/projectReports/report.css"/>\
            <div class="step-container col-xs-12 col-md-8 col-md-offset-2 report-block gray-scrollbar">\
                <div class="step-play-container">\
                    <div class="step-play-list">\
                    </div>\
                </div>\
            </div>\
        </div>',
        show:function(){
            $.ajax({url:'static/app/dashboard/views/message/messageReport.html'}).done(function(resultHTML){
                $(ElScreenContainer).html(resultHTML);
                _this.init();
                I18n.fillArea($('#navTop'));
            });
        },
        init:function(){
            _this.initReportList();
        },
        initReportList:function(){
            var $container = $('#containerMessageReport');
            var num = 0;
            //var strReportType = '';
            ProjectConfig.reportList.forEach(function(val,i){
                var version = _this.getReportVersion(val);
                var reportFolder = val.reportFolder;
                var reportSummaryIndex = _this.reportSummaryShow[reportFolder];
                var strPanelReport = new StringBuilder();
                var icon = _this.initReportIcon(reportFolder);
                strPanelReport.append('<div class="panel panel-primary panel' + reportFolder + '">');
                strPanelReport.append('    <div class="panel-heading" role="tab" id="reportTitle_' + i + '"> ');
                strPanelReport.append('        <div class="divIcon">');
                strPanelReport.append('<span class="spMainIcon">' + icon.main + '</span>');
                if(icon.add != ''){
                    strPanelReport.append('<span class="spAddIcon">' + _this.initReportIcon(reportFolder).add + '</span>');
                }
                strPanelReport.append('        </div>');
                strPanelReport.append('        <h4 class="panel-title">');
                strPanelReport.append('            <a class="aCollapse collapsed" role="button" data-toggle="collapse" data-parent="#containerMessageReport" href="#divReport_'+ i +'" aria-expanded="false" aria-controls="divReport_' + i + '">');
                strPanelReport.append('                <span class="reportType">' + val.text + '</span>');
                strPanelReport.append('                <span class="reportTime">' + version +'</span>');
                //strPanelReport.append('                <span class="reportDetail" data-detail='+ val._id+'>more</span>');
                //strPanelReport.append('                <span class="collapseArrow glyphicon glyphicon-chevron-up" aria-hidden="true"></span>');
                //strPanelReport.append('                <span class="collapseArrow glyphicon glyphicon-chevron-down" aria-hidden="true"></span>');
                strPanelReport.append('            </a>');
                strPanelReport.append('        </h4>');
                strPanelReport.append('    </div>');
                strPanelReport.append('    <div id="divReport_'+ i + '" class="panel-collapse collapse div' + reportFolder + '" role="tabpanel" aria-labelledby="reportTitle_'+ i +'">');
                strPanelReport.append('        <div class="panel-body" id="' + val.id + '">');
                strPanelReport.append('        </div>');
                strPanelReport.append('        <div class="btnDetail zepto-ev additionText" report-to="' + val.id + '">' + I18n.resource.appDashboard.message.MORE);
                strPanelReport.append('        </div>');
                strPanelReport.append('    </div>');
                strPanelReport.append('</div>');
                $container.append(strPanelReport.toString());
                //if (strReportType.indexOf(val.text) == -1)$container.append(strPanelReport.toString());
                //strReportType = strReportType + val.text;
                SpinnerControl.show();
                WebAPI.get('/report/getReport/' + ProjectConfig.projectInfo.name_en + '/' + reportFolder + '/' + version).done(function (result) {
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = result;
                    var subUnit;
                    var strReportContent = new StringBuilder();
                    strReportContent.append('<div style="width: 100%; height: 100%; overflow-x: hidden; overflow-y: hidden;" id="beopReport">\
                                                <div class="step-container col-xs-12 col-md-8 col-md-offset-2 report-block gray-scrollbar">\
                                                    <div class="step-play-container">\
                                                        <div class="step-play-list">');
                    for (var k in reportSummaryIndex) {
                        strReportContent.append('               <div class="step-item-container" id="' + k + '">');
                        for(var l in reportSummaryIndex[k]){
                            if(l == 'page-header') {
                                strReportContent.append(tempDiv.querySelector('#' + k + '>.' + l).outerHTML);
                            }else{
                                strReportContent.append('<div class="report-unit" id="' + l + '">');
                                for (var m = 0 ; m < reportSummaryIndex[k][l].length ; m ++) {
                                    subUnit = tempDiv.querySelector('#' + k + '>#' + l + '>.' + reportSummaryIndex[k][l][m]);
                                    if(!subUnit)continue;
                                    strReportContent.append(subUnit.outerHTML);
                                }
                                strReportContent.append('</div>');
                            }
                        }
                        strReportContent.append('               </div>');
                    }
                    strReportContent.append('           </div>');
                    strReportContent.append('       </div>');
                    strReportContent.append('   </div>');
                    strReportContent.append('</div>');
                    //for(var k = 0 ; k < _this.reportSummaryShow[reportFolder].unit.length; k++){
                    //    tempDiv = document.createElement('div');
                    //    tempDiv.innerHTML = result;
                    //    tempDiv.querySelector();
                    //    $('#' + val._id).append($(result).find(_this.reportSummaryShow[reportFolder].unit[k]));
                    //}
                    $('#' + val.id).append(strReportContent.toString()).append(tempDiv.querySelector('#tmpl_table'));
                    if (num == ProjectConfig.reportList.length - 1) {
                        var $reportUnit = $('#beopReport .report-unit');
                        $reportUnit.find('.canvas-container').css({
                            height: '300px',
                            width: ($(ElScreenContainer).width() - 60) + 'px'
                        });
                        _this.reportScreen = new ReportScreen();
                        _this.reportScreen.renderCharts($reportUnit);
                        var $table = $('table');
                        for(var  n= 0 ;n < $table.length; n++){
                            $table.eq(n).removeClass('table-striped');
                            $table[n].outerHTML = '<div class="tableContainer">' + $table[n].outerHTML + '</div>'
                        }
                        _this.initReportDetail();
                    }
                    num += 1;
                }).always(function () {
                    SpinnerControl.hide();
                });
            })
        },
        initReportDetail:function(){
            var btnReportDetail = $('.panel-collapse .btnDetail');
            var strReportTime;
            btnReportDetail.off('tap').on('tap',function(e){
                e.preventDefault();
                e.stopPropagation();
                strReportTime = $(e.currentTarget).parentsUntil('#containerMessageReport','.panel').find('.reportTime').html();
                                        
                for (var i = 0;i<ProjectConfig.reportList.length; i++){
                    if(ProjectConfig.reportList[i].id == $(e.currentTarget).attr('report-to')) {
                        ProjectConfig.reportIndex = i;
                        ProjectConfig.reportDetail = ProjectConfig.reportList[i];
                        router.to({
                            typeClass: ProjectReport,
                            data:{
                            }
                        });
                        break;
                    }
                }
            })
        },
        getReportVersion:function(reportInfo){
            var thisDay,version;
            var reportType = reportInfo.reportType;
            var year,month,day;
            //this.reportDate = '2015-12-10';
            if (ProjectConfig.reportDate && new Date(ProjectConfig.reportDate) != 'Invalid Date'){
                //year = this.reportDate.split('-')[0];
                //month = this.reportDate.split('-')[1];
                //day = this.reportDate.split('-')[2];
                thisDay = new Date(ProjectConfig.reportDate);
            }else {
                thisDay = new Date();
            }
            if (reportType === this.reportTypeMap.daily) {
                if (!month || !year || !day) {
                    //thisDay = new Date();
                    if(thisDay.format('yyyy/MM/dd') == new Date().format('yyyy/MM/dd')){
                        thisDay.setDate(thisDay.getDate() - 1);
                    }
                    version = thisDay.format('yyyy-MM-dd');
                    year = thisDay.getFullYear();
                    month = thisDay.getMonth() + 1;
                    day = thisDay.getDate();
                } else {
                    version = year + "-" + StringUtil.padLeft(month, 2, '0') + "-" + StringUtil.padLeft(day, 2, '0');
                }
            }
            else if (reportType === this.reportTypeMap.monthly) {
                if (!month || !year) {
                    //thisDay = new Date();
                    if(thisDay.format('yyyy/MM') == new Date().format('yyyy/MM')){
                        thisDay.setMonth(thisDay.getMonth() - 1);
                    }
                    year = thisDay.getFullYear();
                    month = thisDay.getMonth() + 1;
                }
                version = year + '-' + StringUtil.padLeft(month, 2, '0');
                //TODO 添加周视图请求处理
            } else {
                //thisDay = new Date();
                year = thisDay.getFullYear();
                month = month ? month : (_this.iso8601Week(new Date(year, thisDay.getMonth() - 1)));
                version = year + '-' + month + '-w';
            }
            return version;
        },
        initReportIcon:function(reportType){
            var icon = {
                main:'',
                add:''
            };
            if(reportType.indexOf('KPI') > -1){
                icon.main=_this.reportIcon['KPI'];
            }else if(reportType.indexOf('Cost') > -1){
                icon.main=_this.reportIcon['Cost'];
            }else if(reportType.indexOf('Pattern') > -1){
                icon.main=_this.reportIcon['Pattern'];
            }else if(reportType.indexOf('Daily') > -1){
                icon.main=_this.reportIcon['Daily'];
            }else if(reportType.indexOf('Run') > -1){
                icon.main=_this.reportIcon['Run'];
            }else if(reportType.indexOf('Diagnosis') > -1){
                icon.main=_this.reportIcon['Diagnosis'];
            }
            //if(reportType.indexOf('Month') > -1){
            //    icon.add = _this.reportIcon['Month']
            //}
            return icon
        },
        iso8601Week: function (date) {
            var time,
                checkDate = new Date(date.getTime());

            // Find Thursday of this week starting on Monday
            checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

            time = checkDate.getTime();
            checkDate.setMonth(0); // Compare with Jan 1
            checkDate.setDate(1);
            return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },
        close:function(){

        }
    };
    return MessageReport;
})();