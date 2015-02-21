/*!
 * Knockout JavaScript library v3.2.0
 * (c) Steven Sanderson - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function() {(function(p){var s=this||(0,eval)("this"),v=s.document,L=s.navigator,w=s.jQuery,D=s.JSON;(function(p){"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?p(module.exports||exports,require):"function"===typeof define&&define.amd?define('knockout',["exports","require"],p):p(s.ko={})})(function(M,N){function H(a,d){return null===a||typeof a in R?a===d:!1}function S(a,d){var c;return function(){c||(c=setTimeout(function(){c=p;a()},d))}}function T(a,d){var c;return function(){clearTimeout(c);
c=setTimeout(a,d)}}function I(b,d,c,e){a.d[b]={init:function(b,h,k,f,m){var l,q;a.s(function(){var f=a.a.c(h()),k=!c!==!f,z=!q;if(z||d||k!==l)z&&a.Y.la()&&(q=a.a.ia(a.f.childNodes(b),!0)),k?(z||a.f.T(b,a.a.ia(q)),a.Ca(e?e(m,f):m,b)):a.f.ja(b),l=k},null,{o:b});return{controlsDescendantBindings:!0}}};a.h.ha[b]=!1;a.f.Q[b]=!0}var a="undefined"!==typeof M?M:{};a.b=function(b,d){for(var c=b.split("."),e=a,g=0;g<c.length-1;g++)e=e[c[g]];e[c[c.length-1]]=d};a.A=function(a,d,c){a[d]=c};a.version="3.2.0";
a.b("version",a.version);a.a=function(){function b(a,b){for(var c in a)a.hasOwnProperty(c)&&b(c,a[c])}function d(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function c(a,b){a.__proto__=b;return a}var e={__proto__:[]}instanceof Array,g={},h={};g[L&&/Firefox\/2/i.test(L.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];g.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");b(g,function(a,b){if(b.length)for(var c=
0,d=b.length;c<d;c++)h[b[c]]=a});var k={propertychange:!0},f=v&&function(){for(var a=3,b=v.createElement("div"),c=b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+ ++a+"]><i></i><![endif]--\x3e",c[0];);return 4<a?a:p}();return{vb:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],u:function(a,b){for(var c=0,d=a.length;c<d;c++)b(a[c],c)},m:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var c=0,d=a.length;c<d;c++)if(a[c]===
b)return c;return-1},qb:function(a,b,c){for(var d=0,f=a.length;d<f;d++)if(b.call(c,a[d],d))return a[d];return null},ua:function(m,b){var c=a.a.m(m,b);0<c?m.splice(c,1):0===c&&m.shift()},rb:function(m){m=m||[];for(var b=[],c=0,d=m.length;c<d;c++)0>a.a.m(b,m[c])&&b.push(m[c]);return b},Da:function(a,b){a=a||[];for(var c=[],d=0,f=a.length;d<f;d++)c.push(b(a[d],d));return c},ta:function(a,b){a=a||[];for(var c=[],d=0,f=a.length;d<f;d++)b(a[d],d)&&c.push(a[d]);return c},ga:function(a,b){if(b instanceof
Array)a.push.apply(a,b);else for(var c=0,d=b.length;c<d;c++)a.push(b[c]);return a},ea:function(b,c,d){var f=a.a.m(a.a.Xa(b),c);0>f?d&&b.push(c):d||b.splice(f,1)},xa:e,extend:d,za:c,Aa:e?c:d,G:b,na:function(a,b){if(!a)return a;var c={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=b(a[d],d,a));return c},Ka:function(b){for(;b.firstChild;)a.removeNode(b.firstChild)},oc:function(b){b=a.a.S(b);for(var c=v.createElement("div"),d=0,f=b.length;d<f;d++)c.appendChild(a.R(b[d]));return c},ia:function(b,c){for(var d=
0,f=b.length,e=[];d<f;d++){var k=b[d].cloneNode(!0);e.push(c?a.R(k):k)}return e},T:function(b,c){a.a.Ka(b);if(c)for(var d=0,f=c.length;d<f;d++)b.appendChild(c[d])},Lb:function(b,c){var d=b.nodeType?[b]:b;if(0<d.length){for(var f=d[0],e=f.parentNode,k=0,g=c.length;k<g;k++)e.insertBefore(c[k],f);k=0;for(g=d.length;k<g;k++)a.removeNode(d[k])}},ka:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.shift();if(1<a.length){var c=a[0],d=a[a.length-1];for(a.length=
0;c!==d;)if(a.push(c),c=c.nextSibling,!c)return;a.push(d)}}return a},Nb:function(a,b){7>f?a.setAttribute("selected",b):a.selected=b},cb:function(a){return null===a||a===p?"":a.trim?a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},vc:function(a,b){a=a||"";return b.length>a.length?!1:a.substring(0,b.length)===b},cc:function(a,b){if(a===b)return!0;if(11===a.nodeType)return!1;if(b.contains)return b.contains(3===a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==(b.compareDocumentPosition(a)&
16);for(;a&&a!=b;)a=a.parentNode;return!!a},Ja:function(b){return a.a.cc(b,b.ownerDocument.documentElement)},ob:function(b){return!!a.a.qb(b,a.a.Ja)},t:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},n:function(b,c,d){var e=f&&k[c];if(!e&&w)w(b).bind(c,d);else if(e||"function"!=typeof b.addEventListener)if("undefined"!=typeof b.attachEvent){var g=function(a){d.call(b,a)},h="on"+c;b.attachEvent(h,g);a.a.w.da(b,function(){b.detachEvent(h,g)})}else throw Error("Browser doesn't support addEventListener or attachEvent");
else b.addEventListener(c,d,!1)},oa:function(b,c){if(!b||!b.nodeType)throw Error("element must be a DOM node when calling triggerEvent");var d;"input"===a.a.t(b)&&b.type&&"click"==c.toLowerCase()?(d=b.type,d="checkbox"==d||"radio"==d):d=!1;if(w&&!d)w(b).trigger(c);else if("function"==typeof v.createEvent)if("function"==typeof b.dispatchEvent)d=v.createEvent(h[c]||"HTMLEvents"),d.initEvent(c,!0,!0,s,0,0,0,0,0,!1,!1,!1,!1,0,b),b.dispatchEvent(d);else throw Error("The supplied element doesn't support dispatchEvent");
else if(d&&b.click)b.click();else if("undefined"!=typeof b.fireEvent)b.fireEvent("on"+c);else throw Error("Browser doesn't support triggering events");},c:function(b){return a.C(b)?b():b},Xa:function(b){return a.C(b)?b.v():b},Ba:function(b,c,d){if(c){var f=/\S+/g,e=b.className.match(f)||[];a.a.u(c.match(f),function(b){a.a.ea(e,b,d)});b.className=e.join(" ")}},bb:function(b,c){var d=a.a.c(c);if(null===d||d===p)d="";var f=a.f.firstChild(b);!f||3!=f.nodeType||a.f.nextSibling(f)?a.f.T(b,[b.ownerDocument.createTextNode(d)]):
f.data=d;a.a.fc(b)},Mb:function(a,b){a.name=b;if(7>=f)try{a.mergeAttributes(v.createElement("<input name='"+a.name+"'/>"),!1)}catch(c){}},fc:function(a){9<=f&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},dc:function(a){if(f){var b=a.style.width;a.style.width=0;a.style.width=b}},sc:function(b,c){b=a.a.c(b);c=a.a.c(c);for(var d=[],f=b;f<=c;f++)d.push(f);return d},S:function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c]);return b},yc:6===f,zc:7===f,L:f,xb:function(b,c){for(var d=
a.a.S(b.getElementsByTagName("input")).concat(a.a.S(b.getElementsByTagName("textarea"))),f="string"==typeof c?function(a){return a.name===c}:function(a){return c.test(a.name)},e=[],k=d.length-1;0<=k;k--)f(d[k])&&e.push(d[k]);return e},pc:function(b){return"string"==typeof b&&(b=a.a.cb(b))?D&&D.parse?D.parse(b):(new Function("return "+b))():null},eb:function(b,c,d){if(!D||!D.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
return D.stringify(a.a.c(b),c,d)},qc:function(c,d,f){f=f||{};var e=f.params||{},k=f.includeFields||this.vb,g=c;if("object"==typeof c&&"form"===a.a.t(c))for(var g=c.action,h=k.length-1;0<=h;h--)for(var r=a.a.xb(c,k[h]),E=r.length-1;0<=E;E--)e[r[E].name]=r[E].value;d=a.a.c(d);var y=v.createElement("form");y.style.display="none";y.action=g;y.method="post";for(var p in d)c=v.createElement("input"),c.type="hidden",c.name=p,c.value=a.a.eb(a.a.c(d[p])),y.appendChild(c);b(e,function(a,b){var c=v.createElement("input");
c.type="hidden";c.name=a;c.value=b;y.appendChild(c)});v.body.appendChild(y);f.submitter?f.submitter(y):y.submit();setTimeout(function(){y.parentNode.removeChild(y)},0)}}}();a.b("utils",a.a);a.b("utils.arrayForEach",a.a.u);a.b("utils.arrayFirst",a.a.qb);a.b("utils.arrayFilter",a.a.ta);a.b("utils.arrayGetDistinctValues",a.a.rb);a.b("utils.arrayIndexOf",a.a.m);a.b("utils.arrayMap",a.a.Da);a.b("utils.arrayPushAll",a.a.ga);a.b("utils.arrayRemoveItem",a.a.ua);a.b("utils.extend",a.a.extend);a.b("utils.fieldsIncludedWithJsonPost",
a.a.vb);a.b("utils.getFormFields",a.a.xb);a.b("utils.peekObservable",a.a.Xa);a.b("utils.postJson",a.a.qc);a.b("utils.parseJson",a.a.pc);a.b("utils.registerEventHandler",a.a.n);a.b("utils.stringifyJson",a.a.eb);a.b("utils.range",a.a.sc);a.b("utils.toggleDomNodeCssClass",a.a.Ba);a.b("utils.triggerEvent",a.a.oa);a.b("utils.unwrapObservable",a.a.c);a.b("utils.objectForEach",a.a.G);a.b("utils.addOrRemoveItem",a.a.ea);a.b("unwrap",a.a.c);Function.prototype.bind||(Function.prototype.bind=function(a){var d=
this,c=Array.prototype.slice.call(arguments);a=c.shift();return function(){return d.apply(a,c.concat(Array.prototype.slice.call(arguments)))}});a.a.e=new function(){function a(b,h){var k=b[c];if(!k||"null"===k||!e[k]){if(!h)return p;k=b[c]="ko"+d++;e[k]={}}return e[k]}var d=0,c="__ko__"+(new Date).getTime(),e={};return{get:function(c,d){var e=a(c,!1);return e===p?p:e[d]},set:function(c,d,e){if(e!==p||a(c,!1)!==p)a(c,!0)[d]=e},clear:function(a){var b=a[c];return b?(delete e[b],a[c]=null,!0):!1},F:function(){return d++ +
c}}};a.b("utils.domData",a.a.e);a.b("utils.domData.clear",a.a.e.clear);a.a.w=new function(){function b(b,d){var f=a.a.e.get(b,c);f===p&&d&&(f=[],a.a.e.set(b,c,f));return f}function d(c){var e=b(c,!1);if(e)for(var e=e.slice(0),f=0;f<e.length;f++)e[f](c);a.a.e.clear(c);a.a.w.cleanExternalData(c);if(g[c.nodeType])for(e=c.firstChild;c=e;)e=c.nextSibling,8===c.nodeType&&d(c)}var c=a.a.e.F(),e={1:!0,8:!0,9:!0},g={1:!0,9:!0};return{da:function(a,c){if("function"!=typeof c)throw Error("Callback must be a function");
b(a,!0).push(c)},Kb:function(d,e){var f=b(d,!1);f&&(a.a.ua(f,e),0==f.length&&a.a.e.set(d,c,p))},R:function(b){if(e[b.nodeType]&&(d(b),g[b.nodeType])){var c=[];a.a.ga(c,b.getElementsByTagName("*"));for(var f=0,m=c.length;f<m;f++)d(c[f])}return b},removeNode:function(b){a.R(b);b.parentNode&&b.parentNode.removeChild(b)},cleanExternalData:function(a){w&&"function"==typeof w.cleanData&&w.cleanData([a])}}};a.R=a.a.w.R;a.removeNode=a.a.w.removeNode;a.b("cleanNode",a.R);a.b("removeNode",a.removeNode);a.b("utils.domNodeDisposal",
a.a.w);a.b("utils.domNodeDisposal.addDisposeCallback",a.a.w.da);a.b("utils.domNodeDisposal.removeDisposeCallback",a.a.w.Kb);(function(){a.a.ba=function(b){var d;if(w)if(w.parseHTML)d=w.parseHTML(b)||[];else{if((d=w.clean([b]))&&d[0]){for(b=d[0];b.parentNode&&11!==b.parentNode.nodeType;)b=b.parentNode;b.parentNode&&b.parentNode.removeChild(b)}}else{var c=a.a.cb(b).toLowerCase();d=v.createElement("div");c=c.match(/^<(thead|tbody|tfoot)/)&&[1,"<table>","</table>"]||!c.indexOf("<tr")&&[2,"<table><tbody>",
"</tbody></table>"]||(!c.indexOf("<td")||!c.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||[0,"",""];b="ignored<div>"+c[1]+b+c[2]+"</div>";for("function"==typeof s.innerShiv?d.appendChild(s.innerShiv(b)):d.innerHTML=b;c[0]--;)d=d.lastChild;d=a.a.S(d.lastChild.childNodes)}return d};a.a.$a=function(b,d){a.a.Ka(b);d=a.a.c(d);if(null!==d&&d!==p)if("string"!=typeof d&&(d=d.toString()),w)w(b).html(d);else for(var c=a.a.ba(d),e=0;e<c.length;e++)b.appendChild(c[e])}})();a.b("utils.parseHtmlFragment",
a.a.ba);a.b("utils.setHtml",a.a.$a);a.D=function(){function b(c,d){if(c)if(8==c.nodeType){var g=a.D.Gb(c.nodeValue);null!=g&&d.push({bc:c,mc:g})}else if(1==c.nodeType)for(var g=0,h=c.childNodes,k=h.length;g<k;g++)b(h[g],d)}var d={};return{Ua:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);d[b]=a;return"\x3c!--[ko_memo:"+
b+"]--\x3e"},Rb:function(a,b){var g=d[a];if(g===p)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return g.apply(null,b||[]),!0}finally{delete d[a]}},Sb:function(c,d){var g=[];b(c,g);for(var h=0,k=g.length;h<k;h++){var f=g[h].bc,m=[f];d&&a.a.ga(m,d);a.D.Rb(g[h].mc,m);f.nodeValue="";f.parentNode&&f.parentNode.removeChild(f)}},Gb:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();a.b("memoization",a.D);a.b("memoization.memoize",a.D.Ua);
a.b("memoization.unmemoize",a.D.Rb);a.b("memoization.parseMemoText",a.D.Gb);a.b("memoization.unmemoizeDomNodeAndDescendants",a.D.Sb);a.La={throttle:function(b,d){b.throttleEvaluation=d;var c=null;return a.j({read:b,write:function(a){clearTimeout(c);c=setTimeout(function(){b(a)},d)}})},rateLimit:function(a,d){var c,e,g;"number"==typeof d?c=d:(c=d.timeout,e=d.method);g="notifyWhenChangesStop"==e?T:S;a.Ta(function(a){return g(a,c)})},notify:function(a,d){a.equalityComparer="always"==d?null:H}};var R=
{undefined:1,"boolean":1,number:1,string:1};a.b("extenders",a.La);a.Pb=function(b,d,c){this.target=b;this.wa=d;this.ac=c;this.Cb=!1;a.A(this,"dispose",this.K)};a.Pb.prototype.K=function(){this.Cb=!0;this.ac()};a.P=function(){a.a.Aa(this,a.P.fn);this.M={}};var G="change",A={U:function(b,d,c){var e=this;c=c||G;var g=new a.Pb(e,d?b.bind(d):b,function(){a.a.ua(e.M[c],g);e.nb&&e.nb()});e.va&&e.va(c);e.M[c]||(e.M[c]=[]);e.M[c].push(g);return g},notifySubscribers:function(b,d){d=d||G;if(this.Ab(d))try{a.k.Ea();
for(var c=this.M[d].slice(0),e=0,g;g=c[e];++e)g.Cb||g.wa(b)}finally{a.k.end()}},Ta:function(b){var d=this,c=a.C(d),e,g,h;d.qa||(d.qa=d.notifySubscribers,d.notifySubscribers=function(a,b){b&&b!==G?"beforeChange"===b?d.kb(a):d.qa(a,b):d.lb(a)});var k=b(function(){c&&h===d&&(h=d());e=!1;d.Pa(g,h)&&d.qa(g=h)});d.lb=function(a){e=!0;h=a;k()};d.kb=function(a){e||(g=a,d.qa(a,"beforeChange"))}},Ab:function(a){return this.M[a]&&this.M[a].length},yb:function(){var b=0;a.a.G(this.M,function(a,c){b+=c.length});
return b},Pa:function(a,d){return!this.equalityComparer||!this.equalityComparer(a,d)},extend:function(b){var d=this;b&&a.a.G(b,function(b,e){var g=a.La[b];"function"==typeof g&&(d=g(d,e)||d)});return d}};a.A(A,"subscribe",A.U);a.A(A,"extend",A.extend);a.A(A,"getSubscriptionsCount",A.yb);a.a.xa&&a.a.za(A,Function.prototype);a.P.fn=A;a.Db=function(a){return null!=a&&"function"==typeof a.U&&"function"==typeof a.notifySubscribers};a.b("subscribable",a.P);a.b("isSubscribable",a.Db);a.Y=a.k=function(){function b(a){c.push(e);
e=a}function d(){e=c.pop()}var c=[],e,g=0;return{Ea:b,end:d,Jb:function(b){if(e){if(!a.Db(b))throw Error("Only subscribable things can act as dependencies");e.wa(b,b.Vb||(b.Vb=++g))}},B:function(a,c,f){try{return b(),a.apply(c,f||[])}finally{d()}},la:function(){if(e)return e.s.la()},ma:function(){if(e)return e.ma}}}();a.b("computedContext",a.Y);a.b("computedContext.getDependenciesCount",a.Y.la);a.b("computedContext.isInitial",a.Y.ma);a.b("computedContext.isSleeping",a.Y.Ac);a.p=function(b){function d(){if(0<
arguments.length)return d.Pa(c,arguments[0])&&(d.X(),c=arguments[0],d.W()),this;a.k.Jb(d);return c}var c=b;a.P.call(d);a.a.Aa(d,a.p.fn);d.v=function(){return c};d.W=function(){d.notifySubscribers(c)};d.X=function(){d.notifySubscribers(c,"beforeChange")};a.A(d,"peek",d.v);a.A(d,"valueHasMutated",d.W);a.A(d,"valueWillMutate",d.X);return d};a.p.fn={equalityComparer:H};var F=a.p.rc="__ko_proto__";a.p.fn[F]=a.p;a.a.xa&&a.a.za(a.p.fn,a.P.fn);a.Ma=function(b,d){return null===b||b===p||b[F]===p?!1:b[F]===
d?!0:a.Ma(b[F],d)};a.C=function(b){return a.Ma(b,a.p)};a.Ra=function(b){return"function"==typeof b&&b[F]===a.p||"function"==typeof b&&b[F]===a.j&&b.hc?!0:!1};a.b("observable",a.p);a.b("isObservable",a.C);a.b("isWriteableObservable",a.Ra);a.b("isWritableObservable",a.Ra);a.aa=function(b){b=b||[];if("object"!=typeof b||!("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");b=a.p(b);a.a.Aa(b,a.aa.fn);return b.extend({trackArrayChanges:!0})};
a.aa.fn={remove:function(b){for(var d=this.v(),c=[],e="function"!=typeof b||a.C(b)?function(a){return a===b}:b,g=0;g<d.length;g++){var h=d[g];e(h)&&(0===c.length&&this.X(),c.push(h),d.splice(g,1),g--)}c.length&&this.W();return c},removeAll:function(b){if(b===p){var d=this.v(),c=d.slice(0);this.X();d.splice(0,d.length);this.W();return c}return b?this.remove(function(c){return 0<=a.a.m(b,c)}):[]},destroy:function(b){var d=this.v(),c="function"!=typeof b||a.C(b)?function(a){return a===b}:b;this.X();
for(var e=d.length-1;0<=e;e--)c(d[e])&&(d[e]._destroy=!0);this.W()},destroyAll:function(b){return b===p?this.destroy(function(){return!0}):b?this.destroy(function(d){return 0<=a.a.m(b,d)}):[]},indexOf:function(b){var d=this();return a.a.m(d,b)},replace:function(a,d){var c=this.indexOf(a);0<=c&&(this.X(),this.v()[c]=d,this.W())}};a.a.u("pop push reverse shift sort splice unshift".split(" "),function(b){a.aa.fn[b]=function(){var a=this.v();this.X();this.sb(a,b,arguments);a=a[b].apply(a,arguments);this.W();
return a}});a.a.u(["slice"],function(b){a.aa.fn[b]=function(){var a=this();return a[b].apply(a,arguments)}});a.a.xa&&a.a.za(a.aa.fn,a.p.fn);a.b("observableArray",a.aa);var J="arrayChange";a.La.trackArrayChanges=function(b){function d(){if(!c){c=!0;var d=b.notifySubscribers;b.notifySubscribers=function(a,b){b&&b!==G||++g;return d.apply(this,arguments)};var f=[].concat(b.v()||[]);e=null;b.U(function(c){c=[].concat(c||[]);if(b.Ab(J)){var d;if(!e||1<g)e=a.a.Fa(f,c,{sparse:!0});d=e;d.length&&b.notifySubscribers(d,
J)}f=c;e=null;g=0})}}if(!b.sb){var c=!1,e=null,g=0,h=b.U;b.U=b.subscribe=function(a,b,c){c===J&&d();return h.apply(this,arguments)};b.sb=function(b,d,m){function l(a,b,c){return q[q.length]={status:a,value:b,index:c}}if(c&&!g){var q=[],h=b.length,t=m.length,z=0;switch(d){case "push":z=h;case "unshift":for(d=0;d<t;d++)l("added",m[d],z+d);break;case "pop":z=h-1;case "shift":h&&l("deleted",b[z],z);break;case "splice":d=Math.min(Math.max(0,0>m[0]?h+m[0]:m[0]),h);for(var h=1===t?h:Math.min(d+(m[1]||0),
h),t=d+t-2,z=Math.max(h,t),u=[],r=[],E=2;d<z;++d,++E)d<h&&r.push(l("deleted",b[d],d)),d<t&&u.push(l("added",m[E],d));a.a.wb(r,u);break;default:return}e=q}}}};a.s=a.j=function(b,d,c){function e(){a.a.G(v,function(a,b){b.K()});v={}}function g(){e();C=0;u=!0;n=!1}function h(){var a=f.throttleEvaluation;a&&0<=a?(clearTimeout(P),P=setTimeout(k,a)):f.ib?f.ib():k()}function k(b){if(t){if(E)throw Error("A 'pure' computed must not be called recursively");}else if(!u){if(w&&w()){if(!z){s();return}}else z=!1;
t=!0;if(y)try{var c={};a.k.Ea({wa:function(a,b){c[b]||(c[b]=1,++C)},s:f,ma:p});C=0;q=r.call(d)}finally{a.k.end(),t=!1}else try{var e=v,m=C;a.k.Ea({wa:function(a,b){u||(m&&e[b]?(v[b]=e[b],++C,delete e[b],--m):v[b]||(v[b]=a.U(h),++C))},s:f,ma:E?p:!C});v={};C=0;try{var l=d?r.call(d):r()}finally{a.k.end(),m&&a.a.G(e,function(a,b){b.K()}),n=!1}f.Pa(q,l)&&(f.notifySubscribers(q,"beforeChange"),q=l,!0!==b&&f.notifySubscribers(q))}finally{t=!1}C||s()}}function f(){if(0<arguments.length){if("function"===typeof O)O.apply(d,
arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");return this}a.k.Jb(f);n&&k(!0);return q}function m(){n&&!C&&k(!0);return q}function l(){return n||0<C}var q,n=!0,t=!1,z=!1,u=!1,r=b,E=!1,y=!1;r&&"object"==typeof r?(c=r,r=c.read):(c=c||{},r||(r=c.read));if("function"!=typeof r)throw Error("Pass a function that returns the value of the ko.computed");var O=c.write,x=c.disposeWhenNodeIsRemoved||
c.o||null,B=c.disposeWhen||c.Ia,w=B,s=g,v={},C=0,P=null;d||(d=c.owner);a.P.call(f);a.a.Aa(f,a.j.fn);f.v=m;f.la=function(){return C};f.hc="function"===typeof c.write;f.K=function(){s()};f.Z=l;var A=f.Ta;f.Ta=function(a){A.call(f,a);f.ib=function(){f.kb(q);n=!0;f.lb(f)}};c.pure?(y=E=!0,f.va=function(){y&&(y=!1,k(!0))},f.nb=function(){f.yb()||(e(),y=n=!0)}):c.deferEvaluation&&(f.va=function(){m();delete f.va});a.A(f,"peek",f.v);a.A(f,"dispose",f.K);a.A(f,"isActive",f.Z);a.A(f,"getDependenciesCount",
f.la);x&&(z=!0,x.nodeType&&(w=function(){return!a.a.Ja(x)||B&&B()}));y||c.deferEvaluation||k();x&&l()&&x.nodeType&&(s=function(){a.a.w.Kb(x,s);g()},a.a.w.da(x,s));return f};a.jc=function(b){return a.Ma(b,a.j)};A=a.p.rc;a.j[A]=a.p;a.j.fn={equalityComparer:H};a.j.fn[A]=a.j;a.a.xa&&a.a.za(a.j.fn,a.P.fn);a.b("dependentObservable",a.j);a.b("computed",a.j);a.b("isComputed",a.jc);a.Ib=function(b,d){if("function"===typeof b)return a.s(b,d,{pure:!0});b=a.a.extend({},b);b.pure=!0;return a.s(b,d)};a.b("pureComputed",
a.Ib);(function(){function b(a,g,h){h=h||new c;a=g(a);if("object"!=typeof a||null===a||a===p||a instanceof Date||a instanceof String||a instanceof Number||a instanceof Boolean)return a;var k=a instanceof Array?[]:{};h.save(a,k);d(a,function(c){var d=g(a[c]);switch(typeof d){case "boolean":case "number":case "string":case "function":k[c]=d;break;case "object":case "undefined":var l=h.get(d);k[c]=l!==p?l:b(d,g,h)}});return k}function d(a,b){if(a instanceof Array){for(var c=0;c<a.length;c++)b(c);"function"==
typeof a.toJSON&&b("toJSON")}else for(c in a)b(c)}function c(){this.keys=[];this.hb=[]}a.Qb=function(c){if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");return b(c,function(b){for(var c=0;a.C(b)&&10>c;c++)b=b();return b})};a.toJSON=function(b,c,d){b=a.Qb(b);return a.a.eb(b,c,d)};c.prototype={save:function(b,c){var d=a.a.m(this.keys,b);0<=d?this.hb[d]=c:(this.keys.push(b),this.hb.push(c))},get:function(b){b=a.a.m(this.keys,b);return 0<=b?this.hb[b]:p}}})();
a.b("toJS",a.Qb);a.b("toJSON",a.toJSON);(function(){a.i={q:function(b){switch(a.a.t(b)){case "option":return!0===b.__ko__hasDomDataOptionValue__?a.a.e.get(b,a.d.options.Va):7>=a.a.L?b.getAttributeNode("value")&&b.getAttributeNode("value").specified?b.value:b.text:b.value;case "select":return 0<=b.selectedIndex?a.i.q(b.options[b.selectedIndex]):p;default:return b.value}},ca:function(b,d,c){switch(a.a.t(b)){case "option":switch(typeof d){case "string":a.a.e.set(b,a.d.options.Va,p);"__ko__hasDomDataOptionValue__"in
b&&delete b.__ko__hasDomDataOptionValue__;b.value=d;break;default:a.a.e.set(b,a.d.options.Va,d),b.__ko__hasDomDataOptionValue__=!0,b.value="number"===typeof d?d:""}break;case "select":if(""===d||null===d)d=p;for(var e=-1,g=0,h=b.options.length,k;g<h;++g)if(k=a.i.q(b.options[g]),k==d||""==k&&d===p){e=g;break}if(c||0<=e||d===p&&1<b.size)b.selectedIndex=e;break;default:if(null===d||d===p)d="";b.value=d}}}})();a.b("selectExtensions",a.i);a.b("selectExtensions.readValue",a.i.q);a.b("selectExtensions.writeValue",
a.i.ca);a.h=function(){function b(b){b=a.a.cb(b);123===b.charCodeAt(0)&&(b=b.slice(1,-1));var c=[],d=b.match(e),k,n,t=0;if(d){d.push(",");for(var z=0,u;u=d[z];++z){var r=u.charCodeAt(0);if(44===r){if(0>=t){k&&c.push(n?{key:k,value:n.join("")}:{unknown:k});k=n=t=0;continue}}else if(58===r){if(!n)continue}else if(47===r&&z&&1<u.length)(r=d[z-1].match(g))&&!h[r[0]]&&(b=b.substr(b.indexOf(u)+1),d=b.match(e),d.push(","),z=-1,u="/");else if(40===r||123===r||91===r)++t;else if(41===r||125===r||93===r)--t;
else if(!k&&!n){k=34===r||39===r?u.slice(1,-1):u;continue}n?n.push(u):n=[u]}}return c}var d=["true","false","null","undefined"],c=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,e=RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]","g"),g=/[\])"'A-Za-z0-9_$]+$/,h={"in":1,"return":1,"typeof":1},k={};return{ha:[],V:k,Wa:b,ya:function(f,m){function e(b,m){var f;if(!z){var u=a.getBindingHandler(b);if(u&&u.preprocess&&
!(m=u.preprocess(m,b,e)))return;if(u=k[b])f=m,0<=a.a.m(d,f)?f=!1:(u=f.match(c),f=null===u?!1:u[1]?"Object("+u[1]+")"+u[2]:f),u=f;u&&h.push("'"+b+"':function(_z){"+f+"=_z}")}t&&(m="function(){return "+m+" }");g.push("'"+b+"':"+m)}m=m||{};var g=[],h=[],t=m.valueAccessors,z=m.bindingParams,u="string"===typeof f?b(f):f;a.a.u(u,function(a){e(a.key||a.unknown,a.value)});h.length&&e("_ko_property_writers","{"+h.join(",")+" }");return g.join(",")},lc:function(a,b){for(var c=0;c<a.length;c++)if(a[c].key==
b)return!0;return!1},pa:function(b,c,d,e,k){if(b&&a.C(b))!a.Ra(b)||k&&b.v()===e||b(e);else if((b=c.get("_ko_property_writers"))&&b[d])b[d](e)}}}();a.b("expressionRewriting",a.h);a.b("expressionRewriting.bindingRewriteValidators",a.h.ha);a.b("expressionRewriting.parseObjectLiteral",a.h.Wa);a.b("expressionRewriting.preProcessBindings",a.h.ya);a.b("expressionRewriting._twoWayBindings",a.h.V);a.b("jsonExpressionRewriting",a.h);a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",a.h.ya);(function(){function b(a){return 8==
a.nodeType&&h.test(g?a.text:a.nodeValue)}function d(a){return 8==a.nodeType&&k.test(g?a.text:a.nodeValue)}function c(a,c){for(var f=a,e=1,k=[];f=f.nextSibling;){if(d(f)&&(e--,0===e))return k;k.push(f);b(f)&&e++}if(!c)throw Error("Cannot find closing comment tag to match: "+a.nodeValue);return null}function e(a,b){var d=c(a,b);return d?0<d.length?d[d.length-1].nextSibling:a.nextSibling:null}var g=v&&"\x3c!--test--\x3e"===v.createComment("test").text,h=g?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,
k=g?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,f={ul:!0,ol:!0};a.f={Q:{},childNodes:function(a){return b(a)?c(a):a.childNodes},ja:function(c){if(b(c)){c=a.f.childNodes(c);for(var d=0,f=c.length;d<f;d++)a.removeNode(c[d])}else a.a.Ka(c)},T:function(c,d){if(b(c)){a.f.ja(c);for(var f=c.nextSibling,e=0,k=d.length;e<k;e++)f.parentNode.insertBefore(d[e],f)}else a.a.T(c,d)},Hb:function(a,c){b(a)?a.parentNode.insertBefore(c,a.nextSibling):a.firstChild?a.insertBefore(c,a.firstChild):a.appendChild(c)},Bb:function(c,
d,f){f?b(c)?c.parentNode.insertBefore(d,f.nextSibling):f.nextSibling?c.insertBefore(d,f.nextSibling):c.appendChild(d):a.f.Hb(c,d)},firstChild:function(a){return b(a)?!a.nextSibling||d(a.nextSibling)?null:a.nextSibling:a.firstChild},nextSibling:function(a){b(a)&&(a=e(a));return a.nextSibling&&d(a.nextSibling)?null:a.nextSibling},gc:b,xc:function(a){return(a=(g?a.text:a.nodeValue).match(h))?a[1]:null},Fb:function(c){if(f[a.a.t(c)]){var k=c.firstChild;if(k){do if(1===k.nodeType){var g;g=k.firstChild;
var h=null;if(g){do if(h)h.push(g);else if(b(g)){var t=e(g,!0);t?g=t:h=[g]}else d(g)&&(h=[g]);while(g=g.nextSibling)}if(g=h)for(h=k.nextSibling,t=0;t<g.length;t++)h?c.insertBefore(g[t],h):c.appendChild(g[t])}while(k=k.nextSibling)}}}}})();a.b("virtualElements",a.f);a.b("virtualElements.allowedBindings",a.f.Q);a.b("virtualElements.emptyNode",a.f.ja);a.b("virtualElements.insertAfter",a.f.Bb);a.b("virtualElements.prepend",a.f.Hb);a.b("virtualElements.setDomNodeChildren",a.f.T);(function(){a.J=function(){this.Yb=
{}};a.a.extend(a.J.prototype,{nodeHasBindings:function(b){switch(b.nodeType){case 1:return null!=b.getAttribute("data-bind")||a.g.getComponentNameForNode(b);case 8:return a.f.gc(b);default:return!1}},getBindings:function(b,d){var c=this.getBindingsString(b,d),c=c?this.parseBindingsString(c,d,b):null;return a.g.mb(c,b,d,!1)},getBindingAccessors:function(b,d){var c=this.getBindingsString(b,d),c=c?this.parseBindingsString(c,d,b,{valueAccessors:!0}):null;return a.g.mb(c,b,d,!0)},getBindingsString:function(b){switch(b.nodeType){case 1:return b.getAttribute("data-bind");
case 8:return a.f.xc(b);default:return null}},parseBindingsString:function(b,d,c,e){try{var g=this.Yb,h=b+(e&&e.valueAccessors||""),k;if(!(k=g[h])){var f,m="with($context){with($data||{}){return{"+a.h.ya(b,e)+"}}}";f=new Function("$context","$element",m);k=g[h]=f}return k(d,c)}catch(l){throw l.message="Unable to parse bindings.\nBindings value: "+b+"\nMessage: "+l.message,l;}}});a.J.instance=new a.J})();a.b("bindingProvider",a.J);(function(){function b(a){return function(){return a}}function d(a){return a()}
function c(b){return a.a.na(a.k.B(b),function(a,c){return function(){return b()[c]}})}function e(a,b){return c(this.getBindings.bind(this,a,b))}function g(b,c,d){var f,e=a.f.firstChild(c),k=a.J.instance,g=k.preprocessNode;if(g){for(;f=e;)e=a.f.nextSibling(f),g.call(k,f);e=a.f.firstChild(c)}for(;f=e;)e=a.f.nextSibling(f),h(b,f,d)}function h(b,c,d){var e=!0,k=1===c.nodeType;k&&a.f.Fb(c);if(k&&d||a.J.instance.nodeHasBindings(c))e=f(c,null,b,d).shouldBindDescendants;e&&!l[a.a.t(c)]&&g(b,c,!k)}function k(b){var c=
[],d={},f=[];a.a.G(b,function y(e){if(!d[e]){var k=a.getBindingHandler(e);k&&(k.after&&(f.push(e),a.a.u(k.after,function(c){if(b[c]){if(-1!==a.a.m(f,c))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+f.join(", "));y(c)}}),f.length--),c.push({key:e,zb:k}));d[e]=!0}});return c}function f(b,c,f,g){var m=a.a.e.get(b,q);if(!c){if(m)throw Error("You cannot apply bindings multiple times to the same element.");a.a.e.set(b,q,!0)}!m&&g&&a.Ob(b,f);var l;if(c&&"function"!==
typeof c)l=c;else{var h=a.J.instance,n=h.getBindingAccessors||e,s=a.j(function(){(l=c?c(f,b):n.call(h,b,f))&&f.I&&f.I();return l},null,{o:b});l&&s.Z()||(s=null)}var v;if(l){var w=s?function(a){return function(){return d(s()[a])}}:function(a){return l[a]},A=function(){return a.a.na(s?s():l,d)};A.get=function(a){return l[a]&&d(w(a))};A.has=function(a){return a in l};g=k(l);a.a.u(g,function(c){var d=c.zb.init,e=c.zb.update,k=c.key;if(8===b.nodeType&&!a.f.Q[k])throw Error("The binding '"+k+"' cannot be used with virtual elements");
try{"function"==typeof d&&a.k.B(function(){var a=d(b,w(k),A,f.$data,f);if(a&&a.controlsDescendantBindings){if(v!==p)throw Error("Multiple bindings ("+v+" and "+k+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");v=k}}),"function"==typeof e&&a.j(function(){e(b,w(k),A,f.$data,f)},null,{o:b})}catch(g){throw g.message='Unable to process binding "'+k+": "+l[k]+'"\nMessage: '+g.message,g;}})}return{shouldBindDescendants:v===p}}
function m(b){return b&&b instanceof a.N?b:new a.N(b)}a.d={};var l={script:!0};a.getBindingHandler=function(b){return a.d[b]};a.N=function(b,c,d,f){var e=this,k="function"==typeof b&&!a.C(b),g,m=a.j(function(){var g=k?b():b,l=a.a.c(g);c?(c.I&&c.I(),a.a.extend(e,c),m&&(e.I=m)):(e.$parents=[],e.$root=l,e.ko=a);e.$rawData=g;e.$data=l;d&&(e[d]=l);f&&f(e,c,l);return e.$data},null,{Ia:function(){return g&&!a.a.ob(g)},o:!0});m.Z()&&(e.I=m,m.equalityComparer=null,g=[],m.Tb=function(b){g.push(b);a.a.w.da(b,
function(b){a.a.ua(g,b);g.length||(m.K(),e.I=m=p)})})};a.N.prototype.createChildContext=function(b,c,d){return new a.N(b,this,c,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);d&&d(a)})};a.N.prototype.extend=function(b){return new a.N(this.I||this.$data,this,null,function(c,d){c.$rawData=d.$rawData;a.a.extend(c,"function"==typeof b?b():b)})};var q=a.a.e.F(),n=a.a.e.F();a.Ob=function(b,c){if(2==arguments.length)a.a.e.set(b,n,c),
c.I&&c.I.Tb(b);else return a.a.e.get(b,n)};a.ra=function(b,c,d){1===b.nodeType&&a.f.Fb(b);return f(b,c,m(d),!0)};a.Wb=function(d,f,e){e=m(e);return a.ra(d,"function"===typeof f?c(f.bind(null,e,d)):a.a.na(f,b),e)};a.Ca=function(a,b){1!==b.nodeType&&8!==b.nodeType||g(m(a),b,!0)};a.pb=function(a,b){!w&&s.jQuery&&(w=s.jQuery);if(b&&1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");b=b||s.document.body;h(m(a),
b,!0)};a.Ha=function(b){switch(b.nodeType){case 1:case 8:var c=a.Ob(b);if(c)return c;if(b.parentNode)return a.Ha(b.parentNode)}return p};a.$b=function(b){return(b=a.Ha(b))?b.$data:p};a.b("bindingHandlers",a.d);a.b("applyBindings",a.pb);a.b("applyBindingsToDescendants",a.Ca);a.b("applyBindingAccessorsToNode",a.ra);a.b("applyBindingsToNode",a.Wb);a.b("contextFor",a.Ha);a.b("dataFor",a.$b)})();(function(b){function d(d,f){var e=g.hasOwnProperty(d)?g[d]:b,l;e||(e=g[d]=new a.P,c(d,function(a){h[d]=a;delete g[d];
l?e.notifySubscribers(a):setTimeout(function(){e.notifySubscribers(a)},0)}),l=!0);e.U(f)}function c(a,b){e("getConfig",[a],function(c){c?e("loadComponent",[a,c],function(a){b(a)}):b(null)})}function e(c,d,g,l){l||(l=a.g.loaders.slice(0));var h=l.shift();if(h){var n=h[c];if(n){var t=!1;if(n.apply(h,d.concat(function(a){t?g(null):null!==a?g(a):e(c,d,g,l)}))!==b&&(t=!0,!h.suppressLoaderExceptions))throw Error("Component loaders must supply values by invoking the callback, not by returning values synchronously.");
}else e(c,d,g,l)}else g(null)}var g={},h={};a.g={get:function(a,c){var e=h.hasOwnProperty(a)?h[a]:b;e?setTimeout(function(){c(e)},0):d(a,c)},tb:function(a){delete h[a]},jb:e};a.g.loaders=[];a.b("components",a.g);a.b("components.get",a.g.get);a.b("components.clearCachedDefinition",a.g.tb)})();(function(){function b(b,c,d,e){function k(){0===--u&&e(h)}var h={},u=2,r=d.template;d=d.viewModel;r?g(c,r,function(c){a.g.jb("loadTemplate",[b,c],function(a){h.template=a;k()})}):k();d?g(c,d,function(c){a.g.jb("loadViewModel",
[b,c],function(a){h[f]=a;k()})}):k()}function d(a,b,c){if("function"===typeof b)c(function(a){return new b(a)});else if("function"===typeof b[f])c(b[f]);else if("instance"in b){var e=b.instance;c(function(){return e})}else"viewModel"in b?d(a,b.viewModel,c):a("Unknown viewModel value: "+b)}function c(b){switch(a.a.t(b)){case "script":return a.a.ba(b.text);case "textarea":return a.a.ba(b.value);case "template":if(e(b.content))return a.a.ia(b.content.childNodes)}return a.a.ia(b.childNodes)}function e(a){return s.DocumentFragment?
a instanceof DocumentFragment:a&&11===a.nodeType}function g(a,b,c){"string"===typeof b.require?N||s.require?(N||s.require)([b.require],c):a("Uses require, but no AMD loader is present"):c(b)}function h(a){return function(b){throw Error("Component '"+a+"': "+b);}}var k={};a.g.tc=function(b,c){if(!c)throw Error("Invalid configuration for "+b);if(a.g.Qa(b))throw Error("Component "+b+" is already registered");k[b]=c};a.g.Qa=function(a){return a in k};a.g.wc=function(b){delete k[b];a.g.tb(b)};a.g.ub={getConfig:function(a,
b){b(k.hasOwnProperty(a)?k[a]:null)},loadComponent:function(a,c,d){var e=h(a);g(e,c,function(c){b(a,e,c,d)})},loadTemplate:function(b,d,f){b=h(b);if("string"===typeof d)f(a.a.ba(d));else if(d instanceof Array)f(d);else if(e(d))f(a.a.S(d.childNodes));else if(d.element)if(d=d.element,s.HTMLElement?d instanceof HTMLElement:d&&d.tagName&&1===d.nodeType)f(c(d));else if("string"===typeof d){var k=v.getElementById(d);k?f(c(k)):b("Cannot find element with ID "+d)}else b("Unknown element type: "+d);else b("Unknown template value: "+
d)},loadViewModel:function(a,b,c){d(h(a),b,c)}};var f="createViewModel";a.b("components.register",a.g.tc);a.b("components.isRegistered",a.g.Qa);a.b("components.unregister",a.g.wc);a.b("components.defaultLoader",a.g.ub);a.g.loaders.push(a.g.ub);a.g.Ub=k})();(function(){function b(b,e){var g=b.getAttribute("params");if(g){var g=d.parseBindingsString(g,e,b,{valueAccessors:!0,bindingParams:!0}),g=a.a.na(g,function(d){return a.s(d,null,{o:b})}),h=a.a.na(g,function(d){return d.Z()?a.s(function(){return a.a.c(d())},
null,{o:b}):d.v()});h.hasOwnProperty("$raw")||(h.$raw=g);return h}return{$raw:{}}}a.g.getComponentNameForNode=function(b){b=a.a.t(b);return a.g.Qa(b)&&b};a.g.mb=function(c,d,g,h){if(1===d.nodeType){var k=a.g.getComponentNameForNode(d);if(k){c=c||{};if(c.component)throw Error('Cannot use the "component" binding on a custom element matching a component');var f={name:k,params:b(d,g)};c.component=h?function(){return f}:f}}return c};var d=new a.J;9>a.a.L&&(a.g.register=function(a){return function(b){v.createElement(b);
return a.apply(this,arguments)}}(a.g.register),v.createDocumentFragment=function(b){return function(){var d=b(),g=a.g.Ub,h;for(h in g)g.hasOwnProperty(h)&&d.createElement(h);return d}}(v.createDocumentFragment))})();(function(){var b=0;a.d.component={init:function(d,c,e,g,h){function k(){var a=f&&f.dispose;"function"===typeof a&&a.call(f);m=null}var f,m;a.a.w.da(d,k);a.s(function(){var e=a.a.c(c()),g,n;"string"===typeof e?g=e:(g=a.a.c(e.name),n=a.a.c(e.params));if(!g)throw Error("No component name specified");
var t=m=++b;a.g.get(g,function(b){if(m===t){k();if(!b)throw Error("Unknown component '"+g+"'");var c=b.template;if(!c)throw Error("Component '"+g+"' has no template");c=a.a.ia(c);a.f.T(d,c);var c=n,e=b.createViewModel;b=e?e.call(b,c,{element:d}):c;c=h.createChildContext(b);f=b;a.Ca(c,d)}})},null,{o:d});return{controlsDescendantBindings:!0}}};a.f.Q.component=!0})();var Q={"class":"className","for":"htmlFor"};a.d.attr={update:function(b,d){var c=a.a.c(d())||{};a.a.G(c,function(c,d){d=a.a.c(d);var h=
!1===d||null===d||d===p;h&&b.removeAttribute(c);8>=a.a.L&&c in Q?(c=Q[c],h?b.removeAttribute(c):b[c]=d):h||b.setAttribute(c,d.toString());"name"===c&&a.a.Mb(b,h?"":d.toString())})}};(function(){a.d.checked={after:["value","attr"],init:function(b,d,c){function e(){var e=b.checked,k=q?h():e;if(!a.Y.ma()&&(!f||e)){var g=a.k.B(d);m?l!==k?(e&&(a.a.ea(g,k,!0),a.a.ea(g,l,!1)),l=k):a.a.ea(g,k,e):a.h.pa(g,c,"checked",k,!0)}}function g(){var c=a.a.c(d());b.checked=m?0<=a.a.m(c,h()):k?c:h()===c}var h=a.Ib(function(){return c.has("checkedValue")?
a.a.c(c.get("checkedValue")):c.has("value")?a.a.c(c.get("value")):b.value}),k="checkbox"==b.type,f="radio"==b.type;if(k||f){var m=k&&a.a.c(d())instanceof Array,l=m?h():p,q=f||m;f&&!b.name&&a.d.uniqueName.init(b,function(){return!0});a.s(e,null,{o:b});a.a.n(b,"click",e);a.s(g,null,{o:b})}}};a.h.V.checked=!0;a.d.checkedValue={update:function(b,d){b.value=a.a.c(d())}}})();a.d.css={update:function(b,d){var c=a.a.c(d());"object"==typeof c?a.a.G(c,function(c,d){d=a.a.c(d);a.a.Ba(b,c,d)}):(c=String(c||""),
a.a.Ba(b,b.__ko__cssValue,!1),b.__ko__cssValue=c,a.a.Ba(b,c,!0))}};a.d.enable={update:function(b,d){var c=a.a.c(d());c&&b.disabled?b.removeAttribute("disabled"):c||b.disabled||(b.disabled=!0)}};a.d.disable={update:function(b,d){a.d.enable.update(b,function(){return!a.a.c(d())})}};a.d.event={init:function(b,d,c,e,g){var h=d()||{};a.a.G(h,function(k){"string"==typeof k&&a.a.n(b,k,function(b){var h,l=d()[k];if(l){try{var q=a.a.S(arguments);e=g.$data;q.unshift(e);h=l.apply(e,q)}finally{!0!==h&&(b.preventDefault?
b.preventDefault():b.returnValue=!1)}!1===c.get(k+"Bubble")&&(b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation())}})})}};a.d.foreach={Eb:function(b){return function(){var d=b(),c=a.a.Xa(d);if(!c||"number"==typeof c.length)return{foreach:d,templateEngine:a.O.Oa};a.a.c(d);return{foreach:c.data,as:c.as,includeDestroyed:c.includeDestroyed,afterAdd:c.afterAdd,beforeRemove:c.beforeRemove,afterRender:c.afterRender,beforeMove:c.beforeMove,afterMove:c.afterMove,templateEngine:a.O.Oa}}},init:function(b,
d){return a.d.template.init(b,a.d.foreach.Eb(d))},update:function(b,d,c,e,g){return a.d.template.update(b,a.d.foreach.Eb(d),c,e,g)}};a.h.ha.foreach=!1;a.f.Q.foreach=!0;a.d.hasfocus={init:function(b,d,c){function e(e){b.__ko_hasfocusUpdating=!0;var f=b.ownerDocument;if("activeElement"in f){var g;try{g=f.activeElement}catch(h){g=f.body}e=g===b}f=d();a.h.pa(f,c,"hasfocus",e,!0);b.__ko_hasfocusLastValue=e;b.__ko_hasfocusUpdating=!1}var g=e.bind(null,!0),h=e.bind(null,!1);a.a.n(b,"focus",g);a.a.n(b,"focusin",
g);a.a.n(b,"blur",h);a.a.n(b,"focusout",h)},update:function(b,d){var c=!!a.a.c(d());b.__ko_hasfocusUpdating||b.__ko_hasfocusLastValue===c||(c?b.focus():b.blur(),a.k.B(a.a.oa,null,[b,c?"focusin":"focusout"]))}};a.h.V.hasfocus=!0;a.d.hasFocus=a.d.hasfocus;a.h.V.hasFocus=!0;a.d.html={init:function(){return{controlsDescendantBindings:!0}},update:function(b,d){a.a.$a(b,d())}};I("if");I("ifnot",!1,!0);I("with",!0,!1,function(a,d){return a.createChildContext(d)});var K={};a.d.options={init:function(b){if("select"!==
a.a.t(b))throw Error("options binding applies only to SELECT elements");for(;0<b.length;)b.remove(0);return{controlsDescendantBindings:!0}},update:function(b,d,c){function e(){return a.a.ta(b.options,function(a){return a.selected})}function g(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c}function h(c,d){if(q.length){var e=0<=a.a.m(q,a.i.q(d[0]));a.a.Nb(d[0],e);n&&!e&&a.k.B(a.a.oa,null,[b,"change"])}}var k=0!=b.length&&b.multiple?b.scrollTop:null,f=a.a.c(d()),m=c.get("optionsIncludeDestroyed");
d={};var l,q;q=b.multiple?a.a.Da(e(),a.i.q):0<=b.selectedIndex?[a.i.q(b.options[b.selectedIndex])]:[];f&&("undefined"==typeof f.length&&(f=[f]),l=a.a.ta(f,function(b){return m||b===p||null===b||!a.a.c(b._destroy)}),c.has("optionsCaption")&&(f=a.a.c(c.get("optionsCaption")),null!==f&&f!==p&&l.unshift(K)));var n=!1;d.beforeRemove=function(a){b.removeChild(a)};f=h;c.has("optionsAfterRender")&&(f=function(b,d){h(0,d);a.k.B(c.get("optionsAfterRender"),null,[d[0],b!==K?b:p])});a.a.Za(b,l,function(d,e,f){f.length&&
(q=f[0].selected?[a.i.q(f[0])]:[],n=!0);e=b.ownerDocument.createElement("option");d===K?(a.a.bb(e,c.get("optionsCaption")),a.i.ca(e,p)):(f=g(d,c.get("optionsValue"),d),a.i.ca(e,a.a.c(f)),d=g(d,c.get("optionsText"),f),a.a.bb(e,d));return[e]},d,f);a.k.B(function(){c.get("valueAllowUnset")&&c.has("value")?a.i.ca(b,a.a.c(c.get("value")),!0):(b.multiple?q.length&&e().length<q.length:q.length&&0<=b.selectedIndex?a.i.q(b.options[b.selectedIndex])!==q[0]:q.length||0<=b.selectedIndex)&&a.a.oa(b,"change")});
a.a.dc(b);k&&20<Math.abs(k-b.scrollTop)&&(b.scrollTop=k)}};a.d.options.Va=a.a.e.F();a.d.selectedOptions={after:["options","foreach"],init:function(b,d,c){a.a.n(b,"change",function(){var e=d(),g=[];a.a.u(b.getElementsByTagName("option"),function(b){b.selected&&g.push(a.i.q(b))});a.h.pa(e,c,"selectedOptions",g)})},update:function(b,d){if("select"!=a.a.t(b))throw Error("values binding applies only to SELECT elements");var c=a.a.c(d());c&&"number"==typeof c.length&&a.a.u(b.getElementsByTagName("option"),
function(b){var d=0<=a.a.m(c,a.i.q(b));a.a.Nb(b,d)})}};a.h.V.selectedOptions=!0;a.d.style={update:function(b,d){var c=a.a.c(d()||{});a.a.G(c,function(c,d){d=a.a.c(d);if(null===d||d===p||!1===d)d="";b.style[c]=d})}};a.d.submit={init:function(b,d,c,e,g){if("function"!=typeof d())throw Error("The value for a submit binding must be a function");a.a.n(b,"submit",function(a){var c,e=d();try{c=e.call(g.$data,b)}finally{!0!==c&&(a.preventDefault?a.preventDefault():a.returnValue=!1)}})}};a.d.text={init:function(){return{controlsDescendantBindings:!0}},
update:function(b,d){a.a.bb(b,d())}};a.f.Q.text=!0;(function(){if(s&&s.navigator)var b=function(a){if(a)return parseFloat(a[1])},d=s.opera&&s.opera.version&&parseInt(s.opera.version()),c=s.navigator.userAgent,e=b(c.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),g=b(c.match(/Firefox\/([^ ]*)/));if(10>a.a.L)var h=a.a.e.F(),k=a.a.e.F(),f=function(b){var c=this.activeElement;(c=c&&a.a.e.get(c,k))&&c(b)},m=function(b,c){var d=b.ownerDocument;a.a.e.get(d,h)||(a.a.e.set(d,h,!0),a.a.n(d,"selectionchange",
f));a.a.e.set(b,k,c)};a.d.textInput={init:function(b,c,f){function k(c,d){a.a.n(b,c,d)}function h(){var d=a.a.c(c());if(null===d||d===p)d="";v!==p&&d===v?setTimeout(h,4):b.value!==d&&(s=d,b.value=d)}function u(){y||(v=b.value,y=setTimeout(r,4))}function r(){clearTimeout(y);v=y=p;var d=b.value;s!==d&&(s=d,a.h.pa(c(),f,"textInput",d))}var s=b.value,y,v;10>a.a.L?(k("propertychange",function(a){"value"===a.propertyName&&r()}),8==a.a.L&&(k("keyup",r),k("keydown",r)),8<=a.a.L&&(m(b,r),k("dragend",u))):
(k("input",r),5>e&&"textarea"===a.a.t(b)?(k("keydown",u),k("paste",u),k("cut",u)):11>d?k("keydown",u):4>g&&(k("DOMAutoComplete",r),k("dragdrop",r),k("drop",r)));k("change",r);a.s(h,null,{o:b})}};a.h.V.textInput=!0;a.d.textinput={preprocess:function(a,b,c){c("textInput",a)}}})();a.d.uniqueName={init:function(b,d){if(d()){var c="ko_unique_"+ ++a.d.uniqueName.Zb;a.a.Mb(b,c)}}};a.d.uniqueName.Zb=0;a.d.value={after:["options","foreach"],init:function(b,d,c){if("input"!=b.tagName.toLowerCase()||"checkbox"!=
b.type&&"radio"!=b.type){var e=["change"],g=c.get("valueUpdate"),h=!1,k=null;g&&("string"==typeof g&&(g=[g]),a.a.ga(e,g),e=a.a.rb(e));var f=function(){k=null;h=!1;var e=d(),f=a.i.q(b);a.h.pa(e,c,"value",f)};!a.a.L||"input"!=b.tagName.toLowerCase()||"text"!=b.type||"off"==b.autocomplete||b.form&&"off"==b.form.autocomplete||-1!=a.a.m(e,"propertychange")||(a.a.n(b,"propertychange",function(){h=!0}),a.a.n(b,"focus",function(){h=!1}),a.a.n(b,"blur",function(){h&&f()}));a.a.u(e,function(c){var d=f;a.a.vc(c,
"after")&&(d=function(){k=a.i.q(b);setTimeout(f,0)},c=c.substring(5));a.a.n(b,c,d)});var m=function(){var e=a.a.c(d()),f=a.i.q(b);if(null!==k&&e===k)setTimeout(m,0);else if(e!==f)if("select"===a.a.t(b)){var g=c.get("valueAllowUnset"),f=function(){a.i.ca(b,e,g)};f();g||e===a.i.q(b)?setTimeout(f,0):a.k.B(a.a.oa,null,[b,"change"])}else a.i.ca(b,e)};a.s(m,null,{o:b})}else a.ra(b,{checkedValue:d})},update:function(){}};a.h.V.value=!0;a.d.visible={update:function(b,d){var c=a.a.c(d()),e="none"!=b.style.display;
c&&!e?b.style.display="":!c&&e&&(b.style.display="none")}};(function(b){a.d[b]={init:function(d,c,e,g,h){return a.d.event.init.call(this,d,function(){var a={};a[b]=c();return a},e,g,h)}}})("click");a.H=function(){};a.H.prototype.renderTemplateSource=function(){throw Error("Override renderTemplateSource");};a.H.prototype.createJavaScriptEvaluatorBlock=function(){throw Error("Override createJavaScriptEvaluatorBlock");};a.H.prototype.makeTemplateSource=function(b,d){if("string"==typeof b){d=d||v;var c=
d.getElementById(b);if(!c)throw Error("Cannot find template with ID "+b);return new a.r.l(c)}if(1==b.nodeType||8==b.nodeType)return new a.r.fa(b);throw Error("Unknown template type: "+b);};a.H.prototype.renderTemplate=function(a,d,c,e){a=this.makeTemplateSource(a,e);return this.renderTemplateSource(a,d,c)};a.H.prototype.isTemplateRewritten=function(a,d){return!1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,d).data("isRewritten")};a.H.prototype.rewriteTemplate=function(a,d,c){a=this.makeTemplateSource(a,
c);d=d(a.text());a.text(d);a.data("isRewritten",!0)};a.b("templateEngine",a.H);a.fb=function(){function b(b,c,d,k){b=a.h.Wa(b);for(var f=a.h.ha,m=0;m<b.length;m++){var l=b[m].key;if(f.hasOwnProperty(l)){var q=f[l];if("function"===typeof q){if(l=q(b[m].value))throw Error(l);}else if(!q)throw Error("This template engine does not support the '"+l+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+a.h.ya(b,{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+
"')";return k.createJavaScriptEvaluatorBlock(d)+c}var d=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,c=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return{ec:function(b,c,d){c.isTemplateRewritten(b,d)||c.rewriteTemplate(b,function(b){return a.fb.nc(b,c)},d)},nc:function(a,g){return a.replace(d,function(a,c,d,e,l){return b(l,c,d,g)}).replace(c,function(a,c){return b(c,"\x3c!-- ko --\x3e","#comment",g)})},Xb:function(b,c){return a.D.Ua(function(d,
k){var f=d.nextSibling;f&&f.nodeName.toLowerCase()===c&&a.ra(f,b,k)})}}}();a.b("__tr_ambtns",a.fb.Xb);(function(){a.r={};a.r.l=function(a){this.l=a};a.r.l.prototype.text=function(){var b=a.a.t(this.l),b="script"===b?"text":"textarea"===b?"value":"innerHTML";if(0==arguments.length)return this.l[b];var d=arguments[0];"innerHTML"===b?a.a.$a(this.l,d):this.l[b]=d};var b=a.a.e.F()+"_";a.r.l.prototype.data=function(c){if(1===arguments.length)return a.a.e.get(this.l,b+c);a.a.e.set(this.l,b+c,arguments[1])};
var d=a.a.e.F();a.r.fa=function(a){this.l=a};a.r.fa.prototype=new a.r.l;a.r.fa.prototype.text=function(){if(0==arguments.length){var b=a.a.e.get(this.l,d)||{};b.gb===p&&b.Ga&&(b.gb=b.Ga.innerHTML);return b.gb}a.a.e.set(this.l,d,{gb:arguments[0]})};a.r.l.prototype.nodes=function(){if(0==arguments.length)return(a.a.e.get(this.l,d)||{}).Ga;a.a.e.set(this.l,d,{Ga:arguments[0]})};a.b("templateSources",a.r);a.b("templateSources.domElement",a.r.l);a.b("templateSources.anonymousTemplate",a.r.fa)})();(function(){function b(b,
c,d){var e;for(c=a.f.nextSibling(c);b&&(e=b)!==c;)b=a.f.nextSibling(e),d(e,b)}function d(c,d){if(c.length){var e=c[0],g=c[c.length-1],h=e.parentNode,n=a.J.instance,t=n.preprocessNode;if(t){b(e,g,function(a,b){var c=a.previousSibling,d=t.call(n,a);d&&(a===e&&(e=d[0]||b),a===g&&(g=d[d.length-1]||c))});c.length=0;if(!e)return;e===g?c.push(e):(c.push(e,g),a.a.ka(c,h))}b(e,g,function(b){1!==b.nodeType&&8!==b.nodeType||a.pb(d,b)});b(e,g,function(b){1!==b.nodeType&&8!==b.nodeType||a.D.Sb(b,[d])});a.a.ka(c,
h)}}function c(a){return a.nodeType?a:0<a.length?a[0]:null}function e(b,e,h,l,q){q=q||{};var n=b&&c(b),n=n&&n.ownerDocument,t=q.templateEngine||g;a.fb.ec(h,t,n);h=t.renderTemplate(h,l,q,n);if("number"!=typeof h.length||0<h.length&&"number"!=typeof h[0].nodeType)throw Error("Template engine must return an array of DOM nodes");n=!1;switch(e){case "replaceChildren":a.f.T(b,h);n=!0;break;case "replaceNode":a.a.Lb(b,h);n=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+
e);}n&&(d(h,l),q.afterRender&&a.k.B(q.afterRender,null,[h,l.$data]));return h}var g;a.ab=function(b){if(b!=p&&!(b instanceof a.H))throw Error("templateEngine must inherit from ko.templateEngine");g=b};a.Ya=function(b,d,h,l,q){h=h||{};if((h.templateEngine||g)==p)throw Error("Set a template engine before calling renderTemplate");q=q||"replaceChildren";if(l){var n=c(l);return a.j(function(){var g=d&&d instanceof a.N?d:new a.N(a.a.c(d)),p=a.C(b)?b():"function"===typeof b?b(g.$data,g):b,g=e(l,q,p,g,h);
"replaceNode"==q&&(l=g,n=c(l))},null,{Ia:function(){return!n||!a.a.Ja(n)},o:n&&"replaceNode"==q?n.parentNode:n})}return a.D.Ua(function(c){a.Ya(b,d,h,c,"replaceNode")})};a.uc=function(b,c,g,h,q){function n(a,b){d(b,s);g.afterRender&&g.afterRender(b,a)}function t(c,d){s=q.createChildContext(c,g.as,function(a){a.$index=d});var f=a.C(b)?b():"function"===typeof b?b(c,s):b;return e(null,"ignoreTargetNode",f,s,g)}var s;return a.j(function(){var b=a.a.c(c)||[];"undefined"==typeof b.length&&(b=[b]);b=a.a.ta(b,
function(b){return g.includeDestroyed||b===p||null===b||!a.a.c(b._destroy)});a.k.B(a.a.Za,null,[h,b,t,g,n])},null,{o:h})};var h=a.a.e.F();a.d.template={init:function(b,c){var d=a.a.c(c());"string"==typeof d||d.name?a.f.ja(b):(d=a.f.childNodes(b),d=a.a.oc(d),(new a.r.fa(b)).nodes(d));return{controlsDescendantBindings:!0}},update:function(b,c,d,e,g){var n=c(),t;c=a.a.c(n);d=!0;e=null;"string"==typeof c?c={}:(n=c.name,"if"in c&&(d=a.a.c(c["if"])),d&&"ifnot"in c&&(d=!a.a.c(c.ifnot)),t=a.a.c(c.data));
"foreach"in c?e=a.uc(n||b,d&&c.foreach||[],c,b,g):d?(g="data"in c?g.createChildContext(t,c.as):g,e=a.Ya(n||b,g,c,b)):a.f.ja(b);g=e;(t=a.a.e.get(b,h))&&"function"==typeof t.K&&t.K();a.a.e.set(b,h,g&&g.Z()?g:p)}};a.h.ha.template=function(b){b=a.h.Wa(b);return 1==b.length&&b[0].unknown||a.h.lc(b,"name")?null:"This template engine does not support anonymous templates nested within its templates"};a.f.Q.template=!0})();a.b("setTemplateEngine",a.ab);a.b("renderTemplate",a.Ya);a.a.wb=function(a,d,c){if(a.length&&
d.length){var e,g,h,k,f;for(e=g=0;(!c||e<c)&&(k=a[g]);++g){for(h=0;f=d[h];++h)if(k.value===f.value){k.moved=f.index;f.moved=k.index;d.splice(h,1);e=h=0;break}e+=h}}};a.a.Fa=function(){function b(b,c,e,g,h){var k=Math.min,f=Math.max,m=[],l,q=b.length,n,p=c.length,s=p-q||1,u=q+p+1,r,v,w;for(l=0;l<=q;l++)for(v=r,m.push(r=[]),w=k(p,l+s),n=f(0,l-1);n<=w;n++)r[n]=n?l?b[l-1]===c[n-1]?v[n-1]:k(v[n]||u,r[n-1]||u)+1:n+1:l+1;k=[];f=[];s=[];l=q;for(n=p;l||n;)p=m[l][n]-1,n&&p===m[l][n-1]?f.push(k[k.length]={status:e,
value:c[--n],index:n}):l&&p===m[l-1][n]?s.push(k[k.length]={status:g,value:b[--l],index:l}):(--n,--l,h.sparse||k.push({status:"retained",value:c[n]}));a.a.wb(f,s,10*q);return k.reverse()}return function(a,c,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};a=a||[];c=c||[];return a.length<=c.length?b(a,c,"added","deleted",e):b(c,a,"deleted","added",e)}}();a.b("utils.compareArrays",a.a.Fa);(function(){function b(b,d,g,h,k){var f=[],m=a.j(function(){var l=d(g,k,a.a.ka(f,b))||[];0<f.length&&(a.a.Lb(f,
l),h&&a.k.B(h,null,[g,l,k]));f.length=0;a.a.ga(f,l)},null,{o:b,Ia:function(){return!a.a.ob(f)}});return{$:f,j:m.Z()?m:p}}var d=a.a.e.F();a.a.Za=function(c,e,g,h,k){function f(b,d){x=q[d];r!==d&&(A[b]=x);x.Na(r++);a.a.ka(x.$,c);s.push(x);w.push(x)}function m(b,c){if(b)for(var d=0,e=c.length;d<e;d++)c[d]&&a.a.u(c[d].$,function(a){b(a,d,c[d].sa)})}e=e||[];h=h||{};var l=a.a.e.get(c,d)===p,q=a.a.e.get(c,d)||[],n=a.a.Da(q,function(a){return a.sa}),t=a.a.Fa(n,e,h.dontLimitMoves),s=[],u=0,r=0,v=[],w=[];e=
[];for(var A=[],n=[],x,B=0,D,F;D=t[B];B++)switch(F=D.moved,D.status){case "deleted":F===p&&(x=q[u],x.j&&x.j.K(),v.push.apply(v,a.a.ka(x.$,c)),h.beforeRemove&&(e[B]=x,w.push(x)));u++;break;case "retained":f(B,u++);break;case "added":F!==p?f(B,F):(x={sa:D.value,Na:a.p(r++)},s.push(x),w.push(x),l||(n[B]=x))}m(h.beforeMove,A);a.a.u(v,h.beforeRemove?a.R:a.removeNode);for(var B=0,l=a.f.firstChild(c),G;x=w[B];B++){x.$||a.a.extend(x,b(c,g,x.sa,k,x.Na));for(u=0;t=x.$[u];l=t.nextSibling,G=t,u++)t!==l&&a.f.Bb(c,
t,G);!x.ic&&k&&(k(x.sa,x.$,x.Na),x.ic=!0)}m(h.beforeRemove,e);m(h.afterMove,A);m(h.afterAdd,n);a.a.e.set(c,d,s)}})();a.b("utils.setDomNodeChildrenFromArrayMapping",a.a.Za);a.O=function(){this.allowTemplateRewriting=!1};a.O.prototype=new a.H;a.O.prototype.renderTemplateSource=function(b){var d=(9>a.a.L?0:b.nodes)?b.nodes():null;if(d)return a.a.S(d.cloneNode(!0).childNodes);b=b.text();return a.a.ba(b)};a.O.Oa=new a.O;a.ab(a.O.Oa);a.b("nativeTemplateEngine",a.O);(function(){a.Sa=function(){var a=this.kc=
function(){if(!w||!w.tmpl)return 0;try{if(0<=w.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,e,g){g=g||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var h=b.data("precompiled");h||(h=b.text()||"",h=w.template(null,"{{ko_with $item.koBindingContext}}"+h+"{{/ko_with}}"),b.data("precompiled",h));b=[e.$data];e=w.extend({koBindingContext:e},g.templateOptions);e=w.tmpl(h,
b,e);e.appendTo(v.createElement("div"));w.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){v.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(w.tmpl.tag.ko_code={open:"__.push($1 || '');"},w.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};a.Sa.prototype=new a.H;var b=new a.Sa;0<b.kc&&a.ab(b);a.b("jqueryTmplTemplateEngine",a.Sa)})()})})();})();

/**
 * Created by m on 21.02.15.
 */
