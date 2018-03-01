/*! jQuery v2.1.4 | (c) 2005, 2015 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l=a.document,m="2.1.4",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return!n.isArray(a)&&a-parseFloat(a)+1>=0},isPlainObject:function(a){return"object"!==n.type(a)||a.nodeType||n.isWindow(a)?!1:a.constructor&&!j.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=l.createElement("script"),b.text=a,l.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:g.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(e=d.call(arguments,2),f=function(){return a.apply(b||this,e.concat(d.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:k}),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b="length"in a&&a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N=M.replace("w","w#"),O="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+N+"))|)"+L+"*\\]",P=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+O+")*)|.*)\\)|)",Q=new RegExp(L+"+","g"),R=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),S=new RegExp("^"+L+"*,"+L+"*"),T=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),U=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),V=new RegExp(P),W=new RegExp("^"+N+"$"),X={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+O),PSEUDO:new RegExp("^"+P),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,aa=/[+~]/,ba=/'|\\/g,ca=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),da=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ea=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(fa){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],k=b.nodeType,"string"!=typeof a||!a||1!==k&&9!==k&&11!==k)return d;if(!e&&p){if(11!==k&&(f=_.exec(a)))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return H.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName)return H.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=1!==k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(ba,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+ra(o[l]);w=aa.test(a)&&pa(b.parentNode)||b,x=o.join(",")}if(x)try{return H.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function pa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=g.documentElement,e=g.defaultView,e&&e!==e.top&&(e.addEventListener?e.addEventListener("unload",ea,!1):e.attachEvent&&e.attachEvent("onunload",ea)),p=!f(g),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(g.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(g.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!g.getElementsByName||!g.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ca,da);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ca,da);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(g.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\f]' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){var b=g.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",P)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===g||a.ownerDocument===v&&t(v,a)?-1:b===g||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,h=[a],i=[b];if(!e||!f)return a===g?-1:b===g?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?la(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},g):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ca,da),a[3]=(a[3]||a[4]||a[5]||"").replace(ca,da),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ca,da).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(Q," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(ca,da),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return W.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(ca,da).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:oa(function(){return[0]}),last:oa(function(a,b){return[b-1]}),eq:oa(function(a,b,c){return[0>c?c+b:c]}),even:oa(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:oa(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:oa(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:oa(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function qa(){}qa.prototype=d.filters=d.pseudos,d.setFilters=new qa,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function ra(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function sa(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function ta(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ua(a,b,c){for(var d=0,e=b.length;e>d;d++)ga(a,b[d],c);return c}function va(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function wa(a,b,c,d,e,f){return d&&!d[u]&&(d=wa(d)),e&&!e[u]&&(e=wa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ua(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:va(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=va(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=va(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function xa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=sa(function(a){return a===b},h,!0),l=sa(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[sa(ta(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return wa(i>1&&ta(m),i>1&&ra(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&xa(a.slice(i,e)),f>e&&xa(a=a.slice(e)),f>e&&ra(a))}m.push(c)}return ta(m)}function ya(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=F.call(i));s=va(s)}H.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&ga.uniqueSort(i)}return k&&(w=v,j=t),r};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=xa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,ya(e,d)),f.selector=a}return f},i=ga.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ca,da),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ca,da),aa.test(j[0].type)&&pa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&ra(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,aa.test(a)&&pa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return g.call(b,a)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=n.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:l,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}return d=l.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=l,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};A.prototype=n.fn,y=n(l);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?"string"==typeof a?g.call(n(a),this[0]):g.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(C[a]||n.unique(e),B.test(a)&&e.reverse()),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return n.each(a.match(E)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(b=a.memory&&l,c=!0,g=e||0,e=0,f=h.length,d=!0;h&&f>g;g++)if(h[g].apply(l[0],l[1])===!1&&a.stopOnFalse){b=!1;break}d=!1,h&&(i?i.length&&j(i.shift()):b?h=[]:k.disable())},k={add:function(){if(h){var c=h.length;!function g(b){n.each(b,function(b,c){var d=n.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&g(c)})}(arguments),d?f=h.length:b&&(e=c,j(b))}return this},remove:function(){return h&&n.each(arguments,function(a,b){var c;while((c=n.inArray(b,h,c))>-1)h.splice(c,1),d&&(f>=c&&f--,g>=c&&g--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],f=0,this},disable:function(){return h=i=b=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,b||k.disable(),this},locked:function(){return!i},fireWith:function(a,b){return!h||c&&!i||(b=b||[],b=[a,b.slice?b.slice():b],d?i.push(b):j(b)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!c}};return k},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(H.resolveWith(l,[n]),n.fn.triggerHandler&&(n(l).triggerHandler("ready"),n(l).off("ready"))))}});function I(){l.removeEventListener("DOMContentLoaded",I,!1),a.removeEventListener("load",I,!1),n.ready()}n.ready.promise=function(b){return H||(H=n.Deferred(),"complete"===l.readyState?setTimeout(n.ready):(l.addEventListener("DOMContentLoaded",I,!1),a.addEventListener("load",I,!1))),H.promise(b)},n.ready.promise();var J=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};n.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function K(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=n.expando+K.uid++}K.uid=1,K.accepts=n.acceptData,K.prototype={key:function(a){if(!K.accepts(a))return 0;var b={},c=a[this.expando];if(!c){c=K.uid++;try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,n.extend(a,b)}}return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,e=this.key(a),f=this.cache[e];if("string"==typeof b)f[b]=c;else if(n.isEmptyObject(f))n.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(E)||[])),c=d.length;while(c--)delete g[d[c]]}},hasData:function(a){return!n.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var L=new K,M=new K,N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(O,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}M.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return M.hasData(a)||L.hasData(a)},data:function(a,b,c){
return M.access(a,b,c)},removeData:function(a,b){M.remove(a,b)},_data:function(a,b,c){return L.access(a,b,c)},_removeData:function(a,b){L.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=M.get(f),1===f.nodeType&&!L.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d])));L.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){M.set(this,a)}):J(this,function(b){var c,d=n.camelCase(a);if(f&&void 0===b){if(c=M.get(f,a),void 0!==c)return c;if(c=M.get(f,d),void 0!==c)return c;if(c=P(f,d,void 0),void 0!==c)return c}else this.each(function(){var c=M.get(this,d);M.set(this,d,b),-1!==a.indexOf("-")&&void 0!==c&&M.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){M.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=L.get(a,b),c&&(!d||n.isArray(c)?d=L.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return L.get(a,c)||L.access(a,c,{empty:n.Callbacks("once memory").add(function(){L.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=L.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var Q=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,R=["Top","Right","Bottom","Left"],S=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)},T=/^(?:checkbox|radio)$/i;!function(){var a=l.createDocumentFragment(),b=a.appendChild(l.createElement("div")),c=l.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var U="undefined";k.focusinBubbles="onfocusin"in a;var V=/^key/,W=/^(?:mouse|pointer|contextmenu)|click/,X=/^(?:focusinfocus|focusoutblur)$/,Y=/^([^.]*)(?:\.(.+)|)$/;function Z(){return!0}function $(){return!1}function _(){try{return l.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return typeof n!==U&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(E)||[""],j=b.length;while(j--)h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.hasData(a)&&L.get(a);if(r&&(i=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&(delete r.handle,L.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,m,o,p=[d||l],q=j.call(b,"type")?b.type:b,r=j.call(b,"namespace")?b.namespace.split("."):[];if(g=h=d=d||l,3!==d.nodeType&&8!==d.nodeType&&!X.test(q+n.event.triggered)&&(q.indexOf(".")>=0&&(r=q.split("."),q=r.shift(),r.sort()),k=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=r.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},e||!o.trigger||o.trigger.apply(d,c)!==!1)){if(!e&&!o.noBubble&&!n.isWindow(d)){for(i=o.delegateType||q,X.test(i+q)||(g=g.parentNode);g;g=g.parentNode)p.push(g),h=g;h===(d.ownerDocument||l)&&p.push(h.defaultView||h.parentWindow||a)}f=0;while((g=p[f++])&&!b.isPropagationStopped())b.type=f>1?i:o.bindType||q,m=(L.get(g,"events")||{})[b.type]&&L.get(g,"handle"),m&&m.apply(g,c),m=k&&g[k],m&&m.apply&&n.acceptData(g)&&(b.result=m.apply(g,c),b.result===!1&&b.preventDefault());return b.type=q,e||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!n.acceptData(d)||k&&n.isFunction(d[q])&&!n.isWindow(d)&&(h=d[k],h&&(d[k]=null),n.event.triggered=q,d[q](),n.event.triggered=void 0,h&&(d[k]=h)),b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(L.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(g.namespace))&&(a.handleObj=g,a.data=g.data,e=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(a.result=e)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>=0:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||l,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=W.test(e)?this.mouseHooks:V.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=l),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==_()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===_()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?Z:$):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:$,isPropagationStopped:$,isImmediatePropagationStopped:$,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=Z,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=Z,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=Z,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.focusinBubbles||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=L.access(d,b);e||d.addEventListener(a,c,!0),L.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=L.access(d,b)-1;e?L.access(d,b,e):(d.removeEventListener(a,c,!0),L.remove(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=$;else if(!d)return this;return 1===e&&(f=d,d=function(a){return n().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=$),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});var aa=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,ba=/<([\w:]+)/,ca=/<|&#?\w+;/,da=/<(?:script|style|link)/i,ea=/checked\s*(?:[^=]|=\s*.checked.)/i,fa=/^$|\/(?:java|ecma)script/i,ga=/^true\/(.*)/,ha=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ia={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ia.optgroup=ia.option,ia.tbody=ia.tfoot=ia.colgroup=ia.caption=ia.thead,ia.th=ia.td;function ja(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function ka(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function la(a){var b=ga.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function ma(a,b){for(var c=0,d=a.length;d>c;c++)L.set(a[c],"globalEval",!b||L.get(b[c],"globalEval"))}function na(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(L.hasData(a)&&(f=L.access(a),g=L.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}M.hasData(a)&&(h=M.access(a),i=n.extend({},h),M.set(b,i))}}function oa(a,b){var c=a.getElementsByTagName?a.getElementsByTagName(b||"*"):a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function pa(a,b){var c=b.nodeName.toLowerCase();"input"===c&&T.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}n.extend({clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=oa(h),f=oa(a),d=0,e=f.length;e>d;d++)pa(f[d],g[d]);if(b)if(c)for(f=f||oa(a),g=g||oa(h),d=0,e=f.length;e>d;d++)na(f[d],g[d]);else na(a,h);return g=oa(h,"script"),g.length>0&&ma(g,!i&&oa(a,"script")),h},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k=b.createDocumentFragment(),l=[],m=0,o=a.length;o>m;m++)if(e=a[m],e||0===e)if("object"===n.type(e))n.merge(l,e.nodeType?[e]:e);else if(ca.test(e)){f=f||k.appendChild(b.createElement("div")),g=(ba.exec(e)||["",""])[1].toLowerCase(),h=ia[g]||ia._default,f.innerHTML=h[1]+e.replace(aa,"<$1></$2>")+h[2],j=h[0];while(j--)f=f.lastChild;n.merge(l,f.childNodes),f=k.firstChild,f.textContent=""}else l.push(b.createTextNode(e));k.textContent="",m=0;while(e=l[m++])if((!d||-1===n.inArray(e,d))&&(i=n.contains(e.ownerDocument,e),f=oa(k.appendChild(e),"script"),i&&ma(f),c)){j=0;while(e=f[j++])fa.test(e.type||"")&&c.push(e)}return k},cleanData:function(a){for(var b,c,d,e,f=n.event.special,g=0;void 0!==(c=a[g]);g++){if(n.acceptData(c)&&(e=c[L.expando],e&&(b=L.cache[e]))){if(b.events)for(d in b.events)f[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);L.cache[e]&&delete L.cache[e]}delete M.cache[c[M.expando]]}}}),n.fn.extend({text:function(a){return J(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=ja(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=ja(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(oa(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&ma(oa(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(oa(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return J(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!da.test(a)&&!ia[(ba.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(aa,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(oa(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(oa(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,m=this,o=l-1,p=a[0],q=n.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&ea.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(c=n.buildFragment(a,this[0].ownerDocument,!1,this),d=c.firstChild,1===c.childNodes.length&&(c=d),d)){for(f=n.map(oa(c,"script"),ka),g=f.length;l>j;j++)h=c,j!==o&&(h=n.clone(h,!0,!0),g&&n.merge(f,oa(h,"script"))),b.call(this[j],h,j);if(g)for(i=f[f.length-1].ownerDocument,n.map(f,la),j=0;g>j;j++)h=f[j],fa.test(h.type||"")&&!L.access(h,"globalEval")&&n.contains(i,h)&&(h.src?n._evalUrl&&n._evalUrl(h.src):n.globalEval(h.textContent.replace(ha,"")))}return this}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),g=e.length-1,h=0;g>=h;h++)c=h===g?this:this.clone(!0),n(e[h])[b](c),f.apply(d,c.get());return this.pushStack(d)}});var qa,ra={};function sa(b,c){var d,e=n(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:n.css(e[0],"display");return e.detach(),f}function ta(a){var b=l,c=ra[a];return c||(c=sa(a,b),"none"!==c&&c||(qa=(qa||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=qa[0].contentDocument,b.write(),b.close(),c=sa(a,b),qa.detach()),ra[a]=c),c}var ua=/^margin/,va=new RegExp("^("+Q+")(?!px)[a-z%]+$","i"),wa=function(b){return b.ownerDocument.defaultView.opener?b.ownerDocument.defaultView.getComputedStyle(b,null):a.getComputedStyle(b,null)};function xa(a,b,c){var d,e,f,g,h=a.style;return c=c||wa(a),c&&(g=c.getPropertyValue(b)||c[b]),c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),va.test(g)&&ua.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function ya(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d=l.documentElement,e=l.createElement("div"),f=l.createElement("div");if(f.style){f.style.backgroundClip="content-box",f.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===f.style.backgroundClip,e.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",e.appendChild(f);function g(){f.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",f.innerHTML="",d.appendChild(e);var g=a.getComputedStyle(f,null);b="1%"!==g.top,c="4px"===g.width,d.removeChild(e)}a.getComputedStyle&&n.extend(k,{pixelPosition:function(){return g(),b},boxSizingReliable:function(){return null==c&&g(),c},reliableMarginRight:function(){var b,c=f.appendChild(l.createElement("div"));return c.style.cssText=f.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",f.style.width="1px",d.appendChild(e),b=!parseFloat(a.getComputedStyle(c,null).marginRight),d.removeChild(e),f.removeChild(c),b}})}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var za=/^(none|table(?!-c[ea]).+)/,Aa=new RegExp("^("+Q+")(.*)$","i"),Ba=new RegExp("^([+-])=("+Q+")","i"),Ca={position:"absolute",visibility:"hidden",display:"block"},Da={letterSpacing:"0",fontWeight:"400"},Ea=["Webkit","O","Moz","ms"];function Fa(a,b){if(b in a)return b;var c=b[0].toUpperCase()+b.slice(1),d=b,e=Ea.length;while(e--)if(b=Ea[e]+c,b in a)return b;return d}function Ga(a,b,c){var d=Aa.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Ha(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+R[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+R[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+R[f]+"Width",!0,e))):(g+=n.css(a,"padding"+R[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+R[f]+"Width",!0,e)));return g}function Ia(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=wa(a),g="border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=xa(a,b,f),(0>e||null==e)&&(e=a.style[b]),va.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Ha(a,b,c||(g?"border":"content"),d,f)+"px"}function Ja(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=L.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&S(d)&&(f[g]=L.access(d,"olddisplay",ta(d.nodeName)))):(e=S(d),"none"===c&&e||L.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=xa(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Fa(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=Ba.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||n.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Fa(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=xa(a,b,d)),"normal"===e&&b in Da&&(e=Da[b]),""===c||c?(f=parseFloat(e),c===!0||n.isNumeric(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?za.test(n.css(a,"display"))&&0===a.offsetWidth?n.swap(a,Ca,function(){return Ia(a,b,d)}):Ia(a,b,d):void 0},set:function(a,c,d){var e=d&&wa(a);return Ga(a,c,d?Ha(a,b,d,"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),n.cssHooks.marginRight=ya(k.reliableMarginRight,function(a,b){return b?n.swap(a,{display:"inline-block"},xa,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+R[d]+b]=f[d]||f[d-2]||f[0];return e}},ua.test(a)||(n.cssHooks[a+b].set=Ga)}),n.fn.extend({css:function(a,b){return J(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=wa(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Ja(this,!0)},hide:function(){return Ja(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){S(this)?n(this).show():n(this).hide()})}});function Ka(a,b,c,d,e){return new Ka.prototype.init(a,b,c,d,e)}n.Tween=Ka,Ka.prototype={constructor:Ka,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Ka.propHooks[this.prop];return a&&a.get?a.get(this):Ka.propHooks._default.get(this)},run:function(a){var b,c=Ka.propHooks[this.prop];return this.options.duration?this.pos=b=n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ka.propHooks._default.set(this),this}},Ka.prototype.init.prototype=Ka.prototype,Ka.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Ka.propHooks.scrollTop=Ka.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=Ka.prototype.init,n.fx.step={};var La,Ma,Na=/^(?:toggle|show|hide)$/,Oa=new RegExp("^(?:([+-])=|)("+Q+")([a-z%]*)$","i"),Pa=/queueHooks$/,Qa=[Va],Ra={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=Oa.exec(b),f=e&&e[3]||(n.cssNumber[a]?"":"px"),g=(n.cssNumber[a]||"px"!==f&&+d)&&Oa.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function Sa(){return setTimeout(function(){La=void 0}),La=n.now()}function Ta(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=R[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ua(a,b,c){for(var d,e=(Ra[b]||[]).concat(Ra["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Va(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&S(a),q=L.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?L.get(a,"olddisplay")||ta(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Na.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?ta(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=L.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;L.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ua(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function Wa(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function Xa(a,b,c){var d,e,f=0,g=Qa.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=La||Sa(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:La||Sa(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(Wa(k,j.opts.specialEasing);g>f;f++)if(d=Qa[f].call(j,a,k,j.opts))return d;return n.map(k,Ua,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(Xa,{tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],Ra[c]=Ra[c]||[],Ra[c].unshift(b)},prefilter:function(a,b){b?Qa.unshift(a):Qa.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(S).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=Xa(this,n.extend({},a),f);(e||L.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=L.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Pa.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=L.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Ta(b,!0),a,d,e)}}),n.each({slideDown:Ta("show"),slideUp:Ta("hide"),slideToggle:Ta("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(La=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),La=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Ma||(Ma=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(Ma),Ma=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a=l.createElement("input"),b=l.createElement("select"),c=b.appendChild(l.createElement("option"));a.type="checkbox",k.checkOn=""!==a.value,k.optSelected=c.selected,b.disabled=!0,k.optDisabled=!c.disabled,a=l.createElement("input"),a.value="t",a.type="radio",k.radioValue="t"===a.value}();var Ya,Za,$a=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return J(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===U?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?Za:Ya)),
void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void n.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),Za={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=$a[b]||n.find.attr;$a[b]=function(a,b,d){var e,f;return d||(f=$a[b],$a[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,$a[b]=f),e}});var _a=/^(?:input|select|textarea|button)$/i;n.fn.extend({prop:function(a,b){return J(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||_a.test(a.nodeName)||a.href?a.tabIndex:-1}}}}),k.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var ab=/[\t\r\n\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h="string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ab," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0===arguments.length||"string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ab," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?n.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=n(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===U||"boolean"===c)&&(this.className&&L.set(this,"__className__",this.className),this.className=this.className||a===!1?"":L.get(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ab," ").indexOf(b)>=0)return!0;return!1}});var bb=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(bb,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(d.value,f)>=0)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},k.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var cb=n.now(),db=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&n.error("Invalid XML: "+a),b};var eb=/#.*$/,fb=/([?&])_=[^&]*/,gb=/^(.*?):[ \t]*([^\r\n]*)$/gm,hb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,ib=/^(?:GET|HEAD)$/,jb=/^\/\//,kb=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,lb={},mb={},nb="*/".concat("*"),ob=a.location.href,pb=kb.exec(ob.toLowerCase())||[];function qb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function rb(a,b,c,d){var e={},f=a===mb;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function sb(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function tb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function ub(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:ob,type:"GET",isLocal:hb.test(pb[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":nb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?sb(sb(a,n.ajaxSettings),b):sb(n.ajaxSettings,a)},ajaxPrefilter:qb(lb),ajaxTransport:qb(mb),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!f){f={};while(b=gb.exec(e))f[b[1].toLowerCase()]=b[2]}b=f[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?e:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return c&&c.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||ob)+"").replace(eb,"").replace(jb,pb[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(h=kb.exec(k.url.toLowerCase()),k.crossDomain=!(!h||h[1]===pb[1]&&h[2]===pb[2]&&(h[3]||("http:"===h[1]?"80":"443"))===(pb[3]||("http:"===pb[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),rb(lb,k,b,v),2===t)return v;i=n.event&&k.global,i&&0===n.active++&&n.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!ib.test(k.type),d=k.url,k.hasContent||(k.data&&(d=k.url+=(db.test(d)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=fb.test(d)?d.replace(fb,"$1_="+cb++):d+(db.test(d)?"&":"?")+"_="+cb++)),k.ifModified&&(n.lastModified[d]&&v.setRequestHeader("If-Modified-Since",n.lastModified[d]),n.etag[d]&&v.setRequestHeader("If-None-Match",n.etag[d])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+nb+"; q=0.01":""):k.accepts["*"]);for(j in k.headers)v.setRequestHeader(j,k.headers[j]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(j in{success:1,error:1,complete:1})v[j](k[j]);if(c=rb(mb,k,b,v)){v.readyState=1,i&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,c.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,f,h){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),c=void 0,e=h||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,f&&(u=tb(k,v,f)),u=ub(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(n.lastModified[d]=w),w=v.getResponseHeader("etag"),w&&(n.etag[d]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,i&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),i&&(m.trigger("ajaxComplete",[v,k]),--n.active||n.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var vb=/%20/g,wb=/\[\]$/,xb=/\r?\n/g,yb=/^(?:submit|button|image|reset|file)$/i,zb=/^(?:input|select|textarea|keygen)/i;function Ab(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||wb.test(a)?d(a,e):Ab(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Ab(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Ab(c,a[c],b,e);return d.join("&").replace(vb,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&zb.test(this.nodeName)&&!yb.test(a)&&(this.checked||!T.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(xb,"\r\n")}}):{name:b.name,value:c.replace(xb,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var Bb=0,Cb={},Db={0:200,1223:204},Eb=n.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in Cb)Cb[a]()}),k.cors=!!Eb&&"withCredentials"in Eb,k.ajax=Eb=!!Eb,n.ajaxTransport(function(a){var b;return k.cors||Eb&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++Bb;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete Cb[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Db[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=Cb[g]=b("abort");try{f.send(a.hasContent&&a.data||null)}catch(h){if(b)throw h}},abort:function(){b&&b()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(d,e){b=n("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),l.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Fb=[],Gb=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Fb.pop()||n.expando+"_"+cb++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Gb.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Gb.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Gb,"$1"+e):b.jsonp!==!1&&(b.url+=(db.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Fb.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||l;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var Hb=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Hb)return Hb.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var Ib=a.document.documentElement;function Jb(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(typeof d.getBoundingClientRect!==U&&(e=d.getBoundingClientRect()),c=Jb(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||Ib;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Ib})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(b,c){var d="pageYOffset"===c;n.fn[b]=function(e){return J(this,function(b,e,f){var g=Jb(b);return void 0===f?g?g[c]:b[e]:void(g?g.scrollTo(d?a.pageXOffset:f,d?f:a.pageYOffset):b[e]=f)},b,e,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=ya(k.pixelPosition,function(a,c){return c?(c=xa(a,b),va.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return J(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Kb=a.jQuery,Lb=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Lb),b&&a.jQuery===n&&(a.jQuery=Kb),n},typeof b===U&&(a.jQuery=a.$=n),n});

