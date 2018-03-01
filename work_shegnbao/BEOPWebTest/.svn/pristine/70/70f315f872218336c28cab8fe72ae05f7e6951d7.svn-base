/**
 * Created by win7 on 2016/3/9.
 */
var SelectPage = (function(){
    var _this;
    function SelectPage(data){
        _this = this;
        _this.ctn = data.ctn;
        _this.type = data.type;
        _this.mode = data.mode?data.mode:'radio';
        _this.list = data.list;
        _this.screen = data.screen;
        _this.callBack = data.callBack;
        _this.selectList = data.selectList;
        _this.$ctnSel = undefined;
        _this.$ctnResult = undefined;
        _this.$ctnTopNav = undefined;
    }
    SelectPage.prototype = {
        show:function(){
            $.ajax({url:'static/app/dashboard/views/core/selectPage.html'}).done(function(resultHTML){
                _this.ctn.innerHTML = resultHTML;
                $(_this.ctn).show();
                $('#ctnSubSelMain').css({'height':'-webkit-calc(' + BomConfig.height + ' - ' + BomConfig.topHeight +' - ' + BomConfig.statusHeight +')','top':BomConfig.statusHeight});
                _this.$ctnSel = $('#ctnSubSelContent').css('height','-webkit-calc(100% - ' + BomConfig.bottomHeight +')');
                _this.$ctnResult = $('#ctnSubSelRs').css('height',BomConfig.bottomHeight);
                _this.$ctnTopNav = $('#ctnSubSelTopNav').css('top',BomConfig.statusHeight);
                _this.init();
                $('#navTop').hide();
                $('#navBottom').hide();
                $('#topBlank').hide();
                $('#bottomBlank').hide();
                $(ElScreenContainer).css('height','-webkit-calc(' + BomConfig.height + ' - ' + BomConfig.statusHeight +')')
            })
        },
        setCallBack:function(func){
            _this.callBack = func
        },
        setList:function(list){
            _this.list = list
        },
        init:function(){
            switch (_this.type){
                case 'user':
                    _this.initUserList();
                    break;
                default :
                    break;
            }
            _this.initTopNav();
            _this.initSelToggle();
            _this.initCallback();
            _this.initResult();
        },
        initTopNav:function(){
            _this.$ctnTopNav.css('height',BomConfig.topHeight);
            _this.initSearch();
            var btnSure = document.createElement('span');
            btnSure.textContent = '确认';
            btnSure.id = 'btnTopSure';
            btnSure.className = 'topNavRight zepto-ev';
            _this.$ctnTopNav.append(btnSure);

            $('#btnSubBack').on('tap',function(){
                _this.close();
            })
            document.removeEventListener("backbutton", router.back, false);
            document.addEventListener("backbutton", _this.close, false)
        },
        initUserList:function(){
            var divUser,spTitle,img,spSelClk;
            for (var i = 0 ; i < _this.list.length ; i++) {
                divUser = document.createElement('div');
                divUser.className = 'divUser divSelUnit zepto-ev';
                divUser.id = _this.list[i].id;
                divUser.dataset.index = i;

                img = document.createElement('img');
                img.className = "imgSel";
                img.src = _this.list[i].userpic;

                spTitle = document.createElement('span');
                spTitle.className = 'spTitle';
                spTitle.textContent = _this.list[i].userfullname;

                spSelClk = document.createElement('span');
                spSelClk.className = 'glyphicon glyphicon-ok-sign spSelClk';

                divUser.appendChild(img);
                divUser.appendChild(document.createElement('br'));
                divUser.appendChild(spTitle);
                divUser.appendChild(spSelClk);
                _this.$ctnSel.append(divUser);
            }
            if (_this.selectList){
                for (var i = 0; i < _this.selectList.length ;i++){
                    document.getElementById(_this.selectList[i].id).className += ' selected';
                }
            }
        },

        initSelToggle:function(){
            if (_this.selectList){
                for (var i = 0; i < _this.selectList.length ;i++){
                    _this.insertResult(_this.selectList[i].index);
                }
            }
            _this.$ctnSel.on('tap','.divSelUnit',function(e){
                var index;
                if ($(e.currentTarget).hasClass('selected')){
                    $(e.currentTarget).removeClass('selected');
                    _this.removeResult(e.currentTarget.dataset.index);
                }else{
                    if (_this.mode == 'radio'){
                        _this.$ctnSel.find('.selected').removeClass('selected');
                    }
                    $(e.currentTarget).addClass('selected');
                    _this.removeResult(e.currentTarget.dataset.index);
                    _this.insertResult(e.currentTarget.dataset.index);

                }
            })
        },
        initSearch:function(){
            var spSearch = document.createElement('span');
            spSearch.className = 'topNavInput';
            spSearch.id = 'spTopSearch';
            var label = document.createElement('label');
            label.style.display = 'none';
            var iptSearch = document.createElement('input');
            iptSearch.id = 'iptTopSearch';
            spSearch.appendChild(label);
            spSearch.appendChild(iptSearch);
            _this.$ctnTopNav.append(spSearch);
            var $divSelUnit = $('.divSelUnit ');
            $(iptSearch).on('input propertychange',function(e){
                if (e.target.value == ''){
                    $divSelUnit.show()
                }else {
                    $divSelUnit.hide();
                    for (var i = 0 ; i < $divSelUnit.length ;i++){
                        if (_this.list[$divSelUnit[i].dataset.index].userfullname.indexOf(e.target.value) >= 0){
                            $divSelUnit.eq(i).show();
                        }
                    }
                }
            })
        },
        initCallback:function(){
            $('#btnTopSure').on('tap',function(){
                var result = [];
                var $divSelect = _this.$ctnResult.find('.divSelTip');
                for (var i = 0; i < $divSelect.length; i++){
                    result.push(_this.list[$divSelect[i].dataset.index])
                }
                if (_this.callBack instanceof Function){
                    _this.callBack.call(_this.screen,result)
                }
                _this.close();
            })
        },
        initResult:function(){
            _this.$ctnResult.on('tap','.divSelTip',function(e){
                $('#' + e.currentTarget.dataset.id).removeClass('selected');
                $(e.currentTarget).remove();
            })
        },
        insertResult:function(index){
            var text,id;
            switch (_this.type){
                case 'user':
                    text = _this.list[index].userfullname;
                    id = _this.list[index].id;
                    break;
                default :
                    break;
            }
            var divTip = document.createElement('div');
            divTip.textContent = text;
            divTip.id='divTip_' + id;
            divTip.className = 'divSelTip zepto-ev';
            divTip.dataset.index = index;
            divTip.dataset.id = id;
            _this.$ctnResult.append(divTip);
        },
        removeResult:function(index){
            if (_this.mode == 'radio'){
                $('.divSelTip').remove();
            }else{
                $('#divTip_' + _this.list[index].id).remove();
            }
        },
        close:function(){
            _this.ctn.innerHTML = '';
            $(_this.ctn).hide();
            $('#navTop').show();
            $('#navBottom').show();
            $('#topBlank').show();
            $('#bottomBlank').show();
            $(ElScreenContainer).css('height',BomConfig.mainHeight);
            document.addEventListener("backbutton", router.back, false)
        }
    };
    return SelectPage;
})();