define('app/item',['knockout'], function (ko) {
    return function (data) {
        var self = this;

        self.id = data.id;
        self.title = ko.observable(data.title);
        self.description = ko.observable(data.description);
        self.item_url = ko.observable(data.item_url);
        self.item_thumb_url = ko.observable(data.item_thumb_url);
        self.active = ko.observable(data.active);
    }
});

define('app/modal_confirm',["knockout"], function (ko) {
    return function(data) {
        /**
         Modal form should be bind to the bootstrap modal html:

         <div id="main-modal-form" class="modal fade" role="dialog" data-bind="with: modalConfirm">
         <div class="modal-dialog">
         <div class="modal-content">
         <div class="modal-header" data-bind="text: header"></div>
         <div class="modal-body" data-bind="text: value"> </div>
         <div class="modal-footer">
         <button type="button" class="btn btn-danger" data-confirm data-dismiss="modal">Yes</button>
         <button type="button" class="btn btn-default" data-decline data-dismiss="modal">No</button>
         </div>
         <div>
         </div>
         </div>
         </div>
         </div>

         create new field in model:

         self.modalConfirm = new ModalConfirm({ modal_selector: "#main-modal-form" })

         auto generated modal (require variable_name to be passed and modal_selector should be omitted):

         self.modalConfirm = new ModalConfirm({ variable_name: "modalConfirm" })

         call to show dialog:
         as
         self.modalConfirm.show(function() { console.log("Yes") }, function() { console.log("No") })

         You can omit second argument and implement only confirm event.
         click on button with "data-confirm" attribute bind to confirm event (first param in show function)
         click on button with "data-decline" attribute bind to decline event (second param in show function)
         */

        data = data ? data : {};

        if (data.prototype) {
            return;
        }

        var self = this;

        self.modal_selector = data.modal_selector;
        self.message = ko.observable(data.message);
        self.header = ko.observable(data.header);
        self.variable_name = data.variable_name;

        self.label = { // labels text
            yes: 'Да',
            no: 'Нет'
        };

        self.custom_modal_body = data.custom_modal_body ? data.custom_modal_body : ''; // for extending purposes

        self.callback_confirm = null;
        self.callback_decline = null;

        self._generate_modal = function () {

            if (self.variable_name == null) {
                console.error("One should pass variable_name to use autogenerate modal:\n" +
                "var modalForm = new ModalConfirm({variable_name: 'modalForm'})");
                return;
            }

            var id = 'modal-' + self.variable_name;

            $("#" + id).remove();

            var html = '<div id="' + id + '" class="modal fade" role="dialog" ' +
                'data-bind="with: ' + self.variable_name + '">' + // change knockout context with 'with'
                '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                '<div class="modal-header" data-bind="text: header"></div>' + // header variable
                '<div class="modal-body">' +
                '<span data-bind="html: message"></span>' // message variable
                + self.custom_modal_body + // some custom content for extending purposes
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-default" data-decline data-dismiss="modal">'
                + self.label.no + // label for decline button
                '</button>' +
                '<button type="button" class="btn btn-danger" data-confirm data-dismiss="modal">'
                + self.label.yes + // label for confirm button
                '</button>' +
                '</div></div></div></div>';
            $('body').prepend(html); // add content

            return "#" + id;
        };

        self.init = function () {
            if (self.modal_selector == null) {
                self.modal_selector = self._generate_modal();
            }

            $(self.modal_selector).find("[data-confirm]").unbind("click");
            $(self.modal_selector).find("[data-confirm]").click(function () {
                if (self.callback_confirm)
                    self.callback_confirm();
            });

            $(self.modal_selector).find("[data-decline]").unbind("click");
            $(self.modal_selector).find("[data-decline]").click(function () {
                if (self.callback_decline)
                    self.callback_decline();
            })
        };

        self.show = function (callback_confirm, callback_decline) {
            self.callback_confirm = callback_confirm === undefined ? null : callback_confirm;
            self.callback_decline = callback_decline === undefined ? null : callback_decline;
            $(self.modal_selector).modal("show");
        };

        self.init();
    }
});

