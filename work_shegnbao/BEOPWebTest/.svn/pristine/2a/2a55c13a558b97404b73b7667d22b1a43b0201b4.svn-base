;(function (exports) {

    exports.ModalBaseConfigureMixin = {
        configure: function () {
            var _this = this;
            var $divParent = $('#divContainer_' + this.entity.id);
            var iptResizerCol, iptResizerRow;
            var options = this.spanRange;
            var width = this.entity.spanC || options.minWidth;
            var height = this.entity.spanR || options.minHeight;

            // 新增宽高的编辑
            $( '<div class="btn-group number-resizer-wrap">\
                <input type="number" class="btn btn-default number-resizer-col" value="{width}" min="{minWidth}" max="{maxWidth}">\
                <input type="number" class="btn btn-default number-resizer-row" value="{height}" min="{minHeight}" max="{maxHeight}">\
            </div>'.formatEL({
                width: width,
                height: height,
                minWidth: options.minWidth,
                minHeight: options.minHeight,
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight
            }) ).appendTo( $divParent.children('.panel') );

            iptResizerCol = $divParent[0].querySelector('.number-resizer-col');
            iptResizerRow = $divParent[0].querySelector('.number-resizer-row');

            iptResizerRow.onchange = function () {
                this.value = Math.max( Math.min(options.maxHeight, this.value), options.minHeight );
                $divParent.height(this.value * _this.UNIT_HEIGHT + '%');
                _this.entity.spanR = Math.floor(this.value);

                //兼容ModalMix
                if(_this.screen.screen){
                    _this.screen.screen.setEntity(_this.entity);
                }else{
                    _this.screen.setEntity(_this.entity);
                }
            };
            iptResizerCol.onchange = function () {
                this.value = Math.max( Math.min(options.maxWidth, this.value), options.minWidth );

                $divParent.width(this.value * _this.UNIT_WIDTH + '%');
                _this.entity.spanC = Math.floor(this.value);

                //兼容ModalMix
                if(_this.screen.screen){
                    _this.screen.screen.setEntity(_this.entity);
                }else{
                    _this.screen.setEntity(_this.entity);
                }
            };

            $divParent.css({
                width: width * this.UNIT_WIDTH + '%',
                height: height * this.UNIT_HEIGHT + '%'
            });

            this.spinner && this.spinner.stop();
        },
        initContainer: function () {
            var _this = this;
            var divParent;
            var scrollClass = '';

            divParent = document.createElement('div');
            divParent.id = 'divContainer_' + this.entity.id;
            divParent.className = 'springContainer';
            this.screen.container.appendChild(divParent);

            this.spanRange = {
                minWidth: this.optionTemplate.minWidth,
                maxWidth: this.optionTemplate.maxWidth,
                minHeight: this.optionTemplate.minHeight,
                maxHeight: this.optionTemplate.maxHeight
            };

            divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR + '%';
            divParent.style.width = this.UNIT_WIDTH * this.entity.spanC + '%';

            //便签和组合图高度超出部分要加滚动条样式
            if(this.entity.modal.type == 'ModalNote' || this.entity.modal.type == 'ModalMix'){
                scrollClass = ' gray-scrollbar scrollY'
            }

            divParent.innerHTML = '<div class="panel panel-default">'+
                (AppConfig.isReportConifgMode ? '<span class="springSeHead">' + this.optionTemplate.name + '</span>' : '') +
                '<div class="panel-body springContent' + scrollClass + '" style="position: relative;height:100%;"></div>'+
            '</div>';

            this.container = divParent.getElementsByClassName('springContent')[0];

            if (AppConfig.isReportConifgMode) {
                this.initTools();
            }

            if(this.entity.modal.type !== 'ModalMix'){
                this.spinner = new LoadingSpinner({color: '#00FFFF'});
                this.spinner.spin(this.container);
            }
            return this;
        },
        initTools: function () {
            var _this = this;
            var divParent = this.screen.container.querySelector('#divContainer_'+this.entity.id);
            //按钮容器
            var domPanel = divParent.getElementsByClassName('panel')[0];
            var divBtnCtn = document.createElement('div');
            divBtnCtn.className = 'springLinkBtnCtn';

            // 配置按钮
            var btn;
            btn = document.createElement('a');
            btn.className = 'springLinkBtn';
            btn.title = '删除控件';
            btn.href = 'javascript:;';
            btn.innerHTML = '<span class="glyphicon glyphicon-cog"></span>';
            divBtnCtn.appendChild(btn);
            btn.onclick = function(e) {
                $('.springSel').removeClass('springSel');
                $(e.target).closest('.springContainer').addClass('springSel');
                _this.modalInit();
            };

            // 删除按钮
            btn = document.createElement('a');
            btn.className = 'springLinkBtn';
            btn.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';
            divBtnCtn.appendChild(btn);
            btn.onclick = function(e){
                if (_this.chart) _this.chart.clear();
                //兼容ModalMix
                if (_this.screen.screen) {
                    _this.screen.screen.removeEntity(_this.entity.id);
                } else {
                    _this.screen.removeEntity(_this.entity.id);
                }

                $('#divContainer_' + _this.entity.id).remove();
            };

            domPanel.appendChild(divBtnCtn);
        }
    };

} ( namespace('factory.mixins') ));