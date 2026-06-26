/* Escalas IBC 4.0 - arquitetura limpa */
const INITIAL_DATA = {"version": "4.0.0", "church": "Igreja Batista do Cordeiro", "roles": ["Dirigente", "Violão", "Contra", "Piano", "Flauta", "Back Vocal", "Mesa de Som", "Transmissão", "Projeção", "Multimídia"], "people": [{"id": "jaime-leite", "name": "Jaime Leite", "phone": "", "email": "", "active": true, "roles": ["Dirigente"], "mainRole": "Dirigente", "availability": "", "notes": ""}, {"id": "joel-leite", "name": "Joel Leite", "phone": "", "email": "", "active": true, "roles": ["Violão"], "mainRole": "Violão", "availability": "", "notes": ""}, {"id": "ana-d-bora", "name": "Ana Débora", "phone": "", "email": "", "active": true, "roles": ["Piano", "Back Vocal"], "mainRole": "Piano", "availability": "", "notes": ""}, {"id": "israel-ribeiro", "name": "Israel Ribeiro", "phone": "", "email": "", "active": true, "roles": ["Dirigente", "Violão", "Mesa de Som"], "mainRole": "Dirigente", "availability": "", "notes": ""}, {"id": "paulo-de-tarso", "name": "Paulo de Tarso", "phone": "", "email": "", "active": true, "roles": ["Violão", "Contra", "Mesa de Som"], "mainRole": "Violão", "availability": "", "notes": ""}, {"id": "naassom", "name": "Naassom", "phone": "", "email": "", "active": true, "roles": ["Flauta"], "mainRole": "Flauta", "availability": "", "notes": ""}, {"id": "f-bio-filemon", "name": "Fábio Filemon", "phone": "", "email": "", "active": true, "roles": ["Dirigente", "Violão"], "mainRole": "Dirigente", "availability": "", "notes": ""}, {"id": "isabel-ribeiro", "name": "Isabel Ribeiro", "phone": "", "email": "", "active": true, "roles": ["Back Vocal"], "mainRole": "Back Vocal", "availability": "", "notes": ""}, {"id": "levi-ribeiro", "name": "Levi Ribeiro", "phone": "", "email": "", "active": true, "roles": ["Dirigente", "Violão", "Flauta"], "mainRole": "Dirigente", "availability": "", "notes": ""}, {"id": "levi-gama", "name": "Levi Gama", "phone": "", "email": "", "active": true, "roles": ["Violão", "Flauta"], "mainRole": "Violão", "availability": "", "notes": ""}, {"id": "fl-vio-anderson", "name": "Flávio Anderson", "phone": "", "email": "", "active": true, "roles": ["Dirigente"], "mainRole": "Dirigente", "availability": "", "notes": ""}], "songs": [], "months": {"2026-06": {"theme": "Fazendo Deus conhecido", "verse": "Atos 17.15-31", "dates": ["07", "14", "21", "28"], "cells": {"28|Dirigente": ["Flávio Anderson"], "28|Violão": ["Israel Ribeiro"], "28|Contra": ["Paulo de Tarso"], "28|Flauta": ["Naassom"], "28|Back Vocal": ["Ana Débora"]}, "songs": {}}, "2026-01": {"theme": "", "verse": "", "dates": ["04", "11", "18", "25"], "cells": {}, "songs": {"28": []}}}, "current": {"m": 5, "y": 2026}};
const STORE_KEY = 'ESCALAS_IBC_V4_DATA';
const OLD_KEYS = ['ESCALAS_IBC_DB_V31','ESCALAS_IBC_DB_V30','ESCALAS_IBC_DB_V22','escalas_ibc_v11_multi'];
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const $ = sel => document.querySelector(sel);
let state = loadState();
let route = 'home';
let currentMonth = getCurrentMonthId();
let editingPerson = null;
let personTab = 'dados';

