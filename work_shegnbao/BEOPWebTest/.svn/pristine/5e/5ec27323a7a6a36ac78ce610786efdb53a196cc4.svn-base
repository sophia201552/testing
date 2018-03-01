var UpdateHelper = (function () {
    function UpdateHelper(name, version, callback) {
        this.curVersion = version;
        this.callback = callback;
        this.name = name;
        this.$modal = undefined;
        this.init();
    }

    UpdateHelper.prototype = {
        //dictApp: {
        //    APP_DASHBOARD: 'dashboard',
        //    APP_TEMPERATURE_CONTROLLER: 'temperature',
        //    APP_PATROL: 'patrol',
        //    APP_INPUT: 'input'
        //},
        modalTpl : '\
        <div id="ctnUpdateHelper" style="position: fixed;z-index: 1004;\
        background: white;border-radius: 0.5rem;border: 1px solid #ccc;\
        top: 20%;width: 24rem;left: calc(50% - 12rem);padding: 1rem;">\
            <div id="divHelperDesc" style="margin-bottom: 2rem;font-size: 1.6rem;"></div>\
            <div id="divHelperCurVer" style="text-align: right;font-size: 1rem;color: #969696;"></div>\
            <div id="divHelperLastVer" style="text-align: right;font-size: 1rem;color: #969696;"></div>\
            <div id="divHelperTime" style="margin-bottom: 0.6rem;text-align: right;font-size: 1rem;color: #969696;"></div>\
            <div id="divHelperFooter" style="text-align: right;border-top: 1px solid #ccc;padding-top: 1rem;">\
                <button id="btnUpdateOk" class="btn btn-primary zepto-ev" style="padding: 6px 12px;"><%Upgrade%></button>\
                <button id="btnUpdateCancel" class="btn btn-default zepto-ev" style="padding: 6px 12px;"><%Cancel%></button>\
                <button id="btnUpdateIgnore" class="btn btn-default zepto-ev" style="padding: 6px 12px;"><%Ignore%></button>\
            </div>\
        </div>\
        <div class="backdrop zepto-ev" style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;\
        background-color: rgba(100,100,100,0.3);z-index: 1003;"></div>',

        init: function () {
            var _this = this;
            var ignoreVersion = localStorage.getItem('ignoreVersion');
            try {
                if(ignoreVersion)ignoreVersion = JSON.parse(ignoreVersion);
            }catch(e){
                ignoreVersion = undefined;
            }
            WebAPI.get('/appCommon/getVersion/' + this.name + '/' + this.curVersion).done(function (result) {
                if (!result || result.isLast|| !result.version)return;
                _this.judgeWhetherNeedToUpdate(result,ignoreVersion);
            }).always(function () {
                _this.callback();
            });
        },

        getLastVersion:function(){
            WebAPI.get('/appCommon/getVersion/' + this.name + '/' + this.curVersion).done(function (result) {
                if (!result || result.isLast|| !result.version){
                    infoBox.alert(AppConfig.language == 'zh' ? '已经是最新版本':'This is the latest version.');
                    return;
                }
                infoBox.confirm(AppConfig.language == 'zh' ? '检查到有新版本，是否更新？':'A new version exists，need upgrade？',function(){
                    if(result.url.indexOf('http')> -1) {
                        window.open(result.url);
                    }else{
                        window.open('http://' + result.url);
                    }
                })
            }).always(function () {
            });
        },

        judgeWhetherNeedToUpdate: function (result,dictIgnore) {
            var name = this.name;
            if (dictIgnore && dictIgnore[this.name]){
                if (dictIgnore[name].version == result.version && dictIgnore[name].name == name)return;
            }
            if(result > this.curVersion){
                this.showUpdateModel(result,dictIgnore);
            }
        },

        showUpdateModel: function (result,dictIgnore) {
            var html= this.modalTpl;
            var strUpgradeTime,strCurVer,strLastVer;
            if(AppConfig && AppConfig.language == 'zh'){
                html = html.replace(/<%Upgrade%>/g,'更新');
                html = html.replace(/<%Cancel%>/g,'取消');
                html = html.replace(/<%Ignore%>/g,'忽略');
                strUpgradeTime = '更新时间：';
                strCurVer = '当前版本：';
                strLastVer = '最新版本：'
            }else{
                html = html.replace(/<%Upgrade%>/g,'Upgrade');
                html = html.replace(/<%Cancel%>/g,'Cancel');
                html = html.replace(/<%Ignore%>/g,'Ignore');
                strUpgradeTime = 'Upgrade Time:';
                strCurVer = 'Current Version:';
                strLastVer = 'Last Version:'
            }
            this.$modal = $(html);
            this.$modal.find('#divHelperDesc').html(result.detail);
            this.$modal.find('#divHelperTime').text(strUpgradeTime + new Date(result.time.replace(/-/g,'/')).format('yyyy-MM-dd'));
            this.$modal.find('#divHelperCurVer').text(strCurVer + this.curVersion);
            this.$modal.find('#divHelperLastVer').text(strLastVer + result.version);
            this.$modal.appendTo('body');
            this.attachEvent(result,dictIgnore);
        },

        attachEvent:function(result,dictIgnore){
            var _this = this;
            this.$modal.find('#btnUpdateOk').off('tap').on('tap',function(){
                if(result.url.indexOf('http')> -1) {
                    window.open(result.url);
                }else{
                    window.open('http://' + result.url);
                }
                _this.close();
            });
            this.$modal.find('#btnUpdateCancel').off('tap').on('tap',function(){
                _this.close();
            });
            this.$modal.find('#btnUpdateIgnore').off('tap').on('tap',function(){
                var ignoreVersion = {
                    name:_this.name,
                    version:result.version
                };
                if (!dictIgnore) dictIgnore = {};
                dictIgnore[_this.name] = ignoreVersion;
                localStorage.setItem('ignoreVersion',JSON.stringify(dictIgnore));
                _this.close();
            });
            this.$modal[2] && $(this.$modal[2]).off('tap').on('tap',function(){
                _this.close();
            })
        },

        close:function(){
            this.$modal.remove();
            this.$modal= null;
        }
    };

    return UpdateHelper;
})();