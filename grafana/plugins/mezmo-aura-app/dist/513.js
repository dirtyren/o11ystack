"use strict";(self.webpackChunkmezmo_aura_app=self.webpackChunkmezmo_aura_app||[]).push([[513],{564(e,a,t){t.d(a,{N:()=>c});var n=t(531),s=t(269),r=t(351);function o(e,a,t,n,s,r,o){try{var l=e[r](o),c=l.value}catch(e){return void t(e)}l.done?a(c):Promise.resolve(c).then(n,s)}function l(e){return function(){var a=this,t=arguments;return new Promise(function(n,s){var r=e.apply(a,t);function l(e){o(r,n,s,l,c,"next",e)}function c(e){o(r,n,s,l,c,"throw",e)}l(void 0)})}}class c{static getProxyUrl(e,a){return a&&a.trim()?`${a.trim().replace(/\/$/,"")}/${e.replace(/^\//,"")}`:`api/plugin-proxy/${r.s_}/aura/${e.replace(/^\//,"")}`}static getHealth(e){return l(function*(){const a=performance.now(),t=this.getProxyUrl("health",e);try{const e=yield(0,s.lastValueFrom)((0,n.getBackendSrv)().fetch({url:t,method:"GET"})),r=Math.round(performance.now()-a);return{data:e.data,latencyMs:r}}catch(e){try{const e=yield fetch("/aura/health");if(e.ok){const t=yield e.json();return{data:t,latencyMs:Math.round(performance.now()-a)}}}catch(e){}throw e}}).call(this)}static getModels(e){return l(function*(){const a=this.getProxyUrl("v1/models",e);try{var t;return(null===(t=(yield(0,s.lastValueFrom)((0,n.getBackendSrv)().fetch({url:a,method:"GET"}))).data)||void 0===t?void 0:t.data)||[]}catch(e){try{const e=yield fetch("/aura/v1/models");if(e.ok){return(yield e.json()).data||[]}}catch(e){}return[]}}).call(this)}static sendChat(e,a){return l(function*(){const t=this.getProxyUrl("v1/chat/completions",a);try{var r,o,l,c;const a=null===(c=(yield(0,s.lastValueFrom)((0,n.getBackendSrv)().fetch({url:t,method:"POST",data:{messages:e}}))).data)||void 0===c||null===(l=c.choices)||void 0===l||null===(o=l[0])||void 0===o||null===(r=o.message)||void 0===r?void 0:r.content;if(!a)throw new Error("No content returned from Mezmo AURA Orchestrator");return a}catch(a){var i,d,p;try{const a=yield fetch("/aura/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:e})});if(a.ok){var m,u,g;const e=null===(g=(yield a.json()).choices)||void 0===g||null===(u=g[0])||void 0===u||null===(m=u.message)||void 0===m?void 0:m.content;if(e)return e}}catch(e){}const t=(null==a||null===(i=a.data)||void 0===i?void 0:i.message)||(null==a||null===(p=a.data)||void 0===p||null===(d=p.error)||void 0===d?void 0:d.message)||(null==a?void 0:a.statusText)||(null==a?void 0:a.message)||"Error communicating with AURA Orchestrator";throw new Error(t)}}).call(this)}}},893(e,a,t){t.d(a,{g:()=>d});var n=t(959),s=t.n(n),r=t(89),o=t(7),l=t(159),c=t(351);function i(e){return`${c.Gy}/${e}`}const d=({health:e,latencyMs:a,activeModel:t,isPolling:n})=>{const r=(0,o.useStyles2)(p),d=(0,l.useNavigate)(),m=(0,l.useLocation)(),u=m.pathname.endsWith("/console")||m.pathname.endsWith(c.bw.Console)||!m.pathname.includes("/"),g=m.pathname.includes("/traces"),f=m.pathname.includes("/specialists"),h="healthy"===(null==e?void 0:e.status),b="degraded"===(null==e?void 0:e.status);return s().createElement("header",{className:r.header},s().createElement("div",{className:r.topRow},s().createElement("div",{className:r.brandGroup},s().createElement("div",{className:r.logoWrapper},s().createElement("svg",{viewBox:"0 0 100 100",width:"32",height:"32"},s().createElement("polygon",{points:"50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5",fill:"#080c14",stroke:"#3b82f6",strokeWidth:"4"}),s().createElement("path",{d:"M25 45 C25 38, 42 34, 48 45 C48 56, 30 56, 25 45 Z",fill:"#38bdf8"}),s().createElement("path",{d:"M75 45 C75 38, 58 34, 52 45 C52 56, 70 56, 75 45 Z",fill:"#38bdf8"}),s().createElement("line",{x1:"48",y1:"44",x2:"52",y2:"44",stroke:"#38bdf8",strokeWidth:"3"}),s().createElement("text",{x:"50",y:"78",fill:"#38bdf8",fontFamily:"'JetBrains Mono', monospace",fontWeight:"bold",fontSize:"14",textAnchor:"middle",letterSpacing:"1"},"AURA"))),s().createElement("div",null,s().createElement("div",{className:r.titleRow},s().createElement("span",{className:r.brandTitle},"MEZMO AURA"),s().createElement("span",{className:r.brandSub},"SRE AGENT"),s().createElement(o.Badge,{text:"AUTONOMOUS TELEMETRY",color:"blue"})),s().createElement("span",{className:r.tagline},"Autonomous Multi-Agent Observability & Incident Investigation"))),s().createElement("div",{className:r.statusGroup},s().createElement("div",{className:r.statusPill},s().createElement("span",{className:h?r.statusDotHealthy:b?r.statusDotDegraded:r.statusDotOffline}),s().createElement("span",{className:r.statusText},e?h?"ONLINE (200)":e.status.toUpperCase():"CONNECTING..."),null!=a&&s().createElement("span",{className:r.latencyBadge},a," ms")),t&&s().createElement(o.Tooltip,{content:"Active LLM Orchestrator Model"},s().createElement("div",{className:r.modelPill},s().createElement(o.Icon,{name:"brain",size:"sm",className:r.iconBlue}),s().createElement("span",null,t))),s().createElement(o.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"external-link-alt",onClick:()=>window.open("/","_blank")},"Platform Hub"))),s().createElement("div",{className:r.bottomRow},s().createElement(o.TabsBar,null,s().createElement(o.Tab,{label:"Investigation Console",active:u,icon:"code-branch",onChangeTab:()=>d(i(c.bw.Console))}),s().createElement(o.Tab,{label:"Reasoning Traces",active:g,icon:"sitemap",onChangeTab:()=>d(i(c.bw.Traces))}),s().createElement(o.Tab,{label:"MCP Specialists",active:f,icon:"apps",onChangeTab:()=>d(i(c.bw.Specialists))})),s().createElement("div",{className:r.quickLinks},s().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"compass",onClick:()=>window.open("/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaTraces%22%7D","_blank")},"VictoriaTraces"),s().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"file-alt",onClick:()=>window.open("/vlogs/select/vmui/","_blank")},"VictoriaLogs"),s().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"chart-line",onClick:()=>window.open("/vmetrics/select/vmui/","_blank")},"VictoriaMetrics"),s().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"cog",onClick:()=>window.location.href="/grafana/plugins/mezmo-aura-app"},"Config"))))},p=e=>({header:r.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(1.5,2,0,2)};
    margin-bottom: ${e.spacing(2)};
    box-shadow: ${e.shadows.z1};
  `,topRow:r.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: ${e.spacing(2)};
    padding-bottom: ${e.spacing(1.5)};
    border-bottom: 1px solid ${e.colors.border.weak};
  `,brandGroup:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,logoWrapper:r.css`
    display: flex;
    align-items: center;
    justify-content: center;
    background: #080c14;
    padding: 6px;
    border-radius: 8px;
    border: 1px solid #1e293b;
  `,titleRow:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    flex-wrap: wrap;
  `,brandTitle:r.css`
    font-size: 1.25rem;
    font-weight: 800;
    font-family: ${e.typography.fontFamilyMonospace};
    color: #38bdf8;
    letter-spacing: 0.05em;
  `,brandSub:r.css`
    font-size: 0.85rem;
    font-weight: 700;
    color: ${e.colors.text.secondary};
    letter-spacing: 0.08em;
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
    gap: 8px;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    padding: 4px 10px;
    border-radius: 20px;
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.8rem;
  `,statusDotHealthy:r.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
  `,statusDotDegraded:r.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
    box-shadow: 0 0 8px #f59e0b;
  `,statusDotOffline:r.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 8px #ef4444;
  `,statusText:r.css`
    font-weight: 600;
    color: ${e.colors.text.primary};
  `,latencyBadge:r.css`
    color: ${e.colors.text.secondary};
    font-size: 0.75rem;
    border-left: 1px solid ${e.colors.border.weak};
    padding-left: 6px;
  `,modelPill:r.css`
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
  `,iconBlue:r.css`
    color: #38bdf8;
  `,bottomRow:r.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${e.spacing(.5)};
  `,quickLinks:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `})},513(e,a,t){t.r(a);var n=t(959),s=t.n(n),r=t(89),o=t(531),l=t(7),c=t(564),i=t(893);const d=()=>{const e=(0,l.useStyles2)(m),[a,t]=(0,n.useState)(null),[r,d]=(0,n.useState)(null);(0,n.useEffect)(()=>{c.N.getHealth().then(e=>{t(e.data),d(e.latencyMs)}).catch(()=>{})},[]);return s().createElement(o.PluginPage,null,s().createElement("div",{className:e.container},s().createElement(i.g,{health:a,latencyMs:r}),s().createElement("div",{className:e.contentCard},s().createElement("div",{className:e.hero},s().createElement("div",{className:e.heroText},s().createElement("div",{className:e.badgeRow},s().createElement(l.Badge,{text:"OPENTELEMETRY TRACES",color:"blue"}),s().createElement(l.Badge,{text:"VICTORIATRACES BACKEND",color:"green"}),s().createElement(l.Badge,{text:"GRAFANA TEMPO COMPATIBLE",color:"purple"})),s().createElement("h2",{className:e.heroTitle},"Auditing AURA's AI Reasoning Waterfall"),s().createElement("p",{className:e.heroDesc},"Every investigation initiated in the AURA console emits OpenTelemetry spans to"," ",s().createElement("code",null,"http://otel-collector:4317"),". This enables SRE operators to trace ",s().createElement("em",null,"how the AI thought"),", which subagents were invoked, the exact PromQL/LogSQL queries dispatched to MCP tools, and step latencies."),s().createElement("div",{className:e.btnGroup},s().createElement(l.Button,{size:"md",variant:"primary",icon:"compass",onClick:()=>(e=>{const a=`/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaTraces%22%2C%22queries%22%3A%5B%7B%22query%22%3A%22${encodeURIComponent(e||"aura")}%22%2C%22queryType%22%3A%22service%22%7D%5D%7D`;window.open(a,"_blank")})("aura")},"Open VictoriaTraces in Grafana Explore"),s().createElement(l.Button,{size:"md",variant:"secondary",fill:"outline",icon:"external-link-alt",onClick:()=>window.open("/vtraces/select/vmui/","_blank")},"Open VictoriaTraces VMUI")))),s().createElement("div",{className:e.grid},s().createElement("div",{className:e.card},s().createElement("div",{className:e.cardHeader},s().createElement(l.Icon,{name:"sitemap",className:e.iconBlue}),s().createElement("h4",{className:e.cardTitle},"Span Hierarchy & Multi-Agent Flow")),s().createElement("div",{className:e.waterfallMock},s().createElement("div",{className:e.spanRowRoot},s().createElement("span",{className:e.spanName},"orchestrator.investigate"),s().createElement("span",{className:e.spanDuration},"1.82s")),s().createElement("div",{className:e.spanRowChild1},s().createElement("span",{className:e.spanName},"coordinator.plan"),s().createElement("span",{className:e.spanDuration},"210ms")),s().createElement("div",{className:e.spanRowChild1},s().createElement("span",{className:e.spanName},"delegate.metrics-analyst"),s().createElement("span",{className:e.spanDuration},"420ms")),s().createElement("div",{className:e.spanRowChild2},s().createElement("span",{className:e.spanName},"mcp.victoriametrics-instant_query"),s().createElement("span",{className:e.spanDuration},"14ms")),s().createElement("div",{className:e.spanRowChild1},s().createElement("span",{className:e.spanName},"delegate.log-analyst"),s().createElement("span",{className:e.spanDuration},"510ms")),s().createElement("div",{className:e.spanRowChild2},s().createElement("span",{className:e.spanName},"mcp.victorialogs-hits"),s().createElement("span",{className:e.spanDuration},"22ms")),s().createElement("div",{className:e.spanRowChild1},s().createElement("span",{className:e.spanName},"coordinator.synthesize"),s().createElement("span",{className:e.spanDuration},"640ms")))),s().createElement("div",{className:e.card},s().createElement("div",{className:e.cardHeader},s().createElement(l.Icon,{name:"search",className:e.iconGreen}),s().createElement("h4",{className:e.cardTitle},"How to Inspect in Grafana")),s().createElement("ol",{className:e.instructionList},s().createElement("li",null,"Click the ",s().createElement("strong",null,"Open VictoriaTraces in Grafana Explore")," button above."),s().createElement("li",null,"Verify datasource is selected as ",s().createElement("strong",null,"VictoriaTraces")," (Tempo-compatible)."),s().createElement("li",null,"Set Service Name to ",s().createElement("code",null,"aura")," and click ",s().createElement("strong",null,"Run Query"),"."),s().createElement("li",null,"Select any trace to expand the complete waterfall:",s().createElement("ul",null,s().createElement("li",null,"Coordinator turn depth & planning reasoning."),s().createElement("li",null,"Subagent worker task delegations."),s().createElement("li",null,"Exact PromQL/LogSQL queries passed to MCP tools."),s().createElement("li",null,"Tool execution latency and token generation speed.")))))))))},p=d,m=e=>({container:r.css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,contentCard:r.css`
    background: ${e.colors.background.primary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2.5)};
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(3)};
  `,hero:r.css`
    display: flex;
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-left: 4px solid #38bdf8;
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2.5)};
  `,heroText:r.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.25)};
  `,badgeRow:r.css`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  `,heroTitle:r.css`
    font-size: 1.4rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
    margin: 0;
  `,heroDesc:r.css`
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
  `,btnGroup:r.css`
    display: flex;
    gap: ${e.spacing(1.5)};
    margin-top: ${e.spacing(1)};
  `,grid:r.css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${e.spacing(2)};
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  `,card:r.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2)};
  `,cardHeader:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    margin-bottom: ${e.spacing(1.5)};
  `,cardTitle:r.css`
    font-size: 1rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
    margin: 0;
  `,iconBlue:r.css`
    color: #38bdf8;
  `,iconGreen:r.css`
    color: #10b981;
  `,waterfallMock:r.css`
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 6px;
    padding: ${e.spacing(1.5)};
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.8rem;
  `,spanRowRoot:r.css`
    display: flex;
    justify-content: space-between;
    background: rgba(59, 130, 246, 0.2);
    border: 1px solid rgba(59, 130, 246, 0.4);
    padding: 6px 10px;
    border-radius: 4px;
    color: #38bdf8;
    font-weight: 600;
  `,spanRowChild1:r.css`
    display: flex;
    justify-content: space-between;
    margin-left: 20px;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 5px 8px;
    border-radius: 4px;
    color: #10b981;
  `,spanRowChild2:r.css`
    display: flex;
    justify-content: space-between;
    margin-left: 40px;
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.3);
    padding: 4px 8px;
    border-radius: 4px;
    color: #f59e0b;
    font-size: 0.75rem;
  `,spanName:r.css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,spanDuration:r.css`
    margin-left: 10px;
  `,instructionList:r.css`
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
//# sourceMappingURL=513.js.map?_cache=0c4cffe2676ddfac5742