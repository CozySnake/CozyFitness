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
    { id: 'bench_press', name: 'Жим штанги лёжа', muscle: 'Грудь', equip: 'barbell' },
    { id: 'incline_dumbbell_press', name: 'Жим гантелей на наклонной', muscle: 'Грудь', equip: 'dumbbell_2' },
    { id: 'dips_chest', name: 'Отжимания на брусьях', muscle: 'Грудь', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },
    { id: 'cable_crossover', name: 'Сведение рук в кроссовере', muscle: 'Грудь', equip: 'machine' },
    { id: 'dumbbell_flyes', name: 'Разводка гантелей лёжа', muscle: 'Грудь', equip: 'dumbbell_2' },
    { id: 'pushups', name: 'Отжимания от пола', muscle: 'Грудь', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },

    // Спина
    { id: 'pullups', name: 'Подтягивания', muscle: 'Спина', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },
    { id: 'lat_pulldown', name: 'Тяга верхнего блока к груди', muscle: 'Спина', equip: 'machine' },
    { id: 'barbell_row', name: 'Тяга штанги в наклоне', muscle: 'Спина', equip: 'barbell' },
    { id: 'seated_cable_row', name: 'Горизонтальная тяга блока', muscle: 'Спина', equip: 'machine' },
    { id: 'dumbbell_row', name: 'Тяга гантели одной рукой', muscle: 'Спина', equip: 'dumbbell_1' },
    { id: 'hyperextension', name: 'Гиперэкстензия', muscle: 'Спина', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },
    { id: 'deadlift', name: 'Классическая становая тяга', muscle: 'Спина', equip: 'barbell' },

    // Ноги
    { id: 'squats', name: 'Приседания со штангой', muscle: 'Ноги', equip: 'barbell', canBodyweight: true },
    { id: 'leg_press', name: 'Жим ногами в тренажере', muscle: 'Ноги', equip: 'machine' },
    { id: 'romanian_deadlift', name: 'Румынская становая тяга', muscle: 'Ноги', equip: 'barbell' },
    { id: 'lunges', name: 'Выпады с гантелями', muscle: 'Ноги', equip: 'dumbbell_2', canBodyweight: true },
    { id: 'leg_extension', name: 'Разгибания ног в тренажере', muscle: 'Ноги', equip: 'machine' },
    { id: 'leg_curl', name: 'Сгибания ног лёжа', muscle: 'Ноги', equip: 'machine' },
    { id: 'calf_raises', name: 'Подъемы на носки (икры)', muscle: 'Ноги', equip: 'machine', canBodyweight: true },

    // Плечи
    { id: 'overhead_press', name: 'Армейский жим стоя', muscle: 'Плечи', equip: 'barbell' },
    { id: 'seated_dumbbell_press', name: 'Жим гантелей сидя', muscle: 'Плечи', equip: 'dumbbell_2' },
    { id: 'lateral_raises', name: 'Махи гантелями в стороны', muscle: 'Плечи', equip: 'dumbbell_2' },
    { id: 'upright_row', name: 'Тяга штанги к подбородку', muscle: 'Плечи', equip: 'barbell' },
    { id: 'rear_delt_fly', name: 'Махи на заднюю дельту в наклоне', muscle: 'Плечи', equip: 'dumbbell_2' },

    // Руки
    { id: 'barbell_curl', name: 'Подъем штанги на бицепс', muscle: 'Руки', equip: 'barbell' },
    { id: 'hammer_curls', name: 'Молотковые сгибания с гантелями', muscle: 'Руки', equip: 'dumbbell_2' },
    { id: 'french_press', name: 'Французский жим лёжа', muscle: 'Руки', equip: 'barbell' },
    { id: 'cable_tricep_pushdown', name: 'Разгибания на трицепс на блоке', muscle: 'Руки', equip: 'machine' },
    { id: 'preacher_curl', name: 'Сгибания на скамье Скотта', muscle: 'Руки', equip: 'barbell' },

    // Пресс
    { id: 'plank', name: 'Планка', muscle: 'Пресс', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },
    { id: 'crunches', name: 'Скручивания на коврике', muscle: 'Пресс', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },
    { id: 'hanging_leg_raises', name: 'Подъемы ног в висе', muscle: 'Пресс', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },
    { id: 'cable_crunch', name: 'Скручивания на блоке («Молитва»)', muscle: 'Пресс', equip: 'machine' },

    // Кардио
    { id: 'treadmill', name: 'Беговая дорожка', muscle: 'Кардио', equip: 'machine' },
    { id: 'stationary_bike', name: 'Велотренажер', muscle: 'Кардио', equip: 'machine' },
    { id: 'rowing_machine', name: 'Гребной тренажер', muscle: 'Кардио', equip: 'machine' }
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
    SETTINGS: 'cozy_fitness_settings',
    REST_TIMER: 'cozy_fitness_rest_timer'
  };

  // State
  let historyData = [];
  let customExercises = [];
  let customTemplates = [];
  let activeWorkout = null;

  let profileData = {
    name: '',
    gender: '',
    goal: 'athletic',
    height: '',
    weight: '',
    weightLog: [],
    onboarded: false
  };

  let settings = {
    sound: true,
    vibrate: true,
    defaultRestSec: 90,
    exerciseRestSec: 120,
    autoRest: true,
    theme: 'dark'
  };

  // State for template creator/editor modal
  let templateBuilderExercises = [];
  let isSelectingForTemplateBuilder = false;
  let editingTemplateId = null;

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
    endTime: 0,
    label: 'Отдых',
    isRunning: false
  };

  // Audio Context + HTML5 WAV Bell Player (works on iOS even over background music!)
  let audioCtx = null;
  let alarmAudioEl = null;

  function buildBellWavDataUri() {
    try {
      const sampleRate = 22050;
      const durationSec = 1.65;
      const numSamples = Math.floor(sampleRate * durationSec);
      const buffer = new ArrayBuffer(44 + numSamples * 2);
      const view = new DataView(buffer);

      const writeStr = (offset, str) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };

      writeStr(0, 'RIFF');
      view.setUint32(4, 36 + numSamples * 2, true);
      writeStr(8, 'WAVE');
      writeStr(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeStr(36, 'data');
      view.setUint32(40, numSamples * 2, true);

      // 3 bright harmonic bell strikes at t=0, t=0.25s, t=0.52s
      const notes = [
        { freq: 659.25, start: 0.0, dur: 0.45 },   // E5
        { freq: 880.00, start: 0.24, dur: 0.45 },  // A5
        { freq: 1046.50, start: 0.48, dur: 1.10 }  // C6
      ];

      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let sample = 0;
        for (const n of notes) {
          if (t >= n.start && t <= n.start + n.dur) {
            const localT = t - n.start;
            const env = Math.exp(-localT * 4.2) * Math.min(1, localT / 0.008);
            sample += env * (
              0.65 * Math.sin(2 * Math.PI * n.freq * localT) +
              0.25 * Math.sin(2 * Math.PI * (n.freq * 2) * localT) +
              0.10 * Math.sin(2 * Math.PI * (n.freq * 3) * localT)
            );
          }
        }
        const clamped = Math.max(-1, Math.min(1, sample * 0.92));
        view.setInt16(44 + i * 2, clamped * 32767, true);
      }

      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return 'data:audio/wav;base64,' + window.btoa(binary);
    } catch (e) {
      return null;
    }
  }

  function initAudio() {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!alarmAudioEl) {
        const uri = buildBellWavDataUri();
        if (uri) {
          alarmAudioEl = new Audio(uri);
          alarmAudioEl.preload = 'auto';
        }
      }
    } catch (e) {
      // Ignore audio init errors
    }
  }

  // Unlock iOS Media playback channel on user tap when starting timer
  function unlockAudioOnUserTap() {
    initAudio();
    if (alarmAudioEl) {
      try {
        alarmAudioEl.volume = 0.01;
        const p = alarmAudioEl.play();
        if (p && p.then) {
          p.then(() => {
            alarmAudioEl.pause();
            alarmAudioEl.currentTime = 0;
            alarmAudioEl.volume = 1.0;
          }).catch(() => {});
        }
      } catch (e) {
        // Ignore
      }
    }
  }

  function playCozyChime() {
    if (!settings.sound) return;

    // 1. Play HTML5 <audio> WAV (plays on iOS Media channel even over background music!)
    try {
      initAudio();
      if (alarmAudioEl) {
        alarmAudioEl.currentTime = 0;
        alarmAudioEl.volume = 1.0;
        alarmAudioEl.play().catch(() => {});
      }
    } catch (e) {
      // Ignore
    }

    // 2. Also play Web Audio API synthesizer chime (after ensuring audioCtx is resumed)
    try {
      if (!audioCtx) return;
      const triggerSynth = () => {
        const now = audioCtx.currentTime;
        const playTone = (freq, start, duration) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.exponentialRampToValueAtTime(0.8, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(start);
          osc.stop(start + duration);
        };

        playTone(659.25, now, 0.45);        // E5
        playTone(880.00, now + 0.24, 0.45); // A5
        playTone(1046.50, now + 0.48, 0.95);// C6
      };

      if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(triggerSynth).catch(() => {});
      } else {
        triggerSynth();
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  function triggerVibration() {
    if (!settings.vibrate) return;
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([300, 120, 300, 120, 450]);
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
      if (prof) {
        const parsedProf = JSON.parse(prof);
        // Clean up legacy hardcoded defaults if user hasn't completed onboarding yet
        if (!parsedProf.onboarded && parsedProf.name === 'Александр' && (parsedProf.height === 180 || parsedProf.height === 177)) {
          parsedProf.name = '';
          parsedProf.gender = '';
          parsedProf.height = '';
          parsedProf.weight = '';
          if (parsedProf.weightLog && parsedProf.weightLog.length === 1 && (parsedProf.weightLog[0].weight === 78.5 || parsedProf.weightLog[0].weight === 79)) {
            parsedProf.weightLog = [];
          }
        }
        profileData = Object.assign(profileData, parsedProf);
      }

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

  function getExerciseDefinition(nameOrId) {
    if (!nameOrId) return null;
    const all = getAllExercises();
    const q = String(nameOrId).toLowerCase();
    return all.find((e) => (e.id && e.id.toLowerCase() === q) || e.name.toLowerCase() === q) || null;
  }

  // Alias so both names work everywhere
  const getExerciseMeta = getExerciseDefinition;

  function canExerciseUseBodyweight(exItem) {
    if (!exItem) return false;
    if (exItem.canBodyweight === true) return true;
    const def = getExerciseDefinition(exItem.id || exItem.name);
    if (def && def.canBodyweight === true) return true;
    const n = (exItem.name || '').toLowerCase();
    return (
      n.includes('подтяг') ||
      n.includes('отжим') ||
      n.includes('брусь') ||
      n.includes('планк') ||
      n.includes('скручив') ||
      n.includes('пресс') ||
      n.includes('висе') ||
      n.includes('гиперэкст')
    );
  }

  function getEquipInfo(exItem) {
    const canBW = canExerciseUseBodyweight(exItem);
    if (canBW) {
      return {
        type: 'bodyweight',
        equip: 'bodyweight',
        canBW: true,
        isBW: true,
        badge: '⚡ 0 кг = свой вес (можно +доп. вес)',
        badgeText: '⚡ 0 кг = свой вес (можно +доп. вес)',
        colHeader: 'ДОП. ВЕС (КГ)',
        colTitle: 'ДОП. ВЕС (КГ)',
        multiplier: 1
      };
    }

    const def = getExerciseDefinition(exItem && (exItem.id || exItem.name));
    let equip = (exItem && exItem.equip) || (def && def.equip) || '';

    // Auto-detect equipment from exercise name if not explicitly stored
    if (!equip || equip === 'bodyweight') {
      const n = ((exItem && exItem.name) || '').toLowerCase();
      if (n.includes('гантел')) {
        equip = 'dumbbell_2';
      } else if (n.includes('блок') || n.includes('тренаж') || n.includes('ногами') || n.includes('икр')) {
        equip = 'machine';
      } else {
        equip = 'barbell';
      }
    }

    if (equip === 'dumbbell_2') {
      return {
        type: 'dumbbell_2',
        equip: 'dumbbell_2',
        canBW: false,
        isBW: false,
        badge: '🏋️ 2 гантели (вес 1 шт)',
        badgeText: '🏋️ 2 гантели (вес 1 шт)',
        colHeader: '1 ГАНТЕЛЬ (КГ)',
        colTitle: '1 ГАНТЕЛЬ (КГ)',
        multiplier: 2
      };
    }
    if (equip === 'dumbbell_1') {
      return {
        type: 'dumbbell_1',
        equip: 'dumbbell_1',
        canBW: false,
        isBW: false,
        badge: '🏋️ 1 гантель',
        badgeText: '🏋️ 1 гантель',
        colHeader: 'ГАНТЕЛЬ (КГ)',
        colTitle: 'ГАНТЕЛЬ (КГ)',
        multiplier: 1
      };
    }
    if (equip === 'machine') {
      return {
        type: 'machine',
        equip: 'machine',
        canBW: false,
        isBW: false,
        badge: '⚙️ Тренажёр / Блок',
        badgeText: '⚙️ Тренажёр / Блок',
        colHeader: 'ВЕС (КГ)',
        colTitle: 'ВЕС (КГ)',
        multiplier: 1
      };
    }
    return {
      type: 'barbell',
      equip: 'barbell',
      canBW: false,
      isBW: false,
      badge: '🏋️ Штанга (общий вес)',
      badgeText: '🏋️ Штанга (общий вес)',
      colHeader: 'ШТАНГА (КГ)',
      colTitle: 'ШТАНГА (КГ)',
      multiplier: 1
    };
  }

  // Returns detailed previous sets and personal record for an exercise
  function findExerciseHistoryStats(exerciseName) {
    if (!historyData || historyData.length === 0 || !exerciseName) return null;
    const targetName = exerciseName.toLowerCase();

    let lastSessionSets = null;
    let lastSessionDate = null;
    let bestSet = null;
    const sessions = [];

    for (const workout of historyData) {
      const foundEx = (workout.exercises || []).find((e) => e.name.toLowerCase() === targetName);
      if (foundEx && foundEx.sets && foundEx.sets.length > 0) {
        const completedSets = foundEx.sets.filter((s) => s.completed);
        if (completedSets.length > 0) {
          const formattedSets = completedSets.map((s) => {
            const w = parseFloat(s.weight) || 0;
            return `${w}×${s.reps}`;
          });

          if (!lastSessionSets) {
            lastSessionSets = completedSets;
            lastSessionDate = workout.date;
          }

          sessions.push({
            date: workout.date,
            sets: completedSets,
            setsText: formattedSets.join(', ')
          });

          completedSets.forEach((s) => {
            const w = parseFloat(s.weight) || 0;
            const r = parseInt(s.reps, 10) || 0;
            if (!bestSet || w > bestSet.weight || (w === bestSet.weight && r > bestSet.reps)) {
              bestSet = { weight: w, reps: r };
            }
          });
        }
      }
    }

    if (!lastSessionSets) return null;

    const setStrings = lastSessionSets.map((s) => {
      const w = parseFloat(s.weight) || 0;
      return `${w}×${s.reps}`;
    });

    let prText = '';
    if (bestSet) {
      prText = `${bestSet.weight} кг × ${bestSet.reps}`;
    }

    return {
      lastSets: lastSessionSets,
      lastSetsRaw: lastSessionSets,
      lastSetsStrings: setStrings,
      summaryInline: setStrings.map((str, i) => `${i + 1}) ${str}`).join(' • '),
      prText,
      lastDate: lastSessionDate,
      totalSessions: sessions.length,
      recentSessions: sessions.slice(0, 5),
      sessions: sessions.slice(0, 5)
    };
  }

  function findPreviousPerformance(exerciseName) {
    const stats = findExerciseHistoryStats(exerciseName);
    if (!stats) return null;
    return stats.summaryInline;
  }

  // Blur any active text input to prevent iOS "Shake to Undo / Undo Typing" popup on lock/unlock
  function blurActiveInput() {
    try {
      const el = document.activeElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
        el.blur();
      }
    } catch (e) {
      // Ignore
    }
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

    const mainContentEl = document.querySelector('.main-content');
    if (mainContentEl) {
      mainContentEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
  // 4. Workout Stopwatch (with Always-Visible Sticky Header Chip)
  // ==========================================================================

  const headerWorkoutTimerChip = document.getElementById('headerWorkoutTimerChip');
  const headerTimerText = document.getElementById('headerTimerText');

  if (headerWorkoutTimerChip) {
    headerWorkoutTimerChip.addEventListener('click', () => {
      if (activeWorkout) {
        switchView('viewActive');
      }
    });
  }

  function formatTime(totalSeconds) {
    const safeSec = Math.max(0, Math.floor(totalSeconds));
    const hrs = Math.floor(safeSec / 3600);
    const mins = Math.floor((safeSec % 3600) / 60);
    const secs = safeSec % 60;
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
      if (!activeWorkout) {
        if (headerWorkoutTimerChip) headerWorkoutTimerChip.classList.add('hidden');
        return;
      }
      const elapsedSec = Math.floor((Date.now() - activeWorkout.startTime) / 1000);
      const formatted = formatTime(elapsedSec);
      if (timerDisplay) timerDisplay.textContent = formatted;
      if (headerWorkoutTimerChip && headerTimerText) {
        headerWorkoutTimerChip.classList.remove('hidden');
        headerTimerText.textContent = formatted;
      }
      if (hubActiveTimer && !hubActiveResumeBanner.classList.contains('hidden')) {
        hubActiveTimer.textContent = formatted;
      }
    }

    update();
    workoutTimerInterval = setInterval(update, 1000);
  }

  function stopWorkoutStopwatch() {
    if (workoutTimerInterval) {
      clearInterval(workoutTimerInterval);
      workoutTimerInterval = null;
    }
    if (headerWorkoutTimerChip) {
      headerWorkoutTimerChip.classList.add('hidden');
    }
  }

  // ==========================================================================
  // 5. Rest Timer Engine (Timestamp-based: works across lock/minimize!)
  // ==========================================================================

  const restTimerBar = document.getElementById('restTimerBar');
  const timerTypeLabel = document.getElementById('timerTypeLabel');
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

  function saveRestTimerState() {
    try {
      if (restTimer.isRunning || restTimer.remainingSeconds > 0) {
        localStorage.setItem(STORAGE_KEYS.REST_TIMER, JSON.stringify({
          totalSeconds: restTimer.totalSeconds,
          remainingSeconds: restTimer.remainingSeconds,
          endTime: restTimer.endTime,
          label: restTimer.label || 'Отдых',
          isRunning: restTimer.isRunning,
          hidden: restTimerBar.classList.contains('hidden')
        }));
      } else {
        localStorage.removeItem(STORAGE_KEYS.REST_TIMER);
      }
    } catch (e) {
      // Ignore
    }
  }

  function updateRestTimerUI() {
    const formatted = formatTime(restTimer.remainingSeconds);
    timerDigits.textContent = formatted;
    bigTimerText.textContent = formatted;
    if (timerTypeLabel) {
      timerTypeLabel.textContent = restTimer.label || 'Отдых';
    }

    const progressPercent = restTimer.totalSeconds > 0
      ? Math.max(0, Math.min(1, restTimer.remainingSeconds / restTimer.totalSeconds))
      : 0;

    timerProgressBg.style.width = `${progressPercent * 100}%`;
    const offset = CIRCLE_CIRCUMFERENCE * (1 - progressPercent);
    timerCircleFg.style.strokeDashoffset = offset;

    const icon = restTimer.isRunning ? '⏸' : '▶';
    timerPlayPauseBtn.textContent = icon;
    timerSheetToggle.textContent = restTimer.isRunning ? 'Пауза' : 'Продолжить';
  }

  function finishRestTimerAlert() {
    restTimer.remainingSeconds = 0;
    restTimer.endTime = 0;
    if (timerTypeLabel) timerTypeLabel.textContent = 'Отдых завершён! 🔔';
    updateRestTimerUI();
    stopRestTimer(false);
    localStorage.removeItem(STORAGE_KEYS.REST_TIMER);

    playCozyChime();
    triggerVibration();

    restTimerBar.style.boxShadow = '0 0 28px #10b981';
    restTimerBar.style.borderColor = '#10b981';
    setTimeout(() => {
      restTimerBar.style.boxShadow = '';
      restTimerBar.style.borderColor = '';
    }, 4000);
  }

  function tickRestTimer() {
    if (!restTimer.isRunning) return;

    const now = Date.now();
    const remaining = Math.ceil((restTimer.endTime - now) / 1000);

    if (remaining > 0) {
      restTimer.remainingSeconds = remaining;
      updateRestTimerUI();
    } else {
      finishRestTimerAlert();
    }
  }

  function startRestTimer(seconds, customLabel = null) {
    unlockAudioOnUserTap();
    blurActiveInput();

    if (seconds) {
      restTimer.totalSeconds = seconds;
      restTimer.remainingSeconds = seconds;
    } else if (restTimer.remainingSeconds <= 0) {
      restTimer.remainingSeconds = restTimer.totalSeconds || settings.defaultRestSec || 90;
    }

    if (customLabel) {
      restTimer.label = customLabel;
    } else if (!restTimer.label || restTimer.label.includes('завершён')) {
      restTimer.label = 'Отдых';
    }

    restTimer.endTime = Date.now() + restTimer.remainingSeconds * 1000;
    if (restTimer.interval) clearInterval(restTimer.interval);

    restTimer.isRunning = true;
    restTimerBar.classList.remove('hidden');
    updateRestTimerUI();
    saveRestTimerState();

    restTimer.interval = setInterval(tickRestTimer, 500);
  }

  function pauseRestTimer() {
    if (restTimer.interval) clearInterval(restTimer.interval);
    if (restTimer.isRunning && restTimer.endTime > Date.now()) {
      restTimer.remainingSeconds = Math.max(1, Math.ceil((restTimer.endTime - Date.now()) / 1000));
    }
    restTimer.isRunning = false;
    restTimer.endTime = 0;
    updateRestTimerUI();
    saveRestTimerState();
  }

  function stopRestTimer(hideBar = true) {
    if (restTimer.interval) clearInterval(restTimer.interval);
    restTimer.isRunning = false;
    restTimer.endTime = 0;
    if (hideBar) {
      restTimerBar.classList.add('hidden');
      closeModal('modalRestTimer');
      localStorage.removeItem(STORAGE_KEYS.REST_TIMER);
    }
    updateRestTimerUI();
  }

  function adjustRestTimer(secondsDelta) {
    if (restTimer.isRunning) {
      const currentRem = Math.max(0, Math.ceil((restTimer.endTime - Date.now()) / 1000));
      const nextRem = Math.max(5, currentRem + secondsDelta);
      restTimer.remainingSeconds = nextRem;
      restTimer.endTime = Date.now() + nextRem * 1000;
    } else {
      restTimer.remainingSeconds = Math.max(5, restTimer.remainingSeconds + secondsDelta);
    }
    if (restTimer.remainingSeconds > restTimer.totalSeconds) {
      restTimer.totalSeconds = restTimer.remainingSeconds;
    }
    updateRestTimerUI();
    saveRestTimerState();
  }

  function restoreRestTimerState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REST_TIMER);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || saved.hidden) return;

      restTimer.totalSeconds = saved.totalSeconds || 90;
      restTimer.label = saved.label || 'Отдых';

      if (saved.isRunning && saved.endTime) {
        const rem = Math.ceil((saved.endTime - Date.now()) / 1000);
        if (rem > 0) {
          restTimer.remainingSeconds = rem;
          restTimer.endTime = saved.endTime;
          restTimer.isRunning = true;
          restTimerBar.classList.remove('hidden');
          updateRestTimerUI();
          if (restTimer.interval) clearInterval(restTimer.interval);
          restTimer.interval = setInterval(tickRestTimer, 500);
        } else {
          restTimerBar.classList.remove('hidden');
          finishRestTimerAlert();
        }
      } else if (!saved.isRunning && saved.remainingSeconds > 0) {
        restTimer.remainingSeconds = saved.remainingSeconds;
        restTimer.isRunning = false;
        restTimerBar.classList.remove('hidden');
        updateRestTimerUI();
      }
    } catch (e) {
      // Ignore
    }
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
  const modalTemplateHeaderTitle = document.getElementById('modalTemplateHeaderTitle');
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
            <button class="template-edit-btn" data-tpl-id="${tpl.id}" title="Редактировать программу">✏️</button>
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

        card.querySelector('.template-edit-btn').onclick = () => {
          editingTemplateId = tpl.id;
          if (modalTemplateHeaderTitle) modalTemplateHeaderTitle.textContent = 'Редактировать программу';
          newTemplateTitle.value = tpl.title || '';
          newTemplateDesc.value = tpl.desc || '';
          templateBuilderExercises = (tpl.exercises || []).map((ex) => ({
            id: ex.id,
            name: ex.name,
            muscle: ex.muscle,
            isBodyweight: !!ex.isBodyweight
          }));
          renderTemplateBuilderList();
          openModal('modalCreateTemplate');
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

  function buildSetsFromPreviousOrDefaults(exMeta, defaultWeight = 20, defaultReps = 10) {
    const canBW = canExerciseUseBodyweight(exMeta);
    const isBW = canBW ? !!exMeta.isBodyweight : false;
    const stats = findExerciseHistoryStats(exMeta.name);
    const baseW = isBW ? 0 : (exMeta.defaultWeight !== undefined ? exMeta.defaultWeight : defaultWeight);
    const baseR = exMeta.defaultReps || defaultReps;

    if (stats && stats.lastSets && stats.lastSets.length > 0) {
      const count = Math.max(3, stats.lastSets.length);
      const resultSets = [];
      for (let i = 0; i < count; i++) {
        const prevSet = stats.lastSets[i] || stats.lastSets[stats.lastSets.length - 1];
        const wVal = isBW ? (parseFloat(prevSet.weight) || 0) : (parseFloat(prevSet.weight) || baseW);
        const rVal = parseInt(prevSet.reps, 10) || baseR;
        resultSets.push({
          weight: wVal,
          reps: rVal,
          isBodyweight: isBW,
          completed: false
        });
      }
      return resultSets;
    }

    return [
      { weight: baseW, reps: baseR, isBodyweight: isBW, completed: false },
      { weight: baseW, reps: baseR, isBodyweight: isBW, completed: false },
      { weight: baseW, reps: baseR, isBodyweight: isBW, completed: false }
    ];
  }

  function startWorkoutFromTemplate(tpl) {
    const preloadedExercises = tpl.exercises.map((tplEx) => {
      const catalogEx = getExerciseMeta(tplEx.name);
      const canBW = canExerciseUseBodyweight(tplEx);
      const isBW = canBW ? !!tplEx.isBodyweight : false;
      const equip = tplEx.equip || (catalogEx && catalogEx.equip) || (isBW ? 'bodyweight' : 'barbell');

      return {
        id: tplEx.id || ('ex_' + Date.now() + Math.random()),
        name: tplEx.name,
        muscle: tplEx.muscle,
        equip: equip,
        canBodyweight: canBW,
        isBodyweight: isBW,
        sets: buildSetsFromPreviousOrDefaults(tplEx, tplEx.defaultWeight || 20, tplEx.defaultReps || 10)
      };
    });

    startNewWorkout(tpl.title, preloadedExercises);
  }

  function saveExercisesListAsCustomTemplate(defaultTitle, exercisesList) {
    if (!exercisesList || exercisesList.length === 0) {
      alert('В тренировке пока нет упражнений для сохранения в программу.');
      return;
    }
    const cleanDefault = (defaultTitle || 'Моя тренировка').trim();
    const chosenTitle = prompt('Введите название для сохранения в «Мои программы»:', cleanDefault);
    if (!chosenTitle || !chosenTitle.trim()) return;

    const mappedExercises = exercisesList.map((ex) => {
      const canBW = canExerciseUseBodyweight(ex);
      const isBW = canBW ? !!ex.isBodyweight : false;
      const firstSet = (ex.sets && ex.sets[0]) ? ex.sets[0] : null;
      return {
        id: ex.id || ('ex_' + Date.now() + Math.random()),
        name: ex.name,
        muscle: ex.muscle || 'Другое',
        equip: ex.equip || (isBW ? 'bodyweight' : 'barbell'),
        canBodyweight: canBW,
        isBodyweight: isBW,
        defaultWeight: isBW ? 0 : (firstSet && firstSet.weight ? firstSet.weight : 20),
        defaultReps: (firstSet && firstSet.reps) ? firstSet.reps : 10
      };
    });

    const newTpl = {
      id: 'custom_tpl_' + Date.now(),
      title: chosenTitle.trim(),
      desc: `Сохранено из тренировки (${mappedExercises.length} упр.)`,
      isCustom: true,
      exercises: mappedExercises
    };

    customTemplates.push(newTpl);
    saveCustomTemplates();
    renderWorkoutHub();
    alert(`Программа «${newTpl.title}» сохранена в раздел «Мои программы»! 📌`);
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
      const equipInfo = getEquipInfo(ex);
      const item = document.createElement('div');
      item.className = 'template-builder-item';
      item.innerHTML = `
        <div>
          <span class="template-builder-item-name">${ex.name}</span>
          <span class="template-builder-item-tag">${ex.muscle} • ${equipInfo.badge}</span>
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
    editingTemplateId = null;
    if (modalTemplateHeaderTitle) modalTemplateHeaderTitle.textContent = 'Новая программа';
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

    const mappedExercises = templateBuilderExercises.map((ex) => {
      const canBW = canExerciseUseBodyweight(ex);
      const isBW = canBW ? !!ex.isBodyweight : false;
      return {
        id: ex.id,
        name: ex.name,
        muscle: ex.muscle,
        equip: ex.equip || (isBW ? 'bodyweight' : 'barbell'),
        canBodyweight: canBW,
        isBodyweight: isBW,
        defaultWeight: isBW ? 0 : 20,
        defaultReps: 10
      };
    });

    if (editingTemplateId) {
      const idx = customTemplates.findIndex((t) => t.id === editingTemplateId);
      if (idx !== -1) {
        customTemplates[idx].title = title;
        customTemplates[idx].desc = newTemplateDesc.value.trim() || 'Пользовательская программа';
        customTemplates[idx].exercises = mappedExercises;
      }
      editingTemplateId = null;
    } else {
      const newTpl = {
        id: 'custom_tpl_' + Date.now(),
        title: title,
        desc: newTemplateDesc.value.trim() || 'Пользовательская программа',
        isCustom: true,
        exercises: mappedExercises
      };
      customTemplates.push(newTpl);
    }

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
  const bottomFinishWorkoutBtn = document.getElementById('bottomFinishWorkoutBtn');
  const cancelWorkoutBtn = document.getElementById('cancelWorkoutBtn');
  const bottomCancelWorkoutBtn = document.getElementById('bottomCancelWorkoutBtn');
  const activeSaveAsTemplateBtn = document.getElementById('activeSaveAsTemplateBtn');
  const finishSaveTemplateBtn = document.getElementById('finishSaveTemplateBtn');
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
      const canBW = canExerciseUseBodyweight(exItem);
      const equipInfo = getEquipInfo(exItem);
      const histStats = findExerciseHistoryStats(exItem.name);

      // Detailed set-by-set previous workout summary + all-time PR badge
      let prevSummaryHtml = '';
      if (histStats && histStats.lastSets && histStats.lastSets.length > 0) {
        const setsChips = histStats.lastSets.map((s, idx) => {
          const w = parseFloat(s.weight) || 0;
          return `${idx + 1}) ${w}×${s.reps}`;
        }).join(' • ');

        const prBadgeHtml = histStats.prText
          ? `<span class="exercise-pr-badge" title="Личный рекорд в этом упражнении">🏆 Рекорд: ${histStats.prText}</span>`
          : '';

        prevSummaryHtml = `
          <div class="exercise-prev-row">
            <span class="exercise-prev-sets">📊 Прошлый раз: <strong>${setsChips}</strong></span>
            ${prBadgeHtml}
          </div>
        `;
      }

      // Equipment badge:
      // - Bodyweight-capable exercises show a simple note ("⚡ 0 кг = свой вес (можно +доп. вес)") without any mode toggle
      // - Weighted exercises show a clickable equipment selector ("🏋️ Штанга" / "🏋️ 2 гантели (вес 1 шт)" / "🏋️ 1 гантель" / "⚙️ Тренажёр")
      const equipControlHtml = canBW
        ? `<span class="exercise-muscle-tag" style="background:rgba(16,185,129,0.12); color:var(--accent-green); border-color:rgba(16,185,129,0.28);">
             ${equipInfo.badge}
           </span>`
        : `<button type="button" class="equip-badge-btn" data-ex-idx="${exIndex}" title="Нажмите, чтобы уточнить снаряд (Штанга / 2 гантели / 1 гантель / Тренажёр)">
             ${equipInfo.badge} ▾
           </button>`;

      const card = document.createElement('div');
      card.className = 'exercise-card';

      card.innerHTML = `
        <div class="exercise-header">
          <div class="exercise-title-wrap">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="exercise-name">${exItem.name}</span>
              <button type="button" class="exercise-info-btn" data-ex-name="${exItem.name}" data-ex-muscle="${exItem.muscle}" title="Анимация техники и история">ℹ️</button>
            </div>
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:2px;">
              <span class="exercise-muscle-tag">${exItem.muscle}</span>
              ${equipControlHtml}
            </div>
            ${prevSummaryHtml}
          </div>
          <button class="remove-exercise-btn" data-ex-idx="${exIndex}" title="Удалить упражнение">✕</button>
        </div>

        <div class="sets-table">
          <div class="sets-table-header">
            <div>Сет</div>
            <div>${equipInfo.colHeader || 'ВЕС (КГ)'}</div>
            <div>Повт</div>
            <div>Готово</div>
            <div></div>
          </div>
          <div class="sets-rows-container" id="setsContainer_${exIndex}">
            <!-- Sets rows will be rendered here -->
          </div>
        </div>

        <button class="add-set-btn" data-ex-idx="${exIndex}">+ Добавить подход</button>
      `;

      const setsContainer = card.querySelector(`#setsContainer_${exIndex}`);

      exItem.sets.forEach((set, setIndex) => {
        const numericWeight = (set.weight !== undefined && set.weight !== null && set.weight !== '')
          ? (parseFloat(set.weight) || 0)
          : (canBW ? 0 : '');
        const repsDisplay = (set.reps !== undefined && set.reps !== null && set.reps !== '') ? set.reps : '';

        // Previous performance specifically for this set number (e.g. Set 1 vs Set 2 vs Set 3)
        let perSetPrevHtml = '';
        if (histStats && histStats.lastSets && histStats.lastSets[setIndex]) {
          const ps = histStats.lastSets[setIndex];
          const psW = parseFloat(ps.weight) || 0;
          perSetPrevHtml = `<span class="set-prev-mini" title="Прошлый результат в ${setIndex + 1}-м подходе">${psW}×${ps.reps}</span>`;
        }

        const row = document.createElement('div');
        row.className = `set-row ${set.completed ? 'completed' : ''}`;
        row.dataset.exIdx = exIndex;
        row.dataset.setIdx = setIndex;

        row.innerHTML = `
          <div class="set-num-badge">
            <span>${setIndex + 1}</span>
            ${perSetPrevHtml}
          </div>

          <!-- Weight Stepper Cell -->
          <div class="stepper-cell weight-cell">
            <div class="stepper-box">
              <button type="button" class="stepper-btn minus-btn" data-action="minus" data-type="weight" data-ex-idx="${exIndex}" data-set-idx="${setIndex}" aria-label="Уменьшить вес">−</button>
              <div class="stepper-input-wrap">
                <input type="text" inputmode="decimal" autocomplete="off" autocorrect="off" spellcheck="false"
                       class="set-input set-weight-input" 
                       data-ex-idx="${exIndex}" data-set-idx="${setIndex}" 
                       value="${numericWeight}" placeholder="0">
              </div>
              <button type="button" class="stepper-btn plus-btn" data-action="plus" data-type="weight" data-ex-idx="${exIndex}" data-set-idx="${setIndex}" aria-label="Увеличить вес">+</button>
            </div>
          </div>

          <!-- Reps Stepper Cell -->
          <div class="stepper-cell reps-cell">
            <div class="stepper-box">
              <button type="button" class="stepper-btn minus-btn" data-action="minus" data-type="reps" data-ex-idx="${exIndex}" data-set-idx="${setIndex}" aria-label="Уменьшить повторения">−</button>
              <div class="stepper-input-wrap">
                <input type="number" inputmode="numeric" autocomplete="off"
                       class="set-input set-reps-input" 
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

          <!-- Remove Set Button -->
          <button type="button" class="remove-set-btn" data-ex-idx="${exIndex}" data-set-idx="${setIndex}" title="Удалить подход" aria-label="Удалить подход">✕</button>
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
        blurActiveInput();
        openExerciseInfoModal(btn.dataset.exName, btn.dataset.exMuscle);
      };
    });

    // Equipment mode selector (cycles: Штанга -> 2 гантели (вес 1 шт) -> 1 гантель -> Тренажёр)
    document.querySelectorAll('.equip-badge-btn').forEach((btn) => {
      btn.onclick = () => {
        blurActiveInput();
        const exIdx = parseInt(btn.dataset.exIdx, 10);
        const ex = activeWorkout.exercises[exIdx];
        const order = ['barbell', 'dumbbell_2', 'dumbbell_1', 'machine'];
        const currentEquip = getEquipInfo(ex).type;
        const nextIdx = (order.indexOf(currentEquip) + 1) % order.length;
        ex.equip = order[nextIdx];
        saveActiveWorkout();
        renderActiveWorkout();
      };
    });

    // Steppers (clean numeric weight 0+ kg and reps 0+)
    document.querySelectorAll('.stepper-btn').forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        blurActiveInput(); // Fix #10: prevent iOS Undo Typing history buildup
        const action = btn.dataset.action;
        const type = btn.dataset.type;
        const exIdx = parseInt(btn.dataset.exIdx, 10);
        const setIdx = parseInt(btn.dataset.setIdx, 10);
        const exercise = activeWorkout.exercises[exIdx];
        const targetSet = exercise.sets[setIdx];
        const row = btn.closest('.set-row');

        if (type === 'weight') {
          let currentWeight = parseFloat(targetSet.weight) || 0;
          if (action === 'plus') {
            currentWeight = Math.round((currentWeight + 2.5) * 10) / 10;
          } else {
            currentWeight = Math.max(0, Math.round((currentWeight - 2.5) * 10) / 10);
          }
          targetSet.weight = currentWeight;
          const input = row.querySelector('.set-weight-input');
          input.value = currentWeight;
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

    // Direct Weight input (clean numeric input; empty or 0 = 0 kg)
    document.querySelectorAll('.set-weight-input').forEach((input) => {
      input.oninput = (e) => {
        const exIdx = parseInt(e.target.dataset.exIdx, 10);
        const setIdx = parseInt(e.target.dataset.setIdx, 10);
        const exercise = activeWorkout.exercises[exIdx];
        const targetSet = exercise.sets[setIdx];
        const raw = e.target.value.trim();
        const cleaned = raw.replace(/[^0-9.,]/g, '').replace(',', '.');
        targetSet.weight = cleaned === '' ? 0 : Math.max(0, parseFloat(cleaned) || 0);
        saveActiveWorkout();
      };

      input.onblur = (e) => {
        const exIdx = parseInt(e.target.dataset.exIdx, 10);
        const setIdx = parseInt(e.target.dataset.setIdx, 10);
        const exercise = activeWorkout.exercises[exIdx];
        if (!exercise || !exercise.sets[setIdx]) return;
        const targetSet = exercise.sets[setIdx];
        if (e.target.value.trim() === '') {
          targetSet.weight = 0;
          e.target.value = '0';
          saveActiveWorkout();
        } else {
          e.target.value = targetSet.weight || 0;
        }
      };
    });

    // Direct Reps input
    document.querySelectorAll('.set-reps-input').forEach((input) => {
      input.oninput = (e) => {
        const exIdx = parseInt(e.target.dataset.exIdx, 10);
        const setIdx = parseInt(e.target.dataset.setIdx, 10);
        const val = Math.max(0, parseInt(e.target.value, 10) || 0);
        if (activeWorkout && activeWorkout.exercises[exIdx] && activeWorkout.exercises[exIdx].sets[setIdx]) {
          activeWorkout.exercises[exIdx].sets[setIdx].reps = val;
          saveActiveWorkout();
        }
      };
    });

    // Check set button (Fix #8: Separate rest timer for set vs exercise completion)
    document.querySelectorAll('.set-check-btn').forEach((btn) => {
      btn.onclick = () => {
        blurActiveInput();
        const exIdx = parseInt(btn.dataset.exIdx, 10);
        const setIdx = parseInt(btn.dataset.setIdx, 10);
        const exercise = activeWorkout.exercises[exIdx];
        const targetSet = exercise.sets[setIdx];

        targetSet.completed = !targetSet.completed;
        saveActiveWorkout();
        renderActiveWorkout();

        if (targetSet.completed && settings.autoRest) {
          const allSetsDone = exercise.sets.length > 0 && exercise.sets.every((s) => s.completed);
          if (allSetsDone) {
            const exRest = parseInt(settings.exerciseRestSec, 10) || 120;
            startRestTimer(exRest, 'Отдых (след. упр.)');
          } else {
            const setRest = parseInt(settings.defaultRestSec, 10) || 90;
            startRestTimer(setRest, 'Отдых (подход)');
          }
        }
      };
    });

    // Add set button
    document.querySelectorAll('.add-set-btn').forEach((btn) => {
      btn.onclick = () => {
        blurActiveInput();
        const exIdx = parseInt(btn.dataset.exIdx, 10);
        const exercise = activeWorkout.exercises[exIdx];
        const nextSetIdx = exercise.sets.length;
        const lastSet = exercise.sets[exercise.sets.length - 1];
        const histStats = findExerciseHistoryStats(exercise.name);

        let newWeight = lastSet ? lastSet.weight : (exercise.isBodyweight ? 0 : 20);
        let newReps = lastSet ? lastSet.reps : 10;

        if (histStats && histStats.lastSets && histStats.lastSets[nextSetIdx]) {
          newWeight = parseFloat(histStats.lastSets[nextSetIdx].weight) || newWeight;
          newReps = parseInt(histStats.lastSets[nextSetIdx].reps, 10) || newReps;
        }

        exercise.sets.push({
          weight: newWeight,
          reps: newReps,
          isBodyweight: canExerciseUseBodyweight(exercise) && !!exercise.isBodyweight,
          completed: false
        });

        saveActiveWorkout();
        renderActiveWorkout();
      };
    });

    // Remove set button
    document.querySelectorAll('.remove-set-btn').forEach((btn) => {
      btn.onclick = () => {
        blurActiveInput();
        const exIdx = parseInt(btn.dataset.exIdx, 10);
        const setIdx = parseInt(btn.dataset.setIdx, 10);
        const exercise = activeWorkout.exercises[exIdx];
        if (!exercise) return;
        exercise.sets.splice(setIdx, 1);
        saveActiveWorkout();
        renderActiveWorkout();
      };
    });

    // Remove exercise button
    document.querySelectorAll('.remove-exercise-btn').forEach((btn) => {
      btn.onclick = () => {
        blurActiveInput();
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

    const canBW = canExerciseUseBodyweight(exercise);
    const isBW = canBW ? !!exercise.isBodyweight : false;
    const equip = exercise.equip || (isBW ? 'bodyweight' : 'barbell');

    activeWorkout.exercises.push({
      id: exercise.id,
      name: exercise.name,
      muscle: exercise.muscle,
      equip: equip,
      canBodyweight: canBW,
      isBodyweight: isBW,
      sets: buildSetsFromPreviousOrDefaults(exercise, isBW ? 0 : 20, 10)
    });

    saveActiveWorkout();
    closeModal('modalSelectExercise');
    renderActiveWorkout();
  }

  // ==========================================================================
  // 8. Exercise Info Modal Logic (Animated SVG Biomechanics + Progress Box)
  // ==========================================================================

  const infoModalExName = document.getElementById('infoModalExName');
  const infoModalMuscleTag = document.getElementById('infoModalMuscleTag');
  const infoModalVisual = document.getElementById('infoModalVisual');
  const infoModalProgressBox = document.getElementById('infoModalProgressBox');
  const infoModalMuscles = document.getElementById('infoModalMuscles');
  const infoModalTechnique = document.getElementById('infoModalTechnique');
  const infoModalTips = document.getElementById('infoModalTips');

  function buildExerciseAnimationSvg(name, muscle, equipInfo) {
    const n = (name || '').toLowerCase();
    const m = (muscle || '').toLowerCase();

    let svgMotion = '';
    let caption = `${muscle || 'Мышцы'} • ${equipInfo.badge}`;

    if (n.includes('жим') && (n.includes('лёжа') || n.includes('лежа') || n.includes('наклон') || m === 'грудь')) {
      // Bench Press / Chest Press animation
      svgMotion = `
        <svg viewBox="0 0 220 125" class="ex-anim-svg" aria-label="Анимация жима">
          <!-- Bench -->
          <rect x="45" y="84" width="130" height="8" rx="4" fill="#3a2e25"/>
          <rect x="65" y="92" width="10" height="22" rx="3" fill="#2a211b"/>
          <rect x="145" y="92" width="10" height="22" rx="3" fill="#2a211b"/>
          <!-- Athlete Torso & Head on Bench -->
          <circle cx="68" cy="72" r="10" fill="#e2b49a"/>
          <rect x="80" y="70" width="62" height="14" rx="7" fill="#f5a623" opacity="0.9"/>
          <!-- Legs -->
          <path d="M142 76 L168 78 L175 108" stroke="#9b8d82" stroke-width="8" stroke-linecap="round" fill="none"/>
          <!-- Animated Arms & Barbell/Dumbbells pressing up and down -->
          <g class="anim-press-vertical">
            <line x1="96" y1="74" x2="96" y2="36" stroke="#f5a623" stroke-width="6" stroke-linecap="round"/>
            <line x1="118" y1="74" x2="118" y2="36" stroke="#f5a623" stroke-width="6" stroke-linecap="round"/>
            <line x1="56" y1="34" x2="158" y2="34" stroke="#e8dfd5" stroke-width="4" stroke-linecap="round"/>
            <rect x="62" y="21" width="9" height="26" rx="3" fill="#5ec28f"/>
            <rect x="143" y="21" width="9" height="26" rx="3" fill="#5ec28f"/>
          </g>
        </svg>
      `;
    } else if (n.includes('присед') || n.includes('выпад') || n.includes('жим ногами') || m === 'ноги') {
      // Squat / Legs animation
      svgMotion = `
        <svg viewBox="0 0 220 125" class="ex-anim-svg" aria-label="Анимация упражнения на ноги">
          <!-- Floor -->
          <line x1="40" y1="112" x2="180" y2="112" stroke="#3a2e25" stroke-width="4" stroke-linecap="round"/>
          <!-- Animated Upper Body + Barbell -->
          <g class="anim-squat-body">
            <circle cx="110" cy="30" r="9" fill="#e2b49a"/>
            <!-- Barbell across shoulders -->
            <line x1="66" y1="42" x2="154" y2="42" stroke="#e8dfd5" stroke-width="4" stroke-linecap="round"/>
            <rect x="70" y="31" width="8" height="22" rx="3" fill="#5ec28f"/>
            <rect x="142" y="31" width="8" height="22" rx="3" fill="#5ec28f"/>
            <!-- Torso -->
            <line x1="110" y1="40" x2="104" y2="74" stroke="#e2b49a" stroke-width="9" stroke-linecap="round"/>
            <!-- Highlighted Quads/Glutes -->
            <line x1="104" y1="74" x2="124" y2="90" stroke="#f5a623" stroke-width="9" stroke-linecap="round"/>
          </g>
          <!-- Lower Leg anchored to floor -->
          <line x1="120" y1="88" x2="112" y2="110" stroke="#9b8d82" stroke-width="7" stroke-linecap="round"/>
        </svg>
      `;
    } else if (n.includes('подтяг') || n.includes('тяга верхнего') || n.includes('тяга') || m === 'спина') {
      // Pull-up / Lat Pulldown / Back row animation
      svgMotion = `
        <svg viewBox="0 0 220 125" class="ex-anim-svg" aria-label="Анимация тяги на спину">
          <!-- Pull-up Bar -->
          <line x1="50" y1="18" x2="170" y2="18" stroke="#e8dfd5" stroke-width="5" stroke-linecap="round"/>
          <!-- Animated Pulling Body -->
          <g class="anim-pullup-body">
            <!-- Arms holding bar -->
            <path d="M84 20 L95 48" stroke="#e2b49a" stroke-width="6" stroke-linecap="round"/>
            <path d="M136 20 L125 48" stroke="#e2b49a" stroke-width="6" stroke-linecap="round"/>
            <!-- Head -->
            <circle cx="110" cy="38" r="9" fill="#e2b49a"/>
            <!-- V-Taper Back (highlighted target muscle) -->
            <polygon points="92,48 128,48 118,84 102,84" fill="#f5a623" opacity="0.9"/>
            <!-- Legs -->
            <line x1="105" y1="84" x2="105" y2="114" stroke="#9b8d82" stroke-width="6" stroke-linecap="round"/>
            <line x1="115" y1="84" x2="115" y2="114" stroke="#9b8d82" stroke-width="6" stroke-linecap="round"/>
          </g>
        </svg>
      `;
    } else if (m === 'руки' || n.includes('бицепс') || n.includes('трицепс') || n.includes('французский') || n.includes('молот')) {
      // Arm Curl / Triceps Extension animation
      svgMotion = `
        <svg viewBox="0 0 220 125" class="ex-anim-svg" aria-label="Анимация работы рук">
          <!-- Torso & Shoulder -->
          <circle cx="95" cy="26" r="10" fill="#e2b49a"/>
          <rect x="83" y="38" width="24" height="58" rx="10" fill="#3a2e25"/>
          <!-- Upper Arm (Highlighted Bicep/Tricep) -->
          <line x1="102" y1="45" x2="106" y2="76" stroke="#f5a623" stroke-width="10" stroke-linecap="round"/>
          <!-- Animated Forearm + Dumbbell/Barbell pivoting at elbow (106, 76) -->
          <g class="anim-curl-forearm" style="transform-origin: 106px 76px;">
            <line x1="106" y1="76" x2="142" y2="74" stroke="#e2b49a" stroke-width="7" stroke-linecap="round"/>
            <rect x="138" y="61" width="10" height="26" rx="3" fill="#5ec28f"/>
          </g>
        </svg>
      `;
    } else {
      // Shoulders / Core / General Athletic animation
      svgMotion = `
        <svg viewBox="0 0 220 125" class="ex-anim-svg" aria-label="Анимация упражнения">
          <circle cx="110" cy="48" r="10" fill="#e2b49a"/>
          <rect x="96" y="60" width="28" height="46" rx="9" fill="#3a2e25"/>
          <!-- Highlighted Delts / Core -->
          <circle cx="93" cy="65" r="7" fill="#f5a623"/>
          <circle cx="127" cy="65" r="7" fill="#f5a623"/>
          <!-- Animated Overhead Press / Raise -->
          <g class="anim-press-vertical">
            <line x1="92" y1="65" x2="82" y2="30" stroke="#f5a623" stroke-width="6" stroke-linecap="round"/>
            <line x1="128" y1="65" x2="138" y2="30" stroke="#f5a623" stroke-width="6" stroke-linecap="round"/>
            <line x1="62" y1="28" x2="158" y2="28" stroke="#e8dfd5" stroke-width="4" stroke-linecap="round"/>
            <rect x="66" y="17" width="8" height="22" rx="3" fill="#5ec28f"/>
            <rect x="146" y="17" width="8" height="22" rx="3" fill="#5ec28f"/>
          </g>
        </svg>
      `;
    }

    return `
      <div class="ex-visual-inner">
        ${svgMotion}
        <div class="ex-visual-caption">${caption}</div>
      </div>
    `;
  }

  function openExerciseInfoModal(name, muscle) {
    infoModalExName.textContent = name;
    infoModalMuscleTag.textContent = muscle || 'Мышцы';

    const found = getExerciseMeta(name);
    const equipInfo = getEquipInfo(found || { name, muscle });

    if (infoModalVisual) {
      infoModalVisual.innerHTML = buildExerciseAnimationSvg(name, muscle, equipInfo);
    }

    // Fix #3: Personal progress & PR history box inside the exercise modal
    if (infoModalProgressBox) {
      const stats = findExerciseHistoryStats(name);
      if (stats && stats.recentSessions.length > 0) {
        const rowsHtml = stats.recentSessions.map((sess) => {
          const dStr = new Date(sess.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
          const setsStr = sess.sets.map((s, idx) => {
            if (found && found.isBodyweight) {
              return (!s.weight || s.weight === 0) ? `${idx + 1}) СВ×${s.reps}` : `${idx + 1}) +${s.weight}×${s.reps}`;
            }
            return `${idx + 1}) ${s.weight}×${s.reps}`;
          }).join(' • ');
          return `
            <div class="info-progress-row">
              <span class="info-progress-date">${dStr}</span>
              <span class="info-progress-sets">${setsStr}</span>
            </div>
          `;
        }).join('');

        infoModalProgressBox.classList.remove('hidden');
        infoModalProgressBox.innerHTML = `
          <div class="info-progress-header">
            <span>📈 Ваш прогресс (${stats.totalSessions} трен.)</span>
            ${stats.prText ? `<span class="exercise-pr-badge">🏆 Рекорд: ${stats.prText}</span>` : ''}
          </div>
          <div class="info-progress-list">${rowsHtml}</div>
        `;
      } else {
        infoModalProgressBox.classList.add('hidden');
        infoModalProgressBox.innerHTML = '';
      }
    }

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

    // Filter only exercises that have at least one completed set (or fallback if legacy)
    const validExercises = (item.exercises || []).map((ex) => {
      const completedOnly = (ex.sets || []).filter((s) => s.completed);
      return Object.assign({}, ex, { sets: completedOnly });
    }).filter((ex) => ex.sets.length > 0);

    const exercisesSummary = validExercises
      .map((ex) => {
        const completedSetsCount = ex.sets.length;
        const bwTag = (canExerciseUseBodyweight(ex) && ex.isBodyweight) ? ' (Свой вес)' : '';
        return `${ex.name} (${completedSetsCount}${bwTag})`;
      })
      .join(' • ');

    // Detailed sets breakdown HTML for accordion (only completed sets!)
    const drilldownBlocksHtml = validExercises.map((ex) => {
      const canBW = canExerciseUseBodyweight(ex);
      const equipInfo = getEquipInfo(ex);
      const setsRowsHtml = ex.sets.map((s, sIdx) => {
        let weightStr = '';
        if (canBW && ex.isBodyweight) {
          weightStr = (!s.weight || s.weight === 0) ? 'Свой вес' : `+${s.weight} кг`;
        } else if (equipInfo.type === 'dumbbell_2') {
          weightStr = `2 × ${s.weight} кг`;
        } else {
          weightStr = `${s.weight} кг`;
        }

        return `
          <div class="drilldown-set-row">
            <span class="drilldown-set-badge">Сет ${sIdx + 1}</span>
            <span class="drilldown-set-val">${weightStr} × ${s.reps}</span>
            <span>✓</span>
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

      <!-- Quick Action Bar visible immediately without opening Details -->
      <div class="history-card-quick-actions">
        <button class="secondary-btn small-btn repeat-workout-btn" data-id="${item.id}" type="button">
          🔄 Повторить тренировку
        </button>
        <button class="secondary-btn small-btn save-tpl-history-btn" data-id="${item.id}" type="button" title="Сохранить в Мои программы">
          📌 В программы
        </button>
        <button class="danger-icon-btn delete-workout-btn" data-id="${item.id}" type="button" title="Удалить из истории">🗑</button>
      </div>

      <!-- Expandable Accordion Drill-Down -->
      <div class="history-drilldown hidden">
        <div style="font-size:0.8rem; font-weight:700; color:var(--accent-gold); text-transform:uppercase; margin-bottom:4px;">
          📋 Подробный журнал подходов:
        </div>
        ${drilldownBlocksHtml}
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

      const clonedExercises = item.exercises.map((ex) => {
        const canBW = canExerciseUseBodyweight(ex);
        const isBW = canBW ? !!ex.isBodyweight : false;
        return {
          id: ex.id,
          name: ex.name,
          muscle: ex.muscle,
          equip: ex.equip || (isBW ? 'bodyweight' : 'barbell'),
          canBodyweight: canBW,
          isBodyweight: isBW,
          sets: ex.sets.map((s) => ({
            weight: s.weight,
            reps: s.reps,
            isBodyweight: isBW,
            completed: false
          }))
        };
      });

      startNewWorkout(item.title, clonedExercises);
    };

    // Fix #7: Save past workout to "My Programs"
    card.querySelector('.save-tpl-history-btn').onclick = (e) => {
      e.stopPropagation();
      saveExercisesListAsCustomTemplate(item.title, validExercises);
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
  // 10. Athlete Profile, Onboarding & Bodyweight Tracker + SVG Chart
  // ==========================================================================

  const profileAvatarIcon = document.getElementById('profileAvatarIcon');
  const profileNameInput = document.getElementById('profileNameInput');
  const profileGenderSelect = document.getElementById('profileGenderSelect');
  const profileGoalSelect = document.getElementById('profileGoalSelect');
  const profileHeightInput = document.getElementById('profileHeightInput');
  const profileWeightInput = document.getElementById('profileWeightInput');
  const bmiValueDisplay = document.getElementById('bmiValueDisplay');
  const bmiStatusText = document.getElementById('bmiStatusText');
  const bmiContextNote = document.getElementById('bmiContextNote');
  const recordWeightBtn = document.getElementById('recordWeightBtn');
  const weightLogChips = document.getElementById('weightLogChips');
  const weightChartContainer = document.getElementById('weightChartContainer');
  const weightTrendBadge = document.getElementById('weightTrendBadge');

  // Onboarding modal elements
  const onboardNameInput = document.getElementById('onboardNameInput');
  const onboardGenderSelect = document.getElementById('onboardGenderSelect');
  const onboardHeightInput = document.getElementById('onboardHeightInput');
  const onboardWeightInput = document.getElementById('onboardWeightInput');
  const onboardGoalSelect = document.getElementById('onboardGoalSelect');
  const skipOnboardingBtn = document.getElementById('skipOnboardingBtn');
  const saveOnboardingBtn = document.getElementById('saveOnboardingBtn');

  function updateAvatarAndGreeting() {
    if (profileAvatarIcon) {
      if (profileData.gender === 'female') {
        profileAvatarIcon.textContent = '🏃‍♀️';
      } else if (profileData.gender === 'male') {
        profileAvatarIcon.textContent = '🏋️‍♂️';
      } else {
        profileAvatarIcon.textContent = '💪';
      }
    }

    const greetingTitle = document.getElementById('greetingTitle');
    if (greetingTitle) {
      const cleanName = (profileData.name || '').trim();
      if (cleanName) {
        greetingTitle.textContent = `Привет, ${cleanName}! 💪`;
      } else if (profileData.gender === 'female') {
        greetingTitle.textContent = 'Привет, чемпионка! 💪';
      } else {
        greetingTitle.textContent = 'Привет, чемпион! 💪';
      }
    }
  }

  function calculateBMI(weightKg, heightCm, goal = 'athletic') {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);

    if ((!w || w <= 0) && (!h || h <= 0)) {
      return {
        val: '—',
        status: 'Укажите рост и вес',
        note: '💡 Если не знаете точный вес или рост прямо сейчас — можно оставить поля пустыми или указать примерно и поменять позже.'
      };
    }
    if (!h || h <= 0) {
      return {
        val: '—',
        status: 'Не указан рост',
        note: '💡 Укажите рост в сантиметрах (хотя бы примерно), чтобы рассчитать спортивный ИМТ.'
      };
    }
    if (!w || w <= 0) {
      return {
        val: '—',
        status: 'Не указан вес',
        note: '💡 Когда взвеситесь (или примерно), укажите вес тела выше для расчёта оценки формы.'
      };
    }

    const heightM = h / 100;
    const bmi = w / (heightM * heightM);
    const valFormatted = bmi.toFixed(1);

    let status = 'Отличная форма 👍';
    let note = '💡 Классический медицинский ИМТ не отличает мышцы от жира. У тренирующихся в зале индекс 24.5–28.5 чаще всего отражает развитую мускулатуру.';

    if (goal === 'athletic') {
      if (bmi < 19.5) {
        status = 'Резерв для набора массы 🌱';
        note = '💡 Отличная база для профицита калорий и силового прогресса!';
      } else if (bmi < 24.5) {
        status = 'Сухая атлетичная форма ⚡';
        note = '💡 Отличное соотношение роста и веса. При желании можно плавно набирать качественную мышечную массу.';
      } else if (bmi <= 28.5) {
        status = 'Атлетическая мышечная форма 💪';
        note = `💡 При росте ${h} см и весе ${w} кг обычный калькулятор показал бы «избыточный вес», но для силового атлета ИМТ ${valFormatted} — это плотная мышечная масса и крепкий каркас!`;
      } else if (bmi <= 31.5) {
        status = 'Мощная силовая масса 🐻';
        note = '💡 Выраженная силовая комплекция (пауэрлифтинг / тяжелый силовой тренинг).';
      } else {
        status = 'Высокая масса тела';
        note = '💡 Рекомендуется следить за комфортом суставов и кардио-выносливостью.';
      }
    } else if (goal === 'fitness') {
      if (bmi < 18.5) status = 'Дефицит массы';
      else if (bmi < 25.5) status = 'Оптимальный тонус 👍';
      else if (bmi <= 27.5) status = 'Спортивное плотное сложение 💪';
      else status = 'Выше среднего диапазона';
    } else {
      // cut / standard
      if (bmi < 18.5) status = 'Дефицит массы';
      else if (bmi < 25) status = 'Нормальный вес 👍';
      else if (bmi < 28) status = 'Плотная форма / Сушка 🔥';
      else status = 'Этап снижения веса';
    }

    return { val: valFormatted, status, note };
  }

  function updateBMIDisplay() {
    const bmi = calculateBMI(profileData.weight, profileData.height, profileData.goal || 'athletic');
    bmiValueDisplay.textContent = bmi.val;
    bmiStatusText.textContent = bmi.status;
    if (bmiContextNote && bmi.note) {
      bmiContextNote.textContent = bmi.note;
    }
  }

  // Fix #12: Render clean SVG Bodyweight Line Chart
  function renderWeightChart() {
    if (!weightChartContainer) return;
    const logs = (profileData.weightLog || []).slice(-10);

    if (weightTrendBadge) {
      if (logs.length >= 2) {
        const firstW = parseFloat(logs[0].weight);
        const lastW = parseFloat(logs[logs.length - 1].weight);
        const diff = Math.round((lastW - firstW) * 10) / 10;
        const sign = diff > 0 ? '+' : '';
        weightTrendBadge.textContent = `${sign}${diff} кг`;
      } else if (logs.length === 1) {
        weightTrendBadge.textContent = `${logs[0].weight} кг`;
      } else {
        weightTrendBadge.textContent = '';
      }
    }

    if (logs.length === 0) {
      weightChartContainer.innerHTML = `<div class="weight-chart-empty">Нажмите «Сохранить параметры и записать вес», чтобы построить график динамики веса 📈</div>`;
      return;
    }

    const width = 320;
    const height = 128;
    const padLeft = 28;
    const padRight = 28;
    const padTop = 26;
    const padBottom = 26;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const weights = logs.map((l) => parseFloat(l.weight));
    let minW = Math.min(...weights);
    let maxW = Math.max(...weights);
    if (minW === maxW) {
      minW -= 2;
      maxW += 2;
    } else {
      const rangePad = (maxW - minW) * 0.2;
      minW -= rangePad;
      maxW += rangePad;
    }

    const points = logs.map((log, i) => {
      const x = logs.length === 1
        ? width / 2
        : padLeft + (i / (logs.length - 1)) * plotW;
      const y = padTop + plotH - ((parseFloat(log.weight) - minW) / (maxW - minW)) * plotH;
      const dStr = new Date(log.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, w: log.weight, dStr };
    });

    const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
    const areaPoints = points.length > 1
      ? `${points[0].x},${height - padBottom} ${polylinePoints} ${points[points.length - 1].x},${height - padBottom}`
      : '';

    const dotsSvg = points.map((p) => `
      <g>
        <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#f5a623" stroke="#181310" stroke-width="2"/>
        <text x="${p.x}" y="${p.y - 9}" text-anchor="middle" fill="#f5ebe1" font-size="10" font-weight="700">${p.w}</text>
        <text x="${p.x}" y="${height - 8}" text-anchor="middle" fill="#a8988a" font-size="9">${p.dStr}</text>
      </g>
    `).join('');

    weightChartContainer.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="weight-chart-svg" aria-label="График веса">
        <defs>
          <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f5a623" stop-opacity="0.32"/>
            <stop offset="100%" stop-color="#f5a623" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="${padLeft}" y1="${height - padBottom}" x2="${width - padRight}" y2="${height - padBottom}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        ${points.length > 1 ? `<polygon points="${areaPoints}" fill="url(#weightAreaGrad)"/>` : ''}
        ${points.length > 1 ? `<polyline points="${polylinePoints}" fill="none" stroke="#f5a623" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
        ${dotsSvg}
      </svg>
    `;
  }

  function renderProfile() {
    profileNameInput.value = profileData.name || '';
    profileGenderSelect.value = profileData.gender || '';
    if (profileGoalSelect) {
      profileGoalSelect.value = profileData.goal || 'athletic';
    }
    profileHeightInput.value = (profileData.height !== undefined && profileData.height !== null && profileData.height !== '') ? profileData.height : '';
    profileWeightInput.value = (profileData.weight !== undefined && profileData.weight !== null && profileData.weight !== '') ? profileData.weight : '';

    updateAvatarAndGreeting();
    updateBMIDisplay();
    renderWeightChart();

    // Weight history chips with delete buttons
    weightLogChips.innerHTML = '';
    const logs = profileData.weightLog || [];
    if (logs.length === 0) {
      weightLogChips.innerHTML = `<span style="font-size:0.8rem; color:var(--text-dim);">Пока нет записей веса</span>`;
    } else {
      const indexedLogs = logs.map((item, idx) => ({ item, idx })).slice(-10).reverse();
      indexedLogs.forEach(({ item: log, idx: originalIdx }) => {
        const chip = document.createElement('div');
        chip.className = 'weight-chip';
        const d = new Date(log.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        chip.innerHTML = `
          <span class="weight-chip-date">${d}</span>
          <span class="weight-chip-val">${log.weight} кг</span>
          <button type="button" class="weight-chip-del" data-idx="${originalIdx}" title="Удалить этот замер">✕</button>
        `;

        chip.querySelector('.weight-chip-del').onclick = (e) => {
          e.stopPropagation();
          profileData.weightLog.splice(originalIdx, 1);
          if (profileData.weightLog.length > 0) {
            profileData.weight = profileData.weightLog[profileData.weightLog.length - 1].weight;
          }
          saveProfile();
          renderProfile();
        };

        weightLogChips.appendChild(chip);
      });
    }
  }

  profileNameInput.oninput = (e) => {
    profileData.name = e.target.value.trim();
    saveProfile();
    updateAvatarAndGreeting();
  };

  profileGenderSelect.onchange = (e) => {
    profileData.gender = e.target.value;
    saveProfile();
    updateAvatarAndGreeting();
  };

  if (profileGoalSelect) {
    profileGoalSelect.onchange = (e) => {
      profileData.goal = e.target.value;
      saveProfile();
      updateBMIDisplay();
    };
  }

  profileHeightInput.oninput = (e) => {
    const raw = e.target.value.trim();
    profileData.height = raw ? (parseFloat(raw) || '') : '';
    saveProfile();
    updateBMIDisplay();
  };

  profileWeightInput.oninput = (e) => {
    const raw = e.target.value.trim();
    profileData.weight = raw ? (parseFloat(raw) || '') : '';
    saveProfile();
    updateBMIDisplay();
  };

  // Fix #12: Consistent saving of all body parameters + logging weight entry
  recordWeightBtn.onclick = () => {
    blurActiveInput();
    profileData.name = profileNameInput.value.trim();
    profileData.gender = profileGenderSelect.value;
    if (profileGoalSelect) {
      profileData.goal = profileGoalSelect.value;
    }

    const rawHeight = profileHeightInput.value.trim().replace(',', '.');
    profileData.height = rawHeight ? (parseFloat(rawHeight) || '') : '';

    const rawWeight = profileWeightInput.value.trim().replace(',', '.');
    const currentWeight = rawWeight ? parseFloat(rawWeight) : 0;

    if (currentWeight && currentWeight > 0) {
      profileData.weight = currentWeight;
      if (!profileData.weightLog) profileData.weightLog = [];

      // If last weight entry was already logged today, update it or add a new point if weight changed
      const todayKey = new Date().toISOString().slice(0, 10);
      const lastEntry = profileData.weightLog[profileData.weightLog.length - 1];
      if (lastEntry && lastEntry.date && lastEntry.date.slice(0, 10) === todayKey) {
        lastEntry.weight = currentWeight;
        lastEntry.date = new Date().toISOString();
      } else {
        profileData.weightLog.push({
          date: new Date().toISOString(),
          weight: currentWeight
        });
      }
    }

    saveProfile();
    renderProfile();

    const origText = recordWeightBtn.textContent;
    recordWeightBtn.textContent = '✓ Сохранено!';
    setTimeout(() => {
      recordWeightBtn.textContent = origText;
    }, 1800);
  };

  // First-Launch Onboarding Handlers ("Давай познакомимся!")
  function checkAndShowOnboarding() {
    if (!profileData.onboarded) {
      if (onboardNameInput) onboardNameInput.value = profileData.name || '';
      if (onboardGenderSelect) onboardGenderSelect.value = profileData.gender || '';
      if (onboardHeightInput) onboardHeightInput.value = profileData.height || '';
      if (onboardWeightInput) onboardWeightInput.value = profileData.weight || '';
      if (onboardGoalSelect) onboardGoalSelect.value = profileData.goal || 'athletic';
      openModal('modalOnboarding');
    }
  }

  if (skipOnboardingBtn) {
    skipOnboardingBtn.onclick = () => {
      profileData.onboarded = true;
      saveProfile();
      updateAvatarAndGreeting();
      renderProfile();
      closeModal('modalOnboarding');
    };
  }

  if (saveOnboardingBtn) {
    saveOnboardingBtn.onclick = () => {
      const nameVal = onboardNameInput ? onboardNameInput.value.trim() : '';
      const genderVal = onboardGenderSelect ? onboardGenderSelect.value : '';
      const heightVal = onboardHeightInput && onboardHeightInput.value.trim() ? (parseFloat(onboardHeightInput.value.trim()) || '') : '';
      const weightVal = onboardWeightInput && onboardWeightInput.value.trim() ? (parseFloat(onboardWeightInput.value.trim()) || '') : '';
      const goalVal = onboardGoalSelect ? onboardGoalSelect.value : 'athletic';

      profileData.name = nameVal;
      profileData.gender = genderVal;
      profileData.height = heightVal;
      profileData.weight = weightVal;
      profileData.goal = goalVal;
      profileData.onboarded = true;

      if (weightVal && (!profileData.weightLog || profileData.weightLog.length === 0)) {
        profileData.weightLog = [{ date: new Date().toISOString(), weight: weightVal }];
      }

      saveProfile();
      updateAvatarAndGreeting();
      renderProfile();
      closeModal('modalOnboarding');
    };
  }

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
      const equipInfo = getEquipInfo(ex);
      const stats = findExerciseHistoryStats(ex.name);
      const prLine = (stats && stats.prText) ? ` • 🏆 ${stats.prText}` : '';
      const item = document.createElement('div');
      item.className = 'library-item';
      item.innerHTML = `
        <div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="library-item-title">${ex.name}</span>
            <button type="button" class="exercise-info-btn" data-ex-name="${ex.name}" data-ex-muscle="${ex.muscle}" title="Анимация и прогресс">ℹ️</button>
          </div>
          <div class="library-item-muscle">${ex.muscle} • ${equipInfo.badge}${prLine}</div>
        </div>
      `;

      item.querySelector('.exercise-info-btn').onclick = (e) => {
        e.stopPropagation();
        openExerciseInfoModal(ex.name, ex.muscle);
      };

      item.onclick = () => {
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
  const settingExerciseRest = document.getElementById('settingExerciseRest');
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
    settingDefaultRest.value = String(settings.defaultRestSec || 90);
    if (settingExerciseRest) {
      settingExerciseRest.value = String(settings.exerciseRestSec || 120);
    }
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
    settings.defaultRestSec = parseInt(e.target.value, 10) || 90;
    saveSettings();
  };

  if (settingExerciseRest) {
    settingExerciseRest.onchange = (e) => {
      settings.exerciseRestSec = parseInt(e.target.value, 10) || 120;
      saveSettings();
    };
  }

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
          name: '',
          gender: '',
          goal: 'athletic',
          height: '',
          weight: '',
          weightLog: [],
          onboarded: false
        };
        activeWorkout = null;
        settings = {
          sound: true,
          vibrate: true,
          defaultRestSec: 90,
          exerciseRestSec: 120,
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
        checkAndShowOnboarding();
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
      const equipInfo = getEquipInfo(ex);
      const btn = document.createElement('button');
      btn.className = 'sheet-exercise-btn';
      btn.innerHTML = `
        <span class="sheet-exercise-name">${ex.name}</span>
        <span class="sheet-exercise-tag">${ex.muscle} • ${equipInfo.badge}</span>
      `;

      btn.onclick = () => {
        if (isSelectingForTemplateBuilder) {
          templateBuilderExercises.push({
            id: ex.id,
            name: ex.name,
            muscle: ex.muscle,
            equip: ex.equip || (ex.isBodyweight ? 'bodyweight' : 'barbell'),
            canBodyweight: canExerciseUseBodyweight(ex),
            isBodyweight: canExerciseUseBodyweight(ex) && !!ex.isBodyweight
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

  // Finish Workout Modal (triggered from top OR bottom finish button)
  function triggerFinishWorkoutModal() {
    blurActiveInput();
    if (!activeWorkout || activeWorkout.exercises.length === 0) {
      alert('Добавьте хотя бы одно упражнение перед завершением.');
      return;
    }

    const elapsedSec = Math.floor((Date.now() - activeWorkout.startTime) / 1000);
    let totalCompletedSets = 0;
    let totalTonnage = 0;

    activeWorkout.exercises.forEach((ex) => {
      const equipInfo = getEquipInfo(ex);
      const mult = equipInfo.multiplier || 1;
      ex.sets.forEach((set) => {
        if (set.completed) {
          totalCompletedSets += 1;
          totalTonnage += (parseFloat(set.weight) || 0) * mult * (parseInt(set.reps, 10) || 0);
        }
      });
    });

    if (totalCompletedSets === 0) {
      alert('Отметьте галочкой (✓) хотя бы один выполненный подход перед сохранением тренировки.');
      return;
    }

    document.getElementById('finishTimeVal').textContent = formatTime(elapsedSec);
    document.getElementById('finishSetsVal').textContent = String(totalCompletedSets);
    document.getElementById('finishTonnageVal').textContent = `${Math.round(totalTonnage).toLocaleString('ru-RU')} кг`;
    document.getElementById('finishWorkoutNotes').value = '';

    openModal('modalFinishWorkout');
  }

  finishWorkoutBtn.addEventListener('click', triggerFinishWorkoutModal);
  if (bottomFinishWorkoutBtn) {
    bottomFinishWorkoutBtn.addEventListener('click', triggerFinishWorkoutModal);
  }

  // Fix #7: Save active or finishing workout to "Мои программы"
  if (activeSaveAsTemplateBtn) {
    activeSaveAsTemplateBtn.addEventListener('click', () => {
      if (!activeWorkout) return;
      saveExercisesListAsCustomTemplate(activeWorkout.title, activeWorkout.exercises);
    });
  }

  if (finishSaveTemplateBtn) {
    finishSaveTemplateBtn.addEventListener('click', () => {
      if (!activeWorkout) return;
      saveExercisesListAsCustomTemplate(activeWorkout.title, activeWorkout.exercises);
    });
  }

  document.getElementById('backToWorkoutBtn').addEventListener('click', () => {
    closeModal('modalFinishWorkout');
  });

  document.getElementById('saveFinishedWorkoutBtn').addEventListener('click', () => {
    const elapsedSec = Math.floor((Date.now() - activeWorkout.startTime) / 1000);
    let totalCompletedSets = 0;
    let totalTonnage = 0;

    // Keep ONLY completed sets when saving to history!
    const cleanedExercises = activeWorkout.exercises
      .map((ex) => {
        const canBW = canExerciseUseBodyweight(ex);
        const isBW = canBW && !!ex.isBodyweight;
        const equipInfo = getEquipInfo(ex);
        const mult = equipInfo.multiplier || 1;
        const completedSets = (ex.sets || []).filter((set) => set.completed);
        completedSets.forEach((set) => {
          totalCompletedSets += 1;
          totalTonnage += (parseFloat(set.weight) || 0) * mult * (parseInt(set.reps, 10) || 0);
        });
        return {
          id: ex.id,
          name: ex.name,
          muscle: ex.muscle,
          equip: equipInfo.type,
          canBodyweight: canBW,
          isBodyweight: isBW,
          sets: completedSets
        };
      })
      .filter((ex) => ex.sets.length > 0);

    const finishedRecord = {
      id: activeWorkout.id,
      title: activeWorkout.title,
      date: new Date().toISOString(),
      durationSec: elapsedSec,
      tonnage: Math.round(totalTonnage),
      totalSets: totalCompletedSets,
      exercises: cleanedExercises,
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

  function triggerCancelWorkout() {
    blurActiveInput();
    if (confirm('Вы уверены, что хотите сбросить текущую тренировку? Все несохраненные подходы будут удалены.')) {
      activeWorkout = null;
      saveActiveWorkout();
      stopWorkoutStopwatch();
      stopRestTimer(true);
      activeDot.classList.add('hidden');
      document.getElementById('startBtnText').textContent = 'Выбрать тренировку';
      switchView('viewHome');
    }
  }

  cancelWorkoutBtn.addEventListener('click', triggerCancelWorkout);
  if (bottomCancelWorkoutBtn) {
    bottomCancelWorkoutBtn.addEventListener('click', triggerCancelWorkout);
  }

  // ==========================================================================
  // 15. App Initialization, Live Calendar Tab, Wake Lock & Service Worker
  // ==========================================================================

  function updateLiveCalendarTabIcon() {
    const tabCalMonth = document.getElementById('tabCalMonth');
    const tabCalDay = document.getElementById('tabCalDay');
    const now = new Date();
    const shortMonths = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'];
    if (tabCalMonth) tabCalMonth.textContent = shortMonths[now.getMonth()];
    if (tabCalDay) tabCalDay.textContent = String(now.getDate());
  }

  let wakeLockSentinel = null;
  async function requestWakeLockIfNeeded() {
    if (!('wakeLock' in navigator)) return;
    if (document.visibilityState !== 'visible') return;
    if (!activeWorkout && !restTimer.active) return;
    try {
      if (!wakeLockSentinel) {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        wakeLockSentinel.addEventListener('release', () => {
          wakeLockSentinel = null;
        });
      }
    } catch (e) {
      // WakeLock may fail on low battery or unsupported browser; ignore silently
    }
  }

  function syncViewportHeight() {
    const isStandalone = window.navigator.standalone === true ||
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
    let targetHeight = window.innerHeight;

    if (isStandalone && window.screen && window.screen.height > window.innerHeight) {
      targetHeight = window.screen.height;
    }

    document.documentElement.style.setProperty('--app-shell-height', `${targetHeight}px`);
  }

  function initApp() {
    syncViewportHeight();
    updateLiveCalendarTabIcon();

    window.addEventListener('resize', syncViewportHeight);
    window.addEventListener('orientationchange', () => {
      setTimeout(syncViewportHeight, 100);
    });

    // Fix #10: Suppress iOS "Undo Typing" popup when locking/unlocking or shaking phone
    window.addEventListener('beforeinput', (e) => {
      if (e.inputType === 'historyUndo' || e.inputType === 'historyRedo') {
        e.preventDefault();
      }
    });

    window.addEventListener('pagehide', blurActiveInput);
    window.addEventListener('blur', blurActiveInput);

    // Fix #10 & #11: On lock/unlock or app switch, blur inputs and immediately recalculate timers from real timestamps
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        blurActiveInput();
      } else if (document.visibilityState === 'visible') {
        updateLiveCalendarTabIcon();
        if (activeWorkout) {
          startWorkoutStopwatch();
        }
        if (restTimer.active) {
          tickRestTimer();
        }
        requestWakeLockIfNeeded();
      }
    });

    window.addEventListener('focus', () => {
      if (activeWorkout) startWorkoutStopwatch();
      if (restTimer.active) tickRestTimer();
    });

    loadState();
    applySettingsUI();
    updateAvatarAndGreeting();
    renderHome();
    checkAndShowOnboarding();
    restoreRestTimerState();

    if (activeWorkout) {
      activeDot.classList.remove('hidden');
      document.getElementById('startBtnText').textContent = 'Продолжить текущую тренировку';
      startWorkoutStopwatch();
      requestWakeLockIfNeeded();
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js?v=1.8').then((reg) => {
          if (reg && reg.update) reg.update();
        }).catch((err) => {
          console.warn('Service Worker registration skipped or failed:', err);
        });
      });
    }
  }

  initApp();
})();