/**
 * Created by m on 21.02.15.
 */
define('helpers',['common-settings'], function (settings) {

        Date.prototype.ddmmyyyy = function () {
            var yyyy = this.getFullYear().toString();
            var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = this.getDate().toString();

            return (dd[1] ? dd : "0" + dd[0]) + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + yyyy;
        };

        Array.prototype.equals = function (array) {
            // if the other array is a falsy value, return
            if (!array)
                return false;

            // compare lengths - can save a lot of time
            if (this.length != array.length)
                return false;

            for (var i = 0, l = this.length; i < l; i++) {
                // Check if we have nested arrays
                if (this[i] instanceof Array && array[i] instanceof Array) {
                    // recurse into the nested arrays
                    if (!this[i].equals(array[i]))
                        return false;
                }
                else if (this[i] != array[i]) {
                    // Warning - two different object instances will never be equal: {x:20} != {x:20}
                    return false;
                }
            }
            return true;
        };

        return {
            blink: function (color, delay) {
                var bg = $('body');
                var bg_css = bg.css("background");
                bg.css("background-color", color);
                setTimeout(function () {
                    $("body").css("background", bg_css);
                }, delay);
            },
            showSuccess: function () {
                this.blink("#AAFF88", 1000);
            },
            showFail: function () {
                this.blink("#FFAA88", 1000);
            },
            csrfize: function csrfize(data) {
                data.csrfmiddlewaretoken = settings.csrf;
                return data;
            },
            post: function (url, data, success, fail) {
                var that = this;
                $.post(url, this.csrfize(data)).done(function (d) {
                    if (success) success(d);
                    that.showSuccess();
                }).fail(function (d) {
                    if (fail) fail(d);
                    that.showFail();
                })
            },
            get: function (url, data, success, fail) {
                var that = this;
                $.get(url, data).done(function (d) {
                    if (success) success(d);
                    that.showSuccess();
                }).fail(function (d) {
                    if (fail) fail(d);
                    that.showFail();
                });
            },
            input2base64f: function (input_element, callback) {
                var file = input_element.files[0];
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    if (callback) callback(e);
                };
                fileReader.readAsDataURL(file);
            },
            input2base64: function (input_element, output_image) {
                this.input2base64f(input_element, function (e) {
                    output_image.src = e.target.result;
                })
            }
        }
    }
);
/**
 * Created by m on 21.02.15.
 */