﻿/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */
if(typeof jQuery=="undefined")throw new Error("Bootstrap's JavaScript requires jQuery");+function(n){"use strict";var t=n.fn.jquery.split(" ")[0].split(".");if(t[0]<2&&t[1]<9||t[0]==1&&t[1]==9&&t[2]<1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher");}(jQuery);+function(n){"use strict";function t(){var i=document.createElement("bootstrap"),n={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var t in n)if(i.style[t]!==undefined)return{end:n[t]};return!1}n.fn.emulateTransitionEnd=function(t){var i=!1,u=this,r;n(this).one("bsTransitionEnd",function(){i=!0});return r=function(){i||n(u).trigger(n.support.transition.end)},setTimeout(r,t),this};n(function(){(n.support.transition=t(),n.support.transition)&&(n.event.special.bsTransitionEnd={bindType:n.support.transition.end,delegateType:n.support.transition.end,handle:function(t){if(n(t.target).is(this))return t.handleObj.handler.apply(this,arguments)}})})}(jQuery);+function(n){"use strict";function u(i){return this.each(function(){var r=n(this),u=r.data("bs.alert");u||r.data("bs.alert",u=new t(this));typeof i=="string"&&u[i].call(r)})}var i='[data-dismiss="alert"]',t=function(t){n(t).on("click",i,this.close)},r;t.VERSION="3.3.5";t.TRANSITION_DURATION=150;t.prototype.close=function(i){function e(){r.detach().trigger("closed.bs.alert").remove()}var f=n(this),u=f.attr("data-target"),r;(u||(u=f.attr("href"),u=u&&u.replace(/.*(?=#[^\s]*$)/,"")),r=n(u),i&&i.preventDefault(),r.length||(r=f.closest(".alert")),r.trigger(i=n.Event("close.bs.alert")),i.isDefaultPrevented())||(r.removeClass("in"),n.support.transition&&r.hasClass("fade")?r.one("bsTransitionEnd",e).emulateTransitionEnd(t.TRANSITION_DURATION):e())};r=n.fn.alert;n.fn.alert=u;n.fn.alert.Constructor=t;n.fn.alert.noConflict=function(){return n.fn.alert=r,this};n(document).on("click.bs.alert.data-api",i,t.prototype.close)}(jQuery);+function(n){"use strict";function i(i){return this.each(function(){var u=n(this),r=u.data("bs.button"),f=typeof i=="object"&&i;r||u.data("bs.button",r=new t(this,f));i=="toggle"?r.toggle():i&&r.setState(i)})}var t=function(i,r){this.$element=n(i);this.options=n.extend({},t.DEFAULTS,r);this.isLoading=!1},r;t.VERSION="3.3.5";t.DEFAULTS={loadingText:"loading..."};t.prototype.setState=function(t){var r="disabled",i=this.$element,f=i.is("input")?"val":"html",u=i.data();t+="Text";u.resetText==null&&i.data("resetText",i[f]());setTimeout(n.proxy(function(){i[f](u[t]==null?this.options[t]:u[t]);t=="loadingText"?(this.isLoading=!0,i.addClass(r).attr(r,r)):this.isLoading&&(this.isLoading=!1,i.removeClass(r).removeAttr(r))},this),0)};t.prototype.toggle=function(){var t=!0,i=this.$element.closest('[data-toggle="buttons"]'),n;i.length?(n=this.$element.find("input"),n.prop("type")=="radio"?(n.prop("checked")&&(t=!1),i.find(".active").removeClass("active"),this.$element.addClass("active")):n.prop("type")=="checkbox"&&(n.prop("checked")!==this.$element.hasClass("active")&&(t=!1),this.$element.toggleClass("active")),n.prop("checked",this.$element.hasClass("active")),t&&n.trigger("change")):(this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active"))};r=n.fn.button;n.fn.button=i;n.fn.button.Constructor=t;n.fn.button.noConflict=function(){return n.fn.button=r,this};n(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(t){var r=n(t.target);r.hasClass("btn")||(r=r.closest(".btn"));i.call(r,"toggle");n(t.target).is('input[type="radio"]')||n(t.target).is('input[type="checkbox"]')||t.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(t){n(t.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(t.type))})}(jQuery);+function(n){"use strict";function i(i){return this.each(function(){var u=n(this),r=u.data("bs.carousel"),f=n.extend({},t.DEFAULTS,u.data(),typeof i=="object"&&i),e=typeof i=="string"?i:f.slide;r||u.data("bs.carousel",r=new t(this,f));typeof i=="number"?r.to(i):e?r[e]():f.interval&&r.pause().cycle()})}var t=function(t,i){this.$element=n(t);this.$indicators=this.$element.find(".carousel-indicators");this.options=i;this.paused=null;this.sliding=null;this.interval=null;this.$active=null;this.$items=null;this.options.keyboard&&this.$element.on("keydown.bs.carousel",n.proxy(this.keydown,this));this.options.pause!="hover"||"ontouchstart"in document.documentElement||this.$element.on("mouseenter.bs.carousel",n.proxy(this.pause,this)).on("mouseleave.bs.carousel",n.proxy(this.cycle,this))},u,r;t.VERSION="3.3.5";t.TRANSITION_DURATION=600;t.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0};t.prototype.keydown=function(n){if(!/input|textarea/i.test(n.target.tagName)){switch(n.which){case 37:this.prev();break;case 39:this.next();break;default:return}n.preventDefault()}};t.prototype.cycle=function(t){return t||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(n.proxy(this.next,this),this.options.interval)),this};t.prototype.getItemIndex=function(n){return this.$items=n.parent().children(".item"),this.$items.index(n||this.$active)};t.prototype.getItemForDirection=function(n,t){var i=this.getItemIndex(t),f=n=="prev"&&i===0||n=="next"&&i==this.$items.length-1,r,u;return f&&!this.options.wrap?t:(r=n=="prev"?-1:1,u=(i+r)%this.$items.length,this.$items.eq(u))};t.prototype.to=function(n){var i=this,t=this.getItemIndex(this.$active=this.$element.find(".item.active"));if(!(n>this.$items.length-1)&&!(n<0))return this.sliding?this.$element.one("slid.bs.carousel",function(){i.to(n)}):t==n?this.pause().cycle():this.slide(n>t?"next":"prev",this.$items.eq(n))};t.prototype.pause=function(t){return t||(this.paused=!0),this.$element.find(".next, .prev").length&&n.support.transition&&(this.$element.trigger(n.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this};t.prototype.next=function(){if(!this.sliding)return this.slide("next")};t.prototype.prev=function(){if(!this.sliding)return this.slide("prev")};t.prototype.slide=function(i,r){var e=this.$element.find(".item.active"),u=r||this.getItemForDirection(i,e),l=this.interval,f=i=="next"?"left":"right",a=this,o,s,h,c;return u.hasClass("active")?this.sliding=!1:(o=u[0],s=n.Event("slide.bs.carousel",{relatedTarget:o,direction:f}),this.$element.trigger(s),s.isDefaultPrevented())?void 0:(this.sliding=!0,l&&this.pause(),this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),h=n(this.$indicators.children()[this.getItemIndex(u)]),h&&h.addClass("active")),c=n.Event("slid.bs.carousel",{relatedTarget:o,direction:f}),n.support.transition&&this.$element.hasClass("slide")?(u.addClass(i),u[0].offsetWidth,e.addClass(f),u.addClass(f),e.one("bsTransitionEnd",function(){u.removeClass([i,f].join(" ")).addClass("active");e.removeClass(["active",f].join(" "));a.sliding=!1;setTimeout(function(){a.$element.trigger(c)},0)}).emulateTransitionEnd(t.TRANSITION_DURATION)):(e.removeClass("active"),u.addClass("active"),this.sliding=!1,this.$element.trigger(c)),l&&this.cycle(),this)};u=n.fn.carousel;n.fn.carousel=i;n.fn.carousel.Constructor=t;n.fn.carousel.noConflict=function(){return n.fn.carousel=u,this};r=function(t){var o,r=n(this),u=n(r.attr("data-target")||(o=r.attr("href"))&&o.replace(/.*(?=#[^\s]+$)/,"")),e,f;u.hasClass("carousel")&&(e=n.extend({},u.data(),r.data()),f=r.attr("data-slide-to"),f&&(e.interval=!1),i.call(u,e),f&&u.data("bs.carousel").to(f),t.preventDefault())};n(document).on("click.bs.carousel.data-api","[data-slide]",r).on("click.bs.carousel.data-api","[data-slide-to]",r);n(window).on("load",function(){n('[data-ride="carousel"]').each(function(){var t=n(this);i.call(t,t.data())})})}(jQuery);+function(n){"use strict";function r(t){var i,r=t.attr("data-target")||(i=t.attr("href"))&&i.replace(/.*(?=#[^\s]+$)/,"");return n(r)}function i(i){return this.each(function(){var u=n(this),r=u.data("bs.collapse"),f=n.extend({},t.DEFAULTS,u.data(),typeof i=="object"&&i);!r&&f.toggle&&/show|hide/.test(i)&&(f.toggle=!1);r||u.data("bs.collapse",r=new t(this,f));typeof i=="string"&&r[i]()})}var t=function(i,r){this.$element=n(i);this.options=n.extend({},t.DEFAULTS,r);this.$trigger=n('[data-toggle="collapse"][href="#'+i.id+'"],[data-toggle="collapse"][data-target="#'+i.id+'"]');this.transitioning=null;this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger);this.options.toggle&&this.toggle()},u;t.VERSION="3.3.5";t.TRANSITION_DURATION=350;t.DEFAULTS={toggle:!0};t.prototype.dimension=function(){var n=this.$element.hasClass("width");return n?"width":"height"};t.prototype.show=function(){var f,r,e,u,o,s;if(!this.transitioning&&!this.$element.hasClass("in")&&(r=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing"),!r||!r.length||(f=r.data("bs.collapse"),!f||!f.transitioning))&&(e=n.Event("show.bs.collapse"),this.$element.trigger(e),!e.isDefaultPrevented())){if(r&&r.length&&(i.call(r,"hide"),f||r.data("bs.collapse",null)),u=this.dimension(),this.$element.removeClass("collapse").addClass("collapsing")[u](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1,o=function(){this.$element.removeClass("collapsing").addClass("collapse in")[u]("");this.transitioning=0;this.$element.trigger("shown.bs.collapse")},!n.support.transition)return o.call(this);s=n.camelCase(["scroll",u].join("-"));this.$element.one("bsTransitionEnd",n.proxy(o,this)).emulateTransitionEnd(t.TRANSITION_DURATION)[u](this.$element[0][s])}};t.prototype.hide=function(){var r,i,u;if(!this.transitioning&&this.$element.hasClass("in")&&(r=n.Event("hide.bs.collapse"),this.$element.trigger(r),!r.isDefaultPrevented())){if(i=this.dimension(),this.$element[i](this.$element[i]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1,u=function(){this.transitioning=0;this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")},!n.support.transition)return u.call(this);this.$element[i](0).one("bsTransitionEnd",n.proxy(u,this)).emulateTransitionEnd(t.TRANSITION_DURATION)}};t.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};t.prototype.getParent=function(){return n(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(n.proxy(function(t,i){var u=n(i);this.addAriaAndCollapsedClass(r(u),u)},this)).end()};t.prototype.addAriaAndCollapsedClass=function(n,t){var i=n.hasClass("in");n.attr("aria-expanded",i);t.toggleClass("collapsed",!i).attr("aria-expanded",i)};u=n.fn.collapse;n.fn.collapse=i;n.fn.collapse.Constructor=t;n.fn.collapse.noConflict=function(){return n.fn.collapse=u,this};n(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(t){var u=n(this);u.attr("data-target")||t.preventDefault();var f=r(u),e=f.data("bs.collapse"),o=e?"toggle":u.data();i.call(f,o)})}(jQuery);+function(n){"use strict";function r(t){var i=t.attr("data-target"),r;return i||(i=t.attr("href"),i=i&&/#[A-Za-z]/.test(i)&&i.replace(/.*(?=#[^\s]*$)/,"")),r=i&&n(i),r&&r.length?r:t.parent()}function u(t){t&&t.which===3||(n(e).remove(),n(i).each(function(){var u=n(this),i=r(u),f={relatedTarget:this};i.hasClass("open")&&(t&&t.type=="click"&&/input|textarea/i.test(t.target.tagName)&&n.contains(i[0],t.target)||(i.trigger(t=n.Event("hide.bs.dropdown",f)),t.isDefaultPrevented())||(u.attr("aria-expanded","false"),i.removeClass("open").trigger("hidden.bs.dropdown",f)))}))}function o(i){return this.each(function(){var r=n(this),u=r.data("bs.dropdown");u||r.data("bs.dropdown",u=new t(this));typeof i=="string"&&u[i].call(r)})}var e=".dropdown-backdrop",i='[data-toggle="dropdown"]',t=function(t){n(t).on("click.bs.dropdown",this.toggle)},f;t.VERSION="3.3.5";t.prototype.toggle=function(t){var f=n(this),i,o,e;if(!f.is(".disabled, :disabled")){if(i=r(f),o=i.hasClass("open"),u(),!o){if("ontouchstart"in document.documentElement&&!i.closest(".navbar-nav").length)n(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(n(this)).on("click",u);if(e={relatedTarget:this},i.trigger(t=n.Event("show.bs.dropdown",e)),t.isDefaultPrevented())return;f.trigger("focus").attr("aria-expanded","true");i.toggleClass("open").trigger("shown.bs.dropdown",e)}return!1}};t.prototype.keydown=function(t){var e,o,s,h,f,u;if(/(38|40|27|32)/.test(t.which)&&!/input|textarea/i.test(t.target.tagName)&&(e=n(this),t.preventDefault(),t.stopPropagation(),!e.is(".disabled, :disabled"))){if(o=r(e),s=o.hasClass("open"),!s&&t.which!=27||s&&t.which==27)return t.which==27&&o.find(i).trigger("focus"),e.trigger("click");(h=" li:not(.disabled):visible a",f=o.find(".dropdown-menu"+h),f.length)&&(u=f.index(t.target),t.which==38&&u>0&&u--,t.which==40&&u<f.length-1&&u++,~u||(u=0),f.eq(u).trigger("focus"))}};f=n.fn.dropdown;n.fn.dropdown=o;n.fn.dropdown.Constructor=t;n.fn.dropdown.noConflict=function(){return n.fn.dropdown=f,this};n(document).on("click.bs.dropdown.data-api",u).on("click.bs.dropdown.data-api",".dropdown form",function(n){n.stopPropagation()}).on("click.bs.dropdown.data-api",i,t.prototype.toggle).on("keydown.bs.dropdown.data-api",i,t.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",t.prototype.keydown)}(jQuery);+function(n){"use strict";function i(i,r){return this.each(function(){var f=n(this),u=f.data("bs.modal"),e=n.extend({},t.DEFAULTS,f.data(),typeof i=="object"&&i);u||f.data("bs.modal",u=new t(this,e));typeof i=="string"?u[i](r):e.show&&u.show(r)})}var t=function(t,i){this.options=i;this.$body=n(document.body);this.$element=n(t);this.$dialog=this.$element.find(".modal-dialog");this.$backdrop=null;this.isShown=null;this.originalBodyPad=null;this.scrollbarWidth=0;this.ignoreBackdropClick=!1;this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,n.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))},r;t.VERSION="3.3.5";t.TRANSITION_DURATION=300;t.BACKDROP_TRANSITION_DURATION=150;t.DEFAULTS={backdrop:!0,keyboard:!0,show:!0};t.prototype.toggle=function(n){return this.isShown?this.hide():this.show(n)};t.prototype.show=function(i){var r=this,u=n.Event("show.bs.modal",{relatedTarget:i});if(this.$element.trigger(u),!this.isShown&&!u.isDefaultPrevented()){this.isShown=!0;this.checkScrollbar();this.setScrollbar();this.$body.addClass("modal-open");this.escape();this.resize();this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',n.proxy(this.hide,this));this.$dialog.on("mousedown.dismiss.bs.modal",function(){r.$element.one("mouseup.dismiss.bs.modal",function(t){n(t.target).is(r.$element)&&(r.ignoreBackdropClick=!0)})});this.backdrop(function(){var f=n.support.transition&&r.$element.hasClass("fade"),u;r.$element.parent().length||r.$element.appendTo(r.$body);r.$element.show().scrollTop(0);r.adjustDialog();f&&r.$element[0].offsetWidth;r.$element.addClass("in");r.enforceFocus();u=n.Event("shown.bs.modal",{relatedTarget:i});f?r.$dialog.one("bsTransitionEnd",function(){r.$element.trigger("focus").trigger(u)}).emulateTransitionEnd(t.TRANSITION_DURATION):r.$element.trigger("focus").trigger(u)})}};t.prototype.hide=function(i){(i&&i.preventDefault(),i=n.Event("hide.bs.modal"),this.$element.trigger(i),this.isShown&&!i.isDefaultPrevented())&&(this.isShown=!1,this.escape(),this.resize(),n(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),n.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",n.proxy(this.hideModal,this)).emulateTransitionEnd(t.TRANSITION_DURATION):this.hideModal())};t.prototype.enforceFocus=function(){n(document).off("focusin.bs.modal").on("focusin.bs.modal",n.proxy(function(n){this.$element[0]===n.target||this.$element.has(n.target).length||this.$element.trigger("focus")},this))};t.prototype.escape=function(){if(this.isShown&&this.options.keyboard)this.$element.on("keydown.dismiss.bs.modal",n.proxy(function(n){n.which==27&&this.hide()},this));else this.isShown||this.$element.off("keydown.dismiss.bs.modal")};t.prototype.resize=function(){if(this.isShown)n(window).on("resize.bs.modal",n.proxy(this.handleUpdate,this));else n(window).off("resize.bs.modal")};t.prototype.hideModal=function(){var n=this;this.$element.hide();this.backdrop(function(){n.$body.removeClass("modal-open");n.resetAdjustments();n.resetScrollbar();n.$element.trigger("hidden.bs.modal")})};t.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove();this.$backdrop=null};t.prototype.backdrop=function(i){var e=this,f=this.$element.hasClass("fade")?"fade":"",r,u;if(this.isShown&&this.options.backdrop){r=n.support.transition&&f;this.$backdrop=n(document.createElement("div")).addClass("modal-backdrop "+f).prependTo(this.$element);this.$backdrop.on("click.dismiss.bs.modal",n.proxy(function(n){if(this.ignoreBackdropClick){this.ignoreBackdropClick=!1;return}n.target===n.currentTarget&&(this.options.backdrop=="static"?this.$element[0].focus():this.hide())},this));if(r&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!i)return;r?this.$backdrop.one("bsTransitionEnd",i).emulateTransitionEnd(t.BACKDROP_TRANSITION_DURATION):i()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),u=function(){e.removeBackdrop();i&&i()},n.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",u).emulateTransitionEnd(t.BACKDROP_TRANSITION_DURATION):u()):i&&i()};t.prototype.handleUpdate=function(){this.adjustDialog()};t.prototype.adjustDialog=function(){var n=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&n?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!n?this.scrollbarWidth:""})};t.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})};t.prototype.checkScrollbar=function(){var n=window.innerWidth,t;n||(t=document.documentElement.getBoundingClientRect(),n=t.right-Math.abs(t.left));this.bodyIsOverflowing=document.body.clientWidth<n;this.scrollbarWidth=this.measureScrollbar()};t.prototype.setScrollbar=function(){var n=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"";this.bodyIsOverflowing&&this.$body.css("padding-right",n+this.scrollbarWidth)};t.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)};t.prototype.measureScrollbar=function(){var n=document.createElement("div"),t;return n.className="modal-scrollbar-measure",this.$body.append(n),t=n.offsetWidth-n.clientWidth,this.$body[0].removeChild(n),t};r=n.fn.modal;n.fn.modal=i;n.fn.modal.Constructor=t;n.fn.modal.noConflict=function(){return n.fn.modal=r,this};n(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(t){var r=n(this),f=r.attr("href"),u=n(r.attr("data-target")||f&&f.replace(/.*(?=#[^\s]+$)/,"")),e=u.data("bs.modal")?"toggle":n.extend({remote:!/#/.test(f)&&f},u.data(),r.data());r.is("a")&&t.preventDefault();u.one("show.bs.modal",function(n){if(!n.isDefaultPrevented())u.one("hidden.bs.modal",function(){r.is(":visible")&&r.trigger("focus")})});i.call(u,e,this)})}(jQuery);+function(n){"use strict";function r(i){return this.each(function(){var u=n(this),r=u.data("bs.tooltip"),f=typeof i=="object"&&i;(r||!/destroy|hide/.test(i))&&(r||u.data("bs.tooltip",r=new t(this,f)),typeof i=="string"&&r[i]())})}var t=function(n,t){this.type=null;this.options=null;this.enabled=null;this.timeout=null;this.hoverState=null;this.$element=null;this.inState=null;this.init("tooltip",n,t)},i;t.VERSION="3.3.5";t.TRANSITION_DURATION=150;t.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"><\/div><div class="tooltip-inner"><\/div><\/div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}};t.prototype.init=function(t,i,r){var f,e,u,o,s;if(this.enabled=!0,this.type=t,this.$element=n(i),this.options=this.getOptions(r),this.$viewport=this.options.viewport&&n(n.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(f=this.options.trigger.split(" "),e=f.length;e--;)if(u=f[e],u=="click")this.$element.on("click."+this.type,this.options.selector,n.proxy(this.toggle,this));else if(u!="manual"){o=u=="hover"?"mouseenter":"focusin";s=u=="hover"?"mouseleave":"focusout";this.$element.on(o+"."+this.type,this.options.selector,n.proxy(this.enter,this));this.$element.on(s+"."+this.type,this.options.selector,n.proxy(this.leave,this))}this.options.selector?this._options=n.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()};t.prototype.getDefaults=function(){return t.DEFAULTS};t.prototype.getOptions=function(t){return t=n.extend({},this.getDefaults(),this.$element.data(),t),t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay}),t};t.prototype.getDelegateOptions=function(){var t={},i=this.getDefaults();return this._options&&n.each(this._options,function(n,r){i[n]!=r&&(t[n]=r)}),t};t.prototype.enter=function(t){var i=t instanceof this.constructor?t:n(t.currentTarget).data("bs."+this.type);if(i||(i=new this.constructor(t.currentTarget,this.getDelegateOptions()),n(t.currentTarget).data("bs."+this.type,i)),t instanceof n.Event&&(i.inState[t.type=="focusin"?"focus":"hover"]=!0),i.tip().hasClass("in")||i.hoverState=="in"){i.hoverState="in";return}if(clearTimeout(i.timeout),i.hoverState="in",!i.options.delay||!i.options.delay.show)return i.show();i.timeout=setTimeout(function(){i.hoverState=="in"&&i.show()},i.options.delay.show)};t.prototype.isInStateTrue=function(){for(var n in this.inState)if(this.inState[n])return!0;return!1};t.prototype.leave=function(t){var i=t instanceof this.constructor?t:n(t.currentTarget).data("bs."+this.type);if(i||(i=new this.constructor(t.currentTarget,this.getDelegateOptions()),n(t.currentTarget).data("bs."+this.type,i)),t instanceof n.Event&&(i.inState[t.type=="focusout"?"focus":"hover"]=!1),!i.isInStateTrue()){if(clearTimeout(i.timeout),i.hoverState="out",!i.options.delay||!i.options.delay.hide)return i.hide();i.timeout=setTimeout(function(){i.hoverState=="out"&&i.hide()},i.options.delay.hide)}};t.prototype.show=function(){var c=n.Event("show.bs."+this.type),l,p,e,w,h;if(this.hasContent()&&this.enabled){if(this.$element.trigger(c),l=n.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]),c.isDefaultPrevented()||!l)return;var u=this,r=this.tip(),a=this.getUID(this.type);this.setContent();r.attr("id",a);this.$element.attr("aria-describedby",a);this.options.animation&&r.addClass("fade");var i=typeof this.options.placement=="function"?this.options.placement.call(this,r[0],this.$element[0]):this.options.placement,v=/\s?auto?\s?/i,y=v.test(i);y&&(i=i.replace(v,"")||"top");r.detach().css({top:0,left:0,display:"block"}).addClass(i).data("bs."+this.type,this);this.options.container?r.appendTo(this.options.container):r.insertAfter(this.$element);this.$element.trigger("inserted.bs."+this.type);var f=this.getPosition(),o=r[0].offsetWidth,s=r[0].offsetHeight;y&&(p=i,e=this.getPosition(this.$viewport),i=i=="bottom"&&f.bottom+s>e.bottom?"top":i=="top"&&f.top-s<e.top?"bottom":i=="right"&&f.right+o>e.width?"left":i=="left"&&f.left-o<e.left?"right":i,r.removeClass(p).addClass(i));w=this.getCalculatedOffset(i,f,o,s);this.applyPlacement(w,i);h=function(){var n=u.hoverState;u.$element.trigger("shown.bs."+u.type);u.hoverState=null;n=="out"&&u.leave(u)};n.support.transition&&this.$tip.hasClass("fade")?r.one("bsTransitionEnd",h).emulateTransitionEnd(t.TRANSITION_DURATION):h()}};t.prototype.applyPlacement=function(t,i){var r=this.tip(),l=r[0].offsetWidth,e=r[0].offsetHeight,o=parseInt(r.css("margin-top"),10),s=parseInt(r.css("margin-left"),10),h,f,u;isNaN(o)&&(o=0);isNaN(s)&&(s=0);t.top+=o;t.left+=s;n.offset.setOffset(r[0],n.extend({using:function(n){r.css({top:Math.round(n.top),left:Math.round(n.left)})}},t),0);r.addClass("in");h=r[0].offsetWidth;f=r[0].offsetHeight;i=="top"&&f!=e&&(t.top=t.top+e-f);u=this.getViewportAdjustedDelta(i,t,h,f);u.left?t.left+=u.left:t.top+=u.top;var c=/top|bottom/.test(i),a=c?u.left*2-l+h:u.top*2-e+f,v=c?"offsetWidth":"offsetHeight";r.offset(t);this.replaceArrow(a,r[0][v],c)};t.prototype.replaceArrow=function(n,t,i){this.arrow().css(i?"left":"top",50*(1-n/t)+"%").css(i?"top":"left","")};t.prototype.setContent=function(){var n=this.tip(),t=this.getTitle();n.find(".tooltip-inner")[this.options.html?"html":"text"](t);n.removeClass("fade in top bottom left right")};t.prototype.hide=function(i){function e(){u.hoverState!="in"&&r.detach();u.$element.removeAttr("aria-describedby").trigger("hidden.bs."+u.type);i&&i()}var u=this,r=n(this.$tip),f=n.Event("hide.bs."+this.type);if(this.$element.trigger(f),!f.isDefaultPrevented())return r.removeClass("in"),n.support.transition&&r.hasClass("fade")?r.one("bsTransitionEnd",e).emulateTransitionEnd(t.TRANSITION_DURATION):e(),this.hoverState=null,this};t.prototype.fixTitle=function(){var n=this.$element;(n.attr("title")||typeof n.attr("data-original-title")!="string")&&n.attr("data-original-title",n.attr("title")||"").attr("title","")};t.prototype.hasContent=function(){return this.getTitle()};t.prototype.getPosition=function(t){t=t||this.$element;var u=t[0],r=u.tagName=="BODY",i=u.getBoundingClientRect();i.width==null&&(i=n.extend({},i,{width:i.right-i.left,height:i.bottom-i.top}));var f=r?{top:0,left:0}:t.offset(),e={scroll:r?document.documentElement.scrollTop||document.body.scrollTop:t.scrollTop()},o=r?{width:n(window).width(),height:n(window).height()}:null;return n.extend({},i,e,o,f)};t.prototype.getCalculatedOffset=function(n,t,i,r){return n=="bottom"?{top:t.top+t.height,left:t.left+t.width/2-i/2}:n=="top"?{top:t.top-r,left:t.left+t.width/2-i/2}:n=="left"?{top:t.top+t.height/2-r/2,left:t.left-i}:{top:t.top+t.height/2-r/2,left:t.left+t.width}};t.prototype.getViewportAdjustedDelta=function(n,t,i,r){var f={top:0,left:0},e,u,o,s,h,c;return this.$viewport?(e=this.options.viewport&&this.options.viewport.padding||0,u=this.getPosition(this.$viewport),/right|left/.test(n)?(o=t.top-e-u.scroll,s=t.top+e-u.scroll+r,o<u.top?f.top=u.top-o:s>u.top+u.height&&(f.top=u.top+u.height-s)):(h=t.left-e,c=t.left+e+i,h<u.left?f.left=u.left-h:c>u.right&&(f.left=u.left+u.width-c)),f):f};t.prototype.getTitle=function(){var t=this.$element,n=this.options;return t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title)};t.prototype.getUID=function(n){do n+=~~(Math.random()*1e6);while(document.getElementById(n));return n};t.prototype.tip=function(){if(!this.$tip&&(this.$tip=n(this.options.template),this.$tip.length!=1))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip};t.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")};t.prototype.enable=function(){this.enabled=!0};t.prototype.disable=function(){this.enabled=!1};t.prototype.toggleEnabled=function(){this.enabled=!this.enabled};t.prototype.toggle=function(t){var i=this;t&&(i=n(t.currentTarget).data("bs."+this.type),i||(i=new this.constructor(t.currentTarget,this.getDelegateOptions()),n(t.currentTarget).data("bs."+this.type,i)));t?(i.inState.click=!i.inState.click,i.isInStateTrue()?i.enter(i):i.leave(i)):i.tip().hasClass("in")?i.leave(i):i.enter(i)};t.prototype.destroy=function(){var n=this;clearTimeout(this.timeout);this.hide(function(){n.$element.off("."+n.type).removeData("bs."+n.type);n.$tip&&n.$tip.detach();n.$tip=null;n.$arrow=null;n.$viewport=null})};i=n.fn.tooltip;n.fn.tooltip=r;n.fn.tooltip.Constructor=t;n.fn.tooltip.noConflict=function(){return n.fn.tooltip=i,this}}(jQuery);+function(n){"use strict";function r(i){return this.each(function(){var u=n(this),r=u.data("bs.popover"),f=typeof i=="object"&&i;(r||!/destroy|hide/.test(i))&&(r||u.data("bs.popover",r=new t(this,f)),typeof i=="string"&&r[i]())})}var t=function(n,t){this.init("popover",n,t)},i;if(!n.fn.tooltip)throw new Error("Popover requires tooltip.js");t.VERSION="3.3.5";t.DEFAULTS=n.extend({},n.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"><\/div><h3 class="popover-title"><\/h3><div class="popover-content"><\/div><\/div>'});t.prototype=n.extend({},n.fn.tooltip.Constructor.prototype);t.prototype.constructor=t;t.prototype.getDefaults=function(){return t.DEFAULTS};t.prototype.setContent=function(){var n=this.tip(),i=this.getTitle(),t=this.getContent();n.find(".popover-title")[this.options.html?"html":"text"](i);n.find(".popover-content").children().detach().end()[this.options.html?typeof t=="string"?"html":"append":"text"](t);n.removeClass("fade top bottom left right in");n.find(".popover-title").html()||n.find(".popover-title").hide()};t.prototype.hasContent=function(){return this.getTitle()||this.getContent()};t.prototype.getContent=function(){var t=this.$element,n=this.options;return t.attr("data-content")||(typeof n.content=="function"?n.content.call(t[0]):n.content)};t.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};i=n.fn.popover;n.fn.popover=r;n.fn.popover.Constructor=t;n.fn.popover.noConflict=function(){return n.fn.popover=i,this}}(jQuery);+function(n){"use strict";function t(i,r){this.$body=n(document.body);this.$scrollElement=n(i).is(document.body)?n(window):n(i);this.options=n.extend({},t.DEFAULTS,r);this.selector=(this.options.target||"")+" .nav li > a";this.offsets=[];this.targets=[];this.activeTarget=null;this.scrollHeight=0;this.$scrollElement.on("scroll.bs.scrollspy",n.proxy(this.process,this));this.refresh();this.process()}function i(i){return this.each(function(){var u=n(this),r=u.data("bs.scrollspy"),f=typeof i=="object"&&i;r||u.data("bs.scrollspy",r=new t(this,f));typeof i=="string"&&r[i]()})}t.VERSION="3.3.5";t.DEFAULTS={offset:10};t.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)};t.prototype.refresh=function(){var t=this,i="offset",r=0;this.offsets=[];this.targets=[];this.scrollHeight=this.getScrollHeight();n.isWindow(this.$scrollElement[0])||(i="position",r=this.$scrollElement.scrollTop());this.$body.find(this.selector).map(function(){var f=n(this),u=f.data("target")||f.attr("href"),t=/^#./.test(u)&&n(u);return t&&t.length&&t.is(":visible")&&[[t[i]().top+r,u]]||null}).sort(function(n,t){return n[0]-t[0]}).each(function(){t.offsets.push(this[0]);t.targets.push(this[1])})};t.prototype.process=function(){var i=this.$scrollElement.scrollTop()+this.options.offset,f=this.getScrollHeight(),e=this.options.offset+f-this.$scrollElement.height(),t=this.offsets,r=this.targets,u=this.activeTarget,n;if(this.scrollHeight!=f&&this.refresh(),i>=e)return u!=(n=r[r.length-1])&&this.activate(n);if(u&&i<t[0])return this.activeTarget=null,this.clear();for(n=t.length;n--;)u!=r[n]&&i>=t[n]&&(t[n+1]===undefined||i<t[n+1])&&this.activate(r[n])};t.prototype.activate=function(t){this.activeTarget=t;this.clear();var r=this.selector+'[data-target="'+t+'"],'+this.selector+'[href="'+t+'"]',i=n(r).parents("li").addClass("active");i.parent(".dropdown-menu").length&&(i=i.closest("li.dropdown").addClass("active"));i.trigger("activate.bs.scrollspy")};t.prototype.clear=function(){n(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var r=n.fn.scrollspy;n.fn.scrollspy=i;n.fn.scrollspy.Constructor=t;n.fn.scrollspy.noConflict=function(){return n.fn.scrollspy=r,this};n(window).on("load.bs.scrollspy.data-api",function(){n('[data-spy="scroll"]').each(function(){var t=n(this);i.call(t,t.data())})})}(jQuery);+function(n){"use strict";function r(i){return this.each(function(){var u=n(this),r=u.data("bs.tab");r||u.data("bs.tab",r=new t(this));typeof i=="string"&&r[i]()})}var t=function(t){this.element=n(t)},u,i;t.VERSION="3.3.5";t.TRANSITION_DURATION=150;t.prototype.show=function(){var t=this.element,f=t.closest("ul:not(.dropdown-menu)"),i=t.data("target"),u;if(i||(i=t.attr("href"),i=i&&i.replace(/.*(?=#[^\s]*$)/,"")),!t.parent("li").hasClass("active")){var r=f.find(".active:last a"),e=n.Event("hide.bs.tab",{relatedTarget:t[0]}),o=n.Event("show.bs.tab",{relatedTarget:r[0]});(r.trigger(e),t.trigger(o),o.isDefaultPrevented()||e.isDefaultPrevented())||(u=n(i),this.activate(t.closest("li"),f),this.activate(u,u.parent(),function(){r.trigger({type:"hidden.bs.tab",relatedTarget:t[0]});t.trigger({type:"shown.bs.tab",relatedTarget:r[0]})}))}};t.prototype.activate=function(i,r,u){function o(){f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1);i.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0);e?(i[0].offsetWidth,i.addClass("in")):i.removeClass("fade");i.parent(".dropdown-menu").length&&i.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0);u&&u()}var f=r.find("> .active"),e=u&&n.support.transition&&(f.length&&f.hasClass("fade")||!!r.find("> .fade").length);f.length&&e?f.one("bsTransitionEnd",o).emulateTransitionEnd(t.TRANSITION_DURATION):o();f.removeClass("in")};u=n.fn.tab;n.fn.tab=r;n.fn.tab.Constructor=t;n.fn.tab.noConflict=function(){return n.fn.tab=u,this};i=function(t){t.preventDefault();r.call(n(this),"show")};n(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',i).on("click.bs.tab.data-api",'[data-toggle="pill"]',i)}(jQuery);+function(n){"use strict";function i(i){return this.each(function(){var u=n(this),r=u.data("bs.affix"),f=typeof i=="object"&&i;r||u.data("bs.affix",r=new t(this,f));typeof i=="string"&&r[i]()})}var t=function(i,r){this.options=n.extend({},t.DEFAULTS,r);this.$target=n(this.options.target).on("scroll.bs.affix.data-api",n.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",n.proxy(this.checkPositionWithEventLoop,this));this.$element=n(i);this.affixed=null;this.unpin=null;this.pinnedOffset=null;this.checkPosition()},r;t.VERSION="3.3.5";t.RESET="affix affix-top affix-bottom";t.DEFAULTS={offset:0,target:window};t.prototype.getState=function(n,t,i,r){var u=this.$target.scrollTop(),f=this.$element.offset(),e=this.$target.height();if(i!=null&&this.affixed=="top")return u<i?"top":!1;if(this.affixed=="bottom")return i!=null?u+this.unpin<=f.top?!1:"bottom":u+e<=n-r?!1:"bottom";var o=this.affixed==null,s=o?u:f.top,h=o?e:t;return i!=null&&u<=i?"top":r!=null&&s+h>=n-r?"bottom":!1};t.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(t.RESET).addClass("affix");var n=this.$target.scrollTop(),i=this.$element.offset();return this.pinnedOffset=i.top-n};t.prototype.checkPositionWithEventLoop=function(){setTimeout(n.proxy(this.checkPosition,this),1)};t.prototype.checkPosition=function(){var i,e,o;if(this.$element.is(":visible")){var s=this.$element.height(),r=this.options.offset,f=r.top,u=r.bottom,h=Math.max(n(document).height(),n(document.body).height());if(typeof r!="object"&&(u=f=r),typeof f=="function"&&(f=r.top(this.$element)),typeof u=="function"&&(u=r.bottom(this.$element)),i=this.getState(h,s,f,u),this.affixed!=i){if(this.unpin!=null&&this.$element.css("top",""),e="affix"+(i?"-"+i:""),o=n.Event(e+".bs.affix"),this.$element.trigger(o),o.isDefaultPrevented())return;this.affixed=i;this.unpin=i=="bottom"?this.getPinnedOffset():null;this.$element.removeClass(t.RESET).addClass(e).trigger(e.replace("affix","affixed")+".bs.affix")}i=="bottom"&&this.$element.offset({top:h-s-u})}};r=n.fn.affix;n.fn.affix=i;n.fn.affix.Constructor=t;n.fn.affix.noConflict=function(){return n.fn.affix=r,this};n(window).on("load",function(){n('[data-spy="affix"]').each(function(){var r=n(this),t=r.data();t.offset=t.offset||{};t.offsetBottom!=null&&(t.offset.bottom=t.offsetBottom);t.offsetTop!=null&&(t.offset.top=t.offsetTop);i.call(r,t)})})}(jQuery);
/*
//# sourceMappingURL=bootstrap.min.js.map
*/
/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 */
(function (root, factory) {

    /* CommonJS */
    if (typeof exports == 'object') module.exports = factory()

        /* AMD module */
    else if (typeof define == 'function' && define.amd) define(factory)

        /* Browser global */
    else root.LoadingSpinner = factory()
}
(this, function () {
    "use strict";

    var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
      , animations = {} /* Animation rules keyed by their name */
      , useCssAnimations; /* Whether to use CSS animations or setTimeout */

    /**
     * Utility function to create elements. If no tag name is given,
     * a DIV is created. Optionally properties can be passed.
     */
    function createEl(tag, prop) {
        var el = document.createElement(tag || 'div')
          , n;

        for (n in prop) el[n] = prop[n]
        return el
    }

    /**
     * Appends children and returns the parent.
     */
    function ins(parent /* child1, child2, ...*/) {
        for (var i = 1, n = arguments.length; i < n; i++)
            parent.appendChild(arguments[i])

        return parent
    }

    /**
     * Insert a new stylesheet to hold the @keyframe or VML rules.
     */
    var sheet = (function () {
        var el = createEl('style', { type: 'text/css' })
        ins(document.getElementsByTagName('head')[0], el)
        return el.sheet || el.styleSheet
    }())

    /**
     * Creates an opacity keyframe animation rule and returns its name.
     * Since most mobile Webkits have timing issues with animation-delay,
     * we create separate rules for each line/segment.
     */
    function addAnimation(alpha, trail, i, lines) {
        var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-')
          , start = 0.01 + i / lines * 100
          , z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha)
          , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
          , pre = prefix && '-' + prefix + '-' || ''

        if (!animations[name]) {
            sheet.insertRule(
              '@' + pre + 'keyframes ' + name + '{' +
              '0%{opacity:' + z + '}' +
              start + '%{opacity:' + alpha + '}' +
              (start + 0.01) + '%{opacity:1}' +
              (start + trail) % 100 + '%{opacity:' + alpha + '}' +
              '100%{opacity:' + z + '}' +
              '}', sheet.cssRules.length)

            animations[name] = 1
        }

        return name
    }

    /**
     * Tries various vendor prefixes and returns the first supported property.
     */
    function vendor(el, prop) {
        var s = el.style
          , pp
          , i

        prop = prop.charAt(0).toUpperCase() + prop.slice(1)
        for (i = 0; i < prefixes.length; i++) {
            pp = prefixes[i] + prop
            if (s[pp] !== undefined) return pp
        }
        if (s[prop] !== undefined) return prop
    }

    /**
     * Sets multiple style properties at once.
     */
    function css(el, prop) {
        for (var n in prop)
            el.style[vendor(el, n) || n] = prop[n]

        return el
    }

    /**
     * Fills in default values.
     */
    function merge(obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i]
            for (var n in def)
                if (obj[n] === undefined) obj[n] = def[n]
        }
        return obj
    }

    /**
     * Returns the absolute page-offset of the given element.
     */
    function pos(el) {
        var o = { x: el.offsetLeft, y: el.offsetTop }
        while ((el = el.offsetParent))
            o.x += el.offsetLeft, o.y += el.offsetTop

        return o
    }

    /**
     * Returns the line color from the given string or array.
     */
    function getColor(color, idx) {
        return typeof color == 'string' ? color : color[idx % color.length]
    }

    // Built-in defaults

    var defaults = {
        lines: 12,            // The number of lines to draw
        length: 10,            // The length of each line
        width: 5,             // The line thickness
        radius: 15,           // The radius of the inner circle
        rotate: 0,            // Rotation offset
        corners: 1,           // Roundness (0..1)
        color: '#000',        // #rgb or #rrggbb
        direction: 1,         // 1: clockwise, -1: counterclockwise
        speed: 1,             // Rounds per second
        trail: 100,           // Afterglow percentage
        opacity: 1 / 4,         // Opacity of the lines
        fps: 20,              // Frames per second when using setTimeout()
        zIndex: 1001,          // Use a high z-index by default
        className: 'spinner', // CSS class to assign to the element
        top: '50%',           // center vertically
        left: '50%',          // center horizontally
        position: 'absolute'  // element position
    }

    /** The constructor */
    function LoadingSpinner(o) {
        this.opts = merge(o || {}, LoadingSpinner.defaults, defaults)
    }

    // Global defaults that override the built-ins:
    LoadingSpinner.defaults = {}

    merge(LoadingSpinner.prototype, {

        /**
         * Adds the spinner to the given target element. If this instance is already
         * spinning, it is automatically removed from its previous target b calling
         * stop() internally.
         */
        spin: function (target) {
            this.stop()
            
            this.opts.target = target;
            var divMask = document.createElement("div");
            divMask.className = "spinnerMask";
            divMask.style.width = target.width;
            divMask.style.height = target.height;
            target.appendChild(divMask);
            this.divMask = divMask;

            var self = this
              , o = self.opts
              , el = self.el = css(createEl(0, { className: o.className }), { position: o.position, width: 0, zIndex: o.zIndex })
              , mid = o.radius + o.length + o.width

            css(el, {
                left: o.left,
                top: o.top
            })

            if (target) {
                target.insertBefore(el, target.firstChild || null)
            }

            el.setAttribute('role', 'progressbar')
            self.lines(el, self.opts)

            if (!useCssAnimations) {
                // No CSS animation support, use setTimeout() instead
                var i = 0
                  , start = (o.lines - 1) * (1 - o.direction) / 2
                  , alpha
                  , fps = o.fps
                  , f = fps / o.speed
                  , ostep = (1 - o.opacity) / (f * o.trail / 100)
                  , astep = f / o.lines

                ; (function anim() {
                    i++;
                    for (var j = 0; j < o.lines; j++) {
                        alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

                        self.opacity(el, j * o.direction + start, alpha, o)
                    }
                    self.timeout = self.el && setTimeout(anim, ~~(1000 / fps))
                })()
            }
            return self
        },

        /**
         * Stops and removes the LoadingSpinner.
         */
        stop: function () {
            var el = this.el
            if (el) {
                clearTimeout(this.timeout)
                if (el.parentNode) el.parentNode.removeChild(el)
                this.el = undefined
                if (this.divMask) {
                    if (this.divMask.parentNode) this.divMask.parentNode.removeChild(this.divMask)
                    this.el = undefined
                }
            }
            return this
        },

        /**
         * Internal method that draws the individual lines. Will be overwritten
         * in VML fallback mode below.
         */
        lines: function (el, o) {
            var i = 0
              , start = (o.lines - 1) * (1 - o.direction) / 2
              , seg

            function fill(color, shadow) {
                return css(createEl(), {
                    position: 'absolute',
                    width: (o.length + o.width) + 'px',
                    height: o.width + 'px',
                    background: color,
                    boxShadow: shadow,
                    transformOrigin: 'left',
                    transform: 'rotate(' + ~~(360 / o.lines * i + o.rotate) + 'deg) translate(' + o.radius + 'px' + ',0)',
                    borderRadius: (o.corners * o.width >> 1) + 'px'
                })
            }

            for (; i < o.lines; i++) {
                seg = css(createEl(), {
                    position: 'absolute',
                    top: 1 + ~(o.width / 2) + 'px',
                    transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
                    opacity: o.opacity,
                    animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1 / o.speed + 's linear infinite'
                })

                if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), { top: 2 + 'px' }))
                ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
            }
            return el
        },

        /**
         * Internal method that adjusts the opacity of a single line.
         * Will be overwritten in VML fallback mode below.
         */
        opacity: function (el, i, val) {
            if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
        }

    })


    function initVML() {

        /* Utility function to create a VML tag */
        function vml(tag, attr) {
            return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
        }

        // No CSS transforms but VML support, add a CSS rule for VML elements:
        sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

        LoadingSpinner.prototype.lines = function (el, o) {
            var r = o.length + o.width
              , s = 2 * r

            function grp() {
                return css(
                  vml('group', {
                      coordsize: s + ' ' + s,
                      coordorigin: -r + ' ' + -r
                  }),
                  { width: s, height: s }
                )
            }

            var margin = -(o.width + o.length) * 2 + 'px'
              , g = css(grp(), { position: 'absolute', top: margin, left: margin })
              , i

            function seg(i, dx, filter) {
                ins(g,
                  ins(css(grp(), { rotation: 360 / o.lines * i + 'deg', left: ~~dx }),
                    ins(css(vml('roundrect', { arcsize: o.corners }), {
                        width: r,
                        height: o.width,
                        left: o.radius,
                        top: -o.width >> 1,
                        filter: filter
                    }),
                      vml('fill', { color: getColor(o.color, i), opacity: o.opacity }),
                      vml('stroke', { opacity: 0 }) // transparent stroke to fix color bleeding upon opacity change
                    )
                  )
                )
            }

            if (o.shadow)
                for (i = 1; i <= o.lines; i++)
                    seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')

            for (i = 1; i <= o.lines; i++) seg(i)
            return ins(el, g)
        }

        LoadingSpinner.prototype.opacity = function (el, i, val, o) {
            var c = el.firstChild
            o = o.shadow && o.lines || 0
            if (c && i + o < c.childNodes.length) {
                c = c.childNodes[i + o]; c = c && c.firstChild; c = c && c.firstChild
                if (c) c.opacity = val
            }
        }
    }

    var probe = css(createEl('group'), { behavior: 'url(#default#VML)' })

    if (!vendor(probe, 'transform') && probe.adj) initVML()
    else useCssAnimations = vendor(probe, 'animation')

    return LoadingSpinner

}));

