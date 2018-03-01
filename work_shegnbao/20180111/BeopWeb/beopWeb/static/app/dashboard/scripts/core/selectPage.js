/**
 * Created by win7 on 2016/3/9.
 */
var SelectPage = (function() {
    var _this;

    function SelectPage(data) {
        _this = this;
        _this.ctn = data.ctn;
        _this.type = data.type;
        _this.mode = data.mode ? data.mode : 'radio';
        _this.teamId = data.teamId;
        _this.list = undefined;
        _this.screen = data.screen;
        _this.callback = data.callback;
        _this.selectList = data.selectList;
        _this.$ctnSel = undefined;
        _this.$ctnResult = undefined;
        _this.$ctnTopNav = undefined;
    }
    SelectPage.prototype = {
        show: function() {
            $.ajax({ url: 'static/app/dashboard/views/core/selectPage.html' }).done(function(resultHTML) {
                CssAdapter.adapter({ top: false, bottom: false });
                _this.ctn.innerHTML = resultHTML;
                $(_this.ctn).show();
                $('#ctnSubSelMain').css({ 'height': '-webkit-calc(' + BomConfig.height + ' - ' + BomConfig.topHeight + ' - ' + BomConfig.statusHeight + ')', 'top': BomConfig.statusHeight });
                _this.$ctnSel = $('#ctnSubSelContent').css('height', '-webkit-calc(100% - ' + BomConfig.bottomHeight + ')');
                _this.$ctnResult = $('#ctnSubSelRs').css('height', BomConfig.bottomHeight);
                _this.$ctnTopNav = $('#ctnSubSelTopNav').css('top', BomConfig.statusHeight);
                _this.init();
                $('#navTop').hide();
                $('#navBottom').hide();
                $('#topBlank').hide();
                $('#bottomBlank').hide();
                $(ElScreenContainer).css('height', '-webkit-calc(' + BomConfig.height + ' - ' + BomConfig.statusHeight + ')')
            })
        },
        setCallback: function(func) {
            _this.callback = func
        },
        setList: function(list) {
            _this.list = list
        },
        init: function() {
            var url;
            // if (_this.teamId) {
            //     url = '/workflow/v2/group/user_team_dialog_list/' + AppConfig.userId + '/' + _this.teamId;
            // } else {
            //     url = '/workflow/v2/group/user_team_dialog_list/' + AppConfig.userId;
            // }
            url = '/workflow/teamArch/'
            _this.initTopNav();
            if (this.list instanceof Array && this.list.length > 0) {
                switch (_this.type) {
                    case 'user':
                        _this.initUserList();
                        break;
                    default:
                        break;
                }
                _this.initSelToggle();
                _this.initCallback();
                _this.initResult();
                _this.initSearch();
            } else {
                Spinner.spin($('#ctnSubSelMain')[0]);
                WebAPI.get(url).done(function(resultData) {
                    _this.list = resultData.data;
                    switch (_this.type) {
                        case 'user':
                            _this.initUserList();
                            break;
                        default:
                            break;
                    }
                    _this.initSelToggle();
                    _this.initCallback();
                    _this.initResult();
                    _this.initSearch();
                }).always(function() {
                    Spinner.stop()
                });
            }
        },
        initTopNav: function() {
            _this.$ctnTopNav.css('height', BomConfig.topHeight);
            var btnSure = document.createElement('span');
            btnSure.textContent = I18n.resource.appDashboard.workflow.SURE;
            btnSure.id = 'btnTopSure';
            btnSure.className = 'navTopItem title right zepto-ev';
            _this.$ctnTopNav.append(btnSure);

            $('#btnSubBack').on('tap', function() {
                _this.close();
            });
            document.removeEventListener("backbutton", router.back, false);
            document.addEventListener("backbutton", _this.close, false)
        },
        initUserList: function() {
            var divUser, spTitle, img, spSelClk;
            for (var i = 0; i < _this.list.length; i++) {
                divUser = document.createElement('div');
                divUser.className = 'divUser divSelUnit zepto-ev';
                divUser.id = _this.list[i].id;
                //divUser.dataset.index = i;

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
            if (_this.selectList) {
                var dom;
                for (var i = 0; i < _this.selectList.length; i++) {
                    if (_this.selectList[i].id == undefined) {
                        dom = document.getElementById(_this.selectList[i]);
                    } else {
                        dom = document.getElementById(_this.selectList[i].id);
                    }
                    dom && (dom.className += ' selected');
                }
            }
        },

        getInfoById: function(id) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].id == id) return this.list[i]
            }
            return false;
        },
        initSelToggle: function() {
            if (_this.selectList) {
                var info;
                for (var i = 0; i < _this.selectList.length; i++) {
                    if (_this.selectList[i].id && _this.selectList[i].userfullname) {
                        info = _this.selectList[i]
                    } else {
                        info = this.getInfoById(_this.selectList[i])
                    }
                    info && _this.insertResult(info);
                }
            }
            _this.$ctnSel.on('tap', '.divSelUnit', function(e) {
                var index;
                if ($(e.currentTarget).hasClass('selected')) {
                    $(e.currentTarget).removeClass('selected');
                    _this.removeResult(e.currentTarget.id);
                } else {
                    if (_this.mode == 'radio') {
                        _this.$ctnSel.find('.selected').removeClass('selected');
                    }
                    $(e.currentTarget).addClass('selected');
                    _this.removeResult(e.currentTarget.id);
                    index = _this.getUserById(e.currentTarget.id);
                    if (index) _this.insertResult(index);

                }
            })
        },
        getUserById: function(id) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].id == id) {
                    return this.list[i];
                }
            }
        },
        initSearch: function() {
            var spSearch = document.createElement('span');
            spSearch.id = 'spTopSearch';
            var label = document.createElement('label');
            label.style.display = 'none';
            var iptSearch = document.createElement('input');
            iptSearch.setAttribute('type', 'text');
            iptSearch.id = 'iptTopSearch';
            spSearch.appendChild(label);
            spSearch.appendChild(iptSearch);
            _this.$ctnTopNav.append(spSearch);
            var $divSelUnit = $('.divSelUnit ');
            $(iptSearch).on('input propertychange', function(e) {
                if (e.target.value == '') {
                    $divSelUnit.show()
                } else {
                    $divSelUnit.hide();
                    _this.list.forEach(function(item, i) {
                        if ((item.username && item.username.indexOf(e.target.value) >= 0) || (item.userfullname && item.userfullname.indexOf(e.target.value) >= 0)) {
                            $divSelUnit.eq(i).show();
                        }
                    });
                    //for (var i = 0 ; i < $divSelUnit.length ;i++){
                    //    if ($divSelUnit.eq(i).find('.spTitle').text().indexOf(e.target.value) >= 0){
                    //        $divSelUnit.eq(i).show();
                    //    }
                    //}
                }
            })
        },
        initCallback: function() {
            $('#btnTopSure').on('tap', function() {
                var result = [];
                var $divSelect = _this.$ctnResult.find('.divSelTip');
                var index;
                for (var i = 0; i < $divSelect.length; i++) {
                    index = _this.getUserById($divSelect[i].id.split('_')[1]);
                    if (index) result.push(index)
                }
                if (_this.callback instanceof Function) {
                    _this.callback.call(_this.screen, result)
                }
                _this.close();
            })
        },
        initResult: function() {
            _this.$ctnResult.on('tap', '.divSelTip', function(e) {
                $('#' + e.currentTarget.dataset.id).removeClass('selected');
                $(e.currentTarget).remove();
            })
        },
        insertResult: function(user) {
            var text, id;
            switch (_this.type) {
                case 'user':
                    text = user.userfullname;
                    id = user.id;
                    break;
                default:
                    break;
            }
            var divTip = document.createElement('div');
            divTip.textContent = text;
            divTip.id = 'divTip_' + id;
            divTip.className = 'divSelTip zepto-ev';
            //divTip.dataset.index = index;
            divTip.dataset.id = id;
            _this.$ctnResult.append(divTip);
        },
        removeResult: function(id) {
            if (_this.mode == 'radio') {
                $('.divSelTip').remove();
            } else {
                $('#divTip_' + id).remove();
            }
        },
        close: function() {
            CssAdapter.adapter({ top: true, bottom: true })
            _this.ctn.innerHTML = '';
            $(_this.ctn).hide();
            $('#navTop').show();
            $('#navBottom').show();
            $('#topBlank').show();
            $('#bottomBlank').show();
            $(ElScreenContainer).css('height', BomConfig.mainHeight);
            document.addEventListener("backbutton", router.back, false)
        }
    };
    return SelectPage;
})();