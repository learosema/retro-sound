import { Sound } from './retro-sound';

function $<T = HTMLElement>(sel: string, con?: HTMLElement|Document) {
	return (con ?? document).querySelector(sel) as T;
}

const AC = new AudioContext();
const masterVolume = AC.createGain();

masterVolume.gain.setValueAtTime(0.25, 0);
masterVolume.connect(AC.destination);

$('#bling').addEventListener('click', async () => {
  AC.resume();
  const FM = new Sound(AC, 'triangle')
    .withModulator('square', 6, 600, 'detune')
		.withModulator('square', 12, 300, 'detune')
    .withFilter('lowpass', 1000)
    .toDestination(masterVolume);

  await FM.play('A5').rampToVolumeAtTime(0, 1).wait();
	FM.dispose();
});


$('#ring').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'triangle')
    .withModulator('square', 12, 300, 'detune')
    .withFilter('lowpass', 400)
    .toDestination(masterVolume);

  FM.play('C5')
    .setVolumeAtTime(1, 1)
    .rampToVolumeAtTime(0, 1.25)
    .wait().then(() => FM.dispose())
});

$('#laser').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'sawtooth')
    .withModulator('triangle', 120, 100)
    .withFilter('lowpass', 1800)
    .toDestination(masterVolume);

  FM.play('C6')
    .rampToNoteAtTime('C5', .25)
    .rampToVolumeAtTime(0, .5)
    .wait().then(() => FM.dispose());
});

$('#witch').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'sawtooth')
    .withModulator('sine', 18, 150, 'detune')
    .withModulator('sine', 12, 50, 'last')
    .withFilter('lowpass', 1000)
    .withModulator('triangle', 4, 1000, 'filter')
    .toDestination(masterVolume);

  FM.play('A4', 0.0)
    .rampToVolumeAtTime(1, 0.125)
    .rampToNoteAtTime('G3', 3)
    .rampToVolumeAtTime(0, 3.5)
    .wait().then(() => FM.dispose());
});

$('#emergency').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'sine')
    .withModulator('sine', 2, 600, 'detune')
    .withFilter('lowpass', 800)
    .toDestination(masterVolume);
  FM.play('A4')
    .rampToVolumeAtTime(0,2)
    .wait().then(() => FM.dispose())
});

$('#gameover').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'sawtooth')
    .withModulator('sine', 4, 100, 'detune')
    .withFilter('lowpass', 1200)
    .toDestination(masterVolume);
  FM.play('A3')
    .rampToNoteAtTime('E2', 3)
    .rampToVolumeAtTime(0,4)
    .wait().then(() => FM.dispose());
});


$('#won').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'sawtooth')
    .withFilter('lowpass', 800)
    .toDestination(masterVolume);
  FM.play('C3')
    .setToNoteAtTime('E3', 0.25)
    .setToNoteAtTime('G3', 0.5)
    .setToNoteAtTime('C4', 0.75)
    .setVolumeAtTime(1, 1)
    .rampToVolumeAtTime(0, 2)
    .wait().then(() => FM.dispose())
});

$('#smoke').addEventListener('click', () => {
  AC.resume();
  const FM = new Sound(AC, 'sawtooth')
    .withFilter('lowpass', 600)
    .withModulator('sine', 32, 400, 'filter')
    .toDestination(masterVolume);
  FM.play('C3')
    .setVolumeAtTime(0, 0.25)
    .setToNoteAtTime('D#3', 0.5)
    .setVolumeAtTime(1, 0.5)
    .setVolumeAtTime(0, 0.75)
    .setToNoteAtTime('F3', 1)
    .setVolumeAtTime(1, 1)
    .setVolumeAtTime(1, 1.5)
    .rampToVolumeAtTime(0, 1.74)
    .setToNoteAtTime('C3', 1.75)
    .setVolumeAtTime(1, 1.75)
    .setVolumeAtTime(0, 2)
    .setToNoteAtTime('D#3', 2.25)
    .setVolumeAtTime(1, 2.25)
    .setVolumeAtTime(0, 2.5)
    .setVolumeAtTime(1, 2.75)
    .setToNoteAtTime('F#3', 2.75)
    .setVolumeAtTime(0, 2.99)
    .setVolumeAtTime(1, 3)
    .setToNoteAtTime('F3', 3)
    .setVolumeAtTime(1, 3.5)
    .rampToVolumeAtTime(0, 3.75)
    .wait().then(() => FM.dispose())
});
