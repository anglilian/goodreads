(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[920],{1563:function(e,a,t){Promise.resolve().then(t.bind(t,6817))},6817:function(e,a,t){"use strict";t.r(a),t.d(a,{default:function(){return p}});var r=t(7437),o=t(2265),s=t(2737),d=t.n(s),n=t(8355),i=t.n(n),l=t(7346),u=t(5211);u.kL.register(u.uw,u.f$,u.ZL,u.Dx,u.u,u.De);var b=e=>{let{chartData:a,options:t}=e;return(0,r.jsx)(l.$Q,{data:a,options:t})};t(8877);var p=()=>{let[e,a]=(0,o.useState)([]);(0,o.useEffect)(()=>{fetch("".concat("/goodreads/goodreads_data","/2024-05-26-goodreads_library_export.csv")).then(e=>e.text()).then(e=>{a(i().parse(e,{header:!0}).data)})},[]);let t=e.filter(e=>"read"===e["Exclusive Shelf"]&&e["Date Read"]).reduce((e,a)=>{let t=d()(a["Date Read"],"YYYY/MM/DD").year();return e[t]||(e[t]={books:0,pages:0}),e[t].books++,e[t].pages+=parseInt(a["Number of Pages"],10)||0,e},{}),s={labels:Object.keys(t),datasets:[{label:"Books Read",data:Object.values(t).map(e=>e.books),backgroundColor:"rgba(75, 192, 192, 0.6)",borderColor:"rgba(75, 192, 192, 1)",borderWidth:1,yAxisID:"y-books"},{label:"Pages Read",data:Object.values(t).map(e=>e.pages),backgroundColor:"rgba(153, 102, 255, 0.6)",borderColor:"rgba(153, 102, 255, 1)",borderWidth:1,yAxisID:"y-pages"}]};return(0,r.jsx)("div",{children:(0,r.jsx)(b,{chartData:s,options:{responsive:!0,plugins:{legend:{position:"top"},title:{display:!0,text:"Books and Pages Read Per Year"}},scales:{"y-books":{type:"linear",position:"left",title:{display:!0,text:"Books Read"}},"y-pages":{type:"linear",position:"right",title:{display:!0,text:"Pages Read"},grid:{drawOnChartArea:!1}}}}})})}},8877:function(){}},function(e){e.O(0,[569,674,704,746,971,23,744],function(){return e(e.s=1563)}),_N_E=e.O()}]);