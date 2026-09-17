"use strict";(self.webpackChunkopensre_app=self.webpackChunkopensre_app||[]).push([[18],{564(e,t,a){a.d(t,{Q:()=>d});var s=a(531),n=a(269),r=a(351);function o(e,t,a,s,n,r,o){try{var l=e[r](o),c=l.value}catch(e){return void a(e)}l.done?t(c):Promise.resolve(c).then(s,n)}function l(e){return function(){var t=this,a=arguments;return new Promise(function(s,n){var r=e.apply(t,a);function l(e){o(r,s,n,l,c,"next",e)}function c(e){o(r,s,n,l,c,"throw",e)}l(void 0)})}}function c(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},s=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(s=s.concat(Object.getOwnPropertySymbols(a).filter(function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable}))),s.forEach(function(t){c(e,t,a[t])})}return e}class d{static getProxyUrl(e,t){return t&&t.trim()?`${t.trim().replace(/\/$/,"")}/${e.replace(/^\//,"")}`:`api/plugin-proxy/${r.s_}/opensre/${e.replace(/^\//,"")}`}static getHealth(e){return l(function*(){const t=performance.now(),a=this.getProxyUrl("health",e);try{const e=yield(0,n.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"GET"})),r=Math.round(performance.now()-t);return{data:e.data,latencyMs:r}}catch(e){try{const e=yield fetch("/opensre/health");if(e.ok){const a=yield e.json();return{data:a,latencyMs:Math.round(performance.now()-t)}}}catch(e){}throw e}}).call(this)}static getModels(e){return l(function*(){const t=this.getProxyUrl("v1/models",e);try{var a;return(null===(a=(yield(0,n.lastValueFrom)((0,s.getBackendSrv)().fetch({url:t,method:"GET"}))).data)||void 0===a?void 0:a.data)||[]}catch(e){try{const e=yield fetch("/opensre/v1/models");if(e.ok){return(yield e.json()).data||[]}}catch(e){}return[]}}).call(this)}static sendChat(e,t){return l(function*(){const a=this.getProxyUrl("v1/chat/completions",t);try{var r,o,l,c;const t=null===(c=(yield(0,n.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"POST",data:{messages:e}}))).data)||void 0===c||null===(l=c.choices)||void 0===l||null===(o=l[0])||void 0===o||null===(r=o.message)||void 0===r?void 0:r.content;if(!t)throw new Error("No content returned from OpenSRE Agent");return t}catch(t){var i,d,m;try{const t=yield fetch("/opensre/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:e})});if(t.ok){var p,u,g;const e=null===(g=(yield t.json()).choices)||void 0===g||null===(u=g[0])||void 0===u||null===(p=u.message)||void 0===p?void 0:p.content;if(e)return e}}catch(e){}const a=(null==t||null===(i=t.data)||void 0===i?void 0:i.message)||(null==t||null===(m=t.data)||void 0===m||null===(d=m.error)||void 0===d?void 0:d.message)||(null==t?void 0:t.statusText)||(null==t?void 0:t.message)||"Error communicating with OpenSRE Agent";throw new Error(a)}}).call(this)}static a2aJsonRpc(e,t){return l(function*(){const a=this.getProxyUrl("",void 0),r=(yield(0,n.lastValueFrom)((0,s.getBackendSrv)().fetch({url:a,method:"POST",data:{jsonrpc:"2.0",id:`${e.replace("/","-")}-${Date.now()}`,method:e,params:t}}))).data;if(null==r?void 0:r.error)throw new Error(r.error.message||`A2A ${e} failed`);if(!(null==r?void 0:r.result))throw new Error(`A2A ${e} returned no result`);return r.result}).call(this)}static sendA2aMessage(e){return l(function*(){return this.a2aJsonRpc("message/send",{message:i({messageId:e.messageId,role:"user",parts:[{kind:"text",text:e.text}]},e.contextId?{contextId:e.contextId}:{}),configuration:{acceptedOutputModes:["text/plain"]}})}).call(this)}static getA2aTask(e){return l(function*(){return this.a2aJsonRpc("tasks/get",{id:e})}).call(this)}}const m=d;a.d(t,["N",0,m])},893(e,t,a){a.d(t,{g:()=>d});var s=a(959),n=a.n(s),r=a(89),o=a(7),l=a(159),c=a(351);function i(e){return`${c.Gy}/${e}`}const d=({health:e,latencyMs:t,activeModel:a})=>{const s=(0,o.useStyles2)(m),r=(0,l.useNavigate)(),d=(0,l.useLocation)(),p=d.pathname.endsWith("/console")||d.pathname.endsWith(c.bw.Console)||!d.pathname.includes("/"),u=d.pathname.includes("/traces"),g=d.pathname.includes("/integrations"),f="healthy"===(null==e?void 0:e.status),h="degraded"===(null==e?void 0:e.status);return n().createElement("header",{className:s.header},n().createElement("div",{className:s.topRow},n().createElement("div",{className:s.brandGroup},n().createElement("div",{className:s.logoWrapper},n().createElement("svg",{viewBox:"0 0 100 100",width:"32",height:"32"},n().createElement("polygon",{points:"50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5",fill:"#080c14",stroke:"#00D2FF",strokeWidth:"4"}),n().createElement("circle",{cx:"50",cy:"50",r:"18",fill:"none",stroke:"#27E99F",strokeWidth:"3.5"}),n().createElement("line",{x1:"50",y1:"12",x2:"50",y2:"32",stroke:"#00D2FF",strokeWidth:"3"}),n().createElement("line",{x1:"50",y1:"68",x2:"50",y2:"88",stroke:"#00D2FF",strokeWidth:"3"}),n().createElement("line",{x1:"16",y1:"50",x2:"32",y2:"50",stroke:"#00D2FF",strokeWidth:"3"}),n().createElement("line",{x1:"68",y1:"50",x2:"84",y2:"50",stroke:"#00D2FF",strokeWidth:"3"}),n().createElement("circle",{cx:"50",cy:"50",r:"6",fill:"#27E99F"}))),n().createElement("div",null,n().createElement("div",{className:s.titleRow},n().createElement("span",{className:s.brandTitle},"OPENSRE"),n().createElement("span",{className:s.brandSub},"AI SRE AGENT"),n().createElement(o.Badge,{text:"OPEN SOURCE SRE",color:"green"})),n().createElement("span",{className:s.tagline},"Autonomous Incident Investigation, TSDB & Log Triage, and ChatOps"))),n().createElement("div",{className:s.statusGroup},n().createElement("div",{className:s.statusPill},n().createElement("span",{className:f?s.statusDotHealthy:h?s.statusDotDegraded:s.statusDotOffline}),n().createElement("span",{className:s.statusText},e?f?"ONLINE (200)":e.status.toUpperCase():"CONNECTING..."),null!=t&&n().createElement("span",{className:s.latencyBadge},t," ms")),a&&n().createElement(o.Tooltip,{content:"Active LLM Model (routed via LiteLLM Proxy)"},n().createElement("div",{className:s.modelPill},n().createElement(o.Icon,{name:"brain",size:"sm",className:s.iconCyan}),n().createElement("span",null,a))),n().createElement(o.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"exchange-alt",onClick:()=>window.location.href="/grafana/a/mezmo-aura-app/console"},"Switch to AURA"))),n().createElement("div",{className:s.bottomRow},n().createElement(o.TabsBar,null,n().createElement(o.Tab,{label:"Investigation Console",active:p,icon:"code-branch",onChangeTab:()=>r(i(c.bw.Console))}),n().createElement(o.Tab,{label:"Integrations & Fleet",active:g,icon:"apps",onChangeTab:()=>r(i(c.bw.Integrations))}),n().createElement(o.Tab,{label:"Telemetry & Spans",active:u,icon:"sitemap",onChangeTab:()=>r(i(c.bw.Traces))})),n().createElement("div",{className:s.quickLinks},n().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"file-alt",onClick:()=>window.open("/vlogs/select/vmui/","_blank")},"VictoriaLogs"),n().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"chart-line",onClick:()=>window.open("/vmetrics/vmui/","_blank")},"VictoriaMetrics"),n().createElement(o.Button,{size:"xs",variant:"secondary",fill:"text",icon:"brain",onClick:()=>window.open("/litellm/ui/","_blank")},"LiteLLM Hub"))))},m=e=>({header:r.css`
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
  `})},18(e,t,a){a.r(t),a.d(t,{InvestigationConsole:()=>N,default:()=>C});var s=a(959),n=a.n(s),r=a(89),o=a(531),l=a(7),c=a(564),i=a(351);function d(e){return`investigation:${function(e){const t=o.config.bootData.user;return`${t.orgId}:${t.id}:${e}`}(e)}`}var m=a(893);const p=({health:e,latencyMs:t})=>{const a=(0,l.useStyles2)(u),[r,o]=(0,s.useState)(!1),[c,d]=(0,s.useState)(!1),m="healthy"===(null==e?void 0:e.status);return n().createElement("aside",{className:a.sidebar},n().createElement("div",{className:a.card},n().createElement("div",{className:a.cardHeader},n().createElement(l.Icon,{name:"heart-rate",className:a.iconBlue}),n().createElement("span",{className:a.cardTitle},"Live Agent Telemetry")),n().createElement("div",{className:a.statList},n().createElement("div",{className:a.statRow},n().createElement("span",{className:a.statLabel},"Agent State"),n().createElement("span",{className:m?a.statValueGreen:a.statValueAmber},(null==e?void 0:e.status)?e.status.toUpperCase():"CONNECTING")),n().createElement("div",{className:a.statRow},n().createElement("span",{className:a.statLabel},"OpenSRE Version"),n().createElement("span",{className:a.statValue},(null==e?void 0:e.version)?`v${e.version}`:"v0.1.0")),n().createElement("div",{className:a.statRow},n().createElement("span",{className:a.statLabel},"Active LLM"),n().createElement("span",{className:a.statValue},(null==e?void 0:e.model)||"aura-sre-model")),n().createElement("div",{className:a.statRow},n().createElement("span",{className:a.statLabel},"Model Gateway"),n().createElement("span",{className:a.statValue},"LiteLLM :4000")),n().createElement("div",{className:a.statRow},n().createElement("span",{className:a.statLabel},"API Latency"),n().createElement("span",{className:a.statValue},null!=t?`${t} ms`:"--")))),n().createElement("div",{className:a.card},n().createElement("div",{className:a.cardHeader},n().createElement(l.Icon,{name:"apps",className:a.iconBlue}),n().createElement("span",{className:a.cardTitle},"Connected Stack Modules"),n().createElement(l.Badge,{text:"6 MODULES",color:"blue"})),n().createElement("div",{className:a.workersList},i.oH.map(e=>n().createElement("div",{key:e.name,className:a.workerItem},n().createElement("span",{className:"connected"===e.status?a.workerDot:a.workerDotOptional}),n().createElement("div",{className:a.workerDetails},n().createElement("div",{className:a.workerNameRow},n().createElement("span",{className:a.workerName},e.name),n().createElement("span",{className:a.workerLang},e.category)),n().createElement("span",{className:a.workerDesc},e.protocol)))))),n().createElement("div",{className:a.cardGlow},n().createElement("div",{className:a.cardHeader},n().createElement(l.Icon,{name:"exchange-alt",className:a.iconCyan}),n().createElement("span",{className:a.cardTitle},"Dual SRE Architecture")),n().createElement("p",{className:a.glowDesc},"OpenSRE and Mezmo AURA run concurrently on the same stack. Both share the unified ",n().createElement("code",null,"aura-sre-model")," routed through LiteLLM with Redis caching."),n().createElement("div",{className:a.btnGroupVertical},n().createElement(l.Button,{size:"xs",variant:"secondary",icon:"external-link-alt",onClick:()=>window.open("/grafana/a/mezmo-aura-app/console","_self")},"Launch Mezmo AURA App"),n().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:"compass",onClick:()=>window.open("/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaMetrics%22%7D","_blank")},"Explore VictoriaMetrics"))),n().createElement("div",{className:a.card},n().createElement("div",{className:a.cardHeader},n().createElement(l.Icon,{name:"code-branch",className:a.iconBlue}),n().createElement("span",{className:a.cardTitle},"Developer CLI & API")),n().createElement("div",{className:a.btnGroupVertical},n().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:r?"check":"copy",onClick:()=>{navigator.clipboard.writeText('docker exec -it opensre opensre ask "Check cluster health"'),o(!0),setTimeout(()=>o(!1),2e3)}},r?"Copied CLI Command!":"Copy Docker CLI Command"),n().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:c?"check":"copy",onClick:()=>{const e=`curl -k -s -u admin:<BASIC_AUTH_PASSWORD> \\\n  -X POST https://${window.location.host}/opensre/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -d '{"messages":[{"role":"user","content":"Investigate stack health"}]}'`;navigator.clipboard.writeText(e),d(!0),setTimeout(()=>d(!1),2e3)}},c?"Copied curl Command!":"Copy /v1/chat/completions curl"))))},u=e=>({sidebar:r.css`
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(2)};
  `,card:r.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2)};
  `,cardGlow:r.css`
    background: ${e.colors.background.secondary};
    border: 1px solid rgba(0, 210, 255, 0.4);
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2)};
    box-shadow: 0 0 16px rgba(0, 210, 255, 0.08);
  `,cardHeader:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    margin-bottom: ${e.spacing(1.5)};
  `,cardTitle:r.css`
    font-size: 0.9rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
    flex-grow: 1;
  `,iconBlue:r.css`
    color: #00D2FF;
  `,iconCyan:r.css`
    color: #27E99F;
  `,statList:r.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1)};
  `,statRow:r.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
  `,statLabel:r.css`
    color: ${e.colors.text.secondary};
  `,statValue:r.css`
    font-family: monospace;
    color: ${e.colors.text.primary};
    font-weight: 600;
  `,statValueGreen:r.css`
    font-family: monospace;
    color: #10b981;
    font-weight: 700;
  `,statValueAmber:r.css`
    font-family: monospace;
    color: #f59e0b;
    font-weight: 700;
  `,workersList:r.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1.25)};
  `,workerItem:r.css`
    display: flex;
    align-items: flex-start;
    gap: ${e.spacing(1)};
    padding: ${e.spacing(.75)};
    border-radius: 6px;
    background: ${e.colors.background.canvas};
    border: 1px solid ${e.colors.border.weak};
  `,workerDot:r.css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 4px #10b981;
    margin-top: 5px;
    flex-shrink: 0;
  `,workerDotOptional:r.css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f59e0b;
    margin-top: 5px;
    flex-shrink: 0;
  `,workerDetails:r.css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  `,workerNameRow:r.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,workerName:r.css`
    font-size: 0.78rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
  `,workerLang:r.css`
    font-size: 0.7rem;
    color: #00D2FF;
    font-family: monospace;
  `,workerDesc:r.css`
    font-size: 0.72rem;
    color: ${e.colors.text.secondary};
    line-height: 1.3;
  `,glowDesc:r.css`
    font-size: 0.8rem;
    color: ${e.colors.text.secondary};
    line-height: 1.4;
    margin-bottom: ${e.spacing(1.5)};
  `,btnGroupVertical:r.css`
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(1)};
  `}),g=({content:e})=>{const t=(0,l.useStyles2)(x),a=function(e){const t=e.split("\n"),a=[];let s=0;for(;s<t.length;){const e=t[s];if(e.trim().startsWith("```")){const n=e.trim().substring(3).trim(),r=[];for(s++;s<t.length&&!t[s].trim().startsWith("```");)r.push(t[s]),s++;s++,a.push({type:"code",language:n||"text",text:r.join("\n")});continue}if(e.trim().startsWith("|")&&e.trim().endsWith("|")&&s+1<t.length&&t[s+1].includes("---")){const n=e.split("|").slice(1,-1).map(e=>e.trim());s+=2;const r=[];for(;s<t.length&&t[s].trim().startsWith("|");){const e=t[s].split("|").slice(1,-1).map(e=>e.trim());r.push(e),s++}a.push({type:"table",headers:n,rows:r});continue}const n=e.match(/^(#{1,4})\s+(.*)$/);if(n){a.push({type:"header",level:n[1].length,text:n[2]}),s++;continue}if(/^\s*[-*]\s+/.test(e)){const e=[];for(;s<t.length&&/^\s*[-*]\s+/.test(t[s]);)e.push(t[s].replace(/^\s*[-*]\s+/,"")),s++;a.push({type:"list",items:e});continue}if(!e.trim()){s++;continue}const r=[];for(;s<t.length&&t[s].trim()&&!t[s].trim().startsWith("```")&&!t[s].match(/^(#{1,4})\s+/)&&!/^\s*[-*]\s+/.test(t[s])&&(!t[s].trim().startsWith("|")||!t[s].trim().endsWith("|"));)r.push(t[s]),s++;r.length>0&&a.push({type:"paragraph",text:r.join("\n")})}return a}(e);return n().createElement("div",{className:t.container},a.map((e,a)=>{switch(e.type){case"code":return n().createElement(h,{key:a,language:e.language||"text",code:e.text||""});case"header":return 1===e.level?n().createElement("h2",{key:a,className:t.h1},f(e.text,t)):2===e.level?n().createElement("h3",{key:a,className:t.h2},f(e.text,t)):n().createElement("h4",{key:a,className:t.h3},f(e.text,t));case"list":return n().createElement("ul",{key:a,className:t.list},(e.items||[]).map((e,a)=>n().createElement("li",{key:a,className:t.listItem},f(e,t))));case"table":return n().createElement(b,{key:a,headers:e.headers,rows:e.rows,styles:t});default:return n().createElement("p",{key:a,className:t.paragraph},f(e.text,t))}}))};function f(e,t){if(!e)return null;return e.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|🟢\s*[^,\n.]+|🟡\s*[^,\n.]+|🔴\s*[^,\n.]+)/g).map((e,a)=>{if(!e)return null;if(e.startsWith("`")&&e.endsWith("`"))return n().createElement("code",{key:a,className:t.inlineCode},e.slice(1,-1));if(e.startsWith("**")&&e.endsWith("**"))return n().createElement("strong",{key:a,className:t.strong},e.slice(2,-2));if(e.startsWith("*")&&e.endsWith("*"))return n().createElement("em",{key:a},e.slice(1,-1));if(e.startsWith("[")&&e.includes("](")){const s=e.match(/\[([^\]]+)\]\(([^)]+)\)/);if(s)return n().createElement("a",{key:a,href:s[2],target:"_blank",rel:"noopener noreferrer",className:t.link},s[1])}return e.startsWith("🟢")?n().createElement("span",{key:a,className:t.badgeNormal},e):e.startsWith("🟡")?n().createElement("span",{key:a,className:t.badgeWarning},e):e.startsWith("🔴")?n().createElement("span",{key:a,className:t.badgeCritical},e):e})}const h=({language:e,code:t})=>{const[a,r]=(0,s.useState)(!1),o=(0,l.useStyles2)(x);return n().createElement("div",{className:o.codeContainer},n().createElement("div",{className:o.codeHeader},n().createElement("span",{className:o.codeLang},e||"code"),n().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:a?"check":"copy",onClick:()=>{navigator.clipboard.writeText(t),r(!0),setTimeout(()=>r(!1),2e3)}},a?"Copied":"Copy")),n().createElement("pre",{className:o.codePre},n().createElement("code",null,t)))},b=({headers:e,rows:t,styles:a})=>e&&t?n().createElement("div",{className:a.tableWrapper},n().createElement("table",{className:a.table},n().createElement("thead",null,n().createElement("tr",null,e.map((e,t)=>n().createElement("th",{key:t},e)))),n().createElement("tbody",null,t.map((e,t)=>n().createElement("tr",{key:t},e.map((e,t)=>n().createElement("td",{key:t},f(e,a)))))))):null,x=e=>({container:r.css`
    font-size: ${e.typography.body.fontSize};
    line-height: 1.6;
    color: ${e.colors.text.primary};
  `,h1:r.css`
    font-size: 1.25rem;
    font-weight: 600;
    margin: ${e.spacing(2,0,1,0)};
    color: ${e.colors.primary.text};
    border-bottom: 1px solid ${e.colors.border.weak};
    padding-bottom: ${e.spacing(.5)};
  `,h2:r.css`
    font-size: 1.1rem;
    font-weight: 600;
    margin: ${e.spacing(1.5,0,.75,0)};
    color: ${e.colors.text.primary};
  `,h3:r.css`
    font-size: 0.95rem;
    font-weight: 600;
    margin: ${e.spacing(1,0,.5,0)};
    color: ${e.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,paragraph:r.css`
    margin-bottom: ${e.spacing(1.25)};
    white-space: pre-line;
  `,list:r.css`
    margin: ${e.spacing(.5,0,1.25,2)};
    padding: 0;
  `,listItem:r.css`
    margin-bottom: ${e.spacing(.5)};
  `,inlineCode:r.css`
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.85em;
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    padding: 2px 6px;
    border-radius: 4px;
    color: ${e.colors.primary.text};
  `,strong:r.css`
    font-weight: 600;
    color: ${e.colors.text.primary};
  `,link:r.css`
    color: ${e.colors.primary.text};
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  `,codeContainer:r.css`
    margin: ${e.spacing(1.5,0)};
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    overflow: hidden;
  `,codeHeader:r.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${e.spacing(.5,1.5)};
    background: ${e.colors.background.canvas};
    border-bottom: 1px solid ${e.colors.border.weak};
  `,codeLang:r.css`
    font-size: 0.75rem;
    font-family: ${e.typography.fontFamilyMonospace};
    text-transform: uppercase;
    color: ${e.colors.text.secondary};
    font-weight: 600;
  `,codePre:r.css`
    margin: 0;
    padding: ${e.spacing(1.5)};
    overflow-x: auto;
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: 0.85rem;
    line-height: 1.45;
  `,badgeNormal:r.css`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    font-weight: 600;
    font-size: 0.85em;
    border: 1px solid rgba(16, 185, 129, 0.3);
  `,badgeWarning:r.css`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
    font-weight: 600;
    font-size: 0.85em;
    border: 1px solid rgba(245, 158, 11, 0.3);
  `,badgeCritical:r.css`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    font-weight: 600;
    font-size: 0.85em;
    border: 1px solid rgba(239, 68, 68, 0.3);
  `,tableWrapper:r.css`
    overflow-x: auto;
    margin: ${e.spacing(1.5,0)};
  `,table:r.css`
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
  `});function y(e,t,a,s,n,r,o){try{var l=e[r](o),c=l.value}catch(e){return void a(e)}l.done?t(c):Promise.resolve(c).then(s,n)}function v(e){return function(){var t=this,a=arguments;return new Promise(function(s,n){var r=e.apply(t,a);function o(e){y(r,s,n,o,l,"next",e)}function l(e){y(r,s,n,o,l,"throw",e)}o(void 0)})}}function w(){return`${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function E(){return(new Date).toLocaleTimeString()}function k(){return Date.now()}function $(e){return e<1e3?`${e}ms`:`${(e/1e3).toFixed(2)}s`}const N=()=>{var e;const t=(0,l.useStyles2)(S),[a]=(0,s.useState)(()=>function(e){let t=null;try{t=window.localStorage.getItem(d(e))}catch(e){return null}if(!t)return null;try{const e=JSON.parse(t);return e&&1===e.schemaVersion&&Array.isArray(e.messages)?e:null}catch(e){return null}}(i.s_)),r=(0,s.useRef)(null!==(e=null==a?void 0:a.createdAt)&&void 0!==e?e:k()),u=(0,s.useRef)(!0),[f,h]=(0,s.useState)(()=>{var e;return null!==(e=null==a?void 0:a.messages)&&void 0!==e?e:[]}),[b,x]=(0,s.useState)(()=>{var e;return null!==(e=null==a?void 0:a.inputDraft)&&void 0!==e?e:""}),[y,N]=(0,s.useState)(()=>!!(null==a?void 0:a.inFlight)),[C,I]=(0,s.useState)(null),[A,z]=(0,s.useState)(null),[T,L]=(0,s.useState)(()=>(null==a?void 0:a.activeModel)||"aura-sre-model"),[M,R]=(0,s.useState)(null),[B,D]=(0,s.useState)(0),[F,O]=(0,s.useState)(()=>{var e;return null!==(e=null==a?void 0:a.inFlight)&&void 0!==e?e:null}),[P,W]=(0,s.useState)(()=>{var e;return null!==(e=null==a?void 0:a.contextId)&&void 0!==e?e:null}),V=(0,s.useRef)(null),j=(0,s.useRef)(null),G=(0,s.useRef)(null);(0,s.useEffect)(()=>(u.current=!0,()=>{u.current=!1}),[]),(0,s.useEffect)(()=>{!function(e,t){try{window.localStorage.setItem(d(e),JSON.stringify(t))}catch(e){}}(i.s_,{schemaVersion:1,messages:f,inputDraft:b,activeModel:T,contextId:P,createdAt:r.current,updatedAt:Date.now(),inFlight:F})},[f,b,T,P,F]),(0,s.useEffect)(()=>{var e;if(!y)return;const t=null!==(e=null==F?void 0:F.startedAt)&&void 0!==e?e:k(),a=()=>{D(k()-t)};a();const s=setInterval(a,500);return()=>{clearInterval(s)}},[y,null==F?void 0:F.startedAt]);(0,s.useEffect)(()=>{var e;null===(e=V.current)||void 0===e||e.scrollIntoView({behavior:"smooth"})},[f,y]),(0,s.useEffect)(()=>{let e=!0;const t=()=>v(function*(){try{const t=yield c.N.getHealth();e&&(I(t.data),z(t.latencyMs))}catch(t){e&&(I({status:"unreachable"}),z(null))}try{const t=yield c.N.getModels();e&&t.length>0&&L(t[0].id)}catch(e){}})(),a=setTimeout(t,0),s=setInterval(t,15e3);return()=>{e=!1,clearTimeout(a),clearInterval(s)}},[]);const U=(0,s.useCallback)(()=>{G.current&&(window.clearInterval(G.current),G.current=null)},[]),H=(0,s.useCallback)((e,t)=>v(function*(){try{const n=yield c.N.getA2aTask(e);if(!u.current)return;const r=n.status.state;if("completed"===r){U();const e=function(e){var t,a,s;const n=null===(a=e.artifacts)||void 0===a?void 0:a.find(e=>"final"===e.artifactId);if(n){const e=n.parts.filter(e=>"text"===e.kind).map(e=>e.text||"").join("\n");if(e)return e}const r=null===(s=e.artifacts)||void 0===s?void 0:s.flatMap(e=>e.parts).filter(e=>"text"===e.kind).map(e=>e.text||"").join("\n");if(r)return r;const o=[...null!==(t=e.history)&&void 0!==t?t:[]].reverse().find(e=>"agent"===e.role);return o?o.parts.filter(e=>"text"===e.kind).map(e=>e.text||"").join("\n"):""}(n),a={id:w(),role:"assistant",content:e||"(Investigation completed with no text output.)",timestamp:E(),elapsedMs:k()-t};h(e=>[...e,a]),O(null),N(!1),D(0)}else if("failed"===r||"canceled"===r||"rejected"===r){var a,s;U();const e=(null===(s=n.status.message)||void 0===s||null===(a=s.parts)||void 0===a?void 0:a.filter(e=>"text"===e.kind).map(e=>e.text||"").join("\n"))||`Investigation ${r}.`,o={id:w(),role:"assistant",content:`🔴 **Investigation Error**: ${e}`,timestamp:E(),isError:!0,elapsedMs:k()-t};h(e=>[...e,o]),O(null),N(!1),D(0)}}catch(e){}})(),[U]),_=(0,s.useCallback)((e,t)=>{G.current&&window.clearInterval(G.current),H(e,t),G.current=window.setInterval(()=>{H(e,t)},2500)},[H]);(0,s.useEffect)(()=>{const e=null==a?void 0:a.inFlight;if(!e)return;const t=window.setTimeout(()=>{_(e.taskId,e.startedAt)},0);return()=>{window.clearTimeout(t),U()}},[]);const q=e=>v(function*(){const t=(e||b).trim();if(!t||y)return;const a={id:w(),role:"user",content:t,timestamp:E()};h(e=>[...e,a]),x(""),N(!0);const s=k();try{const e=yield c.N.sendA2aMessage({messageId:a.id,text:t,contextId:P});if(!u.current)return;const n=e.id,r=e.contextId;r&&W(r),O({status:"running",taskId:n,contextId:r,prompt:t,startedAt:s}),_(n,s)}catch(e){if(!u.current)return;const t={id:w(),role:"assistant",content:`🔴 **Investigation Error**: ${e.message||"Unable to start the OpenSRE investigation."}`,timestamp:E(),isError:!0,elapsedMs:k()-s};h(e=>[...e,t]),N(!1),O(null),D(0)}})();return n().createElement(o.PluginPage,null,n().createElement("div",{className:t.pageContainer},n().createElement(m.g,{health:C,latencyMs:A,activeModel:T}),n().createElement("div",{className:t.layoutGrid},n().createElement("section",{className:t.workspace},n().createElement("div",{className:t.workspaceHeader},n().createElement("div",{className:t.workspaceTitleGroup},n().createElement(l.Icon,{name:"code-branch",className:t.iconBlue}),n().createElement("span",{className:t.workspaceTitle},"Autonomous SRE Investigation Console"),n().createElement(l.Badge,{text:"LIVE GATEWAY",color:"blue"})),n().createElement("div",{className:t.workspaceActions},n().createElement(l.Button,{size:"sm",variant:"secondary",fill:"outline",icon:"trash-alt",onClick:()=>{U(),function(e){try{window.localStorage.removeItem(d(e))}catch(e){}}(i.s_),r.current=k(),h([]),O(null),W(null),x(""),N(!1),D(0)},disabled:0===f.length&&!y},"Clear Console"))),n().createElement("div",{className:t.messagesFeed},0===f.length&&n().createElement("div",{className:t.welcomeCard},n().createElement("div",{className:t.welcomeHeader},n().createElement("div",{className:t.avatarAI},"SRE"),n().createElement("div",null,n().createElement("span",{className:t.welcomeSender},"OpenSRE AI Agent • Autonomous Production SRE"),n().createElement("h3",{className:t.welcomeTitle},"OpenSRE Online & Autonomous Telemetry Connected"))),n().createElement("div",{className:t.welcomeBody},n().createElement("p",null,"I am your autonomous ",n().createElement("strong",null,"OpenSRE Agent"),". I investigate production failures, trace anomalies, and perform root-cause analysis across your observability stack:"),n().createElement("ul",{className:t.welcomeList},n().createElement("li",null,n().createElement("strong",null,"VictoriaLogs Integration"),": Search log streams, error bursts & stack traces with LogSQL."),n().createElement("li",null,n().createElement("strong",null,"VictoriaMetrics TSDB"),": Query PromQL instant and range metrics for CPU/RAM and saturation spikes."),n().createElement("li",null,n().createElement("strong",null,"Grafana Integration"),": Inspect active alerts, firing rules, and provisioned datasource health."),n().createElement("li",null,n().createElement("strong",null,"LiteLLM Model Router"),": Powered by ",n().createElement("code",null,"aura-sre-model")," with Redis prompt caching.")),n().createElement("p",{className:t.welcomeHint},"Click one of the 1-click automated investigation prompts below, or type your custom incident query."))),f.map(e=>n().createElement("div",{key:e.id,className:"user"===e.role?t.messageRowUser:t.messageRowAssistant},n().createElement("div",{className:"user"===e.role?t.avatarUser:t.avatarAI},"user"===e.role?"YOU":"SRE"),n().createElement("div",{className:t.messageContent},n().createElement("div",{className:t.messageMeta},n().createElement("div",{className:t.metaLeft},n().createElement("span",{className:t.msgSender},"user"===e.role?"Operator":"OpenSRE AI Agent"),n().createElement("span",{className:t.msgTime},e.timestamp),void 0!==e.elapsedMs&&n().createElement("span",{className:t.elapsedBadge,title:`Investigation completed in ${$(e.elapsedMs)} (${e.elapsedMs} ms)`},n().createElement(l.Icon,{name:"clock-nine",size:"xs"}),n().createElement("span",null,$(e.elapsedMs)))),"assistant"===e.role&&n().createElement("div",{className:t.metaActions},e.isError&&n().createElement(l.Button,{size:"xs",variant:"primary",fill:"outline",icon:"play",onClick:()=>(e=>{var t;if(y)return;const a=f.findIndex(t=>t.id===e),s=null===(t=f.slice(0,a).reverse().find(e=>"user"===e.role))||void 0===t?void 0:t.content;s&&q(s)})(e.id),className:t.copyBtn,disabled:y},"Retry"),n().createElement(l.Button,{size:"xs",variant:"secondary",fill:"outline",icon:M===e.id?"check":"copy",onClick:()=>{return t=e.id,a=e.content,navigator.clipboard.writeText(a),R(t),void setTimeout(()=>{R(e=>e===t?null:e)},2e3);var t,a},className:t.copyBtn},M===e.id?"Copied":"Copy Investigation"))),n().createElement("div",{className:"user"===e.role?t.bubbleUser:t.bubbleAssistant},"user"===e.role?n().createElement("p",{className:t.userText},e.content):n().createElement(g,{content:e.content}))))),y&&n().createElement("div",{className:t.messageRowAssistant},n().createElement("div",{className:t.avatarAI},"SRE"),n().createElement("div",{className:t.messageContent},n().createElement("div",{className:t.messageMeta},n().createElement("div",{className:t.metaLeft},n().createElement("span",{className:t.msgSender},"OpenSRE AI Agent"),n().createElement("span",{className:t.elapsedBadgeActive,title:"Investigation in progress"},n().createElement(l.Icon,{name:"clock-nine",size:"xs"}),n().createElement("span",null,$(B))))),n().createElement("div",{className:t.thinkingBubble},n().createElement(l.Spinner,{size:18,inline:!0}),n().createElement("span",{className:t.thinkingText},"OpenSRE investigating incident across VictoriaMetrics, VictoriaLogs & Grafana...")))),n().createElement("div",{ref:V})),n().createElement("div",{className:t.quickChipsBar},n().createElement("span",{className:t.quickChipsLabel},"1-Click Automated Investigations:"),n().createElement("div",{className:t.chipsScroll},i.EP.map(e=>n().createElement("button",{key:e.id,className:t.quickChip,onClick:()=>q(e.prompt),disabled:y,title:e.prompt},n().createElement("span",null,e.title))))),n().createElement("div",{className:t.inputBar},n().createElement("div",{className:t.inputWrapper},n().createElement("textarea",{ref:j,className:t.textarea,rows:2,value:b,placeholder:"Ask OpenSRE to investigate an incident, analyze logs, or query metrics... [Press Enter to send, Shift+Enter for newline]",onChange:e=>x(e.target.value),onKeyDown:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),q())},disabled:y})),n().createElement(l.Button,{variant:"primary",size:"md",icon:y?void 0:"arrow-right",onClick:()=>q(),disabled:!b.trim()||y},y?"Investigating...":"Investigate"))),n().createElement(p,{health:C,latencyMs:A}))))},C=N,S=e=>({pageContainer:r.css`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: calc(100vh - 120px);
  `,layoutGrid:r.css`
    display: flex;
    gap: ${e.spacing(2)};
    align-items: flex-start;
    @media (max-width: 1024px) {
      flex-direction: column;
    }
  `,workspace:r.css`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: ${e.colors.background.primary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    box-shadow: ${e.shadows.z1};
    overflow: hidden;
  `,workspaceHeader:r.css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${e.spacing(1,2)};
    background: ${e.colors.background.secondary};
    border-bottom: 1px solid ${e.colors.border.weak};
  `,workspaceTitleGroup:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `,workspaceTitle:r.css`
    font-size: 0.95rem;
    font-weight: 700;
    color: ${e.colors.text.primary};
  `,iconBlue:r.css`
    color: #3b82f6;
  `,workspaceActions:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
  `,messagesFeed:r.css`
    flex: 1;
    min-height: 480px;
    max-height: 620px;
    overflow-y: auto;
    padding: ${e.spacing(2)};
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(2)};
    background: ${e.colors.background.canvas};
  `,welcomeCard:r.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(2)};
    box-shadow: ${e.shadows.z1};
  `,welcomeHeader:r.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(1.5)};
    margin-bottom: ${e.spacing(1.5)};
  `,welcomeSender:r.css`
    font-size: 0.75rem;
    color: ${e.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,welcomeTitle:r.css`
    font-size: 1.1rem;
    font-weight: 700;
    color: #38bdf8;
    margin: 2px 0 0 0;
  `,welcomeBody:r.css`
    font-size: 0.875rem;
    line-height: 1.6;
    color: ${e.colors.text.primary};
  `,welcomeList:r.css`
    margin: ${e.spacing(1,0,1.5,2.5)};
    padding: 0;
    li {
      margin-bottom: 6px;
    }
  `,welcomeHint:r.css`
    font-size: 0.8rem;
    color: ${e.colors.text.secondary};
    margin: 0;
  `,messageRowUser:r.css`
    display: flex;
    gap: ${e.spacing(1.5)};
    align-self: flex-end;
    max-width: 85%;
    flex-direction: row-reverse;
  `,messageRowAssistant:r.css`
    display: flex;
    gap: ${e.spacing(1.5)};
    align-self: flex-start;
    max-width: 95%;
  `,avatarAI:r.css`
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
  `,avatarUser:r.css`
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
  `,messageContent:r.css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    width: 100%;
  `,messageMeta:r.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    min-height: 24px;
  `,metaLeft:r.css`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  `,metaActions:r.css`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
  `,elapsedBadge:r.css`
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
  `,elapsedBadgeActive:r.css`
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
  `,copyBtn:r.css`
    font-size: 0.7rem;
    padding: 2px 8px;
    height: 22px;
  `,msgSender:r.css`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${e.colors.text.secondary};
  `,msgTime:r.css`
    font-size: 0.7rem;
    color: ${e.colors.text.disabled};
  `,bubbleUser:r.css`
    background: ${e.colors.primary.main};
    color: ${e.colors.primary.contrastText};
    padding: ${e.spacing(1,1.5)};
    border-radius: ${e.shape.radius.default};
    border-top-right-radius: 0;
    font-size: 0.9rem;
    box-shadow: ${e.shadows.z1};
  `,userText:r.css`
    margin: 0;
    white-space: pre-wrap;
  `,bubbleAssistant:r.css`
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    padding: ${e.spacing(1.5)};
    border-radius: ${e.shape.radius.default};
    border-top-left-radius: 0;
    box-shadow: ${e.shadows.z1};
  `,thinkingBubble:r.css`
    display: flex;
    align-items: center;
    gap: 10px;
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-left: 3px solid #38bdf8;
    padding: ${e.spacing(1.25,1.5)};
    border-radius: ${e.shape.radius.default};
  `,thinkingText:r.css`
    font-size: 0.85rem;
    color: #38bdf8;
    font-family: ${e.typography.fontFamilyMonospace};
  `,quickChipsBar:r.css`
    padding: ${e.spacing(1,2)};
    background: ${e.colors.background.secondary};
    border-top: 1px solid ${e.colors.border.weak};
    display: flex;
    align-items: center;
    gap: ${e.spacing(1)};
    flex-wrap: wrap;
  `,quickChipsLabel:r.css`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${e.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,chipsScroll:r.css`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  `,quickChip:r.css`
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
  `,inputBar:r.css`
    display: flex;
    align-items: flex-end;
    gap: ${e.spacing(1.5)};
    padding: ${e.spacing(1.5,2)};
    background: ${e.colors.background.secondary};
    border-top: 1px solid ${e.colors.border.weak};
  `,inputWrapper:r.css`
    flex: 1;
  `,textarea:r.css`
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
//# sourceMappingURL=18.js.map?_cache=ba4c6bac4d578f9b83b1