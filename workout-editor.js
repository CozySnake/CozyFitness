(function(root){
  'use strict';
  const D=root.FitnessData,e=D.escape;
  let draft=null,original='',catalog=[],save=null;
  function mount(workout,exercises,onSave){
    draft=JSON.parse(JSON.stringify(workout));D.migrate([draft]);catalog=exercises;save=onSave;
    draft.exercises.forEach(ex=>ex.sets=ex.sets.filter(s=>s.completed!==false));
    original=JSON.stringify(draft);render();
  }
  function dirty(){return draft&&JSON.stringify(draft)!==original;}
  function discard(){draft=null;original='';}
  function render(){
    const container=document.getElementById('workoutEditorContent');
    const date=new Date(draft.date);const local=Number.isFinite(date.getTime())?new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16):'';
    container.innerHTML=`<label class="form-label">Название<input class="form-input" id="editWorkoutTitle" value="${e(draft.title)}"></label><div class="editor-meta"><label class="form-label">Дата и время<input class="form-input" type="datetime-local" id="editWorkoutDate" value="${local}"></label><label class="form-label">Длительность, мин<input class="form-input" type="number" min="0.1" step="0.1" id="editWorkoutDuration" value="${Math.round(D.number(draft.durationSec)/60*100)/100}"></label></div><label class="form-label">Заметка<textarea class="form-textarea" id="editWorkoutNotes">${e(draft.notes)}</textarea></label>${draft.exercises.map((ex,i)=>`<section class="editor-exercise"><div class="editor-exercise-heading"><h4>${e(ex.name)}</h4><button type="button" class="text-link-btn" data-remove-ex="${i}">Убрать</button></div>${ex.legacyMetrics?'<p class="feature-muted">В старой записи были вес и повторения. Время не угадано: укажи его сам.</p>':''}<div class="editor-sets">${ex.sets.map((set,j)=>`<div class="editor-set"><span>${j+1}</span>${D.fields(ex).map(field=>`<label>${e(field.label)}<input class="form-input" type="text" inputmode="decimal" data-ex="${i}" data-set="${j}" data-field="${field.key}" data-scale="${field.scale||1}" value="${Math.round(D.number(set[field.key])/(field.scale||1)*100)/100}"></label>`).join('')}<button class="text-link-btn" type="button" data-remove-set="${i}:${j}" aria-label="Удалить подход ${j+1}">✕</button></div>`).join('')}</div><button type="button" class="secondary-btn small-btn" data-add-set="${i}">${D.kind(ex)==='cardio'?'+ Отрезок':D.kind(ex)==='timed'?'+ Удержание':'+ Подход'}</button></section>`).join('')}<label class="form-label">Забытое упражнение<select id="editorExerciseSelect" class="form-input">${catalog.map((ex,i)=>`<option value="${i}">${e(ex.name)}</option>`).join('')}</select></label><button type="button" class="secondary-btn" id="editorAddExercise">+ Добавить упражнение</button><p id="workoutEditorError" class="editor-error" role="alert"></p><button type="button" class="primary-btn editor-save" id="editorSaveWorkout">Сохранить изменения</button>`;
    container.querySelectorAll('[data-field]').forEach(input=>{input.onfocus=()=>input.select();input.oninput=()=>{const field=input.dataset.field;let value=D.number(input.value)*Number(input.dataset.scale);if(field==='reps'||field==='durationSec')value=Math.round(value);draft.exercises[Number(input.dataset.ex)].sets[Number(input.dataset.set)][field]=value;};});
    document.getElementById('editWorkoutTitle').oninput=event=>draft.title=event.target.value;
    document.getElementById('editWorkoutDate').oninput=event=>{draft.date=event.target.value?new Date(event.target.value).toISOString():'';};
    document.getElementById('editWorkoutDuration').oninput=event=>draft.durationSec=Math.round(D.number(event.target.value)*60);
    document.getElementById('editWorkoutNotes').oninput=event=>draft.notes=event.target.value;
    container.querySelectorAll('[data-add-set]').forEach(btn=>btn.onclick=()=>{const ex=draft.exercises[Number(btn.dataset.addSet)];ex.sets.push({...D.defaultSet(ex,true),...(ex.sets.at(-1)||{}),completed:true});render();});
    container.querySelectorAll('[data-remove-set]').forEach(btn=>btn.onclick=()=>{const[i,j]=btn.dataset.removeSet.split(':').map(Number);draft.exercises[i].sets.splice(j,1);render();});
    container.querySelectorAll('[data-remove-ex]').forEach(btn=>btn.onclick=()=>{draft.exercises.splice(Number(btn.dataset.removeEx),1);render();});
    document.getElementById('editorAddExercise').onclick=()=>{const ex=catalog[Number(document.getElementById('editorExerciseSelect').value)];if(ex)draft.exercises.push({...ex,kind:D.kind(ex),sets:[D.defaultSet(ex,true)]});render();};
    document.getElementById('editorSaveWorkout').onclick=()=>{
      const error=document.getElementById('workoutEditorError');
      if(!draft.title.trim()||!Number.isFinite(new Date(draft.date).getTime())||!draft.durationSec){error.textContent='Укажи название, дату и длительность тренировки.';return;}
      if(!draft.exercises.length||draft.exercises.some(ex=>!ex.sets.length||ex.sets.some(s=>!D.validSet(ex,s)))){error.textContent='В каждом упражнении нужен хотя бы один подход с повторениями или временем больше нуля.';return;}
      const result=JSON.parse(JSON.stringify(draft));result.title=result.title.trim();result.exercises.forEach(ex=>{delete ex.legacyMetrics;ex.sets.forEach(s=>s.completed=true);});result.updatedAt=new Date().toISOString();D.recalculate(result);
      try{save(result);discard();}catch(err){error.textContent='Не удалось сохранить. Изменения остались в редакторе. Попробуй экспортировать данные и освободить место.';}
    };
  }
  root.FitnessEditor={mount,dirty,discard};
})(typeof window!=='undefined'?window:globalThis);
