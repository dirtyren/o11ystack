"use strict";(self.webpackChunkopensre_app=self.webpackChunkopensre_app||[]).push([[519],{564(e,t,a){a.d(t,{Q:()=>d});var s=a(531),r=a(269),o=a(351);function n(e,t,a,s,r,o,n){try{var c=e[o](n),l=c.value}catch(e){return void a(e)}c.done?t(l):Promise.resolve(l).then(s,r)}function c(e){return function(){var t=this,a=arguments;return new Promise(function(s,r){var o=e.apply(t,a);function c(e){n(o,s,r,c,l,"next",e)}function l(e){n(o,s,r,c,l,"throw",e)}c(void 0)})}}function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},s=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(s=s.concat(Object.getOwnPropertySymbols(a).filter(function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable}))),s.forEach(function(t){l(e,t,a[t])})}return e}class d{static getProxyUrl(e,t){return t&&t.trim()?`${t.trim().replace(/\/$/,"")}/${e.replace(/^\//,"")}`:`api/plugin-proxy/${o.s_}/opensre/${e.replace(/^\//,"")}`}static getHealth(e){return c(function*(){const t=performance.now(),a=this.getProxyUrl("health",e);try{const e=yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"GET"})),o=Math.round(performance.now()-t);return{data:e.data,latencyMs:o}}catch(e){try{const e=yield fetch("/opensre/health");if(e.ok){const a=yield e.json();return{data:a,latencyMs:Math.round(performance.now()-t)}}}catch(e){}throw e}}).call(this)}static getModels(e){return c(function*(){const t=this.getProxyUrl("v1/models",e);try{var a;return(null===(a=(yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:t,method:"GET"}))).data)||void 0===a?void 0:a.data)||[]}catch(e){try{const e=yield fetch("/opensre/v1/models");if(e.ok){return(yield e.json()).data||[]}}catch(e){}return[]}}).call(this)}static sendChat(e,t){return c(function*(){const a=this.getProxyUrl("v1/chat/completions",t);try{var o,n,c,l;const t=null===(l=(yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"POST",data:{messages:e}}))).data)||void 0===l||null===(c=l.choices)||void 0===c||null===(n=c[0])||void 0===n||null===(o=n.message)||void 0===o?void 0:o.content;if(!t)throw new Error("No content returned from OpenSRE Agent");return t}catch(t){var i,d,m;try{const t=yield fetch("/opensre/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:e})});if(t.ok){var p,g,u;const e=null===(u=(yield t.json()).choices)||void 0===u||null===(g=u[0])||void 0===g||null===(p=g.message)||void 0===p?void 0:p.content;if(e)return e}}catch(e){}const a=(null==t||null===(i=t.data)||void 0===i?void 0:i.message)||(null==t||null===(m=t.data)||void 0===m||null===(d=m.error)||void 0===d?void 0:d.message)||(null==t?void 0:t.statusText)||(null==t?void 0:t.message)||"Error communicating with OpenSRE Agent";throw new Error(a)}}).call(this)}static a2aJsonRpc(e,t){return c(function*(){const a=this.getProxyUrl("",void 0),o=(yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"POST",data:{jsonrpc:"2.0",id:`${e.replace("/","-")}-${Date.now()}`,method:e,params:t}}))).data;if(null==o?void 0:o.error)throw new Error(o.error.message||`A2A ${e} failed`);if(!(null==o?void 0:o.result))throw new Error(`A2A ${e} returned no result`);return o.result}).call(this)}static sendA2aMessage(e){return c(function*(){return this.a2aJsonRpc("message/send",{message:i({messageId:e.messageId,role:"user",parts:[{kind:"text",text:e.text}]},e.contextId?{contextId:e.contextId}:{}),configuration:{acceptedOutputModes:["text/plain"]}})}).call(this)}static getA2aTask(e){return c(function*(){return this.a2aJsonRpc("tasks/get",{id:e})}).call(this)}}const m=d;a.d(t,["N",0,m])},893(e,t,a){a.d(t,{g:()=>d});var s=a(959),r=a.n(s),o=a(89),n=a(7),c=a(159),l=a(351);function i(e){return`${l.Gy}/${e}`}const d=({health:e,latencyMs:t,activeModel:a})=>{const s=(0,n.useStyles2)(m),o=(0,c.useNavigate)(),d=(0,c.useLocation)(),p=d.pathname.endsWith("/console")||d.pathname.endsWith(l.bw.Console)||!d.pathname.includes("/"),g=d.pathname.includes("/traces"),u=d.pathname.includes("/integrations"),h="healthy"===(null==e?void 0:e.status),f="degraded"===(null==e?void 0:e.status);return r().createElement("header",{className:s.header},r().createElement("div",{className:s.topRow},r().createElement("div",{className:s.brandGroup},r().createElement("div",{className:s.logoWrapper},r().createElement("svg",{viewBox:"0 0 100 100",width:"32",height:"32"},r().createElement("polygon",{points:"50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5",fill:"#080c14",stroke:"#00D2FF",strokeWidth:"4"}),r().createElement("circle",{cx:"50",cy:"50",r:"18",fill:"none",stroke:"#27E99F",strokeWidth:"3.5"}),r().createElement("line",{x1:"50",y1:"12",x2:"50",y2:"32",stroke:"#00D2FF",strokeWidth:"3"}),r().createElement("line",{x1:"50",y1:"68",x2:"50",y2:"88",stroke:"#00D2FF",strokeWidth:"3"}),r().createElement("line",{x1:"16",y1:"50",x2:"32",y2:"50",stroke:"#00D2FF",strokeWidth:"3"}),r().createElement("line",{x1:"68",y1:"50",x2:"84",y2:"50",stroke:"#00D2FF",strokeWidth:"3"}),r().createElement("circle",{cx:"50",cy:"50",r:"6",fill:"#27E99F"}))),r().createElement("div",null,r().createElement("div",{className:s.titleRow},r().createElement("span",{className:s.brandTitle},"OPENSRE"),r().createElement("span",{className:s.brandSub},"AI SRE AGENT"),r().createElement(n.Badge,{text:"OPEN SOURCE SRE",color:"green"})),r().createElement("span",{className:s.tagline},"Autonomous Incident Investigation, TSDB & Log Triage, and ChatOps"))),r().createElement("div",{className:s.statusGroup},r().createElement("div",{className:s.statusPill},r().createElement("span",{className:h?s.statusDotHealthy:f?s.statusDotDegraded:s.statusDotOffline}),r().createElement("span",{className:s.statusText},e?h?"ONLINE (200)":e.status.toUpperCase():"CONNECTING..."),null!=t&&r().createElement("span",{className:s.latencyBadge},t," ms")),a&&r().createElement(n.Tooltip,{content:"Active LLM Model (routed via LiteLLM Proxy)"},r().createElement("div",{className:s.modelPill},r().createElement(n.Icon,{name:"brain",size:"sm",className:s.iconCyan}),r().createElement("span",null,a))),r().createElement(n.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"exchange-alt",onClick:()=>window.location.href="/grafana/a/mezmo-aura-app/console"},"Switch to AURA"))),r().createElement("div",{className:s.bottomRow},r().createElement(n.TabsBar,null,r().createElement(n.Tab,{label:"Investigation Console",active:p,icon:"code-branch",onChangeTab:()=>o(i(l.bw.Console))}),r().createElement(n.Tab,{label:"Integrations & Fleet",active:u,icon:"apps",onChangeTab:()=>o(i(l.bw.Integrations))}),r().createElement(n.Tab,{label:"Telemetry & Spans",active:g,icon:"sitemap",onChangeTab:()=>o(i(l.bw.Traces))})),r().createElement("div",{className:s.quickLinks},r().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"file-alt",onClick:()=>window.open("/vlogs/select/vmui/","_blank")},"VictoriaLogs"),r().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"chart-line",onClick:()=>window.open("/vmetrics/vmui/","_blank")},"VictoriaMetrics"),r().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"brain",onClick:()=>window.open("/litellm/ui/","_blank")},"LiteLLM Hub"))))},m=e=>({header:o.css`
    display: flex;
    flex-direction: column;
    background: ${e.colors.background.secondary};
    border-bottom: 1px solid ${e.colors.border.weak};
    padding: ${e.spacing(1.5,2,0)};
    margin-bottom: ${e.spacing(2)};
  `,topRow:o.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${e.spacing(1.5)};
    flex-wrap: wrap;
    gap: ${e.spacing(1)};
  `,brandGroup:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,logoWrapper:o.css`
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 0 8px rgba(0, 210, 255, 0.4));
  `,titleRow:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `,brandTitle:o.css`
    font-weight: 800;
    font-size: 1.15rem;
    letter-spacing: 0.5px;
    color: #00D2FF;
  `,brandSub:o.css`
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 1px;
    color: ${e.colors.text.secondary};
  `,tagline:o.css`
    display: block;
    font-size: 0.75rem;
    color: ${e.colors.text.secondary};
    margin-top: 2px;
  `,statusGroup:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,statusPill:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.75)};
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 16px;
    padding: ${e.spacing(.35,1)};
    font-size: 0.75rem;
  `,statusDotHealthy:o.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  `,statusDotDegraded:o.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
    box-shadow: 0 0 6px #f59e0b;
  `,statusDotOffline:o.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 6px #ef4444;
  `,statusText:o.css`
    font-family: monospace;
    font-weight: 600;
  `,latencyBadge:o.css`
    color: ${e.colors.text.secondary};
    font-size: 0.7rem;
    padding-left: ${e.spacing(.5)};
    border-left: 1px solid ${e.colors.border.weak};
  `,modelPill:o.css`
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
  `,iconCyan:o.css`
    color: #00D2FF;
  `,bottomRow:o.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,quickLinks:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.5)};
    margin-bottom: ${e.spacing(.5)};
  `})},519(e,t,a){a.r(t);var s=a(959),r=a.n(s),o=a(89),n=a(531),c=a(7),l=a(564),i=a(351),d=a(893);const m=()=>{const e=(0,c.useStyles2)(p),[t,a]=(0,s.useState)(null),[o,m]=(0,s.useState)(null);return(0,s.useEffect)(()=>{l.Q.getHealth().then(e=>{a(e.data),m(e.latencyMs)}).catch(()=>{})},[]),r().createElement(n.PluginPage,null,r().createElement("div",{className:e.container},r().createElement(d.g,{health:t,latencyMs:o}),r().createElement("div",{className:e.content},r().createElement("div",{className:e.headerBanner},r().createElement("div",{className:e.badgeRow},r().createElement(c.Badge,{text:"OPEN SOURCE AI SRE",color:"green"}),r().createElement(c.Badge,{text:"60+ VENDOR INTEGRATIONS",color:"blue"}),r().createElement(c.Badge,{text:"LITELLM PROXY ROUTING",color:"purple"})),r().createElement("h2",{className:e.bannerTitle},"Active Observability Integrations & SRE Tool Fleet"),r().createElement("p",{className:e.bannerDesc},"OpenSRE connects directly to your existing production infrastructure — querying VictoriaLogs with LogSQL, VictoriaMetrics with PromQL, inspecting Grafana alerts and dashboards, and routing inference through your shared LiteLLM proxy.")),r().createElement("div",{className:e.specialistGrid},i.oH.map(t=>r().createElement("div",{key:t.name,className:e.workerCard},r().createElement("div",{className:e.workerTop},r().createElement("div",{className:e.workerTitleGroup},r().createElement("div",{className:e.workerIconWrapper},r().createElement(c.Icon,{name:t.icon,className:e.workerIcon})),r().createElement("div",null,r().createElement("h4",{className:e.workerName},t.name),r().createElement("span",{className:e.workerRole},t.category))),r().createElement(c.Badge,{text:t.status.toUpperCase(),color:"connected"===t.status?"green":"configured"===t.status?"blue":"orange"})),r().createElement("p",{className:e.workerDesc},t.description),r().createElement("div",{className:e.workerMetaRow},r().createElement("span",{className:e.metaLabel},"Endpoint:"),r().createElement("span",{className:e.metaValue},t.endpoint)),r().createElement("div",{className:e.workerMetaRow},r().createElement("span",{className:e.metaLabel},"Protocol:"),r().createElement("code",{className:e.langBadge},t.protocol)),r().createElement("div",{className:e.toolsSection},r().createElement("span",{className:e.toolsHeader},"Available Capabilities:"),r().createElement("div",{className:e.toolChips},t.tools.map(t=>r().createElement("span",{key:t,className:e.toolChip},t))))))),r().createElement("div",{className:e.policyCard},r().createElement("div",{className:e.policyHeader},r().createElement(c.Icon,{name:"check-circle",className:e.iconCyan}),r().createElement("h3",{className:e.policyTitle},"OpenSRE Investigation & Blast Radius Philosophy")),r().createElement("p",{className:e.policyText},"Unlike conventional query bots, OpenSRE performs multi-step root-cause analysis (RCA) across your full stack:"),r().createElement("div",{className:e.policyGrid},r().createElement("div",{className:e.policyItem},r().createElement("span",{className:e.policyDomain},"VictoriaLogs Engine"),r().createElement("span",{className:e.policyRule},"Correlates error spikes and panic traces across microservices via LogSQL queries.")),r().createElement("div",{className:e.policyItem},r().createElement("span",{className:e.policyDomain},"VictoriaMetrics TSDB"),r().createElement("span",{className:e.policyRule},"Executes PromQL instant and range queries to isolate CPU/memory starvation.")),r().createElement("div",{className:e.policyItem},r().createElement("span",{className:e.policyDomain},"Grafana Dashboards"),r().createElement("span",{className:e.policyRule},"Verifies active alerts, provisioned datasources, and alert rule evaluation states.")),r().createElement("div",{className:e.policyItem},r().createElement("span",{className:e.policyDomain},"Unified LiteLLM Routing"),r().createElement("span",{className:e.policyRule},"Leverages the exact same model (",r().createElement("code",null,"aura-sre-model"),") and Redis prompt cache as AURA.")))))))},p=e=>({container:o.css`
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 80px);
    background: ${e.colors.background.canvas};
  `,content:o.css`
    padding: ${e.spacing(0,3,4)};
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  `,headerBanner:o.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(3)};
    margin-bottom: ${e.spacing(3)};
  `,badgeRow:o.css`
    display: flex;
    gap: ${e.spacing(1)};
    margin-bottom: ${e.spacing(1.5)};
    flex-wrap: wrap;
  `,bannerTitle:o.css`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
    margin: 0 0 ${e.spacing(1)} 0;
  `,bannerDesc:o.css`
    color: ${e.colors.text.secondary};
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
    max-width: 1000px;
  `,specialistGrid:o.css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: ${e.spacing(2.5)};
    margin-bottom: ${e.spacing(3)};
  `,workerCard:o.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2.5)};
    display: flex;
    flex-direction: column;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    &:hover {
      border-color: #00D2FF;
      box-shadow: 0 4px 16px rgba(0, 210, 255, 0.12);
    }
  `,workerTop:o.css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${e.spacing(1.5)};
  `,workerTitleGroup:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,workerIconWrapper:o.css`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: rgba(0, 210, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  `,workerIcon:o.css`
    color: #00D2FF;
    font-size: 1.25rem;
  `,workerName:o.css`
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
    color: ${e.colors.text.primary};
  `,workerRole:o.css`
    font-size: 0.8rem;
    color: ${e.colors.text.secondary};
  `,workerDesc:o.css`
    font-size: 0.875rem;
    color: ${e.colors.text.secondary};
    line-height: 1.4;
    margin-bottom: ${e.spacing(2)};
    flex-grow: 1;
  `,workerMetaRow:o.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8rem;
    padding: ${e.spacing(.5,0)};
    border-top: 1px solid ${e.colors.border.weak};
  `,metaLabel:o.css`
    color: ${e.colors.text.secondary};
  `,metaValue:o.css`
    font-family: monospace;
    color: ${e.colors.text.primary};
  `,langBadge:o.css`
    background: ${e.colors.background.canvas};
    padding: ${e.spacing(.2,.6)};
    border-radius: 4px;
    font-size: 0.75rem;
    border: 1px solid ${e.colors.border.weak};
  `,toolsSection:o.css`
    margin-top: ${e.spacing(1.5)};
    padding-top: ${e.spacing(1.5)};
    border-top: 1px solid ${e.colors.border.weak};
  `,toolsHeader:o.css`
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: ${e.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: ${e.spacing(1)};
  `,toolChips:o.css`
    display: flex;
    flex-wrap: wrap;
    gap: ${e.spacing(.75)};
  `,toolChip:o.css`
    background: rgba(0, 210, 255, 0.08);
    border: 1px solid rgba(0, 210, 255, 0.25);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.72rem;
    padding: 2px 6px;
    color: #00D2FF;
  `,policyCard:o.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(3)};
  `,policyHeader:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    margin-bottom: ${e.spacing(1)};
  `,iconCyan:o.css`
    color: #00D2FF;
    font-size: 1.25rem;
  `,policyTitle:o.css`
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0;
    color: ${e.colors.text.primary};
  `,policyText:o.css`
    color: ${e.colors.text.secondary};
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: ${e.spacing(2)};
  `,policyGrid:o.css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${e.spacing(1.5)};
  `,policyItem:o.css`
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 6px;
    padding: ${e.spacing(1.5)};
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(.5)};
  `,policyDomain:o.css`
    font-size: 0.8rem;
    font-weight: 700;
    color: #00D2FF;
  `,policyRule:o.css`
    font-size: 0.78rem;
    color: ${e.colors.text.secondary};
    line-height: 1.4;
  `}),g=m;a.d(t,["McpSpecialists",0,m,"default",0,g])}}]);
//# sourceMappingURL=519.js.map?_cache=dd2c4c82b92a8d11e5d1