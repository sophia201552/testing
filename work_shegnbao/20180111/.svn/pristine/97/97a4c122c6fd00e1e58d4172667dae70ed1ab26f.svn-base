/**
依赖于
jquery-2.1.4.min.js"
bootstrap.min.js"
bootstrap-datetimepicker.js
*/
(function ($) {
    var patterns = {
            num_01: /^[0|1]*$/,
            num_02: /^[0-2]*$/,
            num_03: /^[0-3]*$/,
            num_19: /^[1-9]*$/,
            num_09: /^[0-9]*$/,
            num_08: /^[0-8]*$/,
            num_05: /^[0-5]*$/
        };
    var regDate = new RegExp('(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(-|/|.)(((0[13578]|1[02])(-|/|.)(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(-|/|.)(0[1-9]|[12][0-9]|30))|(02(-|/|.)(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))(-|/|.)02(-|/|.)29)');
    var regDateYM = new RegExp('(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(-|/|.)(((0[13578]|1[02]))|((0[469]|11))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00)))');
    var regTime = /^(?:[01]\d|2[0-3])(?::[0-5]\d)$/;
    var arrKW = ['y', 'M', 'd', 'H', 'm', 'h', 'i'];
    var _this;
    var InputDatetime = function(input, $dtp){
        this.input = input;
        this.$dtp = $dtp;
        _this = this;
        _this.input.pos = 0;
        if(input.dataset.format) this.attachEvents();
    };

    InputDatetime.prototype = {
        constructor: InputDatetime,
        init: function(){

        },
        remove: function(){
            this.$dtp.datetimepicker('remove');
        },
        _events: [],
        attachEvents: function(){
            this._detachEvents();
            this._events = [
                [this.input, {
                    keydown: $.proxy(this.keydown, this),
                    focus: $.proxy(this.focus, this),
                    click: $.proxy(this.click, this),
                    blur: $.proxy(this.blur, this),
                    input: $.proxy(this.oninput, this),
                    change: $.proxy(this.change, this)
                }]
            ];
            for (var i = 0, el, ev; i < this._events.length; i++) {
                el = this._events[i][0];
                ev = this._events[i][1];
                $(el).on(ev);
            }
        },
        _detachEvents: function(){
            for (var i = 0, el, ev; i < this._events.length; i++) {
                el = this._events[i][0];
                ev = this._events[i][1];
                $(el).off(ev);
            }
            this._events = [];
        },
        oninput: function(e){
            var inputVal = this.input.value;

            if(inputVal.length > this.input.dataset.format.length){
                $(this.input).val($(this.input).data('oldVal'));
                this.input.selectionStart = this.input.selectionEnd = this.input.pos;
            }
        },
        change: function(){
            if(this.input.dataset.format === 'yyyy-mm-dd hh'){
                this.input.value = this.input.value+':00';//自动补':00'
            }
        },
        keydown: function(e){
            var keyCode = e.which;
            var inputVal = this.input.value;
            var _that = this;
            $(this.input).popover('hide');

            // 数字
            if (keyCode >= 48 && keyCode <= 57 ) dealWithKey();
            // 小数字键盘
            if (keyCode >= 96 && keyCode <= 105) dealWithNumKey();
            // Backspace, del, 左右方向键
            if (keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39) dealWithDelete();

            return false;

            function dealWithKey(){
                var strPosF, strPosFNext, strKey, isMatch = false, strPrev, dIndex, month, strDate, dateTemp;
                //如果字符长度大于format的length 并且不包含时间格式字符
                if(_that.input.pos == _that.input.dataset.format.length) return false;

                strKey = String.fromCharCode(keyCode);

                //获取当前输入位置的含义
                strPosF = _that.input.dataset.format.substring(_that.input.pos, _that.input.pos + 1);
                strPosFNext = _that.input.dataset.format.substring(_that.input.pos + 1, _that.input.pos + 2);
                strPrev = inputVal.substring(_that.input.pos - 1, _that.input.pos);

                if(strPosF === 'y'){//年
                    isMatch = true;
                }else if(strPosF === 'd'){//日
                    dIndex = _that.input.dataset.format.indexOf('dd');//日所在字符的位置
                    month = inputVal.substring(dIndex -3, dIndex -1);
                    if(strPosF == strPosFNext){//日第一个字符
                        if(strKey == '0'){
                            isMatch = true;
                        }else{
                            strDate = _that.input.value.substring(0,dIndex) + strKey + '0';
                        }
                    }else{//日第二个字符
                        strDate = _that.input.value.substring(0,dIndex + 1) + strKey;
                    }
                    if(isMatch == false){
                        dateTemp = new Date(strDate.replace(/\D/g, '-'));
                        if(dateTemp.toString() === "Invalid Date"){
                            isMatch = false;
                        }else if(month != (dateTemp.getMonth() + 1)){
                            isMatch = false
                        }else{
                            isMatch = true;
                        }
                    }

                }else if(strPosF === 'H' || strPosF === 'h'){//时
                    if(strPosF == strPosFNext){//时份第一个字符
                        isMatch = patterns.num_02.test(strKey);
                    }else{//时份第二个字符
                        if(strPrev == '0'){//如果时份第一个字符的值为0,那么第二个字符的值就必须为1~9
                            isMatch = patterns.num_09.test(strKey);
                        }else if(strPrev == '2'){
                            isMatch = patterns.num_03.test(strKey);
                        }else{
                            isMatch = patterns.num_09.test(strKey);
                        }
                    }
                }else if(strPosF === 'i'){//分
                    if(strPosF == strPosFNext){//分第一个字符
                        isMatch = patterns.num_05.test(strKey);
                    }else{
                        isMatch = patterns.num_09.test(strKey);
                    }
                }else if(strPosF === 'M' || strPosF === 'm'){//月
                    if(strPosF == strPosFNext){//月份第一个字符
                        isMatch = patterns.num_01.test(strKey);
                    }else{//月份第二个字符
                        if(strPrev == '0'){//如果月份第一个字符的值为0,那么第二个字符的值就必须为1~9
                            isMatch = patterns.num_19.test(strKey);
                        }else if(strPrev == '1'){
                            isMatch = patterns.num_02.test(strKey);
                        }
                    }
                }

                if(isMatch){
                    _that.input.value = inputVal.substring(0,_that.input.pos) + strKey + inputVal.substring(_that.input.pos + 1, inputVal.length);
                    $(_that.input).data('oldVal', _that.input.value);
                    _that.input.pos ++;
                    var strOfPos = _that.input.dataset.format.substring(_that.input.pos, _that.input.pos + 1);//获取下一个位置的字符

                    while(strOfPos != '' && $.inArray(strOfPos, arrKW) < 0){
                        _that.input.pos ++;
                        strOfPos = _that.input.dataset.format.substring(_that.input.pos, _that.input.pos + 1);
                    }
                    _this.moveCursor(_that.input);
                }
                return false;
            }

            //数字键盘转换
            function dealWithNumKey(){
                keyCode = keyCode - 48;
                dealWithKey(keyCode);
            }

            function dealWithDelete(){
                var strOfPos;
                if(keyCode == 8 || keyCode == 46){
                    if(_that.input.pos == _that.input.dataset.format.length && keyCode == 46) return false;
                    if(_that.input.pos == 0 && keyCode == 8) return false;

                    if(keyCode == 8){//back
                        _that.input.pos --;
                        strOfPos = _that.input.dataset.format.substring(_that.input.pos, _that.input.pos + 1);//获取上一个位置的字符
                        while(strOfPos != '' && $.inArray(strOfPos, arrKW) < 0){
                            _that.input.pos --;
                            strOfPos = _that.input.dataset.format.substring(_that.input.pos, _that.input.pos + 1);
                        }
                        _that.input.value = inputVal.substring(0,_that.input.pos) + strOfPos + inputVal.substring(_that.input.pos + 1, inputVal.length);
                        $(_that.input).data('oldVal', _that.input.value);

                    }else if(keyCode == 46 && /[0-9]/.test(_that.input.value.substring(_that.input.pos))){//del
                        strOfPos = _that.input.dataset.format.substring(_that.input.pos, _that.input.pos + 1);//获取上一个位置的字符
                        while(strOfPos != '' && $.inArray(strOfPos, arrKW) < 0){
                            _that.input.pos ++;
                            strOfPos = _that.input.dataset.format.substring(_that.input.pos, _that.input.pos + 1);
                        }
                        _that.input.value = inputVal.substring(0,_that.input.pos) + strOfPos + inputVal.substring(_that.input.pos + 1, inputVal.length);
                        $(_that.input).data('oldVal', _that.input.value);
                        _that.input.pos ++;
                    }

                }else{
                    if(_that.input.pos == _that.input.dataset.format.length && keyCode == 39) return false;
                    if(_that.input.pos == 0 && keyCode == 37) return false;
                    if(keyCode == 37){//left
                        _that.input.pos --;
                    }else if(keyCode ==39){
                        _that.input.pos ++;
                    }
                }
                _this.moveCursor(_that.input);
            }
        },
        focus: function(){
            var inputVal = this.input.value.trim();
            if(inputVal == ''){
                this.input.value = this.input.dataset.format;
                $(this.input).data('oldVal', this.input.value);
                $(this.input).popover({
                    placement: 'bottom',
                    content: '请输入有效的时间',
                    trigger: 'focus'
                });
            }else{
                //如果有输入字符且不符合正则,提示
                if(inputVal !== this.input.dataset.format && !_this.isMatchReg(inputVal, this.input.dataset.format)){
                    $(this.input).popover('show');
                }else{
                    $(this.input).popover('hide');
                }
            }
            //移动光标位置
            _this.moveCursor(this.input);
        },
        moveCursor: function(input){
            setTimeout(function(){
                input.selectionStart = input.selectionEnd = input.pos;
            },50);
        },
        isMatchReg: function(inputVal,format){
            var isNotShow = false
            if(/^(HH|hh):ii$/.test(format)){//时间
                isNotShow = regTime.test(inputVal);
            }else if(/ (HH|hh):ii/.test(format)){//日期+时间
                isNotShow = regDate.test(inputVal.split(' ')[0]) && regTime.test(inputVal.split(' ')[1]);
            }else if(new RegExp('^yyyy(-|/|.)(mm|MM)$').test(format)){//日期yyyy-MM
                isNotShow = regDateYM.test(inputVal);
            }else{//日期yyyy-MM-dd
                isNotShow = regDate.test(inputVal);
            }
            return isNotShow;
        },
        click: function(){
            var strAfterCursor = this.input.value.substring(this.input.pos);
            //如果一个字符都没有输入
            if(!/[0-9]/.test(this.input.value)){
                this.input.selectionStart = this.input.selectionEnd = this.input.pos = 0;
            }else if(!/[0-9]/.test(strAfterCursor) && strAfterCursor !== ''){//光标位置后面没有输入
                this.input.selectionStart = this.input.selectionEnd = this.input.pos;
            }else{
                this.input.pos = this.input.selectionStart;
            }
        },
        blur: function(){
            var inputVal = this.input.value.trim();
            //输入年份后再通过日历选择后面的时间不应加上错误提示样式,所以增加条件$('.datetimepicker [class^="datetimepicker-"]').not(':hidden').length < 1
            if(inputVal !== this.input.dataset.format && !_this.isMatchReg(inputVal, this.input.dataset.format) && $('.datetimepicker [class^="datetimepicker-"]').not(':hidden').length < 1){
                $(this.input).css({border: '1px solid #d43f3a'});
                $(this.input).addClass('timeError');
            }else{
                $(this.input).css({border: ''});
                $(this.input).removeClass('timeError');
            }
        }
    }

    $.fn.datetime = function(option){
        var format, minView, startView, maxView, btn, optDTP, $dtp, data, internal_return;

        this.each(function(){
            var $this = $(this);
            var input = this.tagName == "INPUT" ? this : (this.children[0].tagName == "INPUT" ? this.children[0] : null);
            if(!input){
                console.log('not found input element');
                return;
            }
            format = input.dataset.format;
            optDTP = {
                format: format,
                autoclose: true,
                initialDate: new Date(),
                todayBtn: true
            };

            /**
            0 or 'hour' for the hour view
            1 or 'day' for the day view
            2 or 'month' for month view (the default)
            3 or 'year' for the 12-month overview
            4 or 'decade' for the 10-year overview.
            */

            // 根据format的值判断
            if(new RegExp('^yyyy(-|/|.)(mm|MM)(-|/|.)dd(.)* (HH|hh)(:|.)ii').test(format)){
                startView = 4;
                minView = 0;
            }else if(new RegExp('^yyyy(-|/|.)(mm|MM)(-|/|.)dd(.)* (HH|hh)').test(format)){
                startView = 4;
                minView = 1;
            }else if(new RegExp('^yyyy(-|/|.)(mm|MM)(-|/|.)dd(.)*').test(format)){
                startView = 4;
                minView = 2;
            }else if(new RegExp('^yyyy(-|/|.)(mm|MM)').test(format)){
                startView = 4;
                minView = 3;
            }else if(new RegExp('^(HH|hh):ii').test(format)){
                startView = maxView = 1;
                minView = 0;
            }

            if(minView) optDTP.minView = minView;
            if(maxView) optDTP.maxView = maxView;
            if(startView) optDTP.startView = startView;

            if(typeof option == 'object' && !$.isEmptyObject(option)){
                optDTP = $.extend(true, optDTP, option);
            }

            //如果输入框有datetimepicker属性, 初始化datetimepicker
            if(input.attributes.datetimepicker){
                $this.datetimepicker(optDTP);
                $dtp = $this;
            }else if(input.nextElementSibling && input.nextElementSibling.tagName == 'SPAN' && input.nextElementSibling.classList.contains('add-on')){//如果有日历按钮
                btn = input.nextElementSibling;
                if(!input.id || input.id.trim() == ''){
                    alert('input element must has a id');
                    return;
                }
                optDTP.linkField = input.id;
                optDTP.linkFormat = format;
                $(btn).datetimepicker(optDTP);
                $dtp = $(btn);
            }

            data = $this.data('datetime');
            if (!data) {
                $this.data('datetime', (data = new InputDatetime(input, $dtp)));
            }

            if (typeof option == 'string' && typeof data[option] == 'function') {
                internal_return = data[option].apply(data);
                if (internal_return !== undefined) {
                    return false;
                }
            }
        });
    }
})(jQuery);