function clone(x){return JSON.parse(JSON.stringify(x));}
function uid(){return Math.random().toString(36).slice(2,10);}
function toast(msg){const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1700);}
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim();}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function list(v){if(Array.isArray(v))return v.filter(Boolean); return String(v||'').split(/[,;]/).map(x=>x.trim()).filter(Boolean);}
function normalizeData(data){
  if(!data) return clone(INITIAL_DATA);
  const result = clone(INITIAL_DATA);
  result.version = '4.0.0';
  result.church = data.church || data.config?.church || result.church;
  result.roles = data.roles || data.config?.roles || result.roles;
  result.people = (data.people||[]).map(p => typeof p==='string' ? {id:uid(),name:p,active:true,roles:[]} : ({
    id:p.id||uid(), name:p.name||p.nome||'', phone:p.phone||p.telefone||'', email:p.email||'', active:p.active!==false,
    roles:list(p.roles||p.funcoes), mainRole:p.mainRole||'', availability:p.availability||'', notes:p.notes||p.observacoes||p.obs||''
  })).filter(p=>p.name);
  result.songs = data.songs || data.music || data.musicas || [];
  result.months = data.months || data.scales || result.months;
  Object.values(result.months).forEach(m=>{
    m.theme = String(m.theme||'').replace('Tema:','').trim();
    m.verse = String(m.verse||m.text||'').replace('📖 Texto base:','').trim();
    m.dates = m.dates || [];
    m.cells = m.cells || {};
    Object.keys(m.cells).forEach(k => m.cells[k] = list(m.cells[k]));
    m.songs = m.songs || {};
  });
  result.current = data.current || result.current;
  return result;
}
function loadState(){
  const raw=localStorage.getItem(STORE_KEY);
  if(raw){try{return normalizeData(JSON.parse(raw));}catch(e){}}
  for(const k of OLD_KEYS){const old=localStorage.getItem(k); if(old){try{const migrated=normalizeData(JSON.parse(old)); localStorage.setItem(STORE_KEY,JSON.stringify(migrated)); return migrated;}catch(e){}}}
  localStorage.setItem(STORE_KEY, JSON.stringify(INITIAL_DATA));
  return clone(INITIAL_DATA);
}
function save(){localStorage.setItem(STORE_KEY, JSON.stringify(state));}
function getCurrentMonthId(){const c=state.current||{m:new Date().getMonth(),y:new Date().getFullYear()}; return c.y+'-'+String(c.m+1).padStart(2,'0');}
function monthLabel(id){const [y,m]=id.split('-').map(Number); return MONTHS[m-1]+' / '+y;}
function sundays(y,m){const d=new Date(y,m-1,1), arr=[]; while(d.getMonth()===m-1){if(d.getDay()===0)arr.push(String(d.getDate()).padStart(2,'0')); d.setDate(d.getDate()+1);} return arr.length?arr:['07','14','21','28'];}
function ensureMonth(id=currentMonth){if(!state.months[id]){const [y,m]=id.split('-').map(Number); state.months[id]={theme:'',verse:'',dates:sundays(y,m),cells:{},songs:{}}; save();} return state.months[id];}
function setRoute(r){route=r; document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.route===r)); render(); window.scrollTo(0,0);}
function render(){
  if(route==='home') renderHome();
  if(route==='scale') renderScale();
  if(route==='people') renderPeople();
  if(route==='songs') renderSongsPage();
  if(route==='settings') renderSettings();
}
function renderHome(){const ids=Object.keys(state.months).sort(); const m=ensureMonth(); const filled=Object.values(m.cells).filter(v=>v&&v.length).length; $('#view').innerHTML=`
  <div class="page-title"><div><h2>Início</h2><div class="small">Escala simples, estável e funcional</div></div><button class="btn small-btn" data-action="share-app">↗ App</button></div>
  <div class="card"><div class="stats"><div class="stat"><strong>${state.people.length}</strong><span>Participantes</span></div><div class="stat"><strong>${MONTHS[state.current.m]}</strong><span>Mês</span></div><div class="stat"><strong>${filled}</strong><span>Escalados</span></div></div><div class="button-grid"><button class="btn" data-route="scale">Montar escala</button><button class="btn secondary" data-route="people">Participantes</button></div></div>
  <div class="card"><div class="page-title" style="margin-top:0"><strong>Meses</strong><button class="btn small-btn" data-action="new-month">+ Mês</button></div>${ids.map(id=>`<div class="month" data-month="${id}"><div><div class="title">${monthLabel(id)}</div><div class="sub">${esc(state.months[id].theme||'Sem tema definido')}</div></div><b>›</b></div>`).join('')}</div>`;}
