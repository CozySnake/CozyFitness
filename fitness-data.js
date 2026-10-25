(function (root) {
  'use strict';
  const number = (value) => { const n = Number(String(value ?? '').replace(',', '.')); return Number.isFinite(n) ? Math.max(0, n) : 0; };
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Catalog definitions own the measurement type; workout copies cannot change it.
  const catalogKinds = new Map();
  function registerCatalog(exercises) {
    (exercises || []).forEach(ex => {
      const type = ['strength', 'timed', 'cardio'].includes(ex.kind) ? ex.kind
        : ex.id === 'plank' || /планк/i.test(ex.name || '') ? 'timed'
        : ex.muscle === 'Кардио' ? 'cardio' : 'strength';
      if (ex.id) catalogKinds.set('id:' + ex.id, type);
      const nameKey = 'name:' + String(ex.name || '').trim().toLowerCase();
      if (ex.name && !catalogKinds.has(nameKey)) catalogKinds.set(nameKey, type);
    });
  }
  function kind(ex) {
    const catalogType = catalogKinds.get('id:' + ex.id) || catalogKinds.get('name:' + String(ex.name || '').trim().toLowerCase());
    if (catalogType) return catalogType;
    if (ex.id === 'plank' || /планк/i.test(ex.name || '')) return 'timed';
    if (['treadmill', 'stationary_bike', 'rowing_machine'].includes(ex.id)) return 'cardio';
    if (['strength', 'timed', 'cardio'].includes(ex.kind)) return ex.kind;
    return ex.muscle === 'Кардио' ? 'cardio' : 'strength';
  }
  const fields = (ex) => kind(ex) === 'strength'
    ? [{key:'weight',label:'Вес, кг',step:1}, {key:'reps',label:'Повторения',step:1}]
    : kind(ex) === 'timed' ? [{key:'durationSec',label:'Время, сек',step:5}]
    : [{key:'durationSec',label:'Время, мин',step:1,scale:60}, {key:'distanceKm',label:'Дистанция, км',step:0.1}];
  function defaultSet(ex, completed = false) {
    return kind(ex) === 'strength' ? {weight:ex.isBodyweight ? 0 : 20,reps:10,completed}
      : kind(ex) === 'timed' ? {durationSec:30,completed} : {durationSec:600,distanceKm:0,completed};
  }
  function validSet(ex, set) {
    return kind(ex) === 'strength' ? number(set.reps) > 0 : number(set.durationSec) > 0;
  }
  function tonnage(ex, sets = ex.sets || []) {
    if (kind(ex) !== 'strength') return 0;
    const multiplier = ex.equip === 'dumbbell_2' && !ex.isBodyweight ? 2 : 1;
    return sets.filter((s) => s.completed !== false).reduce((sum,s) => sum + number(s.weight) * number(s.reps) * multiplier, 0);
  }
  function summarize(workout) {
    const result = {strengthSets:0, cardioEntries:0, cardioDurationSec:0, distanceKm:0, timedEntries:0, timedDurationSec:0, completedEntries:0, tonnage:0};
    (workout.exercises || []).forEach(ex => {
      const sets = (ex.sets || []).filter(set => set.completed !== false);
      result.completedEntries += sets.length;
      if (kind(ex) === 'strength') { result.strengthSets += sets.length; result.tonnage += tonnage(ex, sets); }
      else if (kind(ex) === 'cardio') {
        result.cardioEntries += sets.length;
        sets.forEach(set => { result.cardioDurationSec += number(set.durationSec); result.distanceKm += number(set.distanceKm); });
      } else {
        result.timedEntries += sets.length;
        sets.forEach(set => { result.timedDurationSec += number(set.durationSec); });
      }
    });
    result.tonnage = Math.round(result.tonnage);
    result.distanceKm = Math.round(result.distanceKm * 1000) / 1000;
    return result;
  }
  function activityText(summary) {
    const format = value => value.toLocaleString('ru-RU', {maximumFractionDigits:2});
    return {
      cardio: summary.cardioEntries ? (summary.cardioDurationSec ? `${format(summary.cardioDurationSec / 60)} мин` : 'Время не записано') + (summary.distanceKm ? ` · ${format(summary.distanceKm)} км` : '') : '',
      timed: summary.timedEntries ? (summary.timedDurationSec ? `${format(summary.timedDurationSec)} сек` : 'Время не записано') : ''
    };
  }
  function recalculate(workout) {
    const summary = summarize(workout);
    workout.totalSets = summary.strengthSets;
    workout.tonnage = summary.tonnage;
    workout.activitySummary = summary;
    return workout;
  }
  function setText(ex, set) {
    const type = kind(ex);
    if (type === 'timed') return number(set.durationSec) ? `${number(set.durationSec)} сек` : 'Время не записано';
    if (type === 'cardio') return number(set.durationSec) ? `${Math.round(number(set.durationSec)/60*100)/100} мин · ${number(set.distanceKm)} км` : 'Время и дистанция не записаны';
    return `${ex.equip === 'dumbbell_2' ? '2 × ' : ''}${number(set.weight)} кг × ${number(set.reps)}`;
  }
  function sessions(history, target) {
    const result = [];
    [...history].sort((a,b) => new Date(a.date)-new Date(b.date)).forEach(w => {
      const exercises = (w.exercises || []).filter(ex => target.id && ex.id ? target.id === ex.id : String(ex.name).toLowerCase() === String(target.name).toLowerCase());
      const groups = new Map();
      exercises.forEach(ex => {
        const sets = (ex.sets || []).filter(s=>s.completed !== false);
        const key = `${kind(ex)}|${ex.equip || 'unknown'}|${!!ex.isBodyweight}`;
        if (!sets.length) return;
        if (groups.has(key)) groups.get(key).sets.push(...sets);
        else groups.set(key, {date:w.date,workoutId:w.id,exercise:ex,sets:[...sets]});
      });
      result.push(...groups.values());
    });
    return result;
  }
  function metric(ex, sets) {
    const usable = sets.filter(s=>validSet(ex,s));
    if (!usable.length) return null;
    return kind(ex) === 'strength' ? Math.max(...usable.map(s=>number(s.weight)))
      : kind(ex) === 'timed' ? Math.max(...usable.map(s=>number(s.durationSec)))
      : usable.reduce((sum,s)=>sum+number(s.distanceKm),0);
  }
  // Read-time migration: retain old fields; never reinterpret repetitions as seconds.
  function migrate(workouts) {
    (workouts || []).forEach(w => {
      (w.exercises || []).forEach(ex => {
        if (kind(ex) !== 'strength' && (ex.sets || []).some(s=>s.reps !== undefined && s.durationSec === undefined)) ex.legacyMetrics = true;
        ex.kind = kind(ex);
      });
      recalculate(w);
    });
    return workouts;
  }
  root.FitnessData = {registerCatalog,number,escape,kind,fields,defaultSet,validSet,tonnage,summarize,activityText,recalculate,setText,sessions,metric,migrate};
})(typeof window !== 'undefined' ? window : globalThis);
