/**
 * Created by win7 on 2016/6/7.
 */
var ModalDeviceDetail = (function () {
    var _this;

    function ModalDeviceDetail(screen, widget) {
        _this = this;
        _this.screen = screen;
        _this.widget = widget;
        _this.node = undefined;
        _this.$modal = undefined;
        _this.idArr = [];
        _this.attachEvents();
    }

    ModalDeviceDetail.prototype = {
        show: function (node) {
            _this.node = node;
            _this.$modal = $('#myModal');

            WebAPI.get('/asset/getModelListByType/' + _this.node.type).done(function (result) {
                var allModal = '';
                for (var i in result.data) {
                    var tip = '<div>' + result.data[i].name + '</div>';
                    for (var k in result.data[i].attr) {
                        tip += '<div>' + k + ':</div><div>' + result.data[i].attr[k] + '</div>';
                    }
                    allModal += '<li draggable="true" id="' + result.data[i]['_id'] + '" data-toggle="tooltip" data-placement="left" data-html="true" title="' + tip + '">' + result.data[i].name + '</li>';
                }
                $('.' + 'from' + ' ul', _this.$modal).html(allModal);
                $('.' + 'from' + ' ul li', _this.$modal).tooltip();
            });
            WebAPI.get('/asset/getModelList/' + _this.widget.node['_id'] + '/' + _this.node.type).done(function (result) {
                var allModal = '';
                for (var i in result.data) {
                    //var tip = '<div>' + result.data[i].name + '</div>';
                    //for (var k in result.data[i].attr) {
                    //    tip += '<div>' + k + ':</div><div>' + result.data[i].attr[k] + '</div>';
                    //}
                    allModal += '<li draggable="true" id="' + i + '" data-toggle="tooltip" data-placement="left" data-html="true">' + result.data[i] + '</li>';
                    _this.idArr.push(i);
                }
                $('.' + 'to' + ' ul', _this.$modal).html(allModal);
                $('.' + 'to' + ' ul li', _this.$modal).tooltip();
            });
            _this.$modal.modal('show')
        },

        init: function () {

        },

        attachEvents: function () {
            $('#myModal').off('hidden.bs.modal').on('hidden.bs.modal', function () {
                $('.from ul,.to ul').html('');
                _this.idArr = [];
            });

            $('.from ul', _this.$modal).off('dragstart').on('dragstart', 'li', function (e) {
                e.originalEvent.dataTransfer.setData('liHtml', this.outerHTML);
            });

            $('.from ul', _this.$modal).off('dragend').on('dragend', 'li', function (e) {

            });

            $('.to ul', _this.$modal).off('dragover').on('dragover', function (e) {
                e.preventDefault();
            });

            $('.to ul', _this.$modal).off('dragenter').on('dragenter', function (e) {

            });

            $('.to ul', _this.$modal).off('drop').on('drop', function (e) {
                var $li = $(e.originalEvent.dataTransfer.getData('liHtml'));
                var id = $li.attr('id');
                for (var i = 0, len = _this.idArr.length; i < len; i++) {
                    if (id === _this.idArr[i]) return;
                }
                $(this).append($li);
                $li.tooltip();
                _this.idArr.push(id);
            });

            $('.from ul', _this.$modal).off('click').on('click', 'li', function (e) {
                var id = this.id;
                for (var i = 0, len = _this.idArr.length; i < len; i++) {
                    if (id === _this.idArr[i]) return;
                }
                $('.to ul', _this.$modal).append(this.outerHTML).find('#' + id).tooltip();
                _this.idArr.push(id);
            });

            $('.to ul', _this.$modal).off('click').on('click', 'li', function (e) {
                var $this = $(this);
                _this.idArr.splice($this.index(), 1);
                $this.tooltip('hide');
                $this.remove();
            });

            $('#itemSearch', _this.$modal).off('keyup').on('keyup', function () {
                $('.from ul li').show().not('li:contains(' + $(this).val() + ')').hide();
            })

            $('#btnSave', _this.$modal).off('click').on('click', function () {
                //保存
                if (_this.widget.store.dictClass) {
                    _this.widget.store.dictClass[_this.node.type].arrModel = _this.idArr;
                } else {
                    _this.widget.store.dictClass = {};
                    _this.widget.store.dictClass[_this.node.type] = { arrModel: _this.idArr };
                }
                _this.$modal.modal('hide');
            })
        }
    };
    return ModalDeviceDetail
})();