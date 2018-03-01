!function(c){function f(){return new Date(Date.UTC.apply(Date,arguments))}function a(){var g=new Date();return f(g.getUTCFullYear(),g.getUTCMonth(),g.getUTCDate(),g.getUTCHours(),g.getUTCMinutes(),g.getUTCSeconds(),0)}var e=function(h,g){var i=this;this.element=c(h);this.container=g.container||"body";this.language=g.language||this.element.data("date-language")||"en";this.language=this.language in d?this.language:"en";this.isRTL=d[this.language].rtl||false;this.formatType=g.formatType||this.element.data("format-type")||"standard";this.format=b.parseFormat(g.format||this.element.data("date-format")||d[this.language].format||b.getDefaultFormat(this.formatType,"input"),this.formatType);this.isInline=false;this.isVisible=false;this.isInput=this.element.is("input");this.bootcssVer=this.isInput?(this.element.is(".form-control")?3:2):(this.bootcssVer=this.element.is(".input-group")?3:2);this.component=this.element.is(".date")?(this.bootcssVer==3?this.element.find(".input-group-addon .glyphicon-th, .input-group-addon .glyphicon-time, .input-group-addon .glyphicon-calendar").parent():this.element.find(".add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar").parent()):false;this.componentReset=this.element.is(".date")?(this.bootcssVer==3?this.element.find(".input-group-addon .glyphicon-remove").parent():this.element.find(".add-on .icon-remove").parent()):false;this.hasInput=this.component&&this.element.find("input").length;if(this.component&&this.component.length===0){this.component=false}this.linkField=g.linkField||this.element.data("link-field")||false;this.linkFormat=b.parseFormat(g.linkFormat||this.element.data("link-format")||b.getDefaultFormat(this.formatType,"link"),this.formatType);this.minuteStep=g.minuteStep||this.element.data("minute-step")||5;this.pickerPosition=g.pickerPosition||this.element.data("picker-position")||"bottom-right";this.showMeridian=g.showMeridian||this.element.data("show-meridian")||false;this.initialDate=g.initialDate||new Date();this._attachEvents();this.formatViewType="datetime";if("formatViewType" in g){this.formatViewType=g.formatViewType}else{if("formatViewType" in this.element.data()){this.formatViewType=this.element.data("formatViewType")}}this.minView=0;if("minView" in g){this.minView=g.minView}else{if("minView" in this.element.data()){this.minView=this.element.data("min-view")}}this.minView=b.convertViewMode(this.minView);this.maxView=b.modes.length-1;if("maxView" in g){this.maxView=g.maxView}else{if("maxView" in this.element.data()){this.maxView=this.element.data("max-view")}}this.maxView=b.convertViewMode(this.maxView);this.wheelViewModeNavigation=false;if("wheelViewModeNavigation" in g){this.wheelViewModeNavigation=g.wheelViewModeNavigation}else{if("wheelViewModeNavigation" in this.element.data()){this.wheelViewModeNavigation=this.element.data("view-mode-wheel-navigation")}}this.wheelViewModeNavigationInverseDirection=false;if("wheelViewModeNavigationInverseDirection" in g){this.wheelViewModeNavigationInverseDirection=g.wheelViewModeNavigationInverseDirection}else{if("wheelViewModeNavigationInverseDirection" in this.element.data()){this.wheelViewModeNavigationInverseDirection=this.element.data("view-mode-wheel-navigation-inverse-dir")}}this.wheelViewModeNavigationDelay=100;if("wheelViewModeNavigationDelay" in g){this.wheelViewModeNavigationDelay=g.wheelViewModeNavigationDelay}else{if("wheelViewModeNavigationDelay" in this.element.data()){this.wheelViewModeNavigationDelay=this.element.data("view-mode-wheel-navigation-delay")}}this.startViewMode=2;if("startView" in g){this.startViewMode=g.startView}else{if("startView" in this.element.data()){this.startViewMode=this.element.data("start-view")}}this.startViewMode=b.convertViewMode(this.startViewMode);this.viewMode=this.startViewMode;this.viewSelect=this.minView;if("viewSelect" in g){this.viewSelect=g.viewSelect}else{if("viewSelect" in this.element.data()){this.viewSelect=this.element.data("view-select")}}this.viewSelect=b.convertViewMode(this.viewSelect);this.forceParse=true;if("forceParse" in g){this.forceParse=g.forceParse}else{if("dateForceParse" in this.element.data()){this.forceParse=this.element.data("date-force-parse")}}this.picker=c((this.bootcssVer==3)?b.templateV3:b.template).appendTo(this.isInline?this.element:this.container).on({click:c.proxy(this.click,this),mousedown:c.proxy(this.mousedown,this)});if(this.wheelViewModeNavigation){if(c.fn.mousewheel){this.picker.on({mousewheel:c.proxy(this.mousewheel,this)})}else{console.log("Mouse Wheel event is not supported. Please include the jQuery Mouse Wheel plugin before enabling this option")}}if(this.isInline){this.picker.addClass("datetimepicker-inline")}else{this.picker.addClass("datetimepicker-dropdown-"+this.pickerPosition+" dropdown-menu")}if(this.isRTL){this.picker.addClass("datetimepicker-rtl");if(this.bootcssVer==3){this.picker.find(".prev span, .next span").toggleClass("glyphicon-arrow-left glyphicon-arrow-right")}else{this.picker.find(".prev i, .next i").toggleClass("icon-arrow-left icon-arrow-right")}}c(document).on("mousedown",function(j){if(c(j.target).closest(".datetimepicker").length===0){i.hide()}});this.autoclose=false;if("autoclose" in g){this.autoclose=g.autoclose}else{if("dateAutoclose" in this.element.data()){this.autoclose=this.element.data("date-autoclose")}}this.keyboardNavigation=true;if("keyboardNavigation" in g){this.keyboardNavigation=g.keyboardNavigation}else{if("dateKeyboardNavigation" in this.element.data()){this.keyboardNavigation=this.element.data("date-keyboard-navigation")}}this.todayBtn=(g.todayBtn||this.element.data("date-today-btn")||false);this.todayHighlight=(g.todayHighlight||this.element.data("date-today-highlight")||false);this.weekStart=((g.weekStart||this.element.data("date-weekstart")||d[this.language].weekStart||0)%7);this.weekEnd=((this.weekStart+6)%7);this.startDate=-Infinity;this.endDate=Infinity;this.daysOfWeekDisabled=[];this.setStartDate(g.startDate||this.element.data("date-startdate"));this.setEndDate(g.endDate||this.element.data("date-enddate"));this.setDaysOfWeekDisabled(g.daysOfWeekDisabled||this.element.data("date-days-of-week-disabled"));this.fillDow();this.fillMonths();this.update();this.showMode();if(this.isInline){this.show()}};e.prototype={constructor:e,_events:[],_attachEvents:function(){this._detachEvents();if(this.isInput){this._events=[[this.element,{focus:c.proxy(this.show,this),keyup:c.proxy(this.update,this),keydown:c.proxy(this.keydown,this)}]]}else{if(this.component&&this.hasInput){this._events=[[this.element.find("input"),{focus:c.proxy(this.show,this),keyup:c.proxy(this.update,this),keydown:c.proxy(this.keydown,this)}],[this.component,{click:c.proxy(this.show,this)}]];if(this.componentReset){this._events.push([this.componentReset,{click:c.proxy(this.reset,this)}])}}else{if(this.element.is("div")){this.isInline=true}else{this._events=[[this.element,{click:c.proxy(this.show,this)}]]}}}for(var g=0,h,j;g<this._events.length;g++){h=this._events[g][0];j=this._events[g][1];h.on(j)}},_detachEvents:function(){for(var g=0,h,j;g<this._events.length;g++){h=this._events[g][0];j=this._events[g][1];h.off(j)}this._events=[]},show:function(g){this.picker.show();this.height=this.component?this.component.outerHeight():this.element.outerHeight();if(this.forceParse){this.update()}this.place();c(window).on("resize",c.proxy(this.place,this));if(g){g.stopPropagation();g.preventDefault()}this.isVisible=true;this.element.trigger({type:"show",date:this.date})},hide:function(g){if(!this.isVisible){return}if(this.isInline){return}this.picker.hide();c(window).off("resize",this.place);this.viewMode=this.startViewMode;this.showMode();if(!this.isInput){c(document).off("mousedown",this.hide)}if(this.forceParse&&(this.isInput&&this.element.val()||this.hasInput&&this.element.find("input").val())){this.setValue()}this.isVisible=false;this.element.trigger({type:"hide",date:this.date})},remove:function(){this._detachEvents();this.picker.remove();delete this.picker;delete this.element.data().datetimepicker},getDate:function(){var g=this.getUTCDate();return new Date(g.getTime()+(g.getTimezoneOffset()*60000))},getUTCDate:function(){return this.date},setDate:function(g){this.setUTCDate(new Date(g.getTime()-(g.getTimezoneOffset()*60000)))},setUTCDate:function(g){if(g>=this.startDate&&g<=this.endDate){this.date=g;this.setValue();this.viewDate=this.date;this.fill()}else{this.element.trigger({type:"outOfRange",date:g,startDate:this.startDate,endDate:this.endDate})}},setFormat:function(h){this.format=b.parseFormat(h,this.formatType);var g;if(this.isInput){g=this.element}else{if(this.component){g=this.element.find("input")}}if(g&&g.val()){this.setValue()}},setValue:function(){var g=this.getFormattedDate();if(!this.isInput){if(this.component){this.element.find("input").val(g)}this.element.data("date",g)}else{this.element.val(g)}if(this.linkField){c("#"+this.linkField).val(this.getFormattedDate(this.linkFormat))}},getFormattedDate:function(g){if(g==undefined){g=this.format}return b.formatDate(this.date,g,this.language,this.formatType)},setStartDate:function(g){this.startDate=g||-Infinity;if(this.startDate!==-Infinity){this.startDate=b.parseDate(this.startDate,this.format,this.language,this.formatType)}this.update();this.updateNavArrows()},setEndDate:function(g){this.endDate=g||Infinity;if(this.endDate!==Infinity){this.endDate=b.parseDate(this.endDate,this.format,this.language,this.formatType)}this.update();this.updateNavArrows()},setDaysOfWeekDisabled:function(g){this.daysOfWeekDisabled=g||[];if(!c.isArray(this.daysOfWeekDisabled)){this.daysOfWeekDisabled=this.daysOfWeekDisabled.split(/,\s*/)}this.daysOfWeekDisabled=c.map(this.daysOfWeekDisabled,function(h){return parseInt(h,10)});this.update();this.updateNavArrows()},place:function(){if(this.isInline){return}var g=0;c("div").each(function(){var m=parseInt(c(this).css("zIndex"),10);if(m>g){g=m}});var l=g+10;var k,j,i,h;if(this.container instanceof c){h=this.container.offset()}else{h=c(this.container).offset()}if(this.component){k=this.component.offset();i=k.left;if(this.pickerPosition=="bottom-left"||this.pickerPosition=="top-left"){i+=this.component.outerWidth()-this.picker.outerWidth()}}else{k=this.element.offset();i=k.left}if(i+220>document.body.clientWidth){i=document.body.clientWidth-220}if(this.pickerPosition=="top-left"||this.pickerPosition=="top-right"){j=k.top-this.picker.outerHeight()}else{j=k.top+this.height}j=j-h.top;i=i-h.left;this.picker.css({top:j,left:i,zIndex:l})},update:function(){var g,h=false;if(arguments&&arguments.length&&(typeof arguments[0]==="string"||arguments[0] instanceof Date)){g=arguments[0];h=true}else{g=(this.isInput?this.element.val():this.element.find("input").val())||this.element.data("date")||this.initialDate;if(typeof g=="string"||g instanceof String){g=g.replace(/^\s+|\s+$/g,"")}}if(!g){g=new Date();h=false}this.date=b.parseDate(g,this.format,this.language,this.formatType);if(h){this.setValue()}if(this.date<this.startDate){this.viewDate=new Date(this.startDate)}else{if(this.date>this.endDate){this.viewDate=new Date(this.endDate)}else{this.viewDate=new Date(this.date)}}this.fill()},fillDow:function(){var g=this.weekStart,h="<tr>";while(g<this.weekStart+7){h+='<th class="dow">'+d[this.language].daysMin[(g++)%7]+"</th>"}h+="</tr>";this.picker.find(".datetimepicker-days thead").append(h)},fillMonths:function(){var h="",g=0;while(g<12){h+='<span class="month">'+d[this.language].monthsShort[g++]+"</span>"}this.picker.find(".datetimepicker-months td").html(h)},fill:function(){if(this.date==null||this.viewDate==null){return}var E=new Date(this.viewDate),q=E.getUTCFullYear(),F=E.getUTCMonth(),j=E.getUTCDate(),z=E.getUTCHours(),u=E.getUTCMinutes(),v=this.startDate!==-Infinity?this.startDate.getUTCFullYear():-Infinity,A=this.startDate!==-Infinity?this.startDate.getUTCMonth():-Infinity,l=this.endDate!==Infinity?this.endDate.getUTCFullYear():Infinity,w=this.endDate!==Infinity?this.endDate.getUTCMonth():Infinity,n=(new f(this.date.getUTCFullYear(),this.date.getUTCMonth(),this.date.getUTCDate())).valueOf(),D=new Date();this.picker.find(".datetimepicker-days thead th:eq(1)").text(d[this.language].months[F]+" "+q);if(this.formatViewType=="time"){var B=z%12?z%12:12;var h=(B<10?"0":"")+B;var m=(u<10?"0":"")+u;var H=d[this.language].meridiem[z<12?0:1];this.picker.find(".datetimepicker-hours thead th:eq(1)").text(h+":"+m+" "+(H?H.toUpperCase():""));this.picker.find(".datetimepicker-minutes thead th:eq(1)").text(h+":"+m+" "+(H?H.toUpperCase():""))}else{this.picker.find(".datetimepicker-hours thead th:eq(1)").text(j+" "+d[this.language].months[F]+" "+q);this.picker.find(".datetimepicker-minutes thead th:eq(1)").text(j+" "+d[this.language].months[F]+" "+q)}this.picker.find("tfoot th.today").text(d[this.language].today).toggle(this.todayBtn!==false);this.updateNavArrows();this.fillMonths();var I=f(q,F-1,28,0,0,0,0),y=b.getDaysInMonth(I.getUTCFullYear(),I.getUTCMonth());I.setUTCDate(y);I.setUTCDate(y-(I.getUTCDay()-this.weekStart+7)%7);var g=new Date(I);g.setUTCDate(g.getUTCDate()+42);g=g.valueOf();var o=[];var r;while(I.valueOf()<g){if(I.getUTCDay()==this.weekStart){o.push("<tr>")}r="";if(I.getUTCFullYear()<q||(I.getUTCFullYear()==q&&I.getUTCMonth()<F)){r+=" old"}else{if(I.getUTCFullYear()>q||(I.getUTCFullYear()==q&&I.getUTCMonth()>F)){r+=" new"}}if(this.todayHighlight&&I.getUTCFullYear()==D.getFullYear()&&I.getUTCMonth()==D.getMonth()&&I.getUTCDate()==D.getDate()){r+=" today"}if(I.valueOf()==n){r+=" active"}if((I.valueOf()+86400000)<=this.startDate||I.valueOf()>this.endDate||c.inArray(I.getUTCDay(),this.daysOfWeekDisabled)!==-1){r+=" disabled"}o.push('<td class="day'+r+'">'+I.getUTCDate()+"</td>");if(I.getUTCDay()==this.weekEnd){o.push("</tr>")}I.setUTCDate(I.getUTCDate()+1)}this.picker.find(".datetimepicker-days tbody").empty().append(o.join(""));o=[];var s="",C="",p="";for(var x=0;x<24;x++){var t=f(q,F,j,x);r="";if((t.valueOf()+3600000)<=this.startDate||t.valueOf()>this.endDate){r+=" disabled"}else{if(z==x){r+=" active"}}if(this.showMeridian&&d[this.language].meridiem.length==2){C=(x<12?d[this.language].meridiem[0]:d[this.language].meridiem[1]);if(C!=p){if(p!=""){o.push("</fieldset>")}o.push('<fieldset class="hour"><legend>'+C.toUpperCase()+"</legend>")}p=C;s=(x%12?x%12:12);o.push('<span class="hour'+r+" hour_"+(x<12?"am":"pm")+'">'+s+"</span>");if(x==23){o.push("</fieldset>")}}else{s=x+":00";o.push('<span class="hour'+r+'">'+s+"</span>")}}this.picker.find(".datetimepicker-hours td").html(o.join(""));o=[];s="",C="",p="";for(var x=0;x<60;x+=this.minuteStep){var t=f(q,F,j,z,x,0);r="";if(t.valueOf()<this.startDate||t.valueOf()>this.endDate){r+=" disabled"}else{if(Math.floor(u/this.minuteStep)==Math.floor(x/this.minuteStep)){r+=" active"}}if(this.showMeridian&&d[this.language].meridiem.length==2){C=(z<12?d[this.language].meridiem[0]:d[this.language].meridiem[1]);if(C!=p){if(p!=""){o.push("</fieldset>")}o.push('<fieldset class="minute"><legend>'+C.toUpperCase()+"</legend>")}p=C;s=(z%12?z%12:12);o.push('<span class="minute'+r+'">'+s+":"+(x<10?"0"+x:x)+"</span>");if(x==59){o.push("</fieldset>")}}else{s=x+":00";o.push('<span class="minute'+r+'">'+z+":"+(x<10?"0"+x:x)+"</span>")}}this.picker.find(".datetimepicker-minutes td").html(o.join(""));var J=this.date.getUTCFullYear();var k=this.picker.find(".datetimepicker-months").find("th:eq(1)").text(q).end().find("span").removeClass("active");if(J==q){k.eq(this.date.getUTCMonth()).addClass("active")}if(q<v||q>l){k.addClass("disabled")}if(q==v){k.slice(0,A).addClass("disabled")}if(q==l){k.slice(w+1).addClass("disabled")}o="";q=parseInt(q/10,10)*10;var G=this.picker.find(".datetimepicker-years").find("th:eq(1)").text(q+"-"+(q+9)).end().find("td");q-=1;for(var x=-1;x<11;x++){o+='<span class="year'+(x==-1||x==10?" old":"")+(J==q?" active":"")+(q<v||q>l?" disabled":"")+'">'+q+"</span>";q+=1}G.html(o);this.place()},updateNavArrows:function(){var k=new Date(this.viewDate),i=k.getUTCFullYear(),j=k.getUTCMonth(),h=k.getUTCDate(),g=k.getUTCHours();switch(this.viewMode){case 0:if(this.startDate!==-Infinity&&i<=this.startDate.getUTCFullYear()&&j<=this.startDate.getUTCMonth()&&h<=this.startDate.getUTCDate()&&g<=this.startDate.getUTCHours()){this.picker.find(".prev").css({visibility:"hidden"})}else{this.picker.find(".prev").css({visibility:"visible"})}if(this.endDate!==Infinity&&i>=this.endDate.getUTCFullYear()&&j>=this.endDate.getUTCMonth()&&h>=this.endDate.getUTCDate()&&g>=this.endDate.getUTCHours()){this.picker.find(".next").css({visibility:"hidden"})}else{this.picker.find(".next").css({visibility:"visible"})}break;case 1:if(this.startDate!==-Infinity&&i<=this.startDate.getUTCFullYear()&&j<=this.startDate.getUTCMonth()&&h<=this.startDate.getUTCDate()){this.picker.find(".prev").css({visibility:"hidden"})}else{this.picker.find(".prev").css({visibility:"visible"})}if(this.endDate!==Infinity&&i>=this.endDate.getUTCFullYear()&&j>=this.endDate.getUTCMonth()&&h>=this.endDate.getUTCDate()){this.picker.find(".next").css({visibility:"hidden"})}else{this.picker.find(".next").css({visibility:"visible"})}break;case 2:if(this.startDate!==-Infinity&&i<=this.startDate.getUTCFullYear()&&j<=this.startDate.getUTCMonth()){this.picker.find(".prev").css({visibility:"hidden"})}else{this.picker.find(".prev").css({visibility:"visible"})}if(this.endDate!==Infinity&&i>=this.endDate.getUTCFullYear()&&j>=this.endDate.getUTCMonth()){this.picker.find(".next").css({visibility:"hidden"})}else{this.picker.find(".next").css({visibility:"visible"})}break;case 3:case 4:if(this.startDate!==-Infinity&&i<=this.startDate.getUTCFullYear()){this.picker.find(".prev").css({visibility:"hidden"})}else{this.picker.find(".prev").css({visibility:"visible"})}if(this.endDate!==Infinity&&i>=this.endDate.getUTCFullYear()){this.picker.find(".next").css({visibility:"hidden"})}else{this.picker.find(".next").css({visibility:"visible"})}break}},mousewheel:function(h){h.preventDefault();h.stopPropagation();if(this.wheelPause){return}this.wheelPause=true;var g=h.originalEvent;var j=g.wheelDelta;var i=j>0?1:(j===0)?0:-1;if(this.wheelViewModeNavigationInverseDirection){i=-i}this.showMode(i);setTimeout(c.proxy(function(){this.wheelPause=false},this),this.wheelViewModeNavigationDelay)},click:function(k){k.stopPropagation();k.preventDefault();var l=c(k.target).closest("span, td, th, legend");if(l.length==1){if(l.is(".disabled")){this.element.trigger({type:"outOfRange",date:this.viewDate,startDate:this.startDate,endDate:this.endDate});return}switch(l[0].nodeName.toLowerCase()){case"th":switch(l[0].className){case"switch":this.showMode(1);break;case"prev":case"next":var g=b.modes[this.viewMode].navStep*(l[0].className=="prev"?-1:1);switch(this.viewMode){case 0:this.viewDate=this.moveHour(this.viewDate,g);break;case 1:this.viewDate=this.moveDate(this.viewDate,g);break;case 2:this.viewDate=this.moveMonth(this.viewDate,g);break;case 3:case 4:this.viewDate=this.moveYear(this.viewDate,g);break}this.fill();this.element.trigger({type:l[0].className+":"+this.convertViewModeText(this.viewMode),date:this.viewDate,startDate:this.startDate,endDate:this.endDate});break;case"today":var h=new Date();h=f(h.getFullYear(),h.getMonth(),h.getDate(),h.getHours(),h.getMinutes(),h.getSeconds(),0);if(h<this.startDate){h=this.startDate}else{if(h>this.endDate){h=this.endDate}}this.viewMode=this.startViewMode;this.showMode(0);this._setDate(h);this.fill();if(this.autoclose){this.hide()}break}break;case"span":if(!l.is(".disabled")){var n=this.viewDate.getUTCFullYear(),m=this.viewDate.getUTCMonth(),o=this.viewDate.getUTCDate(),p=this.viewDate.getUTCHours(),i=this.viewDate.getUTCMinutes(),q=this.viewDate.getUTCSeconds();if(l.is(".month")){this.viewDate.setUTCDate(1);m=l.parent().find("span").index(l);o=this.viewDate.getUTCDate();this.viewDate.setUTCMonth(m);this.element.trigger({type:"changeMonth",date:this.viewDate});if(this.viewSelect>=3){this._setDate(f(n,m,o,p,i,q,0))}}else{if(l.is(".year")){this.viewDate.setUTCDate(1);n=parseInt(l.text(),10)||0;this.viewDate.setUTCFullYear(n);this.element.trigger({type:"changeYear",date:this.viewDate});if(this.viewSelect>=4){this._setDate(f(n,m,o,p,i,q,0))}}else{if(l.is(".hour")){p=parseInt(l.text(),10)||0;if(l.hasClass("hour_am")||l.hasClass("hour_pm")){if(p==12&&l.hasClass("hour_am")){p=0}else{if(p!=12&&l.hasClass("hour_pm")){p+=12}}}this.viewDate.setUTCHours(p);this.element.trigger({type:"changeHour",date:this.viewDate});if(this.viewSelect>=1){this._setDate(f(n,m,o,p,i,q,0))}}else{if(l.is(".minute")){i=parseInt(l.text().substr(l.text().indexOf(":")+1),10)||0;this.viewDate.setUTCMinutes(i);this.element.trigger({type:"changeMinute",date:this.viewDate});if(this.viewSelect>=0){this._setDate(f(n,m,o,p,i,q,0))}}}}}if(this.viewMode!=0){var j=this.viewMode;this.showMode(-1);this.fill();if(j==this.viewMode&&this.autoclose){this.hide()}}else{this.fill();if(this.autoclose){this.hide()}}}break;case"td":if(l.is(".day")&&!l.is(".disabled")){var o=parseInt(l.text(),10)||1;var n=this.viewDate.getUTCFullYear(),m=this.viewDate.getUTCMonth(),p=this.viewDate.getUTCHours(),i=this.viewDate.getUTCMinutes(),q=this.viewDate.getUTCSeconds();if(l.is(".old")){if(m===0){m=11;n-=1}else{m-=1}}else{if(l.is(".new")){if(m==11){m=0;n+=1}else{m+=1}}}this.viewDate.setUTCFullYear(n);this.viewDate.setUTCMonth(m,o);this.element.trigger({type:"changeDay",date:this.viewDate});if(this.viewSelect>=2){this._setDate(f(n,m,o,p,i,q,0))}}var j=this.viewMode;this.showMode(-1);this.fill();if(j==this.viewMode&&this.autoclose){this.hide()}break}}},_setDate:function(g,i){if(!i||i=="date"){this.date=g}if(!i||i=="view"){this.viewDate=g}this.fill();this.setValue();var h;if(this.isInput){h=this.element}else{if(this.component){h=this.element.find("input")}}if(h){h.change();if(this.autoclose&&(!i||i=="date")){}}this.element.trigger({type:"changeDate",date:this.date})},moveMinute:function(h,g){if(!g){return h}var i=new Date(h.valueOf());i.setUTCMinutes(i.getUTCMinutes()+(g*this.minuteStep));return i},moveHour:function(h,g){if(!g){return h}var i=new Date(h.valueOf());i.setUTCHours(i.getUTCHours()+g);return i},moveDate:function(h,g){if(!g){return h}var i=new Date(h.valueOf());i.setUTCDate(i.getUTCDate()+g);return i},moveMonth:function(g,h){if(!h){return g}var l=new Date(g.valueOf()),p=l.getUTCDate(),m=l.getUTCMonth(),k=Math.abs(h),o,n;h=h>0?1:-1;if(k==1){n=h==-1?function(){return l.getUTCMonth()==m}:function(){return l.getUTCMonth()!=o};o=m+h;l.setUTCMonth(o);if(o<0||o>11){o=(o+12)%12}}else{for(var j=0;j<k;j++){l=this.moveMonth(l,h)}o=l.getUTCMonth();l.setUTCDate(p);n=function(){return o!=l.getUTCMonth()}}while(n()){l.setUTCDate(--p);l.setUTCMonth(o)}return l},moveYear:function(h,g){return this.moveMonth(h,g*12)},dateWithinRange:function(g){return g>=this.startDate&&g<=this.endDate},keydown:function(k){if(this.picker.is(":not(:visible)")){if(k.keyCode==27){this.show()}return}var m=false,h,n,l,o,g;switch(k.keyCode){case 27:this.hide();k.preventDefault();break;case 37:case 39:if(!this.keyboardNavigation){break}h=k.keyCode==37?-1:1;viewMode=this.viewMode;if(k.ctrlKey){viewMode+=2}else{if(k.shiftKey){viewMode+=1}}if(viewMode==4){o=this.moveYear(this.date,h);g=this.moveYear(this.viewDate,h)}else{if(viewMode==3){o=this.moveMonth(this.date,h);g=this.moveMonth(this.viewDate,h)}else{if(viewMode==2){o=this.moveDate(this.date,h);g=this.moveDate(this.viewDate,h)}else{if(viewMode==1){o=this.moveHour(this.date,h);g=this.moveHour(this.viewDate,h)}else{if(viewMode==0){o=this.moveMinute(this.date,h);g=this.moveMinute(this.viewDate,h)}}}}}if(this.dateWithinRange(o)){this.date=o;this.viewDate=g;this.setValue();this.update();k.preventDefault();m=true}break;case 38:case 40:if(!this.keyboardNavigation){break}h=k.keyCode==38?-1:1;viewMode=this.viewMode;if(k.ctrlKey){viewMode+=2}else{if(k.shiftKey){viewMode+=1}}if(viewMode==4){o=this.moveYear(this.date,h);g=this.moveYear(this.viewDate,h)}else{if(viewMode==3){o=this.moveMonth(this.date,h);g=this.moveMonth(this.viewDate,h)}else{if(viewMode==2){o=this.moveDate(this.date,h*7);g=this.moveDate(this.viewDate,h*7)}else{if(viewMode==1){if(this.showMeridian){o=this.moveHour(this.date,h*6);g=this.moveHour(this.viewDate,h*6)}else{o=this.moveHour(this.date,h*4);g=this.moveHour(this.viewDate,h*4)}}else{if(viewMode==0){o=this.moveMinute(this.date,h*4);g=this.moveMinute(this.viewDate,h*4)}}}}}if(this.dateWithinRange(o)){this.date=o;this.viewDate=g;this.setValue();this.update();k.preventDefault();m=true}break;case 13:if(this.viewMode!=0){var j=this.viewMode;this.showMode(-1);this.fill();if(j==this.viewMode&&this.autoclose){this.hide()}}else{this.fill();if(this.autoclose){this.hide()}}k.preventDefault();break;case 9:this.hide();break}if(m){var i;if(this.isInput){i=this.element}else{if(this.component){i=this.element.find("input")}}if(i){i.change()}this.element.trigger({type:"changeDate",date:this.date})}},showMode:function(g){if(g){var h=Math.max(0,Math.min(b.modes.length-1,this.viewMode+g));if(h>=this.minView&&h<=this.maxView){this.element.trigger({type:"changeMode",date:this.viewDate,oldViewMode:this.viewMode,newViewMode:h});this.viewMode=h}}this.picker.find(">div").hide().filter(".datetimepicker-"+b.modes[this.viewMode].clsName).css("display","block");this.updateNavArrows()},reset:function(g){this._setDate(null,"date")},convertViewModeText:function(g){switch(g){case 4:return"decade";case 3:return"year";case 2:return"month";case 1:return"day";case 0:return"hour"}}};c.fn.datetimepicker=function(i){var g=Array.apply(null,arguments);g.shift();var h;this.each(function(){var l=c(this),k=l.data("datetimepicker"),j=typeof i=="object"&&i;if(!k){l.data("datetimepicker",(k=new e(this,c.extend({},c.fn.datetimepicker.defaults,j))))}if(typeof i=="string"&&typeof k[i]=="function"){h=k[i].apply(k,g);if(h!==undefined){return false}}});if(h!==undefined){return h}else{return this}};c.fn.datetimepicker.defaults={};c.fn.datetimepicker.Constructor=e;var d=c.fn.datetimepicker.dates={en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa","Su"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],meridiem:["am","pm"],suffix:["st","nd","rd","th"],today:"Today"}};var b={modes:[{clsName:"minutes",navFnc:"Hours",navStep:1},{clsName:"hours",navFnc:"Date",navStep:1},{clsName:"days",navFnc:"Month",navStep:1},{clsName:"months",navFnc:"FullYear",navStep:1},{clsName:"years",navFnc:"FullYear",navStep:10}],isLeapYear:function(g){return(((g%4===0)&&(g%100!==0))||(g%400===0))},getDaysInMonth:function(g,h){return[31,(b.isLeapYear(g)?29:28),31,30,31,30,31,31,30,31,30,31][h]},getDefaultFormat:function(g,h){if(g=="standard"){if(h=="input"){return"yyyy-mm-dd hh:ii"}else{return"yyyy-mm-dd hh:ii:ss"}}else{if(g=="php"){if(h=="input"){return"Y-m-d H:i"}else{return"Y-m-d H:i:s"}}else{throw new Error("Invalid format type.")}}},validParts:function(g){if(g=="standard"){return/hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g}else{if(g=="php"){return/[dDjlNwzFmMnStyYaABgGhHis]/g}else{throw new Error("Invalid format type.")}}},nonpunctuation:/[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,parseFormat:function(j,h){var g=j.replace(this.validParts(h),"\0").split("\0"),i=j.match(this.validParts(h));if(!g||!g.length||!i||i.length==0){throw new Error("Invalid date format.")}return{separators:g,parts:i}},parseDate:function(l,u,o,r){if(l instanceof Date){var w=new Date(l.valueOf()-l.getTimezoneOffset()*60000);w.setMilliseconds(0);return w}if(/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(l)){u=this.parseFormat("yyyy-mm-dd",r)}if(/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(l)){u=this.parseFormat("yyyy-mm-dd hh:ii",r)}if(/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(l)){u=this.parseFormat("yyyy-mm-dd hh:ii:ss",r)}if(/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(l)){var x=/([-+]\d+)([dmwy])/,m=l.match(/([-+]\d+)([dmwy])/g),g,k;l=new Date();for(var n=0;n<m.length;n++){g=x.exec(m[n]);k=parseInt(g[1]);switch(g[2]){case"d":l.setUTCDate(l.getUTCDate()+k);break;case"m":l=e.prototype.moveMonth.call(e.prototype,l,k);break;case"w":l.setUTCDate(l.getUTCDate()+k*7);break;case"y":l=e.prototype.moveYear.call(e.prototype,l,k);break}}return f(l.getUTCFullYear(),l.getUTCMonth(),l.getUTCDate(),l.getUTCHours(),l.getUTCMinutes(),l.getUTCSeconds(),0)}var m=l&&l.match(this.nonpunctuation)||[],l=new Date(0,0,0,0,0,0,0),q={},t=["hh","h","ii","i","ss","s","yyyy","yy","M","MM","m","mm","D","DD","d","dd","H","HH","p","P"],v={hh:function(s,i){return s.setUTCHours(i)},h:function(s,i){return s.setUTCHours(i)},HH:function(s,i){return s.setUTCHours(i==12?0:i)},H:function(s,i){return s.setUTCHours(i==12?0:i)},ii:function(s,i){return s.setUTCMinutes(i)},i:function(s,i){return s.setUTCMinutes(i)},ss:function(s,i){return s.setUTCSeconds(i)},s:function(s,i){return s.setUTCSeconds(i)},yyyy:function(s,i){return s.setUTCFullYear(i)},yy:function(s,i){return s.setUTCFullYear(2000+i)},m:function(s,i){i-=1;while(i<0){i+=12}i%=12;s.setUTCMonth(i);while(s.getUTCMonth()!=i){if(isNaN(s.getUTCMonth())){return s}else{s.setUTCDate(s.getUTCDate()-1)}}return s},d:function(s,i){return s.setUTCDate(i)},p:function(s,i){return s.setUTCHours(i==1?s.getUTCHours()+12:s.getUTCHours())}},j,p,g;v.M=v.MM=v.mm=v.m;v.dd=v.d;v.P=v.p;l=f(l.getFullYear(),l.getMonth(),l.getDate(),l.getHours(),l.getMinutes(),l.getSeconds());if(m.length==u.parts.length){for(var n=0,h=u.parts.length;n<h;n++){j=parseInt(m[n],10);g=u.parts[n];if(isNaN(j)){switch(g){case"MM":p=c(d[o].months).filter(function(){var i=this.slice(0,m[n].length),s=m[n].slice(0,i.length);return i==s});j=c.inArray(p[0],d[o].months)+1;break;case"M":p=c(d[o].monthsShort).filter(function(){var i=this.slice(0,m[n].length),s=m[n].slice(0,i.length);return i.toLowerCase()==s.toLowerCase()});j=c.inArray(p[0],d[o].monthsShort)+1;break;case"p":case"P":j=c.inArray(m[n].toLowerCase(),d[o].meridiem);break}}q[g]=j}for(var n=0,y;n<t.length;n++){y=t[n];if(y in q&&!isNaN(q[y])){v[y](l,q[y])}}}return l},formatDate:function(g,m,o,k){if(g==null){return""}var n;if(k=="standard"){n={yy:g.getUTCFullYear().toString().substring(2),yyyy:g.getUTCFullYear(),m:g.getUTCMonth()+1,M:d[o].monthsShort[g.getUTCMonth()],MM:d[o].months[g.getUTCMonth()],d:g.getUTCDate(),D:d[o].daysShort[g.getUTCDay()],DD:d[o].days[g.getUTCDay()],p:(d[o].meridiem.length==2?d[o].meridiem[g.getUTCHours()<12?0:1]:""),h:g.getUTCHours(),i:g.getUTCMinutes(),s:g.getUTCSeconds()};if(d[o].meridiem.length==2){n.H=(n.h%12==0?12:n.h%12)}else{n.H=n.h}n.HH=(n.H<10?"0":"")+n.H;n.P=n.p.toUpperCase();n.hh=(n.h<10?"0":"")+n.h;n.ii=(n.i<10?"0":"")+n.i;n.ss=(n.s<10?"0":"")+n.s;n.dd=(n.d<10?"0":"")+n.d;n.mm=(n.m<10?"0":"")+n.m}else{if(k=="php"){n={y:g.getUTCFullYear().toString().substring(2),Y:g.getUTCFullYear(),F:d[o].months[g.getUTCMonth()],M:d[o].monthsShort[g.getUTCMonth()],n:g.getUTCMonth()+1,t:b.getDaysInMonth(g.getUTCFullYear(),g.getUTCMonth()),j:g.getUTCDate(),l:d[o].days[g.getUTCDay()],D:d[o].daysShort[g.getUTCDay()],w:g.getUTCDay(),N:(g.getUTCDay()==0?7:g.getUTCDay()),S:(g.getUTCDate()%10<=d[o].suffix.length?d[o].suffix[g.getUTCDate()%10-1]:""),a:(d[o].meridiem.length==2?d[o].meridiem[g.getUTCHours()<12?0:1]:""),g:(g.getUTCHours()%12==0?12:g.getUTCHours()%12),G:g.getUTCHours(),i:g.getUTCMinutes(),s:g.getUTCSeconds()};n.m=(n.n<10?"0":"")+n.n;n.d=(n.j<10?"0":"")+n.j;n.A=n.a.toString().toUpperCase();n.h=(n.g<10?"0":"")+n.g;n.H=(n.G<10?"0":"")+n.G;n.i=(n.i<10?"0":"")+n.i;n.s=(n.s<10?"0":"")+n.s}else{throw new Error("Invalid format type.")}}var g=[],l=c.extend([],m.separators);for(var j=0,h=m.parts.length;j<h;j++){if(l.length){g.push(l.shift())}g.push(n[m.parts[j]])}if(l.length){g.push(l.shift())}return g.join("")},convertViewMode:function(g){switch(g){case 4:case"decade":g=4;break;case 3:case"year":g=3;break;case 2:case"month":g=2;break;case 1:case"day":g=1;break;case 0:case"hour":g=0;break}return g},headTemplate:'<thead><tr><th class="prev"><i class="icon-arrow-left"/></th><th colspan="5" class="switch"></th><th class="next"><i class="icon-arrow-right"/></th></tr></thead>',headTemplateV3:'<thead><tr><th class="prev"><span class="glyphicon glyphicon-arrow-left"></span> </th><th colspan="5" class="switch"></th><th class="next"><span class="glyphicon glyphicon-arrow-right"></span> </th></tr></thead>',contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>',footTemplate:'<tfoot><tr><th colspan="7" class="today"></th></tr></tfoot>'};b.template='<div class="datetimepicker"><div class="datetimepicker-minutes"><table class=" table-condensed">'+b.headTemplate+b.contTemplate+b.footTemplate+'</table></div><div class="datetimepicker-hours"><table class=" table-condensed">'+b.headTemplate+b.contTemplate+b.footTemplate+'</table></div><div class="datetimepicker-days"><table class=" table-condensed">'+b.headTemplate+"<tbody></tbody>"+b.footTemplate+'</table></div><div class="datetimepicker-months"><table class="table-condensed">'+b.headTemplate+b.contTemplate+b.footTemplate+'</table></div><div class="datetimepicker-years"><table class="table-condensed">'+b.headTemplate+b.contTemplate+b.footTemplate+"</table></div></div>";b.templateV3='<div class="datetimepicker"><div class="datetimepicker-minutes"><table class=" table-condensed">'+b.headTemplateV3+b.contTemplate+b.footTemplate+'</table></div><div class="datetimepicker-hours"><table class=" table-condensed">'+b.headTemplateV3+b.contTemplate+b.footTemplate+'</table></div><div class="datetimepicker-days"><table class=" table-condensed">'+b.headTemplateV3+"<tbody></tbody>"+b.footTemplate+'</table></div><div class="datetimepicker-months"><table class="table-condensed">'+b.headTemplateV3+b.contTemplate+b.footTemplate+'</table></div><div class="datetimepicker-years"><table class="table-condensed">'+b.headTemplateV3+b.contTemplate+b.footTemplate+"</table></div></div>";c.fn.datetimepicker.DPGlobal=b;c.fn.datetimepicker.noConflict=function(){c.fn.datetimepicker=old;return this};c(document).on("focus.datetimepicker.data-api click.datetimepicker.data-api",'[data-provide="datetimepicker"]',function(h){var g=c(this);if(g.data("datetimepicker")){return}h.preventDefault();g.datetimepicker("show")});c(function(){c('[data-provide="datetimepicker-inline"]').datetimepicker()})}(window.jQuery);
﻿var FactoryIoC = (function () {
    function FactoryIoC(strType) {
        this.listClass = [];
        this.init(strType);
    };

    FactoryIoC.prototype = {
        init: function (strType) {
            switch (strType) {
                case 'analysis': this.initAnalysisModule(); break;
                case 'dashboard': this.initDashboardModule(); break;
                case 'report': this.initReportModule(); break;
                default: break;
            }
        },

        add: function (entityClass) {
            this.listClass.push(entityClass);
        },

        getModel: function (strModelName) {
            for (var i = 0, len = this.listClass.length; i < len; i++) {
                if (strModelName.toLowerCase() == this.listClass[i].name.toLowerCase()) {
                    return this.listClass[i];
                }
            }
            return null;
        },

        getList: function () {
            return this.listClass;
        },

        initAnalysisModule: function () {
            this.add(AnlzTendency);
            this.add(AnlzSpectrum);
            this.add(AnlzScatter);

            //this.add(AnlzHistory);

            this.add(AnlzHistoryCompare);
            this.add(AnlzHistoryCompare_Line);
            //this.add(AnlzChart);
            this.add(AnlzStack);
            this.add(AnlzPieRealtime);
            this.add(AnlzEnergy);
            this.add(AnlzCluster);
            this.add(AnlzCluster_AHU);
            this.add(AnlzCluster_Chiller);
        },

        initDashboardModule: function () {
            this.add(ModalNone);
            this.add(ModalAnalysis);

            this.add(ModalHistoryChart);
            this.add(ModalHistoryChartNormal);//line
            this.add(ModalHistoryChartEnergyConsume);//bar
            this.add(ModalHistoryChartYearOnYearLine);
            this.add(ModalHistoryChartYearOnYearBar);

            this.add(ModalChart);
            this.add(ModalRealtimePieEnegBrkd);
            //this.add(ModalRealtimePieDataRoom);
            this.add(ModalRealtimeLineOutdoor);
            this.add(ModalRealtimeBarSub);
            //this.add(ModalRealtimeLinePUE);
            this.add(ModalRealtimeGauge);
            this.add(ModalRealtimeBarEnegBrkd);
            this.add(ModalMultiple);
            //this.add(ModalRealtimeLineEnegBrkd);

            //this.add(ModalCarbonFootprint);
            this.add(ModalWeather);
            //this.add(ModalEnergySaveRate);
            //this.add(ModalCoalSaveTotal);
            //this.add(ModalCo2SaveTotal);

            this.add(ModalKPIChart);
            this.add(ModalObserver);
            this.add(ModalPredictPointLine);
            this.add(ModalNote);
            this.add(ModalRank);
            this.add(ModalRankNormal);
            this.add(ModalMix);
            this.add(ModalHtml);
            this.add(ModalChartCustom);
            this.add(ModalPointKPI);
            this.add(ModalReportChapter);
            this.add(ModalInteract);
        },

        initReportModule: function () {
            var ns = namespace('factory.report.components');
            
            this.add(ns.Html);
            this.add(ns.Chart);
            this.add(ns.ChapterContainer);
            this.add(ns.Summary);
        }
    }

    return FactoryIoC;
})();
var modalConfigurePane = (function(){
    var _this;
    function modalConfigurePane(container,screen,modalType){
        _this = this;
        this.container = container;
        this.screen = screen;
        this.modalType = modalType;
        //data analysis or dashboard
        this.templateObj = undefined;
        this.optionType = undefined;
        //optionType--True:New chart/False:load exist option;
        this.option = undefined;
        this.dataLose = undefined;
        this.editorData = undefined;
        this.ue = undefined;
        //option = {
        //    modeUsable: []
        //    allDataNeed; bool
        //    rowDataType: []
        //    dataTypeMaxNum: []
        //    templateType; str
        //    optionPara:{
        //                dataItem:
        //                option;
        //                } for new
        //    optionPara:{
        //                mode:''
        //                startTime:
        //                endTime:
        //                interval:
        //                dataItem:{dsId,dsName,dsType
        //                          }
        //                } for exist
        //}
    }
    modalConfigurePane.prototype = {
        show: function(){
            WebAPI.get("/static/views/observer/widgets/modalConfigurePane.html").done(function (resultHtml) {
                _this.container.innerHTML += resultHtml;
                if (_this.modalType == "dataAnalysis"){
                    document.getElementById('startConfig').setAttribute('i18n','modalConfig.btnStartConfig.TYPE1');
                }else if(_this.modalType == "dashboard"){
                    document.getElementById('startConfig').setAttribute('i18n','modalConfig.btnStartConfig.TYPE2');
                }
                I18n.fillArea($('#modalConfig'));
            });
        },
        showModalInit: function(optionType,option,templateObj){
            this.optionType = optionType;
            this.option = option;
            this.templateObj = templateObj;
            //if(!_this.option.dataTypeMaxNum){
            //    _this.option.dataTypeMaxNum = [];
            //    for (var i = 0;i<this.option.rowDataType.length;i++){
            //        _this.option.dataTypeMaxNum[i] = 5
            //    }
            //}else{
            //    if (_this.option.dataTypeMaxNum.length != _this.option.rowDataType.length){
            //        for (var i = _this.option.dataTypeMaxNum.length;i<this.option.rowDataType.length;i++){
            //            _this.option.dataTypeMaxNum[i] = _this.option.dataTypeMaxNum[_this.option.dataTypeMaxNum.length - 1]
            //        }
            //    }
            //}
            this.init();
            if (_this.option.templateType == "ModalNote") {
                _this.initEditor();
            }

            $('#modalConfig').modal('show');
        },
        init: function () {
            var $modalConfig = $('#modalConfig');
            var $inputRealTimeInterval = $('#inputRealTimeInterval')
            var $labelText = $('#divRealTimeInterval label');
            var $option30s = $('#inputRealTimeInterval option[value = "30s"]');
            var $option10m = $('#inputRealTimeInterval option[value = "10m"]');
            var $option30m = $('#inputRealTimeInterval option[value = "30m"]');
            var $optionh1 = $('#inputRealTimeInterval option[value = "h1"]');
            var $optiond1 = $('#inputRealTimeInterval option[value = "d1"]');
            var $optionM1 = $('#inputRealTimeInterval option[value = "M1"]');
            $modalConfig.off('show.bs.modal').on('show.bs.modal', function (e) {
                if(e.namespace !== 'bs.modal' ) return true;
                _this.initOption();
                _this.initConfigData();
                $('#inputAddGroup').click(function(e){
                    $(e.target).focus();
                });
                if(_this.modalType =="dashboard"){
                    _this.toggleDataSource(true);
                }
                if (_this.templateObj instanceof ModalRealtimeLineOutdoor){//当配置框添加的为实时折线图，改变一些样式
                    if(!_this.templateObj.entity.modal.option){
                        $inputRealTimeInterval.find('option[value= "m5"]').attr('selected' ,true);//默认选中m5
                    }else if (_this.templateObj.entity.modal.option.timeFormat){
                        $inputRealTimeInterval.find('option[value=' +_this.templateObj.entity.modal.option.timeFormat + ']').attr('selected' ,true);
                    }
                    $labelText.text('采样周期');
                    $optionh1.show();
                    $optiond1.show();
                    $optionM1.show();
                    $option30s.hide();
                    $option10m.hide();
                    $option30m.hide();
                }else {//不是实时折线图清空改变的样式
                    $labelText.text('刷新间隔');
                    $optionh1.hide();
                    $optiond1.hide();
                    $optionM1.hide();
                    $option30s.show();
                    $option10m.show();
                    $option30m.show();
                }
            });
            $modalConfig.off('shown.bs.modal').on('shown.bs.modal', function () {
                _this.initTime();
                //$('.rowDataType').each(function(){
                //    _this.initDataTypeWidth($(this));
                //});
                _this.initDrag();
                _this.initConfigStart();
            });
            $modalConfig.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                $modalConfig.find('#dataConfig').html('<div><span I18n="modalConfig.data.DATA_CONFIG_TITLE"></span></div>');
                I18n.fillArea($modalConfig.find('#dataConfig'));
                if(_this.modalType =="dashboard"){
                    _this.toggleDataSource(false);
                }
                $('#divChartPointCog').css('display','none');
                _this.dataLose = undefined;
            });
        },
        toggleDataSource: function(bool){
            var colCount = $('#paneContent')[0].classList.contains('col-sm-10');
            var ele = null;

            if(bool && colCount){
                ele = document.getElementById('rightCt');
                ele && ele.click();
            }
            if(!bool && !colCount){
                ele = document.getElementById('rightCt');
                ele && ele.click();
            }
        },
        initDataTypeWidth: function(ele){
            if (window.innerWidth > 1200 ){
                if( ele.outerWidth() < ele.parent().outerWidth() / 4){
                    ele.addClass('col-lg-3');
                }else if(ele.outerWidth() < ele.parent().outerWidth() / 2){
                    ele.addClass('col-lg-6');
                }else if (ele.outerWidth() < ele.parent().outerWidth() * 3 / 4){
                    ele.addClass('col-lg-9');
                }else{
                    ele.addClass('col-lg-12');
                }
            }else{
                if(ele.outerWidth() < ele.parent().outerWidth() / 3){
                    ele.addClass('col-xs-4');
                }else if(ele.outerWidth() < ele.parent().outerWidth() * 2 / 3){
                    ele.addClass('col-xs-8');
                }else{
                    ele.addClass('col-xs-12');
                }
            }
        },
        initOption: function(){
            var $inputMode = $('#inputMode');
            var $divMode = $inputMode.parent();

            var $inputInterval = $('#inputInterval');
            var $divInterval = $inputInterval.parent();

            var $divInputGroupPeriod = $('#divInputGroupPeriod');
            var $divPeriod = $divInputGroupPeriod.parent();
            var $inputPeriodUnit = $('#inputPeriodUnit');
            var $inputPeriodValue = $('#inputPeriodValue');
            var $inputPeriodDropDown = $('#inputPeriodDropDown');
            var $divPeriodDropDown = $inputPeriodDropDown.parent();

            var $divInputGroupTimeRange = $('#divInputGroupTimeRange');
            var $divTimeRange = $divInputGroupTimeRange.parent();
            var $inputTimeStart = $('#inputTimeStart');
            var $inputTimeEnd = $('#inputTimeEnd');

            var $gaugeMode = $('#gaugeMode');
            var $divGaugeMode = $gaugeMode.parent();
            var $divGauge = $('#divGauge');
            var $gaugeLowerLimit = $('#gaugeLowerLimit');
            var $gaugeUpperLimit = $('#gaugeUpperLimit');
            var $normalLowerLimit = $('#normalLowerLimit');
            var $normalUpperLimit = $('#normalUpperLimit');

            var $inputComparePeriod = $('#inputComparePeriod');
            var $divComparePeriod = $inputComparePeriod.parent();
            var $inputCompareDate1 = $('#inputCompareDate1');
            var $inputCompareDate2 = $('#inputCompareDate2');
            var $divCompareDate = $('#divCompareDate');

            var $inputRealTimeInterval = $('#inputRealTimeInterval');
            var $divRealTimeInterval = $inputRealTimeInterval.parent();

            var $divHistoryRange = $('#divHistoryRange');
            var $inputHistoryRange = $('#inputHistoryRange');
            //var $divModeSelect = $('#divModeSelect');
            //var $divDefaultMode = $('#divDefaultMode');

            var $divChartSelect = $('#divChartSelect');
            var i;
            var totalModeType = {
                    easy: [$divPeriodDropDown],
                    fixed: [$divInterval, $divTimeRange],
                    recent: [$divInterval, $divPeriod],
                    realTime: [],
                    easyEnergy: [$divPeriodDropDown],
                    realTimeDashboard: [$divRealTimeInterval],
                    easyCompareAnalyz: [$divCompareDate],
                    easyCompare: [$divComparePeriod],
                    compareSensor: [$divInterval, $divComparePeriod, $divCompareDate],
                    compareMeter: [$divInterval, $divComparePeriod, $divCompareDate],
                    gauge: [$divGauge, $divGaugeMode],
                    weather: [],
                    easyHistory: [$divHistoryRange],
                    easyHistorySelect: [$divHistoryRange,$divChartSelect],
                    multiple: [$divRealTimeInterval],
                    modalRankNormal: [$divPeriodDropDown]
                }
            ;

            //模式选择初始化
            var $dataConfig = $('#dataConfig');
            var $startConfig = $('#startConfig');

            $dataConfig.css('display','block');
            $startConfig.removeClass('alwaysEnable');
            $inputMode.children().css('display','none');
            var modeSelectInit = false;
            for (i = 0; i < _this.option.modeUsable.length; i++) {
                $inputMode.children('option[value=' + _this.option.modeUsable[i] + ']').css('display', 'block');
                if (_this.optionType) {
                    if (sessionStorage.getItem('mode') == _this.option.modeUsable[i] && !modeSelectInit) {
                        $inputMode.val(_this.option.modeUsable[i]);
                        modeSelectInit = true;
                    }
                }else{
                    if (_this.option.modeUsable[i] == 'fixed' && !modeSelectInit) {
                        $inputMode.val('fixed');
                        modeSelectInit = true;
                    }
                }
            }
            if (!modeSelectInit){
                $inputMode.val(_this.option.modeUsable[0]);
            }
            function initMode(mode){
                sessionStorage.setItem('mode', $inputMode.val());
                $divMode.siblings().css('display','none');
                $inputInterval.children().removeClass('forbid');
                for (var i = 0;i < totalModeType[mode].length;i++){
                    totalModeType[mode][i].css('display','block');
                }
                switch (mode) {
                    case 'easy':
                        initPeriodDropDown(mode);
                        initInterval(mode);
                        break;
                    case 'recent':
                        initInterval(mode);
                        break;
                    case 'easyEnergy':
                        initPeriodDropDown(mode);
                        initInterval(mode);
                        break;
                    case 'weather':
                        $dataConfig.css('display','none');
                        $startConfig.addClass('alwaysEnable');
                        break;
                    case 'easyCompareAnalyz':
                        $inputComparePeriod.val('month');
                        //initCompareDate();
                        break;
                    case 'easyCompare' :
                        $inputComparePeriod.val('day');
                        break;
                    default :
                        break;
                }
            }
            //间隔单位选择初始化
            if(this.optionType){
                if(sessionStorage.getItem('interval') != null ){
                    if ($inputInterval.children('option[value="'+ sessionStorage.getItem('interval') + '"]').hasClass('forbid')){
                        $inputInterval.val($inputInterval.children(':not(.forbid)').first());
                    }else{
                        $inputInterval.val(sessionStorage.getItem('interval'));
                    }
                }else{
                    sessionStorage.setItem('interval',$inputInterval.val());
                }
            }else{
                if(_this.option.optionPara.interval){
                    $inputInterval.val(_this.option.optionPara.interval);
                }else{
                    $inputInterval.val($inputInterval.children(':not(.forbid)').first());
                }
                //设置时间输入框精确度
                this.setTimePrecision($inputInterval.val(), $inputTimeStart, $inputTimeEnd);
            }
            $inputInterval.off('change').change(function(e){
                sessionStorage.setItem('interval', $(e.target).val());
                //设置时间输入框时间精度
                _this.setTimePrecision(this.value, $inputTimeStart, $inputTimeEnd)
            });
            function initInterval(mode) {
                $inputInterval.children().addClass('forbid');
                if (mode == 'recent') {
                    switch ($inputPeriodUnit.children(':selected').val()) {
                        case 'second' :
                            firstSelect = 'm5';
                            secondSelect = 'm1';
                            break;
                        case 'minute' :
                            firstSelect = 'm5';
                            secondSelect = 'm1';
                            break;
                        case 'hour':
                            firstSelect = 'h1';
                            secondSelect = 'm5';
                            break;
                        case 'day' :
                            firstSelect = 'd1';
                            secondSelect = 'h1';
                            break;
                        case 'month' :
                            firstSelect = 'M1';
                            secondSelect = 'd1';
                            break;
                    }
                    $inputInterval.find('option[value="' + secondSelect + '"]').removeClass('forbid');
                }
                if (mode == 'easy') {
                    //sessionStorage.setItem('periodDropDown', $inputPeriodDropDown.val());
                    switch ($inputPeriodDropDown.val()) {
                        case 'today' :
                            firstSelect = 'h1';
                            break;
                        case 'yesterday' :
                            firstSelect = 'h1';
                            break;
                        case 'thisWeek':
                            firstSelect = 'd1';
                            break;
                        case 'lastWeek' :
                            firstSelect = 'd1';
                            break;
                        case 'thisYear' :
                            firstSelect = 'M1';
                            break;
                    }
                }
                $inputInterval.find('option[value="' + firstSelect + '"]').removeClass('forbid').attr('selected',true);
                sessionStorage.setItem('interval',$inputInterval.val());
            }
            //周期初始化
            var firstSelect,secondSelect;
            if(this.optionType) {
                if (sessionStorage.getItem('periodValue')){
                    $inputPeriodValue.val(sessionStorage.getItem('periodValue'));
                }
                if (sessionStorage.getItem('periodUnit')){
                    $inputPeriodUnit.val(sessionStorage.getItem('periodUnit'));
                }
                if (sessionStorage.getItem('periodDropDown')){
                    if ($inputPeriodDropDown.children('option[value="'+ sessionStorage.getItem('periodDropDown') + '"]').hasClass('forbid')){
                        $inputPeriodDropDown.val($inputPeriodDropDown.children(':not(.forbid)').first());
                    }
                    $inputPeriodDropDown.val(sessionStorage.getItem('periodDropDown'));
                }
            }
            $inputPeriodValue.off('change').change(function(e){
                sessionStorage.setItem('periodValue', e.target.value)
            });
            $inputPeriodUnit.off('change').change(function(e){
                sessionStorage.setItem('periodUnit',e.target.value);
               initInterval($inputMode.val());
            });
            $divPeriodDropDown.off('change').change(function(e){
                sessionStorage.setItem('periodDropDown',e.target.value);
                initInterval($inputMode.val());
            });

            //快速配置周期初始化
            function initPeriodDropDown(mode){
                $inputPeriodDropDown.children('').removeClass('forbid');
                if(mode == 'easy'){
                    $inputPeriodDropDown.children().eq(1).addClass('forbid');
                }else if(mode == 'easyEnergy') {
                    $inputPeriodDropDown.children().eq(2).addClass('forbid');
                    $inputPeriodDropDown.children().eq(4).addClass('forbid');
                    $inputPeriodDropDown.children().eq(5).addClass('forbid');
                }
            }
            //时间范围和对比时间范围初始化
            if(_this.optionType && sessionStorage.getItem('anlzTimeStart') != null){
                $inputTimeStart.val(sessionStorage.getItem('anlzTimeStart'));
                $inputCompareDate1.val(sessionStorage.getItem('anlzTimeStart'));
            }else{
                $inputTimeStart.val(_this.option.optionPara.startTime);
                $inputCompareDate1.val(_this.option.optionPara.startTime);
            }
            $inputTimeStart.off('change').change(function(e){
                if (e.target.value !=''){
                    sessionStorage.setItem('anlzTimeStart', e.target.value)
                }
            });
            $inputCompareDate1.off('change').change(function(e){
                if (e.target.value !=''){
                    sessionStorage.setItem('anlzTimeStart', e.target.value)
                }
            });
            if(_this.optionType && sessionStorage.getItem('anlzTimeEnd') != null) {
                $inputTimeEnd.val(sessionStorage.getItem('anlzTimeEnd'));
                $inputCompareDate2.val(sessionStorage.getItem('anlzTimeEnd'));
            }else {
                $inputTimeEnd.val(_this.option.optionPara.endTime);
                $inputCompareDate2.val(_this.option.optionPara.endTime);
            }
            $inputTimeEnd.off('change').change(function(e){
                if (e.target.value !=''){
                    sessionStorage.setItem('anlzTimeEnd', e.target.value)
                }
            });
            $inputCompareDate2.off('change').change(function(e){
                if (e.target.value !=''){
                    sessionStorage.setItem('anlzTimeEnd', e.target.value)
                }
            });
            //历史同比时间初始化
            if (_this.option.optionPara.timeType && $inputMode.val() == 'easyCompareAnalyz'){
                $inputComparePeriod.val(_this.option.optionPara.timeType);
            }else if (sessionStorage.getItem('comparePeriodAnalyz') != null){
                $inputComparePeriod.val(sessionStorage.getItem('comparePeriodAnalyz'));
            }

            if (_this.option.optionPara.timeType && $inputMode.val() == 'easyCompare'){
                $inputComparePeriod.val(_this.option.optionPara.timeType);
            }else if (sessionStorage.getItem('comparePeriod') != null){
                $inputComparePeriod.val(sessionStorage.getItem('comparePeriod'));
            }
            $inputComparePeriod.change(function(e){
                sessionStorage.setItem('comparePeriod',$inputComparePeriod.val());
            });

            //gaugeMode初始化
            if(sessionStorage.getItem('gaugeMode') != null) {
                $gaugeMode.val(sessionStorage.getItem('gaugeMode'))
            }
            $gaugeMode.change(function(){
                sessionStorage.setItem('gaugeMode',$gaugeMode.val())
            });
            initGaugeMode();
            $gaugeMode.change(function(){
                initGaugeMode();
            });
            function initGaugeMode(){
                var green = '<span class="input-group-addon gaugeGreen" i18n="modalConfig.option.GAUGE_GREEN"></span>';
                var red = '<span class="input-group-addon gaugeRed" i18n="modalConfig.option.GAUGE_RED"></span>';
                if($gaugeMode.val() == 'high'){
                    $gaugeLowerLimit.next().remove();
                    $gaugeLowerLimit.after(green);
                    $normalUpperLimit.next().remove();
                    $normalUpperLimit.after(red);
                }else if($gaugeMode.val() == 'low'){
                    $gaugeLowerLimit.next().remove();
                    $gaugeLowerLimit.after(red);
                    $normalUpperLimit.next().remove();
                    $normalUpperLimit.after(green);

                }
                I18n.fillArea($('#divGauge'));
            }
            if(_this.option.optionPara.scaleList){
                _this.option.optionPara.scaleList.sort(function(a,b){
                        return a > b ? 1: -1
                    });
            }
            if(_this.optionType && sessionStorage.getItem('gaugeLowerLimit') != null){
                $gaugeLowerLimit.val(sessionStorage.getItem('gaugeLowerLimit'))
            }else if(!_this.optionType && _this.option.optionPara.scaleList){
                $gaugeLowerLimit.val(_this.option.optionPara.scaleList[0])
            }
            $gaugeLowerLimit.change(function(){
                sessionStorage.setItem('gaugeLowerLimit',$gaugeLowerLimit.val())
            });
            if(_this.optionType && sessionStorage.getItem('gaugeUpperLimit') != null){
                $gaugeUpperLimit.val(sessionStorage.getItem('gaugeUpperLimit'))
            }else if(!_this.optionType && _this.option.optionPara.scaleList){
                $gaugeUpperLimit.val(_this.option.optionPara.scaleList[3])
            }
            $gaugeUpperLimit.change(function(){
                sessionStorage.setItem('gaugeUpperLimit',$gaugeUpperLimit.val())
            });
            if(_this.optionType && sessionStorage.getItem('normalLowerLimit') != null){
                $normalLowerLimit.val(sessionStorage.getItem('normalLowerLimit'))
            }else if(!_this.optionType && _this.option.optionPara.scaleList){
                $normalLowerLimit.val(_this.option.optionPara.scaleList[1])
            }
            $normalLowerLimit.change(function(){
                sessionStorage.setItem('normalLowerLimit',$normalLowerLimit.val())
            });
            if(_this.optionType && sessionStorage.getItem('normalUpperLimit') != null){
                $normalUpperLimit.val(sessionStorage.getItem('normalUpperLimit'))
            }else if(!_this.optionType && _this.option.optionPara.scaleList){
                $normalUpperLimit.val(_this.option.optionPara.scaleList[2])
            }
            $normalUpperLimit.change(function(){
                sessionStorage.setItem('normalUpperLimit',$normalUpperLimit.val())
            });
            //dashboard实时图刷新周期初始化
            if (_this.option.optionPara.timeType && ($inputMode.val() == 'realTimeDashboard'|| $inputMode.val() == 'multiple')){
                $inputHistoryRange.val(_this.option.optionPara.timeType);
            }else if (sessionStorage.getItem('historyRange') != null){
                $inputHistoryRange.val(sessionStorage.getItem('historyRange'));
            }
            $inputHistoryRange.change(function(){
                sessionStorage.setItem('historyRange',$inputHistoryRange.val());
            });

            //快速配置历史范围初始化
            if (_this.option.optionPara.timeType && ($inputMode.val() == 'easyHistory' || $inputMode.val() == 'easyHistorySelect')){
                $inputHistoryRange.val(_this.option.optionPara.timeType);
            }else if (sessionStorage.getItem('historyRange') != null){
                $inputHistoryRange.val(sessionStorage.getItem('historyRange'));
            }
            $inputHistoryRange.change(function(){
                sessionStorage.setItem('historyRange',$inputHistoryRange.val());
            })
            initMode($inputMode.val());
            $inputMode.change(function(e){
                initMode($inputMode.val())
            });


            if ('AnlzTendency' == this.option.templateType) {
                $('#dataConfig').css('height', '100%');
                $('#modifyChart').show();
                if (this.optionType) {  // new
                    $('#modifyChartTitle').val('');
                    $('#modifyChartYMax').val('');
                    $('#modifyChartYMin').val('');
                    $('#modifyChartYMark').val('');
                    $('#modifyChartYUnitName').val('');
                    //$('#modifyChartYUnitEx').val('');
                    $('#modifyChartYUnitEx')[0].selectedIndex =0;
                }
                else {  // open
                    var opt = _this.screen.curModal.chartOption;
                    if (opt) {
                        $('#modifyChartTitle').val(opt.chartName);
                        $('#modifyChartYMax').val(opt.yMax);
                        $('#modifyChartYMin').val(opt.yMin);
                        $('#modifyChartYMark').val(opt.yMark);

                        var yUnit = opt.yUnit;
                        var flag = ' ';
                        var index = yUnit.indexOf(flag);
                        $('#modifyChartYUnitName').val(yUnit.substr(0, index));
                        if (yUnit.substr(index + 1)) {
                            $('#modifyChartYUnitEx').val(yUnit.substr(index + 1));
                        } else {
                            $('#modifyChartYUnitEx')[0].selectedIndex = 0;
                        }
                        
                    }
                }
            }
            else {
                $('#dataConfig').css('height', '350px');
                $('#modifyChart').hide();
            }
            $('#modifyChart .anlsModifyCobfig').off('click').click(function () {
                if ($('#modifyChart .row').is(':visible')) {
                    $('#modifyChart .row').hide();
                } else {
                    $('#modifyChart .row').show();
                }
            });
        },
        initConfigData: function(){
            var $dataConfig = $('#dataConfig');
            $dataConfig.html('<div><span I18n="modalConfig.data.DATA_CONFIG_TITLE"></span></div>');
            //var strDataTitle = '<span>'+ I18n.resource.modalConfig.data.DATA_CONFIG_TITLE_TYPE1 + '</span>';
            //var strTempDataMaxNum = '<span>'+ I18n.resource.modalConfig.data.DATA_TYPE_MAX_NUM + '</span>';
            //var arrTempDataMaxNum = [];

            //for (var i = 0;i < _this.option.dataTypeMaxNum.length; ++i){
            //    arrTempDataMaxNum.push(strTempDataMaxNum.replace('<%maxNum%>',_this.option.dataTypeMaxNum[i]));
            //}
            var strConfigModalBody = $dataConfig.html();
            var strDataTypeShowName = [];
            if(_this.option.rowDataTypeShowName){
                for (var i = 0;i < _this.option.rowDataType.length;++i) {
                    strDataTypeShowName.push(_this.option.rowDataTypeShowName[_this.option.rowDataType[i]])
                }
            }else{
                strDataTypeShowName = _this.option.rowDataType;
            }
            for (var i = 0; i < _this.option.rowDataType.length; ++i) {
                strConfigModalBody += '<div class="divConfigData" dataType="' + _this.option.rowDataType[i] + '">\
                                                <div class="dataTypeName">' +
                                                strDataTypeShowName[i]  +
                                                '</div>\
                                                <span class="chartPointCog glyphicon glyphicon-cog grow"></span>\
                                                <div class="row rowDataValue"><div class="dataDragTip col-lg-3 col-xs-4"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></div></div>\
                                    </div>';
            }
            $dataConfig.html(strConfigModalBody);
            var btnStartConfigEnable;
            for(i = 0;i < _this.option.optionPara.dataItem.length;++i){
                var $dataDragTip = $dataConfig.find('[dataType="'+_this.option.optionPara.dataItem[i].dsType +'"]').find('.dataDragTip');
                if ($dataDragTip.length ==0){
                    $dataDragTip = $('.dataDragTip').eq(i);
                }
                var strDSConfig;
                var loseJudge;
                for(var j= 0;j < _this.option.optionPara.dataItem[i].dsId.length;++j) {
                    loseJudge = "ptExist";
                    if (_this.option.optionPara.dataItem[i].dsName[j] == undefined){
                        _this.option.optionPara.dataItem[i].dsName[j] = I18n.resource.modalConfig.data.DATA_LOSE;
                        _this.dataLose = true;
                        loseJudge = "ptLose";
                    }
                    strDSConfig= '<div class="col-lg-3 col-xs-4 divDSConfigure grow '+ loseJudge + '" dsid="' + _this.option.optionPara.dataItem[i].dsId[j] + '"><span class="contentDS" title="'+ _this.option.optionPara.dataItem[i].dsName[j] +'">' +
                    _this.option.optionPara.dataItem[i].dsName[j] +
                    '</span><span class="glyphicon glyphicon-remove btnRemoveDS" aria-hidden="true" ></span></div>';
                    $dataDragTip.before(strDSConfig);
                    btnStartConfigEnable = true;
                }
            }
            if (_this.modalType == "dataAnalysis"){
                $('.chartPointCog').css('display','none');
            }else if(_this.modalType == "dashboard"){
                $('.chartPointCog').css('display','');
            }
            $dataConfig.off('click').on('click','.chartPointCog',function(e){
                $('#divChartPointCog').css('display','block');
                _this.initChartPtCog($('.chartPointCog').index($(e.target)))
            });
            if (_this.dataLose){
                new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE11 + "</strong>").show().close();
            }
            initDataTipAndButton();
            $('.alwaysEnable').removeClass('disabled');
            $('.divDSConfigure span').on('click', function (e) {
                var $thisPar = $(e.target).parent();
                $thisPar.remove();
                if($('.ptLose').length == 0){
                    _this.dataLose = false;
                }
                initDataTipAndButton();

                $('#dataConfig').css('height','100%');
            });
            //initDataTipAndButton
            function initDataTipAndButton() {
                var NumOfDataTypeWithValue = 0;
                var $rowDataValue = $('.rowDataValue');
                for (var i =0;i< $rowDataValue.length;++i){
                    if($rowDataValue.eq(i).children().length > 1){
                        NumOfDataTypeWithValue += 1;
                    }
                    //if($rowDataValue.eq(i).children().length > _this.option.dataTypeMaxNum[i]){
                    //    $('.dataDragTip').get(i).style.display = 'none';
                    //}else{
                    //    $('.dataDragTip').get(i).style.display = 'block';
                    //}
                }
                if (_this.option.allDataNeed == true){
                    if(NumOfDataTypeWithValue == $rowDataValue.length){
                        $('#startConfig').removeClass('disabled');
                    }else{
                        $('#startConfig').addClass('disabled');
                    }
                }else{
                    if (NumOfDataTypeWithValue){
                        $('#startConfig').removeClass('disabled');
                    }else{
                        $('#startConfig').addClass('disabled');
                    }
                }

                if (_this.dataLose){
                     $('#startConfig').addClass('disabled');
                }
                //如果是便签,无论是否拖点,都是enable
                if(_this.templateObj && _this.templateObj.entity.modal.type == 'ModalNote'){
                    $('#startConfig').removeClass('disabled');
                }
            }

            _this.renderEditor();
        },
        initChartPtCog: function(index){
            var $inputUpper = $('#inputPtValUpper');
            var $inputLower = $('#inputPtValLower');
            var $inputUnit = $('#inputPtUnit');
            var $inputAccuracy = $('#inputPtAccuracy');
            var $inputLineVal1 = $('#inputLineVal1');
            var $inputLineName1 = $('#inputLineName1');
            var $inputLineVal2 = $('#inputLineVal2');
            var $inputLineName2 = $('#inputLineName2');
            var $inputLineVal3 = $('#inputLineVal3');
            var $inputLineName3 = $('#inputLineName3');
            var $inputLineVal4 = $('#inputLineVal4');
            var $inputLineName4 = $('#inputLineName4');
            var $inputLineNameTotal = $('.inputLineName');
            var $inputLineValTotal = $('.inputLineVal');
            if (_this.option.dsChartCog && _this.option.dsChartCog[index]){
                $inputUpper.val(_this.option.dsChartCog[index].upper);
                $inputLower.val(_this.option.dsChartCog[index].lower);
                $inputUnit.val(_this.option.dsChartCog[index].unit);
                $inputAccuracy.val(_this.option.dsChartCog[index].accuracy);
                for (var i = 0;i < 4 ;i ++) {
                    $inputLineNameTotal.eq(i).val(_this.option.dsChartCog[index].markLine[i].name);
                    $inputLineValTotal.eq(i).val(_this.option.dsChartCog[index].markLine[i].value);
                    //$inputLineVal2.val(_this.option.dsChartCog[index].lineVal2);
                    //$inputLineName2.val(_this.option.dsChartCog[index].lineName2);
                    //$inputLineVal3.val(_this.option.dsChartCog[index].lineVal3);
                    //$inputLineName3.val(_this.option.dsChartCog[index].lineName3);
                    //$inputLineVal4.val(_this.option.dsChartCog[index].lineVal4);
                    //$inputLineName4.val(_this.option.dsChartCog[index].lineName4);
                }

            }else{
                $('#divChartPointCog').find('input').val('');
            }
            $('#btnPtCogSure').off('click').click(function(){
                if(!_this.option.dsChartCog){
                    _this.option.dsChartCog = [];
                    for (var i=0;i<_this.option.rowDataType.length;++i){
                        _this.option.dsChartCog[i] = {};
                        _this.option.dsChartCog[i].markLine = [{},{},{},{}];
                    }
                }
                if (isNaN(Number($inputUpper.val())) || isNaN(Number($inputLower.val())) || isNaN(Number($inputAccuracy.val())) || isNaN(Number($inputLineVal1.
                        val())) || isNaN(Number($inputLineVal2.val())) || isNaN(Number($inputLineVal3.val())) || isNaN(Number($inputLineVal4.val()))){
                    new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE10 + "</strong>").show().close();
                    return;
                }
                if ($inputUpper.val() != '' && $inputLower.val() != '' && Number($inputUpper.val()) < Number($inputLower.val())){
                    new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE12 + "</strong>").show().close();
                    return;
                }
                _this.option.dsChartCog[index].upper = $inputUpper.val();
                _this.option.dsChartCog[index].lower = $inputLower.val();
                _this.option.dsChartCog[index].unit = $inputUnit.val();
                _this.option.dsChartCog[index].accuracy = $inputAccuracy.val();
                for(var i =0 ; i < 4;++i){
                    if (!_this.option.dsChartCog[index].markLine[i]){
                        _this.option.dsChartCog[index].markLine[i] = {}
                    }
                    _this.option.dsChartCog[index].markLine[i].value = $inputLineValTotal.eq(i).val();
                    _this.option.dsChartCog[index].markLine[i].name = $inputLineNameTotal.eq(i).val();
                }
                //_this.option.dsChartCog[index].lineVal1 = $inputLineVal1.val();
                //_this.option.dsChartCog[index].lineName1 = $inputLineName1.val();
                //_this.option.dsChartCog[index].lineVal2 = $inputLineVal2.val();
                //_this.option.dsChartCog[index].lineName2 = $inputLineName2.val();
                //_this.option.dsChartCog[index].lineVal3 = $inputLineVal3.val();
                //_this.option.dsChartCog[index].lineName3 = $inputLineName3.val();
                //_this.option.dsChartCog[index].lineVal4 = $inputLineVal4.val();
                //_this.option.dsChartCog[index].lineName4 = $inputLineName4.val();
                $('#divChartPointCog').css('display','none');
            });
            $('#btnPtCogCancel').off('click').click(function(){
                $inputUpper.val('');
                $inputLower.val('');
                $inputUnit.val('');
                $inputAccuracy.val('');
                $('#divChartPointCog').css('display','none');
            });
            $('#btnPtCogRemove').off('click').click(function(){
                $inputUpper.val('');
                $inputLower.val('');
                $inputUnit.val('');
                $inputAccuracy.val('');
                $('#divChartPointCog').css('display','none');
            });
        },
        initTime: function(){
            var $inputTimeStart = $('#inputTimeStart');
            var $inputTimeEnd = $('#inputTimeEnd');
            $inputTimeStart.datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date()
            });
            $inputTimeEnd.datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date()
            });

            var $inputCompareDate1 = $('#inputCompareDate1');
            var $inputCompareDate2 = $('#inputCompareDate2');
            $inputCompareDate1.datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date()
            });
            $inputCompareDate2.datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                minView: "hour",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date()
            });
            if(_this.optionType) {
                var now = new Date();
                var time = new Date(now - 259200000).format('yyyy-MM-dd HH:mm');
                var initCompareDate1 = new Date(now.getFullYear(),now.getMonth() - 2).format('yyyy-MM-dd HH:mm');//上上个月第一天00:00:00
                var initCompareDate2 = new Date(now.getFullYear(),now.getMonth() - 1).format('yyyy-MM-dd HH:mm');//上个月第一天00:00:00
                if (!sessionStorage.getItem('anlzTimeStart')){
                    $inputTimeStart.val(time);
                    $inputCompareDate1.val(initCompareDate1)
                }
                now = now.format('yyyy-MM-dd HH:mm');
                if(!sessionStorage.getItem('anlzTimeEnd')){
                    $inputTimeEnd.val(now);
                    $inputCompareDate2.val(initCompareDate2)
                }
            }

        },
        initDrag: function(){
            var $divConfigData = $('.divConfigData');
            var $btnConfigStart = $('#startConfig');
            var _this = this;
            $divConfigData.on('dragover', function (e) {
                e.preventDefault();
                $(e.currentTarget).find('.dataDragTip').addClass('addData');
            });
            $divConfigData.on('dragleave', function (e) {
                e.preventDefault();
                $(e.currentTarget).find('.dataDragTip').removeClass('addData');
            });
            var targetId, targetContent;
            var initBtnStartEnable;
            var initDragTipShow = [];
            var index;
            $divConfigData.on('drop',function(e, arg){
                $('.addData').removeClass('addData');
                var $note = $('#noteEditor');
                if(!$note.is(':hidden') && !arg){
                    return;
                }
                //for (var j = 0; j < $divConfigData.length; ++j) {
                //    if ($divConfigData.find('.rowDataValue').eq(j).children().length < _this.option.dataTypeMaxNum[j] + 1) {
                //        initDragTipShow[j] = true;
                //    } else {
                //        initDragTipShow[j] = false
                //    }
                //}
                index = $(e.currentTarget).index() - 1;
                //if(!initDragTipShow[index]){
                //    new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE1 + "</strong>").show().close();
                //    return;
                //}
                var $rowTempData = $(e.currentTarget).find('.rowDataValue');
                var $dataDragTip = $rowTempData.find('.dataDragTip');
                targetId = EventAdapter.getData().dsItemId;
                //if(e.originalEvent){
                //    targetId = EventAdapter.getData().dsItemId;
                //}else if(arg){
                //    targetId = arg.dataTransfer.getData("dsItemId");
                //}
                if(!targetId)return;
                targetContent = AppConfig.datasource.getDSItemById(targetId).alias;
                if ($rowTempData.find('.divDSConfigure[dsid="'+targetId+'"]').length > 0){
                    new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE2 + "</strong>").show().close();
                    return;
                }
                var strDSConfig =  '<div class="col-lg-3 col-xs-4 divDSConfigure grow" dsid="' + targetId + '"><span class="contentDS" title="'+ targetContent +'">' +
                targetContent +
                '</span><span class="glyphicon glyphicon-remove btnRemoveDS" aria-hidden="true" ></span></div>';
                $dataDragTip.before(strDSConfig);
                initBtnStartAndDragTip(index);

                $(e.currentTarget).find('.divDSConfigure span').last().on('click', function (e) {
                    var $thisPar = $(e.target).parent();
                    var dsid = $thisPar.attr('dsid');
                    $thisPar.remove();
                    if($('.ptLose').length == 0){
                        _this.dataLose = false;
                    }
                    initBtnStartAndDragTip(index);
                    var $dataConfig = $('#dataConfig');
                    $dataConfig.css('height','100%');
                    //$dataConfig.height('');
                    //if($dataConfig.height() > window.innerHeight - 80){
                    //    $dataConfig.css('height','100%');
                    //}
                });
                var $dataConfig = $('#dataConfig');
                if ('AnlzTendency' != _this.option.templateType) {
                    $dataConfig.height('');
                }
                if($dataConfig.height() > window.innerHeight - 80){
                    $dataConfig.css('height','100%');
                }

                if(!$note.is(':hidden') && arg){
                    var format = '&nbsp;<span id = "'+ targetId +'" contenteditable="false" class="pointValue" title="'+ targetContent +'"><%'+ targetContent + '%></span>&nbsp;';
                    insertHtmlAtCaret(format,targetId);

                    function insertHtmlAtCaret(html,targetId) {
                        var sel, range;
                        var iframeWin = document.querySelector('iframe').contentWindow;
                        if (iframeWin.getSelection) {
                            sel = iframeWin.getSelection();
                            if (sel.getRangeAt && sel.rangeCount) {
                                range = sel.getRangeAt(0);
                                range.deleteContents();
                                var el = document.createElement("div");
                                el.innerHTML = html;
                                var frag = document.createDocumentFragment(), node, lastNode;

                                while ( (node = el.firstChild) ) {
                                    lastNode = frag.appendChild(node);
                                }
                                range.insertNode(frag);
                                if (lastNode) {
                                    range = range.cloneRange();
                                    range.setStartAfter(lastNode);
                                    range.collapse(true);
                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                }
                                $(iframeWin.document).find('#'+targetId)[0].addEventListener('DOMNodeRemoved', _this.domNodeRemoved, false);
                                _this.$editor.find('#'+targetId).off('click').on('click',function(e){
                                    _this.initNotePtCfg(_this.$editor.find('.pointValue').index($(e.target)));
                                });
                            }
                        }
                    }
                }
            });

            function initBtnStartAndDragTip(indexOfDataType){
                var tempDivDS = $divConfigData.find('.rowDataValue').eq(indexOfDataType).children();
                if(_this.option.allDataNeed == true){
                    initBtnStartEnable = true;
                    for (var i = 0;i < $divConfigData.length;++i){
                        if($divConfigData.find('.rowDataValue').eq(i).children().length <= 1){
                            initBtnStartEnable = false;
                            break;
                        }
                    }
                    if(tempDivDS.length > 1){
                        //if (tempDivDS.length > _this.option.dataTypeMaxNum[indexOfDataType]){
                        //    initDragTipShow[indexOfDataType] = false;
                        //}else{
                        //    initDragTipShow[indexOfDataType] = true;
                        //}
                    }else{
                        initBtnStartEnable -= 1;
                        initDragTipShow[indexOfDataType] = true;
                    }
                }else{
                    if($divConfigData.find('.divDSConfigure').length > 0){
                        initBtnStartEnable = true;
                    }else{
                        initBtnStartEnable = false;
                    }
                    //if (tempDivDS.length > _this.option.dataTypeMaxNum[indexOfDataType]){
                    //    initDragTipShow[indexOfDataType] = false;
                    //}else{
                    //    initDragTipShow[indexOfDataType] = true;
                    //}
                }
                if(initBtnStartEnable > 0){
                    $btnConfigStart.removeClass('disabled');
                }else{
                    $btnConfigStart.addClass('disabled');
                }
                //if (initDragTipShow[indexOfDataType]){
                //    tempDivDS.last().css('display','block');
                //}else{
                //    tempDivDS.last().css('display','none');
                //}
                if (_this.dataLose){
                    $btnConfigStart.addClass('disabled');
                }
            }
        },
        initConfigStart: function(){
            var $modalConfig = $('#modalConfig');
            var $inputModal = $('#inputMode');
            document.getElementById('startConfig').onclick = function () {
                var tempStartTime, tempEndTime, tempPeriodTime;
                var tempInterval = 0;
                var $inputPeriodValue = $('#inputPeriodValue');
                var periodValue = $inputPeriodValue.val();
                var tempDSId, tempDS, arrItemDS = [];
                var $rowDataValue = $('.rowDataValue');
                var $inputInterval = $('#inputInterval');
                var $inputTimeStart = $('#inputTimeStart');
                var $inputTimeEnd = $('#inputTimeEnd');
                var $inputPeriodUnit = $('#inputPeriodUnit');
                var $inputPeriodDropDown = $('#inputPeriodDropDown');
                var $inputCompareDate1 = $('#inputCompareDate1');
                var $inputCompareDate2 = $('#inputCompareDate2');
                var $inputComparePeriod = $('#inputComparePeriod');
                var $gaugeMode = $('#gaugeMode');
                var $gaugeLowerLimit = $('#gaugeLowerLimit');
                var $gaugeUpperLimit = $('#gaugeUpperLimit');
                var $normalLowerLimit = $('#normalLowerLimit');
                var $normalUpperLimit = $('#normalUpperLimit');
                var $inputRealTimeInterval = $('#inputRealTimeInterval');
                var $optionSelescted = $('#inputRealTimeInterval option:selected').val();//获取选中的采样间隔值
                var $inputHistoryRange = $('#inputHistoryRange');
                var timeType,scaleList;
                var now;
                for (var i = 0; i < $rowDataValue.length; ++i) {
                    tempDS = {};
                    tempDS.type = $rowDataValue[i].parentNode.getAttribute('dataType');
                    tempDSId = [];
                    for (var j = 0; j < $rowDataValue[i].children.length - 1; ++j) {
                        tempDSId.push($rowDataValue[i].children[j].getAttribute('dsid'));
                    }
                    tempDS.arrId = tempDSId;
                    arrItemDS.push(tempDS);
                }
                var totalModeType ={
                    easy:'easy',
                    fixed:'fixed',
                    recent:'recent',
                    realTime:'realTime',
                    //easyEnergy:'easyEnergy',
                    easyCompareAnalyz:'easyCompareAnalyz',
                    easyCompare:'easyCompare',
                    compareSensor:'compareSensor',
                    compareMeter:'compareMeter',
                    realTimeDashboard:"realTimeDashboard",
                    gauge:'gauge',
                    weather:'weather',
                    easyHistory:"easyHistory",
                    easyHistorySelect:"easyHistorySelect",
                    multiple:'multiple'
                };

                switch ($inputModal.val()) {
                    case totalModeType['fixed']:
                        tempStartTime = $inputTimeStart.val().toDate().format('yyyy-MM-dd HH:mm:ss');
                        tempEndTime = $inputTimeEnd.val().toDate().format('yyyy-MM-dd HH:mm:ss');
                        if (tempStartTime.toDate() >= tempEndTime.toDate()) {
                            new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE3 + "</strong>").show().close();
                            return;
                        }
                        if (tempEndTime.toDate() >= new Date()) {
                            new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE4 + "</strong>").show().close();
                            return;
                        }
                        break;
                    case totalModeType['recent']:
                        tempEndTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                        switch ($inputPeriodUnit.val()) {
                            case 'hour':
                                tempPeriodTime = periodValue * 3600000;
                                break;
                            case 'day' :
                                tempPeriodTime = periodValue * 86400000;
                                break;
                            case 'month' :
                                tempPeriodTime = periodValue * 2592000000;
                                break;
                            case 'year' :
                                tempPeriodTime = periodValue * 31536000000;
                                break;
                        }
                        now = new Date();
                        tempStartTime = new Date(now - tempPeriodTime).format('yyyy-MM-dd HH:mm:ss');
                        break;
                    case totalModeType['realTime']:
                        tempStartTime = '';
                        tempEndTime = '';
                        break;
                    case totalModeType['easy']:
                        now = new Date();
                        switch ($inputPeriodDropDown.val()) {
                            case 'today' :
                                tempPeriodTime = 86400000;
                                tempEndTime = now.format('yyyy-MM-dd HH:mm:ss');
                                tempStartTime = new Date(now - tempPeriodTime).format('yyyy-MM-dd HH:mm:ss');
                                break;
                            case 'yesterday' :
                                var yesterday = new Date();
                                yesterday = new Date(yesterday.setDate(yesterday.getDate() - 1));
                                tempEndTime = new Date(getTimeOfMidnightZero(now).getTime() - 1000).format('yyyy-MM-dd HH:mm:ss');
                                tempStartTime = getTimeOfMidnightZero(yesterday).format('yyyy-MM-dd HH:mm:ss');
                                break;
                            case 'thisWeek':
                                tempPeriodTime = 604800000;
                                tempEndTime = now.format('yyyy-MM-dd HH:mm:ss');
                                tempStartTime = new Date(now - tempPeriodTime).format('yyyy-MM-dd HH:mm:ss');
                                break;
                            case 'lastWeek' :
                                tempPeriodTime = 604800000;
                                tempEndTime = getTimeOfMidnightZero(new Date(now-(now.getDay() + 1) * 86400000)).format('yyyy-MM-dd HH:mm:ss');
                                tempStartTime = getTimeOfMidnightZero(new Date(now-(now.getDay() + 7) * 86400000)).format('yyyy-MM-dd HH:mm:ss');
                                break;
                            case 'thisYear' :
                                tempPeriodTime = 31536000000;
                                tempEndTime = now.format('yyyy-MM-dd HH:mm:ss');
                                tempStartTime = new Date(now - tempPeriodTime).format('yyyy-MM-dd HH:mm:ss');
                                break;
                        }
                        break;
                    case totalModeType['realTimeDashboard']:
                        tempStartTime = '';
                        tempEndTime = '';
                        //tempInterval = $inputInterval.val();
                        tempInterval = $inputRealTimeInterval.val();
                        timeType = $inputRealTimeInterval.val();
                        break;
                    case totalModeType['multiple']:
                        tempStartTime = '';
                        tempEndTime = '';
                        tempInterval = $inputInterval.val();
                        timeType = $inputRealTimeInterval.val();
                        var paraType = arrItemDS;
                        break;
                    case totalModeType['easyCompareAnalyz']:
                        tempPeriodTime = 'month';
                        $inputInterval.val('d1');
                        timeType = $inputComparePeriod.val();
                        tempStartTime = initCompareTime(tempPeriodTime,$inputCompareDate1.val());
                        tempEndTime = initCompareTime(tempPeriodTime,$inputCompareDate2.val());
                        break;
                    case totalModeType['easyCompare']:
                        tempPeriodTime = 'month';
                        $inputInterval.val('d1');
                        timeType = $inputComparePeriod.val();
                        break;
                    case totalModeType['compareSensor']:
                        tempPeriodTime = $inputComparePeriod.val();
                        timeType = $inputComparePeriod.val();
                        tempStartTime = initCompareTime(tempPeriodTime,$inputCompareDate1.val());
                        tempEndTime = initCompareTime(tempPeriodTime,$inputCompareDate2.val());
                        break;
                    case totalModeType['compareMeter']:
                        tempPeriodTime = $inputComparePeriod.val();
                        timeType = $inputComparePeriod.val();
                        tempStartTime = initCompareTime(tempPeriodTime,$inputCompareDate1.val());
                        tempEndTime = initCompareTime(tempPeriodTime,$inputCompareDate2.val());
                        break;
                    case totalModeType['gauge']:
                        if ($gaugeMode.val() == 'high'){
                            scaleList = [$gaugeLowerLimit.val(),$normalLowerLimit.val(),$normalUpperLimit.val(),$gaugeUpperLimit.val()];
                        }else{
                            scaleList = [$gaugeUpperLimit.val(),$normalUpperLimit.val(),$normalLowerLimit.val(),$gaugeLowerLimit.val()];
                        }
                        for (i = 0;i < scaleList.length;i++){
                            if (isNaN(Number(scaleList[i]))){
                                new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE10 + "</strong>").show().close();
                                return;
                            }
                            scaleList[i] = parseFloat(scaleList[i]);
                        }
                        var tempArr = scaleList.concat();
                        if($gaugeMode.val() =='high'){
                            tempArr.sort(function(a,b){
                                return a > b ? 1: -1
                            });
                        }else{
                            tempArr.sort(function(a,b){
                                return a < b ? 1: -1
                            });
                        }
                        if (tempArr.toString() != scaleList.toString()) {
                            new Alert($("#configAlert"), "danger", "<strong>" + I18n.resource.modalConfig.err.TYPE5 + "</strong>").show().close();
                            return;
                        }
                        break;
                    case totalModeType['weather']:
                        tempStartTime = '';
                        tempEndTime = '';
                        break;
                    case totalModeType['easyHistory']:
                        timeType = $inputHistoryRange.val();
                        break;
                    case totalModeType['easyHistorySelect']:
                        timeType = $inputHistoryRange.val();
                        var chartType = $('#inputChartSelect').val();
                        break;
                    default :
                        break;
                }
                //根据对比周期获取对比开始时间
                function initCompareTime(period,time){
                    var startTime;
                    switch (period){
                        case 'hour':
                            startTime = time.toDate().format('yyyy-MM-dd HH') + ':00:00';
                            break;
                        case 'day' :
                            startTime = time.toDate().format('yyyy-MM-dd') + ' 00:00:00';
                            break;
                        case 'week' :
                            var weekDay = time.toDate().getDay();
                            var date = time.toDate().getDate();
                            startTime = new Date(time.toDate().setDate(date-weekDay + 1)).format('yyyy-MM-dd') + ' 00:00:00';
                            break;
                        case 'month' :
                            startTime = time.toDate().format('yyyy-MM') + '-01 00:00:00';
                            break;
                        default :
                            break;
                    }

                    return startTime;
                }
                //获取指定日期的午夜零点
                function getTimeOfMidnightZero(date){
                    var tempDate;
                    if(date){
                        tempDate = date
                    }else{
                        tempDate = new Date();
                    }
                    return (date.format('yyyy-MM-dd') + ' 00:00:00').toDate();
                }
                if(_this.modalType == "dataAnalysis"){
                    if(_this.optionType){//新建的Slider
                        _this.screen.curModal = {
                            startTime: tempStartTime,
                            endTime: tempEndTime,
                            format: $inputInterval.val(),
                            mode: $inputModal.val(),
                            type: _this.option.templateType,
                            itemDS: arrItemDS,
                            comparePeriod: tempPeriodTime,
                            dsChartCog: _this.option.dsChartCog,
                            noteList: [],
                            graphList: []
                        };
                    }else{
                        _this.screen.curModal = {
                            startTime: tempStartTime,
                            endTime: tempEndTime,
                            format: $inputInterval.val(),
                            mode: $inputModal.val(),
                            type: _this.option.templateType,
                            itemDS: arrItemDS,
                            comparePeriod: tempPeriodTime,
                            dsChartCog: _this.option.dsChartCog,
                            noteList: _this.screen.curModal.noteList,
                            graphList: _this.screen.curModal.graphList
                        };
                    }
                }else if(_this.modalType == "dashboard"){
                    _this.templateObj.entity.modal.option = {timeFormat: $optionSelescted};//把采样间隔值放进option中
                    _this.templateObj.configParams = {};
                    var $divDSConfigure = $('.divDSConfigure');
                    _this.templateObj.entity.modal.title = $('.springSel .chartTitle input').val();
                    _this.templateObj.entity.modal.points = [];
                    _this.templateObj.entity.modal.StartTime = tempStartTime;
                    _this.templateObj.entity.modal.EndTime = tempEndTime;
                    _this.templateObj.entity.modal.dsChartCog = _this.option.dsChartCog;

                    if(_this.templateObj.entity.modal.type == 'ModalNote'){
                        var bodyEditor = document.querySelector('iframe').contentWindow.document.querySelector('body');
                        var $divModalTextSpan = $(bodyEditor).find('.pointValue');

                        _this.templateObj.entity.modal.modalText = _this.ue.getContent();

                        for(var i = 0;i< $divModalTextSpan.length;++i){
                            _this.templateObj.entity.modal.points.push($divModalTextSpan.get(i).attributes['id'].value);
                        }
                        _this.templateObj.entity.modal.modalTextUrl =_this.editorData;
                    }else{
                        for(var i = 0;i< $divDSConfigure.length;++i){
                            _this.templateObj.entity.modal.points.push($divDSConfigure.get(i).attributes['dsid'].value);
                        }
                    }
                    //_this.templateObj.entity.modal.points = arrItemDS;
                    var option={};
                    timeType && (option.timeType = timeType);
                    scaleList && (option.scaleList = scaleList);
                    paraType && (option.paraType = paraType);
                    chartType && (option.showType = chartType);
                }

                $modalConfig.modal('hide');
                _this.newPageFlag = true;
                //Spinner.spin(ElScreenContainer);
                //alert('预计' + + '秒后生成图表')
                if(_this.modalType == 'dataAnalysis') {
                    var yMax = $('#modifyChartYMax').val();
                    var yMin = $('#modifyChartYMin').val();
                    var yUintSpare = $('#modifyChartYUnitEx').find("option:selected").text();
                    yUintSpare = (yUintSpare==='--') ? '' : yUintSpare;
                    if (yMax) {
                        yMax = parseInt(yMax, 10);
                    }
                    if (yMin) {
                        yMin = parseInt(yMin, 10);
                    }
                    var chartOpt = {
                        'chartName' : $('#modifyChartTitle').val(),
                        'yUnit' : $('#modifyChartYUnitName').val() + ' ' + yUintSpare,//$('#modifyChartYUnitEx').find("option:selected").text(),
                        'yMax' : yMax,
                        'yMin' : yMin,
                        'yMark' : $('#modifyChartYMark').val()
                    };
                    _this.screen.curModal.chartOption = chartOpt;
                    _this.screen.renderModal();
                }else if(_this.modalType == 'dashboard'){
                    _this.templateObj.setModalOption(option);
                    _this.templateObj.render();
                }
            }
        },
        close: function(){
            this.screen = null;
            this.container.parentNode.removeChild(this.container);
            this.container = null;
            this.modalType = null;
            this.ue = null;
        },
        initEditor: function(){
            //_this.$editor.find('#'+targetId).off('click').on('click',function(e){
            //    _this.initNotePtCfg(_this.$editor.find('span').index($(e.target)));
            //})
            var _this = this;
            var bodyEditor, iframe;
            this.editorData = _this.templateObj.entity.modal.modalTextUrl?_this.templateObj.entity.modal.modalTextUrl:[];
            //$('#dataConfig').hide();
            if(!this.ue){
                UE.delEditor('noteEditor');
                this.ue = UE.getEditor('noteEditor',{lang: (I18n.type == 'zh' ? 'zh-cn': 'en')});
                this.ue.ready(function(){
                    $('#noteEditor').slideDown('fast');
                    $('#dataConfig').hide();
                    this.setContent(_this.templateObj.entity.modal.modalText ? _this.templateObj.entity.modal.modalText : '');
                    iframe = document.querySelector('iframe');
                    bodyEditor = iframe.contentWindow.document.querySelector('body');
                    $(iframe).addClass('gray-scrollbar');
                    bodyEditor.ondrop = dropBody;
                    bodyEditor.ondragover = ondragoverBody;
                    bodyEditor.ondragleave = dragleaveBody;
                    bodyEditor.onmouseup = onmouseupBody;
                    bodyEditor.onkeydown = onkeydownBody;

                    $(bodyEditor).find('.pointValue').each(function(){
                        this.addEventListener('DOMNodeRemoved',_this.domNodeRemoved,false);
                    });
                });
            }
            // events
            function dropBody(e){
                e.preventDefault();
                this.focus();
                var $divConfigData = $('.divConfigData');
                $divConfigData.trigger('drop',[e]);
                var $editorPoint = $(bodyEditor).find('.pointValue');
                var modalTextUrl = _this.editorData?_this.editorData:[];
                var tempModalTexUrl = [];
                var flag;
                for (var i = 0; i < $editorPoint.length; i++){
                    flag = false;
                    for (var  j = 0; j < modalTextUrl.length; j++){
                        if ($editorPoint[i].id == modalTextUrl[j].ptId){
                            tempModalTexUrl[i] = modalTextUrl[j];
                            flag = true;
                            break;
                        }
                    }
                    if (!flag){
                        tempModalTexUrl[i] =
                        {
                            ptId:$editorPoint[i].id,
                            ptName:$editorPoint[i].innerText.match(/\b\w+\b/g),
                            ptTextUrl:[]
                        }
                    }
                }
                _this.editorData = tempModalTexUrl;

            }
            function ondragoverBody (e) {
                e.preventDefault();
                $(e.currentTarget).find('.dataDragTip').addClass('addData');
            }
            function dragleaveBody (e) {
                e.preventDefault();
                $(e.currentTarget).find('.dataDragTip').removeClass('addData');
            }

            function onmouseupBody(e){
                var selection = window.getSelection();
                if(selection.type == "Range"){
                    var content = selection.getRangeAt(0).cloneContents();
                    for(var i in content.childNodes){
                        if(content.childNodes[i].className == 'pointValue'){
                            $('.pointValue').attr("contenteditable",true);
                            _this.isSelection = true;
                            return;
                        }
                    }
                }else{
                    $('.pointValue').attr("contenteditable",false);
                }
                _this.isSelection = false;
            }
            function onkeydownBody(e){
                if(_this.isSelection) window.event.returnValue=false;
            };
        },
        renderEditor: function(){
            var $note = $('#noteEditor');
            var $dataConfig = $('#dataConfig');

            if(this.templateObj && this.templateObj.entity.modal.type == 'ModalNote'){
                $dataConfig.hide();
                $note.show();
                /*if(!_this.$editor) return;
                _this.$editor.html(_this.templateObj.entity.modal.modalText);
                $('.pointValue').each(function(){
                    this.addEventListener('DOMNodeRemoved',_this.domNodeRemoved,false);
                });*/
                if (this.editorData){
                    var $editor = $('#editor');
                    $editor.find('.pointValue').off('click').on('click',function(e){
                        _this.initNotePtCfg($editor.find('.pointValue').index($(e.target)));
                    })
                }
            }else{
                $dataConfig.show();
                $note.hide();
            }
        },
        domNodeRemoved: function(){
            var id = $(this).attr('id');
            var bodyEditor = document.querySelector('iframe').contentWindow.document.querySelector('body');
            var $target = $('.divDSConfigure[dsid="'+ id +'"]');
            var index = $target.parent().children('.divDSConfigure').index($target);
            setTimeout(function(){
                var newDom = $(bodyEditor).find('#'+id);
                if(newDom.length < 1){
                    $target.find('.btnRemoveDS').trigger('click');
                    var tempArray = [];
                    for (var i =0; i < _this.editorData.length; i++) {
                        if (i == index)continue;
                        tempArray.push(_this.editorData[i]);
                    }
                    _this.editorData = tempArray;
                }else{
                    newDom[0].addEventListener('DOMNodeRemoved',_this.domNodeRemoved,false);
                }
            },1000);
        },
        initNotePtCfg: function(index){
            var modalTextUrl;
            var bodyEditor = document.querySelector('iframe').contentWindow.document.querySelector('body');
            var $editorPoint = $(bodyEditor).find('.pointValue');
            if(_this.editorData && $editorPoint.length == _this.editorData.length){
                modalTextUrl = _this.editorData;
            }else{
                modalTextUrl = [];
                for (var i = 0;i < $editorPoint.length; ++i){
                    modalTextUrl.push(
                        {
                            ptId:$editorPoint[i].id,
                            ptName:$editorPoint[i].innerText.match(/\b\w+\b/g),
                            ptTextUrl:[]
                        }
                    )
                }
            }
            var temp;
            var $tempDivUrl = $('<div class="col-xs-4 "><select type="text" class="form-control inputNotePtCfgUrl"></select></div>');
            var $tempSelUrl = $tempDivUrl.children();
            $tempSelUrl[0].options.add(new Option(I18n.resource.dashboard.show.SELECT_LINK,'',true));
            for(var i in AppConfig.menu){
                var option = new Option(AppConfig.menu[i],i);
                $tempSelUrl[0].options.add(option);
            }
            $tempSelUrl[0].onchange = function(){
                _this.templateObj.entity.modal.link = $tempSelUrl[0].value;
            };
            var strNotePtCfg = new StringBuilder();
            strNotePtCfg.append('<div id="containerNotePtCfg">');
            strNotePtCfg.append('   <span class="glyphicon glyphicon-plus" id="btnNotePtCfgAdd" aria-hidden="true"></span>');
            strNotePtCfg.append('   <span class="glyphicon glyphicon-remove" id="btnNotePtCfgExit" aria-hidden="true"></span>');
            strNotePtCfg.append('   <div class="rowNotePtCfgTitle row">');
            strNotePtCfg.append('       <div class="col-xs-3">Value</div>');
            strNotePtCfg.append('       <div class="col-xs-5">Name</div>');
            strNotePtCfg.append('       <div class="col-xs-4">Url</div>');
            strNotePtCfg.append('   </div>');
            strNotePtCfg.append('   <div id="divNotePtCfg">');
            strNotePtCfg.append('   </div>');
            strNotePtCfg.append('   <div id="divBtnNotePtCfg">');
            strNotePtCfg.append('       <button type="button" class="btn btn-primary" id="btnNotePtCogSure" i18n="modalConfig.data.PT_COG_SURE"></button>');
            strNotePtCfg.append('       <button type="button" class="btn btn-primary" id="btnNotePtCogCancel" i18n="modalConfig.data.PT_COG_CANCEL"></button>');
            strNotePtCfg.append('   </div>');
            strNotePtCfg.append('</div>');
            $('#noteEditor').append(strNotePtCfg.toString());
            strNotePtCfg = new StringBuilder();
            if (modalTextUrl[index] && modalTextUrl[index].ptTextUrl.length > 0){
                for(var i = 0;i < modalTextUrl[index].ptTextUrl.length;i++){
                    temp = modalTextUrl[index].ptTextUrl[i];
                    strNotePtCfg.append('   <div class="row rowNotePtCfg form-group">');
                    strNotePtCfg.append('      <span class="glyphicon glyphicon-remove btnRowNoteCfgRemove" aria-hidden="true"></span> ');
                    strNotePtCfg.append('       <div class="col-xs-3 "><input type="text" class="form-control inputNotePtCfgVal" value="' + temp.value +'"></div>');
                    strNotePtCfg.append('       <div class="col-xs-5 "><input type="text" class="form-control inputNotePtCfgName" value="' + temp.name +'"></div>');
                    //strNotePtCfg.append('       <div class="col-xs-8 "><input type="text" class="form-control inputNotePtCfgUrl" value="' + temp.url +'"></div>');
                    strNotePtCfg.append('   </div>');
                }
            }
            else
            {
                strNotePtCfg.append('   <div class="row rowNotePtCfg form-group">');
                strNotePtCfg.append('      <span class="glyphicon glyphicon-remove btnRowNoteCfgRemove" aria-hidden="true"></span> ');
                strNotePtCfg.append('       <div class="col-xs-3 "><input type="text" class="form-control inputNotePtCfgVal"></div>');
                strNotePtCfg.append('       <div class="col-xs-5 "><input type="text" class="form-control inputNotePtCfgName"></div>');
                //strNotePtCfg.append('       <div class="col-xs-8 "><input type="text" class="form-control inputNotePtCfgUrl"></div>');
                strNotePtCfg.append('   </div>');
            }
            $('#divNotePtCfg').append(strNotePtCfg.toString());
            var $rowNotePtCfg = $('.rowNotePtCfg');
            var tempVal;
            for(var i = 0; i < $rowNotePtCfg.length;i++){
                $rowNotePtCfg.eq(i).append($tempDivUrl.clone());
                tempVal = modalTextUrl[index].ptTextUrl[i] ? modalTextUrl[index].ptTextUrl[i].url:'';
                $rowNotePtCfg.eq(i).find('.inputNotePtCfgUrl').val(tempVal)
            }
            I18n.fillArea($('#divBtnNotePtCfg'));
            var $self = $('#containerNotePtCfg');
            $('#btnNotePtCfgAdd').off('click').on('click',function(e){
                var strRowNotePtCfg = new StringBuilder();
                strRowNotePtCfg.append('   <div class="row rowNotePtCfg form-group">');
                strRowNotePtCfg.append('      <span class="glyphicon glyphicon-remove btnRowNoteCfgRemove" aria-hidden="true"></span> ');
                strRowNotePtCfg.append('       <div class="col-xs-3 "><input type="text" class="form-control inputNotePtCfgVal"></div>');
                strRowNotePtCfg.append('       <div class="col-xs-5 "><input type="text" class="form-control inputNotePtCfgName"></div>');
                //strRowNotePtCfg.append('       <div class="col-xs-8 "><input type="text" class="form-control inputNotePtCfgUrl"></div>');
                strRowNotePtCfg.append('   </div>');
                $('#divNotePtCfg').append(strRowNotePtCfg.toString());
                $('.rowNotePtCfg').last().append($tempDivUrl.clone());
                $('.btnRowNoteCfgRemove').last().off('click').on('click',function(e){
                    var tempPtTextUrl = [];
                    var tempIndex = $('.btnRowNoteCfgRemove').index($(e.target));
                    tempPtTextUrl = [_this.editorData[index].ptTextUrl.slice(0,tempIndex),_this.editorData[index].ptTextUrl.slice(tempIndex + 1)];
                    tempPtTextUrl = tempPtTextUrl[0].concat(tempPtTextUrl[1]);
                    _this.editorData[index].ptTextUrl = tempPtTextUrl.concat();
                    $(e.target).parent().remove();
                });
            });
            $('#btnNotePtCfgExit').off('click').on('click',function(e){
                $self.remove();
            });
            $('#btnNotePtCogSure').off('click').on('click',function(e){
                //var modalTextUrl = _this.templateObj.entity.modal.modalTextUrl?_this.templateObj.entity.modal.modalTextUrl[index]:{};
                $rowNotePtCfg = $('.rowNotePtCfg');
                modalTextUrl[index].ptTextUrl = [];
                for (var j = 0;j < $rowNotePtCfg.length; j++){
                    modalTextUrl[index].ptTextUrl.push({
                        value:$rowNotePtCfg.eq(j).find('.inputNotePtCfgVal').val(),
                        name:$rowNotePtCfg.eq(j).find('.inputNotePtCfgName').val(),
                        url:$rowNotePtCfg.eq(j).find('.inputNotePtCfgUrl').val()
                    })
                }
                _this.editorData = modalTextUrl;
                $self.remove();
            });
            $('#btnNotePtCogCancel').off('click').on('click',function(e){
                $self.remove();
            });
            $('.btnRowNoteCfgRemove').off('click').on('click',function(e){
                var tempPtTextUrl = [];
                var tempIndex = $('.btnRowNoteCfgRemove').index($(e.target));
                tempPtTextUrl = [_this.editorData[index].ptTextUrl.slice(0,tempIndex),_this.editorData[index].ptTextUrl.slice(tempIndex + 1)];
                tempPtTextUrl = tempPtTextUrl[0].concat(tempPtTextUrl[1]);
                _this.editorData[index].ptTextUrl = tempPtTextUrl.concat();
                $(e.target).parent().remove();
            });

        },
        /**
         cycle, $iptTime1 is required
         $iptTime2 is optional
        **/
        setTimePrecision: function(cycle, $iptTime1, $iptTime2){

            var option = {
                format: "yyyy-mm-dd hh:ii",
                autoclose: true,
                todayBtn: true,
                initialDate: new Date(),
                startView: 2
            }
            $iptTime1.datetimepicker('remove');
            $iptTime2 && $iptTime2.datetimepicker('remove');
            /*
            0 or 'hour' for the hour view
            1 or 'day' for the day view
            2 or 'month' for month view (the default)
            3 or 'year' for the 12-month overview
            4 or 'decade' for the 10-year overview. Useful for date-of-birth datetimepickers.*/
            switch (cycle){
                case 'm1':
                    option.minView = 0;
                    break;
                case 'm5':
                    option.minView = 0;
                    break;
                case 'h1':
                    option.minView = 1;
                    option.format = "yyyy-mm-dd hh:00";
                    break;
                case 'd1':
                    option.minView = 2;
                    option.format = "yyyy-mm-dd 00:00";
                    break;
                case 'M1':
                    option.minView = 3;
                    option.startView = 3;
                    option.format = "yyyy-mm-01 00:00";
                    break;
                default :
                    option.minView = 2;
                    option.format = "yyyy-mm-dd 00:00";
                    break;
            }
            $iptTime1.datetimepicker(option);
            $iptTime2 && $iptTime2.datetimepicker(option);

        }
    };

    return modalConfigurePane;
})();

﻿(function ($) {

    function ModalDBHistory() {
        this.options = undefined;
        // 当前需要渲染的实例
        this.modal = null;
        this.refChart = null;

        this.showOptions = {};
    }

    ModalDBHistory.prototype.show = function () {
        var _this = this;
        var domPanelContent = document.getElementById('paneCenter');

        if(!this.modal) return;
        this.options = getDefaultOption();

        // 查看页面是否已经缓存过模板
        // 没有缓存，则从服务端获取模板
        if($('#modalDBHistoryWrap').length > 0) {
            this.initCustomShow();
            return;
        }

        Spinner.spin(domPanelContent);
        WebAPI.get('/static/views/observer/widgets/modalDBHistory.html')
        .done(function (html) {
            Spinner.stop();
            _this.$wrap = $('<div class="modal-db-history-wrap" id="modalDBHistoryWrap">')
                .appendTo(domPanelContent).html(html);
            _this.$modal = _this.$wrap.children('.modal');
            I18n.fillArea(_this.$wrap);
            _this.init();
            _this.initCustomShow();
        });
    };

    // 自定义显示
    ModalDBHistory.prototype.displayCustomShow = function (options) {
        if(!options) return;

        this.$selMode.val(options.mode);
        this.$selMode.trigger('change');

        // 处理显示时间间隔，开始结束时间
        if(options.mode === 'fast') {
            this.$selTimerange.val(options.timeRange);
        } else {
            this.$selInterval.val(options.timeFmt);
            this.$selInterval.trigger('change');

            this.$iptTimeStart.val(options.startTimeStr);
            this.$iptTimeEnd.val(options.endTimeStr);
        }

        this.$modal.modal('show');
    };

    ModalDBHistory.prototype.initCustomShow = function () {
        var showOptions = this.showOptions;
        var now;

        if(this.modal.type === "ModalMultiple") {
            now = new Date();
            showOptions.mode = 'custom';
            showOptions.timeFmt = 'h1';
            // 向前推100个小时
            showOptions.startTimeStr = function () {
                return new Date(now.valueOf() - 360000000/* 100*60*60*1000 */).format('yyyy-MM-dd HH:00'); 
            }.call(this);
            showOptions.endTimeStr = function () {
                return now.format('yyyy-MM-dd HH:00');
            }.call(this);

        } else {
            showOptions = this.showOptions = {
                mode: 'fast',
                timeRange: 'day'
            };
        }
        this.displayCustomShow(showOptions);
    };

    ModalDBHistory.prototype.getOptionsByType = function (data) {
        var options = [];

        if(this.modal.type === 'ModalMultiple') {
            options = function () {
                var series = [];
                var legend = [];
                var typeMap = {};
                var paraType = this.modal.option.paraType || [];
                var usedDsNameMap = {};
                
                paraType.forEach(function (row) {
                    if(!row.arrId || !row.arrId.length) return;
                    row.arrId.forEach(function (dsId) {
                        if(typeMap[dsId] === undefined) {
                            typeMap[dsId] = [row.type];
                        } else {
                            typeMap[dsId].push(row.type);
                        }
                    });
                });

                var arrId = [];
                var arrItem = [];
                data.list.forEach(function (row) {
                    var dsId = row.dsItemId;
                    if (dsId) {
                        arrId.push(dsId);
                    }
                });
                arrItem = AppConfig.datasource.getDSItemById(arrId);

                data.list.forEach(function (row) {
                    var type = typeMap[row.dsItemId].shift();
                    var dsId = row.dsItemId;
                    //var name = AppConfig.datasource.getDSItemById(dsId).alias || dsId;
                    var name;
                    for (var i = 0, len = arrItem.length; i < len; i++) {
                        if (dsId == arrItem[i].id) {
                            name = arrItem[i].alias;

                            // 处理 undefined 的情况
                            usedDsNameMap[dsId] = usedDsNameMap[dsId] || 0;
                            usedDsNameMap[dsId] += 1;

                            if(usedDsNameMap[dsId] > 1) {
                                name = name + '_' + usedDsNameMap[dsId];
                            }

                            legend.push(name);

                            switch(type) {
                                case 'line':
                                    series.push({
                                        name: name,
                                        type: 'line',
                                        symbol: 'none',
                                        data: row.data,
                                        yAxisIndex: 1,
                                        z: 4
                                    });
                                    break;
                                case 'bar':
                                    series.push({
                                        name: name,
                                        type: 'bar',
                                        symbol: 'none',
                                        data: row.data,
                                        yAxisIndex: 0
                                    });
                                    break;
                                case 'area':
                                    series.push({
                                        name: name,
                                        type: 'line',
                                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                        symbol: 'none',
                                        data: row.data,
                                        yAxisIndex: 0,
                                        z: 3
                                    });
                                    break;
                                case 'cumulativeBar':
                                    series.push({
                                        name: name,
                                        type: 'bar',
                                        stack:'realtime total',
                                        symbol: 'none',
                                        data: row.data,
                                        yAxisIndex: 0
                                    });
                                    break;
                                default: break;
                            }
                            break;
                        }
                    }
                });
                return {
                    series: series,
                    legend: {data: legend},
                    yAxis: [
                        {
                            type: 'value',
                            scale: false,
                            splitArea:{show:false}
                        },
                        {
                            type: 'value',
                            scale: false,
                            splitArea:{show:false}
                        }
                    ]
                };
            }.call(this);

        } else {
            options = function () {
                var series = [];
                var legend = [];
                var usedDsNameMap = {};


                data.list = data.list.filter(function (row, i) {
                    if( (!row.data || !row.data.length) && this.modal.type === 'ModalNote') {
                        return false;
                    }

                    var dsId = row.dsItemId;
                    var name = AppConfig.datasource.getDSItemById(dsId).alias || dsId;
                    // 处理 undefined 的情况
                    usedDsNameMap[dsId] = usedDsNameMap[dsId] || 0;
                    usedDsNameMap[dsId] += 1;

                    if(usedDsNameMap[dsId] > 1) {
                        name = name + '_' + usedDsNameMap[dsId];
                    }

                    series.push({
                        name: name,
                        symbol: 'none',
                        type: 'line',
                        markLine: {
                            data: [{type : 'average', name: 'average'}]
                        },
                        data: row.data
                    });

                    legend.push(name);

                    return true;
                }, this);
                return {
                    series: series,
                    legend: {data: legend}
                };
            }.call(this);
        }

        if(this.refChart) {
            try {
                options.color = this.refChart.getOption().color || [];
            } catch (e) {}
        }

        return options;
    };

    ModalDBHistory.prototype.init = function () {
        this.$chartContainer = $('.chart-container', this.$modal);
        this.$btnSearch = $('.btn-search', this.$modal);
        this.$selMode = $('.sel-mode', this.$modal);

        this.$selTimerange = $('.sel-timerange', this.$modal);
        this.$selInterval = $('.sel-interval', this.$modal);
        this.$iptTimeStart = $('.ipt-timestart', this.$modal);
        this.$iptTimeEnd = $('.ipt-timeend', this.$modal);

        this.$groupFast = $('[data-group="fast"]', this.$modal);
        this.$groupCustom = $('[data-group="custom"]', this.$modal);

        this.initValidator();
        // 添加事件
        this.attachEvents();
    };

    ModalDBHistory.prototype.initValidator = function () {
        var _this = this;
        this.validator = new Validator({
            elements: [{
                name: 'endTime',
                selector: this.$iptTimeEnd,
                rules: [{
                    valid: function (val) {
                        var startTimeVal = _this.$iptTimeStart.val();
                        if(val <= startTimeVal) {
                            this.fail();
                        } else {
                            this.success();
                        }
                    },
                    msg: 'the end time should later than start time.'
                }]
            }],
            icon: false
        });
    };

    ModalDBHistory.prototype.initTimePlugin = function (fmt) {
        var now = new Date();
        if(!fmt) {
            fmt = {
                format: 'yyyy-mm-dd hh:ii',
                showFormat: 'yyyy-MM-dd HH:mm',
                minView: 'hour',
                startView: 'month',
                startTime: new Date(now.valueOf() - 60*60*24*1000)
            };
        } else {
            this.$iptTimeStart.datetimepicker('remove');
            this.$iptTimeEnd.datetimepicker('remove');
        }

        this.$iptTimeStart.datetimepicker({
            format: fmt.format,
            minView: fmt.minView,
            startView: fmt.startView,
            autoclose: true,
            todayBtn: true,
            initialDate: now
        });
        this.$iptTimeStart.val( fmt.startTime.format(fmt.showFormat) );

        this.$iptTimeEnd.datetimepicker({
            format: fmt.format,
            minView: fmt.minView,
            startView: fmt.startView,
            autoclose: true,
            todayBtn: true,
            initialDate: now
        });
        this.$iptTimeEnd.val( now.format(fmt.showFormat) );
    };

    ModalDBHistory.prototype.initChart = function () {
        if(!this.chart) {
            this.chart = echarts.init(this.$chartContainer[0], 'macarons');//不需要跟随皮肤切换
        }
    };

    // 设置
    ModalDBHistory.prototype.setOptions = function (options) {
        this.options = options;
    };

    ModalDBHistory.prototype.setModal = function (modal, chart) {
        this.modal = modal;
        this.refChart = chart;
    };

    ModalDBHistory.prototype.attachEvents = function () {
        var _this = this;

        this.$selMode.off('change').on('change', function (e) {
            var mode = $(this).val();

            if(mode === 'fast') {
                _this.$selTimerange.val('hour');
                _this.$groupFast.show();
                _this.$groupCustom.hide();
            } else {
                _this.$groupFast.hide();
                _this.$groupCustom.show();
                _this.$selInterval.trigger('change');
            }
            _this.showOptions.mode = mode;
        });

        this.$selInterval.off('change').on('change', function (e) {
            var interval = $(this).val();
            var fmt = {};
            var now = new Date(), nowTick = now.valueOf();
            fmt.endTime = now;

            switch (interval) {
                case 'm1':
                    fmt.startTime = new Date(nowTick - 60000); /* 60*1000 */
                    fmt.format = "yyyy-mm-dd hh:ii";
                    fmt.showFormat = 'yyyy-MM-dd HH:mm';
                    fmt.minView = 'hour';
                    fmt.startView = 'month';
                    break;
                case 'm5':
                    fmt.startTime = new Date(nowTick - 300000); /* 5*60*1000 */
                    fmt.format = "yyyy-mm-dd hh:ii";
                    fmt.showFormat = 'yyyy-MM-dd HH:mm';
                    fmt.minView = 'hour';
                    fmt.startView = 'month';
                    break;
                case 'h1':
                    fmt.startTime = new Date(nowTick - 3600000); /* 60*60*1000 */
                    fmt.format = "yyyy-mm-dd hh:00";
                    fmt.showFormat = 'yyyy-MM-dd HH:00';
                    fmt.minView = 'day';
                    fmt.startView = 'month';
                    break;
                case 'd1':
                    fmt.startTime = new Date(nowTick - 86400000); /* 24*60*60*1000 */
                    fmt.format = "yyyy-mm-dd";
                    fmt.showFormat = 'yyyy-MM-dd';
                    fmt.minView = 'month';
                    fmt.startView = 'month';
                    break;
                case 'M1':
                    fmt.startTime = new Date(nowTick - 2592000000); /* 30*24*60*60*1000 */
                    fmt.format = "yyyy-mm";
                    fmt.showFormat = 'yyyy-MM';
                    fmt.minView = 'year';
                    fmt.startView = 'year';
                    break;
            }
            _this.initTimePlugin(fmt);
        });

        this.$btnSearch.off('click').on('click', function (e) {
            var startTime, endTime, timeFmt;
            var rangeTick;

            if(_this.showOptions.mode === 'fast') {
                switch(_this.$selTimerange.val()) {
                    case 'hour':
                        rangeTick = 3600000; // 60*60*1000
                        timeFmt = 'm5';
                        break;
                    case 'day':
                        rangeTick = 86400000; // 24*60*60*1000
                        timeFmt = 'h1';
                        break;
                    case 'week':
                        rangeTick = 604800000; // 7*24*60*60*1000
                        timeFmt = 'h1';
                        break;
                    case 'month':
                        rangeTick = 2592000000; // 30*24*60*60*1000
                        timeFmt = 'd1';
                        break;
                    case 'quarter':
                        rangeTick = 7776000000; // 90*24*60*60*1000
                        timeFmt = 'd1';
                        break;
                    default:
                        break;
                }
                endTime = new Date();
                startTime = new Date( endTime.valueOf() - rangeTick );
                _this.updateChart(startTime, endTime, timeFmt);
            } else {
                _this.validator.valid().done(function () {
                    startTime = new Date( _this.$iptTimeStart.val() );
                    endTime = new Date( _this.$iptTimeEnd.val() );
                    timeFmt = _this.$selInterval.val();
                    _this.updateChart(startTime, endTime, timeFmt);
                });
            }
            e.stopPropagation();
        });

        this.$modal.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
            // 重置一下
            _this.reset();
            e.preventDefault();
            e.stopPropagation();
        });

        this.$modal.off('shown.bs.modal').on('shown.bs.modal', function (e) {
            // 初始化图表
            _this.initChart();
            // 触发刷新
            _this.$btnSearch.trigger('click');
        });
    };

    ModalDBHistory.prototype.updateChart = function (start, end, timeFmt) {
        var _this = this;
        var startTick, endTick;
        var points = this.modal.points;

        // 如果没有 points, 界面显示无数据
        if(!points || !points.length) {
            this.chart.setSeries([]);
            return;
        }

        // show loading
        this.chart.showLoading({
            text : 'Loading',
            effect: 'spin',
            textStyle : {
                fontSize : 20
            }
        });

        // 获取数据
        return WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
            dsItemIds: points,
            timeStart: start.format('yyyy-MM-dd HH:mm:ss'),
            timeEnd: end.format('yyyy-MM-dd HH:mm:ss'),
            // 1 小时数据默认间隔 5 分钟
            timeFormat: timeFmt
        }).then(function (rs) {
            var seriesData = [];
            var xAxisData = [];
            var timeShaft = rs.timeShaft;
            var list = rs.list;
            var optionsFromType;
            
            // 如果没数据，直接不处理
            if(!rs.timeShaft || !rs.timeShaft.length) {
                _this.chart.setOption({
                    series: [{}]
                }, true);
                return;   
            }

            // x 轴数据
            timeShaft.forEach(function (row, i) {
                xAxisData.push( row.toDate().format('MM-dd HH:mm') );
            });

            optionsFromType = _this.getOptionsByType(rs);

            // rendering
            _this.options.chartOptions.xAxis = [{
                boundaryGap: false,
                type: 'category',
                data: xAxisData
            }];

            _this.options.chartOptions = $.extend(false, _this.options.chartOptions, optionsFromType);

            _this.chart.setOption(_this.options.chartOptions, true);

            _this.chart.hideLoading();
        }, function () {
            // 如果接口返回错误，界面显示无数据
            _this.chart.setOption({
                series: [{}]
            }, true);
        });
    };

    ModalDBHistory.prototype.reset = function () {
        if(!!this.chart) {
            this.chart.clear();
            this.chart.dispose();
            this.chart = null;
        }
    };

    ModalDBHistory.prototype.close = function () {
        this.$wrap.remove();
    };

    function getDefaultOption () {
        var i18nEcharts = I18n.resource.echarts;
        return {
            chartOptions: {
                toolbox: {
                    show : true,
                    feature : {
                        dataZoom: {
                            show: true,
                            title : {
                                dataZoom : i18nEcharts.DATAZOOM,
                                dataZoomReset : i18nEcharts.DATAZOOMRESET
                            }
                        },
                        dataView: {
                            show: true,
                            readOnly: false,
                            title : i18nEcharts.DATAVIEW,
                            lang: [i18nEcharts.DATAVIEW, i18nEcharts.CLOSE, i18nEcharts.REFRESH]
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar'],
                            title : {
                                line : i18nEcharts.LINE,
                                bar : i18nEcharts.BAR
                            }
                        },
                        restore: {
                            show: true,
                            title: i18nEcharts.REDUCTION
                        },
                        saveAsImage: {
                            show: true,
                            title: i18nEcharts.SAVE_AS_PICTURE,
                            lang : i18nEcharts.SAVE
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                dataZoom: {
                    show: true
                },
                grid: {
                    y: 50,
                    y2: 80
                },
                yAxis: [
                    {
                        type: 'value',
                        boundaryGap: [0.1, 0.1]
                    }
                ],
                series: []
            }
        };
    }

    this.ModalDBHistory = ModalDBHistory;
}).call(this, jQuery);

var ModalBase = (function () {

    function ModalBase(parent, entity, _funcRender, _funcUpdate,_funcConfigMode) {
        if (!parent) return;
        this.screen = parent;
        this.entity = entity;
        this.wikis = {};

        this.container = undefined;
        this.chart = undefined; //chart or other
        this.spinner = undefined;

        this.executeRender = _funcRender;
        this.executeConfigMode = _funcConfigMode;
        this.executeUpdate = _funcUpdate;

        this.modalWikiCtr = undefined;
        this.hasEdit = false;
        this.spanRange = {};
        this.initContainer();
    };

    ModalBase.prototype = {
        UNIT_WIDTH: 100/12,   // 100/12 = 8.3 一行均分为12列,为了精确,保留3位小数
        UNIT_HEIGHT: 100/6,    // 100/6 = 16.5   一屏均分为6行
        initContainer: function (replacedElementId) {
            var divParent = document.getElementById('divContainer_' + this.entity.id);
            var isNeedCreateDivParent = false;
            var scrollClass = '';

            if ((!divParent) || replacedElementId) {
                var isNeedCreateDivParent = true;
            }

            if (isNeedCreateDivParent) {
                divParent = document.createElement('div');
                divParent.id = 'divContainer_' + this.entity.id;
            }

            //get container
            if (replacedElementId) {
                var $old = $('#divContainer_' + replacedElementId);
                $(divParent).insertAfter($old);
                $old.remove();
            }
            else {
                isNeedCreateDivParent && this.screen.container.appendChild(divParent);
            }
            
            divParent.className = 'springContainer';
            if(this.screen.isForMobile) {
                this.spanRange = {
                    minWidth: 1,
                    maxWidth: 3,
                    minHeight: 1,
                    maxHeight: 4.5
                };
            }else{
                this.spanRange = {
                    minWidth: this.optionTemplate.minWidth,
                    maxWidth: this.optionTemplate.maxWidth,
                    minHeight: this.optionTemplate.minHeight,
                    maxHeight: this.optionTemplate.maxHeight
                };
            }
            //adapt ipad 1024px
            if (AppConfig.isMobile) {
                divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR * 4 / 3 + '%';
                divParent.style.width = this.UNIT_WIDTH * this.entity.spanC * 4 + '%';
                if (this.UNIT_WIDTH * this.entity.spanC * 4 > 100){
                    divParent.style.width = '100%';
                }
            } else {
                divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR + '%';
                divParent.style.width = this.UNIT_WIDTH * this.entity.spanC + '%';
            }
            //便签和组合图高度超出部分要加滚动条样式
            if(this.entity.modal.type == 'ModalNote' || this.entity.modal.type == 'ModalMix'){
                scrollClass = ' gray-scrollbar scrollY'
            }
            if (this.entity.modal.title && this.entity.modal.title != '' && (!this.entity.isNotRender)) {
                divParent.innerHTML = '<div class="panel panel-default">\
                    <div class="panel-heading springHead">\
                        <h3 class="panel-title" style="font-weight: bold;">' + this.entity.modal.title + '</h3>\
                    </div>\
                    <div class="panel-body springContent' + scrollClass + '" style="position: relative;"></div>\
                </div>';
            } else {//为组合图里的小图添加标题
                divParent.innerHTML = '<div class="panel panel-default" style="relative" >\
                    <span class="springSeHead fontTemp6">' + this.entity.modal.title + '</span>\
                    <div class="panel-body springContent' + scrollClass + '" style="position: relative;height:100%;"></div>\
                </div>';
            }

            //按钮容器:锚链接,历史数据,wiki
            if(!(this instanceof ModalAnalysis)){
                var divBtnCtn = document.createElement('div');
                divBtnCtn.className = 'springLinkBtnCtn';

                var domPanel = divParent.getElementsByClassName('panel')[0];
                var lkHistory;

                // interact chart time config interface
                if ('ModalInteract' == this.entity.modal.type) {
                    var aInterCfg;
                    aInterCfg = document.createElement('a');
                    aInterCfg.className = 'springLinkBtn';
                    aInterCfg.title = 'Config time parameter';
                    aInterCfg.href = 'javascript:;';
                    aInterCfg.innerHTML = '<span class="glyphicon glyphicon-cog"></span>';
                    divBtnCtn.appendChild(aInterCfg);
                    aInterCfg.onclick = function() {
                        new ModalInteractCfgPanel(_this).show();
                    }
                }

                // jump button
                if (this.entity.modal.points && this.entity.modal.points.length > 0) {
                    var lkJump;
                    lkJump = document.createElement('a');
                    lkJump.className = 'springLinkBtn';
                    lkJump.title = 'Add to datasource';
                    lkJump.href = 'javascript:;';
                    lkJump.innerHTML = '<span class="glyphicon glyphicon-export"></span>';
                    divBtnCtn.appendChild(lkJump);
                    lkJump.onclick = function() {
                        new ModalAppendPointToDs(true, _this.entity.modal.points, null).show();
                    }
               }

                // '历史数据' 按钮逻辑开始
                if(['ModalHtml', 'ModalMix', 'ModalObserver', 'ModalRank', 'ModalRankNormal', 'ModalNone', 'ModalInteract'].indexOf(this.entity.modal.type) > -1
                    || !this.entity.modal.points || !this.entity.modal.points.length) {
                } else {
                    lkHistory = document.createElement('a');
                    lkHistory.className = 'springLinkBtn';
                    lkHistory.title = 'Show History';
                    lkHistory.href = 'javascript:;';
                    lkHistory.innerHTML = '<span class="glyphicon glyphicon-stats"></span>';
                    divBtnCtn.appendChild(lkHistory);
                    // 添加 "历史数据" 按钮事件
                    this.attachLkHistoryEvents( lkHistory );
                }
                // '历史数据' 按钮逻辑结束

                //锚链接 start
                var link = this.entity.modal.link;
                var _this = this;
                if(link && AppConfig.menu[link]){
                    var linkBtn = document.createElement('a');
                    linkBtn.className = 'springLinkBtn';
                    linkBtn.innerHTML = '<span class="glyphicon glyphicon-link"></span>';
                    linkBtn.setAttribute('pageid',link);
                    linkBtn.title = 'Link to ' + AppConfig.menu[link];
                    divBtnCtn.appendChild(linkBtn);
                    linkBtn.onclick = function(e){
                        var $ev =  $('#ulPages [pageid="'+ link +'"]');
                        if($ev[0].className != 'nav-btn-a'){
                            $ev = $ev.children('a');
                            $ev.closest('.dropdown').children('a').trigger('click');
                        }
                        $ev.trigger('click');
                    }
                }
                //锚链接 end

                //wiki start
                //var wiki = this.entity.modal.wiki;
                var wikiId = this.entity.modal.wikiId;
                if(wikiId){
                    var wikiBtn = document.createElement('a');
                    wikiBtn.className = 'springLinkBtn';
                    wikiBtn.innerHTML = '<span class="glyphicon glyphicon-info-sign"></span>';
                    wikiBtn.title = 'View detail info';
                    wikiBtn.id = wikiId;
                    divBtnCtn.appendChild(wikiBtn);
                    wikiBtn.onclick = function(){
                        _this.getInstanceOfModalWiki().viewWikiInfo(wikiId);
                    }
                }
                //wiki end

                domPanel.appendChild(divBtnCtn);
            }

            //this.initToolTips(divParent.getElementsByClassName('springHead'));
            this.container = divParent.getElementsByClassName('springContent')[0];

            if(this.entity.modal.type !== 'ModalMix'){
                this.spinner = new LoadingSpinner({color: '#00FFFF'});
                this.spinner.spin(this.container);
            }
            return this;
        },

        initToolTips: function(parent) {
            var _this = this;
            if (!parent) return;
            var descTip = new StringBuilder();
            descTip.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:300px;">');
            descTip.append('    <div class="tooltipTitle tooltip-inner" style="display:none">GeneralRegressor</div>');
            descTip.append('    <div class="tooltipContent" style="border:1px solid black">');
            descTip.append('        <p class="containerDesc" style="word-break:break-all;"><span style="font-weight:bold">').append(_this.entity.modal.desc).append('</span> ').append('</p>');
            descTip.append('    </div>');
            descTip.append('    <div class="tooltip-arrow"></div>');
            descTip.append('</div>');
            var options = {
                placement: 'bottom',
                title: _this.entity.modal.title,
                template: descTip.toString()
            };
            if (_this.entity.modal.desc && _this.entity.modal.desc !=''){
                $(parent).tooltip(options);
            }
        },

        render: function () {
            try {
                this.executeRender();
            } catch (e) {
                console.warn(e);
            }

            if (this.chart) {
                this.chart.on('resize', function (param) {
                    this.resize();
                });
            }
        },

        update: function (options) {
            var modal, dsChartConfig, accuracy;
            var num, specialCond;
            if ((!options) || options.length == 0) return;

            // 新增精度处理逻辑
            modal = this.entity.modal;
            dsChartConfig = modal.dsChartCog && modal.dsChartCog.length ? modal.dsChartCog[0] : {};
            accuracy = dsChartConfig.accuracy;

            // 将字符串转换成数字的方法: +str
            // +'12'      = 12
            // +'12.'     = 12
            // +'12..'    = NaN
            // +'.12'     = 0.12
            // +'..12'    = NaN
            // +'今天天气不错' = NaN
            // +'12号闸有问题' = NaN
            // 特殊情况需注意
            // +''        = 0
            // +null      = 0
            // +undefined = 0
            
            // 如果精度不为空，且为数字
            if( accuracy !== '' && !isNaN(accuracy) ) {
                specialCond = ['', null, undefined];
                options = options.map(function (row, i) {
                    // 排除特殊情况 ('', null, undefined)
                    // 和字符串文本的情况 ('今天天气不错'、'12号闸有问题'等)
                    if( specialCond.indexOf(row.data) > -1 || isNaN(row.data) ) {
                        // 特殊情况不做处理
                        return row;
                    } else {
                        // 如果不是，做进制转换
                        // 首先转换成数字，若本身就是数字，则不受影响
                        num = +row.data;
                        // 这边将数据统一返回成字符串格式，可能有风险
                        row.data = num.toFixed(accuracy);
                        return row;
                    }
                });
            }

            try {
                this.executeUpdate(options);
            } catch(e) {
                console.warn(e);                
            }
        },

        configure: function () {
            this.spinner && this.spinner.stop();
            var _this = this;

            if (this.chart) this.chart.clear();
            this.divResizeByMouseInit();

            var divMask = document.createElement('div');
            divMask.className = 'springConfigMask';
            divMask.draggable = 'true';
            if (this.entity.modal.type !='ModalAnalysis' || !this.screen.isForReport) {
                var btnConfig = document.createElement('span');
                btnConfig.className = 'glyphicon glyphicon-cog springConfigBtn grow';
                btnConfig.title = 'Options';
                btnConfig.onclick = btnConfig_clickEvent;
                divMask.appendChild(btnConfig);
            }
            var btnRemove = document.createElement('span');
            btnRemove.className = 'glyphicon glyphicon-remove-circle springConfigRemoveBtn grow';
            btnRemove.title = 'Remove';
            btnRemove.onclick = function (e) {
                //TODO 测试confirm
                confirm('Are you sure you want to delete it ?', function () {
                    if (_this.chart) _this.chart.clear();
                    if (_this.screen.screen) {//兼容ModalMix
                        _this.screen.screen.removeEntity(_this.entity.id);
                    } else {
                        _this.screen.removeEntity(_this.entity.id);
                    }

                    $('#divContainer_' + _this.entity.id).remove();
                    _this.screen.isScreenChange = true;
                    _this = null;
                })
            };
            divMask.appendChild(btnRemove);

            var btnHeightResize = document.createElement('div');
            var maxHeight = this.spanRange.maxHeight;
            var maxWidth = this.spanRange.maxWidth;
            var minHeight = this.spanRange.minHeight;
            var minWidth = this.spanRange.minWidth;
            btnHeightResize.className = 'divResize divHeightResize';
            btnHeightResize.innerHTML = '<label for="heightResize" >H: </label>' +
            '<input type="range" class="inputResize" id="heightResize" name="points" step="0.5" min="' + minHeight + '" max="' + maxHeight + '" value="' + _this.entity.spanR + '"/>' +
            '<h5 class="rangeVal">' + _this.entity.spanR + ' /' + _this.spanRange.maxHeight + '</h5>' +
            '<input type="text" class="rangeChange" value="' + _this.entity.spanR + '"/>';
            divMask.appendChild(btnHeightResize);
            var btnWidthResize = document.createElement('div');
            btnWidthResize.className = 'divResize divWidthResize';
            btnWidthResize.innerHTML = '<label for="widthResize" >W: </label>' +
            '<input type="range" class="inputResize" id="widthResize" name="points" step="0.5" min="' + minWidth + '" max="' + maxWidth + '" value="' + _this.entity.spanC + '"/>' +
            '<h5 class="rangeVal">' + _this.entity.spanC + ' /' + _this.spanRange.maxWidth + '</h5>' +
            '<input type="text" class="rangeChange" value="' + _this.entity.spanC + '"/>';
            divMask.appendChild(btnWidthResize);
            var divTitleAndType = document.createElement('div');
            divTitleAndType.className = 'divTitleAndType';
            divMask.appendChild(divTitleAndType);


            var $divTitle = $('<div class="divResize chartTitle">');
            var $labelTitle = $('<label for="title">').text(I18n.resource.dashboard.show.TITLE);
            var inputChartTitle = document.createElement('input');
            inputChartTitle.id = 'title';
            inputChartTitle.className = 'form-control';
            inputChartTitle.value = this.entity.modal.title;
            inputChartTitle.setAttribute('placeholder',I18n.resource.dashboard.show.TITLE_TIP);
            if(this.entity.modal.title != ''){
                inputChartTitle.style.display = 'none';
            }
            inputChartTitle.setAttribute('type','text');
            $divTitle.append($labelTitle).append($(inputChartTitle));
            divTitleAndType.appendChild($divTitle[0]);

            var $divType = $('<div class="divResize chartType">');
            var $labelType = $('<label>').text(I18n.resource.dashboard.show.TYPE);
            var chartType = document.createElement('span');
            chartType.innerHTML = I18n.findContent(this.optionTemplate.name);
            $divType.append($labelType).append($(chartType));
            divTitleAndType.appendChild($divType[0]);

            //ModalAnalysis类型(来自数据分析)不需要link wiki pop功能
            if(!(this instanceof ModalAnalysis)){
                //link
                var $divLink = $('<div class="divResize chartLink">');
                var $labelLink = $('<label>').text(I18n.resource.dashboard.show.LINK_TO);
                var chartLink = document.createElement('select');
                chartLink.className = 'form-control';
                chartLink.options.add(new Option(I18n.resource.dashboard.show.SELECT_LINK,''));
                for(var i in AppConfig.menu){
                    var option = new Option(AppConfig.menu[i],i);
                    if(this.entity.modal.link == i){
                        option.selected = 'selected';
                    }
                    chartLink.options.add(option);
                }
                chartLink.onchange = function(){
                    _this.entity.modal.link = chartLink.value;
                    _this.screen.isScreenChange = true;
                };
                $divLink.append($labelLink).append($(chartLink));
                divMask.appendChild($divLink[0]);

                //wiki ID
                var $divWiki = $('<div class="divResize chartId chartWiki">');
                var $labelWiki = $('<label for="title">').text(I18n.resource.dashboard.show.WIKI_ID);
                var inputChartWiki = document.createElement('input');
                inputChartWiki.id = 'wikiId';
                inputChartWiki.className = 'form-control';
                inputChartWiki.value = this.entity.modal.wikiId?this.entity.modal.wikiId:'';
                //inputChartPop.setAttribute('placeholder',I18n.resource.dashboard.show.DESC_TIP);
                if(this.entity.modal.wikiId != ''  && this.entity.modal.wikiId != undefined){
                    inputChartWiki.style.display = 'none';
                }

                $divWiki.append($labelWiki).append($(inputChartWiki));
                divMask.appendChild($divWiki[0]);


                var chartWikiShow = document.createElement('p');
                chartWikiShow.innerHTML = inputChartWiki.value;
                chartWikiShow.className = 'chartTitleShow';
                $divWiki[0].appendChild(chartWikiShow);
                if(this.entity.modal.wikiId == '' || this.entity.modal.wikiId == undefined){
                    chartWikiShow.style.display = 'none';
                }
                chartWikiShow.onclick = function(){
                    chartWikiShow.style.display = 'none';
                    inputChartWiki.style.display = 'inline-block';
                    inputChartWiki.focus();
                };
                inputChartWiki.onchange = function(){
                    if (inputChartWiki.value != ''){
                        inputChartWiki.style.display = 'none';
                        chartWikiShow.style.display = 'inline';
                    }
                    chartWikiShow.innerHTML = inputChartWiki.value;
                    _this.entity.modal.wikiId = inputChartWiki.value;
                    _this.screen.isScreenChange = true;
                };

                var $btnCreateWiki = $('<button  type="button" class="btn btn-primary" style="padding: 3px;line-height: 1.2;">Wiki</button>');
                $btnCreateWiki.click(function (){
                    var modalWiki = _this.getInstanceOfModalWiki();
                    if(_this.entity.modal.wikiId != ''){
                        if(_this.wikis[_this.entity.modal.wikiId]){
                            modalWiki.showWikiEdit(_this.wikis[_this.entity.modal.wikiId]);
                        }else{
                            WebAPI.get('/getWikiById/'+ _this.entity.modal.wikiId)
                            .done(function (result) {
                                if(result.id){
                                    _this.wikis[result.id] = result
                                    modalWiki.showWikiEdit(result);
                                }else{
                                    modalWiki.showWikiSearch();
                                }
                            })
                            .fail(function(result){
                                alert(result)
                            });
                        }
                    }else{
                        var modalWiki = _this.getInstanceOfModalWiki();
                        modalWiki.showWikiSearch();
                    }
                });
                $divWiki[0].appendChild($btnCreateWiki[0]);

                //Pop dataSourceId
                var $divPop = $('<div class="divResize chartId chartPop">');
                var $labelPop = $('<label for="title">').text(I18n.resource.dashboard.show.POP_ID);
                var inputChartPop = document.createElement('input');
                inputChartPop.id = 'popId';
                inputChartPop.className = 'form-control';
                inputChartPop.value = this.entity.modal.popId?this.entity.modal.popId:'';
                //inputChartPop.setAttribute('placeholder',I18n.resource.dashboard.show.DESC_TIP);
                if(this.entity.modal.popId != ''  && this.entity.modal.popId != undefined){
                    inputChartPop.style.display = 'none';
                }
                $divPop.append($labelPop).append($(inputChartPop));
                divMask.appendChild($divPop[0]);


                var chartPopShow = document.createElement('p');
                chartPopShow.innerHTML = inputChartPop.value;
                chartPopShow.className = 'chartTitleShow';
                $divPop[0].appendChild(chartPopShow);
                if(this.entity.modal.popId == '' || this.entity.modal.popId == undefined){
                    chartPopShow.style.display = 'none';
                }
                chartPopShow.onclick = function(){
                    chartPopShow.style.display = 'none';
                    inputChartPop.style.display = 'inline-block';
                    inputChartPop.focus();
                };
                inputChartPop.onchange = function(){
                    if (inputChartPop.value != ''){
                        inputChartPop.style.display = 'none';
                        chartPopShow.style.display = 'inline';
                    }
                    chartPopShow.innerHTML = inputChartPop.value;
                    _this.entity.modal.popId = inputChartPop.value;
                    _this.screen.isScreenChange = true;
                };
            }


            ////description
            //var $divDesc = $('<div class="divResize chartDesc">');
            //var $labelDesc = $('<label for="title">').text(I18n.resource.dashboard.show.DESC);
            //var inputChartDesc = document.createElement('textarea');
            //inputChartDesc.id = 'description';
            //inputChartDesc.className = 'form-control';
            //inputChartDesc.value = this.entity.modal.desc?this.entity.modal.desc:'';
            //inputChartDesc.setAttribute('placeholder',I18n.resource.dashboard.show.DESC_TIP);
            //if(this.entity.modal.desc != ''  && this.entity.modal.desc != undefined){
            //    inputChartDesc.style.display = 'none';
            //}
            //$divDesc.append($labelDesc).append($(inputChartDesc));
            //divMask.appendChild($divDesc[0]);

            var chartTitleShow = document.createElement('p');
            chartTitleShow.innerHTML = inputChartTitle.value;
            chartTitleShow.className = 'chartTitleShow';
            $divTitle[0].appendChild(chartTitleShow);
            if(this.entity.modal.title == '' || this.entity.modal.title == undefined){
                chartTitleShow.style.display = 'none';
            }
            chartTitleShow.onclick = function(){
                chartTitleShow.style.display = 'none';
                inputChartTitle.style.display = 'inline-block';
                inputChartTitle.focus();
            };
            inputChartTitle.onchange = function(){
                if (inputChartTitle.value != ''){
                    inputChartTitle.style.display = 'none';
                    chartTitleShow.style.display = 'inline';
                }
                chartTitleShow.innerHTML = inputChartTitle.value;
                _this.entity.modal.title = inputChartTitle.value;
                _this.screen.isScreenChange = true;
            };

            //var chartDescShow = document.createElement('p');
            //chartDescShow.innerHTML = inputChartDesc.value;
            //chartDescShow.className = 'chartDescShow';
            //$divDesc[0].appendChild(chartDescShow);
            //if(this.entity.modal.desc == ''){
            //    chartDescShow.style.display = 'none';
            //}
            //chartDescShow.onclick = function(){
            //    chartDescShow.style.display = 'none';
            //    inputChartDesc.style.display = 'block';
            //    inputChartDesc.focus();
            //};
            //inputChartDesc.onblur = function(){
            //    if (inputChartDesc.value != ''){
            //        inputChartDesc.style.display = 'none';
            //        chartDescShow.style.display = 'block';
            //    }
            //    chartDescShow.innerHTML = inputChartDesc.value;
            //    _this.entity.modal.desc = inputChartDesc.value;
            //};

            //如果entity的isRender为false,添加到chartsCt中
            this.container.parentNode.appendChild(divMask);
            if (this.entity.isNotRender && this.screen.entity) {//兼容ModalMix
                $(document.getElementById('divContainer_' + this.screen.entity.id)).find('.chartsCt')[0].appendChild(this.container.parentNode.parentNode);
            }

            this.divResizeByToolInit();
            function btnConfig_clickEvent(e) {
                $('.springSel').removeClass('springSel');
                $(e.target).closest('.springContainer').addClass('springSel');
                _this.modalInit();
                //$('#energyModal').modal('show');
            }

            function btnEdit_clickEvent(e) {
                $('.springSel').removeClass('springSel');
                $(e.target).closest('.springContainer').addClass('springSel');
                _this.showEditModal();
                //$('#energyModal').modal('show');
            }

            //drag event of replacing entity
            var divContainer = $(this.container).closest('.springContainer')[0];
            divMask.ondragstart = function (e) {
                //e.preventDefault();
                e.dataTransfer.setData("id", $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', ''));
            };
            divMask.ondragover = function (e) {
                e.preventDefault();
            };
            divMask.ondragleave = function (e) {
                e.preventDefault();
            };
            divContainer.ondrop = function (e) {
                e.stopPropagation();
                var sourceId = e.dataTransfer.getData("id");
                var $sourceParent, $targetParent;
                if (sourceId) {
                    var targetId = $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', '');
                    $sourceParent = $('#divContainer_' + sourceId).parent();
                    $targetParent = $('#divContainer_' + targetId).parent();
                    //外部chart拖入组合图
                    if(!$sourceParent[0].classList.contains('chartsCt') && $targetParent[0].classList.contains('chartsCt')){
                        _this.screen.insertChartIntoMix(sourceId, $(e.target).closest('.chartsCt')[0])
                    }else{//平级之间交换
                        if(_this.screen.screen){//组合图内部交换
                            _this.screen.screen.replaceEntity(sourceId, targetId, _this.screen.entity.id);
                        }else{
                            _this.screen.replaceEntity(sourceId, targetId);
                        }
                    }
                }
                _this.screen.isScreenChange = true;
            }

            this.executeConfigMode();
        },

        //interface
        setModalOption: function (option) { },

        modalInit: function() {
            var _this = this;
            var dataItem = [], option;
            var dataTypeUnit;
            var type = false;
            if (_this.entity.modal.points != undefined){
                if (_this.entity.modal.option && _this.entity.modal.option.paraType){
                    for (var i = 0; i < _this.entity.modal.option.paraType.length; i++) {
                        dataTypeUnit = {dsId: [], dsType: '', dsName: []};
                        dataTypeUnit.type = _this.entity.modal.option.paraType[i].type;

                        var arrId = [];
                        var arrItem = [];
                        for (var j = 0; j < _this.entity.modal.option.paraType[i].arrId.length;j++) {
                            arrId.push(_this.entity.modal.option.paraType[i].arrId[j]);
                        }
                        arrItem = AppConfig.datasource.getDSItemById(arrId);
                        for (var j = 0; j < _this.entity.modal.option.paraType[i].arrId.length;j++) {
                            var id = _this.entity.modal.option.paraType[i].arrId[j];
                            for (var m = 0; m < arrItem.length; m++) {
                                if (id == arrItem[m].id) {
                                    dataTypeUnit.dsId.push(id);
                                    dataTypeUnit.dsName.push(arrItem[m].alias);
                                    break;
                                }
                            }
                        }
                        //for (var j = 0; j < _this.entity.modal.option.paraType[i].arrId.length;j++) {
                        //    dataTypeUnit.dsId.push(_this.entity.modal.option.paraType[i].arrId[j]);
                        //    dataTypeUnit.dsName.push(AppConfig.datasource.getDSItemById(_this.entity.modal.option.paraType[i].arrId[j]).alias);
                        //}
                        dataItem.push(dataTypeUnit);
                    }
                }else {
                    dataTypeUnit = {dsId: [], dsType: '', dsName: []};
                    var arrId = [];
                    var arrItem = [];
                    for (var i = 0; i < _this.entity.modal.points.length; i++) {
                        arrId.push(_this.entity.modal.points[i]);
                    }
                    arrItem = AppConfig.datasource.getDSItemById(arrId);
                    for (var i = 0; i < _this.entity.modal.points.length; i++) {
                        var id = _this.entity.modal.points[i];
                        for (var m = 0; m < arrItem.length; m++) {
                            if (id == arrItem[m].id) {
                                dataTypeUnit.dsId.push(id);
                                dataTypeUnit.dsName.push(arrItem[m].alias);
                                break;
                            }
                        }
                    }
                    dataItem.push(dataTypeUnit);
                }
            }
            // deal with 'custom' mode
            if(_this.optionTemplate.mode === 'custom') {
                _this.showConfigModal();
                return;
            }
            //deal with 图元 报表章节
            if(_this.optionTemplate.type === 'ModalReportChapter') {
                _this.showConfigModal();
                return;
            }
            var tempOptionPara;
            _this.entity.modal.option ? tempOptionPara = _this.entity.modal.option:tempOptionPara = {};
            tempOptionPara.dataItem = dataItem;
            //if(_this.entity.modal.option && _this.entity.modal.option.dsChartCog){
            //    tempDsChartCog = _this.entity.modal.option.dsChartCog;
            //}else{
            //    tempDsChartCog = null;
            //}
            option = {
                modeUsable: _this.optionTemplate.mode,
                allDataNeed: _this.optionTemplate.modelParams?_this.optionTemplate.modelParams.paraAnlysMode:true,
                rowDataType: _this.optionTemplate.modelParams?_this.optionTemplate.modelParams.paraName:[I18n.resource.analysis.paneConfig.DATA_TYPE_DEFAULT],
                rowDataTypeShowName: _this.optionTemplate.modelParams?_this.optionTemplate.modelParams.paraShowName:undefined,
                dataTypeMaxNum:[_this.optionTemplate.maxNum],
                templateType: _this.optionTemplate.type,
                dsChartCog: _this.entity.modal.dsChartCog?_this.entity.modal.dsChartCog:null,
                optionPara: tempOptionPara
            };

            if(dataItem.length == 0){
                type = true;
            }
            if(_this.screen.screen){
                _this.screen.screen.modalConfigPane.showModalInit(type, option, _this);
            }else{
                _this.screen.modalConfigPane.showModalInit(type, option, _this);
            }
            _this.screen.isScreenChange = true;
        },

        divResizeByToolInit: function(){ 
            var _this = this;
            var $divContainer = $('#divContainer_' +  _this.entity.id);
            var $divResize = $('.divResize');
            var $inputResize = $('.inputResize');
            $divContainer.find('#heightResize').mousedown(function(e){
                $('.springConfigMask').attr('draggable','false');
                $('.springContent').attr('draggable','false');
                $(e.target).mousemove(function(e){
                    $(e.target).closest('.springContainer').css('height',$(e.target).val() * _this.UNIT_HEIGHT + '%');
                    _this.entity.spanR = Number($(e.target).val());
                    $(e.target).next().text($(e.target).val() + ' /' + _this.spanRange.maxHeight);
                    if(_this.screen.screen){//兼容ModalMix
                        _this.screen.screen.setEntity(_this.entity);
                    }else{
                        _this.screen.setEntity(_this.entity);
                    }
                });
            }).mouseup(function(e){
                $('.springConfigMask').attr('draggable','true');
                $('.springContent').attr('draggable','true');
                $(e.target).off('mousemove');
                if(_this.chart) _this.chart.resize();
                _this.screen.isScreenChange = true;
                _this.hasEdit = true;
            });
            $divContainer.find('#widthResize').mousedown(function(e){
                $('.springConfigMask').attr('draggable','false');
                $('.springContent').attr('draggable','false');
                $(e.target).mousemove(function(e){
                    $(e.target).closest('.springContainer').css('width',$(e.target).val() * _this.UNIT_WIDTH + '%');
                    _this.entity.spanC = Number($(e.target).val());
                    $(e.target).next().text($(e.target).val() + ' /' + _this.spanRange.maxWidth);
                    if(_this.screen.screen) {//兼容ModalMix
                        _this.screen.screen.setEntity(_this.entity);
                    }else{
                        _this.screen.setEntity(_this.entity);
                    }
                });
            }).mouseup(function(e){
                $('.springConfigMask').attr('draggable','true');
                $('.springContent').attr('draggable','true');
                $(e.target).off('mousemove');
                if(_this.chart) _this.chart.resize();
                _this.screen.isScreenChange = true;
                _this.hasEdit = true;
            });
            $divContainer.find('.rangeVal').click(function(e){
                e.stopPropagation();
                var valueCurrent = Number($(e.target).prev().val());
                var valuePre = $(e.target).prev().val();
                var valueMax = Number($(e.target).prevAll('.inputResize').attr('max'));
                var valueMin = Number($(e.target).prevAll('.inputResize').attr('min'));
                $(e.target).nextAll('.rangeChange').css('display','inline-block').focus().off('blur').blur(function(e){
                    valueCurrent = Number($(e.target).val());
                    if(valueCurrent <= valueMax && valueCurrent >= valueMin) {
                        $(e.target).prevAll('.inputResize').val(valueCurrent.toString());
                        if ($(e.target).prevAll('.inputResize').attr('id') == 'widthResize') {
                            $(e.target).closest('.springContainer').css('width',$(e.target).val() * _this.UNIT_WIDTH + '%');
                            _this.entity.spanC = Number($(e.target).val());
                            _this.screen.setEntity(_this.entity);
                            $(e.target).prev().text($(e.target).val() + ' /' + _this.spanRange.maxWidth);
                            if(_this.chart) _this.chart.resize();
                            _this.hasEdit = true;
                        } else{
                            $(e.target).closest('.springContainer').css('height',$(e.target).val() * _this.UNIT_HEIGHT + '%');
                            _this.entity.spanR = Number($(e.target).val());
                            _this.screen.setEntity(_this.entity);
                            $(e.target).prev().text($(e.target).val() + ' /' + _this.spanRange.maxHeight);
                            if(_this.chart) _this.chart.resize();
                            _this.hasEdit = true;
                        }
                        $(e.target).css('display', 'none');
                    }else if(valueCurrent > valueMax){
                        new Alert($('#resizeAlert'), "danger", "<strong>" + I18n.resource.dashboard.resize.ERR1 + "</strong>").show().close();
                        $(e.target).val(valuePre).css('display', 'none');
                    }else if(valueCurrent < valueMin){
                        new Alert($('#resizeAlert'), "danger", "<strong>" + I18n.resource.dashboard.resize.ERR2 + "</strong>").show().close();
                        $(e.target).val(valuePre).css('display', 'none');
                    }else{
                        if($(e.target).val() != ""){
                                new Alert($('#resizeAlert'), "danger", "<strong>" + I18n.resource.dashboard.resize.ERR3 + "</strong>").show().close();
                            }
                        $(e.target).val(valuePre).css('display', 'none');
                    }
                    _this.hasEdit && (_this.screen.isScreenChange = true);
                })
            });
        },
        divResizeByMouseInit: function() {
            var _this = this;
            var $widthResize;
            var $heightResize;
            var divContainer = $('#divContainer_' +  _this.entity.id).get(0);
            var resizeOnRight = document.createElement('div');
            resizeOnRight.className = 'resizeOnRight';
            divContainer.appendChild(resizeOnRight);
            var resizeOnBottom = document.createElement('div');
            resizeOnBottom.className = 'resizeOnBottom';
            divContainer.appendChild(resizeOnBottom);
            var resizeOnCorner = document.createElement('div');
            resizeOnCorner.className = 'resizeOnCorner';
            divContainer.appendChild(resizeOnCorner);
            var mouseStart = {};
            var divStart = {};
            var rightStart = {};
            var bottomStart = {};
            var w, h,tempSpanR,tempSpanC;
            resizeOnRight.onmousedown =  function(e){
                e.stopPropagation();
                if (e.button != 0 )return;
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0){
                    $possibleParent.attr('draggable',false)
                }
                $(e.target).prev().children(':last-child').attr('draggable',false);
                $widthResize = $(e.target).parent().find('#widthResize');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                rightStart.x = resizeOnRight.offsetLeft;
                doResizeOnRight(e);
                if(resizeOnRight.setCapture){
                    resizeOnRight.onmousemove = doResizeOnRight;
                    resizeOnRight.onmouseup = stopResizeOnRight;
                    resizeOnRight.setCapture();
                }else{
                    document.addEventListener("mousemove",doResizeOnRight,false);
                    document.addEventListener("mouseup",stopResizeOnRight,false);
                }
            };
            function doResizeOnRight(e){
                var oEvent = e || event;
                var l = oEvent.clientX - mouseStart.x + rightStart.x;
                w = l + resizeOnCorner.offsetWidth;
                if(w < resizeOnCorner.offsetWidth){
                    w = resizeOnCorner.offsetWidth;
                }
                else if( w > document.documentElement.clientWidth - divContainer.offsetLeft){
                    w = document.documentElement.clientWidth - divContainer.offsetLeft - 2;
                }
                //w = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH)) * _this.UNIT_WIDTH;
                divContainer.style.width = w + "px";
            }
            function stopResizeOnRight(e){
                if (resizeOnRight.releaseCapture) {
                    tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                    rangeJudge();
                    $widthResize.val(tempSpanC.toString());
                    $widthResize.next().text(tempSpanC.toString() + ' /' + _this.spanRange.maxWidth);
                    $widthResize.next().next().val(tempSpanC.toString());
                    divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                    _this.entity.spanC = tempSpanC;
                    resizeOnRight.onmousemove = null;
                    resizeOnRight.onmouseup = null;
                    resizeOnRight.releaseCapture();
                    if (_this.chart) _this.chart.resize();
                    _this.hasEdit = true;
                } else {
                    tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                    rangeJudge();
                    $widthResize.val(tempSpanC.toString());
                    $widthResize.next().text(tempSpanC.toString() + ' /' + _this.spanRange.maxWidth);
                    $widthResize.next().next().val(tempSpanC.toString());
                    divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                    _this.entity.spanC = tempSpanC;
                    document.removeEventListener("mousemove", doResizeOnRight, false);
                    document.removeEventListener("mouseup", stopResizeOnRight, false);
                    if (_this.chart) _this.chart.resize();
                    _this.hasEdit = true;
                }
                _this.screen.isScreenChange = true;
                $(e.target).prev().children(':last-child').attr('draggable',true);
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0){
                    $possibleParent.attr('draggable',true)
                }
            }
            resizeOnBottom.onmousedown = function(e){
                e.stopPropagation();
                if (e.button != 0 )return;
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0){
                    $possibleParent.attr('draggable',false)
                }
                $(e.target).prev().children(':last-child').attr('draggable',false);
                $heightResize = $(e.target).parent().find('#heightResize');
                var oEvent = e || event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                bottomStart.y = resizeOnBottom.offsetTop;
                doResizeOnBottom(e);
                if(resizeOnBottom.setCapture){
                    resizeOnBottom.onmousemove = doResizeOnBottom;
                    resizeOnBottom.onmouseup = stopResizeOnBottom;
                    resizeOnBottom.setCapture();
                }else{
                    document.addEventListener("mousemove",doResizeOnBottom,false);
                    document.addEventListener("mouseup",stopResizeOnBottom,false);
                }
            };
            function doResizeOnBottom(e){
                var oEvent = e || event;
                var t = oEvent.clientY - mouseStart.y + bottomStart.y;
                h = t + resizeOnCorner.offsetHeight;
                if(h < resizeOnCorner.offsetHeight){
                    h = resizeOnCorner.offsetHeight;
                }else if(h > document.documentElement.clientHeight - divContainer.offsetTop){
                    h = document.documentElement.clientHeight - divContainer.offsetTop - 2;
                }
                //h = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT)) * _this.UNIT_HEIGHT;
                divContainer.style.height = h + "px";
            }
            function stopResizeOnBottom(e){
                if (resizeOnBottom.releaseCapture) {
                    tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                    rangeJudge();
                    $heightResize.val(tempSpanR.toString());
                    $heightResize.next().text(tempSpanR.toString() + ' /' +_this.spanRange.maxHeight);
                    $heightResize.next().next().val(tempSpanR.toString());
                    divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                    _this.entity.spanR = tempSpanR;
                    resizeOnBottom.onmousemove = null;
                    resizeOnBottom.onmouseup = null;
                    resizeOnBottom.releaseCapture();
                    if (_this.chart) _this.chart.resize();
                    _this.hasEdit = true;
                } else {
                    tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                    rangeJudge();
                    $heightResize.val(tempSpanR.toString());
                    $heightResize.next().text(tempSpanR.toString() + ' /' + _this.spanRange.maxHeight);
                    $heightResize.next().next().val(tempSpanR.toString());
                    divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                    _this.entity.spanR = tempSpanR;
                    document.removeEventListener("mousemove", doResizeOnBottom, false);
                    document.removeEventListener("mouseup", stopResizeOnBottom, false);
                    if (_this.chart) _this.chart.resize();
                    _this.hasEdit = true;
                }
                _this.screen.isScreenChange = true;
                $(e.target).prev().children(':last-child').attr('draggable',true);
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0){
                    $possibleParent.attr('draggable',true)
                }
            }
            resizeOnCorner.onmousedown = function(e){
                e.stopPropagation();
                if (e.button != 0 )return;
                var $possibleParent = $(e.target).closest('.springConfigMask');
                if ($possibleParent.length > 0){
                    $possibleParent.attr('draggable',false)
                }
                $(e.target).prev().children(':last-child').attr('draggable',false);
                $widthResize = $(e.target).parent().find('#widthResize');
                $heightResize = $(e.target).parent().find('#heightResize');
                var oEvent = e||event;
                mouseStart.x = oEvent.clientX;
                mouseStart.y = oEvent.clientY;
                divStart.x = resizeOnCorner.offsetLeft;
                divStart.y = resizeOnCorner.offsetTop;
                doResizeOnCorner(e);
                if(resizeOnCorner.setCapture){
                    resizeOnCorner.onmousemove = doResizeOnCorner;
                    resizeOnCorner.onmouseup = stopResizeOnCorner;
                    resizeOnCorner.setCapture();
                }else{
                    document.addEventListener("mousemove",doResizeOnCorner,false);
                    document.addEventListener("mouseup",stopResizeOnCorner,false);
                }
                //zhezhao.style.display='block';
            };
            function doResizeOnCorner(e){
                var oEvent = e||event;
                var l = oEvent.clientX - mouseStart.x + divStart.x;
                var t = oEvent.clientY - mouseStart.y + divStart.y;
                w = l + resizeOnCorner.offsetWidth;
                h = t + resizeOnCorner.offsetHeight;
                if(w < resizeOnCorner.offsetWidth){
                    w = resizeOnCorner.offsetWidth;
                }
                else if(w > document.documentElement.clientWidth - divContainer.offsetLeft){
                    w=document.documentElement.clientWidth - divContainer.offsetLeft - 2;
                }
                if(h < resizeOnCorner.offsetHeight){
                    h = resizeOnCorner.offsetHeight;
                }else if(h > document.documentElement.clientHeight - divContainer.offsetTop){
                    h = document.documentElement.clientHeight - divContainer.offsetTop - 2;
                }
                //w = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH)) * _this.UNIT_WIDTH;
                divContainer.style.width = w + "px";
                //h = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT)) * _this.UNIT_HEIGHT;
                divContainer.style.height = h + "px";
            }
             function stopResizeOnCorner(e){
                 if (resizeOnCorner.releaseCapture) {
                     tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                     tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                     rangeJudge();
                     $widthResize.val(tempSpanC.toString()).get(0).setAttribute('value', tempSpanC.toString());
                     $widthResize.next().text(tempSpanC.toString() + ' /' + _this.spanRange.maxWidth);
                     $widthResize.next().next().val(tempSpanC.toString());
                     $heightResize.val(tempSpanR.toString()).get(0).setAttribute('value', tempSpanR.toString());
                     $heightResize.next().text(tempSpanR.toString() + ' /' + _this.spanRange.maxHeight);
                     $heightResize.next().next().val(tempSpanR.toString());
                     divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                     divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                     _this.entity.spanC = tempSpanC;
                     _this.entity.spanR = tempSpanR;
                     resizeOnCorner.onmousemove = null;
                     resizeOnCorner.onmouseup = null;
                     resizeOnCorner.releaseCapture();
                     if (_this.chart) _this.chart.resize();
                     _this.hasEdit = true;
                 } else {
                     tempSpanC = parseInt(w * 100 / (divContainer.parentNode.clientWidth * _this.UNIT_WIDTH));
                     tempSpanR = parseInt(h * 100 / (divContainer.parentNode.clientHeight * _this.UNIT_HEIGHT));
                     rangeJudge();
                     $widthResize.val(tempSpanC.toString());
                     $widthResize.next().text(tempSpanC.toString() + ' /' + _this.spanRange.maxWidth);
                     $widthResize.next().next().val(tempSpanC.toString());
                     $heightResize.val(tempSpanR.toString());
                     $heightResize.next().text(tempSpanR.toString() + ' /' + _this.spanRange.maxHeight);
                     $heightResize.next().next().val(tempSpanR.toString());
                     divContainer.style.width = tempSpanC * _this.UNIT_WIDTH + "%";
                     divContainer.style.height = tempSpanR * _this.UNIT_HEIGHT + "%";
                     _this.entity.spanC = tempSpanC;
                     _this.entity.spanR = tempSpanR;
                     document.removeEventListener("mousemove", doResizeOnCorner, false);
                     document.removeEventListener("mouseup", stopResizeOnCorner, false);
                     if (_this.chart) _this.chart.resize();
                     _this.hasEdit = true;
                 }
                 _this.screen.isScreenChange = true;
                 var $possibleParent = $(e.target).closest('.springConfigMask');
                 if ($possibleParent.length > 0){
                     $possibleParent.attr('draggable',true)
                 }
                 $(e.target).prev().children(':last-child').attr('draggable',true);
             //zhezhao.style.display='none';
             }
            function rangeJudge(){
                if (tempSpanC > _this.spanRange.maxWidth){
                    tempSpanC = _this.spanRange.maxWidth
                }else if(tempSpanC < _this.spanRange.minWidth){
                    tempSpanC = _this.spanRange.minWidth
                }
                if (tempSpanR > _this.spanRange.maxHeight){
                    tempSpanR = _this.spanRange.maxHeight
                }else if(tempSpanR < _this.spanRange.minHeight){
                    tempSpanR = _this.spanRange.minHeight
                }
            }
        },

        // 附加 "历史数据" 按钮事件
        attachLkHistoryEvents: function (domItem) {
            var _this = this;
            
            domItem.onclick = function (e) {
                _this.modalDBHistory.setModal(_this.entity.modal, _this.chart);
                _this.modalDBHistory.show();
                e.preventDefault();
                e.stopPropagation();
            };
        },

        modalDBHistory: new ModalDBHistory(),

        initPointAlias :function(arrPoints){
            var arrPointsAlias = [];
            var lastRepeatIndex = -1 ;
            var tempAlias;
            var repeatNum = 0;
            var tempIndex;

            var arrId = [];
            var arrItem = [];
            for (var i = 0; i< arrPoints.length; ++i){
                arrId.push(arrPoints[i].dsItemId);
            }
            arrItem = AppConfig.datasource.getDSItemById(arrId);
            for (var i = 0; i< arrPoints.length; ++i){
                for (var m = 0; m < arrItem.length; m++) {
                    if (arrPoints[i].dsItemId == arrItem[m].id) {
                        arrPointsAlias.push(arrItem[m].alias);
                        break;
                    }
                }
                //arrPointsAlias.push(AppConfig.datasource.getDSItemById(arrPoints[i].dsItemId).alias);
            }
            for (var i =0 ;i < arrPoints.length; ++i){
                lastRepeatIndex = arrPointsAlias.lastIndexOf(arrPointsAlias[i]);
                if (lastRepeatIndex > i){
                    repeatNum = 1;
                    tempAlias = arrPointsAlias[i];
                    arrPointsAlias[i] = tempAlias + '_No1';
                    tempIndex = i;
                    for (var j = tempIndex + 1; j < lastRepeatIndex + 1 ;j++){
                        repeatNum +=1;
                        tempIndex = arrPointsAlias.indexOf(tempAlias);
                        if(tempIndex == -1)break;
                        arrPointsAlias[tempIndex] = tempAlias + '_No' + repeatNum;
                    }
                }
            }
            return arrPointsAlias;
        },

        // close
        close: function () {
            if (this.chart) {
                //this.chart.clear();
                this.chart.dispose();
            }
            this.container = null;
            this.entity = null;
            this.executeConfigMode = null;
            this.executeRender = null;
            this.executeUpdate = null;
            this.isFirstRender = null;
            this.modalWikiCtr = null;
            this.screen = null;
            this.isConfigMode = null;
            this.reportScreen = null;
            typeof this._close === 'function' && this._close();
        },

        //pop
        renderPop: function(pop){
            if(!pop) return;
            var $target = $('#divContainer_' + this.entity.id).find('.panel');
            var $panePop = $target.find('.panePop');
            var tpl = '<div class="divMove"><span>{popMsg}</span></div>\
                <span class="glyphicon glyphicon-remove-circle btnClosePop" title="Close"></span>';
            if(!$panePop[0]){
                $panePop = $('<div class="panel-body panePop"></div>');
                $target.append($panePop);
            }
            $panePop.html(tpl.formatEL({
                popMsg: pop.data
            }));//pop.data
            var spanWidth = $panePop.find('span').width();
            var $divMove = $panePop.find('.divMove');
            if(spanWidth > $divMove.width()){
                var $marquee = $('<marquee direction="left" onmouseover="this.stop()" onmouseout="this.start()" scrollAmount="3" style="height: 40px; width: calc(100% - 28px);"></marquee>');
                $marquee.html($panePop.find('span').html());
                $marquee.appendTo($panePop);
                $divMove.remove();
            }

            //events
            $panePop.find('.btnClosePop').off().click(function(){
                $panePop.hide();
            });
        },

        getInstanceOfModalWiki: function(){
            if(!this.modalWikiCtr){
                this.modalWikiCtr = new ModalWiki(this);
            }
            return this.modalWikiCtr;
        }
    };
    return ModalBase;
})();

﻿var ModalNone = (function () {
    function ModalNone(screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this.renderModal, null, null);
    }

    ModalNone.prototype = new ModalBase();
    ModalNone.prototype.optionTemplate = {
        name: '',
        //parent: 0,
        mode: ['realTime'],
        maxNum: 1,
        title: '',
        minHeight: 1,
        minWidth: 2,
        maxHeight: 6,
        maxWidth: 12,
        type:'ModalNone'
    };

    ModalNone.prototype.renderModal = function () {
        //this.container.innerHTML = template;
        I18n.fillArea($('#coalSaveName').parent());
        $(this.container).parent().css('visibility','hidden');
        this.spinner.stop();
    },

    ModalNone.prototype.configure = function () {
        this.spinner.stop();
        var _this = this;
        $(_this.container).parent().css('visibility','');
        var divAdd = document.createElement('span');
        divAdd.className = 'springConfigTips';
        divAdd.innerHTML = 'Drag data meta from left panel';
        this.container.appendChild(divAdd);
        var btnRemove = document.createElement('span');
        btnRemove.className = 'glyphicon glyphicon-remove-circle springConfigRemoveBtn grow';
        btnRemove.title = 'Remove';
        btnRemove.onclick = function (e) {
            if (_this.chart) _this.chart.clear();
            if(_this.screen.screen){//兼容ModalMix
                _this.screen.screen.removeEntity(_this.entity.id);
            }else{
                _this.screen.removeEntity(_this.entity.id);
            }

            $('#divContainer_' + _this.entity.id).remove();
            _this = null;
        };
        this.container.appendChild(btnRemove);
        var btnHeightResize = document.createElement('div');
        var maxHeight = this.optionTemplate.maxHeight;
        var maxWidth = this.optionTemplate.maxWidth;
        var minHeight = this.optionTemplate.minHeight;
        var minWidth = this.optionTemplate.minWidth;
        btnHeightResize.className = 'divResize divHeightResize';
        btnHeightResize.innerHTML = '<label for="heightResize" >H: </label>' +
        '<input type="range" class="inputResize" id="heightResize" name="points" step="0.5" min="' + minHeight + '" max="' + maxHeight + '" value="' + _this.entity.spanR + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanR + ' /6</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanR + '"/>';
        this.container.appendChild(btnHeightResize);
        var btnWidthResize = document.createElement('div');
        btnWidthResize.className = 'divResize divWidthResize';
        btnWidthResize.innerHTML = '<label for="widthResize" >W: </label>' +
        '<input type="range" class="inputResize" id="widthResize" name="points" step="0.5" min="' + minWidth + '" max="' + maxWidth + '" value="' + _this.entity.spanC + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanC + ' /12</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanC + '"/>';
        this.container.appendChild(btnWidthResize);
        this.divResizeByMouseInit();
        this.divResizeByToolInit();

        if (this.entity.isNotRender && this.screen.entity) {//兼容ModalMix
            $(document.getElementById('divContainer_' + this.screen.entity.id)).find('.chartsCt')[0].appendChild(this.container.parentNode.parentNode);
        }

        var divParent = $(this.container).closest('.springContainer')[0];
        var divContent = $(divParent).find('.springContent')[0];
        divContent.draggable = 'true';
        divContent.ondragstart = function (e) {
            //e.preventDefault();
            e.dataTransfer.setData("id", $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', ''));
        };
        divContent.ondragover = function (e) {
            e.preventDefault();
        };
        divContent.ondragleave = function (e) {
            e.preventDefault();
        };
        divParent.ondrop = function (e) {
            e.stopPropagation();
            if (e.dataTransfer.getData("type") && e.dataTransfer.getData("title")) {
                /*if(e.dataTransfer.getData("type") == "ModalPointKPI"){
                    alert(I18n.resource.toolBox.modal.MSG_KPI_NOT_ALLOW_TO_MIX);
                    return false;
                }*/
                if(_this.screen.screen){
                    var entity = _this.entity;
                    //Mixchart is not allow has sub Mixchart
                    if(e.dataTransfer.getData("type") == 'ModalMix'){
                        alert(I18n.resource.toolBox.modal.MSG_MIX_NOT_ALLOW_TO_MIX);
                        return;
                    }if(e.dataTransfer.getData("type") == "ModalPointKPI"){// Mixchart is not allow to have modalPointKPI
                        alert(I18n.resource.toolBox.modal.MSG_KPI_NOT_ALLOW_TO_MIX);
                        return false;
                    }else{
                        _this.screen.screen.rebornEntity(entity, e.dataTransfer.getData("type"), e.dataTransfer.getData("title"));
                    }
                }else{
                    _this.screen.rebornEntity(_this.entity, e.dataTransfer.getData("type"), e.dataTransfer.getData("title"),_this.hasEdit);
                }

            }else if(e.dataTransfer.getData("id")){
                var targetId = $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', '');
                _this.screen.replaceEntity(e.dataTransfer.getData("id"), targetId);
            }
        }
    };

    return ModalNone;
})();
﻿var ModalAnalysis = (function () {
    var _this = undefined;

    function ModalAnalysis(screen, entityParams) {
        entityParams.spanR = 6;
        entityParams.spanC = 12;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
        // 为了适配 Docker，这里包一层
        this.spinner.stop();
        this.container = $('<div style="padding: 20px;position: absolute;left:0;top:0;right:0;bottom:0; z-index: 102; overflow-y: auto;"></div>')
        .appendTo(this.container)[0];

        _this = this;

        this.curModal = this.entity.modal.option.option;
        this.entityAnalysis = undefined;
        this.saveModalJudge = $.Deferred();
    }

    ModalAnalysis.prototype = new ModalBase();

    ModalAnalysis.prototype.optionTemplate = {
        name: 'toolBox.modal.TRANSIT',
        parent: 2,
        mode: ['realTimeWithoutRange'],
        maxNum: 1,
        title: '',
        minHeight: 1,
        minWidth: 1,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalAnalysis'
    };

    ModalAnalysis.prototype.renderModal = function () {
        var modalClass = this.screen.factoryIoCAnalysis.getModel(this.entity.modal.option.type);
        this.screen.curModal = this.curModal;
        this.entityAnalysis = new modalClass(this.container, this.curModal, this);
        this.entityAnalysis.isShareMode = 1;
        this.entityAnalysis.paneChart = null;//this.container;
        this.entityAnalysis.chartAnimationDuration = 500;
        this.entityAnalysis.animation = false;
        this.entityAnalysis.show();
    };

    ModalAnalysis.prototype.onresize = function () {
        if (this.entityAnalysis.chart) this.entityAnalysis.chart.resize();
    };

    ModalAnalysis.prototype.updateModal = function (points) { };

    ModalAnalysis.prototype.showConfigMode = function () { };

    ModalAnalysis.prototype.setModalOption = function (option) { };

    ModalAnalysis.prototype.alertNoData = function () { };

    ModalAnalysis.prototype.spinnerStop = function () { };
    
    ModalAnalysis.prototype.saveModal = function () { };

    return ModalAnalysis;
})();

var ModalConfig = (function ($, undefined) {

    var arrForEach = Array.prototype.forEach;

    //////////////////////////////////
    // ModalConfig CLASS DEFINITION //
    //////////////////////////////////
    function ModalConfig(options) {
        // parameters
        this.options = $.extend({}, this.DEFAULTS, options);
        // DOM
        this.$wrap = null;
    };

    //////////////////////////////////////
    // ModalConfig PROTOTYPE DEFINITION //
    //////////////////////////////////////
    ModalConfig.prototype = {
        constructor: ModalConfig,
        // 显示配置弹出框
        show: function () {
            var _this = this;
            var htmlUrl = this.options.htmlUrl;
            var matches = htmlUrl.match(/\/?(\w+)(?:\.html)/);
            var id, domPanelContent;
            var promise = $.Deferred();

            // url有误
            if(!matches || matches[1] === undefined) {
                console.error('the url of config modal is illigal: '+ htmlUrl);
                return false;
            }

            // 自动将 "文件名+Wrap" 作为 wrap 层的 DOM id
            // id rule: "文件名+Wrap"
            id = matches[1] + 'Wrap';

            if($('#'+id).length > 0) {
                promise.resolve();
            } else {
                domPanelContent = document.getElementById(this.options.container || 'paneContent');
                Spinner.spin(domPanelContent);

                // get the template from server
                WebAPI.get(htmlUrl).done(function (html) {
                    Spinner.stop();
                    _this.$wrap = $('<div class="modal-config-wrap" id="'+id+'">')
                        .appendTo(domPanelContent).html(html);
                    _this.$modal = _this.$wrap.children('.modal');
                    _this._attachEvents();
                    _this.init();
                    promise.resolve();
                });
            }

            return promise.done(function () {
                _this.$modal.modal('show');
            });
        },
        /**
         * 设置表单某个字段的值
         * 这个方法的目的主要是：方便 reset 和 recover 表单的操作
         * 调用方式：__setField(type, $ele [,value])
         * @param  {string} type  告诉方法当前处理的表单字段是什么类型的
         * @param  {object(jQuery Wrap)} $ele  当前表单字段对应的 DOM 对象
         * @param  {number|string} value 需要向当前表单字段中填充的数值，可缺省，缺省时默认使用''，
         *                               当需要重置某个表单字段时，缺省该参数即可
         */
        _setField: function (type, $ele, value) {
            var itemMap, name;
            var _this = this;
            switch(type) {
                // 下拉列表
                case 'dropdown':
                    itemMap = $ele.data('dropdown-items');
                    if(itemMap === undefined) {
                        $ele.data('dropdown-items', 
                            // value-text 映射表 
                            itemMap = (function () {
                                var rs = {};
                                $ele.siblings('ul').find('a').each(function (i, item) {
                                    var $item = $(item);
                                    var value = $item.attr('data-value');
                                    var text  = $item.text();
                                    if(rs[value] === undefined) rs[value] = text;
                                });
                                return rs;
                            } ())
                        );   
                    }
                    $ele.attr('data-value', value).children('span').eq(0).text(itemMap[value]);
                    break;
                // 文本框
                case 'input':
                // 文本域
                case 'textarea':
                    if(value === undefined || value === null) value = '';
                    $ele.val(value);
                    break;
                // 数据源拖拽区域
                case 'droparea':
                    // reset
                    if(value === undefined || value.trim() === '') {
                        $ele.attr('data-value', '').html('<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;">');
                    }
                    // recover
                    else {
                        // 获取数据源的名称
                        name = AppConfig.datasource.getDSItemById(value).alias;
                        $ele.attr({'data-value': value, 
                            'title': name}).html('<input value="'+name+'" type="text">');
                        $ele.parent('.drop-area-wrap').removeClass('noData');
                        //if($ele.closest('.col-md-9').children('.noData').length === 0){
                        //    $ele.closest('.col-md-9').append('<div class="col-md-6 noData drop-area-wrap" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                        //    '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
                        //    )
                        //}
                        //$ele.next('.spanDataDel').on('click',function(){
                        //    $ele.parent('.col-md-6').remove();
                        //})
                    }
                    break;
                // some more...
                default:
                    break;
            }
        },
        /**
         * 初始化一些公共的事件
         */
        _attachEvents: function () {
            var _this = this;
            var $modal;
            /////////////////////////////////
            // all dropdown selected event //
            /////////////////////////////////
            $('.dropdown-menu', this.$wrap).off('click.selected').on('click.selected', 'a', function (e) {
                var $this = $(this);
                var $btn = $this.parents('.dropdown-wrap').children('button');
                var value = $this.attr('data-value');
                var text = $this.text();

                $btn.attr('data-value', value);
                $btn.children('span').eq(0).text(text);

                e.preventDefault();
            });

            ////////////////////////////
            // modal show/hide events //
            ////////////////////////////
            $modal = $('.modal', this.$wrap);
            $modal.off('show.bs.modal').on('show.bs.modal', function (e) {
                var $rightCt;
                if(e.namespace !== 'bs.modal') return true;
                $rightCt = $('#rightCt');
                // recover the form
                _this.recoverForm(_this.options.modalIns.entity.modal);
                // show the data soucre panel
                if(!$rightCt.hasClass('rightCtOpen')) $rightCt.click();
            });
            $modal.off('hide.bs.modal').on('hide.bs.modal', function (e) {
                var $rightCt;
                if(e.namespace !== 'bs.modal') return true;
                $rightCt = $('#rightCt');
                // reset the form state
                _this.reset();
                // hide the data soucre panel
                if($rightCt.hasClass('rightCtOpen')) $rightCt.click();
            });

            ///////////////////////
            // point Drop EVENTS //
            ///////////////////////
            this.$wrap.off('dragover').on('dragover', '.drop-area', function (e) {
                e.preventDefault();
            });
            this.$wrap.off('dragenter').on('dragenter', '.drop-area', function (e) {
                $(e.target).addClass('on');
                e.preventDefault();
                e.stopPropagation();
            });
            this.$wrap.off('dragleave').on('dragleave', '.drop-area', function (e) {
                $(e.target).removeClass('on');
                $(e.target).parent('.col-md-6').removeClass('noData');
                e.stopPropagation();
            });
            this.$wrap.off('drop').on('drop', '.drop-area', function (e) {
                var itemId = EventAdapter.getData().dsItemId;
                var $target = $(e.target);
                var name;
                if(!itemId) return;
                $target.removeClass('on');
                $target.parent('.drop-area-wrap').removeClass('noData');
                if($target.closest('.col-md-9').children('.noData').length === 0){
                    $target.closest('.col-md-9').append('<div class="col-md-6 noData drop-area-wrap" style="position: relative;padding:0 15px 10px 0;"><div class="drop-area">' +
                        '<span class="glyphicon glyphicon-plus"></span><input value="" type="text" style="display:none;"></div><span class="glyphicon glyphicon-remove spanDataDel"></span></div>'
                    )
                }
                _this._setField('droparea', $target, itemId);
                e.stopPropagation();
            });
        },
        setOptions: function (options) {
            this.options = $.extend({}, this.options, options);
        }
    };

    return ModalConfig;
} (jQuery));
﻿var ModalChart = (function () {
    function ModalChart(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);

    }
    ModalChart.prototype = new ModalBase();

    ModalChart.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_CHART',
        parent:0,
        mode:['realTime'],
        maxNum: 10,
        title:'',
        minHeight:1,
        minWidth:1,
        maxHeight:6,
        maxWidth:12,
        type:'ModalChart'
    };

    ModalChart.prototype.optionDefault = {
        // 默认色板
        color: [
            '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
            '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
            '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
            '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
        ],

        // 图表标题
        title: {
            textStyle: {
                fontWeight: 'normal',
                color: '#008acd'          // 主标题文字颜色
            }
        },
        legend: {
            textStyle: {
                fontFamily: "Microsoft YaHei"
            }
        },
        // 值域
        dataRange: {
            itemWidth: 15,
            color: ['#5ab1ef','#e0ffff']
        },

        // 工具箱
        toolbox: {
            x: 'right',
            y: 'center',
            feature: {
                mark: { show: true },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            },
            color : ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
            effectiveColor : '#ff4500'
        },

        // 提示框
        tooltip: {
            trigger: 'axis',
            //backgroundColor: 'rgba(50,50,50,0.5)',     // 提示背景颜色，默认为透明度为0.7的黑色
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line',         // 默认为直线，可选为：'line' | 'shadow'
                lineStyle : {          // 直线指示器样式设置
                    color: '#008acd'
                },
                crossStyle: {
                    color: '#008acd'
                },
                shadowStyle : {                     // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.2)'
                }
            }
        },

        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#efefff',            // 数据背景颜色
            fillerColor: 'rgba(182,162,222,0.2)',   // 填充颜色
            handleColor: '#008acd'    // 手柄颜色
        },

        // 网格
        grid: (function(isMobile){//统一配置grid
            var grid = {
                    borderWidth: 0,
                    borderColor: '#eee',
                    x: 70, y: 38, x2: 30, y2: 24
                }
            if(isMobile){
                grid.x = 40;
            }
            return grid;
        }(AppConfig.isMobile)),

        // 类目轴
        categoryAxis: {
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#008acd'
                }
            },
            splitLine: {           // 分隔线
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },

        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#008acd'
                }
            },
            splitArea : {
                show : true,
                areaStyle : {
                    color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)']
                }
            },
            splitLine: {           // 分隔线
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },

        polar : {
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#ddd'
                }
            },
            splitArea : {
                show : true,
                areaStyle : {
                    color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
                }
            },
            splitLine : {
                lineStyle : {
                    color : '#ddd'
                }
            }
        },

        timeline : {
            lineStyle : {
                color : '#008acd'
            },
            controlStyle : {
                normal : { color : '#008acd'},
                emphasis : { color : '#008acd'}
            },
            symbol : 'emptyCircle',
            symbolSize : 3
        },

        // 柱形图默认参数
        bar: {
            itemStyle: {
                normal: {
                    barBorderRadius: 5
                },
                emphasis: {
                    barBorderRadius: 5
                }
            },
            barMaxWidth: 80
        },

        // 折线图默认参数
        line: {
            smooth : true,
            symbol: 'none',  // 拐点图形类型
            symbolSize: 3           // 拐点图形大小
        },

        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#d87a80',       // 阳线填充颜色
                    color0: '#2ec7c9',      // 阴线填充颜色
                    lineStyle: {
                        color: '#d87a80',   // 阳线边框颜色
                        color0: '#2ec7c9'   // 阴线边框颜色
                    }
                }
            }
        },

        // 散点图默认参数
        scatter: {
            symbol: 'circle',    // 图形类型
            symbolSize: 4        // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
        },

        // 雷达图默认参数
        radar : {
            symbol: 'emptyCircle',    // 图形类型
            symbolSize:3
            //symbol: null,         // 拐点图形类型
            //symbolRotate : null,  // 图形旋转控制
        },

        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#d87a80'
                        }
                    }
                },
                emphasis: {                 // 也是选中样式
                    areaStyle: {
                        color: '#fe994e'
                    }
                }
            }
        },

        force : {
            itemStyle: {
                normal: {
                    linkStyle : {
                        color : '#1e90ff'
                    }
                }
            }
        },

        chord : {
            itemStyle : {
                normal : {
                    borderWidth: 1,
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    chordStyle : {
                        lineStyle : {
                            color : 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis : {
                    borderWidth: 1,
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    chordStyle : {
                        lineStyle : {
                            color : 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },

        gauge : {
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#2ec7c9'],[0.8, '#5ab1ef'],[1, '#d87a80']],
                    width: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                splitNumber: 10,   // 每份split细分多少段
                length :15,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length :22,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer : {
                width : 5
            }
        },

        textStyle: {
            fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
        }
    };
    ModalChart.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption(this.options);
    },
    ModalChart.prototype.updateModal = function (pointName, pointValue) {
    },
    ModalChart.prototype.showConfigMode = function () {
    },
    ModalChart.prototype.dsChartCog = function (cog, option) {
        if(!cog) return;
        if(cog[0].upper) option.yAxis[0].max = cog[0].upper;
        if(cog[0].lower) option.yAxis[0].min = cog[0].lower;
        if(cog[0].unit) option.yAxis[0].name = cog[0].unit;
        if(cog[0].markLine){
            if(!option.series[0].markLine) {
                option.series[0].markLine = {};
                option.series[0].markLine.data = new Array();

            }
            for(var i in cog[0].markLine){
                var markLine = cog[0].markLine[i];
                if(!markLine.value) continue;
                var arr = [
                    {name: markLine.name, xAxis: -1, yAxis: markLine.value},
                    {name: markLine.name, xAxis: option.series[0].data.length, yAxis: markLine.value}
                ];
                option.series[0].markLine.data.push(arr);
            }
        }
    }
    return ModalChart;
})();

/* 饼图 start */
var ModalRealtimePie = (function () {
    function ModalRealtimePie(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    ModalRealtimePie.prototype = new ModalBase();
    ModalRealtimePie.prototype.optionTemplate = {
        name:'',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12
    };
    ModalRealtimePie.prototype.optionDefault = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            y: 'center'
        },
        toolbox: {
            show: false,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'center',
                            max: 1548
                        }
                    }
                },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        color: ['rgb(233,77,60)', 'rgb(105,170,187)', 'rgb(244,116,38)', 'rgb(73,152,234)', 'rgb(241,156,15)', 'rgb(241,191,0)', 'rgb(241,209,0)', 'rgb(230,224,13)', 'rgb(182,209,78)', 'rgb(146,192,129)'],
        series: [
            {
                type: 'pie',
                radius: ['50%', '70%'],
                center:['50%','50%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{d}%' //  '{b} : {c} ({d}%)'
                        },
                        labelLine: {
                            show: true
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        }
                    }
                }
            }
        ]
    };
    ModalRealtimePie.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {}, this.optionDefault, this.option));
    },
    ModalRealtimePie.prototype.updateModal = function (points) {
    },
    ModalRealtimePie.prototype.showConfigMode = function () {
    },
    ModalRealtimePie.prototype.dealWithData = function(points, len){
        var arr = [];
        var arrLegend = this.initPointAlias(points);
        var arrSeries = [];
        for(var i = 0; i < points.length; i++){
            var seriesData = {
                 value: tofixed(points[i].data),
                 name: arrLegend[i]
            };
            arrSeries.push(seriesData);
        }
        arr.push(arrLegend);
        arr.push(arrSeries);
        return arr;
    },

    ModalRealtimePie.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };

    return ModalRealtimePie;
})();
/* 饼图 end */

/* 折线图 start */
var ModalRealtimeLine = (function () {
    function ModalRealtimeLine(screen, entityParams) {
        if (!entityParams) return;
        ModalChart.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    ModalRealtimeLine.prototype = new ModalChart();
    ModalRealtimeLine.prototype.optionTemplate = {
        name:'',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12
    };
    ModalRealtimeLine.prototype.optionDefault = $.extend(true,{}, {grid: ModalChart.prototype.optionDefault.grid, legend: ModalChart.prototype.optionDefault.legend}, {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: [],
            orient: 'horizontal',
            x: 'center',
            y: 'top'
        },
        //grid: {x: 70, y: 38, x2: 10, y2: 24},
        toolbox: {
            show: false,
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] }
            }
        },
        calculable: (function(){
            if(AppConfig.isMobile){
                return false;
            }else{
                return true;
            }
        }()),
        color: ['#e84c3d', '#1abc9c', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                 '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                 '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                splitLine: {show: false},
                splitArea:{show:false},
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                splitLine: {
                    show:(function(){
                        if(AppConfig.isMobile){
                            return false;
                        }else{
                            return true;
                        }
                    }())
                },
                splitArea:{show:false},
                axisLabel : {
                    formatter: function (value){
                        if(AppConfig.isMobile && value/1000 >= 1){
                            return value/1000 + 'k';
                        }else{
                            return value;
                        }
                    }
                }
            }
        ],
        series: [
            {
                type: 'line',
                symbol: 'none',
                smooth: true
            }
        ],
        animation: true
    });
    ModalRealtimeLine.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {}, this.optionDefault, this.option));
    },
    ModalRealtimeLine.prototype.updateModal = function (points) {
    },
    ModalRealtimeLine.prototype.showConfigMode = function () {
    },
    ModalRealtimeLine.prototype.dealWithData = function (points,dsChartCog) {
        var arr = [], arrLegend = [],arrSeries = [], accuracy;
        var index,strArrLegend,pointNameReg;
        if(!dsChartCog){
            accuracy = 2;
        }else{
            accuracy = parseInt(dsChartCog[0].accuracy);
        }
        arrLegend = this.initPointAlias(points.list);
        for (var i = 0; i < points.list.length; i++) {
            var dataList = [];
            for(var j in points.list[i].data){
                dataList.push(points.list[i].data[j].toFixed(accuracy));
            }
            var series = {
                 name: arrLegend[i],
                 type: 'line',
                 symbol: 'none',
                 smooth: true,
                 data: dataList,
                z:3
            }
            arrSeries.push(series);
        }
        arr.push(arrLegend);
        arr.push(arrSeries);
        return arr;
    },
    ModalRealtimeLine.prototype.dealWithAddData = function (points,len) {
        var arr = [];
        for(var i = 0; i < points.length; i++){
            var temp = [i, tofixed(points[i].data), false, true];
            arr.push(temp);
        }
        return arr;
    },
    ModalRealtimeLine.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    return ModalRealtimeLine;
})();
/* 折线图 end */

/* 柱图 start*/
var modalRealtimeBar = (function () {
    function modalRealtimeBar(screen, entityParams) {
        if (!entityParams) return;
        ModalChart.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    modalRealtimeBar.prototype = new ModalChart();
    modalRealtimeBar.prototype.optionTemplate = {
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12
    };
    modalRealtimeBar.prototype.optionDefault = $.extend(true,{},{grid: ModalChart.prototype.optionDefault.grid}, {
        tooltip: {
            trigger: 'item'
        },
        calculable: (function(){
            if(AppConfig.isMobile){
                return false;
            }else{
                return true;
            }
        }()),
        //grid: {x: 70, y: 38, x2: 10, y2: 24},
        xAxis: [
            {
                type: 'category',
                show: true,
                splitLine: {show: false},
                splitArea:{show:false},
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea:{show:false},
                splitLine: {
                    show:(function(){
                        if(AppConfig.isMobile){
                            return false;
                        }else{
                            return true;
                        }
                    }())
                },
                axisLabel : {
                    formatter: function (value){
                        if(AppConfig.isMobile && value/1000 >= 1){
                            return value/1000 + 'k';
                        }else{
                            return value;
                        }
                    }
                }
            }
        ],
        animation: true
    });
    modalRealtimeBar.prototype.renderModal = function () {
        this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {}, this.optionDefault, this.option));
    },
    modalRealtimeBar.prototype.updateModal = function (points) {
    },
    modalRealtimeBar.prototype.showConfigMode = function () {
    },
    modalRealtimeBar.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    return modalRealtimeBar;
})();
/* 柱图 end*/


/* 横向比较 自定义柱图 start*/
var ModalRealtimeBarEnegBrkd = (function () {

    function ModalRealtimeBarEnegBrkd(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        modalRealtimeBar.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);

    };
    ModalRealtimeBarEnegBrkd.prototype = new modalRealtimeBar();

    ModalRealtimeBarEnegBrkd.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_CHART_BAR_ENERGY',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimeBarEnegBrkd'
    };

    ModalRealtimeBarEnegBrkd.prototype.renderModal = function () {
        this.isFirstRender = true;
    },

    ModalRealtimeBarEnegBrkd.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var _this = this;
        var dsChartCog = this.entity.modal.dsChartCog;
        var entityItem = dealWithData(points,dsChartCog);
        var optionDefault = {
            tooltip: {
                trigger: 'item'
            },
            toolbox: {
                show: false
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    show: true
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    show: true
                }
            ],
            series: [
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                // build a color map as your need.
                                var colorList = [
                                  '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                   '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                   '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: true,
                                position: 'top',
                                formatter: '{c}'
                            }
                        }
                    },
                    barMaxWidth: 80
                }
            ]
        };

        if(!this.chart || this.isFirstRender){
            var entityData = {
                xAxis: [
                    {
                        data: entityItem[0]
                    }
                ],
                series: [
                    {
                        data: entityItem[1],
                        markPoint: {
                            data: entityItem[2]
                        }
                    }
                ]
            };
            this.dsChartCog(dsChartCog,entityData);
            this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {},this.optionDefault, optionDefault,entityData));
            this.isFirstRender = false;
        }else{
            this.chart.setSeries([
                    {
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    var colorList = [
                                     '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                      '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                      '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                    ];
                                    return colorList[params.dataIndex]
                                }
                            }
                        },
                        data: entityItem[1],
                        markPoint: {
                            data: entityItem[2]
                        }
                    }
                ])
        }
        function dealWithData(points,dsChartCog){
            var arr = [], arrXAxis = [], arrData = [], arrMpData = [], accuracy;
            if(!dsChartCog){
                accuracy = 2;
            }else{
                accuracy = parseInt(dsChartCog[0].accuracy);
            };
            arrXAxis = _this.initPointAlias(points);
            for(var i = 0, temp; i < points.length; i++){
                temp = points[i];
                arrData.push(tofixed(temp.data, accuracy));
                arrMpData.push({xAxis: i, value: tofixed(temp.data, accuracy), name: arrXAxis[i], symbol: 'none'})
            }
            arr.push(arrXAxis);
            arr.push(arrData);
            arr.push(arrMpData);
            return arr;
        }
    },
    ModalRealtimeBarEnegBrkd.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    return ModalRealtimeBarEnegBrkd;
})();
/* 横向比较 自定义柱图 end*/

/* 横向比较 柱图 start*/
var ModalRealtimeBarSub = (function () {

    function ModalRealtimeBarSub(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        modalRealtimeBar.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };
    ModalRealtimeBarSub.prototype = new modalRealtimeBar();

    ModalRealtimeBarSub.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_BAR',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimeBarSub'
    };

    ModalRealtimeBarSub.prototype.renderModal = function () {
        this.isFirstRender = true;
    },

    ModalRealtimeBarSub.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var _this = this;
        if(!this.chart || this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < points.length; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime;
            if (!_this.m_bIsGoBackTrace) {
                endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = true;
            }
            else {
                this.m_bIsGoBackTrace = false;
                endTime = new Date(_this.m_traceData.currentTime).format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = false;
            }
            var startTime = endTime.split(' ')[0] + ' 00:00:00';
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1'
            }).done(function (dataSrc) {
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var dsChartCog = _this.entity.modal.dsChartCog;
                var entityItem = _this.dealWithData(dataSrc,dsChartCog);
                var entityData = {
                    legend: {
                        data: entityItem[0]
                    },
                    xAxis: [
                        {
                            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
                        }
                    ],
                    yAxis:[{}],
                    toolbox: {
                        show : false,
                        feature : {
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']}
                        }
                    },
                    series: entityItem[1]
                };
                _this.dsChartCog(dsChartCog, entityData);
                var cha = echarts.init(_this.container, AppConfig.chartTheme);
                cha.clear();
                _this.chart = cha.setOption($.extend(true, {}, _this.optionDefault, entityData));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        } else{
            if(!this.chart.getSeries()) return;
            var crtHour = new Date().getHours();
            if (points && points.length > 0 && this.chart.getSeries()[0].data.length < crtHour) {//seriesData[i].dsItemId
                this.chart.addData(this.dealWithAddData(points,2));
            }
            if(this.chart.getSeries()[0].data.length > 23){
                this.isFirstRender = true;
            }
        }
    },
    ModalRealtimeBarSub.prototype.dealWithData = function (points,dsChartCog) {
        var arr = [], arrLegend = [], arrSeries = [], accuracy;
        var index, strArrLegend, pointNameReg;
        if(!dsChartCog){
            accuracy = 2;
        }else{
            accuracy = parseInt(dsChartCog[0].accuracy);
        }
        arrLegend = this.initPointAlias(points.list);
        for (var i = 0; i < points.list.length; i++) {
            var key = points.list[i].dsItemId, dataList = [];
            for(var j in points.list[i].data){
                dataList.push(points.list[i].data[j].toFixed(accuracy));
            }
            var series = {
                name: arrLegend[i],
                type: 'bar',
                symbol: 'none',
                smooth: true,
                data: dataList,
                itemStyle: {
                    normal: {
                        label: {
                            show: false,
                            position: 'top',
                            formatter: '{b}\n{c}'
                        },
                        barBorderRadius: [5, 5, 0, 0]
                    }
                }
            }
            arrSeries.push(series);
        }
        arr.push(arrLegend);
        arr.push(arrSeries);
        return arr;
    },
    ModalRealtimeBarSub.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    ModalRealtimeBarSub.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
    };
    return ModalRealtimeBarSub;
})();
/* 横向比较 柱图 end*/


/* 主页 饼图 分项能耗 start*/
var ModalRealtimePieEnegBrkd = (function () {

    function ModalRealtimePieEnegBrkd(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalRealtimePie.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);

    };

    ModalRealtimePieEnegBrkd.prototype = new ModalRealtimePie();

    ModalRealtimePieEnegBrkd.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_CHART_PIE_ENERGY',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimePieEnegBrkd'
    };

    ModalRealtimePieEnegBrkd.prototype.renderModal = function () {
        this.isFirstRender = true;
    }

    ModalRealtimePieEnegBrkd.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var  _this = this;
        if(!this.chart || this.isFirstRender){
            var entityItem = this.dealWithData(points,4);
            var entityData = {
                legend: {
                    data: entityItem[0]
                },
                series: [
                    {
                        data: entityItem[1]
                    }
                ]
            };
            this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {}, this.optionDefault, entityData));
            this.isFirstRender = false
        }else{
            var seriesData = (function(points,len){
                var arr = [];
                var arrName = _this.initPointAlias(points);
                for(var i = 0; i < points.length; i++){
                    arr.push({value: tofixed(points[i].data), name: arrName[i]});
                }
                return arr;
            })(points, 4);
            this.chart.setSeries([{
                type: 'pie',
                radius: ['50%', '70%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{d}%' //  '{b} : {c} ({d}%)'
                        },
                        labelLine: {
                            show: true
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            formatter: '{d}%',
                            position: 'center',
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        }
                    }
                },
                data: seriesData
            }],true)
        }
    },
    ModalRealtimePieEnegBrkd.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    return ModalRealtimePieEnegBrkd;
})();
/* 主页 饼图 分项能耗 end*/

/* PUE分析 饼图 数据机房分项能耗 start*/
var ModalRealtimePieDataRoom = (function () {
    function ModalRealtimePieDataRoom(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalRealtimePie.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);

    };

    ModalRealtimePieDataRoom.prototype = new ModalRealtimePie();

    ModalRealtimePieDataRoom.prototype.optionTemplate = {

        name:'toolBox.modal.REAL_TIME_CHART_PIE_DATAROOM',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimePieDataRoom'
    };

    ModalRealtimePieDataRoom.prototype.renderModal = function () {
        this.isFirstRender = true;
    }

    ModalRealtimePieDataRoom.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var entityItem = this.dealWithData(points,3);
        if(!this.chart || this.isFirstRender){
            var entityData = {
                legend: {
                    data: entityItem[0]//['服务器', '精密空调', 'VRV空调']
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['50%', '70%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: '{d}%' //  '{b} : {c} ({d}%)'
                                },
                                labelLine: {
                                    show: true
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    position: 'center',
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            }
                        },
                        data: entityItem[1]
                    }
                ]
            };
            this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption($.extend(true, {}, this.optionDefault, entityData));
            this.isFirstRender = false
        }else{
            this.chart.setSeries(
                   [{
                        type: 'pie',
                        radius: ['50%', '70%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: '{d}%' //  '{b} : {c} ({d}%)'
                                },
                                labelLine: {
                                    show: true
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    position: 'center',
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            }
                        },
                        data: entityItem[1]
                   }]
                , true
            );
        }
    },
    ModalRealtimePieDataRoom.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    return ModalRealtimePieDataRoom;
})();
/* PUE分析 饼图 数据机房分项能耗 end*/

/* PUE分析 折线图 室外温度趋势分析 start*/
var ModalRealtimeLineOutdoor = (function () {

    function ModalRealtimeLineOutdoor(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalRealtimeLine.call(this, screen, entityParams, renderModal, updateModal, null);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };

    ModalRealtimeLineOutdoor.prototype = new ModalRealtimeLine();
    ModalRealtimeLineOutdoor.prototype.optionTemplate = {

        name:'toolBox.modal.REAL_TIME_CHART_LINE_OUTDOOR',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimeLineOutdoor'
    },
    ModalRealtimeLineOutdoor.prototype.renderModal = function () {
        this.isFirstRender = true;
    }
    ModalRealtimeLineOutdoor.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var _this = this;
        if(!this.chart || this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < points.length; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime;
            if (!_this.m_bIsGoBackTrace) {
                endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = true;
            }
            else {
                this.m_bIsGoBackTrace = false;
                endTime = new Date(_this.m_traceData.currentTime).format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = false;
            }
            if(!this.entity.modal.option) this.entity.modal.option = {};
            if(!this.entity.modal.option.timeFormat) {this.entity.modal.option.timeFormat = 'h1'}
            if(this.entity.modal.option.timeFormat == 'm1'|| 'm5'||'h1'){
                var startTime=new Date(new Date()-86400000).format('yyyy-MM-dd HH:mm:ss');
            }else if (this.entity.modal.option.timeFormat == 'd1'){
                var startTime=new Date(new Date()-2592000000).format('yyyy-MM-dd HH:mm:ss');
            }else if (this.entity.modal.option.timeFormat == 'M1'){
                var startTime=new Date(new Date()-31536000000).format('yyyy-MM-dd HH:mm:ss');
            }
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                //dataSourceId: '',  //_this.screen.store.datasources[0].id,
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: this.entity.modal.option.timeFormat
            }).done(function (dataSrc) {
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var dsChartCog = _this.entity.modal.dsChartCog;
                var entityItem = _this.dealWithData(dataSrc,dsChartCog);
                //不同采样间隔的x轴坐标值
                function coordinate(e){
                    var arr = [];
                    var endTime = new Date().valueOf();
                    if (e == 'm1') {
                        var startTime = endTime - 21600000;//6*60*60*1000
                        var interval = 60000;//一分钟
                        while (startTime <= endTime) {
                            arr.push(new Date(startTime).format('HH:mm'));
                            startTime += interval;
                        }
                    } else if (e == 'm5'){
                        var startTime = endTime - 86100000;//减去24个小时
                        var interval = 300000;//五分钟
                        while( startTime <= endTime ) {
                        arr.push(new Date(startTime - startTime%300000).format('HH:mm'));
                        startTime += interval;
                        }
                    }else if(e == 'h1') {
                        var startTime = endTime - 82800000;//23*60*60*1000
                        var interval = 3600000;//一个小时
                        while( startTime <= endTime ) {
                        arr.push(new Date(startTime).format('HH:00'));
                        startTime += interval;
                        }
                    }else if(e == 'd1') {
                        var startTime = endTime - 2592000000;//减去一个月
                        var interval = 86400000;//一天
                        while( startTime <= endTime ) {
                            arr.push(new Date(startTime).format('yyyy-MM-dd'));
                            startTime += interval;
                        }
                    }else if(e == 'M1'){
                        var fullYear = new Date().getFullYear()-1;
                        var month = new Date().getMonth() + 1;
                        //var startTime = fullYear+ '-' + month;
                        var interval = 1;//一个月
                        for(var i=0;i<12;i++){
                            var startTime = fullYear+ '-' + month;
                            arr.push(startTime);
                            month = month%12 + interval;
                            if(month === 1){
                                fullYear +=1;
                            }
                        }
                    }
                    return arr;
                }
                var entityData = {
                    legend: {
                        data: entityItem[0]
                    },
                    xAxis:
                    //[
                    //    {
                    //        data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
                    //    }
                    //],
                        (function(type){
                            switch (type){
                                case 'm1':
                                    return [{
                                        data: coordinate('m1')
                                    }];
                                case 'm5':
                                    return [{
                                        data: coordinate('m5')
                                    }];
                                case 'h1':
                                    return [{
                                        data: coordinate('h1')
                                    }];
                                case 'd1':
                                    return [{
                                        data: coordinate('d1')
                                    }];
                                case 'M1':
                                    return [{
                                        data: coordinate('M1')
                                    }];
                            }
                        }(_this.entity.modal.option.timeFormat)),//采样间隔作为参数
                    yAxis: [{}],
                    series: entityItem[1]
                };

                _this.dsChartCog(dsChartCog, entityData);
                var cha = echarts.init(_this.container, AppConfig.chartTheme);
                cha.clear();
                _this.chart = cha.setOption($.extend(true, {}, _this.optionDefault, entityData));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        } else{
            if (!this.chart.getSeries()) return;
            var crtHour = new Date().getHours();
            if (points && points.length > 0 && this.chart.getSeries()[0].data.length < crtHour) {//seriesData[i].dsItemId
                this.chart.addData(this.dealWithAddData(points,2));
            }
            if(this.chart.getSeries()[0].data.length > 23){
                this.isFirstRender = true;
            }
        }
    },
    ModalRealtimeLineOutdoor.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    ModalRealtimeLineOutdoor.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
    };
    return ModalRealtimeLineOutdoor;
})();
/* PUE分析 折线图 室外温度趋势分析 end*/

/* PUE分析 折线图  PUE趋势 start */
var ModalRealtimeLinePUE = (function () {

    function ModalRealtimeLinePUE(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalRealtimeLine.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };

    ModalRealtimeLinePUE.prototype = new ModalRealtimeLine();

    ModalRealtimeLinePUE.prototype.optionTemplate = {

        name:'toolBox.modal.REAL_TIME_CHART_LINE_PUE',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimeLinePUE'
    };

    ModalRealtimeLinePUE.prototype.renderModal = function () {
        this.isFirstRender = true;
    }
    ModalRealtimeLinePUE.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var _this = this;
        if(!this.chart || this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < 1; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime;
            if (!_this.m_bIsGoBackTrace) {
                endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = true;
            }
            else {
                this.m_bIsGoBackTrace = false;
                endTime = new Date(_this.m_traceData.currentTime).format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = false;
            }
            var startTime = endTime.split(' ')[0] + ' 00:00:00';
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                //dataSourceId: '',  //_this.screen.store.datasources[0].id,
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1'
            }).done(function (dataSrc) {
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var dsChartCog = _this.entity.modal.dsChartCog;
                var entityItem = _this.dealWithData(dataSrc,dsChartCog.accuracy);
                var entityData = {
                    legend: {
                        data: entityItem[0]
                    },
                    xAxis: [
                        {
                            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
                        }
                    ],
                    yAxis: [{}],
                    series: entityItem[1]
                };
                _this.dsChartCog(dsChartCog, entityData);
                var cha = echarts.init(_this.container, AppConfig.chartTheme);
                cha.clear();
                _this.chart = cha.setOption($.extend(true, {}, _this.optionDefault, entityData));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        }else{
            if(!this.chart.getSeries()) return;
            var crtHour = new Date().getHours();
            if(points && points.length > 0 && this.chart.getSeries()[0].data.length < crtHour){
                this.chart.addData(this.dealWithAddData(points, 1));
            }
            if(this.chart.getSeries()[0].data.length > 23){
                this.isFirstRender = true;
            }
        }
    },
    ModalRealtimeLinePUE.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    ModalRealtimeLinePUE.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
    }
    return ModalRealtimeLinePUE;
})();
/* PUE分析 折线图  PUE趋势 end */

/*PUE分析 仪表盘 PUE实时指标 start */
var ModalRealtimeGauge = (function () {

    function ModalRealtimeGauge(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.entityOption = entityParams.modal.option;
    };
    ModalRealtimeGauge.prototype = new ModalBase();

    ModalRealtimeGauge.prototype.optionTemplate = {

        name:'toolBox.modal.REAL_TIME_CHART_GAUGE',
        parent:0,
        mode:['gauge'],
        maxNum: 1,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimeGauge'
    };

    ModalRealtimeGauge.prototype.optionDefault = {
        tooltip: {
            formatter: "{c}"
        },
        animation: true,
        animationDuration: 1000,
        animationDurationUpdate: 1000,
        series: [
            {
                name: 'PUE',
                type: 'gauge',
                splitNumber: 10,
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 8
                    }
                },
                radius:[0,'90%'],
                axisTick: {
                    show: true,
                    splitNumber: 5,
                    length: 15,
                    lineStyle: {
                        width: 1,
                        type: 'solid',
                        color:'auto'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: 'auto'
                    },
                    formatter: function (v){
                      return v.toFixed(2);
                    }
                },
                splitLine: {
                    show: true,
                    length :20,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                pointer : {
                    width : 5
                },
                detail: { formatter: '{value}' }
            }
        ]
    };

    ModalRealtimeGauge.prototype.renderModal = function () {

    },

    ModalRealtimeGauge.prototype.updateModal = function (points) {
        if(points.length < 1) return;

        var _this = this;
        var scaleList = [];
        for (var i = 0 ; i < _this.entityOption.scaleList.length; i++){
            scaleList.push(_this.entityOption.scaleList[i]);
        }
        var colorList = ['#1abc9c','#3598db','#e84c3d'];

        if(scaleList[scaleList.length-1] < scaleList[0]){
            scaleList.reverse();
            colorList = ['#e84c3d','#3598db','#1abc9c'];
        }
        this.optionDefault.series[0].max = scaleList[scaleList.length-1];
        this.optionDefault.series[0].min = scaleList[0];
        this.optionDefault.series[0].data = [{value: parseFloat(points[0].data).toFixed(2)}];

        this.optionDefault.series[0].axisLine.lineStyle.color = function(option){
            var arr = [], colorIndex =0;
            for(var i = 0; i < option.length; i++){
                if(i == 0){
                    continue;
                }
                arr.push([((option[i] - option[0])/(_this.optionDefault.series[0].max - _this.optionDefault.series[0].min)).toFixed(3),colorList[colorIndex]]);
                colorIndex ++;
            }
            return arr;
        }(scaleList);

        if(this.chart){
            this.chart.setOption(this.optionDefault)
        }else{
            this.chart = echarts.init(this.container, AppConfig.chartTheme).setOption(this.optionDefault);
        }
    },

    ModalRealtimeGauge.prototype.showConfigMode = function () {

    },

    ModalRealtimeGauge.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        this.entity.modal.option.scaleList = option.scaleList;
        this.entity.modal.interval = 5;
    };

    return ModalRealtimeGauge;
})();
/*PUE分析 仪表盘 PUE实时指标 start */

/* 横向比较 折线图 分项能耗分析 start*/
var ModalRealtimeLineEnegBrkd = (function () {

    function ModalRealtimeLineEnegBrkd(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalRealtimeLine.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };

    ModalRealtimeLineEnegBrkd.prototype = new ModalRealtimeLine();

    ModalRealtimeLineEnegBrkd.prototype.optionTemplate = {

        name:'toolBox.modal.REAL_TIME_CHART_LINE_ENERGY',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRealtimeLineEnegBrkd'
    };

    ModalRealtimeLineEnegBrkd.prototype.renderModal = function () {
        this.isFirstRender = true;
    }
    ModalRealtimeLineEnegBrkd.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var _this = this;
        if(!this.chart || this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < points.length; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime;
            if (!_this.m_bIsGoBackTrace) {
                endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = true;
            }
            else {
                this.m_bIsGoBackTrace = false;
                endTime = new Date(_this.m_traceData.currentTime).format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = false;
            }
            var startTime = endTime.split(' ')[0] + ' 00:00:00';
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                //dataSourceId: '',  //_this.screen.store.datasources[0].id,
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1'
            }).done(function (dataSrc) {
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var dsChartCog = _this.entity.modal.dsChartCog;
                var entityItem = _this.dealWithData(dataSrc,dsChartCog);
                var entityData = {
                    legend: {
                        data: entityItem[0]
                    },
                    xAxis: [
                        {
                            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
                        }
                    ],
                    yAxis: [{}],
                    series: entityItem[1]
                };
                _this.dsChartCog(dsChartCog, entityData);
                var cha = echarts.init(_this.container, AppConfig.chartTheme);
                cha.clear();
                _this.chart = cha.setOption($.extend(true, {}, _this.optionDefault, entityData));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        }else{
            if(!this.chart.getSeries()) return;
            var crtHour = new Date().getHours();
            if(points && points.length > 0 && this.chart.getSeries()[0].data.length < crtHour){
                this.chart.addData(this.dealWithAddData(points, 4));
            }
            if(this.chart.getSeries() && this.chart.getSeries()[0].data.length > 23){
                this.isFirstRender = true;
            }
        }
    },
    ModalRealtimeLineEnegBrkd.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };
    ModalRealtimeLineEnegBrkd.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
    }
    return ModalRealtimeLineEnegBrkd;
})();
/* 横向比较 折线图 分项能耗分析 end*/
function tofixed(str, accuracy){
    if(!accuracy) accuracy = 2;
    return parseFloat(str).toFixed(accuracy);
}
var ModalHistoryChart = (function () {
    function ModalHistoryChart(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        ModalChart.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
    };

    ModalHistoryChart.prototype = new ModalChart();
    ModalHistoryChart.prototype.optionTemplate = {
        name:'toolBox.modal.HIS_CHART',//'ModalHistoryChart',        parent:1,
        parent:1,
        mode:['easyHistory'],
        maxNum: 5,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalHistoryChart'
    };

    ModalHistoryChart.prototype.optionDefault = {
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: false,
            feature: {
                dataView : {show: false, readOnly: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable: false,
        dataZoom: {
            show: true
        },
        grid: (function(){//统一配置grid
            var grid = {
                    borderWidth: 0,
                    borderColor: '#eee',
                    x: 70, y: 38, x2: 30, y2: 24
                }
            if(AppConfig.isMobile){
                grid.x = 40;
            }
            return grid;
        }()),
        xAxis: [
            {
                type: 'time',
                splitLine: {show : false}
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show : false},
                splitLine: {
                    show:(function(){
                        if(AppConfig.isMobile){
                            return false;
                        }else{
                            return true;
                        }
                    }())
                },
                axisLabel : {
                    formatter: function (value){
                        if(AppConfig.isMobile && value/1000 >= 1){
                            return value/1000 + 'k';
                        }else{
                            return value;
                        }
                    }
                }
            }
        ],
        animation: true
    };

    ModalHistoryChart.prototype.renderModal = function () {
        var _this = this;

        var hourMilSec = 3600000;
        var dayMilSec = 86400000;
        var weekMilSec = 604800000 + dayMilSec;

        var startDate = new Date();
        var endDate = new Date();
        var timeType;
        if ('hour' == _this.entity.modal.option.timeType) {
            timeType = 'm5';
            startDate.setTime(endDate.getTime() - hourMilSec);
        }
        if ('day' == _this.entity.modal.option.timeType) {
            timeType = 'h1';
            startDate.setTime(endDate.getTime() - dayMilSec);
        }
        else if ('week' == _this.entity.modal.option.timeType) {
            timeType = 'd1';
            startDate.setTime(endDate.getTime() - weekMilSec);
        }
        else if ('month' == _this.entity.modal.option.timeType) {
            timeType = 'd1';
            var year = endDate.getFullYear();
            var month = endDate.getMonth();
            if (0 == month) {
                startDate.setFullYear(year - 1);
                startDate.setMonth(11);
            }
            else {
                startDate.setMonth(month - 1);
            }
        }
        else if ('year' == _this.entity.modal.option.timeType) {
            timeType = 'M1';
            startDate.setFullYear(endDate.getFullYear() - 1);
        }
        else {
            return;
        }

        var curDate, startTime, endTime;
        if (!_this.m_bIsGoBackTrace) {  // normal show history data
            startTime = startDate.format('yyyy-MM-dd HH:mm:ss');
            endTime = endDate.format('yyyy-MM-dd HH:mm:ss');
            _this.optionDefault.animation = true;
        }
        else {  // for history data trace
            curDate = _this.m_traceData.currentTime;
            _this.optionDefault.animation = false;
            if ('hour' == _this.entity.modal.option.timeType) {
                startDate.setTime(curDate.getTime() - hourMilSec);
            }
            else if ('day' == _this.entity.modal.option.timeType) {
                startDate.setTime(curDate.getTime() - dayMilSec);
            }
            else if ('week' == _this.entity.modal.option.timeType) {
                startDate.setTime(curDate.getTime() - weekMilSec);
            }
            else if ('month' == _this.entity.modal.option.timeType) {
                var year = curDate.getFullYear();
                var month = curDate.getMonth();
                if (0 == month) {
                    startDate.setFullYear(year - 1);
                    startDate.setMonth(11);
                }
                else {
                    startDate.setMonth(month - 1);
                }
            }
            else if ('year' == _this.entity.modal.option.timeType) {
                startDate.setFullYear(curDate.getFullYear() - 1);
            }
            else {
                return;
            }
            startTime = startDate.format('yyyy-MM-dd HH:mm:ss');
            endTime = curDate.format('yyyy-MM-dd HH:mm:ss');
        }
        var optPtName = _this.entity.modal.points;
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
            //dataSourceId: '',  //_this.screen.store.datasources[0].id,
            dsItemIds: optPtName,
            timeStart: startTime,
            timeEnd: endTime,
            timeFormat: timeType
        }).done(function (dataSrc) {
            if (!dataSrc || !dataSrc.list[0].data || !dataSrc.timeShaft || dataSrc.timeShaft.length <= 0) {
                return;
            }
            var option = _this.initOption(dataSrc);
            if (undefined == option || undefined == option.series[0].data || 0 == option.series[0].data.length) {
                return;
            }
            var optionTemp = {};
            $.extend(true,optionTemp,_this.optionDefault);
            if (_this.entity.modal.dsChartCog){
                if(_this.entity.modal.dsChartCog[0].upper != ''){
                    optionTemp.yAxis[0].max = Number(_this.entity.modal.dsChartCog[0].upper);
                }
                if(_this.entity.modal.dsChartCog[0].lower != ''){
                    optionTemp.yAxis[0].min = Number(_this.entity.modal.dsChartCog[0].lower);
                }
                if(_this.entity.modal.dsChartCog[0].unit != ''){
                    optionTemp.yAxis[0].name = _this.entity.modal.dsChartCog[0].unit;
                }
                if(_this.entity.modal.dsChartCog[0].accuracy != ''){
                    var n = Number(_this.entity.modal.dsChartCog[0].accuracy);
                    for (var i = 0; i < option.series.length; i++){
                        for (var j = 0; j < option.series[i].data.length; j++){
                            //option.series[i].data[j] = Math.round( option.series[i].data[j] * Math.pow(10, n) ) / Math.pow(10, n)
                            option.series[i].data[j] = Number(option.series[i].data[j].toFixed(n));
                        }
                    }
                }
                var tempMarkLine;
                for(var k = 0;k < 4; k++){
                    if (_this.entity.modal.dsChartCog[0].markLine[k].value != ''){
                        if(!option.series[0].markLine){
                            option.series[0].markLine = {
                                data:[],
                                symbol:'none',
                                itemStyle:{
                                    normal:{
                                        label: {
                                            show: false
                                        }
                                    }
                                }
                            }
                        }
                        tempMarkLine =[
                                        {
                                            name:_this.entity.modal.dsChartCog[0].markLine[k].name,
                                            value:_this.entity.modal.dsChartCog[0].markLine[k].value,
                                            xAxis: -1,
                                            yAxis:Number(_this.entity.modal.dsChartCog[0].markLine[k].value)
                                        },
                                        {
                                            //xAxis:option.series[0].data.length,
                                            xAxis:dataSrc.timeShaft.length,
                                            yAxis:Number(_this.entity.modal.dsChartCog[0].markLine[k].value)
                                        }
                                    ];
                        option.series[0].markLine.data.push(tempMarkLine);
                    }
                }
            }
            _this.chart.clear();
            _this.chart.setOption($.extend(true, {}, optionTemp, option));
        }).error(function (e) {
        }).always(function (e) {
            _this.spinner.stop();
        });
    },

    ModalHistoryChart.prototype.updateModal = function (options) {
    },

    ModalHistoryChart.prototype.showConfigMode = function () {
    },

    ModalHistoryChart.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
        this.m_bIsGoBackTrace = false;
    }

    return ModalHistoryChart;
})();


// 历史柱状图-周/月/年
var ModalHistoryChartNormal = (function () {
    var defaultParams = {
        title: '',
        option:{
            showType: 'bar',
            ptName: 'E_Sum',
            timeType: 'week'
        }
    }
    var m_color = ['#e74a37','#ff8050','#1abd9b','#3499da','#3e72ac'];
    var m_colorLen = m_color.length;

    function ModalHistoryChartNormal(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalHistoryChart.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);

        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.spinner.spin(this.container);
    };

    ModalHistoryChartNormal.prototype = new ModalHistoryChart();

    ModalHistoryChartNormal.prototype.optionTemplate = {
        name: 'toolBox.modal.HIS_CHART_ENERGY_LINE',
        parent:1,
        mode:['easyHistorySelect'],
        maxNum: 5,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalHistoryChartNormal'
    }

    ModalHistoryChartNormal.prototype.initOption = function(dataSrc){
        if (undefined == dataSrc || undefined == dataSrc.list[0].data) {
            return;
        }

        var xLen = dataSrc.timeShaft.length;
        var xAxis;
        var arrXAxis = [];
        if ('month' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen; i++) {
                arrXAxis.push(dataSrc.timeShaft[i].toDate().format("MM-dd"));
            }
        }
        else if ('week' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen; i++) {
                arrXAxis.push(dataSrc.timeShaft[i].toDate().format("yyyy-MM-dd"));
            }
        }
        else if ('day' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen; i++) {
                arrXAxis.push(dataSrc.timeShaft[i].toDate().format("MM-dd HH:00"));
            }
        }
        xAxis = [
            {
                type : 'category',
                data : arrXAxis
            }
        ]

        var dataName = this.initPointAlias(dataSrc.list);
        var arrSeries = [];
        var pointAlias,index,strArrLegend,pointNameReg;
        var i = 0;
        var showColor = '#1abd9b';
        for (var i = 0; i < dataSrc.list.length; i++) {
            if (dataSrc.list.length > 1) {  // compatible design picture
                showColor = m_color[i % m_colorLen];
            }

            //var arrData = [];
            //var hisLen = dataSrc.list[0].data[key].length;
            //var fixNum = 0;
            //for (var j=0; j<hisLen; j++) {
            //    var setVal1 = parseFloat(dataSrc.list[0].data[key][j]);
            //    if (setVal1 < 100) {
            //        fixNum = 2;
            //    }
            //    var setVal2 = setVal1.toFixed(fixNum);
            //    arrData.push(parseFloat(setVal2));
            //}

            arrSeries.push(
                {
                    name: dataName[i],
                    type: this.entity.modal.option.showType,
                    data: dataSrc.list[i].data,
                    markPoint : {
                        data : (function(){
                            if(AppConfig.isMobile){
                                return []
                            }else{
                                return [
                                    {type : 'max', name: I18n.resource.dashboard.modalHistoryChart.MAXIMUM},
                                    {type : 'min', name: I18n.resource.dashboard.modalHistoryChart.MINIMUM}
                                ]
                            }
                        }())
                    },
                    itemStyle: {
                        normal: {
                            //color: showColor,
                            barBorderRadius: [5, 5, 0, 0]
                        },
                        emphasis: {
                            //color: showColor,
                            barBorderRadius: [5, 5, 0, 0]
                        }
                    }
                }
            );
        }

        var dataOption = {
            title : {
                text: '',
                subtext: ''
            },
            legend: {
                data: dataName
            },
            dataZoom: {
                show: false
            },
            /*grid: {
                x: 70, y: 38, x2: 10, y2: 24
            },*/
            xAxis : xAxis,
            series : arrSeries
        };

        return dataOption;
    };

    ModalHistoryChartNormal.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        this.entity.modal.option.showType = option.showType;
        this.entity.modal.option.timeType = option.timeType;
    };

    return ModalHistoryChartNormal;
})();


// 历史能耗图-周/月/年
var ModalHistoryChartEnergyConsume = (function () {
    var defaultParams = {
        title: '',
        option:{
            showType: 'bar',
            ptName: 'E_Sum',
            timeType: 'week'
        }
    }
    var m_color = ['#e74a37','#ff8050','#1abd9b','#3499da','#3e72ac'];
    var m_colorLen = m_color.length;

    function ModalHistoryChartEnergyConsume(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalHistoryChart.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);


        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.spinner.spin(this.container);
    };

    ModalHistoryChartEnergyConsume.prototype = new ModalHistoryChart();

    ModalHistoryChartEnergyConsume.prototype.optionTemplate = {
        name:'toolBox.modal.HIS_CHART_ENERGY_BAR',
        parent:1,
        mode:['easyHistory'],
        maxNum: 5,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalHistoryChartEnergyConsume'
    }

    ModalHistoryChartEnergyConsume.prototype.initOption = function(dataSrc){
        if (undefined == dataSrc || undefined == dataSrc.list || undefined == dataSrc.list[0]) {
            return;
        }

        var xLen = dataSrc.timeShaft.length;
        var xAxis;
        var arrXAxis = [];
        var showColor;
        if ('week' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen -1; i++) {
                var dayNum = dataSrc.timeShaft[i].toDate().getDay();
                arrXAxis.push(i18n_resource.dataSource.WEEK[dayNum]);
            }
            showColor = '#3499da';
        }
        else if ('month' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen - 1; i++) {
                arrXAxis.push(dataSrc.timeShaft[i].toDate().format('MM-dd'));
            }
            showColor = m_color[0];
        }
        else if ('year' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen - 1; i++) {
                var monthNum = dataSrc.timeShaft[i].toDate().getMonth();
                arrXAxis.push(i18n_resource.dataSource.MONTH[monthNum]);
            }
            showColor = '#3e72ac';
        }
        else if ('day' == this.entity.modal.option.timeType) {
            for (var i=0; i<xLen - 1; i++) {
                arrXAxis.push(dataSrc.timeShaft[i].toDate().format('MM-dd HH:00'));
            }
            showColor = '#3e72ac';
        }

        xAxis = [
            {
                type : 'category',
                data : arrXAxis
            }
        ]

        var dataName = this.initPointAlias(dataSrc.list);
        var arrSeries = [];
        var i = 0;
        for (var i = 0; i < dataSrc.list.length; i++) {
            var key = dataSrc.list[i].dsItemId;
            if (dataSrc.list.length > 1) {  // compatible design picture
                showColor = m_color[i % m_colorLen];
            }

            var arrData = [];
            var hisLen = dataSrc.list[0].data.length;
            var defVal;
            var fixNum = 0;
            for (var j=1; j<hisLen; j++) {
                var preVal = dataSrc.list[0].data[j-1];
                if (0 == preVal) {
                    arrData.push(0);
                    continue;
                }
                defVal = dataSrc.list[0].data[j] - preVal;
                if (defVal < 100) {
                    fixNum = 2;
                }
                else {
                    fixNum = 0;
                }
                arrData.push(parseFloat(defVal.toFixed(fixNum)));
            }

            arrSeries.push(
                {
                    name: dataName[i],
                    type: this.entity.modal.option.showType,
                    data: arrData,
                    markPoint : {
                        data : [
                            {type : 'max', name: I18n.resource.dashboard.modalHistoryChart.MAXIMUM},
                            {type : 'min', name: I18n.resource.dashboard.modalHistoryChart.MINIMUM}
                        ]
                    },
                    itemStyle: {
                        normal: {
                            color: showColor,
                            barBorderRadius: [5, 5, 5, 5]
                        },
                        emphasis: {
                            color: showColor,
                            barBorderRadius: [5, 5, 5, 5]
                        }
                    }
                }
            );

            i++;
        }

        var dataOption = {
            title : {
                text: '',
                subtext: ''
            },
            legend: {
                show: false,
                data: dataName
            },
            dataZoom: {
                show: false
            },
            grid: {
                x: 70, y: 38, x2: 30, y2: 24
            },
            xAxis : xAxis,
            series : arrSeries
        };

        return dataOption;
    };

    ModalHistoryChartEnergyConsume.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        this.entity.modal.option.showType = 'bar';
        this.entity.modal.option.timeType = option.timeType;
    };

    return ModalHistoryChartEnergyConsume;
})();


// 历史同比折线图
var ModalHistoryChartYearOnYearLine = (function () {
    var defaultParams = {
        title: '',
        option:{
            ptName: 'E_Sum',
            timeType: 'week'
        }
    }
    var _this;

    function ModalHistoryChartYearOnYearLine(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigModal = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigModal);

        this.option = entityParams.option;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.spinner.spin(this.container);
        this.store = {};
        this.pointAlias = this.entity.modal.point?AppConfig.datasource.getDSItemById(this.entity.modal.points[0]).alias:'';
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        _this = this;
    };

    ModalHistoryChartYearOnYearLine.prototype = new ModalBase();

    ModalHistoryChartYearOnYearLine.prototype.optionTemplate = {
        name:'toolBox.modal.HIS_CHART_YEAR_LINE',
        parent:1,
        mode:['easyCompare'],
        maxNum: 1,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalHistoryChartYearOnYearLine'
    };

    ModalHistoryChartYearOnYearLine.prototype.optionDefault = {
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var tar0 = params[0];
                var tar1 = params[1];
                var pointAlias = _this.pointAlias;
                return pointAlias + ' : ' + tar0.name + '<br/>' + tar0.seriesName + ' : ' + tar0.value + '<br/>'
                     + tar1.seriesName + ' : ' + tar1.value;
            }
        },
        toolbox: {
            show: false,
            feature: {
                dataView : {show: false, readOnly: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable: false,
        dataZoom: {
            show: false
        },
        grid: {
            x: 70, y: 38, x2: 30, y2: 24
        },
        xAxis: [
            {
                type: 'time',
                splitLine: {show : false}
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show : false}
            }
        ],
        animation: true //TODO: the time is too short between rendering and updating.
    };

    ModalHistoryChartYearOnYearLine.prototype.renderModal = function () {
        var _this = this;

        var hourMilSec = 3600000;
        var dayMilSec = 86400000;
        var weekMilSec = 604800000;

        var startDate = new Date();
        var endDate = new Date();
        var tmFlag = new Date();
        var timeType;
        if ('hour' == _this.entity.modal.option.timeType) {
            timeType = 'm5';
            startDate.setTime(endDate.getTime() - hourMilSec);
            startDate.setMinutes(0);
            startDate.setSeconds(0);

            tmFlag.setTime(endDate.getTime());
            tmFlag.setMinutes(0);
            tmFlag.setSeconds(0);
            tmFlag.setMilliseconds(0);
        }
        if ('day' == _this.entity.modal.option.timeType) {
            timeType = 'h1';
            startDate.setTime(endDate.getTime() - dayMilSec);
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);

            tmFlag.setTime(endDate.getTime());
            tmFlag.setHours(0);
            tmFlag.setMinutes(0);
            tmFlag.setSeconds(0);
            tmFlag.setMilliseconds(0);
        }
        else {
            return;
        }

        var curDate, startTime, endTime;
        if (!_this.m_bIsGoBackTrace) {  // normal show history data
            startTime = startDate.format('yyyy-MM-dd HH:mm:ss');
            endTime = endDate.format('yyyy-MM-dd HH:mm:ss');
            _this.optionDefault.animation = true;
        }
        else {  // for history data trace
            curDate = _this.m_traceData.currentTime;
            _this.optionDefault.animation = false;
            if ('hour' == _this.entity.modal.option.timeType) {
                timeType = 'm5';
                startDate.setTime(curDate.getTime() - hourMilSec);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                tmFlag.setTime(curDate.getTime());
                tmFlag.setMinutes(0);
                tmFlag.setSeconds(0);
                tmFlag.setMilliseconds(0);
            }
            else if ('day' == _this.entity.modal.option.timeType) {
                timeType = 'h1';
                startDate.setTime(curDate.getTime() - dayMilSec);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                tmFlag.setTime(curDate.getTime());
                tmFlag.setHours(0);
                tmFlag.setMinutes(0);
                tmFlag.setSeconds(0);
                tmFlag.setMilliseconds(0);
            }
            else {
                return;
            }
            startTime = startDate.format('yyyy-MM-dd HH:mm:ss');
            endTime = curDate.format('yyyy-MM-dd HH:mm:ss');
        }

        var optPtName = _this.entity.modal.points;
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
            //dataSourceId: '',  //_this.screen.store.datasources[0].id,
            dsItemIds: optPtName,
            timeStart: startTime,
            timeEnd: endTime,
            timeFormat: timeType
        }).done(function (dataSrc) {
            if (!dataSrc || !dataSrc.list[0].data || !dataSrc.timeShaft || dataSrc.timeShaft.length <= 0) {
                return;
            }
            var arrXAxis = [];
            var flagCount = 0;
            var len = dataSrc.timeShaft.length;
            tmFlag = tmFlag.format('yyyy-MM-dd HH:mm:ss');
            for (flagCount = 0; flagCount < len; flagCount++) {
                if (dataSrc.timeShaft[flagCount] >= tmFlag) {
                    break;
                }
            }
            _this.store.timeShaft = dataSrc.timeShaft.slice(0, flagCount);
            _this.store.deadline = dataSrc.timeShaft[flagCount - 1].toDate().valueOf();

            var fixNum = 0;
            var setVal;
            var dataName = [];
            var arrSeries = [];

            for (var k = 0, lenK = Math.min(flagCount, dataSrc.timeShaft.length); k < lenK; k++) {
                arrXAxis.push(dataSrc.timeShaft[k].toDate().format("HH:mm"));
            }

            var currentCount = 0;
            for (var n = 0; n < dataSrc.list.length; n++) {
                var key = dataSrc.list[n].dsItemId;
                var dataSrc1 = [];
                var dataSrc2 = [];
                var eachName = [];

                if (1 == dataSrc.list.length) {
                    dataName.push(I18n.resource.dataSource.TIME_YESTERDAY);
                    dataName.push(I18n.resource.dataSource.TIME_TODAY);
                    eachName.push(I18n.resource.dataSource.TIME_YESTERDAY);
                    eachName.push(I18n.resource.dataSource.TIME_TODAY);
                }
                else {
                    dataName.push(key + '_' + I18n.resource.dataSource.TIME_YESTERDAY);
                    dataName.push(key + '_' + I18n.resource.dataSource.TIME_TODAY);
                    eachName.push(key + '_' + I18n.resource.dataSource.TIME_YESTERDAY);
                    eachName.push(key + '_' + I18n.resource.dataSource.TIME_TODAY);
                }

                for (var j = 0, len = dataSrc.list[n].data.length; j < len; j++) {
                    setVal = dataSrc.list[n].data[j];
                    if (setVal < 100) {
                        fixNum = 2;
                    }
                    else {
                        fixNum = 0;
                    }
                    setVal = parseFloat(setVal.toFixed(fixNum));

                    if (j < flagCount) {
                        dataSrc1.push(setVal);
                    }
                    else {
                        dataSrc2.push(setVal);
                    }
                }

                var showColor;
                var showData;
                var showMark;
                for (var i = 0; i < 2; i++) {
                    if (0 == i) {
                        if (0 == currentCount) {
                            showColor = '#1abd9b';
                        }
                        else {
                            showColor = echarts.config.color[currentCount * 2];
                        }
                        showData = dataSrc1;
                        showMark = {
                            data : [
                                {type : 'max', name: I18n.resource.dashboard.modalHistoryChart.MAXIMUM},
                                {type : 'min', name: I18n.resource.dashboard.modalHistoryChart.MINIMUM}
                            ]
                        }
                    }
                    else if (1 == i) {
                        if (0 == currentCount) {
                            showColor = '#e74a37';
                        }
                        else {
                            showColor = echarts.config.color[currentCount * 2 + 1];
                        }
                        showData = dataSrc2;
                        var lastCntX = dataSrc2.length - 1;
                        var lastCntY = Number(dataSrc2[lastCntX]);
                        showMark = {
                            symbol : 'emptyCircle',
                            symbolSize : 10,
                            effect : {
                                show : true,
                                shadowBlur : 0
                            },
                            itemStyle : {
                                normal : {
                                    label : {
                                        show:false
                                    }
                                },
                                emphasis : {
                                    label : {
                                        position : 'top'
                                    }
                                }
                            },
                            data : [
                                {name : '', value : lastCntY, xAxis: lastCntX, yAxis: lastCntY}
                            ]
                        }
                    }

                    arrSeries.push(
                        {
                            name: eachName[i],
                            type: 'line',
                            data: showData,
                            markPoint : showMark,
                            itemStyle: {
                                normal: {
                                    color: showColor,
                                    barBorderRadius: [5, 5, 0, 0]
                                },
                                emphasis: {
                                    color: showColor,
                                    barBorderRadius: [5, 5, 0, 0]
                                }
                            },
                            symbolSize: 3
                        }
                    );
                    showColor = '';
                }
                currentCount++;
            }

            var xAxis = [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : arrXAxis
                }
            ]

            var option = {
                title : {
                    text: '',
                    subtext: ''
                },
                dataZoom: {
                    show: false
                },
                legend: {
                    data: dataName
                },
                xAxis : xAxis,
                series : arrSeries
            };
            var optionTemp = {};
            //_this.pointAlias = AppConfig.datasource.getDSItemById(_this.entity.modal.points[0]).alias;
            $.extend(true,optionTemp,_this.optionDefault);
            if (_this.entity.modal.dsChartCog){
                if(_this.entity.modal.dsChartCog[0].upper != ''){
                    optionTemp.yAxis[0].max = Number(_this.entity.modal.dsChartCog[0].upper);
                }
                if(_this.entity.modal.dsChartCog[0].lower != ''){
                    optionTemp.yAxis[0].min = Number(_this.entity.modal.dsChartCog[0].lower);
                }
                if(_this.entity.modal.dsChartCog[0].unit != ''){
                    optionTemp.yAxis[0].name = _this.entity.modal.dsChartCog[0].unit;
                }
                if(_this.entity.modal.dsChartCog[0].accuracy != ''){
                    var n = Number(_this.entity.modal.dsChartCog[0].accuracy);
                    for (var i = 0; i < option.series.length; i++){
                        for (var j = 0; j < option.series[i].data.length; j++){
                            //option.series[i].data[j] = Math.round( option.series[i].data[j] * Math.pow(10, n) ) / Math.pow(10, n)
                            option.series[i].data[j] = option.series[i].data[j].toFixed(n);
                        }
                    }
                }
                var tempMarkLine;
                for(var k = 0;k < 4; k++){
                    if (_this.entity.modal.dsChartCog[0].markLine[k].value != ''){
                        if(!option.series[0].markLine){
                            option.series[0].markLine = {
                                data:[],
                                symbol: 'none',
                                itemStyle:{
                                    normal:{
                                        label: {
                                            show: false
                                        }
                                    }
                                }
                            }
                        }
                        tempMarkLine =[
                                        {
                                            name:_this.entity.modal.dsChartCog[0].markLine[k].name,
                                            value:_this.entity.modal.dsChartCog[0].markLine[k].value,
                                            xAxis: -1,
                                            yAxis:Number(_this.entity.modal.dsChartCog[0].markLine[k].value)
                                        },
                                        {
                                            //xAxis:option.series[0].data.length,
                                            xAxis:dataSrc.timeShaft.length,
                                            yAxis:Number(_this.entity.modal.dsChartCog[0].markLine[k].value)
                                        }
                                    ];
                        option.series[0].markLine.data.push(tempMarkLine);
                    }
                }
            }
            _this.chart.clear();
            _this.chart.setOption($.extend(true, {}, optionTemp, option));
        }).error(function (e) {

        }).always(function (e) {
            _this.spinner.stop();
        });
    },

    ModalHistoryChartYearOnYearLine.prototype.updateModal = function (options) {
        var _this = this;
        var modalOptions = this.entity.modal.option;
        var lastIndex, lastTick, nowTick;
        if (undefined === options || options.length < 1 || undefined === options[0]) {
            return;
        }
        lastIndex = this.chart.getSeries()[1].data.length - 1;
        lastTick = this.store.timeShaft[lastIndex].toDate().valueOf();
        nowTick = new Date().valueOf();

        // 达到时间上限时不再更新
        if (lastTick === undefined) return;
        // 新增刷新间隔需求
        if ('hour' === modalOptions.timeType) {
            // 因为当前的lastTick是上一时间段的，需要转变成现有时间段
            lastTick += 3600000; //60*60*1000
            refreshInterval = 300000; // 5*60*1000
        }
        if ('day' === modalOptions.timeType) {
            lastTick += 86400000; // 24*60*60*1000
            refreshInterval = 3600000; // 60*60*1000
        }
        else {
            return;
        }

        // 未到刷新时间，则不做任何处理
        if( nowTick < lastTick + refreshInterval) return;

        var addParam = [];
        for (var i = 0, len = options.length; i < len; i++) {
            if (options[i].data !== null) {
                addParam.push([
                    1,
                    options[i].data,
                    false,
                    true
                ]);
            }
        }
        _this.chart.addData(addParam);
        // markPoint
        _this.chart.delMarkPoint(1, '');

        var dataSeries = _this.chart.getOption().series;
        if (dataSeries.length < 2) {
            return;
        }

        var temp = dataSeries[1].data;
        var lastCntX = temp.length - 1;
        var lastCntY = Number(temp[lastCntX]);

        var showMark = {
            symbol : 'emptyCircle',
            symbolSize : 10,
            effect : {
                show : true,
                shadowBlur : 0
            },
            itemStyle : {
                normal : {
                    label : {
                        show:false
                    }
                },
                emphasis : {
                    label : {
                        position : 'top'
                    }
                }
            },
            data : [
                {name : '', value : lastCntY, xAxis: lastCntX, yAxis: lastCntY}
            ]
        }
        _this.chart.addMarkPoint(1, showMark);
    },

    ModalHistoryChartYearOnYearLine.prototype.showConfigMode = function () {

    },

    ModalHistoryChartYearOnYearLine.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        this.entity.modal.option.showType = 'line';
        this.entity.modal.option.timeType = option.timeType;
    };

    ModalHistoryChartYearOnYearLine.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
        this.m_bIsGoBackTrace = false;
    };

    return ModalHistoryChartYearOnYearLine;
})();


// 历史同比柱状图
var ModalHistoryChartYearOnYearBar = (function () {
    var defaultParams = {
        title: '',
        option:{
            ptName: 'E_Sum',
            timeType: 'day'
        }
    }
    var m_color = ['#e74a37','#ff8050','#1abd9b','#3499da','#3e72ac'];

    function ModalHistoryChartYearOnYearBar(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigModal = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigModal);

        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
        this.option = entityParams.option;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.spinner.spin(this.container);
    };

    ModalHistoryChartYearOnYearBar.prototype = new ModalBase();

    ModalHistoryChartYearOnYearBar.prototype.optionTemplate = {
        name: 'toolBox.modal.HIS_CHART_YEAR_BAR',
        parent:1,
        mode:['easyCompare'],
        maxNum: 1,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalHistoryChartYearOnYearBar'
    };

    ModalHistoryChartYearOnYearBar.prototype.optionDefault = {
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: false,
            feature: {
                dataView : {show: false, readOnly: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable: false,
        dataZoom: {
            show: false
        },
        grid: {
            x: 70, y: 38, x2: 30, y2: 24
        },
        xAxis: [
            {
                type: 'category',
                splitLine: {show : false}
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show : false}
            }
        ],
        animation: true
    };

    ModalHistoryChartYearOnYearBar.prototype.renderModal = function () {
        var _this = this;

        var hourMilSec = 3600000;
        var dayMilSec = 86400000;
        var weekMilSec = 604800000;

        var startDate = new Date();
        var endDate = new Date();
        var startDateZero = new Date();
        var endDateZero = new Date();
        var timeType;
        if ('day' == _this.entity.modal.option.timeType) {
            timeType = 'h1';
            startDate.setTime(endDate.getTime() - dayMilSec);

            startDateZero.setTime(startDate.getTime());
            startDateZero.setHours(0);
            startDateZero.setMinutes(0);
            startDateZero.setSeconds(0);

            endDateZero.setTime(endDate.getTime());
            endDateZero.setHours(0);
            endDateZero.setMinutes(0);
            endDateZero.setSeconds(0);
        }
        else {
            return;
        }

        var optPtName = _this.entity.modal.points;
        if (optPtName.length > 1) {
            return;
        }

        var curDate, startTime, endTime;
        if (!_this.m_bIsGoBackTrace) {  // normal show history data
            startTime = startDate.format('yyyy-MM-dd HH:mm:ss');
            endTime = endDate.format('yyyy-MM-dd HH:mm:ss');
            _this.optionDefault.animation = true;
        }
        else {  // for history data trace
            curDate = _this.m_traceData.currentTime;
            _this.optionDefault.animation = false;
            if ('day' == _this.entity.modal.option.timeType) {
                timeType = 'h1';
                startDate.setTime(curDate.getTime() - dayMilSec);

                startDateZero.setTime(startDate.getTime());
                startDateZero.setHours(0);
                startDateZero.setMinutes(0);
                startDateZero.setSeconds(0);

                endDateZero.setTime(curDate.getTime());
                endDateZero.setHours(0);
                endDateZero.setMinutes(0);
                endDateZero.setSeconds(0);
            }
            else {
                return;
            }
            startTime = startDate.format('yyyy-MM-dd HH:mm:ss');
            endTime = curDate.format('yyyy-MM-dd HH:mm:ss');
        }

        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
            //dataSourceId: '',  //_this.screen.store.datasources[0].id,
            dsItemIds: optPtName,
            timeStart: startDateZero.format('yyyy-MM-dd HH:mm:ss'),
            timeEnd: endDate.format('yyyy-MM-dd HH:mm:ss'),
            timeFormat: timeType
        }).done(function (dataSrc) {
            if (!dataSrc || !dataSrc.list[0].data || !dataSrc.timeShaft || dataSrc.timeShaft.length <= 0) {
                return;
            }

            var flag1, flag2;
            var len = dataSrc.timeShaft.length;
            for (var i = 0; i < len; i++) {
                if (dataSrc.timeShaft[i].toDate() >= startDate) {
                    flag1 = i;
                    break;
                }
            }
            for (var i = 0; i < len; i++) {
                if (dataSrc.timeShaft[i].toDate() >= endDateZero) {
                    flag2 = i;
                    break;
                }
            }
            var arrVal1 = [];
            var arrVal2 = [];
            var val1 = 0;
            var val2 = 0;
            var fixNum1 = 0;
            var fixNum2 = 0;
            var preVal = 0;
            for (var i = 0; i < dataSrc.list.length; i++) {
                var key = dataSrc.list[i].dsItemId;
                for (var j = 0, len = dataSrc.list[i].data.length; j < len; j++) {
                    if (j == flag1) {
                        preVal = dataSrc.list[i].data[0];
                        if (0 == preVal) {
                            val1 = 0;
                        }
                        else {
                            val1 = dataSrc.list[i].data[j] - preVal;
                        }
                    }
                    else if (j == flag2) {
                        preVal = dataSrc.list[i].data[j];
                        if (0 == preVal) {
                            val2 = 0;
                        }
                        else {
                            val2 = dataSrc.list[i].data[len-1] - preVal;
                        }
                    }
                }
                if (val1 < 100) {
                    fixNum1 = 2;
                }
                else {
                    fixNum1 = 0;
                }
                if (val2 < 100) {
                    fixNum2 = 2;
                }
                else {
                    fixNum2 = 0;
                }
                arrVal1.push(parseFloat(val1.toFixed(fixNum1)));
                arrVal2.push(parseFloat(val2.toFixed(fixNum2)));
                break;
            }
            var tmFlag = new Date();
            var arrXAxis = [];
            tmFlag = tmFlag.format('yyyy-MM-dd HH:mm:ss');
            for (flagCount = 0; flagCount < len; flagCount++) {
                if (dataSrc.timeShaft[flagCount] >= tmFlag) {
                    break;
                }
            }


            for (var k = 0, lenK = Math.min(flagCount, dataSrc.timeShaft.length); k < lenK; k++) {
                arrXAxis.push(dataSrc.timeShaft[k].toDate().format("HH:mm"));
            }
            var xAxis = [
                {
                    type : 'category',
                    boundaryGap : true,
                    data : arrXAxis
                }
            ];

            var dataName = [];
            dataName.push(I18n.resource.dataSource.TIME_YESTERDAY);
            dataName.push(I18n.resource.dataSource.TIME_TODAY);

            var arrSeries = [
                {
                    name: dataName[0],
                    type: 'bar',
                    data: arrVal1,
                    itemStyle: {
                        normal: {
                            color: m_color[2],
                            barBorderRadius: [5, 5, 0, 0]
                        },
                        emphasis: {
                            color: m_color[2],
                            barBorderRadius: [5, 5, 0, 0]
                        }
                    },
                    markPoint : {
                        data : [
                            {type : 'max', name: I18n.resource.dashboard.modalHistoryChart.EnergyConsumption}
                        ]
                    }
                },
                {
                    name: dataName[1],
                    type: 'bar',
                    data: arrVal2,
                    itemStyle: {
                        normal: {
                            color: m_color[1],
                            barBorderRadius: [5, 5, 0, 0]
                        },
                        emphasis: {
                            color: m_color[1],
                            barBorderRadius: [5, 5, 0, 0]
                        }
                    },
                    markPoint : {
                        data : [
                            {type : 'max', name: I18n.resource.dashboard.modalHistoryChart.EnergyConsumption}
                        ]
                    }
                },
            ];

            var option = {
                title : {
                    text: '',
                    subtext: ''
                },
                dataZoom: {
                    show: false
                },
                legend: {
                    data: dataName
                },
                xAxis : xAxis,
                series : arrSeries
            };
            var optionTemp = {};
            $.extend(true,optionTemp,_this.optionDefault);
            if (_this.entity.modal.dsChartCog){
                if(_this.entity.modal.dsChartCog[0].upper != ''){
                    optionTemp.yAxis[0].max = Number(_this.entity.modal.dsChartCog[0].upper);
                }
                if(_this.entity.modal.dsChartCog[0].lower != ''){
                    optionTemp.yAxis[0].min = Number(_this.entity.modal.dsChartCog[0].lower);
                }
                if(_this.entity.modal.dsChartCog[0].unit != ''){
                    optionTemp.yAxis[0].name = _this.entity.modal.dsChartCog[0].unit;
                }
                if(_this.entity.modal.dsChartCog[0].accuracy != ''){
                    var n = Number(_this.entity.modal.dsChartCog[0].accuracy);
                    for (var i = 0; i < option.series.length; i++){
                        for (var j = 0; j < option.series[i].data.length; j++){
                            //option.series[i].data[j] = Math.round( option.series[i].data[j] * Math.pow(10, n) ) / Math.pow(10, n)
                            option.series[i].data[j] = option.series[i].data[j].toFixed(n);
                        }
                    }
                }
                var tempMarkLine;
                for(var k = 0;k < 4; k++){
                    if (_this.entity.modal.dsChartCog[0].markLine[k].value != ''){
                        if(!option.series[0].markLine){
                            option.series[0].markLine = {
                                data:[],
                                symbol:'none',
                                itemStyle:{
                                    normal:{
                                        label: {
                                            show: false
                                        }
                                    }
                                }
                            }
                        }
                        tempMarkLine =[
                                        {
                                            name:_this.entity.modal.dsChartCog[0].markLine[k].name,
                                            value:_this.entity.modal.dsChartCog[0].markLine[k].value,
                                            xAxis: -1,
                                            yAxis:Number(_this.entity.modal.dsChartCog[0].markLine[k].value)
                                        },
                                        {
                                            //xAxis:option.series[0].data.length,
                                            xAxis:dataSrc.timeShaft.length,
                                            yAxis:Number(_this.entity.modal.dsChartCog[0].markLine[k].value)
                                        }
                                    ];
                        option.series[0].markLine.data.push(tempMarkLine);
                    }
                }
            }
            _this.chart.clear();
            _this.chart.setOption($.extend(true, {}, optionTemp, option));
        }).error(function (e) {
        }).always(function (e) {
            _this.spinner.stop();
        });
    },

    ModalHistoryChartYearOnYearBar.prototype.updateModal = function (options) {

    },

    ModalHistoryChartYearOnYearBar.prototype.showConfigMode = function () {

    },

    ModalHistoryChartYearOnYearBar.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        this.entity.modal.option.showType = 'bar';
        this.entity.modal.option.timeType = option.timeType;
    };

    ModalHistoryChart.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
        this.m_bIsGoBackTrace = false;
    };

    return ModalHistoryChartYearOnYearBar;
})();
﻿/// <reference path="../../lib/jquery-2.1.4.min.js" />
var ModalCarbonFootprint = (function () {
    function ModalCarbonFootprint(containerId, entityParams) {
        ModalBase.call(this, containerId, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
        this.isFirstTime = true;
        this.widthRuler = undefined;
        this.$elMask = undefined;
        this.elPaneValue = undefined;
        this.elPaneTitle = undefined;
        this.maxValue = undefined;
    };

    ModalCarbonFootprint.prototype = new ModalBase();
    ModalCarbonFootprint.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_CARBON_FOOTPRINT',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 1,
        title:'',
        minHeight:3,
        minWidth:4,
        maxHeight:6,
        maxWidth:12,
        type:'ModalCarbonFootprint'
    };


    ModalCarbonFootprint.prototype.renderModal = function () {
        if (this.isFirstTime) this.init();
    },

    ModalCarbonFootprint.prototype.init = function () {
        var _this = this;
        WebAPI.get('/static/scripts/spring/entities/modalCarbonFootprint.html').done(function (resultHTML) {
            _this.container.innerHTML = resultHTML;
            _this.initStandard();
            _this.isFirstTime = false;
            I18n.fillArea($('.divCFTitle').parent());
        });
    },

    ModalCarbonFootprint.prototype.initStandard = function () {
        $divMain = $(this.container);
        this.widthRuler = $divMain.find('.cfProcessScale').width();
        this.$elMask = $divMain.find('.cfProcessMask');
        this.elPaneValue = document.getElementById('cfFootprintDashboardCurrent');
        this.elPaneTitle = document.getElementById('divCFTitle');

        var unitValue = this.entity.modal.option.valueStandard / 4;
        this.maxValue = unitValue * 5;

        //init scale numbers of ruler
        var tdScaleNums = this.container.getElementsByClassName('cfProcessScaleNum');
        for (var i = 0, len = tdScaleNums.length; i < len; i++) {
            tdScaleNums[i].textContent = parseInt(unitValue * i).toString();
        }

        //init warning field
        $divMain.find('.cfLegendBarWarning').animate({ width: this.widthRuler * 0.2 + 'px' }, 1000);
        document.getElementById('cfFootprintDashboardStandard').textContent = this.entity.modal.option.valueStandard;
    },

    ModalCarbonFootprint.prototype.updateModal = function (points) {
        var value = parseFloat(points[0].data).toFixed(1).toString();
        this.elPaneValue.textContent = value;
        this.elPaneTitle.textContent = value;
        this.$elMask.animate({ width: this.widthRuler - value * this.widthRuler / this.maxValue + 'px' }, 1000);
    },

    ModalCarbonFootprint.prototype.showConfigMode = function () {
    };

    ModalCarbonFootprint.prototype.setModalOption = function (option) {
        this.entity.modal.option = {};
        //TODO
        this.entity.modal.option.valueStandard = 3500;
    };

    return ModalCarbonFootprint;
})();
/**
 * Created by vicky on 2015/3/3.
 */
var ModalWeather = (function () {
    function ModalWeather(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if(!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalBase.call(this, screen, entityParams, renderModal, updateModal, showConfigMode);
    };

    ModalWeather.prototype = new ModalBase();
    ModalWeather.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_WEATHER',
        parent:0,
        mode:['weather'],
        maxNum: 0,
        title:'',
        minHeight:2,
        minWidth:4,
        maxHeight:6,
        maxWidth:12,
        type:'ModalWeather'
    };
    /* weather logos start */
    //<!-- 1阴天 start -->
    var yin = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                <g>\
                    <path fill="#009FE3" d="M75.291,34.467C70.5,26.344,61.767,21.32,52.311,21.32c-12.728,0-23.524,8.832-26.105,21.158  c-6.569,2.188-11.324,8.382-11.324,15.676c0,9.111,7.414,16.525,16.526,16.525c3.289,0,6.415-0.945,9.119-2.745  c3.647,1.8,7.688,2.745,11.785,2.745c4.251,0,8.451-1.029,12.205-2.966c3.149,1.939,6.733,2.966,10.492,2.966  c11.089,0,20.11-9.021,20.11-20.109C95.118,43.577,86.249,34.621,75.291,34.467z M75.007,69.104c-3.247,0-6.315-1.046-8.877-3.023  c-1.219-0.941-2.969-0.716-3.91,0.503c-0.018,0.021-0.027,0.047-0.045,0.07c-3.019,1.6-6.42,2.45-9.865,2.45  c-3.653,0-7.255-0.947-10.41-2.74c-0.795-0.451-1.713-0.461-2.488-0.123c-0.447,0.072-0.883,0.245-1.263,0.542  c-1.94,1.519-4.271,2.32-6.744,2.32c-6.038,0-10.95-4.911-10.95-10.949s4.912-10.951,10.95-10.951c3.048,0,5.979,1.285,8.048,3.521  c1.044,1.132,2.809,1.201,3.938,0.157c1.131-1.045,1.202-2.809,0.157-3.938c-2.941-3.187-7.042-5.088-11.354-5.296  C34.91,32.951,42.94,26.893,52.31,26.893c6.688,0,12.931,3.178,16.885,8.443c-2.639,0.797-5.108,2.118-7.232,3.93  c-1.171,0.999-1.311,2.761-0.313,3.932c1,1.172,2.762,1.31,3.932,0.31c2.624-2.239,5.973-3.472,9.428-3.472  c8.014,0,14.535,6.52,14.535,14.534C89.542,62.584,83.021,69.104,75.007,69.104z"/>\
                </g>\
                </svg>';
    //<!-- 1阴天 end -->

    //<!-- 2大雨 start -->
    var dayu = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                <g>\
                    <path fill="#009FE3" d="M75.293,23.69c-4.791-8.123-13.525-13.147-22.981-13.147c-12.726,0-23.525,8.832-26.107,21.159   c-6.568,2.188-11.323,8.381-11.323,15.675c0,9.112,7.414,16.526,16.525,16.526c3.289,0,6.415-0.945,9.119-2.744   c3.648,1.797,7.689,2.744,11.786,2.744c4.25,0,8.452-1.029,12.206-2.966c3.149,1.938,6.732,2.966,10.492,2.966   c11.088,0,20.108-9.021,20.108-20.11C95.118,32.798,86.251,23.841,75.293,23.69z M75.01,58.326c-3.246,0-6.315-1.045-8.877-3.023   c-1.22-0.941-2.971-0.717-3.91,0.503c-0.019,0.021-0.027,0.047-0.043,0.069c-3.021,1.601-6.422,2.451-9.867,2.451   c-3.656,0-7.256-0.947-10.411-2.74c-0.794-0.453-1.713-0.461-2.491-0.123c-0.444,0.074-0.879,0.244-1.26,0.543   c-1.938,1.52-4.271,2.32-6.743,2.32c-6.038,0-10.951-4.912-10.951-10.95c0-6.038,4.913-10.951,10.951-10.951   c3.045,0,5.979,1.285,8.047,3.523c1.047,1.131,2.81,1.202,3.939,0.156c1.131-1.045,1.201-2.81,0.156-3.938   c-2.942-3.185-7.043-5.086-11.354-5.294c2.718-8.697,10.748-14.755,20.117-14.755c6.69,0,12.929,3.177,16.885,8.443   c-2.64,0.797-5.109,2.118-7.233,3.93c-1.17,0.999-1.311,2.76-0.312,3.931c0.999,1.172,2.759,1.311,3.931,0.311   c2.624-2.239,5.973-3.472,9.43-3.472c8.014,0,14.533,6.52,14.533,14.534C89.544,51.806,83.023,58.326,75.01,58.326z"/>\
                    <path fill="#009FE3" d="M44.751,79.875c0,3.084-2.5,5.582-5.583,5.582s-5.583-2.498-5.583-5.582s5.583-11.408,5.583-11.408   S44.751,76.791,44.751,79.875z"/>\
                    <path fill="#009FE3" d="M59.557,79.875c0,3.084-2.5,5.582-5.582,5.582c-3.084,0-5.583-2.498-5.583-5.582s5.583-11.408,5.583-11.408   S59.557,76.791,59.557,79.875z"/>\
                    <path fill="#009FE3" d="M74.362,79.875c0,3.084-2.499,5.582-5.583,5.582c-3.083,0-5.583-2.498-5.583-5.582   s5.583-11.408,5.583-11.408S74.362,76.791,74.362,79.875z"/>\
                </g>\
                </svg>';
    //<!-- 2大雨 end -->

    //<!-- 3暴雨 start -->
    var baoyu = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                <g>\
                    <path fill="#009FE3" d="M75.292,23.756c-4.791-8.123-13.524-13.146-22.98-13.146c-12.729,0-23.527,8.832-26.107,21.159   c-6.569,2.187-11.324,8.381-11.324,15.675c0,9.112,7.414,16.526,16.526,16.526c3.29,0,6.416-0.946,9.118-2.745   c3.648,1.799,7.69,2.745,11.787,2.745c4.25,0,8.452-1.03,12.206-2.967c3.148,1.939,6.731,2.967,10.492,2.967   c11.088,0,20.109-9.021,20.109-20.11C95.119,32.865,86.25,23.909,75.292,23.756z M75.008,58.394c-3.246,0-6.316-1.046-8.878-3.024   c-1.219-0.94-2.969-0.716-3.909,0.503c-0.019,0.021-0.027,0.047-0.045,0.07c-3.02,1.6-6.421,2.451-9.865,2.451   c-3.655,0-7.256-0.948-10.412-2.741c-0.795-0.451-1.713-0.461-2.49-0.122c-0.445,0.074-0.881,0.244-1.261,0.542   c-1.94,1.519-4.271,2.321-6.743,2.321c-6.038,0-10.951-4.912-10.951-10.95s4.913-10.951,10.951-10.951   c3.046,0,5.979,1.285,8.047,3.522c1.044,1.132,2.808,1.2,3.938,0.156c1.132-1.045,1.202-2.809,0.157-3.938   c-2.94-3.187-7.042-5.087-11.354-5.295c2.717-8.697,10.748-14.755,20.118-14.755c6.688,0,12.928,3.177,16.884,8.442   c-2.641,0.797-5.11,2.118-7.234,3.931c-1.171,0.999-1.31,2.76-0.313,3.931c1,1.172,2.762,1.31,3.932,0.31   c2.623-2.238,5.973-3.472,9.428-3.472c8.016,0,14.535,6.521,14.535,14.534C89.543,51.872,83.021,58.394,75.008,58.394z"/>\
                    <path fill="#009FE3" d="M30.448,85.391c-0.531,0-1.067-0.149-1.543-0.47c-1.281-0.854-1.628-2.584-0.773-3.864l9.026-13.539   c0.854-1.28,2.584-1.629,3.865-0.772c1.281,0.854,1.627,2.584,0.773,3.865L32.77,84.151C32.232,84.955,31.348,85.391,30.448,85.391   z"/>\
                    <path fill="#009FE3" d="M45.313,85.391c-0.53,0-1.067-0.149-1.543-0.47c-1.281-0.854-1.627-2.584-0.772-3.864l9.026-13.539   c0.854-1.28,2.585-1.629,3.865-0.772c1.281,0.854,1.627,2.584,0.773,3.865l-9.026,13.541   C47.099,84.955,46.214,85.391,45.313,85.391z"/>\
                    <path fill="#009FE3" d="M60.182,85.391c-0.53,0-1.067-0.149-1.543-0.47c-1.283-0.854-1.627-2.584-0.772-3.864l9.024-13.539   c0.854-1.28,2.586-1.629,3.867-0.772c1.279,0.854,1.627,2.584,0.772,3.865l-9.027,13.541   C61.967,84.955,61.083,85.391,60.182,85.391z"/>\
                </g>\
                </svg>';
    //<!-- 3暴雨 end -->

    //<!-- 4多云 start -->
    var duoyun = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                    <g>\
                        <g>\
                            <path fill="#009FE3" d="M59.271,34.332c-4.592-8.123-12.961-13.146-22.021-13.146c-12.197,0-22.546,8.832-25.019,21.159    C5.936,44.531,1.379,50.726,1.379,58.02c0,9.111,7.104,16.525,15.836,16.525c3.152,0,6.148-0.945,8.739-2.745    c3.495,1.8,7.368,2.745,11.295,2.745c4.074,0,8.098-1.029,11.696-2.966c3.017,1.939,6.451,2.966,10.053,2.966    c10.627,0,19.271-9.021,19.271-20.109C78.271,43.441,69.772,34.485,59.271,34.332z M58.998,68.97    c-3.109,0-6.051-1.047-8.506-3.024c-1.168-0.94-2.845-0.715-3.747,0.503c-0.017,0.021-0.025,0.047-0.042,0.07    c-2.893,1.601-6.153,2.452-9.453,2.452c-3.504,0-6.953-0.948-9.977-2.741c-0.759-0.45-1.639-0.46-2.384-0.123    c-0.428,0.074-0.846,0.244-1.211,0.542c-1.86,1.519-4.096,2.321-6.463,2.321c-5.787,0-10.494-4.912-10.494-10.95    s4.707-10.951,10.494-10.951c2.92,0,5.729,1.285,7.711,3.521c1.003,1.134,2.692,1.202,3.775,0.157    c1.084-1.045,1.15-2.809,0.147-3.938c-2.817-3.187-6.749-5.087-10.88-5.295c2.604-8.697,10.3-14.755,19.277-14.755    c6.411,0,12.39,3.177,16.181,8.442c-2.528,0.797-4.897,2.118-6.934,3.93c-1.121,0.999-1.254,2.761-0.296,3.932    c0.959,1.171,2.645,1.31,3.767,0.31c2.514-2.238,5.722-3.472,9.033-3.472c7.682,0,13.93,6.52,13.93,14.534    C72.928,62.448,66.68,68.97,58.998,68.97z"/>\
                            <g>\
                                <path fill="#009FE3" d="M93.438,42.01c-3.744-6.411-10.431-10.365-17.66-10.365c-3.071,0-6.082,0.715-8.819,2.063     c1.803,1.117,3.451,2.482,4.896,4.05c1.271-0.351,2.588-0.537,3.923-0.537c4.587,0,8.882,2.146,11.767,5.744     c-1.765,0.665-3.414,1.654-4.861,2.941c-1.121,1-1.254,2.759-0.297,3.931c0.957,1.17,2.644,1.312,3.767,0.313     c1.874-1.67,4.269-2.59,6.735-2.59c5.729,0,10.388,4.861,10.388,10.839c0,5.977-4.659,10.84-10.388,10.84     c-2.319,0-4.514-0.78-6.344-2.256c-1.148-0.927-2.791-0.718-3.701,0.452c-2.168,1.176-4.6,1.804-7.064,1.804     c-0.736,0-1.473-0.063-2.195-0.17c-1.275,1.733-2.77,3.286-4.441,4.603c2.129,0.752,4.373,1.145,6.638,1.145     c3.188,0,6.343-0.781,9.181-2.25c2.396,1.469,5.099,2.25,7.93,2.25c8.675,0,15.73-7.365,15.73-16.416     C108.619,49.538,101.856,42.316,93.438,42.01z"/>\
                            </g>\
                        </g>\
                        <path fill="#009FE3" d="M59.271,34.332c-4.592-8.123-12.961-13.146-22.021-13.146c-12.197,0-22.546,8.832-25.019,21.159   C5.936,44.531,1.379,50.726,1.379,58.02c0,9.111,7.104,16.525,15.836,16.525c3.152,0,6.148-0.945,8.739-2.745   c3.495,1.8,7.368,2.745,11.295,2.745c4.074,0,8.098-1.029,11.696-2.966c3.017,1.939,6.451,2.966,10.053,2.966   c10.627,0,19.271-9.021,19.271-20.109C78.271,43.441,69.772,34.485,59.271,34.332z M58.998,68.97c-3.109,0-6.051-1.047-8.506-3.024   c-1.168-0.94-2.845-0.715-3.747,0.503c-0.017,0.021-0.025,0.047-0.042,0.07c-2.893,1.601-6.153,2.452-9.453,2.452   c-3.504,0-6.953-0.948-9.977-2.741c-0.759-0.45-1.639-0.46-2.384-0.123c-0.428,0.074-0.846,0.244-1.211,0.542   c-1.86,1.519-4.096,2.321-6.463,2.321c-5.787,0-10.494-4.912-10.494-10.95s4.707-10.951,10.494-10.951   c2.92,0,5.729,1.285,7.711,3.521c1.003,1.134,2.692,1.202,3.775,0.157c1.084-1.045,1.15-2.809,0.147-3.938   c-2.817-3.187-6.749-5.087-10.88-5.295c2.604-8.697,10.3-14.755,19.277-14.755c6.411,0,12.39,3.177,16.181,8.442   c-2.528,0.797-4.897,2.118-6.934,3.93c-1.121,0.999-1.254,2.761-0.296,3.932c0.959,1.171,2.645,1.31,3.767,0.31   c2.514-2.238,5.722-3.472,9.033-3.472c7.682,0,13.93,6.52,13.93,14.534C72.928,62.448,66.68,68.97,58.998,68.97z"/>\
                    </g>\
                    </svg>';
    //<!-- 4多云 end -->

    //<!-- 5小雨 start -->
    var xiaoyu = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                <g>\
                    <path fill="#009FE3" d="M75.293,23.69c-4.791-8.123-13.523-13.147-22.98-13.147c-12.727,0-23.526,8.831-26.107,21.159   c-6.567,2.188-11.323,8.382-11.323,15.675c0,9.112,7.414,16.526,16.525,16.526c3.289,0,6.415-0.945,9.119-2.744   c3.647,1.799,7.688,2.744,11.786,2.744c4.25,0,8.451-1.029,12.205-2.966c3.147,1.938,6.731,2.966,10.492,2.966   c11.09,0,20.108-9.021,20.108-20.11C95.118,32.798,86.25,23.842,75.293,23.69z M75.009,58.326c-3.246,0-6.316-1.047-8.877-3.023   c-1.22-0.941-2.971-0.717-3.91,0.501c-0.02,0.021-0.027,0.048-0.045,0.069c-2.15,1.142-4.495,1.896-6.912,2.238l-6.184-0.043   c-2.521-0.39-4.963-1.224-7.183-2.482c-0.795-0.453-1.716-0.463-2.493-0.121c-0.443,0.074-0.877,0.244-1.256,0.539   c-1.942,1.52-4.274,2.322-6.745,2.322c-6.038,0-10.951-4.912-10.951-10.951c0-6.038,4.913-10.951,10.951-10.951   c3.046,0,5.979,1.285,8.048,3.523c1.044,1.13,2.811,1.2,3.939,0.156c1.129-1.044,1.2-2.81,0.155-3.938   c-2.941-3.185-7.043-5.086-11.354-5.294c2.716-8.697,10.747-14.755,20.116-14.755c6.689,0,12.929,3.177,16.885,8.443   c-2.639,0.797-5.107,2.118-7.232,3.93c-1.173,1-1.313,2.76-0.313,3.931c0.997,1.17,2.758,1.312,3.93,0.313   c2.625-2.24,5.975-3.473,9.431-3.473c8.015,0,14.534,6.519,14.534,14.534C89.544,51.808,83.024,58.326,75.009,58.326z"/>\
                    <path fill="#009FE3" d="M59.558,79.875c0,3.084-2.5,5.582-5.583,5.582s-5.583-2.498-5.583-5.582s5.583-11.408,5.583-11.408   S59.558,76.791,59.558,79.875z"/>\
                </g>\
                </svg>';
    //<!-- 5小雨 end -->

    //<!-- 6晴转多云 start -->
    var qing_duoyun = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                <g>\
                    <g>\
                        <g>\
                            <path fill="#009FE3" d="M90.923,16.534c1.333,0.771,1.79,2.479,1.021,3.811l-3.938,6.816c-0.77,1.334-2.475,1.791-3.809,1.021     c-1.332-0.771-1.79-2.477-1.02-3.811l3.938-6.814C87.885,16.225,89.588,15.768,90.923,16.534z"/>\
                        </g>\
                        <g>\
                            <path fill="#009FE3" d="M103.951,29.564c0.771,1.334,0.313,3.039-1.021,3.809l-6.818,3.938c-1.332,0.771-3.039,0.313-3.809-1.02     c-0.77-1.336-0.314-3.039,1.02-3.811l6.818-3.938C101.477,27.773,103.18,28.232,103.951,29.564z"/>\
                        </g>\
                        <g>\
                            <path fill="#009FE3" d="M108.721,47.36c0,1.541-1.25,2.787-2.787,2.787h-7.873c-1.541,0.002-2.789-1.248-2.789-2.787     c0-1.541,1.248-2.785,2.789-2.787l7.873,0.002C107.471,44.575,108.719,45.819,108.721,47.36z"/>\
                        </g>\
                        <g>\
                            <path fill="#009FE3" d="M103.951,65.157c-0.77,1.334-2.475,1.789-3.809,1.021l-6.817-3.938c-1.333-0.77-1.79-2.475-1.021-3.807     c0.771-1.336,2.475-1.791,3.809-1.021l6.818,3.938C104.266,62.118,104.721,63.823,103.951,65.157z"/>\
                        </g>\
                        <path fill="#009FE3" d="M62.053,28.184c-1.332,0.77-3.037,0.313-3.808-1.021l-3.937-6.818c-0.771-1.332-0.314-3.035,1.02-3.809    c1.333-0.77,3.038-0.313,3.807,1.021l3.938,6.814C63.844,25.708,63.387,27.413,62.053,28.184z"/>\
                        <g>\
                            <path fill="#009FE3" d="M73.126,25.215c-1.541,0-2.788-1.247-2.788-2.787v-7.873c0-1.539,1.247-2.787,2.788-2.787     c1.54,0,2.787,1.248,2.787,2.787v7.873C75.913,23.969,74.666,25.215,73.126,25.215z"/>\
                        </g>\
                    </g>\
                    <g>\
                        <path fill="#009FE3" d="M61.691,44.021c-4.791-8.123-13.524-13.15-22.981-13.15c-12.727,0-23.525,8.83-26.105,21.16    C6.035,54.22,1.279,60.412,1.279,67.707c0,9.111,7.414,16.525,16.526,16.525c3.29,0,6.415-0.947,9.118-2.746    c3.648,1.799,7.691,2.746,11.787,2.746c4.251,0,8.451-1.031,12.205-2.965c3.15,1.938,6.732,2.965,10.493,2.965    c11.088,0,20.108-9.021,20.108-20.109C81.518,53.127,72.648,44.172,61.691,44.021z M61.406,78.654    c-3.247,0-6.317-1.045-8.879-3.025c-1.217-0.939-2.969-0.715-3.909,0.505c-0.017,0.022-0.027,0.048-0.046,0.067    c-3.02,1.604-6.42,2.453-9.864,2.453c-3.655,0-7.255-0.945-10.411-2.742c-0.792-0.449-1.71-0.457-2.485-0.121    c-0.447,0.074-0.884,0.244-1.266,0.541c-1.939,1.521-4.271,2.322-6.742,2.322c-6.038,0-10.951-4.912-10.951-10.949    c0-6.039,4.913-10.951,10.951-10.951c3.047,0,5.979,1.283,8.048,3.523c1.045,1.131,2.809,1.201,3.938,0.156    s1.201-2.809,0.156-3.939c-2.942-3.186-7.042-5.086-11.354-5.295c2.719-8.697,10.748-14.754,20.117-14.754    c6.688,0,12.929,3.176,16.884,8.441c-2.638,0.799-5.109,2.117-7.232,3.932c-1.17,0.998-1.312,2.76-0.312,3.93    s2.761,1.311,3.931,0.313c2.625-2.24,5.973-3.475,9.429-3.475c8.014,0,14.534,6.521,14.534,14.535    C75.941,72.134,69.421,78.654,61.406,78.654z"/>\
                        <g>\
                            <path fill="#009FE3" d="M91.902,47.586c0-10.354-8.422-18.775-18.775-18.775c-5.336,0.002-10.3,2.225-13.822,6.068     c1.295,1.174,2.498,2.453,3.584,3.846c2.557-2.959,6.254-4.684,10.238-4.686c7.469,0,13.544,6.076,13.544,13.547     c0,3.023-0.987,5.854-2.702,8.139c0.727,1.932,1.217,3.977,1.42,6.1C89.443,58.344,91.902,53.208,91.902,47.586z"/>\
                            <g>\
                                <path fill="#009FE3" d="M91.943,74.377l-3.938-6.816c-0.55-0.951-1.574-1.445-2.604-1.379c-0.172,2.033-0.6,3.998-1.25,5.855      l2.961,5.126c0.77,1.334,2.475,1.791,3.808,1.021C92.256,77.414,92.713,75.711,91.943,74.377z"/>\
                            </g>\
                        </g>\
                    </g>\
                    <path fill="#009FE3" d="M61.691,44.021c-4.791-8.123-13.524-13.15-22.981-13.15c-12.727,0-23.525,8.83-26.105,21.16   C6.035,54.22,1.279,60.412,1.279,67.707c0,9.111,7.414,16.525,16.526,16.525c3.29,0,6.415-0.947,9.118-2.746   c3.648,1.799,7.691,2.746,11.787,2.746c4.251,0,8.451-1.031,12.205-2.965c3.15,1.938,6.732,2.965,10.493,2.965   c11.088,0,20.108-9.021,20.108-20.109C81.518,53.127,72.648,44.172,61.691,44.021z M61.406,78.654   c-3.247,0-6.317-1.045-8.879-3.025c-1.217-0.939-2.969-0.715-3.909,0.505c-0.017,0.022-0.027,0.048-0.046,0.067   c-3.02,1.604-6.42,2.453-9.864,2.453c-3.655,0-7.255-0.945-10.411-2.742c-0.792-0.449-1.71-0.457-2.485-0.121   c-0.447,0.074-0.884,0.244-1.266,0.541c-1.939,1.521-4.271,2.322-6.742,2.322c-6.038,0-10.951-4.912-10.951-10.949   c0-6.039,4.913-10.951,10.951-10.951c3.047,0,5.979,1.283,8.048,3.523c1.045,1.131,2.809,1.201,3.938,0.156   s1.201-2.809,0.156-3.939c-2.942-3.186-7.042-5.086-11.354-5.295c2.719-8.697,10.748-14.754,20.117-14.754   c6.688,0,12.929,3.176,16.884,8.441c-2.638,0.799-5.109,2.117-7.232,3.932c-1.17,0.998-1.312,2.76-0.312,3.93   s2.761,1.311,3.931,0.313c2.625-2.24,5.973-3.475,9.429-3.475c8.014,0,14.534,6.521,14.534,14.535   C75.941,72.134,69.421,78.654,61.406,78.654z"/>\
                </g>\
                </svg>';
    //<!-- 6晴转多云 end -->

    //<!-- 7晴 start -->
    var qing = '<svg  x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
				<g>\
					<path fill="#009FE3" d="M54.999,67c-10.354,0-18.776-8.424-18.776-18.774c0-10.354,8.425-18.776,18.776-18.776   c10.354,0,18.775,8.424,18.775,18.776C73.776,58.576,65.354,67,54.999,67z M54.999,34.681c-7.469,0-13.545,6.076-13.545,13.545   c0,7.47,6.076,13.545,13.545,13.545c7.468,0,13.545-6.075,13.545-13.545C68.544,40.756,62.468,34.681,54.999,34.681z"/>\
					<g>\
						<g>\
							<path fill="#009FE3" d="M43.927,67.176c1.333,0.771,1.79,2.479,1.021,3.811l-3.938,6.816c-0.769,1.332-2.476,1.791-3.808,1.023     c-1.334-0.773-1.791-2.479-1.021-3.813l3.938-6.818C40.889,66.865,42.594,66.408,43.927,67.176z"/>\
							<path fill="#009FE3" d="M72.796,17.174c1.333,0.771,1.79,2.476,1.021,3.81l-3.938,6.815c-0.771,1.334-2.476,1.791-3.808,1.022     c-1.334-0.77-1.791-2.475-1.021-3.809l3.938-6.818C69.758,16.861,71.462,16.404,72.796,17.174z"/>\
						</g>\
						<g>\
							<path fill="#009FE3" d="M35.821,59.07c0.771,1.334,0.313,3.039-1.021,3.811l-6.817,3.936c-1.334,0.77-3.039,0.313-3.81-1.02     c-0.771-1.334-0.313-3.036,1.021-3.809l6.816-3.938C33.346,57.281,35.052,57.738,35.821,59.07z"/>\
							<path fill="#009FE3" d="M85.825,30.204c0.77,1.334,0.313,3.039-1.021,3.807l-6.816,3.938c-1.334,0.77-3.039,0.313-3.811-1.021     c-0.77-1.336-0.313-3.039,1.021-3.809l6.816-3.938C83.351,28.413,85.054,28.87,85.825,30.204z"/>\
						</g>\
						<g>\
							<path fill="#009FE3" d="M32.854,48c0,1.539-1.246,2.785-2.787,2.785h-7.873c-1.539,0-2.787-1.248-2.787-2.785     c0-1.541,1.246-2.787,2.787-2.787l7.873-0.002C31.608,45.211,32.854,46.459,32.854,48z"/>\
							<path fill="#009FE3" d="M90.593,48c0,1.539-1.248,2.785-2.788,2.785h-7.872c-1.541,0.002-2.787-1.248-2.787-2.785     c0-1.541,1.246-2.787,2.787-2.789l7.872,0.002C89.345,45.213,90.593,46.459,90.593,48z"/>\
						</g>\
						<g>\
							<path fill="#009FE3" d="M35.821,36.926c-0.771,1.336-2.475,1.791-3.809,1.021l-6.816-3.938c-1.334-0.768-1.791-2.473-1.021-3.807     c0.771-1.334,2.477-1.791,3.809-1.021l6.817,3.938C36.134,33.89,36.591,35.595,35.821,36.926z"/>\
							<path fill="#009FE3" d="M85.825,65.797c-0.771,1.334-2.475,1.789-3.811,1.02l-6.816-3.936c-1.332-0.77-1.791-2.477-1.021-3.809     c0.771-1.334,2.476-1.791,3.81-1.021l6.817,3.937C86.137,62.758,86.594,64.463,85.825,65.797z"/>\
						</g>\
						<g>\
							<path fill="#009FE3" d="M43.927,28.822c-1.334,0.769-3.038,0.312-3.809-1.021l-3.938-6.817c-0.77-1.334-0.313-3.037,1.021-3.808     c1.332-0.771,3.037-0.313,3.808,1.021l3.938,6.818C45.717,26.349,45.26,28.054,43.927,28.822z"/>\
							<path fill="#009FE3" d="M72.796,78.824c-1.333,0.771-3.038,0.313-3.809-1.021l-3.938-6.815c-0.77-1.334-0.313-3.039,1.021-3.809     c1.332-0.77,3.037-0.313,3.808,1.021l3.938,6.816C74.586,76.35,74.129,78.053,72.796,78.824z"/>\
						</g>\
						<g>\
							<path fill="#009FE3" d="M54.999,25.854c-1.54,0-2.788-1.248-2.788-2.787v-7.873c0-1.538,1.248-2.786,2.788-2.786     c1.539,0,2.787,1.248,2.787,2.786v7.873C57.788,24.607,56.54,25.854,54.999,25.854z"/>\
							<path fill="#009FE3" d="M54.999,83.592c-1.54,0-2.788-1.246-2.788-2.787v-7.871c0-1.541,1.248-2.789,2.788-2.789     c1.539,0,2.787,1.248,2.787,2.789v7.871C57.788,82.346,56.54,83.592,54.999,83.592z"/>\
						</g>\
					</g>\
				</g>\
			</svg>';
    //<!-- 7晴 end -->

    //<!-- 8多云_阵雨 start -->
    var duoyun_zhenyu = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                        <g>\
                            <g>\
                                <g>\
                                    <g>\
                                        <path fill="#009FE3" d="M90.924,5.36c1.334,0.771,1.791,2.476,1.021,3.81l-3.938,6.817c-0.77,1.334-2.475,1.791-3.809,1.021      c-1.332-0.771-1.789-2.476-1.021-3.81l3.939-6.815C87.885,5.049,89.59,4.592,90.924,5.36z"/>\
                                    </g>\
                                    <g>\
                                        <path fill="#009FE3" d="M103.953,18.39c0.77,1.334,0.313,3.039-1.021,3.807l-6.818,3.938c-1.332,0.771-3.037,0.313-3.809-1.021      c-0.77-1.334-0.313-3.039,1.021-3.809l6.818-3.938C101.477,16.599,103.18,17.056,103.953,18.39z"/>\
                                    </g>\
                                    <g>\
                                        <path fill="#009FE3" d="M108.721,36.187c0,1.541-1.248,2.787-2.787,2.787h-7.873c-1.543,0-2.787-1.248-2.787-2.787      c0-1.541,1.244-2.787,2.785-2.787h7.873C107.473,33.399,108.719,34.646,108.721,36.187z"/>\
                                    </g>\
                                    <g>\
                                        <path fill="#009FE3" d="M103.953,53.983c-0.771,1.334-2.477,1.789-3.811,1.021l-6.816-3.937      c-1.334-0.771-1.791-2.476-1.021-3.808c0.771-1.336,2.477-1.79,3.809-1.021l6.816,3.938      C104.264,50.944,104.721,52.649,103.953,53.983z"/>\
                                    </g>\
                                    <path fill="#009FE3" d="M62.053,17.008c-1.332,0.771-3.037,0.313-3.807-1.021l-3.938-6.818c-0.77-1.334-0.313-3.037,1.021-3.808     c1.332-0.771,3.037-0.313,3.807,1.021l3.939,6.815C63.844,14.534,63.387,16.239,62.053,17.008z"/>\
                                    <g>\
                                        <path fill="#009FE3" d="M73.127,14.041c-1.539,0-2.787-1.247-2.787-2.788V3.38c0-1.539,1.248-2.786,2.787-2.786      c1.541,0,2.789,1.247,2.789,2.786v7.873C75.916,12.794,74.668,14.041,73.127,14.041z"/>\
                                    </g>\
                                </g>\
                                <g>\
                                    <path fill="#009FE3" d="M61.691,32.845c-4.791-8.121-13.523-13.148-22.98-13.148c-12.729,0-23.527,8.83-26.107,21.16     C6.035,43.043,1.279,49.235,1.279,56.532c0,9.111,7.414,16.523,16.525,16.523c3.291,0,6.416-0.945,9.121-2.742     c3.646,1.797,7.689,2.742,11.785,2.742c4.252,0,8.453-1.031,12.207-2.966c3.148,1.938,6.73,2.966,10.492,2.966     c11.088,0,20.107-9.021,20.107-20.109C81.516,41.952,72.65,32.998,61.691,32.845z M61.408,67.48     c-3.246,0-6.316-1.045-8.879-3.025c-1.219-0.939-2.971-0.716-3.91,0.505c-0.018,0.021-0.027,0.047-0.043,0.067     c-3.02,1.604-6.422,2.453-9.867,2.453c-3.654,0-7.254-0.947-10.41-2.742c-0.793-0.449-1.711-0.459-2.488-0.121     c-0.445,0.074-0.883,0.244-1.264,0.541c-1.939,1.521-4.271,2.322-6.744,2.322c-6.039,0-10.951-4.912-10.951-10.949     c0-6.041,4.914-10.953,10.951-10.953c3.047,0,5.98,1.285,8.047,3.523c1.045,1.133,2.811,1.203,3.941,0.155     c1.131-1.043,1.199-2.808,0.154-3.938c-2.939-3.187-7.043-5.088-11.354-5.295c2.717-8.697,10.748-14.756,20.115-14.756     c6.689,0,12.93,3.178,16.885,8.442c-2.639,0.799-5.109,2.116-7.234,3.931c-1.172,1-1.311,2.76-0.311,3.932     c1,1.17,2.76,1.31,3.93,0.312c2.623-2.239,5.973-3.474,9.43-3.474c8.014,0,14.533,6.521,14.533,14.533S69.422,67.48,61.408,67.48     z"/>\
                                    <g>\
                                        <path fill="#009FE3" d="M91.904,36.411c0-10.354-8.424-18.773-18.777-18.773c-5.336,0-10.301,2.225-13.822,6.068      c1.295,1.173,2.498,2.453,3.584,3.846c2.557-2.96,6.254-4.684,10.238-4.686c7.469,0,13.547,6.076,13.547,13.545      c0,3.025-0.99,5.854-2.705,8.141c0.727,1.932,1.217,3.977,1.42,6.098C89.445,47.166,91.904,42.034,91.904,36.411z"/>\
                                        <g>\
                                            <path fill="#009FE3" d="M91.945,63.203l-3.939-6.819c-0.549-0.948-1.574-1.442-2.604-1.377c-0.174,2.034-0.6,3.998-1.248,5.856       l2.959,5.125c0.771,1.336,2.477,1.791,3.809,1.021C92.258,66.24,92.715,64.537,91.945,63.203z"/>\
                                        </g>\
                                    </g>\
                                </g>\
                                <path fill="#009FE3" d="M61.691,32.845c-4.791-8.121-13.523-13.148-22.98-13.148c-12.729,0-23.527,8.83-26.107,21.16    C6.035,43.043,1.279,49.235,1.279,56.532c0,9.111,7.414,16.523,16.525,16.523c3.291,0,6.416-0.945,9.121-2.742    c3.646,1.797,7.689,2.742,11.785,2.742c4.252,0,8.453-1.031,12.207-2.966c3.148,1.938,6.73,2.966,10.492,2.966    c11.088,0,20.107-9.021,20.107-20.109C81.516,41.952,72.65,32.998,61.691,32.845z M61.408,67.48c-3.246,0-6.316-1.045-8.879-3.025    c-1.219-0.939-2.971-0.716-3.91,0.505c-0.018,0.021-0.027,0.047-0.043,0.067c-3.02,1.604-6.422,2.453-9.867,2.453    c-3.654,0-7.254-0.947-10.41-2.742c-0.793-0.449-1.711-0.459-2.488-0.121c-0.445,0.074-0.883,0.244-1.264,0.541    c-1.939,1.521-4.271,2.322-6.744,2.322c-6.039,0-10.951-4.912-10.951-10.949c0-6.041,4.914-10.953,10.951-10.953    c3.047,0,5.98,1.285,8.047,3.523c1.045,1.133,2.811,1.203,3.941,0.155c1.131-1.043,1.199-2.808,0.154-3.938    c-2.939-3.187-7.043-5.088-11.354-5.295c2.717-8.697,10.748-14.756,20.115-14.756c6.689,0,12.93,3.178,16.885,8.442    c-2.639,0.799-5.109,2.116-7.234,3.931c-1.172,1-1.311,2.76-0.311,3.932c1,1.17,2.76,1.31,3.93,0.312    c2.623-2.239,5.973-3.474,9.43-3.474c8.014,0,14.533,6.521,14.533,14.533S69.422,67.48,61.408,67.48z"/>\
                            </g>\
                            <path fill="#009FE3" d="M39.525,89.822c0,3.086-2.5,5.584-5.582,5.584c-3.084,0-5.584-2.498-5.584-5.584   c0-3.082,5.584-11.406,5.584-11.406S39.525,86.74,39.525,89.822z"/>\
                            <path fill="#009FE3" d="M54.332,89.822c0,3.086-2.5,5.584-5.582,5.584c-3.084,0-5.584-2.498-5.584-5.584   c0-3.082,5.584-11.406,5.584-11.406S54.332,86.74,54.332,89.822z"/>\
                        </g>\
                        </svg>';
    //<!-- 8多云_阵雨 end -->

    //<!-- 9打雷 start -->
    var dalei = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                <g>\
                    <g>\
                        <path fill="#009FE3" d="M75.294,27.418c-4.791-8.121-13.525-13.146-22.98-13.146c-12.729,0-23.527,8.83-26.107,21.16    c-6.57,2.187-11.324,8.379-11.324,15.674c0,9.11,7.414,16.524,16.525,16.524c3.291,0,6.416-0.945,9.119-2.744    c0.365,0.181,0.738,0.347,1.111,0.508c0.352-0.805,1.945-5.232,1.945-5.232c-0.57-0.261-1.137-0.537-1.682-0.849    c-0.795-0.449-1.51-0.694-2.453-0.248c-0.445,0.073-0.918,0.37-1.301,0.67c-1.938,1.519-4.271,2.319-6.742,2.319    c-6.037,0-10.949-4.912-10.949-10.948c0-6.039,4.912-10.951,10.949-10.951c3.047,0,5.979,1.283,8.047,3.523    c1.047,1.131,2.811,1.201,3.939,0.156s1.199-2.808,0.156-3.938c-2.943-3.187-7.045-5.088-11.354-5.293    c2.717-8.699,10.746-14.756,20.115-14.756c6.689,0,12.93,3.176,16.887,8.441c-2.641,0.801-5.109,2.118-7.234,3.934    c-1.172,0.998-1.311,2.758-0.311,3.928c0.996,1.172,2.758,1.312,3.93,0.312c2.623-2.24,5.973-3.474,9.43-3.474    c8.014,0,14.535,6.521,14.535,14.535c0,8.015-6.521,14.532-14.535,14.532c-2.246,0-4.402-0.51-6.369-1.475    c-0.469,1.172-2.086,5.172-2.086,5.172c2.625,1.228,5.48,1.879,8.455,1.879c11.088,0,20.107-9.021,20.107-20.108    C95.118,36.528,86.251,27.571,75.294,27.418z"/>\
                    </g>\
                    <path fill="#009FE3" d="M56.185,45.789c0.055-0.529-0.09-0.57-0.32-0.093l-9.371,19.437c-0.23,0.479,0.016,0.871,0.545,0.871h6.012   c0.529,0,0.936,0.432,0.896,0.961l-1,14.333c-0.035,0.529,0.129,0.576,0.367,0.103l10.475-20.774c0.24-0.476,0-0.869-0.529-0.881   l-7.525-0.149c-0.527-0.011-0.92-0.451-0.863-0.979L56.185,45.789z"/>\
                </g>\
                </svg>';
    //<!-- 9打雷 end -->

    //<!-- 10打雷_暴雨 start -->
    var dalei_baoyu = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                        <g>\
                            <g>\
                                <g>\
                                    <path fill="#009FE3" d="M75.293,20.978C70.502,12.855,61.768,7.832,52.311,7.832c-12.727,0-23.523,8.83-26.104,21.159     c-6.57,2.187-11.326,8.38-11.326,15.675c0,9.11,7.414,16.524,16.525,16.524c3.289,0,6.416-0.944,9.119-2.744     c0.365,0.181,0.738,0.345,1.111,0.509c0.35-0.806,1.947-5.234,1.947-5.234c-0.572-0.26-1.137-0.535-1.684-0.848     c-0.795-0.449-1.508-0.695-2.453-0.248c-0.445,0.073-0.918,0.373-1.301,0.668c-1.938,1.52-4.27,2.319-6.742,2.319     c-6.037,0-10.949-4.909-10.949-10.946c0-6.039,4.912-10.953,10.949-10.953c3.047,0,5.979,1.285,8.049,3.524     c1.047,1.132,2.809,1.201,3.938,0.156s1.201-2.809,0.156-3.938c-2.939-3.187-7.043-5.089-11.354-5.295     c2.719-8.697,10.748-14.755,20.115-14.755c6.691,0,12.932,3.175,16.887,8.441c-2.641,0.799-5.109,2.119-7.234,3.932     c-1.17,1-1.311,2.759-0.311,3.929c1,1.174,2.76,1.311,3.932,0.313c2.623-2.24,5.971-3.473,9.426-3.473     c8.016,0,14.535,6.521,14.535,14.535c0,8.012-6.521,14.53-14.535,14.53c-2.244,0-4.4-0.511-6.367-1.476     c-0.471,1.174-2.086,5.174-2.086,5.174c2.625,1.229,5.482,1.88,8.453,1.88c11.09,0,20.111-9.021,20.111-20.108     C95.119,30.088,86.252,21.131,75.293,20.978z"/>\
                                </g>\
                                <path fill="#009FE3" d="M56.182,39.349c0.055-0.529-0.09-0.57-0.32-0.092L46.49,58.693c-0.229,0.479,0.018,0.869,0.547,0.869    h6.012c0.531,0,0.936,0.435,0.896,0.961l-1,14.332c-0.035,0.529,0.129,0.576,0.365,0.104l10.479-20.774    c0.236-0.476,0-0.869-0.529-0.881l-7.525-0.15c-0.529-0.01-0.92-0.45-0.865-0.979L56.182,39.349z"/>\
                            </g>\
                            <path fill="#009FE3" d="M69.432,88.168c-0.484,0-0.979-0.127-1.426-0.396c-1.322-0.786-1.754-2.495-0.965-3.821l5.5-9.219   c0.787-1.322,2.502-1.753,3.82-0.968c1.322,0.793,1.756,2.502,0.967,3.824l-5.502,9.219C71.307,87.68,70.383,88.168,69.432,88.168z   "/>\
                            <path fill="#009FE3" d="M40.76,88.168c-0.486,0-0.98-0.127-1.426-0.396c-1.322-0.786-1.756-2.495-0.967-3.821l5.5-9.219   c0.789-1.322,2.502-1.753,3.822-0.968c1.322,0.793,1.756,2.502,0.967,3.824l-5.502,9.219C42.635,87.68,41.709,88.168,40.76,88.168z   "/>\
                            <path fill="#009FE3" d="M26.424,88.168c-0.486,0-0.979-0.127-1.426-0.396c-1.322-0.786-1.754-2.495-0.967-3.821l5.502-9.219   c0.789-1.322,2.502-1.753,3.82-0.968c1.322,0.793,1.756,2.502,0.967,3.824l-5.5,9.219C28.299,87.68,27.375,88.168,26.424,88.168z"/>\
                            <path fill="#009FE3" d="M55.096,88.168c-0.486,0-0.979-0.127-1.426-0.396c-1.322-0.786-1.754-2.495-0.967-3.821l5.5-9.219   c0.789-1.322,2.504-1.753,3.822-0.968c1.322,0.793,1.754,2.502,0.967,3.824l-5.502,9.219C56.971,87.68,56.047,88.168,55.096,88.168   z"/>\
                        </g>\
                        </svg>';
    //<!-- 10打雷_暴雨 end -->

    //<!-- 11大雪 start -->
    var daxue = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                <g>\
                    <path fill="#009FE3" d="M75.294,18.086C70.503,9.963,61.771,4.94,52.313,4.94c-12.729,0-23.525,8.828-26.107,21.158   c-6.568,2.187-11.324,8.381-11.324,15.676c0,9.11,7.414,16.524,16.525,16.524c3.291,0,6.416-0.946,9.119-2.745   c3.648,1.797,7.689,2.745,11.787,2.745c4.25,0,8.451-1.032,12.205-2.967c3.146,1.938,6.73,2.967,10.492,2.967   c11.088,0,20.107-9.022,20.107-20.11C95.12,27.196,86.251,18.237,75.294,18.086z M75.011,52.721c-3.248,0-6.316-1.048-8.877-3.022   c-1.219-0.941-2.971-0.716-3.91,0.5c-0.02,0.022-0.027,0.049-0.045,0.073c-3.021,1.599-6.42,2.449-9.865,2.449   c-3.654,0-7.254-0.944-10.41-2.742c-0.795-0.45-1.715-0.461-2.492-0.123c-0.445,0.074-0.881,0.248-1.26,0.546   c-1.939,1.518-4.271,2.319-6.744,2.319c-6.037,0-10.951-4.912-10.951-10.946c0-6.041,4.914-10.955,10.951-10.955   c3.047,0,5.98,1.284,8.047,3.526c1.045,1.129,2.809,1.198,3.939,0.153c1.129-1.045,1.201-2.812,0.156-3.938   c-2.941-3.185-7.043-5.088-11.355-5.295c2.717-8.696,10.748-14.754,20.117-14.754c6.689,0,12.93,3.176,16.885,8.44   c-2.639,0.799-5.111,2.119-7.234,3.932c-1.172,1-1.311,2.763-0.311,3.932c1,1.17,2.76,1.313,3.93,0.313   c2.623-2.241,5.973-3.477,9.428-3.477c8.016,0,14.533,6.521,14.533,14.536C89.544,46.204,83.026,52.721,75.011,52.721z"/>\
                    <g>\
                        <g>\
                            <path fill="#009FE3" d="M45.401,65.618c0.529,0.918,0.217,2.09-0.701,2.621l-10.115,5.84c-0.918,0.528-2.09,0.215-2.617-0.703     c-0.529-0.918-0.217-2.088,0.699-2.619l10.117-5.84C43.7,64.387,44.872,64.702,45.401,65.618z"/>\
                        </g>\
                        <g>\
                            <path fill="#009FE3" d="M45.401,73.375c-0.529,0.918-1.701,1.232-2.619,0.703l-10.115-5.84c-0.918-0.531-1.229-1.703-0.701-2.621     c0.529-0.916,1.701-1.229,2.617-0.701l10.117,5.84C45.616,71.288,45.931,72.457,45.401,73.375z"/>\
                        </g>\
                        <g>\
                            <path fill="#009FE3" d="M38.683,77.255c-1.059,0-1.916-0.856-1.916-1.92v-11.68c0-1.059,0.857-1.918,1.916-1.918     s1.918,0.859,1.918,1.918v11.68C40.601,76.398,39.741,77.255,38.683,77.255z"/>\
                        </g>\
                    </g>\
                    <g>\
                        <g>\
                            <path fill="#009FE3" d="M76.196,65.618c0.529,0.918,0.215,2.09-0.701,2.621l-10.115,5.84c-0.918,0.528-2.09,0.215-2.619-0.701     c-0.529-0.92-0.215-2.09,0.701-2.621l10.115-5.84C74.495,64.387,75.667,64.702,76.196,65.618z"/>\
                        </g>\
                        <g>\
                            <path fill="#009FE3" d="M76.196,73.375c-0.529,0.918-1.701,1.232-2.617,0.703l-10.117-5.84c-0.916-0.531-1.23-1.703-0.701-2.621     c0.529-0.916,1.701-1.229,2.619-0.701l10.115,5.84C76.411,71.288,76.726,72.457,76.196,73.375z"/>\
                        </g>\
                        <g>\
                            <path fill="#009FE3" d="M69.479,77.255c-1.061,0-1.916-0.856-1.916-1.92v-11.68c0-1.059,0.855-1.918,1.916-1.918     c1.059,0,1.916,0.859,1.916,1.918v11.68C71.396,76.398,70.538,77.255,69.479,77.255z"/>\
                        </g>\
                    </g>\
                    <g>\
                        <g>\
                            <path fill="#009FE3" d="M60.798,79.425c0.529,0.916,0.217,2.089-0.701,2.615l-10.115,5.842c-0.916,0.527-2.088,0.218-2.619-0.7     c-0.529-0.916-0.215-2.091,0.703-2.619l10.115-5.839C59.097,78.192,60.269,78.505,60.798,79.425z"/>\
                        </g>\
                        <g>\
                            <path fill="#009FE3" d="M60.798,87.182c-0.527,0.918-1.701,1.229-2.617,0.7l-10.115-5.84c-0.918-0.528-1.232-1.701-0.703-2.617     c0.531-0.919,1.703-1.233,2.619-0.702l10.117,5.839C61.013,85.091,61.327,86.266,60.798,87.182z"/>\
                        </g>\
                        <g>\
                            <path fill="#009FE3" d="M54.079,91.06c-1.059,0-1.916-0.857-1.916-1.916V77.462c0-1.059,0.857-1.916,1.916-1.916     c1.061,0,1.918,0.857,1.918,1.916v11.682C55.997,90.202,55.138,91.06,54.079,91.06z"/>\
                        </g>\
                    </g>\
                </g>\
                </svg>';
    //<!-- 11大雪 end -->

    //<!-- 12雨夹雪 start -->
    var yujiaxue = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                    <g>\
                        <path fill="#009FE3" d="M60.281,85.717c0,3.082-2.5,5.582-5.582,5.582c-3.084,0-5.584-2.5-5.584-5.582s5.584-11.406,5.584-11.406   S60.281,82.635,60.281,85.717z"/>\
                        <path fill="#009FE3" d="M75.291,17.851C70.5,9.728,61.766,4.701,52.311,4.701c-12.727,0-23.525,8.832-26.107,21.16   c-6.568,2.187-11.322,8.381-11.322,15.674c0,9.115,7.414,16.525,16.525,16.525c3.289,0,6.414-0.944,9.117-2.74   c3.648,1.796,7.691,2.74,11.787,2.74c4.252,0,8.451-1.028,12.205-2.964c3.15,1.939,6.734,2.964,10.494,2.964   c11.088,0,20.109-9.021,20.109-20.107C95.117,26.961,86.248,18.004,75.291,17.851z M75.006,52.488   c-3.246,0-6.316-1.048-8.877-3.025c-1.219-0.94-2.969-0.717-3.91,0.5c-0.018,0.022-0.029,0.049-0.045,0.074   c-3.02,1.598-6.42,2.451-9.865,2.451c-3.656,0-7.256-0.949-10.412-2.742c-0.795-0.453-1.713-0.463-2.492-0.123   c-0.441,0.074-0.879,0.246-1.258,0.543c-1.939,1.521-4.27,2.322-6.744,2.322c-6.037,0-10.951-4.913-10.951-10.954   c0-6.037,4.914-10.948,10.951-10.948c3.047,0,5.98,1.284,8.049,3.522c1.043,1.131,2.809,1.201,3.939,0.156   c1.131-1.045,1.201-2.81,0.158-3.938c-2.941-3.184-7.043-5.086-11.355-5.297c2.717-8.694,10.746-14.752,20.117-14.752   c6.689,0,12.928,3.176,16.883,8.441c-2.639,0.799-5.109,2.119-7.232,3.932c-1.17,1.002-1.311,2.76-0.311,3.928   c1,1.175,2.76,1.313,3.93,0.313c2.623-2.24,5.971-3.473,9.428-3.473c8.014,0,14.535,6.521,14.535,14.534   C89.543,45.969,83.021,52.488,75.006,52.488z"/>\
                        <g>\
                            <g>\
                                <path fill="#009FE3" d="M45.396,65.385c0.531,0.916,0.215,2.088-0.701,2.617L34.58,73.844c-0.918,0.529-2.09,0.213-2.619-0.7     c-0.529-0.918-0.215-2.091,0.701-2.621l10.115-5.838C43.695,64.154,44.869,64.469,45.396,65.385z"/>\
                            </g>\
                            <g>\
                                <path fill="#009FE3" d="M45.396,73.142c-0.529,0.913-1.701,1.229-2.619,0.7L32.662,68c-0.916-0.529-1.23-1.701-0.701-2.617     s1.701-1.229,2.617-0.701l10.117,5.839C45.611,71.053,45.928,72.223,45.396,73.142z"/>\
                            </g>\
                            <g>\
                                <path fill="#009FE3" d="M38.68,77.021c-1.061,0-1.918-0.858-1.918-1.918V63.42c0-1.057,0.857-1.918,1.918-1.918     c1.059,0,1.916,0.861,1.916,1.918v11.683C40.596,76.162,39.738,77.021,38.68,77.021z"/>\
                            </g>\
                        </g>\
                        <g>\
                            <g>\
                                <path fill="#009FE3" d="M76.191,65.383c0.531,0.918,0.217,2.09-0.699,2.619l-10.117,5.842c-0.918,0.529-2.09,0.213-2.619-0.7     c-0.529-0.918-0.215-2.091,0.701-2.621l10.117-5.838C74.492,64.154,75.666,64.469,76.191,65.383z"/>\
                            </g>\
                            <g>\
                                <path fill="#009FE3" d="M76.193,73.142c-0.529,0.913-1.701,1.229-2.617,0.7L63.459,68c-0.918-0.529-1.23-1.701-0.703-2.617     c0.529-0.916,1.701-1.229,2.619-0.701l10.117,5.839C76.408,71.053,76.723,72.223,76.193,73.142z"/>\
                            </g>\
                            <g>\
                                <path fill="#009FE3" d="M69.475,77.021c-1.061,0-1.916-0.858-1.916-1.918V63.42c0-1.057,0.855-1.918,1.916-1.918     s1.918,0.861,1.918,1.918v11.683C71.393,76.162,70.535,77.021,69.475,77.021z"/>\
                            </g>\
                        </g>\
                    </g>\
                    </svg>';
    //<!-- 12雨夹雪 end -->

    //<!-- 13雷阵雨 start -->
    var leizhenyu = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                <g>\
                    <path fill="#009FE3" d="M44.017,83.052c0,3.084-2.5,5.582-5.582,5.582c-3.084,0-5.582-2.498-5.582-5.582   c0-3.085,5.582-11.407,5.582-11.407S44.017,79.967,44.017,83.052z"/>\
                    <path fill="#009FE3" d="M61.212,83.052c0,3.084-2.5,5.582-5.584,5.582c-3.082,0-5.582-2.498-5.582-5.582   c0-3.085,5.582-11.407,5.582-11.407S61.212,79.967,61.212,83.052z"/>\
                    <path fill="#009FE3" d="M78.733,83.052c0,3.084-2.498,5.582-5.58,5.582c-3.084,0-5.584-2.498-5.584-5.582   c0-3.085,5.584-11.407,5.584-11.407S78.733,79.967,78.733,83.052z"/>\
                    <g>\
                        <g>\
                            <path fill="#009FE3" d="M48.616,38.884c0.053-0.528-0.09-0.569-0.32-0.091l-9.371,19.436c-0.23,0.479,0.016,0.869,0.545,0.869     h6.012c0.531,0,0.936,0.435,0.896,0.963l-1,14.336c-0.035,0.528,0.129,0.573,0.367,0.102l10.477-20.775     c0.238-0.474,0-0.869-0.529-0.881l-7.523-0.15c-0.529-0.011-0.92-0.449-0.865-0.979L48.616,38.884z"/>\
                        </g>\
                    </g>\
                    <g>\
                        <path fill="#009FE3" d="M48.616,38.884c0.053-0.528-0.09-0.569-0.32-0.091l-9.371,19.436c-0.23,0.479,0.016,0.869,0.545,0.869    h6.012c0.531,0,0.936,0.435,0.896,0.963l-1,14.336c-0.035,0.528,0.129,0.573,0.367,0.102l10.477-20.775    c0.238-0.474,0-0.869-0.529-0.881l-7.523-0.15c-0.529-0.011-0.92-0.449-0.865-0.979L48.616,38.884z"/>\
                    </g>\
                    <g>\
                        <g>\
                            <path fill="#009FE3" d="M68.927,38.884c0.055-0.528-0.092-0.569-0.32-0.091l-9.373,19.436c-0.23,0.479,0.016,0.869,0.545,0.869     h6.012c0.531,0,0.936,0.435,0.898,0.963l-1,14.336c-0.037,0.528,0.127,0.573,0.367,0.102L76.53,53.723     c0.238-0.474,0-0.869-0.531-0.881l-7.523-0.15c-0.531-0.011-0.92-0.449-0.865-0.979L68.927,38.884z"/>\
                        </g>\
                        <g>\
                            <path fill="#009FE3" d="M95.118,40.618c0-10.994-8.869-19.951-19.826-20.104c-4.791-8.123-13.523-13.148-22.98-13.148     c-12.727,0-23.523,8.834-26.105,21.157c-6.57,2.189-11.324,8.386-11.324,15.679c0,9.11,7.414,16.521,16.523,16.521     c1.021,0,2.023-0.098,3.008-0.273c-0.52-1.365-0.461-2.908,0.207-4.295l0.863-1.793c-1.283,0.514-2.654,0.788-4.078,0.788     c-6.039,0-10.949-4.911-10.949-10.948c0-6.041,4.91-10.953,10.949-10.953c3.045,0,5.98,1.285,8.049,3.524     c1.043,1.132,2.809,1.199,3.938,0.154c1.131-1.045,1.201-2.807,0.156-3.938c-2.941-3.184-7.043-5.086-11.354-5.293     c2.717-8.699,10.746-14.754,20.117-14.754c6.689,0,12.928,3.176,16.885,8.442c-2.641,0.797-5.111,2.115-7.236,3.928     c-1.17,1.002-1.309,2.761-0.309,3.933c1,1.17,2.76,1.311,3.93,0.311c2.623-2.242,5.973-3.475,9.428-3.475     c8.016,0,14.533,6.521,14.533,14.537c0,5.723-3.336,10.674-8.156,13.041c-0.041,0.752-0.23,1.506-0.588,2.213l-2.289,4.543     C87.935,58.754,95.118,50.512,95.118,40.618z"/>\
                        </g>\
                    </g>\
                    <g>\
                        <path fill="#009FE3" d="M68.927,38.884c0.055-0.528-0.092-0.569-0.32-0.091l-9.373,19.436c-0.23,0.479,0.016,0.869,0.545,0.869    h6.012c0.531,0,0.936,0.435,0.898,0.963l-1,14.336c-0.037,0.528,0.127,0.573,0.367,0.102L76.53,53.723    c0.238-0.474,0-0.869-0.531-0.881l-7.523-0.15c-0.531-0.011-0.92-0.449-0.865-0.979L68.927,38.884z"/>\
                    </g>\
                </g>\
                </svg>';
    //<!-- 13雷阵雨 end -->

    //<!-- 14夜_阴 start -->
    var ye_yin = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                <g>\
                    <path fill="#009FE3" d="M77.502,43.357c-5.789-9.226-3.951-21.271,3.67-29.865c-2.723,0.771-5.41,1.939-7.963,3.545   C65.748,21.723,61.068,29,59.826,36.529c-4.893-4.662-11.439-7.381-18.389-7.381c-12.727,0-23.525,8.832-26.105,21.161   C8.764,52.496,4.008,58.689,4.008,65.982c0,9.109,7.414,16.525,16.525,16.525c3.287,0,6.416-0.949,9.117-2.744   c3.648,1.793,7.691,2.744,11.787,2.744c4.252,0,8.451-1.031,12.205-2.967c3.15,1.938,6.734,2.967,10.492,2.967   c10.787,0,19.611-8.535,20.088-19.205c5.082-0.135,10.33-1.639,15.113-4.643c2.555-1.604,4.775-3.51,6.656-5.631   C94.941,56.162,83.291,52.578,77.502,43.357z M64.137,76.932c-3.246,0-6.314-1.047-8.877-3.021c-1.219-0.943-2.969-0.717-3.91,0.5   c-0.018,0.021-0.025,0.049-0.043,0.068c-3.02,1.604-6.422,2.453-9.867,2.453c-3.654,0-7.256-0.945-10.41-2.74   c-0.795-0.451-1.713-0.459-2.488-0.123c-0.445,0.072-0.881,0.248-1.262,0.545c-1.941,1.518-4.273,2.318-6.744,2.318   c-6.037,0-10.949-4.91-10.949-10.949c0-6.037,4.912-10.949,10.949-10.949c3.047,0,5.979,1.283,8.049,3.521   c1.045,1.129,2.809,1.201,3.938,0.156s1.201-2.809,0.156-3.939c-2.943-3.184-7.045-5.086-11.354-5.297   c2.717-8.693,10.746-14.754,20.115-14.754c6.691,0,12.93,3.177,16.887,8.441c-2.639,0.799-5.109,2.117-7.234,3.932   c-1.17,1-1.313,2.758-0.313,3.93c0.998,1.172,2.758,1.311,3.932,0.313c2.625-2.24,5.973-3.475,9.428-3.475   c8.016,0,14.535,6.521,14.535,14.534C78.672,70.412,72.15,76.932,64.137,76.932z"/>\
                    <polygon fill="#009FE3" points="91.719,25.223 95.803,23.078 95.021,27.626 98.326,30.843 93.762,31.509 91.719,35.648    89.676,31.509 85.109,30.843 88.412,27.626 87.635,23.078  "/>\
                    <polygon fill="#009FE3" points="52.994,19.479 55.869,17.97 55.32,21.171 57.648,23.441 54.432,23.908 52.994,26.824    51.555,23.908 48.338,23.441 50.664,21.171 50.117,17.97  "/>\
                </g>\
                </svg>';
    //<!-- 14夜_阴 end -->

    //<!-- 15夜_晴 start -->
    var ye_qing = '<svg x="0px" y="0px" width="110px" height="76px" viewBox="0 0 110 96" enable-background="new 0 0 110 96" xml:space="preserve">\
                    <g>\
                        <polygon fill="#009FE3" points="64.13,36.086 68.216,33.936 67.435,38.487 70.739,41.709 66.173,42.369 64.13,46.507    62.087,42.369 57.522,41.709 60.825,38.487 60.046,33.936  "/>\
                        <polygon fill="#009FE3" points="68.909,51.216 71.786,49.707 71.237,52.91 73.565,55.179 70.347,55.645 68.909,58.559    67.472,55.645 64.253,55.179 66.581,52.91 66.032,49.707  "/>\
                        <g>\
                            <path fill="#009FE3" d="M61.856,77.953c-0.002,0-0.002,0-0.002,0c-11.102-0.002-21.279-5.582-27.236-14.936    c-4.629-7.266-6.15-15.896-4.283-24.311c1.865-8.414,6.896-15.594,14.162-20.224c0.977-0.623,2.24-0.575,3.17,0.119    c0.928,0.697,1.328,1.896,1.004,3.011c-0.043,0.15-4.369,15.786,4.723,29.371c8.965,13.393,24.672,16.801,24.828,16.83    c1.109,0.23,1.973,1.111,2.176,2.229c0.203,1.115-0.285,2.246-1.242,2.854C73.962,76.203,67.981,77.953,61.856,77.953z     M42.101,27.705c-3.113,3.405-5.299,7.582-6.324,12.209c-1.543,6.959-0.285,14.102,3.545,20.109    c4.926,7.734,13.35,12.352,22.533,12.352c0,0,0,0,0.002,0c2.838,0,5.639-0.453,8.309-1.332    c-6.154-2.521-15.107-7.549-21.402-16.953C42.384,44.563,41.64,34.421,42.101,27.705z"/>\
                        </g>\
                    </g>\
                    </svg>';
    //<!-- 15夜_晴 end -->
    /* weather logos end */

    ModalWeather.prototype.renderModal = function () {
        var crtContainer = this.container;
        var timeTicket;
        var _this = this;

        _this.isFirstRender = true;
        _this.chart = undefined;
        /*_this.startTime = new Date();
        _this.endTime = new Date(_this.startTime.format('yyyy-MM-dd HH:mm:ss').split(' ')[0] + ' '+ (_this.startTime.getHours()+1) + ':40:00');*/
        getWeatherStatus();
        if(timeTicket){
            clearInterval(timeTicket)
        }
        //每隔10分钟刷一次
        timeTicket = setInterval(getWeatherStatus,1000*60*10);//parseInt((_this.endTime.getTime() - _this.startTime.getTime())/6)
        //格式化最高温 最低温
        function formatTemp(temprt){
            return temprt.substring(temprt.indexOf('温')+1);
        }
        // 根据天气类型获取图片
        function getWeatherPic (weathType, type){
            var resultPic ;
            switch (weathType)
            {
                case '阴':
                  resultPic = yin;
                    if(type == 2){
                        resultPic = ye_yin;
                    }
                  break;
                case '大雨':
                  resultPic = dayu;
                  break;
                case '暴雨':
                  resultPic = baoyu;
                  break;
                case '多云':
                  resultPic = duoyun;
                    if(type == 2){
                        resultPic = ye_yin;
                    }
                  break;
                case '小雨':
                  resultPic = xiaoyu;
                  break;
                case '晴转多云'://6
                  resultPic = qing_duoyun;
                  break;
                case '晴'://7
                  resultPic = qing;
                    if(type == 2){
                        resultPic = ye_qing;
                    }
                  break;
                case '阵雨'://8
                  resultPic = duoyun_zhenyu;
                  break;
                case '打雷'://
                  resultPic = dalei;
                  break;
                case '打雷暴雨':
                  resultPic = dalei_baoyu;
                  break;
                case '大雪':
                  resultPic = daxue
                  break;
                case '雨夹雪':
                  resultPic = yujiaxue;
                  break;
                case '雷阵雨':
                  resultPic = leizhenyu;
                  break;
                default ://7
                  resultPic = qing;
            }
            return resultPic;
        }
        //获取天气数据
        function getWeatherStatus(){

            WebAPI.get('/dashboard/get_weather/1').done(function (rslt) {
                if(rslt){
                    var tempdata = rslt.data;
                    var weatherCrtCt='',weatherCrtPic='';
                    // 星期
                    var tempday = tempdata.forecast[0].date;
                    var day = tempday.substring(tempday.indexOf('星期'));
                    // 当前气温
                    var crtTemp = tempdata.wendu;
                    // 日期
                    var crtDate = new Date();
                    var _date = (crtDate.getMonth()+1)+'月' + crtDate.getDate()+'日';
                    //白天天气
                    var today = getWeatherPic(tempdata.forecast[0].type);
                    //白天气温
                    var todaytTemp= formatTemp(tempdata.forecast[0].high);
                    //夜间天气 2-->夜间
                    var tonight = getWeatherPic(tempdata.forecast[0].type, 2);
                    //夜间气温
                    var tonightTemp= formatTemp(tempdata.forecast[0].low);

                    weatherCrtCt = '<dl class="weathCrtDayCt" style="margin-left: 4%;"><dt class="weathCrtDay dtTop">'+ day +'</dt><dd class="weathCrtTemprt">'+ crtTemp +'℃</dd><dd class="ddBottom weatherDate"> '+ _date +'</dd></dl>';
                    weatherCrtPic = '<dl class="weathCrtDayPic" style="left:42%;">\
                                        <dt class="weathCrtToday dtTop">白 天</dt>\
                                        <dd class="temprtIconBig">'
                                            + today +
                                        '</dd>\
                                        <dd class="ddBottom">'+ todaytTemp +'</dd>\
                                    </dl>\
                                    <dl class="weathCrtDayPic" style="left:66%;">\
                                        <dt class="weathCrtToday dtTop">晚 上</dt>\
                                        <dd class="temprtIconBig">'
                                            + tonight +
                                        '</dd>\
                                        <dd class="ddBottom">' + tonightTemp +'</dd>\
                                    </dl>';
                    // 一周天气
                    var weatherStatus = '';
                    for(var i in tempdata.forecast){
                        if(i == 0)
                            continue;
                        var _day = tempdata.forecast[i].date.substring(tempdata.forecast[i].date.indexOf('日')+1);
                        var _tempArange = formatTemp(tempdata.forecast[i].high) + '/'+ formatTemp(tempdata.forecast[i].low);
                        var temp = '<dl class="weathFuture">\
                                        <dt>'+ _day +'</dt>\
                                        <dd>'
                                            + getWeatherPic(tempdata.forecast[i].type) +
                                        '</dd>\
                                        <dd> '+ _tempArange +'</dd>\
                                    </dl>';
                        weatherStatus += temp;
                    }
                }

                if(_this.isFirstRender){
                    _this.tempList = [];
                    _this. xData = [];
                    _this.chart = undefined;
                    if(rslt.tempHistory.length > 0){
                        for(var i = rslt.tempHistory.length-1; i > 0;  i--){
                            if(_this.xData.length < 12){
                                var time = rslt.tempHistory[i].time.replace(' GMT','')
                                time= time.toDate().getHours();
                                if(time != _this.xData[_this.xData.length-1]){
                                    _this.xData.unshift(parseInt(time));
                                    _this.tempList.unshift(rslt.tempHistory[i].temp);
                                }
                            }

                        }
                        while(_this.xData.length < 12){
                            var xMax = _this.xData[_this.xData.length-1];
                            if(new Date().getHours() > xMax){
                                _this.tempList.push(crtTemp);
                            }
                            if(xMax > 23){
                                _this.xData.push(0);
                            }else{
                                _this.xData.push(_this.xData[_this.xData.length-1]+1);
                            }
                        }
                        _this.isFirstRender = true;
                    }else{
                        _this.tempList.push(crtTemp);
                        var xDataFirst = new Date().getHours();
                        var tempXDataLen = _this.xData.length;
                        for(var i = 0; i < 12 - tempXDataLen; i++){
                            if(xDataFirst < 23){
                                _this.xData.push(xDataFirst++)
                            }else{
                                _this.xData.push(xDataFirst)
                                xDataFirst = 0;
                            }
                        }
                        _this.isFirstRender = false;
                    }
                    crtContainer.innerHTML = getDaysWeather(weatherCrtCt,weatherCrtPic,weatherStatus);
                     //温度列表
                    _this.optionChart = {
                                        title : {
                                            text: I18n.resource.dashboard.modalWeather.REAL_TIME_TEMPERATURE,
                                            y: 2,
                                            x: 38,
                                            textStyle:{
                                                color: '#5c5e62',
                                                fontFamily: 'Microsoft YaHei',
                                                fontSize: 12
                                            }
                                        },
                                        tooltip : {
                                            trigger: 'axis'
                                        },
                                        backgroundColor: '#f7f9fa',
                                        calculable : false,
                                        color:['#1abc9c'],
                                        xAxis : [
                                            {
                                                type : 'category',
                                                boundaryGap : true,
                                                splitLine : {
                                                    show:false
                                                },
                                                axisTick : {
                                                    show:false
                                                },
                                                data: (function(xData){
                                                    var arr = [];
                                                    for(var i = 0; i < xData.length; i++){
                                                        if(xData[i] < 10){
                                                            arr.push('0'+xData[i] + ':00')
                                                        }else{
                                                            arr.push(xData[i] + ':00')
                                                        }
                                                    }
                                                    return arr;
                                                })(_this.xData)//_this.xData
                                            }
                                        ],
                                        yAxis : [
                                            {
                                                type : 'value',
                                                splitNumber: 5,
                                                scale: true
                                            }
                                        ],
                                        grid:{
                                            height: '56%',
                                            width: '86%',
                                            y: 24,
                                            x: 60
                                        },
                                        series : [
                                            {
                                                type:'line',
                                                //symbol:'emptyCircle',
                                                smooth: true,
                                                data:_this.tempList
                                            }
                                        ]
                                    };
                    _this.chart = echarts.init(document.getElementById('modalWeatherChart'), AppConfig.chartTheme).setOption(_this.optionChart);

                }else{
                    $('.weatherWrap').html('<div>' + weatherCrtCt + weatherCrtPic+ '</div><div style="width: 50%;right:0;position: absolute;top:0">' + weatherStatus + '</div>');
                    var nowTime = new Date().getHours();
                    if(_this.xData[_this.tempList.length-1] < nowTime){
                        if(_this.chart.getSeries()[0].data.length > 11){
                            //_this.isFirstRender = true;
                            var xDataLabel = _this.xData[_this.xData.length-1]+1;
                            if(xDataLabel > 23){
                                xDataLabel = 0;
                            }
                            _this.xData.splice(0,1);
                            _this.xData.push(xDataLabel);
                            var xDataLabelFmt = xDataLabel + ':00';
                            if(xDataLabel <10){
                                xDataLabelFmt = '0'+ xDataLabelFmt;
                            }
                            _this.chart.addData([[0,rslt.data.wendu,false,false,xDataLabelFmt]]);
                            _this.tempList.splice(0,1);
                        }else{
                            _this.chart.addData([[0,rslt.data.wendu,false,true]]);
                        }
                        _this.tempList.push(rslt.data.wendu);
                    }
                }
            });


        }
        function getDaysWeather(weatherCrtCt,weatherCrtPic,weatherStatus){
            var str = '\
                                                <style>\
                                                 .weatherWrap{\
                                                    background: #fff;border-radius: 4px;height: 100%;position:relative;\
                                                }\
                                                .weatherWrap dl{\
                                                    display: inline-block;font-family: "Microsoft YaHei";text-align: center;height: 100%;\
                                                }\
                                                .weathCrtDayCt{\
                                                    width: 33%;position: absolute;top: 0;\
                                                }\
                                                .weathCrtDayCt *{\
                                                    position: absolute;left: 23%;\
                                                }\
                                                @media screen and (max-width: 1920px) {\
                                                    .weathFuture{width: 22%;margin-top: 14.5%;}\
                                                    .weathCrtDay, .weathCrtToday{margin-top: 4%;}\
                                                    .weathCrtDayPic dd svg {\
                                                        width: 100%;height: 100%;\
                                                    }\
                                                    .temprtIconBig{position: relative;top: 24%;left: -30%;}\
                                                }\
                                                @media screen and (max-width: 1366px) {\
                                                    .weathFuture{width: 24%;margin-top: 11%; }\
                                                    .temprtIconBig{position: relative;top: 24%;  left: -24%;}\
                                                }\
                                                @media screen and (max-height: 768px) {\
                                                    .weathCrtTemprt{top: 30% !important;left: 20% !important; font-size: 3rem !important; transform: scaley(1.2) !important;}\
                                                }\
                                                .weathCrtDayCt, .weatherDate{\
                                                    color: #009fe3;font-weight: 800;font-size: 18px;font-family: "Microsoft YaHei";\
                                                }\
                                                .weatherDate{\
                                                      left: 20% !important;\
                                                }\
                                                .weathCrtTemprt{\
                                                    font-size: 3rem;color: #009fe3;  top: 33%;left: 20%;  transform: scaley(1.3);\
                                                }\
                                                .weathCrtToday{\
                                                    color: #5c5e62;font-size: 18px;font-weight: 300;\
                                                }\
                                                .weathFuture dd svg g path{\
                                                    fill: #626262;\
                                                }\
                                                .weathFuture dd svg {\
                                                    width: 70%;height: 100%\
                                                }\
                                                .weathFuture *{\
                                                    color: #5c5e62;font-size: 12px;font-family: "Microsoft YaHei";\
                                                }\
                                                \.weathCrtDayPic{\
                                                    width: 30%;position: absolute;\
                                                }\
                                                .weathCrtDayPic > * {\
                                                    color: #5c5e62;font-size: 18px;font-family: "Microsoft YaHei";\
                                                }\
                                                .weatherWrap div{\
                                                    display: inline-block;width: 50%;position: relative;height:100%\
                                                }\
                                                .dtTop{  top:0; position: absolute;  }\
                                                .ddBottom{ bottom:0;  left: 5px;  position: absolute; }\
                                                </style>\
                                                <div style="width: 100%; height: 48%;">\
                                                <div class="weatherWrap">\
                                                    <div>'
                                                    + weatherCrtCt + weatherCrtPic+
                                                    '</div><div style="width: 50%;right:0;position: absolute;top:0">'
                                                    + weatherStatus +
                                                    '</div>'+
                                                '</div>\
                                                </div>\
                                                <div id="modalWeatherChart" style="width: 98%; height: 49%;margin: 1%;"></div>';
            return str;
        }
        this.container.style.background = '#fff';
        this.container.style.borderRadius = '4px';
    },

    ModalWeather.prototype.showConfigMode = function () {

    }

    return ModalWeather;
})();
var ModalEnergySaveRate = (function () {
    function ModalEnergySaveRate(screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    }

    ModalEnergySaveRate.prototype = new ModalBase();
    ModalEnergySaveRate.prototype.optionTemplate = {
        name: 'toolBox.modal.REAL_TIME_ENERGY_SAVE_RATE',
        parent: 0,
        mode: ['realTimeDashboard'],
        maxNum: 1,
        title: '',
        minHeight: 1,
        minWidth: 2,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalEnergySaveRate'
    };

    ModalEnergySaveRate.prototype.renderModal = function () {
        var _this = this;

        WebAPI.get('/static/scripts/spring/entities/modalEnergySaveRate.html').done(function (resultHtml) {
            _this.container.innerHTML = resultHtml;
            I18n.fillArea($('#energySaveName').parent());
        });
    },

    ModalEnergySaveRate.prototype.updateModal = function (points) {
        var show = parseFloat(points[0].data).toFixed(1).toString() + '%';
        $('#energySavePerVal').text(show);
        $('#progressItem').css('width', show);
    },

    ModalEnergySaveRate.prototype.showConfigMode = function () {
        var _this = this;
    },

    ModalEnergySaveRate.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };

    return ModalEnergySaveRate;
})();
var ModalCoalSaveTotal = (function () {
    function ModalCoalSaveTotal(screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    }

    ModalCoalSaveTotal.prototype = new ModalBase();
    ModalCoalSaveTotal.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_COAL_SAVE_TOTAL',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 1,
        title:'',
        minHeight:1,
        minWidth:2,
        maxHeight:6,
        maxWidth:12,
        type:'ModalCoalSaveTotal'
    };

    ModalCoalSaveTotal.prototype.renderModal = function () {
        this.container.innerHTML = template;
        I18n.fillArea($('#coalSaveName').parent());
    },

    ModalCoalSaveTotal.prototype.updateModal = function (points) {
        var show = parseFloat(points[0].data).toFixed(1).toString() + ' Ton';
        $('#coalSaveVal').text(show);
    },

    ModalCoalSaveTotal.prototype.showConfigMode = function () {
        var _this = this;
    },

    ModalCoalSaveTotal.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };

    var template = '<style type="text/css">\
        .frameCtl {position: relative;height: 100%;}\
        .imgBackground {position: absolute;width: 100%;height: 100%;right: 0;bottom: 0;top: 0;left: 0;z-index: -1;}\
        #coalSaveVal {position: absolute;left: 60px;top: 40px;width: 220px;font-size: 25px;font-weight: 500;color: #eeeeee;}\
        #coalSaveName {position: absolute;left: 60px;top: 80px;width: 220px;font-size: 25px;font-weight: 500;color: #eeeeee;}\
    </style>\
    <div class="frameCtl">\
        <img src="/static/images/spring/entities/modalCoalSaveTotal.png" class="imgBackground" alt="Background image">\
        <div id="coalSaveVal"> Ton</div>\
        <div id="coalSaveName" i18n="dashboard.carbonFootprint.STANDARD_COAL_SAVING"></div>\
    </div>';

    return ModalCoalSaveTotal;
})();
var ModalCo2SaveTotal = (function () {
    function ModalCo2SaveTotal(screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    }

    ModalCo2SaveTotal.prototype = new ModalBase();

    ModalCo2SaveTotal.prototype.optionTemplate = {
        name: 'toolBox.modal.REAL_TIME_CO2_SAVE_TOTAL',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 1,
        title:'',
        minHeight:1,
        minWidth:2,
        maxHeight:6,
        maxWidth:12,
        type:'ModalCo2SaveTotal'
    };

    ModalCo2SaveTotal.prototype.renderModal = function() {
        this.container.innerHTML = template;
        I18n.fillArea($('#co2Name').parent());
    },

    ModalCo2SaveTotal.prototype.updateModal= function (points) {
        var show = parseFloat(points[0].data).toFixed(1).toString() + ' Ton';
        $('#co2SaveVal').text(show);
    },

    ModalCo2SaveTotal.prototype.showConfigMode = function() {
        var _this = this;
    };

    ModalCo2SaveTotal.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    };

    var template = '<style type="text/css">\
        .frameCtl {position: relative;height: 100%;}\
        .imgBackground {position: absolute;width: 100%;height: 100%;right: 0;bottom: 0;top: 0;left: 0;z-index: -1;}\
        #co2SaveVal {position: absolute;left: 60px;top: 40px;width: 220px;font-size: 25px;font-weight: 500;color: #eeeeee;}\
        #co2Name {position: absolute;left: 60px;top: 80px;width: 220px;font-size: 25px;font-weight: 500;color: #eeeeee;}\
    </style>\
    <div class="frameCtl">\
        <img src="/static/images/spring/entities/modalCo2SaveTotal.png" class="imgBackground" alt="Background image">\
        <div id="co2SaveVal"></div>\
        <div id="co2Name" i18n="dashboard.carbonFootprint.CO2_SAVING"></div>\
    </div>';

    return ModalCo2SaveTotal;
})();

// ModalKPIConfig CLASS DEFINITION
var ModalKPIConfig = (function ($, window, undefined) {
    var _this;
    function ModalKPIConfig(options) {
        _this = this;
        // parameters
        this.options = $.extend({}, DEFAULTS, options);

        // DOM
        this.$wrap = null;

    }

    ModalKPIConfig.prototype.show = function () {
        var domPanelContent = document.getElementById('paneContent');
        // if there already has one "KPI Config" modal, do not load another one
        if($('#modalKPIConfigWrap').length > 0) {
            this.$modal.modal('show');
            return;
        }

        Spinner.spin(domPanelContent);
        // get the template from server
        WebAPI.get('/static/views/observer/widgets/modalKPIConfig.html').done(function (html) {
            Spinner.stop();
            _this.$wrap = $('<div class="modal-kpi-config-wrap" id="modalKPIConfigWrap">')
                .appendTo(domPanelContent).html(html);
            _this.$modal = _this.$wrap.children('.modal');
            _this.init();
            _this.$modal.modal('show');
        });
    };
    
    ModalKPIConfig.prototype.init = function () {
        // DOM
        this.$formWrap                 = $("#formWrap", this.$wrap);
        this.$btnClose                 = $('.close', this.$wrap);
        this.$btnWarnMode              = $('#btnWarnMode', this.$formWrap);
        this.$ulWarnMode               = $('#ulWarnMode', this.$formWrap);
        this.$btnWarnTimeMode          = $('#btnWarnTimeMode', this.$formWrap);
        this.$ulWarnTimeMode           = $('#ulWarnTimeMode', this.$formWrap);
        this.$btnPreWarnMode           = $('#btnPreWarnMode', this.$formWrap);
        this.$ulPreWarnMode            = $('#ulPreWarnMode', this.$formWrap);
        this.$btnPreWarnTimeMode       = $('#btnPreWarnTimeMode', this.$formWrap);
        this.$ulPreWarnTimeMode        = $('#ulPreWarnTimeMode', this.$formWrap);
        this.$btnDataCycleMode         = $('#btnDataCycleMode', this.$formWrap);
        this.$ulDataCycleMode          = $('#ulDataCycleMode', this.$formWrap);
        this.$btnStartMonth            = $('#btnStartMonth', this.$formWrap);
        this.$ulStartMonth             = $('#ulStartMonth', this.$formWrap);
        this.$btnHistoryValUsage       = $('#btnHistoryValUsage', this.$formWrap);
        this.$ulHistoryValUsage        = $('#ulHistoryValUsage', this.$formWrap);
        this.$btnPreHistoryValUsage    = $('#btnPreHistoryValUsage', this.$formWrap);
        this.$ulPreHistoryValUsage     = $('#ulPreHistoryValUsage', this.$formWrap);
        // form groups
        this.$fgWarnRange              = $('#fgWarnRange', this.$formWrap);
        this.$fgWarnTime               = $('#fgWarnTime', this.$formWrap);
        this.$fgWarnTimeRange          = $('#fgWarnTimeRange', this.$formWrap);
        this.$fgPreWarnRange           = $('#fgPreWarnRange', this.$formWrap);
        this.$fgPreWarnTime            = $('#fgPreWarnTime', this.$formWrap);
        this.$fgPreWarnTimeRange       = $('#fgPreWarnTimeRange', this.$formWrap);
        // form group items
        this.$fgiStartMonth            = $('#fgiStartMonth', this.$formWrap);
        // form field
        this.$iptChartName             = $('#iptChartName', this.$formWrap);
        this.$iptChartLowerLimit       = $('#iptChartLowerLimit', this.$formWrap);
        this.$iptChartUpperLimit       = $('#iptChartUpperLimit', this.$formWrap);
        this.$divTargetPoint           = $('#divTargetPoint', this.$formWrap);
        this.$divReferencePoint        = $('#divReferencePoint', this.$formWrap);
        this.$btnCondition             = $('#btnCondition', this.$formWrap);
        this.$iptConditionVal          = $('#iptConditionVal', this.$formWrap);
        this.$btnIsShowRC              = $('#btnIsShowRC', this.$formWrap);
        this.$iptLowerWarnVal          = $('#iptLowerWarnVal', this.$formWrap);
        this.$iptUpperWarnVal          = $('#iptUpperWarnVal', this.$formWrap);
        this.$iptPreGreaterThan        = $('#iptPreGreaterThan', this.$formWrap);
        this.$iptPreLessThan           = $('#iptPreLessThan', this.$formWrap);
        this.$iptWarnTimeRangeStart    = $('#iptWarnTimeRangeStart', this.$formWrap);
        this.$iptPreWarnTimeRangeStart = $('#iptPreWarnTimeRangeStart', this.$formWrap);
        // drop area
        this.$dropArea                 = $('.drop-area', this.$formWrap);
        // submit button
        this.$btnSubmit                = $('#btnSubmit', this.$wrap);

        this.attachEvents();
        this.initValidator();

        // initialize the datetimepicker
        $(".datetime").datetimepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayBtn: true,
            startView: 'year',
            minView: 'year',
            pickerPosition: 'top-right'
        });
    };

    ModalKPIConfig.prototype.initValidator = function () {

    };

    ModalKPIConfig.prototype.displayField = function (animArr, doAnim) {
        // every object in array is like: {$ele: [jQuery Object], action: 'show'/'hide'}
        var $animWrap = animArr[0].$ele.parent('.optional');
        var actionGroup = {$show: $(), $hide: $()};
        var showLen, curShowLen = $animWrap.children('.on').length;
        var $all;
        if(doAnim === undefined) doAnim = true;
        // group by 'action'
        for (var i = 0, len = animArr.length; i < len; i++) {
            actionGroup['$'+animArr[i].action] = actionGroup['$'+animArr[i].action].add(animArr[i].$ele);
        }
        showLen = actionGroup.$show.length;
        if(!doAnim) {
            actionGroup.$hide.removeClass('on').css('display', 'none');
            actionGroup.$show.addClass('on').css('display', '');
            $animWrap.height(49*showLen);
            return;
        }

        $all = actionGroup.$hide.add(actionGroup.$show).filter('.on');

        $all.filter('.on').eq(0).one('transitionend', function (e) {
            e = e.originalEvent;
            if(e.propertyName === 'opacity') {
                $all.css('display', 'none');
                if(showLen !== curShowLen) {
                    // do expend/collapse animation
                    $animWrap.height(49*showLen);
                    $animWrap.off('transitionend').on('transitionend', function (e) {
                        e = e.originalEvent;
                        if(e.propertyName === 'height') {
                            actionGroup.$show.css('display', '');
                            // use setTimeout to prevent the influence from 'display'
                            window.setTimeout(function () {
                                actionGroup.$show.addClass('on');
                            }, 0);
                        }
                        e.stopPropagation();
                    });
                } else {
                    actionGroup.$show.css('display', '');
                    // use setTimeout to prevent the influence from 'display'
                    window.setTimeout(function () {
                        actionGroup.$show.addClass('on');
                    }, 0);
                }
            }
            e.stopPropagation();
        });
        // do hide animation
        $all.removeClass('on');
    };

    // reset the modal
    ModalKPIConfig.prototype.reset = function (name) {
        var animArr = [];
        name = typeof name === 'string' ? [name] : name;

        if(!name) {
            this.$iptChartName.val('');
            this.$iptChartLowerLimit.val('');
            this.$iptChartUpperLimit.val('');
            this.$divTargetPoint.attr('data-value', '').html('<span class="glyphicon glyphicon-plus"></span>');
            this.$divReferencePoint.attr('data-value', '').html('<span class="glyphicon glyphicon-plus"></span>');
            this.$btnCondition.attr('data-value', 0).children('span').eq(0).text('Equal To (=)');
            this.$iptConditionVal.val('');

            this.$btnWarnMode.attr('data-value', 0).children('span').eq(0).text('From User Input');
            this.$btnHistoryValUsage.attr('data-value', 0).children('span').eq(0).text('Use As Lower Limit');
            this.$iptWarnTimeRangeStart.val('');
            this.$iptLowerWarnVal.val('');
            this.$iptUpperWarnVal.val('');

            this.$btnPreWarnMode.attr('data-value', 0).children('span').eq(0).text('From User Input');
            this.$iptPreGreaterThan.val('');
            this.$iptPreLessThan.val('');

            animArr = [];
            animArr.push({$ele: this.$fgWarnRange, action: 'show'});
            animArr.push({$ele: this.$fgWarnTime, action: 'hide'});
            animArr.push({$ele: this.$fgWarnTimeRange, action: 'hide'});
            this.displayField(animArr, false);

            animArr = [];
            animArr.push({$ele: this.$fgPreWarnRange, action: 'show'});
            animArr.push({$ele: this.$fgPreWarnTime, action: 'hide'});
            animArr.push({$ele: this.$fgPreWarnTimeRange, action: 'hide'});
            this.displayField(animArr, false);
        }
        

        // reset 'warn time' filed
        if(!name || name.indexOf('warn-time') > -1 ) {
            this.$btnWarnTimeMode.attr('data-value', 0);
            this.$btnWarnTimeMode.children('span').eq(0).text('From User Input');
            this.$btnHistoryValUsage.attr('data-value', 0);
            this.$btnHistoryValUsage.children('span').eq(0).text('Use As Lower Limit');
        }

        if(!name || name.indexOf('start-month') > -1 ) {
            this.$btnStartMonth.attr('data-value', '');
            this.$btnStartMonth.children('span').eq(0).text('Start Month');
        }

        if(!name || name.indexOf('pre-warn-time') > -1 ) {
            this.$btnPreWarnTimeMode.attr('data-value', 0);
            this.$btnPreWarnTimeMode.children('span').eq(0).text('From User Input');
        }
    };

    ModalKPIConfig.prototype.recoverForm = function (form) {
        var name, animArr = [], animArr2 = [];
        var _this = this;
        if(!form) return;
        this.$iptChartName.val(form.chartName);
        this.$iptChartLowerLimit.val(form.chartLowerLimit);
        this.$iptChartUpperLimit.val(form.chartUpperLimit);
        name = AppConfig.datasource.getDSItemById(form.targetPointId).alias;
        this.$divTargetPoint.attr({'data-value': form.targetPointId, 
                'title': name}).html('<span>'+name+'</span>');
        name = AppConfig.datasource.getDSItemById(form.referencePointId).alias;
        if(name) {
            this.$divReferencePoint.attr({'data-value': form.referencePointId, 
                'title': name}).html('<span>'+name+'</span>');
        }
        
        this.$btnCondition.attr('data-value', form.referenceCondition).children('span').eq(0).text(form.referenceConditionName);
        this.$iptConditionVal.val(form.referenceConditionVal);
        this.$btnDataCycleMode.attr('data-value', form.dataCycleMode).children('span').eq(0).text(form.dataCycleModeName);

        this.$btnWarnMode.attr('data-value', form.warnMode).children('span').eq(0).text(form.warnModeName);
        this.$btnWarnTimeMode.attr('data-value', form.warnTimeMode).children('span').eq(0).text(form.warnTimeModeName);
        this.$btnHistoryValUsage.attr('data-value', form.historyValUsage).children('span').eq(0).text(form.historyValUsageName);
        this.$iptWarnTimeRangeStart.val(form.warnTimeRangeStart);
        if(form.warnMode === 1) {
            animArr.push({$ele: this.$fgWarnRange, action: 'hide'});
            animArr.push({$ele: this.$fgWarnTime, action: 'show'});
            if(form.warnTimeMode === 0) {
                animArr.push({$ele: this.$fgWarnTimeRange, action: 'show'});
            } else {
                animArr.push({$ele: this.$fgWarnTimeRange, action: 'hide'});
            }
            window.setTimeout(function () {
                _this.displayField(animArr);
            }, 1200);
        }

        this.$iptLowerWarnVal.val(form.warnLowerLimit);
        this.$iptUpperWarnVal.val(form.warnUpperLimit);
        this.$btnPreWarnMode.attr('data-value', form.preWarnMode).children('span').eq(0).text(form.preWarnModeName);
        this.$iptPreGreaterThan.val(form.preGreaterThan);
        this.$iptPreLessThan.val(form.preLessThan);
        this.$btnPreWarnTimeMode.attr('data-value', form.preWarnTimeMode).children('span').eq(0).text(form.preWarnTimeModeName);
        this.$btnPreHistoryValUsage.attr('data-value', form.preHistoryValUsage).children('span').eq(0).text(form.preHistoryValUsageName);
        this.$iptPreWarnTimeRangeStart.val(form.preWarnTimeRangeStart);
        if(form.preWarnMode === 1) {
            animArr2.push({$ele: this.$fgPreWarnRange, action: 'hide'});
            animArr2.push({$ele: this.$fgPreWarnTime, action: 'show'});
            if(form.preWarnTimeMode === 0) {
                animArr2.push({$ele: this.$fgPreWarnTimeRange, action: 'show'});
            } else {
                animArr2.push({$ele: this.$fgPreWarnTimeRange, action: 'hide'});
            }
            window.setTimeout(function () {
                _this.displayField(animArr2);
            }, 1200);
        }
    };

    // update this.options by the specified options
    ModalKPIConfig.prototype.setOptions = function (options) {
        this.options = $.extend({}, this.options, options);
    };

    ModalKPIConfig.prototype.attachEvents = function () {
        /////////////////////////////////
        // all dropdown selected event //
        /////////////////////////////////
        $('.dropdown-menu', this.$wrap).off('click.selected').on('click.selected', 'a', function (e) {
            var $this = $(this);
            var $btn = $this.parents('.dropdown-wrap').children('button');
            var value = $this.attr('data-value');
            var text = $this.text();

            $btn.attr('data-value', value);
            $btn.children('span').eq(0).text(text);

            e.preventDefault();
        });

        ////////////////////////////
        // modal show/hide events //
        ////////////////////////////
        this.$modal.off('show.bs.modal').on('show.bs.modal', function (e) {
            var $rightCt;
            if(e.namespace !== 'bs.modal') return true;
            $rightCt = $('#rightCt');
            // recover the form
            _this.recoverForm(_this.options.modalIns.entity.modal.option);
            // show the data soucre panel
            if(!$rightCt.hasClass('rightCtOpen')) $rightCt.click();
        });
        this.$modal.off('hide.bs.modal').on('hide.bs.modal', function (e) {
            var $rightCt;
            if(e.namespace !== 'bs.modal') return true;
            $rightCt = $('#rightCt');
            // reset the form state
            _this.reset();
            // hide the data soucre panel
            if($rightCt.hasClass('rightCtOpen')) $rightCt.click();
        });

        ////////////////////////////
        // field hide/show EVENTS //
        ////////////////////////////
        this.$ulWarnMode.find('a').off().on('click', function (e) {
            var value = parseInt($(this).attr('data-value'));
            var lastValue = parseInt(_this.$btnWarnMode.attr('data-value'));
            var animArr = [];

            // if current value equal to last value, do not do anything
            if(value === lastValue) return;
            _this.$btnWarnMode.attr('data-value', value);

            // display hiden/shown field
            if(value === 0) {
                animArr.push({$ele: _this.$fgWarnRange, action: 'show'});
                animArr.push({$ele: _this.$fgWarnTime, action: 'hide'});
                animArr.push({$ele: _this.$fgWarnTimeRange, action: 'hide'});
            } else {
                // reset
                _this.reset(['warn-time']);
                animArr.push({$ele: _this.$fgWarnRange, action: 'hide'});
                animArr.push({$ele: _this.$fgWarnTime, action: 'show'});
                animArr.push({$ele: _this.$fgWarnTimeRange, action: 'show'});
            }
            _this.displayField(animArr);
        });
        this.$ulWarnTimeMode.find('a').off().on('click', function (e) {
            var value = parseInt($(this).attr('data-value'));
            var lastValue = parseInt(_this.$btnWarnTimeMode.attr('data-value'));
            var animArr = [];

            // if current value equal to last value, do not do anything
            if(value === lastValue) return;
            _this.$btnWarnTimeMode.attr('data-value', value);

            // display hiden/shown field
            if(value === 0) {
                animArr.push({$ele: _this.$fgWarnRange, action: 'hide'});
                animArr.push({$ele: _this.$fgWarnTime, action: 'show'});
                animArr.push({$ele: _this.$fgWarnTimeRange, action: 'show'});
            } else {
                animArr.push({$ele: _this.$fgWarnRange, action: 'hide'});
                animArr.push({$ele: _this.$fgWarnTime, action: 'show'});
                animArr.push({$ele: _this.$fgWarnTimeRange, action: 'hide'});
            }
            _this.displayField(animArr);
        });
        this.$ulPreWarnMode.find('a').off().on('click', function (e) {
            var value = parseInt($(this).attr('data-value'));
            var lastValue = parseInt(_this.$btnPreWarnMode.attr('data-value'));
            var animArr = [];

            // if current value equal to last value, do not do anything
            if(value === lastValue) return;
            _this.$btnPreWarnMode.attr('data-value', value);

            // display hiden/shown field
            if(value === 0) {
                animArr.push({$ele: _this.$fgPreWarnRange, action: 'show'});
                animArr.push({$ele: _this.$fgPreWarnTime, action: 'hide'});
                animArr.push({$ele: _this.$fgPreWarnTimeRange, action: 'hide'});
            } else {
                // reset
                _this.reset('pre-warn-time');
                animArr.push({$ele: _this.$fgPreWarnRange, action: 'hide'});
                animArr.push({$ele: _this.$fgPreWarnTime, action: 'show'});
                animArr.push({$ele: _this.$fgPreWarnTimeRange, action: 'show'});
            }
            _this.displayField(animArr);
        });
        this.$ulPreWarnTimeMode.find('a').off().on('click', function (e) {
            var value = parseInt($(this).attr('data-value'));
            var lastValue = parseInt(_this.$btnPreWarnTimeMode.attr('data-value'));
            var animArr = [];

            // if current value equal to last value, do not do anything
            if(value === lastValue) return;
            _this.$btnPreWarnTimeMode.attr('data-value', value);

            // display hiden/shown field
            if(value === 0) {
                animArr.push({$ele: _this.$fgPreWarnRange, action: 'hide'});
                animArr.push({$ele: _this.$fgPreWarnTime, action: 'show'});
                animArr.push({$ele: _this.$fgPreWarnTimeRange, action: 'show'});
            } else {
                animArr.push({$ele: _this.$fgPreWarnRange, action: 'hide'});
                animArr.push({$ele: _this.$fgPreWarnTime, action: 'show'});
                animArr.push({$ele: _this.$fgPreWarnTimeRange, action: 'hide'});
            }
            _this.displayField(animArr);
        });
        this.$ulDataCycleMode.find('a').off().on('click', function (e) {
            var value = parseInt($(this).attr('data-value'));
            var lastValue = parseInt(_this.$btnDataCycleMode.attr('data-value'));
            var lastMonth, lastMonth2, nowMonth, lang, arrHtml = [];
            var liTmpl = '<li><a href="javascript:;" data-value="{0}">{1}</a></li>';
            
            // if current value equal to last value, do not do anything
            if(value === lastValue) return;
            _this.$btnDataCycleMode.attr('data-value', value);


            if(value === 0) _this.$fgiStartMonth.removeClass('on');
            else {
                lang = I18n.type
                // get "start months" options
                nowMonth = DateUtil.getNextMonth(new Date().getMonth());
                lastMonth = DateUtil.getLastMonth(nowMonth);
                lastMonth2 = DateUtil.getLastMonth(lastMonth);
                // get html
                arrHtml.push(liTmpl.format(lastMonth2, DateUtil.getMonthNameShort(lastMonth2-1, lang)));
                arrHtml.push(liTmpl.format(lastMonth, DateUtil.getMonthNameShort(lastMonth-1, lang)));
                arrHtml.push(liTmpl.format(nowMonth, DateUtil.getMonthNameShort(nowMonth-1, lang)));
                _this.$ulStartMonth.html(arrHtml.join(''));
                // reset button value and text
                _this.reset('start-month');

                _this.$fgiStartMonth.addClass('on');
            }
        });

        ///////////////////////
        // point Drop EVENTS //
        ///////////////////////
        this.$dropArea.off('dragover').on('dragover', function (e) {
            e.preventDefault();
        });
        this.$dropArea.off('dragenter').on('dragenter', function (e) {
            $(e.target).addClass('on');
            e.preventDefault();
            e.stopPropagation();
        });
        this.$dropArea.off('dragleave').on('dragleave', function (e) {
            $(e.target).removeClass('on');
            e.stopPropagation();
        });
        this.$dropArea.off('drop').on('drop', function (e) {
            var itemId = EventAdapter.getData().dsItemId;
            var $target = $(e.target);
            var name;
            if(!itemId) return;
            $target.removeClass('on');
            name = AppConfig.datasource.getDSItemById(itemId).alias;
            $target.attr({'data-value': itemId, 'title': name});
            $target.html('<span>'+name+'</span>');
            e.stopPropagation();
        });

        //////////////////
        // submit EVENT //
        //////////////////
        this.$btnSubmit.off().click(function () {
            // validation
            var form = {};

            //////////////////
            // Base Options //
            //////////////////
            form.chartName              = _this.$iptChartName.val();
            form.chartLowerLimit        = parseFloat(_this.$iptChartLowerLimit.val());
            form.chartUpperLimit        = parseFloat(_this.$iptChartUpperLimit.val());
            ///////////////////
            // Point Options //
            ///////////////////
            form.targetPointId          = _this.$divTargetPoint.attr('data-value');
            form.referencePointId       = _this.$divReferencePoint.attr('data-value');
            form.referenceCondition     = parseInt(_this.$btnCondition.attr('data-value'));
            form.referenceConditionName = _this.$btnCondition.children('span').eq(0).text();
            form.referenceConditionVal  = parseFloat(_this.$iptConditionVal.val());
            ////////////////
            // Data Cycle //
            ////////////////
            // 0-Monthly, 1-Quarterly
            form.dataCycleMode          = parseInt(_this.$btnDataCycleMode.attr('data-value'));
            form.dataCycleModeName      = _this.$btnDataCycleMode.children('span').eq(0).text();
            form.btnStartMonth          = _this.$btnStartMonth.attr('data-value');
            ////////////////
            // Warn Range //
            ////////////////
            // 0-user input, 1-history
            form.warnMode               = parseInt(_this.$btnWarnMode.attr('data-value'));
            form.warnModeName           = _this.$btnWarnMode.children('span').eq(0).text();
            // 0-show, 1-hide
            form.isShowRC               = parseInt(_this.$btnIsShowRC.attr('data-value'));
            form.isShowRCName           = _this.$btnIsShowRC.children('span').eq(0).text();
            form.warnLowerLimit         = parseFloat(_this.$iptLowerWarnVal.val());
            form.warnUpperLimit         = parseFloat(_this.$iptUpperWarnVal.val());
            // 0-user input, 1-history
            form.warnTimeMode           = parseInt(_this.$btnWarnTimeMode.attr('data-value'));
            form.warnTimeModeName       = _this.$btnWarnTimeMode.children('span').eq(0).text();
            // 0-use as lower, 1-use as upper
            form.historyValUsage        = parseInt(_this.$btnHistoryValUsage.attr('data-value'));
            form.historyValUsageName    = _this.$btnHistoryValUsage.children('span').eq(0).text();
            // start date
            form.warnTimeRangeStart     = _this.$iptWarnTimeRangeStart.val();
            
            ////////////////////
            // Pre-Warn Range //
            ////////////////////
            // 0-user input, 1-history
            form.preWarnMode            = parseInt(_this.$btnPreWarnMode.attr('data-value'));
            form.preWarnModeName        = _this.$btnPreWarnMode.children('span').eq(0).text();
            form.preGreaterThan         = parseFloat(_this.$iptPreGreaterThan.val());
            form.preLessThan            = parseFloat(_this.$iptPreLessThan.val());
            // 0-user input, 1-history
            form.preWarnTimeMode        = parseInt(_this.$btnPreWarnTimeMode.attr('data-value'));
            form.preWarnTimeModeName    = _this.$btnPreWarnTimeMode.children('span').eq(0).text();
            // 0-use as lower, 1-use as upper
            form.preHistoryValUsage     = parseInt(_this.$btnPreHistoryValUsage.attr('data-value'));
            form.preHistoryValUsageName = _this.$btnPreHistoryValUsage.children('span').eq(0).text();
            // start date
            form.preWarnTimeRangeStart  = _this.$iptPreWarnTimeRangeStart.val();

            // save to modal
            _this.options.onSubmit.call(_this.options.modalIns, form);

            // close
            _this.$btnClose.trigger('click');
        });
    };

    ModalKPIConfig.prototype.detachEvents = function () { };

    ModalKPIConfig.prototype.destroy = function () {
        this.detachEvents();
        this.$wrap.remove();
    };

    //////////////
    // DEFAULTS //
    //////////////
    var DEFAULTS = {};

    return ModalKPIConfig;
} (jQuery, window));

// ModalKPIChart CLASS DEFINITION
var ModalKPIChart = (function ($) {

    var PRECISION = 2;

    function ModalKPIChart (screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this._render, null, this._showConfig);
        
        // options
        this.options = $.extend(true, {}, DEFAULTS);
        this.historyChartOptions = $.extend(true, {}, HISTORY_CHART_DEFAULTS);

        // params
        this.startline = null;
        this.endline = null;
        this.targetPointData = null;
        this.referencePointData = null;
        this.refreshTimesInOneHour = 1;
        this.period = null;

        // indicators
        this.indicators = {};
        this.samplingPeriod = {
            format: 'h1',
            value2ms: 3600000
        };

        // chart
        this.historyChart = null;

        // DOM
        this.$lkUpdateTime = null;

        // trace
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    }

    // all I need is ModalBase.prototype
    ModalKPIChart.prototype = Object.create(ModalBase.prototype);
    // recover the constructor
    ModalKPIChart.prototype.constructor = ModalKPIChart;

    ModalKPIChart.prototype.optionTemplate = {
        name: 'toolBox.modal.REAL_TIME_KPI_CHART',
        parent: 0,
        mode: 'custom',
        maxNum: 1,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalKPIChart'
    };

    ModalKPIChart.prototype.init = function () {
        var $panel = $(this.container).closest('.panel');
        // add 'update time' info
        this.$lkUpdateTime = $('<div class="lk-update-time" title="Last Update Time"><span class="glyphicon glyphicon-time"></span><span>updating...</span></div>')
            .appendTo($panel);
    };

    // render the chart
    ModalKPIChart.prototype._render = function () {
        var _this = this;
        var option = this.entity.modal.option;
        // chart options
        var min = option.chartLowerLimit || 0;
        var max = option.chartUpperLimit || 100;
        var warnMode = option.warnMode;
        var warnLower = option.warnLowerLimit;
        var warnUpper = option.warnUpperLimit;
        var preWarnMode = option.preWarnMode;
        var preWarnLower = warnLower + option.preGreaterThan;
        var preWarnUpper = warnUpper - option.preLessThan;
        var historyValUsage = option.historyValUsage;
        // point options
        var targetPointId = option.targetPointId;
        var referencePointId = option.referencePointId;
        // data cycle mode
        var dataCycleMode = option.dataCycleMode;
        var period = this.period = this.getTimePeriod();

        var postData;
        var ids = referencePointId ? [targetPointId, referencePointId] : [targetPointId];
        
        postData = [{
            dsItemIds: ids,
            timeStart: period.nowStart,
            timeEnd: period.nowEnd,
            timeFormat: this.samplingPeriod.format
        }];

        if(warnMode === 1) {
            postData.push({
                dsItemIds: ids,
                timeStart: period.refStart,
                timeEnd: period.refEnd,
                timeFormat: this.samplingPeriod.format
            });
        }

        this.init();

        // initialize series
        this.options.series[0].data[0].value = min;
        this.options.series[0].min = min;
        this.options.series[0].max = max;
        this.historyChartOptions.yAxis[0].min = min;
        this.historyChartOptions.yAxis[0].max = max;
        // initialize tooltip
        this.options.tooltip.formatter = function (p) {
            return p.seriesName+': <strong>'+p.value+'</strong><br/>From: '+ 
                _this.store.timeShaft[0] + '<br/>To: '+ _this.store.timeShaft[_this.store.timeShaft.length-1];
        };

        this.spinner.spin(this.container);
        WebAPI.post('/analysis/startWorkspaceDataGenHistogramMulti', postData)
            .done(function (rs) {
                var axisColor = _this.options.series[0].axisLine.lineStyle.color;
                var range = max - min;
                var maxIndex;
                _this.store = {list: {}, timeShaft: rs[0].timeShaft};

                // format the array to map
                for (var i = 0, len = rs[0].list.length; i < len; i++) {
                    _this.store.list[rs[0].list[i].dsItemId] = rs[0].list[i].data;
                }

                if(rs[1] !== undefined) {
                    _this.store2 = {list: {}, timeShaft: rs[1].timeShaft};
                    for (i = 0, len = rs[1].list.length; i < len; i++) {
                        _this.store2.list[rs[1].list[i].dsItemId] = rs[1].list[i].data;
                    }
                }

                // filter target point data by reference point data
                _this.filterPointData();
                _this.initIndicators();
                _this.setTimeParams();

                maxIndex = _this.store.fullTimeShaft.length - 1;
                if(warnMode === 0) {
                    if(warnLower !== undefined && (warnLower-min) > 0){
                        axisColor.push([(warnLower-min)/range, '#ff4500']);
                        _this.historyChartOptions.series[0].markLine.data.push([
                            {name: 'Lower Warn Line', value: warnLower, xAxis: 0, yAxis: warnLower, itemStyle:{normal:{color:'#ff4500', lineStyle:{type:'solid'}}}},
                            {xAxis: _this.store.deadline, yAxis: warnLower}
                        ]);
                    } 
                    if(preWarnLower !== undefined && (preWarnLower-min) > 0) {
                        axisColor.push([(preWarnLower-min)/range, 'orange']);
                        _this.historyChartOptions.series[0].markLine.data.push([
                            {name: 'Lower Pre-Warn Line', value: preWarnLower, xAxis: 0, yAxis: preWarnLower, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                            {xAxis: _this.store.deadline, yAxis: preWarnLower}
                        ]);
                    }
                    if(preWarnUpper !== undefined && (preWarnUpper-min) > 0) {
                        axisColor.push([(preWarnUpper-min)/range, 'lightgreen']);
                        _this.historyChartOptions.series[0].markLine.data.push([
                            {name: 'Upper Pre-Warn Line', value: preWarnUpper, xAxis: 0, yAxis: preWarnUpper, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                            {xAxis: maxIndex, yAxis: preWarnUpper}
                        ]);
                    } 
                    if(warnUpper !== undefined && (warnUpper-min) > 0) {
                        axisColor.push([(warnUpper-min)/range, 'orange']);
                        _this.historyChartOptions.series[0].markLine.data.push([
                            {name: 'Upper Warn Line', value: warnUpper, xAxis: 0, yAxis: warnUpper, itemStyle:{normal:{color:'#ff4500', lineStyle:{type:'solid'}}}},
                            {xAxis: maxIndex, yAxis: warnUpper}
                        ]);
                    }
                    axisColor.push([1, '#ff4500']);
                }
                // if use history, calculate the markLine position
                else {
                    // use as warn lower limit
                    if(historyValUsage === 0) {
                        axisColor.push([(_this.indicators.average2-min)/range, '#ff4500']);

                        if(preWarnMode === 0) {
                            preWarnLower = _this.indicators.average2 + option.preGreaterThan;
                            if( preWarnLower !== undefined && (preWarnLower-min) > 0 ) {
                                axisColor.push([(preWarnLower-min)/range, 'orange']);
                                _this.historyChartOptions.series[0].markLine.data.push([
                                    {name: 'Lower Pre-Warn Line', value: preWarnLower.toFixed(PRECISION), xAxis: 0, yAxis: preWarnLower, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                                    {xAxis: _this.store.deadline, yAxis: preWarnLower}
                                ]);
                            }
                        } else if(preWarnMode === 1 && _this.indicators.preWarnValue > _this.indicators.average2) {
                            axisColor.push([(_this.indicators.preWarnValue-min)/range, 'orange']);
                            _this.historyChartOptions.series[0].markLine.data.push([
                                {name: 'Lower Pre-Warn Line', value: _this.indicators.preWarnValue.toFixed(PRECISION), xAxis: 0, yAxis: _this.indicators.preWarnValue, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                                {xAxis: _this.store.deadline, yAxis: _this.indicators.preWarnValue}
                            ]);
                        }
                        axisColor.push([1, 'lightgreen']);

                        _this.historyChartOptions.series[0].markLine.data.push([
                            {name: 'Lower Warn Line', value: _this.indicators.average2.toFixed(PRECISION), xAxis: 0, yAxis: _this.indicators.average2, itemStyle:{normal:{color:'#ff4500', lineStyle:{type:'solid'}}}},
                            {xAxis: _this.store.deadline, yAxis: _this.indicators.average2}
                        ]);

                    }
                    // use as upper limit
                    else {
                        // from user input
                        if(preWarnMode === 0) {
                            preWarnUpper = _this.indicators.average2 - option.preLessThan;
                            if(preWarnUpper !== undefined && (preWarnUpper-min) > 0) {
                                axisColor.push([(preWarnUpper-min)/range, 'lightgreen']);
                                axisColor.push([(_this.indicators.average2-min)/range, 'orange']);
                                _this.historyChartOptions.series[0].markLine.data.push([
                                    {name: 'Upper Pre-Warn Line', value: preWarnUpper.toFixed(PRECISION), xAxis: 0, yAxis: preWarnUpper, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                                    {xAxis: _this.store.deadline, yAxis: preWarnUpper}
                                ]);
                            }
                        } else if(preWarnMode === 1 && _this.indicators.preWarnValue < _this.indicators.average2) {
                            axisColor.push([(_this.indicators.preWarnValue-min)/range, 'lightgreen']);
                            axisColor.push([(_this.indicators.average2-min)/range, 'orange']);
                            _this.historyChartOptions.series[0].markLine.data.push([
                                {name: 'Upper Pre-Warn Line', value: _this.indicators.preWarnValue.toFixed(PRECISION), xAxis: 0, yAxis: _this.indicators.preWarnValue, itemStyle:{normal:{color:'orange', lineStyle:{type:'solid'}}}},
                                {xAxis: _this.store.deadline, yAxis: _this.indicators.preWarnValue}
                            ]);
                        } else {
                            axisColor.push([(_this.indicators.average2-min)/range, 'lightgreen']);
                        }
                        
                        axisColor.push([1, '#ff4500']);
                        _this.historyChartOptions.series[0].markLine.data.push([
                            {name: 'Upper Warn Line', value: _this.indicators.average2.toFixed(PRECISION), xAxis: 0, yAxis: _this.indicators.average2, itemStyle:{normal:{color:'#ff4500', lineStyle:{type:'solid'}}}},
                            {xAxis: _this.store.deadline, yAxis: _this.indicators.average2}
                        ]);
                    }
                }

                // 自适应
                _this.fitContainer();
                var cha = echarts.init(_this.container, AppConfig.chartTheme);
                cha.clear();
                _this.chart = cha.setOption(_this.options);
                _this.reloadChart();

                // _this.chart.hideLoading();

            }).always(function () {
                _this.spinner.stop();
            });
    };

    ModalKPIChart.prototype.filterPointData = function () {
        var option = this.entity.modal.option;
        var warnMode = option.warnMode;
        var cond = option.referenceCondition;
        var condVal = option.referenceConditionVal;
        var tPoints = null, rPoints = null;

        // don't filter if the referencePointId is not specified
        if(!option.referencePointId) return;

        tPoints = this.store.list[option.targetPointId];
        rPoints = this.store.list[option.referencePointId];
        // if the tPoints.length !== rPoints.length, we can't deal with this suitation :-(
        if(tPoints.length !== rPoints.length) return;
        for (var i = 0, len = rPoints.length; i < len; i++) {
            // turn int to float
            tPoints[i] = parseFloat(tPoints[i]);
            rPoints[i] = parseFloat(rPoints[i]);
            if(!this.isPointRuled(rPoints[i], condVal, cond)) {
                tPoints[i] = '-';
            }
        }
        // reference point data only used once, so we delete it to save memories
        // delete this.store.list[option.referencePointId];

        // filter history data
        if(warnMode === 1) {
            tPoints = this.store2.list[option.targetPointId];
            rPoints = this.store2.list[option.referencePointId];
            if(tPoints.length !== rPoints.length) return;
            for (var i = 0, len = rPoints.length; i < len; i++) {
                // turn int to float
                tPoints[i] = parseFloat(tPoints[i]);
                rPoints[i] = parseFloat(rPoints[i]);
                if(!this.isPointRuled(rPoints[i], condVal, cond)) {
                    tPoints[i] = '-';
                }
            }
            // delete this.store2.list[option.referencePointId];
        }
        
    };

    ModalKPIChart.prototype.isPointRuled = function (pointVal, condVal, cond) {
        if(condVal === null) return true;
        switch(cond) {
            // '==='
            case 0:
                return pointVal === condVal;
            // '<'
            case 1:
                return pointVal < condVal;
            // '>'
            case 2:
                return pointVal > condVal;
            default:
                return true;
        }
    };

    ModalKPIChart.prototype.setAnimation = function () {
        var option = this.entity.modal.option;
        var warnMode = option.warnMode;
        var historyValUsage = option.historyValUsage;
        var warnLower = option.warnLowerLimit;
        var warnUpper = option.warnUpperLimit;
        var preWarnLower = warnLower + option.preGreaterThan;
        var preWarnUpper = warnUpper - option.preLessThan;
        var $parent = $(this.container).parents('.panel');
        var curVal = this.indicators.average;
        // reset
        $parent.removeClass('warn-anim pre-warn-anim');
        if(warnMode === 1) {
            if( (historyValUsage === 0 && curVal < this.indicators.average2) ||
                (historyValUsage === 1 && curVal > this.indicators.average2)) {
                $parent.addClass('warn-anim');
            }
        } else {
            switch (true) {
                case curVal < preWarnLower:
                    $parent.addClass('pre-warn-anim');
                    break;
                case curVal  < warnLower:
                    $parent.addClass('warn-anim');
                    break;
                case curVal  < preWarnUpper: break;
                case curVal  < warnUpper:
                    $parent.addClass('pre-warn-anim');
                    break;
                default:
                    $parent.addClass('warn-anim');
                    break;
            }
        }
        
    };

    // update the chart
    ModalKPIChart.prototype.update = function (rs) {
        var option = this.entity.modal.option;
        var targetPointId = option.targetPointId;
        var referencePointId = option.referencePointId;
        var targetPointData, referencePointData;

        var lastTick, nowTick;

        // if store object is null, the first load is pending or failed
        // do not do anything
        if(!this.store) return;

        // get the last tick, and move after 5 minutes
        lastTick = this.store.timeShaft[this.store.timeShaft.length-1];
        lastTick = lastTick.toDate().valueOf() + 60000;
        nowTick = new Date().valueOf();
        // only now time greater than lastTick time, we do update
        if( nowTick < lastTick) {
            return;
        }

        for (var i = 0, len = rs.length; i < len; i++) {
            if(targetPointId === rs[i].dsItemId) {
                targetPointData = parseFloat(rs[i].data);
            }
            if(referencePointId === rs[i].dsItemId) {
                referencePointData = parseFloat(rs[i].data);
            }
        }

        if(isNaN(targetPointData)) return;

        this.appendData(targetPointData, referencePointData);

        // reload the chart
        this.reloadChart();
    };

    ModalKPIChart.prototype.reloadChart = function () {
        this.options.series[0].data[0].value = this.indicators.average.toFixed(PRECISION);
        this.chart.setSeries(this.options.series, true);
        this.setAnimation();

        // set update time
        this.$lkUpdateTime.children('span').eq(1).text(new Date().format('HH:mm'));
    };

    // show config mode
    ModalKPIChart.prototype._showConfig = function () {
        // this.chart.dispose();
    };

    ModalKPIChart.prototype.showConfigModal = function (container, options) {
        this.configModal.setOptions({modalIns: this});
        this.configModal.show();
    };

    ModalKPIChart.prototype.setOptions = function (options) {
        this.options = $.extend({}, this.opitons, options);
    };

    ModalKPIChart.prototype.destroy = function () {
    };

    ModalKPIChart.prototype.saveConfig = function (form) {
        this.entity.modal.title = form.chartName;
        this.entity.modal.points = [form.targetPointId];
        if(form.referencePointId) this.entity.modal.points.push(form.referencePointId);
        this.entity.modal.option = form;
        this.entity.modal.interval = 60000;
    };

    ModalKPIChart.prototype.configModal = new ModalKPIConfig({onSubmit: function (form) { this.saveConfig(form); }});

    ModalKPIChart.prototype.getTimePeriod = function () {
        var now;
        var period = {};
        var option = this.entity.modal.option;
        var warnMode = option.warnMode;
        var historyValUsage = option.historyValUsage;
        var warnStart = option.warnTimeRangeStart;
        var warnTimeMode = option.warnTimeMode;
        var startDate = option.warnTimeRangeStart;
        var circleMode = option.dataCycleMode;
        var startMonth;

        if (!this.m_bIsGoBackTrace) {
            now = new Date();
            this.DEFAULTS = true;
            this.HISTORY_CHART_DEFAULTS = true;
        }
        else {
            now = this.m_traceData.currentTime;
            this.DEFAULTS = false;
            this.HISTORY_CHART_DEFAULTS = false;
        }

        // monthly
        if(circleMode === 0) {
            period.nowStart = now.format('yyyy-MM-01 00:00:00');
            period.nowEnd = now.format('yyyy-MM-dd HH:mm:ss');
            
            // if warnMode is 0, we need not to continue
            if(warnMode === 0) return period;

            // calculate history start date
            if(warnTimeMode === 0) {
                period.refStart = warnStart.toDate().format('yyyy-MM');
                period.refEnd = period.refStart + '-' + DateUtil.daysInMonth(period.refStart.toDate()) + ' 23:59:59';
                period.refStart += '-01 00:00:00';
            } else {
                period.refStart = (now.format('yyyy')-1) + now.format('-MM');
                // deal with leap year
                period.refEnd = period.refStart + '-' + DateUtil.daysInMonth(period.refStart.toDate()) + ' 23:59:59';
                period.refStart += '-01 00:00:00';
            }
            period.lag = period.nowStart.toDate().valueOf() - period.refStart.toDate().valueOf();
        }
        // quarterly
        else {

        }

        return period;
    };

    ModalKPIChart.prototype.initIndicators = function () {
        var option = this.entity.modal.option;
        var warnMode = option.warnMode;
        var preWarnMode = option.preWarnMode;
        var dsId = option.targetPointId;
        var data = this.store.list[dsId];
        var average = 0, sum = 0;
        var list1, list2;

        // AVERAGE INDICATOR
        for (var i = 0, len = data.length; i < len; i++) {
            if(isNaN(data[i])) continue;
            average += data[i]*1;
        };
        // if average is NaN
        if(isNaN(average)) this.indicators.average = this.entity.modal.option.chartLowerLimit;
        else this.indicators.average = average / len;

        // history data
        if(warnMode === 1) {
            average = 0;
            data = this.store2.list[dsId];
            for (var i = 0, len = data.length; i < len; i++) {
                if(isNaN(parseFloat(data[i]))) continue;
                average += data[i]*1;
            };
            // if average is NaN
            if(isNaN(average)) this.indicators.average2 = this.entity.modal.option.chartLowerLimit;
            else this.indicators.average2 = average / len;
        }

        if(preWarnMode === 1) {
            this.setPreWarnValue();
        }
    };

    ModalKPIChart.prototype.setPreWarnValue = function () {
        var option = this.entity.modal.option;
        var targetPointId = option.targetPointId;
        var warnMode = option.warnMode;
        var preHistoryValUsage = option.preHistoryValUsage;
        var list1 = this.store.list[targetPointId];
        var list2 = this.store2.list[targetPointId];
        var average = 0;
        var sum = 0;
        var validNum = 0;
        for (var i = 0, len1 = list1.length, len2 = list2.length; i < len2; i++) {
            if(i >= len1) {
                if(isNaN(list2[i])) continue;
                sum += list2[i];
            } else {
                if(isNaN(list1[i])) continue;
                sum += list1[i];
            }
            validNum += 1;
        }
        if(warnMode === 1) {
            this.indicators.preWarnValue = this.indicators.average + this.indicators.average2 - sum/validNum;
        } else {
            if(preHistoryValUsage === 0) {
                this.indicators.preWarnValue = this.indicators.average + option.warnLowerLimit - sum/validNum;
            } else {
                this.indicators.preWarnValue = this.indicators.average + option.warnUpperLimit - sum/validNum;
            }
        }
    };

    ModalKPIChart.prototype.appendData = function (tValue, rValue) {
        var lastTick = this.store.timeShaft[this.store.timeShaft.length-1];
        var option = this.entity.modal.option;
        var preWarnMode = option.preWarnMode;
        var targetPointId = option.targetPointId;
        var targetPointList = this.store.list[targetPointId];
        var cond = option.referenceCondition;
        var condVal = option.referenceConditionVal;
        var len = this.store.list[targetPointId].length;
        var nowStr = new Date().format('yyyy-MM-dd HH:00:00')
        var lastValue, newLastValue;
        var timeStamp;

        if(isNaN(rValue) || this.isPointRuled(rValue, condVal, cond)) {
            // here, don not care about the precision
            tValue = tValue.toFixed(3) * 1;
            if(lastTick !== nowStr) {
                timeStamp = lastTick.toDate().valueOf();
                // deal with the suitation when there is no data in last hour
                if ((nowStr.toDate().valueOf() - timeStamp) > 3600000) {
                    this.store.timeShaft.push(new Date(timeStamp+3600000).format('yyyy-MM-dd HH:00:00'));
                }

                this.store.timeShaft.push(nowStr);
                this.refreshTimesInOneHour = 0;
                // push new value
                this.indicators.average = (this.indicators.average*len+tValue) / (len+1);
                targetPointList.push(tValue);

            } else {
                lastValue = targetPointList[targetPointList.length-1]
                newLastValue =
                    (lastValue*this.refreshTimesInOneHour+tValue) / (this.refreshTimesInOneHour+1);
                targetPointList[targetPointList.length-1] = newLastValue.toFixed(3)*1;
                this.indicators.average = (this.indicators.average*len-lastValue+newLastValue) / len;
                this.refreshTimesInOneHour += 1;
            }
            
            if(preWarnMode === 1) {
               this.setPreWarnValue();
            }
        }
    };

    ModalKPIChart.prototype.setTimeParams = function () {
        if(this.store.timeShaft.length == 0) return;
        var lastTick = this.store.timeShaft[this.store.timeShaft.length-1].toDate().valueOf();
        var option = this.entity.modal.option;
        var tick = lastTick + this.samplingPeriod.value2ms;
        var now = new Date();

        // copy array
        this.store.fullTimeShaft = this.store.timeShaft.concat();
        // monthly
        if(option.dataCycleMode === 0) {
            this.store.deadline = now.format('yyyy-MM-' + DateUtil.daysInMonth(now) + ' 23:55:00').toDate();
            // get the last day of current month
            while(tick <= this.store.deadline) {
                tick += this.samplingPeriod.value2ms;
                this.store.fullTimeShaft.push(tick.toDate().format('yyyy-MM-dd HH:mm:ss'));
            }
        }
        // quarterly
        else {

        }
    };

    ModalKPIChart.prototype.fitContainer = function () {
        var row = this.entity.spanR;
        var column = this.entity.spanC;

        if(Math.min(row, column) < 3) {
            this.options.series[0].splitLine.length = 15;
            this.options.series[0].axisLine.lineStyle.width = 15;
            this.options.series[0].axisTick.length = 4;
            this.options.series[0].pointer.width = 4;
            this.options.series[0].detail.textStyle.fontSize = 20;
        }

    };

    ModalKPIChart.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this._render();
        this.m_bIsGoBackTrace = false;
    };

    var DEFAULTS = {
        tooltip : {},
        series: [{
            name: 'KPI Indicator',
            type: 'gauge',
            precision: 2,
            splitNumber: 10,
            startAngle: 140,
            endAngle : -140,
            axisLine: {
                show: true,
                lineStyle: {
                    width: 30,
                    color: []
                }
            },
            axisTick: {
                show: true,
                splitNumber: 5,
                length :8,
                lineStyle: {
                    color: '#eee',
                    width: 1,
                    type: 'solid'
                }
            },
            splitLine: {
                show: true,
                length :30,
                lineStyle: {
                    color: '#eee',
                    width: 2,
                    type: 'solid'
                }
            },
            pointer : {
                length : '80%',
                width : 8
            },
            detail : {
                offsetCenter: ['-65%', -15],
                textStyle: {
                    fontSize : 30
                }
            },
            data: [{name: ''}]
        }],
        animation: true
    };

    var HISTORY_CHART_DEFAULTS = {
        title : {
            text : 'History Data'
        },
        legend: {data: ['Target Point']},
        tooltip : {
            trigger: 'axis'
        },
        dataZoom: {
            show: false,
            realtime : true,
            start : 0,
            end : 100
        },
        grid: {
            y2: 80
        },
        xAxis : [
            {
                type: 'category'
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name: 'Target Point',
                type: 'line',
                symbolSize: 0,
                markLine: {
                    precision: 3,
                    symbol: 'none',
                    data: []
                },
                markPoint: {
                    symbol:'emptyCircle',
                    effect : {
                        show: true,
                        shadowBlur : 0
                    },
                    data: []
                }
            }
        ],
        animation: true
    };

    return ModalKPIChart;

} (jQuery));
// ModalObserverConfig CLASS DEFINITION
var ModalObserverConfig = ( function ($, window, undefined) {
    var _this;

    function ModalObserverConfig(options) {
        _this = this;
        // parameters
        this.options = $.extend({}, DEFAULTS, options);
        // DOM
        this.$wrap = null;
    }

    ModalObserverConfig.prototype.show = function () {
        var domPanelContent = document.getElementById('paneContent');
        if($('#modalObserverConfigWrap').length > 0) {
            this.$modal.modal('show');
            return;
        }

        Spinner.spin(domPanelContent);
        // get the template from server
        WebAPI.get('/static/views/observer/widgets/modalObserverConfig.html').done(function (html) {
            _this.$wrap = $('<div class="modal-observer-config-wrap" id="modalObserverConfigWrap">')
                .appendTo(domPanelContent).html(html);
            _this.$modal = _this.$wrap.children('.modal');

            WebAPI.get("/get_s3db_pages/" + AppConfig.projectId + "/" + AppConfig.userId).done(function (result) {
                _this.init(result.pages);
                _this.$modal.modal('show');
            }).always(function (msg) {
                Spinner.stop();
            });
            
        });
    };

    ModalObserverConfig.prototype.init = function (data) {
        // DOM
        this.$formWrap      = $('#obFormWrap', '#modalObserverConfigWrap');
        this.$btnClose      = $('.close', '#modalObserverConfigWrap');
        this.$sltObserverId = $('#sltObserverId', '#obFormWrap');
        this.$btnSubmit     = $('#btnObSubmit', '#modalObserverConfigWrap');

        var sb = new StringBuilder();
        for (var i = 0, item, len = data.length; i < len; i++) {
            item = data[i];
            sb.append('<option value="').append(item.id).append('">')
                .append(item.name + ' (width: ' + item.width + ', height: ' + item.height + ')</option>');
        }

        this.$sltObserverId.html(sb.toString());

        this.attachEvents();
    };

    ModalObserverConfig.prototype.attachEvents = function () {
        this.$btnSubmit.off().click( function (e) {
            var form = {};
            form.id = _this.$sltObserverId.val().trim();

            // save to modal
            _this.options.onSubmit.call(_this.options.modalIns, form);
            // close modal
            _this.$btnClose.trigger('click');
            e.preventDefault();
        } );
    };

    ModalObserverConfig.prototype.setOptions = function (options) {
        this.options = $.extend({}, this.options, options);
    };

    var DEFAULTS = {};

    return ModalObserverConfig;

}(jQuery, window) );


// ModalObserver CLASS DEFINITION
var ModalObserver = (function ModalObserver($, window, undefined) {
    
    function ModalObserver(screen, entityParams) {
        ModalBase.call(this, screen, entityParams, this._render, null, this._showConfig);
        this.options = $.extend(true, {}, DEFAULTS);
        this.obScreen = null;
    };

    ModalObserver.prototype = Object.create(ModalBase.prototype);
    ModalObserver.prototype.constructor = ModalObserver;

    ModalObserver.prototype.optionTemplate = {
        name: 'toolBox.modal.OBSERVER',
        parent: 0,
        mode: 'custom',
        maxNum: 1,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalObserver'
    };

    ModalObserver.prototype._render = function () {
        var options = this.entity.modal.option;
        var id = options.id || '200000360';

        this.obScreen = new ObserverScreen(id);
        this.container = $(this.container).html('<div class="divMain" style="width: 100%; height: 100%;">\
                <div class="div-canvas-ctn" style="padding: 0; margin: 0 auto; height: 100%; width: 100%;">\
                    <canvas class="canvas-ctn" style="width: 100%; height: 100%;">浏览器不支持</canvas>\
                </div>\
                <div id="divObserverTools" style="height: 0"></div>\
            </div>')[0];
        this.obScreen.isInDashBoard = true;
        this.obScreen.show(this.container);
    };

    ModalObserver.prototype._showConfig = function () {};

    ModalObserver.prototype.showConfigModal = function () {
        this.configModal.setOptions({modalIns: this});
        this.configModal.show();
    };

    ModalObserver.prototype.saveConfig = function (form) {
        this.entity.modal.option = form;
        this.entity.modal.points = [];
    };

    ModalObserver.prototype.configModal = new ModalObserverConfig({onSubmit: function (form) { this.saveConfig(form); }});

    ModalObserver.prototype._close = function () {
        if(this.obScreen) this.obScreen.close();
    };

    // DEFAULTS OPTION
    var DEFAULTS = {
    };

    return ModalObserver;

} (jQuery, window));

var ModalMultiple = (function () {
    function ModalMultiple(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;
        ModalRealtimeLine.call(this, screen, entityParams, renderModal, updateModal, null);
        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };

    ModalMultiple.prototype = new ModalRealtimeLine();

    ModalMultiple.prototype.optionTemplate = {
        name: 'toolBox.modal.MULTIPLE',
        parent: 0,
        mode: ['multiple'],
        maxNum: 10,
        title: '',
        minHeight: 2,
        minWidth: 3,
        maxHeight: 6,
        maxWidth: 12,
        type: 'ModalMultiple',
        modelParams: {
            paraName:['line','bar','area','cumulativeBar'],
            paraShowName: {'line': 'Line Chart Parameters',/*I18n.resource.modalConfig.data.DASHBOARD_MULTI_LINE,*/
                'bar': "Bar Chart Parameters",/*I18n.resource.modalConfig.data.DASHBOARD_MULTI_BAR,*/
                'area': "Area Chart Parameters",/*I18n.resource.modalConfig.data.DASHBOARD_MULTI_AREA,*/
                'cumulativeBar': "Cumulative Bar Chart Parameters"/*I18n.resource.modalConfig.data.DASHBOARD_MULTI_CUMULATIVE_BAR*/
            },
            paraAnlysMode:'part'
        }
    };
    ModalMultiple.prototype.renderModal = function () {
        this.isFirstRender = true;
    };
    ModalMultiple.prototype.updateModal = function (points) {
        if(points.length < 1) return;
        var _this = this;
        if(this.isFirstRender){
            var pointNameList = (function(points){
                var arr = [];
                for(var i = 0; i < points.length; i++){
                    arr.push(points[i].dsItemId)
                }
                return arr;
            })(points);
            var endTime;
            if (!_this.m_bIsGoBackTrace) {
                endTime = new Date().format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = true;
            }
            else {
                this.m_bIsGoBackTrace = false;
                endTime = new Date(_this.m_traceData.currentTime).format('yyyy-MM-dd HH:mm:ss');
                _this.optionDefault.animation = false;
            }
            var startTime = endTime.split(' ')[0] + ' 00:00:00';
            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                //dataSourceId: '',  //_this.screen.store.datasources[0].id,
                dsItemIds: pointNameList,
                timeStart: startTime,
                timeEnd: endTime,
                timeFormat: 'h1'
            }).done(function (dataSrc) {
                if (dataSrc == undefined || dataSrc.length <= 0) {
                    return;
                }
                var entityItem = _this.dealWithData(dataSrc,2);
                var option = {
                    legend: {
                        data: entityItem.arrLegend
                    },
                    //grid: {x: 70, y: 34, x2: 50, y2: 24},
                    grid: (function(){
                        if(AppConfig.isMobile){
                            return {x2: 40}
                        }else{
                            return {x2: 50}
                        }
                    }()),
                    xAxis: [
                        {
                            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
                            boundaryGap: true
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: false,
                            splitArea:{show:false}
                        },
                        {
                            type: 'value',
                            scale: false,
                            splitArea:{show:false},
                            splitLine: {show: (function(){
                                if(AppConfig.isMobile){
                                    return false;
                                }else{
                                    return true;
                                }
                            }())}
                        }
                    ],
                    series: entityItem.arrSeries
                };
                /*var optionTemp = {};
                $.extend(true,optionTemp,_this.optionDefault);*/
                if (_this.entity.modal.dsChartCog){
                    var ptIndex = 0;
                    if(_this.entity.modal.dsChartCog[0].upper != ''){
                        option.yAxis[1].max = Number(_this.entity.modal.dsChartCog[0].upper);
                    }
                    if(_this.entity.modal.dsChartCog[0].lower != ''){
                        option.yAxis[1].min = Number(_this.entity.modal.dsChartCog[0].lower);
                    }
                    if(_this.entity.modal.dsChartCog[0].unit != ''){
                        option.yAxis[1].name = _this.entity.modal.dsChartCog[0].unit;
                    }
                    if(_this.entity.modal.dsChartCog[0].accuracy != ''){
                        var n = Number(_this.entity.modal.dsChartCog[0].accuracy);
                        for (var i = 0;i < _this.entity.modal.option.paraType[0].arrId.length;i++) {
                            for (var j = 0; j < option.series[ptIndex].data.length; j++) {
                                //option.series[i].data[j] = Math.round( option.series[i].data[j] * Math.pow(10, n) ) / Math.pow(10, n)
                                option.series[ptIndex].data[j] = Number(option.series[ptIndex].data[j]).toFixed(n);
                            }
                            ptIndex += 1;
                        }
                    }
                    var tempChartMax,tempChartMin;
                    for (var m = 1; m < 4; ++m ) {
                        tempChartMax = null;
                        tempChartMin = null;
                        if (_this.entity.modal.dsChartCog[m].upper != '') {
                            if (tempChartMax == null || tempChartMax < Number(_this.entity.modal.dsChartCog[m].upper)) {
                                tempChartMax = Number(_this.entity.modal.dsChartCog[m].upper);
                            }
                        }
                        if (_this.entity.modal.dsChartCog[m].lower != '') {
                            if (tempChartMin == null || tempChartMin > Number(_this.entity.modal.dsChartCog[m].lower)) {
                                tempChartMin = Number(_this.entity.modal.dsChartCog[m].lower);
                            }
                        }
                        if (_this.entity.modal.dsChartCog[m].unit != '') {
                            option.yAxis[0].name = _this.entity.modal.dsChartCog[m].unit;
                        }
                        if (_this.entity.modal.dsChartCog[m].accuracy != '') {
                            var n = Number(_this.entity.modal.dsChartCog[m].accuracy);
                            for (var i = 0;i < _this.entity.modal.option.paraType[m].arrId.length;i++) {
                                for (var j = 0; j < option.series[ptIndex].data.length; j++) {
                                    //option.series[i].data[j] = Math.round( option.series[i].data[j] * Math.pow(10, n) ) / Math.pow(10, n)
                                    option.series[ptIndex].data[j] = Number(option.series[ptIndex].data[j]).toFixed(n);
                                }
                                ptIndex += 1;
                            }
                        }
                    }
                    if(tempChartMax != null){
                        option.yAxis[0].max = Number(tempChartMax);
                    }
                    if(tempChartMin != null){
                        option.yAxis[0].min = Number(tempChartMin);
                    }
                    var tempMarkLine;
                    var seriesNum = 0;
                    for (var l = 0; l < 4; l++){
                        for(var index = 0;index < _this.entity.modal.option.paraType[l].arrId.length;++index) {
                            for (var k = 0; k < 4; k++) {
                                if (_this.entity.modal.dsChartCog[l].markLine[k].value) {
                                    if (!option.series[seriesNum].markLine) {
                                        option.series[seriesNum].markLine = {
                                            data: [],
                                            symbol: 'none',
                                            itemStyle:{
                                                normal:{
                                                    label: {
                                                        show: false
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    tempMarkLine = [
                                        {
                                            name: _this.entity.modal.dsChartCog[l].markLine[k].name,
                                            value: _this.entity.modal.dsChartCog[l].markLine[k].value,
                                            xAxis: -1,
                                            yAxis: Number(_this.entity.modal.dsChartCog[l].markLine[k].value)
                                        },
                                        {
                                            //xAxis: option.series[l + index].data.length,
                                            xAxis:dataSrc.timeShaft.length,
                                            yAxis: Number(_this.entity.modal.dsChartCog[l].markLine[k].value)
                                        }
                                    ];
                                    option.series[seriesNum].markLine.data.push(tempMarkLine);
                                }
                            }
                            seriesNum++;
                        }
                    }
                }
                var cha = echarts.init(_this.container, AppConfig.chartTheme);
                //cha.clear();
                _this.chart = cha.setOption($.extend(true, {}, _this.optionDefault, option));
                _this.isFirstRender = false;
            }).error(function (e) {

            }).always(function (e) {

            });
        } else{
            var crtHour = new Date().getHours();
            if (points && points.length > 0 && this.chart.getSeries()[0].data.length < crtHour) {//seriesData[i].dsItemId
                this.chart.addData(this.dealWithAddData(points,2));
            }
            if(this.chart.getSeries()[0].data.length > 23){
                this.isFirstRender = true;
            }
        }
    };
    ModalMultiple.prototype.dealWithData = function (points) {
        if(points.error) {
            this.container.innerHTML = '<div id="dataAlert" ></div>';
            new Alert($("#dataAlert"), "danger", "<strong>" + points.error + "</strong>").show();
            return;
        }

        var arr = {
            arrLegend:{},
            arrSeries:{}
        };
        arr.arrLegend = [];
        arr.arrSeries = [];
        var arrTempPoints = [];
        var dataType = this.entity.modal.option.paraType;
        for (var i = 0 ; i < dataType.length; ++i){
            for (var j = 0 ;j < dataType[i].arrId.length;++j)
            arrTempPoints.push({dsItemId:dataType[i].arrId[j]})
        }
        var arrPointAlias = this.initPointAlias(arrTempPoints);
        var tempNum = 0;
        for (var i = 0;i < dataType.length;i++){
            switch (dataType[i].type) {
                case 'bar':
                    for (var j = 0; j < dataType[i].arrId.length; j++) {
                        for (var k = 0; k < points.list.length; ++k) {
                            if (dataType[i].arrId[j] == points.list[k].dsItemId) {
                                var series = {
                                    name: arrPointAlias[tempNum],
                                    type: 'bar',
                                    symbol: 'none',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    smooth: true,
                                    data: points.list[k].data,
                                    yAxisIndex: 0
                                };
                                arr.arrLegend.push(arrPointAlias[tempNum]);
                                arr.arrSeries.push(series);
                                tempNum +=1;
                                break;
                            }
                        }
                    }
                    break;
                case 'line':
                    for (var j = 0; j < dataType[i].arrId.length; j++) {
                        for (var k = 0; k < points.list.length; ++k) {
                            if (dataType[i].arrId[j] == points.list[k].dsItemId) {
                                var series = {
                                    name: arrPointAlias[tempNum],
                                    type: 'line',
                                    symbol: 'none',
                                    //itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    smooth: true,
                                    data: points.list[k].data,
                                    yAxisIndex: 1,
                                    z:3
                                }
                                arr.arrLegend.push(arrPointAlias[tempNum]);
                                arr.arrSeries.push(series);
                                tempNum +=1;
                                break;
                            }
                        }
                    }
                    break;
                case 'area':
                    for (var j = 0; j < dataType[i].arrId.length; j++) {
                        for (var k = 0; k < points.list.length; ++k) {
                            if (dataType[i].arrId[j] == points.list[k].dsItemId) {
                                var series = {
                                    name: arrPointAlias[tempNum],
                                    type: 'line',
                                    symbol: 'none',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    smooth: true,
                                    data: points.list[k].data,
                                    yAxisIndex: 0,
                                    z:3
                                };
                                arr.arrLegend.push(arrPointAlias[tempNum]);
                                arr.arrSeries.push(series);
                                tempNum +=1 ;
                                break;
                            }
                        }
                    }
                    break;
                case 'cumulativeBar':
                    for (var j = 0; j < dataType[i].arrId.length; j++) {
                        for (var k = 0; k < points.list.length; ++k) {
                            if (dataType[i].arrId[j] == points.list[k].dsItemId) {
                                var series = {
                                    name: arrPointAlias[tempNum],
                                    type: 'bar',
                                    stack:'实时累计图',
                                    symbol: 'none',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    smooth: true,
                                    data: points.list[k].data,
                                    yAxisIndex: 0
                                };
                                arr.arrLegend.push(arrPointAlias[tempNum]);
                                arr.arrSeries.push(series);
                                tempNum +=1;
                                break;
                            }
                        }
                    }
                    break;
            }
        }
        return arr;
    },
    //ModalMultiple.prototype.dealWithAddData = function (points,len) {
    //    var arr = [];
    //    var dataType = this.option;
    //    for(var i = 0; i < points.length; i++){
    //        var temp = [i, tofixed(points[i].data), false, true];
    //        arr.push(temp);
    //    }
    //    return arr;
    //},
    ModalMultiple.prototype.setModalOption = function(option){
        this.entity.modal.option = {};
        this.entity.modal.interval = 5;
        this.entity.modal.option.paraType = option.paraType
    };
    ModalMultiple.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
    };
    return ModalMultiple;
})();

// 单点预测折线图配置 start
var ModalPredictPointLineConfig = (function ($, window, undefined) {
    var _this;

    function ModalPredictPointLineConfig(options) {
        _this = this;
        ModalConfig.call(this, options);
    }

    ModalPredictPointLineConfig.prototype = Object.create(ModalConfig.prototype);
    ModalPredictPointLineConfig.prototype.constructor = ModalPredictPointLineConfig;


    ModalPredictPointLineConfig.prototype.DEFAULTS = {
        htmlUrl: '/static/views/observer/widgets/modalPredictPointLineConfig.html'
    };

    ModalPredictPointLineConfig.prototype.init = function () {
        // DOM
        this.$formWrap             = $('.form-wrap', this.$wrap);
        this.$iptChartYaxisMin     = $('.ipt-chart-y-axis-min', this.$formWrap);
        this.$iptChartYaxisMax     = $('.ipt-chart-y-axis-max', this.$formWrap);
        this.$iptChartValUnits     = $('.ipt-chart-val-units', this.$formWrap);
        this.$iptChartValPrecision = $('.ipt-chart-val-precision', this.$formWrap);
        
        this.$btnOptionMode        = $('.btn-option-mode', this.$formWrap);
        this.$btnTimeMode          = $('.btn-time-mode', this.$formWrap);
        this.$btnPredictMode       = $('.btn-predict-mode', this.$formWrap);
        this.$divTargetPoint       = $('.div-target-point', this.$formWrap);
        this.$divPredictPoint      = $('.div-predict-point', this.$formWrap);
        this.$btnSubmit            = $('.btn-submit', this.$wrap);
        
        // drop area
        this.$dropArea             = $('.drop-area', this.$formWrap);

        this.attachEvents();
    };

    ModalPredictPointLineConfig.prototype.recoverForm = function (modal) {
        var name, form, dsChartConfig;
        if(!modal) return;
        form = modal.option;
        dsChartConfig = (modal.dsChartCog && modal.dsChartCog.length) ? modal.dsChartCog[0] : {};
        if(!form) return;
        this._setField('input', this.$iptChartYaxisMin, dsChartConfig.lower);
        this._setField('input', this.$iptChartYaxisMax, dsChartConfig.upper);
        this._setField('input', this.$iptChartValUnits, dsChartConfig.unit);
        this._setField('input', this.$iptChartValPrecision, dsChartConfig.accuracy);

        this._setField('droparea', this.$divTargetPoint, form.targetPointId);
        this._setField('droparea', this.$divPredictPoint, form.predictPointId);

        this._setField('dropdown', this.$btnOptionMode, form.optionsMode);
        this._setField('dropdown', this.$btnTimeMode, form.timeMode);
        this._setField('dropdown', this.$btnPredictMode, form.predictMode);
    };

    ModalPredictPointLineConfig.prototype.reset = function () {
        this._setField('input', this.$iptChartYaxisMin);
        this._setField('input', this.$iptChartYaxisMax);
        this._setField('input', this.$iptChartValUnits);
        this._setField('input', this.$iptChartValPrecision);

        this._setField('droparea', this.$divTargetPoint);
        this._setField('droparea', this.$divPredictPoint);

        this._setField('dropdown', this.$btnOptionMode);
        this._setField('dropdown', this.$btnTimeMode);
        this._setField('dropdown', this.$btnPredictMode);
    };

    ModalPredictPointLineConfig.prototype.attachEvents = function () {
        ///////////////////
        // submit EVENTS //
        ///////////////////
        this.$btnSubmit.off().click( function (e) {
            var modalIns = _this.options.modalIns;
            var modal = modalIns.entity.modal;
            var dsChartConfig = {}, form = {};
            var val;

            // Y轴下限值
            val = parseFloat( _this.$iptChartYaxisMin.val() );
            dsChartConfig.lower = !isNaN(val) ? val : '';
            // Y轴上限值
            val = parseFloat( _this.$iptChartYaxisMax.val() );
            dsChartConfig.upper = !isNaN(val) ? val : '';
            // 数值显示精度, 默认值2
            val = parseInt( _this.$iptChartValPrecision.val() );
            dsChartConfig.accuracy = !isNaN(val) ? val : '';
            // 数值单位
            dsChartConfig.unit = _this.$iptChartValUnits.val();

            form.optionMode     = parseInt(_this.$btnOptionMode.attr('data-value'));
            form.timeMode       = parseInt(_this.$btnTimeMode.attr('data-value'));
            form.predictMode    = parseInt(_this.$btnPredictMode.attr('data-value'));
            form.targetPointId  = _this.$divTargetPoint.attr('data-value');
            form.predictPointId = _this.$divPredictPoint.attr('data-value');

            // save to modal
            modal.dsChartCog = [dsChartConfig];
            modal.option = form;
            modal.points = form.predictMode === 0 ?
                [form.targetPointId, form.predictPointId] : [form.targetPointId];
            modal.interval = 60000;

            // close modal
            _this.$modal.modal('hide');
            e.preventDefault();
        } );
    };

    return ModalPredictPointLineConfig;

} (jQuery, window));
// 单点预测折线图配置 end

// 单点预测折线图 start
var ModalPredictPointLine = (function ($, window, undefined) {

    function ModalPredictPointLine(screen, entityParams, _renderModal, _updateModal, _showConfigMode) {
        var _this = this;
        if (!screen) return;
        var renderModal = _renderModal ? _renderModal : this.renderModal;
        var updateModal = _updateModal ? _updateModal : this.updateModal;
        var showConfigMode = _showConfigMode ? _showConfigMode : this.showConfigMode;

        ModalRealtimeLine.call(this, screen, entityParams, renderModal, updateModal, null);

        this.chart = null;
        this.chartOptions = $.extend(true, {}, this.optionDefault, DEFAULTS_CHARTS_OPTIONS);
        this.period = null;
        this.firstload = $.Deferred();

        this.m_bIsGoBackTrace = false;
        this.m_traceData = undefined;
    };

    ModalPredictPointLine.prototype = Object.create(ModalRealtimeLine.prototype);
    ModalPredictPointLine.prototype.constructor = ModalPredictPointLine;

    ModalPredictPointLine.prototype.optionTemplate = {
        name:'toolBox.modal.REAL_TIME_PREDICT_POINT_LINE',
        parent:0,
        mode:'custom',
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalPredictPointLine'
    };

    ModalPredictPointLine.prototype.renderModal = function () {
        var _this             = this;
        var modal             = this.entity.modal;
        var dsChartOption     = (modal.dsChartCog && modal.dsChartCog.length) ? modal.dsChartCog[0] : {};
        var option            = modal.option;
        // CHART OPTIONS
        var chartYaxisMin     = dsChartOption.lower;
        var chartYaxisMax     = dsChartOption.upper;
        var chartValUnits     = dsChartOption.unit;
        var chartValPrecision = dsChartOption.accuracy;
        
        var timeMode          = option.timeMode;
        var targetPointId     = this.entity.modal.points[0];
        var predictPointId    = option.predictPointId;
        var predictMode       = option.predictMode;
        var period            = this.period = this.getPeriod(timeMode);
        var params            = [];

        var dsName            = [];

        // 默认为单点预测
        if(predictMode === undefined) predictMode = option.predictMode = 0;

        params.push({
            dsItemIds: [targetPointId],
            timeStart: period.startTime,
            timeEnd: period.endTime,
            timeFormat: period.tmFmt
        });

        // 初始化 legend
        dsName = AppConfig.datasource.getDSItemById(targetPointId).alias || targetPointId;
        this.chartOptions.legend.data =  [dsName];
        this.chartOptions.series[0].name = dsName;

        // 如果是多点预测模式
        if(predictMode === 1 && period.endTime < period.rangeEndTime) {
            params.push({
                dsItemIds: [predictPointId],
                timeStart: period.endTime,
                timeEnd: period.rangeEndTime,
                timeFormat: period.tmFmt
            });
            // 添加预测点的 legend
            this.chartOptions.legend.data.push('Predict Line');
        }

        // USE THE CHART OPTIONS
        if(chartYaxisMin !== '') this.chartOptions.yAxis[0].min = chartYaxisMin;    
        if(chartYaxisMax !== '') this.chartOptions.yAxis[0].max = chartYaxisMax;
        this.chartOptions.yAxis[0].name = chartValUnits;
        // default precision is 2
        if(chartValPrecision === '') chartValPrecision = 2;

        WebAPI.post('/analysis/startWorkspaceDataGenHistogramMulti', params).done(function (rsList) {
            var predictData;
            var i, t, leni, lent;

            // deal with precision
            for (i = 0, leni = rsList.length; i < leni; i++) {
                rsList[i].list[0].data = rsList[i].list[0].data.map(function (row, i) {
                    return row.toFixed(chartValPrecision);
                });
            }

            _this.chartOptions.xAxis[0].data = _this.period.timeShaft;
            _this.chartOptions.series[0].data = rsList[0].list[0].data;

            // custom options
            _this.chartOptions.xAxis[0].axisLabel = {
                formatter: function (v) {
                    var formatStr;
                    switch(timeMode) {
                        // daily
                        case 0:
                            formatStr = 'HH:00';
                            break;
                        // monthly
                        case 1:
                        default:
                            formatStr = 'MM-dd';
                            break;
                    }
                    return v.toDate().format(formatStr);
                }
            };

            // 初始化 echart
            if(_this.chart) { _this.chart.clear(); _this.chart = null; }
            _this.chart = echarts.init(_this.container, AppConfig.chartTheme);

            // 如果是多点预测模式，则再增加一条曲线
            if(predictMode === 1 && rsList[1]) {
                // 新增 legend
                _this.chartOptions.legend.data.push()
                predictData = rsList[1].list[0].data;
                // 将 predictData 的第一个数据用实时值的最后一个替代，从而使整条曲线连贯
                predictData[0] = rsList[0].list[0].data[ rsList[0].list[0].data.length-1 ];
                // 给 rsList 补充数据
                predictData = new Array(_this.period.timeShaft.length - predictData.length + 1)
                    .join('-').split('').concat(predictData);
                _this.chartOptions.series.push({
                    type: 'line',
                    name: 'Predict Line',
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                type: 'dotted'
                            },
                            color: '#6495ed',
                            label: {position:'right'}
                        }
                    },
                    data: predictData
                });
                _this.chart.clear();
                _this.chart.setOption(_this.chartOptions);

                return;
            }

            _this.firstload.done(function (points) {
                _this.updateModal(points, true);
            });
        });

    };

    // force 标记主要是处理第一次加载预测点的情况
    ModalPredictPointLine.prototype.updateModal = function (points, force) {
        // 屏蔽掉第一次的加载，因为和 render 几乎是同时发生的，没必要掉一次
        if(this.firstload.state() === 'pending') return this.firstload.resolve(points);

        if(!points || points.length === 0) return;
        var _this = this;
        var data = this.chartOptions.series[0].data, predictData;
        var timeShaft = this.chartOptions.xAxis[0].data;
        var modal = this.entity.modal;
        var predictMode = modal.option.predictMode;
        var pointVal, predictPointVal;
        var pointId = modal.points[0], predictPointId = modal.points[1];
        var timeInterval = this.period.tmInterval;
        var dataLen = data.length, timeLen = timeShaft.length;
        var lastTickVal = timeShaft[dataLen - 1].toDate().valueOf();
        var nowTick = new Date().valueOf();
        var lastVal, row, i;

        force = force === undefined ? false : force;

        // 判断当前是否达到时间间隔
        // 注释掉该行可以使图表 1 分钟(刷新间隔取决于拉接口的时间间隔)更新一次
        if( (nowTick - lastTickVal) < this.period.tmInterval && !force ) return;
        for (i = 0, len = points.length; i < len; i++) {
            row = points[i];
            if(row.dsItemId === pointId) {
                pointVal = parseFloat(row.data);
            }
            if(row.dsItemId === predictPointId) {
                predictPointVal = parseFloat(row.data);
            }
        }

        // 进入到下一个周期
        // if(nowTick >= this.period.deadlineTick) {
        //     this.period = this.getPeriod(this.entity.modal.option.timeMode);
        //     timeShaft  = this.period.timeShaft;
        //     data.splice(0, data.length);
        // }

        if(pointVal !== undefined && !force) {
            // 保留 3 位小数
            pointVal = Math.round(pointVal*1000)/1000
            data.push( pointVal );
        }

        // 多点预测
        if(predictMode === 1) {
            // 当这个周期更完之后，此时 series[1] 是被 pop 掉了
            // 如果这时候继续更新，会出错，这里处理下这种情况
            if( !this.chartOptions.series[1] ) return;

            predictData = this.chartOptions.series[1].data;

            // 如果没有值了，删除这个 series
            if( predictData[predictData.length-1] === '-' ) {
                this.chartOptions.series.pop();
            }
            // 将下一个数据点用 '-' 代替
            // 因为预测点的数据是 ['-', '-', ..., '1', '2']
            // 前面的 '-' 都是占位用的，因为 echart 不支持从某个点开始渲染数据
            else {
                predictData.splice( predictData.lastIndexOf('-')+1, 1, '-' );
            }

            // 如果预测数据还没有达到周期边界，则将预测的下一个值置为实时值的最新值
            if( predictData[predictData.length-1] !== '-' ) {
                predictData.splice( predictData.lastIndexOf('-')+1, 1,  pointVal);
            }
        }
        // 单点预测
        else if(predictPointVal !== undefined) {
            dataLen = data.length;
            // 针对最后一个点做特殊处理
            if(dataLen === timeLen ) {
                timeShaft.push( new Date(lastTickVal + timeInterval).format('yyyy-MM-dd HH:00:00') );
            }

            this.chartOptions.series[0].markPoint.data = [
                {name: 'Predict Value', value: predictPointVal, xAxis: dataLen, yAxis: predictPointVal}
            ];

            // 当前的最后一个有效数据
            lastVal = data[data.length-1];
            this.chartOptions.series[0].markLine.data = [
                [
                    {xAxis: dataLen-1, yAxis: lastVal},
                    {value: predictPointVal, xAxis: dataLen, yAxis: predictPointVal}
                ]
            ];
        }
        // repaint
        this.chart.setOption(this.chartOptions);
    };

    ModalPredictPointLine.prototype.getPeriod = function (timeMode) {
        var _this = this;
        var now, tmFmt, tmInterval, tick, endTick;
        var start, end;
        var timeShaft  = [];

        if (!this.m_bIsGoBackTrace) {
            now = new Date();
            _this.optionDefault.animation = true;
        }
        else {
            now = this.m_traceData.currentTime;
            _this.optionDefault.animation = false;
        }

        switch(timeMode) {
            // daily
            case 0:
                tmFmt = 'h1';
                tmInterval = 3600000; // 60*60*1000
                start = now.format('yyyy-MM-dd') + ' 00:00:00';
                end = now.format('yyyy-MM-dd HH:00:00');
                endTick = end.toDate().valueOf();
                // 至少保留 8 小时的时间
                deadlineTick = Math.max(start.toDate().valueOf()+86400000, endTick+28800000/*--8*60*60*1000--*/);
                break;
            // monthly
            case 1:
            default:
                tmFmt = 'd1';
                tmInterval = 86400000; // 24*60*60*1000
                start = now.format('yyyy-MM') + '-01 00:00:00';
                end = now.format('yyyy-MM-dd 00:00:00');
                endTick = end.toDate().valueOf();

                if(this.entity.modal.option.predictMode === 1) {
                    // 始终向后预测 7 天
                    // 仅针对多点预测
                    deadlineTick = now.valueOf() + 604800000;/*--7*24*60*60*1000--*/
                } else {
                    // 至少保留 7 天
                    deadlineTick = Math.max(start.toDate().valueOf()+DateUtil.daysInMonth(now)*86400000, endTick+604800000/*--7*24*60*60*1000--*/);
                }
                
                break;
            // weekly
            case 2:
                tmFmt = 'h1';
                tmInterval = 3600000; // 60*60*1000
                // 定位到这一周的起始时间
                // getDay 默认是从周日开始的，这里转换成从周一开始
                start = new Date( now.valueOf()-( (now.getDay()+6)%7 )*86400000/*--24*60*60*1000--*/ ).format('yyyy-MM-dd 00:00:00');
                end = now.format('yyyy-MM-dd HH:00:00');
                endTick = end.toDate().valueOf();
                // 至少保留 40 小时的时间空余
                deadlineTick = Math.max(start.toDate().valueOf()+604800000/*--7*24*60*60*1000--*/, endTick+144000000/*--40*60*60*1000--*/);
                break;
        };

        tick = start.toDate().valueOf();

        while(tick < deadlineTick) {
            timeShaft.push(tick.toDate().format('yyyy-MM-dd HH:00:00'));
            tick += tmInterval;
        };

        return {
            startTime: start,
            endTime: end,
            rangeStartTime: start,
            rangeEndTime: timeShaft[timeShaft.length-1],
            tmFmt: tmFmt,
            tmInterval: tmInterval,
            timeShaft: timeShaft,
            deadlineTick: deadlineTick
        }
    };

    ModalPredictPointLine.prototype.showConfigModal = function (container, options) {
        this.configModal.setOptions({modalIns: this});
        this.configModal.show();
    };

    ModalPredictPointLine.prototype.setOptions = function (options) {
        this.options = $.extend({}, this.opitons, options);
    };

    ModalPredictPointLine.prototype.setModalOption = function (option) { };

    ModalPredictPointLine.prototype.configModal = new ModalPredictPointLineConfig();

    ModalPredictPointLine.prototype.goBackTrace = function (data) {
        this.m_bIsGoBackTrace = true;
        this.m_traceData = data;
        this.renderModal();
        this.m_bIsGoBackTrace = false;
    };

    var DEFAULTS_CHARTS_OPTIONS = {
        tooltip: {
            formatter: function (p) {
                var arrHtml = [p[0].name];
                p.forEach(function (row) {
                    if(row.value === '-') return;
                    arrHtml.push(row.series.name + ': ' + row.value);
                });
                return arrHtml.join('<br/>');
            }
        },
        //grid: {x: 50, y: 38, x2: 25, y2: 45},
        series: [{
            markPoint: {
                symbol:'emptyCircle',
                symbolSize : 5,
                effect: {
                    show: true,
                    shadowBlur : 0
                },
                itemStyle: {
                    normal: {
                        color: '#6495ed',
                        label: {position:'top'}
                    }
                },
                data: []
            },
            markLine: {
                symbol: 'circle',
                symbolSize: 1.5,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            type: 'dotted'
                        },
                        color: '#6495ed',
                        label: {position:'right'}
                    }
                },
                tooltip: {
                    show: false
                },
                data: []
            }
        }],
        toolbox: { show: false }
    };

    return ModalPredictPointLine;
}(jQuery, window) );
// 单点预测折线图 end
/**
 * Created by RNBtech on 2015/6/18.
 */
var ModalNote = (function(){
    function ModalNote(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    ModalNote.prototype = new ModalBase();
    ModalNote.prototype.optionTemplate = {
        name:'toolBox.modal.NOTE',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 30,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalNote'
    };

    ModalNote.prototype.show = function(){
        this.init();
    }

    ModalNote.prototype.init = function(){

    }

    ModalNote.prototype.renderModal = function (e) {
        this.spinner && this.spinner.stop();
        if(!this.entity.modal.modalText) return;
        var temp = this.entity.modal.modalText;
        temp = temp.replace(/&lt;%\S+\.*\S+%&gt;/g,'--');
        this.container.style.padding = '8px';
        this.container.innerHTML = temp;
    }

    ModalNote.prototype.showConfigMode = function () {
    }
    ModalNote.prototype.updateModal = function (points) {
        var arrId = [];
        for(var i = 0; i < points.length; i++){
            var data = points[i].data;
            if(!isNaN(data)){
                data = parseFloat(data).toFixed(2);
            }
            var $target = $('#divContainer_' + this.entity.id).find('#'+points[i].dsItemId);
            var textUrl = this.entity.modal.modalTextUrl?this.entity.modal.modalTextUrl:undefined;
            var index = $target.closest('.springContent').find('.pointValue').index($target);
            $target.html(data);
            arrId.push('');
            if (textUrl && textUrl.length > 0){
                for(var j = 0; j < textUrl[index].ptTextUrl.length; ++j){
                    if (textUrl[index].ptTextUrl[j].value == parseInt(data)) {
                        arrId[index] = textUrl[index].ptTextUrl[j].url;
                        if (arrId[index] != '') {
                            $target.css({
                                'cursor': 'pointer',
                                'text-decoration': 'underline'
                            });
                            if (textUrl[index].ptTextUrl[j].name && textUrl[index].ptTextUrl[j].name !='') {
                                $target.html(textUrl[index].ptTextUrl[j].name);
                            }
                        }
                        break;
                    }

                }
            }
        }
        var _this = this;
        arrId.forEach(function(value,index){
            if(arrId[index] == '')return;
            var $target = $('#ulPages').find('[pageId="' + arrId[index] + '"]');
            var ScreenType;
            for (var i = 0 ; i < AppConfig.navItems.length;i++){
                if(AppConfig.navItems[i].id == arrId[index]){
                    ScreenType = AppConfig.navItems[i].type;
                    break;
                }
            }
            if (!ScreenType){
                $('#divContainer_' + _this.entity.id).find('.pointValue').eq(index).off('click').on('click',function(e){
                    ScreenManager.show(ScreenType,arrId[index]);
                })
            }else{
                if(ScreenType == 'ReportScreen'){
                    $('#divContainer_' + _this.entity.id).find('.pointValue').eq(index).off('click').on('click',function(e){
                        var $ev =  $('#ulPages [pageid="'+ arrId[index] +'"]');
                        if($ev[0].className != 'nav-btn-a'){
                            $ev = $ev.children('a');
                            $ev.closest('.dropdown').children('a').trigger('click');
                        }
                        $ev.trigger('click');
                    })
                }else if(ScreenType == 'EnergyScreen'){
                    $('#divContainer_' + _this.entity.id).find('.pointValue').eq(index).off('click').on('click',function(e){
                        ScreenManager.show(EnergyScreen,arrId[index]);
                    })
                }
            }
        })
    }
    ModalNote.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    }
    return ModalNote;
})();
var ModalRankConfig = (function ($, window, undefined) {

    function ModalRankConfig(options) {
        ModalConfig.call(this, options);
    }

    ModalRankConfig.prototype = Object.create(ModalConfig.prototype);
    ModalRankConfig.prototype.constructor = ModalRankConfig;


    ModalRankConfig.prototype.DEFAULTS = {
        htmlUrl: '/static/views/observer/widgets/modalRank.html'
    };

    ModalRankConfig.prototype.init = function () {
        this.$dropArea = $('.drop-area', this.$wrap);
        this.$btnSubmit = $('.btn-submit', this.$wrap);
        this.$rankPointList = $('#rankPointList', this.$wrap);
        this.$radioRankAsc = $('#radioRankAsc', this.$wrap);
        this.$radioRankDesc = $('#radioRankDesc', this.$wrap);
        //this.$btnChoosePt = $('#btnRankChoPt', this.$wrap);

        this.attachEvents();
    };

    ModalRankConfig.prototype.recoverForm = function (modal) {
    	this._setField('input', this.$rankPointList, modal.points);
        if (0 == modal.desc || null == modal.desc) {
            this.$radioRankAsc.prop('checked', true);
            this.$radioRankDesc.prop('checked', false);
        }
        else {
            this.$radioRankAsc.prop('checked', false);
            this.$radioRankDesc.prop('checked', true);
        }
    };

    ModalRankConfig.prototype.reset = function () {
		this._setField('input', this.$rankPointList);
    };

    ModalRankConfig.prototype.attachEvents = function () {
        var _this = this;

        // submit EVENTS
        _this.$btnSubmit.off().click( function (e) {
            var modalIns = _this.options.modalIns;
            var modal = modalIns.entity.modal;

            // save to modal
            var ptList = _this.$rankPointList.val();
            modal.points = ptList.split(',');

            var radioVal = 0;
            if ($('#radioRankAsc')[0].checked) {
                radioVal = 0;
            }
            else {
                radioVal = 1;
            }
            modal.desc = radioVal;

            // close modal
            _this.$modal.modal('hide');
            e.preventDefault();
        } );
/*
        _this.$btnChoosePt.click(function(){
            WebAPI.get('/static/views/observer/dataSourceAdd.html').done(function (result) {
                _this.m_cfgPanel = new DataSourceConfigure(_this, 0, true, '', '', '', -1);
                _this.m_cfgPanel.show();
            }).error(function (result) {
            }).always(function (e) {
            });
        });*/
    };

    return ModalRankConfig;
} (jQuery, window));


var ModalRank = (function(){
    function ModalRank(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this._showConfig);
        this.modal = entityParams.modal;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.m_langFlag = ('zh' == localStorage['language']) ? 0 : 1;   // 0：zh，1：en
        this.spinner.spin(this.container);
    };
    ModalRank.prototype = new ModalBase();
    ModalRank.prototype.optionTemplate = {
        name:'toolBox.modal.WHIRLWIND_CHART',
        parent:0,
        mode:'custom',
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRank'
    };

    ModalRank.prototype.show = function() {
        this.init();
    }

    ModalRank.prototype.init = function() {
    }

    ModalRank.prototype.renderModal = function (e) {
        var _this = this;
        var arrPrjId = [];
        for (var i= 0,len=AppConfig.projectList.length; i< len; i++) {
            arrPrjId.push(AppConfig.projectList[i].id);
        }
        var arrRankPt = _this.modal.points;
        var rankDesc = _this.modal.desc;
        var postData = {'projectIds':arrPrjId, 'points':arrRankPt, 'desc':rankDesc};

        var showlist = {list: []};
        var descFlag = 0;
        if (AppConfig.benchMark != undefined) {
            for (var i= 0,len=arrRankPt.length; i<len; i++) {
                for (var j= 0,len2=AppConfig.benchMark.length; j<len2; j++) {
                    for (var k= 0, len3=AppConfig.benchMark[j].points.length; k<len3; k++) {
                        if (arrRankPt[i] == AppConfig.benchMark[j].points[k]) {
                            showlist.list = AppConfig.benchMark[j].list;
                            descFlag = AppConfig.benchMark[j].desc;
                            break;
                        }
                    }
                }
            }
        }
        if (showlist.list.length > 0) {
            var flag = true;
            if (rankDesc != descFlag) {
                flag = false;
            }
            _this.drawRankChart(showlist, arrRankPt.length, flag);
        }
        else {
            WebAPI.post('/benchmark/getListByPointsAndProjectIds', postData).done(function (result) {
                _this.drawRankChart(result, arrRankPt.length, true);
            }).always(function (e) {
            });
        }
        _this.spinner.stop();
    }

    ModalRank.prototype.updateModal = function () {
    }

    ModalRank.prototype.showConfigModal = function () {
        this.configModal.setOptions({modalIns: this});
        this.configModal.show();
    }
    ModalRank.prototype._showConfig = function () {};

    ModalRank.prototype.setModalOption = function (option) {
    }

    ModalRank.prototype.drawRankChart = function (dataSrc, ptLen, sortFlag) {
        // dataSrc:画图数据
        // ptLen:点数量
        // sortFlag:排序标签，true：默认，false：反序
        var _this = this;
        var showValue = [];
        var yAxis = [];
        var prjId, prjName, ptVal;
        var curPrjId = AppConfig.projectId;
        if (sortFlag) {
            for (var i= dataSrc.list.length-1; i>=0; i--) {
                ptVal = dataSrc.list[i].value;
                if (-1 == ptVal) {
                    continue;
                }

                prjId = dataSrc.list[i].projectId;
                if (prjId == curPrjId) {
                    showValue.push({value:ptVal, itemStyle:{normal:{color:'#ff6347'}}});
                }
                else {
                    showValue.push(ptVal);
                }

                var findName = false;
                for (var j= 0,len2=AppConfig.projectList.length; j<len2; j++) {
                    if (prjId == AppConfig.projectList[j].id) {
                        findName = true;
                        break;
                    }
                }

                if (1 == ptLen) {
                    if (0 == _this.m_langFlag) {
                        yAxis.push(AppConfig.projectList[j].name_cn);
                    }
                    else {
                        yAxis.push(AppConfig.projectList[j].name_english);
                    }
                }
                else {
                    if (findName) {
                        if (0 == _this.m_langFlag) {
                            prjName = AppConfig.projectList[j].name_cn;
                        }
                        else {
                            prjName = AppConfig.projectList[j].name_english;
                        }
                        yAxis.push(prjName + '-' + dataSrc.list[i].name);
                    }
                    else {
                        yAxis.push(dataSrc.list[i].name);
                    }
                }
            }
        }
        else {
            for (var i= 0,len=dataSrc.list.length; i<len; i++) {
                ptVal = dataSrc.list[i].value;
                if (-1 == ptVal) {
                    continue;
                }

                prjId = dataSrc.list[i].projectId;
                if (prjId == curPrjId) {
                    showValue.push({value:ptVal, itemStyle:{normal:{color:'#ff6347'}}});
                }
                else {
                    showValue.push(ptVal);
                }

                var findName = false;
                for (var j= 0,len2=AppConfig.projectList.length; j<len2; j++) {
                    if (prjId == AppConfig.projectList[j].id) {
                        findName = true;
                        break;
                    }
                }

                if (1 == ptLen) {
                    if (0 == _this.m_langFlag) {
                        yAxis.push(AppConfig.projectList[j].name_cn);
                    }
                    else {
                        yAxis.push(AppConfig.projectList[j].name_english);
                    }
                }
                else {
                    if (findName) {
                        if (0 == _this.m_langFlag) {
                            prjName = AppConfig.projectList[j].name_cn;
                        }
                        else {
                            prjName = AppConfig.projectList[j].name_english;
                        }
                        yAxis.push(prjName + '-' + dataSrc.list[i].name);
                    }
                    else {
                        yAxis.push(dataSrc.list[i].name);
                    }
                }
            }
        }

        var chartOption = {
			title : {
					subtext: ''
				},
			tooltip : {
				trigger : 'axis',
				axisPointer : {
					type : 'shadow'
				}
			},
			legend: {
				data : ['value'],
                show : false
			},
			calculable : false,
            grid: {
                x: 100,
                y: 10,
                x2: 20,
                y2: 60
            },
			xAxis : [
				{
					type : 'value'
				}
			],
			yAxis : [
				{
					type : 'category',
					axisTick : {show: false},
                    axisLabel : {
                        show: true,
                        rotate: 45
                    },
                    data : yAxis
				}
			],
			series : [
				{
					name : 'value',
					type : 'bar',
					data : showValue,
					itemStyle: {
						normal: {
							label : {show: true, position: 'inside'},
							barBorderRadius: [0, 5, 5, 0]
						},
						emphasis: {
							barBorderRadius: [0, 5, 5, 0]
						}
					}
				}
			]
        };
        _this.chart.setOption(chartOption);
    }

    ModalRank.prototype.configModal = new ModalRankConfig();

    return ModalRank;
})();
var ModalRankNormal = (function(){
    function ModalRankNormal(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this._showConfig);
        this.modal = entityParams.modal;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.m_langFlag = ('zh' == localStorage['language']) ? 0 : 1;   // 0：zh，1：en
        this.spinner.spin(this.container);
    };
    ModalRankNormal.prototype = new ModalBase();
    ModalRankNormal.prototype.optionTemplate = {
        name:'toolBox.modal.RANK_CHART',
        parent:0,
        mode:['modalRankNormal'],
        maxNum:10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalRankNormal'
    };

    ModalRankNormal.prototype.show = function() {
        this.init();
    }

    ModalRankNormal.prototype.init = function() {
    }

    ModalRankNormal.prototype.renderModal = function (e) {
        var _this = this;

        var arrPoint = _this.modal.points;
        var postData = {'dataSourceId':0,'dsItemIds':arrPoint};
        WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData).done(function (data) {
            _this.drawRankChart(data);
        }).always(function (e) {
            _this.spinner.stop();
        });
    }

    ModalRankNormal.prototype.updateModal = function () {
    }
    ModalRankNormal.prototype.showConfigModal = function () {
    }
    ModalRankNormal.prototype._showConfig = function () {
    }
    ModalRankNormal.prototype.setModalOption = function (option) {
    }

    ModalRankNormal.prototype.drawRankChart = function (dataSrc) {
        var _this = this;
        var yAxis = [];
        var showValue = [];
        var arrId = [];
        var arrItem = [];
        for (var i= dataSrc.length-1; i>=0; i--) {
            arrId.push(dataSrc[i].dsItemId);
        }
        arrItem = AppConfig.datasource.getDSItemById(arrId);
        for (var i = 0, len = arrItem.length; i < len; i++) {
            var item = arrItem[i];
            yAxis.push(item.alias);
            for (var j = 0, len2 = dataSrc.length; j < len2; j++) {
                if (item.id == dataSrc[j].dsItemId) {
                    showValue.push(parseInt(dataSrc[j].data));
                    break;
                }
            }
        }


        for (var i= dataSrc.length-1; i>=0; i--) {
            for (var m = 0; m < arrItem.length; m++) {
                if (dataSrc[i].dsItemId == arrItem[m].id) {
                    var itemName = arrItem[m].alias;
                    yAxis.push(itemName);
                    showValue.push(parseInt(dataSrc[i].data));
                    break;
                }
            }
        }

        var chartOption = {
			title : {
					subtext: ''
				},
			tooltip : {
				trigger : 'axis',
				axisPointer : {
					type : 'shadow'
				}
			},
			legend: {
				data : [],
                show : false
			},
			calculable : false,
            grid: {
                x: 100,
                y: 10,
                x2: 20,
                y2: 40
            },
			xAxis : [
				{
					type : 'value'
				}
			],
			yAxis : [
				{
					type : 'category',
					axisTick : {show: false},
                    axisLabel : {
                        show: true,
                        rotate: 45
                    },
                    data : yAxis
				}
			],
			series : [
				{
					name : 'value',
					type : 'bar',
					data : showValue,
					itemStyle: {
						normal: {
							label : {show: true, position: 'inside'},
							barBorderRadius: [0, 5, 5, 0]
						},
						emphasis: {
							barBorderRadius: [0, 5, 5, 0]
						}
					}
				}
			]
        };
        _this.chart.setOption(chartOption);
    }

    return ModalRankNormal;
})();
/**
 * Created by RNBtech on 2015/6/18.
 */
var ModalMix = (function(){
    function ModalMix(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    ModalMix.prototype = new ModalBase();
    ModalMix.prototype.optionTemplate = {
        name:'toolBox.modal.MIX',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalMix'
    };

    ModalMix.prototype.show = function(){
        this.init();
    }

    ModalMix.prototype.init = function(){
        this.container.style.overflowX = 'hidden';
        this.container.style.overflowY = 'auto';
    }

    ModalMix.prototype.renderModal = function (e) {
        var _this = this;
        var $sliderCont;
        var $sliderDiv = $('.sliderDiv');
        //是否以slider形式显示判断字段
        var displaySlider = _this.entity.modal.option.displaySlider;
        displaySlider = displaySlider === undefined ? false : displaySlider;
        var carouselTime = new Date();
        if (displaySlider) {
            $sliderDiv = $('<div id="carousel_' + carouselTime.getTime() + '" class="carousel slide sliderDiv" data-ride="carousel">' +
                                 '<ol class="carousel-indicators" style="bottom:0px;">' +
                                 '</ol><div class="carousel-inner" role="listbox">' +
                                 '</div>' +
                                 '<a class="left carousel-control" href="#carousel_' + carouselTime.getTime() + '" role="button" data-slide="prev"  style="background-image:none;color:rgba(91,91,91,0.6);width:60px;height:40%;top:30%;">' +
                                 '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true" style="transform: scale(1,1.3)"></span><span class="sr-only">Previous</span></a>' +
                                 '<a class="right carousel-control" href="#carousel_' + carouselTime.getTime() + '" role="button" data-slide="next" style="background-image:none;color:rgba(91,91,91,0.6);width:60px;height:40%;top:30%;">' +
                                 '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true" style="transform: scale(1,1.3)"></span><span class="sr-only">Next</span></a>' +
                                 '</div>');
            $sliderDiv.find('.carousel-control').hover(function () {
                $(this).css('color', 'rgba(0,0,0,.1)');
            }, function () {
                $(this).css('color', 'rgba(51,51,51,.3)');
            })
            $(_this.container).append($sliderDiv);
        }
        if (!this.entity.modal.option || !this.entity.modal.option.subChartIds) return;
            var index = 0;
        this.entity.modal.option.subChartIds.forEach(function (obj) {
            for (var i = 0, item; i < _this.screen.store.layout.length; i++) {
                if (displaySlider) {
                    $(_this.container).css({ 'display': 'block', 'overflow-y': 'hidden' });
                    for (var z = 0; z < _this.screen.store.layout[i].length; z++) {
                        item = _this.screen.store.layout[i][z];
                        if (obj.id != item.id) continue;
                        var modelClass, entity;
                        _this.screen.store.layout[i][z].spanC = 12;
                        
                        var $sliderIner = $('<div class="item sliderIner"><div class="carousel-caption" style="height:100%;width:100%;right:0;left:0;padding-bottom:0;bottom:0px;padding-top:0px;"></div></div>');
                        var $sliderDot = $('<li data-target="#carousel_' + carouselTime.getTime() + '" data-slide-to="' + index + '" style="border-color:#333;box-shadow:1px rgba(0,0,0,.05);margin:1.5px 3px"></li>')
                        if (item.modal.type && item.modal.type != 'ModalNone') {
                            //regist IoC
                            modelClass = _this.screen.factoryIoC.getModel(item.modal.type);
                            if (!modelClass) continue;
                            if (item.isNotRender && _this.entity.modal.type == 'ModalMix') {
                                //_this.screen.container = document.getElementById('divContainer_' + _this.entity.id);
                                entity = new modelClass(_this, item);
                                _this.screen.listEntity[item.id] = entity;
                                if ($.inArray(item.id, _this.screen.arrEntityOrder) < 0) {
                                    _this.screen.arrEntityOrder.push(item.id);
                                }
                                if (item.modal.interval && item.modal.interval >= 0) {
                                    for (var k = 0, point, kLen = item.modal.points.length; k < kLen; k++) {
                                        point = item.modal.points[k];
                                        if (_this.screen.requestPoints.indexOf(point) < 0) {
                                            _this.screen.requestPoints.push(point);
                                        }
                                    }
                                }
                                if (item.modal.popId) {
                                    if (!_this.screen.dictPopToEntity[item.modal.popId]) _this.screen.dictPopToEntity[item.modal.popId] = [];
                                    _this.screen.dictPopToEntity[item.modal.popId].push(item.id);
                                    if (_this.screen.requestPoints.indexOf(item.modal.popId) < 0) {
                                        _this.screen.requestPoints.push(item.modal.popId);
                                    }
                                }
                                //$(_this.screen.listEntity[item.id].container.parentNode.parentNode).addClass('active');
                                //if (_this.screen.listEntity) { 
                                //    $(_this.screen.listEntity[item.id].container).height($(_this.container).height()-30);
                                //    $(_this.screen.listEntity[item.id].container).width($(_this.container).width());
                                //}
                                if (entity) {
                                    $(entity.container).height($(_this.container).height() - 30);
                                    $(entity.container).width($(_this.container).width());
                                }
                                entity.render();
                            }
                        } else if (item.modal.type == 'ModalNone') {
                            modelClass = _this.screen.factoryIoC.getModel(item.modal.type);
                            //_this.screen.container = $('#divContainer_' + _this.entity.id).find('.springContent')[0];
                            entity = new modelClass(_this, item);
                            _this.screen.listEntity[item.id] = entity;
                            _this.screen.arrEntityOrder.push(item.id);
                            //$(_this.screen.listEntity[item.id].container.parentNode.parentNode).addClass('active');
                            if (entity) {
                                $(entity.container).height($(_this.container).height() - 30);
                                $(entity.container).width($(_this.container).width());
                            }
                            entity.render();
                            _this.screen.isForReport && entity.configure();
                        }
                        $sliderCont = $(_this.container).children('.springContainer'); 
                        $sliderIner.children('.carousel-caption').append($sliderCont);
                        $sliderIner.height($(_this.container).height());
                        $sliderDiv.children('.carousel-inner').append($sliderIner);
                        $sliderDiv.children('.carousel-indicators').append($sliderDot);
                        ++index;
                    }
                } else {
                    $(_this.container).css({ 'display': 'flex', 'overflow-y': 'auto', 'flex-flow': 'wrap' });
                    for (var j = 0; j < _this.screen.store.layout[i].length; j++) {
                        item = _this.screen.store.layout[i][j];
                        if (obj.id != item.id) continue;
                       // _this.screen.store.layout[i][j].spanC = 6;
                        var modelClass, entity;
                        if (item.modal.type && item.modal.type != 'ModalNone') {
                            //regist IoC
                            modelClass = _this.screen.factoryIoC.getModel(item.modal.type);
                            if (!modelClass) continue;
                            if (item.isNotRender && _this.entity.modal.type == 'ModalMix') {
                                //_this.screen.container = document.getElementById('divContainer_' + _this.entity.id);
                                entity = new modelClass(_this, item);
                                _this.screen.listEntity[item.id] = entity;
                                if ($.inArray(item.id, _this.screen.arrEntityOrder) < 0) {
                                    _this.screen.arrEntityOrder.push(item.id);
                                }
                                if (item.modal.interval && item.modal.interval >= 0) {
                                    for (var k = 0, point, kLen = item.modal.points.length; k < kLen; k++) {
                                        point = item.modal.points[k];
                                        if (_this.screen.requestPoints.indexOf(point) < 0) {
                                            _this.screen.requestPoints.push(point);
                                        }
                                    }
                                }
                                if (item.modal.popId) {
                                    if (!_this.screen.dictPopToEntity[item.modal.popId]) _this.screen.dictPopToEntity[item.modal.popId] = [];
                                    _this.screen.dictPopToEntity[item.modal.popId].push(item.id);
                                    if (_this.screen.requestPoints.indexOf(item.modal.popId) < 0) {
                                        _this.screen.requestPoints.push(item.modal.popId);
                                    }
                                }
                                entity.render();
                            }
                        } else if (item.modal.type == 'ModalNone') {
                            modelClass = _this.screen.factoryIoC.getModel(item.modal.type);
                            //_this.screen.container = $('#divContainer_' + _this.entity.id).find('.springContent')[0];
                            entity = new modelClass(_this, item);
                            _this.screen.listEntity[item.id] = entity;
                            _this.screen.arrEntityOrder.push(item.id);
                            entity.render();
                            _this.screen.isForReport && entity.configure();
                        }
                    }
                }
            }
        });
        if (displaySlider) {
            if ($(_this.container).find('.item:first')) {
                $(_this.container).find('.item:first').addClass('active');
            }
            if ($(_this.container).find('.carousel-indicators').children(':first')) {
                $(_this.container).find('.carousel-indicators').children(':first').addClass('active');
            }
            $(_this.container).find('.sliderDiv').carousel();
        }
    }
    //滚动显示组合图
    //ModalMix.prototype.renderSliderModal = function (e) {
    //    var _this = this;
    //}
    ModalMix.prototype.showConfigMode = function () {
    }

    ModalMix.prototype.updateModal = function (points) {
        for(var i in points){
            var data = points[i].data;
            if(!isNaN(data)){
                data = parseFloat(data).toFixed(2);
            }
            $('#'+points[i].dsItemId).html(data);
        }
    }

    ModalMix.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    }

    ModalMix.prototype.configure = function () {
        var _this = this;
        if(this.spinner) this.spinner.stop();
        var _this = this;
        if (this.chart) this.chart.clear();
        this.divResizeByMouseInit();

        var divMask = document.createElement('div');
        divMask.className = 'springConfigMask';
        divMask.draggable = 'true';
        /*if (!this.screen.isForReport) {
            var btnConfig = document.createElement('span');
            btnConfig.className = 'glyphicon glyphicon-cog springConfigBtn grow';
            btnConfig.title = 'Options';
            btnConfig.onclick = btnConfig_clickEvent;
            divMask.appendChild(btnConfig);
        }*/

        var btnRemove = document.createElement('span');
        btnRemove.className = 'glyphicon glyphicon-remove-circle springConfigRemoveBtn grow';
        btnRemove.title = 'Remove';
        btnRemove.onclick = function (e) {
            if (_this.chart) _this.chart.clear();
            _this.screen.removeEntity(_this.entity.id);
            $('#divContainer_' + _this.entity.id).remove();
            _this = null;
        };
        divMask.appendChild(btnRemove);

        //add button for mix
        var btnAdd = document.createElement('span');
        btnAdd.className = 'glyphicon glyphicon-plus-sign springConfigAddBtn grow';
        btnAdd.title = 'Add';
        btnAdd.onclick = function (e) {
            //创建一个modalNone
            var spanC = 6, spanR = 6;
            //height width 和最后一个节点一样
            var $chartsCt =_this.container.classList.contains('chartsCt') ? $(_this.container) : $(_this.container).siblings().find('.chartsCt');
            if($chartsCt.children().length > 0){
                var lastDiv = $chartsCt.children()[$chartsCt.children().length - 1];
                spanC = Math.round(parseInt(lastDiv.style.width.split('%')[0])/10) * 12/ 10;
                spanR = Math.round(parseInt(lastDiv.style.height.split('%')[0])/10) * 6/ 10;
            }


            if(!_this.container.classList.contains('chartsCt')){
                //_this.container = _this.container.nextElementSibling.children[6];
                _this.container = _this.container.parentElement.getElementsByClassName('chartsCt')[0];
            }
            var entity = new ModalNone(_this, {
                    id: (+new Date()).toString(),
                    spanC: spanC,
                    spanR: spanR,
                    modal: { type: "ModalNone" },
                    isNotRender: true,
                });
                _this.screen.arrEntityOrder.push(entity.entity.id);
                _this.screen.listEntity[entity.entity.id] = entity;

                if(!_this.entity.modal.option){
                    _this.entity.modal.option = {};
                    _this.entity.modal.option.subChartIds = new Array();
                }
                _this.entity.modal.option.subChartIds.push({ id: entity.entity.id });
                entity.render();
                entity.configure();
        };
        divMask.appendChild(btnAdd);
        //install button for mix
        var btnInstall = document.createElement('span');
        var btnInstallParId ;
        btnInstall.className = 'glyphicon glyphicon-cog springConfigInstallBtn grow';
        btnInstall.title = 'Install';
        //选择是否滚动显示
        var $mixChartShow = $('#mixChartShow');
        if ($mixChartShow.length===0) {
            $mixChartShow = $('<div id="mixChartShow"><div class="modal fade"  style="position:absolute;"><div class="modal-dialog"><div class="modal-content">' +
                            '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                            '<h4 class="modal-title">组合图显示模式</h4></div>' +
                            '<div class="modal-body">' +
                            '<input type="checkbox" class="isSlider"/>是否滚动显示组合图'+
                            '</div>' +
                            '<div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" id="transSlider">确定</button></div>' +
                            '</div></div></div></div>');
        }
        $('#paneContent').append($mixChartShow);
        btnInstall.onclick = function (e) {
            $mixChartShow.children('.modal').modal();
            //当前对象
            btnInstallParId = $(this).parents('.springContainer').attr('id').split('_')[1];
            _this.screen.btnInstallParId = btnInstallParId;
            if (_this.screen.listEntity[_this.screen.btnInstallParId].entity.modal.option.displaySlider) {
                $('#mixChartShow .isSlider')[0].checked=true;
            } else {
                $('#mixChartShow .isSlider')[0].checked=false ;
                //return;
            }
        }
        divMask.appendChild(btnInstall);
        $('#transSlider').off('click').click(function () {
            if ($('#mixChartShow .isSlider').is(":checked")) {
                _this.screen.listEntity[_this.screen.btnInstallParId].entity.modal.option.displaySlider = true;
            } else {
                _this.screen.listEntity[_this.screen.btnInstallParId].entity.modal.option.displaySlider = false;
            }
        });


        var btnHeightResize = document.createElement('div');
        var maxHeight = this.optionTemplate.maxHeight;
        var maxWidth = this.optionTemplate.maxWidth;
        var minHeight = this.optionTemplate.minHeight;
        var minWidth = this.optionTemplate.minWidth;
        btnHeightResize.className = 'divResize divHeightResize';
        btnHeightResize.innerHTML = '<label for="heightResize" >H: </label>' +
        '<input type="range" class="inputResize" id="heightResize" name="points" step="0.5" min="' + minHeight + '" max="' + maxHeight + '" value="' + _this.entity.spanR + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanR + ' /6</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanR + '"/>';
        divMask.appendChild(btnHeightResize);
        var btnWidthResize = document.createElement('div');
        btnWidthResize.className = 'divResize divWidthResize';
        btnWidthResize.innerHTML = '<label for="widthResize" >W: </label>' +
        '<input type="range" class="inputResize" id="widthResize" name="points" step="0.5" min="' + minWidth + '" max="' + maxWidth + '" value="' + _this.entity.spanC + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanC + ' /12</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanC + '"/>';
        divMask.appendChild(btnWidthResize);
        var divTitleAndType = document.createElement('div');
        divTitleAndType.className = 'divTitleAndType';
        divMask.appendChild(divTitleAndType);

        //chartCt
        var $chartCt = $('<div class="divResize chartsCt gray-scrollbar">');
        divMask.appendChild($chartCt[0]);


        var $divTitle = $('<div class="divResize chartTitle">');
        var $labelTitle = $('<label for="title">').text(I18n.resource.dashboard.show.TITLE);
        var inputChartTitle = document.createElement('input');
        inputChartTitle.id = 'title';
        inputChartTitle.className = 'form-control';
        inputChartTitle.value = this.entity.modal.title;
        inputChartTitle.setAttribute('placeholder',I18n.resource.dashboard.show.TITLE_TIP);
        if(this.entity.modal.title != ''){
            inputChartTitle.style.display = 'none';
        }
        inputChartTitle.setAttribute('type','text');
        $divTitle.append($labelTitle).append($(inputChartTitle));
        divTitleAndType.appendChild($divTitle[0]);

        var $divType = $('<div class="divResize chartType">');
        var $labelType = $('<label>').text(I18n.resource.dashboard.show.TYPE);
        var chartType = document.createElement('span');
        chartType.innerHTML = I18n.findContent(this.optionTemplate.name);
        $divType.append($labelType).append($(chartType));
        divTitleAndType.appendChild($divType[0]);



        var chartTitleShow = document.createElement('p');
        chartTitleShow.innerHTML = inputChartTitle.value;
        chartTitleShow.className = 'chartTitleShow';
        $divTitle[0].appendChild(chartTitleShow);
        if(this.entity.modal.title == '' || this.entity.modal.title == undefined){
            chartTitleShow.style.display = 'none';
        }
        chartTitleShow.onclick = function(){
            chartTitleShow.style.display = 'none';
            inputChartTitle.style.display = 'inline-block';
            inputChartTitle.focus();
        };
        inputChartTitle.onblur = function(){
            if (inputChartTitle.value != ''){
                inputChartTitle.style.display = 'none';
                chartTitleShow.style.display = 'inline';
            }
            chartTitleShow.innerHTML = inputChartTitle.value;
            _this.entity.modal.title = inputChartTitle.value;
        };


        this.container.parentNode.appendChild(divMask);
        this.divResizeByToolInit();
        function btnConfig_clickEvent(e) {
            $('.springSel').removeClass('springSel');
            $(e.target).parents('.springContainer').addClass('springSel');
            _this.modalInit();
            //$('#energyModal').modal('show');
        }


        //drag event of replacing entity
        var divContainer = $(this.container).closest('.springContainer')[0];
        divMask.ondragstart = function (e) {
            //e.preventDefault();
            e.dataTransfer.setData("id", $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', ''));
        };
        divMask.ondragover = function (e) {
            e.preventDefault();
        };
        divMask.ondragleave = function (e) {
            e.preventDefault();
        };
        divContainer.ondrop = function (e) {
            e.stopPropagation();
            var sourceId = e.dataTransfer.getData("id");
            var $sourceParent, $targetParent, $chartsCt;
            if (sourceId) {
                var targetId = $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', '');
                $sourceParent = $('#divContainer_' + sourceId).parent();
                $targetParent = $('#divContainer_' + targetId).parent();
                $chartsCt = e.target.classList.contains('chartsCt') ? $(e.target) : $(e.target).closest('.chartsCt');
                //外部非组合图拖入组合图
                // 1.非组合图：!$sourceParent[0].classList.contains('chartsCt')
                // 2.source Chart可能ondrop在target chart的chartsCt,也可能是ondrop在chartsCt里面的某个chart,所以
                if(!$sourceParent[0].classList.contains('chartsCt') && ($targetParent[0].classList.contains('chartsCt') || $chartsCt.length == 1)){
                    if($targetParent[0].classList.contains('chartsCt')){
                        _this.insertChartIntoMix(sourceId, $targetParent[0])
                    }else if($chartsCt.length == 1){
                        _this.insertChartIntoMix(sourceId, $chartsCt[0])
                    }
                }else{//平级之间交换
                    if(_this.screen.screen){//组合图内部交换
                        _this.screen.screen.replaceEntity(sourceId, targetId, _this.screen.entity.id);
                    }else{
                        _this.screen.replaceEntity(sourceId, targetId);
                    }
                }
            }
        }
        this.executeConfigMode();
    },

    ModalMix.prototype.insertChartIntoMix = function(sourceId, container){
        if (sourceId) {
            if(this.screen.listEntity[sourceId].entity.modal.type == 'ModalMix'){
                //new Alert(document.getElementById('paneCenter'), Alert.type.danger, '组合图');
                alert(I18n.resource.toolBox.modal.MSG_MIX_NOT_ALLOW_TO_MIX);
                return false;
            }
            var modelClass, item, entity = this.screen.listEntity[sourceId].entity;
            $('#divContainer_'+ sourceId).remove();
            entity.isNotRender = true;
            if(!this.entity.modal.option){
                this.entity.modal.option = {};
            }
            if(!this.entity.modal.option.subChartIds){
                this.entity.modal.option.subChartIds = [];
            }
            modelClass = this.screen.factoryIoC.getModel(entity.modal.type);
            this.screen.container = container;
            if(container.children.length > 0){
                var lastDiv = container.children[container.children.length - 1];
                entity.spanC = Math.round(parseInt(lastDiv.style.width.split('%')[0])/10) * 12/ 10;
                entity.spanR = Math.round(parseInt(lastDiv.style.height.split('%')[0])/10) * 6/ 10;
            }else{
                entity.spanC = 6;
                entity.spanR = 6;
            }
            item = new modelClass(this.screen, entity);
            item.configure()
            this.entity.modal.option.subChartIds.push({id: entity.id});
        }
    }

    return ModalMix;
})();
/**
 * dashboard html 图元模块
 * @description 
 * 在这个图元中，可以使用正常的 html、css 和 js 功能，
 * 除此之外，还有自定义的标签可以使用
 * @history
 * 2015-08-07 新增自定义标签 <LinkTo />
 * 2015-08-06 新增自定义标签 <DataSource />
 * 2015-08-05 初版完成，提供执行 htlm、css 和 js 的功能
 * 细节更改见 SVN
 */
(function() {
    // 自定义标签集合
    var tags = {};
    // 在这里定义需要的自定义标签按钮
    // 需要/不需要 某个自定义标签，在这里直接 增加/删除 即可
    var TOOLBOX = ['DataSource', 'LinkTo'];
    var PATTERN_STR = '<('+TOOLBOX.join('|')+').*?(/|'+TOOLBOX.join('|')+')>';
    // 存储图元需要的数据
    window.__spring_html_modal = {};
    
    // 运行指定的 js 脚本
    function runScript(content) {
        var done = false;
        var script = document.createElement("script");
        var head = document.getElementsByTagName("head")[0];
        script.type = "text\/javascript";
        script.text = content;
        head.appendChild(script);
        head.removeChild(script);
    } 

    // 空标签，仅作继承用
    tags.Base = (function() {
        function Base(modal) {
            // 放 toolBtn 的容器
            this.$textarea = modal.$textarea;
            this.$modalCt  = modal.$modalCt;
            this.$toolBtn  = null;
            this.init();
        }

        Base.prototype.init = function() {
            throw new Error('init 方法未被实现，不可直接调用');
        };

        Base.prototype.render = function($container) {
            throw new Error('render 方法未被实现，不可直接调用');
        };

        return Base;
    }() );

    // DataSource 标签
    // 用法
    // <DataSource [AttributeName=Value][ ,AttributeName=Value] />
    // 属性
    // data-id: 数据源的 id
    tags.DataSource = (function() {
        var _this;
        // 自定义 DataSource
        function DataSource(modal) {
            _this = this;
            tags.Base.call(this, modal);
        }

        DataSource.prototype = Object.create(tags.Base.prototype);
        DataSource.prototype.constructor = DataSource;

        DataSource.prototype.insertTpl = '<DataSource data-id="{id}"{linkTo}/>';

        /*-- @override --*/
        DataSource.prototype.init = function() {
            var arrHtml = [];

            this.$toolBtn = $('<button type="button" class="btn btn-default" data-toggle="collapse" data-target="#panelDataSourceConfig" aria-expanded="false">\
                DataSource\
                </button>');
            this.$toolConfig = $('#panelDataSourceConfig', this.$modalCt);

        };

        /*-- @override --*/
        DataSource.prototype.render = function($btnCtn) {
            $btnCtn.append(this.$toolBtn);
            this.attachEvents();
        };

        DataSource.prototype.attachEvents = function() {
        };

        /*-- @static --*/
        DataSource.save = function(dataset, modal) {
            var id;
            if(!dataset) return;

            id = dataset.id;
            if( id && modal.points.indexOf(id) === -1 ) modal.points.push(id);
        };

        DataSource.getStaticRender = function(dom) {
            var dataset = dom.dataset;
            var menuId = dataset.linkTo;
            var $ele;
            if(menuId) {
                $ele = $('<a href="javascript:;" data-is="DataSource" data-id="'+dataset.id+'">Loading</a>');
                $ele.click(function(e) {
                    var $ev =  $('#ulPages [pageid="'+ menuId +'"]');
                    if($ev[0].className !== 'nav-btn-a'){
                        $ev = $ev.children('a');
                        $ev.closest('.dropdown').children('a').trigger('click');
                    }
                    $ev.trigger('click');
                });
                return $ele;
            }
            else return $('<span data-is="DataSource" data-id="'+dataset.id+'">Loading</span>');
        };

        DataSource.getRealTimeRender = function($ele, map) {
            var dataset = $ele[0].dataset;
            $ele.html( map[dataset.id] );
        };

        return DataSource;
    }() );

    tags.LinkTo = (function() {
        var _this;
        // 自定义标签 LinkTo
        function LinkTo(modal) {
            _this = this;
            tags.Base.call(this, modal);
        }

        LinkTo.prototype = Object.create(tags.Base.prototype);
        LinkTo.prototype.constructor = LinkTo;

        LinkTo.prototype.insertTpl = '<LinkTo data-id="{id}" ></LinkTo>';

        /*-- @override --*/
        LinkTo.prototype.init = function() {
            var arrHtml = [];

            this.$toolBtn = $('<button type="button" class="btn btn-default" data-parent="#collapseList" data-toggle="collapse" data-target="#panelLinkToConfig" aria-expanded="false">LinkTo</button>');
            this.$toolConfig = $('#panelLinkToConfig', this.$modalCt);
        };

        /*-- @override --*/
        LinkTo.prototype.render = function($btnCtn) {
            $btnCtn.append(this.$toolBtn);
            this.attachEvents();
        };

        LinkTo.prototype.attachEvents = function() {
        };

        /*-- @static --*/
        LinkTo.save = function(dataset, modal) {
            // 不需要做任何事
        };
        LinkTo.getStaticRender = function(dom, doc) {
            var dataset = dom.dataset;
            var menuId = dataset.id;

            doc = doc || window.document;
            $ele = $('<a href="javascript:;">'+(dom.innerHTML||'Link To')+'</a>', doc);
            $ele.click(function () {
                var $ev =  $('#ulPages [pageid="'+ menuId +'"]');
                if($ev[0].className !== 'nav-btn-a'){
                    $ev = $ev.children('a');
                    $ev.closest('.dropdown').children('a').trigger('click');
                }
                $ev.trigger('click');
            });
            return $ele;
        };

        return LinkTo;
    }() );

    /*--------------------------------
     * ModalHtml 图元配置类定义
     --------------------------------*/
    var ModalHtmlConfig = (function() {
        var _this;

        // 存储当前页面所有可链接的menu的html
        var gMenusHtml;

        function ModalHtmlConfig(options) {
            _this = this;

            ModalConfig.call(this, options);

            this.toolbox = [];
        }

        ModalHtmlConfig.prototype = Object.create(ModalConfig.prototype);
        ModalHtmlConfig.prototype.constructor = ModalHtmlConfig;

        ModalHtmlConfig.prototype.DEFAULTS = {
            htmlUrl: '/static/views/observer/widgets/modalHtmlConfig.html'
        };

        // @override
        ModalHtmlConfig.prototype.init = function() {
            this.$modal          = $('.modal', this.$wrap);
            this.$modalCt        = $('.modal-content', this.$wrap);
            this.$formWrap       = $('.form-wrap', this.$wrap);
            this.$dsGroupList    = $('.form-horizontal', '#panelDataSourceConfig');
            this.$linkGroupList  = $('.form-horizontal', '#panelLinkToConfig');
            this.$textarea       = $('.form-textarea', this.$formWrap);
            this.$btnSubmit      = $('.btn-submit', this.$wrap);
            this.$toolboxCtn     = $('.toolbox-ctn', this.$formWrap);
            
            this.$btnResizeFull  = $('.btn-resize-full', this.$wrap);
            this.$btnResizeSmall = $('.btn-resize-small', this.$wrap);

            this.attachEvents();

            // 初始化 toolbox
            this.initToolbox();
        };

        ModalHtmlConfig.prototype.initToolbox = function() {
            // 这里可以添加 分组逻辑
            var $toolboxGroup = $('<div class="btn-group" role="group">')
                .appendTo(this.$toolboxCtn);
            TOOLBOX.forEach(function(row) {
                var labelClass = tags[row];
                var labelIns;
                // 验证自定义标签类是否可用
                if (typeof labelClass !== 'function') {
                    console.warn('没有找到自定义标签: ' + row);
                    return;
                }

                labelIns = new labelClass(_this);
                labelIns.render($toolboxGroup);
            });

            var $tools = $('.btn', $toolboxGroup);
            $toolboxGroup.on('click', '.btn', function() {
                $(this).toggleClass('btn-primary');
            });
        };

        // @override
        ModalHtmlConfig.prototype.recoverForm = function(form) {
            var _this = this;
            var options;
            if(!form || !form.option) {
                // 额外新增一行空白行
                this.addDsFormGroup();
                return;
            }
            options = form.option;

            // 设置用户数据源配置
            var arrId = [];
            form.points.forEach(function (row) {
                arrId.push(row);
            });
            var arrItem = AppConfig.datasource.getDSItemById(arrId);
            form.points.forEach(function (row) {
                for (var m = 0; m < arrItem.length; m++) {
                    if (row == arrItem[m].id) {
                        var $ele = _this.addDsFormGroup({
                            id: row,
                            cls: ' dropped',
                            value: row,
                            name: arrItem[m].alias || '未找到名称',
                            display: 'inline'
                        });
                        break;
                    }
                }
            });
            // 额外新增一行空白行
            this.addDsFormGroup();

            // 设置 html 文本
            this._setField('textarea', this.$textarea, options.html);
        };

        // @override
        ModalHtmlConfig.prototype.reset = function () {
            this.$dsGroupList.empty();
            this._setField('textarea', this.$textarea);
        };

        ModalHtmlConfig.prototype.addDsFormGroup = function (data) {
            if(data === undefined) {
                data = {
                    id: '引用变量名',
                    cls: '',
                    value: '',
                    name: '<span class="glyphicon glyphicon-plus"></span>'
                }
            }
            return $('<div class="form-group{cls}">\
                <label class="col-md-2 control-label" for="">Point</label>\
                <div class="col-md-4">\
                    <div class="label-area div-ds-id">{id}</div>\
                </div>\
                <div class="col-md-4">\
                    <div class="drop-area div-ds-point" data-value="{value}">\
                        {name}\
                    </div>\
                </div>\
                <div class="col-md-2">\
                    <div class="opt-icon-area">\
                        <span class="glyphicon glyphicon-remove"></span>\
                    </div>\
                </div>\
            </div>'.formatEL(data)).appendTo(_this.$dsGroupList);
        };

        ModalHtmlConfig.prototype.initLinkFormGroup = function () {
            var arrHtml = [];
            // 填充 "链接到" 列表
            for (var i in AppConfig.menu) {
                if (!AppConfig.menu.hasOwnProperty(i)) continue;
                
                arrHtml.push('<div class="form-group">\
                    <label class="col-md-2 control-label" for="">Link</label>\
                    <div class="col-md-4">\
                        <div class="label-area">{id}</div>\
                    </div>\
                    <div class="col-md-4"><div class="label-area">{name}</div></div>\
                </div>'.formatEL({
                    id: i,
                    name: AppConfig.menu[i]
                }));
            }

            return this.$linkGroupList.html(arrHtml.join(''));
        };

        ModalHtmlConfig.prototype.attachEvents = function () {
            var _this = this;

            ///////////////////////
            // modal show EVENTS //
            ///////////////////////
            this.$modal.on('show.bs.modal', function () {
                _this.initLinkFormGroup();
            });

            /////////////////
            // drop EVENTS //
            /////////////////
            this.$wrap.on('drop', '.drop-area', function (e, isNotShowMsg) {
                var $this = $(this);
                var dsId = $this[0].dataset.value;
                var $formGroup = $this.closest('.form-group');

                if (_this.$dsGroupList.find('[data-value="'+dsId+'"]').length > 1) {
                    _this._setField('droparea', $formGroup.find('.drop-area'));
                    if(!isNotShowMsg){
                       alert('该数据源已存在于列表中！');
                    }
                    return false;
                } else {
                    // 显示删除按钮
                    $formGroup.addClass('dropped');
                    // 显示引用变量名
                    $formGroup.find('.label-area').text(dsId);
                }

                _this.addDsFormGroup();

                e.stopPropagation();
            });

            //////////////////////////////
            // datasource delete EVENTS //
            //////////////////////////////
            this.$wrap.on('click', '.opt-icon-area', function (e) {
                $(this).closest('.form-group').remove();
            });

            ///////////////////
            // resize EVENTS //
            ///////////////////
            this.$btnResizeFull.off().click(function() {
                var height = _this.$modal.height();
                _this.$modal.addClass('maxium-screen');
                _this.$textarea.height(height-208);
            });

            this.$btnResizeSmall.off().click(function() {
                _this.$modal.removeClass('maxium-screen');
                _this.$textarea.height('auto');
            });

            ///////////////////
            // submit EVENTS //
            ///////////////////
            this.$btnSubmit.off().click( function(e) {
                var modalIns = _this.options.modalIns;
                var modal = modalIns.entity.modal;
                var form = {};
                var html;
                var toolboxStr, pattern, match;

                html = form.html = _this.$textarea.val();

                // 初始化 points
                modal.points = [];

                // 获取用户配置的数据源 id 列表
                _this.$dsGroupList.find('.dropped .drop-area').each(function () {
                    modal.points.push($(this)[0].dataset.value);
                });

                // 开始对文本进行处理
                // 复杂的逻辑要开始了 w(ﾟДﾟ)w 伸爪
                // 匹配自定义标签
                toolboxStr = TOOLBOX.join('|');
                // 该正则表达式存在的问题
                // 1、未处理空格
                // 2、会出现自定义标签的穿插匹配，如匹配到 <custom1></custom2>
                // 3、欢迎补充
                pattern = new RegExp(PATTERN_STR, 'ig');
                while ( (match = pattern.exec(html)) !== null ) {
                    // match[0] - tagStr
                    // match[1] - tagName
                    try {
                        // 如果匹配到了自定义标签
                        var dom = $(match[0])[0];
                    } catch(e) {
                        // 如果不是一个合法的自定义标签
                        // 则不处理
                        continue;
                    }

                    // 自定义标签的 save 行为处理
                    tags[match[1]].save(dom.dataset, modal);
                }

                // 以上是老版本的数据源提取逻辑，下面是新版本的数据源提取逻辑
                // 为 <%数据源id%> 的形式添加数据源提取逻辑
                pattern = new RegExp('<%([^,<>%]+).*?%>', 'mg');
                while ( (match = pattern.exec(html)) !== null ) {
                    if (modal.points.indexOf(match[1]) === -1) {
                        modal.points.push(match[1]);
                    }
                }

                // save to modal
                modal.option = form;
                modal.dsChartCog = [{accuracy: 2}];
                modal.interval = 60000;

                // close modal
                _this.$modal.modal('hide');
                // preview the modification
                modalIns.preview();

                e.preventDefault();
            } );

            this.$textarea[0].addEventListener("dragover", function(event) {
                event.preventDefault();
            });
            this.$textarea[0].addEventListener("drop", function(event) {
                event.preventDefault();
                var text = '<%' + EventAdapter.getData().dsItemId + '%>';
                insertText(event.target, text);
                _this.$wrap.find('.drop-area[data-value=""]').trigger('drop', true);
            });

            //在光标位置插入拖入的数据源
            function insertText(obj,str) {
                if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                    var startPos = obj.selectionStart,
                        endPos = obj.selectionEnd,
                        cursorPos = startPos,
                        tmpStr = obj.value;
                    obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                    cursorPos += str.length;
                    obj.selectionStart = obj.selectionEnd = cursorPos;
                } else {
                    obj.value += str;
                }
            }

        };

        return ModalHtmlConfig;
    } ());

    /*--------------------------------
     * ModalHtml 图元类定义
     --------------------------------*/
    this.ModalHtml = (function() {
        function ModalHtml(screen, entityParams) {
            ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
            // 用于使 update 方法始终运行于 render 之后
            // firstUpdateData 用于存储第一次 update 时，传递过来的数据（如果 update 先执行的话）
            this.promise = $.Deferred();
            this.firstUpdateData = null;
            // 用于记录上一次的更新时间
            this.lastUpdateTimeTick = null;
            // 自定义标签 map
            // 例：{'DataSource': ..., 'LinkTo': ...}
            this.customTags = {};

            this.initCustomVaribles();
        }

        ModalHtml.prototype = Object.create(ModalBase.prototype);
        ModalHtml.prototype.constructor = ModalHtml;

        ModalHtml.prototype.optionTemplate = {
            name:'toolBox.modal.MODAL_HTML',
            parent:0,
            mode:'custom',
            maxNum: 10,
            title:'',
            minHeight:1,
            minWidth:2,
            maxHeight:6,
            maxWidth:12,
            type:'ModalHtml'
        };

        ModalHtml.prototype.initCustomVaribles = function () {
            var container = this.container;
            var screen;
            // 自定义回调事件
            window.__spring_html_modal[this.entity.id] = this.customVaribles = {};
            // 初始化一些自定义变量
            this.customVaribles.dataMap = {};
            // 点击的data-link-params的值保存到this.customVaribles
            var arrParams = window.location.hash.split('&');
            if(arrParams && arrParams.length> 0){//arrParams.indexOf('response=') > -1
                for(var i = 0; i < arrParams.length; i++){
                    if(arrParams[i].indexOf('response=') > -1){
                        this.customVaribles.dataParams = arrParams[i];
                    }
                }
            }
            // 初始化一些内置方法
            // linkTo: 跳转到指定页面
            this.customVaribles.linkTo = function (menuId, ctnSelector, linkType, linkName, linkParams) {
                var $ev, ctn;

                // 兼容以往的跳转方式
                if (!ctnSelector && !linkType) {
                    $ev =  $('#ulPages [pageid="'+ menuId +'"]');
                    if ($ev.length > 0) {
                        if ($ev[0].className !== 'nav-btn-a'){
                            $ev = $ev.children('a');
                            $ev.closest('.dropdown').children('a').trigger('click');
                        }
                        $ev.trigger('click');
                        if(linkParams){
                            window.location.hash = window.location.hash + '&response=' + linkParams;
                        }
                        return;
                    }
                }

                // 如果是链接到容器
                if(ctnSelector) {
                    // 如果需要限制为在本容器中查找，写成如下方式即可
                    // container.querySelector(ctnSelector);
                    ctn = document.querySelector(ctnSelector);
                    // 不存在此容器，不做任何事
                    if(!ctn) return;

                    // 初始化 dashboard
                    ctn.innerHTML = '';
                    if(screen) {
                        screen.close();
                        screen = null;
                    }
                }

                linkType = linkType || 'EnergyScreen';
                switch(linkType) {
                    case 'EnergyScreen_M':
                    case 'EnergyScreen':
                        if(!ctn) {
                            if(!AppConfig.isMobile) {
                                ScreenManager.show(EnergyScreen, menuId);
                            }else{
                                var isIndex = linkType == 'EnergyScreen_M';
                                router.to({
                                    typeClass: ProjectDashboard,
                                    data: {
                                        menuId:menuId,
                                        isIndex:isIndex,
                                        name:linkName
                                    }
                                })
                            }
                        } else {
                            screen = new EnergyScreen();
                            screen.id = menuId;
                            screen.container = ctn;
                            screen.isForBencMark = true;
                            screen.init();
                        }
                        break;
                    case 'ObserverScreen':
                        if(!ctn) {
                            ScreenManager.show(ObserverScreen, menuId);
                        } else {
                            screen = new ObserverScreen(menuId);
                            ctn.innerHTML = '<div class="divMain" style="width: 100%; height: 100%;">\
                                    <div class="div-canvas-ctn" style="padding: 0; margin: 0 auto; height: 100%; width: 100%;">\
                                        <canvas class="canvas-ctn" style="width: 100%; height: 100%;">浏览器不支持</canvas>\
                                    </div>\
                                    <div id="divObserverTools" style="height: 0"></div>\
                                </div>';
                            screen.isInDashBoard = true;
                            screen.show(ctn);
                        }
                        break;
                    // 不识别的类型不做处理
                    default: return;
                }
            };
        };

        ModalHtml.prototype.initCustomTags = function(doc) {
            var _this = this;
            doc = doc || document;
            // 处理自定义标签
            TOOLBOX.forEach(function(row, i) {
                var $tagEle = $(row, doc);
                var thisTags = [];
                var staticHtmlRender;

                if(!$tagEle.length) return;
                if( typeof (staticHtmlRender = tags[row].getStaticRender) !== 'function' ) return;

                ([]).forEach.call($tagEle, function(rowt, t) {
                    var $rs = staticHtmlRender(rowt);
                    if(!$rs) return;
                    thisTags.push($rs);
                    $(rowt).replaceWith($rs);
                });

                if(thisTags.length) _this.customTags[row] = thisTags;
            });
        };

        ModalHtml.prototype.initCustomAttrs = function () {
            var _this = this;
            var $container = $(this.container);
            var energyScreen;

            $container.on('click', '[data-link-to]', function (e) {
                var linkType = this.dataset['linkType'];
                var ctnSelector = this.dataset['linkTarget'];
                var menuId = this.dataset['linkTo'];
                var linkName = this.dataset['linkName'];
                var linkParams = this.dataset['linkParams'];
                try{
                    linkParams = JSON.parse(linkParams);
                }catch (e){}
                // 跳转
                _this.customVaribles.linkTo(menuId, ctnSelector, linkType, linkName, linkParams);
                e.preventDefault();
            });
        };

        ModalHtml.prototype._formatNumber = function (num, optionStr) {
            var rs = '';
            var toString = Object.prototype.toString;
            var decimalPortion;
            var numstr, isNegative;
            var options = (function () {
                var arr = optionStr.split(',');
                var opt = {};

                arr.forEach(function (kv) {
                    var kvArr = kv.split('=');
                    if( kvArr.length === 1 ) {
                        opt[kv] = 'true';
                    } else {
                        opt[kvArr[0]] = kvArr[1];
                    }
                });

                return opt;
            } ());

            if( isNaN(num) ) return num;
            num = parseFloat(num);
            isNegative = num < 0;
            // 去除负号
            num = Math.abs(num);

            // 处理小数精度
            if( !isNaN(options.p) ) {
                options.p = parseInt(options.p);
                num = num.toFixed(options.p);
            }

            // 小数部分不考虑
            decimalPortion = (num + '').split('.')[1] || '';
            num = parseInt(num);

            // 处理千分位字符
            if(options.ts === 'true') {
                numstr = num + '';
                while( numstr.length > 3 ) {
                    rs = ',' + numstr.substr(-3, 3) + rs;
                    numstr = numstr.substr(0, numstr.length - 3);
                }
                rs = numstr + rs;
            } else {
                rs = num + '';
            }

            rs = decimalPortion === '' ? rs : (rs + '.' + decimalPortion);
            // 结果为0，不管是否负数，不需要返回负号
            if (parseFloat(rs) === 0) { return rs; }

            // 处理负号
            return (isNegative ? '-' : '') + rs;
        };

        ModalHtml.prototype.buildDsBinding = function() {
            var _this = this;
            var dataMap = this.customVaribles.dataMap = {};
            var $container = $(this.container);
            var ds = dataMap;
            var textNodeMap = {}, attrNodeMap = {};
            var dsNameList = this.entity.modal.points;
            var $textNodes = $container.find('.text-node-placeholder');
            var $attrNodes = $container.find('[data-inner-ds-info]');

            dsNameList.forEach(function(name) {
                var $nodes;

                /** 数据源在文本节点中使用 */
                if( ($nodes = $textNodes.filter('[data-name^="'+name+'"]')).length ) {
                    $nodes.each(function () {
                        var text = document.createTextNode('');
                        if(!textNodeMap[name]) {
                            textNodeMap[name] = [{
                                name: this.getAttribute('data-name'),
                                node: text
                            }];   
                        } else {
                            textNodeMap[name].push({
                                name: this.getAttribute('data-name'),
                                node: text
                            });
                        }
                        this.parentNode.replaceChild(text, this);
                    });
                } else {
                    textNodeMap[name] = [];
                }

                /** 数据源在属性节点中使用 */
                if( ($nodes = $attrNodes.filter('[data-inner-ds-info*="'+name+'"]')).length ) {
                    $nodes.each(function () {
                        var $this = $(this);
                        var attr = $this.data('ds.attr');
                        var info = $this.data('ds.info');

                        if(attr === undefined) {
                            $this.data('ds.attr', (attr = this.getAttribute('data-inner-ds-attr')) );
                        }
                        if(info === undefined) {
                            info = window.decodeURIComponent(this.getAttribute('data-inner-ds-info') );
                            $this.data('ds.info', (info = JSON.parse(info)) );
                        }

                        if(!attrNodeMap[name]) {
                            attrNodeMap[name] = [{
                                node: this.getAttributeNode(attr),
                                info: info
                            }]
                        } else {
                            attrNodeMap[name].push({
                                node: this.getAttributeNode(attr),
                                info: info
                            });
                        }
                    });
                } else {
                    attrNodeMap[name] = [];
                }

                if(!ds.__observerProps) ds.__observerProps = {};
                if(!ds.__observerProps.hasOwnProperty(name)) {
                    ds.__observerProps[name] = null;
                    Object.defineProperty(ds, name, {
                        get: function () {
                            return this.__observerProps[name];
                        },
                        set: function (value) {
                            if(value === this.__observerProps[name]) return;
                            this.__observerProps[name] = value;
                            // 更新对应的 text node
                            textNodeMap[name].forEach(function (row) {
                                var content = row.name;
                                var node = row.node;
                                var idx = content.indexOf(',');

                                if(idx > -1) {
                                    row.node.data = _this._formatNumber(value, content.substr(idx+1));
                                } else {
                                    row.node.data =  isNaN(value) ? value : parseFloat(value).toString();
                                }

                            });
                            attrNodeMap[name].forEach(function (row) {
                                var info = row.info;
                                var str = '';
                                info.forEach(function (row) {
                                    var idx;
                                    if(row.type === TextTemplateParser.types.text) {
                                        str += row.value;
                                    } else if(row.type === TextTemplateParser.types.binding) {
                                        if( row.value.indexOf(name) > -1 ) {
                                            idx = row.value.indexOf(',');
                                            if(idx > -1) {
                                                row.content = _this._formatNumber(value, row.value.substr(idx+1));
                                            } else {
                                                row.content = isNaN(value) ? value : parseFloat(value).toString();
                                            }
                                        }
                                        str += row.content;
                                    }
                                });
                                row.node.value = str;
                            });
                        }
                    });
                }
            });

            // 删除不需要的属性
            $attrNodes.each(function () {
                this.removeAttribute('data-inner-ds-info');
                this.removeAttribute('data-inner-ds-attr');
            });
        };


        // 需要实例化的接口
        ModalHtml.prototype.renderModal = function() {
            var _this = this;
            var options = this.entity.modal.option;
            var info;
            var parser = TextTemplateParser;

            if(!options) {
                $(this.container).html('');
                this.spinner.stop();
                return;
            }
            info = this.getFormatHtml(options.html);

            // $0: 属性+值
            // $1: 属性名
            // $2: 属性值
            info.html = info.html.replace(/([\w-]+?)="([^"]*<%.+?%>[^"]*)"/mg, function ($0, $1, $2) {
                var tokens = parser.parse($2, ['<%', '%>']);
                var infoStr;
                tokens.forEach(function (row) {
                    if(row.type === parser.types.binding) {
                        row.content = '';
                    }
                });
                infoStr = window.encodeURIComponent(JSON.stringify(tokens));

                return $1+'="" data-inner-ds-info="'+infoStr+'" data-inner-ds-attr="'+$1+'"';
            });
            // 整理出数据源的数据
            info.html = info.html.replace(/<%(.+?)%>/mg, function($0, $1) {
                return '<span class="text-node-placeholder" data-name="'+$1+'">'+$1+'</span>';
            });

            $(this.container).html( info.html );
            runScript(info.scriptContent);

            // 初始化自定义标签
            _this.initCustomTags();
            _this.initCustomAttrs();
            _this.buildDsBinding();

            // onRenderComplete
            if( typeof _this.customVaribles.onRenderComplete === 'function' ) {
                _this.customVaribles.onRenderComplete.call(null);
            }

            // 开始执行 update 方法
            _this.promise.done(function(data) {
                if(!data) return;
                _this.updateModal(data);
            });
            _this.promise.resolve(_this.firstUpdateData);

            _this.spinner.stop();
        };

        // 需要实例化的接口
        ModalHtml.prototype.updateModal = function(data) {
            var _this = this;
            var modal, updateInterval, options, now;
            var thisTags;
            var dataMap = this.customVaribles.dataMap;
            var customEventHandlers;
            
            // 如果 render 方法没有执行完，则不执行
            if( this.promise.state() === 'pending') {
                this.firstUpdateData = data;
                return;
            }

            modal = this.entity.modal;
            updateInterval = modal.interval;
            options = this.entity.options;
            nowTick = new Date().valueOf();
            
            // 判断是否到达更新时间
            if( this.lastUpdateTimeTick && (nowTick - this.lastUpdateTimeTick) < updateInterval ) return;
            this.lastUpdateTimeTick = nowTick;

            // 将 data 转换成 map 格式
            data.forEach(function(row) {
                dataMap[row.dsItemId] = row.data;
            });

            // 开始更新自定义标签
            for(var tagName in this.customTags) {
                if( !this.customTags.hasOwnProperty(tagName) ) continue;
                thisTags = this.customTags[tagName];

                thisTags.forEach(function($row, i) {
                    var handler = tags[tagName].getRealTimeRender;
                    if( typeof handler !== 'function' ) return;
                    handler($row, dataMap);
                });
            }

            // 回调处理
            // onUpdateComplete
            if( typeof this.customVaribles.onUpdateComplete === 'function' ) {
                this.customVaribles.onUpdateComplete.call(null, dataMap);
            }

        };

        // 需要实例化的接口
        ModalHtml.prototype.showConfigMode = function() {};

        ModalHtml.prototype.showConfigModal = function(container, options) {
            this.configModal.setOptions({modalIns: this});
            this.configModal.show();
        };
        
        // 放在 prototype 中的原因是：所有的同类型模块公用一个配置模块
        ModalHtml.prototype.configModal = new ModalHtmlConfig();

        ModalHtml.prototype.getFormatHtml = function(html) {
            var _this = this;
            var patternScript = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/img;
            // var patternStyle = /<style\b[^>]*>([\s\S]*?)<\/style>/img;
            // var patternLink = /<link\b[^>]*?>/img;
            var scriptContent = [];
            // var styleTags = [];
            // var linkTags = [];

            var wrapTpl = '(function() { |code| }).call(window.__spring_html_modal[\''+_this.entity.id+'\'])';
            // script 标签处理
            var formatHtml = html.replace(patternScript, function($0, $1, $2, $3) {
                if( $2.trim() !== '') scriptContent.push( $2 );
                return '';
            });

            return {
                scriptContent: wrapTpl.replace( '|code|', scriptContent.join(';\n') ),
                html: formatHtml
            }
            // style 标签处理
            // html.replace(patternStyle, function($0, $1) {
            //     styleTags.push();
            //     return '';
            // });
        };

        ModalHtml.prototype.preview = function () {};

        ModalHtml.prototype.close = function() {};

        return ModalHtml;
    }());

    var TextTemplateParser = (function() {
        function TextTemplateParser() {}

        TextTemplateParser.types = {
            text: 0,
            binding: 1
        };

        TextTemplateParser.parse = function(template, delimiters) {
            var index, lastIndex, lastToken, length, substring, tokens, value;
            tokens = [];
            length = template.length;
            index = lastIndex = 0;

            while (lastIndex < length) {
                index = template.indexOf(delimiters[0], lastIndex);
                if (index < 0) {
                    tokens.push({
                        type: this.types.text,
                        value: template.slice(lastIndex)
                    });
                    break;
                } else {
                    if (index > 0 && lastIndex < index) {
                        tokens.push({
                            type: this.types.text,
                            value: template.slice(lastIndex, index)
                        });
                    }
                    lastIndex = index + delimiters[0].length;
                    index = template.indexOf(delimiters[1], lastIndex);
                    if (index < 0) {
                        substring = template.slice(lastIndex - delimiters[0].length);
                        lastToken = tokens[tokens.length - 1];
                        if ((lastToken !== undefined ? lastToken.type : void 0) === this.types.text) {
                            lastToken.value += substring;
                        } else {
                            tokens.push({
                                type: this.types.text,
                                value: substring
                            });
                        }
                        break;
                    }
                    value = template.slice(lastIndex, index).trim();
                    tokens.push({
                        type: this.types.binding,
                        value: value
                    });
                    lastIndex = index + delimiters[1].length;
                }
            }
            return tokens;
        };

        return TextTemplateParser;
    }());

}).call(this);
var ModalChartCustomConfig = (function ($, window, undefined) {

    function ModalChartCustomConfig(options) {
        ModalConfig.call(this, options);
        this.m_bIsRealTime = true;
        this.m_bIsHisFixCycle = true;
    }

    ModalChartCustomConfig.prototype = Object.create(ModalConfig.prototype);
    ModalChartCustomConfig.prototype.constructor = ModalChartCustomConfig;

    ModalChartCustomConfig.prototype.DEFAULTS = {
        htmlUrl: '/static/views/observer/widgets/modalChartCustom.html'
    };

    ModalChartCustomConfig.prototype.init = function () {
        var _this = this;
        _this.$btnSubmit = $('#btnSubmit', _this.$wrap);
        _this.$editor = $('#editor', _this.$wrap);
        _this.$selectMode = $('#inputMode', _this.$wrap);
        _this.$selRealInterval = $('#selRealInterval', _this.$wrap);
        _this.$tmStart = $('#timeStart', _this.$wrap);
        _this.$tmEnd = $('#timeEnd', _this.$wrap);
        _this.$tmGroup = $('#rangeSel', _this.$wrap);

        _this.$divRealtmCycle = $('#divRealTimeCycle', _this.$wrap);
        _this.$selectHisCycleMode = $('#hisCycleMode', _this.$wrap);
        _this.$selectHisInterval = $('#selHisInterval', _this.$wrap);
        _this.$divHisTmRange = $('#historyTmRange', _this.$wrap);
        _this.$divHisTmCycle = $('#historyTmCycle', _this.$wrap);
        _this.$inputPeriodVal = $('#inputPeriodValue', _this.$wrap);
        _this.$selPeriUnit = $('#inputPeriodUnit', _this.$wrap);

        var modal = _this.options.modalIns.entity.modal;

        EventAdapter.on($(_this.$editor[0]), 'drop', function(e) {
            e.preventDefault();
            this.focus();
            var itemId = EventAdapter.getData().dsItemId;
            if (Boolean(itemId)) {
                var itemName = AppConfig.datasource.getDSItemById(itemId).alias;
                var spanCtl = $('<span id="' + itemId + '" title="' + itemName + '" class="pointValue"></span>');
                spanCtl.text('"<%' + itemName + '%>"');

                var sel, range;
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();

                        var insertDiv = $('<div>');
                        insertDiv.append('&nbsp;');
                        insertDiv.append(spanCtl);
                        insertDiv.append('&nbsp;');
                        var el = insertDiv[0];
                        var frag = document.createDocumentFragment(), node, lastNode;
                        while ((node = el.firstChild)) {
                            lastNode = frag.appendChild(node);
                        }
                        range.insertNode(frag);
                        if (lastNode) {
                            range = range.cloneRange();
                            range.setStartAfter(lastNode);
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }
                }
                _this.$editor.append('&nbsp;');
            }
        });
        EventAdapter.on($(_this.$editor[0]), 'dragover', function (e) {
            e.preventDefault();
        });

        if (Boolean(modal.option)) {
            if (!modal.option.isRealTime) {
                _this.m_bIsRealTime = false;
                _this.$selectMode.val('history');
                _this.$tmGroup.css('display', 'block');
                _this.$divRealtmCycle.css('display', 'none');
            }
            else {
                _this.m_bIsRealTime = true;
                _this.$selectMode.val('realTime');
                _this.$tmGroup.css('display', 'none');
                _this.$divRealtmCycle.css('display', 'block');
            }

            if (!modal.option.isHisFixCycle) {
                _this.m_bIsHisFixCycle = false;
                _this.$selectHisCycleMode.val('recent');
                _this.$divHisTmRange.css('display', 'none');
                _this.$divHisTmCycle.css('display', 'block');
            }
            else {
                _this.m_bIsHisFixCycle = true;
                _this.$selectHisCycleMode.val('fixed');
                _this.$divHisTmRange.css('display', 'block');
                _this.$divHisTmCycle.css('display', 'none');
            }

            switch (modal.interval) {
                case 'm1':
                case 'm5':
                case 'h1':
                case 'd1':
                case 'M1':
                    _this.$selRealInterval.val(modal.interval);
                    _this.$selectHisInterval.val(modal.interval);
                    break;
                default :
                    _this.$selRealInterval.val('h1');
                    _this.$selectHisInterval.val('h1');
                    break;
            }

            _this.$tmStart.val(modal.option.timeStart);
            _this.$tmEnd.val(modal.option.timeEnd);
            _this.$inputPeriodVal.val(modal.option.timeCycleValue);
            if (!modal.option.timeCycleUnit) {
                _this.$selPeriUnit.val(modal.option.timeCycleUnit);
            }
            else {
                _this.$selPeriUnit.val('hour');
            }
        }
        else {
            _this.$selectMode.val('realTime');
            _this.$tmGroup.css('display', 'none');
        }
        _this.$selectMode.change(function (e) {
            var flag = $(e.currentTarget).val();
            if ('history' == flag) {
                _this.$tmGroup.css('display', 'block');
                _this.m_bIsRealTime = false;
                _this.$divRealtmCycle.css('display', 'none');
            }
            else {
                _this.m_bIsRealTime = true;
                _this.$tmGroup.css('display', 'none');
                _this.$divRealtmCycle.css('display', 'block');
            }
        });
        _this.$selectHisCycleMode.change(function (e) {
            var $opt = _this.$selectHisInterval.children('option');
            var flag = $(e.currentTarget).val();
            if ('fixed' == flag) {  // fixed cycle
                _this.m_bIsHisFixCycle = true;
                $opt.eq(0).css('display', 'block');
                $opt.eq(1).css('display', 'block');
                $opt.eq(2).css('display', 'block');
                $opt.eq(3).css('display', 'block');
                $opt.eq(4).css('display', 'block');
                _this.$divHisTmRange.css('display', 'block');
                _this.$divHisTmCycle.css('display', 'none');
            }
            else {  // recent cycle
                _this.m_bIsHisFixCycle = false;
                _this.$selPeriUnit.change();
                _this.$divHisTmRange.css('display', 'none');
                _this.$divHisTmCycle.css('display', 'block');
            }
        });
        _this.$selPeriUnit.change(function (e) {
            var $opt = _this.$selectHisInterval.children('option');
            $opt.eq(0).css('display', 'none');
            var flag = $(e.currentTarget).val();
            switch (flag) {
                case 'hour':
                    $opt.eq(1).css('display', 'block');
                    $opt.eq(2).css('display', 'block');
                    $opt.eq(3).css('display', 'none');
                    $opt.eq(4).css('display', 'none');
                    _this.$selectHisInterval.val('m5');
                    break;
                case 'day':
                    $opt.eq(1).css('display', 'none');
                    $opt.eq(2).css('display', 'block');
                    $opt.eq(3).css('display', 'block');
                    $opt.eq(4).css('display', 'none');
                    _this.$selectHisInterval.val('h1');
                    break;
                case 'month':
                    $opt.eq(1).css('display', 'none');
                    $opt.eq(2).css('display', 'none');
                    $opt.eq(3).css('display', 'block');
                    $opt.eq(4).css('display', 'block');
                    _this.$selectHisInterval.val('d1');
                    break;
                default :
                    break;
            }
        });
        if (!_this.m_bIsHisFixCycle) {
            _this.$selPeriUnit.change();
        }

        $(".form_datetime").datetimepicker({
            format: "yyyy-mm-dd HH:mm:ss",
            minView: "hour",
            autoclose: true,
            todayBtn: false,
            pickerPosition: "bottom-right",
            initialDate: new Date()
        }).off('changeDate').on('changeDate',function(ev){
            var selectTime = (ev.date.valueOf().toDate().toUTCString().replace(' GMT', '')).toDate().getTime();
            var time = selectTime- selectTime%(5*60*1000).toDate().format('yyyy-MM-dd HH:mm:ss');
            $('#tabFrames .td-frame[title="'+ time +'"]').click();
        });

        _this.attachEvents();
        I18n.fillArea($('#modalCustom'));
    };

    ModalChartCustomConfig.prototype.recoverForm = function (modal) {
        if (Boolean(modal.modalText)) {
            this.$editor.html(modal.modalText);
        }
    };

    ModalChartCustomConfig.prototype.reset = function () {
    };

    ModalChartCustomConfig.prototype.attachEvents = function () {
        var _this = this;

        _this.$btnSubmit.off().click( function (e) {
            var modal = _this.options.modalIns.entity.modal;

            var customOption = $('#modalCustom').find('#editor');
            modal.modalText = customOption.html();
            modal.modalTextUrl = customOption.text();
            modal.option = new Object();
            modal.option.list = [];
            modal.points = [];
            var arraySpan = customOption.find('.pointValue');
            for (var i = 0, len = arraySpan.length; i < len; i++) {
                modal.option.list.push({dsItemId:arraySpan[i].id, name:arraySpan[i].title, data:0});
                modal.points.push(arraySpan[i].id);
            }
            modal.interval = _this.m_bIsRealTime ? _this.$selRealInterval.val() : _this.$selectHisInterval.val();
            modal.option.isRealTime = _this.m_bIsRealTime;
            modal.option.isHisFixCycle = _this.m_bIsHisFixCycle;
            if (_this.m_bIsHisFixCycle) {
                modal.option.timeStart = _this.$tmStart.val();
                modal.option.timeEnd = _this.$tmEnd.val();
            }
            else {
                var tmStart = new Date();
                var tmEnd = new Date();
                var periodVal = parseInt(_this.$inputPeriodVal.val());
                var periodUnit = _this.$selPeriUnit.val();
                switch (periodUnit) {
                    case 'hour':
                        var time = tmEnd.getTime() - 3600000 * periodVal;
                        tmStart.setTime(time);
                        break;
                    case 'day':
                        var time = tmEnd.getTime() - 86400000 * periodVal;
                        tmStart.setTime(time);
                        break;
                    case 'month':
                        var month = tmEnd.getMonth();
                        if (0 == month) {
                            tmStart.setFullYear(tmEnd.getFullYear() - 1);
                            tmStart.setMonth(11);
                        }
                        else {
                            tmStart.setMonth(month - 1);
                        }
                        break;
                    default :
                        break;
                }
                modal.option.timeStart = tmStart.format('yyyy-MM-dd HH:mm:ss');
                modal.option.timeEnd = tmEnd.format('yyyy-MM-dd HH:mm:ss');
                modal.option.timeCycleValue = _this.$inputPeriodVal.val();
                modal.option.timeCycleUnit = _this.$selPeriUnit.val();
            }

            // close modal
            _this.$modal.modal('hide');
            e.preventDefault();
        } );
    };

    return ModalChartCustomConfig;
} (jQuery, window));


var ModalChartCustom = (function(){
    function ModalChartCustom(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this._showConfig);
        this.modal = entityParams.modal;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.m_langFlag = ('zh' == localStorage['language']) ? 0 : 1;   // 0：zh，1：en
        this.spinner.spin(this.container);
    };
    ModalChartCustom.prototype = new ModalBase();
    ModalChartCustom.prototype.optionTemplate = {
        name:'toolBox.modal.CUSTOM_CHART',
        parent:0,
        mode:'custom',
        maxNum:10,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type:'ModalChartCustom'
    };

    ModalChartCustom.prototype.show = function() {
        this.init();
    }

    ModalChartCustom.prototype.init = function() {
    }

    ModalChartCustom.prototype.renderModal = function (e) {
        var _this = this;
        var optList = _this.modal.option.list;
        if (!optList) {
            _this.spinner.stop();
            return;
        }
        var len = optList.length;
        if (len > 0) {
            if (_this.modal.option.isRealTime) {
                var postData = {'dataSourceId': 0, 'dsItemIds': _this.modal.points};
                WebAPI.post('/analysis/startWorkspaceDataGenPieChart', postData).done(function (res) {
                    var data = res.dsItemList;
                    if (!data) {
                        return;
                    }
                    if (data.length > 0) {
                        for (var i = 0, len = data.length; i < len; i++) {
                            for (var j = 0, len2 = optList.length; j < len2; j++) {
                                if (optList[j].dsItemId == data[i].dsItemId) {
                                    optList[j].data = parseFloat(parseFloat(data[i].data).toFixed(2));
                                    break;
                                }
                            }
                        }
                        _this.updateModal(data);
                    }
                }).always(function (e) {
                    _this.spinner.stop();
                });
            }
            else {
                WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                    dsItemIds: _this.modal.points,
                    timeStart: _this.modal.option.timeStart,
                    timeEnd: _this.modal.option.timeEnd,
                    timeFormat: 'm5'
                }).done(function (dataSrc) {
                    if (!dataSrc || dataSrc.timeShaft.length <= 0) {
                        return;
                    }
                    _this.updateHistoryChart(dataSrc.list, dataSrc.timeShaft);
                }).error(function (e) {
                }).always(function (e) {
                    _this.spinner.stop();
                });
            }
        }
        else {
            try {
                var showOption = eval('({' + _this.modal.modalTextUrl + '})');
                _this.drawChart(showOption);
                _this.spinner.stop();
            }
            catch (e) {
                _this.spinner.stop();
                return;
            }
        }
    }

    ModalChartCustom.prototype.updateModal = function (src) {
        if (this.modal.option.isRealTime) {
            this.updateRealTimeChart(src);
        }
    }
    ModalChartCustom.prototype.showConfigModal = function () {
        this.configModal.setOptions({modalIns: this});
        this.configModal.show();
    }
    ModalChartCustom.prototype._showConfig = function () {
    }
    ModalChartCustom.prototype.setModalOption = function (option) {
    }
    ModalChartCustom.prototype.drawChart = function (chartOption) {
        this.chart.setOption(chartOption);
    }
    ModalChartCustom.prototype.close = function () {
    }
    ModalChartCustom.prototype.updateRealTimeChart = function (src) {
        var _this = this;
        if (!src) {
            return;
        }
        if (src.length > 0) {
            var optList = _this.modal.option.list;
            for (var m= 0, lenM=optList.length; m<lenM; m++) {
                for (var n= 0, lenN=src.length; n<lenN; n++) {
                    if (optList[m].dsItemId == src[n].dsItemId) {
                        optList[m].data = src[n].data;
                        break;
                    }
                }
            }

            var showOption = _this.modal.modalTextUrl;
            var arr = showOption.split('<%');
            for (var j = 1, len2 = arr.length; j < len2; j++) {
                var name = arr[j].split('%>')[0];
                if ('' == name) {
                    continue;
                }
                var data = -1;
                for (var k = 0, len3 = optList.length; k < len3; k++) {
                    if (optList[k].name == name) {
                        data = optList[k].data;
                        break;
                    }
                }
                if (-1 != data && Boolean(data)) {
                    if ('object' == typeof(data)) {
                        var temp;
                        for (var p= 0, lenP=data.length; p<lenP; p++) {
                            temp += data[p] + ',';
                        }
                        showOption = showOption.replace(name, temp);
                    }
                    else {
                        showOption = showOption.replace(name, data);
                    }
                }
            }
            showOption = showOption.replace(/"<%/g, '');
            showOption = showOption.replace(/%>"/g, '');
            try {
                showOption = eval('({' + showOption + '})');
                _this.drawChart(showOption);
            }
            catch (e) {
                _this.spinner.stop();
                return;
            }
        }
    }
    ModalChartCustom.prototype.updateHistoryChart = function (list, timeShaft) {
        var _this = this;
        if (!list) {
            return;
        }
        if (list.length > 0) {
            var infoList = [];

            var arrId = [];
            for (var i= 0, len=list.length; i<len; i++) {
                arrId.push(list[i].dsItemId);
            }
            var arrItem = AppConfig.datasource.getDSItemById(arrId);
            for (var i= 0, len=list.length; i<len; i++) {
                var id = list[i].dsItemId;
                for (var m = 0; m < arrItem.length; m++) {
                    if (id == arrItem[m].id) {
                        var itemName = arrItem[m].alias;
                        var item = {id:id, name:itemName, data:list[i].data};
                        infoList.push(item);
                        break;
                    }
                }
            }
            //for (var i= 0, len=list.length; i<len; i++) {
            //    var itemId = list[i].dsItemId;
            //    var itemName = AppConfig.datasource.getDSItemById(itemId).alias;
            //    var item = {id:itemId, name:itemName, data:list[i].data};
            //    infoList.push(item);
            //}

            var showOption = _this.modal.modalTextUrl;
            var arr = showOption.split('<%');
            for (var j = 1, len2 = arr.length; j < len2; j++) {
                var name = arr[j].split('%>')[0];
                if ('' == name) {
                    continue;
                }
                var data;
                for (var k = 0, len3 = infoList.length; k < len3; k++) {
                    if (infoList[k].name == name) {
                        data = infoList[k].data;
                        break;
                    }
                }
                if (Boolean(data)) {
                    if ('object' == typeof(data)) {
                        var temp = '';
                        for (var p= 0, lenP=data.length-1; p<lenP; p++) {
                            temp += data[p] + ',';
                        }
                        temp += data[lenP - 1];
                        showOption = showOption.replace(name, temp);
                    }
                    else {
                        showOption = showOption.replace(name, data);
                    }
                }
            }
            showOption = showOption.replace(/"<%/g, '');
            showOption = showOption.replace(/%>"/g, '');
            try {
                showOption = eval('({' + showOption + '})');
                if (!showOption.xAxis || 0 == showOption.xAxis.length) {
                    var arrAxis = [{
                        type : 'category',
                        boundaryGap : false,
                        data : timeShaft
                    }];
                    showOption.xAxis = arrAxis;
                }
                else if (!showOption.xAxis[0].data || 0 == showOption.xAxis[0].data.length) {
                    showOption.xAxis[0].data = timeShaft;
                }
                _this.drawChart(showOption);
            }
            catch (e) {
                _this.spinner.stop();
                return;
            }
        }
    }

    ModalChartCustom.prototype.configModal = new ModalChartCustomConfig();

    return ModalChartCustom;
})();
/**
 * Created by RNBtech on 2015/8/13.
 */
/**
 * Created by RNBtech on 2015/6/18.
 */
var ModalPointKPI = (function(){
    function ModalPointKPI(screen, entityParams) {
        if (!entityParams) return;
        this.isConfigMode = false;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    ModalPointKPI.prototype = new ModalBase();
    ModalPointKPI.prototype.optionTemplate = {
        name:'toolBox.modal.POINT_KPI',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 30,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalPointKPI'
    };

    ModalPointKPI.prototype.show = function(){
        this.init();
    }

    ModalPointKPI.prototype.init = function(){
        this.pointKPIWiki = undefined;
    }

    ModalPointKPI.prototype.renderModal = function (e) {
        var _this = this, tempHtml = '', level = 1, rootId;//节点在树的第几层,根节点是0层
        this.spinner && this.spinner.stop();
        if(!(this.entity.modal.option && this.entity.modal.option.kpiList)) return
        this.entity.modal.option.kpiList.forEach(function(kpiItem){
                traverseTree(kpiItem);
            });
        $(this.container).append(tempHtml);
        //遍历树结构,渲染每一个PointKPI
        function traverseTree(tree) {
            //渲染根节点
            new PointKPIItem(tree, _this, 0);
            rootId = tree.id;
            traverse(tree, 0);
        }
        function traverse(node, i) {//广度优先遍历
            var children = node.list;
            node.pointPassData = [];
            node.show = true;
            if (children != null && children.length > 0) {
                //渲染子节点
                if(node.parentId == rootId){
                    level = 2;//重置level
                }
                new PointKPIItem(children[i], _this, level);

                if (i == children.length - 1) {//如果孩子节点已遍历完
                    for(var j = 0; j < children.length; j++){
                        j == 0 && level++;
                        traverse(children[j], 0);//第i个孩子节点作为父节点
                    }
                } else {//遍历父节点的i+1个孩子节点
                    traverse(node, i + 1);
                }
            }
        }
    }

    ModalPointKPI.prototype.showConfigMode = function () {
    }

    ModalPointKPI.prototype.updateModal = function (points) {

    }

    ModalPointKPI.prototype.configure = function(){
        var _this = this;
        this.spinner && this.spinner.stop();
        this.isConfigMode = true;

        if (this.chart) this.chart.clear();
        this.divResizeByMouseInit();

        var divMask = document.createElement('div');
        divMask.className = 'springConfigMask';
        divMask.draggable = 'true';

        var btnHeightResize = document.createElement('div');
        var maxHeight = this.optionTemplate.maxHeight;
        var maxWidth = this.optionTemplate.maxWidth;
        var minHeight = this.optionTemplate.minHeight;
        var minWidth = this.optionTemplate.minWidth;
        btnHeightResize.className = 'divResize divHeightResize';
        btnHeightResize.innerHTML = '<label for="heightResize" >H: </label>' +
        '<input type="range" class="inputResize" id="heightResize" name="points" step="0.5" min="' + minHeight + '" max="' + maxHeight + '" value="' + _this.entity.spanR + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanR + ' /6</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanR + '"/>';
        divMask.appendChild(btnHeightResize);
        var btnWidthResize = document.createElement('div');
        btnWidthResize.className = 'divResize divWidthResize';
        btnWidthResize.innerHTML = '<label for="widthResize" >W: </label>' +
        '<input type="range" class="inputResize" id="widthResize" name="points" step="0.5" min="' + minWidth + '" max="' + maxWidth + '" value="' + _this.entity.spanC + '"/>' +
        '<h5 class="rangeVal">' + _this.entity.spanC + ' /12</h5>' +
        '<input type="text" class="rangeChange" value="' + _this.entity.spanC + '"/>';
        divMask.appendChild(btnWidthResize);

        var divTitleAndType = document.createElement('div');
        divTitleAndType.className = 'divTitleAndType';
        divMask.appendChild(divTitleAndType);

        var $divTitle = $('<div class="divResize chartTitle">');
        var $labelTitle = $('<label for="title">').text(I18n.resource.dashboard.show.TITLE);
        var inputChartTitle = document.createElement('input');
        inputChartTitle.id = 'title';
        inputChartTitle.className = 'form-control';
        inputChartTitle.value = this.entity.modal.title;
        inputChartTitle.setAttribute('placeholder',I18n.resource.dashboard.show.TITLE_TIP);
        if(this.entity.modal.title != ''){
            inputChartTitle.style.display = 'none';
        }
        inputChartTitle.setAttribute('type','text');
        $divTitle.append($labelTitle).append($(inputChartTitle));
        divTitleAndType.appendChild($divTitle[0]);

        var $divType = $('<div class="divResize chartType">');
        var $labelType = $('<label>').text(I18n.resource.dashboard.show.TYPE);
        var chartType = document.createElement('span');
        chartType.innerHTML = I18n.findContent(this.optionTemplate.name);
        $divType.append($labelType).append($(chartType));
        divTitleAndType.appendChild($divType[0]);

        var chartTitleShow = document.createElement('p');
        chartTitleShow.innerHTML = inputChartTitle.value;
        chartTitleShow.className = 'chartTitleShow';
        $divTitle[0].appendChild(chartTitleShow);
        if(this.entity.modal.title == '' || this.entity.modal.title == undefined){
            chartTitleShow.style.display = 'none';
        }
        chartTitleShow.onclick = function(){
            chartTitleShow.style.display = 'none';
            inputChartTitle.style.display = 'inline-block';
            inputChartTitle.focus();
        };
        inputChartTitle.onblur = function(){
            if (inputChartTitle.value != ''){
                inputChartTitle.style.display = 'none';
                chartTitleShow.style.display = 'inline';
            }
            chartTitleShow.innerHTML = inputChartTitle.value;
            _this.entity.modal.title = inputChartTitle.value;
        };

        //var $btnConfig = $('<span class="glyphicon glyphicon-cog springConfigBtn"></span>');
        var $btnRemove = $('<span class="glyphicon glyphicon-remove-circle springConfigRemoveBtn"></span>');
        var $btnAdd = $('<span class="glyphicon glyphicon-remove-circle springConfigRemoveBtn addTree" style="transform: rotateZ(45deg);color: #333;right: 50px !important;"></span>');
        divMask.appendChild($btnAdd[0]);
        //divMask.appendChild($btnConfig[0]);
        divMask.appendChild($btnRemove[0]);

        this.container.parentNode.appendChild(divMask);
        this.divResizeByToolInit();


        //drag event of replacing entity
        var divContainer = $(this.container).closest('.springContainer')[0];
        divMask.ondragstart = function (e) {
            //e.preventDefault();
            e.dataTransfer.setData("id", $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', ''));
        };
        divMask.ondragover = function (e) {
            e.preventDefault();
        };
        divMask.ondragleave = function (e) {
            e.preventDefault();
        };
        divContainer && (divContainer.ondrop = function (e) {
            e.stopPropagation();
            var sourceId = e.dataTransfer.getData("id");
            var $sourceParent, $targetParent;
            if (sourceId) {
                var targetId = $(e.target).closest('.springContainer').get(0).id.replace('divContainer_', '');
                if(sourceId == targetId) return;
                $sourceParent = $('#divContainer_' + sourceId).parent();
                $targetParent = $('#divContainer_' + targetId).parent();
                //外部chart拖入组合图
                if(!$sourceParent[0].classList.contains('chartsCt') && $targetParent[0].classList.contains('chartsCt')){
                    _this.screen.insertChartIntoMix(sourceId, $(e.target).closest('.chartsCt')[0])
                }else{//平级之间交换
                    if(_this.screen.screen){//组合图内部交换
                        _this.screen.screen.replaceEntity(sourceId, targetId, _this.screen.entity.id);
                    }else{
                        _this.screen.replaceEntity(sourceId, targetId);
                    }
                }
            }
            _this.screen.isScreenChange = true;
        })
         //选择周期
        var $select = '<div class="form-group" style="position: absolute;top: 5px;left: 5px;">\
            <label for="inputEmail3" class="col-sm-2 control-label" style="height: 34px;line-height: 34px;">Cycle</label>\
            <div class="col-sm-8" style="display:inline-block;">\
                <select id="selectCycle" class="form-control" style="width: 100px;padding: 0;"> \
                    <option value="month">'+ I18n.resource.dashboard.modalPointKPI.MONTH +'</option> \
                    <option value="season">'+ I18n.resource.dashboard.modalPointKPI.QUARTER +'</option> \
                    </select>\
            </div>\
            </div>';
        $(this.container).append($select);
        var $selectCycle = $(this.container).find('#selectCycle');
        if(_this.entity.modal.option && _this.entity.modal.option.dateCycle && _this.entity.modal.option.dateCycle == 'season'){
            $selectCycle.find('option:nth-of-type(2)')[0].selected = 'selected';
        }else{
            $selectCycle.find('option:nth-of-type(1)')[0].selected = 'selected';
        }
        $selectCycle[0].onchange = function(){
            _this.entity.modal.option.dateCycle = $selectCycle[0].value;
        }
        var $chartCt = $('<div class="divResize chartsCt gray-scrollbar" style="overflow:auto;">');
        $chartCt.append($(this.container));
        divMask.appendChild($chartCt[0]);

        //如果domTree的宽度超出显示范围的宽度,
        if($('.level_2').width() > ($chartCt.width() - 320)){
            $('.domTree', $chartCt).width($('.level_2').width() + 40);
        }
        //如果存在根节点,则$btnAdd disabled
        if($(this.container).find('.domTree').length == 1){
           $btnAdd.attr('title','Already exists a root').addClass('btnDisabled');
        }

        this.executeConfigMode();

        $btnRemove.off('click').on('click',function(){
            if (_this.chart) _this.chart.clear();
            if(_this.screen.screen){//兼容ModalMix
                _this.screen.screen.removeEntity(_this.entity.id);
            }else{
                _this.screen.removeEntity(_this.entity.id);
            }

            $('#divContainer_' + _this.entity.id).remove();
            _this = null;
        });
        $btnAdd.off('click').on('click',function(){
            if($(_this.container).find('.domTree').length == 0){
                new PointKPIItem({parentId: ''}, _this, 0);
                $('#divContainer_'+ _this.entity.id).find('.addTree').attr('title','Already exists a root').addClass('btnDisabled');
                _this.screen.isScreenChange = true;
            }
        });
    }

    ModalPointKPI.prototype.initContainer = function(replacedElementId){
        var _this = this;
        var divParent = document.getElementById('divContainer_' + this.entity.id);
        var isNeedCreateDivParent = false;
        var scrollClass = ' gray-scrollbar';

        if ((!divParent) || replacedElementId) {
            isNeedCreateDivParent = true;
        }

        if (isNeedCreateDivParent) {
            divParent = document.createElement('div');
            divParent.id = 'divContainer_' + this.entity.id;
        }
        //get container
        if (replacedElementId) {
            var $old = $('#divContainer_' + replacedElementId);
            $(divParent).insertAfter($old);
            $old.remove();
        }
        else {
            isNeedCreateDivParent && this.screen.container.appendChild(divParent);
        }

        divParent.className = 'springContainer';
        //adapt ipad 1024px
        if (AppConfig.isMobile) {
            divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR * 2 + '%';
            divParent.style.width = this.UNIT_WIDTH * this.entity.spanC * 2 + '%';
        } else {
            divParent.style.height = this.UNIT_HEIGHT * this.entity.spanR + '%';
            divParent.style.width = this.UNIT_WIDTH * this.entity.spanC + '%';
        }

        if (this.entity.modal.title && this.entity.modal.title != '' && (!this.entity.isNotRender)) {
            divParent.innerHTML = '<div class="panel panel-default">\
                <div class="panel-heading springHead">\
                    <h3 class="panel-title" style="font-weight: bold;">' + this.entity.modal.title + '</h3>\
                </div>\
                <div class="panel-body springContent' + scrollClass + '" style="overflow:auto;"></div>\
            </div>';
        } else {
            divParent.innerHTML = '<div class="panel panel-default" style="background: none;">\
                <div class="panel-body springContent' + scrollClass + '" style="height:100%;overflow:auto;"></div>\
            </div>';
        }

        //按钮容器:锚链接,历史数据,wiki
        var divBtnCtn = document.createElement('div');
        divBtnCtn.className = 'springLinkBtnCtn';

        var domPanel = divParent.getElementsByClassName('panel')[0];
        //show history start

        var lkHistory = document.createElement('a');
        lkHistory.className = 'springLinkBtn';
        lkHistory.title = 'Show History';
        lkHistory.href = 'javascript:;';
        lkHistory.innerHTML = '<span class="glyphicon glyphicon-stats"></span>';
        divBtnCtn.appendChild(lkHistory);

        lkHistory.onclick = function(){
            var dataTree = _this.entity.modal.option.kpiList[0];
            var dateCycle = !_this.entity.modal.option.dateCycle ? 'month' : _this.entity.modal.option.dateCycle;
            if (Boolean(dataTree)) {
                new ModalPointKpiGrid(dataTree, dateCycle).show();
            }
        };

        //show history end

        domPanel.appendChild(divBtnCtn);

        this.initToolTips(divParent.getElementsByClassName('springHead'));
        this.container = divParent.getElementsByClassName('springContent')[0];
    }

    ModalPointKPI.prototype.setModalOption = function (option) {
        this.entity.modal.interval = 5;
    }

    return ModalPointKPI;
})();

var PointKPIItem = (function(){
    function PointKPIItem(item, entity, i){//i 树结构的第i层, 从0开始,0代表根节点
        this.parentArgt = entity;
        this.entity = entity.entity;
        this.container = entity.container;

        this.kpiItem = {
            id: !item.id ? new Date().getTime() : item.id,
            parentId: !item.parentId ? '': item.parentId,
            name: !item.name ? 'Unaming': item.name,
            pointKPI: !item.pointKPI ? '': item.pointKPI,
            pointGrade: !item.pointGrade ? '': item.pointGrade,
            pointPass: !item.pointPass ? '': item.pointPass,
            rule: !item.rule ? '': item.rule,
            weight: !item.weight ? '': item.weight,
            wikiId: !item.wikiId ? '': item.wikiId,
            list: !item.list ? []: item.list
        };
        if(i === 0 && !item.id && item.parentId == ''){
            !this.entity.modal.option && (this.entity.modal.option = {});
            !this.entity.modal.option.kpiList && (this.entity.modal.option.kpiList = []);
            this.entity.modal.option.kpiList.push(this.kpiItem);
        }
        this.addItemDom(this.kpiItem, i)
        this.attachEventsItem(this.kpiItem);
    }

    PointKPIItem.prototype.addItem = function(id){//id-->该id节点下降增加子节点
        var _this = this;
        var level = 1;
        var pointKPIItem;

        this.entity.modal.option.kpiList.forEach(function(kpiItem){
            traverseTree(kpiItem);
        });
        function traverseTree(tree) {
            traverse(tree, 0);
        }
        function traverse(node, i) {
            var children = node.list;
            if(id == node.id){
                pointKPIItem = new PointKPIItem({parentId: id}, _this.parentArgt, level);
                node.list.push(pointKPIItem.kpiItem);
                return;
            }
            if (children != null && children.length > 0) {
                if (i == children.length - 1) {
                    for(var j = 0; j < children.length; j++){
                        j == 0 && level++;
                        traverse(children[j], 0);
                    }
                } else {
                    traverse(node, i + 1);
                }
            }
        }
    }

    var btn_tpl =  '\
            <div class="btnGroup">\
                <span class="glyphicon glyphicon-remove-circle btnAddItem" style="transform: rotateZ(45deg);"></span>\
                <span class="glyphicon glyphicon-cog btnConfigItem"></span>\
                <span class="glyphicon glyphicon-info-sign btnConfigWiki"></span>\
                <span class="glyphicon glyphicon-remove-circle btnRemoveItem"></span>\
                <span class="glyphicon glyphicon-info-sign btnViewWiki{isShow}" wikiId="{wikiId}"></span>\
            </div>';

    PointKPIItem.prototype.tpl = {
        treeWrap: '<div class="domTree"></div>',
        level_1_Tpl: '\
            <div class="totalLevel">\
                <div class="itemWrap" id="kpi_{id}">\
                    <div class="hrLine"></div>\
                    <span class="pointName">{name}</span>\
                    <span class="glyphicon glyphicon-pencil"></span>\
                    <div class="circle {bgColor}">\
                        <div class="active-border active-border_{bgColor}" data-value=""></div>\
                        <span>{pointPassVal}</span>\
                    </div>'+ btn_tpl +
                '</div>\
            </div>',
        level_2_Ctn: '\
            <div class="level_2">\
                <div class="hrLine1"></div>\
                <ul></ul>\
            </div>',
        level_2_Tpl: '<li class="level_3" parentId="{parentId}" id="item_{id}">\
            	<div class="thirdCon1">\
                	<div class="itemWrap" id="kpi_{id}">\
                	    <div class="circle {bgColor}">\
                	        <div class="active-border active-border_{bgColor}" data-value=""></div>\
                	        <span>{pointPassVal}</span>\
                	    </div>\
                	    <span class="pointName">{name}</span><span class="glyphicon glyphicon-pencil"></span><br class="clear"><div class="hrLine2"></div>'+ btn_tpl +'</div>\
                </div>\
                <ul class="childLevel">\
                </ul>\
            </li>',
        level_3_Tpl: '<li parentId="{parentId}" id="item_{id}">\
                <div class="hrLine3"></div>\
                <div class="itemWrap" id="kpi_{id}">\
                    <div class="smCircle {bgColor}">\
                        <div class="active-border active-border_{bgColor}" data-value=""></div>\
                        <span>{pointPassVal}</span>\
                    </div>\
                    <span class="pointName">{name}</span>\
                    <span class="glyphicon glyphicon-pencil"></span><br class="clear">\
                    <div class="hrLine4"></div>'+ btn_tpl +
                '</div>\
                <ul class="childLevel">\
                </ul>\
            </li>'
    }

    PointKPIItem.prototype.addItemDom = function(kpiItem, i){
        var kpiItemForEl = {
            id: kpiItem.id,
            parentId: kpiItem.parentId,
            name: kpiItem.name,
            isShow: kpiItem.wikiId != '' ? ' showWiki': '',
            pointPassVal: kpiItem.pointPass != '' ? I18n.resource.dashboard.modalPointKPI.UNPASS : I18n.resource.dashboard.modalPointKPI.PASS,
            bgColor: kpiItem.pointPass != '' ? 'unpass': 'pass'
        }
        //根节点
        var $domTree = $(this.container).children('.domTree'), $level_2_ul, $level_3_ul;
        $domTree && ($level_2_ul = $domTree.find('.level_2>ul'));
        $level_2_ul && ($level_3_ul = $level_2_ul.find('#item_' + kpiItem.parentId + ' > .childLevel'));

        if(kpiItem.parentId == ''){//level 0
            $(this.container).append(this.tpl.treeWrap);
            $domTree = $(this.container).children('.domTree');
            $domTree.html(this.tpl.level_1_Tpl.formatEL(kpiItemForEl));
        }else if(i == 1 && $domTree){//level 1
            if($level_2_ul.length == 0){
                $domTree.append(this.tpl.level_2_Ctn);
                $level_2_ul = $domTree.find('.level_2>ul');
            }
            //当二级KPI长度超出显示区域后增加domTree的长度,显示滚动条
            if($domTree.parent().width() - $level_2_ul.width() < 270){
                $domTree.width($domTree.width() + 255);
            }
            $level_2_ul.append(this.tpl.level_2_Tpl.formatEL(kpiItemForEl))

        }else if($level_2_ul){//
            $level_3_ul.append(this.tpl.level_3_Tpl.formatEL(kpiItemForEl));
            if($level_3_ul.find('.itemWrap').width() < 140){//隐藏添加下级item功能
                $level_3_ul.find('.btnAddItem').hide();
            }
        }
    }

    PointKPIItem.prototype.removeItem = function(id){
        var _this = this;
        this.entity.modal.option.kpiList.forEach(function(kpiItem, index){
            if(kpiItem.id == id && kpiItem.parentId == ''){//如果是根节点直接删除
                _this.entity.modal.option.kpiList.splice(index, 1);
                $('#kpi_' + id).closest('.domTree').remove();
                $('#divContainer_'+ _this.entity.id).find('.addTree').removeClass('btnDisabled').attr('title','');
            }else{
                traverseTree(kpiItem);
            }
        });
        function traverseTree(tree) {
            traverse(tree, 0);
        }
        function traverse(node, i) {
            var children = node.list;
            if (children != null && children.length > 0) {
                if(id == children[i].id){
                    node.list.splice(i, 1);
                    $('#kpi_' + id).closest('li').remove();
                    return;
                }else{
                    if (i == children.length - 1) {
                        for(var j = 0; j < children.length; j++){
                            traverse(children[j], 0);
                        }
                    } else {
                        traverse(node, i + 1);
                    }
                }
            }
        }
    }

    PointKPIItem.prototype.showConfigModal = function(){
        var _this = this, $modalConfig = $('#modalConfig');
        var tempHtml = '\
            <div class="modal-body" id="pointKPI">\
                <div class="form-horizontal">\
                    <div class="form-group">\
                        <label class="col-md-3 control-label" for="divKPI">KPI</label>\
                        <div class="col-md-4">\
                            <div class="drop-area" id="divKPI">\
                                <span class="glyphicon glyphicon-plus"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-group">\
                        <label class="col-md-3 control-label" for="divGrade">Grade</label>\
                        <div class="col-md-4">\
                            <div class="drop-area" id="divGrade">\
                                <span class="glyphicon glyphicon-plus"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-group">\
                        <label class="col-md-3 control-label" for="divIsPass">Is pass</label>\
                        <div class="col-md-4">\
                            <div class="drop-area" id="divIsPass">\
                                <span class="glyphicon glyphicon-plus"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-group">\
                        <label class="col-md-3 control-label" for="divDashboard">Config dashboard</label>\
                        <div class="col-md-4">\
                            <button type="button" id="btnDashboard" class="btn btn-default">Config</button>\
                        </div>\
                    </div>\
                </div>\
            </div>';

        $modalConfig.off('show.bs.modal').on('show.bs.modal', function (e) {
            var pointKPIAlias = AppConfig.datasource.getDSItemById(_this.kpiItem.pointKPI).alias;
            var pointGradeAlias = AppConfig.datasource.getDSItemById(_this.kpiItem.pointGrade).alias;
            var pointPassAlias = AppConfig.datasource.getDSItemById(_this.kpiItem.pointPass).alias;
            $modalConfig.find('.modal-body').hide();
            $modalConfig.find('.modal-footer').before(tempHtml);
            $modalConfig.find('#divKPI').attr('data-value', _this.kpiItem.pointKPI).attr('title',pointKPIAlias).html(pointKPIAlias);
            $modalConfig.find('#divGrade').attr('data-value', _this.kpiItem.pointGrade).attr('title',pointKPIAlias).html(pointGradeAlias);
            $modalConfig.find('#divIsPass').attr('data-value', _this.kpiItem.pointPass).attr('title',pointKPIAlias).html(pointPassAlias);
            if(pointPassAlias){
                $modalConfig.find('#startConfig').removeClass('disabled');
            }
            _this.parentArgt.screen.modalConfigPane.toggleDataSource(true);
            _this.attachEventsConfig($modalConfig)
        });
        $modalConfig.off('hidden.bs.modal').on('hidden.bs.modal', function () {
            $modalConfig.find('#pointKPI').remove();
            _this.parentArgt.screen.modalConfigPane.toggleDataSource(false);
        });
        $modalConfig.modal('show');
    }

    PointKPIItem.prototype.viewDetail = function(){
        var $dialog = $('#dialogModal');
        var energyScreen = new EnergyScreen();
        var $dialogContent = $dialog.find('#dialogContent').css({height: '90%', width: '90%', margin: 'auto', marginTop: '2.5%', backgroundColor: '#fff'});
        $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
            $dialogContent.removeAttr('style').html('');
            energyScreen.workerUpdate && energyScreen.workerUpdate.terminate();
        }).modal({});

        energyScreen.id = this.kpiItem.id + '_' + AppConfig.userId;
        energyScreen.container = $dialogContent[0];
        energyScreen.isForBencMark = true;
        energyScreen.init();
    }

    PointKPIItem.prototype.attachEventsItem = function(kpiItem){
        var $kpiWrap = $('#kpi_' + kpiItem.id), _this = this;

        $('.btnAddItem', $kpiWrap).off().on('click', function(e){
            e.stopPropagation();
            _this.addItem(_this.kpiItem.id);
            _this.parentArgt.screen.isScreenChange = true;
        });
        $('.btnRemoveItem', $kpiWrap).off().on('click', function(e){
            e.stopPropagation();
            _this.removeItem(_this.kpiItem.id);
            //第一层子节点remove时判断是否需要重置宽度
            var $domTree = $('.domTree');
            if($(this).closest('.thirdCon1').length == 1 && $domTree.width() - $('.level_2').width() > 260){
                $domTree.width($domTree.width() - 255);
            }
            _this.parentArgt.screen.isScreenChange = true;
        });
        $('.btnConfigItem', $kpiWrap).off().on('click', function(e){
            e.stopPropagation();
            _this.showConfigModal();
        });
        $('.btnConfigWiki', $kpiWrap).off().on('click', function(e){
            e.stopPropagation();
            //if exist wiki,show wiki editor page
            if(_this.kpiItem.wikiId){
                _this.showWikiEditModal();
            }else{
                _this.showWikiSearchModal();
            }
        });
        $('.btnViewWiki', $kpiWrap).off().on('click', function(e){
            e.stopPropagation();
            _this.viewWikiInfoModal();
        });
        $('.glyphicon-pencil', $kpiWrap).off().on('click', function(e){
             e.stopPropagation();
            if(_this.parentArgt.isConfigMode == true){
                _this.editPointKPIName();
            }
        });
        $kpiWrap.off().on('click', function(e){
            e.stopPropagation();
            if(_this.parentArgt.isConfigMode == false){
                _this.viewDetail(_this.kpiItem.id);
            }
        });

    }

    PointKPIItem.prototype.attachEventsConfig = function($modalConfig){
        var _this = this;
        var $dropArea = $modalConfig.find('.drop-area');
        var $btnConfig = $modalConfig.find('#startConfig');
        var $btnDashboard = $modalConfig.find('#btnDashboard');
        $dropArea.off('dragover').on('dragover', function (e) {
            e.preventDefault();
        });
        $dropArea.off('dragenter').on('dragenter', function (e) {
            $(e.target).addClass('on');
            e.preventDefault();
            e.stopPropagation();
        });
        $dropArea.off('dragleave').on('dragleave', function (e) {
            $(e.target).removeClass('on');
            e.stopPropagation();
        });
        $dropArea.off('drop').on('drop', function (e) {
            var itemId = EventAdapter.getData().dsItemId;
            var $target = $(e.target);
            var name;
            if(!itemId) return;
            $target.removeClass('on');
            name = AppConfig.datasource.getDSItemById(itemId).alias;
            $target.attr({'data-value': itemId, 'title': name});
            $target.html('<span>'+name+'</span>');
            e.stopPropagation();

            if($target.attr('id') == 'divIsPass'){
                $btnConfig.removeClass('disabled');
            }
            _this.parentArgt.screen.isScreenChange = true;
        });

        $btnConfig.off().on('click', function(){
            var KPI = $('#divKPI').attr('data-value');
            var grade = $('#divGrade').attr('data-value');
            var pass = $('#divIsPass').attr('data-value');
            _this.kpiItem.pointKPI = !KPI ? '': KPI;
            _this.kpiItem.pointGrade = !grade ? '': grade;
            _this.kpiItem.pointPass = !pass ? '': pass;

            _this.entity.modal.option.kpiList.forEach(function(kpiItem){
                traverseTree(kpiItem);
            });
            function traverseTree(tree) {
                traverse(tree, 0);
            }
            function traverse(node, i) {
                var children = node.list;
                if(node.id == _this.kpiItem.id){
                    node.pointKPI = _this.kpiItem.pointKPI;
                    node.pointGrade = _this.kpiItem.pointGrade;
                    node.pointPass = _this.kpiItem.pointPass;
                    return;
                }
                if (children != null && children.length > 0) {
                    if (i == children.length - 1) {
                        for(var j = 0; j < children.length; j++){
                            traverse(children[j], 0);
                        }
                    } else {
                        traverse(node, i + 1);
                    }
                }
            }
            $('#modalConfig').modal('hide');
        });

        $btnDashboard.off('click').on('click', function(){
            ScreenManager.show(EnergyScreen, _this.kpiItem.id + '_' + AppConfig.userId);
        });
    }

    PointKPIItem.prototype.showWikiSearchModal = function(){
        if(!(this.pointKPIWiki && this.pointKPIWiki.parent.kpiItem.id == this.kpiItem.id)){
            this.pointKPIWiki = new ModalWiki(this);
        }
        this.pointKPIWiki.showWikiSearch();
    }

    PointKPIItem.prototype.showWikiEditModal = function(){
        if(!(this.pointKPIWiki && this.pointKPIWiki.parent.kpiItem.id == this.kpiItem.id)){
            this.pointKPIWiki = new ModalWiki(this);
        }
        this.pointKPIWiki.getWikiById();
    }

    PointKPIItem.prototype.viewWikiInfoModal = function(){
        if(!(this.pointKPIWiki && this.pointKPIWiki.parent.kpiItem.id == this.kpiItem.id)){
            this.pointKPIWiki = new ModalWiki(this);
        }
        this.pointKPIWiki.viewWikiInfo(this.kpiItem.wikiId);
    }

    PointKPIItem.prototype.editPointKPIName = function(){
        var _this = this, $divKPI = $('#kpi_' + this.kpiItem.id), $input = $divKPI.find('.pointNameInput'),$springConfigMask;
        if($input.length == 0){
            var $input = $('<input type="text" class="form-control pointNameInput"/>').val(_this.kpiItem.name);
            var $spanName = $('.pointName','#kpi_' + this.kpiItem.id).hide().after($input);
            $springConfigMask = $divKPI.closest('.springConfigMask[draggable="true"]').attr('draggable',false);
            $input.blur(function(){
                savePointName(this);
            }).keyup(function(e){
                if(e.keyCode == 13){
                    savePointName(this);
                }
            });

        }else{
            savePointName($input[0]);
        }

        function savePointName(divInput){
            _this.kpiItem.name = $(divInput).val();
            $(divInput).remove();
            $spanName.html(_this.kpiItem.name).show();
            $springConfigMask.attr('draggable',true);
            _this.parentArgt.entity.modal.option.kpiList.forEach(function(kpiItem){
                traverseTree(kpiItem);
            });
            _this.parentArgt.screen.isScreenChange = true;
            function traverseTree(tree) {
                traverse(tree, 0);
            }
            function traverse(node, i) {
                var children = node.list;
                if(node.id == _this.kpiItem.id){
                    node.name = _this.kpiItem.name;
                    return;
                }
                if (children != null && children.length > 0) {
                    if (i == children.length - 1) {
                        for(var j = 0; j < children.length; j++){
                            traverse(children[j], 0);
                        }
                    } else {
                        traverse(node, i + 1);
                    }
                }
            }
        }
    }

    return PointKPIItem;
})();
var ModalPointKpiGrid = (function () {
	var _this;
    function ModalPointKpiGrid(data, dateCycle) {
        if (Boolean(data)) {
            this.m_kpiDataTree = data;
            this.m_dateCycle = dateCycle;
            this.m_selectYear = 0;
            this.m_htmlPage;
            this.m_htmlTreeTemp;
            this.m_htmlGridTemp;
            this.m_bIsCurrentYear = false;
            this.m_nCurrentSeason = 0;
            this.m_nCurrentMonth = 0;
            this.m_strGood = '达标';
            this.m_strBad = '未达标';
            this.m_strCurrentGood = '当前达标';
            this.m_strCurrentBad = '当前超标';
            this.m_strCurrentWarn = '警戒';
            this.m_nStartYear = 0;
            this.m_nEndYear = 0;
            _this = this;
        }
    }

    ModalPointKpiGrid.prototype = new ModalPointKpiGrid();

    ModalPointKpiGrid.prototype.show = function() {
        this.init();
    }
    ModalPointKpiGrid.prototype.init = function () {
        WebAPI.get('/static/views/observer/widgets/modalPointKpiGrid.html').done(function (resultHtml) {
            _this.m_htmlPage = $(resultHtml);

            // time control
            var timeControl = _this.m_htmlPage.find('#timeSelect');
            var tmNow = new Date();
            var tmStart = new Date();
            tmStart.setFullYear(tmNow.getFullYear() - 10);
            _this.m_nStartYear = tmStart.getFullYear();
            _this.m_nEndYear = tmNow.getFullYear();
            timeControl.val(tmNow.format('yyyy'));
            timeControl.datetimepicker({
                format: 'yyyy',
                startView: 'decade',
                minView: 'decade',
                autoclose: true,
                todayBtn: false,
                pickerPosition: 'bottom-right',
                initialDate: tmNow,
                startDate: tmStart,
                endDate: tmNow,
                keyboardNavigation: false
            }).off('changeDate').on('changeDate',function(ev){
                //var selectTime = (ev.date.valueOf().toDate().toUTCString().replace(' GMT', '')).toDate().getTime();
                //var time = selectTime- selectTime%(5*60*1000).toDate().format('yyyy');
                //$('#tabFrames .td-frame[title="'+ time +'"]').click();

                _this.m_selectYear = timeControl.val();
                var tmNow = new Date();
                var nCurYear = tmNow.getFullYear();
                if (nCurYear == _this.m_selectYear) {
                    _this.m_nCurrentMonth = tmNow.getMonth();
                    _this.m_nCurrentSeason = Math.floor(_this.m_nCurrentMonth / 3);
                    _this.m_bIsCurrentYear = true;
                }
                else {
                    _this.m_bIsCurrentYear = false;
                }
                _this.postDataShow(false);
            });

            var yearPre = _this.m_htmlPage.find('#btnYearPre');
            if (Boolean(yearPre)) {
                yearPre.click(function (e) {
                    var year = parseInt(timeControl.val());
                    if (year <= _this.m_nStartYear) {
                        year = _this.m_nStartYear;
                        return;
                    }
                    else {
                        year -= 1;
                    }
                    timeControl.val(year);
                    _this.timeSetting(timeControl.val());
                    _this.postDataShow(false);
                });
            }

            var yearNext = _this.m_htmlPage.find('#btnYearNext');
            if (Boolean(yearNext)) {
                yearNext.click(function (e) {
                    var year = parseInt(timeControl.val());
                    if (year >= _this.m_nEndYear) {
                        year = _this.m_nEndYear;
                        return;
                    }
                    else {
                        year += 1;
                    }
                    timeControl.val(year);
                    _this.timeSetting(timeControl.val());
                    _this.postDataShow(false);
                });
            }

            var tmNow = new Date();
            _this.m_selectYear = tmNow.getFullYear();
            _this.m_nCurrentMonth = tmNow.getMonth();
            _this.m_nCurrentSeason = Math.floor(_this.m_nCurrentMonth / 3);
            _this.m_bIsCurrentYear = true;
            _this.postDataShow(true);
            //_this.m_htmlPage.modal('show');

        }).always(function () {});
    }
    ModalPointKpiGrid.prototype.postDataShow = function (bIsFirst) {
        var ptPassArray = [];   // 从树中获取id放入该数组中
        ptPassArray = _this.recursiveTreeGetPointPassId(_this.m_kpiDataTree);
        var tmStart = new Date();
        tmStart.setMonth(0);
        tmStart.setDate(1);
        tmStart.setHours(0);
        tmStart.setMinutes(0);
        tmStart.setSeconds(0);
        var tmEnd = new Date();
        if (!bIsFirst && tmStart.getFullYear() != _this.m_selectYear) {
            tmStart.setFullYear(_this.m_selectYear);
            tmEnd.setFullYear(_this.m_selectYear);
            tmEnd.setMonth(11);
            tmEnd.setDate(31);
            tmEnd.setHours(23);
            tmEnd.setMinutes(59);
            tmEnd.setSeconds(59);
        }
        var postData = {};
        postData.dataSourceId = '';
        postData.dsItemIds = ptPassArray;
        postData.timeStart = tmStart.format('yyyy-MM-dd hh:mm:ss');
        postData.timeEnd = tmEnd.format('yyyy-MM-dd hh:mm:ss');
        postData.timeFormat = 'M1';

        if (bIsFirst) {
            Spinner.spin($('#paneCenter')[0]);
        }
        else {
            Spinner.spin(_this.m_htmlPage[2]);
        }

        var tree = _this.m_htmlPage.find('#treeCtl');
        tree.html('');
        var table = _this.m_htmlPage.find('#tableCtl');
        table.html('');
        WebAPI.post('/analysis/startWorkspaceDataGenHistogram', postData).done(function (res) {
            if (!res || !res.list) {
                return;
            }

            for (var i= 0,len=res.list.length;i<len;i++) {
                _this.recursiveTreeSetPointPassData(_this.m_kpiDataTree, res.list[i].dsItemId, res.list[i].data);
            }

            var divContain = $('<div style="cursor:pointer"></div>');
            divContain.append('<ul class="kpiGridHeader" style="height:32px;margin-bottom:0px"></ul>');
            tree.append(divContain);

            var head = $('<thead class="kpiGridHeader"></thead>');
            var headTr = $('<tr></tr>');
            if ('season' == _this.m_dateCycle) {
                for (var i= 0; i<4; i++) {
                    var headTh = $('<th colspan="3" class="colSeason">' + (i+1) + '季度</th>');
                    headTr.append(headTh);
                }
                head.append(headTr);
            }
            else if ('month' == _this.m_dateCycle) {
                headTr = $('<tr></tr>');
                for (var i= 0; i<12; i++) {
                    var headTh = $('<th class="colMonth">' + (i+1) + '月</th>');
                    headTr.append(headTh);
                }
                head.append(headTr);
            }
            table.append(head);
            _this.showControlInfo();
            if (bIsFirst) {
                _this.m_htmlPage.modal('show');
            }
        }).always(function () {
            Spinner.stop();
        });
    }
    ModalPointKpiGrid.prototype.showControlInfo = function () {
        _this.m_htmlTreeTemp = $('<div style="cursor:pointer"></div>');
        _this.m_htmlGridTemp = $('<tbody class="kpiGridBody"></tbody>');
        _this.recursiveTreeSetting(_this.m_kpiDataTree);
        _this.m_htmlPage.find('#treeCtl').append(_this.m_htmlTreeTemp);
        _this.m_htmlPage.find('#tableCtl').append(_this.m_htmlGridTemp);
    }
    ModalPointKpiGrid.prototype.recursiveTreeSetting = function (item) {
        // draw tree
        var parentNode;
        if ('' == item.parentId) {  // root
            parentNode = _this.m_htmlTreeTemp;
        }
        else {
            parentNode = _this.m_htmlTreeTemp.find('#tree_' + item.parentId).find('.rows').eq(0);
        }
        if (parentNode.length > 0) {
            var bLeaf = (0 == item.list.length) ? true : false;
            _this.insertTreeCtrl(item.id, item.name, parentNode, bLeaf);
        }

        // draw grid
        var nLen = item.pointPassData.length;
        if (nLen < 12) {
            for (var i= nLen,len=12-nLen; i<12; i++) {
                item.pointPassData.push(-1);  // append data
            }
        }
        nLen = 12;

        var gridTr1 = $('<tr class="kpiGridRow" id="grid1_' + item.id + '"></tr>');
        var gridTd1 = '';
        var nLen = item.pointPassData.length;
        var bIsCurrent = false;
        var strShow;
        if ('season' == _this.m_dateCycle) {
            var arrSeason = [item.pointPassData[0], item.pointPassData[3], item.pointPassData[6], item.pointPassData[9]];
            for (var i= 0; i<4; i++) {
                if (_this.m_bIsCurrentYear && i==_this.m_nCurrentSeason) {
                    bIsCurrent = true;
                }
                else {
                    bIsCurrent = false;
                }

                if (-1 == arrSeason[i]) {
                    gridTd1 += '<td colspan=3></td>';
                }
                else if (Boolean(arrSeason[i])) {
                    strShow = bIsCurrent ? _this.m_strCurrentGood : _this.m_strGood;
                    gridTd1 += '<td colspan=3 class="kpiGridGood">' + strShow + '</td>';
                }
                else {
                    strShow = bIsCurrent ? _this.m_strCurrentGood : _this.m_strGood;
                    gridTd1 += '<td colspan=3 class="kpiGridBad">' + strShow + '</td>';
                }
            }
        }
        else if ('month' == _this.m_dateCycle) {
            for (var i= 0; i<nLen; i++) {
                if (_this.m_bIsCurrentYear && i==_this.m_nCurrentMonth) {
                    bIsCurrent = true;
                }
                else {
                    bIsCurrent = false;
                }

                if (-1 == item.pointPassData[i]) {
                    gridTd1 += '<td colspan=1></td>';
                }
                else if (Boolean(item.pointPassData[i])) {
                    strShow = bIsCurrent ? _this.m_strCurrentGood : _this.m_strGood;
                    gridTd1 += '<td colspan=1 class="kpiGridGood">' + strShow + '</td>';
                }
                else {
                    strShow = bIsCurrent ? _this.m_strCurrentBad : _this.m_strBad;
                    gridTd1 += '<td colspan=1 class="kpiGridBad">' + strShow + '</td>';
                }
            }
        }
        gridTr1.append($(gridTd1));
        _this.m_htmlGridTemp.append(gridTr1);

/*
        var nLen = item.pointPassData.length;
        if (nLen < 12) {
            for (var i= nLen,len=12-nLen; i<len; i++) {
                item.pointPassData.push(-1);  // append data
            }
        }
        nLen = 12;

        var monthVal = [];
        for (var i= 0; i<nLen; i++) {
            monthVal.push((item.pointPassData[i] > 0) ? 1 : 0);
        }
        var season1 = monthVal[0] + monthVal[1] + monthVal[2];
        var season2 = monthVal[3] + monthVal[4] + monthVal[5];
        var season3 = monthVal[6] + monthVal[7] + monthVal[8];
        var season4 = monthVal[9] + monthVal[10] + monthVal[11];
        var arrSeason = [];
        arrSeason.push(season1);
        arrSeason.push(season2);
        arrSeason.push(season3);
        arrSeason.push(season4);

        var gridTr1 = $('<tr class="kpiGridRow" id="grid1_' + item.id + '"></tr>');
        var gridTd1 = '';
        for (var i= 0; i<4; i++) {
            if (arrSeason[i] >= 2) {
                if (_this.m_bIsCurrentYear) {
                    if (_this.m_nCurrentSeason == i) {
                        gridTd1 += '<td colspan="3" class="kpiGridGood">' + _this.m_strCurrentGood + '</td>';
                    }
                    else if (i < _this.m_nCurrentSeason) {
                        gridTd1 += '<td colspan="3" class="kpiGridGood">' + _this.m_strGood + '</td>';
                    }
                    else {
                        gridTd1 += '<td colspan="3"></td>';
                    }
                }
                else {
                    gridTd1 += '<td colspan="3" class="kpiGridGood">' + _this.m_strGood + '</td>';
                }
            }
            else {
                if (0 == arrSeason[i] && -1 == item.pointPassData[i*3] && -1 == item.pointPassData[i*3+1] && -1 == item.pointPassData[i*3+2]) {
                    gridTd1 += '<td colspan="3"></td>';
                }
                else {
                    if (_this.m_bIsCurrentYear) {
                        if (_this.m_nCurrentSeason == i) {
                            gridTd1 += '<td colspan="3" class="kpiGridBad">' + _this.m_strCurrentBad + '</td>';
                        }
                        else if (i < _this.m_nCurrentSeason) {
                            gridTd1 += '<td colspan="3" class="kpiGridBad">' + _this.m_strBad + '</td>';
                        }
                        else {
                            gridTd1 += '<td colspan="3"></td>';
                        }
                    }
                    else {
                        gridTd1 += '<td colspan="3" class="kpiGridBad">' + _this.m_strBad + '</td>';
                    }
                }
            }
        }
        gridTr1.append($(gridTd1));
        _this.m_htmlGridTemp.append(gridTr1);

        //
        var gridTr2 = $('<tr class="kpiGridRow" id="grid2_' + item.id + '"></tr>');
        var gridTd2 = '';
        for (var i= 0; i<nLen; i++) {
            var val = item.pointPassData[i];
            if (1 == val) {
                if (_this.m_bIsCurrentYear) {
                    if (_this.m_nCurrentMonth == i) {
                        gridTd2 += '<td class="kpiGridGood">' + _this.m_strCurrentGood + '</td>';
                    }
                    else if (i < _this.m_nCurrentMonth) {
                        gridTd2 += '<td class="kpiGridGood">' + _this.m_strGood + '</td>';
                    }
                    else {
                        gridTd2 += '<td></td>';
                    }
                }
                else {
                    gridTd2 += '<td class="kpiGridGood">' + _this.m_strGood + '</td>';
                }
            }
            else if (0 == val) {
                if (_this.m_bIsCurrentYear) {
                    if (_this.m_nCurrentMonth == i) {
                        gridTd2 += '<td class="kpiGridBad">' + _this.m_strCurrentBad + '</td>';
                    }
                    else if (i < _this.m_nCurrentMonth) {
                        gridTd2 += '<td class="kpiGridBad">' + _this.m_strBad + '</td>';
                    }
                    else {
                        gridTd2 += '<td></td>';
                    }
                }
                else {
                    gridTd2 += '<td class="kpiGridBad">' + _this.m_strBad + '</td>';
                }
            }
            else if (-1 == val) {
                gridTd2 += '<td></td>';
            }
            else {}
        }
        gridTr2.append($(gridTd2));
        _this.m_htmlGridTemp.append(gridTr2);
*/
        // recursive
        var nChildNum = item.list.length;
        if (0 == nChildNum) {   // leaf
        }
        else {  // node
            for (var i= 0; i<nChildNum; i++) {
                arguments.callee(item.list[i]);
            }
        }
    }
    ModalPointKpiGrid.prototype.recursiveTreeSetShow = function (item, nFindId, bIsShow) {
        if (nFindId == item.id) {
            for (var i= 0,len=item.list.length; i<len; i++) {
                item.list[i].show = bIsShow;
            }
            return;
        }
        else {
            for (var i= 0,len=item.list.length; i<len; i++) {
                arguments.callee(item.list[i], nFindId, bIsShow);
            }
        }
    }
    ModalPointKpiGrid.prototype.recursiveTreeGetShow = function (item) {
        var arr = [];
        var nLen = item.list.length;
        if (nLen > 0) { // node
            if (item.show) {
                arr.push(item.id);
                for (var i= 0; i<nLen; i++) {
                    var temp = arguments.callee(item.list[i]);
                    arr = arr.concat(temp);
                }
            }
        }
        else {  // leaf
            if (item.show) {
                return [item.id];
            }
        }
        return arr;
    }
    ModalPointKpiGrid.prototype.recursiveTreeGetPointPassId = function (item) {
        var arr = [];
        var nLen = item.list.length;
        if (nLen > 0) { // node
            if (item.show) {
                arr.push(item.pointPass);
                for (var i= 0; i<nLen; i++) {
                    var temp = arguments.callee(item.list[i]);
                    arr = arr.concat(temp);
                }
            }
        }
        else {  // leaf
            if (item.show) {
                return [item.pointPass];
            }
        }
        return arr;
    }
    ModalPointKpiGrid.prototype.recursiveTreeSetPointPassData = function (item, nPtPassId, ptPassData) {
        if (nPtPassId == item.pointPass) {
            item.pointPassData = ptPassData;
            return;
        }
        else {
            for (var i= 0,len=item.list.length; i<len; i++) {
                arguments.callee(item.list[i], nPtPassId, ptPassData);
            }
        }
    }
    ModalPointKpiGrid.prototype.insertTreeCtrl = function (groupId, groupName, parentNode, bIsLeaf) {
        var $ul = $('<ul class="nav nav-list kpiTreeGroup" id="tree_' + groupId + '">');
        var $liHd;
        if (bIsLeaf) {
            $liHd = $('<li class="kpiTreeHeader"><span style="margin-left:40px"></span></li>');
        }
        else {
            $liHd = $('<li class="kpiTreeHeader"><img src="/static/images/dataSource/group_head_sel.png" alt="png" class="dsTreeHeaderIcon"></li>');
        }
        var spanName = $('<span class="dsGroupName">' + groupName + '</span>');
        $liHd.append(spanName);

        $liHd.click(function (e) {
            var tar = $(e.currentTarget);
            if (Boolean(tar)) {
                var treeItemId = tar.closest('.kpiTreeGroup')[0].id;
                var num = treeItemId.substring(5);

                //
                var bindRow = tar.next('.rows');
                if (Boolean(bindRow)) {
                    var bIsShow = true;
                    var showFlag = bindRow.eq(0).css('display');
                    if ('block' == showFlag) {  // set none, show = false
                        bIsShow = false;
                    }
                    else {  // set block, show = true
                        bIsShow = true;
                    }

                    _this.recursiveTreeSetShow(_this.m_kpiDataTree, num, bIsShow);
                    var arr = _this.recursiveTreeGetShow(_this.m_kpiDataTree);
                    var arrGrid = [];
                    for (var k= 0,len3=arr.length; k<len3; k++) {
                        arrGrid.push('grid1_' + arr[k]);
                        arrGrid.push('grid2_' + arr[k]);
                    }

                    // arrGrid 存放仅显示的id
                    // 右侧Grid仅显示arrGrid中的行，其余隐藏
                    var body = _this.m_htmlPage.find('#tableCtl tbody tr');
                    for (var i= 0,len=body.length; i<len; i++) {
                        var trFind = false;
                        for (var j= 0,len2=arrGrid.length; j<len2; j++) {
                            if (body[i].id == arrGrid[j]) {
                                trFind = true;
                                break;
                            }
                        }
                        if (!trFind) {
                            $(body[i]).css('display', 'none');
                        }
                        else {
                            $(body[i]).css('display', '');
                        }
                    }

                    // tree action
                    bindRow.slideToggle();
                }
            }
        });
        $ul.prepend($liHd);

        var divLiRow = $('<li class="rows"></li>');
        $ul.append(divLiRow);

        parentNode.append($ul);
    }
    ModalPointKpiGrid.prototype.timeSetting = function (selYear) {
        _this.m_selectYear = selYear;
        var tmNow = new Date();
        var nCurYear = tmNow.getFullYear();
        if (nCurYear == _this.m_selectYear) {
            _this.m_nCurrentMonth = tmNow.getMonth();
            _this.m_nCurrentSeason = Math.floor(_this.m_nCurrentMonth / 3);
            _this.m_bIsCurrentYear = true;
        }
        else {
            _this.m_bIsCurrentYear = false;
        }
    }

    return ModalPointKpiGrid;
}) ();
/**
 * Created by vicky on 2015/9/21.
 */
var ModalReportChapter = (function(){
    function ModalReportChapter(screen, entityParams) {
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this.showConfigMode);
    };
    ModalReportChapter.prototype = new ModalBase();
    ModalReportChapter.prototype.optionTemplate = {
        name:'toolBox.modal.REPORT_CHAPTER',
        parent:0,
        mode:['realTimeDashboard'],
        maxNum: 30,
        title:'',
        minHeight:2,
        minWidth:3,
        maxHeight:6,
        maxWidth:12,
        type: 'ModalReportChapter'
    };

    ModalReportChapter.prototype.show = function(){
        this.init();
    }

    ModalReportChapter.prototype.init = function(){

    }

    ModalReportChapter.prototype.renderModal = function (e) {
        var _this = this;
        var postData = {
            projectId: AppConfig.projectId,
            menuId: this.entity.modal.option.menuId,
            chapter: this.entity.modal.option.chapter,
            unit: this.entity.modal.option.unit
        };
        WebAPI.post('/report/getReportHtml/', postData).done(function(result){
            if(result.success){
                _this.spinner && _this.spinner.stop();
                _this.container.innerHTML = result.data;
                _this.reportScreen = new ReportScreen();
                _this.reportScreen.renderCharts($('#beopReport .report-unit'))
            }else{
                alert(result.msg);
            }
        }).always(function(){
            _this.spinner && _this.spinner.stop();
        });
    }

    ModalReportChapter.prototype.showConfigMode = function () {

    }
    ModalReportChapter.prototype.updateModal = function (points) {

    }
    ModalReportChapter.prototype.setModalOption = function (option) {

    }
    ModalReportChapter.prototype.modalDialog = '\
        <div class="modal-content">\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>\
                <h4 class="modal-title" id="">Config</h4>\
            </div>\
            <div class="modal-body">\
                <div class="row" style="margin-bottom: 15px;">\
                    <div class="col-xs-4">\
                        <label>Type</label>\
                    </div>\
                    <div class="col-xs-4">\
                        <select id="typeList" class="form-control type"></select>\
                    </div>\
                </div>\
                <div class="row" style="margin-bottom: 15px;">\
                    <div class="col-xs-4">\
                        <label>Chapter</label>\
                    </div>\
                    <div class="col-xs-4" id="chapterList">\
                    </div>\
                </div>\
                <div class="row" style="margin-bottom: 15px;">\
                    <div class="col-xs-4">\
                        <label>Section</label>\
                    </div>\
                    <div class="col-xs-4" id="unitList">\
                    </div>\
                </div>\
            </div>\
            <div class="modal-footer">\
                <div id="configAlert"></div>\
                <button type="button" class="btn btn-primary" id="confirm">Confirm</button>\
            </div>\
        </div>';

    ModalReportChapter.prototype.showConfigModal = function () {
        var _this = this;
        var $dialogModal = $('#dialogModal');
        var $dialogContent = $dialogModal.find('#dialogContent').html(this.modalDialog);
        var $modalBody = $dialogContent.find('.modal-body');
        var $confirm = $dialogContent.find('#confirm');
        $dialogModal.modal('show');
        Spinner.spin($dialogContent.find('.modal-content')[0]);
        WebAPI.get('/report/getReportMenu/' + AppConfig.projectId)
            .done(function(result){
                var $typeList = $modalBody.find('#typeList').empty();
                var $chapterList = $modalBody.find('#chapterList').empty();
                var $unitList = $modalBody.find('#unitList').empty();
                //把数据处理成下拉框
                var typeTemp = '', $firstUnitSelect, $firstChapterSelect;

                if(result.data && result.data.length > 0){
                    for(var i = 0; i < result.data.length; i++){
                        var type = result.data[i];
                        typeTemp += ('<option value="'+ type._id +'" id="'+ i +'">'+ type.text +'</option>');
                        var $selectChapter = $('<select id="chapter_'+ i +'" class="form-control chapter" style="display: none;"></select>');
                        if(type.structure && type.structure.data && type.structure.data.length > 0){
                            $selectChapter.append('<option value="all" class="type">All Chapter</option>')
                            for(var j = 0; j < type.structure.data.length; j++){
                                var chapter = type.structure.data[j];
                                $selectChapter.append('<option value="'+ chapter.name +'" id="'+ j +'" parentId="'+ i +'">'+ chapter.name +'</option>');
                                var $selectUnit = $('<select id="unit_'+ i + '_' + j +'" class="form-control unit" style="display: none;"></select>');
                                if(chapter.units && chapter.units.length > 0){
                                    $selectUnit.append('<option value="all">All Section</option>');
                                    for(var k = 0; k < chapter.units.length; k++){
                                        var unit = chapter.units[k];
                                        $selectUnit.append('<option value="'+ unit.unitName +'" id="'+ k +'" parentId="'+ j +'">'+ unit.unitName +'</option>');
                                    }
                                }else{
                                    $selectUnit.append('<option value="no">No Section</option>');
                                }
                                $unitList.append($selectUnit);
                            }
                        }else{
                           $selectChapter.append('<option value="no" class="type">No Chapter</option>')
                        }
                         $chapterList.append($selectChapter);
                    }
                }else{
                    typeTemp += '<option value="no" class="type">No type</option>';
                }

                $typeList.html(typeTemp);
                $firstChapterSelect = $chapterList.find('select:eq(0)').show();
                $firstUnitSelect = $unitList.find('select:eq(0)').show();
                if($firstChapterSelect.length == 0){
                    $chapterList.append('<select class="form-control chapter no"><option value="no" class="type">No Section</option></select>');
                }
                if($firstUnitSelect.length == 0){
                    $unitList.append('<select class="form-control unit no"><option value="no" class="type">No Section</option></select>');
                }

                //如果是编辑模式,显示已选择选项
                if(_this.entity.modal.option && result.data && result.data.length > 0){
                    var $selectedChapter = undefined;//编辑状态时选择的章对应的下拉框
                    var $selectedUnit = undefined;
                    var $typeOption = undefined;
                    var $chapterOption = undefined;
                    if(_this.entity.modal.option.menuId){
                        $typeList.val(_this.entity.modal.option.menuId);
                        $typeOption = $typeList.find('option[value="'+ _this.entity.modal.option.menuId +'"]');
                    }
                    if(_this.entity.modal.option.chapter != undefined){
                        $chapterList.children().hide();
                        $selectedChapter = $chapterList.find('#chapter_' + $typeOption.attr('id'));
                        $selectedChapter.show()
                        if(_this.entity.modal.option.chapter != ''){//all
                            $selectedChapter.val(_this.entity.modal.option.chapter);
                            $chapterOption = $selectedChapter.find('option[value="'+ _this.entity.modal.option.chapter +'"]');
                        }
                    }
                    if(_this.entity.modal.option.unit != undefined && $chapterOption != undefined && $chapterOption.length > 0){
                        $unitList.children().hide();
                        $selectedUnit = $unitList.find('#unit_'+ $chapterOption.attr('parentId') +'_'+ $chapterOption.attr('id'));
                        $selectedUnit.show()
                        if(_this.entity.modal.option.unit != ''){//all
                            $selectedUnit.val(_this.entity.modal.option.unit)
                        }
                    }
                }


                //attach event
                $modalBody.off('change').on('change','select',function(){
                    //删除累赘dom
                    $modalBody.find('select.no').remove();
                   //如果有下一级选项,显示下一级选项,隐藏不相干选项
                    if($(this).hasClass('type')){//第一级下拉框发生change
                        //第二级下拉框
                        var typeId = $(this).find('option[value="'+ this.value +'"]')[0].id;
                        var $chapterSelect = $('#chapter_'+ typeId);
                        $chapterList.children().hide();
                        $chapterSelect.show();
                        //第三级下拉框
                        var chapterId = $chapterSelect.find('option[value="'+ $chapterSelect[0].value +'"]').attr('id');
                        $unitList.children().hide();
                        if(chapterId){
                             var $unitSelect = $('#unit_' + typeId + '_' + chapterId);
                            $unitSelect.show();
                        }else if($chapterSelect[0].value == 'all'){
                            $unitList.append('<select class="form-control unit no"><option value="all">All Section</option></select>');
                        }else{
                            $unitList.append('<select class="form-control unit no"><option value="no" class="type">No Section</option></select>');
                        }
                    }
                    if($(this).hasClass('chapter')){
                        var $typeList = $('#typeList');
                        var typeId = $typeList.find('option[value="'+ $typeList[0].value +'"]')[0].id;
                        var $chapterSelect = $('#chapter_'+ typeId);
                        var chapterId = $chapterSelect.find('option[value="'+ this.value +'"]').attr('id');
                        $unitList.children().hide();
                        if(chapterId){
                             var $unitSelect = $('#unit_' + typeId + '_' + chapterId);
                            $unitSelect.show();
                        }else if($chapterSelect[0].value == 'all'){
                            $unitList.append('<select class="form-control unit no"><option value="all">All Section</option></select>');
                        }else{
                            $unitList.append('<select class="form-control unit no"><option value="no">No Section</option></select>');
                        }
                    }
                });
                $dialogModal.off('shown.bs.modal').on('shown.bs.modal', function () {

                });
                $dialogModal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                    $dialogContent.empty();
                });
                $confirm.off('click').on('click', function(){
                    var chapterVal = $chapterList.find('select:not(:hidden)')[0].value;
                    var unitVal = $unitList.find('select:not(:hidden)')[0].value;
                    var menuId = $typeList[0].value;
                    !_this.entity.modal.option && (_this.entity.modal.option = {});
                    _this.entity.modal.option.menuId = menuId == 'no' ? '' : menuId;
                    _this.entity.modal.option.chapter = (chapterVal == 'no' || chapterVal == 'all') ? '' : chapterVal;
                    _this.entity.modal.option.unit = (unitVal == 'no' || unitVal == 'all') ? '' : unitVal;
                    $dialogModal.modal('hide');
                    if(_this.entity.modal.option.menuId && _this.entity.modal.option.menuId != ''){
                        _this.screen.isScreenChange = true;
                    }
                });

            }).fail(function(){

            }).always(function(){
                 Spinner.stop();
            });
    };
    return ModalReportChapter;
})();

var ModalInteractConfig = (function ($, window, undefined) {
    var _this;
    function ModalInteractConfig(options) {
        _this = this;
        ModalConfig.call(_this, options);
    }

    ModalInteractConfig.prototype = Object.create(ModalConfig.prototype);
    ModalInteractConfig.prototype.constructor = ModalInteractConfig;

    ModalInteractConfig.prototype.DEFAULTS = {
        htmlUrl: '/static/views/observer/widgets/modalInteract.html'
    };

    ModalInteractConfig.prototype.init = function () {
        this.$contain = $('#modalInteract', this.$wrap);
        this.$btnSubmit = $('.btn-submit', this.$wrap);
        this.$divCfgData = $('.divConfigData', this.$wrap);
        this.$divDataGrid = $('#divDataGrid', this.$wrap);
        this.$divDataTip = $('.dataDragTip', this.$wrap);
        I18n.fillArea(this.$contain);
        this.attachEvents();
    };

    ModalInteractConfig.prototype.recoverForm = function (modal) {
        // clear first
        var item = _this.$divDataGrid.children('.item');
        if (item.length > 0) {
            item.remove();
        }
        if (modal.points) {
            // insert second
            var dictPtStat = modal.option.dictPtStatus;
            if (dictPtStat) {
                var num = 1;
                for (var id in dictPtStat) {
                    this.insertItem(id, dictPtStat[id].unit, num, dictPtStat[id].name);
                    num++;
                }
            }
        }
    };

    ModalInteractConfig.prototype.reset = function () {
    };

    ModalInteractConfig.prototype.attachEvents = function () {
        // init drag
        this.$divCfgData.on('dragover', function (e) {
            e.preventDefault();
            $(e.currentTarget).find('.dataDragTip').addClass('addData');
        });
        this.$divCfgData.on('dragleave', function (e) {
            e.preventDefault();
            $(e.currentTarget).find('.dataDragTip').removeClass('addData');
        });
        this.$divCfgData.on('drop', function(e, arg) {
            $('.addData').removeClass('addData');

            var dragItemId = EventAdapter.getData().dsItemId;
            if (!dragItemId) {
                return;
            }
            // num less equal than 20
            var item = _this.$divDataGrid.find('.divDsGridItem');
            var len = item.length;
            if (len >= 20) {
                return;
            }
            // check if repeat
            var bFind = false;
            for (var i = 0; i <len; i++) {
                if (dragItemId == item.eq(i).attr('dsid')) {
                    bFind = true;
                    break;
                }
            }
            if (bFind) {
                return;
            }
            if (dragItemId) {
                var item = AppConfig.datasource.getDSItemById(dragItemId);
                if (item && item.alias) {
                    _this.insertItem(dragItemId, '', len+1, item.alias);
                }
            }
        });

        // submit EVENTS
        this.$btnSubmit.off().click(function (e) {
            var modalIns = _this.options.modalIns;
            var modal = modalIns.entity.modal;

            // save to modal
            modal.points = [];
            if (!modal.option) {
                modal.option = {}
                modal.option.dictPtStatus = {};
            }
            if (modal.option) {
                modal.option.dictPtStatus = {};
            }
            var arrGrid = _this.$divDataGrid.find('.grow');
            for (var i = 0, len = arrGrid.length; i < len; i++) {
                var item = arrGrid.eq(i);
                var id = item.attr('dsid');
                var name = item.find('input').val();
                modal.points.push(id);
                modal.option.dictPtStatus[id] = {show:((0 == i) ? true : false), count:i, unit:'', name:name};
            }
            if (!modal.option.timeMode) {
                // set default values
                var tmEnd = new Date();
                tmEnd.setHours(23);
                tmEnd.setMinutes(59);
                var tmStart = new Date();
                tmStart.setTime(tmEnd.getTime() - 172800000);
                tmStart.setHours(0);
                tmStart.setMinutes(0);
                modal.option.timeMode = 'recent';
                modal.option.interval = 'h1';
                modal.option.timeStart = tmStart.format('yyyy-MM-dd HH:mm:00');
                modal.option.timeEnd = tmEnd.format('yyyy-MM-dd HH:mm:00');
                modal.option.periodVal = 3;
                modal.option.periodUnit = 'day';
                modal.interval = 3;
            }

            // close modal
            _this.$modal.modal('hide');
            e.preventDefault();
        });
    };

    ModalInteractConfig.prototype.insertItem = function(id, unit, num, name) {
        if (name == undefined) {
            name = AppConfig.datasource.getDSItemById(id).alias;
        }
        var item = '<div class="col-lg-3 col-xs-4 divDsGrid item">\
            <span class="divDsGridNum">' + num + '</span>\
            <span class="divDsGridItem grow" dsid="' + id + '">\
                <span class="contentDS" title="AverageLoad2">' + name + '</span>\
                <input type="text" value="' + name + '" style="display:none">\
                <span class="glyphicon glyphicon-remove btnRemoveDS" aria-hidden="true"></span>\
            </span></div>';
                //<input type="text" class="form-control dsUnit" value="' + unit + '">
        _this.$divDataTip.before(item);

        _this.$divDataGrid.find('.btnRemoveDS').last().click(function (e) {
            var $dsGrid = $(e.currentTarget).closest('.divDsGrid');
            if ($dsGrid) {
                $dsGrid.remove();
            }
            var gridNum = _this.$divDataGrid.find('.divDsGridNum');
            if (gridNum) {
                for (var i = 0; i < gridNum.length; i++) {
                    gridNum.eq(i).text(i+1);
                }
            }
        });
        _this.$divDataGrid.find('.contentDS').last().dblclick(function (e) {
            var $spanTar = $(e.currentTarget);
            var name = $spanTar.text();
            var $inputName = $spanTar.next('input');
            $inputName.keydown(function (e) {
                if (13 == e.keyCode) {
                    var $inputTar = $(e.currentTarget);
                    var newName = $inputTar.val();
                    $inputTar.hide();
                    $spanTar.text(newName);
                    $spanTar.show();
                }
            });
            $inputName.blur(function (e) {
                var $inputTar = $(e.currentTarget);
                var newName = $inputTar.val();
                $inputTar.hide();
                $spanTar.text(newName);
                $spanTar.show();
            });
            $spanTar.hide();
            $inputName.show();
            $inputName.focus();
            $inputName.select();
        });
    };

    ModalInteractConfig.prototype.destroy = function () {
        this.detachEvents();
        this.$wrap.remove();
    };

    return ModalInteractConfig;
} (jQuery, window));


var ModalInteract = (function(){
    var _this;
    var g_dictChart = {};
    function ModalInteract(screen, entityParams) {
        _this = this;
        if (!entityParams) return;
        ModalBase.call(this, screen, entityParams, this.renderModal, this.updateModal, this._showConfig);
        this.modal = entityParams.modal;
        this.modalId = entityParams.id;
        this.chart = echarts.init(this.container, AppConfig.chartTheme);
        this.m_langFlag = ('zh' == localStorage['language']) ? 0 : 1;   // 0：zh，1：en
        this.m_lang = I18n.resource.dataSource;
        this.screen = screen;
        this.init();
        this.arrColor = echarts.config.color;
        //this.arrColor = ['#03d5c6', '#288add', '#95f31c', '#fbef31', '#fbbf05', '#d06e0f', '#f34704', '#d60609', '#f903d9', '#a505d9', '#c088f9', '#6421cb', '#7575fa', '#2609d1', '#1671fb', '#18a0a3', '#5bbcd2', '#00bdfb', '#00fd44', '#00febe'];
        this.timeFlag = undefined;
        this.arrModal = screen.store.layout[0];
        g_dictChart[this.modalId] = {chart:this.chart, contain:this.container};
        this.spinner.spin(this.container);
    };
    ModalInteract.prototype = new ModalBase();
    ModalInteract.prototype.optionTemplate = {
        name:'toolBox.modal.INTERACT_CHART',
        parent:0,
        mode:'custom',
        maxNum: 10,
        title:'',
        minHeight:3,
        minWidth:9,
        maxHeight:12,
        maxWidth:12,
        type:'ModalInteract'
    };

    ModalInteract.prototype.defaultOptions = {
        title : {
            text: ''
        },
        tooltip : {
            trigger: 'axis'
        },
        toolbox: {
            show : false,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        dataZoom: {
            show: true
        },
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    textStyle: {
                        color: '#ccc'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#777',
                        width: 1,
                        type: 'dashed'
                    }
                }
            }
        ],
        animation: false
    };

    ModalInteract.prototype.init = function() {
        var containWidth = $(this.container).width();
        var containHeight = $(this.container).height();
        var $divLeftPart = $('<div style="display:inline-block;height:100%"></div>');
        $divLeftPart.css('width', containWidth-220 + 'px');
        var $divChartCtrl = $('<div id="chartShow"></div>');
        $divChartCtrl.css('height', containHeight-10 + 'px');

        //var $divTimeCtrl = $('<div style="height:100px;margin:20px 0 0 20px;"></div>');
        //this.initInteractTime($divTimeCtrl);
        $divLeftPart.append($divChartCtrl);
        //$divLeftPart.append($divTimeCtrl);

        var $divDataCtrl = $('<div id="dataList" style="display:inline-block;position:absolute;top:10px;right:0;width:220px;height:100%;overflow-y:auto"><div class="form-group"></div></div>');
        if (this.modal.points && this.modal.option.dictPtStatus) {
            var arrId = []
            for (var id in this.modal.option.dictPtStatus) {
                arrId.push(id);
            }
            var arrItem = AppConfig.datasource.getDSItemById(arrId);
            for (var id in this.modal.option.dictPtStatus) {
                for (var m = 0; m < arrItem.length; m++) {
                    if (id == arrItem[m].id) {
                        var name = this.modal.option.dictPtStatus[id].name;     // arrItem[m].alias;
                        var unit = this.modal.option.dictPtStatus[id].unit;
                        this.insertInteractData($divDataCtrl, id, name, unit);

                        //var prjName = _this.getProjectNameFromId(arrItem[m].projId, _this.m_langFlag);
                        var target = $divDataCtrl.find('.form-inline').last();
                        if (0 == arrItem[m].type) {
                            //this.setToolTips(target, name, prjName, arrItem[m].value, arrItem[m].note);
                        }
                        else if (1 == arrItem[m].type) {
                            var showFormula = AppConfig.datasource.getShowNameFromFormula(arrItem[m].value);
                            this.setFormulaToolTips(target, name, showFormula, arrItem[m].note);
                        }
                        break;
                    }
                }
                //var name = AppConfig.datasource.getDSItemById(id).alias;
                //var unit = this.modal.option.dictPtStatus[id].unit;
                //this.insertInteractData($divDataCtrl, id, name, unit);
            }
        }

        $(this.container).empty();
        $(this.container).append($divLeftPart);
        $(this.container).append($divDataCtrl);
    }

    ModalInteract.prototype.renderModal = function (e) {
        this.drawCharts();
        this.spinner.stop();
    }

    ModalInteract.prototype.updateModal = function (e) {
        // update chart
        var dsId = e[0].dsItemId;
        var modeName;
        for (var i = 0; i < _this.arrModal.length; i++) {
            var arrPt = _this.arrModal[i].modal.points;
            for (var j = 0; j < arrPt.length; j++) {
                if (dsId == arrPt[j]) {
                    modeName = _this.arrModal[i].modal.option.timeMode;
                    break;
                }
            }
            if (modeName) {
                break;
            }
        }
        if ('recent' == modeName) {
            var newOption = _this.chart.getOption();
            //var newOption = (g_dictChart[modeId].chart).getOption();
            var newSeries = newOption.series;
            var arrId = [];
            for (var i = 0, len = e.length; i < len; i++) {
                arrId.push(e[i].dsItemId);
            }
            var arrItem = AppConfig.datasource.getDSItemById(arrId);
            for (var i = 0, len = e.length; i < len; i++) {
                var id = e[i].dsItemId;
                for (var m = 0; m < arrItem.length; m++) {
                    if (id == arrItem[m].id) {
                        var name = arrItem[m].alias;
                        var bFind = false;
                        var j = 0;
                        for (var len2 = newSeries.length; j < len2; j++) {
                            if (name == newSeries[j].name) {
                                bFind = true;
                                break;
                            }
                        }
                        if (bFind) {    // append new data
                            var flag = false;
                            for (var k = 0; k < newSeries[j].data.length; k++) {
                                if (undefined == newSeries[j].data[k]) {
                                    newSeries[j].data[k] = e[i].data;
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                newSeries[j].data.push(e[i].data);
                            }
                        }
                        break;
                    }
                }
            }
            _this.chart.setOption(newOption);
            _this.chart.refresh();
        }

        // update data list
        var spanReal = $('#dataList').find('.frontCtrl');
        if (spanReal) {
            for (var j = 0, len2 = e.length; j < len2; j++) {
                var id = e[j].dsItemId;
                for (var k = 0, len3 = spanReal.length; k < len3; k++) {
                    if (id == spanReal.eq(k).attr('pId')) {
                        spanReal.eq(k).find('.interactRealVal').text(e[j].data);
                        break;
                    }
                }
            }
        }
    }

    ModalInteract.prototype.showConfigModal = function () {
        this.configModal.setOptions({modalIns: this});
        this.configModal.show();
    }
    ModalInteract.prototype._showConfig = function () {};

    ModalInteract.prototype.setModalOption = function (option) {
    }

    ModalInteract.prototype.drawCharts = function (parmOption, parmChart, parmContain) {
        if (!parmOption) {
            parmOption = _this.modal.option;
        }
        if (!parmChart) {
            parmChart = _this.chart;
        }
        if (!parmContain) {
            parmContain = _this.container;
        }
        if (parmOption) {
            // filter points
            var arrPoints = [];
            for (var itemId in parmOption.dictPtStatus) {
                if (parmOption.dictPtStatus[itemId].show) {
                    arrPoints.push(itemId);
                }
            }
            if (0 == arrPoints.length) {
                parmChart.clear();
                _this.setDataListColor();
                return;
            }
            if ('recent' == parmOption.timeMode) {
                var tmEnd = new Date();
                tmEnd.setHours(23);
                tmEnd.setMinutes(59);
                var tmTemp = tmEnd.getTime() - 86400000 * (parmOption.periodVal - 1);
                var tmStart = new Date();
                tmStart.setTime(tmTemp);
                tmStart.setHours(0);
                tmStart.setMinutes(0);
                parmOption.timeStart = tmStart.format('yyyy-MM-dd HH:mm:00');
                parmOption.timeEnd = tmEnd.format('yyyy-MM-dd HH:mm:00');
            }

            WebAPI.post('/analysis/startWorkspaceDataGenHistogram', {
                dsItemIds: arrPoints,
                timeStart: parmOption.timeStart,
                timeEnd: parmOption.timeEnd,
                timeFormat: parmOption.interval
            }).done(function (result) {
                if (result.timeShaft.length <= 0) {
                    parmChart = echarts.init($(parmContain).find('#chartShow')[0]).clear();
                    return;
                }
                var arrName = [];
                var series = [];
                var arrId = [];
                var arrItem = [];
                for (var i = 0, len = result.list.length; i < len; i++) {
                    arrId.push(result.list[i].dsItemId);
                }
                arrItem = AppConfig.datasource.getDSItemById(arrId);
                var cntNow = (new Date()).getTime();
                var dictLastData = {};
                for (var i = 0, len = result.list.length; i < len; i++) {
                    var id = result.list[i].dsItemId;
                    for (var m = 0; m < arrItem.length; m++) {
                        if (id == arrItem[m].id) {
                            var showData = [];
                            var lastData;
                            var flag = false;
                            if ('recent' == parmOption.timeMode) {  // recent cycle
                                var n = 0;
                                for (; n < result.timeShaft.length; n++) {
                                    if (Date.parse(result.timeShaft[n]) > cntNow) {
                                        //break;
                                        if (!flag) {
                                            lastData = result.list[i].data[n];
                                            flag = true;
                                        }
                                        showData.push(undefined);
                                    }
                                    else {
                                        showData.push(result.list[i].data[n]);
                                    }
                                }
                                //showData = (result.list[i].data).slice(0, n);
                                dictLastData[id] = lastData;
                            }
                            else {  // fixed cycle
                                showData = result.list[i].data;
                            }
                            var name = arrItem[m].alias;
                            arrName.push(name);
                            var count = parmOption.dictPtStatus[id].count;
                            var color = _this.arrColor[count];
                            series.push({
                                name: name,
                                type: 'line',
                                data: showData,
                                itemStyle: {
                                    normal: {
                                        color: color
                                    }
                                }
                            });
                            break;
                        }
                    }
                }
                //for (var i = 0, len = arrItem.length; i < len; i++) {
                //    var item = arrItem[i];
                //    var name = item.alias;
                //    arrName.push(name);
                //    var count = _this.modal.option.dictPtStatus[id].count;
                //    var color = _this.arrColor[count];
                //    series.push({
                //        name: name,
                //        type: 'line',
                //        data: result.list[i].data,
                //        itemStyle: {
                //            normal : {
                //                color: color
                //            }
                //        }
                //    });
                //}
                var options = {
                    legend: {
                        show: false,
                        data: arrName
                    },
                    xAxis: [{
                        type : 'category',
                        boundaryGap : false,
                        data : result.timeShaft,
                        axisLabel: {
                            textStyle: {
                                color: '#ccc'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#777',
                                width: 1,
                                type: 'dashed'
                            }
                        }
                    }],
                    series : series
                }
                var drawOptions = {}
                jQuery.extend(drawOptions, ModalInteract.prototype.defaultOptions, options);
                parmChart = echarts.init($(parmContain).find('#chartShow')[0]).setOption(drawOptions);
                _this.chart = parmChart;
                _this.setDataListColor(parmContain);

                // set last data in recent mode
                if ('recent' == parmOption.timeMode) {
                    var spanReal = $(parmContain).find('.frontCtrl');
                    if (spanReal) {
                        for (var p = 0; p < spanReal.length; p++) {
                            var $item = spanReal.eq(p);
                            var id = $item.attr('pid');
                            $item.find('.interactRealVal').text(dictLastData[id]);
                        }
                    }
                }
                else {
                    var spanReal = $(parmContain).find('.frontCtrl');
                    if (spanReal) {
                        for (var p = 0; p < spanReal.length; p++) {
                            var $item = spanReal.eq(p);
                            var id = $item.attr('pid');
                            $item.find('.interactRealVal').text('');
                        }
                    }
                }
            });
        }
    }

    ModalInteract.prototype.drawChartsEx = function (parmOption, modalId) {
        _this.drawCharts(parmOption, g_dictChart[modalId].chart, g_dictChart[modalId].contain);
    }

    ModalInteract.prototype.insertInteractData = function ($divDst, ptId, ptName, ptUnit) {
        $divDst.append('\
            <form class="form-inline">\
                <span class="form-control frontCtrl interactDsFrame" pId="' + ptId + '" style="cursor:pointer;width:200px;border-radius: 0em 0em 0em 0em;margin-right: -4px;border-width: 0;color: #ccc;border-bottom:1px solid #465b85;">\
                    <span class="interactSpanDsName" style="display:inline-block;width:100px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;vertical-align: bottom;">' + ptName + '</span>\
                    <span class="interactRealVal" style="display:inline-block;width:70px;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:bottom;"></span>\
                </span>\
            </form>\
        ');
        //<input type="text" class="form-control" value="' + ptUnit + '" style="cursor:pointer;width:40px;border-radius: 0 0.5em 0.5em 0;background-color:#465b85;color: #ccc;border:1px solid #465b85;" readonly>\
        var $front = $divDst.find('.frontCtrl');
        $front.off().click(function (e) {
            if (_this.modal.option && _this.modal.option.dictPtStatus) {
                var $tar = $(e.currentTarget);
                var id = $tar.attr('pId');

                var $contain = $tar.closest('.springContainer');
                var modalId;
                if ($contain) {
                    var temp = $contain.attr('id');
                    modalId = temp.split('_')[1];
                    for (var i = 0; i < _this.arrModal.length; i++) {
                        var item = _this.arrModal[i];
                        if (modalId == item.id) {
                            item.modal.option.dictPtStatus[id].show = !item.modal.option.dictPtStatus[id].show;
                            break;
                        }
                    }
                }
                //_this.modal.option.dictPtStatus[id].show = !_this.modal.option.dictPtStatus[id].show;
                _this.screen.saveLayoutOnly();
                _this.drawCharts(item.modal.option, g_dictChart[modalId].chart, g_dictChart[modalId].contain);
            }
        })
    }

    ModalInteract.prototype.initInteractTime = function ($divDst) {
        $divDst.append('\
            <form class="form-inline" style="margin-top: 3px;font-family:Microsoft YaHei;font-size:14px">\
                <div class="form-group" style="width:140px">\
                    <label for="selMode" style="display:block;color:#fafcfd">' + I18n.resource.modalConfig.option.LABEL_MODE + '</label>\
                    <select class="form-control" id="selMode" style="background-color:#f4f6f8;border:1px solid #465b85;color:#646464;width:inherit">\
                        <option value="fixed">' + I18n.resource.modalConfig.option.MODE_FIXED + '</option>\
                        <option value="recent">' + I18n.resource.modalConfig.option.MODE_RECENT + '</option>\
                    </select>\
                </div>\
                <div class="form-group" style="width:120px">\
                    <label for="selInterval" style="display:block;color:#fafcfd">' + I18n.resource.modalConfig.option.LABEL_INTERVAL + '</label>\
                    <select class="form-control" id="selInterval" style="background-color:#f4f6f8;border:1px solid #465b85;color:#646464;width:inherit">\
                        <option value="m1">' + I18n.resource.modalConfig.option.INTERVAL_MIN1 + '</option>\
                        <option value="m5">' + I18n.resource.modalConfig.option.INTERVAL_MIN5 + '</option>\
                        <option value="h1">' + I18n.resource.modalConfig.option.INTERVAL_HOUR1 + '</option>\
                        <option value="d1">' + I18n.resource.modalConfig.option.INTERVAL_DAY1 + '</option>\
                        <option value="M1">' + I18n.resource.modalConfig.option.INTERVAL_MON1 + '</option>\
                    </select>\
                </div>\
                <div class="form-group" id="divTmRange" style="width:380px">\
                    <label for="divRange" style="display:block;color:#fafcfd">' + I18n.resource.modalConfig.option.LABEL_TIME_RANGE + '</label>\
                    <div id="divRange" style="display:inline">\
                        <input class="form-control" type="text" id="tmStart" style="width:165px;cursor:pointer;text-align:center" readonly>\
                        <span class="input-group-addon" style="display: inline;padding-top:6px;padding-bottom:7px;text-align:center;border:1px solid rgb(39, 51, 75);color:#646464;margin-right:-6px;background-color:#f4f6f8;">' + I18n.resource.modalConfig.option.TIP_RANGE_TO + '</span>\
                        <input class="form-control" type="text" id="tmEnd" style="width:165px;cursor:pointer;text-align:center" readonly>\
                    </div>\
                </div>\
                <div class="form-group" id="divTmLast" style="width:340px;display:none">\
                    <label for="divLast" style="display:block;color:#fafcfd">' + I18n.resource.modalConfig.option.LABEL_PERIOD + '</label>\
                    <div id="divLast">\
                        <input class="form-control" type="text" id="inputPeriodValue" style="width:165px;background-color:#f4f6f8;border:1px solid #27334b;border-radius:0.5em 0 0 0.5em;margin-right:-5px;color:#646464">\
                        <select class="form-control" id="selPeriodUnit" style="width:165px;background-color:#f4f6f8;border:1px solid #27334b;border-radius:0 0.5em 0.5em 0;color:#646464">\
                            <option value="hour">' + I18n.resource.modalConfig.option.PERIOD_UNIT_HOUR + '</option>\
                            <option value="day">' + I18n.resource.modalConfig.option.PERIOD_UNIT_DAY + '</option>\
                            <option value="month">' + I18n.resource.modalConfig.option.PERIOD_UNIT_MON + '</option>\
                        </select>\
                    </div>\
                </div>\
                <button class="btn" type="button" id="btnOk" modalId="' + _this.modalId + '" style="width:70px;vertical-align:bottom;color:#f4f6f8;background-color:#288add;">' + I18n.resource.observer.widgets.YES + '</button>\
            </form>\
        ');

        var $selMode = $divDst.find('#selMode');
        var $selInter = $divDst.find('#selInterval');
        var $divTmRange = $divDst.find('#divTmRange');
        var $divTmLast = $divDst.find('#divTmLast');
        $selMode.change(function (e) {
            var $opt = $selInter.children('option');
            var flag = $(e.currentTarget).val();
            switch(flag) {
                case 'fixed':
                    $opt.eq(0).css('display', 'block');
                    $opt.eq(1).css('display', 'block');
                    $opt.eq(2).css('display', 'block');
                    $opt.eq(3).css('display', 'block');
                    $opt.eq(4).css('display', 'block');
                    $divTmRange.css('display', 'inline-block');//
                    $divTmLast.css('display', 'none');
                    break;
                case 'recent':
                    $opt.eq(0).css('display', 'block');
                    $opt.eq(1).css('display', 'block');
                    $opt.eq(2).css('display', 'block');
                    $opt.eq(3).css('display', 'block');
                    $opt.eq(4).css('display', 'none');
                    $divTmRange.css('display', 'none');
                    $divTmLast.css('display', 'inline-block');//
                    break;
                default:
                    break;
            }
        });

        var tmNow = new Date();
        var tmStart = new Date();
        tmStart.setFullYear(tmNow.getFullYear() - 10);
        var $inputStart = $divDst.find('#tmStart');
        $inputStart.val(tmNow.format('yyyy-MM-dd HH:mm:00'));
        $inputStart.css('background-color', '#f4f6f8');
        $inputStart.css('border', '1px solid #27334b');
        $inputStart.css('color', '#646464');
        $inputStart.css('border-radius', '0.5em 0 0 0.5em');
        $inputStart.css('margin-right', '-5px');
        $inputStart.datetimepicker({
            format: 'yyyy-mm-dd hh:mm:00',
            startView: 'month',
            minView: 'hour',
            autoclose: true,
            todayBtn: false,
            pickerPosition: 'top-right',
            initialDate: tmNow,
            startDate: tmStart,
            endDate: tmNow,
            keyboardNavigation: false
        }).off('changeDate').on('changeDate',function(ev){
        });
        var $inputEnd = $divDst.find('#tmEnd');
        $inputEnd.val(tmNow.format('yyyy-MM-dd HH:mm:00'));
        $inputEnd.css('background-color', '#f4f6f8');
        $inputEnd.css('border', '1px solid #27334b');
        $inputEnd.css('color', '#646464');
        $inputEnd.css('border-radius', '0 0.5em 0.5em 0');
        $inputEnd.datetimepicker({
            format: 'yyyy-mm-dd hh:mm:00',
            startView: 'month',
            minView: 'hour',
            autoclose: true,
            todayBtn: false,
            pickerPosition: 'top-right',
            initialDate: tmNow,
            startDate: tmStart,
            endDate: tmNow,
            keyboardNavigation: false
        }).off('changeDate').on('changeDate',function(ev){
        });

        var $inputPerVal = $divDst.find('#inputPeriodValue');
        var $selPerUnit = $divDst.find('#selPeriodUnit');
        var $btnOk = $divDst.find('#btnOk');
        $btnOk.off().click(function (e) {
            var tmMode = $selMode.val();
            var strStart, strEnd;
            if ('fixed' == tmMode) {
                strStart = $inputStart.val();
                strEnd = $inputEnd.val();
            }
            else if ('recent' == tmMode) {
                var tmStart = new Date();
                var periodVal = parseInt($inputPerVal.val());
                if (!periodVal) {
                    alert('Please input time !');
                    return;
                }
                var periodUnit = $selPerUnit.val();
                switch (periodUnit) {
                    case 'hour':
                        var time = tmNow.getTime() - 3600000 * periodVal;
                        tmStart.setTime(time);
                        break;
                    case 'day':
                        var time = tmNow.getTime() - 86400000 * periodVal;
                        tmStart.setTime(time);
                        break;
                    case 'month':
                        var month = tmNow.getMonth();
                        if (0 == month) {
                            tmStart.setFullYear(tmNow.getFullYear() - 1);
                            tmStart.setMonth(11);
                        }
                        else {
                            tmStart.setMonth(month - 1);
                        }
                        break;
                    default :
                        break;
                }
                strStart = tmStart.format('yyyy-MM-dd HH:mm:00');
                strEnd = tmNow.format('yyyy-MM-dd HH:mm:00');
            }
            else {
                alert('Please select mode !');
                return;
            }

            var modalId = $(e.currentTarget).attr('modalId');
            if (modalId) {
                for (var i = 0; i < _this.arrModal.length; i++) {
                    var item = _this.arrModal[i];
                    if (item) {
                        if (modalId == item.id) {
                            if (!item.modal.option) {
                                item.modal.option = {};
                                item.modal.option.dictPtStatus = {};
                            }
                            item.modal.option.timeMode = tmMode;
                            item.modal.option.interval = $selInter.val();
                            item.modal.option.timeStart = strStart;
                            item.modal.option.timeEnd = strEnd;
                            item.modal.option.periodVal = periodVal;
                            item.modal.option.periodUnit = periodUnit;
                            if ('recent' == tmMode) {
                                item.interval = 1000;
                            }
                            else {
                                item.interval = null;
                            }
                            break;
                        }
                    }
                }
            }
            _this.screen.saveLayoutOnly();
            _this.drawCharts(item.modal.option, g_dictChart[modalId].chart, g_dictChart[modalId].contain);
        });

        if (_this.modal.option) {
            $selMode.val(_this.modal.option.timeMode);
            $selInter.val(_this.modal.option.interval);
            $inputStart.val(_this.modal.option.timeStart);
            $inputEnd.val(_this.modal.option.timeEnd);
            $inputPerVal.val(_this.modal.option.periodVal);
            $selPerUnit.val(_this.modal.option.periodUnit);
            if ('recent' == _this.modal.option.timeMode) {
                $selMode.change();
            }
        }
    }

    ModalInteract.prototype.setDataListColor = function (contain) {
        var dataListName;
        if (!contain) {
            dataListName = $('#dataList').find('.frontCtrl');
        }
        else {
            dataListName = $(contain).find('.frontCtrl');
        }
        if (dataListName) {
            for (var j = 0, len = dataListName.length; j < len; j++) {
                var $item = dataListName.eq(j);
                var id = $item.attr('pId');

                var $contain = $item.closest('.springContainer');
                var modalId;
                if ($contain) {
                    var temp = $contain.attr('id');
                    modalId = temp.split('_')[1];
                    for (var i = 0; i < _this.arrModal.length; i++) {
                        var item = _this.arrModal[i];
                        if (modalId == item.id) {
                            //item.modal.option.dictPtStatus[id].show = !item.modal.option.dictPtStatus[id].show;
                            var count = item.modal.option.dictPtStatus[id].count;
                            var bShow = item.modal.option.dictPtStatus[id].show;
                            var $spanDsName = $item.find('.interactSpanDsName');
                            if ($spanDsName) {
                                if (bShow) {
                                    $spanDsName.css('color', _this.arrColor[count]);
                                }
                                else {
                                    $spanDsName.css('color', '');
                                }
                            }
                            //$item.attr('class', 'form-control frontCtrl interactDsFrame');
                            break;
                        }
                    }
                }
            }
        }
    }

    ModalInteract.prototype.setToolTips = function (target, customName, projectName, pointName, pointDesc) {
        var show = new StringBuilder();
        show.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:300px">');
        show.append('    <div class="tooltipContent interactTipsBackground">');
        show.append('        <p class="customName interactTipsStyle"><span class="interactTipsTitleStyle">').append(_this.m_lang.CUSTOM_NAME).append('</span>: ').append(customName).append('</p>');
        show.append('        <p class="projectName interactTipsStyle"><span class="interactTipsTitleStyle">').append(_this.m_lang.PROJECT_NAME).append('</span>: ').append(projectName).append('</p> ');
        show.append('        <p class="pointName interactTipsStyle"><span class="interactTipsTitleStyle">').append(_this.m_lang.POINT_NAME).append('</span>: ').append(pointName).append('</p> ');
        show.append('        <p class="pointDesc interactTipsStyle"><span class="interactTipsTitleStyle">').append(_this.m_lang.POINT_DESC).append('</span>: ').append(pointDesc).append('</p> ');
        show.append('    </div>');
        show.append('    <div class="tooltip-arrow"></div>');
        show.append('</div>');
        var options = {
            placement: 'left',
            title: _this.m_lang.PARAM,
            template: show.toString()
        };
        target.tooltip(options);
    }

    ModalInteract.prototype.setFormulaToolTips = function (target, customName, formula, desc) {
        var show = new StringBuilder();
        show.append('<div class="tooltip" role="tooltip" style="z-index:10;position:fixed;max-width:400px;">');
        show.append('    <div class="tooltipContent interactTipsBackground">');
        show.append('        <p class="customName interactTipsStyle"><span class="interactTipsTitleStyle">').append(_this.m_lang.CUSTOM_NAME).append('</span>: ').append(customName).append('</p>');
        show.append('        <p class="formula interactTipsStyle" style="word-break:normal;"><span class="interactTipsTitleStyle">').append(_this.m_lang.FORMULA_NAME).append('</span>: ').append('</p>');
        show.append('        <p class="pointDesc interactTipsStyle"><span class="interactTipsTitleStyle">').append(_this.m_lang.POINT_DESC).append('</span>: ').append(desc).append('</p>');
        show.append('    </div>');
        show.append('    <div class="tooltip-arrow"></div>');
        show.append('</div>');

        var showFormula = $('<span>' + formula + '</span>');
        var showObj = $(show.toString());
        showFormula.appendTo(showObj.find('.formula')).mathquill();

        var options = {
            placement: 'left',
            title: _this.m_lang.PARAM,
            template: showObj
        };
        target.tooltip(options);
    }

    //ModalInteract.prototype.getProjectNameFromId = function (id, langFlag) {
    //    var name;
    //    var len = AppConfig.projectList.length;
    //    var item;
    //    for (var i = 0; i < len; i++) {
    //        item = AppConfig.projectList[i];
    //        if (id == item.id) {
    //            if (0 == langFlag) {
    //                name = item.name_cn;
    //            }
    //            else {
    //                name = item.name_en;
    //            }
    //            break;
    //        }
    //    }

    //    return name;
    //}

    ModalInteract.prototype.configModal = new ModalInteractConfig();

    return ModalInteract;
})();
(function () {
    var _this;

    function EnergyScreen(page, screen) {
        _this = this;

        this.page = page;
        this.factoryScreen = screen;

        // 中间内容区域容器
        this.windowCtn = null;
        // 数据源面板容器
        this.dataSourcePanelCtn = null;
        // 可选模块面板容器
        this.modulePanelCtn = null;

        this.layout = {
            windowPanel: null,
            dataSourcePanel: null,
            modulePanel: null
        };

        // 可选模块面板
        this.modulePanel = null;
        // 数据源面板
        this.dataSourcePanel = null;
        // dashboard 配置框
        this.modalConfigPane = null;
        
        // dashboard 实际的显示区域
        this.container = null;
        this.$pageNav = null;

        this.store = {};
        this.listEntity = [];
        this.arrEntityOrder = [];
    }

    EnergyScreen.prototype.htmlUrl = '/static/app/WebFactory/views/energyScreen.html';

    EnergyScreen.prototype.show = function () {
        var _this = this;

        WebAPI.get(this.htmlUrl).done(function (html) {
            // 初始化布局
            _this.initLayout(html);
            // 初始化操作
            _this.init();
        });
    };

    EnergyScreen.prototype.onTabPageChanged = function (e) {
        var isShow = e.detail;
        var type = e.currentTarget.dataset.type;

        switch(type) {
            case 'DataSourcePanel':
                if(isShow) {
                    if(_this.dataSourcePanel === null) {
                        _this.dataSourcePanel = new DataSourcePanel(_this);
                    }
                    _this.dataSourcePanel.show();
                } else {
                    _this.dataSourcePanel.hide();
                }
                break;
            case 'ModulePanel':
                if(isShow) {
                    if(_this.modulePanel === null) {
                        _this.modulePanel = new ModulePanel(_this);
                    }
                    _this.modulePanel.show();
                } else {
                    _this.modulePanel.hide();
                }
                break;
        }
    };

    EnergyScreen.prototype.getPageData = function () {
        // loading
        Spinner.spin(this.windowCtn);
        return WebAPI.get("/spring/get/" + this.page.id + '/' + AppConfig.isFactory)
            .always(function (e) {
                Spinner.stop();
            });
    };

    EnergyScreen.prototype.init = function () {
        var promise = this.getPageData();

        promise.done(function (rs) {
            this.store = rs;

            // 初始化导航条
            this.initNav();

            // 初始化配置模态框
            this.initConfigModal();

            // 初始化 可选模块 工厂类
            this.initIoc();

            // 初始化面板
            this.initPanels();

            // 初始化图元数据
            this.initModuleLayout();

            // 显示图元的配置模式
            this.showConfigMode();

            // 初始化同步机制
            this.initSync();

            // 设置一个记录点
            this.dataSign = this.getDataSign();

        }.bind(this));
    };

    EnergyScreen.prototype.getDataSign = function () {
        // 序列化字符串，用于记录当前数据的状态
        return JSON.stringify(this.listEntity) + JSON.stringify(this.arrEntityOrder);
    };

    EnergyScreen.prototype.initPanels = function () {
        // 初始化 数据源面板
        this.initDataSourcePanel();
        // 初始化 可选模块面板
        this.initModulePanel();
    };

    EnergyScreen.prototype.initSync = function () {
        // 注册 ctrl+s 保存事件
        window.addEventListener('keydown', this.onKeyDownActionPerformed, false);
        // 注册 beforeunload 事件
        window.addEventListener('beforeunload', this.onBeforeUnloadActionPerformed, false);
    };

    EnergyScreen.prototype.initNav = function () {
        var _this = this;

        this.$pageNav = $('#pageNav');
        this.$pageTopTools = $('#pageTopTools');

        $('a', this.$pageTopTools).hide();

        // 显示页面名称
        $('#lkName', this.$pageNav).text(this.page.name);
        // 数据同步链接
        $('#lkSync', this.$pageTopTools).off('click').click(function () {
            _this.saveLayout();
        }).show();
        // 更新链接
        $('#lkPreview', this.$pageTopTools).off('click').click(function () {
            $('#lkPreview').attr('href', '/factory/preview/' + _this.page.id);
        }).show();
        // 显示 Nav
        this.$pageNav.show();
        this.$pageTopTools.show();
    },

    /** 初始化 可选模块面板 */
    EnergyScreen.prototype.initModulePanel = function () {
        if(this.modulePanel) {
            this.modulePanel.close();
            this.modulePanel = null;
        }
        if( $(this.modulePanelCtn).is(':visible') ) {
            this.modulePanel = new ModulePanel(this);
            this.modulePanel.show();
        }
        this.modulePanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
        this.modulePanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
    };

    EnergyScreen.prototype.initDataSourcePanel = function () {
        if(this.dataSourcePanel) {
            this.dataSourcePanel.close();
            this.dataSourcePanel = null;
        }
        if( $(this.dataSourcePanelCtn).is(':visible') ) {
            this.dataSourcePanel = new DataSourcePanel(this);
            this.dataSourcePanel.show();
        }
        this.dataSourcePanelCtn.removeEventListener('dock.tabPage.changed', this.onTabPageChanged);
        this.dataSourcePanelCtn.addEventListener('dock.tabPage.changed', this.onTabPageChanged, false);
    };

    EnergyScreen.prototype.initIoc = function () {
        this.factoryIoC = new FactoryIoC('dashboard');
    };

    EnergyScreen.prototype.initConfigModal = function () {
        this.modalConfigPane = new modalConfigurePane(this.windowCtn.querySelector('#energyModal'), this, 'dashboard');
        this.modalConfigPane.show();
    };

    EnergyScreen.prototype.initLayoutDOM = function (html) {
        var divMain, stCt;
        // 创建数据源面板容器
        this.dataSourcePanelCtn = document.createElement('div');
        this.dataSourcePanelCtn.id = 'dataSourcePanel';
        this.dataSourcePanelCtn.setAttribute('caption', I18n.resource.dataSource.TITLE);
        this.dataSourcePanelCtn.dataset.type = 'DataSourcePanel';

        // 图元面板容器
        this.modulePanelCtn = document.createElement('div');
        this.modulePanelCtn.id = '';
        this.modulePanelCtn.setAttribute('caption', I18n.resource.toolBox.TITLE);
        this.modulePanelCtn.dataset.type = 'ModulePanel';

        // 中间内容区域面板容器
        this.windowCtn = document.createElement('div');
        this.windowCtn.id = 'windows';

        // 初始化中间区域的内部 DOM
        divMain = document.createElement('div');
        divMain.className = 'indexContent st-pusher';
        divMain.innerHTML = html;

        stCt = $('<div id="st-container" class="st-container gray-scrollbar">')[0];
        stCt.appendChild(divMain);
        this.windowCtn.appendChild(stCt);

        this.container = divMain.querySelector('#paneCenter');
        this.$container = $(_this.container);
    };

    EnergyScreen.prototype.initLayout = function (html) {
        var dockManager = this.factoryScreen.layout.dockManager;
        var documentNode = this.factoryScreen.layout.documentNode;
        var pageNode = this.factoryScreen.layout.pageNode;

        var windowPanel, dataSourcePanel, modulePanel;
        var windowNode, dataSourceNode, moduleNode;

        this.initLayoutDOM(html);

        this.layout.windowPanel = windowPanel = new dockspawn.PanelContainer(this.windowCtn, dockManager);
        this.layout.dataSourcePanel = dataSourcePanel = new dockspawn.PanelContainer(this.dataSourcePanelCtn, dockManager);
        this.layout.modulePanel = modulePanel = new dockspawn.PanelContainer(this.modulePanelCtn, dockManager);

        dataSourceNode = dockManager.dockFill(pageNode, dataSourcePanel);
        moduleNode = dockManager.dockFill(dataSourceNode, modulePanel);
        windowNode = dockManager.dockFill(documentNode, windowPanel);

        return {
            dataSourceNode: dataSourceNode,
            moduleNode: moduleNode,
            windowNode: windowNode
        };
    };

    EnergyScreen.prototype.initModuleLayout = function () {
        if (!(this.store && this.store.layout)) return;
        for (var i = 0, item; i < this.store.layout.length; i++) {
            for (var j = 0; j < this.store.layout[i].length; j++) {
                item = this.store.layout[i][j];
                var modelClass,entity;
                if (item.modal.type) {
                    //regist IoC
                    modelClass = this.factoryIoC.getModel(item.modal.type);
                    if(!modelClass) continue;
                    if (item.isNotRender) continue;
                    entity = new modelClass(this, item);
                    this.listEntity[item.id] = entity;
                    this.arrEntityOrder.push(item.id);
                }
            }
        }
        //如果一个页面只有entity且 spanR=6,spanC=12
        var $springCtn = $('#paneCenter').children('.springContainer');
        if($springCtn.length == 1 && parseFloat($springCtn[0].style.height) >= parseFloat("99%") && parseFloat($springCtn[0].style.width) >= parseFloat("99%")){
            $springCtn.children('.panel-default').css({border: 'none'});
        }
    };

    EnergyScreen.prototype.onKeyDownActionPerformed = function (e) {
        if (e.which === 83 && e.ctrlKey) {
            e.stopPropagation();
            e.preventDefault();
            try {
                _this.saveLayout();
            } catch (e) {
                Log.exception(e);
            }
        }
    };

    EnergyScreen.prototype.onBeforeUnloadActionPerformed = function (e) {
        // 判断是否有数据没有提交
        if ( _this.dataSign !== _this.getDataSign() ) {
            e.returnValue = I18n.resource.screen.UNSAVED_PAGE_TIP;
            return e.returnValue;
        }
    };

    EnergyScreen.prototype.showConfigMode = function () {
        Spinner.spin(document.getElementById('paneCenter'));
        for (var key in this.listEntity) {
            this.listEntity[key].configure();
        }
        Spinner.stop();
    };

    EnergyScreen.prototype.setEntity = function () {};

    EnergyScreen.prototype.removeEntity = function (id) {
        this.listEntity[id] = null;
        delete this.listEntity[id];
        this.arrEntityOrder.splice(this.arrEntityOrder.indexOf(id), 1);
    };

    EnergyScreen.prototype.rebornEntity = function (entityParams, tragetType, targetTitle, modalNoneEdit) {
        this.removeEntity(entityParams.id);

        entityParams.modal.type = tragetType;
        entityParams.modal.title = '';
        var modelClass = this.factoryIoC.getModel(tragetType);
        if ((!entityParams.isNotRender) && !modalNoneEdit) {
            if ('ModalInteract' == entityParams.modal.type) {
                entityParams.spanC = 9;
                entityParams.spanR = 3;
            }
            else if (entityParams.modal.type !== 'ModalMix') {
                entityParams.spanC = modelClass.prototype.optionTemplate.minWidth;
                entityParams.spanR = modelClass.prototype.optionTemplate.minHeight;
            }
        }
        var entity = new modelClass(this, entityParams);
        this.listEntity[entity.entity.id] = entity;
        this.arrEntityOrder.push(entity.entity.id);
        entity.configure();
    };

    EnergyScreen.prototype.saveLayout = function () {
        var _this = this;
        var arrEntity = [];
        var entity = null;

        for (var i = 0; i < this.arrEntityOrder.length; i++) {
            entity = this.listEntity[this.arrEntityOrder[i]].entity;
            if ( ['ModalObserver', 'ModalNote', 'ModalMix', 'ModalHtml', 'ModalChartCustom', 'ModalWeather'].indexOf(entity.modal.type) > -1 ) {
                arrEntity.push(entity);
            }else if(entity.modal.type == 'ModalPointKPI'){
                arrEntity.push(this.dealWithEntity(entity));
            }else if(entity.modal.type == 'ModalReportChapter'){
                if(entity.modal.option && entity.modal.option.menuId && entity.modal.option.menuId != ''){
                    arrEntity.push(entity);
                }
            }else {
                if (entity.modal.type != 'ModalNone' && (!entity.modal.points || entity.modal.points.length == 0)) continue;
                arrEntity.push(entity);
            }
        }
        var data = {
            creatorId: AppConfig.userId,
            menuItemId: this.page.id,
            isFactory: AppConfig.isFactory,
            layout: [arrEntity]
        };
        this.store.id && (data.id = this.store.id);

        WebAPI.post('/spring/saveLayout', data).done(function (result) {
            // 更新 storeSerializedStr, 标识存储的数据被更改
            _this.dataSign = _this.getDataSign();
        });
    };

    EnergyScreen.prototype.dealWithEntity = function(entity){
        entity.modal.points = [];
        entity.modal.interval = 5;
        entity.modal.option && entity.modal.option.kpiList && entity.modal.option.kpiList.forEach(function(kpiItem){
            traverseTree(kpiItem);
        });
        function traverseTree(tree) {
            dealWithNode(tree);
            traverse(tree, 0);
        }
        function traverse(node, i) {//广度优先遍历
            var children = node.list;
            if (children != null && children.length > 0) {
                dealWithNode(children[i]);
                if (i == children.length - 1) {
                    for(var j = 0; j < children.length; j++){
                        traverse(children[j], 0);
                    }
                } else {
                    traverse(node, i + 1);
                }
            }
        }
        function dealWithNode(child){
            delete child.pointPassData;
            delete child.show;
            if(child.pointKPI){
                entity.modal.points.push(child.pointKPI);
            }
            if(child.pointGrade){
                entity.modal.points.push(child.pointGrade);
            }
            if(child.pointPass){
                entity.modal.points.push(child.pointPass);
            }
        }
        return entity;
    };

    EnergyScreen.prototype.destroyLayouts = function () {
        var dockManager = this.factoryScreen.layout.dockManager;
        // 销毁所有面板
        for (var layout in this.layout) {
            dockManager.requestUndock(this.layout[layout]);
        }

        this.layout = {};
    };

    EnergyScreen.prototype.close = function () {
        // 隐藏 页面导航条
        this.$pageNav.hide();
        this.$pageTopTools.hide();
        $('#lkSync', this.$pageNav).off();

        // 清除 ctrl+s 保存事件
        window.removeEventListener('keydown', this.onKeyDownActionPerformed);
        // 清除 beforeunload 事件
        window.removeEventListener('beforeunload', this.onBeforeUnloadActionPerformed);

        // 销毁配置窗口
        if (this.modalConfigPane) {
            this.modalConfigPane.close();
        }
        // 销毁遗留的异常DOM
        $('.datetimepicker').remove();
        // 销毁布局
        this.destroyLayouts();
    };

    namespace('factory.screens').EnergyScreen = EnergyScreen;
})();
