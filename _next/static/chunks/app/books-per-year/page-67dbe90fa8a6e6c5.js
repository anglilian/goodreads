(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[920],{1563:function(e,a,t){Promise.resolve().then(t.bind(t,6817))},6817:function(e,a,t){"use strict";t.r(a),t.d(a,{default:function(){return u}});var r=t(7437),s=t(2737),o=t.n(s);t(2265);var n=t(7346),d=t(5211);d.kL.register(d.uw,d.f$,d.ZL,d.Dx,d.u,d.De);var i=e=>{let{chartData:a,options:t}=e;return(0,r.jsx)(n.$Q,{data:a,options:t})},l=t(8762);t(8877);var u=()=>{let e=(0,l.Z)().filter(e=>"read"===e["Exclusive Shelf"]&&e["Date Read"]).reduce((e,a)=>{let t=o()(a["Date Read"],"YYYY/MM/DD").year();return e[t]||(e[t]={books:0,pages:0}),e[t].books++,e[t].pages+=parseInt(a["Number of Pages"],10)||0,e},{}),a={labels:Object.keys(e),datasets:[{label:"Books Read",data:Object.values(e).map(e=>e.books),backgroundColor:"rgba(75, 192, 192, 0.6)",borderColor:"rgba(75, 192, 192, 1)",borderWidth:1,yAxisID:"y-books"},{label:"Pages Read",data:Object.values(e).map(e=>e.pages),backgroundColor:"rgba(153, 102, 255, 0.6)",borderColor:"rgba(153, 102, 255, 1)",borderWidth:1,yAxisID:"y-pages"}]};return(0,r.jsxs)("div",{className:"p-8",children:[(0,r.jsx)("h1",{className:"mb-8",children:"Books and Pages Read per Year"}),(0,r.jsx)(i,{chartData:a,options:{responsive:!0,plugins:{legend:{position:"top"}},scales:{"y-books":{type:"linear",position:"left",title:{display:!0,text:"Books Read"}},"y-pages":{type:"linear",position:"right",title:{display:!0,text:"Pages Read"},grid:{drawOnChartArea:!1}}}}})]})}},8762:function(e,a,t){"use strict";var r=t(2265),s=t(8355),o=t.n(s);a.Z=()=>{let[e,a]=(0,r.useState)([]),t="/goodreads/goodreads_data";return(0,r.useEffect)(()=>{fetch("".concat(t,"/2024-05-26-goodreads_library_export.csv")).then(e=>e.text()).then(e=>{a(o().parse(e,{header:!0}).data)})},[t]),e}},8877:function(){}},function(e){e.O(0,[569,674,704,746,971,23,744],function(){return e(e.s=1563)}),_N_E=e.O()}]);