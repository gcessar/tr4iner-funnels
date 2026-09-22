const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const context = { window: {} }; vm.createContext(context);
for (const file of ['exercises','trainer-data','programs']) vm.runInContext(fs.readFileSync(`biblioteca/preview-hombres/${file}.js`, 'utf8'), context);
const { RutaPrograms: P, RutaTrainerData: T, RutaExerciseLibrary: L } = context.window;
test('las seis rutinas conservan todas las dosis y alternativas del entrenador', () => {
  for (const sex of ['MEN','WOMEN']) for (const frequency of [3,4,5]) for (const week of [0,1,2]) {
    const rotating = sex === 'MEN' && frequency > 3;
    const sessions = T[sex === 'MEN' ? 'men' : 'women'][rotating ? '4 & 5 DIAS' : `${frequency} DIAS`];
    const routine = P.makeRoutine(frequency, sex, week);
    assert.equal(routine.length, frequency);
    routine.forEach((day,i) => {
      const expected = sessions[rotating ? (week * frequency + i) % 3 : i];
      assert.equal(day.name, expected.name); assert.equal(day.exercises.length, expected.exercises.length);
      day.exercises.forEach((ex,n) => {
        const source = expected.exercises[n];
        for (const field of ['name','sets','reps','rest']) assert.equal(ex[field], source[field]);
        assert.deepEqual(ex.alternatives, source.alternatives);
        ex.alternativeIds.forEach((id,j) => assert.equal(L.find(e => e.id === id).name, source.alternatives[j]));
      });
    });
  }
});
test('hombres 4/5 nunca reinician empuje artificialmente el lunes', () => {
  assert.equal(P.makeRoutine(4,'MEN',1)[0].name, 'JALÓN');
  assert.equal(P.makeRoutine(5,'MEN',1)[0].name, 'PIERNAS');
  assert.equal(P.makeRoutine(5,'MEN',2)[0].name, 'JALÓN');
});
test('la importación no publica enlaces privados ni credenciales de Vimeo', () => {
  assert.doesNotMatch(JSON.stringify(T), /vimeo|reviews\/|manage\/|token/i);
});
