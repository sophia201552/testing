/// <reference path="../lib/jquery-1.11.1.js" />
var WorkflowManageGroup = (function () {

    function WorkflowManageGroup() {
        this.type = null;
    }

    WorkflowManageGroup.prototype = {
        show: function (type, txt) {
            var _this = this;
            var arg = arguments;
            this.type = type || null;
            var $wfContentBox = $('#wf-content');
            WebAPI.get("/static/views/workflow/task_group.html?t=" + new Date().getTime()).done(function (resultHtml) {
                $wfContentBox.hide().html(resultHtml);
                var $wfChangeGroupBox = $('.wf-manager-change-work-group');
                if (arg.length == 1) {
                    if (_this.type == 'addGroup') {
                        $wfChangeGroupBox.find('h4:first').text('添加任务组');
                        $wfChangeGroupBox.show();
                    }
                } else if (arg.length == 2) {
                    if (_this.type == 'editGroup' && txt) {
                        $wfChangeGroupBox.find('h4:first').text('编辑任务组--' + txt);
                        $wfChangeGroupBox.show();
                    } else if (_this.type == 'getGroup' && txt) {
                        $('.wf-manager-title').text('进行中--' + txt);
                        $wfChangeGroupBox.hide();
                    }
                }
                $wfContentBox.show();
                I18n.fillArea($(ElScreenContainer));
                _this.init();
            });
        },
        init: function () {
            this.attachEvent();
        },
        attachEvent: function () {
            var _this = this;
            //表格
            $('.wf-manager-task-group').find('i:first').on('click', function () {
                var $container = $(this).toggleClass('wf-dq').parent().parent().children('.wf-table-container');
                $container.hasClass('dn') ? $container.slideDown('350').toggleClass('dn') : $container.slideUp('350').toggleClass('dn');
            });

            //关闭修改或者创建任务组
            $('.wf-close-edit-work-group').on('click', function () {
                $('.wf-manager-change-work-group').fadeOut('200')
            });


            //点击切换筛选方式
            var $wfSearchBoxSelect = $('.wf-search-box-select');
            $wfSearchBoxSelect.find('li').click(function () {
                var index = $wfSearchBoxSelect.find('li').index(this);
                if (index < 4) {
                    $wfSearchBoxSelect.find('li').removeClass('active');
                    $(this).addClass('active');
                    $('.wf-search-result-title').hide().eq(index).show();
                } else if (index == 4) {
                    //全部清空的操作
                }
            });


            //点击所有人筛选里面的字母筛选
            var $wfSearchToggle = $('.wf-search-by-name');
            $wfSearchToggle.find('li').click(function () {
                var value = $(this).text();
                var _this = this;
                //如果选择的是全部
                if ($(this).index() == 0) {
                    $wfSearchToggle.find('li').addClass('active');
                    setTimeout(function () {
                        $wfSearchToggle.find('li').removeClass('active');
                        $(_this).addClass('active');
                    }, 800);
                    $('.wf-search-result').find('.wf-member').show();
                    //选择其他
                } else {
                    $wfSearchToggle.find('li').removeClass('active');
                    $(this).toggleClass('active');
                    $('.wf-search-result').find('.wf-member').hide().each(function () {
                        if ($(this).data('event').EN.charAt(0) == value.toString()) {
                            $(this).show();
                        }
                    })
                }
            });
            //初始设定data状态
            $('.wf-search-result').find('.wf-member').each(function () {
                var text=$(this).find('.wf-team-avatar-name').text();
                var ZH_EN=_this.getZH_EN(text.toLowerCase());
                //这里给每一个人物框都添加了一个拼音和英文全拼
                //Index是为了查询顺序
                $(this).data('event', {
                    name:text ,
                    PY:ZH_EN.pinyin,
                    //对于纯英文的名字 只有转换为英文了
                    EN:ZH_EN.acronym || text.toLowerCase(),
                    imgSRC:$(this).find('.avatar-icon').attr('src'),
                    index: ($(this).index() + 1)
                });
            });
            //通过点击任务框选择人员
            $('.wf-member').click(function (event) {
                var data = $(this).data('event');
                $(this).toggleClass('wf-member-selected');
                //选择
                if ($(this).hasClass('wf-member-selected')) {
                    $('.wf-check-result').prepend($('<li><span class="ellipsis" title="' + data.name + '">' + data.name + '</span><i class="glyphicon glyphicon-remove" title="删除"></i></li>').data('event', data));
                    //取消选择
                } else {
                    $('.wf-check-result li ').each(function () {
                        if ($(this).data('event').index == data.index) {
                            $(this).remove();
                        }
                    })
                }
            });
            //通过按钮删除人员
            $('.wf-check-result').on('click', 'i', function () {
                var index = $(this).parent().data('event').index;
                $('.wf-search-result').find('.wf-member').eq(index - 1).removeClass('wf-member-selected');
                $(this).parent().remove();
            });

            //输入文字搜索人员
            $('#input-search-name').keyup(function (event) {
                $('.wf-member').find('span').removeClass('highlight');
                var value = $(this).val();
                if (value == "") {
                    $('.wf-search-result').find('.wf-member').show();
                    $wfSearchToggle.find('li').removeClass('active').eq(0).addClass('active');
                } else {
                    var result = $.trim(value).split('');
                    var inputCN, inputEN;
                    console.log('字符：' + value);
                    if (result.every(function (item, index, array) {
                            //给数组中每一项都运行给定函数，如果每一项都返回 true 则返回 true
                            return item.charCodeAt(0) > 40869 || item.charCodeAt(0) < 19968
                        })) {
                        //当长度为1的时候查找姓氏
                        if(value.length == 1){
                            $('.wf-search-result').find('.wf-member').hide().each(function (index, domEle) {
                                if($(this).data('event').EN.indexOf(value) != -1){
                                    $(this).show();
                                }
                            })
                        }else {
                            $('.wf-search-result').find('.wf-member').hide().each(function (index, domEle) {
                                //直接采用indexOf来查找
                                console.log(value)
                                if ($(this).data('event').PY.indexOf(value) != -1 || $(this).data('event').EN.indexOf(value) != -1) {
                                    $(this).show();
                                }
                            })
                        }
                    } else if (result.some(function (item, index, array) {
                            //给数组中每一项都运行给定函数，如果任意一项都返回 true 则返回 true
                            return item.charCodeAt(0) <= 40869 || item.charCodeAt(0) >= 19968
                        })) {
                        //返回出中文的部分
                        inputCN = result.filter(function (item, index, array) {
                            return item.charCodeAt(0) <= 40869 && item.charCodeAt(0) >= 19968
                        });
                        //返回出英文的部分
                        inputEN = result.filter(function (item, index, array) {
                            return item.charCodeAt(0) > 40869 || item.charCodeAt(0) < 19968
                        });
                        $('.wf-search-result').find('.wf-member').hide().each(function (index, domEle) {
                            console.log(value.length);
                            //第一次查找，输入一个汉字的时候全局查找，如果每一个人物的名称匹配到就显示出来
                            if (value.length == 1) {
                                if ($(this).data('event').name.split('').some(function (item, index, array) {
                                        return item == result
                                    })) {
                                    //var text=$(this).find('.wf-team-avatar-name').text().replace(result[i],'<span class="highlight">'+ result[i] +'</span>');
                                    //$(this).find('.wf-team-avatar-name').html(text);
                                    $(this).show();
                                }
                            } else {
                                //当输入的长度大于2的时候开始尝试精确的查找
                                if ($(this).data('event').name == value) {
                                    $(this).show();
                                } else {
                                    //如果输入了中英混合的话就把中文转化为第一个字母配合英文查找 search
                                    if (inputEN) {
                                        var enToSearch;
                                        //转化为拼音声母
                                        //和输入的英文配合起来查找
                                        enToSearch = _this.getZH_EN(inputCN.join('')).pinyin + inputEN.join('');
                                        if ($(this).data('event').PY.indexOf(enToSearch) != -1) {
                                            $(this).show();
                                        }
                                    } else if ($(this).data('event').name.indexOf(value) != -1) {
                                        //如果没有输入中英混合，那就indexOf查找 name
                                        $(this).show();
                                    }
                                }
                            }
                        });
                    }
                }
            });

            //筛选完成后
            $('.wf-member-selected-complete').click(function () {
                var $resultContainer=$('.wf-check-result'),
                    selectedLength=$resultContainer.find('li').length,
                    i;
                var result=[];
                if(selectedLength != 0) {
                    for ( i = 0; i < selectedLength; i++) {
                        result.push($resultContainer.find('li').eq(i).data('event'))
                    }
                }
                console.log(result);
                $('#wf-add-person').modal('hide');
                //添加
                var dataBase64='data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAWlBMVEUxad5znu9ahueUtv9CdeeMrvecw/85cd5rlu97pvely/8xbd57nvdjju+cvv9KfeeMsv+lx/9Ccedrmu9aiu+Uuv9KeeeMsvelw/9Ccd6Epvc5bd57ovdzmu+UYrMFAAABMklEQVQ4jaWSjW6DMAyEAa2kDWqiU0WoZ3j/15ztQDET6yYt/Emc82Hf0Tz790fzi/5s/kOws1mffyYAeNMD+s/r9fZE/wMhzoEDMc/xvAcsTLIK8YK9L0cYWdUiNcN41gPupgetueOkhyiaqKQXxZMeEIQQ9BNyjy+zHCGrRobIe5euhyXoEFlLWrwG9T7oVpuT+t0r78MkNlEOFCZs+48EpC7I6sZ9yO//A9J0SfHw6kDQLKNch7h3HzC2bSdruU0RjrBtb4tlpVMyPRJ2Qp0grFGVWiSZ+x5wYdqkUKyKZzgCPkzPdpBFSgznA4b60gi55sHVjjoF2DLMKtopX+GE3hHKGlOmbQ3JpYk6oamKkUBKSNVq80kKDL82aSBO3geue1WrJUqA84HLyqcXZ6iEL8OWQiTjzqb4AAAAAElFTkSuQmCC';
                var htmlPrepend='';
                for(i=0;i<result.length;i++){
                    htmlPrepend+=($('<div class="people" title="'+result[i].name +'"><img src="'+ dataBase64 +'"> </div>').data('event',result[i]));
                }
                $('.wf-people-add').prepend(htmlPrepend);
            });
        },
        detachEvents: function () {
        },
        close: function () {
        },
        getZH_EN: function (str) {
            if (typeof str != 'string') return false;
            var PinYin = {};
            var _name = '',
                _char = '',
                _firstChar = '',
                _reg = /[a-z0-9A-Z\- ]/;

            for (var i = 0, len = str.length; i < len; i++) {
                var _val = str[i];
                if (_reg.test(_val)) {
                    _name += _val;
                } else {
                    _char = getPinYin(_val);
                    _name += _char;
                    _firstChar += _char[0];
                }
            }
            return {
                // 转化为拼音的全拼
                pinyin: _name,
                // 转化为拼音的声母首字母
                acronym: _firstChar
            };
            //取得单个汉字拼音
            function getPinYin(_val) {
                var _key = '';
                for (var i in PinYin) {
                    if (PinYin[i].indexOf(_val) !== -1) {
                        _key = i;
                        break;
                    } else {// 如果无法转化为拼音，则返回原来的字符串
                        _key = _val;
                    }
                }
                return _key;
            }
        }
    };

    return WorkflowManageGroup;
})();