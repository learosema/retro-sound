---
title: Introducing retro-sound.js
layout: demo
---

`retro-sound.js` is Lea's new Web Audio Library for 8-bit style retro sounds, based on Web Audio API. It's an `npm install` away:

```sh
npm install retro-sound
```

Let's have a look how it works. As it is based on Web Audio API, first thing to do is to create a new `AudioContext`.
I also create a gain node to reduce the overall loudness a bit.

```ts
const AC = new AudioContext();
const masterVolume = AC.createGain();

masterVolume.gain.setValueAtTime(0.25, 0);
masterVolume.connect(AC.destination);
```

My library exports a `Sound` class which uses the Builder pattern to create sounds based on the four basic oscillators available in Web Audio API (triangle, singe, square and sawtooth). There are builder methods to add a couple of effects to the sound, like a modulator or a lowpass filter.

```ts
AC.resume();
const FM = new Sound(AC, 'triangle')
  .withModulator('square', 6, 600, 'detune')
  .withModulator('square', 12, 300, 'detune')
  .withFilter('lowpass', 1000)
  .toDestination(masterVolume);

FM.play('A5')
  .rampToVolumeAtTime(0, 1)
  .waitDispose();
```

There is also a `WhiteNoise` class. Combining it with a low-pass filter and changing it over time can create interesting effects like swooshes or percussions.

```ts
AC.resume();

const noise = new WhiteNoise(AC)
  .withFilter('lowpass', 10000)
  .toDestination(masterVolume);

noise.play()
  .rampFilterFreqAtTime(1000, .25)
  .rampToVolumeAtTime(0, .5).waitDispose();
```