define('app/model',['knockout', 'app/item', 'app/modal_confirm', 'helpers'],
    function (ko, MainPageItem, ModalConfirm, helpers) {
        return function (data) {
            var self = this;

            self.reset_item = function () {
                return new MainPageItem({
                    id: -1,
                    title: '',
                    description: '',
                    item_url: '',
                    item_thumb_url: '',
                    active: false
                });
            };

            self.url = {
                items: data.url.items,                  // list of items
                item: data.url.item,                    // item with specific item_id
                activate_item: data.url.activate_item,  // activate currently selected item
                save_item: data.url.save_item,          // save item with specific item_id
                add_item: data.url.add_item,            // add new item
                remove_item: data.url.remove_item,      // remove item with id
                toggle_border: data.url.toggle_border,  // toggle main image border
                toggle_img_bootstrap_cols: data.url.toggle_img_bootstrap_cols,
                update_description: data.url.update_description,

                themes: data.url.themes,
                set_theme: data.url.set_theme
            };

            self.description = ko.observable(data.description);
            self.show_border = ko.observable(data.show_border);

            self.selector = {
                view: data.selector.view
            };

            self.cols = $.map($(Array(14)), function (val, i) {
                return i - 1;
            });
            self.img_bootstrap_cols = ko.observable(data.img_bootstrap_cols);

            self.modalSave = new ModalConfirm({modal_selector: "#modalSave"});
            self.modalDelete = new ModalConfirm({
                variable_name: "modalDelete",
                message: "Удалить?"
            });
            self.new_item = ko.observable(self.reset_item());

            self.csrf = data.csrf;
            function csrfize(data) {
                data.csrfmiddlewaretoken = self.csrf;
                return data;
            }

            self.items = ko.observableArray();
            self.current_item = ko.observable(self.reset_item());

            self.themes = ko.observableArray();
            self.current_theme = ko.observable();
            self.init_current_theme = ko.observable();

            self.img_bootstrap_cols.subscribe(function (value) {
                //console.log(value);
                self.toggleImgBootstrapCols();
            });

            self.current_theme.subscribe(function (value) {
                if (self.current_theme() && self.init_current_theme() && self.current_theme().path != self.init_current_theme().path) {
                    helpers.post(self.url.set_theme, {
                        'css_path': value.path
                    }, function () {
                        self.init_current_theme(self.current_theme());
                        location.reload();
                    });
                }
            });

            self.style = ko.computed(function () {
                var s = self.show_border() ? 'glyphicon-eye-open' : 'glyphicon-eye-close';
                return s;
            }, self.show_border);

            /*// binding ckeditor with description content
            ko.bindingHandlers.ckeditor = {
                init: function (element) {
                    var editor = $(element).ckeditor({
                        extraPlugins: 'sourcedialog,divarea,bootstrap-collapse,insertpre,div,image,' +
                        'bootstrap-collapse,bootstrap-message,showblocks,justify,divarea,colordialog,colorbutton,liststyle,eqneditor'
                    }).editor;
                    self.description(editor.getData());
                    editor.on('change', function (data) {
                        self.description(editor.getData());
                    });

                    // create save button
                    editor.addCommand("SaveCommand", {
                        exec: function () {
                            self.update_description();
                        }
                    });
                    editor.ui.addButton("Save", {
                        command: "SaveCommand",
                        label: "Save",
                        icon: element.dataset.icon,
                        toolbar: "editing"
                    });
                    // <<<
                },
            };*/
            // <<<
            self.loadThemes = function () {
                $.get(self.url.themes).success(function (response) {
                    self.themes(response);
                    self.themes().every(function (item) {
                        if (item.current) {
                            self.init_current_theme(item);
                            return false;
                        }
                        return true;
                    });
                    if (self.init_current_theme()) {
                        self.current_theme(self.init_current_theme());
                    }
                });
            };

            self.loadItems = function (select_newest_item) {
                $.get(self.url.items, {}, function (data) {
                    self.current_item(self.reset_item());
                    //self.items($.map(data, function (item) {
                    //    return new MainPageItem(item);
                    //}));
                    self.items.removeAll();
                    var j = 0;

                    function add_item() {
                        if (j < data.length) {
                            self.items.push(new MainPageItem(data[j]));
                            ++j;
                            setTimeout(add_item, 0);
                        } else {
                            for (var i = 0; i < self.items().length; ++i) {
                                if (select_newest_item) {
                                    self.current_item(self.items()[i]);
                                    break;
                                }
                                if (self.items()[i].active()) {
                                    self.current_item(self.items()[i]);
                                    break;
                                }
                            }
                            self.update_view();
                        }
                    }

                    add_item();
                })
            };

            self.activateItem = function (data) {
                self.current_item(data);
                helpers.post(self.url.activate_item, {
                    item_id: data.id
                }, function () {
                    self.update_view();
                    self.loadItems();
                });
            };

            self.update_view = function () {
                if (self.current_item === 'undefined')
                    return;
                helpers.post(self.url.item, {
                    item_id: self.current_item().id
                }, function (data) {
                    $(self.selector.view).html(data.html);
                }, function () {
                    $(self.selector.view).html("");
                });
            };

            self.selectItem = function (data) {
                self.current_item(data);
                self.update_view()
            };

            self.saveItem = function () {
                helpers.post(self.url.save_item, {
                    item_id: self.current_item().id,
                    description: self.current_item().description(),
                    title: self.current_item().title(),
                    item_url: self.current_item().item_url
                }, self.update_view);
            };

            self.update_description = function () {
                //console.log(self.description());
                helpers.post(self.url.update_description, {
                    description: self.description()
                }, self.update_view);
            };

            self.removeItem = function (data) {
                self.modalDelete.show(function () {
                    helpers.post(self.url.remove_item, {
                        item_id: data.id
                    }, function () {
                        self.items.remove(data)
                    });
                });
            };

            self.toggleBorder = function () {
                helpers.post(self.url.toggle_border, {
                    show_border: self.show_border()
                }, function () {
                    self.show_border(!self.show_border());
                    self.update_view();
                });
            };

            self.toggleImgBootstrapCols = function () {
                helpers.post(self.url.toggle_img_bootstrap_cols, {
                    img_bootstrap_cols: self.img_bootstrap_cols()
                }, self.update_view);
            };

            self.addItem = function (form) {
                var file_dialog = $(form).find("[name='file']").first();

                // unbind onchange event to avoid overbinding
                file_dialog.unbind("change");
                file_dialog.on("change", function () {
                    // create preview of uploaded file
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $("img#preview").attr('src', e.target.result)
                    };
                    reader.readAsDataURL(file_dialog[0].files[0]);

                    // show modal form
                    self.modalSave.message("Создать новый вид");
                    self.modalSave.show(function () {
                        var formData = new FormData(form);
                        $.ajax({
                            url: self.url.add_item,
                            data: formData,
                            processData: false,
                            contentType: false,
                            type: 'POST',
                            success: function () {
                                self.loadItems(true);
                            }
                        });
                    });
                });

                // open file selection dialog
                file_dialog.click();
            };


            self.loadItems();
            self.loadThemes();
        }
    });