(function()
{
    dockspawn = {version: "0.0.2"};

/**
 * A tab handle represents the tab button on the tab strip
 */
dockspawn.TabHandle = function(parent)
{
    this.parent = parent;
    var undockHandler = dockspawn.TabHandle.prototype._performUndock.bind(this);
    this.elementBase = document.createElement('div');
    this.elementText = document.createElement('div');
    this.elementCloseButton = document.createElement('div');
    this.elementBase.classList.add("tab-handle");
    this.elementBase.classList.add("disable-selection"); // Disable text selection
    this.elementText.classList.add("tab-handle-text");
    this.elementCloseButton.classList.add("tab-handle-close-button");
    this.elementBase.appendChild(this.elementText);
    if (this.parent.host.displayCloseButton)
        this.elementBase.appendChild(this.elementCloseButton);

    this.parent.host.tabListElement.appendChild(this.elementBase);

    var panel = parent.container;
    var title = panel.getRawTitle();
    this.elementText.innerHTML = title;

    // Set the close button text (font awesome)
    var closeIcon = "icon-remove-sign";
    this.elementCloseButton.innerHTML = '<i class="' + closeIcon + '"></i>';

    this._bringToFront(this.elementBase);

    this.undockInitiator = new dockspawn.UndockInitiator(this.elementBase, undockHandler);
    this.undockInitiator.enabled = true;

    this.mouseClickHandler = new dockspawn.EventHandler(this.elementBase, 'click', this.onMouseClicked.bind(this));                     // Button click handler for the tab handle
    this.closeButtonHandler = new dockspawn.EventHandler(this.elementCloseButton, 'mousedown', this.onCloseButtonClicked.bind(this));   // Button click handler for the close button

    this.zIndexCounter = 1000;
};

dockspawn.TabHandle.prototype.updateTitle = function()
{
    if (this.parent.container instanceof dockspawn.PanelContainer)
    {
        var panel = this.parent.container;
        var title = panel.getRawTitle();
        this.elementText.innerHTML = title;
    }
};

dockspawn.TabHandle.prototype.destroy = function()
{
    this.mouseClickHandler.cancel();
    this.closeButtonHandler.cancel();
    removeNode(this.elementBase);
    removeNode(this.elementCloseButton);
    delete this.elementBase;
    delete this.elementCloseButton;
};

dockspawn.TabHandle.prototype._performUndock = function(e, dragOffset)
{
    if (this.parent.container.containerType == "panel")
    {
        this.undockInitiator.enabled = false;
        var panel = this.parent.container;
        return panel.performUndockToDialog(e, dragOffset);
    }
    else
        return null;
};

dockspawn.TabHandle.prototype.onMouseClicked = function()
{
    this.parent.onSelected();
};

dockspawn.TabHandle.prototype.onCloseButtonClicked = function()
{
    // If the page contains a panel element, undock it and destroy it
    if (this.parent.container.containerType == "panel")
    {
        this.undockInitiator.enabled = false;
        var panel = this.parent.container;
        panel.performUndock();
    }
};

dockspawn.TabHandle.prototype.setSelected = function(selected)
{
    var selectedClassName = "tab-handle-selected";
    if (selected)
        this.elementBase.classList.add(selectedClassName);
    else
        this.elementBase.classList.remove(selectedClassName);
};

dockspawn.TabHandle.prototype.setZIndex = function(zIndex)
{
    this.elementBase.style.zIndex = zIndex;
};

dockspawn.TabHandle.prototype._bringToFront = function(element)
{
    element.style.zIndex = this.zIndexCounter;
    this.zIndexCounter++;
};
/**
 * Tab Host control contains tabs known as TabPages.
 * The tab strip can be aligned in different orientations
 */
dockspawn.TabHost = function(tabStripDirection, displayCloseButton)
{
    /**
     * Create a tab host with the tab strip aligned in the [tabStripDirection] direciton
     * Only dockspawn.TabHost.DIRECTION_BOTTOM and dockspawn.TabHost.DIRECTION_TOP are supported
     */
    if (tabStripDirection === undefined)
        tabStripDirection = dockspawn.TabHost.DIRECTION_BOTTOM;
    if (displayCloseButton === undefined)
        displayCloseButton = false;

    this.tabStripDirection = tabStripDirection;
    this.displayCloseButton = displayCloseButton;           // Indicates if the close button next to the tab handle should be displayed
    this.pages = [];
    this.hostElement = document.createElement('div');       // The main tab host DOM element
    this.tabListElement = document.createElement('div');    // Hosts the tab handles
    this.separatorElement = document.createElement('div');  // A seperator line between the tabs and content
    this.contentElement = document.createElement('div');    // Hosts the active tab content
    this.createTabPage = this._createDefaultTabPage;        // Factory for creating tab pages

    if (this.tabStripDirection == dockspawn.TabHost.DIRECTION_BOTTOM)
    {
        this.hostElement.appendChild(this.contentElement);
        this.hostElement.appendChild(this.separatorElement);
        this.hostElement.appendChild(this.tabListElement);
    }
    else if (this.tabStripDirection == dockspawn.TabHost.DIRECTION_TOP)
    {
        // 定制需求，顶部 tab 隐藏掉
        this.tabListElement.classList.add('hide');
        this.separatorElement.classList.add('hide');
        
        this.hostElement.appendChild(this.tabListElement);
        this.hostElement.appendChild(this.separatorElement);
        this.hostElement.appendChild(this.contentElement);
    }
    else
        throw new dockspawn.Exception("Only top and bottom tab strip orientations are supported");

    this.hostElement.classList.add("tab-host");
    this.tabListElement.classList.add("tab-handle-list-container");
    this.separatorElement.classList.add("tab-handle-content-seperator");
    this.contentElement.classList.add("tab-content");
};

// constants
dockspawn.TabHost.DIRECTION_TOP = 0;
dockspawn.TabHost.DIRECTION_BOTTOM = 1;
dockspawn.TabHost.DIRECTION_LEFT = 2;
dockspawn.TabHost.DIRECTION_RIGHT = 3;

dockspawn.TabHost.prototype._createDefaultTabPage = function(tabHost, container)
{
    return new dockspawn.TabPage(tabHost, container);
};

dockspawn.TabHost.prototype.setActiveTab = function(container)
{
    var self = this;
    this.pages.forEach(function(page)
    {
        if (page.container === container)
        {
            self.onTabPageSelected(page);
            return;
        }
    });
};

dockspawn.TabHost.prototype.resize = function(width, height)
{
    this.hostElement.style.width = width + "px";
    this.hostElement.style.height = height + "px";

    var tabHeight = this.tabListElement.clientHeight;
    var separatorHeight = this.separatorElement.clientHeight;
    var contentHeight = height - tabHeight - separatorHeight;
    this.contentElement.style.height = contentHeight + "px";

    if (this.activeTab)
        this.activeTab.resize(width, contentHeight);
};

dockspawn.TabHost.prototype.performLayout = function(children)
{
    // Destroy all existing tab pages
    this.pages.forEach(function(tab)
    {
        tab.destroy();
    });
    this.pages.length = 0;

    var oldActiveTab = this.activeTab;
    delete this.activeTab;

    var childPanels = children.filter(function(child)
    {
        return child.containerType == "panel";
    });

    if (childPanels.length > 0)
    {
        // Rebuild new tab pages
        var self = this;
        childPanels.forEach(function(child)
        {
            var page = self.createTabPage(self, child);
            self.pages.push(page);

            // Restore the active selected tab
            if (oldActiveTab && page.container === oldActiveTab.container)
                self.activeTab = page;
        });
        this._setTabHandlesVisible(true);
    }
    else
        // Do not show an empty tab handle host with zero tabs
        this._setTabHandlesVisible(false);

    if (this.activeTab)
        this.onTabPageSelected(this.activeTab);
};

dockspawn.TabHost.prototype._setTabHandlesVisible = function(visible)
{
    this.tabListElement.style.display = visible ? "block" : "none";
    this.separatorElement.style.display = visible ? "block" : "none";
};

dockspawn.TabHost.prototype.onTabPageSelected = function(page)
{   
    var changedPages = [];

    this.activeTab = page;
    this.pages.forEach(function(tabPage)
    {
        var selected = (tabPage === page);
        if(tabPage.selected !== selected)
            changedPages.push(tabPage);
        tabPage.setSelected(selected);
    });

    // adjust the zIndex of the tabs to have proper shadow/depth effect
    var zIndexDelta = 1;
    var zIndex = 1000;
    this.pages.forEach(function(tabPage)
    {
        tabPage.handle.setZIndex(zIndex);
        var selected = (tabPage == page);
        if (selected)
            zIndexDelta = -1;
        zIndex += zIndexDelta;
    });

    changedPages.forEach(function (tabPage) {
        // 触发 显示/隐藏 事件
        if (this.onTabChanged)
            this.onTabChanged(this, tabPage);
    }, this);

    // If a callback is defined, then notify it of this event
    // if (this.onTabChanged)
    //    this.onTabChanged(this, page);
};

dockspawn.TabHost.prototype.onTabChanged = function (host, page) {
    var ele = page.container.elementContent;
    var cancelld = ele.dispatchEvent(new CustomEvent('dock.tabPage.changed', {detail: page.selected}))
};

dockspawn.TabPage = function(host, container)
{
    if (arguments.length == 0)
        return;

    this.selected = false;
    this.host = host;
    this.container = container;

    this.handle = new dockspawn.TabHandle(this);
    this.containerElement = container.containerElement;

    if (container instanceof dockspawn.PanelContainer)
    {
        var panel = container;
        panel.onTitleChanged = this.onTitleChanged.bind(this);
    }
};

dockspawn.TabPage.prototype.onTitleChanged = function(sender, title)
{
    this.handle.updateTitle();
};

dockspawn.TabPage.prototype.destroy = function()
{
    this.handle.destroy();

    if (this.container instanceof dockspawn.PanelContainer)
    {
        var panel = this.container;
        delete panel.onTitleChanged;
    }
};

dockspawn.TabPage.prototype.onSelected = function()
{
    this.host.onTabPageSelected(this);
};

dockspawn.TabPage.prototype.setSelected = function(flag)
{
    this.selected = flag;
    this.handle.setSelected(flag);

    if (this.selected)
    {
        this.host.contentElement.appendChild(this.containerElement);
        // force a resize again
        var width = this.host.contentElement.clientWidth;
        var height = this.host.contentElement.clientHeight;
        this.container.resize(width, height);
    }
    else
        removeNode(this.containerElement);
        $(".edit").hide();
};

dockspawn.TabPage.prototype.resize = function(width, height)
{
    this.container.resize(width, height);
};
dockspawn.Dialog = function(panel, dockManager)
{
    this.panel = panel;
    this.zIndexCounter = 1000;
    this.dockManager = dockManager;
    this.eventListener = dockManager;
    this._initialize();
};

dockspawn.Dialog.fromElement = function(id, dockManager)
{
    return new dockspawn.Dialog(new dockspawn.PanelContainer(document.getElementById(id), dockManager), dockManager);
};

dockspawn.Dialog.prototype._initialize = function()
{
    this.panel.floatingDialog = this;
    this.elementDialog = document.createElement('div');
    this.elementDialog.appendChild(this.panel.elementPanel);
    this.draggable = new dockspawn.DraggableContainer(this, this.panel, this.elementDialog, this.panel.elementTitle);
    this.resizable = new dockspawn.ResizableContainer(this, this.draggable, this.draggable.topLevelElement);

    document.body.appendChild(this.elementDialog);
    this.elementDialog.classList.add("dialog-floating");
    this.elementDialog.classList.add("rounded-corner-top");
    this.panel.elementTitle.classList.add("rounded-corner-top");

    this.mouseDownHandler = new dockspawn.EventHandler(this.elementDialog, 'mousedown', this.onMouseDown.bind(this));
    this.resize(this.panel.elementPanel.clientWidth, this.panel.elementPanel.clientHeight);
    this.bringToFront();
};

dockspawn.Dialog.prototype.setPosition = function(x, y)
{
    this.elementDialog.style.left = x + "px";
    this.elementDialog.style.top = y + "px";
};

dockspawn.Dialog.prototype.onMouseDown = function(e)
{
    this.bringToFront();
};

dockspawn.Dialog.prototype.destroy = function()
{
    if (this.mouseDownHandler)
    {
        this.mouseDownHandler.cancel();
        delete this.mouseDownHandler;
    }
    this.elementDialog.classList.remove("rounded-corner-top");
    this.panel.elementTitle.classList.remove("rounded-corner-top");
    removeNode(this.elementDialog);
    this.draggable.removeDecorator();
    removeNode(this.panel.elementPanel);
    this.panel.floatingDialog = undefined;
};

dockspawn.Dialog.prototype.resize = function(width, height)
{
    this.resizable.resize(width, height);
};

dockspawn.Dialog.prototype.setTitle = function(title)
{
    this.panel.setTitle(title);
};

dockspawn.Dialog.prototype.setTitleIcon = function(iconName)
{
    this.panel.setTitleIcon(iconName);
};

dockspawn.Dialog.prototype.bringToFront = function()
{
    this.elementDialog.style.zIndex = this.zIndexCounter++;
};
dockspawn.DraggableContainer = function(dialog, delegate, topLevelElement, dragHandle)
{
    this.dialog = dialog;
    this.delegate = delegate;
    this.containerElement = delegate.containerElement;
    this.dockManager = delegate.dockManager;
    this.topLevelElement = topLevelElement;
    this.containerType = delegate.containerType;
    this.mouseDownHandler = new dockspawn.EventHandler(dragHandle, 'mousedown', this.onMouseDown.bind(this));
    this.topLevelElement.style.marginLeft = topLevelElement.offsetLeft + "px";
    this.topLevelElement.style.marginTop = topLevelElement.offsetTop + "px";
    this.minimumAllowedChildNodes = delegate.minimumAllowedChildNodes;
};

dockspawn.DraggableContainer.prototype.destroy = function()
{
    this.removeDecorator();
    this.delegate.destroy();
};

dockspawn.DraggableContainer.prototype.saveState = function(state)
{
    this.delegate.saveState(state);
};

dockspawn.DraggableContainer.prototype.loadState = function(state)
{
    this.delegate.loadState(state);
};

dockspawn.DraggableContainer.prototype.setActiveChild = function(child)
{
};

Object.defineProperty(dockspawn.DraggableContainer.prototype, "width", {
    get: function() { return this.delegate.width; }
});

Object.defineProperty(dockspawn.DraggableContainer.prototype, "height", {
    get: function() { return this.delegate.height; }
});

dockspawn.DraggableContainer.prototype.name = function(value)
{
    if (value)
        this.delegate.name = value;
    return this.delegate.name;
};

dockspawn.DraggableContainer.prototype.resize = function(width, height)
{
    this.delegate.resize(width, height);
};

dockspawn.DraggableContainer.prototype.performLayout = function(children)
{
    this.delegate.performLayout(children);
};

dockspawn.DraggableContainer.prototype.removeDecorator = function()
{
    if (this.mouseDownHandler)
    {
        this.mouseDownHandler.cancel();
        delete this.mouseDownHandler;
    }
};

dockspawn.DraggableContainer.prototype.onMouseDown = function(event)
{
    this._startDragging(event);
    this.previousMousePosition = { x: event.pageX, y: event.pageY };
    if (this.mouseMoveHandler)
    {
        this.mouseMoveHandler.cancel();
        delete this.mouseMoveHandler;
    }
    if (this.mouseUpHandler)
    {
        this.mouseUpHandler.cancel();
        delete this.mouseUpHandler;
    }

    this.mouseMoveHandler = new dockspawn.EventHandler(window, 'mousemove', this.onMouseMove.bind(this));
    this.mouseUpHandler = new dockspawn.EventHandler(window, 'mouseup', this.onMouseUp.bind(this));
};

dockspawn.DraggableContainer.prototype.onMouseUp = function(event)
{
    this._stopDragging(event);
    this.mouseMoveHandler.cancel();
    delete this.mouseMoveHandler;
    this.mouseUpHandler.cancel();
    delete this.mouseUpHandler;
};

dockspawn.DraggableContainer.prototype._startDragging = function(event)
{
    if (this.dialog.eventListener)
        this.dialog.eventListener.onDialogDragStarted(this.dialog, event);
    document.body.classList.add("disable-selection");
};

dockspawn.DraggableContainer.prototype._stopDragging = function(event)
{
    if (this.dialog.eventListener)
        this.dialog.eventListener.onDialogDragEnded(this.dialog, event);
    document.body.classList.remove("disable-selection");
};

dockspawn.DraggableContainer.prototype.onMouseMove = function(event)
{
    var currentMousePosition = new Point(event.pageX, event.pageY);
    var dx = Math.floor(currentMousePosition.x - this.previousMousePosition.x);
    var dy = Math.floor(currentMousePosition.y - this.previousMousePosition.y);
    this._performDrag(dx, dy);
    this.previousMousePosition = currentMousePosition;
};

dockspawn.DraggableContainer.prototype._performDrag = function(dx, dy)
{
    var left = dx + getPixels(this.topLevelElement.style.marginLeft);
    var top = dy + getPixels(this.topLevelElement.style.marginTop);
    this.topLevelElement.style.marginLeft = left + "px";
    this.topLevelElement.style.marginTop = top + "px";
};
/**
 * Decorates a dock container with resizer handles around its base element
 * This enables the container to be resized from all directions
 */
dockspawn.ResizableContainer = function(dialog, delegate, topLevelElement)
{
    this.dialog = dialog;
    this.delegate = delegate;
    this.containerElement = delegate.containerElement;
    this.dockManager = delegate.dockManager;
    this.topLevelElement = topLevelElement;
    this.containerType = delegate.containerType;
    this.topLevelElement.style.marginLeft = this.topLevelElement.offsetLeft + "px";
    this.topLevelElement.style.marginTop = this.topLevelElement.offsetTop + "px";
    this.minimumAllowedChildNodes = delegate.minimumAllowedChildNodes;
    this._buildResizeHandles();
    this.readyToProcessNextResize = true;
};

dockspawn.ResizableContainer.prototype.setActiveChild = function(child)
{
};

dockspawn.ResizableContainer.prototype._buildResizeHandles = function()
{
    this.resizeHandles = [];
//    this._buildResizeHandle(true, false, true, false); // Dont need the corner resizer near the close button
    this._buildResizeHandle(false, true, true, false);
    this._buildResizeHandle(true, false, false, true);
    this._buildResizeHandle(false, true, false, true);

    this._buildResizeHandle(true, false, false, false);
    this._buildResizeHandle(false, true, false, false);
    this._buildResizeHandle(false, false, true, false);
    this._buildResizeHandle(false, false, false, true);
};

dockspawn.ResizableContainer.prototype._buildResizeHandle = function(east, west, north, south)
{
    var handle = new ResizeHandle();
    handle.east = east;
    handle.west = west;
    handle.north = north;
    handle.south = south;

    // Create an invisible div for the handle
    handle.element = document.createElement('div');
    this.topLevelElement.appendChild(handle.element);

    // Build the class name for the handle
    var verticalClass = "";
    var horizontalClass = "";
    if (north) verticalClass = "n";
    if (south) verticalClass = "s";
    if (east) horizontalClass = "e";
    if (west) horizontalClass = "w";
    var cssClass = "resize-handle-" + verticalClass + horizontalClass;
    if (verticalClass.length > 0 && horizontalClass.length > 0)
        handle.corner = true;

    handle.element.classList.add(handle.corner ? "resize-handle-corner" : "resize-handle");
    handle.element.classList.add(cssClass);
    this.resizeHandles.push(handle);

    var self = this;
    handle.mouseDownHandler = new dockspawn.EventHandler(handle.element, 'mousedown', function(e) { self.onMouseDown(handle, e); });
};

dockspawn.ResizableContainer.prototype.saveState = function(state)
{
    this.delegate.saveState(state);
};

dockspawn.ResizableContainer.prototype.loadState = function(state)
{
    this.delegate.loadState(state);
};

Object.defineProperty(dockspawn.ResizableContainer.prototype, "width", {
    get: function() { return this.delegate.width; }
});

Object.defineProperty(dockspawn.ResizableContainer.prototype, "height", {
    get: function() { return this.delegate.height; }
});

dockspawn.ResizableContainer.prototype.name = function(value)
{
    if (value)
        this.delegate.name = value;
    return this.delegate.name;
};

dockspawn.ResizableContainer.prototype.resize = function(width, height)
{
    this.delegate.resize(width, height);
    this._adjustResizeHandles(width, height);
};

dockspawn.ResizableContainer.prototype._adjustResizeHandles = function(width, height)
{
    var self = this;
    this.resizeHandles.forEach(function(handle) {
        handle.adjustSize(self.topLevelElement, width, height);
    });
};

dockspawn.ResizableContainer.prototype.performLayout = function(children)
{
    this.delegate.performLayout(children);
};

dockspawn.ResizableContainer.prototype.destroy = function()
{
    this.removeDecorator();
    this.delegate.destroy();
};

dockspawn.ResizableContainer.prototype.removeDecorator = function()
{
};

dockspawn.ResizableContainer.prototype.onMouseMoved = function(handle, e)
{
    if (!this.readyToProcessNextResize)
        return;
    this.readyToProcessNextResize = false;

//    window.requestLayoutFrame(() {
    this.dockManager.suspendLayout();
    var currentMousePosition = new Point(e.pageX, e.pageY);
    var dx = Math.floor(currentMousePosition.x - this.previousMousePosition.x);
    var dy = Math.floor(currentMousePosition.y - this.previousMousePosition.y);
    this._performDrag(handle, dx, dy);
    this.previousMousePosition = currentMousePosition;
    this.readyToProcessNextResize = true;
    this.dockManager.resumeLayout();
//    });
};

dockspawn.ResizableContainer.prototype.onMouseDown = function(handle, event)
{
    this.previousMousePosition = new Point(event.pageX, event.pageY);
    if (handle.mouseMoveHandler)
    {
        handle.mouseMoveHandler.cancel();
        delete handle.mouseMoveHandler
    }
    if (handle.mouseUpHandler)
    {
        handle.mouseUpHandler.cancel();
        delete handle.mouseUpHandler
    }

    // Create the mouse event handlers
    var self = this;
    handle.mouseMoveHandler = new dockspawn.EventHandler(window, 'mousemove', function(e) { self.onMouseMoved(handle, e); });
    handle.mouseUpHandler = new dockspawn.EventHandler(window, 'mouseup', function(e) { self.onMouseUp(handle, e); });

    document.body.classList.add("disable-selection");
};

dockspawn.ResizableContainer.prototype.onMouseUp = function(handle, event)
{
    handle.mouseMoveHandler.cancel();
    handle.mouseUpHandler.cancel();
    delete handle.mouseMoveHandler;
    delete handle.mouseUpHandler;

    document.body.classList.remove("disable-selection");
};

dockspawn.ResizableContainer.prototype._performDrag = function(handle, dx, dy)
{
    var bounds = {};
    bounds.left = getPixels(this.topLevelElement.style.marginLeft);
    bounds.top = getPixels(this.topLevelElement.style.marginTop);
    bounds.width = this.topLevelElement.clientWidth;
    bounds.height = this.topLevelElement.clientHeight;

    if (handle.east) this._resizeEast(dx, bounds);
    if (handle.west) this._resizeWest(dx, bounds);
    if (handle.north) this._resizeNorth(dy, bounds);
    if (handle.south) this._resizeSouth(dy, bounds);
};

dockspawn.ResizableContainer.prototype._resizeWest = function(dx, bounds)
{
    this._resizeContainer(dx, 0, -dx, 0, bounds);
};

dockspawn.ResizableContainer.prototype._resizeEast = function(dx, bounds)
{
    this._resizeContainer(0, 0, dx, 0, bounds);
};

dockspawn.ResizableContainer.prototype._resizeNorth = function(dy, bounds)
{
    this._resizeContainer(0, dy, 0, -dy, bounds);
};

dockspawn.ResizableContainer.prototype._resizeSouth = function(dy, bounds)
{
    this._resizeContainer(0, 0, 0, dy, bounds);
};

dockspawn.ResizableContainer.prototype._resizeContainer = function(leftDelta, topDelta, widthDelta, heightDelta, bounds)
{
    bounds.left += leftDelta;
    bounds.top += topDelta;
    bounds.width += widthDelta;
    bounds.height += heightDelta;

    var minWidth = 50;  // TODO: Move to external configuration
    var minHeight = 50;  // TODO: Move to external configuration
    bounds.width = Math.max(bounds.width, minWidth);
    bounds.height = Math.max(bounds.height, minHeight);

    this.topLevelElement.style.marginLeft = bounds.left + "px";
    this.topLevelElement.style.marginTop = bounds.top + "px";

    this.resize(bounds.width, bounds.height);
};


function ResizeHandle()
{
    this.element = undefined;
    this.handleSize = 6;   // TODO: Get this from DOM
    this.cornerSize = 12;  // TODO: Get this from DOM
    this.east = false;
    this.west = false;
    this.north = false;
    this.south = false;
    this.corner = false;
}

ResizeHandle.prototype.adjustSize = function(container, clientWidth, clientHeight)
{
    if (this.corner)
    {
        if (this.west) this.element.style.left = "0px";
        if (this.east) this.element.style.left = (clientWidth - this.cornerSize) + "px";
        if (this.north) this.element.style.top = "0px";
        if (this.south) this.element.style.top = (clientHeight - this.cornerSize) + "px";
    }
    else
    {
        if (this.west)
        {
            this.element.style.left = "0px";
            this.element.style.top = this.cornerSize + "px";
        }
        if (this.east) {
            this.element.style.left = (clientWidth - this.handleSize) + "px";
            this.element.style.top = this.cornerSize + "px";
        }
        if (this.north) {
            this.element.style.left = this.cornerSize + "px";
            this.element.style.top = "0px";
        }
        if (this.south) {
            this.element.style.left = this.cornerSize + "px";
            this.element.style.top = (clientHeight - this.handleSize) + "px";
        }

        if (this.west || this.east) {
            this.element.style.height = (clientHeight - this.cornerSize * 2) + "px";
        } else {
            this.element.style.width = (clientWidth - this.cornerSize * 2) + "px";
        }
    }
};
dockspawn.Exception = function(message)
{
    this.message = message;
}

dockspawn.Exception.prototype.toString = function()
{
    return this.message;
};
/**
 * Dock manager manages all the dock panels in a hierarchy, similar to visual studio.
 * It owns a Html Div element inside which all panels are docked
 * Initially the document manager takes up the central space and acts as the root node
 */

 dockspawn.DockManager = function(element)
{
    if (element === undefined)
        throw new dockspawn.Exception("Invalid Dock Manager element provided");

    this.element = element;
    this.context = this.dockWheel = this.layoutEngine = this.mouseMoveHandler = undefined;
    this.layoutEventListeners = [];
};

dockspawn.DockManager.prototype.initialize = function()
{
    this.context = new dockspawn.DockManagerContext(this);
    var documentNode = new dockspawn.DockNode(this.context.documentManagerView);
    this.context.model.rootNode = documentNode;
    this.context.model.documentManagerNode = documentNode;
    this.setRootNode(this.context.model.rootNode);
    // Resize the layout
    this.resize(this.element.clientWidth, this.element.clientHeight);
    this.dockWheel = new dockspawn.DockWheel(this);
    this.layoutEngine = new dockspawn.DockLayoutEngine(this);

    this.rebuildLayout(this.context.model.rootNode);
};

dockspawn.DockManager.prototype.rebuildLayout = function(node)
{
    var self = this;
    node.children.forEach(function(child) { self.rebuildLayout(child); });
    node.performLayout();
};

dockspawn.DockManager.prototype.invalidate = function()
{
    this.resize(this.element.clientWidth, this.element.clientHeight);
};

dockspawn.DockManager.prototype.resize = function(width, height)
{
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";
    this.context.model.rootNode.container.resize(width, height);
};

/**
 * Reset the dock model . This happens when the state is loaded from json
 */
dockspawn.DockManager.prototype.setModel = function(model)
{
    removeNode(this.context.documentManagerView.containerElement);
    this.context.model = model;
    this.setRootNode(model.rootNode);

    this.rebuildLayout(model.rootNode);
    this.invalidate();
};

dockspawn.DockManager.prototype.setRootNode = function(node)
{
    if (this.context.model.rootNode)
    {
        // detach it from the dock manager's base element
//      context.model.rootNode.detachFromParent();
    }

    // Attach the new node to the dock manager's base element and set as root node
    node.detachFromParent();
    this.context.model.rootNode = node;
    this.element.appendChild(node.container.containerElement);
};


dockspawn.DockManager.prototype.onDialogDragStarted = function(sender, e)
{
    this.dockWheel.activeNode = this._findNodeOnPoint(e.pageX, e.pageY);
    this.dockWheel.activeDialog = sender;
    this.dockWheel.showWheel();
    if (this.mouseMoveHandler)
    {
        this.mouseMoveHandler.cancel();
        delete this.mouseMoveHandler;
    }
    this.mouseMoveHandler = new dockspawn.EventHandler(window, 'mousemove', this.onMouseMoved.bind(this));
};

dockspawn.DockManager.prototype.onDialogDragEnded = function(sender, e)
{
    if (this.mouseMoveHandler)
    {
        this.mouseMoveHandler.cancel();
        delete this.mouseMoveHandler;
    }
    this.dockWheel.onDialogDropped(sender);
    this.dockWheel.hideWheel();
    delete this.dockWheel.activeDialog;
};

dockspawn.DockManager.prototype.onMouseMoved = function(e)
{
    this.dockWheel.activeNode = this._findNodeOnPoint(e.clientX, e.clientY);
};

/**
 * Perform a DFS on the dock model's tree to find the
 * deepest level panel (i.e. the top-most non-overlapping panel)
 * that is under the mouse cursor
 * Retuns null if no node is found under this point
 */
dockspawn.DockManager.prototype._findNodeOnPoint = function(x, y)
{
    var stack = [];
    stack.push(this.context.model.rootNode);
    var bestMatch;

    while (stack.length > 0)
    {
        var topNode = stack.pop();

        if (isPointInsideNode(x, y, topNode))
        {
            // This node contains the point.
            bestMatch = topNode;

            // Keep looking future down
            [].push.apply(stack, topNode.children);
        }
    }
    return bestMatch;
};

/** Dock the [dialog] to the left of the [referenceNode] node */
dockspawn.DockManager.prototype.dockDialogLeft = function(referenceNode, dialog)
{
    return this._requestDockDialog(referenceNode, dialog, this.layoutEngine.dockLeft.bind(this.layoutEngine));
};

/** Dock the [dialog] to the right of the [referenceNode] node */
dockspawn.DockManager.prototype.dockDialogRight = function(referenceNode, dialog)
{
    return this._requestDockDialog(referenceNode, dialog, this.layoutEngine.dockRight.bind(this.layoutEngine));
};

/** Dock the [dialog] above the [referenceNode] node */
dockspawn.DockManager.prototype.dockDialogUp = function(referenceNode, dialog)
{
    return this._requestDockDialog(referenceNode, dialog, this.layoutEngine.dockUp.bind(this.layoutEngine));
};

/** Dock the [dialog] below the [referenceNode] node */
dockspawn.DockManager.prototype.dockDialogDown = function(referenceNode, dialog)
{
    return this._requestDockDialog(referenceNode, dialog, this.layoutEngine.dockDown.bind(this.layoutEngine));
};

/** Dock the [dialog] as a tab inside the [referenceNode] node */
dockspawn.DockManager.prototype.dockDialogFill = function(referenceNode, dialog)
{
    return this._requestDockDialog(referenceNode, dialog, this.layoutEngine.dockFill.bind(this.layoutEngine));
};

/** Dock the [container] to the left of the [referenceNode] node */
dockspawn.DockManager.prototype.dockLeft = function(referenceNode, container, ratio)
{
    return this._requestDockContainer(referenceNode, container, this.layoutEngine.dockLeft.bind(this.layoutEngine), ratio);
};

/** Dock the [container] to the right of the [referenceNode] node */
dockspawn.DockManager.prototype.dockRight = function(referenceNode,  container, ratio)
{
    return this._requestDockContainer(referenceNode, container, this.layoutEngine.dockRight.bind(this.layoutEngine), ratio);
};

/** Dock the [container] above the [referenceNode] node */
dockspawn.DockManager.prototype.dockUp = function(referenceNode,  container, ratio)
{
    return this._requestDockContainer(referenceNode, container, this.layoutEngine.dockUp.bind(this.layoutEngine), ratio);
};

/** Dock the [container] below the [referenceNode] node */
dockspawn.DockManager.prototype.dockDown = function(referenceNode,  container, ratio)
{
    return this._requestDockContainer(referenceNode, container, this.layoutEngine.dockDown.bind(this.layoutEngine), ratio);
};

/** Dock the [container] as a tab inside the [referenceNode] node */
dockspawn.DockManager.prototype.dockFill = function(referenceNode, container)
{
    return this._requestDockContainer(referenceNode, container, this.layoutEngine.dockFill.bind(this.layoutEngine));
};

dockspawn.DockManager.prototype._requestDockDialog = function(referenceNode, dialog, layoutDockFunction)
{
    // Get the active dialog that was dragged on to the dock wheel
    var panel = dialog.panel;
    var newNode = new dockspawn.DockNode(panel);
    panel.prepareForDocking();
    dialog.destroy();
    layoutDockFunction(referenceNode, newNode);
    this.invalidate();
    return newNode;
};

dockspawn.DockManager.prototype._requestDockContainer = function(referenceNode, container, layoutDockFunction, ratio)
{
    // Get the active dialog that was dragged on to the dock wheel
    var newNode = new dockspawn.DockNode(container);
    if (container.containerType == "panel")
    {
        var panel = container;
        panel.prepareForDocking();
        removeNode(panel.elementPanel);
    }
    layoutDockFunction(referenceNode, newNode);

    if (ratio && newNode.parent &&
        (newNode.parent.container.containerType == "vertical" || newNode.parent.container.containerType == "horizontal"))
    {
        var splitter = newNode.parent.container;
        splitter.setContainerRatio(container, ratio);
    }

    this.rebuildLayout(this.context.model.rootNode);
    this.invalidate();
    return newNode;
};

/**
 * Undocks a panel and converts it into a floating dialog window
 * It is assumed that only leaf nodes (panels) can be undocked
 */
dockspawn.DockManager.prototype.requestUndockToDialog = function(container, event, dragOffset)
{
    var node = this._findNodeFromContainer(container);
    this.layoutEngine.undock(node);

    // Create a new dialog window for the undocked panel
    var dialog = new dockspawn.Dialog(node.container, this);

    // Adjust the relative position
    var dialogWidth = dialog.elementDialog.clientWidth;
    if (dragOffset.x > dialogWidth)
        dragOffset.x = 0.75 * dialogWidth;
    dialog.setPosition(
        event.clientX - dragOffset.x,
        event.clientY - dragOffset.y);
    dialog.draggable.onMouseDown(event);

    return dialog;
};

/** Undocks a panel and converts it into a floating dialog window
 * It is assumed that only leaf nodes (panels) can be undocked
 */
dockspawn.DockManager.prototype.requestUndock = function(container)
{
    var node = this._findNodeFromContainer(container);
    this.layoutEngine.undock(node);
};

/**
 * Removes a dock container from the dock layout hierarcy
 * Returns the node that was removed from the dock tree
 */
dockspawn.DockManager.prototype.requestRemove = function(container)
{
    var node = this._findNodeFromContainer(container);
    var parent = node.parent;
    node.detachFromParent();
    if (parent)
        this.rebuildLayout(parent);
    return node;
};

/** Finds the node that owns the specified [container] */
dockspawn.DockManager.prototype._findNodeFromContainer = function(container)
{
    //this.context.model.rootNode.debug_DumpTree();

    var stack = [];
    stack.push(this.context.model.rootNode);

    while (stack.length > 0)
    {
        var topNode = stack.pop();

        if (topNode.container === container)
            return topNode;
        [].push.apply(stack, topNode.children);
    }

    throw new dockspawn.Exception("Cannot find dock node belonging to the element");
};

dockspawn.DockManager.prototype.addLayoutListener = function(listener)
{
    this.layoutEventListeners.push(listener);
};

dockspawn.DockManager.prototype.removeLayoutListener = function(listener)
{
    this.layoutEventListeners.splice(this.layoutEventListeners.indexOf(listener), 1);
};

dockspawn.DockManager.prototype.suspendLayout = function()
{
    var self = this;
    this.layoutEventListeners.forEach(function(listener) { 
		if (listener.onSuspendLayout) listener.onSuspendLayout(self); 
	});
};

dockspawn.DockManager.prototype.resumeLayout = function()
{
    var self = this;
    this.layoutEventListeners.forEach(function(listener) { 
		if (listener.onResumeLayout) listener.onResumeLayout(self); 
	});
};

dockspawn.DockManager.prototype.notifyOnDock = function(dockNode)
{
    var self = this;
    this.layoutEventListeners.forEach(function(listener) { 
		if (listener.onDock) {
			listener.onDock(self, dockNode); 
		}
	});
};

dockspawn.DockManager.prototype.notifyOnUnDock = function(dockNode)
{
    var self = this;
    this.layoutEventListeners.forEach(function(listener) { 
		if (listener.onUndock) {
			listener.onUndock(self, dockNode); 
		}
	});
};

dockspawn.DockManager.prototype.saveState = function()
{
    var serializer = new dockspawn.DockGraphSerializer();
    return serializer.serialize(this.context.model);
};

dockspawn.DockManager.prototype.loadState = function(json)
{
    var deserializer = new dockspawn.DockGraphDeserializer(this);
    this.context.model = deserializer.deserialize(json);
    this.setModel(this.context.model);
};

//typedef void LayoutEngineDockFunction(dockspawn.DockNode referenceNode, dockspawn.DockNode newNode);

/**
* The Dock Manager notifies the listeners of layout changes so client containers that have
* costly layout structures can detach and reattach themself to avoid reflow
*/
//abstract class LayoutEventListener {
//void onSuspendLayout(dockspawn.DockManager dockManager);
//void onResumeLayout(dockspawn.DockManager dockManager);
//}

dockspawn.DockLayoutEngine = function(dockManager)
{
    this.dockManager = dockManager;
}

/** docks the [newNode] to the left of [referenceNode] */
dockspawn.DockLayoutEngine.prototype.dockLeft = function(referenceNode, newNode)
{
    this._performDock(referenceNode, newNode, "horizontal", true);
};

/** docks the [newNode] to the right of [referenceNode] */
dockspawn.DockLayoutEngine.prototype.dockRight = function(referenceNode, newNode) {
    this._performDock(referenceNode, newNode, "horizontal", false);
};

/** docks the [newNode] to the top of [referenceNode] */
dockspawn.DockLayoutEngine.prototype.dockUp = function(referenceNode, newNode) {
    this._performDock(referenceNode, newNode, "vertical", true);
};

/** docks the [newNode] to the bottom of [referenceNode] */
dockspawn.DockLayoutEngine.prototype.dockDown = function(referenceNode, newNode) {
    this._performDock(referenceNode, newNode, "vertical", false);
};

/** docks the [newNode] by creating a new tab inside [referenceNode] */
dockspawn.DockLayoutEngine.prototype.dockFill = function(referenceNode, newNode) {
    this._performDock(referenceNode, newNode, "fill", false);
};

dockspawn.DockLayoutEngine.prototype.undock = function(node)
{
    var parentNode = node.parent;
    if (!parentNode)
        throw new dockspawn.Exception("Cannot undock.  panel is not a leaf node");

    // Get the position of the node relative to it's siblings
    var siblingIndex = parentNode.children.indexOf(node);

    // Detach the node from the dock manager's tree hierarchy
    node.detachFromParent();

    // Fix the node's parent hierarchy
    if (parentNode.children.length < parentNode.container.minimumAllowedChildNodes) {
        // If the child count falls below the minimum threshold, destroy the parent and merge
        // the children with their grandparents
        var grandParent = parentNode.parent;
        for (var i = 0; i < parentNode.children.length; i++)
        {
            var otherChild = parentNode.children[i];
            if (grandParent)
            {
                // parent node is not a root node
                grandParent.addChildAfter(parentNode, otherChild);
                parentNode.detachFromParent();
                parentNode.container.destroy();
                grandParent.performLayout();
            }
            else
            {
                // Parent is a root node.
                // Make the other child the root node
                parentNode.detachFromParent();
                parentNode.container.destroy();
                this.dockManager.setRootNode(otherChild);
            }
        }
    }
    else
    {
        // the node to be removed has 2 or more other siblings. So it is safe to continue
        // using the parent composite container.
        parentNode.performLayout();

        // Set the next sibling as the active child (e.g. for a Tab host, it would select it as the active tab)
        if (parentNode.children.length > 0)
        {
            var nextActiveSibling = parentNode.children[Math.max(0, siblingIndex - 1)];
            parentNode.container.setActiveChild(nextActiveSibling.container);
        }
    }
    this.dockManager.invalidate();
	this.dockManager.notifyOnUnDock(node);
};

dockspawn.DockLayoutEngine.prototype._performDock = function(referenceNode, newNode, direction, insertBeforeReference)
{
    if (referenceNode.parent && referenceNode.parent.container.containerType == "fill")
        referenceNode = referenceNode.parent;

    if (direction == "fill" && referenceNode.container.containerType == "fill")
    {
        referenceNode.addChild(newNode);
        referenceNode.performLayout();
        referenceNode.container.setActiveChild(newNode.container);
        return;
    }

    // Check if reference node is root node
    var model = this.dockManager.context.model;
    if (referenceNode === model.rootNode)
    {
        var compositeContainer = this._createDockContainer(direction, newNode, referenceNode);
        var compositeNode = new dockspawn.DockNode(compositeContainer);

        if (insertBeforeReference)
        {
            compositeNode.addChild(newNode);
            compositeNode.addChild(referenceNode);
        }
        else
        {
            compositeNode.addChild(referenceNode);
            compositeNode.addChild(newNode);
        }

        // Attach the root node to the dock manager's DOM
		this.dockManager.setRootNode(compositeNode);
        this.dockManager.rebuildLayout(this.dockManager.context.model.rootNode);
        compositeNode.container.setActiveChild(newNode.container);
        return;
    }

    if (referenceNode.parent.container.containerType != direction) {
        var referenceParent = referenceNode.parent;

        // Get the dimensions of the reference node, for resizing later on
        var referenceNodeWidth = referenceNode.container.containerElement.clientWidth;
        var referenceNodeHeight = referenceNode.container.containerElement.clientHeight;

        // Get the dimensions of the reference node, for resizing later on
        var referenceNodeParentWidth = referenceParent.container.containerElement.clientWidth;
        var referenceNodeParentHeight = referenceParent.container.containerElement.clientHeight;

        // Replace the reference node with a new composite node with the reference and new node as it's children
        var compositeContainer = this._createDockContainer(direction, newNode, referenceNode);
        var compositeNode = new dockspawn.DockNode(compositeContainer);

        referenceParent.addChildAfter(referenceNode, compositeNode);
        referenceNode.detachFromParent();
        removeNode(referenceNode.container.containerElement);

        if (insertBeforeReference)
        {
            compositeNode.addChild(newNode);
            compositeNode.addChild(referenceNode);
        }
        else
        {
            compositeNode.addChild(referenceNode);
            compositeNode.addChild(newNode);
        }

        referenceParent.performLayout();
        compositeNode.performLayout();

        compositeNode.container.setActiveChild(newNode.container);
        compositeNode.container.resize(referenceNodeWidth, referenceNodeHeight);
        referenceParent.container.resize(referenceNodeParentWidth, referenceNodeParentHeight);
    }
    else
    {
        // Add as a sibling, since the parent of the reference node is of the right composite type
        var referenceParent = referenceNode.parent;
        if (insertBeforeReference)
            referenceParent.addChildBefore(referenceNode, newNode);
        else
            referenceParent.addChildAfter(referenceNode, newNode);
        referenceParent.performLayout();
        referenceParent.container.setActiveChild(newNode.container);
    }

    // force resize the panel
    var containerWidth = newNode.container.containerElement.clientWidth;
    var containerHeight = newNode.container.containerElement.clientHeight;
    newNode.container.resize(containerWidth, containerHeight);
	
	this.dockManager.notifyOnDock(newNode);
};

dockspawn.DockLayoutEngine.prototype._forceResizeCompositeContainer = function(container)
{
    var width = container.containerElement.clientWidth;
    var height = container.containerElement.clientHeight;
    container.resize(width, height);
};

dockspawn.DockLayoutEngine.prototype._createDockContainer = function(containerType, newNode, referenceNode)
{
    if (containerType == "horizontal")
        return new dockspawn.HorizontalDockContainer(this.dockManager, [newNode.container, referenceNode.container]);
    if (containerType == "vertical")
        return new dockspawn.VerticalDockContainer(this.dockManager, [newNode.container, referenceNode.container]);
    if (containerType == "fill")
        return new dockspawn.FillDockContainer(this.dockManager);
    throw new dockspawn.Exception("Failed to create dock container of type: " + containerType);
};


/**
 * Gets the bounds of the new node if it were to dock with the specified configuration
 * The state is not modified in this function.  It is used for showing a preview of where
 * the panel would be docked when hovered over a dock wheel button
 */
dockspawn.DockLayoutEngine.prototype.getDockBounds = function(referenceNode, containerToDock, direction, insertBeforeReference)
{
    var compositeNode; // The node that contains the splitter / fill node
    var childCount;
    var childPosition;
    if (direction == "fill")
    {
        // Since this is a fill operation, the highlight bounds is the same as the reference node
        // TODO: Create a tab handle highlight to show that it's going to be docked in a tab
        var targetElement = referenceNode.container.containerElement;
        var bounds = new Rectangle();
        bounds.x = targetElement.offsetLeft;
        bounds.y = targetElement.offsetTop;
        bounds.width = targetElement.clientWidth;
        bounds.height= targetElement.clientHeight;
        return bounds;
    }

    if (referenceNode.parent && referenceNode.parent.container.containerType == "fill")
        // Ignore the fill container's child and move one level up
        referenceNode = referenceNode.parent;

    // Flag to indicate of the renference node was replaced with a new composite node with 2 children
    var hierarchyModified = false;
    if (referenceNode.parent && referenceNode.parent.container.containerType == direction) {
        // The parent already is of the desired composite type.  Will be inserted as sibling to the reference node
        compositeNode = referenceNode.parent;
        childCount = compositeNode.children.length;
        childPosition = compositeNode.children.indexOf(referenceNode) + (insertBeforeReference ? 0 : 1);
    } else {
        // The reference node will be replaced with a new composite node of the desired type with 2 children
        compositeNode = referenceNode;
        childCount = 1;   // The newly inserted composite node will contain the reference node
        childPosition = (insertBeforeReference ? 0 : 1);
        hierarchyModified = true;
    }

    var splitBarSize = 5;  // TODO: Get from DOM
    var targetPanelSize = 0;
    var targetPanelStart = 0;
    if (direction == "vertical" || direction == "horizontal")
    {
        // Existing size of the composite container (without the splitter bars).
        // This will also be the final size of the composite (splitter / fill)
        // container after the new panel has been docked
        var compositeSize = this._getVaringDimension(compositeNode.container, direction) - (childCount - 1) * splitBarSize;

        // size of the newly added panel
        var newPanelOriginalSize = this._getVaringDimension(containerToDock, direction);
        var scaleMultiplier = compositeSize / (compositeSize + newPanelOriginalSize);

        // Size of the panel after it has been docked and scaled
        targetPanelSize = newPanelOriginalSize * scaleMultiplier;
        if (hierarchyModified)
            targetPanelStart = insertBeforeReference ? 0 : compositeSize * scaleMultiplier;
        else
        {
            for (var i = 0; i < childPosition; i++)
                targetPanelStart += this._getVaringDimension(compositeNode.children[i].container, direction);
            targetPanelStart *= scaleMultiplier;
        }
    }

    var bounds = new Rectangle();
    if (direction == "vertical")
    {
        bounds.x = compositeNode.container.containerElement.offsetLeft;
        bounds.y = compositeNode.container.containerElement.offsetTop + targetPanelStart;
        bounds.width = compositeNode.container.width;
        bounds.height = targetPanelSize;
    } else if (direction == "horizontal") {
        bounds.x = compositeNode.container.containerElement.offsetLeft + targetPanelStart;
        bounds.y = compositeNode.container.containerElement.offsetTop;
        bounds.width = targetPanelSize;
        bounds.height = compositeNode.container.height;
    }

    return bounds;
};

dockspawn.DockLayoutEngine.prototype._getVaringDimension = function(container, direction)
{
    if (direction == "vertical")
        return container.height;
    if (direction == "horizontal")
        return container.width;
    return 0;
};
dockspawn.DockManagerContext = function(dockManager)
{
    this.dockManager = dockManager;
    this.model = new dockspawn.DockModel();
    this.documentManagerView = new dockspawn.DocumentManagerContainer(this.dockManager);
};
/**
 * The Dock Model contains the tree hierarchy that represents the state of the
 * panel placement within the dock manager.
 */
dockspawn.DockModel = function()
{
    this.rootNode = this.documentManagerNode = undefined;
};

dockspawn.DockNode = function(container)
{
    /** The dock container represented by this node */
    this.container = container;
    this.children = [];
}

dockspawn.DockNode.prototype.detachFromParent = function()
{
    if (this.parent)
    {
        this.parent.removeChild(this);
        delete this.parent;
    }
};

dockspawn.DockNode.prototype.removeChild = function(childNode)
{
    var index = this.children.indexOf(childNode);
    if (index >= 0)
        this.children.splice(index, 1);
};

dockspawn.DockNode.prototype.addChild = function(childNode)
{
    childNode.detachFromParent();
    childNode.parent = this;
    this.children.push(childNode);
};

dockspawn.DockNode.prototype.addChildBefore = function(referenceNode, childNode)
{
    this._addChildWithDirection(referenceNode, childNode, true);
};

dockspawn.DockNode.prototype.addChildAfter = function(referenceNode, childNode)
{
    this._addChildWithDirection(referenceNode, childNode, false);
};

dockspawn.DockNode.prototype._addChildWithDirection = function(referenceNode, childNode, before)
{
    // Detach this node from it's parent first
    childNode.detachFromParent();
    childNode.parent = this;

    var referenceIndex = this.children.indexOf(referenceNode);
    var preList = this.children.slice(0, referenceIndex);
    var postList = this.children.slice(referenceIndex + 1, this.children.length);

    this.children = preList.slice(0);
    if (before)
    {
        this.children.push(childNode);
        this.children.push(referenceNode);
    }
    else
    {
        this.children.push(referenceNode);
        this.children.push(childNode);
    }
    Array.prototype.push.apply(this.children, postList);
};

dockspawn.DockNode.prototype.performLayout = function()
{
    var childContainers = this.children.map(function(childNode) { return childNode.container; });
    this.container.performLayout(childContainers);
};

dockspawn.DockNode.prototype.debug_DumpTree = function(indent)
{
    if (indent === undefined)
        indent = 0;

    var message = this.container.name;
    for (var i = 0; i < indent; i++)
        message = "\t" + message;

    var parentType = this.parent === undefined ? "null" : this.parent.container.containerType;
    console.log(">>" + message + " [" + parentType + "]");

    this.children.forEach(function(childNode) { childNode.debug_DumpTree(indent + 1) });
};
/**
 * Manages the dock overlay buttons that are displayed over the dock manager
 */
dockspawn.DockWheel = function(dockManager)
{
    this.dockManager = dockManager;
    this.elementMainWheel = document.createElement("div");    // Contains the main wheel's 5 dock buttons
    this.elementSideWheel = document.createElement("div");    // Contains the 4 buttons on the side
    this.wheelItems = {};
    var wheelTypes = [
        "left", "right", "top", "down", "fill",     // Main dock wheel buttons
        "left-s", "right-s", "top-s", "down-s"      // Buttons on the extreme 4 sides
    ];
    var self = this;
    wheelTypes.forEach(function(wheelType)
    {
        self.wheelItems[wheelType] = new DockWheelItem(self, wheelType);
        if (wheelType.substr(-2, 2) == "-s")
            // Side button
            self.elementSideWheel.appendChild(self.wheelItems[wheelType].element);
        else
            // Main dock wheel button
            self.elementMainWheel.appendChild(self.wheelItems[wheelType].element);
    });

    var zIndex = 100000;
    this.elementMainWheel.classList.add("dock-wheel-base");
    this.elementSideWheel.classList.add("dock-wheel-base");
    this.elementMainWheel.style.zIndex = zIndex + 1;
    this.elementSideWheel.style.zIndex = zIndex;
    this.elementPanelPreview = document.createElement("div");  // Used for showing the preview of where the panel would be docked
    this.elementPanelPreview.classList.add("dock-wheel-panel-preview");
    this.elementPanelPreview.style.zIndex = zIndex - 1;
    this.activeDialog = undefined;  // The dialog being dragged, when the wheel is visible
    this._activeNode = undefined;
    this._visible = false;
};

/** The node over which the dock wheel is being displayed on */
Object.defineProperty(dockspawn.DockWheel.prototype, "activeNode", {
    get: function() { return this._activeNode; },
    set: function(value)
    {
        var previousValue = this._activeNode;
        this._activeNode = value;

        if (previousValue !== this._activeNode)
        {
            // The active node has been changed.
            // Reattach the wheel to the new node's element and show it again
            if (this._visible)
                this.showWheel();
        }
    }
});

dockspawn.DockWheel.prototype.showWheel = function()
{
    this._visible = true;
    if (!this.activeNode)
    {
        // No active node selected. make sure the wheel is invisible
        removeNode(this.elementMainWheel);
        removeNode(this.elementSideWheel);
        return;
    }

    var element = this.activeNode.container.containerElement;
    var ignore = function (ele) {
        return ele === this.dockManager.context.documentManagerView.element ||
            ele === this.dockManager.context.model.rootNode.container.containerElement;
    }.call(this, element);

    // 定制需求：如果是 document-manager，则不显示 main wheel
    removeNode(this.elementMainWheel);
    if(!ignore) {
        var containerWidth = element.clientWidth;
        var containerHeight = element.clientHeight;
        var baseX = Math.floor(containerWidth / 2) + element.offsetLeft;
        var baseY = Math.floor(containerHeight / 2) + element.offsetTop;
        this.elementMainWheel.style.left = baseX + "px";
        this.elementMainWheel.style.top = baseY + "px";

        element.appendChild(this.elementMainWheel);
    }

    // The positioning of the main dock wheel buttons is done automatically through CSS
    // Dynamically calculate the positions of the buttons on the extreme sides of the dock manager
    var sideMargin = 20;
    var dockManagerWidth = this.dockManager.element.clientWidth;
    var dockManagerHeight = this.dockManager.element.clientHeight;
    var dockManagerOffsetX = this.dockManager.element.offsetLeft;
    var dockManagerOffsetY = this.dockManager.element.offsetTop;

    removeNode(this.elementSideWheel);
    this.dockManager.element.appendChild(this.elementSideWheel);

    if(!ignore) {
        this._setWheelButtonPosition("top-s",    dockManagerWidth / 2, -dockManagerHeight + sideMargin);
        this._setWheelButtonPosition("down-s",   dockManagerWidth / 2, -sideMargin);
    } else {
        // remove them
        removeNode(this.wheelItems['top-s'].element);
        removeNode(this.wheelItems['down-s'].element);
    }
    this._setWheelButtonPosition("left-s",   sideMargin, -dockManagerHeight / 2);
    this._setWheelButtonPosition("right-s",  dockManagerWidth - sideMargin * 2, -dockManagerHeight / 2);
};

dockspawn.DockWheel.prototype._setWheelButtonPosition = function(wheelId, left, top)
{
    var item = this.wheelItems[wheelId];
    var itemHalfWidth = item.element.clientWidth / 2;
    var itemHalfHeight = item.element.clientHeight / 2;

    var x = Math.floor(left - itemHalfWidth);
    var y = Math.floor(top - itemHalfHeight);
//    item.element.style.left = "${x}px";
//    item.element.style.top = "${y}px";
    item.element.style.marginLeft = x + "px";
    item.element.style.marginTop = y + "px";
};

dockspawn.DockWheel.prototype.hideWheel = function()
{
    this._visible = false;
    this.activeNode = undefined;
    removeNode(this.elementMainWheel);
    removeNode(this.elementSideWheel);
    removeNode(this.elementPanelPreview);

    // deactivate all wheels
    for (var wheelType in this.wheelItems)
        this.wheelItems[wheelType].active = false;
};

dockspawn.DockWheel.prototype.onMouseOver = function(wheelItem, e)
{
    if (!this.activeDialog)
        return;

    // Display the preview panel to show where the panel would be docked
    var rootNode = this.dockManager.context.model.rootNode;
    var bounds;
    if (wheelItem.id == "top") {
        bounds = this.dockManager.layoutEngine.getDockBounds(this.activeNode, this.activeDialog.panel, "vertical", true);
    } else if (wheelItem.id == "down") {
        bounds = this.dockManager.layoutEngine.getDockBounds(this.activeNode, this.activeDialog.panel, "vertical", false);
    } else if (wheelItem.id == "left") {
        bounds = this.dockManager.layoutEngine.getDockBounds(this.activeNode, this.activeDialog.panel, "horizontal", true);
    } else if (wheelItem.id == "right") {
        bounds = this.dockManager.layoutEngine.getDockBounds(this.activeNode, this.activeDialog.panel, "horizontal", false);
    } else if (wheelItem.id == "fill") {
        bounds = this.dockManager.layoutEngine.getDockBounds(this.activeNode, this.activeDialog.panel, "fill", false);
    } else if (wheelItem.id == "top-s") {
        bounds = this.dockManager.layoutEngine.getDockBounds(rootNode, this.activeDialog.panel, "vertical", true);
    } else if (wheelItem.id == "down-s") {
        bounds = this.dockManager.layoutEngine.getDockBounds(rootNode, this.activeDialog.panel, "vertical", false);
    } else if (wheelItem.id == "left-s") {
        bounds = this.dockManager.layoutEngine.getDockBounds(rootNode, this.activeDialog.panel, "horizontal", true);
    } else if (wheelItem.id == "right-s") {
        bounds = this.dockManager.layoutEngine.getDockBounds(rootNode, this.activeDialog.panel, "horizontal", false);
    }

    if (bounds)
    {
        this.dockManager.element.appendChild(this.elementPanelPreview);
        this.elementPanelPreview.style.left = Math.round(bounds.x) + "px";
        this.elementPanelPreview.style.top = Math.round(bounds.y) + "px";
        this.elementPanelPreview.style.width = Math.round(bounds.width) + "px";
        this.elementPanelPreview.style.height = Math.round(bounds.height) + "px";
    }
};

dockspawn.DockWheel.prototype.onMouseOut = function(wheelItem, e)
{
    removeNode(this.elementPanelPreview);
};

/**
 * Called if the dialog is dropped in a dock panel.
 * The dialog might not necessarily be dropped in one of the dock wheel buttons,
 * in which case the request will be ignored
 */
dockspawn.DockWheel.prototype.onDialogDropped = function(dialog)
{
    // Check if the dialog was dropped in one of the wheel items
    var wheelItem = this._getActiveWheelItem();
    if (wheelItem)
        this._handleDockRequest(wheelItem, dialog);
};

/**
 * Returns the wheel item which has the mouse cursor on top of it
 */
dockspawn.DockWheel.prototype._getActiveWheelItem = function()
{
    for (var wheelType in this.wheelItems)
    {
        var wheelItem = this.wheelItems[wheelType];
        if (wheelItem.active)
            return wheelItem;
    }
    return undefined;
};

dockspawn.DockWheel.prototype._handleDockRequest = function(wheelItem, dialog)
{
    if (!this.activeNode)
        return;
    if (wheelItem.id == "left") {
        this.dockManager.dockDialogLeft(this.activeNode, dialog);
    } else if (wheelItem.id == "right") {
        this.dockManager.dockDialogRight(this.activeNode, dialog);
    } else if (wheelItem.id == "top") {
        this.dockManager.dockDialogUp(this.activeNode, dialog);
    } else if (wheelItem.id == "down") {
        this.dockManager.dockDialogDown(this.activeNode, dialog);
    } else if (wheelItem.id == "fill") {
        this.dockManager.dockDialogFill(this.activeNode, dialog);
    } else if (wheelItem.id == "left-s") {
        this.dockManager.dockDialogLeft(this.dockManager.context.model.rootNode, dialog);
    } else if (wheelItem.id == "right-s") {
        this.dockManager.dockDialogRight(this.dockManager.context.model.rootNode, dialog);
    } else if (wheelItem.id == "top-s") {
        this.dockManager.dockDialogUp(this.dockManager.context.model.rootNode, dialog);
    } else if (wheelItem.id == "down-s") {
        this.dockManager.dockDialogDown(this.dockManager.context.model.rootNode, dialog);
    }
};

function DockWheelItem(wheel, id)
{
    this.wheel = wheel;
    this.id = id;
    var wheelType = id.replace("-s", "");
    this.element = document.createElement("div");
    this.element.classList.add("dock-wheel-item");
    this.element.classList.add("disable-selection");
    this.element.classList.add("dock-wheel-" + wheelType);
    this.element.classList.add("dock-wheel-" + wheelType + "-icon");
    this.hoverIconClass = "dock-wheel-" + wheelType + "-icon-hover";
    this.mouseOverHandler = new dockspawn.EventHandler(this.element, 'mouseover', this.onMouseMoved.bind(this));
    this.mouseOutHandler = new dockspawn.EventHandler(this.element, 'mouseout', this.onMouseOut.bind(this));
    this.active = false;    // Becomes active when the mouse is hovered over it
};

DockWheelItem.prototype.onMouseMoved = function(e)
{
    this.active = true;
    this.element.classList.add(this.hoverIconClass);
    this.wheel.onMouseOver(this, e);
};

DockWheelItem.prototype.onMouseOut = function(e)
{
    this.active = false;
    this.element.classList.remove(this.hoverIconClass);
    this.wheel.onMouseOut(this, e);
};

dockspawn.FillDockContainer = function(dockManager, tabStripDirection)
{
    if (arguments.length == 0)
        return;

    if (tabStripDirection === undefined)
        tabStripDirection = dockspawn.TabHost.DIRECTION_BOTTOM;

    this.dockManager = dockManager;
    this.tabOrientation = tabStripDirection;
    this.name = getNextId("fill_");
    this.element = document.createElement("div");
    this.containerElement = this.element;
    this.containerType = "fill";
    this.minimumAllowedChildNodes = 2;
    this.element.classList.add("dock-container");
    this.element.classList.add("dock-container-fill");
    this.tabHost = new dockspawn.TabHost(this.tabOrientation);
    this.element.appendChild(this.tabHost.hostElement);
}

dockspawn.FillDockContainer.prototype.setActiveChild = function(child)
{
    this.tabHost.setActiveTab(child);
};

dockspawn.FillDockContainer.prototype.resize = function(width, height)
{
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";
    this.tabHost.resize(width, height);
};

dockspawn.FillDockContainer.prototype.performLayout = function(children)
{
    this.tabHost.performLayout(children);
};

dockspawn.FillDockContainer.prototype.destroy = function()
{
    if (removeNode(this.element))
        delete this.element;
};

dockspawn.FillDockContainer.prototype.saveState = function(state)
{
    state.width = this.width;
    state.height = this.height;
};

dockspawn.FillDockContainer.prototype.loadState = function(state)
{
    this.width = state.width;
    this.height = state.height;
};

Object.defineProperty(dockspawn.FillDockContainer.prototype, "width", {
    get: function() { return this.element.clientWidth; },
    set: function(value) { this.element.style.width = value + "px" }
});

Object.defineProperty(dockspawn.FillDockContainer.prototype, "height", {
    get: function() { return this.element.clientHeight; },
    set: function(value) { this.element.style.height = value + "px" }
});

/**
 * The document manager is then central area of the dock layout hierarchy.
 * This is where more important panels are placed (e.g. the text editor in an IDE,
 * 3D view in a modelling package etc
 */
dockspawn.DocumentManagerContainer = function(dockManager)
{
    dockspawn.FillDockContainer.call(this, dockManager, dockspawn.TabHost.DIRECTION_TOP);
    this.minimumAllowedChildNodes = 0;
    this.element.classList.add("document-manager");
    this.tabHost.createTabPage = this._createDocumentTabPage;
    this.tabHost.displayCloseButton = true;
};
dockspawn.DocumentManagerContainer.prototype = new dockspawn.FillDockContainer();
dockspawn.DocumentManagerContainer.prototype.constructor = dockspawn.DocumentManagerContainer;

dockspawn.DocumentManagerContainer.prototype._createDocumentTabPage = function(tabHost, container)
{
    return new dockspawn.DocumentTabPage(tabHost, container);
};

dockspawn.DocumentManagerContainer.prototype.saveState = function(state)
{
    dockspawn.FillDockContainer.prototype.saveState.call(this, state);
    state.documentManager = true;
};

/** Returns the selected document tab */
dockspawn.DocumentManagerContainer.prototype.selectedTab = function()
{
    return this.tabHost.activeTab;
};

/**
 * Specialized tab page that doesn't display the panel's frame when docked in a tab page
 */
dockspawn.DocumentTabPage = function(host, container)
{
    dockspawn.TabPage.call(this, host, container);

    // If the container is a panel, extract the content element and set it as the tab's content
    if (this.container.containerType == "panel")
    {
        this.panel = container;
        this.containerElement = this.panel.elementContent;

        // detach the container element from the panel's frame.
        // It will be reattached when this tab page is destroyed
        // This enables the panel's frame (title bar etc) to be hidden
        // inside the tab page
        removeNode(this.containerElement);
    }
};
dockspawn.DocumentTabPage.prototype = new dockspawn.TabPage();
dockspawn.DocumentTabPage.prototype.constructor = dockspawn.DocumentTabPage;

dockspawn.DocumentTabPage.prototype.destroy = function()
{
    dockspawn.TabPage.prototype.destroy.call(this);

    // Restore the panel content element back into the panel frame
    removeNode(this.containerElement);
    this.panel.elementContentHost.appendChild(this.containerElement);
};
/**
 * A splitter panel manages the child containers inside it with splitter bars.
 * It can be stacked horizontally or vertically
 */
dockspawn.SplitterPanel = function(childContainers, stackedVertical)
{
    this.childContainers = childContainers;
    this.stackedVertical = stackedVertical;
    this.panelElement = document.createElement('div');
    this.spiltterBars = [];
    this._buildSplitterDOM();
};

dockspawn.SplitterPanel.prototype._buildSplitterDOM = function()
{
    if (this.childContainers.length <= 1)
        throw new dockspawn.Exception("Splitter panel should contain atleast 2 panels");

    this.spiltterBars = [];
    for (var i = 0; i < this.childContainers.length - 1; i++)
    {
        var previousContainer = this.childContainers[i];
        var nextContainer = this.childContainers[i + 1];
        var splitterBar = new dockspawn.SplitterBar(previousContainer, nextContainer, this.stackedVertical);
        this.spiltterBars.push(splitterBar);

        // Add the container and split bar to the panel's base div element
        this._insertContainerIntoPanel(previousContainer);
        this.panelElement.appendChild(splitterBar.barElement);
    }
    this._insertContainerIntoPanel(this.childContainers.slice(-1)[0]);
};

dockspawn.SplitterPanel.prototype.performLayout = function(children)
{
    this.removeFromDOM();

    // rebuild
    this.childContainers = children;
    this._buildSplitterDOM();
};

dockspawn.SplitterPanel.prototype.removeFromDOM = function()
{
    this.childContainers.forEach(function(container)
    {
        if (container.containerElement)
        {
            container.containerElement.classList.remove("splitter-container-vertical");
            container.containerElement.classList.remove("splitter-container-horizontal");
            removeNode(container.containerElement);
        }
    });
    this.spiltterBars.forEach(function(bar) { removeNode(bar.barElement); });
};

dockspawn.SplitterPanel.prototype.destroy = function()
{
    this.removeFromDOM();
    this.panelElement.parentNode.removeChild(this.panelElement);
};

dockspawn.SplitterPanel.prototype._insertContainerIntoPanel = function(container)
{
    if (!container)
    {
        console.log('undefined');
    }

    removeNode(container.containerElement);
    this.panelElement.appendChild(container.containerElement);
    container.containerElement.classList.add(this.stackedVertical ? "splitter-container-vertical" : "splitter-container-horizontal");
};

/**
 * Sets the percentage of space the specified [container] takes in the split panel
 * The percentage is specified in [ratio] and is between 0..1
 * The pixal in [ratio] and is greater than 1
 */
dockspawn.SplitterPanel.prototype.setContainerRatio = function(container, ratio)
{
    var splitPanelSize = this.stackedVertical ? this.panelElement.clientHeight : this.panelElement.clientWidth;
    var newContainerSize = ratio > 1? ratio : splitPanelSize * ratio;
    var barSize = this.stackedVertical ? this.spiltterBars[0].barElement.clientHeight : this.spiltterBars[0].barElement.clientWidth;

    var otherPanelSizeQuota = splitPanelSize - newContainerSize - barSize * this.spiltterBars.length;
    var otherPanelScaleMultipler = otherPanelSizeQuota / splitPanelSize;

    for (var i = 0; i < this.childContainers.length; i++)
    {
        var child = this.childContainers[i];
        var size;
        if (child !== container)
        {
            size = this.stackedVertical ? child.containerElement.clientHeight : child.containerElement.clientWidth;
            size *= otherPanelScaleMultipler;
        }
        else
            size = newContainerSize;

        if (this.stackedVertical)
            child.resize(child.width, Math.floor(size));
        else
            child.resize(Math.floor(size), child.height);
    }
};

dockspawn.SplitterPanel.prototype.resize = function(width, height)
{
    if (this.childContainers.length <= 1)
        return;

    // Adjust the fixed dimension that is common to all (i.e. width, if stacked vertical; height, if stacked horizontally)
    for (var i = 0; i < this.childContainers.length; i++)
    {
        var childContainer = this.childContainers[i];
        if (this.stackedVertical)
            childContainer.resize(width, childContainer.height);
        else
            childContainer.resize(childContainer.width, height);

        if (i < this.spiltterBars.length) {
            var splitBar = this.spiltterBars[i];
            if (this.stackedVertical)
                splitBar.barElement.style.width = width + "px";
            else
                splitBar.barElement.style.height = height + "px";
        }
    }

    // Adjust the varying dimension
    var totalChildPanelSize = 0;
    // Find out how much space existing child containers take up (excluding the splitter bars)
    var self = this;
    this.childContainers.forEach(function(container)
    {
        var size = self.stackedVertical ?
            container.height :
            container.width;
        totalChildPanelSize += size;
    });

    // Get the thickness of the bar
    var barSize = this.stackedVertical ? 
        this.spiltterBars[0].barElement.getBoundingClientRect().height :
        this.spiltterBars[0].barElement.getBoundingClientRect().width;
        // this.spiltterBars[0].barElement.clientHeight : 
        // this.spiltterBars[0].barElement.clientWidth;

    // Find out how much space existing child containers will take after being resized (excluding the splitter bars)
    var targetTotalChildPanelSize = this.stackedVertical ? height : width;
    targetTotalChildPanelSize -= barSize * this.spiltterBars.length;

    // Get the scale multiplier
    totalChildPanelSize = Math.max(totalChildPanelSize, 1);
    var scaleMultiplier = targetTotalChildPanelSize / totalChildPanelSize;

    // Update the size with this multiplier
    var updatedTotalChildPanelSize = 0;
    for (var i = 0; i < this.childContainers.length; i++)
    {
        var child = this.childContainers[i];
        var original = this.stackedVertical ?
            child.containerElement.clientHeight :
            child.containerElement.clientWidth;

        var newSize = Math.floor(original * scaleMultiplier);
        updatedTotalChildPanelSize += newSize;

        // If this is the last node, add any extra pixels to fix the rounding off errors and match the requested size
        if (i == this.childContainers.length - 1)
            newSize += targetTotalChildPanelSize - updatedTotalChildPanelSize;

        // Set the size of the panel
        if (this.stackedVertical)
            child.resize(child.width, newSize);
        else
            child.resize(newSize, child.height);
    }

    this.panelElement.style.width = width + "px";
    this.panelElement.style.height = height + "px";
};

dockspawn.SplitterDockContainer = function(name, dockManager, childContainers)
{
    // for prototype inheritance purposes only
    if (arguments.length == 0)
        return;

    this.name = name;
    this.dockManager = dockManager;
    this.splitterPanel = new dockspawn.SplitterPanel(childContainers, this.stackedVertical);
    this.containerElement = this.splitterPanel.panelElement;
    this.minimumAllowedChildNodes = 2;
}

dockspawn.SplitterDockContainer.prototype.resize = function(width, height)
{
//    if (_cachedWidth == _cachedWidth && _cachedHeight == _height) {
//      // No need to resize
//      return;
//    }
    this.splitterPanel.resize(width, height);
    this._cachedWidth = width;
    this._cachedHeight = height;
};

dockspawn.SplitterDockContainer.prototype.performLayout = function(childContainers)
{
    this.splitterPanel.performLayout(childContainers);
};

dockspawn.SplitterDockContainer.prototype.setActiveChild = function(child)
{
};

dockspawn.SplitterDockContainer.prototype.destroy = function()
{
    this.splitterPanel.destroy();
};

/**
 * Sets the percentage of space the specified [container] takes in the split panel
 * The percentage is specified in [ratio] and is between 0..1
 */
dockspawn.SplitterDockContainer.prototype.setContainerRatio = function(container, ratio)
{
    this.splitterPanel.setContainerRatio(container, ratio);
    this.resize(this.width, this.height);
};

dockspawn.SplitterDockContainer.prototype.saveState = function(state)
{
    state.width = this.width;
    state.height = this.height;
};

dockspawn.SplitterDockContainer.prototype.loadState = function(state)
{
    this.resize(state.width, state.height);
};

Object.defineProperty(dockspawn.SplitterDockContainer.prototype, "width", {
    get: function()
    {
        if (this._cachedWidth === undefined)
            this._cachedWidth = this.splitterPanel.panelElement.clientWidth;
        return this._cachedWidth;
    }
});

Object.defineProperty(dockspawn.SplitterDockContainer.prototype, "height", {
    get: function()
    {
        if (this._cachedHeight === undefined)
            this._cachedHeight = this.splitterPanel.panelElement.clientHeight;
        return this._cachedHeight;
    }
});

dockspawn.HorizontalDockContainer = function(dockManager, childContainers)
{
    this.stackedVertical = false;
    dockspawn.SplitterDockContainer.call(this, getNextId("horizontal_splitter_"), dockManager, childContainers);
    this.containerType = "horizontal";
};
dockspawn.HorizontalDockContainer.prototype = new dockspawn.SplitterDockContainer();
dockspawn.HorizontalDockContainer.prototype.constructor = dockspawn.HorizontalDockContainer;
/**
 * This dock container wraps the specified element on a panel frame with a title bar and close button
 */
dockspawn.PanelContainer = function(elementContent, dockManager, title)
{
    if (!title)
        title = "Panel";
    this.elementContent = elementContent;
    this.dockManager = dockManager;
    this.title = title;
    this.containerType = "panel";
    this.iconName = "icon-circle-arrow-right";
    this.minimumAllowedChildNodes = 0;
    this._floatingDialog = undefined;
    this._initialize();
};

Object.defineProperty(dockspawn.PanelContainer.prototype, "floatingDialog", {
    get: function() { return this._floatingDialog; },
    set: function(value)
    {
        this._floatingDialog = value;
        var canUndock = (this._floatingDialog === undefined);
        this.undockInitiator.enabled = canUndock;
    }
});

dockspawn.PanelContainer.loadFromState = function(state, dockManager)
{
    var elementName = state.element;
    var elementContent = document.getElementById(elementName);
    var ret = new dockspawn.PanelContainer(elementContent, dockManager);
    ret.elementContent = elementContent;
    ret._initialize();
    ret.loadState(state);
    return ret;
};

dockspawn.PanelContainer.prototype.saveState = function(state)
{
    state.element = this.elementContent.id;
    state.width = this.width;
    state.height = this.height;
};

dockspawn.PanelContainer.prototype.loadState = function(state)
{
    this.width = state.width;
    this.height = state.height;
    this.resize(this.width, this.height);
};

dockspawn.PanelContainer.prototype.setActiveChild = function(child)
{
};

Object.defineProperty(dockspawn.PanelContainer.prototype, "containerElement", {
    get: function() { return this.elementPanel; }
});

dockspawn.PanelContainer.prototype._initialize = function()
{
    this.name = getNextId("panel_");
    this.elementPanel = document.createElement('div');
    this.elementTitle = document.createElement('div');
    this.elementTitleText = document.createElement('div');
    this.elementContentHost = document.createElement('div');
    this.elementButtonClose = document.createElement('div');

    this.elementPanel.appendChild(this.elementTitle);
    this.elementTitle.appendChild(this.elementTitleText);
    this.elementTitle.appendChild(this.elementButtonClose);
    this.elementButtonClose.innerHTML = '<i class="glyphicon glyphicon-remove"></i>';
    this.elementButtonClose.classList.add("panel-titlebar-button-close");
    this.elementPanel.appendChild(this.elementContentHost);

    this.elementPanel.classList.add("panel-base");
    this.elementTitle.classList.add("panel-titlebar");
    this.elementTitle.classList.add("disable-selection");
    this.elementTitleText.classList.add("panel-titlebar-text");
    this.elementContentHost.classList.add("panel-content");

    // set the size of the dialog elements based on the panel's size
    var panelWidth = this.elementContent.clientWidth;
    var panelHeight = this.elementContent.clientHeight;
    var titleHeight = this.elementTitle.clientHeight;
    this._setPanelDimensions(panelWidth, panelHeight + titleHeight);

    // Add the panel to the body
    document.body.appendChild(this.elementPanel);

    this.closeButtonClickedHandler = new dockspawn.EventHandler(this.elementButtonClose, 'click', this.onCloseButtonClicked.bind(this));

    removeNode(this.elementContent);
    this.elementContentHost.appendChild(this.elementContent);

    // Extract the title from the content element's attribute
    var contentTitle = this.elementContent.getAttribute('caption');
    var contentIcon = this.elementContent.getAttribute('icon');
    if (contentTitle != null) this.title = contentTitle;
    if (contentIcon != null) this.iconName = contentIcon;
    this._updateTitle();

    this.undockInitiator = new dockspawn.UndockInitiator(this.elementTitle, this.performUndockToDialog.bind(this));
    this.floatingDialog = undefined;
};

dockspawn.PanelContainer.prototype.destroy = function()
{
    removeNode(this.elementPanel);
    if (this.closeButtonClickedHandler)
    {
        this.closeButtonClickedHandler.cancel();
        delete this.closeButtonClickedHandler;
    }
};

/**
 * Undocks the panel and and converts it to a dialog box
 */
dockspawn.PanelContainer.prototype.performUndockToDialog = function(e, dragOffset)
{
    this.undockInitiator.enabled = false;
    return this.dockManager.requestUndockToDialog(this, e, dragOffset);
};

/**
 * Undocks the container and from the layout hierarchy
 * The container would be removed from the DOM
 */
dockspawn.PanelContainer.prototype.performUndock = function()
{
    this.undockInitiator.enabled = false;
    this.dockManager.requestUndock(this);
};

dockspawn.PanelContainer.prototype.prepareForDocking = function()
{
    this.undockInitiator.enabled = true;
};

Object.defineProperty(dockspawn.PanelContainer.prototype, "width", {
    get: function() { return this._cachedWidth; },
    set: function(value)
    {
        if (value !== this._cachedWidth)
        {
            this._cachedWidth = value;
            this.elementPanel.style.width = value + "px";
        }
    }
});

Object.defineProperty(dockspawn.PanelContainer.prototype, "height", {
    get: function() { return this._cachedHeight; },
    set: function(value)
    {
        if (value !== this._cachedHeight)
        {
            this._cachedHeight = value;
            this.elementPanel.style.height = value + "px";
        }
    }
});

dockspawn.PanelContainer.prototype.resize = function(width,  height)
{
    if (this._cachedWidth == width && this._cachedHeight == height)
    {
        // Already in the desired size
        return;
    }
    this._setPanelDimensions(width, height);
    this._cachedWidth = width;
    this._cachedHeight = height;
};

dockspawn.PanelContainer.prototype._setPanelDimensions = function(width, height)
{
    this.elementTitle.style.width = width + "px";
    this.elementContentHost.style.width = width + "px";
    this.elementContent.style.width = width + "px";
    this.elementPanel.style.width = width + "px";

    var titleBarHeight = this.elementTitle.clientHeight;
    var contentHeight = height - titleBarHeight;
    this.elementContentHost.style.height = contentHeight + "px";
    this.elementContent.style.height = contentHeight + "px";
    this.elementPanel.style.height = height + "px";
};

dockspawn.PanelContainer.prototype.setTitle = function(title)
{
    this.title = title;
    this._updateTitle();
    if (this.onTitleChanged)
        this.onTitleChanged(this, title);
};

dockspawn.PanelContainer.prototype.setTitleIcon = function(iconName)
{
    this.iconName = iconName;
    this._updateTitle();
};

dockspawn.PanelContainer.prototype._updateTitle = function()
{
    this.elementTitleText.innerHTML = '<i class="' + this.iconName + '"></i> ' + this.title;
};

dockspawn.PanelContainer.prototype.getRawTitle = function()
{
    return this.elementTitleText.innerHTML;
};

dockspawn.PanelContainer.prototype.performLayout = function(children)
{
};

dockspawn.PanelContainer.prototype.onCloseButtonClicked = function(e)
{
    if (this.floatingDialog)
        this.floatingDialog.destroy();
    else
    {
        this.performUndock();
        this.destroy();
    }
};

dockspawn.VerticalDockContainer = function(dockManager, childContainers)
{
    this.stackedVertical = true;
    dockspawn.SplitterDockContainer.call(this, getNextId("vertical_splitter_"), dockManager, childContainers);
    this.containerType = "vertical";
};
dockspawn.VerticalDockContainer.prototype = new dockspawn.SplitterDockContainer();
dockspawn.VerticalDockContainer.prototype.constructor = dockspawn.VerticalDockContainer;
dockspawn.SplitterBar = function(previousContainer, nextContainer, stackedVertical)
{
    this.previousContainer = previousContainer; // The panel to the left/top side of the bar, depending on the bar orientation
    this.nextContainer = nextContainer;         // The panel to the right/bottom side of the bar, depending on the bar orientation
    this.stackedVertical = stackedVertical;
    this.barElement = document.createElement('div');
    this.barElement.classList.add(stackedVertical ? "splitbar-horizontal" : "splitbar-vertical");
    this.mouseDownHandler = new dockspawn.EventHandler(this.barElement, 'mousedown', this.onMouseDown.bind(this));
    this.minPanelSize = 50; // TODO: Get from container configuration
    this.readyToProcessNextDrag = true;
};

dockspawn.SplitterBar.prototype.onMouseDown = function(e)
{
    this._startDragging(e);
};

dockspawn.SplitterBar.prototype.onMouseUp = function(e)
{
    this._stopDragging(e);
};

dockspawn.SplitterBar.prototype.onMouseMoved = function(e)
{
    if (!this.readyToProcessNextDrag)
        return;
    this.readyToProcessNextDrag = false;

    var dockManager = this.previousContainer.dockManager;
    dockManager.suspendLayout();
    var dx = e.pageX - this.previousMouseEvent.pageX;
    var dy = e.pageY - this.previousMouseEvent.pageY;
    this._performDrag(dx, dy);
    this.previousMouseEvent = e;
    this.readyToProcessNextDrag = true;
    dockManager.resumeLayout();
};

dockspawn.SplitterBar.prototype._performDrag = function(dx, dy)
{
    var previousWidth = this.previousContainer.containerElement.clientWidth;
    var previousHeight = this.previousContainer.containerElement.clientHeight;
    var nextWidth = this.nextContainer.containerElement.clientWidth;
    var nextHeight = this.nextContainer.containerElement.clientHeight;

    var previousPanelSize = this.stackedVertical ? previousHeight : previousWidth;
    var nextPanelSize = this.stackedVertical ? nextHeight : nextWidth;
    var deltaMovement = this.stackedVertical ? dy : dx;
    var newPreviousPanelSize = previousPanelSize + deltaMovement;
    var newNextPanelSize = nextPanelSize - deltaMovement;

    if (newPreviousPanelSize < this.minPanelSize || newNextPanelSize < this.minPanelSize)
    {
        // One of the panels is smaller than it should be.
        // In that case, check if the small panel's size is being increased
        var continueProcessing = (newPreviousPanelSize < this.minPanelSize && newPreviousPanelSize > previousPanelSize) ||
            (newNextPanelSize < this.minPanelSize && newNextPanelSize > nextPanelSize);

        if (!continueProcessing)
            return;
    }

    if (this.stackedVertical)
    {
        this.previousContainer.resize(previousWidth, newPreviousPanelSize);
        this.nextContainer.resize(nextWidth, newNextPanelSize);
    }
    else
    {
        this.previousContainer.resize(newPreviousPanelSize, previousHeight);
        this.nextContainer.resize(newNextPanelSize, nextHeight);
    }
};

dockspawn.SplitterBar.prototype._startDragging = function(e)
{
    disableGlobalTextSelection();
    if (this.mouseMovedHandler)
    {
        this.mouseMovedHandler.cancel();
        delete this.mouseMovedHandler;
    }
    if (this.mouseUpHandler)
    {
        this.mouseUpHandler.cancel();
        delete this.mouseUpHandler;
    }
    this.mouseMovedHandler = new dockspawn.EventHandler(window, 'mousemove', this.onMouseMoved.bind(this));
    this.mouseUpHandler = new dockspawn.EventHandler(window, 'mouseup', this.onMouseUp.bind(this));
    this.previousMouseEvent = e;
};

dockspawn.SplitterBar.prototype._stopDragging = function(e)
{
    enableGlobalTextSelection();
    document.body.classList.remove("disable-selection");
    if (this.mouseMovedHandler)
    {
        this.mouseMovedHandler.cancel();
        delete this.mouseMovedHandler;
    }
    if (this.mouseUpHandler)
    {
        this.mouseUpHandler.cancel();
        delete this.mouseUpHandler;
    }
};
/**
 * Deserializes the dock layout hierarchy from JSON and creates a dock hierarhcy graph
 */
dockspawn.DockGraphDeserializer = function(dockManager)
{
    this.dockManager = dockManager;
};

dockspawn.DockGraphDeserializer.prototype.deserialize = function(json)
{
    var graphInfo = JSON.parse(_json);
    var model = new dockspawn.DockModel();
    model.rootNode = this._buildGraph(graphInfo);
    return model;
};

dockspawn.DockGraphDeserializer.prototype._buildGraph = function(nodeInfo)
{
    var childrenInfo = nodeInfo.children;
    var children = [];
    var self = this;
    childrenInfo.forEach(function(childInfo)
    {
        var childNode = self._buildGraph(childInfo);
        children.push(childNode);
    });

    // Build the container owned by this node
    var container = this._createContainer(nodeInfo, children);

    // Build the node for this container and attach it's children
    var node = new dockspawn.DockNode(container);
    node.children = children;
    node.children.forEach(function(childNode) { childNode.parent = node; });

    return node;
};

dockspawn.DockGraphDeserializer.prototype._createContainer = function(nodeInfo, children)
{
    var containerType = nodeInfo.containerType;
    var containerState = nodeInfo.state;
    var container;

    var childContainers = [];
    children.forEach(function(childNode) { childContainers.push(childNode.container); });
    childContainers = [];

    if (containerType == "panel")
        container = new dockspawn.PanelContainer.loadFromState(containerState, this.dockManager);
    else if (containerType == "horizontal")
        container = new dockspawn.HorizontalDockContainer(this.dockManager, childContainers);
    else if (containerType == "vertical")
        container = new dockspawn.VerticalDockContainer(this.dockManager, childContainers);
    else if (containerType == "fill")
    {
        // Check if this is a document manager

        // TODO: Layout engine compares the string "fill", so cannot create another subclass type
        // called document_manager and have to resort to this hack. use RTTI in layout engine
        var typeDocumentManager = containerState.documentManager;
        if (typeDocumentManager)
            container = new DocumentManagerContainer(this.dockManager);
        else
            container = new dockspawn.FillDockContainer(this.dockManager);
    }
    else
        throw new dockspawn.Exception("Cannot create dock container of unknown type: " + containerType);

    // Restore the state of the container
    container.loadState(containerState);
    container.performLayout(childContainers);
    return container;
};
/**
 * The serializer saves / loads the state of the dock layout hierarchy
 */
dockspawn.DockGraphSerializer = function()
{
};

dockspawn.DockGraphSerializer.prototype.serialize = function(model)
{
    var graphInfo = this._buildGraphInfo(model.rootNode);
    return JSON.stringify(graphInfo);
};

dockspawn.DockGraphSerializer.prototype._buildGraphInfo = function(node)
{
    var nodeState = {};
    node.container.saveState(nodeState);

    var childrenInfo = [];
    var self = this;
    node.childNodes.forEach(function(childNode) {
        childrenInfo.push(self._buildGraphInfo(childNode));
    });

    var nodeInfo = {};
    nodeInfo.containerType = node.container.containerType;
    nodeInfo.state = nodeState;
    nodeInfo.children = childrenInfo;
    return nodeInfo;
};
function getPixels(pixels)
{
    if (pixels == null)
        return 0;
    return parseInt(pixels.replace("px", ""));
}

function disableGlobalTextSelection()
{
    document.body.classList.add("disable-selection");
}

function enableGlobalTextSelection()
{
    document.body.classList.remove("disable-selection");
}

function isPointInsideNode(px, py, node)
{
    var element = node.container.containerElement;
    var x = element.offsetLeft;
    var y = element.offsetTop;
    var width = element.clientWidth;
    var height = element.clientHeight;

    return (px >= x && px <= x + width && py >= y && py <= y + height);
}

function Rectangle()
{
//    num x;
//    num y;
//    num width;
//    num height;
}

function getNextId(prefix)
{
    return prefix + getNextId.counter++;
}
getNextId.counter = 0;

function removeNode(node)
{
    if (node.parentNode == null)
        return false;
    node.parentNode.removeChild(node);
    return true;
}

function Point(x, y)
{
    this.x = x;
    this.y = y;
}
dockspawn.EventHandler = function(source, eventName, target)
{
    // wrap the target
    this.target = target;
    this.eventName = eventName;
    this.source = source;

    this.source.addEventListener(eventName, this.target);
};

dockspawn.EventHandler.prototype.cancel = function()
{
    this.source.removeEventListener(this.eventName, this.target)
};
/**
 * Listens for events on the [element] and notifies the [listener]
 * if an undock event has been invoked.  An undock event is invoked
 * when the user clicks on the event and drags is beyond the
 * specified [thresholdPixels]
 */
dockspawn.UndockInitiator = function(element, listener, thresholdPixels)
{
    if (!thresholdPixels)
        thresholdPixels = 10;

    this.element = element;
    this.listener = listener;
    this.thresholdPixels = thresholdPixels;
    this._enabled = false;
};

Object.defineProperty(dockspawn.UndockInitiator.prototype, "enabled", {
    get: function() { return this._enabled; },
    set: function(value)
    {
        this._enabled = value;
        if (this._enabled)
        {
            if (this.mouseDownHandler)
            {
                this.mouseDownHandler.cancel();
                delete this.mouseDownHandler;
            }
            this.mouseDownHandler = new dockspawn.EventHandler(this.element, 'mousedown', this.onMouseDown.bind(this));
        }
        else
        {
            if (this.mouseDownHandler)
            {
                this.mouseDownHandler.cancel();
                delete this.mouseDownHandler;
            }
            if (this.mouseUpHandler)
            {
                this.mouseUpHandler.cancel();
                delete this.mouseUpHandler;
            }
            if (this.mouseMoveHandler)
            {
                this.mouseMoveHandler.cancel();
                delete this.mouseMoveHandler;
            }
        }
    }
});

dockspawn.UndockInitiator.prototype.onMouseDown = function(e)
{
    // Make sure we dont do this on floating dialogs
    if (this.enabled)
    {
        if (this.mouseUpHandler)
        {
            this.mouseUpHandler.cancel();
            delete this.mouseUpHandler;
        }
        if (this.mouseMoveHandler)
        {
            this.mouseMoveHandler.cancel();
            delete this.mouseMoveHandler;
        }
        this.mouseUpHandler = new dockspawn.EventHandler(window, 'mouseup', this.onMouseUp.bind(this));
        this.mouseMoveHandler = new dockspawn.EventHandler(window, 'mousemove', this.onMouseMove.bind(this));
        this.dragStartPosition = new Point(e.pageX, e.pageY);
    }
};

dockspawn.UndockInitiator.prototype.onMouseUp = function(e)
{
    if (this.mouseUpHandler)
    {
        this.mouseUpHandler.cancel();
        delete this.mouseUpHandler;
    }
    if (this.mouseMoveHandler)
    {
        this.mouseMoveHandler.cancel();
        delete this.mouseMoveHandler;
    }
};

dockspawn.UndockInitiator.prototype.onMouseMove = function(e)
{
    var position = new Point(e.pageX, e.pageY);
    var dx = position.x - this.dragStartPosition.x;
    var dy = position.y - this.dragStartPosition.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.thresholdPixels)
    {
        this.enabled = false;
        this._requestUndock(e);
    }
};

dockspawn.UndockInitiator.prototype._requestUndock = function(e)
{
    var dragOffsetX = this.dragStartPosition.x - this.element.offsetLeft;
    var dragOffsetY = this.dragStartPosition.y - this.element.offsetTop;
    var dragOffset = new Point(dragOffsetX, dragOffsetY);
    this.listener(e, dragOffset);
};

})();


