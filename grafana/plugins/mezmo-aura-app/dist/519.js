"use strict";(self.webpackChunkmezmo_aura_app=self.webpackChunkmezmo_aura_app||[]).push([[519],{564(e,a,t){t.d(a,{N:()=>d});var o=t(531),r=t(269),s=t(351);function n(e,a,t,o,r,s,n){try{var l=e[s](n),c=l.value}catch(e){return void t(e)}l.done?a(c):Promise.resolve(c).then(o,r)}function l(e){return function(){var a=this,t=arguments;return new Promise(function(o,r){var s=e.apply(a,t);function l(e){n(s,o,r,l,c,"next",e)}function c(e){n(s,o,r,l,c,"throw",e)}l(void 0)})}}function c(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function i(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{},o=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.forEach(function(a){c(e,a,t[a])})}return e}class d{static getProxyUrl(e,a){return a&&a.trim()?`${a.trim().replace(/\/$/,"")}/${e.replace(/^\//,"")}`:`api/plugin-proxy/${s.s_}/aura/${e.replace(/^\//,"")}`}static getHealth(e){return l(function*(){const a=performance.now(),t=this.getProxyUrl("health",e);try{const e=yield(0,r.lastValueFrom)((0,o.getBackendSrv)().fetch({url:t,method:"GET"})),s=Math.round(performance.now()-a);return{data:e.data,latencyMs:s}}catch(e){try{const e=yield fetch("/aura/health");if(e.ok){const t=yield e.json();return{data:t,latencyMs:Math.round(performance.now()-a)}}}catch(e){}throw e}}).call(this)}static getModels(e){return l(function*(){const a=this.getProxyUrl("v1/models",e);try{var t;return(null===(t=(yield(0,r.lastValueFrom)((0,o.getBackendSrv)().fetch({url:a,method:"GET"}))).data)||void 0===t?void 0:t.data)||[]}catch(e){try{const e=yield fetch("/aura/v1/models");if(e.ok){return(yield e.json()).data||[]}}catch(e){}return[]}}).call(this)}static sendChat(e,a){return l(function*(){const t=this.getProxyUrl("v1/chat/completions",a);try{var s,n,l,c;const a=null===(c=(yield(0,r.lastValueFrom)((0,o.getBackendSrv)().fetch({url:t,method:"POST",data:{messages:e}}))).data)||void 0===c||null===(l=c.choices)||void 0===l||null===(n=l[0])||void 0===n||null===(s=n.message)||void 0===s?void 0:s.content;if(!a)throw new Error("No content returned from Mezmo AURA Orchestrator");return a}catch(a){var i,d,m;try{const a=yield fetch("/aura/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:e})});if(a.ok){var p,u,g;const e=null===(g=(yield a.json()).choices)||void 0===g||null===(u=g[0])||void 0===u||null===(p=u.message)||void 0===p?void 0:p.content;if(e)return e}}catch(e){}const t=(null==a||null===(i=a.data)||void 0===i?void 0:i.message)||(null==a||null===(m=a.data)||void 0===m||null===(d=m.error)||void 0===d?void 0:d.message)||(null==a?void 0:a.statusText)||(null==a?void 0:a.message)||"Error communicating with AURA Orchestrator";throw new Error(t)}}).call(this)}static a2aJsonRpc(e,a){return l(function*(){const t=this.getProxyUrl("",void 0),s=(yield(0,r.lastValueFrom)((0,o.getBackendSrv)().fetch({url:t,method:"POST",data:{jsonrpc:"2.0",id:`${e.replace("/","-")}-${Date.now()}`,method:e,params:a}}))).data;if(null==s?void 0:s.error)throw new Error(s.error.message||`A2A ${e} failed`);if(!(null==s?void 0:s.result))throw new Error(`A2A ${e} returned no result`);return s.result}).call(this)}static sendA2aMessage(e){return l(function*(){return this.a2aJsonRpc("message/send",{message:i({messageId:e.messageId,role:"user",parts:[{kind:"text",text:e.text}]},e.contextId?{contextId:e.contextId}:{}),configuration:{acceptedOutputModes:["text/plain"]}})}).call(this)}static getA2aTask(e){return l(function*(){return this.a2aJsonRpc("tasks/get",{id:e})}).call(this)}}},893(e,a,t){t.d(a,{g:()=>d});var o=t(959),r=t.n(o),s=t(89),n=t(7),l=t(159),c=t(351);function i(e){return`${c.Gy}/${e}`}const d=({health:e,latencyMs:a,activeModel:t,isPolling:o})=>{const s=(0,n.useStyles2)(m),d=(0,l.useNavigate)(),p=(0,l.useLocation)(),u=p.pathname.endsWith("/console")||p.pathname.endsWith(c.bw.Console)||!p.pathname.includes("/"),g=p.pathname.includes("/traces"),f=p.pathname.includes("/specialists"),y="healthy"===(null==e?void 0:e.status),b="degraded"===(null==e?void 0:e.status);return r().createElement("header",{className:s.header},r().createElement("div",{className:s.topRow},r().createElement("div",{className:s.brandGroup},r().createElement("div",{className:s.logoWrapper},r().createElement("svg",{viewBox:"0 0 100 100",width:"32",height:"32"},r().createElement("polygon",{points:"50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5",fill:"#080c14",stroke:"#3b82f6",strokeWidth:"4"}),r().createElement("path",{d:"M25 45 C25 38, 42 34, 48 45 C48 56, 30 56, 25 45 Z",fill:"#38bdf8"}),r().createElement("path",{d:"M75 45 C75 38, 58 34, 52 45 C52 56, 70 56, 75 45 Z",fill:"#38bdf8"}),r().createElement("line",{x1:"48",y1:"44",x2:"52",y2:"44",stroke:"#38bdf8",strokeWidth:"3"}),r().createElement("text",{x:"50",y:"78",fill:"#38bdf8",fontFamily:"'JetBrains Mono', monospace",fontWeight:"bold",fontSize:"14",textAnchor:"middle",letterSpacing:"1"},"AURA"))),r().createElement("div",null,r().createElement("div",{className:s.titleRow},r().createElement("span",{className:s.brandTitle},"MEZMO AURA"),r().createElement("span",{className:s.brandSub},"SRE AGENT"),r().createElement(n.Badge,{text:"AUTONOMOUS TELEMETRY",color:"blue"})),r().createElement("span",{className:s.tagline},"Autonomous Multi-Agent Observability & Incident Investigation"))),r().createElement("div",{className:s.statusGroup},r().createElement("div",{className:s.statusPill},r().createElement("span",{className:y?s.statusDotHealthy:b?s.statusDotDegraded:s.statusDotOffline}),r().createElement("span",{className:s.statusText},e?y?"ONLINE (200)":e.status.toUpperCase():"CONNECTING..."),null!=a&&r().createElement("span",{className:s.latencyBadge},a," ms")),t&&r().createElement(n.Tooltip,{content:"Active LLM Orchestrator Model"},r().createElement("div",{className:s.modelPill},r().createElement(n.Icon,{name:"brain",size:"sm",className:s.iconBlue}),r().createElement("span",null,t))),r().createElement(n.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"external-link-alt",onClick:()=>window.open("/","_blank")},"Platform Hub"))),r().createElement("div",{className:s.bottomRow},r().createElement(n.TabsBar,null,r().createElement(n.Tab,{label:"Investigation Console",active:u,icon:"code-branch",onChangeTab:()=>d(i(c.bw.Console))}),r().createElement(n.Tab,{label:"Reasoning Traces",active:g,icon:"sitemap",onChangeTab:()=>d(i(c.bw.Traces))}),r().createElement(n.Tab,{label:"MCP Specialists",active:f,icon:"apps",onChangeTab:()=>d(i(c.bw.Specialists))})),r().createElement("div",{className:s.quickLinks},r().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"compass",onClick:()=>window.open("/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaTraces%22%7D","_blank")},"VictoriaTraces"),r().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"file-alt",onClick:()=>window.open("/vlogs/select/vmui/","_blank")},"VictoriaLogs"),r().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"chart-line",onClick:()=>window.open("/vmetrics/select/vmui/","_blank")},"VictoriaMetrics"),r().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"cog",onClick:()=>window.location.href="/grafana/plugins/mezmo-aura-app"},"Config"))))},m=e=>({header:s.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(1.5,2,0,2)};
    margin-bottom: ${e.spacing(2)};
    box-shadow: ${e.shadows.z1};
  `,topRow:s.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: ${e.spacing(2)};
    padding-bottom: ${e.spacing(1.5)};
    border-bottom: 1px solid ${e.colors.border.weak};
  `,brandGroup:s.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,logoWrapper:s.css`
    display: flex;
    align-items: center;
    justify-content: center;
    background: #080c14;
    padding: 6px;
    border-radius: 8px;
    border: 1px solid #1e293b;
  `,titleRow:s.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    flex-wrap: wrap;
  `,brandTitle:s.css`
    font-size: 1.25rem;
    font-weight: 800;
    font-family: ${e.typography.fontFamilyMonospace};
    color: #38bdf8;
    letter-spacing: 0.05em;
  `,brandSub:s.css`
    font-size: 0.85rem;
    font-weight: 700;
    color: ${e.colors.text.secondary};
    letter-spacing: 0.08em;
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
    gap: 8px;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    padding: 4px 10px;
    border-radius: 20px;
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.8rem;
  `,statusDotHealthy:s.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
  `,statusDotDegraded:s.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
    box-shadow: 0 0 8px #f59e0b;
  `,statusDotOffline:s.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 8px #ef4444;
  `,statusText:s.css`
    font-weight: 600;
    color: ${e.colors.text.primary};
  `,latencyBadge:s.css`
    color: ${e.colors.text.secondary};
    font-size: 0.75rem;
    border-left: 1px solid ${e.colors.border.weak};
    padding-left: 6px;
  `,modelPill:s.css`
    display: flex;
    align-items: center;
    gap: 6px;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-family: ${e.typography.fontFamilyMonospace};
    color: ${e.colors.text.primary};
  `,iconBlue:s.css`
    color: #38bdf8;
  `,bottomRow:s.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${e.spacing(.5)};
  `,quickLinks:s.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `})},519(e,a,t){t.r(a);var o=t(959),r=t.n(o),s=t(89),n=t(531),l=t(7),c=t(564),i=t(351),d=t(893);const m=()=>{const e=(0,l.useStyles2)(u),[a,t]=(0,o.useState)(null),[s,m]=(0,o.useState)(null);return(0,o.useEffect)(()=>{c.N.getHealth().then(e=>{t(e.data),m(e.latencyMs)}).catch(()=>{})},[]),r().createElement(n.PluginPage,null,r().createElement("div",{className:e.container},r().createElement(d.g,{health:a,latencyMs:s}),r().createElement("div",{className:e.content},r().createElement("div",{className:e.headerBanner},r().createElement("div",{className:e.badgeRow},r().createElement(l.Badge,{text:"MODEL CONTEXT PROTOCOL",color:"purple"}),r().createElement(l.Badge,{text:"216 LIVE MCP TOOLS",color:"blue"}),r().createElement(l.Badge,{text:"AUTHENTICATED GATEWAY",color:"green"})),r().createElement("h2",{className:e.bannerTitle},"Active Multi-Agent Specialists & MCP Tool Registry"),r().createElement("p",{className:e.bannerDesc},"Mezmo AURA coordinates investigations by decomposing user prompts and delegating sub-tasks to domain-specialist workers. Each specialist connects to observability backends via dedicated Model Context Protocol (MCP) servers streamable over HTTP.")),r().createElement("div",{className:e.specialistGrid},i.Cc.map(a=>r().createElement("div",{key:a.name,className:e.workerCard},r().createElement("div",{className:e.workerTop},r().createElement("div",{className:e.workerTitleGroup},r().createElement("div",{className:e.workerIconWrapper},r().createElement(l.Icon,{name:a.icon,className:e.workerIcon})),r().createElement("div",null,r().createElement("h4",{className:e.workerName},a.name),r().createElement("span",{className:e.workerRole},a.role))),r().createElement(l.Badge,{text:"ONLINE",color:"green"})),r().createElement("p",{className:e.workerDesc},a.description),r().createElement("div",{className:e.workerMetaRow},r().createElement("span",{className:e.metaLabel},"Backend:"),r().createElement("span",{className:e.metaValue},a.backend)),r().createElement("div",{className:e.workerMetaRow},r().createElement("span",{className:e.metaLabel},"Query Dialect:"),r().createElement("code",{className:e.langBadge},a.queryLang)),r().createElement("div",{className:e.toolsSection},r().createElement("span",{className:e.toolsHeader},"Connected MCP Tools:"),r().createElement("div",{className:e.toolChips},a.tools.map(a=>r().createElement("span",{key:a,className:e.toolChip},a))))))),r().createElement("div",{className:e.policyCard},r().createElement("div",{className:e.policyHeader},r().createElement(l.Icon,{name:"clock-nine",className:e.iconBlue}),r().createElement("h3",{className:e.policyTitle},"Telemetry Time Window Policy (5-Minute Default)")),r().createElement("p",{className:e.policyText},"To prevent LLM context overflows, reduce TSDB load, and focus immediately on active incidents, AURA enforces a strict ",r().createElement("strong",null,"last 5 minutes (",r().createElement("code",null,"5m"),")")," default lookback window across all telemetry domains:"),r().createElement("div",{className:e.policyGrid},r().createElement("div",{className:e.policyItem},r().createElement("span",{className:e.policyDomain},"VictoriaMetrics"),r().createElement("span",{className:e.policyRule},"PromQL rates and range queries default to ",r().createElement("code",null,"[5m]")," (",r().createElement("code",null,"start=now-5m"),")")),r().createElement("div",{className:e.policyItem},r().createElement("span",{className:e.policyDomain},"VictoriaLogs"),r().createElement("span",{className:e.policyRule},"LogSQL filters default to ",r().createElement("code",null,"_time:5m"))),r().createElement("div",{className:e.policyItem},r().createElement("span",{className:e.policyDomain},"VictoriaTraces"),r().createElement("span",{className:e.policyRule},"Trace searches default to ",r().createElement("code",null,"lookback: 300000ms")," (5m) and ",r().createElement("code",null,"limit: 20"))),r().createElement("div",{className:e.policyItem},r().createElement("span",{className:e.policyDomain},"Grafana Alerts"),r().createElement("span",{className:e.policyRule},"Scoped to firing alerts and state transitions in the last 5 minutes"))),r().createElement("div",{className:e.policyTip},r().createElement("strong",null,"Custom Time Window Overrides:")," To investigate an earlier outage or broader historical trend, simply specify the timeframe in your prompt (e.g., ",r().createElement("em",null,'"Diagnose elevated latency over the past 2 hours"'),"). AURA will honor your explicit timeframe and override the 5-minute default.")))))},p=m,u=e=>({container:s.css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,content:s.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(2.5)};
  `,headerBanner:s.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-left: 4px solid #8b5cf6;
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2.5)};
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.25)};
  `,badgeRow:s.css`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  `,bannerTitle:s.css`
    font-size: 1.35rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
    margin: 0;
  `,bannerDesc:s.css`
    font-size: 0.95rem;
    line-height: 1.6;
    color: ${e.colors.text.secondary};
    margin: 0;
    max-width: 900px;
  `,specialistGrid:s.css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${e.spacing(2)};
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  `,workerCard:s.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2)};
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.25)};
    box-shadow: ${e.shadows.z1};
  `,workerTop:s.css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  `,workerTitleGroup:s.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.25)};
  `,workerIconWrapper:s.css`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    display: flex;
    align-items: center;
    justify-content: center;
  `,workerIcon:s.css`
    color: #38bdf8;
  `,workerName:s.css`
    font-size: 0.95rem;
    font-weight: 700;
    font-family: ${e.typography.fontFamilyMonospace};
    color: ${e.colors.primary.text};
    margin: 0;
  `,workerRole:s.css`
    font-size: 0.75rem;
    color: ${e.colors.text.secondary};
  `,workerDesc:s.css`
    font-size: 0.85rem;
    line-height: 1.5;
    color: ${e.colors.text.primary};
    margin: 0;
  `,workerMetaRow:s.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    padding-top: 4px;
    border-top: 1px solid ${e.colors.border.weak};
  `,metaLabel:s.css`
    color: ${e.colors.text.secondary};
  `,metaValue:s.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-weight: 600;
    color: ${e.colors.text.primary};
  `,langBadge:s.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.75rem;
    background: rgba(56, 189, 248, 0.12);
    color: #38bdf8;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(56, 189, 248, 0.25);
  `,toolsSection:s.css`
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 4px;
  `,toolsHeader:s.css`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${e.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,toolChips:s.css`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  `,toolChip:s.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.7rem;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    padding: 3px 8px;
    border-radius: 4px;
    color: ${e.colors.text.secondary};
  `,policyCard:s.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2.5)};
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.5)};
  `,policyHeader:s.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `,iconBlue:s.css`
    color: #38bdf8;
  `,policyTitle:s.css`
    font-size: 1.1rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
    margin: 0;
  `,policyText:s.css`
    font-size: 0.9rem;
    line-height: 1.6;
    color: ${e.colors.text.primary};
    margin: 0;
    code {
      background: ${e.colors.background.canvas};
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid ${e.colors.border.weak};
      font-family: ${e.typography.fontFamilyMonospace};
    }
  `,policyGrid:s.css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${e.spacing(1.5)};
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `,policyItem:s.css`
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 6px;
    padding: ${e.spacing(1.25)};
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,policyDomain:s.css`
    font-size: 0.8rem;
    font-weight: 700;
    color: #38bdf8;
  `,policyRule:s.css`
    font-size: 0.8rem;
    color: ${e.colors.text.secondary};
    code {
      background: ${e.colors.background.secondary};
      padding: 1px 4px;
      border-radius: 3px;
      font-family: ${e.typography.fontFamilyMonospace};
    }
  `,policyTip:s.css`
    background: rgba(56, 189, 248, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.25);
    border-radius: 6px;
    padding: ${e.spacing(1.25,1.5)};
    font-size: 0.85rem;
    line-height: 1.5;
    color: ${e.colors.text.primary};
    strong {
      color: #38bdf8;
    }
  `});t.d(a,["McpSpecialists",0,m,"default",0,p])}}]);
//# sourceMappingURL=519.js.map?_cache=1449861e5152da507e59