/*!
 * Bootstrap v3.2.0 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.2.0",d.prototype.close=function(b){function c(){f.detach().trigger("closed.bs.alert").remove()}var d=a(this),e=d.attr("data-target");e||(e=d.attr("href"),e=e&&e.replace(/.*(?=#[^\s]*$)/,""));var f=a(e);b&&b.preventDefault(),f.length||(f=d.hasClass("alert")?d:d.parent()),f.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",c).emulateTransitionEnd(150):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.2.0",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),d[e](null==f[b]?this.options[b]:f[b]),setTimeout(a.proxy(function(){"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")&&(c.prop("checked")&&this.$element.hasClass("active")?a=!1:b.find(".active").removeClass("active")),a&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}a&&this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),c.preventDefault()})}(jQuery),+function(a){function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b).on("keydown.bs.carousel",a.proxy(this.keydown,this)),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,"hover"==this.options.pause&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.2.0",c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},c.prototype.keydown=function(a){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.to=function(b){var c=this,d=this.getItemIndex(this.$active=this.$element.find(".item.active"));return b>this.$items.length-1||0>b?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){c.to(b)}):d==b?this.pause().cycle():this.slide(b>d?"next":"prev",a(this.$items[b]))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,c){var d=this.$element.find(".item.active"),e=c||d[b](),f=this.interval,g="next"==b?"left":"right",h="next"==b?"first":"last",i=this;if(!e.length){if(!this.options.wrap)return;e=this.$element.find(".item")[h]()}if(e.hasClass("active"))return this.sliding=!1;var j=e[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:g});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,f&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(e)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:g});return a.support.transition&&this.$element.hasClass("slide")?(e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),d.one("bsTransitionEnd",function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(1e3*d.css("transition-duration").slice(0,-1))):(d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger(m)),f&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this},a(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}}),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){function b(b){return this.each(function(){var d=a(this),e=d.data("bs.collapse"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b);!e&&f.toggle&&"show"==b&&(b=!b),e||d.data("bs.collapse",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.transitioning=null,this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};c.VERSION="3.2.0",c.DEFAULTS={toggle:!0},c.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},c.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var c=a.Event("show.bs.collapse");if(this.$element.trigger(c),!c.isDefaultPrevented()){var d=this.$parent&&this.$parent.find("> .panel > .in");if(d&&d.length){var e=d.data("bs.collapse");if(e&&e.transitioning)return;b.call(d,"hide"),e||d.data("bs.collapse",null)}var f=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[f](0),this.transitioning=1;var g=function(){this.$element.removeClass("collapsing").addClass("collapse in")[f](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return g.call(this);var h=a.camelCase(["scroll",f].join("-"));this.$element.one("bsTransitionEnd",a.proxy(g,this)).emulateTransitionEnd(350)[f](this.$element[0][h])}}},c.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var d=function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(d,this)).emulateTransitionEnd(350):d.call(this)}}},c.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var d=a.fn.collapse;a.fn.collapse=b,a.fn.collapse.Constructor=c,a.fn.collapse.noConflict=function(){return a.fn.collapse=d,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(c){var d,e=a(this),f=e.attr("data-target")||c.preventDefault()||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""),g=a(f),h=g.data("bs.collapse"),i=h?"toggle":e.data(),j=e.attr("data-parent"),k=j&&a(j);h&&h.transitioning||(k&&k.find('[data-toggle="collapse"][data-parent="'+j+'"]').not(e).addClass("collapsed"),e[g.hasClass("in")?"addClass":"removeClass"]("collapsed")),b.call(g,i)})}(jQuery),+function(a){function b(b){b&&3===b.which||(a(e).remove(),a(f).each(function(){var d=c(a(this)),e={relatedTarget:this};d.hasClass("open")&&(d.trigger(b=a.Event("hide.bs.dropdown",e)),b.isDefaultPrevented()||d.removeClass("open").trigger("hidden.bs.dropdown",e))}))}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.2.0",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus"),f.toggleClass("open").trigger("shown.bs.dropdown",h)}return!1}},g.prototype.keydown=function(b){if(/(38|40|27)/.test(b.keyCode)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var e=c(d),g=e.hasClass("open");if(!g||g&&27==b.keyCode)return 27==b.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.divider):visible a",i=e.find('[role="menu"]'+h+', [role="listbox"]'+h);if(i.length){var j=i.index(i.filter(":focus"));38==b.keyCode&&j>0&&j--,40==b.keyCode&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f+', [role="menu"], [role="listbox"]',g.prototype.keydown)}(jQuery),+function(a){function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$backdrop=this.isShown=null,this.scrollbarWidth=0,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.2.0",c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var c=this,d=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(d),this.isShown||d.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.$body.addClass("modal-open"),this.setScrollbar(),this.escape(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var d=a.support.transition&&c.$element.hasClass("fade");c.$element.parent().length||c.$element.appendTo(c.$body),c.$element.show().scrollTop(0),d&&c.$element[0].offsetWidth,c.$element.addClass("in").attr("aria-hidden",!1),c.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:b});d?c.$element.find(".modal-dialog").one("bsTransitionEnd",function(){c.$element.trigger("focus").trigger(e)}).emulateTransitionEnd(300):c.$element.trigger("focus").trigger(e)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.$body.removeClass("modal-open"),this.resetScrollbar(),this.escape(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var c=this,d=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var e=a.support.transition&&d;if(this.$backdrop=a('<div class="modal-backdrop '+d+'" />').appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),e&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;e?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(150):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var f=function(){c.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",f).emulateTransitionEnd(150):f()}else b&&b()},c.prototype.checkScrollbar=function(){document.body.clientWidth>=window.innerWidth||(this.scrollbarWidth=this.scrollbarWidth||this.measureScrollbar())},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.scrollbarWidth&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right","")},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;(e||"destroy"!=b)&&(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};c.VERSION="3.2.0",c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(this.options.viewport.selector||this.options.viewport);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show()},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var c=a.contains(document.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!c)return;var d=this,e=this.tip(),f=this.getUID(this.type);this.setContent(),e.attr("id",f),this.$element.attr("aria-describedby",f),this.options.animation&&e.addClass("fade");var g="function"==typeof this.options.placement?this.options.placement.call(this,e[0],this.$element[0]):this.options.placement,h=/\s?auto?\s?/i,i=h.test(g);i&&(g=g.replace(h,"")||"top"),e.detach().css({top:0,left:0,display:"block"}).addClass(g).data("bs."+this.type,this),this.options.container?e.appendTo(this.options.container):e.insertAfter(this.$element);var j=this.getPosition(),k=e[0].offsetWidth,l=e[0].offsetHeight;if(i){var m=g,n=this.$element.parent(),o=this.getPosition(n);g="bottom"==g&&j.top+j.height+l-o.scroll>o.height?"top":"top"==g&&j.top-o.scroll-l<0?"bottom":"right"==g&&j.right+k>o.width?"left":"left"==g&&j.left-k<o.left?"right":g,e.removeClass(m).addClass(g)}var p=this.getCalculatedOffset(g,j,k,l);this.applyPlacement(p,g);var q=function(){d.$element.trigger("shown.bs."+d.type),d.hoverState=null};a.support.transition&&this.$tip.hasClass("fade")?e.one("bsTransitionEnd",q).emulateTransitionEnd(150):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top=b.top+g,b.left=b.left+h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=k.left?2*k.left-e+i:2*k.top-f+j,m=k.left?"left":"top",n=k.left?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(l,d[0][n],m)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c,a?50*(1-a/b)+"%":"")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(){function b(){"in"!=c.hoverState&&d.detach(),c.$element.trigger("hidden.bs."+c.type)}var c=this,d=this.tip(),e=a.Event("hide.bs."+this.type);return this.$element.removeAttr("aria-describedby"),this.$element.trigger(e),e.isDefaultPrevented()?void 0:(d.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d.one("bsTransitionEnd",b).emulateTransitionEnd(150):b(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName;return a.extend({},"function"==typeof c.getBoundingClientRect?c.getBoundingClientRect():null,{scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop(),width:d?a(window).width():b.outerWidth(),height:d?a(window).height():b.outerHeight()},d?{top:0,left:0}:b.offset())},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.width&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){clearTimeout(this.timeout),this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;(e||"destroy"!=b)&&(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.2.0",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").empty()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},c.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){function b(c,d){var e=a.proxy(this.process,this);this.$body=a("body"),this.$scrollElement=a(a(c).is("body")?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",e),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.2.0",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b="offset",c=0;a.isWindow(this.$scrollElement[0])||(b="position",c=this.$scrollElement.scrollTop()),this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight();var d=this;this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[b]().top+c,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){d.offsets.push(this[0]),d.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<=e[0])return g!=(a=f[0])&&this.activate(a);for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(!e[a+1]||b<=e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,a(this.selector).parentsUntil(this.options.target,".active").removeClass("active");var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.2.0",c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a")[0],f=a.Event("show.bs.tab",{relatedTarget:e});if(b.trigger(f),!f.isDefaultPrevented()){var g=a(d);this.activate(b.closest("li"),c),this.activate(g,g.parent(),function(){b.trigger({type:"shown.bs.tab",relatedTarget:e})})}}},c.prototype.activate=function(b,c,d){function e(){f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),g?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var f=c.find("> .active"),g=d&&a.support.transition&&f.hasClass("fade");g?f.one("bsTransitionEnd",e).emulateTransitionEnd(150):e(),f.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this},a(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(c){c.preventDefault(),b.call(a(this),"show")})}(jQuery),+function(a){function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=this.unpin=this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.2.0",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=a(document).height(),d=this.$target.scrollTop(),e=this.$element.offset(),f=this.options.offset,g=f.top,h=f.bottom;"object"!=typeof f&&(h=g=f),"function"==typeof g&&(g=f.top(this.$element)),"function"==typeof h&&(h=f.bottom(this.$element));var i=null!=this.unpin&&d+this.unpin<=e.top?!1:null!=h&&e.top+this.$element.height()>=b-h?"bottom":null!=g&&g>=d?"top":!1;if(this.affixed!==i){null!=this.unpin&&this.$element.css("top","");var j="affix"+(i?"-"+i:""),k=a.Event(j+".bs.affix");this.$element.trigger(k),k.isDefaultPrevented()||(this.affixed=i,this.unpin="bottom"==i?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(j).trigger(a.Event(j.replace("affix","affixed"))),"bottom"==i&&this.$element.offset({top:b-this.$element.height()-h}))}}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},d.offsetBottom&&(d.offset.bottom=d.offsetBottom),d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);
define("bootstrap", function(){});

/**
 * Created by m on 24.08.14.
 */

