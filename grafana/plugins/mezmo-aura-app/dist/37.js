"use strict";(self.webpackChunkmezmo_aura_app=self.webpackChunkmezmo_aura_app||[]).push([[37],{564(e,t,a){a.d(t,{N:()=>c});var s=a(531),r=a(269),o=a(351);function n(e,t,a,s,r,o,n){try{var l=e[o](n),c=l.value}catch(e){return void a(e)}l.done?t(c):Promise.resolve(c).then(s,r)}function l(e){return function(){var t=this,a=arguments;return new Promise(function(s,r){var o=e.apply(t,a);function l(e){n(o,s,r,l,c,"next",e)}function c(e){n(o,s,r,l,c,"throw",e)}l(void 0)})}}class c{static getProxyUrl(e,t){return t&&t.trim()?`${t.trim().replace(/\/$/,"")}/${e.replace(/^\//,"")}`:`api/plugin-proxy/${o.s_}/aura/${e.replace(/^\//,"")}`}static getHealth(e){return l(function*(){const t=performance.now(),a=this.getProxyUrl("health",e);try{const e=yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"GET"})),o=Math.round(performance.now()-t);return{data:e.data,latencyMs:o}}catch(e){try{const e=yield fetch("/aura/health");if(e.ok){const a=yield e.json();return{data:a,latencyMs:Math.round(performance.now()-t)}}}catch(e){}throw e}}).call(this)}static getModels(e){return l(function*(){const t=this.getProxyUrl("v1/models",e);try{var a;return(null===(a=(yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:t,method:"GET"}))).data)||void 0===a?void 0:a.data)||[]}catch(e){try{const e=yield fetch("/aura/v1/models");if(e.ok){return(yield e.json()).data||[]}}catch(e){}return[]}}).call(this)}static sendChat(e,t){return l(function*(){const a=this.getProxyUrl("v1/chat/completions",t);try{var o,n,l,c;const t=null===(c=(yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"POST",data:{messages:e}}))).data)||void 0===c||null===(l=c.choices)||void 0===l||null===(n=l[0])||void 0===n||null===(o=n.message)||void 0===o?void 0:o.content;if(!t)throw new Error("No content returned from Mezmo AURA Orchestrator");return t}catch(t){var i,d,m;try{const t=yield fetch("/aura/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:e})});if(t.ok){var p,u,g;const e=null===(g=(yield t.json()).choices)||void 0===g||null===(u=g[0])||void 0===u||null===(p=u.message)||void 0===p?void 0:p.content;if(e)return e}}catch(e){}const a=(null==t||null===(i=t.data)||void 0===i?void 0:i.message)||(null==t||null===(m=t.data)||void 0===m||null===(d=m.error)||void 0===d?void 0:d.message)||(null==t?void 0:t.statusText)||(null==t?void 0:t.message)||"Error communicating with AURA Orchestrator";throw new Error(a)}}).call(this)}}},893(e,t,a){a.d(t,{g:()=>d});var s=a(959),r=a.n(s),o=a(89),n=a(7),l=a(159),c=a(351);function i(e){return`${c.Gy}/${e}`}const d=({health:e,latencyMs:t,activeModel:a,isPolling:s})=>{const o=(0,n.useStyles2)(m),d=(0,l.useNavigate)(),p=(0,l.useLocation)(),u=p.pathname.endsWith("/console")||p.pathname.endsWith(c.bw.Console)||!p.pathname.includes("/"),g=p.pathname.includes("/traces"),f=p.pathname.includes("/specialists"),b="healthy"===(null==e?void 0:e.status),h="degraded"===(null==e?void 0:e.status);return r().createElement("header",{className:o.header},r().createElement("div",{className:o.topRow},r().createElement("div",{className:o.brandGroup},r().createElement("div",{className:o.logoWrapper},r().createElement("svg",{viewBox:"0 0 100 100",width:"32",height:"32"},r().createElement("polygon",{points:"50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5",fill:"#080c14",stroke:"#3b82f6",strokeWidth:"4"}),r().createElement("path",{d:"M25 45 C25 38, 42 34, 48 45 C48 56, 30 56, 25 45 Z",fill:"#38bdf8"}),r().createElement("path",{d:"M75 45 C75 38, 58 34, 52 45 C52 56, 70 56, 75 45 Z",fill:"#38bdf8"}),r().createElement("line",{x1:"48",y1:"44",x2:"52",y2:"44",stroke:"#38bdf8",strokeWidth:"3"}),r().createElement("text",{x:"50",y:"78",fill:"#38bdf8",fontFamily:"'JetBrains Mono', monospace",fontWeight:"bold",fontSize:"14",textAnchor:"middle",letterSpacing:"1"},"AURA"))),r().createElement("div",null,r().createElement("div",{className:o.titleRow},r().createElement("span",{className:o.brandTitle},"MEZMO AURA"),r().createElement("span",{className:o.brandSub},"SRE AGENT"),r().createElement(n.Badge,{text:"AUTONOMOUS TELEMETRY",color:"blue"})),r().createElement("span",{className:o.tagline},"Autonomous Multi-Agent Observability & Incident Investigation"))),r().createElement("div",{className:o.statusGroup},r().createElement("div",{className:o.statusPill},r().createElement("span",{className:b?o.statusDotHealthy:h?o.statusDotDegraded:o.statusDotOffline}),r().createElement("span",{className:o.statusText},e?b?"ONLINE (200)":e.status.toUpperCase():"CONNECTING..."),null!=t&&r().createElement("span",{className:o.latencyBadge},t," ms")),a&&r().createElement(n.Tooltip,{content:"Active LLM Orchestrator Model"},r().createElement("div",{className:o.modelPill},r().createElement(n.Icon,{name:"brain",size:"sm",className:o.iconBlue}),r().createElement("span",null,a))),r().createElement(n.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"external-link-alt",onClick:()=>window.open("/","_blank")},"Platform Hub"))),r().createElement("div",{className:o.bottomRow},r().createElement(n.TabsBar,null,r().createElement(n.Tab,{label:"Investigation Console",active:u,icon:"code-branch",onChangeTab:()=>d(i(c.bw.Console))}),r().createElement(n.Tab,{label:"Reasoning Traces",active:g,icon:"sitemap",onChangeTab:()=>d(i(c.bw.Traces))}),r().createElement(n.Tab,{label:"MCP Specialists",active:f,icon:"apps",onChangeTab:()=>d(i(c.bw.Specialists))})),r().createElement("div",{className:o.quickLinks},r().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"compass",onClick:()=>window.open("/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaTraces%22%7D","_blank")},"VictoriaTraces"),r().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"file-alt",onClick:()=>window.open("/vlogs/select/vmui/","_blank")},"VictoriaLogs"),r().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"chart-line",onClick:()=>window.open("/vmetrics/select/vmui/","_blank")},"VictoriaMetrics"),r().createElement(n.Button,{size:"xs",variant:"secondary",fill:"text",icon:"cog",onClick:()=>window.location.href="/grafana/plugins/mezmo-aura-app"},"Config"))))},m=e=>({header:o.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(1.5,2,0,2)};
    margin-bottom: ${e.spacing(2)};
    box-shadow: ${e.shadows.z1};
  `,topRow:o.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: ${e.spacing(2)};
    padding-bottom: ${e.spacing(1.5)};
    border-bottom: 1px solid ${e.colors.border.weak};
  `,brandGroup:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,logoWrapper:o.css`
    display: flex;
    align-items: center;
    justify-content: center;
    background: #080c14;
    padding: 6px;
    border-radius: 8px;
    border: 1px solid #1e293b;
  `,titleRow:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    flex-wrap: wrap;
  `,brandTitle:o.css`
    font-size: 1.25rem;
    font-weight: 800;
    font-family: ${e.typography.fontFamilyMonospace};
    color: #38bdf8;
    letter-spacing: 0.05em;
  `,brandSub:o.css`
    font-size: 0.85rem;
    font-weight: 700;
    color: ${e.colors.text.secondary};
    letter-spacing: 0.08em;
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
    gap: 8px;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    padding: 4px 10px;
    border-radius: 20px;
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.8rem;
  `,statusDotHealthy:o.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
  `,statusDotDegraded:o.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
    box-shadow: 0 0 8px #f59e0b;
  `,statusDotOffline:o.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 8px #ef4444;
  `,statusText:o.css`
    font-weight: 600;
    color: ${e.colors.text.primary};
  `,latencyBadge:o.css`
    color: ${e.colors.text.secondary};
    font-size: 0.75rem;
    border-left: 1px solid ${e.colors.border.weak};
    padding-left: 6px;
  `,modelPill:o.css`
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
  `,iconBlue:o.css`
    color: #38bdf8;
  `,bottomRow:o.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${e.spacing(.5)};
  `,quickLinks:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `})},37(e,t,a){a.r(t),a.d(t,{InvestigationConsole:()=>v,default:()=>k});var s=a(959),r=a.n(s),o=a(89),n=a(531),l=a(7),c=a(564),i=a(351),d=a(893);const m=({health:e,latencyMs:t})=>{var a;const o=(0,l.useStyles2)(p),[n,c]=(0,s.useState)(!1),[d,m]=(0,s.useState)(!1),u="healthy"===(null==e?void 0:e.status);return r().createElement("aside",{className:o.sidebar},r().createElement("div",{className:o.card},r().createElement("div",{className:o.cardHeader},r().createElement(l.Icon,{name:"heart-rate",className:o.iconBlue}),r().createElement("span",{className:o.cardTitle},"Live Agent Telemetry")),r().createElement("div",{className:o.statList},r().createElement("div",{className:o.statRow},r().createElement("span",{className:o.statLabel},"Agent State"),r().createElement("span",{className:u?o.statValueGreen:o.statValueAmber},(null==e?void 0:e.status)?e.status.toUpperCase():"UNKNOWN")),r().createElement("div",{className:o.statRow},r().createElement("span",{className:o.statLabel},"AURA Version"),r().createElement("span",{className:o.statValue},(null==e?void 0:e.aura_version)?`v${e.aura_version}`:"0.2.17")),r().createElement("div",{className:o.statRow},r().createElement("span",{className:o.statLabel},"Session Store"),r().createElement("span",{className:o.statValue},(null==e||null===(a=e.session_store)||void 0===a?void 0:a.backend)||"memory")),r().createElement("div",{className:o.statRow},r().createElement("span",{className:o.statLabel},"MCP Gateway"),r().createElement("span",{className:o.statValue},"LiteLLM :4000")),r().createElement("div",{className:o.statRow},r().createElement("span",{className:o.statLabel},"Health Latency"),r().createElement("span",{className:o.statValue},null!=t?`${t} ms`:"--")))),r().createElement("div",{className:o.card},r().createElement("div",{className:o.cardHeader},r().createElement(l.Icon,{name:"apps",className:o.iconBlue}),r().createElement("span",{className:o.cardTitle},"Active MCP Specialists"),r().createElement(l.Badge,{text:"216 TOOLS",color:"purple"})),r().createElement("div",{className:o.workersList},i.Cc.map(e=>r().createElement("div",{key:e.name,className:o.workerItem},r().createElement("span",{className:o.workerDot}),r().createElement("div",{className:o.workerDetails},r().createElement("div",{className:o.workerNameRow},r().createElement("span",{className:o.workerName},e.name),r().createElement("span",{className:o.workerLang},e.queryLang)),r().createElement("span",{className:o.workerDesc},e.backend)))))),r().createElement("div",{className:o.cardGlow},r().createElement("div",{className:o.cardHeader},r().createElement(l.Icon,{name:"sitemap",className:o.iconCyan}),r().createElement("span",{className:o.cardTitle},"Reasoning Traces in Grafana")),r().createElement("p",{className:o.cardText},"AURA streams its reasoning steps, subagent delegations, and PromQL/LogSQL queries to VictoriaTraces via OTel spans."),r().createElement(l.Button,{size:"sm",variant:"primary",icon:"compass",fullWidth:!0,onClick:()=>{window.open("/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaTraces%22%2C%22queries%22%3A%5B%7B%22query%22%3A%22aura%22%2C%22queryType%22%3A%22service%22%7D%5D%7D","_blank")}},"Explore Reasoning Traces")),r().createElement("div",{className:o.card},r().createElement("div",{className:o.cardHeader},r().createElement(l.Icon,{name:"code-branch",className:o.iconBlue}),r().createElement("span",{className:o.cardTitle},"Terminal CLI & API")),r().createElement("span",{className:o.subLabel},"Direct REPL client in container:"),r().createElement("div",{className:o.snippetBox},r().createElement("code",{className:o.snippetCode},"docker exec -it aura ./aura"),r().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:n?"check":"copy",onClick:()=>{navigator.clipboard.writeText("docker exec -it aura ./aura"),c(!0),setTimeout(()=>c(!1),2e3)}},n?"Copied":"Copy")),r().createElement("span",{className:o.subLabel,style:{marginTop:"12px"}},"OpenAI-compatible REST API:"),r().createElement("div",{className:o.snippetBox},r().createElement("code",{className:o.snippetCode},"POST /aura/v1/chat/completions"),r().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:d?"check":"copy",onClick:()=>{const e=`curl -k -s -u admin:<BASIC_AUTH_PASSWORD> \\\n  -X POST https://${window.location.host}/aura/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -d '{"messages":[{"role":"user","content":"Check system health"}]}'`;navigator.clipboard.writeText(e),m(!0),setTimeout(()=>m(!1),2e3)}},d?"Copied":"Copy"))))},p=e=>({sidebar:o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.5)};
    width: 320px;
    flex-shrink: 0;
    @media (max-width: 1024px) {
      width: 100%;
    }
  `,card:o.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(1.5)};
  `,cardGlow:o.css`
    background: ${e.colors.background.secondary};
    border: 1px solid #38bdf8;
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(1.5)};
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.15);
  `,cardHeader:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    margin-bottom: ${e.spacing(1.25)};
  `,cardTitle:o.css`
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${e.colors.text.primary};
    flex: 1;
  `,cardText:o.css`
    font-size: 0.75rem;
    color: ${e.colors.text.secondary};
    line-height: 1.5;
    margin-bottom: ${e.spacing(1.25)};
  `,iconBlue:o.css`
    color: #3b82f6;
  `,iconCyan:o.css`
    color: #38bdf8;
  `,statList:o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(.75)};
  `,statRow:o.css`
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
  `,statLabel:o.css`
    color: ${e.colors.text.secondary};
  `,statValue:o.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-weight: 600;
    color: ${e.colors.text.primary};
  `,statValueGreen:o.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-weight: 600;
    color: #10b981;
  `,statValueAmber:o.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-weight: 600;
    color: #f59e0b;
  `,workersList:o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1)};
  `,workerItem:o.css`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 6px;
    padding: ${e.spacing(1)};
  `,workerDot:o.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    margin-top: 5px;
    flex-shrink: 0;
    box-shadow: 0 0 6px #10b981;
  `,workerDetails:o.css`
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    overflow: hidden;
  `,workerNameRow:o.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,workerName:o.css`
    font-size: 0.8rem;
    font-weight: 600;
    font-family: ${e.typography.fontFamilyMonospace};
    color: ${e.colors.primary.text};
  `,workerLang:o.css`
    font-size: 0.65rem;
    background: rgba(59, 130, 246, 0.15);
    color: #38bdf8;
    padding: 1px 5px;
    border-radius: 4px;
    font-family: ${e.typography.fontFamilyMonospace};
  `,workerDesc:o.css`
    font-size: 0.7rem;
    color: ${e.colors.text.secondary};
  `,subLabel:o.css`
    display: block;
    font-size: 0.7rem;
    color: ${e.colors.text.secondary};
    margin-bottom: 4px;
  `,snippetBox:o.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 6px;
    padding: 6px 10px;
    gap: 8px;
  `,snippetCode:o.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.75rem;
    color: ${e.colors.text.primary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}),u=({content:e})=>{const t=(0,l.useStyles2)(h),a=function(e){const t=e.split("\n"),a=[];let s=0;for(;s<t.length;){const e=t[s];if(e.trim().startsWith("```")){const r=e.trim().substring(3).trim(),o=[];for(s++;s<t.length&&!t[s].trim().startsWith("```");)o.push(t[s]),s++;s++,a.push({type:"code",language:r||"text",text:o.join("\n")});continue}if(e.trim().startsWith("|")&&e.trim().endsWith("|")&&s+1<t.length&&t[s+1].includes("---")){const r=e.split("|").slice(1,-1).map(e=>e.trim());s+=2;const o=[];for(;s<t.length&&t[s].trim().startsWith("|");){const e=t[s].split("|").slice(1,-1).map(e=>e.trim());o.push(e),s++}a.push({type:"table",headers:r,rows:o});continue}const r=e.match(/^(#{1,4})\s+(.*)$/);if(r){a.push({type:"header",level:r[1].length,text:r[2]}),s++;continue}if(/^\s*[-*]\s+/.test(e)){const e=[];for(;s<t.length&&/^\s*[-*]\s+/.test(t[s]);)e.push(t[s].replace(/^\s*[-*]\s+/,"")),s++;a.push({type:"list",items:e});continue}if(!e.trim()){s++;continue}const o=[];for(;s<t.length&&t[s].trim()&&!t[s].trim().startsWith("```")&&!t[s].match(/^(#{1,4})\s+/)&&!/^\s*[-*]\s+/.test(t[s])&&(!t[s].trim().startsWith("|")||!t[s].trim().endsWith("|"));)o.push(t[s]),s++;o.length>0&&a.push({type:"paragraph",text:o.join("\n")})}return a}(e);return r().createElement("div",{className:t.container},a.map((e,a)=>{switch(e.type){case"code":return r().createElement(f,{key:a,language:e.language||"text",code:e.text||""});case"header":return 1===e.level?r().createElement("h2",{key:a,className:t.h1},g(e.text,t)):2===e.level?r().createElement("h3",{key:a,className:t.h2},g(e.text,t)):r().createElement("h4",{key:a,className:t.h3},g(e.text,t));case"list":return r().createElement("ul",{key:a,className:t.list},(e.items||[]).map((e,a)=>r().createElement("li",{key:a,className:t.listItem},g(e,t))));case"table":return r().createElement(b,{key:a,headers:e.headers,rows:e.rows,styles:t});default:return r().createElement("p",{key:a,className:t.paragraph},g(e.text,t))}}))};function g(e,t){if(!e)return null;return e.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|🟢\s*[^,\n.]+|🟡\s*[^,\n.]+|🔴\s*[^,\n.]+)/g).map((e,a)=>{if(!e)return null;if(e.startsWith("`")&&e.endsWith("`"))return r().createElement("code",{key:a,className:t.inlineCode},e.slice(1,-1));if(e.startsWith("**")&&e.endsWith("**"))return r().createElement("strong",{key:a,className:t.strong},e.slice(2,-2));if(e.startsWith("*")&&e.endsWith("*"))return r().createElement("em",{key:a},e.slice(1,-1));if(e.startsWith("[")&&e.includes("](")){const s=e.match(/\[([^\]]+)\]\(([^)]+)\)/);if(s)return r().createElement("a",{key:a,href:s[2],target:"_blank",rel:"noopener noreferrer",className:t.link},s[1])}return e.startsWith("🟢")?r().createElement("span",{key:a,className:t.badgeNormal},e):e.startsWith("🟡")?r().createElement("span",{key:a,className:t.badgeWarning},e):e.startsWith("🔴")?r().createElement("span",{key:a,className:t.badgeCritical},e):e})}const f=({language:e,code:t})=>{const[a,o]=(0,s.useState)(!1),n=(0,l.useStyles2)(h);return r().createElement("div",{className:n.codeContainer},r().createElement("div",{className:n.codeHeader},r().createElement("span",{className:n.codeLang},e||"code"),r().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:a?"check":"copy",onClick:()=>{navigator.clipboard.writeText(t),o(!0),setTimeout(()=>o(!1),2e3)}},a?"Copied":"Copy")),r().createElement("pre",{className:n.codePre},r().createElement("code",null,t)))},b=({headers:e,rows:t,styles:a})=>e&&t?r().createElement("div",{className:a.tableWrapper},r().createElement("table",{className:a.table},r().createElement("thead",null,r().createElement("tr",null,e.map((e,t)=>r().createElement("th",{key:t},e)))),r().createElement("tbody",null,t.map((e,t)=>r().createElement("tr",{key:t},e.map((e,t)=>r().createElement("td",{key:t},g(e,a)))))))):null,h=e=>({container:o.css`
    font-size: ${e.typography.body.fontSize};
    line-height: 1.6;
    color: ${e.colors.text.primary};
  `,h1:o.css`
    font-size: 1.25rem;
    font-weight: 600;
    margin: ${e.spacing(2,0,1,0)};
    color: ${e.colors.primary.text};
    border-bottom: 1px solid ${e.colors.border.weak};
    padding-bottom: ${e.spacing(.5)};
  `,h2:o.css`
    font-size: 1.1rem;
    font-weight: 600;
    margin: ${e.spacing(1.5,0,.75,0)};
    color: ${e.colors.text.primary};
  `,h3:o.css`
    font-size: 0.95rem;
    font-weight: 600;
    margin: ${e.spacing(1,0,.5,0)};
    color: ${e.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,paragraph:o.css`
    margin-bottom: ${e.spacing(1.25)};
    white-space: pre-line;
  `,list:o.css`
    margin: ${e.spacing(.5,0,1.25,2)};
    padding: 0;
  `,listItem:o.css`
    margin-bottom: ${e.spacing(.5)};
  `,inlineCode:o.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.85em;
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    padding: 2px 6px;
    border-radius: 4px;
    color: ${e.colors.primary.text};
  `,strong:o.css`
    font-weight: 600;
    color: ${e.colors.text.primary};
  `,link:o.css`
    color: ${e.colors.primary.text};
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  `,codeContainer:o.css`
    margin: ${e.spacing(1.5,0)};
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    overflow: hidden;
  `,codeHeader:o.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${e.spacing(.5,1.5)};
    background: ${e.colors.background.canvas};
    border-bottom: 1px solid ${e.colors.border.weak};
  `,codeLang:o.css`
    font-size: 0.75rem;
    font-family: ${e.typography.fontFamilyMonospace};
    text-transform: uppercase;
    color: ${e.colors.text.secondary};
    font-weight: 600;
  `,codePre:o.css`
    margin: 0;
    padding: ${e.spacing(1.5)};
    overflow-x: auto;
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.85rem;
    line-height: 1.45;
  `,badgeNormal:o.css`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    font-weight: 600;
    font-size: 0.85em;
    border: 1px solid rgba(16, 185, 129, 0.3);
  `,badgeWarning:o.css`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
    font-weight: 600;
    font-size: 0.85em;
    border: 1px solid rgba(245, 158, 11, 0.3);
  `,badgeCritical:o.css`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    font-weight: 600;
    font-size: 0.85em;
    border: 1px solid rgba(239, 68, 68, 0.3);
  `,tableWrapper:o.css`
    overflow-x: auto;
    margin: ${e.spacing(1.5,0)};
  `,table:o.css`
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
  `});function y(e,t,a,s,r,o,n){try{var l=e[o](n),c=l.value}catch(e){return void a(e)}l.done?t(c):Promise.resolve(c).then(s,r)}function x(e){return function(){var t=this,a=arguments;return new Promise(function(s,r){var o=e.apply(t,a);function n(e){y(o,s,r,n,l,"next",e)}function l(e){y(o,s,r,n,l,"throw",e)}n(void 0)})}}function w(){return`${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function E(){return(new Date).toLocaleTimeString()}const v=()=>{const e=(0,l.useStyles2)($),[t,a]=(0,s.useState)([]),[o,p]=(0,s.useState)(""),[g,f]=(0,s.useState)(!1),[b,h]=(0,s.useState)(null),[y,v]=(0,s.useState)(null),[k,N]=(0,s.useState)("Aura SRE Orchestrator"),C=(0,s.useRef)(null),T=(0,s.useRef)(null);(0,s.useEffect)(()=>{var e;null===(e=C.current)||void 0===e||e.scrollIntoView({behavior:"smooth"})},[t,g]),(0,s.useEffect)(()=>{let e=!0;const t=()=>x(function*(){try{const t=yield c.N.getHealth();e&&(h(t.data),v(t.latencyMs))}catch(t){e&&(h({status:"unreachable"}),v(null))}try{const t=yield c.N.getModels();e&&t.length>0&&N(t[0].id)}catch(e){}})(),a=setTimeout(t,0),s=setInterval(t,15e3);return()=>{e=!1,clearTimeout(a),clearInterval(s)}},[]);const A=e=>x(function*(){const s=(e||o).trim();if(!s||g)return;const r={id:w(),role:"user",content:s,timestamp:E()},n=[...t,r];a(n),p(""),f(!0);try{const e=n.map(e=>({role:e.role,content:e.content})),t=yield c.N.sendChat(e),s={id:w(),role:"assistant",content:t,timestamp:E()};a(e=>[...e,s])}catch(e){const t={id:w(),role:"assistant",content:`🔴 **Investigation Error**: ${e.message||"Unable to communicate with AURA Orchestrator. Please check that the AURA container is running."}`,timestamp:E(),isError:!0};a(e=>[...e,t])}finally{f(!1),setTimeout(()=>{var e;return null===(e=T.current)||void 0===e?void 0:e.focus()},50)}})();return r().createElement(n.PluginPage,null,r().createElement("div",{className:e.pageContainer},r().createElement(d.g,{health:b,latencyMs:y,activeModel:k}),r().createElement("div",{className:e.layoutGrid},r().createElement("section",{className:e.workspace},r().createElement("div",{className:e.workspaceHeader},r().createElement("div",{className:e.workspaceTitleGroup},r().createElement(l.Icon,{name:"code-branch",className:e.iconBlue}),r().createElement("span",{className:e.workspaceTitle},"Autonomous SRE Investigation Console"),r().createElement(l.Badge,{text:"LIVE GATEWAY",color:"blue"})),r().createElement("div",{className:e.workspaceActions},r().createElement(l.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"trash-alt",onClick:()=>{a([])},disabled:0===t.length&&!g},"Clear Console"))),r().createElement("div",{className:e.messagesFeed},0===t.length&&r().createElement("div",{className:e.welcomeCard},r().createElement("div",{className:e.welcomeHeader},r().createElement("div",{className:e.avatarAI},"AI"),r().createElement("div",null,r().createElement("span",{className:e.welcomeSender},"Mezmo AURA SRE Orchestrator • Multi-Agent Gateway"),r().createElement("h3",{className:e.welcomeTitle},"System Online & Autonomous Telemetry Connected"))),r().createElement("div",{className:e.welcomeBody},r().createElement("p",null,"I am your autonomous ",r().createElement("strong",null,"Site Reliability Engineering (SRE)")," partner. I investigate incidents by orchestrating tasks across ",r().createElement("strong",null,"216 live Model Context Protocol (MCP)")," tools:"),r().createElement("ul",{className:e.welcomeList},r().createElement("li",null,r().createElement("strong",null,"Metrics Analyst"),": PromQL telemetry queries against ",r().createElement("code",null,"VictoriaMetrics TSDB"),"."),r().createElement("li",null,r().createElement("strong",null,"Log Analyst"),": LogSQL pattern search & error clustering in ",r().createElement("code",null,"VictoriaLogs"),"."),r().createElement("li",null,r().createElement("strong",null,"Trace Analyst"),": Distributed span and latency inspection in ",r().createElement("code",null,"VictoriaTraces"),"."),r().createElement("li",null,r().createElement("strong",null,"Incident Responder"),": Grafana alert rules, firing states, and dashboards.")),r().createElement("p",{className:e.welcomeHint},"Click one of the 1-click automated investigation prompts below, or type your custom incident query."))),t.map(t=>r().createElement("div",{key:t.id,className:"user"===t.role?e.messageRowUser:e.messageRowAssistant},r().createElement("div",{className:"user"===t.role?e.avatarUser:e.avatarAI},"user"===t.role?"YOU":"AI"),r().createElement("div",{className:e.messageContent},r().createElement("div",{className:e.messageMeta},r().createElement("span",{className:e.msgSender},"user"===t.role?"Operator":"Mezmo AURA SRE Orchestrator"),r().createElement("span",{className:e.msgTime},t.timestamp)),r().createElement("div",{className:"user"===t.role?e.bubbleUser:e.bubbleAssistant},"user"===t.role?r().createElement("p",{className:e.userText},t.content):r().createElement(u,{content:t.content}))))),g&&r().createElement("div",{className:e.messageRowAssistant},r().createElement("div",{className:e.avatarAI},"AI"),r().createElement("div",{className:e.messageContent},r().createElement("div",{className:e.messageMeta},r().createElement("span",{className:e.msgSender},"Mezmo AURA SRE Orchestrator")),r().createElement("div",{className:e.thinkingBubble},r().createElement(l.Spinner,{size:18,inline:!0}),r().createElement("span",{className:e.thinkingText},"Orchestrating multi-agent investigation across VictoriaMetrics, VictoriaLogs, VictoriaTraces & Grafana...")))),r().createElement("div",{ref:C})),r().createElement("div",{className:e.quickChipsBar},r().createElement("span",{className:e.quickChipsLabel},"1-Click Automated Investigations:"),r().createElement("div",{className:e.chipsScroll},i.EP.map(t=>r().createElement("button",{key:t.id,className:e.quickChip,onClick:()=>A(t.prompt),disabled:g,title:t.prompt},r().createElement("span",null,t.title))))),r().createElement("div",{className:e.inputBar},r().createElement("div",{className:e.inputWrapper},r().createElement("textarea",{ref:T,className:e.textarea,rows:2,value:o,placeholder:"Ask AURA to investigate an incident (defaults to last 5 minutes of telemetry unless specified)... [Press Enter to send, Shift+Enter for newline]",onChange:e=>p(e.target.value),onKeyDown:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),A())},disabled:g})),r().createElement(l.Button,{variant:"primary",size:"md",icon:g?void 0:"arrow-right",onClick:()=>A(),disabled:!o.trim()||g},g?"Investigating...":"Investigate"))),r().createElement(m,{health:b,latencyMs:y}))))},k=v,$=e=>({pageContainer:o.css`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: calc(100vh - 120px);
  `,layoutGrid:o.css`
    display: flex;
    gap: ${e.spacing(2)};
    align-items: flex-start;
    @media (max-width: 1024px) {
      flex-direction: column;
    }
  `,workspace:o.css`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: ${e.colors.background.primary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    box-shadow: ${e.shadows.z1};
    overflow: hidden;
  `,workspaceHeader:o.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${e.spacing(1,2)};
    background: ${e.colors.background.secondary};
    border-bottom: 1px solid ${e.colors.border.weak};
  `,workspaceTitleGroup:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `,workspaceTitle:o.css`
    font-size: 0.95rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
  `,iconBlue:o.css`
    color: #3b82f6;
  `,workspaceActions:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `,messagesFeed:o.css`
    flex: 1;
    min-height: 480px;
    max-height: 620px;
    overflow-y: auto;
    padding: ${e.spacing(2)};
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(2)};
    background: ${e.colors.background.canvas};
  `,welcomeCard:o.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2)};
    box-shadow: ${e.shadows.z1};
  `,welcomeHeader:o.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
    margin-bottom: ${e.spacing(1.5)};
  `,welcomeSender:o.css`
    font-size: 0.75rem;
    color: ${e.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,welcomeTitle:o.css`
    font-size: 1.1rem;
    font-weight: 700;
    color: #38bdf8;
    margin: 2px 0 0 0;
  `,welcomeBody:o.css`
    font-size: 0.875rem;
    line-height: 1.6;
    color: ${e.colors.text.primary};
  `,welcomeList:o.css`
    margin: ${e.spacing(1,0,1.5,2.5)};
    padding: 0;
    li {
      margin-bottom: 6px;
    }
  `,welcomeHint:o.css`
    font-size: 0.8rem;
    color: ${e.colors.text.secondary};
    margin: 0;
  `,messageRowUser:o.css`
    display: flex;
    gap: ${e.spacing(1.5)};
    align-self: flex-end;
    max-width: 85%;
    flex-direction: row-reverse;
  `,messageRowAssistant:o.css`
    display: flex;
    gap: ${e.spacing(1.5)};
    align-self: flex-start;
    max-width: 95%;
  `,avatarAI:o.css`
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
  `,avatarUser:o.css`
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
  `,messageContent:o.css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  `,messageMeta:o.css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,msgSender:o.css`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${e.colors.text.secondary};
  `,msgTime:o.css`
    font-size: 0.7rem;
    color: ${e.colors.text.disabled};
  `,bubbleUser:o.css`
    background: ${e.colors.primary.main};
    color: ${e.colors.primary.contrastText};
    padding: ${e.spacing(1,1.5)};
    border-radius: ${e.shape.radius.default};
    border-top-right-radius: 0;
    font-size: 0.9rem;
    box-shadow: ${e.shadows.z1};
  `,userText:o.css`
    margin: 0;
    white-space: pre-wrap;
  `,bubbleAssistant:o.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    padding: ${e.spacing(1.5)};
    border-radius: ${e.shape.radius.default};
    border-top-left-radius: 0;
    box-shadow: ${e.shadows.z1};
  `,thinkingBubble:o.css`
    display: flex;
    align-items: center;
    gap: 10px;
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-left: 3px solid #38bdf8;
    padding: ${e.spacing(1.25,1.5)};
    border-radius: ${e.shape.radius.default};
  `,thinkingText:o.css`
    font-size: 0.85rem;
    color: #38bdf8;
    font-family: ${e.typography.fontFamilyMonospace};
  `,quickChipsBar:o.css`
    padding: ${e.spacing(1,2)};
    background: ${e.colors.background.secondary};
    border-top: 1px solid ${e.colors.border.weak};
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    flex-wrap: wrap;
  `,quickChipsLabel:o.css`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${e.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,chipsScroll:o.css`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  `,quickChip:o.css`
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
  `,inputBar:o.css`
    display: flex;
    align-items: flex-end;
    gap: ${e.spacing(1.5)};
    padding: ${e.spacing(1.5,2)};
    background: ${e.colors.background.secondary};
    border-top: 1px solid ${e.colors.border.weak};
  `,inputWrapper:o.css`
    flex: 1;
  `,textarea:o.css`
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
//# sourceMappingURL=37.js.map?_cache=50921b5b074eb94fc4fa