(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[773],{599:function(e,t,a){Promise.resolve().then(a.bind(a,3118))},3118:function(e,t,a){"use strict";a.r(t);var l=a(7437),s=a(2737),n=a.n(s),r=a(8075),i=a(8762);a(8877),t.default=()=>{let e=(0,i.Z)().filter(e=>"read"===e["Exclusive Shelf"]&&e["Date Read"]).filter(e=>"5"===e["My Rating"]).reduce((e,t)=>{let a=n()(t["Date Read"],"YYYY/MM/DD").year();return e[a]||(e[a]=[]),e[a].push(t),e},{}),t=Object.keys(e).sort((e,t)=>parseInt(t)-parseInt(e));return(0,l.jsxs)("div",{className:"flex flex-col items-center justify-center min-h-screen text-center pt-8",children:[(0,l.jsx)("h1",{className:"text-4xl font-bold mb-8",children:"Top Reads by Year"}),t.map(t=>(0,l.jsxs)("div",{className:"mb-8",children:[(0,l.jsx)("h2",{className:"text-xl font-medium text-gray-600",children:t}),(0,l.jsx)("div",{className:"flex flex-wrap justify-center gap-1",children:e[parseInt(t)].sort((e,t)=>n()(t["Date Read"]).diff(n()(e["Date Read"]))).slice(0,10).map(e=>(0,l.jsx)("div",{className:"m-0 p-0",children:(0,l.jsx)(r.Z,{isbn:e.ISBN?e.ISBN.replace(/["=]/g,""):void 0,title:e.Title,authorLf:e["Author l-f"],alt:"".concat(e.Title," by ").concat(e.Author),placeholder:(0,l.jsx)("div",{className:"placeholder-box",children:e.Title})})},e.ISBN?e.ISBN.replace(/["=]/g,""):e.Title))})]},t))]})}},8075:function(e,t,a){"use strict";a.d(t,{Z:function(){return c}});var l=a(7437),s=a(2265);let n=e=>new Promise(t=>setTimeout(t,e));async function r(e,t,a){var l,s;let r,i;let c="";if(e)c="isbn:".concat(e);else{if(!t||!a)return null;let e=a?a.split(",")[0].trim():"",l=t.replace(/\s*\([^)]*\)/g,"").trim();c="intitle:".concat(encodeURIComponent(l),"+inauthor:").concat(encodeURIComponent(e))}let o=0;for(;o<3;)try{if(r=await fetch("https://www.googleapis.com/books/v1/volumes?q=".concat(c,"&fields=items(volumeInfo/imageLinks/thumbnail)")),429===r.status){o++;let e=r.headers.get("Retry-After"),t=e?1e3*parseInt(e,10):2e3*o;await n(t)}else{i=await r.json();break}}catch(e){return console.error("Fetch error:",e),null}let u=(null==i?void 0:i.items)?i.items[0]:null;return(null==u?void 0:null===(s=u.volumeInfo)||void 0===s?void 0:null===(l=s.imageLinks)||void 0===l?void 0:l.thumbnail)||null}var i=a(6648),c=e=>{let{isbn:t,title:a,authorLf:n,alt:c,placeholder:o}=e,[u,d]=(0,s.useState)(!1),[f,h]=(0,s.useState)(null);return(0,s.useEffect)(()=>{(async()=>{let e=await r(t,a,n);e?(h(e),d(!0)):d(!1)})()},[t,a,n]),(0,l.jsxs)("div",{className:"relative h-64",style:{width:"auto",aspectRatio:"2 / 3"},children:[" ",u&&f?(0,l.jsx)(i.default,{src:f,alt:c,title:c,layout:"fill",objectFit:"contain",className:"object-contain"}):(0,l.jsx)("div",{className:"placeholder-box",title:c,children:o})]})}},8762:function(e,t,a){"use strict";var l=a(2265),s=a(8355),n=a.n(s);t.Z=()=>{let[e,t]=(0,l.useState)([]),a="/goodreads/goodreads_data";return(0,l.useEffect)(()=>{fetch("".concat(a,"/2024-05-26-goodreads_library_export.csv")).then(e=>e.text()).then(e=>{t(n().parse(e,{header:!0}).data)})},[a]),e}},8877:function(){}},function(e){e.O(0,[569,704,648,971,23,744],function(){return e(e.s=599)}),_N_E=e.O()}]);