define('interface',['common-settings', 'bootstrap'], function (settings) {
    var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

    window.jQuery = $;

    // кнопка входа / выхода
    if (settings.url.logout) {
        $("#enter-button").click(function () {
            $.post(settings.url.logout, {
                csrfmiddlewaretoken: settings.csrf
            }).success(function () {
                location.reload();
            });
        });
    } else {
        $("body").click(function (evt) {
            if (evt.altKey && evt.ctrlKey && evt.shiftKey) {
                $("#login-modal").modal('show');
            }
        });
    }

// mouse move click prevent, not mine code
    (function ($) {
        var $doc = $(document),
            moved = false,
            pos = {x: null, y: null},
            abs = Math.abs,
            mclick = {
                'mousedown.mclick': function (e) {
                    pos.x = e.pageX;
                    pos.y = e.pageY;
                    moved = false;
                },
                'mouseup.mclick': function (e) {
                    moved = abs(pos.x - e.pageX) > $.clickMouseMoved.threshold
                    || abs(pos.y - e.pageY) > $.clickMouseMoved.threshold;
                }
            };

        $doc.on(mclick);

        $.clickMouseMoved = function () {
            return moved;
        };

        $.clickMouseMoved.threshold = 3;
    })(jQuery);

// collapsable events
    $(function () {
        $(".collapsable .collapsable-header").click(function () {
            $(this).siblings(".collapsable-body").slideToggle('fast');
        });
    });


// hack to resize main container according menu list
    $(document).ready(function () {
        var min_height = $(".menu>ul").height() + 30;
        $(".content").css("min-height", min_height);
    });

    $(function () {
        // enable click to expand menu for touch devices
        if (isTouch) {
            $(".menu >ul>li").not(".logo").not(".touchable").find(">a").click(function () {
                return false;
            })
        }

        // убираю nojs класс
        $(".nojs").removeClass("nojs");

        $(window).scroll(function () {
            var w = $(window).width();
            $("#back-to-top").toggleClass("show", w > 750 && $(this).scrollTop() > 200);
        });

        // back-to-top button
        $('#back-to-top').click(function () {
            $('html, body').stop().animate({
                scrollTop: 0
            }, 500)
        });
    });

// hack to keep left menu position on container position
    $(window).on("scroll resize touchmove", function () {
        var m = $(".menu>ul");
        var left = $(".left-board").offset().left;
        var scrollLeft = $(this).scrollLeft();
        if (scrollLeft == 0) {
            m.css({left: ''});
        } else {
            m.css({
                left: left - scrollLeft
            });
        }
    });


    (function () {
        function sendData(el, jquery_method, data) {

            if (el.dataset.action == 'undefined') {
                throw new DOMException("action attribute should be defined: ");
            }

            if (data == 'undefined')
                data = {};

            for (var i in el.dataset) {
                if (i != 'action') {
                    data[i] = el.dataset[i];
                }
            }

            return jquery_method(el.dataset.action, data);
        }

        window.MethodPostDataset = function (element, data) {
            return sendData(element, $.post, data);
        };


        window.MethodGetDataset = function (element, data) {
            return sendData(element, $.get, data);
        };

    })();

    window.dismissRelatedImageLookupPopup = function (win, chosenId, chosenThumbnailUrl, chosenDescriptionTxt) {
        var el;

        var name = win.name;

        if (el = document.getElementById(name + "_image_id")) {
            $(el).val(chosenId).trigger("change");
        }

        if (el = document.getElementById(name + "_image_url")) {
            if (el.tagName == "INPUT") {
                $(el).val(chosenThumbnailUrl).trigger("change");
            } else {
                el.src = chosenThumbnailUrl;
            }
        }

        if (RelatedImageLookupPopupBeforeClose) {
            RelatedImageLookupPopupBeforeClose(win, chosenId, chosenThumbnailUrl, chosenDescriptionTxt);
        }

        win.close();
    };
});
/**
 * Created by m on 14.02.15.
 */
