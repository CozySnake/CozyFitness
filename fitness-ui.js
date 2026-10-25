(function(root){
  'use strict';
  const D=root.FitnessData, e=D.escape;
  const paths={first:'M12 20V10m0 4C3 14 4 5 12 10m0 1c0-7 8-8 8-3-1 4-5 6-8 6',rhythm:'M4 15h3l2-8 4 13 3-9h4',ten:'M5 8h3v10M13 8h5v10h-5z',record:'M4 19V5m0 14h17M7 15l4-5 4 2 5-7',architect:'M4 20l4-8 4 4-8 4m6-14 4-4 8 8-4 4z',titan:'M4 10v7m3-10v13m10-13v13m3-10v7M7 13h10',tireless:'M12 3c2 5 8 7 6 13-2 7-13 5-12-2 0-4 4-6 6-11z',return:'M5 12a7 7 0 1 1 2 6M5 5v7h7',stability:'M12 3l8 4v6c0 5-8 8-8 8s-8-3-8-8V7zM8 12l3 3 5-6',hundred:'M4 8h2v10m4-10h4v10h-4zm8 0h4v10h-4z',marathon:'M7 3h10M7 21h10M8 3c0 7 8 11 8 18M16 3c0 7-8 11-8 18'};
  function badge(id,locked=false){return `<svg class="achievement-emblem ${locked?'is-locked':''}" viewBox="0 0 48 48" aria-hidden="true"><path class="emblem-ribbon" d="M12 30 8 46l10-5 6 5 6-5 10 5-4-16"/><circle class="emblem-face" cx="24" cy="22" r="19"/><circle class="emblem-ring" cx="24" cy="22" r="15"/><g transform="translate(12 10)" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[id]||(locked?'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z':paths.first)}"/></g></svg>`;}
  function chart(points,label){
    if(!points.length)return '<p class="feature-muted">Для графика пока нет записанных значений.</p>';
    const W=320,H=155,L=38,R=12,T=18,B=34, values=points.map(p=>p.value),min=Math.min(0,...values),max=Math.max(1,...values),range=max-min;
    const coords=points.map((p,i)=>({x:points.length===1?W/2:L+i*(W-L-R)/(points.length-1),y:T+(max-p.value)/range*(H-T-B),...p}));
    return `<figure class="exercise-chart"><figcaption>${e(label)}</figcaption><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${e(label)}"><line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" stroke="var(--border-color)"/><text x="${L-5}" y="${T+4}" text-anchor="end">${Math.round(max*10)/10}</text><text x="${L-5}" y="${H-B}" text-anchor="end">0</text>${coords.length>1?`<polyline points="${coords.map(p=>`${p.x},${p.y}`).join(' ')}" fill="none" stroke="var(--accent-gold)" stroke-width="2.5"/>`:''}${coords.map((p,i)=>`<g><title>${e(p.date)}: ${p.value}</title><circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--accent-gold)"/>${(i===0||i===coords.length-1)?`<text x="${p.x}" y="${H-10}" text-anchor="middle">${e(p.date)}</text>`:''}</g>`).join('')}</svg></figure>`;
  }
  function history(history,target,selected){
    const sessions=D.sessions(history,target);
    const groupKey=s=>`${D.kind(s.exercise)}|${s.exercise.equip||'unknown'}|${!!s.exercise.isBodyweight}`;
    const groups=[...new Set(sessions.map(groupKey))];
    const group=groups.includes(selected)?selected:groups.at(-1);
    const filtered=sessions.filter(s=>groupKey(s)===group);
    if(!filtered.length)return '<div class="info-progress-header">История упражнения</div><p class="feature-muted">Пока нет завершённых подходов. Первая запись появится после тренировки.</p>';
    const ex=filtered.at(-1).exercise,type=D.kind(ex),sets=filtered.flatMap(s=>s.sets).filter(s=>D.validSet(ex,s));
    const bodyweight=type==='strength'&&sets.length&&sets.every(s=>D.number(s.weight)===0);
    const label=type==='timed'?'Лучшее удержание, сек':type==='cardio'?'Дистанция за тренировку, км':bodyweight?'Максимум повторений без дополнительного веса':'Максимальный рабочий вес, кг';
    const allPoints=filtered.map(s=>({date:new Date(s.date).toLocaleDateString('ru-RU',{day:'numeric',month:'short'}),value:bodyweight?Math.max(...s.sets.map(t=>D.number(t.reps))):D.metric(s.exercise,s.sets)})).filter(p=>p.value!==null);
    const points=allPoints.slice(-20);
    let record='Пока нет измерений';
    if(sets.length){if(type==='strength'){const best=[...sets].sort((a,b)=>D.number(b.weight)-D.number(a.weight)||D.number(b.reps)-D.number(a.reps))[0];record=D.setText(ex,best);}else if(type==='timed')record=`Удержание: ${Math.max(...sets.map(s=>D.number(s.durationSec)))} сек`;else record=`За тренировку: ${Math.max(...allPoints.map(p=>p.value))} км · Самый долгий отрезок: ${Math.round(Math.max(...sets.map(s=>D.number(s.durationSec)))/60*10)/10} мин`;}
    const equipment={barbell:'Штанга',dumbbell_2:'Две гантели (вес одной)',dumbbell_1:'Одна гантель',machine:'Тренажёр',bodyweight:'Свой вес',unknown:'Снаряд не указан'};
    return `<div class="info-progress-header"><strong>История · ${filtered.length} трен.</strong></div>${groups.length>1?`<label class="feature-muted">Сравнивать записи одного типа и снаряда<select id="exerciseHistoryGroup" class="form-input">${groups.map(g=>`<option value="${e(g)}" ${g===group?'selected':''}>${e(({strength:'Силовое',timed:'Удержание',cardio:'Кардио'})[g.split('|')[0]])} · ${e(equipment[g.split('|')[1]]||g.split('|')[1])}</option>`).join('')}</select></label>`:''}<p class="history-record">Личный рекорд: <strong>${e(record)}</strong></p>${chart(points,label)}<div class="info-progress-list">${filtered.slice(-10).reverse().map(s=>`<div class="info-progress-row"><span class="info-progress-date">${e(new Date(s.date).toLocaleDateString('ru-RU',{day:'numeric',month:'short',year:'numeric'}))}</span><span class="info-progress-sets">${s.sets.map(t=>e(D.setText(s.exercise,t))).join(' · ')}${s.exercise.legacyMetrics?'<small class="feature-muted">Старая запись: время можно уточнить в редакторе тренировки.</small>':''}</span></div>`).join('')}</div>`;
  }
  root.FitnessUI={badge,chart,history};
})(typeof window!=='undefined'?window:globalThis);
