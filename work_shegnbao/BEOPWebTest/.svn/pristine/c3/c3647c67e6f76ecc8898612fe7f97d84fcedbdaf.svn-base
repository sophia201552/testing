/**
 * Created by RNBtech on 2015/7/7.
 */

var BenchMark = (function() {
    var _this = undefined;
    function BenchMark() {//data
        _this = this;
        this.init();
    }
    BenchMark.prototype = {
        init: function(){
            var $benchWrap = $('#benchWrap');
            I18n.fillArea($benchWrap);
            //强制清空
            /*$benchWrap.find('.navTab').html('');
            $('#targetUlCt').html('');*/
            this.attachEvent();
        },
        showModal: function(menuId){
            var $dialog = $('#dialogModal');
            var energyScreen = new EnergyScreen();
            var $dialogContent = $dialog.find('#dialogContent').css({height: '90%', width: '90%', margin: 'auto', marginTop: '2.5%', backgroundColor: '#fff'});
            $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                $dialogContent.removeAttr('style').html('');
                energyScreen.workerUpdate && energyScreen.workerUpdate.terminate();
            }).modal({});

            energyScreen.id = menuId;
            energyScreen.container = $dialogContent[0];
            energyScreen.isForBencMark = true;
            energyScreen.init();
        },
        close: function(){

        },
        getData: function(callbk){
            var data = [];
            for(var i in AppConfig.projectList){
                data.push(AppConfig.projectList[i].id);
            }
            var $KPICt = $('#KPICt');
            if($KPICt[0]){
                $KPICt.css({opacity: '0.8'});
                Spinner.spin($KPICt[0]);
            }

            $KPICt.find('.spinnerMask').css({borderRadius: '5px', backgroundColor: "rgba(170,170,170,0.5)"});
            WebAPI.post('/benchmark/getAll',data).done(function(result){
                AppConfig.benchMark = JSON.parse(result);
                if(AppConfig.benchMark.length > 0){
                    _this.initDom(AppConfig.benchMark);
                    $KPICt.css({opacity: '1'});
                    if(callbk){
                        callbk();
                    }
                }

            }).fail(function(){

            }).always(function(){
                Spinner.stop();
            });
        },
        getDataByTargetId: function (id) {
            var find = null;
            var data = AppConfig.benchMark;
            for (var i = 0, row, len = data.length; i < len; i++) {
                row = data[i];
                if(row.id === id) {
                    find = row;
                    break;
                }
            }
            return find;
        },
        getMaxAndMin: function (data) {
            var max, min;
            for(var i = 0, len = data.length; i < len; i++) {
                if(data[i].value === -1) continue;
                if(max === undefined || data[i].value > max) max = data[i].value;
                if(min === undefined || data[i].value < min) min = data[i].value;
            }
            return {
                min: min,
                max: max
            }
        },
        initDom: function(data){
            var _this = this, prevRank = {};
            var $KPICt = $('#KPICt');
            var $navTab = $KPICt.find('.navTab');
            var $targetUlCt = $('#targetUlCt');
            var tempDataParent = [];
            var tempDataChildren = [];
            var tempDate = [];

            if(!data || data.length < 1) return;
            for(var i = 0; i <data.length ;i++){
                if (!data[i].parent){
                    tempDataParent.push(data[i]);
                }else {
                    tempDataChildren.push(data[i]);
                }
            }
            tempDate = tempDataParent.concat(tempDataChildren);
            for(var i = 0; i < tempDate.length; i++){
                var benchmark = tempDate[i];
                var $targetUl = $('<ul class="nav nav-stacked targetUl" data-angle="all">').attr('id',benchmark.id);
                var $liTab = undefined;

                if(!benchmark.parent){
                    $liTab = $('<li role="presentation" data-target="'+ benchmark.id +'" unit="'+ benchmark.unit +'">').attr('menu-id',benchmark.menuId);
                    $navTab.append($liTab);
                }else{
                    var isParentExist = findParent(benchmark.parent);
                    if(!isParentExist) {
                        //tempData.push(data[i]);
                        continue;
                    }
                    var $parentLi = $('.rows[parent-id="'+ benchmark.parent +'"]');
                    if($parentLi.length < 1){
                        $parentLi = $('<li class="rows">').attr('parent-id',benchmark.parent);
                        var $prevLi = $('[data-target="'+ benchmark.parent +'"]');
                        $prevLi.after($parentLi);
                    }
                    var $liTab = $('<div class="subRows" unit="'+ benchmark.unit +'">').attr('data-target', benchmark.id).attr('menu-id',benchmark.menuId);
                    $parentLi.append($liTab)
                }

                $liTab.click(function() {
                    var _that = this;
                    var targetId = $(this).attr('data-target');
                    var data = _this.getDataByTargetId(targetId);

                    var maxmin = _this.getMaxAndMin(data.list);
                    var options = {
                        range: {
                            min: maxmin.min,
                            max: maxmin.max
                        }
                    };

                    options.colors = data.desc === 0 ? ['#87E034', '#EDE24C', '#F53F52'] : ['#F53F52', '#EDE24C', '#87E034'];

                    _this.dataRangeCtrl.setOptions(options);
                    _this.dataRangeCtrl.initMarkers(data.list);
                    _this.dataRangeCtrl.show();

                    $navTab.find('.selected').removeClass('selected').children('.glyphicon').remove();
                    var $play = $('<span class="glyphicon glyphicon-play"></span>');
                    $(this).addClass('selected').append($play);
                    var unit = $(this).attr('unit');
                    $('#spanUnit span').html(unit != '' ? unit : '--');
                    $('#btnViewDetail').off('click').click(function(){
                        ScreenModal = new BenchMark(_this);
                        ScreenModal.showModal($(_that).attr('menu-id'));
                    });
                }).prepend('<span class="KPIName" title="'+ benchmark.name +'">' + benchmark.name + '</span>');

                for(var j in benchmark.list){

                    var rank = {};
                    var project = benchmark.list[j];
                    var projectName = getNameByProjectId(project.projectId);
                    var value = '--';

                    if(j > 0 && project.value == benchmark.list[j-1].value){
                        rank = prevRank;
                    }else{
                        rank = getRank(j)
                    }
                    if(project.value != -1){
                        value = project.value.toFixed(2);
                    }
                    var $orderItem = $('<li class="item" project-id="'+ project.projectId +'" style="top:'+ (j*35.5) +'px" index="'+ rank.index +'"><span class="trophy"></span><span class="rank">'+ rank.order +'</span><span class="name" title="'+ projectName +'">'+ projectName +'</span><span class="value">'+ value + '</span></li>');
                    $targetUl.append($orderItem);
                }
                $targetUlCt.append($targetUl);
            }

            $navTab.children('li:eq(0)').addClass('selected').append($('<span class="glyphicon glyphicon-play" style="-webkit-transform: rotate(-180deg) scaleX(0.8);">'));
            $targetUlCt.children('ul:eq(0)').show();
            $navTab.children('li:eq(0)').trigger('click');
            $('#benchTop').show();

            $navTab.find('[data-target]').wheelmenu({
                trigger: "click",
                animation: "fade",
                animationSpeed: "fast"
            });

            if($('#ulPages').children('li').length > 0){
                _this.renderOrder();
            }
            function getRank(i){
                var rank = {};
                i = parseInt(i);
                switch (i){
                    case 0:
                        rank.order = '1st';
                        rank.index = 1;
                        break;
                    case 1:
                        rank.order = '2st';
                        rank.index = 2;
                        break;
                    case 2:
                        rank.order = '3st';
                        rank.index = 3;
                        break;
                    default:
                        rank.order = (i+1) + 'th';
                        rank.index = i+1;
                        break;
                }
                prevRank = rank;
                return rank;
            }
            function getNameByProjectId(id){
                var name = undefined;
                for(var i in AppConfig.projectList){
                    if(AppConfig.projectList[i].id == id){
                        if(I18n.type == 'zh'){
                            name = AppConfig.projectList[i].name_cn;
                        }else if(I18n.type == 'en'){
                            name = AppConfig.projectList[i].name_english;
                        }
                    }
                }
                return name;
            }
            function findParent(parent){
                for(var i in AppConfig.benchMark){
                    var benchmark = AppConfig.benchMark[i];
                    if(benchmark.id == parent){
                        if(!benchmark.parent){
                            if($navTab.find('[data-target="'+ benchmark.id +'"]').length == 1){
                                return true;
                            }else{
                                return false;
                            }
                        }else{
                            findParent(benchmark.parent);
                        }
                    }
                }
                return false;
            }
        },
        attachEvent: function(){
            var $btnViewKPI = $('#btnViewKPI');
            var $KPICt = $('#KPICt');
            $btnViewKPI.off('click').click(function(){
                if(!AppConfig.benchMark || AppConfig.benchMark.length == 0){
                    _this.getData();
                }else if($('.navTab').children('li').length < 1){
                    _this.initDom(AppConfig.benchMark);
                }
                $btnViewKPI.children('.arrow').toggle();
                $btnViewKPI.children('.glyphicon').toggleClass('glyphicon-star-empty');
                $KPICt.toggle();
            });
        },
        refresh: function(){
            var $navTab = $('.navTab');
            $('.selectedProj').removeClass('selectedProj');
            $navTab.find('.order').remove();
            if($navTab.children('li').length < 1){
                if(AppConfig.benchMark && AppConfig.benchMark.length > 0) {
                    _this.initDom(AppConfig.benchMark);
                    _this.renderOrder();
                }
            }else{
                _this.renderOrder();
            }
        },
        renderOrder: function (){
            var $navTab = $('.navTab');
            var $list = $('.targetUl [project-id="'+ AppConfig.projectId +'"]').addClass('selectedProj');
            $list.each(function(){
                var id = $(this).parent().attr('id');
                var $all = $(this).closest('.targetUl').children('li');
                var index = $(this).attr('index');
                var len = $all.length;
                var $index = $('<span class="rankIndex">').html(index).css({color: '#FFCC00'});
                var $len = $('<span class="rankLen">').html('/' + len);
                var $order = $('<span class="order"></span>').append($index).append($len);
                $navTab.find('[data-target="'+ id +'"]').prepend($order);
            });

            $navTab.find('[data-target]').each(function(){
                var target = $(this).attr('data-target');
                if($.inArray(target, AppConfig.projectBenchmark) < 0){
                    $(this).hide();
                }else{
                    $(this).show();
                }
            });
        },
        addDataRangeCtrl: function (ctrl) {
            this.dataRangeCtrl = ctrl;
        }
    }
    return BenchMark;
})();


