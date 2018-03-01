//var ProductDownload = (function (){
//	 function ProductDownload(){
//	 }
//	 ProductDownload.prototype = {
//		show: function(){
//		    WebAPI.get('/static/views/productDownload.html')
//            this.init();
//		}
//
//		var w = window,doc = document;
//		var $id = function (id) {
//			return doc.getElementById(id);
//		};
//		var elemNodesLen = function (elems) {
//			if (!elems || typeof elems.length == 'undefined' || elems.length == 0)        return 0;
//			var len_true = 0;
//			for (var i = 0, len = elems.length; i < len; i++) {
//				if (elems[i].nodeType == 1) {
//					len_true++;
//				}
//			}
//			return len_true;
//		};
//		var elemNodes = function (elems) {
//			if (!elems || typeof elems.length == 'undefined' || elems.length == 0)        return [];
//			var data = [];
//			for (var i = 0, len = elems.length; i < len; i++) {
//				if (elems[i].nodeType == 1) {
//					data.push(elems[i]);
//				}
//			}
//			return data;
//		};
//		var dl = {
//			curr: 1,
//			interval: 5000,
//			all: 0,
//			init: function () {
//				var len = elemNodesLen($id('scroll_product_list').childNodes);
//				this.all = len;
//				/*small btn*/
//				$("#scroll_btn_list li").each(function (index, domEle) {
//					$(domEle).mouseover(function (event) {
//						dl.pause();
//						var prev = this.curr;
//						if (prev == index) {
//							return;
//						}
//						/*
//						 var elems_b = $("#scroll_product_list li");
//						 elems_b.stop();
//						 */
//						var curr = index + 1;
//						dl.timeoutSet = setTimeout(function () {
//							dl.go(curr);
//						}, 500);
//						event.stopPropagation();
//					}).mouseout(function () {
//						dl.timeoutSet && clearTimeout(dl.timeoutSet);
//						dl.play();
//					});
//				});
//				/*mouseover pause*/
//				$("#scroll_product_list").mouseover(function () {
//					dl.pause();
//				});
//				$("#scroll_product_list").mouseout(function () {
//					dl.play();
//				});
//				this.play();
//			},
//			next: function () {
//				var to;
//				if (this.curr == this.all) {
//					to = 1;
//				}
//				else {
//					to = this.curr + 1;
//				}
//				this.go(to);
//			},
//			prev: function () {
//				var to;
//				if (this.curr == 1) {
//					to = this.all
//				}
//				else {
//					to = this.curr - 1;
//				}
//				this.go(to);
//			},
//			go: function (index) {            /*设置当前li的on*/
//				var curr = this.curr;
//				if (curr == index) {
//					return;
//				}
//				var elems_b = $("#scroll_product_list li");
//				var curr_elem = elems_b.eq(curr - 1);
//				curr_elem.animate({opacity: 0}, 500, null, function () {
//					curr_elem.removeClass('on');
//				});
//				elems_b.eq(index - 1).css('opacity', 0).addClass('on').animate({opacity: 1}, 500);
//				var elems_btn = $("#scroll_btn_list li");
//				elems_btn.removeClass('on');
//				elems_btn.eq(index - 1).addClass('on');
//				var elems_download = $("#scroll_download_list li");
//				elems_download.removeClass('on');
//				elems_download.eq(index - 1).addClass('on');
//				this.curr = index;
//			},
//			pause: function () {
//				this.timeSet && clearInterval(this.timeSet);
//			},
//			play: function () {
//				this.timeSet && clearInterval(this.timeSet);
//				var e = this;
//				this.timeSet = setInterval(function () {
//					dl.next()
//				}, this.interval)
//			}
//		};
//		dl.init();
//		//$(".panel").mouseenter(function(){$(this).find('.panel-heading').css('background','#bce8f1')});
//		//$(".panel").mouseleave(function(){$(this).find('.panel-heading').css('background','white')});
//		//$(".panel>.in").prev().css('background','#bce8f1');
//		$(".panel>.panel-heading:first").css('background', '#bce8f1');
//		$(".panel").on('show.bs.collapse', function () {
//			$(this).find('.panel-heading').css('background', '#bce8f1')
//		});
//		$(".panel").on('hide.bs.collapse', function () {
//			$(this).find('.panel-heading').css('background', 'white')
//		});
//		//$(".meadiaandsupport .h1").mouseenter(function(){$(this).css('background','#bce8f1')});
//		//$(".meadiaandsupport .h1").mouseleave(function(){$(this).css('background','white')});
//		$(".mediaandsupport .list-group-item").not($(".divide-title")).mouseenter(function () {
//			$(this).css('border', '1px solid #bce8f1')
//		});
//		$(".mediaandsupport .list-group-item").not($(".divide-title")).mouseleave(function () {
//			$(this).css('border', '1px solid transparent')
//		});
//		$(".mediaandsupport .list-group-item").mouseenter(function () {
//			$(this).find('.btn').css('display', 'inline')
//		});
//		$(".mediaandsupport .list-group-item").mouseleave(function () {
//			$(this).find('.btn').css('display', 'none')
//		});
//	//$(".panel").mouseleave(function(){$(this).find('.panel-heading').css('background','white')});
//	}
//	return ProductDownload;
//})();
var ProductDownload = (function(){
    function ProductDownload(){
        this.curr = undefined;
        this.interval = undefined;
        this.all = undefined;
    }
    ProductDownload.prototype ={
        show:function(){
            WebAPI.get('/static/views/admin/productDownload.html').done(function(resultHtml){
                $('#indexMain').html(resultHtml);
            });
            this.init();
        },
        init:function(){
            this.curr = 1;
            this.interval = 5000;
            this.all = 0;
            var len = this.elemNodesLen(document.getElementById('scroll_product_list').childNodes);
            this.all = len;
            var _this = this;
            var $scrollProductList = $("#scroll_product_list");
            var $mediaAndSupport = $(".mediaandsupport .list-group-item");
            var $panel = $(".panel");
            var $divideTitle = $(".divide-title");
            /*small btn*/
            $("#scroll_btn_list li").each(function (index, domEle) {
                $(domEle).mouseover(function (event) {
                    _this.pause();
                    var prev = _this.curr;
                    if (prev == index) {
                        return;
                    }
                    /*
                     var elems_b = $("#scroll_product_list li");
                     elems_b.stop();
                     */
                    var curr = index + 1;
                    _this.timeoutSet = setTimeout(function () {
                        _this.go(curr);
                    }, 500);
                    event.stopPropagation();
                }).mouseout(function () {
                    _this.timeoutSet && clearTimeout(_this.timeoutSet);
                    _this.play();
                });
            });
            /*mouseover pause*/
            $scrollProductList.mouseover(function () {
                _this.pause();
            });
            $scrollProductList.mouseout(function () {
                _this.play();
            });
            _this.play();
            $(".panel>.panel-heading:first").css('background', '#bce8f1');
            $panel.on('show.bs.collapse', function () {
                $(this).find('.panel-heading').css('background', '#bce8f1')
            });
            $panel.on('hide.bs.collapse', function () {
                $(this).find('.panel-heading').css('background', 'white')
            });

            $mediaAndSupport.not($divideTitle).mouseenter(function () {
                $(this).css('border', '1px solid #bce8f1')
            });
            $mediaAndSupport.not($divideTitle).mouseleave(function () {
                $(this).css('border', '1px solid transparent')
            });
            $mediaAndSupport.mouseenter(function () {
                $(this).find('.btn').css('display', 'inline')
            });
            $mediaAndSupport.mouseleave(function () {
                $(this).find('.btn').css('display', 'none')
            });
        },
        next: function () {
            var to;
            if (this.curr == this.all) {
                to = 1;
            }
            else {
                to = this.curr + 1;
            }
            this.go(to);
        },
        prev: function () {
            var to;
            if (this.curr == 1) {
                to = this.all
            }
            else {
                to = this.curr - 1;
            }
            this.go(to);
        },
        go: function (index) {            /*设置当前li的on*/
            var curr = this.curr;
            if (curr == index) {
                return;
            }
            var elems_b = $("#scroll_product_list li");
            var curr_elem = elems_b.eq(curr - 1);
            curr_elem.animate({opacity: 0}, 500, null, function () {
                curr_elem.removeClass('on');
            });
            elems_b.eq(index - 1).css('opacity', 0).addClass('on').animate({opacity: 1}, 500);
            var elems_btn = $("#scroll_btn_list li");
            elems_btn.removeClass('on');
            elems_btn.eq(index - 1).addClass('on');
            var elems_download = $("#scroll_download_list li");
            elems_download.removeClass('on');
            elems_download.eq(index - 1).addClass('on');
            this.curr = index;
        },
        pause: function () {
            this.timeSet && clearInterval(this.timeSet);
        },
        play: function () {
            this.timeSet && clearInterval(this.timeSet);
            var e = this;
            this.timeSet = setInterval(function () {
                this.next()
            }, this.interval)
        },

        elemNodesLen : function (elems) {
			if (!elems || typeof elems.length == 'undefined' || elems.length == 0)return 0;
			var len_true = 0;
			for (var i = 0, len = elems.length; i < len; i++) {
				if (elems[i].nodeType == 1) {
					len_true++;
				}
			}
			return len_true;
		}
    };
    return ProductDownload;
})();