function renderScale(){const m=ensureMonth(); $('#view').innerHTML=`
  <div class="page-title"><button class="btn secondary small-btn" data-route="home">← Voltar</button><h2>${monthLabel(currentMonth)}</h2><button class="btn secondary small-btn" data-action="share-scale">WhatsApp</button></div>
  <div class="card"><label>Tema</label><input id="theme" value="${esc(m.theme)}"><label>Texto base</label><input id="verse" value="${esc(m.verse)}"></div>
  <div class="card"><div class="page-title" style="margin-top:0"><strong>Domingos e funções</strong><button class="btn secondary small-btn" data-action="open-songs">Músicas</button></div>${m.dates.map(day=>renderDayCard(day,m)).join('')}<div class="button-grid"><button class="btn" data-action="save-scale">Salvar</button><button class="btn secondary" data-action="duplicate-month">Duplicar</button><button class="btn secondary" data-action="copy-scale">Copiar</button><button class="btn" data-action="share-scale">WhatsApp</button><button class="btn secondary" data-action="download-image">Imagem</button><button class="btn secondary" data-action="show-mural">Ver mural</button></div></div><div id="muralSlot"></div>`;}
function renderDayCard(day,m){return `<section class="day-card"><div class="day-head"><b>Dia ${day}</b><button class="btn small-btn secondary" data-action="edit-day-songs" data-day="${day}">Músicas</button></div>${state.roles.map(role=>{const vals=m.cells[day+'|'+role]||[];return `<div class="role-line"><div class="role-name">${esc(role)}</div><div class="chips">${vals.length?vals.map(n=>`<span class="chip">${esc(n)}</span>`).join(''):'<span class="empty">Sem escala</span>'}</div><button class="btn small-btn" data-action="select-role" data-day="${day}" data-role="${esc(role)}">+</button></div>`;}).join('')}</section>`;}
function renderPeople(){$('#view').innerHTML=`<div class="page-title"><div><h2>Participantes</h2><div class="small">Cadastro com múltiplas funções</div></div><button class="btn small-btn" data-action="new-person">+ Novo</button></div><div class="card"><input id="peopleSearch" placeholder="Buscar participante..."></div><div id="peopleList" class="card">${peopleRows(state.people)}</div>`; $('#peopleSearch').addEventListener('input',e=>{const q=norm(e.target.value); $('#peopleList').innerHTML=peopleRows(state.people.filter(p=>norm(p.name).includes(q)||norm((p.roles||[]).join(' ')).includes(q)));});}
function peopleRows(arr){return arr.map(p=>`<div class="row"><div class="avatar">${esc((p.name||'?')[0])}</div><div class="grow"><div class="title">${esc(p.name)}</div><div class="sub">${esc((p.roles||[]).join(', ')||'Sem função')}</div></div><button class="icon-btn" data-action="edit-person" data-id="${p.id}">⋮</button></div>`).join('')||'<div class="small">Nenhum participante.</div>';}
function renderSongsPage(){$('#view').innerHTML=`<div class="page-title"><div><h2>Músicas</h2><div class="small">Repertório básico</div></div><button class="btn small-btn" data-action="new-song">+ Nova</button></div><div class="card">${(state.songs||[]).map((s,i)=>`<div class="row"><div class="avatar">♪</div><div class="grow"><div class="title">${esc(s.name)}</div><div class="sub">Tom: ${esc(s.key||s.tom||'-')}</div></div><button class="icon-btn" data-action="delete-song" data-index="${i}">⋮</button></div>`).join('')||'<div class="small">Nenhuma música cadastrada.</div>'}</div>`;}
function renderSettings(){$('#view').innerHTML=`<div class="page-title"><div><h2>Configurações</h2><div class="small">Funções, backup e publicação</div></div></div><div class="card"><label>Funções da escala</label><textarea id="rolesTxt" rows="6">${state.roles.map(esc).join('\\n')}</textarea><button class="btn" style="width:100%;margin-top:10px" data-action="save-roles">Salvar funções</button></div><div class="card"><button class="btn" style="width:100%" data-action="share-app">Compartilhar app</button><button class="btn secondary" style="width:100%;margin-top:8px" data-action="export-backup">Exportar backup</button><label>Importar backup</label><input type="file" id="importBackup" accept=".json"><button class="btn danger" style="width:100%;margin-top:8px" data-action="clear-all">Limpar tudo</button></div><div class="card small">Versão 4.0: seleção refeita sem tabela editável para eliminar travamentos no celular.</div>`; $('#importBackup').addEventListener('change',importBackup);}
function selectRole(day,role){const m=ensureMonth(); const selected=m.cells[day+'|'+role]||[]; let only=state.people.filter(p=>p.active!==false&&(p.roles||[]).some(r=>norm(r)===norm(role))); if(!only.length)only=state.people.filter(p=>p.active!==false); openSheet(`<h3>${esc(role)} · dia ${day}</h3><input id="personSearch" placeholder="Buscar..." style="margin:8px 0 10px"><div id="personOptions"></div><button class="btn" style="width:100%;margin-top:10px" data-action="apply-role" data-day="${day}" data-role="${esc(role)}">Salvar função</button><button class="btn secondary" style="width:100%;margin-top:8px" data-action="clear-role" data-day="${day}" data-role="${esc(role)}">Limpar</button>`); const renderOpts=()=>{const q=norm($('#personSearch').value); $('#personOptions').innerHTML=only.filter(p=>norm(p.name).includes(q)||norm((p.roles||[]).join(' ')).includes(q)).map(p=>`<label class="check"><input type="checkbox" value="${esc(p.name)}" ${selected.includes(p.name)?'checked':''}> <span>${esc(p.name)}<br><span class="small">${esc((p.roles||[]).join(', ')||'Sem função')}</span></span></label>`).join('')||'<div class="small">Nenhum participante encontrado.</div>';}; renderOpts(); $('#personSearch').addEventListener('input',renderOpts);}
function applyRole(day,role){const vals=[...document.querySelectorAll('#personOptions input:checked')].map(i=>i.value); ensureMonth().cells[day+'|'+role]=vals; save(); closeSheet(); renderScale(); toast('Escala atualizada');}
function openPerson(id=null){editingPerson=id?state.people.find(p=>p.id===id):{id:uid(),name:'',phone:'',email:'',active:true,roles:[],mainRole:'',availability:'',notes:''}; personTab='dados'; renderPersonSheet();}
function renderPersonSheet(){const p=editingPerson; const tabs=['dados','funcoes','disp','obs'].map(t=>`<button class="btn secondary ${personTab===t?'active':''}" data-action="person-tab" data-tab="${t}">${t==='disp'?'Dispon.':t}</button>`).join(''); let body=''; if(personTab==='dados')body=`<label>Nome</label><input id="pName" value="${esc(p.name)}"><label>Telefone / WhatsApp</label><input id="pPhone" value="${esc(p.phone||'')}"><label>E-mail</label><input id="pEmail" value="${esc(p.email||'')}"><label>Status</label><select id="pActive"><option value="true" ${p.active!==false?'selected':''}>Ativo</option><option value="false" ${p.active===false?'selected':''}>Inativo</option></select>`; if(personTab==='funcoes')body=state.roles.map(r=>`<label class="check"><input type="checkbox" class="pRole" value="${esc(r)}" ${(p.roles||[]).includes(r)?'checked':''}> <span>${esc(r)}</span></label>`).join(''); if(personTab==='disp')body=`<label>Disponibilidade</label><textarea id="pAvail" rows="5">${esc(p.availability||'')}</textarea>`; if(personTab==='obs')body=`<label>Observações</label><textarea id="pNotes" rows="5">${esc(p.notes||'')}</textarea>`; openSheet(`<h3>${p.name?'Editar participante':'Novo participante'}</h3><div class="inner-tabs">${tabs}</div>${body}<button class="btn" style="width:100%;margin-top:12px" data-action="save-person">Salvar participante</button>${p.name?`<button class="btn danger" style="width:100%;margin-top:8px" data-action="delete-person" data-id="${p.id}">Excluir</button>`:''}`);}
function savePerson(){const p=editingPerson; const name=$('#pName'); if(name)p.name=name.value.trim(); const ph=$('#pPhone'); if(ph)p.phone=ph.value.trim(); const em=$('#pEmail'); if(em)p.email=em.value.trim(); const ac=$('#pActive'); if(ac)p.active=ac.value==='true'; const roles=[...document.querySelectorAll('.pRole')]; if(roles.length)p.roles=roles.filter(c=>c.checked).map(c=>c.value); const av=$('#pAvail'); if(av)p.availability=av.value; const no=$('#pNotes'); if(no)p.notes=no.value; if(!p.name)return alert('Informe o nome.'); const idx=state.people.findIndex(x=>x.id===p.id); if(idx>=0)state.people[idx]=p; else state.people.push(p); save(); closeSheet(); renderPeople();}
function openSongsForDay(day){const m=ensureMonth(); const selected=(m.songs[day]||[]).map(x=>x.name||x); openSheet(`<h3>Músicas · dia ${day}</h3>${(state.songs||[]).map(s=>`<label class="check"><input type="checkbox" value="${esc(s.name)}" ${selected.includes(s.name)?'checked':''}> <span>${esc(s.name)}<br><span class="small">Tom: ${esc(s.key||s.tom||'-')}</span></span></label>`).join('')||'<div class="small">Cadastre músicas primeiro.</div>'}<button class="btn" style="width:100%;margin-top:10px" data-action="save-day-songs" data-day="${day}">Salvar músicas</button>`);}
function textScale(){
  const m=ensureMonth();
  let out='*ESCALAS IBC - '+monthLabel(currentMonth)+'*\n';
  if(m.theme) out += 'Tema: '+m.theme+'\n';
  if(m.verse) out += 'Texto base: '+m.verse+'\n';
  out += '\n';
  m.dates.forEach(day=>{
    out += '*Dia '+day+'*\n';
    state.roles.forEach(role=>{
      const vals=m.cells[day+'|'+role]||[];
      out += role+': '+(vals.join(', ')||'-')+'\n';
    });
    const songs=(m.songs[day]||[]).map(x=>x.name||x);
    if(songs.length) out += 'Músicas: '+songs.join(', ')+'\n';
    out += '\n';
  });
  return out;
}
async function copyScale(){try{await navigator.clipboard.writeText(textScale());toast('Texto copiado');}catch(e){alert(textScale());}}
function shareScale(){const txt=textScale(); if(navigator.share)navigator.share({title:'Escalas IBC',text:txt}).catch(()=>{}); else location.href='https://wa.me/?text='+encodeURIComponent(txt);}
function shareApp(){const txt='Escalas IBC - app de escalas da Igreja Batista do Cordeiro'; if(navigator.share)navigator.share({title:'Escalas IBC',text:txt,url:location.href}).catch(()=>{}); else location.href='https://wa.me/?text='+encodeURIComponent(txt+' '+location.href);}
function buildMural(){const m=ensureMonth(); let h=`<div class="mural"><div class="mural-head"><div class="mural-logo"><img src="assets/logo.webp"></div><div class="mural-title">Mês de ${monthLabel(currentMonth)}</div><div class="mural-theme">Tema: ${esc(m.theme)}<br><span style="font-size:13px">${esc(m.verse)}</span></div></div><table><tr><th>Data</th>${state.roles.map(r=>`<th>${esc(r)}</th>`).join('')}</tr>`; m.dates.forEach(day=>{h+=`<tr><td><b>${day}</b></td>${state.roles.map(role=>`<td>${(m.cells[day+'|'+role]||[]).map(esc).join('<br>')||'-'}</td>`).join('')}</tr>`;}); return h+'</table></div>';}
function exportBackup(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='backup_escalas_ibc_v4.json'; a.click();}
function importBackup(e){const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{try{state=normalizeData(JSON.parse(r.result)); save(); toast('Backup importado'); render();}catch(err){alert('Backup inválido.')}}; r.readAsText(f);}
function openSheet(html){$('#sheet').innerHTML=html; $('#modal').classList.add('open');}
function closeSheet(){$('#modal').classList.remove('open'); $('#sheet').innerHTML='';}
function createMonth(){const now=new Date(); openSheet(`<h3>Novo mês</h3><label>Mês</label><select id="newMonthSel">${MONTHS.map((m,i)=>`<option value="${i+1}" ${i===now.getMonth()?'selected':''}>${m}</option>`).join('')}</select><label>Ano</label><input id="newYear" type="number" value="${now.getFullYear()}"><button class="btn" style="width:100%;margin-top:12px" data-action="confirm-new-month">Criar</button>`);}
function duplicateMonth(){const [y,m]=currentMonth.split('-').map(Number); let nm=m+1, ny=y; if(nm>12){nm=1;ny++;} const id=ny+'-'+String(nm).padStart(2,'0'); const copy=clone(ensureMonth()); copy.dates=sundays(ny,nm); copy.cells={}; state.months[id]=copy; currentMonth=id; state.current={m:nm-1,y:ny}; save(); renderScale(); toast('Mês duplicado');}
function downloadImage(){const m=ensureMonth(); const W=1200,H=220+m.dates.length*95,c=document.createElement('canvas'); c.width=W;c.height=H; const ctx=c.getContext('2d'); ctx.fillStyle='#f7f7f7';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#000';ctx.lineWidth=3;ctx.strokeRect(0,0,W,H);ctx.fillStyle='#000';ctx.fillRect(0,0,150,140); const img=new Image(); img.src='assets/logo.webp'; img.onload=()=>{try{ctx.drawImage(img,25,20,100,100)}catch(e){} drawCanvasRest(ctx,c,W,H,m);}; img.onerror=()=>drawCanvasRest(ctx,c,W,H,m);}
function drawCanvasRest(ctx,c,W,H,m){ctx.fillStyle='#000';ctx.textAlign='center';ctx.font='bold 54px Arial';ctx.fillText('Mês de '+monthLabel(currentMonth),660,70);ctx.font='bold 34px Arial';ctx.fillText('Tema: '+(m.theme||''),660,125);ctx.font='bold 23px Arial';ctx.fillText(m.verse||'',660,166); const cols=['Data'].concat(state.roles),cw=W/cols.length; let y=210,rh=95; ctx.fillStyle='#0b361c';ctx.fillRect(0,y,W,54);ctx.fillStyle='#fff';ctx.font='bold 18px Arial';cols.forEach((col,i)=>ctx.fillText(col,i*cw+cw/2,y+34));y+=54;m.dates.forEach(day=>{ctx.fillStyle='#fff';ctx.fillRect(0,y,W,rh);ctx.strokeStyle='#333';for(let i=0;i<=cols.length;i++){ctx.beginPath();ctx.moveTo(i*cw,y);ctx.lineTo(i*cw,y+rh);ctx.stroke();}ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();ctx.fillStyle='#000';ctx.font='bold 30px Arial';ctx.fillText(day,cw/2,y+57);ctx.font='bold 19px Arial';state.roles.forEach((role,ri)=>ctx.fillText((m.cells[day+'|'+role]||['-']).join(' / '),(ri+1)*cw+cw/2,y+50));y+=rh;}); const a=document.createElement('a'); a.download='Escalas_IBC_'+currentMonth+'.png'; a.href=c.toDataURL('image/png'); a.click();}

document.addEventListener('click',e=>{
 const nav=e.target.closest('[data-route]'); if(nav)return setRoute(nav.dataset.route);
 const act=e.target.closest('[data-action]'); if(!act)return;
 const a=act.dataset.action;
 if(a==='new-month')return createMonth();
 if(a==='share-app')return shareApp();
 if(a==='share-scale')return shareScale();
 if(a==='save-scale'){const m=ensureMonth();m.theme=$('#theme').value;m.verse=$('#verse').value;save();toast('Escala salva');return;}
 if(a==='duplicate-month')return duplicateMonth();
 if(a==='copy-scale')return copyScale();
 if(a==='show-mural'){$('#muralSlot').innerHTML=buildMural();return;}
 if(a==='download-image')return downloadImage();
 if(a==='select-role')return selectRole(act.dataset.day,act.dataset.role);
 if(a==='apply-role')return applyRole(act.dataset.day,act.dataset.role);
 if(a==='clear-role'){ensureMonth().cells[act.dataset.day+'|'+act.dataset.role]=[];save();closeSheet();renderScale();return;}
 if(a==='new-person')return openPerson();
 if(a==='edit-person')return openPerson(act.dataset.id);
 if(a==='person-tab'){personTab=act.dataset.tab;return renderPersonSheet();}
 if(a==='save-person')return savePerson();
 if(a==='delete-person'){if(confirm('Excluir participante?')){state.people=state.people.filter(p=>p.id!==act.dataset.id);save();closeSheet();renderPeople();}return;}
 if(a==='new-song'){openSheet('<h3>Nova música</h3><label>Nome</label><input id="songName"><label>Tom</label><input id="songKey"><button class="btn" style="width:100%;margin-top:12px" data-action="save-song">Adicionar</button>');return;}
 if(a==='save-song'){const n=$('#songName').value.trim(); if(n){state.songs.push({id:uid(),name:n,key:$('#songKey').value.trim()});save();closeSheet();renderSongsPage();}return;}
 if(a==='delete-song'){if(confirm('Excluir música?')){state.songs.splice(Number(act.dataset.index),1);save();renderSongsPage();}return;}
 if(a==='edit-day-songs')return openSongsForDay(act.dataset.day);
 if(a==='open-songs'){openSheet('<h3>Escolha o dia</h3>'+ensureMonth().dates.map(d=>`<button class="btn secondary" style="width:100%;margin:5px 0" data-action="edit-day-songs" data-day="${d}">Dia ${d}</button>`).join(''));return;}
 if(a==='save-day-songs'){const day=act.dataset.day; ensureMonth().songs[day]=[...document.querySelectorAll('#sheet input:checked')].map(i=>({name:i.value}));save();closeSheet();toast('Músicas salvas');return;}
 if(a==='save-roles'){state.roles=$('#rolesTxt').value.split('\\n').map(x=>x.trim()).filter(Boolean);save();toast('Funções salvas');renderSettings();return;}
 if(a==='export-backup')return exportBackup();
 if(a==='clear-all'){if(confirm('Apagar tudo?')){localStorage.removeItem(STORE_KEY);state=clone(INITIAL_DATA);save();render();}return;}
 if(a==='confirm-new-month'){const id=$('#newYear').value+'-'+String($('#newMonthSel').value).padStart(2,'0');currentMonth=id; const [y,m]=id.split('-').map(Number); state.current={m:m-1,y}; ensureMonth(id);save();closeSheet();setRoute('scale');return;}
});
document.addEventListener('input',e=>{if(e.target.id==='theme'){ensureMonth().theme=e.target.value;save();} if(e.target.id==='verse'){ensureMonth().verse=e.target.value;save();}});
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeSheet();});
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
setRoute('home');
