/**
 * CozyFitness — Core Application Logic
 * Pure Vanilla JavaScript, Offline-First, PWA-Ready
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Initial State, Exercise Database & Workout Templates
  // ==========================================================================

  const DEFAULT_EXERCISES = [
    // Грудь
    { id: 'bench_press', name: 'Жим штанги лёжа', muscle: 'Грудь' },
    { id: 'incline_dumbbell_press', name: 'Жим гантелей на наклонной', muscle: 'Грудь' },
    { id: 'dips_chest', name: 'Отжимания на брусьях', muscle: 'Грудь', isBodyweight: true },
    { id: 'cable_crossover', name: 'Сведение рук в кроссовере', muscle: 'Грудь' },
    { id: 'dumbbell_flyes', name: 'Разводка гантелей лёжа', muscle: 'Грудь' },
    { id: 'pushups', name: 'Отжимания от пола', muscle: 'Грудь', isBodyweight: true },

    // Спина
    { id: 'pullups', name: 'Подтягивания', muscle: 'Спина', isBodyweight: true },
    { id: 'lat_pulldown', name: 'Тяга верхнего блока к груди', muscle: 'Спина' },
    { id: 'barbell_row', name: 'Тяга штанги в наклоне', muscle: 'Спина' },
    { id: 'seated_cable_row', name: 'Горизонтальная тяга блока', muscle: 'Спина' },
    { id: 'dumbbell_row', name: 'Тяга гантели одной рукой', muscle: 'Спина' },
    { id: 'hyperextension', name: 'Гиперэкстензия', muscle: 'Спина', isBodyweight: true },
    { id: 'deadlift', name: 'Классическая становая тяга', muscle: 'Спина' },

    // Ноги
    { id: 'squats', name: 'Приседания со штангой', muscle: 'Ноги' },
    { id: 'leg_press', name: 'Жим ногами в тренажере', muscle: 'Ноги' },
    { id: 'romanian_deadlift', name: 'Румынская становая тяга', muscle: 'Ноги' },
    { id: 'lunges', name: 'Выпады с гантелями', muscle: 'Ноги' },
    { id: 'leg_extension', name: 'Разгибания ног в тренажере', muscle: 'Ноги' },
    { id: 'leg_curl', name: 'Сгибания ног лёжа', muscle: 'Ноги' },
    { id: 'calf_raises', name: 'Подъемы на носки (икры)', muscle: 'Ноги' },

    // Плечи
    { id: 'overhead_press', name: 'Армейский жим стоя', muscle: 'Плечи' },
    { id: 'seated_dumbbell_press', name: 'Жим гантелей сидя', muscle: 'Плечи' },
    { id: 'lateral_raises', name: 'Махи гантелями в стороны', muscle: 'Плечи' },
    { id: 'upright_row', name: 'Тяга штанги к подбородку', muscle: 'Плечи' },
    { id: 'rear_delt_fly', name: 'Махи на заднюю дельту в наклоне', muscle: 'Плечи' },

    // Руки
    { id: 'barbell_curl', name: 'Подъем штанги на бицепс', muscle: 'Руки' },
    { id: 'hammer_curls', name: 'Молотковые сгибания с гантелями', muscle: 'Руки' },
    { id: 'french_press', name: 'Французский жим лёжа', muscle: 'Руки' },
    { id: 'cable_tricep_pushdown', name: 'Разгибания на трицепс на блоке', muscle: 'Руки' },
    { id: 'preacher_curl', name: 'Сгибания на скамье Скотта', muscle: 'Руки' },

    // Пресс
    { id: 'plank', name: 'Планка', muscle: 'Пресс', isBodyweight: true },
    { id: 'crunches', name: 'Скручивания на коврике', muscle: 'Пресс', isBodyweight: true },
    { id: 'hanging_leg_raises', name: 'Подъемы ног в висе', muscle: 'Пресс', isBodyweight: true },
    { id: 'cable_crunch', name: 'Скручивания на блоке («Молитва»)', muscle: 'Пресс' },

    // Кардио
    { id: 'treadmill', name: 'Беговая дорожка', muscle: 'Кардио' },
    { id: 'stationary_bike', name: 'Велотренажер', muscle: 'Кардио' },
    { id: 'rowing_machine', name: 'Гребной тренажер', muscle: 'Кардио' }
  ];

  // Pre-set Workout Programs (Базовые программы)
  const BUILTIN_TEMPLATES = [
    {
      id: 'template_chest_triceps',
      title: 'Грудь + Трицепс',
      desc: 'Классический жимовой сплит: мощная проработка грудных мышц и трицепса',
      exercises: [
        { id: 'bench_press', name: 'Жим штанги лёжа', muscle: 'Грудь', defaultWeight: 60, defaultReps: 8 },
        { id: 'incline_dumbbell_press', name: 'Жим гантелей на наклонной', muscle: 'Грудь', defaultWeight: 22, defaultReps: 10 },
        { id: 'cable_crossover', name: 'Сведение рук в кроссовере', muscle: 'Грудь', defaultWeight: 15, defaultReps: 12 },
        { id: 'cable_tricep_pushdown', name: 'Разгибания на трицепс на блоке', muscle: 'Руки', defaultWeight: 25, defaultReps: 12 },
        { id: 'french_press', name: 'Французский жим лёжа', muscle: 'Руки', defaultWeight: 25, defaultReps: 10 }
      ]
    },
    {
      id: 'template_back_biceps',
      title: 'Спина + Бицепс',
      desc: 'Тяговый день для широкой мощной спины и проработки двуглавой мышцы',
      exercises: [
        { id: 'pullups', name: 'Подтягивания', muscle: 'Спина', isBodyweight: true, defaultWeight: 0, defaultReps: 8 },
        { id: 'lat_pulldown', name: 'Тяга верхнего блока к груди', muscle: 'Спина', defaultWeight: 50, defaultReps: 10 },
        { id: 'seated_cable_row', name: 'Горизонтальная тяга блока', muscle: 'Спина', defaultWeight: 45, defaultReps: 10 },
        { id: 'dumbbell_row', name: 'Тяга гантели одной рукой', muscle: 'Спина', defaultWeight: 20, defaultReps: 10 },
        { id: 'barbell_curl', name: 'Подъем штанги на бицепс', muscle: 'Руки', defaultWeight: 25, defaultReps: 10 },
        { id: 'hammer_curls', name: 'Молотковые сгибания с гантелями', muscle: 'Руки', defaultWeight: 14, defaultReps: 12 }
      ]
    },
    {
      id: 'template_legs_shoulders',
      title: 'Ноги + Плечи',
      desc: 'Базовая проработка квадрицепсов, задней поверхности бедра и всех дельт',
      exercises: [
        { id: 'squats', name: 'Приседания со штангой', muscle: 'Ноги', defaultWeight: 70, defaultReps: 8 },
        { id: 'leg_press', name: 'Жим ногами в тренажере', muscle: 'Ноги', defaultWeight: 120, defaultReps: 10 },
        { id: 'romanian_deadlift', name: 'Румынская становая тяга', muscle: 'Ноги', defaultWeight: 60, defaultReps: 10 },
        { id: 'overhead_press', name: 'Армейский жим стоя', muscle: 'Плечи', defaultWeight: 35, defaultReps: 8 },
        { id: 'lateral_raises', name: 'Махи гантелями в стороны', muscle: 'Плечи', defaultWeight: 10, defaultReps: 12 }
      ]
    },
    {
      id: 'template_fullbody',
      title: 'Фуллбоди (Все тело)',
      desc: 'Сбалансированная тренировка всех основных мышечных групп за одну сессию',
      exercises: [
        { id: 'squats', name: 'Приседания со штангой', muscle: 'Ноги', defaultWeight: 60, defaultReps: 8 },
        { id: 'bench_press', name: 'Жим штанги лёжа', muscle: 'Грудь', defaultWeight: 50, defaultReps: 8 },
        { id: 'pullups', name: 'Подтягивания', muscle: 'Спина', isBodyweight: true, defaultWeight: 0, defaultReps: 8 },
        { id: 'lateral_raises', name: 'Махи гантелями в стороны', muscle: 'Плечи', defaultWeight: 8, defaultReps: 12 },
        { id: 'hanging_leg_raises', name: 'Подъемы ног в висе', muscle: 'Пресс', isBodyweight: true, defaultWeight: 0, defaultReps: 12 }
      ]
    }
  ];

  // Exercise Technique & Guide Knowledge Base
  const EXERCISE_GUIDES = {
    bench_press: {
      muscles: 'Большая и малая грудные мышцы, передний пучок дельт, трицепсы.',
      steps: [
        'Лягте на скамью, плотно сведите лопатки и опустите их вниз к тазу. Стопы всей площадью упираются в пол.',
        'Возьмитесь за гриф хватом чуть шире плеч. Снимите штангу и зафиксируйте над верхней частью груди.',
        'На вдохе плавно опустите гриф к середине груди. Локти держите под углом ~70–75° к корпусу.',
        'На выдохе мощно выжмите штангу вверх по плавной дуге, не разводя лопатки в верхней точке.'
      ],
      tips: 'Не отрывайте таз от скамьи. Не разводите локти под прямым углом 90° к туловищу, чтобы не перегружать плечевые суставы. Не отбивайте штангу от грудной клетки.'
    },
    pullups: {
      muscles: 'Широчайшие мышцы спины, бицепсы, ромбовидные, круглые мышцы, предплечья.',
      steps: [
        'Возьмитесь за перекладину прямым хватом чуть шире плеч.',
        'В нижнем положении полностью вытяните руки, но сохраняйте активное натяжение в плечах.',
        'На выдохе начните движение со сведения лопаток вниз, направляя локти к талии.',
        'Подтянитесь так, чтобы подбородок оказался выше перекладины, зафиксируйтесь на полсекунды.',
        'На вдохе подконтрольно опуститесь в исходное положение.'
      ],
      tips: 'Не раскачивайтесь и не закидывайте ноги рывком. Думайте о том, чтобы тянуть локти вниз, а не сгибать руки в бицепсах.'
    },
    dips_chest: {
      muscles: 'Нижний и средний отделы грудных мышц, трицепсы, передние дельтовидные.',
      steps: [
        'Примите упор на брусьях на выпрямленных руках, лопатки опущены.',
        'Слегка наклоните корпус вперед (угол ~20–30°), подогните ноги в коленях.',
        'На вдохе опускайтесь вниз до прямого угла в локтях (плечо параллельно брусьям).',
        'На выдохе выжмите себя вверх за счет сокращения грудных мышц.'
      ],
      tips: 'Не опускайтесь слишком глубоко, если ощущаете дискомфорт в плечевых капсулах. Держите локти ближе к корпусу.'
    },
    squats: {
      muscles: 'Квадрицепсы, ягодичные мышцы, бицепс бедра, разгибатели спины, мышцы кора.',
      steps: [
        'Положите гриф на верх трапеций (ниже шеи). Ноги на ширине плеч, носки развернуты наружу на 20–30°.',
        'Сделайте глубокий вдох животом, напрягите мышцы пресса.',
        'Начните движение с отведения таза назад и сгибания коленей. Опуститесь минимум до параллели бедер с полом.',
        'На выдохе, отталкиваясь пятками и центром стопы, поднимитесь вверх.'
      ],
      tips: 'Колени должны строго двигаться в направлении носков и не заваливаться внутрь. Не круглите поясницу и не отрывайте пятки от пола.'
    },
    deadlift: {
      muscles: 'Разгибатели позвоночника, ягодицы, задняя поверхность бедра, трапеции, хват.',
      steps: [
        'Подойдите к штанге так, чтобы гриф был в 2–3 см от голеней (над серединой стопы).',
        'Опустите таз, возьмитесь за гриф. Спина абсолютно прямая, лопатки сведены, грудь расправлена.',
        'На выдохе мощным движением ног толкните пол вниз, поднимая штангу строго вертикально вдоль ног.',
        'В верхней точке полностью выпрямитесь, сжав ягодицы, без чрезмерного прогиба назад.'
      ],
      tips: 'Штанга должна буквально скользить по ногам. Ни в коем случае не допускайте скругления поясницы.'
    },
    incline_dumbbell_press: {
      muscles: 'Верхняя (ключичная) часть грудных, передняя дельта, трицепс.',
      steps: [
        'Установите угол скамьи 30–35 градусов. Лягте на скамью, сведя лопатки.',
        'Держите гантели по бокам от груди. На выдохе выжмите их вверх по сходящейся дуге.',
        'В верхней точке не соударяйте гантели, сохраняйте напряжение.',
        'На вдохе медленно опустите гантели, чувствуя растяжение верха груди.'
      ],
      tips: 'Не задирайте угол выше 45°, иначе основная нагрузка перейдет с груди на плечи.'
    },
    hyperextension: {
      muscles: 'Разгибатели спины, большие ягодичные мышцы, бицепс бедра.',
      steps: [
        'Отрегулируйте подушку тренажера под уровень гребня подвздошных костей (чуть ниже сгиба таза).',
        'Скрестите руки на груди. На вдохе опуститесь вниз, сгибаясь только в тазобедренных суставах.',
        'На выдохе поднимитесь в одну линию со всем телом за счет напряжения ягодиц и задней поверхности бедра.'
      ],
      tips: 'Не запрокидывайте голову назад и не переразгибайте поясницу выше ровной линии тела.'
    },
    hanging_leg_raises: {
      muscles: 'Прямая мышца живота (с акцентом на нижнюю часть), подвздошно-поясничные мышцы.',
      steps: [
        'Повисните на перекладине. Тело прямое, без раскачивания.',
        'На выдохе подкрутите таз вперед и поднимите согнутые или прямые ноги к уровню груди.',
        'Задержитесь на 1 секунду в пиковом сокращении.',
        'На вдохе плавно опустите ноги вниз.'
      ],
      tips: 'Ключ к прессу — именно подкручивание таза к ребрам, а не просто махи ногами.'
    },
    plank: {
      muscles: 'Поперечная мышца живота, прямая мышца, мышцы кора, стабилизаторы плеча и ягодицы.',
      steps: [
        'Примите упор на предплечьях. Локти расположены строго под плечами.',
        'Тело составляет абсолютно прямую линию от макушки до пят.',
        'Сожмите ягодицы и подтяните пупок к позвоночнику.',
        'Дышите спокойно и размеренно, не задерживая дыхание.'
      ],
      tips: 'Не проваливайте поясницу вниз и не задирайте таз вверх домиком.'
    }
  };

  // App Storage Keys
  const STORAGE_KEYS = {
    HISTORY: 'cozy_fitness_history',
    ACTIVE: 'cozy_fitness_active_workout',
    CUSTOM_EXERCISES: 'cozy_fitness_custom_exercises',
    CUSTOM_TEMPLATES: 'cozy_fitness_custom_templates',
    PROFILE: 'cozy_fitness_profile',
    SETTINGS: 'cozy_fitness_settings'
  };

  // State
  let historyData = [];
  let customExercises = [];
  let customTemplates = [];
  let activeWorkout = null;

  let profileData = {
    name: 'Александр',
    gender: 'male',
    height: 180,
    weight: 78.5,
    weightLog: [
      { date: new Date().toISOString(), weight: 78.5 }
    ]
  };

  let settings = {
    sound: true,
    vibrate: true,
    defaultRestSec: 90,
    autoRest: true,
    theme: 'dark'
  };

  // State for template creator modal
  let templateBuilderExercises = [];
  let isSelectingForTemplateBuilder = false;

  // Calendar State
  let calendarMonth = new Date().getMonth();
  let calendarYear = new Date().getFullYear();
  let selectedCalendarDateStr = new Date().toISOString().slice(0, 10);
  let historyViewMode = 'calendar'; // 'calendar' | 'list'

  // Timers State
  let workoutTimerInterval = null;
  let restTimer = {
    interval: null,
    totalSeconds: 90,
    remainingSeconds: 90,
    isRunning: false
  };

  // Audio Context (Synthesizer Chime)
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playCozyChime() {
    if (!settings.sound) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const playTone = (freq, start, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.3, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(start);
        osc.stop(start + duration);
      };

      playTone(587.33, now, 0.7);        // D5
      playTone(880.00, now + 0.16, 0.9); // A5
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  function triggerVibration() {
    if (!settings.vibrate) return;
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([180, 80, 240]);
      } catch (e) {
        // Ignored
      }
    }
  }

  // ==========================================================================
  // 2. Storage Helpers
  // ==========================================================================

  function loadState() {
    try {
      const hist = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (hist) historyData = JSON.parse(hist);

      const cust = localStorage.getItem(STORAGE_KEYS.CUSTOM_EXERCISES);
      if (cust) customExercises = JSON.parse(cust);

      const tpls = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEMPLATES);
      if (tpls) customTemplates = JSON.parse(tpls);

      const prof = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (prof) profileData = Object.assign(profileData, JSON.parse(prof));

      const sett = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (sett) settings = Object.assign(settings, JSON.parse(sett));

      const act = localStorage.getItem(STORAGE_KEYS.ACTIVE);
      if (act) activeWorkout = JSON.parse(act);
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
  }

  function saveHistory() {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyData));
  }

  function saveCustomExercises() {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EXERCISES, JSON.stringify(customExercises));
  }

  function saveCustomTemplates() {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TEMPLATES, JSON.stringify(customTemplates));
  }

  function saveProfile() {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profileData));
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  function saveActiveWorkout() {
    if (activeWorkout) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE, JSON.stringify(activeWorkout));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE);
    }
  }

  function getAllExercises() {
    return [...DEFAULT_EXERCISES, ...customExercises];
  }

  function findPreviousPerformance(exerciseName) {
    if (!historyData || historyData.length === 0) return null;
    for (const workout of historyData) {
      const foundEx = workout.exercises.find((e) => e.name.toLowerCase() === exerciseName.toLowerCase());
      if (foundEx && foundEx.sets && foundEx.sets.length > 0) {
        const completedSets = foundEx.sets.filter((s) => s.completed);
        if (completedSets.length > 0) {
          const isBW = foundEx.isBodyweight || completedSets.some((s) => s.isBodyweight);
          const heaviest = completedSets.reduce((max, s) => ((s.weight || 0) > (max.weight || 0) ? s : max), completedSets[0]);

          if (isBW) {
            if (!heaviest.weight || heaviest.weight === 0) {
              return `Свой вес × ${heaviest.reps}`;
            } else {
              return `+${heaviest.weight} кг × ${heaviest.reps}`;
            }
          }
          return `${heaviest.weight} кг × ${heaviest.reps}`;
        }
      }
    }
    return null;
  }

  // ==========================================================================
  // 3. UI Navigation & View Switching
  // ==========================================================================

  const views = {
    viewHome: document.getElementById('viewHome'),
    viewWorkoutHub: document.getElementById('viewWorkoutHub'),
    viewActive: document.getElementById('viewActive'),
    viewHistory: document.getElementById('viewHistory'),
    viewExercises: document.getElementById('viewExercises'),
    viewProfile: document.getElementById('viewProfile')
  };

  const tabButtons = document.querySelectorAll('.bottom-tab-bar .tab-item');
  const activeDot = document.getElementById('activeDot');

  function switchView(targetViewId) {
    Object.keys(views).forEach((id) => {
      if (views[id]) {
        if (id === targetViewId) {
          views[id].classList.add('active');
        } else {
          views[id].classList.remove('active');
        }
      }
    });

    tabButtons.forEach((tab) => {
      const tabTarget = tab.dataset.target;
      if (tabTarget === targetViewId || (targetViewId === 'viewActive' && tab.id === 'tabActiveWorkout')) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render targeted view contents
    if (targetViewId === 'viewHome') renderHome();
    if (targetViewId === 'viewWorkoutHub') renderWorkoutHub();
    if (targetViewId === 'viewHistory') renderHistoryAndCalendar();
    if (targetViewId === 'viewExercises') renderExercisesLibrary();
    if (targetViewId === 'viewProfile') renderProfile();
    if (targetViewId === 'viewActive') renderActiveWorkout();
  }

  tabButtons.forEach((tab) => {
    tab.addEventListener('click', () => {
      let target = tab.dataset.target;
      if (tab.id === 'tabActiveWorkout') {
        target = activeWorkout ? 'viewActive' : 'viewWorkoutHub';
      }
      switchView(target);
    });
  });

  // ==========================================================================
  // 4. Workout Stopwatch
  // ==========================================================================

  function formatTime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  }

  function startWorkoutStopwatch() {
    if (workoutTimerInterval) clearInterval(workoutTimerInterval);
    const timerDisplay = document.getElementById('workoutTimerDisplay');

    function update() {
      if (!activeWorkout) return;
      const elapsedSec = Math.floor((Date.now() - activeWorkout.startTime) / 1000);
      if (timerDisplay) timerDisplay.textContent = formatTime(elapsedSec);
    }

    update();
    workoutTimerInterval = setInterval(update, 1000);
  }

  function stopWorkoutStopwatch() {
    if (workoutTimerInterval) {
      clearInterval(workoutTimerInterval);
      workoutTimerInterval = null;
    }
  }

  // ==========================================================================
  // 5. Rest Timer Engine
  // ==========================================================================

  const restTimerBar = document.getElementById('restTimerBar');
  const timerDigits = document.getElementById('timerDigits');
  const timerProgressBg = document.getElementById('timerProgressBg');
  const timerPlayPauseBtn = document.getElementById('timerPlayPauseBtn');
  const timerStopBtn = document.getElementById('timerStopBtn');
  const timerPlus15Btn = document.getElementById('timerPlus15Btn');
  const timerInfoTap = document.getElementById('timerInfoTap');

  const modalRestTimer = document.getElementById('modalRestTimer');
  const bigTimerText = document.getElementById('bigTimerText');
  const timerCircleFg = document.getElementById('timerCircleFg');
  const timerSheetToggle = document.getElementById('timerSheetToggle');
  const timerSheetPlus15 = document.getElementById('timerSheetPlus15');
  const timerSheetMinus15 = document.getElementById('timerSheetMinus15');

  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 44; // r = 44 in svg

  function updateRestTimerUI() {
    const formatted = formatTime(restTimer.remainingSeconds);
    timerDigits.textContent = formatted;
    bigTimerText.textContent = formatted;

    const progressPercent = restTimer.totalSeconds > 0
      ? (restTimer.remainingSeconds / restTimer.totalSeconds)
      : 0;

    timerProgressBg.style.width = `${progressPercent * 100}%`;
    const offset = CIRCLE_CIRCUMFERENCE * (1 - progressPercent);
    timerCircleFg.style.strokeDashoffset = offset;

    const icon = restTimer.isRunning ? '⏸' : '▶';
    timerPlayPauseBtn.textContent = icon;
    timerSheetToggle.textContent = restTimer.isRunning ? 'Пауза' : 'Продолжить';
  }

  function tickRestTimer() {
    if (restTimer.remainingSeconds > 1) {
      restTimer.remainingSeconds -= 1;
      updateRestTimerUI();
    } else {
      restTimer.remainingSeconds = 0;
      updateRestTimerUI();
      stopRestTimer(false);

      playCozyChime();
      triggerVibration();

      restTimerBar.style.boxShadow = '0 0 25px #10b981';
      setTimeout(() => {
        restTimerBar.style.boxShadow = '';
      }, 3000);
    }
  }

  function startRestTimer(seconds) {
    initAudio();
    if (seconds) {
      restTimer.totalSeconds = seconds;
      restTimer.remainingSeconds = seconds;
    }
    if (restTimer.interval) clearInterval(restTimer.interval);

    restTimer.isRunning = true;
    restTimerBar.classList.remove('hidden');
    updateRestTimerUI();

    restTimer.interval = setInterval(tickRestTimer, 1000);
  }

  function pauseRestTimer() {
    if (restTimer.interval) clearInterval(restTimer.interval);
    restTimer.isRunning = false;
    updateRestTimerUI();
  }

  function stopRestTimer(hideBar = true) {
    if (restTimer.interval) clearInterval(restTimer.interval);
    restTimer.isRunning = false;
    if (hideBar) {
      restTimerBar.classList.add('hidden');
      closeModal('modalRestTimer');
    }
    updateRestTimerUI();
  }

  function adjustRestTimer(secondsDelta) {
    restTimer.remainingSeconds = Math.max(5, restTimer.remainingSeconds + secondsDelta);
    if (restTimer.remainingSeconds > restTimer.totalSeconds) {
      restTimer.totalSeconds = restTimer.remainingSeconds;
    }
    updateRestTimerUI();
  }

  timerPlayPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (restTimer.isRunning) pauseRestTimer();
    else startRestTimer();
  });

  timerStopBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    stopRestTimer(true);
  });

  timerPlus15Btn.addEventListener('click', (e) => {
    e.stopPropagation();
    adjustRestTimer(15);
  });

  timerInfoTap.addEventListener('click', () => {
    openModal('modalRestTimer');
  });

  timerSheetToggle.addEventListener('click', () => {
    if (restTimer.isRunning) pauseRestTimer();
    else startRestTimer();
  });

  timerSheetPlus15.addEventListener('click', () => adjustRestTimer(15));
  timerSheetMinus15.addEventListener('click', () => adjustRestTimer(-15));

  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sec = parseInt(btn.dataset.sec, 10);
      startRestTimer(sec);
    });
  });

  // ==========================================================================
  // 6. Workout Hub & Custom Programs
  // ==========================================================================

  const hubActiveResumeBanner = document.getElementById('hubActiveResumeBanner');
  const hubActiveTitle = document.getElementById('hubActiveTitle');
  const hubActiveTimer = document.getElementById('hubActiveTimer');
  const hubResumeBtn = document.getElementById('hubResumeBtn');
  const startFreeWorkoutBtn = document.getElementById('startFreeWorkoutBtn');
  const myTemplatesList = document.getElementById('myTemplatesList');
  const hubTemplatesList = document.getElementById('hubTemplatesList');
  const createCustomTemplateBtn = document.getElementById('createCustomTemplateBtn');

  // Custom Template Modal elements
  const newTemplateTitle = document.getElementById('newTemplateTitle');
  const newTemplateDesc = document.getElementById('newTemplateDesc');
  const addExToNewTemplateBtn = document.getElementById('addExToNewTemplateBtn');
  const newTemplateExercisesList = document.getElementById('newTemplateExercisesList');
  const saveCustomTemplateBtn = document.getElementById('saveCustomTemplateBtn');

  function renderWorkoutHub() {
    if (activeWorkout) {
      hubActiveResumeBanner.classList.remove('hidden');
      hubActiveTitle.textContent = activeWorkout.title;
      const elapsedSec = Math.floor((Date.now() - activeWorkout.startTime) / 1000);
      hubActiveTimer.textContent = formatTime(elapsedSec);
    } else {
      hubActiveResumeBanner.classList.add('hidden');
    }

    // 1. User's Custom Programs (Мои программы)
    myTemplatesList.innerHTML = '';
    if (customTemplates.length === 0) {
      myTemplatesList.innerHTML = `
        <div class="empty-state small-empty">
          <p>У вас пока нет своих программ.<br>Нажмите <strong>«+ Создать»</strong>, чтобы собрать тренировку под себя (например, для турников на пляже).</p>
        </div>
      `;
    } else {
      customTemplates.forEach((tpl) => {
        const card = document.createElement('div');
        card.className = 'template-card';

        const chipsHtml = tpl.exercises
          .map((ex) => `<span class="template-ex-chip">${ex.name}${ex.isBodyweight ? ' (Свой вес)' : ''}</span>`)
          .join('');

        card.innerHTML = `
          <div class="template-card-header">
            <h3 class="template-title">${tpl.title}</h3>
            <span class="badge" style="font-size:0.75rem;">Моя программа</span>
          </div>
          <p class="template-desc">${tpl.desc}</p>
          <div class="template-exercises-chips">${chipsHtml}</div>
          <div class="template-card-footer">
            <button class="template-start-btn" data-tpl-id="${tpl.id}">
              Начать эту программу ➔
            </button>
            <button class="template-delete-btn" data-tpl-id="${tpl.id}" title="Удалить программу">🗑</button>
          </div>
        `;

        card.querySelector('.template-start-btn').onclick = () => {
          if (activeWorkout) {
            if (!confirm('Сейчас активна другая тренировка. Сбросить её и начать выбранную программу?')) {
              return;
            }
          }
          startWorkoutFromTemplate(tpl);
        };

        card.querySelector('.template-delete-btn').onclick = () => {
          if (confirm(`Удалить программу «${tpl.title}»?`)) {
            customTemplates = customTemplates.filter((t) => t.id !== tpl.id);
            saveCustomTemplates();
            renderWorkoutHub();
          }
        };

        myTemplatesList.appendChild(card);
      });
    }

    // 2. Built-in Program Templates (Базовые программы)
    hubTemplatesList.innerHTML = '';
    BUILTIN_TEMPLATES.forEach((tpl) => {
      const card = document.createElement('div');
      card.className = 'template-card';

      const chipsHtml = tpl.exercises
        .map((ex) => `<span class="template-ex-chip">${ex.name}${ex.isBodyweight ? ' (Свой вес)' : ''}</span>`)
        .join('');

      card.innerHTML = `
        <div class="template-card-header">
          <h3 class="template-title">${tpl.title}</h3>
        </div>
        <p class="template-desc">${tpl.desc}</p>
        <div class="template-exercises-chips">${chipsHtml}</div>
        <div class="template-card-footer">
          <button class="template-start-btn" data-tpl-id="${tpl.id}">
            Начать эту программу ➔
          </button>
        </div>
      `;

      card.querySelector('.template-start-btn').onclick = () => {
        if (activeWorkout) {
          if (!confirm('Сейчас активна другая тренировка. Сбросить её и начать выбранную программу?')) {
            return;
          }
        }
        startWorkoutFromTemplate(tpl);
      };

      hubTemplatesList.appendChild(card);
    });
  }

  function startWorkoutFromTemplate(tpl) {
    const preloadedExercises = tpl.exercises.map((tplEx) => {
      const isBW = !!tplEx.isBodyweight;
      let w = isBW ? 0 : (tplEx.defaultWeight || 20);
      let r = tplEx.defaultReps || 10;

      const prevStr = findPreviousPerformance(tplEx.name);
      if (prevStr) {
        if (prevStr.includes('Свой вес')) {
          const matchPlus = prevStr.match(/\+([0-9.]+)\s*кг/);
          w = matchPlus ? parseFloat(matchPlus[1]) : 0;
          const matchReps = prevStr.match(/×\s*([0-9]+)/);
          r = matchReps ? parseInt(matchReps[1], 10) : r;
        } else {
          const match = prevStr.match(/([0-9.]+)\s*кг\s*×\s*([0-9]+)/);
          if (match) {
            w = parseFloat(match[1]);
            r = parseInt(match[2], 10);
          }
        }
      }

      return {
        id: tplEx.id || ('ex_' + Date.now() + Math.random()),
        name: tplEx.name,
        muscle: tplEx.muscle,
        isBodyweight: isBW,
        sets: [
          { weight: w, reps: r, isBodyweight: isBW, completed: false },
          { weight: w, reps: r, isBodyweight: isBW, completed: false },
          { weight: w, reps: r, isBodyweight: isBW, completed: false }
        ]
      };
    });

    startNewWorkout(tpl.title, preloadedExercises);
  }

  startFreeWorkoutBtn.onclick = () => {
    if (activeWorkout) {
      if (!confirm('Сейчас активна другая тренировка. Сбросить её и начать новую свободную тренировку?')) {
        return;
      }
    }
    startNewWorkout('Свободная тренировка', []);
  };

  hubResumeBtn.onclick = () => {
    switchView('viewActive');
  };

  // Custom Template Creation Logic
  function renderTemplateBuilderList() {
    newTemplateExercisesList.innerHTML = '';
    if (templateBuilderExercises.length === 0) {
      newTemplateExercisesList.innerHTML = `
        <div class="empty-state small-empty" id="templateBuilderEmpty">
          <p>Нажмите <strong>«+ Упражнение»</strong> выше, чтобы собрать программу</p>
        </div>
      `;
      return;
    }

    templateBuilderExercises.forEach((ex, idx) => {
      const item = document.createElement('div');
      item.className = 'template-builder-item';
      item.innerHTML = `
        <div>
          <span class="template-builder-item-name">${ex.name}</span>
          <span class="template-builder-item-tag">${ex.muscle}${ex.isBodyweight ? ' • Свой вес' : ''}</span>
        </div>
        <button type="button" class="template-builder-remove" data-idx="${idx}" title="Удалить из программы">✕</button>
      `;

      item.querySelector('.template-builder-remove').onclick = () => {
        templateBuilderExercises.splice(idx, 1);
        renderTemplateBuilderList();
      };

      newTemplateExercisesList.appendChild(item);
    });
  }

  createCustomTemplateBtn.onclick = () => {
    newTemplateTitle.value = '';
    newTemplateDesc.value = '';
    templateBuilderExercises = [];
    renderTemplateBuilderList();
    openModal('modalCreateTemplate');
  };

  addExToNewTemplateBtn.onclick = () => {
    isSelectingForTemplateBuilder = true;
    openExerciseSelector();
  };

  saveCustomTemplateBtn.onclick = () => {
    const title = newTemplateTitle.value.trim();
    if (!title) {
      alert('Пожалуйста, введите название программы (например, «Турники на пляже»).');
      return;
    }
    if (templateBuilderExercises.length === 0) {
      alert('Добавьте хотя бы одно упражнение в программу.');
      return;
    }

    const newTpl = {
      id: 'custom_tpl_' + Date.now(),
      title: title,
      desc: newTemplateDesc.value.trim() || 'Пользовательская программа',
      isCustom: true,
      exercises: templateBuilderExercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        muscle: ex.muscle,
        isBodyweight: !!ex.isBodyweight,
        defaultWeight: ex.isBodyweight ? 0 : 20,
        defaultReps: 10
      }))
    };

    customTemplates.push(newTpl);
    saveCustomTemplates();
    closeModal('modalCreateTemplate');
    renderWorkoutHub();
  };

  // ==========================================================================
  // 7. Active Workout Logic
  // ==========================================================================

  const activeWorkoutTitleInput = document.getElementById('activeWorkoutTitle');
  const activeExercisesList = document.getElementById('activeExercisesList');
  const startWorkoutBtn = document.getElementById('startWorkoutBtn');
  const finishWorkoutBtn = document.getElementById('finishWorkoutBtn');
  const cancelWorkoutBtn = document.getElementById('cancelWorkoutBtn');
  const addExerciseBtn = document.getElementById('addExerciseBtn');
  const bottomAddExerciseBtn = document.getElementById('bottomAddExerciseBtn');

  function startNewWorkout(customTitle = null, preloadedExercises = null) {
    initAudio();
    const defaultName = customTitle || `Тренировка ${new Date().toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })}`;

    activeWorkout = {
      id: 'w_' + Date.now(),
      title: defaultName,
      startTime: Date.now(),
      exercises: preloadedExercises || []
    };

    saveActiveWorkout();
    activeDot.classList.remove('hidden');
    document.getElementById('startBtnText').textContent = 'Продолжить текущую тренировку';
    switchView('viewActive');
  }

  function renderActiveWorkout() {
    if (!activeWorkout) {
      switchView('viewWorkoutHub');
      return;
    }

    activeWorkoutTitleInput.value = activeWorkout.title;
    startWorkoutStopwatch();

    activeExercisesList.innerHTML = '';

    if (activeWorkout.exercises.length === 0) {
      activeExercisesList.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🏋️</span>
          <p>В тренировке пока нет упражнений.<br>Нажмите <strong>«+ Упражнение»</strong>, чтобы добавить первое!</p>
        </div>
      `;
      return;
    }

    activeWorkout.exercises.forEach((exItem, exIndex) => {
      const card = document.createElement('div');
      card.className = 'exercise-card';

      const prevHint = findPreviousPerformance(exItem.name);
      const prevHintHtml = prevHint ? `<span class="exercise-prev-hint">Пред: ${prevHint}</span>` : '';

      card.innerHTML = `
        <div class="exercise-header">
          <div class="exercise-title-wrap">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="exercise-name">${exItem.name}</span>
              <button type="button" class="exercise-info-btn" data-ex-name="${exItem.name}" data-ex-muscle="${exItem.muscle}" title="Техника и подсказки">ℹ️</button>
            </div>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span class="exercise-muscle-tag">${exItem.muscle}</span>
              <button type="button" class="bw-toggle-btn ${exItem.isBodyweight ? 'active' : ''}" data-ex-idx="${exIndex}" title="Переключить режим веса">
                ${exItem.isBodyweight ? '⚡ Свой вес' : '🏋️ С отягощением'}
              </button>
              ${prevHintHtml}
            </div>
          </div>
          <button class="remove-exercise-btn" data-ex-idx="${exIndex}" title="Удалить упражнение">✕</button>
        </div>

        <div class="sets-table">
          <div class="sets-table-header">
            <div>Сет</div>
            <div>${exItem.isBodyweight ? 'Свой вес / Доп' : 'Вес (кг)'}</div>
            <div>Повт</div>
            <div>Готово</div>
          </div>
          <div class="sets-rows-container" id="setsContainer_${exIndex}">
            <!-- Sets rows will be rendered here -->
          </div>
        </div>

        <button class="add-set-btn" data-ex-idx="${exIndex}">+ Добавить подход</button>
      `;

      const setsContainer = card.querySelector(`#setsContainer_${exIndex}`);

      exItem.sets.forEach((set, setIndex) => {
        let weightDisplay = '';
        let isBwClass = '';

        if (exItem.isBodyweight) {
          if (!set.weight || set.weight === 0) {
            weightDisplay = 'Свой вес';
            isBwClass = 'is-bw';
          } else {
            weightDisplay = `+${set.weight}`;
            isBwClass = 'is-bw';
          }
        } else {
          weightDisplay = (set.weight !== undefined && set.weight !== null && set.weight !== '') ? set.weight : '';
        }

        const repsDisplay = (set.reps !== undefined && set.reps !== null && set.reps !== '') ? set.reps : '';

        const row = document.createElement('div');
        row.className = `set-row ${set.completed ? 'completed' : ''}`;
        row.dataset.exIdx = exIndex;
        row.dataset.setIdx = setIndex;

        row.innerHTML = `
          <div class="set-num-badge">${setIndex + 1}</div>

          <!-- Weight Stepper Cell -->
          <div class="stepper-cell weight-cell">
            <div class="stepper-box">
              <button type="button" class="stepper-btn minus-btn" data-action="minus" data-type="weight" data-ex-idx="${exIndex}" data-set-idx="${setIndex}" aria-label="Уменьшить вес">−</button>
              <div class="stepper-input-wrap">
                <input type="text" inputmode="decimal" class="set-input set-weight-input ${isBwClass}" 
                       data-ex-idx="${exIndex}" data-set-idx="${setIndex}" 
                       value="${weightDisplay}" placeholder="${exItem.isBodyweight ? 'Свой вес' : '0'}">
              </div>
              <button type="button" class="stepper-btn plus-btn" data-action="plus" data-type="weight" data-ex-idx="${exIndex}" data-set-idx="${setIndex}" aria-label="Увеличить вес">+</button>
            </div>
          </div>

          <!-- Reps Stepper Cell -->
          <div class="stepper-cell reps-cell">
            <div class="stepper-box">
              <button type="button" class="stepper-btn minus-btn" data-action="minus" data-type="reps" data-ex-idx="${exIndex}" data-set-idx="${setIndex}" aria-label="Уменьшить повторения">−</button>
              <div class="stepper-input-wrap">
                <input type="number" inputmode="numeric" class="set-input set-reps-input" 
                       data-ex-idx="${exIndex}" data-set-idx="${setIndex}" 
                       value="${repsDisplay}" placeholder="0">
              </div>
              <button type="button" class="stepper-btn plus-btn" data-action="plus" data-type="reps" data-ex-idx="${exIndex}" data-set-idx="${setIndex}" aria-label="Увеличить повторения">+</button>
            </div>
          </div>

          <!-- Completed Checkbox Button -->
          <button type="button" class="set-check-btn" data-ex-idx="${exIndex}" data-set-idx="${setIndex}" aria-label="Отметить подход">
            ${set.completed ? '✓' : '○'}
          </button>
        `;

        setsContainer.appendChild(row);
      });

      activeExercisesList.appendChild(card);
    });

    attachActiveWorkoutEvents();
  }

  function attachActiveWorkoutEvents() {
    activeWorkoutTitleInput.oninput = (e) => {
      if (activeWorkout) {
        activeWorkout.title = e.target.value;
        saveActiveWorkout();
      }
    };

    // Exercise info button
    document.querySelectorAll('.exercise-info-btn').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        openExerciseInfoModal(btn.dataset.exName, btn.dataset.exMuscle);
      };
    });

    // Bodyweight toggle
    document.querySelectorAll('.bw-toggle-btn').forEach((btn) => {
      btn.onclick = () => {
        const exIdx = parseInt(btn.dataset.exIdx, 10);
        const ex = activeWorkout.exercises[exIdx];
        ex.isBodyweight = !ex.isBodyweight;

        ex.sets.forEach((s) => {
          s.isBodyweight = ex.isBodyweight;
          if (ex.isBodyweight && (!s.weight || s.weight <= 0)) {
            s.weight = 0;
          }
        });

        saveActiveWorkout();
        renderActiveWorkout();
      };
    });

    // Steppers
    document.querySelectorAll('.stepper-btn').forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        const type = btn.dataset.type;
        const exIdx = parseInt(btn.dataset.exIdx, 10);
        const setIdx = parseInt(btn.dataset.setIdx, 10);
        const exercise = activeWorkout.exercises[exIdx];
        const targetSet = exercise.sets[setIdx];
        const row = btn.closest('.set-row');

        if (type === 'weight') {
          const isBW = !!exercise.isBodyweight;
          let currentWeight = parseFloat(targetSet.weight) || 0;

          if (isBW) {
            if (action === 'plus') {
              currentWeight = Math.round((currentWeight + 2.5) * 10) / 10;
            } else {
              if (currentWeight <= 2.5) {
                currentWeight = 0;
              } else {
                currentWeight = Math.round((currentWeight - 2.5) * 10) / 10;
              }
            }
            targetSet.weight = currentWeight;
            const input = row.querySelector('.set-weight-input');
            input.value = currentWeight === 0 ? 'Свой вес' : `+${currentWeight}`;
            input.classList.toggle('is-bw', true);
          } else {
            if (action === 'plus') {
              currentWeight = Math.round((currentWeight + 2.5) * 10) / 10;
            } else {
              currentWeight = Math.max(0, Math.round((currentWeight - 2.5) * 10) / 10);
            }
            targetSet.weight = currentWeight;
            const input = row.querySelector('.set-weight-input');
            input.value = currentWeight;
            input.classList.toggle('is-bw', false);
          }
          saveActiveWorkout();
        } else if (type === 'reps') {
          let currentReps = parseInt(targetSet.reps, 10) || 0;
          if (action === 'plus') {
            currentReps += 1;
          } else {
            currentReps = Math.max(0, currentReps - 1);
          }
          targetSet.reps = currentReps;
          const input = row.querySelector('.set-reps-input');
          input.value = currentReps;
          saveActiveWorkout();
        }
      };
    });

    // Direct Weight input
    document.querySelectorAll('.set-weight-input').forEach((input) => {
      input.oninput = (e) => {
        const exIdx = parseInt(e.target.dataset.exIdx, 10);
        const setIdx = parseInt(e.target.dataset.setIdx, 10);
        const exercise = activeWorkout.exercises[exIdx];
        const targetSet = exercise.sets[setIdx];
        const raw = e.target.value.trim().toLowerCase();

        if (exercise.isBodyweight) {
          if (raw.includes('свой') || raw.includes('вес') || raw === 'св' || raw === 'cb' || raw === '0' || raw === '') {
            targetSet.weight = 0;
          } else {
            const cleaned = raw.replace('+', '').replace('кг', '').trim();
            targetSet.weight = parseFloat(cleaned) || 0;
          }
        } else {
          targetSet.weight = parseFloat(raw) || 0;
        }
        saveActiveWorkout();
      };

      input.onblur = (e) => {
        const exIdx = parseInt(e.target.dataset.exIdx, 10);
        const setIdx = parseInt(e.target.dataset.setIdx, 10);
        const exercise = activeWorkout.exercises[exIdx];
        const targetSet = exercise.sets[setIdx];

        if (exercise.isBodyweight) {
          e.target.value = (!targetSet.weight || targetSet.weight === 0) ? 'Свой вес' : `+${targetSet.weight}`;
          e.target.classList.toggle('is-bw', true);
        }
      };
    });

    // Direct Reps input
    document.querySelectorAll('.set-reps-input').forEach((input) => {
      input.oninput = (e) => {
        const exIdx = parseInt(e.target.dataset.exIdx, 10);
        const setIdx = parseInt(e.target.dataset.setIdx, 10);
        const val = parseInt(e.target.value, 10) || 0;
        if (activeWorkout && activeWorkout.exercises[exIdx] && activeWorkout.exercises[exIdx].sets[setIdx]) {
          activeWorkout.exercises[exIdx].sets[setIdx].reps = val;
          saveActiveWorkout();
        }
      };
    });

    // Check set button
    document.querySelectorAll('.set-check-btn').forEach((btn) => {
      btn.onclick = () => {
        const exIdx = parseInt(btn.dataset.exIdx, 10);
        const setIdx = parseInt(btn.dataset.setIdx, 10);
        const targetSet = activeWorkout.exercises[exIdx].sets[setIdx];

        targetSet.completed = !targetSet.completed;
        saveActiveWorkout();
        renderActiveWorkout();

        if (targetSet.completed && settings.autoRest) {
          startRestTimer(settings.defaultRestSec);
        }
      };
    });

    // Add set button
    document.querySelectorAll('.add-set-btn').forEach((btn) => {
      btn.onclick = () => {
        const exIdx = parseInt(btn.dataset.exIdx, 10);
        const exercise = activeWorkout.exercises[exIdx];
        const lastSet = exercise.sets[exercise.sets.length - 1];

        const newWeight = lastSet ? lastSet.weight : (exercise.isBodyweight ? 0 : 20);
        const newReps = lastSet ? lastSet.reps : 10;

        exercise.sets.push({
          weight: newWeight,
          reps: newReps,
          isBodyweight: !!exercise.isBodyweight,
          completed: false
        });

        saveActiveWorkout();
        renderActiveWorkout();
      };
    });

    // Remove exercise button
    document.querySelectorAll('.remove-exercise-btn').forEach((btn) => {
      btn.onclick = () => {
        const exIdx = parseInt(btn.dataset.exIdx, 10);
        if (confirm(`Удалить упражнение «${activeWorkout.exercises[exIdx].name}» из тренировки?`)) {
          activeWorkout.exercises.splice(exIdx, 1);
          saveActiveWorkout();
          renderActiveWorkout();
        }
      };
    });
  }

  function addExerciseToActiveWorkout(exercise) {
    if (!activeWorkout) return;

    const isBW = !!exercise.isBodyweight;
    let defaultWeight = isBW ? 0 : 20;
    let defaultReps = 10;

    const prevStr = findPreviousPerformance(exercise.name);
    if (prevStr) {
      if (prevStr.includes('Свой вес')) {
        const matchPlus = prevStr.match(/\+([0-9.]+)\s*кг/);
        defaultWeight = matchPlus ? parseFloat(matchPlus[1]) : 0;
        const matchReps = prevStr.match(/×\s*([0-9]+)/);
        defaultReps = matchReps ? parseInt(matchReps[1], 10) : defaultReps;
      } else {
        const match = prevStr.match(/([0-9.]+)\s*кг\s*×\s*([0-9]+)/);
        if (match) {
          defaultWeight = parseFloat(match[1]);
          defaultReps = parseInt(match[2], 10);
        }
      }
    }

    activeWorkout.exercises.push({
      id: exercise.id,
      name: exercise.name,
      muscle: exercise.muscle,
      isBodyweight: isBW,
      sets: [
        { weight: defaultWeight, reps: defaultReps, isBodyweight: isBW, completed: false },
        { weight: defaultWeight, reps: defaultReps, isBodyweight: isBW, completed: false },
        { weight: defaultWeight, reps: defaultReps, isBodyweight: isBW, completed: false }
      ]
    });

    saveActiveWorkout();
    closeModal('modalSelectExercise');
    renderActiveWorkout();
  }

  // ==========================================================================
  // 8. Exercise Info Modal Logic
  // ==========================================================================

  const infoModalExName = document.getElementById('infoModalExName');
  const infoModalMuscleTag = document.getElementById('infoModalMuscleTag');
  const infoModalMuscles = document.getElementById('infoModalMuscles');
  const infoModalTechnique = document.getElementById('infoModalTechnique');
  const infoModalTips = document.getElementById('infoModalTips');

  function openExerciseInfoModal(name, muscle) {
    infoModalExName.textContent = name;
    infoModalMuscleTag.textContent = muscle || 'Мышцы';

    const all = getAllExercises();
    const found = all.find((e) => e.name.toLowerCase() === name.toLowerCase());
    const guideKey = found ? found.id : null;
    const guide = EXERCISE_GUIDES[guideKey];

    if (guide) {
      infoModalMuscles.textContent = guide.muscles;
      infoModalTechnique.innerHTML = guide.steps.map((s) => `<li>${s}</li>`).join('');
      infoModalTips.textContent = guide.tips;
    } else {
      infoModalMuscles.textContent = `Целевая группа: ${muscle || 'Основные рабочие мышцы'}.`;
      infoModalTechnique.innerHTML = `
        <li>Займите устойчивое исходное положение, напрягите мышцы кора.</li>
        <li>Выполняйте позитивную фазу (усилие) на выдохе.</li>
        <li>Плавно возвращайтесь в исходную точку на вдохе под полным мышечным контролем.</li>
      `;
      infoModalTips.textContent = 'Следите за техникой дыхания и безопасностью суставов. Не используйте чрезмерные веса в ущерб правильной траектории.';
    }

    openModal('modalExerciseInfo');
  }

  // ==========================================================================
  // 9. Calendar & History Logic (with Drill-Down Accordion)
  // ==========================================================================

  const historyModeCalendarBtn = document.getElementById('historyModeCalendarBtn');
  const historyModeListBtn = document.getElementById('historyModeListBtn');
  const calendarSubView = document.getElementById('calendarSubView');
  const listSubView = document.getElementById('listSubView');

  const calMonthTitle = document.getElementById('calMonthTitle');
  const calPrevMonthBtn = document.getElementById('calPrevMonthBtn');
  const calNextMonthBtn = document.getElementById('calNextMonthBtn');
  const calendarDaysGrid = document.getElementById('calendarDaysGrid');
  const selectedDayHeading = document.getElementById('selectedDayHeading');
  const selectedDayWorkoutsList = document.getElementById('selectedDayWorkoutsList');
  const historyList = document.getElementById('historyList');

  const MONTH_NAMES_RU = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  historyModeCalendarBtn.onclick = () => {
    historyViewMode = 'calendar';
    historyModeCalendarBtn.classList.add('active');
    historyModeListBtn.classList.remove('active');
    calendarSubView.classList.remove('hidden');
    listSubView.classList.add('hidden');
    renderCalendar();
  };

  historyModeListBtn.onclick = () => {
    historyViewMode = 'list';
    historyModeListBtn.classList.add('active');
    historyModeCalendarBtn.classList.remove('active');
    calendarSubView.classList.add('hidden');
    listSubView.classList.remove('hidden');
    renderHistoryList();
  };

  calPrevMonthBtn.onclick = () => {
    calendarMonth -= 1;
    if (calendarMonth < 0) {
      calendarMonth = 11;
      calendarYear -= 1;
    }
    renderCalendar();
  };

  calNextMonthBtn.onclick = () => {
    calendarMonth += 1;
    if (calendarMonth > 11) {
      calendarMonth = 0;
      calendarYear += 1;
    }
    renderCalendar();
  };

  function renderHistoryAndCalendar() {
    document.getElementById('historyCountBadge').textContent = String(historyData.length);
    if (historyViewMode === 'calendar') {
      renderCalendar();
    } else {
      renderHistoryList();
    }
  }

  function renderCalendar() {
    calMonthTitle.textContent = `${MONTH_NAMES_RU[calendarMonth]} ${calendarYear}`;
    calendarDaysGrid.innerHTML = '';

    // Set of dates with workouts (YYYY-MM-DD)
    const workoutDatesMap = {};
    historyData.forEach((w) => {
      const d = w.date.slice(0, 10);
      if (!workoutDatesMap[d]) workoutDatesMap[d] = [];
      workoutDatesMap[d].push(w);
    });

    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1);
    const daysInCurrentMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    // Monday-based day of week (0 = Mon, 6 = Sun)
    let startDay = firstDayOfMonth.getDay() - 1;
    if (startDay === -1) startDay = 6;

    const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();

    // Pad days from previous month
    for (let i = startDay - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell other-month';
      cell.textContent = String(dayNum);
      calendarDaysGrid.appendChild(cell);
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    // Days in current month
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell';
      cell.textContent = String(day);

      const monthStr = String(calendarMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateKey = `${calendarYear}-${monthStr}-${dayStr}`;

      if (dateKey === todayStr) {
        cell.classList.add('today');
      }

      if (dateKey === selectedCalendarDateStr) {
        cell.classList.add('selected');
      }

      if (workoutDatesMap[dateKey]) {
        cell.classList.add('has-workout');
        const dot = document.createElement('span');
        dot.className = 'cal-workout-dot';
        cell.appendChild(dot);
      }

      cell.onclick = () => {
        selectedCalendarDateStr = dateKey;
        renderCalendar();
      };

      calendarDaysGrid.appendChild(cell);
    }

    renderSelectedDayWorkouts(selectedCalendarDateStr);
  }

  function renderSelectedDayWorkouts(dateKey) {
    const formattedDate = new Date(dateKey + 'T12:00:00').toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      weekday: 'short'
    });
    selectedDayHeading.textContent = `Тренировки: ${formattedDate}`;

    selectedDayWorkoutsList.innerHTML = '';
    const dayWorkouts = historyData.filter((w) => w.date.slice(0, 10) === dateKey);

    if (dayWorkouts.length === 0) {
      selectedDayWorkoutsList.innerHTML = `
        <div class="empty-state small-empty">
          <p>В этот день тренировок не записано.<br>Нажмите на день с зелёной точкой, чтобы увидеть отчёт.</p>
        </div>
      `;
      return;
    }

    dayWorkouts.forEach((w) => {
      selectedDayWorkoutsList.appendChild(createHistoryCardElement(w));
    });
  }

  function renderHistoryList() {
    historyList.innerHTML = '';
    if (historyData.length === 0) {
      historyList.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📜</span>
          <p>История тренировок пуста.<br>После завершения тренировки она появится здесь.</p>
        </div>
      `;
      return;
    }

    historyData.forEach((item) => {
      historyList.appendChild(createHistoryCardElement(item));
    });
  }

  // Creates detailed history card with drill-down accordion!
  function createHistoryCardElement(item) {
    const card = document.createElement('div');
    card.className = 'history-card';

    const dateFormatted = new Date(item.date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });

    const exercisesSummary = item.exercises
      .map((ex) => {
        const completedSetsCount = ex.sets.filter((s) => s.completed).length;
        const bwTag = ex.isBodyweight ? ' (Свой вес)' : '';
        return `${ex.name} (${completedSetsCount}${bwTag})`;
      })
      .join(' • ');

    // Detailed sets breakdown HTML for accordion
    const drilldownBlocksHtml = item.exercises.map((ex) => {
      const setsRowsHtml = ex.sets.map((s, sIdx) => {
        let weightStr = '';
        if (ex.isBodyweight) {
          weightStr = (!s.weight || s.weight === 0) ? 'Свой вес' : `+${s.weight} кг`;
        } else {
          weightStr = `${s.weight} кг`;
        }

        return `
          <div class="drilldown-set-row">
            <span class="drilldown-set-badge">Сет ${sIdx + 1}</span>
            <span class="drilldown-set-val">${weightStr} × ${s.reps}</span>
            <span>${s.completed ? '✓' : '○'}</span>
          </div>
        `;
      }).join('');

      return `
        <div class="drilldown-ex-block">
          <div class="drilldown-ex-title">
            <span>${ex.name}</span>
            <span class="exercise-muscle-tag">${ex.muscle}</span>
          </div>
          <div class="drilldown-sets-list">
            ${setsRowsHtml}
          </div>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <div class="history-card-header">
        <div class="history-card-top-row">
          <div>
            <div class="history-title">${item.title}</div>
            <div class="history-date">${dateFormatted}</div>
          </div>
          <button class="toggle-drilldown-btn" type="button">
            <span>Детали</span>
            <span class="drilldown-arrow">▾</span>
          </button>
        </div>
      </div>

      <div class="history-stats-chips">
        <span class="history-stat-chip">⏱️ <strong>${formatTime(item.durationSec || 0)}</strong></span>
        <span class="history-stat-chip">⚡ <strong>${item.totalSets || 0}</strong> подх.</span>
        <span class="history-stat-chip">🏋️ <strong>${(item.tonnage || 0).toLocaleString('ru-RU')}</strong> кг</span>
      </div>

      <div class="history-exercises-summary">
        ${exercisesSummary || 'Без упражнений'}
      </div>

      ${item.notes ? `<div style="margin-top:8px; font-size:0.85rem; color:var(--accent-gold);">💬 ${item.notes}</div>` : ''}

      <!-- Expandable Accordion Drill-Down -->
      <div class="history-drilldown hidden">
        <div style="font-size:0.8rem; font-weight:700; color:var(--accent-gold); text-transform:uppercase; margin-bottom:4px;">
          📋 Подробный журнал подходов:
        </div>
        ${drilldownBlocksHtml}
        <div class="history-card-actions" style="margin-top:12px;">
          <button class="secondary-btn small-btn repeat-workout-btn" data-id="${item.id}">Повторить тренировку ⚡</button>
          <button class="danger-icon-btn delete-workout-btn" data-id="${item.id}" title="Удалить из истории">🗑</button>
        </div>
      </div>
    `;

    // Accordion toggle handler
    const header = card.querySelector('.history-card-header');
    const drilldown = card.querySelector('.history-drilldown');
    const arrow = card.querySelector('.drilldown-arrow');

    header.onclick = () => {
      const isHidden = drilldown.classList.contains('hidden');
      if (isHidden) {
        drilldown.classList.remove('hidden');
        arrow.textContent = '▴';
      } else {
        drilldown.classList.add('hidden');
        arrow.textContent = '▾';
      }
    };

    // Repeat workout
    card.querySelector('.repeat-workout-btn').onclick = (e) => {
      e.stopPropagation();
      if (activeWorkout) {
        if (!confirm('Сейчас активна другая тренировка. Заменить её этой программой?')) return;
      }

      const clonedExercises = item.exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        muscle: ex.muscle,
        isBodyweight: !!ex.isBodyweight,
        sets: ex.sets.map((s) => ({
          weight: s.weight,
          reps: s.reps,
          isBodyweight: !!s.isBodyweight,
          completed: false
        }))
      }));

      startNewWorkout(item.title, clonedExercises);
    };

    // Delete workout
    card.querySelector('.delete-workout-btn').onclick = (e) => {
      e.stopPropagation();
      if (confirm(`Удалить тренировку «${item.title}» от ${dateFormatted}?`)) {
        historyData = historyData.filter((w) => w.id !== item.id);
        saveHistory();
        renderHome();
        renderHistoryAndCalendar();
      }
    };

    return card;
  }

  // ==========================================================================
  // 10. Athlete Profile & Bodyweight Tracker
  // ==========================================================================

  const profileNameInput = document.getElementById('profileNameInput');
  const profileGenderSelect = document.getElementById('profileGenderSelect');
  const profileHeightInput = document.getElementById('profileHeightInput');
  const profileWeightInput = document.getElementById('profileWeightInput');
  const bmiValueDisplay = document.getElementById('bmiValueDisplay');
  const bmiStatusText = document.getElementById('bmiStatusText');
  const recordWeightBtn = document.getElementById('recordWeightBtn');
  const weightLogChips = document.getElementById('weightLogChips');

  function calculateBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm || heightCm <= 0) return { val: '—', status: 'Заполните данные' };
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const valFormatted = bmi.toFixed(1);

    let status = 'Нормальный вес 👍';
    if (bmi < 18.5) status = 'Дефицит массы';
    else if (bmi >= 25 && bmi < 30) status = 'Избыточная масса';
    else if (bmi >= 30) status = 'Ожирение';

    return { val: valFormatted, status };
  }

  function renderProfile() {
    profileNameInput.value = profileData.name || 'Александр';
    profileGenderSelect.value = profileData.gender || 'male';
    profileHeightInput.value = profileData.height || 180;
    profileWeightInput.value = profileData.weight || 78.5;

    const bmi = calculateBMI(profileData.weight, profileData.height);
    bmiValueDisplay.textContent = bmi.val;
    bmiStatusText.textContent = bmi.status;

    // Weight history chips
    weightLogChips.innerHTML = '';
    const logs = profileData.weightLog || [];
    if (logs.length === 0) {
      weightLogChips.innerHTML = `<span style="font-size:0.8rem; color:var(--text-dim);">Пока нет записей веса</span>`;
    } else {
      logs.slice(-7).reverse().forEach((log) => {
        const chip = document.createElement('div');
        chip.className = 'weight-chip';
        const d = new Date(log.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        chip.innerHTML = `
          <span class="weight-chip-date">${d}</span>
          <span class="weight-chip-val">${log.weight} кг</span>
        `;
        weightLogChips.appendChild(chip);
      });
    }
  }

  profileNameInput.onchange = (e) => {
    profileData.name = e.target.value.trim() || 'Атлет';
    saveProfile();
  };

  profileGenderSelect.onchange = (e) => {
    profileData.gender = e.target.value;
    saveProfile();
  };

  profileHeightInput.oninput = (e) => {
    profileData.height = parseFloat(e.target.value) || 180;
    saveProfile();
    const bmi = calculateBMI(profileData.weight, profileData.height);
    bmiValueDisplay.textContent = bmi.val;
    bmiStatusText.textContent = bmi.status;
  };

  profileWeightInput.oninput = (e) => {
    profileData.weight = parseFloat(e.target.value) || 75;
    saveProfile();
    const bmi = calculateBMI(profileData.weight, profileData.height);
    bmiValueDisplay.textContent = bmi.val;
    bmiStatusText.textContent = bmi.status;
  };

  recordWeightBtn.onclick = () => {
    const currentWeight = parseFloat(profileWeightInput.value) || profileData.weight;
    if (!profileData.weightLog) profileData.weightLog = [];
    profileData.weightLog.push({
      date: new Date().toISOString(),
      weight: currentWeight
    });
    profileData.weight = currentWeight;
    saveProfile();
    renderProfile();
    alert(`Замер веса ${currentWeight} кг успешно сохранен! 📈`);
  };

  // ==========================================================================
  // 11. Home View & Stats
  // ==========================================================================

  function getWeekWorkoutsCount() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    return historyData.filter((w) => new Date(w.date) >= monday).length;
  }

  function getTotalTonnage() {
    return historyData.reduce((sum, w) => sum + (w.tonnage || 0), 0);
  }

  function renderHome() {
    document.getElementById('statTotalWorkouts').textContent = String(historyData.length);
    document.getElementById('statWeekWorkouts').textContent = String(getWeekWorkoutsCount());
    document.getElementById('statTotalTonnage').innerHTML = `${getTotalTonnage().toLocaleString('ru-RU')} <small>кг</small>`;

    if (activeWorkout) {
      document.getElementById('startBtnText').textContent = 'Продолжить текущую тренировку';
      activeDot.classList.remove('hidden');
    } else {
      document.getElementById('startBtnText').textContent = 'Выбрать тренировку';
      activeDot.classList.add('hidden');
    }

    const recentList = document.getElementById('recentWorkoutsList');
    recentList.innerHTML = '';

    if (historyData.length === 0) {
      recentList.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">☕</span>
          <p>Вы пока не записали ни одной тренировки.<br>Нажмите «Выбрать тренировку», чтобы зафиксировать первые успехи!</p>
        </div>
      `;
      return;
    }

    historyData.slice(0, 3).forEach((item) => {
      recentList.appendChild(createHistoryCardElement(item));
    });
  }

  document.getElementById('viewAllHistoryBtn').addEventListener('click', () => {
    switchView('viewHistory');
  });

  startWorkoutBtn.addEventListener('click', () => {
    if (activeWorkout) {
      switchView('viewActive');
    } else {
      switchView('viewWorkoutHub');
    }
  });

  // ==========================================================================
  // 12. Exercises Library View
  // ==========================================================================

  const exerciseSearchInput = document.getElementById('exerciseSearchInput');
  const muscleFilters = document.getElementById('muscleFilters');
  const libraryList = document.getElementById('libraryList');
  let librarySelectedMuscle = 'all';

  function renderExercisesLibrary() {
    const query = exerciseSearchInput.value.trim().toLowerCase();
    const all = getAllExercises();

    const filtered = all.filter((ex) => {
      const matchName = ex.name.toLowerCase().includes(query);
      const matchMuscle = librarySelectedMuscle === 'all' || ex.muscle === librarySelectedMuscle;
      return matchName && matchMuscle;
    });

    libraryList.innerHTML = '';
    if (filtered.length === 0) {
      libraryList.innerHTML = `<div class="empty-state"><p>Ничего не найдено</p></div>`;
      return;
    }

    filtered.forEach((ex) => {
      const item = document.createElement('div');
      item.className = 'library-item';
      item.innerHTML = `
        <div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="library-item-title">${ex.name}${ex.isBodyweight ? ' ⚡' : ''}</span>
            <button type="button" class="exercise-info-btn" data-ex-name="${ex.name}" data-ex-muscle="${ex.muscle}" title="Техника">ℹ️</button>
          </div>
          <div class="library-item-muscle">${ex.muscle}${ex.isBodyweight ? ' • Свой вес' : ''}</div>
        </div>
      `;

      item.querySelector('.exercise-info-btn').onclick = (e) => {
        e.stopPropagation();
        openExerciseInfoModal(ex.name, ex.muscle);
      };

      libraryList.appendChild(item);
    });
  }

  exerciseSearchInput.oninput = renderExercisesLibrary;

  muscleFilters.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.onclick = () => {
      muscleFilters.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      librarySelectedMuscle = chip.dataset.muscle;
      renderExercisesLibrary();
    };
  });

  // ==========================================================================
  // 13. Settings & Data Import/Export
  // ==========================================================================

  const settingSoundToggle = document.getElementById('settingSoundToggle');
  const settingVibrateToggle = document.getElementById('settingVibrateToggle');
  const settingDefaultRest = document.getElementById('settingDefaultRest');
  const settingAutoRestToggle = document.getElementById('settingAutoRestToggle');
  const testSoundBtn = document.getElementById('testSoundBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const exportDataBtn = document.getElementById('exportDataBtn');
  const importDataBtn = document.getElementById('importDataBtn');
  const importFileInput = document.getElementById('importFileInput');
  const clearDataBtn = document.getElementById('clearDataBtn');
  const installHelpBtn = document.getElementById('installHelpBtn');

  function applySettingsUI() {
    settingSoundToggle.checked = settings.sound;
    settingVibrateToggle.checked = settings.vibrate;
    settingDefaultRest.value = String(settings.defaultRestSec);
    settingAutoRestToggle.checked = settings.autoRest;

    if (settings.theme === 'light') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      themeIcon.textContent = '🌙';
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      themeIcon.textContent = '☀️';
    }
  }

  settingSoundToggle.onchange = (e) => {
    settings.sound = e.target.checked;
    saveSettings();
  };

  settingVibrateToggle.onchange = (e) => {
    settings.vibrate = e.target.checked;
    saveSettings();
  };

  settingDefaultRest.onchange = (e) => {
    settings.defaultRestSec = parseInt(e.target.value, 10);
    saveSettings();
  };

  settingAutoRestToggle.onchange = (e) => {
    settings.autoRest = e.target.checked;
    saveSettings();
  };

  testSoundBtn.onclick = () => {
    playCozyChime();
    triggerVibration();
  };

  themeToggleBtn.onclick = () => {
    settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
    saveSettings();
    applySettingsUI();
  };

  installHelpBtn.onclick = () => {
    openModal('modalInstallHelp');
  };

  // Export JSON
  exportDataBtn.onclick = () => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: profileData,
      history: historyData,
      customExercises: customExercises,
      customTemplates: customTemplates,
      settings: settings
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cozy_fitness_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  importDataBtn.onclick = () => {
    importFileInput.click();
  };

  importFileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.history && Array.isArray(data.history)) {
          historyData = data.history;
          saveHistory();
        }
        if (data.customExercises && Array.isArray(data.customExercises)) {
          customExercises = data.customExercises;
          saveCustomExercises();
        }
        if (data.customTemplates && Array.isArray(data.customTemplates)) {
          customTemplates = data.customTemplates;
          saveCustomTemplates();
        }
        if (data.profile) {
          profileData = Object.assign(profileData, data.profile);
          saveProfile();
        }
        if (data.settings) {
          settings = Object.assign(settings, data.settings);
          saveSettings();
          applySettingsUI();
        }
        alert('Данные успешно импортированы!');
        renderHome();
        renderWorkoutHub();
        renderHistoryAndCalendar();
        renderProfile();
        renderExercisesLibrary();
      } catch (err) {
        alert('Ошибка при чтении файла. Убедитесь, что это корректный JSON бэкап CozyFitness.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Clear data
  clearDataBtn.onclick = () => {
    if (confirm('ВНИМАНИЕ! Это действие удалит все ваши тренировки, программы, замеры веса и профиль. Продолжить?')) {
      if (confirm('Вы абсолютно уверены? Это действие необратимо.')) {
        localStorage.clear();
        historyData = [];
        customExercises = [];
        customTemplates = [];
        profileData = {
          name: 'Александр',
          gender: 'male',
          height: 180,
          weight: 78.5,
          weightLog: []
        };
        activeWorkout = null;
        settings = {
          sound: true,
          vibrate: true,
          defaultRestSec: 90,
          autoRest: true,
          theme: 'dark'
        };
        applySettingsUI();
        stopWorkoutStopwatch();
        stopRestTimer(true);
        activeDot.classList.add('hidden');
        renderHome();
        renderWorkoutHub();
        renderProfile();
        alert('Все данные очищены.');
      }
    }
  };

  // ==========================================================================
  // 14. Modals & Helpers
  // ==========================================================================

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }

  document.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', () => {
      const targetId = el.getAttribute('data-close');
      closeModal(targetId);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
      }
    });
  });

  // Exercise Selector Modal
  const modalExerciseItems = document.getElementById('modalExerciseItems');
  const modalExerciseSearch = document.getElementById('modalExerciseSearch');
  const modalMuscleFilters = document.getElementById('modalMuscleFilters');
  let modalSelectedMuscle = 'all';

  function renderModalExercises() {
    const query = modalExerciseSearch.value.trim().toLowerCase();
    const all = getAllExercises();

    const filtered = all.filter((ex) => {
      const matchName = ex.name.toLowerCase().includes(query);
      const matchMuscle = modalSelectedMuscle === 'all' || ex.muscle === modalSelectedMuscle;
      return matchName && matchMuscle;
    });

    modalExerciseItems.innerHTML = '';
    if (filtered.length === 0) {
      modalExerciseItems.innerHTML = `<div class="empty-state"><p>Ничего не найдено</p></div>`;
      return;
    }

    filtered.forEach((ex) => {
      const btn = document.createElement('button');
      btn.className = 'sheet-exercise-btn';
      btn.innerHTML = `
        <span class="sheet-exercise-name">${ex.name}${ex.isBodyweight ? ' ⚡' : ''}</span>
        <span class="sheet-exercise-tag">${ex.muscle}${ex.isBodyweight ? ' • Свой вес' : ''}</span>
      `;

      btn.onclick = () => {
        if (isSelectingForTemplateBuilder) {
          templateBuilderExercises.push({
            id: ex.id,
            name: ex.name,
            muscle: ex.muscle,
            isBodyweight: !!ex.isBodyweight
          });
          isSelectingForTemplateBuilder = false;
          closeModal('modalSelectExercise');
          renderTemplateBuilderList();
          openModal('modalCreateTemplate');
        } else {
          addExerciseToActiveWorkout(ex);
        }
      };

      modalExerciseItems.appendChild(btn);
    });
  }

  modalExerciseSearch.oninput = renderModalExercises;

  modalMuscleFilters.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.onclick = () => {
      modalMuscleFilters.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      modalSelectedMuscle = chip.dataset.muscle;
      renderModalExercises();
    };
  });

  function openExerciseSelector() {
    modalExerciseSearch.value = '';
    modalSelectedMuscle = 'all';
    modalMuscleFilters.querySelectorAll('.filter-chip').forEach((c, idx) => {
      c.classList.toggle('active', idx === 0);
    });
    renderModalExercises();
    openModal('modalSelectExercise');
  }

  addExerciseBtn.addEventListener('click', () => {
    isSelectingForTemplateBuilder = false;
    openExerciseSelector();
  });

  bottomAddExerciseBtn.addEventListener('click', () => {
    isSelectingForTemplateBuilder = false;
    openExerciseSelector();
  });

  // Custom Exercise Creation
  const createCustomExerciseBtn = document.getElementById('createCustomExerciseBtn');
  const saveCustomExerciseBtn = document.getElementById('saveCustomExerciseBtn');
  const newExerciseName = document.getElementById('newExerciseName');
  const newExerciseMuscle = document.getElementById('newExerciseMuscle');

  createCustomExerciseBtn.addEventListener('click', () => {
    newExerciseName.value = '';
    openModal('modalCreateExercise');
  });

  saveCustomExerciseBtn.addEventListener('click', () => {
    const name = newExerciseName.value.trim();
    if (!name) {
      alert('Пожалуйста, введите название упражнения');
      return;
    }

    const newEx = {
      id: 'custom_' + Date.now(),
      name: name,
      muscle: newExerciseMuscle.value
    };

    customExercises.push(newEx);
    saveCustomExercises();
    closeModal('modalCreateExercise');
    renderExercisesLibrary();
  });

  // Finish Workout Modal
  finishWorkoutBtn.addEventListener('click', () => {
    if (!activeWorkout || activeWorkout.exercises.length === 0) {
      alert('Добавьте хотя бы одно упражнение перед завершением.');
      return;
    }

    const elapsedSec = Math.floor((Date.now() - activeWorkout.startTime) / 1000);
    let totalCompletedSets = 0;
    let totalTonnage = 0;

    activeWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.completed) {
          totalCompletedSets += 1;
          totalTonnage += (set.weight || 0) * (set.reps || 0);
        }
      });
    });

    document.getElementById('finishTimeVal').textContent = formatTime(elapsedSec);
    document.getElementById('finishSetsVal').textContent = String(totalCompletedSets);
    document.getElementById('finishTonnageVal').textContent = `${Math.round(totalTonnage).toLocaleString('ru-RU')} кг`;
    document.getElementById('finishWorkoutNotes').value = '';

    openModal('modalFinishWorkout');
  });

  document.getElementById('backToWorkoutBtn').addEventListener('click', () => {
    closeModal('modalFinishWorkout');
  });

  document.getElementById('saveFinishedWorkoutBtn').addEventListener('click', () => {
    const elapsedSec = Math.floor((Date.now() - activeWorkout.startTime) / 1000);
    let totalCompletedSets = 0;
    let totalTonnage = 0;

    activeWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.completed) {
          totalCompletedSets += 1;
          totalTonnage += (set.weight || 0) * (set.reps || 0);
        }
      });
    });

    const finishedRecord = {
      id: activeWorkout.id,
      title: activeWorkout.title,
      date: new Date().toISOString(),
      durationSec: elapsedSec,
      tonnage: Math.round(totalTonnage),
      totalSets: totalCompletedSets,
      exercises: activeWorkout.exercises,
      notes: document.getElementById('finishWorkoutNotes').value.trim()
    };

    historyData.unshift(finishedRecord);
    saveHistory();

    activeWorkout = null;
    saveActiveWorkout();
    stopWorkoutStopwatch();
    stopRestTimer(true);
    activeDot.classList.add('hidden');
    document.getElementById('startBtnText').textContent = 'Выбрать тренировку';

    closeModal('modalFinishWorkout');
    switchView('viewHistory');
  });

  cancelWorkoutBtn.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите сбросить текущую тренировку? Все несохраненные подходы будут удалены.')) {
      activeWorkout = null;
      saveActiveWorkout();
      stopWorkoutStopwatch();
      stopRestTimer(true);
      activeDot.classList.add('hidden');
      document.getElementById('startBtnText').textContent = 'Выбрать тренировку';
      switchView('viewHome');
    }
  });

  // ==========================================================================
  // 15. App Initialization & Service Worker
  // ==========================================================================

  function initApp() {
    loadState();
    applySettingsUI();
    renderHome();

    if (activeWorkout) {
      activeDot.classList.remove('hidden');
      document.getElementById('startBtnText').textContent = 'Продолжить текущую тренировку';
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
          console.warn('Service Worker registration skipped or failed:', err);
        });
      });
    }
  }

  initApp();
})();