/*
 * JQuery zTree core v3.5.19.1
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-10-26
 */
(function(q){var I,J,K,L,M,N,v,s={},w={},x={},O={treeId:"",treeObj:null,view:{addDiyDom:null,autoCancelSelected:!0,dblClickExpand:!0,expandSpeed:"fast",fontCss:{},nameIsHTML:!1,selectedMulti:!0,showIcon:!0,showLine:!0,showTitle:!0,txtSelectedEnable:!1},data:{key:{children:"children",name:"name",title:"",url:"url",icon:"icon"},simpleData:{enable:!1,idKey:"id",pIdKey:"pId",rootPId:null},keep:{parent:!1,leaf:!1}},async:{enable:!1,contentType:"application/x-www-form-urlencoded",type:"post",dataType:"text",
url:"",autoParam:[],otherParam:[],dataFilter:null},callback:{beforeAsync:null,beforeClick:null,beforeDblClick:null,beforeRightClick:null,beforeMouseDown:null,beforeMouseUp:null,beforeExpand:null,beforeCollapse:null,beforeRemove:null,onAsyncError:null,onAsyncSuccess:null,onNodeCreated:null,onClick:null,onDblClick:null,onRightClick:null,onMouseDown:null,onMouseUp:null,onExpand:null,onCollapse:null,onRemove:null}},y=[function(b){var a=b.treeObj,c=f.event;a.bind(c.NODECREATED,function(a,c,g){j.apply(b.callback.onNodeCreated,
[a,c,g])});a.bind(c.CLICK,function(a,c,g,m,h){j.apply(b.callback.onClick,[c,g,m,h])});a.bind(c.EXPAND,function(a,c,g){j.apply(b.callback.onExpand,[a,c,g])});a.bind(c.COLLAPSE,function(a,c,g){j.apply(b.callback.onCollapse,[a,c,g])});a.bind(c.ASYNC_SUCCESS,function(a,c,g,h){j.apply(b.callback.onAsyncSuccess,[a,c,g,h])});a.bind(c.ASYNC_ERROR,function(a,c,g,h,f,i){j.apply(b.callback.onAsyncError,[a,c,g,h,f,i])});a.bind(c.REMOVE,function(a,c,g){j.apply(b.callback.onRemove,[a,c,g])});a.bind(c.SELECTED,
function(a,c,g){j.apply(b.callback.onSelected,[c,g])});a.bind(c.UNSELECTED,function(a,c,g){j.apply(b.callback.onUnSelected,[c,g])})}],z=[function(b){var a=f.event;b.treeObj.unbind(a.NODECREATED).unbind(a.CLICK).unbind(a.EXPAND).unbind(a.COLLAPSE).unbind(a.ASYNC_SUCCESS).unbind(a.ASYNC_ERROR).unbind(a.REMOVE).unbind(a.SELECTED).unbind(a.UNSELECTED)}],A=[function(b){var a=h.getCache(b);a||(a={},h.setCache(b,a));a.nodes=[];a.doms=[]}],B=[function(b,a,c,d,e,g){if(c){var m=h.getRoot(b),f=b.data.key.children;
c.level=a;c.tId=b.treeId+"_"+ ++m.zId;c.parentTId=d?d.tId:null;c.open=typeof c.open=="string"?j.eqs(c.open,"true"):!!c.open;c[f]&&c[f].length>0?(c.isParent=!0,c.zAsync=!0):(c.isParent=typeof c.isParent=="string"?j.eqs(c.isParent,"true"):!!c.isParent,c.open=c.isParent&&!b.async.enable?c.open:!1,c.zAsync=!c.isParent);c.isFirstNode=e;c.isLastNode=g;c.getParentNode=function(){return h.getNodeCache(b,c.parentTId)};c.getPreNode=function(){return h.getPreNode(b,c)};c.getNextNode=function(){return h.getNextNode(b,
c)};c.getIndex=function(){return h.getNodeIndex(b,c)};c.getPath=function(){return h.getNodePath(b,c)};c.isAjaxing=!1;h.fixPIdKeyValue(b,c)}}],u=[function(b){var a=b.target,c=h.getSetting(b.data.treeId),d="",e=null,g="",m="",i=null,n=null,k=null;if(j.eqs(b.type,"mousedown"))m="mousedown";else if(j.eqs(b.type,"mouseup"))m="mouseup";else if(j.eqs(b.type,"contextmenu"))m="contextmenu";else if(j.eqs(b.type,"click"))if(j.eqs(a.tagName,"span")&&a.getAttribute("treeNode"+f.id.SWITCH)!==null)d=j.getNodeMainDom(a).id,
g="switchNode";else{if(k=j.getMDom(c,a,[{tagName:"a",attrName:"treeNode"+f.id.A}]))d=j.getNodeMainDom(k).id,g="clickNode"}else if(j.eqs(b.type,"dblclick")&&(m="dblclick",k=j.getMDom(c,a,[{tagName:"a",attrName:"treeNode"+f.id.A}])))d=j.getNodeMainDom(k).id,g="switchNode";if(m.length>0&&d.length==0&&(k=j.getMDom(c,a,[{tagName:"a",attrName:"treeNode"+f.id.A}])))d=j.getNodeMainDom(k).id;if(d.length>0)switch(e=h.getNodeCache(c,d),g){case "switchNode":e.isParent?j.eqs(b.type,"click")||j.eqs(b.type,"dblclick")&&
j.apply(c.view.dblClickExpand,[c.treeId,e],c.view.dblClickExpand)?i=I:g="":g="";break;case "clickNode":i=J}switch(m){case "mousedown":n=K;break;case "mouseup":n=L;break;case "dblclick":n=M;break;case "contextmenu":n=N}return{stop:!1,node:e,nodeEventType:g,nodeEventCallback:i,treeEventType:m,treeEventCallback:n}}],C=[function(b){var a=h.getRoot(b);a||(a={},h.setRoot(b,a));a[b.data.key.children]=[];a.expandTriggerFlag=!1;a.curSelectedList=[];a.noSelection=!0;a.createdNodes=[];a.zId=0;a._ver=(new Date).getTime()}],
D=[],E=[],F=[],G=[],H=[],h={addNodeCache:function(b,a){h.getCache(b).nodes[h.getNodeCacheId(a.tId)]=a},getNodeCacheId:function(b){return b.substring(b.lastIndexOf("_")+1)},addAfterA:function(b){E.push(b)},addBeforeA:function(b){D.push(b)},addInnerAfterA:function(b){G.push(b)},addInnerBeforeA:function(b){F.push(b)},addInitBind:function(b){y.push(b)},addInitUnBind:function(b){z.push(b)},addInitCache:function(b){A.push(b)},addInitNode:function(b){B.push(b)},addInitProxy:function(b,a){a?u.splice(0,0,
b):u.push(b)},addInitRoot:function(b){C.push(b)},addNodesData:function(b,a,c,d){var e=b.data.key.children;a[e]?c>=a[e].length&&(c=-1):(a[e]=[],c=-1);if(a[e].length>0&&c===0)a[e][0].isFirstNode=!1,i.setNodeLineIcos(b,a[e][0]);else if(a[e].length>0&&c<0)a[e][a[e].length-1].isLastNode=!1,i.setNodeLineIcos(b,a[e][a[e].length-1]);a.isParent=!0;c<0?a[e]=a[e].concat(d):(b=[c,0].concat(d),a[e].splice.apply(a[e],b))},addSelectedNode:function(b,a){var c=h.getRoot(b);h.isSelectedNode(b,a)||c.curSelectedList.push(a)},
addCreatedNode:function(b,a){(b.callback.onNodeCreated||b.view.addDiyDom)&&h.getRoot(b).createdNodes.push(a)},addZTreeTools:function(b){H.push(b)},exSetting:function(b){q.extend(!0,O,b)},fixPIdKeyValue:function(b,a){b.data.simpleData.enable&&(a[b.data.simpleData.pIdKey]=a.parentTId?a.getParentNode()[b.data.simpleData.idKey]:b.data.simpleData.rootPId)},getAfterA:function(b,a,c){for(var d=0,e=E.length;d<e;d++)E[d].apply(this,arguments)},getBeforeA:function(b,a,c){for(var d=0,e=D.length;d<e;d++)D[d].apply(this,
arguments)},getInnerAfterA:function(b,a,c){for(var d=0,e=G.length;d<e;d++)G[d].apply(this,arguments)},getInnerBeforeA:function(b,a,c){for(var d=0,e=F.length;d<e;d++)F[d].apply(this,arguments)},getCache:function(b){return x[b.treeId]},getNodeIndex:function(b,a){if(!a)return null;for(var c=b.data.key.children,d=a.parentTId?a.getParentNode():h.getRoot(b),e=0,g=d[c].length-1;e<=g;e++)if(d[c][e]===a)return e;return-1},getNextNode:function(b,a){if(!a)return null;for(var c=b.data.key.children,d=a.parentTId?
a.getParentNode():h.getRoot(b),e=0,g=d[c].length-1;e<=g;e++)if(d[c][e]===a)return e==g?null:d[c][e+1];return null},getNodeByParam:function(b,a,c,d){if(!a||!c)return null;for(var e=b.data.key.children,g=0,f=a.length;g<f;g++){if(a[g][c]==d)return a[g];var i=h.getNodeByParam(b,a[g][e],c,d);if(i)return i}return null},getNodeCache:function(b,a){if(!a)return null;var c=x[b.treeId].nodes[h.getNodeCacheId(a)];return c?c:null},getNodeName:function(b,a){return""+a[b.data.key.name]},getNodePath:function(b,a){if(!a)return null;
var c;(c=a.parentTId?a.getParentNode().getPath():[])&&c.push(a);return c},getNodeTitle:function(b,a){return""+a[b.data.key.title===""?b.data.key.name:b.data.key.title]},getNodes:function(b){return h.getRoot(b)[b.data.key.children]},getNodesByParam:function(b,a,c,d){if(!a||!c)return[];for(var e=b.data.key.children,g=[],f=0,i=a.length;f<i;f++)a[f][c]==d&&g.push(a[f]),g=g.concat(h.getNodesByParam(b,a[f][e],c,d));return g},getNodesByParamFuzzy:function(b,a,c,d){if(!a||!c)return[];for(var e=b.data.key.children,
g=[],d=d.toLowerCase(),f=0,i=a.length;f<i;f++)typeof a[f][c]=="string"&&a[f][c].toLowerCase().indexOf(d)>-1&&g.push(a[f]),g=g.concat(h.getNodesByParamFuzzy(b,a[f][e],c,d));return g},getNodesByFilter:function(b,a,c,d,e){if(!a)return d?null:[];for(var g=b.data.key.children,f=d?null:[],i=0,n=a.length;i<n;i++){if(j.apply(c,[a[i],e],!1)){if(d)return a[i];f.push(a[i])}var k=h.getNodesByFilter(b,a[i][g],c,d,e);if(d&&k)return k;f=d?k:f.concat(k)}return f},getPreNode:function(b,a){if(!a)return null;for(var c=
b.data.key.children,d=a.parentTId?a.getParentNode():h.getRoot(b),e=0,g=d[c].length;e<g;e++)if(d[c][e]===a)return e==0?null:d[c][e-1];return null},getRoot:function(b){return b?w[b.treeId]:null},getRoots:function(){return w},getSetting:function(b){return s[b]},getSettings:function(){return s},getZTreeTools:function(b){return(b=this.getRoot(this.getSetting(b)))?b.treeTools:null},initCache:function(b){for(var a=0,c=A.length;a<c;a++)A[a].apply(this,arguments)},initNode:function(b,a,c,d,e,g){for(var f=
0,h=B.length;f<h;f++)B[f].apply(this,arguments)},initRoot:function(b){for(var a=0,c=C.length;a<c;a++)C[a].apply(this,arguments)},isSelectedNode:function(b,a){for(var c=h.getRoot(b),d=0,e=c.curSelectedList.length;d<e;d++)if(a===c.curSelectedList[d])return!0;return!1},removeNodeCache:function(b,a){var c=b.data.key.children;if(a[c])for(var d=0,e=a[c].length;d<e;d++)arguments.callee(b,a[c][d]);h.getCache(b).nodes[h.getNodeCacheId(a.tId)]=null},removeSelectedNode:function(b,a){for(var c=h.getRoot(b),d=
0,e=c.curSelectedList.length;d<e;d++)if(a===c.curSelectedList[d]||!h.getNodeCache(b,c.curSelectedList[d].tId))c.curSelectedList.splice(d,1),b.treeObj.trigger(f.event.UNSELECTED,[b.treeId,a]),d--,e--},setCache:function(b,a){x[b.treeId]=a},setRoot:function(b,a){w[b.treeId]=a},setZTreeTools:function(b,a){for(var c=0,d=H.length;c<d;c++)H[c].apply(this,arguments)},transformToArrayFormat:function(b,a){if(!a)return[];var c=b.data.key.children,d=[];if(j.isArray(a))for(var e=0,g=a.length;e<g;e++)d.push(a[e]),
a[e][c]&&(d=d.concat(h.transformToArrayFormat(b,a[e][c])));else d.push(a),a[c]&&(d=d.concat(h.transformToArrayFormat(b,a[c])));return d},transformTozTreeFormat:function(b,a){var c,d,e=b.data.simpleData.idKey,g=b.data.simpleData.pIdKey,f=b.data.key.children;if(!e||e==""||!a)return[];if(j.isArray(a)){var h=[],i=[];for(c=0,d=a.length;c<d;c++)i[a[c][e]]=a[c];for(c=0,d=a.length;c<d;c++)i[a[c][g]]&&a[c][e]!=a[c][g]?(i[a[c][g]][f]||(i[a[c][g]][f]=[]),i[a[c][g]][f].push(a[c])):h.push(a[c]);return h}else return[a]}},
l={bindEvent:function(b){for(var a=0,c=y.length;a<c;a++)y[a].apply(this,arguments)},unbindEvent:function(b){for(var a=0,c=z.length;a<c;a++)z[a].apply(this,arguments)},bindTree:function(b){var a={treeId:b.treeId},c=b.treeObj;b.view.txtSelectedEnable||c.bind("selectstart",v).css({"-moz-user-select":"-moz-none"});c.bind("click",a,l.proxy);c.bind("dblclick",a,l.proxy);c.bind("mouseover",a,l.proxy);c.bind("mouseout",a,l.proxy);c.bind("mousedown",a,l.proxy);c.bind("mouseup",a,l.proxy);c.bind("contextmenu",
a,l.proxy)},unbindTree:function(b){b.treeObj.unbind("selectstart",v).unbind("click",l.proxy).unbind("dblclick",l.proxy).unbind("mouseover",l.proxy).unbind("mouseout",l.proxy).unbind("mousedown",l.proxy).unbind("mouseup",l.proxy).unbind("contextmenu",l.proxy)},doProxy:function(b){for(var a=[],c=0,d=u.length;c<d;c++){var e=u[c].apply(this,arguments);a.push(e);if(e.stop)break}return a},proxy:function(b){var a=h.getSetting(b.data.treeId);if(!j.uCanDo(a,b))return!0;for(var a=l.doProxy(b),c=!0,d=0,e=a.length;d<
e;d++){var g=a[d];g.nodeEventCallback&&(c=g.nodeEventCallback.apply(g,[b,g.node])&&c);g.treeEventCallback&&(c=g.treeEventCallback.apply(g,[b,g.node])&&c)}return c}};I=function(b,a){var c=h.getSetting(b.data.treeId);if(a.open){if(j.apply(c.callback.beforeCollapse,[c.treeId,a],!0)==!1)return!0}else if(j.apply(c.callback.beforeExpand,[c.treeId,a],!0)==!1)return!0;h.getRoot(c).expandTriggerFlag=!0;i.switchNode(c,a);return!0};J=function(b,a){var c=h.getSetting(b.data.treeId),d=c.view.autoCancelSelected&&
(b.ctrlKey||b.metaKey)&&h.isSelectedNode(c,a)?0:c.view.autoCancelSelected&&(b.ctrlKey||b.metaKey)&&c.view.selectedMulti?2:1;if(j.apply(c.callback.beforeClick,[c.treeId,a,d],!0)==!1)return!0;d===0?i.cancelPreSelectedNode(c,a):i.selectNode(c,a,d===2);c.treeObj.trigger(f.event.CLICK,[b,c.treeId,a,d]);return!0};K=function(b,a){var c=h.getSetting(b.data.treeId);j.apply(c.callback.beforeMouseDown,[c.treeId,a],!0)&&j.apply(c.callback.onMouseDown,[b,c.treeId,a]);return!0};L=function(b,a){var c=h.getSetting(b.data.treeId);
j.apply(c.callback.beforeMouseUp,[c.treeId,a],!0)&&j.apply(c.callback.onMouseUp,[b,c.treeId,a]);return!0};M=function(b,a){var c=h.getSetting(b.data.treeId);j.apply(c.callback.beforeDblClick,[c.treeId,a],!0)&&j.apply(c.callback.onDblClick,[b,c.treeId,a]);return!0};N=function(b,a){var c=h.getSetting(b.data.treeId);j.apply(c.callback.beforeRightClick,[c.treeId,a],!0)&&j.apply(c.callback.onRightClick,[b,c.treeId,a]);return typeof c.callback.onRightClick!="function"};v=function(b){b=b.originalEvent.srcElement.nodeName.toLowerCase();
return b==="input"||b==="textarea"};var j={apply:function(b,a,c){return typeof b=="function"?b.apply(P,a?a:[]):c},canAsync:function(b,a){var c=b.data.key.children;return b.async.enable&&a&&a.isParent&&!(a.zAsync||a[c]&&a[c].length>0)},clone:function(b){if(b===null)return null;var a=j.isArray(b)?[]:{},c;for(c in b)a[c]=b[c]instanceof Date?new Date(b[c].getTime()):typeof b[c]==="object"?arguments.callee(b[c]):b[c];return a},eqs:function(b,a){return b.toLowerCase()===a.toLowerCase()},isArray:function(b){return Object.prototype.toString.apply(b)===
"[object Array]"},$:function(b,a,c){a&&typeof a!="string"&&(c=a,a="");return typeof b=="string"?q(b,c?c.treeObj.get(0).ownerDocument:null):q("#"+b.tId+a,c?c.treeObj:null)},getMDom:function(b,a,c){if(!a)return null;for(;a&&a.id!==b.treeId;){for(var d=0,e=c.length;a.tagName&&d<e;d++)if(j.eqs(a.tagName,c[d].tagName)&&a.getAttribute(c[d].attrName)!==null)return a;a=a.parentNode}return null},getNodeMainDom:function(b){return q(b).parent("li").get(0)||q(b).parentsUntil("li").parent().get(0)},isChildOrSelf:function(b,
a){return q(b).closest("#"+a).length>0},uCanDo:function(){return!0}},i={addNodes:function(b,a,c,d,e){if(!b.data.keep.leaf||!a||a.isParent)if(j.isArray(d)||(d=[d]),b.data.simpleData.enable&&(d=h.transformTozTreeFormat(b,d)),a){var g=k(a,f.id.SWITCH,b),m=k(a,f.id.ICON,b),o=k(a,f.id.UL,b);if(!a.open)i.replaceSwitchClass(a,g,f.folder.CLOSE),i.replaceIcoClass(a,m,f.folder.CLOSE),a.open=!1,o.css({display:"none"});h.addNodesData(b,a,c,d);i.createNodes(b,a.level+1,d,a,c);e||i.expandCollapseParentNode(b,a,
!0)}else h.addNodesData(b,h.getRoot(b),c,d),i.createNodes(b,0,d,null,c)},appendNodes:function(b,a,c,d,e,g,f){if(!c)return[];var j=[],k=b.data.key.children,l=(d?d:h.getRoot(b))[k],r,Q;if(!l||e>=l.length)e=-1;for(var t=0,q=c.length;t<q;t++){var p=c[t];g&&(r=(e===0||l.length==c.length)&&t==0,Q=e<0&&t==c.length-1,h.initNode(b,a,p,d,r,Q,f),h.addNodeCache(b,p));r=[];p[k]&&p[k].length>0&&(r=i.appendNodes(b,a+1,p[k],p,-1,g,f&&p.open));f&&(i.makeDOMNodeMainBefore(j,b,p),i.makeDOMNodeLine(j,b,p),h.getBeforeA(b,
p,j),i.makeDOMNodeNameBefore(j,b,p),h.getInnerBeforeA(b,p,j),i.makeDOMNodeIcon(j,b,p),h.getInnerAfterA(b,p,j),i.makeDOMNodeNameAfter(j,b,p),h.getAfterA(b,p,j),p.isParent&&p.open&&i.makeUlHtml(b,p,j,r.join("")),i.makeDOMNodeMainAfter(j,b,p),h.addCreatedNode(b,p))}return j},appendParentULDom:function(b,a){var c=[],d=k(a,b);!d.get(0)&&a.parentTId&&(i.appendParentULDom(b,a.getParentNode()),d=k(a,b));var e=k(a,f.id.UL,b);e.get(0)&&e.remove();e=i.appendNodes(b,a.level+1,a[b.data.key.children],a,-1,!1,!0);
i.makeUlHtml(b,a,c,e.join(""));d.append(c.join(""))},asyncNode:function(b,a,c,d){var e,g;if(a&&!a.isParent)return j.apply(d),!1;else if(a&&a.isAjaxing)return!1;else if(j.apply(b.callback.beforeAsync,[b.treeId,a],!0)==!1)return j.apply(d),!1;if(a)a.isAjaxing=!0,k(a,f.id.ICON,b).attr({style:"","class":f.className.BUTTON+" "+f.className.ICO_LOADING});var m={};for(e=0,g=b.async.autoParam.length;a&&e<g;e++){var o=b.async.autoParam[e].split("="),n=o;o.length>1&&(n=o[1],o=o[0]);m[n]=a[o]}if(j.isArray(b.async.otherParam))for(e=
0,g=b.async.otherParam.length;e<g;e+=2)m[b.async.otherParam[e]]=b.async.otherParam[e+1];else for(var l in b.async.otherParam)m[l]=b.async.otherParam[l];var r=h.getRoot(b)._ver;q.ajax({contentType:b.async.contentType,cache:!1,type:b.async.type,url:j.apply(b.async.url,[b.treeId,a],b.async.url),data:m,dataType:b.async.dataType,success:function(e){if(r==h.getRoot(b)._ver){var g=[];try{g=!e||e.length==0?[]:typeof e=="string"?eval("("+e+")"):e}catch(m){g=e}if(a)a.isAjaxing=null,a.zAsync=!0;i.setNodeLineIcos(b,
a);g&&g!==""?(g=j.apply(b.async.dataFilter,[b.treeId,a,g],g),i.addNodes(b,a,-1,g?j.clone(g):[],!!c)):i.addNodes(b,a,-1,[],!!c);b.treeObj.trigger(f.event.ASYNC_SUCCESS,[b.treeId,a,e]);j.apply(d)}},error:function(c,d,e){if(r==h.getRoot(b)._ver){if(a)a.isAjaxing=null;i.setNodeLineIcos(b,a);b.treeObj.trigger(f.event.ASYNC_ERROR,[b.treeId,a,c,d,e])}}});return!0},cancelPreSelectedNode:function(b,a,c){var d=h.getRoot(b).curSelectedList,e,g;for(e=d.length-1;e>=0;e--)if(g=d[e],a===g||!a&&(!c||c!==g))if(k(g,
f.id.A,b).removeClass(f.node.CURSELECTED),a){h.removeSelectedNode(b,a);break}else d.splice(e,1),b.treeObj.trigger(f.event.UNSELECTED,[b.treeId,g])},createNodeCallback:function(b){if(b.callback.onNodeCreated||b.view.addDiyDom)for(var a=h.getRoot(b);a.createdNodes.length>0;){var c=a.createdNodes.shift();j.apply(b.view.addDiyDom,[b.treeId,c]);b.callback.onNodeCreated&&b.treeObj.trigger(f.event.NODECREATED,[b.treeId,c])}},createNodes:function(b,a,c,d,e){if(c&&c.length!=0){var g=h.getRoot(b),j=b.data.key.children,
j=!d||d.open||!!k(d[j][0],b).get(0);g.createdNodes=[];var a=i.appendNodes(b,a,c,d,e,!0,j),o,n;d?(d=k(d,f.id.UL,b),d.get(0)&&(o=d)):o=b.treeObj;o&&(e>=0&&(n=o.children()[e]),e>=0&&n?q(n).before(a.join("")):o.append(a.join("")));i.createNodeCallback(b)}},destroy:function(b){b&&(h.initCache(b),h.initRoot(b),l.unbindTree(b),l.unbindEvent(b),b.treeObj.empty(),delete s[b.treeId])},expandCollapseNode:function(b,a,c,d,e){var g=h.getRoot(b),m=b.data.key.children;if(a){if(g.expandTriggerFlag){var o=e,e=function(){o&&
o();a.open?b.treeObj.trigger(f.event.EXPAND,[b.treeId,a]):b.treeObj.trigger(f.event.COLLAPSE,[b.treeId,a])};g.expandTriggerFlag=!1}if(!a.open&&a.isParent&&(!k(a,f.id.UL,b).get(0)||a[m]&&a[m].length>0&&!k(a[m][0],b).get(0)))i.appendParentULDom(b,a),i.createNodeCallback(b);if(a.open==c)j.apply(e,[]);else{var c=k(a,f.id.UL,b),g=k(a,f.id.SWITCH,b),n=k(a,f.id.ICON,b);a.isParent?(a.open=!a.open,a.iconOpen&&a.iconClose&&n.attr("style",i.makeNodeIcoStyle(b,a)),a.open?(i.replaceSwitchClass(a,g,f.folder.OPEN),
i.replaceIcoClass(a,n,f.folder.OPEN),d==!1||b.view.expandSpeed==""?(c.show(),j.apply(e,[])):a[m]&&a[m].length>0?c.slideDown(b.view.expandSpeed,e):(c.show(),j.apply(e,[]))):(i.replaceSwitchClass(a,g,f.folder.CLOSE),i.replaceIcoClass(a,n,f.folder.CLOSE),d==!1||b.view.expandSpeed==""||!(a[m]&&a[m].length>0)?(c.hide(),j.apply(e,[])):c.slideUp(b.view.expandSpeed,e))):j.apply(e,[])}}else j.apply(e,[])},expandCollapseParentNode:function(b,a,c,d,e){a&&(a.parentTId?(i.expandCollapseNode(b,a,c,d),a.parentTId&&
i.expandCollapseParentNode(b,a.getParentNode(),c,d,e)):i.expandCollapseNode(b,a,c,d,e))},expandCollapseSonNode:function(b,a,c,d,e){var g=h.getRoot(b),f=b.data.key.children,g=a?a[f]:g[f],f=a?!1:d,j=h.getRoot(b).expandTriggerFlag;h.getRoot(b).expandTriggerFlag=!1;if(g)for(var k=0,l=g.length;k<l;k++)g[k]&&i.expandCollapseSonNode(b,g[k],c,f);h.getRoot(b).expandTriggerFlag=j;i.expandCollapseNode(b,a,c,d,e)},isSelectedNode:function(b,a){if(!a)return!1;var c=h.getRoot(b).curSelectedList,d;for(d=c.length-
1;d>=0;d--)if(a===c[d])return!0;return!1},makeDOMNodeIcon:function(b,a,c){var d=h.getNodeName(a,c),d=a.view.nameIsHTML?d:d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");b.push("<span id='",c.tId,f.id.ICON,"' title='' treeNode",f.id.ICON," class='",i.makeNodeIcoClass(a,c),"' style='",i.makeNodeIcoStyle(a,c),"'></span><span id='",c.tId,f.id.SPAN,"'>",d,"</span>")},makeDOMNodeLine:function(b,a,c){b.push("<span id='",c.tId,f.id.SWITCH,"' title='' class='",i.makeNodeLineClass(a,c),"' treeNode",
f.id.SWITCH,"></span>")},makeDOMNodeMainAfter:function(b){b.push("</li>")},makeDOMNodeMainBefore:function(b,a,c){b.push("<li id='",c.tId,"' class='",f.className.LEVEL,c.level,"' tabindex='0' hidefocus='true' treenode>")},makeDOMNodeNameAfter:function(b){b.push("</a>")},makeDOMNodeNameBefore:function(b,a,c){var d=h.getNodeTitle(a,c),e=i.makeNodeUrl(a,c),g=i.makeNodeFontCss(a,c),m=[],k;for(k in g)m.push(k,":",g[k],";");b.push("<a id='",c.tId,f.id.A,"' class='",f.className.LEVEL,c.level,"' treeNode",
f.id.A,' onclick="',c.click||"",'" ',e!=null&&e.length>0?"href='"+e+"'":""," target='",i.makeNodeTarget(c),"' style='",m.join(""),"'");j.apply(a.view.showTitle,[a.treeId,c],a.view.showTitle)&&d&&b.push("title='",d.replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),"'");b.push(">")},makeNodeFontCss:function(b,a){var c=j.apply(b.view.fontCss,[b.treeId,a],b.view.fontCss);return c&&typeof c!="function"?c:{}},makeNodeIcoClass:function(b,a){var c=["ico"];a.isAjaxing||(c[0]=(a.iconSkin?a.iconSkin+
"_":"")+c[0],a.isParent?c.push(a.open?f.folder.OPEN:f.folder.CLOSE):c.push(f.folder.DOCU));return f.className.BUTTON+" "+c.join("_")},makeNodeIcoStyle:function(b,a){var c=[];if(!a.isAjaxing){var d=a.isParent&&a.iconOpen&&a.iconClose?a.open?a.iconOpen:a.iconClose:a[b.data.key.icon];d&&c.push("background:url(",d,") 0 0 no-repeat;");(b.view.showIcon==!1||!j.apply(b.view.showIcon,[b.treeId,a],!0))&&c.push("width:0px;height:0px;")}return c.join("")},makeNodeLineClass:function(b,a){var c=[];b.view.showLine?
a.level==0&&a.isFirstNode&&a.isLastNode?c.push(f.line.ROOT):a.level==0&&a.isFirstNode?c.push(f.line.ROOTS):a.isLastNode?c.push(f.line.BOTTOM):c.push(f.line.CENTER):c.push(f.line.NOLINE);a.isParent?c.push(a.open?f.folder.OPEN:f.folder.CLOSE):c.push(f.folder.DOCU);return i.makeNodeLineClassEx(a)+c.join("_")},makeNodeLineClassEx:function(b){return f.className.BUTTON+" "+f.className.LEVEL+b.level+" "+f.className.SWITCH+" "},makeNodeTarget:function(b){return b.target||"_blank"},makeNodeUrl:function(b,
a){var c=b.data.key.url;return a[c]?a[c]:null},makeUlHtml:function(b,a,c,d){c.push("<ul id='",a.tId,f.id.UL,"' class='",f.className.LEVEL,a.level," ",i.makeUlLineClass(b,a),"' style='display:",a.open?"block":"none","'>");c.push(d);c.push("</ul>")},makeUlLineClass:function(b,a){return b.view.showLine&&!a.isLastNode?f.line.LINE:""},removeChildNodes:function(b,a){if(a){var c=b.data.key.children,d=a[c];if(d){for(var e=0,g=d.length;e<g;e++)h.removeNodeCache(b,d[e]);h.removeSelectedNode(b);delete a[c];
b.data.keep.parent?k(a,f.id.UL,b).empty():(a.isParent=!1,a.open=!1,c=k(a,f.id.SWITCH,b),d=k(a,f.id.ICON,b),i.replaceSwitchClass(a,c,f.folder.DOCU),i.replaceIcoClass(a,d,f.folder.DOCU),k(a,f.id.UL,b).remove())}}},setFirstNode:function(b,a){var c=b.data.key.children;if(a[c].length>0)a[c][0].isFirstNode=!0},setLastNode:function(b,a){var c=b.data.key.children,d=a[c].length;if(d>0)a[c][d-1].isLastNode=!0},removeNode:function(b,a){var c=h.getRoot(b),d=b.data.key.children,e=a.parentTId?a.getParentNode():
c;a.isFirstNode=!1;a.isLastNode=!1;a.getPreNode=function(){return null};a.getNextNode=function(){return null};if(h.getNodeCache(b,a.tId)){k(a,b).remove();h.removeNodeCache(b,a);h.removeSelectedNode(b,a);for(var g=0,j=e[d].length;g<j;g++)if(e[d][g].tId==a.tId){e[d].splice(g,1);break}i.setFirstNode(b,e);i.setLastNode(b,e);var o,g=e[d].length;if(!b.data.keep.parent&&g==0)e.isParent=!1,e.open=!1,g=k(e,f.id.UL,b),j=k(e,f.id.SWITCH,b),o=k(e,f.id.ICON,b),i.replaceSwitchClass(e,j,f.folder.DOCU),i.replaceIcoClass(e,
o,f.folder.DOCU),g.css("display","none");else if(b.view.showLine&&g>0){var n=e[d][g-1],g=k(n,f.id.UL,b),j=k(n,f.id.SWITCH,b);o=k(n,f.id.ICON,b);e==c?e[d].length==1?i.replaceSwitchClass(n,j,f.line.ROOT):(c=k(e[d][0],f.id.SWITCH,b),i.replaceSwitchClass(e[d][0],c,f.line.ROOTS),i.replaceSwitchClass(n,j,f.line.BOTTOM)):i.replaceSwitchClass(n,j,f.line.BOTTOM);g.removeClass(f.line.LINE)}}},replaceIcoClass:function(b,a,c){if(a&&!b.isAjaxing&&(b=a.attr("class"),b!=void 0)){b=b.split("_");switch(c){case f.folder.OPEN:case f.folder.CLOSE:case f.folder.DOCU:b[b.length-
1]=c}a.attr("class",b.join("_"))}},replaceSwitchClass:function(b,a,c){if(a){var d=a.attr("class");if(d!=void 0){d=d.split("_");switch(c){case f.line.ROOT:case f.line.ROOTS:case f.line.CENTER:case f.line.BOTTOM:case f.line.NOLINE:d[0]=i.makeNodeLineClassEx(b)+c;break;case f.folder.OPEN:case f.folder.CLOSE:case f.folder.DOCU:d[1]=c}a.attr("class",d.join("_"));c!==f.folder.DOCU?a.removeAttr("disabled"):a.attr("disabled","disabled")}}},selectNode:function(b,a,c){c||i.cancelPreSelectedNode(b,null,a);k(a,
f.id.A,b).addClass(f.node.CURSELECTED);h.addSelectedNode(b,a);b.treeObj.trigger(f.event.SELECTED,[b.treeId,a])},setNodeFontCss:function(b,a){var c=k(a,f.id.A,b),d=i.makeNodeFontCss(b,a);d&&c.css(d)},setNodeLineIcos:function(b,a){if(a){var c=k(a,f.id.SWITCH,b),d=k(a,f.id.UL,b),e=k(a,f.id.ICON,b),g=i.makeUlLineClass(b,a);g.length==0?d.removeClass(f.line.LINE):d.addClass(g);c.attr("class",i.makeNodeLineClass(b,a));a.isParent?c.removeAttr("disabled"):c.attr("disabled","disabled");e.removeAttr("style");
e.attr("style",i.makeNodeIcoStyle(b,a));e.attr("class",i.makeNodeIcoClass(b,a))}},setNodeName:function(b,a){var c=h.getNodeTitle(b,a),d=k(a,f.id.SPAN,b);d.empty();b.view.nameIsHTML?d.html(h.getNodeName(b,a)):d.text(h.getNodeName(b,a));j.apply(b.view.showTitle,[b.treeId,a],b.view.showTitle)&&k(a,f.id.A,b).attr("title",!c?"":c)},setNodeTarget:function(b,a){k(a,f.id.A,b).attr("target",i.makeNodeTarget(a))},setNodeUrl:function(b,a){var c=k(a,f.id.A,b),d=i.makeNodeUrl(b,a);d==null||d.length==0?c.removeAttr("href"):
c.attr("href",d)},switchNode:function(b,a){a.open||!j.canAsync(b,a)?i.expandCollapseNode(b,a,!a.open):b.async.enable?i.asyncNode(b,a)||i.expandCollapseNode(b,a,!a.open):a&&i.expandCollapseNode(b,a,!a.open)}};q.fn.zTree={consts:{className:{BUTTON:"button",LEVEL:"level",ICO_LOADING:"ico_loading",SWITCH:"switch"},event:{NODECREATED:"ztree_nodeCreated",CLICK:"ztree_click",EXPAND:"ztree_expand",COLLAPSE:"ztree_collapse",ASYNC_SUCCESS:"ztree_async_success",ASYNC_ERROR:"ztree_async_error",REMOVE:"ztree_remove",
SELECTED:"ztree_selected",UNSELECTED:"ztree_unselected"},id:{A:"_a",ICON:"_ico",SPAN:"_span",SWITCH:"_switch",UL:"_ul"},line:{ROOT:"root",ROOTS:"roots",CENTER:"center",BOTTOM:"bottom",NOLINE:"noline",LINE:"line"},folder:{OPEN:"open",CLOSE:"close",DOCU:"docu"},node:{CURSELECTED:"curSelectedNode"}},_z:{tools:j,view:i,event:l,data:h},getZTreeObj:function(b){return(b=h.getZTreeTools(b))?b:null},destroy:function(b){if(b&&b.length>0)i.destroy(h.getSetting(b));else for(var a in s)i.destroy(s[a])},init:function(b,
a,c){var d=j.clone(O);q.extend(!0,d,a);d.treeId=b.attr("id");d.treeObj=b;d.treeObj.empty();s[d.treeId]=d;if(typeof document.body.style.maxHeight==="undefined")d.view.expandSpeed="";h.initRoot(d);b=h.getRoot(d);a=d.data.key.children;c=c?j.clone(j.isArray(c)?c:[c]):[];b[a]=d.data.simpleData.enable?h.transformTozTreeFormat(d,c):c;h.initCache(d);l.unbindTree(d);l.bindTree(d);l.unbindEvent(d);l.bindEvent(d);c={setting:d,addNodes:function(a,b,c,f){function h(){i.addNodes(d,a,b,l,f==!0)}a||(a=null);if(a&&
!a.isParent&&d.data.keep.leaf)return null;var k=parseInt(b,10);isNaN(k)?(f=!!c,c=b,b=-1):b=k;if(!c)return null;var l=j.clone(j.isArray(c)?c:[c]);j.canAsync(d,a)?i.asyncNode(d,a,f,h):h();return l},cancelSelectedNode:function(a){i.cancelPreSelectedNode(d,a)},destroy:function(){i.destroy(d)},expandAll:function(a){a=!!a;i.expandCollapseSonNode(d,null,a,!0);return a},expandNode:function(a,b,c,f,n){if(!a||!a.isParent)return null;b!==!0&&b!==!1&&(b=!a.open);if((n=!!n)&&b&&j.apply(d.callback.beforeExpand,
[d.treeId,a],!0)==!1)return null;else if(n&&!b&&j.apply(d.callback.beforeCollapse,[d.treeId,a],!0)==!1)return null;b&&a.parentTId&&i.expandCollapseParentNode(d,a.getParentNode(),b,!1);if(b===a.open&&!c)return null;h.getRoot(d).expandTriggerFlag=n;if(!j.canAsync(d,a)&&c)i.expandCollapseSonNode(d,a,b,!0,function(){if(f!==!1)try{k(a,d).focus().blur()}catch(b){}});else if(a.open=!b,i.switchNode(this.setting,a),f!==!1)try{k(a,d).focus().blur()}catch(l){}return b},getNodes:function(){return h.getNodes(d)},
getNodeByParam:function(a,b,c){return!a?null:h.getNodeByParam(d,c?c[d.data.key.children]:h.getNodes(d),a,b)},getNodeByTId:function(a){return h.getNodeCache(d,a)},getNodesByParam:function(a,b,c){return!a?null:h.getNodesByParam(d,c?c[d.data.key.children]:h.getNodes(d),a,b)},getNodesByParamFuzzy:function(a,b,c){return!a?null:h.getNodesByParamFuzzy(d,c?c[d.data.key.children]:h.getNodes(d),a,b)},getNodesByFilter:function(a,b,c,f){b=!!b;return!a||typeof a!="function"?b?null:[]:h.getNodesByFilter(d,c?c[d.data.key.children]:
h.getNodes(d),a,b,f)},getNodeIndex:function(a){if(!a)return null;for(var b=d.data.key.children,c=a.parentTId?a.getParentNode():h.getRoot(d),f=0,i=c[b].length;f<i;f++)if(c[b][f]==a)return f;return-1},getSelectedNodes:function(){for(var a=[],b=h.getRoot(d).curSelectedList,c=0,f=b.length;c<f;c++)a.push(b[c]);return a},isSelectedNode:function(a){return h.isSelectedNode(d,a)},reAsyncChildNodes:function(a,b,c){if(this.setting.async.enable){var j=!a;j&&(a=h.getRoot(d));if(b=="refresh"){for(var b=this.setting.data.key.children,
l=0,q=a[b]?a[b].length:0;l<q;l++)h.removeNodeCache(d,a[b][l]);h.removeSelectedNode(d);a[b]=[];j?this.setting.treeObj.empty():k(a,f.id.UL,d).empty()}i.asyncNode(this.setting,j?null:a,!!c)}},refresh:function(){this.setting.treeObj.empty();var a=h.getRoot(d),b=a[d.data.key.children];h.initRoot(d);a[d.data.key.children]=b;h.initCache(d);i.createNodes(d,0,a[d.data.key.children],null,-1)},removeChildNodes:function(a){if(!a)return null;var b=a[d.data.key.children];i.removeChildNodes(d,a);return b?b:null},
removeNode:function(a,b){a&&(b=!!b,b&&j.apply(d.callback.beforeRemove,[d.treeId,a],!0)==!1||(i.removeNode(d,a),b&&this.setting.treeObj.trigger(f.event.REMOVE,[d.treeId,a])))},selectNode:function(a,b){if(a&&j.uCanDo(d)){b=d.view.selectedMulti&&b;if(a.parentTId)i.expandCollapseParentNode(d,a.getParentNode(),!0,!1,function(){try{k(a,d).focus().blur()}catch(b){}});else try{k(a,d).focus().blur()}catch(c){}i.selectNode(d,a,b)}},transformTozTreeNodes:function(a){return h.transformTozTreeFormat(d,a)},transformToArray:function(a){return h.transformToArrayFormat(d,
a)},updateNode:function(a){a&&k(a,d).get(0)&&j.uCanDo(d)&&(i.setNodeName(d,a),i.setNodeTarget(d,a),i.setNodeUrl(d,a),i.setNodeLineIcos(d,a),i.setNodeFontCss(d,a))}};b.treeTools=c;h.setZTreeTools(d,c);b[a]&&b[a].length>0?i.createNodes(d,0,b[a],null,-1):d.async.enable&&d.async.url&&d.async.url!==""&&i.asyncNode(d);return c}};var P=q.fn.zTree,k=j.$,f=P.consts})(jQuery);

