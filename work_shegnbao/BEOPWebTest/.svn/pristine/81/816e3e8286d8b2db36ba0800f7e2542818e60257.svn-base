var pyFormat = (function () {

    var pyFormat = function () {
        this._configMap = {
            "KEY_PY_STORY": "BEOP.WF.PY"
        };
        this._init();
    };

    //范例
    /*
     var PYFormat = new pyFormat();
     PYFormat.getPYLocalStorage().done(function (result) {
     PYFormat.getPYMap(result, /!*想要转换的值*!/)
     });
     */
    //getPYLocalStorage 类似于 window.localStorage.getItem
    pyFormat.prototype = {
        _init: function () {
            this._setPyLocalStorage();
        },
        //获取到PY
        getPYLocalStorage: function () {
            var _this = this;
            if (!this._isPYStored()) {
                return $.getJSON('/static/scripts/workflow2.0/wf.pinyin.json').done(function (result) {
                    if (result) {
                        window.localStorage.setItem(_this._configMap.KEY_PY_STORY, JSON.stringify(result));
                    }
                })
            } else {
                var pin_yin = JSON.parse(window.localStorage.getItem(_this._configMap.KEY_PY_STORY));
                return $.Deferred().resolve(pin_yin);
            }
        },
        //传入一个要转换的数组，然后返回一个转换后的对象数组
        getPYMap: function (PY, value) {
            if (!(!!value) || value === 'undefined') return value;
            return this._dealPYMap(PY, value);
        },
        _dealPYMap: function (PY, value) {
            if (arguments.length !== 2) return new SyntaxError('arguments \'s length isn\'t 2');
            var format, result = [], _this = this;
            [].slice.call(value).forEach(function (item) {
                if (typeof item != 'string' || !(!!item) || item === 'undefined') {
                    result.push({
                        key: item,
                        pinyin: item,
                        acronym: item
                    })
                } else {
                    format = _this._getZH_EN(PY, item);
                    result.push({
                        key: item,
                        pinyin: format.pinyin,
                        acronym: format.acronym
                    })
                }
            });
            return result;
        },
        _isPYStored: function () {
            return !!localStorage.getItem(this._configMap.KEY_PY_STORY);
        },
        _setPyLocalStorage: function () {
            var _this = this;
            if (!this._isPYStored()) {
                return $.getJSON('/static/scripts/workflow2.0/wf.pinyin.json').done(function (result) {
                    if (result) {
                        window.localStorage.setItem(_this._configMap.KEY_PY_STORY, JSON.stringify(result));
                    }
                })
            }
        },
        _getZH_EN: function (PinYin, first_letter) {
            var _name = '',
                _char = '',
                _firstChar = '',
                _reg = /[a-z0-9A-Z\- ]/,
                i = 0, len = first_letter.length;

            for (i = 0; i < len; i++) {
                var _val = first_letter[i];
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

            function getPinYin(_val) {
                var _key = '';
                for (var key in PinYin) {
                    if (PinYin.hasOwnProperty(key)) {
                        if (PinYin[key].indexOf(_val) !== -1) {
                            _key = key;
                            break;
                        } else {// 如果无法转化为拼音，则返回原来的字符串
                            _key = _val;
                        }
                    }
                }
                return _key;
            }
        }
    };
    return pyFormat;
})();