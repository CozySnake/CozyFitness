/* Derived from completed history: edits/imports recalculate awards and their dates. */
(function(root){
  'use strict';
  const DAY=86400000,n=v=>Number.isFinite(Number(v))?Math.max(0,Number(v)):0;
  function localDay(value){const d=new Date(value);return Number.isFinite(d.getTime())?Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/DAY:null;}
  function evaluate(history){
    const workouts=(Array.isArray(history)?history:[]).filter(w=>w&&localDay(w.date)!==null).slice().sort((a,b)=>new Date(a.date)-new Date(b.date));
    const dates={},weeks=new Map(),previous=new Map();let streak=0,longestStreak=0,lastDay=null,consistentWeeks=0,tonnage=0,personalRecord=false;
    const mark=(id,date)=>{if(!dates[id])dates[id]=date;};
    workouts.forEach((w,index)=>{
      if(index===0)mark('first',w.date);if(index===9)mark('ten',w.date);if(index===99)mark('hundred',w.date);
      tonnage+=n(w.tonnage);if(tonnage>=100000)mark('titan',w.date);
      if(w.sourceTemplate&&w.sourceTemplate.custom===true)mark('architect',w.date);
      if(n(w.durationSec)>10800)mark('marathon',w.date);
      const day=localDay(w.date);
      if(day!==lastDay){
        if(lastDay!==null&&day-lastDay>=14)mark('return',w.date);
        streak=lastDay!==null&&day===lastDay+1?streak+1:1;longestStreak=Math.max(longestStreak,streak);if(streak>=7)mark('tireless',w.date);lastDay=day;
        const monday=day-(new Date(day*DAY).getUTCDay()+6)%7;weeks.set(monday,(weeks.get(monday)||0)+1);
        let consecutive=0;for(let week=monday;(weeks.get(week)||0)>=2;week-=7)consecutive++;
        consistentWeeks=Math.max(consistentWeeks,consecutive);if(consecutive>=3)mark('rhythm',w.date);if(consecutive>=4)mark('stability',w.date);
      }
      const session=new Map();
      (w.exercises||[]).forEach(ex=>{
        const type=root.FitnessData?root.FitnessData.kind(ex):ex.kind||(ex.muscle==='Кардио'?'cardio':ex.id==='plank'?'timed':'strength');
        const key=`${ex.id||String(ex.name||'').trim().toLowerCase()}|${type}|${ex.equip||'unknown'}|${!!ex.isBodyweight}`;
        const sets=(ex.sets||[]).filter(s=>s.completed!==false&&(type==='strength'?n(s.reps)>0:n(s.durationSec)>0));
        const past=previous.get(key)||[];
        const dominates=(a,b)=>type==='strength'?n(a.weight)>=n(b.weight)&&n(a.reps)>=n(b.reps):type==='timed'?n(a.durationSec)>=n(b.durationSec):n(a.distanceKm)>=n(b.distanceKm);
        const equal=(a,b)=>type==='strength'?n(a.weight)===n(b.weight)&&n(a.reps)===n(b.reps):type==='timed'?n(a.durationSec)===n(b.durationSec):n(a.distanceKm)===n(b.distanceKm);
        if(sets.some(set=>past.some(old=>dominates(set,old)&&!equal(set,old))&&!past.some(old=>dominates(old,set)))){personalRecord=true;mark('record',w.date);}
        session.set(key,[...(session.get(key)||[]),...sets]);
      });
      session.forEach((sets,key)=>previous.set(key,[...(previous.get(key)||[]),...sets]));
    });
    const result=[];
    const add=(id,title,description,value,target,unit,hidden=false)=>result.push({id,title,description,value,target,unit,hidden,unlocked:value>=target,unlockedAt:dates[id]||null});
    add('first','Абонемент не зря','Первая завершённая тренировка. Карточка клуба наконец пригодилась.',workouts.length,1,'трен.');
    add('rhythm','Уже не случайность','Хотя бы 2 разных тренировочных дня в неделю 3 недели подряд. Зал начинает узнавать тебя.',consistentWeeks,3,'нед.');
    add('ten','Десятка без сдачи','Завершить 10 тренировок. Кассир, пробейте ещё одну.',workouts.length,10,'трен.');
    add('record','Вчерашний я в шоке','Улучшить вес или повторения без снижения второго показателя; для удержаний — время, для кардио — дистанцию. Сравниваем один тип и снаряд в разных тренировках.',Number(personalRecord),1,'рекорд');
    add('architect','Сам себе физрук','Завершить тренировку по собственной программе. Учитываются программы, запущенные с версии 2.2.',Number(!!dates.architect),1,'трен.');
    add('titan','Титан','Поднять в сумме 100 000 кг в силовых подходах. Грузовик уже смотрит с уважением.',tonnage,100000,'кг');
    add('tireless','Неутомимый','7 тренировочных дней подряд. Даже кроссовки попросили выходной.',longestStreak,7,'дн.',true);
    add('return','Я просто за водой выходил','Вернуться после перерыва от 14 календарных дней. Мы ничего не видели.',Number(!!dates.return),1,'возвращение');
    add('stability','Зал добавил в избранное','Хотя бы 2 разных тренировочных дня в неделю 4 недели подряд. Всё серьёзно.',consistentWeeks,4,'нед.');
    add('hundred','Сотня. Это не разминка','Завершить 100 тренировок. Скамья помнит твоё имя.',workouts.length,100,'трен.');
    add('marathon','Марафонец','Тренировка дольше 3 часов. Ты там прописался?',Number(!!dates.marathon),1,'трен.',true);
    return result;
  }
  root.CozyAchievements={evaluate};
})(typeof window!=='undefined'?window:globalThis);
