!function(e){var r={};function s(t){if(r[t])return r[t].exports;var g=r[t]={i:t,l:!1,exports:{}};return e[t].call(g.exports,g,g.exports,s),g.l=!0,g.exports}s.m=e,s.c=r,s.d=function(e,r,t){s.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,r){if(1&r&&(e=s(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(s.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var g in e)s.d(t,g,function(r){return e[r]}.bind(null,g));return t},s.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(r,"a",r),r},s.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},s.p="",s(s.s=45)}({45:function(e,r,s){(function(e){document.addEventListener("DOMContentLoaded",function(){document.querySelector("#url").value=localStorage.getItem("url")||"",document.querySelector("#username").value=localStorage.getItem("username")||"",document.querySelector("#password").value=localStorage.getItem("password")||""}),document.querySelector("form").addEventListener("submit",function(){/(https|http)/.test(document.querySelector("#url").value)?(localStorage.setItem("url",document.querySelector("#url").value),localStorage.setItem("username",document.querySelector("#username").value),localStorage.setItem("password",document.querySelector("#password").value),e.runtime.reload()):chrome.notifications.create("",{type:"basic",title:"ruTorrent Remote",message:'URL must start with either "https" or "http"'})})}).call(this,s(6))},6:function(e,r,s){(function(s){var t,g;void 0===(g="function"==typeof(t=function(e){"use strict";if(void 0===window.browser){const r=()=>{const e={alarms:{clear:{minArgs:0,maxArgs:1},clearAll:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getAll:{minArgs:0,maxArgs:0}},bookmarks:{create:{minArgs:1,maxArgs:1},export:{minArgs:0,maxArgs:0},get:{minArgs:1,maxArgs:1},getChildren:{minArgs:1,maxArgs:1},getRecent:{minArgs:1,maxArgs:1},getTree:{minArgs:0,maxArgs:0},getSubTree:{minArgs:1,maxArgs:1},import:{minArgs:0,maxArgs:0},move:{minArgs:2,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeTree:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}},browserAction:{getBadgeBackgroundColor:{minArgs:1,maxArgs:1},getBadgeText:{minArgs:1,maxArgs:1},getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},setIcon:{minArgs:1,maxArgs:1}},commands:{getAll:{minArgs:0,maxArgs:0}},contextMenus:{update:{minArgs:2,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeAll:{minArgs:0,maxArgs:0}},cookies:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:1,maxArgs:1},getAllCookieStores:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},devtools:{inspectedWindow:{eval:{minArgs:1,maxArgs:2}},panels:{create:{minArgs:3,maxArgs:3,singleCallbackArg:!0}}},downloads:{download:{minArgs:1,maxArgs:1},cancel:{minArgs:1,maxArgs:1},erase:{minArgs:1,maxArgs:1},getFileIcon:{minArgs:1,maxArgs:2},open:{minArgs:1,maxArgs:1},pause:{minArgs:1,maxArgs:1},removeFile:{minArgs:1,maxArgs:1},resume:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},show:{minArgs:1,maxArgs:1}},extension:{isAllowedFileSchemeAccess:{minArgs:0,maxArgs:0},isAllowedIncognitoAccess:{minArgs:0,maxArgs:0}},history:{addUrl:{minArgs:1,maxArgs:1},getVisits:{minArgs:1,maxArgs:1},deleteAll:{minArgs:0,maxArgs:0},deleteRange:{minArgs:1,maxArgs:1},deleteUrl:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1}},i18n:{detectLanguage:{minArgs:1,maxArgs:1},getAcceptLanguages:{minArgs:0,maxArgs:0}},idle:{queryState:{minArgs:1,maxArgs:1}},management:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},getSelf:{minArgs:0,maxArgs:0},uninstallSelf:{minArgs:0,maxArgs:1}},notifications:{clear:{minArgs:1,maxArgs:1},create:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:0},getPermissionLevel:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},pageAction:{getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},hide:{minArgs:0,maxArgs:0},setIcon:{minArgs:1,maxArgs:1},show:{minArgs:0,maxArgs:0}},runtime:{getBackgroundPage:{minArgs:0,maxArgs:0},getBrowserInfo:{minArgs:0,maxArgs:0},getPlatformInfo:{minArgs:0,maxArgs:0},openOptionsPage:{minArgs:0,maxArgs:0},requestUpdateCheck:{minArgs:0,maxArgs:0},sendMessage:{minArgs:1,maxArgs:3},sendNativeMessage:{minArgs:2,maxArgs:2},setUninstallURL:{minArgs:1,maxArgs:1}},storage:{local:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},managed:{get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1}},sync:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}}},tabs:{create:{minArgs:1,maxArgs:1},captureVisibleTab:{minArgs:0,maxArgs:2},detectLanguage:{minArgs:0,maxArgs:1},duplicate:{minArgs:1,maxArgs:1},executeScript:{minArgs:1,maxArgs:2},get:{minArgs:1,maxArgs:1},getCurrent:{minArgs:0,maxArgs:0},getZoom:{minArgs:0,maxArgs:1},getZoomSettings:{minArgs:0,maxArgs:1},highlight:{minArgs:1,maxArgs:1},insertCSS:{minArgs:1,maxArgs:2},move:{minArgs:2,maxArgs:2},reload:{minArgs:0,maxArgs:2},remove:{minArgs:1,maxArgs:1},query:{minArgs:1,maxArgs:1},removeCSS:{minArgs:1,maxArgs:2},sendMessage:{minArgs:2,maxArgs:3},setZoom:{minArgs:1,maxArgs:2},setZoomSettings:{minArgs:1,maxArgs:2},update:{minArgs:1,maxArgs:2}},webNavigation:{getAllFrames:{minArgs:1,maxArgs:1},getFrame:{minArgs:1,maxArgs:1}},webRequest:{handlerBehaviorChanged:{minArgs:0,maxArgs:0}},windows:{create:{minArgs:0,maxArgs:1},get:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:1},getCurrent:{minArgs:0,maxArgs:1},getLastFocused:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}}};if(0===Object.keys(e).length)throw new Error("api-metadata.json has not been included in browser-polyfill");const r=(e,r,s)=>new Proxy(r,{apply:(r,t,g)=>s.call(t,e,...g)});let s=Function.call.bind(Object.prototype.hasOwnProperty);const t=(e,g={},n={})=>{let m=Object.create(null),a={has:(e,r)=>r in e||r in m,get(e,a,i){if(a in m)return m[a];if(!(a in e))return;let A=e[a];if("function"==typeof A)if("function"==typeof g[a])A=r(e,e[a],g[a]);else if(s(n,a)){let s=((e,r)=>{const s=e=>1==e?"argument":"arguments";return function(t,...g){if(g.length<r.minArgs)throw new Error(`Expected at least ${r.minArgs} ${s(r.minArgs)} for ${e}(), got ${g.length}`);if(g.length>r.maxArgs)throw new Error(`Expected at most ${r.maxArgs} ${s(r.maxArgs)} for ${e}(), got ${g.length}`);return new Promise((s,n)=>{t[e](...g,((e,r)=>(...s)=>{chrome.runtime.lastError?e.reject(chrome.runtime.lastError):r.singleCallbackArg||1===s.length?e.resolve(s[0]):e.resolve(s)})({resolve:s,reject:n},r))})}})(a,n[a]);A=r(e,e[a],s)}else A=A.bind(e);else{if("object"!=typeof A||null===A||!s(g,a)&&!s(n,a))return Object.defineProperty(m,a,{configurable:!0,enumerable:!0,get:()=>e[a],set(r){e[a]=r}}),A;A=t(A,g[a],n[a])}return m[a]=A,A},set:(e,r,s,t)=>(r in m?m[r]=s:e[r]=s,!0),defineProperty:(e,r,s)=>Reflect.defineProperty(m,r,s),deleteProperty:(e,r)=>Reflect.deleteProperty(m,r)};return new Proxy(e,a)},g={runtime:{onMessage:(e=>({addListener(r,s,...t){r.addListener(e.get(s),...t)},hasListener:(r,s)=>r.hasListener(e.get(s)),removeListener(r,s){r.removeListener(e.get(s))}}))(new class extends WeakMap{constructor(e,r){super(r),this.createItem=e}get(e){return this.has(e)||this.set(e,this.createItem(e)),super.get(e)}}(e=>"function"!=typeof e?e:function(r,s,t){let g=e(r,s);if((e=>e&&"object"==typeof e&&"function"==typeof e.then)(g))return g.then(t,e=>{console.error(e),t(e)}),!0;void 0!==g&&t(g)}))}},n=Object.assign({},chrome);return t(n,g,e)};e.exports=r()}else e.exports=s})?t.apply(r,[e]):t)||(e.exports=g)}).call(this,s(6))}});