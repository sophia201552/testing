/**
 * Created by vicky on 2016/1/28.
 */

var BasicInfo = (function(){
    var _this;
    function BasicInfo(screen){
        _this = this;
        _this.screen = screen;
        _this.curNodeId = undefined;
    }

    BasicInfo.prototype.show = function(data,opt){
        var $tabCtn = $('#tabBaseInfo');

        _this.curNodeId  = opt.curNodeId;

        this.$assetId = $tabCtn.find('#iptAssetId');//资产id
        this.$assetName = $tabCtn.find('#iptAssetName'); //名称
        this.$description = $tabCtn.find('#iptDescription');//描述
        this.$brand = $tabCtn.find('#iptBrand');//品牌
        this.$assetType = $tabCtn.find('#iptAssetType');//资产类型
        //var $model = $tabCtn.find('#model');//型号
        this.$assetTag = $tabCtn.find('#iptAssetTag');//标签
        this.$serialNumber = $tabCtn.find('#iptSerialNum');//序列号
        this.$manager = $tabCtn.find('#iptManager');//责任人
        this.$status = $tabCtn.find('#selStatus');//状态

        this.$supplier = $tabCtn.find('#iptSupplier');//供应商
        this.$purchaser = $tabCtn.find('#iptPurchaser');//采购人
        this.$purchasePrice = $tabCtn.find('#iptBuyPrice');//购置价格
        this.$purchaseTime = $tabCtn.find('#iptBuyTime');//购置时间
        this.$overtime = $tabCtn.find('#iptOvertime');//过保时间
        this.$putIntoUse = $tabCtn.find('#iptUseTime');//投入使用
        this.$endTime = $tabCtn.find('#iptEndTime');//到期时间

        this.$remark = $tabCtn.find('#txtRemark');//备注
        this.$assetPhoto = $tabCtn.find('#divAssetImg');//资产照片
        this.$uploadPhoto = $tabCtn.find('#iptAssetPhoto');//上传图片
        this.$productArea = $tabCtn.find('#iptProductArea');//产地
        this.$productTime = $tabCtn.find('#iptProductTime');//出厂日期
        this.$serviceLife = $tabCtn.find('#iptServiceLife');//使用寿命
        this.$divAssetImg = $tabCtn.find('#divAssetImg').empty();
        this.$divQRCodeImg = $tabCtn.find('#divQRCodeImg').empty();

        this.$btnEditBaseInfo = $tabCtn.find('#btnEditBaseInfo');
        this.$btnSaveBaseInfo = $tabCtn.find('#btnSaveBaseInfo');
        this.$btnCancelBaseInfo = $tabCtn.find('#btnCancelBaseInfo');
        //输入框置为空
        _this.$uploadPhoto.val('');

        this.$tabCtn = $tabCtn;



        this.render(data);
        this.attachEvent();

    };

    BasicInfo.prototype.attachEvent = function(){
        this.$btnEditBaseInfo.off('click').on('click', function () {
            _this.$tabCtn.find('.form-group .divValue').attr("disabled", false);
            //id 及资产类型不可编辑
            $('#iptAssetId').attr("disabled", true);
            $('#iptAssetType').attr("disabled", true);

            _this.$btnEditBaseInfo.hide();
            _this.$btnSaveBaseInfo.show();
            _this.$btnCancelBaseInfo.show();
            _this.$assetPhoto.hide();
            _this.$uploadPhoto.show();

            /*$('.datetimepicker').datetimepicker({
                autoclose: true,
                minView: 'month',
                format: 'yyyy-mm-dd'
            })*/
            $('.datetimepicker').datetimepicker('remove');
            $('.datetimepicker').datetime();
        });

        this.$btnSaveBaseInfo.off('click').on('click', function () {
            _this.save();
            _this.$tabCtn.find('.form-group .divValue').attr("disabled", true);
            _this.$btnEditBaseInfo.show();
            _this.$btnSaveBaseInfo.hide();
            _this.$btnCancelBaseInfo.hide();
            _this.$assetPhoto.show();
            _this.$uploadPhoto.hide();
        });

        this.$btnCancelBaseInfo.off('click').on('click', function () {
            _this.$tabCtn.find('.form-group .divValue').attr("disabled", true);
            _this.$btnEditBaseInfo.show();
            _this.$btnSaveBaseInfo.hide();
            _this.$btnCancelBaseInfo.hide();
            _this.$assetPhoto.show();
            _this.$uploadPhoto.hide();
        });
        //点击查看图片
        $('#divQRCodeImg,#divAssetImg').off('click','img').on('click','img', function () {
            var imgSrc = $(this).prop('src');
            $('.showImg').off('click').on('click', function () {
                $(this).fadeOut();
            }).fadeIn().find('img').prop('src', imgSrc);
        });

        //上传图片
        this.$uploadPhoto.off('change').on('change', function(e){
            var files = e.target.files;
            if(!files) return;

            var formData = new FormData();
            formData.append('file[]', files[0]);
            formData.append('_id', _this.id);
            $.ajax({
                url: '/asset/uploadfile',
                type: 'post',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function(result){
                    if(!result.data || result.data.length == 0) return;
                    result.data.forEach(function(i){
                        _this.$divAssetImg.html('<div class="imgItem"><img src="http://images.rnbtech.com.hk/' + i + '?_=' + Date.now().valueOf() + '" class="imgAsset" id="imgAsset"/></div>');//
                    });
                }
            })
        });
    };

    BasicInfo.prototype.save = function(){
        var postData = {
            _id: _this.id,
            activeTime: this.$putIntoUse.val() + ' 00:00:00',
            brand: this.$brand.val(),
            buyer: this.$purchaser.val(),
            buyingTime: this.$purchaseTime.val() + ' 00:00:00',
            desc: this.$description.val(),
            guaranteeTime: this.$overtime.val() + ' 00:00:00',
            //lang: [2,2,2]
            //manager: "王峰",
            model: "111151137ddcf32fbc302222",
            other: this.$remark.val(),
            price: this.$purchasePrice.val(),
            sn: this.$serialNumber.val(),
            manager: this.$manager.val(),
            status: this.$status.val(),
            supplier: this.$supplier.val(),
            updateTime: new Date().format('yyyy-MM-dd HH:mm:ss'),
            endTime: this.$endTime.val() + ' 00:00:00',
            urlImg: this.$divAssetImg.find('img').attr('src'),
            //urlQRCode: "http://d.pcs.baidu.com/thumbnail/86ad5253826a49382ebeb75bfd1fe4fd?fid=144576"
            productArea: this.$productArea.val(),//产地
            productTime: this.$productTime.val(),//出厂日期
            serviceLife: this.$serviceLife.val()//使用寿命
        };
        WebAPI.post('/asset/saveThing',postData).done(function(result){
            //if(result.data){}
            var obj = postData;
            var nodeHtml = '';
            var $trTarget = $('#tbAsset').find('[data-id="'+ _this.id +'"]');
            //更新列表中的数据
            var dicStatus = {
                 '0': '外借',
                 '1': '外修',
                 '2': '使用',
                 '3': '仓库'
            };
            /*var updateTime = obj.updateTime ? obj.updateTime.split(' ')[0] : '--:--'
            var endTime = _this.$endTime.val() ? _this.$endTime.val().split(' ')[0] : '--:--';
            var status = obj.status ? dicStatus[obj.status] : '--';
            var manager  = obj.manager ? obj.manager : '--';
            var name = $trTarget.find('.name').text();
            var type = $trTarget.find('.type').text();

            $trTarget.replaceWith(
            '<tr class="selected" data-id="'+ obj._id +'" data-model="'+ obj.model +'" data-name="'+ name +'" data-type="'+ type +'" data-endtime = "'+ endTime +'">\
              <td class="type">'+ type +'</td>\
              <td class="name">'+ _this.$assetName.val() +'</td>\
              <td><div class="tdDes" title="'+ obj.desc +'">'+ obj.desc +'</div></td>\
              <td class="manager">'+ manager +'</td>\
              <td>'+ updateTime +'</td>\
              <td>'+ endTime +'</td>\
              <td>'+ status +'</td>\
            </tr>');*/

            var displayParams = _this.screen.listPanel.screen.displayParams;
            nodeHtml += ('<tr data-id="'+ obj._id +'">');
            var thing = (function(arr){
                for(var i = 0; i < arr.length; i++){
                    if(arr[i]._id == _this.id){
                        return arr[i];
                    }
                }
            }(_this.screen.filterPanel.store.things));
            for(var j = 0, item, key; j < displayParams.arrKey.length; j++){
                item = obj[displayParams.arrKey[j]];
                key = displayParams.arrKey[j];
                
                switch (key){
                    case 'endTime':
                    case 'updateTime':
                        item = item ? item.split(' ')[0] : '--:--';
                        break;
                    case 'status':
                        item = item ? dicStatus[item] : '--';
                        break;
                    case 'type':
                        item = _this.screen.filterPanel.dictClass.things[thing.type] ? _this.screen.filterPanel.dictClass.things[thing.type].name : "";
                        break;
                    case 'model':
                        continue;
                        break;
                    case 'name':
                        item = _this.$assetName.val();
                        break;
                 }
                nodeHtml += ('<td>'+ item +'</td>');
            }
            nodeHtml += '</tr>';

            $trTarget.replaceWith(nodeHtml);
        });
        var iotFilter =  _this.screen.filterPanel;
        var treeNode = iotFilter.tree.getNodeByParam('_id',_this.curNodeId);
        treeNode.name = _this.$assetName.val();
        WebAPI.post('/iot/setIotInfo', [treeNode]).done(function (result) {
            if (result.data && result.data.length == 0)return;
            $.extend(true,treeNode,AppConfig.curNode);
            iotFilter.tree.updateNode(treeNode);
            for (var  i = 0 ; i < iotFilter.store[treeNode['baseType']].length; i++){
                if (iotFilter.store[treeNode['baseType']][i]['_id'] == treeNode['_id']){
                    for (var ele in iotFilter.store[treeNode['baseType']][i]){
                        iotFilter.store[treeNode['baseType']][i][ele] = treeNode[ele]
                    }
                    break;
                }
            }
        });
    };

    BasicInfo.prototype.render = function(data){
        if(!data || !data[0] || !data[0].id) return;
        this.id = data[0].id;
        var tr = $('[data-id="'+ this.id +'"]')[0];
        var thing = (function(arr){
                for(var i = 0; i < arr.length; i++){
                    if(arr[i]._id == _this.id){
                        return arr[i];
                    }
                }
            }(_this.screen.filterPanel.store.things));
        WebAPI.get('/asset/getThingDetail/' + this.id).done(function(result){
            var result = result.data;
            if(!result || $.isEmptyObject(result)) return;
            var path = $('#spanPath').text().split('/');
            var tag = path[path.length - 2];
            var type = $('tr.selected')[0].dataset.type;
            //渲染dom
            _this.$assetId.val(result._id);//资产id
            _this.$assetName.val(thing.name);//资产名称
            _this.$description.val(result.desc);//描述
            _this.$brand.val(result.brand);//品牌
            _this.$assetType.val(_this.screen.filterPanel.dictClass.things[type]?_this.screen.filterPanel.dictClass.things[type].name:'');//资产类型
            //$model.val(data.model);//型号
            _this.$assetTag.val(tag);//标签
            _this.$serialNumber.val(result.sn);//序列号
            _this.$manager.val(result.manager);//负责人
            _this.$status.val(result.status);//状态

            _this.$supplier.val(result.supplier);//供应商
            _this.$purchaser.val(result.buyer);//采购人
            _this.$purchasePrice.val(result.price);//购置价格
            _this.$purchaseTime.val(result.buyingTime ? result.buyingTime.split(' ')[0] : '');//购置时间
            _this.$overtime.val(result.guaranteeTime ? result.guaranteeTime.split(' ')[0] : '');//过保时间
            _this.$putIntoUse.val(result.activeTime ? result.activeTime.split(' ')[0] : '');//投入使用
            _this.$endTime.val(result.endTime ? result.endTime.split(' ')[0] : '');//到期时间
            _this.$productArea.val(result.productArea ? result.productArea : '');//产地
            _this.$productTime.val(result.productTime ? result.productTime.split(' ')[0] : '');//出厂日期
            _this.$serviceLife.val(result.serviceLife ? result.serviceLife: '');//使用寿命

            _this.$remark.val(result.other ? result.other : '');//备注

            if(result.urlImg){
                _this.$divAssetImg.append('<div class="imgItem"><img src="' + result.urlImg + '?_=' + Date.now().valueOf() + '" class="imgAsset" id="imgAsset"/></div>');
            }

            if(result.urlQRCode){
                _this.$divQRCodeImg.append('<div class="imgItem"><img src="' + result.urlQRCode + '" class="imgAsset" id="imgQRCode"/></div>');
            }
        });
    };

    BasicInfo.prototype.close = function(){};

    return BasicInfo;

}());