define('ckeditorinlinebinding',['knockout'], function (ko) {
    ko.bindingHandlers.ckeditorInline = {
        counter: 0,
        prefix: '__cked_',
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            setTimeout(function () {
                if (!element.id) {
                    element.id = ko.bindingHandlers.ckeditorInline.prefix + (++ko.bindingHandlers.ckeditorInline.counter);
                }

                var options = allBindingsAccessor.get("ckeditorOptions") || {};

                options.floatSpaceDockedOffsetY = 0;
                options.extraPlugins = options.extraPlugins == "" ? 'sourcedialog' : options.extraPlugins + ",sourcedialog";
                options.removePlugins = 'sourcearea';

                // handle disposal (if KO removes by the template binding)
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    if (CKEDITOR.instances[element.id]) {
                        CKEDITOR.remove(CKEDITOR.instances[element.id]);
                    }
                });

                $(element).on("click", function () {
                    if (!CKEDITOR.instances[element.id]) {
                        var editor = CKEDITOR.inline(element.id, options);
                        editor.config.enterMode = CKEDITOR.ENTER_BR;

                        // handle value changed
                        editor.on('change', function () {
                            valueAccessor()(editor.getData());
                        });

                        //$(element).trigger("blur");

                        ko.bindingHandlers.ckeditorInline.update(element, valueAccessor, allBindingsAccessor, viewModel);
                        return false;
                    }
                });

            }, Math.random());
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var existingEditor = CKEDITOR.instances && CKEDITOR.instances[element.id];

            if (existingEditor) {
                if (value !== existingEditor.getData()) {
                    existingEditor.setData(value, function () {
                        this.checkDirty(); // true
                    });
                }
            } else {
                $(element).html(value);
            }
        }
    };
});
/**
 * Created by m on 21.02.15.
 */
require.config({
    shim: {
        bootstrap: {"deps": ['jquery']}
    },
    paths: {
        'knockout': '../../bower_components/knockout/dist/knockout',
        'ckeditorinlinebinding': '../bindings/ckeditorinlinebinding',
        'bootstrap': '../../lib/bootstrap/bootstrap.min',
        'interface': '../interface',
        'helpers': '../helpers'
    }
});

require(["knockout", "mainpage-settings", "app/model", "interface", 'ckeditorinlinebinding'],
    function (ko, settings, MainPageModel) {
        ko.applyBindings(new MainPageModel(settings));
    });
define("mainadmin", function(){});

