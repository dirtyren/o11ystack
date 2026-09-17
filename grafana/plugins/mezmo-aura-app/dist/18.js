"use strict";(self.webpackChunkmezmo_aura_app=self.webpackChunkmezmo_aura_app||[]).push([[18],{564(e,t,a){a.d(t,{N:()=>c});var s=a(531),r=a(269),n=a(351);function o(e,t,a,s,r,n,o){try{var l=e[n](o),c=l.value}catch(e){return void a(e)}l.done?t(c):Promise.resolve(c).then(s,r)}function l(e){return function(){var t=this,a=arguments;return new Promise(function(s,r){var n=e.apply(t,a);function l(e){o(n,s,r,l,c,"next",e)}function c(e){o(n,s,r,l,c,"throw",e)}l(void 0)})}}class c{static getProxyUrl(e,t){return t&&t.trim()?`${t.trim().replace(/\/$/,"")}/${e.replace(/^\//,"")}`:`api/plugin-proxy/${n.s_}/aura/${e.replace(/^\//,"")}`}static getHealth(e){return l(function*(){const t=performance.now(),a=this.getProxyUrl("health",e);try{const e=yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"GET"})),n=Math.round(performance.now()-t);return{data:e.data,latencyMs:n}}catch(e){try{const e=yield fetch("/aura/health");if(e.ok){const a=yield e.json();return{data:a,latencyMs:Math.round(performance.now()-t)}}}catch(e){}throw e}}).call(this)}static getModels(e){return l(function*(){const t=this.getProxyUrl("v1/models",e);try{var a;return(null===(a=(yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:t,method:"GET"}))).data)||void 0===a?void 0:a.data)||[]}catch(e){try{const e=yield fetch("/aura/v1/models");if(e.ok){return(yield e.json()).data||[]}}catch(e){}return[]}}).call(this)}static sendChat(e,t){return l(function*(){const a=this.getProxyUrl("v1/chat/completions",t);try{var n,o,l,c;const t=null===(c=(yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"POST",data:{messages:e}}))).data)||void 0===c||null===(l=c.choices)||void 0===l||null===(o=l[0])||void 0===o||null===(n=o.message)||void 0===n?void 0:n.content;if(!t)throw new Error("No content returned from Mezmo AURA Orchestrator");return t}catch(t){var i,d,m;try{const t=yield fetch("/aura/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:e})});if(t.ok){var p,u,g;const e=null===(g=(yield t.json()).choices)||void 0===g||null===(u=g[0])||void 0===u||null===(p=u.message)||void 0===p?void 0:p.content;if(e)return e}}catch(e){}const a=(null==t||null===(i=t.data)||void 0===i?void 0:i.message)||(null==t||null===(m=t.data)||void 0===m||null===(d=m.error)||void 0===d?void 0:d.message)||(null==t?void 0:t.statusText)||(null==t?void 0:t.message)||"Error communicating with AURA Orchestrator";throw new Error(a)}}).call(this)}}},893(e,t,a){a.d(t,{g:()=>d});var s=a(959),r=a.n(s),n=a(89),o=a(7),l=a(159),c=a(351);function i(e){return`${c.Gy}/${e}`}const d=({health:e,latencyMs:t,activeModel:a,isPolling:s})=>{const n=(0,o.useStyles2)(m),d=(0,l.useNavigate)(),p=(0,l.useLocation)(),u=p.pathname.endsWith("/console")||p.pathname.endsWith(c.bw.Console)||!p.pathname.includes("/"),g=p.pathname.includes("/traces"),f=p.pathname.includes("/specialists"),h="healthy"===(null==e?void 0:e.status),b="degraded"===(null==e?void 0:e.status);return r().createElement("header",{className:n.header},r().createElement("div",{className:n.topRow},r().createElement("div",{className:n.brandGroup},r().createElement("div",{className:n.logoWrapper},r().createElement("svg",{viewBox:"0 0 100 100",width:"32",height:"32"},r().createElement("polygon",{points:"50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5",fill:"#080c14",stroke:"#3b82f6",strokeWidth:"4"}),r().createElement("path",{d:"M25 45 C25 38, 42 34, 48 45 C48 56, 30 56, 25 45 Z",fill:"#38bdf8"}),r().createElement("path",{d:"M75 45 C75 38, 58 34, 52 45 C52 56, 70 56, 75 45 Z",fill:"#38bdf8"}),r().createElement("line",{x1:"48",y1:"44",x2:"52",y2:"44",stroke:"#38bdf8",strokeWidth:"3"}),r().createElement("text",{x:"50",y:"78",fill:"#38bdf8",fontFamily:"'JetBrains Mono', monospace",fontWeight:"bold",fontSize:"14",textAnchor:"middle",letterSpacing:"1"},"AURA"))),r().createElement("div",null,r().createElement("div",{className:n.titleRow},r().createElement("span",{className:n.brandTitle},"MEZMO AURA"),r().createElement("span",{className:n.brandSub},"SRE AGENT"),r().createElement(o.Badge,{text:"AUTONOMOUS TELEMETRY",color:"blue"})),r().createElement("span",{className:n.tagline},"Autonomous Multi-Agent Observability & Incident Investigation"))),r().createElement("div",{className:n.statusGroup},r().createElement("div",{className:n.statusPill},r().createElement("span",{className:h?n.statusDotHealthy:b?n.statusDotDegraded:n.statusDotOffline}),r().createElement("span",{className:n.statusText},e?h?"ONLINE (200)":e.status.toUpperCase():"CONNECTING..."),null!=t&&r().createElement("span",{className:n.latencyBadge},t," ms")),a&&r().createElement(o.Tooltip,{content:"Active LLM Orchestrator Model"},r().createElement("div",{className:n.modelPill},r().createElement(o.Icon,{name:"brain",size:"sm",className:n.iconBlue}),r().createElement("span",null,a))),r().createElement(o.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"external-link-alt",onClick:()=>window.open("/","_blank")},"Platform Hub"))),r().createElement("div",{className:n.bottomRow},r().createElement(o.TabsBar,null,r().createElement(o.Tab,{label:"Investigation Console",active:u,icon:"code-branch",onChangeTab:()=>d(i(c.bw.Console))}),r().createElement(o.Tab,{label:"Reasoning Traces",active:g,icon:"sitemap",onChangeTab:()=>d(i(c.bw.Traces))}),r().createElement(o.Tab,{label:"MCP Specialists",active:f,icon:"apps",onChangeTab:()=>d(i(c.bw.Specialists))})),r().createElement("div",{className:n.quickLinks},r().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"compass",onClick:()=>window.open("/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaTraces%22%7D","_blank")},"VictoriaTraces"),r().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"file-alt",onClick:()=>window.open("/vlogs/select/vmui/","_blank")},"VictoriaLogs"),r().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"chart-line",onClick:()=>window.open("/vmetrics/select/vmui/","_blank")},"VictoriaMetrics"),r().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"cog",onClick:()=>window.location.href="/grafana/plugins/mezmo-aura-app"},"Config"))))},m=e=>({header:n.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(1.5,2,0,2)};
    margin-bottom: ${e.spacing(2)};
    box-shadow: ${e.shadows.z1};
  `,topRow:n.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: ${e.spacing(2)};
    padding-bottom: ${e.spacing(1.5)};
    border-bottom: 1px solid ${e.colors.border.weak};
  `,brandGroup:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,logoWrapper:n.css`
    display: flex;
    align-items: center;
    justify-content: center;
    background: #080c14;
    padding: 6px;
    border-radius: 8px;
    border: 1px solid #1e293b;
  `,titleRow:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    flex-wrap: wrap;
  `,brandTitle:n.css`
    font-size: 1.25rem;
    font-weight: 800;
    font-family: ${e.typography.fontFamilyMonospace};
    color: #38bdf8;
    letter-spacing: 0.05em;
  `,brandSub:n.css`
    font-size: 0.85rem;
    font-weight: 700;
    color: ${e.colors.text.secondary};
    letter-spacing: 0.08em;
  `,tagline:n.css`
    display: block;
    font-size: 0.75rem;
    color: ${e.colors.text.secondary};
    margin-top: 2px;
  `,statusGroup:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,statusPill:n.css`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    padding: 4px 10px;
    border-radius: 20px;
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.8rem;
  `,statusDotHealthy:n.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
  `,statusDotDegraded:n.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
    box-shadow: 0 0 8px #f59e0b;
  `,statusDotOffline:n.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 8px #ef4444;
  `,statusText:n.css`
    font-weight: 600;
    color: ${e.colors.text.primary};
  `,latencyBadge:n.css`
    color: ${e.colors.text.secondary};
    font-size: 0.75rem;
    border-left: 1px solid ${e.colors.border.weak};
    padding-left: 6px;
  `,modelPill:n.css`
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
  `,iconBlue:n.css`
    color: #38bdf8;
  `,bottomRow:n.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${e.spacing(.5)};
  `,quickLinks:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `})},18(e,t,a){a.r(t),a.d(t,{InvestigationConsole:()=>A,default:()=>T});var s=a(959),r=a.n(s),n=a(89),o=a(531),l=a(7),c=a(564),i=a(351);function d(e){return`investigation:${function(e){const t=o.config.bootData.user;return`${t.orgId}:${t.id}:${e}`}(e)}`}var m=a(893);const p=({health:e,latencyMs:t})=>{var a;const n=(0,l.useStyles2)(u),[o,c]=(0,s.useState)(!1),[d,m]=(0,s.useState)(!1),p="healthy"===(null==e?void 0:e.status);return r().createElement("aside",{className:n.sidebar},r().createElement("div",{className:n.card},r().createElement("div",{className:n.cardHeader},r().createElement(l.Icon,{name:"heart-rate",className:n.iconBlue}),r().createElement("span",{className:n.cardTitle},"Live Agent Telemetry")),r().createElement("div",{className:n.statList},r().createElement("div",{className:n.statRow},r().createElement("span",{className:n.statLabel},"Agent State"),r().createElement("span",{className:p?n.statValueGreen:n.statValueAmber},(null==e?void 0:e.status)?e.status.toUpperCase():"UNKNOWN")),r().createElement("div",{className:n.statRow},r().createElement("span",{className:n.statLabel},"AURA Version"),r().createElement("span",{className:n.statValue},(null==e?void 0:e.aura_version)?`v${e.aura_version}`:"0.2.17")),r().createElement("div",{className:n.statRow},r().createElement("span",{className:n.statLabel},"Session Store"),r().createElement("span",{className:n.statValue},(null==e||null===(a=e.session_store)||void 0===a?void 0:a.backend)||"memory")),r().createElement("div",{className:n.statRow},r().createElement("span",{className:n.statLabel},"MCP Gateway"),r().createElement("span",{className:n.statValue},"LiteLLM :4000")),r().createElement("div",{className:n.statRow},r().createElement("span",{className:n.statLabel},"Health Latency"),r().createElement("span",{className:n.statValue},null!=t?`${t} ms`:"--")))),r().createElement("div",{className:n.card},r().createElement("div",{className:n.cardHeader},r().createElement(l.Icon,{name:"apps",className:n.iconBlue}),r().createElement("span",{className:n.cardTitle},"Active MCP Specialists"),r().createElement(l.Badge,{text:"216 TOOLS",color:"purple"})),r().createElement("div",{className:n.workersList},i.Cc.map(e=>r().createElement("div",{key:e.name,className:n.workerItem},r().createElement("span",{className:n.workerDot}),r().createElement("div",{className:n.workerDetails},r().createElement("div",{className:n.workerNameRow},r().createElement("span",{className:n.workerName},e.name),r().createElement("span",{className:n.workerLang},e.queryLang)),r().createElement("span",{className:n.workerDesc},e.backend)))))),r().createElement("div",{className:n.cardGlow},r().createElement("div",{className:n.cardHeader},r().createElement(l.Icon,{name:"sitemap",className:n.iconCyan}),r().createElement("span",{className:n.cardTitle},"Reasoning Traces in Grafana")),r().createElement("p",{className:n.cardText},"AURA streams its reasoning steps, subagent delegations, and PromQL/LogSQL queries to VictoriaTraces via OTel spans."),r().createElement(l.Button,{size:"sm",variant:"primary",icon:"compass",fullWidth:!0,onClick:()=>{window.open("/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaTraces%22%2C%22queries%22%3A%5B%7B%22query%22%3A%22aura%22%2C%22queryType%22%3A%22service%22%7D%5D%7D","_blank")}},"Explore Reasoning Traces")),r().createElement("div",{className:n.card},r().createElement("div",{className:n.cardHeader},r().createElement(l.Icon,{name:"code-branch",className:n.iconBlue}),r().createElement("span",{className:n.cardTitle},"Terminal CLI & API")),r().createElement("span",{className:n.subLabel},"Direct REPL client in container:"),r().createElement("div",{className:n.snippetBox},r().createElement("code",{className:n.snippetCode},"docker exec -it aura ./aura"),r().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:o?"check":"copy",onClick:()=>{navigator.clipboard.writeText("docker exec -it aura ./aura"),c(!0),setTimeout(()=>c(!1),2e3)}},o?"Copied":"Copy")),r().createElement("span",{className:n.subLabel,style:{marginTop:"12px"}},"OpenAI-compatible REST API:"),r().createElement("div",{className:n.snippetBox},r().createElement("code",{className:n.snippetCode},"POST /aura/v1/chat/completions"),r().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:d?"check":"copy",onClick:()=>{const e=`curl -k -s -u admin:<BASIC_AUTH_PASSWORD> \\\n  -X POST https://${window.location.host}/aura/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -d '{"messages":[{"role":"user","content":"Check system health"}]}'`;navigator.clipboard.writeText(e),m(!0),setTimeout(()=>m(!1),2e3)}},d?"Copied":"Copy"))))},u=e=>({sidebar:n.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.5)};
    width: 320px;
    flex-shrink: 0;
    @media (max-width: 1024px) {
      width: 100%;
    }
  `,card:n.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(1.5)};
  `,cardGlow:n.css`
    background: ${e.colors.background.secondary};
    border: 1px solid #38bdf8;
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(1.5)};
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.15);
  `,cardHeader:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    margin-bottom: ${e.spacing(1.25)};
  `,cardTitle:n.css`
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${e.colors.text.primary};
    flex: 1;
  `,cardText:n.css`
    font-size: 0.75rem;
    color: ${e.colors.text.secondary};
    line-height: 1.5;
    margin-bottom: ${e.spacing(1.25)};
  `,iconBlue:n.css`
    color: #3b82f6;
  `,iconCyan:n.css`
    color: #38bdf8;
  `,statList:n.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(.75)};
  `,statRow:n.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    padding-bottom: 4px;
    border-bottom: 1px solid ${e.colors.border.weak};
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  `,statLabel:n.css`
    color: ${e.colors.text.secondary};
  `,statValue:n.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-weight: 600;
    color: ${e.colors.text.primary};
  `,statValueGreen:n.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-weight: 600;
    color: #10b981;
  `,statValueAmber:n.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-weight: 600;
    color: #f59e0b;
  `,workersList:n.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1)};
  `,workerItem:n.css`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 6px;
    padding: ${e.spacing(1)};
  `,workerDot:n.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    margin-top: 5px;
    flex-shrink: 0;
    box-shadow: 0 0 6px #10b981;
  `,workerDetails:n.css`
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    overflow: hidden;
  `,workerNameRow:n.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,workerName:n.css`
    font-size: 0.8rem;
    font-weight: 600;
    font-family: ${e.typography.fontFamilyMonospace};
    color: ${e.colors.primary.text};
  `,workerLang:n.css`
    font-size: 0.65rem;
    background: rgba(59, 130, 246, 0.15);
    color: #38bdf8;
    padding: 1px 5px;
    border-radius: 4px;
    font-family: ${e.typography.fontFamilyMonospace};
  `,workerDesc:n.css`
    font-size: 0.7rem;
    color: ${e.colors.text.secondary};
  `,subLabel:n.css`
    display: block;
    font-size: 0.7rem;
    color: ${e.colors.text.secondary};
    margin-bottom: 4px;
  `,snippetBox:n.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 6px;
    padding: 6px 10px;
    gap: 8px;
  `,snippetCode:n.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.75rem;
    color: ${e.colors.text.primary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}),g=({content:e})=>{const t=(0,l.useStyles2)(y),a=function(e){const t=e.split("\n"),a=[];let s=0;for(;s<t.length;){const e=t[s];if(e.trim().startsWith("```")){const r=e.trim().substring(3).trim(),n=[];for(s++;s<t.length&&!t[s].trim().startsWith("```");)n.push(t[s]),s++;s++,a.push({type:"code",language:r||"text",text:n.join("\n")});continue}if(e.trim().startsWith("|")&&e.trim().endsWith("|")&&s+1<t.length&&t[s+1].includes("---")){const r=e.split("|").slice(1,-1).map(e=>e.trim());s+=2;const n=[];for(;s<t.length&&t[s].trim().startsWith("|");){const e=t[s].split("|").slice(1,-1).map(e=>e.trim());n.push(e),s++}a.push({type:"table",headers:r,rows:n});continue}const r=e.match(/^(#{1,4})\s+(.*)$/);if(r){a.push({type:"header",level:r[1].length,text:r[2]}),s++;continue}if(/^\s*[-*]\s+/.test(e)){const e=[];for(;s<t.length&&/^\s*[-*]\s+/.test(t[s]);)e.push(t[s].replace(/^\s*[-*]\s+/,"")),s++;a.push({type:"list",items:e});continue}if(!e.trim()){s++;continue}const n=[];for(;s<t.length&&t[s].trim()&&!t[s].trim().startsWith("```")&&!t[s].match(/^(#{1,4})\s+/)&&!/^\s*[-*]\s+/.test(t[s])&&(!t[s].trim().startsWith("|")||!t[s].trim().endsWith("|"));)n.push(t[s]),s++;n.length>0&&a.push({type:"paragraph",text:n.join("\n")})}return a}(e);return r().createElement("div",{className:t.container},a.map((e,a)=>{switch(e.type){case"code":return r().createElement(h,{key:a,language:e.language||"text",code:e.text||""});case"header":return 1===e.level?r().createElement("h2",{key:a,className:t.h1},f(e.text,t)):2===e.level?r().createElement("h3",{key:a,className:t.h2},f(e.text,t)):r().createElement("h4",{key:a,className:t.h3},f(e.text,t));case"list":return r().createElement("ul",{key:a,className:t.list},(e.items||[]).map((e,a)=>r().createElement("li",{key:a,className:t.listItem},f(e,t))));case"table":return r().createElement(b,{key:a,headers:e.headers,rows:e.rows,styles:t});default:return r().createElement("p",{key:a,className:t.paragraph},f(e.text,t))}}))};function f(e,t){if(!e)return null;return e.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|🟢\s*[^,\n.]+|🟡\s*[^,\n.]+|🔴\s*[^,\n.]+)/g).map((e,a)=>{if(!e)return null;if(e.startsWith("`")&&e.endsWith("`"))return r().createElement("code",{key:a,className:t.inlineCode},e.slice(1,-1));if(e.startsWith("**")&&e.endsWith("**"))return r().createElement("strong",{key:a,className:t.strong},e.slice(2,-2));if(e.startsWith("*")&&e.endsWith("*"))return r().createElement("em",{key:a},e.slice(1,-1));if(e.startsWith("[")&&e.includes("](")){const s=e.match(/\[([^\]]+)\]\(([^)]+)\)/);if(s)return r().createElement("a",{key:a,href:s[2],target:"_blank",rel:"noopener noreferrer",className:t.link},s[1])}return e.startsWith("🟢")?r().createElement("span",{key:a,className:t.badgeNormal},e):e.startsWith("🟡")?r().createElement("span",{key:a,className:t.badgeWarning},e):e.startsWith("🔴")?r().createElement("span",{key:a,className:t.badgeCritical},e):e})}const h=({language:e,code:t})=>{const[a,n]=(0,s.useState)(!1),o=(0,l.useStyles2)(y);return r().createElement("div",{className:o.codeContainer},r().createElement("div",{className:o.codeHeader},r().createElement("span",{className:o.codeLang},e||"code"),r().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:a?"check":"copy",onClick:()=>{navigator.clipboard.writeText(t),n(!0),setTimeout(()=>n(!1),2e3)}},a?"Copied":"Copy")),r().createElement("pre",{className:o.codePre},r().createElement("code",null,t)))},b=({headers:e,rows:t,styles:a})=>e&&t?r().createElement("div",{className:a.tableWrapper},r().createElement("table",{className:a.table},r().createElement("thead",null,r().createElement("tr",null,e.map((e,t)=>r().createElement("th",{key:t},e)))),r().createElement("tbody",null,t.map((e,t)=>r().createElement("tr",{key:t},e.map((e,t)=>r().createElement("td",{key:t},f(e,a)))))))):null,y=e=>({container:n.css`
    font-size: ${e.typography.body.fontSize};
    line-height: 1.6;
    color: ${e.colors.text.primary};
  `,h1:n.css`
    font-size: 1.25rem;
    font-weight: 600;
    margin: ${e.spacing(2,0,1,0)};
    color: ${e.colors.primary.text};
    border-bottom: 1px solid ${e.colors.border.weak};
    padding-bottom: ${e.spacing(.5)};
  `,h2:n.css`
    font-size: 1.1rem;
    font-weight: 600;
    margin: ${e.spacing(1.5,0,.75,0)};
    color: ${e.colors.text.primary};
  `,h3:n.css`
    font-size: 0.95rem;
    font-weight: 600;
    margin: ${e.spacing(1,0,.5,0)};
    color: ${e.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,paragraph:n.css`
    margin-bottom: ${e.spacing(1.25)};
    white-space: pre-line;
  `,list:n.css`
    margin: ${e.spacing(.5,0,1.25,2)};
    padding: 0;
  `,listItem:n.css`
    margin-bottom: ${e.spacing(.5)};
  `,inlineCode:n.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.85em;
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    padding: 2px 6px;
    border-radius: 4px;
    color: ${e.colors.primary.text};
  `,strong:n.css`
    font-weight: 600;
    color: ${e.colors.text.primary};
  `,link:n.css`
    color: ${e.colors.primary.text};
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  `,codeContainer:n.css`
    margin: ${e.spacing(1.5,0)};
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    overflow: hidden;
  `,codeHeader:n.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${e.spacing(.5,1.5)};
    background: ${e.colors.background.canvas};
    border-bottom: 1px solid ${e.colors.border.weak};
  `,codeLang:n.css`
    font-size: 0.75rem;
    font-family: ${e.typography.fontFamilyMonospace};
    text-transform: uppercase;
    color: ${e.colors.text.secondary};
    font-weight: 600;
  `,codePre:n.css`
    margin: 0;
    padding: ${e.spacing(1.5)};
    overflow-x: auto;
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.85rem;
    line-height: 1.45;
  `,badgeNormal:n.css`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    font-weight: 600;
    font-size: 0.85em;
    border: 1px solid rgba(16, 185, 129, 0.3);
  `,badgeWarning:n.css`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
    font-weight: 600;
    font-size: 0.85em;
    border: 1px solid rgba(245, 158, 11, 0.3);
  `,badgeCritical:n.css`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    font-weight: 600;
    font-size: 0.85em;
    border: 1px solid rgba(239, 68, 68, 0.3);
  `,tableWrapper:n.css`
    overflow-x: auto;
    margin: ${e.spacing(1.5,0)};
  `,table:n.css`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    th, td {
      border: 1px solid ${e.colors.border.weak};
      padding: ${e.spacing(.75,1)};
      text-align: left;
    }
    th {
      background: ${e.colors.background.secondary};
      font-weight: 600;
    }
  `});function x(e,t,a,s,r,n,o){try{var l=e[n](o),c=l.value}catch(e){return void a(e)}l.done?t(c):Promise.resolve(c).then(s,r)}function w(e){return function(){var t=this,a=arguments;return new Promise(function(s,r){var n=e.apply(t,a);function o(e){x(n,s,r,o,l,"next",e)}function l(e){x(n,s,r,o,l,"throw",e)}o(void 0)})}}function v(){return`${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function E(){return(new Date).toLocaleTimeString()}function k(){return performance.now()}function $(){return Date.now()}function N(e){return Math.round(performance.now()-e)}function C(e){return e<1e3?`${e}ms`:`${(e/1e3).toFixed(2)}s`}const A=()=>{var e;const t=(0,l.useStyles2)(z),[a]=(0,s.useState)(()=>function(e){let t=null;try{t=window.localStorage.getItem(d(e))}catch(e){return null}if(!t)return null;try{const e=JSON.parse(t);return e&&1===e.schemaVersion&&Array.isArray(e.messages)?e:null}catch(e){return null}}(i.s_)),n=(0,s.useRef)(null!==(e=null==a?void 0:a.createdAt)&&void 0!==e?e:$()),u=(0,s.useRef)(!0),[f,h]=(0,s.useState)(()=>{var e;return null!==(e=null==a?void 0:a.messages)&&void 0!==e?e:[]}),[b,y]=(0,s.useState)(()=>{var e;return null!==(e=null==a?void 0:a.inputDraft)&&void 0!==e?e:""}),[x,A]=(0,s.useState)(!1),[T,S]=(0,s.useState)(null),[M,B]=(0,s.useState)(null),[I,R]=(0,s.useState)(()=>(null==a?void 0:a.activeModel)||"Aura SRE Orchestrator"),[L,P]=(0,s.useState)(null),[W,O]=(0,s.useState)(0),[D,U]=(0,s.useState)(()=>{var e;return null!==(e=null==a?void 0:a.inFlight)&&void 0!==e?e:null}),V=(0,s.useRef)(null),F=(0,s.useRef)(null);(0,s.useEffect)(()=>(u.current=!0,()=>{u.current=!1}),[]),(0,s.useEffect)(()=>{!function(e,t){try{window.localStorage.setItem(d(e),JSON.stringify(t))}catch(e){}}(i.s_,{schemaVersion:1,messages:f,inputDraft:b,activeModel:I,createdAt:n.current,updatedAt:Date.now(),inFlight:D})},[f,b,I,D]),(0,s.useEffect)(()=>{if(!x)return;const e=k(),t=setInterval(()=>{O(N(e))},100);return()=>{clearInterval(t)}},[x]);(0,s.useEffect)(()=>{var e;null===(e=V.current)||void 0===e||e.scrollIntoView({behavior:"smooth"})},[f,x]),(0,s.useEffect)(()=>{let e=!0;const t=()=>w(function*(){try{const t=yield c.N.getHealth();e&&(S(t.data),B(t.latencyMs))}catch(t){e&&(S({status:"unreachable"}),B(null))}try{const t=yield c.N.getModels();e&&t.length>0&&R(t[0].id)}catch(e){}})(),a=setTimeout(t,0),s=setInterval(t,15e3);return()=>{e=!1,clearTimeout(a),clearInterval(s)}},[]);const G=(e,t)=>w(function*(){A(!0),U({status:"running",prompt:t,startedAt:$()});const a=k();try{const t=e.map(e=>({role:e.role,content:e.content})),s=yield c.N.sendChat(t),r=N(a),n={id:v(),role:"assistant",content:s,timestamp:E(),elapsedMs:r};u.current&&h(e=>[...e,n])}catch(e){const t=N(a),s={id:v(),role:"assistant",content:`🔴 **Investigation Error**: ${e.message||"Unable to communicate with AURA Orchestrator. Please check that the AURA container is running."}`,timestamp:E(),isError:!0,elapsedMs:t};u.current&&h(e=>[...e,s])}finally{u.current&&(A(!1),U(null),O(0),setTimeout(()=>{var e;return null===(e=F.current)||void 0===e?void 0:e.focus()},50))}})(),H=e=>w(function*(){const t=(e||b).trim();if(!t||x)return;const a={id:v(),role:"user",content:t,timestamp:E()},s=[...f,a];h(s),y(""),yield G(s,t)})();return r().createElement(o.PluginPage,null,r().createElement("div",{className:t.pageContainer},r().createElement(m.g,{health:T,latencyMs:M,activeModel:I}),r().createElement("div",{className:t.layoutGrid},r().createElement("section",{className:t.workspace},r().createElement("div",{className:t.workspaceHeader},r().createElement("div",{className:t.workspaceTitleGroup},r().createElement(l.Icon,{name:"code-branch",className:t.iconBlue}),r().createElement("span",{className:t.workspaceTitle},"Autonomous SRE Investigation Console"),r().createElement(l.Badge,{text:"LIVE GATEWAY",color:"blue"})),r().createElement("div",{className:t.workspaceActions},r().createElement(l.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"trash-alt",onClick:()=>{!function(e){try{window.localStorage.removeItem(d(e))}catch(e){}}(i.s_),n.current=Date.now(),h([]),U(null),y("")},disabled:0===f.length&&!x},"Clear Console"))),D&&!x&&r().createElement("div",{className:t.resumeBanner},r().createElement(l.Icon,{name:"exclamation-triangle",className:t.resumeIcon}),r().createElement("span",{className:t.resumeText},"An investigation was in progress when you left this screen. Resume it to continue."),r().createElement(l.Button,{size:"sm",variant:"primary",fill:"outline",icon:"play",onClick:()=>{D&&!x&&G(f,D.prompt)}},"Resume Investigation"),r().createElement(l.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"times",onClick:()=>{U(null)}},"Dismiss")),r().createElement("div",{className:t.messagesFeed},0===f.length&&r().createElement("div",{className:t.welcomeCard},r().createElement("div",{className:t.welcomeHeader},r().createElement("div",{className:t.avatarAI},"AI"),r().createElement("div",null,r().createElement("span",{className:t.welcomeSender},"Mezmo AURA SRE Orchestrator • Multi-Agent Gateway"),r().createElement("h3",{className:t.welcomeTitle},"System Online & Autonomous Telemetry Connected"))),r().createElement("div",{className:t.welcomeBody},r().createElement("p",null,"I am your autonomous ",r().createElement("strong",null,"Site Reliability Engineering (SRE)")," partner. I investigate incidents by orchestrating tasks across ",r().createElement("strong",null,"216 live Model Context Protocol (MCP)")," tools:"),r().createElement("ul",{className:t.welcomeList},r().createElement("li",null,r().createElement("strong",null,"Metrics Analyst"),": PromQL telemetry queries against ",r().createElement("code",null,"VictoriaMetrics TSDB"),"."),r().createElement("li",null,r().createElement("strong",null,"Log Analyst"),": LogSQL pattern search & error clustering in ",r().createElement("code",null,"VictoriaLogs"),"."),r().createElement("li",null,r().createElement("strong",null,"Trace Analyst"),": Distributed span and latency inspection in ",r().createElement("code",null,"VictoriaTraces"),"."),r().createElement("li",null,r().createElement("strong",null,"Incident Responder"),": Grafana alert rules, firing states, and dashboards.")),r().createElement("p",{className:t.welcomeHint},"Click one of the 1-click automated investigation prompts below, or type your custom incident query."))),f.map(e=>r().createElement("div",{key:e.id,className:"user"===e.role?t.messageRowUser:t.messageRowAssistant},r().createElement("div",{className:"user"===e.role?t.avatarUser:t.avatarAI},"user"===e.role?"YOU":"AI"),r().createElement("div",{className:t.messageContent},r().createElement("div",{className:t.messageMeta},r().createElement("div",{className:t.metaLeft},r().createElement("span",{className:t.msgSender},"user"===e.role?"Operator":"Mezmo AURA SRE Orchestrator"),r().createElement("span",{className:t.msgTime},e.timestamp),void 0!==e.elapsedMs&&r().createElement("span",{className:t.elapsedBadge,title:`Investigation completed in ${C(e.elapsedMs)} (${e.elapsedMs} ms)`},r().createElement(l.Icon,{name:"clock-nine",size:"xs"}),r().createElement("span",null,C(e.elapsedMs)))),"assistant"===e.role&&r().createElement("div",{className:t.metaActions},r().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:L===e.id?"check":"copy",onClick:()=>{return t=e.id,a=e.content,navigator.clipboard.writeText(a),P(t),void setTimeout(()=>{P(e=>e===t?null:e)},2e3);var t,a},className:t.copyBtn},L===e.id?"Copied":"Copy Investigation"))),r().createElement("div",{className:"user"===e.role?t.bubbleUser:t.bubbleAssistant},"user"===e.role?r().createElement("p",{className:t.userText},e.content):r().createElement(g,{content:e.content}))))),x&&r().createElement("div",{className:t.messageRowAssistant},r().createElement("div",{className:t.avatarAI},"AI"),r().createElement("div",{className:t.messageContent},r().createElement("div",{className:t.messageMeta},r().createElement("div",{className:t.metaLeft},r().createElement("span",{className:t.msgSender},"Mezmo AURA SRE Orchestrator"),r().createElement("span",{className:t.elapsedBadgeActive,title:"Investigation in progress"},r().createElement(l.Icon,{name:"clock-nine",size:"xs"}),r().createElement("span",null,C(W))))),r().createElement("div",{className:t.thinkingBubble},r().createElement(l.Spinner,{size:18,inline:!0}),r().createElement("span",{className:t.thinkingText},"Orchestrating multi-agent investigation across VictoriaMetrics, VictoriaLogs, VictoriaTraces & Grafana...")))),r().createElement("div",{ref:V})),r().createElement("div",{className:t.quickChipsBar},r().createElement("span",{className:t.quickChipsLabel},"1-Click Automated Investigations:"),r().createElement("div",{className:t.chipsScroll},i.EP.map(e=>r().createElement("button",{key:e.id,className:t.quickChip,onClick:()=>H(e.prompt),disabled:x,title:e.prompt},r().createElement("span",null,e.title))))),r().createElement("div",{className:t.inputBar},r().createElement("div",{className:t.inputWrapper},r().createElement("textarea",{ref:F,className:t.textarea,rows:2,value:b,placeholder:"Ask AURA to investigate an incident (defaults to last 5 minutes of telemetry unless specified)... [Press Enter to send, Shift+Enter for newline]",onChange:e=>y(e.target.value),onKeyDown:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),H())},disabled:x})),r().createElement(l.Button,{variant:"primary",size:"md",icon:x?void 0:"arrow-right",onClick:()=>H(),disabled:!b.trim()||x},x?"Investigating...":"Investigate"))),r().createElement(p,{health:T,latencyMs:M}))))},T=A,z=e=>({pageContainer:n.css`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: calc(100vh - 120px);
  `,layoutGrid:n.css`
    display: flex;
    gap: ${e.spacing(2)};
    align-items: flex-start;
    @media (max-width: 1024px) {
      flex-direction: column;
    }
  `,workspace:n.css`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: ${e.colors.background.primary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    box-shadow: ${e.shadows.z1};
    overflow: hidden;
  `,workspaceHeader:n.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${e.spacing(1,2)};
    background: ${e.colors.background.secondary};
    border-bottom: 1px solid ${e.colors.border.weak};
  `,workspaceTitleGroup:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `,workspaceTitle:n.css`
    font-size: 0.95rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
  `,iconBlue:n.css`
    color: #3b82f6;
  `,workspaceActions:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `,resumeBanner:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
    padding: ${e.spacing(1,2)};
    background: rgba(245, 158, 11, 0.1);
    border-bottom: 1px solid rgba(245, 158, 11, 0.3);
  `,resumeIcon:n.css`
    color: #f59e0b;
    flex-shrink: 0;
  `,resumeText:n.css`
    flex: 1;
    font-size: 0.85rem;
    color: ${e.colors.text.primary};
  `,messagesFeed:n.css`
    flex: 1;
    min-height: 480px;
    max-height: 620px;
    overflow-y: auto;
    padding: ${e.spacing(2)};
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(2)};
    background: ${e.colors.background.canvas};
  `,welcomeCard:n.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2)};
    box-shadow: ${e.shadows.z1};
  `,welcomeHeader:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
    margin-bottom: ${e.spacing(1.5)};
  `,welcomeSender:n.css`
    font-size: 0.75rem;
    color: ${e.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,welcomeTitle:n.css`
    font-size: 1.1rem;
    font-weight: 700;
    color: #38bdf8;
    margin: 2px 0 0 0;
  `,welcomeBody:n.css`
    font-size: 0.875rem;
    line-height: 1.6;
    color: ${e.colors.text.primary};
  `,welcomeList:n.css`
    margin: ${e.spacing(1,0,1.5,2.5)};
    padding: 0;
    li {
      margin-bottom: 6px;
    }
  `,welcomeHint:n.css`
    font-size: 0.8rem;
    color: ${e.colors.text.secondary};
    margin: 0;
  `,messageRowUser:n.css`
    display: flex;
    gap: ${e.spacing(1.5)};
    align-self: flex-end;
    max-width: 85%;
    flex-direction: row-reverse;
  `,messageRowAssistant:n.css`
    display: flex;
    gap: ${e.spacing(1.5)};
    align-self: flex-start;
    max-width: 95%;
  `,avatarAI:n.css`
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: linear-gradient(135deg, #1e3a8a, #0284c7);
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 800;
    font-family: ${e.typography.fontFamilyMonospace};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
  `,avatarUser:n.css`
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    color: ${e.colors.text.primary};
    font-size: 0.7rem;
    font-weight: 700;
    font-family: ${e.typography.fontFamilyMonospace};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,messageContent:n.css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    width: 100%;
  `,messageMeta:n.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    min-height: 24px;
  `,metaLeft:n.css`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  `,metaActions:n.css`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
  `,elapsedBadge:n.css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(59, 130, 246, 0.12);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.25);
    border-radius: 12px;
    padding: 1px 7px;
    font-size: 0.7rem;
    font-family: ${e.typography.fontFamilyMonospace};
    font-weight: 600;
  `,elapsedBadgeActive:n.css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(245, 158, 11, 0.12);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 12px;
    padding: 1px 7px;
    font-size: 0.7rem;
    font-family: ${e.typography.fontFamilyMonospace};
    font-weight: 600;
  `,copyBtn:n.css`
    font-size: 0.7rem;
    padding: 2px 8px;
    height: 22px;
  `,msgSender:n.css`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${e.colors.text.secondary};
  `,msgTime:n.css`
    font-size: 0.7rem;
    color: ${e.colors.text.disabled};
  `,bubbleUser:n.css`
    background: ${e.colors.primary.main};
    color: ${e.colors.primary.contrastText};
    padding: ${e.spacing(1,1.5)};
    border-radius: ${e.shape.radius.default};
    border-top-right-radius: 0;
    font-size: 0.9rem;
    box-shadow: ${e.shadows.z1};
  `,userText:n.css`
    margin: 0;
    white-space: pre-wrap;
  `,bubbleAssistant:n.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    padding: ${e.spacing(1.5)};
    border-radius: ${e.shape.radius.default};
    border-top-left-radius: 0;
    box-shadow: ${e.shadows.z1};
  `,thinkingBubble:n.css`
    display: flex;
    align-items: center;
    gap: 10px;
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-left: 3px solid #38bdf8;
    padding: ${e.spacing(1.25,1.5)};
    border-radius: ${e.shape.radius.default};
  `,thinkingText:n.css`
    font-size: 0.85rem;
    color: #38bdf8;
    font-family: ${e.typography.fontFamilyMonospace};
  `,quickChipsBar:n.css`
    padding: ${e.spacing(1,2)};
    background: ${e.colors.background.secondary};
    border-top: 1px solid ${e.colors.border.weak};
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    flex-wrap: wrap;
  `,quickChipsLabel:n.css`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${e.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,chipsScroll:n.css`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  `,quickChip:n.css`
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    color: ${e.colors.text.primary};
    padding: 4px 10px;
    border-radius: 14px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover:not(:disabled) {
      border-color: #38bdf8;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.08);
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,inputBar:n.css`
    display: flex;
    align-items: flex-end;
    gap: ${e.spacing(1.5)};
    padding: ${e.spacing(1.5,2)};
    background: ${e.colors.background.secondary};
    border-top: 1px solid ${e.colors.border.weak};
  `,inputWrapper:n.css`
    flex: 1;
  `,textarea:n.css`
    width: 100%;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(1)};
    color: ${e.colors.text.primary};
    font-family: ${e.typography.fontFamily};
    font-size: 0.9rem;
    line-height: 1.4;
    resize: vertical;
    outline: none;
    box-sizing: border-box;
    &:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 1px #38bdf8;
    }
  `})}}]);
//# sourceMappingURL=18.js.map?_cache=8abc6210b5afbb6ea444