"use strict";(self.webpackChunkopensre_app=self.webpackChunkopensre_app||[]).push([[513],{564(e,a,t){t.d(a,{Q:()=>d});var n=t(531),r=t(269),s=t(351);function o(e,a,t,n,r,s,o){try{var l=e[s](o),c=l.value}catch(e){return void t(e)}l.done?a(c):Promise.resolve(c).then(n,r)}function l(e){return function(){var a=this,t=arguments;return new Promise(function(n,r){var s=e.apply(a,t);function l(e){o(s,n,r,l,c,"next",e)}function c(e){o(s,n,r,l,c,"throw",e)}l(void 0)})}}function c(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function i(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{},n=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.forEach(function(a){c(e,a,t[a])})}return e}class d{static getProxyUrl(e,a){return a&&a.trim()?`${a.trim().replace(/\/$/,"")}/${e.replace(/^\//,"")}`:`api/plugin-proxy/${s.s_}/opensre/${e.replace(/^\//,"")}`}static getHealth(e){return l(function*(){const a=performance.now(),t=this.getProxyUrl("health",e);try{const e=yield(0,r.lastValueFrom)((0,n.getBackendSrv)().fetch({url:t,method:"GET"})),s=Math.round(performance.now()-a);return{data:e.data,latencyMs:s}}catch(e){try{const e=yield fetch("/opensre/health");if(e.ok){const t=yield e.json();return{data:t,latencyMs:Math.round(performance.now()-a)}}}catch(e){}throw e}}).call(this)}static getModels(e){return l(function*(){const a=this.getProxyUrl("v1/models",e);try{var t;return(null===(t=(yield(0,r.lastValueFrom)((0,n.getBackendSrv)().fetch({url:a,method:"GET"}))).data)||void 0===t?void 0:t.data)||[]}catch(e){try{const e=yield fetch("/opensre/v1/models");if(e.ok){return(yield e.json()).data||[]}}catch(e){}return[]}}).call(this)}static sendChat(e,a){return l(function*(){const t=this.getProxyUrl("v1/chat/completions",a);try{var s,o,l,c;const a=null===(c=(yield(0,r.lastValueFrom)((0,n.getBackendSrv)().fetch({url:t,method:"POST",data:{messages:e}}))).data)||void 0===c||null===(l=c.choices)||void 0===l||null===(o=l[0])||void 0===o||null===(s=o.message)||void 0===s?void 0:s.content;if(!a)throw new Error("No content returned from OpenSRE Agent");return a}catch(a){var i,d,p;try{const a=yield fetch("/opensre/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:e})});if(a.ok){var m,u,g;const e=null===(g=(yield a.json()).choices)||void 0===g||null===(u=g[0])||void 0===u||null===(m=u.message)||void 0===m?void 0:m.content;if(e)return e}}catch(e){}const t=(null==a||null===(i=a.data)||void 0===i?void 0:i.message)||(null==a||null===(p=a.data)||void 0===p||null===(d=p.error)||void 0===d?void 0:d.message)||(null==a?void 0:a.statusText)||(null==a?void 0:a.message)||"Error communicating with OpenSRE Agent";throw new Error(t)}}).call(this)}static a2aJsonRpc(e,a){return l(function*(){const t=this.getProxyUrl("",void 0),s=(yield(0,r.lastValueFrom)((0,n.getBackendSrv)().fetch({url:t,method:"POST",data:{jsonrpc:"2.0",id:`${e.replace("/","-")}-${Date.now()}`,method:e,params:a}}))).data;if(null==s?void 0:s.error)throw new Error(s.error.message||`A2A ${e} failed`);if(!(null==s?void 0:s.result))throw new Error(`A2A ${e} returned no result`);return s.result}).call(this)}static sendA2aMessage(e){return l(function*(){return this.a2aJsonRpc("message/send",{message:i({messageId:e.messageId,role:"user",parts:[{kind:"text",text:e.text}]},e.contextId?{contextId:e.contextId}:{}),configuration:{acceptedOutputModes:["text/plain"]}})}).call(this)}static getA2aTask(e){return l(function*(){return this.a2aJsonRpc("tasks/get",{id:e})}).call(this)}}const p=d;t.d(a,["N",0,p])},893(e,a,t){t.d(a,{g:()=>d});var n=t(959),r=t.n(n),s=t(89),o=t(7),l=t(159),c=t(351);function i(e){return`${c.Gy}/${e}`}const d=({health:e,latencyMs:a,activeModel:t})=>{const n=(0,o.useStyles2)(p),s=(0,l.useNavigate)(),d=(0,l.useLocation)(),m=d.pathname.endsWith("/console")||d.pathname.endsWith(c.bw.Console)||!d.pathname.includes("/"),u=d.pathname.includes("/traces"),g=d.pathname.includes("/integrations"),h="healthy"===(null==e?void 0:e.status),f="degraded"===(null==e?void 0:e.status);return r().createElement("header",{className:n.header},r().createElement("div",{className:n.topRow},r().createElement("div",{className:n.brandGroup},r().createElement("div",{className:n.logoWrapper},r().createElement("svg",{viewBox:"0 0 100 100",width:"32",height:"32"},r().createElement("polygon",{points:"50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5",fill:"#080c14",stroke:"#00D2FF",strokeWidth:"4"}),r().createElement("circle",{cx:"50",cy:"50",r:"18",fill:"none",stroke:"#27E99F",strokeWidth:"3.5"}),r().createElement("line",{x1:"50",y1:"12",x2:"50",y2:"32",stroke:"#00D2FF",strokeWidth:"3"}),r().createElement("line",{x1:"50",y1:"68",x2:"50",y2:"88",stroke:"#00D2FF",strokeWidth:"3"}),r().createElement("line",{x1:"16",y1:"50",x2:"32",y2:"50",stroke:"#00D2FF",strokeWidth:"3"}),r().createElement("line",{x1:"68",y1:"50",x2:"84",y2:"50",stroke:"#00D2FF",strokeWidth:"3"}),r().createElement("circle",{cx:"50",cy:"50",r:"6",fill:"#27E99F"}))),r().createElement("div",null,r().createElement("div",{className:n.titleRow},r().createElement("span",{className:n.brandTitle},"OPENSRE"),r().createElement("span",{className:n.brandSub},"AI SRE AGENT"),r().createElement(o.Badge,{text:"OPEN SOURCE SRE",color:"green"})),r().createElement("span",{className:n.tagline},"Autonomous Incident Investigation, TSDB & Log Triage, and ChatOps"))),r().createElement("div",{className:n.statusGroup},r().createElement("div",{className:n.statusPill},r().createElement("span",{className:h?n.statusDotHealthy:f?n.statusDotDegraded:n.statusDotOffline}),r().createElement("span",{className:n.statusText},e?h?"ONLINE (200)":e.status.toUpperCase():"CONNECTING..."),null!=a&&r().createElement("span",{className:n.latencyBadge},a," ms")),t&&r().createElement(o.Tooltip,{content:"Active LLM Model (routed via LiteLLM Proxy)"},r().createElement("div",{className:n.modelPill},r().createElement(o.Icon,{name:"brain",size:"sm",className:n.iconCyan}),r().createElement("span",null,t))),r().createElement(o.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"exchange-alt",onClick:()=>window.location.href="/grafana/a/mezmo-aura-app/console"},"Switch to AURA"))),r().createElement("div",{className:n.bottomRow},r().createElement(o.TabsBar,null,r().createElement(o.Tab,{label:"Investigation Console",active:m,icon:"code-branch",onChangeTab:()=>s(i(c.bw.Console))}),r().createElement(o.Tab,{label:"Integrations & Fleet",active:g,icon:"apps",onChangeTab:()=>s(i(c.bw.Integrations))}),r().createElement(o.Tab,{label:"Telemetry & Spans",active:u,icon:"sitemap",onChangeTab:()=>s(i(c.bw.Traces))})),r().createElement("div",{className:n.quickLinks},r().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"file-alt",onClick:()=>window.open("/vlogs/select/vmui/","_blank")},"VictoriaLogs"),r().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"chart-line",onClick:()=>window.open("/vmetrics/vmui/","_blank")},"VictoriaMetrics"),r().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"brain",onClick:()=>window.open("/litellm/ui/","_blank")},"LiteLLM Hub"))))},p=e=>({header:s.css`
    display: flex;
    flex-direction: column;
    background: ${e.colors.background.secondary};
    border-bottom: 1px solid ${e.colors.border.weak};
    padding: ${e.spacing(1.5,2,0)};
    margin-bottom: ${e.spacing(2)};
  `,topRow:s.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${e.spacing(1.5)};
    flex-wrap: wrap;
    gap: ${e.spacing(1)};
  `,brandGroup:s.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,logoWrapper:s.css`
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 0 8px rgba(0, 210, 255, 0.4));
  `,titleRow:s.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `,brandTitle:s.css`
    font-weight: 800;
    font-size: 1.15rem;
    letter-spacing: 0.5px;
    color: #00D2FF;
  `,brandSub:s.css`
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 1px;
    color: ${e.colors.text.secondary};
  `,tagline:s.css`
    display: block;
    font-size: 0.75rem;
    color: ${e.colors.text.secondary};
    margin-top: 2px;
  `,statusGroup:s.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,statusPill:s.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.75)};
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 16px;
    padding: ${e.spacing(.35,1)};
    font-size: 0.75rem;
  `,statusDotHealthy:s.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  `,statusDotDegraded:s.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
    box-shadow: 0 0 6px #f59e0b;
  `,statusDotOffline:s.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 6px #ef4444;
  `,statusText:s.css`
    font-family: monospace;
    font-weight: 600;
  `,latencyBadge:s.css`
    color: ${e.colors.text.secondary};
    font-size: 0.7rem;
    padding-left: ${e.spacing(.5)};
    border-left: 1px solid ${e.colors.border.weak};
  `,modelPill:s.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.5)};
    background: rgba(0, 210, 255, 0.08);
    border: 1px solid rgba(0, 210, 255, 0.3);
    border-radius: 16px;
    padding: ${e.spacing(.35,1)};
    font-size: 0.75rem;
    font-family: monospace;
    color: #00D2FF;
  `,iconCyan:s.css`
    color: #00D2FF;
  `,bottomRow:s.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,quickLinks:s.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.5)};
    margin-bottom: ${e.spacing(.5)};
  `})},513(e,a,t){t.r(a);var n=t(959),r=t.n(n),s=t(89),o=t(531),l=t(7),c=t(564),i=t(893);const d=()=>{const e=(0,l.useStyles2)(m),[a,t]=(0,n.useState)(null),[s,d]=(0,n.useState)(null);(0,n.useEffect)(()=>{c.N.getHealth().then(e=>{t(e.data),d(e.latencyMs)}).catch(()=>{})},[]);return r().createElement(o.PluginPage,null,r().createElement("div",{className:e.container},r().createElement(i.g,{health:a,latencyMs:s}),r().createElement("div",{className:e.contentCard},r().createElement("div",{className:e.hero},r().createElement("div",{className:e.heroText},r().createElement("div",{className:e.badgeRow},r().createElement(l.Badge,{text:"OPENTELEMETRY TRACES",color:"blue"}),r().createElement(l.Badge,{text:"VICTORIATRACES BACKEND",color:"green"}),r().createElement(l.Badge,{text:"GRAFANA TEMPO COMPATIBLE",color:"purple"})),r().createElement("h2",{className:e.heroTitle},"Auditing AURA's AI Reasoning Waterfall"),r().createElement("p",{className:e.heroDesc},"Every investigation initiated in the AURA console emits OpenTelemetry spans to"," ",r().createElement("code",null,"http://otel-collector:4317"),". This enables SRE operators to trace ",r().createElement("em",null,"how the AI thought"),", which subagents were invoked, the exact PromQL/LogSQL queries dispatched to MCP tools, and step latencies."),r().createElement("div",{className:e.btnGroup},r().createElement(l.Button,{size:"md",variant:"primary",icon:"compass",onClick:()=>(e=>{const a=`/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaTraces%22%2C%22queries%22%3A%5B%7B%22query%22%3A%22${encodeURIComponent(e||"aura")}%22%2C%22queryType%22%3A%22service%22%7D%5D%7D`;window.open(a,"_blank")})("aura")},"Open VictoriaTraces in Grafana Explore"),r().createElement(l.Button,{size:"md",variant:"secondary",fill:"outline",icon:"external-link-alt",onClick:()=>window.open("/vtraces/select/vmui/","_blank")},"Open VictoriaTraces VMUI")))),r().createElement("div",{className:e.grid},r().createElement("div",{className:e.card},r().createElement("div",{className:e.cardHeader},r().createElement(l.Icon,{name:"sitemap",className:e.iconBlue}),r().createElement("h4",{className:e.cardTitle},"Span Hierarchy & Multi-Agent Flow")),r().createElement("div",{className:e.waterfallMock},r().createElement("div",{className:e.spanRowRoot},r().createElement("span",{className:e.spanName},"orchestrator.investigate"),r().createElement("span",{className:e.spanDuration},"1.82s")),r().createElement("div",{className:e.spanRowChild1},r().createElement("span",{className:e.spanName},"coordinator.plan"),r().createElement("span",{className:e.spanDuration},"210ms")),r().createElement("div",{className:e.spanRowChild1},r().createElement("span",{className:e.spanName},"delegate.metrics-analyst"),r().createElement("span",{className:e.spanDuration},"420ms")),r().createElement("div",{className:e.spanRowChild2},r().createElement("span",{className:e.spanName},"mcp.victoriametrics-instant_query"),r().createElement("span",{className:e.spanDuration},"14ms")),r().createElement("div",{className:e.spanRowChild1},r().createElement("span",{className:e.spanName},"delegate.log-analyst"),r().createElement("span",{className:e.spanDuration},"510ms")),r().createElement("div",{className:e.spanRowChild2},r().createElement("span",{className:e.spanName},"mcp.victorialogs-hits"),r().createElement("span",{className:e.spanDuration},"22ms")),r().createElement("div",{className:e.spanRowChild1},r().createElement("span",{className:e.spanName},"coordinator.synthesize"),r().createElement("span",{className:e.spanDuration},"640ms")))),r().createElement("div",{className:e.card},r().createElement("div",{className:e.cardHeader},r().createElement(l.Icon,{name:"search",className:e.iconGreen}),r().createElement("h4",{className:e.cardTitle},"How to Inspect in Grafana")),r().createElement("ol",{className:e.instructionList},r().createElement("li",null,"Click the ",r().createElement("strong",null,"Open VictoriaTraces in Grafana Explore")," button above."),r().createElement("li",null,"Verify datasource is selected as ",r().createElement("strong",null,"VictoriaTraces")," (Tempo-compatible)."),r().createElement("li",null,"Set Service Name to ",r().createElement("code",null,"aura")," and click ",r().createElement("strong",null,"Run Query"),"."),r().createElement("li",null,"Select any trace to expand the complete waterfall:",r().createElement("ul",null,r().createElement("li",null,"Coordinator turn depth & planning reasoning."),r().createElement("li",null,"Subagent worker task delegations."),r().createElement("li",null,"Exact PromQL/LogSQL queries passed to MCP tools."),r().createElement("li",null,"Tool execution latency and token generation speed.")))))))))},p=d,m=e=>({container:s.css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,contentCard:s.css`
    background: ${e.colors.background.primary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2.5)};
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(3)};
  `,hero:s.css`
    display: flex;
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-left: 4px solid #38bdf8;
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2.5)};
  `,heroText:s.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.25)};
  `,badgeRow:s.css`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  `,heroTitle:s.css`
    font-size: 1.4rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
    margin: 0;
  `,heroDesc:s.css`
    font-size: 0.95rem;
    line-height: 1.6;
    color: ${e.colors.text.secondary};
    margin: 0;
    max-width: 900px;
    code {
      background: ${e.colors.background.canvas};
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid ${e.colors.border.weak};
      font-family: ${e.typography.fontFamilyMonospace};
    }
  `,btnGroup:s.css`
    display: flex;
    gap: ${e.spacing(1.5)};
    margin-top: ${e.spacing(1)};
  `,grid:s.css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${e.spacing(2)};
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  `,card:s.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2)};
  `,cardHeader:s.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    margin-bottom: ${e.spacing(1.5)};
  `,cardTitle:s.css`
    font-size: 1rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
    margin: 0;
  `,iconBlue:s.css`
    color: #38bdf8;
  `,iconGreen:s.css`
    color: #10b981;
  `,waterfallMock:s.css`
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 6px;
    padding: ${e.spacing(1.5)};
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.8rem;
  `,spanRowRoot:s.css`
    display: flex;
    justify-content: space-between;
    background: rgba(59, 130, 246, 0.2);
    border: 1px solid rgba(59, 130, 246, 0.4);
    padding: 6px 10px;
    border-radius: 4px;
    color: #38bdf8;
    font-weight: 600;
  `,spanRowChild1:s.css`
    display: flex;
    justify-content: space-between;
    margin-left: 20px;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 5px 8px;
    border-radius: 4px;
    color: #10b981;
  `,spanRowChild2:s.css`
    display: flex;
    justify-content: space-between;
    margin-left: 40px;
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.3);
    padding: 4px 8px;
    border-radius: 4px;
    color: #f59e0b;
    font-size: 0.75rem;
  `,spanName:s.css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,spanDuration:s.css`
    margin-left: 10px;
  `,instructionList:s.css`
    margin: 0 0 0 ${e.spacing(2)};
    padding: 0;
    font-size: 0.875rem;
    line-height: 1.7;
    color: ${e.colors.text.primary};
    li {
      margin-bottom: 8px;
    }
    ul {
      margin-top: 4px;
      margin-left: 16px;
    }
    code {
      background: ${e.colors.background.canvas};
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid ${e.colors.border.weak};
      font-family: ${e.typography.fontFamilyMonospace};
    }
  `});t.d(a,["InvestigationTraces",0,d,"default",0,p])}}]);
//# sourceMappingURL=513.js.map?_cache=deff86ed66b92c46a267