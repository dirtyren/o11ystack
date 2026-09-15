"use strict";(self.webpackChunkopensre_app=self.webpackChunkopensre_app||[]).push([[691],{796(e,t,a){a.d(t,{Q:()=>c});var s=a(531),r=a(269),n=a(474);function o(e,t,a,s,r,n,o){try{var l=e[n](o),c=l.value}catch(e){return void a(e)}l.done?t(c):Promise.resolve(c).then(s,r)}function l(e){return function(){var t=this,a=arguments;return new Promise(function(s,r){var n=e.apply(t,a);function l(e){o(n,s,r,l,c,"next",e)}function c(e){o(n,s,r,l,c,"throw",e)}l(void 0)})}}class c{static getProxyUrl(e,t){return t&&t.trim()?`${t.trim().replace(/\/$/,"")}/${e.replace(/^\//,"")}`:`api/plugin-proxy/${n.s_}/opensre/${e.replace(/^\//,"")}`}static getHealth(e){return l(function*(){const t=performance.now(),a=this.getProxyUrl("health",e);try{const e=yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"GET"})),n=Math.round(performance.now()-t);return{data:e.data,latencyMs:n}}catch(e){try{const e=yield fetch("/opensre/health");if(e.ok){const a=yield e.json();return{data:a,latencyMs:Math.round(performance.now()-t)}}}catch(e){}throw e}}).call(this)}static getModels(e){return l(function*(){const t=this.getProxyUrl("v1/models",e);try{var a;return(null===(a=(yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:t,method:"GET"}))).data)||void 0===a?void 0:a.data)||[]}catch(e){try{const e=yield fetch("/opensre/v1/models");if(e.ok){return(yield e.json()).data||[]}}catch(e){}return[]}}).call(this)}static sendChat(e,t){return l(function*(){const a=this.getProxyUrl("v1/chat/completions",t);try{var n,o,l,c;const t=null===(c=(yield(0,r.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"POST",data:{messages:e}}))).data)||void 0===c||null===(l=c.choices)||void 0===l||null===(o=l[0])||void 0===o||null===(n=o.message)||void 0===n?void 0:n.content;if(!t)throw new Error("No content returned from OpenSRE Agent");return t}catch(t){var i,d,m;try{const t=yield fetch("/opensre/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:e})});if(t.ok){var p,u,g;const e=null===(g=(yield t.json()).choices)||void 0===g||null===(u=g[0])||void 0===u||null===(p=u.message)||void 0===p?void 0:p.content;if(e)return e}}catch(e){}const a=(null==t||null===(i=t.data)||void 0===i?void 0:i.message)||(null==t||null===(m=t.data)||void 0===m||null===(d=m.error)||void 0===d?void 0:d.message)||(null==t?void 0:t.statusText)||(null==t?void 0:t.message)||"Error communicating with OpenSRE Agent";throw new Error(a)}}).call(this)}}const i=c;a.d(t,["N",0,i])},352(e,t,a){a.d(t,{g:()=>d});var s=a(959),r=a.n(s),n=a(89),o=a(7),l=a(159),c=a(474);function i(e){return`${c.Gy}/${e}`}const d=({health:e,latencyMs:t,activeModel:a})=>{const s=(0,o.useStyles2)(m),n=(0,l.useNavigate)(),d=(0,l.useLocation)(),p=d.pathname.endsWith("/console")||d.pathname.endsWith(c.bw.Console)||!d.pathname.includes("/"),u=d.pathname.includes("/traces"),g=d.pathname.includes("/integrations"),f="healthy"===(null==e?void 0:e.status),h="degraded"===(null==e?void 0:e.status);return r().createElement("header",{className:s.header},r().createElement("div",{className:s.topRow},r().createElement("div",{className:s.brandGroup},r().createElement("div",{className:s.logoWrapper},r().createElement("svg",{viewBox:"0 0 100 100",width:"32",height:"32"},r().createElement("polygon",{points:"50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5",fill:"#080c14",stroke:"#00D2FF",strokeWidth:"4"}),r().createElement("circle",{cx:"50",cy:"50",r:"18",fill:"none",stroke:"#27E99F",strokeWidth:"3.5"}),r().createElement("line",{x1:"50",y1:"12",x2:"50",y2:"32",stroke:"#00D2FF",strokeWidth:"3"}),r().createElement("line",{x1:"50",y1:"68",x2:"50",y2:"88",stroke:"#00D2FF",strokeWidth:"3"}),r().createElement("line",{x1:"16",y1:"50",x2:"32",y2:"50",stroke:"#00D2FF",strokeWidth:"3"}),r().createElement("line",{x1:"68",y1:"50",x2:"84",y2:"50",stroke:"#00D2FF",strokeWidth:"3"}),r().createElement("circle",{cx:"50",cy:"50",r:"6",fill:"#27E99F"}))),r().createElement("div",null,r().createElement("div",{className:s.titleRow},r().createElement("span",{className:s.brandTitle},"OPENSRE"),r().createElement("span",{className:s.brandSub},"AI SRE AGENT"),r().createElement(o.Badge,{text:"OPEN SOURCE SRE",color:"green"})),r().createElement("span",{className:s.tagline},"Autonomous Incident Investigation, TSDB & Log Triage, and ChatOps"))),r().createElement("div",{className:s.statusGroup},r().createElement("div",{className:s.statusPill},r().createElement("span",{className:f?s.statusDotHealthy:h?s.statusDotDegraded:s.statusDotOffline}),r().createElement("span",{className:s.statusText},e?f?"ONLINE (200)":e.status.toUpperCase():"CONNECTING..."),null!=t&&r().createElement("span",{className:s.latencyBadge},t," ms")),a&&r().createElement(o.Tooltip,{content:"Active LLM Model (routed via LiteLLM Proxy)"},r().createElement("div",{className:s.modelPill},r().createElement(o.Icon,{name:"brain",size:"sm",className:s.iconCyan}),r().createElement("span",null,a))),r().createElement(o.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"exchange-alt",onClick:()=>window.location.href="/grafana/a/mezmo-aura-app/console"},"Switch to AURA"))),r().createElement("div",{className:s.bottomRow},r().createElement(o.TabsBar,null,r().createElement(o.Tab,{label:"Investigation Console",active:p,icon:"code-branch",onChangeTab:()=>n(i(c.bw.Console))}),r().createElement(o.Tab,{label:"Integrations & Fleet",active:g,icon:"apps",onChangeTab:()=>n(i(c.bw.Integrations))}),r().createElement(o.Tab,{label:"Telemetry & Spans",active:u,icon:"sitemap",onChangeTab:()=>n(i(c.bw.Traces))})),r().createElement("div",{className:s.quickLinks},r().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"file-alt",onClick:()=>window.open("/vlogs/select/vmui/","_blank")},"VictoriaLogs"),r().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"chart-line",onClick:()=>window.open("/vmetrics/vmui/","_blank")},"VictoriaMetrics"),r().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"brain",onClick:()=>window.open("/litellm/ui/","_blank")},"LiteLLM Hub"))))},m=e=>({header:n.css`
    display: flex;
    flex-direction: column;
    background: ${e.colors.background.secondary};
    border-bottom: 1px solid ${e.colors.border.weak};
    padding: ${e.spacing(1.5,2,0)};
    margin-bottom: ${e.spacing(2)};
  `,topRow:n.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${e.spacing(1.5)};
    flex-wrap: wrap;
    gap: ${e.spacing(1)};
  `,brandGroup:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
  `,logoWrapper:n.css`
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 0 8px rgba(0, 210, 255, 0.4));
  `,titleRow:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `,brandTitle:n.css`
    font-weight: 800;
    font-size: 1.15rem;
    letter-spacing: 0.5px;
    color: #00D2FF;
  `,brandSub:n.css`
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 1px;
    color: ${e.colors.text.secondary};
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
    gap: ${e.spacing(.75)};
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
    border-radius: 16px;
    padding: ${e.spacing(.35,1)};
    font-size: 0.75rem;
  `,statusDotHealthy:n.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  `,statusDotDegraded:n.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
    box-shadow: 0 0 6px #f59e0b;
  `,statusDotOffline:n.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 6px #ef4444;
  `,statusText:n.css`
    font-family: monospace;
    font-weight: 600;
  `,latencyBadge:n.css`
    color: ${e.colors.text.secondary};
    font-size: 0.7rem;
    padding-left: ${e.spacing(.5)};
    border-left: 1px solid ${e.colors.border.weak};
  `,modelPill:n.css`
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
  `,iconCyan:n.css`
    color: #00D2FF;
  `,bottomRow:n.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,quickLinks:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.5)};
    margin-bottom: ${e.spacing(.5)};
  `})},691(e,t,a){a.r(t),a.d(t,{InvestigationConsole:()=>N,default:()=>C});var s=a(959),r=a.n(s),n=a(89),o=a(531),l=a(7),c=a(796),i=a(474),d=a(352);const m=({health:e,latencyMs:t})=>{const a=(0,l.useStyles2)(p),[n,o]=(0,s.useState)(!1),[c,d]=(0,s.useState)(!1),m="healthy"===(null==e?void 0:e.status);return r().createElement("aside",{className:a.sidebar},r().createElement("div",{className:a.card},r().createElement("div",{className:a.cardHeader},r().createElement(l.Icon,{name:"heart-rate",className:a.iconBlue}),r().createElement("span",{className:a.cardTitle},"Live Agent Telemetry")),r().createElement("div",{className:a.statList},r().createElement("div",{className:a.statRow},r().createElement("span",{className:a.statLabel},"Agent State"),r().createElement("span",{className:m?a.statValueGreen:a.statValueAmber},(null==e?void 0:e.status)?e.status.toUpperCase():"CONNECTING")),r().createElement("div",{className:a.statRow},r().createElement("span",{className:a.statLabel},"OpenSRE Version"),r().createElement("span",{className:a.statValue},(null==e?void 0:e.version)?`v${e.version}`:"v0.1.0")),r().createElement("div",{className:a.statRow},r().createElement("span",{className:a.statLabel},"Active LLM"),r().createElement("span",{className:a.statValue},(null==e?void 0:e.model)||"aura-sre-model")),r().createElement("div",{className:a.statRow},r().createElement("span",{className:a.statLabel},"Model Gateway"),r().createElement("span",{className:a.statValue},"LiteLLM :4000")),r().createElement("div",{className:a.statRow},r().createElement("span",{className:a.statLabel},"API Latency"),r().createElement("span",{className:a.statValue},null!=t?`${t} ms`:"--")))),r().createElement("div",{className:a.card},r().createElement("div",{className:a.cardHeader},r().createElement(l.Icon,{name:"apps",className:a.iconBlue}),r().createElement("span",{className:a.cardTitle},"Connected Stack Modules"),r().createElement(l.Badge,{text:"6 MODULES",color:"blue"})),r().createElement("div",{className:a.workersList},i.oH.map(e=>r().createElement("div",{key:e.name,className:a.workerItem},r().createElement("span",{className:"connected"===e.status?a.workerDot:a.workerDotOptional}),r().createElement("div",{className:a.workerDetails},r().createElement("div",{className:a.workerNameRow},r().createElement("span",{className:a.workerName},e.name),r().createElement("span",{className:a.workerLang},e.category)),r().createElement("span",{className:a.workerDesc},e.protocol)))))),r().createElement("div",{className:a.cardGlow},r().createElement("div",{className:a.cardHeader},r().createElement(l.Icon,{name:"exchange-alt",className:a.iconCyan}),r().createElement("span",{className:a.cardTitle},"Dual SRE Architecture")),r().createElement("p",{className:a.glowDesc},"OpenSRE and Mezmo AURA run concurrently on the same stack. Both share the unified ",r().createElement("code",null,"aura-sre-model")," routed through LiteLLM with Redis caching."),r().createElement("div",{className:a.btnGroupVertical},r().createElement(l.Button,{size:"xs",variant:"secondary",icon:"external-link-alt",onClick:()=>window.open("/grafana/a/mezmo-aura-app/console","_self")},"Launch Mezmo AURA App"),r().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:"compass",onClick:()=>window.open("/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaMetrics%22%7D","_blank")},"Explore VictoriaMetrics"))),r().createElement("div",{className:a.card},r().createElement("div",{className:a.cardHeader},r().createElement(l.Icon,{name:"terminal",className:a.iconBlue}),r().createElement("span",{className:a.cardTitle},"Developer CLI & API")),r().createElement("div",{className:a.btnGroupVertical},r().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:n?"check":"copy",onClick:()=>{navigator.clipboard.writeText('docker exec -it opensre opensre ask "Check cluster health"'),o(!0),setTimeout(()=>o(!1),2e3)}},n?"Copied CLI Command!":"Copy Docker CLI Command"),r().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:c?"check":"copy",onClick:()=>{const e=`curl -k -s -u admin:<BASIC_AUTH_PASSWORD> \\\n  -X POST https://${window.location.host}/opensre/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -d '{"messages":[{"role":"user","content":"Investigate stack health"}]}'`;navigator.clipboard.writeText(e),d(!0),setTimeout(()=>d(!1),2e3)}},c?"Copied curl Command!":"Copy /v1/chat/completions curl"))))},p=e=>({sidebar:n.css`
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(2)};
  `,card:n.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2)};
  `,cardGlow:n.css`
    background: ${e.colors.background.secondary};
    border: 1px solid rgba(0, 210, 255, 0.4);
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2)};
    box-shadow: 0 0 16px rgba(0, 210, 255, 0.08);
  `,cardHeader:n.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    margin-bottom: ${e.spacing(1.5)};
  `,cardTitle:n.css`
    font-size: 0.9rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
    flex-grow: 1;
  `,iconBlue:n.css`
    color: #00D2FF;
  `,iconCyan:n.css`
    color: #27E99F;
  `,statList:n.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1)};
  `,statRow:n.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
  `,statLabel:n.css`
    color: ${e.colors.text.secondary};
  `,statValue:n.css`
    font-family: monospace;
    color: ${e.colors.text.primary};
    font-weight: 600;
  `,statValueGreen:n.css`
    font-family: monospace;
    color: #10b981;
    font-weight: 700;
  `,statValueAmber:n.css`
    font-family: monospace;
    color: #f59e0b;
    font-weight: 700;
  `,workersList:n.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.25)};
  `,workerItem:n.css`
    display: flex;
    align-items: flex-start;
    gap: ${e.spacing(1)};
    padding: ${e.spacing(.75)};
    border-radius: 6px;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
  `,workerDot:n.css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 4px #10b981;
    margin-top: 5px;
    flex-shrink: 0;
  `,workerDotOptional:n.css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f59e0b;
    margin-top: 5px;
    flex-shrink: 0;
  `,workerDetails:n.css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  `,workerNameRow:n.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,workerName:n.css`
    font-size: 0.78rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
  `,workerLang:n.css`
    font-size: 0.7rem;
    color: #00D2FF;
    font-family: monospace;
  `,workerDesc:n.css`
    font-size: 0.72rem;
    color: ${e.colors.text.secondary};
    line-height: 1.3;
  `,glowDesc:n.css`
    font-size: 0.8rem;
    color: ${e.colors.text.secondary};
    line-height: 1.4;
    margin-bottom: ${e.spacing(1.5)};
  `,btnGroupVertical:n.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1)};
  `}),u=({content:e})=>{const t=(0,l.useStyles2)(b),a=function(e){const t=e.split("\n"),a=[];let s=0;for(;s<t.length;){const e=t[s];if(e.trim().startsWith("```")){const r=e.trim().substring(3).trim(),n=[];for(s++;s<t.length&&!t[s].trim().startsWith("```");)n.push(t[s]),s++;s++,a.push({type:"code",language:r||"text",text:n.join("\n")});continue}if(e.trim().startsWith("|")&&e.trim().endsWith("|")&&s+1<t.length&&t[s+1].includes("---")){const r=e.split("|").slice(1,-1).map(e=>e.trim());s+=2;const n=[];for(;s<t.length&&t[s].trim().startsWith("|");){const e=t[s].split("|").slice(1,-1).map(e=>e.trim());n.push(e),s++}a.push({type:"table",headers:r,rows:n});continue}const r=e.match(/^(#{1,4})\s+(.*)$/);if(r){a.push({type:"header",level:r[1].length,text:r[2]}),s++;continue}if(/^\s*[-*]\s+/.test(e)){const e=[];for(;s<t.length&&/^\s*[-*]\s+/.test(t[s]);)e.push(t[s].replace(/^\s*[-*]\s+/,"")),s++;a.push({type:"list",items:e});continue}if(!e.trim()){s++;continue}const n=[];for(;s<t.length&&t[s].trim()&&!t[s].trim().startsWith("```")&&!t[s].match(/^(#{1,4})\s+/)&&!/^\s*[-*]\s+/.test(t[s])&&(!t[s].trim().startsWith("|")||!t[s].trim().endsWith("|"));)n.push(t[s]),s++;n.length>0&&a.push({type:"paragraph",text:n.join("\n")})}return a}(e);return r().createElement("div",{className:t.container},a.map((e,a)=>{switch(e.type){case"code":return r().createElement(f,{key:a,language:e.language||"text",code:e.text||""});case"header":return 1===e.level?r().createElement("h2",{key:a,className:t.h1},g(e.text,t)):2===e.level?r().createElement("h3",{key:a,className:t.h2},g(e.text,t)):r().createElement("h4",{key:a,className:t.h3},g(e.text,t));case"list":return r().createElement("ul",{key:a,className:t.list},(e.items||[]).map((e,a)=>r().createElement("li",{key:a,className:t.listItem},g(e,t))));case"table":return r().createElement(h,{key:a,headers:e.headers,rows:e.rows,styles:t});default:return r().createElement("p",{key:a,className:t.paragraph},g(e.text,t))}}))};function g(e,t){if(!e)return null;return e.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|🟢\s*[^,\n.]+|🟡\s*[^,\n.]+|🔴\s*[^,\n.]+)/g).map((e,a)=>{if(!e)return null;if(e.startsWith("`")&&e.endsWith("`"))return r().createElement("code",{key:a,className:t.inlineCode},e.slice(1,-1));if(e.startsWith("**")&&e.endsWith("**"))return r().createElement("strong",{key:a,className:t.strong},e.slice(2,-2));if(e.startsWith("*")&&e.endsWith("*"))return r().createElement("em",{key:a},e.slice(1,-1));if(e.startsWith("[")&&e.includes("](")){const s=e.match(/\[([^\]]+)\]\(([^)]+)\)/);if(s)return r().createElement("a",{key:a,href:s[2],target:"_blank",rel:"noopener noreferrer",className:t.link},s[1])}return e.startsWith("🟢")?r().createElement("span",{key:a,className:t.badgeNormal},e):e.startsWith("🟡")?r().createElement("span",{key:a,className:t.badgeWarning},e):e.startsWith("🔴")?r().createElement("span",{key:a,className:t.badgeCritical},e):e})}const f=({language:e,code:t})=>{const[a,n]=(0,s.useState)(!1),o=(0,l.useStyles2)(b);return r().createElement("div",{className:o.codeContainer},r().createElement("div",{className:o.codeHeader},r().createElement("span",{className:o.codeLang},e||"code"),r().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:a?"check":"copy",onClick:()=>{navigator.clipboard.writeText(t),n(!0),setTimeout(()=>n(!1),2e3)}},a?"Copied":"Copy")),r().createElement("pre",{className:o.codePre},r().createElement("code",null,t)))},h=({headers:e,rows:t,styles:a})=>e&&t?r().createElement("div",{className:a.tableWrapper},r().createElement("table",{className:a.table},r().createElement("thead",null,r().createElement("tr",null,e.map((e,t)=>r().createElement("th",{key:t},e)))),r().createElement("tbody",null,t.map((e,t)=>r().createElement("tr",{key:t},e.map((e,t)=>r().createElement("td",{key:t},g(e,a)))))))):null,b=e=>({container:n.css`
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
  `});function x(e,t,a,s,r,n,o){try{var l=e[n](o),c=l.value}catch(e){return void a(e)}l.done?t(c):Promise.resolve(c).then(s,r)}function y(e){return function(){var t=this,a=arguments;return new Promise(function(s,r){var n=e.apply(t,a);function o(e){x(n,s,r,o,l,"next",e)}function l(e){x(n,s,r,o,l,"throw",e)}o(void 0)})}}function E(){return`${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function w(){return(new Date).toLocaleTimeString()}function v(){return performance.now()}function k(e){return Math.round(performance.now()-e)}function $(e){return e<1e3?`${e}ms`:`${(e/1e3).toFixed(2)}s`}const N=()=>{const e=(0,l.useStyles2)(S),[t,a]=(0,s.useState)([]),[n,p]=(0,s.useState)(""),[g,f]=(0,s.useState)(!1),[h,b]=(0,s.useState)(null),[x,N]=(0,s.useState)(null),[C,z]=(0,s.useState)("aura-sre-model"),[T,L]=(0,s.useState)(null),[A,I]=(0,s.useState)(0),M=(0,s.useRef)(null),R=(0,s.useRef)(null);(0,s.useEffect)(()=>{if(!g)return;const e=v(),t=setInterval(()=>{I(k(e))},100);return()=>{clearInterval(t)}},[g]);(0,s.useEffect)(()=>{var e;null===(e=M.current)||void 0===e||e.scrollIntoView({behavior:"smooth"})},[t,g]),(0,s.useEffect)(()=>{let e=!0;const t=()=>y(function*(){try{const t=yield c.N.getHealth();e&&(b(t.data),N(t.latencyMs))}catch(t){e&&(b({status:"unreachable"}),N(null))}try{const t=yield c.N.getModels();e&&t.length>0&&z(t[0].id)}catch(e){}})(),a=setTimeout(t,0),s=setInterval(t,15e3);return()=>{e=!1,clearTimeout(a),clearInterval(s)}},[]);const B=e=>y(function*(){const s=(e||n).trim();if(!s||g)return;const r={id:E(),role:"user",content:s,timestamp:w()},o=[...t,r];a(o),p(""),f(!0);const l=v();try{const e=o.map(e=>({role:e.role,content:e.content})),t=yield c.N.sendChat(e),s=k(l),r={id:E(),role:"assistant",content:t,timestamp:w(),elapsedMs:s};a(e=>[...e,r])}catch(e){const t=k(l),s={id:E(),role:"assistant",content:`🔴 **Investigation Error**: ${e.message||"Unable to communicate with OpenSRE Agent. Please check that the OpenSRE container is running."}`,timestamp:w(),isError:!0,elapsedMs:t};a(e=>[...e,s])}finally{f(!1),I(0),setTimeout(()=>{var e;return null===(e=R.current)||void 0===e?void 0:e.focus()},50)}})();return r().createElement(o.PluginPage,null,r().createElement("div",{className:e.pageContainer},r().createElement(d.g,{health:h,latencyMs:x,activeModel:C}),r().createElement("div",{className:e.layoutGrid},r().createElement("section",{className:e.workspace},r().createElement("div",{className:e.workspaceHeader},r().createElement("div",{className:e.workspaceTitleGroup},r().createElement(l.Icon,{name:"code-branch",className:e.iconBlue}),r().createElement("span",{className:e.workspaceTitle},"Autonomous SRE Investigation Console"),r().createElement(l.Badge,{text:"LIVE GATEWAY",color:"blue"})),r().createElement("div",{className:e.workspaceActions},r().createElement(l.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"trash-alt",onClick:()=>{a([])},disabled:0===t.length&&!g},"Clear Console"))),r().createElement("div",{className:e.messagesFeed},0===t.length&&r().createElement("div",{className:e.welcomeCard},r().createElement("div",{className:e.welcomeHeader},r().createElement("div",{className:e.avatarAI},"SRE"),r().createElement("div",null,r().createElement("span",{className:e.welcomeSender},"OpenSRE AI Agent • Autonomous Production SRE"),r().createElement("h3",{className:e.welcomeTitle},"OpenSRE Online & Autonomous Telemetry Connected"))),r().createElement("div",{className:e.welcomeBody},r().createElement("p",null,"I am your autonomous ",r().createElement("strong",null,"OpenSRE Agent"),". I investigate production failures, trace anomalies, and perform root-cause analysis across your observability stack:"),r().createElement("ul",{className:e.welcomeList},r().createElement("li",null,r().createElement("strong",null,"VictoriaLogs Integration"),": Search log streams, error bursts & stack traces with LogSQL."),r().createElement("li",null,r().createElement("strong",null,"VictoriaMetrics TSDB"),": Query PromQL instant and range metrics for CPU/RAM and saturation spikes."),r().createElement("li",null,r().createElement("strong",null,"Grafana Integration"),": Inspect active alerts, firing rules, and provisioned datasource health."),r().createElement("li",null,r().createElement("strong",null,"LiteLLM Model Router"),": Powered by ",r().createElement("code",null,"aura-sre-model")," with Redis prompt caching.")),r().createElement("p",{className:e.welcomeHint},"Click one of the 1-click automated investigation prompts below, or type your custom incident query."))),t.map(t=>r().createElement("div",{key:t.id,className:"user"===t.role?e.messageRowUser:e.messageRowAssistant},r().createElement("div",{className:"user"===t.role?e.avatarUser:e.avatarAI},"user"===t.role?"YOU":"SRE"),r().createElement("div",{className:e.messageContent},r().createElement("div",{className:e.messageMeta},r().createElement("div",{className:e.metaLeft},r().createElement("span",{className:e.msgSender},"user"===t.role?"Operator":"OpenSRE AI Agent"),r().createElement("span",{className:e.msgTime},t.timestamp),void 0!==t.elapsedMs&&r().createElement("span",{className:e.elapsedBadge,title:`Investigation completed in ${$(t.elapsedMs)} (${t.elapsedMs} ms)`},r().createElement(l.Icon,{name:"clock-nine",size:"xs"}),r().createElement("span",null,$(t.elapsedMs)))),"assistant"===t.role&&r().createElement("div",{className:e.metaActions},r().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:T===t.id?"check":"copy",onClick:()=>{return e=t.id,a=t.content,navigator.clipboard.writeText(a),L(e),void setTimeout(()=>{L(t=>t===e?null:t)},2e3);var e,a},className:e.copyBtn},T===t.id?"Copied":"Copy Investigation"))),r().createElement("div",{className:"user"===t.role?e.bubbleUser:e.bubbleAssistant},"user"===t.role?r().createElement("p",{className:e.userText},t.content):r().createElement(u,{content:t.content}))))),g&&r().createElement("div",{className:e.messageRowAssistant},r().createElement("div",{className:e.avatarAI},"SRE"),r().createElement("div",{className:e.messageContent},r().createElement("div",{className:e.messageMeta},r().createElement("div",{className:e.metaLeft},r().createElement("span",{className:e.msgSender},"OpenSRE AI Agent"),r().createElement("span",{className:e.elapsedBadgeActive,title:"Investigation in progress"},r().createElement(l.Icon,{name:"clock-nine",size:"xs"}),r().createElement("span",null,$(A))))),r().createElement("div",{className:e.thinkingBubble},r().createElement(l.Spinner,{size:18,inline:!0}),r().createElement("span",{className:e.thinkingText},"OpenSRE investigating incident across VictoriaMetrics, VictoriaLogs & Grafana...")))),r().createElement("div",{ref:M})),r().createElement("div",{className:e.quickChipsBar},r().createElement("span",{className:e.quickChipsLabel},"1-Click Automated Investigations:"),r().createElement("div",{className:e.chipsScroll},i.EP.map(t=>r().createElement("button",{key:t.id,className:e.quickChip,onClick:()=>B(t.prompt),disabled:g,title:t.prompt},r().createElement("span",null,t.title))))),r().createElement("div",{className:e.inputBar},r().createElement("div",{className:e.inputWrapper},r().createElement("textarea",{ref:R,className:e.textarea,rows:2,value:n,placeholder:"Ask OpenSRE to investigate an incident, analyze logs, or query metrics... [Press Enter to send, Shift+Enter for newline]",onChange:e=>p(e.target.value),onKeyDown:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),B())},disabled:g})),r().createElement(l.Button,{variant:"primary",size:"md",icon:g?void 0:"arrow-right",onClick:()=>B(),disabled:!n.trim()||g},g?"Investigating...":"Investigate"))),r().createElement(m,{health:h,latencyMs:x}))))},C=N,S=e=>({pageContainer:n.css`
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
//# sourceMappingURL=691.js.map?_cache=9811bd244c5a6b3c9e94