/*
 * JQuery zTree excheck v3.5.19.1
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-10-26
 */
(function(m){var p,q,r,o={event:{CHECK:"ztree_check"},id:{CHECK:"_check"},checkbox:{STYLE:"checkbox",DEFAULT:"chk",DISABLED:"disable",FALSE:"false",TRUE:"true",FULL:"full",PART:"part",FOCUS:"focus"},radio:{STYLE:"radio",TYPE_ALL:"all",TYPE_LEVEL:"level"}},v={check:{enable:!1,autoCheckTrigger:!1,chkStyle:o.checkbox.STYLE,nocheckInherit:!1,chkDisabledInherit:!1,radioType:o.radio.TYPE_LEVEL,chkboxType:{Y:"ps",N:"ps"}},data:{key:{checked:"checked"}},callback:{beforeCheck:null,onCheck:null}};p=function(c,
a){if(a.chkDisabled===!0)return!1;var b=g.getSetting(c.data.treeId),d=b.data.key.checked;if(k.apply(b.callback.beforeCheck,[b.treeId,a],!0)==!1)return!0;a[d]=!a[d];e.checkNodeRelation(b,a);d=n(a,j.id.CHECK,b);e.setChkClass(b,d,a);e.repairParentChkClassWithSelf(b,a);b.treeObj.trigger(j.event.CHECK,[c,b.treeId,a]);return!0};q=function(c,a){if(a.chkDisabled===!0)return!1;var b=g.getSetting(c.data.treeId),d=n(a,j.id.CHECK,b);a.check_Focus=!0;e.setChkClass(b,d,a);return!0};r=function(c,a){if(a.chkDisabled===
!0)return!1;var b=g.getSetting(c.data.treeId),d=n(a,j.id.CHECK,b);a.check_Focus=!1;e.setChkClass(b,d,a);return!0};m.extend(!0,m.fn.zTree.consts,o);m.extend(!0,m.fn.zTree._z,{tools:{},view:{checkNodeRelation:function(c,a){var b,d,h,i=c.data.key.children,l=c.data.key.checked;b=j.radio;if(c.check.chkStyle==b.STYLE){var f=g.getRadioCheckedList(c);if(a[l])if(c.check.radioType==b.TYPE_ALL){for(d=f.length-1;d>=0;d--)b=f[d],b[l]&&b!=a&&(b[l]=!1,f.splice(d,1),e.setChkClass(c,n(b,j.id.CHECK,c),b),b.parentTId!=
a.parentTId&&e.repairParentChkClassWithSelf(c,b));f.push(a)}else{f=a.parentTId?a.getParentNode():g.getRoot(c);for(d=0,h=f[i].length;d<h;d++)b=f[i][d],b[l]&&b!=a&&(b[l]=!1,e.setChkClass(c,n(b,j.id.CHECK,c),b))}else if(c.check.radioType==b.TYPE_ALL)for(d=0,h=f.length;d<h;d++)if(a==f[d]){f.splice(d,1);break}}else a[l]&&(!a[i]||a[i].length==0||c.check.chkboxType.Y.indexOf("s")>-1)&&e.setSonNodeCheckBox(c,a,!0),!a[l]&&(!a[i]||a[i].length==0||c.check.chkboxType.N.indexOf("s")>-1)&&e.setSonNodeCheckBox(c,
a,!1),a[l]&&c.check.chkboxType.Y.indexOf("p")>-1&&e.setParentNodeCheckBox(c,a,!0),!a[l]&&c.check.chkboxType.N.indexOf("p")>-1&&e.setParentNodeCheckBox(c,a,!1)},makeChkClass:function(c,a){var b=c.data.key.checked,d=j.checkbox,h=j.radio,i="",i=a.chkDisabled===!0?d.DISABLED:a.halfCheck?d.PART:c.check.chkStyle==h.STYLE?a.check_Child_State<1?d.FULL:d.PART:a[b]?a.check_Child_State===2||a.check_Child_State===-1?d.FULL:d.PART:a.check_Child_State<1?d.FULL:d.PART,b=c.check.chkStyle+"_"+(a[b]?d.TRUE:d.FALSE)+
"_"+i,b=a.check_Focus&&a.chkDisabled!==!0?b+"_"+d.FOCUS:b;return j.className.BUTTON+" "+d.DEFAULT+" "+b},repairAllChk:function(c,a){if(c.check.enable&&c.check.chkStyle===j.checkbox.STYLE)for(var b=c.data.key.checked,d=c.data.key.children,h=g.getRoot(c),i=0,l=h[d].length;i<l;i++){var f=h[d][i];f.nocheck!==!0&&f.chkDisabled!==!0&&(f[b]=a);e.setSonNodeCheckBox(c,f,a)}},repairChkClass:function(c,a){if(a&&(g.makeChkFlag(c,a),a.nocheck!==!0)){var b=n(a,j.id.CHECK,c);e.setChkClass(c,b,a)}},repairParentChkClass:function(c,
a){if(a&&a.parentTId){var b=a.getParentNode();e.repairChkClass(c,b);e.repairParentChkClass(c,b)}},repairParentChkClassWithSelf:function(c,a){if(a){var b=c.data.key.children;a[b]&&a[b].length>0?e.repairParentChkClass(c,a[b][0]):e.repairParentChkClass(c,a)}},repairSonChkDisabled:function(c,a,b,d){if(a){var h=c.data.key.children;if(a.chkDisabled!=b)a.chkDisabled=b;e.repairChkClass(c,a);if(a[h]&&d)for(var i=0,l=a[h].length;i<l;i++)e.repairSonChkDisabled(c,a[h][i],b,d)}},repairParentChkDisabled:function(c,
a,b,d){if(a){if(a.chkDisabled!=b&&d)a.chkDisabled=b;e.repairChkClass(c,a);e.repairParentChkDisabled(c,a.getParentNode(),b,d)}},setChkClass:function(c,a,b){a&&(b.nocheck===!0?a.hide():a.show(),a.attr("class",e.makeChkClass(c,b)))},setParentNodeCheckBox:function(c,a,b,d){var h=c.data.key.children,i=c.data.key.checked,l=n(a,j.id.CHECK,c);d||(d=a);g.makeChkFlag(c,a);a.nocheck!==!0&&a.chkDisabled!==!0&&(a[i]=b,e.setChkClass(c,l,a),c.check.autoCheckTrigger&&a!=d&&c.treeObj.trigger(j.event.CHECK,[null,c.treeId,
a]));if(a.parentTId){l=!0;if(!b)for(var h=a.getParentNode()[h],f=0,k=h.length;f<k;f++)if(h[f].nocheck!==!0&&h[f].chkDisabled!==!0&&h[f][i]||(h[f].nocheck===!0||h[f].chkDisabled===!0)&&h[f].check_Child_State>0){l=!1;break}l&&e.setParentNodeCheckBox(c,a.getParentNode(),b,d)}},setSonNodeCheckBox:function(c,a,b,d){if(a){var h=c.data.key.children,i=c.data.key.checked,l=n(a,j.id.CHECK,c);d||(d=a);var f=!1;if(a[h])for(var k=0,m=a[h].length;k<m&&a.chkDisabled!==!0;k++){var o=a[h][k];e.setSonNodeCheckBox(c,
o,b,d);o.chkDisabled===!0&&(f=!0)}if(a!=g.getRoot(c)&&a.chkDisabled!==!0){f&&a.nocheck!==!0&&g.makeChkFlag(c,a);if(a.nocheck!==!0&&a.chkDisabled!==!0){if(a[i]=b,!f)a.check_Child_State=a[h]&&a[h].length>0?b?2:0:-1}else a.check_Child_State=-1;e.setChkClass(c,l,a);c.check.autoCheckTrigger&&a!=d&&a.nocheck!==!0&&a.chkDisabled!==!0&&c.treeObj.trigger(j.event.CHECK,[null,c.treeId,a])}}}},event:{},data:{getRadioCheckedList:function(c){for(var a=g.getRoot(c).radioCheckedList,b=0,d=a.length;b<d;b++)g.getNodeCache(c,
a[b].tId)||(a.splice(b,1),b--,d--);return a},getCheckStatus:function(c,a){if(!c.check.enable||a.nocheck||a.chkDisabled)return null;var b=c.data.key.checked;return{checked:a[b],half:a.halfCheck?a.halfCheck:c.check.chkStyle==j.radio.STYLE?a.check_Child_State===2:a[b]?a.check_Child_State>-1&&a.check_Child_State<2:a.check_Child_State>0}},getTreeCheckedNodes:function(c,a,b,d){if(!a)return[];for(var h=c.data.key.children,i=c.data.key.checked,e=b&&c.check.chkStyle==j.radio.STYLE&&c.check.radioType==j.radio.TYPE_ALL,
d=!d?[]:d,f=0,k=a.length;f<k;f++){if(a[f].nocheck!==!0&&a[f].chkDisabled!==!0&&a[f][i]==b&&(d.push(a[f]),e))break;g.getTreeCheckedNodes(c,a[f][h],b,d);if(e&&d.length>0)break}return d},getTreeChangeCheckedNodes:function(c,a,b){if(!a)return[];for(var d=c.data.key.children,h=c.data.key.checked,b=!b?[]:b,i=0,e=a.length;i<e;i++)a[i].nocheck!==!0&&a[i].chkDisabled!==!0&&a[i][h]!=a[i].checkedOld&&b.push(a[i]),g.getTreeChangeCheckedNodes(c,a[i][d],b);return b},makeChkFlag:function(c,a){if(a){var b=c.data.key.children,
d=c.data.key.checked,h=-1;if(a[b])for(var i=0,e=a[b].length;i<e;i++){var f=a[b][i],g=-1;if(c.check.chkStyle==j.radio.STYLE)if(g=f.nocheck===!0||f.chkDisabled===!0?f.check_Child_State:f.halfCheck===!0?2:f[d]?2:f.check_Child_State>0?2:0,g==2){h=2;break}else g==0&&(h=0);else if(c.check.chkStyle==j.checkbox.STYLE)if(g=f.nocheck===!0||f.chkDisabled===!0?f.check_Child_State:f.halfCheck===!0?1:f[d]?f.check_Child_State===-1||f.check_Child_State===2?2:1:f.check_Child_State>0?1:0,g===1){h=1;break}else if(g===
2&&h>-1&&i>0&&g!==h){h=1;break}else if(h===2&&g>-1&&g<2){h=1;break}else g>-1&&(h=g)}a.check_Child_State=h}}}});var m=m.fn.zTree,k=m._z.tools,j=m.consts,e=m._z.view,g=m._z.data,n=k.$;g.exSetting(v);g.addInitBind(function(c){c.treeObj.bind(j.event.CHECK,function(a,b,d,h){a.srcEvent=b;k.apply(c.callback.onCheck,[a,d,h])})});g.addInitUnBind(function(c){c.treeObj.unbind(j.event.CHECK)});g.addInitCache(function(){});g.addInitNode(function(c,a,b,d){if(b){a=c.data.key.checked;typeof b[a]=="string"&&(b[a]=
k.eqs(b[a],"true"));b[a]=!!b[a];b.checkedOld=b[a];if(typeof b.nocheck=="string")b.nocheck=k.eqs(b.nocheck,"true");b.nocheck=!!b.nocheck||c.check.nocheckInherit&&d&&!!d.nocheck;if(typeof b.chkDisabled=="string")b.chkDisabled=k.eqs(b.chkDisabled,"true");b.chkDisabled=!!b.chkDisabled||c.check.chkDisabledInherit&&d&&!!d.chkDisabled;if(typeof b.halfCheck=="string")b.halfCheck=k.eqs(b.halfCheck,"true");b.halfCheck=!!b.halfCheck;b.check_Child_State=-1;b.check_Focus=!1;b.getCheckStatus=function(){return g.getCheckStatus(c,
b)};c.check.chkStyle==j.radio.STYLE&&c.check.radioType==j.radio.TYPE_ALL&&b[a]&&g.getRoot(c).radioCheckedList.push(b)}});g.addInitProxy(function(c){var a=c.target,b=g.getSetting(c.data.treeId),d="",h=null,e="",l=null;if(k.eqs(c.type,"mouseover")){if(b.check.enable&&k.eqs(a.tagName,"span")&&a.getAttribute("treeNode"+j.id.CHECK)!==null)d=k.getNodeMainDom(a).id,e="mouseoverCheck"}else if(k.eqs(c.type,"mouseout")){if(b.check.enable&&k.eqs(a.tagName,"span")&&a.getAttribute("treeNode"+j.id.CHECK)!==null)d=
k.getNodeMainDom(a).id,e="mouseoutCheck"}else if(k.eqs(c.type,"click")&&b.check.enable&&k.eqs(a.tagName,"span")&&a.getAttribute("treeNode"+j.id.CHECK)!==null)d=k.getNodeMainDom(a).id,e="checkNode";if(d.length>0)switch(h=g.getNodeCache(b,d),e){case "checkNode":l=p;break;case "mouseoverCheck":l=q;break;case "mouseoutCheck":l=r}return{stop:e==="checkNode",node:h,nodeEventType:e,nodeEventCallback:l,treeEventType:"",treeEventCallback:null}},!0);g.addInitRoot(function(c){g.getRoot(c).radioCheckedList=[]});
g.addBeforeA(function(c,a,b){c.check.enable&&(g.makeChkFlag(c,a),b.push("<span ID='",a.tId,j.id.CHECK,"' class='",e.makeChkClass(c,a),"' treeNode",j.id.CHECK,a.nocheck===!0?" style='display:none;'":"","></span>"))});g.addZTreeTools(function(c,a){a.checkNode=function(a,b,c,g){var f=this.setting.data.key.checked;if(a.chkDisabled!==!0&&(b!==!0&&b!==!1&&(b=!a[f]),g=!!g,(a[f]!==b||c)&&!(g&&k.apply(this.setting.callback.beforeCheck,[this.setting.treeId,a],!0)==!1)&&k.uCanDo(this.setting)&&this.setting.check.enable&&
a.nocheck!==!0))a[f]=b,b=n(a,j.id.CHECK,this.setting),(c||this.setting.check.chkStyle===j.radio.STYLE)&&e.checkNodeRelation(this.setting,a),e.setChkClass(this.setting,b,a),e.repairParentChkClassWithSelf(this.setting,a),g&&this.setting.treeObj.trigger(j.event.CHECK,[null,this.setting.treeId,a])};a.checkAllNodes=function(a){e.repairAllChk(this.setting,!!a)};a.getCheckedNodes=function(a){var b=this.setting.data.key.children;return g.getTreeCheckedNodes(this.setting,g.getRoot(this.setting)[b],a!==!1)};
a.getChangeCheckedNodes=function(){var a=this.setting.data.key.children;return g.getTreeChangeCheckedNodes(this.setting,g.getRoot(this.setting)[a])};a.setChkDisabled=function(a,b,c,g){b=!!b;c=!!c;e.repairSonChkDisabled(this.setting,a,b,!!g);e.repairParentChkDisabled(this.setting,a.getParentNode(),b,c)};var b=a.updateNode;a.updateNode=function(c,g){b&&b.apply(a,arguments);if(c&&this.setting.check.enable&&n(c,this.setting).get(0)&&k.uCanDo(this.setting)){var i=n(c,j.id.CHECK,this.setting);(g==!0||this.setting.check.chkStyle===
j.radio.STYLE)&&e.checkNodeRelation(this.setting,c);e.setChkClass(this.setting,i,c);e.repairParentChkClassWithSelf(this.setting,c)}}});var s=e.createNodes;e.createNodes=function(c,a,b,d,g){s&&s.apply(e,arguments);b&&e.repairParentChkClassWithSelf(c,d)};var t=e.removeNode;e.removeNode=function(c,a){var b=a.getParentNode();t&&t.apply(e,arguments);a&&b&&(e.repairChkClass(c,b),e.repairParentChkClass(c,b))};var u=e.appendNodes;e.appendNodes=function(c,a,b,d,h,i,j){var f="";u&&(f=u.apply(e,arguments));
d&&g.makeChkFlag(c,d);return f}})(jQuery);

