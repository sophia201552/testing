class EnergyReport{
    constructor(screen,container){
        this.screen = screen;
        this.container = container;
    }
    show(){
        // this.screen.backBtnToggle();
        $('#btnPanelNavToggle').show().trigger('click')
        WebAPI.get('/static/app/EnergyManagement/views/module/energyReport.html').done(result=>{
            this.container.innerHTML = result;
            var iframe = document.createElement('iframe');
            // iframe.src = location.origin + '/factory/preview/report/14993157160560657e01c32b/4'
            var reportIndex = 5
            var reportId = '14997580202450737531fef7';
            var src = '';
            var response = '';
            if(location.hash && location.hash.indexOf('reportId=')> - 1){
                reportId = location.hash.slice('&&')
                try {
                    var reg = /reportId=(\w+)/g
                    var resReg = /response=(\d+)/g
                    reportId = location.hash.match(reg)[0].split('reportId=')[1]
                    response = location.hash.match(resReg)[0]
                }catch(e){}
            } 
            //iframe.src = location.origin + '/observer#page=FacReportWrapScreen&options=%7B%22id%22%3A%221497509306911001297f016e%22%7D&container=%22indexMain%22&projectId=575&response='+reportIndex;
            src = location.origin + '/factory/preview/reportWrap/'+ reportId +'/0';
            if (response){
                src += ('#'+response);
            }
            iframe.src = src;
            this.container.appendChild(iframe);
            Spinner.spin(this.container);
            iframe.onload = function(){
                var style = document.createElement('style');
                style.innerHTML = `
                    body>.nav{
                        display:none;
                    }
                    #pageContainer {
                        top:0 !important;
                    }
                    .report, .report-ob {
                        background-color:white;
                    }
                    .report-container:first-of-type h1{
                        margin-top:0;
                    }

                    #navHeader{
                        display:none;
                    }
                    #indexMain{
                        top:0px !important;
                    }
                    /*
                    .reportListName {
                        display:none;
                    }
                    .reportListName:nth-child(${reportIndex - 1}) {
                        display:list-item;
                    }
                    */
                    .datetimepicker{
                        color:white;
                    }
                    .datetimepicker table tr td span:hover{
                        color:black;
                    }
                `
                iframe.contentDocument.body.appendChild(style)
                Spinner.stop();
            }
        })
    }
    close(){
        $('#btnPanelNavToggle').hide()
        if(ElScreenContainer.classList.contains('hideNav')){
            ElScreenContainer.classList.remove('hideNav')
        }
    }
}