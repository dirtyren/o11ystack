"use strict";(self.webpackChunkopensre_app=self.webpackChunkopensre_app||[]).push([[839],{796(e,a,t){t.d(a,{Q:()=>l});var s=t(531),o=t(269),r=t(474);function n(e,a,t,s,o,r,n){try{var c=e[r](n),l=c.value}catch(e){return void t(e)}c.done?a(l):Promise.resolve(l).then(s,o)}function c(e){return function(){var a=this,t=arguments;return new Promise(function(s,o){var r=e.apply(a,t);function c(e){n(r,s,o,c,l,"next",e)}function l(e){n(r,s,o,c,l,"throw",e)}c(void 0)})}}class l{static getProxyUrl(e,a){return a&&a.trim()?`${a.trim().replace(/\/$/,"")}/${e.replace(/^\//,"")}`:`api/plugin-proxy/${r.s_}/opensre/${e.replace(/^\//,"")}`}static getHealth(e){return c(function*(){const a=performance.now(),t=this.getProxyUrl("health",e);try{const e=yield(0,o.lastValueFrom)((0,s.getBackendSrv)().fetch({url:t,method:"GET"})),r=Math.round(performance.now()-a);return{data:e.data,latencyMs:r}}catch(e){try{const e=yield fetch("/opensre/health");if(e.ok){const t=yield e.json();return{data:t,latencyMs:Math.round(performance.now()-a)}}}catch(e){}throw e}}).call(this)}static getModels(e){return c(function*(){const a=this.getProxyUrl("v1/models",e);try{var t;return(null===(t=(yield(0,o.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"GET"}))).data)||void 0===t?void 0:t.data)||[]}catch(e){try{const e=yield fetch("/opensre/v1/models");if(e.ok){return(yield e.json()).data||[]}}catch(e){}return[]}}).call(this)}static sendChat(e,a){return c(function*(){const t=this.getProxyUrl("v1/chat/completions",a);try{var r,n,c,l;const a=null===(l=(yield(0,o.lastValueFrom)((0,s.getBackendSrv)().fetch({url:t,method:"POST",data:{messages:e}}))).data)||void 0===l||null===(c=l.choices)||void 0===c||null===(n=c[0])||void 0===n||null===(r=n.message)||void 0===r?void 0:r.content;if(!a)throw new Error("No content returned from OpenSRE Agent");return a}catch(a){var i,d,m;try{const a=yield fetch("/opensre/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:e})});if(a.ok){var p,g,u;const e=null===(u=(yield a.json()).choices)||void 0===u||null===(g=u[0])||void 0===g||null===(p=g.message)||void 0===p?void 0:p.content;if(e)return e}}catch(e){}const t=(null==a||null===(i=a.data)||void 0===i?void 0:i.message)||(null==a||null===(m=a.data)||void 0===m||null===(d=m.error)||void 0===d?void 0:d.message)||(null==a?void 0:a.statusText)||(null==a?void 0:a.message)||"Error communicating with OpenSRE Agent";throw new Error(t)}}).call(this)}}const i=l;t.d(a,["N",0,i])},352(e,a,t){t.d(a,{g:()=>d});var s=t(959),o=t.n(s),r=t(89),n=t(7),c=t(159),l=t(474);function i(e){return`${l.Gy}/${e}`}const d=({health:e,latencyMs:a,activeModel:t})=>{const s=(0,n.useStyles2)(m),r=(0,c.useNavigate)(),d=(0,c.useLocation)(),p=d.pathname.endsWith("/console")||d.pathname.endsWith(l.bw.Console)||!d.pathname.includes("/"),g=d.pathname.includes("/traces"),u=d.pathname.includes("/integrations"),h="healthy"===(null==e?void 0:e.status),y="degraded"===(null==e?void 0:e.status);return o().createElement("header",{className:s.header},o().createElement("div",{className:s.topRow},o().createElement("div",{className:s.brandGroup},o().createElement("div",{className:s.logoWrapper},o().createElement("svg",{viewBox:"0 0 100 100",width:"32",height:"32"},o().createElement("polygon",{points:"50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5",fill:"#080c14",stroke:"#00D2FF",strokeWidth:"4"}),o().createElement("circle",{cx:"50",cy:"50",r:"18",fill:"none",stroke:"#27E99F",strokeWidth:"3.5"}),o().createElement("line",{x1:"50",y1:"12",x2:"50",y2:"32",stroke:"#00D2FF",strokeWidth:"3"}),o().createElement("line",{x1:"50",y1:"68",x2:"50",y2:"88",stroke:"#00D2FF",strokeWidth:"3"}),o().createElement("line",{x1:"16",y1:"50",x2:"32",y2:"50",stroke:"#00D2FF",strokeWidth:"3"}),o().createElement("line",{x1:"68",y1:"50",x2:"84",y2:"50",stroke:"#00D2FF",strokeWidth:"3"}),o().createElement("circle",{cx:"50",cy:"50",r:"6",fill:"#27E99F"}))),o().createElement("div",null,o().createElement("div",{className:s.titleRow},o().createElement("span",{className:s.brandTitle},"OPENSRE"),o().createElement("span",{className:s.brandSub},"AI SRE AGENT"),o().createElement(n.Badge,{text:"OPEN SOURCE SRE",color:"green"})),o().createElement("span",{className:s.tagline},"Autonomous Incident Investigation, TSDB & Log Triage, and ChatOps"))),o().createElement("div",{className:s.statusGroup},o().createElement("div",{className:s.statusPill},o().createElement("span",{className:h?s.statusDotHealthy:y?s.statusDotDegraded:s.statusDotOffline}),o().createElement("span",{className:s.statusText},e?h?"ONLINE (200)":e.status.toUpperCase():"CONNECTING..."),null!=a&&o().createElement("span",{className:s.latencyBadge},a," ms")),t&&o().createElement(n.Tooltip,{content:"Active LLM Model (routed via LiteLLM Proxy)"},o().createElement("div",{className:s.modelPill},o().createElement(n.Icon,{name:"brain",size:"sm",className:s.iconCyan}),o().createElement("span",null,t))),o().createElement(n.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"exchange-alt",onClick:()=>window.location.href="/grafana/a/mezmo-aura-app/console"},"Switch to AURA"))),o().createElement("div",{className:s.bottomRow},o().createElement(n.TabsBar,null,o().createElement(n.Tab,{label:"Investigation Console",active:p,icon:"code-branch",onChangeTab:()=>r(i(l.bw.Console))}),o().createElement(n.Tab,{label:"Integrations & Fleet",active:u,icon:"apps",onChangeTab:()=>r(i(l.bw.Integrations))}),o().createElement(n.Tab,{label:"Telemetry & Spans",active:g,icon:"sitemap",onChangeTab:()=>r(i(l.bw.Traces))})),o().createElement("div",{className:s.quickLinks},o().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"file-alt",onClick:()=>window.open("/vlogs/select/vmui/","_blank")},"VictoriaLogs"),o().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"chart-line",onClick:()=>window.open("/vmetrics/vmui/","_blank")},"VictoriaMetrics"),o().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"brain",onClick:()=>window.open("/litellm/ui/","_blank")},"LiteLLM Hub"))))},m=e=>({header:r.css`
    display: flex;
    flex-direction: column;
    background: ${e.colors.background.secondary};
    border-bottom: 1px solid ${e.colors.border.weak};
    padding: ${e.spacing(1.5,2,0)};
    margin-bottom: ${e.spacing(2)};
  `,topRow:r.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${e.spacing(1.5)};
    flex-wrap: wrap;
    gap: ${e.spacing(1)};
  `,brandGroup:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,logoWrapper:r.css`
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 0 8px rgba(0, 210, 255, 0.4));
  `,titleRow:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `,brandTitle:r.css`
    font-weight: 800;
    font-size: 1.15rem;
    letter-spacing: 0.5px;
    color: #00D2FF;
  `,brandSub:r.css`
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 1px;
    color: ${e.colors.text.secondary};
  `,tagline:r.css`
    display: block;
    font-size: 0.75rem;
    color: ${e.colors.text.secondary};
    margin-top: 2px;
  `,statusGroup:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,statusPill:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.75)};
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 16px;
    padding: ${e.spacing(.35,1)};
    font-size: 0.75rem;
  `,statusDotHealthy:r.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  `,statusDotDegraded:r.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
    box-shadow: 0 0 6px #f59e0b;
  `,statusDotOffline:r.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 6px #ef4444;
  `,statusText:r.css`
    font-family: monospace;
    font-weight: 600;
  `,latencyBadge:r.css`
    color: ${e.colors.text.secondary};
    font-size: 0.7rem;
    padding-left: ${e.spacing(.5)};
    border-left: 1px solid ${e.colors.border.weak};
  `,modelPill:r.css`
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
  `,iconCyan:r.css`
    color: #00D2FF;
  `,bottomRow:r.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,quickLinks:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.5)};
    margin-bottom: ${e.spacing(.5)};
  `})},839(e,a,t){t.r(a);var s=t(959),o=t.n(s),r=t(89),n=t(531),c=t(7),l=t(796),i=t(474),d=t(352);const m=e=>({container:r.css`
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 80px);
    background: ${e.colors.background.canvas};
  `,content:r.css`
    padding: ${e.spacing(0,3,4)};
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  `,headerBanner:r.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(3)};
    margin-bottom: ${e.spacing(3)};
  `,badgeRow:r.css`
    display: flex;
    gap: ${e.spacing(1)};
    margin-bottom: ${e.spacing(1.5)};
    flex-wrap: wrap;
  `,bannerTitle:r.css`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
    margin: 0 0 ${e.spacing(1)} 0;
  `,bannerDesc:r.css`
    color: ${e.colors.text.secondary};
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
    max-width: 1000px;
  `,specialistGrid:r.css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: ${e.spacing(2.5)};
    margin-bottom: ${e.spacing(3)};
  `,workerCard:r.css`
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
  `,workerTop:r.css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${e.spacing(1.5)};
  `,workerTitleGroup:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,workerIconWrapper:r.css`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: rgba(0, 210, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  `,workerIcon:r.css`
    color: #00D2FF;
    font-size: 1.25rem;
  `,workerName:r.css`
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
    color: ${e.colors.text.primary};
  `,workerRole:r.css`
    font-size: 0.8rem;
    color: ${e.colors.text.secondary};
  `,workerDesc:r.css`
    font-size: 0.875rem;
    color: ${e.colors.text.secondary};
    line-height: 1.4;
    margin-bottom: ${e.spacing(2)};
    flex-grow: 1;
  `,workerMetaRow:r.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8rem;
    padding: ${e.spacing(.5,0)};
    border-top: 1px solid ${e.colors.border.weak};
  `,metaLabel:r.css`
    color: ${e.colors.text.secondary};
  `,metaValue:r.css`
    font-family: monospace;
    color: ${e.colors.text.primary};
  `,langBadge:r.css`
    background: ${e.colors.background.canvas};
    padding: ${e.spacing(.2,.6)};
    border-radius: 4px;
    font-size: 0.75rem;
    border: 1px solid ${e.colors.border.weak};
  `,toolsSection:r.css`
    margin-top: ${e.spacing(1.5)};
    padding-top: ${e.spacing(1.5)};
    border-top: 1px solid ${e.colors.border.weak};
  `,toolsHeader:r.css`
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: ${e.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: ${e.spacing(1)};
  `,toolChips:r.css`
    display: flex;
    flex-wrap: wrap;
    gap: ${e.spacing(.75)};
  `,toolChip:r.css`
    background: rgba(0, 210, 255, 0.08);
    border: 1px solid rgba(0, 210, 255, 0.25);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.72rem;
    padding: 2px 6px;
    color: #00D2FF;
  `,policyCard:r.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(3)};
  `,policyHeader:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    margin-bottom: ${e.spacing(1)};
  `,iconCyan:r.css`
    color: #00D2FF;
    font-size: 1.25rem;
  `,policyTitle:r.css`
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0;
    color: ${e.colors.text.primary};
  `,policyText:r.css`
    color: ${e.colors.text.secondary};
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: ${e.spacing(2)};
  `,policyGrid:r.css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${e.spacing(1.5)};
  `,policyItem:r.css`
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 6px;
    padding: ${e.spacing(1.5)};
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(.5)};
  `,policyDomain:r.css`
    font-size: 0.8rem;
    font-weight: 700;
    color: #00D2FF;
  `,policyRule:r.css`
    font-size: 0.78rem;
    color: ${e.colors.text.secondary};
    line-height: 1.4;
  `});t.d(a,["McpSpecialists",0,()=>{const e=(0,c.useStyles2)(m),[a,t]=(0,s.useState)(null),[r,p]=(0,s.useState)(null);return(0,s.useEffect)(()=>{l.Q.getHealth().then(e=>{t(e.data),p(e.latencyMs)}).catch(()=>{})},[]),o().createElement(n.PluginPage,null,o().createElement("div",{className:e.container},o().createElement(d.g,{health:a,latencyMs:r}),o().createElement("div",{className:e.content},o().createElement("div",{className:e.headerBanner},o().createElement("div",{className:e.badgeRow},o().createElement(c.Badge,{text:"OPEN SOURCE AI SRE",color:"green"}),o().createElement(c.Badge,{text:"60+ VENDOR INTEGRATIONS",color:"blue"}),o().createElement(c.Badge,{text:"LITELLM PROXY ROUTING",color:"purple"})),o().createElement("h2",{className:e.bannerTitle},"Active Observability Integrations & SRE Tool Fleet"),o().createElement("p",{className:e.bannerDesc},"OpenSRE connects directly to your existing production infrastructure — querying VictoriaLogs with LogSQL, VictoriaMetrics with PromQL, inspecting Grafana alerts and dashboards, and routing inference through your shared LiteLLM proxy.")),o().createElement("div",{className:e.specialistGrid},i.oH.map(a=>o().createElement("div",{key:a.name,className:e.workerCard},o().createElement("div",{className:e.workerTop},o().createElement("div",{className:e.workerTitleGroup},o().createElement("div",{className:e.workerIconWrapper},o().createElement(c.Icon,{name:a.icon,className:e.workerIcon})),o().createElement("div",null,o().createElement("h4",{className:e.workerName},a.name),o().createElement("span",{className:e.workerRole},a.category))),o().createElement(c.Badge,{text:a.status.toUpperCase(),color:"connected"===a.status?"green":"configured"===a.status?"blue":"orange"})),o().createElement("p",{className:e.workerDesc},a.description),o().createElement("div",{className:e.workerMetaRow},o().createElement("span",{className:e.metaLabel},"Endpoint:"),o().createElement("span",{className:e.metaValue},a.endpoint)),o().createElement("div",{className:e.workerMetaRow},o().createElement("span",{className:e.metaLabel},"Protocol:"),o().createElement("code",{className:e.langBadge},a.protocol)),o().createElement("div",{className:e.toolsSection},o().createElement("span",{className:e.toolsHeader},"Available Capabilities:"),o().createElement("div",{className:e.toolChips},a.tools.map(a=>o().createElement("span",{key:a,className:e.toolChip},a))))))),o().createElement("div",{className:e.policyCard},o().createElement("div",{className:e.policyHeader},o().createElement(c.Icon,{name:"shield-check",className:e.iconCyan}),o().createElement("h3",{className:e.policyTitle},"OpenSRE Investigation & Blast Radius Philosophy")),o().createElement("p",{className:e.policyText},"Unlike conventional query bots, OpenSRE performs multi-step root-cause analysis (RCA) across your full stack:"),o().createElement("div",{className:e.policyGrid},o().createElement("div",{className:e.policyItem},o().createElement("span",{className:e.policyDomain},"VictoriaLogs Engine"),o().createElement("span",{className:e.policyRule},"Correlates error spikes and panic traces across microservices via LogSQL queries.")),o().createElement("div",{className:e.policyItem},o().createElement("span",{className:e.policyDomain},"VictoriaMetrics TSDB"),o().createElement("span",{className:e.policyRule},"Executes PromQL instant and range queries to isolate CPU/memory starvation.")),o().createElement("div",{className:e.policyItem},o().createElement("span",{className:e.policyDomain},"Grafana Dashboards"),o().createElement("span",{className:e.policyRule},"Verifies active alerts, provisioned datasources, and alert rule evaluation states.")),o().createElement("div",{className:e.policyItem},o().createElement("span",{className:e.policyDomain},"Unified LiteLLM Routing"),o().createElement("span",{className:e.policyRule},"Leverages the exact same model (",o().createElement("code",null,"aura-sre-model"),") and Redis prompt cache as AURA.")))))))}])}}]);
//# sourceMappingURL=839.js.map?_cache=cd58666f96604ac5b462