/*
 * JQuery zTree exHideNodes v3.5.21
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2016-02-17
 */
(function(i){i.extend(!0,i.fn.zTree._z,{view:{clearOldFirstNode:function(c,a){for(var b=a.getNextNode();b;){if(b.isFirstNode){b.isFirstNode=!1;d.setNodeLineIcos(c,b);break}if(b.isLastNode)break;b=b.getNextNode()}},clearOldLastNode:function(c,a,b){for(a=a.getPreNode();a;){if(a.isLastNode){a.isLastNode=!1;b&&d.setNodeLineIcos(c,a);break}if(a.isFirstNode)break;a=a.getPreNode()}},makeDOMNodeMainBefore:function(c,a,b){c.push("<li ",b.isHidden?"style='display:none;' ":"","id='",b.tId,"' class='",l.className.LEVEL,
b.level,"' tabindex='0' hidefocus='true' treenode>")},showNode:function(c,a){a.isHidden=!1;f.initShowForExCheck(c,a);j(a,c).show()},showNodes:function(c,a,b){if(a&&a.length!=0){var e={},g,k;for(g=0,k=a.length;g<k;g++){var h=a[g];if(!e[h.parentTId]){var i=h.getParentNode();e[h.parentTId]=i===null?f.getRoot(c):h.getParentNode()}d.showNode(c,h,b)}for(var j in e)a=e[j][c.data.key.children],d.setFirstNodeForShow(c,a),d.setLastNodeForShow(c,a)}},hideNode:function(c,a){a.isHidden=!0;a.isFirstNode=!1;a.isLastNode=
!1;f.initHideForExCheck(c,a);d.cancelPreSelectedNode(c,a);j(a,c).hide()},hideNodes:function(c,a,b){if(a&&a.length!=0){var e={},g,k;for(g=0,k=a.length;g<k;g++){var h=a[g];if((h.isFirstNode||h.isLastNode)&&!e[h.parentTId]){var i=h.getParentNode();e[h.parentTId]=i===null?f.getRoot(c):h.getParentNode()}d.hideNode(c,h,b)}for(var j in e)a=e[j][c.data.key.children],d.setFirstNodeForHide(c,a),d.setLastNodeForHide(c,a)}},setFirstNode:function(c,a){var b=c.data.key.children,e=a[b].length;e>0&&!a[b][0].isHidden?
a[b][0].isFirstNode=!0:e>0&&d.setFirstNodeForHide(c,a[b])},setLastNode:function(c,a){var b=c.data.key.children,e=a[b].length;e>0&&!a[b][0].isHidden?a[b][e-1].isLastNode=!0:e>0&&d.setLastNodeForHide(c,a[b])},setFirstNodeForHide:function(c,a){var b,e,g;for(e=0,g=a.length;e<g;e++){b=a[e];if(b.isFirstNode)break;if(!b.isHidden&&!b.isFirstNode){b.isFirstNode=!0;d.setNodeLineIcos(c,b);break}else b=null}return b},setFirstNodeForShow:function(c,a){var b,e,g,f,h;for(e=0,g=a.length;e<g;e++)if(b=a[e],!f&&!b.isHidden&&
b.isFirstNode){f=b;break}else if(!f&&!b.isHidden&&!b.isFirstNode)b.isFirstNode=!0,f=b,d.setNodeLineIcos(c,b);else if(f&&b.isFirstNode){b.isFirstNode=!1;h=b;d.setNodeLineIcos(c,b);break}return{"new":f,old:h}},setLastNodeForHide:function(c,a){var b,e;for(e=a.length-1;e>=0;e--){b=a[e];if(b.isLastNode)break;if(!b.isHidden&&!b.isLastNode){b.isLastNode=!0;d.setNodeLineIcos(c,b);break}else b=null}return b},setLastNodeForShow:function(c,a){var b,e,g,f;for(e=a.length-1;e>=0;e--)if(b=a[e],!g&&!b.isHidden&&
b.isLastNode){g=b;break}else if(!g&&!b.isHidden&&!b.isLastNode)b.isLastNode=!0,g=b,d.setNodeLineIcos(c,b);else if(g&&b.isLastNode){b.isLastNode=!1;f=b;d.setNodeLineIcos(c,b);break}return{"new":g,old:f}}},data:{initHideForExCheck:function(c,a){if(a.isHidden&&c.check&&c.check.enable){if(typeof a._nocheck=="undefined")a._nocheck=!!a.nocheck,a.nocheck=!0;a.check_Child_State=-1;d.repairParentChkClassWithSelf&&d.repairParentChkClassWithSelf(c,a)}},initShowForExCheck:function(c,a){if(!a.isHidden&&c.check&&
c.check.enable){if(typeof a._nocheck!="undefined")a.nocheck=a._nocheck,delete a._nocheck;if(d.setChkClass){var b=j(a,l.id.CHECK,c);d.setChkClass(c,b,a)}d.repairParentChkClassWithSelf&&d.repairParentChkClassWithSelf(c,a)}}}});var i=i.fn.zTree,m=i._z.tools,l=i.consts,d=i._z.view,f=i._z.data,j=m.$;f.addInitNode(function(c,a,b){if(typeof b.isHidden=="string")b.isHidden=m.eqs(b.isHidden,"true");b.isHidden=!!b.isHidden;f.initHideForExCheck(c,b)});f.addBeforeA(function(){});f.addZTreeTools(function(c,a){a.showNodes=
function(a,b){d.showNodes(c,a,b)};a.showNode=function(a,b){a&&d.showNodes(c,[a],b)};a.hideNodes=function(a,b){d.hideNodes(c,a,b)};a.hideNode=function(a,b){a&&d.hideNodes(c,[a],b)};var b=a.checkNode;if(b)a.checkNode=function(c,d,f,h){(!c||!c.isHidden)&&b.apply(a,arguments)}});var n=f.initNode;f.initNode=function(c,a,b,e,g,i,h){var j=(e?e:f.getRoot(c))[c.data.key.children];f.tmpHideFirstNode=d.setFirstNodeForHide(c,j);f.tmpHideLastNode=d.setLastNodeForHide(c,j);h&&(d.setNodeLineIcos(c,f.tmpHideFirstNode),
d.setNodeLineIcos(c,f.tmpHideLastNode));g=f.tmpHideFirstNode===b;i=f.tmpHideLastNode===b;n&&n.apply(f,arguments);h&&i&&d.clearOldLastNode(c,b,h)};var o=f.makeChkFlag;if(o)f.makeChkFlag=function(c,a){(!a||!a.isHidden)&&o.apply(f,arguments)};var p=f.getTreeCheckedNodes;if(p)f.getTreeCheckedNodes=function(c,a,b,e){if(a&&a.length>0){var d=a[0].getParentNode();if(d&&d.isHidden)return[]}return p.apply(f,arguments)};var q=f.getTreeChangeCheckedNodes;if(q)f.getTreeChangeCheckedNodes=function(c,a,b){if(a&&
a.length>0){var d=a[0].getParentNode();if(d&&d.isHidden)return[]}return q.apply(f,arguments)};var r=d.expandCollapseSonNode;if(r)d.expandCollapseSonNode=function(c,a,b,e,f){(!a||!a.isHidden)&&r.apply(d,arguments)};var s=d.setSonNodeCheckBox;if(s)d.setSonNodeCheckBox=function(c,a,b,e){(!a||!a.isHidden)&&s.apply(d,arguments)};var t=d.repairParentChkClassWithSelf;if(t)d.repairParentChkClassWithSelf=function(c,a){(!a||!a.isHidden)&&t.apply(d,arguments)}})(jQuery);

