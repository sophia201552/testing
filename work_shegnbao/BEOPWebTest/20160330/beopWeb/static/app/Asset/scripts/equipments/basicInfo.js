/**
 * Created by vicky on 2016/1/28.
 */

var BasicInfo = (function(){
    var _this;
    function BasicInfo(){
        _this = this;
    }

    BasicInfo.prototype.show = function(data){
        var $tabCtn = $('#tabBaseInfo');
        
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
        this.$assetPhoto = $tabCtn.find('#iptAssetPhoto');//资产照片
        this.$uploadPhoto = $tabCtn.find('#iptAssetPhoto');//上传图片
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
            _this.$assetPhoto.show();

            $('.datetimepicker').datetimepicker({
                autoclose: true,
                minView: 'month',
                format: 'yyyy-mm-dd'
            })
        });

        this.$btnSaveBaseInfo.off('click').on('click', function () {
            _this.save();
            _this.$tabCtn.find('.form-group .divValue').attr("disabled", true);
            _this.$btnEditBaseInfo.show();
            _this.$btnSaveBaseInfo.hide();
            _this.$btnCancelBaseInfo.hide();
            _this.$assetPhoto.hide();
        });

        this.$btnCancelBaseInfo.off('click').on('click', function () {
            _this.$tabCtn.find('.form-group .divValue').attr("disabled", true);
            _this.$btnEditBaseInfo.show();
            _this.$btnSaveBaseInfo.hide();
            _this.$btnCancelBaseInfo.hide();
            _this.$assetPhoto.hide();
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
                        _this.$divAssetImg.html('<img src="http://images.rnbtech.com.hk/'+ i +'?_='+Date.now().valueOf()+'" class="imgAsset" id="imgAsset"/>');//
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
            urlImg: this.$divAssetImg.find('img').attr('src')
            //urlQRCode: "http://d.pcs.baidu.com/thumbnail/86ad5253826a49382ebeb75bfd1fe4fd?fid=144576"
        };
        WebAPI.post('/asset/saveThing',postData).done(function(result){
            //if(result.data){}
            var obj = postData;
            var $trTarget = $('#tbAsset').find('[data-id="'+ _this.id +'"]');
            //更新列表中的数据
            var dicStatus = {
                 '0': '已停止',
                 '1': '已启动',
                 '2': '维修中'
            }
            var updateTime = obj.updateTime ? obj.updateTime.split(' ')[0] : '--:--'
            var endTime = _this.$endTime.val() ? _this.$endTime.val().split(' ')[0] : '--:--';
            var status = obj.status ? dicStatus[obj.status] : '--';
            var manager  = obj.manager ? obj.manager : '--';
            var name = $trTarget.find('.name').text();
            var type = $trTarget.find('.type').text();

            $trTarget.replaceWith(
            '<tr class="selected" data-id="'+ obj._id +'" data-model="'+ obj.model +'" data-name="'+ name +'" data-type="'+ type +'" data-endtime = "'+ endTime +'">\
              <td class="type">'+ type +'</td>\
              <td class="name">'+ name +'</td>\
              <td><div class="tdDes" title="'+ obj.desc +'">'+ obj.desc +'</div></td>\
              <td class="manager">'+ manager +'</td>\
              <td>'+ updateTime +'</td>\
              <td>'+ endTime +'</td>\
              <td>'+ status +'</td>\
            </tr>');
        });
    };

    BasicInfo.prototype.render = function(data){
        if(!data || !data[0] || !data[0].id) return;
        this.id = data[0].id;
        var tr = $('[data-id="'+ this.id +'"]')[0];
        WebAPI.get('/asset/getThingDetail/' + this.id).done(function(result){
            var result = result.data;
            if(!result || $.isEmptyObject(result)) return;
            var path = $('#spanPath').text().split('/');
            var tag = path[path.length - 2];
            //渲染dom
            _this.$assetId.val(result._id);//资产id
            _this.$assetName.val(tr.dataset.name);//资产名称
            _this.$description.val(result.desc);//描述
            _this.$brand.val(result.brand);//品牌
            _this.$assetType.val($(tr).children('.type').text());//资产类型
            //$model.val(data.model);//型号
            _this.$assetTag.val(tag);//标签
            _this.$serialNumber.val(result.sn);//序列号
            _this.$manager.val(result.manager);//序列号
            _this.$status.val(result.status);//状态

            _this.$supplier.val(result.supplier);//供应商
            _this.$purchaser.val(result.buyer);//采购人
            _this.$purchasePrice.val(result.price);//购置价格
            _this.$purchaseTime.val(result.buyingTime ? result.buyingTime.split(' ')[0] : '');//购置时间
            _this.$overtime.val(result.guaranteeTime ? result.guaranteeTime.split(' ')[0] : '');//过保时间
            _this.$putIntoUse.val(result.activeTime ? result.activeTime.split(' ')[0] : '');//投入使用
            _this.$endTime.val(result.endTime ? result.endTime.split(' ')[0] : '');//到期时间

            _this.$remark.val(result.other ? result.other : '');//备注

            if(result.urlImg){
                _this.$divAssetImg.append('<img src="'+ result.urlImg + '?_=' +Date.now().valueOf() + '" class="imgAsset" id="imgAsset"/>');
            }

            if(result.urlQRCode){
                _this.$divQRCodeImg.append('<img src="'+ result.urlQRCode +'" class="imgAsset" id="imgQRCode"/>');
            }
        });
    };

    BasicInfo.prototype.close = function(){};

    return new BasicInfo();

}());