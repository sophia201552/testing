var pyFormat = (function () {

    var pyFormat = function () {
        this._configMap = {
            "KEY_PY_STORY": "BEOP.WF.PY",
            "version": "1451029779889",
            "JSONUrl": '/static/scripts/workflow2.0/wf.pinyin.json'
        };
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
        init: function () {

        },
        //获取到PY
        getPYLocalStorage: function () {
            var _this = this, $Dfd = $.Deferred();
            var setLocalStorage = function (result) {
                window.localStorage.setItem(_this._configMap.KEY_PY_STORY, JSON.stringify(result));
            };
            if (!this._isPYStored()) {
                //如果不存在py
                return $.getJSON(_this._configMap.JSONUrl).done(function (result) {
                    if (result) {
                        setLocalStorage(result);
                    }
                })
            } else {
                //如果存在了py，就尝试获取version属性，如果没有，或者不符，就重新获取
                var py = window.localStorage.getItem(this._configMap.KEY_PY_STORY);
                try {
                    py = JSON.parse(py);
                    if (py.version && py.version == this._configMap.version) {
                        //如果版本正常
                        return $Dfd.resolve(py);
                    } else {
                        //如果版本不对
                        return $.getJSON(_this._configMap.JSONUrl).done(function (result) {
                            if (result) {
                                setLocalStorage(result);
                            }
                        });
                    }
                } catch (ex) {
                    //如果报错
                    return $.getJSON(_this._configMap.JSONUrl).done(function (result) {
                        if (result) {
                            setLocalStorage(result);
                        }
                    });
                }
            }
        },
        //传入一个要转换的数组，然后返回一个转换后的对象数组
        getPYMap: function (PY, value) {
            if (!(!!value) || value === 'undefined') return value;
            return this._dealPYMap(PY, value);
        },
        //得到版本的方法
        _getVersion: function () {
            return new Date().getTime()
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
            return !!window.localStorage.getItem(this._configMap.KEY_PY_STORY);
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
                        if (PinYin[key].indexOf(_val) == -1) {// 如果无法转化为拼音，则返回原来的字符串
                            _key = _val;
                        } else {
                            _key = key;
                            break;
                        }
                    }
                }
                return _key;
            }
        }
    };
    return pyFormat;
})();