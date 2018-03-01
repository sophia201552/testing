!function($,undefined){function Table(ele,options){var $ele=this.$tblBody=$(ele),id=$ele.attr("id");this.options=$.extend({},Table.DEFAULTS,options),this.$wrap=$('<div class="ui-tbl-w"></div>').insertAfter($ele),this.$hWrap=$('<div class="ui-tbl-whead"></div>').appendTo(this.$wrap),this.$bWrap=$('<div class="ui-tbl-wbody"></div>').appendTo(this.$wrap),this.$fWrap=$('<div class="ui-tbl-wfoot"></div>').appendTo(this.$wrap),this.$tblHeader=$('<table class="ui-tbl-htable table table-bordered">').appendTo(this.$hWrap),this.$tblBody=$ele.addClass("ui-tbl-btable table table-bordered").appendTo(this.$bWrap),this.$tblFooter=$('<div class="ui-tbl-footer">').appendTo(this.$fWrap),this.$thead=$("<thead>").appendTo(this.$tblHeader),this.$tbody=$("<tbody>").appendTo(this.$tblBody),"string"==typeof id&&this.$tblBody.attr("id",id),this.data=null,this.total=null,this._buildHeader()}function Plugin(option,args){var $this=this,data=$this.data("ui.w.table"),options="object"==typeof option&&option;return data||"destroy"!=option?(data||$this.data("ui.w.table",data=new Table(this,options)),"string"==typeof option?data[option](args):void 0):void 0}var util={string:{formatEL:function(str,o){if(!str||!o)return"";for(var i in o)o.hasOwnProperty(i)&&(str=str.replace(new RegExp("{"+i+"}","g"),o[i]));return str}}};Table.prototype._buildHeader=function(){var prefix=this.options.colPrefix,cols=this.options.columns,arrHtml=[];arrHtml.push("<tr>");for(var i=0,len=cols.length;len>i;i++)arrHtml.push(util.string.formatEL('<th class="{prefix}{name}">{title}</th>',{prefix:prefix,name:cols[i].name,title:cols[i].title}));arrHtml.push("</tr>"),this.$thead.html(arrHtml.join(""))},Table.prototype._buildFooter=function(ds){var tpl=this.options.footerTpl;this.$tblFooter.html(util.string.formatEL(tpl,{total:ds.length})).show()},Table.prototype.loading=function(){this.$tblFooter.hide(),this.$tbody.html('<tr><td class="ui-tbl-col-i-info" col-span="'+this.options.columns.length+'"><img src="/static/images/ballsline.gif" alt="loading" /></td></tr>')},Table.prototype.load=function(ds){this._renderTable(ds),this.total=ds.length,this.data=ds},Table.prototype._renderTable=function(ds){var arrHtml=[],row=null,cssCls=null,column=null;if(!ds||ds.length<=0)return void this._showNoData();for(var i=0,leni=ds.length;leni>i;i++){row=ds[i],arrHtml.push('<tr data-rowindex="'+i+'">');for(var t=0,lent=this.options.columns.length;lent>t;t++){switch(column=this.options.columns[t],cssCls=this.options.colPrefix+column.name,arrHtml.push('<td class="'+cssCls+'">'),typeof column.formatter){case"string":arrHtml.push(util.string.formatEL(column.formatter,row));break;case"function":arrHtml.push(column.formatter(i,row)||"")}arrHtml.push("</td>")}arrHtml.push("</tr>")}this.$tbody.html(arrHtml.join("")),this._buildFooter(ds)},Table.prototype.filter=function(rule){var ds=this.data,result=[];if(rule)for(var i=0,len=ds.length;len>i;i++)for(var r in rule)ds[i].hasOwnProperty(r)&&ds[i][r].toLowerCase().indexOf(rule[r].toLowerCase())>-1&&result.push(ds[i]);else result=ds;this._renderTable(result)},Table.prototype.setStretchHeight=function(l){this.$bWrap.css("height",l)},Table.prototype.getData=function(){return this.data},Table.prototype._showNoData=function(){this.$tblFooter.hide(),this.$tbody.html('<tr><td class="ui-tbl-col-i-info" col-span="'+this.options.columns.length+'">no records</td></tr>')},Table.prototype.destroy=function(){},Table.DEFAULTS={colPrefix:"ui-tbl-col-",footerTpl:"<strong>{total}</strong> records in total"},$.fn.table=Plugin}(jQuery),function($,undefined){function Validator(ele,options){return ele?(this.$ele=$(ele),this.options=$.extend({},Validator.DEFAULTS,options),Validator.merge(this,this.options.elements||[]),this):this}function Plugin(option,args){var $this=this,data=$this.data("ui.w.validator"),options="object"==typeof option&&option;return data||"destroy"!=option?(data||$this.data("ui.w.validator",data=new Validator(this,options)),"string"==typeof option?data[option](args):void 0):void 0}var push=[].push,oString=Object.prototype.toString;Validator.prototype.valid=function(){var row,rule,$selectors,ele,$ele,results=[];this.resetStatus();for(var i=0,len=this.length;len>i;i++){row=this[i],$selectors="object"==typeof row.selector?row.selector:$(row.selector,this.$ele);for(var t=0,len2=row.rules.length;len2>t;t++){rule=row.rules[t];for(var m=0,len3=$selectors.length;len3>m;m++)if($ele=$selectors.eq(m),ele=$selectors[m],!rule.valid.test($ele.val())&&(results.push({target:$ele,msg:rule.msg}),$ele.parents(".form-group").addClass("has-error"),null!==ele.timer&&(window.clearTimeout(ele.timer),ele.timer=null),$ele.tooltip({placement:"top",trigger:"manual"}).attr("data-original-title",rule.msg).tooltip("show"),ele.timer=window.setTimeout(function($ele){return function(){$ele.tooltip("hide")}}($ele),3e3),this.options.interruptWhenError))return{status:!1,result:results}}}return 0===results.length?{status:!0}:{status:!1,result:results}},Validator.prototype.resetStatus=function(){for(var $selectors,row,$ele,ele,i=0,len=this.length;len>i;i++){row=this[i],$selectors="object"==typeof row.selector?row.selector:$(row.selector,this.$ele);for(var t=0,len2=$selectors.length;len2>t;t++)$ele=$selectors.eq(t),ele=$selectors[t],$ele.parents(".form-group").removeClass("has-error has-success"),$ele.tooltip("destroy"),null!==ele.timer&&(window.clearTimeout(ele.timer),ele.timer=null)}},Validator.prototype.filter=function(selector){return this._seek(selector,!1)},Validator.prototype.not=function(selector){return this._seek(selector,!0)},Validator.prototype._seek=function(selector,not){var ret,results=[],eles=this.options.elements,regx="string"==typeof selector?new RegExp("^"+selector+"$"):regx;if("[object RegExp]"!==oString.call(regx))throw"selector is not a RegExp object or a string!";for(var i=0,len=eles.length;len>i;i++)!!regx.test(eles[i].name)!==not&&results.push(eles[i]);return ret=Validator.merge(new this.constructor,results),ret.prevObj=this,ret.$ele=this.$ele,ret.options=this.options,ret},Validator.prototype.length=0,Validator.prototype.splice=[].splice,Validator.merge=function(results,arr){for(var i=0,len=arr.length;len>i;i++)push.call(results,arr[i]);return results},Validator.DEFAULTS={interruptWhenError:!0},$.fn.validator=Plugin}(jQuery);