!function($){

  var defaults = {
		trigger: "click",
		animation: "fade",
		angle: [0,360],
		animationSpeed: "medium"
	};

   $.fn.flyIn = function (el, button, width, height, angle, step, radius, settings) {
    var d = 0;
    this.stop(true,true);
    this.each(function(index) {
      angle = (settings.angle[0] + (step * index)) * (Math.PI/180);
      var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).find("a").outerWidth()/2),
          y = Math.round(height/2 + radius * Math.sin(angle) - $(this).find("a").outerHeight()/2);

      $(this).animateRotate(360).css({
          position: 'absolute',
          opacity: 0,
          left: "50%",
          top: "50%",
          marginLeft: "-" + $(this).outerWidth() / 2,
          marginTop: "-" + $(this).outerHeight() / 2
      }).delay(d).animate({
        opacity:1,
        left: x + 'px',
        top: y + 'px'
      }, settings.animationSpeed[1]);
      d += settings.animationSpeed[0];
    });
  }

  $.fn.flyOut = function (el, button) {
    var d = 0;
    this.stop(true,true);
    $(this.get().reverse()).each(function() {
	    $(this).animateRotate(-360).delay(d).animate({
	      opacity:0,
	      left: el.outerWidth() / 2 + "px",
        top: el.outerHeight() / 2 + "px"
	    }, 150);
      d += 15;
	  }).promise().done( function() {
      el.removeClass("active").css("visibility", "hidden").hide();
      button.removeClass("active")
    });
  }

  $.fn.fadeInIcon = function (el, button, width, height, angle, step, radius, settings) {
    var d = 0;
    el.siblings('.targetUl').hide();
    this.stop(true,true);
    this.each(function(index) {
        $(this).css({
            position: 'absolute',
            opacity: 0
        }).delay(d).animate({opacity:1}, settings.animationSpeed[1]);

        d += settings.animationSpeed[0];
    });
  }

  $.fn.fadeOutIcon = function (el, button) {
      //this.stop(true,true);
      button.removeClass("active");
  }

	$.fn.hideIcon = function (button, settings) {
	  var fields = this.find(".item"),
	      el = this;
	  switch (settings.animation) {
      case 'fade':
        fields.fadeOutIcon(el, button)
        break;

      case 'fly':
        fields.flyOut(el, button)
        break;
    }

	}

	$.fn.showIcon = function (button, settings) {
	  var el = this,zindex = '6';
	  if (settings.trigger == "hover") {
	    zindex = '3';
      }
	  button.addClass("active").css({'z-index': zindex});
	  el.show();
      el.addClass("wheel active").css("visibility", "visible").show();

	  if (el.attr('data-angle')) {
      settings.angle = el.attr('data-angle')
    }

    settings = predefineAngle(settings);
	  var radius = el.width() / 2,
      fields = el.find(".item"),
      container = el,
      width = container.innerWidth(),
      height = container.innerHeight(),
      angle =  0,
      step = (settings.angle[1] - settings.angle[0]) / fields.length;

      switch (settings.animation) {
        case 'fade':
          fields.fadeInIcon(el, button, width, height, angle, step, radius, settings)
          break;

        case 'fly':
          fields.flyIn(el, button, width, height, angle, step, radius, settings)
          break;
      }
	}

	function predefineAngle (settings) {
	  var convert = false
	  if ($.type(settings.angle) == "string") {
	    try {
        if (eval(settings.angle).length > 1) convert = true
      }
      catch(err) {
        convert = false
      }
	    if (convert == true) {
	      settings.angle = JSON.parse(settings.angle);
	    } else {
	      switch (settings.angle) {
          case 'N':
            settings.angle = [180,380]
            break;
          case 'NE':
            settings.angle = [270,380]
            break;
          case 'E':
            settings.angle = [270,470]
            break;
          case 'SE':
            settings.angle = [360,470]
            break;
          case 'S':
            settings.angle = [360,560]
            break;
          case 'SW':
            settings.angle = [90,200]
            break;
          case 'W':
            settings.angle = [90,290]
            break;
          case 'NW':
            settings.angle = [180,290]
            break;
          case 'all':
            settings.angle = [0,360]
            break;
        }
	    }
    }
    return settings;
	}

	function predefineSpeed(settings) {
	  if ($.type(settings.animationSpeed) == "string") {
      switch (settings.animationSpeed) {
        case 'slow':
          settings.animationSpeed = [75,700]
          break;
        case 'medium':
          settings.animationSpeed = [50,500]
          break;
        case 'fast':
          settings.animationSpeed = [25,250]
          break;
        case 'instant':
          settings.animationSpeed = [0,0]
          break;
      }
    }
    return settings;
	}

  $.fn.wheelmenu = function(options){
    var settings = $.extend({}, defaults, options);

    settings = predefineSpeed(settings);

    return this.each(function(){
      var button = $(this)
      var el = $('#' + $(this).attr("data-target"));
      el.addClass("wheel");

      button.css("opacity", 0).animate({
        opacity: 1
      })
      if (settings.trigger == "hover") {

        button.bind({
          mouseenter: function() {
            el.showIcon(button, settings);
          }
        });

        button.bind({
          mouseleave: function() {
            el.hideIcon(button, settings);
          }
        });

      } else {
        button.click( function() {
          if (el.css('display') != 'none') {//el.css('visibility') == "visible"
            el.hideIcon(button, settings);
          } else {
            el.showIcon(button, settings);
          }
        });
      }
    });
  }
}(window.jQuery);