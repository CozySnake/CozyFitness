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
    { id: 'bench_press', kind: 'strength', name: 'Жим штанги лёжа', muscle: 'Грудь', equip: 'barbell' },
    { id: 'incline_dumbbell_press', kind: 'strength', name: 'Жим гантелей на наклонной', muscle: 'Грудь', equip: 'dumbbell_2' },
    { id: 'dips_chest', kind: 'strength', name: 'Отжимания на брусьях', muscle: 'Грудь', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },
    { id: 'cable_crossover', kind: 'strength', name: 'Сведение рук в кроссовере', muscle: 'Грудь', equip: 'machine' },
    { id: 'dumbbell_flyes', kind: 'strength', name: 'Разводка гантелей лёжа', muscle: 'Грудь', equip: 'dumbbell_2' },
    { id: 'pushups', kind: 'strength', name: 'Отжимания от пола', muscle: 'Грудь', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },

    // Спина
    { id: 'pullups', kind: 'strength', name: 'Подтягивания', muscle: 'Спина', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },
    { id: 'lat_pulldown', kind: 'strength', name: 'Тяга верхнего блока к груди', muscle: 'Спина', equip: 'machine' },
    { id: 'barbell_row', kind: 'strength', name: 'Тяга штанги в наклоне', muscle: 'Спина', equip: 'barbell' },
    { id: 'seated_cable_row', kind: 'strength', name: 'Горизонтальная тяга блока', muscle: 'Спина', equip: 'machine' },
    { id: 'dumbbell_row', kind: 'strength', name: 'Тяга гантели одной рукой', muscle: 'Спина', equip: 'dumbbell_1' },
    { id: 'hyperextension', kind: 'strength', name: 'Гиперэкстензия', muscle: 'Спина', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },
    { id: 'deadlift', kind: 'strength', name: 'Классическая становая тяга', muscle: 'Спина', equip: 'barbell' },

    // Ноги
    { id: 'squats', kind: 'strength', name: 'Приседания со штангой', muscle: 'Ноги', equip: 'barbell', canBodyweight: true },
    { id: 'leg_press', kind: 'strength', name: 'Жим ногами в тренажере', muscle: 'Ноги', equip: 'machine' },
    { id: 'romanian_deadlift', kind: 'strength', name: 'Румынская становая тяга', muscle: 'Ноги', equip: 'barbell' },
    { id: 'lunges', kind: 'strength', name: 'Выпады с гантелями', muscle: 'Ноги', equip: 'dumbbell_2', canBodyweight: true },
    { id: 'leg_extension', kind: 'strength', name: 'Разгибания ног в тренажере', muscle: 'Ноги', equip: 'machine' },
    { id: 'leg_curl', kind: 'strength', name: 'Сгибания ног лёжа', muscle: 'Ноги', equip: 'machine' },
    { id: 'calf_raises', kind: 'strength', name: 'Подъемы на носки (икры)', muscle: 'Ноги', equip: 'machine', canBodyweight: true },

    // Плечи
    { id: 'overhead_press', kind: 'strength', name: 'Армейский жим стоя', muscle: 'Плечи', equip: 'barbell' },
    { id: 'seated_dumbbell_press', kind: 'strength', name: 'Жим гантелей сидя', muscle: 'Плечи', equip: 'dumbbell_2' },
    { id: 'lateral_raises', kind: 'strength', name: 'Махи гантелями в стороны', muscle: 'Плечи', equip: 'dumbbell_2' },
    { id: 'upright_row', kind: 'strength', name: 'Тяга штанги к подбородку', muscle: 'Плечи', equip: 'barbell' },
    { id: 'rear_delt_fly', kind: 'strength', name: 'Махи на заднюю дельту в наклоне', muscle: 'Плечи', equip: 'dumbbell_2' },

    // Руки
    { id: 'barbell_curl', kind: 'strength', name: 'Подъем штанги на бицепс', muscle: 'Руки', equip: 'barbell' },
    { id: 'hammer_curls', kind: 'strength', name: 'Молотковые сгибания с гантелями', muscle: 'Руки', equip: 'dumbbell_2' },
    { id: 'french_press', kind: 'strength', name: 'Французский жим лёжа', muscle: 'Руки', equip: 'barbell' },
    { id: 'cable_tricep_pushdown', kind: 'strength', name: 'Разгибания на трицепс на блоке', muscle: 'Руки', equip: 'machine' },
    { id: 'preacher_curl', kind: 'strength', name: 'Сгибания на скамье Скотта', muscle: 'Руки', equip: 'barbell' },

    // Пресс
    { id: 'plank', kind: 'timed', name: 'Планка', muscle: 'Пресс', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },
    { id: 'crunches', kind: 'strength', name: 'Скручивания на коврике', muscle: 'Пресс', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },
    { id: 'hanging_leg_raises', kind: 'strength', name: 'Подъемы ног в висе', muscle: 'Пресс', isBodyweight: true, canBodyweight: true, equip: 'bodyweight' },
    { id: 'cable_crunch', kind: 'strength', name: 'Скручивания на блоке («Молитва»)', muscle: 'Пресс', equip: 'machine' },

    // Кардио
    { id: 'treadmill', kind: 'cardio', name: 'Беговая дорожка', muscle: 'Кардио', equip: 'machine' },
    { id: 'stationary_bike', kind: 'cardio', name: 'Велотренажер', muscle: 'Кардио', equip: 'machine' },
    { id: 'rowing_machine', kind: 'cardio', name: 'Гребной тренажер', muscle: 'Кардио', equip: 'machine' }
  ];

  FitnessData.registerCatalog(DEFAULT_EXERCISES);

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

  // Complete Exercise Technique, Anatomical Muscle Map & Photo Knowledge Base (All 37 Built-in Exercises)
  const EXERCISE_GUIDES = {
    // === ГРУДЬ ===
    bench_press: {
      photoSlug: 'Barbell_Bench_Press_-_Medium_Grip',
      primary: ['chest'],
      secondary: ['front_delts', 'triceps'],
      muscles: 'Большая и малая грудные мышцы (основная), передний пучок дельт и трицепсы (синергисты).',
      steps: [
        'Лягте на скамью, плотно сведите лопатки и опустите их вниз к тазу. Стопы всей площадью упираются в пол.',
        'Возьмитесь за гриф хватом чуть шире плеч. Снимите штангу и зафиксируйте над верхней частью груди.',
        'На вдохе плавно опустите гриф к нижней части груди. Локти держите под углом ~70–75° к корпусу.',
        'На выдохе мощно выжмите штангу вверх по плавной дуге, не разводя лопатки в верхней точке.'
      ],
      tips: 'Не отрывайте таз от скамьи и не разводите локти под 90° к корпусу, чтобы беречь плечевые суставы.'
    },
    incline_dumbbell_press: {
      photoSlug: 'Incline_Dumbbell_Press',
      primary: ['chest', 'front_delts'],
      secondary: ['triceps'],
      muscles: 'Верхний (ключичный) отдел грудных мышц, передняя дельта, трицепс.',
      steps: [
        'Установите угол наклона скамьи 30–35°. Лягте, сведите лопатки и прижмите плечи к спинке.',
        'Поднимите гантели к плечам, предплечья строго вертикальны.',
        'На выдохе выжмите гантели вверх по сходящейся траектории над верхом груди.',
        'На вдохе подконтрольно опустите гантели вниз до приятного растяжения грудных мышц.'
      ],
      tips: 'Не ставьте угол скамьи выше 45°, иначе нагрузку заберут передние дельты вместо верха груди.'
    },
    dips_chest: {
      photoSlug: 'Dips_-_Chest_Version',
      primary: ['chest', 'triceps'],
      secondary: ['front_delts'],
      muscles: 'Нижний и внешний отделы грудных мышц, трицепсы, передние дельты.',
      steps: [
        'Примите упор на брусьях на прямых руках, опустите плечи вниз от ушей.',
        'Наклоните корпус вперёд на 20–30°, ноги согните в коленях и отведите чуть назад.',
        'На вдохе плавно опуститесь до угла 90° в локтях, слегка разводя локти в стороны.',
        'На выдохе мощно выжмите себя вверх за счёт сокращения грудных и трицепсов.'
      ],
      tips: 'Наклон корпуса вперёд смещает акцент на грудь; вертикальный корпус переносит нагрузку на трицепс.'
    },
    cable_crossover: {
      photoSlug: 'Cable_Crossover',
      primary: ['chest'],
      secondary: ['front_delts', 'biceps'],
      muscles: 'Большая грудная мышца (внутренний и нижний края), передняя дельта, бицепс (стабилизатор).',
      steps: [
        'Возьмите рукояти верхних блоков, сделайте шаг вперёд и слегка наклоните корпус (15–20°).',
        'Локти слегка согнуты и зафиксированы на протяжении всего движения.',
        'На выдохе широкой дугой сведите рукояти перед собой до касания ладоней на уровне низа груди.',
        'Задержитесь в пиковом сокращении на 1 секунду и на вдохе плавно разведите руки назад.'
      ],
      tips: 'Не превращайте сведение в жим — угол в локтях не должен меняться. Работайте именно грудными мышцами.'
    },
    dumbbell_flyes: {
      photoSlug: 'Dumbbell_Flyes',
      primary: ['chest'],
      secondary: ['front_delts', 'biceps'],
      muscles: 'Большие грудные мышцы (акцент на растяжение и проработку центральной части), передние дельты.',
      steps: [
        'Лягте на горизонтальную скамью, сведите лопатки и поднимите гантели над грудью ладонями друг к другу.',
        'Слегка согните руки в локтях (~15°) и зафиксируйте этот угол.',
        'На вдохе широкой дугой разведите гантели в стороны до уровня грудной клетки.',
        'На выдохе по той же широкой дуге сведите гантели обратно, словно обнимаете широкое дерево.'
      ],
      tips: 'Не опускайте гантели слишком низко в нижней точке, чтобы не травмировать связки плеча.'
    },
    pushups: {
      photoSlug: 'Pushups',
      primary: ['chest'],
      secondary: ['triceps', 'front_delts', 'abs'],
      muscles: 'Большие грудные мышцы, трицепсы, передние дельты, мышцы кора.',
      steps: [
        'Примите упор лёжа: ладони чуть шире плеч, тело образует прямую линию от макушки до пят.',
        'На вдохе плавно согните руки, опуская грудную клетку почти до касания пола (локти под углом ~45° к телу).',
        'На выдохе мощно вытолкните корпус вверх до полного выпрямления рук.'
      ],
      tips: 'Держите пресс и ягодицы в тонусе, не допускайте провисания поясницы.'
    },

    // === СПИНА ===
    pullups: {
      photoSlug: 'Pullups',
      primary: ['lats'],
      secondary: ['biceps', 'traps', 'forearms'],
      muscles: 'Широчайшие и большие круглые мышцы спины, бицепсы, трапеции, предплечья.',
      steps: [
        'Возьмитесь за перекладину прямым хватом чуть шире плеч.',
        'Из виса начните движение с опускания и сведения лопаток вниз.',
        'На выдохе подтяните грудь к перекладине, направляя локти вниз к талии.',
        'На вдохе плавно и подконтрольно опуститесь в исходное положение.'
      ],
      tips: 'Избегайте рывков и раскачки. Мысленно тяните локти к рёбрам, чтобы работала спина, а не только руки.'
    },
    lat_pulldown: {
      photoSlug: 'Wide-Grip_Lat_Pulldown',
      primary: ['lats'],
      secondary: ['biceps', 'traps', 'rear_delts'],
      muscles: 'Широчайшие мышцы спины (верх и ширина), большие круглые мышцы, бицепсы.',
      steps: [
        'Возьмитесь за рукоять широким хватом, сядьте и зафиксируйте бёдра под валиками.',
        'Расправьте грудь и отклоните корпус назад буквально на 10–15°.',
        'На выдохе потяните рукоять вниз к верхней части груди, сводя лопатки.',
        'На вдохе плавно верните рукоять вверх, чувствуя растяжение широчайших.'
      ],
      tips: 'Не тяните блок за голову (это опасно для плечевых суставов) и не раскачивайтесь всем корпусом назад.'
    },
    barbell_row: {
      photoSlug: 'Bent_Over_Barbell_Row',
      primary: ['lats', 'traps'],
      secondary: ['rear_delts', 'biceps', 'lower_back'],
      muscles: 'Широчайшие мышцы спины, ромбовидные и трапеции, задние дельты, разгибатели спины, бицепс.',
      steps: [
        'Возьмите штангу хватом чуть шире плеч. Согните колени и наклоните прямой корпус вперёд (~45–60°).',
        'Взгляд направлен вперёд-вниз, поясница в естественном прогибе.',
        'На выдохе потяните гриф вдоль бёдер к нижней части живота, ведя локти строго назад.',
        'Сожмите лопатки в верхней точке и на вдохе плавно опустите штангу.'
      ],
      tips: 'Не поднимайте корпус во время тяги и не круглите поясницу.'
    },
    seated_cable_row: {
      photoSlug: 'Seated_Cable_Rows',
      primary: ['lats', 'traps'],
      secondary: ['rear_delts', 'biceps', 'lower_back'],
      muscles: 'Толщина спины: широчайшие, средние и нижние трапеции, ромбовидные мышцы, бицепсы.',
      steps: [
        'Сядьте в тренажёр, упритесь стопами в платформу (колени слегка согнуты).',
        'Выпрямите спину, расправьте грудь и возьмите рукоять.',
        'На выдохе притяните рукоять к поясу, максимально сводя лопатки вместе.',
        'На вдохе подконтрольно вытяните руки вперёд, не скругляя поясницу.'
      ],
      tips: 'Корпус должен оставаться почти вертикальным — не превращайте упражнение в качание маятником.'
    },
    dumbbell_row: {
      photoSlug: 'One-Arm_Dumbbell_Row',
      primary: ['lats'],
      secondary: ['traps', 'rear_delts', 'biceps'],
      muscles: 'Широчайшая мышца спины (прицельно каждая сторона), трапеция, задняя дельта, бицепс.',
      steps: [
        'Упритесь одним коленом и одноимённой рукой в горизонтальную скамью, спина параллельна полу.',
        'Свободной рукой возьмите гантель нейтральным хватом.',
        'На выдохе потяните гантель по дуге назад к тазобедренному суставу (к карману штанов).',
        'На вдохе плавно опустите гантель вниз, растягивая широчайшую.'
      ],
      tips: 'Тяните гантель к поясу, а не к плечу — это максимально включает широчайшую мышцу вместо бицепса.'
    },
    hyperextension: {
      photoSlug: 'Hyperextensions_Back_Extensions',
      primary: ['lower_back', 'glutes'],
      secondary: ['hamstrings'],
      muscles: 'Разгибатели позвоночника (поясница), большие ягодичные мышцы, бицепс бедра.',
      steps: [
        'Отрегулируйте подушку тренажёра чуть ниже тазовых костей (в районе сгиба бедра).',
        'Скрестите руки на груди. На вдохе плавно наклонитесь вниз с ровной спиной.',
        'На выдохе за счёт сокращения ягодиц и мышц спины поднимите корпус до прямой линии с ногами.'
      ],
      tips: 'Не переразгибайтесь назад выше линии ног, чтобы не создавать компрессию в пояснице.'
    },
    deadlift: {
      photoSlug: 'Barbell_Deadlift',
      primary: ['lower_back', 'glutes', 'hamstrings'],
      secondary: ['quads', 'traps', 'lats', 'forearms'],
      muscles: 'Вся задняя цепь: разгибатели спины, ягодичные, бицепс бедра, квадрицепсы, трапеции и хват.',
      steps: [
        'Встаньте вплотную к грифу (гриф над центром стопы). Стопы на ширине таза.',
        'Отведите таз назад, возьмитесь за гриф руками снаружи голеней. Грудь вверх, спина жёсткая и прямая.',
        'На выдохе мощно продавите пол ногами, ведя штангу вплотную по голеням и бёдрам.',
        'Полностью выпрямитесь вверху и подконтрольно верните штангу на помост.'
      ],
      tips: 'Никогда не тяните круглой спиной. Гриф всегда должен скользить близко к ногам.'
    },

    // === НОГИ ===
    squats: {
      photoSlug: 'Barbell_Squat',
      primary: ['quads', 'glutes'],
      secondary: ['hamstrings', 'lower_back', 'abs'],
      muscles: 'Квадрицепсы (передняя поверхность бедра), большие ягодичные мышцы, приводящие, кор.',
      steps: [
        'Расположите штангу на верху трапеций. Стопы на ширине плеч, носки развёрнуты на 20–30°.',
        'Сделайте глубокий вдох в живот и напрягите пресс.',
        'Отведите таз назад и присядьте минимум до параллели бёдер с полом.',
        'На выдохе мощно встаньте, отталкиваясь всей стопой.'
      ],
      tips: 'Следите, чтобы колени смотрели строго по направлению носков и не заваливались внутрь.'
    },
    leg_press: {
      photoSlug: 'Leg_Press',
      primary: ['quads', 'glutes'],
      secondary: ['hamstrings', 'calves'],
      muscles: 'Квадрицепсы, ягодичные мышцы, задняя поверхность бедра (без осевой нагрузки на позвоночник).',
      steps: [
        'Сядьте в тренажёр, плотно прижмите таз и поясницу к спинке. Стопы на ширине плеч в центре платформы.',
        'Выжмите платформу и уберите страховочные упоры.',
        'На вдохе плавно опустите платформу до угла ~90° в коленях (таз не должен отрываться от спинки!).',
        'На выдохе мощно выжмите платформу вверх, оставляя колени чуть мягкими в верхней точке.'
      ],
      tips: 'Никогда не выпрямляйте колени «в замок» в верхней точке и не отрывайте крестец от сиденья внизу.'
    },
    romanian_deadlift: {
      photoSlug: 'Romanian_Deadlift',
      primary: ['hamstrings', 'glutes'],
      secondary: ['lower_back', 'forearms'],
      muscles: 'Бицепс бедра (задняя поверхность), ягодичные мышцы, разгибатели спины.',
      steps: [
        'Встаньте прямо со штангой в опущенных руках. Колени слегка согнуты (на 15°) и зафиксированы.',
        'На вдохе медленно отводите таз далеко назад, наклоняя прямой корпус вперёд.',
        'Опускайте гриф вдоль ног до середины голени (до сильного растяжения задней поверхности бедра).',
        'На выдохе подайте таз вперёд за счёт сокращения ягодиц и бицепса бедра.'
      ],
      tips: 'Движение происходит именно за счёт отведения таза назад (хип-хиндж), а не наклона поясницы.'
    },
    lunges: {
      photoSlug: 'Dumbbell_Lunges',
      primary: ['quads', 'glutes'],
      secondary: ['hamstrings', 'calves'],
      muscles: 'Большие ягодичные мышцы, квадрицепсы, мышцы-стабилизаторы бедра.',
      steps: [
        'Возьмите гантели в руки и встаньте прямо.',
        'Сделайте широкий шаг вперёд и на вдохе опуститесь вниз до угла 90° в обоих коленях.',
        'Колено задней ноги почти касается пола, переднее колено не выходит далеко за носок.',
        'На выдохе оттолкнитесь пяткой передней ноги и вернитесь в исходную стойку.'
      ],
      tips: 'Широкий шаг с лёгким наклоном корпуса вперёд больше включает ягодицы; короткий шаг — квадрицепс.'
    },
    leg_extension: {
      photoSlug: 'Leg_Extensions',
      primary: ['quads'],
      secondary: [],
      muscles: 'Прицельная изоляция всех четырёх головок квадрицепса (передней поверхности бедра).',
      steps: [
        'Сядьте в тренажёр, прижмите спину к спинке и заведите голени под нижний валик.',
        'Возьмитесь за боковые рукояти для стабилизации таза.',
        'На выдохе полностью разогните ноги в коленях и зафиксируйте пиковое сокращение на 1 секунду.',
        'На вдохе подконтрольно опустите вес обратно.'
      ],
      tips: 'Не бросайте вес вниз и делайте короткую паузу в самой верхней точке.'
    },
    leg_curl: {
      photoSlug: 'Lying_Leg_Curls',
      primary: ['hamstrings'],
      secondary: ['calves', 'glutes'],
      muscles: 'Двуглавая мышца бедра (бицепс бедра), полусухожильная и икроножные мышцы.',
      steps: [
        'Лягте на скамью тренажёра так, чтобы валик находился чуть выше пяток (на ахилловом сухожилии).',
        'Плотно прижмите таз к подушке тренажёра.',
        'На выдохе плавно согните ноги, стараясь приблизить валик к ягодицам.',
        'Задержитесь на полсекунды вверху и на вдохе медленно разогните ноги.'
      ],
      tips: 'Не отрывайте таз от скамьи во время подъёма веса — лучше возьмите чуть меньший рабочий вес.'
    },
    calf_raises: {
      photoSlug: 'Standing_Calf_Raises',
      primary: ['calves'],
      secondary: [],
      muscles: 'Икроножная и камбаловидная мышцы голени.',
      steps: [
        'Встаньте носками стоп на край ступеньки или платформы тренажёра, пятки свободно свисают.',
        'На вдохе медленно опустите пятки максимально вниз до глубокого растяжения икр.',
        'На выдохе мощно поднимитесь на высокие носки и задержитесь вверху на 1–2 секунды.'
      ],
      tips: 'Икры любят полную амплитуду и паузу в верхней и нижней точках без пружинящих рывков.'
    },

    // === ПЛЕЧИ ===
    overhead_press: {
      photoSlug: 'Standing_Military_Press',
      primary: ['front_delts', 'side_delts'],
      secondary: ['triceps', 'traps', 'abs'],
      muscles: 'Передний и средний пучки дельтовидных мышц, трицепсы, верх груди, мышцы кора.',
      steps: [
        'Встаньте прямо, стопы на ширине плеч. Возьмите штангу на уровень ключиц хватом чуть шире плеч.',
        'Напрягите пресс и ягодицы, чтобы зафиксировать поясницу.',
        'На выдохе выжмите штангу строго вертикально над головой.',
        'На вдохе подконтрольно опустите гриф обратно к ключицам.'
      ],
      tips: 'Не отклоняйте корпус сильно назад — держите пресс и ягодицы каменными.'
    },
    seated_dumbbell_press: {
      photoSlug: 'Seated_Dumbbell_Press',
      primary: ['front_delts', 'side_delts'],
      secondary: ['triceps', 'traps'],
      muscles: 'Передний и средний пучки дельт, трицепсы, верх трапеций.',
      steps: [
        'Сядьте на скамью с вертикальной спинкой (80–85°), плотно прижмите поясницу.',
        'Поднимите гантели к уровню ушей, предплечья строго вертикальны.',
        'На выдохе выжмите гантели вверх над головой без соударения в верхней точке.',
        'На вдохе плавно опустите гантели до уровня подбородка/ушей.'
      ],
      tips: 'Выводите локти чуть вперёд (на 15–20° от плоскости спины) для безопасной работы плечевого сустава.'
    },
    lateral_raises: {
      photoSlug: 'Side_Lateral_Raise',
      primary: ['side_delts'],
      secondary: ['front_delts', 'traps'],
      muscles: 'Средний (боковой) пучок дельтовидных мышц — главный секрет широких плеч.',
      steps: [
        'Встаньте прямо, слегка наклоните корпус вперёд (на 5–10°), гантели по бокам бёдер.',
        'Локти слегка согнуты и зафиксированы.',
        'На выдохе поднимите руки через стороны (чуть вперёд в плоскости лопаток) до уровня плеч.',
        'На вдохе плавно опустите гантели вниз, не бросая их.'
      ],
      tips: 'Ведущая точка движения — локти, а не кисти. Не задирайте плечи к ушам, чтобы нагрузку не воровали трапеции.'
    },
    upright_row: {
      photoSlug: 'Upright_Barbell_Row',
      primary: ['side_delts', 'traps'],
      secondary: ['front_delts', 'biceps', 'forearms'],
      muscles: 'Средние дельты и верхняя часть трапециевидных мышц.',
      steps: [
        'Возьмите штангу прямым хватом на ширине плеч (широкий хват безопаснее для суставов и лучше включает дельты).',
        'На выдохе потяните гриф вдоль тела вверх до уровня низа груди, направляя локти в стороны-вверх.',
        'Локти всегда должны находиться выше кистей.',
        'На вдохе плавно опустите штангу в исходное положение.'
      ],
      tips: 'Не беритесь слишком узким хватом и не тяните гриф выше уровня груди, чтобы избежать импинджмента плеча.'
    },
    rear_delt_fly: {
      photoSlug: 'Reverse_Flyes',
      primary: ['rear_delts'],
      secondary: ['traps', 'lats'],
      muscles: 'Задний пучок дельтовидных мышц, ромбовидные и средние трапеции.',
      steps: [
        'Наклоните корпус вперёд почти до параллели с полом (или лягте грудью на наклонную скамью).',
        'Опустите руки с гантелями вниз, слегка согнув локти.',
        'На выдохе разведите руки в стороны по широкой дуге, ведя локти вверх.',
        'На вдохе плавно верните гантели в исходное положение.'
      ],
      tips: 'Старайтесь не сводить лопатки в начале движения — отводите именно плечевую кость, чтобы прицельно включить заднюю дельту.'
    },

    // === РУКИ ===
    barbell_curl: {
      photoSlug: 'Barbell_Curl',
      primary: ['biceps'],
      secondary: ['forearms'],
      muscles: 'Двуглавая мышца плеча (бицепс — обе головки), плечевая мышца, предплечья.',
      steps: [
        'Встаньте ровно, возьмите штангу хватом снизу на ширине плеч.',
        'Прижмите локти к бокам туловища.',
        'На выдохе согните руки и поднимите штангу до уровня верха груди, мощно сократив бицепс.',
        'На вдохе медленно (2–3 секунды) опустите штангу вниз.'
      ],
      tips: 'Не помогайте себе раскачкой корпуса и поясницы — двигаются только предплечья.'
    },
    hammer_curls: {
      photoSlug: 'Hammer_Curls',
      primary: ['biceps', 'forearms'],
      secondary: [],
      muscles: 'Плечевая мышца (брахиалис), плечелучевая мышца предплечья и длинная головка бицепса.',
      steps: [
        'Встаньте прямо, держите гантели вдоль корпуса нейтральным хватом (ладони смотрят друг на друга).',
        'Локти неподвижно зафиксированы у боков.',
        'На выдохе поднимите гантели к плечам, не разворачивая кисти.',
        'На вдохе подконтрольно опустите гантели вниз.'
      ],
      tips: '«Молотки» придают рукам визуальную толщину и мощно укрепляют хват и предплечья.'
    },
    french_press: {
      photoSlug: 'Lying_Triceps_Press',
      primary: ['triceps'],
      secondary: ['forearms'],
      muscles: 'Трёхглавая мышца плеча (трицепс — особенно длинная и медиальная головки).',
      steps: [
        'Лягте на скамью и выжмите EZ-штангу над грудью, затем слегка отведите прямые руки назад за голову (~10–15°).',
        'Зафиксируйте плечевые кости неподвижно.',
        'На вдохе плавно согните руки в локтях, опуская гриф ко лбу или чуть за макушку.',
        'На выдохе разогните руки за счёт изолированного усилия трицепсов.'
      ],
      tips: 'Не разводите локти широко в стороны. Небольшой наклон плеч назад к голове держит трицепс в постоянном натяжении.'
    },
    cable_tricep_pushdown: {
      photoSlug: 'Triceps_Pushdown',
      primary: ['triceps'],
      secondary: ['forearms'],
      muscles: 'Латеральная и медиальная головки трицепса.',
      steps: [
        'Встаньте перед верхним блоком, возьмите рукоять (прямую или канатную) и слегка наклоните корпус вперёд.',
        'Плотно прижмите локти к бокам корпуса.',
        'На выдохе полностью разогните руки вниз и задержитесь на 1 секунду в пиковом сокращении.',
        'На вдохе плавно поднимите предплечья до угла чуть меньше 90°.'
      ],
      tips: 'Локти должны быть «приклеены» к корпусу — если они гуляют вперёд-назад, в работу включаются спина и грудь.'
    },
    preacher_curl: {
      photoSlug: 'Preacher_Curl',
      primary: ['biceps'],
      secondary: ['forearms'],
      muscles: 'Изолированная проработка бицепса (акцент на короткую головку и пик бицепса).',
      steps: [
        'Сядьте за скамью Скотта, плотно положите трицепсы на наклонную подушку.',
        'Возьмите EZ-штангу или гантели нижним хватом.',
        'На выдохе согните руки, поднимая вес к подбородку.',
        'На вдохе плавно опустите вес, не бросая руки на излом в самом низу.'
      ],
      tips: 'Скамья Скотта полностью исключает читинг спиной. В нижней точке оставляйте едва заметный угол в локте.'
    },

    // === ПРЕСС ===
    plank: {
      photoSlug: 'Plank',
      primary: ['abs', 'obliques'],
      secondary: ['front_delts', 'glutes', 'quads'],
      muscles: 'Поперечная и прямая мышцы живота, косые мышцы, стабилизаторы позвоночника и ягодицы.',
      steps: [
        'Примите упор на предплечьях: локти строго под плечевыми суставами.',
        'Выстройте тело в идеально прямую линию от макушки до пяток.',
        'Подтяните живот и сожмите ягодицы, удерживая позицию с ровным дыханием.'
      ],
      tips: 'Не прогибайтесь в пояснице и не поднимайте таз вверх.'
    },
    crunches: {
      photoSlug: 'Crunches',
      primary: ['abs'],
      secondary: ['obliques'],
      muscles: 'Верхний и средний сегменты прямой мышцы живота.',
      steps: [
        'Лягте на спину, согните ноги в коленях, стопы на полу. Руки у висков (не сцепляйте пальцы за шеей).',
        'На выдохе плавно скрутите грудной отдел позвоночника вперёд, отрывая лопатки от коврика.',
        'Поясница при этом остаётся плотно прижатой к полу.',
        'Задержитесь вверху на секунду и на вдохе плавно вернитесь.'
      ],
      tips: 'Движение короткое — вы именно приближаете рёбра к тазу, а не садитесь с прямой спиной.'
    },
    hanging_leg_raises: {
      photoSlug: 'Hanging_Leg_Raise',
      primary: ['abs', 'obliques'],
      secondary: ['forearms', 'quads'],
      muscles: 'Прямая мышца живота (акцент на нижний отдел), косые мышцы и сгибатели бедра.',
      steps: [
        'Повисните на турнике прямым хватом без раскачивания.',
        'На выдохе поднимите ноги вверх и обязательно подкрутите таз к груди в верхней точке.',
        'На вдохе подконтрольно опустите ноги вниз.'
      ],
      tips: 'Без подкручивания таза работают только сгибатели бедра; чтобы включить пресс — округляйте таз вверх.'
    },
    cable_crunch: {
      photoSlug: 'Cable_Crunch',
      primary: ['abs'],
      secondary: ['obliques'],
      muscles: 'Прямая и косые мышцы живота с прогрессирующим отягощением.',
      steps: [
        'Встаньте на колени перед верхним блоком с канатной рукоятью, удерживая концы каната у висков.',
        'Зафиксируйте таз неподвижно.',
        'На выдохе скрутите корпус вниз, направляя локти к середине бёдер и округляя спину.',
        'На вдохе плавно разогнитесь под контролем пресса.'
      ],
      tips: 'Не садитесь ягодицами на пятки и не тяните вес руками — работайте только скручиванием позвоночника.'
    },

    // === КАРДИО ===
    treadmill: {
      photoSlug: 'Running_Treadmill',
      primary: ['quads', 'calves'],
      secondary: ['hamstrings', 'glutes', 'abs'],
      muscles: 'Сердечно-сосудистая система, икроножные мышцы, квадрицепсы, бицепс бедра, ягодицы.',
      steps: [
        'Начните с 3–5 минут спокойной ходьбы для разогрева суставов.',
        'Держите корпус прямо, взгляд вперёд, руки согнуты под 90° и свободно работают вдоль тела.',
        'Приземляйтесь мягко под центр тяжести тела, дышите ритмично.'
      ],
      tips: 'Ходьба в быстрый темп с уклоном 6–10% отлично сжигает калории без ударной нагрузки на колени.'
    },
    stationary_bike: {
      photoSlug: 'Bicycling_Stationary',
      primary: ['quads'],
      secondary: ['calves', 'hamstrings', 'glutes'],
      muscles: 'Кардио-выносливость, квадрицепсы, икры и ягодичные мышцы (безопасно для суставов).',
      steps: [
        'Отрегулируйте высоту седла на уровне тазовой кости стоя рядом с тренажёром.',
        'В нижней точке педали нога должна оставаться слегка согнутой (на 10–15°).',
        'Крутите педали плавно по кругу, удерживая ровную спину.'
      ],
      tips: 'Не ставьте слишком низкое седло, чтобы не перегружать коленные чашечки.'
    },
    rowing_machine: {
      photoSlug: 'Rowing_Stationary',
      primary: ['lats', 'quads'],
      secondary: ['glutes', 'hamstrings', 'biceps', 'rear_delts', 'abs'],
      muscles: 'Комплексное кардио на всё тело (85% мышц): ноги, спина, плечевой пояс и кор.',
      steps: [
        'Сядьте в тренажёр, закрепите стопы ремнями. Возьмите рукоять прямыми руками.',
        'Фаза толчка: сначала мощно разогните ноги, затем отклоните прямой корпус чуть назад и притяните рукоять к низу груди.',
        'Возврат: сначала выпрямите руки, наклоните корпус вперёд и затем согните колени.'
      ],
      tips: 'Запомните ритм: «Ноги — Спина — Руки» назад и «Руки — Спина — Ноги» вперёд.'
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

  // Use one short Web Audio notification; never unlock an HTML media channel.
  let audioCtx = null;
  let audioReady = Promise.resolve();
  let chimeTimeout = null;
  let chimeGeneration = 0;
  const chimeOscillators = new Set();

  function initAudio() {
    if (!settings.sound) return null;
    try {
      if ('audioSession' in navigator) {
        try {
          navigator.audioSession.type = 'transient';
        } catch (e) {
          navigator.audioSession.type = 'ambient';
        }
      }
      if (!audioCtx || audioCtx.state === 'closed') {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        audioCtx = new AudioContextClass();
        // Prepare during a user gesture without playing silent media or holding focus.
        audioReady = audioCtx.suspend().catch(() => {});
      }
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  function stopChime() {
    chimeGeneration += 1;
    clearTimeout(chimeTimeout);
    chimeTimeout = null;
    chimeOscillators.forEach((osc) => {
      try { osc.stop(); } catch (e) { /* Already ended. */ }
    });
    chimeOscillators.clear();
    if (audioCtx && audioCtx.state !== 'closed') {
      audioReady = audioCtx.suspend().catch(() => {});
    }
  }

  async function playCozyChime() {
    if (!settings.sound) return;
    stopChime();
    const generation = chimeGeneration;
    const ctx = initAudio();
    if (!ctx) return;
    try {
      await audioReady;
      if (!settings.sound || generation !== chimeGeneration) return;
      await ctx.resume();
      if (!settings.sound || generation !== chimeGeneration) return;
      const now = ctx.currentTime;
      [[659.25, 0], [880, 0.2], [1046.5, 0.4]].forEach(([freq, delay]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + delay;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.55, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        chimeOscillators.add(osc);
        osc.onended = () => {
          chimeOscillators.delete(osc);
          osc.disconnect();
          gain.disconnect();
        };
        osc.start(start);
        osc.stop(start + 0.6);
      });
      // Release the session after the one-second signal so music can recover.
      chimeTimeout = setTimeout(() => {
        if (generation === chimeGeneration) stopChime();
      }, 1100);
    } catch (e) {
      if (generation === chimeGeneration) stopChime();
    }
  }

  function triggerVibration() {
    if (!settings.vibrate) return;
    if (typeof navigator.vibrate === 'function') {
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
      FitnessData.registerCatalog(customExercises);
      FitnessData.migrate(historyData);
      if (activeWorkout) FitnessData.migrate([activeWorkout]);
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

  function normalizeExStr(s) {
    return String(s || '').trim().toLowerCase().replace(/ё/g, 'е');
  }

  function getExerciseDefinition(nameOrId) {
    if (!nameOrId) return null;
    const all = getAllExercises();
    const q = normalizeExStr(nameOrId);
    // Prioritize DEFAULT_EXERCISES so built-in IDs and guides are always found first
    const fromDefault = DEFAULT_EXERCISES.find(
      (e) => (e.id && normalizeExStr(e.id) === q) || normalizeExStr(e.name) === q
    );
    if (fromDefault) return fromDefault;
    return all.find(
      (e) => (e.id && normalizeExStr(e.id) === q) || normalizeExStr(e.name) === q
    ) || null;
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
    const target = getExerciseDefinition(exerciseName) || {name:exerciseName};
    const all = FitnessData.sessions(historyData, target).reverse();
    if (!all.length) return null;
    const latest = all[0].exercise;
    const sessions = all.filter(session => FitnessData.kind(session.exercise) === FitnessData.kind(latest) && session.exercise.equip === latest.equip);
    const lastSets = sessions[0].sets;
    const usable = sessions.flatMap(session => session.sets).filter(set => FitnessData.validSet(latest, set));
    let prText = '';
    if (usable.length) {
      if (FitnessData.kind(latest) === 'strength') {
        const best = [...usable].sort((a,b) => FitnessData.number(b.weight)-FitnessData.number(a.weight) || FitnessData.number(b.reps)-FitnessData.number(a.reps))[0];
        prText = FitnessData.setText(latest,best);
      } else if (FitnessData.kind(latest) === 'timed') prText = `${Math.max(...usable.map(set => FitnessData.number(set.durationSec)))} сек`;
      else prText = `${Math.max(...usable.map(set => FitnessData.number(set.distanceKm)))} км за отрезок`;
    }
    const strings = lastSets.map(set => FitnessData.setText(latest,set));
    return {lastSets, lastSetsRaw:lastSets, lastSetsStrings:strings, summaryInline:strings.map((text,i)=>`${i+1}) ${text}`).join(' • '), prText, lastDate:sessions[0].date, totalSessions:sessions.length, recentSessions:sessions.slice(0,10), sessions};
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
      mainContentEl.scrollTo({ top: 0, behavior: 'instant' });
    }

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
  const headerWorkoutName = document.getElementById('headerWorkoutName');

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
        const title = activeWorkout.title.trim() || 'Тренировка';
        if (headerWorkoutName) headerWorkoutName.textContent = title;
        headerWorkoutTimerChip.title = `Открыть тренировку: ${title}`;
        headerWorkoutTimerChip.setAttribute('aria-label', `${title}, ${formatted}. Открыть тренировку`);
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
  const timerMinus15Btn = document.getElementById('timerMinus15Btn');
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
    restTimer.label = 'Отдых завершён! 🔔';
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
    initAudio();
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

  timerMinus15Btn.addEventListener('click', (e) => {
    e.stopPropagation();
    adjustRestTimer(-15);
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

  function bindDetailsCard(card, modalId, label, open) {
    card.classList.add('details-card-trigger');
    card.tabIndex = 0;
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', label);
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-controls', modalId);
    card.onclick = (event) => {
      if (event.target.closest('button, a, input, select, textarea, label, [role="button"]')) return;
      open();
    };
    card.onkeydown = (event) => {
      if (event.target !== card || !['Enter', ' '].includes(event.key)) return;
      event.preventDefault(); open();
    };
  }

  function createProgramCardElement(tpl, isCustom = false, detailsMode = false) {
    const card = document.createElement('div');
    card.className = 'template-card';

    const exList = tpl.exercises || [];

    // Interactive chips: tapping any exercise chip opens its photo & anatomy guide!
    const chipsHtml = exList
      .map((ex) => `
        <button type="button" class="template-ex-chip interactive-ex-chip" data-ex-name="${ex.name}" data-ex-muscle="${ex.muscle || ''}" title="Нажмите, чтобы посмотреть технику и мышцы">
          <span>${ex.name}</span>
          <span class="chip-info-dot">ℹ️</span>
        </button>
      `)
      .join('');

    // Detailed exercise-by-exercise breakdown inside the expandable "Состав ▾" block
    const drilldownRowsHtml = exList
      .map((ex, idx) => {
        const def = getExerciseDefinition(ex.id || ex.name) || ex;
        const muscleName = ex.muscle || def.muscle || 'Мышцы';
        const equipInfo = getEquipInfo(Object.assign({}, def, ex));
        const canBW = canExerciseUseBodyweight(ex);
        const histStats = findExerciseHistoryStats(ex.name);

        const defaultR = ex.defaultReps || 10;
        const defaultW = canBW ? 0 : (ex.defaultWeight !== undefined ? ex.defaultWeight : 20);

        let planLine = '';
        if (histStats && histStats.summaryInline) {
          planLine = `<span class="tpl-ex-prev">📊 Ваш прошлый раз: <strong>${histStats.summaryInline}</strong></span>`;
        } else {
          const wLabel = canBW
            ? (defaultW > 0 ? `+${defaultW} кг` : '0 кг (свой вес)')
            : `${defaultW} кг`;
          planLine = `<span class="tpl-ex-plan">🎯 План: <strong>3 подхода × ${defaultR} повт.</strong> • Ориентир: <strong>${wLabel}</strong></span>`;
        }

        if (FitnessData.kind(ex) !== 'strength') planLine = `<span class="tpl-ex-plan">${histStats && histStats.summaryInline ? 'Прошлый раз: ' + histStats.summaryInline : FitnessData.kind(ex) === 'timed' ? 'Удержание: время в секундах' : 'Кардио: минуты и километры'}</span>`;

        return `
          <div class="tpl-drilldown-row">
            <div class="tpl-drilldown-main">
              <div class="tpl-drilldown-title-line">
                <span class="tpl-drilldown-num">${idx + 1}.</span>
                <span class="tpl-drilldown-name">${ex.name}</span>
                <button type="button" class="exercise-info-btn tpl-ex-info-btn" data-ex-name="${ex.name}" data-ex-muscle="${muscleName}" title="Фото и техника выполнения">ℹ️</button>
              </div>
              <div class="tpl-drilldown-tags">
                <span class="exercise-muscle-tag">${muscleName}</span>
                <span class="tpl-equip-mini">${equipInfo.badge}</span>
              </div>
              <div class="tpl-drilldown-meta">
                ${planLine}
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    const copyToCustomBtnHtml = !isCustom
      ? `<button type="button" class="secondary-btn small-btn copy-builtin-tpl-btn" style="width:100%; margin-top:10px;">
           📋 Скопировать в «Мои программы» (подстроить под себя)
         </button>`
      : '';

    const footerActionsHtml = isCustom
      ? `
        <button class="template-start-btn" data-tpl-id="${tpl.id}" type="button">
          Начать эту программу ➔
        </button>
        <button class="template-edit-btn" data-tpl-id="${tpl.id}" type="button" title="Редактировать программу">✏️</button>
        <button class="template-delete-btn" data-tpl-id="${tpl.id}" type="button" title="Удалить программу">🗑</button>
      `
      : `
        <button class="template-start-btn" data-tpl-id="${tpl.id}" type="button">
          Начать эту программу ➔
        </button>
      `;

    card.innerHTML = `
      <div class="template-card-header tpl-toggle-header">
        <div>
          <h3 class="template-title">${tpl.title}</h3>
          ${isCustom ? `<span class="badge" style="font-size:0.7rem; margin-top:4px; display:inline-block;">Моя программа</span>` : ''}
        </div>
      </div>
      <p class="template-desc">${tpl.desc}</p>
      <div class="template-exercises-chips">${chipsHtml}</div>

      <!-- Expandable Program Composition Breakdown -->
      <div class="template-drilldown hidden">
        <div class="tpl-drilldown-heading">
          📋 Подробный план программы (нажмите ℹ️ для фото и техники):
        </div>
        <div class="tpl-drilldown-list">
          ${drilldownRowsHtml}
        </div>
        ${copyToCustomBtnHtml}
      </div>

      <div class="template-card-footer">
        ${footerActionsHtml}
      </div>
    `;

    const toggleHeader = card.querySelector('.tpl-toggle-header');
    const drilldown = card.querySelector('.template-drilldown');
    if (detailsMode) {
      toggleHeader.remove();
      card.querySelector('.template-exercises-chips').remove();
      drilldown.classList.remove('hidden');
      card.classList.add('program-details-card');
    } else {
      // Keep the list compact; details live in a dedicated sheet.
      drilldown.remove();
      bindDetailsCard(card, 'modalProgramDetails', `Открыть программу: ${tpl.title}`, () => {
        document.getElementById('programDetailsTitle').textContent = tpl.title;
        document.getElementById('programDetailsContent').replaceChildren(createProgramCardElement(tpl, isCustom, true));
        openModal('modalProgramDetails');
      });
    }

    // Interactive exercise chips & info buttons inside the card
    card.querySelectorAll('.interactive-ex-chip, .tpl-ex-info-btn').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const exName = btn.dataset.exName;
        const def = getExerciseDefinition(exName);
        const exMuscle = btn.dataset.exMuscle || (def && def.muscle) || 'Мышцы';
        openExerciseInfoModal(exName, exMuscle);
      };
    });

    // Start workout button
    card.querySelector('.template-start-btn').onclick = () => {
      if (activeWorkout) {
        if (!confirm('Сейчас активна другая тренировка. Сбросить её и начать выбранную программу?')) {
          return;
        }
      }
      if (detailsMode) closeModal('modalProgramDetails');
      startWorkoutFromTemplate(tpl);
    };

    // Copy built-in program to "Мои программы" and open editor
    const copyBtn = card.querySelector('.copy-builtin-tpl-btn');
    if (copyBtn) {
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        editingTemplateId = null;
        if (modalTemplateHeaderTitle) modalTemplateHeaderTitle.textContent = 'Настроить программу под себя';
        newTemplateTitle.value = `${tpl.title} (моя)`;
        newTemplateDesc.value = tpl.desc || '';
        templateBuilderExercises = exList.map((ex) => {
          const def = getExerciseDefinition(ex.id || ex.name) || ex;
          return {
            id: ex.id || def.id,
            name: ex.name,
            kind: FitnessData.kind(ex),
            muscle: ex.muscle || def.muscle || 'Другое',
            equip: ex.equip || def.equip,
            canBodyweight: canExerciseUseBodyweight(ex),
            isBodyweight: !!ex.isBodyweight
          };
        });
        renderTemplateBuilderList();
        if (detailsMode) closeModal('modalProgramDetails');
        openModal('modalCreateTemplate');
      };
    }

    if (isCustom) {
      const editBtn = card.querySelector('.template-edit-btn');
      if (editBtn) {
        editBtn.onclick = () => {
          editingTemplateId = tpl.id;
          if (modalTemplateHeaderTitle) modalTemplateHeaderTitle.textContent = 'Редактировать программу';
          newTemplateTitle.value = tpl.title || '';
          newTemplateDesc.value = tpl.desc || '';
          templateBuilderExercises = exList.map((ex) => ({
            id: ex.id,
            name: ex.name,
            kind: FitnessData.kind(ex),
            muscle: ex.muscle,
            equip: ex.equip,
            canBodyweight: canExerciseUseBodyweight(ex),
            isBodyweight: !!ex.isBodyweight
          }));
          renderTemplateBuilderList();
          if (detailsMode) closeModal('modalProgramDetails');
          openModal('modalCreateTemplate');
        };
      }

      const delBtn = card.querySelector('.template-delete-btn');
      if (delBtn) {
        delBtn.onclick = () => {
          if (confirm(`Удалить программу «${tpl.title}»?`)) {
            customTemplates = customTemplates.filter((t) => t.id !== tpl.id);
            saveCustomTemplates();
            if (detailsMode) closeModal('modalProgramDetails');
            renderWorkoutHub();
          }
        };
      }
    }

    return card;
  }

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
        myTemplatesList.appendChild(createProgramCardElement(tpl, true));
      });
    }

    // 2. Built-in Program Templates (Базовые программы)
    hubTemplatesList.innerHTML = '';
    BUILTIN_TEMPLATES.forEach((tpl) => {
      hubTemplatesList.appendChild(createProgramCardElement(tpl, false));
    });
  }

  function buildSetsFromPreviousOrDefaults(exMeta, defaultWeight = 20, defaultReps = 10) {
    if (FitnessData.kind(exMeta) !== 'strength') {
      const previous = FitnessData.sessions(historyData, exMeta).filter((session) => FitnessData.kind(session.exercise) === FitnessData.kind(exMeta)).at(-1);
      const sets = previous && previous.sets.filter((set) => FitnessData.validSet(exMeta, set));
      return sets && sets.length ? sets.map((set) => ({...set, completed: false})) : [FitnessData.defaultSet(exMeta)];
    }
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
        kind: FitnessData.kind(tplEx),
        muscle: tplEx.muscle,
        equip: equip,
        canBodyweight: canBW,
        isBodyweight: isBW,
        sets: buildSetsFromPreviousOrDefaults(tplEx, tplEx.defaultWeight || 20, tplEx.defaultReps || 10)
      };
    });

    startNewWorkout(tpl.title, preloadedExercises, { id: tpl.id, custom: customTemplates.some((item) => item.id === tpl.id) });
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
        kind: FitnessData.kind(ex),
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
        kind: FitnessData.kind(ex),
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

  function startNewWorkout(customTitle = null, preloadedExercises = null, sourceTemplate = null) {
    initAudio();
    const defaultName = customTitle || `Тренировка ${new Date().toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })}`;

    activeWorkout = {
      id: 'w_' + Date.now(),
      title: defaultName,
      startTime: Date.now(),
      sourceTemplate,
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
      const measurementKind = FitnessData.kind(exItem);
      const canBW = canExerciseUseBodyweight(exItem);
      const equipInfo = getEquipInfo(exItem);
      const histStats = findExerciseHistoryStats(exItem.name);

      // Detailed set-by-set previous workout summary + all-time PR badge
      let prevSummaryHtml = '';
      if (histStats && histStats.lastSets && histStats.lastSets.length > 0) {
        const setsChips = histStats.lastSets.map((s, idx) => {
          const w = parseFloat(s.weight) || 0;
          return `${idx + 1}) ${FitnessData.setText(exItem, s)}`;
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
      const equipControlHtml = measurementKind !== 'strength' ? '' : canBW
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
              <button type="button" class="exercise-name exercise-history-link" data-ex-name="${FitnessData.escape(exItem.name)}" data-ex-muscle="${exItem.muscle}">${FitnessData.escape(exItem.name)}</button>
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
      if (measurementKind !== 'strength') {
        card.querySelector('.sets-table-header').innerHTML = `<div>№</div>${FitnessData.fields(exItem).map((field) => `<div>${field.label}</div>`).join('')}<div>Готово</div><div></div>`;
        card.querySelector('.sets-table').classList.add('typed-sets', `typed-${measurementKind}`);
        card.querySelector('.add-set-btn').textContent = measurementKind === 'cardio' ? '+ Добавить отрезок' : '+ Добавить удержание';
      }

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

        if (measurementKind !== 'strength') {
          row.innerHTML = `<div class="set-num-badge">${setIndex + 1}</div>${FitnessData.fields(exItem).map((field) => `<div class="metric-stepper"><button type="button" data-metric-step="-${field.step}" data-field="${field.key}" data-ex="${exIndex}" data-set="${setIndex}" aria-label="Уменьшить ${field.label}">−</button><input type="text" inputmode="decimal" class="metric-input" data-field="${field.key}" data-scale="${field.scale || 1}" data-ex="${exIndex}" data-set="${setIndex}" aria-label="${field.label}" value="${Math.round(FitnessData.number(set[field.key]) / (field.scale || 1) * 100) / 100}"><button type="button" data-metric-step="${field.step}" data-field="${field.key}" data-ex="${exIndex}" data-set="${setIndex}" aria-label="Увеличить ${field.label}">+</button></div>`).join('')}<button type="button" class="set-check-btn" data-ex-idx="${exIndex}" data-set-idx="${setIndex}" aria-label="Отметить подход">${set.completed ? '✓' : '○'}</button><button type="button" class="remove-set-btn" data-ex-idx="${exIndex}" data-set-idx="${setIndex}" aria-label="Удалить подход">✕</button>`;
        }
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
    document.querySelectorAll('.exercise-info-btn, .exercise-history-link').forEach((btn) => {
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

    activeExercisesList.querySelectorAll('.metric-input').forEach((input) => {
      input.onfocus = () => input.select(); input.onclick = () => input.select();
      input.oninput = () => {
        const set = activeWorkout.exercises[Number(input.dataset.ex)].sets[Number(input.dataset.set)];
        const value = FitnessData.number(input.value) * Number(input.dataset.scale);
        set[input.dataset.field] = input.dataset.field === 'durationSec' ? Math.round(value) : Math.round(value * 1000) / 1000;
        saveActiveWorkout();
      };
    });
    activeExercisesList.querySelectorAll('[data-metric-step]').forEach((button) => {
      button.onclick = () => {
        const input = button.parentElement.querySelector('input');
        input.value = Math.max(0, Math.round((FitnessData.number(input.value) + Number(button.dataset.metricStep)) * 100) / 100);
        input.oninput();
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
            currentWeight = Math.round((currentWeight + 1) * 10) / 10;
          } else {
            currentWeight = Math.max(0, Math.round((currentWeight - 1) * 10) / 10);
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
      input.onfocus = () => input.select();
      // Repeat after the tap's default caret placement (including iOS).
      input.onclick = () => input.select();
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

        if (!targetSet.completed && !FitnessData.validSet(exercise, targetSet)) {
          alert('Укажи повторения или время больше нуля, прежде чем отметить подход.'); return;
        }
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
        if (FitnessData.kind(exercise) !== 'strength') {
          exercise.sets.push({...FitnessData.defaultSet(exercise), ...(exercise.sets.at(-1) || {}), completed: false});
          saveActiveWorkout(); renderActiveWorkout(); return;
        }
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
      kind: FitnessData.kind(exercise),
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
  // 8. Exercise Info Modal Logic (Realistic Anatomical Muscle Map + Real 2-Frame Photos)
  // ==========================================================================

  const infoModalExName = document.getElementById('infoModalExName');
  const infoModalMuscleTag = document.getElementById('infoModalMuscleTag');
  const infoModalVisual = document.getElementById('infoModalVisual');
  const infoModalProgressBox = document.getElementById('infoModalProgressBox');
  const infoModalMuscles = document.getElementById('infoModalMuscles');
  const infoModalTechnique = document.getElementById('infoModalTechnique');
  const infoModalTips = document.getElementById('infoModalTips');

  let photoFrameInterval = null;

  const MUSCLE_NAMES_RU = {
    chest: 'Грудные',
    front_delts: 'Передняя дельта',
    side_delts: 'Средняя дельта',
    rear_delts: 'Задняя дельта',
    traps: 'Трапеции',
    lats: 'Широчайшие',
    lower_back: 'Разгибатели спины',
    biceps: 'Бицепс',
    triceps: 'Трицепс',
    forearms: 'Предплечья',
    abs: 'Прямая мышца живота',
    obliques: 'Косые мышцы',
    quads: 'Квадрицепсы',
    hamstrings: 'Бицепс бедра',
    glutes: 'Ягодичные',
    calves: 'Икры'
  };

  // Fallback resolver for custom user-created exercises based on name & muscle category
  function resolveExerciseGuide(name, muscle) {
    const found = getExerciseMeta(name);
    if (found && EXERCISE_GUIDES[found.id]) {
      return EXERCISE_GUIDES[found.id];
    }

    const n = normalizeExStr(name);
    const m = normalizeExStr(muscle);

    // Direct keyword matching for variations or custom exercise names
    if (n.includes('кроссовер') || n.includes('сведен')) return EXERCISE_GUIDES.cable_crossover;
    if (n.includes('наклон') && n.includes('жим')) return EXERCISE_GUIDES.incline_dumbbell_press;
    if (n.includes('разводк') && m.includes('груд')) return EXERCISE_GUIDES.dumbbell_flyes;
    if (n.includes('брусь')) return EXERCISE_GUIDES.dips_chest;
    if (n.includes('отжим')) return EXERCISE_GUIDES.pushups;
    if (n.includes('жим') && m.includes('груд')) return EXERCISE_GUIDES.bench_press;

    if (n.includes('подтяг')) return EXERCISE_GUIDES.pullups;
    if (n.includes('верхн') && n.includes('блок')) return EXERCISE_GUIDES.lat_pulldown;
    if (n.includes('горизонт') || (n.includes('блок') && m.includes('спин'))) return EXERCISE_GUIDES.seated_cable_row;
    if (n.includes('одн') && n.includes('рук') && n.includes('тяг')) return EXERCISE_GUIDES.dumbbell_row;
    if (n.includes('гиперэкст')) return EXERCISE_GUIDES.hyperextension;
    if (n.includes('румын') || n.includes('мертв')) return EXERCISE_GUIDES.romanian_deadlift;
    if (n.includes('станов')) return EXERCISE_GUIDES.deadlift;
    if (n.includes('тяг') && m.includes('спин')) return EXERCISE_GUIDES.barbell_row;

    if (n.includes('жим ногам') || n.includes('платформ')) return EXERCISE_GUIDES.leg_press;
    if (n.includes('выпад') || n.includes('болгар')) return EXERCISE_GUIDES.lunges;
    if (n.includes('разгибан') && m.includes('ног')) return EXERCISE_GUIDES.leg_extension;
    if (n.includes('сгибан') && m.includes('ног')) return EXERCISE_GUIDES.leg_curl;
    if (n.includes('икр') || n.includes('носк')) return EXERCISE_GUIDES.calf_raises;
    if (n.includes('присед')) return EXERCISE_GUIDES.squats;

    if (n.includes('махи') && (n.includes('наклон') || n.includes('задн'))) return EXERCISE_GUIDES.rear_delt_fly;
    if (n.includes('махи') || n.includes('сторон')) return EXERCISE_GUIDES.lateral_raises;
    if (n.includes('подбород')) return EXERCISE_GUIDES.upright_row;
    if (n.includes('сидя') && m.includes('плеч')) return EXERCISE_GUIDES.seated_dumbbell_press;
    if (m.includes('плеч') || n.includes('армейск')) return EXERCISE_GUIDES.overhead_press;

    if (n.includes('молот')) return EXERCISE_GUIDES.hammer_curls;
    if (n.includes('скотт')) return EXERCISE_GUIDES.preacher_curl;
    if (n.includes('француз')) return EXERCISE_GUIDES.french_press;
    if (n.includes('трицепс') || (n.includes('разгибан') && m.includes('рук'))) return EXERCISE_GUIDES.cable_tricep_pushdown;
    if (n.includes('бицепс') || m.includes('рук')) return EXERCISE_GUIDES.barbell_curl;

    if (n.includes('висе')) return EXERCISE_GUIDES.hanging_leg_raises;
    if (n.includes('планк')) return EXERCISE_GUIDES.plank;
    if (n.includes('молитв') || (n.includes('блок') && m.includes('пресс'))) return EXERCISE_GUIDES.cable_crunch;
    if (m.includes('пресс') || n.includes('скруч')) return EXERCISE_GUIDES.crunches;

    // Category-level fallback with realistic muscle highlights
    if (m.includes('груд')) return EXERCISE_GUIDES.bench_press;
    if (m.includes('спин')) return EXERCISE_GUIDES.lat_pulldown;
    if (m.includes('ног')) return EXERCISE_GUIDES.squats;
    if (m.includes('плеч')) return EXERCISE_GUIDES.seated_dumbbell_press;
    if (m.includes('рук')) return EXERCISE_GUIDES.barbell_curl;
    if (m.includes('кардио')) return EXERCISE_GUIDES.treadmill;
    return EXERCISE_GUIDES.plank;
  }

  // Renders a high-detail Front & Back Anatomical Human Body Map with glowing Primary & Secondary muscles
  function buildAnatomicalMuscleMapSvg(primaryList = [], secondaryList = []) {
    const pSet = new Set(primaryList);
    const sSet = new Set(secondaryList);

    const mClass = (id) => {
      if (pSet.has(id)) return 'muscle-group is-primary';
      if (sSet.has(id)) return 'muscle-group is-secondary';
      return 'muscle-group is-inactive';
    };

    return `
      <svg viewBox="0 0 320 248" class="anatomy-map-svg" aria-label="Анатомическая карта мышц">
        <defs>
          <linearGradient id="gradPrimaryMuscle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff5c77"/>
            <stop offset="100%" stop-color="#e11d48"/>
          </linearGradient>
          <linearGradient id="gradSecondaryMuscle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
          <linearGradient id="gradInactiveMuscle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#2e3545"/>
            <stop offset="100%" stop-color="#232834"/>
          </linearGradient>
          <linearGradient id="gradBodyBase" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1e232d"/>
            <stop offset="100%" stop-color="#171b23"/>
          </linearGradient>
          <filter id="glowPrimary" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.2" flood-color="#f43f5e" flood-opacity="0.55"/>
          </filter>
        </defs>

        <!-- Labels: СПЕРЕДИ / СЗАДИ -->
        <text x="84" y="14" text-anchor="middle" class="anatomy-view-label">СПЕРЕДИ</text>
        <text x="236" y="14" text-anchor="middle" class="anatomy-view-label">СЗАДИ</text>

        <!-- Center divider -->
        <line x1="160" y1="18" x2="160" y2="236" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3"/>

        <!-- ============================================================
             FRONT VIEW (СПЕРЕДИ) — Center X = 84
             ============================================================ -->
        <g class="anatomy-figure-front">
          <!-- Base Head, Neck, Hands, Knees, Feet Silhouette -->
          <ellipse cx="84" cy="31" rx="10.5" ry="12.5" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1.1"/>
          <path d="M79,42 L78,49 L90,49 L89,42 Z" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1"/>
          <!-- Pelvis / Hip connector -->
          <path d="M68,116 L100,116 L98,129 L84,133 L70,129 Z" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1"/>
          <!-- Knees & Shins base -->
          <ellipse cx="72" cy="176" rx="6.5" ry="5.5" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="0.9"/>
          <ellipse cx="96" cy="176" rx="6.5" ry="5.5" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="0.9"/>
          <!-- Hands & Feet -->
          <ellipse cx="42" cy="126" rx="4.5" ry="6.5" transform="rotate(12 42 126)" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1"/>
          <ellipse cx="126" cy="126" rx="4.5" ry="6.5" transform="rotate(-12 126 126)" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1"/>
          <path d="M67,225 L76,225 L77,235 L64,235 Z" rx="3" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1"/>
          <path d="M92,225 L101,225 L104,235 L91,235 Z" rx="3" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1"/>

          <!-- TRAPS (Front upper slope) -->
          <g class="${mClass('traps')}">
            <path d="M78,45 L64,51 L73,53 L79,48 Z"/>
            <path d="M90,45 L104,51 L95,53 L89,48 Z"/>
          </g>

          <!-- CHEST (Pectoralis Major — Left & Right sculpted plates) -->
          <g class="${mClass('chest')}">
            <path d="M83.5,52 L64,52 C59,56 59,68 63,74 C67,77 78,77 83.5,73 Z"/>
            <path d="M84.5,52 L104,52 C109,56 109,68 105,74 C101,77 90,77 84.5,73 Z"/>
          </g>

          <!-- SIDE DELTS (Lateral Deltoids) -->
          <g class="${mClass('side_delts')}">
            <path d="M62,51 C54,53 50,60 52,69 C54,68 58,64 61,58 Z"/>
            <path d="M106,51 C114,53 118,60 116,69 C114,68 110,64 107,58 Z"/>
          </g>

          <!-- FRONT DELTS (Anterior Deltoids) -->
          <g class="${mClass('front_delts')}">
            <path d="M64,51 C60,55 56,62 56,69 C60,70 63,66 64,58 Z"/>
            <path d="M104,51 C108,55 112,62 112,69 C108,70 105,66 104,58 Z"/>
          </g>

          <!-- BICEPS (Biceps Brachii & Brachialis) -->
          <g class="${mClass('biceps')}">
            <path d="M53,69 C49,76 47,85 49,93 C53,94 58,92 60,85 C61,78 60,72 57,69 Z"/>
            <path d="M115,69 C119,76 121,85 119,93 C115,94 110,92 108,85 C107,78 108,72 111,69 Z"/>
          </g>

          <!-- FOREARMS (Front Brachioradialis & Flexors) -->
          <g class="${mClass('forearms')}">
            <path d="M48,94 C43,101 41,111 42,120 C45,121 49,119 52,111 C55,104 56,97 54,94 Z"/>
            <path d="M120,94 C125,101 127,111 126,120 C123,121 119,119 116,111 C113,104 112,97 114,94 Z"/>
          </g>

          <!-- OBLIQUES & SERRATUS (Flanks of waist) -->
          <g class="${mClass('obliques')}">
            <path d="M63,75 C62,86 64,102 67,115 L73,115 C71,102 71,86 72,76 Z"/>
            <path d="M105,75 C106,86 104,102 101,115 L95,115 C97,102 97,86 96,76 Z"/>
          </g>

          <!-- ABS (Rectus Abdominis 6-pack + Lower Abs) -->
          <g class="${mClass('abs')}">
            <!-- Upper pair -->
            <rect x="73.5" y="75" width="9.2" height="9" rx="2.5"/>
            <rect x="85.3" y="75" width="9.2" height="9" rx="2.5"/>
            <!-- Mid pair -->
            <rect x="73.5" y="85.5" width="9.2" height="9" rx="2.5"/>
            <rect x="85.3" y="85.5" width="9.2" height="9" rx="2.5"/>
            <!-- Lower pair -->
            <rect x="74" y="96" width="8.7" height="8.5" rx="2.5"/>
            <rect x="85.3" y="96" width="8.7" height="8.5" rx="2.5"/>
            <!-- Lower abdominal V -->
            <path d="M74.5,106 L83,106 L83,116 L76.5,115 Z"/>
            <path d="M85,106 L93.5,106 L91.5,115 L85,116 Z"/>
          </g>

          <!-- QUADS (Vastus Lateralis, Rectus Femoris, Vastus Medialis) -->
          <g class="${mClass('quads')}">
            <!-- Left thigh -->
            <path d="M67,122 C60,134 59,154 64,171 C68,173 74,173 79,170 C81,155 82,138 82,126 Z"/>
            <!-- Right thigh -->
            <path d="M101,122 C108,134 109,154 104,171 C100,173 94,173 89,170 C87,155 86,138 86,126 Z"/>
          </g>

          <!-- CALVES (Front Tibialis & Gastrocnemius medial contour) -->
          <g class="${mClass('calves')}">
            <path d="M65,181 C61,193 63,210 67,224 L76,224 C79,210 79,194 77,181 Z"/>
            <path d="M103,181 C107,193 105,210 101,224 L92,224 C89,210 89,194 91,181 Z"/>
          </g>
        </g>

        <!-- ============================================================
             BACK VIEW (СЗАДИ) — Center X = 236
             ============================================================ -->
        <g class="anatomy-figure-back">
          <!-- Base Head, Neck, Hands, Knees, Feet Silhouette -->
          <ellipse cx="236" cy="31" rx="10.5" ry="12.5" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1.1"/>
          <path d="M231,42 L230,48 L242,48 L241,42 Z" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1"/>
          <!-- Knees back (popliteal) -->
          <ellipse cx="224" cy="176" rx="6" ry="5" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="0.9"/>
          <ellipse cx="248" cy="176" rx="6" ry="5" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="0.9"/>
          <!-- Hands & Feet -->
          <ellipse cx="194" cy="126" rx="4.5" ry="6.5" transform="rotate(12 194 126)" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1"/>
          <ellipse cx="278" cy="126" rx="4.5" ry="6.5" transform="rotate(-12 278 126)" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1"/>
          <path d="M219,225 L228,225 L229,235 L216,235 Z" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1"/>
          <path d="M244,225 L253,225 L256,235 L243,235 Z" fill="url(#gradBodyBase)" stroke="#394254" stroke-width="1"/>

          <!-- TRAPS (Diamond Upper, Middle & Lower Trapezius) -->
          <g class="${mClass('traps')}">
            <path d="M235.5,44 L215,51 L224,66 L235.5,84 Z"/>
            <path d="M236.5,44 L257,51 L248,66 L236.5,84 Z"/>
          </g>

          <!-- SIDE DELTS (Outer cap visible from back) -->
          <g class="${mClass('side_delts')}">
            <path d="M214,51 C206,53 202,60 204,68 C206,67 209,63 212,57 Z"/>
            <path d="M258,51 C266,53 270,60 268,68 C266,67 263,63 260,57 Z"/>
          </g>

          <!-- REAR DELTS (Posterior Deltoids) -->
          <g class="${mClass('rear_delts')}">
            <path d="M215,52 C210,56 207,62 208,68 C213,69 218,65 221,59 Z"/>
            <path d="M257,52 C262,56 265,62 264,68 C259,69 254,65 251,59 Z"/>
          </g>

          <!-- LATS (Latissimus Dorsi & Teres Major V-Taper) -->
          <g class="${mClass('lats')}">
            <path d="M223,65 L212,67 C211,80 215,94 221,106 L235,96 L235,83 Z"/>
            <path d="M249,65 L260,67 C261,80 257,94 251,106 L237,96 L237,83 Z"/>
          </g>

          <!-- LOWER BACK (Erector Spinae / Lumbar Pillars) -->
          <g class="${mClass('lower_back')}">
            <path d="M222,104 L235,96 L235,116 L221,115 Z"/>
            <path d="M250,104 L237,96 L237,116 L251,115 Z"/>
          </g>

          <!-- TRICEPS (Horseshoe Lateral & Long Heads) -->
          <g class="${mClass('triceps')}">
            <path d="M205,69 C201,76 199,85 201,93 C205,94 210,92 212,85 C213,78 212,72 209,69 Z"/>
            <path d="M267,69 C271,76 273,85 271,93 C267,94 262,92 260,85 C259,78 260,72 263,69 Z"/>
          </g>

          <!-- FOREARMS (Back Extensors) -->
          <g class="${mClass('forearms')}">
            <path d="M200,94 C195,101 193,111 194,120 C197,121 201,119 204,111 C207,104 208,97 206,94 Z"/>
            <path d="M272,94 C277,101 279,111 278,120 C275,121 271,119 268,111 C265,104 264,97 266,94 Z"/>
          </g>

          <!-- GLUTES (Gluteus Maximus & Medius) -->
          <g class="${mClass('glutes')}">
            <path d="M219,115 L235.5,116 L235.5,137 C227,139 218,136 216,127 C215,122 217,118 219,115 Z"/>
            <path d="M253,115 L236.5,116 L236.5,137 C245,139 254,136 256,127 C257,122 255,118 253,115 Z"/>
          </g>

          <!-- HAMSTRINGS (Biceps Femoris & Semitendinosus) -->
          <g class="${mClass('hamstrings')}">
            <path d="M217,136 C213,148 213,161 217,172 C222,174 228,174 232,171 C234,159 235,146 235,138 Z"/>
            <path d="M255,136 C259,148 259,161 255,172 C250,174 244,174 240,171 C238,159 237,146 237,138 Z"/>
          </g>

          <!-- CALVES (Back Gastrocnemius Diamond & Soleus) -->
          <g class="${mClass('calves')}">
            <path d="M217,181 C212,192 214,207 219,224 L228,224 C232,208 232,192 229,181 Z"/>
            <path d="M255,181 C260,192 258,207 253,224 L244,224 C240,208 240,192 243,181 Z"/>
          </g>
        </g>
      </svg>
    `;
  }

  function renderExerciseVisualAndAnatomy(name, muscle, equipInfo, guide) {
    if (photoFrameInterval) {
      clearInterval(photoFrameInterval);
      photoFrameInterval = null;
    }

    const primary = (guide && guide.primary) ? guide.primary : [];
    const secondary = (guide && guide.secondary) ? guide.secondary : [];
    const photoSlug = (guide && guide.photoSlug) ? guide.photoSlug : null;

    const primaryNames = primary.map((id) => MUSCLE_NAMES_RU[id] || id).join(', ');
    const secondaryNames = secondary.map((id) => MUSCLE_NAMES_RU[id] || id).join(', ');

    const anatomySvg = buildAnatomicalMuscleMapSvg(primary, secondary);

    const photoUrl0 = photoSlug
      ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${photoSlug}/0.jpg`
      : '';
    const photoUrl1 = photoSlug
      ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${photoSlug}/1.jpg`
      : '';

    const photoSectionHtml = photoSlug ? `
      <div class="ex-photo-showcase" id="exPhotoShowcase">
        <div class="ex-photo-frame-wrap" id="exPhotoTapArea" title="Нажмите для переключения фазы движения">
          <img id="exRealPhoto0" src="${photoUrl0}" alt="${name} — Фаза 1" class="ex-real-photo active-frame" loading="eager">
          <img id="exRealPhoto1" src="${photoUrl1}" alt="${name} — Фаза 2" class="ex-real-photo" loading="eager">
          <div class="ex-photo-phase-pill" id="exPhotoPhasePill">📸 Фаза 1/2: Исходное</div>
        </div>
      </div>
    ` : '';

    return `
      <div class="ex-rich-visual-card">
        ${photoSectionHtml}
        <div class="anatomy-map-container">
          <div class="anatomy-map-header">
            <span class="anatomy-map-title">🧬 Карта работающих мышц</span>
            <span class="anatomy-equip-tag">${equipInfo.badge}</span>
          </div>
          ${anatomySvg}
          <div class="anatomy-legend-row">
            ${primaryNames ? `<span class="anatomy-legend-item"><span class="legend-dot primary-dot"></span><strong>Основная:</strong> ${primaryNames}</span>` : ''}
            ${secondaryNames ? `<span class="anatomy-legend-item"><span class="legend-dot secondary-dot"></span><strong>Синергисты:</strong> ${secondaryNames}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  function openExerciseInfoModal(name, muscle) {
    infoModalExName.textContent = name;
    infoModalMuscleTag.textContent = muscle || 'Мышцы';

    const found = getExerciseMeta(name);
    const equipInfo = getEquipInfo(found || { name, muscle });
    const guide = resolveExerciseGuide(name, muscle);

    if (infoModalVisual) {
      infoModalVisual.innerHTML = renderExerciseVisualAndAnatomy(name, muscle, equipInfo, guide);

      // Set up 2-frame real exercise photo animation + offline graceful fallback
      const showcase = document.getElementById('exPhotoShowcase');
      const img0 = document.getElementById('exRealPhoto0');
      const img1 = document.getElementById('exRealPhoto1');
      const pill = document.getElementById('exPhotoPhasePill');
      const tapArea = document.getElementById('exPhotoTapArea');

      if (img0 && img1 && showcase) {
        let currentFrame = 0;
        let autoPlay = true;

        const setFrame = (frameIdx) => {
          currentFrame = frameIdx;
          if (currentFrame === 0) {
            img0.classList.add('active-frame');
            img1.classList.remove('active-frame');
            if (pill) pill.textContent = '📸 Фаза 1/2: Старт';
          } else {
            img0.classList.remove('active-frame');
            img1.classList.add('active-frame');
            if (pill) pill.textContent = '📸 Фаза 2/2: Пик усилия';
          }
        };

        // If offline and photo not cached yet, hide photo box cleanly so Anatomy Map takes full spotlight
        img0.onerror = () => {
          showcase.style.display = 'none';
          if (photoFrameInterval) clearInterval(photoFrameInterval);
        };

        photoFrameInterval = setInterval(() => {
          if (!autoPlay) return;
          const modalEl = document.getElementById('modalExerciseInfo');
          if (!modalEl || modalEl.classList.contains('hidden')) {
            clearInterval(photoFrameInterval);
            photoFrameInterval = null;
            return;
          }
          setFrame(currentFrame === 0 ? 1 : 0);
        }, 1450);

        if (tapArea) {
          tapArea.onclick = () => {
            autoPlay = false;
            setFrame(currentFrame === 0 ? 1 : 0);
          };
        }
      }
    }

    function updateExerciseHistory(group) {
      infoModalProgressBox.classList.remove('hidden');
      infoModalProgressBox.innerHTML = FitnessUI.history(historyData, found || {name, muscle}, group);
      const selector = document.getElementById('exerciseHistoryGroup');
      if (selector) selector.onchange = () => updateExerciseHistory(selector.value);
    }
    if (infoModalProgressBox) updateExerciseHistory();

    if (guide) {
      infoModalMuscles.textContent = guide.muscles;
      infoModalTechnique.innerHTML = guide.steps.map((s) => `<li>${s}</li>`).join('');
      infoModalTips.textContent = guide.tips;
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
      cell.setAttribute('role', 'button');
      cell.tabIndex = 0;

      const monthStr = String(calendarMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateKey = `${calendarYear}-${monthStr}-${dayStr}`;

      cell.setAttribute('aria-label', new Date(calendarYear, calendarMonth, day).toLocaleDateString('ru-RU') + (workoutDatesMap[dateKey] ? ', есть тренировка' : ''));
      cell.setAttribute('aria-pressed', String(dateKey === selectedCalendarDateStr));
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

      cell.onkeydown = (event) => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); cell.click(); } };
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
  function openWorkoutEditor(item) {
    FitnessEditor.mount(item, getAllExercises(), (updated) => {
      const next = historyData.map(workout => workout.id === updated.id ? updated : workout);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(next));
      historyData = next;
      FitnessEditor.discard();
      closeModal('modalWorkoutEditor');
      renderHome(); renderHistoryAndCalendar();
    });
    openModal('modalWorkoutEditor');
  }

  function createHistoryCardElement(item, detailsMode = false) {
    const card = document.createElement('div');
    card.className = 'history-card';

    const summary = FitnessData.summarize(item);
    const activities = FitnessData.activityText(summary);
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
        const bwTag = (FitnessData.kind(ex) === 'strength' && canExerciseUseBodyweight(ex) && ex.isBodyweight) ? ' (Свой вес)' : '';
        if (FitnessData.kind(ex) !== 'strength') {
          const activity = FitnessData.activityText(FitnessData.summarize({exercises:[ex]}));
          return `${ex.name} — ${activity.cardio || activity.timed}`;
        }
        return `${ex.name} (${completedSetsCount} подх.${bwTag})`;
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
            <span class="drilldown-set-badge">${FitnessData.kind(ex) === 'cardio' ? 'Отрезок' : FitnessData.kind(ex) === 'timed' ? 'Удержание' : 'Сет'} ${sIdx + 1}</span>
            <span class="drilldown-set-val">${FitnessData.escape(FitnessData.setText(ex, s))}</span>
            <span>✓</span>
          </div>
        `;
      }).join('');

      return `
        <div class="drilldown-ex-block">
          <div class="drilldown-ex-title">
            <button type="button" class="history-exercise-link text-link-btn" data-name="${FitnessData.escape(ex.name)}" data-muscle="${ex.muscle}">${FitnessData.escape(ex.name)}</button>
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
        </div>
      </div>

      <div class="history-stats-chips">
        <span class="history-stat-chip">⏱️ <strong>${formatTime(item.durationSec || 0)}</strong></span>
        ${summary.strengthSets ? `<span class="history-stat-chip">⚡ <strong>${summary.strengthSets}</strong> силовых подх.</span><span class="history-stat-chip">🏋️ <strong>${summary.tonnage.toLocaleString('ru-RU')}</strong> кг</span>` : ''}
        ${activities.cardio ? `<span class="history-stat-chip">Кардио: <strong>${activities.cardio}</strong></span>` : ''}
        ${activities.timed ? `<span class="history-stat-chip">Удержания: <strong>${activities.timed}</strong></span>` : ''}
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
        <button class="secondary-btn small-btn edit-workout-btn" type="button">✎ Изменить</button>
        <button class="danger-icon-btn delete-workout-btn" data-id="${item.id}" type="button" title="Удалить из истории">🗑</button>
      </div>

      <!-- Expandable Accordion Drill-Down -->
      <div class="history-drilldown hidden">
        <div style="font-size:0.8rem; font-weight:700; color:var(--accent-gold); text-transform:uppercase; margin-bottom:4px;">
          📋 Подробный журнал тренировки:
        </div>
        ${drilldownBlocksHtml}
      </div>
    `;

    const drilldown = card.querySelector('.history-drilldown');
    if (detailsMode) {
      drilldown.classList.remove('hidden');
      card.classList.add('history-details-card');
      card.querySelector('.history-title').remove();
      card.querySelector('.history-exercises-summary').remove();
    } else {
      drilldown.remove();
      bindDetailsCard(card, 'modalHistoryDetails', `Открыть тренировку: ${item.title}`, () => {
        document.getElementById('historyDetailsTitle').textContent = item.title;
        document.getElementById('historyDetailsContent').replaceChildren(createHistoryCardElement(item, true));
        openModal('modalHistoryDetails');
      });
    }

    card.querySelector('.edit-workout-btn').onclick = () => {
      if (detailsMode) closeModal('modalHistoryDetails');
      openWorkoutEditor(item);
    };
    card.querySelectorAll('.history-exercise-link').forEach(button => button.onclick = () => openExerciseInfoModal(button.dataset.name, button.dataset.muscle));

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
          kind: FitnessData.kind(ex),
          muscle: ex.muscle,
          equip: ex.equip || (isBW ? 'bodyweight' : 'barbell'),
          canBodyweight: canBW,
          isBodyweight: isBW,
          sets: ex.sets.map((s) => ({
            ...s,
            weight: s.weight,
            reps: s.reps,
            isBodyweight: isBW,
            completed: false
          }))
        };
      });

      if (detailsMode) closeModal('modalHistoryDetails');
      startNewWorkout(item.title, clonedExercises, item.sourceTemplate || null);
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
        if (detailsMode) closeModal('modalHistoryDetails');
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

  function renderAchievements() {
    const container = document.getElementById('achievementsList');
    if (!container) return;
    const achievements = CozyAchievements.evaluate(historyData);
    document.getElementById('achievementsCount').textContent = `${achievements.filter((a) => a.unlocked).length} / ${achievements.length}`;
    const earned = achievements.filter((a) => a.unlocked);
    const locked = achievements.filter((a) => !a.unlocked);
    const percent = Math.round(earned.length / achievements.length * 100);
    document.getElementById('homeAchievementsCount').textContent = `${earned.length} / ${achievements.length}`;
    document.getElementById('homeAchievementsProgressText').textContent = `Получено ${earned.length} из ${achievements.length} (${percent}%)`;
    ['homeAchievementsProgress', 'achievementsModalProgress'].forEach((id) => {
      const progress = document.getElementById(id);
      progress.max = achievements.length;
      progress.value = earned.length;
    });
    const badgeRow = (items, label) => {
      if (!items.length) return '';
      return `<span class="achievement-badge-group"><span class="achievement-badge-label">${label}</span><span class="achievement-badges">${items.slice(0, 5).map((a) => {
        const title = a.hidden && !a.unlocked ? 'Скрытое достижение' : a.title;
        const icon = FitnessUI.badge(a.hidden && !a.unlocked ? 'hidden' : a.id, !a.unlocked);
        return `<span class="achievement-badge ${a.unlocked ? 'earned' : 'locked'}" title="${title}" role="img" aria-label="${title}: ${a.unlocked ? 'получено' : 'не получено'}">${icon}</span>`;
      }).join('')}${items.length > 5 ? `<span class="achievement-badge-more">+${items.length - 5}</span>` : ''}</span></span>`;
    };
    document.getElementById('homeAchievementBadges').innerHTML = badgeRow(earned, 'Получены') + badgeRow(locked, 'Впереди');
    const nearest = locked.filter(a => !a.hidden).sort((a,b) => b.value / b.target - a.value / a.target).slice(0,3);
    document.getElementById('achievementNextGoals').innerHTML = nearest.length ? '<h4>На подходе</h4>' + nearest.map(a => `<div class="achievement-next-goal"><span>${FitnessUI.badge(a.id, true)}</span><div><strong>${a.title}</strong><small>${Math.min(a.value,a.target).toLocaleString('ru-RU')} / ${a.target.toLocaleString('ru-RU')} ${a.unit}</small></div></div>`).join('') : '<p class="feature-muted">Всё собрано. Полка просит пощады.</p>';
    container.innerHTML = [...earned, ...locked].map((a) => {
      if (a.hidden && !a.unlocked) return `<article class="achievement-card locked"><span class="achievement-icon" aria-hidden="true">${FitnessUI.badge('hidden', true)}</span><div><h4>Скрытое достижение</h4><p>Откроется, когда придёт время.</p></div></article>`;
      const value = Math.min(a.target, a.value);
      const progress = Math.round(value / a.target * 100);
      return `<article class="achievement-card ${a.unlocked ? 'earned' : 'locked'}">
        <span class="achievement-icon" aria-hidden="true">${FitnessUI.badge(a.id, !a.unlocked)}</span>
        <div class="achievement-body"><h4>${a.title} <span class="achievement-state">${a.unlocked ? 'Получено ' + new Date(a.unlockedAt).toLocaleDateString('ru-RU', {day:'numeric', month:'short', year:'numeric'}) : 'В процессе'}</span></h4>
          <p>${a.description}</p>
          ${a.unlocked ? '' : `<progress max="${a.target}" value="${value}" aria-label="${a.title}: ${progress}%"></progress><small>${value.toLocaleString('ru-RU')} / ${a.target.toLocaleString('ru-RU')} ${a.unit}</small>`}
        </div></article>`;
    }).join('');
  }

  let achievementNoticeTimeout = null;
  function showAchievementNotice(achievements) {
    if (!achievements.length) return;
    const notice = document.getElementById('achievementNotice');
    notice.textContent = '🏆 Новые достижения: ' + achievements.map((a) => a.title).join(', ');
    notice.classList.remove('hidden');
    clearTimeout(achievementNoticeTimeout);
    achievementNoticeTimeout = setTimeout(() => notice.classList.add('hidden'), 7000);
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
    renderAchievements();
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
    const vibrationSupported = typeof navigator.vibrate === 'function';
    settingVibrateToggle.disabled = !vibrationSupported;
    if (!vibrationSupported) settingVibrateToggle.checked = false;
    const vibrationHint = document.getElementById('vibrationSupportHint');
    if (vibrationHint) {
      vibrationHint.textContent = vibrationSupported
        ? 'Вибросигнал при завершении отдыха'
        : 'В этом браузере вибрация недоступна (включая Safari на iPhone)';
    }
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
    if (!settings.sound) stopChime();
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
        if (Array.isArray(data.customExercises)) FitnessData.registerCatalog(data.customExercises);
        if (data.history && Array.isArray(data.history)) {
          historyData = FitnessData.migrate(data.history);
          saveHistory();
        }
        if (data.customExercises && Array.isArray(data.customExercises)) {
          customExercises = data.customExercises;
          FitnessData.registerCatalog(customExercises);
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

  const homeAchievementsBtn = document.getElementById('homeAchievementsBtn');
  homeAchievementsBtn.addEventListener('click', () => {
    renderAchievements();
    openModal('modalAchievements');
  });
  const sheetOpeners = new Map();
  ['modalAchievements', 'modalProgramDetails', 'modalHistoryDetails', 'modalWorkoutEditor', 'modalExerciseInfo'].forEach((id) => {
    const overlay = document.getElementById(id);
    const sheet = overlay.querySelector('.modal-sheet');
    installSheetSwipe(overlay, sheet);
    overlay.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { event.preventDefault(); closeModal(id); }
      if (event.key === 'Tab') {
        const buttons = [...sheet.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex="0"]')];
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  });

  function installSheetSwipe(overlay, sheet) {
    let gesture = null;
    let rebound = null;
    const settle = () => {
      gesture = null;
      sheet.classList.remove('sheet-dragging');
      const from = sheet.style.transform || 'translateY(0px)';
      sheet.style.transform = '';
      if (sheet.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        rebound = sheet.animate([{transform: from}, {transform: 'translateY(0px)'}], {
          duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
        });
      }
    };
    sheet.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
      if (event.target.closest('button, input, select, textarea, a')) return;
      if (!event.target.closest('.sheet-header, .sheet-drag-handle')) return;
      if (modalClosures.has(overlay.id)) return;
      if (rebound) { rebound.cancel(); rebound = null; }
      gesture = {id: event.pointerId, start: event.clientY, time: performance.now(), distance: 0};
      sheet.style.animation = 'none';
      sheet.classList.add('sheet-dragging');
      sheet.setPointerCapture(event.pointerId);
    });
    sheet.addEventListener('pointermove', (event) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      gesture.distance = Math.max(0, event.clientY - gesture.start);
      sheet.style.transform = `translateY(${gesture.distance}px)`;
    });
    sheet.addEventListener('pointerup', (event) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const elapsed = Math.max(1, performance.now() - gesture.time);
      const distance = Math.max(0, event.clientY - gesture.start);
      const dismiss = distance >= 80 || (distance >= 35 && distance / elapsed > 0.5);
      if (dismiss) {
        gesture = null;
        sheet.style.transform = `translateY(${distance}px)`;
        sheet.classList.remove('sheet-dragging');
        closeModal(overlay.id);
      } else settle();
    });
    sheet.addEventListener('pointercancel', () => { if (gesture) settle(); });
    sheet.addEventListener('lostpointercapture', () => { if (gesture) settle(); });
  }

  const modalClosures = new Map();
  let modalScrollPosition = null;
  function syncModalScrollLock() {
    const isOpen = !!document.querySelector('.modal-overlay:not(.hidden)');
    if (isOpen && !modalScrollPosition) {
      modalScrollPosition = {x: window.scrollX, y: window.scrollY};
      document.body.style.setProperty('--modal-scroll-top', `-${modalScrollPosition.y}px`);
      document.body.classList.add('modal-open');
    } else if (!isOpen && modalScrollPosition) {
      const saved = modalScrollPosition;
      modalScrollPosition = null;
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('--modal-scroll-top');
      window.scrollTo({left: saved.x, top: saved.y, behavior: 'instant'});
    }
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const closing = modalClosures.get(modalId);
    if (closing) { modalClosures.delete(modalId); closing.forEach((animation) => animation.cancel()); }
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) {
      sheet.getAnimations().forEach((animation) => animation.cancel());
      sheet.classList.remove('sheet-dragging');
      sheet.style.transform = '';
      sheet.style.animation = '';
    }
    if (['modalAchievements', 'modalProgramDetails', 'modalHistoryDetails', 'modalWorkoutEditor', 'modalExerciseInfo'].includes(modalId)) sheetOpeners.set(modalId, document.activeElement);
    modal.classList.remove('hidden');
    modal.querySelectorAll('.history-details-content, .program-details-content, .achievements-modal-scroll, .workout-editor-content, .sheet-exercise-list, .exercise-info-body').forEach(content => { content.scrollTop = 0; });
    syncModalScrollLock();
    if (sheetOpeners.has(modalId)) modal.querySelector('[data-close]').focus({preventScroll: true});
  }

  function closeModal(modalId) {
    if (modalId === 'modalWorkoutEditor' && FitnessEditor.dirty()) {
      if (!confirm('Закрыть без сохранения изменений?')) return;
      FitnessEditor.discard();
    }
    const modal = document.getElementById(modalId);
    if (!modal || modal.classList.contains('hidden') || modalClosures.has(modalId)) return;
    const sheet = modal.querySelector('.modal-sheet');
    const finish = () => {
      modal.classList.add('hidden');
      modalClosures.delete(modalId);
      if (sheet) { sheet.style.transform = ''; sheet.classList.remove('sheet-dragging'); }
      syncModalScrollLock();
      const opener = sheetOpeners.get(modalId);
      if (!document.querySelector('.modal-overlay:not(.hidden)') && opener && opener.isConnected) opener.focus({preventScroll: true});
      sheetOpeners.delete(modalId);
    };
    if (!sheet || !sheet.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    // Continue from the finger's last position, then hide only after leaving the screen.
    const from = getComputedStyle(sheet).transform;
    sheet.style.animation = 'none';
    const travel = Math.max(sheet.getBoundingClientRect().height, window.innerHeight - sheet.getBoundingClientRect().top) + 40;
    const slide = sheet.animate([{transform: from}, {transform: `translateY(${travel}px)`}], {
      duration: 300, easing: 'cubic-bezier(0.32, 0, 0.67, 0)', fill: 'forwards'
    });
    const fade = modal.animate([{opacity: 1}, {opacity: 0}], {duration: 300, easing: 'ease-in', fill: 'forwards'});
    const animations = [slide, fade];
    modalClosures.set(modalId, animations);
    Promise.all(animations.map((animation) => animation.finished)).then(() => {
      if (modalClosures.get(modalId) !== animations) return;
      finish();
      animations.forEach((animation) => animation.cancel());
    }).catch(() => {});
  }

  document.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', () => {
      const targetId = el.getAttribute('data-close');
      closeModal(targetId);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    let touchX = 0, touchY = 0, touchAxis = null;
    let backdropPointer = null;
    let ignoreBackdropClickUntil = 0;
    overlay.addEventListener('pointerdown', (event) => {
      backdropPointer = event.target === overlay ? {x: event.clientX, y: event.clientY} : null;
      if (backdropPointer) ignoreBackdropClickUntil = 0;
    });
    overlay.addEventListener('pointermove', (event) => {
      if (backdropPointer && Math.hypot(event.clientX - backdropPointer.x, event.clientY - backdropPointer.y) > 8) {
        ignoreBackdropClickUntil = performance.now() + 500;
      }
    });
    overlay.addEventListener('pointercancel', () => { ignoreBackdropClickUntil = performance.now() + 500; });
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay && performance.now() >= ignoreBackdropClickUntil) closeModal(overlay.id);
    });
    overlay.addEventListener('touchstart', (event) => {
      if (event.touches.length === 1) {
        touchX = event.touches[0].clientX;
        touchY = event.touches[0].clientY;
        touchAxis = null;
      }
    }, {passive: true});
    overlay.addEventListener('touchmove', (event) => {
      if (event.touches.length !== 1) return;
      const nextX = event.touches[0].clientX, nextY = event.touches[0].clientY;
      const dx = nextX - touchX, dy = nextY - touchY;
      if (!touchAxis) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 4) return;
        touchAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      touchX = nextX; touchY = nextY;
      const horizontal = touchAxis === 'x';
      const delta = horizontal ? dx : dy;
      let target = event.target;
      while (target && target !== overlay) {
        const style = getComputedStyle(target);
        const overflow = horizontal ? style.overflowX : style.overflowY;
        const extent = horizontal ? target.scrollWidth : target.scrollHeight;
        const visible = horizontal ? target.clientWidth : target.clientHeight;
        const offset = horizontal ? target.scrollLeft : target.scrollTop;
        if (/(auto|scroll)/.test(overflow) && extent > visible &&
            ((delta < 0 && offset + visible < extent - 1) || (delta > 0 && offset > 0))) return;
        target = target.parentElement;
      }
      if (event.cancelable) event.preventDefault();
    }, {passive: false});
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
            kind: FitnessData.kind(ex),
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
    document.getElementById('newExerciseKind').value = newExerciseMuscle.value === 'Кардио' ? 'cardio' : 'strength';
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
      muscle: newExerciseMuscle.value,
      kind: document.getElementById('newExerciseKind').value
    };

    customExercises.push(newEx);
    FitnessData.registerCatalog([newEx]);
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

    if (activeWorkout.exercises.some(ex => ex.sets.some(set => set.completed && !FitnessData.validSet(ex, set)))) {
      alert('В отмеченных подходах не хватает повторений или времени. Проверь введённые значения.'); return;
    }
    const elapsedSec = Math.floor((Date.now() - activeWorkout.startTime) / 1000);
    const summary = FitnessData.summarize(activeWorkout);
    const activities = FitnessData.activityText(summary);
    if (summary.completedEntries === 0) {
      alert('Отметьте галочкой (✓) хотя бы один выполненный подход перед сохранением тренировки.');
      return;
    }

    document.getElementById('finishTimeVal').textContent = formatTime(elapsedSec);
    document.getElementById('finishSetsVal').textContent = String(summary.strengthSets);
    document.getElementById('finishTonnageVal').textContent = `${summary.tonnage.toLocaleString('ru-RU')} кг`;
    document.getElementById('finishStrengthStat').classList.toggle('hidden', !summary.strengthSets);
    document.getElementById('finishTonnageStat').classList.toggle('hidden', !summary.strengthSets);
    const activityBox = document.getElementById('finishActivitySummary');
    activityBox.innerHTML = (activities.cardio ? `<div class="finish-activity-row"><span>Кардио</span><strong>${activities.cardio}</strong></div>` : '') + (activities.timed ? `<div class="finish-activity-row"><span>Удержания</span><strong>${activities.timed}</strong></div>` : '');
    activityBox.classList.toggle('hidden', !activities.cardio && !activities.timed);
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
    if (activeWorkout.exercises.some(ex => ex.sets.some(set => set.completed && !FitnessData.validSet(ex, set)))) {
      alert('В отмеченных подходах не хватает повторений или времени. Проверь введённые значения.'); return;
    }
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
          totalTonnage += FitnessData.tonnage(ex, [set]);
        });
        return {
          id: ex.id,
          name: ex.name,
          kind: FitnessData.kind(ex),
          muscle: ex.muscle,
          equip: ex.equip || equipInfo.type,
          canBodyweight: canBW,
          isBodyweight: isBW,
          sets: completedSets
        };
      })
      .filter((ex) => ex.sets.length > 0);

    const finishedRecord = {
      id: activeWorkout.id,
      sourceTemplate: activeWorkout.sourceTemplate || null,
      title: activeWorkout.title,
      date: new Date().toISOString(),
      durationSec: elapsedSec,
      tonnage: Math.round(totalTonnage),
      totalSets: totalCompletedSets,
      exercises: cleanedExercises,
      notes: document.getElementById('finishWorkoutNotes').value.trim()
    };

    FitnessData.recalculate(finishedRecord);
    const previouslyEarned = new Set(CozyAchievements.evaluate(historyData).filter((a) => a.unlocked).map((a) => a.id));
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
    const newlyEarned = CozyAchievements.evaluate(historyData).filter((a) => a.unlocked && !previouslyEarned.has(a.id));
    showAchievementNotice(newlyEarned);
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
    if (!activeWorkout && !restTimer.isRunning) return;
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
    // Let CSS size the full viewport; visualViewport may exclude the bottom
    // safe area in standalone iOS and must not shorten the app shell.
    const dynamicViewport = window.CSS && window.CSS.supports('height', '100dvh');
    document.documentElement.style.setProperty('--app-shell-height', dynamicViewport ? '100dvh' : `${window.innerHeight}px`);
  }

  function initApp() {
    syncViewportHeight();
    updateLiveCalendarTabIcon();

    window.addEventListener('resize', syncViewportHeight);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', syncViewportHeight);
    const tabBar = document.querySelector('.bottom-tab-bar');
    const syncTabHeight = () => document.documentElement.style.setProperty('--tab-bar-height', `${Math.ceil(tabBar.getBoundingClientRect().height)}px`);
    syncTabHeight();
    if ('ResizeObserver' in window) new ResizeObserver(syncTabHeight).observe(tabBar);
    const syncRestSpace = () => document.body.classList.toggle('has-rest-timer', !restTimerBar.classList.contains('hidden'));
    syncRestSpace();
    new MutationObserver(syncRestSpace).observe(restTimerBar, {attributes:true, attributeFilter:['class']});
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
        if (restTimer.isRunning) {
          tickRestTimer();
        }
        requestWakeLockIfNeeded();
      }
    });

    window.addEventListener('focus', () => {
      if (activeWorkout) startWorkoutStopwatch();
      if (restTimer.isRunning) tickRestTimer();
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
        navigator.serviceWorker.register('./sw.js?v=2.3.5').then((reg) => {
          if (reg && reg.update) reg.update();
        }).catch((err) => {
          console.warn('Service Worker registration skipped or failed:', err);
        });
      });
    }
  }

  initApp();
})();
