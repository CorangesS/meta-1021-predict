'use strict';
const model=MetaModel;
let scenario='base';
let shield=1;
const money=(v,d=0)=>new Intl.NumberFormat('en-US',{minimumFractionDigits:d,maximumFractionDigits:d}).format(v);
const percent=v=>`${v>=0?'+':''}${(v*100).toFixed(1)}%`;
const rate=v=>`${(v*100).toFixed(1)}%`;
const numCell=(v,d=0)=>`<td${v<0?' class="negative"':''}>${money(v,d)}</td>`;
const $=id=>document.getElementById(id);
function makeTable(head,rows){return `<div class="table-wrap"><table class="numeric"><thead><tr>${head.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${r[0]}</th>${r.slice(1).map(v=>typeof v==='number'?numCell(v):`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function draw(){
  const s=model.calculate(scenario,shield),a=model.actual.q2,y=model.actual.q325;
  document.querySelectorAll('[data-scenario]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.scenario===scenario)));
  $('scenario-status').textContent=`当前：${s.label}情景 · ${shield?`法律费用假设按${s.taxrate*100}%产生税收利益`:'法律费用假设不产生税收利益'}。税务处理尚未核实；切换更新本节、现金图及第08节附表，其他论述保留基准。`;
  $('metric-revenue').textContent=`$${(s.revenue/1000).toFixed(2)}B`;
  $('metric-growth').textContent=`同比 ${percent(s.revYoY)} · 环比 ${percent(s.revQoQ)}`;
  $('metric-eps').textContent=`$${s.eps.toFixed(2)}`;
  $('metric-core').textContent=`$${s.coreEPS.toFixed(2)}`;
  $('metric-fcf').textContent=`${s.fcf<0?'−':''}$${Math.abs(s.fcf/1000).toFixed(1)}B`;
  const metrics=[['收入','revenue','n'],['成本与费用','costs','n'],['营业利润','op','n'],['营业利润率','margin','p'],['所得税费用','tax','n'],['有效税率','taxrate','p'],['净利润','net','n'],['稀释每股收益（美元）','eps','eps']];
  $('highlights').querySelector('thead tr').children[2].innerHTML=`Q3 2026E ${s.label}`;
  $('highlights').querySelector('tbody').innerHTML=metrics.map(([label,key,typ])=>{
    const v=key==='taxrate'?s.effectiveTax:s[key];
    const fmt=x=>typ==='p'?rate(x):money(x,typ==='eps'?2:0);
    const diff=x=>typ==='p'?`${v-x>=0?'+':''}${((v-x)*100).toFixed(1)} pp`:percent(v/x-1);
    return `<tr${['op','net','eps'].includes(key)?' class="total"':''}><th scope="row">${label}</th><td>${fmt(a[key])}</td><td class="selected">${fmt(v)}</td><td>${fmt(y[key])}</td><td>${diff(a[key])}</td><td>${diff(y[key])}</td></tr>`;
  }).join('');
  $('eps-bridge').innerHTML=`<div class="bridge-item"><span>剔除本次法律费</span><strong>$${s.coreEPS.toFixed(2)}</strong><small>仍含股权激励、折旧与研发</small></div><div class="bridge-item"><span>本次法律费的每股影响</span><strong>−$${s.legalEPS.toFixed(2)}</strong><small>${shield?`假设获得${s.taxrate*100}%税收利益`:'假设没有税收利益'}</small></div><div class="bridge-item"><span>GAAP EPS研究预测</span><strong>$${s.eps.toFixed(2)}</strong><small>有效税率约${rate(s.effectiveTax)}</small></div>`;
  const income=[['收入','revenue'],['营业成本','costRevenue'],['研发','rd'],['营销与销售','marketing'],['一般与行政（含新增法律费）','ga'],['总成本与费用','costs'],['营业利润','op'],['利息及其他净收入/支出','interest'],['税前利润','pretax'],['所得税费用','tax'],['净利润','net'],['基本EPS','basicEPS'],['稀释EPS','eps'],['基本加权股数（百万）','basicShares'],['稀释加权股数（百万）','shares']];
  $('income-table').querySelector('thead tr').children[2].textContent=`Q3 2026E ${s.label}`;
  $('income-table').querySelector('tbody').innerHTML=income.map(([label,key])=>`<tr><th scope="row">${label}</th>${numCell(a[key],/EPS|eps/.test(key)?2:0)}<td class="selected">${money(s[key],/EPS|eps/.test(key)?2:0)}</td></tr>`).join('');
  const common=['项目','Q2 2026 实际',`Q3 2026E ${s.label}`];
  $('cashflow-table').innerHTML=makeTable(common,[
    ['净利润',a.net,s.net],['折旧与摊销',a.da,s.da],['股权激励',a.sbc,s.sbc],['本次法律计提非现金调节','—',s.legal],['其他调节 / 模型余项',a.cfo-a.net-a.da-a.sbc,s.cashBridgeResidual],['经营现金流',a.cfo,s.cfo],['减：固定资产购置',-a.ppe,-s.ppe],['减：融资租赁本金',-a.lease,-s.lease],['自由现金流',a.fcf,s.fcf]
  ]);
  $('segment-table').innerHTML=makeTable(['项目','Q2 2026 实际',`Q3 2026E ${s.label}`,'Q3 2025 实际'],[
    ['广告收入',a.ad,s.ad,y.ad],['其他收入（Q3含Muse）',a.other,s.other,y.other],['Family of Apps收入',a.foa,s.foa,y.foa],['Reality Labs收入',a.rl,s.rl,y.rl],['总收入',a.revenue,s.revenue,y.revenue],['FoA营业利润（Q3含法律费）',a.foaOp,s.foaOp,y.foaOp],['RL营业亏损',a.rlOp,s.rlOp,y.rlOp],['合并营业利润',a.op,s.op,y.op]
  ]);
  $('adjustment-table').innerHTML=makeTable(['Q3研究情景','GAAP模型','剔除新增法律费后的分析值'],[
    ['营业利润',s.op,s.coreOp],['税前利润',s.pretax,s.corePretax],['所得税费用',s.tax,s.corePretax*s.taxrate],['净利润',s.net,s.coreNet],['稀释EPS',money(s.eps,2),money(s.coreEPS,2)]
  ]);
  const bars=[['Q2 CFO',a.cfo,'#9cae9e'],['Q2 CapEx',a.capex,'#b3bdb2'],[`Q3 CFO · ${s.label}`,s.cfo,'#136f63'],[`Q3 CapEx · ${s.label}`,s.capex,'#51786c'],['Q3 FCF',s.fcf,'#a6453c']];
  $('cash-chart').innerHTML=bars.map(([label,v,color])=>`<div class="bar-row"><span>${label}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.abs(v)/500}%;background:${color}"></div></div><span class="bar-value">${(v/1000).toFixed(2)}</span></div>`).join('');
}
document.querySelectorAll('[data-scenario]').forEach(btn=>btn.addEventListener('click',()=>{scenario=btn.dataset.scenario;draw();}));
$('tax-shield').addEventListener('change',e=>{shield=Number(e.target.value);draw();});
function updateMuse(){
  const p=Number($('avg-paid').value),arppu=Number($('arppu').value);
  if(!Number.isFinite(p)||!Number.isFinite(arppu)||p<0||p>50000000||arppu<0||arppu>100){$('muse-revenue').textContent='请检查输入范围';$('muse-share').textContent='平均付费人数0–5000万，ARPPU $0–100。';return;}
  const rev=model.museRevenue(p,arppu),group=model.calculate('base').revenue*1e6;
  $('muse-revenue').textContent='$'+money(rev);
  $('muse-share').textContent=`Q3收入敏感性：占基准集团收入${(rev/group*100).toFixed(5)}%。不代表公司已实现收入。`;
  $('muse-onepct').textContent=arppu>0?`${(group*.01/(arppu*23/30)/1e6).toFixed(2)}M`:'无有限解';
}
['avg-paid','arppu'].forEach(id=>$(id).addEventListener('input',updateMuse));
let previousDetails=[];
window.addEventListener('beforeprint',()=>{previousDetails=[...document.querySelectorAll('details')].map(x=>[x,x.open]);previousDetails.forEach(([d])=>d.open=true);});
window.addEventListener('afterprint',()=>previousDetails.forEach(([d,open])=>d.open=open));
['print-top','print-bottom'].forEach(id=>$(id).addEventListener('click',()=>window.print()));
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.sidebar a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}});},{rootMargin:'-10% 0px -70% 0px'});
  document.querySelectorAll('main section').forEach(s=>observer.observe(s));
}
draw();updateMuse();