/*
 * JQuery zTree exedit v3.5.19.1
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-10-26
 */
(function(v){var I={event:{DRAG:"ztree_drag",DROP:"ztree_drop",RENAME:"ztree_rename",DRAGMOVE:"ztree_dragmove"},id:{EDIT:"_edit",INPUT:"_input",REMOVE:"_remove"},move:{TYPE_INNER:"inner",TYPE_PREV:"prev",TYPE_NEXT:"next"},node:{CURSELECTED_EDIT:"curSelectedNode_Edit",TMPTARGET_TREE:"tmpTargetzTree",TMPTARGET_NODE:"tmpTargetNode"}},x={onHoverOverNode:function(b,a){var c=m.getSetting(b.data.treeId),d=m.getRoot(c);if(d.curHoverNode!=a)x.onHoverOutNode(b);d.curHoverNode=a;f.addHoverDom(c,a)},onHoverOutNode:function(b){var b=
m.getSetting(b.data.treeId),a=m.getRoot(b);if(a.curHoverNode&&!m.isSelectedNode(b,a.curHoverNode))f.removeTreeDom(b,a.curHoverNode),a.curHoverNode=null},onMousedownNode:function(b,a){function c(b){if(B.dragFlag==0&&Math.abs(N-b.clientX)<e.edit.drag.minMoveSize&&Math.abs(O-b.clientY)<e.edit.drag.minMoveSize)return!0;var a,c,n,k,i;i=e.data.key.children;M.css("cursor","pointer");if(B.dragFlag==0){if(g.apply(e.callback.beforeDrag,[e.treeId,l],!0)==!1)return r(b),!0;for(a=0,c=l.length;a<c;a++){if(a==0)B.dragNodeShowBefore=
[];n=l[a];n.isParent&&n.open?(f.expandCollapseNode(e,n,!n.open),B.dragNodeShowBefore[n.tId]=!0):B.dragNodeShowBefore[n.tId]=!1}B.dragFlag=1;t.showHoverDom=!1;g.showIfameMask(e,!0);n=!0;k=-1;if(l.length>1){var j=l[0].parentTId?l[0].getParentNode()[i]:m.getNodes(e);i=[];for(a=0,c=j.length;a<c;a++)if(B.dragNodeShowBefore[j[a].tId]!==void 0&&(n&&k>-1&&k+1!==a&&(n=!1),i.push(j[a]),k=a),l.length===i.length){l=i;break}}n&&(H=l[0].getPreNode(),R=l[l.length-1].getNextNode());D=o("<ul class='zTreeDragUL'></ul>",
e);for(a=0,c=l.length;a<c;a++)n=l[a],n.editNameFlag=!1,f.selectNode(e,n,a>0),f.removeTreeDom(e,n),a>e.edit.drag.maxShowNodeNum-1||(k=o("<li id='"+n.tId+"_tmp'></li>",e),k.append(o(n,d.id.A,e).clone()),k.css("padding","0"),k.children("#"+n.tId+d.id.A).removeClass(d.node.CURSELECTED),D.append(k),a==e.edit.drag.maxShowNodeNum-1&&(k=o("<li id='"+n.tId+"_moretmp'><a>  ...  </a></li>",e),D.append(k)));D.attr("id",l[0].tId+d.id.UL+"_tmp");D.addClass(e.treeObj.attr("class"));D.appendTo(M);A=o("<span class='tmpzTreeMove_arrow'></span>",
e);A.attr("id","zTreeMove_arrow_tmp");A.appendTo(M);e.treeObj.trigger(d.event.DRAG,[b,e.treeId,l])}if(B.dragFlag==1){s&&A.attr("id")==b.target.id&&u&&b.clientX+F.scrollLeft()+2>v("#"+u+d.id.A,s).offset().left?(n=v("#"+u+d.id.A,s),b.target=n.length>0?n.get(0):b.target):s&&(s.removeClass(d.node.TMPTARGET_TREE),u&&v("#"+u+d.id.A,s).removeClass(d.node.TMPTARGET_NODE+"_"+d.move.TYPE_PREV).removeClass(d.node.TMPTARGET_NODE+"_"+I.move.TYPE_NEXT).removeClass(d.node.TMPTARGET_NODE+"_"+I.move.TYPE_INNER));
u=s=null;J=!1;h=e;n=m.getSettings();for(var y in n)if(n[y].treeId&&n[y].edit.enable&&n[y].treeId!=e.treeId&&(b.target.id==n[y].treeId||v(b.target).parents("#"+n[y].treeId).length>0))J=!0,h=n[y];y=F.scrollTop();k=F.scrollLeft();i=h.treeObj.offset();a=h.treeObj.get(0).scrollHeight;n=h.treeObj.get(0).scrollWidth;c=b.clientY+y-i.top;var p=h.treeObj.height()+i.top-b.clientY-y,q=b.clientX+k-i.left,x=h.treeObj.width()+i.left-b.clientX-k;i=c<e.edit.drag.borderMax&&c>e.edit.drag.borderMin;var j=p<e.edit.drag.borderMax&&
p>e.edit.drag.borderMin,K=q<e.edit.drag.borderMax&&q>e.edit.drag.borderMin,G=x<e.edit.drag.borderMax&&x>e.edit.drag.borderMin,p=c>e.edit.drag.borderMin&&p>e.edit.drag.borderMin&&q>e.edit.drag.borderMin&&x>e.edit.drag.borderMin,q=i&&h.treeObj.scrollTop()<=0,x=j&&h.treeObj.scrollTop()+h.treeObj.height()+10>=a,P=K&&h.treeObj.scrollLeft()<=0,Q=G&&h.treeObj.scrollLeft()+h.treeObj.width()+10>=n;if(b.target&&g.isChildOrSelf(b.target,h.treeId)){for(var E=b.target;E&&E.tagName&&!g.eqs(E.tagName,"li")&&E.id!=
h.treeId;)E=E.parentNode;var S=!0;for(a=0,c=l.length;a<c;a++)if(n=l[a],E.id===n.tId){S=!1;break}else if(o(n,e).find("#"+E.id).length>0){S=!1;break}if(S&&b.target&&g.isChildOrSelf(b.target,E.id+d.id.A))s=v(E),u=E.id}n=l[0];if(p&&g.isChildOrSelf(b.target,h.treeId)){if(!s&&(b.target.id==h.treeId||q||x||P||Q)&&(J||!J&&n.parentTId))s=h.treeObj;i?h.treeObj.scrollTop(h.treeObj.scrollTop()-10):j&&h.treeObj.scrollTop(h.treeObj.scrollTop()+10);K?h.treeObj.scrollLeft(h.treeObj.scrollLeft()-10):G&&h.treeObj.scrollLeft(h.treeObj.scrollLeft()+
10);s&&s!=h.treeObj&&s.offset().left<h.treeObj.offset().left&&h.treeObj.scrollLeft(h.treeObj.scrollLeft()+s.offset().left-h.treeObj.offset().left)}D.css({top:b.clientY+y+3+"px",left:b.clientX+k+3+"px"});i=a=0;if(s&&s.attr("id")!=h.treeId){var z=u==null?null:m.getNodeCache(h,u);c=(b.ctrlKey||b.metaKey)&&e.edit.drag.isMove&&e.edit.drag.isCopy||!e.edit.drag.isMove&&e.edit.drag.isCopy;a=!!(H&&u===H.tId);i=!!(R&&u===R.tId);k=n.parentTId&&n.parentTId==u;n=(c||!i)&&g.apply(h.edit.drag.prev,[h.treeId,l,z],
!!h.edit.drag.prev);a=(c||!a)&&g.apply(h.edit.drag.next,[h.treeId,l,z],!!h.edit.drag.next);G=(c||!k)&&!(h.data.keep.leaf&&!z.isParent)&&g.apply(h.edit.drag.inner,[h.treeId,l,z],!!h.edit.drag.inner);if(!n&&!a&&!G){if(s=null,u="",w=d.move.TYPE_INNER,A.css({display:"none"}),window.zTreeMoveTimer)clearTimeout(window.zTreeMoveTimer),window.zTreeMoveTargetNodeTId=null}else{c=v("#"+u+d.id.A,s);i=z.isLastNode?null:v("#"+z.getNextNode().tId+d.id.A,s.next());j=c.offset().top;k=c.offset().left;K=n?G?0.25:a?
0.5:1:-1;G=a?G?0.75:n?0.5:0:-1;y=(b.clientY+y-j)/c.height();(K==1||y<=K&&y>=-0.2)&&n?(a=1-A.width(),i=j-A.height()/2,w=d.move.TYPE_PREV):(G==0||y>=G&&y<=1.2)&&a?(a=1-A.width(),i=i==null||z.isParent&&z.open?j+c.height()-A.height()/2:i.offset().top-A.height()/2,w=d.move.TYPE_NEXT):(a=5-A.width(),i=j,w=d.move.TYPE_INNER);A.css({display:"block",top:i+"px",left:k+a+"px"});c.addClass(d.node.TMPTARGET_NODE+"_"+w);if(T!=u||U!=w)L=(new Date).getTime();if(z&&z.isParent&&w==d.move.TYPE_INNER&&(y=!0,window.zTreeMoveTimer&&
window.zTreeMoveTargetNodeTId!==z.tId?(clearTimeout(window.zTreeMoveTimer),window.zTreeMoveTargetNodeTId=null):window.zTreeMoveTimer&&window.zTreeMoveTargetNodeTId===z.tId&&(y=!1),y))window.zTreeMoveTimer=setTimeout(function(){w==d.move.TYPE_INNER&&z&&z.isParent&&!z.open&&(new Date).getTime()-L>h.edit.drag.autoOpenTime&&g.apply(h.callback.beforeDragOpen,[h.treeId,z],!0)&&(f.switchNode(h,z),h.edit.drag.autoExpandTrigger&&h.treeObj.trigger(d.event.EXPAND,[h.treeId,z]))},h.edit.drag.autoOpenTime+50),
window.zTreeMoveTargetNodeTId=z.tId}}else if(w=d.move.TYPE_INNER,s&&g.apply(h.edit.drag.inner,[h.treeId,l,null],!!h.edit.drag.inner)?s.addClass(d.node.TMPTARGET_TREE):s=null,A.css({display:"none"}),window.zTreeMoveTimer)clearTimeout(window.zTreeMoveTimer),window.zTreeMoveTargetNodeTId=null;T=u;U=w;e.treeObj.trigger(d.event.DRAGMOVE,[b,e.treeId,l])}return!1}function r(b){if(window.zTreeMoveTimer)clearTimeout(window.zTreeMoveTimer),window.zTreeMoveTargetNodeTId=null;U=T=null;F.unbind("mousemove",c);
F.unbind("mouseup",r);F.unbind("selectstart",k);M.css("cursor","auto");s&&(s.removeClass(d.node.TMPTARGET_TREE),u&&v("#"+u+d.id.A,s).removeClass(d.node.TMPTARGET_NODE+"_"+d.move.TYPE_PREV).removeClass(d.node.TMPTARGET_NODE+"_"+I.move.TYPE_NEXT).removeClass(d.node.TMPTARGET_NODE+"_"+I.move.TYPE_INNER));g.showIfameMask(e,!1);t.showHoverDom=!0;if(B.dragFlag!=0){B.dragFlag=0;var a,i,j;for(a=0,i=l.length;a<i;a++)j=l[a],j.isParent&&B.dragNodeShowBefore[j.tId]&&!j.open&&(f.expandCollapseNode(e,j,!j.open),
delete B.dragNodeShowBefore[j.tId]);D&&D.remove();A&&A.remove();var p=(b.ctrlKey||b.metaKey)&&e.edit.drag.isMove&&e.edit.drag.isCopy||!e.edit.drag.isMove&&e.edit.drag.isCopy;!p&&s&&u&&l[0].parentTId&&u==l[0].parentTId&&w==d.move.TYPE_INNER&&(s=null);if(s){var q=u==null?null:m.getNodeCache(h,u);if(g.apply(e.callback.beforeDrop,[h.treeId,l,q,w,p],!0)==!1)f.selectNodes(x,l);else{var C=p?g.clone(l):l;a=function(){if(J){if(!p)for(var a=0,c=l.length;a<c;a++)f.removeNode(e,l[a]);w==d.move.TYPE_INNER?f.addNodes(h,
q,-1,C):f.addNodes(h,q.getParentNode(),w==d.move.TYPE_PREV?q.getIndex():q.getIndex()+1,C)}else if(p&&w==d.move.TYPE_INNER)f.addNodes(h,q,-1,C);else if(p)f.addNodes(h,q.getParentNode(),w==d.move.TYPE_PREV?q.getIndex():q.getIndex()+1,C);else if(w!=d.move.TYPE_NEXT)for(a=0,c=C.length;a<c;a++)f.moveNode(h,q,C[a],w,!1);else for(a=-1,c=C.length-1;a<c;c--)f.moveNode(h,q,C[c],w,!1);f.selectNodes(h,C);o(C[0],e).focus().blur();e.treeObj.trigger(d.event.DROP,[b,h.treeId,C,q,w,p])};w==d.move.TYPE_INNER&&g.canAsync(h,
q)?f.asyncNode(h,q,!1,a):a()}}else f.selectNodes(x,l),e.treeObj.trigger(d.event.DROP,[b,e.treeId,l,null,null,null])}}function k(){return!1}var i,j,e=m.getSetting(b.data.treeId),B=m.getRoot(e),t=m.getRoots();if(b.button==2||!e.edit.enable||!e.edit.drag.isCopy&&!e.edit.drag.isMove)return!0;var p=b.target,q=m.getRoot(e).curSelectedList,l=[];if(m.isSelectedNode(e,a))for(i=0,j=q.length;i<j;i++){if(q[i].editNameFlag&&g.eqs(p.tagName,"input")&&p.getAttribute("treeNode"+d.id.INPUT)!==null)return!0;l.push(q[i]);
if(l[0].parentTId!==q[i].parentTId){l=[a];break}}else l=[a];f.editNodeBlur=!0;f.cancelCurEditNode(e);var F=v(e.treeObj.get(0).ownerDocument),M=v(e.treeObj.get(0).ownerDocument.body),D,A,s,J=!1,h=e,x=e,H,R,T=null,U=null,u=null,w=d.move.TYPE_INNER,N=b.clientX,O=b.clientY,L=(new Date).getTime();g.uCanDo(e)&&F.bind("mousemove",c);F.bind("mouseup",r);F.bind("selectstart",k);b.preventDefault&&b.preventDefault();return!0}};v.extend(!0,v.fn.zTree.consts,I);v.extend(!0,v.fn.zTree._z,{tools:{getAbs:function(b){b=
b.getBoundingClientRect();return[b.left+(document.body.scrollLeft+document.documentElement.scrollLeft),b.top+(document.body.scrollTop+document.documentElement.scrollTop)]},inputFocus:function(b){b.get(0)&&(b.focus(),g.setCursorPosition(b.get(0),b.val().length))},inputSelect:function(b){b.get(0)&&(b.focus(),b.select())},setCursorPosition:function(b,a){if(b.setSelectionRange)b.focus(),b.setSelectionRange(a,a);else if(b.createTextRange){var c=b.createTextRange();c.collapse(!0);c.moveEnd("character",
a);c.moveStart("character",a);c.select()}},showIfameMask:function(b,a){for(var c=m.getRoot(b);c.dragMaskList.length>0;)c.dragMaskList[0].remove(),c.dragMaskList.shift();if(a)for(var d=o("iframe",b),f=0,i=d.length;f<i;f++){var j=d.get(f),e=g.getAbs(j),j=o("<div id='zTreeMask_"+f+"' class='zTreeMask' style='top:"+e[1]+"px; left:"+e[0]+"px; width:"+j.offsetWidth+"px; height:"+j.offsetHeight+"px;'></div>",b);j.appendTo(o("body",b));c.dragMaskList.push(j)}}},view:{addEditBtn:function(b,a){if(!(a.editNameFlag||
o(a,d.id.EDIT,b).length>0)&&g.apply(b.edit.showRenameBtn,[b.treeId,a],b.edit.showRenameBtn)){var c=o(a,d.id.A,b),r="<span class='"+d.className.BUTTON+" edit' id='"+a.tId+d.id.EDIT+"' title='"+g.apply(b.edit.renameTitle,[b.treeId,a],b.edit.renameTitle)+"' treeNode"+d.id.EDIT+" style='display:none;'></span>";c.append(r);o(a,d.id.EDIT,b).bind("click",function(){if(!g.uCanDo(b)||g.apply(b.callback.beforeEditName,[b.treeId,a],!0)==!1)return!1;f.editNode(b,a);return!1}).show()}},addRemoveBtn:function(b,
a){if(!(a.editNameFlag||o(a,d.id.REMOVE,b).length>0)&&g.apply(b.edit.showRemoveBtn,[b.treeId,a],b.edit.showRemoveBtn)){var c=o(a,d.id.A,b),r="<span class='"+d.className.BUTTON+" remove' id='"+a.tId+d.id.REMOVE+"' title='"+g.apply(b.edit.removeTitle,[b.treeId,a],b.edit.removeTitle)+"' treeNode"+d.id.REMOVE+" style='display:none;'></span>";c.append(r);o(a,d.id.REMOVE,b).bind("click",function(){if(!g.uCanDo(b)||g.apply(b.callback.beforeRemove,[b.treeId,a],!0)==!1)return!1;f.removeNode(b,a);b.treeObj.trigger(d.event.REMOVE,
[b.treeId,a]);return!1}).bind("mousedown",function(){return!0}).show()}},addHoverDom:function(b,a){if(m.getRoots().showHoverDom)a.isHover=!0,b.edit.enable&&(f.addEditBtn(b,a),f.addRemoveBtn(b,a)),g.apply(b.view.addHoverDom,[b.treeId,a])},cancelCurEditNode:function(b,a,c){var r=m.getRoot(b),k=b.data.key.name,i=r.curEditNode;if(i){var j=r.curEditInput,a=a?a:c?i[k]:j.val();if(g.apply(b.callback.beforeRename,[b.treeId,i,a,c],!0)===!1)return!1;i[k]=a;o(i,d.id.A,b).removeClass(d.node.CURSELECTED_EDIT);
j.unbind();f.setNodeName(b,i);i.editNameFlag=!1;r.curEditNode=null;r.curEditInput=null;f.selectNode(b,i,!1);b.treeObj.trigger(d.event.RENAME,[b.treeId,i,c])}return r.noSelection=!0},editNode:function(b,a){var c=m.getRoot(b);f.editNodeBlur=!1;if(m.isSelectedNode(b,a)&&c.curEditNode==a&&a.editNameFlag)setTimeout(function(){g.inputFocus(c.curEditInput)},0);else{var r=b.data.key.name;a.editNameFlag=!0;f.removeTreeDom(b,a);f.cancelCurEditNode(b);f.selectNode(b,a,!1);o(a,d.id.SPAN,b).html("<input type=text class='rename' id='"+
a.tId+d.id.INPUT+"' treeNode"+d.id.INPUT+" >");var k=o(a,d.id.INPUT,b);k.attr("value",a[r]);b.edit.editNameSelectAll?g.inputSelect(k):g.inputFocus(k);k.bind("blur",function(){f.editNodeBlur||f.cancelCurEditNode(b)}).bind("keydown",function(a){a.keyCode=="13"?(f.editNodeBlur=!0,f.cancelCurEditNode(b)):a.keyCode=="27"&&f.cancelCurEditNode(b,null,!0)}).bind("click",function(){return!1}).bind("dblclick",function(){return!1});o(a,d.id.A,b).addClass(d.node.CURSELECTED_EDIT);c.curEditInput=k;c.noSelection=
!1;c.curEditNode=a}},moveNode:function(b,a,c,r,k,i){var j=m.getRoot(b),e=b.data.key.children;if(a!=c&&(!b.data.keep.leaf||!a||a.isParent||r!=d.move.TYPE_INNER)){var g=c.parentTId?c.getParentNode():j,t=a===null||a==j;t&&a===null&&(a=j);if(t)r=d.move.TYPE_INNER;j=a.parentTId?a.getParentNode():j;if(r!=d.move.TYPE_PREV&&r!=d.move.TYPE_NEXT)r=d.move.TYPE_INNER;if(r==d.move.TYPE_INNER)if(t)c.parentTId=null;else{if(!a.isParent)a.isParent=!0,a.open=!!a.open,f.setNodeLineIcos(b,a);c.parentTId=a.tId}var p;
t?p=t=b.treeObj:(!i&&r==d.move.TYPE_INNER?f.expandCollapseNode(b,a,!0,!1):i||f.expandCollapseNode(b,a.getParentNode(),!0,!1),t=o(a,b),p=o(a,d.id.UL,b),t.get(0)&&!p.get(0)&&(p=[],f.makeUlHtml(b,a,p,""),t.append(p.join(""))),p=o(a,d.id.UL,b));var q=o(c,b);q.get(0)?t.get(0)||q.remove():q=f.appendNodes(b,c.level,[c],null,-1,!1,!0).join("");p.get(0)&&r==d.move.TYPE_INNER?p.append(q):t.get(0)&&r==d.move.TYPE_PREV?t.before(q):t.get(0)&&r==d.move.TYPE_NEXT&&t.after(q);var l=-1,v=0,x=null,t=null,D=c.level;
if(c.isFirstNode){if(l=0,g[e].length>1)x=g[e][1],x.isFirstNode=!0}else if(c.isLastNode)l=g[e].length-1,x=g[e][l-1],x.isLastNode=!0;else for(p=0,q=g[e].length;p<q;p++)if(g[e][p].tId==c.tId){l=p;break}l>=0&&g[e].splice(l,1);if(r!=d.move.TYPE_INNER)for(p=0,q=j[e].length;p<q;p++)j[e][p].tId==a.tId&&(v=p);if(r==d.move.TYPE_INNER){a[e]||(a[e]=[]);if(a[e].length>0)t=a[e][a[e].length-1],t.isLastNode=!1;a[e].splice(a[e].length,0,c);c.isLastNode=!0;c.isFirstNode=a[e].length==1}else a.isFirstNode&&r==d.move.TYPE_PREV?
(j[e].splice(v,0,c),t=a,t.isFirstNode=!1,c.parentTId=a.parentTId,c.isFirstNode=!0,c.isLastNode=!1):a.isLastNode&&r==d.move.TYPE_NEXT?(j[e].splice(v+1,0,c),t=a,t.isLastNode=!1,c.parentTId=a.parentTId,c.isFirstNode=!1,c.isLastNode=!0):(r==d.move.TYPE_PREV?j[e].splice(v,0,c):j[e].splice(v+1,0,c),c.parentTId=a.parentTId,c.isFirstNode=!1,c.isLastNode=!1);m.fixPIdKeyValue(b,c);m.setSonNodeLevel(b,c.getParentNode(),c);f.setNodeLineIcos(b,c);f.repairNodeLevelClass(b,c,D);!b.data.keep.parent&&g[e].length<
1?(g.isParent=!1,g.open=!1,a=o(g,d.id.UL,b),r=o(g,d.id.SWITCH,b),e=o(g,d.id.ICON,b),f.replaceSwitchClass(g,r,d.folder.DOCU),f.replaceIcoClass(g,e,d.folder.DOCU),a.css("display","none")):x&&f.setNodeLineIcos(b,x);t&&f.setNodeLineIcos(b,t);b.check&&b.check.enable&&f.repairChkClass&&(f.repairChkClass(b,g),f.repairParentChkClassWithSelf(b,g),g!=c.parent&&f.repairParentChkClassWithSelf(b,c));i||f.expandCollapseParentNode(b,c.getParentNode(),!0,k)}},removeEditBtn:function(b,a){o(a,d.id.EDIT,b).unbind().remove()},
removeRemoveBtn:function(b,a){o(a,d.id.REMOVE,b).unbind().remove()},removeTreeDom:function(b,a){a.isHover=!1;f.removeEditBtn(b,a);f.removeRemoveBtn(b,a);g.apply(b.view.removeHoverDom,[b.treeId,a])},repairNodeLevelClass:function(b,a,c){if(c!==a.level){var f=o(a,b),g=o(a,d.id.A,b),b=o(a,d.id.UL,b),c=d.className.LEVEL+c,a=d.className.LEVEL+a.level;f.removeClass(c);f.addClass(a);g.removeClass(c);g.addClass(a);b.removeClass(c);b.addClass(a)}},selectNodes:function(b,a){for(var c=0,d=a.length;c<d;c++)f.selectNode(b,
a[c],c>0)}},event:{},data:{setSonNodeLevel:function(b,a,c){if(c){var d=b.data.key.children;c.level=a?a.level+1:0;if(c[d])for(var a=0,f=c[d].length;a<f;a++)c[d][a]&&m.setSonNodeLevel(b,c,c[d][a])}}}});var H=v.fn.zTree,g=H._z.tools,d=H.consts,f=H._z.view,m=H._z.data,o=g.$;m.exSetting({edit:{enable:!1,editNameSelectAll:!1,showRemoveBtn:!0,showRenameBtn:!0,removeTitle:"remove",renameTitle:"rename",drag:{autoExpandTrigger:!1,isCopy:!0,isMove:!0,prev:!0,next:!0,inner:!0,minMoveSize:5,borderMax:10,borderMin:-5,
maxShowNodeNum:5,autoOpenTime:500}},view:{addHoverDom:null,removeHoverDom:null},callback:{beforeDrag:null,beforeDragOpen:null,beforeDrop:null,beforeEditName:null,beforeRename:null,onDrag:null,onDragMove:null,onDrop:null,onRename:null}});m.addInitBind(function(b){var a=b.treeObj,c=d.event;a.bind(c.RENAME,function(a,c,d,f){g.apply(b.callback.onRename,[a,c,d,f])});a.bind(c.DRAG,function(a,c,d,f){g.apply(b.callback.onDrag,[c,d,f])});a.bind(c.DRAGMOVE,function(a,c,d,f){g.apply(b.callback.onDragMove,[c,
d,f])});a.bind(c.DROP,function(a,c,d,f,e,m,o){g.apply(b.callback.onDrop,[c,d,f,e,m,o])})});m.addInitUnBind(function(b){var b=b.treeObj,a=d.event;b.unbind(a.RENAME);b.unbind(a.DRAG);b.unbind(a.DRAGMOVE);b.unbind(a.DROP)});m.addInitCache(function(){});m.addInitNode(function(b,a,c){if(c)c.isHover=!1,c.editNameFlag=!1});m.addInitProxy(function(b){var a=b.target,c=m.getSetting(b.data.treeId),f=b.relatedTarget,k="",i=null,j="",e=null,o=null;if(g.eqs(b.type,"mouseover")){if(o=g.getMDom(c,a,[{tagName:"a",
attrName:"treeNode"+d.id.A}]))k=g.getNodeMainDom(o).id,j="hoverOverNode"}else if(g.eqs(b.type,"mouseout"))o=g.getMDom(c,f,[{tagName:"a",attrName:"treeNode"+d.id.A}]),o||(k="remove",j="hoverOutNode");else if(g.eqs(b.type,"mousedown")&&(o=g.getMDom(c,a,[{tagName:"a",attrName:"treeNode"+d.id.A}])))k=g.getNodeMainDom(o).id,j="mousedownNode";if(k.length>0)switch(i=m.getNodeCache(c,k),j){case "mousedownNode":e=x.onMousedownNode;break;case "hoverOverNode":e=x.onHoverOverNode;break;case "hoverOutNode":e=
x.onHoverOutNode}return{stop:!1,node:i,nodeEventType:j,nodeEventCallback:e,treeEventType:"",treeEventCallback:null}});m.addInitRoot(function(b){var b=m.getRoot(b),a=m.getRoots();b.curEditNode=null;b.curEditInput=null;b.curHoverNode=null;b.dragFlag=0;b.dragNodeShowBefore=[];b.dragMaskList=[];a.showHoverDom=!0});m.addZTreeTools(function(b,a){a.cancelEditName=function(a){m.getRoot(this.setting).curEditNode&&f.cancelCurEditNode(this.setting,a?a:null,!0)};a.copyNode=function(a,b,k,i){if(!b)return null;
if(a&&!a.isParent&&this.setting.data.keep.leaf&&k===d.move.TYPE_INNER)return null;var j=this,e=g.clone(b);if(!a)a=null,k=d.move.TYPE_INNER;k==d.move.TYPE_INNER?(b=function(){f.addNodes(j.setting,a,-1,[e],i)},g.canAsync(this.setting,a)?f.asyncNode(this.setting,a,i,b):b()):(f.addNodes(this.setting,a.parentNode,-1,[e],i),f.moveNode(this.setting,a,e,k,!1,i));return e};a.editName=function(a){a&&a.tId&&a===m.getNodeCache(this.setting,a.tId)&&(a.parentTId&&f.expandCollapseParentNode(this.setting,a.getParentNode(),
!0),f.editNode(this.setting,a))};a.moveNode=function(a,b,k,i){function j(){f.moveNode(e.setting,a,b,k,!1,i)}if(!b)return b;if(a&&!a.isParent&&this.setting.data.keep.leaf&&k===d.move.TYPE_INNER)return null;else if(a&&(b.parentTId==a.tId&&k==d.move.TYPE_INNER||o(b,this.setting).find("#"+a.tId).length>0))return null;else a||(a=null);var e=this;g.canAsync(this.setting,a)&&k===d.move.TYPE_INNER?f.asyncNode(this.setting,a,i,j):j();return b};a.setEditable=function(a){this.setting.edit.enable=a;return this.refresh()}});
var N=f.cancelPreSelectedNode;f.cancelPreSelectedNode=function(b,a){for(var c=m.getRoot(b).curSelectedList,d=0,g=c.length;d<g;d++)if(!a||a===c[d])if(f.removeTreeDom(b,c[d]),a)break;N&&N.apply(f,arguments)};var O=f.createNodes;f.createNodes=function(b,a,c,d,g){O&&O.apply(f,arguments);c&&f.repairParentChkClassWithSelf&&f.repairParentChkClassWithSelf(b,d)};var V=f.makeNodeUrl;f.makeNodeUrl=function(b,a){return b.edit.enable?null:V.apply(f,arguments)};var L=f.removeNode;f.removeNode=function(b,a){var c=
m.getRoot(b);if(c.curEditNode===a)c.curEditNode=null;L&&L.apply(f,arguments)};var P=f.selectNode;f.selectNode=function(b,a,c){var d=m.getRoot(b);if(m.isSelectedNode(b,a)&&d.curEditNode==a&&a.editNameFlag)return!1;P&&P.apply(f,arguments);f.addHoverDom(b,a);return!0};var Q=g.uCanDo;g.uCanDo=function(b,a){var c=m.getRoot(b);if(a&&(g.eqs(a.type,"mouseover")||g.eqs(a.type,"mouseout")||g.eqs(a.type,"mousedown")||g.eqs(a.type,"mouseup")))return!0;if(c.curEditNode)f.editNodeBlur=!1,c.curEditInput.focus();
return!c.curEditNode&&(Q?Q.apply(f,arguments):!0)}})(jQuery);

