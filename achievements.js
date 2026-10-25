/* Achievement rules shared by the profile and completion notification. */
(function (root) {
  'use strict';
  const DAY = 86400000;
  const positive = (value) => Math.max(0, Number(value) || 0);
  function localDay(value) {
    const date = new Date(value);
    return Number.isFinite(date.getTime())
      ? Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY : null;
  }
  function evaluate(history) {
    const workouts = (Array.isArray(history) ? history : [])
      .filter((w) => w && localDay(w.date) !== null)
      .slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const days = [...new Set(workouts.map((w) => localDay(w.date)))].sort((a, b) => a - b);
    let longestStreak = 0, streak = 0, returned = false;
    const weeks = new Map();
    days.forEach((day, i) => {
      streak = i && day === days[i - 1] + 1 ? streak + 1 : 1;
      longestStreak = Math.max(longestStreak, streak);
      if (i && day - days[i - 1] >= 14) returned = true;
      const monday = day - (new Date(day * DAY).getUTCDay() + 6) % 7;
      weeks.set(monday, (weeks.get(monday) || 0) + 1);
    });
    let consistentWeeks = 0, currentWeeks = 0, previousWeek = null;
    [...weeks.entries()].sort((a, b) => a[0] - b[0]).forEach(([week, count]) => {
      currentWeeks = count >= 2 ? (previousWeek === week - 7 ? currentWeeks + 1 : 1) : 0;
      consistentWeeks = Math.max(consistentWeeks, currentWeeks);
      previousWeek = week;
    });
    // Compare only different sessions, the same exercise/equipment, and equal-or-better reps.
    let personalRecord = false;
    const previous = new Map();
    workouts.forEach((workout) => {
      const session = new Map();
      (workout.exercises || []).forEach((ex) => {
        if (ex.isBodyweight || ex.muscle === 'Кардио') return;
        const key = `${ex.id || String(ex.name || '').trim().toLowerCase()}|${ex.equip || 'unknown'}`;
        const sets = (ex.sets || []).filter((set) => set.completed !== false && positive(set.weight) > 0 && positive(set.reps) > 0);
        const past = previous.get(key) || [];
        if (sets.some((set) => past.some((old) =>
          positive(set.weight) >= positive(old.weight) && positive(set.reps) >= positive(old.reps) &&
          (positive(set.weight) > positive(old.weight) || positive(set.reps) > positive(old.reps))) &&
          !past.some((old) => positive(old.weight) >= positive(set.weight) && positive(old.reps) >= positive(set.reps)))) personalRecord = true;
        session.set(key, [...(session.get(key) || []), ...sets]);
      });
      session.forEach((sets, key) => previous.set(key, [...(previous.get(key) || []), ...sets]));
    });
    const total = workouts.length;
    const tonnage = workouts.reduce((sum, w) => sum + positive(w.tonnage), 0);
    const custom = workouts.some((w) => w.sourceTemplate && w.sourceTemplate.custom === true);
    const longest = workouts.reduce((max, w) => Math.max(max, positive(w.durationSec)), 0);
    const result = [];
    const add = (id, title, icon, description, value, target, unit, hidden = false) => {
      result.push({id, title, icon, description, value, target, unit, hidden, unlocked: value >= target});
    };
    add('first', 'Первый шаг', '🌱', 'Завершить первую тренировку', total, 1, 'трен.');
    add('rhythm', 'Вошёл в ритм', '🎵', 'Заниматься хотя бы в 2 разных дня в неделю 3 недели подряд', consistentWeeks, 3, 'нед.');
    add('ten', 'Десятка', '🔟', 'Завершить 10 тренировок', total, 10, 'трен.');
    add('record', 'Сильнее себя', '📈', 'Улучшить вес или повторения без снижения другого показателя относительно прошлых тренировок', Number(personalRecord), 1, 'рекорд');
    add('architect', 'Архитектор', '🛠️', 'Завершить тренировку по собственной программе («По своему плану»)', Number(custom), 1, 'трен.');
    add('titan', 'Титан', '🗿', 'Поднять в сумме 100 000 кг', tonnage, 100000, 'кг');
    add('tireless', 'Неутомимый', '🔥', 'Тренироваться 7 календарных дней подряд', longestStreak, 7, 'дн.', true);
    add('return', 'Возвращение', '🌅', 'Вернуться к тренировкам после перерыва от 14 дней', Number(returned), 1, 'возвращение');
    add('stability', 'Стабильность', '🧭', 'Заниматься хотя бы в 2 разных дня в неделю 4 недели подряд', consistentWeeks, 4, 'нед.');
    add('hundred', 'Сотня', '💯', 'Завершить 100 тренировок', total, 100, 'трен.');
    add('marathon', 'Марафонец', '⏳', 'Завершить тренировку продолжительностью более 3 часов', Number(longest > 10800), 1, 'трен.', true);
    return result;
  }
  root.CozyAchievements = {evaluate};
})(typeof window !== 'undefined' ? window : globalThis);
