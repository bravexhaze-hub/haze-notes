(()=>{
'use strict';
const $=selector=>document.querySelector(selector);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let notes=[],category='All';
const lookup=id=>notes.find(x=>x.id===id);
function validPost(n){return n&&typeof n.id==='string'&&typeof n.title==='string'&&typeof n.body==='string'&&['Reviews','Culture','Gear','Field Notes'].includes(n.category)}
function art(n,i){const img=n.image?` style="background-image:url('${esc(n.image)}')"`:'';return `<div class="art ${n.image?'has-photo':'art-'+['one','two','three'][i%3]}"${img}>${!n.image&&i===0?'<div class="art-bigtext">HAZE<br>NOTES.</div>':''}</div>`}
function render(){
 $('#features').innerHTML=notes.length?notes.slice(0,3).map((n,i)=>`<article class="feature" tabindex="0" role="button" data-id="${esc(n.id)}" aria-label="Read ${esc(n.title)}">${art(n,i)}<div class="article-info"><span>${esc(n.category)} / ${String(i+1).padStart(3,'0')}</span><span>${esc(n.date||'Journal')}</span></div><h3>${esc(n.title)}</h3><div class="tag" style="color:#9eb6c4">${esc(n.label||'HAZE NOTES')}</div></article>`).join(''):'<p class="empty-archive">The first entry is on its way.</p>';
 const q=$('#search').value.trim().toLowerCase();const rows=notes.filter(n=>(category==='All'||n.category===category)&&[n.title,n.body,n.label,n.category].join(' ').toLowerCase().includes(q));
 $('#list').innerHTML=rows.length?rows.map((n,i)=>`<article class="item" role="button" tabindex="0" data-id="${esc(n.id)}"><span class="num">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(n.title)}</h3><small>${esc(n.label||'HAZE NOTES')}</small></div><small>${esc(n.category)}</small><span class="arrow">↗</span></article>`).join(''):'<p class="empty-archive">No entries here yet.</p>';
}
function openReader(id){const n=lookup(id);if(!n)return;$('#readerKicker').textContent=n.category+' / HAZE NOTES';$('#readerTitle').textContent=n.title;$('#readerLabel').textContent=n.label||'HAZE NOTES';$('#readerBody').textContent=n.body;$('#readerBody').classList.toggle('empty',!n.body);$('#readerArt').style.backgroundImage=n.image?`url("${n.image.replace(/["\\]/g,'')}")`:'';$('#reader').hidden=false;document.body.style.overflow='hidden';$('#reader').scrollTop=0;$('#readerClose').focus();history.replaceState(null,'','#note='+encodeURIComponent(id));}
function closeReader(){ $('#reader').hidden=true;document.body.style.overflow='';history.replaceState(null,'',location.pathname+location.search);}
for(const sel of ['#features','#list']){const parent=$(sel);parent.addEventListener('click',e=>{const el=e.target.closest('[data-id]');if(el)openReader(el.dataset.id)});parent.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const el=e.target.closest('[data-id]');if(el){e.preventDefault();openReader(el.dataset.id)}}})}
$('#readerClose').onclick=closeReader;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#reader').hidden)closeReader()});
$('#filters').addEventListener('click',e=>{const b=e.target.closest('button[data-cat]');if(!b)return;category=b.dataset.cat;$('#filters').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render()});$('#search').addEventListener('input',render);
fetch('posts.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Could not load entries');return r.json()}).then(data=>{notes=(Array.isArray(data)?data:[]).filter(validPost).filter(n=>n.published!==false).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));render();const match=location.hash.match(/^#note=(.+)$/);if(match)openReader(decodeURIComponent(match[1]));}).catch(()=>{render();$('#list').innerHTML='<p class="empty-archive">The archive could not be loaded. Please refresh.</p>'});
})();